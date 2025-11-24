# Backend Development & APIs 2025

**Updated**: 2025-11-24 | **Focus**: RESTful APIs, Databases, Authentication, Scalability

---

## RESTful API Design

```typescript
// EXPRESS.JS (Node.js framework)

import express from 'express';
import { body, validationResult } from 'express-validator';

const app = express();
app.use(express.json());

// RESOURCE-BASED URLS (Nouns, not verbs)

// ✅ GOOD: RESTful
GET    /users          // List users
GET    /users/:id      // Get user by ID
POST   /users          // Create user
PUT    /users/:id      // Update user (full replacement)
PATCH  /users/:id      // Update user (partial)
DELETE /users/:id      // Delete user

// ❌ BAD: Not RESTful
GET  /getUsers
POST /createUser
POST /deleteUser/:id

---

// CRUD OPERATIONS

// 1. CREATE (POST)
app.post('/api/users', 
  // Validation middleware
  body('email').isEmail(),
  body('name').notEmpty(),
  body('password').isLength({ min: 8 }),
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { email, name, password } = req.body;
      
      // Check if user exists
      const existingUser = await db.users.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await db.users.create({
        email,
        name,
        password: hashedPassword
      });
      
      // Don't return password
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

---

// 2. READ (GET)
app.get('/api/users', async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Filtering
    const filters: any = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.active) filters.active = req.query.active === 'true';
    
    // Sorting
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC';
    
    const users = await db.users.findAll({
      where: filters,
      limit,
      offset,
      order: [[sortBy, order]],
      attributes: { exclude: ['password'] } // Don't return passwords
    });
    
    const total = await db.users.count({ where: filters });
    
    res.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single user
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.users.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

---

// 3. UPDATE (PUT/PATCH)
app.patch('/api/users/:id', 
  body('email').optional().isEmail(),
  body('name').optional().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const user = await db.users.findByPk(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Update only provided fields
      const updatedUser = await user.update(req.body);
      
      const { password, ...userWithoutPassword } = updatedUser.toJSON();
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

---

// 4. DELETE
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await db.users.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await user.destroy();
    
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

---

// NESTED RESOURCES

// Get user's orders
app.get('/api/users/:userId/orders', async (req, res) => {
  try {
    const orders = await db.orders.findAll({
      where: { userId: req.params.userId },
      include: [{ model: db.orderItems, include: [db.products] }]
    });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create order for user
app.post('/api/users/:userId/orders', async (req, res) => {
  try {
    const order = await db.orders.create({
      userId: req.params.userId,
      ...req.body
    });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

---

// HTTP STATUS CODES

// 2xx Success
200 OK              // Request succeeded
201 Created         // Resource created (POST)
204 No Content      // Success but no body (DELETE)

// 3xx Redirection
301 Moved Permanently
302 Found (Temporary redirect)
304 Not Modified (Cached)

// 4xx Client Errors
400 Bad Request     // Invalid syntax
401 Unauthorized    // Not authenticated
403 Forbidden       // Authenticated but no permission
404 Not Found       // Resource doesn't exist
409 Conflict        // Conflict (e.g., duplicate email)
422 Unprocessable   // Validation failed
429 Too Many Requests // Rate limited

// 5xx Server Errors
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout

---

// ERROR HANDLING MIDDLEWARE

interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
}

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  // Validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors
    });
  }
  
  // Database error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Duplicate entry',
      details: err.errors
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

---

// RATE LIMITING (Prevent abuse)

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);

// Stricter limit for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Max 5 login attempts
  skipSuccessfulRequests: true
});

app.use('/api/auth/login', authLimiter);
```

---

## Authentication & Authorization

```typescript
// JWT (JSON Web Token) AUTHENTICATION

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await db.users.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Return token
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

---

// AUTHENTICATION MIDDLEWARE

interface AuthRequest extends express.Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

const authenticate = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Format: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Attach user to request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Protected route
app.get('/api/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await db.users.findByPk(req.user!.userId, {
      attributes: { exclude: ['password'] }
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

---

// AUTHORIZATION (Role-based access control)

const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
};

// Only admins can access
app.delete('/api/users/:id', authenticate, authorize('admin'), async (req, res) => {
  // Delete user logic
});

// Admins and managers can access
app.get('/api/reports', authenticate, authorize('admin', 'manager'), async (req, res) => {
  // Get reports
});

---

// REFRESH TOKENS (Long-lived sessions)

// Generate both access and refresh tokens
app.post('/api/auth/login', async (req, res) => {
  // ... (validate user)
  
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' } // Short-lived (15 minutes)
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' } // Long-lived (7 days)
  );
  
  // Store refresh token in database
  await db.refreshTokens.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  
  res.json({ accessToken, refreshToken });
});

// Refresh access token
app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }
  
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;
    
    // Check if token exists in database
    const storedToken = await db.refreshTokens.findOne({
      where: { token: refreshToken, userId: decoded.userId }
    });
    
    if (!storedToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    // Generate new access token
    const user = await db.users.findByPk(decoded.userId);
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});
```

---

## Database Design & Optimization

```sql
-- SCHEMA DESIGN (PostgreSQL)

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table (many-to-many: orders ↔ products)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    category_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---

-- INDEXES (Speed up queries)

-- Single column index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Composite index (multiple columns)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
-- Use when querying both columns together

-- Partial index (filtered)
CREATE INDEX idx_active_users ON users(email) WHERE active = true;
-- Only indexes active users (smaller, faster)

-- Full-text search index
CREATE INDEX idx_products_name_fulltext ON products USING GIN(to_tsvector('english', name));

-- Usage:
SELECT * FROM products 
WHERE to_tsvector('english', name) @@ to_tsquery('english', 'laptop');

---

-- QUERY OPTIMIZATION

-- ❌ BAD: N+1 query problem
-- 1 query to get orders, then N queries to get user for each order
SELECT * FROM orders;
-- Then for each order:
SELECT * FROM users WHERE id = order.user_id;

-- ✅ GOOD: Single query with JOIN
SELECT 
    orders.*,
    users.name as user_name,
    users.email as user_email
FROM orders
JOIN users ON orders.user_id = users.id;

---

-- ❌ BAD: SELECT *
SELECT * FROM products;

-- ✅ GOOD: Select only needed columns
SELECT id, name, price FROM products;

---

-- ❌ BAD: No limit
SELECT * FROM orders ORDER BY created_at DESC;

-- ✅ GOOD: Pagination
SELECT * FROM orders 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 0;

---

-- TRANSACTIONS (All or nothing)

BEGIN;

-- Deduct from sender
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;

-- Add to receiver
UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;

-- If both succeed, commit
COMMIT;
-- If any fails, rollback
-- ROLLBACK;

---

-- MIGRATIONS (Version control for database)

// migrations/001-create-users-table.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

// migrations/002-add-users-name-column.sql
ALTER TABLE users ADD COLUMN name VARCHAR(255);

// Use migration tool: Sequelize, TypeORM, Prisma, or raw SQL files
```

---

## Caching

```typescript
// REDIS (In-memory cache)

import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379')
});

// CACHE MIDDLEWARE

const cache = (duration: number) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = `cache:${req.originalUrl}`;
    
    // Check if cached
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    // Intercept res.json to cache response
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      redis.setex(key, duration, JSON.stringify(body));
      return originalJson(body);
    };
    
    next();
  };
};

// Usage: Cache for 5 minutes
app.get('/api/products', cache(300), async (req, res) => {
  const products = await db.products.findAll();
  res.json(products);
});

---

// CACHE STRATEGIES

// 1. CACHE-ASIDE (Lazy loading)
async function getUser(userId: number) {
  const cacheKey = `user:${userId}`;
  
  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Not in cache, get from database
  const user = await db.users.findByPk(userId);
  
  // Store in cache (TTL: 1 hour)
  await redis.setex(cacheKey, 3600, JSON.stringify(user));
  
  return user;
}

// 2. WRITE-THROUGH (Update cache on write)
async function updateUser(userId: number, data: any) {
  // Update database
  const user = await db.users.update(data, { where: { id: userId } });
  
  // Update cache
  const cacheKey = `user:${userId}`;
  await redis.setex(cacheKey, 3600, JSON.stringify(user));
  
  return user;
}

// 3. CACHE INVALIDATION (Delete on change)
async function deleteUser(userId: number) {
  // Delete from database
  await db.users.destroy({ where: { id: userId } });
  
  // Remove from cache
  await redis.del(`user:${userId}`);
}

---

// CACHE COMMON PATTERNS

// Session storage
await redis.setex(`session:${sessionId}`, 86400, JSON.stringify(sessionData)); // 24 hours

// Rate limiting
const key = `rate:${userId}`;
const count = await redis.incr(key);
if (count === 1) await redis.expire(key, 60); // First request, set 60s TTL
if (count > 100) throw new Error('Rate limit exceeded');

// Leaderboard (sorted set)
await redis.zadd('leaderboard', score, userId);
const topUsers = await redis.zrevrange('leaderboard', 0, 9); // Top 10
```

---

## Key Takeaways

1. **RESTful principles** - Resource-based URLs, HTTP verbs, status codes
2. **Security** - JWT authentication, bcrypt passwords, rate limiting, input validation
3. **Database** - Indexes, avoid N+1, pagination, transactions
4. **Caching** - Redis for frequently accessed data (reduce DB load)
5. **Error handling** - Middleware, consistent error format, logging

---

## References

- "Designing Data-Intensive Applications" - Martin Kleppmann
- "RESTful Web APIs" - Leonard Richardson
- Express.js documentation

**Related**: `api-security.md`, `database-optimization.md`, `microservices.md`
