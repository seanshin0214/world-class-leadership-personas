# Test Automation 2025: Playwright, Cypress, CI/CD

**Updated**: 2025-11-23 | **Stack**: Playwright, Cypress, Pytest, K6

---

## Framework Comparison

| Feature | Playwright | Cypress | Selenium |
|---------|-----------|---------|----------|
| Speed | ⚡⚡⚡ | ⚡⚡ | ⚡ |
| Multi-browser | ✅ Chrome, Firefox, Safari, Edge | ✅ Chrome, Firefox, Edge | ✅ All |
| Auto-wait | ✅ | ✅ | ❌ |
| Network interception | ✅ | ✅ | ❌ |
| Parallelization | ✅ Built-in | ✅ Paid | ⚠️ Grid |
| Learning curve | Medium | Easy | Hard |

**Recommendation**: Playwright for new projects (2025 standard)

---

## Playwright Best Practices

### Page Object Model

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('/login');
  await loginPage.login('user@example.com', 'password123');
  
  await expect(page).toHaveURL('/dashboard');
});
```

### Fixtures & Hooks

```typescript
// fixtures/auth.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[name=email]', process.env.TEST_EMAIL!);
    await page.fill('[name=password]', process.env.TEST_PASSWORD!);
    await page.click('button[type=submit]');
    await page.waitForURL('/dashboard');
    
    await use(page);
  }
});

// tests/dashboard.spec.ts
test('view dashboard', async ({ authenticatedPage }) => {
  // Already logged in!
  await expect(authenticatedPage.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

### Network Interception

```typescript
test('mock API response', async ({ page }) => {
  await page.route('**/api/users', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Test User' }
      ])
    });
  });
  
  await page.goto('/users');
  await expect(page.getByText('Test User')).toBeVisible();
});

test('wait for API call', async ({ page }) => {
  const responsePromise = page.waitForResponse('**/api/users');
  await page.click('button');
  const response = await responsePromise;
  
  expect(response.status()).toBe(200);
});
```

---

## Cypress Patterns

### Custom Commands

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[name=email]').type(email);
    cy.get('[name=password]').type(password);
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/dashboard');
  });
});

// cypress/e2e/dashboard.cy.ts
describe('Dashboard', () => {
  beforeEach(() => {
    cy.login('user@example.com', 'password123');
  });

  it('displays user name', () => {
    cy.visit('/dashboard');
    cy.contains('Welcome, Test User').should('be.visible');
  });
});
```

---

## API Testing (Pytest + Requests)

```python
import pytest
import requests

BASE_URL = "https://api.example.com"

@pytest.fixture
def auth_headers():
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    token = response.json()["token"]
    return {"Authorization": f"Bearer {token}"}

def test_get_users(auth_headers):
    response = requests.get(f"{BASE_URL}/users", headers=auth_headers)
    
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert "name" in response.json()[0]

def test_create_user(auth_headers):
    payload = {
        "name": "New User",
        "email": "new@example.com"
    }
    response = requests.post(f"{BASE_URL}/users", json=payload, headers=auth_headers)
    
    assert response.status_code == 201
    assert response.json()["name"] == "New User"
```

---

## Performance Testing (K6)

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up
    { duration: '1m', target: 50 },    // Stay at 50 users
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% < 500ms
    http_req_failed: ['rate<0.01'],    // <1% failures
  },
};

export default function () {
  const res = http.get('https://api.example.com/users');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

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
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npx playwright test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Test Strategy Pyramid

```
        /\
       /  \  E2E (10%)
      /────\
     /      \  Integration (30%)
    /────────\
   /          \  Unit (60%)
  /____________\

E2E: Critical user flows (login, checkout)
Integration: API contracts, component interactions
Unit: Business logic, utilities
```

---

## Key Metrics

```markdown
Test Coverage: >80% (unit), >60% (E2E)
Flakiness Rate: <2%
Execution Time: <10 min (CI)
Parallel Execution: 4-8 workers
Test-to-Code Ratio: 1:3
```

---

## References

- Playwright Documentation
- Cypress Best Practices
- "The Art of Software Testing" - Glenford Myers

**Related**: `ci-cd.md`, `test-driven-development.md`
