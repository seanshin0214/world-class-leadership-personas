# Frontend Development & Modern Web 2025

**Updated**: 2025-11-24 | **Focus**: React, TypeScript, Performance, Responsive Design

---

## React Fundamentals

```typescript
// COMPONENTS (Function components, modern approach)

import React, { useState, useEffect } from 'react';

// Props & TypeScript
interface UserCardProps {
  name: string;
  email: string;
  avatar?: string; // Optional
  onEdit?: () => void;
}

function UserCard({ name, email, avatar, onEdit }: UserCardProps) {
  return (
    <div className="user-card">
      {avatar && <img src={avatar} alt={name} />}
      <h3>{name}</h3>
      <p>{email}</p>
      {onEdit && <button onClick={onEdit}>Edit</button>}
    </div>
  );
}

---

// STATE (useState)

function Counter() {
  const [count, setCount] = useState(0); // Initial state = 0
  
  const increment = () => {
    setCount(count + 1);
    // Or: setCount(prev => prev + 1); // Functional update (safer)
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}

// Multiple state variables
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };
  
  if (submitted) {
    return <div>Thanks, {name}!</div>;
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

---

// EFFECTS (useEffect - side effects)

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Runs after render
    async function fetchUser() {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setUser(data);
      setLoading(false);
    }
    
    fetchUser();
    
    // Cleanup (runs before next effect or unmount)
    return () => {
      // Cancel requests, clear timers, etc.
    };
  }, [userId]); // Dependency array: re-run when userId changes
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;
  
  return <div>{user.name}</div>;
}

// useEffect patterns:
useEffect(() => {}, []); // Runs once (component mount)
useEffect(() => {}); // Runs every render (usually wrong!)
useEffect(() => {}, [dep1, dep2]); // Runs when deps change

---

// CUSTOM HOOKS (Reusable logic)

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network error');
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function UserList() {
  const { data: users, loading, error } = useFetch<User[]>('/api/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

---

// CONTEXT (Global state, avoid prop drilling)

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use context
function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </header>
  );
}

---

// REFS (Access DOM elements, persist values across renders)

function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const focusInput = () => {
    inputRef.current?.focus();
  };
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

// Persist value without triggering re-render
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef<number | null>(null);
  
  const startTimer = () => {
    intervalRef.current = window.setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };
  
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  
  useEffect(() => {
    return () => stopTimer(); // Cleanup
  }, []);
  
  return (
    <div>
      <p>{count} seconds</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}

---

// PERFORMANCE (useMemo, useCallback)

// useMemo: Memoize expensive calculations
function SearchResults({ query, items }: { query: string; items: Item[] }) {
  const filteredItems = useMemo(() => {
    // Only recalculate when query or items change
    return items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, items]);
  
  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// useCallback: Memoize function (prevent re-creating on every render)
function Parent() {
  const [count, setCount] = useState(0);
  
  // Without useCallback, new function created every render
  // Child re-renders even if props don't change (reference changed)
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // No dependencies = function never changes
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <Child onClick={handleClick} />
    </div>
  );
}

const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click me</button>;
});
```

---

## TypeScript for React

```typescript
// TYPES & INTERFACES

// Component props
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

// Function component type
const Button: React.FC<ButtonProps> = ({ label, onClick, disabled, variant = 'primary' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};

---

// EVENT TYPES

function Form() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ...
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Clicked');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}

---

// GENERICS

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
<List
  items={[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]}
  renderItem={(user) => <span>{user.name}</span>}
/>

---

// TYPE vs INTERFACE

// Use interface for objects (extensible)
interface User {
  id: number;
  name: string;
}

interface Admin extends User {
  role: 'admin';
}

// Use type for unions, intersections, primitives
type Status = 'idle' | 'loading' | 'success' | 'error';

type UserOrAdmin = User | Admin;

type UserWithTimestamps = User & {
  createdAt: Date;
  updatedAt: Date;
};
```

---

## CSS & Styling

```typescript
// TAILWIND CSS (Utility-first)

function Card() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Title</h2>
      <p className="text-gray-600">Description</p>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Action
      </button>
    </div>
  );
}

// Responsive
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

// Dark mode
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  Auto dark mode
</div>

---

// CSS MODULES (Scoped CSS)

// styles.module.css
.container {
  padding: 20px;
  background: white;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

// Component.tsx
import styles from './styles.module.css';

function Component() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hello</h1>
    </div>
  );
}

---

// STYLED-COMPONENTS (CSS-in-JS)

import styled from 'styled-components';

const Button = styled.button<{ primary?: boolean }>`
  background: ${props => props.primary ? '#0070f3' : '#eaeaea'};
  color: ${props => props.primary ? 'white' : 'black'};
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

// Usage
<Button primary>Primary</Button>
<Button>Secondary</Button>
```

---

## Performance Optimization

```typescript
// CODE SPLITTING (Lazy load components)

import React, { Suspense, lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}

// Route-based code splitting (React Router)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

<Routes>
  <Route path="/" element={<Suspense fallback={<Loading />}><Home /></Suspense>} />
  <Route path="/about" element={<Suspense fallback={<Loading />}><About /></Suspense>} />
</Routes>

---

// IMAGE OPTIMIZATION

// Next.js Image component (automatic optimization)
import Image from 'next/image';

<Image
  src="/profile.jpg"
  alt="Profile"
  width={500}
  height={500}
  priority // Load immediately (above fold)
  placeholder="blur" // Show blur while loading
/>

// Lazy load images (vanilla)
<img
  src="placeholder.jpg"
  data-src="actual-image.jpg"
  loading="lazy"
  alt="Description"
/>

---

// BUNDLE SIZE

// Tree shaking (import only what you need)
// ❌ Imports entire library
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ Import specific function
import debounce from 'lodash/debounce';
debounce(fn, 300);

// Analyze bundle
npm run build
npx vite-bundle-visualizer # Vite
npx webpack-bundle-analyzer # Webpack

---

// WEB VITALS (Performance metrics)

// Largest Contentful Paint (LCP): <2.5s
// First Input Delay (FID): <100ms
// Cumulative Layout Shift (CLS): <0.1

// Measure
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

---

## Responsive Design

```css
/* MOBILE-FIRST (Start with mobile, add desktop) */

/* Mobile (default) */
.container {
  padding: 16px;
  font-size: 14px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    font-size: 16px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    font-size: 18px;
    max-width: 1200px;
    margin: 0 auto;
  }
}

---

/* FLEXBOX */

.container {
  display: flex;
  gap: 16px;
  flex-wrap: wrap; /* Wrap on small screens */
}

.item {
  flex: 1 1 300px; /* Grow, shrink, base width */
  /* = min-width: 300px, expands to fill */
}

---

/* GRID */

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  /* Auto-fit: Columns adjust to container */
  /* minmax: Min 250px, max 1fr (equal) */
  gap: 20px;
}

---

/* VIEWPORT UNITS */

.hero {
  height: 100vh; /* 100% of viewport height */
  width: 100vw; /* 100% of viewport width */
}

.responsive-text {
  font-size: clamp(16px, 2vw, 24px);
  /* Min 16px, preferred 2% of viewport, max 24px */
}

---

/* CONTAINER QUERIES (New, modern browsers) */

.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

---

## Accessibility (a11y)

```typescript
// SEMANTIC HTML

// ❌ Bad (divs for everything)
<div onClick={handleClick}>Button</div>

// ✅ Good (semantic elements)
<button onClick={handleClick}>Button</button>

---

// ARIA ATTRIBUTES

// Button with icon only
<button aria-label="Close">
  <XIcon />
</button>

// Loading state
<button aria-busy={loading} disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</button>

// Expanded state (dropdown)
<button aria-expanded={isOpen} aria-controls="menu-id">
  Menu
</button>
<div id="menu-id" hidden={!isOpen}>
  {/* Menu items */}
</div>

---

// KEYBOARD NAVIGATION

function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isOpen) return;
    
    // Focus trap
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;
    
    firstElement?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title">Modal Title</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

---

// FORM ACCESSIBILITY

<form>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? 'email-error' : undefined}
  />
  {hasError && <span id="email-error" role="alert">Invalid email</span>}
</form>
```

---

## Key Takeaways

1. **Component thinking** - Reusable, composable, single responsibility
2. **TypeScript** - Catch errors early, better autocomplete, self-documenting
3. **Performance** - Code splitting, lazy loading, optimize images (80% users mobile)
4. **Responsive** - Mobile-first, test on real devices (not just browser resize)
5. **Accessibility** - Not optional (legal requirement, moral imperative, better UX for all)

---

## References

- React Documentation (react.dev)
- TypeScript Handbook
- "Learning React" - Alex Banks & Eve Porcello

**Related**: `react-patterns.md`, `nextjs-fullstack.md`, `performance-optimization.md`
