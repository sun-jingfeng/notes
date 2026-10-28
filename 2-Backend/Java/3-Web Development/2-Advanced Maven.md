## I. Multi-Module Design and Development

### 1.1 What Is a Multi-Module Project?

Modularization divides a large project into relatively independent subprojects (modules) according to defined boundaries. Each module is a Maven project with its own `pom.xml`, source code, and resources. Maven dependencies connect the modules into a complete application.

Each Maven module can be compiled, tested, and packaged independently, and other modules can depend on it. Modules refer to one another using GAV coordinates (GroupId, ArtifactId, Version).

### 1.2 Why Split a Project into Modules?

As business requirements grow, so does the codebase. Keeping all code in one project can cause the following problems:

| Problem | Symptoms | Improvement with modules |
| ---------------- | -------------------------------------------- | ---------------------------------- |
| **Tight coupling** | Layer boundaries become unclear; a Controller may call a Mapper directly | Physical module boundaries allow dependency checks at compile time |
| **Difficult collaboration** | Many developers modify one project, causing frequent conflicts | Teams own separate modules, reducing conflicts |
| **Poor reuse** | Utility classes are scattered and changes must be synchronized in several places | Shared modules are maintained independently and reused across projects |
| **Slow builds and deployment** | A small change requires rebuilding the entire project | Incremental builds can focus on changed modules |

### 1.3 Common Modularization Approaches

Three common approaches depend on the project's size and complexity:

#### 1. Split by Layer (Recommended for Small and Medium Projects)

Use MVC architectural layers for a clear, familiar structure:

```text
myapp-parent/
├── myapp-common/     # Data classes (Entity, DTO, VO)
├── myapp-utils/      # Utility classes
├── myapp-dao/        # Data access (Mapper interfaces and XML)
├── myapp-service/    # Business logic
└── myapp-web/        # Web layer (Controllers and application entry point)
```

#### 2. Split by Business Capability (Large Projects/Microservices)

Divide the project by business capability so that each module is cohesive:

```text
project-parent/
├── project-common/   # Shared module
├── project-user/     # Users
├── project-order/    # Orders
└── project-payment/  # Payments
```

#### 3. Combine Both Approaches (Large Monoliths)

Split by business capability first, then subdivide each capability by layer:

```text
project-parent/
├── project-common/
│   ├── common-pojo/
│   └── common-utils/
├── project-user/
│   ├── user-mapper/
│   ├── user-service/
│   └── user-web/
└── ...
```

### 1.4 Dependencies Between Modules

**Core rule: Higher layers depend on lower layers; lower layers must not depend on higher layers.** Keep dependencies one-way to avoid cycles.

```text
┌────────────────┐
│   myapp-web    │  ← Controllers and application entry point
└───────┬────────┘
        ↓
┌────────────────┐
│ myapp-service  │  ← Service interfaces and implementations
└───────┬────────┘
        ↓
┌────────────────┐
│   myapp-dao    │  ← Mapper interfaces
└───────┬────────┘
        ↓
┌────────────────┐
│  myapp-common  │  ← Data classes
└────────────────┘
```

### 1.5 Dependency Transitivity

Maven dependencies are transitive: if A depends on B and B depends on C, A can obtain C automatically.

Thus, although `myapp-web` declares only a dependency on `myapp-service`, it can use classes from `myapp-common` through the myapp-service → myapp-dao → myapp-common dependency chain.

### 1.6 Declaring Module Dependencies

```xml
<!-- myapp-service/pom.xml -->
<dependencies>
    <dependency>
        <groupId>com.example</groupId>
        <artifactId>myapp-dao</artifactId>
        <version>1.0.0</version>
    </dependency>
</dependencies>
```

### 1.7 Things to Watch For

#### 1. Use a Consistent Package Prefix

Use a common package prefix, such as `com.example`, across modules to simplify Spring Boot component scanning.

#### 2. Component Scanning

By default, Spring Boot scans the package containing the application class and its subpackages. Configure scanning explicitly when other modules use different packages:

```java
@SpringBootApplication
@ComponentScan(basePackages = {"com.example", "com.thirdparty"})
@MapperScan("com.example.mapper")
public class MyApplication { ... }
```

#### 3. Dependency Version Conflicts

When modules introduce different versions of a dependency, Maven uses the nearest definition. Prefer managing versions centrally in the parent's `<dependencyManagement>`.

Conflicting dependencies can also be excluded with `<exclusions>`:

```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>myapp-service</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

#### 4. Build Order

Dependencies must be built before the modules that use them. Run `mvn clean install` from the parent module so Maven can determine the order.

***

## II. Inheritance and Aggregation

Inheritance centralizes **configuration**; aggregation coordinates **builds**. Projects commonly use both.

### 2.1 Inheritance

#### 1. Concept

Child modules inherit configuration through `<parent>`, avoiding duplication. The parent typically contains shared configuration rather than business code.

#### 2. Three Benefits of Inheritance

1. **Consistent versions:** All child modules use the same dependency versions, reducing conflicts.
2. **Simpler configuration:** Define shared configuration once in the parent.
3. **Easier maintenance:** Update a dependency version in one place.

#### 3. Inheritable Configuration

| Configuration | Description |
| ----------------------- | -------------------------- |
| `groupId`, `version` | Project coordinates |
| `properties` | Custom properties |
| `dependencies` | Shared dependencies inherited by child modules |
| `dependencyManagement` | Dependency version management |
| `pluginManagement` | Plugin version management |
| `build`, `repositories` | Build and repository configuration |

> **Note:** `artifactId` is not inherited. Each module must define its own.

#### 4. `<dependencies>` vs `<dependencyManagement>` (Core Concept)

This distinction is central to inheritance. **Understand it before studying the configuration examples.**

| Aspect | `<dependencies>` | `<dependencyManagement>` |
| ---------- | ---------------------- | ------------------------ |
| Purpose | Adds dependencies directly | Manages versions without adding dependencies |
| Effect on children | **Automatically inherited** as dependencies | **Not automatically added**; children declare dependencies as needed |
| Use case | Dependencies required by every module | Dependencies needed by only some modules |

> **Version overrides:** If parent and child specify different versions of the same dependency, **the child's version wins**. A child can override a parent version explicitly, whether that version is declared in `<dependencies>` or `<dependencyManagement>`.

> **Best practice:**
> - Dependencies used by every module, such as Lombok → `<dependencies>`
> - Dependencies used by selected modules, such as MyBatis → `<dependencyManagement>`

#### 5. Three Packaging Types

| Type | Description | Typical use |
| ------- | ------------------------------------------------ | -------------------------- |
| **jar** | Standard module packaging; a Spring Boot application with embedded Tomcat can run directly | Spring Boot applications and utility libraries |
| **war** | Web application archive deployed to an external Tomcat | Traditional Java web projects |
| **pom** | Parent/aggregator project containing management configuration rather than application code | Multi-module parent projects |

> The default `<packaging>` is `jar`. **Parent modules must use `pom`.**

#### 6. Configuring the Parent Module

The parent's `pom.xml` has five main parts:

**1. Basic information**

```xml
<groupId>com.example</groupId>
<artifactId>myapp-parent</artifactId>
<version>1.0.0</version>
<packaging>pom</packaging>  <!-- Must be pom -->
```

**2. Properties (Custom Configuration Values)**

Custom values defined in `<properties>` can be referenced elsewhere in the POM with `${propertyName}`.

**Definition:** Within `<properties>`, each element's name is the property name and its content is the property value.

```xml
<properties>
    <java.version>17</java.version>
    <spring-boot.version>3.5.16</spring-boot.version>
    <mybatis.version>3.0.5</mybatis.version>
    <myapp.version>1.0.0</myapp.version>
</properties>
```

**Reference:** Use `${propertyName}`; Maven substitutes the value during the build.

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>${mybatis.version}</version>  <!-- Property reference; resolves to 3.0.5 -->
</dependency>
```

**Common uses:**

| Purpose | Example property | Description |
|------|---------|------|
| Shared dependency versions | `<spring-boot.version>` | Reuse one version in several places and update it centrally |
| JDK version | `<java.version>` | Specify the Java compilation version |
| Character encoding | `<project.build.sourceEncoding>` | Use a consistent project encoding |
| Child module versions | `<myapp.version>` | Manage child module versions together |

> **Inheritance:** Children inherit the parent's `<properties>`. Define shared versions in the parent to avoid repeating them.

**3. Dependency version management** — declare versions without adding dependencies.

```xml
<dependencyManagement>
    <dependencies>
        <!-- Import Spring Boot dependency management through its BOM -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${spring-boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <!-- Third-party dependencies -->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>${mybatis.version}</version>
        </dependency>

        <!-- Child module versions -->
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>myapp-common</artifactId>
            <version>${myapp.version}</version>
        </dependency>
        <!-- ... Other child modules ... -->
    </dependencies>
</dependencyManagement>
```

**4. Shared dependencies** — automatically inherited by every child.

```xml
<dependencies>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

**5. Plugin management**

```xml
<build>
    <pluginManagement>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring-boot.version}</version>
            </plugin>
        </plugins>
    </pluginManagement>
</build>
```

#### 7. Configuring Child Modules

A child declares its parent with `<parent>`. `<relativePath>` specifies the relative path to the parent's `pom.xml`.

**Three forms of `<relativePath>`:**

| Form | Meaning | Typical use |
| ---------------------------------------------------- | ---------------------------- | -------------------------------------- |
| `<relativePath>../pom.xml</relativePath>` | Look for the parent POM at this path | Standard aggregate layout, with children under the parent directory |
| `<relativePath/>` or `<relativePath></relativePath>` | Skip the relative filesystem lookup and resolve from repositories | Parent already published to a repository or stored elsewhere |
| Omitted | Defaults to `../pom.xml` | Standard aggregate layout |

> **Note:** If the parent has not been installed into the local repository and the path selected by `<relativePath>` does not exist or is incorrect, Maven may fail to resolve the parent POM.

**Inherited coordinates:** A child inherits `groupId` and `version` from its parent, so it can omit those elements.

```xml
<project>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>myapp-parent</artifactId>
        <version>1.0.0</version>
        <relativePath>../pom.xml</relativePath>  <!-- Relative path to the parent POM -->
    </parent>

    <!-- groupId is inherited and may be omitted -->
    <artifactId>myapp-service</artifactId>
    <!-- version is inherited and may be omitted -->

    <dependencies>
        <!-- Version comes from the parent's dependencyManagement -->
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>myapp-dao</artifactId>
        </dependency>
    </dependencies>
</project>
```

**Why does the IDE mark some `<version>` elements as inheritable but not others?**

| Location | Can it be omitted? | Explanation |
|------|-----------|------|
| `<version>` inside `<parent>` | **No** | Identifies which parent version to inherit; Maven requires it |
| The child's own `<version>` alongside `<artifactId>` | Yes | Inherited when omitted; an identical explicit version may trigger an IDE hint |
| A dependency's `<version>` in `<dependencies>` | Sometimes | Can be omitted if the parent's `<dependencyManagement>` supplies it |

#### 8. What Is a BOM (Bill of Materials)?

A **BOM (Bill of Materials)** is a Maven POM used to **manage dependency versions without adding the dependencies themselves**.

Think of it as a version catalog:
- Its `<dependencyManagement>` entries say, for example, "spring-boot-starter-web uses version 3.5.16."
- It **does not** add those dependencies to the project; it specifies which versions to use.
- A managed dependency declared in `<dependencies>` **can omit its version** and use the catalog's version.

Spring's `spring-boot-dependencies` is a BOM. Importing it brings Spring Boot's dependency version catalog into the project.

#### 9. Two Ways to Use Spring Boot's Parent Configuration

**Option 1: Direct inheritance** (common in single-module projects)

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.5.16</version>
</parent>
```

**Option 2: Import the BOM** (when the project has its own parent; Maven supports only one parent)

If the project already has a custom parent such as `myapp-parent`, keep that parent and import Spring Boot's dependency version management as a BOM.

```xml
<!-- In your myapp-parent pom.xml -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>3.5.16</version>
            <type>pom</type>       <!-- Import a POM, not a JAR -->
            <scope>import</scope>  <!-- Merge this POM's dependencyManagement -->
        </dependency>
    </dependencies>
</dependencyManagement>
```

| Aspect | Option 1: Direct inheritance | Option 2: BOM import |
| ---- | ----------------- | ----------------- |
| Configuration | Set `<parent>` to spring-boot-starter-parent | Import spring-boot-dependencies in `<dependencyManagement>` |
| Suitable when | A single module or parent can inherit from Spring Boot | The project must retain its own parent POM |
| Result | Dependency versions plus Spring Boot parent plugin configuration | Dependency version management only, without the other parent configuration |

***

### 2.2 Aggregation

#### 1. Concept

Aggregation groups modules using `<modules>` in a parent/aggregator project. The aggregator knows its child modules and can apply a Maven command to the entire group.

#### 2. Benefits of Aggregation

1. **One-command builds:** Build every module with `mvn clean install`.
2. **Automatic ordering:** Maven determines build order from dependencies.
3. **Central overview:** See all project modules in one place.

#### 3. Configuring Aggregation

```xml
<project>
    <groupId>com.example</groupId>
    <artifactId>myapp-parent</artifactId>
    <packaging>pom</packaging>

    <modules>
        <module>myapp-common</module>
        <module>myapp-utils</module>
        <module>myapp-dao</module>
        <module>myapp-service</module>
        <module>myapp-web</module>
    </modules>
</project>
```

#### 4. Building an Aggregate Project

```bash
cd myapp-parent
mvn clean install
```

Maven prints the build order automatically (Reactor Build Order). The parent POM comes first because every child inherits from it:

```text
[INFO] Reactor Build Order:
[INFO]
[INFO] myapp-parent                                   [pom]
[INFO] myapp-common                                   [jar]
[INFO] myapp-utils                                    [jar]
[INFO] myapp-dao                                      [jar]
[INFO] myapp-service                                  [jar]
[INFO] myapp-web                                      [jar]
```

#### 5. Building Selected Modules

```bash
# Build only the specified module
mvn clean install -pl myapp-service

# Also build modules that it depends on
mvn clean install -pl myapp-service -am

# Also build modules that depend on it
mvn clean install -pl myapp-dao -amd
```

***

### 2.3 Inheritance vs Aggregation

| Aspect | Inheritance | Aggregation |
| ------------ | --------------------------- | --------------------------- |
| **Purpose** | Centralize configuration | Coordinate builds |
| **Direction** | Child → parent (child declares its parent) | Parent → child (aggregator lists modules) |
| **Configuration** | `<parent>` in the child | `<modules>` in the aggregator |
| **Packaging** | Parent must use `pom` | Aggregator must use `pom` |

> **Real projects commonly combine inheritance and aggregation:** the parent provides shared configuration and coordinates the build.

***

## III. Private Repositories

### 3.1 What Is a Private Repository?

A private Maven repository server runs on an organization's network, between developers' local repositories and Maven Central. Its main functions are:

1. **Store internal JARs** for the team to share.
2. **Proxy and cache dependencies** to speed up downloads from Central.

### 3.2 Why Use a Private Repository?

| Scenario | Problem | Private repository solution |
| ------------- | -------------------- | -------------------------- |
| Sharing internal JARs | Manual copying is required | Publish artifacts and consume them as Maven dependencies |
| Slow downloads | Everyone downloads directly from Central | Cache artifacts for fast access over the internal network |
| Network isolation | Direct internet access is unavailable | Use the private repository as the dependency source |
| Security auditing | Dependency sources are difficult to control | Manage artifact sources centrally |

### 3.3 Repository Types

```text
┌────────────────────────────────────────┐
│            Nexus repository            │
├────────────────────────────────────────┤
│  hosted - stores internal JARs         │
│    ├── maven-releases   releases       │
│    └── maven-snapshots  development    │
│                                        │
│  proxy - proxies remote repositories   │
│    └── maven-central   cached content  │
│                                        │
│  group - combines repositories         │
│    └── maven-public    shared endpoint │
└────────────────────────────────────────┘
```

| Type | Purpose | Uploads allowed? |
| ---------- | -------------------------- | ---------- |
| **hosted** | Stores internally developed JARs | Yes |
| **proxy** | Proxies and caches a remote repository | No (read-only) |
| **group** | Provides one endpoint for several repositories | No |

### 3.4 SNAPSHOT vs RELEASE

| Version type | Example | Repository | Characteristics |
| ------------ | ---------------- | --------------- | ---------------------------------- |
| **SNAPSHOT** | `1.0.0-SNAPSHOT` | maven-snapshots | Can be republished; Maven checks for updates |
| **RELEASE** | `1.0.0` | maven-releases | Not overwritten, preserving stable releases |

**Version progression:**

```text
1.0.0-SNAPSHOT → Development → 1.0.0 → Release → 1.1.0-SNAPSHOT → ...
```

### 3.5 Common Repository Managers

- **Nexus** (widely used): Broad functionality and support for multiple formats.
- **Artifactory**: Extensive enterprise features.
- **Archiva**: Apache open-source repository manager with a simpler feature set.

### 3.6 Installing Nexus

```text
# Directory layout after downloading and extracting
nexus-3.x.x/
├── bin/nexus          # Startup script
└── etc/               # Configuration

sonatype-work/nexus3/
├── admin.password     # Initial administrator password
└── blobs/             # Repository data
```

```bash
# Startup commands (run inside nexus-3.x.x/)
./bin/nexus start      # Run in the background
./bin/nexus run        # Run in the foreground for debugging
./bin/nexus stop       # Stop

# Open: http://localhost:8081
# Username: admin; initial password: see admin.password (changed on first login)
```

### 3.7 Configuring Maven to Use a Private Repository

#### 1. settings.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings>
    <!-- Server authentication (used for deploy) -->
    <servers>
        <!-- Example credentials; mvn -ep (encrypt password) can encrypt the stored password -->
        <server>
            <id>maven-releases</id>
            <username>admin</username>
            <password>admin123</password>
        </server>
        <server>
            <id>maven-snapshots</id>
            <username>admin</username>
            <password>admin123</password>
        </server>
    </servers>

    <!-- Mirror configuration: route all repository requests through the private server -->
    <mirrors>
        <mirror>
            <id>nexus</id>
            <mirrorOf>*</mirrorOf>
            <url>http://192.168.1.100:8081/repository/maven-public/</url>
        </mirror>
    </mirrors>

    <!-- Profile configuration -->
    <profiles>
        <profile>
            <id>nexus</id>
            <repositories>
                <repository>
                    <id>nexus</id>
                    <url>http://192.168.1.100:8081/repository/maven-public/</url>
                    <releases><enabled>true</enabled></releases>
                    <snapshots><enabled>true</enabled></snapshots>
                </repository>
            </repositories>
        </profile>
    </profiles>

    <activeProfiles>
        <activeProfile>nexus</activeProfile>
    </activeProfiles>
</settings>
```

> **Note**: Maven 3.8.1+ blocks plain-HTTP repositories that are not on localhost (the built-in `maven-default-http-blocker` mirror). In practice, serve the repository manager over HTTPS; the HTTP URLs here only illustrate a LAN setup.

#### 2. pom.xml (Publishing)

```xml
<distributionManagement>
    <repository>
        <id>maven-releases</id>  <!-- Must match the server id in settings.xml -->
        <url>http://192.168.1.100:8081/repository/maven-releases/</url>
    </repository>
    <snapshotRepository>
        <id>maven-snapshots</id>
        <url>http://192.168.1.100:8081/repository/maven-snapshots/</url>
    </snapshotRepository>
</distributionManagement>
```

### 3.8 Publishing to a Private Repository

```bash
mvn deploy                  # Publish
mvn deploy -DskipTests      # Publish without running tests
```

Maven chooses the target repository based on the version:
- `x.x.x-SNAPSHOT` → maven-snapshots
- `x.x.x` → maven-releases

### 3.9 Dependency Download Flow

```text
Local repository → Private repository group → Maven Central
             ↓
        Cache on the private server
             ↓
        Cache locally
```

### 3.10 Troubleshooting

| Error | Cause | Resolution |
| ------------------------------------------ | ---------------------- | ---------------------------------------------------- |
| **401 Unauthorized** | Authentication failed | Check credentials and ensure the server id matches the repository id |
| **400 Repository does not allow updating** | Attempt to overwrite a release | Use a SNAPSHOT or increment the version |
| **Connection timed out** | Network problem | Check the server address, port, and firewall |
| **SNAPSHOT does not update** | Restricted update policy | Force an update with `mvn install -U` |

***

## IV. Practical Example: Building a Multi-Module Project

### 4.1 Project Layout

```text
myapp-parent/
├── pom.xml              # Parent (inheritance and aggregation)
├── myapp-common/        # Data classes
├── myapp-utils/         # Utilities
├── myapp-dao/           # Data access
├── myapp-service/       # Business logic
└── myapp-web/           # Web layer and application entry point
```

### 4.2 Parent pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>myapp-parent</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>

    <!-- Aggregation -->
    <modules>
        <module>myapp-common</module>
        <module>myapp-utils</module>
        <module>myapp-dao</module>
        <module>myapp-service</module>
        <module>myapp-web</module>
    </modules>

    <!-- Properties -->
    <properties>
        <java.version>17</java.version>
        <maven.compiler.release>${java.version}</maven.compiler.release>
        <maven.compiler.parameters>true</maven.compiler.parameters>
        <spring-boot.version>3.5.16</spring-boot.version>
        <mybatis.version>3.0.5</mybatis.version>
        <myapp.version>1.0.0</myapp.version>
    </properties>

    <!-- The BOM manages dependencies only; configure compiler and Boot plugins explicitly -->
    <build>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.14.1</version>
                    <configuration>
                        <!-- JDK 23+ no longer runs annotation processors found on the classpath implicitly;
                             list Lombok explicitly (the version comes from dependencyManagement) -->
                        <annotationProcessorPaths>
                            <path>
                                <groupId>org.projectlombok</groupId>
                                <artifactId>lombok</artifactId>
                            </path>
                        </annotationProcessorPaths>
                    </configuration>
                </plugin>
                <plugin>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-maven-plugin</artifactId>
                    <version>${spring-boot.version}</version>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>

    <!-- Version management -->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>org.mybatis.spring.boot</groupId>
                <artifactId>mybatis-spring-boot-starter</artifactId>
                <version>${mybatis.version}</version>
            </dependency>
            <!-- Child modules -->
            <dependency>
                <groupId>com.example</groupId>
                <artifactId>myapp-common</artifactId>
                <version>${myapp.version}</version>
            </dependency>
            <dependency>
                <groupId>com.example</groupId>
                <artifactId>myapp-dao</artifactId>
                <version>${myapp.version}</version>
            </dependency>
            <dependency>
                <groupId>com.example</groupId>
                <artifactId>myapp-service</artifactId>
                <version>${myapp.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <!-- Shared dependencies -->
    <dependencies>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>
```

### 4.3 Child pom.xml Examples

**myapp-common** (lowest layer; no business dependencies)

```xml
<project>
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>myapp-parent</artifactId>
        <version>1.0.0</version>
    </parent>
    <artifactId>myapp-common</artifactId>
</project>
```

**myapp-service** (depends on the data-access module)

```xml
<project>
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>myapp-parent</artifactId>
        <version>1.0.0</version>
    </parent>
    <artifactId>myapp-service</artifactId>

    <dependencies>
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>myapp-dao</artifactId>
        </dependency>
    </dependencies>
</project>
```

**myapp-web** (Spring Boot application)

```xml
<project>
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>myapp-parent</artifactId>
        <version>1.0.0</version>
    </parent>
    <artifactId>myapp-web</artifactId>

    <dependencies>
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>myapp-service</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

### 4.4 Building and Running

```bash
cd myapp-parent
mvn clean install           # Build all modules

cd myapp-web
mvn spring-boot:run         # Run the application
# Or
java -jar target/myapp-web-1.0.0.jar
```

***

## V. Quick Reference

### 5.1 Configuration and Commands

| Topic | Core configuration | Common command |
| ---------- | ------------------------------------ | ------------------- |
| **Modules** | `<dependency>` | - |
| **Inheritance** | `<parent>`, `<dependencyManagement>` | - |
| **Aggregation** | `<modules>` | `mvn clean install` |
| **Private repositories** | `<distributionManagement>` | `mvn deploy` |

### 5.2 Best-Practice Checklist

**Modularization:**
- [ ] Choose a split appropriate to the project's size
- [ ] Give each module one responsibility and avoid circular dependencies
- [ ] Use a consistent package prefix

**Inheritance and aggregation:**
- [ ] Set the parent's `packaging` to `pom`
- [ ] Manage versions in `<dependencyManagement>`
- [ ] Put universally needed dependencies in `<dependencies>` and optional module dependencies in `<dependencyManagement>`
- [ ] Combine inheritance and aggregation

**Private repositories:**
- [ ] Use SNAPSHOT versions during development and RELEASE versions for publishing
- [ ] Keep server ids in settings.xml consistent with repository ids in pom.xml
- [ ] Use `-U` when a SNAPSHOT needs to be refreshed
