## 一、起步依赖（Starter）

### 1.1 Starter 概述

**起步依赖（Starter）** 是 Spring Boot 的核心特性之一，它将一组相关的依赖打包在一起，简化了 Maven/Gradle 的依赖管理。

#### 传统方式 vs Starter

```xml
<!-- 传统方式：手动管理每个依赖及版本 -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>5.3.23</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>5.3.23</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.13.4</version>
</dependency>
<!-- 还需要 Tomcat、Validation 等... -->

<!-- Starter 方式：一个依赖搞定 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

#### Starter 的优势

| 优势     | 说明                                            |
| -------- | ----------------------------------------------- |
| 简化依赖 | 一个 Starter 代替多个依赖                       |
| 版本统一 | 所有依赖版本由 Spring Boot 统一管理，避免冲突   |
| 开箱即用 | 引入 Starter 即可使用，配合自动配置无需手动配置 |
| 传递依赖 | 自动引入所需的传递依赖                          |

***

### 1.2 Starter 命名规则

| 类型   | 命名规则                  | 示例                          |
| ------ | ------------------------- | ----------------------------- |
| 官方   | `spring-boot-starter-*`   | `spring-boot-starter-web`     |
| 第三方 | `*-spring-boot-starter`   | `mybatis-spring-boot-starter` |
| 自定义 | `xxx-spring-boot-starter` | `sms-spring-boot-starter`     |

> 💡 这种命名约定能让开发者快速区分官方和第三方 Starter。

***

### 1.3 常用官方 Starter

| Starter                          | 说明                             |
| -------------------------------- | -------------------------------- |
| `spring-boot-starter`            | 核心 Starter，包含自动配置、日志 |
| `spring-boot-starter-web`        | Web 开发（MVC、Tomcat、Jackson） |
| `spring-boot-starter-webflux`    | 响应式 Web 开发（WebFlux）       |
| `spring-boot-starter-data-jpa`   | JPA 数据访问（Hibernate）        |
| `spring-boot-starter-data-redis` | Redis 数据访问                   |
| `spring-boot-starter-jdbc`       | JDBC 数据访问                    |
| `spring-boot-starter-test`       | 测试支持（JUnit、Mockito）       |
| `spring-boot-starter-security`   | Spring Security 安全框架         |
| `spring-boot-starter-actuator`   | 应用监控与管理                   |
| `spring-boot-starter-validation` | 数据校验（Hibernate Validator）  |
| `spring-boot-starter-aop`        | AOP 支持                         |
| `spring-boot-starter-cache`      | 缓存抽象                         |
| `spring-boot-starter-mail`       | 邮件发送                         |
| `spring-boot-starter-amqp`       | RabbitMQ 消息队列                |
| `spring-boot-starter-quartz`     | Quartz 定时任务                  |

***

### 1.4 Starter 的内部结构

以 `spring-boot-starter-web` 为例，查看其依赖树：

```
spring-boot-starter-web
├── spring-boot-starter           # 核心 Starter
│   ├── spring-boot               # Spring Boot 核心
│   ├── spring-boot-autoconfigure # 自动配置
│   └── spring-boot-starter-logging  # 日志（Logback）
│
├── spring-boot-starter-json      # JSON 处理
│   └── jackson-databind          # Jackson
│
├── spring-boot-starter-tomcat    # 内嵌 Tomcat
│   ├── tomcat-embed-core
│   └── tomcat-embed-websocket
│
├── spring-web                    # Spring Web 核心
└── spring-webmvc                 # Spring MVC
```

#### Starter 的本质

Starter 本身通常不包含代码，只是一个**依赖聚合器**：

```
Starter = pom.xml（依赖聚合） + 可选的自动配置
```

实际结构：
- **starter 模块**：只有 `pom.xml`，聚合相关依赖
- **autoconfigure 模块**：包含自动配置类和条件注解

```
spring-boot-starter-web           → 聚合依赖（pom only）
spring-boot-autoconfigure         → 自动配置类（WebMvcAutoConfiguration 等）
```

***

### 1.5 查看 Starter 依赖

```bash
# 查看完整依赖树
mvn dependency:tree

# 查看特定 Starter 的依赖
mvn dependency:tree -Dincludes=org.springframework.boot:spring-boot-starter-web

# 输出到文件
mvn dependency:tree -DoutputFile=dependencies.txt
```

IDEA 中也可以通过 `Maven` 面板 → `Dependencies` 查看依赖树。

***

## 二、自动配置原理

### 2.1 自动配置概述

**自动配置（Auto-Configuration）** 是 Spring Boot "约定优于配置"理念的核心实现。

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐     ┌───────────┐
│  引入依赖   │ ──▶ │  触发自动配置   │ ──▶ │ 创建相关Bean│ ──▶ │  开箱即用 │
│ (Starter)   │     │ (条件注解判断)  │     │             │     │           │
└─────────────┘     └─────────────────┘     └─────────────┘     └───────────┘
```

例如：引入 `spring-boot-starter-web` 后，Spring Boot 自动配置：

| 自动创建的 Bean       | 说明             |
| --------------------- | ---------------- |
| DispatcherServlet     | 前端控制器       |
| 内嵌 Tomcat           | Web 服务器       |
| HttpMessageConverters | JSON 序列化      |
| 静态资源处理          | /static、/public |
| 错误页面处理          | /error 端点      |

***

### 2.2 自动配置的触发机制

#### @EnableAutoConfiguration

`@SpringBootApplication` 是一个组合注解：

```java
@SpringBootConfiguration      // 标识配置类
@EnableAutoConfiguration      // ← 开启自动配置
@ComponentScan                // 组件扫描
public @interface SpringBootApplication { }
```

`@EnableAutoConfiguration` 的核心作用：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)  // ← 关键：导入选择器
public @interface EnableAutoConfiguration { }
```

#### AutoConfigurationImportSelector

这是自动配置的核心类，负责加载所有自动配置类：

```java
public class AutoConfigurationImportSelector implements DeferredImportSelector {
    
    @Override
    public String[] selectImports(AnnotationMetadata metadata) {
        // 1. 获取所有候选自动配置类
        List<String> configurations = getCandidateConfigurations(metadata, attributes);
        // 2. 去重
        configurations = removeDuplicates(configurations);
        // 3. 排除用户指定的配置
        Set<String> exclusions = getExclusions(metadata, attributes);
        configurations.removeAll(exclusions);
        // 4. 根据条件过滤（@ConditionalOnClass 等）
        configurations = getConfigurationClassFilter().filter(configurations);
        // 5. 返回最终生效的配置类
        return configurations.toArray(new String[0]);
    }
    
    protected List<String> getCandidateConfigurations(...) {
        // 从 META-INF/spring/xxx.imports 加载配置类
        return ImportCandidates.load(AutoConfiguration.class, classLoader)
                .getCandidates();
    }
}
```

***

### 2.3 自动配置类的加载位置

#### Spring Boot 2.7+ / 3.x（推荐）

配置文件：`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`

```
# 每行一个配置类的全限定名
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration
org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration
...
```

#### Spring Boot 2.7 之前

配置文件：`META-INF/spring.factories`

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration,\
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,\
...
```

> ⚠️ Spring Boot 3.0 已完全移除 `spring.factories` 对自动配置的支持，只能使用 `.imports` 文件。

***

### 2.4 条件注解（@Conditional）

自动配置类通过**条件注解**决定是否生效，这是按需加载的关键。

#### 核心条件注解

| 注解                              | 说明                           | 常见用法                                |
| --------------------------------- | ------------------------------ | --------------------------------------- |
| `@ConditionalOnClass`             | 类路径存在指定类时生效         | `@ConditionalOnClass(DataSource.class)` |
| `@ConditionalOnMissingClass`      | 类路径不存在指定类时生效       | 排除某些场景                            |
| `@ConditionalOnBean`              | 容器中存在指定 Bean 时生效     | `@ConditionalOnBean(DataSource.class)`  |
| `@ConditionalOnMissingBean`       | 容器中不存在指定 Bean 时生效   | 允许用户自定义覆盖                      |
| `@ConditionalOnProperty`          | 配置属性满足条件时生效         | `@ConditionalOnProperty("spring.xxx")`  |
| `@ConditionalOnResource`          | 类路径存在指定资源时生效       | 检查配置文件是否存在                    |
| `@ConditionalOnWebApplication`    | Web 应用时生效                 | 仅 Web 环境加载                         |
| `@ConditionalOnNotWebApplication` | 非 Web 应用时生效              | 仅非 Web 环境加载                       |
| `@ConditionalOnExpression`        | SpEL 表达式为 true 时生效      | 复杂条件判断                            |
| `@ConditionalOnSingleCandidate`   | 容器中只有一个候选 Bean 时生效 | 避免多实现冲突                          |

#### @ConditionalOnProperty 详解

```java
@ConditionalOnProperty(
    prefix = "spring.datasource",    // 配置前缀
    name = "enabled",                // 属性名（完整路径：spring.datasource.enabled）
    havingValue = "true",            // 期望的值
    matchIfMissing = true            // 配置不存在时是否匹配（默认 false）
)
```

| 参数             | 说明                                       |
| ---------------- | ------------------------------------------ |
| `prefix`         | 配置前缀                                   |
| `name`/`value`   | 属性名                                     |
| `havingValue`    | 期望的属性值，匹配则生效                   |
| `matchIfMissing` | 属性不存在时是否生效，默认 false（不生效） |

#### 条件注解原理

所有条件注解都基于 `@Conditional`：

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Conditional(OnClassCondition.class)  // 指定条件判断器
public @interface ConditionalOnClass {
    Class<?>[] value() default {};
    String[] name() default {};       // 也可以用类名字符串
}
```

条件判断器实现 `Condition` 接口：

```java
public class OnClassCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        // 判断类路径是否存在指定的类
        String[] classNames = (String[]) metadata.getAnnotationAttributes(...)
                .get("name");
        for (String className : classNames) {
            if (!ClassUtils.isPresent(className, context.getClassLoader())) {
                return false;  // 类不存在，条件不满足
            }
        }
        return true;
    }
}
```

***

### 2.5 自动配置类示例分析

以 `DataSourceAutoConfiguration` 为例：

```java
@AutoConfiguration(before = SqlInitializationAutoConfiguration.class)  // 指定加载顺序
@ConditionalOnClass({DataSource.class, EmbeddedDatabaseType.class})    // 条件1：类路径有 DataSource
@ConditionalOnMissingBean(type = "io.r2dbc.spi.ConnectionFactory")     // 条件2：没有响应式连接工厂
@EnableConfigurationProperties(DataSourceProperties.class)             // 绑定配置属性
@Import({DataSourcePoolMetadataProvidersConfiguration.class, 
         DataSourceInitializationConfiguration.class})
public class DataSourceAutoConfiguration {

    // 嵌入式数据库配置（如 H2）
    @Configuration
    @Conditional(EmbeddedDatabaseCondition.class)
    @ConditionalOnMissingBean({DataSource.class, XADataSource.class})  // 用户没有自定义
    @Import(EmbeddedDataSourceConfiguration.class)
    protected static class EmbeddedDatabaseConfiguration { }

    // 连接池数据库配置
    @Configuration
    @Conditional(PooledDataSourceCondition.class)
    @ConditionalOnMissingBean({DataSource.class, XADataSource.class})
    @Import({
        DataSourceConfiguration.Hikari.class,   // HikariCP（默认）
        DataSourceConfiguration.Tomcat.class,
        DataSourceConfiguration.Dbcp2.class,
        DataSourceConfiguration.OracleUcp.class,
        DataSourceConfiguration.Generic.class
    })
    protected static class PooledDataSourceConfiguration { }
}
```

#### @AutoConfiguration 的 before/after 属性

```java
@AutoConfiguration(
    before = SqlInitializationAutoConfiguration.class,  // 在此配置之前加载
    after = DataSourceAutoConfiguration.class           // 在此配置之后加载
)
public class MyAutoConfiguration { }
```

#### 配置属性绑定

```java
@ConfigurationProperties(prefix = "spring.datasource")
public class DataSourceProperties implements BeanClassLoaderAware, InitializingBean {
    private String driverClassName;
    private String url;
    private String username;
    private String password;
    private ClassLoader classLoader;
    // ... getters/setters
}
```

对应配置文件：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
```

***

### 2.6 自动配置的覆盖机制

Spring Boot 自动配置遵循"用户优先"原则：

```
用户自定义 Bean  →  优先级最高，自动配置不生效
用户自定义配置  →  覆盖自动配置的默认值
无任何配置     →  使用自动配置的默认值
```

#### 示例：自定义 DataSource

```java
@Configuration
public class MyDataSourceConfig {
    
    @Bean
    public DataSource dataSource() {
        // 自定义 DataSource，自动配置的 DataSource 不再生效
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:mysql://localhost:3306/mydb");
        ds.setUsername("root");
        ds.setPassword("123456");
        ds.setMaximumPoolSize(20);
        return ds;
    }
}
```

由于自动配置类使用了 `@ConditionalOnMissingBean(DataSource.class)`，用户定义的 DataSource 存在时，自动配置不生效。

***

### 2.7 查看自动配置报告

在 `application.yml` 中启用调试模式：

```yaml
debug: true
```

启动时将打印自动配置报告：

```
============================
CONDITIONS EVALUATION REPORT
============================

Positive matches:   ← 生效的自动配置
-----------------
DataSourceAutoConfiguration matched:
   - @ConditionalOnClass found required classes 'javax.sql.DataSource'
   
Negative matches:   ← 未生效的自动配置
-----------------
RedisAutoConfiguration:
   - @ConditionalOnClass did not find required class 
     'org.springframework.data.redis.core.RedisOperations'
   
Exclusions:         ← 排除的自动配置
-----------
   None

Unconditional classes:  ← 无条件加载的配置
----------------------
   org.springframework.boot.autoconfigure.context.ConfigurationPropertiesAutoConfiguration
```

***

### 2.8 排除自动配置

有时需要禁用某些自动配置：

```java
// 方式一：在启动类注解中排除
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class Application { }

// 方式二：在启动类注解中按类名排除（适用于类不在类路径的情况）
@SpringBootApplication(excludeName = {
    "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"
})
public class Application { }
```

```yaml
# 方式三：在配置文件中排除
spring:
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
      - org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration
```

**常见排除场景**：
- 项目不需要某些功能（如不需要数据库，排除 DataSource 配置）
- 想完全自定义某些组件
- 解决自动配置冲突

***

### 2.9 自动配置执行流程

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Spring Boot 启动                             │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│  @EnableAutoConfiguration → @Import(AutoConfigurationImportSelector)│
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│  读取 META-INF/spring/xxx.imports 获取所有自动配置类（约 150+ 个）  │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│  对每个配置类进行条件评估                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ @ConditionalOnClass → 类路径是否有依赖？                    │   │
│  │ @ConditionalOnMissingBean → 用户是否已自定义？              │   │
│  │ @ConditionalOnProperty → 配置是否开启？                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                          ↓                              ↓
                    条件满足                        条件不满足
                          ↓                              ↓
┌───────────────────────────────┐    ┌───────────────────────────────┐
│  配置类生效，创建 Bean        │    │  跳过该配置类                 │
│  绑定 @ConfigurationProperties│    │                               │
└───────────────────────────────┘    └───────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       自动配置完成，应用就绪                        │
└─────────────────────────────────────────────────────────────────────┘
```

***

## 三、自定义 Starter

### 3.1 为什么要自定义 Starter

| 场景            | 说明                              |
| --------------- | --------------------------------- |
| 公共组件复用    | 将通用功能封装，多项目共享        |
| 第三方 SDK 集成 | 封装第三方服务（短信、支付、OSS） |
| 统一技术规范    | 日志、监控、安全等公司级规范      |
| 简化项目配置    | 开箱即用，减少重复配置            |

***

### 3.2 项目结构与开发流程

#### 3.2.1 项目结构

一个完整的自定义 Starter 通常包含两个模块：

```
xxx-spring-boot-starter-parent/
│
├── xxx-spring-boot-starter-autoconfigure/   # 自动配置模块（核心代码）
│   ├── pom.xml
│   └── src/main/
│       ├── java/.../autoconfigure/
│       │   ├── XxxAutoConfiguration.java    # 自动配置类
│       │   ├── XxxProperties.java           # 配置属性类
│       │   └── XxxService.java              # 业务服务类
│       └── resources/META-INF/
│           ├── spring/
│           │   └── org.springframework.boot.autoconfigure.AutoConfiguration.imports
│           └── additional-spring-configuration-metadata.json
│
└── xxx-spring-boot-starter/                 # Starter 模块（仅 pom.xml）
    └── pom.xml                              # 聚合依赖
```

| 模块          | 职责                   | 内容                             |
| ------------- | ---------------------- | -------------------------------- |
| autoconfigure | 包含自动配置的核心代码 | 配置类、属性类、服务类、注册文件 |
| starter       | 依赖聚合，供用户引入   | 仅 `pom.xml`，引入 autoconfigure |

> 💡 对于简单的 Starter，也可以将两个模块合并为一个。

#### 3.2.2 开发步骤概述

| 步骤 | 任务                    | 关键点                                                  |
| ---- | ----------------------- | ------------------------------------------------------- |
| 1    | 创建 autoconfigure 模块 | 引入 `spring-boot-autoconfigure` 依赖                   |
| 2    | 编写配置属性类          | `@ConfigurationProperties(prefix = "xxx")`              |
| 3    | 编写业务服务类          | 通过构造函数注入 Properties                             |
| 4    | 编写自动配置类          | `@AutoConfiguration` + `@EnableConfigurationProperties` |
| 5    | 注册自动配置类          | `META-INF/spring/...AutoConfiguration.imports`          |
| 6    | 配置元数据（可选）      | `additional-spring-configuration-metadata.json`         |
| 7    | 创建 Starter 模块       | 仅 `pom.xml`，引入 autoconfigure                        |
| 8    | 安装使用                | `mvn install` → 其他项目引入依赖                        |

***

### 3.3 核心知识与原理

#### 核心注解

| 注解 | 用在哪 | 作用 |
| ---- | ------ | ---- |
| `@ConfigurationProperties(prefix="xxx")` | 配置属性类 | 把配置文件中 `xxx.*` 的属性绑定到这个类的字段 |
| `@EnableConfigurationProperties(Xxx.class)` | 自动配置类 | 启用配置属性绑定，并把配置类注册为 Bean |
| `@AutoConfiguration` | 自动配置类 | 标记这是一个自动配置类（Spring Boot 2.7+） |
| `@ConditionalOnProperty` | 自动配置类 | 根据配置属性决定是否启用，可做开关 |
| `@ConditionalOnMissingBean` | @Bean 方法 | 容器中没有这个 Bean 时才创建，实现"用户优先" |
| `@Bean` | 自动配置类中的方法 | 把方法返回值注册为 Bean |

**松散绑定**：配置文件中 `access-key-id`、`accessKeyId`、`access_key_id` 都能绑定到 Java 的 `accessKeyId` 字段。

#### 注册文件

Spring Boot 通过这个文件发现你的自动配置类：

```
文件路径：src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
文件内容：配置类的全限定名，每行一个
```

#### 工作原理

**1. Maven 加载依赖**

用户在 `pom.xml` 中引入 Starter，Starter 依赖 autoconfigure 模块，Maven 通过传递依赖一并加载。

**2. Spring Boot 发现自动配置类**

autoconfigure 模块中有 `.imports` 文件，写了配置类的全限定名。启动时：

```
@SpringBootApplication
    ↓
@EnableAutoConfiguration
    ↓
@Import(AutoConfigurationImportSelector.class)
    ↓
AutoConfigurationImportSelector 实现 DeferredImportSelector 接口
    ↓
selectImports() 方法读取 .imports 文件，返回所有配置类
```

**3. 配置类生效**

- 配置类用 `@AutoConfiguration` 标注（`@Configuration` 也能工作，但不推荐）
- 通过 `@EnableConfigurationProperties` 绑定属性类
- `@Bean` 方法声明业务 Bean

**4. 用户使用**

```yaml
# 配置属性
sms:
  access-key-id: xxx
```

```java
// 直接注入
@Autowired
private SmsService smsService;
```

#### 你需要提供的文件

| 文件 | 作用 |
| ---- | ---- |
| `XxxProperties.java` | 配置属性类，接收用户的 `xxx.*` 配置 |
| `XxxService.java` | 服务类，实际干活的 |
| `XxxAutoConfiguration.java` | 自动配置类，把配置类和服务类串起来 |
| `.imports` 文件 | 注册自动配置类，让 Spring Boot 能发现 |

#### 几个关键问题

**为什么用 `@ConditionalOnMissingBean`？**

这是"用户优先"原则。如果用户自己定义了 SmsService，你的自动配置就不创建，用用户的。

**为什么用 `@ConditionalOnProperty`？**

让用户可以通过配置禁用整个功能。`matchIfMissing = true` 表示用户不配置时默认启用。

**为什么服务类不加 `@Component`？**

因为创建权在自动配置类手里。加了 `@Component` 就变成无条件创建了，失去了按需加载的能力。

**Starter 模块是干嘛的？**

就是一个只有 `pom.xml` 的空项目，把 autoconfigure 模块和其他依赖（如阿里云 SDK）聚合起来，方便用户一次性引入

***

### 3.4 实战：开发短信 Starter

#### 第一步：创建项目结构

创建一个 Maven 项目，目录结构如下：

```
sms-spring-boot-starter/
├── pom.xml
└── src/main/
    ├── java/com/example/sms/autoconfigure/
    │   ├── SmsProperties.java
    │   ├── SmsService.java
    │   └── SmsAutoConfiguration.java
    └── resources/META-INF/spring/
        └── org.springframework.boot.autoconfigure.AutoConfiguration.imports
```

> 简单起见，这里把 autoconfigure 和 starter 合成一个模块。

#### 第二步：配置 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>sms-spring-boot-starter</artifactId>
    <version>1.0.0</version>

    <properties>
        <java.version>17</java.version>
        <spring-boot.version>3.2.0</spring-boot.version>
    </properties>

    <dependencies>
        <!-- 必须：自动配置支持 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-autoconfigure</artifactId>
            <version>${spring-boot.version}</version>
        </dependency>
        
        <!-- 可选：IDE 配置提示 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <version>${spring-boot.version}</version>
            <optional>true</optional>
        </dependency>
        
        <!-- 可选：Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.30</version>
            <optional>true</optional>
        </dependency>
    </dependencies>
</project>
```

#### 第三步：编写配置属性类

创建 `SmsProperties.java`：

```java
package com.example.sms.autoconfigure;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "sms")
public class SmsProperties {
    
    /** 是否启用，默认 true */
    private boolean enabled = true;
    
    /** Access Key ID（必填） */
    private String accessKeyId;
    
    /** Access Key Secret（必填） */
    private String accessKeySecret;
    
    /** 短信签名 */
    private String signName;
    
    /** 超时时间，默认 5000ms */
    private int timeout = 5000;
}
```

#### 第四步：编写服务类

创建 `SmsService.java`：

```java
package com.example.sms.autoconfigure;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class SmsService {

    private final SmsProperties properties;

    /**
     * 发送短信
     */
    public boolean send(String phone, String content) {
        // 这里调用实际的短信 API
        log.info("发送短信 - 手机号: {}, 内容: {}, 签名: {}", 
                phone, content, properties.getSignName());
        
        // TODO: 调用阿里云/腾讯云 SDK
        // 示例：使用 properties.getAccessKeyId() 等配置
        
        return true;
    }
}
```

#### 第五步：编写自动配置类

创建 `SmsAutoConfiguration.java`：

```java
package com.example.sms.autoconfigure;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
@EnableConfigurationProperties(SmsProperties.class)
@ConditionalOnProperty(prefix = "sms", name = "enabled", havingValue = "true", matchIfMissing = true)
public class SmsAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public SmsService smsService(SmsProperties properties) {
        return new SmsService(properties);
    }
}
```

#### 第六步：注册自动配置类

创建文件 `src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`：

```
com.example.sms.autoconfigure.SmsAutoConfiguration
```

> 注意：这个文件名很长，别打错。内容就一行，写配置类的全限定名。

#### 第七步：安装到本地仓库

```bash
mvn clean install
```

#### 第八步：在其他项目中使用

**1. 引入依赖**

```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>sms-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

**2. 配置属性**

```yaml
sms:
  access-key-id: your-access-key
  access-key-secret: your-secret
  sign-name: 你的签名
  timeout: 3000
```

**3. 注入使用**

```java
@RestController
@RequiredArgsConstructor
public class DemoController {

    private final SmsService smsService;

    @GetMapping("/send")
    public String send(@RequestParam String phone) {
        smsService.send(phone, "验证码：1234");
        return "发送成功";
    }
}
```

#### 完整文件清单

```
sms-spring-boot-starter/
├── pom.xml                                          ← 第二步
└── src/main/
    ├── java/com/example/sms/autoconfigure/
    │   ├── SmsProperties.java                       ← 第三步
    │   ├── SmsService.java                          ← 第四步
    │   └── SmsAutoConfiguration.java                ← 第五步
    └── resources/META-INF/spring/
        └── org.springframework.boot.autoconfigure.AutoConfiguration.imports  ← 第六步
```

***

### 3.5 最佳实践

| 实践                             | 说明                                                                  |
| -------------------------------- | --------------------------------------------------------------------- |
| 使用 `@ConditionalOn*`           | 确保按条件加载，避免不必要的 Bean 创建                                |
| 提供禁用开关                     | `@ConditionalOnProperty(name = "xxx.enabled", matchIfMissing = true)` |
| 使用 `@ConditionalOnMissingBean` | 允许用户自定义实现覆盖默认配置                                        |
| 提供配置元数据                   | 使用 `spring-boot-configuration-processor` 生成 IDE 提示              |
| 依赖设为 optional                | 非必需依赖使用 `<optional>true</optional>`                            |
| 合理的默认值                     | 提供开箱即用的默认配置                                                |
| 清晰的包结构                     | 自动配置类放在独立包下，如 `xxx.autoconfigure`                        |
| 使用 Lite 模式                   | `@Configuration(proxyBeanMethods = false)` 提升启动性能               |
| 版本兼容                         | 明确支持的 Spring Boot 版本范围                                       |
| 完善文档                         | 提供 README，说明配置项和使用方法                                     |

***

## 附录

### A. 本章知识点索引

| 主题             | 章节 | 说明                                                           |
| ---------------- | ---- | -------------------------------------------------------------- |
| Starter 概念     | 1.1  | 依赖聚合器，简化依赖管理                                       |
| Starter 命名规则 | 1.2  | 官方 `spring-boot-starter-*`，第三方 `*-spring-boot-starter`   |
| 自动配置触发机制 | 2.2  | `@EnableAutoConfiguration` → `AutoConfigurationImportSelector` |
| 条件注解         | 2.4  | `@ConditionalOnClass`、`@ConditionalOnMissingBean` 等          |
| 覆盖自动配置     | 2.6  | 用户自定义 Bean 优先                                           |
| 查看配置报告     | 2.7  | `debug: true`                                                  |
| 排除自动配置     | 2.8  | `exclude` 属性或配置文件                                       |
| 开发步骤         | 3.2  | 8 步开发流程                                                   |
| 核心知识与原理   | 3.3  | 核心注解、工作流程                                             |
| 实战             | 3.4  | 短信 Starter 完整代码                                          |
| 最佳实践         | 3.5  | 10 条开发建议                                                  |

### B. 自动配置相关注解速查

#### 配置类注解

| 注解                             | 说明                               |
| -------------------------------- | ---------------------------------- |
| `@AutoConfiguration`             | 声明自动配置类（Spring Boot 2.7+） |
| `@AutoConfiguration(before=...)` | 指定在某配置之前加载               |
| `@AutoConfiguration(after=...)`  | 指定在某配置之后加载               |
| `@Configuration`                 | 声明配置类                         |
| `@EnableConfigurationProperties` | 启用配置属性绑定                   |
| `@ConfigurationProperties`       | 绑定配置前缀                       |

#### 条件注解

| 注解                              | 说明                      |
| --------------------------------- | ------------------------- |
| `@ConditionalOnClass`             | 类存在时生效              |
| `@ConditionalOnMissingClass`      | 类不存在时生效            |
| `@ConditionalOnBean`              | Bean 存在时生效           |
| `@ConditionalOnMissingBean`       | Bean 不存在时生效         |
| `@ConditionalOnProperty`          | 属性满足条件时生效        |
| `@ConditionalOnResource`          | 资源存在时生效            |
| `@ConditionalOnWebApplication`    | Web 应用时生效            |
| `@ConditionalOnNotWebApplication` | 非 Web 应用时生效         |
| `@ConditionalOnExpression`        | SpEL 表达式为 true 时生效 |
| `@ConditionalOnSingleCandidate`   | 只有一个候选 Bean 时生效  |
| `@ConditionalOnJava`              | 指定 Java 版本时生效      |
| `@ConditionalOnJndi`              | JNDI 存在时生效           |
| `@ConditionalOnCloudPlatform`     | 指定云平台时生效          |

#### 配置文件位置

| Spring Boot 版本 | 配置文件位置                                                                       |
| ---------------- | ---------------------------------------------------------------------------------- |
| 3.x / 2.7+       | `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` |
| 2.7 之前         | `META-INF/spring.factories`（已废弃）                                              |

### C. 常见问题

| 问题                           | 原因                                         | 解决方案                         |
| ------------------------------ | -------------------------------------------- | -------------------------------- |
| 自动配置类不生效               | 未注册到 `.imports` 文件                     | 检查文件路径和类全限定名是否正确 |
| 配置属性无法绑定               | 缺少 `@EnableConfigurationProperties`        | 在配置类上添加该注解             |
| IDE 无配置提示                 | 缺少 `configuration-processor` 依赖          | 添加依赖并重新编译               |
| 用户自定义 Bean 无效           | 自动配置类未使用 `@ConditionalOnMissingBean` | 在 `@Bean` 方法上添加该注解      |
| Spring Boot 3.x 自动配置不加载 | 使用了旧的 `spring.factories` 方式           | 改用 `.imports` 文件             |
| 启动报 `NoClassDefFoundError`  | 条件注解中的类不在类路径                     | 使用 `name` 属性指定类名字符串   |

### D. 自定义 Starter 检查清单

- [ ] `pom.xml` 引入了 `spring-boot-autoconfigure` 依赖
- [ ] `XxxProperties` 类使用了 `@ConfigurationProperties(prefix = "xxx")`
- [ ] `XxxAutoConfiguration` 类使用了 `@AutoConfiguration`
- [ ] 配置类使用了 `@EnableConfigurationProperties` 启用属性绑定
- [ ] 使用了 `@ConditionalOnProperty` 提供启用开关
- [ ] 使用了 `@ConditionalOnMissingBean` 允许用户覆盖
- [ ] 创建了 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 文件
- [ ] 文件中写入了配置类的全限定名
- [ ] （可选）添加了 `configuration-processor` 依赖用于 IDE 提示
- [ ] （可选）创建了 `additional-spring-configuration-metadata.json` 补充提示
- [ ] 执行了 `mvn install` 安装到本地仓库
