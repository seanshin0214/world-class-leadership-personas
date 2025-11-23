# Software Engineering Fundamentals 2025

**Updated**: 2025-11-24 | **Focus**: Clean Code, Data Structures, System Design, Best Practices

---

## Clean Code Principles

```typescript
// BAD: Magic numbers, unclear names, no comments
function calc(x: number): number {
  return x * 0.9 + 5;
}

// GOOD: Named constants, clear function name, self-documenting
const TAX_RATE = 0.9;
const SHIPPING_FEE = 5;

function calculateOrderTotal(subtotal: number): number {
  return subtotal * TAX_RATE + SHIPPING_FEE;
}

---

// BAD: Long function, multiple responsibilities
function processUser(user: any) {
  // Validate
  if (!user.email) return false;
  if (!user.name) return false;
  
  // Save to database
  db.insert('users', user);
  
  // Send email
  sendWelcomeEmail(user.email);
  
  // Log
  console.log('User created:', user.id);
  
  return true;
}

// GOOD: Single Responsibility Principle (SRP)
function validateUser(user: User): boolean {
  return !!user.email && !!user.name;
}

function saveUser(user: User): void {
  db.insert('users', user);
}

function sendWelcomeEmail(email: string): void {
  emailService.send({
    to: email,
    subject: 'Welcome!',
    template: 'welcome'
  });
}

function processUser(user: User): boolean {
  if (!validateUser(user)) return false;
  
  saveUser(user);
  sendWelcomeEmail(user.email);
  logger.info('User created', { userId: user.id });
  
  return true;
}

---

// BAD: Deeply nested conditions
function getDiscount(user, order) {
  if (user) {
    if (user.isPremium) {
      if (order.total > 100) {
        if (order.items.length > 5) {
          return 0.2;
        }
        return 0.1;
      }
      return 0.05;
    }
    return 0;
  }
  return 0;
}

// GOOD: Early returns, guard clauses
function getDiscount(user: User | null, order: Order): number {
  if (!user || !user.isPremium) return 0;
  if (order.total <= 100) return 0.05;
  if (order.items.length > 5) return 0.2;
  return 0.1;
}

---

NAMING CONVENTIONS:

// Variables & Functions: camelCase
const userCount = 10;
function getUserById(id: number) {}

// Classes: PascalCase
class UserService {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';

// Private properties: _prefix (convention)
class User {
  private _password: string;
}

// Booleans: is/has/can prefix
const isActive = true;
const hasPermission = false;
const canEdit = true;

// Arrays: plural nouns
const users = [];
const orders = [];

// Functions: verb + noun
function getUser() {}
function createOrder() {}
function updateProfile() {}
function deleteComment() {}
```

---

## Data Structures & Algorithms

```typescript
// TIME COMPLEXITY:

// O(1) - Constant: Hash map lookup
const map = new Map([['key', 'value']]);
map.get('key'); // O(1)

// O(log n) - Logarithmic: Binary search
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}

// O(n) - Linear: Single loop
function findMax(arr: number[]): number {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// O(n log n) - Linearithmic: Merge sort, quick sort
arr.sort((a, b) => a - b); // JavaScript uses Timsort: O(n log n)

// O(n²) - Quadratic: Nested loops
function bubbleSort(arr: number[]): number[] {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

---

// COMMON DATA STRUCTURES:

// 1. ARRAY
const arr = [1, 2, 3];
arr.push(4);       // O(1) - Add to end
arr.pop();         // O(1) - Remove from end
arr.shift();       // O(n) - Remove from start (shifts all)
arr.unshift(0);    // O(n) - Add to start (shifts all)
arr[2];            // O(1) - Access by index

// 2. HASH MAP (Object/Map)
const map = new Map();
map.set('key', 'value');  // O(1)
map.get('key');           // O(1)
map.has('key');           // O(1)
map.delete('key');        // O(1)

// Use case: Fast lookups, caching
const userCache = new Map<number, User>();

// 3. SET
const set = new Set([1, 2, 3]);
set.add(4);        // O(1)
set.has(3);        // O(1)
set.delete(2);     // O(1)

// Use case: Remove duplicates
const unique = [...new Set([1, 2, 2, 3, 3])]; // [1, 2, 3]

// 4. QUEUE (FIFO - First In First Out)
class Queue<T> {
  private items: T[] = [];
  
  enqueue(item: T): void {
    this.items.push(item);  // O(1)
  }
  
  dequeue(): T | undefined {
    return this.items.shift();  // O(n)
  }
  
  peek(): T | undefined {
    return this.items[0];
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// Use case: Task queue, BFS (breadth-first search)

// 5. STACK (LIFO - Last In First Out)
class Stack<T> {
  private items: T[] = [];
  
  push(item: T): void {
    this.items.push(item);  // O(1)
  }
  
  pop(): T | undefined {
    return this.items.pop();  // O(1)
  }
  
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
}

// Use case: Undo/redo, DFS (depth-first search), call stack

// 6. LINKED LIST
class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;
  
  constructor(value: T) {
    this.value = value;
  }
}

class LinkedList<T> {
  head: ListNode<T> | null = null;
  
  append(value: T): void {
    const newNode = new ListNode(value);
    
    if (!this.head) {
      this.head = newNode;
      return;
    }
    
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }
  
  // Insert at beginning: O(1)
  // Insert at end: O(n)
  // Search: O(n)
  // Delete: O(n)
}

// Use case: When frequent insertions/deletions at beginning

// 7. BINARY SEARCH TREE
class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;
  
  constructor(value: T) {
    this.value = value;
  }
}

class BST {
  root: TreeNode<number> | null = null;
  
  insert(value: number): void {
    this.root = this.insertNode(this.root, value);
  }
  
  private insertNode(node: TreeNode<number> | null, value: number): TreeNode<number> {
    if (!node) return new TreeNode(value);
    
    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    }
    
    return node;
  }
  
  search(value: number): boolean {
    return this.searchNode(this.root, value);
  }
  
  private searchNode(node: TreeNode<number> | null, value: number): boolean {
    if (!node) return false;
    if (node.value === value) return true;
    
    if (value < node.value) {
      return this.searchNode(node.left, value);
    } else {
      return this.searchNode(node.right, value);
    }
  }
}

// Balanced BST: O(log n) search, insert, delete
// Unbalanced (worst case): O(n)

---

// COMMON ALGORITHMS:

// TWO POINTERS
function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;
  
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  
  return true;
}

// SLIDING WINDOW
function maxSubarraySum(arr: number[], k: number): number {
  let maxSum = 0;
  let windowSum = 0;
  
  // Initial window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  // Slide window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}

// DYNAMIC PROGRAMMING (Fibonacci)
function fib(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;
  
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}

// Without memoization: O(2^n)
// With memoization: O(n)
```

---

## Design Patterns

```typescript
// 1. SINGLETON (Only one instance)
class Database {
  private static instance: Database;
  private connection: any;
  
  private constructor() {
    this.connection = this.createConnection();
  }
  
  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  
  private createConnection() {
    // Create database connection
    return { connected: true };
  }
  
  query(sql: string) {
    // Execute query
  }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true (same instance)

---

// 2. FACTORY (Create objects without specifying exact class)
interface Button {
  render(): void;
}

class IOSButton implements Button {
  render() {
    console.log('Render iOS button');
  }
}

class AndroidButton implements Button {
  render() {
    console.log('Render Android button');
  }
}

class ButtonFactory {
  static createButton(platform: 'ios' | 'android'): Button {
    switch (platform) {
      case 'ios':
        return new IOSButton();
      case 'android':
        return new AndroidButton();
      default:
        throw new Error('Unknown platform');
    }
  }
}

// Usage
const button = ButtonFactory.createButton('ios');
button.render();

---

// 3. OBSERVER (Pub/Sub pattern)
class EventEmitter {
  private events: Map<string, Function[]> = new Map();
  
  on(event: string, callback: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }
  
  emit(event: string, data?: any): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
  
  off(event: string, callback: Function): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      this.events.set(event, callbacks.filter(cb => cb !== callback));
    }
  }
}

// Usage
const emitter = new EventEmitter();

emitter.on('user:login', (user) => {
  console.log('User logged in:', user);
});

emitter.on('user:login', (user) => {
  console.log('Send welcome email to:', user.email);
});

emitter.emit('user:login', { id: 1, email: 'user@example.com' });

---

// 4. STRATEGY (Select algorithm at runtime)
interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
  constructor(private cardNumber: string) {}
  
  pay(amount: number): void {
    console.log(`Paid $${amount} with credit card ${this.cardNumber}`);
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}
  
  pay(amount: number): void {
    console.log(`Paid $${amount} via PayPal ${this.email}`);
  }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}
  
  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }
  
  processPayment(amount: number): void {
    this.strategy.pay(amount);
  }
}

// Usage
const processor = new PaymentProcessor(new CreditCardPayment('1234-5678'));
processor.processPayment(100);

processor.setStrategy(new PayPalPayment('user@example.com'));
processor.processPayment(50);

---

// 5. DECORATOR (Add functionality dynamically)
interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost() {
    return 5;
  }
  
  description() {
    return 'Simple coffee';
  }
}

class MilkDecorator implements Coffee {
  constructor(private coffee: Coffee) {}
  
  cost() {
    return this.coffee.cost() + 1;
  }
  
  description() {
    return this.coffee.description() + ', milk';
  }
}

class SugarDecorator implements Coffee {
  constructor(private coffee: Coffee) {}
  
  cost() {
    return this.coffee.cost() + 0.5;
  }
  
  description() {
    return this.coffee.description() + ', sugar';
  }
}

// Usage
let coffee: Coffee = new SimpleCoffee();
console.log(coffee.description(), coffee.cost()); // Simple coffee, 5

coffee = new MilkDecorator(coffee);
console.log(coffee.description(), coffee.cost()); // Simple coffee, milk, 6

coffee = new SugarDecorator(coffee);
console.log(coffee.description(), coffee.cost()); // Simple coffee, milk, sugar, 6.5
```

---

## Error Handling

```typescript
// CUSTOM ERRORS
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

---

// TRY-CATCH-FINALLY
async function fetchUser(id: number): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new NotFoundError(`User ${id} not found`);
    }
    
    const user = await response.json();
    
    if (!user.email) {
      throw new ValidationError('Email is required', 'email');
    }
    
    return user;
    
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation failed:', error.field, error.message);
    } else if (error instanceof NotFoundError) {
      console.error('Not found:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    
    throw error; // Re-throw for caller to handle
    
  } finally {
    // Always runs (cleanup, close connections)
    console.log('Request completed');
  }
}

---

// RESULT PATTERN (Alternative to throwing)
type Result<T, E = Error> = 
  | { success: true; value: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return {
      success: false,
      error: new Error('Division by zero')
    };
  }
  
  return {
    success: true,
    value: a / b
  };
}

// Usage
const result = divide(10, 2);

if (result.success) {
  console.log('Result:', result.value);
} else {
  console.error('Error:', result.error.message);
}

---

// ERROR BOUNDARIES (React example)
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Log to error reporting service (Sentry, Rollbar)
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    
    return this.props.children;
  }
}
```

---

## Testing

```typescript
// UNIT TESTS (Vitest/Jest)
import { describe, it, expect } from 'vitest';

describe('calculateTotal', () => {
  it('should calculate total with tax', () => {
    const result = calculateTotal(100);
    expect(result).toBe(105); // 100 * 0.9 + 5
  });
  
  it('should handle zero subtotal', () => {
    const result = calculateTotal(0);
    expect(result).toBe(5); // Only shipping
  });
  
  it('should handle negative subtotal', () => {
    expect(() => calculateTotal(-10)).toThrow('Invalid subtotal');
  });
});

---

// TEST DOUBLES

// 1. STUB (Returns predefined data)
const userRepositoryStub = {
  findById: () => ({ id: 1, name: 'John' })
};

// 2. MOCK (Verify interactions)
const emailServiceMock = {
  send: vi.fn() // Vitest mock function
};

emailServiceMock.send({ to: 'test@example.com', subject: 'Hello' });

expect(emailServiceMock.send).toHaveBeenCalledWith({
  to: 'test@example.com',
  subject: 'Hello'
});

expect(emailServiceMock.send).toHaveBeenCalledTimes(1);

// 3. SPY (Wraps real function, tracks calls)
const consoleLogSpy = vi.spyOn(console, 'log');

logger.info('Test message');

expect(consoleLogSpy).toHaveBeenCalledWith('Test message');

---

// INTEGRATION TESTS
describe('User API', () => {
  it('should create user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        name: 'Test User'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@example.com');
  });
});

---

// TEST COVERAGE
// Aim for: 80%+ coverage (not 100%, diminishing returns)
// Focus on:
// - Critical business logic
// - Complex algorithms
// - Edge cases, error handling
// Skip:
// - Simple getters/setters
// - Third-party code
// - UI components (use E2E instead)
```

---

## Key Takeaways

1. **Clean code** - Readable > clever (code read 10× more than written)
2. **Right tool** - Choose data structure for use case (O(1) lookup = Map, not Array)
3. **SOLID principles** - Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
4. **Test early** - Write tests as you code (not after)
5. **Refactor** - Continuous improvement (don't fear changing working code)

---

## References

- "Clean Code" - Robert C. Martin
- "Cracking the Coding Interview" - Gayle Laakmann McDowell
- "Design Patterns" - Gang of Four

**Related**: `system-design.md`, `database-design.md`, `code-review-checklist.md`
