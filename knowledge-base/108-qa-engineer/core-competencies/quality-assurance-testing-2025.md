# Quality Assurance & Testing 2025

**Updated**: 2025-11-23 | **Stack**: Playwright, Jest, Cypress, Postman

---

## Testing Pyramid

```
           /\          E2E Tests (10%)
          /  \         - Slow, expensive, brittle
         /    \        - Critical user flows only
        /------\       
       /        \      Integration Tests (20%)
      /          \     - Test component interactions
     /            \    - API contracts
    /--------------\   
   /                \  Unit Tests (70%)
  /                  \ - Fast, cheap, reliable
 /____________________\- Test individual functions

ANTI-PATTERN (Ice Cream Cone):
- Too many E2E tests (slow CI, flaky)
- Too few unit tests
- Result: Slow feedback, low confidence
```

---

## Unit Testing

```typescript
// sum.ts
export function sum(a: number, b: number): number {
  return a + b;
}

// sum.test.ts
import { describe, it, expect } from 'vitest';
import { sum } from './sum';

describe('sum', () => {
  it('adds two positive numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });
  
  it('adds negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
  });
  
  it('adds zero', () => {
    expect(sum(5, 0)).toBe(5);
  });
  
  it('handles decimals', () => {
    expect(sum(0.1, 0.2)).toBeCloseTo(0.3); // Floating point precision
  });
});

---

// user.service.ts
export class UserService {
  constructor(private db: Database) {}
  
  async getUser(id: string) {
    const user = await this.db.findOne('users', { id });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  
  async createUser(data: CreateUserDto) {
    // Validate email
    if (!data.email.includes('@')) {
      throw new Error('Invalid email');
    }
    
    // Check if exists
    const existing = await this.db.findOne('users', { email: data.email });
    if (existing) {
      throw new Error('Email already exists');
    }
    
    return this.db.insert('users', data);
  }
}

// user.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let mockDb: any;
  
  beforeEach(() => {
    // Mock database
    mockDb = {
      findOne: vi.fn(),
      insert: vi.fn()
    };
    userService = new UserService(mockDb);
  });
  
  describe('getUser', () => {
    it('returns user if found', async () => {
      const mockUser = { id: '1', name: 'John' };
      mockDb.findOne.mockResolvedValue(mockUser);
      
      const result = await userService.getUser('1');
      
      expect(result).toEqual(mockUser);
      expect(mockDb.findOne).toHaveBeenCalledWith('users', { id: '1' });
    });
    
    it('throws error if user not found', async () => {
      mockDb.findOne.mockResolvedValue(null);
      
      await expect(userService.getUser('999')).rejects.toThrow('User not found');
    });
  });
  
  describe('createUser', () => {
    it('creates user successfully', async () => {
      const userData = { email: 'test@example.com', name: 'John' };
      mockDb.findOne.mockResolvedValue(null); // Email doesn't exist
      mockDb.insert.mockResolvedValue({ id: '1', ...userData });
      
      const result = await userService.createUser(userData);
      
      expect(result.id).toBe('1');
      expect(mockDb.insert).toHaveBeenCalledWith('users', userData);
    });
    
    it('throws error if email invalid', async () => {
      await expect(
        userService.createUser({ email: 'invalid', name: 'John' })
      ).rejects.toThrow('Invalid email');
    });
    
    it('throws error if email exists', async () => {
      mockDb.findOne.mockResolvedValue({ id: '2', email: 'test@example.com' });
      
      await expect(
        userService.createUser({ email: 'test@example.com', name: 'John' })
      ).rejects.toThrow('Email already exists');
    });
  });
});

// Coverage: npm run test -- --coverage
// Target: >80% coverage (statements, branches, functions, lines)
```

---

## Integration Testing

```typescript
// API integration test (Supertest + Express)

import request from 'supertest';
import { app } from './app';
import { db } from './database';

describe('POST /api/users', () => {
  beforeAll(async () => {
    await db.connect();
  });
  
  afterAll(async () => {
    await db.close();
  });
  
  beforeEach(async () => {
    await db.clearTable('users');
  });
  
  it('creates user and returns 201', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        name: 'John Doe',
        password: 'password123'
      })
      .expect(201);
    
    expect(response.body).toMatchObject({
      id: expect.any(String),
      email: 'test@example.com',
      name: 'John Doe'
    });
    expect(response.body.password).toBeUndefined(); // Don't return password
    
    // Verify in database
    const user = await db.findOne('users', { email: 'test@example.com' });
    expect(user).toBeTruthy();
  });
  
  it('returns 400 if email invalid', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'invalid', name: 'John', password: 'pass' })
      .expect(400);
    
    expect(response.body.error).toContain('email');
  });
  
  it('returns 409 if email exists', async () => {
    // Create user first
    await db.insert('users', { email: 'test@example.com', name: 'Jane' });
    
    // Try to create duplicate
    await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', name: 'John', password: 'pass' })
      .expect(409);
  });
});
```

---

## E2E Testing

```typescript
// Playwright E2E test

import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test('user can register, login, and update profile', async ({ page }) => {
    // GIVEN: User is on homepage
    await page.goto('https://example.com');
    
    // WHEN: User clicks "Sign Up"
    await page.click('text=Sign Up');
    
    // THEN: Registration form is visible
    await expect(page.locator('form#register')).toBeVisible();
    
    // WHEN: User fills form and submits
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    
    await page.fill('[name=email]', email);
    await page.fill('[name=password]', 'SecurePass123!');
    await page.fill('[name=name]', 'John Doe');
    await page.click('[type=submit]');
    
    // THEN: User is redirected to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('text=Welcome, John')).toBeVisible();
    
    // WHEN: User navigates to profile
    await page.click('[data-testid=user-menu]');
    await page.click('text=Profile');
    
    // THEN: Profile page shows user info
    await expect(page.locator('[data-testid=user-email]')).toHaveText(email);
    
    // WHEN: User updates name
    await page.fill('[name=name]', 'Jane Doe');
    await page.click('text=Save Changes');
    
    // THEN: Success message appears
    await expect(page.locator('.toast-success')).toHaveText('Profile updated');
    
    // Verify name updated
    await page.reload();
    await expect(page.locator('[name=name]')).toHaveValue('Jane Doe');
  });
  
  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('https://example.com/login');
    
    await page.fill('[name=email]', 'wrong@example.com');
    await page.fill('[name=password]', 'wrongpass');
    await page.click('[type=submit]');
    
    await expect(page.locator('.error')).toHaveText('Invalid credentials');
  });
});

// Visual regression testing
test('homepage matches snapshot', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Hide dynamic content (dates, ads)
  await page.locator('.ad').evaluate(node => node.style.display = 'none');
  
  // Take screenshot
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixels: 100 // Allow minor differences
  });
});

// Run tests:
// npx playwright test
// npx playwright test --headed # See browser
// npx playwright test --debug # Debug mode
// npx playwright show-report # View HTML report
```

---

## API Testing

```javascript
// Postman / Newman collection

const collection = {
  "info": {
    "name": "User API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create User",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status is 201', () => {",
              "  pm.response.to.have.status(201);",
              "});",
              "",
              "pm.test('Returns user object', () => {",
              "  const json = pm.response.json();",
              "  pm.expect(json).to.have.property('id');",
              "  pm.expect(json.email).to.equal(pm.variables.get('email'));",
              "});",
              "",
              "// Save userId for subsequent requests",
              "pm.collectionVariables.set('userId', pm.response.json().id);"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "email": "{{email}}",
            "name": "John Doe",
            "password": "password123"
          }),
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        }
      }
    },
    {
      "name": "Get User",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status is 200', () => {",
              "  pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response time < 200ms', () => {",
              "  pm.expect(pm.response.responseTime).to.be.below(200);",
              "});",
              "",
              "pm.test('User data is correct', () => {",
              "  const json = pm.response.json();",
              "  pm.expect(json.id).to.equal(pm.collectionVariables.get('userId'));",
              "  pm.expect(json).to.not.have.property('password');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/api/users/{{userId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", "{{userId}}"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "email",
      "value": "test{{$timestamp}}@example.com"
    }
  ]
};

// Run with Newman CLI:
// newman run collection.json --environment prod.json --reporters cli,html
```

---

## Test Data Management

```typescript
// Factory pattern for test data

import { faker } from '@faker-js/faker';

export class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 80 }),
      createdAt: faker.date.past(),
      ...overrides
    };
  }
  
  static createMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

// Usage in tests:
const user = UserFactory.create({ email: 'specific@example.com' });
const users = UserFactory.createMany(10, { age: 25 });

---

// Database seeding for integration tests

export async function seedDatabase() {
  // Clear existing data
  await db.clearAll();
  
  // Seed users
  const users = UserFactory.createMany(5);
  await db.insertMany('users', users);
  
  // Seed posts (referencing users)
  const posts = users.flatMap(user =>
    PostFactory.createMany(3, { userId: user.id })
  );
  await db.insertMany('posts', posts);
  
  return { users, posts };
}

// In test:
beforeEach(async () => {
  const { users, posts } = await seedDatabase();
  // Use seeded data in tests
});
```

---

## Test Best Practices

```markdown
AAA PATTERN:

// Arrange: Set up test data & mocks
const user = { id: '1', name: 'John' };
mockDb.findOne.mockResolvedValue(user);

// Act: Execute the function under test
const result = await service.getUser('1');

// Assert: Verify the outcome
expect(result).toEqual(user);

---

TEST NAMING:

BAD:
❌ "test1"
❌ "it works"
❌ "getUser"

GOOD:
✅ "returns user when user exists"
✅ "throws error when user not found"
✅ "returns 404 when product out of stock"

FORMAT: "should [expected behavior] when [condition]"

---

ONE ASSERTION PER TEST (Ideal):

BAD (multiple concerns):
it('creates user', () => {
  const user = createUser(data);
  expect(user.id).toBeDefined();
  expect(user.email).toBe('test@example.com');
  expect(user.password).toBeUndefined();
  expect(db.insert).toHaveBeenCalled();
});

GOOD (separate tests):
it('generates user id', () => {
  const user = createUser(data);
  expect(user.id).toBeDefined();
});

it('sets email from input', () => {
  const user = createUser(data);
  expect(user.email).toBe('test@example.com');
});

it('does not return password', () => {
  const user = createUser(data);
  expect(user.password).toBeUndefined();
});

it('saves user to database', () => {
  createUser(data);
  expect(db.insert).toHaveBeenCalled();
});

---

AVOID:

❌ Testing implementation details (internal state)
✅ Test public API / behavior

❌ Brittle tests (break on minor changes)
✅ Flexible tests (test contracts, not internals)

❌ Slow tests (network calls, sleep)
✅ Fast tests (mocks, in-memory DB)

❌ Flaky tests (pass/fail randomly)
✅ Deterministic tests (same input = same output)
```

---

## Test Coverage

```bash
# Generate coverage report
npm run test -- --coverage

# Output:
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines
--------------------|---------|----------|---------|---------|----------------
user.service.ts     |   95.23 |    90.00 |  100.00 |   95.00 | 42-43
auth.service.ts     |   88.88 |    75.00 |  100.00 |   88.88 | 28,56
payment.service.ts  |   50.00 |    25.00 |   66.67 |   50.00 | 12-45
--------------------|---------|----------|---------|---------|----------------
Total               |   82.50 |    72.50 |   90.00 |   82.50 |

TARGETS:
- Statements: >80%
- Branches: >75%
- Functions: >90%
- Lines: >80%

⚠️ DON'T chase 100% coverage (diminishing returns)
✅ Focus on critical paths (auth, payment, data loss scenarios)
```

---

## CI/CD Integration

```yaml
# .github/workflows/test.yml

name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      
      - name: Run E2E tests
        run: npx playwright test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
      
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Key Takeaways

1. **Test pyramid** - Many unit, some integration, few E2E
2. **Fast feedback** - Tests should run in <5 minutes
3. **Maintainable** - Tests are code, keep them clean
4. **Deterministic** - No flaky tests (fix or delete)
5. **CI/CD** - Automate everything, block bad code

---

## References

- "Growing Object-Oriented Software, Guided by Tests" - Freeman & Pryce
- Playwright Documentation
- Testing Library Best Practices

**Related**: `test-automation.md`, `playwright-advanced.md`, `tdd-best-practices.md`
