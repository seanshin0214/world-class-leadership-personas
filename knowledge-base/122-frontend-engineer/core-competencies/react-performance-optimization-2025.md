# React Performance Optimization 2025

**Updated**: 2025-11-23 | **Stack**: React 19, TypeScript, Vite

---

## Performance Metrics

```javascript
// Core Web Vitals

// LCP (Largest Contentful Paint): <2.5s
// Goal: Main content loads quickly
// Measured: Largest image or text block visible

// FID (First Input Delay): <100ms
// Goal: Page responds to interaction quickly
// Measured: Time from click to browser response

// CLS (Cumulative Layout Shift): <0.1
// Goal: Visual stability (no sudden jumps)
// Measured: Unexpected layout shifts

// Measure with web-vitals library
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);

// Or use Lighthouse (Chrome DevTools)
// Performance tab → Record → Analyze
```

---

## React.memo & Memoization

```typescript
// React.memo: Prevent re-renders if props unchanged

// WITHOUT memo (re-renders on every parent render)
const ExpensiveComponent = ({ data }: { data: string }) => {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
};

// WITH memo (only re-renders if data changes)
const ExpensiveComponent = React.memo(({ data }: { data: string }) => {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
});

// Custom comparison function
const ExpensiveComponent = React.memo(
  ({ user }: { user: User }) => <div>{user.name}</div>,
  (prevProps, nextProps) => {
    // Return true if props are equal (skip render)
    return prevProps.user.id === nextProps.user.id;
  }
);

---

// useMemo: Memoize expensive calculations

function ProductList({ products }: { products: Product[] }) {
  // WITHOUT useMemo (recalculates on every render)
  const sortedProducts = products.sort((a, b) => b.price - a.price);
  
  // WITH useMemo (only recalculates when products change)
  const sortedProducts = useMemo(
    () => products.sort((a, b) => b.price - a.price),
    [products]
  );
  
  return (
    <ul>
      {sortedProducts.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}

---

// useCallback: Memoize function references

function Parent() {
  const [count, setCount] = useState(0);
  
  // WITHOUT useCallback (new function on every render)
  const handleClick = () => console.log('Clicked');
  
  // WITH useCallback (same function reference)
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // Empty deps = never changes
  
  return <Child onClick={handleClick} />;
}

const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log('Rendering Child');
  return <button onClick={onClick}>Click</button>;
});

// Without useCallback, Child re-renders every time Parent renders
// With useCallback, Child only renders if onClick changes
```

---

## Code Splitting & Lazy Loading

```typescript
// React.lazy: Load components on demand

// BEFORE (all code in main bundle)
import Dashboard from './Dashboard';
import Settings from './Settings';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

// AFTER (split into separate chunks)
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}

// Result:
// main.js: 100KB → 50KB
// Dashboard.js: 30KB (loaded only when visiting /dashboard)
// Settings.js: 20KB (loaded only when visiting /settings)

---

// Preload on hover (UX optimization)
const Dashboard = lazy(() => import('./Dashboard'));

function Nav() {
  const preloadDashboard = () => {
    import('./Dashboard'); // Preload chunk
  };
  
  return (
    <Link 
      to="/dashboard" 
      onMouseEnter={preloadDashboard} // Preload on hover
    >
      Dashboard
    </Link>
  );
}

---

// Dynamic imports with error handling
const Dashboard = lazy(() =>
  import('./Dashboard').catch(() => ({
    default: () => <div>Failed to load Dashboard</div>
  }))
);
```

---

## Virtual Scrolling

```typescript
// React Virtuoso: Render only visible items

import { Virtuoso } from 'react-virtuoso';

// WITHOUT virtualization (renders 10,000 DOM nodes)
function BadList({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map(item => (
        <div key={item.id} style={{ height: 50 }}>
          {item.name}
        </div>
      ))}
    </div>
  );
}
// Problem: Slow rendering, high memory usage

// WITH virtualization (renders ~20 visible nodes)
function GoodList({ items }: { items: Item[] }) {
  return (
    <Virtuoso
      style={{ height: 600 }}
      data={items}
      itemContent={(index, item) => (
        <div style={{ height: 50 }}>
          {item.name}
        </div>
      )}
    />
  );
}
// Result: Fast, low memory (only renders what's visible)

---

// react-window (alternative)
import { FixedSizeList } from 'react-window';

function GoodList({ items }: { items: Item[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </FixedSizeList>
  );
}
```

---

## Image Optimization

```typescript
// Lazy load images (native browser API)

function LazyImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img 
      src={src} 
      alt={alt}
      loading="lazy" // Browser handles lazy loading
      decoding="async" // Non-blocking decode
    />
  );
}

---

// Responsive images (serve correct size)
<img
  src="/image-800.jpg"
  srcSet="
    /image-400.jpg 400w,
    /image-800.jpg 800w,
    /image-1200.jpg 1200w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Product"
/>
// Browser picks best image based on device width

---

// Next.js Image component (automatic optimization)
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  placeholder="blur" // Show blur while loading
  blurDataURL="data:image/jpeg;base64,..." // Low-quality placeholder
/>
// Features:
// - Automatic WebP conversion
// - Responsive sizes
// - Lazy loading
// - Blur placeholder

---

// Blur placeholder generator
// Use https://blurha.sh/ or:
import { getPlaiceholder } from 'plaiceholder';

const { base64 } = await getPlaiceholder('/photo.jpg');
```

---

## Bundle Size Optimization

```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer

# Output shows:
# react-dom: 130KB
# lodash: 70KB (problem!)
# my-code: 50KB

---

# Fix: Use lodash-es (tree-shakeable)
# BEFORE
import _ from 'lodash';
_.debounce(fn, 300);
# Bundle: 70KB

# AFTER
import { debounce } from 'lodash-es';
debounce(fn, 300);
# Bundle: 2KB (only debounce function)

---

# Remove unused dependencies
npm uninstall moment # 67KB
npm install date-fns # 13KB (tree-shakeable)

---

# Dynamic imports for heavy libraries
// BEFORE (Chart.js always loaded)
import { Line } from 'react-chartjs-2';

// AFTER (Chart.js only loaded when needed)
const Chart = lazy(() => import('./Chart'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <Chart />
        </Suspense>
      )}
    </div>
  );
}
```

---

## Debouncing & Throttling

```typescript
// Debounce: Execute after delay (last call wins)
import { useDebouncedCallback } from 'use-debounce';

function SearchInput() {
  const [search, setSearch] = useState('');
  
  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      // API call
      fetch(`/api/search?q=${value}`);
    },
    300 // Wait 300ms after user stops typing
  );
  
  return (
    <input
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}
// Without debounce: API call on every keystroke (10+ calls)
// With debounce: API call only when user stops typing (1 call)

---

// Throttle: Execute at most once per interval
import { useThrottledCallback } from 'use-debounce';

function ScrollTracker() {
  const throttledScroll = useThrottledCallback(
    () => {
      console.log('Scroll position:', window.scrollY);
    },
    1000 // Execute at most once per second
  );
  
  useEffect(() => {
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);
  
  return <div>Scroll down...</div>;
}
// Without throttle: 100+ events per second
// With throttle: 1 event per second
```

---

## React Query Optimization

```typescript
// Stale-while-revalidate pattern

import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
  
  return <div>{user?.name}</div>;
}

// How it works:
// 1. First render: Fetch from API, cache result
// 2. Re-render within 5 min: Use cached data (no fetch)
// 3. Re-render after 5 min: Show cached data, fetch in background
// 4. Update UI when fresh data arrives

---

// Prefetch data
import { useQueryClient } from '@tanstack/react-query';

function UserList() {
  const queryClient = useQueryClient();
  
  const prefetchUser = (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    });
  };
  
  return (
    <ul>
      {users.map(user => (
        <li 
          key={user.id}
          onMouseEnter={() => prefetchUser(user.id)} // Prefetch on hover
        >
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  );
}
// Result: Instant page load (data already cached)

---

// Optimistic updates (instant UI)
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    
    // Snapshot previous value
    const previousTodos = queryClient.getQueryData(['todos']);
    
    // Optimistically update cache
    queryClient.setQueryData(['todos'], (old: Todo[]) => 
      old.map(todo => todo.id === newTodo.id ? newTodo : todo)
    );
    
    // Return context with snapshot
    return { previousTodos };
  },
  onError: (err, newTodo, context) => {
    // Rollback on error
    queryClient.setQueryData(['todos'], context?.previousTodos);
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});

// Usage
<button onClick={() => mutation.mutate({ id: 1, done: true })}>
  Mark Done
</button>
// UI updates instantly, then syncs with server
```

---

## React DevTools Profiler

```typescript
// Find performance bottlenecks

// 1. Open Chrome DevTools → Profiler tab
// 2. Click Record
// 3. Interact with app
// 4. Stop recording

// Analysis:
// - Flame graph (component render time)
// - Ranked (slowest components first)
// - Why component rendered (props change, state change, parent render)

// Example findings:
// ❌ <ExpensiveList> renders on every parent render (50ms)
// ✅ Wrap with React.memo → Only renders when data changes (1ms)

---

// Programmatic profiling
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  console.log(`${id} took ${actualDuration}ms to render`);
  
  // Send to analytics
  if (actualDuration > 16) { // 16ms = 60fps threshold
    analytics.track('Slow Render', {
      component: id,
      duration: actualDuration,
    });
  }
}

<Profiler id="Dashboard" onRender={onRenderCallback}>
  <Dashboard />
</Profiler>
```

---

## Key Takeaways

1. **Measure first** - Use Lighthouse, React DevTools Profiler
2. **React.memo** - For expensive components with stable props
3. **Code splitting** - Lazy load routes, heavy components
4. **Virtual scrolling** - For long lists (>100 items)
5. **Optimize images** - Lazy load, responsive, WebP format

---

## References

- React Docs: Performance
- web.dev: Core Web Vitals
- "Optimizing Performance" - React Team

**Related**: `react-19-features.md`, `vite-optimization.md`, `web-performance.md`
