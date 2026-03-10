# Redis 过期策略与淘汰策略

## 一、过期删除策略

| 策略 | 说明 |
| --- | --- |
| **惰性删除** | 访问 key 时检查是否过期，过期则删除；不访问则一直占内存 |
| **定期删除** | 定时随机抽查一批 key，删除其中过期的；与惰性删除配合 |

Redis 同时使用两者：访问时惰性删；后台定期抽样删。

***

## 二、内存淘汰策略（maxmemory-policy）

当 **maxmemory** 设且内存达上限时，新写入会触发淘汰：

| 策略 | 说明 |
| --- | --- |
| **noeviction** | 不淘汰，写时报错（默认） |
| **allkeys-lru** | 在所有 key 中淘汰最近最少使用的 |
| **volatile-lru** | 在**设了过期时间**的 key 中淘汰 LRU |
| **allkeys-lfu** | 在所有 key 中淘汰访问频率最低的（LFU） |
| **volatile-lfu** | 在设了过期时间的 key 中淘汰 LFU |
| **volatile-ttl** | 在设了过期时间的 key 中优先淘汰 TTL 最短的 |
| **allkeys-random / volatile-random** | 随机淘汰 |

***

## 三、面试答题要点

- **过期**：惰性删除 + 定期删除。
- **淘汰**：内存满时按策略淘汰；常用 allkeys-lru / volatile-lru；noeviction 为默认不淘汰。
