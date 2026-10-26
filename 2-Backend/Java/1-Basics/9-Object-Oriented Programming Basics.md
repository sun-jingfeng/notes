## I. Object-Oriented Thinking

### 1. What Is Object-Oriented Programming?

Object-oriented programming (OOP) is a programming approach **centered on objects**.

### 2. Comparing Two Programming Approaches

| Approach     | Focus    | Way of thinking          | Example                   |
| -------- | ----- | ------------- | -------------------- |
| **Procedural** | Steps and procedures | Do everything yourself; focus on how each step works | Cook yourself: buy ingredients → wash → chop → cook → plate  |
| **Object-oriented** | Objects and responsibilities | Find objects and ask them to perform actions     | Order delivery: find a restaurant (object) and call its "deliver food" operation |

### 3. Three Core OOP Features

| Feature     | Description              | Keywords                     |
| ------ | --------------- | ----------------------- |
| **Encapsulation** | Hide internal details and expose a public interface | `private`、getter/setter |
| **Inheritance** | A subclass inherits fields and methods from a superclass    | `extends`               |
| **Polymorphism** | The same method behaves differently on different objects | Overriding; a superclass reference referring to a subclass instance           |

### 4. Advantages of OOP

| Advantage       | Description               |
| -------- | ---------------- |
| **Maintainability** | Clear code structure that is easy to understand and modify   |
| **Extensibility** | Inheritance and polymorphism make adding features easier  |
| **Reusability** | Classes can be instantiated repeatedly, reusing their code |
| **Flexibility**  | Polymorphism and interfaces reduce coupling between modules |

***

## II. Classes and Objects

### 1. Basic Concepts

| Concept             | Description                 | Real-world analogy   |
| -------------- | ------------------ | ------ |
| **Class**   | An object's template or blueprint, describing shared characteristics and behavior | A car's design blueprint |
| **Object** | A concrete instance of a class; an actual individual entity     | The car you drive |

**Relationship**: A class is an abstract concept, while an object is a concrete entity. Define a class first, then create objects.

### 2. Defining a Class

```java
public class Phone {
    // ========== Fields (attributes): what an object "has" ==========
    String brand;   // Brand
    double price;   // Price
    String color;   // Color

    // ========== Methods (behavior): what an object "can do" ==========
    public void call(String name) {
        System.out.println("Calling " + name);
    }

    public void playGame() {
        System.out.println("Playing a game");
    }
}
```

### 3. Creating and Using Objects

```java
public class PhoneTest {
    public static void main(String[] args) {
        // 1. Create an object: ClassName objectName = new ClassName();
        Phone p = new Phone();

        // 2. Assign a value: objectName.fieldName = value;
        p.brand = "Huawei";
        p.price = 5999.0;
        p.color = "Black";

        // 3. Read a value: objectName.fieldName
        System.out.println(p.brand);  // Huawei

        // 4. Call a method: objectName.methodName(arguments);
        p.call("张三");    // Calling 张三
        p.playGame();      // Playing a game
    }
}
```

### 4. Default Field Values

When an object is created, its fields automatically receive default values:

| Data type | Default value           |
| ---- | ------------- |
| Integer types | `0`           |
| Floating-point types | `0.0`         |
| Boolean type | `false`       |
| Character type | `\u0000` (null character) |
| Reference types | `null`        |

### 5. null References

```java
Phone p = null;  // The reference does not refer to any object

// p.brand = "Huawei";  ❌ NullPointerException

// Check for null before use
if (p != null) {
    p.call("张三");
}
```

### 6. Comparing Objects

```java
Phone p1 = new Phone();
Phone p2 = new Phone();
Phone p3 = p1;

// == compares references (whether they refer to the same object)
System.out.println(p1 == p2);  // false (different objects)
System.out.println(p1 == p3);  // true (the same object)

// By default, equals() also compares references; override it to compare contents
System.out.println(p1.equals(p2));  // false (not overridden)
```

***

## III. Classes and Objects in Memory

### 1. JVM Memory Areas

| Area                   | Contents                  | Change in JDK 8+ |
| -------------------- | --------------------- | --------- |
| **Stack**       | Method execution, local variables, and object references (addresses)   | No change       |
| **Heap**        | Objects created with new and their fields        | No change       |
| **Method area** | .class bytecode files, static variables, and constant pools | Replaced by **Metaspace** |

**JDK 8+ change**: The method area moved from JVM memory to **Metaspace**, which uses native memory and is no longer limited by the JVM heap size.

### 2. Memory Diagram for One Object

```java
Phone p = new Phone();
p.brand = "Xiaomi";
p.price = 2999.0;
```

    ┌───────────────────────┐
    │ Method area/Metaspace │
    │  Phone.class          │
    └───────────────────────┘

    ┌─────────────────┐                    ┌──────────────────────┐
    │     Stack        │                    │       Heap            │
    │                 │                    │                      │
    │  main method    │                    │   Phone object @0x001 │
    │  ┌───────────┐  │                    │  ┌──────────────────┐ │
    │  │ p = 0x001 │──┼────────────────────┼─→│ brand = "Xiaomi"  │ │
    │  └───────────┘  │                    │  │ price = 2999.0   │ │
    │                 │                    │  │ color = null     │ │
    └─────────────────┘                    │  └──────────────────┘ │
                                           └──────────────────────┘

### 3. Two References to the Same Object

```java
Phone p1 = new Phone();
p1.brand = "Huawei";

Phone p2 = p1;         // p2 receives the reference stored in p1
p2.brand = "Apple";    // Modify through p2

System.out.println(p1.brand);  // Apple (changed!)
```

    ┌─────────────────┐                    ┌──────────────────────┐
    │     Stack        │                    │       Heap            │
    │                 │                    │                      │
    │  ┌───────────┐  │                    │   Phone object @0x001 │
    │  │p1 = 0x001 │──┼──────────┐         │  ┌──────────────────┐ │
    │  └───────────┘  │          └─────────┼─→│ brand = "Apple"   │ │
    │  ┌───────────┐  │          ┌─────────┼─→│ price = 0.0      │ │
    │  │p2 = 0x001 │──┼──────────┘         │  │ color = null     │ │
    │  └───────────┘  │                    │  └──────────────────┘ │
    └─────────────────┘                    └──────────────────────┘

**Conclusion**: Changing a field through p2 also affects what p1 sees, because both refer to the same object.

***

## IV. Fields vs. Local Variables

| Difference       | Field                        | Local variable             |
| -------- | --------------------------- | ---------------- |
| **Declaration location** | Inside a class, outside methods                      | Inside a method or block, or as a method parameter    |
| **Memory location** | Heap (with the object)                    | Stack (with the method)         |
| **Lifetime** | Exists from object creation until the object disappears           | Exists during a method invocation; disappears when the method ends |
| **Default value**  | Yes (integer 0, floating-point 0.0, boolean false, reference null) | None; must be assigned before use      |
| **Scope** | Throughout the class                        | Only within its enclosing {}     |

```java
public class Student {
    // Fields (inside the class, outside methods)
    String name;          // Default: null
    int age;              // Default: 0

    public void study() {
        // Local variable (inside a method)
        int hours = 8;    // Must be assigned!
        System.out.println(name + " studied for " + hours + " hours");
    }

    public void sleep() {
        // System.out.println(hours);  // Error! hours is not visible here
    }
}
```

***

## V. The this Keyword

### 1. What Is this?

`this` is a **reference to the current object**: the object on which the method was called.

### 2. Main Use: Distinguishing Variables with the Same Name

```java
public class Student {
    private String name;
    private int age;

    public void setName(String name) {
        // name = name;         // Incorrect! Assigns the local variable to itself
        this.name = name;       // Correct! this.name is the field
    }

    public void setAge(int age) {
        this.age = age;         // this.age is the field; age is the parameter
    }
}
```

### 3. Calling Constructors with this

```java
public class Student {
    private String name;
    private int age;

    // this() calls another constructor in this class (must be the first statement in JDK 17/21)
    public Student() {
        this("Default name", 0);   // Call the parameterized constructor
    }

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

### 4. Method Chaining with this

```java
public class Builder {
    private String name;
    private int age;

    // Return this to support chaining
    public Builder setName(String name) {
        this.name = name;
        return this;  // Return the current object
    }

    public Builder setAge(int age) {
        this.age = age;
        return this;
    }

    public void print() {
        System.out.println(name + ", " + age);
    }
}

// Use method chaining
new Builder()
    .setName("张三")
    .setAge(18)
    .print();  // 张三, 18
```

***

## VI. Constructors

### 1. What Is a Constructor?

A constructor is a special method **called automatically when an object is created**, to initialize the object.

### 2. Constructor Characteristics

| Characteristic   | Description                      |
| ---- | ----------------------- |
| Name  | **Must exactly match the class name**           |
| Return value  | **Has no return type** (not even void) |
| Invocation timing | Called automatically when creating an object               |
| Default provision | If no constructor is declared, a default no-argument constructor is provided    |

### 3. Constructor Examples

```java
public class Student {
    private String name;
    private int age;

    // No-argument constructor
    public Student() {
        System.out.println("No-argument constructor called");
    }

    // Parameterized constructor
    public Student(String name) {
        this.name = name;
    }

    // All-arguments constructor
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

### 4. Constructor Chaining (this Calls)

```java
public class Person {
    private String name;
    private int age;
    private String address;

    public Person() {
        this("Unknown");  // Call the one-argument constructor
    }

    public Person(String name) {
        this(name, 0);  // Call the two-argument constructor
    }

    public Person(String name, int age) {
        this(name, age, "Unknown");  // Call the three-argument constructor
    }

    public Person(String name, int age, String address) {
        // Final initialization logic
        this.name = name;
        this.age = age;
        this.address = address;
    }
}
```

### 5. Important Considerations

| Item    | Description                      |
| ------ | ----------------------- |
| Default constructor   | No constructors declared → a no-argument constructor is provided     |
| Replacement rule   | **Once a parameterized constructor is declared, no no-argument constructor is provided automatically** |
| Recommended practice   | **Write a no-argument constructor explicitly, whether or not you use it**    |
| Overloading   | Multiple constructors are allowed if their parameters differ       |
| this() | Must be the first statement in JDK 17/21; circular calls are forbidden |

> **Version note**: Starting with JDK 25, permitted statements such as argument validation may precede `this(...)` / `super(...)`. Early construction context restrictions apply: you cannot read the current instance's fields or call its instance methods before that invocation. Putting the constructor invocation first remains valid.

***

## VII. Encapsulation

### 1. What Is Encapsulation?

Encapsulation is one of the three core OOP features: **hide internal implementation details and expose public access mechanisms**.

### 2. Benefits of Encapsulation

| Benefit  | Description                 |
| --- | ------------------ |
| Safety | Prevent unrestricted external access and modification      |
| Control | Add data validation in setters |
| Flexibility | Change internal implementation without affecting external callers |

### 3. Implementing Encapsulation

**Two steps**:

1.  Declare fields `private`
2.  Provide `public` getter/setter methods

```java
public class Student {
    // 1. Make fields private
    private String name;
    private int age;

    // 2. Provide public getters (read values)
    public String getName() {
        return name;
    }

    // 3. Provide public setters (set values)
    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    // Setters can include validation
    public void setAge(int age) {
        if (age < 0 || age > 150) {
            System.out.println("Invalid age!");
            return;
        }
        this.age = age;
    }
}
```

### 4. Getters for boolean Fields

```java
public class User {
    private boolean active;

    // Use isXxx names for boolean getters
    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
```

***

## VIII. JavaBeans

### 1. What Is a JavaBean?

A JavaBean is a Java class that follows specific conventions, primarily for **encapsulating data** (an entity class).

### 2. Standard JavaBean Conventions

| Requirement   | Description                                             |
| ---- | ---------------------------------------------- |
| Fields | Declare them **private**                              |
| Constructors | Provide a **no-argument constructor** (required) and an all-arguments constructor (recommended)                       |
| Methods | Provide **getter and setter** methods                      |
| Optional   | toString(), equals(), hashCode(), and implementing Serializable |

### 3. Standard JavaBean Example

```java
import java.io.Serializable;
import java.util.Objects;

public class User implements Serializable {
    // Serialization version ID (recommended)
    private static final long serialVersionUID = 1L;

    // ========== 1. Private fields ==========
    private String username;
    private String password;
    private int age;

    // ========== 2. No-argument constructor (required) ==========
    public User() {
    }

    // ========== 3. All-arguments constructor (recommended) ==========
    public User(String username, String password, int age) {
        this.username = username;
        this.password = password;
        this.age = age;
    }

    // ========== 4. Getters and setters ==========
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    // ========== 5. toString() (recommended) ==========
    @Override
    public String toString() {
        return "User{username='" + username + "', age=" + age + "}";
    }

    // ========== 6. equals() and hashCode() (recommended) ==========
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return age == user.age &&
               Objects.equals(username, user.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username, age);
    }
}
```

### 4. Generate Code Quickly in IDEA

| Shortcut                                 | Action                 |
| ----------------------------------- | ------------------ |
| `Alt + Insert` (Win)/ `Cmd + N` (Mac) | Open the Generate menu     |
| Select `Constructor`                    | Generate constructors             |
| Select `Getter and Setter`              | Generate getters/setters   |
| Select `toString()`                     | Generate toString        |
| Select `equals() and hashCode()`        | Generate equals/hashCode |

***

## IX. Lombok

### 1. What Is Lombok?

Lombok is a Java library that uses **annotations** to generate boilerplate such as getters/setters, constructors, and toString.

| Comparison           | Traditional JavaBean | With Lombok                                    |
| ------------- | ----------- | -------------------------------------------- |
| getter/setter | Write dozens of lines manually      | A single `@Data` annotation                                |
| Constructors          | Write manually         | `@NoArgsConstructor` / `@AllArgsConstructor` |
| toString      | Override manually        | Generated by `@ToString`                             |
| Code size           | Dozens of lines         | A few lines                                           |

### 2. Add the Lombok Dependency

```xml
<!-- Maven dependency -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

**IDEA configuration**:

1.  Install the Lombok plugin: `Settings → Plugins → search for Lombok → Install`
2.  Enable annotation processing: `Settings → Build → Compiler → Annotation Processors → Enable`

### 3. Common Annotations

| Annotation                         | Purpose                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `@Getter`                  | Generate getters for all fields                                                                   |
| `@Setter`                  | Generate setters for all fields                                                                   |
| `@ToString`                | Generate toString()                                                                    |
| `@EqualsAndHashCode`       | Generate equals() and hashCode()                                                         |
| `@NoArgsConstructor`       | Generate a no-argument constructor                                                                            |
| `@AllArgsConstructor`      | Generate an all-arguments constructor                                                                            |
| `@RequiredArgsConstructor` | Generate a constructor for final and @NonNull fields                                                       |
| **`@Data`**                | **= @Getter + @Setter + @ToString + @EqualsAndHashCode + @RequiredArgsConstructor** |
| `@Value`                   | Immutable class (final class + final fields + getters only)                                                |
| `@Builder`                 | Generate builder pattern code                                                                     |
| `@Slf4j` / `@Log4j2`       | Generate a logger named log                                                                          |
| `@Accessors`               | Configure getter/setter style                                                                |

### 4. Usage Examples

#### Traditional Code vs. Lombok

```java
// ❌ Traditional JavaBean: 40+ lines
public class User {
    private String username;
    private String password;
    private int age;

    public User() {}
    public User(String username, String password, int age) { ... }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    @Override public String toString() { ... }
}

// ✅ With Lombok: 10 lines
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String username;
    private String password;
    private int age;
}
```

### 5. Using @Builder

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String username;
    private String password;
    @Builder.Default  // Set a default value
    private int age = 18;
}

// Create an object using a builder (method chaining)
User user = User.builder()
    .username("zhangsan")
    .password("123456")
    .age(20)
    .build();
```

### 6. Configuring @Accessors

```java
// chain = true: setters return this for chaining
@Data
@Accessors(chain = true)
public class User {
    private String username;
    private int age;
}

// Usage
User user = new User()
    .setUsername("张三")
    .setAge(18);

// fluent = true: omit get/set prefixes from getters/setters
@Data
@Accessors(fluent = true)
public class User {
    private String username;
}

// Usage
user.username("张三");   // setter
user.username();         // getter
```

### 7. @RequiredArgsConstructor (Recommended for Spring)

```java
@RestController
@RequiredArgsConstructor  // Generate a constructor for final fields
public class UserController {

    private final UserService userService;      // final field
    private final OrderService orderService;    // final field

    // Lombok generates:
    // public UserController(UserService userService, OrderService orderService) {
    //     this.userService = userService;
    //     this.orderService = orderService;
    // }
}
```

### 8. @Value (Immutable Classes)

```java
@Value  // Generate an immutable class
public class Point {
    int x;
    int y;
}

// Equivalent to:
public final class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) { ... }
    public int getX() { ... }  // No setter
    public int getY() { ... }
    // toString(), equals(), hashCode()
}
```

### 9. Recommended Combinations

```java
// Standard entity class
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    private String name;
    private int age;
}

// Recommended Spring bean style
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
}

// Immutable object
@Value
@Builder
public class Config {
    String host;
    int port;
}
```

### 10. Lombok Considerations ⚠️

| Issue             | Description                        | Solution                                      |
| -------------- | ------------------------- | ----------------------------------------- |
| @Data with inheritance      | The subclass's equals/hashCode may be incorrect | Use `@EqualsAndHashCode(callSuper = true)` |
| @Builder with a no-argument constructor | Adding only `@NoArgsConstructor` may leave the builder without its required all-arguments constructor | For an ordinary mutable class, combine `@NoArgsConstructor` + `@AllArgsConstructor`, or put `@Builder` on an explicit constructor |
| @ToString circular references | Bidirectional associations may cause StackOverflow    | Use `@ToString(exclude = "field")`         |
| IDE does not recognize generated code        | Compilation succeeds, but the IDE shows errors              | Install the Lombok plugin                              |

```java
// Correct usage with inheritance
@Data
@EqualsAndHashCode(callSuper = true)  // Call the superclass's equals/hashCode
@ToString(callSuper = true)            // Include the superclass's toString
public class Dog extends Animal {
    private String breed;
}

// Exclude fields
@Data
@ToString(exclude = {"password"})      // Omit password
@EqualsAndHashCode(exclude = {"id"})   // Do not compare id
public class User {
    private Long id;
    private String username;
    private String password;
}
```

***

## X. The static Keyword

### 1. Meaning of static

`static` marks a member as **belonging to the class** rather than to an individual object.

### 2. Static Variables vs. Instance Variables

```java
public class Student {
    String name;              // Instance variable: each object has its own
    static String school;     // Static variable: shared by all objects
}
```

| Difference   | Static variable (class variable)    | Instance variable (object variable) |
| ---- | ------------ | ---------- |
| Ownership   | Belongs to the class          | Belongs to an object       |
| Memory location | Method area/Metaspace      | Heap        |
| Creation timing | When the class is loaded         | When an object is created      |
| Access syntax | `ClassName.fieldName` (recommended) | `objectName.fieldName`  |
| Sharing  | One copy shared by all objects     | A separate copy for each object   |

### 3. Static Variables in Memory

```java
Student.school = "Tsinghua University";
Student s1 = new Student();
s1.name = "张三";
Student s2 = new Student();
s2.name = "李四";
```

    ┌───────────────────────┐
    │ Method area/Metaspace   │
    │  ┌─────────────────┐  │
    │  │ Student.class   │  │
    │  │ school = "Tsinghua" │←┼──── Shared by all objects
    │  └─────────────────┘  │
    └───────────────────────┘

    ┌─────────────────┐        ┌─────────────────────────────────┐
    │     Stack        │        │           Heap                    │
    │  ┌───────────┐  │        │  ┌───────────┐  ┌───────────┐  │
    │  │s1 = 0x001 │──┼────────┼─→│name="张三" │  │name="李四" │←─┼── s2
    │  └───────────┘  │        │  └───────────┘  └───────────┘  │
    │  ┌───────────┐  │        │      @0x001         @0x002     │
    │  │s2 = 0x002 │──┼────────┼─────────────────────┘          │
    │  └───────────┘  │        └─────────────────────────────────┘
    └─────────────────┘

### 4. Using Static Variables

```java
// Recommended: access through the class name
Student.school = "Tsinghua University";

// Not recommended: access through an object
Student s = new Student();
s.school = "Tsinghua University";   // Works, but is not recommended
```

### 5. Static Methods

```java
public class MathUtils {
    // Static method
    public static int add(int a, int b) {
        return a + b;
    }

    public static int max(int a, int b) {
        return a > b ? a : b;
    }
}

// Call: ClassName.methodName()
int sum = MathUtils.add(10, 20);
int max = MathUtils.max(5, 8);
```

### 6. Access Rules for Static Methods

| Inside a static method   | Accessible?  | Reason                   |
| -------- | ----- | -------------------- |
| Static variable     | ✅ Yes  | Both belong to the class                 |
| Static method     | ✅ Yes  | Both belong to the class                 |
| Instance variable     | ❌ No | An instance variable requires an object to exist          |
| Instance method     | ❌ No | An instance method requires an object to be called         |
| this keyword | ❌ No | this represents an object; a static method may have none |

```java
public class Demo {
    int num = 10;              // Instance variable
    static int count = 0;      // Static variable

    // Static method
    public static void staticMethod() {
        System.out.println(count);     // ✅ Can access a static variable
        // System.out.println(num);    // ❌ Cannot access an instance variable
        // System.out.println(this);   // ❌ Cannot use this
    }

    // Instance method
    public void instanceMethod() {
        System.out.println(num);       // ✅ Can access an instance variable
        System.out.println(count);     // ✅ Can also access a static variable
    }
}
```

### 7. Static Initializer Blocks

```java
public class Demo {
    static int count;

    // Static initializer: runs once when the class is loaded
    static {
        System.out.println("Static initializer runs");
        count = 100;  // Initialize a static variable
    }

    public static void main(String[] args) {
        System.out.println("main method runs");
        System.out.println(Demo.count);  // 100
    }
}

// Output:
// Static initializer runs
// main method runs
// 100
```

**Use case**:

```java
public class JDBCUtils {
    private static Connection conn;

    // Static initializer: load a database driver (only needs to run once)
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(url, user, password);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 8. Static Imports

```java
// Ordinary import
import java.lang.Math;
double result = Math.sqrt(16);
double pi = Math.PI;

// Static import: import static members directly
import static java.lang.Math.sqrt;
import static java.lang.Math.PI;
import static java.lang.Math.*;  // Import all static members

double result = sqrt(16);  // Use directly without the class name
double pi = PI;
```

### 9. Designing a Utility Class

```java
public class ArrayUtils {
    // 1. Private constructor prevents instantiation
    private ArrayUtils() {
    }

    // 2. All methods are static
    public static int getMax(int[] arr) {
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) max = arr[i];
        }
        return max;
    }

    public static int getMin(int[] arr) {
        int min = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] < min) min = arr[i];
        }
        return min;
    }

    // 3. May define static constants
    public static final int DEFAULT_CAPACITY = 10;
}

// Usage
int max = ArrayUtils.getMax(arr);
int capacity = ArrayUtils.DEFAULT_CAPACITY;
```

***

## XI. Access Modifiers

### 1. Four Access Levels

| Modifier         | Same class | Same package | Subclass in another package | Unrelated class in another package |
| ----------- | :--: | :--: | :---: | :----: |
| `private`   |   ✅  |   ❌  |   ❌   |    ❌   |
| `(default)`      |   ✅  |   ✅  |   ❌   |    ❌   |
| `protected` |   ✅  |   ✅  |   ✅   |    ❌   |
| `public`    |   ✅  |   ✅  |   ✅   |    ✅   |

**Memory aid**: Access from narrowest to broadest: `private < default < protected < public`

### 2. Access Scope Diagram

    ┌─────────────────────────────────────────────────────────────┐
    │                        public                                │
    │  ┌───────────────────────────────────────────────────────┐  │
    │  │                    protected                           │  │
    │  │  ┌─────────────────────────────────────────────────┐  │  │
    │  │  │                  Default (package access)       │  │  │
    │  │  │  ┌───────────────────────────────────────────┐  │  │  │
    │  │  │  │               private                      │  │  │  │
    │  │  │  │           (this class only)                 │  │  │  │
    │  │  │  └───────────────────────────────────────────┘  │  │  │
    │  │  │              (same package)                      │  │  │
    │  │  └─────────────────────────────────────────────────┘  │  │
    │  │            (same package + subclasses in other packages) │  │
    │  └───────────────────────────────────────────────────────┘  │
    │                    (accessible everywhere)                  │
    └─────────────────────────────────────────────────────────────┘

### 3. Usage Recommendations

| Scenario       | Recommended access                          |
| -------- | ----------------------------- |
| Fields     | **private** (with getters/setters) |
| Methods     | As needed; usually **public**           |
| Constructors     | Usually **public**                |
| Utility class constructor  | **private** (prevents instantiation)           |
| Methods intended only for subclasses | **protected**                 |
| Singleton constructor | **private**                   |

### 4. Where Modifiers Apply

| Modifier         |  Class  | Field | Method | Constructor | Local variable |
| ----------- | :-: | :--: | :--: | :--: | :--: |
| `public`    |  ✅  |   ✅  |   ✅  |   ✅  |   ❌  |
| `protected` |  ❌  |   ✅  |   ✅  |   ✅  |   ❌  |
| `(default)`      |  ✅  |   ✅  |   ✅  |   ✅  |   ❌  |
| `private`   |  ❌  |   ✅  |   ✅  |   ✅  |   ❌  |

**Note**: A top-level class can be `public` or have default access; it cannot be `private` or `protected`.

***

## XII. Summary Mind Map

    Object-Oriented Programming
        │
        ├── Classes and objects
        │     ├── Class = template (fields + methods)
        │     ├── Object = instance created with new
        │     ├── Memory: references on the stack, objects on the heap
        │     ├── null reference → NullPointerException
        │     └── == compares references; equals compares contents
        │
        ├── Variable differences
        │     ├── Fields: inside class, outside methods; default values; heap
        │     └── Local variables: inside methods; no default value; stack
        │
        ├── this keyword
        │     ├── Refers to the current object; resolves same-name variables
        │     ├── this() calls a constructor in this class (first statement in JDK 17/21; restricted preceding statements allowed from 25)
        │     └── return this enables chaining
        │
        ├── Constructors
        │     ├── Name = class name; no return type
        │     ├── Called automatically on object creation
        │     ├── Constructor chaining: constructors call each other with this()
        │     └── Recommendation: provide both no-argument and all-arguments constructors
        │
        ├── Encapsulation
        │     ├── private fields
        │     ├── public getters/setters
        │     └── isXxx() for boolean fields
        │
        ├── JavaBean
        │     ├── Standard entity class = private fields + constructors + getters/setters
        │     └── Optional: toString, equals, Serializable
        │
        ├── Lombok
        │     ├── @Data = getter/setter/toString/equals/hashCode
        │     ├── @NoArgsConstructor = no-argument constructor
        │     ├── @AllArgsConstructor = all-arguments constructor
        │     ├── @RequiredArgsConstructor = constructor for final fields (recommended for Spring)
        │     ├── @Builder = builder pattern
        │     ├── @Value = immutable class
        │     ├── @Accessors(chain=true) = method chaining
        │     └── Note: use callSuper=true with inheritance
        │
        ├── static keyword
        │     ├── Static members belong to the class and are shared by all objects
        │     ├── Access through the class name
        │     ├── Static methods cannot access non-static members
        │     ├── Static initializer: runs once when the class loads
        │     └── Static import: import static
        │
        └── Access modifiers
              ├── private: this class
              ├── default: this class + same package
              ├── protected: this class + same package + subclasses
              └── public: anywhere
