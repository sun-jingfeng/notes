# Redis 数据结构与应用场景

## 一、五大数据结构

| 类型 | 底层（常见） | 特点 | 典型场景 |
| --- | --- | --- | --- |
| **String** | SDS | 简单 key-value；可存字符串、数字、二进制 | 缓存、计数器、分布式锁、Session |
| **Hash** | ziplist / hashtable |  field-value 集合，适合对象 | 用户信息、配置项、对象属性 |
| **List** | quicklist | 有序、可重复、头尾操作 O(1) | 消息队列、最新列表、时间线 |
| **Set** | intset / hashtable | 无序、不重复 | 标签、共同好友、去重、抽奖 |
| **Sorted Set** | ziplist / skiplist+hash | 按 score 有序、member 唯一 | 排行榜、延迟队列、带权队列 |

***

## 二、选型简要

- 简单缓存、计数、锁 → **String**。
- 对象多字段、可部分更新 → **Hash**。
- 有序列表、简单队列 → **List**。
- 去重、集合运算 → **Set**。
- 排序、排行榜、按分数范围查 → **Sorted Set**。

***

## 三、面试答题要点

- **String**：缓存、计数、锁、Session。
- **Hash**：对象、多字段。
- **List**：队列、最新 N 条。
- **Set**：去重、标签、共同好友。
- **Sorted Set**：排行榜、延迟队列。
