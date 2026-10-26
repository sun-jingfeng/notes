## 1. MySQL Overview

### 1.1 What Is MySQL?

MySQL is a widely used open-source **relational database management system (RDBMS)** with these characteristics:

*   **Open-source community edition:** Available without a license fee.
*   **Performance:** Supports efficient queries and concurrent workloads.
*   **Cross-platform:** Runs on Windows, Linux, and macOS.
*   **Broad ecosystem:** Integrates with Java, Python, PHP, and other languages.

### 1.2 Installation

#### Windows

**Option 1: Official installer (recommended)**

1.  Visit <https://dev.mysql.com/downloads/mysql/>
2.  Download MySQL Installer
3.  Select **Developer Default** or **Server only**
4.  Set the root password
5.  The installer registers a Windows service

***

**Option 2: Install from an archive**

Basic `my.ini` configuration:

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
# Initialize the database
mysqld --initialize-insecure --user=mysql

# Register the Windows service
mysqld --install MySQL

# Start the service
net start MySQL

# Log in and change the password
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your-new-password';
```

#### macOS / Linux

```bash
# macOS (Homebrew)
brew install mysql
brew services start mysql

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Security configuration
mysql_secure_installation
```

#### Common Service Commands

| Action | Windows | Linux with systemd |
| ---- | ----------------- | ------------------------------ |
| Start | `net start mysql` | `sudo systemctl start mysql` |
| Stop | `net stop mysql` | `sudo systemctl stop mysql` |
| Restart | Stop, then start | `sudo systemctl restart mysql` |
| Status | `sc query mysql` | `sudo systemctl status mysql` |

#### Connecting to MySQL

```bash
# Connect locally
mysql -u root -p

# Specify a host and port
mysql -h 127.0.0.1 -P 3306 -u root -p
```

### 1.3 Graphical Tools

| Tool | Characteristics | Pricing |
| ------------------- | ---------------- | -------- |
| **Navicat** | Extensive features and a graphical interface | Paid |
| **DataGrip** | JetBrains database IDE | Paid; educational licenses available |
| **DBeaver** | Open-source community edition; supports many databases | Free community edition |
| **MySQL Workbench** | Official MySQL tool | Free |

**Suggested choices:** DBeaver for learning; Navicat or DataGrip for professional use.

### 1.4 Data Model

    ┌─────────────────────────────────────────────────┐
    │ MySQL server                                    │
    │ ┌─────────────────┐  ┌─────────────────┐        │
    │ │ Database db1    │  │ Database db2    │  ...   │
    │ │ ┌───────────┐   │  │ ┌───────────┐   │        │
    │ │ │ Table t1  │   │  │ │ Table t1  │   │        │
    │ │ ├───────────┤   │  │ ├───────────┤   │        │
    │ │ │ Table t2  │   │  │ │ Table t2  │   │        │
    │ │ └───────────┘   │  │ └───────────┘   │        │
    │ └─────────────────┘  └─────────────────┘        │
    └─────────────────────────────────────────────────┘

| Concept | Meaning | Analogy |
| ------------------- | -------- | --------- |
| **Database** | A container for related data | Folder |
| **Table** | A structured collection of records | Spreadsheet |
| **Row** | One record | Spreadsheet row |
| **Column** | A field or attribute | Spreadsheet column |
| **Primary key** | Uniquely identifies a record | Identification number |
| **Foreign key** | References another table | Department ID |

### 1.5 SQL Statement Categories

| Category | Full name | Purpose | Keywords |
| ------- | -------------------------- | ------ | -------------------- |
| **DDL** | Data Definition Language | Define structures | CREATE, ALTER, DROP |
| **DML** | Data Manipulation Language | Modify data | INSERT, UPDATE, DELETE |
| **DQL** | Data Query Language | Query data | SELECT |
| **DCL** | Data Control Language | Control access | GRANT, REVOKE |

***

## 2. DDL — Data Definition Language

### 2.1 Database Operations

```sql
-- Inspect
SHOW DATABASES;              -- List databases
SELECT DATABASE();           -- Show the current database

-- Create
CREATE DATABASE database_name;
CREATE DATABASE IF NOT EXISTS database_name;
CREATE DATABASE database_name DEFAULT CHARSET utf8mb4;

-- Select
USE database_name;

-- Drop
DROP DATABASE database_name;
DROP DATABASE IF EXISTS database_name;
```

### 2.2 Creating Tables

#### Data Types

**Numeric types:**

| Type | Storage | Signed range | Unsigned range | Typical use |
| ------------ | ------- | --------------- | --------------- | --------- |
| TINYINT | 1 byte | -128 to 127 | 0 to 255 | Small integers such as age |
| INT | 4 bytes | -2^31 to 2^31-1 | 0 to 2^32-1 | Standard integers such as IDs |
| BIGINT | 8 bytes | -2^63 to 2^63-1 | 0 to 2^64-1 | Large integers such as order IDs |
| DECIMAL(M,D) | Depends on precision/scale | Depends on M and D | Depends on M and D | Exact decimals such as monetary values |

> **UNSIGNED:** Stores zero and positive values only. For integer types, removing negative values doubles the available nonnegative range.

**String types:**

| Type | Size/limit | Description |
| ---------- | ---------- | -------------- |
| CHAR(N) | Up to 255 characters | **Fixed-length** string |
| VARCHAR(N) | Character capacity depends on encoding and the 65,535-byte row-size limit | **Variable-length** string |
| TEXT | Up to 65,535 bytes | Longer text |

> **CHAR vs VARCHAR:** Use CHAR for fixed-length values such as a fixed-format phone number, and VARCHAR for variable-length values such as names.

**Date/time types:**

| Type | Typical format | Description |
| --------- | --------------------- | -------- |
| DATE | YYYY-MM-DD | Date |
| DATETIME | YYYY-MM-DD HH\:MM\:SS | Date and time |
| TIMESTAMP | YYYY-MM-DD HH\:MM\:SS | Timestamp; automatic initialization/update can be configured |

#### Constraints and Column Attributes

| Attribute | Keyword | Meaning |
| --- | --------------- | ------------------------- |
| Primary key | PRIMARY KEY | Unique and non-null |
| Not null | NOT NULL | Reject NULL |
| Unique | UNIQUE | Enforce uniqueness |
| Default | DEFAULT | Default value |
| Foreign key | FOREIGN KEY | Reference another table |
| Auto-increment | AUTO_INCREMENT | Generate increasing values |
| Unsigned | UNSIGNED | Allow only nonnegative numeric values |

> **UNSIGNED use cases:** Values such as age, quantity, or prices that are designed to be nonnegative. Benefits include:
>
> 1. **A larger nonnegative integer range**, such as TINYINT increasing from a maximum of 127 to 255.
> 2. **Clearer intent:** The column is not intended to accept negative values.
> 3. **Range validation:** Out-of-range inserts are rejected in strict SQL mode.

#### Example Table Definition

```sql
CREATE TABLE employee (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT COMMENT 'Employee ID',
    emp_no VARCHAR(10) NOT NULL UNIQUE COMMENT 'Employee number',
    name VARCHAR(50) NOT NULL COMMENT 'Name',
    gender CHAR(1) DEFAULT '男' COMMENT 'Gender',
    age TINYINT UNSIGNED COMMENT 'Age, 0-255; nonnegative',
    phone CHAR(11) COMMENT 'Phone number',
    salary DECIMAL(10, 2) UNSIGNED COMMENT 'Salary; nonnegative',
    dept_id INT UNSIGNED COMMENT 'Department ID',
    hire_date DATE COMMENT 'Hire date',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time'
) COMMENT 'Employees';
```

```sql
-- Demonstrate UNSIGNED (strict SQL mode)
CREATE TABLE test_unsigned (
    age TINYINT UNSIGNED  -- Range: 0-255
);

INSERT INTO test_unsigned VALUES (25);   -- ✓ Accepted
INSERT INTO test_unsigned VALUES (255);  -- ✓ Accepted
INSERT INTO test_unsigned VALUES (-1);   -- ✗ Out of range
INSERT INTO test_unsigned VALUES (256);  -- ✗ Out of range
```

### 2.3 Inspecting, Altering, and Dropping Tables

#### Inspect

```sql
SHOW TABLES;              -- List tables
DESC table_name;          -- Describe columns
SHOW CREATE TABLE table_name;    -- Show the table definition
```

#### Alter

```sql
-- Rename a table
ALTER TABLE old_table_name RENAME TO new_table_name;

-- Add a column
ALTER TABLE table_name ADD column_name data_type [constraints];

-- Change a column type
ALTER TABLE table_name MODIFY column_name new_data_type;

-- Rename a column and change its type
ALTER TABLE table_name CHANGE old_column_name new_column_name data_type;

-- Drop a column
ALTER TABLE table_name DROP column_name;
```

#### Drop or Empty

```sql
DROP TABLE table_name;              -- Drop the table
DROP TABLE IF EXISTS table_name;    -- Drop it if it exists
TRUNCATE TABLE table_name;          -- Remove rows, retain structure, reset auto-increment
```

***

## 3. DML — Data Manipulation Language

### 3.1 INSERT

```sql
-- Insert selected columns
INSERT INTO table_name (column1, column2) VALUES (value1, value2);

-- Insert all columns
INSERT INTO table_name VALUES (value1, value2, ...);

-- Insert multiple rows
INSERT INTO table_name (column1, column2) VALUES
    (value1, value2),
    (value1, value2);
```

### 3.2 UPDATE

```sql
UPDATE table_name SET column1 = value1, column2 = value2 WHERE condition;

-- Example
UPDATE employee SET salary = 10000 WHERE name = '张三';
UPDATE employee SET salary = salary + 1000 WHERE dept_id = 1;
```

> ⚠️ Without WHERE, the statement updates **every row**.

### 3.3 DELETE

```sql
DELETE FROM table_name WHERE condition;

-- Example
DELETE FROM employee WHERE id = 5;
```

> ⚠️ Without WHERE, the statement deletes **every row**.

**DELETE vs TRUNCATE:**

|      | DELETE | TRUNCATE |
| ---- | ------ | -------- |
| Category | DML | DDL |
| WHERE condition allowed | ✓ | ✗ |
| Rollback available | ✓ | ✗ |
| Resets auto-increment | ✗ | ✓ |
| Typical speed | Slower | Faster |

***

## 4. DQL — Querying Data

### Overall Syntax

```sql
SELECT [DISTINCT] column_list [AS alias]
FROM table_name
[WHERE condition]
[GROUP BY grouping_columns]
[HAVING group_condition]
[ORDER BY sort_columns ASC|DESC]
[LIMIT offset, row_count];
```

**Logical processing order:** FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT

### 4.1 Basic Queries

```sql
SELECT * FROM employee;                            -- All columns
SELECT name, age, salary FROM employee;            -- Selected columns
SELECT name AS 'Name', salary 'Salary' FROM employee;  -- Aliases; AS is optional
SELECT DISTINCT dept_id FROM employee;             -- Remove duplicates
```

### 4.2 Filtering with WHERE

**Comparison operators:**

| Operator | Meaning |
| -------------------- | ------- |
| `=`, `<>`, `!=` | Equal / not equal |
| `>`, `>=`, `<`, `<=` | Greater/less comparisons |
| BETWEEN...AND... | Inclusive range |
| IN(...) | Membership in a list |
| LIKE | Pattern matching |
| IS NULL | Null test |

**LIKE wildcards:** % matches any number of characters; _ matches one character.

**Logical operators:** AND, OR, NOT

```sql
-- Filtering examples
SELECT * FROM employee WHERE age BETWEEN 25 AND 35;
SELECT * FROM employee WHERE dept_id IN (1, 2, 3);
SELECT * FROM employee WHERE name LIKE '张%';
SELECT * FROM employee WHERE email IS NULL;
SELECT * FROM employee WHERE age >= 25 AND salary >= 10000;
```

### 4.3 Aggregate Functions

| Function | Purpose |
| --------- | ---- |
| COUNT(*) | Count rows |
| SUM(column) | Sum |
| AVG(column) | Average |
| MAX(column) | Maximum |
| MIN(column) | Minimum |

```sql
SELECT COUNT(*) FROM employee;
SELECT AVG(salary), MAX(salary), MIN(salary) FROM employee;
```

### 4.4 Grouping with GROUP BY

```sql
SELECT columns FROM table_name GROUP BY grouping_columns [HAVING condition];
```

**WHERE vs HAVING:**

| Aspect | WHERE | HAVING |
| ------- | ----- | ------ |
| Logical timing | Before grouping | After grouping |
| Aggregate functions in the condition | ✗ | ✓ |

```sql
-- Employee count and average salary per department
SELECT dept_id, COUNT(*), AVG(salary)
FROM employee
GROUP BY dept_id;

-- Retain departments with more than five employees
SELECT dept_id, COUNT(*) AS num
FROM employee
GROUP BY dept_id
HAVING num > 5;
```

### 4.5 Sorting with ORDER BY

```sql
SELECT * FROM employee ORDER BY salary DESC;           -- Descending order
SELECT * FROM employee ORDER BY salary DESC, age ASC;  -- Multiple sort keys
```

### 4.6 Pagination with LIMIT

```sql
SELECT * FROM table_name LIMIT offset, row_count;
```

**Formula:** offset = (page number - 1) × page size

```sql
SELECT * FROM employee LIMIT 10;       -- Page 1, ten rows per page
SELECT * FROM employee LIMIT 10, 10;   -- Page 2
SELECT * FROM employee LIMIT 20, 10;   -- Page 3
```

> **Note:** LIMIT offset, size is useful for basic pagination, but a large offset causes **deep-pagination performance problems**: the database must scan and skip many rows before returning a small page, so later pages generally take longer.

### Combined Query Exercise

```sql
-- Select male employees aged 25-35 and group by department.
-- Count employees and calculate average salary; retain groups of at least three.
-- Sort by average salary descending and return the first five groups.

SELECT dept_id, COUNT(*) AS num, AVG(salary) AS avg_sal
FROM employee
WHERE age BETWEEN 25 AND 35 AND gender = '男'
GROUP BY dept_id
HAVING num >= 3
ORDER BY avg_sal DESC
LIMIT 5;
```

***

## 5. Indexes

### 5.1 What Is an Index?

An **index** is a data structure for **efficient retrieval**. Like a book's table of contents, it lets the database locate relevant data instead of inspecting every row.

| Aspect | Without an index | With a B+ tree index |
| ---------- | ---------------- | ------------------------- |
| **Lookup** | Scan the table and compare rows | Navigate the index to the matching entries |
| **Typical complexity** | O(n) | Approximately O(log n), depending on tree height |
| **Useful for** | Small tables or infrequent queries | Larger tables and WHERE/ORDER BY/JOIN operations |

> 💡 InnoDB normally uses **B+ tree indexes**. Leaf entries contain row data or primary-key values, supporting range scans and ordered access.

### 5.2 Index Types

| Type | Syntax/definition | Characteristics |
| -------------- | ------------------ | ------------------------ |
| **Primary key** | PRIMARY KEY | Unique, non-null; one primary key per table |
| **Unique index** | UNIQUE | Enforces uniqueness, supports multiple columns and nullable values |
| **Non-unique index** | INDEX / KEY | No uniqueness requirement; commonly used |
| **Full-text index** | FULLTEXT | Full-text search, including InnoDB support in MySQL 5.6+ |
| **Composite index** | Multiple indexed columns | Supports leftmost-prefix lookup |

### 5.3 Creating, Inspecting, and Dropping Indexes

#### Create

```sql
-- Define indexes when creating the table
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- Primary key
    phone VARCHAR(11) UNIQUE,                    -- Unique index
    name VARCHAR(50),
    INDEX idx_name (name),                        -- Non-unique index
    UNIQUE KEY uk_phone (phone)
);

-- Add indexes after table creation
ALTER TABLE table_name ADD INDEX index_name (column_name);
ALTER TABLE table_name ADD UNIQUE INDEX index_name (column_name);

-- Composite index
ALTER TABLE table_name ADD INDEX idx_ab (a, b, c);
```

#### Inspect

```sql
SHOW INDEX FROM table_name;
```

#### Drop

```sql
ALTER TABLE table_name DROP INDEX index_name;
-- Primary key
ALTER TABLE table_name DROP PRIMARY KEY;
```

### 5.4 Composite Indexes and the Leftmost Prefix

A **composite index** is ordered by its columns from left to right. Ordinary index lookups use a **contiguous leftmost prefix**. A useful design rule is **equality columns first, range columns later**: put equality predicates (`=`) before range predicates such as `>`, `<`, `BETWEEN`, and `LIKE 'x%'`. Columns after a range predicate generally cannot further narrow the same lookup range, although they may still help with filtering or covering queries.

For `INDEX idx_abc (a, b, c)`:

| Predicate | Standard lookup prefix usable? | Explanation |
| ------------------ | ---------- | ------------ |
| WHERE a = 1 | ✓ | a |
| WHERE a = 1 AND b = 2 | ✓ | a, b |
| WHERE a = 1 AND b = 2 AND c = 3 | ✓ | a, b, c |
| WHERE a = 1 AND b > 2 | ✓ | Equality on a, then range on b |
| WHERE a > 1 AND b = 2 | Partly | a defines the range; b may be checked as an additional filter |
| WHERE b = 2 | No ordinary leftmost-prefix lookup | Leading a is absent; other scan strategies may still apply |
| WHERE a = 1 AND c = 3 | Partly | a supplies the prefix; c may be checked as a filter |

### 5.5 Cases That Can Prevent Efficient Index Lookup

| Scenario | Explanation |
| ------------------ | ---------------------------- |
| **Function/expression on an indexed column** | YEAR(create_time)=2024 or id + 1 = 10 usually cannot use an ordinary index directly for that expression |
| **Implicit type conversion** | Comparing a VARCHAR phone column with a number, such as phone = 13800138000 |
| **Leading wildcard** | LIKE '%张' or LIKE '%张%' cannot use an ordinary prefix range lookup; LIKE '张%' can |
| **An OR branch lacks an index** | WHERE a = 1 OR b = 2 may trigger a table scan when b is unindexed |
| **Inequality/NOT predicates** | The optimizer sometimes prefers a table scan for <>, !=, NOT IN, or NOT LIKE |

> 💡 Use EXPLAIN to see the actual plan. Inspect type (such as ref/range versus ALL) and key (the selected index).

### 5.6 Indexes and Sorting

**Indexes can improve sorting as well as filtering.** When WHERE predicates and ORDER BY align with index order, MySQL can retrieve rows in order and avoid a separate sort.

| Scenario | Index ordering useful? | Explanation |
| ---- | -------------------- | ---- |
| WHERE status = 1 ORDER BY create_time, index (status, create_time) | ✓ | Equality fixes status, allowing ordered access by create_time |
| ORDER BY a, b, index (a, b) | ✓ | Sort keys follow index order |
| ORDER BY b, index (a, b) | Usually no | The leading column is not fixed |
| WHERE a > 1 ORDER BY b, index (a, b) | Usually limited | The range on a prevents a globally ordered scan by b alone |

**Example:**

```sql
-- Composite index already defined
ALTER TABLE order_info ADD INDEX idx_status_time_id (status, create_time, id);

-- Filtering and ordering can both benefit from the index
SELECT id, status, create_time
FROM order_info
WHERE status = 1
ORDER BY create_time, id;
```

When the index cannot supply the required order, MySQL performs an additional sort, commonly shown as Using filesort in EXPLAIN.

> **Note:** Better sorting does not eliminate deep-pagination costs. Skipping a large offset can still be expensive.

### 5.7 Benefits and Costs of Indexes

| Benefit | Cost |
| ---------------- | ------------------------ |
| Faster WHERE, ORDER BY, and GROUP BY operations | Disk and memory usage |
| More efficient JOINs | INSERT/UPDATE/DELETE must maintain indexes |
| Unique indexes enforce uniqueness | Too many indexes increase optimizer choices and maintenance |

**Guidance:** Index larger, frequently queried tables according to their queries. Small or write-heavy tables may need fewer indexes. Avoid isolated low-selectivity indexes, such as a gender-only index, without a demonstrated benefit.

***

## 6. Designing Related Tables

### 6.1 Relationships

| Relationship | Example | Implementation |
| ------- | ------- | --------- |
| **One-to-many** | Department–employee | Foreign key on the many side |
| **Many-to-many** | Student–course | Junction table with two foreign keys |
| **One-to-one** | User–user details | Foreign key plus UNIQUE |

### 6.2 Foreign Key Constraints

#### Database-Enforced vs Application-Enforced Relationships

| Aspect | Database foreign key | Application-enforced relationship |
| ----- | ------------------------------ | ------------------ |
| Definition | A FOREIGN KEY constraint maintained by the **database** | A reference field whose integrity is maintained by **application code** |
| Referential integrity | Enforced by the database | Must be enforced by the application |
| Cost | Constraint checks add work to writes | Avoids database foreign-key checks |
| Sharding | Difficult across independently deployed database servers | Can be managed in application logic |
| Flexibility | More constrained | More flexible |
| Typical use | Smaller projects or strict database-enforced integrity | Large distributed systems with application-managed integrity |

#### Database Foreign Keys

Declare a FOREIGN KEY so the database checks referential integrity:

```sql
-- Declare during table creation
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    dept_id INT,
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES department(id)
);

-- Add after table creation
ALTER TABLE employee
ADD CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES department(id);

-- Drop a foreign key
ALTER TABLE employee DROP FOREIGN KEY fk_emp_dept;
```

**Referential actions** control what happens to referencing rows when a parent row changes:

| Action | Behavior |
| --------- | -------------------- |
| CASCADE | Propagate parent deletion/key updates to child rows |
| SET NULL | Set referencing columns to NULL |
| RESTRICT | Reject the parent change while referencing rows exist (default) |
| NO ACTION | Equivalent to RESTRICT for InnoDB |

```sql
ALTER TABLE employee
ADD CONSTRAINT fk_emp_dept
FOREIGN KEY (dept_id) REFERENCES department(id)
ON UPDATE CASCADE ON DELETE SET NULL;
```

#### Application-Enforced Relationships

Keep a **reference column without a database foreign-key constraint**, and maintain integrity in application code:

```sql
-- Departments
CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

-- Employees: dept_id is an ordinary column without a FOREIGN KEY constraint
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    dept_id INT COMMENT 'Department ID; application-level reference to department.id'
    -- No FOREIGN KEY constraint is defined here.
);
```

**Application-level integrity check**, illustrated in Java:

```java
// Check for employees before deleting a department
public void deleteDept(Integer deptId) {
    // 1. Check whether this department has employees
    int count = employeeMapper.countByDeptId(deptId);
    if (count > 0) {
        throw new RuntimeException("Cannot delete a department that still has employees");
    }
    // 2. Delete the department
    deptMapper.deleteById(deptId);
}
```

#### Why Do Some Large Systems Prefer Application-Enforced Relationships?

1. **Avoid constraint-checking overhead.**
2. **Support sharding:** Database foreign keys cannot span independent database servers.
3. **Flexibility:** Data migration and cleanup are easier to coordinate.
4. **Decoupling:** Applications own relationship logic while the database stores data.

> 💡 **Alibaba Java Development Manual guidance:**
> [Mandatory in that guide] Avoid foreign-key constraints and cascading actions; enforce relationship rules in the application layer.

#### Choosing an Approach

| Scenario | Suggested approach |
| --------------- | --------- |
| Learning or small projects | Database foreign keys are an option |
| Large distributed applications | Consider application-managed relationships |
| Systems requiring strict database-enforced integrity | Consider database foreign keys |

### 6.3 Many-to-Many Example

```sql
-- Students
CREATE TABLE student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

-- Courses
CREATE TABLE course (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

-- Junction table
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

## 7. Queries Across Multiple Tables

### 7.1 Overview

Use multi-table queries when the required data comes from more than one table.

A **Cartesian product** contains every possible pair of rows from the two tables.

```sql
-- Listing two tables without a join condition produces a Cartesian product
SELECT * FROM employee, department;
-- If employee has 10 rows and department has 5,
-- the result has 10 × 5 = 50 rows, usually including unwanted combinations.
```

> ⚠️ Join conditions restrict the Cartesian combinations to the relationships required by the query.

### 7.2 Table Aliases

**Use table aliases** in multi-table queries to:

1. **Reduce repetition:** Replace long table names with short aliases.
2. **Avoid ambiguity:** Qualify columns with the same name in different tables.
3. **Support self-joins:** Distinguish multiple references to the same table.

```sql
-- Syntax: table_name [AS] alias; AS is optional
SELECT e.name, d.name
FROM employee AS e, department AS d;

-- AS may be omitted
SELECT e.name, d.name
FROM employee e, department d;
```

> ⚠️ Once a table reference has an alias, use that alias when qualifying its columns in the query.

### 7.3 Join Types at a Glance

Consider these two tables (the Chinese names below are sample data):

    employee                     department
    +----+------+---------+      +----+--------+
    | id | name | dept_id |      | id | name   |
    +----+------+---------+      +----+--------+
    | 1  | 张三 | 1       |      | 1  | 研发部 |
    | 2  | 李四 | 2       |      | 2  | 市场部 |
    | 3  | 王五 | NULL    |      | 3  | 财务部 |
    +----+------+---------+      +----+--------+
            ↑                           ↑
        Wang Wu (王五) has no department; Finance (财务部) has no employees

**Comparison:**

| Join | Meaning | Result |
| -------- | ---------------------------- | ---------------------- |
| **INNER JOIN** | Only matching row pairs | 张三–研发部, 李四–市场部 |
| **LEFT JOIN** | Matching pairs plus unmatched left rows | 张三–研发部, 李四–市场部, 王五–NULL |
| **RIGHT JOIN** | Matching pairs plus unmatched right rows | 张三–研发部, 李四–市场部, NULL–财务部 |
| **FULL OUTER JOIN** | Matching pairs and unmatched rows from both sides; no native MySQL FULL JOIN | All listed employees and departments |

**Illustration:**

        ┌─────────────────────────────┐
        │                 LEFT JOIN   │
        │  ┌─────────┐                │
        │  │ ████████│███████┐        │
        │  │ ████████│███████│        │
        │  │  LEFT   │ INNER │  RIGHT │
        │  │ ████████│███████│        │
        │  │ ████████│███████┘        │
        │  └─────────┘                │
        │  █ = Included rows          │
        └─────────────────────────────┘

        INNER JOIN: matching rows
        LEFT JOIN: all left rows, with any matching right rows
        RIGHT JOIN: all right rows, with any matching left rows

### 7.4 ON vs WHERE

Distinguish **join conditions** from **result filtering**:

| Clause | Purpose | Explanation |
| --------- | --------- | ---------------- |
| **ON** | Join condition | Determines which row pairs match |
| **WHERE** | Result filter | Restricts the rows retained by the query |

```sql
-- Relationship in ON; final filtering in WHERE
SELECT e.name, d.name AS dept_name
FROM employee e
LEFT JOIN department d ON e.dept_id = d.id   -- Relationship condition
WHERE e.age > 25;                             -- Filter

-- Moving a filter into ON changes outer-join results, even when the inner-join results would match.
SELECT e.name, d.name AS dept_name
FROM employee e
LEFT JOIN department d ON e.dept_id = d.id AND e.age > 25;
```

> 💡 ON determines matching; WHERE filters the result. Choose their placement according to the required outer-join behavior.

### 7.5 INNER JOIN

**Purpose:** Return row pairs that satisfy the join condition.

**Characteristics:**

*   Unmatched rows are omitted.
*   Employees without departments and departments without employees are omitted.

```sql
-- Explicit inner join (recommended for clarity)
-- INNER is optional: JOIN has the same meaning here
SELECT e.name, d.name AS dept_name
FROM employee e
INNER JOIN department d ON e.dept_id = d.id;

-- Equivalent form without INNER
SELECT e.name, d.name AS dept_name
FROM employee e
JOIN department d ON e.dept_id = d.id;

-- Implicit inner join using WHERE (older style)
SELECT e.name, d.name AS dept_name
FROM employee e, department d
WHERE e.dept_id = d.id;
```

**Result:**

    +------+-----------+
    | name | dept_name |
    +------+-----------+
    | 张三 | 研发部    |
    | 李四 | 市场部    |
    +------+-----------+
    -- Wang Wu (王五), who has no department, and Finance (财务部), which has no employees, are omitted.

### 7.6 OUTER JOIN

#### LEFT JOIN

**Purpose:** Keep every left-hand row, adding matching right-hand data. Missing right-hand values are NULL.

**Typical use:** List all employees and their departments, including employees without a department.

```sql
-- OUTER is optional
SELECT e.name, d.name AS dept_name
FROM employee e
LEFT JOIN department d ON e.dept_id = d.id;

-- Explicit OUTER form (less common)
SELECT e.name, d.name AS dept_name
FROM employee e
LEFT OUTER JOIN department d ON e.dept_id = d.id;
```

**Result:**

    +------+-----------+
    | name | dept_name |
    +------+-----------+
    | 张三 | 研发部    |
    | 李四 | 市场部    |
    | 王五 | NULL      |  ← Keep this employee; no matching department
    +------+-----------+

#### RIGHT JOIN

**Purpose:** Keep every right-hand row, adding matching left-hand data. Missing left-hand values are NULL.

**Typical use:** List all departments and their employees, including departments without employees.

```sql
SELECT e.name, d.name AS dept_name
FROM employee e
RIGHT JOIN department d ON e.dept_id = d.id;
```

**Result:**

    +------+-----------+
    | name | dept_name |
    +------+-----------+
    | 张三 | 研发部    |
    | 李四 | 市场部    |
    | NULL | 财务部    |  ← Keep this department; no matching employee
    +------+-----------+

> 💡 LEFT JOIN is more common because the main table is usually written on the left. A RIGHT JOIN can be rewritten by swapping table order and using LEFT JOIN.

### 7.7 Self-Joins

A **self-join** joins a table to itself, useful for hierarchies such as employee–manager or category–subcategory relationships.

Use separate aliases to distinguish the references to the same table.

```sql
-- Employee table, including manager_id
-- +----+------+------------+
-- | id | name | manager_id |
-- +----+------+------------+
-- | 1  | 老板 | NULL       |  -- The boss
-- | 2  | 张三 | 1          |
-- | 3  | 李四 | 1          |
-- | 4  | 王五 | 2          |
-- +----+------+------------+

-- Query employee and manager names
SELECT e.name AS 'Employee', m.name AS 'Manager'
FROM employee e
LEFT JOIN employee m ON e.manager_id = m.id;
```

**Result:**

    +----------+---------+
    | Employee | Manager |
    +----------+---------+
    | 老板     | NULL    |  ← The boss has no manager
    | 张三     | 老板    |
    | 李四     | 老板    |
    | 王五     | 张三    |
    +----------+---------+

### 7.8 Combining Results with UNION

UNION combines query results **vertically**, appending rows from one result to another.

```sql
SELECT column_list FROM table1
UNION [ALL]
SELECT column_list FROM table2;
```

| Keyword | Behavior |
| --------- | --------------- |
| UNION | Combine results and remove duplicate rows |
| UNION ALL | Combine results without deduplication; usually less work |

> ⚠️ The queries must return the same number of columns with compatible types.

```sql
-- Employees with salary > 10000 or age > 40, using UNION instead of OR
SELECT * FROM employee WHERE salary > 10000
UNION
SELECT * FROM employee WHERE age > 40;

-- Emulate a full outer join (MySQL has no native FULL JOIN)
SELECT e.name, d.name FROM employee e LEFT JOIN department d ON e.dept_id = d.id
UNION
SELECT e.name, d.name FROM employee e RIGHT JOIN department d ON e.dept_id = d.id;
```

### 7.9 Subqueries

A **subquery** is a SELECT nested inside another SQL statement.

#### Categories by Result Shape

| Type | Result | Common operators/use |
| ----- | ---- | ---------------------------- |
| Scalar | One value | =, >, <, >=, <= |
| Column | One column, multiple rows | IN, NOT IN, ANY, ALL |
| Row | One row, multiple columns | =, IN |
| Table | Multiple rows and columns | IN or a derived table |

#### Scalar Subquery

Returns one value, usable in WHERE, SELECT, or HAVING.

```sql
-- Employees in the R&D department ('研发部')
SELECT * FROM employee
WHERE dept_id = (SELECT id FROM department WHERE name = '研发部');
```

#### Column Subquery

Returns one column, commonly used with IN, ANY, or ALL.

```sql
-- Employees in R&D ('研发部') or Marketing ('市场部')
SELECT * FROM employee
WHERE dept_id IN (SELECT id FROM department WHERE name IN ('研发部', '市场部'));

-- Earns more than every R&D employee (ALL)
SELECT * FROM employee
WHERE salary > ALL (SELECT salary FROM employee WHERE dept_id = 1);

-- Earns more than at least one R&D employee (ANY)
SELECT * FROM employee
WHERE salary > ANY (SELECT salary FROM employee WHERE dept_id = 1);
```

#### Row Subquery

Returns one row for comparing several column values together.

```sql
-- Employees with the same salary and department as Zhang San ('张三')
SELECT * FROM employee
WHERE (salary, dept_id) = (SELECT salary, dept_id FROM employee WHERE name = '张三');
```

#### Table Subquery

Returns rows and columns that can be used as a derived table.

```sql
-- Employees hired after 2023-01-01 and their department details
SELECT e.*, d.name AS dept_name
FROM (SELECT * FROM employee WHERE hire_date > '2023-01-01') e
LEFT JOIN department d ON e.dept_id = d.id;
```

### 7.10 Multi-Table Query Reference

| Requirement | Approach |
| ------------- | ------------------ |
| Matching rows only | INNER JOIN / JOIN |
| Retain every left-hand row | LEFT JOIN |
| Retain every right-hand row | RIGHT JOIN |
| Relate rows in one table, such as a hierarchy | Self-join |
| Combine query results | UNION / UNION ALL |
| Use another query's result in a condition | Subquery |

***

## 8. Transactions

### 8.1 Concept

A **transaction** groups operations into a unit that either commits or rolls back together.

### 8.2 Transaction Commands

```sql
-- Begin a transaction
START TRANSACTION;
-- Or BEGIN;

-- Commit
COMMIT;

-- Roll back
ROLLBACK;
```

For operations such as a transfer, commit or rollback provides atomicity across several updates:

```sql
START TRANSACTION;
UPDATE account SET balance = balance - 1000 WHERE name = '张三';
UPDATE account SET balance = balance + 1000 WHERE name = '李四';
COMMIT;   -- Commit on success
-- ROLLBACK;  -- Roll back on failure
```

### 8.3 ACID Properties

| Property | Meaning |
| ------- | ------------ |
| **Atomicity** | All changes commit or roll back together |
| **Consistency** | Preserve valid database state |
| **Isolation** | Control the interaction of concurrent transactions |
| **Durability** | Committed changes persist |

### 8.4 Concurrency Anomalies

Concurrency anomalies concern **whether repeated reads are stable and whether intermediate, uncommitted state becomes visible** when transactions access the same data.

| Anomaly | Meaning | Example |
| ------------- | -------------------------- | -------------------------------- |
| **Dirty read** | Reads another transaction's uncommitted data | A rolls back, invalidating what B previously read |
| **Nonrepeatable read** | Re-reading the same row in one transaction yields a different value | A field changes between the first and second read |
| **Phantom read** | Repeating a predicate query yields a different matching set | Ten matching rows become eleven |

**Distinction:**

- **Dirty read:** Was the observed data committed?
- **Nonrepeatable read:** Did the value in the same row change?
- **Phantom read:** Did the set of matching rows change?

#### 1. Dirty Read Example

```sql
-- Transaction A
START TRANSACTION;
UPDATE account SET balance = 500 WHERE id = 1;

-- Transaction B (assume the isolation level allows it to see 500 here)
SELECT balance FROM account WHERE id = 1;

-- Transaction A rolls back
ROLLBACK;
```

If B reads the balance 500 before A commits, that is a **dirty read**.

#### 2. Nonrepeatable Read Example

```sql
-- Transaction A
START TRANSACTION;
SELECT balance FROM account WHERE id = 1;  -- First read: 1000

-- Transaction B
UPDATE account SET balance = 800 WHERE id = 1;
COMMIT;

-- Transaction A
SELECT balance FROM account WHERE id = 1;  -- Second read: 800
```

Two reads of the same row within transaction A return different values: a **nonrepeatable read**.

#### 3. Phantom Read Example

```sql
-- Transaction A
START TRANSACTION;
SELECT COUNT(*) FROM orders WHERE amount > 100;  -- First query: 10

-- Transaction B
INSERT INTO orders(id, amount) VALUES (101, 200);
COMMIT;

-- Transaction A
SELECT COUNT(*) FROM orders WHERE amount > 100;  -- Second query: 11
```

The same predicate returns a different matching set in transaction A: a **phantom read**.

### 8.5 Isolation Levels

An **isolation level** controls visibility between transactions. Stronger isolation generally provides stronger guarantees but can increase coordination costs.

| Isolation level | Dirty reads | Nonrepeatable reads | Phantoms allowed by the standard | Main characteristic |
| ----------------------- | :--: | :--------: | :--: | -------- |
| Read Uncommitted | ✓ | ✓ | ✓ | Weakest isolation; permits the most anomalies |
| Read Committed | ✗ | ✓ | ✓ | Reads committed data; a common database default |
| **Repeatable Read** | ✗ | ✗ | ✓ | Repeated reads of a row remain consistent |
| Serializable | ✗ | ✗ | ✗ | Strongest isolation; results equivalent to serial execution |

> MySQL InnoDB defaults to **Repeatable Read**.

#### 1. Understanding the Four Levels

| Level | Interpretation | Typical characteristics |
| -------- | -------- | -------- |
| **Read Uncommitted** | Can see another transaction's uncommitted data | Rarely appropriate for ordinary business operations |
| **Read Committed** | Sees only committed changes | Prevents dirty reads; the default in databases such as Oracle |
| **Repeatable Read** | Repeated row reads within a transaction remain consistent | InnoDB's default, balancing read consistency and concurrency |
| **Serializable** | Enforces serializable transaction outcomes | Strongest guarantees, often with more contention |

#### 2. Why InnoDB Uses Repeatable Read by Default

Useful properties of InnoDB's **Repeatable Read** include:

- Stronger repeat-read consistency than Read Committed.
- Less restrictive ordinary reads than Serializable.
- **MVCC** allows efficient concurrent nonlocking reads.
- **Gap locks** and **next-key locks** control phantoms in relevant locking-read scenarios.

#### 3. Inspecting and Setting Isolation

```sql
-- Inspect isolation
SELECT @@TRANSACTION_ISOLATION;

-- Set isolation
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

#### 4. Common Interview Follow-Ups

| Question | Answer |
| ---- | ---- |
| **Is stronger isolation always better?** | No. Stronger guarantees can increase contention and overhead. |
| **What is MySQL's default?** | InnoDB defaults to Repeatable Read. |
| **Does Repeatable Read eliminate every phantom scenario?** | The standard allows phantoms; InnoDB uses MVCC and locking differently for different operations. |

### 8.6 MVCC and Locking

**MVCC (Multi-Version Concurrency Control)** improves InnoDB's concurrent read performance by retaining versions of data so many reads need not acquire row locks.

#### 1. What MVCC Addresses

MVCC helps ensure that:

- Ordinary reads need not wait for writers in many cases.
- Writes need not block ordinary reads for long periods.
- Read Committed and Repeatable Read transactions see versions appropriate to their isolation level.

#### 2. Snapshot Reads and Current Reads

| Read type | Behavior | Examples |
| -------- | ---- | -------- |
| **Snapshot read** | Reads a visible version, usually without row locks | Ordinary SELECT |
| **Current/locking read** | Accesses current records and acquires locks | SELECT ... FOR UPDATE, UPDATE, DELETE |

#### 3. Read Committed vs Repeatable Read

| Isolation | Snapshot timing | Consequence |
| -------- | ------------ | -------- |
| **Read Committed** | Each consistent SELECT can see newly committed data | Successive queries in a transaction can differ |
| **Repeatable Read** | The first consistent read normally establishes the snapshot | Repeated ordinary reads are more stable |

#### 4. Why Phantom Prevention Also Involves Locks

MVCC mainly controls visibility for **ordinary reads**. For **current/locking reads**, locks are needed to restrict concurrent inserts into relevant ranges.

Common InnoDB locks:

| Lock | Purpose |
| --- | --- |
| **Record lock** | Locks an index record |
| **Gap lock** | Prevents insertion into a gap between indexed values |
| **Next-key lock** | Combines a record lock with a gap lock |

A useful distinction is:

- **Ordinary consistent queries:** Primarily rely on MVCC for visibility.
- **Locking reads, updates, and deletes:** Can use gap/next-key locking to control concurrent inserts, depending on isolation and access paths.

***

## 9. SQL Optimization and Performance

When requests or queries slow down, inspect **indexes, N+1 queries, and slow-query logs**. Indexes affect individual statements, N+1 multiplies database round trips, and logs identify slow SQL.

### 9.1 The N+1 Problem

The **N+1 problem** occurs when one query loads N parent records and each record triggers another query for related data, producing **1 + N SQL statements**. ORM lazy-loading inside a loop is a common cause.

| Aspect | Efficient approach | N+1 pattern |
| ---------- | ------------------ | --------------------- |
| **Query count** | One or a small fixed number | 1 + N, where N is the parent row count |
| **Typical pattern** | JOIN or eager/batch loading | Query related data once per parent inside a loop |
| **Impact** | Fewer round trips | More requests and slower endpoints |

**Problematic example:**

```sql
-- One query: load users
SELECT * FROM user WHERE dept_id = 1;
-- Assume it returns 100 rows

-- N queries: load orders for each user, once per loop iteration
SELECT * FROM order WHERE user_id = ?;  -- Executed 100 times
-- Total: 1 + 100 = 101 statements
```

**Approaches to reducing N+1:**

| Approach | Explanation |
| ------------ | ------------------------------------------ |
| **JOIN** | Fetch parent and related data together |
| **Eager fetching** | JPA @EntityGraph or JOIN FETCH; MyBatis joined or batched queries |
| **Batch IN query** | Load parent IDs, then fetch related rows in a batch |

The goal is to reduce **1+N queries to one or a small fixed number**.

### 9.2 Slow Queries

A **slow query** exceeds a configured execution-time threshold. MySQL's **slow-query log** helps locate bottlenecks for index changes, SQL rewrites, or reduced scanning.

| Concept | Explanation |
| -------------- | -------------------------------------- |
| **Slow-query log** | Records statements exceeding long_query_time |
| **Threshold** | Defaults to 10 seconds; can be lowered to 1 or 2 seconds |
| **Common causes** | Missing indexes, table scans, large results, locking, or complex joins/subqueries |

**Enable and inspect:**

```sql
-- Inspect whether logging is enabled and the threshold in seconds
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- Enable logging and set a two-second global default; restart resets nonpersistent settings
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

```bash
# Common Linux log location
# /var/lib/mysql/<hostname>-slow.log
# Or configure slow_query_log_file in my.cnf
```

**Workflow:** Enable logging → observe or load-test → identify slow statements → inspect EXPLAIN → adjust indexes/SQL and reduce large transactions or lock contention. Check the actual access type and chosen key rather than assuming an index is used.

### 9.3 Pagination and Deep Offsets

**Deep pagination** uses LIMIT offset, size with a large offset, requiring many rows to be scanned and skipped before a small page is returned.

| Query style | Example | Characteristics |
| -------- | ---- | ---- |
| **Shallow pagination** | LIMIT 0, 20 | Early pages are usually inexpensive |
| **Deep pagination** | LIMIT 100000, 20 | Many rows must be skipped |

#### 1. Why Deep Pagination Is Slow

Consider:

```sql
SELECT *
FROM order_info
WHERE supplier_id = 1001
ORDER BY id
LIMIT 100000, 20;
```

Rather than directly locating rows 100001–100020, the work is roughly:

    Filter rows using WHERE
        ↓
    Produce the ORDER BY order
        ↓
    Skip the first 100000 rows
        ↓
    Return the next 20 rows

Three common sources of cost are:

| Cause | Explanation |
| ---- | ---- |
| **Large offsets** | Many rows are processed even though few are returned |
| **Sorting** | ORDER BY may require a separate sort when index order is unsuitable |
| **Row lookups** | Secondary-index entries may require additional clustered-index reads to obtain complete rows, increasing random I/O |

#### 2. What Indexes Can and Cannot Fix

A suitable index improves pagination but does not remove all deep-offset costs.

| Indexes can help with | They do not eliminate |
| -------- | ---------------- |
| **Filtering** | The large offset itself |
| **Ordering** | Skipping many preceding rows |
| **Covering the query** | The cost of arbitrary jumps to distant pages |

For example, create this composite index:

```sql
ALTER TABLE order_info ADD INDEX idx_supplier_id_id (supplier_id, id);
```

The following query can then be optimized more effectively:

```sql
SELECT id
FROM order_info
WHERE supplier_id = 1001
ORDER BY id
LIMIT 100000, 20;
```

Even so, the database may still need to scan and skip many matching entries.

#### 3. Cursor/Seek Pagination

**Seek pagination** continues from the previous page's last sort key instead of using a page number and offset. It works well for sequential navigation over large datasets.

| Aspect | Offset pagination | Seek pagination |
| ------ | ------------- | -------- |
| **Positioning** | Skip N rows, then read | Continue after the last seen sort key |
| **Deep-page performance** | Typically worsens with larger offsets | More stable for sequential navigation |
| **Jump to an arbitrary page** | Supported | Not naturally supported |
| **Typical use** | Administrative tables and smaller results | Feeds, messages, and large sequential result sets |

```sql
-- Offset pagination
SELECT *
FROM order_info
WHERE supplier_id = 1001
ORDER BY id
LIMIT 100000, 20;

-- Seek pagination
SELECT *
FROM order_info
WHERE supplier_id = 1001
  AND id > 100000
ORDER BY id
LIMIT 20;
```

If the sort field is not unique, add a unique tie-breaker to keep ordering stable:

```sql
SELECT *
FROM order_info
WHERE supplier_id = 1001
  AND (create_time > '2026-03-31 10:00:00'
       OR (create_time = '2026-03-31 10:00:00' AND id > 12345))
ORDER BY create_time, id
LIMIT 20;
```

#### 4. Interactive Pagination Optimizations

Interactive pages prioritize response time and usability. Common approaches include:

| Approach | Explanation |
| ---- | ---- |
| **Prefer seek pagination** | Suitable for Next page and Load more interactions |
| **Design a composite index** | Align WHERE filtering with ORDER BY where possible |
| **Limit maximum page depth** | Prevent extremely deep offsets from overloading the database |
| **Fetch IDs first, then full rows** | Page through a covering index before loading complete records |
| **Narrow the result set** | Encourage filters instead of unbounded pagination |

**Fetch IDs first, then complete rows:**

```sql
-- Step 1: use a covering index to obtain the page's primary keys
SELECT id
FROM order_info
WHERE supplier_id = 1001
ORDER BY id
LIMIT 100000, 20;

-- Step 2: fetch complete rows by primary key
SELECT *
FROM order_info
WHERE id IN (......);
```

#### 5. Export Query Optimizations

Exports aim for **predictable, bounded batch processing**, not displaying a particular page number. Design them around batches rather than deep offsets.

| Approach | Explanation |
| ---- | ---- |
| **Batch by primary-key range** | Remember the last key and continue from it |
| **Batch by time window** | Useful for daily or monthly exports |
| **Asynchronous export jobs** | Run exports in the background while the UI polls status |
| **Write as data is fetched** | Avoid loading the full result into memory |
| **Control batch size** | Try 1000, 2000, or 5000 rows and adjust for database/JVM pressure |

```sql
-- Export one batch at a time
SELECT *
FROM order_info
WHERE supplier_id = 1001
  AND id > ?
ORDER BY id
LIMIT 1000;
```

After each batch, record its final id as the next batch's starting point.

***

## 10. Read/Write Splitting and Sharding

### 10.1 Read/Write Splitting

**Read/write splitting** routes writes to a primary and reads to replicas, using replication based on the binary log to synchronize data.

```
Writes → Primary (Master)
              ↓ Replication (binlog)
Reads  → Replicas (Slave 1, Slave 2, ...)
```

| Benefit | Caveat |
| ---- | -------- |
| Distributes read traffic and reduces primary load | Replication lag can expose stale data |
| Replicas scale read-heavy workloads | Writes remain limited by the primary |
| Relatively modest application changes | Reads requiring immediate consistency may need the primary |

> 💡 **Replication lag:** A read immediately after a write, such as checking a newly created order, may need primary routing to avoid stale replica results. Middleware such as ShardingSphere and MyCat provides routing mechanisms.

### 10.2 Why Shard Databases and Tables?

Read replicas address read load, but write load and growing table sizes can still create bottlenecks. At scales such as tens or hundreds of millions of rows, tables can face:

- Greater B+ tree height and additional I/O
- More index-maintenance work and lock contention
- Disk, CPU, or connection limits on one server
- Long backup and recovery times

> **Note:** Sharding adds substantial complexity. First improve indexing, slow queries, and read/write routing; consider sharding when those measures are insufficient.

### 10.3 Partitioning Dimensions

Splitting can be organized by **columns/business structure** or by **rows/data**:

| Dimension | Approach | Description | Goal |
| ---- | ---- | ---- | ---------- |
| **Columns/structure** | **Vertical table split** | Split a wide table into frequently and infrequently accessed columns | Smaller hot rows and lower I/O |
| **Business structure** | **Vertical database split** | Place domains such as orders, users, and products in separate databases | Decouple domains and distribute load |
| **Rows** | **Horizontal table split** | Distribute rows among identically structured tables in one database | Reduce each table's size |
| **Rows** | **Horizontal database split** | Distribute rows among databases on different machines | Exceed a single machine's capacity |

Horizontal table and database sharding are often combined; “database/table sharding” commonly refers to that combination.

**Vertical table split:**

```
Original order table (wide)
+----+---------+--------+--------+----------------------+
| id | user_id | amount | status | remark (large field) |
+----+---------+--------+--------+----------------------+

                        ↓ Vertical split

order (frequently accessed)     order_detail (less frequently accessed)
+----+---------+--------+        +----------+--------------------+
| id | user_id | amount |        | order_id | remark             |
+----+---------+--------+        +----------+--------------------+
```

**Horizontal split: distribute order rows by user_id % 4:**

```
order_0              order_1              order_2              order_3
user_id % 4 = 0      user_id % 4 = 1      user_id % 4 = 2      user_id % 4 = 3
```

### 10.4 Horizontal Sharding Strategies

Choose a **sharding key** and **routing rule**. Prefer a selective, stable key commonly included in queries, such as user ID or order ID; avoid frequently changing fields.

| Strategy | Rule | Benefit | Cost |
| ---- | ---- | ---- | ---- |
| **Modulo/hash sharding** | hash(sharding_key) % shard_count | Simple and generally even distribution | Resizing can require substantial migration |
| **Range sharding** | Divide key ranges, such as 0-9,999,999 and 10,000,000-19,999,999 | New ranges can be added without moving old data | Hot ranges can cause skew |
| **Consistent hashing** | Place shards and keys on a hash ring | Moves less data when capacity changes | More complex implementation |

### 10.5 Challenges Introduced by Sharding

| Challenge | Explanation | Common approach |
| ---- | ---- | ------------ |
| **Globally unique IDs** | Independent AUTO_INCREMENT sequences can collide | Snowflake or allocated ID ranges |
| **Cross-shard queries** | Sorting, grouping, aggregation, and joins may require result merging | Route by shard key; consider Elasticsearch for global queries |
| **Distributed transactions** | One local transaction cannot coordinate independent databases | Seata AT/TCC or message-driven eventual consistency |
| **Cross-shard pagination** | Fetching, merging, and sorting distant pages is expensive | Seek pagination, bounded depth, or Elasticsearch storage |
| **Resharding/migration** | Existing data must be moved when routing changes | Coordinated dual writes or blue/green migration |
| **SQL limitations** | Joins/subqueries without routing keys can be inefficient | Reduce cross-shard joins through domain design |

> **Globally unique IDs:** Plain independent auto-increment sequences are insufficient. **Snowflake** is a common approach combining timestamp, machine ID, and a sequence number to generate globally unique, roughly increasing IDs, which are favorable for B+ tree inserts.

### 10.6 Sharding Middleware

Middleware performs **SQL interception → parsing/routing → shard execution → result merging**, reducing the routing logic required in application code.

| Middleware | Deployment | Characteristics |
| ------ | ---- | ---- |
| **Apache ShardingSphere** | Client library or proxy | Read/write splitting, sharding, encryption, and a broad feature set |
| **MyCat** | Proxy | Established middleware with relatively complex configuration |

Two ShardingSphere integration styles:

| Style | Description | Typical use |
| -------- | ---- | -------- |
| **ShardingSphere-JDBC** | Java library; no separate proxy deployment | Java applications |
| **ShardingSphere-Proxy** | Standalone, language-independent service | Multiple languages/services sharing a proxy |

#### 6. When Indexes Alone Are Not Enough

An index does not by itself solve pagination problems in these cases:

| Scenario | Reason |
| ---- | ---- |
| **Jumping to a distant page** | Large offsets still require skipped entries |
| **Broad filters** | Many candidate rows may remain even with an index |
| **Unstable or incompatible sort order** | An additional sort may be needed |
| **Many selected columns** | Full-row lookups can remain expensive |

Pagination design therefore combines:

    Index design
        +
    Sort optimization
        +
    Pagination strategy
        +
    Separate designs for interactive pages and exports
