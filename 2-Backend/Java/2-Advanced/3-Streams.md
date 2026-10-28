## I. Introduction to Streams

### 1. What Is a Stream?

**Streams**, introduced in JDK 8, **simplify operations on collections and arrays**, making code more concise and readable.

### 2. Traditional Approach vs Streams

```java
// Requirement: select names that start with "J" and have length 4

List<String> list = Arrays.asList("John", "Amy", "Jack", "Emma", "Jane", "Tom");

// ========== Traditional approach: verbose code ==========
List<String> result1 = new ArrayList<>();
for (String name : list) {
    if (name.startsWith("J") && name.length() == 4) {
        result1.add(name);
    }
}
System.out.println(result1);  // [John, Jack, Jane]

// ========== Stream approach: concise code ==========
List<String> result2 = list.stream()
    .filter(name -> name.startsWith("J"))
    .filter(name -> name.length() == 4)
    .collect(Collectors.toList());
System.out.println(result2);  // [John, Jack, Jane]
```

### 3. Stream Characteristics

| Characteristic | Description |
| ---------- | ----------------------- |
| **Declarative programming** | Specifies what to do rather than how to do it |
| **Method chaining** | Multiple operations can be chained |
| **Lazy execution** | Intermediate operations do not execute immediately; only a terminal operation triggers execution |
| **Single use** | Cannot be reused after a terminal operation; this does not automatically call close() |
| **Original data unchanged** | Stream operations do not modify the original collection |

> Streams backed by I/O resources, such as `Files.lines()`, still require explicit closing, normally with try-with-resources. Streams created from collections or arrays generally do not need closing.

### 4. The Stream Processing Model

    Data source (collection/array/file)
        ↓
    Obtain a Stream
        ↓
    Intermediate operations (filter, map, sort...) ← zero or more; lazy execution
        ↓
    Terminal operation (collect, iterate, aggregate...) ← only one; triggers execution
        ↓
    Result

***

## II. Obtaining a Stream

### 1. From a Collection

```java
// Obtain a stream from a List
List<String> list = Arrays.asList("A", "B", "C");
Stream<String> stream1 = list.stream();

// Obtain a stream from a Set
Set<String> set = new HashSet<>(Arrays.asList("A", "B", "C"));
Stream<String> stream2 = set.stream();
```

### 2. From a Map

```java
Map<String, Integer> map = new HashMap<>();
map.put("Alice", 18);
map.put("Bob", 20);
map.put("Carol", 22);

// Stream the keys
Stream<String> keyStream = map.keySet().stream();

// Stream the values
Stream<Integer> valueStream = map.values().stream();

// Stream the key-value entries
Stream<Map.Entry<String, Integer>> entryStream = map.entrySet().stream();
```

### 3. From an Array

```java
// Approach 1: Arrays.stream()
String[] arr = {"A", "B", "C"};
Stream<String> stream1 = Arrays.stream(arr);

// Approach 2: Stream.of()
Stream<String> stream2 = Stream.of("A", "B", "C");
Stream<String> stream3 = Stream.of(arr);

// Primitive arrays
int[] nums = {1, 2, 3};
IntStream intStream = Arrays.stream(nums);
```

### 4. From a File (JDK 8+)

```java
import java.nio.file.Files;
import java.nio.file.Paths;

// Read each line of the file
try (Stream<String> lines = Files.lines(Paths.get("data.txt"))) {
    lines.forEach(System.out::println);
} catch (IOException e) {
    e.printStackTrace();
}

// Specify the encoding
try (Stream<String> lines = Files.lines(Paths.get("data.txt"), StandardCharsets.UTF_8)) {
    long count = lines.filter(line -> line.contains("Java")).count();
} catch (IOException e) {
    e.printStackTrace();
}
```

### 5. Creating Numeric Range Streams

```java
// IntStream.range(): [start, end)
IntStream.range(1, 5).forEach(System.out::println);  // 1, 2, 3, 4

// IntStream.rangeClosed(): [start, end]
IntStream.rangeClosed(1, 5).forEach(System.out::println);  // 1, 2, 3, 4, 5

// The same applies to LongStream
LongStream.rangeClosed(1, 100).sum();  // 5050
```

### 6. Other Approaches

```java
// Create infinite streams
Stream<Integer> stream1 = Stream.iterate(0, n -> n + 2);  // 0, 2, 4, 6, ...
Stream<Double> stream2 = Stream.generate(Math::random);   // Random numbers

// JDK 9+: iterate with a termination condition
Stream<Integer> stream3 = Stream.iterate(0, n -> n < 100, n -> n + 10);
// 0, 10, 20, 30, ..., 90

// Empty stream
Stream<String> emptyStream = Stream.empty();

// Take 3 elements from each, then concatenate sequentially; Number is a common superclass of Integer and Double
Stream<Number> combined = Stream.concat(stream1.limit(3), stream2.limit(3));

// A stream containing one element
Stream<String> single = Stream.of("Hello");

// JDK 9+: an element that may be null
Stream<String> nullable = Stream.ofNullable(getNullableValue());
// Returns an empty stream if the value is null

// Construct with a Builder
Stream<String> built = Stream.<String>builder()
    .add("A")
    .add("B")
    .add("C")
    .build();
```

### 7. Summary of Stream Sources

| Data source | How to obtain a stream |
| -------------- | ----------------------------------------------------------------------------- |
| **Collection** | `collection.stream()`                                                         |
| **Map**        | `map.keySet().stream()` / `map.values().stream()` / `map.entrySet().stream()` |
| **Array** | `Arrays.stream(arr)` / `Stream.of(arr)` |
| **Multiple elements** | `Stream.of(e1, e2, e3)` |
| **File** | `Files.lines(path)` |
| **Numeric range** | `IntStream.range(1, 10)` / `IntStream.rangeClosed(1, 10)` |
| **Infinite stream** | `Stream.iterate()` / `Stream.generate()` |

***

## III. Primitive Streams

### 1. Three Primitive Stream Types

To avoid boxing and unboxing overhead, Java provides three primitive Stream types:

| Type | Description | Creation |
| -------------- | -------- | -------------------------------- |
| `IntStream` | int stream | `IntStream.of(1, 2, 3)` |
| `LongStream` | long stream | `LongStream.of(1L, 2L, 3L)` |
| `DoubleStream` | double stream | `DoubleStream.of(1.0, 2.0, 3.0)` |

### 2. Common IntStream Methods

```java
// Create
IntStream stream1 = IntStream.of(1, 2, 3, 4, 5);
IntStream stream2 = IntStream.range(1, 6);       // 1, 2, 3, 4, 5
IntStream stream3 = IntStream.rangeClosed(1, 5); // 1, 2, 3, 4, 5

// Aggregate operations
int sum = IntStream.rangeClosed(1, 100).sum();           // 5050
OptionalInt max = IntStream.of(3, 1, 4, 1, 5).max();     // 5
OptionalInt min = IntStream.of(3, 1, 4, 1, 5).min();     // 1
OptionalDouble avg = IntStream.of(1, 2, 3, 4, 5).average();  // 3.0

// Summary statistics
IntSummaryStatistics stats = IntStream.of(1, 2, 3, 4, 5).summaryStatistics();
System.out.println(stats.getSum());      // 15
System.out.println(stats.getAverage());  // 3.0
System.out.println(stats.getMax());      // 5
System.out.println(stats.getMin());      // 1
System.out.println(stats.getCount());    // 5
```

### 3. Converting Between Object and Primitive Streams

```java
List<String> list = Arrays.asList("apple", "banana", "cherry");

// Stream<T> → IntStream (using mapToInt)
IntStream lengths = list.stream().mapToInt(String::length);

// IntStream → Stream<Integer> (using boxed)
Stream<Integer> boxed = IntStream.of(1, 2, 3).boxed();

// IntStream → List<Integer>
List<Integer> intList = IntStream.of(1, 2, 3)
    .boxed()
    .collect(Collectors.toList());

// Or (JDK 16+)
List<Integer> intList2 = IntStream.of(1, 2, 3)
    .boxed()
    .toList();
```

***

## IV. Common Stream Methods

### 1. Method Categories

| Category | Description | Characteristics |
| -------- | ------------------ | ---------- |
| **Intermediate operation** | Returns a new Stream; can be chained | Lazy execution; multiple allowed |
| **Terminal operation** | Triggers execution; may or may not return a result | Executes immediately; only one allowed |

### 2. Intermediate Operations

| Method | Description | Version |
| ---------------------- | --------- | ----- |
| `filter(Predicate)` | Filters | JDK 8 |
| `map(Function)` | Transforms/maps | JDK 8 |
| `mapToInt/Long/Double` | Converts to a primitive stream | JDK 8 |
| `flatMap(Function)` | Flattens mapped streams | JDK 8 |
| `distinct()` | Removes duplicates | JDK 8 |
| `sorted()` | Sorts in natural order | JDK 8 |
| `sorted(Comparator)` | Sorts in custom order | JDK 8 |
| `limit(long n)` | Takes the first n elements | JDK 8 |
| `skip(long n)` | Skips the first n elements | JDK 8 |
| `peek(Consumer)` | Inspects elements (for debugging) | JDK 8 |
| `takeWhile(Predicate)` | Takes while the condition holds | JDK 9 |
| `dropWhile(Predicate)` | Skips while the condition holds | JDK 9 |
| `mapMulti(BiConsumer)` | Replaces each element with zero or more elements | JDK 16 |
| `gather(Gatherer)` | Custom intermediate operation (windows, running totals, etc.) | JDK 24 |

### 3. Terminal Operations

| Method | Description | Version |
| -------------------------- | ----------- | ------ |
| `forEach(Consumer)` | Iterates | JDK 8 |
| `forEachOrdered(Consumer)` | Iterates in order | JDK 8 |
| `count()` | Counts elements | JDK 8 |
| `collect(Collector)` | Collects into a collection | JDK 8 |
| `toList()` | Collects into an immutable List | JDK 16 |
| `toArray()` | Collects into an array | JDK 8 |
| `reduce(BinaryOperator)` | Reduces | JDK 8 |
| `min(Comparator)` | Minimum | JDK 8 |
| `max(Comparator)` | Maximum | JDK 8 |
| `findFirst()` | Gets the first element | JDK 8 |
| `findAny()` | Gets any element | JDK 8 |
| `anyMatch(Predicate)` | Tests whether any element matches | JDK 8 |
| `allMatch(Predicate)` | Tests whether all elements match | JDK 8 |
| `noneMatch(Predicate)` | Tests whether no elements match | JDK 8 |

***

## V. Intermediate Operations in Detail

### 1. filter: Filtering

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// Filter for even numbers
list.stream()
    .filter(n -> n % 2 == 0)
    .forEach(System.out::println);  // 2, 4, 6, 8, 10

// Filter by multiple conditions
list.stream()
    .filter(n -> n % 2 == 0)
    .filter(n -> n > 5)
    .forEach(System.out::println);  // 6, 8, 10
```

### 2. map: Transformation/Mapping

```java
List<String> list = Arrays.asList("apple", "banana", "cherry");

// Convert to uppercase
list.stream()
    .map(String::toUpperCase)
    .forEach(System.out::println);  // APPLE, BANANA, CHERRY

// Get lengths
list.stream()
    .map(String::length)
    .forEach(System.out::println);  // 5, 6, 6

// Map object properties
List<User> users = getUsers();
List<String> names = users.stream()
    .map(User::getName)
    .collect(Collectors.toList());
```

### 3. mapToInt / mapToLong / mapToDouble: Convert to Primitive Streams

```java
List<String> list = Arrays.asList("apple", "banana", "cherry");

// mapToInt: convert to IntStream
int totalLength = list.stream()
    .mapToInt(String::length)
    .sum();  // 17

// IntStream aggregate methods are available
OptionalDouble avg = list.stream()
    .mapToInt(String::length)
    .average();

// Sum values from a list of objects
List<Employee> employees = getEmployees();
double totalSalary = employees.stream()
    .mapToDouble(Employee::getSalary)
    .sum();
```

### 4. flatMap: Flattening

```java
// Scenario: combine multiple collections into one stream
List<List<Integer>> nestedList = Arrays.asList(
    Arrays.asList(1, 2, 3),
    Arrays.asList(4, 5, 6),
    Arrays.asList(7, 8, 9)
);

// flatMap: flatten nested collections
nestedList.stream()
    .flatMap(List::stream)
    .forEach(System.out::println);  // 1, 2, 3, 4, 5, 6, 7, 8, 9

// Scenario: split strings into characters
List<String> words = Arrays.asList("Hello", "World");
words.stream()
    .flatMap(word -> Arrays.stream(word.split("")))
    .forEach(System.out::print);  // HelloWorld

// Scenario: a one-to-many relationship (each department has a list of employees)
List<Department> departments = getDepartments();
List<Employee> allEmployees = departments.stream()
    .flatMap(dept -> dept.getEmployees().stream())
    .collect(Collectors.toList());
```

### 5. distinct: Removing Duplicates

```java
List<Integer> list = Arrays.asList(1, 2, 2, 3, 3, 3, 4);

list.stream()
    .distinct()
    .forEach(System.out::println);  // 1, 2, 3, 4

// Note: deduplicating objects requires overriding equals() and hashCode()
List<User> users = getUsers();
List<User> distinctUsers = users.stream()
    .distinct()
    .collect(Collectors.toList());
```

### 6. sorted: Sorting

```java
List<Integer> list = Arrays.asList(5, 2, 8, 1, 9, 3);

// Natural ordering (ascending)
list.stream()
    .sorted()
    .forEach(System.out::println);  // 1, 2, 3, 5, 8, 9

// Custom ordering (descending)
list.stream()
    .sorted((a, b) -> Integer.compare(b, a))
    .forEach(System.out::println);  // 9, 8, 5, 3, 2, 1

// Use Comparator
list.stream()
    .sorted(Comparator.reverseOrder())
    .forEach(System.out::println);  // 9, 8, 5, 3, 2, 1

// Sort objects
List<String> names = Arrays.asList("Jack", "John", "Amy", "Tom");
names.stream()
    .sorted(Comparator.comparingInt(String::length))
    .forEach(System.out::println);  // Amy, Tom, Jack, John

// Sort by multiple fields
List<User> users = getUsers();
users.stream()
    .sorted(Comparator.comparing(User::getAge)
            .thenComparing(User::getName))
    .forEach(System.out::println);
```

### 7. limit and skip: Slicing

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// limit: take the first 5 elements
list.stream()
    .limit(5)
    .forEach(System.out::println);  // 1, 2, 3, 4, 5

// skip: skip the first 5 elements
list.stream()
    .skip(5)
    .forEach(System.out::println);  // 6, 7, 8, 9, 10

// Combine: take elements 3–7 (skip 2, then take 5)
list.stream()
    .skip(2)
    .limit(5)
    .forEach(System.out::println);  // 3, 4, 5, 6, 7

// Pagination: page 2, 3 items per page
int page = 2, pageSize = 3;
list.stream()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .forEach(System.out::println);  // 4, 5, 6
```

### 8. takeWhile and dropWhile (JDK 9+)

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// takeWhile: take from the start until the condition fails
list.stream()
    .takeWhile(n -> n < 5)
    .forEach(System.out::println);  // 1, 2, 3, 4

// dropWhile: skip from the start until the condition fails
list.stream()
    .dropWhile(n -> n < 5)
    .forEach(System.out::println);  // 5, 6, 7, 8, 9, 10

// Note the difference from filter
// filter checks every element
// takeWhile/dropWhile stop taking/skipping at the first element that fails the condition
List<Integer> list2 = Arrays.asList(1, 2, 5, 3, 4);  // Pay attention to order
list2.stream().takeWhile(n -> n < 5).forEach(System.out::print);  // 1, 2
list2.stream().filter(n -> n < 5).forEach(System.out::print);     // 1, 2, 3, 4
```

### 9. peek: Inspecting Elements (For Debugging)

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

List<Integer> result = list.stream()
    .peek(n -> System.out.println("Original value: " + n))
    .map(n -> n * 2)
    .peek(n -> System.out.println("After multiplying by 2: " + n))
    .filter(n -> n > 5)
    .peek(n -> System.out.println("After filtering: " + n))
    .collect(Collectors.toList());

// Note: peek is primarily for debugging; do not use it to modify element state
```

### 10. gather: Custom Intermediate Operations (JDK 24+)

**`gather()`** applies a **gatherer**, an intermediate operation that can keep state, emit any number of elements per input, or stop early. The `Gatherers` class provides ready-made gatherers for operations that are awkward with `map` and `filter`:

```java
// Fixed-size windows: [[1, 2], [3, 4], [5]]
List<List<Integer>> fixed = Stream.of(1, 2, 3, 4, 5)
    .gather(Gatherers.windowFixed(2))
    .toList();

// Sliding windows: [[1, 2], [2, 3], [3, 4]]
List<List<Integer>> sliding = Stream.of(1, 2, 3, 4)
    .gather(Gatherers.windowSliding(2))
    .toList();

// Running total (scan emits every intermediate result): [1, 3, 6, 10]
List<Integer> running = Stream.of(1, 2, 3, 4)
    .gather(Gatherers.scan(() -> 0, Integer::sum))
    .toList();

// Concurrent mapping on virtual threads, at most 2 at a time, preserving order: [A, B, C]
List<String> upper = Stream.of("a", "b", "c")
    .gather(Gatherers.mapConcurrent(2, String::toUpperCase))
    .toList();
```

| Gatherer | Description |
| ------------------------------------ | ------------------------------------------------------------ |
| `Gatherers.windowFixed(n)` | Groups elements into lists of `n` (the last may be shorter) |
| `Gatherers.windowSliding(n)` | Overlapping windows of `n` elements |
| `Gatherers.scan(init, fn)` | Emits each running accumulation |
| `Gatherers.fold(init, fn)` | Emits only the final accumulation (one element) |
| `Gatherers.mapConcurrent(max, fn)` | Applies `fn` on virtual threads with at most `max` running at once |

***

## VI. Terminal Operations in Detail

### 1. forEach and forEachOrdered: Iteration

```java
List<String> list = Arrays.asList("A", "B", "C");

// Iterate and print
list.stream().forEach(System.out::println);

// Shorthand (Collection's own forEach)
list.forEach(System.out::println);

// forEachOrdered: guarantees order (useful with parallel streams)
list.parallelStream()
    .forEach(System.out::println);        // Order is unspecified
list.parallelStream()
    .forEachOrdered(System.out::println); // Defined order: A, B, C
```

### 2. count: Counting Elements

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

long count = list.stream()
    .filter(n -> n > 3)
    .count();

System.out.println(count);  // 2
```

### 3. collect: Collecting into Collections

```java
List<String> list = Arrays.asList("John", "Amy", "Jack", "Emma");

// Collect into a List
List<String> result1 = list.stream()
    .filter(name -> name.startsWith("J"))
    .collect(Collectors.toList());

// Collect into a Set
Set<String> result2 = list.stream()
    .filter(name -> name.startsWith("J"))
    .collect(Collectors.toSet());

// Collect into a specific collection type
LinkedList<String> result3 = list.stream()
    .collect(Collectors.toCollection(LinkedList::new));

TreeSet<String> result4 = list.stream()
    .collect(Collectors.toCollection(TreeSet::new));

// Collect into a Map
Map<String, Integer> result5 = list.stream()
    .collect(Collectors.toMap(
        name -> name,           // key
        name -> name.length()   // value
    ));
// {John=4, Amy=3, Jack=4, Emma=4} (HashMap order)

// Collect into a Map (handle duplicate keys)
Map<Integer, String> result6 = list.stream()
    .collect(Collectors.toMap(
        String::length,    // key
        name -> name,      // value
        (v1, v2) -> v1     // Keep the first value for duplicate keys
    ));
// {3=Amy, 4=John}
```

### 4. toList() (JDK 16+)

```java
List<String> list = Arrays.asList("A", "B", "C");

// JDK 16+: use toList() directly
List<String> result = list.stream()
    .filter(s -> s.length() > 0)
    .toList();  // Returns an immutable List

// Similar to the following (but toUnmodifiableList() rejects null elements; toList() allows them)
List<String> result2 = list.stream()
    .filter(s -> s.length() > 0)
    .collect(Collectors.toUnmodifiableList());

// Note: toList() returns an immutable List
// result.add("D");  // ❌ Throws UnsupportedOperationException
```

### 5. toArray: Collecting into Arrays

```java
List<String> list = Arrays.asList("A", "B", "C");

// Convert to an Object array
Object[] arr1 = list.stream().toArray();

// Convert to a String array
String[] arr2 = list.stream().toArray(String[]::new);

// Convert to an int array
int[] arr3 = list.stream()
    .mapToInt(String::length)
    .toArray();
```

### 6. reduce: Reduction

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

// Sum with an initial value
int sum = list.stream()
    .reduce(0, (a, b) -> a + b);
System.out.println(sum);  // 15

// Sum with a method reference
int sum2 = list.stream()
    .reduce(0, Integer::sum);

// Sum without an initial value (returns Optional)
Optional<Integer> sum3 = list.stream()
    .reduce(Integer::sum);

// Find the maximum
Optional<Integer> max = list.stream()
    .reduce(Integer::max);
System.out.println(max.orElse(0));  // 5

// Concatenate strings
List<String> words = Arrays.asList("Hello", " ", "World");
String result = words.stream()
    .reduce("", (a, b) -> a + b);
System.out.println(result);  // Hello World

// Sum BigDecimal amounts
List<BigDecimal> prices = List.of(new BigDecimal("19.99"), new BigDecimal("5.01"));
BigDecimal total = prices.stream()
    .reduce(BigDecimal.ZERO, BigDecimal::add);  // 25.00
```

### 7. min / max: Minimum and Maximum

```java
List<Integer> list = Arrays.asList(5, 2, 8, 1, 9);

// Minimum
Optional<Integer> min = list.stream().min(Integer::compare);
System.out.println(min.orElse(0));  // 1

// Maximum
Optional<Integer> max = list.stream().max(Integer::compare);
System.out.println(max.orElse(0));  // 9

// Use Comparator
Optional<Integer> min2 = list.stream().min(Comparator.naturalOrder());
Optional<Integer> max2 = list.stream().max(Comparator.naturalOrder());

// Minimum/maximum objects
List<String> names = Arrays.asList("Jack", "John", "Amy");
Optional<String> longest = names.stream()
    .max(Comparator.comparingInt(String::length));
System.out.println(longest.orElse(""));  // Jack (the first of the longest names)
```

### 8. findFirst / findAny: Finding Elements

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

// Get the first element
Optional<Integer> first = list.stream()
    .filter(n -> n > 3)
    .findFirst();
System.out.println(first.orElse(0));  // 4

// Get any element (more useful and efficient with parallel streams)
Optional<Integer> any = list.parallelStream()
    .filter(n -> n > 3)
    .findAny();
System.out.println(any.orElse(0));  // 4 or 5 (unspecified)
```

### 9. Matching Methods

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

// anyMatch: whether at least one element matches
boolean hasEven = list.stream().anyMatch(n -> n % 2 == 0);
System.out.println(hasEven);  // true

// allMatch: whether every element matches
boolean allPositive = list.stream().allMatch(n -> n > 0);
System.out.println(allPositive);  // true

// noneMatch: whether no elements match
boolean noNegative = list.stream().noneMatch(n -> n < 0);
System.out.println(noNegative);  // true

// Short-circuiting: stops as soon as the result is known
list.stream()
    .peek(n -> System.out.println("Check: " + n))
    .anyMatch(n -> n == 3);
// Only prints: Check: 1, Check: 2, Check: 3 (stops after finding a match)
```

***

## VII. Handling Optional Results

### 1. Common Optional Methods

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

Optional<Integer> result = list.stream()
    .filter(n -> n > 10)
    .findFirst();

// Check whether a value is present
if (result.isPresent()) {
    System.out.println(result.get());
}

// Execute when a value is present
result.ifPresent(System.out::println);

// JDK 9+: separate actions for present and absent values
result.ifPresentOrElse(
    value -> System.out.println("Found: " + value),
    () -> System.out.println("Not found")
);

// Get the value or a default
Integer value1 = result.orElse(0);
Integer value2 = result.orElseGet(() -> calculateDefault());
Integer value3 = result.orElseThrow();  // JDK 10+: throws NoSuchElementException when no value is present
Integer value4 = result.orElseThrow(() -> new RuntimeException("Not found"));

// Transform
Optional<String> mapped = result.map(n -> "Value: " + n);

// Filter
Optional<Integer> filtered = result.filter(n -> n > 5);

// JDK 9+: return another Optional when absent
Optional<Integer> alternative = result.or(() -> Optional.of(-1));

// JDK 9+: convert to a Stream
Stream<Integer> stream = result.stream();
```

### 2. Avoiding Incorrect Optional Usage

```java
// ❌ Incorrect: call get() directly
Optional<Integer> opt = list.stream().findFirst();
Integer value = opt.get();  // May throw NoSuchElementException

// ✅ Correct: check first or use orElse
Integer value1 = opt.orElse(0);
Integer value2 = opt.orElseThrow(() -> new RuntimeException("Not found"));

// ❌ Incorrect: use Optional as a field type
class User {
    Optional<String> name;  // Not recommended
}

// ✅ Correct: Optional is primarily intended for method return values
class User {
    String name;
    public Optional<String> getName() {
        return Optional.ofNullable(name);
    }
}
```

***

## VIII. Collectors

### 1. Common Collection Methods

```java
List<String> list = Arrays.asList("John", "Amy", "Jack", "Emma", "Jane");

// toList: collect into a List
List<String> result1 = list.stream()
    .filter(name -> name.startsWith("J"))
    .collect(Collectors.toList());

// toSet: collect into a Set
Set<String> result2 = list.stream()
    .filter(name -> name.startsWith("J"))
    .collect(Collectors.toSet());

// toCollection: collect into a specified collection type
TreeSet<String> result3 = list.stream()
    .collect(Collectors.toCollection(TreeSet::new));

// joining: concatenate strings
String result4 = list.stream()
    .collect(Collectors.joining(", "));
// John, Amy, Jack, Emma, Jane

// joining: with a prefix and suffix
String result5 = list.stream()
    .collect(Collectors.joining(", ", "[", "]"));
// [John, Amy, Jack, Emma, Jane]
```

### 2. Statistical Methods

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

// counting: count
long count = list.stream().collect(Collectors.counting());

// summingInt: sum
int sum = list.stream().collect(Collectors.summingInt(n -> n));

// averagingInt: average
double avg = list.stream().collect(Collectors.averagingInt(n -> n));

// maxBy / minBy: maximum/minimum
Optional<Integer> max = list.stream()
    .collect(Collectors.maxBy(Integer::compare));

// summarizingInt: statistics (count, sum, minimum, maximum, average)
IntSummaryStatistics stats = list.stream()
    .collect(Collectors.summarizingInt(n -> n));
System.out.println(stats);
// IntSummaryStatistics{count=5, sum=15, min=1, average=3.000000, max=5}
```

### 3. Grouping

```java
List<Student> students = Arrays.asList(
    new Student("Alice", 18, "female"),
    new Student("Bob", 20, "male"),
    new Student("Carol", 19, "female"),
    new Student("Dave", 21, "male")
);

// Group by gender
Map<String, List<Student>> byGender = students.stream()
    .collect(Collectors.groupingBy(Student::getGender));
// {female=[Alice, Carol], male=[Bob, Dave]} (assuming Student.toString() returns the name)

// Group by age range
Map<String, List<Student>> byAge = students.stream()
    .collect(Collectors.groupingBy(s -> s.getAge() >= 20 ? "20 and over" : "Under 20"));

// Count within each group
Map<String, Long> countByGender = students.stream()
    .collect(Collectors.groupingBy(
        Student::getGender,
        Collectors.counting()
    ));
// {female=2, male=2}

// Sum within each group
Map<String, Integer> sumByGender = students.stream()
    .collect(Collectors.groupingBy(
        Student::getGender,
        Collectors.summingInt(Student::getAge)
    ));

// Extract only names within each group
Map<String, List<String>> namesByGender = students.stream()
    .collect(Collectors.groupingBy(
        Student::getGender,
        Collectors.mapping(Student::getName, Collectors.toList())
    ));
// {female=[Alice, Carol], male=[Bob, Dave]}

// Multilevel grouping
Map<String, Map<String, List<Student>>> multiGroup = students.stream()
    .collect(Collectors.groupingBy(
        Student::getGender,
        Collectors.groupingBy(s -> s.getAge() >= 20 ? ">=20" : "<20")
    ));
```

### 4. Partitioning

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// Split into two groups by a condition (true/false)
Map<Boolean, List<Integer>> partition = list.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
// {false=[1, 3, 5, 7, 9], true=[2, 4, 6, 8, 10]}

System.out.println(partition.get(true));   // [2, 4, 6, 8, 10]
System.out.println(partition.get(false));  // [1, 3, 5, 7, 9]

// Count within each partition
Map<Boolean, Long> partitionCount = list.stream()
    .collect(Collectors.partitioningBy(
        n -> n % 2 == 0,
        Collectors.counting()
    ));
```

### 5. Advanced Collectors

```java
// mapping: map before collecting
List<String> names = students.stream()
    .collect(Collectors.mapping(Student::getName, Collectors.toList()));

// collectingAndThen: process after collecting
List<String> unmodifiableList = students.stream()
    .map(Student::getName)
    .collect(Collectors.collectingAndThen(
        Collectors.toList(),
        Collections::unmodifiableList
    ));

// reducing: custom reduction
Optional<Student> oldest = students.stream()
    .collect(Collectors.reducing((s1, s2) ->
        s1.getAge() > s2.getAge() ? s1 : s2
    ));

// teeing: perform two collections simultaneously (JDK 12+)
Map.Entry<Long, Double> result = list.stream()
    .collect(Collectors.teeing(
        Collectors.counting(),
        Collectors.averagingInt(n -> n),
        Map::entry
    ));
// Obtain both count and average
```

***

## IX. Parallel Streams

### 1. What Is a Parallel Stream?

A **parallel stream** can use multiple CPU cores to process data in parallel and improve efficiency.

### 2. Obtaining a Parallel Stream

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

// Approach 1: obtain a parallel stream directly
Stream<Integer> parallelStream1 = list.parallelStream();

// Approach 2: convert an ordinary stream into a parallel stream
Stream<Integer> parallelStream2 = list.stream().parallel();

// Convert back to a sequential stream
Stream<Integer> sequentialStream = parallelStream1.sequential();

// Check whether the stream is parallel
boolean isParallel = parallelStream1.isParallel();
```

### 3. Usage Example

```java
// Process a large dataset with a parallel stream
long start = System.currentTimeMillis();

long sum = LongStream.rangeClosed(1, 1_000_000_000L)  // Sum: 500000000500000000
    .parallel()  // Parallel processing
    .sum();

long end = System.currentTimeMillis();
System.out.println("Elapsed time: " + (end - start) + "ms");
```

### 4. Preserving Order

```java
List<String> list = Arrays.asList("A", "B", "C", "D", "E");

// Parallel streams may reorder execution
list.parallelStream()
    .forEach(System.out::print);  // Unspecified order, such as CBDAE

// Use forEachOrdered to preserve order
list.parallelStream()
    .forEachOrdered(System.out::print);  // ABCDE

// Order is preserved when collecting the result
List<String> result = list.parallelStream()
    .map(String::toLowerCase)
    .collect(Collectors.toList());  // [a, b, c, d, e]
```

### 5. Considerations

| Consideration | Description | Example |
| --------- | ---------- | --------------------- |
| **Thread safety** | Avoid modifying shared variables | Do not accumulate into an external variable in forEach |
| **Stateless operations** | Intermediate operations should be stateless | Avoid dependence on external mutable state |
| **Ordering** | Parallel streams may reorder execution | Use forEachOrdered when order matters |
| **Use cases** | Advantages appear with large datasets | Small datasets may run slower |
| **Thread overhead** | Thread creation has overhead | Simple operations are unsuitable for parallelism |
| **Data source** | Some sources parallelize poorly | LinkedList splits inefficiently |

```java
// ❌ Incorrect: modify a shared variable (not thread-safe)
List<Integer> unsafeResult = new ArrayList<>();
list.parallelStream().forEach(n -> unsafeResult.add(n));  // Data may be lost or an exception thrown

// ✅ Correct: use collect
List<Integer> result = list.parallelStream().collect(Collectors.toList());

// ❌ Incorrect: depend on external state
int[] counter = {0};
list.parallelStream().forEach(n -> counter[0]++);  // Unpredictable result

// ✅ Correct: use count
long count = list.parallelStream().count();
```

### 6. When to Use Parallel Streams

| Suitable for parallel streams | Unsuitable for parallel streams |
| ------------ | ---------- |
| Large datasets (>10000) | Small datasets |
| CPU-bound operations | I/O-bound operations |
| Stateless operations | Stateful operations |
| ArrayList, arrays | LinkedList |
| Independent operations | Dependent operations |

***

## X. Practical Examples

### 1. Filtering and Statistics

```java
List<Student> students = Arrays.asList(
    new Student("Alice", 18, 85),
    new Student("Bob", 20, 92),
    new Student("Carol", 19, 78),
    new Student("Dave", 21, 95),
    new Student("Eve", 22, 88)
);

// 1. Select students with scores greater than 80
List<Student> result1 = students.stream()
    .filter(s -> s.getScore() > 80)
    .collect(Collectors.toList());

// 2. Get every student's name
List<String> names = students.stream()
    .map(Student::getName)
    .collect(Collectors.toList());

// 3. Sort by score in descending order
List<Student> sorted = students.stream()
    .sorted(Comparator.comparingInt(Student::getScore).reversed())
    .collect(Collectors.toList());

// 4. Calculate the average score
double avg = students.stream()
    .mapToInt(Student::getScore)
    .average()
    .orElse(0);

// 5. Find the highest score
Optional<Student> top = students.stream()
    .max(Comparator.comparingInt(Student::getScore));

// 6. Count students in each score range
Map<String, Long> gradeCount = students.stream()
    .collect(Collectors.groupingBy(
        s -> {
            int score = s.getScore();
            if (score >= 90) return "Excellent";
            if (score >= 80) return "Good";
            if (score >= 60) return "Pass";
            return "Fail";
        },
        Collectors.counting()
    ));
```

### 2. Data Processing

```java
List<String> words = Arrays.asList("Hello", "World", "Java", "Stream", "API");

// 1. Convert to uppercase and sort
List<String> result1 = words.stream()
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());

// 2. Count the total number of characters
int totalChars = words.stream()
    .mapToInt(String::length)
    .sum();

// 3. Find the longest word
Optional<String> longest = words.stream()
    .max(Comparator.comparingInt(String::length));

// 4. Join into one string
String joined = words.stream()
    .collect(Collectors.joining(" "));

// 5. Group by length
Map<Integer, List<String>> byLength = words.stream()
    .collect(Collectors.groupingBy(String::length));

// 6. Get all distinct characters
Set<Character> chars = words.stream()
    .flatMap(word -> word.chars().mapToObj(c -> (char) c))
    .collect(Collectors.toSet());
```

### 3. Grouped Statistics

```java
List<Employee> employees = getEmployees();

// 1. Group by department
Map<String, List<Employee>> byDept = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDept));

// 2. Sum salaries by department
Map<String, Double> totalByDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDept,
        Collectors.summingDouble(Employee::getSalary)
    ));

// 3. Count employees by department
Map<String, Long> countByDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDept,
        Collectors.counting()
    ));

// 4. Find the highest-paid employee in each department
Map<String, Optional<Employee>> topByDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDept,
        Collectors.maxBy(Comparator.comparingDouble(Employee::getSalary))
    ));

// 5. Group by hire date, then by department
Map<LocalDate, Map<String, List<Employee>>> byDateAndDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getHireDate,
        Collectors.groupingBy(Employee::getDept)
    ));
```

***

## XI. Comparing Java Streams and JavaScript

### 1. Method Comparison

| Java Stream | JavaScript Array | Description |
| ------------- | ---------------- | ------- |
| `filter()` | `filter()` | Filter |
| `map()` | `map()` | Map |
| `flatMap()` | `flatMap()` | Flatten |
| `sorted()` | `sort()` | Sort |
| `distinct()` | `[...new Set()]` | Deduplicate |
| `limit()` | `slice(0, n)` | Take first n |
| `skip()` | `slice(n)` | Skip first n |
| `forEach()` | `forEach()` | Iterate |
| `reduce()` | `reduce()` | Reduce |
| `count()` | `length` | Count |
| `findFirst()` | `find()` | Find |
| `anyMatch()` | `some()` | Any match |
| `allMatch()` | `every()` | All match |
| `collect()` | Returns an array directly | Collect results |

### 2. Code Comparison

```java
// Java Stream
List<String> result = list.stream()
    .filter(s -> s.startsWith("J"))
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());
```

```javascript
// JavaScript
const result = list
    .filter(s => s.startsWith("J"))
    .map(s => s.toUpperCase())
    .sort();
```

### 3. Main Differences

| Difference | Java Stream | JavaScript Array |
| --------- | ----------------- | ---------------- |
| **Lazy evaluation** | Yes (intermediate operations are deferred) | No (immediate execution) |
| **Single use** | Yes (a stream can only be used once) | No (arrays can be reused) |
| **Immutability** | Does not modify the original collection | Some methods modify the original array |
| **Parallel processing** | Supports parallelStream | Not directly supported |

***

## XII. Quick Reference

### 1. Stream Sources

| Data source | How to obtain a stream |
| ---------- | --------------------------------------- |
| Collection | `collection.stream()`                   |
| Map keys | `map.keySet().stream()` |
| Map values | `map.values().stream()` |
| Map entries | `map.entrySet().stream()` |
| Array | `Arrays.stream(arr)` or `Stream.of(arr)` |
| File | `Files.lines(path)` |
| Numeric range | `IntStream.range(1, 10)` |

### 2. Intermediate Operations

| Method | Description | Example |
| ----------- | ------------ | --------------------------- |
| `filter` | Filter | `.filter(n -> n > 10)` |
| `map` | Transform | `.map(String::toUpperCase)` |
| `mapToInt` | Convert to IntStream | `.mapToInt(String::length)` |
| `flatMap` | Flatten | `.flatMap(List::stream)` |
| `distinct` | Deduplicate | `.distinct()` |
| `sorted` | Sort | `.sorted()` |
| `limit` | Take first n | `.limit(5)` |
| `skip` | Skip first n | `.skip(3)` |
| `takeWhile` | Take while true (JDK 9) | `.takeWhile(n -> n < 5)` |
| `dropWhile` | Skip while true (JDK 9) | `.dropWhile(n -> n < 5)` |

### 3. Terminal Operations

| Method | Description | Example |
| ---------------- | --------- | -------------------------------------- |
| `forEach` | Iterate | `.forEach(System.out::println)` |
| `forEachOrdered` | Iterate in order | `.forEachOrdered(System.out::println)` |
| `count` | Count | `.count()` |
| `collect` | Collect | `.collect(Collectors.toList())` |
| `toList` | Collect (JDK 16) | `.toList()` |
| `reduce` | Reduce | `.reduce(0, Integer::sum)` |
| `min/max` | Minimum/maximum | `.max(Integer::compare)` |
| `findFirst` | First element | `.findFirst()` |
| `anyMatch` | Any match | `.anyMatch(n -> n > 10)` |

### 4. Common Collectors

| Method | Description |
| --------------------- | -------- |
| `toList()` | Collect into a List |
| `toSet()` | Collect into a Set |
| `toCollection()` | Collect into a specified collection |
| `toMap()` | Collect into a Map |
| `joining()` | Concatenate strings |
| `counting()` | Count |
| `summingInt()` | Sum |
| `averagingInt()` | Average |
| `groupingBy()` | Group |
| `partitioningBy()` | Partition |
| `mapping()` | Map, then collect |
| `collectingAndThen()` | Collect, then process |
