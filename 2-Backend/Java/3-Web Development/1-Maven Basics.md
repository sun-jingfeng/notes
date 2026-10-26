## 1. Maven

### 1. Introduction

**Maven** is an open-source Apache Software Foundation project and a **project management and build tool**.

**Core capabilities:**

| Capability | Description |
| ---------- | ----------------------- |
| **Dependency management** | Automatically downloads and manages the JARs required by the project |
| **Standard project layout** | Provides a consistent directory structure |
| **Project builds** | Provides a standard process for compilation, testing, packaging, and deployment |

**Standard project layout:**

    my-project/
    ├── pom.xml                  # Core Maven project configuration
    ├── src/
    │   ├── main/
    │   │   ├── java/            # Application source code
    │   │   └── resources/       # Configuration and resources
    │   └── test/
    │       ├── java/            # Test source code
    │       └── resources/       # Test configuration and resources
    └── target/                  # Build output directory

***

### 2. Installation and Configuration

**Step 1: Download Maven**

*   Official website: <https://maven.apache.org/download.cgi>
*   Download `apache-maven-3.9.x-bin.zip`

**Step 2: Extract the archive and configure environment variables**

```bash
# Windows
MAVEN_HOME = C:\Program Files\apache-maven-3.9.6
Add to Path: %MAVEN_HOME%\bin

# macOS/Linux (~/.zshrc or ~/.bashrc)
export MAVEN_HOME=/usr/local/apache-maven-3.9.6
export PATH=$MAVEN_HOME/bin:$PATH
```

**Step 3: Verify the installation**

```bash
mvn -version
```

**Step 4: Configure the local repository and mirrors**

Edit `conf/settings.xml`:

```xml
<settings>
    <!-- Local repository location -->
    <localRepository>D:/maven-repo</localRepository>

    <!-- Alibaba Cloud mirror -->
    <mirrors>
        <mirror>
            <id>aliyun</id>
            <mirrorOf>central</mirrorOf>
            <name>Alibaba Cloud mirror</name>
            <url>https://maven.aliyun.com/repository/public</url>
        </mirror>
    </mirrors>
</settings>
```

**Maven settings in IDEA:**

`File → Settings → Build Tools → Maven`

| Setting | Description |
| ------------------ | --------------- |
| Maven home path | Maven installation directory |
| User settings file | Location of settings.xml |
| Local repository | Local repository location |

***

### 3. Project Management

#### 3.1 Creating a Project

**Using IDEA:**

1.  `File → New → Project`
2.  Select `Maven`
3.  Enter GroupId and ArtifactId

**Using the command line:**

```bash
mvn archetype:generate \
  -DgroupId=com.example \
  -DartifactId=my-app \
  -DarchetypeArtifactId=maven-archetype-quickstart
```

#### 3.2 Importing a Project

| Method | Steps |
| -------- | -------------------------------------------------------- |
| Open directly | `File → Open` → select `pom.xml` → `Open as Project` |
| Import a module | `File → Project Structure → Modules → + → Import Module` |
| Maven tool window | In the right-hand `Maven` tool window, click `+` and select `pom.xml` |

***

### 4. Dependency Management

#### 4.1 Maven Coordinates

**Coordinates** uniquely identify a dependency:

```xml
<dependency>
    <groupId>org.springframework</groupId>    <!-- Organization identifier -->
    <artifactId>spring-core</artifactId>      <!-- Artifact name -->
    <version>5.3.20</version>                 <!-- Version -->
</dependency>
```

| Element | Description | Example |
| -------------- | --------- | ------------- |
| **groupId** | Organization identifier, conventionally a reversed domain name | `com.alibaba` |
| **artifactId** | Project/module name | `fastjson` |
| **version** | Version number | `2.0.0` |

**Finding coordinates:** [MVN Repository](https://mvnrepository.com/) or [Maven Central](https://search.maven.org/)

#### 4.2 Declaring Dependencies

```xml
<dependencies>
    <!-- MySQL driver -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.33</version>
    </dependency>

    <!-- JUnit 5 (test scope) -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.9.3</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

#### 4.3 Dependency Scopes

| Scope | Application compilation | Test compilation | Application runtime | Transitive to consumers | Example |
| --------------- | ---------- | -------- | ---------- | ------------ | -------------------- |
| **compile** (default) | ✓ | ✓ | ✓ | ✓ | spring-core |
| **test**        | ✗          | ✓        | ✗          | ✗            | junit                |
| **provided**    | ✓          | ✓        | ✗          | ✗            | servlet-api, lombok  |
| **runtime** | ✗ | ✓ | ✓ | ✓ (propagated with runtime scope) | mysql-connector |

> **Note:** Scope determines when a dependency is available; it does not directly determine whether it is bundled into the artifact. An ordinary JAR does not include dependencies by default. WAR packaging, Spring Boot executable JARs, Shade, and other packaging plugins determine which dependencies to include.

#### 4.4 Transitive Dependencies and Exclusions

**Transitive dependencies:** If A depends on B and B depends on C, A can obtain C indirectly (transitivity depends on B's scope). For **version conflicts**, Maven uses **nearest definition wins** (the version on the shorter dependency path takes precedence), followed by **first declaration wins** when paths are equally long.

Use `<exclusions>` to exclude unwanted transitive dependencies:

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

### 5. Build Lifecycles

#### 5.1 The Three Lifecycles

| Lifecycle | Purpose | Common phases |
| ----------- | ---- | ---------------------------- |
| **clean** | Clean the project | clean |
| **default** | Main build process | compile, test, package, install |
| **site** | Generate the project site | site |

#### 5.2 The Default Lifecycle

    validate → compile → test → package → verify → install → deploy
                 ↓        ↓        ↓                  ↓
               Compile    Test    Package            Install locally

| Phase | Description |
| ----------- | -------------- |
| **compile** | Compile application source code |
| **test** | Run tests |
| **package** | Package the project as a JAR/WAR |
| **install** | Install the artifact in the local repository |
| **deploy** | Publish the artifact to a remote repository, such as a private repository |

**Execution rule:** Running a later phase automatically runs the preceding phases in that lifecycle.

```bash
mvn package    # Automatically runs compile → test → package
mvn install    # Automatically runs compile → test → package → install
```

#### 5.3 Common Commands

```bash
mvn clean              # Clean the target directory
mvn compile            # Compile
mvn test               # Run tests
mvn package            # Package
mvn clean package      # Clean, then package (common combination)
mvn install            # Install in the local repository
mvn clean install -DskipTests   # Skip running tests
mvn deploy                      # Publish to a remote repository (requires distributionManagement)
```

***

## 2. Unit Testing

### 1. JUnit 5 Basics

#### 1.1 Getting Started

**Add the dependency:**

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.9.3</version>
    <scope>test</scope>
</dependency>
```

**Write a test class:**

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

**Run the tests:**

*   IDEA: right-click the test class/method → Run
*   Maven: `mvn test`

#### 1.2 Assertion Methods

```java
import static org.junit.jupiter.api.Assertions.*;

@Test
void testAssertions() {
    // Equality assertions
    assertEquals(expected, actual);
    assertNotEquals(unexpected, actual);

    // Boolean assertions
    assertTrue(condition);
    assertFalse(condition);

    // Null assertions
    assertNull(object);
    assertNotNull(object);

    // Array assertions
    assertArrayEquals(expectedArray, actualArray);

    // Exception assertions
    assertThrows(ArithmeticException.class, () -> {
        calculator.divide(10, 0);
    });

    // Grouped assertions
    assertAll("Addition tests",
        () -> assertEquals(5, calc.add(2, 3)),
        () -> assertEquals(0, calc.add(-1, 1))
    );
}
```

#### 1.3 Common Annotations

| Annotation | Description |
| -------------- | --------------- |
| `@Test` | Marks a test method |
| `@BeforeEach` | Runs before each test method |
| `@AfterEach` | Runs after each test method |
| `@BeforeAll` | Runs once before all tests (static method) |
| `@AfterAll` | Runs once after all tests (static method) |
| `@DisplayName` | Sets the display name of a test |
| `@Disabled` | Disables a test |

**Complete example:**

```java
@DisplayName("Calculator tests")
public class CalculatorTest {

    private Calculator calculator;

    @BeforeAll
    static void beforeAll() {
        System.out.println("Runs once before all tests");
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
        System.out.println("Runs once after all tests");
    }

    @Test
    @DisplayName("Test addition")
    void testAdd() {
        assertEquals(5, calculator.add(2, 3));
    }

    @Test
    @Disabled("Not implemented yet")
    void testMultiply() {
        // Skipped
    }
}
```

**Execution order:**

    @BeforeAll (once)
      ↓
    @BeforeEach → @Test → @AfterEach
      ↓
    @BeforeEach → @Test → @AfterEach
      ↓
    @AfterAll (once)

***

### 2. Spring Boot Testing

#### 2.1 Adding the Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

> **Includes:** JUnit 5, Mockito, AssertJ, and more; separate dependencies are unnecessary.

#### 2.2 @SpringBootTest

`@SpringBootTest` starts a complete Spring application context for **integration testing**.

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

**webEnvironment options:**

| Option | Description |
| -------------- | ------------------ |
| `MOCK` (default) | Mock web environment; does not start a real server |
| `RANDOM_PORT` | Starts a real server on a random port |
| `DEFINED_PORT` | Starts a real server on the configured port |
| `NONE` | Does not create a web environment |

#### 2.3 @MockBean

Mock a dependency instead of invoking the real implementation:

```java
@SpringBootTest
public class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @MockBean
    private UserService userService;

    @Test
    void testCreateOrder() {
        // Configure mock behavior
        when(userService.findById(1L)).thenReturn(new User(1L, "张三"));

        // Execute the test
        Order order = orderService.createOrder(1L, "商品A");

        // Verify
        assertNotNull(order);
        verify(userService, times(1)).findById(1L);
    }
}
```

#### 2.4 @WebMvcTest

Load only web-layer components to test a Controller:

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

Load only JPA components to test a Repository:

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

#### 2.6 Test Configuration

**Use test-specific configuration:**

```java
@SpringBootTest
@ActiveProfiles("test")  // Use application-test.yml
public class UserServiceTest {
    // ...
}
```

For beans needed only in tests, define a `@TestConfiguration` class and import it with `@Import` on the test class.

#### 2.7 Testing Annotation Summary

| Scenario | Annotation | Characteristics |
| ------------- | ----------------- | ------------ |
| Full integration test | `@SpringBootTest` | Loads the complete context |
| Controller test | `@WebMvcTest` | Loads only the web layer |
| Repository test | `@DataJpaTest` | Loads only the JPA layer |
| Mock dependency | `@MockBean` | Replaces a bean in the container |
| Select configuration | `@ActiveProfiles` | Activates the specified profile |
| Test-only beans | `@TestConfiguration` + `@Import` | Configuration that applies only in tests |
