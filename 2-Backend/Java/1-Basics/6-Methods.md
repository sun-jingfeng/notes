## I. Introduction to Methods

### 1. What Is a Method?

A method is a **block of code with a distinct function** that can be called repeatedly.

    Method = a functional module
         = a reusable tool
         = an encapsulated block of code

### 2. Why Use Methods?

```java
// ❌ Without methods: duplicated code
System.out.println("====================");
System.out.println("   Welcome");
System.out.println("====================");

// ... Other code ...

System.out.println("====================");
System.out.println("   Welcome");
System.out.println("====================");

// ✅ With methods: code reuse
public static void welcome() {
    System.out.println("====================");
    System.out.println("   Welcome");
    System.out.println("====================");
}

// Call twice
welcome();
welcome();
```

### 3. Benefits of Methods

| Benefit       | Description         |
| -------- | ---------- |
| **Code reuse** | Write once, use repeatedly    |
| **Clear structure** | Modular functionality is easier to understand |
| **Easy maintenance** | Change one place to affect every call  |
| **Easier debugging** | Locate problems more precisely    |

***

## II. Basic Method Definitions and Calls

### 1. The Simplest Method Definition

```java
public static void methodName() {
    // Method body (code to execute)
}
```

### 2. Calling a Method

```java
methodName();
```

### 3. Complete Example

```java
public class MethodDemo {
    public static void main(String[] args) {
        // Call the method (may be called repeatedly)
        printLine();
        System.out.println("Content");
        printLine();
    }

    // Define the method
    public static void printLine() {
        System.out.println("====================");
    }
}
```

**Output:**

    ====================
    Content
    ====================

### 4. Where Methods Are Defined

```java
public class MethodDemo {

    // Define methods inside a class, at the same level as main
    public static void method1() {
        System.out.println("Method 1");
    }

    public static void main(String[] args) {
        method1();  // Call a method
        method2();  // Can call a method declared later
    }

    // Declaration order does not affect calls
    public static void method2() {
        System.out.println("Method 2");
    }
}
```

### 5. Considerations

```java
// ❌ Incorrect: methods cannot be nested inside methods
public static void main(String[] args) {
    public static void test() {  // Compile error!
    }
}

// ✅ Correct: methods are declared at the same level
public static void main(String[] args) {
    test();
}

public static void test() {
}
```

***

## III. Method Execution Flow

### 1. Execution Flow Diagram

    main starts
        ↓
    Code 1
        ↓
    Call method1() ──────→ Enter method1()
        ↓                       ↓
    (Pause until return)     Execute method1()'s code
        ↓                       ↓
    ←────────────────── method1() finishes and returns
        ↓
    Code 2
        ↓
    main ends

### 2. Code Example

```java
public class FlowDemo {
    public static void main(String[] args) {
        System.out.println("1. main starts");

        method1();  // Call the method and transfer execution

        System.out.println("4. main ends");
    }

    public static void method1() {
        System.out.println("2. method1 starts");
        System.out.println("3. method1 ends");
    }
}
```

**Output:**

    1. main starts
    2. method1 starts
    3. method1 ends
    4. main ends

### 3. Methods Calling Other Methods

```java
public class FlowDemo2 {
    public static void main(String[] args) {
        System.out.println("1. main starts");
        methodA();
        System.out.println("6. main ends");
    }

    public static void methodA() {
        System.out.println("2. methodA starts");
        methodB();  // A calls B
        System.out.println("5. methodA ends");
    }

    public static void methodB() {
        System.out.println("3. methodB starts");
        System.out.println("4. methodB ends");
    }
}
```

**Output:**

    1. main starts
    2. methodA starts
    3. methodB starts
    4. methodB ends
    5. methodA ends
    6. main ends

### 4. The Method Call Stack

    Call stack changes (last in, first out):

    Time 1: [main]
    Time 2: [main, methodA]
    Time 3: [main, methodA, methodB]
    Time 4: [main, methodA] (methodB finishes and is popped)
    Time 5: [main] (methodA finishes and is popped)
    Time 6: [] (main finishes and is popped)

### 5. Stack Overflow (StackOverflowError)

Stack overflow occurs when method calls become too deeply nested and exceed the stack's memory limit.

```java
// Infinite recursion causes stack overflow
public static void infiniteCall() {
    infiniteCall();  // Calls itself endlessly
}

// Result:
// Exception in thread "main" java.lang.StackOverflowError
```

**How the stack overflows:**

    The call stack keeps growing:
    [main, infiniteCall]
    [main, infiniteCall, infiniteCall]
    [main, infiniteCall, infiniteCall, infiniteCall]
    ... (continues until it exceeds the stack memory limit)
    → StackOverflowError

**How to avoid it:**

*   Ensure recursion has a base case
*   Avoid excessively deep call chains
*   Replace recursion with a loop where appropriate

***

## IV. Methods with Parameters

### 1. Why Use Parameters?

```java
// Problem: can print only a fixed number of times
public static void printHello() {
    for (int i = 0; i < 3; i++) {
        System.out.println("Hello");
    }
}

// Solution: use a parameter to control the count
public static void printHello(int count) {
    for (int i = 0; i < count; i++) {
        System.out.println("Hello");
    }
}
```

### 2. Declaration Syntax

```java
// One parameter
public static void methodName(DataType parameterName) {
    // Method body
}

// Multiple parameters
public static void methodName(DataType parameter1, DataType parameter2) {
    // Method body
}
```

### 3. Call Syntax

```java
methodName(argument);
methodName(argument1, argument2);
```

### 4. Parameters and Arguments

| Concept     | Description              | Example                               |
| ------ | --------------- | -------------------------------- |
| **Parameter** | A variable declared in the method definition (formal parameter)  | a and b in `void add(int a, int b)` |
| **Argument** | A value passed when calling the method (actual parameter) | 10 and 20 in `add(10, 20)`          |

### 5. Usage Example

```java
public class ParamDemo {
    public static void main(String[] args) {
        // Call a method with arguments
        sayHello("张三");
        sayHello("李四");

        // Multiple arguments
        add(10, 20);

        // Use variables as arguments
        String name = "王五";
        sayHello(name);
    }

    // One parameter
    public static void sayHello(String name) {
        System.out.println("Hello, " + name);
    }

    // Two parameters
    public static void add(int a, int b) {
        int sum = a + b;
        System.out.println(a + " + " + b + " = " + sum);
    }
}
```

### 6. Parameter Passing Is Pass-by-Value

**Java always passes arguments by value (it passes a copy of the value).**

#### Primitive Types: A Copy of the Value

```java
public static void main(String[] args) {
    int num = 10;
    change(num);
    System.out.println(num);  // Still 10
}

public static void change(int num) {
    num = 20;  // Changes the copy, not the original
}
```

    Memory diagram:
    main:  num = 10  ──→  change:  num = 10 (copy)
                                        ↓
                                   num = 20 (modify the copy)
    main:  num = 10 (unchanged)

#### Reference Types: A Copy of the Reference Value

```java
public static void main(String[] args) {
    int[] arr = {10, 20, 30};
    change(arr);
    System.out.println(arr[0]);  // 100 (changed)
}

public static void change(int[] arr) {
    arr[0] = 100;  // Use the reference to modify heap data
}
```

    Memory diagram:
    main:  arr = 0x001 ──→ Heap: [10, 20, 30]
              ↓
    change: arr = 0x001 (reference copy)
              ↓
           arr[0] = 100 ──→ Heap: [100, 20, 30]

    main:  arr[0] = 100 (heap data changed)

#### Reference Types: Reassignment Does Not Change the Original Reference

```java
public static void main(String[] args) {
    int[] arr = {10, 20, 30};
    changeRef(arr);
    System.out.println(arr[0]);  // 10 (unchanged)
}

public static void changeRef(int[] arr) {
    arr = new int[]{100, 200, 300};  // Create a new object; redirect only the copied reference
}
```

    Memory diagram:
    main:  arr = 0x001 ──→ Heap 0x001: [10, 20, 30]
              ↓
    change: arr = 0x001 (reference copy)
              ↓
           arr = 0x002 ──→ Heap 0x002: [100, 200, 300] (new object)

    main:  arr = 0x001 (still refers to the original object)

### 7. Parameter Passing Summary

| Parameter type | What is passed  | Effect of modifying the parameter      |
| ---- | ----- | ------------ |
| Primitive | A copy of the value  | Does not affect the argument        |
| Reference | A copy of the reference | Changing the object's contents affects the original object |
| Reference | A copy of the reference | Reassignment does not affect the original reference   |

**Memory aid**: Java is always pass-by-value; for reference types, the copied value is a reference.

***

## V. Methods with Return Values

### 1. Why Return a Value?

```java
// Problem: the calculated result can only be used inside the method
public static void add(int a, int b) {
    int sum = a + b;
    System.out.println(sum);  // Only prints; cannot give the result to the caller
}

// Solution: return the result to the caller
public static int add(int a, int b) {
    int sum = a + b;
    return sum;  // Return the result
}
```

### 2. Declaration Syntax

```java
public static ReturnType methodName(parameterList) {
    // Method body
    return value;
}
```

**Explanation:**

*   `ReturnType`: The type returned by the method (int, double, String, etc.)
*   `return`: Ends the method and returns data
*   `value`: The actual value to return; must match the return type

### 3. Call Syntax

```java
// Option 1: Call directly (not recommended; ignores the return value)
methodName(arguments);

// Option 2: Assign the result (recommended)
DataType variableName = methodName(arguments);

// Option 3: Print the result
System.out.println(methodName(arguments));

// Option 4: Pass the result to another method
otherMethod(methodName(arguments));
```

### 4. Usage Example

```java
public class ReturnDemo {
    public static void main(String[] args) {
        // Option 1: Call directly (not recommended)
        add(10, 20);  // Return value discarded

        // Option 2: Assign the result (recommended)
        int result = add(10, 20);
        System.out.println("Result: " + result);

        // Option 3: Print the result
        System.out.println("Result: " + add(30, 40));

        // Option 4: Pass the result to another method
        int max = Math.max(add(10, 20), add(5, 15));

        // Use the return value in another calculation
        int sum1 = add(10, 20);
        int sum2 = add(30, 40);
        int total = sum1 + sum2;
        System.out.println("Total: " + total);
    }

    // Method with a return value
    public static int add(int a, int b) {
        int sum = a + b;
        return sum;
    }
}
```

### 5. What return Does

```java
// 1. Returns data
public static int getMax(int a, int b) {
    return (a > b) ? a : b;
}

// 2. Ends a method (also usable in void methods)
public static void printPositive(int num) {
    if (num < 0) {
        return;  // End the method early
    }
    System.out.println(num);
}

// 3. Code after return does not execute
public static int test() {
    return 10;
    // System.out.println("Does not execute");  // Compile error
}
```

### 6. Examples of Return Types

```java
// Return int
public static int getInt() {
    return 10;
}

// Return double
public static double getDouble() {
    return 3.14;
}

// Return boolean
public static boolean getBoolean() {
    return true;
}

// Return String
public static String getString() {
    return "Hello";
}

// Return an array
public static int[] getArray() {
    return new int[]{1, 2, 3};
}

// Return an object
public static User getUser() {
    return new User("张三", 18);
}
```

***

## VI. General Method Declaration Syntax

### 1. Full Syntax

```java
modifiers ReturnType methodName(ParameterType parameter1, ParameterType parameter2, ...) {
    methodBody;
    return value;
}
```

### 2. Parts of a Method

| Part         | Description                     | Example                      |
| ---------- | ---------------------- | ----------------------- |
| **Modifiers**    | Use `public static` for now  | `public static`         |
| **Return type**  | The returned data type; `void` if there is no return value | `int`, `void`, `String` |
| **Method name**    | Identifier in lowerCamelCase              | `add`, `getUserName`    |
| **Parameter list**   | Separate parameters with commas; leave empty for no parameters        | `(int a, int b)`, `()`  |
| **Method body**    | Code to execute                 | `int sum = a + b;`      |
| **return** | Return data and end the method              | `return sum;`           |

### 3. Method Categories

| Type         | Declaration                                        | Call                       |
| ---------- | ----------------------------------------- | ------------------------ |
| **No parameters, no return value** | `void sayHello() { }`                     | `sayHello();`            |
| **Parameters, no return value** | `void sayHello(String name) { }`          | `sayHello("张三");`        |
| **No parameters, with a return value** | `int getNumber() { return 10; }`          | `int n = getNumber();`   |
| **Parameters and a return value** | `int add(int a, int b) { return a + b; }` | `int sum = add(10, 20);` |

### 4. Tips for Defining Methods

**Decide two things:**

1.  **Return type**: What type of data should the method return?
2.  **Parameter list**: What data does the method need to do its job?

```java
// Example: check whether two numbers are equal
// Analysis:
// 1. Return type: boolean (equal/not equal)
// 2. Parameters: two ints (the numbers to compare)

public static boolean isEqual(int a, int b) {
    return a == b;
}
```

### 5. Common Method Templates

```java
// Template 1: Print (no return value)
public static void printData(DataType argument) {
    System.out.println(argument);
}

// Template 2: Calculate (returns a value)
public static ReturnType calculate(DataType argument1, DataType argument2) {
    // Calculation
    return result;
}

// Template 3: Test (returns boolean)
public static boolean isCondition(DataType argument) {
    // Test logic
    return trueOrFalse;
}

// Template 4: Retrieve (returns a value)
public static ReturnType getData() {
    // Retrieve data
    return data;
}

// Template 5: Convert (returns a value)
public static TargetType toXxx(SourceType argument) {
    // Conversion logic
    return convertedResult;
}
```

***

## VII. Method Considerations

### 1. Methods Run Only When Called

```java
public static void main(String[] args) {
    // method is not called, so it does not execute
    System.out.println("main method");
}

public static void method() {
    System.out.println("method method");  // Not printed
}
```

### 2. Methods Are Defined at the Same Level

```java
// ❌ Incorrect: cannot define a method inside another method
public static void method1() {
    public static void method2() {  // Compile error
    }
}

// ✅ Correct: define methods at the same level
public static void method1() {
}

public static void method2() {
}
```

### 3. Execution Order Does Not Depend on Declaration Order

```java
public static void main(String[] args) {
    method2();  // Can call a method declared later
    method1();
}

public static void method1() { }
public static void method2() { }
```

### 4. Return Types Must Match

```java
// ❌ Incorrect: incompatible return type
public static int getNumber() {
    return 3.14;  // Compile error: int required, double provided
}

// ❌ Incorrect: a void method cannot return data
public static void test() {
    return 10;  // Compile error
}

// ✅ Correct
public static double getNumber() {
    return 3.14;
}
```

### 5. A Method Returning a Value Needs return

```java
// ❌ Incorrect: missing return statement
public static int getNumber() {
    int num = 10;
    // Compile error: missing return statement
}

// ❌ Incorrect: not every path returns a value
public static int getMax(int a, int b) {
    if (a > b) {
        return a;
    }
    // Compile error: no return when a <= b
}

// ✅ Correct: every path returns a value
public static int getMax(int a, int b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}

// ✅ More concise form
public static int getMax(int a, int b) {
    return (a > b) ? a : b;
}
```

### 6. No Unreachable Code After return

```java
// ❌ Incorrect: code after return
public static int test() {
    return 10;
    System.out.println("Does not execute");  // Compile error: unreachable statement
}
```

### 7. Arguments Must Match

```java
public static void show(int a, String b) {
    System.out.println(a + ", " + b);
}

// Arguments must match in number, type, and order
show(10, "hello");     // ✅ Correct
// show(10);           // ❌ Incorrect argument count
// show("hello", 10);  // ❌ Incorrect argument order
// show(10, 20);       // ❌ Incorrect argument type
```

### 8. Considerations Summary

| Consideration                | Description              |
| ------------------- | --------------- |
| Methods run only when called            | A declaration without a call does not execute      |
| Methods cannot be nested            | Methods are defined at the same level       |
| Execution order is independent of declaration order         | Can call a method declared later     |
| A void method cannot return a value | An empty `return;` is allowed |
| Methods returning values need return      | Every branch must return  |
| No code after return       | Unreachable statement         |
| Arguments must match              | Number, type, and order must all match    |

***

## VIII. Method Overloading

### 1. What Is Method Overloading?

Method overloading means defining several methods **in the same class** with **the same name** but **different parameter lists**.

```java
// This is method overloading
public static int add(int a, int b) {
    return a + b;
}

public static int add(int a, int b, int c) {
    return a + b + c;
}

public static double add(double a, double b) {
    return a + b;
}
```

### 2. Requirements for Overloading

**Required:**

1.  The same class
2.  The same method name
3.  Different parameter lists (count, types, or order)

**Not determined by:**

*   Return type
*   Parameter names
*   Access modifiers

### 3. Ways Parameter Lists Can Differ

```java
// 1. Different parameter counts
public static void show(int a) { }
public static void show(int a, int b) { }

// 2. Different parameter types
public static void show(int a) { }
public static void show(double a) { }

// 3. Different parameter order
public static void show(int a, double b) { }
public static void show(double a, int b) { }
```

### 4. What Does Not Constitute Overloading

```java
// ❌ Different parameter names alone do not create an overload
public static void show(int a) { }
public static void show(int b) { }  // Compile error: duplicate definition

// ❌ Different return types alone do not create an overload
public static void show(int a) { }
public static int show(int a) { return a; }  // Compile error

// ❌ Different modifiers alone do not create an overload
public static void show(int a) { }
private static void show(int a) { }  // Compile error
```

### 5. Matching Overloaded Methods

When an overloaded method is called, the compiler matches in this order:

```java
public static void test(int a) {
    System.out.println("int");
}

public static void test(double a) {
    System.out.println("double");
}

public static void test(Integer a) {
    System.out.println("Integer");
}

public static void test(int... a) {
    System.out.println("int...");
}

public static void main(String[] args) {
    test(10);    // int (exact match takes priority)
    test(10.0);  // double
    test(10L);   // double (automatic widening: long → double)
}
```

**Matching priority, highest first:**

1.  **Exact match**: Identical argument types
2.  **Automatic widening**: byte → short → int → long → float → double
3.  **Autoboxing/unboxing**: int ↔ Integer
4.  **Varargs**: Considered last

```java
test(10);        // Prefer test(int)
test((byte) 10); // No test(byte); widen to int and use test(int)
test(10L);       // No test(long); widen to double and use test(double)
```

### 6. Complete Example

```java
public class OverloadDemo {
    public static void main(String[] args) {
        // Call different overloads
        System.out.println(add(10, 20));          // int + int
        System.out.println(add(10, 20, 30));      // int + int + int
        System.out.println(add(10.5, 20.5));      // double + double
    }

    // Add two ints
    public static int add(int a, int b) {
        return a + b;
    }

    // Add three ints
    public static int add(int a, int b, int c) {
        return a + b + c;
    }

    // Add two doubles
    public static double add(double a, double b) {
        return a + b;
    }
}
```

### 7. Overloading in the JDK

```java
// println has many overloads
System.out.println();           // No arguments
System.out.println(10);         // int
System.out.println(3.14);       // double
System.out.println('A');        // char
System.out.println("Hello");    // String
System.out.println(true);       // boolean

// String.valueOf() methods
String.valueOf(10);        // int → String
String.valueOf(3.14);      // double → String
String.valueOf(true);      // boolean → String
String.valueOf(new char[]{'a', 'b'});  // char[] → String
```

### 8. Benefits of Overloading

```java
// Without overloading, different names are needed
public static int addInt(int a, int b) { return a + b; }
public static double addDouble(double a, double b) { return a + b; }
public static int addThreeInt(int a, int b, int c) { return a + b + c; }

// Overloading uses one common name and is more concise
public static int add(int a, int b) { return a + b; }
public static double add(double a, double b) { return a + b; }
public static int add(int a, int b, int c) { return a + b + c; }

// Callers remember only add; the compiler selects the matching method
```

### 9. Overloading vs. Overriding

| Comparison      | Overloading | Overriding |
| -------- | ------------ | ------------ |
| **Location**   | Within the same class        | Between subclass and superclass      |
| **Method name**  | Must match         | Must match         |
| **Parameter list** | Must differ         | Must match         |
| **Return type**  | Irrelevant           | Same type or a subtype of the superclass method's return type |
| **Access** | Irrelevant           | Cannot be more restrictive than the superclass method     |
| **Keyword**  | None            | @Override    |
| **Timing** | Compile time (static binding)    | Runtime (dynamic binding)    |

### 10. Overloading Quick Reference

| Condition     | Effect on overloading |
| ------ | ------ |
| Same method name  | ✅ Required |
| Different parameter count | ✅ Creates an overload |
| Different parameter types | ✅ Creates an overload |
| Different parameter order | ✅ Creates an overload |
| Different return type  | ❌ Does not distinguish overloads  |
| Different parameter names  | ❌ Does not distinguish overloads  |
| Different modifiers  | ❌ Do not distinguish overloads  |

***

## IX. Recursion

### 1. What Is Recursion?

Recursion is a programming technique in which **a method calls itself**.

```java
public static void method() {
    method();  // Call itself
}
```

### 2. Two Elements of Recursion

| Element       | Description          | Consequence if missing       |
| -------- | ----------- | ---------- |
| **Base case** | When recursion should stop    | Infinite recursion → stack overflow |
| **Recurrence relation** | How to reduce a large problem to smaller ones | Cannot calculate the correct result     |

### 3. Classic Example: Factorial

**Mathematical definition**: n! = n × (n-1) × ... × 2 × 1

```java
// Recursive implementation
public static int factorial(int n) {
    // Base case (0! = 1! = 1)
    if (n <= 1) {
        return 1;
    }
    // Recurrence: n! = n × (n-1)!
    return n * factorial(n - 1);
}

// Call
System.out.println(factorial(5));  // 120
```

**Execution process:**

    factorial(5)
    = 5 * factorial(4)
    = 5 * 4 * factorial(3)
    = 5 * 4 * 3 * factorial(2)
    = 5 * 4 * 3 * 2 * factorial(1)
    = 5 * 4 * 3 * 2 * 1
    = 120

### 4. Classic Example: Fibonacci Sequence

**Mathematical definition**: F(1)=1, F(2)=1, F(n)=F(n-1)+F(n-2)

```java
// Recursive implementation (less efficient)
public static int fib(int n) {
    if (n == 1 || n == 2) {
        return 1;
    }
    return fib(n - 1) + fib(n - 2);
}

// Optimization: cache results (memoized recursion)
public static int fibMemo(int n, int[] memo) {
    if (n == 1 || n == 2) {
        return 1;
    }
    if (memo[n] != 0) {
        return memo[n];  // Already calculated; return it directly
    }
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}
```

### 5. Classic Example: Recursive Sum

```java
// Calculate 1 + 2 + 3 + ... + n
public static int sum(int n) {
    if (n == 1) {
        return 1;
    }
    return n + sum(n - 1);
}

System.out.println(sum(100));  // 5050
```

### 6. Recursion vs. Loops

```java
// ========== Calculate factorial ==========

// Recursive approach
public static int factorialRecursive(int n) {
    if (n <= 1) return 1;
    return n * factorialRecursive(n - 1);
}

// Iterative approach
public static int factorialLoop(int n) {
    int result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}
```

| Comparison   | Recursion          | Loop     |
| ----- | ----------- | ------ |
| Conciseness | Concise; close to the mathematical definition   | More verbose   |
| Performance    | Lower (method-call overhead) | Higher     |
| Memory usage  | High (call stack)      | Low      |
| Stack overflow risk | Yes (excessively deep recursion)     | No      |
| Use case  | Tree/graph traversal and divide-and-conquer algorithms  | Simple repeated operations |

### 7. Recursion Considerations

```java
// ❌ Incorrect: no base case
public static void bad() {
    bad();  // Infinite recursion → StackOverflowError
}

// ❌ Incorrect: unreachable base case
public static void bad2(int n) {
    if (n == 0) return;
    bad2(n + 1);  // n never reaches 0
}

// ✅ Correct: a base case exists and every call moves toward it
public static void good(int n) {
    if (n <= 0) return;  // Base case
    good(n - 1);         // Decreasing n moves toward the base case
}
```

### 8. Recursion Use Cases

| Scenario     | Example          |
| ------ | ----------- |
| Mathematical calculations   | Factorials, Fibonacci numbers, exponentiation |
| Data structure traversal | Tree traversal and graph DFS |
| Divide-and-conquer algorithms   | Merge sort and quicksort   |
| Backtracking   | Eight queens and maze problems    |
| File operations   | Directory traversal        |

```java
// Traverse a directory (practical application)
public static void listFiles(File dir) {
    if (dir == null || !dir.exists()) return;

    File[] files = dir.listFiles();
    if (files == null) return;

    for (File file : files) {
        if (file.isDirectory()) {
            listFiles(file);  // Recursively traverse subdirectories
        } else {
            System.out.println(file.getAbsolutePath());
        }
    }
}
```

***

## X. Variable Arguments (Varargs)

### 1. What Are Varargs?

Varargs, introduced in JDK 5, let a method receive **a variable number** of arguments.

**Syntax**: `DataType...` (three dots after the type)

```java
public static void show(int... nums) {
    // nums is an int[] array
}
```

### 2. Why Use Varargs?

```java
// ❌ Without varargs: several overloads are needed
public static int add(int a, int b) {
    return a + b;
}

public static int add(int a, int b, int c) {
    return a + b + c;
}

public static int add(int a, int b, int c, int d) {
    return a + b + c + d;
}

// ✅ With varargs: one method is enough
public static int add(int... nums) {
    int sum = 0;
    for (int num : nums) {
        sum += num;
    }
    return sum;
}
```

### 3. Basic Usage

```java
public class VarargsDemo {
    public static void main(String[] args) {
        // Pass different numbers of arguments
        System.out.println(add());           // 0
        System.out.println(add(10));         // 10
        System.out.println(add(10, 20));     // 30
        System.out.println(add(10, 20, 30)); // 60
        System.out.println(add(1, 2, 3, 4, 5)); // 15
    }

    public static int add(int... nums) {
        int sum = 0;
        for (int num : nums) {
            sum += num;
        }
        return sum;
    }
}
```

### 4. Varargs Are Arrays

**Varargs are implemented as arrays** and compiled into array parameters.

```java
public static void test(int... nums) {
    // nums is an int[] array
    System.out.println(nums.getClass().getName());  // [I (int array)
    System.out.println(nums.length);  // Array length

    // Use it like an array
    for (int i = 0; i < nums.length; i++) {
        System.out.println(nums[i]);
    }
}
```

### 5. Invocation Options

```java
public static void show(int... nums) {
    for (int num : nums) {
        System.out.print(num + " ");
    }
    System.out.println();
}

// Option 1: Pass multiple arguments
show(1, 2, 3);        // 1 2 3

// Option 2: Pass no arguments (0)
show();               // (empty)

// Option 3: Pass an array directly
int[] arr = {10, 20, 30};
show(arr);            // 10 20 30
```

### 6. Considerations

#### 1. The Varargs Parameter Must Come Last

```java
// ✅ Correct: varargs comes last
public static void method(String name, int... nums) { }

// ❌ Incorrect: varargs is not last
public static void method(int... nums, String name) { }
// Compile error: varargs parameter must be the last parameter
```

#### 2. Only One Varargs Parameter per Method

```java
// ✅ Correct: one varargs parameter
public static void method(int... nums) { }

// ❌ Incorrect: two varargs parameters
public static void method(int... nums, String... strs) { }
// Compile error
```

#### 3. No Arguments Produces an Empty Array, Not null

```java
public static void test(int... nums) {
    System.out.println(nums == null);  // false
    System.out.println(nums.length);   // 0
}

test();  // nums is an empty array [], not null
```

### 7. Combining Varargs with Other Parameters

```java
public class CombineDemo {
    public static void main(String[] args) {
        print("Numbers", 1, 2, 3, 4, 5);
        print("Scores", 90, 85, 95);
        print("Empty");
    }

    // Varargs must come last
    public static void print(String prefix, int... nums) {
        System.out.print(prefix + ": ");
        for (int num : nums) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}
```

**Output:**

    Numbers: 1 2 3 4 5
    Scores: 90 85 95
    Empty:

### 8. Varargs vs. Array Parameters

| Comparison      | Varargs `int... nums` | Array parameter `int[] nums`            |
| -------- | ------------------ | ---------------------------- |
| **Invocation** | `method(1, 2, 3)`  | `method(new int[]{1, 2, 3})` |
| **No arguments** | `method()` ✅       | ❌ Must pass an array or null                |
| **Passing an array** | `method(arr)` ✅    | `method(arr)` ✅              |
| **Flexibility**  | More flexible                | More cumbersome                          |
| **Implementation**   | Compiled as an array            | Already an array                         |

### 9. Varargs in the JDK

```java
// Arrays.asList(): create a List
List<String> list = Arrays.asList("A", "B", "C");

// String.format(): format a string
String s = String.format("Name: %s, age: %d", "张三", 18);

// Collections.addAll(): add in bulk
List<String> list2 = new ArrayList<>();
Collections.addAll(list2, "A", "B", "C");

// System.out.printf(): formatted output
System.out.printf("Name: %s, age: %d%n", "张三", 18);
```

### 10. Varargs Quick Reference

| Rule      | Description                  |
| ------- | ------------------- |
| **Syntax**  | `DataType...` (three dots after the type)  |
| **Position**  | Must be last in the parameter list           |
| **Count**  | Only one varargs parameter per method       |
| **Implementation**  | Compiled as an array             |
| **Arguments**  | Pass zero, one, multiple values, or an array    |
| **No arguments** | An empty array `[]`, not `null` |

***

## XI. Quick Reference

### 1. Method Declaration Syntax

```java
modifiers ReturnType methodName(ParameterType parameter1, ParameterType parameter2, ...) {
    methodBody;
    return value;
}
```

### 2. Four Method Categories

| Type     | Syntax                | Example                                        |
| ------ | ----------------- | ----------------------------------------- |
| No parameters, no return value | `void methodName()`      | `void sayHello() { }`                     |
| Parameters, no return value | `void methodName(Type parameter)` | `void sayHello(String name) { }`          |
| No parameters, with a return value | `Type methodName()`        | `int getNumber() { return 10; }`          |
| Parameters and a return value | `Type methodName(Type parameter)`   | `int add(int a, int b) { return a + b; }` |

### 3. Calling Methods

| Approach | Syntax             | Use case       |
| ---- | -------------- | ---------- |
| Direct call | `methodName();`       | void methods    |
| Assignment | `variable = methodName();`  | Methods returning a value (recommended) |
| Output | `System.out.println(methodName());` | Methods returning a value     |

### 4. Parameter Passing Rules

| Parameter type | What is passed   | Affects the original?   |
| ---- | ------ | ------- |
| Primitive | Copy of the value   | No     |
| Reference | Copy of the reference value | Changing contents does affect it |
| Reference | Copy of the reference value | Reassignment does not affect it |

### 5. Overloading Conditions

| Condition     | Effect on overloading |
| ------ | ------ |
| Same method name  | ✅ Required |
| Different parameter count | ✅ Creates an overload |
| Different parameter types | ✅ Creates an overload |
| Different parameter order | ✅ Creates an overload |
| Different return type  | ❌ Does not distinguish overloads  |
| Different parameter names  | ❌ Do not distinguish overloads  |

### 6. Elements of Recursion

| Element   | Description        | Example (factorial)                 |
| ---- | --------- | ---------------------- |
| Base case | When to stop    | `if (n <= 1) return 1` |
| Recurrence relation | Reduce a large problem to smaller ones | `n * factorial(n-1)`   |

### 7. Varargs Rules

| Rule | Description               |
| -- | ---------------- |
| Syntax | `Type...` (three dots after the type) |
| Position | Must be last in the parameter list        |
| Count | Only one varargs parameter per method    |
| Implementation | Compiled as an array          |
| Arguments | Pass zero, one, multiple values, or an array |

### 8. Checklist

| Consideration                | Description              |
| ------------------- | --------------- |
| Methods run only when called            | Declaring without calling does not execute them      |
| Methods cannot be nested            | Methods are declared at the same level       |
| void methods cannot return a value | An empty `return;` is allowed |
| Methods returning values need return      | Every branch must return  |
| No code after return       | Unreachable statement         |
| Arguments must match              | Number, type, and order must all match    |
| Recursion needs a base case           | Otherwise the stack overflows           |
