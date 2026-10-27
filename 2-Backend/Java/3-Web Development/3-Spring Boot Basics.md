## I. Spring Boot Overview

### 1.1 Introduction and Core Features

**Spring Boot** builds on Spring Framework to simplify creating, configuring, running, and deploying Spring applications.

| Feature | Description |
| ---------- | ----------------------------------------------- |
| Rapid setup | Starters simplify dependency and build configuration |
| Embedded servers | Embedded Tomcat, Jetty, or Undertow removes the need to deploy a WAR |
| Auto-configuration | Automatically configures Spring and third-party libraries where possible |
| No XML required | Favors Java configuration over extensive XML configuration |
| Production features | Provides monitoring, health checks, externalized configuration, and more |

#### What Problems Does Spring Boot Solve?

| Pain point | Traditional Spring development | Spring Boot approach |
| -------- | -------------------- | ---------------------- |
| **Complex dependencies** | Select and maintain dependency sets and versions manually | Starters group dependencies; Spring Boot manages their versions |
| **Extensive configuration** | Write substantial XML or Java configuration | Auto-configuration supplies default beans and behavior |
| **Cumbersome startup** | Build a WAR and deploy it to an external container | Embedded Tomcat/Jetty/Undertow starts from a main method |
| **Scattered environment settings** | Settings are spread across code, XML, and server arguments | Externalized configuration and profiles provide consistent management |
| **Limited operational support** | Assemble health checks, metrics, and information endpoints manually | Integrate capabilities such as Actuator directly |

#### The Main Learning Path

Start with these four responsibilities:

1. **Starters** bring in dependencies for a particular capability.
2. **Auto-configuration** creates default beans based on dependencies and conditions.
3. **Configuration files** adjust default behavior.
4. **User-defined beans** replace or supplement default implementations.

***

### 1.2 Spring Boot and Spring Framework

#### How They Relate

| Framework | Role |
| ---------------- | ----------------------------------------------- |
| Spring Framework | **Core framework** providing IoC, AOP, MVC, and other foundational capabilities |
| Spring Boot | **Application scaffolding** built on Spring Framework to simplify setup |

```text
Spring Boot = Spring Framework + Auto-configuration + Embedded server + Starters
```

**Analogy:** Spring Framework is the engine; Spring Boot is the assembled vehicle, ready to use.

**What Spring Boot adds:**
1. **Auto-configuration:** Configures Spring based on dependencies, reducing manual setup.
2. **Starters:** One starter supplies a related dependency set with coordinated versions.
3. **Embedded server:** Start with a main method instead of deploying to an external Tomcat.

#### Spring Boot, Spring MVC, and Spring Cloud

| Technology | Focus | Problem addressed |
| ---- | ------ | ---------- |
| **Spring Framework** | IoC, AOP, data access, MVC, and other core capabilities | Infrastructure for enterprise applications |
| **Spring MVC** | Request dispatch, parameter binding, and view resolution | Web-layer development |
| **Spring Boot** | Auto-configuration, embedded servers, simpler startup and deployment | Faster development of monoliths and microservices |
| **Spring Cloud** | Service discovery, configuration centers, gateways, and service coordination | Collaboration between distributed services |

> 💡 **Spring Boot does not replace Spring MVC.** In a typical web application, Boot assembles and starts the application, while MVC handles web requests.

#### The Spring Ecosystem

```text
Spring ecosystem
├── Spring Framework (core framework)
│   ├── Spring Core (IoC container and dependency injection)
│   ├── Spring AOP (aspect-oriented programming)
│   ├── Spring MVC (web development)
│   └── Spring JDBC/ORM (data access)
│
├── Spring Boot (application setup)
│   ├── Auto-configuration
│   ├── Embedded servers
│   └── Starter dependencies
│
└── Spring Cloud (microservices)
    └── Service registration, configuration centers, gateways, circuit breakers...
```

***

### 1.3 Getting Started

#### Create a Project

**Option 1: Spring Initializr (recommended)**
- Open <https://start.spring.io/>
- Choose the project type and Spring Boot version, then add `Spring Web`
- Generate and download the project

**Option 2: Create the project in IDEA**
- IDEA → New Project → Spring Initializr

#### Write the Code

```java
// Application entry point
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

#### Start and Test

```bash
mvn spring-boot:run          # Or run the main method directly
curl http://localhost:8080/hello  # Output: Hello, Spring Boot!
```

#### Minimal Project Layout

```text
src/main/java
└── com/example
  ├── Application.java          # Application class; place it in the root package
  └── controller
    └── HelloController.java

src/main/resources
└── application.yml
```

> 💡 Place the application class in the project's **root package** so the default scan from `@SpringBootApplication` covers the subpackages containing business code.

***

## II. Core Mechanisms

### 2.1 Understanding @SpringBootApplication

```java
@SpringBootConfiguration  // Marks a configuration class (based on @Configuration)
@EnableAutoConfiguration  // Enables auto-configuration
@ComponentScan            // Scans the application class's package and subpackages by default
public @interface SpringBootApplication { }
```

| Annotation | Purpose |
| -------------------------- | --------------------------------------- |
| `@SpringBootConfiguration` | Marks a configuration class that may contain `@Bean` methods |
| `@EnableAutoConfiguration` | Enables dependency-based Spring auto-configuration |
| `@ComponentScan` | Scans components, starting from the application class's package by default |

***

### 2.2 Starters

A **starter** groups related dependencies to simplify dependency management.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

| Naming convention | Example |
| ------------ | ----------------------------- |
| Official starter | `spring-boot-starter-xxx` |
| Third-party starter | `xxx-spring-boot-starter` |

| Common starter | Purpose |
| ------------------------------ | --------------- |
| `spring-boot-starter-web` | Web development |
| `spring-boot-starter-data-jpa` | JPA data access |
| `spring-boot-starter-data-redis` | Redis integration |
| `spring-boot-starter-test` | Testing support |
| `spring-boot-starter-validation` | Input validation |
| `mybatis-spring-boot-starter` | MyBatis integration |

#### Starters, Auto-configuration, and Dependency Management

| Component | What it is | Main responsibility |
| -------- | ---- | -------- |
| **Starter** | Dependency aggregator | Brings together dependencies for a particular use case |
| **AutoConfiguration** | Configuration classes | Conditionally creates default beans and assembles default behavior |
| **Dependency management/BOM** | Version constraints | Coordinates dependency versions and reduces conflicts |

> 💡 A `starter` supplies the materials, auto-configuration assembles defaults, and configuration files adjust the settings.

***

### 2.3 How Auto-configuration Works

**Auto-configuration** configures Spring based on available dependencies, reducing the amount of configuration you write manually.

The key idea is: **Spring Boot evaluates conditions before deciding whether to register a default bean.**

| Key point | Explanation |
| -------- | ---- |
| **Required dependencies are present** | The classes needed for the feature must be on the classpath |
| **Conditions match** | Property, bean, application-type, and other conditions must pass |
| **No user-defined equivalent** | Default configuration typically backs off when you define the corresponding bean |

#### Core Mechanism

```text
@EnableAutoConfiguration
        ↓
Through @Import(AutoConfigurationImportSelector.class)
        ↓
Read META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
(Before Spring Boot 2.7: META-INF/spring.factories)
        ↓
Load candidate auto-configuration classes
        ↓
Evaluate @Conditional annotations to determine which configurations apply
```

#### Common Prerequisites

| Prerequisite | Typical condition | Example |
| ---- | ------------ | ---- |
| **Dependency is available** | `@ConditionalOnClass` | Data source configuration becomes possible when JDBC dependencies are present |
| **Property matches** | `@ConditionalOnProperty` | A feature flag enables creation of a bean |
| **No user-defined equivalent bean** | `@ConditionalOnMissingBean` | A user-defined `DataSource` replaces the default data source configuration |

A typical auto-configuration sequence is:

```text
Add a starter
  ↓
Related dependencies appear on the classpath
  ↓
Load candidate auto-configurations
  ↓
Evaluate conditional annotations
  ↓
Register default beans
  ↓
Prefer user-defined equivalent beans when provided
```

#### Three Practical Takeaways

| Takeaway | Explanation |
| ---- | ---- |
| **Auto-configuration is conditional** | It relies on `@Conditional...` annotations |
| **It supplies defaults** | Its purpose is to reduce configuration, while allowing customization |
| **User configuration takes precedence** | Defining your own bean prevents many corresponding defaults from being created |

#### Common Conditional Annotations

| Annotation | Applies when |
| ------------------------------- | ------------------------------ |
| `@ConditionalOnClass` | The specified class is on the classpath |
| `@ConditionalOnMissingClass` | The specified class is absent |
| `@ConditionalOnBean` | The specified bean exists in the container |
| `@ConditionalOnMissingBean` | The specified bean does not exist |
| `@ConditionalOnProperty` | A configuration property satisfies the condition |
| `@ConditionalOnWebApplication` | The application is a web application |
| `@ConditionalOnExpression` | A SpEL expression evaluates to true |

#### Example Auto-configuration Class

```java
@AutoConfiguration
@ConditionalOnClass(DataSource.class)           // Applies only when DataSource is present
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean                   // Create the default only if the user has not supplied one
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }
}
```

> 💡 Set `debug: true` (or `logging.level.org.springframework.boot.autoconfigure=DEBUG`) to print the condition evaluation report at startup. `ConditionEvaluationReport` shows which configurations matched and why.

#### Diagnosing Auto-configuration

| Technique | Purpose |
| -------- | ---- |
| `debug: true` | Print the condition evaluation report at startup |
| Inspect `ConditionEvaluationReport` | Understand why a configuration matched or did not match |
| `mvn dependency:tree` | Confirm that required dependencies are present |
| Inspect `@Conditional...` annotations | Identify the relevant class, property, and bean conditions |
| `/actuator/conditions` | Inspect conditions at runtime (requires Actuator) |

***

### 2.4 Embedded Servers

```text
┌───────────────────────────────────────┐
│ Spring Boot application               │
│ ┌───────────────────────────────────┐ │
│ │ Embedded Tomcat server            │ │
│ │ ┌───────────────────────────────┐ │ │
│ │ │ DispatcherServlet             │ │ │
│ │ └───────────────────────────────┘ │ │
│ └───────────────────────────────────┘ │
└───────────────────────────────────────┘
```

**Request flow:**
1. Spring Boot creates an embedded Tomcat instance during startup.
2. It registers DispatcherServlet with Tomcat.
3. Tomcat listens on the configured port for HTTP requests.
4. DispatcherServlet dispatches requests to the appropriate Controller.

***

**Switching servers**, for example to Undertow:

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

| Server | Characteristics | Typical use |
| ------ | ---- | -------- |
| **Tomcat** | Mature ecosystem, extensive documentation, default choice | Most conventional web applications |
| **Jetty** | Lightweight with strong embedding support | Projects familiar with the Jetty ecosystem |
| **Undertow** | Fast startup and a straightforward threading model | Lightweight, high-throughput applications (Spring Boot 3.x only; Spring Boot 4.0 removed Undertow support) |

***

### 2.5 Startup Sequence

The **startup sequence** covers the process from `main()` to an application that is ready to serve requests.

| Topic | Typical question |
| ------ | -------- |
| **Configuration loading** | At which stage does `application.yml` take effect? |
| **Bean creation** | When does the container instantiate singleton beans? |
| **Application readiness** | When do runners execute and `ApplicationReadyEvent` fire? |

```text
1. Start main()
      ↓
2. Create SpringApplication
      ↓
3. Prepare the environment (load configuration and parse command-line arguments)
      ↓
4. Create ApplicationContext
      ↓
5. Load bean definitions (scan @Component and process @Configuration)
      ↓
6. Apply auto-configuration selected by conditional annotations
      ↓
7. Instantiate singleton beans and inject dependencies
      ↓
8. Execute CommandLineRunner / ApplicationRunner
      ↓
9. Publish ApplicationReadyEvent; the application is ready
```

#### Three Practical Takeaways

| Takeaway | Explanation |
| ---- | ---- |
| **Configuration precedes bean creation** | Spring prepares the environment before creating the context and beans |
| **Auto-configuration is part of startup** | It participates in context preparation, rather than being added after startup |
| **`ApplicationReadyEvent` comes last** | It signals that the application is ready to provide its services |

***

## III. The IoC Container and Dependency Injection

### 3.1 Core Concepts

| Concept | Full name | Explanation |
| ------- | -------------------- | ---------------------------------- |
| **IoC** | Inversion of Control | Responsibility for creating objects moves from application code to the container |
| **DI** | Dependency Injection | The container supplies the dependencies an application needs at runtime |

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ Traditional approach (coupled)                                            │
│ Controller ──── new ────▶ ServiceImpl                                     │
├───────────────────────────────────────────────────────────────────────────┤
│ IoC + DI approach (decoupled)                                             │
│ Controller ◀── injection ── IoC container ◀── registration ── ServiceImpl │
└───────────────────────────────────────────────────────────────────────────┘
```

**Benefits of IoC:** Lower coupling, easier mocking and testing, simpler maintenance, and flexible configuration.

***

### 3.2 Declaring Beans

A **bean** is an object managed by the Spring container, which creates it, injects dependencies, and manages its lifecycle.

| Scenario | Approach | Explanation |
| -------------------- | ------------ | ---------------------------- |
| Your own class | `@Component` | Annotate a class within the component scan |
| A class from a dependency | `@Bean` | Register it explicitly in a configuration class |
| Custom initialization | `@Bean` | Set properties before returning the instance |

#### Component Stereotypes

| Annotation | Meaning | Layer |
| ------------- | ---------- | ------- |
| `@Component` | General-purpose component | Any |
| `@Controller` | Controller component | Web |
| `@Service` | Business component | Service |
| `@Repository` | Persistence component | DAO |

> 💡 All four annotations identify components; their names express **architectural intent** and make the code's structure easier to understand.

```java
@Service  // Declare a service-layer bean
public class UserServiceImpl implements UserService {
    // Spring creates and manages this bean
}
```

#### Bean Naming Rules

| Declaration | Default name | Explicit name |
| ------------ | --------------------------------------------------- | ------------------------- |
| `@Component` | Class name with a lowercase initial (UserServiceImpl → userServiceImpl) | `@Component("myService")` |
| `@Bean` | Method name (restTemplate → restTemplate) | `@Bean("myBean")` |

```java
// Specify a bean name
@Service("userService")  // Named userService rather than userServiceImpl
public class UserServiceImpl implements UserService { }

// Select by name during injection
@Autowired
@Qualifier("userService")  // Name of the bean to inject
private UserService userService;
```

***

### 3.3 Configuration Classes (@Configuration)

#### Basic Usage

`@Configuration` declares a **configuration class** whose `@Bean` methods register beans with the container.

**Use cases:**
- **Third-party classes:** When you cannot add `@Component` to their source and they are outside the default scan, register them with `@Bean`.
- **Custom initialization:** Configure an instance before returning it.
- **Grouped configuration:** Keep related bean definitions in one configuration class.

```java
@Configuration
public class AppConfig {

    @Bean  // The method name is the default bean name
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean("customDataSource")  // Explicit bean name
    public DataSource dataSource() {
        DruidDataSource ds = new DruidDataSource();
        ds.setUrl("jdbc:mysql://localhost:3306/test");
        ds.setUsername("root");
        ds.setPassword("123456");
        return ds;
    }
}
```

> 💡 Beans registered through either `@Component` or `@Bean` can be injected with `@Autowired`.

> 💡 An application class annotated with `@SpringBootApplication` is itself a configuration class through `@SpringBootConfiguration` → `@Configuration`. It may contain `@Bean` methods, although separate configuration classes keep the entry point simpler.

#### @Configuration vs @Component

`@Component` classes can also contain `@Bean` methods, but **calls between those methods** behave differently:

| Feature | `@Configuration` | `@Component` |
| ------------------ | ---------------------------------- | -------------------------------------- |
| Proxying | CGLIB proxy | No configuration-method proxy |
| Calls between `@Bean` methods | Return the same container-managed singleton | Ordinary calls create new objects rather than retrieving the managed singleton |

```java
@Configuration
public class AppConfig {
    @Bean
    public A a() { return new A(b()); }  // Call b()
    @Bean
    public B b() { return new B(); }
    @Bean
    public C c() { return new C(b()); }  // Call b() again
}
// ✅ a and c receive the same b (CGLIB intercepts the calls and returns the managed bean)
```

Replacing `@Configuration` with `@Component` makes the `b` objects passed to `a` and `c` **different instances**, so `b` is no longer a shared singleton.

> 💡 This concerns calls between `@Bean` methods. A bean declared with an ordinary `@Component` still has singleton scope by default.

#### The proxyBeanMethods Attribute

Available since Spring Framework 5.2 (Spring Boot 2.2), this attribute controls configuration-class proxying:

| Mode | proxyBeanMethods | Characteristics | Suitable when |
| ---- | ---------------- | -------------------- | ---------------------- |
| Full | true (default) | Preserves managed singleton references; incurs proxy overhead | `@Bean` methods call one another |
| Lite | false | No configuration proxy; faster startup | `@Bean` methods do not call one another |

```java
// Lite mode: suitable when @Bean methods do not call one another
@Configuration(proxyBeanMethods = false)
public class AppConfig {
    @Bean
    public ServiceA serviceA() { return new ServiceA(); }
    @Bean
    public ServiceB serviceB() { return new ServiceB(); }
}
```

#### Importing Configuration with @Import

`@Import` brings other configuration classes or ordinary classes into the current configuration, often for modular configuration.

| Imported type | Purpose |
| ------------------------------------ | -------------------------------------- |
| Configuration class (`@Configuration`) | Import another configuration class |
| Ordinary class | Register it directly as a bean |
| ImportSelector implementation | Choose imported classes dynamically; central to auto-configuration |
| ImportBeanDefinitionRegistrar implementation | Register bean definitions programmatically |

```java
// 1. Import a configuration class
@Configuration
@Import({DataSourceConfig.class, CacheConfig.class})
public class AppConfig { }

// 2. Import an ordinary class (registered as a bean)
@Configuration
@Import(MyUtilityClass.class)
public class AppConfig { }

// 3. Import an ImportSelector implementation (dynamic selection)
public class MyImportSelector implements ImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata metadata) {
        // Return fully qualified class names based on conditions
        return new String[]{"com.example.ServiceA", "com.example.ServiceB"};
    }
}

@Configuration
@Import(MyImportSelector.class)
public class AppConfig { }

// 4. Import an ImportBeanDefinitionRegistrar implementation
public class MyRegistrar implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions(AnnotationMetadata metadata,
                                         BeanDefinitionRegistry registry) {
        // Register a bean programmatically
        RootBeanDefinition definition = new RootBeanDefinition(MyService.class);
        registry.registerBeanDefinition("myService", definition);
    }
}

@Configuration
@Import(MyRegistrar.class)
public class AppConfig { }
```

> 💡 **ImportSelector is central to Spring Boot auto-configuration:** `@EnableAutoConfiguration` uses `AutoConfigurationImportSelector` to discover and import candidate auto-configuration classes.

**Use cases:**
- Split configuration by feature and import the pieces together
- Import configuration supplied by a third-party library
- Import configurations conditionally
- Implement custom `@EnableXxx` annotations backed by ImportSelector

#### Importing XML with @ImportResource

`@ImportResource` imports legacy XML configuration, useful when integrating older projects.

```java
@Configuration
@ImportResource("classpath:legacy-beans.xml")
public class AppConfig { }

// Import multiple XML files
@Configuration
@ImportResource({"classpath:beans.xml", "classpath:dao.xml"})
public class AppConfig { }
```

> ⚠️ Spring Boot favors Java configuration. Prefer this annotation only when migrating or integrating legacy XML configuration.

***

### 3.4 Component Scanning

`@SpringBootApplication` scans **the application class's package and subpackages** by default.

```text
com.example/              ← Application class package
├── Application.java      ✅ Included in the scan
├── controller/           ✅ Included in the scan
└── service/              ✅ Included in the scan

com.other/                ❌ Outside the scan
```

**Expanding the scan:** Explicitly specify additional packages. Packages in dependencies that are outside the default scan need explicit scanning or auto-configuration to supply their beans.

```java
@SpringBootApplication
@ComponentScan({"com.example", "com.other"})
public class Application { }
```

#### Common Reasons a Bean Is Not Discovered

| Symptom | Common cause | Resolution |
| ---- | -------- | -------- |
| **Bean not found at startup** | The class is outside the application package and its subpackages | Adjust the package layout or add `@ComponentScan` |
| **Third-party class cannot be injected** | The class cannot be annotated with `@Component` | Register it with `@Configuration + @Bean` |
| **Mapper/Feign interfaces are inactive** | Their dedicated scanning support is missing | Use `@MapperScan`, `@EnableFeignClients`, or the corresponding mechanism |
| **An annotation appears to do nothing** | Its containing class is not Spring-managed | Ensure the container creates the class |

***

### 3.5 Dependency Injection Styles

Choosing an **injection style** determines how clearly dependencies are expressed, how easily the class can be tested, and how difficult it is to misuse.

| Style | Recommendation | Explanation |
| ------------ | ----------- | -------------------------- |
| Constructor injection | ✅ **Recommended** | Supports final fields and makes dependencies explicit |
| Field injection | ⚠️ Discouraged | Does not support final dependency fields and complicates testing |
| Setter injection | ⚠️ Optional | Useful for optional dependencies |

#### Practical Selection Rules

| Scenario | Preferred approach |
| ---- | -------- |
| **Most business beans** | Constructor injection |
| **Optional dependency** | Setter injection |
| **Legacy code or simple examples** | Field injection may appear, but avoid extending its use |

**Field injection (discouraged):**

```java
@RestController
public class UserController {
    @Autowired
    private UserService userService;  // Cannot be final for field injection
}
```

**Constructor injection (recommended):**

```java
@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {  // A single constructor does not require @Autowired
        this.userService = userService;
    }
}

// Simplify with Lombok
@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
}
```

***

### 3.6 Multiple Beans of the Same Type

When **multiple beans have the same type**, Spring can find several candidates but needs to know which one to inject.

If an interface has multiple implementations, select the desired one:

| Mechanism | Where it applies | Example |
| ------------ | ---------------- | -------------------------------------- |
| `@Primary` | Declaration: marks the preferred candidate | Add `@Primary` to an implementation |
| `@Qualifier` | Injection point: selects a candidate | `@Autowired @Qualifier("xxxImpl")` |
| `@Resource` | Injection point: selects by name | `@Resource(name = "xxxImpl")` |

```java
// Option 1: mark a preferred implementation
@Primary
@Service
public class UserServiceImpl implements UserService { }

// Option 2: specify a name at the injection point
@Autowired
@Qualifier("userServiceV2Impl")
private UserService userService;
```

**`@Autowired` vs `@Resource`**:

| Aspect | `@Autowired` | `@Resource` |
| -------- | ------------------- | ---------------- |
| Origin | Spring | Jakarta Annotations (historically JSR-250) |
| Default selection | By **type** | By **name** |
| Explicit `name` | Combine with `@Qualifier` | Use the name attribute |

#### Injecting a Collection of Beans

You can inject several implementations at once instead of selecting just one:

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

| Injection type | Description |
| -------- | ---- |
| `List<MessageSender>` | Injects all matching beans for iteration |
| `Map<String, MessageSender>` | Uses bean names as keys for selecting an implementation |

***

### 3.7 Bean Scopes and Creation Timing

**Scope** controls how instances are shared and how long they live; **creation timing** controls when those instances are created.

#### Scopes

A bean's scope determines its instance count and lifetime. The default is `singleton`, so an explicit `@Scope` is unnecessary for that scope.

| Scope | Meaning | Creation timing | Typical use |
| ----------- | ---------------------- | -------------- | --------------------- |
| **singleton** | One instance per bean definition/container (default) | During context startup by default | Stateless services and DAOs |
| **prototype** | A new instance for each lookup | Each lookup | Stateful beans |
| **request** | One instance per HTTP request | Within the request | Web applications |
| **session** | One instance per HTTP session | Within the session | Web applications |

> **Note:** These `request`/`session` scopes require a servlet web context; they are not available in a plain non-web context or directly in WebFlux.

```java
@Service
@Scope("prototype")  // Default without @Scope is singleton
public class PrototypeService { }
```

#### Request/Session Scopes and Scoped Proxies

When a **request/session-scoped bean is injected into a singleton**, such as a service, the singleton is normally created during startup, before an HTTP request exists. A direct lookup cannot obtain the current request's instance; injection may fail or retain the wrong instance without appropriate indirection.

**Rule:** Declaring a request/session bean alone does not require a scoped proxy. When a singleton depends on it, configure `proxyMode = ScopedProxyMode.TARGET_CLASS` (or `INTERFACES`) to resolve the target for the active scope.

| proxyMode | Description |
| ---------------------- | ---------------------------- |
| **TARGET_CLASS** | CGLIB class proxy, usable without an interface |
| **INTERFACES** | JDK interface proxy when the bean has an interface |

```java
// Option 1: @Scope with proxyMode
@Component
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestScopedBean { }

// Option 2: @RequestScope (Spring 4.3+; proxyMode already defaults to TARGET_CLASS)
@Component
@RequestScope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestScopedBean { }
```

A request/session bean used only by consumers with the same scope can be resolved without a scoped proxy. Controllers are normally singletons too, so their shorter-lived dependencies generally need a scoped proxy or another scoped lookup mechanism.

#### Lazy Initialization (@Lazy)

Singleton beans are normally created during **container startup**. `@Lazy` can defer creation until **the first lookup or use**.

```java
@Service
@Lazy  // Delay creation until the bean is first requested
public class HeavyService { }
```

**Use cases:**
- Expensive initialization for beans that may never be needed
- Breaking certain circular dependency scenarios
- Reducing startup work

**Use `@Lazy` at the injection point as well:**

```java
@RestController
public class UserController {

    @Lazy  // Otherwise this dependency can trigger eager creation
    @Autowired
    private HeavyService heavyService;
}
```

#### Initialization Order (@DependsOn)

`@DependsOn` specifies initialization dependencies so the named beans are initialized first.

```java
@Service
@DependsOn("cacheManager")  // Initialize cacheManager first
public class UserService { }

// Specify multiple dependencies
@Service
@DependsOn({"dataSource", "cacheManager"})
public class OrderService { }
```

**Use cases:**
- Implicit dependencies through static methods or global state rather than injection
- Infrastructure beans that must initialize before other beans

> 💡 Spring already orders explicitly injected dependencies, so those relationships normally do not require `@DependsOn`.

***

## IV. Bean Lifecycle

### 4.1 What Is the Bean Lifecycle?

The **bean lifecycle** covers creation by Spring, dependency injection, initialization, use, and eventual destruction.

The five stages most relevant to application development are:

```text
Create the object
  ↓
Inject dependencies
  ↓
Initialize
  ↓
Use in business logic
  ↓
Destroy when the container closes
```

| Stage | What Spring does | Application-facing mechanism |
| ---- | --------------- | ------------------ |
| **Creation** | Calls a constructor | Constructor |
| **Dependency injection** | Supplies dependencies and values, including `@Autowired`/`@Value` | Fields and constructor arguments |
| **Initialization** | Executes initialization callbacks | `@PostConstruct` |
| **Business use** | Makes the bean available | Normal Controller/Service calls |
| **Destruction** | Runs cleanup before context shutdown | `@PreDestroy` |

#### Four Practical Takeaways

| Takeaway | Explanation |
| ---- | ---- |
| **Construction comes first** | Field-injected dependencies are not yet available during construction |
| **Field/setter injection follows construction** | Avoid constructor logic that relies on `@Autowired` fields; constructor arguments are already supplied |
| **`@PostConstruct` follows dependency injection** | Suitable for cache initialization, configuration checks, and listener registration |
| **`@PreDestroy` precedes destruction** | Suitable for releasing connections, thread pools, caches, and other resources |

#### Common Sources of Confusion

| Question | Explanation |
| ---- | -------- |
| **Constructor vs `@PostConstruct`?** | The constructor runs earlier; `@PostConstruct` runs after dependencies have been injected |
| **Bean lifecycle vs application startup?** | The lifecycle concerns one bean; startup concerns the whole application |
| **Does `@PreDestroy` run after each method call?** | No; it is a destruction callback, typically when the context closes |
| **How do I use a bean only after initialization?** | Obtain it through normal dependency injection and invoke its business methods; Spring initializes it before normal use |

***

### 4.2 Common Lifecycle Hooks

Start with these four mechanisms:

| Mechanism | Timing | Typical work | Recommendation |
| ---- | -------- | ---------- | -------- |
| **Constructor** | Object creation | Basic construction and simple field assignment | ✅ Appropriate |
| **`@PostConstruct`** | After dependency injection | Initialize caches, validate startup configuration, register listeners | ✅ **Common** |
| **`@PreDestroy`** | Before bean destruction | Release resources, close connections, clear caches | ✅ **Common** |
| **`@Bean(initMethod / destroyMethod)`** | Initialization / destruction | Initialize and clean up third-party classes | ✅ Specific use cases |

#### Typical Usage: `@PostConstruct` and `@PreDestroy`

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

| Hook | Appropriate logic |
| ---- | -------- |
| **Constructor** | Basic field initialization |
| **`@PostConstruct`** | Initialization that requires injected dependencies |
| **`@PreDestroy`** | Cleanup before context shutdown |

> 💡 Learn `@PostConstruct` and `@PreDestroy` first. Other extension points are more advanced framework mechanisms.

***

### 4.3 `@PostConstruct` in Detail

**`@PostConstruct`** marks a common initialization callback: **the bean's dependencies have been injected, and Spring now runs its initialization logic.**

| Aspect | `@PostConstruct` | Constructor |
| ------ | ---------------- | -------- |
| **Timing** | After dependency injection | During object creation |
| **Injected dependencies available?** | **Yes** | Constructor arguments are available; injected fields are not yet ready |
| **Typical uses** | Initialize caches, register listeners, validate configuration | Simple assignment and basic object construction |

#### Appropriate Uses of `@PostConstruct`

| Use case | Explanation |
| -------- | ---- |
| **Initialize caches** | Load reference data, permissions, or configuration into memory at startup |
| **Register listeners** | Register once required dependencies are available |
| **Validate startup configuration** | Fail startup if critical settings are missing |
| **Prepare runtime state** | Build indexes, lookup maps, or thread-safe containers |

#### Poor Fits for `@PostConstruct`

| Discouraged use | Reason |
| ---------- | ---- |
| **Very slow initialization** | Directly delays startup |
| **Many unreliable remote calls** | Failure may prevent bean creation |
| **Application-wide startup work unrelated to this bean** | Prefer `CommandLineRunner`, `ApplicationRunner`, or `ApplicationReadyEvent` |

#### Compared with Application Startup Hooks

| Hook | Timing | Typical use |
| ---- | -------- | -------- |
| **`@PostConstruct`** | During initialization of an individual bean | Initialize resources used by that bean |
| **`CommandLineRunner`** | After the context's startup bean initialization | Run startup tasks |
| **`ApplicationRunner`** | After the context's startup bean initialization | Process structured startup arguments |
| **`ApplicationReadyEvent`** | When the application is fully ready | Work triggered by application readiness |

> 💡 **Use `@PostConstruct` for the bean itself; use runners or application events for application-wide startup work.**

#### Usage Notes

| Topic | Explanation |
| ------ | ---- |
| **Spring Boot 3.x import** | `jakarta.annotation.PostConstruct` |
| **Method signature** | Normally a no-argument instance method returning void |
| **Exceptions** | An exception fails initialization of the bean |
| **Invocation count** | Normally once for a singleton during startup |

***

### 4.4 Advanced: Ordering of Lifecycle Extension Points

Spring provides additional lifecycle extension points beyond the usual annotations. These help explain framework internals but are not the first priority for application development.

| Extension point | Purpose | Typical frequency of use |
| ------ | ---- | ---------------- |
| Aware interfaces such as `BeanNameAware` | Expose container information to the bean | Low |
| `BeanPostProcessor` | Apply processing before and after initialization | Medium |
| `InitializingBean` | Initialization callback interface | Low |
| `DisposableBean` | Destruction callback interface | Low |
| `initMethod` / `destroyMethod` | Specify lifecycle methods for third-party classes | Medium |

The overall sequence is approximately:

```text
Constructor
  ↓
Dependency injection
  ↓
Aware callbacks
  ↓
BeanPostProcessor before-initialization processing
  ↓
@PostConstruct
  ↓
InitializingBean.afterPropertiesSet()
  ↓
Custom initMethod
  ↓
BeanPostProcessor after-initialization processing
  ↓
Bean available for use
  ↓
@PreDestroy
  ↓
DisposableBean.destroy()
  ↓
Custom destroyMethod
```

> **Note:** AOP proxies are usually created during after-initialization processing. Proxy-dependent behavior may therefore not yet be fully available inside `@PostConstruct`.

***

### 4.5 Running Tasks at Startup

| Mechanism | Timing | Description |
| ----------------------- | -------------------- | -------------------------- |
| `@PostConstruct` | Individual bean initialization | Applies to the current bean |
| `CommandLineRunner` | After startup bean initialization | Receives raw command-line arguments |
| `ApplicationRunner` | After startup bean initialization | Receives parsed command-line arguments |
| `ApplicationReadyEvent` | Application readiness | Runs last in this sequence |

#### CommandLineRunner

```java
@Component
@Order(1)  // Lower values run first
public class MyCommandLineRunner implements CommandLineRunner {
    @Override
    public void run(String... args) {
        // args contains raw command-line arguments as a String array
        System.out.println("Arguments: " + Arrays.toString(args));
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
        // ApplicationArguments provides structured argument access
        System.out.println("Non-option args: " + args.getNonOptionArgs());
        System.out.println("Option names: " + args.getOptionNames());

        // Read arguments in --name=value form
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
        System.out.println("The application is fully ready");
    }
}
```

**Order:** `@PostConstruct` → `CommandLineRunner` / `ApplicationRunner` → `ApplicationReadyEvent`

| Requirement | Best fit |
| ---- | ------------ |
| **Initialize a bean's own data** | `@PostConstruct` |
| **Run startup scripts or warm-up tasks** | `CommandLineRunner` |
| **Read structured startup arguments** | `ApplicationRunner` |
| **Wait until the application is ready** | `ApplicationReadyEvent` |

***

## V. Configuration Management

### 5.1 Configuration File Types

Spring Boot configuration files serve the following purposes:

| File | Purpose | Loading stage |
| ------ | ---- | -------- |
| `application.yml` | **Main configuration**, containing application defaults | During application context setup |
| `application-{profile}.yml` | **Profile-specific configuration**, overriding matching main settings when active | During context setup, after the main configuration |
| `bootstrap.yml` | **Bootstrap configuration**, for configuration-server connections, encryption keys, and similar settings | During BootstrapContext setup, before the application context |
| `bootstrap-{profile}.yml` | **Profile-specific bootstrap configuration** | During BootstrapContext setup |

Configuration files normally live in `src/main/resources/`.

**Formats:** `application.properties` uses one `key=value` pair per line; `application.yml` uses a hierarchical format. They serve the same configuration role. `.yml` and `.yaml` are equivalent extensions.

#### bootstrap.yml vs application.yml

| Aspect | bootstrap.yml | application.yml |
| ------ | ------------- | --------------- |
| **Loading stage** | BootstrapContext initialization, earlier | ApplicationContext setup |
| **Main purpose** | Configuration-server address, encryption keys, service name | Business settings and framework configuration |
| **Priority** | Bootstrap property-source precedence depends on the source and override policy | Can be overridden by profiles, environment variables, and other higher-priority sources |
| **Dependencies** | Requires `spring-cloud-context`; with Spring Boot 2.4+, also add `spring-cloud-starter-bootstrap` (or set `spring.cloud.bootstrap.enabled=true`) | Built into Spring Boot |
| **Typical use** | Spring Cloud Config, Vault, or Nacos bootstrap integration | Most everyday application configuration |

**Typical bootstrap.yml contents:**

```yaml
spring:
  application:
    name: user-service            # Service name used by discovery and configuration
  cloud:
    config:
      uri: http://config-server:8888   # Configuration server address
      profile: prod                     # Remote configuration profile
      label: main                       # Git branch
```

**Change with Spring Boot 2.4+:** Earlier Spring Cloud setups enabled `bootstrap.yml` through `spring-cloud-context`. In the Boot 2.4 generation, bootstrap became optional and must be enabled explicitly:

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>
```

> 💡 A plain Spring Boot application without Spring Cloud does not need `bootstrap.yml`; `application.yml` is sufficient. Since Spring Boot 2.4, the preferred alternative to bootstrap is `spring.config.import` in `application.yml` (for example, `spring.config.import: optional:configserver:http://config-server:8888`).

***

### 5.2 YAML Syntax

| Rule | Explanation |
| ------------ | ---------------------------------- |
| Space after a colon | Write `port: 8080`, with a space after the colon |
| cf defines nesting | Use spaces, not tabs; two spaces per level is common |
| `#` starts a comment | Text after `#` to the end of the line is a comment |
| Case-sensitive | `Port` and `port` are different |

#### Data Structures

```yaml
# 1. Object / Map
user:
  name: 张三
  age: 18
# Inline form (a key may appear only once per document):
# user: {name: 张三, age: 18}

# 2. Array / List
hobby:
  - java
  - game
# Inline form:
# hobby: [java, game]

# 3. Array of objects
users:
  - name: 张三
    age: 18
  - name: 李四
    age: 20

# 4. Scalars (simple values)
name: 张三                    # String (sample name)
age: 18                       # Number
enabled: true                 # Boolean
data: null                    # Null (~ is an alternative notation: data: ~)

# 5. Quoting differences
msg1: "Hello\nWorld"          # Double quotes interpret escapes
msg2: 'Hello\nWorld'          # Single quotes preserve the backslash literally
```

***

### 5.3 Common Configuration Properties

```yaml
server:
  port: 8080
  servlet:
    context-path: /api
  tomcat:
    threads:
      max: 200            # Replaces server.tomcat.max-threads (deprecated since Spring Boot 2.3)
    uri-encoding: UTF-8

spring:
  # Data source
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/mydb?serverTimezone=Asia/Shanghai
    username: root
    password: 123456

  # File uploads
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

# Logging
logging:
  level:
    root: INFO
    com.example.mapper: DEBUG
  file:
    name: logs/app.log
```

***

### 5.4 Reading Configuration Values

There are two main approaches: inject individual values for a few settings, or bind related settings together.

| Approach | Suitable when |
| ---- | -------- |
| **Individual values** | Only one or two simple properties are needed |
| **Grouped binding** | Related properties should be managed together |

#### Injecting with @Value

```java
@Value("${server.port}")
private Integer port;

@Value("${app.name:default-name}")  // With a default value
private String appName;
```

**Common `@Value` forms:**

| Form | Description |
| -------------------------------- | ------------------------------ |
| `@Value("${app.name}")` | Inject directly; a missing property causes startup failure |
| `@Value("${app.name:default-name}")` | Use the default when the property is absent |
| `@Value("${app.name:}")` | Default to an empty string |
| `@Value("${app.count:0}")` | Numeric default |
| `@Value("${app.enabled:false}")` | Boolean default |

#### Grouped Binding with @ConfigurationProperties

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

#### Registering `@ConfigurationProperties` Classes

| Method | Description | Typical use |
| ---- | ---- | -------- |
| `@Component` + `@ConfigurationProperties` | Register the properties class directly as a bean | A single properties class; common approach |
| `@EnableConfigurationProperties(AppConfig.class)` | Enable binding explicitly | Third-party classes or centralized registration |
| `@ConfigurationPropertiesScan` | Scan packages for properties classes | Cleaner when there are many properties classes |

#### Relaxed Binding

`@ConfigurationProperties` supports relaxed binding: different spellings of a property can map to the same Java field.

| Property spelling | Java field |
| -------- | -------- |
| `app.first-name` | `firstName` |
| `app.first_name` | `firstName` |
| `APP_FIRSTNAME` | `firstName` |

#### Validating Configuration

Validate required startup settings during binding so problems fail early rather than during business operations.

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

| Annotation | Purpose |
| ---- | ---- |
| `@Validated` | Enables validation of bound configuration (requires `spring-boot-starter-validation`) |
| `@NotBlank` | Requires a nonblank string |
| `@Min` / `@Max` | Constrain numeric ranges |

**Comparing the two approaches:**

| Feature | `@Value` | `@ConfigurationProperties` |
| ------------ | ---------------- | ------------------------------------ |
| **Suitable for** | A few simple settings | Larger or more complex configuration |
| **Nested objects** | No automatic object binding | Supported |
| **Lists/Maps** | Possible, with more involved expressions | Direct binding support |
| **Relaxed binding** | Limited; prefer canonical property names | Supported, including naming-style conversion |
| **Type handling** | Declare the target type explicitly | Converts values to the properties class's field types |

> 💡 **Use `@Value` for isolated values and `@ConfigurationProperties` for groups of related settings.**

***

### 5.5 Externalized Configuration

In addition to configuration files, settings can be supplied through:

#### Command-Line Arguments

```bash
java -jar app.jar --server.port=9090 --spring.profiles.active=prod
```

**Use cases:** Temporary debugging or quickly changing a port.

#### Java System Properties

```bash
# -D options must appear before -jar
java -Dserver.port=9090 -Dfile.encoding=UTF-8 -jar app.jar
```

**Use cases:** JVM system properties, encoding, and time zone settings.

#### Environment Variables

```bash
# Linux/Mac
export SERVER_PORT=9090
export SPRING_DATASOURCE_PASSWORD=secret
java -jar app.jar

# Single-command form
SERVER_PORT=9090 java -jar app.jar

# Windows CMD
set SERVER_PORT=9090
java -jar app.jar
```

**Name conversion:** `server.port` → `SERVER_PORT`. Replace dots (`.`) with underscores (`_`), remove hyphens (`-`), and convert to uppercase.

**Referencing environment variables in a configuration file:**

```yaml
spring:
  datasource:
    # Option 1: read the environment variable directly
    password: ${DB_PASSWORD}
    # Option 2: supply a default when the variable is absent
    username: ${DB_USERNAME:root}
```

**Use cases:** Docker/Kubernetes deployments, sensitive settings, and CI/CD pipelines.

#### Suggested Responsibilities of Configuration Sources

| Setting type | Suggested location |
| -------- | ------------ |
| **Shared defaults** | `application.yml` |
| **Environment-specific settings** | `application-{profile}.yml` |
| **Sensitive values** | Environment variables or a secrets manager |
| **One-off debugging options** | Command-line arguments or JVM options |

> **Note:** Do not commit database passwords, secret keys, tokens, or similar sensitive values directly to Git.

***

### 5.6 Configuration for Multiple Environments

Environment-specific configuration lets the same code run with different settings in development, testing, and production.

| Strategy | Suitable when |
| -------- | -------- |
| **Separate files** | Most projects; clear and commonly used |
| **Multiple YAML documents in one file** | A small configuration should stay in one place |

#### Option 1: Separate Configuration Files

**Naming:** Use `application-{profile}.yml` or `.yaml` (the same pattern applies to `.properties`). Profile names are user-defined; Spring Boot does not reserve names such as dev or prod. The `.yml` and `.yaml` extensions are equivalent.

**Loading order:** Load `application.yml`, then the files for `spring.profiles.active`. Matching keys in profile-specific files override the main file. An active profile without a matching file is not an error; existing configuration sources still apply.

| Common profile name | Purpose |
| ------------ | -------- |
| **dev** | Development environment with shared development databases/services |
| **test** | Test environment |
| **prod** | Production |
| **staging** | Pre-production or rehearsal environment |
| **local** | Local databases and middleware, isolated from shared development resources |

**Multiple active profiles:** `spring.profiles.active=dev,local` activates comma-separated profiles. Their files are loaded in order, and later profiles override earlier ones for matching keys (local overrides dev here).

```text
resources/
├── application.yml          # Shared settings and active profile
├── application-dev.yml      # Development
├── application-test.yml     # Testing
├── application-prod.yml     # Production
└── application-local.yml    # Optional local environment
```

```yaml
# application.yml
spring:
  profiles:
    active: dev  # Activate the development profile

# Shared settings
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

#### Option 2: Multiple Environments in One YAML File

```yaml
# Shared settings
spring:
  profiles:
    active: dev

---
# Development
spring:
  config:
    activate:
      on-profile: dev
server:
  port: 8080

---
# Production
spring:
  config:
    activate:
      on-profile: prod
server:
  port: 80
```

#### Activating Profiles

| Source | Example | Relative priority |
| ---------- | ------------------------------- | ------ |
| Configuration file | `spring.profiles.active=dev` | Low |
| Environment variable | `SPRING_PROFILES_ACTIVE=prod` | Medium |
| JVM argument | `-Dspring.profiles.active=prod` | High |
| Application command-line argument | `--spring.profiles.active=prod` | Highest |

```bash
java -jar app.jar --spring.profiles.active=prod
java -Dspring.profiles.active=prod -jar app.jar
```

> 💡 Unless project constraints suggest otherwise, prefer **separate files with environment-variable or command-line activation** for readability and maintainability.

***

### 5.7 Configuration Precedence

When a setting appears in several places, a higher-priority source overrides a lower-priority source:

| Priority | Source | Example |
| --------- | ---------------- | --------------------------- |
| 1 (highest here) | Application command-line arguments | `--server.port=9090` |
| 2 | Java system properties | `-Dserver.port=9090` |
| 3 | Environment variables | `SERVER_PORT=9090` |
| 4 | Configuration outside the JAR | `./config/application.yml` |
| 5 | Configuration inside the JAR | `classpath:application.yml` |
| 6 (lowest here) | Code-level fallback | Default in `@Value` |

#### A Memory Aid

```text
Closer to the startup command usually means higher priority
Closer to code defaults usually means lower priority
```

> 💡 This table is a **practical summary** of common sources. Actual loading also depends on Config Data, imports, profile ordering, and other factors, but this ordering is a useful starting point for diagnosis.

#### Common Configuration File Locations, Highest First

```text
1. ./config/application.yml            # config under the working directory
2. ./application.yml                   # Working directory
3. classpath:/config/application.yml   # config directory on the classpath
4. classpath:/application.yml          # Classpath root (common)
```

> 💡 **Recommendation:** Use configuration files for development, environment variables for production secrets, and command-line arguments for temporary overrides.

***

## VI. Troubleshooting

### 6.1 Dependency Injection Failures

Injection fails when Spring cannot find a required dependency or finds several candidates without a way to select one.

| Common error | Cause | Resolution |
| -------- | ---- | -------- |
| `NoSuchBeanDefinitionException` | No matching bean in the container | Check scan boundaries, annotations, and configuration registration |
| `NoUniqueBeanDefinitionException` | Multiple matching beans | Use `@Primary`, `@Qualifier`, or explicit name-based selection |
| Circular dependency exception | Beans depend on one another | Prefer restructuring dependencies; use `@Lazy` where appropriate |

Diagnostic sequence:

```text
Identify the exception type
  ↓
Confirm that the class is Spring-managed
  ↓
Check component scanning or configuration registration
  ↓
If several implementations exist, check @Primary / @Qualifier
  ↓
For constructor cycles, consider separating responsibilities or using lazy indirection
```

> 💡 First distinguish **no matching bean** from **several ambiguous beans**; they require different fixes.

***

### 6.2 Auto-configuration Did Not Apply

An auto-configuration that does not apply usually has an unmet condition rather than a broken Spring Boot mechanism.

| Check | Typical issue |
| ------ | -------- |
| **Required dependency** | The intended starter was excluded or versions do not match |
| **Required property** | A feature requires an explicit enabling property |
| **User-defined bean** | Your own bean caused the default to back off |
| **Application type** | The configuration applies only to servlet or reactive web applications |

Useful diagnostic commands:

```bash
# Inspect dependencies
mvn dependency:tree

# Print the auto-configuration report at startup
mvn spring-boot:run -Dspring-boot.run.arguments=--debug
```

***

### 6.3 Binding Failures or Unexpected Values

| Symptom | Common cause | Resolution |
| ---- | -------- | -------- |
| **Null field** | Incorrect `prefix`, unregistered class, or missing setter | Check prefix, registration, and accessors |
| **Environment override ignored** | Incorrect variable naming | For example, `server.port` maps to `SERVER_PORT` |
| **Changing profiles has no effect** | A higher-priority source overrides profile activation | Check application arguments, environment, and JVM properties |
| **Startup fails immediately** | Configuration validation failed | Inspect `@Validated` constraint errors |

> 💡 For subtle configuration problems, identify the source of the effective value instead of inspecting only one `application.yml` file.

***

### 6.4 When to Customize Configuration

| Scenario | Recommendation |
| ---- | ---- |
| **Defaults satisfy the requirement** | Use Spring Boot's defaults |
| **Only a few settings need adjustment** | Change properties before replacing auto-configuration |
| **A core implementation must be replaced** | Define a custom bean and understand which defaults it overrides |
| **A capability should be packaged for reuse** | Create a starter or a dedicated configuration module |

The usual progression is: **use defaults, adjust properties, replace selected beans, then consider custom assembly.**

***

## VII. Core Annotation Reference

### 1. Startup and Configuration

| Annotation | Purpose |
| -------------------------- | ---------------------------------- |
| `@SpringBootApplication` | Composed application entry-point annotation |
| `@SpringBootConfiguration` | Marks a configuration class based on `@Configuration` |
| `@Configuration` | Declares a configuration class |
| `@EnableAutoConfiguration` | Enables auto-configuration |
| `@ComponentScan` | Scans components |
| `@ConfigurationPropertiesScan` | Scans configuration-properties classes |
| `@EnableConfigurationProperties` | Explicitly enables configuration-properties binding |
| `@Import` | Imports configuration classes, ordinary classes, or selectors |
| `@ImportResource` | Imports XML configuration |

### 2. Bean Declarations

| Annotation | Purpose |
| ----------------- | ------------------------------------------ |
| `@Component` | General-purpose component |
| `@Service` | Business-layer component |
| `@Controller` | Web controller |
| `@RestController` | REST controller (`@Controller` + `@ResponseBody`) |
| `@Repository` | Persistence-layer component |
| `@Bean` | Method-level bean definition |
| `@Scope` | Bean scope; scoped proxies support shorter-lived dependencies of singletons |
| `@RequestScope` | Request scope, with configurable proxy mode |
| `@Primary` | Preferred injection candidate |
| `@Lazy` | Lazy initialization |
| `@DependsOn` | Explicit initialization dependencies |

### 3. Dependency Injection

| Annotation | Purpose |
| -------------------------- | ---------------------- |
| `@Autowired` | Type-based injection |
| `@Qualifier` | Selects a qualified bean candidate |
| `@Resource` | Name-based injection from Jakarta Annotations |
| `@Value` | Injects individual values |
| `@ConfigurationProperties` | Binds a group of configuration properties |
| `@Validated` | Enables binding or method-parameter validation |

### 4. Lifecycle

| Annotation or callback | Purpose |
| ---------------- | ----------------- |
| `@PostConstruct` | Initialization callback after dependency injection |
| `@PreDestroy` | Callback before bean destruction |
| `InitializingBean.afterPropertiesSet()` | Initialization callback (same role as `@PostConstruct`) |
| `DisposableBean.destroy()` | Destruction callback (same role as `@PreDestroy`) |
| `@Order` | Specifies ordering |
| `@EventListener` | Handles application events |

### 5. Conditional Annotations

| Annotation | Applies when |
| ------------------------------ | ---------------------------- |
| `@ConditionalOnClass` | The specified class is present |
| `@ConditionalOnMissingClass` | The specified class is absent |
| `@ConditionalOnBean` | A matching bean exists |
| `@ConditionalOnMissingBean` | No matching bean exists |
| `@ConditionalOnProperty` | A property condition matches |
| `@ConditionalOnWebApplication` | The application is a web application |
