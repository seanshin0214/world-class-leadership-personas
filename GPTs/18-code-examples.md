# Code Examples - Cross-Domain Reference

## Backend Development

### Node.js Express API

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
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Protected route example
app.get('/api/users',
  authenticate,
  authorize(['admin', 'manager']),
  async (req, res) => {
    const users = await User.findAll({ limit: 100 });
    res.json(users);
  }
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});
```

### Python FastAPI

```python
# main.py - FastAPI with authentication
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import jwt

app = FastAPI(title="API", version="1.0.0")
security = HTTPBearer()

class User(BaseModel):
    email: EmailStr
    name: str
    role: str = "user"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SECRET_KEY,
            algorithms=["HS256"]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/users", response_model=List[User])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(verify_token)
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return await User.get_all(skip=skip, limit=limit)

@app.post("/users", response_model=User, status_code=201)
async def create_user(user: UserCreate):
    existing = await User.get_by_email(user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    return await User.create(**user.dict())
```

---

## Frontend Development

### React with TypeScript

```tsx
// components/UserList.tsx
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface UserListProps {
  onUserSelect?: (user: User) => void;
}

export function UserList({ onUserSelect }: UserListProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users', search],
    queryFn: () => fetchUsers({ search }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleDelete = useCallback((id: string) => {
    if (confirm('Delete this user?')) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  if (isLoading) return <Skeleton count={5} />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search users..."
      />
      <ul className="divide-y divide-gray-200">
        {users?.map((user) => (
          <li key={user.id} className="py-4 flex justify-between">
            <button
              onClick={() => onUserSelect?.(user)}
              className="text-left hover:bg-gray-50 p-2 rounded"
            >
              <p className="font-medium">{user.name}</p>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </button>
            <button
              onClick={() => handleDelete(user.id)}
              disabled={deleteMutation.isPending}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Custom React Hook

```tsx
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}
```

---

## Database Operations

### PostgreSQL Queries

```sql
-- Optimized query with index hints
CREATE INDEX CONCURRENTLY idx_orders_user_date
ON orders(user_id, created_at DESC);

-- Window function for ranking
SELECT
    user_id,
    order_date,
    total,
    ROW_NUMBER() OVER (
        PARTITION BY user_id
        ORDER BY total DESC
    ) as rank
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '30 days';

-- CTE for complex aggregation
WITH monthly_stats AS (
    SELECT
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as orders,
        SUM(total) as revenue
    FROM orders
    WHERE status = 'completed'
    GROUP BY 1
)
SELECT
    month,
    orders,
    revenue,
    revenue / NULLIF(orders, 0) as avg_order_value,
    LAG(revenue) OVER (ORDER BY month) as prev_month_revenue,
    (revenue - LAG(revenue) OVER (ORDER BY month)) /
        NULLIF(LAG(revenue) OVER (ORDER BY month), 0) * 100 as growth_pct
FROM monthly_stats
ORDER BY month DESC;
```

---

## AI/ML Code

### RAG Pipeline

```python
# rag_pipeline.py
from openai import OpenAI
from pinecone import Pinecone
import numpy as np

class RAGPipeline:
    def __init__(self, openai_key: str, pinecone_key: str, index_name: str):
        self.openai = OpenAI(api_key=openai_key)
        self.pc = Pinecone(api_key=pinecone_key)
        self.index = self.pc.Index(index_name)

    def embed(self, text: str) -> list[float]:
        response = self.openai.embeddings.create(
            model="text-embedding-3-large",
            input=text
        )
        return response.data[0].embedding

    def retrieve(self, query: str, top_k: int = 5) -> list[dict]:
        embedding = self.embed(query)
        results = self.index.query(
            vector=embedding,
            top_k=top_k,
            include_metadata=True
        )
        return [
            {"text": m.metadata["text"], "score": m.score}
            for m in results.matches
        ]

    def generate(self, query: str, context: list[dict]) -> str:
        context_text = "\n\n".join([c["text"] for c in context])
        messages = [
            {"role": "system", "content": "Answer based on the context provided."},
            {"role": "user", "content": f"Context:\n{context_text}\n\nQuestion: {query}"}
        ]
        response = self.openai.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=messages,
            temperature=0.1
        )
        return response.choices[0].message.content

    def query(self, question: str) -> dict:
        context = self.retrieve(question)
        answer = self.generate(question, context)
        return {"answer": answer, "sources": context}
```

---

## DevOps/Infrastructure

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/app
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: app
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d app"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI/CD

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
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --production
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy:
    needs: [test, security]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: |
          echo "Deploying to production..."
```

---

## Expert Activation

```
@fullstack-developer
@backend-engineer
@frontend-engineer
@database-engineer
@devops-engineer
@llm-engineer
```
or describe your coding challenge
