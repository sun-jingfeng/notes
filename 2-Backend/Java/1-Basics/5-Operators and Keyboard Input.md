## I. Arithmetic Operators

### 1. Basic Arithmetic Operators

| Operator | Description     | Example       | Result   |
| --- | ------ | -------- | ---- |
| `+` | Addition     | `10 + 3` | `13` |
| `-` | Subtraction     | `10 - 3` | `7`  |
| `*` | Multiplication     | `10 * 3` | `30` |
| `/` | Division     | `10 / 3` | `3`  |
| `%` | Remainder (modulo) | `10 % 3` | `1`  |

### 2. Usage Example

```java
public class ArithmeticDemo {
    public static void main(String[] args) {
        int a = 10;
        int b = 3;

        System.out.println(a + b);  // 13
        System.out.println(a - b);  // 7
        System.out.println(a * b);  // 30
        System.out.println(a / b);  // 3 (integer division discards the fractional part)
        System.out.println(a % b);  // 1 (remainder)
    }
}
```

### 3. Integer Division

```java
// Integer division keeps only the integer part; it truncates rather than rounds
System.out.println(10 / 3);   // 3 (not 3.333...)
System.out.println(10 / 4);   // 2 (not 2.5)
System.out.println(-10 / 3);  // -3 (truncates toward zero)

// For a fractional result, at least one operand must be floating-point
System.out.println(10.0 / 3);  // 3.3333...
System.out.println(10 / 3.0);  // 3.3333...
System.out.println((double)10 / 3);  // 3.3333...

// Division by zero
// System.out.println(10 / 0);  // ArithmeticException
System.out.println(10.0 / 0);  // Infinity
System.out.println(0.0 / 0);   // NaN
```

### 4. Remainder in Detail

```java
// Basic remainder
System.out.println(10 % 3);   // 1
System.out.println(10 % 4);   // 2
System.out.println(10 % 10);  // 0

// Negative operands: the result has the dividend's sign
System.out.println(10 % 3);   // 1
System.out.println(-10 % 3);  // -1 (negative dividend, negative result)
System.out.println(10 % -3);  // 1 (positive dividend, positive result)
System.out.println(-10 % -3); // -1 (negative dividend, negative result)

// Floating-point remainder
System.out.println(10.5 % 3);  // 1.5
```

### 5. Uses of Remainder

```java
// Test even or odd
int num = 7;
if (num % 2 == 0) {
    System.out.println("Even");
} else {
    System.out.println("Odd");
}

// Test divisibility
if (num % 3 == 0) {
    System.out.println("Divisible by 3");
}

// Extract decimal digits
int n = 12345;
int ge = n % 10;           // 5 (ones)
int shi = n / 10 % 10;     // 4 (tens)
int bai = n / 100 % 10;    // 3 (hundreds)
int qian = n / 1000 % 10;  // 2 (thousands)
int wan = n / 10000;       // 1 (ten-thousands)

// Cycle through values (such as array elements)
int[] arr = {1, 2, 3, 4, 5};
for (int i = 0; i < 10; i++) {
    System.out.println(arr[i % arr.length]);  // Print array elements cyclically
}
```

***

## II. String Concatenation

### 1. Two Uses of Plus

```java
// 1. Arithmetic: both operands are numeric
int result = 10 + 20;  // 30

// 2. String concatenation: either operand is a string
String str = "Hello" + "World";  // "HelloWorld"
String msg = "Age: " + 18;       // "Age: 18"
```

### 2. Concatenation Rules

```java
// Rule: evaluate from left to right

System.out.println(1 + 2 + "abc");    // "3abc"
// Explanation: 1+2=3, 3+"abc"="3abc"

System.out.println("abc" + 1 + 2);    // "abc12"
// Explanation: "abc"+1="abc1", "abc1"+2="abc12"

System.out.println(1 + "abc" + 2);    // "1abc2"
// Explanation: 1+"abc"="1abc", "1abc"+2="1abc2"

System.out.println(1 + 2 + "abc" + 3 + 4);  // "3abc34"
// Explanation: 1+2=3, 3+"abc"="3abc", "3abc"+3="3abc3", "3abc3"+4="3abc34"
```

### 3. Use Parentheses to Control Evaluation Order

```java
System.out.println("Result: " + (10 + 20));  // "Result: 30"
System.out.println("Result: " + 10 + 20);    // "Result: 1020"
```

### 4. Characters vs. Strings

```java
// Character + character = number (add ASCII values)
System.out.println('a' + 'b');     // 195 (97 + 98)
System.out.println('A' + 0);       // 65

// Character + string = string
System.out.println('a' + "b");     // "ab"
System.out.println("" + 'a' + 'b'); // "ab"
```

### 5. Concatenation Example

```java
String name = "张三";
int age = 18;
double score = 95.5;

// Concatenate output
System.out.println("Name: " + name + ", age: " + age + ", score: " + score);
// Output: Name: 张三, age: 18, score: 95.5

// Concatenate into a variable
String info = "Name: " + name + ", age: " + age;
System.out.println(info);
```

***

## III. Increment and Decrement Operators

### 1. Basic Syntax

| Operator  | Description  | Example            |
| ---- | --- | ------------- |
| `++` | Increment by 1 | `a++` or `++a` |
| `--` | Decrement by 1 | `a--` or `--a` |

### 2. Prefix vs. Postfix

```java
int a = 10;

// Used alone: prefix and postfix have the same effect
a++;  // a = 11
++a;  // a = 12
a--;  // a = 11
--a;  // a = 10

// Used in an expression: they differ!
int a = 10;
int b = a++;  // Assign first, then increment
// b = 10, a = 11

int c = 10;
int d = ++c;  // Increment first, then assign
// d = 11, c = 11
```

### 3. Detailed Examples

```java
public class IncrementDemo {
    public static void main(String[] args) {
        // Postfix ++: use first, then increment
        int a = 10;
        int b = a++;
        System.out.println("a = " + a);  // 11
        System.out.println("b = " + b);  // 10

        // Prefix ++: increment first, then use
        int c = 10;
        int d = ++c;
        System.out.println("c = " + c);  // 11
        System.out.println("d = " + d);  // 11

        // Use in an expression
        int x = 5;
        int y = x++ + ++x;
        // Explanation: x++ yields 5 (x becomes 6), ++x yields 7 (x becomes 7), 5+7=12
        System.out.println("y = " + y);  // 12
        System.out.println("x = " + x);  // 7
    }
}
```

### 4. Memory Aid

    Prefix ++: increment before using the value
    Postfix ++: use the value before incrementing

    The same applies to --

### 5. Recommendations

```java
// ✅ Recommended: use separately; avoid complex expressions
int a = 10;
a++;
System.out.println(a);

// ❌ Not recommended: using these in complex expressions is error-prone
int b = a++ + ++a - a--;  // Hard to understand
```

***

## IV. Type Conversion

### 1. Automatic (Implicit) Conversion

**Rule: smaller range → larger range, automatically**

```java
// Conversion direction (smaller to larger range):
// byte → short → int → long → float → double
//                 ↑
//               char

// Examples
byte b = 10;
int i = b;      // byte → int, automatic

int num = 100;
double d = num; // int → double, automatic

char c = 'A';
int code = c;   // char → int, automatic (ASCII value 65)

// Note: long → float is automatic, although long is 8 bytes and float is 4
// float has a larger range, but precision may be lost
long l = 123456789012345L;
float f = l;  // Automatic, but may lose precision
```

### 2. Explicit Conversion (Casting)

**Rule: larger range → smaller range requires a cast**

**Syntax:** `TargetType variableName = (TargetType) value;`

```java
double d = 3.14;
int i = (int) d;  // i = 3 (fractional part truncated)

int big = 200;
byte b = (byte) big;  // May overflow

long l = 100L;
int n = (int) l;  // long → int
```

### 3. Precision Loss in Detail

```java
// 1. Floating-point to integer: truncate the fraction rather than round
double d1 = 3.99;
int i1 = (int) d1;  // i1 = 3

double d2 = -3.99;
int i2 = (int) d2;  // i2 = -3 (toward zero)

// 2. Larger integer range to smaller range: may overflow
int big = 200;
byte b = (byte) big;  // b = -56 (overflow)

// Why: 200 in binary is 11001000
// byte keeps only the low 8 bits; signed 11001000 represents -56

int big2 = 128;
byte b2 = (byte) big2;  // b2 = -128

int big3 = 256;
byte b3 = (byte) big3;  // b3 = 0

// 3. long → float may lose precision
long l = 123456789012345L;
float f = l;
System.out.println(f);  // 1.23456789E14 (precision loss)

// 4. int → float may also lose precision
int i = 123456789;
float f2 = i;
System.out.println(f2);  // 1.23456792E8 (precision loss)
```

### 4. Conversion in Expressions

```java
// 1. byte/short/char operands are automatically promoted to int
byte b1 = 10;
byte b2 = 20;
// byte b3 = b1 + b2;  // ❌ Error! The result is int
int b3 = b1 + b2;      // ✅ Correct
byte b4 = (byte)(b1 + b2);  // ✅ Explicit cast

// 2. Mixed numeric types are promoted to the wider type
int i = 10;
double d = 3.14;
double result = i + d;  // int + double = double

// 3. Constant optimization (compile-time evaluation)
byte b = 10 + 20;  // ✅ The compiler knows 10+20=30 fits in byte
byte b5 = 100 + 100;  // ❌ 200 is outside the byte range

// 4. final constants are also optimized
final int x = 10;
final int y = 20;
byte b6 = x + y;  // ✅ x and y are final; the compiler can evaluate them
```

### 5. Type Conversion Summary

| Conversion | Direction  | Syntax      | Risk        |
| ---- | --- | ------- | --------- |
| Automatic | Smaller → larger | Direct assignment    | No risk       |
| Explicit cast | Larger → smaller | `(Type)value` | Possible precision loss or overflow |

**Data type ranges, smallest to largest:**
`byte` < `short` < `int` < `long` < `float` < `double`

***

## V. Assignment Operators

### 1. Basic Assignment

```java
int a = 10;  // Assign 10 to a
```

### 2. Compound Assignment Operators

| Operator  | Description    | Example       | Equivalent to         |
| ---- | ----- | -------- | ----------- |
| `+=` | Add and assign  | `a += 5` | `a = a + 5` |
| `-=` | Subtract and assign  | `a -= 5` | `a = a - 5` |
| `*=` | Multiply and assign  | `a *= 5` | `a = a * 5` |
| `/=` | Divide and assign  | `a /= 5` | `a = a / 5` |
| `%=` | Take remainder and assign | `a %= 5` | `a = a % 5` |

### 3. Usage Example

```java
public class AssignmentDemo {
    public static void main(String[] args) {
        int a = 10;

        a += 5;   // a = a + 5 = 15
        System.out.println(a);  // 15

        a -= 3;   // a = a - 3 = 12
        System.out.println(a);  // 12

        a *= 2;   // a = a * 2 = 24
        System.out.println(a);  // 24

        a /= 4;   // a = a / 4 = 6
        System.out.println(a);  // 6

        a %= 4;   // a = a % 4 = 2
        System.out.println(a);  // 2
    }
}
```

### 4. Compound Assignment Characteristics

```java
// Includes an implicit cast

byte b = 10;
// b = b + 5;   // ❌ b+5 is int
b += 5;         // ✅ Equivalent to b = (byte)(b + 5)

short s = 100;
// s = s + 1;   // ❌ Error!
s += 1;         // ✅ Includes the narrowing cast

// Equivalence
int a = 10;
a += 5;  // Equivalent to a = (int)(a + 5);
```

***

## VI. Relational (Comparison) Operators

### 1. Relational Operators

| Operator  | Description   | Example       | Result      |
| ---- | ---- | -------- | ------- |
| `==` | Equal to   | `5 == 5` | `true`  |
| `!=` | Not equal to  | `5 != 3` | `true`  |
| `>`  | Greater than   | `5 > 3`  | `true`  |
| `<`  | Less than   | `5 < 3`  | `false` |
| `>=` | Greater than or equal to | `5 >= 5` | `true`  |
| `<=` | Less than or equal to | `5 <= 3` | `false` |

### 2. Usage Example

```java
public class RelationalDemo {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;

        System.out.println(a == b);  // false
        System.out.println(a != b);  // true
        System.out.println(a > b);   // false
        System.out.println(a < b);   // true
        System.out.println(a >= 10); // true
        System.out.println(a <= 10); // true

        // Relational operators produce boolean results
        boolean result = a < b;
        System.out.println(result);  // true
    }
}
```

### 3. Floating-Point Comparison Problems

```java
// Floating-point precision issue
double a = 0.1 + 0.2;
double b = 0.3;
System.out.println(a);         // 0.30000000000000004
System.out.println(a == b);    // false (not equal!)

// Solution 1: Compare within a tolerance
double epsilon = 1e-10;
if (Math.abs(a - b) < epsilon) {
    System.out.println("Equal");
}

// Solution 2: Use BigDecimal
import java.math.BigDecimal;
BigDecimal bd1 = new BigDecimal("0.1").add(new BigDecimal("0.2"));
BigDecimal bd2 = new BigDecimal("0.3");
System.out.println(bd1.compareTo(bd2) == 0);  // true
```

### 4. Considerations

```java
// 1. Distinguish = from ==
int a = 10;    // Assignment
a == 10;       // Comparison

// 2. Relational operators produce boolean results
boolean flag = (10 > 5);  // true

// 3. Comparisons cannot be chained as in mathematics
int x = 5;
// if (1 < x < 10)  // ❌ Incorrect!
if (x > 1 && x < 10)  // ✅ Correct

// 4. Reference-type comparisons
String s1 = new String("hello");
String s2 = new String("hello");
System.out.println(s1 == s2);      // false (compares references)
System.out.println(s1.equals(s2)); // true (compares contents)
```

***

## VII. Logical Operators

### 1. Logical Operators

| Operator    | Description      | Example                | Result      |
| ------ | ------- | ----------------- | ------- |
| `&`    | AND  | `true & false`    | `false` |
| `\|`   | OR   | `true \| false`   | `true`  |
| `!`    | NOT  | `!true`           | `false` |
| `^`    | XOR | `true ^ false`    | `true`  |
| `&&`   | Short-circuit AND     | `true && false`   | `false` |
| `\|\|` | Short-circuit OR     | `true \|\| false` | `true`  |

### 2. Truth Tables

#### AND (&, &&)

| A     | B     | A & B |
| ----- | ----- | ----- |
| true  | true  | true  |
| true  | false | false |
| false | true  | false |
| false | false | false |

**Rule: true only if both operands are true**

#### OR (|, ||)

| A     | B     | A \| B |
| ----- | ----- | ------ |
| true  | true  | true   |
| true  | false | true   |
| false | true  | true   |
| false | false | false  |

**Rule: true if either operand is true; false only if both are false**

#### NOT (!)

| A     | !A    |
| ----- | ----- |
| true  | false |
| false | true  |

**Rule: negate the value**

#### XOR (^)

| A     | B     | A ^ B |
| ----- | ----- | ----- |
| true  | true  | false |
| true  | false | true  |
| false | true  | true  |
| false | false | false |

**Rule: false for equal operands, true for different operands**

### 3. Short-Circuit AND (&&) and OR (||)

```java
// &&: if the left operand is false, the right is not evaluated
int a = 10;
int b = 20;
boolean result = (a > b) && (++a > 0);
System.out.println(result);  // false
System.out.println(a);       // 10 (++a was not evaluated)

// ||: if the left operand is true, the right is not evaluated
boolean result2 = (a < b) || (++a > 0);
System.out.println(result2); // true
System.out.println(a);       // 10 (++a was not evaluated)

// Ordinary &: both operands are evaluated
boolean result3 = (a > b) & (++a > 0);
System.out.println(a);       // 11 (++a was evaluated)
```

### 4. Short-Circuit Operators Compared

| Operator    | Behavior               | Performance |
| ------ | ---------------- | -- |
| `&`    | Evaluates both operands            | Low  |
| `&&`   | Skips the right operand when the left is false | High  |
| `\|`   | Evaluates both operands            | Low  |
| `\|\|` | Skips the right operand when the left is true  | High  |

**Prefer the short-circuit operators `&&` and `||`**

### 5. Usage Examples

```java
public class LogicalDemo {
    public static void main(String[] args) {
        int age = 25;
        double salary = 8000;

        // AND: both conditions must hold
        if (age >= 18 && salary >= 5000) {
            System.out.println("Eligible to apply for a credit card");
        }

        // OR: either condition may hold
        if (age < 18 || age > 60) {
            System.out.println("Outside the working-age range");
        }

        // NOT: negate
        boolean isStudent = false;
        if (!isStudent) {
            System.out.println("Not a student");
        }

        // Combine conditions
        int score = 85;
        if (score >= 60 && score < 90) {
            System.out.println("Average grade");
        }

        // Use short-circuiting to avoid null-pointer access
        String str = null;
        if (str != null && str.length() > 0) {
            // If str is null, str.length() is not evaluated, avoiding NullPointerException
        }
    }
}
```

***

## VIII. Bitwise Operators

### 1. Bitwise Operators

| Operator   | Description      | Example         | Result    |
| ----- | ------- | ---------- | ----- |
| `&`   | Bitwise AND     | `5 & 3`    | `1`   |
| `\|`  | Bitwise OR     | `5 \| 3`   | `7`   |
| `^`   | Bitwise XOR    | `5 ^ 3`    | `6`   |
| `~`   | Bitwise complement    | `~5`       | `-6`  |
| `<<`  | Left shift      | `5 << 2`   | `20`  |
| `>>`  | Signed right shift | `20 >> 2`  | `5`   |
| `>>>` | Unsigned right shift | `-1 >>> 1` | A very large positive number |

### 2. Bitwise Operations in Detail

```java
// 5 in binary: 0101
// 3 in binary: 0011

// Bitwise &: 1 only if both bits are 1
System.out.println(5 & 3);  // 1 (0001)

// Bitwise |: 1 if either bit is 1
System.out.println(5 | 3);  // 7 (0111)

// Bitwise ^: 1 for different bits, 0 for equal bits
System.out.println(5 ^ 3);  // 6 (0110)

// Bitwise ~: changes 0 to 1 and 1 to 0
System.out.println(~5);  // -6
// 5 = 00000101
// ~5 = 11111010 (two's-complement representation of -6)
```

### 3. Shifts in Detail

```java
// <<: equivalent to multiplying by 2^n
System.out.println(5 << 1);   // 10 (5 * 2^1)
System.out.println(5 << 2);   // 20 (5 * 2^2)
System.out.println(5 << 3);   // 40 (5 * 2^3)

// >>: equivalent to dividing by 2^n (preserves the sign bit)
System.out.println(20 >> 1);  // 10 (20 / 2^1)
System.out.println(20 >> 2);  // 5 (20 / 2^2)
System.out.println(-20 >> 2); // -5 (preserves the negative sign)

// >>>: fills high-order bits with 0
System.out.println(-1 >>> 1); // 2147483647 (Integer.MAX_VALUE)
```

### 4. Bitwise Use Cases

```java
// 1. Test even or odd (more efficient than %)
int n = 7;
if ((n & 1) == 0) {
    System.out.println("Even");
} else {
    System.out.println("Odd");
}

// 2. Swap two numbers without a temporary variable
int a = 10, b = 20;
a = a ^ b;
b = a ^ b;
a = a ^ b;
System.out.println("a = " + a + ", b = " + b);  // a = 20, b = 10

// 3. Fast multiplication/division by powers of 2
int x = 10;
System.out.println(x << 1);  // 20 (x * 2)
System.out.println(x << 2);  // 40 (x * 4)
System.out.println(x >> 1);  // 5 (x / 2)

// 4. Read a bit
int num = 0b10110;  // Binary
int bit2 = (num >> 2) & 1;  // Read bit 2 (zero-based)

// 5. Set a bit to 1
int num2 = 0b10110;
num2 = num2 | (1 << 0);  // Set bit 0 to 1

// 6. Clear a bit (set it to 0)
int num3 = 0b10110;
num3 = num3 & ~(1 << 1);  // Clear bit 1
```

### 5. Bitwise Summary

| Operation    | Expression                           | Description      |
| ----- | ----------------------------- | ------- |
| Test even or odd  | `n & 1`                       | 0 means even, 1 means odd |
| Multiply by 2   | `n << 1`                      | Shift left 1 bit    |
| Divide by 2   | `n >> 1`                      | Shift right 1 bit    |
| Multiply by 2^k | `n << k`                      | Shift left k bits    |
| Divide by 2^k | `n >> k`                      | Shift right k bits    |
| Swap two numbers  | `a^=b; b^=a; a^=b`            | No temporary variable  |
| Absolute value  | `(n ^ (n >> 31)) - (n >> 31)` | For int values  |

***

## IX. The Ternary (Conditional) Operator

### 1. Basic Syntax

```java
DataType variableName = condition ? value1 : value2;
```

**Rule:** If the condition is true, select value1; otherwise select value2.

### 2. Usage Example

```java
public class TernaryDemo {
    public static void main(String[] args) {
        // Basic usage
        int a = 10;
        int b = 20;
        int max = (a > b) ? a : b;
        System.out.println("Maximum: " + max);  // 20

        // Test even or odd
        int num = 7;
        String result = (num % 2 == 0) ? "Even" : "Odd";
        System.out.println(result);  // Odd

        // Test the grade
        int score = 75;
        String level = (score >= 60) ? "Pass" : "Fail";
        System.out.println(level);  // Pass
    }
}
```

### 3. Nested Ternary Expressions

```java
// Maximum of three numbers
int a = 10, b = 20, c = 15;
int max = (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
System.out.println("Maximum: " + max);  // 20

// Determine a grade
int score = 85;
String grade = (score >= 90) ? "Excellent" :
               (score >= 80) ? "Good" :
               (score >= 60) ? "Pass" : "Fail";
System.out.println(grade);  // Good
```

### 4. Ternary vs. if-else

```java
// Ternary operator
int max = (a > b) ? a : b;

// Equivalent if-else
int max;
if (a > b) {
    max = a;
} else {
    max = b;
}

// Ternary is more concise for simple conditions
// if-else is more flexible for complex logic
```

### 5. Considerations

```java
// 1. A ternary expression must produce a value
// (a > b) ? a : b;  // ❌ Incorrect: the result must be used
int max = (a > b) ? a : b;  // ✅ Correct

// 2. The result types must be compatible
int result = (true) ? 10 : 20;       // ✅ Both int
double result = (true) ? 10 : 20.5;  // ✅ Automatic conversion
// String result = (true) ? 10 : "hello";  // ❌ Incompatible types

// 3. Can be used in output
System.out.println((a > b) ? "a is larger" : "b is larger");  // ✅ Correct

// 4. Ternary type inference
Object obj = (true) ? 1 : "hello";  // ✅ Result type is Object
var v = (true) ? 1 : 2.0;  // v has type double
```

***

## X. Operator Precedence

### 1. Precedence, Highest First

| Precedence | Operators                            | Description         |
| --- | ------------------------------ | ---------- |
| 1   | `()` `[]` `.`                  | Parentheses, array access, member access |
| 2   | `!` `~` `++` `--`              | Unary operators      |
| 3   | `*` `/` `%`                    | Multiplication, division, remainder       |
| 4   | `+` `-`                        | Addition, subtraction         |
| 5   | `<<` `>>` `>>>`                | Shifts         |
| 6   | `<` `<=` `>` `>=` `instanceof` | Relational operators      |
| 7   | `==` `!=`                      | Equality, inequality     |
| 8   | `&`                            | Bitwise AND        |
| 9   | `^`                            | Bitwise XOR       |
| 10  | `\|`                           | Bitwise OR        |
| 11  | `&&`                           | Logical AND        |
| 12  | `\|\|`                         | Logical OR        |
| 13  | `? :`                          | Ternary operator      |
| 14  | `=` `+=` `-=` `*=` ...         | Assignment operators      |

### 2. Simplified Memory Aid

    Precedence, highest to lowest:
    1. () Parentheses: highest
    2. ! ~ ++ -- Unary operators
    3. * / % Multiplication, division, remainder
    4. + - Addition, subtraction
    5. << >> >>> Shifts
    6. Comparison operators > < >= <= == !=
    7. Bitwise operators & ^ |
    8. Logical operators && ||
    9. Ternary operator ? :
    10. Assignment operators = += -= ...

### 3. Mnemonic

    Parentheses have the highest precedence
    Unary before binary
    Arithmetic before shifts
    Shifts before relational
    Relational before bitwise
    Bitwise before logical
    Logical before ternary
    Ternary before assignment

### 4. Recommendations

```java
// ❌ Not recommended: relying on precedence is hard to read
int result = a + b * c > d && e || f;

// ✅ Recommended: make precedence explicit with parentheses
int result = ((a + (b * c)) > d) && e || f;

// Or split into several lines
int temp = a + b * c;
boolean compare = temp > d;
boolean result = compare && e || f;
```

***

## XI. Keyboard Input with Scanner

### 1. Basic Steps

```java
// 1. Import the class (above the class declaration)
import java.util.Scanner;

// 2. Create a Scanner
Scanner sc = new Scanner(System.in);

// 3. Read data
int num = sc.nextInt();        // Read an integer
double d = sc.nextDouble();    // Read a decimal number
String str = sc.next();        // Read a string (stops at a space)
String line = sc.nextLine();   // Read a line (stops at Enter)

// 4. Close the Scanner (optional)
sc.close();
```

### 2. Complete Example

```java
import java.util.Scanner;

public class ScannerDemo {
    public static void main(String[] args) {
        // Create a Scanner
        Scanner sc = new Scanner(System.in);

        // Read an integer
        System.out.print("Enter your age: ");
        int age = sc.nextInt();
        System.out.println("Your age: " + age);

        // Read a decimal number
        System.out.print("Enter your height: ");
        double height = sc.nextDouble();
        System.out.println("Your height: " + height);

        // Read a string
        System.out.print("Enter your name: ");
        String name = sc.next();
        System.out.println("Your name: " + name);

        // Close the Scanner
        sc.close();
    }
}
```

### 3. Common Scanner Methods

| Method              | Description          | Example input          | Result          |
| --------------- | ----------- | ------------- | ------------- |
| `nextInt()`     | Read an integer        | `123`         | `123`         |
| `nextLong()`    | Read a long integer       | `123456789`   | `123456789L`  |
| `nextDouble()`  | Read a decimal number        | `3.14`        | `3.14`        |
| `nextFloat()`   | Read a single-precision decimal number     | `3.14`        | `3.14f`       |
| `nextBoolean()` | Read a boolean       | `true`        | `true`        |
| `next()`        | Read a string (stops at a space) | `hello world` | `hello`       |
| `nextLine()`    | Read a line (stops at Enter)  | `hello world` | `hello world` |
| `hasNextInt()`  | Check whether integer input is available   | —             | `boolean`     |
| `hasNextLine()` | Check whether another line is available    | —             | `boolean`     |

### 4. next() vs. nextLine()

```java
Scanner sc = new Scanner(System.in);

// next(): stops at a space
System.out.print("Enter text: ");
String s1 = sc.next();
// Input: hello world
// s1 = "hello" (world remains in the buffer)

// nextLine(): stops at Enter
System.out.print("Enter text: ");
String s2 = sc.nextLine();
// Input: hello world
// s2 = "hello world"
```

### 5. Problems When Mixing Methods and Their Solutions

```java
Scanner sc = new Scanner(System.in);

// Problem: nextLine() after nextInt()
System.out.print("Enter age: ");
int age = sc.nextInt();  // Enter 123 and press Enter

System.out.print("Enter name: ");
String name = sc.nextLine();  // Consumes the remaining newline and returns an empty string

System.out.println("Name: " + name);  // The name is empty

// Solution 1: Call nextLine() once more to consume the newline
System.out.print("Enter age: ");
int age = sc.nextInt();
sc.nextLine();  // Consume the newline

System.out.print("Enter name: ");
String name = sc.nextLine();

// Solution 2: Use nextLine() throughout, then convert types
System.out.print("Enter age: ");
int age = Integer.parseInt(sc.nextLine());

System.out.print("Enter name: ");
String name = sc.nextLine();
```

### 6. Checking Input with hasNextXxx()

```java
Scanner sc = new Scanner(System.in);

System.out.print("Enter an integer: ");

// Check whether integer input is available
if (sc.hasNextInt()) {
    int num = sc.nextInt();
    System.out.println("You entered the integer: " + num);
} else {
    System.out.println("The input is not an integer!");
    sc.next();  // Consume the invalid input
}

// Read in a loop until input ends
System.out.println("Enter several integers (Ctrl+D to finish): ");
while (sc.hasNextInt()) {
    int n = sc.nextInt();
    System.out.println("Read: " + n);
}
```

### 7. Exception Handling

```java
import java.util.Scanner;
import java.util.InputMismatchException;

public class ScannerExceptionDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Option 1: Prevent errors with hasNextXxx()
        System.out.print("Enter your age: ");
        if (sc.hasNextInt()) {
            int age = sc.nextInt();
            System.out.println("Age: " + age);
        } else {
            System.out.println("Enter a valid integer!");
        }

        // Option 2: Handle exceptions with try-catch
        try {
            System.out.print("Enter a score: ");
            double score = sc.nextDouble();
            System.out.println("Score: " + score);
        } catch (InputMismatchException e) {
            System.out.println("Invalid input format!");
        }

        // Option 3: Loop until valid input is entered
        int number = 0;
        boolean valid = false;
        while (!valid) {
            System.out.print("Enter an integer: ");
            if (sc.hasNextInt()) {
                number = sc.nextInt();
                valid = true;
            } else {
                System.out.println("Invalid input; try again!");
                sc.next();  // Consume invalid input
            }
        }
        System.out.println("You entered: " + number);

        sc.close();
    }
}
```

### 8. Practical Examples

#### Example 1: Add Two Numbers

```java
import java.util.Scanner;

public class SumDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter the first integer: ");
        int a = sc.nextInt();

        System.out.print("Enter the second integer: ");
        int b = sc.nextInt();

        int sum = a + b;
        System.out.println("Sum: " + sum);

        sc.close();
    }
}
```

#### Example 2: Determine a Grade

```java
import java.util.Scanner;

public class ScoreDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter the score: ");
        if (sc.hasNextInt()) {
            int score = sc.nextInt();

            if (score < 0 || score > 100) {
                System.out.println("The score must be between 0 and 100!");
            } else {
                String level = (score >= 90) ? "Excellent" :
                               (score >= 80) ? "Good" :
                               (score >= 60) ? "Pass" : "Fail";
                System.out.println("Grade: " + level);
            }
        } else {
            System.out.println("Enter a valid integer!");
        }

        sc.close();
    }
}
```

#### Example 3: Simple Calculator

```java
import java.util.Scanner;

public class CalculatorDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter the first number: ");
        double a = sc.nextDouble();

        System.out.print("Enter the operator (+ - * /): ");
        String op = sc.next();

        System.out.print("Enter the second number: ");
        double b = sc.nextDouble();

        double result = switch (op) {
            case "+" -> a + b;
            case "-" -> a - b;
            case "*" -> a * b;
            case "/" -> b != 0 ? a / b : Double.NaN;
            default -> Double.NaN;
        };

        if (Double.isNaN(result)) {
            System.out.println("Calculation error!");
        } else {
            System.out.println("Result: " + a + " " + op + " " + b + " = " + result);
        }

        sc.close();
    }
}
```

***

## XII. Combined Example

### Example: Student Score Management

```java
import java.util.Scanner;

public class StudentScore {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Read student information
        System.out.print("Enter your name: ");
        String name = sc.next();

        System.out.print("Enter the Chinese score: ");
        int chinese = sc.nextInt();

        System.out.print("Enter the mathematics score: ");
        int math = sc.nextInt();

        System.out.print("Enter the English score: ");
        int english = sc.nextInt();

        // Calculate total and average
        int total = chinese + math + english;
        double avg = total / 3.0;  // Use 3.0 to avoid integer division

        // Determine the grade
        String level = (avg >= 90) ? "Excellent" :
                       (avg >= 80) ? "Good" :
                       (avg >= 60) ? "Pass" : "Fail";

        // Check whether all subjects were passed
        boolean isPass = (chinese >= 60) && (math >= 60) && (english >= 60);
        String passInfo = isPass ? "Passed all subjects" : "Failed one or more subjects";

        // Find the subject with the highest score
        int maxScore = Math.max(chinese, Math.max(math, english));
        String maxSubject = (maxScore == chinese) ? "Chinese" :
                           (maxScore == math) ? "Mathematics" : "English";

        // Print results
        System.out.println("\n===== Report Card =====");
        System.out.println("Name: " + name);
        System.out.println("Chinese: " + chinese);
        System.out.println("Mathematics: " + math);
        System.out.println("English: " + english);
        System.out.println("Total: " + total);
        System.out.printf("Average: %.2f%n", avg);
        System.out.println("Grade: " + level);
        System.out.println("Status: " + passInfo);
        System.out.println("Highest-scoring subject: " + maxSubject + " (" + maxScore + " points)");

        sc.close();
    }
}
```

***

## XIII. Quick Reference

### Arithmetic Operators

| Operator | Description       | Note         |
| --- | -------- | ---------- |
| `+` | Addition/string concatenation | Becomes concatenation when a string is involved  |
| `-` | Subtraction       |            |
| `*` | Multiplication       |            |
| `/` | Division       | Integer division discards the fraction   |
| `%` | Remainder       | Result has the dividend's sign |

### Increment and Decrement

| Form    | Description      |
| ----- | ------- |
| `++a` | Increment, then use |
| `a++` | Use, then increment |
| `--a` | Decrement, then use |
| `a--` | Use, then decrement |

### Assignment Operators

| Operator  | Equivalent to         | Characteristic   |
| ---- | ----------- | ---- |
| `+=` | `a = a + b` | Includes a cast |
| `-=` | `a = a - b` | Includes a cast |
| `*=` | `a = a * b` | Includes a cast |
| `/=` | `a = a / b` | Includes a cast |
| `%=` | `a = a % b` | Includes a cast |

### Logical Operators

| Operator    | Description  | Behavior           |
| ------ | --- | ------------ |
| `&&`   | Short-circuit AND | Left false → skip right |
| `\|\|` | Short-circuit OR | Left true → skip right  |
| `!`    | NOT   | Negation           |

### Bitwise Operators

| Operator   | Description      | Use           |
| ----- | ------- | ------------ |
| `&`   | Bitwise AND     | Even/odd test: `n & 1` |
| `\|`  | Bitwise OR     |              |
| `^`   | Bitwise XOR    | Swap two numbers         |
| `~`   | Bitwise complement    |              |
| `<<`  | Left shift      | Multiply by 2^n       |
| `>>`  | Signed right shift | Divide by 2^n       |
| `>>>` | Unsigned right shift | Fill high-order bits with 0         |

### Scanner Methods

| Method             | Description          |
| -------------- | ----------- |
| `nextInt()`    | Read an integer        |
| `nextDouble()` | Read a decimal number        |
| `next()`       | Read a string (stops at a space) |
| `nextLine()`   | Read a line (stops at Enter)  |
| `hasNextInt()` | Check whether integer input is available   |

### Type Conversion

| Conversion | Direction  | Syntax      | Risk   |
| ---- | --- | ------- | ---- |
| Automatic | Smaller → larger | Direct assignment    | No risk  |
| Explicit cast | Larger → smaller | `(Type)value` | Possible overflow |
