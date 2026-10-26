## I. Enums

### 1. What Is an Enum?

An enum is a special class representing **a fixed set of constants**.

```java
// Without an enum: use constants
public class Season {
    public static final int SPRING = 1;
    public static final int SUMMER = 2;
    public static final int AUTUMN = 3;
    public static final int WINTER = 4;
}
// Problem: not type-safe; any int value can be passed

// With an enum: type-safe
public enum Season {
    SPRING, SUMMER, AUTUMN, WINTER
}
```

***

### 2. Defining an Enum

#### Basic Definition

```java
public enum Season {
    SPRING, SUMMER, AUTUMN, WINTER
}

// Usage
Season s = Season.SPRING;
System.out.println(s);  // SPRING
```

#### Enum with Fields and Methods

```java
public enum Season {
    // Enum constants (must come first)
    SPRING("Spring", "Warm"),
    SUMMER("Summer", "Hot"),
    AUTUMN("Autumn", "Cool"),
    WINTER("Winter", "Cold");

    // Fields
    private String name;
    private String desc;

    // Constructor (private by default; cannot be public)
    Season(String name, String desc) {
        this.name = name;
        this.desc = desc;
    }

    // Getters
    public String getName() {
        return name;
    }

    public String getDesc() {
        return desc;
    }
}

// Usage
Season s = Season.SPRING;
System.out.println(s.getName());  // Spring
System.out.println(s.getDesc());  // Warm
```

***

### 3. Common Enum Methods

| Method | Description |
| ---------------------- | ----------------------- |
| `values()` | Returns an array of all enum constants |
| `valueOf(String name)` | Gets a constant by name |
| `name()` | Gets the constant's name |
| `ordinal()` | Gets its zero-based ordinal |
| `compareTo(E o)` | Compares constants by ordinal |

```java
public class Demo {
    public static void main(String[] args) {
        // Get all enum constants
        Season[] seasons = Season.values();
        for (Season s : seasons) {
            System.out.println(s.name() + " - " + s.ordinal());
        }
        // SPRING - 0
        // SUMMER - 1
        // AUTUMN - 2
        // WINTER - 3

        // Get a constant by name
        Season spring = Season.valueOf("SPRING");
        System.out.println(spring);  // SPRING

        // Compare enum ordering
        Season s1 = Season.SPRING;
        Season s2 = Season.WINTER;
        System.out.println(s1.compareTo(s2));  // -3 (SPRING precedes WINTER)
        System.out.println(s2.compareTo(s1));  // 3 (WINTER follows SPRING)
    }
}
```

***

### 4. Enums in switch

```java
public class Demo {
    public static void main(String[] args) {
        Season season = Season.SUMMER;

        switch (season) {
            case SPRING:
                System.out.println("Spring warmth and blossoming flowers");
                break;
            case SUMMER:
                System.out.println("Scorching summer days");
                break;
            case AUTUMN:
                System.out.println("Crisp autumn weather");
                break;
            case WINTER:
                System.out.println("Winter blanketed in snow");
                break;
        }
    }
}
```

***

### 5. Enums Implementing Interfaces

#### Approach 1: Each Constant Implements Separately

```java
public interface Describable {
    String getDescription();
}

public enum Season implements Describable {
    SPRING {
        @Override
        public String getDescription() {
            return "Nature awakens";
        }
    },
    SUMMER {
        @Override
        public String getDescription() {
            return "The blazing sun shines overhead";
        }
    },
    AUTUMN {
        @Override
        public String getDescription() {
            return "An abundant harvest";
        }
    },
    WINTER {
        @Override
        public String getDescription() {
            return "A blanket of snow";
        }
    }
}
```

#### Approach 2: One Implementation for the Enum Class

```java
public enum Season implements Describable {
    SPRING("Nature awakens"),
    SUMMER("The blazing sun shines overhead"),
    AUTUMN("An abundant harvest"),
    WINTER("A blanket of snow");

    private String description;

    Season(String description) {
        this.description = description;
    }

    @Override
    public String getDescription() {
        return description;
    }
}
```

> 💡 **Choosing an Approach**:
>
> *   Approach 1 suits constants with substantially different implementation logic.
> *   Approach 2 suits similar logic with different data and is more concise.

***

### 6. What an Enum Really Is

```java
// An enum is a class extending java.lang.Enum
public enum Season {
    SPRING, SUMMER, AUTUMN, WINTER
}

// After compilation, it is equivalent to
public final class Season extends Enum<Season> {
    public static final Season SPRING = new Season("SPRING", 0);
    public static final Season SUMMER = new Season("SUMMER", 1);
    public static final Season AUTUMN = new Season("AUTUMN", 2);
    public static final Season WINTER = new Season("WINTER", 3);

    private Season(String name, int ordinal) {
        super(name, ordinal);
    }
}
```

***

### 7. Advanced Enum Usage

#### EnumSet: An Efficient Set for Enums

```java
import java.util.EnumSet;

public class Demo {
    public static void main(String[] args) {
        // Create an EnumSet containing specified elements
        EnumSet<Season> warmSeasons = EnumSet.of(Season.SPRING, Season.SUMMER);

        // Create an EnumSet containing every constant
        EnumSet<Season> allSeasons = EnumSet.allOf(Season.class);

        // Create an empty EnumSet
        EnumSet<Season> noSeasons = EnumSet.noneOf(Season.class);

        // Create the complement
        EnumSet<Season> coldSeasons = EnumSet.complementOf(warmSeasons);
        // coldSeasons contains AUTUMN and WINTER

        // Create a range (based on ordinal)
        EnumSet<Season> range = EnumSet.range(Season.SPRING, Season.AUTUMN);
        // range contains SPRING, SUMMER and AUTUMN

        // Iterate
        for (Season s : warmSeasons) {
            System.out.println(s);
        }
    }
}
```

#### EnumMap: An Efficient Map with Enum Keys

```java
import java.util.EnumMap;

public class Demo {
    public static void main(String[] args) {
        EnumMap<Season, String> activities = new EnumMap<>(Season.class);

        activities.put(Season.SPRING, "Spring outing");
        activities.put(Season.SUMMER, "Swimming");
        activities.put(Season.AUTUMN, "Hiking");
        activities.put(Season.WINTER, "Skiing");

        // Retrieve
        System.out.println(activities.get(Season.SUMMER));  // Swimming

        // Iterate
        activities.forEach((season, activity) -> {
            System.out.println(season + ": " + activity);
        });
    }
}
```

#### Enum Singleton Pattern (Best Practice)

```java
// Enum singleton: thread-safe; protected against reflective construction and serialization creating additional instances
public enum Singleton {
    INSTANCE;

    // Can have fields
    private int count = 0;

    // Can have methods
    public void doSomething() {
        count++;
        System.out.println("Performing operation; current count: " + count);
    }

    public int getCount() {
        return count;
    }
}

// Usage
Singleton.INSTANCE.doSomething();
```

> 💡 **Why Is an Enum Singleton a Best Practice?**
>
> 1.  **Thread safety**: the JVM guarantees thread-safe enum instance creation.
> 2.  **Protection against reflection**: reflection cannot create enum instances.
> 3.  **Serialization safety**: enum serialization guarantees that no new instance is created.

***

## II. Class Loaders

### 1. Class Loading Process

    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │   Loading   │────→│   Linking   │────→│ Initialization │
    │  (Loading)  │     │  (Linking)  │     │(Initialization)│
    └─────────────┘     └──────┬──────┘     └─────────────┘
                               │
                  ┌────────────┼────────────┐
                  │            │            │
            ┌─────┴─────┐ ┌────┴────┐ ┌─────┴─────┐
            │Verification│ │Preparation│ │Resolution│
            │(Verification)│ │(Preparation)│ │(Resolution)│
            └───────────┘ └─────────┘ └───────────┘

| Stage | Description |
| ------- | ------------------------ |
| **Loading** | Reads the .class file and creates a Class object |
| **Verification** | Checks that bytecode conforms to the specification |
| **Preparation** | Allocates memory for static variables and assigns default values |
| **Resolution** | Converts symbolic references into direct references |
| **Initialization** | Executes static initializer blocks and assigns static variable values |

***

### 2. Three Class Loaders

#### JDK 8 and Earlier

    ┌─────────────────────────────────────────────────────┐
    │           Bootstrap ClassLoader                       │
    │           Loads rt.jar and resources.jar (jre/lib)    │
    │           Implemented in C++; represented as null in Java │
    └───────────────────────┬─────────────────────────────┘
                            │ Parent loader
    ┌───────────────────────┴─────────────────────────────┐
    │           Extension ClassLoader                       │
    │           Loads classes from jre/lib/ext              │
    └───────────────────────┬─────────────────────────────┘
                            │ Parent loader
    ┌───────────────────────┴─────────────────────────────┐
    │           Application ClassLoader                     │
    │           Loads classpath classes (our own classes)   │
    └─────────────────────────────────────────────────────┘

#### JDK 9 and Later (Module System)

    ┌─────────────────────────────────────────────────────┐
    │           Bootstrap ClassLoader                       │
    │           Loads core modules (java.base, etc.)        │
    │           Implemented in C++; represented as null in Java │
    └───────────────────────┬─────────────────────────────┘
                            │ Parent loader
    ┌───────────────────────┴─────────────────────────────┐
    │           Platform ClassLoader                        │
    │           Loads platform modules (java.sql, java.xml, etc.) │
    │           ⚠️ Replaces Extension ClassLoader            │
    └───────────────────────┬─────────────────────────────┘
                            │ Parent loader
    ┌───────────────────────┴─────────────────────────────┐
    │           Application ClassLoader                     │
    │           Loads classpath classes and application modules │
    └─────────────────────────────────────────────────────┘

***

### 3. JDK 8 vs JDK 9+ Class Loaders

| JDK 8 and earlier | JDK 9 and later | Change |
| ------------------------- | ------------------------ | -------------------- |
| Bootstrap ClassLoader | Bootstrap ClassLoader | Loads core modules instead of rt.jar |
| **Extension ClassLoader** | **Platform ClassLoader** | **Both name and responsibilities changed** |
| Application ClassLoader | Application ClassLoader | Largely unchanged |

#### Main Changes

| Change | Description |
| ------------------------ | --------------------------------- |
| **rt.jar removed** | Core libraries split into modules (java.base, java.sql, etc.) |
| **jre/lib/ext removed** | Extension mechanism removed |
| **Extension → Platform** | Concept changed from extensions to platform classes |
| **Modularity** | module-info.java defines explicit dependencies between modules |

***

### 4. Verification in Code

```java
public class ClassLoaderDemo {
    public static void main(String[] args) {
        // Get the application class loader
        ClassLoader appLoader = ClassLoaderDemo.class.getClassLoader();
        System.out.println("App ClassLoader: " + appLoader);

        // Get the platform loader (JDK 9+) / extension loader (JDK 8)
        ClassLoader platformLoader = appLoader.getParent();
        System.out.println("Platform/Ext ClassLoader: " + platformLoader);

        // Get the bootstrap loader
        ClassLoader bootstrapLoader = platformLoader.getParent();
        System.out.println("Bootstrap ClassLoader: " + bootstrapLoader);

        // String is loaded by the bootstrap loader
        System.out.println("String's ClassLoader: " + String.class.getClassLoader());
    }
}
```

**JDK 8 Output**:

    App ClassLoader: sun.misc.Launcher$AppClassLoader@...
    Platform/Ext ClassLoader: sun.misc.Launcher$ExtClassLoader@...
    Bootstrap ClassLoader: null
    String's ClassLoader: null

**JDK 9+ Output**:

    App ClassLoader: jdk.internal.loader.ClassLoaders$AppClassLoader@...
    Platform/Ext ClassLoader: jdk.internal.loader.ClassLoaders$PlatformClassLoader@...
    Bootstrap ClassLoader: null
    String's ClassLoader: null

***

### 5. Parent Delegation

                            Start
                              |
                              ↓
        ┌─────────────────────────────────────────────┐
        │             AppClassLoader                   │
        │ Already loaded? → Yes → reuse; do not reload        │
        │                 ↓ No                               │
        │            Delegate to parent                      │
        └─────────────────────────────────────────────┘
                              |
                              ↓
        ┌─────────────────────────────────────────────┐
        │       Platform/Extension ClassLoader         │
        │ Already loaded? → Yes → reuse; do not reload        │
        │                 ↓ No                               │
        │            Delegate to parent                      │
        └─────────────────────────────────────────────┘
                              |
                              ↓
        ┌─────────────────────────────────────────────┐
        │          Bootstrap ClassLoader               │
        │ Already loaded? → Yes → reuse; do not reload        │
        │                 ↓ No                               │
        │ Can load? → Yes → load this class and return        │
        │                 ↓ No                               │
        └─────────────────────────────────────────────┘
                              |
                              ↓
        ┌─────────────────────────────────────────────┐
        │       Platform/Extension ClassLoader         │
        │ Can load? → Yes → load this class and return        │
        │                 ↓ No                               │
        └─────────────────────────────────────────────┘
                              |
                              ↓
        ┌─────────────────────────────────────────────┐
        │             AppClassLoader                   │
        │ Can load? → Yes → load this class and return        │
        │                 ↓ No                               │
        │         ClassNotFoundException               │
        └─────────────────────────────────────────────┘

**Parent Delegation** (applies to both JDK 8 and JDK 9+):

1.  Upward delegation: App → Platform → Bootstrap (check whether already loaded).
2.  Downward loading: Bootstrap → Platform → App (attempt loading).
3.  If none can load it, throw ClassNotFoundException.

**Benefits**:

*   Avoids duplicate class loading.
*   Protects core classes (prevents replacing java.lang.String with a custom class).

***

### 6. Departing from Parent Delegation

Some scenarios require departing from parent delegation:

| Scenario | Description |
| ----------- | ------------------------------------ |
| **SPI** | JDBC, JNDI, etc.: core classes need third-party implementations (parent-loaded code uses a child loader) |
| **Tomcat** | A separate loader per web application provides isolation |
| **OSGi** | Modular hot deployment; separate loader per module |
| **Hot deployment/updates** | Custom class loaders support hot code replacement |

#### SPI Example: JDBC

```java
// DriverManager is in rt.jar and loaded by Bootstrap ClassLoader
// But concrete database drivers (such as MySQL Driver) are on the classpath and loaded by App ClassLoader
// This departs from parent delegation: a parent-loaded class must call a child-loaded class

// Solution: Thread Context ClassLoader
ClassLoader cl = Thread.currentThread().getContextClassLoader();
// Application ClassLoader by default
```

#### Custom Class Loader

```java
public class MyClassLoader extends ClassLoader {

    private String classPath;

    public MyClassLoader(String classPath) {
        this.classPath = classPath;
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        try {
            // Read the class file
            byte[] data = loadClassData(name);
            // Convert the byte array into a Class object
            return defineClass(name, data, 0, data.length);
        } catch (Exception e) {
            throw new ClassNotFoundException(name, e);
        }
    }

    private byte[] loadClassData(String name) throws Exception {
        String fileName = classPath + "/" + name.replace(".", "/") + ".class";
        FileInputStream fis = new FileInputStream(fileName);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        int len;
        byte[] buffer = new byte[1024];
        while ((len = fis.read(buffer)) != -1) {
            baos.write(buffer, 0, len);
        }
        fis.close();
        return baos.toByteArray();
    }
}

// Usage
MyClassLoader loader = new MyClassLoader("/path/to/classes");
Class<?> clazz = loader.loadClass("com.example.MyClass");
Object obj = clazz.getDeclaredConstructor().newInstance();
```

***

## III. Reflection

### 1. What Is Reflection?

Reflection dynamically obtains class information, creates objects and invokes methods **at runtime**.

    Compile time                      Runtime
    ┌──────────────┐                ┌──────────────┐
    │  .java file  │ → compile →   │  .class file │
    │ Source code │                │  Bytecode   │
    └──────────────┘                └───────┬──────┘
                                            │
                                            ↓ Reflection
                                    ┌──────────────┐
                                    │  Class object  │
                                    │ Inspect class  │
                                    │ Create objects │
                                    │ Invoke methods │
                                    └──────────────┘

***

### 2. Three Ways to Obtain a Class Object

```java
// Approach 1: ClassName.class
Class<Student> clazz1 = Student.class;

// Approach 2: object.getClass()
Student stu = new Student();
Class<? extends Student> clazz2 = stu.getClass();

// Approach 3: Class.forName("fully.qualified.ClassName") ← most commonly used
Class<?> clazz3 = Class.forName("com.example.Student");

// All three obtain the same Class object
System.out.println(clazz1 == clazz2);  // true
System.out.println(clazz2 == clazz3);  // true
```

***

### 3. Obtaining Constructors Through Reflection

```java
public class Student {
    private String name;
    private int age;

    public Student() {}

    public Student(String name) {
        this.name = name;
    }

    private Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

```java
Class<?> clazz = Class.forName("com.example.Student");

// Get all public constructors
Constructor<?>[] constructors = clazz.getConstructors();

// Get all constructors, including private ones
Constructor<?>[] allConstructors = clazz.getDeclaredConstructors();

// Get a specified constructor
Constructor<?> con1 = clazz.getConstructor();  // No arguments
Constructor<?> con2 = clazz.getConstructor(String.class);  // One argument
Constructor<?> con3 = clazz.getDeclaredConstructor(String.class, int.class);  // private

// Create an object using the constructor
Object obj1 = con1.newInstance();
Object obj2 = con2.newInstance("张三");

// Access a private constructor
con3.setAccessible(true);  // Override access checks
Object obj3 = con3.newInstance("李四", 20);
```

***

### 4. Obtaining Fields Through Reflection

```java
Class<?> clazz = Class.forName("com.example.Student");

// Get all public fields
Field[] fields = clazz.getFields();

// Get all declared fields, including private ones
Field[] allFields = clazz.getDeclaredFields();

// Get a specified field
Field nameField = clazz.getDeclaredField("name");

// Set/get field values
Object obj = clazz.getDeclaredConstructor().newInstance();
nameField.setAccessible(true);  // Override access checks
nameField.set(obj, "张三");     // Set value
Object value = nameField.get(obj);  // Get value
System.out.println(value);  // 张三
```

***

### 5. Obtaining Methods Through Reflection

```java
public class Student {
    public void study() {
        System.out.println("Studying...");
    }

    public String sayHello(String name) {
        return "Hello, " + name;
    }

    private void secret() {
        System.out.println("Private method");
    }
}
```

```java
Class<?> clazz = Class.forName("com.example.Student");

// Get all public methods, including inherited ones
Method[] methods = clazz.getMethods();

// Get all methods declared by this class, including private ones
Method[] allMethods = clazz.getDeclaredMethods();

// Get a specified method
Method studyMethod = clazz.getMethod("study");
Method sayHelloMethod = clazz.getMethod("sayHello", String.class);
Method secretMethod = clazz.getDeclaredMethod("secret");

// Invoke the method
Object obj = clazz.getDeclaredConstructor().newInstance();
studyMethod.invoke(obj);  // Studying...
Object result = sayHelloMethod.invoke(obj, "World");  // Hello, World

// Invoke a private method
secretMethod.setAccessible(true);
secretMethod.invoke(obj);  // Private method
```

***

### 6. Reflection Use Cases

| Scenario | Description |
| ---------- | ------------------------ |
| **Framework development** | Frameworks such as Spring and MyBatis use reflection extensively |
| **Configuration loading** | Dynamically creates objects based on configuration |
| **Annotation processing** | Reads annotation information at runtime |
| **Unit testing** | Tests private methods |
| **Dynamic proxies** | Creates proxy objects |

```java
// Example: create an object based on configuration
// config.properties
// className=com.example.Student

Properties props = new Properties();
props.load(new FileInputStream("config.properties"));
String className = props.getProperty("className");

Class<?> clazz = Class.forName(className);
Object obj = clazz.getDeclaredConstructor().newInstance();
```

***

### 7. Reflection Performance Optimization

Reflection adds overhead compared with direct calls. Optimization options include:

| Optimization | Description |
| ------------------- | ------------------------------- |
| **Cache reflection objects** | Cache Class, Method and Field objects to avoid repeated lookups |
| **Use MethodHandle** | Available since Java 7+; performance approaches direct calls |
| **Disable access checks** | setAccessible(true) can improve performance |
| **Consider code generation** | Use a bytecode-generation library for frequent calls |

#### Caching Reflection Objects

```java
// ❌ Not recommended: look up Method every time
public void badExample(Object obj) throws Exception {
    Method method = obj.getClass().getMethod("doSomething");
    method.invoke(obj);
}

// ✅ Recommended: cache the Method object
private static final Map<Class<?>, Method> METHOD_CACHE = new ConcurrentHashMap<>();

public void goodExample(Object obj) throws Exception {
    Method method = METHOD_CACHE.computeIfAbsent(obj.getClass(), clazz -> {
        try {
            Method m = clazz.getMethod("doSomething");
            m.setAccessible(true);  // Disable access checks to improve performance
            return m;
        } catch (NoSuchMethodException e) {
            throw new RuntimeException(e);
        }
    });
    method.invoke(obj);
}
```

#### MethodHandle Example (Java 7+)

```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;

public class MethodHandleDemo {
    public static void main(String[] args) throws Throwable {
        // Get MethodHandles.Lookup
        MethodHandles.Lookup lookup = MethodHandles.lookup();

        // Get a handle for String.substring(int, int)
        MethodHandle substringHandle = lookup.findVirtual(
            String.class,                              // Target class
            "substring",                               // Method name
            MethodType.methodType(String.class, int.class, int.class)  // Return type, parameter types
        );

        // Invoke the method
        String result = (String) substringHandle.invoke("Hello World", 0, 5);
        System.out.println(result);  // Hello

        // Static method example: Integer.parseInt(String)
        MethodHandle parseIntHandle = lookup.findStatic(
            Integer.class,
            "parseInt",
            MethodType.methodType(int.class, String.class)
        );

        int num = (int) parseIntHandle.invoke("123");
        System.out.println(num);  // 123
    }
}
```

> 💡 **MethodHandle vs Reflection**:
>
> *   After the initial lookup, MethodHandle invocation performance approaches direct calls.
> *   Reflection performs access checks on each call.
> *   MethodHandle supports JVM-level optimization, including method inlining.

***

### 8. How Modules Affect Reflection (Java 9+)

Java 9's module system affects reflection as follows:

| Effect | Description |
| --------------- | ----------------------------------- |
| **Nonpublic members inaccessible by default** | Nonpublic types in modules are not reflectively accessible by default |
| **Explicit opening required** | Use opens in module-info.java to open a package |
| **Illegal reflective access warnings** | Illegal reflective access produces warnings (later versions may reject it) |

```java
// module-info.java
module my.module {
    // Open the package to all modules (allow reflection)
    opens com.example.entity;

    // Open the package to specified modules
    opens com.example.internal to spring.core;

    // Export a package (ordinary access only; no reflection into private members)
    exports com.example.api;
}
```

***

## IV. Annotations

### 1. What Is an Annotation?

An annotation is **metadata** that adds information to code for the compiler or runtime to read.

```java
@Override           // Compile-time check that the method correctly overrides another
public String toString() {
    return "Student";
}

@Deprecated         // Mark as deprecated
public void oldMethod() {}

@SuppressWarnings("unchecked")  // Suppress warnings
public void test() {}
```

***

### 2. Custom Annotations

```java
// Define an annotation
public @interface MyAnnotation {
    // Annotation attributes (abstract methods)
    String value() default "";
    int age() default 0;
    String[] tags() default {};
}

// Use the annotation
@MyAnnotation(value = "张三", age = 18, tags = {"Student", "Programmer"})
public class Student {
}

// When only value is specified, value= can be omitted
@MyAnnotation("张三")
public class Teacher {
}
```

***

### 3. Meta-Annotations

Meta-annotations are **annotations applied to other annotations**.

| Meta-annotation | Description |
| ------------- | ------------------------- |
| `@Target` | Specifies where an annotation may appear (class, method, field, etc.) |
| `@Retention` | Specifies retention (source, class file, runtime) |
| `@Documented` | Includes the annotation in Javadoc |
| `@Inherited` | Allows class annotations to be inherited by subclasses |
| `@Repeatable` | Allows repeated use (Java 8+) |

#### @Target: Annotation Locations

```java
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
public @interface MyAnnotation {
}
```

| ElementType | Description |
| ---------------- | ---------------- |
| `TYPE` | Class, interface, enum |
| `FIELD` | Field |
| `METHOD` | Method |
| `PARAMETER` | Method parameter |
| `CONSTRUCTOR` | Constructor |
| `LOCAL_VARIABLE` | Local variable |
| `TYPE_PARAMETER` | Type parameter (Java 8+) |
| `TYPE_USE` | Any type-use location (Java 8+) |

#### @Retention: Retention Policy

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation {
}
```

| RetentionPolicy | Description |
| --------------- | ---------------------- |
| `SOURCE` | Source only; discarded after compilation |
| `CLASS` | Retained in class files, not available at runtime (default) |
| `RUNTIME` | Retained at runtime; accessible through reflection |

***

### 4. Complete Custom Annotation Example

```java
import java.lang.annotation.*;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface MyTest {
    String value() default "";
    int priority() default 0;
}
```

***

### 5. Reading Annotations Through Reflection

```java
@MyTest(value = "Student class", priority = 1)
public class Student {

    @MyTest(value = "Study method", priority = 2)
    public void study() {
        System.out.println("Studying...");
    }
}
```

```java
public class Demo {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Student.class;

        // Check whether the class has an annotation
        if (clazz.isAnnotationPresent(MyTest.class)) {
            // Get the class annotation
            MyTest annotation = clazz.getAnnotation(MyTest.class);
            System.out.println("Class annotation value: " + annotation.value());
            System.out.println("Class annotation priority: " + annotation.priority());
        }

        // Get method annotations
        Method method = clazz.getMethod("study");
        if (method.isAnnotationPresent(MyTest.class)) {
            MyTest annotation = method.getAnnotation(MyTest.class);
            System.out.println("Method annotation value: " + annotation.value());
            System.out.println("Method annotation priority: " + annotation.priority());
        }
    }
}
```

***

### 6. Repeatable Annotations (Java 8+)

```java
// Define a repeatable annotation
@Repeatable(Roles.class)  // Specify the container annotation
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Role {
    String value();
}

// Container annotation
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Roles {
    Role[] value();
}

// Usage: annotate repeatedly
@Role("admin")
@Role("user")
@Role("guest")
public class User {
}

// Retrieve repeated annotations
public class Demo {
    public static void main(String[] args) {
        Class<?> clazz = User.class;

        // Approach 1: retrieve all repeated annotations
        Role[] roles = clazz.getAnnotationsByType(Role.class);
        for (Role role : roles) {
            System.out.println("Role: " + role.value());
        }

        // Approach 2: retrieve the container annotation
        Roles rolesContainer = clazz.getAnnotation(Roles.class);
        if (rolesContainer != null) {
            for (Role role : rolesContainer.value()) {
                System.out.println("Role: " + role.value());
            }
        }
    }
}
```

***

### 7. TYPE\_USE Annotations (Java 8+)

TYPE\_USE allows annotations at any type-use location:

```java
@Target(ElementType.TYPE_USE)
@Retention(RetentionPolicy.RUNTIME)
public @interface NonNull {
}

@Target(ElementType.TYPE_USE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Nullable {
}

// Usage examples
public class Demo {
    // Field type
    private @NonNull String name;

    // Generic type argument
    private List<@NonNull String> names;

    // Method return type
    public @Nullable String getName() {
        return name;
    }

    // Method parameter type
    public void setName(@NonNull String name) {
        this.name = name;
    }

    // Exception declaration
    public void process() throws @NonNull Exception {
    }

    // Cast
    public void cast(Object obj) {
        String str = (@NonNull String) obj;
    }

    // instanceof
    public boolean check(Object obj) {
        return obj instanceof @NonNull String;
    }
}
```

***

### 8. Practical Annotation Example: Simulating Unit Tests

```java
// Define a test annotation
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Test {
}

// Mark test methods with the annotation
public class Calculator {

    @Test
    public void testAdd() {
        System.out.println("Test addition: " + (1 + 1));
    }

    @Test
    public void testSub() {
        System.out.println("Test subtraction: " + (5 - 3));
    }

    public void notTest() {
        System.out.println("This is not a test method");
    }
}

// Run every method annotated with @Test
public class TestRunner {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Calculator.class;
        Object obj = clazz.getDeclaredConstructor().newInstance();

        for (Method method : clazz.getDeclaredMethods()) {
            if (method.isAnnotationPresent(Test.class)) {
                System.out.println("Running test: " + method.getName());
                method.invoke(obj);
                System.out.println("---");
            }
        }
    }
}
```

***

## V. Dynamic Proxies

### 1. What Is a Proxy?

The proxy design pattern **controls access to an original object** through a proxy object.

    ┌──────────┐         ┌──────────┐         ┌──────────┐
    │  Caller   │ ──────→ │   Proxy   │ ──────→ │  Target   │
    └──────────┘         └──────────┘         └──────────┘
                               │
                               ↓
                         Added behavior
                       (logging, authorization, transactions)

***

### 2. Static vs Dynamic Proxies

| Comparison | Static proxy | Dynamic proxy |
| ------- | ------------ | --------------- |
| **Proxy class** | Written manually | Generated automatically at runtime |
| **Flexibility** | Low; a proxy class per interface | High; one proxy can implement multiple interfaces |
| **Use** | Simple cases | Frameworks (Spring AOP) |

***

### 3. JDK Dynamic Proxies

**Requirement**: the target object must implement an interface.

#### Steps

```java
// 1. Define an interface
public interface UserService {
    void add();
    void delete();
    void update();
    void query();
}

// 2. Implementation class (target object)
public class UserServiceImpl implements UserService {
    @Override
    public void add() {
        System.out.println("Add user");
    }

    @Override
    public void delete() {
        System.out.println("Delete user");
    }

    @Override
    public void update() {
        System.out.println("Update user");
    }

    @Override
    public void query() {
        System.out.println("Query user");
    }
}
```

#### Creating a Proxy Object

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class ProxyFactory {

    // Target object
    private Object target;

    public ProxyFactory(Object target) {
        this.target = target;
    }

    // Generate a proxy object
    public Object getProxyInstance() {
        return Proxy.newProxyInstance(
            target.getClass().getClassLoader(),  // Class loader
            target.getClass().getInterfaces(),   // Interfaces implemented by the target
            new InvocationHandler() {            // Invocation handler
                @Override
                public Object invoke(Object proxy, Method method, Object[] args)
                        throws Throwable {
                    // Before advice
                    System.out.println("[Log] Starting " + method.getName());
                    long start = System.currentTimeMillis();

                    // Invoke the target method
                    Object result = method.invoke(target, args);

                    // After advice
                    long end = System.currentTimeMillis();
                    System.out.println("[Log] Finished in " + (end - start) + "ms");

                    return result;
                }
            }
        );
    }
}
```

#### Using the Proxy

```java
public class Demo {
    public static void main(String[] args) {
        // Create the target object
        UserService target = new UserServiceImpl();

        // Create the proxy object
        UserService proxy = (UserService) new ProxyFactory(target).getProxyInstance();

        // Invoke methods through the proxy
        proxy.add();
        // [Log] Starting add
        // Add user
        // [Log] Finished in 0ms

        proxy.query();
        // [Log] Starting query
        // Query user
        // [Log] Finished in 0ms
    }
}
```

***

### 4. Simplified Utility Class

```java
public class ProxyUtil {

    /**
     * Create a proxy object
     * @param target target object
     * @return proxy object
     */
    @SuppressWarnings("unchecked")
    public static <T> T createProxy(T target) {
        return (T) Proxy.newProxyInstance(
            target.getClass().getClassLoader(),
            target.getClass().getInterfaces(),
            (proxy, method, args) -> {
                // Preprocessing
                System.out.println("=== Before method execution ===");

                // Execute the target method
                Object result = method.invoke(target, args);

                // Postprocessing
                System.out.println("=== After method execution ===");

                return result;
            }
        );
    }
}

// Usage
UserService proxy = ProxyUtil.createProxy(new UserServiceImpl());
proxy.add();
```

***

### 5. JDK Dynamic Proxies vs CGLIB

| Comparison | JDK dynamic proxy | CGLIB |
| ------------- | ------------- | ---------------- |
| **Mechanism** | Interface-based; generates an interface implementation | Inheritance-based; generates a subclass of the target |
| **Requirement** | Target must implement an interface | Target class must not be final |
| **Creation performance** | Fast proxy creation | Slower creation (bytecode generation required) |
| **Invocation performance** | Slightly slower | Fast (direct method calls) |
| **Dependency** | Built into the JDK | Requires the cglib library |
| **Spring selection** | Default when interfaces exist | Automatically used without interfaces |

#### CGLIB Example (Dependency Required)

```xml
<!-- Maven dependency -->
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib</artifactId>
    <version>3.3.0</version>
</dependency>
```

```java
import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

// Target class (no interface required)
public class UserServiceImpl {
    public void add() {
        System.out.println("Add user");
    }
}

// CGLIB proxy factory
public class CglibProxyFactory {

    private Object target;

    public CglibProxyFactory(Object target) {
        this.target = target;
    }

    public Object getProxyInstance() {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(target.getClass());  // Set the superclass
        enhancer.setCallback(new MethodInterceptor() {
            @Override
            public Object intercept(Object obj, Method method, Object[] args,
                    MethodProxy proxy) throws Throwable {
                System.out.println("[CGLIB] Before method execution");
                Object result = proxy.invokeSuper(obj, args);  // Invoke the superclass method
                System.out.println("[CGLIB] After method execution");
                return result;
            }
        });
        return enhancer.create();
    }
}

// Usage
UserServiceImpl proxy = (UserServiceImpl) new CglibProxyFactory(new UserServiceImpl())
        .getProxyInstance();
proxy.add();
```

***

### 6. Dynamic Proxy Use Cases

| Scenario | Description |
| -------------- | ------------------ |
| **Logging** | Records method invocation information |
| **Performance monitoring** | Measures method execution time |
| **Authorization** | Checks user permissions |
| **Transaction management** | Starts a transaction before execution; commits/rolls back afterward |
| **Caching** | Checks the cache before execution; updates it afterward |
| **Spring AOP** | Core implementation of aspect-oriented programming |

***

### 7. Complete Example: Authorization Checks

```java
// Interface
public interface OrderService {
    void createOrder();
    void deleteOrder();
}

// Implementation
public class OrderServiceImpl implements OrderService {
    @Override
    public void createOrder() {
        System.out.println("Create order");
    }

    @Override
    public void deleteOrder() {
        System.out.println("Delete order");
    }
}

// Proxy factory with authorization checks
public class AuthProxyFactory {

    private Object target;
    private String currentUser;

    public AuthProxyFactory(Object target, String currentUser) {
        this.target = target;
        this.currentUser = currentUser;
    }

    public Object getProxy() {
        return Proxy.newProxyInstance(
            target.getClass().getClassLoader(),
            target.getClass().getInterfaces(),
            (proxy, method, args) -> {
                // Check permissions
                if ("deleteOrder".equals(method.getName())) {
                    if (!"admin".equals(currentUser)) {
                        throw new RuntimeException("Not authorized to perform this operation!");
                    }
                }

                return method.invoke(target, args);
            }
        );
    }
}

// Test
public class Demo {
    public static void main(String[] args) {
        OrderService target = new OrderServiceImpl();

        // Ordinary user
        OrderService proxy1 = (OrderService) new AuthProxyFactory(target, "user").getProxy();
        proxy1.createOrder();   // ✅ Succeeds
        // proxy1.deleteOrder(); // ❌ Throws an exception: Not authorized to perform this operation!

        // Administrator
        OrderService proxy2 = (OrderService) new AuthProxyFactory(target, "admin").getProxy();
        proxy2.createOrder();   // ✅ Succeeds
        proxy2.deleteOrder();   // ✅ Succeeds
    }
}
```

***

## VI. Summary Mind Map

    Advanced Java features
        │
        ├── Enums
        │     ├── Definition: a fixed set of constants
        │     ├── Methods: values(), valueOf(), name(), ordinal(), compareTo()
        │     ├── Can have fields, constructors and methods
        │     ├── Underlying form: a class extending java.lang.Enum
        │     └── Advanced: EnumSet, EnumMap, enum singletons
        │
        ├── Class loaders
        │     ├── Process: loading → linking → initialization
        │     ├── JDK 8：Bootstrap → Extension → Application
        │     ├── JDK 9+：Bootstrap → Platform → Application
        │     │           (Extension renamed to Platform)
        │     ├── Parent delegation: delegate first; load locally only if the parent fails
        │     └── Departures: SPI, Tomcat, OSGi, custom class loaders
        │
        ├── Reflection
        │     ├── Get Class: ClassName.class, object.getClass(), Class.forName()
        │     ├── Constructors: getConstructor(), getDeclaredConstructor()
        │     ├── Fields: getField(), getDeclaredField()
        │     ├── Methods: getMethod(), getDeclaredMethod()
        │     ├── Override access checks: setAccessible(true)
        │     ├── Performance: cache reflection objects, MethodHandle
        │     └── Modules: Java 9+ needs opens for reflective package access
        │
        ├── Annotations
        │     ├── Definition: @interface
        │     ├── Meta-annotations: @Target, @Retention, @Documented, @Inherited, @Repeatable
        │     ├── Read annotations: isAnnotationPresent(), getAnnotation()
        │     ├── Java 8+: @Repeatable (repeated annotations), TYPE_USE
        │     └── Uses: configuration, validation, test frameworks
        │
        └── Dynamic proxies
              ├── JDK dynamic proxy: Proxy.newProxyInstance()
              │     └── Requirement: target object implements an interface
              ├── CGLIB: inheritance-based; no interface required
              ├── InvocationHandler：invoke(proxy, method, args)
              └── Uses: logging, authorization, transactions, Spring AOP
