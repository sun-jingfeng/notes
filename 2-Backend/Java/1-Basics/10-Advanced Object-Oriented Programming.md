## I. Inheritance

### 1. What Is Inheritance?

Inheritance is one of the three core OOP features. It lets one class (the subclass) acquire fields and methods from another (the superclass).

**Core idea**: Extract shared features and reuse code

### 2. Inheritance Syntax

```java
public class Subclass extends Superclass {
    // Subclass-specific content
}
```

### 3. Inheritance Example

```java
// ========== Superclass ==========
public class Animal {
    String name;
    int age;

    public void eat() {
        System.out.println("The animal eats");
    }

    public void sleep() {
        System.out.println("The animal sleeps");
    }
}

// ========== Subclass ==========
public class Dog extends Animal {
    // Inherits name, age, eat(), and sleep()

    // Subclass-specific method
    public void bark() {
        System.out.println("The dog barks");
    }
}

public class Cat extends Animal {
    public void catchMouse() {
        System.out.println("The cat catches mice");
    }
}
```

### 4. Characteristics of Inheritance

| Characteristic       | Description                       |
| -------- | ------------------------ |
| **Single inheritance**  | Java supports only single class inheritance: a class has at most one direct superclass |
| **Multilevel inheritance** | An inheritance chain such as A → B → C is allowed       |
| **Common superclass** | All classes inherit directly or indirectly from Object    |

```java
class A { }
class B extends A { }
class C extends B { }  // C → B → A → Object
```

### 5. What Can a Subclass Inherit?

| Member type           | Inherited?                   |
| -------------- | ---------------------- |
| Superclass constructors         | ❌ Not inherited (but callable with super) |
| Superclass private members  | ❌ Not directly accessible (but present in the subclass object)    |
| Superclass non-private members | ✅ Can be inherited and used              |

### 6. Method Overriding

A subclass can override superclass methods:

```java
public class Dog extends Animal {
    @Override  // Override annotation; recommended
    public void eat() {
        System.out.println("The dog eats bones");  // Overrides the superclass's eat method
    }
}
```

**Overriding rules:**

| Rule        | Description                            |
| --------- | ----------------------------- |
| Method name       | Must match                          |
| Parameter list      | Must match                          |
| Return type       | The same type, or a subtype of the superclass method's return type (covariant return type)          |
| Access      | Cannot be more restrictive than in the superclass (may be broader)               |
| Exceptions        | Cannot declare additional or broader checked exceptions than the superclass method            |
| @Override | Recommended; the compiler checks it                   |
| Cannot override      | `private`, `final`, or `static` methods |

```java
// Covariant return type example
public class Animal {
    public Animal create() { return new Animal(); }
}

public class Dog extends Animal {
    @Override
    public Dog create() {  // ✅ A subtype return type is allowed
        return new Dog();
    }
}
```

### 7. Constructors in Inheritance

```java
public class Animal {
    String name;

    public Animal() {
        System.out.println("Animal no-argument constructor");
    }

    public Animal(String name) {
        this.name = name;
    }
}

public class Dog extends Animal {
    int age;

    public Dog() {
        super();  // Calls the superclass's no-argument constructor by default (may be omitted)
        System.out.println("Dog no-argument constructor");
    }

    public Dog(String name, int age) {
        super(name);  // Call a parameterized superclass constructor
        this.age = age;
    }
}
```

**Rules**:

*   If neither `this(...)` nor `super(...)` is called explicitly, the compiler inserts an implicit `super()` call
*   If the superclass has no accessible no-argument constructor, explicitly call a suitable `super(arguments)`, or delegate with `this(...)` to a constructor that eventually does so
*   A constructor cannot explicitly call both `super(...)` and `this(...)`. JDK 17/21 require the constructor invocation to be the first statement; JDK 25 allows restricted statements, such as argument validation, before it

### 8. this vs. super

| Keyword       | Access a field        | Call a method          | Call a constructor        |
| --------- | ------------- | --------------- | ------------- |
| **this**  | this.fieldName (this class)  | this.methodName() (this class)  | this() (this class's constructor)  |
| **super** | super.fieldName (superclass) | super.methodName() (superclass) | super() (superclass constructor) |

```java
public class Dog extends Animal {
    String name = "Puppy";

    public void show() {
        String name = "Local";
        System.out.println(name);        // Local
        System.out.println(this.name);   // Puppy (this class's field)
        System.out.println(super.name);  // Superclass's name field
    }
}
```

***

## II. The Object Class

### 1. Object's Role

`Object` is the **root of all Java classes**: every class inherits from Object directly or indirectly.

```java
class Person { }
// Equivalent to
class Person extends Object { }
```

### 2. Common Object Methods

| Method                    | Description            |
| --------------------- | ------------- |
| `toString()`          | Return a string representation of the object    |
| `equals(Object obj)`  | Compare two objects for equality    |
| `hashCode()`          | Return the object's hash code     |
| `getClass()`          | Return the object's runtime class     |
| `clone()`             | Create and return a copy of the object    |
| `wait()` / `notify()` | Thread waiting/notification (multithreading) |
| `finalize()`          | Called before garbage collection (deprecated)  |

### 3. The toString() Method

```java
public class Student {
    private String name;
    private int age;

    // Without overriding toString, printing an object produces: ClassName@address
    // For example: Student@1b6d3586

    // Override toString
    @Override
    public String toString() {
        return "Student{name='" + name + "', age=" + age + "}";
    }
}

// Usage
Student s = new Student("张三", 18);
System.out.println(s);  // Student{name='张三', age=18}
```

### 4. The equals() Method

```java
public class Student {
    private String name;
    private int age;

    // Without overriding equals, it compares references (the same effect as ==)

    // Override equals to compare contents
    @Override
    public boolean equals(Object o) {
        // 1. Return true if this is the same object
        if (this == o) return true;

        // 2. Return false if null or a different type
        if (o == null || getClass() != o.getClass()) return false;

        // 3. Cast and compare fields
        Student student = (Student) o;
        return age == student.age &&
               Objects.equals(name, student.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }
}
```

**Note**: When overriding `equals()`, usually also override `hashCode()`; HashMap and HashSet rely on this contract.

### 5. The clone() Method

```java
// 1. Implement Cloneable (a marker interface)
public class Person implements Cloneable {
    String name;
    int[] scores;

    // 2. Override clone
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();  // Shallow copy
    }
}
```

**Shallow vs. deep copies:**

| Type      | Description              | Reference-type fields       |
| ------- | --------------- | ------------ |
| **Shallow copy** | `super.clone()` | Copy references (point to the same objects) |
| **Deep copy** | Manually copy reference-type fields      | Create new objects        |

```java
// Deep copy implementation
@Override
protected Object clone() throws CloneNotSupportedException {
    Person copy = (Person) super.clone();
    // Manually copy reference-type fields
    copy.scores = this.scores.clone();
    return copy;
}
```

### 6. The getClass() Method

```java
Student s = new Student();
Class<?> clazz = s.getClass();

System.out.println(clazz.getName());        // com.example.Student
System.out.println(clazz.getSimpleName());  // Student
```

### 7. Generate Code Quickly in IDEA

`Alt + Insert` (Win) / `Cmd + N` (Mac) → select `toString()` or `equals() and hashCode()`

***

## III. The final Keyword

### 1. Purpose of final

`final` means **final or unchangeable** and can modify classes, methods, variables, and parameters.

### 2. final Classes

```java
// A final class cannot be subclassed
public final class Math {
    // ...
}

// Error! Cannot extend a final class
// public class MyMath extends Math { }  ❌
```

**Java final classes**: String, Math, System, wrapper classes, etc.

### 3. final Methods

```java
public class Animal {
    // A final method cannot be overridden
    public final void sleep() {
        System.out.println("The animal sleeps");
    }
}

public class Dog extends Animal {
    // Error! Cannot override a final method
    // @Override
    // public void sleep() { }  ❌
}
```

### 4. final Variables

#### 4.1 final Fields

**Rule: A final field must be initialized and can be assigned only once. There are three initialization approaches:**

**Option 1: Initialize at the declaration**

```java
public class Demo {
    // ✅ Initialize directly at declaration
    private final int MAX_VALUE = 100;
}
```

**Option 2: Initialize in a constructor (recommended)**

```java
public class UserController {
    // ✅ Not initialized at declaration
    private final UserService userService;

    // ✅ Initialize in the constructor (fully valid!)
    public UserController(UserService userService) {
        this.userService = userService;  // First assignment (initialization)
    }

    public void someMethod() {
        // ❌ Error: cannot assign again
        // this.userService = new UserService();  // Compile error!
    }
}
```

**Option 3: Initialize in an initializer block**

```java
public class Demo {
    private final int value;

    {
        // Instance initializer (runs before the constructor body)
        this.value = 100;
    }
}
```

#### 4.2 final Local Variables

```java
public void test() {
    // final local variable
    final int num = 10;
    // num = 20;  ❌ Cannot change it

    // A final local variable can be declared before it is assigned
    final int count;
    count = 5;  // ✅ First assignment
    // count = 10;  ❌ Cannot assign again
}
```

#### 4.3 final Reference Variables

```java
public void test() {
    // final reference variable
    final int[] arr = {1, 2, 3};
    // arr = new int[5];  ❌ Cannot change the reference (address)
    arr[0] = 100;  // ✅ Can change the contents

    // final object reference
    final User user = new User("张三");
    // user = new User("李四");  ❌ Cannot change the reference
    user.setName("李四");  // ✅ Can change the object's fields
}
```

**Key point**: A `final` reference variable **cannot refer to a different object**, but **the object's contents can change**.

#### 4.4 final Method Parameters

```java
public void process(final String name, final int count) {
    // name = "New value";  ❌ Cannot change a final parameter
    // count = 100;    ❌ Cannot change a final parameter

    System.out.println(name + ": " + count);
}
```

**Use case**: Prevent accidental reassignment of parameters inside a method, improving code safety

### 5. Constant Naming Conventions

```java
// Constant names are uppercase, with words separated by underscores
public static final int MAX_VALUE = 100;
public static final String DEFAULT_NAME = "Unknown";
```

**`static final` vs `final`:**

| Modifier            | Characteristics                 |
| -------------- | ------------------ |
| `final`        | Instance constant; one per object        |
| `static final` | Class constant; shared by all objects and initialized when the class loads |

### 6. Practical Application: Spring Dependency Injection (Recommended)

```java
@RestController
public class UserController {
    // ✅ final fields + constructor injection (recommended for Spring)
    private final UserService userService;
    private final OrderService orderService;

    // @Autowired can be omitted (Spring 4.3+, when there is only one constructor)
    public UserController(UserService userService, OrderService orderService) {
        this.userService = userService;
        this.orderService = orderService;
    }
}
```

**Why is this recommended?**

*   ✅ Once assigned, the dependency reference cannot point to another object (final)
*   Thread safety still depends on shared state and how it is accessed; a final reference does not automatically make its object immutable
*   ✅ Mandatory dependencies (must be supplied)
*   ✅ Easy to test

### 7. final Summary

| Applies to       | Effect              | Description                                                   |
| ---------- | --------------- | ---------------------------------------------------- |
| **Class**      | Cannot be subclassed           | `public final class Math { }`                        |
| **Method**     | Cannot be overridden           | `public final void sleep() { }`                      |
| **Primitive variable** | Value cannot change           | `final int num = 10;`                                |
| **Reference variable** | Reference cannot change (contents may change)   | `final int[] arr = {1,2,3}; arr[0] = 100; ✅`         |
| **Field**   | Must be initialized at declaration or in a constructor | `private final UserService userService;` initialized in the constructor ✅ |
| **Method parameter**   | Parameter value cannot be reassigned        | `void process(final String name) { }`                |

***

## IV. Abstract Classes

### 1. What Is an Abstract Class?

When a superclass method has **a known name but no concrete implementation**, it can be declared abstract. A class containing abstract methods must be abstract.

### 2. Defining an Abstract Class

```java
// Abstract class
public abstract class Animal {
    private String name;

    // May contain ordinary fields, constructors, and concrete methods
    public Animal(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    // Abstract method: declaration only, no body
    public abstract void eat();

    public abstract void sleep();
}
```

### 3. Using an Abstract Class

```java
// A subclass must override all abstract methods unless it is also abstract
public class Dog extends Animal {

    public Dog(String name) {
        super(name);
    }

    @Override
    public void eat() {
        System.out.println(getName() + " eats bones");
    }

    @Override
    public void sleep() {
        System.out.println(getName() + " sleeps lying down");
    }
}
```

### 4. Abstract Class Characteristics

| Characteristic       | Description                   |
| -------- | -------------------- |
| Cannot be instantiated    | `new Animal()` ❌ Not allowed |
| May have constructors  | Called by subclasses                |
| May have concrete methods  | Methods need not all be abstract             |
| May have no abstract methods | An abstract class need not contain abstract methods         |
| Abstract methods     | Must be overridden by subclasses              |
| Subclass requirements     | Either override every abstract method or be abstract itself |

### 5. The Template Method Pattern

A typical use of abstract classes: define an algorithm's structure and defer certain steps to subclasses.

```java
// Abstract class: define the template
public abstract class AbstractTemplate {

    // Template method (final prevents subclasses from changing the algorithm's structure)
    public final void templateMethod() {
        step1();        // Fixed step
        step2();        // Abstract step (implemented by subclasses)
        hook();         // Hook method (optional subclass override)
        step3();        // Fixed step
    }

    // Fixed implementation
    private void step1() {
        System.out.println("Step 1: Preparation");
    }

    // Abstract method (subclasses must implement it)
    protected abstract void step2();

    // Hook method (subclasses may override it)
    protected void hook() {
        // Empty default implementation
    }

    // Fixed implementation
    private void step3() {
        System.out.println("Step 3: Cleanup");
    }
}

// Concrete implementation class
public class ConcreteA extends AbstractTemplate {
    @Override
    protected void step2() {
        System.out.println("Step 2: A's implementation");
    }
}

public class ConcreteB extends AbstractTemplate {
    @Override
    protected void step2() {
        System.out.println("Step 2: B's implementation");
    }

    @Override
    protected void hook() {
        System.out.println("B overrides the hook method");
    }
}
```

### 6. Why Use Abstract Classes?

*   **Enforce a contract**: Define common method names that subclasses must implement
*   **Reuse code**: Concrete methods and fields can be inherited
*   **Enable polymorphism**: An abstract-class reference can hold a subclass instance
*   **Define templates**: Specify the algorithm's structure and defer implementation details

***

## V. Interfaces

### 1. What Is an Interface?

An interface is a **contract** defining a set of abstract methods that implementing classes must implement.

### 2. Defining an Interface

```java
public interface Swimmable {
    // JDK 7 and earlier: constants and abstract methods only

    // Constant (implicitly public static final)
    int MAX_SPEED = 100;

    // Abstract methods (implicitly public abstract)
    void swim();
}

public interface Flyable {
    void fly();
}
```

### 3. Implementing an Interface

```java
// Use implements; a class may implement multiple interfaces
public class Duck implements Swimmable, Flyable {

    @Override
    public void swim() {
        System.out.println("The duck swims");
    }

    @Override
    public void fly() {
        System.out.println("The duck flies");
    }
}
```

### 4. New Interface Features in JDK 8+

```java
public interface MyInterface {
    // 1. Abstract method (must be implemented)
    void abstractMethod();

    // 2. Default method (has a default implementation; overriding is optional)
    default void defaultMethod() {
        privateMethod();  // Can call private methods
        System.out.println("Default method");
    }

    // 3. Static method (called through the interface name)
    static void staticMethod() {
        System.out.println("Static method");
    }

    // 4. Private method (JDK 9+, for use inside the interface)
    private void privateMethod() {
        System.out.println("Private method");
    }

    // 5. Private static method (JDK 9+)
    private static void privateStaticMethod() {
        System.out.println("Private static method");
    }
}

// Invocation
MyInterface.staticMethod();  // Call static methods through the interface name
```

### 5. Resolving Default Method Conflicts

When a class implements multiple interfaces with default methods of the same name:

```java
interface A {
    default void show() { System.out.println("A"); }
}

interface B {
    default void show() { System.out.println("B"); }
}

// The implementing class must override the conflicting default method
class C implements A, B {
    @Override
    public void show() {
        A.super.show();  // Call A's default method
        // B.super.show();  // Or call B's default method
        System.out.println("C");
    }
}
```

### 6. Marker Interfaces

A **marker interface** has no methods and marks a particular capability.

```java
// JDK marker interfaces
public interface Serializable { }    // Supports serialization
public interface Cloneable { }       // Supports cloning
public interface RandomAccess { }    // Supports random access

// Use a marker interface
public class Person implements Serializable, Cloneable {
    // ...
}

// Check for a capability
if (obj instanceof Serializable) {
    // Can be serialized
}
```

### 7. Relationships Between Interfaces and Classes

| Relationship      | Syntax            | Multiplicity  |
| ------- | ------------- | --- |
| Class → class   | Inheritance with extends    | Single inheritance |
| Class → interface  | Implementation with implements | Multiple interfaces |
| Interface → interface | Inheritance with extends    | Multiple inheritance |

```java
// Multiple interface inheritance
public interface C extends A, B {
    // Inherits all abstract methods from A and B
}

// A class may extend one class and implement multiple interfaces
public class Dog extends Animal implements Swimmable, Runnable {
    // ...
}
```

### 8. Abstract Class vs. Interface

| Comparison   | Abstract class            | Interface                         |
| ----- | -------------- | -------------------------- |
| Keyword   | abstract class | interface                  |
| Fields  | May have ordinary variables        | Constants only (public static final) |
| Constructors  | Yes              | No                         |
| Concrete methods  | Allowed            | None before JDK 8; default methods from JDK 8 onward     |
| Inheritance/implementation | Single class inheritance            | Multiple interface implementation                        |
| Design concept  | An is-a relationship   | A has-a capability            |
| Use case  | Shared attributes and behavior      | Define contracts and capabilities                    |

### 9. Usage Recommendations

*   **Abstract class**: Describe **what something is** (Dog is an Animal)
*   **Interface**: Describe **what something can do** (Duck can Swim, can Fly)

***

## VI. Polymorphism

### 1. What Is Polymorphism?

Polymorphism is one of the three core OOP features: **the same behavior takes different forms on different objects**.

### 2. Requirements for Polymorphism

1.  An **inheritance/implementation** relationship
2.  **Method overriding**
3.  A **superclass reference referring to a subclass instance**

### 3. Polymorphism Syntax

```java
// Superclass variableName = new Subclass();
Animal a = new Dog();
a.eat();  // Calls Dog's overridden eat method
```

### 4. Polymorphism Example

```java
public class Animal {
    public void eat() {
        System.out.println("The animal eats");
    }
}

public class Dog extends Animal {
    @Override
    public void eat() {
        System.out.println("The dog eats bones");
    }

    public void bark() {
        System.out.println("The dog barks");
    }
}

public class Cat extends Animal {
    @Override
    public void eat() {
        System.out.println("The cat eats fish");
    }
}
```

```java
public class Test {
    public static void main(String[] args) {
        // Polymorphism: superclass references to subclass instances
        Animal a1 = new Dog();
        Animal a2 = new Cat();

        a1.eat();  // The dog eats bones
        a2.eat();  // The cat eats fish

        // a1.bark();  ❌ Compile error! A superclass reference cannot call a subclass-specific method
    }
}
```

### 5. Member Access in Polymorphism

| Member   | Checked at compile time | Selected at runtime          |
| ---- | --- | ------------ |
| Field | Superclass  | Superclass           |
| Method | Superclass  | **Subclass** (overridden method) |

**Memory aid**: For methods, compilation checks the left-hand type; execution uses the right-hand object's type.

```java
public class Animal {
    String name = "Animal";
}

public class Dog extends Animal {
    String name = "Dog";
}

Animal a = new Dog();
System.out.println(a.name);  // Animal (field access uses the superclass)
a.eat();      // Compilation checks Animal for eat; runtime calls Dog's eat
// a.bark();  // Compile error: Animal has no bark method
```

### 6. Benefits and Limitations of Polymorphism

| Benefit                      | Limitation             |
| ----------------------- | -------------- |
| Improves extensibility                 | Cannot directly use subclass-specific functionality     |
| A superclass parameter can accept any subclass instance | A downcast is needed to call subclass-specific methods |

### 7. Type Conversion

```java
Animal a = new Dog();  // Upcast (automatic)

// Downcast (explicit)
if (a instanceof Dog) {  // Check the type first
    Dog d = (Dog) a;
    d.bark();  // Can call the subclass-specific method
}

// Pattern matching: preview in JDK 14+, finalized in JDK 16
if (a instanceof Dog d) {
    d.bark();  // Use directly; no manual cast needed
}

// Pattern matching for switch in JDK 21+
String result = switch (a) {
    case Dog d -> "Dog: " + d.bark();
    case Cat c -> "Cat: " + c.catchMouse();
    default -> "Unknown animal";
};
```

### 8. Uses of Polymorphism

```java
// Scenario: use a superclass type for a method parameter
public class AnimalOperator {
    // Accepts any subclass of Animal
    public void feed(Animal animal) {
        animal.eat();
    }
}

// Usage
AnimalOperator op = new AnimalOperator();
op.feed(new Dog());  // The dog eats bones
op.feed(new Cat());  // The cat eats fish
```

***

## VII. Code Blocks

### 1. Types of Code Blocks

| Type        | Declaration location           | Execution timing             |
| --------- | -------------- | ---------------- |
| **Local block** | Inside a method            | Runs during method execution          |
| **Instance initializer block** | Inside a class, outside methods          | Runs before the constructor body each time an object is created |
| **Static initializer block** | Inside a class, outside methods, with static | Runs once when the class loads     |

### 2. Code Example

```java
public class Demo {
    // Static initializer: runs once when the class loads
    static {
        System.out.println("1. Static initializer");
    }

    // Instance initializer: runs each time an object is created
    {
        System.out.println("2. Instance initializer");
    }

    // Constructor
    public Demo() {
        System.out.println("3. Constructor");
    }

    public void test() {
        // Local block
        {
            int x = 10;
            System.out.println("4. Local block: " + x);
        }
        // System.out.println(x);  ❌ x is not visible here
    }
}
```

### 3. Testing Execution Order

```java
public class Test {
    public static void main(String[] args) {
        System.out.println("--- First object creation ---");
        Demo d1 = new Demo();

        System.out.println("--- Second object creation ---");
        Demo d2 = new Demo();
    }
}
```

**Output:**

    1. Static initializer
    --- First object creation ---
    2. Instance initializer
    3. Constructor
    --- Second object creation ---
    2. Instance initializer
    3. Constructor

### 4. Execution Order with Inheritance

```java
class Parent {
    static { System.out.println("1. Parent static initializer"); }
    { System.out.println("3. Parent instance initializer"); }
    Parent() { System.out.println("4. Parent constructor"); }
}

class Child extends Parent {
    static { System.out.println("2. Child static initializer"); }
    { System.out.println("5. Child instance initializer"); }
    Child() { System.out.println("6. Child constructor"); }
}

// Output order when executing new Child():
// 1. Parent static initializer
// 2. Child static initializer
// 3. Parent instance initializer
// 4. Parent constructor
// 5. Child instance initializer
// 6. Child constructor
```

### 5. Use Cases

| Block type | Use case                     |
| ----- | ------------------------ |
| Static initializer | Load drivers or initialize static resources (one-time operations) |
| Instance initializer | Extract code shared by multiple constructors            |
| Local block | Restrict variable scope (less common)            |

```java
public class JDBCUtils {
    static {
        // Load a database driver (only needs to run once)
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

***

## VIII. Inner Classes

### 1. What Is an Inner Class?

A class defined **inside another class** is called an inner class.

### 2. Categories of Inner Classes

| Type        | Declaration location           | Characteristics          |
| --------- | -------------- | ----------- |
| Member inner class     | Inside a class, outside methods          | Can access all members of the enclosing class |
| Static nested class     | Inside a class, outside methods, with static | Can directly access only static members of the enclosing class |
| Local inner class     | Inside a method            | Scope is limited to the method    |
| **Anonymous inner class** | Inside a method            | Unnamed; simplifies code |

### 3. Member Inner Classes

```java
public class Outer {
    private int num = 10;
    private static int staticNum = 20;

    // Member inner class
    public class Inner {
        private int num = 30;  // Inner class's own field

        public void show() {
            int num = 40;  // Local variable

            System.out.println(num);            // 40 (local variable)
            System.out.println(this.num);       // 30 (inner-class field)
            System.out.println(Outer.this.num); // 10 (enclosing-class field)
        }
    }
}

// Usage
Outer.Inner inner = new Outer().new Inner();
inner.show();
```

### 4. Static Nested Classes

```java
public class Outer {
    private static int staticNum = 20;
    private int num = 10;

    // Static nested class
    public static class Inner {
        public void show() {
            System.out.println("staticNum = " + staticNum);
            // System.out.println(num);  ❌ Cannot directly access a non-static member

            // To access non-static members, create an enclosing-class object
            Outer outer = new Outer();
            System.out.println("num = " + outer.num);
        }
    }
}

// Usage (no enclosing-class object required)
Outer.Inner inner = new Outer.Inner();
inner.show();
```

### 5. Local Inner Classes

```java
public class Outer {
    public void method() {
        final int localVar = 100;  // Must be effectively final

        // Local inner class
        class LocalInner {
            public void show() {
                System.out.println("localVar = " + localVar);
                // localVar = 200;  ❌ Cannot change it
            }
        }

        LocalInner inner = new LocalInner();
        inner.show();
    }
}
```

**Note**: A local variable accessed by a local inner class must be `final` or **effectively final** (its value is never reassigned).

### 6. Anonymous Inner Classes (Key Topic)

An **unnamed inner class** creates an **instance of an anonymous subclass** that extends a class or implements an interface.

```java
// Interface
public interface Swimmable {
    void swim();
}

// Use an anonymous inner class
public class Test {
    public static void main(String[] args) {
        // Traditional approach: define an implementation class
        // class Duck implements Swimmable { ... }
        // Swimmable s = new Duck();

        // Anonymous inner class: directly create an object implementing the interface
        Swimmable s = new Swimmable() {
            @Override
            public void swim() {
                System.out.println("Swimming...");
            }
        };

        s.swim();  // Swimming...
    }
}
```

### 7. Anonymous Inner Class Syntax

```java
new ClassOrInterfaceName() {
    // Override methods
};
```

### 8. Uses of Anonymous Inner Classes

**Pass one as a method argument**:

```java
public class Test {
    public static void main(String[] args) {
        // Scenario 1: Pass directly as an argument
        swim(new Swimmable() {
            @Override
            public void swim() {
                System.out.println("The duck swims");
            }
        });

        // Scenario 2: Simplify button click handlers (Swing/Android)
        button.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                System.out.println("Button clicked");
            }
        });
    }

    public static void swim(Swimmable s) {
        s.swim();
    }
}
```

### 9. Accessing External Variables

```java
public void method() {
    int count = 10;  // effectively final

    Runnable r = new Runnable() {
        @Override
        public void run() {
            System.out.println(count);  // ✅ Accessible
            // count = 20;  ❌ Cannot reassign (must be effectively final)
        }
    };

    // count = 30;  ❌ Reassigning here also makes the access above invalid
}
```

***

## IX. Functional Interfaces

### 1. What Is a Functional Interface?

A **functional interface** contains **exactly one abstract method** and is required for a lambda expression.

```java
// Functional interface: exactly one abstract method
@FunctionalInterface
public interface Swimmable {
    void swim();  // The sole abstract method
}
```

### 2. The @FunctionalInterface Annotation

| Purpose       | Description               |
| -------- | ---------------- |
| **Compile-time check** | Checks that the interface has exactly one abstract method   |
| **Documentation** | Clearly tells other developers that this is a functional interface |
| **Optional**  | An interface can be functional without the annotation    |

```java
// ✅ Valid: exactly one abstract method
@FunctionalInterface
public interface Calculator {
    int calculate(int a, int b);
}

// ❌ Compile error: two abstract methods
@FunctionalInterface
public interface NotFunctional {
    void method1();
    void method2();  // Compile error
}
```

### 3. What a Functional Interface Can Contain

```java
@FunctionalInterface
public interface MyInterface {
    // ✅ Exactly one abstract method (required)
    void abstractMethod();

    // ✅ Default methods are allowed (do not affect the count)
    default void defaultMethod() {
        System.out.println("Default method");
    }

    // ✅ Static methods are allowed (do not affect the count)
    static void staticMethod() {
        System.out.println("Static method");
    }

    // ✅ Private methods are allowed (JDK 9+; do not affect the count)
    private void privateMethod() {
        System.out.println("Private method");
    }

    // ✅ Redeclarations of Object methods are allowed (do not affect the count)
    @Override
    String toString();

    @Override
    boolean equals(Object obj);
}
```

### 4. Built-in JDK Functional Interfaces

Java provides common functional interfaces in the `java.util.function` package:

**Four core interfaces:**

| Interface                  | Parameters | Return type     | Method          | Purpose   |
| ------------------- | -- | ------- | ----------- | ---- |
| **Consumer\<T>**    | T  | void    | `accept(T)` | Consume data |
| **Supplier\<T>**    | None  | T       | `get()`     | Supply data |
| **Function\<T, R>** | T  | R       | `apply(T)`  | Transform data |
| **Predicate\<T>**   | T  | boolean | `test(T)`   | Test a condition |

```java
import java.util.function.*;

public class FunctionalDemo {
    public static void main(String[] args) {
        // Consumer: consume data (one argument, no return value)
        Consumer<String> consumer = s -> System.out.println(s);
        consumer.accept("Hello");  // Output: Hello

        // Supplier: supply data (no arguments, returns a value)
        Supplier<Double> supplier = () -> Math.random();
        System.out.println(supplier.get());  // Print a random number

        // Function: transform data (one argument, returns a value)
        Function<String, Integer> function = s -> s.length();
        System.out.println(function.apply("Hello"));  // 5

        // Predicate: test a condition (one argument, returns boolean)
        Predicate<Integer> predicate = n -> n > 10;
        System.out.println(predicate.test(15));  // true
    }
}
```

**Two-argument versions (Bi family):**

| Interface                       | Parameters   | Return type     | Method             |
| ------------------------ | ---- | ------- | -------------- |
| **BiConsumer\<T, U>**    | T, U | void    | `accept(T, U)` |
| **BiFunction\<T, U, R>** | T, U | R       | `apply(T, U)`  |
| **BiPredicate\<T, U>**   | T, U | boolean | `test(T, U)`   |

```java
// BiFunction: two arguments, one return value
BiFunction<String, String, Integer> biFunc = (a, b) -> a.length() + b.length();
System.out.println(biFunc.apply("Hello", "World"));  // 10

// BiConsumer: two arguments, no return value
BiConsumer<String, Integer> biConsumer = (name, age) ->
    System.out.println(name + ": " + age);
biConsumer.accept("张三", 18);  // 张三: 18

// BiPredicate: two arguments, returns boolean
BiPredicate<String, Integer> biPredicate = (s, n) -> s.length() > n;
System.out.println(biPredicate.test("Hello", 3));  // true
```

**Operator family (specialized Functions):**

| Interface                     | Description               | Purpose     |
| ---------------------- | ---------------- | ------ |
| **UnaryOperator\<T>**  | T → T            | Unary operation   |
| **BinaryOperator\<T>** | (T, T) → T       | Binary operation   |
| **IntUnaryOperator**   | int → int        | Unary int operation |
| **IntBinaryOperator**  | (int, int) → int | Binary int operation |

```java
// UnaryOperator: unary operation (same input and output type)
UnaryOperator<String> upper = s -> s.toUpperCase();
System.out.println(upper.apply("hello"));  // HELLO

// BinaryOperator: binary operation (both inputs and output share one type)
BinaryOperator<Integer> add = (a, b) -> a + b;
System.out.println(add.apply(10, 20));  // 30

// Often used in reduce operations
List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5);
int sum = nums.stream().reduce(0, (a, b) -> a + b);
```

**Primitive specializations (avoid boxing and unboxing):**

| Interface                | Description            |
| ----------------- | ------------- |
| IntConsumer       | int → void    |
| IntSupplier       | () → int      |
| IntFunction\<R>   | int → R       |
| IntPredicate      | int → boolean |
| ToIntFunction\<T> | T → int       |

### 5. Custom Functional Interfaces

```java
@FunctionalInterface
public interface Calculator {
    int calculate(int a, int b);
}

// Use a lambda expression
public class Test {
    public static void main(String[] args) {
        Calculator add = (a, b) -> a + b;
        Calculator sub = (a, b) -> a - b;
        Calculator mul = (a, b) -> a * b;

        System.out.println(add.calculate(10, 5));  // 15
        System.out.println(sub.calculate(10, 5));  // 5
        System.out.println(mul.calculate(10, 5));  // 50
    }
}
```

### 6. Functional Interfaces as Method Parameters

```java
public class Demo {
    public static void main(String[] args) {
        // Pass a lambda expression
        int result = operate(10, 5, (a, b) -> a + b);
        System.out.println(result);  // 15

        result = operate(10, 5, (a, b) -> a * b);
        System.out.println(result);  // 50
    }

    // Functional interface as a parameter
    public static int operate(int a, int b, Calculator calc) {
        return calc.calculate(a, b);
    }
}
```

### 7. Composing Functional Interfaces

```java
// Compose Predicates
Predicate<Integer> p1 = n -> n > 10;
Predicate<Integer> p2 = n -> n < 20;

Predicate<Integer> and = p1.and(p2);      // n > 10 && n < 20
Predicate<Integer> or = p1.or(p2);        // n > 10 || n < 20
Predicate<Integer> negate = p1.negate();  // !(n > 10)

// Compose Functions
Function<String, String> f1 = s -> s.toUpperCase();
Function<String, Integer> f2 = s -> s.length();

Function<String, Integer> composed = f1.andThen(f2);  // Uppercase first, then get the length
System.out.println(composed.apply("hello"));  // 5

// Compose Consumers
Consumer<String> c1 = s -> System.out.print("1: " + s);
Consumer<String> c2 = s -> System.out.println(" 2: " + s);
Consumer<String> combined = c1.andThen(c2);
combined.accept("test");  // 1: test 2: test
```

### 8. Functional vs. Ordinary Interfaces

| Comparison        | Functional interface                    | Ordinary interface  |
| ---------- | ------------------------ | ----- |
| Abstract method count     | Exactly 1                  | May have multiple |
| Usable with lambdas? | ✅ Yes                     | ❌ No |
| Annotation         | @FunctionalInterface (optional) | None     |
| Default/static methods    | Allowed                      | Allowed   |

***

## X. Lambda Expressions

### 1. What Is a Lambda?

Lambda expressions, introduced in JDK 8, **simplify anonymous inner-class syntax**.

### 2. Requirement for Lambdas

Only usable with **functional interfaces** (interfaces with exactly one abstract method)

```java
@FunctionalInterface  // Functional interface annotation
public interface Swimmable {
    void swim();  // Exactly one abstract method
}
```

### 3. Lambda Syntax

```java
(parameterList) -> {
    methodBody
}
```

### 4. From an Anonymous Inner Class to a Lambda

```java
// Interface
interface Calculator {
    int calc(int a, int b);
}

public class Test {
    public static void main(String[] args) {
        // 1. Anonymous inner class
        Calculator c1 = new Calculator() {
            @Override
            public int calc(int a, int b) {
                return a + b;
            }
        };

        // 2. Standard lambda syntax
        Calculator c2 = (int a, int b) -> {
            return a + b;
        };

        // 3. Simplified lambda syntax
        Calculator c3 = (a, b) -> a + b;

        System.out.println(c3.calc(10, 20));  // 30
    }
}
```

### 5. Lambda Omission Rules

| Omittable element        | Condition            |
| ----------- | ------------- |
| Parameter types        | All parameter types may be omitted    |
| Parentheses         | May be omitted for exactly one parameter    |
| Braces and return | May be omitted for a single-statement body |

```java
// No parameters, no return value
Runnable r = () -> System.out.println("Running");

// One parameter (parentheses may be omitted)
Consumer<String> c = s -> System.out.println(s);
// Equivalent to
Consumer<String> c = (String s) -> { System.out.println(s); };

// Multiple parameters with a return value
Comparator<Integer> comp = (a, b) -> a - b;
// Equivalent to
Comparator<Integer> comp = (Integer a, Integer b) -> { return a - b; };
```

### 6. Variable Capture in Lambdas

A lambda may access external variables, but captured variables must be **effectively final**:

```java
public void method() {
    int count = 10;  // Effectively final (never reassigned)
    String name = "张三";

    Runnable r = () -> {
        System.out.println(count);  // ✅ Accessible
        System.out.println(name);   // ✅ Accessible
        // count = 20;  ❌ Cannot reassign (must be effectively final)
    };

    // count = 30;  ❌ Reassigning here also makes the lambda's access invalid
}
```

### 7. Method References

A method reference further simplifies a lambda that only calls an existing method.

**Four forms:**

| Type           | Syntax          | Equivalent lambda                     |
| ------------ | ----------- | ------------------------------- |
| **Static method reference**   | `ClassName::staticMethodName` | `(args) -> ClassName.staticMethod(args)`       |
| **Instance method reference**   | `object::instanceMethodName` | `(args) -> object.instanceMethod(args)`       |
| **Instance method reference through a class** | `ClassName::instanceMethodName` | `(obj, args) -> obj.instanceMethod(args)` |
| **Constructor reference**   | `ClassName::new`   | `(args) -> new ClassName(args)`        |

```java
// ========== 1. Static method reference ==========
// Lambda
Function<String, Integer> f1 = s -> Integer.parseInt(s);
// Method reference
Function<String, Integer> f2 = Integer::parseInt;

// ========== 2. Instance method reference (a specific object's method) ==========
String str = "Hello";
// Lambda
Supplier<Integer> s1 = () -> str.length();
// Method reference
Supplier<Integer> s2 = str::length;

// ========== 3. Instance method reference through a class (first argument is the receiver) ==========
// Lambda
BiFunction<String, String, Boolean> bf1 = (a, b) -> a.equals(b);
// Method reference
BiFunction<String, String, Boolean> bf2 = String::equals;

// Comparator example
Comparator<String> comp1 = (a, b) -> a.compareTo(b);
Comparator<String> comp2 = String::compareTo;

// ========== 4. Constructor reference ==========
// Lambda
Supplier<ArrayList<String>> sup1 = () -> new ArrayList<>();
// Method reference
Supplier<ArrayList<String>> sup2 = ArrayList::new;

// Parameterized constructor
Function<String, StringBuilder> func1 = s -> new StringBuilder(s);
Function<String, StringBuilder> func2 = StringBuilder::new;
```

### 8. Common Uses of Method References

```java
import java.util.*;

public class MethodReferenceDemo {
    public static void main(String[] args) {
        List<String> list = Arrays.asList("banana", "apple", "cherry");

        // Scenario 1: Iterate and print
        list.forEach(s -> System.out.println(s));  // Lambda
        list.forEach(System.out::println);          // Method reference ✅

        // Scenario 2: Sort
        list.sort((a, b) -> a.compareTo(b));  // Lambda
        list.sort(String::compareTo);          // Method reference ✅

        // Scenario 3: Convert types
        List<Integer> nums = list.stream()
            .map(s -> s.length())          // Lambda
            .map(String::length)           // Method reference ✅
            .toList();

        // Scenario 4: Construct objects
        List<StringBuilder> builders = list.stream()
            .map(s -> new StringBuilder(s))  // Lambda
            .map(StringBuilder::new)          // Method reference ✅
            .toList();
    }
}
```

### 9. Lambdas vs. Anonymous Inner Classes

| Comparison     | Anonymous inner class           | Lambda                |
| ------- | --------------- | --------------------- |
| Applicable to    | Classes, abstract classes, and interfaces        | Functional interfaces only             |
| Syntax      | Requires a full class definition        | Concise arrow syntax               |
| Compilation result    | Generates a separate .class file | Does not generate an additional .class file       |
| Meaning of this | Refers to the anonymous inner-class object       | Refers to the enclosing-class object               |
| Access to external variables  | Must be final or effectively final (JDK 8+) | Must be effectively final |

```java
public class ThisDemo {
    private String name = "Enclosing class";

    public void test() {
        // this in an anonymous inner class
        Runnable r1 = new Runnable() {
            private String name = "Anonymous inner class";
            @Override
            public void run() {
                System.out.println(this.name);  // Anonymous inner class
            }
        };

        // this in a lambda
        Runnable r2 = () -> {
            System.out.println(this.name);  // Enclosing class
        };
    }
}
```

***

## XI. Summary Mind Map

    Advanced Object-Oriented Programming
        │
        ├── Inheritance: extends
        │     ├── Single and multilevel inheritance
        │     ├── Method overriding: @Override
        │     │     ├── Return type may be a subtype (covariant return)
        │     │     └── Cannot declare broader exceptions
        │     ├── super accesses the superclass
        │     └── super() and this() are mutually exclusive
        │
        ├── Object class
        │     ├── Root of all classes
        │     ├── Override toString()
        │     ├── Override equals() + hashCode()
        │     └── clone(): shallow and deep copying
        │
        ├── final keyword
        │     ├── Class: cannot be subclassed
        │     ├── Method: cannot be overridden
        │     ├── Variable: value/reference cannot be reassigned
        │     ├── Parameter: value cannot be reassigned
        │     └── Field: initialize at declaration or in a constructor
        │
        ├── Abstract class: abstract
        │     ├── Cannot be instantiated
        │     ├── May have abstract and concrete methods
        │     ├── Subclasses must override abstract methods
        │     └── Template method pattern
        │
        ├── Interface: interface
        │     ├── Constants and abstract methods only
        │     ├── A class may implement multiple interfaces
        │     ├── JDK 8+: default and static methods
        │     ├── JDK 9+: private methods
        │     ├── Default method conflicts: InterfaceName.super.method()
        │     └── Marker interfaces: Serializable, Cloneable
        │
        ├── Polymorphism
        │     ├── Superclass reference to a subclass instance
        │     ├── Compile-time check: left-hand type; runtime dispatch: right-hand type
        │     ├── Type check: instanceof
        │     └── Pattern matching in JDK 16+
        │
        ├── Code blocks
        │     ├── Static initializer: runs once when the class loads
        │     ├── Instance initializer: runs before each object's constructor body
        │     └── Order: parent static → child static → parent instance initializer → parent constructor → child instance initializer → child constructor
        │
        ├── Inner classes
        │     ├── Member inner class: Outer.this accesses the enclosing instance
        │     ├── Static nested class: directly accesses only static members
        │     ├── Local inner class: captured variables must be effectively final
        │     └── Anonymous inner class (key topic)
        │
        ├── Functional interfaces
        │     ├── Interface with exactly one abstract method
        │     ├── @FunctionalInterface annotation
        │     ├── Required for lambda expressions
        │     ├── Four core interfaces:
        │     │     ├── Consumer: consumes (argument, no return value)
        │     │     ├── Supplier: supplies (no arguments, returns a value)
        │     │     ├── Function: transforms (argument and return value)
        │     │     └── Predicate: tests (returns boolean)
        │     ├── Bi family: BiConsumer, BiFunction, BiPredicate
        │     └── Operator family: UnaryOperator, BinaryOperator
        │
        └── Lambda expressions
              ├── Simplify anonymous inner classes for functional interfaces
              ├── Syntax: (parameters) -> { body }
              ├── Omit parameter types, parentheses, and return where allowed
              ├── Variable capture: must be effectively final
              ├── Method references:
              │     ├── Static method: ClassName::methodName
              │     ├── Instance method: object::methodName
              │     ├── Instance method through a class: ClassName::methodName
              │     └── Constructor: ClassName::new
              └── this refers to the enclosing instance (unlike an anonymous inner class)
