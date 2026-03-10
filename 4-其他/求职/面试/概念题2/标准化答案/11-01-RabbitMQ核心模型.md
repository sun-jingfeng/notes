# RabbitMQ 核心模型

## 一、角色与流程

```
    Producer → Exchange（根据类型与 routing key 路由）→ Queue(s) → Consumer
                     ↑
                Binding（绑定规则）
```

- **Producer** 发消息到 **Exchange**，不直接到 Queue。
- **Exchange** 根据类型和 **routing key** 以及 **Binding** 把消息投到一个或多个 **Queue**。
- **Consumer** 从 Queue 消费。

***

## 二、Exchange 类型

| 类型 | 路由规则 |
| --- | --- |
| **Direct** | routing key 完全匹配 |
| **Topic** | 按规则匹配；`*` 一个词，`#` 零或多个词 |
| **Fanout** | 广播到所有绑定队列，忽略 routing key |
| **Headers** | 按消息头匹配（少用） |

***

## 三、面试答题要点

- **模型**：Producer → Exchange → Binding → Queue → Consumer。
- **Direct** 精确匹配；**Topic** 通配；**Fanout** 广播；**Headers** 按头匹配。
