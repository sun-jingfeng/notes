## 一、Set 集合介绍

### 1. Set 接口特点

| 特点      | 说明          |
| ------- | ----------- |
| **无序**  | 元素存取顺序可能不一致 |
| **不重复** | 不允许存储重复元素   |
| **无索引** | 不能通过索引访问元素  |

### 2. Set vs List 对比

| 对比项  | List                 | Set                  |
| ---- | -------------------- | -------------------- |
| 有序性  | 有序                   | 无序（LinkedHashSet 除外） |
| 重复性  | 可重复                  | 不可重复                 |
| 索引   | 有索引                  | 无索引                  |
| 常用实现 | ArrayList、LinkedList | HashSet、TreeSet      |

### 3. Set 常用方法

```java
Set<String> set = new HashSet<>();

// 添加元素
set.add("A");
set.add("B");
set.add("A");  // 重复元素，添加失败，返回 false
System.out.println(set);  // [A, B]

// 删除元素
set.remove("A");

// 判断
set.contains("B");  // true
set.isEmpty();      // false
set.size();         // 1

// 遍历（只能用迭代器、增强for、forEach）
for (String s : set) {
    System.out.println(s);
}

// 转换为数组
String[] arr = set.toArray(new String[0]);
```

***

## 二、HashSet 集合

### 1. HashSet 特点

| 特点          | 说明                       |
| ----------- | ------------------------ |
| **底层结构**    | 哈希表（数组 + 链表 + 红黑树）       |
| **无序**      | 不保证存取顺序                  |
| **不重复**     | 依赖 hashCode() 和 equals() |
| **允许 null** | 可以存储一个 null 值            |
| **线程不安全**   | 多线程需要同步                  |

### 2. 基本使用

```java
import java.util.HashSet;
import java.util.Set;

public class HashSetDemo {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();
        
        // 添加元素
        set.add("张三");
        set.add("李四");
        set.add("王五");
        set.add("张三");  // 重复，添加失败
        
        System.out.println(set);  // [李四, 张三, 王五]（顺序不确定）
        System.out.println(set.size());  // 3
    }
}
```

### 3. 哈希表原理

#### 3.1 JDK 7：数组 + 链表

    ┌───┬───┬───┬───┬───┬───┬───┬───┐
    │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │  ← 数组
    └─┬─┴───┴─┬─┴───┴───┴─┬─┴───┴───┘
      │       │           │
      ↓       ↓           ↓
     [A]     [B]         [D]
      │       │
      ↓       ↓
     [C]     [E]  ← 链表（哈希冲突时）

#### 3.2 JDK 8：数组 + 链表 + 红黑树

    当链表长度 > 8 且数组长度 >= 64 时，链表转换为红黑树

    ┌───┬───┬───┬───┬───┬───┬───┬───┐
    │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │
    └─┬─┴───┴─┬─┴───┴───┴─┬─┴───┴───┘
      │       │           │
      ↓       ↓           ↓
     链表    链表        红黑树（链表长度 > 8）

#### 3.3 初始容量和负载因子

```java
// 默认初始容量：16
// 默认负载因子：0.75

// 扩容阈值 = 容量 × 负载因子 = 16 × 0.75 = 12
// 当元素数量超过 12 时，数组扩容为原来的 2 倍

// 指定初始容量（避免频繁扩容）
Set<String> set = new HashSet<>(32);  // 初始容量 32

// 指定初始容量和负载因子
Set<String> set2 = new HashSet<>(32, 0.75f);
```

**扩容机制：**

| 阶段    | 容量  | 扩容阈值 |
| ----- | --- | ---- |
| 初始    | 16  | 12   |
| 第1次扩容 | 32  | 24   |
| 第2次扩容 | 64  | 48   |
| 第3次扩容 | 128 | 96   |

### 4. 元素去重原理

```java
// HashSet 去重依赖两个方法：
// 1. hashCode()：计算哈希值，决定存储位置
// 2. equals()：比较内容是否相同

// 去重流程：
// 1. 计算元素的 hashCode
// 2. 根据 hashCode 计算存储位置
// 3. 如果该位置为空，直接存储
// 4. 如果该位置不为空，调用 equals 比较
//    - equals 返回 true：重复，不存储
//    - equals 返回 false：不重复，链表/红黑树存储

public class Student {
    private String name;
    private int age;
    
    // 必须重写 hashCode 和 equals
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

### 5. 自定义对象去重

```java
public class HashSetDemo {
    public static void main(String[] args) {
        Set<Student> set = new HashSet<>();
        
        set.add(new Student("张三", 18));
        set.add(new Student("李四", 19));
        set.add(new Student("张三", 18));  // 重复，添加失败
        
        System.out.println(set.size());  // 2（前提是重写了 hashCode 和 equals）
    }
}
```

### 6. 集合运算

```java
Set<Integer> set1 = new HashSet<>(Arrays.asList(1, 2, 3, 4, 5));
Set<Integer> set2 = new HashSet<>(Arrays.asList(4, 5, 6, 7, 8));

// 并集
Set<Integer> union = new HashSet<>(set1);
union.addAll(set2);
System.out.println(union);  // [1, 2, 3, 4, 5, 6, 7, 8]

// 交集
Set<Integer> intersection = new HashSet<>(set1);
intersection.retainAll(set2);
System.out.println(intersection);  // [4, 5]

// 差集（set1 - set2）
Set<Integer> difference = new HashSet<>(set1);
difference.removeAll(set2);
System.out.println(difference);  // [1, 2, 3]

// 判断是否有交集
boolean hasCommon = !Collections.disjoint(set1, set2);  // true
```

***

## 三、LinkedHashSet 集合

### 1. LinkedHashSet 特点

| 特点       | 说明                       |
| -------- | ------------------------ |
| **底层结构** | 哈希表 + 双向链表               |
| **有序**   | 保证存取顺序一致                 |
| **不重复**  | 依赖 hashCode() 和 equals() |
| **效率**   | 略低于 HashSet              |

### 2. 基本使用

```java
import java.util.LinkedHashSet;
import java.util.Set;

public class LinkedHashSetDemo {
    public static void main(String[] args) {
        Set<String> set = new LinkedHashSet<>();
        
        set.add("张三");
        set.add("李四");
        set.add("王五");
        
        // 遍历顺序与添加顺序一致
        System.out.println(set);  // [张三, 李四, 王五]
    }
}
```

### 3. 底层结构

    LinkedHashSet = 哈希表 + 双向链表

    哈希表保证：不重复
    双向链表保证：有序（按插入顺序）

    ┌───────────────────────────────────────┐
    │           哈希表（数组）                │
    │  ┌───┬───┬───┬───┬───┬───┬───┬───┐   │
    │  │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │   │
    │  └───┴───┴───┴───┴───┴───┴───┴───┘   │
    └───────────────────────────────────────┘
                        +
    ┌───────────────────────────────────────┐
    │            双向链表                     │
    │   [张三] ←→ [李四] ←→ [王五]            │
    │   head                    tail        │
    └───────────────────────────────────────┘

***

## 四、TreeSet 集合

### 1. TreeSet 特点

| 特点           | 说明                          |
| ------------ | --------------------------- |
| **底层结构**     | 红黑树（自平衡二叉搜索树）               |
| **有序**       | 元素按照自然顺序或比较器排序              |
| **不重复**      | 依赖 compareTo() 或 Comparator |
| **不允许 null** | 不能存储 null 值                 |

### 2. 基本使用

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
        
        // 自动排序
        System.out.println(set);  // [1, 3, 5, 8]
    }
}
```

### 3. 自然排序（Comparable）

```java
// 方式一：让元素类实现 Comparable 接口
public class Student implements Comparable<Student> {
    private String name;
    private int age;
    
    @Override
    public int compareTo(Student o) {
        // 按年龄升序排序
        int result = this.age - o.age;
        // 年龄相同时按姓名排序（保证唯一性）
        return result == 0 ? this.name.compareTo(o.name) : result;
    }
}

// 使用
Set<Student> set = new TreeSet<>();
set.add(new Student("张三", 18));
set.add(new Student("李四", 20));
set.add(new Student("王五", 18));
// 结果按年龄排序
```

### 4. 比较器排序（Comparator）

```java
// 方式二：创建 TreeSet 时传入 Comparator
Set<Student> set = new TreeSet<>((s1, s2) -> {
    // 按年龄降序排序
    int result = s2.getAge() - s1.getAge();
    return result == 0 ? s1.getName().compareTo(s2.getName()) : result;
});

set.add(new Student("张三", 18));
set.add(new Student("李四", 20));
set.add(new Student("王五", 18));
// 结果按年龄降序排序

// 使用 Comparator 静态方法
Set<Student> set2 = new TreeSet<>(
    Comparator.comparingInt(Student::getAge)
              .thenComparing(Student::getName)
);
```

### 5. 导航方法

```java
TreeSet<Integer> set = new TreeSet<>();
set.addAll(Arrays.asList(1, 3, 5, 7, 9));

// 获取第一个和最后一个元素
Integer first = set.first();  // 1
Integer last = set.last();    // 9

// 获取并移除第一个和最后一个元素
Integer pollFirst = set.pollFirst();  // 1（并从集合中移除）
Integer pollLast = set.pollLast();    // 9（并从集合中移除）

// ceiling：大于等于指定元素的最小元素
Integer ceiling = set.ceiling(4);  // 5

// floor：小于等于指定元素的最大元素
Integer floor = set.floor(4);  // 3

// higher：大于指定元素的最小元素
Integer higher = set.higher(5);  // 7

// lower：小于指定元素的最大元素
Integer lower = set.lower(5);  // 3
```

### 6. 范围视图

```java
TreeSet<Integer> set = new TreeSet<>();
set.addAll(Arrays.asList(1, 3, 5, 7, 9, 11, 13, 15));

// headSet：小于指定元素的所有元素
SortedSet<Integer> head = set.headSet(9);  // [1, 3, 5, 7]

// tailSet：大于等于指定元素的所有元素
SortedSet<Integer> tail = set.tailSet(9);  // [9, 11, 13, 15]

// subSet：范围 [from, to)
SortedSet<Integer> sub = set.subSet(5, 11);  // [5, 7, 9]

// NavigableSet 版本：可以指定是否包含边界
NavigableSet<Integer> sub2 = set.subSet(5, true, 11, true);  // [5, 7, 9, 11]

// 降序视图
NavigableSet<Integer> descending = set.descendingSet();  // [15, 13, 11, 9, 7, 5, 3, 1]
```

### 7. 红黑树结构

    红黑树是一种自平衡二叉搜索树

    特点：
    ├─ 左子节点 < 父节点 < 右子节点
    ├─ 查找效率 O(log n)
    └─ 插入/删除后自动平衡

    示例：存储 [5, 3, 8, 1, 4]

            5（根）
           / \
          3   8
         / \
        1   4

***

## 五、Set 实现类对比

| 对比项         | HashSet           | LinkedHashSet     | TreeSet                |
| ----------- | ----------------- | ----------------- | ---------------------- |
| **底层结构**    | 哈希表               | 哈希表 + 双向链表        | 红黑树                    |
| **有序性**     | 无序                | 有序（插入顺序）          | 有序（排序顺序）               |
| **去重依赖**    | hashCode + equals | hashCode + equals | compareTo 或 Comparator |
| **允许 null** | 允许一个              | 允许一个              | 不允许                    |
| **效率**      | O(1)              | O(1)              | O(log n)               |
| **使用场景**    | 去重，不关心顺序          | 去重，保持插入顺序         | 去重，需要排序                |

***

## 六、Collections 工具类

### 1. 什么是 Collections

**Collections** 是操作集合的工具类，提供了一系列静态方法。

**注意区分**：

*   `Collection`：集合接口（单列集合的顶层接口）
*   `Collections`：工具类（操作集合的工具）

### 2. 排序和查找方法

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsDemo {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        
        // ========== 批量添加 ==========
        Collections.addAll(list, 5, 3, 8, 1, 9, 2);
        System.out.println(list);  // [5, 3, 8, 1, 9, 2]
        
        // ========== 排序 ==========
        Collections.sort(list);
        System.out.println(list);  // [1, 2, 3, 5, 8, 9]
        
        // 降序排序
        Collections.sort(list, Collections.reverseOrder());
        System.out.println(list);  // [9, 8, 5, 3, 2, 1]
        
        // 自定义排序
        Collections.sort(list, (a, b) -> b - a);
        
        // ========== 反转 ==========
        Collections.reverse(list);
        System.out.println(list);  // [1, 2, 3, 5, 8, 9]
        
        // ========== 随机打乱 ==========
        Collections.shuffle(list);
        System.out.println(list);  // [随机顺序]
        
        // ========== 最大最小值 ==========
        Collections.sort(list);  // 先排序
        System.out.println(Collections.max(list));  // 9
        System.out.println(Collections.min(list));  // 1
        
        // ========== 二分查找（需要先排序）==========
        int index = Collections.binarySearch(list, 5);
        System.out.println(index);  // 返回索引
        
        // ========== 交换 ==========
        Collections.swap(list, 0, 1);  // 交换索引0和1的元素
        
        // ========== 旋转 ==========
        Collections.rotate(list, 2);  // 向右旋转2个位置
    }
}
```

### 3. 填充和复制方法

```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));

// 填充：用指定元素替换所有元素
Collections.fill(list, "X");
System.out.println(list);  // [X, X, X, X, X]

// 复制：将 src 复制到 dest（dest 大小必须 >= src）
List<String> src = Arrays.asList("1", "2", "3");
List<String> dest = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
Collections.copy(dest, src);
System.out.println(dest);  // [1, 2, 3, D, E]

// n 个相同元素的 List
List<String> repeated = Collections.nCopies(5, "Hello");
System.out.println(repeated);  // [Hello, Hello, Hello, Hello, Hello]
```

### 4. 统计和判断方法

```java
List<String> list = Arrays.asList("A", "B", "A", "C", "A", "B");

// frequency：统计元素出现次数
int count = Collections.frequency(list, "A");
System.out.println(count);  // 3

// disjoint：判断两个集合是否没有交集
List<String> list1 = Arrays.asList("A", "B", "C");
List<String> list2 = Arrays.asList("D", "E", "F");
List<String> list3 = Arrays.asList("C", "D", "E");

boolean noCommon1 = Collections.disjoint(list1, list2);  // true（没有交集）
boolean noCommon2 = Collections.disjoint(list1, list3);  // false（有交集）
```

### 5. 创建不可变集合

```java
// 创建不可变集合（包装现有集合）
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));
List<String> unmodifiable = Collections.unmodifiableList(list);
// unmodifiable.add("D");  // ❌ 抛出 UnsupportedOperationException

Set<String> unmodifiableSet = Collections.unmodifiableSet(new HashSet<>(list));
Map<String, Integer> unmodifiableMap = Collections.unmodifiableMap(new HashMap<>());

// 创建空集合
List<String> emptyList = Collections.emptyList();
Set<String> emptySet = Collections.emptySet();
Map<String, String> emptyMap = Collections.emptyMap();

// 创建单元素集合
List<String> singleList = Collections.singletonList("A");
Set<String> singleSet = Collections.singleton("A");
Map<String, Integer> singleMap = Collections.singletonMap("key", 100);
```

### 6. 创建线程安全集合

```java
// 将普通集合包装为线程安全集合
List<String> list = new ArrayList<>();
List<String> syncList = Collections.synchronizedList(list);

Set<String> set = new HashSet<>();
Set<String> syncSet = Collections.synchronizedSet(set);

Map<String, Integer> map = new HashMap<>();
Map<String, Integer> syncMap = Collections.synchronizedMap(map);

// 注意：遍历时仍需要手动同步
synchronized (syncList) {
    for (String s : syncList) {
        System.out.println(s);
    }
}
```

### 7. JDK 9+ 不可变集合工厂方法

```java
// Set.of()：创建不可变 Set
Set<String> set = Set.of("A", "B", "C");
// set.add("D");  // ❌ UnsupportedOperationException

// List.of()：创建不可变 List
List<String> list = List.of("A", "B", "C");

// Map.of()：创建不可变 Map（最多 10 个键值对）
Map<String, Integer> map = Map.of("A", 1, "B", 2, "C", 3);

// Map.ofEntries()：创建不可变 Map（超过 10 个键值对）
Map<String, Integer> map2 = Map.ofEntries(
    Map.entry("A", 1),
    Map.entry("B", 2),
    Map.entry("C", 3)
);

// JDK 10+：复制为不可变集合
List<String> copy = List.copyOf(originalList);
Set<String> setCopy = Set.copyOf(originalSet);
Map<String, Integer> mapCopy = Map.copyOf(originalMap);
```

***

## 七、Map 集合介绍

### 1. Map 接口特点

| 特点       | 说明                  |
| -------- | ------------------- |
| **双列集合** | 存储键值对（Key-Value）    |
| **键不重复** | Key 不能重复，Value 可以重复 |
| **键值对应** | 一个 Key 对应一个 Value   |

### 2. Map 结构图

    Map<Key, Value>

    ┌─────────────────────────────────────┐
    │  Key(键)    │    Value(值)          │
    ├─────────────────────────────────────┤
    │  "name"     │    "张三"             │
    │  "age"      │    18                 │
    │  "gender"   │    "男"               │
    └─────────────────────────────────────┘

    Key 不能重复，Value 可以重复

### 3. Map 常用方法

| 方法                            | 说明                   |
| ----------------------------- | -------------------- |
| `put(K key, V value)`         | 添加/修改键值对             |
| `remove(Object key)`          | 根据键删除键值对             |
| `get(Object key)`             | 根据键获取值               |
| `containsKey(Object key)`     | 是否包含指定键              |
| `containsValue(Object value)` | 是否包含指定值              |
| `size()`                      | 获取键值对数量              |
| `isEmpty()`                   | 是否为空                 |
| `clear()`                     | 清空                   |
| `keySet()`                    | 获取所有键的 Set 集合        |
| `values()`                    | 获取所有值的 Collection 集合 |
| `entrySet()`                  | 获取所有键值对的 Set 集合      |

### 4. 基本使用

```java
import java.util.HashMap;
import java.util.Map;

public class MapDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        
        // ========== 添加 ==========
        map.put("张三", 18);
        map.put("李四", 20);
        map.put("王五", 22);
        System.out.println(map);  // {李四=20, 张三=18, 王五=22}
        
        // 键重复时，值会被覆盖，返回旧值
        Integer oldValue = map.put("张三", 25);
        System.out.println(oldValue);  // 18
        System.out.println(map.get("张三"));  // 25
        
        // ========== 删除 ==========
        map.remove("李四");
        
        // 只有键值都匹配才删除
        map.remove("张三", 25);  // 删除成功
        map.remove("王五", 100);  // 删除失败（值不匹配）
        
        // ========== 查询 ==========
        Integer age = map.get("张三");  // 25（不存在返回 null）
        boolean hasKey = map.containsKey("张三");  // true
        boolean hasValue = map.containsValue(25);  // true
        
        // ========== 获取所有键/值 ==========
        Set<String> keys = map.keySet();
        Collection<Integer> values = map.values();
    }
}
```

***

## 八、Map JDK 8+ 新方法

### 1. getOrDefault：获取值或默认值

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);

// 键存在，返回对应的值
Integer age1 = map.getOrDefault("张三", 0);  // 18

// 键不存在，返回默认值
Integer age2 = map.getOrDefault("李四", 0);  // 0
```

### 2. putIfAbsent：不存在时才添加

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);

// 键不存在，添加并返回 null
Integer result1 = map.putIfAbsent("李四", 20);  // null
System.out.println(map);  // {张三=18, 李四=20}

// 键已存在，不添加，返回原值
Integer result2 = map.putIfAbsent("张三", 25);  // 18
System.out.println(map.get("张三"));  // 仍然是 18
```

### 3. computeIfAbsent：不存在时计算并添加

```java
Map<String, List<String>> map = new HashMap<>();

// 传统写法
if (!map.containsKey("fruits")) {
    map.put("fruits", new ArrayList<>());
}
map.get("fruits").add("apple");

// computeIfAbsent 写法
map.computeIfAbsent("fruits", k -> new ArrayList<>()).add("apple");
map.computeIfAbsent("fruits", k -> new ArrayList<>()).add("banana");
System.out.println(map);  // {fruits=[apple, banana]}

// 常见用途：分组统计
Map<String, Integer> wordCount = new HashMap<>();
for (String word : words) {
    wordCount.computeIfAbsent(word, k -> 0);
    wordCount.put(word, wordCount.get(word) + 1);
}
```

### 4. computeIfPresent：存在时计算并更新

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);

// 键存在，计算新值
map.computeIfPresent("张三", (k, v) -> v + 1);
System.out.println(map.get("张三"));  // 19

// 键不存在，不操作
map.computeIfPresent("李四", (k, v) -> v + 1);
System.out.println(map.get("李四"));  // null
```

### 5. compute：计算并更新（无论是否存在）

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);

// 键存在
map.compute("张三", (k, v) -> v == null ? 1 : v + 1);
System.out.println(map.get("张三"));  // 19

// 键不存在
map.compute("李四", (k, v) -> v == null ? 1 : v + 1);
System.out.println(map.get("李四"));  // 1

// 统计单词出现次数
Map<String, Integer> wordCount = new HashMap<>();
for (String word : words) {
    wordCount.compute(word, (k, v) -> v == null ? 1 : v + 1);
}
```

### 6. merge：合并值

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);

// 键存在，合并值
map.merge("张三", 10, Integer::sum);  // 18 + 10 = 28

// 键不存在，直接放入
map.merge("李四", 20, Integer::sum);  // 20

System.out.println(map);  // {张三=28, 李四=20}

// 常见用途：统计单词出现次数
Map<String, Integer> wordCount = new HashMap<>();
for (String word : words) {
    wordCount.merge(word, 1, Integer::sum);
}

// 字符串拼接
Map<String, String> map2 = new HashMap<>();
map2.merge("key", "Hello", (old, newVal) -> old + " " + newVal);
map2.merge("key", "World", (old, newVal) -> old + " " + newVal);
System.out.println(map2.get("key"));  // Hello World
```

### 7. replace 方法

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);

// replace：替换（键存在才替换）
map.replace("张三", 25);
System.out.println(map.get("张三"));  // 25

map.replace("李四", 20);  // 不存在，不操作
System.out.println(map.get("李四"));  // null

// replace：只有旧值匹配才替换
boolean success = map.replace("张三", 25, 30);  // true
boolean fail = map.replace("张三", 100, 200);  // false（旧值不匹配）

// replaceAll：替换所有值
map.replaceAll((k, v) -> v + 10);  // 所有值加 10
```

### 8. forEach 遍历

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);
map.put("李四", 20);

// forEach 遍历
map.forEach((key, value) -> {
    System.out.println(key + " = " + value);
});
```

***

## 九、Map 集合三种遍历方式

### 1. 方式一：keySet() 遍历

```java
Map<String, Integer> map = new HashMap<>();
map.put("张三", 18);
map.put("李四", 20);
map.put("王五", 22);

// 获取所有键，再根据键获取值
Set<String> keys = map.keySet();
for (String key : keys) {
    Integer value = map.get(key);
    System.out.println(key + " = " + value);
}
```

### 2. 方式二：entrySet() 遍历（推荐）

```java
// 获取所有键值对对象（Entry）
Set<Map.Entry<String, Integer>> entries = map.entrySet();
for (Map.Entry<String, Integer> entry : entries) {
    String key = entry.getKey();
    Integer value = entry.getValue();
    System.out.println(key + " = " + value);
}
```

### 3. 方式三：forEach() 遍历（Java 8+）

```java
// Lambda 表达式
map.forEach((key, value) -> {
    System.out.println(key + " = " + value);
});

// 简化写法
map.forEach((k, v) -> System.out.println(k + " = " + v));
```

### 4. 三种方式对比

| 方式           | 优点          | 缺点          | 推荐程度  |
| ------------ | ----------- | ----------- | ----- |
| **keySet**   | 代码简单        | 需要二次查找（效率低） | ⭐⭐⭐   |
| **entrySet** | 效率高，一次获取键和值 | 代码稍复杂       | ⭐⭐⭐⭐⭐ |
| **forEach**  | 代码最简洁       | 需要 Java 8+  | ⭐⭐⭐⭐⭐ |

***

## 十、Map 集合的实现类

### 1. HashMap

#### 1.1 特点

| 特点          | 说明                       |
| ----------- | ------------------------ |
| **底层结构**    | 哈希表（数组 + 链表 + 红黑树）       |
| **无序**      | 不保证存取顺序                  |
| **键不重复**    | 依赖 hashCode() 和 equals() |
| **允许 null** | 键和值都可以为 null             |
| **线程不安全**   | 多线程需要同步                  |

#### 1.2 初始容量和负载因子

```java
// 默认初始容量：16
// 默认负载因子：0.75

// 指定初始容量（避免频繁扩容）
// 建议：预估元素数量 / 负载因子 + 1
Map<String, Integer> map = new HashMap<>(64);

// 指定初始容量和负载因子
Map<String, Integer> map2 = new HashMap<>(64, 0.75f);
```

#### 1.3 自定义对象作为键

```java
// 自定义对象作为键，必须重写 hashCode 和 equals
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

// 使用
Map<Student, String> map = new HashMap<>();
map.put(new Student("张三", 18), "北京");
map.put(new Student("张三", 18), "上海");  // 键重复，值被覆盖
System.out.println(map.size());  // 1
```

***

### 2. LinkedHashMap

#### 2.1 特点

| 特点       | 说明                       |
| -------- | ------------------------ |
| **底层结构** | 哈希表 + 双向链表               |
| **有序**   | 保证存取顺序一致                 |
| **键不重复** | 依赖 hashCode() 和 equals() |

#### 2.2 基本使用

```java
Map<String, Integer> map = new LinkedHashMap<>();
map.put("张三", 18);
map.put("李四", 20);
map.put("王五", 22);

// 遍历顺序与添加顺序一致
map.forEach((k, v) -> System.out.println(k + " = " + v));
// 张三 = 18
// 李四 = 20
// 王五 = 22
```

#### 2.3 访问顺序模式

```java
// 默认：插入顺序
Map<String, Integer> map1 = new LinkedHashMap<>();

// 访问顺序：最近访问的排在最后（可用于实现 LRU 缓存）
Map<String, Integer> map2 = new LinkedHashMap<>(16, 0.75f, true);
map2.put("A", 1);
map2.put("B", 2);
map2.put("C", 3);

map2.get("A");  // 访问 A
System.out.println(map2.keySet());  // [B, C, A]（A 移到最后）
```

***

### 3. TreeMap

#### 3.1 特点

| 特点             | 说明                          |
| -------------- | --------------------------- |
| **底层结构**       | 红黑树                         |
| **有序**         | 按键排序                        |
| **键不重复**       | 依赖 compareTo() 或 Comparator |
| **不允许 null 键** | 键不能为 null                   |

#### 3.2 基本使用

```java
// 自然排序（键必须实现 Comparable）
Map<Integer, String> map = new TreeMap<>();
map.put(3, "三");
map.put(1, "一");
map.put(2, "二");

System.out.println(map);  // {1=一, 2=二, 3=三}（按键排序）
```

#### 3.3 自定义排序

```java
// 比较器排序
Map<String, Integer> map = new TreeMap<>((s1, s2) -> {
    // 按字符串长度排序
    int result = s1.length() - s2.length();
    return result == 0 ? s1.compareTo(s2) : result;
});

map.put("abc", 1);
map.put("ab", 2);
map.put("abcd", 3);
// 结果：{ab=2, abc=1, abcd=3}
```

#### 3.4 导航方法

```java
TreeMap<Integer, String> map = new TreeMap<>();
map.put(1, "一");
map.put(3, "三");
map.put(5, "五");
map.put(7, "七");
map.put(9, "九");

// 获取第一个和最后一个
Map.Entry<Integer, String> first = map.firstEntry();  // 1=一
Map.Entry<Integer, String> last = map.lastEntry();    // 9=九

// ceiling / floor / higher / lower
Map.Entry<Integer, String> ceiling = map.ceilingEntry(4);  // 5=五（>=4的最小）
Map.Entry<Integer, String> floor = map.floorEntry(4);      // 3=三（<=4的最大）
Map.Entry<Integer, String> higher = map.higherEntry(5);    // 7=七（>5的最小）
Map.Entry<Integer, String> lower = map.lowerEntry(5);      // 3=三（<5的最大）

// 范围视图
SortedMap<Integer, String> head = map.headMap(5);   // {1=一, 3=三}
SortedMap<Integer, String> tail = map.tailMap(5);   // {5=五, 7=七, 9=九}
SortedMap<Integer, String> sub = map.subMap(3, 7);  // {3=三, 5=五}
```

***

### 4. Hashtable（了解）

| 特点           | 说明                     |
| ------------ | ---------------------- |
| **线程安全**     | 所有方法都是同步的              |
| **效率低**      | 因为同步，效率比 HashMap 低     |
| **不允许 null** | 键和值都不能为 null           |
| **已过时**      | 推荐使用 ConcurrentHashMap |

```java
Map<String, Integer> map = new Hashtable<>();
// map.put(null, 100);  // ❌ 抛出 NullPointerException
// map.put("a", null);  // ❌ 抛出 NullPointerException
```

***

### 5. ConcurrentHashMap（简介）

```java
import java.util.concurrent.ConcurrentHashMap;

// 线程安全的 HashMap 替代品
Map<String, Integer> map = new ConcurrentHashMap<>();
map.put("张三", 18);
map.put("李四", 20);

// 特点：
// - 线程安全
// - 效率高（分段锁/CAS）
// - 不允许 null 键和 null 值
```

***

### 6. Map 实现类对比

| 对比项        | HashMap | LinkedHashMap | TreeMap  | Hashtable | ConcurrentHashMap |
| ---------- | ------- | ------------- | -------- | --------- | ----------------- |
| **底层结构**   | 哈希表     | 哈希表 + 链表      | 红黑树      | 哈希表       | 哈希表               |
| **有序性**    | 无序      | 有序（插入顺序）      | 有序（排序顺序） | 无序        | 无序                |
| **null 键** | 允许一个    | 允许一个          | 不允许      | 不允许       | 不允许               |
| **null 值** | 允许      | 允许            | 允许       | 不允许       | 不允许               |
| **线程安全**   | 不安全     | 不安全           | 不安全      | 安全        | 安全                |
| **效率**     | 高       | 较高            | O(log n) | 低         | 高                 |

***

## 十一、知识点速查表

### Set 方法

| 方法             | 说明       |
| -------------- | -------- |
| `add(e)`       | 添加元素     |
| `remove(o)`    | 删除元素     |
| `contains(o)`  | 是否包含     |
| `size()`       | 元素个数     |
| `isEmpty()`    | 是否为空     |
| `addAll(c)`    | 添加集合（并集） |
| `retainAll(c)` | 保留交集     |
| `removeAll(c)` | 删除交集（差集） |

### TreeSet 导航方法

| 方法           | 说明         |
| ------------ | ---------- |
| `first()`    | 第一个元素      |
| `last()`     | 最后一个元素     |
| `ceiling(e)` | >= e 的最小元素 |
| `floor(e)`   | <= e 的最大元素 |
| `higher(e)`  | > e 的最小元素  |
| `lower(e)`   | < e 的最大元素  |

### Map 方法

| 方法                         | 说明       |
| -------------------------- | -------- |
| `put(k, v)`                | 添加/修改    |
| `get(k)`                   | 获取值      |
| `remove(k)`                | 删除       |
| `containsKey(k)`           | 是否包含键    |
| `keySet()`                 | 获取所有键    |
| `values()`                 | 获取所有值    |
| `entrySet()`               | 获取所有键值对  |
| `getOrDefault(k, default)` | 获取值或默认值  |
| `putIfAbsent(k, v)`        | 不存在时添加   |
| `computeIfAbsent(k, func)` | 不存在时计算添加 |
| `merge(k, v, func)`        | 合并值      |

### 选择指南

| 场景         | 推荐                |
| ---------- | ----------------- |
| 去重，不关心顺序   | HashSet           |
| 去重，保持插入顺序  | LinkedHashSet     |
| 去重，需要排序    | TreeSet           |
| 键值对，不关心顺序  | HashMap           |
| 键值对，保持插入顺序 | LinkedHashMap     |
| 键值对，需要按键排序 | TreeMap           |
| 键值对，线程安全   | ConcurrentHashMap |

