# MySQL SQL 优化

## 一、分析手段

- **EXPLAIN**：看执行计划；关注 **type**（const/ref/range/index/ALL）、**key**（用的索引）、**rows**（预估行数）、**Extra**（Using index/Using filesort/Using temporary 等）。
- **type 从优到差**：system > const > eq_ref > ref > range > index > ALL；尽量避免 ALL 全表扫描。

***

## 二、常见优化手段

| 手段 | 说明 |
| --- | --- |
| 避免 SELECT * | 只查需要的列，减少 IO 与网络 |
| 分页优化 | 大 offset 用 `WHERE id > last_id LIMIT n` 或子查询延迟关联 |
| 批量操作 | 批量 insert/update 代替逐条 |
| 合理建索引 | 常用条件、高区分度、考虑覆盖索引 |
| 避免索引失效 | 不在索引列上做函数、注意类型匹配、避免左模糊等 |

***

## 三、面试答题要点

- **EXPLAIN**：看 type、key、rows、Extra；type 尽量 ref 以上。
- **优化**：避免 *、分页用游标或延迟关联、批量、建索引、防索引失效。
