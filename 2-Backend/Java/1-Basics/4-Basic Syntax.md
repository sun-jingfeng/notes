## I. Comments

### 1. What Is a Comment?

Comments explain code and **are neither compiled nor executed**.

**Purposes:**

*   Improve readability
*   Help others understand the code
*   Make future maintenance easier
*   Temporarily disable code

### 2. Three Comment Types

#### (1) Line Comments

```java
// This is a line comment
int age = 18;  // A comment can also follow code
```

#### (2) Block Comments

```java
/*
   This is a block comment
   It may span multiple lines
   Block comments cannot be nested
*/
```

#### (3) Documentation Comments

```java
/**
 * This is a documentation comment
 * The javadoc tool can generate API documentation from it
 *
 * @author AuthorName
 * @version 1.0
 */
public class Demo {
    /**
     * Method description
     * @param a Parameter description
     * @return Return value description
     */
    public int add(int a, int b) {
        return a + b;
    }
}
```

### 3. Comment Types Compared

| Type   | Syntax          | Characteristics        |
| ---- | ----------- | --------- |
| Line comment | `// Comment`     | Comments out one line      |
| Block comment | `/* Comment */`  | Multiple lines; cannot be nested |
| Documentation comment | `/** Comment */` | Can generate API documentation  |

### 4. Common Javadoc Tags

| Tag            | Description        | Where used    |
| ------------- | --------- | ------- |
| `@author`     | Author        | Class       |
| `@version`    | Version        | Class       |
| `@since`      | Version in which introduced   | Class, method    |
| `@param`      | Parameter description      | Method      |
| `@return`     | Return value description     | Method      |
| `@throws`     | Thrown exception description    | Method      |
| `@exception`  | Same as @throws | Method      |
| `@see`        | Reference link      | Class, method    |
| `@deprecated` | Deprecated       | Class, method, field |
| `@link`       | Inline link      | Anywhere    |
| `@code`       | Code formatting      | Anywhere    |

```java
/**
 * User service class
 *
 * @author zhangsan
 * @version 1.0
 * @since 1.0
 * @see UserDao
 */
public class UserService {

    /**
     * Find a user by ID
     *
     * @param id User ID; must not be null
     * @return The user object, or null if not found
     * @throws IllegalArgumentException If id is negative
     * @deprecated Use {@link #findById(Long)} instead
     * @see User
     */
    @Deprecated
    public User getUser(Long id) {
        if (id < 0) {
            throw new IllegalArgumentException("id must not be negative");
        }
        return null;
    }
}
```

### 5. IDEA Comment Shortcuts

| Shortcut                | Action                |
| ------------------ | ----------------- |
| `Ctrl + /`         | Toggle line comment         |
| `Ctrl + Shift + /` | Toggle block comment         |
| `/** + Enter`      | Generate documentation comment            |
| `Ctrl + Q`         | View documentation (Quick Doc) |

***

## II. Keywords

### 1. What Is a Keyword?

Keywords are **predefined words with special meanings** in Java.

**Characteristics:**

*   All lowercase
*   Highlighted in the editor
*   Cannot be used as identifiers (variable names, class names, etc.)

### 2. Complete Java Keyword List (50)

#### (1) Data Types (8)

```java
byte  short  int  long  float  double  char  boolean
```

#### (2) Access Control (3)

```java
public  protected  private
```

#### (3) Classes, Methods, and Variable Modifiers (13)

```java
class       // Define a class
interface   // Define an interface
enum        // Define an enum
extends     // Inherit
implements  // Implement an interface
new         // Create an object
static      // Static
final       // Final
abstract    // Abstract
void        // No return value
native      // Native method
strictfp    // Strict floating-point behavior
transient   // Transient: omitted during serialization
```

#### (4) Control Flow (12)

```java
if  else  switch  case  default  // Conditional branches
for  while  do                    // Loops
break  continue  return           // Jumps
```

#### (5) Exception Handling (5)

```java
try  catch  finally  throw  throws
```

#### (6) Object-Related (4)

```java
this        // Reference to the current object
super       // Superclass reference
instanceof  // Test an object's type
new         // Create an object
```

#### (7) Thread-Related (2)

```java
synchronized  // Synchronization
volatile      // Visibility
```

#### (8) Package-Related (2)

```java
package  import
```

#### (9) Assertions (1)

```java
assert  // Assertion
```

### 3. Reserved Words (2)

```java
goto  const  // Reserved but unused; cannot be identifiers
```

### 4. Special Literals (Not Keywords)

```java
// These are literals, not keywords!
null   // Null reference
true   // Boolean true
false  // Boolean false
```

### 5. Keyword Categories at a Glance

    ┌────────────────────────────────────────────────────────────┐
    │                     Java Keyword Categories                │
    ├────────────────────────────────────────────────────────────┤
    │ Data types: byte short int long float double char boolean  │
    ├────────────────────────────────────────────────────────────┤
    │ Access: public protected private                           │
    ├────────────────────────────────────────────────────────────┤
    │ Classes: class interface enum extends implements abstract  │
    ├────────────────────────────────────────────────────────────┤
    │ Modifiers: static final native strictfp transient volatile │
    ├────────────────────────────────────────────────────────────┤
    │ Objects: new this super instanceof                         │
    ├────────────────────────────────────────────────────────────┤
    │ Methods: void return                                       │
    ├────────────────────────────────────────────────────────────┤
    │ Control flow: if else switch case default                  │
    │          for while do break continue                       │
    ├────────────────────────────────────────────────────────────┤
    │ Exceptions: try catch finally throw throws                 │
    ├────────────────────────────────────────────────────────────┤
    │ Packages: package import                                   │
    ├────────────────────────────────────────────────────────────┤
    │ Other: synchronized assert                                 │
    ├────────────────────────────────────────────────────────────┤
    │ Reserved: goto const                                       │
    ├────────────────────────────────────────────────────────────┤
    │ Literals (not keywords): true false null                   │
    └────────────────────────────────────────────────────────────┘

***

## III. Literals

### 1. What Is a Literal?

A literal is a **fixed value written directly in code**, the notation used to represent data in a program.

### 2. Literal Categories

#### (1) Integer Literals

```java
int a = 10;          // Decimal
int b = 0b1010;      // Binary (0b/0B prefix)
int c = 012;         // Octal (0 prefix)
int d = 0xA;         // Hexadecimal (0x/0X prefix)
long e = 100L;       // long (L/l suffix; uppercase L recommended)

// JDK 7+: underscores in numeric literals improve readability
int million = 1_000_000;           // One million
long cardNumber = 1234_5678_9012_3456L;
int binary = 0b1010_1010_1010;
```

#### (2) Floating-Point Literals

```java
double a = 3.14;     // Decimal literals default to double
float b = 3.14F;     // float requires F/f
double c = 5.12e2;   // Scientific notation: 512.0
double d = 5.12E-2;  // Scientific notation: 0.0512

// JDK 7+: numeric underscores
double price = 1_234_567.89;
```

#### (3) Character Literals

```java
char a = 'A';        // One character in single quotes
char b = '中';       // Chinese character
char c = '\n';       // Escape: newline
char d = '\t';       // Escape: tab
char e = '\\';       // Escape: backslash
char f = '\'';       // Escape: single quote

// Unicode notation
char g = '\u0041';   // 'A' (hexadecimal Unicode)
char h = 65;         // 'A' (ASCII value)
```

#### (4) String Literals

```java
String a = "Hello";       // String in double quotes
String b = "你好";        // Chinese string
String c = "";            // Empty string
String d = "First line\nSecond line"; // Contains an escape sequence
```

#### (5) Text Blocks (JDK 15+)

```java
// Traditional syntax: multiline string
String html = "<html>\n" +
              "    <body>\n" +
              "        <h1>Hello</h1>\n" +
              "    </body>\n" +
              "</html>";

// JDK 15+ text block: clearer
String htmlBlock = """
        <html>
            <body>
                <h1>Hello</h1>
            </body>
        </html>
        """;

// JSON example
String json = """
        {
            "name": "张三",
            "age": 18,
            "city": "北京"
        }
        """;

// SQL example
String sql = """
        SELECT id, name, age
        FROM users
        WHERE age > 18
        ORDER BY name
        """;
```

**Text block characteristics:**

*   Enclosed by three double quotes `"""`
*   Automatically handles newlines and indentation
*   The opening `"""` must be followed by a newline
*   Preserves relative indentation and removes shared leading spaces

#### (6) Boolean Literals

```java
boolean a = true;    // True
boolean b = false;   // False
```

#### (7) The Null Literal

```java
String s = null;     // Null value (reference types only)
// int a = null;     // ❌ Primitive types cannot be null
```

### 3. Common Escape Sequences

| Escape sequence | Meaning       | Unicode |
| ---- | -------- | ------- |
| `\n` | Newline       | \u000A  |
| `\t` | Tab | \u0009  |
| `\r` | Carriage return       | \u000D  |
| `\\` | Backslash      | \u005C  |
| `\'` | Single quote      | \u0027  |
| `\"` | Double quote      | \u0022  |
| `\b` | Backspace       | \u0008  |
| `\f` | Form feed       | \u000C  |

### 4. Literal Reference Table

| Type   | Example                   | Description                |
| ---- | -------------------- | ----------------- |
| Integer   | `10`, `100L`, `0xFF` | Defaults to int; L indicates long     |
| Floating-point  | `3.14`, `3.14F`      | Defaults to double; F indicates float |
| Character   | `'A'`, `'\n'`        | Single character in single quotes          |
| String  | `"Hello"`            | Double quotes               |
| Text block  | `""" ... """`        | JDK 15+ multiline string     |
| Boolean   | `true`, `false`      | Only two values             |
| Null    | `null`               | Null value for reference types           |
| Numeric separators | `1_000_000`          | JDK 7+; improve readability      |

***

## IV. Variables

### 1. What Is a Variable?

A variable is a storage location in memory used to **hold data that can change**.

### 2. Variable Declaration Syntax

```java
DataType variableName = initialValue;
```

**Examples:**

```java
int age = 18;           // Integer variable
double price = 99.5;    // Decimal variable
char gender = '男';     // Character variable
String name = "张三";   // String variable
boolean flag = true;    // Boolean variable
```

### 3. Using Variables

```java
// Declare first, assign later
int age;
age = 18;

// Assign at declaration (recommended)
int score = 95;

// Change a variable's value
int num = 10;
num = 20;  // Change to 20

// Use variables in calculations
int a = 10;
int b = 20;
int sum = a + b;  // 30

// Declare multiple variables of the same type
int x = 1, y = 2, z = 3;
```

### 4. Fields vs. Local Variables

| Difference       | Field                | Local variable        |
| -------- | ------------------- | ----------- |
| **Declaration location** | Inside a class, outside methods              | Inside a method/block, or as a parameter |
| **Default value**  | Has a default value                | No default; must be initialized  |
| **Scope**  | Entire class                 | Enclosing method/block   |
| **Memory location** | Heap (with the object)            | Stack (with the method)    |
| **Lifetime** | From object creation to destruction            | From method invocation to completion    |
| **Modifiers**  | May use public/private, etc. | Cannot use access modifiers    |

```java
public class Demo {
    // Field (instance variable)
    int age;                    // Default: 0
    String name;                // Default: null
    private double salary;      // Access modifiers are allowed

    // Static field (class variable)
    static int count;

    public void method() {
        // Local variable
        int num;                // No default value
        // System.out.println(num);  // ❌ Not initialized
        num = 10;               // Must assign before use
        System.out.println(num); // ✅ Correct

        // Parameters are also local variables
    }

    public void method2(int param) {  // param is a local variable
        System.out.println(param);
    }
}
```

### 5. Type Inference with var (JDK 10+)

```java
// JDK 10+ local variable type inference
var age = 18;              // Inferred as int
var name = "张三";          // Inferred as String
var list = new ArrayList<String>();  // Inferred as ArrayList<String>
var map = new HashMap<String, Integer>();

// var is limited to local variables
// ❌ Invalid uses:
// var field;              // Requires an initializer
// var obj = null;         // Cannot infer from null
// var arr = {1, 2, 3};    // Cannot infer from an array initializer

// ✅ Correct array syntax:
var arr = new int[]{1, 2, 3};

// var often simplifies complex type declarations
// Traditional declaration
Map<String, List<Integer>> map1 = new HashMap<String, List<Integer>>();
// Simplified with var
var map2 = new HashMap<String, List<Integer>>();

// Use in a for loop
for (var i = 0; i < 10; i++) {
    System.out.println(i);
}

// Enhanced for loop
var list = List.of("A", "B", "C");
for (var item : list) {
    System.out.println(item);
}
```

**Rules for var:**

| Rule         | Description                     |
| ---------- | ---------------------- |
| Local variables only     | Cannot be used for fields, method parameters, or return types      |
| Requires an initializer     | Initialize at declaration so the compiler can infer the type     |
| Cannot initialize with null   | `var x = null;` provides no type to infer |
| Cannot initialize with a lambda | An explicit functional interface type is needed            |

### 6. Variable Considerations

```java
// ❌ Error 1: local variable used before assignment
int age;
System.out.println(age);  // Compile error

// ❌ Error 2: duplicate declaration
int num = 10;
int num = 20;  // Compile error

// ❌ Error 3: outside the scope
{
    int x = 10;
}
System.out.println(x);  // Compile error: x is not in scope
```

### 7. Variable Scope

```java
public class Demo {
    public static void main(String[] args) {
        int a = 10;  // a's scope: the entire main method

        {
            int b = 20;  // b's scope: only this {} block
            System.out.println(a);  // ✅ Accessible
            System.out.println(b);  // ✅ Accessible
        }

        System.out.println(a);  // ✅ Accessible
        System.out.println(b);  // ❌ Compile error
    }
}
```

***

## V. Identifiers

### 1. What Is an Identifier?

Identifiers are names chosen by programmers for **classes, methods, variables**, and other program elements.

### 2. Naming Rules (Mandatory)

| Rule  | Description                   | Example                            |
| --- | -------------------- | ----------------------------- |
| Characters  | Letters, digits, underscores `_`, and dollar signs `$$` | `age`, `age2`, `_age`, `$age` |
| First character  | Cannot be a digit              | ❌ `2age`                      |
| Keywords | Cannot use keywords              | ❌ `class`, `int`              |
| Case | Strictly case-sensitive              | `Age` ≠ `age`                 |
| Length  | Unlimited (but prefer concise, meaningful names)        | -                             |

### 3. Naming Conventions (Recommended)

| Type      | Convention      | Example                        |
| ------- | ------- | ------------------------- |
| **Package name**  | All lowercase     | `com.itheima.demo`        |
| **Class name**  | UpperCamelCase     | `Student`, `UserService`  |
| **Interface name** | UpperCamelCase     | `Runnable`, `Comparable`  |
| **Method name** | lowerCamelCase     | `getUserById`, `addUser`  |
| **Variable name** | lowerCamelCase     | `studentName`, `maxValue` |
| **Constant name** | UPPERCASE_WITH_UNDERSCORES | `MAX_VALUE`, `PI`         |

### 4. Naming Examples

```java
// Package name: all lowercase
package com.itheima.demo;

// Class name: UpperCamelCase
public class StudentManager {

    // Constants: UPPERCASE_WITH_UNDERSCORES
    public static final int MAX_AGE = 150;
    public static final String DEFAULT_NAME = "Unnamed";

    // Variable name: lowerCamelCase
    private String studentName;
    private int currentAge;

    // Method name: lowerCamelCase
    public void addStudent() {
        int currentYear = 2025;
    }

    // Boolean variables/methods: usually begin with is/has/can
    private boolean isActive;
    private boolean hasPermission;

    public boolean isEmpty() {
        return false;
    }
}
```

### 5. Use Meaningful Names

```java
// ❌ Poor names
int a = 18;
String s = "张三";
int n = 100;

// ✅ Good names
int age = 18;
String name = "张三";
int maxScore = 100;

// ❌ Excessive abbreviation
int stuNm = 10;      // Hard to understand
String usrAddr;      // Unclear

// ✅ Clear names
int studentNumber = 10;
String userAddress;
```

***

## VI. Data Types

### 1. Data Type Categories

    Data types
    ├─ Primitive types (8)
    │   ├─ Integers: byte, short, int, long
    │   ├─ Floating-point: float, double
    │   ├─ Character: char
    │   └─ Boolean: boolean
    │
    └─ Reference types
        ├─ Classes: String, Integer, custom classes, etc.
        ├─ Arrays
        ├─ Interfaces
        └─ Enums

### 2. Primitive Types in Detail

#### Integer Types

| Type      | Bytes | Bits | Range                   | Default value |
| ------- | -- | -- | -------------------- | --- |
| `byte`  | 1  | 8  | -128 \~ 127          | 0   |
| `short` | 2  | 16 | -32768 \~ 32767      | 0   |
| `int`   | 4  | 32 | -2³¹ \~ 2³¹-1 (approximately ±2.1 billion) | 0   |
| `long`  | 8  | 64 | -2⁶³ \~ 2⁶³-1        | 0L  |

#### Floating-Point Types

| Type       | Bytes | Bits | Range       | Precision     | Default value  |
| -------- | -- | -- | -------- | ------ | ---- |
| `float`  | 4  | 32 | ±3.4E38  | 6–7 digits   | 0.0F |
| `double` | 8  | 64 | ±1.7E308 | 15–16 digits | 0.0  |

#### Character Type

| Type     | Bytes | Bits | Range         | Default value      |
| ------ | -- | -- | ---------- | -------- |
| `char` | 2  | 16 | 0 \~ 65535 | '\u0000' |

#### Boolean Type

| Type        | Values           | Default value   |
| --------- | ------------ | ----- |
| `boolean` | true / false | false |

### 3. Usage Examples

```java
public class DataTypeDemo {
    public static void main(String[] args) {
        // Integer types
        byte b = 100;
        short s = 10000;
        int i = 100000;
        long l = 10000000000L;  // L is required

        // Floating-point types
        float f = 3.14F;        // F is required
        double d = 3.14;        // Defaults to double

        // Character type
        char c = 'A';
        char unicode = '\u4e2d';  // '中'

        // Boolean type
        boolean flag = true;

        // Reference type
        String name = "张三";
    }
}
```

### 4. Wrapper Classes

Each primitive type has a corresponding wrapper class for using its values as objects:

| Primitive type    | Wrapper class       | Example                     |
| ------- | --------- | ---------------------- |
| byte    | Byte      | `Byte b = 10;`         |
| short   | Short     | `Short s = 100;`       |
| int     | Integer   | `Integer i = 1000;`    |
| long    | Long      | `Long l = 10000L;`     |
| float   | Float     | `Float f = 3.14F;`     |
| double  | Double    | `Double d = 3.14;`     |
| char    | Character | `Character c = 'A';`   |
| boolean | Boolean   | `Boolean flag = true;` |

#### Autoboxing and Unboxing (JDK 5+)

```java
// Autoboxing: primitive → wrapper
Integer num = 100;       // Equivalent to Integer.valueOf(100)
Double price = 99.9;     // Equivalent to Double.valueOf(99.9)

// Auto-unboxing: wrapper → primitive
int n = num;             // Equivalent to num.intValue()
double p = price;        // Equivalent to price.doubleValue()

// Automatic unboxing during arithmetic
Integer a = 10;
Integer b = 20;
int sum = a + b;         // Unbox, then add

// Note: unboxing null throws NullPointerException
Integer x = null;
// int y = x;            // ❌ Throws NullPointerException at runtime
```

#### Common Wrapper Methods

```java
// String to primitive
int a = Integer.parseInt("123");
double b = Double.parseDouble("3.14");
boolean c = Boolean.parseBoolean("true");

// Primitive to string
String s1 = Integer.toString(100);
String s2 = String.valueOf(100);
String s3 = 100 + "";              // Convenient shorthand

// Get maximum/minimum values
System.out.println(Integer.MAX_VALUE);  // 2147483647
System.out.println(Integer.MIN_VALUE);  // -2147483648

// Radix conversion
System.out.println(Integer.toBinaryString(10));  // "1010"
System.out.println(Integer.toOctalString(10));   // "12"
System.out.println(Integer.toHexString(10));     // "a"

// Compare
System.out.println(Integer.compare(10, 20));     // -1 (less than)
System.out.println(Integer.compare(20, 10));     // 1 (greater than)
System.out.println(Integer.compare(10, 10));     // 0 (equal)
```

#### Integer Cache

```java
// Integer caches objects from -128 to 127
Integer a = 100;
Integer b = 100;
System.out.println(a == b);       // true (same cached object)

Integer c = 200;
Integer d = 200;
System.out.println(c == d);       // false (outside the cache range; different objects)
System.out.println(c.equals(d));  // true (equal values)

// Recommendation: compare wrappers with equals()
```

### 5. Type Conversion

#### (1) Automatic Conversion (Widening)

```java
// Smaller → larger type: automatic
byte b = 10;
int i = b;      // byte → int, automatic

int num = 100;
double d = num; // int → double, automatic

// Conversion rules:
// byte → short → int → long → float → double
//                 ↑
//               char
```

#### (2) Explicit Conversion (Narrowing)

```java
// Larger → smaller type: cast required
int i = 128;
byte b = (byte)i;  // Explicit cast; may lose precision

double d = 3.99;
int n = (int)d;    // Explicit cast; n = 3 (fraction truncated)
```

### 6. Type Conversion Considerations

```java
// 1. Floating-point to integer loses the fractional part
double d = 3.99;
int i = (int)d;  // i = 3

// 2. Larger range to smaller range may overflow
int big = 200;
byte b = (byte)big;  // b = -56 (overflow)

// 3. byte/short/char operands are promoted to int
byte b1 = 10;
byte b2 = 20;
// byte b3 = b1 + b2;  // ❌ Result type is int
int b3 = b1 + b2;      // ✅ Correct
byte b4 = (byte)(b1 + b2);  // ✅ Explicit cast

// 4. Characters can be converted to numbers
char c = 'A';
int code = c;  // code = 65 (Unicode code point)
```

### 7. Floating-Point Precision

```java
// Floating-point storage uses IEEE 754 and has precision limitations
System.out.println(0.1 + 0.2);           // 0.30000000000000004
System.out.println(0.1 + 0.2 == 0.3);    // false

// Solution 1: BigDecimal (recommended for monetary calculations)
import java.math.BigDecimal;
BigDecimal a = new BigDecimal("0.1");
BigDecimal b = new BigDecimal("0.2");
System.out.println(a.add(b));            // 0.3

// Solution 2: Compare within a tolerance
double x = 0.1 + 0.2;
double y = 0.3;
double epsilon = 1e-10;
System.out.println(Math.abs(x - y) < epsilon);  // true

// ❌ Avoid new BigDecimal(double)
BigDecimal bad = new BigDecimal(0.1);    // Still has a precision issue
// ✅ Use a string constructor or valueOf
BigDecimal good = new BigDecimal("0.1");
BigDecimal good2 = BigDecimal.valueOf(0.1);
```

### 8. char and Unicode

```java
// char uses UTF-16 and occupies 2 bytes
char a = 'A';           // Direct assignment
char b = 65;            // Unicode code point
char c = '\u0041';      // Unicode escape

// Common ASCII values
// 'A' ~ 'Z': 65 ~ 90
// 'a' ~ 'z': 97 ~ 122
// '0' ~ '9': 48 ~ 57

// Character arithmetic
char ch = 'A';
ch++;                   // ch = 'B'
System.out.println(ch + 1);   // 67 (promoted to int for arithmetic)
System.out.println((char)(ch + 1));  // 'C'

// Chinese character
char chinese = '中';
System.out.println((int)chinese);  // 20013
System.out.println('\u4e2d');      // 中

// Test character categories
System.out.println(Character.isLetter('A'));      // true
System.out.println(Character.isDigit('5'));       // true
System.out.println(Character.isUpperCase('A'));   // true
System.out.println(Character.toLowerCase('A'));   // 'a'
```

### 9. Number Bases and Conversion

```java
// Integer literal notation by radix
int decimal = 10;        // Decimal
int binary = 0b1010;     // Binary (0b/0B prefix)
int octal = 012;         // Octal (0 prefix)
int hex = 0xA;           // Hexadecimal (0x/0X prefix)

// Radix conversion methods
int num = 255;
System.out.println(Integer.toBinaryString(num));  // "11111111"
System.out.println(Integer.toOctalString(num));   // "377"
System.out.println(Integer.toHexString(num));     // "ff"

// Other bases to decimal
System.out.println(Integer.parseInt("1010", 2));   // 10 (binary to decimal)
System.out.println(Integer.parseInt("12", 8));     // 10 (octal to decimal)
System.out.println(Integer.parseInt("A", 16));     // 10 (hexadecimal to decimal)

// Arbitrary-base conversion
System.out.println(Integer.toString(100, 2));     // "1100100" (binary)
System.out.println(Integer.toString(100, 8));     // "144" (octal)
System.out.println(Integer.toString(100, 16));    // "64" (hexadecimal)
System.out.println(Integer.toString(100, 36));    // "2s" (base 36)
```

### 10. Common Reference Types

```java
// String
String name = "张三";
String greeting = "Hello" + " " + "World";  // String concatenation

// Arrays
int[] nums = {1, 2, 3, 4, 5};
String[] names = {"张三", "李四", "王五"};
```

***

## VII. Combined Example

```java
package com.itheima.demo;

/**
 * Combined example of Java basic syntax
 * @author Learner
 * @version 1.0
 */
public class BasicSyntaxDemo {

    // Constants
    public static final double PI = 3.14159;

    public static void main(String[] args) {
        // 1. Variable declarations with different data types
        byte age = 18;
        int salary = 10000;
        long population = 1_400_000_000L;  // JDK 7+ underscore separators
        float height = 1.75F;
        double weight = 65.5;
        char gender = '男';
        boolean isStudent = true;
        String name = "张三";

        // 2. Type inference with var (JDK 10+)
        var score = 95;             // Inferred as int
        var message = "Hello";      // Inferred as String

        // 3. Literals
        System.out.println(100);        // Integer literal
        System.out.println(3.14);       // Floating-point literal
        System.out.println('A');        // Character literal
        System.out.println("Hello");    // String literal
        System.out.println(true);       // Boolean literal

        // 4. Text blocks (JDK 15+)
        String json = """
                {
                    "name": "%s",
                    "age": %d
                }
                """.formatted(name, age);
        System.out.println(json);

        // 5. Variable arithmetic
        int a = 10;
        int b = 20;
        int sum = a + b;
        System.out.println("Sum: " + sum);

        // 6. Type conversion
        int num = 100;
        double d = num;      // Automatic conversion
        int n = (int)3.99;   // Explicit cast

        // 7. Wrapper classes
        Integer boxed = 100;           // Autoboxing
        int unboxed = boxed;           // Auto-unboxing
        int parsed = Integer.parseInt("123");

        // 8. Characters and ASCII
        char c = 'A';
        System.out.println("ASCII value of A: " + (int)c);  // 65

        // 9. Radix conversion
        System.out.println("Binary: " + Integer.toBinaryString(100));
        System.out.println("Hexadecimal: " + Integer.toHexString(100));

        // 10. Escape sequences
        System.out.println("First line\nSecond line");
        System.out.println("Name:\t" + name);
    }
}
```

***

## VIII. Quick Reference

### Comments

| Type | Syntax       | Purpose      |
| -- | -------- | ------- |
| Line | `//`     | Brief explanation    |
| Block | `/* */`  | Multiline explanation    |
| Documentation | `/** */` | Generate API documentation |

### Data Types

| Category | Type      | Bytes | Wrapper class       | Example       |
| -- | ------- | -- | --------- | -------- |
| Integer | byte    | 1  | Byte      | `100`    |
| Integer | short   | 2  | Short     | `10000`  |
| Integer | int     | 4  | Integer   | `100000` |
| Integer | long    | 8  | Long      | `100L`   |
| Floating-point | float   | 4  | Float     | `3.14F`  |
| Floating-point | double  | 8  | Double    | `3.14`   |
| Character | char    | 2  | Character | `'A'`    |
| Boolean | boolean | -  | Boolean   | `true`   |

### Identifier Naming

| Type  | Convention  | Example            |
| --- | --- | ------------- |
| Class name  | UpperCamelCase | `StudentInfo` |
| Method name | lowerCamelCase | `getUserName` |
| Variable name | lowerCamelCase | `maxValue`    |
| Constant name | All uppercase | `MAX_SIZE`    |
| Package name  | All lowercase | `com.example` |

### Features by JDK Version

| Version     | Feature              |
| ------ | --------------- |
| JDK 5  | Autoboxing/unboxing, generics      |
| JDK 7  | Numeric underscores, String in switch |
| JDK 10 | Local variable type inference with var    |
| JDK 15 | Text blocks (finalized)         |

***

## IX. Common Errors

```java
// ❌ Uninitialized local variable
int a;
System.out.println(a);  // Error

// ❌ Duplicate variable declaration
int num = 10;
int num = 20;  // Error

// ❌ Missing L on a long literal
long big = 10000000000;   // Error (outside the int range)
long big = 10000000000L;  // Correct

// ❌ Missing F on a float literal
float f = 3.14;   // Error
float f = 3.14F;  // Correct

// ❌ Keyword used as a variable name
int class = 10;  // Error

// ❌ Variable name starts with a digit
int 2age = 18;   // Error
int age2 = 18;   // Correct

// ❌ Out of scope
{
    int x = 10;
}
System.out.println(x);  // Error

// ❌ Type mismatch
int a = 3.14;    // Error
double a = 3.14; // Correct

// ❌ Unboxing null causes a null-pointer exception
Integer num = null;
int n = num;     // NullPointerException at runtime

// ❌ Floating-point equality comparison
System.out.println(0.1 + 0.2 == 0.3);  // false: precision issue

// ❌ Comparing wrappers with ==
Integer a = 200;
Integer b = 200;
System.out.println(a == b);       // false (outside the cache range)
System.out.println(a.equals(b));  // true (use equals)
```
