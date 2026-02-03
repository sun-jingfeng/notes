## 一、Redis 概述

### 1.1 什么是 Redis

Redis（Remote Dictionary Server）是一个开源的、基于内存的键值存储数据库，支持多种数据结构（字符串、哈希、列表、集合、有序集合等）。由于数据存储在内存中，读写速度极快，常用于缓存、会话管理、消息队列、排行榜等场景。

**Redis 的核心特点：**

- **高性能**：数据存储在内存中，读写速度可达 10 万+ QPS
- **丰富的数据结构**：支持 String、Hash、List、Set、Sorted Set 等
- **持久化**：支持 RDB 快照和 AOF 日志两种持久化方式
- **原子操作**：所有操作都是原子性的，支持事务
- **主从复制**：支持主从同步，实现读写分离
- **高可用**：支持 Sentinel 哨兵和 Cluster 集群模式

### 1.2 Redis vs 其他缓存

| 特性     | Redis                     | Memcached    |
| -------- | ------------------------- | ------------ |
| 数据结构 | 丰富（5 种+）             | 仅字符串     |
| 持久化   | 支持                      | 不支持       |
| 集群模式 | 原生支持                  | 需客户端实现 |
| 线程模型 | 单线程（6.0 后多线程 IO） | 多线程       |
| 内存管理 | 多种淘汰策略              | LRU          |
| 发布订阅 | 支持                      | 不支持       |

### 1.3 常见应用场景

| 场景         | 说明                         | 使用的数据结构   |
| ------------ | ---------------------------- | ---------------- |
| **缓存**     | 缓存数据库查询结果、热点数据 | String、Hash     |
| **会话管理** | 存储用户登录状态、Token      | String、Hash     |
| **排行榜**   | 游戏排名、热门文章           | Sorted Set       |
| **计数器**   | 点赞数、阅读量、限流         | String（INCR）   |
| **消息队列** | 简单的异步任务队列           | List、Stream     |
| **分布式锁** | 防止并发操作冲突             | String（SETNX）  |
| **去重**     | 用户签到、IP 统计            | Set、HyperLogLog |
| **地理位置** | 附近的人、门店定位           | Geo              |

***

## 二、Redis 安装

Redis 官方提供源码与预编译包，生产环境常用 **Docker** 部署，便于隔离、版本统一和与现有编排（如 Compose、K8s）集成。安装后通过 **redis-cli**（Redis 自带的命令行客户端）连接服务器执行命令、排查问题；后续在应用里通过 TCP 与 Redis 通信，redis-cli 仅用于人工运维与调试。

### 2.1 Docker 方式安装（推荐）

```bash
# 创建数据目录
sudo mkdir -p /srv/redis/data /srv/redis/conf

# 创建配置文件（可选，使用默认配置可跳过）
sudo tee /srv/redis/conf/redis.conf > /dev/null <<'EOF'
# 绑定地址（0.0.0.0 允许外部访问，生产环境建议限制）
bind 0.0.0.0
# 端口
port 6379
# 密码（生产环境必须设置）
requirepass yourpassword
# 持久化
appendonly yes
# 最大内存（可选）
# maxmemory 256mb
# 内存淘汰策略
# maxmemory-policy allkeys-lru
EOF

# 启动 Redis 容器
docker run -d \
  --name redis \
  -p 6379:6379 \
  -v /srv/redis/data:/data \
  -v /srv/redis/conf/redis.conf:/usr/local/etc/redis/redis.conf \
  --restart unless-stopped \
  redis:7-alpine redis-server /usr/local/etc/redis/redis.conf

# 验证
docker exec -it redis redis-cli -a yourpassword ping
# 返回 PONG 表示成功

# 进入交互式命令行
docker exec -it redis redis-cli -a yourpassword
```

### 2.2 Docker Compose 方式

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

### 2.3 连接 Redis

```bash
# 本地连接
redis-cli

# 指定主机和端口
redis-cli -h 127.0.0.1 -p 6379

# 带密码
redis-cli -a yourpassword

# 进入后认证
redis-cli
> AUTH yourpassword

# 测试连接
> PING
PONG

# 查看信息
> INFO
```

***

## 三、Redis 数据类型

Redis 的 Value 有多种**数据结构**，不同类型支持不同命令与时间复杂度；Key 始终是字符串。选择合适类型能简化业务逻辑并提高性能。

### 3.1 String（字符串）

最基本类型，底层为简单动态字符串（SDS），可存字符串、整数或浮点数，单值最大 512MB。支持过期、自增/自减，适合缓存、计数器、分布式锁（SET NX EX）、Session/Token 等单值场景。

```bash
# 设置值
SET name "张三"
SET age 25

# 获取值
GET name

# 设置过期时间（秒）
SET token "abc123" EX 3600
SETEX token 3600 "abc123"

# 设置过期时间（毫秒）
SET token "abc123" PX 3600000

# 仅当 key 不存在时设置（分布式锁常用）
SETNX lock "1"
SET lock "1" NX EX 30

# 自增/自减
INCR counter
INCRBY counter 10
DECR counter
DECRBY counter 5

# 浮点数自增
INCRBYFLOAT price 0.5

# 追加字符串
APPEND name " 先生"

# 获取长度
STRLEN name

# 批量操作
MSET k1 v1 k2 v2 k3 v3
MGET k1 k2 k3
```

### 3.2 Hash（哈希）

即“字段-值”映射，一个 Key 下多组 field-value，底层为哈希表。适合把对象拆成多个字段存储（如 user:1001 下 name、age、email），可单独读写某字段，比把整个对象序列化成 String 更省内存、更新更细粒度。注意单 Key 内字段不宜过多（建议数千以内），否则 HGETALL 等会阻塞。

```bash
# 设置单个字段
HSET user:1001 name "张三"
HSET user:1001 age 25

# 设置多个字段
HMSET user:1001 name "张三" age 25 email "zhangsan@example.com"

# 获取单个字段
HGET user:1001 name

# 获取多个字段
HMGET user:1001 name age

# 获取所有字段和值
HGETALL user:1001

# 获取所有字段名
HKEYS user:1001

# 获取所有值
HVALS user:1001

# 判断字段是否存在
HEXISTS user:1001 name

# 删除字段
HDEL user:1001 email

# 字段数量
HLEN user:1001

# 字段值自增
HINCRBY user:1001 age 1
```

### 3.3 List（列表）

有序、可重复的字符串列表，底层为双向链表（或 ziplist），支持头尾插入/弹出，可做**队列**（LPUSH + BRPOP）、**栈**（LPUSH + LPOP）、时间线等。阻塞命令 BLPOP/BRPOP 常用于简单消息队列；按索引访问（LINDEX）为 O(n)，大列表慎用。

```bash
# 左侧插入（头部）
LPUSH tasks "task1" "task2" "task3"

# 右侧插入（尾部）
RPUSH tasks "task4"

# 获取列表范围（0 到 -1 表示全部）
LRANGE tasks 0 -1

# 获取列表长度
LLEN tasks

# 左侧弹出
LPOP tasks

# 右侧弹出
RPOP tasks

# 阻塞弹出（队列常用，超时秒数）
BLPOP tasks 10
BRPOP tasks 10

# 获取指定位置元素
LINDEX tasks 0

# 设置指定位置元素
LSET tasks 0 "new_task"

# 保留指定范围
LTRIM tasks 0 99
```

### 3.4 Set（集合）

无序、**元素唯一**的字符串集合，底层为哈希表或 intset。适合去重、标签、共同好友等；SINTER/SUNION/SDIFF 提供交集/并集/差集，可做推荐、统计。SMEMBERS 会返回全部元素，大集合慎用，可改用 SSCAN 渐进式遍历。

```bash
# 添加元素
SADD tags "java" "redis" "mysql"

# 获取所有元素
SMEMBERS tags

# 判断元素是否存在
SISMEMBER tags "java"

# 元素数量
SCARD tags

# 移除元素
SREM tags "mysql"

# 随机获取元素
SRANDMEMBER tags 2

# 随机弹出元素
SPOP tags

# 集合运算
SADD set1 "a" "b" "c"
SADD set2 "b" "c" "d"

# 交集
SINTER set1 set2

# 并集
SUNION set1 set2

# 差集
SDIFF set1 set2
```

### 3.5 Sorted Set（有序集合）

每个元素带一个 **score**（分数），按 score 排序，元素唯一（同分可多成员）。底层跳表 + 哈希，按 score 范围或排名查询均为 O(log N)。典型用法：排行榜（ZREVRANGE）、延迟队列（score 为执行时间）、带权重的去重与排序。

```bash
# 添加元素（分数 元素）
ZADD leaderboard 100 "player1" 200 "player2" 150 "player3"

# 获取排名（从低到高，0 开始）
ZRANK leaderboard "player1"

# 获取排名（从高到低）
ZREVRANK leaderboard "player2"

# 获取分数
ZSCORE leaderboard "player1"

# 按排名范围获取（从低到高）
ZRANGE leaderboard 0 -1
ZRANGE leaderboard 0 -1 WITHSCORES

# 按排名范围获取（从高到低）
ZREVRANGE leaderboard 0 2 WITHSCORES

# 按分数范围获取
ZRANGEBYSCORE leaderboard 100 200

# 元素数量
ZCARD leaderboard

# 指定分数范围内的元素数量
ZCOUNT leaderboard 100 200

# 增加分数
ZINCRBY leaderboard 50 "player1"

# 移除元素
ZREM leaderboard "player1"
```

### 3.6 通用命令

以下命令作用于任意类型的 Key，用于生命周期管理（过期、删除）、存在性判断和运维（TYPE、SELECT、FLUSH 等）。KEYS * 会阻塞，生产环境应用 SCAN 替代。

```bash
# 查看所有 key（生产慎用）
KEYS *
KEYS user:*

# 判断 key 是否存在
EXISTS name

# 删除 key
DEL name
DEL k1 k2 k3

# 设置过期时间（秒）
EXPIRE name 3600

# 设置过期时间（毫秒）
PEXPIRE name 3600000

# 查看剩余过期时间（秒）
TTL name

# 查看剩余过期时间（毫秒）
PTTL name

# 移除过期时间
PERSIST name

# 查看 key 类型
TYPE name

# 重命名
RENAME oldkey newkey

# 选择数据库（0-15，默认 0）
SELECT 1

# 清空当前数据库
FLUSHDB

# 清空所有数据库
FLUSHALL
```

***

## 四、Java 中使用 Redis

Spring Data Redis 通过 **RedisConnection** 封装与 Redis 的 TCP 通信，**RedisTemplate** 在其之上提供类型化 API（opsForValue、opsForHash 等）并负责序列化/反序列化。推荐使用**连接池**（如 Lettuce 的 pool）：复用连接、限制并发连接数，避免频繁建连带来的延迟与资源消耗。

### 4.1 Spring Boot 集成 Redis

#### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- 连接池（可选，推荐） -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```

#### 配置文件

`host/port/password/database` 指定连接目标；`timeout` 防止长时间阻塞；`lettuce.pool` 配置连接池大小（max-active、max-idle、min-idle）和获取连接最大等待时间（max-wait），按 QPS 与实例数合理设置，避免连接耗尽或闲置过多。

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: yourpassword    # 无密码可省略
      database: 0               # 数据库索引，默认 0
      timeout: 3000ms           # 连接超时
      lettuce:
        pool:
          max-active: 8         # 最大连接数
          max-idle: 8           # 最大空闲连接
          min-idle: 0           # 最小空闲连接
          max-wait: -1ms        # 获取连接最大等待时间，-1 表示无限制
```

#### 序列化说明

- **什么是序列化**：把内存中的对象转成可存储、可传输的字节流；反序列化则是把字节流还原成对象。Redis 的 Key/Value 在底层都是字节数组，Java 端存对象前必须序列化，读出来后再反序列化。
- **为什么需要关注序列化**：
  - 默认 `RedisTemplate` 使用 **JDK 序列化**（`JdkSerializationRedisSerializer`），存进去的数据是二进制、不可读，且依赖 Java 类结构，跨语言、跨版本不友好。
  - 自定义序列化可以改为可读格式（如 JSON）、统一 Key 的格式、避免类变更导致的反序列化问题。
- **常见方案对比**：
  - **JDK 序列化**：无需配置，但二进制不可读、体积大、易受类结构影响，一般不推荐做 Value 序列化。
  - **String 序列化**（`StringRedisSerializer`）：只适用于字符串，Key 通常用此方式，简洁可读。
  - **JSON 序列化**（如 `Jackson2JsonRedisSerializer`）：可读性好、跨语言、便于排查；需要配置类型信息以正确反序列化泛型/多态。
  - **其他**：如 Kryo、Protobuf 等，性能更好但需要额外依赖和约定，按需选用。
- **Spring Data Redis 中的位置**：`RedisTemplate` 的 `keySerializer`、`valueSerializer`、`hashKeySerializer`、`hashValueSerializer` 分别控制 Key 与 Value 的序列化方式；不设置时使用默认的 JDK 序列化。

#### Redis 配置类（可选，自定义序列化）

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        // Key 使用 String 序列化
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        // Value 使用 JSON 序列化
        Jackson2JsonRedisSerializer<Object> jsonSerializer = 
            new Jackson2JsonRedisSerializer<>(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.activateDefaultTyping(om.getPolymorphicTypeValidator(), 
            ObjectMapper.DefaultTyping.NON_FINAL);
        jsonSerializer.setObjectMapper(om);

        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }
}
```

### 4.2 RedisTemplate 操作

`RedisTemplate<K, V>` 是 Spring 对 Redis 的**门面**：内部通过 `RedisConnectionFactory` 获取连接，按数据类型调用 `opsForValue()`、`opsForHash()` 等得到 `*Operations`，再通过配置的 Serializer 把 Java 对象与字节数组互转。Key 一般固定为 String，Value 可为 Object（需配置 JSON 等序列化）；若只存字符串，可直接用 `StringRedisTemplate`。

#### 注入 RedisTemplate

```java
@Service
public class RedisService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // 或使用 StringRedisTemplate（Key 和 Value 都是 String）
    @Autowired
    private StringRedisTemplate stringRedisTemplate;
}
```

#### String 操作

```java
// 获取操作对象
ValueOperations<String, Object> ops = redisTemplate.opsForValue();

// 设置值
ops.set("name", "张三");

// 设置值并指定过期时间
ops.set("token", "abc123", 30, TimeUnit.MINUTES);

// 仅当 key 不存在时设置（分布式锁）
Boolean success = ops.setIfAbsent("lock", "1", 30, TimeUnit.SECONDS);

// 获取值
Object value = ops.get("name");

// 自增
Long count = ops.increment("counter");
Long count = ops.increment("counter", 10);

// 批量设置
Map<String, Object> map = new HashMap<>();
map.put("k1", "v1");
map.put("k2", "v2");
ops.multiSet(map);

// 批量获取
List<Object> values = ops.multiGet(Arrays.asList("k1", "k2"));
```

#### Hash 操作

```java
HashOperations<String, String, Object> ops = redisTemplate.opsForHash();

// 设置字段
ops.put("user:1001", "name", "张三");
ops.put("user:1001", "age", 25);

// 批量设置
Map<String, Object> userMap = new HashMap<>();
userMap.put("name", "张三");
userMap.put("age", 25);
ops.putAll("user:1001", userMap);

// 获取字段
Object name = ops.get("user:1001", "name");

// 获取所有字段
Map<String, Object> user = ops.entries("user:1001");

// 判断字段是否存在
Boolean exists = ops.hasKey("user:1001", "name");

// 删除字段
ops.delete("user:1001", "name", "age");

// 字段自增
ops.increment("user:1001", "age", 1);
```

#### List 操作

```java
ListOperations<String, Object> ops = redisTemplate.opsForList();

// 左侧插入
ops.leftPush("tasks", "task1");
ops.leftPushAll("tasks", "task2", "task3");

// 右侧插入
ops.rightPush("tasks", "task4");

// 获取范围
List<Object> tasks = ops.range("tasks", 0, -1);

// 获取长度
Long size = ops.size("tasks");

// 弹出
Object task = ops.leftPop("tasks");
Object task = ops.rightPop("tasks");

// 阻塞弹出
Object task = ops.leftPop("tasks", 10, TimeUnit.SECONDS);
```

#### Set 操作

```java
SetOperations<String, Object> ops = redisTemplate.opsForSet();

// 添加元素
ops.add("tags", "java", "redis", "mysql");

// 获取所有元素
Set<Object> tags = ops.members("tags");

// 判断是否存在
Boolean isMember = ops.isMember("tags", "java");

// 元素数量
Long size = ops.size("tags");

// 移除元素
ops.remove("tags", "mysql");

// 随机获取
Object tag = ops.randomMember("tags");

// 集合运算
Set<Object> inter = ops.intersect("set1", "set2");
Set<Object> union = ops.union("set1", "set2");
Set<Object> diff = ops.difference("set1", "set2");
```

#### Sorted Set 操作

```java
ZSetOperations<String, Object> ops = redisTemplate.opsForZSet();

// 添加元素
ops.add("leaderboard", "player1", 100);
ops.add("leaderboard", "player2", 200);

// 获取分数
Double score = ops.score("leaderboard", "player1");

// 获取排名（从低到高）
Long rank = ops.rank("leaderboard", "player1");

// 获取排名（从高到低）
Long rank = ops.reverseRank("leaderboard", "player1");

// 按排名范围获取（从高到低）
Set<Object> top3 = ops.reverseRange("leaderboard", 0, 2);

// 带分数获取
Set<ZSetOperations.TypedTuple<Object>> top3 = 
    ops.reverseRangeWithScores("leaderboard", 0, 2);

// 增加分数
ops.incrementScore("leaderboard", "player1", 50);

// 元素数量
Long size = ops.size("leaderboard");
```

#### 通用操作

```java
// 删除 key
redisTemplate.delete("name");
redisTemplate.delete(Arrays.asList("k1", "k2", "k3"));

// 判断 key 是否存在
Boolean exists = redisTemplate.hasKey("name");

// 设置过期时间
redisTemplate.expire("name", 30, TimeUnit.MINUTES);

// 获取剩余过期时间
Long ttl = redisTemplate.getExpire("name", TimeUnit.SECONDS);

// 获取 key 类型
DataType type = redisTemplate.type("name");

// 查找 key（生产慎用）
Set<String> keys = redisTemplate.keys("user:*");
```

### 4.3 封装 Redis 工具类

将常用 Key/Value、Hash、过期、删除等操作封装成工具类，可统一 key 前缀、过期策略和异常处理，避免在业务代码里到处写 `redisTemplate.opsForValue().set(...)`，便于维护与替换实现。

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

    // ==================== 通用 ====================

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

### 4.4 使用示例

- **缓存**：采用 **Cache-Aside** 模式——读时先查缓存，未命中再查库并回写缓存；写时先更新库再删缓存（或更新缓存），避免长期脏数据。  
- **分布式锁**：用 Redis 的 `SET key value NX EX seconds` 实现“仅当 key 不存在时设置并带过期”，避免死锁；释放时需校验 value 再 DEL，防止误删他人锁。  
- **限流**：示例为**固定窗口计数器**（某 key 在时间窗口内递增，超限则拒绝）；更平滑可用滑动窗口或令牌桶，仍可用 Redis 实现。

#### 缓存用户信息

```java
@Service
public class UserService {

    @Autowired
    private RedisUtils redisUtils;

    @Autowired
    private UserMapper userMapper;

    private static final String USER_CACHE_KEY = "user:";
    private static final long CACHE_EXPIRE = 30; // 分钟

    public User getUserById(Long id) {
        String key = USER_CACHE_KEY + id;

        // 先查缓存
        User user = redisUtils.get(key, User.class);
        if (user != null) {
            return user;
        }

        // 缓存未命中，查数据库
        user = userMapper.selectById(id);
        if (user != null) {
            // 写入缓存
            redisUtils.set(key, user, CACHE_EXPIRE, TimeUnit.MINUTES);
        }

        return user;
    }

    public void updateUser(User user) {
        userMapper.updateById(user);
        // 删除缓存
        redisUtils.delete(USER_CACHE_KEY + user.getId());
    }
}
```

#### 简单分布式锁

```java
@Service
public class OrderService {

    @Autowired
    private RedisUtils redisUtils;

    public boolean createOrder(Long productId, Long userId) {
        String lockKey = "lock:order:" + productId;
        String lockValue = UUID.randomUUID().toString();

        try {
            // 获取锁（30 秒过期）
            Boolean locked = redisUtils.setIfAbsent(lockKey, lockValue, 30, TimeUnit.SECONDS);
            if (!Boolean.TRUE.equals(locked)) {
                return false; // 获取锁失败
            }

            // 执行业务逻辑
            // ...

            return true;
        } finally {
            // 释放锁（需确保只释放自己的锁）
            Object value = redisUtils.get(lockKey);
            if (lockValue.equals(value)) {
                redisUtils.delete(lockKey);
            }
        }
    }
}
```

#### 接口限流

```java
@Service
public class RateLimitService {

    @Autowired
    private RedisUtils redisUtils;

    /**
     * 简单计数器限流
     * @param key 限流 key
     * @param limit 限制次数
     * @param windowSeconds 时间窗口（秒）
     * @return 是否允许访问
     */
    public boolean isAllowed(String key, int limit, int windowSeconds) {
        Long count = redisUtils.increment(key);

        if (count == 1) {
            // 首次访问，设置过期时间
            redisUtils.expire(key, windowSeconds, TimeUnit.SECONDS);
        }

        return count <= limit;
    }
}

// 使用
@RestController
public class ApiController {

    @Autowired
    private RateLimitService rateLimitService;

    @GetMapping("/api/data")
    public Result getData(HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        String key = "rate_limit:" + ip;

        // 每分钟最多 10 次
        if (!rateLimitService.isAllowed(key, 10, 60)) {
            return Result.error("请求过于频繁，请稍后再试");
        }

        // 正常业务逻辑
        return Result.success(data);
    }
}
```

***

## 五、Spring Cache 注解方式

Spring 提供了一套**缓存抽象**（不绑定具体实现），通过声明式注解即可使用缓存，底层可切换为 Redis、Caffeine、Ehcache 等。何时用注解、何时用 RedisTemplate：注解适合“按方法返回值缓存/失效”的读多写少场景，配置简单、与业务解耦；需要细粒度控制（如复杂 key、多 key、管道、分布式锁、限流）或非返回值型缓存时，用 RedisTemplate 或封装好的工具类更合适。二者可并存：同一项目里部分用 `@Cacheable`，部分用 `RedisUtils`。

### 5.1 启用缓存

**`@EnableCaching`** 用来开启 Spring 的声明式缓存。不加它的话，后面的 `@Cacheable` 等注解不会生效（相当于没开“缓存开关”）。一般加在**配置类**或**启动类**上即可。

```java
@SpringBootApplication
@EnableCaching
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 5.2 配置 Redis 作为缓存

开启缓存后，需要指定**缓存实现**。这里用 Redis：`spring.cache.type=redis`。其他常用项：`time-to-live` 控制过期时间，`key-prefix` 避免与其他 key 冲突，`cache-null-values: true` 可缓存空结果，减轻缓存穿透。

```yaml
spring:
  cache:
    type: redis
    redis:
      time-to-live: 3600000   # 缓存过期时间（毫秒）
      key-prefix: "cache:"    # key 前缀
      use-key-prefix: true
      cache-null-values: true # 是否缓存空值（防止缓存穿透）
```

### 5.3 缓存注解

- **@Cacheable**：适合**读多写少**的查询。执行前先按 key 查缓存，命中则直接返回、不执行方法；未命中才执行方法，并把返回值写入缓存。因此**写操作不要用 @Cacheable**，否则每次都会执行方法。
- **@CachePut**：**总是执行方法**，并用返回值更新缓存。常用于新增、更新后要把最新结果放入缓存，保证后续读到的是一致的。
- **@CacheEvict**：**删除**缓存条目（按 key 或 `allEntries=true` 清空整个 cache）。常用于删除、更新后让旧缓存失效；`beforeInvocation=true` 表示在方法执行前就删缓存，避免方法抛异常时缓存没删掉。
- **@Caching**：同一方法上需要多种缓存操作时（例如同时 put 一个 key、evict 另一个 cache），用其组合多个注解。

```java
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    /**
     * @Cacheable：查询时先查缓存，未命中则执行方法并缓存结果
     * value/cacheNames：缓存名称
     * key：缓存 key，支持 SpEL 表达式
     * unless：条件为 true 时不缓存
     */
    @Cacheable(value = "user", key = "#id", unless = "#result == null")
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }

    /**
     * @CachePut：执行方法并更新缓存
     */
    @CachePut(value = "user", key = "#user.id")
    public User updateUser(User user) {
        userMapper.updateById(user);
        return user;
    }

    /**
     * @CacheEvict：删除缓存
     * allEntries：是否清空所有缓存
     * beforeInvocation：是否在方法执行前删除
     */
    @CacheEvict(value = "user", key = "#id")
    public void deleteUser(Long id) {
        userMapper.deleteById(id);
    }

    /**
     * @Caching：组合多个缓存操作
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

### 5.4 SpEL 表达式

Spring 表达式语言（SpEL）可在注解中引用方法参数、返回值、Bean 等，实现**动态 key**（如 `#id`、`#user.id`）和**条件缓存**（`condition` 决定是否查缓存、`unless` 决定是否写缓存），同一方法在不同参数下对应不同缓存条目，避免 key 冲突或误用。注解里的 `key`、`condition`、`unless` 等支持 SpEL，常用写法如下。

| 表达式            | 说明       | 示例                   |
| ----------------- | ---------- | ---------------------- |
| `#参数名`         | 方法参数   | `#id`、`#user`         |
| `#p0`、`#a0`      | 第一个参数 | `#p0`                  |
| `#result`         | 方法返回值 | `#result.id`           |
| `#root.method`    | 当前方法   | `#root.method.name`    |
| `#root.target`    | 目标对象   | `#root.target`         |
| `#root.caches[0]` | 当前缓存   | `#root.caches[0].name` |

***

## 六、常见问题与最佳实践

### 6.1 缓存问题

引入缓存后会出现穿透、击穿、雪崩与一致性问题，本质是“请求没被缓存挡住直打存储”或“缓存与库不一致”。理解成因才能正确选方案（空值/布隆、互斥锁/永不过期、过期时间打散、先更新库再删缓存等）。

| 问题         | 描述                                  | 解决方案                             |
| ------------ | ------------------------------------- | ------------------------------------ |
| **缓存穿透** | 查询不存在的数据，请求直达数据库      | 缓存空值；布隆过滤器                 |
| **缓存击穿** | 热点 key 过期瞬间，大量请求直达数据库 | 互斥锁重建缓存；热点 key 永不过期    |
| **缓存雪崩** | 大量 key 同时过期，导致数据库压力骤增 | 过期时间加随机值；多级缓存；限流降级 |
| **数据一致** | 缓存与数据库数据不一致                | 先更新数据库，再删除缓存；延迟双删   |

### 6.2 Key 设计规范

Key 要有**业务前缀**和**层次**，便于按业务或类型批量管理、排查和隔离；避免不同业务 key 冲突；控制单 key 长度，可读即可。常见格式为“业务名:数据类型:数据标识”，必要时加版本或环境前缀。

```
业务名:数据类型:数据标识

示例：
user:info:1001          # 用户信息
order:detail:202401001  # 订单详情
product:stock:5001      # 商品库存
session:token:abc123    # 会话 Token
rate:limit:192.168.1.1  # 限流计数
```

### 6.3 最佳实践

1. **设置过期时间**：避免内存无限增长，根据业务设置合理的 TTL；不设过期则 key 常驻内存，易 OOM。
2. **避免大 Key**：单个 Value 不超过 10KB，集合元素不超过 1 万；大 key 会拉高网络与序列化成本，阻塞主线程，删除时易卡顿。
3. **避免热点 Key**：单 key  QPS 过高会打满单机能力；可拆 key、加本地缓存或读从库分散压力。
4. **禁用危险命令**：生产环境禁用 `KEYS *`、`FLUSHALL`、`FLUSHDB`，防止误操作或恶意扫库导致阻塞/数据清空。
5. **使用连接池**：复用连接、限制并发，避免频繁建连带来的延迟与端口耗尽。
6. **合理使用管道**：批量操作使用 Pipeline 将多次往返合并为一次，减少 RTT，注意单次 pipeline 不宜过大。
7. **监控告警**：监控内存使用、命中率、慢查询，便于容量规划与问题定位。

### 6.4 生产环境配置建议

以下配置从安全（bind、密码、禁用危险命令）、资源（maxmemory、淘汰策略）、持久化与可观测性（AOF、slowlog）几方面给出建议，实际需按机器规格与业务调整。

```properties
# redis.conf 生产配置建议

# 绑定内网 IP，不要用 0.0.0.0
bind 192.168.1.100

# 必须设置密码
requirepass your_strong_password

# 最大内存
maxmemory 2gb

# 内存淘汰策略
maxmemory-policy allkeys-lru

# 持久化
appendonly yes
appendfsync everysec

# 慢查询日志
slowlog-log-slower-than 10000
slowlog-max-len 128

# 禁用危险命令
rename-command FLUSHALL ""
rename-command FLUSHDB ""
rename-command KEYS ""
```

***

## 七、常用命令速查表

### 7.1 数据操作

| 数据类型   | 常用命令                                         |
| ---------- | ------------------------------------------------ |
| String     | SET、GET、INCR、DECR、SETNX、SETEX、MSET、MGET   |
| Hash       | HSET、HGET、HMSET、HMGET、HGETALL、HDEL、HINCRBY |
| List       | LPUSH、RPUSH、LPOP、RPOP、LRANGE、LLEN、BLPOP    |
| Set        | SADD、SMEMBERS、SISMEMBER、SREM、SINTER、SUNION  |
| Sorted Set | ZADD、ZSCORE、ZRANK、ZRANGE、ZREVRANGE、ZINCRBY  |

### 7.2 通用命令

| 命令    | 说明                 |
| ------- | -------------------- |
| KEYS    | 查找 key（生产慎用） |
| EXISTS  | 判断 key 是否存在    |
| DEL     | 删除 key             |
| EXPIRE  | 设置过期时间（秒）   |
| TTL     | 查看剩余过期时间     |
| TYPE    | 查看 key 类型        |
| RENAME  | 重命名 key           |
| SELECT  | 选择数据库           |
| FLUSHDB | 清空当前数据库       |
| INFO    | 查看服务器信息       |

### 7.3 Java 操作对照

| Redis 命令 | RedisTemplate 方法                    |
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
