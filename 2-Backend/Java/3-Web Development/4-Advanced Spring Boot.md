## I. Starters

### 1.1 Starter Overview

A **starter** is a core Spring Boot feature that groups related dependencies, simplifying Maven/Gradle dependency management.

#### Manual Dependencies vs a Starter

```xml
<!-- Traditional approach: manage each dependency and version manually -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>6.2.19</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>6.2.19</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.19.4</version>
</dependency>
<!-- Tomcat, Validation, and other dependencies are also needed... -->

<!-- Starter approach: declare one dependency -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

#### Benefits of Starters

| Benefit | Description |
| -------- | ----------------------------------------------- |
| Simpler dependencies | One starter replaces several dependency declarations |
| Coordinated versions | Spring Boot manages the supported dependency versions to reduce conflicts |
| Ready-to-use defaults | Starters work with auto-configuration to reduce manual setup |
| Transitive dependencies | Required indirect dependencies are brought in automatically |

***

### 1.2 Starter Naming Conventions

| Type | Convention | Example |
| ------ | ------------------------- | ----------------------------- |
| Official | `spring-boot-starter-*` | `spring-boot-starter-web` |
| Third-party | `*-spring-boot-starter` | `mybatis-spring-boot-starter` |
| Custom | `xxx-spring-boot-starter` | `sms-spring-boot-starter` |

> 💡 These conventions help distinguish official starters from third-party starters.

***

### 1.3 Common Official Starters

| Starter | Purpose |
| -------------------------------- | -------------------------------- |
| `spring-boot-starter` | Core support, including auto-configuration and logging |
| `spring-boot-starter-web` | Web development with MVC, Tomcat, and Jackson |
| `spring-boot-starter-webflux` | Reactive web development with WebFlux |
| `spring-boot-starter-data-jpa` | JPA data access with Hibernate |
| `spring-boot-starter-data-redis` | Redis data access |
| `spring-boot-starter-jdbc` | JDBC data access |
| `spring-boot-starter-test` | Testing with JUnit, Mockito, and more |
| `spring-boot-starter-security` | Spring Security integration |
| `spring-boot-starter-actuator` | Application monitoring and management |
| `spring-boot-starter-validation` | Validation with Hibernate Validator |
| `spring-boot-starter-aop` | AOP support |
| `spring-boot-starter-cache` | Cache abstraction |
| `spring-boot-starter-mail` | Sending email |
| `spring-boot-starter-amqp` | RabbitMQ messaging |
| `spring-boot-starter-quartz` | Quartz scheduling |

***

### 1.4 Inside a Starter

Consider the dependency tree for `spring-boot-starter-web`:

```text
spring-boot-starter-web
├── spring-boot-starter           # Core starter
│   ├── spring-boot               # Spring Boot core
│   ├── spring-boot-autoconfigure # Auto-configuration
│   └── spring-boot-starter-logging  # Logging with Logback
│
├── spring-boot-starter-json      # JSON handling
│   └── jackson-databind          # Jackson
│
├── spring-boot-starter-tomcat    # Embedded Tomcat
│   ├── tomcat-embed-core
│   └── tomcat-embed-websocket
│
├── spring-web                    # Spring Web core
└── spring-webmvc                 # Spring MVC
```

#### What a Starter Actually Is

A starter usually contains little or no implementation code; it is primarily a **dependency aggregator**:

```text
Starter = pom.xml (dependency aggregation) + optional auto-configuration
```

Typical separation:
- **starter module:** A POM that groups related dependencies.
- **autoconfigure module:** Auto-configuration classes and conditional configuration.

```text
spring-boot-starter-web           → Dependency aggregation (POM)
spring-boot-autoconfigure         → Auto-configuration classes such as WebMvcAutoConfiguration
```

***

### 1.5 Inspecting Starter Dependencies

```bash
# Display the complete dependency tree
mvn dependency:tree

# Inspect dependencies for a particular starter
mvn dependency:tree -Dincludes=org.springframework.boot:spring-boot-starter-web

# Write the output to a file
mvn dependency:tree -DoutputFile=dependencies.txt
```

In IDEA, open the `Maven` tool window → `Dependencies` to inspect the tree.

***

## II. Auto-configuration Internals

### 2.1 Overview

**Auto-configuration** is a central part of Spring Boot's convention-over-configuration approach.

```text
┌────────────────┐     ┌─────────────────────┐     ┌───────────────┐     ┌───────────────┐
│ Dependencies   │ ──▶ │ Auto-configuration  │ ──▶ │ Create beans  │ ──▶ │ Ready to use  │
│ (Starter)      │     │ (Check conditions)  │     │               │     │               │
└────────────────┘     └─────────────────────┘     └───────────────┘     └───────────────┘
```

For example, adding `spring-boot-starter-web` enables Spring Boot to configure:

| Configured component | Purpose |
| --------------------- | ---------------- |
| DispatcherServlet | Front controller |
| Embedded Tomcat | Web server |
| HttpMessageConverters | JSON serialization and message conversion |
| Static resource handling | /static and /public |
| Error handling | /error endpoint |

***

### 2.2 How Auto-configuration Is Triggered

#### @EnableAutoConfiguration

`@SpringBootApplication` is a composed annotation:

```java
@SpringBootConfiguration      // Marks a configuration class
@EnableAutoConfiguration      // Enables auto-configuration
@ComponentScan                // Component scanning
public @interface SpringBootApplication { }
```

The key mechanism behind `@EnableAutoConfiguration`:

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)  // The import selector
public @interface EnableAutoConfiguration { }
```

#### AutoConfigurationImportSelector

This central class discovers candidate auto-configurations:

```java
public class AutoConfigurationImportSelector implements DeferredImportSelector {

    @Override
    public String[] selectImports(AnnotationMetadata metadata) {
        // 1. Obtain candidate auto-configuration classes
        List<String> configurations = getCandidateConfigurations(metadata, attributes);
        // 2. Remove duplicates
        configurations = removeDuplicates(configurations);
        // 3. Remove user-specified exclusions
        Set<String> exclusions = getExclusions(metadata, attributes);
        configurations.removeAll(exclusions);
        // 4. Filter using conditions such as @ConditionalOnClass
        configurations = getConfigurationClassFilter().filter(configurations);
        // 5. Return the selected configuration classes
        return configurations.toArray(new String[0]);
    }

    protected List<String> getCandidateConfigurations(...) {
        // Read candidates from META-INF/spring/xxx.imports
        return ImportCandidates.load(AutoConfiguration.class, classLoader)
                .getCandidates();
    }
}
```

***

### 2.3 Auto-configuration Registration Files

#### Spring Boot 2.7+ / 3.x (Recommended)

File: `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`

```text
# One fully qualified configuration class name per line
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration
org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration
...
```

#### Before Spring Boot 2.7

File: `META-INF/spring.factories`

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration,\
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,\
...
```

> ⚠️ Spring Boot 3.0 removed auto-configuration registration through `spring.factories`; use the `.imports` registration file.

***

### 2.4 Conditional Annotations (@Conditional)

Auto-configurations use **conditional annotations** to decide when they apply, enabling configuration on demand.

#### Core Conditional Annotations

| Annotation | Condition | Typical use |
| --------------------------------- | ------------------------------ | --------------------------------------- |
| `@ConditionalOnClass` | Specified class is present | `@ConditionalOnClass(DataSource.class)` |
| `@ConditionalOnMissingClass` | Specified class is absent | Exclude certain environments |
| `@ConditionalOnBean` | Matching bean exists | `@ConditionalOnBean(DataSource.class)` |
| `@ConditionalOnMissingBean` | No matching bean exists | Allow a user-defined implementation to take precedence |
| `@ConditionalOnProperty` | Property condition matches | `@ConditionalOnProperty("spring.xxx")` |
| `@ConditionalOnResource` | Specified resource exists | Check for a configuration resource |
| `@ConditionalOnWebApplication` | Web application | Load only in a web context |
| `@ConditionalOnNotWebApplication` | Non-web application | Load only outside a web context |
| `@ConditionalOnExpression` | SpEL expression is true | Evaluate a more complex condition |
| `@ConditionalOnSingleCandidate` | One candidate can be selected, including a unique primary candidate | Avoid ambiguity between implementations |

#### @ConditionalOnProperty in Detail

```java
@ConditionalOnProperty(
    prefix = "spring.datasource",    // Property prefix
    name = "enabled",                // Full property: spring.datasource.enabled
    havingValue = "true",            // Expected value
    matchIfMissing = true            // Match when absent? Default is false
)
```

| Attribute | Description |
| ---------------- | ------------------------------------------ |
| `prefix` | Property prefix |
| `name`/`value` | Property name |
| `havingValue` | Expected property value |
| `matchIfMissing` | Whether to match an absent property; defaults to false |

#### How Conditions Work

Conditional annotations are built on `@Conditional`:

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Conditional(OnClassCondition.class)  // Select the condition evaluator
public @interface ConditionalOnClass {
    Class<?>[] value() default {};
    String[] name() default {};       // Class names may also be supplied as strings
}
```

An evaluator implements the `Condition` interface (simplified sketch; the real `OnClassCondition` is more elaborate):

```java
public class OnClassCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        // Check whether the required class is on the classpath
        String[] classNames = (String[]) metadata.getAnnotationAttributes(...)
                .get("name");
        for (String className : classNames) {
            if (!ClassUtils.isPresent(className, context.getClassLoader())) {
                return false;  // Class missing: condition does not match
            }
        }
        return true;
    }
}
```

***

### 2.5 Examining an Auto-configuration

Using `DataSourceAutoConfiguration` as an example:

```java
@AutoConfiguration(before = SqlInitializationAutoConfiguration.class)  // Configuration order
@ConditionalOnClass({DataSource.class, EmbeddedDatabaseType.class})    // Required classes present
@ConditionalOnMissingBean(type = "io.r2dbc.spi.ConnectionFactory")     // No reactive connection factory
@EnableConfigurationProperties(DataSourceProperties.class)             // Bind properties
@Import({DataSourcePoolMetadataProvidersConfiguration.class,
         DataSourceInitializationConfiguration.class})
public class DataSourceAutoConfiguration {

    // Embedded database configuration, such as H2
    @Configuration
    @Conditional(EmbeddedDatabaseCondition.class)
    @ConditionalOnMissingBean({DataSource.class, XADataSource.class})  // No user-defined data source
    @Import(EmbeddedDataSourceConfiguration.class)
    protected static class EmbeddedDatabaseConfiguration { }

    // Pooled data source configuration
    @Configuration
    @Conditional(PooledDataSourceCondition.class)
    @ConditionalOnMissingBean({DataSource.class, XADataSource.class})
    @Import({
        DataSourceConfiguration.Hikari.class,   // HikariCP (default)
        DataSourceConfiguration.Tomcat.class,
        DataSourceConfiguration.Dbcp2.class,
        DataSourceConfiguration.OracleUcp.class,
        DataSourceConfiguration.Generic.class
    })
    protected static class PooledDataSourceConfiguration { }
}
```

#### before/after on @AutoConfiguration

```java
@AutoConfiguration(
    before = SqlInitializationAutoConfiguration.class,  // Process before this configuration
    after = DataSourceAutoConfiguration.class           // Process after this configuration
)
public class MyAutoConfiguration { }
```

#### Binding Configuration Properties

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

Corresponding configuration:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
```

***

### 2.6 Overriding Auto-configuration

Auto-configuration follows a user-configuration-first principle:

```text
User-defined bean       → Takes precedence; the matching default backs off
User-defined properties → Override configurable default values
No explicit settings    → Use auto-configuration defaults
```

#### Example: A Custom DataSource

```java
@Configuration
public class MyDataSourceConfig {

    @Bean
    public DataSource dataSource() {
        // The custom DataSource replaces the auto-configured default
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl("jdbc:mysql://localhost:3306/mydb");
        ds.setUsername("root");
        ds.setPassword("123456");
        ds.setMaximumPoolSize(20);
        return ds;
    }
}
```

Because the auto-configuration uses `@ConditionalOnMissingBean(DataSource.class)`, it backs off when a user-defined DataSource exists.

***

### 2.7 Inspecting the Auto-configuration Report

Enable debug mode in `application.yml`:

```yaml
debug: true
```

Startup then prints the condition evaluation report:

```text
============================
CONDITIONS EVALUATION REPORT
============================

Positive matches:   ← Matching auto-configurations
-----------------
DataSourceAutoConfiguration matched:
   - @ConditionalOnClass found required classes 'javax.sql.DataSource'

Negative matches:   ← Nonmatching auto-configurations
-----------------
RedisAutoConfiguration:
   - @ConditionalOnClass did not find required class
     'org.springframework.data.redis.core.RedisOperations'

Exclusions:         ← Excluded configurations
-----------
   None

Unconditional classes:  ← Configurations without conditions
----------------------
   org.springframework.boot.autoconfigure.context.ConfigurationPropertiesAutoConfiguration
```

***

### 2.8 Excluding Auto-configurations

You can disable selected auto-configurations:

```java
// Option 1: exclude a class in the application annotation
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class Application { }

// Option 2: exclude by class name, useful when the class is not on the classpath
@SpringBootApplication(excludeName = {
    "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"
})
public class Application { }
```

```yaml
# Option 3: exclude through configuration properties
spring:
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
      - org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration
```

**Common reasons to exclude a configuration:**
- The project does not need a feature, such as a DataSource for an application without a database
- A component will be configured entirely by the application
- Conflicting auto-configurations need to be resolved

***

### 2.9 Auto-configuration Sequence

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ Spring Boot startup                                                       │
└───────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌───────────────────────────────────────────────────────────────────────────┐
│ @EnableAutoConfiguration → @Import(AutoConfigurationImportSelector)       │
└───────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌───────────────────────────────────────────────────────────────────────────┐
│ Read META-INF/spring/xxx.imports for auto-configuration candidates        │
└───────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌───────────────────────────────────────────────────────────────────────────┐
│ Evaluate the conditions for each configuration                            │
│ ┌─────────────────────────────────────────────────────────────────────┐   │
│ │ @ConditionalOnClass → Required classes present?                     │   │
│ │ @ConditionalOnMissingBean → User bean already defined?              │   │
│ │ @ConditionalOnProperty → Feature enabled?                           │   │
│ └─────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────┘
                  ↓                                        ↓
               Matches                             Does not match
                  ↓                                        ↓
┌───────────────────────────────────┐    ┌───────────────────────────────────┐
│ Apply configuration; create beans │    │ Skip configuration                │
│ Bind @ConfigurationProperties     │    │                                   │
└───────────────────────────────────┘    └───────────────────────────────────┘
                  ↓
┌───────────────────────────────────────────────────────────────────────────┐
│ Auto-configuration complete                                               │
└───────────────────────────────────────────────────────────────────────────┘
```

***

## III. Custom Starters

### 3.1 Why Create a Starter?

| Scenario | Description |
| --------------- | --------------------------------- |
| Shared components | Package reusable features for multiple projects |
| Third-party SDK integration | Wrap services such as SMS, payments, and object storage |
| Organization-wide standards | Standardize logging, monitoring, and security |
| Simpler project configuration | Provide defaults and reduce repeated setup |

***

### 3.2 Project Structure and Development Process

#### 1. Project Structure

A complete custom starter typically contains two modules:

```text
xxx-spring-boot-starter-parent/
│
├── xxx-spring-boot-starter-autoconfigure/   # Auto-configuration and implementation
│   ├── pom.xml
│   └── src/main/
│       ├── java/.../autoconfigure/
│       │   ├── XxxAutoConfiguration.java    # Auto-configuration class
│       │   ├── XxxProperties.java           # Configuration properties
│       │   └── XxxService.java              # Service implementation
│       └── resources/META-INF/
│           ├── spring/
│           │   └── org.springframework.boot.autoconfigure.AutoConfiguration.imports
│           └── additional-spring-configuration-metadata.json
│
└── xxx-spring-boot-starter/                # Dependency aggregator
    └── pom.xml                              # Dependency aggregation
```

| Module | Responsibility | Contents |
| ------------- | ---------------------- | -------------------------------- |
| autoconfigure | Implements auto-configuration | Configuration, properties, service classes, and registration file |
| starter | Aggregates dependencies for consumers | POM depending on the autoconfigure module |

> 💡 A simple starter may combine these modules into one.

#### 2. Development Steps

| Step | Task | Key detail |
| ---- | ----------------------- | ------------------------------------------------------- |
| 1 | Create the autoconfigure module | Depend on `spring-boot-autoconfigure` (or `spring-boot-starter`, which includes it) |
| 2 | Define configuration properties | `@ConfigurationProperties(prefix = "xxx")` |
| 3 | Implement the service | Inject properties through its constructor |
| 4 | Define auto-configuration | `@AutoConfiguration` + `@EnableConfigurationProperties` |
| 5 | Register the auto-configuration | `META-INF/spring/...AutoConfiguration.imports` |
| 6 | Add optional configuration metadata | `additional-spring-configuration-metadata.json` |
| 7 | Create the starter module | POM depending on autoconfigure |
| 8 | Install and use it | `mvn install` → add the dependency to another project |

***

### 3.3 Core Concepts and Mechanisms

#### Core Annotations

| Annotation | Location | Purpose |
| ---- | ------ | ---- |
| `@ConfigurationProperties(prefix="xxx")` | Properties class | Bind `xxx.*` properties to its fields |
| `@EnableConfigurationProperties(Xxx.class)` | Auto-configuration | Enable binding and register the properties bean |
| `@AutoConfiguration` | Auto-configuration class | Mark an auto-configuration (Spring Boot 2.7+) |
| `@ConditionalOnProperty` | Auto-configuration | Enable a feature based on a property |
| `@ConditionalOnMissingBean` | `@Bean` method | Create the default only if the user has not supplied a bean |
| `@Bean` | Configuration method | Register the method's result as a bean |

**Relaxed binding:** `access-key-id`, `accessKeyId`, and `access_key_id` in a configuration file can bind to the Java field `accessKeyId`.

#### Registration File

Spring Boot discovers your auto-configuration through this file:

```text
Path: src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
Contents: one fully qualified configuration class name per line
```

#### How It Works

**1. Maven resolves dependencies**

The application depends on the starter, which depends on the autoconfigure module. Maven brings both in through transitive dependency resolution.

**2. Spring Boot discovers auto-configuration classes**

The autoconfigure module's `.imports` file lists configuration class names. At startup:

```text
@SpringBootApplication
    ↓
@EnableAutoConfiguration
    ↓
@Import(AutoConfigurationImportSelector.class)
    ↓
AutoConfigurationImportSelector implements DeferredImportSelector
    ↓
Import selection reads .imports and returns configuration candidates
```

**3. The configuration applies**

- Mark the class with `@AutoConfiguration` (`@Configuration` also works for registration, but `@AutoConfiguration` is preferred).
- Bind the properties class with `@EnableConfigurationProperties`.
- Declare the service beans with `@Bean` methods.

**4. The application uses the feature**

```yaml
# Configure properties
sms:
  access-key-id: xxx
```

```java
// Inject directly
@Autowired
private SmsService smsService;
```

#### Files You Need to Provide

| File | Purpose |
| ---- | ---- |
| `XxxProperties.java` | Receives the application's `xxx.*` configuration |
| `XxxService.java` | Implements the service |
| `XxxAutoConfiguration.java` | Connects properties and service creation |
| `.imports` file | Registers the auto-configuration for discovery |

#### Key Questions

**Why use `@ConditionalOnMissingBean`?**

It gives user-defined beans priority. If the application defines its own SmsService, your auto-configuration backs off.

**Why use `@ConditionalOnProperty`?**

It lets applications disable the feature through configuration. `matchIfMissing = true` enables it by default when no property is set.

**Why leave `@Component` off the service class?**

The auto-configuration should control its creation. Component scanning could otherwise register it independently of those conditions.

**What does the starter module do?**

Its POM groups the autoconfigure module and other dependencies, such as a cloud SDK, so consumers need only one dependency declaration.

***

### 3.4 Practical Example: An SMS Starter

#### Step 1: Create the Project Structure

Create a Maven project with this layout:

```text
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

> For simplicity, this example combines the starter and autoconfigure modules.

#### Step 2: Configure pom.xml

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
        <maven.compiler.release>${java.version}</maven.compiler.release>
        <maven.compiler.parameters>true</maven.compiler.parameters>
        <spring-boot.version>3.5.16</spring-boot.version>
        <lombok.version>1.18.48</lombok.version>
    </properties>

    <!-- No Spring Boot parent: configure the Java compiler explicitly -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.14.1</version>
                <configuration>
                    <!-- JDK 23+ runs annotation processors only when configured explicitly; Lombok goes first -->
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>${lombok.version}</version>
                        </path>
                        <path>
                            <groupId>org.springframework.boot</groupId>
                            <artifactId>spring-boot-configuration-processor</artifactId>
                            <version>${spring-boot.version}</version>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <dependencies>
        <!-- Required: spring-boot-starter brings spring-boot-autoconfigure plus logging (SLF4J for @Slf4j) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
            <version>${spring-boot.version}</version>
        </dependency>

        <!-- Optional: IDE configuration completion -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <version>${spring-boot.version}</version>
            <optional>true</optional>
        </dependency>

        <!-- Optional: Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${lombok.version}</version>
            <optional>true</optional>
        </dependency>
    </dependencies>
</project>
```

#### Step 3: Define Configuration Properties

Create `SmsProperties.java`:

```java
package com.example.sms.autoconfigure;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "sms")
public class SmsProperties {

    /** Enabled by default */
    private boolean enabled = true;

    /** Access Key ID (required) */
    private String accessKeyId;

    /** Access Key Secret (required) */
    private String accessKeySecret;

    /** SMS sender/signature name */
    private String signName;

    /** Timeout; defaults to 5000 ms */
    private int timeout = 5000;
}
```

#### Step 4: Implement the Service

Create `SmsService.java`:

```java
package com.example.sms.autoconfigure;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class SmsService {

    private final SmsProperties properties;

    /**
     * Send an SMS message
     */
    public boolean send(String phone, String content) {
        // Invoke the actual SMS API here
        log.info("Send SMS - phone: {}, content: {}, signature: {}",
                phone, content, properties.getSignName());

        // TODO: invoke the Alibaba Cloud/Tencent Cloud SDK
        // Use settings such as properties.getAccessKeyId()

        return true;
    }
}
```

#### Step 5: Define the Auto-configuration

Create `SmsAutoConfiguration.java`:

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

#### Step 6: Register the Auto-configuration

Create `src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`:

```text
com.example.sms.autoconfigure.SmsAutoConfiguration
```

> Check this long filename carefully. Its content is one line containing the configuration class's fully qualified name.

#### Step 7: Install in the Local Repository

```bash
mvn clean install
```

#### Step 8: Use It in Another Project

**1. Add the dependency**

```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>sms-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

**2. Configure properties**

```yaml
sms:
  access-key-id: your-access-key
  access-key-secret: your-secret
  sign-name: your-signature
  timeout: 3000
```

**3. Inject and use the service**

```java
@RestController
@RequiredArgsConstructor
public class DemoController {

    private final SmsService smsService;

    @GetMapping("/send")
    public String send(@RequestParam String phone) {
        smsService.send(phone, "Verification code: 1234");
        return "Sent successfully";
    }
}
```

#### Complete File List

```text
sms-spring-boot-starter/
├── pom.xml                                          ← Step 2
└── src/main/
    ├── java/com/example/sms/autoconfigure/
    │   ├── SmsProperties.java                       ← Step 3
    │   ├── SmsService.java                          ← Step 4
    │   └── SmsAutoConfiguration.java                ← Step 5
    └── resources/META-INF/spring/
        └── org.springframework.boot.autoconfigure.AutoConfiguration.imports  ← Step 6
```

***

### 3.5 Best Practices

| Practice | Explanation |
| -------------------------------- | --------------------------------------------------------------------- |
| Use `@ConditionalOn*` | Create beans only when the required conditions match |
| Provide an enable/disable switch | `@ConditionalOnProperty(name = "xxx.enabled", matchIfMissing = true)` |
| Use `@ConditionalOnMissingBean` | Let consumers replace default implementations |
| Provide configuration metadata | Use `spring-boot-configuration-processor` for IDE completion |
| Mark optional dependencies | Use `<optional>true</optional>` for nonessential dependencies |
| Choose sensible defaults | Make the feature usable with minimal configuration |
| Use clear package boundaries | Put auto-configuration in a dedicated package such as `xxx.autoconfigure` |
| Use lite configuration | `@Configuration(proxyBeanMethods = false)` avoids configuration proxy overhead (`@AutoConfiguration` already applies it) |
| State version compatibility | Document the supported Spring Boot versions |
| Provide documentation | Explain configuration and usage in a README |

***

## IV. Appendix

### 1. Auto-configuration Annotation Reference

#### Configuration Annotations

| Annotation | Purpose |
| -------------------------------- | ---------------------------------- |
| `@AutoConfiguration` | Declare an auto-configuration (Spring Boot 2.7+) |
| `@AutoConfiguration(before=...)` | Order it before another configuration |
| `@AutoConfiguration(after=...)` | Order it after another configuration |
| `@Configuration` | Declare a configuration class |
| `@EnableConfigurationProperties` | Enable configuration-properties binding |
| `@ConfigurationProperties` | Bind settings under a prefix |

#### Conditional Annotations

| Annotation | Condition |
| --------------------------------- | ------------------------- |
| `@ConditionalOnClass` | Class present |
| `@ConditionalOnMissingClass` | Class absent |
| `@ConditionalOnBean` | Bean present |
| `@ConditionalOnMissingBean` | Bean absent |
| `@ConditionalOnProperty` | Property matches |
| `@ConditionalOnResource` | Resource exists |
| `@ConditionalOnWebApplication` | Web application |
| `@ConditionalOnNotWebApplication` | Non-web application |
| `@ConditionalOnExpression` | SpEL expression is true |
| `@ConditionalOnSingleCandidate` | One eligible candidate, including a uniquely primary bean |
| `@ConditionalOnJava` | Java version matches |
| `@ConditionalOnJndi` | Required JNDI resource exists |
| `@ConditionalOnCloudPlatform` | Cloud platform matches |

#### Registration File Locations

| Spring Boot version | Registration file |
| ---------------- | ---------------------------------------------------------------------------------- |
| 3.x / 2.7+       | `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` |
| Before 2.7 | `META-INF/spring.factories` (legacy auto-configuration registration) |

### 2. Troubleshooting

| Problem | Cause | Resolution |
| ------------------------------ | -------------------------------------------- | -------------------------------- |
| Auto-configuration does not apply | Missing `.imports` registration | Check the path and fully qualified class name |
| Properties do not bind | Missing `@EnableConfigurationProperties` | Enable binding in the configuration class |
| No IDE property completion | Missing `configuration-processor` | Add it and recompile |
| User-defined bean does not take precedence | Missing `@ConditionalOnMissingBean` | Add the condition to the `@Bean` method |
| Boot 3.x does not load the configuration | Legacy `spring.factories` registration | Use the `.imports` file |
| `NoClassDefFoundError` at startup | A referenced conditional class is absent | Use the `name` attribute with a class-name string where appropriate |

### 3. Custom Starter Checklist

- [ ] `pom.xml` includes `spring-boot-autoconfigure` (directly or through `spring-boot-starter`)
- [ ] `XxxProperties` uses `@ConfigurationProperties(prefix = "xxx")`
- [ ] `XxxAutoConfiguration` uses `@AutoConfiguration`
- [ ] `@EnableConfigurationProperties` enables property binding
- [ ] `@ConditionalOnProperty` provides an enable/disable switch
- [ ] `@ConditionalOnMissingBean` allows user overrides
- [ ] `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` exists
- [ ] The file contains the fully qualified configuration class name
- [ ] Optional: `configuration-processor` is included for IDE support
- [ ] Optional: `additional-spring-configuration-metadata.json` supplements the metadata
- [ ] `mvn install` installs the module locally
