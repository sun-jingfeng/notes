## I. Introduction to Arrays

### 1. What Is an Array?

An array is a **container** that stores multiple values **of the same type**.

### 2. Array Characteristics

| Characteristic       | Description               |
| -------- | ---------------- |
| **Fixed type** | An array stores values of one type    |
| **Fixed length** | An array's length cannot change after creation    |
| **Ordered storage** | Elements are stored in index order, starting at 0 |
| **Reference type** | Arrays are reference types        |
| **Contiguous storage** | Elements are stored contiguously in memory for efficient access |

### 3. Why Use Arrays?

```java
// Without an array: declare several variables
int score1 = 90;
int score2 = 85;
int score3 = 78;
int score4 = 92;
int score5 = 88;

// With an array: one variable refers to multiple values
int[] scores = {90, 85, 78, 92, 88};
```

### 4. Array Structure

    Array name: arr
    Index:   [0]    [1]    [2]    [3]    [4]
    Element:  10     20     30     40     50
               ↑                            ↑
            First element                 Last element
            Index 0                       Index length-1

### 5. Arrays vs. Collections

| Comparison  | Array            | Collection (ArrayList) |
| ---- | ------------- | ------------- |
| Length   | **Fixed** after creation | **Variable**; expands automatically   |
| Stored types | Primitive and reference types     | Reference types only (wrapper classes)  |
| Memory   | Contiguous memory; efficient      | Also array-backed, but with additional overhead |
| Capabilities   | Few built-in capabilities; implement operations manually    | Rich API     |
| Use case | Fixed length and performance-sensitive work     | Variable size; frequent additions and removals   |

```java
// Array: fixed length
int[] arr = new int[5];
// arr.add(6);  ❌ Arrays have no add method

// Collection: variable size
ArrayList<Integer> list = new ArrayList<>();
list.add(10);  // ✅ Can add elements
list.add(20);
list.remove(0);  // ✅ Can remove elements
```

***

## II. Array Declarations and Static Initialization

### 1. Static Initialization

**Specify element values directly; the system determines the length**

#### Form 1: Full Syntax

```java
DataType[] arrayName = new DataType[]{element1, element2, element3, ...};
```

```java
int[] arr = new int[]{10, 20, 30, 40, 50};
String[] names = new String[]{"张三", "李四", "王五"};
double[] prices = new double[]{19.9, 29.9, 39.9};
```

#### Form 2: Shorthand (Recommended)

```java
DataType[] arrayName = {element1, element2, element3, ...};
```

```java
int[] arr = {10, 20, 30, 40, 50};
String[] names = {"张三", "李四", "王五"};
double[] prices = {19.9, 29.9, 39.9};
```

### 2. Two Declaration Forms

```java
// Form 1: DataType[] arrayName (recommended)
int[] arr1;
String[] names1;

// Form 2: DataType arrayName[]
int arr2[];
String names2[];

// Both forms are equivalent; form 1 is recommended
```

### 3. Anonymous Arrays

**An unnamed array, usually passed as a method argument**

```java
// Anonymous array: pass directly to a method
printArray(new int[]{10, 20, 30});

// Note: an anonymous array requires the full syntax
// printArray({10, 20, 30});  ❌ Shorthand is not valid for anonymous arrays

public static void printArray(int[] arr) {
    for (int num : arr) {
        System.out.println(num);
    }
}
```

### 4. Static Initialization Examples

```java
public class ArrayDemo {
    public static void main(String[] args) {
        // Integer array
        int[] numbers = {1, 2, 3, 4, 5};

        // Floating-point array
        double[] prices = {9.9, 19.9, 29.9};

        // Character array
        char[] chars = {'a', 'b', 'c', 'd'};

        // String array
        String[] names = {"张三", "李四", "王五"};

        // Boolean array
        boolean[] flags = {true, false, true};

        // Print the array variable (displays the type and a hash code)
        System.out.println(numbers);  // [I@1b6d3586
        System.out.println(names);    // [Ljava.lang.String;@4554617c
    }
}
```

### 5. Understanding Printed Arrays

```java
int[] arr = {10, 20, 30};
System.out.println(arr);  // [I@1b6d3586

// Interpretation:
// [  → An array
// I  → Element type is int
// @  → Separator
// 1b6d3586 → Identity hash code in hexadecimal (not an actual memory address)

// Identifiers for other types:
// [I  → int[]
// [D  → double[]
// [C  → char[]
// [Z  → boolean[]
// [B  → byte[]
// [S  → short[]
// [J  → long[]
// [F  → float[]
// [Ljava.lang.String; → String[]
// [[I → int[][] (two-dimensional array)
```

***

## III. Accessing Array Elements

### 1. Access Syntax

```java
// Read an element
DataType value = arrayName[index];

// Modify an element
arrayName[index] = newValue;
```

### 2. Index Characteristics

    Indices start at 0 and end at length-1

    int[] arr = {10, 20, 30, 40, 50};

    Index:    0    1    2    3    4
    Element: 10   20   30   40   50

    First element: arr[0] = 10
    Last element: arr[4] = 50 or arr[arr.length - 1]

### 3. Access Examples

```java
public class ArrayAccessDemo {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};

        // Read an element
        System.out.println(arr[0]);  // 10
        System.out.println(arr[2]);  // 30
        System.out.println(arr[4]);  // 50

        // Get the array length
        System.out.println(arr.length);  // 5

        // Get the last element
        System.out.println(arr[arr.length - 1]);  // 50

        // Modify an element
        arr[0] = 100;
        arr[2] = 300;
        System.out.println(arr[0]);  // 100
        System.out.println(arr[2]);  // 300

        // Use elements in calculations
        int sum = arr[0] + arr[1];
        System.out.println(sum);  // 120
    }
}
```

### 4. The Array length Field

```java
int[] arr = {10, 20, 30, 40, 50};

// length is an array field, not a method, so it has no parentheses
int len = arr.length;  // 5

// Note: length is a field, not a method
int n1 = arr.length;       // ✅ Correct
// int n2 = arr.length();  // ❌ Incorrect

// In contrast, String's length is a method
String str = "Hello";
int n3 = str.length();     // ✅ Correct (String uses a method)
```

***

## IV. Iterating Over Arrays

### 1. What Is Iteration?

Iteration means **accessing each array element in turn**.

### 2. Iteration with a for Loop

```java
int[] arr = {10, 20, 30, 40, 50};

// Forward iteration
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}

// Reverse iteration
for (int i = arr.length - 1; i >= 0; i--) {
    System.out.println(arr[i]);
}
```

### 3. Enhanced for Loop (foreach)

```java
int[] arr = {10, 20, 30, 40, 50};

// Enhanced for loop
for (int num : arr) {
    System.out.println(num);
}

// Syntax: for (ElementType variableName : arrayName)
// Each iteration automatically assigns the next element to the variable
```

### 4. Stream-Based Iteration (JDK 8+)

```java
import java.util.Arrays;
import java.util.stream.IntStream;

int[] arr = {10, 20, 30, 40, 50};

// Option 1: Arrays.stream()
Arrays.stream(arr).forEach(System.out::println);

// Option 2: Iterate with indices
IntStream.range(0, arr.length)
    .forEach(i -> System.out.println("Index " + i + ": " + arr[i]));

// Option 3: Stream operations (filtering, mapping, etc.)
int sum = Arrays.stream(arr)
    .filter(n -> n > 20)   // Filter: retain only values greater than 20
    .map(n -> n * 2)       // Map: multiply each element by 2
    .sum();                // Sum
System.out.println(sum);   // 240
```

### 5. Comparing the Three Approaches

| Feature   | Basic for | Enhanced for    | Streams        |
| ---- | ------ | --------- | ----------- |
| Index access | ✅ Index i available | ❌ No index    | Possible         |
| Modify elements | ✅ Can modify | ❌ Cannot modify the original array | ❌ Cannot modify the original array   |
| Conciseness | Average     | Concise        | Most concise (chaining)   |
| Use case | When indices are needed  | When only reading     | When filtering/mapping/aggregation is needed |

```java
int[] arr = {10, 20, 30};

// Basic for: access indices and modify elements
for (int i = 0; i < arr.length; i++) {
    arr[i] = arr[i] * 2;  // Can modify
    System.out.println("Index " + i + ": " + arr[i]);
}

// Enhanced for: read values; does not modify the original array
for (int num : arr) {
    num = num * 2;  // Changes only the temporary variable, not the array
    System.out.println(num);
}

// Streams: suitable for complex operations
int max = Arrays.stream(arr).max().orElse(0);
```

### 6. Iteration Examples

#### Example 1: Sum Array Elements

```java
int[] arr = {10, 20, 30, 40, 50};

// Option 1: Basic for
int sum1 = 0;
for (int i = 0; i < arr.length; i++) {
    sum1 += arr[i];
}

// Option 2: Enhanced for
int sum2 = 0;
for (int num : arr) {
    sum2 += num;
}

// Option 3: Stream (recommended)
int sum3 = Arrays.stream(arr).sum();

System.out.println("Sum: " + sum3);  // 150
```

#### Example 2: Maximum and Minimum

```java
int[] arr = {15, 23, 8, 46, 12};

// Option 1: Basic for
int max = arr[0];
int min = arr[0];
for (int i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
}

// Option 2: Stream (recommended)
int max2 = Arrays.stream(arr).max().orElse(0);
int min2 = Arrays.stream(arr).min().orElse(0);

System.out.println("Maximum: " + max2);  // 46
System.out.println("Minimum: " + min2);  // 8
```

#### Example 3: Average

```java
int[] arr = {10, 20, 30, 40, 50};

// Option 1: Calculate manually
int sum = 0;
for (int num : arr) {
    sum += num;
}
double avg1 = (double) sum / arr.length;

// Option 2: Stream (recommended)
double avg2 = Arrays.stream(arr).average().orElse(0);

System.out.println("Average: " + avg2);  // 30.0
```

#### Example 4: Count Elements

```java
int[] arr = {15, 23, 8, 46, 12, 35, 28};

// Option 1: Ordinary iteration
int count1 = 0;
for (int num : arr) {
    if (num > 20) count1++;
}

// Option 2: Stream (recommended)
long count2 = Arrays.stream(arr).filter(n -> n > 20).count();

System.out.println("Count greater than 20: " + count2);  // 4
```

***

## V. Dynamic Array Initialization

### 1. Dynamic Initialization

**Specify only the array length; the system supplies default values**

#### Syntax

```java
DataType[] arrayName = new DataType[length];
```

#### Examples

```java
// Create an int array of length 5
int[] arr = new int[5];

// Create a String array of length 3
String[] names = new String[3];

// Create a double array of length 10
double[] prices = new double[10];
```

### 2. Default Values

| Data type                   | Default value           |
| ---------------------- | ------------- |
| byte, short, int, long | 0             |
| float, double          | 0.0           |
| char                   | '\u0000' (null character) |
| boolean                | false         |
| Reference types (String, etc.)          | null          |

### 3. Dynamic Initialization Examples

```java
public class DynamicArrayDemo {
    public static void main(String[] args) {
        // Integer array; default value is 0
        int[] arr1 = new int[5];
        System.out.println(arr1[0]);  // 0
        System.out.println(arr1[4]);  // 0

        // Floating-point array; default value is 0.0
        double[] arr2 = new double[3];
        System.out.println(arr2[0]);  // 0.0

        // Boolean array; default value is false
        boolean[] arr3 = new boolean[3];
        System.out.println(arr3[0]);  // false

        // String array; default value is null
        String[] arr4 = new String[3];
        System.out.println(arr4[0]);  // null

        // Assign values after dynamic initialization
        arr1[0] = 10;
        arr1[1] = 20;
        arr4[0] = "张三";
        arr4[1] = "李四";
    }
}
```

### 4. Static vs. Dynamic Initialization

| Feature   | Static initialization                   | Dynamic initialization                    |
| ---- | ----------------------- | ------------------------ |
| Syntax   | `int[] arr = {1, 2, 3}` | `int[] arr = new int[3]` |
| Element values  | Specified directly                    | System defaults                    |
| Use case | Element values are known                   | Only the length is known                    |

### 5. Use Cases

```java
// Static initialization: known data
int[] scores = {90, 85, 78, 92, 88};  // Known student scores

// Dynamic initialization: assign values later
Scanner sc = new Scanner(System.in);
int[] arr = new int[5];  // Create the array first

// Populate from keyboard input
for (int i = 0; i < arr.length; i++) {
    System.out.print("Enter number " + (i + 1) + ": ");
    arr[i] = sc.nextInt();
}
```

***

## VI. Arrays in Memory

### 1. Java Memory Areas

    ┌──────────────────────────────────────────────────┐
    │                    JVM Memory                    │
    ├──────────────────────────────────────────────────┤
    │                                                  │
    │  ┌────────────┐  ┌────────────┐  ┌─────────────┐ │
    │  │   Stack    │  │    Heap    │  │ Method area │ │
    │  │            │  │            │  │ (Metaspace) │ │
    │  ├────────────┤  ├────────────┤  ├─────────────┤ │
    │  │ Local vars │  │ Objects    │  │ Class info  │ │
    │  │ Calls      │  │ and arrays │  │ Const pool  │ │
    │  │            │  │ from new   │  │ Bytecode    │ │
    │  └────────────┘  └────────────┘  └─────────────┘ │
    │                                                  │
    └──────────────────────────────────────────────────┘

### 2. Array Memory Allocation

```java
int[] arr = new int[]{10, 20, 30};
```

**Memory diagram:**

    Stack                  Heap
    ┌─────────────┐      ┌─────────────────┐
    │   arr       │      │  int[]          │
    │ ┌─────────┐ │      │ ┌─────────────┐ │
    │ │0x001    │─┼──────┼→│ [0] = 10    │ │
    │ └─────────┘ │      │ ├─────────────┤ │
    │             │      │ │ [1] = 20    │ │
    └─────────────┘      │ ├─────────────┤ │
                         │ │ [2] = 30    │ │
                         │ └─────────────┘ │
                         │ length = 3      │
                         └─────────────────┘
                             Address: 0x001

### 3. Two Variables Referring to One Array

```java
int[] arr1 = {10, 20, 30};
int[] arr2 = arr1;  // arr2 and arr1 refer to the same array

arr2[0] = 100;
System.out.println(arr1[0]);  // 100 (arr1 sees the changed value too)
```

**Memory diagram:**

    Stack                  Heap
    ┌─────────────┐      ┌─────────────────┐
    │   arr1      │      │  int[]          │
    │ ┌─────────┐ │      │ ┌─────────────┐ │
    │ │0x001    │─┼──┬───┼→│ [0] = 100   │ │
    │ └─────────┘ │  │   │ ├─────────────┤ │
    │   arr2      │  │   │ │ [1] = 20    │ │
    │ ┌─────────┐ │  │   │ ├─────────────┤ │
    │ │0x001    │─┼──┘   │ │ [2] = 30    │ │
    │ └─────────┘ │      │ └─────────────┘ │
    └─────────────┘      └─────────────────┘
                             Address: 0x001

### 4. Two Independent Arrays

```java
int[] arr1 = {10, 20, 30};
int[] arr2 = {10, 20, 30};  // Creates a new array

arr2[0] = 100;
System.out.println(arr1[0]);  // 10 (arr1 is unaffected)
```

**Memory diagram:**

    Stack                  Heap
    ┌─────────────┐      ┌─────────────────┐
    │   arr1      │      │  int[]          │
    │ ┌─────────┐ │      │ ┌─────────────┐ │
    │ │0x001    │─┼──────┼→│ [0] = 10    │ │
    │ └─────────┘ │      │ ├─────────────┤ │
    │   arr2      │      │ │ [1] = 20    │ │
    │ ┌─────────┐ │      │ ├─────────────┤ │
    │ │0x002    │─┼──┐   │ │ [2] = 30    │ │
    │ └─────────┘ │  │   │ └─────────────┘ │
    └─────────────┘  │   │ Address: 0x001  │
                     │   ├─────────────────┤
                     │   │  int[]          │
                     │   │ ┌─────────────┐ │
                     └───┼→│ [0] = 100   │ │
                         │ ├─────────────┤ │
                         │ │ [1] = 20    │ │
                         │ ├─────────────┤ │
                         │ │ [2] = 30    │ │
                         │ └─────────────┘ │
                         │ Address: 0x002  │
                         └─────────────────┘

### 5. Arrays as Method Parameters

```java
public class ArrayParamDemo {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30};
        System.out.println("Before call: " + arr[0]);  // 10

        change(arr);
        System.out.println("After call: " + arr[0]);  // 100
    }

    public static void change(int[] arr) {
        arr[0] = 100;  // Modifies data on the heap
    }
}
```

**Explanation:** Passing an array passes its **reference value**; modifying its elements inside the method affects the original array.

***

## VII. Common Array Problems

### 1. Array Index Out of Bounds

```java
int[] arr = {10, 20, 30};

// Access a nonexistent index
System.out.println(arr[3]);  // ArrayIndexOutOfBoundsException

// Index range: 0 ~ arr.length-1
// Valid indices for arr: 0, 1, 2
```

**Exception message:**

    Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException:
    Index 3 out of bounds for length 3

### 2. NullPointerException

```java
int[] arr = null;

// Operate on a null reference
System.out.println(arr.length);  // NullPointerException
System.out.println(arr[0]);      // NullPointerException
```

**Exception message:**

    Exception in thread "main" java.lang.NullPointerException

### 3. Avoiding Exceptions

```java
int[] arr = {10, 20, 30};

// Avoid out-of-bounds access: check the index range
int index = 5;
if (index >= 0 && index < arr.length) {
    System.out.println(arr[index]);
} else {
    System.out.println("Index out of bounds");
}

// Avoid null-pointer access: check for null
int[] arr2 = null;
if (arr2 != null && arr2.length > 0) {
    System.out.println(arr2.length);
} else {
    System.out.println("Array is null");
}
```

### 4. Common Errors

| Error                             | Cause          | Solution               |
| ------------------------------ | ----------- | ------------------ |
| ArrayIndexOutOfBoundsException | Index outside the valid range      | Check that the index is within 0 \~ length-1 |
| NullPointerException           | Array is null     | Check for null before use       |
| Data type mismatch                        | Element type does not match the array type | Use compatible types             |
| Negative index                           | The index is negative       | Index must be >= 0          |

***

## VIII. Two-Dimensional Arrays

### 1. What Is a Two-Dimensional Array?

A two-dimensional array is an array **whose elements are one-dimensional arrays**, often viewed as a table.

    One-dimensional array: one row of data
    [10, 20, 30, 40, 50]

    Two-dimensional array: multiple rows of data (a table)
    ┌────┬────┬────┐
    │ 10 │ 20 │ 30 │  → Row 0
    ├────┼────┼────┤
    │ 40 │ 50 │ 60 │  → Row 1
    ├────┼────┼────┤
    │ 70 │ 80 │ 90 │  → Row 2
    └────┴────┴────┘
      ↑    ↑    ↑
     Col 0 Col 1 Col 2

### 2. Static Initialization of Two-Dimensional Arrays

```java
// Form 1: Full syntax
DataType[][] arrayName = new DataType[][]{{elements}, {elements}, {elements}};

// Form 2: Shorthand
DataType[][] arrayName = {{elements}, {elements}, {elements}};
```

**Example:**

```java
// Static initialization
int[][] arr = {
    {10, 20, 30},
    {40, 50, 60},
    {70, 80, 90}
};

// Equivalent to
int[][] arr2 = new int[][]{{10, 20, 30}, {40, 50, 60}, {70, 80, 90}};
```

### 3. Dynamic Initialization of Two-Dimensional Arrays

```java
// Form 1: Rectangular array (same number of columns per row)
DataType[][] arrayName = new DataType[rowCount][columnCount];

// Form 2: Ragged array (rows may have different lengths)
DataType[][] arrayName = new DataType[rowCount][];
```

**Example:**

```java
// Rectangular array: 3 rows, 4 columns
int[][] arr1 = new int[3][4];

// Ragged (jagged) array
int[][] arr2 = new int[3][];
arr2[0] = new int[2];  // Row 0: 2 columns
arr2[1] = new int[3];  // Row 1: 3 columns
arr2[2] = new int[4];  // Row 2: 4 columns
```

### 4. Accessing Two-Dimensional Array Elements

```java
int[][] arr = {
    {10, 20, 30},
    {40, 50, 60},
    {70, 80, 90}
};

// Read an element: arrayName[rowIndex][columnIndex]
System.out.println(arr[0][0]);  // 10
System.out.println(arr[1][2]);  // 60
System.out.println(arr[2][1]);  // 80

// Get the row count
System.out.println(arr.length);  // 3

// Get the column count of a given row
System.out.println(arr[0].length);  // 3
System.out.println(arr[1].length);  // 3

// Modify an element
arr[0][0] = 100;
arr[2][2] = 900;
```

### 5. Iterating Over Two-Dimensional Arrays

```java
int[][] arr = {
    {10, 20, 30},
    {40, 50, 60},
    {70, 80, 90}
};

// Option 1: Basic for loops
for (int i = 0; i < arr.length; i++) {           // Iterate over rows
    for (int j = 0; j < arr[i].length; j++) {    // Iterate over columns
        System.out.print(arr[i][j] + "\t");
    }
    System.out.println();
}

// Option 2: Enhanced for loops
for (int[] row : arr) {           // Iterate over rows
    for (int num : row) {         // Iterate over each element in a row
        System.out.print(num + "\t");
    }
    System.out.println();
}

// Option 3: Streams
Arrays.stream(arr)
    .flatMapToInt(Arrays::stream)  // Flatten to a one-dimensional stream
    .forEach(System.out::println);
```

**Output:**

    10	20	30
    40	50	60
    70	80	90

### 6. Two-Dimensional Arrays in Memory

```java
int[][] arr = new int[2][3];
```

**Memory diagram:**

    Stack                  Heap
    ┌─────────────┐      ┌────────────────────────────────────────────────┐
    │   arr       │      │  int[][] (0x001)        int[] (0x100)          │
    │ ┌─────────┐ │      │ ┌─────────────┐         ┌───────────────────┐  │
    │ │0x001    │─┼──────┼→│ [0] = 0x100 │────────→│ [0]=0 [1]=0 [2]=0 │  │
    │ └─────────┘ │      │ ├─────────────┤         └───────────────────┘  │
    │             │      │ │ [1] = 0x200 │──┐      int[] (0x200)          │
    └─────────────┘      │ └─────────────┘  │      ┌───────────────────┐  │
                         │                  └─────→│ [0]=0 [1]=0 [2]=0 │  │
                         │                         └───────────────────┘  │
                         └────────────────────────────────────────────────┘

### 7. Two-Dimensional Array Examples

#### Example 1: Sum All Elements

```java
int[][] arr = {
    {10, 20, 30},
    {40, 50, 60},
    {70, 80, 90}
};

// Option 1: Ordinary iteration
int sum1 = 0;
for (int i = 0; i < arr.length; i++) {
    for (int j = 0; j < arr[i].length; j++) {
        sum1 += arr[i][j];
    }
}

// Option 2: Stream (recommended)
int sum2 = Arrays.stream(arr)
    .flatMapToInt(Arrays::stream)
    .sum();

System.out.println("Sum: " + sum2);  // 450
```

#### Example 2: Print Pascal's Triangle

```java
int[][] arr = new int[10][];

for (int i = 0; i < arr.length; i++) {
    arr[i] = new int[i + 1];

    for (int j = 0; j <= i; j++) {
        if (j == 0 || j == i) {
            arr[i][j] = 1;
        } else {
            arr[i][j] = arr[i - 1][j - 1] + arr[i - 1][j];
        }
    }
}

// Print
for (int[] row : arr) {
    for (int num : row) {
        System.out.print(num + "\t");
    }
    System.out.println();
}
```

**Output:**

    1
    1	1
    1	2	1
    1	3	3	1
    1	4	6	4	1
    1	5	10	10	5	1
    ...

#### Example 3: Score Statistics

```java
// 3 classes, 5 students each
int[][] scores = {
    {90, 85, 78, 92, 88},
    {76, 82, 95, 89, 91},
    {88, 79, 84, 90, 86}
};

// Calculate each class's average score
for (int i = 0; i < scores.length; i++) {
    double avg = Arrays.stream(scores[i]).average().orElse(0);
    System.out.printf("Class %d average: %.2f%n", i + 1, avg);
}
```

***

## IX. Common Array Operations

### 1. Copying Arrays

```java
int[] arr1 = {10, 20, 30, 40, 50};

// Option 1: Copy manually
int[] arr2 = new int[arr1.length];
for (int i = 0; i < arr1.length; i++) {
    arr2[i] = arr1[i];
}

// Option 2: System.arraycopy() (efficient)
int[] arr3 = new int[arr1.length];
System.arraycopy(arr1, 0, arr3, 0, arr1.length);
// Arguments: source, source offset, destination, destination offset, length

// Option 3: Arrays.copyOf() (recommended)
int[] arr4 = Arrays.copyOf(arr1, arr1.length);

// Option 4: Arrays.copyOfRange() (copy part of an array)
int[] arr5 = Arrays.copyOfRange(arr1, 1, 4);  // [20, 30, 40]

// Option 5: clone()
int[] arr6 = arr1.clone();
```

### 2. Sorting Arrays

```java
import java.util.Arrays;
import java.util.Collections;

int[] arr = {5, 2, 8, 1, 9, 3};

// Ascending sort
Arrays.sort(arr);
System.out.println(Arrays.toString(arr));  // [1, 2, 3, 5, 8, 9]

// Partial sort (indices 1 through 4, excluding 4)
int[] arr2 = {5, 2, 8, 1, 9, 3};
Arrays.sort(arr2, 1, 4);
System.out.println(Arrays.toString(arr2));  // [5, 1, 2, 8, 9, 3]

// Parallel sort (more efficient for large inputs, JDK 8+)
int[] bigArr = new int[1000000];
// ... Populate the data
Arrays.parallelSort(bigArr);

// Descending sort (requires a wrapper-type array)
Integer[] arr3 = {5, 2, 8, 1, 9, 3};
Arrays.sort(arr3, Collections.reverseOrder());
System.out.println(Arrays.toString(arr3));  // [9, 8, 5, 3, 2, 1]
```

### 3. Searching Arrays

```java
import java.util.Arrays;

int[] arr = {10, 20, 30, 40, 50};

// Binary search (array must be sorted)
int index = Arrays.binarySearch(arr, 30);
System.out.println(index);  // 2

// If absent, returns a negative value: -(insertion point)-1
int notFound = Arrays.binarySearch(arr, 35);
System.out.println(notFound);  // -4 (insert at index 3)

// Linear search (unsorted array)
public static int indexOf(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}
```

### 4. Converting Arrays to Strings

```java
import java.util.Arrays;

int[] arr = {10, 20, 30, 40, 50};

// One-dimensional array to string
String str = Arrays.toString(arr);
System.out.println(str);  // [10, 20, 30, 40, 50]

// Two-dimensional array to string
int[][] arr2 = {{1, 2}, {3, 4}, {5, 6}};
System.out.println(Arrays.toString(arr2));      // Not useful: [[I@..., [I@..., [I@...]
System.out.println(Arrays.deepToString(arr2));  // [[1, 2], [3, 4], [5, 6]]
```

### 5. Filling Arrays

```java
import java.util.Arrays;

int[] arr = new int[5];

// Fill the entire array
Arrays.fill(arr, 10);
System.out.println(Arrays.toString(arr));  // [10, 10, 10, 10, 10]

// Fill a range (indices 1 through 4, excluding 4)
Arrays.fill(arr, 1, 4, 20);
System.out.println(Arrays.toString(arr));  // [10, 20, 20, 20, 10]

// Parallel initialization (JDK 8+, generate values from indices)
int[] arr2 = new int[5];
Arrays.setAll(arr2, i -> i * 10);
System.out.println(Arrays.toString(arr2));  // [0, 10, 20, 30, 40]

// Parallel initialization (large input)
Arrays.parallelSetAll(arr2, i -> i * i);
System.out.println(Arrays.toString(arr2));  // [0, 1, 4, 9, 16]
```

### 6. Comparing Arrays

```java
import java.util.Arrays;

int[] arr1 = {10, 20, 30};
int[] arr2 = {10, 20, 30};
int[] arr3 = {10, 20, 40};

// equals(): compare contents
System.out.println(Arrays.equals(arr1, arr2));  // true
System.out.println(Arrays.equals(arr1, arr3));  // false
System.out.println(arr1 == arr2);  // false (compares references)

// deepEquals(): compare multidimensional arrays
int[][] a1 = {{1, 2}, {3, 4}};
int[][] a2 = {{1, 2}, {3, 4}};
System.out.println(Arrays.equals(a1, a2));      // false (compares only the first level)
System.out.println(Arrays.deepEquals(a1, a2));  // true (deep comparison)

// compare(): lexicographical comparison (JDK 9+)
System.out.println(Arrays.compare(arr1, arr3));  // -1 (arr1 < arr3)

// mismatch(): find the first differing index (JDK 9+)
System.out.println(Arrays.mismatch(arr1, arr3));  // 2 (differs at index 2)
System.out.println(Arrays.mismatch(arr1, arr2));  // -1 (identical)
```

### 7. Converting Arrays to Streams

```java
import java.util.Arrays;
import java.util.stream.IntStream;

int[] arr = {10, 20, 30, 40, 50};

// Arrays.stream()
IntStream stream = Arrays.stream(arr);

// Common stream operations
int sum = Arrays.stream(arr).sum();                    // Sum
int max = Arrays.stream(arr).max().orElse(0);          // Maximum
double avg = Arrays.stream(arr).average().orElse(0);   // Average
long count = Arrays.stream(arr).filter(n -> n > 20).count();  // Count

// Convert to a new array
int[] doubled = Arrays.stream(arr).map(n -> n * 2).toArray();
System.out.println(Arrays.toString(doubled));  // [20, 40, 60, 80, 100]
```

***

## X. Converting Between Arrays and Collections

### 1. Array to List

```java
import java.util.*;

String[] arr = {"A", "B", "C"};

// Option 1: Arrays.asList() (returns a fixed-size List)
List<String> list1 = Arrays.asList(arr);
// list1.add("D");  ❌ Adding/removing is unsupported
list1.set(0, "X");  // ✅ Replacing is allowed

// Option 2: new ArrayList<>() (mutable List)
List<String> list2 = new ArrayList<>(Arrays.asList(arr));
list2.add("D");  // ✅ Adding/removing is allowed

// Option 3: List.of() (immutable List, JDK 9+)
List<String> list3 = List.of(arr);
// list3.add("D");  ❌ No modifications are supported

// Option 4: Stream (JDK 8+)
List<String> list4 = Arrays.stream(arr).toList();  // JDK 16+

// Primitive array to List
int[] intArr = {1, 2, 3};
// List<Integer> list = Arrays.asList(intArr);  ❌ Produces List<int[]> instead
List<Integer> list5 = Arrays.stream(intArr).boxed().toList();  // ✅
```

### 2. List to Array

```java
import java.util.*;

List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));

// Option 1: toArray() (returns Object[])
Object[] arr1 = list.toArray();

// Option 2: toArray(T[]) (recommended; returns an array of the specified type)
String[] arr2 = list.toArray(new String[0]);

// Option 3: toArray(IntFunction) (JDK 11+)
String[] arr3 = list.toArray(String[]::new);

// Option 4: Stream
String[] arr4 = list.stream().toArray(String[]::new);
```

### 3. Conversion Approaches Compared

| Conversion                   | Mutable? | Affects the original array/collection? | JDK version |
| ---------------------- | ---- | ---------- | ------ |
| `Arrays.asList()`      | Partially mutable | Yes          | 1.2+   |
| `new ArrayList<>(...)` | Fully mutable | No          | 1.2+   |
| `List.of()`            | Immutable  | No          | 9+     |
| `stream().toList()`    | Immutable  | No          | 16+    |
| `toArray(new T[0])`    | -    | No          | 1.2+   |
| `toArray(T[]::new)`    | -    | No          | 11+    |

***

## XI. Variable Arguments (Varargs)

### 1. What Are Varargs?

Varargs let a method accept **any number** of arguments of one type. They are implemented as an **array**.

### 2. Syntax

```java
// The varargs parameter must come last
public static void method(DataType... parameterName) {
    // parameterName is an array
}
```

### 3. Usage Example

```java
public class VarargsDemo {
    public static void main(String[] args) {
        // Pass any number of arguments
        int sum1 = sum(1, 2, 3);
        int sum2 = sum(1, 2, 3, 4, 5);
        int sum3 = sum();  // Zero arguments are also allowed

        System.out.println(sum1);  // 6
        System.out.println(sum2);  // 15
        System.out.println(sum3);  // 0

        // An array can also be passed
        int[] arr = {10, 20, 30};
        int sum4 = sum(arr);
        System.out.println(sum4);  // 60
    }

    // Varargs method
    public static int sum(int... numbers) {
        int total = 0;
        for (int num : numbers) {  // numbers is an array
            total += num;
        }
        return total;
    }
}
```

### 4. Considerations

```java
// ✅ Correct: varargs comes last
public void method(String name, int... scores) { }

// ❌ Incorrect: varargs must come last
// public void method(int... scores, String name) { }

// ❌ Incorrect: only one varargs parameter is allowed
// public void method(int... a, double... b) { }
```

### 5. Common Uses

```java
// Arrays.asList() uses varargs
List<String> list = Arrays.asList("A", "B", "C");

// String.format() also uses varargs
String result = String.format("Name: %s, age: %d", "张三", 18);

// Custom utility method
public static void printAll(Object... args) {
    for (Object obj : args) {
        System.out.println(obj);
    }
}
```

***

## XII. Quick Reference

### 1. Array Declarations

| Type    | Syntax                       | Characteristics       |
| ----- | ------------------------ | -------- |
| Static initialization | `int[] arr = {1, 2, 3}`  | Specify elements directly   |
| Dynamic initialization | `int[] arr = new int[3]` | Specify length; default values |
| Anonymous array  | `new int[]{1, 2, 3}`     | No variable name     |

### 2. Default Values

| Data type          | Default value      |
| ------------- | -------- |
| int, long     | 0        |
| double, float | 0.0      |
| boolean       | false    |
| char          | '\u0000' |
| Reference types          | null     |

### 3. Common Exceptions

| Exception                             | Cause      |
| ------------------------------ | ------- |
| ArrayIndexOutOfBoundsException | Index out of bounds    |
| NullPointerException           | Array is null |

### 4. Iteration Approaches

```java
int[] arr = {10, 20, 30};

// Basic for (indices needed)
for (int i = 0; i < arr.length; i++) { }

// Enhanced for (read only)
for (int num : arr) { }

// Stream (JDK 8+)
Arrays.stream(arr).forEach(System.out::println);
```

### 5. Two-Dimensional Arrays

```java
// Static initialization
int[][] arr = {{1,2}, {3,4}, {5,6}};

// Dynamic initialization
int[][] grid = new int[3][4];  // 3 rows, 4 columns

// Iterate
for (int i = 0; i < arr.length; i++) {
    for (int j = 0; j < arr[i].length; j++) {
        System.out.print(arr[i][j]);
    }
}
```

### 6. The Arrays Utility Class

```java
import java.util.Arrays;

// Basic operations
Arrays.toString(arr);           // Convert to string
Arrays.deepToString(arr2d);     // Two-dimensional array to string
Arrays.sort(arr);               // Sort
Arrays.parallelSort(arr);       // Parallel sort (large input)
Arrays.binarySearch(arr, key);  // Binary search (must be sorted)

// Copy
Arrays.copyOf(arr, len);        // Copy a specified length
Arrays.copyOfRange(arr, from, to);  // Copy a range

// Fill
Arrays.fill(arr, val);          // Fill the whole array
Arrays.setAll(arr, i -> i*2);   // Generate from indices

// Compare
Arrays.equals(arr1, arr2);      // Compare contents
Arrays.deepEquals(a1, a2);      // Deep comparison
Arrays.compare(arr1, arr2);     // Lexicographical comparison (JDK 9+)
Arrays.mismatch(arr1, arr2);    // Find a mismatch (JDK 9+)

// Streams
Arrays.stream(arr);             // Convert to stream
```

### 7. Array/Collection Conversions

```java
// Array → List
List<String> list1 = Arrays.asList(arr);                   // Fixed size
List<String> list2 = new ArrayList<>(Arrays.asList(arr));  // Mutable
List<String> list3 = List.of(arr);                         // Immutable (JDK 9+)

// List → array
String[] arrA = list2.toArray(new String[0]);
String[] arrB = list2.toArray(String[]::new);              // JDK 11+
```
