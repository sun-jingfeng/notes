## 一、Maven

### 1. 简介

**Maven** 是 Apache 基金会的开源项目，是一个**项目管理和构建工具**。

**核心功能：**

| 功能         | 说明                      |
| ---------- | ----------------------- |
| **依赖管理**   | 自动下载和管理项目所需的 jar 包      |
| **统一项目结构** | 提供标准化的项目目录结构            |
| **项目构建**   | 提供标准化的构建流程（编译、测试、打包、部署） |

**标准项目结构：**

    my-project/
    ├── pom.xml                  # Maven 配置文件（核心）
    ├── src/
    │   ├── main/
    │   │   ├── java/            # 主程序代码
    │   │   └── resources/       # 配置文件
    │   └── test/
    │       ├── java/            # 测试代码
    │       └── resources/       # 测试配置文件
    └── target/                  # 编译输出目录

***

### 2. 安装配置

**步骤 1：下载 Maven**

*   官网：<https://maven.apache.org/download.cgi>
*   下载 `apache-maven-3.9.x-bin.zip`

**步骤 2：解压并配置环境变量**

```bash
# Windows
MAVEN_HOME = C:\Program Files\apache-maven-3.9.6
Path 添加 = %MAVEN_HOME%\bin

# macOS/Linux（~/.zshrc 或 ~/.bashrc）
export MAVEN_HOME=/usr/local/apache-maven-3.9.6
export PATH=$MAVEN_HOME/bin:$PATH
```

**步骤 3：验证安装**

```bash
mvn -version
```

**步骤 4：配置本地仓库和镜像**

编辑 `conf/settings.xml`：

```xml
<settings>
    <!-- 本地仓库位置 -->
    <localRepository>D:/maven-repo</localRepository>
    
    <!-- 阿里云镜像 -->
    <mirrors>
        <mirror>
            <id>aliyun</id>
            <mirrorOf>central</mirrorOf>
            <name>阿里云镜像</name>
            <url>https://maven.aliyun.com/repository/public</url>
        </mirror>
    </mirrors>
</settings>
```

**IDEA Maven 配置：**

`File → Settings → Build Tools → Maven`

| 配置项                | 说明              |
| ------------------ | --------------- |
| Maven home path    | Maven 安装目录      |
| User settings file | settings.xml 位置 |
| Local repository   | 本地仓库位置          |

***

### 3. 项目管理

#### 3.1 创建项目

**IDEA 创建：**

1.  `File → New → Project`
2.  选择 `Maven`
3.  填写 GroupId、ArtifactId

**命令行创建：**

```bash
mvn archetype:generate \
  -DgroupId=com.example \
  -DartifactId=my-app \
  -DarchetypeArtifactId=maven-archetype-quickstart
```

#### 3.2 导入项目

| 方式       | 操作                                                       |
| -------- | -------------------------------------------------------- |
| 直接打开     | `File → Open` → 选择 `pom.xml` → `Open as Project`         |
| 导入模块     | `File → Project Structure → Modules → + → Import Module` |
| Maven 面板 | 右侧 `Maven` 面板 → `+` → 选择 `pom.xml`                       |

***

### 4. 依赖管理

#### 4.1 Maven 坐标

**坐标**是依赖的唯一标识：

```xml
<dependency>
    <groupId>org.springframework</groupId>    <!-- 组织名 -->
    <artifactId>spring-core</artifactId>      <!-- 项目名 -->
    <version>5.3.20</version>                 <!-- 版本号 -->
</dependency>
```

| 元素             | 说明        | 示例            |
| -------------- | --------- | ------------- |
| **groupId**    | 组织标识，域名倒写 | `com.alibaba` |
| **artifactId** | 项目/模块名称   | `fastjson`    |
| **version**    | 版本号       | `2.0.0`       |

**查找坐标：** <https://mvnrepository.com/>

#### 4.2 依赖配置

```xml
<dependencies>
    <!-- MySQL 驱动 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.33</version>
    </dependency>
    
    <!-- JUnit 5（测试范围） -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.9.3</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

#### 4.3 依赖范围（scope）

| scope           | 主程序 | 测试程序 | 打包 | 示例                 |
| --------------- | --- | ---- | -- | ------------------ |
| **compile**（默认） | ✓   | ✓    | ✓  | spring-core        |
| **test**        | ✗   | ✓    | ✗  | junit              |
| **provided**    | ✓   | ✓    | ✗  | servlet-api、lombok |
| **runtime**     | ✗   | ✓    | ✓  | mysql-connector    |

#### 4.4 依赖传递与排除

引入 A 依赖，A 依赖 B，则 B 会自动引入。使用 `<exclusions>` 排除不需要的传递依赖：

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>5.3.20</version>
    <exclusions>
        <exclusion>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

***

### 5. 构建生命周期

#### 5.1 三套生命周期

| 生命周期        | 作用   | 常用阶段                         |
| ----------- | ---- | ---------------------------- |
| **clean**   | 清理项目 | clean                        |
| **default** | 核心构建 | compile、test、package、install |
| **site**    | 生成站点 | site                         |

#### 5.2 default 生命周期

    validate → compile → test → package → verify → install → deploy
                 ↓        ↓        ↓                  ↓
               编译     测试     打包           安装到本地仓库

| 阶段          | 说明          |
| ----------- | ----------- |
| **compile** | 编译主程序代码     |
| **test**    | 运行测试        |
| **package** | 打包（jar/war） |
| **install** | 安装到本地仓库     |

**执行特点：** 执行后面的阶段，前面的阶段自动执行

```bash
mvn package    # 自动执行 compile → test → package
mvn install    # 自动执行 compile → test → package → install
```

#### 5.3 常用命令

```bash
mvn clean              # 清理 target 目录
mvn compile            # 编译
mvn test               # 运行测试
mvn package            # 打包
mvn clean package      # 清理后打包（常用）
mvn install            # 安装到本地仓库
mvn clean install -DskipTests  # 跳过测试
```

***

## 二、单元测试

### 1. JUnit 5 基础

#### 1.1 快速入门

**添加依赖：**

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.9.3</version>
    <scope>test</scope>
</dependency>
```

**编写测试类：**

```java
// src/main/java/com/example/Calculator.java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
}
```

```java
// src/test/java/com/example/CalculatorTest.java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CalculatorTest {
    
    @Test
    void testAdd() {
        Calculator calc = new Calculator();
        assertEquals(5, calc.add(2, 3));
    }
}
```

**运行测试：**

*   IDEA：右键测试类/方法 → Run
*   Maven：`mvn test`

#### 1.2 断言方法

```java
import static org.junit.jupiter.api.Assertions.*;

@Test
void testAssertions() {
    // 相等断言
    assertEquals(expected, actual);
    assertNotEquals(unexpected, actual);
    
    // 布尔断言
    assertTrue(condition);
    assertFalse(condition);
    
    // 空值断言
    assertNull(object);
    assertNotNull(object);
    
    // 数组断言
    assertArrayEquals(expectedArray, actualArray);
    
    // 异常断言
    assertThrows(ArithmeticException.class, () -> {
        calculator.divide(10, 0);
    });
    
    // 组合断言
    assertAll("加法测试",
        () -> assertEquals(5, calc.add(2, 3)),
        () -> assertEquals(0, calc.add(-1, 1))
    );
}
```

#### 1.3 常用注解

| 注解             | 说明              |
| -------------- | --------------- |
| `@Test`        | 标记测试方法          |
| `@BeforeEach`  | 每个测试方法执行前运行     |
| `@AfterEach`   | 每个测试方法执行后运行     |
| `@BeforeAll`   | 所有测试前运行一次（静态方法） |
| `@AfterAll`    | 所有测试后运行一次（静态方法） |
| `@DisplayName` | 设置测试显示名称        |
| `@Disabled`    | 禁用测试            |

**完整示例：**

```java
@DisplayName("计算器测试")
public class CalculatorTest {
    
    private Calculator calculator;
    
    @BeforeAll
    static void beforeAll() {
        System.out.println("所有测试开始前执行一次");
    }
    
    @BeforeEach
    void setUp() {
        calculator = new Calculator();
    }
    
    @AfterEach
    void tearDown() {
        calculator = null;
    }
    
    @AfterAll
    static void afterAll() {
        System.out.println("所有测试结束后执行一次");
    }
    
    @Test
    @DisplayName("测试加法")
    void testAdd() {
        assertEquals(5, calculator.add(2, 3));
    }
    
    @Test
    @Disabled("功能未实现")
    void testMultiply() {
        // 跳过
    }
}
```

**执行顺序：**

    @BeforeAll（一次）
      ↓
    @BeforeEach → @Test → @AfterEach
      ↓
    @BeforeEach → @Test → @AfterEach
      ↓
    @AfterAll（一次）

***

### 2. Spring Boot 测试

#### 2.1 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

> **包含：** JUnit 5、Mockito、AssertJ 等，无需单独引入

#### 2.2 @SpringBootTest

`@SpringBootTest` 用于启动完整的 Spring 应用上下文进行**集成测试**。

```java
@SpringBootTest
public class UserServiceTest {
    
    @Autowired
    private UserService userService;
    
    @Test
    void testFindUser() {
        User user = userService.findById(1L);
        assertNotNull(user);
    }
}
```

**webEnvironment 配置：**

| 选项             | 说明                 |
| -------------- | ------------------ |
| `MOCK`（默认）     | 模拟 Web 环境，不启动真实服务器 |
| `RANDOM_PORT`  | 启动真实服务器，随机端口       |
| `DEFINED_PORT` | 启动真实服务器，使用配置端口     |
| `NONE`         | 不创建 Web 环境         |

#### 2.3 @MockBean

模拟依赖，不实际调用：

```java
@SpringBootTest
public class OrderServiceTest {
    
    @Autowired
    private OrderService orderService;
    
    @MockBean
    private UserService userService;
    
    @Test
    void testCreateOrder() {
        // 设置模拟行为
        when(userService.findById(1L)).thenReturn(new User(1L, "张三"));
        
        // 执行测试
        Order order = orderService.createOrder(1L, "商品A");
        
        // 验证
        assertNotNull(order);
        verify(userService, times(1)).findById(1L);
    }
}
```

#### 2.4 @WebMvcTest

只加载 Web 层组件，测试 Controller：

```java
@WebMvcTest(UserController.class)
public class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Test
    void testGetUser() throws Exception {
        when(userService.findById(1L)).thenReturn(new User(1L, "张三"));
        
        mockMvc.perform(get("/users/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.name").value("张三"));
    }
}
```

#### 2.5 @DataJpaTest

只加载 JPA 组件，测试 Repository：

```java
@DataJpaTest
public class UserRepositoryTest {
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void testFindByName() {
        User found = userRepository.findByName("张三");
        assertNotNull(found);
    }
}
```

#### 2.6 测试配置

**使用测试专用配置：**

```java
@SpringBootTest
@ActiveProfiles("test")  // 使用 application-test.yml
public class UserServiceTest {
    // ...
}
```

#### 2.7 测试注解总结

| 场景            | 注解                | 特点        |
| ------------- | ----------------- | --------- |
| 完整集成测试        | `@SpringBootTest` | 加载完整上下文   |
| Controller 测试 | `@WebMvcTest`     | 只加载 Web 层 |
| Repository 测试 | `@DataJpaTest`    | 只加载 JPA 层 |
| 模拟依赖          | `@MockBean`       | 替换 Bean   |
| 指定配置          | `@ActiveProfiles` | 加载指定配置文件  |

