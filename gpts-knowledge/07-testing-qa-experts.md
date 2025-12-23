# Testing & QA Experts - Deep Knowledge Base

## World-Class Tester (501) / QA Test Engineer (502)

### Testing Strategy Framework

**Testing Pyramid**
```
                    /\
                   /  \
                  / E2E \        (10%) - Slow, expensive, realistic
                 /--------\
                /Integration\    (20%) - Medium speed, API/DB tests
               /--------------\
              /    Unit Tests   \  (70%) - Fast, isolated, many
             /--------------------\

Recommended Distribution:
- Unit Tests: 70% (fast, run on every commit)
- Integration Tests: 20% (API, database interactions)
- E2E Tests: 10% (critical user journeys only)
```

### Test Types & When to Use

**Unit Tests**
```javascript
// Example: Testing a utility function
describe('calculateDiscount', () => {
  it('should return 10% discount for orders over $100', () => {
    expect(calculateDiscount(150)).toBe(15);
  });

  it('should return 0 discount for orders under $100', () => {
    expect(calculateDiscount(50)).toBe(0);
  });

  it('should handle edge case of exactly $100', () => {
    expect(calculateDiscount(100)).toBe(10);
  });

  it('should throw error for negative amounts', () => {
    expect(() => calculateDiscount(-10)).toThrow('Invalid amount');
  });
});
```

**Integration Tests**
```javascript
// Example: Testing API endpoint
describe('POST /api/users', () => {
  beforeEach(async () => {
    await db.clear('users');
  });

  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        name: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('test@example.com');

    // Verify database
    const user = await db.users.findByEmail('test@example.com');
    expect(user).toBeDefined();
  });

  it('should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'invalid-email',
        name: 'Test User'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('email');
  });
});
```

**E2E Tests**
```javascript
// Example: Playwright E2E test
import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test('should complete registration successfully', async ({ page }) => {
    // Navigate to registration
    await page.goto('/register');

    // Fill form
    await page.fill('[data-testid="email"]', 'newuser@example.com');
    await page.fill('[data-testid="password"]', 'SecurePass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecurePass123!');

    // Submit
    await page.click('[data-testid="submit"]');

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]'))
      .toContainText('Welcome');
  });

  test('should show error for existing email', async ({ page }) => {
    await page.goto('/register');
    await page.fill('[data-testid="email"]', 'existing@example.com');
    await page.fill('[data-testid="password"]', 'SecurePass123!');
    await page.fill('[data-testid="confirm-password"]', 'SecurePass123!');
    await page.click('[data-testid="submit"]');

    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Email already registered');
  });
});
```

---

### Test Automation Best Practices

**Page Object Model (POM)**
```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
  }

  async getErrorMessage() {
    return this.page.textContent('[data-testid="error-message"]');
  }

  async isLoggedIn() {
    return this.page.isVisible('[data-testid="user-menu"]');
  }
}

// tests/login.spec.ts
test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('user@example.com', 'password123');
  expect(await loginPage.isLoggedIn()).toBe(true);
});
```

**Test Data Management**
```typescript
// fixtures/testData.ts
export const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'AdminPass123!',
    role: 'admin'
  },
  regular: {
    email: 'user@test.com',
    password: 'UserPass123!',
    role: 'user'
  },
  premium: {
    email: 'premium@test.com',
    password: 'PremiumPass123!',
    role: 'premium'
  }
};

// Factory pattern for dynamic data
export function createUser(overrides = {}) {
  return {
    email: `user_${Date.now()}@test.com`,
    password: 'TestPass123!',
    name: 'Test User',
    ...overrides
  };
}
```

---

### API Testing

**REST API Test Suite**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Products API', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    // Get auth token
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
    const body = await response.json();
    authToken = body.token;
  });

  test('GET /products - should list products', async ({ request }) => {
    const response = await request.get('/api/products', {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    expect(response.ok()).toBe(true);
    const products = await response.json();
    expect(products.data).toBeInstanceOf(Array);
    expect(products.pagination).toBeDefined();
  });

  test('POST /products - should create product', async ({ request }) => {
    const response = await request.post('/api/products', {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        name: 'Test Product',
        price: 99.99,
        category: 'electronics'
      }
    });

    expect(response.status()).toBe(201);
    const product = await response.json();
    expect(product.name).toBe('Test Product');
    expect(product.id).toBeDefined();
  });

  test('GET /products/:id - should return 404 for non-existent', async ({ request }) => {
    const response = await request.get('/api/products/non-existent-id', {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    expect(response.status()).toBe(404);
  });
});
```

---

### Performance Testing

**Load Testing with k6**
```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

export default function () {
  const response = http.get('https://api.example.com/products');

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

**Performance Metrics to Track**
```
Response Time:
- p50 (median): < 200ms
- p95: < 500ms
- p99: < 1000ms

Throughput:
- Requests per second
- Transactions per second

Error Rates:
- HTTP errors: < 0.1%
- Application errors: < 0.5%

Resource Usage:
- CPU utilization: < 70%
- Memory usage: < 80%
- Database connections: Within pool limits
```

---

### Test Planning & Documentation

**Test Plan Template**
```markdown
# Test Plan: [Feature Name]

## Objective
What are we testing and why?

## Scope
### In Scope
- Feature A functionality
- Integration with System B

### Out of Scope
- Performance testing (separate plan)
- Feature C (not affected)

## Test Strategy
| Type | Coverage | Tools |
|------|----------|-------|
| Unit | 80% code coverage | Jest |
| Integration | All API endpoints | Playwright |
| E2E | Critical paths | Playwright |

## Test Cases

### TC-001: User Login
**Preconditions**: Valid user exists
**Steps**:
1. Navigate to login page
2. Enter valid credentials
3. Click login button
**Expected**: User redirected to dashboard

### TC-002: Invalid Login
**Preconditions**: None
**Steps**:
1. Navigate to login page
2. Enter invalid credentials
3. Click login button
**Expected**: Error message displayed

## Environment
- Staging environment
- Test database with seed data

## Schedule
- Unit tests: Continuous (on commit)
- Integration: Daily
- E2E: Before release

## Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Test data issues | Medium | Reset before each run |
| Environment instability | High | Dedicated test env |
```

**Bug Report Template**
```markdown
## Bug Title
[Clear, concise description]

## Environment
- Browser: Chrome 120
- OS: Windows 11
- Environment: Staging

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Evidence
- Screenshot: [attached]
- Console logs: [attached]
- Network requests: [attached]

## Severity
- [ ] Critical (system down)
- [x] High (major feature broken)
- [ ] Medium (feature impaired)
- [ ] Low (minor issue)

## Additional Context
Any other relevant information
```

---

### CI/CD Integration

**GitHub Actions Test Workflow**
```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

### Quality Metrics

**Key QA Metrics**
```
TEST EFFECTIVENESS
- Defect Detection Rate = Defects found in testing / Total defects
- Test Coverage = Tested code / Total code
- Requirements Coverage = Tested requirements / Total requirements

PROCESS METRICS
- Test Execution Rate = Tests executed / Tests planned
- Pass Rate = Passed tests / Total tests executed
- Defect Density = Defects / KLOC (thousand lines of code)

EFFICIENCY METRICS
- Test Automation Rate = Automated tests / Total tests
- Mean Time to Detection = Time from defect introduction to discovery
- Test Cycle Time = Time to complete test cycle

QUALITY INDICATORS
- Defect Leakage = Production defects / Total defects
- Customer-Found Defects
- Regression Rate = Regression defects / Total defects
```
