## 一、Spring Boot 概述

### 1.1 简介与核心特性

**Spring Boot** 是基于 Spring Framework 的快速开发框架，用于简化 Spring 应用的搭建、配置、运行与部署过程。

| 特性       | 说明                                            |
| ---------- | ----------------------------------------------- |
| 快速构建   | 提供各种起步依赖，简化构建配置                  |
| 内嵌服务器 | 内置 Tomcat、Jetty、Undertow，无需部署 WAR 文件 |
| 自动配置   | 尽可能自动配置 Spring 和第三方库                |
| 无需 XML   | 提倡使用 Java 配置，摆脱繁琐的 XML 配置         |
| 生产级特性 | 提供运行时监控、健康检查、外部化配置等功能      |

#### Spring Boot 主要解决什么问题

| 开发痛点 | 传统 Spring 开发方式 | Spring Boot 的处理方式 |
| -------- | -------------------- | ---------------------- |
| **依赖繁杂** | 需要手动挑选并维护一组依赖及版本 | 通过 `starter` 聚合依赖，版本由 Spring Boot 统一管理 |
| **配置繁琐** | 需要编写大量 XML 或 Java 配置 | 借助自动配置提供默认 Bean 与默认行为 |
| **启动麻烦** | 需要打 WAR 并部署到外部容器 | 内嵌 Tomcat/Jetty/Undertow，直接运行 main 方法 |
| **环境切换零散** | 配置分散在代码、XML、服务器参数中 | 统一使用外部化配置和 Profile 管理 |
| **生产运维支持弱** | 健康检查、指标、信息暴露需自行组装 | Actuator 等能力可直接接入 |

#### 学习主线

理解 Spring Boot 时，可以先抓住 4 条主线：

1. **Starter** 负责把某类能力需要的依赖带进来
2. **自动配置** 负责根据依赖和条件创建默认 Bean
3. **配置文件** 负责修改默认行为
4. **用户自定义 Bean** 负责覆盖或补充默认实现

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

#### Spring Boot、Spring MVC、Spring Cloud 的关系

| 技术 | 关注点 | 解决的问题 |
| ---- | ------ | ---------- |
| **Spring Framework** | IOC、AOP、数据访问、MVC 等基础能力 | 提供企业应用开发的基础设施 |
| **Spring MVC** | Web 请求分发、参数绑定、视图解析 | 处理 Web 层开发 |
| **Spring Boot** | 自动配置、内嵌容器、启动与部署简化 | 提升单体应用或微服务的开发效率 |
| **Spring Cloud** | 服务治理、注册发现、配置中心、网关等 | 解决分布式系统协作问题 |

> 💡 **Spring Boot 不是 Spring MVC 的替代品**。Web 项目中常见的关系是：Spring Boot 负责装配和启动，Spring MVC 负责处理 Web 请求。

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

#### 最小项目结构

```text
src/main/java
└── com/example
  ├── Application.java          # 启动类，尽量放在根包
  └── controller
    └── HelloController.java

src/main/resources
└── application.yml
```

> 💡 启动类通常放在项目的**根包**下，这样 `@SpringBootApplication` 的默认组件扫描才能覆盖业务代码所在子包。

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

#### Starter、自动配置、依赖管理的分工

| 组成部分 | 本质 | 主要职责 |
| -------- | ---- | -------- |
| **Starter** | 依赖聚合器 | 把某类场景需要的依赖一起引入 |
| **AutoConfiguration** | 一组配置类 | 按条件创建默认 Bean、组装默认行为 |
| **依赖管理/BOM** | 版本约束清单 | 统一各类依赖版本，减少冲突 |

> 💡 可以把它理解成：`starter` 负责“带材料”，自动配置负责“默认装配”，配置文件负责“调参数”。

***

### 2.3 自动配置原理

**自动配置**：根据引入的依赖自动配置 Spring，无需手动编写大量配置。

先从开发视角记住自动配置的核心：**Spring Boot 先判断条件，再决定是否注册默认 Bean。**

| 核心理解 | 说明 |
| -------- | ---- |
| **有相关依赖** | 类路径里先要有对应能力需要的类 |
| **条件满足** | 属性、Bean、应用类型等条件要通过 |
| **用户没自己定义** | 如果用户已经声明同类 Bean，默认配置通常让位 |

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

#### 自动配置生效的常见前提

| 前提 | 典型判断方式 | 示例 |
| ---- | ------------ | ---- |
| **相关依赖已引入** | `@ConditionalOnClass` | 引入 JDBC 依赖后才可能配置数据源 |
| **配置项满足条件** | `@ConditionalOnProperty` | 开启某个开关后才创建对应 Bean |
| **用户未自定义同类 Bean** | `@ConditionalOnMissingBean` | 用户自己声明 `DataSource` 后，默认数据源退场 |

自动配置的常见运行模式可以概括为：

```text
引入 starter
  ↓
类路径中出现相关依赖
  ↓
自动配置类被候选加载
  ↓
条件注解判断通过
  ↓
注册默认 Bean
  ↓
若用户自定义了同类 Bean，则优先使用用户 Bean
```

#### 开发中先记住这 3 个结论

| 结论 | 说明 |
| ---- | ---- |
| **自动配置不是无条件生效** | 它依赖一组 `@Conditional...` 条件注解 |
| **自动配置本质上是在补默认值** | 目的是少写配置，而不是禁止自定义 |
| **用户配置优先于默认配置** | 自己声明 Bean 后，很多默认 Bean 就不会再创建 |

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

#### 自动配置排查方式

| 排查方式 | 作用 |
| -------- | ---- |
| `debug: true` | 启动时输出条件评估报告 |
| 查看 `ConditionEvaluationReport` | 判断某个自动配置为什么生效/不生效 |
| `mvn dependency:tree` | 确认相关依赖是否真的在类路径中 |
| 查看 `@Conditional...` 注解 | 判断受哪些类、属性、Bean 条件控制 |
| 查看 `/actuator/conditions` | 运行中查看条件评估结果（需引入 Actuator） |

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

| 服务器 | 特点 | 常见场景 |
| ------ | ---- | -------- |
| **Tomcat** | 生态成熟、资料多、默认选择 | 大多数传统 Web 项目 |
| **Jetty** | 轻量、嵌入式体验较好 | 对 Jetty 生态熟悉的项目 |
| **Undertow** | 启动快、线程模型简洁 | 追求轻量和较高吞吐的场景 |

***

### 2.5 启动流程

**启动流程** 讲的是整个 Spring Boot 应用从 `main()` 方法开始，到应用可对外提供服务的过程。

| 关注点 | 典型问题 |
| ------ | -------- |
| **配置什么时候加载** | `application.yml` 在哪一步生效 |
| **Bean 什么时候创建** | 容器在哪一步开始实例化单例 Bean |
| **应用什么时候 ready** | Runner 和 `ApplicationReadyEvent` 何时执行 |

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

#### 开发中先记住这 3 个结论

| 结论 | 说明 |
| ---- | ---- |
| **配置先于 Bean 创建** | Spring 先准备环境，再创建容器和 Bean |
| **自动配置属于启动流程的一部分** | 它发生在容器准备阶段，不是应用跑起来之后再补配 |
| **`ApplicationReadyEvent` 最靠后** | 它表示应用已经基本准备完毕，可以对外提供服务 |

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

#### Bean 没被扫描到的常见原因

| 现象 | 常见原因 | 处理方式 |
| ---- | -------- | -------- |
| **启动时报找不到 Bean** | 类不在启动类所在包及子包下 | 调整包结构或补 `@ComponentScan` |
| **第三方类无法直接注入** | 第三方类不能加 `@Component` | 用 `@Configuration + @Bean` 显式注册 |
| **Mapper/Feign 接口未生效** | 需要额外启用扫描注解 | 使用 `@MapperScan`、`@EnableFeignClients` 等 |
| **明明写了注解却不生效** | 注解加在未被 Spring 管理的类上 | 确保该类本身由容器创建 |

***

### 3.5 依赖注入方式

**依赖注入方式** 的选择，本质上是在解决“依赖是否清晰、是否便于测试、是否容易误用”的问题。

| 方式         | 推荐程度    | 说明                       |
| ------------ | ----------- | -------------------------- |
| 构造函数注入 | ✅ **推荐** | 可声明 final，依赖明确     |
| 属性注入     | ⚠️ 不推荐  | 无法声明 final，不利于测试 |
| Setter 注入  | ⚠️ 可选    | 适合可选依赖               |

#### 开发中直接采用的原则

| 场景 | 优先选择 |
| ---- | -------- |
| **绝大多数业务 Bean** | 构造函数注入 |
| **依赖是可选项** | Setter 注入 |
| **历史代码或简单示例** | 可能看到属性注入，但不建议延续 |

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

**多个同类型 Bean** 的问题，本质上是：Spring 能按类型找到多个候选对象，但不知道该注入哪一个。

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
| 来源     | Spring              | Jakarta Annotations（历史上属 JSR-250） |
| 注入方式 | 默认按**类型**      | 默认按**名称**   |
| 指定名称 | 需配合 `@Qualifier` | 使用 `name` 属性 |

#### 注入一组同类型 Bean

除了只注入一个 Bean，也可以一次性注入一组实现：

```java
@Service
public class NotifyService {

  private final List<MessageSender> senders;
  private final Map<String, MessageSender> senderMap;

  public NotifyService(List<MessageSender> senders,
             Map<String, MessageSender> senderMap) {
    this.senders = senders;
    this.senderMap = senderMap;
  }
}
```

| 注入形式 | 说明 |
| -------- | ---- |
| `List<MessageSender>` | 注入所有同类型 Bean，适合顺序遍历 |
| `Map<String, MessageSender>` | 键为 Bean 名称，适合按名称选择实现 |

***

### 3.7 Bean 作用域与创建时机

**Bean 作用域** 决定的是“容器里有几个实例”，**创建时机** 决定的是“这些实例什么时候被创建出来”。

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

#### request/session 与 ScopedProxy

当 **request/session 作用域的 Bean 被注入到 singleton**（如 Service）时，单例在容器启动时只创建一次，此时尚无 HTTP 请求，无法拿到“当前请求”的 request 实例。若不使用代理，注入会失败或得到错误复用的实例。

**结论**：注册 request/session 作用域的 Bean 本身不强制要求 ScopedProxy；一旦被单例依赖，需配置 `proxyMode = ScopedProxyMode.TARGET_CLASS`（或 `INTERFACES`），否则行为错误。

| proxyMode              | 说明                         |
| ---------------------- | ---------------------------- |
| **TARGET_CLASS**       | CGLIB 代理类（无接口时使用） |
| **INTERFACES**         | JDK 动态代理（Bean 有接口时） |

```java
// 方式一：@Scope + proxyMode
@Component
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestScopedBean { }

// 方式二：@RequestScope（Spring 4.3+）
@Component
@RequestScope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestScopedBean { }
```

若 request/session Bean **仅被同作用域或 Controller 注入**、不参与单例依赖链，可不配 ScopedProxy；实际项目中多数会被单例依赖，因此通常需要配置。

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

### 4.1 什么是 Bean 生命周期

**Bean 生命周期** 指一个 Bean 从被 Spring 创建、完成依赖注入、执行初始化逻辑，到最终被销毁的全过程。

从日常开发视角看，最常遇到的是这 5 个阶段：

```text
对象创建
  ↓
依赖注入
  ↓
初始化
  ↓
业务使用
  ↓
容器关闭时销毁
```

| 阶段 | Spring 在做什么 | 开发中最常接触的点 |
| ---- | --------------- | ------------------ |
| **对象创建** | 调用构造方法创建对象 | 构造方法 |
| **依赖注入** | 注入 `@Autowired`、`@Value` 等依赖 | 成员变量、构造器参数 |
| **初始化** | 执行初始化逻辑 | `@PostConstruct` |
| **业务使用** | Bean 进入可用状态 | Controller / Service 正常调用 |
| **销毁** | 容器关闭前执行清理逻辑 | `@PreDestroy` |

#### 开发中先记住这 4 个结论

| 结论 | 说明 |
| ---- | ---- |
| **构造方法先执行** | 这时对象刚创建，依赖通常还没注入完成 |
| **依赖注入发生在构造方法之后** | 所以不要在构造方法里依赖 `@Autowired` 字段做复杂逻辑 |
| **`@PostConstruct` 在注入完成后执行** | 适合初始化缓存、校验配置、注册监听器 |
| **`@PreDestroy` 在 Bean 销毁前执行** | 适合释放连接、线程池、缓存等资源 |

#### 容易混淆的点

| 问题 | 正确认识 |
| ---- | -------- |
| **构造方法和 `@PostConstruct` 有什么区别** | 构造方法更早；`@PostConstruct` 要等依赖注入完成后执行 |
| **Bean 生命周期和应用启动流程是不是一回事** | 不是。生命周期看单个 Bean，启动流程看整个应用 |
| **`@PreDestroy` 会不会每次调用方法后执行** | 不会，它只在容器关闭、Bean 即将销毁时执行 |
| **业务里怎么做到“初始化后再使用 Bean”** | 正常通过依赖注入拿到 Bean，在业务方法里调用即可，Spring 会先把它初始化好 |

***

### 4.2 开发中最常用的生命周期写法

日常开发里，最值得先掌握的是这 4 类写法：

| 写法 | 执行时机 | 适合做什么 | 推荐程度 |
| ---- | -------- | ---------- | -------- |
| **构造方法** | 对象创建时 | 最基础的对象创建与简单赋值 | ✅ 可用 |
| **`@PostConstruct`** | 依赖注入完成后 | 初始化缓存、做启动校验、注册监听器 | ✅ **最常用** |
| **`@PreDestroy`** | Bean 销毁前 | 资源回收、关闭连接、清理缓存 | ✅ **最常用** |
| **`@Bean(initMethod / destroyMethod)`** | 初始化后 / 销毁前 | 第三方类初始化与清理 | ✅ 特定场景 |

#### 最常见用法：`@PostConstruct` + `@PreDestroy`

```java
@Component
@RequiredArgsConstructor
public class CacheService {

    private final PermissionMapper permissionMapper;
    private final Map<Long, String> permissionCache = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        List<Permission> permissions = permissionMapper.selectList(null);
        for (Permission permission : permissions) {
            permissionCache.put(permission.getId(), permission.getCode());
        }
    }

    @PreDestroy
    public void clear() {
        permissionCache.clear();
    }
}
```

| 写法 | 应放逻辑 |
| ---- | -------- |
| **构造方法** | 最基础的字段初始化 |
| **`@PostConstruct`** | 依赖已经注入完成后才能执行的初始化逻辑 |
| **`@PreDestroy`** | 容器关闭前的清理逻辑 |

> 💡 业务开发里，优先记住 `@PostConstruct` 和 `@PreDestroy` 即可，其他扩展点是进阶内容。

***

### 4.3 `@PostConstruct` 详解

**`@PostConstruct`** 是 Bean 初始化阶段最常用的回调注解。它表示：**当前 Bean 的依赖已经注入完成，Spring 现在开始执行它自己的初始化逻辑。**

| 对比项 | `@PostConstruct` | 构造方法 |
| ------ | ---------------- | -------- |
| **执行时机** | 依赖注入完成后 | 对象刚创建时 |
| **能否安全使用注入依赖** | **可以** | 通常不适合 |
| **常见用途** | 初始化缓存、注册监听器、检查配置 | 简单赋值、创建基础对象 |

#### `@PostConstruct` 适合做什么

| 适合场景 | 说明 |
| -------- | ---- |
| **初始化缓存** | 启动时把字典、权限、配置等数据读入内存 |
| **注册监听器** | 依赖其他 Bean 已就绪后，再进行监听注册 |
| **做启动校验** | 检查关键配置是否缺失，缺失则直接启动失败 |
| **准备运行时状态** | 构建索引、映射表、线程安全容器等 |

#### `@PostConstruct` 不适合做什么

| 不推荐场景 | 原因 |
| ---------- | ---- |
| **特别耗时的初始化** | 会直接拖慢启动 |
| **大量不稳定的远程调用** | 初始化失败可能导致整个 Bean 创建失败 |
| **与当前 Bean 无关的全局启动任务** | 更适合 `CommandLineRunner`、`ApplicationRunner`、`ApplicationReadyEvent` |

#### 与启动钩子的区别

| 方式 | 执行时机 | 适合场景 |
| ---- | -------- | -------- |
| **`@PostConstruct`** | 单个 Bean 初始化后 | 初始化当前 Bean 自己依赖的资源 |
| **`CommandLineRunner`** | 所有 Bean 初始化后 | 执行启动任务 |
| **`ApplicationRunner`** | 所有 Bean 初始化后 | 处理结构化启动参数 |
| **`ApplicationReadyEvent`** | 应用完全就绪后 | 应用可以对外服务后再执行 |

> 💡 简单判断：**只影响当前 Bean，用 `@PostConstruct`；影响整个应用启动，用 Runner 或应用事件。**

#### 使用注意事项

| 注意点 | 说明 |
| ------ | ---- |
| **Spring Boot 3.x 导包** | 使用 `jakarta.annotation.PostConstruct` |
| **方法签名** | 通常为无参、无返回值实例方法 |
| **异常影响** | 抛异常会导致当前 Bean 初始化失败 |
| **执行次数** | 单例 Bean 一般只在容器启动时执行一次 |

***

### 4.4 进阶了解：底层扩展点执行顺序

除了日常开发最常用的注解，Spring 底层还有一组生命周期扩展点。它们更偏框架机制理解，不是业务开发的第一优先级。

| 扩展点 | 作用 | 日常开发使用频率 |
| ------ | ---- | ---------------- |
| `BeanNameAware` 等 Aware 接口 | 让 Bean 感知容器信息 | 低 |
| `BeanPostProcessor` | 在初始化前后统一处理 Bean | 中 |
| `InitializingBean` | 初始化回调接口 | 低 |
| `DisposableBean` | 销毁回调接口 | 低 |
| `initMethod` / `destroyMethod` | 为第三方类指定初始化与销毁方法 | 中 |

完整顺序大致如下：

```text
构造方法
  ↓
依赖注入
  ↓
Aware 接口回调
  ↓
BeanPostProcessor 初始化前处理
  ↓
@PostConstruct
  ↓
InitializingBean.afterPropertiesSet()
  ↓
自定义 initMethod
  ↓
BeanPostProcessor 初始化后处理
  ↓
Bean 可用
  ↓
@PreDestroy
  ↓
DisposableBean.destroy()
  ↓
自定义 destroyMethod
```

> **注意**：AOP 代理通常在初始化后处理阶段生成，因此某些依赖代理的行为，在 `@PostConstruct` 阶段未必已经完全处于最终形态。

***

### 4.5 启动时执行任务

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

**执行顺序**：`@PostConstruct` → `CommandLineRunner` / `ApplicationRunner` → `ApplicationReadyEvent`

| 需求 | 更适合的方式 |
| ---- | ------------ |
| **初始化当前 Bean 自己的数据** | `@PostConstruct` |
| **启动时跑一段脚本或预热任务** | `CommandLineRunner` |
| **需要读取结构化启动参数** | `ApplicationRunner` |
| **等应用完全 ready 后再执行** | `ApplicationReadyEvent` |

***

## 五、配置管理

### 5.1 配置文件种类

Spring Boot 应用中，配置文件按用途分为以下几类：

| 文件名 | 用途 | 加载时机 |
| ------ | ---- | -------- |
| `application.yml` | **主配置文件**，应用的默认配置 | ApplicationContext 初始化时 |
| `application-{profile}.yml` | **Profile 专属配置**，激活后覆盖主配置的同键值 | ApplicationContext 初始化时，主配置之后 |
| `bootstrap.yml` | **引导配置**，连接配置中心、加解密密钥等场景 | BootstrapContext 初始化时（早于 ApplicationContext） |
| `bootstrap-{profile}.yml` | **Profile 专属引导配置** | BootstrapContext 初始化时 |

配置文件默认放在 `src/main/resources/`。

**格式区别**：`application.properties`（传统键值对，每行 `key=value`）与 `application.yml`（层级结构，推荐）功能等价；`.yml` 与 `.yaml` 扩展名等价。

#### bootstrap.yml 与 application.yml

| 对比项 | bootstrap.yml | application.yml |
| ------ | ------------- | --------------- |
| **加载时机** | BootstrapContext 初始化（更早） | ApplicationContext 初始化 |
| **核心用途** | 配置中心地址、加解密密钥、服务注册名 | 应用业务配置、框架组件配置 |
| **优先级** | 高，通常不被 application.yml 中的同键值覆盖 | 可被 Profile 配置、环境变量等覆盖 |
| **依赖要求** | 需 `spring-cloud-context`（2.4+ 需显式引入） | Spring Boot 内置，无需额外依赖 |
| **适用场景** | Spring Cloud Config、Vault、Nacos 配置中心 | 绝大多数日常配置 |

**bootstrap.yml 典型内容**：

```yaml
spring:
  application:
    name: user-service            # 服务名（注册中心 + 配置中心使用）
  cloud:
    config:
      uri: http://config-server:8888   # 配置中心地址
      profile: prod                     # 远程配置的 profile
      label: main                       # git 分支
```

**Spring Boot 2.4+ 的变化**：2.4 之前，引入 `spring-cloud-context` 即自动支持 `bootstrap.yml`；2.4 起该机制改为可选，需显式引入：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>
```

> 💡 不使用 Spring Cloud 时，不需要创建 `bootstrap.yml`，纯 Spring Boot 项目只需要 `application.yml`。

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

**获取配置值** 主要有两种思路：少量配置直接取值，大量配置统一绑定。

| 思路 | 适用情况 |
| ---- | -------- |
| **直接取值** | 只有 1 到 2 个简单配置项 |
| **统一绑定** | 一组相关配置需要集中管理 |

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

#### `@ConfigurationProperties` 的注册方式

| 方式 | 说明 | 适用场景 |
| ---- | ---- | -------- |
| `@Component` + `@ConfigurationProperties` | 直接把配置类注册成 Bean | 单个配置类、最常见 |
| `@EnableConfigurationProperties(AppConfig.class)` | 显式启用配置绑定 | 第三方配置类或集中管理 |
| `@ConfigurationPropertiesScan` | 扫描指定包下的配置类 | 配置类较多时更整洁 |

#### 松散绑定（Relaxed Binding）

`@ConfigurationProperties` 支持松散绑定，即配置名写法不同，也能映射到同一个 Java 字段：

| 配置写法 | Java 字段 |
| -------- | -------- |
| `app.first-name` | `firstName` |
| `app.first_name` | `firstName` |
| `APP_FIRSTNAME` | `firstName` |

#### 配置校验

当配置项是启动必需项时，建议在绑定阶段直接做校验，而不是等业务运行时报错。

```java
@Component
@Validated
@ConfigurationProperties(prefix = "app")
public class AppProperties {

  @NotBlank
  private String name;

  @Min(1)
  @Max(65535)
  private Integer port;

  // getter / setter
}
```

| 注解 | 作用 |
| ---- | ---- |
| `@Validated` | 开启配置绑定后的参数校验 |
| `@NotBlank` | 字符串不能为空 |
| `@Min` / `@Max` | 限制数值范围 |

**两种方式对比**：

| 特性         | @Value           | @ConfigurationProperties             |
| ------------ | ---------------- | ------------------------------------ |
| **适用场景** | 少量简单配置     | 大量/复杂配置                        |
| **嵌套对象** | 不支持           | 支持                                 |
| **列表/Map** | 支持（写法复杂） | 支持（写法简单）                     |
| **松散绑定** | 不支持           | 支持（驼峰、下划线、短横线自动转换） |
| **类型安全** | 需手动指定类型   | 自动类型转换                         |

> 💡 实际开发中可以直接这样记：**零散小配置用 `@Value`，成组业务配置用 `@ConfigurationProperties`。**

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

#### 配置来源的推荐分工

| 配置类型 | 推荐放置位置 |
| -------- | ------------ |
| **通用默认配置** | `application.yml` |
| **环境差异配置** | `application-{profile}.yml` |
| **敏感信息** | 环境变量、密钥管理系统 |
| **一次性调试参数** | 命令行参数、JVM 参数 |

> **注意**：数据库密码、密钥、Token 等敏感信息不应直接提交到 Git 仓库。

***

### 5.6 多环境配置

**多环境配置** 解决的是同一套代码在开发、测试、生产环境中使用不同配置的问题。

| 配置策略 | 适用场景 |
| -------- | -------- |
| **多文件配置** | 大多数项目，结构清晰，最常见 |
| **单文件多段配置** | 配置量较小，想集中写在一个文件里 |

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

> 💡 如果没有明确约束，项目中优先使用“**多文件 + 环境变量/命令行激活**”这套方式，可读性和可维护性通常更好。

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

#### 记忆方法

```text
离启动命令越近，优先级通常越高
离代码默认值越近，优先级通常越低
```

> 💡 上表是日常开发最常见的**实用化归纳**。Spring Boot 实际的配置加载规则还会受到 Config Data、导入文件、Profile 激活顺序等因素影响，但排查大多数项目问题时可先按这张表定位。

#### 配置文件位置优先级

```
1. ./config/application.yml            # 项目根目录下的 config 目录（最高）
2. ./application.yml                   # 项目根目录
3. classpath:/config/application.yml   # 类路径下的 config 目录
4. classpath:/application.yml          # 类路径根目录（最常用）
```

> 💡 **建议**：开发用配置文件，生产敏感信息用环境变量，临时调试用命令行参数。

***

## 六、常见问题与排查

### 6.1 Bean 注入失败

**Bean 注入失败** 指 Spring 容器在创建对象时，找不到所需依赖或找到多个候选实现而无法决定注入哪一个。

| 常见报错 | 根因 | 处理方式 |
| -------- | ---- | -------- |
| `NoSuchBeanDefinitionException` | 容器中没有对应 Bean | 检查扫描范围、注解、配置类注册 |
| `NoUniqueBeanDefinitionException` | 同类型 Bean 有多个 | 使用 `@Primary`、`@Qualifier` 或按名称注入 |
| 循环依赖相关异常 | Bean 之间相互依赖 | 优先重构依赖关系，必要时用 `@Lazy` |

排查顺序：

```text
先看报错类型
  ↓
确认目标类是否被 Spring 管理
  ↓
确认包扫描或配置类注册是否覆盖到
  ↓
若有多个实现，确认是否指定 @Primary / @Qualifier
  ↓
若是构造器循环依赖，考虑拆分职责或引入延迟代理
```

> 💡 排查这类问题时，优先区分是“**根本没有这个 Bean**”还是“**有多个 Bean 不知道选哪个**”，处理思路完全不同。

***

### 6.2 自动配置没有生效

**自动配置没有生效** 往往不是“Spring Boot 失灵”，而是条件注解没有满足。

| 检查项 | 典型问题 |
| ------ | -------- |
| **依赖是否存在** | 以为引入了某个 starter，实际依赖被排除或版本不匹配 |
| **配置属性是否开启** | 某个自动配置要求显式开关属性 |
| **是否被用户 Bean 覆盖** | 已经自定义了同类型 Bean，默认配置自然失效 |
| **是否处于正确应用类型** | 某些配置只在 Servlet Web 应用或响应式应用中生效 |

常用排查命令：

```bash
# 查看依赖树
mvn dependency:tree

# 启动时打印自动配置报告
mvn spring-boot:run -Dspring-boot.run.arguments=--debug
```

***

### 6.3 配置绑定失败或值不符合预期

| 现象 | 常见原因 | 处理方式 |
| ---- | -------- | -------- |
| **字段为 `null`** | 前缀写错、类未注册为 Bean、字段无 setter | 检查 `prefix`、注册方式、访问器方法 |
| **环境变量没覆盖成功** | 命名不符合转换规则 | 确认 `server.port` 对应 `SERVER_PORT` |
| **Profile 切换后配置没变** | 激活方式被更高优先级来源覆盖 | 检查命令行参数、环境变量、JVM 参数 |
| **启动即失败** | 配置校验不通过 | 查看 `@Validated` 与约束注解的报错信息 |

> 💡 当配置问题很隐蔽时，优先确认“最终生效值来自哪里”，而不是只盯着某一个 `application.yml` 文件。

***

### 6.4 什么时候该自己写配置，而不是依赖默认配置

| 场景 | 建议 |
| ---- | ---- |
| **默认行为已经满足需求** | 直接使用 Spring Boot 默认配置 |
| **只需要改少量参数** | 优先改配置文件，而不是重写自动配置 |
| **需要替换核心组件实现** | 自定义 Bean，并理解可能覆盖默认 Bean |
| **需要统一封装某类能力** | 编写自定义 starter 或独立配置模块 |

这也是 Spring Boot 的典型使用顺序：**先用默认，后调参数，再做覆盖，最后才考虑自定义装配体系。**

***

## 附录：核心注解速查表

### 启动与配置

| 注解                       | 说明                               |
| -------------------------- | ---------------------------------- |
| `@SpringBootApplication`   | 启动类注解（组合注解）             |
| `@SpringBootConfiguration` | 标识配置类（等同于 @Configuration） |
| `@Configuration`           | 声明配置类                         |
| `@EnableAutoConfiguration` | 开启自动配置                       |
| `@ComponentScan`           | 组件扫描                           |
| `@ConfigurationPropertiesScan` | 扫描配置属性类                 |
| `@EnableConfigurationProperties` | 显式启用配置属性绑定        |
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
| `@Scope`          | Bean 作用域（request/session 被单例依赖时需 proxyMode） |
| `@RequestScope`   | request 作用域，可配 proxyMode                         |
| `@Primary`        | 设置首选 Bean                              |
| `@Lazy`           | 延迟初始化                                 |
| `@DependsOn`      | 指定 Bean 依赖顺序                         |

### 依赖注入

| 注解                       | 说明                   |
| -------------------------- | ---------------------- |
| `@Autowired`               | 按类型注入             |
| `@Qualifier`               | 指定 Bean 名称         |
| `@Resource`                | 按名称注入（Jakarta 标准） |
| `@Value`                   | 注入配置值             |
| `@ConfigurationProperties` | 批量绑定配置           |
| `@Validated`               | 配置绑定或参数校验     |

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
