# Engineering Experts - Deep Knowledge Base

## Fullstack Developer (101)

### Core Competencies
- End-to-end application development
- Frontend: React, Vue, Angular
- Backend: Node.js, Python, Go
- Databases: PostgreSQL, MongoDB, Redis
- APIs: REST, GraphQL, gRPC

### Architecture Patterns
```
Monolith → Modular Monolith → Microservices

Recommended progression:
1. Start with modular monolith
2. Extract services when team/scale demands
3. Avoid premature microservices
```

### Tech Stack Recommendations

**Startup MVP**
```
Frontend: Next.js + TypeScript
Backend: Node.js + Express/Fastify
Database: PostgreSQL + Prisma
Hosting: Vercel + Railway/Render
```

**Enterprise Scale**
```
Frontend: React + TypeScript + Nx
Backend: Node.js microservices or Go
Database: PostgreSQL + Redis + Elasticsearch
Infrastructure: Kubernetes + AWS/GCP
```

### Best Practices
1. **Type Safety**: Always use TypeScript
2. **Testing**: Unit + Integration + E2E
3. **Documentation**: OpenAPI for APIs
4. **Monitoring**: Structured logging + APM

---

## React Expert (102)

### Modern React Patterns

**Component Architecture**
```typescript
// Compound Components Pattern
const Card = ({ children }) => <div className="card">{children}</div>;
Card.Header = ({ children }) => <div className="card-header">{children}</div>;
Card.Body = ({ children }) => <div className="card-body">{children}</div>;

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

**State Management Decision Tree**
```
Local state only? → useState/useReducer
Shared across few components? → Context + useReducer
Complex app-wide state? → Zustand or Jotai
Server state? → TanStack Query (React Query)
Form state? → React Hook Form
```

**Performance Optimization**
```typescript
// 1. Memoization
const MemoizedComponent = React.memo(Component);
const memoizedValue = useMemo(() => compute(a, b), [a, b]);
const memoizedFn = useCallback(() => doSomething(a), [a]);

// 2. Code Splitting
const LazyComponent = lazy(() => import('./Component'));

// 3. Virtualization for long lists
import { useVirtualizer } from '@tanstack/react-virtual';
```

### Next.js Best Practices
```typescript
// Server Components (default in App Router)
async function ProductPage({ params }) {
  const product = await getProduct(params.id); // Server-side
  return <ProductDetails product={product} />;
}

// Client Components (when needed)
'use client';
function InteractiveCart() {
  const [items, setItems] = useState([]);
  // Client-side interactivity
}
```

---

## DevOps Engineer (108/109)

### CI/CD Pipeline Design

**GitHub Actions Example**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
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

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: myapp:${{ github.sha }}

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: azure/k8s-deploy@v4
        with:
          manifests: k8s/
          images: myapp:${{ github.sha }}
```

### Infrastructure as Code

**Terraform AWS Example**
```hcl
# VPC
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "production-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = false
}

# EKS Cluster
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.0.0"

  cluster_name    = "production"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      desired_size = 3
      min_size     = 2
      max_size     = 10

      instance_types = ["t3.large"]
      capacity_type  = "ON_DEMAND"
    }
  }
}
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
spec:
  replicas: 3
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
        image: myapp:latest
        ports:
        - containerPort: 8080
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
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: api-server
spec:
  selector:
    app: api-server
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-server
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## Security Expert (126/127)

### OWASP Top 10 Prevention

**1. Injection Prevention**
```python
# Bad - SQL Injection vulnerable
query = f"SELECT * FROM users WHERE id = {user_id}"

# Good - Parameterized query
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))

# Best - ORM
user = User.objects.get(id=user_id)
```

**2. Authentication Best Practices**
```typescript
// Password hashing
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
const isValid = await bcrypt.compare(password, hashedPassword);

// JWT with proper configuration
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  {
    expiresIn: '15m',
    algorithm: 'RS256'
  }
);
```

**3. Input Validation**
```typescript
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  age: z.number().int().min(13).max(120),
});

function createUser(input: unknown) {
  const validated = UserSchema.parse(input); // Throws if invalid
  // Proceed with validated data
}
```

**4. Security Headers**
```typescript
// Express.js with Helmet
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

### Security Checklist
- [ ] Input validation on all endpoints
- [ ] Parameterized queries / ORM
- [ ] Password hashing (bcrypt, Argon2)
- [ ] JWT with short expiry + refresh tokens
- [ ] HTTPS everywhere
- [ ] Security headers (CSP, HSTS, etc.)
- [ ] Rate limiting
- [ ] Audit logging
- [ ] Dependency scanning
- [ ] Regular penetration testing

---

## Systems Architect (128/129)

### System Design Principles

**CAP Theorem Trade-offs**
```
CA (Consistency + Availability): Traditional RDBMS
CP (Consistency + Partition Tolerance): MongoDB, HBase
AP (Availability + Partition Tolerance): Cassandra, DynamoDB

Choose based on business requirements:
- Financial systems → CP (consistency critical)
- Social media → AP (availability critical)
- E-commerce → Depends on component
```

**Scalability Patterns**
```
1. Horizontal Scaling
   - Stateless services
   - Load balancer distribution
   - Database sharding

2. Caching Strategy
   - L1: Application cache (in-memory)
   - L2: Distributed cache (Redis)
   - L3: CDN (static assets)

3. Async Processing
   - Message queues (RabbitMQ, Kafka)
   - Background jobs
   - Event-driven architecture
```

### High-Level Architecture Template
```
┌─────────────────────────────────────────────────────────────┐
│                         CDN                                  │
│                    (CloudFront/Fastly)                       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer                             │
│                      (ALB/NLB)                               │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼───────┐   ┌─────────▼─────────┐   ┌──────▼──────┐
│  API Gateway  │   │   Web Servers     │   │   Workers   │
│   (Kong/AWS)  │   │   (Next.js/Nginx) │   │  (Celery)   │
└───────────────┘   └───────────────────┘   └─────────────┘
        │                     │                     │
┌───────▼─────────────────────▼─────────────────────▼───────┐
│                    Service Mesh (Istio)                    │
└────────────────────────────────────────────────────────────┘
        │                     │                     │
┌───────▼───────┐   ┌─────────▼─────────┐   ┌──────▼──────┐
│  Auth Service │   │   Core Services   │   │  ML Service │
└───────────────┘   └───────────────────┘   └─────────────┘
        │                     │                     │
┌───────▼─────────────────────▼─────────────────────▼───────┐
│                       Data Layer                           │
├───────────────┬─────────────────────┬────────────────────┤
│  PostgreSQL   │       Redis         │    Elasticsearch   │
│  (Primary DB) │     (Cache/Queue)   │     (Search)       │
└───────────────┴─────────────────────┴────────────────────┘
```

### Capacity Planning
```
Users: 1M DAU
Requests: 100 req/user/day = 100M requests/day
Peak: 3x average = ~3,500 RPS

Database:
- Read replicas: 3 (for read-heavy workload)
- Connection pooling: 100 connections/replica
- Estimated storage: 1TB/year

Cache:
- Hit ratio target: 95%
- Redis cluster: 3 nodes, 32GB each

Compute:
- API servers: 10 pods (auto-scale 5-30)
- Background workers: 5 pods
```

---

## API Architect (117)

### API Design Best Practices

**RESTful API Design**
```
Resources (nouns, not verbs):
GET    /users          - List users
GET    /users/{id}     - Get user
POST   /users          - Create user
PUT    /users/{id}     - Update user (full)
PATCH  /users/{id}     - Update user (partial)
DELETE /users/{id}     - Delete user

Nested resources:
GET    /users/{id}/orders        - User's orders
POST   /users/{id}/orders        - Create order for user

Filtering, sorting, pagination:
GET    /users?status=active&sort=-created_at&page=2&limit=20
```

**OpenAPI Specification**
```yaml
openapi: 3.0.3
info:
  title: User API
  version: 1.0.0

paths:
  /users:
    get:
      summary: List users
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [active, inactive]
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    $ref: '#/components/schemas/Pagination'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
        createdAt:
          type: string
          format: date-time
```

**API Versioning Strategies**
```
1. URL Path (Recommended for major versions)
   /v1/users, /v2/users

2. Header (For minor versions)
   Accept: application/vnd.api+json; version=1.1

3. Query Parameter (Easy but not RESTful)
   /users?version=1
```

**Error Response Format**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "requestId": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```
