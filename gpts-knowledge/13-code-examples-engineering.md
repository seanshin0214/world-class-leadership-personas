# Code Examples - Engineering

## Backend Development

### Node.js Express API
```javascript
// server.js - Express API with middleware
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Parsing & logging
app.use(express.json({ limit: '10kb' }));
app.use(morgan('combined'));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Python FastAPI
```python
# main.py - FastAPI with async database
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uvicorn

app = FastAPI(title="API Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str

    class Config:
        from_attributes = True

# Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# Routes
@app.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check existing
    existing = await db.execute(
        select(User).where(User.email == user.email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    hashed_password = hash_password(user.password)
    db_user = User(email=user.email, name=user.name, password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## Frontend Development

### React Component with Hooks
```typescript
// UserProfile.tsx - React component with hooks
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

const fetchUser = async (userId: string): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

const updateUser = async (user: Partial<User> & { id: string }): Promise<User> => {
  const response = await fetch(`/api/users/${user.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Failed to update user');
  return response.json();
};

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Fetch user data
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update mutation
  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user', userId], updatedUser);
      setIsEditing(false);
      onUpdate?.(updatedUser);
    },
  });

  // Sync form data with user
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ id: userId, ...formData });
  }, [userId, formData, mutation]);

  if (isLoading) return <div className="animate-pulse">Loading...</div>;
  if (error) return <div className="text-red-500">Error loading user</div>;
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded"
            placeholder="Name"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-2 border rounded"
            placeholder="Email"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {mutation.isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};
```

### Next.js Server Component
```typescript
// app/products/[id]/page.tsx - Next.js 14 Server Component
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ProductDetails } from '@/components/ProductDetails';
import { RelatedProducts } from '@/components/RelatedProducts';
import { ProductSkeleton } from '@/components/skeletons';

interface PageProps {
  params: { id: string };
}

async function getProduct(id: string) {
  const res = await fetch(`${process.env.API_URL}/products/${id}`, {
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch product');
  }

  return res.json();
}

export async function generateMetadata({ params }: PageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <Suspense fallback={<ProductSkeleton count={4} />}>
          <RelatedProducts categoryId={product.categoryId} excludeId={product.id} />
        </Suspense>
      </section>
    </main>
  );
}
```

---

## Database Operations

### PostgreSQL with Prisma
```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}

model Order {
  id        String      @id @default(cuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  items     OrderItem[]
  total     Decimal     @db.Decimal(10, 2)
  status    OrderStatus @default(PENDING)
  createdAt DateTime    @default(now())

  @@index([userId, status])
}

enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

```typescript
// lib/db.ts - Database operations
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

// Transaction example
export async function createOrderWithItems(
  userId: string,
  items: { productId: string; quantity: number; price: number }[]
) {
  return prisma.$transaction(async (tx) => {
    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const order = await tx.order.create({
      data: {
        userId,
        total,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Update inventory
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          inventory: { decrement: item.quantity },
        },
      });
    }

    return order;
  });
}

// Pagination example
export async function getOrders(
  userId: string,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  return {
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

---

## Authentication

### JWT Authentication
```typescript
// auth/jwt.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateTokens(payload: TokenPayload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN
  });

  return { accessToken, refreshToken };
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

// Middleware
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

---

## Docker & Deployment

### Dockerfile (Multi-stage)
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Security: non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copy built assets
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/package.json ./

USER appuser

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  postgres_data:
  redis_data:
```

---

## Testing

### Jest Unit Tests
```typescript
// __tests__/utils/validation.test.ts
import { validateEmail, validatePassword, sanitizeInput } from '@/utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should require minimum 8 characters', () => {
      expect(validatePassword('Short1!')).toEqual({
        valid: false,
        errors: ['Password must be at least 8 characters'],
      });
    });

    it('should require uppercase, lowercase, number, and symbol', () => {
      expect(validatePassword('password123')).toEqual({
        valid: false,
        errors: expect.arrayContaining([
          'Password must contain at least one uppercase letter',
          'Password must contain at least one symbol',
        ]),
      });
    });

    it('should accept valid passwords', () => {
      expect(validatePassword('ValidPass123!')).toEqual({
        valid: true,
        errors: [],
      });
    });
  });
});
```

### Integration Test
```typescript
// __tests__/api/users.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('Users API', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          name: 'Test User',
          password: 'Password123!',
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        email: 'test@example.com',
        name: 'Test User',
      });
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 400 for duplicate email', async () => {
      // Create first user
      await prisma.user.create({
        data: {
          email: 'existing@example.com',
          name: 'Existing User',
          password: 'hashed',
        },
      });

      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'existing@example.com',
          name: 'New User',
          password: 'Password123!',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('email');
    });
  });
});
```
