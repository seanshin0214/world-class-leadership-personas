# Cybersecurity Best Practices 2025

**Updated**: 2025-11-23 | **Focus**: AppSec, Cloud Security, Zero Trust

---

## OWASP Top 10 (2023)

```
1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable Components
7. Authentication Failures
8. Data Integrity Failures
9. Logging Failures
10. SSRF (Server-Side Request Forgery)
```

---

## Authentication & Authorization

### JWT Best Practices

```typescript
// ❌ BAD: Long expiration
const token = jwt.sign({ userId }, secret, { expiresIn: '30d' });

// ✅ GOOD: Short access token + refresh token
const accessToken = jwt.sign({ userId }, secret, { expiresIn: '15m' });
const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: '7d' });

// Store refresh token in httpOnly cookie
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
});
```

### OAuth 2.0 + PKCE

```typescript
// Generate code verifier & challenge
const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto
  .createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');

// Authorization request
const authUrl = `https://oauth.example.com/authorize?
  client_id=${clientId}&
  redirect_uri=${redirectUri}&
  response_type=code&
  code_challenge=${codeChallenge}&
  code_challenge_method=S256`;
```

---

## Input Validation & Sanitization

```typescript
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Validate input
const schema = z.object({
  email: z.string().email(),
  age: z.number().int().positive().max(120),
  website: z.string().url().optional()
});

const result = schema.safeParse(userInput);
if (!result.success) {
  throw new ValidationError(result.error);
}

// Sanitize HTML (prevent XSS)
const clean = DOMPurify.sanitize(userInput);

// Prevent SQL injection (use parameterized queries)
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]  // Never use string concatenation!
);
```

---

## Encryption

```python
# Hashing passwords (bcrypt)
import bcrypt

password = "user_password"
salt = bcrypt.gensalt(rounds=12)
hashed = bcrypt.hashpw(password.encode(), salt)

# Verify
if bcrypt.checkpw(password.encode(), hashed):
    print("Password correct")

# Encrypt sensitive data (Fernet)
from cryptography.fernet import Fernet

key = Fernet.generate_key()
cipher = Fernet(key)

encrypted = cipher.encrypt(b"Secret data")
decrypted = cipher.decrypt(encrypted)
```

---

## API Security

```yaml
# rate-limit.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/limit-rps: "10"
    nginx.ingress.kubernetes.io/limit-connections: "5"
```

```typescript
// API key rotation
const apiKey = crypto.randomBytes(32).toString('hex');
await db.apiKeys.create({
  key: await hashApiKey(apiKey),
  userId,
  expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
});

// Validate API key
const hashedKey = await hashApiKey(providedKey);
const apiKey = await db.apiKeys.findOne({
  key: hashedKey,
  expiresAt: { $gt: new Date() }
});
```

---

## Cloud Security

### AWS Security

```hcl
# S3 bucket security
resource "aws_s3_bucket" "app" {
  bucket = "my-app-data"
}

resource "aws_s3_bucket_public_access_block" "app" {
  bucket = aws_s3_bucket.app.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "app" {
  bucket = aws_s3_bucket.app.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "app" {
  bucket = aws_s3_bucket.app.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
```

---

## Zero Trust Architecture

```
1. VERIFY EXPLICITLY
   - Always authenticate
   - Always authorize
   - Continuous validation

2. LEAST PRIVILEGE ACCESS
   - Just-in-time access
   - Just-enough access
   - Risk-based adaptive policies

3. ASSUME BREACH
   - Segment access
   - Encrypt end-to-end
   - Analytics for threat detection
```

---

## Security Scanning

```yaml
# .github/workflows/security.yml
name: Security Scan

on: [push, pull_request]

jobs:
  snyk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: snyk/actions/node@master
        with:
          args: --severity-threshold=high

  trivy:
    runs-on: ubuntu-latest
    steps:
      - uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:latest'
          severity: 'CRITICAL,HIGH'
```

---

## Incident Response

```markdown
1. PREPARATION
   - Incident response plan
   - Contact list
   - Playbooks

2. DETECTION
   - Monitoring alerts
   - User reports
   - Threat intelligence

3. CONTAINMENT
   - Isolate affected systems
   - Preserve evidence
   - Short-term fix

4. ERADICATION
   - Remove threat
   - Patch vulnerabilities
   - Update signatures

5. RECOVERY
   - Restore from clean backups
   - Monitor for reinfection
   - Gradual service restoration

6. LESSONS LEARNED
   - Post-mortem
   - Update procedures
   - Training
```

---

## References

- OWASP Top 10
- NIST Cybersecurity Framework
- CIS Controls

**Related**: `appsec.md`, `cloud-security.md`, `pentesting.md`
