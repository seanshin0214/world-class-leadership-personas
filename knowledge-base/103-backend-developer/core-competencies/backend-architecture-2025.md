# Backend Architecture 2025

**Updated**: 2025-11-23 | **Stack**: Node.js, FastAPI, Go, Microservices

---

## API Design (REST + GraphQL)

### RESTful Best Practices

```
GET    /api/users          - List users
GET    /api/users/:id      - Get user
POST   /api/users          - Create user
PUT    /api/users/:id      - Update user (full)
PATCH  /api/users/:id      - Update user (partial)
DELETE /api/users/:id      - Delete user

Response:
200 OK, 201 Created, 204 No Content
400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
500 Internal Server Error
```

### Express.js API

```typescript
import express from 'express';
import { z } from 'zod';

const app = express();
app.use(express.json());

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  age: z.number().int().positive().optional()
});

app.post('/api/users', async (req, res) => {
  try {
    const data = userSchema.parse(req.body);
    const user = await db.user.create({ data });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
```

### FastAPI (Python)

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr

app = FastAPI()

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    age: int | None = None

@app.post("/api/users", status_code=201)
async def create_user(user: UserCreate):
    # Validation automatic via Pydantic
    db_user = await db.users.create(**user.model_dump())
    return db_user

@app.get("/api/users/{user_id}")
async def get_user(user_id: int):
    user = await db.users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

---

## Database Patterns

### Repository Pattern

```typescript
// repositories/UserRepository.ts
export class UserRepository {
  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: CreateUserDto): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }
}

// services/UserService.ts
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async getUser(id: number): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }
}
```

### Transactions

```typescript
// Prisma
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.profile.create({ data: { userId: user.id, ...profileData } });
});

// TypeORM
await dataSource.transaction(async (manager) => {
  const user = await manager.save(User, userData);
  await manager.save(Profile, { userId: user.id, ...profileData });
});
```

---

## Microservices Architecture

```
API Gateway (Kong, nginx)
    ↓
┌───────────┬───────────┬───────────┐
│  Auth     │  Users    │  Orders   │
│  Service  │  Service  │  Service  │
└─────┬─────┴─────┬─────┴─────┬─────┘
      ↓           ↓           ↓
    Redis    PostgreSQL   MongoDB
```

### Service Communication

```typescript
// gRPC (Proto definition)
service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
  rpc CreateUser (CreateUserRequest) returns (UserResponse);
}

// Message Queue (RabbitMQ)
await channel.sendToQueue('user.created', Buffer.from(JSON.stringify({
  userId: user.id,
  email: user.email
})));

// Event-driven (EventEmitter)
eventEmitter.on('user.created', async (user) => {
  await sendWelcomeEmail(user.email);
  await analytics.track('user_signup', { userId: user.id });
});
```

---

## Caching Strategies

```typescript
// Redis caching
async function getUser(id: number): Promise<User> {
  const cacheKey = `user:${id}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Cache miss - fetch from DB
  const user = await db.user.findUnique({ where: { id } });
  
  // Store in cache (1 hour TTL)
  await redis.setex(cacheKey, 3600, JSON.stringify(user));
  
  return user;
}

// Cache invalidation
async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
  const user = await db.user.update({ where: { id }, data });
  await redis.del(`user:${id}`);  // Invalidate cache
  return user;
}
```

---

## Authentication & Authorization

### JWT

```typescript
import jwt from 'jsonwebtoken';

// Generate token
function generateToken(userId: number): string {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
}

// Middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

---

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // Max 100 requests per window
  message: 'Too many requests'
});

app.use('/api/', limiter);
```

---

## Error Handling

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
  }
}

// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

---

## Key Takeaways

1. **API Design**: REST for CRUD, GraphQL for complex queries
2. **Database**: Use ORMs, implement transactions
3. **Caching**: Redis for performance
4. **Security**: JWT, rate limiting, input validation
5. **Monitoring**: Logs, metrics, alerts

---

## References

- Node.js Best Practices
- FastAPI Documentation
- "Designing Data-Intensive Applications"

**Related**: `api-security.md`, `database-optimization.md`, `microservices.md`
