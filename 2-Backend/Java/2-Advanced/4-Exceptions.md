## I. What Is an Exception?

### 1. The Concept of Exceptions

An exception is an abnormal condition that occurs **while a program is running**. If left unhandled, it terminates execution.

```java
public class Demo {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        System.out.println(arr[10]);  // ❌ Array index out of bounds
        System.out.println("Program continues");  // Not executed
    }
}
```

**Output:**

    Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 10 out of bounds for length 3

### 2. Exception vs Error

| Comparison | Exception | Error |
| ------ | -------------- | ----------- |
| **Definition** | A problem the program can handle | A serious problem that is usually difficult to recover from |
| **Handling** | Can be caught and handled | Can syntactically be caught with catch, but ordinary recovery should generally not be attempted |
| **Examples** | Null pointer, array index out of bounds, missing file | Out of memory, stack overflow |
| **Recommendation** | Handle or propagate according to the situation | Generally avoid blanket catches; handling at specific boundaries needs a clear purpose |

***

## II. Exception Hierarchy

### 1. Inheritance Diagram

    java.lang.Throwable (objects that can be thrown)
        │
        ├── Error — serious problems; generally not handled
        │       ├── OutOfMemoryError (out of memory)
        │       ├── StackOverflowError (stack overflow)
        │       ├── NoClassDefFoundError (class definition not found)
        │       └── ...
        │
        └── Exception — can be handled
                │
                ├── RuntimeException (unchecked exceptions) — handling is optional
                │       ├── NullPointerException (null pointer)
                │       ├── IndexOutOfBoundsException (index out of bounds)
                │       │       └── ArrayIndexOutOfBoundsException (array index out of bounds)
                │       ├── ClassCastException (invalid type cast)
                │       ├── ArithmeticException (arithmetic error)
                │       ├── IllegalArgumentException (invalid argument)
                │       │       └── NumberFormatException (invalid number format)
                │       ├── IllegalStateException (invalid state)
                │       ├── UnsupportedOperationException (unsupported operation)
                │       ├── ConcurrentModificationException (concurrent modification)
                │       └── ...
                │
                └── Other Exception subclasses (checked exceptions) — must be handled or declared
                        ├── IOException (I/O error)
                        │       └── FileNotFoundException (file not found)
                        ├── SQLException (SQL error)
                        ├── ParseException (parsing error)
                        ├── ClassNotFoundException (class not found)
                        ├── InterruptedException (thread interrupted)
                        └── ...

### 2. Two Main Categories

| Category | Description | Handling required? | Examples |
| ------------------------------ | ------------- | -------- | ---------- |
| **Unchecked exception**<br>RuntimeException | Not checked at compile time; detected at runtime | Optional | Null pointer, array index out of bounds |
| **Checked exception**<br>Checked Exception | Checked by the compiler; must be handled or declared | **Required** | I/O exceptions, SQL exceptions |

```java
// Unchecked exception: compiles, but fails at runtime
public void test1() {
    int[] arr = null;
    System.out.println(arr.length);  // NullPointerException occurs only at runtime
}

// Checked exception: compilation fails unless handled or declared
public void test2() {
    FileInputStream fis = new FileInputStream("a.txt");  // ❌ Compile-time error
    // FileNotFoundException must be handled or declared
}
```

***

## III. Exception Handling Approaches

### 1. try-catch-finally

#### 1. Basic Syntax

```java
try {
    // Code that may throw an exception
} catch (ExceptionType1 variableName) {
    // Handle exception 1
} catch (ExceptionType2 variableName) {
    // Handle exception 2
} finally {
    // Executes whether or not an exception occurs (usually to release resources)
}
```

#### 2. Execution Flow

    Code in try
        │
        ├── No exception ──→ skip catch ──→ execute finally ──→ continue with subsequent code
        │
        └── Exception ──→ match catch ──→ execute catch ──→ execute finally ──→ continue with subsequent code

#### 3. Basic Example

```java
public class TryCatchDemo {
    public static void main(String[] args) {
        try {
            int[] arr = {1, 2, 3};
            System.out.println(arr[10]);  // An exception occurs here
            System.out.println("Code after the exception in try");  // Not executed
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Array index out of bounds caught");
            e.printStackTrace();  // Print exception details
        } finally {
            System.out.println("finally always executes");
        }
        System.out.println("Program continues");
    }
}
```

**Output:**

    Array index out of bounds caught
    java.lang.ArrayIndexOutOfBoundsException: Index 10 out of bounds for length 3
        at TryCatchDemo.main(TryCatchDemo.java:5)
    finally always executes
    Program continues

#### 4. Multiple catch Blocks

```java
public static void main(String[] args) {
    try {
        int[] arr = {1, 2, 3};
        System.out.println(arr[10]);      // Array index out of bounds
        System.out.println(10 / 0);        // Arithmetic exception
    } catch (ArrayIndexOutOfBoundsException e) {
        System.out.println("Array index out of bounds");
    } catch (ArithmeticException e) {
        System.out.println("Arithmetic exception");
    } catch (Exception e) {
        // Put the superclass exception last as a fallback
        System.out.println("Other exception: " + e.getMessage());
    }
}
```

**Note:** With multiple catch blocks, **subclass exceptions come before superclass exceptions**.

#### 5. Multi-Catch (JDK 7+)

```java
try {
    // Code that may throw an exception
} catch (ArrayIndexOutOfBoundsException | ArithmeticException e) {
    // Catch multiple exception types together
    System.out.println("Exception occurred: " + e.getMessage());
}
```

#### 6. The Role of finally

**Code in finally always executes**, and is usually used to release resources.

```java
FileInputStream fis = null;
try {
    fis = new FileInputStream("a.txt");
    // Read the file...
} catch (IOException e) {
    e.printStackTrace();
} finally {
    // Release resources (close the stream whether or not an exception occurs)
    if (fis != null) {
        try {
            fis.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 7. finally and return

```java
public static int test() {
    try {
        return 10;
    } finally {
        System.out.println("finally executes");  // Still executes
    }
}
// Output: finally executes
// Returns: 10
```

**Special Case: return Inside finally**

```java
public static int test() {
    try {
        return 10;
    } finally {
        return 20;  // ⚠️ Overrides the return in try
    }
}
// Returns: 20 (not recommended!)
```

#### 8. Cases Where finally Does Not Execute

```java
// Case 1: System.exit() terminates the JVM
try {
    System.out.println("try");
    System.exit(0);  // JVM exits
} finally {
    System.out.println("finally");  // Not executed
}

// Case 2: a daemon thread is terminated
// When all non-daemon threads finish, a daemon thread's finally may not execute

// Case 3: the JVM process is killed (such as kill -9) or crashes
// Case 4: the try block never finishes (an infinite loop or a deadlock)
```

***

### 2. Declare with throws

#### 1. Basic Syntax

```java
modifiers ReturnType methodName(parameterList) throws ExceptionType1, ExceptionType2 {
    // Method body
}
```

#### 2. Purpose

*   **Does not handle the exception**; propagates it to the caller.
*   The caller can continue declaring it with throws or handle it with try-catch.

#### 3. Example

```java
public class ThrowsDemo {
    public static void main(String[] args) {
        try {
            readFile();  // The caller handles the exception
        } catch (IOException e) {
            System.out.println("File read failed: " + e.getMessage());
        }
    }

    // The method declares the exception instead of handling it itself
    public static void readFile() throws IOException {
        FileInputStream fis = new FileInputStream("a.txt");
        fis.close();
    }
}
```

#### 4. A throws Chain

```java
// Propagate upward through each layer
public static void main(String[] args) throws IOException {
    method1();
}

public static void method1() throws IOException {
    method2();
}

public static void method2() throws IOException {
    FileInputStream fis = new FileInputStream("a.txt");
}

// Ultimately reaches the JVM, which prints exception details and terminates the program
```

***

### 3. try-with-resources (JDK 7+)

#### 1. Automatic Resource Closing

```java
// Traditional approach: close manually in finally
FileInputStream fis = null;
try {
    fis = new FileInputStream("a.txt");
    // Use the resource...
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (fis != null) {
        try {
            fis.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

// ✅ try-with-resources: automatic closing
try (FileInputStream fis = new FileInputStream("a.txt")) {
    // Use the resource...
} catch (IOException e) {
    e.printStackTrace();
}
// fis closes automatically; no finally is needed
```

#### 2. Multiple Resources

```java
try (
    FileInputStream fis = new FileInputStream("a.txt");
    FileOutputStream fos = new FileOutputStream("b.txt")
) {
    // Use the resources...
} catch (IOException e) {
    e.printStackTrace();
}
// Both fis and fos close automatically (in reverse declaration order)
```

#### 3. JDK 9+ Enhancement

```java
// Before JDK 9: resources must be declared inside try()
FileInputStream in = new FileInputStream("a.txt");
try (FileInputStream in2 = in) {  // An additional variable is needed
    // Use the resource...
}

// JDK 9+: externally declared final or effectively final variables can be used
FileInputStream fis = new FileInputStream("a.txt");
BufferedReader br = new BufferedReader(new InputStreamReader(fis));
try (fis; br) {  // ✅ Use the external variable directly
    // Use the resource...
}
```

#### 4. Requirements

The resource class must implement `AutoCloseable` or `Closeable`.

```java
// JDK I/O streams implement Closeable
public abstract class InputStream implements Closeable {
    public void close() throws IOException { }
}

// Custom closeable resource
public class MyResource implements AutoCloseable {
    @Override
    public void close() throws Exception {
        System.out.println("Resource closed");
    }
}
```

***

## IV. The throw Keyword

### 1. throw vs throws

| Comparison | throw | throws |
| ------- | ---------- | ----------- |
| **Location** | Inside a method body | In the method declaration |
| **Purpose** | Explicitly throws an exception object | Declares exceptions a method may throw |
| **Count** | One at a time | Multiple types may be declared |
| **Followed by** | An exception object | Exception types |

### 2. throw Syntax

```java
throw new ExceptionType("Exception message");
```

### 3. Usage Example

```java
public class ThrowDemo {
    public static void main(String[] args) {
        try {
            checkAge(-5);
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid argument: " + e.getMessage());
        }
    }

    public static void checkAge(int age) {
        if (age < 0) {
            // Explicitly throw an exception
            throw new IllegalArgumentException("Age must not be negative: " + age);
        }
        if (age > 150) {
            throw new IllegalArgumentException("Age must not exceed 150: " + age);
        }
        System.out.println("Valid age: " + age);
    }
}
```

### 4. Throwing Unchecked vs Checked Exceptions

```java
// Unchecked exception: handling is optional
public static void method1(int num) {
    if (num < 0) {
        throw new IllegalArgumentException("Argument must not be negative");  // ✅ No declaration required
    }
}

// Checked exception: must be declared with throws or handled with try-catch
public static void method2() throws IOException {
    throw new IOException("I/O exception");  // Must declare or handle
}
```

***

## V. Exception Chaining

### 1. What Is Exception Chaining?

Exception chaining occurs when one exception causes another; the original exception is recorded as the `cause`.

```java
try {
    // Low-level operation
} catch (SQLException e) {
    // Wrap as a business exception, retaining the original exception
    throw new ServiceException("Database operation failed", e);
}
```

### 2. Building an Exception Chain

```java
// Approach 1: through the constructor
public ServiceException(String message, Throwable cause) {
    super(message, cause);
}

// Usage
throw new ServiceException("Operation failed", originalException);

// Approach 2: through initCause()
ServiceException se = new ServiceException("Operation failed");
se.initCause(originalException);
throw se;
```

### 3. Retrieving the Original Exception

```java
try {
    service.doSomething();
} catch (ServiceException e) {
    System.out.println("Business exception: " + e.getMessage());

    // Retrieve the original exception
    Throwable cause = e.getCause();
    if (cause != null) {
        System.out.println("Original exception: " + cause.getMessage());
        cause.printStackTrace();
    }
}
```

### 4. Complete Example

```java
public class ExceptionChainDemo {
    public static void main(String[] args) {
        try {
            queryUser(1);
        } catch (ServiceException e) {
            System.out.println("Service exception: " + e.getMessage());
            System.out.println("Root cause: " + e.getCause());
        }
    }

    public static void queryUser(int id) {
        try {
            // Simulate a database query
            throw new SQLException("Database connection failed");
        } catch (SQLException e) {
            // Convert to a business exception, retaining the original exception
            throw new ServiceException("User query failed", e);
        }
    }
}

class ServiceException extends RuntimeException {
    public ServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

***

## VI. Custom Exceptions

### 1. Why Custom Exceptions Are Needed

*   JDK exceptions may not express the specific business errors you need.
*   They make exception information clearer and more meaningful.

### 2. Steps to Define a Custom Exception

1.  Define a class extending `Exception` (checked) or `RuntimeException` (unchecked).
2.  Provide multiple constructors.
3.  Add serialVersionUID (optional but recommended).

### 3. Standard Custom Exception Template

```java
/**
 * Custom business exception
 */
public class BusinessException extends RuntimeException {

    // Serialization version identifier (recommended)
    private static final long serialVersionUID = 1L;

    // Error code (optional)
    private String errorCode;

    // No-argument constructor
    public BusinessException() {
        super();
    }

    // Constructor with a message
    public BusinessException(String message) {
        super(message);
    }

    // Constructor with message and cause (for exception chaining)
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }

    // Constructor with a cause
    public BusinessException(Throwable cause) {
        super(cause);
    }

    // Constructor with error code and message
    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
```

### 4. Custom Unchecked Exception

```java
// Custom exception class
public class AgeException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public AgeException() {
    }

    public AgeException(String message) {
        super(message);
    }

    public AgeException(String message, Throwable cause) {
        super(message, cause);
    }
}

// Use the custom exception
public class Student {
    private int age;

    public void setAge(int age) {
        if (age < 0 || age > 150) {
            throw new AgeException("Invalid age: " + age);
        }
        this.age = age;
    }
}

// Test
public static void main(String[] args) {
    Student s = new Student();
    try {
        s.setAge(-5);
    } catch (AgeException e) {
        System.out.println(e.getMessage());  // Invalid age: -5
    }
}
```

### 5. Custom Checked Exception

```java
// Custom checked exception
public class LoginException extends Exception {

    private static final long serialVersionUID = 1L;

    public LoginException() {
    }

    public LoginException(String message) {
        super(message);
    }

    public LoginException(String message, Throwable cause) {
        super(message, cause);
    }
}

// Usage
public class UserService {

    public void login(String username, String password) throws LoginException {
        if (!"admin".equals(username)) {
            throw new LoginException("Username does not exist");
        }
        if (!"123456".equals(password)) {
            throw new LoginException("Incorrect password");
        }
        System.out.println("Login succeeded");
    }
}

// The caller must handle or declare it
public static void main(String[] args) {
    UserService service = new UserService();
    try {
        service.login("admin", "wrong");
    } catch (LoginException e) {
        System.out.println("Login failed: " + e.getMessage());
    }
}
```

### 6. Which Class to Extend

| Superclass | Type | Characteristic | Use cases |
| ------------------ | ----- | ----- | ----------- |
| `RuntimeException` | Unchecked exception | Handling is optional | Argument validation, business-logic exceptions |
| `Exception` | Checked exception | Handling or declaration required | Exceptions callers must explicitly address |

**Recommendation:** Custom exceptions generally extend `RuntimeException` for greater flexibility.

***

## VII. Common Exception Methods

### 1. Throwable Methods

```java
try {
    int[] arr = {1, 2, 3};
    System.out.println(arr[10]);
} catch (Exception e) {

    // 1. getMessage() - retrieve the exception message
    String msg = e.getMessage();
    System.out.println(msg);  // Index 10 out of bounds for length 3

    // 2. toString() - retrieve the exception type and message
    String str = e.toString();
    System.out.println(str);  // java.lang.ArrayIndexOutOfBoundsException: Index 10...

    // 3. printStackTrace() - print the full exception stack trace (most commonly used)
    e.printStackTrace();
    /*
    java.lang.ArrayIndexOutOfBoundsException: Index 10 out of bounds for length 3
        at Demo.main(Demo.java:5)
    */

    // 4. getStackTrace() - retrieve an array of stack-trace elements
    StackTraceElement[] stackTrace = e.getStackTrace();
    for (StackTraceElement element : stackTrace) {
        System.out.println("Class: " + element.getClassName());
        System.out.println("Method: " + element.getMethodName());
        System.out.println("Filename: " + element.getFileName());
        System.out.println("Line: " + element.getLineNumber());
    }
}
```

### 2. Exception Chaining Methods

```java
try {
    throw new RuntimeException("Outer exception", new IOException("Inner exception"));
} catch (RuntimeException e) {

    // 5. getCause() - retrieve the original exception
    Throwable cause = e.getCause();
    System.out.println(cause);  // java.io.IOException: Inner exception

    // 6. initCause() - set the original exception (usually set in the constructor)
    RuntimeException re = new RuntimeException("New exception");
    re.initCause(new IOException("Cause"));
}
```

### 3. Suppressed Exceptions (JDK 7+)

```java
// A resource whose close() fails
class FailingResource implements AutoCloseable {
    @Override
    public void close() throws Exception {
        throw new IOException("close() failed");
    }
}

// With try-with-resources, an exception thrown by close() is suppressed
// (attached to the primary exception instead of replacing it)
try (FailingResource res = new FailingResource()) {
    throw new RuntimeException("Primary exception");
} catch (Exception e) {
    System.out.println(e.getMessage());  // Primary exception

    // 7. getSuppressed() - retrieve suppressed exceptions
    Throwable[] suppressed = e.getSuppressed();
    for (Throwable t : suppressed) {
        System.out.println("Suppressed exception: " + t.getMessage());  // close() failed
    }

    // 8. addSuppressed() - add a suppressed exception manually
    e.addSuppressed(new IOException("Additional exception"));
}
```

### 4. Method Quick Reference

| Method | Return type | Description |
| -------------------------- | -------------------- | ----------- |
| `getMessage()` | String | Retrieves the exception message |
| `toString()` | String | Retrieves the exception type and message |
| `printStackTrace()` | void | Prints the full stack trace |
| `getStackTrace()` | StackTraceElement\[] | Retrieves the stack-trace element array |
| `getCause()` | Throwable | Retrieves the original exception (exception chain) |
| `initCause(Throwable)` | Throwable | Sets the original exception |
| `getSuppressed()` | Throwable\[] | Retrieves suppressed exceptions |
| `addSuppressed(Throwable)` | void | Adds a suppressed exception |

***

## VIII. Common Exception Types

### 1. Unchecked Exceptions (RuntimeException)

| Exception type | Description | Common scenario |
| --------------------------------- | -------- | -------------- |
| `NullPointerException` | Null pointer | Calling a method or accessing a field on null |
| `ArrayIndexOutOfBoundsException` | Array index out of bounds | Accessing an invalid index |
| `StringIndexOutOfBoundsException` | String index out of bounds | String index outside its bounds |
| `IndexOutOfBoundsException` | Index out of bounds (superclass) | Various invalid-index cases |
| `ClassCastException` | Invalid type cast | Explicit cast fails |
| `NumberFormatException` | Invalid number format | String-to-number conversion fails |
| `ArithmeticException` | Arithmetic error | Division by zero |
| `IllegalArgumentException` | Invalid argument | Invalid method argument |
| `IllegalStateException` | Invalid state | Object in an inappropriate state |
| `UnsupportedOperationException` | Unsupported operation | Calling an unsupported method |
| `ConcurrentModificationException` | Concurrent modification | Modifying a collection during iteration |

```java
// NullPointerException
String s = null;
s.length();  // ❌ Null pointer

// ArrayIndexOutOfBoundsException
int[] arr = {1, 2, 3};
arr[10] = 100;  // ❌ Array index out of bounds

// ClassCastException
Object obj = "Hello";
Integer num = (Integer) obj;  // ❌ Type cast fails

// NumberFormatException
int n = Integer.parseInt("abc");  // ❌ Not a number

// ArithmeticException
int result = 10 / 0;  // ❌ Division by zero

// UnsupportedOperationException
List<String> fixed = Arrays.asList("a", "b");
fixed.add("c");  // ❌ Fixed-size list does not support adding elements

// ConcurrentModificationException
List<String> list = new ArrayList<>(Arrays.asList("a", "b", "c"));
for (String item : list) {
    list.remove(item);  // ❌ Modification during iteration
}
```

### 2. Checked Exceptions

| Exception type | Description | Common scenario |
| ------------------------------ | ------ | ------------- |
| `IOException` | I/O error | File read/write failure |
| `FileNotFoundException` | File not found | Incorrect file path |
| `SQLException` | SQL error | Database operation failure |
| `ParseException` | Parsing error | Date-format parsing failure |
| `ClassNotFoundException` | Class not found | Reflection cannot locate the class |
| `InterruptedException` | Interruption | Thread interrupted |
| `CloneNotSupportedException` | Cloning unsupported | Cloneable not implemented |
| `ReflectiveOperationException` | Reflection error | Reflective invocation fails |

```java
// FileNotFoundException - must handle or declare
FileInputStream fis = new FileInputStream("missing-file.txt");

// ParseException - must handle or declare
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
Date date = sdf.parse("2024-01-01");

// ClassNotFoundException - must handle or declare
Class<?> clazz = Class.forName("com.example.NotExist");

// InterruptedException - must handle or declare
Thread.sleep(1000);
```

***

## IX. Exception Handling Principles

### 1. Basic Principles

```java
// ❌ Do not catch an exception and do nothing
try {
    // Code that may throw an exception
} catch (Exception e) {
    // Empty! Not recommended
}

// ❌ Do not merely print the stack trace without handling the exception
try {
    // Code that may throw an exception
} catch (Exception e) {
    e.printStackTrace();  // Only prints; does not actually handle the failure
}

// ✅ Correct handling: logging + business handling
try {
    // Code that may throw an exception
} catch (Exception e) {
    logger.error("Operation failed", e);  // Log the error
    // Perform business handling, such as rollback, retry, or returning an error message
}
```

### 2. Avoid Overly Broad Catches

```java
// ❌ Not recommended: catch all exceptions
try {
    // ...
} catch (Exception e) {
    // ...
}

// ❌ Even less recommended: catch Throwable
try {
    // ...
} catch (Throwable t) {
    // Even catches Error
}

// ✅ Recommended: catch specific exceptions
try {
    // ...
} catch (FileNotFoundException e) {
    // Handle a missing file
} catch (IOException e) {
    // Handle other I/O exceptions
}
```

### 3. Exception Translation

```java
// Translate low-level exceptions into business exceptions
public User findUser(int id) {
    try {
        return userDao.findById(id);
    } catch (SQLException e) {
        // Translate to a business exception, hiding implementation details
        throw new ServiceException("User query failed", e);
    }
}
```

### 4. Use try-with-resources

```java
// ❌ Traditional approach: verbose and error-prone
FileInputStream fis = null;
try {
    fis = new FileInputStream("a.txt");
    // ...
} catch (IOException e) {
    // ...
} finally {
    if (fis != null) {
        try {
            fis.close();
        } catch (IOException e) {
            // ...
        }
    }
}

// ✅ Recommended: try-with-resources
try (FileInputStream fis = new FileInputStream("a.txt")) {
    // ...
} catch (IOException e) {
    // ...
}
```

### 5. Method Overriding and Exceptions

```java
class Parent {
    public void method() throws IOException {
        // ...
    }
}

// ✅ May throw no exception
class Child1 extends Parent {
    @Override
    public void method() {
        // ...
    }
}

// ✅ May throw the same exception
class Child2 extends Parent {
    @Override
    public void method() throws IOException {
        // ...
    }
}

// ✅ May throw a subclass exception
class Child3 extends Parent {
    @Override
    public void method() throws FileNotFoundException {
        // ...
    }
}

// ❌ Cannot throw a broader checked exception
class Child4 extends Parent {
    @Override
    public void method() throws Exception {  // Compile-time error
        // ...
    }
}
```

**Rule:** An overriding method **cannot declare broader checked exceptions than the overridden method**; unchecked exceptions are not restricted.

### 6. Validate Early to Avoid Exceptions

```java
// ❌ Rely on exception handling
try {
    return list.get(index);
} catch (IndexOutOfBoundsException e) {
    return null;
}

// ✅ Validate beforehand
if (index >= 0 && index < list.size()) {
    return list.get(index);
}
return null;

// ❌ Rely on an exception to detect null
try {
    obj.doSomething();
} catch (NullPointerException e) {
    // Handle null
}

// ✅ Check for null beforehand
if (obj != null) {
    obj.doSomething();
}
```

### 7. Make Exception Messages Meaningful

```java
// ❌ Unclear message
throw new IllegalArgumentException("Invalid argument");

// ✅ Clear message
throw new IllegalArgumentException("User ID must not be negative: " + userId);

// ✅ Better: include context
throw new IllegalArgumentException(
    String.format("User ID must not be negative; current value: %d; method: %s", userId, "findUser")
);
```

***

## X. Comprehensive Example

### 1. User Registration

```java
// 1. Custom exception
public class RegisterException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    private String errorCode;

    public RegisterException(String message) {
        super(message);
    }

    public RegisterException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public RegisterException(String message, Throwable cause) {
        super(message, cause);
    }

    public String getErrorCode() {
        return errorCode;
    }
}

// 2. User service class
public class UserService {
    // Simulate usernames already stored in the database
    private static final String[] EXISTING_USERS = {"admin", "alice", "bob"};

    /**
     * Register a user
     * @param username username
     * @param password password
     */
    public void register(String username, String password) {
        // 1. Validate username
        if (username == null || username.trim().isEmpty()) {
            throw new RegisterException("E001", "Username must not be empty");
        }
        if (username.length() < 3 || username.length() > 20) {
            throw new RegisterException("E002", "Username length must be between 3 and 20");
        }

        // 2. Validate password
        if (password == null || password.length() < 6) {
            throw new RegisterException("E003", "Password must be at least 6 characters long");
        }

        // 3. Check whether the username already exists
        for (String user : EXISTING_USERS) {
            if (user.equals(username)) {
                throw new RegisterException("E004", "Username already exists: " + username);
            }
        }

        // 4. Simulate saving to the database
        try {
            saveToDatabase(username, password);
        } catch (Exception e) {
            throw new RegisterException("Failed to save user", e);
        }

        System.out.println("Registration succeeded: " + username);
    }

    private void saveToDatabase(String username, String password) throws Exception {
        // Simulate a database operation
        System.out.println("Saving user to database...");
    }
}

// 3. Test class
public class RegisterTest {
    public static void main(String[] args) {
        UserService service = new UserService();

        // Test various cases
        testRegister(service, null, "123456");       // Empty username
        testRegister(service, "ab", "123456");       // Username too short
        testRegister(service, "admin", "123456");    // Username already exists
        testRegister(service, "carol", "123");      // Password too short
        testRegister(service, "carol", "123456");   // Registration succeeds
    }

    private static void testRegister(UserService service, String username, String password) {
        try {
            service.register(username, password);
        } catch (RegisterException e) {
            String errorCode = e.getErrorCode();
            String msg = errorCode != null
                ? String.format("[%s] %s", errorCode, e.getMessage())
                : e.getMessage();
            System.out.println("Registration failed: " + msg);

            // Print the original exception if present
            if (e.getCause() != null) {
                System.out.println("  Cause: " + e.getCause().getMessage());
            }
        }
    }
}
```

**Output:**

    Registration failed: [E001] Username must not be empty
    Registration failed: [E002] Username length must be between 3 and 20
    Registration failed: [E004] Username already exists: admin
    Registration failed: [E003] Password must be at least 6 characters long
    Saving user to database...
    Registration succeeded: carol

***

## XI. Quick Reference

### 1. Keywords

| Keyword | Location | Purpose |
| --------- | ------------ | ------------- |
| `try` | Encloses code that may throw | Attempts execution |
| `catch` | After try | Catches and handles exceptions |
| `finally` | After try-catch | Executes regardless (resource cleanup) |
| `throw` | Inside a method body | Explicitly throws an exception object |
| `throws` | In a method declaration | Declares exceptions the method may throw |

### 2. Exception Categories

| Exception type | Superclass | Handling required? |
| ---------------- | --------- | -------- |
| Error | Throwable | Generally not handled |
| RuntimeException | Exception | Optional |
| Other Exception subclasses | Exception | **Required** |

### 3. Common Methods

| Method | Purpose |
| ------------------- | --------- |
| `getMessage()` | Retrieves the exception message |
| `toString()` | Retrieves the exception type and message |
| `printStackTrace()` | Prints the full stack trace |
| `getCause()` | Retrieves the original exception |
| `getStackTrace()` | Retrieves the stack-trace element array |
| `getSuppressed()` | Retrieves suppressed exceptions |

### 4. Choosing an Exception Handling Approach

| Situation | Recommendation |
| ------- | ------------------ |
| Exception can be handled | Handle with try-catch |
| Exception cannot be handled | Propagate with throws |
| Resources need closing | try-with-resources |
| Argument validation fails | throw an unchecked exception |
| Business-logic error | Custom unchecked exception |
| Caller must explicitly handle it | Custom checked exception |
