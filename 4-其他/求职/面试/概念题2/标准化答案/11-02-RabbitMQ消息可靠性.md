# RabbitMQ 消息可靠性

## 一、各环节保障

| 环节 | 机制 | 说明 |
| --- | --- | --- |
| **生产者→Broker** | Publisher Confirm | 消息到达 Exchange 后 broker 确认；可批量 confirm |
| **生产者→Broker** | Return | 消息无法路由到任何 Queue 时回退给生产者 |
| **Broker 持久化** | 持久化 Exchange、Queue、Message | durable=true；消息 deliveryMode=2 |
| **Broker→消费者** | 消费者 ACK | 手动 ACK：处理完再 ack；失败 nack/reject，可重入队列或进死信 |

***

## 二、幂等性

消息可能重复投递（重试、网络等），消费端需**幂等**：同一消息多次处理结果一致。手段包括：唯一业务 ID + 去重表、数据库唯一约束、状态机（只接受特定状态变更）等。

***

## 三、面试答题要点

- **可靠**：生产者 Confirm+Return、Broker 持久化、消费者手动 ACK。
- **幂等**：唯一 ID、去重表、唯一约束、状态机，防止重复消费导致错误。
