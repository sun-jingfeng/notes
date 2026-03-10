# Spring 事务管理

## 一、声明式事务

通过 **@Transactional** 标注在类或方法上，由 AOP 代理在调用前后开启/提交或回滚事务，业务代码无需手写 begin/commit/rollback。

***

## 二、传播行为（常见）

| 传播行为 | 含义 |
| --- | --- |
| **REQUIRED** | 默认；有事务则加入，没有则新建 |
| **REQUIRES_NEW** | 总是新建事务，挂起当前事务 |
| **NESTED** | 嵌套事务（保存点），外层回滚可回滚内层 |
| **SUPPORTS / NOT_SUPPORTED / NEVER** | 按名字：支持有则加入/不支持/禁止事务 |

***

## 三、事务失效常见原因

- **自调用**：同类内方法 A 调方法 B，B 上的 @Transactional 不会经过代理，不生效；可拆到另一 Bean 或自注入。
- **非 public 方法**：代理通常只对 public 方法生效。
- **异常被吞**：异常在方法内 catch 未抛出，代理无法感知，不会回滚。
- **异常类型**：默认只对 **RuntimeException** 和 Error 回滚；若抛出受检异常，需配置 `rollbackFor = Exception.class` 等。

> 💡 建议显式配置 `rollbackFor = Exception.class`，避免受检异常导致不回滚。

***

## 四、面试答题要点

- **@Transactional** 基于 AOP 代理实现声明式事务。
- **传播行为**：REQUIRED（加入或新建）、REQUIRES_NEW（新建）、NESTED（嵌套）。
- **失效**：自调用、非 public、异常被 catch、未配置 rollbackFor；建议显式 rollbackFor。
