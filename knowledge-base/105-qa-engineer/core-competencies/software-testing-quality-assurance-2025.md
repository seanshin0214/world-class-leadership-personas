# Software Testing & Quality Assurance 2025

**Updated**: 2025-11-24 | **Focus**: Test Strategies, Automation, Bug Reporting, CI/CD Integration

---

## Testing Fundamentals

```markdown
TESTING TYPES:

FUNCTIONAL TESTING (Does it work?):
- Unit testing (individual functions/methods)
- Integration testing (multiple components together)
- System testing (entire system, end-to-end)
- Acceptance testing (meets requirements, UAT)

NON-FUNCTIONAL TESTING (How well does it work?):
- Performance testing (speed, response time)
- Load testing (many users simultaneously)
- Stress testing (beyond normal capacity, breaking point)
- Security testing (vulnerabilities, penetration testing)
- Usability testing (user experience, ease of use)

---

TEST LEVELS:

UNIT TESTS:
- Scope: Single function/method
- Who: Developers
- Speed: Fast (milliseconds)
- Coverage: 70-80%+
- Example: Test `add(2, 3)` returns `5`

INTEGRATION TESTS:
- Scope: Multiple units working together
- Who: Developers + QA
- Speed: Medium (seconds)
- Coverage: Critical paths
- Example: Test API call → database → return data

E2E (End-to-End) TESTS:
- Scope: Full user workflow (UI → backend → database)
- Who: QA
- Speed: Slow (minutes)
- Coverage: Happy paths + critical scenarios
- Example: User signs up → logs in → makes purchase

---

TESTING PYRAMID:

        /\       E2E (10%) - Few, slow, brittle
       /  \      
      /____\     Integration (20%) - Medium
     /      \    
    /________\   Unit (70%) - Many, fast, stable

WHY: Fast feedback, catch bugs early (cheaper to fix)
```

---

## Manual Testing

```markdown
TEST CASE DESIGN:

TEST CASE TEMPLATE:
| ID | Title | Preconditions | Steps | Expected Result | Actual Result | Status |
|----|-------|---------------|-------|-----------------|---------------|--------|
| TC-001 | Login with valid credentials | User registered | 1. Enter email<br>2. Enter password<br>3. Click "Login" | User redirected to dashboard | (actual) | (Pass/Fail) |

BEST PRACTICES:
- One test case per scenario (don't combine)
- Clear steps (anyone can execute)
- Expected result (specific, measurable)
- Independent (order doesn't matter)

---

TEST SCENARIOS (High-level, multiple test cases):

LOGIN FEATURE:
- Positive: Valid email + password
- Negative: Invalid email, wrong password, empty fields
- Edge cases: Special characters, SQL injection, max length
- Usability: Password visibility toggle, "Remember me"

---

EXPLORATORY TESTING (Ad-hoc, no script):

APPROACH:
- Charters (guided exploration, 60-90 min sessions)
- Example: "Explore checkout flow, focus on payment errors"
- Document findings (bugs, observations, questions)

WHEN:
- New features (complement scripted tests)
- Tight deadlines (faster than writing test cases)
- Usability issues (find unexpected behaviors)

---

BOUNDARY VALUE ANALYSIS:

TECHNIQUE: Test boundaries (limits often have bugs)

EXAMPLE (Age input, valid 18-65):
- Test: 17 (invalid), 18 (valid), 19 (valid), 64 (valid), 65 (valid), 66 (invalid)
- Don't just test middle (30) - test edges!

---

EQUIVALENCE PARTITIONING:

TECHNIQUE: Divide inputs into groups (partitions)

EXAMPLE (Discount code, 10% off if spend >$50):
- Partition 1: $0-$50 (no discount)
- Partition 2: $50.01+ (10% discount)
- Test one value from each: $30, $60 (not every value)

---

STATE TRANSITION TESTING:

TECHNIQUE: Test state changes

EXAMPLE (Door lock):
- States: Locked, Unlocked
- Events: Insert key, turn key, remove key
- Test transitions: Locked → Insert key → Locked, Locked → Insert key → Turn key → Unlocked

DIAGRAM:
[Locked] --insert key--> [Key inserted] --turn key--> [Unlocked]
[Unlocked] --close door--> [Locked]
```

---

## Test Automation

```typescript
// UNIT TESTING (Jest/Vitest for JavaScript/TypeScript)

// Function to test
function add(a: number, b: number): number {
  return a + b;
}

// Test
import { describe, it, expect } from 'vitest';

describe('add function', () => {
  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
  
  it('should add two negative numbers', () => {
    expect(add(-2, -3)).toBe(-5);
  });
  
  it('should add positive and negative', () => {
    expect(add(5, -3)).toBe(2);
  });
  
  it('should handle zero', () => {
    expect(add(0, 5)).toBe(5);
  });
});

---

// MOCKING (Isolate unit tests)

import { describe, it, expect, vi } from 'vitest';

// Function that calls external API
async function getUserById(id: number) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Test with mock (don't call real API)
describe('getUserById', () => {
  it('should fetch user data', async () => {
    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ id: 1, name: 'Alice' })
      })
    ) as any;
    
    const user = await getUserById(1);
    
    expect(user).toEqual({ id: 1, name: 'Alice' });
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
  });
});

---

// E2E TESTING (Playwright)

import { test, expect } from '@playwright/test';

test.describe('Login flow', () => {
  test('should login with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    
    // Fill form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Click button
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForURL('http://localhost:3000/dashboard');
    
    // Assert redirected to dashboard
    expect(page.url()).toContain('/dashboard');
    
    // Assert welcome message
    await expect(page.locator('h1')).toContainText('Welcome');
  });
  
  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Assert error message
    await expect(page.locator('.error')).toContainText('Invalid credentials');
    
    // Assert still on login page
    expect(page.url()).toContain('/login');
  });
});

---

// API TESTING (Supertest + Jest)

import request from 'supertest';
import app from './app'; // Express app

describe('GET /api/users', () => {
  it('should return list of users', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
  });
});

describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201);
    
    expect(response.body).toMatchObject(newUser);
    expect(response.body).toHaveProperty('id');
  });
  
  it('should return 400 with missing fields', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John' }) // Missing email
      .expect(400);
    
    expect(response.body).toHaveProperty('error');
  });
});

---

// VISUAL REGRESSION TESTING (Percy, Chromatic)

import percySnapshot from '@percy/playwright';

test('homepage should match design', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Take screenshot, compare with baseline
  await percySnapshot(page, 'Homepage');
  // If pixels differ beyond threshold, test fails
});

---

// PERFORMANCE TESTING (Lighthouse CI)

// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }], // 90%+
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }], // <2s
        'interactive': ['error', { maxNumericValue: 5000 }] // <5s
      }
    }
  }
};

// Run: npm run lhci autorun
```

---

## Bug Reporting

```markdown
BUG REPORT TEMPLATE:

TITLE: Short, descriptive (e.g., "Login fails with valid credentials")

SEVERITY:
- Critical: App crashes, data loss, security breach
- High: Major feature broken, no workaround
- Medium: Feature broken, workaround exists
- Low: Cosmetic, typo, minor usability

PRIORITY:
- P0: Fix immediately (production down)
- P1: Fix in current sprint
- P2: Fix in next sprint
- P3: Backlog (fix if time)

ENVIRONMENT:
- Browser: Chrome 120.0.6099.109
- OS: Windows 11
- Device: Desktop
- URL: https://app.example.com/login
- User role: Regular user

STEPS TO REPRODUCE:
1. Navigate to https://app.example.com/login
2. Enter email: test@example.com
3. Enter password: Test123!
4. Click "Login" button

EXPECTED RESULT:
User redirected to dashboard (https://app.example.com/dashboard)

ACTUAL RESULT:
Error message displayed: "Invalid credentials"
User remains on login page

ATTACHMENTS:
- Screenshot (screenshot.png)
- Video (screen-recording.mp4)
- Console logs (console.txt)
- Network logs (network.har)

ADDITIONAL INFO:
- Issue started after deploy on 2025-01-15
- Occurs 100% of the time
- Does not occur in staging environment
- Related to ticket #1234 (login refactor)

---

ROOT CAUSE ANALYSIS (RCA):

AFTER BUG FIXED:
1. What happened? (Symptom)
2. Why did it happen? (Root cause)
3. How do we prevent it? (Action items)

EXAMPLE:
- What: Login failed for all users
- Why: Database connection pool exhausted (max 10 connections, 20 users logged in)
- Prevent:
  * Increase pool size to 50
  * Add monitoring (alert if connections >80%)
  * Add integration test (simulate 50 concurrent logins)
```

---

## Test Strategies

```markdown
SHIFT-LEFT TESTING (Test early):

TRADITIONAL:
Requirements → Design → Development → Testing (bugs found late, expensive to fix)

SHIFT-LEFT:
Requirements → Design + Testing → Development + Testing → Testing (bugs found early, cheaper)

PRACTICES:
- Review requirements (testers involved from start)
- Test-Driven Development (TDD): Write tests before code
- Automated unit tests (developers run locally)
- CI/CD (tests run on every commit)

---

RISK-BASED TESTING:

PRIORITIZE testing high-risk areas:
- High impact (payment, authentication, data loss)
- High complexity (new feature, refactored code)
- Frequently used (homepage, checkout)

LOW PRIORITY:
- Low impact (rarely used feature, cosmetic)
- Well-tested (no recent changes, no bugs)

RISK MATRIX:
| Impact / Probability | High | Medium | Low |
|----------------------|------|--------|-----|
| High                 | Critical | High | Medium |
| Medium               | High | Medium | Low |
| Low                  | Medium | Low | Low |

---

REGRESSION TESTING:

GOAL: Ensure existing features still work after changes

APPROACH:
- Full regression (all tests, time-consuming, before major release)
- Smoke tests (critical paths, quick check, every deploy)
- Selective regression (tests related to changed code)

AUTOMATION:
- Automate regression suite (run nightly, or on every commit)
- Manual for exploratory, new features

---

TEST DATA MANAGEMENT:

STRATEGIES:
- Synthetic data (generated, realistic but fake)
- Production subset (anonymized, GDPR-compliant)
- Test data as code (fixtures, factories)

EXAMPLE (Test fixtures):
```typescript
// fixtures/users.ts
export const validUser = {
  email: 'test@example.com',
  password: 'Test123!',
  name: 'Test User'
};

export const adminUser = {
  email: 'admin@example.com',
  password: 'Admin123!',
  role: 'admin'
};

// In tests
import { validUser } from './fixtures/users';

test('should login', async () => {
  await login(validUser.email, validUser.password);
  // ...
});
```

---

CI/CD INTEGRATION:

PIPELINE:
1. Commit code
2. Build (compile, bundle)
3. Lint (code style)
4. Unit tests (fast, <1 min)
5. Integration tests (medium, <5 min)
6. Deploy to staging
7. E2E tests (slow, <15 min)
8. Deploy to production (if all tests pass)

BEST PRACTICES:
- Fail fast (stop pipeline on first failure)
- Parallelize (run tests concurrently, save time)
- Test environment (identical to production)
- Flaky test quarantine (isolate unreliable tests, fix or remove)
```

---

## Test Metrics

```markdown
CODE COVERAGE:
- % of code executed by tests
- Tools: Istanbul, Jest --coverage
- Target: 80%+ (not 100%, diminishing returns)
- Caveat: High coverage ≠ good tests (can have 100% coverage with no assertions)

TEST PASS RATE:
- % of tests passing
- Target: 95%+ (some flakiness acceptable)
- Trend: Declining? Investigate (flaky tests, inadequate maintenance)

DEFECT DENSITY:
- # bugs per 1,000 lines of code
- Benchmark: <1 bug/1,000 LOC (good quality)
- Track over time (improving or degrading?)

MEAN TIME TO DETECT (MTTD):
- Time from bug introduced → detected
- Goal: Minimize (shift-left testing, frequent testing)

MEAN TIME TO RESOLVE (MTTR):
- Time from bug detected → fixed
- Goal: <24 hours (critical), <1 week (high)

ESCAPED DEFECTS:
- Bugs found in production (not caught by testing)
- Goal: Minimize (indicates gaps in test coverage)
```

---

## Key Takeaways

1. **Test early, test often** - Shift-left (cheaper to fix bugs early)
2. **Automate repetitive tests** - Unit, integration, regression (free humans for exploratory)
3. **Focus on risk** - Test high-impact, high-probability areas first
4. **Clear bug reports** - Steps to reproduce, expected vs actual (developers can fix faster)
5. **Test is not a bottleneck** - Integrate into CI/CD (fast feedback, continuous quality)

---

## References

- "Lessons Learned in Software Testing" - Cem Kaner
- "Agile Testing" - Lisa Crispin & Janet Gregory
- Playwright, Cypress, Jest, Vitest documentation

**Related**: `test-automation-frameworks.md`, `ci-cd-testing-pipeline.md`, `bug-triage-process.md`
