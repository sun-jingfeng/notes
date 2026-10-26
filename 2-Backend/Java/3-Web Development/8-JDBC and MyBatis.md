## I. JDBC

### 1.1 Introduction

**JDBC (Java Database Connectivity)** is Java's standard API for connecting to and working with databases.

**Core concepts:**

*   JDBC defines APIs in the `java.sql` and `javax.sql` packages.
*   Database vendors supply implementations called drivers.
*   The API separates Java application code from database-specific driver implementations.

**Core components:**

| Component | Purpose |
| ------------------- | --------------- |
| `DriverManager` | Locates drivers and obtains connections |
| `Connection` | Represents a database connection |
| `Statement` | Executes SQL |
| `PreparedStatement` | Executes parameterized/prepared SQL (recommended) |
| `ResultSet` | Provides access to query results |

**Workflow:**

    Load driver → Open connection → Create statement → Execute SQL → Process results → Close resources

***

### 1.2 First Example

```java
import java.sql.*;

public class JDBCDemo {
    public static void main(String[] args) throws Exception {
        // 1. Load the driver (modern MySQL drivers support automatic SPI discovery)
        Class.forName("com.mysql.cj.jdbc.Driver");

        // 2. Open a connection
        String url = "jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=UTC";
        Connection conn = DriverManager.getConnection(url, "root", "123456");

        // 3. Create a Statement
        Statement stmt = conn.createStatement();

        // 4. Execute SQL
        String sql = "INSERT INTO user(name, age) VALUES('张三', 25)";
        int count = stmt.executeUpdate(sql);  // Number of affected rows
        System.out.println("Affected rows: " + count);

        // 5. Close resources in reverse creation order
        stmt.close();
        conn.close();
    }
}
```

**Common JDBC URL parameters:**

| Parameter | Purpose |
| ------------------- | -------------- |
| `useSSL` | Whether to use an SSL connection |
| `serverTimezone` | Server time zone |
| `characterEncoding` | Character encoding, such as utf-8 |
| `allowMultiQueries` | Whether multiple statements may be executed together |

***

### 1.3 Querying Data

```java
public class QueryDemo {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection(
            "jdbc:mysql://localhost:3306/mydb", "root", "123456");

        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT id, name, age FROM user");

        // Iterate through the result set
        while (rs.next()) {
            int id = rs.getInt("id");           // Read by column name
            String name = rs.getString("name");
            int age = rs.getInt(3);             // Read by one-based column index
            System.out.println(id + " - " + name + " - " + age);
        }

        rs.close();
        stmt.close();
        conn.close();
    }
}
```

**Common ResultSet methods:**

| Method | Purpose |
| ------------------ | -------------- |
| `next()` | Move to the next row; return whether a row is available |
| `getInt(columnName/index)` | Read an int |
| `getString(columnName/index)` | Read a String |
| `getDouble(columnName/index)` | Read a double |
| `getDate(columnName/index)` | Read a Date |

***

### 1.4 Prepared Statements

**Why use PreparedStatement?**

*   Keep bound values separate from SQL syntax to prevent SQL injection.
*   Reuse parameterized SQL and potentially reduce repeated preparation work.

**SQL injection example:**

```java
// ⚠️ Unsafe user input: "' OR '1'='1"
String sql = "SELECT * FROM user WHERE name='" + userInput + "'";
// Produces: SELECT * FROM user WHERE name='' OR '1'='1' — bypasses the intended check.
```

**Using PreparedStatement:**

```java
public class PreparedStatementDemo {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection(url, user, pwd);

        // Use ? placeholders
        String sql = "SELECT * FROM user WHERE name = ? AND age = ?";
        PreparedStatement pstmt = conn.prepareStatement(sql);

        // Bind parameters using one-based indexes
        pstmt.setString(1, "张三");
        pstmt.setInt(2, 25);

        ResultSet rs = pstmt.executeQuery();
        while (rs.next()) {
            System.out.println(rs.getString("name"));
        }

        rs.close();
        pstmt.close();
        conn.close();
    }
}
```

***

### 1.5 Transactions and Resource Management

#### 1.5.1 Transactions

JDBC connections use auto-commit by default. Explicit transaction management provides atomicity across several statements:

```java
public class TransactionDemo {
    public static void main(String[] args) {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(url, user, pwd);

            // 1. Disable auto-commit
            conn.setAutoCommit(false);

            // 2. Execute several statements
            PreparedStatement pstmt1 = conn.prepareStatement(
                "UPDATE account SET balance = balance - ? WHERE id = ?");
            pstmt1.setDouble(1, 100);
            pstmt1.setInt(2, 1);
            pstmt1.executeUpdate();

            PreparedStatement pstmt2 = conn.prepareStatement(
                "UPDATE account SET balance = balance + ? WHERE id = ?");
            pstmt2.setDouble(1, 100);
            pstmt2.setInt(2, 2);
            pstmt2.executeUpdate();

            // 3. Commit
            conn.commit();

        } catch (Exception e) {
            // 4. Roll back
            try { if (conn != null) conn.rollback(); } catch (SQLException ex) {}
            e.printStackTrace();
        } finally {
            // 5. Release resources
            try { if (conn != null) conn.close(); } catch (SQLException ex) {}
        }
    }
}
```

| Method | Purpose |
| ---------------------- | ----------- |
| `setAutoCommit(false)` | Disable auto-commit for explicit transaction boundaries |
| `commit()` | Commit the transaction |
| `rollback()` | Roll back the transaction |

#### 1.5.2 Resource Management

Use **try-with-resources** to close resources automatically:

```java
public class BestPracticeDemo {
    public static void main(String[] args) {
        String sql = "SELECT * FROM user WHERE id = ?";

        try (Connection conn = DriverManager.getConnection(url, user, pwd);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, 1);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    System.out.println(rs.getString("name"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        // No manual close() calls are needed
    }
}
```

***

## II. MyBatis

### 2.1 Introduction

**ORM (Object–Relational Mapping)** maps objects in application code to relational database structures.

**Core idea:** Work with objects at the application layer while the persistence framework coordinates parameters, SQL execution, and result conversion.

| Mapping | Object-oriented representation | Relational representation |
| -------------- | ------------ | ---------------- |
| **Structure** | Classes and objects | Tables and rows |
| **Properties** | Fields and properties | Columns and values |
| **Relationships** | References and collections | Keys and one-to-many relationships |

**MyBatis** is a persistence framework often described as a **SQL-oriented or semi-automatic ORM**, reducing JDBC boilerplate.

MyBatis handles parameter binding, result mapping, and execution, while developers write the SQL explicitly. This gives direct control over complex queries and SQL performance.

**Features:**

*   Removes most repetitive JDBC code
*   Binds parameters and maps results
*   Defines SQL in XML or annotations
*   Supports dynamic SQL

**Execution path:**

    Invoke a Mapper interface method
        ↓
    MyBatis finds SQL in XML or annotations
        ↓
    Bind parameters to a PreparedStatement
        ↓
    Execute SQL
        ↓
    Map the ResultSet to Java objects
        ↓
    Return results to the business layer

**Persistence approaches:**

| Approach | Characteristics |
| --------------- | --------------------- |
| JDBC | Low-level API with substantial boilerplate |
| MyBatis | Explicit SQL with automated binding and mapping |
| Hibernate / JPA | More object-oriented persistence and generated SQL; broader learning curve |

**JDBC vs MyBatis:**

| Aspect | JDBC | MyBatis |
| -------- | -------------- | ------------ |
| Boilerplate | Substantial | Significantly reduced |
| Connections | Managed directly by application code | Managed through framework integration/data sources |
| SQL location | Java strings | XML or annotations |
| Parameter binding | Manual setXxx calls | Automatic mapping |
| Result mapping | Iterate ResultSet manually | Map to objects |
| SQL injection | Use safe parameter binding explicitly | #{} binds values safely; ${} still requires caution |

***

### 2.2 Getting Started

#### 2.2.1 Project Layout

    src/main/
    ├── java/com/example/
    │   ├── Application.java              # Application entry point
    │   ├── mapper/                       # Data access
    │   │   └── UserMapper.java
    │   └── pojo/                         # Data classes
    │       └── User.java
    └── resources/
        ├── application.yml               # Configuration
        └── mapper/
            └── UserMapper.xml            # Optional XML mapper

#### 2.2.2 Dependencies

```xml
<dependencies>
    <!-- MyBatis Spring Boot Starter -->
    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>3.0.3</version>
    </dependency>

    <!-- MySQL driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok (optional) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <scope>provided</scope>
    </dependency>

    <!-- PageHelper pagination plugin (optional) -->
    <dependency>
        <groupId>com.github.pagehelper</groupId>
        <artifactId>pagehelper-spring-boot-starter</artifactId>
        <version>2.1.0</version>
    </dependency>
</dependencies>
```

#### 2.2.3 Configuration

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/database_name?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf-8
    username: root
    password: your-password

mybatis:
  type-aliases-package: com.example.pojo                    # Type alias package
  mapper-locations: classpath:mapper/*.xml                  # XML mapper locations
  configuration:
    map-underscore-to-camel-case: true                      # Underscore-to-camel-case mapping
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl   # SQL logging
```

#### 2.2.4 Application Class

```java
@SpringBootApplication
@MapperScan("com.example.mapper")  // Scan Mapper interfaces
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

#### 2.2.5 Data Class

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements java.io.Serializable {
    private static final long serialVersionUID = 1L; // Needed by the default read/write cache example below
    private Integer id;
    private String name;
    private Integer age;
}
```

**Common Lombok annotations:**

| Annotation | Purpose |
| --------------------- | ----------------------------------------- |
| `@Data` | Generate accessors, toString, equals, and hashCode |
| `@NoArgsConstructor` | Generate a no-argument constructor |
| `@AllArgsConstructor` | Generate an all-arguments constructor |
| `@Builder` | Generate a builder API |

#### 2.2.6 Unit Test

```java
@SpringBootTest
class UserMapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    void testSelectAll() {
        List<User> users = userMapper.selectAll();
        users.forEach(System.out::println);
    }
}
```

***

### 2.3 Parameters

#### 2.3.1 #{} vs ${}

| Placeholder | Behavior | Typical use |
| ----- | --------------------- | ------------- |
| `#{}` | Binds a value through a prepared-statement parameter | ✅ Ordinary values (recommended) |
| `${}` | Inserts text directly, with SQL injection risk | ⚠️ Dynamic identifiers or ordering, after allowlist validation |

**Example:**

```java
@Mapper
public interface UserMapper {

    // ✅ #{} binds the value safely
    @Select("SELECT * FROM user WHERE name = #{name}")
    User selectByName(String name);
    // Executes: SELECT * FROM user WHERE name = ?

    // Dynamic table name through ${}; validate it against an allowlist first
    @Select("SELECT * FROM ${tableName} WHERE id = #{id}")
    User selectByTableAndId(@Param("tableName") String tableName,
                            @Param("id") Integer id);

    // LIKE query using #{} and CONCAT
    @Select("SELECT * FROM user WHERE name LIKE CONCAT('%', #{name}, '%')")
    List<User> selectByNameLike(String name);
}
```

#### 2.3.2 @Param

With the `-parameters` compiler option enabled, MyBatis can use actual parameter names, so `@Param` can sometimes be omitted. Explicit `@Param` remains useful for readability and stable mappings.

```java
// Single parameter: @Param can be omitted
@Select("SELECT * FROM user WHERE id = #{id}")
User selectById(Integer id);

// Multiple parameters: explicit @Param names are recommended
@Select("SELECT * FROM user WHERE name = #{name} AND age = #{age}")
User selectByNameAndAge(@Param("name") String name, @Param("age") Integer age);

// Object parameter: refer to its properties
@Insert("INSERT INTO user(name, age) VALUES(#{name}, #{age})")
int insert(User user);

// Mixed parameters: name them explicitly with @Param
@Select("SELECT * FROM user WHERE name = #{user.name} AND status = #{status}")
List<User> selectByUserAndStatus(@Param("user") User user, @Param("status") Integer status);
```

***

### 2.4 SQL Mapping: Annotations and XML

#### 2.4.1 Comparison

| Aspect | Annotations | XML |
| ------ | ------------------- | ------------------ |
| Typical use | Short, simple CRUD statements | Complex dynamic SQL, joins, and batches |
| Maintenance | SQL is embedded in Java | SQL is separate from Java |
| Dynamic SQL | Available through `<script>` or SQL provider classes | Native XML scripting support |
| IDE support | Basic | Richer support with tools such as MybatisX |
| Suggested use | Simple queries | More complex persistence logic |

#### 2.4.2 Binding XML to an Interface

For XML mappers, observe these conventions and binding rules:

| Rule | Explanation |
| --------- | ------------------------------------------- |
| Matching names | Conventionally `UserMapper.java` and `UserMapper.xml`; XML must be discovered by the configured loading mechanism |
| namespace | Must be the Mapper interface's fully qualified name |
| Statement id | `<select id="selectById">` maps to `selectById()` |

    UserMapper.java                         UserMapper.xml
    ┌──────────────────────────────┐        ┌────────────────────────────┐
    │ User selectById(Integer id); │ ◄────► │ <select id="selectById">   │
    │ List<User> selectAll();      │ ◄────► │ <select id="selectAll">    │
    └──────────────────────────────┘        └────────────────────────────┘
                                            namespace="com.example.mapper.UserMapper"

**XML mapper location:**

    # Put XML under resources (recommended)
    src/main/resources/mapper/UserMapper.xml

    # Configure its location
    mybatis:
      mapper-locations: classpath:mapper/*.xml

**Basic XML structure:**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.mapper.UserMapper">
    <!-- SQL statement -->
</mapper>
```

#### 2.4.3 Basic CRUD

**Shared Mapper interface:**

```java
@Mapper
public interface UserMapper {
    List<User> selectAll();
    User selectById(Integer id);
    int insert(User user);
    int update(User user);
    int deleteById(Integer id);
}
```

**Annotation form:**

```java
@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user")
    List<User> selectAll();

    @Select("SELECT * FROM user WHERE id = #{id}")
    User selectById(Integer id);

    @Insert("INSERT INTO user(name, age) VALUES(#{name}, #{age})")
    int insert(User user);

    @Update("UPDATE user SET name = #{name}, age = #{age} WHERE id = #{id}")
    int update(User user);

    @Delete("DELETE FROM user WHERE id = #{id}")
    int deleteById(Integer id);
}
```

**XML form:**

```xml
<mapper namespace="com.example.mapper.UserMapper">

    <select id="selectAll" resultType="User">
        SELECT * FROM user
    </select>

    <select id="selectById" resultType="User">
        SELECT * FROM user WHERE id = #{id}
    </select>

    <insert id="insert">
        INSERT INTO user(name, age) VALUES(#{name}, #{age})
    </insert>

    <update id="update">
        UPDATE user SET name = #{name}, age = #{age} WHERE id = #{id}
    </update>

    <delete id="deleteById">
        DELETE FROM user WHERE id = #{id}
    </delete>
</mapper>
```

#### 2.4.4 Returning Generated Keys

Retrieve an auto-generated key after inserting a row.

**Annotation form:**

```java
@Insert("INSERT INTO user(name, age) VALUES(#{name}, #{age})")
@Options(useGeneratedKeys = true, keyProperty = "id")
int insert(User user);
```

**XML form:**

```xml
<insert id="insert" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO user(name, age) VALUES(#{name}, #{age})
</insert>
```

**Usage:**

```java
User user = new User(null, "张三", 25);
userMapper.insert(user);
System.out.println("Generated primary key: " + user.getId());
```

#### 2.4.5 Result Mapping

Configure result mappings when database column names differ from Java property names.

> **Tip:** With `map-underscore-to-camel-case: true`, `user_name` maps to `userName` automatically.

**Annotation form:**

```java
@Select("SELECT user_id, user_name, user_age FROM t_user")
@Results(id = "userResultMap", value = {
    @Result(column = "user_id", property = "id", id = true),
    @Result(column = "user_name", property = "name"),
    @Result(column = "user_age", property = "age")
})
List<User> selectAll();

// Reuse a result mapping
@Select("SELECT user_id, user_name, user_age FROM t_user WHERE user_id = #{id}")
@ResultMap("userResultMap")
User selectById(Integer id);
```

**XML form:**

```xml
<!-- Define the mapping -->
<resultMap id="userResultMap" type="User">
    <id column="user_id" property="id"/>
    <result column="user_name" property="name"/>
    <result column="user_age" property="age"/>
</resultMap>

<!-- Use resultMap -->
<select id="selectAll" resultMap="userResultMap">
    SELECT user_id, user_name, user_age FROM t_user
</select>

<select id="selectById" resultMap="userResultMap">
    SELECT user_id, user_name, user_age FROM t_user WHERE user_id = #{id}
</select>
```

#### 2.4.6 Multi-Table Queries

##### Single-Object Association (association)

**Scenario:** Fetch a user and their department; each user belongs to one department.

**Data classes:**

```java
@Data
public class User {
    private Integer id;
    private String name;
    private Integer deptId;
    private Dept dept;  // Associated object
}

@Data
public class Dept {
    private Integer id;
    private String name;
}
```

**XML form (recommended):**

```xml
<resultMap id="userWithDeptMap" type="User">
    <id column="id" property="id"/>
    <result column="name" property="name"/>
    <result column="dept_id" property="deptId"/>
    <!-- Map the associated department object -->
    <association property="dept" javaType="Dept">
        <id column="d_id" property="id"/>
        <result column="d_name" property="name"/>
    </association>
</resultMap>

<select id="selectUserWithDept" resultMap="userWithDeptMap">
    SELECT u.id, u.name, u.dept_id, d.id AS d_id, d.name AS d_name
    FROM user u
    LEFT JOIN dept d ON u.dept_id = d.id
    WHERE u.id = #{id}
</select>
```

**Nested select with lazy loading:**

```xml
<resultMap id="userWithDeptLazyMap" type="User">
    <id column="id" property="id"/>
    <result column="name" property="name"/>
    <association property="dept" javaType="Dept"
                 select="com.example.mapper.DeptMapper.selectById"
                 column="dept_id"
                 fetchType="lazy"/>
</resultMap>

<select id="selectUserWithDeptLazy" resultMap="userWithDeptLazyMap">
    SELECT * FROM user WHERE id = #{id}
</select>
```

##### One-to-Many Association (collection)

**Scenario:** Fetch a department and its employees.

**Data classes:**

```java
@Data
public class Dept {
    private Integer id;
    private String name;
    private List<User> users;  // Associated collection
}
```

**XML form:**

```xml
<resultMap id="deptWithUsersMap" type="Dept">
    <id column="id" property="id"/>
    <result column="name" property="name"/>
    <!-- One-to-many collection -->
    <collection property="users" ofType="User">
        <id column="u_id" property="id"/>
        <result column="u_name" property="name"/>
    </collection>
</resultMap>

<select id="selectDeptWithUsers" resultMap="deptWithUsersMap">
    SELECT d.id, d.name, u.id AS u_id, u.name AS u_name
    FROM dept d
    LEFT JOIN user u ON d.id = u.dept_id
    WHERE d.id = #{id}
</select>
```

**Nested selects:**

```xml
<resultMap id="deptWithUsersLazyMap" type="Dept">
    <id column="id" property="id"/>
    <result column="name" property="name"/>
    <collection property="users" ofType="User"
                select="com.example.mapper.UserMapper.selectByDeptId"
                column="id"
                fetchType="lazy"/>
</resultMap>

<select id="selectDeptWithUsersLazy" resultMap="deptWithUsersLazyMap">
    SELECT * FROM dept WHERE id = #{id}
</select>
```

**Lazy-loading configuration:**

```yaml
mybatis:
  configuration:
    lazy-loading-enabled: true        # Enable lazy loading
    aggressive-lazy-loading: false    # Disable aggressive loading
```

#### 2.4.7 Dynamic SQL

MyBatis provides dynamic SQL scripting. XML is a natural fit; annotation-based statements can use `<script>` tags or SQL providers.

##### Conditional Queries with if and where

**Annotation form:**

```java
@Select("<script>" +
        "SELECT * FROM user" +
        "<where>" +
        "  <if test='name != null'>" +
        "    AND name LIKE CONCAT('%',#{name},'%')" +
        "  </if>" +
        "  <if test='age != null'>" +
        "    AND age = #{age}" +
        "  </if>" +
        "</where>" +
        "</script>")
List<User> selectByCondition(@Param("name") String name, @Param("age") Integer age);
```

**XML form:**

```xml
<select id="selectByCondition" resultType="User">
    SELECT * FROM user
    <where>
        <if test="name != null and name != ''">
            AND name LIKE CONCAT('%', #{name}, '%')
        </if>
        <if test="age != null">
            AND age = #{age}
        </if>
    </where>
</select>
```

> `<where>` adds `WHERE` when needed and removes a leading `AND`/`OR`.

##### Conditional Updates with if and set

**Annotation form:**

```java
@Update("<script>" +
        "UPDATE user" +
        "<set>" +
        "  <if test='name != null'>name=#{name},</if>" +
        "  <if test='age != null'>age=#{age},</if>" +
        "</set>" +
        "WHERE id = #{id}" +
        "</script>")
int updateSelective(User user);
```

**XML form:**

```xml
<update id="updateSelective">
    UPDATE user
    <set>
        <if test="name != null">name = #{name},</if>
        <if test="age != null">age = #{age},</if>
    </set>
    WHERE id = #{id}
</update>
```

> `<set>` adds `SET` and removes a trailing comma.

##### choose / when / otherwise

Similar to Java switch-case:

```xml
<select id="selectByCondition" resultType="User">
    SELECT * FROM user
    <where>
        <choose>
            <when test="id != null">AND id = #{id}</when>
            <when test="name != null">AND name = #{name}</when>
            <otherwise>AND status = 1</otherwise>
        </choose>
    </where>
</select>
```

##### trim

Flexible prefix/suffix handling:

| Attribute | Purpose |
| ----------------- | ----------- |
| `prefix` | Add a prefix before the generated content |
| `suffix` | Add a suffix after the generated content |
| `prefixOverrides` | Remove matching leading tokens |
| `suffixOverrides` | Remove matching trailing tokens |

```xml
<!-- Implement where with trim -->
<select id="selectByCondition" resultType="User">
    SELECT * FROM user
    <trim prefix="WHERE" prefixOverrides="AND | OR">
        <if test="name != null">AND name = #{name}</if>
        <if test="age != null">AND age = #{age}</if>
    </trim>
</select>

<!-- Implement set with trim -->
<update id="updateSelective">
    UPDATE user
    <trim prefix="SET" suffixOverrides=",">
        <if test="name != null">name = #{name},</if>
        <if test="age != null">age = #{age},</if>
    </trim>
    WHERE id = #{id}
</update>
```

##### bind

Bind a variable in the dynamic SQL context, often for LIKE patterns:

```xml
<select id="selectByNameLike" resultType="User">
    <bind name="pattern" value="'%' + name + '%'"/>
    SELECT * FROM user WHERE name LIKE #{pattern}
</select>
```

> Compared with `CONCAT('%', #{name}, '%')`, `<bind>` can express the pattern without relying on a database concatenation function.

#### 2.4.8 Batch Operations with `<foreach>`

| Attribute | Purpose |
| ------------ | --------- |
| `collection` | Collection to iterate |
| `item` | Element variable name |
| `index` | Index variable name |
| `open` | Prefix emitted before the iteration |
| `close` | Suffix emitted after the iteration |
| `separator` | Separator between items |

**Common collection names:**

| Parameter type | collection value |
| ------------- | --------------------- |
| `List` | `list` or `collection` |
| `Array`       | `array`               |
| Named with `@Param` | The specified name |

##### Batch Delete

**Annotation form:**

```java
@Delete("<script>" +
        "DELETE FROM user WHERE id IN" +
        "<foreach collection='ids' item='id' open='(' separator=',' close=')'>" +
        "  #{id}" +
        "</foreach>" +
        "</script>")
int deleteByIds(@Param("ids") List<Integer> ids);
```

**XML form:**

```xml
<delete id="deleteByIds">
    DELETE FROM user WHERE id IN
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</delete>
```

##### Batch Insert

**Annotation form:**

```java
@Insert("<script>" +
        "INSERT INTO user(name, age) VALUES" +
        "<foreach collection='users' item='user' separator=','>" +
        "  (#{user.name}, #{user.age})" +
        "</foreach>" +
        "</script>")
int batchInsert(@Param("users") List<User> users);
```

**XML form:**

```xml
<insert id="batchInsert" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO user(name, age) VALUES
    <foreach collection="users" item="user" separator=",">
        (#{user.name}, #{user.age})
    </foreach>
</insert>
```

#### 2.4.9 Reusable SQL Fragments in XML

```xml
<!-- Define a fragment -->
<sql id="Base_Column_List">id, name, age, gender, create_time</sql>

<!-- Include the fragment -->
<select id="selectAll" resultType="User">
    SELECT <include refid="Base_Column_List"/> FROM user
</select>

<select id="selectById" resultType="User">
    SELECT <include refid="Base_Column_List"/> FROM user WHERE id = #{id}
</select>
```

#### 2.4.10 Special Characters in XML

Escape XML special characters or use CDATA where appropriate:

| Character | Escaped form | Meaning |
| ---- | -------- | --- |
| `<` | `&lt;` | Less than |
| `>` | `&gt;` | Greater than |
| `&` | `&amp;` | Ampersand |
| `'` | `&apos;` | Single quote |
| `"` | `&quot;` | Double quote |

**Option 1: XML escapes**

```xml
<select id="selectByAge" resultType="User">
    SELECT * FROM user WHERE age &gt; #{minAge} AND age &lt; #{maxAge}
</select>
```

**Option 2: CDATA**

```xml
<select id="selectByAge" resultType="User">
    <![CDATA[
        SELECT * FROM user WHERE age > #{minAge} AND age < #{maxAge}
    ]]>
</select>
```

> **Note:** Dynamic SQL tags such as `<if>` and `<where>` are treated as plain text inside CDATA, so keep those tags outside the CDATA section.

#### 2.4.11 Troubleshooting

| Error | Cause | Resolution |
| --------------------------------------------- | ------------- | -------------------- |
| Invalid bound statement | XML mapping not loaded/bound | Check namespace, id, and file discovery |
| Could not find result map | Missing resultMap | Check its id |
| Parameter 'xxx' not found | Parameter names do not match | Use `@Param` or correct the names |
| Error parsing SQL Mapper XML | Invalid XML | Check syntax and escaping |
| Mapped Statements collection does not contain | Missing statement mapping | Match the method name with the statement id |

***

### 2.5 Caching

MyBatis caches query results to avoid repeated SQL execution and database access.

**Core idea:** Reuse a valid cached result when possible; query the database otherwise.

| Aspect | First-level cache | Second-level cache |
| -------------- | ----------------------------- | -------------------------------- |
| **Scope** | `SqlSession` | `Mapper` `namespace` |
| **Default** | Enabled | Requires mapper-level configuration |
| **Cross-session reuse** | No; scoped to one `SqlSession` | Yes; shared across `SqlSession`s |
| **Sharing** | Within the current session | Across sessions using the namespace cache |
| **Typical use** | Built-in session optimization | Used cautiously in production |

#### 1. First-Level Cache

The first-level cache belongs to a `SqlSession`. Repeating the same query in that session can reuse its result.

**Conditions for a cache hit:**

| Condition | Explanation |
| ---- | ---- |
| **Same `SqlSession`** | Different sessions have separate local caches |
| **Same statement and parameters** | SQL, parameters, and pagination criteria must match |
| **No intervening cache clear** | Explicit clearing removes reusable entries |
| **No invalidating write** | Inserts, updates, and deletes normally clear the local cache |

**Example:**

```java
@Test
void testFirstLevelCache() {
    try (SqlSession sqlSession = sqlSessionFactory.openSession()) {
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        // First query: access the database
        User user1 = mapper.selectById(1);

        // Same query again: reuse the session cache
        User user2 = mapper.selectById(1);

        System.out.println(user1 == user2);  // Usually true
    }
}
```

**Local cache invalidation:**

| Scenario | Explanation |
| ---- | ---- |
| **Insert/update/delete** | MyBatis clears the session cache to avoid reusing stale results |
| **`sqlSession.clearCache()`** | Explicitly clears the local cache |
| **`SqlSession` closes** | The session cache is discarded |
| **Different query criteria** | A different cache key is used |

#### 2. Second-Level Cache

The **second-level cache** is scoped to a `Mapper` namespace, so multiple `SqlSession`s can share its cached results.

**Requirements:**

| Condition | Explanation |
| ---- | ---- |
| **Global cache support enabled** | MyBatis `cacheEnabled` setting |
| **Mapper cache declared** | `<cache/>` in XML or `@CacheNamespace` |
| **`Serializable` cached data when required** | Default read/write cache handling normally requires `Serializable` |
| **Transaction/session completion** | Pending second-level entries are published on commit or an appropriate successful session close |

**Enable through XML:**

```yaml
mybatis:
  configuration:
    cache-enabled: true
```

```xml
<mapper namespace="com.example.mapper.UserMapper">
    <cache/>

    <select id="selectById" resultType="User">
        SELECT * FROM user WHERE id = #{id}
    </select>
</mapper>
```

**Example:**

```java
@Test
void testSecondLevelCache() {
    // First SqlSession
    try (SqlSession sqlSession1 = sqlSessionFactory.openSession()) {
        UserMapper mapper1 = sqlSession1.getMapper(UserMapper.class);
        mapper1.selectById(1);   // Query the database
        sqlSession1.commit();    // Publish pending second-level cache entries
    }

    // Second SqlSession
    try (SqlSession sqlSession2 = sqlSessionFactory.openSession()) {
        UserMapper mapper2 = sqlSession2.getMapper(UserMapper.class);
        mapper2.selectById(1);   // A second-level hit avoids another database query
    }
}
```

**Invalidation and consistency concerns:**

| Scenario | Explanation |
| ---- | ---- |
| **A mapped write in the namespace** | Invalidates that namespace's cache |
| **Strict consistency requirements** | Cached data may diverge from database changes outside that invalidation scope |
| **Data shared across services** | A process-local cache does not coordinate distributed writers |

#### 3. Query Order Across the Caches

    Start a query
        ↓
    Check the second-level cache when configured and eligible
        ↓
    On a miss, delegate to the executor's first-level SqlSession cache
        ↓
    On another miss, query the database
        ↓
    Store the result in the local cache and stage eligible second-level entries
        ↓
    Publish second-level entries on commit / appropriate session completion

#### 4. Practical Use

The **first-level cache** is a normal session-level optimization and usually needs little application-specific design.

The **second-level cache** is used more cautiously, especially in microservices, distributed systems, and highly concurrent applications:

| Concern | Explanation |
| ---- | ---- |
| **Consistency** | Coordinating invalidation after every relevant update is difficult |
| **Limited sharing** | Normally shared only within an application and a mapper namespace |
| **Debugging** | It can be hard to explain why SQL did not execute or why data is stale |
| **Alternatives** | Many systems use a centralized cache such as Redis |

> **Interview baseline:** First-level caching is `SqlSession`-scoped; second-level caching is `Mapper`-namespace-scoped and must be configured. Know the invalidation rules and why applications may instead use a centralized cache.

#### 5. Recommendations

| Scenario | Recommendation |
| ---- | ---- |
| **Ordinary CRUD** | Understand the local cache behavior |
| **Read-heavy monolith** | Evaluate second-level caching together with consistency requirements |
| **Distributed systems/microservices** | Centralized caches such as Redis are more common |
| **Interview preparation** | Understand scope, configuration, invalidation, and trade-offs |

***

### 2.6 Pagination with PageHelper

#### 2.6.1 Basic Usage

**Add the dependency:**

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>2.1.0</version>
</dependency>
```

**Mapper interface:**

```java
@Mapper
public interface UserMapper {
    @Select("SELECT * FROM user")
    List<User> selectAll();
}
```

**Calling it:**

```java
// 1. Set pagination before the intended query
PageHelper.startPage(1, 10);

// 2. Execute the query (pagination SQL is applied)
List<User> users = userMapper.selectAll();

// 3. Read pagination information
PageInfo<User> pageInfo = new PageInfo<>(users);
System.out.println("Total rows: " + pageInfo.getTotal());
System.out.println("Total pages: " + pageInfo.getPages());
System.out.println("Current page: " + pageInfo.getList());
```

**Common PageInfo properties:**

| Property | Meaning |
| ---------- | ----- |
| `total` | Total matching records |
| `pages` | Total pages |
| `pageNum` | Current page number |
| `pageSize` | Page size |
| `list` | Current page data |

#### 2.6.2 How It Works

PageHelper uses the **MyBatis plugin/interceptor mechanism**:

    ┌───────────────────────────────────────────────────────────────────────┐
    │ 1. PageHelper.startPage(pageNum, pageSize)                            │
    │    ↓                                                                  │
    │ 2. Store pagination parameters in ThreadLocal                         │
    │    ↓                                                                  │
    │ 3. Invoke the Mapper query                                            │
    │    ↓                                                                  │
    │ 4. PageInterceptor intercepts Executor.query()                        │
    │    ↓                                                                  │
    │ 5. Read pagination parameters from ThreadLocal                        │
    │    ↓                                                                  │
    │ ┌─────────────────────────────────────────────────────────────────┐   │
    │ │ 6a. Count query: SELECT COUNT(*) FROM (original SQL) tmp_count  │   │
    │ │ 6b. Apply pagination: original SQL LIMIT offset, pageSize       │   │
    │ └─────────────────────────────────────────────────────────────────┘   │
    │    ↓                                                                  │
    │ 7. Clear the ThreadLocal pagination parameters                        │
    │    ↓                                                                  │
    │ 8. Return a Page object, which extends ArrayList                      │
    └───────────────────────────────────────────────────────────────────────┘

**Rewritten SQL:**

```sql
-- Original SQL
SELECT * FROM user WHERE status = 1

-- PageHelper output for MySQL
-- 1. Count query
SELECT COUNT(*) FROM user WHERE status = 1

-- 2. Page query, assuming pageNum=2 and pageSize=10
SELECT * FROM user WHERE status = 1 LIMIT 10, 10
```

#### 2.6.3 Usage Notes

**1. Call startPage immediately before the intended query**

```java
// ✅ The intended query immediately follows startPage
PageHelper.startPage(1, 10);
List<User> users = userMapper.selectAll();  // Pagination applies

// ❌ Another query consumes the pagination settings first
PageHelper.startPage(1, 10);
userMapper.selectById(1);  // Pagination is consumed here
List<User> users = userMapper.selectAll();  // This query is not paginated
```

**2. It applies to the first eligible query**

```java
PageHelper.startPage(1, 10);
List<User> users = userMapper.selectAll();  // ✅ Paginated
List<Dept> depts = deptMapper.selectAll();  // Not paginated by the earlier startPage
```

**3. Avoid a trailing semicolon in mapped SQL**

```java
// ❌ A trailing semicolon can conflict with SQL pagination rewriting
@Select("SELECT * FROM user;")  // A simple suffix rewrite would produce: SELECT * FROM user; LIMIT 0, 10
List<User> selectAll();

// ✅ Leave off the trailing semicolon
@Select("SELECT * FROM user")
List<User> selectAll();
```

**4. Use try-finally when needed to guarantee ThreadLocal cleanup**

```java
try {
    PageHelper.startPage(pageNum, pageSize);
    List<User> users = userMapper.selectAll();
    PageInfo<User> pageInfo = new PageInfo<>(users);
    // Process results...
} finally {
    PageHelper.clearPage();  // Guarantee cleanup
}
```

**5. Avoid unnecessary pagination queries inside loops**

```java
// ❌ Repeated pagination in a loop adds queries; always ensure each startPage is consumed or cleared
for (Integer deptId : deptIds) {
    PageHelper.startPage(1, 10);
    List<User> users = userMapper.selectByDeptId(deptId);
}

// ✅ Prefer batch-oriented processing or another suitable approach
```

**6. Be careful with nested collection result mapping**

```java
// SQL row counts/page boundaries may not match the final grouped objects when using collection mappings.
// Consider separate queries or explicit pagination of parent records.
```

**7. Configuration options (application.yml)**

```yaml
pagehelper:
  helper-dialect: mysql                # Database dialect
  reasonable: true                     # Normalize out-of-range page requests
  support-methods-arguments: true      # Allow pagination arguments on methods
```

#### 2.6.4 Troubleshooting

| Problem | Cause | Resolution |
| --------- | -------------------- | -------------------------- |
| Pagination not applied | Another query runs after startPage first | Put the target query immediately after startPage |
| total is zero | Empty data or query issue | Check SQL and data |
| SQL syntax error | Trailing semicolon interferes with rewriting | Remove the trailing semicolon |
| Excessive memory use | Very large page size or inappropriate query/cleanup | Bound pageSize and use try-finally where needed |
| Duplicate/missing rows between pages | Unstable order | Include a unique ordering key such as id |

***

### 2.7 Special Type Mappings

#### 2.7.1 Dates and Times

**Java/MySQL type correspondence:**

| Java type | MySQL type | Meaning |
| -------------------- | ------------- | ------- |
| `java.util.Date` | DATETIME/DATE | Legacy date/time type |
| `java.sql.Date` | DATE | Date only |
| `java.sql.Timestamp` | DATETIME | Date and time |
| `LocalDate`          | DATE          | Java 8+ |
| `LocalDateTime`      | DATETIME      | Java 8+ |
| `LocalTime`          | TIME          | Java 8+ |

**Prefer Java 8 date/time types:**

```java
@Data
public class User {
    private Integer id;
    private String name;
    private LocalDate birthday;        // Birthday
    private LocalDateTime createTime;  // Creation time
}
```

**MyBatis 3.4.5+ includes Java 8 date/time handlers without an extra extension.**

**JSON formatting configuration (application.yml):**

```yaml
spring:
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: Asia/Shanghai
```

**Or specify formatting with annotations:**

```java
@Data
public class User {
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Shanghai")
    private LocalDate birthday;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Shanghai")
    private LocalDateTime createTime;
}
```

#### 2.7.2 Enums

**Option 1: Default mapping by enum name**

```java
public enum Gender {
    MALE, FEMALE
}

@Data
public class User {
    private Integer id;
    private String name;
    private Gender gender;  // Database value: MALE or FEMALE
}
```

**Option 2: Map by ordinal**

```yaml
mybatis:
  configuration:
    default-enum-type-handler: org.apache.ibatis.type.EnumOrdinalTypeHandler
```

```java
// Database value: 0 for MALE, 1 for FEMALE
```

**Option 3: Map a custom value (recommended)**

```java
public enum Gender {
    MALE(1, "Male"),
    FEMALE(2, "Female");

    private final Integer code;
    private final String desc;

    Gender(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public Integer getCode() { return code; }
    public String getDesc() { return desc; }

    // Resolve the enum from its code
    public static Gender fromCode(Integer code) {
        for (Gender g : values()) {
            if (g.code.equals(code)) return g;
        }
        return null;
    }
}
```

**Custom TypeHandler:**

```java
@MappedTypes(Gender.class)
public class GenderTypeHandler extends BaseTypeHandler<Gender> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i,
            Gender parameter, JdbcType jdbcType) throws SQLException {
        ps.setInt(i, parameter.getCode());
    }

    @Override
    public Gender getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return Gender.fromCode(rs.getInt(columnName));
    }

    @Override
    public Gender getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return Gender.fromCode(rs.getInt(columnIndex));
    }

    @Override
    public Gender getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return Gender.fromCode(cs.getInt(columnIndex));
    }
}
```

**Register the TypeHandler:**

```yaml
mybatis:
  type-handlers-package: com.example.handler
```

**Or select it in XML:**

```xml
<result column="gender" property="gender" typeHandler="com.example.handler.GenderTypeHandler"/>
```

***

### 2.8 Development Configuration

#### 2.8.1 SQL Logging

```yaml
mybatis:
  configuration:
    # Development: standard output
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
    # Production: SLF4J or disable SQL logging
    # log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
    # log-impl: org.apache.ibatis.logging.nologging.NoLoggingImpl
```

**Example output:**

    ==>  Preparing: SELECT * FROM user WHERE id = ?
    ==> Parameters: 1(Integer)
    <==      Total: 1

#### 2.8.2 SQL Completion in IDEA

1. **Configure a data source:** `View → Tool Windows → Database` → add a MySQL connection.
2. **Inject SQL language support:** Place the cursor in a SQL string → `Alt + Enter` → `Inject language` → MySQL.
3. **Associate a data source:** `Alt + Enter` → `Language injection settings` → choose the data source.

#### 2.8.3 MybatisX Plugin

Install **MybatisX** from IDEA's plugin marketplace. Features include:

| Feature | Description |
| --------------- | ----------------------------- |
| Mapper ↔ XML navigation | Jump using the gutter icon |
| SQL generation | Generate SQL from names such as `selectByName` |
| XML completion | Complete table and column names |

**Method-name keywords:**

| Keyword | Example |
| ------------------------- | --------------------- |
| `select` / `find` / `get` | `selectByName`        |
| `insert` / `add`          | `insertSelective`     |
| `update`                  | `updateById`          |
| `delete`                  | `deleteById`          |
| `And` / `Or`              | `selectByNameAndAge`  |
| `Between` / `Like`        | `selectByAgeBetween`  |
| `OrderBy`                 | `selectAllOrderByAge` |

***

## III. MyBatis-Plus

### 3.1 Introduction

**MyBatis-Plus** extends MyBatis and can work alongside existing Mapper interfaces and XML statements.

**Goal:** Reduce repeated single-table CRUD, query-condition construction, pagination, and common-field handling so application code can focus on business-specific SQL and logic.

**Core features:**

| Capability | Description |
| -------------- | ------------------------------------------ |
| **Generic CRUD** | Extend `BaseMapper` and `ServiceImpl` for standard single-table operations |
| **Condition builders** | Build predicates with `QueryWrapper` or `LambdaQueryWrapper` |
| **Pagination plugin** | Provides its own pagination support without PageHelper |
| **Code generation** | Generate entities, mappers, services, and controllers from tables |

**Relationship to MyBatis:**

| Aspect | MyBatis | MyBatis-Plus |
| ------------ | -------------- | ------------------------------- |
| **Role** | Persistence framework | Extension built on MyBatis |
| **Single-table CRUD** | Write SQL/XML | Inherit standard methods; still write custom SQL as needed |
| **SQL** | Explicit statements | Helpers for simple operations; Mapper statements for complex ones |

**Suitability:**

| Scenario | Fit | Explanation |
| ---- | --------------------- | ---- |
| **Frequent single-table CRUD** | ✅ Strong | Reduces repeated code |
| **Administrative applications** | ✅ Common | Frequent pagination, filters, and logical deletion |
| **Complex reports/joins** | ⚠️ Partial | Often combined with ordinary MyBatis XML |
| **Highly customized, performance-sensitive SQL** | ⚠️ Depends | Complex portions generally use explicit SQL |

> **Note:** MyBatis-Plus builds on MyBatis. Using its helpers for simple cases and MyBatis statements for complex cases is a common combination.

***

### 3.2 Dependencies and Configuration

**Dependency for Spring Boot 3:**

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
    <version>3.5.5</version>
</dependency>
```

> Spring Boot 2 uses `mybatis-plus-boot-starter`. MyBatis-Plus already includes MyBatis integration; ordinary Mapper/XML usage remains available without adding `mybatis-spring-boot-starter` again.

**Configuration: reuse Spring's data source settings and add MyBatis-Plus settings:**

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/database_name?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf-8
    username: root
    password: your-password

mybatis-plus:
  type-aliases-package: com.example.pojo
  mapper-locations: classpath:mapper/*.xml
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      id-type: auto
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0
```

> 💡 `@MapperScan("com.example.mapper")` still scans Mapper interfaces when using MyBatis-Plus.

**Common properties:**

| Property | Purpose |
| ------ | ---- |
| `map-underscore-to-camel-case` | Map underscore-separated column names to camel-case properties |
| `log-impl` | Select SQL logging |
| `id-type` | Primary-key generation strategy |
| `logic-delete-field` | Logical deletion field |

***

### 3.3 Pagination Plugin

MyBatis-Plus pagination uses an interceptor to rewrite SQL for page queries and counts.

**Configure the interceptor:**

```java
@Configuration
public class MybatisPlusConfig {

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
```

**Pagination example:**

```java
@Test
void testPage() {
    Page<User> page = new Page<>(1, 10);

    LambdaQueryWrapper<User> wrapper = Wrappers.<User>lambdaQuery()
            .eq(User::getStatus, 1)
            .orderByDesc(User::getCreateTime);

    Page<User> result = userMapper.selectPage(page, wrapper);

    System.out.println("Total rows: " + result.getTotal());
    System.out.println("Current page: " + result.getRecords());
}
```

| Component | Purpose |
| ---- | ---- |
| `Page<T>` | Page number, size, total, and records |
| `PaginationInnerInterceptor` | Intercept and rewrite pagination SQL |
| `selectPage` | Execute a conditional page query |

***

### 3.4 Mapper Layer: BaseMapper

Extending **`BaseMapper<Entity>`** gives a Mapper standard single-table CRUD methods without additional XML.

```java
@Mapper
public interface UserMapper extends BaseMapper<User> {
    // Inherited: insert, deleteById, updateById, selectById, selectList, selectPage, etc.
    // Add methods here and XML mappings for complex SQL.
}
```

**Common BaseMapper methods:**

| Method | Purpose |
| --------------- | -------------- |
| `insert(T entity)` | Insert one row |
| `deleteById(Serializable id)` | Delete by primary key |
| `updateById(T entity)` | Update by primary key |
| `selectById(Serializable id)` | Query by primary key |
| `selectList(Wrapper<T> wrapper)` | Query matching records |
| `selectPage(IPage<T> page, Wrapper<T> wrapper)` | Query a page of matching records |

***

### 3.5 Service Layer Conventions

**Typical structure:** Extend ServiceImpl for generic persistence operations and implement a custom service interface for business-specific methods.

**Responsibilities:**

| Component | Purpose |
| ---------- | ------------------------------------------ |
| **Custom interface** | Extends `IService<Entity>` and adds business methods |
| **Implementation** | Extends `ServiceImpl<Mapper, Entity>` and `implements` the custom interface |

The implementation inherits methods such as `save`, `getById`, `list`, `page`, `updateById`, and `removeById`, while implementing its own business methods.

**Custom interface extending IService:**

```java
public interface UserService extends IService<User> {
    // IService already supplies generic CRUD signatures
    // Declare only business-specific extensions here
    List<User> listByStatus(Integer status);
}
```

**Implementation extending ServiceImpl:**

```java
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Override
    public List<User> listByStatus(Integer status) {
        return lambdaQuery()
                .eq(User::getStatus, status)
                .orderByDesc(User::getCreateTime)
                .list();
    }
}
```

**The Controller injects the interface and calls generic or business methods:**

```java
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.getById(id);  // Generic method
    }

    @GetMapping("/status/{status}")
    public List<User> listByStatus(@PathVariable Integer status) {
        return userService.listByStatus(status);  // Business method
    }
}
```

**Key points:**

| Component | Explanation |
| ------------ | ------------------------------------------------ |
| **Interface** | Extends `IService<Entity>` for extension and replaceable implementations |
| **Implementation** | Extends `ServiceImpl<Mapper, Entity>` and implements the interface |
| **Generic operations** | Supplied by `ServiceImpl` |
| **Business logic** | Declared in the custom interface and implemented with queries such as `lambdaQuery()` |

***

### 3.6 Entity/Table Mapping

**Table name, primary key, fields, and logical deletion:**

```java
@Data
@TableName("sys_user")  // Explicit table name; the default uses the class naming convention
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private Integer status;
    private LocalDateTime createTime;

    @TableField(exist = false)  // Not a database column
    private String extra;

    @TableLogic  // Logical deletion
    private Integer deleted;
}
```

| Annotation | Purpose |
| ---------------- | ---------------------------- |
| `@TableName` | Specify the table name |
| `@TableId` | Primary key; `IdType.AUTO` uses database auto-increment |
| `@TableField` | Column mapping; `exist = false` excludes a nonpersistent field |
| `@TableLogic` | Marks the logical deletion field |

**Common ID strategies:**

| Strategy | Meaning |
| ---- | ---- |
| `IdType.AUTO` | Database auto-increment |
| `IdType.ASSIGN_ID` | Generate an ID using the configured identifier generator, normally Snowflake |
| `IdType.INPUT` | Application-supplied ID |

***

### 3.7 Condition Builders

Use **LambdaQueryWrapper** for ordinary predicates without hardcoded column-name strings:

```java
// Equivalent to: WHERE status = 1 AND name LIKE '%张%' ORDER BY create_time DESC
List<User> list = userService.lambdaQuery()
        .eq(User::getStatus, 1)
        .like(User::getName, "张")
        .orderByDesc(User::getCreateTime)
        .list();
```

**Common condition methods:**

| Method | Purpose |
| ---- | ---- |
| `eq` / `ne` | Equal / not equal |
| `gt` / `ge` / `lt` / `le` | Greater than, at least, less than, at most |
| `like` / `likeLeft` / `likeRight` | LIKE patterns |
| `in` | `IN` predicate |
| `orderByAsc` / `orderByDesc` | Sorting |

**Dynamic conditions:**

```java
public List<User> listUsers(String name, Integer status) {
    LambdaQueryWrapper<User> wrapper = Wrappers.<User>lambdaQuery()
            .like(name != null && !name.isBlank(), User::getName, name)
            .eq(status != null, User::getStatus, status)
            .orderByDesc(User::getCreateTime);

    return userMapper.selectList(wrapper);
}
```

For complex queries, use **`QueryWrapper`** or a Mapper method with XML.

***

### 3.8 Automatic Field Filling and Optimistic Locking

**Automatic filling** maintains shared fields such as creation/update timestamps and creator/updater IDs during inserts and updates.

**Entity fields:**

```java
@Data
public class User {
    private Long id;
    private String name;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @Version
    private Integer version;
}
```

**Field-fill handler:**

```java
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }
}
```

**Optimistic-locking plugin:**

```java
@Bean
public MybatisPlusInterceptor mybatisPlusInterceptor() {
    MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
    interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
    interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
    return interceptor;
}
```

| Mechanism | Purpose |
| ---- | ---- |
| `@TableField(fill = ...)` | Mark automatically filled fields |
| `MetaObjectHandler` | Implement fill logic |
| `@Version` | Mark the optimistic-lock version field |
| `OptimisticLockerInnerInterceptor` | Enable optimistic-lock interception |

***

### 3.9 Recommendations

| Question | Guidance |
| ---- | ---- |
| **Should every project use MyBatis-Plus?** | No; projects often combine its helpers with ordinary MyBatis mappings. |
| **When is it useful?** | Single-table CRUD, conditional queries, and administrative pagination. |
| **When should I write explicit MyBatis SQL?** | Complex joins, reports, custom statements, and performance tuning. |
| **How should I describe it in an interview?** | An enhancement layer on MyBatis, not a complete replacement. |

MyBatis-Plus reduces boilerplate. Keep explicit XML or annotation-based SQL where that makes complex business queries clearer and easier to control.

***

## IV. Troubleshooting Reference

| Problem | Possible cause | Resolution |
| ------------- | ----------------------- | -------------------------------- |
| Mapper not found | Scanning is missing | Check `@MapperScan` |
| XML binding failure | namespace/id mismatch | Match the interface name and method id |
| Null mapped fields | Column/property name mismatch | Enable camel-case mapping or define resultMap |
| No SQL logs | Logging not configured | Set `mybatis.configuration.log-impl`, e.g. `org.apache.ibatis.logging.stdout.StdOutImpl` |
| Connection timeout | Database is unreachable | Check address, port, and credentials |
| Garbled Chinese text | Encoding mismatch | Align encodings, including `characterEncoding=utf-8` where appropriate |
| Parameter binding failure | Ambiguous/missing parameter names | Use `@Param` |
| Bean injection failure | Mapper not registered with Spring | Add `@Mapper` or configure `@MapperScan` |
| Pagination not applied | Wrong startPage placement or incompatible SQL | Put it before the target query and omit trailing semicolons |
| Invalid bound statement | XML mapping not loaded correctly | Check mapper-locations |
| Unexpected date format | Serialization format not configured | Use `@JsonFormat` or suitable global configuration |
| Enum mapping failure | Missing/custom TypeHandler configuration | Register the appropriate TypeHandler |
