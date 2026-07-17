## 一、MySQL 概述

### 1.1 什么是 MySQL

MySQL 是目前最流行的开源**关系型数据库管理系统（RDBMS）**，具有以下特点：

*   **开源免费**：社区版免费使用
*   **性能优秀**：查询速度快，适合高并发
*   **跨平台**：支持 Windows、Linux、macOS
*   **生态丰富**：与 Java、Python、PHP 等语言完美配合

### 1.2 安装

#### Windows 安装

**方式一：官网下载安装包（推荐）**

1.  访问官网：<https://dev.mysql.com/downloads/mysql/>
2.  下载 MySQL Installer
3.  选择 **Developer Default** 或 **Server only**
4.  配置 root 密码
5.  安装完成后自动注册为 Windows 服务

***

**方式二：解压版安装**

`my.ini` 基本配置：

```ini
[mysqld]
port=3306
basedir=D:/mysql-8.0.xx
datadir=D:/mysql-8.0.xx/data
max_connections=200
character-set-server=utf8mb4

[client]
default-character-set=utf8mb4
```

```bash
# 初始化数据库
mysqld --initialize-insecure --user=mysql

# 注册 Windows 服务
mysqld --install MySQL

# 启动服务
net start MySQL

# 登录并修改密码
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY '你的新密码';
```

#### macOS / Linux 安装

```bash
# macOS (Homebrew)
brew install mysql
brew services start mysql

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# 安全配置
mysql_secure_installation
```

#### 常用服务命令

| 操作   | Windows           | Linux/macOS                    |
| ---- | ----------------- | ------------------------------ |
| 启动   | `net start mysql` | `sudo systemctl start mysql`   |
| 停止   | `net stop mysql`  | `sudo systemctl stop mysql`    |
| 重启   | 先停止再启动            | `sudo systemctl restart mysql` |
| 查看状态 | `sc query mysql`  | `sudo systemctl status mysql`  |

#### 登录 MySQL

```bash
# 本地登录
mysql -u root -p

# 指定主机和端口
mysql -h 127.0.0.1 -P 3306 -u root -p
```

### 1.3 图形化工具

| 工具                  | 特点               | 价格       |
| ------------------- | ---------------- | -------- |
| **Navicat**         | 功能强大，界面美观        | 付费       |
| **DataGrip**        | JetBrains 出品，专业级 | 付费（学生免费） |
| **DBeaver**         | 开源免费，支持多种数据库     | 免费       |
| **MySQL Workbench** | 官方工具             | 免费       |

**推荐**：学习用 DBeaver，工作用 Navicat / DataGrip

### 1.4 数据模型

    ┌─────────────────────────────────────────────────────┐
    │                   MySQL 服务器                       │
    │  ┌─────────────────┐  ┌─────────────────┐          │
    │  │   数据库 db1     │  │   数据库 db2     │   ...   │
    │  │  ┌───────────┐  │  │  ┌───────────┐  │          │
    │  │  │   表 t1   │  │  │  │   表 t1   │  │          │
    │  │  ├───────────┤  │  │  ├───────────┤  │          │
    │  │  │   表 t2   │  │  │  │   表 t2   │  │          │
    │  │  └───────────┘  │  │  └───────────┘  │          │
    │  └─────────────────┘  └─────────────────┘          │
    └─────────────────────────────────────────────────────┘

| 概念                  | 说明       | 类比        |
| ------------------- | -------- | --------- |
| **数据库（Database）**   | 存储数据的仓库  | 文件夹       |
| **表（Table）**        | 数据的集合    | Excel 文件  |
| **行（Row）**          | 一条记录     | Excel 的一行 |
| **列（Column）**       | 字段，数据的属性 | Excel 的一列 |
| **主键（Primary Key）** | 唯一标识一条记录 | 身份证号      |
| **外键（Foreign Key）** | 关联其他表    | 部门ID      |

### 1.5 SQL 语句分类

| 分类      | 全称                         | 说明     | 关键字                  |
| ------- | -------------------------- | ------ | -------------------- |
| **DDL** | Data Definition Language   | 数据定义语言 | CREATE、ALTER、DROP    |
| **DML** | Data Manipulation Language | 数据操作语言 | INSERT、UPDATE、DELETE |
| **DQL** | Data Query Language        | 数据查询语言 | SELECT               |
| **DCL** | Data Control Language      | 数据控制语言 | GRANT、REVOKE         |

***

## 二、DDL - 数据定义语言

### 2.1 数据库操作

```sql
-- 查询
SHOW DATABASES;              -- 查看所有数据库
SELECT DATABASE();           -- 查看当前数据库

-- 创建
CREATE DATABASE 数据库名;
CREATE DATABASE IF NOT EXISTS 数据库名;
CREATE DATABASE 数据库名 DEFAULT CHARSET utf8mb4;

-- 使用
USE 数据库名;

-- 删除
DROP DATABASE 数据库名;
DROP DATABASE IF EXISTS 数据库名;
```

### 2.2 表结构 - 创建

#### 数据类型

**数值类型：**

| 类型           | 大小      | 有符号范围           | 无符号范围（UNSIGNED） | 用途        |
| ------------ | ------- | --------------- | --------------- | --------- |
| TINYINT      | 1 byte  | -128 \~ 127     | 0 \~ 255        | 小整数（如年龄）  |
| INT          | 4 bytes | -21亿 \~ 21亿     | 0 \~ 42亿        | 标准整数（如ID） |
| BIGINT       | 8 bytes | -922亿亿 \~ 922亿亿 | 0 \~ 1844亿亿     | 大整数（如订单号） |
| DECIMAL(M,D) | 变长      | 取决于M和D          | 取决于M和D          | 精确小数（如金额） |

> **UNSIGNED 说明**：无符号，表示只能存储 **0 和正数**，不能存储负数。好处是正数范围翻倍。

**字符串类型：**

| 类型         | 大小         | 说明             |
| ---------- | ---------- | -------------- |
| CHAR(N)    | 0-255 字符   | **定长**字符串，性能好  |
| VARCHAR(N) | 0-65535 字符 | **变长**字符串，节省空间 |
| TEXT       | 0-65535 字符 | 长文本            |

> **CHAR vs VARCHAR**：固定长度用 CHAR（如手机号），可变长度用 VARCHAR（如姓名）

**日期时间类型：**

| 类型        | 格式                    | 说明       |
| --------- | --------------------- | -------- |
| DATE      | YYYY-MM-DD            | 日期       |
| DATETIME  | YYYY-MM-DD HH\:MM\:SS | 日期时间     |
| TIMESTAMP | YYYY-MM-DD HH\:MM\:SS | 时间戳，自动更新 |

#### 约束

| 约束  | 关键字             | 说明                        |
| --- | --------------- | ------------------------- |
| 主键  | PRIMARY KEY     | 唯一且非空                     |
| 非空  | NOT NULL        | 不能为 NULL                  |
| 唯一  | UNIQUE          | 值唯一                       |
| 默认  | DEFAULT         | 默认值                       |
| 外键  | FOREIGN KEY     | 关联其他表                     |
| 自增  | AUTO\_INCREMENT | 自动递增                      |
| 无符号 | UNSIGNED        | 只能存储 0 和正数，不能为负数（仅用于数值类型） |

> **UNSIGNED 使用场景**：年龄、数量、价格等**不可能为负数**的字段。使用 UNSIGNED 可以：
>
> 1.  **扩大正数范围**（如 TINYINT 从 127 扩大到 255）
> 2.  **语义更明确**（明确表示该字段不接受负数）
> 3.  **防止误操作**（插入负数会报错）

#### 创建表示例

```sql
CREATE TABLE employee (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT COMMENT '员工ID',
    emp_no VARCHAR(10) NOT NULL UNIQUE COMMENT '工号',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    gender CHAR(1) DEFAULT '男' COMMENT '性别',
    age TINYINT UNSIGNED COMMENT '年龄（0-255，不能为负）',
    phone CHAR(11) COMMENT '手机号',
    salary DECIMAL(10, 2) UNSIGNED COMMENT '薪资（不能为负）',
    dept_id INT UNSIGNED COMMENT '部门ID',
    hire_date DATE COMMENT '入职日期',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT '员工表';
```

```sql
-- UNSIGNED 效果演示
CREATE TABLE test_unsigned (
    age TINYINT UNSIGNED  -- 范围：0 ~ 255
);

INSERT INTO test_unsigned VALUES (25);   -- ✓ 成功
INSERT INTO test_unsigned VALUES (255);  -- ✓ 成功
INSERT INTO test_unsigned VALUES (-1);   -- ✗ 报错：Out of range
INSERT INTO test_unsigned VALUES (256);  -- ✗ 报错：Out of range
```

### 2.3 表结构 - 查询、修改、删除

#### 查询

```sql
SHOW TABLES;              -- 查看所有表
DESC 表名;                 -- 查看表结构
SHOW CREATE TABLE 表名;    -- 查看建表语句
```

#### 修改

```sql
-- 修改表名
ALTER TABLE 旧表名 RENAME TO 新表名;

-- 添加字段
ALTER TABLE 表名 ADD 字段名 数据类型 [约束];

-- 修改字段类型
ALTER TABLE 表名 MODIFY 字段名 新数据类型;

-- 修改字段名和类型
ALTER TABLE 表名 CHANGE 旧字段名 新字段名 数据类型;

-- 删除字段
ALTER TABLE 表名 DROP 字段名;
```

#### 删除

```sql
DROP TABLE 表名;              -- 删除表
DROP TABLE IF EXISTS 表名;    -- 删除表（如果存在）
TRUNCATE TABLE 表名;          -- 清空表（保留结构，自增归零）
```

***

## 三、DML - 数据操作语言

### 3.1 INSERT - 插入

```sql
-- 指定字段插入
INSERT INTO 表名 (字段1, 字段2) VALUES (值1, 值2);

-- 全字段插入
INSERT INTO 表名 VALUES (值1, 值2, ...);

-- 批量插入
INSERT INTO 表名 (字段1, 字段2) VALUES 
    (值1, 值2),
    (值1, 值2);
```

### 3.2 UPDATE - 修改

```sql
UPDATE 表名 SET 字段1 = 值1, 字段2 = 值2 WHERE 条件;

-- 示例
UPDATE employee SET salary = 10000 WHERE name = '张三';
UPDATE employee SET salary = salary + 1000 WHERE dept_id = 1;
```

> ⚠️ 没有 WHERE 条件会修改**所有记录**！

### 3.3 DELETE - 删除

```sql
DELETE FROM 表名 WHERE 条件;

-- 示例
DELETE FROM employee WHERE id = 5;
```

> ⚠️ 没有 WHERE 条件会删除**所有数据**！

**DELETE vs TRUNCATE：**

|      | DELETE | TRUNCATE |
| ---- | ------ | -------- |
| 类型   | DML    | DDL      |
| 可加条件 | ✓      | ✗        |
| 可回滚  | ✓      | ✗        |
| 自增重置 | ✗      | ✓        |
| 速度   | 慢      | 快        |

***

## 四、DQL - 数据查询语言（重点）

### 完整语法

```sql
SELECT [DISTINCT] 字段列表 [AS 别名]
FROM 表名
[WHERE 条件]
[GROUP BY 分组字段]
[HAVING 分组后条件]
[ORDER BY 排序字段 ASC|DESC]
[LIMIT 起始索引, 记录数];
```

**执行顺序**：FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT

### 4.1 基本查询

```sql
SELECT * FROM employee;                            -- 查询所有
SELECT name, age, salary FROM employee;            -- 指定字段
SELECT name AS '姓名', salary '薪资' FROM employee;  -- 别名（AS 可省略）
SELECT DISTINCT dept_id FROM employee;             -- 去重
```

### 4.2 条件查询（WHERE）

**比较运算符：**

| 运算符                  | 说明      |
| -------------------- | ------- |
| `=`, `<>`, `!=`      | 等于、不等于  |
| `>`, `>=`, `<`, `<=` | 大小比较    |
| `BETWEEN...AND...`   | 范围（含边界） |
| `IN(...)`            | 在列表内    |
| `LIKE`               | 模糊匹配    |
| `IS NULL`            | 为空      |

**LIKE 通配符**：`%` 匹配任意个字符，`_` 匹配单个字符

**逻辑运算符**：`AND`, `OR`, `NOT`

```sql
-- 条件查询示例
SELECT * FROM employee WHERE age BETWEEN 25 AND 35;
SELECT * FROM employee WHERE dept_id IN (1, 2, 3);
SELECT * FROM employee WHERE name LIKE '张%';
SELECT * FROM employee WHERE email IS NULL;
SELECT * FROM employee WHERE age >= 25 AND salary >= 10000;
```

### 4.3 聚合函数

| 函数        | 说明   |
| --------- | ---- |
| COUNT(\*) | 统计行数 |
| SUM(字段)   | 求和   |
| AVG(字段)   | 平均值  |
| MAX(字段)   | 最大值  |
| MIN(字段)   | 最小值  |

```sql
SELECT COUNT(*) FROM employee;
SELECT AVG(salary), MAX(salary), MIN(salary) FROM employee;
```

### 4.4 分组查询（GROUP BY）

```sql
SELECT 字段 FROM 表名 GROUP BY 分组字段 [HAVING 条件];
```

**WHERE vs HAVING：**

| 对比      | WHERE | HAVING |
| ------- | ----- | ------ |
| 执行时机    | 分组前   | 分组后    |
| 能否用聚合函数 | ✗     | ✓      |

```sql
-- 按部门统计人数和平均薪资
SELECT dept_id, COUNT(*), AVG(salary) 
FROM employee 
GROUP BY dept_id;

-- 分组后筛选人数>5的部门
SELECT dept_id, COUNT(*) AS num 
FROM employee 
GROUP BY dept_id 
HAVING num > 5;
```

### 4.5 排序查询（ORDER BY）

```sql
SELECT * FROM employee ORDER BY salary DESC;           -- 降序
SELECT * FROM employee ORDER BY salary DESC, age ASC;  -- 多字段
```

### 4.6 分页查询（LIMIT）

```sql
SELECT * FROM 表名 LIMIT 起始索引, 查询记录数;
```

**公式**：起始索引 = (页码 - 1) × 每页记录数

```sql
SELECT * FROM employee LIMIT 10;       -- 第1页，每页10条
SELECT * FROM employee LIMIT 10, 10;   -- 第2页
SELECT * FROM employee LIMIT 20, 10;   -- 第3页
```

> **注意**：`LIMIT offset, size` 适合基础分页语法学习，但在大数据量场景下，`offset` 很大时会出现**深分页**性能问题。本质上是数据库需要先扫描并跳过前面大量记录，再返回当前页少量数据，因此越往后翻页通常越慢。

### DQL 综合练习

```sql
-- 查询年龄25-35的男员工，按部门分组，
-- 统计人数和平均薪资，只显示人数>=3的部门，
-- 按平均薪资降序，取前5条

SELECT dept_id, COUNT(*) AS num, AVG(salary) AS avg_sal
FROM employee
WHERE age BETWEEN 25 AND 35 AND gender = '男'
GROUP BY dept_id
HAVING num >= 3
ORDER BY avg_sal DESC
LIMIT 5;
```

***

## 五、索引

### 5.1 索引概念

**索引（Index）** 是帮助 MySQL **高效检索数据**的数据结构，可类比书的目录：不查目录就要翻整本书，有了目录可以先定位章节再翻页。

| 对比       | 无索引           | 有索引（以 B+ 树为例）   |
| ---------- | ---------------- | ------------------------- |
| **查找方式** | 全表扫描（逐行比对） | 按索引结构定位再到数据行   |
| **时间复杂度** | O(n)             | O(log n) 量级（树高决定）  |
| **适用场景** | 小表、低频查询     | 大表、WHERE/ORDER BY/JOIN |

> 💡 InnoDB 引擎默认使用 **B+ 树** 存储索引，叶子节点存数据或主键，支持范围查询和排序。

### 5.2 索引类型

| 类型           | 关键字/说明        | 特点                     |
| -------------- | ------------------ | ------------------------ |
| **主键索引**   | PRIMARY KEY        | 唯一、非空，表只能有一个   |
| **唯一索引**   | UNIQUE             | 值唯一，可多列，可 NULL   |
| **普通索引**   | INDEX / KEY        | 无唯一约束，最常用       |
| **全文索引**   | FULLTEXT           | 用于全文检索（MySQL 5.6+） |
| **组合索引**   | 多列组成一个索引    | 遵循最左前缀匹配         |

### 5.3 创建、查看与删除索引

#### 创建

```sql
-- 建表时创建
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 主键索引
    phone VARCHAR(11) UNIQUE,                    -- 唯一索引
    name VARCHAR(50),
    INDEX idx_name (name),                        -- 普通索引
    UNIQUE KEY uk_phone (phone)
);

-- 建表后添加
ALTER TABLE 表名 ADD INDEX 索引名 (字段名);
ALTER TABLE 表名 ADD UNIQUE INDEX 索引名 (字段名);

-- 组合索引（多列）
ALTER TABLE 表名 ADD INDEX idx_ab (a, b, c);
```

#### 查看

```sql
SHOW INDEX FROM 表名;
```

#### 删除

```sql
ALTER TABLE 表名 DROP INDEX 索引名;
-- 主键索引
ALTER TABLE 表名 DROP PRIMARY KEY;
```

### 5.4 组合索引与最左前缀

**组合索引** 按列顺序从左到右匹配，只有**从左开始连续**使用列才会用到索引。设计索引或写条件时，尽量**等值在左、范围在右**：等值条件（`=`）用到的列放前面，范围条件（`>`、`<`、`BETWEEN`、`LIKE 'x%'`）用到的列放后面，否则范围列之后的索引列通常无法再参与索引查找。

若建立 `INDEX idx_abc (a, b, c)`：

| 条件示例           | 是否走索引 | 说明         |
| ------------------ | ---------- | ------------ |
| `WHERE a = 1`      | ✓          | 用到 a       |
| `WHERE a = 1 AND b = 2` | ✓ | 用到 a、b    |
| `WHERE a = 1 AND b = 2 AND c = 3` | ✓ | 用到 a、b、c |
| `WHERE a = 1 AND b > 2` | ✓ | 用到 a、b（b 为范围，c 之后无法再走索引） |
| `WHERE a > 1 AND b = 2` | 部分     | 只用 a；b 在范围列右侧，无法用于索引查找 |
| `WHERE b = 2`      | ✗          | 未从 a 开始  |
| `WHERE a = 1 AND c = 3` | 部分     | 只用 a，c 不走索引 |

### 5.5 索引失效常见场景

| 场景               | 说明                         |
| ------------------ | ---------------------------- |
| **对索引列运算/函数** | `WHERE YEAR(create_time)=2024`、`WHERE id + 1 = 10` 等导致无法用索引 |
| **隐式类型转换**   | 字符串列与数字比较，如 `WHERE phone = 13800138000`（phone 为 VARCHAR） |
| **前导模糊匹配**   | `WHERE name LIKE '%张'` 或 `LIKE '%张%'` 无法用索引；`LIKE '张%'` 可以 |
| **OR 一侧无索引**  | `WHERE a = 1 OR b = 2`，若 b 无索引，可能全表扫描 |
| **不等于/NOT**     | `<>`、`!=`、`NOT IN`、`NOT LIKE` 有时优化器选择全表扫描 |

> 💡 是否走索引以 `EXPLAIN` 结果为准，重点看 **type**（ref、range 优于 ALL）、**key**（是否用到索引）。

### 5.6 索引与排序优化

**索引不仅能优化过滤，还可能优化排序。** 当 `WHERE` 条件和 `ORDER BY` 顺序能够较好匹配索引顺序时，MySQL 可以直接按索引顺序取数，减少额外排序开销。

| 场景 | 是否容易利用索引排序 | 说明 |
| ---- | -------------------- | ---- |
| `WHERE status = 1 ORDER BY create_time`，索引为 `(status, create_time)` | ✓ | 前导列 `status` 被等值固定后，后面的 `create_time` 可继续按索引顺序排序 |
| `ORDER BY a, b`，索引为 `(a, b)` | ✓ | 排序字段顺序与索引顺序一致 |
| `ORDER BY b`，索引为 `(a, b)` | ✗ | 没有从最左列开始，通常无法直接利用索引排序 |
| `WHERE a > 1 ORDER BY b`，索引为 `(a, b)` | 通常较差 | `a` 已是范围条件，`b` 往往无法继续充分用于索引排序 |

**示例：**

```sql
-- 已建立组合索引
ALTER TABLE order_info ADD INDEX idx_status_time_id (status, create_time, id);

-- 过滤和排序都较容易利用索引
SELECT id, status, create_time
FROM order_info
WHERE status = 1
ORDER BY create_time, id;
```

若查询条件和排序条件无法按索引顺序命中，MySQL 可能需要额外执行排序操作，常见表现是执行计划中出现 `Using filesort`。

> **注意**：索引能改善排序成本，但不代表所有分页都能因此变快。深分页慢的核心问题，通常仍然是需要跳过大量记录，而不是只看排序本身。

### 5.7 索引的优缺点

| 优点             | 缺点                     |
| ---------------- | ------------------------ |
| 加快 **WHERE、ORDER BY、GROUP BY** 的查询 | 占用磁盘与内存           |
| 提高 **JOIN** 效率 | **INSERT/UPDATE/DELETE** 需维护索引，略慢 |
| 唯一索引保证数据唯一 | 过多索引增加优化器选择成本 |

**建议**：查询多、数据量大的表建索引；写多读少的表或小表可少建、不建；避免在重复率极高的列（如性别）上单独建普通索引。

***

## 六、多表设计

### 6.1 表关系

| 关系      | 说明      | 实现方式      |
| ------- | ------- | --------- |
| **一对多** | 部门-员工   | 在"多"方加外键  |
| **多对多** | 学生-课程   | 中间表+两个外键  |
| **一对一** | 用户-用户详情 | 外键+UNIQUE |

### 6.2 外键约束

#### 物理外键 vs 逻辑外键

| 对比    | 物理外键                           | 逻辑外键               |
| ----- | ------------------------------ | ------------------ |
| 定义    | 使用 `FOREIGN KEY` 约束，由**数据库**维护 | 不使用约束，由**程序代码**维护  |
| 数据一致性 | 数据库自动保证                        | 需要代码保证             |
| 性能    | 较低（每次增删改都要检查约束）                | 较高                 |
| 分库分表  | 困难（跨库无法建外键）                    | 容易                 |
| 灵活性   | 低                              | 高                  |
| 使用场景  | 小型项目、对数据一致性要求极高                | **互联网项目、大型系统（推荐）** |

#### 物理外键（数据库层面）

通过 `FOREIGN KEY` 关键字创建，数据库会自动检查约束：

```sql
-- 建表时创建
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    dept_id INT,
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES department(id)
);

-- 建表后添加
ALTER TABLE employee 
ADD CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES department(id);

-- 删除外键
ALTER TABLE employee DROP FOREIGN KEY fk_emp_dept;
```

**级联操作**（当父表数据变化时，子表自动处理）：

| 行为        | 说明                   |
| --------- | -------------------- |
| CASCADE   | 父表删除/更新，子表跟着删除/更新    |
| SET NULL  | 父表删除/更新，子表外键设为 NULL  |
| RESTRICT  | 有子记录时，禁止删除/更新父记录（默认） |
| NO ACTION | 同 RESTRICT           |

```sql
ALTER TABLE employee 
ADD CONSTRAINT fk_emp_dept 
FOREIGN KEY (dept_id) REFERENCES department(id)
ON UPDATE CASCADE ON DELETE SET NULL;
```

#### 逻辑外键（代码层面） 推荐

不使用数据库外键约束，**只在表中保留关联字段**，通过程序代码维护数据一致性：

```sql
-- 部门表
CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

-- 员工表（没有 FOREIGN KEY，只有普通字段 dept_id）
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    dept_id INT COMMENT '部门ID，逻辑关联 department.id'
    -- 注意：这里没有 FOREIGN KEY 约束！
);
```

**数据一致性由代码保证**（以 Java 为例）：

```java
// 删除部门前，先检查是否有员工
public void deleteDept(Integer deptId) {
    // 1. 检查该部门下是否有员工
    int count = employeeMapper.countByDeptId(deptId);
    if (count > 0) {
        throw new RuntimeException("该部门下有员工，无法删除");
    }
    // 2. 删除部门
    deptMapper.deleteById(deptId);
}
```

#### 为什么大厂更推荐逻辑外键？

1.  **性能更好**：没有外键检查的开销
2.  **方便分库分表**：物理外键无法跨库
3.  **更灵活**：便于数据迁移、数据清洗
4.  **解耦**：数据库只负责存储，业务逻辑由代码控制

> 💡 **阿里巴巴 Java 开发手册规定**：
> 【强制】不得使用外键与级联，一切外键概念必须在应用层解决。

#### 如何选择？

| 场景              | 建议        |
| --------------- | --------- |
| 学习阶段、小项目        | 可以用物理外键   |
| 企业项目、互联网项目      | **用逻辑外键** |
| 对数据一致性要求极高的金融系统 | 可考虑物理外键   |

### 6.3 多对多示例

```sql
-- 学生表
CREATE TABLE student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

-- 课程表
CREATE TABLE course (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

-- 中间表
CREATE TABLE student_course (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    score DECIMAL(5,2),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (course_id) REFERENCES course(id)
);
```

***

## 七、多表查询

### 7.1 多表查询概述

当查询的数据来自多张表时，需要使用多表查询。

**笛卡尔积（Cartesian Product）**：两张表所有记录的全排列组合。

```sql
-- 直接查询两张表，会产生笛卡尔积（通常是错误的）
SELECT * FROM employee, department;
-- 如果 employee 有 10 条，department 有 5 条
-- 结果会有 10 × 5 = 50 条（大部分是无效数据）
```

> ⚠️ 多表查询的核心是**消除笛卡尔积**，通过连接条件只保留有意义的数据组合。

### 7.2 表别名

多表查询时，**建议给表起别名**，好处：

1.  **简化书写**：用短别名代替长表名
2.  **避免歧义**：多表有相同字段名时，通过别名区分
3.  **自连接必须**：表自己连接自己时，必须用别名区分

```sql
-- 语法：表名 [AS] 别名（AS 可省略）
SELECT e.name, d.name
FROM employee AS e, department AS d;

-- AS 可以省略
SELECT e.name, d.name
FROM employee e, department d;
```

> ⚠️ **注意**：一旦给表起了别名，就**只能使用别名**，不能再用原表名。

### 7.3 连接方式总览

假设有两张表：

    employee（员工表）           department（部门表）
    +----+------+---------+      +----+--------+
    | id | name | dept_id |      | id | name   |
    +----+------+---------+      +----+--------+
    | 1  | 张三 | 1       |      | 1  | 研发部 |
    | 2  | 李四 | 2       |      | 2  | 市场部 |
    | 3  | 王五 | NULL    |      | 3  | 财务部 |
    +----+------+---------+      +----+--------+
            ↑                           ↑
        王五没有部门               财务部没有员工

**各种连接方式对比：**

| 连接方式     | 说明                           | 结果                     |
| -------- | ---------------------------- | ---------------------- |
| **内连接**  | 两表的**交集**，只返回匹配的行            | 张三-研发部、李四-市场部          |
| **左外连接** | **左表全部** + 交集                | 张三-研发部、李四-市场部、王五-NULL  |
| **右外连接** | **右表全部** + 交集                | 张三-研发部、李四-市场部、NULL-财务部 |
| **全外连接** | 两表**并集**（MySQL 不支持，可用 UNION） | 全部数据                   |

**图示理解：**

        ┌───────────────────────────────────────┐
        │           LEFT JOIN（左外连接）         │
        │  ┌─────────┐                          │
        │  │ ████████│███████┐                  │
        │  │ ████████│███████│                  │
        │  │  LEFT   │ INNER │  RIGHT           │
        │  │ ████████│███████│                  │
        │  │ ████████│███████┘                  │
        │  └─────────┘                          │
        │  █ = 返回的数据                         │
        └───────────────────────────────────────┘

        内连接 INNER JOIN：只取中间交集部分
        左外连接 LEFT JOIN：左边全部 + 中间交集
        右外连接 RIGHT JOIN：右边全部 + 中间交集

### 7.4 ON 与 WHERE 的区别

多表查询时，**ON 和 WHERE 要分工明确**：

| 关键字       | 用途        | 说明               |
| --------- | --------- | ---------------- |
| **ON**    | 放**关联条件** | 指定两表如何连接（如主外键关系） |
| **WHERE** | 放**过滤条件** | 筛选最终需要的数据        |

```sql
-- ✓ 正确写法：ON 放关联条件，WHERE 放过滤条件
SELECT e.name, d.name AS dept_name
FROM employee e
LEFT JOIN department d ON e.dept_id = d.id   -- 关联条件
WHERE e.age > 25;                             -- 过滤条件

-- ✗ 不推荐：把过滤条件放到 ON 里（内连接结果相同，但外连接结果会不同！）
SELECT e.name, d.name AS dept_name
FROM employee e
LEFT JOIN department d ON e.dept_id = d.id AND e.age > 25;
```

> 💡 **记忆口诀**：ON 管连接，WHERE 管筛选。

### 7.5 内连接（INNER JOIN）

**作用**：返回两表中**满足连接条件**的记录（交集）。

**特点**：

*   只返回匹配的行，不匹配的行不显示
*   没有部门的员工不显示，没有员工的部门也不显示

```sql
-- 显式内连接（推荐，语义清晰）
-- INNER 可以省略，直接写 JOIN
SELECT e.name, d.name AS dept_name
FROM employee e
INNER JOIN department d ON e.dept_id = d.id;

-- INNER 省略写法（效果完全相同）
SELECT e.name, d.name AS dept_name
FROM employee e
JOIN department d ON e.dept_id = d.id;

-- 隐式内连接（WHERE 方式，较老的写法）
SELECT e.name, d.name AS dept_name
FROM employee e, department d
WHERE e.dept_id = d.id;
```

**结果**：

    +------+-----------+
    | name | dept_name |
    +------+-----------+
    | 张三 | 研发部     |
    | 李四 | 市场部     |
    +------+-----------+
    -- 王五（无部门）和财务部（无员工）都不显示

### 7.6 外连接（OUTER JOIN）

#### 左外连接（LEFT JOIN）

**作用**：返回**左表所有记录** + 右表匹配的记录。右表没有匹配的显示 NULL。

**特点**：保证左表数据完整性，常用于"查询所有员工及其部门（包括没有部门的员工）"

```sql
-- OUTER 可以省略
SELECT e.name, d.name AS dept_name
FROM employee e
LEFT JOIN department d ON e.dept_id = d.id;

-- 完整写法（不常用）
SELECT e.name, d.name AS dept_name
FROM employee e
LEFT OUTER JOIN department d ON e.dept_id = d.id;
```

**结果**：

    +------+-----------+
    | name | dept_name |
    +------+-----------+
    | 张三 | 研发部     |
    | 李四 | 市场部     |
    | 王五 | NULL      |  ← 左表的王五保留，右表无匹配显示 NULL
    +------+-----------+

#### 右外连接（RIGHT JOIN）

**作用**：返回**右表所有记录** + 左表匹配的记录。左表没有匹配的显示 NULL。

**特点**：保证右表数据完整性，常用于"查询所有部门及其员工（包括没有员工的部门）"

```sql
SELECT e.name, d.name AS dept_name
FROM employee e
RIGHT JOIN department d ON e.dept_id = d.id;
```

**结果**：

    +------+-----------+
    | name | dept_name |
    +------+-----------+
    | 张三 | 研发部     |
    | 李四 | 市场部     |
    | NULL | 财务部     |  ← 右表的财务部保留，左表无匹配显示 NULL
    +------+-----------+

> 💡 **实际开发中**：LEFT JOIN 用得更多，因为习惯把"主表"放左边。RIGHT JOIN 都可以改写成 LEFT JOIN。

### 7.7 自连接

**作用**：表自己与自己连接，用于查询**有层级关系**的数据（如员工-领导、分类-子分类）。

**必须给表取别名**，否则无法区分。

```sql
-- 员工表（包含领导ID）
-- +----+------+------------+
-- | id | name | manager_id |
-- +----+------+------------+
-- | 1  | 老板 | NULL       |
-- | 2  | 张三 | 1          |
-- | 3  | 李四 | 1          |
-- | 4  | 王五 | 2          |
-- +----+------+------------+

-- 查询员工及其领导姓名
SELECT e.name AS '员工', m.name AS '领导'
FROM employee e
LEFT JOIN employee m ON e.manager_id = m.id;
```

**结果**：

    +------+------+
    | 员工 | 领导 |
    +------+------+
    | 老板 | NULL |  ← 老板没有领导
    | 张三 | 老板 |
    | 李四 | 老板 |
    | 王五 | 张三 |
    +------+------+

### 7.8 联合查询（UNION）

**作用**：将多个查询结果**纵向合并**（上下拼接）。

```sql
SELECT 字段列表 FROM 表1
UNION [ALL]
SELECT 字段列表 FROM 表2;
```

| 关键字       | 说明              |
| --------- | --------------- |
| UNION     | 合并并**去重**       |
| UNION ALL | 合并**不去重**（性能更好） |

> ⚠️ 要求：多个查询的**字段数量和类型必须一致**

```sql
-- 查询薪资 > 10000 或 年龄 > 40 的员工（用 UNION 代替 OR）
SELECT * FROM employee WHERE salary > 10000
UNION
SELECT * FROM employee WHERE age > 40;

-- 模拟全外连接（MySQL 不支持 FULL JOIN）
SELECT e.name, d.name FROM employee e LEFT JOIN department d ON e.dept_id = d.id
UNION
SELECT e.name, d.name FROM employee e RIGHT JOIN department d ON e.dept_id = d.id;
```

### 7.9 子查询

子查询是嵌套在其他 SQL 语句中的 SELECT 语句，也叫**嵌套查询**。

#### 按返回结果分类

| 类型    | 返回结果 | 常用操作符                        |
| ----- | ---- | ---------------------------- |
| 标量子查询 | 单个值  | `=`, `>`, `<`, `>=`, `<=`    |
| 列子查询  | 一列多行 | `IN`, `NOT IN`, `ANY`, `ALL` |
| 行子查询  | 一行多列 | `=`, `IN`                    |
| 表子查询  | 多行多列 | `IN`, 作为临时表                  |

#### 标量子查询

返回单个值，可用于 WHERE、SELECT、HAVING 中。

```sql
-- 查询"研发部"的所有员工
SELECT * FROM employee 
WHERE dept_id = (SELECT id FROM department WHERE name = '研发部');
```

#### 列子查询

返回一列数据，常配合 IN、ANY、ALL 使用。

```sql
-- 查询"研发部"和"市场部"的所有员工
SELECT * FROM employee 
WHERE dept_id IN (SELECT id FROM department WHERE name IN ('研发部', '市场部'));

-- 比研发部所有人工资都高（ALL：比所有都大）
SELECT * FROM employee 
WHERE salary > ALL (SELECT salary FROM employee WHERE dept_id = 1);

-- 比研发部任意一人工资高（ANY：比其中一个大即可）
SELECT * FROM employee 
WHERE salary > ANY (SELECT salary FROM employee WHERE dept_id = 1);
```

#### 行子查询

返回一行数据，用于同时匹配多个字段。

```sql
-- 查询与"张三"薪资和部门都相同的员工
SELECT * FROM employee 
WHERE (salary, dept_id) = (SELECT salary, dept_id FROM employee WHERE name = '张三');
```

#### 表子查询

返回多行多列，作为临时表使用。

```sql
-- 查询入职日期是"2023-01-01"之后的员工，及其部门信息
SELECT e.*, d.name AS dept_name
FROM (SELECT * FROM employee WHERE hire_date > '2023-01-01') e
LEFT JOIN department d ON e.dept_id = d.id;
```

### 7.10 多表查询总结

| 场景            | 选择                 |
| ------------- | ------------------ |
| 只要匹配的数据       | INNER JOIN（或 JOIN） |
| 保留左表全部数据      | LEFT JOIN          |
| 保留右表全部数据      | RIGHT JOIN         |
| 表自己关联自己（层级关系） | 自连接                |
| 合并多个查询结果      | UNION / UNION ALL  |
| 条件中需要另一个查询的结果 | 子查询                |

***

## 八、事务

### 8.1 事务概念

**事务（Transaction）** 是一组操作的集合，**要么同时成功，要么同时失败**。

### 8.2 事务操作

```sql
-- 开启事务
START TRANSACTION;
-- 或 BEGIN;

-- 提交事务
COMMIT;

-- 回滚事务
ROLLBACK;
```

事务内执行多条更新（如转账），提交或回滚保证原子性：

```sql
START TRANSACTION;
UPDATE account SET balance = balance - 1000 WHERE name = '张三';
UPDATE account SET balance = balance + 1000 WHERE name = '李四';
COMMIT;   -- 成功则提交
-- ROLLBACK;  -- 失败则回滚
```

### 8.3 ACID 特性

| 特性      | 说明           |
| ------- | ------------ |
| **原子性** | 不可分割，全成功或全失败 |
| **一致性** | 事务前后数据一致     |
| **隔离性** | 多事务并发时互不干扰   |
| **持久性** | 提交后永久保存      |

### 8.4 并发事务问题

并发事务问题的本质，是多个事务同时访问同一批数据时，**读取结果是否稳定、是否可能读到中间状态**。

| 问题          | 说明                       | 典型现象                         |
| ------------- | -------------------------- | -------------------------------- |
| **脏读**      | 读到其他事务**未提交**的数据 | 事务 A 回滚后，事务 B 之前读到的数据失效 |
| **不可重复读** | 同一事务内多次读取**同一行**结果不同 | 第一次读和第二次读的字段值不一致       |
| **幻读**      | 同一事务内多次按条件查询，结果集条数不同 | 第一次查 10 条，第二次查变成 11 条     |

**三者区别：**

- **脏读** 关注“是否读到了未提交的数据”。
- **不可重复读** 关注“同一行数据的值是否变化”。
- **幻读** 关注“符合条件的记录集合是否变化”。

#### 1. 脏读示例

```sql
-- 事务 A
START TRANSACTION;
UPDATE account SET balance = 500 WHERE id = 1;

-- 事务 B（此时读到了 500）
SELECT balance FROM account WHERE id = 1;

-- 事务 A 回滚
ROLLBACK;
```

如果事务 B 在事务 A 提交前就读到了余额 `500`，这就是**脏读**。

#### 2. 不可重复读示例

```sql
-- 事务 A
START TRANSACTION;
SELECT balance FROM account WHERE id = 1;  -- 第一次读取：1000

-- 事务 B
UPDATE account SET balance = 800 WHERE id = 1;
COMMIT;

-- 事务 A
SELECT balance FROM account WHERE id = 1;  -- 第二次读取：800
```

事务 A 在同一事务内两次读取同一行，结果不一致，这就是**不可重复读**。

#### 3. 幻读示例

```sql
-- 事务 A
START TRANSACTION;
SELECT COUNT(*) FROM orders WHERE amount > 100;  -- 第一次查询：10

-- 事务 B
INSERT INTO orders(id, amount) VALUES (101, 200);
COMMIT;

-- 事务 A
SELECT COUNT(*) FROM orders WHERE amount > 100;  -- 第二次查询：11
```

事务 A 两次按相同条件查询，结果集条数发生变化，这就是**幻读**。

### 8.5 事务隔离级别

**事务隔离级别（Isolation Level）** 用来控制事务之间的数据可见性。隔离级别越高，一致性通常越强，但并发能力通常越低。

| 隔离级别                | 脏读 | 不可重复读 | 幻读 | 核心特点 |
| ----------------------- | :--: | :--------: | :--: | -------- |
| Read Uncommitted        |  ✓   |     ✓      |  ✓   | 几乎不做隔离，并发高，但问题最多 |
| Read Committed          |  ✗   |     ✓      |  ✓   | 只能读已提交数据，很多数据库默认使用 |
| **Repeatable Read**     |  ✗   |     ✗      |  ✓   | 同一事务内多次读取同一行结果一致 |
| Serializable            |  ✗   |     ✗      |  ✗   | 最严格，事务接近串行执行 |

> MySQL 默认：**Repeatable Read**

#### 1. 四种隔离级别的理解

| 隔离级别 | 理解方式 | 适用特点 |
| -------- | -------- | -------- |
| **读未提交** | 连别人还没提交的数据都可以读到 | 性能优先，几乎不在业务系统中使用 |
| **读已提交** | 只能读到别人已经提交的数据 | 能解决脏读，Oracle 等数据库默认级别 |
| **可重复读** | 同一事务里多次读取同一行结果保持一致 | MySQL InnoDB 默认级别，兼顾一致性与并发 |
| **串行化** | 给并发事务排队执行 | 一致性最强，但吞吐量最低 |

#### 2. MySQL 为什么默认是 Repeatable Read

MySQL InnoDB 默认选择 **Repeatable Read**，核心考虑是：

- 比 `Read Committed` 更强，能避免同一事务内读取同一行数据前后不一致。
- 比 `Serializable` 更轻量，不会把大量并发事务都强制串行化。
- 配合 **MVCC** 可以让普通查询获得较好的并发性能。
- 配合 **间隙锁（Gap Lock）**、**Next-Key Lock**，在加锁读场景下进一步控制幻读问题。

#### 3. 查看与设置隔离级别

```sql
-- 查看隔离级别
SELECT @@TRANSACTION_ISOLATION;

-- 设置隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

#### 4. 常见面试追问点

| 问题 | 结论 |
| ---- | ---- |
| **隔离级别越高越好吗** | 不是。隔离级别越高，一致性越强，但锁冲突和性能开销通常也越大。 |
| **MySQL 默认隔离级别是什么** | InnoDB 默认是 `Repeatable Read`。 |
| **Repeatable Read 是否完全没有幻读** | 从标准定义看仍需关注幻读；在 InnoDB 中会结合 MVCC 和锁机制处理不同场景。 |

### 8.6 MVCC 与锁的关系

**MVCC（Multi-Version Concurrency Control，多版本并发控制）** 是 InnoDB 用来提升并发读性能的重要机制。它通过保存数据的多个版本，让读操作在很多场景下不必直接加锁。

#### 1. MVCC 解决什么问题

MVCC 主要解决的是：

- 普通读不想被写阻塞。
- 写操作也不希望长时间阻塞普通读。
- 在 `Read Committed`、`Repeatable Read` 下，需要让事务读到符合隔离级别要求的数据版本。

#### 2. 快照读与当前读

| 读取方式 | 说明 | 常见语句 |
| -------- | ---- | -------- |
| **快照读** | 读取数据的历史版本，通常不加锁 | 普通 `SELECT` |
| **当前读** | 读取最新版本，并对目标记录加锁 | `SELECT ... FOR UPDATE`、`UPDATE`、`DELETE` |

#### 3. Read Committed 与 Repeatable Read 的差异

| 隔离级别 | 快照生成时机 | 结果特征 |
| -------- | ------------ | -------- |
| **Read Committed** | 每次 `SELECT` 都可能读取最新已提交版本 | 同一事务内前后两次查询结果可能不同 |
| **Repeatable Read** | 事务开始后首次一致性读会确定快照 | 同一事务内多次普通查询结果更稳定 |

#### 4. 幻读为什么还会提到锁

MVCC 更擅长解决**普通查询**的可见性问题，但当事务执行的是**当前读**时，仅靠 MVCC 不够，还需要锁来限制其他事务插入符合条件的新记录。

InnoDB 常见锁机制：

| 锁 | 作用 |
| --- | --- |
| **记录锁（Record Lock）** | 锁住某一行记录 |
| **间隙锁（Gap Lock）** | 锁住某个范围之间的空隙，防止插入新记录 |
| **Next-Key Lock** | 记录锁 + 间隙锁，既锁记录又锁区间 |

因此，关于幻读可以记成一句话：

- **普通查询** 主要依靠 MVCC 保证一致性读。
- **加锁查询 / 更新 / 删除** 主要依靠间隙锁、Next-Key Lock 控制并发插入。

***

## 九、SQL 优化与性能

接口或查询变慢时，通常从**索引、N+1、慢查询**三方面排查：索引决定单条 SQL 是否走索引；N+1 导致请求次数暴增；慢查询日志用于定位具体慢的 SQL。

### 9.1 N+1 问题

**N+1 问题** 指：先执行 1 次查询得到 N 条主表记录，再对每条记录各查 1 次关联数据，总共执行 **1 + N 次** SQL。多由 ORM 的**懒加载**在循环里触发关联查询引起。

| 对比       | 正常做法           | N+1 问题              |
| ---------- | ------------------ | --------------------- |
| **查询次数** | 1 条或少量 SQL     | 1 + N 条（N 为主表行数） |
| **典型场景** | JOIN / 预加载一次查出 | 循环内逐条查关联表       |
| **后果**   | 网络与 DB 压力小   | 请求数暴增，接口变慢     |

**示例（错误写法）：**

```sql
-- 1 次：查用户列表
SELECT * FROM user WHERE dept_id = 1;
-- 假设返回 100 条

-- N 次：循环里每个 user 再查订单（应用层循环 100 次，每次一条 SQL）
SELECT * FROM order WHERE user_id = ?;  -- 执行 100 次
-- 总计 1 + 100 = 101 次 SQL
```

**解决思路：**

| 方式         | 说明                                       |
| ------------ | ------------------------------------------ |
| **JOIN 一次查** | 多表用 JOIN 或子查询在一次 SQL 中查出主表+关联 |
| **预加载（Eager）** | JPA 用 `@EntityGraph`、`JOIN FETCH`；MyBatis 用关联查询或批量 IN |
| **批量 IN 查** | 先查主表得 id 列表，再 `WHERE id IN (...)` 一次查关联 |

目标是把 **1+N 次** 降为 **1 次或常数次**。

### 9.2 慢查询

**慢查询** 指执行时间超过设定阈值的 SQL。MySQL 通过**慢查询日志**记录这些 SQL，用于定位性能瓶颈并优化（加索引、改写法、减扫描量等）。

| 概念           | 说明                                   |
| -------------- | -------------------------------------- |
| **慢查询日志** | 记录执行时间超过 `long_query_time` 的 SQL |
| **阈值**       | 默认 10 秒，可改为 1 秒、2 秒等           |
| **典型原因**   | 缺索引、全表扫描、大结果集、锁等待、复杂 JOIN/子查询 |

**开启与查看：**

```sql
-- 查看是否开启及阈值（秒）
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- 开启慢查询日志并设置阈值为 2 秒（会话级，重启失效）
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

```bash
# 日志路径（Linux 常见）
# /var/lib/mysql/<hostname>-slow.log
# 或在 my.cnf 中配置 slow_query_log_file
```

**优化流程：** 开慢查询日志 → 压测或线上观察 → 分析日志找到慢 SQL → 用 `EXPLAIN` 看执行计划 → 加索引、改写 SQL、避免大事务或锁竞争。是否走索引以 `EXPLAIN` 的 **type**（ref、range 优于 ALL）、**key**（是否用到索引）为准。

### 9.3 分页优化与深分页问题

**深分页** 指使用 `LIMIT offset, size` 查询靠后页码时，`offset` 很大，数据库需要先扫描并跳过前面大量记录，最后才返回当前页少量数据。

| 查询方式 | 示例 | 特点 |
| -------- | ---- | ---- |
| **普通分页** | `LIMIT 0, 20` | 前几页通常开销较小 |
| **深分页** | `LIMIT 100000, 20` | 需要跳过大量记录，越往后越慢 |

#### 1. 深分页为什么慢

以如下 SQL 为例：

```sql
SELECT *
FROM order_info
WHERE supplier_id = 1001
ORDER BY id
LIMIT 100000, 20;
```

它并不是“直接拿第 100001 到第 100020 条”，而更接近下面这个过程：

    根据 WHERE 条件筛选数据
        ↓
    按 ORDER BY 字段排序
        ↓
    跳过前 100000 条记录
        ↓
    返回最后 20 条

因此深分页慢的核心原因通常有三类：

| 原因 | 说明 |
| ---- | ---- |
| **跳过大量数据** | 即使最终只返回很少数据，也要先扫描前面很多记录 |
| **排序成本高** | 如果 `ORDER BY` 没有较好利用索引，还要做额外排序 |
| **回表成本** | 通过二级索引拿到大量主键后，再回主键索引取完整数据，会增加随机 IO |

#### 2. 索引在分页中的作用边界

合理索引可以改善分页查询，但不能彻底消除深分页问题。

| 能做的事 | 不能完全解决的事 |
| -------- | ---------------- |
| **加速条件过滤** | 不能让大 `offset` 直接消失 |
| **帮助排序** | 不能避免前面大量记录被跳过 |
| **通过覆盖索引减少回表** | 不能让任意跳到很靠后的页完全无成本 |

例如建立组合索引：

```sql
ALTER TABLE order_info ADD INDEX idx_supplier_id_id (supplier_id, id);
```

则如下 SQL 会比无索引时更容易优化：

```sql
SELECT id
FROM order_info
WHERE supplier_id = 1001
ORDER BY id
LIMIT 100000, 20;
```

但即便如此，数据库仍可能需要先定位并跳过前面大量符合条件的记录。

#### 3. 游标分页（Seek 分页）

**游标分页** 不再依赖“第几页 + offset”，而是基于上一页最后一条记录的位置继续往后查，因此更适合大数据量下的连续翻页。

| 对比项 | `offset` 分页 | 游标分页 |
| ------ | ------------- | -------- |
| **定位方式** | 跳过前 N 条再取数据 | 从上次最后一条记录继续往后取 |
| **深页性能** | 页码越大越慢 | 连续翻页时更稳定 |
| **是否适合直接跳页** | ✓ | ✗，不适合直接跳到任意页 |
| **适用场景** | 后台表格、小数据量 | 列表流、消息流、大数据量连续翻页 |

```sql
-- 普通分页
SELECT *
FROM order_info
WHERE supplier_id = 1001
ORDER BY id
LIMIT 100000, 20;

-- 游标分页
SELECT *
FROM order_info
WHERE supplier_id = 1001
  AND id > 100000
ORDER BY id
LIMIT 20;
```

若排序字段可能重复，通常要配合唯一字段一起排序，保证顺序稳定：

```sql
SELECT *
FROM order_info
WHERE supplier_id = 1001
  AND (create_time > '2026-03-31 10:00:00'
       OR (create_time = '2026-03-31 10:00:00' AND id > 12345))
ORDER BY create_time, id
LIMIT 20;
```

#### 4. 页面查询优化

页面分页强调交互体验和查询响应速度，常见优化方式如下：

| 方案 | 说明 |
| ---- | ---- |
| **优先使用游标分页** | 适合“下一页”“加载更多”这类连续翻页场景 |
| **建立合适的组合索引** | 让 `WHERE + ORDER BY` 尽量一起命中索引 |
| **限制最大翻页深度** | 限制只允许查看前若干页，避免极深页码拖垮数据库 |
| **先查主键再回表** | 先分页拿主键集合，再按主键回表查完整列，减少深分页成本 |
| **缩小查询范围** | 引导用户加筛选条件，避免无边界大结果集分页 |

**先查主键再回表示例：**

```sql
-- 第一步：利用覆盖索引先查当前页主键
SELECT id
FROM order_info
WHERE supplier_id = 1001
ORDER BY id
LIMIT 100000, 20;

-- 第二步：再按主键取完整数据
SELECT *
FROM order_info
WHERE id IN (......);
```

#### 5. 导出查询优化

导出场景的目标通常不是“展示第几页”，而是**稳定、可控地批量取数**，因此不应继续套用传统页码分页思路。

| 方案 | 说明 |
| ---- | ---- |
| **按主键范围分批查询** | 每次查一批，记录本批最后一个主键，继续向后拉取 |
| **按时间窗口分批查询** | 适合时间维度明显的数据，如按天、按月导出 |
| **异步导出任务化** | 用户提交任务后后台慢慢导出，前台只查状态 |
| **边查边写文件** | 避免一次性把全部数据加载进内存 |
| **控制批量大小** | 例如每批 1000、2000、5000，根据数据库与 JVM 压力调整 |

```sql
-- 每次导出一批数据
SELECT *
FROM order_info
WHERE supplier_id = 1001
  AND id > ?
ORDER BY id
LIMIT 1000;
```

每查完一批，就记录本批最后一个 `id` 作为下一批的起点。

***

## 十、读写分离与分库分表

### 10.1 读写分离

**读写分离**是数据库扩展的第一步，核心思路：**主库负责写，从库负责读**，通过主从复制（binlog）保持数据同步。

```
写请求 → 主库（Master）
              ↓ 主从复制（binlog）
读请求 → 从库（Slave 1、Slave 2 ...）
```

| 优点 | 注意事项 |
| ---- | -------- |
| 读请求分散到从库，降低主库压力 | 主从同步有延迟，读从库可能读到旧数据 |
| 从库可水平扩展，适合读多写少场景 | 写请求仍受单主库限制 |
| 改造成本相对较低 | 强一致性场景需强制走主库 |

> 💡 **主从延迟**：写完立即读（如下单后立即查询订单）需强制走主库，避免读到从库未同步的旧数据。ShardingSphere、MyCat 等中间件均支持此类路由规则。

### 10.2 为什么需要分库分表

读写分离解决了读压力，但单库写压力、单表行数增长问题仍然存在。当单表行数达到千万甚至亿级时，会出现：

- B+ 树层高增加，查询需要更多磁盘 IO
- 写入时索引维护成本高，锁竞争加剧
- 单库磁盘、CPU、连接数等硬件资源达到瓶颈
- 备份与恢复耗时长

> **注意**：分库分表显著增加系统复杂度，不应过早引入。应先做好索引优化、慢查询治理、读写分离，这些手段无法满足需求时再考虑分库分表。

### 10.3 拆分维度

分库分表从**列（结构）**和**行（数据）**两个维度各有两种方式：

| 维度 | 方式 | 说明 | 解决的问题 |
| ---- | ---- | ---- | ---------- |
| **列（结构）** | **垂直分表** | 将宽表按列拆成多张表（热字段一张，冷字段另一张） | 减少单行大小，降低 IO 压力，冷热分离 |
| **列（结构）** | **垂直分库** | 将不同业务的表拆到不同数据库（订单库、用户库、商品库） | 业务解耦，降低单库压力 |
| **行（数据）** | **水平分表** | 将同一张表的行按规则拆到多张结构相同的表（同库） | 降低单表行数，缓解查询和写入压力 |
| **行（数据）** | **水平分库** | 将同一张表的行按规则分散到多个库（不同机器） | 突破单机存储和性能上限 |

实际场景中，水平分表与水平分库通常一起使用，常见说法"分库分表"多指**水平分库 + 水平分表**。

**垂直分表示意：**

```
原始 order 表（宽表）
+----+---------+--------+--------+--------------------+
| id | user_id | amount | status | remark（大字段）    |
+----+---------+--------+--------+--------------------+

                        ↓ 垂直分表

order（主表，高频访问）        order_detail（扩展表，低频）
+----+---------+--------+        +----------+--------------------+
| id | user_id | amount |        | order_id | remark             |
+----+---------+--------+        +----------+--------------------+
```

**水平分表示意（order 表按 user_id % 4 分片）：**

```
order_0              order_1              order_2              order_3
user_id % 4 = 0      user_id % 4 = 1      user_id % 4 = 2      user_id % 4 = 3
```

### 10.4 水平分片策略

水平拆分的核心是选择**分片键（Sharding Key）**和**分片规则**。分片键应选择查询时必带的字段，且区分度足够高（如用户 ID、订单 ID），不要选经常变更的字段。

| 策略 | 说明 | 优点 | 缺点 |
| ---- | ---- | ---- | ---- |
| **取模分片** | `hash(分片键) % 分片数` | 数据分布均匀，实现简单 | 扩容时需要迁移大量数据 |
| **范围分片** | 按分片键区间划分（id 0-999万→分片0，1000万-1999万→分片1） | 扩容方便，无需迁移历史数据 | 可能数据倾斜（热点集中在某分片） |
| **一致性哈希** | 哈希环方式分片 | 扩容时迁移量少 | 实现相对复杂 |

### 10.5 分库分表带来的挑战

| 挑战 | 说明 | 常见解决思路 |
| ---- | ---- | ------------ |
| **分布式唯一 ID** | `AUTO_INCREMENT` 在多分片间会冲突 | 雪花算法（Snowflake）、数据库号段模式 |
| **跨分片查询** | `ORDER BY`、`GROUP BY`、聚合、JOIN 涉及多分片时需在中间层合并 | 分片键缩小范围；全局查询走 Elasticsearch |
| **分布式事务** | 跨库操作无法使用本地事务 | Seata（AT/TCC 模式）、消息最终一致性 |
| **跨分片分页** | 深分页需从多个分片各取数据再合并排序 | 游标分页、限制翻页深度、ES 存储 |
| **数据扩容迁移** | 扩容时重新分片，存量数据迁移复杂 | 双写方案、蓝绿迁移 |
| **SQL 限制** | 不带分片键的 JOIN、子查询等无法高效执行 | 业务设计上减少跨分片 JOIN |

> **分布式唯一 ID**：不能再使用数据库自增主键。**雪花算法（Snowflake）**是业界最常用方案，生成的 ID 由 `时间戳 + 机器ID + 序列号` 组成，全局唯一且趋势递增（对 B+ 树插入友好）。

### 10.6 分库分表中间件

中间件负责**拦截 SQL → 解析路由 → 分发到对应分片 → 合并结果**，让业务代码基本无感知。

| 中间件 | 类型 | 特点 |
| ------ | ---- | ---- |
| **ShardingSphere（Apache）** | 客户端 / 代理双模式 | 功能全面，社区活跃，国内主流选择；支持读写分离、分库分表、数据加密 |
| **MyCat** | 代理模式 | 老牌中间件，配置复杂，社区活跃度较低 |

ShardingSphere 两种接入方式：

| 接入方式 | 说明 | 适用场景 |
| -------- | ---- | -------- |
| **ShardingSphere-JDBC** | 客户端模式，以 jar 包引入，无需额外部署 | Java 项目首选 |
| **ShardingSphere-Proxy** | 代理模式，作为独立服务部署，语言无关 | 多语言、多服务共享 |

#### 6. 什么时候不能只靠加索引

以下情况即使建了索引，也不能简单认为分页问题已经解决：

| 场景 | 原因 |
| ---- | ---- |
| **必须直接跳到很靠后的页** | 大 `offset` 的跳过成本依然存在 |
| **筛选范围过大** | 命中索引后仍可能返回大量候选记录 |
| **排序字段不稳定或不匹配索引** | 仍可能触发额外排序 |
| **查询列很多** | 回表开销可能明显 |

因此分页优化的思路通常不是“只加索引”，而是：

    索引设计
        +
    排序优化
        +
    分页方案选择
        +
    页面与导出分场景设计

