# API Design & Architecture 2025

**Updated**: 2025-11-23 | **Stack**: REST, GraphQL, gRPC, OpenAPI

---

## API Design Principles

```
1. CONSISTENCY
   - Use same patterns across all endpoints
   - Predictable naming (plural nouns: /users, /posts)
   - Consistent error format

2. SIMPLICITY
   - One way to do things (not 3 different patterns)
   - Clear, descriptive names
   - Hide complexity from client

3. VERSIONING
   - Never break existing clients
   - Version in URL (/v1/users) or header
   - Deprecation policy (6-12 months notice)

4. DOCUMENTATION
   - OpenAPI/Swagger spec
   - Examples for every endpoint
   - Error codes documented

5. PERFORMANCE
   - Pagination for lists
   - Field filtering (?fields=id,name)
   - Caching headers
   - Rate limiting
```

---

## RESTful API Design

### Resource Naming

```
GOOD:
GET    /api/v1/users              # List users
GET    /api/v1/users/123          # Get user
POST   /api/v1/users              # Create user
PUT    /api/v1/users/123          # Update user (full)
PATCH  /api/v1/users/123          # Update user (partial)
DELETE /api/v1/users/123          # Delete user

GET    /api/v1/users/123/posts   # User's posts (nested resource)
GET    /api/v1/posts?userId=123  # Alternative (query param)

BAD:
GET    /api/v1/getAllUsers        # Verb in URL
POST   /api/v1/user               # Singular noun
GET    /api/v1/user/get/123       # Redundant "get"
POST   /api/v1/users/123/delete   # DELETE method, not POST
```

### HTTP Status Codes

```
2xx SUCCESS:
200 OK                  # GET, PUT, PATCH success
201 Created             # POST success
202 Accepted            # Async operation started
204 No Content          # DELETE success

3xx REDIRECTION:
301 Moved Permanently   # Resource moved, update bookmarks
304 Not Modified        # Client cache still valid

4xx CLIENT ERRORS:
400 Bad Request         # Invalid JSON, validation error
401 Unauthorized        # Missing/invalid auth token
403 Forbidden           # Valid token, but no permission
404 Not Found           # Resource doesn't exist
409 Conflict            # State conflict (e.g., duplicate email)
422 Unprocessable Entity# Validation error (semantic)
429 Too Many Requests   # Rate limit exceeded

5xx SERVER ERRORS:
500 Internal Server Error  # Bug in server code
502 Bad Gateway            # Upstream service down
503 Service Unavailable    # Server overloaded
504 Gateway Timeout        # Upstream timeout
```

### Request/Response Examples

```typescript
// POST /api/v1/users
// Request:
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "admin"
}

// Response: 201 Created
{
  "id": "usr_1234567890",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "admin",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}

// GET /api/v1/users?page=2&limit=20&sort=-createdAt
// Response: 200 OK
{
  "data": [
    {
      "id": "usr_1234567890",
      "email": "user@example.com",
      "name": "John Doe"
    },
    // ... 19 more users
  ],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  },
  "links": {
    "self": "/api/v1/users?page=2&limit=20",
    "first": "/api/v1/users?page=1&limit=20",
    "prev": "/api/v1/users?page=1&limit=20",
    "next": "/api/v1/users?page=3&limit=20",
    "last": "/api/v1/users?page=8&limit=20"
  }
}

// Error Response (Validation):
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "name",
        "message": "Name must be at least 2 characters"
      }
    ],
    "requestId": "req_abc123xyz",
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

---

## GraphQL API Design

### Schema Design

```graphql
type Query {
  # Single resource
  user(id: ID!): User
  
  # List with filtering/pagination
  users(
    page: Int = 1
    limit: Int = 20
    role: UserRole
    searchTerm: String
  ): UserConnection!
  
  # Nested data (avoid N+1)
  userWithPosts(id: ID!): UserWithPosts
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!
  deleteUser(id: ID!): DeleteUserPayload!
}

type User {
  id: ID!
  email: String!
  name: String!
  role: UserRole!
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Relationship (lazy-loaded)
  posts(first: Int, after: String): PostConnection
}

enum UserRole {
  ADMIN
  USER
  GUEST
}

# Pagination (Relay spec)
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

# Input types
input CreateUserInput {
  email: String!
  name: String!
  role: UserRole = USER
}

# Payload types (includes errors)
type CreateUserPayload {
  user: User
  errors: [UserError!]
}

type UserError {
  message: String!
  field: String
  code: String!
}
```

### Resolver Optimization (N+1 Problem)

```typescript
import DataLoader from 'dataloader';

// BAD: N+1 queries
const users = await User.findAll();
for (const user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } });
}
// 1 query for users + N queries for posts = 1 + N queries

// GOOD: DataLoader batches requests
const postLoader = new DataLoader(async (userIds) => {
  const posts = await Post.findAll({
    where: { userId: { in: userIds } }
  });
  
  // Group by userId
  const postsByUser = {};
  for (const post of posts) {
    if (!postsByUser[post.userId]) {
      postsByUser[post.userId] = [];
    }
    postsByUser[post.userId].push(post);
  }
  
  return userIds.map(id => postsByUser[id] || []);
});

// Resolver
const resolvers = {
  User: {
    posts: (user, args, context) => {
      return context.postLoader.load(user.id);
    }
  }
};

// Result: 1 query for users + 1 batched query for all posts
```

---

## gRPC for High-Performance

### Protocol Buffer Definition

```protobuf
syntax = "proto3";

package user.v1;

service UserService {
  rpc GetUser (GetUserRequest) returns (GetUserResponse);
  rpc ListUsers (ListUsersRequest) returns (ListUsersResponse);
  rpc CreateUser (CreateUserRequest) returns (CreateUserResponse);
  rpc UpdateUser (UpdateUserRequest) returns (UpdateUserResponse);
  rpc DeleteUser (DeleteUserRequest) returns (DeleteUserResponse);
  
  // Server streaming (for real-time updates)
  rpc WatchUser (WatchUserRequest) returns (stream UserEvent);
}

message User {
  string id = 1;
  string email = 2;
  string name = 3;
  UserRole role = 4;
  int64 created_at = 5;  // Unix timestamp
  int64 updated_at = 6;
}

enum UserRole {
  USER_ROLE_UNSPECIFIED = 0;
  USER_ROLE_ADMIN = 1;
  USER_ROLE_USER = 2;
  USER_ROLE_GUEST = 3;
}

message GetUserRequest {
  string id = 1;
}

message GetUserResponse {
  User user = 1;
}

message ListUsersRequest {
  int32 page = 1;
  int32 limit = 2;
  optional UserRole role = 3;
}

message ListUsersResponse {
  repeated User users = 1;
  int32 total_count = 2;
}
```

### gRPC Server (Node.js)

```typescript
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('user.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(proto.user.v1.UserService.service, {
  async getUser(call, callback) {
    try {
      const user = await User.findById(call.request.id);
      
      if (!user) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'User not found'
        });
      }
      
      callback(null, { user });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message
      });
    }
  },
  
  async listUsers(call, callback) {
    const { page = 1, limit = 20, role } = call.request;
    
    const users = await User.findAll({
      where: role ? { role } : {},
      offset: (page - 1) * limit,
      limit
    });
    
    const totalCount = await User.count({ where: role ? { role } : {} });
    
    callback(null, { users, totalCount });
  }
});

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) throw err;
    console.log(`gRPC server running on port ${port}`);
    server.start();
  }
);
```

---

## API Versioning Strategies

```
1. URL VERSIONING (Most common, recommended)
   /api/v1/users
   /api/v2/users
   
   Pros: Clear, easy to route, cache-friendly
   Cons: Duplicates URLs

2. HEADER VERSIONING
   GET /api/users
   Accept: application/vnd.company.v1+json
   
   Pros: Clean URLs
   Cons: Harder to test (need header), caching issues

3. QUERY PARAMETER
   GET /api/users?version=1
   
   Pros: Simple
   Cons: Easy to forget, ugly URLs

MIGRATION STRATEGY:
- V1: Stable, maintained
- V2: New features, breaking changes
- V1 deprecated: 6-12 month notice
- V1 sunset: Remove after deprecation period

VERSIONING POLICY:
MAJOR version (v1 → v2): Breaking changes
- Change response structure
- Remove fields
- Rename fields

MINOR version (no version change): Additive
- Add new endpoints
- Add optional fields
- Add new query parameters
```

---

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis();

// General API rate limit
const limiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
      retryAfter: 900 // seconds
    }
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this IP',
        retryAfter: req.rateLimit.resetTime
      }
    });
  }
});

// Stricter limit for expensive endpoints
const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
});

app.use('/api/', limiter);
app.use('/api/search', strictLimiter);

// Response headers:
// X-RateLimit-Limit: 100
// X-RateLimit-Remaining: 73
// X-RateLimit-Reset: 1610000000
```

---

## OpenAPI/Swagger Documentation

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
  description: API for managing users
  contact:
    name: API Support
    email: api@company.com

servers:
  - url: https://api.company.com/v1
    description: Production
  - url: https://staging-api.company.com/v1
    description: Staging

paths:
  /users:
    get:
      summary: List users
      operationId: listUsers
      tags:
        - Users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
        '429':
          $ref: '#/components/responses/RateLimitError'

components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
        - name
      properties:
        id:
          type: string
          example: usr_1234567890
        email:
          type: string
          format: email
          example: user@example.com
        name:
          type: string
          minLength: 2
          maxLength: 100
          example: John Doe
        role:
          type: string
          enum: [admin, user, guest]
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

  responses:
    RateLimitError:
      description: Rate limit exceeded
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - BearerAuth: []
```

---

## Key Takeaways

1. **Consistency > creativity** - Predictable patterns, easy to learn
2. **Document everything** - OpenAPI spec, examples, error codes
3. **Version carefully** - Never break existing clients
4. **Optimize for performance** - Pagination, field filtering, caching
5. **Monitor & rate limit** - Protect your API from abuse

---

## References

- "REST API Design Rulebook" - Mark Massé
- GraphQL Best Practices (graphql.org)
- gRPC Documentation
- OpenAPI Specification

**Related**: `rest-api-patterns.md`, `graphql-schema-design.md`, `api-security.md`
