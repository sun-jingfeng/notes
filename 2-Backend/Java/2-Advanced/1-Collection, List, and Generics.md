## I. Introduction to the Collections Hierarchy

### 1. Why Collections Are Needed

| Problem | Array limitation | Collection solution |
| ---- | ------------ | ------------ |
| Fixed length | Cannot change after creation | Automatic resizing |
| Single element type | Stores only elements of the same type | Can store different types (not recommended) |
| Limited functionality | Only a length property | A rich set of methods |

### 2. Collections Hierarchy

                                          Iterable
                                              │
                              Collection (individual elements)
                                              │
                  ┌───────────────────────────┼─────────────────────────┐
                  │                           │                         │
                List                         Set                      Queue
              (ordered,                (no duplicates)               (queue)
         duplicates allowed)
                  │                           │                         │
        ┌─────────┼─────────┐       ┌─────────┼───────────┐           Deque
        │         │         │       │         │           │   (double-ended queue)
    ArrayList     │      Vector  HashSet   TreeSet  LinkedHashSet       │
             LinkedList                                            ArrayDeque
                                                                   LinkedList
                                                             (also usable as stacks)


                         Map (key-value collections)
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
             HashMap               TreeMap              Hashtable
           (unordered)            (sorted)        (thread-safe, legacy)
                │
          LinkedHashMap
        (insertion order)

### 3. Collection vs Map

| Comparison | Collection | Map |
| ------ | ----------------- | ------------ |
| **Structure** | Single-value collection | Two-value collection (key → value) |
| **Elements** | Individual objects | Key-value pairs (`Map.Entry`) |
| **Duplicates** | List allows duplicates; Set does not | Keys must be unique |
| **Inheritance** | Extends Iterable | Does not extend Iterable |

### 4. Interfaces and Their Implementations

```java
// Collection is an interface and cannot be instantiated directly
Collection<String> c1 = new ArrayList<>();   // ✅ Polymorphism
Collection<String> c2 = new HashSet<>();     // ✅ Polymorphism

// List is an interface
List<String> list = new ArrayList<>();       // ✅ Polymorphism

// Set is an interface
Set<String> set = new HashSet<>();           // ✅ Polymorphism

// Queue and Deque are interfaces
Queue<String> queue = new LinkedList<>();    // ✅
Deque<String> deque = new ArrayDeque<>();    // ✅
```

***

## II. Using Collection

### 1. Common Collection Interface Methods

| Method | Description | Return type |
| -------------------- | ------------------- | --------- |
| `add(E e)` | Adds an element | boolean |
| `remove(Object o)` | Removes the specified element | boolean |
| `clear()` | Clears the collection | void |
| `contains(Object o)` | Tests whether the specified element is present | boolean |
| `isEmpty()` | Tests whether the collection is empty | boolean |
| `size()` | Returns the number of elements | int |
| `toArray()` | Converts to an array | Object\[] |
| `stream()` | Returns a Stream (JDK 8+) | Stream |

### 2. Code Example

```java
import java.util.ArrayList;
import java.util.Collection;

public class CollectionDemo {
    public static void main(String[] args) {
        // Create a Collection object (polymorphism)
        Collection<String> c = new ArrayList<>();

        // ========== Add ==========
        c.add("张三");
        c.add("李四");
        c.add("王五");
        System.out.println(c);  // [张三, 李四, 王五]

        // ========== Remove ==========
        boolean removed = c.remove("李四");
        System.out.println(removed);  // true
        System.out.println(c);        // [张三, 王五]

        // ========== Query ==========
        System.out.println(c.contains("张三"));  // true
        System.out.println(c.isEmpty());         // false
        System.out.println(c.size());            // 2

        // ========== Convert to an array ==========
        Object[] arr1 = c.toArray();
        String[] arr2 = c.toArray(new String[0]);  // Recommended form

        // ========== Obtain a Stream (JDK 8+) ==========
        c.stream()
            .filter(s -> s.startsWith("张"))
            .forEach(System.out::println);

        // ========== Clear ==========
        c.clear();
        System.out.println(c);         // []
        System.out.println(c.isEmpty()); // true
    }
}
```

### 3. Operations Between Collections

| Method | Description |
| --------------------------- | -------------- |
| `addAll(Collection c)` | Adds every element of another collection |
| `removeAll(Collection c)` | Removes the intersection of the two collections |
| `retainAll(Collection c)` | Keeps only the intersection |
| `containsAll(Collection c)` | Tests whether every element of another collection is present |
| `removeIf(Predicate)` | Removes elements matching a condition (JDK 8+) |

```java
Collection<String> c1 = new ArrayList<>();
c1.add("A");
c1.add("B");
c1.add("C");

Collection<String> c2 = new ArrayList<>();
c2.add("B");
c2.add("C");
c2.add("D");

// addAll: add all elements
c1.addAll(c2);
System.out.println(c1);  // [A, B, C, B, C, D]

// removeAll: remove the intersection
c1.removeAll(c2);
System.out.println(c1);  // [A]

// retainAll: keep only the intersection
// c1.retainAll(c2);  // Keep only B and C

// removeIf: remove by condition (JDK 8+)
Collection<Integer> nums = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
nums.removeIf(n -> n % 2 == 0);  // Remove even numbers
System.out.println(nums);  // [1, 3, 5]
```

***

## III. General Ways to Iterate Over Collections

### 1. Comparing Four Iteration Methods

| Method | Applies to | Characteristics | Version |
| ------------------ | ------------- | ----------- | ------- |
| **Iterator** | All Collections | Supports removing elements during iteration | JDK 1.2 |
| **Enhanced for** | All Collections | Concise; also uses an iterator internally | JDK 5 |
| **Lambda forEach** | All Collections | Most concise | JDK 8 |
| **Stream** | All Collections | Powerful; supports filtering and mapping | JDK 8 |

### 2. Iteration with Iterator

```java
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

public class IteratorDemo {
    public static void main(String[] args) {
        Collection<String> c = new ArrayList<>();
        c.add("张三");
        c.add("李四");
        c.add("王五");

        // Obtain an iterator
        Iterator<String> it = c.iterator();

        // Iterate
        while (it.hasNext()) {
            String s = it.next();
            System.out.println(s);
        }
    }
}
```

#### Iterator Methods

| Method | Description | Version |
| ---------------------------- | ------------- | ------- |
| `hasNext()` | Tests whether another element is available | JDK 1.2 |
| `next()` | Returns the next element | JDK 1.2 |
| `remove()` | Removes the current element during iteration | JDK 1.2 |
| `forEachRemaining(Consumer)` | Iterates over the remaining elements | JDK 8 |

```java
// forEachRemaining: iterate over the remaining elements (JDK 8+)
Iterator<String> it = c.iterator();
it.next();  // Skip the first element
it.forEachRemaining(System.out::println);  // Iterate over the remaining elements
```

#### Removing During Iteration (Important)

```java
Collection<String> c = new ArrayList<>();
c.add("张三");
c.add("李四");
c.add("李四");
c.add("王五");

// ❌ Incorrect: removing inside an enhanced for loop causes an error
for (String s : c) {
    if ("李四".equals(s)) {
        c.remove(s);  // ConcurrentModificationException
    }
}

// ✅ Correct approach 1: remove through the iterator
Iterator<String> it = c.iterator();
while (it.hasNext()) {
    String s = it.next();
    if ("李四".equals(s)) {
        it.remove();  // Use the iterator's remove method
    }
}
System.out.println(c);  // [张三, 王五]

// ✅ Correct approach 2: use removeIf (JDK 8+, recommended)
c.removeIf(s -> "李四".equals(s));
```

### 3. Enhanced for Iteration

```java
Collection<String> c = new ArrayList<>();
c.add("张三");
c.add("李四");
c.add("王五");

// Enhanced for (uses an iterator internally)
for (String s : c) {
    System.out.println(s);
}
```

**Note**: Do not structurally modify the collection (add or remove elements) during enhanced for iteration.

### 4. Lambda forEach Iteration (JDK 8+)

```java
Collection<String> c = new ArrayList<>();
c.add("张三");
c.add("李四");
c.add("王五");

// Approach 1: lambda expression
c.forEach(s -> System.out.println(s));

// Approach 2: method reference (more concise)
c.forEach(System.out::println);

// Approach 3: iterate with an index (requires a List)
List<String> list = new ArrayList<>(c);
for (int i = 0; i < list.size(); i++) {
    System.out.println(i + ": " + list.get(i));
}
```

***

## IV. Method References

### 1. What Is a Method Reference?

A **method reference** is shorthand for a lambda expression. When a lambda body only calls an existing method, it can be replaced with a method reference.

```java
// Lambda expression
list.forEach(s -> System.out.println(s));

// Equivalent method reference
list.forEach(System.out::println);
```

### 2. Four Forms of Method References

| Form | Syntax | Equivalent lambda |
| ------------ | --------------------- | ---------------------------- |
| **object::instanceMethod** | `obj::method` | `x -> obj.method(x)` |
| **Class::staticMethod** | `Class::staticMethod` | `x -> Class.staticMethod(x)` |
| **Class::instanceMethod** | `Class::method` | `(obj, x) -> obj.method(x)` |
| **Class::new** | `Class::new` | `() -> new Class()` |

### 3. Code Examples

#### 1. object::instanceMethod

```java
// Lambda
list.forEach(s -> System.out.println(s));

// Method reference
list.forEach(System.out::println);
```

#### 2. Class::staticMethod

```java
// Lambda
list.stream().map(s -> Integer.parseInt(s));

// Method reference
list.stream().map(Integer::parseInt);
```

#### 3. Class::instanceMethod

```java
// Lambda
list.stream().map(s -> s.toUpperCase());

// Method reference
list.stream().map(String::toUpperCase);

// The two-argument case
// Lambda
list.sort((s1, s2) -> s1.compareTo(s2));

// Method reference
list.sort(String::compareTo);
```

#### 4. Constructor References

```java
// Lambda
list.stream().map(s -> new StringBuilder(s));

// Method reference
list.stream().map(StringBuilder::new);

// Array construction
// Lambda
list.stream().toArray(size -> new String[size]);

// Method reference
list.stream().toArray(String[]::new);
```

### 4. Method References in Practice

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Comparator;

public class MethodRefDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("张三");
        list.add("李四");
        list.add("王五");

        // Print
        list.forEach(System.out::println);

        // Convert to uppercase
        list.stream()
            .map(String::toUpperCase)
            .forEach(System.out::println);

        // Convert strings to numbers
        List<String> nums = List.of("1", "2", "3");
        nums.stream()
            .map(Integer::parseInt)
            .forEach(System.out::println);

        // Sort
        list.sort(String::compareTo);
        list.sort(Comparator.comparing(String::length));
    }
}
```

***

## V. The List Interface

### 1. List Characteristics

| Characteristic | Description |
| ------- | ---------- |
| **Ordered** | Elements are stored in insertion order |
| **Duplicates allowed** | Duplicate elements are permitted |
| **Indexed** | Elements can be accessed by index |

### 2. List-Specific Methods (Index Operations)

| Method | Description | Version |
| --------------------------- | ----------------- | ------- |
| `add(int index, E e)` | Inserts an element at the specified position | JDK 1.2 |
| `remove(int index)` | Removes the element at the specified position | JDK 1.2 |
| `set(int index, E e)` | Replaces the element at the specified position | JDK 1.2 |
| `get(int index)` | Returns the element at the specified position | JDK 1.2 |
| `indexOf(Object o)` | Finds the first occurrence of an element | JDK 1.2 |
| `lastIndexOf(Object o)` | Finds the last occurrence of an element | JDK 1.2 |
| `subList(int from, int to)` | Returns a sublist for \[from, to) | JDK 1.2 |
| `sort(Comparator)` | Sorts the list | JDK 8 |
| `replaceAll(UnaryOperator)` | Replaces every element | JDK 8 |

### 3. Code Example

```java
import java.util.ArrayList;
import java.util.List;

public class ListDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("A");
        list.add("B");
        list.add("C");

        // ========== Index operations ==========

        // Insert at the specified position
        list.add(1, "X");
        System.out.println(list);  // [A, X, B, C]

        // Remove at the specified position
        String removed = list.remove(1);
        System.out.println(removed);  // X
        System.out.println(list);     // [A, B, C]

        // Replace at the specified position
        String old = list.set(0, "Z");
        System.out.println(old);   // A
        System.out.println(list);  // [Z, B, C]

        // Get the element at the specified position
        String s = list.get(0);
        System.out.println(s);  // Z

        // Find a position
        list.add("B");  // [Z, B, C, B]
        System.out.println(list.indexOf("B"));      // 1
        System.out.println(list.lastIndexOf("B"));  // 3

        // Obtain a sublist (a view; changes affect the original list)
        List<String> sub = list.subList(1, 3);
        System.out.println(sub);  // [B, C]
    }
}
```

### 4. New Methods in JDK 8+

```java
List<String> list = new ArrayList<>();
list.add("banana");
list.add("apple");
list.add("cherry");

// sort: sort the list (JDK 8+)
list.sort(String::compareTo);  // Natural ordering
System.out.println(list);  // [apple, banana, cherry]

list.sort(Comparator.comparing(String::length));  // Sort by length: [apple, banana, cherry]
list.sort(Comparator.reverseOrder());  // Reverse order: [cherry, banana, apple]

// replaceAll: replace every element (JDK 8+)
list.replaceAll(String::toUpperCase);
System.out.println(list);  // [CHERRY, BANANA, APPLE]

list.replaceAll(s -> s + "!");
System.out.println(list);  // [CHERRY!, BANANA!, APPLE!]
```

### 5. Factory Methods in JDK 9+

```java
// List.of(): create an immutable List (JDK 9+)
List<String> list = List.of("A", "B", "C");
// list.add("D");  // ❌ UnsupportedOperationException

// List.copyOf(): copy into an immutable List (JDK 10+)
List<String> copy = List.copyOf(originalList);

// Arrays.asList(): create a fixed-size List (elements can be replaced, but not added or removed)
List<String> fixed = Arrays.asList("A", "B", "C");
fixed.set(0, "X");  // ✅ Elements can be replaced
// fixed.add("D");  // ❌ Elements cannot be added

// Create a modifiable List
List<String> modifiable = new ArrayList<>(List.of("A", "B", "C"));
modifiable.add("D");  // ✅
```

### 6. Five Ways to Iterate Over a List

```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
list.add("C");

// Approach 1: ordinary for loop (specific to List)
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}

// Approach 2: enhanced for loop
for (String s : list) {
    System.out.println(s);
}

// Approach 3: iterator
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    System.out.println(it.next());
}

// Approach 4: lambda forEach
list.forEach(System.out::println);

// Approach 5: Stream
list.stream().forEach(System.out::println);
```

### 7. ListIterator (An Iterator for Lists)

```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
list.add("C");

// ListIterator supports bidirectional iteration
ListIterator<String> it = list.listIterator();

// Iterate forward
while (it.hasNext()) {
    int index = it.nextIndex();
    String s = it.next();
    System.out.println(index + ": " + s);
}

// Iterate backward
while (it.hasPrevious()) {
    int index = it.previousIndex();
    String s = it.previous();
    System.out.println(index + ": " + s);
}

// Start at a specified position
ListIterator<String> it2 = list.listIterator(1);  // Start at index 1

// Add or replace elements during iteration
ListIterator<String> it3 = list.listIterator();
while (it3.hasNext()) {
    String s = it3.next();
    if ("B".equals(s)) {
        it3.add("X");  // Add X after B
        // it3.set("Y");  // ❌ IllegalStateException: set() cannot follow add() directly
    }
}
System.out.println(list);  // [A, B, X, C]
```

***

## VI. Data Structures (Stacks, Queues, Arrays, Linked Lists)

### 1. Stack

#### Characteristic: Last In, First Out (LIFO)

    Push onto stack    Pop from stack
        ↓                  ↑
    ┌───────┐          ┌───────┐
    │   C   │ ← top    │       │
    ├───────┤          ├───────┤
    │   B   │          │   B   │ ← new top
    ├───────┤          ├───────┤
    │   A   │ ← bottom │   A   │ ← bottom
    └───────┘          └───────┘

#### Use Cases

*   Undo operations (Ctrl+Z)
*   Browser back navigation
*   Method call stacks
*   Expression evaluation
*   Matching parentheses

### 2. Queue

#### Characteristic: First In, First Out (FIFO)

    Enqueue (offer)
        ↓
    ┌───────┬───────┬───────┬───────┐
    │   D   │   C   │   B   │   A   │ → Dequeue (poll)
    └───────┴───────┴───────┴───────┘
      Tail                    Head

#### Double-Ended Queue (Deque)

    addFirst/offerFirst            addLast/offerLast
             ↓                             ↓
        ┌─────────┬─────────┬─────────┬─────────┐
        │    A    │    B    │    C    │    D    │
        └─────────┴─────────┴─────────┴─────────┘
             ↑                             ↑
    removeFirst/pollFirst         removeLast/pollLast

#### Use Cases

*   Task queues
*   Message queues
*   Print queues
*   Breadth-first search

### 3. Array

#### Characteristics

| Characteristic | Description |
| -------- | ------------- |
| **Contiguous memory** | Elements are stored consecutively in memory |
| **Random access** | Direct access by index, O(1) |
| **Slow insertion/removal** | Elements must be shifted, O(n) |
| **Fast lookup** | Direct addressing, O(1) |

#### Memory Layout

    Address: 1000   1004   1008   1012   1016
          ┌──────┬──────┬──────┬──────┬──────┐
          │  10  │  20  │  30  │  40  │  50  │
          └──────┴──────┴──────┴──────┴──────┘
    Index:     0      1      2      3      4

    Access arr[2]: calculate the address directly = 1000 + 2*4 = 1008

### 4. Linked List

#### Characteristics

| Characteristic | Description |
| --------- | ----------- |
| **Noncontiguous memory** | Elements may be stored at separate locations |
| **Fast insertion/removal** | Only pointers need updating, O(1) |
| **Slow lookup** | Requires traversal from the head, O(n) |
| **No direct indexing** | Does not support random access |

#### Singly Linked List Structure

    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ data: 10 │    │ data: 20 │    │ data: 30 │
    │ next: ───┼───→│ next: ───┼───→│ next:null│
    └──────────┘    └──────────┘    └──────────┘
        head                             tail

#### Doubly Linked List Structure

           ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
           │ prev: null   │←───│ prev:        │←───│ prev:        │
           │ data: 10     │    │ data: 20     │    │ data: 30     │
           │ next:     ───┼───→│ next:     ───┼───→│ next: null   │
           └──────────────┘    └──────────────┘    └──────────────┘
               head/first                              tail/last

### 5. Red-Black Trees (Introduction)

    A red-black tree is a self-balancing binary search tree used by TreeSet and TreeMap.

    Characteristics:
    ├─ Left child < parent < right child
    ├─ Search/insertion/removal: O(log n)
    ├─ Automatically balances; does not degenerate into a linked list
    └─ Nodes have one of two colors: red or black

    Example:
                5 (black)
               /         \
          3 (red)       8 (black)
          /     \
    1 (black)  4 (black)

### 6. Comparing Data Structures

| Operation | Array | Linked list | Red-black tree |
| ----------- | ------ | ------ | -------- |
| **Lookup by index** | O(1), fast | O(n), slow | - |
| **Lookup by value** | O(n) | O(n) | O(log n) |
| **Insert at head** | O(n), slow | O(1), fast | O(log n) |
| **Insert at tail** | O(1)\* | O(1) | O(log n) |
| **Insert in middle** | O(n), slow | O(n)\* | O(log n) |
| **Remove** | O(n), slow | O(1)\* | O(log n) |
| **Memory** | Contiguous, fixed | Scattered, flexible | Scattered |

> **Note**: \* Array tail insertion is amortized O(1) (an occasional resize copies the array). For a linked list, inserting or removing is O(1) once the node is reached, but reaching it by index or value takes O(n).

***

## VII. ArrayList and LinkedList

### 1. ArrayList

#### Internal Structure

    ArrayList is backed by an array

    ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐
    │  A   │  B   │  C   │  D   │  E   │ null │ null │ null │ null │ null │
    └──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘
      0      1      2      3      4      5      6      7      8      9
                                 size=5                          capacity=10

#### Constructors and Capacity Management

```java
// Default capacity: 10 (the backing array is allocated lazily on the first add)
ArrayList<String> list1 = new ArrayList<>();

// Specify the initial capacity (avoid frequent resizing)
ArrayList<String> list2 = new ArrayList<>(100);

// Create from another collection
ArrayList<String> list3 = new ArrayList<>(Arrays.asList("A", "B", "C"));

// Growth factor: 1.5
// When the element count exceeds 10, capacity grows to 15
// When the element count exceeds 15, capacity grows to 22
// ...

// Increase capacity manually (avoid repeated resizing)
list1.ensureCapacity(1000);

// Release excess capacity
list1.trimToSize();
```

#### Characteristics Summary

| Characteristic | Description |
| ---- | ------- |
| Internal structure | Array |
| Lookup speed | Fast (O(1)) |
| Insertion/removal speed | Slow (O(n)) |
| Thread safety | Not thread-safe |
| Use case | Frequent lookups, few insertions/removals |

### 2. LinkedList

#### Internal Structure

    LinkedList is backed by a doubly linked list

           ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    null←──│ prev         │←───│ prev         │←───│ prev         │
           │ data: A      │    │ data: B      │    │ data: C      │
           │ next      ───┼───→│ next      ───┼───→│ next         │──→null
           └──────────────┘    └──────────────┘    └──────────────┘
              first                                    last

#### Implemented Interfaces

```java
// LinkedList implements List, Deque and Queue
public class LinkedList<E>
    extends AbstractSequentialList<E>
    implements List<E>, Deque<E>, Cloneable, Serializable
```

#### Head and Tail Methods

| Method | Description |
| --------------- | ------ |
| `addFirst(E e)` | Adds at the head |
| `addLast(E e)` | Adds at the tail |
| `getFirst()` | Returns the head element |
| `getLast()` | Returns the tail element |
| `removeFirst()` | Removes the head element |
| `removeLast()` | Removes the tail element |

#### Queue Methods (Queue/Deque Operations)

| Method | Description | Failure handling |
| ----------------- | -------- | -------- |
| `offer(E e)` | Enqueues (adds at the tail) | Returns false |
| `poll()` | Dequeues (removes the head) | Returns null |
| `peek()` | Examines the head | Returns null |
| `add(E e)` | Enqueues | Throws an exception |
| `remove()` | Dequeues | Throws an exception |
| `element()` | Examines the head | Throws an exception |
| `offerFirst/Last` | Enqueues at either end | Returns false |
| `pollFirst/Last` | Dequeues at either end | Returns null |
| `peekFirst/Last` | Examines either end | Returns null |

#### Stack Methods

| Method | Description |
| ----------- | ------------------ |
| `push(E e)` | Pushes onto the stack (equivalent to addFirst) |
| `pop()` | Pops from the stack (equivalent to removeFirst) |

#### Code Example

```java
import java.util.LinkedList;

public class LinkedListDemo {
    public static void main(String[] args) {
        LinkedList<String> list = new LinkedList<>();

        // ========== List operations ==========
        list.add("B");
        list.addFirst("A");  // Add at the head
        list.addLast("C");   // Add at the tail
        System.out.println(list);  // [A, B, C]

        System.out.println(list.getFirst());  // A
        System.out.println(list.getLast());   // C

        list.removeFirst();
        list.removeLast();
        System.out.println(list);  // [B]

        // ========== Simulate a stack (LIFO) ==========
        LinkedList<String> stack = new LinkedList<>();
        stack.push("A");  // Push
        stack.push("B");
        stack.push("C");
        System.out.println(stack);     // [C, B, A]
        System.out.println(stack.pop()); // C (popped)
        System.out.println(stack.pop()); // B

        // ========== Simulate a queue (FIFO) ==========
        LinkedList<String> queue = new LinkedList<>();
        queue.offer("A");  // Enqueue
        queue.offer("B");
        queue.offer("C");
        System.out.println(queue);     // [A, B, C]
        System.out.println(queue.poll()); // A (dequeued)
        System.out.println(queue.poll()); // B
        System.out.println(queue.peek()); // C (examine the head without removing it)

        // ========== Double-ended queue ==========
        LinkedList<String> deque = new LinkedList<>();
        deque.offerFirst("B");  // Enqueue at the head
        deque.offerFirst("A");
        deque.offerLast("C");   // Enqueue at the tail
        System.out.println(deque);  // [A, B, C]
    }
}
```

#### Characteristics Summary

| Characteristic | Description |
| ---- | ------------ |
| Internal structure | Doubly linked list |
| Lookup speed | Slow (O(n)) |
| Insertion/removal speed | Fast at the ends (O(1)) |
| Thread safety | Not thread-safe |
| Use case | Frequent insertions/removals, few lookups; stacks/queues |

### 3. ArrayList vs LinkedList

| Comparison | ArrayList | LinkedList |
| -------- | --------- | ------------------ |
| **Internal structure** | Array | Doubly linked list |
| **Random access** | O(1), fast | O(n), slow |
| **Insert/remove at head** | O(n), slow | O(1), fast |
| **Insert/remove at tail** | O(1), fast | O(1), fast |
| **Insert/remove in middle** | O(n), slow | O(n)\* |
| **Memory use** | Lower | Higher (stores pointers) |
| **Implemented interfaces** | List | List, Deque, Queue |
| **Use case** | Frequent lookups | Frequent insertions/removals, stacks/queues |

> **Note**: \* Reaching the middle position takes O(n); only the link update itself is O(1).

**Conclusion**: Use **ArrayList** in most situations (lookups are more common, and modern CPUs handle contiguous memory more efficiently).

### 4. Vector and Stack (For Reference)

```java
// Vector: a thread-safe equivalent of ArrayList (legacy)
Vector<String> vector = new Vector<>();
vector.add("A");
// Prefer Collections.synchronizedList() or CopyOnWriteArrayList

// Stack: a stack that extends Vector (legacy)
Stack<String> stack = new Stack<>();
stack.push("A");
stack.pop();
// Prefer a Deque implementation (such as LinkedList or ArrayDeque)
Deque<String> stack2 = new LinkedList<>();
Deque<String> stack3 = new ArrayDeque<>();  // Better performance
```

***

## VIII. Generics

### 1. What Are Generics?

**Generics**, introduced in JDK 5, provide compile-time type checking to avoid type-casting errors.

```java
// Without generics (unsafe)
ArrayList rawList = new ArrayList();
rawList.add("Hello");
rawList.add(123);  // Any type can be added
String s1 = (String) rawList.get(1);  // ❌ Runtime error: ClassCastException

// With generics (safe)
ArrayList<String> list = new ArrayList<>();
list.add("Hello");
// list.add(123);  // ❌ Error detected at compile time
String s2 = list.get(0);  // No explicit cast needed
```

### 2. Benefits of Generics

| Benefit | Description |
| -------- | ----------------------------- |
| **Type safety** | Checks types at compile time to avoid ClassCastException |
| **No explicit casts** | Retrieved elements do not require explicit casting |
| **Code reuse** | One implementation can handle multiple types |

### 3. Generic Classes

```java
// Define a generic class
public class Box<T> {
    private T data;

    public void setData(T data) {
        this.data = data;
    }

    public T getData() {
        return data;
    }
}

// Use the generic class
Box<String> box1 = new Box<>();
box1.setData("Hello");
String s = box1.getData();  // No explicit cast needed

Box<Integer> box2 = new Box<>();
box2.setData(123);
Integer n = box2.getData();

// Multiple type parameters
public class Pair<K, V> {
    private K key;
    private V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() { return key; }
    public V getValue() { return value; }
}

Pair<String, Integer> pair = new Pair<>("age", 18);
```

### 4. Generic Methods

```java
public class Utils {
    // Generic method
    public static <T> void printArray(T[] arr) {
        for (T item : arr) {
            System.out.println(item);
        }
    }

    // Generic method with a return value
    public static <T> T getFirst(List<T> list) {
        return list.isEmpty() ? null : list.get(0);
    }

    // Multiple type parameters
    public static <K, V> Map<K, V> createMap(K key, V value) {
        Map<K, V> map = new HashMap<>();
        map.put(key, value);
        return map;
    }
}

// Usage
String[] strs = {"A", "B", "C"};
Integer[] nums = {1, 2, 3};

Utils.printArray(strs);  // Inferred as String
Utils.printArray(nums);  // Inferred as Integer

String first = Utils.getFirst(List.of("A", "B"));
```

### 5. Generic Interfaces

```java
// Define a generic interface
public interface Container<T> {
    void add(T item);
    T get(int index);
}

// Implement a generic interface with a concrete type
public class StringContainer implements Container<String> {
    private List<String> list = new ArrayList<>();

    @Override
    public void add(String item) {
        list.add(item);
    }

    @Override
    public String get(int index) {
        return list.get(index);
    }
}

// Implement a generic interface while retaining the type parameter
public class GenericContainer<T> implements Container<T> {
    private List<T> list = new ArrayList<>();

    @Override
    public void add(T item) {
        list.add(item);
    }

    @Override
    public T get(int index) {
        return list.get(index);
    }
}
```

### 6. Generic Wildcards

#### 1. Unbounded Wildcard `<?>`

```java
// Accepts collections with any element type
public void printList(List<?> list) {
    for (Object item : list) {
        System.out.println(item);
    }
}

List<String> strings = new ArrayList<>();
List<Integer> numbers = new ArrayList<>();

printList(strings);  // ✅
printList(numbers);  // ✅
```

#### 2. Upper-Bounded Wildcard `<? extends T>`

```java
// Accepts only collections of Number or its subclasses
public void printNumbers(List<? extends Number> list) {
    for (Number num : list) {
        System.out.println(num);
    }
}

List<Integer> integers = new ArrayList<>();
List<Double> doubles = new ArrayList<>();
List<String> strings = new ArrayList<>();

printNumbers(integers);  // ✅ Integer is a subclass of Number
printNumbers(doubles);   // ✅ Double is a subclass of Number
// printNumbers(strings);   // ❌ String is not a subclass of Number

// Note: <? extends T> allows reading, but not writing
List<? extends Number> nums = integers;
Number n = nums.get(0);  // ✅ Can read
// nums.add(1);  // ❌ Cannot write (compile-time error)
```

#### 3. Lower-Bounded Wildcard `<? super T>`

```java
// Accepts only collections of Integer or its supertypes
public void addNumbers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
}

List<Integer> integers = new ArrayList<>();
List<Number> numbers = new ArrayList<>();
List<Object> objects = new ArrayList<>();

addNumbers(integers);  // ✅
addNumbers(numbers);   // ✅ Number is a superclass of Integer
addNumbers(objects);   // ✅ Object is a superclass of Integer

// Note: <? super T> allows writing T, but reads yield Object
List<? super Integer> list = numbers;
list.add(1);  // ✅ Can write Integer
Object obj = list.get(0);  // ✅ Can only read as Object
// Integer n = list.get(0);  // ❌ Cannot read as Integer
```

### 7. Generic Wildcard Summary

| Wildcard | Meaning | Read/write | Use case |
| --------------- | ------ | ------------- | --------- |
| `<?>` | Any type | Read-only (as Object) | Only reading is required |
| `<? extends T>` | T and its subtypes | Read-only (as T) | Producer (provides data) |
| `<? super T>` | T and its supertypes | Can write T | Consumer (receives data) |

**Mnemonic**: PECS (Producer Extends, Consumer Super)

*   **Use extends for producers**: only read data
*   **Use super for consumers**: only write data

```java
// Example: copy a collection
public static <T> void copy(List<? super T> dest, List<? extends T> src) {
    for (T item : src) {  // src is the producer; read data from it
        dest.add(item);   // dest is the consumer; write data to it
    }
}
```

### 8. Type Erasure

```java
// Generics are checked at compile time and erased at runtime

// Before compilation
List<String> strings = new ArrayList<>();
List<Integer> numbers = new ArrayList<>();

// After compilation (type erasure), both behave like raw types:
// List strings = new ArrayList();
// List numbers = new ArrayList();

// Consequently, generic type arguments cannot be distinguished at runtime
System.out.println(strings.getClass() == numbers.getClass());  // true

// Generic arrays cannot be created either
// T[] arr = new T[10];  // ❌ Compile-time error
```

### 9. Limitations of Generics

```java
// 1. Primitive types cannot be used
// List<int> list1;  // ❌
List<Integer> list2;  // ✅

// 2. Generic arrays cannot be created
// T[] arr = new T[10];  // ❌

// 3. Type parameters cannot be instantiated
// T obj = new T();  // ❌

// 4. Type parameters cannot be used in a static context
public class Box<T> {
    // private static T shared;  // ❌
    private T data;  // ✅
}

// 5. instanceof cannot test a parameterized type (the type argument is erased)
Object obj = new ArrayList<String>();
// if (obj instanceof List<String>) { }  // ❌ Compile error
if (obj instanceof List<?>) { }  // ✅

// 6. Generic classes cannot extend Throwable, so generic exceptions cannot be thrown or caught
// class MyException<T> extends Exception { }  // ❌ Compile error
```

***

## IX. Quick Reference

### 1. Collection Methods

| Method | Description |
| --------------------- | ----------- |
| `add(e)` | Adds an element |
| `remove(o)` | Removes an element |
| `contains(o)` | Tests membership |
| `size()` | Returns the element count |
| `isEmpty()` | Tests whether empty |
| `clear()` | Clears the collection |
| `toArray()` | Converts to an array |
| `stream()` | Returns a Stream |
| `removeIf(Predicate)` | Removes by condition |

### 2. List-Specific Methods

| Method | Description |
| --------------------------- | ------------ |
| `add(index, e)` | Adds at a specified position |
| `remove(index)` | Removes at a specified position |
| `set(index, e)` | Replaces an element |
| `get(index)` | Returns an element |
| `indexOf(o)` | Finds a position |
| `subList(from, to)` | Returns a sublist |
| `sort(Comparator)` | Sorts (JDK 8+) |
| `replaceAll(UnaryOperator)` | Replaces every element (JDK 8+) |

### 3. LinkedList-Specific Methods

| Method | Description |
| ------------------------ | ----- |
| `addFirst/addLast` | Adds at the head/tail |
| `getFirst/getLast` | Returns the head/tail |
| `removeFirst/removeLast` | Removes the head/tail |
| `push/pop` | Stack operations |
| `offer/poll/peek` | Queue operations |

### 4. Generic Wildcards

| Wildcard | Meaning | Read/write |
| --------------- | ------ | -- |
| `<?>` | Any type | Read-only |
| `<? extends T>` | T and its subtypes | Read-only |
| `<? super T>` | T and its supertypes | Writable |

### 5. Choosing a Data Structure

| Scenario | Recommendation |
| ------- | ----------------------- |
| Frequent lookups, few insertions/removals | ArrayList |
| Frequent insertions/removals, few lookups | LinkedList |
| Frequent operations at the head | LinkedList |
| A stack is needed | LinkedList / ArrayDeque |
| A queue is needed | LinkedList / ArrayDeque |
| Thread safety | CopyOnWriteArrayList (read-heavy) / `Collections.synchronizedList` |
