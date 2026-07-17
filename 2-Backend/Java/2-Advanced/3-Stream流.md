## 一、Stream 流介绍

### 1. 什么是 Stream 流

**Stream 流**是 JDK 8 引入的新特性，用于**简化集合和数组的操作**，让代码更简洁、更易读。

### 2. 传统方式 vs Stream 流

```java
// 需求：筛选出姓"张"且名字长度为3的人

List<String> list = Arrays.asList("张无忌", "赵敏", "张三丰", "周芷若", "张翠山", "小昭");

// ========== 传统方式：代码繁琐 ==========
List<String> result1 = new ArrayList<>();
for (String name : list) {
    if (name.startsWith("张") && name.length() == 3) {
        result1.add(name);
    }
}
System.out.println(result1);  // [张无忌, 张三丰, 张翠山]

// ========== Stream 流：代码简洁 ==========
List<String> result2 = list.stream()
    .filter(name -> name.startsWith("张"))
    .filter(name -> name.length() == 3)
    .collect(Collectors.toList());
System.out.println(result2);  // [张无忌, 张三丰, 张翠山]
```

### 3. Stream 流的特点

| 特点         | 说明                      |
| ---------- | ----------------------- |
| **声明式编程**  | 告诉"做什么"，而不是"怎么做"        |
| **链式调用**   | 多个操作可以链接在一起             |
| **延迟执行**   | 中间操作不会立即执行，只有终结操作才会触发执行 |
| **一次性使用**  | 流只能使用一次，用完就关闭           |
| **不改变原数据** | 流操作不会修改原集合              |

### 4. Stream 流的思想

    数据源（集合/数组/文件）
        ↓
    获取 Stream 流
        ↓
    中间操作（过滤、映射、排序...）← 可以有多个，延迟执行
        ↓
    终结操作（收集、遍历、统计...）← 只能有一个，触发执行
        ↓
    结果

***

## 二、获取 Stream 流

### 1. 从 Collection 获取

```java
// List 获取流
List<String> list = Arrays.asList("A", "B", "C");
Stream<String> stream1 = list.stream();

// Set 获取流
Set<String> set = new HashSet<>(Arrays.asList("A", "B", "C"));
Stream<String> stream2 = set.stream();
```

### 2. 从 Map 获取

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);
map.put("李四", 20);
map.put("王五", 22);

// 获取键的流
Stream<String> keyStream = map.keySet().stream();

// 获取值的流
Stream<Integer> valueStream = map.values().stream();

// 获取键值对的流
Stream<Map.Entry<String, Integer>> entryStream = map.entrySet().stream();
```

### 3. 从数组获取

```java
// 方式一：Arrays.stream()
String[] arr = {"A", "B", "C"};
Stream<String> stream1 = Arrays.stream(arr);

// 方式二：Stream.of()
Stream<String> stream2 = Stream.of("A", "B", "C");
Stream<String> stream3 = Stream.of(arr);

// 基本类型数组
int[] nums = {1, 2, 3};
IntStream intStream = Arrays.stream(nums);
```

### 4. 从文件获取（JDK 8+）

```java
import java.nio.file.Files;
import java.nio.file.Paths;

// 读取文件的每一行
try (Stream<String> lines = Files.lines(Paths.get("data.txt"))) {
    lines.forEach(System.out::println);
} catch (IOException e) {
    e.printStackTrace();
}

// 指定编码
try (Stream<String> lines = Files.lines(Paths.get("data.txt"), StandardCharsets.UTF_8)) {
    long count = lines.filter(line -> line.contains("Java")).count();
}
```

### 5. 创建数值范围流

```java
// IntStream.range()：[start, end)
IntStream.range(1, 5).forEach(System.out::println);  // 1, 2, 3, 4

// IntStream.rangeClosed()：[start, end]
IntStream.rangeClosed(1, 5).forEach(System.out::println);  // 1, 2, 3, 4, 5

// LongStream 同理
LongStream.rangeClosed(1, 100).sum();  // 5050
```

### 6. 其他方式

```java
// 创建无限流
Stream<Integer> stream1 = Stream.iterate(0, n -> n + 2);  // 0, 2, 4, 6, ...
Stream<Double> stream2 = Stream.generate(Math::random);   // 随机数

// JDK 9+：带终止条件的 iterate
Stream<Integer> stream3 = Stream.iterate(0, n -> n < 100, n -> n + 10);
// 0, 10, 20, 30, ..., 90

// 空流
Stream<String> emptyStream = Stream.empty();

// 拼接两个流
Stream<String> combined = Stream.concat(stream1, stream2);

// 单个元素的流
Stream<String> single = Stream.of("Hello");

// JDK 9+：可能为 null 的元素
Stream<String> nullable = Stream.ofNullable(getNullableValue());
// 如果值为 null，返回空流

// 使用 Builder 构建
Stream<String> built = Stream.<String>builder()
    .add("A")
    .add("B")
    .add("C")
    .build();
```

### 7. 获取流方式总结

| 数据源            | 获取方式                                                                          |
| -------------- | ----------------------------------------------------------------------------- |
| **Collection** | `collection.stream()`                                                         |
| **Map**        | `map.keySet().stream()` / `map.values().stream()` / `map.entrySet().stream()` |
| **数组**         | `Arrays.stream(arr)` / `Stream.of(arr)`                                       |
| **多个元素**       | `Stream.of(e1, e2, e3)`                                                       |
| **文件**         | `Files.lines(path)`                                                           |
| **数值范围**       | `IntStream.range(1, 10)` / `IntStream.rangeClosed(1, 10)`                     |
| **无限流**        | `Stream.iterate()` / `Stream.generate()`                                      |

***

## 三、基本类型流

### 1. 三种基本类型流

为避免装箱拆箱的性能开销，Java 提供了三种基本类型的 Stream：

| 类型             | 说明       | 创建方式                             |
| -------------- | -------- | -------------------------------- |
| `IntStream`    | int 流    | `IntStream.of(1, 2, 3)`          |
| `LongStream`   | long 流   | `LongStream.of(1L, 2L, 3L)`      |
| `DoubleStream` | double 流 | `DoubleStream.of(1.0, 2.0, 3.0)` |

### 2. IntStream 常用方法

```java
// 创建
IntStream stream1 = IntStream.of(1, 2, 3, 4, 5);
IntStream stream2 = IntStream.range(1, 6);       // 1, 2, 3, 4, 5
IntStream stream3 = IntStream.rangeClosed(1, 5); // 1, 2, 3, 4, 5

// 统计操作
int sum = IntStream.rangeClosed(1, 100).sum();           // 5050
OptionalInt max = IntStream.of(3, 1, 4, 1, 5).max();     // 5
OptionalInt min = IntStream.of(3, 1, 4, 1, 5).min();     // 1
OptionalDouble avg = IntStream.of(1, 2, 3, 4, 5).average();  // 3.0

// 统计摘要
IntSummaryStatistics stats = IntStream.of(1, 2, 3, 4, 5).summaryStatistics();
System.out.println(stats.getSum());      // 15
System.out.println(stats.getAverage());  // 3.0
System.out.println(stats.getMax());      // 5
System.out.println(stats.getMin());      // 1
System.out.println(stats.getCount());    // 5
```

### 3. 对象流与基本类型流转换

```java
List<String> list = Arrays.asList("apple", "banana", "cherry");

// Stream<T> → IntStream（使用 mapToInt）
IntStream lengths = list.stream().mapToInt(String::length);

// IntStream → Stream<Integer>（使用 boxed）
Stream<Integer> boxed = IntStream.of(1, 2, 3).boxed();

// IntStream → List<Integer>
List<Integer> intList = IntStream.of(1, 2, 3)
    .boxed()
    .collect(Collectors.toList());

// 或者（JDK 16+）
List<Integer> intList2 = IntStream.of(1, 2, 3)
    .boxed()
    .toList();
```

***

## 四、Stream 流常用方法

### 1. 方法分类

| 分类       | 说明                 | 特点         |
| -------- | ------------------ | ---------- |
| **中间操作** | 返回新的 Stream，可以链式调用 | 延迟执行，可以有多个 |
| **终结操作** | 触发执行，返回结果或无返回值     | 立即执行，只能有一个 |

### 2. 中间操作方法

| 方法                     | 说明        | 版本    |
| ---------------------- | --------- | ----- |
| `filter(Predicate)`    | 过滤        | JDK 8 |
| `map(Function)`        | 转换/映射     | JDK 8 |
| `mapToInt/Long/Double` | 转换为基本类型流  | JDK 8 |
| `flatMap(Function)`    | 扁平化映射     | JDK 8 |
| `distinct()`           | 去重        | JDK 8 |
| `sorted()`             | 排序（自然顺序）  | JDK 8 |
| `sorted(Comparator)`   | 排序（自定义顺序） | JDK 8 |
| `limit(long n)`        | 取前 n 个    | JDK 8 |
| `skip(long n)`         | 跳过前 n 个   | JDK 8 |
| `peek(Consumer)`       | 查看元素（调试用） | JDK 8 |
| `takeWhile(Predicate)` | 满足条件时取    | JDK 9 |
| `dropWhile(Predicate)` | 满足条件时跳过   | JDK 9 |

### 3. 终结操作方法

| 方法                         | 说明          | 版本     |
| -------------------------- | ----------- | ------ |
| `forEach(Consumer)`        | 遍历          | JDK 8  |
| `forEachOrdered(Consumer)` | 有序遍历        | JDK 8  |
| `count()`                  | 统计数量        | JDK 8  |
| `collect(Collector)`       | 收集到集合       | JDK 8  |
| `toList()`                 | 收集到不可变 List | JDK 16 |
| `toArray()`                | 收集到数组       | JDK 8  |
| `reduce(BinaryOperator)`   | 归约          | JDK 8  |
| `min(Comparator)`          | 最小值         | JDK 8  |
| `max(Comparator)`          | 最大值         | JDK 8  |
| `findFirst()`              | 获取第一个       | JDK 8  |
| `findAny()`                | 获取任意一个      | JDK 8  |
| `anyMatch(Predicate)`      | 是否有匹配的      | JDK 8  |
| `allMatch(Predicate)`      | 是否全部匹配      | JDK 8  |
| `noneMatch(Predicate)`     | 是否全部不匹配     | JDK 8  |

***

## 五、中间操作详解

### 1. filter：过滤

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// 过滤出偶数
list.stream()
    .filter(n -> n % 2 == 0)
    .forEach(System.out::println);  // 2, 4, 6, 8, 10

// 多条件过滤
list.stream()
    .filter(n -> n % 2 == 0)
    .filter(n -> n > 5)
    .forEach(System.out::println);  // 6, 8, 10
```

### 2. map：转换/映射

```java
List<String> list = Arrays.asList("apple", "banana", "cherry");

// 转换为大写
list.stream()
    .map(String::toUpperCase)
    .forEach(System.out::println);  // APPLE, BANANA, CHERRY

// 获取长度
list.stream()
    .map(String::length)
    .forEach(System.out::println);  // 5, 6, 6

// 对象属性映射
List<User> users = getUsers();
List<String> names = users.stream()
    .map(User::getName)
    .collect(Collectors.toList());
```

### 3. mapToInt / mapToLong / mapToDouble：转换为基本类型流

```java
List<String> list = Arrays.asList("apple", "banana", "cherry");

// mapToInt：转换为 IntStream
int totalLength = list.stream()
    .mapToInt(String::length)
    .sum();  // 17

// 可以使用 IntStream 的统计方法
OptionalDouble avg = list.stream()
    .mapToInt(String::length)
    .average();

// 对象列表求和
List<Order> orders = getOrders();
double totalAmount = orders.stream()
    .mapToDouble(Order::getAmount)
    .sum();
```

### 4. flatMap：扁平化映射

```java
// 场景：将多个集合合并成一个流
List<List<Integer>> nestedList = Arrays.asList(
    Arrays.asList(1, 2, 3),
    Arrays.asList(4, 5, 6),
    Arrays.asList(7, 8, 9)
);

// flatMap：将嵌套的集合展开
nestedList.stream()
    .flatMap(List::stream)
    .forEach(System.out::println);  // 1, 2, 3, 4, 5, 6, 7, 8, 9

// 场景：将字符串拆分成字符
List<String> words = Arrays.asList("Hello", "World");
words.stream()
    .flatMap(word -> Arrays.stream(word.split("")))
    .forEach(System.out::print);  // HelloWorld

// 场景：一对多关系
List<Order> orders = getOrders();
List<OrderItem> allItems = orders.stream()
    .flatMap(order -> order.getItems().stream())
    .collect(Collectors.toList());
```

### 5. distinct：去重

```java
List<Integer> list = Arrays.asList(1, 2, 2, 3, 3, 3, 4);

list.stream()
    .distinct()
    .forEach(System.out::println);  // 1, 2, 3, 4

// 注意：对象去重需要重写 equals() 和 hashCode()
List<User> users = getUsers();
List<User> distinctUsers = users.stream()
    .distinct()
    .collect(Collectors.toList());
```

### 6. sorted：排序

```java
List<Integer> list = Arrays.asList(5, 2, 8, 1, 9, 3);

// 自然排序（升序）
list.stream()
    .sorted()
    .forEach(System.out::println);  // 1, 2, 3, 5, 8, 9

// 自定义排序（降序）
list.stream()
    .sorted((a, b) -> b - a)
    .forEach(System.out::println);  // 9, 8, 5, 3, 2, 1

// 使用 Comparator
list.stream()
    .sorted(Comparator.reverseOrder())
    .forEach(System.out::println);  // 9, 8, 5, 3, 2, 1

// 对象排序
List<String> names = Arrays.asList("张三丰", "张无忌", "赵敏", "小昭");
names.stream()
    .sorted(Comparator.comparingInt(String::length))
    .forEach(System.out::println);  // 赵敏, 小昭, 张三丰, 张无忌

// 多字段排序
List<User> users = getUsers();
users.stream()
    .sorted(Comparator.comparing(User::getAge)
            .thenComparing(User::getName))
    .forEach(System.out::println);
```

### 7. limit 和 skip：截取

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// limit：取前 5 个
list.stream()
    .limit(5)
    .forEach(System.out::println);  // 1, 2, 3, 4, 5

// skip：跳过前 5 个
list.stream()
    .skip(5)
    .forEach(System.out::println);  // 6, 7, 8, 9, 10

// 组合：取第 3-7 个（跳过 2 个，取 5 个）
list.stream()
    .skip(2)
    .limit(5)
    .forEach(System.out::println);  // 3, 4, 5, 6, 7

// 分页：第2页，每页3条
int page = 2, pageSize = 3;
list.stream()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .forEach(System.out::println);  // 4, 5, 6
```

### 8. takeWhile 和 dropWhile（JDK 9+）

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// takeWhile：从头开始取，直到条件不满足
list.stream()
    .takeWhile(n -> n < 5)
    .forEach(System.out::println);  // 1, 2, 3, 4

// dropWhile：从头开始跳过，直到条件不满足
list.stream()
    .dropWhile(n -> n < 5)
    .forEach(System.out::println);  // 5, 6, 7, 8, 9, 10

// 注意：与 filter 的区别
// filter 会检查所有元素
// takeWhile/dropWhile 遇到不满足条件的元素就停止
List<Integer> list2 = Arrays.asList(1, 2, 5, 3, 4);  // 注意顺序
list2.stream().takeWhile(n -> n < 5).forEach(System.out::print);  // 1, 2
list2.stream().filter(n -> n < 5).forEach(System.out::print);     // 1, 2, 3, 4
```

### 9. peek：查看元素（调试用）

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

List<Integer> result = list.stream()
    .peek(n -> System.out.println("原始值：" + n))
    .map(n -> n * 2)
    .peek(n -> System.out.println("乘2后：" + n))
    .filter(n -> n > 5)
    .peek(n -> System.out.println("过滤后：" + n))
    .collect(Collectors.toList());

// 注意：peek 主要用于调试，不要用于修改元素状态
```

***

## 六、终结操作详解

### 1. forEach 和 forEachOrdered：遍历

```java
List<String> list = Arrays.asList("A", "B", "C");

// 遍历打印
list.stream().forEach(System.out::println);

// 简写（Collection 自带的 forEach）
list.forEach(System.out::println);

// forEachOrdered：保证顺序（在并行流中有用）
list.parallelStream()
    .forEach(System.out::println);        // 顺序不确定
list.parallelStream()
    .forEachOrdered(System.out::println); // 顺序确定：A, B, C
```

### 2. count：统计数量

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

long count = list.stream()
    .filter(n -> n > 3)
    .count();

System.out.println(count);  // 2
```

### 3. collect：收集到集合

```java
List<String> list = Arrays.asList("张无忌", "赵敏", "张三丰", "周芷若");

// 收集到 List
List<String> result1 = list.stream()
    .filter(name -> name.startsWith("张"))
    .collect(Collectors.toList());

// 收集到 Set
Set<String> result2 = list.stream()
    .filter(name -> name.startsWith("张"))
    .collect(Collectors.toSet());

// 收集到指定类型的集合
LinkedList<String> result3 = list.stream()
    .collect(Collectors.toCollection(LinkedList::new));

TreeSet<String> result4 = list.stream()
    .collect(Collectors.toCollection(TreeSet::new));

// 收集到 Map
Map<String, Integer> result5 = list.stream()
    .collect(Collectors.toMap(
        name -> name,           // key
        name -> name.length()   // value
    ));
// {张无忌=3, 赵敏=2, 张三丰=3, 周芷若=3}

// 收集到 Map（处理 key 重复）
Map<Integer, String> result6 = list.stream()
    .collect(Collectors.toMap(
        String::length,    // key
        name -> name,      // value
        (v1, v2) -> v1     // key 重复时，保留第一个
    ));
```

### 4. toList()（JDK 16+）

```java
List<String> list = Arrays.asList("A", "B", "C");

// JDK 16+：直接使用 toList()
List<String> result = list.stream()
    .filter(s -> s.length() > 0)
    .toList();  // 返回不可变 List

// 等价于
List<String> result2 = list.stream()
    .filter(s -> s.length() > 0)
    .collect(Collectors.toUnmodifiableList());

// 注意：toList() 返回的是不可变 List
// result.add("D");  // ❌ 抛出 UnsupportedOperationException
```

### 5. toArray：收集到数组

```java
List<String> list = Arrays.asList("A", "B", "C");

// 转换为 Object 数组
Object[] arr1 = list.stream().toArray();

// 转换为 String 数组
String[] arr2 = list.stream().toArray(String[]::new);

// 转换为 int 数组
int[] arr3 = list.stream()
    .mapToInt(String::length)
    .toArray();
```

### 6. reduce：归约

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

// 求和（带初始值）
int sum = list.stream()
    .reduce(0, (a, b) -> a + b);
System.out.println(sum);  // 15

// 求和（方法引用）
int sum2 = list.stream()
    .reduce(0, Integer::sum);

// 求和（无初始值，返回 Optional）
Optional<Integer> sum3 = list.stream()
    .reduce(Integer::sum);

// 求最大值
Optional<Integer> max = list.stream()
    .reduce(Integer::max);
System.out.println(max.orElse(0));  // 5

// 字符串拼接
List<String> words = Arrays.asList("Hello", " ", "World");
String result = words.stream()
    .reduce("", (a, b) -> a + b);
System.out.println(result);  // Hello World

// 复杂归约：计算总价
List<Order> orders = getOrders();
BigDecimal total = orders.stream()
    .map(Order::getAmount)
    .reduce(BigDecimal.ZERO, BigDecimal::add);
```

### 7. min / max：最值

```java
List<Integer> list = Arrays.asList(5, 2, 8, 1, 9);

// 最小值
Optional<Integer> min = list.stream().min(Integer::compare);
System.out.println(min.orElse(0));  // 1

// 最大值
Optional<Integer> max = list.stream().max(Integer::compare);
System.out.println(max.orElse(0));  // 9

// 使用 Comparator
Optional<Integer> min2 = list.stream().min(Comparator.naturalOrder());
Optional<Integer> max2 = list.stream().max(Comparator.naturalOrder());

// 对象的最值
List<String> names = Arrays.asList("张三丰", "张无忌", "赵敏");
Optional<String> longest = names.stream()
    .max(Comparator.comparingInt(String::length));
System.out.println(longest.orElse(""));  // 张三丰
```

### 8. findFirst / findAny：查找

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

// 获取第一个
Optional<Integer> first = list.stream()
    .filter(n -> n > 3)
    .findFirst();
System.out.println(first.orElse(0));  // 4

// 获取任意一个（并行流中更有用，性能更好）
Optional<Integer> any = list.parallelStream()
    .filter(n -> n > 3)
    .findAny();
System.out.println(any.orElse(0));  // 4 或 5（不确定）
```

### 9. 匹配方法

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

// anyMatch：是否有任意一个匹配
boolean hasEven = list.stream().anyMatch(n -> n % 2 == 0);
System.out.println(hasEven);  // true

// allMatch：是否全部匹配
boolean allPositive = list.stream().allMatch(n -> n > 0);
System.out.println(allPositive);  // true

// noneMatch：是否全部不匹配
boolean noNegative = list.stream().noneMatch(n -> n < 0);
System.out.println(noNegative);  // true

// 短路特性：一旦确定结果就停止
list.stream()
    .peek(n -> System.out.println("检查：" + n))
    .anyMatch(n -> n == 3);
// 只输出：检查：1，检查：2，检查：3（找到后停止）
```

***

## 七、处理 Optional 结果

### 1. Optional 的常用方法

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

Optional<Integer> result = list.stream()
    .filter(n -> n > 10)
    .findFirst();

// 判断是否有值
if (result.isPresent()) {
    System.out.println(result.get());
}

// 有值时执行
result.ifPresent(System.out::println);

// JDK 9+：有值或无值时分别执行
result.ifPresentOrElse(
    value -> System.out.println("找到：" + value),
    () -> System.out.println("未找到")
);

// 获取值或默认值
Integer value1 = result.orElse(0);
Integer value2 = result.orElseGet(() -> calculateDefault());
Integer value3 = result.orElseThrow();  // 无值时抛 NoSuchElementException
Integer value4 = result.orElseThrow(() -> new RuntimeException("未找到"));

// 转换
Optional<String> mapped = result.map(n -> "值是：" + n);

// 过滤
Optional<Integer> filtered = result.filter(n -> n > 5);

// JDK 9+：无值时返回另一个 Optional
Optional<Integer> alternative = result.or(() -> Optional.of(-1));

// JDK 9+：转换为 Stream
Stream<Integer> stream = result.stream();
```

### 2. 避免 Optional 的错误用法

```java
// ❌ 错误：直接调用 get()
Optional<Integer> opt = list.stream().findFirst();
Integer value = opt.get();  // 可能抛 NoSuchElementException

// ✅ 正确：先检查或使用 orElse
Integer value1 = opt.orElse(0);
Integer value2 = opt.orElseThrow(() -> new RuntimeException("未找到"));

// ❌ 错误：用 Optional 作为字段类型
class User {
    Optional<String> name;  // 不推荐
}

// ✅ 正确：Optional 主要用于方法返回值
class User {
    String name;
    public Optional<String> getName() {
        return Optional.ofNullable(name);
    }
}
```

***

## 八、Collectors 收集器

### 1. 常用收集方法

```java
List<String> list = Arrays.asList("张无忌", "赵敏", "张三丰", "周芷若", "张翠山");

// toList：收集到 List
List<String> result1 = list.stream()
    .filter(name -> name.startsWith("张"))
    .collect(Collectors.toList());

// toSet：收集到 Set
Set<String> result2 = list.stream()
    .filter(name -> name.startsWith("张"))
    .collect(Collectors.toSet());

// toCollection：收集到指定集合类型
TreeSet<String> result3 = list.stream()
    .collect(Collectors.toCollection(TreeSet::new));

// joining：字符串拼接
String result4 = list.stream()
    .collect(Collectors.joining(", "));
// 张无忌, 赵敏, 张三丰, 周芷若, 张翠山

// joining：带前缀后缀
String result5 = list.stream()
    .collect(Collectors.joining(", ", "[", "]"));
// [张无忌, 赵敏, 张三丰, 周芷若, 张翠山]
```

### 2. 统计方法

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

// counting：计数
long count = list.stream().collect(Collectors.counting());

// summingInt：求和
int sum = list.stream().collect(Collectors.summingInt(n -> n));

// averagingInt：平均值
double avg = list.stream().collect(Collectors.averagingInt(n -> n));

// maxBy / minBy：最值
Optional<Integer> max = list.stream()
    .collect(Collectors.maxBy(Integer::compare));

// summarizingInt：统计信息（数量、总和、最小、最大、平均）
IntSummaryStatistics stats = list.stream()
    .collect(Collectors.summarizingInt(n -> n));
System.out.println(stats);
// IntSummaryStatistics{count=5, sum=15, min=1, average=3.000000, max=5}
```

### 3. 分组

```java
List<Student> students = Arrays.asList(
    new Student("张三", 18, "男"),
    new Student("李四", 20, "男"),
    new Student("王五", 19, "女"),
    new Student("赵六", 21, "女")
);

// 按性别分组
Map<String, List<Student>> byGender = students.stream()
    .collect(Collectors.groupingBy(Student::getGender));
// {男=[张三, 李四], 女=[王五, 赵六]}

// 按年龄段分组
Map<String, List<Student>> byAge = students.stream()
    .collect(Collectors.groupingBy(s -> s.getAge() >= 20 ? "成年" : "未成年"));

// 分组后计数
Map<String, Long> countByGender = students.stream()
    .collect(Collectors.groupingBy(
        Student::getGender,
        Collectors.counting()
    ));
// {男=2, 女=2}

// 分组后求和
Map<String, Integer> sumByGender = students.stream()
    .collect(Collectors.groupingBy(
        Student::getGender,
        Collectors.summingInt(Student::getAge)
    ));

// 分组后只取名字
Map<String, List<String>> namesByGender = students.stream()
    .collect(Collectors.groupingBy(
        Student::getGender,
        Collectors.mapping(Student::getName, Collectors.toList())
    ));
// {男=[张三, 李四], 女=[王五, 赵六]}

// 多级分组
Map<String, Map<String, List<Student>>> multiGroup = students.stream()
    .collect(Collectors.groupingBy(
        Student::getGender,
        Collectors.groupingBy(s -> s.getAge() >= 20 ? ">=20" : "<20")
    ));
```

### 4. 分区

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// 按条件分成两组（true/false）
Map<Boolean, List<Integer>> partition = list.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
// {false=[1, 3, 5, 7, 9], true=[2, 4, 6, 8, 10]}

System.out.println(partition.get(true));   // [2, 4, 6, 8, 10]
System.out.println(partition.get(false));  // [1, 3, 5, 7, 9]

// 分区后计数
Map<Boolean, Long> partitionCount = list.stream()
    .collect(Collectors.partitioningBy(
        n -> n % 2 == 0,
        Collectors.counting()
    ));
```

### 5. 高级收集器

```java
// mapping：先映射再收集
List<String> names = students.stream()
    .collect(Collectors.mapping(Student::getName, Collectors.toList()));

// collectingAndThen：收集后再处理
List<String> unmodifiableList = students.stream()
    .map(Student::getName)
    .collect(Collectors.collectingAndThen(
        Collectors.toList(),
        Collections::unmodifiableList
    ));

// reducing：自定义归约
Optional<Student> oldest = students.stream()
    .collect(Collectors.reducing((s1, s2) -> 
        s1.getAge() > s2.getAge() ? s1 : s2
    ));

// teeing：同时进行两种收集（JDK 12+）
Map.Entry<Long, Double> result = list.stream()
    .collect(Collectors.teeing(
        Collectors.counting(),
        Collectors.averagingInt(n -> n),
        Map::entry
    ));
// 同时得到 count 和 average
```

***

## 九、并行流

### 1. 什么是并行流

**并行流**可以利用多核 CPU，并行处理数据，提高效率。

### 2. 获取并行流

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

// 方式一：直接获取并行流
Stream<Integer> parallelStream1 = list.parallelStream();

// 方式二：将普通流转换为并行流
Stream<Integer> parallelStream2 = list.stream().parallel();

// 转回顺序流
Stream<Integer> sequentialStream = parallelStream1.sequential();

// 检查是否是并行流
boolean isParallel = parallelStream1.isParallel();
```

### 3. 使用示例

```java
// 并行流处理大量数据
long start = System.currentTimeMillis();

long sum = LongStream.rangeClosed(1, 10_000_000_000L)
    .parallel()  // 并行处理
    .sum();

long end = System.currentTimeMillis();
System.out.println("耗时：" + (end - start) + "ms");
```

### 4. 保证顺序

```java
List<String> list = Arrays.asList("A", "B", "C", "D", "E");

// 并行流可能打乱顺序
list.parallelStream()
    .forEach(System.out::print);  // 顺序不确定，如 CBDAE

// 使用 forEachOrdered 保证顺序
list.parallelStream()
    .forEachOrdered(System.out::print);  // ABCDE

// 收集结果时顺序是保证的
List<String> result = list.parallelStream()
    .map(String::toLowerCase)
    .collect(Collectors.toList());  // [a, b, c, d, e]
```

### 5. 注意事项

| 注意事项      | 说明         | 示例                    |
| --------- | ---------- | --------------------- |
| **线程安全**  | 避免修改共享变量   | 不要在 forEach 中累加外部变量   |
| **无状态操作** | 中间操作应该无状态  | 避免依赖外部可变状态            |
| **有序性**   | 并行流可能打乱顺序  | 需要顺序时用 forEachOrdered |
| **适用场景**  | 数据量大时才有优势  | 小数据量反而更慢              |
| **线程开销**  | 创建线程有开销    | 简单操作不适合并行             |
| **数据源**   | 某些数据源并行效率低 | LinkedList 拆分效率低      |

```java
// ❌ 错误：修改共享变量（线程不安全）
List<Integer> result = new ArrayList<>();
list.parallelStream().forEach(n -> result.add(n));  // 可能丢失数据

// ✅ 正确：使用 collect
List<Integer> result = list.parallelStream().collect(Collectors.toList());

// ❌ 错误：依赖外部状态
int[] counter = {0};
list.parallelStream().forEach(n -> counter[0]++);  // 结果不确定

// ✅ 正确：使用 count
long count = list.parallelStream().count();
```

### 6. 何时使用并行流

| 适合并行流        | 不适合并行流     |
| ------------ | ---------- |
| 数据量大（>10000） | 数据量小       |
| CPU 密集型操作    | IO 密集型操作   |
| 无状态操作        | 有状态操作      |
| ArrayList、数组 | LinkedList |
| 操作独立         | 操作有依赖      |

***

## 十、实战案例

### 案例1：筛选和统计

```java
List<Student> students = Arrays.asList(
    new Student("张三", 18, 85),
    new Student("李四", 20, 92),
    new Student("王五", 19, 78),
    new Student("赵六", 21, 95),
    new Student("钱七", 22, 88)
);

// 1. 筛选成绩大于 80 的学生
List<Student> result1 = students.stream()
    .filter(s -> s.getScore() > 80)
    .collect(Collectors.toList());

// 2. 获取所有学生的名字
List<String> names = students.stream()
    .map(Student::getName)
    .collect(Collectors.toList());

// 3. 按成绩降序排序
List<Student> sorted = students.stream()
    .sorted(Comparator.comparingInt(Student::getScore).reversed())
    .collect(Collectors.toList());

// 4. 计算平均分
double avg = students.stream()
    .mapToInt(Student::getScore)
    .average()
    .orElse(0);

// 5. 找出最高分
Optional<Student> top = students.stream()
    .max(Comparator.comparingInt(Student::getScore));

// 6. 统计各分数段人数
Map<String, Long> gradeCount = students.stream()
    .collect(Collectors.groupingBy(
        s -> {
            int score = s.getScore();
            if (score >= 90) return "优秀";
            if (score >= 80) return "良好";
            if (score >= 60) return "及格";
            return "不及格";
        },
        Collectors.counting()
    ));
```

### 案例2：数据处理

```java
List<String> words = Arrays.asList("Hello", "World", "Java", "Stream", "API");

// 1. 转换为大写并排序
List<String> result1 = words.stream()
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());

// 2. 统计总字符数
int totalChars = words.stream()
    .mapToInt(String::length)
    .sum();

// 3. 找出最长的单词
Optional<String> longest = words.stream()
    .max(Comparator.comparingInt(String::length));

// 4. 拼接成一个字符串
String joined = words.stream()
    .collect(Collectors.joining(" "));

// 5. 按长度分组
Map<Integer, List<String>> byLength = words.stream()
    .collect(Collectors.groupingBy(String::length));

// 6. 获取所有不重复的字符
Set<Character> chars = words.stream()
    .flatMap(word -> word.chars().mapToObj(c -> (char) c))
    .collect(Collectors.toSet());
```

### 案例3：分组统计

```java
List<Order> orders = getOrders();

// 1. 按用户分组
Map<String, List<Order>> byUser = orders.stream()
    .collect(Collectors.groupingBy(Order::getUserId));

// 2. 按用户统计订单金额
Map<String, Double> totalByUser = orders.stream()
    .collect(Collectors.groupingBy(
        Order::getUserId,
        Collectors.summingDouble(Order::getAmount)
    ));

// 3. 按用户统计订单数量
Map<String, Long> countByUser = orders.stream()
    .collect(Collectors.groupingBy(
        Order::getUserId,
        Collectors.counting()
    ));

// 4. 找出每个用户的最大订单
Map<String, Optional<Order>> maxByUser = orders.stream()
    .collect(Collectors.groupingBy(
        Order::getUserId,
        Collectors.maxBy(Comparator.comparingDouble(Order::getAmount))
    ));

// 5. 按日期和用户双重分组
Map<LocalDate, Map<String, List<Order>>> byDateAndUser = orders.stream()
    .collect(Collectors.groupingBy(
        Order::getDate,
        Collectors.groupingBy(Order::getUserId)
    ));
```

***

## 十一、Stream 流与 JavaScript 对比

### 1. 方法对比

| Java Stream   | JavaScript Array | 说明      |
| ------------- | ---------------- | ------- |
| `filter()`    | `filter()`       | 过滤      |
| `map()`       | `map()`          | 映射      |
| `flatMap()`   | `flatMap()`      | 扁平化     |
| `sorted()`    | `sort()`         | 排序      |
| `distinct()`  | `[...new Set()]` | 去重      |
| `limit()`     | `slice(0, n)`    | 取前 n 个  |
| `skip()`      | `slice(n)`       | 跳过前 n 个 |
| `forEach()`   | `forEach()`      | 遍历      |
| `reduce()`    | `reduce()`       | 归约      |
| `count()`     | `length`         | 数量      |
| `findFirst()` | `find()`         | 查找      |
| `anyMatch()`  | `some()`         | 是否有匹配   |
| `allMatch()`  | `every()`        | 是否全部匹配  |
| `collect()`   | 直接返回数组           | 收集结果    |

### 2. 代码对比

```java
// Java Stream
List<String> result = list.stream()
    .filter(s -> s.startsWith("张"))
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());
```

```javascript
// JavaScript
const result = list
    .filter(s => s.startsWith("张"))
    .map(s => s.toUpperCase())
    .sort();
```

### 3. 主要差异

| 差异        | Java Stream       | JavaScript Array |
| --------- | ----------------- | ---------------- |
| **惰性求值**  | 是（中间操作延迟执行）       | 否（立即执行）          |
| **一次性使用** | 是（流只能用一次）         | 否（数组可重复使用）       |
| **不可变性**  | 不修改原集合            | 某些方法会修改原数组       |
| **并行处理**  | 支持 parallelStream | 不直接支持            |

***

## 十二、知识点速查表

### 1. 获取流方式

| 数据源        | 获取方式                                    |
| ---------- | --------------------------------------- |
| Collection | `collection.stream()`                   |
| Map 的键     | `map.keySet().stream()`                 |
| Map 的值     | `map.values().stream()`                 |
| Map 的键值对   | `map.entrySet().stream()`               |
| 数组         | `Arrays.stream(arr)` 或 `Stream.of(arr)` |
| 文件         | `Files.lines(path)`                     |
| 数值范围       | `IntStream.range(1, 10)`                |

### 2. 中间操作

| 方法          | 说明           | 示例                          |
| ----------- | ------------ | --------------------------- |
| `filter`    | 过滤           | `.filter(n -> n > 10)`      |
| `map`       | 转换           | `.map(String::toUpperCase)` |
| `mapToInt`  | 转为 IntStream | `.mapToInt(String::length)` |
| `flatMap`   | 扁平化          | `.flatMap(List::stream)`    |
| `distinct`  | 去重           | `.distinct()`               |
| `sorted`    | 排序           | `.sorted()`                 |
| `limit`     | 取前 n 个       | `.limit(5)`                 |
| `skip`      | 跳过前 n 个      | `.skip(3)`                  |
| `takeWhile` | 满足时取（JDK9）   | `.takeWhile(n -> n < 5)`    |
| `dropWhile` | 满足时跳过（JDK9）  | `.dropWhile(n -> n < 5)`    |

### 3. 终结操作

| 方法               | 说明        | 示例                                     |
| ---------------- | --------- | -------------------------------------- |
| `forEach`        | 遍历        | `.forEach(System.out::println)`        |
| `forEachOrdered` | 有序遍历      | `.forEachOrdered(System.out::println)` |
| `count`          | 统计        | `.count()`                             |
| `collect`        | 收集        | `.collect(Collectors.toList())`        |
| `toList`         | 收集（JDK16） | `.toList()`                            |
| `reduce`         | 归约        | `.reduce(0, Integer::sum)`             |
| `min/max`        | 最值        | `.max(Integer::compare)`               |
| `findFirst`      | 第一个       | `.findFirst()`                         |
| `anyMatch`       | 有匹配       | `.anyMatch(n -> n > 10)`               |

### 4. 常用 Collectors

| 方法                    | 说明       |
| --------------------- | -------- |
| `toList()`            | 收集到 List |
| `toSet()`             | 收集到 Set  |
| `toCollection()`      | 收集到指定集合  |
| `toMap()`             | 收集到 Map  |
| `joining()`           | 字符串拼接    |
| `counting()`          | 计数       |
| `summingInt()`        | 求和       |
| `averagingInt()`      | 平均值      |
| `groupingBy()`        | 分组       |
| `partitioningBy()`    | 分区       |
| `mapping()`           | 映射后收集    |
| `collectingAndThen()` | 收集后处理    |

