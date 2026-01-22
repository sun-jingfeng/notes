## 一、JDBC

### 1.1 介绍

**JDBC（Java Database Connectivity）** 是 Java 语言中用于连接和操作数据库的标准 API。

**核心概念：**

*   JDBC 是一套接口规范，由 `java.sql` 和 `javax.sql` 包提供
*   各数据库厂商提供具体的实现（驱动程序）
*   实现了 Java 程序与数据库的解耦

**核心组件：**

| 组件                  | 作用              |
| ------------------- | --------------- |
| `DriverManager`     | 管理数据库驱动，获取数据库连接 |
| `Connection`        | 代表与数据库的连接       |
| `Statement`         | 执行 SQL 语句       |
| `PreparedStatement` | 执行预编译 SQL（推荐）   |
| `ResultSet`         | 存储查询结果集         |

**编程步骤：**

    注册驱动 → 获取连接 → 创建Statement → 执行SQL → 处理结果 → 释放资源

***

### 1.2 入门程序

```java
import java.sql.*;

public class JDBCDemo {
    public static void main(String[] args) throws Exception {
        // 1. 注册驱动（MySQL 8.x 可省略，SPI 机制自动加载）
        Class.forName("com.mysql.cj.jdbc.Driver");

        // 2. 获取连接
        String url = "jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=UTC";
        Connection conn = DriverManager.getConnection(url, "root", "123456");

        // 3. 创建 Statement 对象
        Statement stmt = conn.createStatement();

        // 4. 执行 SQL
        String sql = "INSERT INTO user(name, age) VALUES('张三', 25)";
        int count = stmt.executeUpdate(sql);  // 返回受影响的行数
        System.out.println("影响了 " + count + " 行");

        // 5. 释放资源（后创建的先释放）
        stmt.close();
        conn.close();
    }
}
```

**JDBC URL 常用参数：**

| 参数                  | 说明             |
| ------------------- | -------------- |
| `useSSL`            | 是否使用 SSL 连接    |
| `serverTimezone`    | 服务器时区          |
| `characterEncoding` | 字符编码（推荐 utf-8） |
| `allowMultiQueries` | 是否允许执行多条 SQL   |

***

### 1.3 查询数据

```java
public class QueryDemo {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection(
            "jdbc:mysql://localhost:3306/mydb", "root", "123456");

        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT id, name, age FROM user");

        // 遍历结果集
        while (rs.next()) {
            int id = rs.getInt("id");           // 按列名获取
            String name = rs.getString("name");
            int age = rs.getInt(3);             // 按列索引获取（从1开始）
            System.out.println(id + " - " + name + " - " + age);
        }

        rs.close();
        stmt.close();
        conn.close();
    }
}
```

**ResultSet 常用方法：**

| 方法                 | 说明             |
| ------------------ | -------------- |
| `next()`           | 移动到下一行，返回是否有数据 |
| `getInt(列名/索引)`    | 获取 int 类型值     |
| `getString(列名/索引)` | 获取 String 类型值  |
| `getDouble(列名/索引)` | 获取 double 类型值  |
| `getDate(列名/索引)`   | 获取 Date 类型值    |

***

### 1.4 预编译 SQL

**为什么需要 PreparedStatement？**

*   防止 SQL 注入攻击
*   提高执行效率（SQL 预编译，参数可复用）

**SQL 注入示例：**

```java
// ⚠️ 危险！用户输入: "' OR '1'='1"
String sql = "SELECT * FROM user WHERE name='" + userInput + "'";
// 变成: SELECT * FROM user WHERE name='' OR '1'='1'  -- 绕过验证！
```

**使用 PreparedStatement：**

```java
public class PreparedStatementDemo {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection(url, user, pwd);

        // 使用 ? 作为占位符
        String sql = "SELECT * FROM user WHERE name = ? AND age = ?";
        PreparedStatement pstmt = conn.prepareStatement(sql);

        // 设置参数（索引从 1 开始）
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

### 1.5 事务与资源管理

#### 1.5.1 事务管理

JDBC 默认自动提交事务。手动管理事务可保证多条 SQL 的原子性：

```java
public class TransactionDemo {
    public static void main(String[] args) {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(url, user, pwd);
            
            // 1. 关闭自动提交（开启事务）
            conn.setAutoCommit(false);
            
            // 2. 执行多条 SQL
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
            
            // 3. 提交事务
            conn.commit();
            
        } catch (Exception e) {
            // 4. 回滚事务
            try { if (conn != null) conn.rollback(); } catch (SQLException ex) {}
            e.printStackTrace();
        } finally {
            // 5. 释放资源
            try { if (conn != null) conn.close(); } catch (SQLException ex) {}
        }
    }
}
```

| 方法                     | 说明          |
| ---------------------- | ----------- |
| `setAutoCommit(false)` | 关闭自动提交，开启事务 |
| `commit()`             | 提交事务        |
| `rollback()`           | 回滚事务        |

#### 1.5.2 资源管理最佳实践

使用 **try-with-resources** 自动关闭资源（推荐）：

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
        // 无需手动 close()，自动释放资源
    }
}
```

***

## 二、MyBatis

### 2.1 简介

**MyBatis** 是一款优秀的**持久层框架**，用于简化 JDBC 开发。

**特点：**

*   免除了几乎所有 JDBC 代码
*   自动设置参数和获取结果集
*   通过 XML 或注解配置 SQL
*   支持动态 SQL

**持久层框架对比：**

| 框架              | 特点                    |
| --------------- | --------------------- |
| JDBC            | 原生 API，代码繁琐           |
| MyBatis         | 半自动 ORM，灵活性高，需要写 SQL  |
| Hibernate / JPA | 全自动 ORM，无需写 SQL，学习成本高 |

**JDBC vs MyBatis：**

| 对比项      | JDBC           | MyBatis      |
| -------- | -------------- | ------------ |
| 代码量      | 大量重复代码         | 大幅减少         |
| 连接管理     | 手动管理           | 自动管理（连接池）    |
| SQL 编写   | 硬编码在 Java 中    | 独立在 XML / 注解 |
| 参数设置     | 手动 setXxx      | 自动映射         |
| 结果映射     | 手动遍历 ResultSet | 自动映射到对象      |
| SQL 注入防护 | 需手动防范          | 自动处理         |

***

### 2.2 快速入门

#### 2.2.1 项目结构

    src/main/
    ├── java/com/example/
    │   ├── Application.java              # 启动类
    │   ├── mapper/                       # 数据访问层
    │   │   └── UserMapper.java
    │   └── pojo/                         # 实体类
    │       └── User.java
    └── resources/
        ├── application.yml               # 配置文件
        └── mapper/
            └── UserMapper.xml            # XML 映射文件（可选）

#### 2.2.2 添加依赖

```xml
<dependencies>
    <!-- MyBatis Spring Boot Starter -->
    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>3.0.3</version>
    </dependency>

    <!-- MySQL 驱动 -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok（可选） -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <scope>provided</scope>
    </dependency>
    
    <!-- PageHelper 分页插件（可选） -->
    <dependency>
        <groupId>com.github.pagehelper</groupId>
        <artifactId>pagehelper-spring-boot-starter</artifactId>
        <version>2.1.0</version>
    </dependency>
</dependencies>
```

#### 2.2.3 配置文件

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/数据库名?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf-8
    username: root
    password: 密码

mybatis:
  type-aliases-package: com.example.pojo                    # 类型别名包
  mapper-locations: classpath:mapper/*.xml                  # XML 文件位置
  configuration:
    map-underscore-to-camel-case: true                      # 驼峰命名映射
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl   # SQL 日志输出
```

#### 2.2.4 启动类

```java
@SpringBootApplication
@MapperScan("com.example.mapper")  // 扫描 Mapper 接口包
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

#### 2.2.5 实体类

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Integer id;
    private String name;
    private Integer age;
}
```

**Lombok 常用注解：**

| 注解                    | 作用                                        |
| --------------------- | ----------------------------------------- |
| `@Data`               | 生成 getter/setter/toString/equals/hashCode |
| `@NoArgsConstructor`  | 生成无参构造                                    |
| `@AllArgsConstructor` | 生成全参构造                                    |
| `@Builder`            | 生成 Builder 模式代码                           |

#### 2.2.6 单元测试

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

### 2.3 参数处理

#### 2.3.1 #{} 和 \${} 的区别

| 占位符   | 特点                    | 适用场景          |
| ----- | --------------------- | ------------- |
| `#{}` | 预编译，防 SQL 注入，自动加引号    | ✅ 普通参数（推荐）    |
| `${}` | 字符串拼接，有 SQL 注入风险，不加引号 | ⚠️ 动态表名/列名/排序 |

**示例：**

```java
@Mapper
public interface UserMapper {
    
    // ✅ 使用 #{} - 安全
    @Select("SELECT * FROM user WHERE name = #{name}")
    User selectByName(String name);
    // 执行: SELECT * FROM user WHERE name = ?
    
    // ✅ 动态表名 - 必须使用 ${}（需做白名单校验）
    @Select("SELECT * FROM ${tableName} WHERE id = #{id}")
    User selectByTableAndId(@Param("tableName") String tableName, 
                            @Param("id") Integer id);
    
    // ✅ LIKE 查询 - 使用 #{} + CONCAT
    @Select("SELECT * FROM user WHERE name LIKE CONCAT('%', #{name}, '%')")
    List<User> selectByNameLike(String name);
}
```

#### 2.3.2 @Param 注解

Spring Boot 官方骨架项目默认启用 `-parameters` 编译参数，多参数时**可省略** `@Param`，但建议保留以增强可读性。

```java
// 单参数：可省略
@Select("SELECT * FROM user WHERE id = #{id}")
User selectById(Integer id);

// 多参数：建议加上 @Param
@Select("SELECT * FROM user WHERE name = #{name} AND age = #{age}")
User selectByNameAndAge(@Param("name") String name, @Param("age") Integer age);

// 对象参数：直接使用属性名
@Insert("INSERT INTO user(name, age) VALUES(#{name}, #{age})")
int insert(User user);

// 混合参数：必须使用 @Param
@Select("SELECT * FROM user WHERE name = #{user.name} AND status = #{status}")
List<User> selectByUserAndStatus(@Param("user") User user, @Param("status") Integer status);
```

***

### 2.4 SQL 映射（注解 vs XML）

#### 2.4.1 两种方式对比

| 对比项    | 注解方式                | XML 方式             |
| ------ | ------------------- | ------------------ |
| 适用场景   | 简单 CRUD，SQL 语句较短    | 复杂动态 SQL、多表查询、批量操作 |
| 可维护性   | SQL 与 Java 代码耦合     | SQL 与 Java 代码分离    |
| 动态 SQL | 支持有限（需用 `<script>`） | 完整支持               |
| IDE 支持 | 一般                  | 较好（MybatisX 插件）    |
| 推荐     | 简单查询                | 复杂业务               |

#### 2.4.2 XML 绑定规则

使用 XML 方式时，需遵循以下绑定规则：

| 规则        | 说明                                          |
| --------- | ------------------------------------------- |
| 同包同名      | `UserMapper.java` ↔ `UserMapper.xml`        |
| namespace | XML 的 namespace 必须是接口的全限定名                  |
| id 与方法名一致 | `<select id="selectById">` ↔ `selectById()` |

    UserMapper.java                         UserMapper.xml
    ┌─────────────────────────┐             ┌─────────────────────────────────────┐
    │ User selectById(Integer id); ◄────────► <select id="selectById">            │
    │ List<User> selectAll();      ◄────────► <select id="selectAll">             │
    └─────────────────────────┘             └─────────────────────────────────────┘
                                              namespace="com.example.mapper.UserMapper"

**XML 文件存放位置：**

    # 方式一：resources 目录下（推荐）
    src/main/resources/mapper/UserMapper.xml

    # 配置文件指定位置
    mybatis:
      mapper-locations: classpath:mapper/*.xml

**XML 文件基本结构：**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.mapper.UserMapper">
    <!-- SQL 语句 -->
</mapper>
```

#### 2.4.3 基本 CRUD

**Mapper 接口（通用）：**

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

**注解方式：**

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

**XML 方式：**

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

#### 2.4.4 主键返回

插入数据后获取自增主键。

**注解方式：**

```java
@Insert("INSERT INTO user(name, age) VALUES(#{name}, #{age})")
@Options(useGeneratedKeys = true, keyProperty = "id")
int insert(User user);
```

**XML 方式：**

```xml
<insert id="insert" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO user(name, age) VALUES(#{name}, #{age})
</insert>
```

**使用示例：**

```java
User user = new User(null, "张三", 25);
userMapper.insert(user);
System.out.println("生成的主键：" + user.getId());
```

#### 2.4.5 结果映射

当数据库字段名与实体属性名不一致时，需要配置结果映射。

> **提示：** 已开启驼峰映射（`map-underscore-to-camel-case: true`）时，`user_name` → `userName` 自动转换，无需手动映射。

**注解方式：**

```java
@Select("SELECT user_id, user_name, user_age FROM t_user")
@Results(id = "userResultMap", value = {
    @Result(column = "user_id", property = "id", id = true),
    @Result(column = "user_name", property = "name"),
    @Result(column = "user_age", property = "age")
})
List<User> selectAll();

// 复用映射
@Select("SELECT user_id, user_name, user_age FROM t_user WHERE user_id = #{id}")
@ResultMap("userResultMap")
User selectById(Integer id);
```

**XML 方式：**

```xml
<!-- 定义映射规则 -->
<resultMap id="userResultMap" type="User">
    <id column="user_id" property="id"/>
    <result column="user_name" property="name"/>
    <result column="user_age" property="age"/>
</resultMap>

<!-- 使用 resultMap -->
<select id="selectAll" resultMap="userResultMap">
    SELECT user_id, user_name, user_age FROM t_user
</select>

<select id="selectById" resultMap="userResultMap">
    SELECT user_id, user_name, user_age FROM t_user WHERE user_id = #{id}
</select>
```

#### 2.4.6 多表查询

##### 一对一关联（association）

**场景：** 查询用户及其所属部门（一个用户属于一个部门）

**实体类：**

```java
@Data
public class User {
    private Integer id;
    private String name;
    private Integer deptId;
    private Dept dept;  // 关联对象
}

@Data
public class Dept {
    private Integer id;
    private String name;
}
```

**XML 方式（推荐）：**

```xml
<resultMap id="userWithDeptMap" type="User">
    <id column="id" property="id"/>
    <result column="name" property="name"/>
    <result column="dept_id" property="deptId"/>
    <!-- 一对一关联 -->
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

**分步查询（延迟加载）：**

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

##### 一对多关联（collection）

**场景：** 查询部门及其下属员工（一个部门有多个员工）

**实体类：**

```java
@Data
public class Dept {
    private Integer id;
    private String name;
    private List<User> users;  // 关联集合
}
```

**XML 方式：**

```xml
<resultMap id="deptWithUsersMap" type="Dept">
    <id column="id" property="id"/>
    <result column="name" property="name"/>
    <!-- 一对多关联 -->
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

**分步查询：**

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

**延迟加载配置：**

```yaml
mybatis:
  configuration:
    lazy-loading-enabled: true        # 开启延迟加载
    aggressive-lazy-loading: false    # 关闭积极加载
```

#### 2.4.7 动态 SQL

动态 SQL 是 MyBatis 的强大功能，**XML 方式支持更完整**，注解方式需借助 `<script>` 标签。

##### if + where 条件查询

**注解方式：**

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

**XML 方式：**

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

> `<where>` 自动添加 WHERE 关键字，自动去除开头多余的 AND/OR

##### if + set 动态更新

**注解方式：**

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

**XML 方式：**

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

> `<set>` 自动添加 SET 关键字，自动去除末尾多余的逗号

##### choose / when / otherwise（XML 推荐）

类似 Java 的 switch-case：

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

##### trim 标签（XML 专属）

更灵活的前缀/后缀处理：

| 属性                | 说明          |
| ----------------- | ----------- |
| `prefix`          | 在内容前添加的前缀   |
| `suffix`          | 在内容后添加的后缀   |
| `prefixOverrides` | 去除内容开头的指定字符 |
| `suffixOverrides` | 去除内容结尾的指定字符 |

```xml
<!-- 用 trim 实现 where -->
<select id="selectByCondition" resultType="User">
    SELECT * FROM user
    <trim prefix="WHERE" prefixOverrides="AND | OR">
        <if test="name != null">AND name = #{name}</if>
        <if test="age != null">AND age = #{age}</if>
    </trim>
</select>

<!-- 用 trim 实现 set -->
<update id="updateSelective">
    UPDATE user
    <trim prefix="SET" suffixOverrides=",">
        <if test="name != null">name = #{name},</if>
        <if test="age != null">age = #{age},</if>
    </trim>
    WHERE id = #{id}
</update>
```

##### bind 标签（XML 专属）

创建变量绑定到上下文，常用于模糊查询：

```xml
<select id="selectByNameLike" resultType="User">
    <bind name="pattern" value="'%' + name + '%'"/>
    SELECT * FROM user WHERE name LIKE #{pattern}
</select>
```

> 相比 `CONCAT('%', #{name}, '%')`，bind 方式更简洁，且不依赖数据库函数

#### 2.4.8 批量操作（foreach）

| 属性           | 说明        |
| ------------ | --------- |
| `collection` | 要遍历的集合名   |
| `item`       | 元素变量名     |
| `index`      | 索引变量名     |
| `open`       | 开始时拼接的字符串 |
| `close`      | 结束时拼接的字符串 |
| `separator`  | 元素之间的分隔符  |

**collection 取值规则：**

| 参数类型          | collection 值          |
| ------------- | --------------------- |
| `List`        | `list` 或 `collection` |
| `Array`       | `array`               |
| `@Param` 指定名称 | 指定的名称                 |

##### 批量删除

**注解方式：**

```java
@Delete("<script>" +
        "DELETE FROM user WHERE id IN" +
        "<foreach collection='ids' item='id' open='(' separator=',' close=')'>" +
        "  #{id}" +
        "</foreach>" +
        "</script>")
int deleteByIds(@Param("ids") List<Integer> ids);
```

**XML 方式：**

```xml
<delete id="deleteByIds">
    DELETE FROM user WHERE id IN
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</delete>
```

##### 批量插入

**注解方式：**

```java
@Insert("<script>" +
        "INSERT INTO user(name, age) VALUES" +
        "<foreach collection='users' item='user' separator=','>" +
        "  (#{user.name}, #{user.age})" +
        "</foreach>" +
        "</script>")
int batchInsert(@Param("users") List<User> users);
```

**XML 方式：**

```xml
<insert id="batchInsert" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO user(name, age) VALUES
    <foreach collection="users" item="user" separator=",">
        (#{user.name}, #{user.age})
    </foreach>
</insert>
```

#### 2.4.9 SQL 片段复用（XML 专属）

```xml
<!-- 定义 SQL 片段 -->
<sql id="Base_Column_List">id, name, age, gender, create_time</sql>

<!-- 引用 SQL 片段 -->
<select id="selectAll" resultType="User">
    SELECT <include refid="Base_Column_List"/> FROM user
</select>

<select id="selectById" resultType="User">
    SELECT <include refid="Base_Column_List"/> FROM user WHERE id = #{id}
</select>
```

#### 2.4.10 XML 特殊字符处理

XML 中某些字符需要转义或使用 CDATA：

| 特殊字符 | 转义写法     | 说明  |
| ---- | -------- | --- |
| `<`  | `&lt;`   | 小于号 |
| `>`  | `&gt;`   | 大于号 |
| `&`  | `&amp;`  | 与符号 |
| `'`  | `&apos;` | 单引号 |
| `"`  | `&quot;` | 双引号 |

**方式一：使用转义字符**

```xml
<select id="selectByAge" resultType="User">
    SELECT * FROM user WHERE age &gt; #{minAge} AND age &lt; #{maxAge}
</select>
```

**方式二：使用 CDATA（推荐）**

```xml
<select id="selectByAge" resultType="User">
    <![CDATA[
        SELECT * FROM user WHERE age > #{minAge} AND age < #{maxAge}
    ]]>
</select>
```

> **注意：** CDATA 区块内不能使用动态 SQL 标签（如 `<if>`、`<where>` 等）

#### 2.4.11 常见错误排查

| 错误信息                                          | 原因            | 解决方案                 |
| --------------------------------------------- | ------------- | -------------------- |
| Invalid bound statement                       | XML 未正确绑定     | 检查 namespace、id、文件位置 |
| Could not find result map                     | resultMap 不存在 | 检查 resultMap id 是否正确 |
| Parameter 'xxx' not found                     | 参数名不匹配        | 使用 @Param 或检查参数名     |
| Error parsing SQL Mapper XML                  | XML 语法错误      | 检查 XML 格式、特殊字符转义     |
| Mapped Statements collection does not contain | 方法未映射         | 检查方法名与 XML 中 id 是否一致 |

***

### 2.5 分页查询（PageHelper）

#### 2.5.1 基本使用

**添加依赖：**

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>2.1.0</version>
</dependency>
```

**Mapper 接口：**

```java
@Mapper
public interface UserMapper {
    @Select("SELECT * FROM user")
    List<User> selectAll();
}
```

**调用示例：**

```java
// 1. 开启分页（必须在查询之前）
PageHelper.startPage(1, 10);

// 2. 执行查询（自动添加 LIMIT）
List<User> users = userMapper.selectAll();

// 3. 获取分页信息
PageInfo<User> pageInfo = new PageInfo<>(users);
System.out.println("总记录数：" + pageInfo.getTotal());
System.out.println("总页数：" + pageInfo.getPages());
System.out.println("当前页数据：" + pageInfo.getList());
```

**PageInfo 常用属性：**

| 属性         | 说明    |
| ---------- | ----- |
| `total`    | 总记录数  |
| `pages`    | 总页数   |
| `pageNum`  | 当前页码  |
| `pageSize` | 每页记录数 |
| `list`     | 当前页数据 |

#### 2.5.2 实现原理

PageHelper 基于 **MyBatis 插件机制（Interceptor）** 实现，核心流程如下：

    ┌─────────────────────────────────────────────────────────────────────┐
    │  1. PageHelper.startPage(pageNum, pageSize)                         │
    │     ↓                                                               │
    │  2. 将分页参数存入 ThreadLocal                                        │
    │     ↓                                                               │
    │  3. 执行 Mapper 查询方法                                              │
    │     ↓                                                               │
    │  4. PageInterceptor 拦截 Executor.query()                           │
    │     ↓                                                               │
    │  5. 从 ThreadLocal 获取分页参数                                       │
    │     ↓                                                               │
    │  ┌─────────────────────────────────────────────────────────────┐   │
    │  │ 6a. 执行 COUNT 查询：SELECT COUNT(*) FROM (原SQL) tmp_count    │   │
    │  │ 6b. 改写原 SQL，添加 LIMIT：原SQL LIMIT offset, pageSize       │   │
    │  └─────────────────────────────────────────────────────────────┘   │
    │     ↓                                                               │
    │  7. 清除 ThreadLocal 中的分页参数                                     │
    │     ↓                                                               │
    │  8. 返回分页结果（Page 对象，继承自 ArrayList）                         │
    └─────────────────────────────────────────────────────────────────────┘

**SQL 改写示例：**

```sql
-- 原始 SQL
SELECT * FROM user WHERE status = 1

-- PageHelper 改写后（MySQL）
-- 1. COUNT 查询
SELECT COUNT(*) FROM user WHERE status = 1

-- 2. 分页查询（假设 pageNum=2, pageSize=10）
SELECT * FROM user WHERE status = 1 LIMIT 10, 10
```

#### 2.5.3 注意事项

**1. startPage 必须紧跟查询方法**

```java
// ✅ 正确：startPage 紧跟查询
PageHelper.startPage(1, 10);
List<User> users = userMapper.selectAll();  // 分页生效

// ❌ 错误：中间有其他查询，分页被消费
PageHelper.startPage(1, 10);
userMapper.selectById(1);  // 分页在这里被消费了！
List<User> users = userMapper.selectAll();  // 分页不生效，全量查询
```

**2. 只对第一条查询生效**

```java
PageHelper.startPage(1, 10);
List<User> users = userMapper.selectAll();  // ✅ 分页生效
List<Dept> depts = deptMapper.selectAll();  // ❌ 分页不生效
```

**3. SQL 语句结尾不能加分号**

```java
// ❌ 错误：SQL 末尾有分号，拼接 LIMIT 后语法错误
@Select("SELECT * FROM user;")  // 拼接后变成: SELECT * FROM user; LIMIT 0, 10
List<User> selectAll();

// ✅ 正确：SQL 末尾不加分号
@Select("SELECT * FROM user")
List<User> selectAll();
```

**4. 推荐使用 try-finally 确保 ThreadLocal 清理**

```java
try {
    PageHelper.startPage(pageNum, pageSize);
    List<User> users = userMapper.selectAll();
    PageInfo<User> pageInfo = new PageInfo<>(users);
    // 处理结果...
} finally {
    PageHelper.clearPage();  // 确保清理
}
```

**5. 避免在循环中使用 startPage**

```java
// ❌ 错误：循环中使用会导致 ThreadLocal 堆积
for (Integer deptId : deptIds) {
    PageHelper.startPage(1, 10);
    List<User> users = userMapper.selectByDeptId(deptId);
}

// ✅ 正确：循环外处理或使用其他方案
```

**6. 不支持嵌套结果映射的分页**

```java
// ❌ 当使用 collection 嵌套映射时，COUNT 和实际结果可能不一致
// 建议：改用分步查询或手动分页
```

**7. 配置优化（application.yml）**

```yaml
pagehelper:
  helper-dialect: mysql                # 指定数据库方言
  reasonable: true                     # 分页合理化
  support-methods-arguments: true      # 支持通过方法参数传递分页参数
```

#### 2.5.4 常见问题

| 问题        | 原因                   | 解决方案                       |
| --------- | -------------------- | -------------------------- |
| 分页不生效     | startPage 与查询之间有其他查询 | 确保 startPage 紧跟目标查询        |
| total 为 0 | 查询语句有问题或数据为空         | 检查 SQL 和数据                 |
| SQL 语法错误  | SQL 末尾有分号            | 移除 SQL 语句末尾的分号             |
| 内存溢出      | pageSize 过大或未清理      | 限制 pageSize，使用 try-finally |
| 数据重复/缺失   | 排序不稳定                | 添加唯一字段排序（如 ORDER BY id）    |

***

### 2.6 特殊类型映射

#### 2.6.1 日期时间映射

**Java 日期类型与数据库类型对应：**

| Java 类型              | 数据库类型（MySQL）  | 说明      |
| -------------------- | ------------- | ------- |
| `java.util.Date`     | DATETIME/DATE | 传统日期类型  |
| `java.sql.Date`      | DATE          | 仅日期     |
| `java.sql.Timestamp` | DATETIME      | 日期时间    |
| `LocalDate`          | DATE          | Java 8+ |
| `LocalDateTime`      | DATETIME      | Java 8+ |
| `LocalTime`          | TIME          | Java 8+ |

**推荐使用 Java 8 日期类型：**

```java
@Data
public class User {
    private Integer id;
    private String name;
    private LocalDate birthday;        // 生日
    private LocalDateTime createTime;  // 创建时间
}
```

**MyBatis 3.4.5+ 已内置 Java 8 日期类型支持，无需额外配置。**

**JSON 序列化格式配置（application.yml）：**

```yaml
spring:
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: Asia/Shanghai
```

**或使用注解指定格式：**

```java
@Data
public class User {
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Shanghai")
    private LocalDate birthday;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Shanghai")
    private LocalDateTime createTime;
}
```

#### 2.6.2 枚举类型映射

**方式一：默认映射（枚举名称）**

```java
public enum Gender {
    MALE, FEMALE
}

@Data
public class User {
    private Integer id;
    private String name;
    private Gender gender;  // 数据库存储: "MALE" 或 "FEMALE"
}
```

**方式二：按序号映射（ordinal）**

```yaml
mybatis:
  configuration:
    default-enum-type-handler: org.apache.ibatis.type.EnumOrdinalTypeHandler
```

```java
// 数据库存储: 0 (MALE) 或 1 (FEMALE)
```

**方式三：自定义值映射（推荐）**

```java
public enum Gender {
    MALE(1, "男"),
    FEMALE(2, "女");
    
    private final Integer code;
    private final String desc;
    
    Gender(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
    
    public Integer getCode() { return code; }
    public String getDesc() { return desc; }
    
    // 根据 code 获取枚举
    public static Gender fromCode(Integer code) {
        for (Gender g : values()) {
            if (g.code.equals(code)) return g;
        }
        return null;
    }
}
```

**自定义 TypeHandler：**

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

**注册 TypeHandler：**

```yaml
mybatis:
  type-handlers-package: com.example.handler
```

**或在 XML 中指定：**

```xml
<result column="gender" property="gender" typeHandler="com.example.handler.GenderTypeHandler"/>
```

***

### 2.7 开发配置

#### 2.7.1 SQL 日志输出

```yaml
mybatis:
  configuration:
    # 开发阶段：标准输出
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
    # 生产环境：SLF4J 或关闭
    # log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
    # log-impl: org.apache.ibatis.logging.nologging.NoLoggingImpl
```

**日志输出示例：**

    ==>  Preparing: SELECT * FROM user WHERE id = ?
    ==> Parameters: 1(Integer)
    <==      Total: 1

#### 2.7.2 IDEA SQL 智能提示

1.  **配置数据库连接**：`View → Tool Windows → Database` → 添加 MySQL 连接
2.  **注入 SQL 语言**：光标放在 SQL 字符串上 → `Alt + Enter` → `Inject language` → **MySQL**
3.  **关联数据源**：`Alt + Enter` → `Language injection settings` → 选择数据源

#### 2.7.3 MybatisX 插件

IDEA 插件市场搜索 **MybatisX** 安装，主要功能：

| 功能              | 说明                            |
| --------------- | ----------------------------- |
| Mapper ↔ XML 跳转 | 点击小鸟图标快速跳转                    |
| 自动生成 SQL        | 根据方法名生成 SQL（如 `selectByName`） |
| XML 智能提示        | 表名、字段名自动补全                    |

**方法名关键字：**

| 关键字                       | 示例                    |
| ------------------------- | --------------------- |
| `select` / `find` / `get` | `selectByName`        |
| `insert` / `add`          | `insertSelective`     |
| `update`                  | `updateById`          |
| `delete`                  | `deleteById`          |
| `And` / `Or`              | `selectByNameAndAge`  |
| `Between` / `Like`        | `selectByAgeBetween`  |
| `OrderBy`                 | `selectAllOrderByAge` |

***

## 三、附录：常见问题排查

| 问题            | 可能原因                    | 解决方案                             |
| ------------- | ----------------------- | -------------------------------- |
| 找不到 Mapper    | 未配置扫描路径                 | 检查 `@MapperScan` 路径              |
| XML 绑定异常      | namespace/id 不匹配        | 检查 namespace 与接口全路径、id 与方法名      |
| 字段映射为 null    | 字段名不匹配                  | 开启驼峰映射或使用 resultMap              |
| SQL 不打印       | 未配置日志                   | 配置 `log-impl: StdOutImpl`        |
| 连接超时          | 数据库不可达                  | 检查地址、端口、用户名密码                    |
| 中文乱码          | 编码不一致                   | URL 添加 `characterEncoding=utf-8` |
| 参数绑定失败        | 多参数未指定名称                | 使用 `@Param` 注解                   |
| Bean 注入失败     | Mapper 未被 Spring 管理     | 添加 `@Mapper` 或配置 `@MapperScan`   |
| 分页不生效         | startPage 位置错误或 SQL 有分号 | 确保紧跟查询且 SQL 末尾无分号                |
| Invalid bound | XML 绑定错误                | 检查 mapper-locations 配置           |
| 日期格式错误        | 未配置序列化格式                | 添加 `@JsonFormat` 或全局配置           |
| 枚举映射错误        | 未配置 TypeHandler         | 使用自定义 TypeHandler                |

