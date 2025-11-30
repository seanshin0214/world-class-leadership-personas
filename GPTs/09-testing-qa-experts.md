# Testing & QA Experts - Deep Knowledge Base

## QA Lead (501)

### Testing Strategy Framework

**Testing Pyramid:**
```
                         /\
                        /  \
                       / E2E\          10% - Slow, expensive
                      /──────\
                     /        \
                    /Integration\      20% - Medium speed
                   /──────────────\
                  /                \
                 /    Unit Tests    \   70% - Fast, cheap
                /────────────────────\
```

**Test Coverage Strategy:**
| Test Type | Scope | Speed | Cost | Coverage Target |
|-----------|-------|-------|------|-----------------|
| Unit | Function/Class | <10ms | Low | 80%+ |
| Integration | Service/API | <1s | Medium | 60%+ |
| E2E | Full flow | <30s | High | Critical paths |
| Performance | System | Minutes | High | Key metrics |
| Security | Application | Hours | High | OWASP Top 10 |

### Test Planning Template

```markdown
# Test Plan: [Feature Name]

## Scope
- In Scope: [What will be tested]
- Out of Scope: [What won't be tested]

## Test Approach
- Unit Tests: [Coverage target, tools]
- Integration Tests: [API coverage, scenarios]
- E2E Tests: [Critical user journeys]
- Performance Tests: [Load scenarios, targets]

## Environment
- Test Environment: [URL, credentials]
- Test Data: [Seed data, generators]
- Tools: [Test frameworks, CI integration]

## Entry/Exit Criteria
### Entry Criteria
- [ ] Code complete
- [ ] Unit tests passing
- [ ] Test environment ready

### Exit Criteria
- [ ] All P0 tests passing
- [ ] No P0/P1 bugs open
- [ ] Performance targets met
- [ ] Security scan passed

## Risk Assessment
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| ... | ... | ... | ... |

## Schedule
- Test Preparation: [Dates]
- Test Execution: [Dates]
- Bug Fix Window: [Dates]
- Sign-off: [Date]
```

---

## Test Automation Engineer (502)

### Automation Framework Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TEST AUTOMATION FRAMEWORK                 │
├─────────────────────────────────────────────────────────────┤
│  Test Layer                                                  │
│  ├── Test Specs (*.spec.ts)                                 │
│  ├── Test Data (fixtures, factories)                        │
│  └── Test Configuration                                     │
├─────────────────────────────────────────────────────────────┤
│  Page Object Layer                                           │
│  ├── Page Objects (LoginPage, DashboardPage)                │
│  ├── Components (Header, Modal, Form)                       │
│  └── Actions (click, fill, assert)                          │
├─────────────────────────────────────────────────────────────┤
│  Utility Layer                                               │
│  ├── API Helpers                                            │
│  ├── Database Helpers                                       │
│  └── Reporters                                              │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure                                              │
│  ├── CI/CD Integration                                      │
│  ├── Parallel Execution                                     │
│  └── Cross-browser/device                                   │
└─────────────────────────────────────────────────────────────┘
```

### Playwright E2E Test Example

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

test.describe('Authentication', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.login('user@example.com', 'password123');

    await expect(dashboardPage.welcomeMessage).toBeVisible();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.login('user@example.com', 'wrongpassword');

    await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
    await expect(loginPage.emailInput).toBeFocused();
  });

  test('should validate required fields', async () => {
    await loginPage.submitButton.click();

    await expect(loginPage.emailError).toHaveText('Email is required');
    await expect(loginPage.passwordError).toHaveText('Password is required');
  });
});

// tests/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
    this.emailError = page.getByTestId('email-error');
    this.passwordError = page.getByTestId('password-error');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### Jest Unit Test Example

```typescript
// src/utils/validation.test.ts
import { validateEmail, validatePassword, validateForm } from './validation';

describe('validateEmail', () => {
  test.each([
    ['user@example.com', true],
    ['user.name@example.co.uk', true],
    ['user+tag@example.com', true],
    ['invalid-email', false],
    ['@example.com', false],
    ['user@', false],
    ['', false],
  ])('validateEmail(%s) should return %s', (email, expected) => {
    expect(validateEmail(email)).toBe(expected);
  });
});

describe('validatePassword', () => {
  const strongPassword = 'SecurePass123!';
  const weakPassword = 'weak';

  test('should accept strong password', () => {
    const result = validatePassword(strongPassword);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject weak password with specific errors', () => {
    const result = validatePassword(weakPassword);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
    expect(result.errors).toContain('Password must contain uppercase letter');
    expect(result.errors).toContain('Password must contain a number');
  });
});

describe('validateForm', () => {
  const validForm = {
    email: 'user@example.com',
    password: 'SecurePass123!',
    name: 'John Doe',
  };

  test('should validate complete form', () => {
    const result = validateForm(validForm);
    expect(result.isValid).toBe(true);
  });

  test('should accumulate all errors', () => {
    const result = validateForm({
      email: 'invalid',
      password: 'weak',
      name: '',
    });
    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors)).toEqual(['email', 'password', 'name']);
  });
});
```

---

## Performance Tester (503)

### Performance Testing Approach

**Load Test Scenarios:**
| Scenario | Users | Duration | Purpose |
|----------|-------|----------|---------|
| Smoke | 1-5 | 1 min | Verify system works |
| Load | Expected | 30 min | Normal conditions |
| Stress | 150% capacity | 1 hour | Breaking point |
| Spike | Sudden 300% | 10 min | Traffic burst |
| Endurance | Expected | 8+ hours | Memory leaks |

### k6 Load Test Example

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Steady state
    { duration: '2m', target: 200 },  // Peak load
    { duration: '5m', target: 200 },  // Sustain peak
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    errors: ['rate<0.1'],
    login_duration: ['p(95)<1000'],
  },
};

export default function () {
  // Login
  const loginStart = Date.now();
  const loginRes = http.post('https://api.example.com/login', {
    email: 'user@example.com',
    password: 'password123',
  });
  loginDuration.add(Date.now() - loginStart);

  check(loginRes, {
    'login successful': (r) => r.status === 200,
    'has token': (r) => r.json('token') !== undefined,
  }) || errorRate.add(1);

  const token = loginRes.json('token');

  // API calls with auth
  const headers = { Authorization: `Bearer ${token}` };

  const dashboardRes = http.get('https://api.example.com/dashboard', { headers });
  check(dashboardRes, {
    'dashboard loads': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(1);
}
```

---

## API Tester (506)

### API Test Example with Supertest

```typescript
// tests/api/users.test.ts
import request from 'supertest';
import app from '../../src/app';
import { setupTestDB, teardownTestDB, createTestUser } from '../helpers';

describe('Users API', () => {
  let authToken: string;

  beforeAll(async () => {
    await setupTestDB();
    const user = await createTestUser({ role: 'admin' });
    authToken = user.token;
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe('GET /api/users', () => {
    it('should return paginated users list', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            email: expect.any(String),
            createdAt: expect.any(String),
          }),
        ]),
        pagination: {
          page: 1,
          limit: 10,
          total: expect.any(Number),
        },
      });
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });
  });

  describe('POST /api/users', () => {
    const validUser = {
      email: 'new@example.com',
      password: 'SecurePass123!',
      name: 'New User',
    };

    it('should create user with valid data', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body.email).toBe(validUser.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ field: 'email' })
      );
    });
  });
});
```

---

## Expert Activation

```
@qa-lead
@test-automation-engineer
@performance-tester
@security-tester
@api-tester
```
or describe your testing challenge
