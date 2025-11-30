# Engineering Experts - Deep Knowledge Base

## Fullstack Developer (101)

### Core Competencies
- End-to-end application development
- Frontend: React, Vue, Angular, Next.js
- Backend: Node.js, Python, Go, Java
- Databases: PostgreSQL, MongoDB, Redis
- APIs: REST, GraphQL, gRPC
- Cloud: AWS, Azure, GCP

### Architecture Patterns

**Monolith to Microservices Decision Matrix:**
| Factor | Monolith | Microservices |
|--------|----------|---------------|
| Team size | <10 | 10+ |
| Deployment freq | Monthly | Daily/hourly |
| Scaling needs | Uniform | Independent |
| Tech diversity | Single stack | Polyglot |

**Recommended Pattern by Stage:**
- MVP: Modular Monolith
- Growth: Service-Oriented Architecture
- Scale: Microservices with Service Mesh

### Code Example: Express API with Auth

```javascript
// server.js - Production-ready Express API
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') }));
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Authentication middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Route with validation
app.post('/api/users',
  authenticate,
  [
    body('email').isEmail().normalizeEmail(),
    body('name').trim().isLength({ min: 2, max: 100 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... create user logic
  }
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
```

---

## DevOps Engineer (110)

### CI/CD Pipeline Best Practices

**Pipeline Stages:**
```
Build → Test → Security Scan → Deploy Staging → Integration Test → Deploy Prod
```

**Deployment Strategies:**
| Strategy | Zero Downtime | Rollback Speed | Resource Cost |
|----------|---------------|----------------|---------------|
| Rolling | Yes | Medium | Low |
| Blue/Green | Yes | Instant | 2x |
| Canary | Yes | Fast | Low |
| A/B Testing | Yes | Fast | Low |

### Kubernetes Deployment Example

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
  labels:
    app: api-server
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: api-server
  template:
    metadata:
      labels:
        app: api-server
    spec:
      containers:
      - name: api
        image: myapp/api:v1.2.3
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: database-url
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  security:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy:
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to production
        run: |
          # Deploy logic here
```

---

## Security Engineer (113)

### OWASP Top 10 Prevention

| Vulnerability | Prevention |
|---------------|------------|
| Injection | Parameterized queries, input validation |
| Broken Auth | MFA, secure session management |
| Sensitive Data Exposure | Encryption at rest/transit |
| XXE | Disable DTDs, use JSON |
| Broken Access Control | RBAC, deny by default |
| Security Misconfiguration | Hardening, patch management |
| XSS | Output encoding, CSP headers |
| Insecure Deserialization | Validate before deserialize |
| Vulnerable Components | Dependency scanning, updates |
| Insufficient Logging | Centralized logging, alerting |

### Security Headers Configuration

```javascript
// Express security headers
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.example.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));
```

---

## Database Engineer (114)

### Query Optimization Patterns

**Index Strategy:**
```sql
-- Composite index for common query patterns
CREATE INDEX idx_orders_user_date
ON orders(user_id, created_at DESC);

-- Partial index for filtered queries
CREATE INDEX idx_active_users
ON users(email)
WHERE status = 'active';

-- Include columns to avoid table lookup
CREATE INDEX idx_orders_covering
ON orders(user_id)
INCLUDE (total, status);
```

**Query Optimization Checklist:**
1. [ ] EXPLAIN ANALYZE the query
2. [ ] Check index usage
3. [ ] Avoid SELECT *
4. [ ] Use appropriate JOINs
5. [ ] Consider query caching
6. [ ] Partition large tables
7. [ ] Use connection pooling

### PostgreSQL Performance Tuning

```sql
-- Configuration for 16GB RAM server
ALTER SYSTEM SET shared_buffers = '4GB';
ALTER SYSTEM SET effective_cache_size = '12GB';
ALTER SYSTEM SET maintenance_work_mem = '1GB';
ALTER SYSTEM SET work_mem = '256MB';
ALTER SYSTEM SET random_page_cost = 1.1;  -- SSD
ALTER SYSTEM SET effective_io_concurrency = 200;  -- SSD
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET max_parallel_workers_per_gather = 4;
```

---

## Expert Activation

```
@fullstack-developer
@devops-engineer
@security-engineer
@database-engineer
```
or describe your technical challenge
