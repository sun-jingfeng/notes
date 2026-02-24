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

## 五、多表设计

### 5.1 表关系

| 关系      | 说明      | 实现方式      |
| ------- | ------- | --------- |
| **一对多** | 部门-员工   | 在"多"方加外键  |
| **多对多** | 学生-课程   | 中间表+两个外键  |
| **一对一** | 用户-用户详情 | 外键+UNIQUE |

### 5.2 外键约束

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

### 5.3 多对多示例

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

## 六、多表查询

### 6.1 多表查询概述

当查询的数据来自多张表时，需要使用多表查询。

**笛卡尔积（Cartesian Product）**：两张表所有记录的全排列组合。

```sql
-- 直接查询两张表，会产生笛卡尔积（通常是错误的）
SELECT * FROM employee, department;
-- 如果 employee 有 10 条，department 有 5 条
-- 结果会有 10 × 5 = 50 条（大部分是无效数据）
```

> ⚠️ 多表查询的核心是**消除笛卡尔积**，通过连接条件只保留有意义的数据组合。

### 6.2 表别名

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

### 6.3 连接方式总览

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

### 6.4 ON 与 WHERE 的区别

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

### 6.5 内连接（INNER JOIN）

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

### 6.6 外连接（OUTER JOIN）

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

### 6.7 自连接

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

### 6.8 联合查询（UNION）

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

### 6.9 子查询

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

### 6.10 多表查询总结

| 场景            | 选择                 |
| ------------- | ------------------ |
| 只要匹配的数据       | INNER JOIN（或 JOIN） |
| 保留左表全部数据      | LEFT JOIN          |
| 保留右表全部数据      | RIGHT JOIN         |
| 表自己关联自己（层级关系） | 自连接                |
| 合并多个查询结果      | UNION / UNION ALL  |
| 条件中需要另一个查询的结果 | 子查询                |

***

## 七、事务

### 7.1 事务概念

**事务（Transaction）** 是一组操作的集合，**要么同时成功，要么同时失败**。

### 7.2 事务操作

```sql
-- 开启事务
START TRANSACTION;
-- 或 BEGIN;

-- 提交事务
COMMIT;

-- 回滚事务
ROLLBACK;
```

**转账示例：**

```sql
START TRANSACTION;
UPDATE account SET balance = balance - 1000 WHERE name = '张三';
UPDATE account SET balance = balance + 1000 WHERE name = '李四';
COMMIT;  -- 成功提交
-- ROLLBACK;  -- 失败回滚
```

### 7.3 ACID 特性

| 特性      | 说明           |
| ------- | ------------ |
| **原子性** | 不可分割，全成功或全失败 |
| **一致性** | 事务前后数据一致     |
| **隔离性** | 多事务并发时互不干扰   |
| **持久性** | 提交后永久保存      |

### 7.4 并发事务问题

| 问题        | 说明           |
| --------- | ------------ |
| **脏读**    | 读到未提交的数据     |
| **不可重复读** | 同一事务多次读取结果不同 |
| **幻读**    | 查询时没有，插入时又有  |

### 7.5 事务隔离级别

| 隔离级别                |  脏读 | 不可重复读 |  幻读 |
| ------------------- | :-: | :---: | :-: |
| Read Uncommitted    |  ✓  |   ✓   |  ✓  |
| Read Committed      |  ✗  |   ✓   |  ✓  |
| **Repeatable Read** |  ✗  |   ✗   |  ✓  |
| Serializable        |  ✗  |   ✗   |  ✗  |

> MySQL 默认：**Repeatable Read**

```sql
-- 查看隔离级别
SELECT @@TRANSACTION_ISOLATION;

-- 设置隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

