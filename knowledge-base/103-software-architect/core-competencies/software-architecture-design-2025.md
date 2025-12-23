# Software Architecture & System Design 2025

**Updated**: 2025-11-23 | **Focus**: Design Patterns, Scalability, Trade-offs

---

## Architecture Patterns

```markdown
MONOLITHIC:
- Single codebase, single deployment
- Pros: Simple, easy to develop/test
- Cons: Tight coupling, hard to scale
- Use: Small teams, MVP, low traffic

MICROSERVICES:
- Independent services, separate deployments
- Pros: Scalable, fault isolation, tech diversity
- Cons: Complex, network overhead, distributed tracing
- Use: Large teams, high scale, polyglot needs

SERVERLESS:
- Functions-as-a-Service (AWS Lambda)
- Pros: Auto-scaling, pay-per-use, no servers
- Cons: Cold starts, vendor lock-in, debugging
- Use: Event-driven, sporadic traffic, quick prototypes

EVENT-DRIVEN:
- Services communicate via events (Kafka, RabbitMQ)
- Pros: Loose coupling, async processing, scalable
- Cons: Eventual consistency, debugging complexity
- Use: Real-time systems, high throughput
```

---

## Design Patterns

### Creational Patterns

```typescript
// SINGLETON (Single instance)
class Database {
  private static instance: Database;
  
  private constructor() {}
  
  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true

---

// FACTORY (Create objects without specifying exact class)
interface Animal {
  speak(): string;
}

class Dog implements Animal {
  speak() { return 'Woof!'; }
}

class Cat implements Animal {
  speak() { return 'Meow!'; }
}

class AnimalFactory {
  static create(type: string): Animal {
    switch (type) {
      case 'dog': return new Dog();
      case 'cat': return new Cat();
      default: throw new Error('Unknown animal');
    }
  }
}

const dog = AnimalFactory.create('dog');

---

// BUILDER (Construct complex objects step-by-step)
class Pizza {
  size?: string;
  cheese?: boolean;
  pepperoni?: boolean;
  vegetables?: string[];
}

class PizzaBuilder {
  private pizza = new Pizza();
  
  setSize(size: string) {
    this.pizza.size = size;
    return this;
  }
  
  addCheese() {
    this.pizza.cheese = true;
    return this;
  }
  
  addPepperoni() {
    this.pizza.pepperoni = true;
    return this;
  }
  
  addVegetables(veggies: string[]) {
    this.pizza.vegetables = veggies;
    return this;
  }
  
  build(): Pizza {
    return this.pizza;
  }
}

const pizza = new PizzaBuilder()
  .setSize('large')
  .addCheese()
  .addPepperoni()
  .addVegetables(['onions', 'peppers'])
  .build();
```

---

### Structural Patterns

```typescript
// ADAPTER (Convert interface to another)
class OldAPI {
  getData(): string {
    return 'old_format_data';
  }
}

interface NewAPI {
  fetchData(): { data: string };
}

class APIAdapter implements NewAPI {
  constructor(private oldAPI: OldAPI) {}
  
  fetchData() {
    const data = this.oldAPI.getData();
    return { data }; // Convert to new format
  }
}

const oldAPI = new OldAPI();
const adapter = new APIAdapter(oldAPI);
adapter.fetchData(); // { data: 'old_format_data' }

---

// DECORATOR (Add behavior without modifying class)
interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost() { return 5; }
  description() { return 'Simple coffee'; }
}

class MilkDecorator implements Coffee {
  constructor(private coffee: Coffee) {}
  
  cost() {
    return this.coffee.cost() + 2;
  }
  
  description() {
    return this.coffee.description() + ', milk';
  }
}

class SugarDecorator implements Coffee {
  constructor(private coffee: Coffee) {}
  
  cost() {
    return this.coffee.cost() + 1;
  }
  
  description() {
    return this.coffee.description() + ', sugar';
  }
}

let coffee: Coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
console.log(coffee.description()); // "Simple coffee, milk, sugar"
console.log(coffee.cost()); // 8

---

// PROXY (Control access to object)
interface Image {
  display(): void;
}

class RealImage implements Image {
  constructor(private filename: string) {
    this.loadFromDisk();
  }
  
  loadFromDisk() {
    console.log(`Loading ${this.filename}`);
  }
  
  display() {
    console.log(`Displaying ${this.filename}`);
  }
}

class ProxyImage implements Image {
  private realImage?: RealImage;
  
  constructor(private filename: string) {}
  
  display() {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename); // Lazy load
    }
    this.realImage.display();
  }
}

const image = new ProxyImage('photo.jpg'); // Not loaded yet
image.display(); // Now loads & displays
```

---

### Behavioral Patterns

```typescript
// STRATEGY (Interchangeable algorithms)
interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
  pay(amount: number) {
    console.log(`Paid $${amount} with credit card`);
  }
}

class PayPalPayment implements PaymentStrategy {
  pay(amount: number) {
    console.log(`Paid $${amount} with PayPal`);
  }
}

class ShoppingCart {
  constructor(private paymentStrategy: PaymentStrategy) {}
  
  checkout(amount: number) {
    this.paymentStrategy.pay(amount);
  }
}

const cart = new ShoppingCart(new CreditCardPayment());
cart.checkout(100); // "Paid $100 with credit card"

---

// OBSERVER (One-to-many dependency)
interface Observer {
  update(data: any): void;
}

class Subject {
  private observers: Observer[] = [];
  
  attach(observer: Observer) {
    this.observers.push(observer);
  }
  
  detach(observer: Observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }
  
  notify(data: any) {
    this.observers.forEach(o => o.update(data));
  }
}

class EmailNotifier implements Observer {
  update(data: any) {
    console.log(`Sending email: ${data}`);
  }
}

class SMSNotifier implements Observer {
  update(data: any) {
    console.log(`Sending SMS: ${data}`);
  }
}

const subject = new Subject();
subject.attach(new EmailNotifier());
subject.attach(new SMSNotifier());
subject.notify('Order placed'); // Notifies all observers

---

// COMMAND (Encapsulate request as object)
interface Command {
  execute(): void;
  undo(): void;
}

class Light {
  on() { console.log('Light ON'); }
  off() { console.log('Light OFF'); }
}

class LightOnCommand implements Command {
  constructor(private light: Light) {}
  
  execute() {
    this.light.on();
  }
  
  undo() {
    this.light.off();
  }
}

class RemoteControl {
  private history: Command[] = [];
  
  execute(command: Command) {
    command.execute();
    this.history.push(command);
  }
  
  undo() {
    const command = this.history.pop();
    if (command) {
      command.undo();
    }
  }
}

const light = new Light();
const remote = new RemoteControl();
remote.execute(new LightOnCommand(light)); // "Light ON"
remote.undo(); // "Light OFF"
```

---

## System Design Concepts

### CAP Theorem

```markdown
CAP: Choose 2 of 3

CONSISTENCY:
- All nodes see same data at same time
- Reads return latest write

AVAILABILITY:
- Every request gets response (success or failure)
- No downtime

PARTITION TOLERANCE:
- System continues despite network failures
- Nodes can't communicate

TRADE-OFFS:

CP (Consistency + Partition Tolerance):
- Sacrifice availability
- Example: MongoDB, HBase
- Use: Banking, financial transactions

AP (Availability + Partition Tolerance):
- Sacrifice consistency (eventual consistency)
- Example: Cassandra, DynamoDB
- Use: Social media, analytics

CA (Consistency + Availability):
- Sacrifice partition tolerance (not realistic in distributed systems)
- Example: Traditional RDBMS (single node)
- Use: Not recommended for distributed systems
```

---

### Database Sharding

```markdown
SHARDING: Split database horizontally across multiple servers

STRATEGIES:

RANGE-BASED:
- User IDs 1-1M → Shard 1
- User IDs 1M-2M → Shard 2
- Pros: Simple, range queries easy
- Cons: Uneven distribution (hotspots)

HASH-BASED:
- hash(user_id) % num_shards → Shard
- Pros: Even distribution
- Cons: Range queries hard, adding shards difficult

GEOGRAPHIC:
- US users → US shard
- EU users → EU shard
- Pros: Low latency, compliance
- Cons: Uneven load

DIRECTORY-BASED:
- Lookup table: user_id → shard
- Pros: Flexible
- Cons: Extra lookup, single point of failure

CHALLENGES:
- Joins across shards (avoid or application-level)
- Transactions across shards (distributed transactions)
- Rebalancing (when adding/removing shards)
```

---

### Caching Strategies

```markdown
CACHE-ASIDE (Lazy loading):
1. Check cache
2. If miss, query DB
3. Store in cache
4. Return data

Pros: Only cache what's needed
Cons: Cache miss penalty, stale data

---

WRITE-THROUGH:
1. Write to cache
2. Immediately write to DB
3. Return success

Pros: Cache always fresh
Cons: Write latency, wasted cache

---

WRITE-BACK (Write-behind):
1. Write to cache
2. Async write to DB later
3. Return success immediately

Pros: Fast writes
Cons: Data loss risk (if cache fails before DB write)

---

EVICTION POLICIES:

LRU (Least Recently Used):
- Remove least recently accessed item
- Good for general use

LFU (Least Frequently Used):
- Remove least frequently accessed item
- Good for hotspot data

FIFO (First In, First Out):
- Remove oldest item
- Simple, but not optimal

TTL (Time To Live):
- Expire after X seconds
- Good for time-sensitive data

---

CACHE STAMPEDE:
Problem: Cache expires, many requests hit DB simultaneously

Solution:
1. Lock (first request fetches, others wait)
2. Probabilistic early expiration (refresh before expiry)
3. Always return stale data while fetching new
```

---

## Trade-offs

```markdown
CONSISTENCY vs AVAILABILITY:
Strong consistency = Lower availability
Eventual consistency = Higher availability

SQL vs NoSQL:
SQL: ACID, relations, schema
NoSQL: Scale, flexible schema, eventual consistency

SYNCHRONOUS vs ASYNCHRONOUS:
Sync: Immediate response, blocking
Async: Non-blocking, complex error handling

NORMALIZATION vs DENORMALIZATION:
Normalized: No duplication, joins required
Denormalized: Fast reads, data duplication

MICROSERVICES vs MONOLITH:
Microservices: Scale, complexity
Monolith: Simple, single point of failure

PULL vs PUSH:
Pull: Client requests data (polling)
Push: Server sends data (WebSockets, SSE)

VERTICAL vs HORIZONTAL SCALING:
Vertical: More powerful machine (limited)
Horizontal: More machines (unlimited, complex)
```

---

## Load Balancing

```markdown
ALGORITHMS:

ROUND ROBIN:
- Requests distributed evenly (1, 2, 3, 1, 2, 3...)
- Pros: Simple, fair
- Cons: Doesn't consider server load

LEAST CONNECTIONS:
- Route to server with fewest active connections
- Pros: Better for long-lived connections
- Cons: More overhead

WEIGHTED:
- Servers assigned weights (more powerful = higher weight)
- Pros: Accounts for capacity differences
- Cons: Manual configuration

IP HASH:
- hash(client_ip) → server
- Pros: Session affinity (same client → same server)
- Cons: Uneven distribution

HEALTH CHECKS:
- Periodically ping servers
- Remove unhealthy servers from pool
- Add back when healthy
```

---

## API Gateway

```markdown
RESPONSIBILITIES:

ROUTING:
- Route requests to appropriate microservice
- Path-based: /users → User service
- Header-based: API version routing

AUTHENTICATION:
- Verify JWT tokens
- Single point of auth (don't duplicate in each service)

RATE LIMITING:
- 100 requests per minute per user
- Protect backend from abuse

CACHING:
- Cache responses for read-heavy endpoints
- Reduce backend load

AGGREGATION:
- Call multiple services, combine responses
- Example: Dashboard (users + orders + analytics)

REQUEST/RESPONSE TRANSFORMATION:
- Modify headers, body
- Protocol translation (REST → gRPC)

MONITORING:
- Log all requests
- Track latency, errors
- Distributed tracing (Jaeger, Zipkin)

TOOLS:
- Kong
- AWS API Gateway
- NGINX
- Envoy
```

---

## Key Takeaways

1. **No silver bullet** - Every architecture has trade-offs
2. **Start simple** - Monolith first, split when needed
3. **Measure before optimizing** - Don't premature optimize
4. **Design for failure** - Circuit breakers, retries, timeouts
5. **Document decisions** - ADRs (Architecture Decision Records)

---

## References

- "Designing Data-Intensive Applications" - Martin Kleppmann
- "System Design Interview" - Alex Xu
- "Clean Architecture" - Robert Martin

**Related**: `microservices-patterns.md`, `distributed-systems.md`, `scalability-handbook.md`
