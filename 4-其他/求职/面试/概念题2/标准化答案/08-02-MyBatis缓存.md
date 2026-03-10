# MyBatis 缓存

## 一、一级缓存

- **范围**：SqlSession 级别；同一 SqlSession 内相同查询条件（同一 Mapper 方法、相同参数）会直接返回缓存结果，不再查库。
- **失效**：同一 SqlSession 内发生增删改、手动清缓存、或 SqlSession 关闭后失效。
- **注意**：在 Spring 中若每次请求/new 一个 SqlSession，一级缓存几乎不起作用，只对同一 SqlSession 内多次相同查询有效。

***

## 二、二级缓存

- **范围**：Mapper（namespace）级别；跨 SqlSession 共享，需在 Mapper XML 或配置中开启。
- **注意**：分布式、多实例下数据易不一致，一般**不推荐**开启；缓存用 Redis 等集中式缓存更可控。

***

## 三、面试答题要点

- **一级**：SqlSession 级，同 Session 同查询命中缓存；Spring 下常新建 Session，效果有限。
- **二级**：Mapper 级，跨 Session；分布式下不推荐，常用 Redis 替代。
