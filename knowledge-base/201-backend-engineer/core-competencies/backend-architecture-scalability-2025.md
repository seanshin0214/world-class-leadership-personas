# Backend Architecture & Scalability 2025

**Updated**: 2025-11-23 | **Stack**: Node.js, Python, PostgreSQL, Redis, AWS

---

## System Design Fundamentals

### Horizontal vs Vertical Scaling

```
VERTICAL SCALING (Scale Up):
- Add more CPU, RAM to single server
- Pros: Simple, no code changes
- Cons: Hardware limits, single point of failure, expensive
- Example: 4 CPU → 16 CPU, 16GB RAM → 64GB RAM

HORIZONTAL SCALING (Scale Out):
- Add more servers
- Pros: Unlimited scaling, fault tolerance
- Cons: Complex (load balancing, data consistency)
- Example: 1 server → 10 servers behind load balancer

BEST PRACTICE: Design for horizontal scaling from day 1
```

---

## API Design

### RESTful API Best Practices

```typescript
// Express.js REST API

import express from 'express';
import { body, validationResult } from 'express-validator';

const app = express();
app.use(express.json());

// GET /api/users?page=1&limit=20&sort=-createdAt
app.get('/api/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    
    const users = await User.find()
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-password'); // Exclude sensitive fields
    
    const total = await User.countDocuments();
    
    res.json({
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users
app.post('/api/users',
  // Validation middleware
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().notEmpty(),
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { email, password, name } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        name
      });
      
      await user.save();
      
      // Don't return password
      const userResponse = user.toObject();
      delete userResponse.password;
      
      res.status(201).json(userResponse);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// PATCH /api/users/:id
app.patch('/api/users/:id',
  authenticateToken, // Auth middleware
  async (req, res) => {
    try {
      // Only allow updating certain fields
      const allowedUpdates = ['name', 'email'];
      const updates = Object.keys(req.body);
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));
      
      if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
      }
      
      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// DELETE /api/users/:id
app.delete('/api/users/:id',
  authenticateToken,
  authorizeAdmin, // Only admins can delete
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## Database Optimization

### Indexing Strategies

```sql
-- PostgreSQL indexing

-- B-tree index (default, most common)
CREATE INDEX idx_users_email ON users(email);

-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'user@example.com';

-- Result without index:
-- Seq Scan on users (cost=0.00..4.56 rows=1 width=100) (actual time=0.023..0.025 rows=1 loops=1)
-- Planning Time: 0.051 ms
-- Execution Time: 0.039 ms

-- Result with index:
-- Index Scan using idx_users_email (cost=0.15..8.17 rows=1 width=100) (actual time=0.012..0.013 rows=1 loops=1)
-- Planning Time: 0.082 ms
-- Execution Time: 0.028 ms

-- Composite index (order matters!)
CREATE INDEX idx_users_created_status ON users(created_at DESC, status);

-- Good for queries like:
SELECT * FROM users WHERE status = 'active' ORDER BY created_at DESC LIMIT 20;

-- Partial index (smaller, faster)
CREATE INDEX idx_users_active_email ON users(email) WHERE status = 'active';

-- Unique index (enforces uniqueness)
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Full-text search
CREATE INDEX idx_posts_content_fts ON posts USING gin(to_tsvector('english', content));

SELECT * FROM posts 
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'postgresql & performance');

-- Monitor index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Drop unused indexes (idx_scan = 0)
```

### Query Optimization

```typescript
// N+1 Query Problem

// BAD: N+1 queries (1 + N)
const users = await User.findAll(); // 1 query
for (const user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } }); // N queries
}
// Total: 1 + 100 = 101 queries if 100 users!

// GOOD: Use JOIN or eager loading
const users = await User.findAll({
  include: [{ model: Post }]
});
// Total: 1 query with JOIN

// OR use DataLoader (batching)
import DataLoader from 'dataloader';

const postLoader = new DataLoader(async (userIds) => {
  const posts = await Post.findAll({
    where: { userId: { [Op.in]: userIds } }
  });
  
  const postsByUser = {};
  posts.forEach(post => {
    if (!postsByUser[post.userId]) {
      postsByUser[post.userId] = [];
    }
    postsByUser[post.userId].push(post);
  });
  
  return userIds.map(id => postsByUser[id] || []);
});

// Usage
const users = await User.findAll();
for (const user of users) {
  user.posts = await postLoader.load(user.id); // Batched!
}
// Total: 2 queries (1 for users, 1 batched for all posts)

---

// SELECT N+1 (fetching unnecessary columns)
// BAD
const users = await User.findAll(); // SELECT * FROM users (fetches all columns)

// GOOD
const users = await User.findAll({
  attributes: ['id', 'name', 'email'] // Only what you need
});

---

// Pagination (avoid OFFSET for large datasets)
// BAD (slow for large offsets)
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 10000;
// Database must scan 10,020 rows!

// GOOD (cursor-based pagination)
SELECT * FROM posts 
WHERE created_at < '2025-01-01T00:00:00Z' -- Last seen cursor
ORDER BY created_at DESC 
LIMIT 20;
```

---

## Caching Strategies

### Redis Caching

```typescript
import Redis from 'ioredis';

const redis = new Redis();

// Cache-aside pattern (lazy loading)
async function getUser(userId: string) {
  // 1. Try cache first
  const cached = await redis.get(`user:${userId}`);
  if (cached) {
    console.log('Cache hit!');
    return JSON.parse(cached);
  }
  
  // 2. Cache miss → fetch from database
  console.log('Cache miss!');
  const user = await User.findById(userId);
  
  // 3. Store in cache (TTL = 1 hour)
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
  
  return user;
}

// Cache invalidation (on update)
async function updateUser(userId: string, data: any) {
  // Update database
  const user = await User.findByIdAndUpdate(userId, data, { new: true });
  
  // Invalidate cache
  await redis.del(`user:${userId}`);
  
  return user;
}

// Cache popular queries
async function getTrendingPosts() {
  const cached = await redis.get('trending:posts');
  if (cached) {
    return JSON.parse(cached);
  }
  
  const posts = await Post.find()
    .sort({ views: -1 })
    .limit(10);
  
  // Cache for 5 minutes (trending data can be slightly stale)
  await redis.setex('trending:posts', 300, JSON.stringify(posts));
  
  return posts;
}

// Rate limiting
async function checkRateLimit(ip: string) {
  const key = `ratelimit:${ip}`;
  const requests = await redis.incr(key);
  
  if (requests === 1) {
    // First request, set expiry (1 minute window)
    await redis.expire(key, 60);
  }
  
  // Allow 100 requests per minute
  if (requests > 100) {
    throw new Error('Rate limit exceeded');
  }
  
  return requests;
}

// Session storage
async function createSession(userId: string) {
  const sessionId = crypto.randomUUID();
  const sessionData = {
    userId,
    createdAt: Date.now()
  };
  
  // Store session for 24 hours
  await redis.setex(`session:${sessionId}`, 86400, JSON.stringify(sessionData));
  
  return sessionId;
}
```

---

## Asynchronous Processing

### Message Queues (Bull)

```typescript
import Queue from 'bull';

// Create queues
const emailQueue = new Queue('email', process.env.REDIS_URL);
const imageQueue = new Queue('image-processing', process.env.REDIS_URL);

// Producer: Add jobs to queue
app.post('/api/users/register', async (req, res) => {
  const user = await User.create(req.body);
  
  // Add email job (async, don't block response)
  await emailQueue.add('welcome-email', {
    userId: user.id,
    email: user.email,
    name: user.name
  }, {
    attempts: 3, // Retry 3 times if fails
    backoff: {
      type: 'exponential',
      delay: 2000 // 2s, 4s, 8s
    }
  });
  
  res.status(201).json(user);
});

// Consumer: Process jobs
emailQueue.process('welcome-email', async (job) => {
  const { userId, email, name } = job.data;
  
  console.log(`Sending welcome email to ${email}`);
  
  await sendEmail({
    to: email,
    subject: 'Welcome!',
    body: `Hi ${name}, welcome to our platform!`
  });
  
  console.log(`Email sent to ${email}`);
});

// Image processing queue
app.post('/api/posts/:id/image', upload.single('image'), async (req, res) => {
  const post = await Post.findById(req.params.id);
  
  // Store original image
  const imageUrl = await s3.upload(req.file);
  post.imageUrl = imageUrl;
  await post.save();
  
  // Queue thumbnail generation (async)
  await imageQueue.add('generate-thumbnail', {
    postId: post.id,
    imageUrl
  });
  
  res.json(post);
});

imageQueue.process('generate-thumbnail', async (job) => {
  const { postId, imageUrl } = job.data;
  
  // Download image
  const image = await downloadImage(imageUrl);
  
  // Generate thumbnail (CPU-intensive)
  const thumbnail = await sharp(image)
    .resize(200, 200, { fit: 'cover' })
    .toBuffer();
  
  // Upload thumbnail
  const thumbnailUrl = await s3.upload(thumbnail);
  
  // Update post
  await Post.findByIdAndUpdate(postId, { thumbnailUrl });
  
  console.log(`Thumbnail generated for post ${postId}`);
});

// Monitor queues
emailQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

emailQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
  // Alert on-call engineer
});
```

---

## Microservices Architecture

```typescript
// Service 1: User Service (port 3001)
// users-service/index.ts

import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

app.post('/api/users/register', async (req, res) => {
  const user = await User.create(req.body);
  
  // Publish event to message broker (RabbitMQ, Kafka)
  await publishEvent('user.created', {
    userId: user.id,
    email: user.email
  });
  
  res.json(user);
});

app.listen(3001);

// Service 2: Notification Service (port 3002)
// notification-service/index.ts

import express from 'express';

const app = express();

// Subscribe to events
subscribeToEvent('user.created', async (event) => {
  const { userId, email } = event.data;
  
  // Send welcome email
  await sendEmail(email, 'Welcome!');
});

app.listen(3002);

// API Gateway (port 3000)
// gateway/index.ts

import express from 'express';
import httpProxy from 'http-proxy-middleware';

const app = express();

// Route to appropriate service
app.use('/api/users', httpProxy.createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true
}));

app.use('/api/notifications', httpProxy.createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true
}));

app.listen(3000);
```

---

## Key Takeaways

1. **Indexing** - Query performance, 100x faster
2. **Caching** - Redis, reduce database load
3. **Async processing** - Queues, don't block requests
4. **Horizontal scaling** - Design for it early
5. **Monitor** - Logs, metrics, alerts

---

## References

- "Designing Data-Intensive Applications" - Martin Kleppmann
- System Design Primer (GitHub)
- PostgreSQL Performance Tuning

**Related**: `database-scaling.md`, `microservices-patterns.md`, `monitoring-observability.md`
