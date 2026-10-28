## I. Categories of Control Flow

### 1. Three Execution Structures

    ┌──────────────────────────────────────────┐
    │           Program Control Flow           │
    ├──────────────────────────────────────────┤
    │                                          │
    │  1. Sequence: execute from top to bottom │
    │                                          │
    │  2. Branching: choose by condition       │
    │     ├─ if statements                     │
    │     └─ switch statements                 │
    │                                          │
    │  3. Loops: repeat a block of code        │
    │     ├─ for loops                         │
    │     ├─ while loops                       │
    │     └─ do...while loops                  │
    │                                          │
    └──────────────────────────────────────────┘

### 2. Flow Diagrams

    Sequence:            Branching:             Loop:
        ↓                     ↓                         ↓
     Code 1              [Condition]            ┌─→[Condition] ──false──→ Exit
        ↓                  ↙     ↘              │       │ true
     Code 2          Code A      Code B         │       ↓
        ↓                  ↘     ↙              │   Loop body
     Code 3                   ↓                 └───────┘

***

## II. Branching with if

### 1. Three Forms of if Statements

#### Form 1: if

```java
if (condition) {
    // Execute when the condition is true
}
```

**Example:**

```java
int age = 18;
if (age >= 18) {
    System.out.println("Adult");
}
```

#### Form 2: if...else

```java
if (condition) {
    // Execute when the condition is true
} else {
    // Execute when the condition is false
}
```

**Example:**

```java
int age = 16;
if (age >= 18) {
    System.out.println("Adult");
} else {
    System.out.println("Minor");
}
```

#### Form 3: if...else if...else

```java
if (condition1) {
    // Execute when condition1 is true
} else if (condition2) {
    // Execute when condition2 is true
} else if (condition3) {
    // Execute when condition3 is true
} else {
    // Execute when none of the conditions above hold
}
```

**Example:**

```java
int score = 85;

if (score >= 90) {
    System.out.println("Excellent");
} else if (score >= 80) {
    System.out.println("Good");
} else if (score >= 60) {
    System.out.println("Pass");
} else {
    System.out.println("Fail");
}
// Output: Good
```

### 2. if Statement Considerations

```java
// 1. The condition must produce a boolean
if (true) { }      // ✅ Correct
// if (1) { }      // ❌ Incorrect: Java does not allow this

// 2. Braces may be omitted for one statement (not recommended)
if (age >= 18)
    System.out.println("Adult");  // Allowed, but not recommended

// 3. else pairs with the nearest unmatched if
if (a > 0)
    if (b > 0)
        System.out.println("Both a and b are greater than 0");
    else
        System.out.println("a>0 but b<=0");  // else pairs with the inner if

// 4. Avoid the redundant comparison == true
boolean flag = true;
if (flag) { }       // ✅ Recommended
if (flag == true) { }  // ❌ Redundant
```

### 3. The Ternary Operator (Simplified if-else)

**Syntax:** `condition ? value1 : value2`

```java
// if-else form
int max;
if (a > b) {
    max = a;
} else {
    max = b;
}

// Ternary form (more concise)
int max2 = a > b ? a : b;

// Nested ternary (maximum of three numbers)
int max3 = a > b ? (a > c ? a : c) : (b > c ? b : c);

// Note: a ternary expression must produce a value; it cannot execute statements
// a > b ? System.out.println("a is larger") : System.out.println("b is larger");  ❌ Incorrect
```

**if-else vs. ternary operator:**

| Comparison  | if-else   | Ternary operator    |
| ---- | --------- | -------- |
| Return value  | Optional      | Must produce a value   |
| Statements | Can execute multiple statements  | Can only produce a value    |
| Readability  | Clearer for complex logic   | More concise for simple conditions  |
| Use case | Complex branches and multiple statements | Simple assignments and return values |

### 4. if Examples

#### Example 1: Even or Odd

```java
import java.util.Scanner;

public class OddEven {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter an integer: ");
        int num = sc.nextInt();

        // Option 1: if-else
        if (num % 2 == 0) {
            System.out.println(num + " is even");
        } else {
            System.out.println(num + " is odd");
        }

        // Option 2: Ternary operator
        String result = num % 2 == 0 ? "even" : "odd";
        System.out.println(num + " is " + result);

        sc.close();
    }
}
```

#### Example 2: Leap Years

```java
int year = 2024;

// Leap year: divisible by 4 but not 100, or divisible by 400
if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
    System.out.println(year + " is a leap year");
} else {
    System.out.println(year + " is a common year");
}

// Ternary form
String result = ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0))
    ? "Leap year" : "Common year";
```

***

## III. Branching with switch

### 1. switch Statement Syntax

```java
switch (expression) {
    case value1:
        statement1;
        break;
    case value2:
        statement2;
        break;
    case value3:
        statement3;
        break;
    ...
    default:
        defaultStatement;
        break;
}
```

### 2. Execution Flow

    1. Evaluate the expression
    2. Compare its value with each case value
    3. Execute the matching statements
    4. Exit the switch when break is reached
    5. Execute default if no case matches

### 3. Example

```java
int day = 3;

switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
    case 4:
        System.out.println("Thursday");
        break;
    case 5:
        System.out.println("Friday");
        break;
    case 6:
        System.out.println("Saturday");
        break;
    case 7:
        System.out.println("Sunday");
        break;
    default:
        System.out.println("Invalid day");
        break;
}
// Output: Wednesday
```

### 4. switch Considerations

#### (1) Expression Type Requirements

```java
// Types supported by the switch expression:
// byte, short, int, char (and their wrappers Byte, Short, Integer, Character)
// String (JDK 7+)
// enum (JDK 5+)

// ❌ Unsupported in a classic switch: long, float, double, boolean
// (JDK 21+ pattern-matching switch accepts any reference type)

int num = 1;        // ✅
char c = 'A';       // ✅
String s = "hello"; // ✅ (JDK 7+)
Season season = Season.SPRING;  // ✅ Enum
// double d = 1.0;  // ❌ Unsupported
```

#### (2) Case Fall-Through

```java
// Without break, execution falls through to the next case
int num = 1;

switch (num) {
    case 1:
        System.out.println("One");
        // No break: continue into the next case
    case 2:
        System.out.println("Two");
    case 3:
        System.out.println("Three");
        break;
    default:
        System.out.println("Other");
}
// Output: One Two Three (case fall-through)
```

#### (3) Simplifying Code with Fall-Through

```java
// Determine the season from the month
int month = 3;

switch (month) {
    case 3:
    case 4:
    case 5:
        System.out.println("Spring");
        break;
    case 6:
    case 7:
    case 8:
        System.out.println("Summer");
        break;
    case 9:
    case 10:
    case 11:
        System.out.println("Autumn");
        break;
    case 12:
    case 1:
    case 2:
        System.out.println("Winter");
        break;
    default:
        System.out.println("Invalid month");
}
```

### 5. New switch Features (JDK 14+)

#### (1) Arrow Syntax (JDK 14+)

```java
// Arrow syntax: no break required and no fall-through
int day = 3;

switch (day) {
    case 1 -> System.out.println("Monday");
    case 2 -> System.out.println("Tuesday");
    case 3 -> System.out.println("Wednesday");
    case 4 -> System.out.println("Thursday");
    case 5 -> System.out.println("Friday");
    case 6, 7 -> System.out.println("Weekend");  // Combine multiple cases
    default -> System.out.println("Invalid");
}

// Use braces for multiple statements
switch (day) {
    case 1, 2, 3, 4, 5 -> {
        System.out.println("Workday");
        System.out.println("Time to work");
    }
    case 6, 7 -> System.out.println("Weekend");
    default -> System.out.println("Invalid");
}
```

#### (2) switch Expressions (JDK 14+)

```java
// switch can produce a value
int day = 3;

String result = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    case 4 -> "Thursday";
    case 5 -> "Friday";
    case 6, 7 -> "Weekend";
    default -> "Invalid";
};
System.out.println(result);  // Wednesday
```

#### (3) The yield Keyword (JDK 14+)

```java
// Use yield to produce a value in a switch expression block
int day = 3;

String result = switch (day) {
    case 1, 2, 3, 4, 5 -> {
        System.out.println("Calculating...");
        yield "Workday";  // Produce a value with yield
    }
    case 6, 7 -> "Weekend";
    default -> {
        System.out.println("Invalid argument");
        yield "Invalid";
    }
};
```

#### (4) Pattern Matching (JDK 21+)

```java
// switch supports type patterns
Object obj = "Hello";

String result = switch (obj) {
    case Integer i -> "Integer: " + i;
    case String s -> "String: " + s;
    case Double d -> "Floating-point number: " + d;
    case null -> "Null";
    default -> "Unknown type";
};
System.out.println(result);  // String: Hello

// Conditional pattern matching (guards)
Object obj2 = 15;

String result2 = switch (obj2) {
    case Integer i when i > 10 -> "Integer greater than 10";
    case Integer i -> "Integer less than or equal to 10";
    case String s -> "String";
    default -> "Other";
};
```

### 6. switch Evolution

| Version     | Feature                   |
| ------ | -------------------- |
| JDK 5  | enum support              |
| JDK 7  | String support            |
| JDK 14 | Arrow syntax, switch expressions, yield |
| JDK 21 | Pattern matching, `when` guards, record patterns, `case null` |
| JDK 22 | Unnamed patterns (`case Point(int x, _)`) |

### 7. Choosing if or switch

| Scenario                 | Recommendation     |
| ------------------ | ------ |
| Range checks (e.g. score >= 90) | if     |
| Fixed-value checks (e.g. day == 1)   | switch |
| Boolean conditions             | if     |
| Matching several fixed values            | switch |
| Type checks (JDK 21+)      | switch |

***

## IV. Debugging Tools

### 1. What Is Debugging?

Debugging is the process of **finding and fixing code errors**. It allows you to:

*   Execute code line by line
*   Inspect variable values
*   Observe program control flow
*   Locate bugs

### 2. Debugging in IDEA

#### Step 1: Set a Breakpoint

    Click to the left of a line number to display a red dot (breakpoint)
    Breakpoint: the program pauses when it reaches this location

#### Step 2: Start Debug Mode

    Option 1: Right-click → Debug 'ClassName.main()'
    Option 2: Click the bug icon 🐞 in the toolbar
    Option 3: Press Shift + F9

#### Step 3: Use the Debug Controls

| Button              | Shortcut          | Purpose            |
| --------------- | ------------ | ------------- |
| Step Over       | F8           | Execute the current line without entering methods |
| Step Into       | F7           | Execute the current line and enter methods  |
| Step Out        | Shift+F8     | Leave the current method        |
| Force Step Into | Alt+Shift+F7 | Force entry, including into JDK methods |
| Run to Cursor   | Alt+F9       | Run to the caret        |
| Resume          | F9           | Continue to the next breakpoint    |
| Stop            | Ctrl+F2      | Stop debugging          |

### 3. Debug Panel

    ┌─────────────────────────────────────────┐
    │  Debugger panel                         │
    ├─────────────────────────────────────────┤
    │  Frames: method call stack              │
    │  Variables: values in the current scope │
    │  Watches: custom monitored expressions  │
    │  Console: console output                │
    └─────────────────────────────────────────┘

### 4. Practical Debugging Example

```java
public class DebugDemo {
    public static void main(String[] args) {
        int sum = 0;              // Set a breakpoint here

        for (int i = 1; i <= 5; i++) {
            sum += i;             // Press F8 to step through and observe sum and i
        }

        System.out.println("sum = " + sum);
    }
}

// Values observed while debugging:
// i=1, sum=0 → sum=1
// i=2, sum=1 → sum=3
// i=3, sum=3 → sum=6
// i=4, sum=6 → sum=10
// i=5, sum=10 → sum=15
```

### 5. Debugging Tips

| Technique     | Action                         | Description              |
| ------ | -------------------------- | --------------- |
| Conditional breakpoint   | Right-click a breakpoint → enter a Condition      | Pause only when, for example, `i == 5` |
| Disable breakpoint   | Click the breakpoint to make it hollow                    | Disable temporarily without deleting        |
| Inspect an expression | Select code → Alt+F8              | Evaluate an arbitrary expression         |
| Change a variable  | Variables → right-click → Set Value | Change a value at runtime         |
| Logging breakpoint   | Right-click a breakpoint → Evaluate and log    | Log without pausing       |
| Exception breakpoint   | View Breakpoints → add an exception    | Pause automatically when the specified exception occurs     |
| Method breakpoint   | Set a breakpoint on the method signature                 | Pause on method entry/exit      |

***

## V. for Loops

### 1. for Loop Syntax

```java
for (initialization; condition; update) {
    loopBody;
}
```

### 2. Execution Flow

    1. Execute initialization (once)
    2. Test the condition
       ├─ true → execute the body → execute the update → return to step 2
       └─ false → end the loop

### 3. Examples

```java
// Print 1 through 5
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}

// Print 5 through 1
for (int i = 5; i >= 1; i--) {
    System.out.println(i);
}

// Sum 1 through 100
int sum = 0;
for (int i = 1; i <= 100; i++) {
    sum += i;
}
System.out.println("Sum from 1 to 100: " + sum);  // 5050

// Print even numbers
for (int i = 0; i <= 10; i += 2) {
    System.out.println(i);
}
```

### 4. for Loop Variants

```java
// Omit initialization (declared outside)
int k = 0;
for (; k < 5; k++) {
    System.out.println(k);
}

// Omit update (performed in the body)
for (int i = 0; i < 5; ) {
    System.out.println(i);
    i++;
}

// Infinite loop
for (;;) {
    System.out.println("Infinite loop");
    break;  // Use break to exit
}

// Declare multiple variables of the same type
for (int i = 0, j = 10; i < j; i++, j--) {
    System.out.println("i=" + i + ", j=" + j);
}
// Output: i=0, j=10  i=1, j=9  i=2, j=8  i=3, j=7  i=4, j=6
```

### 5. Nested for Loops

```java
// Print a multiplication table
for (int i = 1; i <= 9; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print(j + "×" + i + "=" + (i * j) + "\t");
    }
    System.out.println();
}

// Output:
// 1×1=1
// 1×2=2  2×2=4
// 1×3=3  2×3=6  3×3=9
// ...
```

### 6. Enhanced for Loop (foreach)

```java
// Iterate over an array
int[] arr = {1, 2, 3, 4, 5};

for (int num : arr) {
    System.out.println(num);
}

// Iterate over a string array
String[] names = {"Alice", "Bob", "Carol"};

for (String name : names) {
    System.out.println(name);
}

// Note: foreach provides no index and cannot replace elements in the original array
```

***

## VI. while Loops

### 1. while Loop Syntax

```java
initialization;
while (condition) {
    loopBody;
    update;
}
```

### 2. Execution Flow

    1. Execute initialization
    2. Test the condition
       ├─ true → execute the body → execute the update → return to step 2
       └─ false → end the loop

### 3. Examples

```java
// Print 1 through 5
int i = 1;
while (i <= 5) {
    System.out.println(i);
    i++;
}

// Sum 1 through 100
int sum = 0;
int num = 1;
while (num <= 100) {
    sum += num;
    num++;
}
System.out.println("sum = " + sum);

// Number guessing game (import java.util.Scanner and java.util.Random)
Scanner sc = new Scanner(System.in);
Random random = new Random();
int target = random.nextInt(100) + 1;  // 1-100

int guess = 0;
while (guess != target) {
    System.out.print("Guess a number (1–100): ");
    guess = sc.nextInt();

    if (guess > target) {
        System.out.println("Too high");
    } else if (guess < target) {
        System.out.println("Too low");
    } else {
        System.out.println("Congratulations, correct!");
    }
}
```

### 4. When to Use while

    while: the number of iterations is unknown and controlled by a condition
    for: the number of iterations is known

    Examples:
    - Accept input until the user enters quit → while
    - Iterate from 1 to 100 → for
    - Read a file until its end → while
    - Print a 9×9 multiplication table → for

***

## VII. do...while Loops

### 1. do...while Syntax

```java
initialization;
do {
    loopBody;
    update;
} while (condition);  // Remember the semicolon
```

### 2. Execution Flow

    1. Execute initialization
    2. Execute the body
    3. Execute the update
    4. Test the condition
       ├─ true → return to step 2
       └─ false → end the loop

### 3. Execute First, Test Afterwards

```java
// do...while executes at least once
int i = 10;

do {
    System.out.println("Executed! i = " + i);
    i++;
} while (i < 5);

// Output: Executed! i = 10
// Although the condition is false initially, the body runs once
```

### 4. Comparison with while

```java
// while: test first, then execute (may execute zero times)
int i = 10;
while (i < 5) {
    System.out.println("while executes");  // Does not execute
    i++;
}

// do...while: execute first, then test (at least once)
int j = 10;
do {
    System.out.println("do...while executes");  // Executes once
    j++;
} while (j < 5);
```

### 5. Use Cases

```java
// Use when an operation must precede the condition check
// For example: menu selection

import java.util.Scanner;

Scanner sc = new Scanner(System.in);
int choice;

do {
    System.out.println("===== Menu =====");
    System.out.println("1. Start game");
    System.out.println("2. Game settings");
    System.out.println("3. Exit game");
    System.out.print("Choose an option: ");

    choice = sc.nextInt();

    switch (choice) {
        case 1 -> System.out.println("Starting game...");
        case 2 -> System.out.println("Opening settings...");
        case 3 -> System.out.println("Goodbye!");
        default -> System.out.println("Invalid option; choose again");
    }
} while (choice != 3);
```

***

## VIII. Comparing the Three Loop Types

| Feature       | for    | while  | do...while |
| -------- | ------ | ------ | ---------- |
| Test first or execute first? | Test first    | Test first    | Execute first        |
| Minimum iterations   | 0     | 0     | 1         |
| Use case     | Known iteration count | Unknown iteration count | At least one iteration     |
| Initialization location    | Inside the loop header   | Outside the loop   | Outside the loop       |
| Variable scope    | Inside the loop    | Outside the loop    | Outside the loop        |

### 1. Converting Between Loop Types

```java
// Print 1 through 5

// for loop
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}

// while loop
int i = 1;
while (i <= 5) {
    System.out.println(i);
    i++;
}

// do...while loop
int j = 1;
do {
    System.out.println(j);
    j++;
} while (j <= 5);
```

***

## IX. break, continue, and return

### 1. break: End the Loop

```java
// Exit the current loop
for (int i = 1; i <= 10; i++) {
    if (i == 5) {
        break;  // Exit when i=5
    }
    System.out.println(i);
}
// Output: 1 2 3 4
```

### 2. continue: Skip the Current Iteration

```java
// Skip this iteration and continue with the next
for (int i = 1; i <= 10; i++) {
    if (i == 5) {
        continue;  // Skip the iteration where i=5
    }
    System.out.println(i);
}
// Output: 1 2 3 4 6 7 8 9 10
```

### 3. return: End the Method

```java
public static void test() {
    for (int i = 1; i <= 10; i++) {
        if (i == 5) {
            return;  // End the entire method immediately
        }
        System.out.println(i);
    }
    System.out.println("Loop finished");  // Does not execute
}
// Output: 1 2 3 4
```

### 4. Comparing the Three

| Keyword      | Effect           | Scope    |
| -------- | ------------ | ----- |
| break    | End the current loop       | Current loop only |
| continue | Skip this iteration and continue with the next | Current loop only |
| return   | End the entire method       | Entire method  |

```java
public static void demo() {
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            if (j == 2) {
                // break;     // Exit the inner loop; continue the outer loop
                // continue;  // Skip this inner iteration; continue with the next inner iteration
                // return;    // End the entire method immediately
            }
            System.out.println("i=" + i + ", j=" + j);
        }
    }
    System.out.println("Method finished");
}
```

### 5. Labels in Nested Loops

```java
// Labeled break: exit the outer loop
outer:
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        if (j == 2) {
            break outer;  // Exit the outer loop
        }
        System.out.println("i=" + i + ", j=" + j);
    }
}
// Output: i=1, j=1

// Labeled continue: continue with the next outer iteration
outer:
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        if (j == 2) {
            continue outer;  // Continue with the next outer iteration
        }
        System.out.println("i=" + i + ", j=" + j);
    }
}
// Output: i=1, j=1  i=2, j=1  i=3, j=1
```

### 6. Use Cases

```java
// break: exit as soon as the target is found
int[] arr = {1, 3, 5, 7, 9};
int target = 5;

for (int i = 0; i < arr.length; i++) {
    if (arr[i] == target) {
        System.out.println("Found at index: " + i);
        break;  // Exit after finding it
    }
}

// continue: skip data that does not meet the condition
for (int i = 1; i <= 10; i++) {
    if (i % 2 != 0) {
        continue;  // Skip odd numbers
    }
    System.out.println(i);  // Print only even numbers
}

// return: return immediately if validation fails
public static boolean validate(String input) {
    if (input == null || input.isEmpty()) {
        return false;  // Validation failed; return immediately
    }
    // Continue with other validation...
    return true;
}
```

### 7. Summary Comparison

| Keyword         | Effect        | Use case      |
| ----------- | --------- | --------- |
| break       | End the entire loop    | Exit after finding a target   |
| continue    | Skip the current iteration    | Skip unwanted data  |
| return      | End the entire method    | Return a result early    |
| Labeled break    | Exit a specified loop    | Exit an outer loop in nested loops |
| Labeled continue | Continue with the next iteration of a specified loop | Control an outer loop in nested loops |

***

## X. Generating Random Numbers with Random

### 1. Basic Random Usage

```java
import java.util.Random;

public class RandomDemo {
    public static void main(String[] args) {
        // 1. Create a Random instance
        Random random = new Random();

        // 2. Generate a random number
        int num = random.nextInt();  // Random number across the int range
        System.out.println(num);
    }
}
```

### 2. Common Random Methods

| Method                  | Description               | Range          |
| ------------------- | ---------------- | ----------- |
| `nextInt()`         | Random int           | Full int range     |
| `nextInt(n)`        | Random int           | \[0, n)     |
| `nextInt(o, b)`     | Random int (JDK 17+) | \[o, b)     |
| `nextLong()`        | Random long          | Full long range    |
| `nextDouble()`      | Random double        | \[0.0, 1.0) |
| `nextFloat()`       | Random float         | \[0.0, 1.0) |
| `nextBoolean()`     | Random boolean       | true/false  |
| `nextBytes(byte[])` | Fill with random bytes           | -           |

### 3. Random Numbers in a Specified Range

```java
Random random = new Random();

// Generate a random number from 0 to 9
int num1 = random.nextInt(10);  // [0, 10)

// Generate a random number from 1 to 10
int num2 = random.nextInt(10) + 1;  // [0, 10) + 1 = [1, 10]

// Generate a random number from 5 to 15
int num3 = random.nextInt(11) + 5;  // [0, 11) + 5 = [5, 15]

// General formula: random number in [min, max]
// random.nextInt(max - min + 1) + min
int min = 5;
int max = 15;
int num4 = random.nextInt(max - min + 1) + min;

// New in JDK 17+: specify the range directly (recommended)
int num5 = random.nextInt(5, 16);  // [5, 16), equivalent to integers [5, 15]
```

### 4. Random Number Formula

    Generate a random integer in [min, max]:
    random.nextInt(max - min + 1) + min

    Examples:
    [1, 100]  → random.nextInt(100) + 1
    [10, 20]  → random.nextInt(11) + 10
    [5, 15]   → random.nextInt(11) + 5

    JDK 17+:
    [1, 100]  → random.nextInt(1, 101)
    [10, 20]  → random.nextInt(10, 21)

### 5. Math.random()

```java
// Math.random() returns a double in [0.0, 1.0)
double d = Math.random();

// Generate an integer in [0, 9]
int num1 = (int) (Math.random() * 10);

// Generate an integer in [1, 10]
int num2 = (int) (Math.random() * 10) + 1;

// Generate an integer in [min, max]
int min = 5, max = 15;
int num3 = (int) (Math.random() * (max - min + 1)) + min;

// Math.random() vs Random
// Math.random(): simple use cases; no import required
// Random: more capabilities and multiple result types
```

### 6. ThreadLocalRandom (JDK 7+, Recommended for Multithreading)

```java
import java.util.concurrent.ThreadLocalRandom;

// More efficient in a multithreaded environment
int num1 = ThreadLocalRandom.current().nextInt();
int num2 = ThreadLocalRandom.current().nextInt(100);      // [0, 100)
int num3 = ThreadLocalRandom.current().nextInt(10, 20);   // [10, 20)

long l = ThreadLocalRandom.current().nextLong(100);
double d = ThreadLocalRandom.current().nextDouble(1.0, 10.0);

// Why use ThreadLocalRandom with multiple threads?
// Random has shared state; contention between threads can reduce performance
// ThreadLocalRandom provides a separate instance per thread, avoiding contention
```

### 7. SecureRandom (Secure Random Numbers)

```java
import java.security.SecureRandom;

// Security use cases: passwords, tokens, verification codes, etc.
SecureRandom secureRandom = new SecureRandom();

int num = secureRandom.nextInt(100);
byte[] bytes = new byte[16];
secureRandom.nextBytes(bytes);  // Generate random bytes

// Random vs SecureRandom
// Random: pseudorandom, predictable seed, not secure
// SecureRandom: cryptographically strong pseudorandom generator; unpredictable, secure
```

### 8. Comparing Random Number Generators

| Approach                  | Use case  | Thread-safe? | Performance |
| ------------------- | ----- | ---- | -- |
| `Math.random()`     | Simple use cases  | Yes    | Low  |
| `Random`            | General use; shared instances may cause contention | Yes    | Medium  |
| `ThreadLocalRandom` | Multithreading   | Yes    | High  |
| `SecureRandom`      | Security use cases  | Yes    | Low  |

### 9. Practical Examples

#### Example 1: Number Guessing Game

```java
import java.util.Random;
import java.util.Scanner;

public class GuessNumber {
    public static void main(String[] args) {
        Random random = new Random();
        Scanner sc = new Scanner(System.in);

        // Generate a random number from 1 to 100
        int target = random.nextInt(100) + 1;
        int count = 0;  // Count guesses

        System.out.println("I'm thinking of a number between 1 and 100. Guess it!");

        while (true) {
            System.out.print("Enter your guess: ");
            int guess = sc.nextInt();
            count++;

            if (guess > target) {
                System.out.println("Too high!");
            } else if (guess < target) {
                System.out.println("Too low!");
            } else {
                System.out.println("Congratulations, correct!");
                System.out.println("You made " + count + " guesses");
                break;
            }
        }

        sc.close();
    }
}
```

#### Example 2: Generate a Verification Code

```java
import java.security.SecureRandom;
import java.util.Random;

public class VerifyCode {
    public static void main(String[] args) {
        // Option 1: Random
        Random random = new Random();
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            int index = random.nextInt(chars.length());
            code.append(chars.charAt(index));
        }
        System.out.println("Verification code: " + code);

        // Option 2: SecureRandom (more secure)
        SecureRandom secureRandom = new SecureRandom();
        StringBuilder secureCode = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            int index = secureRandom.nextInt(chars.length());
            secureCode.append(chars.charAt(index));
        }
        System.out.println("Secure verification code: " + secureCode);
    }
}
```

#### Example 3: Simulate a Prize Draw

```java
import java.util.Random;

public class Lottery {
    public static void main(String[] args) {
        Random random = new Random();

        // Define prizes
        String[] prizes = {"First prize: iPhone", "Second prize: iPad", "Third prize: Headphones", "Thanks for participating"};

        // Probabilities: 1% first prize, 5% second, 14% third, 80% no prize
        int num = random.nextInt(100) + 1;  // 1-100

        String result = switch (num) {
            case 1 -> prizes[0];
            case 2, 3, 4, 5, 6 -> prizes[1];
            default -> num <= 20 ? prizes[2] : prizes[3];
        };
        System.out.println(result);
    }
}
```

#### Example 4: Randomly Select a Student

```java
import java.util.Random;

public class RandomCall {
    public static void main(String[] args) {
        Random random = new Random();

        String[] students = {"Alice", "Bob", "Carol", "Dave", "Eve"};

        int index = random.nextInt(students.length);

        System.out.println("Selected student: " + students[index]);
    }
}
```

#### Example 5: Shuffling

```java
import java.util.Random;
import java.util.Arrays;

public class Shuffle {
    public static void main(String[] args) {
        int[] cards = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        Random random = new Random();

        // Fisher-Yates shuffle
        for (int i = cards.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            // Swap cards[i] and cards[j]
            int temp = cards[i];
            cards[i] = cards[j];
            cards[j] = temp;
        }

        System.out.println(Arrays.toString(cards));
    }
}
```

***

## XI. Quick Reference

### 1. Control Flow Categories

| Type | Keywords                     | Purpose   |
| -- | ----------------------- | ---- |
| Branching | if, switch              | Conditional selection |
| Loops | for, while, do-while    | Repeated execution |
| Jumps | break, continue, return | Control execution flow |

### 2. Loop Comparison

| Feature   | for           | while     | do-while      |
| ---- | ------------- | --------- | ------------- |
| Syntax   | for(initialization;condition;update) | while(condition) | do{}while(condition) |
| Minimum iterations | 0            | 0        | 1            |
| Use case   | Known count          | Unknown count      | At least once          |

### 3. Jump Statements Compared

| Statement       | Effect   | Scope   |
| -------- | ---- | ---- |
| break    | End loop | Current loop |
| continue | Skip current iteration | Current loop |
| return   | End method | Entire method |

### 4. switch Features by Version

| Version     | Feature                   |
| ------ | -------------------- |
| JDK 7  | String support            |
| JDK 14 | Arrow syntax, switch expressions, yield |
| JDK 21 | Pattern matching, `when` guards, record patterns, `case null` |
| JDK 22 | Unnamed patterns (`case Point(int x, _)`) |

### 5. Common Random Operations

```java
// Random class
Random r = new Random();
r.nextInt();        // Full int range
r.nextInt(n);       // [0, n)
r.nextInt(o, b);    // [o, b) JDK17+
r.nextDouble();     // [0.0, 1.0)
r.nextBoolean();    // true/false

// General formula: [min, max]
int v1 = r.nextInt(max - min + 1) + min;

// Math.random()
int v2 = (int) (Math.random() * n);  // [0, n)

// ThreadLocalRandom (recommended for multithreading)
int v3 = ThreadLocalRandom.current().nextInt(10, 20);  // [10, 20)

// SecureRandom (security use cases)
int v4 = new SecureRandom().nextInt(100);  // [0, 100)
```

### 6. Debugging Shortcuts

| Shortcut      | Purpose              |
| -------- | --------------- |
| F8       | Step Over (execute one line) |
| F7       | Step Into (enter a method) |
| Shift+F8 | Step Out (leave a method)  |
| Alt+F9   | Run to Cursor   |
| F9       | Resume (continue execution)    |
| Ctrl+F2  | Stop (stop debugging)      |
