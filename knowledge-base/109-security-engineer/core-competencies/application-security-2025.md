# Application Security Engineering 2025

**Updated**: 2025-11-23 | **Focus**: OWASP Top 10, Penetration Testing, Security Audits

---

## OWASP Top 10 (2021)

```markdown
1. BROKEN ACCESS CONTROL

VULNERABILITY:
Users can access resources they shouldn't

EXAMPLES:
- URL manipulation: /user/123 → /user/124 (view others' data)
- Missing authorization checks on API
- Elevation of privilege (regular user → admin)

PREVENTION:
```typescript
// BAD: No authorization check
app.get('/api/users/:id', (req, res) => {
  const user = db.getUser(req.params.id);
  res.json(user); // Anyone can view any user!
});

// GOOD: Check ownership
app.get('/api/users/:id', authenticateToken, (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const user = db.getUser(req.params.id);
  res.json(user);
});
```

---

2. CRYPTOGRAPHIC FAILURES

VULNERABILITY:
Weak encryption, plaintext passwords, exposed secrets

PREVENTION:
```typescript
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Password hashing (NEVER store plaintext!)
const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds

// Verify password
const isValid = await bcrypt.compare(inputPassword, hashedPassword);

// Encrypt sensitive data (AES-256)
function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Store API keys in environment variables (not code!)
const API_KEY = process.env.API_KEY;

// Use HTTPS everywhere (TLS 1.3)
// Enforce with HSTS header
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

---

3. INJECTION (SQL, NoSQL, Command)

VULNERABILITY:
Untrusted data sent to interpreter

SQL INJECTION:
```typescript
// BAD: String concatenation
const query = `SELECT * FROM users WHERE username = '${username}'`;
// Attack: username = "admin' OR '1'='1"
// Result: SELECT * FROM users WHERE username = 'admin' OR '1'='1'
// Returns all users!

// GOOD: Parameterized queries
const query = 'SELECT * FROM users WHERE username = ?';
db.query(query, [username]);

// OR use ORM (TypeORM, Prisma)
const user = await User.findOne({ where: { username } });
```

NOSQL INJECTION:
```typescript
// BAD: Direct object
db.collection('users').find({ username: req.body.username });
// Attack: { "username": { "$ne": null } }
// Returns all users!

// GOOD: Validate input type
if (typeof req.body.username !== 'string') {
  return res.status(400).json({ error: 'Invalid input' });
}
```

COMMAND INJECTION:
```typescript
// BAD: Executing user input
const { exec } = require('child_process');
exec(`ping -c 4 ${req.body.ip}`, (error, stdout) => { ... });
// Attack: ip = "8.8.8.8; rm -rf /"

// GOOD: Use libraries, validate input
const { isIP } = require('net');
if (!isIP(req.body.ip)) {
  return res.status(400).json({ error: 'Invalid IP' });
}
// Better: Use ping library instead of exec
```

---

4. INSECURE DESIGN

VULNERABILITY:
Missing security controls by design

EXAMPLES:
- No rate limiting (brute force attacks)
- Weak password requirements
- No account lockout after failed attempts
- Missing security headers

PREVENTION:
```typescript
import rateLimit from 'express-rate-limit';

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests'
});
app.use('/api/', limiter);

// Strict rate limit for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts
  skipSuccessfulRequests: true
});
app.post('/api/login', loginLimiter, loginHandler);

// Password requirements
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special

// Security headers
import helmet from 'helmet';
app.use(helmet());
// Sets: X-Frame-Options, X-Content-Type-Options, etc.
```

---

5. SECURITY MISCONFIGURATION

VULNERABILITY:
Default configs, unnecessary features enabled, verbose errors

PREVENTION:
```typescript
// Hide technology stack
app.disable('x-powered-by'); // Remove "X-Powered-By: Express"

// Don't expose error details in production
if (process.env.NODE_ENV === 'production') {
  app.use((err, req, res, next) => {
    console.error(err.stack); // Log internally
    res.status(500).json({ error: 'Internal server error' }); // Generic message
  });
} else {
  app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message, stack: err.stack });
  });
}

// Disable unnecessary HTTP methods
app.all('*', (req, res, next) => {
  const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  next();
});

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
  }
}));
```

---

6. VULNERABLE COMPONENTS

VULNERABILITY:
Using outdated libraries with known vulnerabilities

PREVENTION:
```bash
# Audit dependencies
npm audit
npm audit fix

# Snyk (free tier)
npm install -g snyk
snyk test
snyk monitor # Continuous monitoring

# Dependabot (GitHub)
# Automatically creates PRs for updates

# Renovate Bot
# More configurable than Dependabot

# Keep dependencies updated
npm outdated
npm update
```

---

7. AUTHENTICATION FAILURES

VULNERABILITY:
Weak password policy, credential stuffing, session fixation

PREVENTION:
```typescript
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// JWT authentication
const generateToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' } // Short-lived
  );
};

// Refresh tokens (longer-lived, stored securely)
const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// Store refresh token in httpOnly cookie
res.cookie('refreshToken', refreshToken, {
  httpOnly: true, // Not accessible via JavaScript
  secure: true, // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Verify token middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Multi-factor authentication (TOTP)
import speakeasy from 'speakeasy';

const secret = speakeasy.generateSecret({ name: 'MyApp' });
// User scans QR code with authenticator app

// Verify TOTP token
const verified = speakeasy.totp.verify({
  secret: user.totpSecret,
  encoding: 'base32',
  token: req.body.totpToken,
  window: 1 // Allow 1 step before/after (30 sec)
});
```

---

8. DATA INTEGRITY FAILURES

VULNERABILITY:
Accepting untrusted data without validation

PREVENTION:
```typescript
import { z } from 'zod';

// Input validation with Zod
const userSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(18).max(120),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
});

app.post('/api/users', (req, res) => {
  const result = userSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  
  const validData = result.data;
  // Use validData (guaranteed to be valid)
});

// File upload validation
import multer from 'multer';
import path from 'path';

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  }
});

// Serialize/deserialize safely
// Avoid eval(), new Function(), or deserializing untrusted data
```

---

9. LOGGING & MONITORING FAILURES

VULNERABILITY:
Not detecting or responding to breaches

PREVENTION:
```typescript
import winston from 'winston';

// Structured logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Log security events
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = authenticateUser(username, password);
  
  if (user) {
    logger.info('Login success', {
      userId: user.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    });
  } else {
    logger.warn('Login failed', {
      username, // Log attempt (but not password!)
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
  }
});

// Monitor for suspicious activity
// - Multiple failed logins
// - Unusual access patterns
// - Privilege escalation attempts
// - Large data exports

// Alerting (PagerDuty, Sentry)
import * as Sentry from '@sentry/node';

Sentry.init({ dsn: process.env.SENTRY_DSN });

app.use(Sentry.Handlers.errorHandler());
```

---

10. SERVER-SIDE REQUEST FORGERY (SSRF)

VULNERABILITY:
Fetching remote resources based on user input

PREVENTION:
```typescript
// BAD: User controls URL
app.post('/api/fetch', async (req, res) => {
  const response = await fetch(req.body.url);
  res.json(await response.json());
  // Attack: url = "http://localhost:6379" (Redis)
  // Attack: url = "http://169.254.169.254/latest/meta-data/" (AWS metadata)
});

// GOOD: Whitelist allowed domains
const ALLOWED_DOMAINS = ['api.example.com', 'cdn.example.com'];

app.post('/api/fetch', async (req, res) => {
  const url = new URL(req.body.url);
  
  if (!ALLOWED_DOMAINS.includes(url.hostname)) {
    return res.status(400).json({ error: 'Invalid domain' });
  }
  
  // Block private IP ranges
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^192\.168\./,
    /^127\./,
  ];
  
  const ip = await dns.resolve(url.hostname);
  if (privateRanges.some(range => range.test(ip))) {
    return res.status(400).json({ error: 'Private IP not allowed' });
  }
  
  const response = await fetch(url.toString());
  res.json(await response.json());
});
```

---

## Penetration Testing

```bash
# Nmap (Port scanning)
nmap -sV -p- example.com
# -sV: Version detection
# -p-: Scan all ports

# Nikto (Web server scanner)
nikto -h https://example.com

# OWASP ZAP (Web app scanner)
zap-cli quick-scan https://example.com

# Burp Suite (Intercept HTTP traffic)
# Manual testing with proxy

# SQLMap (SQL injection testing)
sqlmap -u "https://example.com/user?id=1" --batch --random-agent

# XSS testing
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
```

---

## Key Takeaways

1. **Defense in depth** - Multiple layers of security
2. **Principle of least privilege** - Minimum necessary permissions
3. **Fail securely** - Default deny, explicit allow
4. **Keep it simple** - Complex = more attack surface
5. **Stay updated** - Patch vulnerabilities quickly

---

## References

- OWASP Top 10
- "The Web Application Hacker's Handbook"
- PortSwigger Web Security Academy

**Related**: `penetration-testing.md`, `secure-coding.md`, `incident-response.md`
