## I. Math

### 1. What Is Math?

Java's `Math` class is a **mathematical utility class** providing various mathematical operations.

```java
// Math is in java.lang; no import is required
// Math methods are static; call them through the class name
// Math has a private constructor and cannot be instantiated
Math.abs(-10);  // 10
```

***

### 2. Common Constants

```java
// Pi, π (approximately 3.141592653589793)
double pi = Math.PI;

// Euler's number, e (approximately 2.718281828459045)
double e = Math.E;
```

***

### 3. Common Methods

#### Basic Operations

```java
// Absolute value
Math.abs(-10);      // 10
Math.abs(-3.14);    // 3.14

// Maximum and minimum
Math.max(10, 20);   // 20
Math.min(10, 20);   // 10

// Exponentiation
Math.pow(2, 3);     // 8.0 (2 to the power of 3)

// Square root
Math.sqrt(16);      // 4.0

// Cube root
Math.cbrt(27);      // 3.0

// Exponential (e to the power of x)
Math.exp(1);        // 2.7182818284590455 (e to the power of 1; differs from Math.E in the last digit)

// Natural logarithm (base e)
Math.log(Math.E);   // 1.0

// Common logarithm (base 10)
Math.log10(100);    // 2.0
```

***

#### Rounding Operations

```java
// Round toward positive infinity (ceiling)
Math.ceil(3.1);     // 4.0
Math.ceil(3.9);     // 4.0
Math.ceil(-3.1);    // -3.0

// Round toward negative infinity (floor)
Math.floor(3.1);    // 3.0
Math.floor(3.9);    // 3.0
Math.floor(-3.1);   // -4.0

// Round to the nearest integer
Math.round(3.4);    // 3 (returns long)
Math.round(3.5);    // 4
Math.round(-3.5);   // -3 (note: -3.5 rounds to -3)

// Convert to an integer (truncate the fractional part)
int t1 = (int) 3.9;   // 3
int t2 = (int) -3.9;  // -3
```

***

#### Trigonometric Functions

```java
// Sine (argument in radians)
Math.sin(Math.PI / 2);  // 1.0

// Cosine
Math.cos(0);            // 1.0

// Tangent
Math.tan(Math.PI / 4);  // 0.9999999999999999 (approximately 1.0)

// Convert degrees to radians
double radians = Math.toRadians(90);  // 1.5707963267948966

// Convert radians to degrees
double degrees = Math.toDegrees(Math.PI);  // 180.0
```

***

#### Random Numbers

```java
// Return a random number in [0.0, 1.0)
double random = Math.random();

// Generate a random integer in [0, 10)
int num1 = (int)(Math.random() * 10);

// Generate a random integer in [1, 10]
int num2 = (int)(Math.random() * 10) + 1;

// Generate a random integer in [min, max] (general formula)
int min = 5, max = 10;
int num3 = (int)(Math.random() * (max - min + 1)) + min;
```

***

### 4. Math Quick Reference

| Method | Description | Example | Result |
| ----------- | ----------- | --------------------- | ------- |
| `abs(x)` | Absolute value | `Math.abs(-10)` | `10` |
| `max(a, b)` | Maximum | `Math.max(10, 20)` | `20` |
| `min(a, b)` | Minimum | `Math.min(10, 20)` | `10` |
| `pow(a, b)` | a to the power of b | `Math.pow(2, 3)` | `8.0` |
| `sqrt(x)` | Square root | `Math.sqrt(16)` | `4.0` |
| `cbrt(x)` | Cube root | `Math.cbrt(27)` | `3.0` |
| `ceil(x)` | Round upward | `Math.ceil(3.1)` | `4.0` |
| `floor(x)` | Round downward | `Math.floor(3.9)` | `3.0` |
| `round(x)` | Round to nearest | `Math.round(3.5)` | `4` |
| `random()` | Random number in \[0, 1) | `Math.random()` | `0.xxx` |
| `log(x)` | Natural logarithm | `Math.log(Math.E)` | `1.0` |
| `log10(x)` | Common logarithm | `Math.log10(100)` | `2.0` |
| `sin(x)` | Sine | `Math.sin(Math.PI/2)` | `1.0` |
| `cos(x)` | Cosine | `Math.cos(0)` | `1.0` |

***

## II. System

### 1. What Is System?

`System` provides **system-related** methods and fields.

```java
// System is in java.lang; no import is required
// System methods are static
// System cannot be instantiated
```

***

### 2. Common Methods

#### Standard Input and Output

```java
// Standard output
System.out.println("Hello");  // Print with a newline
System.out.print("Hello");    // Print without a newline
System.out.printf("Age: %d", 18);  // Formatted output

// Standard error output (shown in red in most IDE consoles)
System.err.println("Error");

// Standard input
Scanner scanner = new Scanner(System.in);
```

***

#### Time

```java
// Get the current time in milliseconds since 1970-01-01 00:00:00 UTC
long currentTime = System.currentTimeMillis();
System.out.println(currentTime);  // 1704067200000

// Used to measure program execution time
long start = System.currentTimeMillis();
// ... Execute code ...
long end = System.currentTimeMillis();
System.out.println("Elapsed time: " + (end - start) + "ms");

// Get a nanosecond time reading (higher precision, for performance measurements)
long nanoTime = System.nanoTime();
```

***

#### Array Copying

```java
// arraycopy(src, srcPos, dest, destPos, length)
// Copy length elements from srcPos in the source array to destPos in the destination array

int[] src = {1, 2, 3, 4, 5};
int[] dest = new int[5];

System.arraycopy(src, 0, dest, 0, 5);
// dest = {1, 2, 3, 4, 5}

System.arraycopy(src, 1, dest, 2, 3);
// dest = {1, 2, 2, 3, 4} (indices 2–4 overwritten with src[1..3]; indices 0–1 keep their earlier values)
```

***

#### System Properties

```java
// Get system properties
String javaVersion = System.getProperty("java.version");  // Java version
String osName = System.getProperty("os.name");            // Operating system name
String userHome = System.getProperty("user.home");        // User home directory
String userDir = System.getProperty("user.dir");          // Current working directory
String fileSeparator = System.getProperty("file.separator");  // File separator

// Get all system properties
Properties props = System.getProperties();
props.forEach((key, value) -> System.out.println(key + " = " + value));

// Set a system property
System.setProperty("myKey", "myValue");
```

***

#### Environment Variables

```java
// Get environment variables
String path = System.getenv("PATH");      // PATH environment variable
String javaHome = System.getenv("JAVA_HOME");  // JAVA_HOME environment variable

// Get all environment variables
Map<String, String> env = System.getenv();
env.forEach((key, value) -> System.out.println(key + " = " + value));
```

***

#### Line Separator

```java
// Get the system line separator (cross-platform)
String lineSeparator = System.lineSeparator();
// Windows: "\r\n"
// Linux/Mac: "\n"

// Usage example
System.out.print("First line" + System.lineSeparator() + "Second line");
```

***

#### Exiting the Program

```java
// Terminate the currently running JVM
// Status 0 indicates normal termination; nonzero indicates abnormal termination
System.exit(0);  // Normal termination
System.exit(1);  // Abnormal termination
```

***

#### Garbage Collection

```java
// Suggest that the JVM run garbage collection (immediate execution is not guaranteed)
System.gc();
```

***

### 3. System Quick Reference

| Method | Description | Example |
| --------------------- | --------- | -------------------------------------- |
| `currentTimeMillis()` | Gets the current time in milliseconds | `System.currentTimeMillis()` |
| `nanoTime()` | Gets a nanosecond time reading | `System.nanoTime()` |
| `arraycopy()` | Copies an array | `System.arraycopy(src, 0, dest, 0, 5)` |
| `getProperty(key)` | Gets a system property | `System.getProperty("java.version")` |
| `getenv(name)` | Gets an environment variable | `System.getenv("PATH")` |
| `lineSeparator()` | Gets the system line separator | `System.lineSeparator()` |
| `exit(int)` | Exits the program | `System.exit(0)` |
| `gc()` | Suggests garbage collection | `System.gc()` |

***

## III. Random

### 1. What Is Random?

`Random` generates **pseudorandom numbers** and is more flexible than `Math.random()`.

```java
import java.util.Random;
```

***

### 2. Common Methods

```java
// Create a Random object
Random random = new Random();

// Create with a seed (identical seeds produce identical random sequences)
Random random2 = new Random(12345);

// Generate a random integer across the full range
int num1 = random.nextInt();  // Any int value

// Generate a random integer in [0, n)
int num2 = random.nextInt(10);  // [0, 10)

// Generate a random integer in [min, max]
int min = 5, max = 10;
int num3 = random.nextInt(max - min + 1) + min;  // [5, 10]

// Generate a random long
long num4 = random.nextLong();

// Generate a random floating-point number in [0.0, 1.0)
double num5 = random.nextDouble();
float num6 = random.nextFloat();

// Generate a random boolean
boolean flag = random.nextBoolean();

// Fill a byte array with random bytes
byte[] bytes = new byte[10];
random.nextBytes(bytes);
```

***

### 3. Random vs Math.random()

| Comparison | `Random` | `Math.random()` |
| --------- | ------------------- | --------------- |
| **Return types** | Multiple types | Only double |
| **Range control** | `nextInt(n)` specifies the range directly | Requires calculation |
| **Configurable seed** | Yes | No |
| **Thread safety** | Thread-safe; sharing an instance may cause contention | Thread-safe; its shared underlying generator may cause contention |
| **Recommended use** | Multiple types or reproducible sequences | Simple cases |

***

### 4. ThreadLocalRandom (Thread-Safe, JDK 7+)

```java
import java.util.concurrent.ThreadLocalRandom;

// Get the current thread's random number generator
ThreadLocalRandom random = ThreadLocalRandom.current();

// Generate a random integer in [0, 10)
int num1 = random.nextInt(10);

// Generate a random integer in [5, 10) (specify the range directly)
int num2 = random.nextInt(5, 10);

// Generate a random floating-point number in [1.0, 10.0)
double num3 = random.nextDouble(1.0, 10.0);
```

***

## IV. Objects

### 1. What Is Objects?

`Objects` is an **object utility class** providing static methods for working with objects (JDK 7+).

```java
import java.util.Objects;
```

***

### 2. Common Methods

#### Null Checks

```java
Object obj = null;

// Test for null
Objects.isNull(obj);      // true
Objects.nonNull(obj);     // false

// Require non-null; otherwise throw NullPointerException
Objects.requireNonNull(obj);  // Throws NullPointerException
Objects.requireNonNull(obj, "Object must not be null");  // Custom exception message

// JDK 9+: supply a default value
Objects.requireNonNullElse(obj, "Default value");  // Return the default value if obj is null
```

***

#### Object Comparison

```java
String s1 = null;
String s2 = "hello";

// Null-safe equals comparison (avoids NullPointerException)
Objects.equals(s1, s2);  // false (no exception)

// Equivalent to
// (s1 == s2) || (s1 != null && s1.equals(s2))

// Deep comparison (for arrays)
int[] arr1 = {1, 2, 3};
int[] arr2 = {1, 2, 3};
Objects.deepEquals(arr1, arr2);  // true
```

***

#### Hash Codes

```java
// Compute an object's hash code (returns 0 for null)
Objects.hashCode(obj);

// Compute a combined hash code for multiple objects
Objects.hash("name", 18, true);  // Used when overriding hashCode()
```

***

#### Conversion to String

```java
Object obj = null;

// Null-safe toString
Objects.toString(obj);           // "null"
Objects.toString(obj, "Default value");  // "Default value"
```

***

### 3. Objects Quick Reference

| Method | Description | Example |
| --------------------- | ------------ | -------------------------------- |
| `isNull(obj)` | Tests for null | `Objects.isNull(obj)` |
| `nonNull(obj)` | Tests for non-null | `Objects.nonNull(obj)` |
| `requireNonNull(obj)` | Requires non-null | `Objects.requireNonNull(obj)` |
| `equals(a, b)` | Null-safe equals | `Objects.equals(s1, s2)` |
| `deepEquals(a, b)` | Deep comparison | `Objects.deepEquals(arr1, arr2)` |
| `hashCode(obj)` | Computes a hash code | `Objects.hashCode(obj)` |
| `hash(values...)` | Combined hash code | `Objects.hash("name", 18)` |
| `toString(obj)` | Null-safe toString | `Objects.toString(obj)` |

***

## V. Wrapper Classes

### 1. What Are Wrapper Classes?

Wrapper classes are **reference types corresponding to primitive types**, used to wrap primitive values as objects.

```java
// Why are wrapper classes needed?
// 1. Collections store objects, not primitive values
// 2. They provide more methods for manipulating data
// 3. They can represent null
```

***

### 2. Primitive Types and Their Wrappers

| Primitive type | Wrapper | Description |
| --------- | ----------- | ------ |
| `byte` | `Byte` | Byte |
| `short` | `Short` | Short integer |
| `int` | `Integer` | **Integer** |
| `long` | `Long` | Long integer |
| `float` | `Float` | Single-precision floating point |
| `double` | `Double` | Double-precision floating point |
| `char` | `Character` | **Character** |
| `boolean` | `Boolean` | Boolean |

***

### 3. Boxing and Unboxing

```java
// Boxing: primitive → wrapper
// Manual boxing (not recommended)
Integer i1 = Integer.valueOf(10);
// Autoboxing (recommended)
Integer i2 = 10;  // Automatically calls Integer.valueOf(10)

// Unboxing: wrapper → primitive
// Manual unboxing (not recommended)
int n1 = i1.intValue();
// Automatic unboxing (recommended)
int n2 = i2;  // Automatically calls i2.intValue()
```

***

### 4. Common Integer Methods

```java
// 1. Convert a string to an integer
int num1 = Integer.parseInt("123");  // 123
int num2 = Integer.parseInt("10", 2);  // 2 (binary to decimal)

// 2. Convert an integer to a string
String s1 = Integer.toString(123);  // "123"
String s2 = String.valueOf(123);    // "123"
String s3 = 123 + "";               // "123"

// 3. Base conversion
String binary = Integer.toBinaryString(10);   // "1010" (binary)
String octal = Integer.toOctalString(10);     // "12" (octal)
String hex = Integer.toHexString(10);         // "a" (hexadecimal)

// 4. Maximum and minimum values
int max = Integer.MAX_VALUE;  // 2147483647
int min = Integer.MIN_VALUE;  // -2147483648

// 5. Comparison
Integer a = 10, b = 20;
int result = Integer.compare(a, b);  // -1 (less than)
int result2 = a.compareTo(b);        // -1
```

***

### 5. Common Character Methods

```java
// Test the character type
Character.isDigit('5');      // true (is a digit)
Character.isLetter('A');     // true (is a letter)
Character.isLetterOrDigit('A');  // true (is a letter or digit)
Character.isWhitespace(' '); // true (is whitespace)
Character.isUpperCase('A');  // true (is uppercase)
Character.isLowerCase('a');  // true (is lowercase)

// Case conversion
Character.toUpperCase('a');  // 'A'
Character.toLowerCase('A');  // 'a'
```

***

### 6. Wrapper Caching

```java
// Integer caches objects for -128 through 127
Integer a = 127;
Integer b = 127;
System.out.println(a == b);  // true (same object)

Integer c = 128;
Integer d = 128;
System.out.println(c == d);  // false (different objects)

// Use equals() to compare wrapper values
System.out.println(c.equals(d));  // true
```

| Wrapper | Cached range |
| ------------------ | ------------ |
| `Byte`             | -128 \~ 127  |
| `Short`            | -128 \~ 127  |
| `Integer`          | -128 \~ 127  |
| `Long`             | -128 \~ 127  |
| `Character`        | 0 \~ 127     |
| `Boolean`          | true / false |
| `Float` / `Double` | No caching |

***

### 7. Wrapper Quick Reference

| Method | Description | Example |
| --------------------- | ------------- | ---------------------------- |
| `parseInt(String)` | String to int | `Integer.parseInt("123")` |
| `valueOf(int)` | int to Integer | `Integer.valueOf(10)` |
| `toString(int)` | int to string | `Integer.toString(123)` |
| `toBinaryString(int)` | Convert to binary string | `Integer.toBinaryString(10)` |
| `toHexString(int)` | Convert to hexadecimal string | `Integer.toHexString(10)` |
| `compare(a, b)` | Compare two values | `Integer.compare(10, 20)` |
| `MAX_VALUE` | Maximum value | `Integer.MAX_VALUE` |
| `MIN_VALUE` | Minimum value | `Integer.MIN_VALUE` |

***

## VI. BigDecimal

### 1. What Is BigDecimal?

`BigDecimal` supports **high-precision decimal arithmetic**, addressing loss of floating-point precision.

```java
// Floating-point precision issue
System.out.println(0.1 + 0.2);  // 0.30000000000000004 (precision loss)

// Solve with BigDecimal
BigDecimal a = new BigDecimal("0.1");
BigDecimal b = new BigDecimal("0.2");
System.out.println(a.add(b));  // 0.3 (exact)
```

***

### 2. Creating BigDecimal

```java
import java.math.BigDecimal;

// ✅ Recommended: create from a string
BigDecimal bd1 = new BigDecimal("0.1");

// ✅ Recommended: create with a static method
BigDecimal bd2 = BigDecimal.valueOf(0.1);

// ❌ Not recommended: create from double (may introduce precision problems)
BigDecimal bd3 = new BigDecimal(0.1);  // 0.1000000000000000055511...

// Common constants
BigDecimal zero = BigDecimal.ZERO;  // 0
BigDecimal one = BigDecimal.ONE;    // 1
BigDecimal ten = BigDecimal.TEN;    // 10
```

***

### 3. Common Methods

#### Four Basic Arithmetic Operations

```java
BigDecimal a = new BigDecimal("10");
BigDecimal b = new BigDecimal("3");

// Addition
BigDecimal sum = a.add(b);  // 13

// Subtraction
BigDecimal diff = a.subtract(b);  // 7

// Multiplication
BigDecimal product = a.multiply(b);  // 30

// Division (specify scale and rounding mode)
BigDecimal quotient = a.divide(b, 2, RoundingMode.HALF_UP);  // 3.33
```

***

#### Rounding Modes

```java
import java.math.RoundingMode;

BigDecimal a = new BigDecimal("10");
BigDecimal b = new BigDecimal("3");

// Round half up
a.divide(b, 2, RoundingMode.HALF_UP);  // 3.33

// Round up
a.divide(b, 2, RoundingMode.UP);  // 3.34

// Round down
a.divide(b, 2, RoundingMode.DOWN);  // 3.33

// Banker's rounding (ties to even)
a.divide(b, 2, RoundingMode.HALF_EVEN);  // 3.33
```

***

#### Other Methods

```java
BigDecimal bd = new BigDecimal("3.14159");

// Set the scale
BigDecimal scaled = bd.setScale(2, RoundingMode.HALF_UP);  // 3.14

// Absolute value
BigDecimal abs = new BigDecimal("-3.14").abs();  // 3.14

// Negation
BigDecimal neg = bd.negate();  // -3.14159

// Strip trailing zeros
BigDecimal stripped = new BigDecimal("3.1400").stripTrailingZeros();  // 3.14

// Compare values
int result = bd.compareTo(new BigDecimal("3.14"));
// Return value: -1 (less than), 0 (equal), 1 (greater than)

// Convert to double
double d = bd.doubleValue();

// Convert to int (truncate fractional part)
int i = bd.intValue();
```

***

### 4. BigDecimal Quick Reference

| Method | Description | Example |
| --------------------------------- | ------ | -------------------------------------- |
| `add(BigDecimal)` | Addition | `a.add(b)` |
| `subtract(BigDecimal)` | Subtraction | `a.subtract(b)` |
| `multiply(BigDecimal)` | Multiplication | `a.multiply(b)` |
| `divide(BigDecimal, scale, mode)` | Division | `a.divide(b, 2, RoundingMode.HALF_UP)` |
| `setScale(scale, mode)` | Set scale | `bd.setScale(2, RoundingMode.HALF_UP)` |
| `abs()` | Absolute value | `bd.abs()` |
| `negate()` | Negation | `bd.negate()` |
| `compareTo(BigDecimal)` | Compare values | `a.compareTo(b)` |
| `stripTrailingZeros()` | Strip trailing zeros | `bd.stripTrailingZeros()` |

***

## VII. Arrays

### 1. What Is Arrays?

`Arrays` is an **array utility class** providing various methods for manipulating arrays.

```java
import java.util.Arrays;

// All methods are static
```

***

### 2. Common Methods

#### Conversion to String

```java
int[] arr = {3, 1, 4, 1, 5, 9};

// Array to string
String str = Arrays.toString(arr);  // "[3, 1, 4, 1, 5, 9]"

// Multidimensional array to string
int[][] arr2d = {{1, 2}, {3, 4}};
String str2 = Arrays.deepToString(arr2d);  // "[[1, 2], [3, 4]]"
```

***

#### Sorting

```java
int[] arr = {3, 1, 4, 1, 5, 9};

// Ascending sort
Arrays.sort(arr);  // [1, 1, 3, 4, 5, 9]

// Sort a subrange
int[] arr2 = {3, 1, 4, 1, 5, 9};
Arrays.sort(arr2, 0, 3);  // [1, 3, 4, 1, 5, 9] (only the first 3 elements are sorted)

// Custom sorting of object arrays
String[] names = {"Tom", "Jerry", "Alice"};
Arrays.sort(names, (a, b) -> Integer.compare(a.length(), b.length()));  // Sort by length

// Descending sort (requires a wrapper array)
Integer[] nums = {3, 1, 4, 1, 5, 9};
Arrays.sort(nums, (a, b) -> Integer.compare(b, a));  // [9, 5, 4, 3, 1, 1]

// Parallel sort (faster for large arrays, JDK 8+)
int[] bigArr = new int[1000000];
Arrays.parallelSort(bigArr);
```

***

#### Binary Search

```java
int[] arr = {1, 2, 3, 4, 5, 6, 7, 8, 9};

// Binary search (array must be sorted)
int index = Arrays.binarySearch(arr, 5);  // 4 (index)
int notFound = Arrays.binarySearch(arr, 10);  // -10 (negative means not found)
// When not found, returns: -(insertion point) - 1
```

***

#### Copying Arrays

```java
int[] arr = {1, 2, 3, 4, 5};

// Copy an array
int[] copy1 = Arrays.copyOf(arr, 3);  // [1, 2, 3]
int[] copy2 = Arrays.copyOf(arr, 7);  // [1, 2, 3, 4, 5, 0, 0]

// Copy a range
int[] copy3 = Arrays.copyOfRange(arr, 1, 4);  // [2, 3, 4]
```

***

#### Filling Arrays

```java
int[] arr = new int[5];

// Fill an array
Arrays.fill(arr, 10);  // [10, 10, 10, 10, 10]

// Fill a range
Arrays.fill(arr, 1, 4, 20);  // [10, 20, 20, 20, 10]
```

***

#### Comparing Arrays

```java
int[] arr1 = {1, 2, 3};
int[] arr2 = {1, 2, 3};
int[] arr3 = {1, 2, 4};

// Compare array contents for equality
System.out.println(Arrays.equals(arr1, arr2));  // true
System.out.println(Arrays.equals(arr1, arr3));  // false

// Compare multidimensional arrays
int[][] arr2d1 = {{1, 2}, {3, 4}};
int[][] arr2d2 = {{1, 2}, {3, 4}};
System.out.println(Arrays.deepEquals(arr2d1, arr2d2));  // true
```

***

#### Conversion to List

```java
String[] arr = {"A", "B", "C"};

// Array to List (fixed size; cannot add or remove)
List<String> list = Arrays.asList(arr);

// Modifiable List
List<String> list2 = new ArrayList<>(Arrays.asList(arr));
```

***

#### Conversion to Stream (JDK 8+)

```java
int[] arr = {1, 2, 3, 4, 5};

// Array to Stream
int sum = Arrays.stream(arr).sum();  // 15
int max = Arrays.stream(arr).max().getAsInt();  // 5

// Filtering and mapping
int[] result = Arrays.stream(arr)
    .filter(n -> n > 2)
    .map(n -> n * 2)
    .toArray();  // [6, 8, 10]
```

***

### 3. Arrays Quick Reference

| Method | Description | Example |
| ---------------------------- | -------- | ------------------------------- |
| `toString(arr)` | Array to string | `Arrays.toString(arr)` |
| `deepToString(arr)` | Multidimensional array to string | `Arrays.deepToString(arr2d)` |
| `sort(arr)` | Sort | `Arrays.sort(arr)` |
| `parallelSort(arr)` | Parallel sort | `Arrays.parallelSort(arr)` |
| `binarySearch(arr, key)` | Binary search | `Arrays.binarySearch(arr, 5)` |
| `copyOf(arr, length)` | Copy an array | `Arrays.copyOf(arr, 3)` |
| `copyOfRange(arr, from, to)` | Copy a range | `Arrays.copyOfRange(arr, 1, 4)` |
| `fill(arr, value)` | Fill an array | `Arrays.fill(arr, 10)` |
| `equals(arr1, arr2)` | Compare arrays | `Arrays.equals(arr1, arr2)` |
| `asList(arr)` | Convert to List | `Arrays.asList(arr)` |
| `stream(arr)` | Convert to Stream | `Arrays.stream(arr)` |

***

## VIII. Date (Legacy Date Class)

### 1. What Is Date?

`Date` represents a **specific instant**, with millisecond precision.

```java
import java.util.Date;

// Note: Date is a legacy API; LocalDateTime is recommended from JDK 8 onward
```

***

### 2. Common Methods

```java
// 1. Get the current time
Date now = new Date();
System.out.println(now);  // Sun Jan 07 12:30:45 CST 2024

// 2. Create from a millisecond value
Date date = new Date(1704067200000L);

// 3. Get the millisecond value
long time = now.getTime();

// 4. Set the millisecond value
now.setTime(1704067200000L);

// 5. Compare times
Date date1 = new Date();
Date date2 = new Date(date1.getTime() + 1000);
System.out.println(date1.before(date2));  // true
System.out.println(date1.after(date2));   // false
```

***

## IX. SimpleDateFormat

### 1. What Is SimpleDateFormat?

`SimpleDateFormat` handles **date formatting and parsing**.

```java
import java.text.SimpleDateFormat;
```

***

### 2. Date Formatting

```java
Date now = new Date();

// Create a formatter
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

// Format: Date → String
String str = sdf.format(now);  // "2024-01-07 12:30:45"
```

***

### 3. Date Parsing

```java
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

// Parse: String → Date (throws the checked ParseException on invalid input)
Date date = sdf.parse("2024-01-07 12:30:45");
```

***

### 4. Pattern Symbols

| Symbol | Meaning | Example |
| ------ | -------- | ---- |
| `yyyy` | Year (4 digits) | 2024 |
| `yy` | Year (2 digits) | 24 |
| `MM` | Month (2 digits) | 01 |
| `dd` | Day (2 digits) | 07 |
| `HH` | Hour (24-hour clock) | 14 |
| `hh` | Hour (12-hour clock) | 02 |
| `mm` | Minute | 30 |
| `ss` | Second | 45 |
| `SSS` | Millisecond | 123 |
| `E` / `EEEE` | Day of week (short / full name) | Sun / Sunday |
| `a` | AM/PM | PM |

```java
// Common patterns
SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");  // 2024-01-07
SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");  // 2024/01/07 12:30:45
SimpleDateFormat sdf3 = new SimpleDateFormat("MMM d, yyyy", Locale.US);  // Jan 7, 2024 (month names depend on the locale)
```

***

## X. LocalDateTime, LocalDate and LocalTime (JDK 8+)

### 1. Overview

JDK 8 introduced a more concise, thread-safe date and time API.

| Class | Description |
| --------------- | ------------ |
| `LocalDate` | Date (year, month, day) |
| `LocalTime` | Time (hour, minute, second) |
| `LocalDateTime` | Date and time (year, month, day, hour, minute, second) |

```java
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
```

***

### 2. Creating Objects

```java
// Get the current date/time
LocalDate today = LocalDate.now();  // 2024-01-07
LocalTime now = LocalTime.now();    // 12:30:45.123
LocalDateTime dateTime = LocalDateTime.now();  // 2024-01-07T12:30:45.123

// Specify a date/time
LocalDate date = LocalDate.of(2024, 1, 7);
LocalTime time = LocalTime.of(12, 30, 45);
LocalDateTime dt = LocalDateTime.of(2024, 1, 7, 12, 30, 45);

// Parse a string
LocalDate date2 = LocalDate.parse("2024-01-07");
LocalDateTime dt2 = LocalDateTime.parse("2024-01-07T12:30:45");
```

***

### 3. Retrieving Date/Time Information

```java
LocalDateTime dt = LocalDateTime.now();

// Get year, month and day
int year = dt.getYear();          // 2024
int month = dt.getMonthValue();   // 1
int day = dt.getDayOfMonth();     // 7
int dayOfYear = dt.getDayOfYear();  // 7 (day of year)
int dayOfWeek = dt.getDayOfWeek().getValue();  // 7 (Sunday)

// Get hour, minute and second
int hour = dt.getHour();    // 12
int minute = dt.getMinute();  // 30
int second = dt.getSecond();  // 45
```

***

### 4. Date/Time Arithmetic

```java
LocalDateTime dt = LocalDateTime.now();

// Add time
LocalDateTime dt1 = dt.plusYears(1);     // Add 1 year
LocalDateTime dt2 = dt.plusMonths(2);    // Add 2 months
LocalDateTime dt3 = dt.plusDays(10);     // Add 10 days
LocalDateTime dt4 = dt.plusHours(5);     // Add 5 hours
LocalDateTime dt5 = dt.plusMinutes(30);  // Add 30 minutes

// Subtract time
LocalDateTime dt6 = dt.minusYears(1);    // Subtract 1 year
LocalDateTime dt7 = dt.minusDays(10);    // Subtract 10 days

// Change date/time fields
LocalDateTime dt8 = dt.withYear(2025);   // Change the year
LocalDateTime dt9 = dt.withMonth(6);     // Change the month
LocalDateTime dt10 = dt.withDayOfMonth(15);  // Change the day
```

***

### 5. Date Comparison

```java
LocalDate date1 = LocalDate.of(2024, 1, 7);
LocalDate date2 = LocalDate.of(2024, 1, 10);

// Compare
System.out.println(date1.isBefore(date2));  // true
System.out.println(date1.isAfter(date2));   // false
System.out.println(date1.isEqual(date2));   // false

// Compare ordering
int result = date1.compareTo(date2);  // -3 (less than)
```

***

### 6. Converting Between LocalDate / LocalTime / LocalDateTime

```java
LocalDateTime dt = LocalDateTime.now();

// LocalDateTime → LocalDate / LocalTime
LocalDate date = dt.toLocalDate();
LocalTime time = dt.toLocalTime();

// LocalDate + LocalTime → LocalDateTime
LocalDateTime dt2 = LocalDateTime.of(date, time);
LocalDateTime dt3 = date.atTime(time);
LocalDateTime dt4 = time.atDate(date);
```

***

## XI. DateTimeFormatter

### 1. What Is DateTimeFormatter?

`DateTimeFormatter` handles **formatting and parsing for the modern date/time API**.

```java
import java.time.format.DateTimeFormatter;
```

***

### 2. Formatting

```java
LocalDateTime dt = LocalDateTime.now();

// 1. Use a predefined format
String str1 = dt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
// 2024-01-07T12:30:45.123 (the fraction is printed only when non-zero)

// 2. Custom format
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String str2 = dt.format(formatter);  // 2024-01-07 12:30:45

// Or
String str3 = formatter.format(dt);  // 2024-01-07 12:30:45
```

***

### 3. Parsing

```java
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

// Parse a string
LocalDateTime dt = LocalDateTime.parse("2024-01-07 12:30:45", formatter);
```

***

### 4. Common Patterns

```java
// Common patterns
DateTimeFormatter f1 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
DateTimeFormatter f2 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
DateTimeFormatter f3 = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy 'at' HH:mm", Locale.US);  // Sunday, January 7, 2024 at 12:30 (quoted text is literal)
DateTimeFormatter f4 = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
```

***

## XII. Instant

### 1. What Is Instant?

`Instant` represents **an instant on the timeline** (a timestamp), with nanosecond precision.

```java
import java.time.Instant;
```

***

### 2. Common Methods

```java
// Get the current instant
Instant now = Instant.now();
System.out.println(now);  // 2024-01-07T04:30:45.123456789Z (UTC)

// Get seconds and nanoseconds
long epochSecond = now.getEpochSecond();  // Seconds since 1970
int nano = now.getNano();  // Nanosecond fraction

// Create from seconds
Instant instant1 = Instant.ofEpochSecond(1704067200);

// Create from milliseconds
Instant instant2 = Instant.ofEpochMilli(1704067200000L);

// Convert to milliseconds
long millis = now.toEpochMilli();

// Time arithmetic
Instant later = now.plusSeconds(60);  // Add 60 seconds
Instant earlier = now.minusSeconds(60);  // Subtract 60 seconds
```

***

### 3. Converting Between Legacy and Modern APIs

```java
// Date → Instant
Date date = new Date();
Instant instant = date.toInstant();

// Instant → Date
Date date2 = Date.from(instant);

// Instant → LocalDateTime (requires a time zone)
LocalDateTime ldt = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());

// LocalDateTime → Instant (requires a time zone)
Instant instant2 = ldt.atZone(ZoneId.systemDefault()).toInstant();
```

***

## XIII. ChronoUnit

### 1. What Is ChronoUnit?

`ChronoUnit` is a **time-unit enum** used to calculate time differences.

```java
import java.time.temporal.ChronoUnit;
```

***

### 2. Calculating Time Differences

```java
LocalDateTime dt1 = LocalDateTime.of(2024, 1, 1, 0, 0, 0);
LocalDateTime dt2 = LocalDateTime.of(2024, 1, 10, 12, 30, 0);

// Calculate the difference in days
long days = ChronoUnit.DAYS.between(dt1, dt2);  // 9

// Calculate the difference in hours
long hours = ChronoUnit.HOURS.between(dt1, dt2);  // 228

// Calculate the difference in minutes
long minutes = ChronoUnit.MINUTES.between(dt1, dt2);  // 13710

// Calculate the difference in seconds
long seconds = ChronoUnit.SECONDS.between(dt1, dt2);  // 822600
```

***

### 3. Time Unit Constants

| Enum constant | Meaning |
| -------------------- | -- |
| `ChronoUnit.YEARS` | Years |
| `ChronoUnit.MONTHS` | Months |
| `ChronoUnit.WEEKS` | Weeks |
| `ChronoUnit.DAYS` | Days |
| `ChronoUnit.HOURS` | Hours |
| `ChronoUnit.MINUTES` | Minutes |
| `ChronoUnit.SECONDS` | Seconds |
| `ChronoUnit.MILLIS` | Milliseconds |
| `ChronoUnit.NANOS` | Nanoseconds |

***

### 4. Using Duration and Period

```java
import java.time.Duration;
import java.time.Period;

// Period: date differences (years, months, days)
LocalDate date1 = LocalDate.of(2024, 1, 1);
LocalDate date2 = LocalDate.of(2024, 3, 15);
Period period = Period.between(date1, date2);
System.out.println(period.getYears());   // 0
System.out.println(period.getMonths());  // 2
System.out.println(period.getDays());    // 14

// Duration: time differences (hours, minutes, seconds)
LocalDateTime dt1 = LocalDateTime.of(2024, 1, 1, 0, 0, 0);
LocalDateTime dt2 = LocalDateTime.of(2024, 1, 1, 12, 30, 45);
Duration duration = Duration.between(dt1, dt2);
System.out.println(duration.toHours());    // 12
System.out.println(duration.toMinutes());  // 750
System.out.println(duration.toSeconds());  // 45045 (JDK 9+; use getSeconds() on JDK 8)
System.out.println(duration.toDays());     // 0
```

***

## XIV. Quick Reference

### 1. Utility Classes

| Utility class | Purpose | Common methods |
| ------------ | ---- | ------------------------------------------------------- |
| `Math` | Mathematics | `abs()`, `max()`, `min()`, `pow()`, `sqrt()`, `round()` |
| `System` | System utilities | `currentTimeMillis()`, `arraycopy()`, `getProperty()` |
| `Random` | Random numbers | `nextInt()`, `nextDouble()`, `nextBoolean()` |
| `Objects` | Object utilities | `isNull()`, `nonNull()`, `equals()`, `requireNonNull()` |
| `Arrays` | Array utilities | `sort()`, `binarySearch()`, `copyOf()`, `toString()` |
| `BigDecimal` | Exact arithmetic | `add()`, `subtract()`, `multiply()`, `divide()` |

### 2. Date/Time Class Comparison

| Class | Description | Version | Thread-safe |
| ------------------- | ------ | ------- | ---- |
| `Date` | Date and time | JDK 1.0 | ❌ |
| `SimpleDateFormat` | Formatting (legacy) | JDK 1.1 | ❌ |
| `LocalDate` | Date | JDK 8 | ✅ |
| `LocalTime` | Time | JDK 8 | ✅ |
| `LocalDateTime` | Date and time | JDK 8 | ✅ |
| `Instant` | Timestamp | JDK 8 | ✅ |
| `DateTimeFormatter` | Formatting (modern) | JDK 8 | ✅ |
| `ChronoUnit` | Time units | JDK 8 | ✅ |

### 3. Legacy vs Modern APIs

| Function | Legacy API | Modern API (JDK 8+) |
| ------ | ---------------------------- | --------------------------- |
| Get current time | `new Date()` | `LocalDateTime.now()` |
| Get a timestamp | `System.currentTimeMillis()` | `Instant.now()` |
| Formatting | `SimpleDateFormat` | `DateTimeFormatter` |
| Time arithmetic | `Calendar` | `plusDays()`, `minusDays()` |
| Time difference | Manual calculation | `ChronoUnit.DAYS.between()` |

### 4. Recommended Usage

```java
// ✅ Recommended: modern JDK 8+ API
LocalDateTime now = LocalDateTime.now();
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String str = now.format(formatter);

// ❌ Not recommended: legacy API
Date date = new Date();
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
String str2 = sdf.format(date);
```
