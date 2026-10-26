## I. Introduction to Collections

### 1. What Is a Collection?

A **collection** is a Java container for **storing multiple objects**. Elements can be added and removed dynamically.

### 2. Collections vs. Arrays

| Comparison       | Array          | Collection         |
| -------- | ----------- | ---------- |
| **Length**   | Fixed; cannot change after creation  | Variable; expands automatically    |
| **Stored types** | Primitive and reference types | Reference types (objects) only |
| **Element types** | Must be consistent        | May differ (not recommended) |
| **Capabilities**   | Limited functionality        | Many useful methods    |

```java
// Array: fixed length
int[] arr = new int[3];
arr[3] = 10;  // ❌ Index out of bounds

// Collection: variable size
ArrayList<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);
list.add(3);
list.add(4);  // ✅ Expands automatically
```

### 3. Collection Hierarchy

                         Collection (individual-element collections)
                                              │
                ┌─────────────────────────────┼─────────────────────┐
                │                             │                     │
              List                           Set                  Queue
            (ordered,                    (unordered,             (queue)
       duplicates allowed)             no duplicates)
                │                             │
          ┌─────┴─────┐           ┌───────────┼─────────────┐
          │           │           │           │             │
      ArrayList  LinkedList    HashSet     TreeSet    LinkedHashSet
                             (unordered)  (sorted)  (insertion order)


                            Map (key-value collections)
                                  │
                  ┌───────────────┼───────────────┐
                  │               │               │
               HashMap        TreeMap        LinkedHashMap
               (unordered)     (sorted)     (insertion order)

### 4. Common Collection Categories

| Interface       | Characteristics         | Common implementations                | Use case |
| -------- | ---------- | -------------------- | ---- |
| **List** | Ordered; allows duplicates; indexed | ArrayList, LinkedList | Ordered lists |
| **Set**  | Unordered; no duplicates; no index | HashSet, TreeSet      | Deduplication   |
| **Map**  | Key-value pairs; unique keys   | HashMap, TreeMap      | Key-value mappings |

***

## II. Creating Collections

### 1. ArrayList (Most Common)

```java
import java.util.ArrayList;

// ========== Creation options ==========

// Option 1: No-argument constructor (recommended)
ArrayList<String> list1 = new ArrayList<>();

// Option 2: Initial capacity (recommended for many elements)
ArrayList<String> list2 = new ArrayList<>(100);

// Option 3: Pass another collection
ArrayList<String> list3 = new ArrayList<>(list1);
```

### 2. Generics

**Generics** restrict a collection's element type and check type safety at compile time.

```java
// ========== Without generics (not recommended) ==========
ArrayList list = new ArrayList();
list.add("Hello");
list.add(123);        // Any type can be added
list.add(new Object());
// Retrieving an element requires an explicit cast, which is error-prone

// ========== With generics (recommended) ==========
ArrayList<String> list = new ArrayList<>();  // Diamond syntax in JDK 7+
list.add("Hello");
// list.add(123);  // ❌ Compile error: only String elements are allowed
String s = list.get(0);  // No cast required
```

### 3. Points to Remember About Generics

```java
// 1. Type arguments must be reference types, not primitive types
ArrayList<int> list1 = new ArrayList<>();     // ❌ Incorrect
ArrayList<Integer> list2 = new ArrayList<>(); // ✅ Correct

// 2. Wrapper classes corresponding to primitive types
// int     → Integer
// double  → Double
// char    → Character
// boolean → Boolean
// byte    → Byte
// short   → Short
// long    → Long
// float   → Float

// 3. Autoboxing and unboxing
ArrayList<Integer> list = new ArrayList<>();
list.add(10);        // Autoboxing: int → Integer
int num = list.get(0);  // Auto-unboxing: Integer → int
```

### 4. Convenient Collection Creation

```java
import java.util.*;

// ========== Arrays.asList() (fixed size) ==========
List<String> list1 = Arrays.asList("张三", "李四", "王五");
// list1.add("赵六");  // ❌ Adding/removing elements is not allowed
list1.set(0, "钱七");  // ✅ Replacing an element is allowed

// Convert to a mutable ArrayList
ArrayList<String> list2 = new ArrayList<>(Arrays.asList("A", "B", "C"));
list2.add("D");  // ✅ Adding elements is allowed

// ========== List.of() (JDK 9+, immutable) ==========
List<String> list3 = List.of("张三", "李四", "王五");
// list3.add("赵六");  // ❌ Immutable: cannot modify
// list3.set(0, "钱七");  // ❌ Immutable

// Convert to a mutable ArrayList
ArrayList<String> list4 = new ArrayList<>(List.of("A", "B", "C"));

// ========== Other convenient creation methods ==========
// Set
Set<String> set = Set.of("A", "B", "C");  // JDK 9+, immutable

// Map
Map<String, Integer> map = Map.of("张三", 18, "李四", 20);  // JDK 9+, immutable
```

### 5. Creating Other Common Collections

```java
import java.util.*;

// ========== List implementations ==========
List<String> arrayList = new ArrayList<>();   // Array-backed; fast lookups
List<String> linkedList = new LinkedList<>(); // Linked list; fast insertions/removals

// ========== Set implementations ==========
Set<String> hashSet = new HashSet<>();        // Unordered; no duplicates
Set<String> linkedHashSet = new LinkedHashSet<>();  // Preserves insertion order
Set<String> treeSet = new TreeSet<>();        // Automatically sorted

// ========== Map implementations ==========
Map<String, Integer> hashMap = new HashMap<>();       // Unordered
Map<String, Integer> linkedHashMap = new LinkedHashMap<>();  // Preserves insertion order
Map<String, Integer> treeMap = new TreeMap<>();       // Sorted by key
```

***

## III. Common Collection Methods

### 1. Common ArrayList Methods

#### 1.1 Add, Remove, Update, and Retrieve

| Method                    | Description             | Return value     |
| --------------------- | -------------- | ------- |
| `add(E e)`            | Append an element        | boolean |
| `add(int index, E e)` | Insert an element at a specified index      | void    |
| `remove(int index)`   | Remove the element at a specified index      | The removed element  |
| `remove(Object o)`    | Remove the specified element (first match) | boolean |
| `set(int index, E e)` | Replace the element at a specified index      | The previous element   |
| `get(int index)`      | Get the element at a specified index      | E       |

```java
ArrayList<String> list = new ArrayList<>();

// ========== Add ==========
list.add("张三");           // Append to the end
list.add("李四");
list.add("王五");
list.add(1, "赵六");        // Insert at index 1
// Result: [张三, 赵六, 李四, 王五]

// ========== Remove ==========
String removed = list.remove(0);  // Remove index 0; returns "张三"
boolean success = list.remove("李四");  // Remove "李四"; returns true
// Result: [赵六, 王五]

// ========== Update ==========
String old = list.set(0, "钱七");  // Replace index 0; returns the previous value "赵六"
// Result: [钱七, 王五]

// ========== Retrieve ==========
String name = list.get(0);  // Get index 0; returns "钱七"
```

#### 1.2 Bulk Operations

| Method                                | Description           |
| --------------------------------- | ------------ |
| `addAll(Collection c)`            | Add all elements from another collection |
| `addAll(int index, Collection c)` | Insert another collection at a specified index |
| `removeAll(Collection c)`         | Remove elements in the intersection       |
| `retainAll(Collection c)`         | Retain only elements in the intersection      |

```java
ArrayList<String> list1 = new ArrayList<>();
list1.add("A");
list1.add("B");

ArrayList<String> list2 = new ArrayList<>();
list2.add("C");
list2.add("D");

// Add in bulk
list1.addAll(list2);
System.out.println(list1);  // [A, B, C, D]

// Add in bulk at a specified index
list1.addAll(1, Arrays.asList("X", "Y"));
System.out.println(list1);  // [A, X, Y, B, C, D]
```

#### 1.3 Other Common Methods

| Method                          | Description          |
| --------------------------- | ----------- |
| `size()`                    | Get the collection size      |
| `isEmpty()`                 | Check whether it is empty      |
| `contains(Object o)`        | Check whether it contains a specified element  |
| `indexOf(Object o)`         | Find the first occurrence of an element |
| `lastIndexOf(Object o)`     | Find the last occurrence of an element |
| `clear()`                   | Clear the collection        |
| `toArray()`                 | Convert to an array       |
| `subList(int from, int to)` | Get a sublist (view)   |

```java
ArrayList<String> list = new ArrayList<>();
list.add("张三");
list.add("李四");
list.add("王五");
list.add("李四");

// ========== Common operations ==========
int size = list.size();              // 4
boolean empty = list.isEmpty();       // false
boolean has = list.contains("张三");  // true
int first = list.indexOf("李四");     // 1
int last = list.lastIndexOf("李四");  // 3

// ========== Get a sublist ==========
List<String> sub = list.subList(1, 3);  // [李四, 王五]
// Note: subList returns a view; changes affect the original list

// ========== Convert to an array ==========
Object[] arr1 = list.toArray();
String[] arr2 = list.toArray(new String[0]);  // Recommended form

// ========== Clear ==========
list.clear();
System.out.println(list.isEmpty());  // true
```

#### 1.4 Sorting

```java
ArrayList<Integer> nums = new ArrayList<>();
nums.add(3);
nums.add(1);
nums.add(4);
nums.add(1);
nums.add(5);

// Option 1: Collections.sort()
Collections.sort(nums);  // Ascending order
System.out.println(nums);  // [1, 1, 3, 4, 5]

Collections.sort(nums, Collections.reverseOrder());  // Descending order
System.out.println(nums);  // [5, 4, 3, 1, 1]

// Option 2: list.sort() (JDK 8+)
nums.sort(null);  // Natural order (ascending)
nums.sort(Comparator.reverseOrder());  // Descending order
nums.sort((a, b) -> b - a);  // Descending order using a lambda

// Sort objects
ArrayList<Student> students = new ArrayList<>();
students.add(new Student("张三", 18));
students.add(new Student("李四", 20));
students.add(new Student("王五", 16));

// Sort by age in ascending order
students.sort((s1, s2) -> s1.getAge() - s2.getAge());
// Or
students.sort(Comparator.comparingInt(Student::getAge));
```

### 2. Iterating Over Collections

#### 2.1 Basic for Loop (List Only)

```java
ArrayList<String> list = new ArrayList<>();
list.add("张三");
list.add("李四");
list.add("王五");

for (int i = 0; i < list.size(); i++) {
    String name = list.get(i);
    System.out.println(i + ": " + name);
}
```

#### 2.2 Enhanced for Loop (Recommended)

```java
for (String name : list) {
    System.out.println(name);
}
```

#### 2.3 Iterator

```java
import java.util.Iterator;

Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String name = it.next();
    System.out.println(name);
}
```

#### 2.4 Lambda Expressions (Java 8+)

```java
// forEach + Lambda
list.forEach(name -> System.out.println(name));

// forEach + method reference
list.forEach(System.out::println);

// Iterate with indices (using IntStream)
IntStream.range(0, list.size())
    .forEach(i -> System.out.println(i + ": " + list.get(i)));
```

#### 2.5 Streams (Java 8+)

```java
// Basic iteration
list.stream().forEach(System.out::println);

// Iterate after filtering
list.stream()
    .filter(name -> name.startsWith("张"))
    .forEach(System.out::println);
```

### 3. Removing Elements During Iteration

```java
ArrayList<String> list = new ArrayList<>();
list.add("张三");
list.add("李四");
list.add("李四");
list.add("王五");

// ❌ Incorrect: do not remove directly during an enhanced for loop
for (String name : list) {
    if ("李四".equals(name)) {
        list.remove(name);  // Throws ConcurrentModificationException
    }
}

// ✅ Correct option 1: Remove through an iterator
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String name = it.next();
    if ("李四".equals(name)) {
        it.remove();  // Use the iterator's remove method
    }
}

// ✅ Correct option 2: Iterate backwards and remove
for (int i = list.size() - 1; i >= 0; i--) {
    if ("李四".equals(list.get(i))) {
        list.remove(i);
    }
}

// ✅ Correct option 3: removeIf (JDK 8+, recommended)
list.removeIf(name -> "李四".equals(name));
// Or
list.removeIf("李四"::equals);
```

***

## IV. Collection Exercises

### Exercise 1: Store Student Objects

```java
// ========== Student class ==========
public class Student {
    private String name;
    private int age;

    public Student() {}

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    @Override
    public String toString() {
        return "Student{name='" + name + "', age=" + age + "}";
    }
}

// ========== Test class ==========
public class Test {
    public static void main(String[] args) {
        // Create the collection
        ArrayList<Student> list = new ArrayList<>();

        // Add students
        list.add(new Student("张三", 18));
        list.add(new Student("李四", 19));
        list.add(new Student("王五", 20));

        // Iterate
        for (Student s : list) {
            System.out.println(s.getName() + " - " + s.getAge() + " years old");
        }

        // Or use a lambda
        list.forEach(s -> System.out.println(s));
    }
}
```

### Exercise 2: Enter Student Details from the Keyboard

```java
import java.util.ArrayList;
import java.util.Scanner;

public class Test {
    public static void main(String[] args) {
        ArrayList<Student> list = new ArrayList<>();
        Scanner sc = new Scanner(System.in);

        // Read input in a loop
        while (true) {
            System.out.print("Enter the student's name (q to quit): ");
            String name = sc.nextLine();

            if ("q".equalsIgnoreCase(name)) {
                break;
            }

            System.out.print("Enter the student's age: ");
            int age = sc.nextInt();
            sc.nextLine();  // Consume the newline

            list.add(new Student(name, age));
            System.out.println("Added successfully! There are now " + list.size() + " students\n");
        }

        // Print all students
        System.out.println("\n===== Student List =====");
        for (int i = 0; i < list.size(); i++) {
            Student s = list.get(i);
            System.out.println((i + 1) + ". " + s.getName() + " - " + s.getAge() + " years old");
        }

        sc.close();
    }
}
```

### Exercise 3: Search and Count

```java
public class Test {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("张三");
        list.add("李四");
        list.add("张三");
        list.add("王五");
        list.add("张三");

        // Check whether an element exists
        String target = "李四";
        if (list.contains(target)) {
            int index = list.indexOf(target);
            System.out.println(target + " is at index " + index);
        } else {
            System.out.println(target + " does not exist");
        }

        // Count occurrences (option 1: loop)
        int count = 0;
        for (String name : list) {
            if ("张三".equals(name)) {
                count++;
            }
        }
        System.out.println("张三 occurs " + count + " times");  // 3

        // Count occurrences (option 2: Collections.frequency)
        int freq = Collections.frequency(list, "张三");
        System.out.println("张三 occurs " + freq + " times");  // 3

        // Count occurrences (option 3: Stream)
        long streamCount = list.stream().filter("张三"::equals).count();
        System.out.println("张三 occurs " + streamCount + " times");  // 3
    }
}
```

### Exercise 4: Sort

```java
public class Test {
    public static void main(String[] args) {
        // ========== Sort numbers ==========
        ArrayList<Integer> nums = new ArrayList<>();
        nums.add(5);
        nums.add(2);
        nums.add(8);
        nums.add(1);
        nums.add(9);

        // Ascending order
        Collections.sort(nums);
        System.out.println("Ascending: " + nums);  // [1, 2, 5, 8, 9]

        // Descending order
        nums.sort(Collections.reverseOrder());
        System.out.println("Descending: " + nums);  // [9, 8, 5, 2, 1]

        // ========== Sort strings ==========
        ArrayList<String> names = new ArrayList<>();
        names.add("张三丰");
        names.add("张无忌");
        names.add("赵敏");
        names.add("小昭");

        // Sort by length
        names.sort(Comparator.comparingInt(String::length));
        System.out.println("By length: " + names);  // [赵敏, 小昭, 张三丰, 张无忌]

        // Sort Chinese names by pinyin
        names.sort(Collator.getInstance(Locale.CHINESE));
        System.out.println("By pinyin: " + names);

        // ========== Sort objects ==========
        ArrayList<Student> students = new ArrayList<>();
        students.add(new Student("张三", 20));
        students.add(new Student("李四", 18));
        students.add(new Student("王五", 22));

        // Sort by age in ascending order
        students.sort(Comparator.comparingInt(Student::getAge));
        students.forEach(s -> System.out.println(s.getName() + ": " + s.getAge()));
        // 李四: 18
        // 张三: 20
        // 王五: 22

        // Sort by age in descending order
        students.sort(Comparator.comparingInt(Student::getAge).reversed());

        // Sort by age first, then by name
        students.sort(Comparator
            .comparingInt(Student::getAge)
            .thenComparing(Student::getName));
    }
}
```

### Exercise 5: Remove Duplicates

```java
public class Test {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("张三");
        list.add("李四");
        list.add("张三");
        list.add("王五");
        list.add("李四");

        // Option 1: Build a new collection (preserves order)
        ArrayList<String> newList = new ArrayList<>();
        for (String name : list) {
            if (!newList.contains(name)) {
                newList.add(name);
            }
        }
        System.out.println(newList);  // [张三, 李四, 王五]

        // Option 2: Use LinkedHashSet (preserves order; more concise)
        ArrayList<String> result = new ArrayList<>(new LinkedHashSet<>(list));
        System.out.println(result);  // [张三, 李四, 王五]

        // Option 3: Use Stream (JDK 8+)
        List<String> distinct = list.stream().distinct().collect(Collectors.toList());
        System.out.println(distinct);  // [张三, 李四, 王五]
    }
}
```

### Exercise 6: Collections as Method Parameters and Return Values

```java
public class Test {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);
        list.add(4);
        list.add(5);

        // Get even numbers
        ArrayList<Integer> evenList = getEven(list);
        System.out.println("Even numbers: " + evenList);  // [2, 4]

        // Get elements greater than a specified value
        ArrayList<Integer> greater = getGreaterThan(list, 3);
        System.out.println("Greater than 3: " + greater);  // [4, 5]

        // Get the maximum and minimum
        System.out.println("Maximum: " + Collections.max(list));  // 5
        System.out.println("Minimum: " + Collections.min(list));  // 1
    }

    // Return all even numbers in the collection
    public static ArrayList<Integer> getEven(ArrayList<Integer> list) {
        ArrayList<Integer> result = new ArrayList<>();
        for (Integer num : list) {
            if (num % 2 == 0) {
                result.add(num);
            }
        }
        return result;
    }

    // Return elements greater than a specified value
    public static ArrayList<Integer> getGreaterThan(ArrayList<Integer> list, int threshold) {
        ArrayList<Integer> result = new ArrayList<>();
        for (Integer num : list) {
            if (num > threshold) {
                result.add(num);
            }
        }
        return result;
    }
}
```

### Exercise 7: Shuffling and Random Selection

```java
public class Test {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("A");
        list.add("B");
        list.add("C");
        list.add("D");
        list.add("E");

        // Shuffle the order
        Collections.shuffle(list);
        System.out.println("Shuffled: " + list);  // Random order

        // Get one random element
        Random random = new Random();
        int index = random.nextInt(list.size());
        String randomItem = list.get(index);
        System.out.println("Random element: " + randomItem);

        // Get multiple random elements without repetition
        Collections.shuffle(list);
        List<String> randomList = list.subList(0, 3);  // Select 3 at random
        System.out.println("3 random elements: " + randomList);
    }
}
```

***

## V. Common Collection Methods Quick Reference

### ArrayList Methods

| Method                    | Description            |
| --------------------- | ------------- |
| `add(e)`              | Add an element          |
| `add(index, e)`       | Add at an index        |
| `addAll(collection)`  | Add in bulk          |
| `remove(index)`       | Remove by index         |
| `remove(object)`      | Remove by element         |
| `removeIf(predicate)` | Remove by condition (JDK 8+) |
| `set(index, e)`       | Replace an element          |
| `get(index)`          | Get an element          |
| `size()`              | Get size          |
| `isEmpty()`           | Check whether empty          |
| `contains(e)`         | Check containment          |
| `indexOf(e)`          | Find position          |
| `subList(from, to)`   | Get a sublist         |
| `sort(comparator)`    | Sort (JDK 8+)    |
| `clear()`             | Clear            |
| `toArray()`           | Convert to an array         |

### The Collections Utility Class

| Method                                  | Description         |
| ----------------------------------- | ---------- |
| `Collections.sort(list)`            | Sort         |
| `Collections.reverse(list)`         | Reverse         |
| `Collections.shuffle(list)`         | Shuffle         |
| `Collections.max(list)`             | Maximum        |
| `Collections.min(list)`             | Minimum        |
| `Collections.frequency(list, e)`    | Count occurrences     |
| `Collections.binarySearch(list, e)` | Binary search (must sort first) |

### Iteration Approaches Compared

| Approach      | Syntax                                      | Use case  |
| ------- | --------------------------------------- | ----- |
| Basic for loop  | `for (int i = 0; i < list.size(); i++)` | When indices are needed  |
| Enhanced for loop  | `for (E e : list)`                      | Simple iteration  |
| Iterator     | `Iterator` + `hasNext/next`             | Removing during iteration |
| forEach | `list.forEach(lambda)`                  | Functional programming |
| Stream  | `list.stream().forEach()`               | Chained operations  |

### Creation Approaches Compared

| Approach                           | Mutability      | Version       |
| ---------------------------- | -------- | -------- |
| `new ArrayList<>()`          | Mutable       | All versions     |
| `Arrays.asList()`            | Can replace elements, but cannot add/remove | JDK 1.2+ |
| `List.of()`                  | Fully immutable    | JDK 9+   |
| `new ArrayList<>(List.of())` | Mutable       | JDK 9+   |
