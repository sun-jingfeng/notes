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

### 1.2 Redis vs 其他缓存方案

| 对比项 | Redis | Memcached | 本地缓存（如 Caffeine / ConcurrentHashMap） |
| --- | --- | --- | --- |
| **部署形态** | 独立缓存服务 | 独立缓存服务 | 应用进程内缓存 |
| **访问方式** | 通常通过 TCP 通信 | 通常通过 TCP 通信 | 进程内内存访问 |
| **访问速度** | 很快 | 很快 | 更快 |
| **数据结构** | 丰富（5 种+） | 仅字符串 | 由 Java 对象结构决定 |
| **持久化** | 支持 | 不支持 | 通常不持久化 |
| **共享能力** | 多实例共享 | 多实例共享 | 仅当前实例可见 |
| **集群扩展** | 原生支持 | 需客户端实现 | 不适合靠自身做分布式共享 |
| **典型问题** | 网络开销、序列化、热点 key | 功能较少 | 实例间不一致、占用 JVM 内存 |

### 1.3 Redis 与本地缓存

**本地缓存** 是把数据直接缓存在当前 Java 应用进程内存里，例如 `ConcurrentHashMap`、**Caffeine**、**Ehcache**。它和 Redis 都属于缓存方案，但两者解决的问题并不完全相同。

| 对比项 | Redis | 本地缓存 |
| --- | --- | --- |
| **数据位置** | 独立 Redis 进程内存 | 当前 JVM 进程内存 |
| **是否走网络** | 是 | 否 |
| **是否需要序列化** | 通常需要 | 通常不需要或成本更低 |
| **共享范围** | 多个应用实例共享 | 仅当前实例共享 |
| **性能特点** | 高性能，适合集中式缓存 | 访问更快，适合热点小数据 |
| **主要风险** | 网络抖动、热点 key、容量规划 | 内存占用、失效管理、分布式一致性 |

**本地缓存** 适合高频读取、数据量不大、对延迟敏感、可接受短暂不一致的数据，例如字典配置、只读元数据、热点规则、小型配置表。

实际项目里常见做法不是二选一，而是**两级缓存**：先读本地缓存，再读 Redis，最后回源数据库。这样可以让本地缓存承担热点流量，让 Redis 负责跨实例共享。

> **注意**：面试中至少要答出“本地缓存更快，因为不走网络，也没有远端缓存的序列化与反序列化开销；但它只能当前实例使用，分布式场景下一致性更难保证”。

### 1.4 常见应用场景

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

# 一次设置多个字段
HSET user:1001 name "张三" age 25 email "zhangsan@example.com"

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

# 渐进式扫描（生产推荐）
SCAN 0 MATCH user:* COUNT 100

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

## 四、Redis 核心机制

### 4.1 Redis 为什么快

**Redis 的高性能**来自“内存访问 + 高效数据结构 + 事件驱动 + 避免大量线程切换”的组合，而不是单靠“单线程”三个字。它已经很快，但和本地缓存相比仍多了一层网络通信与序列化成本。

| 因素 | 说明 |
| --- | --- |
| **基于内存** | 绝大多数读写都在内存完成，避免磁盘随机 IO 开销。 |
| **数据结构高效** | String、Hash、ZSet 等都针对典型场景做了优化。 |
| **单线程执行命令** | 命令串行执行，避免了共享数据下的锁竞争与上下文切换。 |
| **IO 多路复用** | 用一个线程监听多个连接事件，提升网络处理效率。 |
| **协议简单** | RESP 协议解析成本低，客户端实现也较轻。 |

> **注意**：Redis 6.0 起引入了多线程 IO，用于网络读写，命令执行本身仍主要是单线程模型。

> **补充**：本地缓存通常会比 Redis 再快一层，因为它不需要跨进程通信，也不需要把对象编码成网络传输格式。

### 4.2 过期删除与内存淘汰

Redis 通过**过期删除**和**内存淘汰**两套机制控制数据生命周期：前者处理“已经过期”的 key，后者处理“内存已满但仍要写入”的场景。

| 机制 | 触发时机 | 核心做法 | 目的 |
| --- | --- | --- | --- |
| **过期删除** | key 到达过期时间 | 惰性删除 + 定期删除 | 清理失效数据 |
| **内存淘汰** | 达到 `maxmemory` 上限 | 按淘汰策略移除部分 key | 避免继续写入导致 OOM |

#### 1. 过期删除

- **惰性删除**：访问某个 key 时才检查是否过期，过期则删除。
- **定期删除**：Redis 周期性随机抽样带过期时间的 key，删除其中已过期的部分。

惰性删除节省 CPU，但可能让过期 key 在内存中停留更久；定期删除用于补足这一点。两者组合能在 CPU 与内存之间取得平衡。

#### 2. 内存淘汰策略

当设置了 `maxmemory` 后，写入新数据且内存不足时，Redis 会按 `maxmemory-policy` 决定是否淘汰旧 key。

| 策略 | 说明 | 适用场景 |
| --- | --- | --- |
| **noeviction** | 不淘汰，直接报错 | 对数据完整性要求高，不接受自动删除 |
| **allkeys-lru** | 所有 key 中淘汰最近最少使用的 | 通用缓存场景，最常见 |
| **volatile-lru** | 只在设置了 TTL 的 key 中淘汰 LRU | 同时存在持久数据与缓存数据 |
| **allkeys-lfu** | 所有 key 中淘汰最不经常使用的 | 热点分布明显且长期不均的场景 |
| **volatile-ttl** | 优先淘汰剩余生存时间更短的 key | TTL 设计清晰的缓存场景 |
| **volatile-random** | 随机淘汰设置了 TTL 的 key | 很少单独使用 |

### 4.3 持久化机制

Redis 虽然以内存为主，但可通过 **RDB** 和 **AOF** 持久化降低重启或宕机后的数据丢失风险。

| 方式 | 核心机制 | 优点 | 缺点 | 适用场景 |
| --- | --- | --- | --- | --- |
| **RDB** | 按时间点生成内存快照 | 文件紧凑、恢复快、适合备份 | 两次快照之间的数据可能丢失 | 备份、全量恢复 |
| **AOF** | 追加记录写命令 | 数据更完整、可读性更好 | 文件更大、恢复通常更慢 | 对数据完整性要求较高 |

常见建议：

- **RDB** 适合做定时快照和备份。
- **AOF everysec** 是生产中常见折中方案，通常最多丢失 1 秒数据。
- 对恢复速度和数据安全都敏感时，可同时开启 **RDB + AOF**。

```properties
# RDB
save 900 1
save 300 10
save 60 10000

# AOF
appendonly yes
appendfsync everysec
```

### 4.4 部署模式与高可用

Redis 有四种常见部署模式，从单机到集群依次在可用性和扩展性上递进。

| 模式 | 节点数 | 解决的核心问题 | 局限 | 适用场景 |
| --- | --- | --- | --- | --- |
| **单机** | 1 | 快速部署，无冗余 | 单点，无 HA | 开发/测试、低并发单机项目 |
| **主从复制** | 1 主 + N 从 | 数据冗余、读写分离 | 主节点故障需人工切换 | 读多写少、有读扩展需求 |
| **哨兵（Sentinel）** | 主从 + ≥3 哨兵 | 自动故障转移 | 不分片，单主写上限固定 | 中等规模 HA，写压力不高 |
| **集群（Cluster）** | ≥6（3 主 3 从） | 数据分片 + HA | 架构复杂，跨 slot 操作受限 | 大数据量/高并发横向扩展 |

#### 1. 单机模式

一个 Redis 实例，无冗余。部署最简单，性能也不差（内存访问，I/O 多路复用），但存在单点风险——Redis 宕机则缓存完全不可用，服务需要有回源或降级兜底。

```
[Client] → [Redis 单实例]
```

适合：开发测试、低并发内部系统、对高可用要求不高的项目。

#### 2. 主从复制

一个**主节点（Master）**负责写，一个或多个**从节点（Replica）**异步同步主节点数据，可承担读请求（读写分离）。

```
[Client 写] → [Master]
                  ↓ 异步同步
[Client 读] → [Replica 1]
[Client 读] → [Replica 2]
```

**复制原理：**
- 首次连接：从节点发送 `PSYNC`，主节点生成 RDB 快照全量发送，从节点加载后接收增量命令。
- 断线重连：主节点维护复制缓冲区（repl_backlog），重连后尝试部分重同步；若缓冲区已满则重新全量同步。

**局限：** 主节点故障后，需人工将某个从节点提升为主节点，期间服务不可写。

```bash
# 从节点配置
replicaof 192.168.1.10 6379
```

#### 3. 哨兵模式（Sentinel）

在主从复制基础上，引入 **≥3 个 Sentinel 进程**（奇数，满足多数派投票）监控主从健康状态，主节点故障时自动完成故障转移，并通知客户端新主节点地址。

```
[Sentinel 1]  [Sentinel 2]  [Sentinel 3]
       ↓              ↓              ↓
    [Master] ←→ [Replica 1] ←→ [Replica 2]
```

**故障转移流程：**
1. Sentinel 发现主节点无响应 → 标记为**主观下线（SDOWN）**。
2. 超过半数 Sentinel 确认 → 标记为**客观下线（ODOWN）**。
3. Sentinel 间投票选出 Leader，由 Leader 执行故障转移：选一个从节点提升为新主，其他从节点重新复制新主，通知客户端。

客户端连接 Sentinel 地址而不是直连 Redis，由 Sentinel 告知当前主节点地址。

```yaml
# Spring Boot 配置哨兵模式
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
# sentinel.conf（三个哨兵节点各一份，端口不同）
port 26379
sentinel monitor mymaster 192.168.1.10 6379 2
sentinel auth-pass mymaster yourpassword
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
sentinel parallel-syncs mymaster 1
```

适合：中等规模生产环境，需要自动 HA 但写入量不超过单主上限。

#### 4. 集群模式（Cluster）

Redis Cluster 将数据分散到多个**主节点**，总共 **16384 个 slot** 按 `CRC16(key) % 16384` 均匀分布于各主节点，每个主节点可配从节点以提供 HA。

```
[Master A: slot 0–5460]  [Master B: slot 5461–10922]  [Master C: slot 10923–16383]
       ↓                           ↓                            ↓
  [Replica A]                 [Replica B]                  [Replica C]
```

**路由机制：** 客户端计算 key 所属 slot，找到对应节点写入；若连错节点，Redis 返回 `MOVED` 重定向，客户端自动跟随。

**注意事项：**
- 跨节点的多 key 操作（`MGET`、事务、Lua 脚本）需所有 key 落在同一 slot，可用 **Hash Tag**（`{tag}key`）强制相同路由。
- 最少 3 主 3 从（6 节点），少于 3 主时集群无法正常工作。
- 客户端需使用支持 Cluster 的驱动（Lettuce、Jedis 均原生支持）。

```yaml
# Spring Boot 配置集群模式
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

适合：数据量或写入量超出单机上限，需要横向扩展的大流量场景。

#### 5. 选型参考

| 场景 | 推荐模式 |
| --- | --- |
| 本地开发、测试环境 | 单机 |
| 低并发内部系统、单机部署 | 单机 |
| 中小型生产，需要自动故障转移 | 哨兵（Sentinel）|
| 读多写少，只需读扩展 | 主从复制（或 + Sentinel）|
| 大数据量 / 高写入量，需要横向扩容 | 集群（Cluster）|
***

## 五、Java 中使用 Redis

Spring Data Redis 通过 **RedisConnection** 封装与 Redis 的 TCP 通信，**RedisTemplate** 在其之上提供类型化 API（opsForValue、opsForHash 等）并负责序列化/反序列化。推荐使用**连接池**（如 Lettuce 的 pool）：复用连接、限制并发连接数，避免频繁建连带来的延迟与资源消耗。

### 5.1 Spring Boot 集成 Redis

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

        // Key 使用 String 序列化（可读、便于 redis-cli 查看）
        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);

        // Value 使用 JSON 序列化（保留类型信息，支持泛型反序列化，跨语言可读）
        GenericJackson2JsonRedisSerializer jsonSerializer =
            new GenericJackson2JsonRedisSerializer();
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }
}
```

### 5.2 RedisTemplate 操作

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

### 5.3 封装 Redis 工具类

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

### 5.4 使用示例

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

> 此处为内联示例，完整的分布式锁实现（含 UUID 防误删、Lua 原子解锁、Redisson 生产方案）见第七章。

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
            // 获取锁（30 秒过期）
            Boolean locked = stringRedisTemplate.opsForValue()
                .setIfAbsent(lockKey, lockValue, 30, TimeUnit.SECONDS);
            if (!Boolean.TRUE.equals(locked)) {
                return false; // 获取锁失败
            }

            // 执行业务逻辑
            // ...

            return true;
        } finally {
            // 使用 Lua 脚本保证“比较锁值 + 删除锁”原子执行
            stringRedisTemplate.execute(UNLOCK_SCRIPT, Collections.singletonList(lockKey), lockValue);
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

### 5.5 Pipeline（管道批量操作）

Redis 客户端默认每条命令独立发送，每次都经历"发送 → 等 Redis 处理 → 收到响应"的完整 RTT。**Pipeline** 将多条命令一次性打包发给 Redis，批量执行后一并返回结果，大幅减少网络往返次数，适合批量写入、批量查询等场景。

注意：单次 Pipeline 不宜命令过多（建议不超过 500 条），否则响应体过大也会影响性能；Pipeline 内的命令是顺序执行但**不保证原子性**，有原子需求时用 Lua 脚本或事务。

```java
// 批量写入（Pipeline）
List<Object> results = redisTemplate.executePipelined(
    (RedisCallback<Object>) connection -> {
        StringRedisConnection conn = (StringRedisConnection) connection;
        for (int i = 1; i <= 100; i++) {
            conn.setEx("user:" + i, 1800, "value-" + i); // key, 过期秒数, value
        }
        return null; // 必须返回 null，结果由外层收集
    }
);

// 批量查询（Pipeline）
List<String> keys = List.of("user:1", "user:2", "user:3");
List<Object> values = redisTemplate.executePipelined(
    (RedisCallback<Object>) connection -> {
        StringRedisConnection conn = (StringRedisConnection) connection;
        keys.forEach(conn::get);
        return null;
    }
);
// values 与 keys 一一对应，未命中返回 null
```

### 5.6 Lua 脚本执行

Redis 支持在服务端**原子执行一段 Lua 脚本**。脚本发到 Redis 后，Redis 把整段脚本当作一条命令处理——执行期间不会插入任何其他命令，因此天然具备原子性，常用于"需要多步操作合并成原子"的场景，例如分布式锁的释放（先比较 value 再删除）、计数器限流、库存扣减等。

**Spring 中的调用方式：**

- `DefaultRedisScript<T>`：封装脚本内容和返回值类型
- `redisTemplate.execute(script, keys, args...)`：发送脚本到 Redis 执行

脚本内通过 `KEYS[n]` 和 `ARGV[n]` 接收 Java 传入的参数（下标从 1 开始）：

- `KEYS` 对应 `execute` 的第二个参数（key 列表）
- `ARGV` 对应 `execute` 的第三个及之后的参数

```java
// 定义脚本（静态常量，只需创建一次）
private static final DefaultRedisScript<Long> MY_SCRIPT = new DefaultRedisScript<>(
    // Lua 脚本内容（字符串）
    "if redis.call('get', KEYS[1]) == ARGV[1] then " +
    "    return redis.call('del', KEYS[1]) " +
    "else " +
    "    return 0 " +
    "end",
    Long.class  // 脚本返回值类型
);

// 执行脚本
Long result = stringRedisTemplate.execute(
    MY_SCRIPT,
    Collections.singletonList("myKey"),   // KEYS 列表 → 脚本内 KEYS[1] = "myKey"
    "expectedValue"                        // ARGV[1] = "expectedValue"
);
// result = 1 表示执行了 del，result = 0 表示条件不满足未删除
```

> **与 Pipeline 的区别**：Pipeline 是批量发多条独立命令、不保证原子；Lua 脚本是把多步逻辑合并成一条命令、严格原子。有原子需求时用 Lua 脚本，单纯追求批量吞吐时用 Pipeline。

***

## 六、Spring Cache 注解方式

Spring 提供了一套**缓存抽象**（不绑定具体实现），通过声明式注解即可使用缓存，底层可切换为 Redis、Caffeine、Ehcache 等。何时用注解、何时用 RedisTemplate：注解适合“按方法返回值缓存/失效”的读多写少场景，配置简单、与业务解耦；需要细粒度控制（如复杂 key、多 key、管道、分布式锁、限流）或非返回值型缓存时，用 RedisTemplate 或封装好的工具类更合适。二者可并存：同一项目里部分用 `@Cacheable`，部分用 `RedisUtils`。这一层的重点不是 Redis 命令本身，而是“让业务代码以统一方式接入不同缓存实现”。

### 6.1 启用缓存

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

### 6.2 配置缓存实现：Redis 与本地缓存

开启缓存后，需要先指定**缓存实现**。Spring Cache 本身只是统一入口，真正存数据的是底层实现。常见选择如下：

| 实现 | 适用场景 | 特点 |
| --- | --- | --- |
| **Redis** | 多实例共享缓存、分布式系统 | 可共享、容量大，但要走网络 |
| **Caffeine** | 单机热点数据、本地缓存 | 访问更快，但只对当前实例生效 |
| **Ehcache** | 传统 Java 项目、本地或磁盘混合缓存 | 功能完整，但现代 Spring Boot 项目里 Caffeine 更常见 |

#### 1. 配置 Redis 作为缓存

这里用 Redis：`spring.cache.type=redis`。其他常用项：`time-to-live` 控制过期时间，`key-prefix` 避免与其他 key 冲突，`cache-null-values: true` 可缓存空结果，减轻缓存穿透。

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

#### 2. 配置本地缓存作为缓存实现

如果业务只需要单机进程内缓存，可以把 Spring Cache 底层切到 **Caffeine**。这种方式不依赖 Redis，适合缓存热点小对象、只读配置、字典数据等。

```yaml
spring:
    cache:
        type: caffeine
        cache-names: user,dict,config
        caffeine:
            spec: maximumSize=1000,expireAfterWrite=10m
```

| 配置项 | 说明 |
| --- | --- |
| **maximumSize** | 本地缓存最大条目数，避免无限占用 JVM 内存 |
| **expireAfterWrite** | 写入后多久过期 |
| **expireAfterAccess** | 访问后多久过期，适合按活跃度淘汰 |

> **注意**：本地缓存不是“比 Redis 更高级”，而是“更偏单机热点优化”的方案。需要跨实例共享时，仍然要用 Redis 或两级缓存。

### 6.3 缓存注解

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

### 6.4 SpEL 表达式

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

## 七、Redis 分布式锁

分布式锁解决的是**多个进程/实例之间的互斥问题**。Java 的 `synchronized`、`ReentrantLock` 只在单个 JVM 进程内有效，分布式部署下每个实例各有独立的锁，无法互斥——需要借助外部共享存储（Redis、ZooKeeper 等）来实现跨进程互斥。

### 7.1 核心要求

| 要求 | 说明 |
| --- | --- |
| **互斥性** | 同一时刻只允许一个客户端持有锁 |
| **防死锁** | 持锁客户端宕机后，锁必须能自动释放（设置过期时间） |
| **防误删** | 释放时只能删除自己的锁，不能误删他人持有的锁 |
| **原子性** | 加锁和解锁的关键操作必须原子执行，防止并发竞争 |

### 7.2 实现方案对比

| 方案 | 原理 | 优点 | 缺点 | 适用场景 |
| --- | --- | --- | --- | --- |
| **Redis SETNX** | `SET key value NX EX` 原子命令 | 实现简单、性能高 | 需自己处理锁续期、可重入 | 简单互斥场景 |
| **Redisson** | 封装 SETNX + watchdog + Lua 脚本 | 功能完整（续期、可重入、公平锁） | 引入额外依赖 | 生产推荐 |
| **ZooKeeper** | 临时顺序节点 + Watch 机制 | 强一致性、天然有序 | 性能低于 Redis | 对一致性要求极高的场景 |

### 7.3 基于 SETNX 的手动实现

#### 加锁与解锁原理

**加锁**用一条带 `NX EX` 选项的 `SET` 命令完成：

- `NX`（Not eXists）：只有 key 不存在时才写入，否则失败——这是"抢锁"语义，多个线程同时执行只有一个能成功。
- `EX 30`：同时设置 30 秒过期时间——这是"防死锁"保障，持锁方崩溃后锁会自动释放，其他线程才能再次拿锁。
- 两个选项在同一条命令里原子生效，不会出现"写入成功但还没设过期就崩了"的半成品状态。

**解锁**需要两步：先比较 value 是否是自己的，再 DEL。两步之间有时间窗口（查完 value、还没 DEL，锁到期被别人拿走，再 DEL 就误删了别人的锁），因此必须用 **Lua 脚本**把这两步合并成原子操作（见 5.6 节）。

```
加锁：SET lock:key <唯一UUID> NX EX 30  → 只有 key 不存在时写入，同时设过期，两者原子生效
解锁：Lua 脚本原子执行 → GET 比较 value → 是自己的才 DEL，否则什么都不做
```

#### lockValue 为什么必须唯一

锁值必须是每次加锁唯一生成的（通常用 `UUID`），否则释放时无法区分是否是自己持有的锁：

```
线程 A 加锁，value = "A-uuid"，TTL = 30s
线程 A 业务执行超时，锁自动过期
线程 B 抢到锁，value = "B-uuid"
线程 A 回来执行释放 → 必须先校验 value，否则会误删线程 B 的锁
```

#### 代码示例

```java
@Service
public class DistributedLockService {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    // Lua 脚本：原子执行"比较 value + 删除"，防止误删
    private static final DefaultRedisScript<Long> UNLOCK_SCRIPT = new DefaultRedisScript<>(
        "if redis.call('get', KEYS[1]) == ARGV[1] then " +
        "    return redis.call('del', KEYS[1]) " +
        "else " +
        "    return 0 " +
        "end",
        Long.class
    );

    /**
     * 尝试加锁
     * @param lockKey  锁的 key
     * @param lockValue 锁的唯一标识（UUID）
     * @param expireSeconds 锁过期时间（秒）
     */
    public boolean tryLock(String lockKey, String lockValue, long expireSeconds) {
        Boolean success = stringRedisTemplate.opsForValue()
            .setIfAbsent(lockKey, lockValue, expireSeconds, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(success);
    }

    /**
     * 释放锁（Lua 脚本保证原子性，防止误删他人锁）
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

#### 业务使用

```java
@Service
public class OrderService {

    @Autowired
    private DistributedLockService lockService;

    public boolean createOrder(Long productId) {
        String lockKey   = "lock:order:" + productId;
        String lockValue = UUID.randomUUID().toString(); // 每次唯一

        // 1. 抢锁，失败直接返回
        if (!lockService.tryLock(lockKey, lockValue, 30)) {
            return false;
        }

        try {
            // 2. 执行业务逻辑（扣减库存、创建订单等）
            // ...
            return true;
        } finally {
            // 3. 释放锁（无论业务成功或抛异常都要释放）
            lockService.unlock(lockKey, lockValue);
        }
    }
}
```

### 7.4 SETNX 方案的局限

| 问题 | 说明 |
| --- | --- |
| **不可重入** | 同一线程重复加锁会阻塞自身 |
| **无自动续期** | 业务执行时间超过锁 TTL，锁自动释放，其他线程可能抢锁；业务仍在执行，导致并发问题 |
| **主从延迟风险** | 主节点写锁后未同步到从节点就宕机，从节点升主后锁丢失（Redlock 算法可缓解，但代价较高） |

### 7.5 Redisson（生产推荐）

Redisson 是基于 Redis 的 Java 客户端，内置了**可重入锁、watchdog 自动续期、红锁、读写锁、信号量**等完整的分布式锁实现，是生产环境的首选。

#### 依赖

```xml
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson-spring-boot-starter</artifactId>
    <version>3.27.0</version>
</dependency>
```

#### 配置

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: yourpassword
```

```java
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

#### 使用示例

```java
@Service
public class OrderService {

    @Autowired
    private RedissonClient redissonClient;

    public boolean createOrder(Long productId) {
        RLock lock = redissonClient.getLock("lock:order:" + productId);

        // 尝试加锁：最多等待 3 秒，锁持有最长 30 秒
        boolean locked;
        try {
            locked = lock.tryLock(3, 30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }

        if (!locked) {
            return false; // 未抢到锁
        }

        try {
            // 执行业务逻辑（Redisson watchdog 会自动续期）
            // ...
            return true;
        } finally {
            lock.unlock(); // 释放锁
        }
    }
}
```

**Redisson watchdog 机制：**

- 加锁时若未设置 leaseTime（或设为 -1），watchdog 启动
- 每隔 `lockWatchdogTimeout / 3`（默认 10 秒）自动为锁续期
- 业务结束调用 `unlock()` 后，watchdog 停止续期
- 若 JVM 宕机，watchdog 随之停止，锁到期后自动释放，防止死锁

### 7.6 本地锁 vs Redis 分布式锁

| 对比项 | 本地锁（synchronized / ReentrantLock） | Redis 分布式锁 |
| --- | --- | --- |
| **互斥范围** | 当前 JVM 进程内 | 跨进程、跨服务器 |
| **性能** | 极快（无网络开销） | 需网络往返 |
| **适用场景** | 单机部署、同进程多线程 | 分布式部署、多实例共享资源 |
| **锁续期** | 不需要 | 需要（Redisson watchdog） |
| **实现复杂度** | 低 | 中（手动）/ 低（Redisson） |

***

## 八、常见问题与最佳实践

### 8.1 缓存异常与一致性总览

引入缓存后常见问题有**缓存穿透、缓存击穿、缓存雪崩**和**缓存一致性**。前三者的共同点都是“缓存没有挡住请求，压力回到数据库或下游服务”，区别在于失效范围和请求特征不同。

| 问题 | 本质 | 典型现象 | 常见方案 |
| --- | --- | --- | --- |
| **缓存穿透** | 查的是不存在的数据 | 缓存和数据库都没有，请求反复打到数据库 | 缓存空值、布隆过滤器、参数校验 |
| **缓存击穿** | 单个热点 key 失效 | 某个高并发热点 key 过期瞬间打穿数据库 | 互斥锁、singleflight、逻辑过期 |
| **缓存雪崩** | 大量 key 同时失效 | 某一时刻大批请求同时回源 | TTL 打散、多级缓存、限流降级 |
| **缓存一致性** | 缓存与数据库值不一致 | 更新后读到旧值 | 先更新库再删缓存、延迟双删、订阅 binlog |
| **本地缓存不一致** | 多实例本地数据不同步 | A 机器已更新，B 机器仍返回旧值 | 两级缓存、消息通知、主动失效、版本号校验 |

### 8.2 缓存穿透

**缓存穿透**是指请求的数据在缓存中不存在，在数据库中也不存在，导致每次请求都会穿过缓存直接访问数据库。

常见场景：

- 恶意构造大量不存在的 ID。
- 业务侧查询条件不合法，频繁请求无效数据。
- 新系统上线时未对空结果做缓存。

| 方案 | 说明 | 注意点 |
| --- | --- | --- |
| **缓存空值** | 数据库查不到时，也把空结果写入缓存并设置较短 TTL | 防止长期缓存脏空值 |
| **布隆过滤器** | 在访问缓存/数据库前先判断 key 是否可能存在 | 可能有误判，但不会漏判 |
| **参数校验** | 非法 ID、明显错误参数直接拦截 | 适合第一层防护 |

**方案示例：缓存空值**

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

**方案示例：布隆过滤器（Redisson RBloomFilter）**

```java
// 1. 依赖（Redisson 已包含，无需额外引入）
// 2. 初始化：服务启动时将所有合法 ID 预热进过滤器
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
        // 预计元素数量 100 万，误判率 0.01%
        bloomFilter.tryInit(1_000_000L, 0.001);
        // 预热：把数据库中所有用户 ID 写入过滤器
        userMapper.selectAllIds().forEach(bloomFilter::add);
    }

    // 3. 查询前先过滤
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public User getUserById(Long id) {
        RBloomFilter<Long> bloomFilter = redissonClient.getBloomFilter(BLOOM_KEY);
        // 不存在（100% 准确），直接拦截
        if (!bloomFilter.contains(id)) {
            return null;
        }
        // 可能存在（有误判率），走正常缓存 → 数据库流程
        String key = "user:" + id;
        User cached = (User) redisTemplate.opsForValue().get(key);
        if (cached != null) return cached;
        User user = userMapper.selectById(id);
        if (user != null) {
            redisTemplate.opsForValue().set(key, user, 30, TimeUnit.MINUTES);
        }
        return user;
    }

    // 4. 新增用户时同步写入过滤器
    public void addUser(User user) {
        userMapper.insert(user);
        redissonClient.<Long>getBloomFilter(BLOOM_KEY).add(user.getId());
    }
}
```

> **注意**：布隆过滤器**不支持删除**单个元素（删除用户时过滤器不能移除，可接受此误判），若删除率较高可考虑定期重建或使用 Counting Bloom Filter。

### 8.3 缓存击穿

**缓存击穿**是指某个**热点 key**在过期瞬间失效，大量并发请求同时回源，把数据库或下游服务打满。

它与穿透的区别是：击穿查的是**真实存在且很热的数据**；与雪崩的区别是：击穿通常集中在**单个热点 key**。

| 方案 | 说明 | 适用场景 |
| --- | --- | --- |
| **互斥锁重建** | 只有一个线程去查库并回填缓存，其他线程等待或快速失败 | 热点 key 不多，允许短时等待 |
| **逻辑过期** | key 不真正过期，只在 value 中记录过期时间，后台异步刷新 | 热点稳定、读性能优先 |
| **热点数据不过期** | 对极少数热点 key 取消 TTL，由业务主动更新 | 热点非常稳定、更新少 |

简单流程：

请求到来 → 发现热点 key 失效 → 抢互斥锁 → 一个线程查库回填 → 其他线程读取新缓存

**方案示例：互斥锁重建**

```java
public User getUserById(Long id) {
    String cacheKey = "user:" + id;
    String lockKey = "lock:rebuild:user:" + id;

    // 1. 先查缓存，命中直接返回
    User user = (User) redisTemplate.opsForValue().get(cacheKey);
    if (user != null) {
        return user;
    }

    // 2. 缓存未命中，抢互斥锁（10 秒过期防止死锁）
    Boolean locked = redisTemplate.opsForValue()
        .setIfAbsent(lockKey, "1", 10, TimeUnit.SECONDS);

    if (Boolean.TRUE.equals(locked)) {
        try {
            // 3. 双重检查：前一个线程可能刚回填完
            user = (User) redisTemplate.opsForValue().get(cacheKey);
            if (user != null) return user;

            // 4. 查库并回填缓存
            user = userMapper.selectById(id);
            if (user != null) {
                redisTemplate.opsForValue().set(cacheKey, user, 30, TimeUnit.MINUTES);
            }
            return user;
        } finally {
            redisTemplate.delete(lockKey); // 5. 释放锁
        }
    } else {
        // 未抢到锁：短暂等待后重试（其他线程正在回填）
        try {
            Thread.sleep(50);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return getUserById(id); // 递归重试
    }
}
```

### 8.4 缓存雪崩

**缓存雪崩**是指大量缓存 key 在同一时间集中失效，或 Redis 整体不可用，导致大量请求同时回源，引发数据库或服务链路压力骤增。

常见诱因：

- 批量 key 使用了相同 TTL。
- Redis 实例重启、故障或网络抖动。
- 大促、热点流量与集中过期叠加。

| 方案 | 说明 |
| --- | --- |
| **TTL 加随机值** | 避免大量 key 在同一时刻过期 |
| **多级缓存** | 本地缓存 + Redis，减少全部回源数据库的概率 |
| **限流降级** | 回源流量过大时，对非核心请求做限流、熔断或兜底 |
| **高可用部署** | 主从 + Sentinel 或 Cluster，降低 Redis 整体不可用概率 |

**方案示例：TTL 加随机值**

```java
int baseTtl = 1800;
int randomSeconds = ThreadLocalRandom.current().nextInt(0, 300);
redisTemplate.opsForValue().set(key, value, baseTtl + randomSeconds, TimeUnit.SECONDS);
```

### 8.5 缓存一致性

缓存不是事务数据库，业务里更常见的目标是**最终一致性**而不是绝对强一致。

最常见的实践是 **Cache-Aside**：

- **读**：先查缓存，未命中再查数据库并回填缓存。
- **写**：先更新数据库，再删除缓存。

原因是“更新缓存”容易遗漏并发场景，而“删缓存”更简单、失败恢复路径也更清晰。

| 方案 | 做法 | 特点 |
| --- | --- | --- |
| **先更新库，再删缓存** | 最常见实践 | 简单、适合大多数业务 |
| **延迟双删** | 更新库后删缓存，再延迟一段时间再删一次 | 降低并发读旧值概率 |
| **订阅 binlog / MQ** | 数据变更后异步通知删除或刷新缓存 | 适合复杂系统 |

**方案示例：先更新库，再删缓存（Cache-Aside）**

```java
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String KEY_PREFIX = "user:";
    private static final long TTL_MINUTES = 30;

    // 读：先查缓存，未命中再查数据库并回填
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

    // 写：先更新数据库，再删除缓存
    @Transactional
    public void updateUser(User user) {
        userMapper.updateById(user);                        // 1. 更新库
        redisTemplate.delete(KEY_PREFIX + user.getId());   // 2. 删缓存
    }
}
```

### 8.6 本地缓存与两级缓存

本地缓存最大的优势是快，最大的限制是**只在当前实例内生效**。一旦系统是分布式部署，就要考虑不同实例上的本地缓存何时刷新、何时失效、是否允许短暂旧值。

| 方案 | 做法 | 特点 |
| --- | --- | --- |
| **只用本地缓存** | 每个实例各自缓存 | 最快，但只能用于可接受短暂不一致的小数据 |
| **只用 Redis** | 所有实例共享 Redis | 一致性更容易控制，但热点压力更集中 |
| **两级缓存** | 先查本地，再查 Redis，再查数据库 | 兼顾性能与共享能力，是常见实践 |

两级缓存典型读取路径：

    请求到来
        ↓
    先查本地缓存
        ↓
    未命中再查 Redis
        ↓
    再未命中才查数据库
        ↓
    回填 Redis
        ↓
    回填本地缓存

如果数据发生更新，常见做法是：**先更新数据库，再删除 Redis，再通知各实例删除本地缓存**。通知方式可以是 MQ、Redis Pub/Sub、配置中心推送、版本号校验或定时刷新。

> **注意**：本地缓存更适合缓存字典、配置、规则、热点小对象这类“读多写少、数据量小、可接受短暂不一致”的内容；库存、余额、强一致状态通常不应只依赖本地缓存。

**方案示例：Redis Pub/Sub 广播使各实例本地缓存失效**

```java
// 数据更新：先更新库，再删 Redis，再广播失效通知
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private Cache<Long, User> userLocalCache; // Caffeine 本地缓存

    private static final String EVICT_CHANNEL = "local-cache:evict:user";

    @Transactional
    public void updateUser(User user) {
        userMapper.updateById(user);                                      // 1. 更新数据库
        stringRedisTemplate.delete("user:" + user.getId());               // 2. 删除 Redis
        stringRedisTemplate.convertAndSend(EVICT_CHANNEL,                 // 3. 广播失效通知
            String.valueOf(user.getId()));
    }
}

// 各实例订阅通知，收到后清除本地缓存
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

// Pub/Sub 订阅配置
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

### 8.7 缓存过期时间（TTL）的设定

未设置过期时间的 key 会常驻内存并可能被持久化到磁盘，易导致内存占满；设置 TTL 时需综合业务与资源情况，常见参考要素如下。

| 维度           | 倾向 TTL 较长                     | 倾向 TTL 较短或配合淘汰               |
| -------------- | --------------------------------- | ------------------------------------- |
| **数据可变性** | 数据几乎不变、只读                | 数据经常更新                          |
| **一致性要求** | 可接受一定延迟                    | 要求更新后尽快生效                    |
| **请求量/Key 数** | 请求少、缓存的 key 数量有限   | 请求多、参数组合多，key 数量大、易占满内存 |
| **内存**       | 实例内存充足                      | 内存紧张，需控制 key 数量与占用       |
| **回源成本**   | 未命中时查库/读盘成本高           | 回源成本低，可接受更多未命中          |
| **更新方式**   | 有发布或数据更新时主动删 key 的流程 | 无删 key 流程，只能靠 TTL 自动过期   |

只读且不变的共享数据（如静态 JSON）多线程并发读无需考虑线程安全；若会定期更新，可设 TTL 略大于更新周期，或在更新时删除对应 key 使下次请求回源并重新写入缓存。

### 8.8 Key 设计规范

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

### 8.9 最佳实践

1. **设置过期时间**：避免内存无限增长；根据数据可变性、请求量、内存等因素设置合理 TTL，不设过期则 key 常驻内存，易 OOM。
2. **避免大 Key**：单个 Value 不超过 10KB，集合元素不超过 1 万；大 key 会拉高网络与序列化成本，阻塞主线程，删除时易卡顿。
3. **避免热点 Key**：单 key  QPS 过高会打满单机能力；可拆 key、加本地缓存或读从库分散压力。
4. **优先使用 SCAN**：生产环境避免 `KEYS *` 全量扫描，改用 `SCAN` 渐进遍历，降低阻塞风险。
5. **使用连接池**：复用连接、限制并发，避免频繁建连带来的延迟与端口耗尽。
6. **合理使用管道**：批量操作使用 Pipeline 将多次往返合并为一次，减少 RTT，注意单次 pipeline 不宜过大。
7. **监控告警**：监控内存使用、命中率、慢查询，便于容量规划与问题定位。
8. **删除缓存优先于更新缓存**：写路径优先采用“更新数据库后删除缓存”，减少并发覆盖旧值的风险。
9. **热点数据要有保护策略**：热点 key 至少考虑互斥重建、逻辑过期或本地缓存，否则容易在高并发下击穿。
10. **本地缓存只缓存小而热的数据**：它解决的是热点与延迟问题，不负责强一致共享；一旦多实例部署，要提前设计失效和同步策略。

### 8.10 生产环境配置建议

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

## 九、常用命令速查表

### 9.1 数据操作

| 数据类型   | 常用命令                                         |
| ---------- | ------------------------------------------------ |
| String     | SET、GET、INCR、DECR、SETNX、SETEX、MSET、MGET   |
| Hash       | HSET、HGET、HMGET、HGETALL、HDEL、HINCRBY        |
| List       | LPUSH、RPUSH、LPOP、RPOP、LRANGE、LLEN、BLPOP    |
| Set        | SADD、SMEMBERS、SISMEMBER、SREM、SINTER、SUNION  |
| Sorted Set | ZADD、ZSCORE、ZRANK、ZRANGE、ZREVRANGE、ZINCRBY  |

### 9.2 通用命令

| 命令    | 说明                 |
| ------- | -------------------- |
| KEYS    | 查找 key（生产慎用） |
| SCAN    | 渐进式扫描 key       |
| EXISTS  | 判断 key 是否存在    |
| DEL     | 删除 key             |
| EXPIRE  | 设置过期时间（秒）   |
| TTL     | 查看剩余过期时间     |
| TYPE    | 查看 key 类型        |
| RENAME  | 重命名 key           |
| SELECT  | 选择数据库           |
| FLUSHDB | 清空当前数据库       |
| INFO    | 查看服务器信息       |

### 9.3 Java 操作对照

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
