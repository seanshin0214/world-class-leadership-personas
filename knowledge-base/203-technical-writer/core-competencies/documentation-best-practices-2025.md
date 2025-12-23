# Technical Writing Excellence 2025

**Updated**: 2025-11-23 | **Focus**: API Docs, Developer Experience, Docs-as-Code

---

## Why Great Docs Matter

```
BAD DOCS = Support Tickets + Developer Frustration + Churn
GREAT DOCS = Self-service + Fast Onboarding + Product Success

Stripe's secret weapon: Documentation
- 70% of developers cite docs as key factor in API adoption
- Good docs reduce support tickets by 50%
- Stripe's docs are why developers choose them over competitors
```

---

## The Documentation Hierarchy

```
1. QUICKSTART (5 minutes to first success)
   "Hello World in 60 seconds"

2. TUTORIALS (Learning-oriented)
   "Build a payment form step-by-step"

3. HOW-TO GUIDES (Problem-oriented)
   "How to handle webhooks"

4. REFERENCE (Information-oriented)
   API endpoints, parameters, responses

5. EXPLANATION (Understanding-oriented)
   Architecture, design decisions, concepts
```

---

## Quickstart That Actually Works

### Stripe Quickstart Pattern

```markdown
# Accept a Payment - 5 Minutes

## What you'll build
A simple checkout form that accepts credit card payments.

## Before you begin
- [ ] Create a Stripe account
- [ ] Get your API keys from the dashboard

## Step 1: Install the SDK

```bash
npm install stripe
```

## Step 2: Initialize Stripe

```javascript
const stripe = require('stripe')('sk_test_...');
```

## Step 3: Create a Payment Intent

```javascript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,  // $20.00
  currency: 'usd',
});
```

## Step 4: Return client secret to frontend

```javascript
res.send({
  clientSecret: paymentIntent.client_secret
});
```

## Try it out
Run the code above and you should see a `clientSecret` returned.

## Next steps
- [Add a checkout form](#)
- [Handle webhooks](#)
- [Go to production](#)
```

**Why this works**:
- ✅ Clear outcome ("accept a payment")
- ✅ Time commitment (5 minutes)
- ✅ Prerequisites listed upfront
- ✅ Copy-paste code that actually runs
- ✅ Success criteria ("you should see...")
- ✅ Clear next steps

### Anti-Pattern: Bad Quickstart

```markdown
❌ BAD:

# Introduction

Welcome to our API! Our platform provides a comprehensive suite of tools for...
[3 paragraphs of marketing copy]

## Installation

To install, use your preferred package manager to add our SDK to your project.

## Configuration

Configure the client with your credentials using the appropriate method for your framework.

PROBLEMS:
- No concrete outcome
- Vague instructions
- No runnable code
- No time estimate
```

---

## API Reference Excellence

### OpenAPI/Swagger Best Practices

```yaml
# openapi.yaml
paths:
  /users:
    post:
      summary: Create a new user
      description: |
        Creates a new user account with the provided information.
        
        **Note**: Email addresses must be unique across the platform.
        
        **Rate limit**: 100 requests per minute
        
      parameters:
        - name: api_key
          in: header
          required: true
          schema:
            type: string
          description: Your API key from the dashboard
          
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - name
              properties:
                email:
                  type: string
                  format: email
                  example: "user@example.com"
                name:
                  type: string
                  minLength: 2
                  maxLength: 100
                  example: "John Doe"
                age:
                  type: integer
                  minimum: 18
                  example: 25
                  
            examples:
              basic:
                summary: Basic user creation
                value:
                  email: "john@example.com"
                  name: "John Doe"
              complete:
                summary: User with all fields
                value:
                  email: "jane@example.com"
                  name: "Jane Smith"
                  age: 30
                  
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
              example:
                id: "usr_1234567890"
                email: "john@example.com"
                name: "John Doe"
                created_at: "2025-01-15T10:30:00Z"
                
        '400':
          description: Invalid request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              examples:
                invalid_email:
                  summary: Invalid email format
                  value:
                    error: "invalid_email"
                    message: "Email must be a valid email address"
                duplicate_email:
                  summary: Email already exists
                  value:
                    error: "duplicate_email"
                    message: "A user with this email already exists"
```

**Key elements**:
- Clear summary & description
- All parameters documented
- Multiple examples (basic + complete)
- Error responses with examples
- Rate limits mentioned
- Constraints (min/max, format)

---

## Code Examples Best Practices

### Multi-Language Examples

```markdown
# Authentication

Authenticate your requests using your API key in the Authorization header.

<CodeTabs>

<Tab title="cURL">
```bash
curl https://api.example.com/users \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe"
  }'
```
</Tab>

<Tab title="Node.js">
```javascript
const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe'
  })
});

const user = await response.json();
console.log(user);
```
</Tab>

<Tab title="Python">
```python
import requests
import os

response = requests.post(
    'https://api.example.com/users',
    headers={
        'Authorization': f'Bearer {os.getenv("API_KEY")}',
        'Content-Type': 'application/json'
    },
    json={
        'email': 'user@example.com',
        'name': 'John Doe'
    }
)

user = response.json()
print(user)
```
</Tab>

</CodeTabs>

**Response**:
```json
{
  "id": "usr_1234567890",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2025-01-15T10:30:00Z"
}
```
```

---

## Error Handling Documentation

### Good Error Docs Pattern

```markdown
# Error Handling

All errors return a consistent JSON structure:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The 'email' field is required",
    "param": "email",
    "type": "validation_error"
  }
}
```

## Common Error Codes

### `invalid_request` (400)
The request was malformed or missing required parameters.

**Example**:
```json
{
  "error": {
    "code": "invalid_request",
    "message": "Invalid email format"
  }
}
```

**How to fix**: Validate your request body matches the API specification.

### `authentication_failed` (401)
Your API key is invalid or missing.

**Example**:
```json
{
  "error": {
    "code": "authentication_failed",
    "message": "Invalid API key provided"
  }
}
```

**How to fix**: 
1. Check that your API key is correct
2. Ensure you're using the Authorization header: `Authorization: Bearer YOUR_KEY`
3. Verify your key hasn't been revoked in the dashboard

### `rate_limit_exceeded` (429)
You've exceeded the rate limit.

**Example**:
```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit of 100 requests/min exceeded",
    "retry_after": 30
  }
}
```

**How to fix**: 
- Wait for `retry_after` seconds before retrying
- Implement exponential backoff
- Consider upgrading your plan for higher limits
```

---

## Interactive Documentation

### Postman Collections

```json
{
  "info": {
    "name": "My API",
    "description": "Complete API collection with examples",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Get API Key",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"{{user_email}}\",\n  \"password\": \"{{user_password}}\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            }
          },
          "response": [],
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const response = pm.response.json();",
                  "pm.environment.set('api_key', response.api_key);"
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Changelog Best Practices

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2.1.0] - 2025-01-15

### Added
- **Bulk operations**: New `/users/bulk` endpoint for creating multiple users ([#245](link))
  ```bash
  curl -X POST /users/bulk \
    -d '{"users": [{"email": "..."}, ...]}'
  ```
- **Webhook retries**: Failed webhooks now retry automatically with exponential backoff

### Changed
- **Breaking**: `created_at` field now returns ISO 8601 format instead of Unix timestamp
  ```diff
  - "created_at": 1705305000
  + "created_at": "2025-01-15T10:30:00Z"
  ```
  **Migration guide**: Update your date parsing to handle ISO 8601 strings.

### Deprecated
- `GET /users` without pagination parameters
  - Will be removed in v3.0.0 (June 2025)
  - Use `?page=1&limit=20` instead

### Fixed
- Rate limit headers now correctly reflect remaining quota ([#289](link))
- Webhook signatures now use SHA-256 instead of MD5 for security

## [2.0.0] - 2024-12-01

### Breaking Changes
See our [Migration Guide](link) for detailed upgrade instructions.

...
```

**Elements of good changelog**:
- Clear version numbers + dates
- Categorized changes (Added, Changed, Deprecated, Fixed)
- Code examples for breaking changes
- Migration guides for major versions
- Links to relevant PRs/issues

---

## Docs-as-Code Workflow

### Documentation Pipeline

```yaml
# .github/workflows/docs.yml
name: Documentation

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - 'openapi.yaml'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint Markdown
        run: npm run lint:md
      
      - name: Check broken links
        run: npm run check-links
      
      - name: Validate OpenAPI spec
        run: npm run validate:openapi
      
      - name: Build docs site
        run: npm run docs:build
      
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## Documentation Metrics

```markdown
TRACK THESE:
1. Search queries (what are users looking for?)
2. Page views (which pages are most visited?)
3. Time on page (are they finding answers?)
4. Feedback (thumbs up/down on each page)
5. Support ticket reduction (is docs working?)

EXAMPLE DASHBOARD:

TOP SEARCHES (Last 30 days):
1. "webhook retry" - 1,250 searches → Create dedicated page
2. "rate limit" - 890 searches → Make more prominent
3. "authentication error" - 650 searches → Improve error docs

LEAST VIEWED PAGES:
- Advanced Configuration (12 views) → Remove or consolidate
- Legacy API (5 views) → Mark as deprecated

PAGES WITH MOST "👎":
- Webhook Setup (42% negative) → Rewrite with clearer examples
- Error Handling (38% negative) → Add troubleshooting section
```

---

## Style Guide Essentials

```markdown
# Writing Style

## Voice & Tone
- Active voice: "Send a POST request" not "A POST request should be sent"
- Present tense: "Returns a user object" not "Will return..."
- Second person: "You can configure..." not "Users can configure..."
- Conversational but professional

## Formatting
- **Bold** for UI elements: Click the **Save** button
- `Code font` for code, file names, API endpoints
- > Callouts for warnings, notes, tips

## Code Examples
- Always include a complete, runnable example
- Show both request and response
- Include error handling
- Use realistic data (not "foo", "bar")

## Structure
- Start with the goal: "To accept payments..."
- List prerequisites upfront
- Number sequential steps
- End with verification: "You should see..."
- Provide next steps

## Common Mistakes
❌ Avoid: "Simply do X" (condescending)
❌ Avoid: "It's easy" (not for everyone)
❌ Avoid: Unexplained jargon
❌ Avoid: "As mentioned above" (link instead)

✅ Do: Assume zero knowledge
✅ Do: Explain why, not just how
✅ Do: Show edge cases
✅ Do: Keep sentences short
```

---

## Tools Stack

**Writing**: Notion, VS Code, Markdown
**API Docs**: OpenAPI, Swagger, Redoc
**Site Generators**: Docusaurus, VitePress, Mintlify
**Screenshots**: CleanShot X, Snagit
**Diagrams**: Excalidraw, Draw.io, Mermaid
**Link Checking**: Broken Link Checker
**Search**: Algolia DocSearch, Meilisearch

---

## Key Takeaways

1. **Quickstart is critical** - 5 minutes to success or lose the developer
2. **Code examples must run** - Test every code snippet
3. **Show, don't tell** - Examples > explanations
4. **Document errors thoroughly** - Most support tickets are error-related
5. **Measure everything** - Use analytics to improve docs
6. **Keep it updated** - Stale docs worse than no docs

---

## References

- Stripe API Documentation (gold standard)
- Twilio Docs (excellent tutorials)
- "Docs for Developers" - Jared Bhatti
- Google Developer Documentation Style Guide

**Related**: `api-design.md`, `developer-experience.md`, `content-strategy.md`
