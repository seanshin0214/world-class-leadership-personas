# Full-Stack Web Development 2025

**Updated**: 2025-11-23 | **Stack**: React, Node.js, PostgreSQL, TypeScript

---

## Modern Full-Stack Architecture

```
FRONTEND (React + TypeScript)
- UI Components
- State Management (Zustand, React Query)
- Routing (React Router)
- Build Tool (Vite)

↕️ REST API / GraphQL

BACKEND (Node.js + Express)
- API Routes
- Business Logic
- Authentication (JWT)
- File Upload (S3)

↕️ Database Connection

DATABASE (PostgreSQL)
- Relational Data
- Indexes
- Transactions

↕️ Caching Layer

CACHE (Redis)
- Session Storage
- API Response Caching
- Rate Limiting

DEPLOYMENT
- Frontend: Vercel, Netlify
- Backend: Railway, Render, AWS ECS
- Database: Neon, Supabase, AWS RDS
```

---

## React Frontend (TypeScript)

```typescript
// Modern React with TypeScript, React Query, Zustand

// API client
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  createdAt: string;
}

// API functions
export const todoApi = {
  getAll: () => api.get<Todo[]>('/todos').then(res => res.data),
  create: (text: string) => api.post<Todo>('/todos', { text }).then(res => res.data),
  update: (id: string, data: Partial<Todo>) => 
    api.patch<Todo>(`/todos/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/todos/${id}`),
};

// Zustand store (global state)
import { create } from 'zustand';

interface AuthStore {
  token: string | null;
  user: { id: string; email: string } | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
}));

// Component with React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function TodoList() {
  const queryClient = useQueryClient();
  
  // Fetch todos
  const { data: todos, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: todoApi.getAll,
  });
  
  // Create todo mutation
  const createMutation = useMutation({
    mutationFn: todoApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: todoApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
  
  const [inputText, setInputText] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      createMutation.mutate(inputText);
      setInputText('');
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>
      
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          {createMutation.isPending ? 'Adding...' : 'Add'}
        </button>
      </form>
      
      <ul className="space-y-2">
        {todos?.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 p-3 bg-white rounded-lg shadow">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => 
                useMutation({
                  mutationFn: () => todoApi.update(todo.id, { completed: !todo.completed }),
                  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
                }).mutate()
              }
              className="w-5 h-5"
            />
            <span className={todo.completed ? 'line-through text-gray-500' : ''}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteMutation.mutate(todo.id)}
              className="ml-auto text-red-500 hover:text-red-700"
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

---

## Node.js Backend (Express + TypeScript)

```typescript
// src/index.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Types
interface AuthRequest extends express.Request {
  user?: { userId: string };
}

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const todoSchema = z.object({
  text: z.string().min(1).max(500),
});

// Auth middleware
const authenticateToken = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded as { userId: string };
    next();
  });
};

// Routes

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);
    
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: { id: true, email: true, name: true },
    });
    
    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    
    res.status(201).json({ token, user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/todos
app.get('/api/todos', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/todos
app.post('/api/todos', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { text } = todoSchema.parse(req.body);
    
    const todo = await prisma.todo.create({
      data: {
        text,
        userId: req.user!.userId,
      },
    });
    
    res.status(201).json(todo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/todos/:id
app.patch('/api/todos/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    
    // Check ownership
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== req.user!.userId) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const updated = await prisma.todo.update({
      where: { id },
      data: { text, completed },
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/todos/:id
app.delete('/api/todos/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== req.user!.userId) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    await prisma.todo.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Database (Prisma ORM)

```prisma
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
  password  String
  name      String
  todos     Todo[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Todo {
  id        String   @id @default(cuid())
  text      String
  completed Boolean  @default(false)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
}

// Commands:
// npx prisma init
// npx prisma migrate dev --name init
// npx prisma generate
// npx prisma studio (visual DB browser)
```

---

## Environment Variables

```.env
# .env (don't commit to Git!)

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"

# JWT
JWT_SECRET="your-super-secret-key-change-this"

# API
PORT=3000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3000/api
```

---

## Deployment

```yaml
# Railway (backend)
# Connect GitHub repo, Railway auto-deploys

# Environment variables in Railway dashboard:
# DATABASE_URL (provided by Railway Postgres)
# JWT_SECRET
# NODE_ENV=production

# Build command: npm run build
# Start command: npm start

---

# Vercel (frontend)
# Connect GitHub repo, auto-deploys

# Environment variables:
# VITE_API_URL=https://your-backend.railway.app/api

# Build command: npm run build
# Output directory: dist

---

# Docker (full-stack)

# Dockerfile (backend)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]

# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/mydb
      JWT_SECRET: secret
    depends_on:
      - db
  
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:3000/api

volumes:
  postgres_data:
```

---

## Key Takeaways

1. **TypeScript everywhere** - Type safety prevents bugs
2. **Prisma ORM** - Type-safe database queries, migrations
3. **React Query** - Server state management (caching, refetching)
4. **JWT auth** - Stateless, scalable authentication
5. **Deploy early** - Get feedback, iterate

---

## References

- React Docs (react.dev)
- Prisma Docs
- Railway Deploy Guide
- Vercel Documentation

**Related**: `react-advanced-patterns.md`, `nodejs-best-practices.md`, `postgresql-optimization.md`
