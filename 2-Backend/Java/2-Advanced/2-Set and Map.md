## I. Introduction to Set

### 1. Set Interface Characteristics

| Characteristic | Description |
| ------- | ----------- |
| **Unordered** | Retrieval order may differ from insertion order |
| **No duplicates** | Duplicate elements are not permitted |
| **No index** | Elements cannot be accessed by index |

### 2. Set vs List

| Comparison | List | Set |
| ---- | -------------------- | -------------------- |
| Ordering | Ordered | Unordered (except LinkedHashSet) |
| Duplicates | Allowed | Not allowed |
| Indexing | Indexed | Not indexed |
| Common implementations | ArrayList, LinkedList | HashSet, TreeSet |

### 3. Common Set Methods

```java
Set<String> set = new HashSet<>();

// Add elements
set.add("A");
set.add("B");
set.add("A");  // Duplicate element: addition fails and returns false
System.out.println(set);  // [A, B]

// Remove an element
set.remove("A");

// Query
set.contains("B");  // true
set.isEmpty();      // false
set.size();         // 1

// Iterate (using an iterator, enhanced for, or forEach)
for (String s : set) {
    System.out.println(s);
}

// Convert to an array
String[] arr = set.toArray(new String[0]);
```

***

## II. HashSet

### 1. HashSet Characteristics

| Characteristic | Description |
| ----------- | ------------------------ |
| **Internal structure** | Hash table (array + linked lists + red-black trees) |
| **Unordered** | Does not guarantee insertion/retrieval order |
| **No duplicates** | Relies on hashCode() and equals() |
| **Allows null** | Can store one null value |
| **Not thread-safe** | Multithreaded use requires synchronization |

### 2. Basic Usage

```java
import java.util.HashSet;
import java.util.Set;

public class HashSetDemo {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();

        // Add elements
        set.add("张三");
        set.add("李四");
        set.add("王五");
        set.add("张三");  // Duplicate; addition fails

        System.out.println(set);  // [李四, 张三, 王五] (order is unspecified)
        System.out.println(set.size());  // 3
    }
}
```

### 3. How Hash Tables Work

#### 3.1 JDK 7: Array + Linked Lists

    ┌───┬───┬───┬───┬───┬───┬───┬───┐
    │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │  ← array
    └─┬─┴───┴─┬─┴───┴───┴─┬─┴───┴───┘
      │       │           │
      ↓       ↓           ↓
     [A]     [B]         [D]
      │       │
      ↓       ↓
     [C]     [E]  ← linked lists (for hash collisions)

#### 3.2 JDK 8: Array + Linked Lists + Red-Black Trees

    When a list has > 8 nodes and the array length is >= 64, the list becomes a red-black tree

    ┌───┬───┬───┬───┬───┬───┬───┬───┐
    │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │
    └─┬─┴───┴─┬─┴───┴───┴─┬─┴───┴───┘
      │       │           │
      ↓       ↓           ↓
     List   List        Red-black tree (list length > 8)

#### 3.3 Initial Capacity and Load Factor

```java
// Default initial capacity: 16
// Default load factor: 0.75

// Resize threshold = capacity × load factor = 16 × 0.75 = 12
// When the element count exceeds 12, the array doubles in capacity

// Specify the initial capacity (avoid frequent resizing)
Set<String> set = new HashSet<>(32);  // Initial capacity: 32

// Specify both initial capacity and load factor
Set<String> set2 = new HashSet<>(32, 0.75f);
```

**Resizing:**

| Stage | Capacity | Resize threshold |
| ----- | --- | ---- |
| Initial | 16 | 12 |
| First resize | 32 | 24 |
| Second resize | 64 | 48 |
| Third resize | 128 | 96 |

### 4. How Duplicate Detection Works

```java
// HashSet relies on two methods to detect duplicates:
// 1. hashCode(): calculates the hash code, determining the storage location
// 2. equals(): compares contents for equality

// Duplicate detection process:
// 1. Calculate the element's hashCode
// 2. Calculate its storage location from the hashCode
// 3. If that location is empty, store the element directly
// 4. Otherwise, compare using equals
//    - equals returns true: duplicate; do not store
//    - equals returns false: not a duplicate; store in the linked list/red-black tree

public class Student {
    private String name;
    private int age;

    // Must override hashCode and equals
    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return age == student.age && Objects.equals(name, student.name);
    }
}
```

### 5. Deduplicating Custom Objects

```java
public class HashSetDemo {
    public static void main(String[] args) {
        Set<Student> set = new HashSet<>();

        set.add(new Student("张三", 18));
        set.add(new Student("李四", 19));
        set.add(new Student("张三", 18));  // Duplicate; addition fails

        System.out.println(set.size());  // 2 (provided hashCode and equals are overridden)
    }
}
```

### 6. Set Operations

```java
Set<Integer> set1 = new HashSet<>(Arrays.asList(1, 2, 3, 4, 5));
Set<Integer> set2 = new HashSet<>(Arrays.asList(4, 5, 6, 7, 8));

// Union
Set<Integer> union = new HashSet<>(set1);
union.addAll(set2);
System.out.println(union);  // [1, 2, 3, 4, 5, 6, 7, 8]

// Intersection
Set<Integer> intersection = new HashSet<>(set1);
intersection.retainAll(set2);
System.out.println(intersection);  // [4, 5]

// Difference (set1 - set2)
Set<Integer> difference = new HashSet<>(set1);
difference.removeAll(set2);
System.out.println(difference);  // [1, 2, 3]

// Test whether the sets intersect
boolean hasCommon = !Collections.disjoint(set1, set2);  // true
```

***

## III. LinkedHashSet

### 1. LinkedHashSet Characteristics

| Characteristic | Description |
| -------- | ------------------------ |
| **Internal structure** | Hash table + doubly linked list |
| **Ordered** | Retrieval order matches insertion order |
| **No duplicates** | Relies on hashCode() and equals() |
| **Efficiency** | Slightly lower than HashSet |

### 2. Basic Usage

```java
import java.util.LinkedHashSet;
import java.util.Set;

public class LinkedHashSetDemo {
    public static void main(String[] args) {
        Set<String> set = new LinkedHashSet<>();

        set.add("张三");
        set.add("李四");
        set.add("王五");

        // Iteration follows insertion order
        System.out.println(set);  // [张三, 李四, 王五]
    }
}
```

### 3. Internal Structure

    LinkedHashSet = hash table + doubly linked list

    The hash table ensures uniqueness
    The doubly linked list ensures ordering (insertion order)

    ┌───────────────────────────────────────┐
    │           Hash table (array)                │
    │  ┌───┬───┬───┬───┬───┬───┬───┬───┐   │
    │  │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │   │
    │  └───┴───┴───┴───┴───┴───┴───┴───┘   │
    └───────────────────────────────────────┘
                        +
    ┌───────────────────────────────────────┐
    │            Doubly linked list               │
    │   [张三] ←→ [李四] ←→ [王五]            │
    │   head                    tail        │
    └───────────────────────────────────────┘

***

## IV. TreeSet

### 1. TreeSet Characteristics

| Characteristic | Description |
| ------------ | --------------------------- |
| **Internal structure** | Red-black tree (self-balancing binary search tree) |
| **Ordered** | Elements follow natural ordering or a comparator |
| **No duplicates** | Relies on compareTo() or a Comparator |
| **Disallows null** | Cannot store null values |

### 2. Basic Usage

```java
import java.util.TreeSet;
import java.util.Set;

public class TreeSetDemo {
    public static void main(String[] args) {
        Set<Integer> set = new TreeSet<>();

        set.add(5);
        set.add(3);
        set.add(8);
        set.add(1);

        // Automatically sorted
        System.out.println(set);  // [1, 3, 5, 8]
    }
}
```

### 3. Natural Ordering (Comparable)

```java
// Approach 1: make the element class implement Comparable
public class Student implements Comparable<Student> {
    private String name;
    private int age;

    @Override
    public int compareTo(Student o) {
        // Sort by age in ascending order
        int result = this.age - o.age;
        // Break age ties by name (to ensure uniqueness)
        return result == 0 ? this.name.compareTo(o.name) : result;
    }
}

// Usage
Set<Student> set = new TreeSet<>();
set.add(new Student("张三", 18));
set.add(new Student("李四", 20));
set.add(new Student("王五", 18));
// Results sorted by age
```

### 4. Ordering with a Comparator

```java
// Approach 2: pass a Comparator when creating the TreeSet
Set<Student> set = new TreeSet<>((s1, s2) -> {
    // Sort by age in descending order
    int result = s2.getAge() - s1.getAge();
    return result == 0 ? s1.getName().compareTo(s2.getName()) : result;
});

set.add(new Student("张三", 18));
set.add(new Student("李四", 20));
set.add(new Student("王五", 18));
// Results sorted by descending age

// Use Comparator static methods
Set<Student> set2 = new TreeSet<>(
    Comparator.comparingInt(Student::getAge)
              .thenComparing(Student::getName)
);
```

### 5. Navigation Methods

```java
TreeSet<Integer> set = new TreeSet<>();
set.addAll(Arrays.asList(1, 3, 5, 7, 9));

// Get the first and last elements
Integer first = set.first();  // 1
Integer last = set.last();    // 9

// Get and remove the first and last elements
Integer pollFirst = set.pollFirst();  // 1 (also removed from the set)
Integer pollLast = set.pollLast();    // 9 (also removed from the set)

// ceiling: smallest element greater than or equal to the given element
Integer ceiling = set.ceiling(4);  // 5

// floor: largest element less than or equal to the given element
Integer floor = set.floor(4);  // 3

// higher: smallest element greater than the given element
Integer higher = set.higher(5);  // 7

// lower: largest element less than the given element
Integer lower = set.lower(5);  // 3
```

### 6. Range Views

```java
TreeSet<Integer> set = new TreeSet<>();
set.addAll(Arrays.asList(1, 3, 5, 7, 9, 11, 13, 15));

// headSet: all elements less than the given element
SortedSet<Integer> head = set.headSet(9);  // [1, 3, 5, 7]

// tailSet: all elements greater than or equal to the given element
SortedSet<Integer> tail = set.tailSet(9);  // [9, 11, 13, 15]

// subSet: range [from, to)
SortedSet<Integer> sub = set.subSet(5, 11);  // [5, 7, 9]

// NavigableSet overloads: specify whether to include each boundary
NavigableSet<Integer> sub2 = set.subSet(5, true, 11, true);  // [5, 7, 9, 11]

// Descending view
NavigableSet<Integer> descending = set.descendingSet();  // [15, 13, 11, 9, 7, 5, 3, 1]
```

### 7. Red-Black Tree Structure

    A red-black tree is a self-balancing binary search tree

    Characteristics:
    ├─ Left child < parent < right child
    ├─ Lookup: O(log n)
    └─ Automatically balances after insertion/removal

    Example: store [5, 3, 8, 1, 4]

            5 (root)
           / \
          3   8
         / \
        1   4

***

## V. Comparing Set Implementations

| Comparison | HashSet | LinkedHashSet | TreeSet |
| ----------- | ----------------- | ----------------- | ---------------------- |
| **Internal structure** | Hash table | Hash table + doubly linked list | Red-black tree |
| **Ordering** | Unordered | Ordered (insertion order) | Ordered (sorted order) |
| **Duplicate detection** | hashCode + equals | hashCode + equals | compareTo or Comparator |
| **Allows null** | One allowed | One allowed | Not allowed |
| **Efficiency** | O(1) | O(1) | O(log n) |
| **Use case** | Deduplication, order irrelevant | Deduplication, preserve insertion order | Deduplication with sorting |

***

## VI. The Collections Utility Class

### 1. What Is Collections?

**Collections** is a utility class that provides a set of static methods for manipulating collections.

**Distinguish these names**:

*   `Collection`: the collection interface (the top-level interface for collections of individual elements)
*   `Collections`: a utility class for manipulating collections

### 2. Sorting and Searching Methods

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsDemo {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();

        // ========== Bulk addition ==========
        Collections.addAll(list, 5, 3, 8, 1, 9, 2);
        System.out.println(list);  // [5, 3, 8, 1, 9, 2]

        // ========== Sort ==========
        Collections.sort(list);
        System.out.println(list);  // [1, 2, 3, 5, 8, 9]

        // Sort in descending order
        Collections.sort(list, Collections.reverseOrder());
        System.out.println(list);  // [9, 8, 5, 3, 2, 1]

        // Custom sorting
        Collections.sort(list, (a, b) -> b - a);

        // ========== Reverse ==========
        Collections.reverse(list);
        System.out.println(list);  // [1, 2, 3, 5, 8, 9]

        // ========== Random shuffle ==========
        Collections.shuffle(list);
        System.out.println(list);  // [random order]

        // ========== Maximum and minimum ==========
        Collections.sort(list);  // Sort first
        System.out.println(Collections.max(list));  // 9
        System.out.println(Collections.min(list));  // 1

        // ========== Binary search (sort first) ==========
        int index = Collections.binarySearch(list, 5);
        System.out.println(index);  // Returns the index

        // ========== Swap ==========
        Collections.swap(list, 0, 1);  // Swap elements at indices 0 and 1

        // ========== Rotate ==========
        Collections.rotate(list, 2);  // Rotate right by 2 positions
    }
}
```

### 3. Filling and Copying Methods

```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));

// Fill: replace every element with the specified element
Collections.fill(list, "X");
System.out.println(list);  // [X, X, X, X, X]

// Copy: copy src into dest (dest must be at least as large as src)
List<String> src = Arrays.asList("1", "2", "3");
List<String> dest = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
Collections.copy(dest, src);
System.out.println(dest);  // [1, 2, 3, D, E]

// A List of n identical elements
List<String> repeated = Collections.nCopies(5, "Hello");
System.out.println(repeated);  // [Hello, Hello, Hello, Hello, Hello]
```

### 4. Counting and Testing Methods

```java
List<String> list = Arrays.asList("A", "B", "A", "C", "A", "B");

// frequency: count occurrences of an element
int count = Collections.frequency(list, "A");
System.out.println(count);  // 3

// disjoint: test whether two collections have no elements in common
List<String> list1 = Arrays.asList("A", "B", "C");
List<String> list2 = Arrays.asList("D", "E", "F");
List<String> list3 = Arrays.asList("C", "D", "E");

boolean noCommon1 = Collections.disjoint(list1, list2);  // true (no intersection)
boolean noCommon2 = Collections.disjoint(list1, list3);  // false (intersection exists)
```

### 5. Creating Immutable Collections

```java
// Create immutable collections (wrapping existing collections)
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));
List<String> unmodifiable = Collections.unmodifiableList(list);
// unmodifiable.add("D");  // ❌ Throws UnsupportedOperationException

Set<String> unmodifiableSet = Collections.unmodifiableSet(new HashSet<>(list));
Map<String, Integer> unmodifiableMap = Collections.unmodifiableMap(new HashMap<>());

// Create empty collections
List<String> emptyList = Collections.emptyList();
Set<String> emptySet = Collections.emptySet();
Map<String, String> emptyMap = Collections.emptyMap();

// Create singleton collections
List<String> singleList = Collections.singletonList("A");
Set<String> singleSet = Collections.singleton("A");
Map<String, Integer> singleMap = Collections.singletonMap("key", 100);
```

### 6. Creating Thread-Safe Collections

```java
// Wrap ordinary collections as thread-safe collections
List<String> list = new ArrayList<>();
List<String> syncList = Collections.synchronizedList(list);

Set<String> set = new HashSet<>();
Set<String> syncSet = Collections.synchronizedSet(set);

Map<String, Integer> map = new HashMap<>();
Map<String, Integer> syncMap = Collections.synchronizedMap(map);

// Note: iteration still requires explicit synchronization
synchronized (syncList) {
    for (String s : syncList) {
        System.out.println(s);
    }
}
```

### 7. Immutable Collection Factory Methods in JDK 9+

```java
// Set.of(): create an immutable Set
Set<String> set = Set.of("A", "B", "C");
// set.add("D");  // ❌ UnsupportedOperationException

// List.of(): create an immutable List
List<String> list = List.of("A", "B", "C");

// Map.of(): create an immutable Map (up to 10 key-value pairs)
Map<String, Integer> map = Map.of("A", 1, "B", 2, "C", 3);

// Map.ofEntries(): create an immutable Map (more than 10 key-value pairs)
Map<String, Integer> map2 = Map.ofEntries(
    Map.entry("A", 1),
    Map.entry("B", 2),
    Map.entry("C", 3)
);

// JDK 10+: copy into immutable collections
List<String> copy = List.copyOf(originalList);
Set<String> setCopy = Set.copyOf(originalSet);
Map<String, Integer> mapCopy = Map.copyOf(originalMap);
```

***

## VII. Introduction to Map

### 1. Map Interface Characteristics

| Characteristic | Description |
| -------- | ------------------- |
| **Key-value collection** | Stores key-value pairs |
| **Unique keys** | Keys cannot repeat; values can |
| **Key-value mapping** | Each key corresponds to one value |

### 2. Map Structure

    Map<Key, Value>

    ┌─────────────────────────────────────┐
    │  Key        │    Value                 │
    ├─────────────────────────────────────┤
    │  "name"     │    "张三"             │
    │  "age"      │    18                 │
    │  "gender"   │    "男"               │
    └─────────────────────────────────────┘

    Keys must be unique; values can repeat

### 3. Common Map Methods

| Method | Description |
| ----------------------------- | -------------------- |
| `put(K key, V value)` | Adds/updates a key-value pair |
| `remove(Object key)` | Removes a key-value pair by key |
| `get(Object key)` | Returns the value for a key |
| `containsKey(Object key)` | Tests whether the specified key exists |
| `containsValue(Object value)` | Tests whether the specified value exists |
| `size()` | Returns the number of key-value pairs |
| `isEmpty()` | Tests whether empty |
| `clear()` | Clears the map |
| `keySet()` | Returns a Set of all keys |
| `values()` | Returns a Collection of all values |
| `entrySet()` | Returns a Set of all key-value pairs |

### 4. Basic Usage

```java
import java.util.HashMap;
import java.util.Map;

public class MapDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();

        // ========== Add ==========
        map.put("张三", 18);
        map.put("李四", 20);
        map.put("王五", 22);
        System.out.println(map);  // {李四=20, 张三=18, 王五=22}

        // An existing key's value is overwritten, and the old value is returned
        Integer oldValue = map.put("张三", 25);
        System.out.println(oldValue);  // 18
        System.out.println(map.get("张三"));  // 25

        // ========== Remove ==========
        map.remove("李四");

        // Remove only if both key and value match
        map.remove("张三", 25);  // Removal succeeds
        map.remove("王五", 100);  // Removal fails (value does not match)

        // ========== Query ==========
        Integer age = map.get("张三");  // 25 (returns null if absent)
        boolean hasKey = map.containsKey("张三");  // true
        boolean hasValue = map.containsValue(25);  // true

        // ========== Get all keys/values ==========
        Set<String> keys = map.keySet();
        Collection<Integer> values = map.values();
    }
}
```

***

## VIII. New Map Methods in JDK 8+

### 1. getOrDefault: Get a Value or a Default

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);

// Key exists: return its value
Integer age1 = map.getOrDefault("张三", 0);  // 18

// Key absent: return the default value
Integer age2 = map.getOrDefault("李四", 0);  // 0
```

### 2. putIfAbsent: Add Only When Absent

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);

// Key absent: add and return null
Integer result1 = map.putIfAbsent("李四", 20);  // null
System.out.println(map);  // {张三=18, 李四=20}

// Key exists: do not add; return the existing value
Integer result2 = map.putIfAbsent("张三", 25);  // 18
System.out.println(map.get("张三"));  // Still 18
```

### 3. computeIfAbsent: Compute and Add When Absent

```java
Map<String, List<String>> map = new HashMap<>();

// Traditional approach
if (!map.containsKey("fruits")) {
    map.put("fruits", new ArrayList<>());
}
map.get("fruits").add("apple");

// Using computeIfAbsent
map.computeIfAbsent("fruits", k -> new ArrayList<>()).add("apple");
map.computeIfAbsent("fruits", k -> new ArrayList<>()).add("banana");
System.out.println(map);  // {fruits=[apple, banana]}

// Common use: grouping
Map<String, Integer> wordCount = new HashMap<>();
for (String word : words) {
    wordCount.computeIfAbsent(word, k -> 0);
    wordCount.put(word, wordCount.get(word) + 1);
}
```

### 4. computeIfPresent: Compute and Update When Present

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);

// Key exists: calculate a new value
map.computeIfPresent("张三", (k, v) -> v + 1);
System.out.println(map.get("张三"));  // 19

// Key absent: do nothing
map.computeIfPresent("李四", (k, v) -> v + 1);
System.out.println(map.get("李四"));  // null
```

### 5. compute: Compute and Update Regardless of Presence

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);

// Key exists
map.compute("张三", (k, v) -> v == null ? 1 : v + 1);
System.out.println(map.get("张三"));  // 19

// Key absent
map.compute("李四", (k, v) -> v == null ? 1 : v + 1);
System.out.println(map.get("李四"));  // 1

// Count word occurrences
Map<String, Integer> wordCount = new HashMap<>();
for (String word : words) {
    wordCount.compute(word, (k, v) -> v == null ? 1 : v + 1);
}
```

### 6. merge: Merge Values

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);

// Key exists: merge values
map.merge("张三", 10, Integer::sum);  // 18 + 10 = 28

// Key absent: insert directly
map.merge("李四", 20, Integer::sum);  // 20

System.out.println(map);  // {张三=28, 李四=20}

// Common use: count word occurrences
Map<String, Integer> wordCount = new HashMap<>();
for (String word : words) {
    wordCount.merge(word, 1, Integer::sum);
}

// String concatenation
Map<String, String> map2 = new HashMap<>();
map2.merge("key", "Hello", (old, newVal) -> old + " " + newVal);
map2.merge("key", "World", (old, newVal) -> old + " " + newVal);
System.out.println(map2.get("key"));  // Hello World
```

### 7. The replace Methods

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);

// replace: replace only if the key exists
map.replace("张三", 25);
System.out.println(map.get("张三"));  // 25

map.replace("李四", 20);  // Absent; do nothing
System.out.println(map.get("李四"));  // null

// replace: replace only if the old value matches
boolean success = map.replace("张三", 25, 30);  // true
boolean fail = map.replace("张三", 100, 200);  // false (old value does not match)

// replaceAll: replace every value
map.replaceAll((k, v) -> v + 10);  // Add 10 to every value
```

### 8. Iterating with forEach

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);
map.put("李四", 20);

// Iterate with forEach
map.forEach((key, value) -> {
    System.out.println(key + " = " + value);
});
```

***

## IX. Three Ways to Iterate Over a Map

### 1. Approach 1: keySet()

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);
map.put("李四", 20);
map.put("王五", 22);

// Get all keys, then retrieve the value for each key
Set<String> keys = map.keySet();
for (String key : keys) {
    Integer value = map.get(key);
    System.out.println(key + " = " + value);
}
```

### 2. Approach 2: entrySet() (Recommended)

```java
// Get all key-value entry objects (Entry)
Set<Map.Entry<String, Integer>> entries = map.entrySet();
for (Map.Entry<String, Integer> entry : entries) {
    String key = entry.getKey();
    Integer value = entry.getValue();
    System.out.println(key + " = " + value);
}
```

### 3. Approach 3: forEach() (Java 8+)

```java
// Lambda expression
map.forEach((key, value) -> {
    System.out.println(key + " = " + value);
});

// Simplified form
map.forEach((k, v) -> System.out.println(k + " = " + v));
```

### 4. Comparing the Three Approaches

| Approach | Advantage | Disadvantage | Recommendation |
| ------------ | ----------- | ----------- | ----- |
| **keySet** | Simple code | Requires a second lookup (less efficient) | ⭐⭐⭐ |
| **entrySet** | Efficient; obtains key and value together | Slightly more complex code | ⭐⭐⭐⭐⭐ |
| **forEach** | Most concise code | Requires Java 8+ | ⭐⭐⭐⭐⭐ |

***

## X. Map Implementations

### 1. HashMap

#### 1.1 Characteristics

| Characteristic | Description |
| ----------- | ------------------------ |
| **Internal structure** | Hash table (array + linked lists + red-black trees) |
| **Unordered** | Does not guarantee insertion/retrieval order |
| **Unique keys** | Relies on hashCode() and equals() |
| **Allows null** | Both keys and values may be null |
| **Not thread-safe** | Multithreaded use requires synchronization |

#### 1.2 Initial Capacity and Load Factor

```java
// Default initial capacity: 16
// Default load factor: 0.75

// Specify the initial capacity (avoid frequent resizing)
// Recommendation: estimated element count / load factor + 1
Map<String, Integer> map = new HashMap<>(64);

// Specify both initial capacity and load factor
Map<String, Integer> map2 = new HashMap<>(64, 0.75f);
```

#### 1.3 Internal Implementation

**Data structure**: array (buckets) + linked lists + red-black trees (JDK 1.8+)

    Array (bucket array; default length 16)
    ┌───┬───┬───┬───┬───┬───┬───┬───┐
    │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │
    └─┬─┴───┴───┴─┬─┴───┴───┴───┴───┘
      │           │
      ↓           ↓
     [A]→[C]    [B]          ← linked lists (for hash collisions)
                              List length ≥ 8 and array length ≥ 64 → convert to a red-black tree

**Core `put` process**:

1. Calculate the key's `hashCode()`, then reduce collisions with the mixing function `(h = key.hashCode()) ^ (h >>> 16)`.
2. Calculate the array index using `index = hash & (n - 1)` (n is the array length, a power of two; the bitwise operation is equivalent to modulo).
3. If the slot is empty, store directly; otherwise, traverse the linked list/red-black tree:
   - Same key (`equals` returns true) → overwrite the old value
   - Different key → append to the linked list's tail (tail insertion in JDK 1.8)

**Conversion Between Linked Lists and Red-Black Trees**:

| Trigger | Conversion |
| --- | --- |
| List length ≥ 8 **and** array length ≥ 64 | Linked list → red-black tree |
| Red-black tree node count ≤ 6 | Red-black tree → linked list |
| List length ≥ 8 but array length < 64 | Resize; do not convert to a tree |

**Resizing**:

- The default load factor is `0.75`; resize threshold = capacity × load factor (initially 16 × 0.75 = 12).
- When the element count exceeds the threshold, the array **doubles in capacity** and all elements are rehashed (indices recalculated).
- Resizing is expensive; specify an initial capacity when the expected element count is known.

**Why It Is Not Thread-Safe**:

- JDK 1.7: head insertion during resizing can create a **cyclic linked list**, causing an infinite loop in `get` and 100% CPU usage.
- JDK 1.8: tail insertion fixes the cyclic-list problem, but concurrent `put` calls can still **overwrite data** (two threads write to the same bucket's tail simultaneously).
- Use `ConcurrentHashMap` in concurrent scenarios.

```java
// Mixing function (simplified source)
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    // XOR the high and low 16 bits so the high bits also influence the index, reducing collisions
}
```

#### 1.4 Custom Objects as Keys

```java
// Custom objects used as keys must override hashCode and equals
public class Student {
    private String name;
    private int age;

    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return age == student.age && Objects.equals(name, student.name);
    }
}

// Usage
Map<Student, String> map = new HashMap<>();
map.put(new Student("张三", 18), "北京");
map.put(new Student("张三", 18), "上海");  // Duplicate key; the value is overwritten
System.out.println(map.size());  // 1
```

***

### 2. LinkedHashMap

#### 2.1 Characteristics

| Characteristic | Description |
| -------- | ------------------------ |
| **Internal structure** | Hash table + doubly linked list |
| **Ordered** | Retrieval order matches insertion order |
| **Unique keys** | Relies on hashCode() and equals() |

#### 2.2 Basic Usage

```java
Map<String, Integer> map = new LinkedHashMap<>();
map.put("张三", 18);
map.put("李四", 20);
map.put("王五", 22);

// Iteration follows insertion order
map.forEach((k, v) -> System.out.println(k + " = " + v));
// 张三 = 18
// 李四 = 20
// 王五 = 22
```

#### 2.3 Access-Order Mode

```java
// Default: insertion order
Map<String, Integer> map1 = new LinkedHashMap<>();

// Access order: most recently accessed entries come last (useful for an LRU cache)
Map<String, Integer> map2 = new LinkedHashMap<>(16, 0.75f, true);
map2.put("A", 1);
map2.put("B", 2);
map2.put("C", 3);

map2.get("A");  // Access A
System.out.println(map2.keySet());  // [B, C, A] (A moves to the end)
```

***

### 3. TreeMap

#### 3.1 Characteristics

| Characteristic | Description |
| -------------- | --------------------------- |
| **Internal structure** | Red-black tree |
| **Ordered** | Sorted by key |
| **Unique keys** | Relies on compareTo() or a Comparator |
| **Disallows null keys** | Keys cannot be null |

#### 3.2 Basic Usage

```java
// Natural ordering (keys must implement Comparable)
Map<Integer, String> map = new TreeMap<>();
map.put(3, "三");
map.put(1, "一");
map.put(2, "二");

System.out.println(map);  // {1=一, 2=二, 3=三} (sorted by key)
```

#### 3.3 Custom Ordering

```java
// Comparator ordering
Map<String, Integer> map = new TreeMap<>((s1, s2) -> {
    // Sort by string length
    int result = s1.length() - s2.length();
    return result == 0 ? s1.compareTo(s2) : result;
});

map.put("abc", 1);
map.put("ab", 2);
map.put("abcd", 3);
// Result: {ab=2, abc=1, abcd=3}
```

#### 3.4 Navigation Methods

```java
TreeMap<Integer, String> map = new TreeMap<>();
map.put(1, "一");
map.put(3, "三");
map.put(5, "五");
map.put(7, "七");
map.put(9, "九");

// Get the first and last entries
Map.Entry<Integer, String> first = map.firstEntry();  // 1=一
Map.Entry<Integer, String> last = map.lastEntry();    // 9=九

// ceiling / floor / higher / lower
Map.Entry<Integer, String> ceiling = map.ceilingEntry(4);  // 5=五 (smallest key >= 4)
Map.Entry<Integer, String> floor = map.floorEntry(4);      // 3=三 (largest key <= 4)
Map.Entry<Integer, String> higher = map.higherEntry(5);    // 7=七 (smallest key > 5)
Map.Entry<Integer, String> lower = map.lowerEntry(5);      // 3=三 (largest key < 5)

// Range views
SortedMap<Integer, String> head = map.headMap(5);   // {1=一, 3=三}
SortedMap<Integer, String> tail = map.tailMap(5);   // {5=五, 7=七, 9=九}
SortedMap<Integer, String> sub = map.subMap(3, 7);  // {3=三, 5=五}
```

***

### 4. Hashtable (For Reference)

| Characteristic | Description |
| ------------ | ---------------------- |
| **Thread-safe** | All methods are synchronized |
| **Low efficiency** | Synchronization makes it less efficient than HashMap |
| **Disallows null** | Neither keys nor values may be null |
| **Legacy** | Prefer ConcurrentHashMap |

```java
Map<String, Integer> map = new Hashtable<>();
// map.put(null, 100);  // ❌ Throws NullPointerException
// map.put("a", null);  // ❌ Throws NullPointerException
```

***

### 5. ConcurrentHashMap

**Definition**: A thread-safe alternative to `HashMap`, using CAS + `synchronized` bucket-level locking to provide thread safety under high concurrency.

**Key Differences from `Hashtable`**:

| Comparison | Hashtable | ConcurrentHashMap |
| --- | --- | --- |
| Lock granularity | Method level (the entire object) | Bucket level (only the current bucket) |
| Concurrency | Serial (only one thread at a time) | High concurrency (different buckets can be accessed in parallel) |
| null support | Not allowed | Not allowed |
| Recommendation | Legacy | Recommended |

**JDK 1.8 Locking Mechanism**:

1. **Empty bucket**: uses CAS (Compare And Swap) for lock-free insertion, avoiding locking overhead.
2. **Nonempty bucket**: uses `synchronized` to lock the bucket's head node, affecting only that bucket; other buckets can be accessed in parallel.

```
Concurrent put illustration:

Thread A → put("a",1) → maps to bucket[2] → synchronized(bucket[2])
Thread B → put("b",2) → maps to bucket[5] → synchronized(bucket[5])
                                         ↑ Both threads execute simultaneously without interfering
```

```java
import java.util.concurrent.ConcurrentHashMap;

Map<String, Integer> map = new ConcurrentHashMap<>();

// Thread-safe; multiple threads can operate on different buckets simultaneously
map.put("张三", 18);
map.put("李四", 20);

// Atomic operation: insert only when absent
map.putIfAbsent("张三", 25);  // Does not overwrite because "张三" already exists

// Atomic compound operation
map.compute("count", (k, v) -> v == null ? 1 : v + 1);
```

**Notes**:
- Neither keys nor values **may be null** (unlike HashMap), avoiding ambiguity under concurrency: whether null means "key absent" or "the value itself is null."
- For compound operations (a `get` followed by a `put`), use atomic methods such as `putIfAbsent` / `compute`; do not split them into two steps.

***

### 6. Comparing Map Implementations

| Comparison | HashMap | LinkedHashMap | TreeMap | Hashtable | ConcurrentHashMap |
| ---------- | ------- | ------------- | -------- | --------- | ----------------- |
| **Internal structure** | Hash table | Hash table + linked list | Red-black tree | Hash table | Hash table |
| **Ordering** | Unordered | Ordered (insertion order) | Ordered (sorted order) | Unordered | Unordered |
| **null keys** | One allowed | One allowed | Not allowed | Not allowed | Not allowed |
| **null values** | Allowed | Allowed | Allowed | Not allowed | Not allowed |
| **Thread safety** | Not safe | Not safe | Not safe | Safe | Safe |
| **Efficiency** | High | Relatively high | O(log n) | Low | High |

***

## XI. Quick Reference

### Set Methods

| Method | Description |
| -------------- | -------- |
| `add(e)` | Adds an element |
| `remove(o)` | Removes an element |
| `contains(o)` | Tests membership |
| `size()` | Returns the element count |
| `isEmpty()` | Tests whether empty |
| `addAll(c)` | Adds a collection (union) |
| `retainAll(c)` | Keeps the intersection |
| `removeAll(c)` | Removes the intersection (difference) |

### TreeSet Navigation Methods

| Method | Description |
| ------------ | ---------- |
| `first()` | First element |
| `last()` | Last element |
| `ceiling(e)` | Smallest element >= e |
| `floor(e)` | Largest element <= e |
| `higher(e)` | Smallest element > e |
| `lower(e)` | Largest element < e |

### Map Methods

| Method | Description |
| -------------------------- | -------- |
| `put(k, v)` | Adds/updates |
| `get(k)` | Returns a value |
| `remove(k)` | Removes |
| `containsKey(k)` | Tests whether a key exists |
| `keySet()` | Returns all keys |
| `values()` | Returns all values |
| `entrySet()` | Returns all key-value pairs |
| `getOrDefault(k, default)` | Returns a value or the default |
| `putIfAbsent(k, v)` | Adds when absent |
| `computeIfAbsent(k, func)` | Computes and adds when absent |
| `merge(k, v, func)` | Merges values |

### Selection Guide

| Scenario | Recommendation |
| ---------- | ----------------- |
| Deduplication, order irrelevant | HashSet |
| Deduplication, preserve insertion order | LinkedHashSet |
| Deduplication with sorting | TreeSet |
| Key-value pairs, order irrelevant | HashMap |
| Key-value pairs, preserve insertion order | LinkedHashMap |
| Key-value pairs sorted by key | TreeMap |
| Thread-safe key-value pairs | ConcurrentHashMap |
