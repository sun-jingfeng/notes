## I. The String Class

### 1. What Is String?

**String** is Java's class for representing strings. It is in the `java.lang` package (no import required).

```java
String name = "Alice";
String message = "Hello World";
```

### 2. Characteristics of String

| Characteristic         | Description                   |
| ---------- | -------------------- |
| **Immutability**   | Once a String object is created, its contents cannot change |
| **String pool** | String literals are stored in the pool and can be reused    |
| **Thread safety**   | Immutability makes strings inherently thread-safe       |

### 3. Creating Strings

```java
// ========== Option 1: Direct assignment (recommended) ==========
String s1 = "Hello";
// Stored in the string pool and reusable

// ========== Option 2: The new keyword ==========
String s2 = new String("Hello");
// Stored on the heap; creates a new object each time

// ========== Option 3: Convert a character array ==========
char[] chars = {'H', 'e', 'l', 'l', 'o'};
String s3 = new String(chars);

// Use part of the array
String s4 = new String(chars, 1, 3);  // "ell" (3 characters starting at index 1)

// ========== Option 4: Convert a byte array ==========
byte[] bytes = {72, 101, 108, 108, 111};
String s5 = new String(bytes);  // "Hello"

// Specify the encoding
String s6 = new String(bytes, StandardCharsets.UTF_8);
```

### 4. String Immutability (Important)

```java
String s = "Hello";
s = "World";  // Creates a new string instead of changing the original

// Memory changes:
// 1. The "Hello" object still exists in the string pool
// 2. "World" is a newly created object
// 3. Only the object referenced by s has changed
```

**Diagram:**

    Before reassignment:
    s ────→ "Hello"

    After reassignment:
    s ────→ "World"
             "Hello"  ← Still exists; awaits garbage collection if there are no other references

**Why was String designed to be immutable?**

```java
// The String class is final and cannot be subclassed
// Its internal character array is private final
public final class String {
    private final char[] value;  // JDK 8
    // private final byte[] value;  // JDK 9+ (optimized storage)
}

// Benefits of immutability:
// 1. Safety: contents cannot be changed accidentally
// 2. Thread safety: can be shared across threads
// 3. Hash caching: hashCode can be cached to improve HashMap performance, etc.
// 4. String pooling: strings can be reused
```

### 5. The String Pool and intern()

```java
String s1 = "Hello";
String s2 = "Hello";
String s3 = new String("Hello");
String s4 = s3.intern();  // Returns the reference from the string pool

System.out.println(s1 == s2);  // true (both refer to the pooled string)
System.out.println(s1 == s3);  // false (s3 refers to a separate heap object)
System.out.println(s1 == s4);  // true (intern returns the pooled reference)

// The intern() method:
// - If the string exists in the pool, returns the pooled reference
// - Otherwise, adds the string to the pool and returns its pooled reference
```

### 6. Comparing Strings

#### 1. == vs. equals()

```java
String s1 = "Hello";
String s2 = "Hello";
String s3 = new String("Hello");

// == compares references
System.out.println(s1 == s2);      // true (the same pooled object)
System.out.println(s1 == s3);      // false (different objects)

// equals() compares contents
System.out.println(s1.equals(s2)); // true
System.out.println(s1.equals(s3)); // true (identical contents)
```

#### 2. Comparison Methods

| Method                      | Description             |
| ----------------------- | -------------- |
| `==`                    | Compare references (whether they refer to the same object) |
| `equals()`              | Compare contents (case-sensitive)    |
| `equalsIgnoreCase()`    | Compare contents (case-insensitive)    |
| `compareTo()`           | Compare lexicographically      |
| `compareToIgnoreCase()` | Compare lexicographically, ignoring case    |

```java
String s1 = "Hello";
String s2 = "hello";
String s3 = "Apple";

// The equals family
System.out.println(s1.equals(s2));           // false
System.out.println(s1.equalsIgnoreCase(s2)); // true

// The compareTo family
System.out.println(s1.compareTo(s3));        // Positive (H > A)
System.out.println(s1.compareTo("Hello"));   // 0 (equal)
System.out.println(s3.compareTo(s1));        // Negative (A < H)
// Return value: negative (less than), 0 (equal), positive (greater than)
```

### 7. Common String Methods

#### 1. Accessing Content

| Method                              | Description               | Example                                |
| ------------------------------- | ---------------- | --------------------------------- |
| `length()`                      | Get the string length          | `"Hello".length()` → 5            |
| `charAt(int index)`             | Get the character at a given index        | `"Hello".charAt(0)` → 'H'         |
| `indexOf(String str)`           | Find the first occurrence of a substring      | `"Hello".indexOf("l")` → 2        |
| `lastIndexOf(String str)`       | Find the last occurrence of a substring      | `"Hello".lastIndexOf("l")` → 3    |
| `substring(int begin)`          | Extract from begin to the end    | `"Hello".substring(2)` → "llo"    |
| `substring(int begin, int end)` | Extract \[begin, end) | `"Hello".substring(1, 4)` → "ell" |

```java
String s = "Hello World";

System.out.println(s.length());           // 11
System.out.println(s.charAt(0));          // H
System.out.println(s.indexOf("o"));       // 4
System.out.println(s.lastIndexOf("o"));   // 7
System.out.println(s.substring(6));       // World
System.out.println(s.substring(0, 5));    // Hello

// Searching for a string that is absent returns -1
System.out.println(s.indexOf("Java"));    // -1
```

#### 2. Testing Strings

| Method                          | Description                | Version      |
| --------------------------- | ----------------- | ------- |
| `isEmpty()`                 | Check whether the string is empty (length 0)   | JDK 6+  |
| `isBlank()`                 | Check whether it is blank (empty or only whitespace) | JDK 11+ |
| `contains(String str)`      | Check whether it contains a given string       |         |
| `startsWith(String prefix)` | Check whether it starts with a given string      |         |
| `endsWith(String suffix)`   | Check whether it ends with a given string      |         |
| `matches(String regex)`     | Check whether it matches a regular expression       |         |

```java
String s = "Hello World";

System.out.println(s.isEmpty());             // false
System.out.println("".isEmpty());            // true
System.out.println(s.contains("World"));     // true
System.out.println(s.startsWith("Hello"));   // true
System.out.println(s.endsWith("World"));     // true

// JDK 11+: isBlank()
System.out.println("".isBlank());            // true
System.out.println("   ".isBlank());         // true (spaces only)
System.out.println(" \t\n ".isBlank());      // true (whitespace characters)

// Regular expression matching
System.out.println("12345".matches("\\d+")); // true (digits only)
System.out.println("abc".matches("[a-z]+")); // true (lowercase letters only)
```

#### 3. Transformations

| Method                         | Description              | Version      |
| -------------------------- | --------------- | ------- |
| `toUpperCase()`            | Convert to uppercase             |         |
| `toLowerCase()`            | Convert to lowercase             |         |
| `trim()`                   | Remove leading and trailing characters ≤ U+0020 (spaces, tabs, newlines, etc.) |         |
| `strip()`                  | Remove leading and trailing whitespace (including full-width spaces) | JDK 11+ |
| `stripLeading()`           | Remove leading whitespace          | JDK 11+ |
| `stripTrailing()`          | Remove trailing whitespace          | JDK 11+ |
| `replace(old, new)`        | Replace characters or strings        |         |
| `replaceAll(regex, new)`   | Replace all regex matches          |         |
| `replaceFirst(regex, new)` | Replace the first regex match         |         |
| `split(String regex)`      | Split according to a specified pattern      |         |
| `toCharArray()`            | Convert to a character array         |         |
| `getBytes()`               | Convert to a byte array         |         |
| `repeat(int count)`        | Repeat n times          | JDK 11+ |

```java
String s = "  Hello World  ";

// Case conversion
System.out.println(s.toUpperCase());         // "  HELLO WORLD  "
System.out.println(s.toLowerCase());         // "  hello world  "

// Remove whitespace
System.out.println(s.trim());                // "Hello World"
System.out.println(s.strip());               // "Hello World" (JDK 11+)

// Replacement
System.out.println(s.replace("World", "Java"));  // "  Hello Java  "
System.out.println("a1b2c3".replaceAll("\\d", "*")); // "a*b*c*" (replace digits with *)
System.out.println("a1b2c3".replaceFirst("\\d", "*")); // "a*b2c3"

// Splitting
String[] arr = "a,b,c".split(",");           // ["a", "b", "c"]
String[] arr2 = "a,,b,,c".split(",");        // ["a", "", "b", "", "c"]
String[] arr3 = "a  b  c".split("\\s+");     // ["a", "b", "c"] (split on whitespace)

// Conversion
char[] chars = "Hello".toCharArray();        // ['H', 'e', 'l', 'l', 'o']
byte[] bytes = "Hello".getBytes();           // [72, 101, 108, 108, 111]
byte[] utf8 = "你好".getBytes(StandardCharsets.UTF_8);  // 6 bytes: each of these characters takes 3 bytes in UTF-8

// JDK 11+: repetition
System.out.println("Ha".repeat(3));          // "HaHaHa"
System.out.println("-".repeat(10));          // "----------"
```

#### 4. Static Methods

| Method                                 | Description         | Version     |
| ---------------------------------- | ---------- | ------ |
| `String.valueOf(...)`              | Convert another type to a string |        |
| `String.join(delimiter, elements)` | Join strings with a delimiter  | JDK 8+ |
| `String.format(format, args)`      | Format a string     |        |

```java
// valueOf: convert to a string
String s1 = String.valueOf(123);      // "123"
String s2 = String.valueOf(3.14);     // "3.14"
String s3 = String.valueOf(true);     // "true"
String s4 = String.valueOf(new char[]{'a', 'b', 'c'});  // "abc"

// join: join strings (JDK 8+)
String s5 = String.join(",", "a", "b", "c");  // "a,b,c"
String s6 = String.join("-", Arrays.asList("2024", "01", "15"));  // "2024-01-15"
String s7 = String.join("", "Hello", " ", "World");  // "Hello World"

// format: format a string
String s8 = String.format("Name: %s, age: %d", "Alice", 18);  // "Name: Alice, age: 18"
String s9 = String.format("Price: %.2f", 19.9);  // "Price: 19.90"
String s10 = String.format("%05d", 42);  // "00042" (pad with zeros to 5 digits)

// Common format specifiers:
// %s - string
// %d - integer
// %f - floating-point number (%.2f keeps 2 decimal places)
// %n - newline
// %% - percent sign
```

#### 5. New Methods in JDK 11+

```java
// lines(): split into a Stream of lines
String text = "line1\nline2\nline3";
text.lines().forEach(System.out::println);
// line1
// line2
// line3

// Count lines
long lineCount = text.lines().count();  // 3

// Filter out empty lines
String text2 = "line1\n\nline2\n\n";
List<String> nonEmpty = text2.lines()
    .filter(line -> !line.isBlank())
    .collect(Collectors.toList());  // ["line1", "line2"]
```

### 8. Text Blocks (JDK 15+)

```java
// Traditional approach: extensive escaping and concatenation
String html = "<html>\n" +
              "    <body>\n" +
              "        <p>Hello, World</p>\n" +
              "    </body>\n" +
              "</html>";

// Text block: clearer (JDK 15+)
String html2 = """
        <html>
            <body>
                <p>Hello, World</p>
            </body>
        </html>
        """;

// SQL example
String sql = """
        SELECT id, name, age
        FROM user
        WHERE age > 18
        ORDER BY name
        """;

// JSON example
String json = """
        {
            "name": "Alice",
            "age": 18
        }
        """;

// Use variables in a text block
String name = "Alice";
int age = 18;
String formatted = """
        Name: %s
        Age: %d
        """.formatted(name, age);
```

***

## II. The StringBuilder Class

### 1. Why Use StringBuilder?

#### Problem: Inefficient String Concatenation

```java
// ❌ Inefficient approach
String s = "";
for (int i = 0; i < 10000; i++) {
    s = s + i;  // Every concatenation creates a new object
}
// Creates many temporary objects: extremely inefficient!
```

#### Understanding the Cause

    Each concatenation:
    1. Creates a new String object
    2. Copies the original string's contents
    3. Adds the new contents
    4. Leaves the original object awaiting garbage collection

    10000 concatenations = 10000 temporary objects!

### 2. What Is StringBuilder?

**StringBuilder** is a **mutable sequence of characters**. Its contents can be changed directly in the existing object without creating a new object.

| Comparison       | String  | StringBuilder |
| -------- | ------- | ------------- |
| **Mutability**  | Immutable     | Mutable            |
| **Performance**   | Slow concatenation   | Fast concatenation         |
| **Thread safety** | Thread-safe      | Not thread-safe           |
| **Use case** | Strings that rarely change | Frequent concatenation/modification       |

### 3. Creating a StringBuilder

```java
// ========== Option 1: No-argument constructor ==========
StringBuilder sb1 = new StringBuilder();
// Default capacity: 16 characters

// ========== Option 2: Specify capacity ==========
StringBuilder sb2 = new StringBuilder(100);
// Initial capacity: 100 characters (avoids frequent resizing)

// ========== Option 3: Pass a string ==========
StringBuilder sb3 = new StringBuilder("Hello");
// Initial contents: "Hello"; capacity: "Hello".length() + 16 = 21
```

### 4. Common StringBuilder Methods

#### 1. Core Methods

| Method                                        | Description               | Return value          |
| ----------------------------------------- | ---------------- | ------------ |
| `append(...)`                             | Append content             | Returns this object (supports chaining) |
| `insert(int offset, ...)`                 | Insert at a given position          | Returns this object         |
| `delete(int start, int end)`              | Delete \[start, end) | Returns this object         |
| `deleteCharAt(int index)`                 | Delete the character at a given position         | Returns this object         |
| `replace(int start, int end, String str)` | Replace a given range           | Returns this object         |
| `reverse()`                               | Reverse the string            | Returns this object         |
| `toString()`                              | Convert to String       | String       |

#### 2. Code Examples

```java
StringBuilder sb = new StringBuilder();

// ========== append: append content ==========
sb.append("Hello");
sb.append(" ");
sb.append("World");
System.out.println(sb);  // Hello World

// ========== Method chaining (recommended) ==========
sb.append("!").append("!").append("!");
System.out.println(sb);  // Hello World!!!

// append accepts any type
sb.append(123).append(true).append(3.14);

// ========== insert: insert content ==========
sb.insert(0, "Say: ");
System.out.println(sb);  // Say: Hello World!!!123true3.14

// ========== delete: delete content ==========
sb.delete(0, 5);  // Delete "Say: "
System.out.println(sb);  // Hello World!!!123true3.14

// ========== deleteCharAt: delete one character ==========
sb.deleteCharAt(0);  // Delete 'H'
System.out.println(sb);  // ello World!!!123true3.14

// ========== replace: replace content ==========
StringBuilder sb2 = new StringBuilder("Hello World");
sb2.replace(6, 11, "Java");
System.out.println(sb2);  // Hello Java

// ========== reverse: reverse the sequence ==========
StringBuilder sb3 = new StringBuilder("Hello");
sb3.reverse();
System.out.println(sb3);  // olleH

// ========== toString: convert to String ==========
String s = sb3.toString();
```

#### 3. Inspection and Modification Methods

| Method                              | Description          |
| ------------------------------- | ----------- |
| `length()`                      | Get the length in characters      |
| `capacity()`                    | Get the capacity        |
| `charAt(int index)`             | Get the character at a given index    |
| `setCharAt(int index, char ch)` | Change the character at a given index    |
| `setLength(int newLength)`      | Set the length        |
| `ensureCapacity(int min)`       | Ensure capacity is at least min |

```java
StringBuilder sb = new StringBuilder("Hello");

// Length and capacity
System.out.println(sb.length());    // 5
System.out.println(sb.capacity());  // 21 ("Hello".length() + 16)

// Get and modify characters
System.out.println(sb.charAt(0));   // H
sb.setCharAt(0, 'h');
System.out.println(sb);             // hello

// Set the length
sb.setLength(3);
System.out.println(sb);             // hel

sb.setLength(10);
System.out.println(sb.length());    // 10 (extra positions are filled with \0)

// Ensure capacity
sb.ensureCapacity(100);
System.out.println(sb.capacity());  // >= 100
```

### 5. StringBuilder vs. String Performance

```java
// ========== String concatenation (inefficient) ==========
long start1 = System.currentTimeMillis();
String s = "";
for (int i = 0; i < 100000; i++) {
    s = s + i;
}
long end1 = System.currentTimeMillis();
System.out.println("String time: " + (end1 - start1) + "ms");
// Time: varies by machine; often several seconds

// ========== StringBuilder concatenation (efficient) ==========
long start2 = System.currentTimeMillis();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 100000; i++) {
    sb.append(i);
}
String result = sb.toString();
long end2 = System.currentTimeMillis();
System.out.println("StringBuilder time: " + (end2 - start2) + "ms");
// Time: typically a few milliseconds
```

**Conclusion**: In a loop, StringBuilder concatenation is typically **orders of magnitude faster** than repeated String concatenation.

***

## III. The StringBuffer Class

### 1. StringBuffer vs StringBuilder

| Comparison       | StringBuilder | StringBuffer            |
| -------- | ------------- | ----------------------- |
| **Thread safety** | ❌ Not thread-safe         | ✅ Thread-safe (methods use synchronized) |
| **Performance**   | ✅ Faster          | ❌ Slower                    |
| **Use case** | Single-threaded           | Multithreaded                     |
| **Recommendation level** | ⭐⭐⭐⭐⭐         | ⭐⭐⭐                     |

```java
// StringBuffer is used in exactly the same way as StringBuilder
StringBuffer buffer = new StringBuffer();
buffer.append("Hello");
buffer.append(" World");
String s = buffer.toString();
```

### 2. Choosing Between Them

    Single-threaded environment → StringBuilder (faster)
    Multithreaded environment → StringBuffer (thread-safe)
    No modifications needed → String (simple)

***

## IV. Converting Between String and StringBuilder

### 1. String → StringBuilder

```java
String s = "Hello";

// Option 1: Constructor
StringBuilder sb1 = new StringBuilder(s);

// Option 2: append
StringBuilder sb2 = new StringBuilder();
sb2.append(s);
```

### 2. StringBuilder → String

```java
StringBuilder sb = new StringBuilder("Hello");

// Option 1: toString()
String s1 = sb.toString();

// Option 2: Constructor
String s2 = new String(sb);
```

***

## V. The StringJoiner Class (JDK 8+)

### 1. What Is StringJoiner?

**StringJoiner**, introduced in JDK 8, makes joining strings convenient and supports a delimiter, prefix, and suffix.

```java
import java.util.StringJoiner;

// Specify only a delimiter
StringJoiner sj1 = new StringJoiner(",");
sj1.add("a").add("b").add("c");
System.out.println(sj1);  // a,b,c

// Specify a delimiter, prefix, and suffix
StringJoiner sj2 = new StringJoiner(",", "[", "]");
sj2.add("a").add("b").add("c");
System.out.println(sj2);  // [a,b,c]

// Merge two StringJoiner instances
StringJoiner sj3 = new StringJoiner("-");
sj3.add("1").add("2");
sj1.merge(sj3);
System.out.println(sj1);  // a,b,c,1-2
```

### 2. StringJoiner vs String.join()

```java
// String.join(): simple use cases
String s1 = String.join(",", "a", "b", "c");  // a,b,c

// StringJoiner: when a prefix and suffix are needed
StringJoiner sj = new StringJoiner(",", "[", "]");
sj.add("a").add("b").add("c");
String s2 = sj.toString();  // [a,b,c]

// Convert a collection to a string
List<String> list = Arrays.asList("a", "b", "c");
String s3 = String.join(",", list);  // a,b,c
String s4 = list.stream().collect(Collectors.joining(",", "[", "]"));  // [a,b,c]
```

***

## VI. Practical Use Cases

### 1. When to Use String

```java
// Strings that do not need modification
String name = "Alice";
String message = "Welcome";

// A few simple concatenations (automatically optimized by the compiler)
String greeting = "Hello" + " " + "World";

// Format a string
String info = String.format("Name: %s, age: %d", name, 18);
```

### 2. When to Use StringBuilder

```java
// Scenario 1: Concatenation in a loop
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 100; i++) {
    sb.append(i).append(",");
}

// Scenario 2: Building a complex string
StringBuilder sql = new StringBuilder();
sql.append("SELECT * FROM user ")
   .append("WHERE age > 18 ")
   .append("ORDER BY name");

// Scenario 3: Reversing a string
String reversed = new StringBuilder("Hello").reverse().toString();
// "olleH"

// Scenario 4: Dynamic construction
StringBuilder html = new StringBuilder();
html.append("<ul>\n");
for (String item : items) {
    html.append("  <li>").append(item).append("</li>\n");
}
html.append("</ul>");
```

### 3. When to Use String.join() / StringJoiner

```java
// Scenario 1: Join an array/collection with a delimiter
String csv = String.join(",", "a", "b", "c");  // a,b,c

// Scenario 2: Build a path
String path = String.join("/", "home", "user", "documents");  // home/user/documents

// Scenario 3: Add a prefix and suffix
StringJoiner sj = new StringJoiner(", ", "SELECT ", " FROM user");
sj.add("id").add("name").add("age");
String sql = sj.toString();  // SELECT id, name, age FROM user
```

***

## VII. Common Interview Questions

### 1. Why Is String Immutable?

```java
// The String class is final and cannot be subclassed
// Its internal char[] array is private final

public final class String {
    private final char[] value;  // JDK 8
    // private final byte[] value;  // JDK 9+
}

// Benefits:
// 1. Safety: contents cannot be changed accidentally
// 2. Thread safety: can be shared across threads
// 3. Hash caching: hashCode can be cached
// 4. String pooling: strings can be reused
```

### 2. How Many Objects Does String s = "a" + "b" + "c" Create?

```java
String s = "a" + "b" + "c";
// Answer: only 1 object, "abc"
// Reason: the compiler optimizes it to String s = "abc";
```

### 3. How Many Objects Does String s = new String("abc") Create?

```java
String s = new String("abc");
// Answer: 1 or 2 objects
// 1. If "abc" is not in the pool, create "abc" there first
// 2. Then create a String object on the heap
```

### 4. What Should You Use for Concatenation in a Loop?

```java
// ❌ Incorrect
String s = "";
for (int i = 0; i < 1000; i++) {
    s += i;  // Creates a new object each time
}

// ✅ Correct
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String s = sb.toString();
```

### 5. How Do String, StringBuilder, and StringBuffer Differ?

| Characteristic   | String | StringBuilder | StringBuffer |
| ---- | ------ | ------------- | ------------ |
| Mutability  | Immutable    | Mutable            | Mutable           |
| Thread safety | Thread-safe     | Not thread-safe           | Thread-safe           |
| Performance   | Slow concatenation    | High             | Medium            |
| Use case   | Few operations   | Single-threaded concatenation         | Multithreaded concatenation        |

***

## VIII. Common Methods Quick Reference

### 1. String Methods

| Method                       | Description       | Version      |
| ------------------------ | -------- | ------- |
| `length()`               | Get length     |         |
| `charAt(i)`              | Get character     |         |
| `indexOf(s)`             | Find position     |         |
| `lastIndexOf(s)`         | Find last occurrence   |         |
| `substring(begin, end)`  | Extract substring     |         |
| `equals(s)`              | Compare contents     |         |
| `equalsIgnoreCase(s)`    | Compare ignoring case  |         |
| `compareTo(s)`           | Compare lexicographically    |         |
| `contains(s)`            | Check containment     |         |
| `startsWith(s)`          | Check prefix |         |
| `endsWith(s)`            | Check suffix |         |
| `isEmpty()`              | Check for empty string     |         |
| `isBlank()`              | Check for blank string    | JDK 11+ |
| `toUpperCase()`          | Convert to uppercase      |         |
| `toLowerCase()`          | Convert to lowercase      |         |
| `trim()`                 | Trim leading/trailing spaces   |         |
| `strip()`                | Strip leading/trailing whitespace   | JDK 11+ |
| `replace(old, new)`      | Replace       |         |
| `replaceAll(regex, new)` | Replace all regex matches   |         |
| `split(regex)`           | Split       |         |
| `repeat(n)`              | Repeat n times   | JDK 11+ |
| `String.join()`          | Join strings    | JDK 8+  |
| `String.format()`        | Format      |         |

### 2. StringBuilder Methods

| Method                       | Description        |
| ------------------------ | --------- |
| `append(...)`            | Append        |
| `insert(i, ...)`         | Insert        |
| `delete(start, end)`     | Delete        |
| `deleteCharAt(i)`        | Delete character      |
| `replace(start, end, s)` | Replace        |
| `reverse()`              | Reverse        |
| `toString()`             | Convert to String |
| `length()`               | Get length      |
| `capacity()`             | Get capacity      |
| `charAt(i)`              | Get character      |
| `setCharAt(i, ch)`       | Set character      |
| `setLength(n)`           | Set length      |
