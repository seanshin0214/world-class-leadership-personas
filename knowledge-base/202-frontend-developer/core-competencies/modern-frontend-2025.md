# Modern Frontend Development 2025

**Updated**: 2025-11-23 | **Stack**: React 19, TypeScript, Vite, TailwindCSS

---

## The Frontend Landscape 2025

### What Actually Matters

```
✅ ESSENTIAL:
- React 19 (Server Components, Actions)
- TypeScript everywhere
- Vite (build tool)
- TailwindCSS + shadcn/ui
- React Query (server state)
- Zustand (client state)

❌ OVERHYPED:
- CSS-in-JS (performance issues)
- Redux (too complex for most apps)
- Webpack (Vite is faster)
- jQuery (2010s tech)
```

---

## React 19 Revolution

### Server Components Reality Check

```tsx
// ❌ OLD WAY: Client-side data fetching
'use client';
import { useEffect, useState } from 'react';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(setPosts);
  }, []);
  
  return posts.map(post => <PostCard key={post.id} post={post} />);
}

// Problems:
// - Loading state flicker
// - SEO issues
// - Waterfall requests
// - Larger bundle size
```

```tsx
// ✅ NEW WAY: Server Components
import { db } from '@/lib/db';

export default async function Posts() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  
  return posts.map(post => <PostCard key={post.id} post={post} />);
}

// Benefits:
// ✓ No loading state needed
// ✓ Perfect SEO
// ✓ Zero JavaScript to client
// ✓ Direct database access
```

### Server Actions (The Game Changer)

```tsx
// app/actions.ts
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  // Validation
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' };
  }
  
  // Database operation
  const post = await db.post.create({
    data: { title, content, authorId: await getSessionUserId() }
  });
  
  // Revalidate cache
  revalidatePath('/posts');
  
  return { success: true, post };
}

// app/new-post/page.tsx
import { createPost } from '../actions';

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}

// Magic:
// - No API route needed
// - Type-safe
// - Automatic revalidation
// - Progressive enhancement (works without JS!)
```

### use() Hook Pattern

```tsx
import { use, Suspense } from 'react';

async function fetchPost(id: string) {
  const res = await fetch(`/api/posts/${id}`);
  return res.json();
}

function PostContent({ postPromise }: { postPromise: Promise<Post> }) {
  const post = use(postPromise);  // Suspends until resolved
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}

export default function PostPage({ params }: { params: { id: string } }) {
  // Start fetching immediately (parallel)
  const postPromise = fetchPost(params.id);
  const commentsPromise = fetchComments(params.id);
  
  return (
    <>
      <Suspense fallback={<PostSkeleton />}>
        <PostContent postPromise={postPromise} />
      </Suspense>
      
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </>
  );
}

// Pattern: Start fetching early, suspend when needed
```

---

## TypeScript Mastery

### Advanced Patterns 2025

```typescript
// Type-safe form handling
type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
};

type FormState<T extends Record<string, any>> = {
  [K in keyof T]: FormField<T[K]>;
};

// Usage
type LoginForm = {
  email: string;
  password: string;
};

const [form, setForm] = useState<FormState<LoginForm>>({
  email: { value: '', touched: false },
  password: { value: '', touched: false }
});

// Type-safe API responses
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  try {
    const res = await fetch(`/api/users/${id}`);
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Discriminated unions for state
type LoadingState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function UserProfile({ userId }: { userId: number }) {
  const [state, setState] = useState<LoadingState<User>>({ status: 'idle' });
  
  // TypeScript knows exact shape based on status
  if (state.status === 'success') {
    return <div>{state.data.name}</div>;  // state.data exists
  }
  
  if (state.status === 'error') {
    return <div>Error: {state.error}</div>;  // state.error exists
  }
  
  return <div>Loading...</div>;
}
```

---

## State Management 2025

### React Query for Server State

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query
function PostsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,  // 5 minutes
    cacheTime: 10 * 60 * 1000  // 10 minutes
  });
  
  if (isLoading) return <Skeleton />;
  if (error) return <Error />;
  
  return data.map(post => <PostCard key={post.id} post={post} />);
}

// Mutation with optimistic update
function LikeButton({ postId }: { postId: number }) {
  const queryClient = useQueryClient();
  
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    },
    onMutate: async () => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['posts', postId] });
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(['posts', postId]);
      
      // Optimistically update
      queryClient.setQueryData(['posts', postId], (old: Post) => ({
        ...old,
        likes: old.likes + 1
      }));
      
      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['posts', postId], context?.previous);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    }
  });
  
  return (
    <button onClick={() => mutate()} disabled={isPending}>
      Like {isPending && '...'}
    </button>
  );
}
```

### Zustand for Client State

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
};

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      
      clearCart: () => set({ items: [] }),
      
      total: () => get().items.reduce((sum, item) => sum + item.price, 0)
    }),
    { name: 'cart-storage' }  // Persists to localStorage
  )
);

// Usage
function Cart() {
  const { items, removeItem, total } = useCartStore();
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {item.name} - ${item.price}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <div>Total: ${total()}</div>
    </div>
  );
}
```

---

## Performance Optimization

### Code Splitting Done Right

```typescript
import { lazy, Suspense } from 'react';

// ❌ BAD: Import everything
import AdminPanel from './AdminPanel';
import UserDashboard from './UserDashboard';

// ✅ GOOD: Lazy load heavy components
const AdminPanel = lazy(() => import('./AdminPanel'));
const UserDashboard = lazy(() => import('./UserDashboard'));

function App() {
  const { user } = useAuth();
  
  return (
    <Suspense fallback={<Loading />}>
      {user.role === 'admin' ? <AdminPanel /> : <UserDashboard />}
    </Suspense>
  );
}

// Advanced: Preload on hover
function Navigation() {
  const preloadAdmin = () => import('./AdminPanel');
  
  return (
    <nav>
      <Link 
        to="/admin" 
        onMouseEnter={preloadAdmin}  // Preload on hover
      >
        Admin
      </Link>
    </nav>
  );
}
```

### Virtual Scrolling for Large Lists

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function LargeList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,  // Estimated row height
    overscan: 5  // Render 5 extra items for smooth scrolling
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            <ItemCard item={items[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Renders only visible items (e.g., 12 out of 10,000)
```

---

## Accessibility (A11y)

### Keyboard Navigation

```typescript
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        setIsOpen(true);
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((i) => (i + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((i) => (i - 1 + items.length) % items.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        items[focusedIndex].onClick();
        setIsOpen(false);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      itemsRef.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isOpen]);
  
  return (
    <div onKeyDown={handleKeyDown}>
      <button onClick={() => setIsOpen(!isOpen)} aria-haspopup="true" aria-expanded={isOpen}>
        Menu
      </button>
      {isOpen && (
        <div role="menu">
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(el) => (itemsRef.current[index] = el)}
              role="menuitem"
              tabIndex={focusedIndex === index ? 0 : -1}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Testing Strategy

### Vitest + React Testing Library

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
  it('submits form with valid credentials', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    
    render(<LoginForm onSubmit={onSubmit} />);
    
    // Type in fields
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Assert
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123'
      });
    });
  });
  
  it('shows error for invalid email', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab();  // Blur
    
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

---

## Key Takeaways

1. **React 19 is a paradigm shift** - Server Components + Actions eliminate most APIs
2. **TypeScript everywhere** - Type safety saves hours of debugging
3. **React Query** - Perfect for server state (fetching, caching, sync)
4. **Zustand** - Simple client state (UI, temp data)
5. **Performance matters** - Code splitting, virtual scrolling, memoization
6. **Accessibility is non-negotiable** - Keyboard nav, ARIA, screen readers

---

## References

- React 19 Documentation
- TypeScript Handbook 5.9
- "Testing JavaScript" - Kent C. Dodds
- Web.dev Performance Guide

**Related**: `react-patterns.md`, `typescript-advanced.md`, `performance.md`
