## I. Redis Overview

### 1.1 What Is Redis?

Redis (Remote Dictionary Server) is an open-source, in-memory key-value database supporting multiple data structures (strings, hashes, lists, sets, sorted sets, etc.). Keeping data in memory makes reads and writes extremely fast. Common uses include caching, session management, message queues, and leaderboards.

**Key Redis features:**

- **High performance:** In-memory storage supports over 100,000 read/write queries per second
- **Rich data structures:** String, Hash, List, Set, Sorted Set, and more
- **Persistence:** Supports RDB snapshots and AOF logs
- **Atomic operations:** Operations are atomic, with transaction support
- **Primary-replica replication:** Synchronization supports separating reads and writes
- **High availability:** Supports Sentinel and Cluster modes

### 1.2 Redis vs. Other Caching Options

| Aspect | Redis | Memcached | Local cache (such as Caffeine / ConcurrentHashMap) |
| --- | --- | --- | --- |
| **Deployment** | Standalone cache service | Standalone cache service | Inside the application process |
| **Access** | Usually TCP | Usually TCP | In-process memory access |
| **Speed** | Very fast | Very fast | Faster |
| **Data structures** | Rich (5+ types) | Strings only | Determined by Java object structures |
| **Persistence** | Supported | Unsupported | Usually not persisted |
| **Sharing** | Shared across instances | Shared across instances | Visible only to the current instance |
| **Cluster scaling** | Native support | Client-side implementation needed | Not suitable for distributed sharing on its own |
| **Typical issues** | Network overhead, serialization, hot keys | Fewer features | Inconsistency between instances, JVM memory usage |

### 1.3 Redis and Local Caches

A **local cache** stores data directly in the current Java application's process memory, using tools such as `ConcurrentHashMap`, **Caffeine**, or **Ehcache**. Both local caches and Redis provide caching, but they address somewhat different needs.

| Aspect | Redis | Local cache |
| --- | --- | --- |
| **Data location** | Memory of a separate Redis process | Memory of the current JVM process |
| **Uses the network** | Yes | No |
| **Requires serialization** | Usually | Usually not, or at a lower cost |
| **Sharing scope** | Multiple application instances | Current instance only |
| **Performance** | High performance; suitable for centralized caching | Faster access; suitable for small hot data |
| **Main risks** | Network instability, hot keys, capacity planning | Memory usage, invalidation management, distributed consistency |

**Local caches** suit frequently read, small datasets that are latency-sensitive and can tolerate brief inconsistency, such as dictionary configuration, read-only metadata, hot rules, and small configuration tables.

Real projects often use **two-level caching**: check the local cache, then Redis, then the database. The local cache handles hot traffic while Redis provides sharing across instances.

> **Note:** In interviews, explain at least that local caches are faster because they avoid network access and remote-cache serialization/deserialization, but only the current instance can use them, making consistency harder in distributed systems.

### 1.4 Common Use Cases

| Scenario | Description | Data structures |
| ------------ | ---------------------------- | ---------------- |
| **Caching** | Cache database query results and hot data | String, Hash |
| **Session management** | Store login state and tokens | String, Hash |
| **Leaderboards** | Game rankings, popular articles | Sorted Set |
| **Counters** | Likes, views, rate limiting | String (INCR) |
| **Message queues** | Simple asynchronous task queues | List, Stream |
| **Distributed locks** | Prevent conflicting concurrent operations | String (SETNX) |
| **Deduplication** | User check-ins, IP statistics | Set, HyperLogLog |
| **Geolocation** | Nearby users, store locations | Geo |

***

## II. Installing Redis

Redis provides source code and precompiled packages. Production deployments commonly use **Docker** for isolation, consistent versions, and integration with orchestration such as Compose or K8s. After installation, use **redis-cli** (Redis's bundled command-line client) to connect, run commands, and troubleshoot. Applications communicate with Redis over TCP; redis-cli is for manual operations and debugging.

### 2.1 Install with Docker (Recommended)

```bash
# Create the data directory
sudo mkdir -p /srv/redis/data /srv/redis/conf

# Create a configuration file (optional; skip to use defaults)
sudo tee /srv/redis/conf/redis.conf > /dev/null <<'EOF'
# Bind address (0.0.0.0 allows external access; restrict it in production)
bind 0.0.0.0
# Port
port 6379
# Password (required in production)
requirepass yourpassword
# Persistence
appendonly yes
# Maximum memory (optional)
# maxmemory 256mb
# Memory eviction policy
# maxmemory-policy allkeys-lru
EOF

# Start the Redis container
docker run -d \
  --name redis \
  -p 6379:6379 \
  -v /srv/redis/data:/data \
  -v /srv/redis/conf/redis.conf:/usr/local/etc/redis/redis.conf \
  --restart unless-stopped \
  redis:7-alpine redis-server /usr/local/etc/redis/redis.conf

# Verify
docker exec -it redis redis-cli -a yourpassword ping
# PONG indicates success

# Enter the interactive command line
docker exec -it redis redis-cli -a yourpassword
```

### 2.2 Docker Compose Installation

```yaml
services:
  redis:
    image: redis:7-alpine
    container_name: redis
    ports:
      - "6379:6379"
    volumes:
      - /srv/redis/data:/data
    command: redis-server --appendonly yes --requirepass yourpassword
    restart: unless-stopped
```

### 2.3 Connecting to Redis

```bash
# Local connection
redis-cli

# Specify host and port
redis-cli -h 127.0.0.1 -p 6379

# Connect with a password
redis-cli -a yourpassword

# Authenticate after connecting
redis-cli
> AUTH yourpassword

# Test the connection
> PING
PONG

# View information
> INFO
```

***

## III. Redis Data Types

Redis values support multiple **data structures**, each with different commands and time complexities; keys are always strings. Choosing an appropriate type simplifies business logic and improves performance.

### 3.1 String

The most basic type, implemented as a Simple Dynamic String (SDS). It can hold strings, integers, or floating-point numbers, up to 512MB per value. It supports expiration and increment/decrement, making it suitable for caches, counters, distributed locks (SET NX EX), sessions/tokens, and other single-value use cases.

```bash
# Set a value
SET name "张三"
SET age 25

# Get a value
GET name

# Set expiration in seconds
SET token "abc123" EX 3600
SETEX token 3600 "abc123"

# Set expiration in milliseconds
SET token "abc123" PX 3600000

# Set only if the key does not exist (common for distributed locks)
SETNX lock "1"
SET lock "1" NX EX 30

# Increment/decrement
INCR counter
INCRBY counter 10
DECR counter
DECRBY counter 5

# Increment a floating-point number
INCRBYFLOAT price 0.5

# Append to a string
APPEND name " 先生"

# Get the length
STRLEN name

# Batch operations
MSET k1 v1 k2 v2 k3 v3
MGET k1 k2 k3
```

### 3.2 Hash

A field-value mapping stores multiple field-value pairs under one key, backed by a hash table. It suits objects split into fields (such as name, age, and email under user:1001). Individual fields can be read or written independently, using less memory and offering finer-grained updates than serializing the entire object as a String. Avoid too many fields in one key (preferably no more than a few thousand), or operations such as HGETALL can block.

```bash
# Set a single field
HSET user:1001 name "张三"
HSET user:1001 age 25

# Set multiple fields at once
HSET user:1001 name "张三" age 25 email "zhangsan@example.com"

# Get one field
HGET user:1001 name

# Get multiple fields
HMGET user:1001 name age

# Get all fields and values
HGETALL user:1001

# Get all field names
HKEYS user:1001

# Get all values
HVALS user:1001

# Check whether a field exists
HEXISTS user:1001 name

# Delete a field
HDEL user:1001 email

# Count fields
HLEN user:1001

# Increment a field value
HINCRBY user:1001 age 1
```

### 3.3 List

An ordered string list allowing duplicates, backed by a quicklist (a linked list of compact listpack nodes; ziplist before Redis 7.0). Insertion/removal at either end supports **queues** (LPUSH + BRPOP), **stacks** (LPUSH + LPOP), timelines, etc. Blocking commands BLPOP/BRPOP are common for simple message queues. Indexed access (LINDEX) is O(n), so use it cautiously on large lists.

```bash
# Insert on the left (head)
LPUSH tasks "task1" "task2" "task3"

# Insert on the right (tail)
RPUSH tasks "task4"

# Get a range (0 to -1 means all elements)
LRANGE tasks 0 -1

# Get the list length
LLEN tasks

# Pop from the left
LPOP tasks

# Pop from the right
RPOP tasks

# Blocking pop (common for queues; timeout in seconds)
BLPOP tasks 10
BRPOP tasks 10

# Get the element at an index
LINDEX tasks 0

# Set the element at an index
LSET tasks 0 "new_task"

# Retain a specified range
LTRIM tasks 0 99
```

### 3.4 Set

An unordered string collection with **unique elements**, backed by a hash table or intset. Useful for deduplication, tags, and mutual friends. SINTER/SUNION/SDIFF provide intersection/union/difference for recommendations and statistics. SMEMBERS returns all elements; for large sets, prefer incremental traversal with SSCAN.

```bash
# Add elements
SADD tags "java" "redis" "mysql"

# Get all elements
SMEMBERS tags

# Check whether an element exists
SISMEMBER tags "java"

# Count elements
SCARD tags

# Remove elements
SREM tags "mysql"

# Get random elements
SRANDMEMBER tags 2

# Pop a random element
SPOP tags

# Set operations
SADD set1 "a" "b" "c"
SADD set2 "b" "c" "d"

# Intersection
SINTER set1 set2

# Union
SUNION set1 set2

# Difference
SDIFF set1 set2
```

### 3.5 Sorted Set

Each unique element has a **score** that determines ordering (multiple members can share a score). Backed by a skip list plus hash table, score-range and rank queries are O(log N). Typical uses include leaderboards (ZREVRANGE), delayed queues (execution time as score), and weighted deduplication and sorting.

```bash
# Add elements (score member)
ZADD leaderboard 100 "player1" 200 "player2" 150 "player3"

# Get rank (ascending, zero-based)
ZRANK leaderboard "player1"

# Get rank (descending)
ZREVRANK leaderboard "player2"

# Get the score
ZSCORE leaderboard "player1"

# Get a rank range (ascending)
ZRANGE leaderboard 0 -1
ZRANGE leaderboard 0 -1 WITHSCORES

# Get a rank range (descending)
ZREVRANGE leaderboard 0 2 WITHSCORES

# Get a score range
ZRANGEBYSCORE leaderboard 100 200

# Count elements
ZCARD leaderboard

# Count elements within a score range
ZCOUNT leaderboard 100 200

# Increment a score
ZINCRBY leaderboard 50 "player1"

# Remove elements
ZREM leaderboard "player1"
```

### 3.6 General Commands

These commands work on keys of any type for lifecycle management (expiration/deletion), existence checks, and operations (TYPE, SELECT, FLUSH, etc.). KEYS * blocks; use SCAN in production.

```bash
# List all keys (use cautiously in production)
KEYS *
KEYS user:*

# Incremental scan (recommended in production)
SCAN 0 MATCH user:* COUNT 100

# Check whether a key exists
EXISTS name

# Delete keys
DEL name
DEL k1 k2 k3

# Set expiration in seconds
EXPIRE name 3600

# Set expiration in milliseconds
PEXPIRE name 3600000

# Get remaining lifetime in seconds
TTL name

# Get remaining lifetime in milliseconds
PTTL name

# Remove expiration
PERSIST name

# Get the key type
TYPE name

# Rename
RENAME oldkey newkey

# Select a database (0-15; default: 0)
SELECT 1

# Clear the current database
FLUSHDB

# Clear all databases
FLUSHALL
```

***

## IV. Core Redis Mechanisms

### 4.1 Why Is Redis Fast?

**Redis's performance** comes from a combination of in-memory access, efficient data structures, event-driven processing, and avoiding excessive thread switching, not merely from being single-threaded. It is fast, but still incurs network and serialization costs compared with a local cache.

| Factor | Description |
| --- | --- |
| **In-memory storage** | Most reads/writes happen in memory, avoiding random disk I/O. |
| **Efficient data structures** | String, Hash, ZSet, etc. are optimized for typical use cases. |
| **Single-threaded command execution** | Serial execution avoids lock contention and context switches around shared data. |
| **I/O multiplexing** | One thread monitors connection events for multiple connections, improving network efficiency. |
| **Simple protocol** | RESP is inexpensive to parse and allows lightweight clients. |

> **Note:** Redis 6.0 introduced multithreaded network I/O, while command execution remains primarily single-threaded.

> **Additional point:** Local caches are usually faster still, since they avoid cross-process communication and encoding objects into network transport formats.

### 4.2 Expiration and Memory Eviction

Redis controls data lifecycles through two mechanisms: **expiration deletion** handles expired keys, while **memory eviction** handles writes when memory is full.

| Mechanism | Trigger | Method | Purpose |
| --- | --- | --- | --- |
| **Expiration deletion** | Key reaches expiration | Lazy deletion + periodic deletion | Remove invalid data |
| **Memory eviction** | `maxmemory` limit reached | Remove keys according to the eviction policy | Prevent further writes from causing OOM |

#### 1. Expiration Deletion

- **Lazy deletion:** Check a key's expiration only when it is accessed, then delete it if expired.
- **Periodic deletion:** Redis periodically samples keys with expiration times and removes expired samples.

Lazy deletion saves CPU but can leave expired keys in memory longer; periodic deletion compensates. Combining the two balances CPU and memory usage.

#### 2. Memory Eviction Policies

When `maxmemory` is configured and new data cannot fit in memory, Redis uses `maxmemory-policy` to decide whether to evict old keys.

| Policy | Description | Use cases |
| --- | --- | --- |
| **noeviction** | Do not evict; return an error | High data-integrity requirements; automatic deletion is unacceptable |
| **allkeys-lru** | Evict the least recently used keys from all keys | General caching; most common |
| **volatile-lru** | Apply LRU only to keys with a TTL | Persistent and cached data coexist |
| **allkeys-lfu** | Evict the least frequently used keys from all keys | Clearly skewed, long-lasting hot-key distributions |
| **volatile-ttl** | Prefer keys with the shortest remaining lifetime | Caches with carefully designed TTLs |
| **volatile-random** | Randomly evict keys with a TTL | Rarely used alone |

### 4.3 Persistence

Although Redis is primarily in-memory, **RDB** and **AOF** persistence reduce the risk of data loss after restarts or crashes.

| Method | Mechanism | Advantages | Disadvantages | Use cases |
| --- | --- | --- | --- | --- |
| **RDB** | Point-in-time memory snapshots | Compact files, fast recovery, suitable for backups | Changes between snapshots may be lost | Backups, full recovery |
| **AOF** | Append write commands to a log | Better data completeness and readability | Larger files, generally slower recovery | Higher data-integrity requirements |

Common recommendations:

- **RDB** suits periodic snapshots and backups.
- **AOF everysec** is a common production compromise, typically losing at most one second of data.
- Enable **RDB + AOF** when both recovery speed and data safety matter.

```properties
# RDB
save 900 1
save 300 10
save 60 10000

# AOF
appendonly yes
appendfsync everysec
```

### 4.4 Deployment Modes and High Availability

Redis has four common deployment modes, progressing from standalone to clusters with increasing availability and scalability.

| Mode | Nodes | Main problem addressed | Limitations | Use cases |
| --- | --- | --- | --- | --- |
| **Standalone** | 1 | Fast deployment without redundancy | Single point of failure; no HA | Development/testing, low-concurrency single-server projects |
| **Primary-replica replication** | 1 primary + N replicas | Data redundancy and read/write separation | Manual failover if the primary fails | Read-heavy workloads needing read scaling |
| **Sentinel** | Primary/replicas + ≥3 Sentinels | Automatic failover | No sharding; writes limited to one primary | Medium-scale HA with modest write load |
| **Cluster** | ≥6 (3 primaries, 3 replicas) | Data sharding + HA | Complex architecture; cross-slot operations restricted | Large datasets/high concurrency requiring horizontal scaling |

#### 1. Standalone Mode

A single Redis instance without redundancy. Deployment is simplest and performance is good (memory access and I/O multiplexing), but there is a single point of failure: if Redis goes down, the cache becomes completely unavailable, so services need a fallback to the data source or degraded behavior.

```text
[Client] → [Single Redis instance]
```

Suitable for development/testing, low-concurrency internal systems, and projects with modest availability requirements.

#### 2. Primary-Replica Replication

One **primary (Master)** handles writes; one or more **replicas** asynchronously synchronize its data and can serve reads (read/write separation).

```text
[Client writes] → [Master]
                     ↓ Asynchronous synchronization
[Client reads] → [Replica 1]
[Client reads] → [Replica 2]
```

**How replication works:**
- Initial connection: the replica sends `PSYNC`; the primary sends a complete RDB snapshot, then incremental commands after the replica loads it.
- Reconnection: the primary maintains a replication backlog (repl_backlog) and attempts partial resynchronization; if the needed data has fallen out of the backlog, full synchronization repeats.

**Limitation:** After primary failure, a replica must be promoted manually, and writes are unavailable during the transition.

```bash
# Replica configuration
replicaof 192.168.1.10 6379
```

#### 3. Sentinel Mode

Building on primary-replica replication, **≥3 Sentinel processes** (an odd number for majority voting) monitor node health, automatically fail over after primary failure, and notify clients of the new primary's address.

```text
[Sentinel 1]  [Sentinel 2]  [Sentinel 3]
       ↓              ↓              ↓
    [Master] ←→ [Replica 1] ←→ [Replica 2]
```

**Failover process:**
1. A Sentinel finds the primary unresponsive → Marks it **subjectively down (SDOWN)**.
2. Once the configured quorum of Sentinels agrees → Marks it **objectively down (ODOWN)**; the failover itself still needs a majority of Sentinels to elect a leader.
3. Sentinels elect a leader to perform failover: promote a replica, redirect other replicas to the new primary, and notify clients.

Clients connect to Sentinel addresses instead of directly to Redis; Sentinel supplies the current primary's address.

```yaml
# Spring Boot Sentinel configuration
spring:
  data:
    redis:
      sentinel:
        master: mymaster
        nodes:
          - 192.168.1.20:26379
          - 192.168.1.21:26379
          - 192.168.1.22:26379
      password: yourpassword
```

```properties
# sentinel.conf (one for each of the three Sentinels, using different ports)
port 26379
sentinel monitor mymaster 192.168.1.10 6379 2
sentinel auth-pass mymaster yourpassword
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
sentinel parallel-syncs mymaster 1
```

Suitable for medium-scale production environments needing automatic HA with write load within a single primary's capacity.

#### 4. Cluster Mode

Redis Cluster distributes data across multiple **primaries**, with **16384 slots** assigned using `CRC16(key) % 16384`. Each primary can have replicas for HA.

```text
[Master A: slot 0–5460]  [Master B: slot 5461–10922]  [Master C: slot 10923–16383]
       ↓                           ↓                            ↓
  [Replica A]                 [Replica B]                  [Replica C]
```

**Routing:** The client computes a key's slot and selects the node for the write. If it connects to the wrong node, Redis returns a `MOVED` redirect that the client follows automatically.

**Notes:**
- Multi-key operations across nodes (`MGET`, transactions, Lua scripts) require all keys to share a slot. Use a **hash tag** (`{tag}key`) to force the same routing.
- At least 3 primaries and 3 replicas (6 nodes); the cluster cannot operate normally with fewer than 3 primaries.
- Use a Cluster-capable client driver (both Lettuce and Jedis support it natively).

```yaml
# Spring Boot Cluster configuration
spring:
  data:
    redis:
      cluster:
        nodes:
          - 192.168.1.10:6379
          - 192.168.1.11:6379
          - 192.168.1.12:6379
          - 192.168.1.13:6379
          - 192.168.1.14:6379
          - 192.168.1.15:6379
        max-redirects: 3
      password: yourpassword
```

Suitable for high-traffic workloads whose data or write volume exceeds one machine's capacity and requires horizontal scaling.

#### 5. Selection Guide

| Scenario | Recommended mode |
| --- | --- |
| Local development and testing | Standalone |
| Low-concurrency internal systems on one machine | Standalone |
| Small/medium production requiring automatic failover | Sentinel |
| Read-heavy workloads needing only read scaling | Primary-replica replication (optionally with Sentinel) |
| Large datasets/high write volume requiring horizontal scaling | Cluster |

***

## V. Using Redis in Java

Spring Data Redis wraps Redis TCP communication through **RedisConnection**. **RedisTemplate** provides typed APIs (opsForValue, opsForHash, etc.) on top and handles serialization/deserialization. A **connection pool** (such as Lettuce's pool) is recommended to reuse connections and limit concurrent connections, avoiding the latency and resource cost of frequent connection creation.

### 5.1 Spring Boot Redis Integration

#### Add Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- Connection pool (optional, recommended) -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```

#### Configuration File

`host/port/password/database` specify the connection target; `timeout` prevents prolonged blocking. `lettuce.pool` controls pool size (max-active, max-idle, min-idle) and maximum wait time (max-wait). Choose values according to QPS and instance count to avoid exhausting connections or retaining too many idle ones.

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: yourpassword    # Omit if no password is configured
      database: 0               # Database index; default: 0
      timeout: 3000ms           # Connection timeout
      lettuce:
        pool:
          max-active: 8         # Maximum connections
          max-idle: 8           # Maximum idle connections
          min-idle: 0           # Minimum idle connections
          max-wait: -1ms        # Maximum wait for a connection; -1 means unlimited
```

#### Serialization

- **What is serialization?** Converting in-memory objects into byte streams for storage or transmission; deserialization reconstructs objects from those streams. Redis keys/values are byte arrays underneath, so Java must serialize objects before storing them and deserialize after reading.
- **Why serialization matters:**
  - By default, `RedisTemplate` uses **JDK serialization** (`JdkSerializationRedisSerializer`), producing unreadable binary data tied to Java class structures and unfriendly to other languages or versions.
  - Custom serialization can use readable formats (such as JSON), standardize key formats, and avoid deserialization failures caused by class changes.
- **Common options:**
  - **JDK serialization:** No configuration needed, but unreadable, bulky, and sensitive to class structure; generally not recommended for values.
  - **String serialization** (`StringRedisSerializer`): Only for strings; commonly used for keys because it is simple and readable.
  - **JSON serialization** (such as `Jackson2JsonRedisSerializer`): Readable, cross-language, and easy to troubleshoot; type information must be configured for correct generic/polymorphic deserialization.
  - **Others:** Kryo, Protobuf, etc. may offer better performance but require extra dependencies and conventions; choose as needed.
- **Where it fits in Spring Data Redis:** `RedisTemplate`'s `keySerializer`, `valueSerializer`, `hashKeySerializer`, and `hashValueSerializer` control key/value serialization. Unspecified serializers default to JDK serialization.

#### Redis Configuration Class (Optional Custom Serialization)

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        // Serialize keys as strings (readable and easy to inspect with redis-cli)
        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);

        // Serialize values as JSON (retain type information, support generic deserialization and cross-language readability)
        GenericJackson2JsonRedisSerializer jsonSerializer =
            new GenericJackson2JsonRedisSerializer();
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }
}
```

> **Note**: `new GenericJackson2JsonRedisSerializer()` creates its own `ObjectMapper` without the JSR-310 module, so values with `LocalDateTime` fields fail to serialize. For such types, pass an `ObjectMapper` that registers `JavaTimeModule` and enables default typing.

### 5.2 RedisTemplate Operations

`RedisTemplate<K, V>` is Spring's Redis **facade**. It obtains connections from `RedisConnectionFactory`, exposes type-specific `*Operations` through `opsForValue()`, `opsForHash()`, etc., and uses configured serializers to convert Java objects to/from byte arrays. Keys are generally String; values may be Object with JSON or another serializer. For strings only, use `StringRedisTemplate` directly.

#### Inject RedisTemplate

```java
@Service
public class RedisService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // Or use StringRedisTemplate (both keys and values are strings)
    @Autowired
    private StringRedisTemplate stringRedisTemplate;
}
```

#### String Operations

```java
// Get the operations object
ValueOperations<String, Object> ops = redisTemplate.opsForValue();

// Set a value
ops.set("name", "张三");

// Set a value with expiration
ops.set("token", "abc123", 30, TimeUnit.MINUTES);

// Set only if the key does not exist (distributed lock)
Boolean success = ops.setIfAbsent("lock", "1", 30, TimeUnit.SECONDS);

// Get a value
Object value = ops.get("name");

// Increment
Long count1 = ops.increment("counter");
Long count2 = ops.increment("counter", 10);

// Set multiple values
Map<String, Object> map = new HashMap<>();
map.put("k1", "v1");
map.put("k2", "v2");
ops.multiSet(map);

// Get multiple values
List<Object> values = ops.multiGet(Arrays.asList("k1", "k2"));
```

#### Hash Operations

```java
HashOperations<String, String, Object> ops = redisTemplate.opsForHash();

// Set a field
ops.put("user:1001", "name", "张三");
ops.put("user:1001", "age", 25);

// Set multiple fields
Map<String, Object> userMap = new HashMap<>();
userMap.put("name", "张三");
userMap.put("age", 25);
ops.putAll("user:1001", userMap);

// Get a field
Object name = ops.get("user:1001", "name");

// Get all fields
Map<String, Object> user = ops.entries("user:1001");

// Check whether a field exists
Boolean exists = ops.hasKey("user:1001", "name");

// Delete a field
ops.delete("user:1001", "name", "age");

// Increment a field
ops.increment("user:1001", "age", 1);
```

#### List Operations

```java
ListOperations<String, Object> ops = redisTemplate.opsForList();

// Insert on the left
ops.leftPush("tasks", "task1");
ops.leftPushAll("tasks", "task2", "task3");

// Insert on the right
ops.rightPush("tasks", "task4");

// Get a range
List<Object> tasks = ops.range("tasks", 0, -1);

// Get the length
Long size = ops.size("tasks");

// Pop
Object first = ops.leftPop("tasks");
Object last = ops.rightPop("tasks");

// Blocking pop
Object next = ops.leftPop("tasks", 10, TimeUnit.SECONDS);
```

#### Set Operations

```java
SetOperations<String, Object> ops = redisTemplate.opsForSet();

// Add elements
ops.add("tags", "java", "redis", "mysql");

// Get all elements
Set<Object> tags = ops.members("tags");

// Check existence
Boolean isMember = ops.isMember("tags", "java");

// Count elements
Long size = ops.size("tags");

// Remove elements
ops.remove("tags", "mysql");

// Get random elements
Object tag = ops.randomMember("tags");

// Set operations
Set<Object> inter = ops.intersect("set1", "set2");
Set<Object> union = ops.union("set1", "set2");
Set<Object> diff = ops.difference("set1", "set2");
```

#### Sorted Set Operations

```java
ZSetOperations<String, Object> ops = redisTemplate.opsForZSet();

// Add elements
ops.add("leaderboard", "player1", 100);
ops.add("leaderboard", "player2", 200);

// Get the score
Double score = ops.score("leaderboard", "player1");

// Get rank (ascending)
Long rank = ops.rank("leaderboard", "player1");

// Get rank (descending)
Long reverseRank = ops.reverseRank("leaderboard", "player1");

// Get a rank range (descending)
Set<Object> top3 = ops.reverseRange("leaderboard", 0, 2);

// Get elements with scores
Set<ZSetOperations.TypedTuple<Object>> top3WithScores =
    ops.reverseRangeWithScores("leaderboard", 0, 2);

// Increment a score
ops.incrementScore("leaderboard", "player1", 50);

// Count elements
Long size = ops.size("leaderboard");
```

#### General Operations

```java
// Delete keys
redisTemplate.delete("name");
redisTemplate.delete(Arrays.asList("k1", "k2", "k3"));

// Check whether a key exists
Boolean exists = redisTemplate.hasKey("name");

// Set expiration
redisTemplate.expire("name", 30, TimeUnit.MINUTES);

// Get remaining lifetime
Long ttl = redisTemplate.getExpire("name", TimeUnit.SECONDS);

// Get the key type
DataType type = redisTemplate.type("name");

// Find keys (use cautiously in production)
Set<String> keys = redisTemplate.keys("user:*");
```

### 5.3 Wrapping Redis in a Utility Class

Wrap common key/value, hash, expiration, deletion, and other operations in a utility class to standardize key prefixes, expiration policies, and exception handling. This avoids scattering `redisTemplate.opsForValue().set(...)` throughout business code and makes maintenance or implementation replacement easier.

```java
@Component
public class RedisUtils {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // ==================== String ====================

    public void set(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }

    public void set(String key, Object value, long timeout, TimeUnit unit) {
        redisTemplate.opsForValue().set(key, value, timeout, unit);
    }

    public Object get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public <T> T get(String key, Class<T> clazz) {
        Object value = redisTemplate.opsForValue().get(key);
        return value == null ? null : clazz.cast(value);
    }

    public Boolean setIfAbsent(String key, Object value, long timeout, TimeUnit unit) {
        return redisTemplate.opsForValue().setIfAbsent(key, value, timeout, unit);
    }

    public Long increment(String key) {
        return redisTemplate.opsForValue().increment(key);
    }

    public Long increment(String key, long delta) {
        return redisTemplate.opsForValue().increment(key, delta);
    }

    // ==================== Hash ====================

    public void hSet(String key, String field, Object value) {
        redisTemplate.opsForHash().put(key, field, value);
    }

    public void hSetAll(String key, Map<String, Object> map) {
        redisTemplate.opsForHash().putAll(key, map);
    }

    public Object hGet(String key, String field) {
        return redisTemplate.opsForHash().get(key, field);
    }

    public Map<Object, Object> hGetAll(String key) {
        return redisTemplate.opsForHash().entries(key);
    }

    public void hDelete(String key, Object... fields) {
        redisTemplate.opsForHash().delete(key, fields);
    }

    // ==================== General operations ====================

    public Boolean delete(String key) {
        return redisTemplate.delete(key);
    }

    public Long delete(Collection<String> keys) {
        return redisTemplate.delete(keys);
    }

    public Boolean hasKey(String key) {
        return redisTemplate.hasKey(key);
    }

    public Boolean expire(String key, long timeout, TimeUnit unit) {
        return redisTemplate.expire(key, timeout, unit);
    }

    public Long getExpire(String key) {
        return redisTemplate.getExpire(key, TimeUnit.SECONDS);
    }
}
```

### 5.4 Usage Examples

- **Caching:** Use **Cache-Aside**: on reads, check the cache, query the database on a miss, and populate the cache; on writes, update the database before deleting (or updating) the cache to avoid persistently stale data.
- **Distributed locks:** Redis `SET key value NX EX seconds` atomically sets an expiring key only if it does not exist, preventing deadlocks. On release, check the value before DEL to avoid deleting another owner's lock.
- **Rate limiting:** This example uses a **fixed-window counter** (increment a key within a time window and reject requests above the limit). Sliding windows or token buckets provide smoother behavior and can also use Redis.

#### Caching User Information

```java
@Service
public class UserService {

    @Autowired
    private RedisUtils redisUtils;

    @Autowired
    private UserMapper userMapper;

    private static final String USER_CACHE_KEY = "user:";
    private static final long CACHE_EXPIRE = 30; // Minutes

    public User getUserById(Long id) {
        String key = USER_CACHE_KEY + id;

        // Check the cache first
        User user = redisUtils.get(key, User.class);
        if (user != null) {
            return user;
        }

        // Cache miss: query the database
        user = userMapper.selectById(id);
        if (user != null) {
            // Populate the cache
            redisUtils.set(key, user, CACHE_EXPIRE, TimeUnit.MINUTES);
        }

        return user;
    }

    public void updateUser(User user) {
        userMapper.updateById(user);
        // Delete the cache entry
        redisUtils.delete(USER_CACHE_KEY + user.getId());
    }
}
```

#### Simple Distributed Lock

> This is a minimal inline example. A complete distributed lock also needs a unique owner value (such as a UUID), atomic Lua-based unlocking, and, in production, usually Redisson.

```java
@Service
public class OrderService {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    private static final DefaultRedisScript<Long> UNLOCK_SCRIPT =
        new DefaultRedisScript<>(
            "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
            Long.class
        );

    public boolean createOrder(Long productId, Long userId) {
        String lockKey = "lock:order:" + productId;
        String lockValue = UUID.randomUUID().toString();

        try {
            // Acquire the lock (expires in 30 seconds)
            Boolean locked = stringRedisTemplate.opsForValue()
                .setIfAbsent(lockKey, lockValue, 30, TimeUnit.SECONDS);
            if (!Boolean.TRUE.equals(locked)) {
                return false; // Failed to acquire the lock
            }

            // Execute business logic
            // ...

            return true;
        } finally {
            // Use Lua to make the lock-value comparison and deletion atomic
            stringRedisTemplate.execute(UNLOCK_SCRIPT, Collections.singletonList(lockKey), lockValue);
        }
    }
}
```

#### Endpoint Rate Limiting

```java
@Service
public class RateLimitService {

    @Autowired
    private RedisUtils redisUtils;

    /**
     * Simple counter-based rate limiting
     * @param key Rate-limit key
     * @param limit Maximum requests
     * @param windowSeconds Time window (seconds)
     * @return Whether access is allowed
     */
    public boolean isAllowed(String key, int limit, int windowSeconds) {
        Long count = redisUtils.increment(key);

        if (count == 1) {
            // First request: set expiration
            redisUtils.expire(key, windowSeconds, TimeUnit.SECONDS);
        }

        return count <= limit;
    }
}

// Usage
@RestController
public class ApiController {
    @Autowired
    private RateLimitService rateLimitService;

    @GetMapping("/data")
    public Result<Object> getData(HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        String key = "rate_limit:" + ip;

        // At most 10 requests per minute
        if (!rateLimitService.isAllowed(key, 10, 60)) {
            return Result.error(ResultCode.TOO_MANY_REQUESTS);
        }

        // Normal business logic
        return Result.success(data);
    }
}
```

### 5.5 Pipeline (Batch Operations)

By default, Redis clients send commands individually, each requiring a complete round trip: send → wait for Redis → receive the response. **Pipelining** sends multiple commands together and receives their results in a batch, greatly reducing network round trips. It suits batch writes, queries, and similar operations.

Avoid too many commands in one pipeline (preferably no more than 500), as large response bodies also affect performance. Pipeline commands execute in order but **are not atomic**; use Lua scripts or transactions when atomicity is required.

```java
// StringRedisTemplate passes a StringRedisConnection to the callback (a plain RedisTemplate does not)

// Batch writes (pipeline)
List<Object> results = stringRedisTemplate.executePipelined(
    (RedisCallback<Object>) connection -> {
        StringRedisConnection conn = (StringRedisConnection) connection;
        for (int i = 1; i <= 100; i++) {
            conn.setEx("user:" + i, 1800, "value-" + i); // key, expiration in seconds, value
        }
        return null; // Must return null; the outer call collects the results
    }
);

// Batch queries (pipeline)
List<String> keys = List.of("user:1", "user:2", "user:3");
List<Object> values = stringRedisTemplate.executePipelined(
    (RedisCallback<Object>) connection -> {
        StringRedisConnection conn = (StringRedisConnection) connection;
        keys.forEach(conn::get);
        return null;
    }
);
// values correspond one-to-one with keys; cache misses return null
```

### 5.6 Executing Lua Scripts

Redis supports **atomic execution of a Lua script** on the server. Redis treats the entire script as one command and does not interleave other commands during execution. This combines multiple steps into an atomic operation, such as releasing a distributed lock (compare value, then delete), counter-based rate limiting, or decrementing inventory.

**Calling from Spring:**

- `DefaultRedisScript<T>` wraps the script and return type
- `redisTemplate.execute(script, keys, args...)` sends the script to Redis for execution

The script receives Java arguments through `KEYS[n]` and `ARGV[n]` (one-based indexes):

- `KEYS` corresponds to the second argument of `execute` (the key list)
- `ARGV` corresponds to the third and subsequent arguments of `execute`

```java
// Define the script (static constant; create only once)
private static final DefaultRedisScript<Long> MY_SCRIPT = new DefaultRedisScript<>(
    // Lua script content (string)
    "if redis.call('get', KEYS[1]) == ARGV[1] then " +
    "    return redis.call('del', KEYS[1]) " +
    "else " +
    "    return 0 " +
    "end",
    Long.class  // Script return type
);

// Execute the script
Long result = stringRedisTemplate.execute(
    MY_SCRIPT,
    Collections.singletonList("myKey"),   // KEYS list → KEYS[1] = "myKey" inside the script
    "expectedValue"                        // ARGV[1] = "expectedValue"
);
// result = 1 means del was executed; result = 0 means the condition did not match and nothing was deleted
```

> **Compared with pipelining:** A pipeline batches independent commands without guaranteeing atomicity; a Lua script combines multiple logical steps into one atomic command. Use Lua for atomicity and pipelining for batch throughput.

***

## VI. Spring Cache Annotations

Spring provides a **caching abstraction** independent of the implementation, allowing declarative annotations over Redis, Caffeine, Ehcache, and others. Annotations suit read-heavy scenarios that cache/invalidate method return values: configuration is simple and separate from business logic. Use RedisTemplate or a utility wrapper for finer control (complex keys, multiple keys, pipelines, distributed locks, rate limiting) or caches unrelated to return values. Both approaches can coexist: some methods use `@Cacheable`, others use `RedisUtils`. This layer provides a consistent interface to different cache implementations rather than focusing on Redis commands.

### 6.1 Enabling Caching

**`@EnableCaching`** enables Spring's declarative caching. Without it, annotations such as `@Cacheable` do not take effect, as though the cache switch is off. Usually place it on a **configuration class** or **application class**.

```java
@SpringBootApplication
@EnableCaching
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 6.2 Choosing a Cache Implementation: Redis or Local Cache

After enabling caching, choose a **cache implementation**. Spring Cache is only the unified entry point; the underlying implementation stores the data. Common choices:

| Implementation | Use cases | Characteristics |
| --- | --- | --- |
| **Redis** | Shared caches across instances, distributed systems | Shared and high-capacity, but requires network access |
| **Caffeine** | Hot data on one machine, local caching | Faster access, but limited to the current instance |
| **Ehcache** | Traditional Java projects, local/disk hybrid caching | Full-featured; Caffeine is more common in modern Spring Boot projects |

#### 1. Configure Redis as the Cache

Use `spring.cache.type=redis`. Other common settings: `time-to-live` controls expiration, `key-prefix` avoids key collisions, and `cache-null-values: true` caches empty results to reduce cache penetration.

```yaml
spring:
  cache:
    type: redis
    redis:
      time-to-live: 3600000   # Cache lifetime (milliseconds)
      key-prefix: "cache:"    # Key prefix
      use-key-prefix: true
      cache-null-values: true # Cache null values to prevent cache penetration
```

#### 2. Configure a Local Cache Implementation

If the application only needs an in-process cache on one machine, switch Spring Cache to **Caffeine** (add the `com.github.ben-manes.caffeine:caffeine` dependency). It does not depend on Redis and suits small hot objects, read-only configuration, dictionary data, etc.

```yaml
spring:
    cache:
        type: caffeine
        cache-names: user,dict,config
        caffeine:
            spec: maximumSize=1000,expireAfterWrite=10m
```

| Setting | Description |
| --- | --- |
| **maximumSize** | Maximum local cache entries, preventing unbounded JVM memory usage |
| **expireAfterWrite** | Time to expire after a write |
| **expireAfterAccess** | Time to expire after access; useful for activity-based eviction |

> **Note:** A local cache is not a more advanced replacement for Redis; it is aimed at optimizing hot data within one instance. For sharing across instances, Redis or two-level caching is still needed.

### 6.3 Cache Annotations

- **@Cacheable:** Suits **read-heavy** queries. Before execution, check the cache by key; on a hit, return immediately without invoking the method. On a miss, execute the method and cache its return value. **Do not use @Cacheable on writes**, because a cache hit would skip the write.
- **@CachePut:** **Always executes the method** and updates the cache with its return value. Commonly used after inserts/updates to cache the latest result for subsequent consistent reads.
- **@CacheEvict:** **Deletes** cache entries (by key, or the entire cache with `allEntries=true`). Commonly invalidates stale data after deletes/updates; `beforeInvocation=true` deletes before execution so an exception does not prevent eviction.
- **@Caching:** Combines annotations when one method needs multiple cache operations, such as putting one key and evicting another cache.

```java
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    /**
     * @Cacheable: check the cache first; on a miss, execute the method and cache the result
     * value/cacheNames: cache name
     * key: cache key; supports SpEL
     * unless: do not cache when the condition is true
     */
    @Cacheable(value = "user", key = "#id", unless = "#result == null")
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }

    /**
     * @CachePut: execute the method and update the cache
     */
    @CachePut(value = "user", key = "#user.id")
    public User updateUser(User user) {
        userMapper.updateById(user);
        return user;
    }

    /**
     * @CacheEvict: delete cache entries
     * allEntries: whether to clear the whole cache
     * beforeInvocation: whether to evict before method execution
     */
    @CacheEvict(value = "user", key = "#id")
    public void deleteUser(Long id) {
        userMapper.deleteById(id);
    }

    /**
     * @Caching: combine multiple cache operations
     */
    @Caching(
        put = @CachePut(value = "user", key = "#user.id"),
        evict = @CacheEvict(value = "userList", allEntries = true)
    )
    public User saveUser(User user) {
        userMapper.insert(user);
        return user;
    }
}
```

### 6.4 SpEL Expressions

Spring Expression Language (SpEL) references method arguments, return values, beans, etc. in annotations for **dynamic keys** (such as `#id`, `#user.id`) and **conditional caching** (`condition` determines whether caching applies; `unless` determines whether to store the result). Different arguments produce different entries, avoiding key conflicts or incorrect reuse. Annotation attributes such as `key`, `condition`, and `unless` support SpEL:

| Expression | Description | Example |
| ----------------- | ---------- | ---------------------- |
| `#parameterName` | Method parameter | `#id`, `#user` |
| `#p0`, `#a0` | First parameter | `#p0` |
| `#result` | Method return value | `#result.id` |
| `#root.method` | Current method | `#root.method.name` |
| `#root.target` | Target object | `#root.target` |
| `#root.caches[0]` | Current cache | `#root.caches[0].name` |

***

## VII. Redis Distributed Locks

Distributed locks provide **mutual exclusion across processes/instances**. Java's `synchronized` and `ReentrantLock` work only within one JVM. In a distributed deployment, each instance has its own lock, so they cannot exclude one another; external shared storage such as Redis or ZooKeeper is needed for cross-process locking.

### 7.1 Core Requirements

| Requirement | Description |
| --- | --- |
| **Mutual exclusion** | Only one client may hold the lock at a time |
| **Deadlock prevention** | Automatically release the lock if its owner crashes (set expiration) |
| **Ownership-safe release** | Delete only the caller's lock, never another owner's lock |
| **Atomicity** | Critical acquisition/release steps must execute atomically to avoid races |

### 7.2 Comparing Implementations

| Approach | Mechanism | Advantages | Disadvantages | Use cases |
| --- | --- | --- | --- | --- |
| **Redis SETNX** | Atomic `SET key value NX EX` | Simple, high-performance | Renewal and reentrancy must be implemented manually | Simple mutual exclusion |
| **Redisson** | Wraps SETNX + watchdog + Lua | Complete features (renewal, reentrancy, fair locks) | Extra dependency | Recommended for production |
| **ZooKeeper** | Ephemeral sequential nodes + watches | Strong consistency, natural ordering | Slower than Redis | Extremely strict consistency requirements |

### 7.3 Manual SETNX Implementation

#### Lock Acquisition and Release

**Acquire** the lock with a single `SET` command using `NX EX`:

- `NX` (Not eXists): Write only if the key is absent; otherwise fail. This implements contention for the lock: only one concurrent thread succeeds.
- `EX 30`: Set a 30-second expiration in the same operation. If the owner crashes, the lock expires automatically so other threads can acquire it.
- Both options take effect atomically in one command, avoiding a partially completed state where the key is written but the client crashes before setting expiration.

**Release** requires checking ownership by value, then DEL. A race exists between these steps: the lock may expire and be acquired by someone else before DEL, which would delete their lock. A **Lua script** must combine both steps into one atomic operation.

```text
Acquire: SET lock:key <uniqueUUID> NX EX 30 → Write only if absent and set expiration atomically
Release: Execute Lua atomically → GET and compare the value → DEL only if owned by this caller; otherwise do nothing
```

#### Why Must lockValue Be Unique?

Generate a unique lock value for every acquisition (usually a `UUID`), or release cannot distinguish the caller's lock from another owner's:

```text
Thread A acquires the lock, value = "A-uuid", TTL = 30s
Thread A's business operation takes too long; the lock expires
Thread B acquires the lock, value = "B-uuid"
Thread A resumes and releases → Must check the value first, or it would delete thread B's lock
```

#### Code Example

```java
@Service
public class DistributedLockService {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    // Lua: atomically compare value and delete, preventing deletion of another owner's lock
    private static final DefaultRedisScript<Long> UNLOCK_SCRIPT = new DefaultRedisScript<>(
        "if redis.call('get', KEYS[1]) == ARGV[1] then " +
        "    return redis.call('del', KEYS[1]) " +
        "else " +
        "    return 0 " +
        "end",
        Long.class
    );

    /**
     * Try to acquire a lock
     * @param lockKey Lock key
     * @param lockValue Unique lock identifier (UUID)
     * @param expireSeconds Lock lifetime (seconds)
     */
    public boolean tryLock(String lockKey, String lockValue, long expireSeconds) {
        Boolean success = stringRedisTemplate.opsForValue()
            .setIfAbsent(lockKey, lockValue, expireSeconds, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(success);
    }

    /**
     * Release the lock (Lua ensures atomicity and prevents deleting another owner's lock)
     */
    public void unlock(String lockKey, String lockValue) {
        stringRedisTemplate.execute(
            UNLOCK_SCRIPT,
            Collections.singletonList(lockKey),
            lockValue
        );
    }
}
```

#### Business Usage

```java
@Service
public class OrderService {

    @Autowired
    private DistributedLockService lockService;

    public boolean createOrder(Long productId) {
        String lockKey   = "lock:order:" + productId;
        String lockValue = UUID.randomUUID().toString(); // Unique on each attempt

        // 1. Try to acquire the lock; return immediately on failure
        if (!lockService.tryLock(lockKey, lockValue, 30)) {
            return false;
        }

        try {
            // 2. Execute business logic (decrement inventory, create an order, etc.)
            // ...
            return true;
        } finally {
            // 3. Release the lock on both success and exceptions
            lockService.unlock(lockKey, lockValue);
        }
    }
}
```

### 7.4 SETNX Limitations

| Issue | Description |
| --- | --- |
| **Not reentrant** | A thread trying to acquire the same lock again blocks itself |
| **No automatic renewal** | If execution outlasts the TTL, the lock expires while the operation is still running; another thread can acquire it, causing concurrency problems |
| **Replication-lag risk** | A primary can crash after writing the lock but before replicating it; after promotion, the replica has no lock (Redlock may mitigate this at higher cost) |

### 7.5 Redisson (Recommended for Production)

Redisson is a Redis-based Java client with complete distributed synchronization implementations, including **reentrant locks, watchdog renewal, Redlock, read/write locks, and semaphores**, making it the preferred production option.

#### Dependency

```xml
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson-spring-boot-starter</artifactId>
    <version>3.27.0</version>
</dependency>
```

#### Configuration

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: yourpassword
```

```java
// The starter can also build RedissonClient from spring.data.redis; this explicit bean replaces that default
@Configuration
public class RedissonConfig {
    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useSingleServer()
              .setAddress("redis://localhost:6379")
              .setPassword("yourpassword");
        return Redisson.create(config);
    }
}
```

#### Usage Example

```java
@Service
public class OrderService {

    @Autowired
    private RedissonClient redissonClient;

    public boolean createOrder(Long productId) {
        RLock lock = redissonClient.getLock("lock:order:" + productId);

        // Wait at most 3 seconds; omit leaseTime to enable automatic watchdog renewal
        boolean locked;
        try {
            locked = lock.tryLock(3, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }

        if (!locked) {
            return false; // Failed to acquire the lock
        }

        try {
            // Execute business logic (Redisson's watchdog renews the lock automatically)
            // ...
            return true;
        } finally {
            lock.unlock(); // Release the lock
        }
    }
}
```

**Redisson watchdog mechanism:**

- The watchdog starts when leaseTime is omitted (or set to -1)
- An explicit leaseTime, such as `tryLock(3, 30, TimeUnit.SECONDS)`, uses a fixed lease without enabling the watchdog
- The lock is renewed every `lockWatchdogTimeout / 3` (10 seconds by default)
- Calling `unlock()` after the operation stops renewal
- If the JVM crashes, the watchdog also stops; the lock expires automatically, preventing deadlock

### 7.6 Local Locks vs. Redis Distributed Locks

| Aspect | Local locks (synchronized / ReentrantLock) | Redis distributed locks |
| --- | --- | --- |
| **Scope** | Current JVM process | Across processes and servers |
| **Performance** | Extremely fast (no network overhead) | Requires network round trips |
| **Use cases** | Single-machine deployment, threads in one process | Distributed deployment, shared resources across instances |
| **Lock renewal** | Not needed | Needed (Redisson watchdog) |
| **Implementation complexity** | Low | Moderate (manual) / low (Redisson) |

***

## VIII. Common Issues and Best Practices

### 8.1 Cache Failures and Consistency Overview

Common caching issues include **cache penetration, hot-key cache breakdown, cache avalanches**, and **cache consistency**. The first three all let requests bypass cache protection and put pressure on the database or downstream services; they differ in the failure scope and request pattern.

| Issue | Essence | Typical symptom | Common solutions |
| --- | --- | --- | --- |
| **Cache penetration** | Querying nonexistent data | Neither cache nor database has the data, so repeated requests hit the database | Cache nulls, Bloom filters, parameter validation |
| **Hot-key cache breakdown** | One hot key expires | Concurrent requests flood the database as a popular key expires | Mutex, singleflight, logical expiration |
| **Cache avalanche** | Many keys expire together | Many requests fall back to the source simultaneously | Randomized TTLs, multi-level caches, rate limiting/degradation |
| **Cache consistency** | Cache and database disagree | Reads return stale values after an update | Update DB then evict cache, delayed double deletion, binlog subscriptions |
| **Local cache inconsistency** | Local data is not synchronized across instances | Machine A is updated while B still returns old values | Two-level caches, messages, explicit invalidation, version checks |

### 8.2 Cache Penetration

**Cache penetration** occurs when requested data exists in neither the cache nor the database, so every request passes through the cache to the database.

Common scenarios:

- Malicious requests for many nonexistent IDs.
- Invalid business query conditions repeatedly request invalid data.
- A newly launched system does not cache empty results.

| Solution | Description | Considerations |
| --- | --- | --- |
| **Cache nulls** | Cache empty database results with a short TTL | Avoid retaining stale empty results for too long |
| **Bloom filter** | Check whether a key may exist before accessing the cache/database | False positives are possible, but not false negatives |
| **Parameter validation** | Reject invalid IDs and clearly incorrect parameters | Suitable as the first layer of protection |

**Example: Cache null values**

```java
public User getUserById(Long id) {
    String key = "user:" + id;
    String nullMarker = "__NULL__";

    Object cached = redisTemplate.opsForValue().get(key);
    if (cached != null) {
        return nullMarker.equals(cached) ? null : (User) cached;
    }

    User user = userMapper.selectById(id);
    if (user == null) {
        redisTemplate.opsForValue().set(key, nullMarker, 5, TimeUnit.MINUTES);
        return null;
    }

    redisTemplate.opsForValue().set(key, user, 30, TimeUnit.MINUTES);
    return user;
}
```

**Example: Bloom filter (Redisson RBloomFilter)**

```java
// 1. Dependency (already included in Redisson; nothing extra needed)
// 2. Initialization: preload all valid IDs into the filter at service startup
@Service
public class BloomFilterService {

    @Autowired
    private RedissonClient redissonClient;

    @Autowired
    private UserMapper userMapper;

    private static final String BLOOM_KEY = "bloom:user:ids";

    @PostConstruct
    public void init() {
        RBloomFilter<Long> bloomFilter = redissonClient.getBloomFilter(BLOOM_KEY);
        // Expected elements: 1 million; false-positive rate: 0.1%
        bloomFilter.tryInit(1_000_000L, 0.001);
        // Warm up by adding all user IDs from the database
        userMapper.selectAllIds().forEach(bloomFilter::add);
    }

    // 3. Filter before querying
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public User getUserById(Long id) {
        RBloomFilter<Long> bloomFilter = redissonClient.getBloomFilter(BLOOM_KEY);
        // Definitely absent (100% accurate): reject immediately
        if (!bloomFilter.contains(id)) {
            return null;
        }
        // May exist (false positives possible): follow the normal cache → database path
        String key = "user:" + id;
        User cached = (User) redisTemplate.opsForValue().get(key);
        if (cached != null) return cached;
        User user = userMapper.selectById(id);
        if (user != null) {
            redisTemplate.opsForValue().set(key, user, 30, TimeUnit.MINUTES);
        }
        return user;
    }

    // 4. Add newly created users to the filter
    public void addUser(User user) {
        userMapper.insert(user);
        redissonClient.<Long>getBloomFilter(BLOOM_KEY).add(user.getId());
    }
}
```

> **Note:** A Bloom filter **cannot delete** individual elements. Deleted users remain represented, producing acceptable false positives. If deletions are frequent, rebuild periodically or consider a Counting Bloom Filter.

### 8.3 Hot-Key Cache Breakdown

**Hot-key cache breakdown** occurs when a **hot key** expires and many concurrent requests hit the data source simultaneously, overwhelming the database or downstream service.

Unlike penetration, the requested data **exists and is very popular**. Unlike an avalanche, breakdown usually centers on **one hot key**.

| Solution | Description | Use cases |
| --- | --- | --- |
| **Mutex-protected rebuilding** | One thread queries the database and fills the cache; others wait or fail fast | Few hot keys; brief waiting is acceptable |
| **Logical expiration** | The key does not actually expire; a timestamp in the value triggers asynchronous background refresh | Stable hot data; read performance is the priority |
| **Non-expiring hot data** | Remove TTL from a few hot keys and update them explicitly | Very stable hot data with few updates |

Simple flow:

Request arrives → Hot key is expired → Contend for mutex → One thread queries DB and fills cache → Other threads read the new cache entry

**Example: Mutex-protected rebuilding**

Reuse the SETNX-based `DistributedLockService` with unique lock values and Lua compare-and-delete, preventing an expired lock holder from deleting another request's lock.

```java
@Autowired
private DistributedLockService lockService;

public User getUserById(Long id) {
    String cacheKey = "user:" + id;
    String lockKey = "lock:rebuild:user:" + id;

    // 1. Check the cache first and return on a hit
    User user = (User) redisTemplate.opsForValue().get(cacheKey);
    if (user != null) {
        return user;
    }

    // 2. Cache miss: acquire a mutex (10-second expiration prevents deadlock)
    String lockValue = UUID.randomUUID().toString();
    boolean locked = lockService.tryLock(lockKey, lockValue, 10);

    if (locked) {
        try {
            // 3. Double-check: the previous thread may have just filled the cache
            user = (User) redisTemplate.opsForValue().get(cacheKey);
            if (user != null) return user;

            // 4. Query the database and fill the cache
            user = userMapper.selectById(id);
            if (user != null) {
                redisTemplate.opsForValue().set(cacheKey, user, 30, TimeUnit.MINUTES);
            }
            return user;
        } finally {
            lockService.unlock(lockKey, lockValue); // 5. Atomically verify ownership and release
        }
    } else {
        // Lock acquisition failed: wait briefly and retry while another thread fills the cache
        try {
            Thread.sleep(50);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return getUserById(id); // Recursive retry (bound the number of retries in production)
    }
}
```

### 8.4 Cache Avalanches

A **cache avalanche** occurs when many keys expire together or Redis becomes completely unavailable, causing large numbers of requests to fall back simultaneously and sharply increasing pressure on the database or service chain.

Common triggers:

- Many keys share the same TTL.
- Redis restarts, fails, or experiences network instability.
- Sales events or hot traffic coincide with mass expiration.

| Solution | Description |
| --- | --- |
| **Randomize TTLs** | Prevent many keys from expiring at the same instant |
| **Multi-level caching** | Local cache + Redis reduce the chance that all requests hit the database |
| **Rate limiting and degradation** | Rate-limit, circuit-break, or provide fallbacks for noncritical requests when source traffic is too high |
| **High availability** | Primary-replica + Sentinel or Cluster reduce the likelihood of complete Redis unavailability |

**Example: Add randomness to TTLs**

```java
int baseTtl = 1800;
int randomSeconds = ThreadLocalRandom.current().nextInt(0, 300);
redisTemplate.opsForValue().set(key, value, baseTtl + randomSeconds, TimeUnit.SECONDS);
```

### 8.5 Cache Consistency

A cache is not a transactional database. Business systems more often aim for **eventual consistency** than absolute strong consistency.

The most common practice is **Cache-Aside**:

- **Read:** Check the cache first; on a miss, query the database and fill the cache.
- **Write:** Update the database first, then delete the cache entry.

Updating the cache easily misses concurrent scenarios; deleting it is simpler and provides a clearer recovery path after failure.

| Approach | Method | Characteristics |
| --- | --- | --- |
| **Update DB, then evict cache** | Most common practice | Simple; suitable for most business applications |
| **Delayed double deletion** | Evict after updating DB, wait, then evict again | Reduces the chance of concurrent reads retaining old values |
| **binlog / MQ subscription** | Asynchronously notify cache eviction/refresh after data changes | Suitable for complex systems |

**Example: Update DB, then evict cache (Cache-Aside)**

```java
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String KEY_PREFIX = "user:";
    private static final long TTL_MINUTES = 30;

    // Read: check the cache, then query the database and fill the cache on a miss
    public User getUserById(Long id) {
        String key = KEY_PREFIX + id;
        User cached = (User) redisTemplate.opsForValue().get(key);
        if (cached != null) {
            return cached;
        }
        User user = userMapper.selectById(id);
        if (user != null) {
            redisTemplate.opsForValue().set(key, user, TTL_MINUTES, TimeUnit.MINUTES);
        }
        return user;
    }

    // Write: delete the cache entry after the database transaction commits successfully
    @Transactional
    public void updateUser(User user) {
        userMapper.updateById(user);
        String key = KEY_PREFIX + user.getId();
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                redisTemplate.delete(key);
            }
        });
    }
}
```

> When a `@Transactional` method is called through a Spring proxy, its transaction normally commits after the method returns, so do not delete the cache directly inside the method. Failed post-commit deletion requires retries or MQ/binlog compensation. The approach still targets eventual consistency, with TTL as a fallback.

### 8.6 Local and Two-Level Caches

The greatest advantage of local caching is speed; its main limitation is that it **applies only within the current instance**. Distributed deployments must decide when each instance refreshes or invalidates local entries and whether brief staleness is acceptable.

| Approach | Method | Characteristics |
| --- | --- | --- |
| **Local cache only** | Each instance caches independently | Fastest, but suitable only for small data tolerating brief inconsistency |
| **Redis only** | All instances share Redis | Easier consistency control, but hot traffic concentrates on Redis |
| **Two-level cache** | Local cache → Redis → Database | Combines speed and sharing; common in practice |

Typical two-level read path:

    Request arrives
        ↓
    Check the local cache
        ↓
    On a miss, check Redis
        ↓
    On another miss, query the database
        ↓
    Populate Redis
        ↓
    Populate the local cache

After updates, a common sequence is: **update the database, delete the Redis entry, then notify each instance to invalidate its local cache**. Notifications can use MQ, Redis Pub/Sub, configuration-center pushes, version checks, or periodic refreshes.

> **Note:** Local caches suit dictionary data, configuration, rules, and small hot objects: read-heavy, small datasets tolerating brief inconsistency. Inventory, balances, and strongly consistent state should generally not rely solely on local caches.

**Example: Broadcast local-cache invalidation with Redis Pub/Sub**

```java
// Update data: update DB, delete Redis entry, then broadcast invalidation
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private Cache<Long, User> userLocalCache; // Caffeine local cache

    private static final String EVICT_CHANNEL = "local-cache:evict:user";

    @Transactional
    public void updateUser(User user) {
        userMapper.updateById(user);                                      // 1. Update the database
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                stringRedisTemplate.delete("user:" + user.getId());       // 2. Delete the Redis entry after commit
                stringRedisTemplate.convertAndSend(EVICT_CHANNEL,         // 3. Broadcast invalidation
                        String.valueOf(user.getId()));
            }
        });
    }
}

// Each instance subscribes and clears its local cache when notified
@Component
public class LocalCacheEvictListener implements MessageListener {

    @Autowired
    private Cache<Long, User> userLocalCache;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        Long userId = Long.valueOf(new String(message.getBody()));
        userLocalCache.invalidate(userId);
    }
}

// Pub/Sub subscription configuration
@Configuration
public class RedisPubSubConfig {

    @Bean
    public RedisMessageListenerContainer listenerContainer(
            RedisConnectionFactory factory,
            LocalCacheEvictListener listener) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(factory);
        container.addMessageListener(listener, new PatternTopic("local-cache:evict:*"));
        return container;
    }
}
```

### 8.7 Choosing Cache Lifetimes (TTL)

Keys without expiration remain in memory and may be persisted to disk, risking memory exhaustion. Choose TTLs according to business needs and available resources:

| Dimension | Favors longer TTLs | Favors shorter TTLs or eviction |
| -------------- | --------------------------------- | ------------------------------------- |
| **Mutability** | Nearly immutable, read-only data | Frequently updated data |
| **Consistency** | Some delay is acceptable | Updates must take effect promptly |
| **Request volume/key count** | Few requests and a limited number of cached keys | Many requests/parameter combinations produce many keys and risk filling memory |
| **Memory** | Ample instance memory | Limited memory; key count and size need control |
| **Source access cost** | Expensive database/disk access on a miss | Cheap source access; more misses are acceptable |
| **Update mechanism** | Explicit key deletion on releases or data updates | No deletion process; relies on TTL expiration |

Concurrent reads of immutable shared data (such as static JSON) do not require thread-safety handling. For periodically updated data, set TTL slightly longer than the update interval or delete its key on update so the next request reloads and caches it.

### 8.8 Key Naming Conventions

Use **business prefixes** and **hierarchy** for batch management, troubleshooting, and isolation by business area or type. Avoid collisions between business domains and keep keys reasonably short and readable. A common format is "businessName:dataType:dataIdentifier", optionally prefixed with a version or environment.

```text
businessName:dataType:dataIdentifier

Examples:
user:info:1001          # User information
order:detail:202401001  # Order details
product:stock:5001      # Product inventory
session:token:abc123    # Session token
rate:limit:192.168.1.1  # Rate-limit counter
```

### 8.9 Best Practices

1. **Set expiration:** Prevent unbounded memory growth. Choose TTLs based on mutability, traffic, memory, etc.; keys without expiration remain in memory and risk OOM.
2. **Avoid large keys:** Keep individual values at most 10KB and collections at most 10,000 elements. Large keys increase network and serialization costs, block the main thread, and can stall deletion.
3. **Avoid hot keys:** Excessive QPS on one key can exhaust a single machine. Split keys, add local caching, or read replicas to distribute load.
4. **Prefer SCAN:** Avoid `KEYS *` in production; traverse incrementally with `SCAN` to reduce blocking.
5. **Use connection pools:** Reuse connections and limit concurrency to avoid connection-creation latency and port exhaustion.
6. **Use pipelines appropriately:** Combine batch operations to reduce RTT, but keep each pipeline reasonably sized.
7. **Monitor and alert:** Track memory, hit rate, and slow queries for capacity planning and troubleshooting.
8. **Prefer eviction over cache updates:** Update the database, then delete the cache entry to reduce the risk of concurrent writes restoring stale values.
9. **Protect hot data:** Consider mutex-protected rebuilding, logical expiration, or local caching for hot keys to prevent breakdown under high concurrency.
10. **Cache only small, hot data locally:** Local caching addresses hot traffic and latency, not strongly consistent sharing. Design invalidation and synchronization before deploying multiple instances.

### 8.10 Production Configuration Recommendations

The following covers security (bind address, password, dangerous commands), resources (maxmemory, eviction), persistence, and observability (AOF, slowlog). Adjust it to machine capacity and business requirements.

```properties
# Recommended redis.conf production settings

# Bind to an internal IP, not 0.0.0.0
bind 192.168.1.100

# A password is required
requirepass your_strong_password

# Maximum memory
maxmemory 2gb

# Memory eviction policy
maxmemory-policy allkeys-lru

# Persistence
appendonly yes
appendfsync everysec

# Slow query log
slowlog-log-slower-than 10000
slowlog-max-len 128

# Disable dangerous commands (Redis 6+ can also restrict them with ACL rules such as -flushall)
rename-command FLUSHALL ""
rename-command FLUSHDB ""
rename-command KEYS ""
```

***

## IX. Common Command Reference

### 9.1 Data Operations

| Data type | Common commands |
| ---------- | ------------------------------------------------ |
| String     | SET, GET, INCR, DECR, SETNX, SETEX, MSET, MGET   |
| Hash       | HSET, HGET, HMGET, HGETALL, HDEL, HINCRBY        |
| List       | LPUSH, RPUSH, LPOP, RPOP, LRANGE, LLEN, BLPOP    |
| Set        | SADD, SMEMBERS, SISMEMBER, SREM, SINTER, SUNION  |
| Sorted Set | ZADD, ZSCORE, ZRANK, ZRANGE, ZREVRANGE, ZINCRBY  |

### 9.2 General Commands

| Command | Description |
| ------- | -------------------- |
| KEYS | Find keys (use cautiously in production) |
| SCAN | Scan keys incrementally |
| EXISTS | Check whether a key exists |
| DEL | Delete keys |
| EXPIRE | Set expiration in seconds |
| TTL | Get remaining lifetime |
| TYPE | Get the key type |
| RENAME | Rename a key |
| SELECT | Select a database |
| FLUSHDB | Clear the current database |
| INFO | View server information |

### 9.3 Java Operation Mapping

| Redis command | RedisTemplate method |
| ---------- | ------------------------------------- |
| SET        | `opsForValue().set(key, value)`       |
| GET        | `opsForValue().get(key)`              |
| HSET       | `opsForHash().put(key, field, value)` |
| HGET       | `opsForHash().get(key, field)`        |
| LPUSH      | `opsForList().leftPush(key, value)`   |
| RPOP       | `opsForList().rightPop(key)`          |
| SADD       | `opsForSet().add(key, values...)`     |
| ZADD       | `opsForZSet().add(key, value, score)` |
| DEL        | `delete(key)`                         |
| EXPIRE     | `expire(key, timeout, unit)`          |
