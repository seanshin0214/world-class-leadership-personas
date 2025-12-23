# Modern Full-Stack Development 2025

**Last Updated**: 2025-11-23  
**Stack**: React 19, Next.js 15, TypeScript 5.9, Node.js 22

---

## The 2025 Reality Check

**What's Actually Worth Your Time**:
- ✅ React 19 + Server Components
- ✅ Next.js 15 (App Router)
- ✅ TypeScript everywhere
- ✅ Tailwind CSS + shadcn/ui
- ✅ Postgres + Prisma/Drizzle
- ✅ Vercel/Netlify deployment

**What's Overhyped**:
- ❌ Micro-frontends (unless huge scale)
- ❌ Over-engineered state management
- ❌ GraphQL for simple apps
- ❌ Blockchain for everything

---

## React 19 Key Changes

### Server Components (RSC)

```tsx
// app/posts/page.tsx (Server Component)
async function PostsPage() {
  const posts = await db.post.findMany();  // Direct DB access!
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

**Benefits**:
- Zero JavaScript to client for data fetching
- Direct database/API calls
- Better SEO
- Faster initial load

### Actions (Server Actions)

```tsx
// app/actions.ts
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  const content = formData.get('content');
  
  await db.post.create({
    data: { title, content }
  });
  
  revalidatePath('/posts');  // Refresh cache
}

// app/new-post/page.tsx
import { createPost } from './actions';

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" />
      <textarea name="content" />
      <button>Create</button>
    </form>
  );
}
```

**Advantages**:
- No API routes needed
- Type-safe
- Automatic revalidation

### use() Hook

```tsx
function BlogPost({ postPromise }) {
  const post = use(postPromise);  // Suspends until resolved
  
  return <article>{post.content}</article>;
}

function Page({ params }) {
  const postPromise = fetchPost(params.id);
  
  return (
    <Suspense fallback={<Skeleton />}>
      <BlogPost postPromise={postPromise} />
    </Suspense>
  );
}
```

---

## Next.js 15 App Router Patterns

### File-based Routing

```
app/
├── (marketing)/
│   ├── page.tsx           → /
│   ├── about/page.tsx     → /about
│   └── pricing/page.tsx   → /pricing
├── (dashboard)/
│   ├── layout.tsx         → Shared layout
│   ├── page.tsx           → /dashboard
│   └── settings/page.tsx  → /dashboard/settings
└── api/
    └── posts/route.ts     → /api/posts
```

### Loading & Error States

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
}

// app/dashboard/error.tsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Parallel Routes

```
app/
└── dashboard/
    ├── @analytics/page.tsx
    ├── @revenue/page.tsx
    └── page.tsx

// app/dashboard/page.tsx
export default function Dashboard({ analytics, revenue }) {
  return (
    <div>
      {analytics}
      {revenue}
    </div>
  );
}
```

---

## TypeScript 5.9 Best Practices

### Satisfies Operator

```typescript
const config = {
  endpoint: "https://api.example.com",
  timeout: 5000,
  retries: 3
} satisfies Config;  // Type-check without widening

config.endpoint.toUpperCase();  // Works! Type is string, not Config
```

### Template Literal Types

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = `/api/${string}`;
type Request = `${HttpMethod} ${Endpoint}`;

const validRequest: Request = 'GET /api/users';  // ✓
const invalid: Request = 'PATCH /users';  // ✗ Type error
```

### Utility Types

```typescript
// Pick specific properties
type UserPreview = Pick<User, 'id' | 'name' | 'avatar'>;

// Omit properties
type UserWithoutPassword = Omit<User, 'password'>;

// Partial (all optional)
type PartialUser = Partial<User>;

// Required (all required)
type RequiredConfig = Required<Config>;
```

---

## Database: Postgres + Prisma

### Schema Definition

```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Type-safe Queries

```typescript
// Prisma generates types automatically
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    }
  }
});

// user.posts is typed as Post[]!
```

### Transactions

```typescript
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'new@example.com', name: 'New User' }
  });
  
  await tx.post.create({
    data: {
      title: 'First Post',
      authorId: user.id,
      published: true
    }
  });
});
```

---

## Styling: Tailwind + shadcn/ui

### Tailwind v3.4

```tsx
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>

// Dark mode
<button className="bg-white dark:bg-gray-800 text-black dark:text-white">
  Toggle Theme
</button>

// Arbitrary values
<div className="top-[117px] lg:top-[344px]">
  Custom positioning
</div>
```

### shadcn/ui Components

```bash
# Install shadcn/ui
npx shadcn-ui@latest init

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
```

```tsx
// components/ui/button.tsx (you own this code!)
import { cn } from "@/lib/utils";

export function Button({ className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "px-4 py-2 text-sm font-medium",
        className
      )}
      {...props}
    />
  );
}
```

**Advantage**: Copy-paste, fully customizable, no package dependency

---

## Authentication: NextAuth.js v5

```typescript
// auth.config.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    }
  }
});

// app/api/auth/[...nextauth]/route.ts
export { handlers as GET, handlers as POST };

// middleware.ts
export { auth as middleware } from "./auth";

export const config = {
  matcher: ["/dashboard/:path*"]
};
```

---

## Deployment: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Environment Variables

```bash
# .env.local (not committed)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
GITHUB_ID="..."
GITHUB_SECRET="..."

# vercel.com dashboard
# Add same variables in Settings → Environment Variables
```

### Edge Functions

```typescript
// app/api/edge/route.ts
export const runtime = 'edge';

export async function GET(request: Request) {
  return Response.json({ message: 'Hello from Edge!' });
}
```

**Benefit**: Global, <50ms response time

---

## Performance Optimization

### Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority  // Load immediately (above fold)
  placeholder="blur"  // Show blur while loading
/>
```

**Automatic**:
- WebP/AVIF conversion
- Responsive sizing
- Lazy loading

### Code Splitting

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false  // Client-side only
});
```

### Metadata API

```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage]
    }
  };
}
```

---

## Testing Strategy

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { add } from './math';

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

### Integration Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('user can sign in', async ({ page }) => {
  await page.goto('/sign-in');
  await page.fill('[name=email]', 'user@example.com');
  await page.fill('[name=password]', 'password123');
  await page.click('button[type=submit]');
  
  await expect(page).toHaveURL('/dashboard');
});
```

---

## Common Pitfalls

### ❌ Over-fetching in Server Components

```tsx
// Bad: Fetches all users (could be millions!)
async function UsersPage() {
  const users = await prisma.user.findMany();  // 💥
  return <UserList users={users} />;
}

// Good: Pagination
async function UsersPage({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const users = await prisma.user.findMany({
    take: 20,
    skip: (page - 1) * 20
  });
  return <UserList users={users} page={page} />;
}
```

### ❌ Mixing Server/Client Components Wrong

```tsx
// Bad: Can't use hooks in Server Component
async function Page() {
  const [count, setCount] = useState(0);  // ✗ Error!
  return <div>{count}</div>;
}

// Good: Separate concerns
async function Page() {
  const data = await fetchData();  // Server
  return <ClientCounter initialData={data} />;  // Client
}

// components/ClientCounter.tsx
'use client';

export function ClientCounter({ initialData }) {
  const [count, setCount] = useState(initialData);
  return <div onClick={() => setCount(c => c + 1)}>{count}</div>;
}
```

---

## Quick Start Template

```bash
npx create-next-app@latest my-app \
  --typescript \
  --tailwind \
  --app \
  --import-alias "@/*"

cd my-app
npm install prisma @prisma/client next-auth@beta
npx prisma init
npm run dev
```

---

## References

- Next.js 15 Documentation
- React 19 Upgrade Guide
- TypeScript Handbook 5.9
- Prisma Best Practices
- Vercel Deployment Guide

**Related**: `react-patterns.md`, `typescript-advanced.md`, `database-optimization.md`
