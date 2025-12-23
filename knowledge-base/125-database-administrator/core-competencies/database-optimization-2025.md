# Database Administration & Optimization 2025

**Updated**: 2025-11-23 | **Stack**: PostgreSQL, MySQL, MongoDB, Redis

---

## Query Optimization

### EXPLAIN ANALYZE

```sql
-- PostgreSQL
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5;

-- Output analysis:
Seq Scan on users (cost=0.00..1250.00 rows=10000)  ❌ BAD
Index Scan on users_created_at_idx (cost=0.42..123.45 rows=500)  ✅ GOOD
```

### Indexing Strategy

```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (order matters!)
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- Partial index
CREATE INDEX idx_active_users ON users(id) WHERE active = true;

-- Covering index
CREATE INDEX idx_users_profile ON users(id) INCLUDE (name, email);
```

---

## Performance Tuning

### Connection Pooling

```python
# PgBouncer config
[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
reserve_pool_size = 5
```

### Vacuum & Analyze

```sql
-- Regular maintenance
VACUUM ANALYZE users;

-- Aggressive cleanup
VACUUM FULL users;

-- Auto-vacuum settings (postgresql.conf)
autovacuum = on
autovacuum_max_workers = 4
autovacuum_naptime = 1min
```

---

## Backup & Recovery

```bash
# Full backup (PostgreSQL)
pg_dump -Fc mydb > backup_$(date +%Y%m%d).dump

# Restore
pg_restore -d mydb backup_20250123.dump

# Point-in-time recovery
# Enable WAL archiving in postgresql.conf:
wal_level = replica
archive_mode = on
archive_command = 'cp %p /archive/%f'

# Restore to specific time
pg_restore --target-time='2025-01-23 14:30:00'
```

---

## Replication

### Master-Replica Setup

```sql
-- Master (postgresql.conf)
wal_level = replica
max_wal_senders = 3
wal_keep_size = 64

-- Replica
primary_conninfo = 'host=master port=5432 user=replicator'
hot_standby = on
```

---

## Monitoring Queries

```sql
-- Long-running queries
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active'
  AND now() - query_start > interval '5 minutes'
ORDER BY duration DESC;

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;

-- Index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## NoSQL: MongoDB

```javascript
// Create compound index
db.users.createIndex({ email: 1, created_at: -1 });

// Query with projection
db.users.find(
  { status: "active" },
  { name: 1, email: 1, _id: 0 }
);

// Aggregation pipeline
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: {
      _id: "$user_id",
      total: { $sum: "$amount" },
      count: { $sum: 1 }
  }},
  { $sort: { total: -1 } },
  { $limit: 10 }
]);
```

---

## Caching: Redis

```python
import redis

r = redis.Redis(host='localhost', port=6379, db=0)

# Cache with expiration
r.setex('user:123', 3600, json.dumps(user_data))

# Get cached data
cached = r.get('user:123')
if cached:
    return json.loads(cached)

# Cache invalidation
r.delete('user:123')

# Pub/Sub for cache invalidation
r.publish('cache:invalidate', 'user:123')
```

---

## References

- "High Performance MySQL"
- PostgreSQL Documentation
- MongoDB Performance Best Practices

**Related**: `sql-optimization.md`, `redis-caching.md`
