## 一、Spring Boot 概述

### 1.1 简介与核心特性

**Spring Boot** 是 Spring 家族中的一个全新框架，用于简化 Spring 应用的初始搭建和开发过程。

| 特性       | 说明                                            |
| ---------- | ----------------------------------------------- |
| 快速构建   | 提供各种起步依赖，简化构建配置                  |
| 内嵌服务器 | 内置 Tomcat、Jetty、Undertow，无需部署 WAR 文件 |
| 自动配置   | 尽可能自动配置 Spring 和第三方库                |
| 无需 XML   | 提倡使用 Java 配置，摆脱繁琐的 XML 配置         |
| 生产级特性 | 提供运行时监控、健康检查、外部化配置等功能      |

***

### 1.2 Spring Boot 与 Spring Framework

#### 两者关系

| 框架             | 定位                                            |
| ---------------- | ----------------------------------------------- |
| Spring Framework | **核心框架**，提供 IOC、AOP、MVC 等基础能力     |
| Spring Boot      | **脚手架**，基于 Spring Framework，简化开发配置 |

```
Spring Boot = Spring Framework + 自动配置 + 内嵌服务器 + 起步依赖
```

**简单理解**：Spring Framework 是"发动机"，Spring Boot 是"整车"，开箱即用。

**Spring Boot 做了什么**：
1. **自动配置**：根据引入的依赖自动配置 Spring，无需手写大量配置
2. **起步依赖**：一个 starter 引入一组相关依赖，无需自己凑版本
3. **内嵌服务器**：直接运行 main 方法启动，无需部署到外部 Tomcat

#### Spring 生态体系

```
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
    └── 服务注册、配置中心、网关、熔断...
```

***

### 1.3 快速入门

#### 创建项目

**方式一：Spring Initializr（推荐）**
- 访问 <https://start.spring.io/>
- 选择项目类型、Spring Boot 版本，添加 `Spring Web` 依赖
- 生成并下载

**方式二：IDEA 创建**
- IDEA → New Project → Spring Initializr

#### 编写代码

```java
// 启动类
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// Controller
@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello, Spring Boot!";
    }
}
```

#### 启动测试

```bash
mvn spring-boot:run          # 或直接运行 main 方法
curl http://localhost:8080/hello  # 输出：Hello, Spring Boot!
```

***

## 二、核心原理

### 2.1 @SpringBootApplication 解析

```java
@SpringBootConfiguration  // 标识配置类（等同于 @Configuration）
@EnableAutoConfiguration  // 开启自动配置
@ComponentScan            // 组件扫描（默认扫描启动类所在包及子包）
public @interface SpringBootApplication { }
```

| 注解                       | 作用                                    |
| -------------------------- | --------------------------------------- |
| `@SpringBootConfiguration` | 标识当前类是配置类，可包含 `@Bean` 方法 |
| `@EnableAutoConfiguration` | 开启自动配置，根据依赖自动配置 Spring   |
| `@ComponentScan`           | 组件扫描，默认扫描启动类所在包及子包    |

***

### 2.2 起步依赖（Starter）

**Starter** 将一组相关依赖打包在一起，简化依赖管理。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

| 命名规则     | 示例                          |
| ------------ | ----------------------------- |
| 官方 Starter | `spring-boot-starter-xxx`     |
| 第三方       | `xxx-spring-boot-starter`     |

| 常用 Starter                   | 说明            |
| ------------------------------ | --------------- |
| `spring-boot-starter-web`      | Web 开发        |
| `spring-boot-starter-data-jpa` | JPA 数据访问    |
| `spring-boot-starter-data-redis` | Redis 集成    |
| `spring-boot-starter-test`     | 测试支持        |
| `spring-boot-starter-validation` | 参数校验      |
| `mybatis-spring-boot-starter`  | MyBatis 集成    |

***

### 2.3 自动配置原理

**自动配置**：根据引入的依赖自动配置 Spring，无需手动编写大量配置。

#### 核心机制

```
@EnableAutoConfiguration
        ↓
通过 @Import(AutoConfigurationImportSelector.class)
        ↓
扫描 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
（Spring Boot 2.7 之前是 META-INF/spring.factories）
        ↓
加载所有自动配置类
        ↓
根据 @Conditional 条件注解决定是否生效
```

#### 常用条件注解

| 注解                            | 说明                           |
| ------------------------------- | ------------------------------ |
| `@ConditionalOnClass`           | 类路径存在指定类时生效         |
| `@ConditionalOnMissingClass`    | 类路径不存在指定类时生效       |
| `@ConditionalOnBean`            | 容器中存在指定 Bean 时生效     |
| `@ConditionalOnMissingBean`     | 容器中不存在指定 Bean 时生效   |
| `@ConditionalOnProperty`        | 配置属性满足条件时生效         |
| `@ConditionalOnWebApplication`  | 是 Web 应用时生效              |
| `@ConditionalOnExpression`      | SpEL 表达式为 true 时生效      |

#### 自动配置类示例

```java
@AutoConfiguration
@ConditionalOnClass(DataSource.class)           // 类路径有 DataSource 才生效
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean                   // 用户没配置时才创建默认的
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }
}
```

> 💡 在配置文件中设置 `debug: true`（或 `logging.level.org.springframework.boot.autoconfigure=DEBUG`），启动时会打印自动配置报告（ConditionEvaluationReport），可查看哪些配置生效、哪些未生效及原因。

***

### 2.4 内嵌服务器

```
┌─────────────────────────────────────────────┐
│              Spring Boot 应用               │
│  ┌───────────────────────────────────────┐  │
│  │           内嵌 Tomcat 服务器          │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │       DispatcherServlet         │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**工作流程**：
1. Spring Boot 启动时创建内嵌 Tomcat 实例
2. 将 DispatcherServlet 注册到 Tomcat
3. Tomcat 监听指定端口，接收 HTTP 请求
4. 请求经 DispatcherServlet 分发到对应 Controller

***

**切换服务器**（如使用 Undertow）：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-undertow</artifactId>
</dependency>
```

***

### 2.5 启动流程

```
1. main() 方法启动
      ↓
2. 创建 SpringApplication 对象
      ↓
3. 准备环境（加载配置文件、解析命令行参数）
      ↓
4. 创建 ApplicationContext
      ↓
5. 加载 Bean 定义（扫描 @Component、解析 @Configuration）
      ↓
6. 执行自动配置（根据条件注解筛选生效的配置）
      ↓
7. 实例化单例 Bean，执行依赖注入
      ↓
8. 执行 CommandLineRunner / ApplicationRunner
      ↓
9. 发布 ApplicationReadyEvent，应用就绪
```

***

## 三、IOC 容器与依赖注入

### 3.1 核心概念

| 概念    | 全称                 | 说明                               |
| ------- | -------------------- | ---------------------------------- |
| **IOC** | Inversion of Control | 对象的创建控制权由程序转移到容器   |
| **DI**  | Dependency Injection | 容器为应用程序提供运行时依赖的资源 |

```
┌────────────────────────────────────────────────────────────────────┐
│   传统方式（耦合）                                                 │
│   Controller ──── new ────▶ ServiceImpl                            │
├────────────────────────────────────────────────────────────────────┤
│   IOC + DI 方式（解耦）                                            │
│   Controller ◀─── 注入 ─── IOC 容器 ◀─── 注册 ─── ServiceImpl     │
└────────────────────────────────────────────────────────────────────┘
```

**IOC 优势**：解耦、便于测试（Mock）、便于维护、灵活配置。

***

### 3.2 Bean 声明方式

**Bean** 是 Spring 容器管理的对象，由容器负责创建、注入并控制其生命周期。

| 场景                 | 方式         | 说明                         |
| -------------------- | ------------ | ---------------------------- |
| 自己写的类           | `@Component` | 类上加注解，且在本项目扫描包下 |
| 第三方或依赖中的类   | `@Bean`      | 在配置类中显式注册             |
| 需要自定义初始化     | `@Bean`      | 方法内设置属性后再返回       |

#### 组件注解（@Component 系列）

| 注解          | 说明       | 适用层  |
| ------------- | ---------- | ------- |
| `@Component`  | 通用组件   | 通用    |
| `@Controller` | 控制器组件 | Web 层  |
| `@Service`    | 业务组件   | Service |
| `@Repository` | 数据组件   | Dao 层  |

> 💡 四个注解功能相同，不同命名是为了**语义化**，便于理解代码结构。

```java
@Service  // 声明为 Service 层的 Bean
public class UserServiceImpl implements UserService {
    // Spring 自动创建并管理此 Bean
}
```

#### Bean 命名规则

| 声明方式     | 默认名称                                            | 指定名称                  |
| ------------ | --------------------------------------------------- | ------------------------- |
| `@Component` | 类名首字母小写（UserServiceImpl → userServiceImpl） | `@Component("myService")` |
| `@Bean`      | 方法名（restTemplate → restTemplate）               | `@Bean("myBean")`         |

```java
// 指定 Bean 名称
@Service("userService")  // Bean 名称为 userService，而非 userServiceImpl
public class UserServiceImpl implements UserService { }

// 注入时按名称匹配
@Autowired
@Qualifier("userService")  // 指定要注入的 Bean 名称
private UserService userService;
```

***

### 3.3 配置类（@Configuration）

#### 基本用法

`@Configuration` 用于声明**配置类**，通过 `@Bean` 方法向容器注册 Bean。

**使用场景**：
- **第三方或依赖中的类**：不能改源码加 `@Component`，且不在本项目默认扫描包下，需用 `@Bean` 显式注册。
- **需要自定义初始化**：在方法内设置属性后再返回实例。
- **集中管理**：把相关的一组 Bean 放在同一配置类中。

```java
@Configuration
public class AppConfig {
    
    @Bean  // Bean 名称默认是方法名
    public RestTemplate restTemplate() {
        return new RestTemplate();
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

> 💡 启动类（`@SpringBootApplication`）本身就是配置类（组合了 `@SpringBootConfiguration` → `@Configuration`），可以直接写 `@Bean` 方法。但建议保持启动类简洁，Bean 注册放到独立的 `@Configuration` 类中。

#### @Configuration vs @Component

`@Component` 也可以包含 `@Bean` 方法，但两者在 **@Bean 方法间互调** 时行为不同：

| 特性               | @Configuration                     | @Component                             |
| ------------------ | ---------------------------------- | -------------------------------------- |
| 代理模式           | 使用 CGLIB 代理                    | 无代理                                 |
| @Bean 方法间互调时 | 返回容器中同一实例（单例得到保证） | 直接调用方法，创建新对象（单例被破坏） |

```java
@Configuration
public class AppConfig {
    @Bean
    public A a() { return new A(b()); }  // 调用 b()
    @Bean
    public B b() { return new B(); }
    @Bean
    public C c() { return new C(b()); }  // 再次调用 b()
}
// ✅ a 和 c 中的 b 是同一个实例（CGLIB 代理拦截，返回容器中的 Bean）
```

若把 `@Configuration` 换成 `@Component`，则 `a` 和 `c` 中的 `b` 会是**不同实例**（单例被破坏）。

> 💡 这里说的是 @Bean 方法间互调的情况。普通 @Component 声明的 Bean 本身默认仍是 singleton。

#### proxyBeanMethods 属性

Spring Boot 2.2+ 引入此属性，用于控制配置类的代理行为：

| 模式 | proxyBeanMethods | 特点                 | 适用场景               |
| ---- | ---------------- | -------------------- | ---------------------- |
| Full | true（默认）     | 保证单例，有代理开销 | @Bean 方法间有依赖调用 |
| Lite | false            | 启动快，无代理       | @Bean 方法间无依赖调用 |

```java
// Lite 模式：启动更快，适合 @Bean 方法间无依赖的场景
@Configuration(proxyBeanMethods = false)
public class AppConfig {
    @Bean
    public ServiceA serviceA() { return new ServiceA(); }
    @Bean
    public ServiceB serviceB() { return new ServiceB(); }
}
```

#### @Import 导入配置

`@Import` 用于将其他配置类或普通类导入到当前配置中，常用于模块化配置。

| 导入类型                             | 说明                                   |
| ------------------------------------ | -------------------------------------- |
| 配置类（@Configuration）             | 导入其他配置类                         |
| 普通类                               | 直接注册为 Bean                        |
| ImportSelector 实现类                | 动态决定导入哪些类（自动配置核心机制） |
| ImportBeanDefinitionRegistrar 实现类 | 编程式注册 Bean                        |

```java
// ① 导入配置类
@Configuration
@Import({DataSourceConfig.class, CacheConfig.class})
public class AppConfig { }

// ② 导入普通类（会被注册为 Bean）
@Configuration
@Import(MyUtilityClass.class)
public class AppConfig { }

// ③ 导入 ImportSelector 实现类（动态导入）
public class MyImportSelector implements ImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata metadata) {
        // 根据条件动态返回要导入的类全限定名
        return new String[]{"com.example.ServiceA", "com.example.ServiceB"};
    }
}

@Configuration
@Import(MyImportSelector.class)
public class AppConfig { }

// ④ 导入 ImportBeanDefinitionRegistrar 实现类（编程式注册）
public class MyRegistrar implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions(AnnotationMetadata metadata, 
                                         BeanDefinitionRegistry registry) {
        // 编程式注册 Bean
        RootBeanDefinition definition = new RootBeanDefinition(MyService.class);
        registry.registerBeanDefinition("myService", definition);
    }
}

@Configuration
@Import(MyRegistrar.class)
public class AppConfig { }
```

> 💡 **ImportSelector 是 Spring Boot 自动配置的核心**：`@EnableAutoConfiguration` 通过 `AutoConfigurationImportSelector` 扫描并导入所有自动配置类。

**使用场景**：
- 将配置按功能拆分到多个配置类，再统一导入
- 引入第三方库提供的配置类
- 条件性地导入某些配置
- 实现自定义的 `@EnableXxx` 注解（底层用 ImportSelector）

#### @ImportResource 导入 XML 配置

`@ImportResource` 用于导入传统的 XML 配置文件，适用于需要兼容老项目的场景。

```java
@Configuration
@ImportResource("classpath:legacy-beans.xml")
public class AppConfig { }

// 导入多个 XML 文件
@Configuration
@ImportResource({"classpath:beans.xml", "classpath:dao.xml"})
public class AppConfig { }
```

> ⚠️ Spring Boot 推荐使用 Java 配置，尽量避免使用 XML。仅在迁移老项目时使用此注解。

***

### 3.4 组件扫描

`@SpringBootApplication` 默认扫描**启动类所在包及子包**。

```
com.example/              ← 启动类所在包
├── Application.java      ✅ 会被扫描
├── controller/           ✅ 会被扫描
└── service/              ✅ 会被扫描

com.other/                ❌ 不会被扫描
```

**扩展扫描范围**：显式指定要扫描的包。**依赖中的包**默认不会被当前应用扫描到，需在此指定或通过自动配置提供 Bean。

```java
@SpringBootApplication
@ComponentScan({"com.example", "com.other"})
public class Application { }
```

***

### 3.5 依赖注入方式

| 方式         | 推荐程度    | 说明                       |
| ------------ | ----------- | -------------------------- |
| 构造函数注入 | ✅ **推荐** | 可声明 final，依赖明确     |
| 属性注入     | ⚠️ 不推荐  | 无法声明 final，不利于测试 |
| Setter 注入  | ⚠️ 可选    | 适合可选依赖               |

**属性注入（不推荐）**：

```java
@RestController
public class UserController {
    @Autowired
    private UserService userService;  // 无法声明为 final
}
```

**构造函数注入（推荐）**：

```java
@RestController
public class UserController {
    private final UserService userService;
    
    public UserController(UserService userService) {  // 单构造函数可省略 @Autowired
        this.userService = userService;
    }
}

// Lombok 简化
@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
}
```

***

### 3.6 多个同类型 Bean

当接口有多个实现时，需要指定注入哪一个：

| 方案         | 说明             | 示例                                   |
| ------------ | ---------------- | -------------------------------------- |
| `@Primary`   | 声明侧：设置首选 | 在某个实现类上加 `@Primary`            |
| `@Qualifier` | 注入侧：指定名称 | `@Autowired @Qualifier("xxxImpl")`     |
| `@Resource`  | 注入侧：按名称   | `@Resource(name = "xxxImpl")`          |

```java
// 方案一：声明时设置首选
@Primary
@Service
public class UserServiceImpl implements UserService { }

// 方案二：注入时指定名称
@Autowired
@Qualifier("userServiceV2Impl")
private UserService userService;
```

**@Autowired vs @Resource**：

| 特性     | @Autowired          | @Resource        |
| -------- | ------------------- | ---------------- |
| 来源     | Spring              | JDK（JSR-250）   |
| 注入方式 | 默认按**类型**      | 默认按**名称**   |
| 指定名称 | 需配合 `@Qualifier` | 使用 `name` 属性 |

***

### 3.7 Bean 作用域与创建时机

#### 作用域

**Bean 作用域**决定容器中 Bean 的实例数量与存活范围。未指定时默认为 `singleton`，无需显式写 `@Scope`。

| 作用域      | 说明                   | 创建时机       | 使用场景              |
| ----------- | ---------------------- | -------------- | --------------------- |
| **singleton** | 单例（默认）           | 容器启动时     | 无状态的 Service、Dao |
| **prototype** | 每次获取创建新实例     | 每次获取时     | 有状态的 Bean         |
| **request**   | 每个 HTTP 请求一个实例 | 每次请求时     | Web 应用              |
| **session**   | 每个 HTTP Session 一个 | Session 创建时 | Web 应用              |

> **注意**：`request`、`session` 仅在 Web 环境下有效；非 Web 或 WebFlux 下使用会报错。

```java
@Service
@Scope("prototype")  // 不写时默认 singleton
public class PrototypeService { }
```

#### 延迟加载（@Lazy）

默认情况下，singleton Bean 在**容器启动时**创建。使用 `@Lazy` 可延迟到**第一次使用时**才创建。

```java
@Service
@Lazy  // 延迟加载，第一次注入或获取时才创建
public class HeavyService { }
```

**使用场景**：
- Bean 初始化耗时较长，但不一定会被使用
- 解决循环依赖问题
- 加快应用启动速度

**注入时也需要 @Lazy**：

```java
@RestController
public class UserController {
    
    @Lazy  // 注入点也要加 @Lazy，否则会触发立即创建
    @Autowired
    private HeavyService heavyService;
}
```

#### 依赖顺序（@DependsOn）

`@DependsOn` 用于指定 Bean 的初始化顺序，确保依赖的 Bean 先创建。

```java
@Service
@DependsOn("cacheManager")  // 确保 cacheManager 先初始化
public class UserService { }

// 指定多个依赖
@Service
@DependsOn({"dataSource", "cacheManager"})
public class OrderService { }
```

**使用场景**：
- Bean 之间有隐式依赖（不通过 `@Autowired`，而是通过静态方法或全局变量）
- 需要确保某些基础设施 Bean 先初始化

> 💡 如果 Bean 之间有显式依赖（`@Autowired`），Spring 会自动处理顺序，无需 `@DependsOn`。

***

## 四、Bean 生命周期

### 4.1 生命周期流程

Bean 从创建到销毁经历的阶段如下。**AOP 代理**在步骤 8 的 `postProcessAfterInitialization` 中生成，之后 Bean 进入可用状态。

```
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
      ↓
6. InitializingBean.afterPropertiesSet()
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
      ↓
11. DisposableBean.destroy()
      ↓
12. 自定义 destroy-method
   - @Bean(destroyMethod = "cleanup")
```

***

### 4.2 初始化与销毁回调

```java
@Component
@Slf4j
public class MyBean implements InitializingBean, DisposableBean, BeanNameAware {

    private String beanName;

    @Override
    public void setBeanName(String name) {
        this.beanName = name;
        log.info("1. BeanNameAware.setBeanName: {}", name);
    }

    @PostConstruct
    public void postConstruct() {
        log.info("2. @PostConstruct 执行");
    }

    @Override
    public void afterPropertiesSet() {
        log.info("3. InitializingBean.afterPropertiesSet 执行");
    }

    @PreDestroy
    public void preDestroy() {
        log.info("4. @PreDestroy 执行");
    }

    @Override
    public void destroy() {
        log.info("5. DisposableBean.destroy 执行");
    }
}
```

> 💡 **推荐使用 `@PostConstruct` 和 `@PreDestroy`**，代码简洁且与 Spring 解耦。

***

### 4.3 启动时执行任务

| 方式                    | 执行时机             | 说明                       |
| ----------------------- | -------------------- | -------------------------- |
| `@PostConstruct`        | 单个 Bean 初始化后   | 仅针对当前 Bean            |
| `CommandLineRunner`     | 所有 Bean 初始化后   | 接收原始命令行参数         |
| `ApplicationRunner`     | 所有 Bean 初始化后   | 接收解析后的命令行参数     |
| `ApplicationReadyEvent` | 应用完全就绪后       | 最后执行                   |

#### CommandLineRunner

```java
@Component
@Order(1)  // 数字越小越先执行
public class MyCommandLineRunner implements CommandLineRunner {
    @Override
    public void run(String... args) {
        // args 是命令行参数，字符串数组形式
        System.out.println("参数: " + Arrays.toString(args));
    }
}
```

#### ApplicationRunner

```java
@Component
@Order(2)
public class MyApplicationRunner implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) {
        // ApplicationArguments 提供更丰富的参数解析
        System.out.println("Non-option args: " + args.getNonOptionArgs());
        System.out.println("Option names: " + args.getOptionNames());
        
        // 获取 --name=value 形式的参数
        if (args.containsOption("env")) {
            System.out.println("env = " + args.getOptionValues("env"));
        }
    }
}
```

#### ApplicationReadyEvent

```java
@Component
public class MyListener {
    @EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        System.out.println("应用已完全就绪");
    }
}
```

**执行顺序**：`@PostConstruct` → `CommandLineRunner` → `ApplicationRunner` → `ApplicationReadyEvent`

***

## 五、配置管理

### 5.1 配置文件格式

| 类型           | 文件名                   | 特点             |
| -------------- | ------------------------ | ---------------- |
| **properties** | `application.properties` | 传统键值对格式   |
| **yml**        | `application.yml`        | 层级结构（推荐） |

**位置**：`src/main/resources/`

```yaml
# yml 格式示例
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: 123456
```

***

### 5.2 yml 语法

| 规则         | 说明                               |
| ------------ | ---------------------------------- |
| 冒号后空格   | `port: 8080`，冒号后必须有空格     |
| 缩进表示层级 | 只能用空格、不能用 Tab，通常 2 空格一级 |
| `#` 表示注释 | 从 `#` 到行尾都是注释               |
| 大小写敏感   | `Port` ≠ `port`                    |

#### 数据格式

```yaml
# ① 对象 / Map
user:
  name: 张三
  age: 18
# 行内写法
user: {name: 张三, age: 18}

# ② 数组 / List
hobby:
  - java
  - game
# 行内写法
hobby: [java, game]

# ③ 对象数组
users:
  - name: 张三
    age: 18
  - name: 李四
    age: 20

# ④ 纯量（基本类型）
name: 张三                    # 字符串
age: 18                       # 数值
enabled: true                 # 布尔
data: null                    # 空值
data: ~                       # 空值（另一种写法）

# ⑤ 引号区别
msg1: "Hello\nWorld"          # 双引号：识别转义
msg2: 'Hello\nWorld'          # 单引号：原样输出
```

***

### 5.3 常用配置项

```yaml
server:
  port: 8080
  servlet:
    context-path: /api
  tomcat:
    max-threads: 200
    uri-encoding: UTF-8

spring:
  # 数据源
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/mydb?serverTimezone=Asia/Shanghai
    username: root
    password: 123456
  
  # 文件上传
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 100MB

# MyBatis
mybatis:
  type-aliases-package: com.example.pojo
  mapper-locations: classpath:mapper/*.xml
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

# 日志
logging:
  level:
    root: INFO
    com.example.mapper: DEBUG
  file:
    name: logs/app.log
```

***

### 5.4 获取配置值

#### @Value 注入

```java
@Value("${server.port}")
private Integer port;

@Value("${app.name:默认值}")  // 带默认值
private String appName;
```

**@Value 常用写法**：

| 写法                             | 说明                           |
| -------------------------------- | ------------------------------ |
| `@Value("${app.name}")`          | 直接注入，配置不存在则启动报错 |
| `@Value("${app.name:默认值}")`   | 配置不存在时使用默认值         |
| `@Value("${app.name:}")`         | 配置不存在时使用空字符串       |
| `@Value("${app.count:0}")`       | 数值类型默认值                 |
| `@Value("${app.enabled:false}")` | 布尔类型默认值                 |

#### @ConfigurationProperties 批量绑定

```yaml
app:
  name: MyApp
  version: 1.0.0
  author:
    name: 张三
    email: test@example.com
  servers:
    - host: server1.example.com
      port: 8080
    - host: server2.example.com
      port: 8081
```

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

**两种方式对比**：

| 特性         | @Value           | @ConfigurationProperties             |
| ------------ | ---------------- | ------------------------------------ |
| **适用场景** | 少量简单配置     | 大量/复杂配置                        |
| **嵌套对象** | 不支持           | 支持                                 |
| **列表/Map** | 支持（写法复杂） | 支持（写法简单）                     |
| **松散绑定** | 不支持           | 支持（驼峰、下划线、短横线自动转换） |
| **类型安全** | 需手动指定类型   | 自动类型转换                         |

***

### 5.5 外部化配置

除配置文件外，还可通过以下方式传递配置：

#### 命令行参数

```bash
java -jar app.jar --server.port=9090 --spring.profiles.active=prod
```

**使用场景**：临时调试、快速切换端口。

#### Java 系统属性

```bash
# -D 参数必须在 -jar 之前
java -Dserver.port=9090 -Dfile.encoding=UTF-8 -jar app.jar
```

**使用场景**：设置 JVM 级别的属性、编码、时区。

#### 环境变量

```bash
# Linux/Mac
export SERVER_PORT=9090
export SPRING_DATASOURCE_PASSWORD=secret
java -jar app.jar

# 一行命令
SERVER_PORT=9090 java -jar app.jar

# Windows CMD
set SERVER_PORT=9090
java -jar app.jar
```

**命名转换**：`server.port` → `SERVER_PORT`（小写转大写，`.` 和 `-` 转 `_`）

**配置文件引用环境变量**：

```yaml
spring:
  datasource:
    # 方式一：直接使用环境变量
    password: ${DB_PASSWORD}
    # 方式二：带默认值（环境变量不存在时使用默认值）
    username: ${DB_USERNAME:root}
```

**使用场景**：Docker/K8s 部署、敏感信息、CI/CD 流水线。

***

### 5.6 多环境配置

#### 方式一：多文件配置

**命名规则**：`application-{profile}.yml` 或 `application-{profile}.yaml`（`.properties` 同理）。`{profile}` 自定义，Spring Boot 无内置名；扩展名 `.yml` 与 `.yaml` 等价。

**加载顺序**：先加载 `application.yml`，再按 `spring.profiles.active` 加载对应的 `application-{profile}.yml`；同 key 时 profile 文件中的值覆盖主文件。若激活的 profile 没有对应文件，不报错，仅使用主文件与已存在的 profile 文件。

| 常见 profile | 用途说明 |
| ------------ | -------- |
| **dev**      | 开发环境（共享开发库/服务） |
| **test**     | 测试环境 |
| **prod**     | 生产环境 |
| **staging**  | 预发/演练环境 |
| **local**    | 本机环境（本机数据库、本机中间件，与 dev 隔离） |

**多 profile 同时激活**：`spring.profiles.active=dev,local` 可写多个，逗号分隔；多个 profile 文件都会加载，后出现的 profile 中同 key 覆盖前面的（如 local 覆盖 dev）。

```
resources/
├── application.yml           # 主配置 + 激活环境
├── application-dev.yml      # 开发环境
├── application-test.yml     # 测试环境
├── application-prod.yml     # 生产环境
└── application-local.yml    # 可选：本机环境
```

```yaml
# application.yml
spring:
  profiles:
    active: dev  # 激活开发环境

# 公共配置
mybatis:
  configuration:
    map-underscore-to-camel-case: true
```

```yaml
# application-dev.yml
server:
  port: 8080
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/dev_db
```

```yaml
# application-prod.yml
server:
  port: 80
spring:
  datasource:
    url: jdbc:mysql://prod-server:3306/prod_db
    password: ${DB_PASSWORD}
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

#### 激活方式

| 方式       | 示例                            | 优先级 |
| ---------- | ------------------------------- | ------ |
| 配置文件   | `spring.profiles.active=dev`    | 低     |
| 环境变量   | `SPRING_PROFILES_ACTIVE=prod`   | 中     |
| JVM 参数   | `-Dspring.profiles.active=prod` | 高     |
| 命令行参数 | `--spring.profiles.active=prod` | 最高   |

```bash
java -jar app.jar --spring.profiles.active=prod
java -Dspring.profiles.active=prod -jar app.jar
```

***

### 5.7 配置优先级

当同一配置在多处定义时，按以下优先级生效（高优先级覆盖低优先级）：

| 优先级    | 配置来源         | 示例                        |
| --------- | ---------------- | --------------------------- |
| 1（最高） | 命令行参数       | `--server.port=9090`        |
| 2         | Java 系统属性    | `-Dserver.port=9090`        |
| 3         | 环境变量         | `SERVER_PORT=9090`          |
| 4         | jar 包外配置文件 | `./config/application.yml`  |
| 5         | jar 包内配置文件 | `classpath:application.yml` |
| 6（最低） | 代码默认值       | `@Value` 默认值             |

#### 配置文件位置优先级

```
1. ./config/application.yml            # 项目根目录下的 config 目录（最高）
2. ./application.yml                   # 项目根目录
3. classpath:/config/application.yml   # 类路径下的 config 目录
4. classpath:/application.yml          # 类路径根目录（最常用）
```

> 💡 **建议**：开发用配置文件，生产敏感信息用环境变量，临时调试用命令行参数。

***

## 附录：核心注解速查表

### 启动与配置

| 注解                       | 说明                               |
| -------------------------- | ---------------------------------- |
| `@SpringBootApplication`   | 启动类注解（组合注解）             |
| `@SpringBootConfiguration` | 标识配置类（等同于@Configuration） |
| `@Configuration`           | 声明配置类                         |
| `@EnableAutoConfiguration` | 开启自动配置                       |
| `@ComponentScan`           | 组件扫描                           |
| `@Import`                  | 导入配置类/普通类/ImportSelector   |
| `@ImportResource`          | 导入 XML 配置文件                  |

### Bean 声明

| 注解              | 说明                                       |
| ----------------- | ------------------------------------------ |
| `@Component`      | 通用组件                                   |
| `@Service`        | 业务层组件                                 |
| `@Controller`     | 控制器组件                                 |
| `@RestController` | REST 控制器（@Controller + @ResponseBody） |
| `@Repository`     | 数据层组件                                 |
| `@Bean`           | 方法级 Bean 声明                           |
| `@Scope`          | Bean 作用域                                |
| `@Primary`        | 设置首选 Bean                              |
| `@Lazy`           | 延迟初始化                                 |
| `@DependsOn`      | 指定 Bean 依赖顺序                         |

### 依赖注入

| 注解                       | 说明                   |
| -------------------------- | ---------------------- |
| `@Autowired`               | 按类型注入             |
| `@Qualifier`               | 指定 Bean 名称         |
| `@Resource`                | 按名称注入（JDK 标准） |
| `@Value`                   | 注入配置值             |
| `@ConfigurationProperties` | 批量绑定配置           |

### 生命周期

| 注解             | 说明              |
| ---------------- | ----------------- |
| `@PostConstruct` | Bean 初始化后执行 |
| `@PreDestroy`    | Bean 销毁前执行   |
| `InitializingBean.afterPropertiesSet()` | 初始化回调（同 @PostConstruct） |
| `DisposableBean.destroy()` | 销毁回调（同 @PreDestroy） |
| `@Order`         | 指定执行顺序      |
| `@EventListener` | 监听应用事件      |

### 条件注解

| 注解                           | 说明                         |
| ------------------------------ | ---------------------------- |
| `@ConditionalOnClass`          | 类路径存在指定类时生效       |
| `@ConditionalOnMissingClass`   | 类路径不存在指定类时生效     |
| `@ConditionalOnBean`           | 容器中存在指定 Bean 时生效   |
| `@ConditionalOnMissingBean`    | 容器中不存在指定 Bean 时生效 |
| `@ConditionalOnProperty`       | 配置属性满足条件时生效       |
| `@ConditionalOnWebApplication` | 是 Web 应用时生效            |
