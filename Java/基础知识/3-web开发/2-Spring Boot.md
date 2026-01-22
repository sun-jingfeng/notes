## 一、Spring Boot 概述

### 1.1 简介与核心特性

**Spring Boot** 是 Spring 家族中的一个全新框架，用于简化 Spring 应用的初始搭建和开发过程。

**核心特性：**

| 特性         | 说明                                            |
| ------------ | ----------------------------------------------- |
| 🎯 快速构建   | 提供各种起步依赖，简化构建配置                  |
| 📦 内嵌服务器 | 内置 Tomcat、Jetty、Undertow，无需部署 WAR 文件 |
| ⚙️ 自动配置   | 尽可能自动配置 Spring 和第三方库                |
| 🔧 无需 XML   | 提倡使用 Java 配置，摆脱繁琐的 XML 配置         |
| 📊 生产级特性 | 提供运行时监控、健康检查、外部化配置等功能      |

***

### 1.2 Spring 生态体系

    Spring 生态
    ├── Spring Framework（核心框架）
    │   ├── Spring Core（IOC 容器、DI 依赖注入）
    │   ├── Spring AOP（面向切面编程）
    │   ├── Spring MVC（Web 开发）
    │   └── Spring JDBC/ORM（数据访问）
    │
    ├── Spring Boot（快速开发框架）← 本篇重点
    │   ├── 自动配置
    │   ├── 内嵌服务器
    │   └── Starter 依赖
    │
    └── Spring Cloud（微服务框架）
        └── ...

***

### 1.3 快速入门

#### 第一步：创建项目

**方式一：Spring Initializr（推荐）**

*   访问 <https://start.spring.io/>
*   选择项目类型、Spring Boot 版本
*   添加依赖：`Spring Web`
*   生成并下载

**方式二：IDEA 创建**

*   IDEA → New Project → Spring Initializr

#### 第二步：编写代码

**启动类：**

```java
package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**Controller：**

```java
package com.example.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello, Spring Boot!";
    }
}
```

#### 第三步：启动测试

```bash
# 启动应用
mvn spring-boot:run
# 或直接运行 main 方法

# 访问测试
curl http://localhost:8080/hello
# 输出：Hello, Spring Boot!
```

***

### 1.4 核心原理剖析

#### @SpringBootApplication 注解

`@SpringBootApplication` 是一个组合注解：

```java
@SpringBootConfiguration  // 标识配置类
@EnableAutoConfiguration  // 开启自动配置
@ComponentScan            // 组件扫描
public @interface SpringBootApplication { }
```

> 💡 详细解析见 [4.1 @SpringBootApplication 解析](#41-springbootapplication-解析)

#### 起步依赖（Starter）

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

`spring-boot-starter-web` 自动引入：

*   ✅ Spring MVC
*   ✅ 内嵌 Tomcat
*   ✅ JSON 处理（Jackson）
*   ✅ 数据校验

> 💡 **Starter 命名规则**
>
> *   官方：`spring-boot-starter-*`
> *   第三方：`*-spring-boot-starter`

#### 内嵌服务器原理

    ┌─────────────────────────────────────────────┐
    │              Spring Boot 应用                │
    │  ┌───────────────────────────────────────┐  │
    │  │           内嵌 Tomcat 服务器            │  │
    │  │  ┌─────────────────────────────────┐  │  │
    │  │  │       DispatcherServlet         │  │  │
    │  │  │    (Spring MVC 前端控制器)        │  │  │
    │  │  └─────────────────────────────────┘  │  │
    │  └───────────────────────────────────────┘  │
    └─────────────────────────────────────────────┘

**工作流程：**

1.  Spring Boot 启动时创建内嵌 Tomcat 实例
2.  将 DispatcherServlet 注册到 Tomcat
3.  Tomcat 监听指定端口，接收 HTTP 请求
4.  请求经 DispatcherServlet 分发到对应 Controller

***

## 二、IOC 与依赖注入

### 2.1 IOC 控制反转

#### 核心概念

| 概念    | 全称                 | 说明                               |
| ------- | -------------------- | ---------------------------------- |
| **IOC** | Inversion of Control | 对象的创建控制权由程序转移到容器   |
| **DI**  | Dependency Injection | 容器为应用程序提供运行时依赖的资源 |

    ┌────────────────────────────────────────────────────────────────────┐
    │   传统方式（耦合）                                                   │
    │   ┌──────────────┐         new          ┌──────────────────┐      │
    │   │  Controller  │ ──────────────────▶  │  ServiceImpl     │      │
    │   └──────────────┘                      └──────────────────┘      │
    ├────────────────────────────────────────────────────────────────────┤
    │   IOC + DI 方式（解耦）                                             │
    │                                                                    │
    │   ┌──────────────┐                      ┌──────────────────┐      │
    │   │  Controller  │◀─── 依赖注入 ─────────│  ServiceImpl     │      │
    │   │  @Autowired  │                      │   (@Service)     │      │
    │   └──────────────┘                      └──────────────────┘      │
    │          ▲                                       │                 │
    │          │              ┌─────────────┐         │                 │
    │          └──── 获取 ────│  IOC 容器   │◀── 注册 ─┘                 │
    │                         └─────────────┘                           │
    └────────────────────────────────────────────────────────────────────┘

#### IOC 的优势

| 优势         | 说明                               |
| ------------ | ---------------------------------- |
| **解耦**     | 组件之间不直接依赖，降低耦合度     |
| **可测试**   | 依赖可以被 Mock 替换，便于单元测试 |
| **可维护**   | 修改实现类无需修改调用方代码       |
| **灵活配置** | 通过配置切换不同实现               |

***

### 2.2 Bean 的声明与管理

#### Bean 声明注解

| 注解          | 说明                 | 适用位置      |
| ------------- | -------------------- | ------------- |
| `@Component`  | 声明 bean 的基础注解 | 通用          |
| `@Controller` | 衍生注解             | Controller 层 |
| `@Service`    | 衍生注解             | Service 层    |
| `@Repository` | 衍生注解             | Dao 层        |

> 💡 四个注解功能完全相同，使用不同注解是为了**语义化**，便于区分组件类型。

**示例：**

```java
@Service  // 声明为 Service 层的 Bean
public class UserServiceImpl implements UserService {
    // Spring 自动创建并管理此 Bean
}
```

#### @Configuration 配置类

`@Configuration` 用于声明一个配置类，是 Spring 中定义和组织 Bean 的核心方式。

**基本使用：**

```java
@Configuration
public class AppConfig {
    
    @Bean
    public UserService userService() {
        return new UserServiceImpl(userRepository());
    }
    
    @Bean
    public UserRepository userRepository() {
        return new UserRepositoryImpl();
    }
}
```

**@Configuration vs @Component：**

| 特性           | @Configuration                   | @Component         |
| -------------- | -------------------------------- | ------------------ |
| 代理模式       | 默认使用 CGLIB 代理              | 无代理             |
| @Bean 方法调用 | 返回同一个 Bean 实例（保证单例） | 每次调用创建新实例 |
| 适用场景       | 定义 Bean 及其依赖关系           | 普通组件           |

**关键区别示例：**

```java
@Configuration
public class AppConfig {
    
    @Bean
    public A a() {
        return new A(b());  // 调用 b()
    }
    
    @Bean
    public B b() {
        return new B();
    }
    
    @Bean
    public C c() {
        return new C(b());  // 再次调用 b()
    }
}
// 使用 @Configuration：a 和 c 中的 b 是同一个实例（单例保证）
// 若使用 @Component：a 和 c 中的 b 是不同实例（单例被破坏）
```

**proxyBeanMethods 属性（Spring Boot 2.2+）：**

```java
// Full 模式（默认）：启用代理，保证 @Bean 方法调用返回单例
@Configuration(proxyBeanMethods = true)
public class FullConfig { }

// Lite 模式：禁用代理，启动更快，但 @Bean 方法间调用不保证单例
@Configuration(proxyBeanMethods = false)
public class LiteConfig { }
```

| 模式 | proxyBeanMethods | 特点                 | 适用场景               |
| ---- | ---------------- | -------------------- | ---------------------- |
| Full | true（默认）     | 保证单例，有代理开销 | @Bean 方法间有依赖调用 |
| Lite | false            | 启动快，无代理       | @Bean 方法间无依赖调用 |

> 💡 **建议**：如果配置类中的 @Bean 方法之间没有互相调用，可使用 `@Configuration(proxyBeanMethods = false)` 提升启动性能。Spring Boot 的许多自动配置类都采用 Lite 模式。

#### @Bean 注解

`@Bean` 写在方法上，**把方法的返回值注册成 Bean**。适用于第三方类（无法加 `@Component`）或需要自定义初始化的对象。

| 场景             | 方式         | 说明                   |
| ---------------- | ------------ | ---------------------- |
| 自己写的类       | `@Component` | 直接在类上加注解       |
| 第三方库的类     | `@Bean`      | 在配置类的方法上加注解 |
| 需要自定义初始化 | `@Bean`      | 方法内设置属性后再返回 |

**基本用法：**

```java
@Configuration
public class AppConfig {
    
    @Bean  // Bean 名称默认是方法名：restTemplate
    public RestTemplate restTemplate() {
        return new RestTemplate();  // 返回值注册成 Bean
    }
    
    @Bean("customDataSource")  // 指定 Bean 名称
    public DataSource dataSource() {
        DruidDataSource ds = new DruidDataSource();
        ds.setUrl("jdbc:mysql://localhost:3306/test");
        ds.setUsername("root");
        ds.setPassword("123456");
        return ds;
    }
}
```

> 💡 不管用 `@Component` 还是 `@Bean` 注册，使用时都一样通过 `@Autowired` 注入。

#### 组件扫描机制

`@SpringBootApplication` 包含 `@ComponentScan`，默认扫描**启动类所在包及其子包**。

    com.example/                          ← 启动类所在包
    ├── Application.java                  ✅ 启动类
    ├── controller/                       ✅ 会被扫描
    ├── service/                          ✅ 会被扫描
    └── mapper/                           ✅ 会被扫描

    com.other/                            ❌ 不会被扫描
    └── OtherService.java

**手动指定扫描范围：**

```java
@SpringBootApplication
@ComponentScan({"com.example", "com.other"})
public class Application { }
```

#### Bean 的作用域

| 作用域      | 说明                               | 使用场景              |
| ----------- | ---------------------------------- | --------------------- |
| `singleton` | 单例（默认），整个容器只有一个实例 | 无状态的 Service、Dao |
| `prototype` | 原型，每次获取都创建新实例         | 有状态的 Bean         |
| `request`   | 每个 HTTP 请求一个实例             | Web 应用              |
| `session`   | 每个 HTTP Session 一个实例         | Web 应用              |

```java
@Service
@Scope("prototype")  // 每次注入都创建新实例
public class PrototypeService { }
```

***

### 2.3 DI 依赖注入

#### 注入方式对比

| 方式         | 代码示例                  | 推荐程度   | 说明                       |
| ------------ | ------------------------- | ---------- | -------------------------- |
| 属性注入     | `@Autowired` 在字段上     | ⚠️ 不推荐   | 无法声明 final，不利于测试 |
| 构造函数注入 | `@Autowired` 在构造器上   | ✅ **推荐** | 可声明 final，依赖明确     |
| Setter 注入  | `@Autowired` 在 setter 上 | ⚠️ 可选     | 适合可选依赖               |

**属性注入（不推荐）：**

```java
@RestController
public class UserController {
    @Autowired
    private UserService userService;  // 无法声明为 final
}
```

**构造函数注入（推荐）：**

```java
@RestController
public class UserController {
    
    private final UserService userService;  // 可以声明为 final
    
    @Autowired  // 只有一个构造函数时可省略
    public UserController(UserService userService) {
        this.userService = userService;
    }
}

// 简化写法（Lombok）
@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
}
```

#### 多个同类型 Bean 处理

当一个接口有多个实现类时，需要指定注入哪一个：

**方案一：@Primary**

```java
@Primary  // 设置为首选 Bean
@Service
public class UserServiceImpl implements UserService { }

@Service
public class UserServiceV2Impl implements UserService { }
```

**方案二：@Qualifier**

```java
@Autowired
@Qualifier("userServiceV2Impl")  // 指定 Bean 名称
private UserService userService;
```

**方案三：@Resource**

```java
@Resource(name = "userServiceV2Impl")  // 按名称注入
private UserService userService;
```

#### @Autowired vs @Resource

| 特性     | @Autowired          | @Resource        |
| -------- | ------------------- | ---------------- |
| 来源     | Spring 框架         | JDK（JSR-250）   |
| 注入方式 | 默认**按类型**      | 默认**按名称**   |
| 指定名称 | 需配合 `@Qualifier` | 使用 `name` 属性 |
| 推荐场景 | Spring 项目         | 需要按名称注入时 |

***

### 2.4 Bean 生命周期

    1. 实例化（Instantiation）
       - 调用构造函数创建对象
          ↓
    2. 属性注入（Populate Properties）
       - @Autowired、@Value 等注入
          ↓
    3. Aware 接口回调
       - BeanNameAware、BeanFactoryAware、ApplicationContextAware
          ↓
    4. BeanPostProcessor.postProcessBeforeInitialization()
       - 初始化前置处理
          ↓
    5. @PostConstruct 方法
       - JSR-250 标准注解
          ↓
    6. InitializingBean.afterPropertiesSet()
       - Spring 接口方法
          ↓
    7. 自定义 init-method
       - @Bean(initMethod = "init")
          ↓
    8. BeanPostProcessor.postProcessAfterInitialization()
       - 初始化后置处理（AOP 代理在此生成）
          ↓
    9. Bean 就绪，可以使用
          ↓
       ────────── 容器关闭时 ──────────
          ↓
    10. @PreDestroy 方法
       - JSR-250 标准注解
          ↓
    11. DisposableBean.destroy()
       - Spring 接口方法
          ↓
    12. 自定义 destroy-method
       - @Bean(destroyMethod = "cleanup")

**示例：**

```java
@Component
@Slf4j
public class MyBean implements InitializingBean, DisposableBean, BeanNameAware {

    private String beanName;

    @Override
    public void setBeanName(String name) {
        this.beanName = name;
        log.info("0. BeanNameAware.setBeanName: {}", name);
    }

    @PostConstruct
    public void postConstruct() {
        log.info("1. @PostConstruct 执行");
    }

    @Override
    public void afterPropertiesSet() {
        log.info("2. InitializingBean.afterPropertiesSet 执行");
    }

    @PreDestroy
    public void preDestroy() {
        log.info("3. @PreDestroy 执行");
    }

    @Override
    public void destroy() {
        log.info("4. DisposableBean.destroy 执行");
    }
}
```

**输出顺序：**

    0. BeanNameAware.setBeanName: myBean
    1. @PostConstruct 执行
    2. InitializingBean.afterPropertiesSet 执行
    ... 应用运行中 ...
    3. @PreDestroy 执行
    4. DisposableBean.destroy 执行

***

## 三、配置管理

### 3.1 配置文件类型

Spring Boot 支持两种配置文件格式：

| 类型           | 文件名                   | 特点                     |
| -------------- | ------------------------ | ------------------------ |
| **properties** | `application.properties` | 传统格式，键值对         |
| **yml/yaml**   | `application.yml`        | 层级结构，更简洁（推荐） |

**位置：** `src/main/resources/`

#### properties 格式

```properties
# 服务器配置
server.port=8080
server.address=127.0.0.1

# 数据源配置
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=123456
```

#### yml 格式（推荐）

```yaml
# 配置服务器相关信息
server:
  port: 8080
  address: 127.0.0.1

# 数据源配置
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: 123456
```

***

### 3.2 yml 语法详解

#### 语法规则

| 规则             | 说明                                                 |
| ---------------- | ---------------------------------------------------- |
| **冒号后空格**   | 数值前边必须有空格，作为分隔符。如 `port: 8080`      |
| **缩进表示层级** | 使用缩进表示层级关系，不允许使用 Tab 键，只能用空格  |
| **对齐即可**     | 缩进的空格数目不重要，只要相同层级的元素左侧对齐即可 |
| **# 表示注释**   | `#` 表示注释，从这个字符一直到行尾，都会被解析器忽略 |
| **大小写敏感**   | 属性名区分大小写，`Port` ≠ `port`                    |

#### 数据格式

**① 定义对象 / Map 集合：**

```yaml
# 对象写法
user:
  name: 张三
  age: 18
  password: 123456

# 行内写法
user: {name: 张三, age: 18, password: 123456}
```

**② 定义数组 / List / Set 集合：**

```yaml
# 数组写法（使用 - 开头）
hobby:
  - java
  - game
  - sport

# 行内写法
hobby: [java, game, sport]
```

**③ 复杂结构（对象数组）：**

```yaml
users:
  - name: 张三
    age: 18
  - name: 李四
    age: 20
```

**④ 纯量（基本类型）：**

```yaml
# 字符串（默认不需要引号）
name: 张三

# 字符串（包含特殊字符时使用引号）
message: "Hello\nWorld"    # 双引号：识别转义字符
message: 'Hello\nWorld'    # 单引号：不识别转义字符，原样输出

# 数值
age: 18
price: 19.99

# 布尔值
enabled: true
debug: false

# 空值
data: null
data: ~
```

#### 对比示例

**properties 写法：**

```properties
user.name=张三
user.age=18
user.hobbies[0]=java
user.hobbies[1]=game
user.hobbies[2]=sport
```

**yml 写法：**

```yaml
user:
  name: 张三
  age: 18
  hobbies:
    - java
    - game
    - sport
```

***

### 3.3 常用配置项

#### 服务器配置

```yaml
server:
  port: 8080                    # 端口号
  servlet:
    context-path: /api          # 上下文路径
  tomcat:
    max-threads: 200            # 最大线程数
    uri-encoding: UTF-8         # URI 编码
```

#### 数据源配置

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf-8
    username: root
    password: 123456
    # Druid 连接池配置（可选）
    type: com.alibaba.druid.pool.DruidDataSource
    druid:
      initial-size: 5
      max-active: 20
      min-idle: 5
```

#### MyBatis 配置

```yaml
mybatis:
  type-aliases-package: com.example.pojo
  mapper-locations: classpath:mapper/*.xml
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

#### 日志配置

```yaml
logging:
  level:
    root: INFO
    com.example.mapper: DEBUG     # 指定包的日志级别
  file:
    name: logs/app.log            # 日志文件路径
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{50} - %msg%n"
```

#### 文件上传配置

```yaml
spring:
  servlet:
    multipart:
      enabled: true                    # 开启文件上传（默认开启）
      max-file-size: 10MB              # 单个文件最大大小
      max-request-size: 100MB          # 单次请求最大大小（多文件）
```

***

### 3.4 多环境配置

在实际开发中，通常有多个环境：开发（dev）、测试（test）、生产（prod）。

#### 方式一：多文件配置

    resources/
    ├── application.yml           # 主配置（公共配置 + 激活环境）
    ├── application-dev.yml       # 开发环境
    ├── application-test.yml      # 测试环境
    └── application-prod.yml      # 生产环境

**application.yml（主配置）：**

```yaml
# 激活指定环境
spring:
  profiles:
    active: dev    # 可选值：dev / test / prod

# 公共配置
mybatis:
  configuration:
    map-underscore-to-camel-case: true
```

**application-dev.yml（开发环境）：**

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/dev_db
    username: root
    password: 123456
```

**application-prod.yml（生产环境）：**

```yaml
server:
  port: 80

spring:
  datasource:
    url: jdbc:mysql://prod-server:3306/prod_db
    username: prod_user
    password: ${DB_PASSWORD}    # 使用环境变量
```

#### 方式二：单文件多环境（yml）

```yaml
# 公共配置
spring:
  profiles:
    active: dev

---
# 开发环境
spring:
  config:
    activate:
      on-profile: dev
server:
  port: 8080

---
# 生产环境
spring:
  config:
    activate:
      on-profile: prod
server:
  port: 80
```

#### 激活环境的方式

| 方式       | 示例                            | 优先级 |
| ---------- | ------------------------------- | ------ |
| 配置文件   | `spring.profiles.active=dev`    | 低     |
| 命令行参数 | `--spring.profiles.active=prod` | 高     |
| 环境变量   | `SPRING_PROFILES_ACTIVE=prod`   | 中     |
| JVM参数    | `-Dspring.profiles.active=prod` | 高     |

```bash
# 命令行激活
java -jar app.jar --spring.profiles.active=prod

# JVM 参数激活
java -Dspring.profiles.active=prod -jar app.jar
```

***

### 3.5 配置优先级

Spring Boot 配置的加载顺序（优先级从高到低）：

| 优先级    | 配置来源           | 示例                        |
| --------- | ------------------ | --------------------------- |
| 1（最高） | 命令行参数         | `--server.port=9090`        |
| 2         | Java 系统属性      | `-Dserver.port=9090`        |
| 3         | 操作系统环境变量   | `SERVER_PORT=9090`          |
| 4         | jar 包外的配置文件 | `./config/application.yml`  |
| 5         | jar 包内的配置文件 | `classpath:application.yml` |
| 6（最低） | 默认值             | 代码中的 `@Value` 默认值    |

**配置文件位置优先级：**

    1. ./config/application.yml            # 项目根目录下的 config 目录
    2. ./application.yml                   # 项目根目录
    3. classpath:/config/application.yml   # 类路径下的 config 目录
    4. classpath:/application.yml          # 类路径根目录（常用）

***

### 3.6 获取配置值

#### 方式一：@Value 注入

**配置文件（application.yml）：**

```yaml
# 服务器配置（Spring Boot 内置）
server:
  port: 8080

# 自定义配置
app:
  name: MyApplication
  description: 这是一个示例应用
  max-upload-size: 10485760
  debug-mode: false
  allowed-origins:
    - http://localhost:3000
    - http://localhost:8080
```

**注入使用：**

```java
@RestController
public class ConfigController {
    
    // 注入内置配置
    @Value("${server.port}")
    private Integer port;
    
    // 注入自定义配置
    @Value("${app.name}")
    private String appName;
    
    @Value("${app.description}")
    private String description;
    
    // 设置默认值（配置不存在时使用默认值）
    @Value("${app.version:1.0.0}")
    private String version;
    
    // 注入数值类型
    @Value("${app.max-upload-size}")
    private Long maxUploadSize;
    
    // 注入布尔类型
    @Value("${app.debug-mode}")
    private Boolean debugMode;
    
    // 注入数组/列表
    @Value("${app.allowed-origins}")
    private List<String> allowedOrigins;
    
    @GetMapping("/config")
    public String getConfig() {
        return "端口：" + port + "，应用名：" + appName;
    }
}
```

**@Value 常用写法：**

| 写法                             | 说明                           |
| -------------------------------- | ------------------------------ |
| `@Value("${app.name}")`          | 直接注入，配置不存在则启动报错 |
| `@Value("${app.name:默认值}")`   | 配置不存在时使用默认值         |
| `@Value("${app.name:}")`         | 配置不存在时使用空字符串       |
| `@Value("${app.count:0}")`       | 数值类型默认值                 |
| `@Value("${app.enabled:false}")` | 布尔类型默认值                 |

***

#### 方式二：@ConfigurationProperties 绑定

**配置文件（application.yml）：**

```yaml
app:
  name: MyApplication
  version: 1.0.0
  author:
    name: 张三
    email: zhangsan@example.com
  servers:
    - host: server1.example.com
      port: 8080
    - host: server2.example.com
      port: 8081
```

**配置类：**

```java
@Component
@ConfigurationProperties(prefix = "app")
@Data
public class AppConfig {
    private String name;
    private String version;
    private Author author;
    private List<Server> servers;
    
    @Data
    public static class Author {
        private String name;
        private String email;
    }
    
    @Data
    public static class Server {
        private String host;
        private Integer port;
    }
}
```

**使用：**

```java
@RestController
public class ConfigController {
    
    @Autowired
    private AppConfig appConfig;
    
    @GetMapping("/app-info")
    public AppConfig getAppInfo() {
        return appConfig;
    }
    
    @GetMapping("/author")
    public String getAuthor() {
        return appConfig.getAuthor().getName() + " - " + appConfig.getAuthor().getEmail();
    }
}
```

***

#### 两种方式对比

| 特性         | @Value                | @ConfigurationProperties             |
| ------------ | --------------------- | ------------------------------------ |
| **适用场景** | 注入少量配置          | 注入大量配置、复杂结构               |
| **类型安全** | 需手动指定类型        | 自动类型转换                         |
| **默认值**   | 支持（使用 `:` 语法） | 支持（字段初始化）                   |
| **嵌套对象** | 不支持                | 支持                                 |
| **列表/Map** | 支持（写法复杂）      | 支持（写法简单）                     |
| **松散绑定** | 不支持                | 支持（驼峰、下划线、短横线自动转换） |

> 💡 **建议**：
>
> *   少量简单配置 → 使用 `@Value`
> *   大量配置或复杂结构 → 使用 `@ConfigurationProperties`

***

## 四、启动流程与自动配置

### 4.1 @SpringBootApplication 解析

```java
@SpringBootApplication
// 等价于以下三个注解的组合：
@SpringBootConfiguration      // 标识为配置类（等同于 @Configuration）
@EnableAutoConfiguration      // 开启自动配置
@ComponentScan               // 组件扫描（默认扫描启动类所在包及子包）
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

| 注解                       | 作用                                    |
| -------------------------- | --------------------------------------- |
| `@SpringBootConfiguration` | 标识当前类是配置类，可包含 `@Bean` 方法 |
| `@EnableAutoConfiguration` | 开启自动配置，根据依赖自动配置 Spring   |
| `@ComponentScan`           | 组件扫描，默认扫描启动类所在包及子包    |

***

### 4.2 启动流程概览

    1. main() 方法启动
          ↓
    2. 创建 SpringApplication 对象
          ↓
    3. 运行 run() 方法
          ↓
    4. 准备环境（Environment）
       - 加载配置文件
       - 解析命令行参数
          ↓
    5. 创建 ApplicationContext
       - 根据应用类型创建对应的上下文
          ↓
    6. 加载并注册 Bean 定义
       - 扫描 @Component 等注解
       - 解析 @Configuration 类
          ↓
    7. 执行自动配置
       - 加载 META-INF/spring/...AutoConfiguration.imports
       - 根据条件注解筛选生效的配置
          ↓
    8. 实例化所有单例 Bean
       - 按依赖顺序创建 Bean
       - 执行依赖注入
          ↓
    9. 执行 CommandLineRunner / ApplicationRunner
       - 执行启动后的初始化任务
          ↓
    10. 发布 ApplicationReadyEvent
          ↓
    11. 应用启动完成，等待请求

***

### 4.3 自动配置原理

#### 核心机制

1.  `@EnableAutoConfiguration` 导入 `AutoConfigurationImportSelector`
2.  扫描 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 文件
3.  加载所有自动配置类
4.  根据条件注解（`@ConditionalOnXxx`）决定是否生效

#### 条件注解

| 注解                              | 说明                         | 示例                         |
| --------------------------------- | ---------------------------- | ---------------------------- |
| `@ConditionalOnClass`             | 类路径存在指定类时生效       | 有 DataSource 类时配置数据源 |
| `@ConditionalOnMissingClass`      | 类路径不存在指定类时生效     |                              |
| `@ConditionalOnBean`              | 容器中存在指定 Bean 时生效   |                              |
| `@ConditionalOnMissingBean`       | 容器中不存在指定 Bean 时生效 | 用户未自定义时使用默认配置   |
| `@ConditionalOnProperty`          | 配置属性满足条件时生效       | `spring.xxx.enabled=true`    |
| `@ConditionalOnWebApplication`    | Web 应用时生效               |                              |
| `@ConditionalOnNotWebApplication` | 非 Web 应用时生效            |                              |

#### 自动配置示例

以 DataSource 自动配置为例：

```java
@AutoConfiguration
@ConditionalOnClass(DataSource.class)                     // 条件1：类路径有 DataSource
@ConditionalOnMissingBean(type = "io.r2dbc...")          // 条件2：没有 R2DBC
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean                             // 条件3：用户没有自定义 DataSource
    public DataSource dataSource(DataSourceProperties properties) {
        // 根据配置创建默认的 DataSource
        return DataSourceBuilder.create()
                .url(properties.getUrl())
                .username(properties.getUsername())
                .password(properties.getPassword())
                .build();
    }
}
```

**工作原理：**

1.  当引入 `spring-boot-starter-jdbc` 时，类路径有 `DataSource` 类
2.  自动配置类的条件满足，开始生效
3.  如果用户没有自定义 `DataSource` Bean，则创建默认的
4.  从 `application.yml` 读取 `spring.datasource.*` 配置

#### 查看自动配置报告

```yaml
# application.yml
debug: true
```

启动时会打印：

*   **Positive matches**：生效的自动配置
*   **Negative matches**：未生效的自动配置（及原因）

***

### 4.4 启动时执行任务

Spring Boot 提供了多种方式在应用启动完成后执行初始化任务：

#### 方式一：CommandLineRunner

```java
@Component
@Order(1)  // 执行顺序，数字越小越先执行
public class MyCommandLineRunner implements CommandLineRunner {
    
    @Override
    public void run(String... args) throws Exception {
        // args 是命令行参数，字符串数组形式
        System.out.println("CommandLineRunner 执行");
        System.out.println("参数: " + Arrays.toString(args));
    }
}
```

#### 方式二：ApplicationRunner

```java
@Component
@Order(2)
public class MyApplicationRunner implements ApplicationRunner {
    
    @Override
    public void run(ApplicationArguments args) throws Exception {
        // ApplicationArguments 提供更丰富的参数解析
        System.out.println("ApplicationRunner 执行");
        System.out.println("Non-option args: " + args.getNonOptionArgs());
        System.out.println("Option names: " + args.getOptionNames());
        
        // 获取 --name=value 形式的参数
        if (args.containsOption("env")) {
            System.out.println("env = " + args.getOptionValues("env"));
        }
    }
}
```

#### 方式三：监听 ApplicationReadyEvent

```java
@Component
public class MyReadyListener {
    
    @EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        System.out.println("应用启动完成，可以执行初始化任务");
    }
}
```

#### 方式四：@PostConstruct（Bean 级别）

```java
@Service
public class MyService {
    
    @PostConstruct
    public void init() {
        // 在 Bean 初始化完成后执行
        // 注意：此时其他 Bean 可能尚未完全初始化
        System.out.println("MyService 初始化完成");
    }
}
```

#### 执行顺序

    Bean 的 @PostConstruct
          ↓
    CommandLineRunner（按 @Order 顺序）
          ↓
    ApplicationRunner（按 @Order 顺序）
          ↓
    ApplicationReadyEvent 事件

#### 适用场景

| 方式                    | 适用场景                     |
| ----------------------- | ---------------------------- |
| `@PostConstruct`        | 单个 Bean 的初始化           |
| `CommandLineRunner`     | 需要命令行参数的初始化任务   |
| `ApplicationRunner`     | 需要解析复杂命令行参数       |
| `ApplicationReadyEvent` | 确保所有 Bean 都已就绪后执行 |

***

## 附录：核心注解速查表

### 启动与配置注解

| 注解                       | 说明                                       |
| -------------------------- | ------------------------------------------ |
| `@SpringBootApplication`   | 启动类注解，组合了配置、自动配置、组件扫描 |
| `@SpringBootConfiguration` | 标识配置类（等同于 @Configuration）        |
| `@EnableAutoConfiguration` | 开启自动配置                               |
| `@ComponentScan`           | 组件扫描                                   |
| `@Configuration`           | 声明配置类，支持 @Bean 方法定义            |
| `@Import`                  | 导入其他配置类                             |
| `@ImportResource`          | 导入 XML 配置文件                          |

### Bean 声明注解

| 注解          | 说明                 |
| ------------- | -------------------- |
| `@Component`  | 通用组件             |
| `@Service`    | 业务层组件           |
| `@Controller` | 控制器组件           |
| `@Repository` | 数据层组件           |
| `@Bean`       | 在配置类中声明 Bean  |
| `@Scope`      | 指定 Bean 作用域     |
| `@Primary`    | 设置首选 Bean        |
| `@Lazy`       | 延迟初始化 Bean      |
| `@DependsOn`  | 指定 Bean 的依赖顺序 |

### 依赖注入注解

| 注解                       | 说明                           |
| -------------------------- | ------------------------------ |
| `@Autowired`               | 按类型自动注入                 |
| `@Qualifier`               | 配合 @Autowired 指定 Bean 名称 |
| `@Resource`                | 按名称注入（JDK 标准）         |
| `@Value`                   | 注入配置值                     |
| `@ConfigurationProperties` | 批量绑定配置属性               |

### 生命周期注解

| 注解             | 说明              |
| ---------------- | ----------------- |
| `@PostConstruct` | Bean 初始化后执行 |
| `@PreDestroy`    | Bean 销毁前执行   |
| `@Order`         | 指定执行顺序      |

### 条件注解

| 注解                           | 说明                         |
| ------------------------------ | ---------------------------- |
| `@ConditionalOnClass`          | 类路径存在指定类时生效       |
| `@ConditionalOnMissingClass`   | 类路径不存在指定类时生效     |
| `@ConditionalOnBean`           | 容器中存在指定 Bean 时生效   |
| `@ConditionalOnMissingBean`    | 容器中不存在指定 Bean 时生效 |
| `@ConditionalOnProperty`       | 配置属性满足条件时生效       |
| `@ConditionalOnWebApplication` | Web 应用时生效               |

