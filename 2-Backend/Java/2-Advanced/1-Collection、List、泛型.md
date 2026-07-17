## 一、集合体系结构介绍

### 1. 为什么需要集合

| 问题   | 数组的局限性       | 集合的解决方案      |
| ---- | ------------ | ------------ |
| 长度固定 | 创建后无法改变      | 自动扩容         |
| 类型单一 | 只能存储同类型      | 可存储不同类型（不推荐） |
| 功能有限 | 只有 length 属性 | 提供丰富的方法      |

### 2. 集合体系结构图

                                Iterable（可迭代）
                                      │
                                 Collection（单列集合）
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
              List                   Set                  Queue
           (有序可重复)             (不重复)              (队列)
                │                     │                     │
        ┌───────┼───────┐     ┌───────┼───────┐           Deque
        │       │       │     │       │       │          (双端队列)
    ArrayList  │    Vector  HashSet TreeSet LinkedHashSet   │
            LinkedList                                   ArrayDeque
               (栈)                                     LinkedList


                                 Map（双列集合）
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
             HashMap              TreeMap            LinkedHashMap
             (无序)               (排序)              (插入顺序)
                │
           Hashtable（线程安全，已过时）

### 3. Collection vs Map

| 对比     | Collection        | Map          |
| ------ | ----------------- | ------------ |
| **结构** | 单列集合              | 双列集合（键值对）    |
| **元素** | 单个对象              | Key-Value 对  |
| **重复** | List 可重复，Set 不可重复 | Key 不可重复     |
| **继承** | 继承 Iterable       | 不继承 Iterable |

### 4. 接口与实现类关系

```java
// Collection 是接口，不能直接实例化
Collection<String> c1 = new ArrayList<>();   // ✅ 多态
Collection<String> c2 = new HashSet<>();     // ✅ 多态

// List 是接口
List<String> list = new ArrayList<>();       // ✅ 多态

// Set 是接口
Set<String> set = new HashSet<>();           // ✅ 多态

// Queue/Deque 是接口
Queue<String> queue = new LinkedList<>();    // ✅
Deque<String> deque = new ArrayDeque<>();    // ✅
```

***

## 二、Collection 的使用

### 1. Collection 接口常用方法

| 方法                   | 说明                  | 返回值       |
| -------------------- | ------------------- | --------- |
| `add(E e)`           | 添加元素                | boolean   |
| `remove(Object o)`   | 删除指定元素              | boolean   |
| `clear()`            | 清空集合                | void      |
| `contains(Object o)` | 是否包含指定元素            | boolean   |
| `isEmpty()`          | 是否为空                | boolean   |
| `size()`             | 获取元素个数              | int       |
| `toArray()`          | 转换为数组               | Object\[] |
| `stream()`           | 获取 Stream 流（JDK 8+） | Stream    |

### 2. 代码示例

```java
import java.util.ArrayList;
import java.util.Collection;

public class CollectionDemo {
    public static void main(String[] args) {
        // 创建 Collection 对象（多态）
        Collection<String> c = new ArrayList<>();
        
        // ========== 添加 ==========
        c.add("张三");
        c.add("李四");
        c.add("王五");
        System.out.println(c);  // [张三, 李四, 王五]
        
        // ========== 删除 ==========
        boolean removed = c.remove("李四");
        System.out.println(removed);  // true
        System.out.println(c);        // [张三, 王五]
        
        // ========== 判断 ==========
        System.out.println(c.contains("张三"));  // true
        System.out.println(c.isEmpty());         // false
        System.out.println(c.size());            // 2
        
        // ========== 转换为数组 ==========
        Object[] arr1 = c.toArray();
        String[] arr2 = c.toArray(new String[0]);  // 推荐写法
        
        // ========== 获取 Stream 流（JDK 8+）==========
        c.stream()
            .filter(s -> s.startsWith("张"))
            .forEach(System.out::println);
        
        // ========== 清空 ==========
        c.clear();
        System.out.println(c);         // []
        System.out.println(c.isEmpty()); // true
    }
}
```

### 3. 集合间操作

| 方法                          | 说明             |
| --------------------------- | -------------- |
| `addAll(Collection c)`      | 添加另一个集合的所有元素   |
| `removeAll(Collection c)`   | 删除两个集合的交集      |
| `retainAll(Collection c)`   | 只保留交集          |
| `containsAll(Collection c)` | 是否包含另一个集合的所有元素 |
| `removeIf(Predicate)`       | 按条件删除（JDK 8+）  |

```java
Collection<String> c1 = new ArrayList<>();
c1.add("A");
c1.add("B");
c1.add("C");

Collection<String> c2 = new ArrayList<>();
c2.add("B");
c2.add("C");
c2.add("D");

// addAll：添加所有
c1.addAll(c2);
System.out.println(c1);  // [A, B, C, B, C, D]

// removeAll：删除交集
c1.removeAll(c2);
System.out.println(c1);  // [A]

// retainAll：只保留交集
// c1.retainAll(c2);  // 只保留 B, C

// removeIf：按条件删除（JDK 8+）
Collection<Integer> nums = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
nums.removeIf(n -> n % 2 == 0);  // 删除偶数
System.out.println(nums);  // [1, 3, 5]
```

***

## 三、集合的通用遍历方式

### 1. 四种遍历方式对比

| 方式                 | 适用范围          | 特点          | 版本      |
| ------------------ | ------------- | ----------- | ------- |
| **迭代器**            | 所有 Collection | 遍历时可删除元素    | JDK 1.2 |
| **增强 for**         | 所有 Collection | 简洁，底层也是迭代器  | JDK 5   |
| **Lambda forEach** | 所有 Collection | 最简洁         | JDK 8   |
| **Stream**         | 所有 Collection | 功能强大，支持过滤映射 | JDK 8   |

### 2. 迭代器遍历（Iterator）

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
        
        // 获取迭代器
        Iterator<String> it = c.iterator();
        
        // 遍历
        while (it.hasNext()) {
            String s = it.next();
            System.out.println(s);
        }
    }
}
```

#### 迭代器方法

| 方法                           | 说明            | 版本      |
| ---------------------------- | ------------- | ------- |
| `hasNext()`                  | 是否有下一个元素      | JDK 1.2 |
| `next()`                     | 获取下一个元素       | JDK 1.2 |
| `remove()`                   | 删除当前元素（遍历时删除） | JDK 1.2 |
| `forEachRemaining(Consumer)` | 遍历剩余元素        | JDK 8   |

```java
// forEachRemaining：遍历剩余元素（JDK 8+）
Iterator<String> it = c.iterator();
it.next();  // 跳过第一个
it.forEachRemaining(System.out::println);  // 遍历剩余
```

#### 遍历时删除（重要）

```java
Collection<String> c = new ArrayList<>();
c.add("张三");
c.add("李四");
c.add("李四");
c.add("王五");

// ❌ 错误：增强 for 中删除会报错
for (String s : c) {
    if ("李四".equals(s)) {
        c.remove(s);  // ConcurrentModificationException
    }
}

// ✅ 正确方式一：使用迭代器删除
Iterator<String> it = c.iterator();
while (it.hasNext()) {
    String s = it.next();
    if ("李四".equals(s)) {
        it.remove();  // 使用迭代器的 remove
    }
}
System.out.println(c);  // [张三, 王五]

// ✅ 正确方式二：使用 removeIf（JDK 8+，推荐）
c.removeIf(s -> "李四".equals(s));
```

### 3. 增强 for 遍历

```java
Collection<String> c = new ArrayList<>();
c.add("张三");
c.add("李四");
c.add("王五");

// 增强 for（底层是迭代器）
for (String s : c) {
    System.out.println(s);
}
```

**注意**：增强 for 遍历时不能修改集合结构（增删）

### 4. Lambda forEach 遍历（Java 8+）

```java
Collection<String> c = new ArrayList<>();
c.add("张三");
c.add("李四");
c.add("王五");

// 方式一：Lambda 表达式
c.forEach(s -> System.out.println(s));

// 方式二：方法引用（更简洁）
c.forEach(System.out::println);

// 方式三：带索引遍历（需要转为 List）
List<String> list = new ArrayList<>(c);
for (int i = 0; i < list.size(); i++) {
    System.out.println(i + ": " + list.get(i));
}
```

***

## 四、方法引用（Method Reference）

### 1. 什么是方法引用

**方法引用**是 Lambda 表达式的简写形式，当 Lambda 体只是调用一个已存在的方法时，可以用方法引用替代。

```java
// Lambda 表达式
list.forEach(s -> System.out.println(s));

// 方法引用（等价）
list.forEach(System.out::println);
```

### 2. 方法引用的四种形式

| 形式           | 语法                    | Lambda 等价形式                  |
| ------------ | --------------------- | ---------------------------- |
| **对象::实例方法** | `obj::method`         | `x -> obj.method(x)`         |
| **类::静态方法**  | `Class::staticMethod` | `x -> Class.staticMethod(x)` |
| **类::实例方法**  | `Class::method`       | `(obj, x) -> obj.method(x)`  |
| **类::new**   | `Class::new`          | `() -> new Class()`          |

### 3. 代码示例

#### 3.1 对象::实例方法

```java
// Lambda
list.forEach(s -> System.out.println(s));

// 方法引用
list.forEach(System.out::println);
```

#### 3.2 类::静态方法

```java
// Lambda
list.stream().map(s -> Integer.parseInt(s));

// 方法引用
list.stream().map(Integer::parseInt);
```

#### 3.3 类::实例方法

```java
// Lambda
list.stream().map(s -> s.toUpperCase());

// 方法引用
list.stream().map(String::toUpperCase);

// 两个参数的情况
// Lambda
list.sort((s1, s2) -> s1.compareTo(s2));

// 方法引用
list.sort(String::compareTo);
```

#### 3.4 构造方法引用

```java
// Lambda
list.stream().map(s -> new StringBuilder(s));

// 方法引用
list.stream().map(StringBuilder::new);

// 数组构造
// Lambda
list.stream().toArray(size -> new String[size]);

// 方法引用
list.stream().toArray(String[]::new);
```

### 4. 方法引用实战

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
        
        // 打印
        list.forEach(System.out::println);
        
        // 转大写
        list.stream()
            .map(String::toUpperCase)
            .forEach(System.out::println);
        
        // 字符串转数字
        List<String> nums = List.of("1", "2", "3");
        nums.stream()
            .map(Integer::parseInt)
            .forEach(System.out::println);
        
        // 排序
        list.sort(String::compareTo);
        list.sort(Comparator.comparing(String::length));
    }
}
```

***

## 五、List 接口

### 1. List 接口特点

| 特点      | 说明         |
| ------- | ---------- |
| **有序**  | 元素按插入顺序存储  |
| **可重复** | 允许存储重复元素   |
| **有索引** | 可以通过索引访问元素 |

### 2. List 特有方法（索引操作）

| 方法                          | 说明                | 版本      |
| --------------------------- | ----------------- | ------- |
| `add(int index, E e)`       | 在指定位置插入元素         | JDK 1.2 |
| `remove(int index)`         | 删除指定位置的元素         | JDK 1.2 |
| `set(int index, E e)`       | 修改指定位置的元素         | JDK 1.2 |
| `get(int index)`            | 获取指定位置的元素         | JDK 1.2 |
| `indexOf(Object o)`         | 查找元素首次出现的位置       | JDK 1.2 |
| `lastIndexOf(Object o)`     | 查找元素最后出现的位置       | JDK 1.2 |
| `subList(int from, int to)` | 截取子列表 \[from, to) | JDK 1.2 |
| `sort(Comparator)`          | 排序                | JDK 8   |
| `replaceAll(UnaryOperator)` | 替换所有元素            | JDK 8   |

### 3. 代码示例

```java
import java.util.ArrayList;
import java.util.List;

public class ListDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("A");
        list.add("B");
        list.add("C");
        
        // ========== 索引操作 ==========
        
        // 在指定位置插入
        list.add(1, "X");
        System.out.println(list);  // [A, X, B, C]
        
        // 删除指定位置
        String removed = list.remove(1);
        System.out.println(removed);  // X
        System.out.println(list);     // [A, B, C]
        
        // 修改指定位置
        String old = list.set(0, "Z");
        System.out.println(old);   // A
        System.out.println(list);  // [Z, B, C]
        
        // 获取指定位置
        String s = list.get(0);
        System.out.println(s);  // Z
        
        // 查找位置
        list.add("B");  // [Z, B, C, B]
        System.out.println(list.indexOf("B"));      // 1
        System.out.println(list.lastIndexOf("B"));  // 3
        
        // 截取子列表（视图，修改会影响原列表）
        List<String> sub = list.subList(1, 3);
        System.out.println(sub);  // [B, C]
    }
}
```

### 4. JDK 8+ 新方法

```java
List<String> list = new ArrayList<>();
list.add("banana");
list.add("apple");
list.add("cherry");

// sort：排序（JDK 8+）
list.sort(String::compareTo);  // 自然排序
System.out.println(list);  // [apple, banana, cherry]

list.sort(Comparator.comparing(String::length));  // 按长度排序
list.sort(Comparator.reverseOrder());  // 倒序

// replaceAll：替换所有元素（JDK 8+）
list.replaceAll(String::toUpperCase);
System.out.println(list);  // [APPLE, BANANA, CHERRY]

list.replaceAll(s -> s + "!");
System.out.println(list);  // [APPLE!, BANANA!, CHERRY!]
```

### 5. JDK 9+ 工厂方法

```java
// List.of()：创建不可变 List（JDK 9+）
List<String> list = List.of("A", "B", "C");
// list.add("D");  // ❌ UnsupportedOperationException

// List.copyOf()：复制为不可变 List（JDK 10+）
List<String> copy = List.copyOf(originalList);

// Arrays.asList()：创建固定大小的 List（可修改元素，不可增删）
List<String> fixed = Arrays.asList("A", "B", "C");
fixed.set(0, "X");  // ✅ 可以修改
// fixed.add("D");  // ❌ 不可以添加

// 创建可修改的 List
List<String> modifiable = new ArrayList<>(List.of("A", "B", "C"));
modifiable.add("D");  // ✅
```

### 6. List 遍历方式（5 种）

```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
list.add("C");

// 方式一：普通 for 循环（List 特有）
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}

// 方式二：增强 for 循环
for (String s : list) {
    System.out.println(s);
}

// 方式三：迭代器
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    System.out.println(it.next());
}

// 方式四：Lambda forEach
list.forEach(System.out::println);

// 方式五：Stream
list.stream().forEach(System.out::println);
```

### 7. ListIterator（List 专用迭代器）

```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
list.add("C");

// ListIterator 可以双向遍历
ListIterator<String> it = list.listIterator();

// 正向遍历
while (it.hasNext()) {
    int index = it.nextIndex();
    String s = it.next();
    System.out.println(index + ": " + s);
}

// 反向遍历
while (it.hasPrevious()) {
    int index = it.previousIndex();
    String s = it.previous();
    System.out.println(index + ": " + s);
}

// 从指定位置开始
ListIterator<String> it2 = list.listIterator(1);  // 从索引1开始

// 遍历时添加/修改元素
ListIterator<String> it3 = list.listIterator();
while (it3.hasNext()) {
    String s = it3.next();
    if ("B".equals(s)) {
        it3.add("X");  // 在 B 后面添加 X
        it3.set("Y");  // ❌ 不能在 add 后立即 set
    }
}
System.out.println(list);  // [A, B, X, C]
```

***

## 六、数据结构（栈、队列、数组、链表）

### 1. 栈（Stack）

#### 特点：后进先出（LIFO - Last In First Out）

    入栈（push）        出栈（pop）
        ↓                  ↑
    ┌───────┐          ┌───────┐
    │   C   │ ← 栈顶   │       │
    ├───────┤          ├───────┤
    │   B   │          │   B   │ ← 新栈顶
    ├───────┤          ├───────┤
    │   A   │ ← 栈底   │   A   │ ← 栈底
    └───────┘          └───────┘

#### 应用场景

*   撤销操作（Ctrl+Z）
*   浏览器后退
*   方法调用栈
*   表达式求值
*   括号匹配

### 2. 队列（Queue）

#### 特点：先进先出（FIFO - First In First Out）

    入队（offer）                      出队（poll）
        ↓                                  ↓
    ┌───────┬───────┬───────┬───────┐
    │   D   │   C   │   B   │   A   │ →
    └───────┴───────┴───────┴───────┘
      队尾                       队头

#### 双端队列（Deque）

    addFirst/offerFirst              addLast/offerLast
            ↓                                ↓
        ┌───────┬───────┬───────┬───────┐
        │   A   │   B   │   C   │   D   │
        └───────┴───────┴───────┴───────┘
            ↑                                ↑
    removeFirst/pollFirst          removeLast/pollLast

#### 应用场景

*   任务排队
*   消息队列
*   打印队列
*   广度优先搜索

### 3. 数组（Array）

#### 特点

| 特点       | 说明            |
| -------- | ------------- |
| **连续内存** | 元素在内存中连续存储    |
| **随机访问** | 通过索引直接访问，O(1) |
| **增删慢**  | 需要移动元素，O(n)   |
| **查询快**  | 直接定位，O(1)     |

#### 内存结构

    地址:  1000   1004   1008   1012   1016
          ┌──────┬──────┬──────┬──────┬──────┐
          │  10  │  20  │  30  │  40  │  50  │
          └──────┴──────┴──────┴──────┴──────┘
    索引:    0      1      2      3      4

    访问 arr[2]：直接计算地址 = 1000 + 2*4 = 1008

### 4. 链表（LinkedList）

#### 特点

| 特点        | 说明          |
| --------- | ----------- |
| **非连续内存** | 元素可以分散存储    |
| **增删快**   | 只需修改指针，O(1) |
| **查询慢**   | 需要从头遍历，O(n) |
| **无索引**   | 不能随机访问      |

#### 单向链表结构

    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ data: 10 │    │ data: 20 │    │ data: 30 │
    │ next: ───┼───→│ next: ───┼───→│ next:null│
    └──────────┘    └──────────┘    └──────────┘
        head                             tail

#### 双向链表结构

           ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
           │ prev: null   │←───│ prev:        │←───│ prev:        │
           │ data: 10     │    │ data: 20     │    │ data: 30     │
           │ next:     ───┼───→│ next:     ───┼───→│ next: null   │
           └──────────────┘    └──────────────┘    └──────────────┘
               head/first                              tail/last

### 5. 红黑树（简介）

    红黑树是一种自平衡二叉搜索树，用于 TreeSet、TreeMap

    特点：
    ├─ 左子节点 < 父节点 < 右子节点
    ├─ 查找/插入/删除效率 O(log n)
    ├─ 自动平衡，不会退化成链表
    └─ 节点有红黑两种颜色

    示例：
            5（黑）
           / \
         3（红） 8（红）
         / \
      1（黑） 4（黑）

### 6. 数据结构对比

| 操作          | 数组     | 链表     | 红黑树      |
| ----------- | ------ | ------ | -------- |
| **查询（按索引）** | O(1) 快 | O(n) 慢 | -        |
| **查询（按值）**  | O(n)   | O(n)   | O(log n) |
| **头部插入**    | O(n) 慢 | O(1) 快 | O(log n) |
| **尾部插入**    | O(1)\* | O(1)   | O(log n) |
| **中间插入**    | O(n) 慢 | O(n)\* | O(log n) |
| **删除**      | O(n) 慢 | O(1)\* | O(log n) |
| **内存**      | 连续，固定  | 分散，灵活  | 分散       |

***

## 七、ArrayList 类与 LinkedList 类

### 1. ArrayList

#### 底层原理

    ArrayList 底层是 数组

    ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐
    │  A   │  B   │  C   │  D   │  E   │ null │ null │ null │ null │ null │
    └──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘
      0      1      2      3      4      5      6      7      8      9
                                 size=5                          capacity=10

#### 构造方法和容量控制

```java
// 默认初始容量：10
ArrayList<String> list1 = new ArrayList<>();

// 指定初始容量（避免频繁扩容）
ArrayList<String> list2 = new ArrayList<>(100);

// 从其他集合创建
ArrayList<String> list3 = new ArrayList<>(Arrays.asList("A", "B", "C"));

// 扩容机制：1.5 倍
// 当元素超过 10 个时，扩容为 15
// 当元素超过 15 个时，扩容为 22
// ...

// 手动扩容（避免多次扩容）
list1.ensureCapacity(1000);

// 释放多余空间
list1.trimToSize();
```

#### 特点总结

| 特点   | 说明      |
| ---- | ------- |
| 底层结构 | 数组      |
| 查询速度 | 快（O(1)） |
| 增删速度 | 慢（O(n)） |
| 线程安全 | 不安全     |
| 适用场景 | 查询多，增删少 |

### 2. LinkedList

#### 底层原理

    LinkedList 底层是 双向链表

           ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    null←──│ prev         │←───│ prev         │←───│ prev         │
           │ data: A      │    │ data: B      │    │ data: C      │
           │ next      ───┼───→│ next      ───┼───→│ next         │──→null
           └──────────────┘    └──────────────┘    └──────────────┘
              first                                    last

#### 实现的接口

```java
// LinkedList 同时实现了 List、Deque、Queue 接口
public class LinkedList<E>
    extends AbstractSequentialList<E>
    implements List<E>, Deque<E>, Cloneable, Serializable
```

#### 特有方法（List 操作）

| 方法              | 说明     |
| --------------- | ------ |
| `addFirst(E e)` | 在头部添加  |
| `addLast(E e)`  | 在尾部添加  |
| `getFirst()`    | 获取头部元素 |
| `getLast()`     | 获取尾部元素 |
| `removeFirst()` | 删除头部元素 |
| `removeLast()`  | 删除尾部元素 |

#### 队列方法（Queue/Deque 操作）

| 方法                | 说明       | 异常处理     |
| ----------------- | -------- | -------- |
| `offer(E e)`      | 入队（尾部添加） | 返回 false |
| `poll()`          | 出队（头部删除） | 返回 null  |
| `peek()`          | 查看队头     | 返回 null  |
| `add(E e)`        | 入队       | 抛异常      |
| `remove()`        | 出队       | 抛异常      |
| `element()`       | 查看队头     | 抛异常      |
| `offerFirst/Last` | 双端入队     | 返回 false |
| `pollFirst/Last`  | 双端出队     | 返回 null  |
| `peekFirst/Last`  | 双端查看     | 返回 null  |

#### 栈方法

| 方法          | 说明                 |
| ----------- | ------------------ |
| `push(E e)` | 压栈（等于 addFirst）    |
| `pop()`     | 弹栈（等于 removeFirst） |

#### 代码示例

```java
import java.util.LinkedList;

public class LinkedListDemo {
    public static void main(String[] args) {
        LinkedList<String> list = new LinkedList<>();
        
        // ========== List 操作 ==========
        list.add("B");
        list.addFirst("A");  // 头部添加
        list.addLast("C");   // 尾部添加
        System.out.println(list);  // [A, B, C]
        
        System.out.println(list.getFirst());  // A
        System.out.println(list.getLast());   // C
        
        list.removeFirst();
        list.removeLast();
        System.out.println(list);  // [B]
        
        // ========== 模拟栈（LIFO）==========
        LinkedList<String> stack = new LinkedList<>();
        stack.push("A");  // 入栈
        stack.push("B");
        stack.push("C");
        System.out.println(stack);     // [C, B, A]
        System.out.println(stack.pop()); // C（出栈）
        System.out.println(stack.pop()); // B
        
        // ========== 模拟队列（FIFO）==========
        LinkedList<String> queue = new LinkedList<>();
        queue.offer("A");  // 入队
        queue.offer("B");
        queue.offer("C");
        System.out.println(queue);     // [A, B, C]
        System.out.println(queue.poll()); // A（出队）
        System.out.println(queue.poll()); // B
        System.out.println(queue.peek()); // C（查看队头，不删除）
        
        // ========== 双端队列 ==========
        LinkedList<String> deque = new LinkedList<>();
        deque.offerFirst("B");  // 头部入队
        deque.offerFirst("A");
        deque.offerLast("C");   // 尾部入队
        System.out.println(deque);  // [A, B, C]
    }
}
```

#### 特点总结

| 特点   | 说明           |
| ---- | ------------ |
| 底层结构 | 双向链表         |
| 查询速度 | 慢（O(n)）      |
| 增删速度 | 快（O(1)）      |
| 线程安全 | 不安全          |
| 适用场景 | 增删多，查询少；栈/队列 |

### 3. ArrayList vs LinkedList

| 对比       | ArrayList | LinkedList         |
| -------- | --------- | ------------------ |
| **底层结构** | 数组        | 双向链表               |
| **随机访问** | O(1) 快    | O(n) 慢             |
| **头部增删** | O(n) 慢    | O(1) 快             |
| **尾部增删** | O(1) 快    | O(1) 快             |
| **中间增删** | O(n) 慢    | O(n)\*             |
| **内存占用** | 较少        | 较多（存储指针）           |
| **实现接口** | List      | List, Deque, Queue |
| **适用场景** | 查询多       | 增删多、栈/队列           |

**结论**：大多数场景用 **ArrayList**（查询更常见，且现代 CPU 对连续内存更友好）

### 4. Vector 和 Stack（了解）

```java
// Vector：线程安全的 ArrayList（已过时）
Vector<String> vector = new Vector<>();
vector.add("A");
// 推荐使用 Collections.synchronizedList() 或 CopyOnWriteArrayList

// Stack：继承 Vector 的栈（已过时）
Stack<String> stack = new Stack<>();
stack.push("A");
stack.pop();
// 推荐使用 Deque 接口的实现类（如 LinkedList、ArrayDeque）
Deque<String> stack2 = new LinkedList<>();
Deque<String> stack3 = new ArrayDeque<>();  // 性能更好
```

***

## 八、泛型（Generics）

### 1. 什么是泛型

**泛型**是 JDK 5 引入的特性，用于在编译时进行类型检查，避免类型转换错误。

```java
// 不使用泛型（不安全）
ArrayList list = new ArrayList();
list.add("Hello");
list.add(123);  // 可以添加任何类型
String s = (String) list.get(1);  // ❌ 运行时错误：ClassCastException

// 使用泛型（安全）
ArrayList<String> list = new ArrayList<>();
list.add("Hello");
// list.add(123);  // ❌ 编译时就报错
String s = list.get(0);  // 不需要强转
```

### 2. 泛型的好处

| 好处       | 说明                            |
| -------- | ----------------------------- |
| **类型安全** | 编译时检查类型，避免 ClassCastException |
| **避免强转** | 取出元素时不需要强制类型转换                |
| **代码复用** | 一套代码可以处理多种类型                  |

### 3. 泛型类

```java
// 定义泛型类
public class Box<T> {
    private T data;
    
    public void setData(T data) {
        this.data = data;
    }
    
    public T getData() {
        return data;
    }
}

// 使用泛型类
Box<String> box1 = new Box<>();
box1.setData("Hello");
String s = box1.getData();  // 不需要强转

Box<Integer> box2 = new Box<>();
box2.setData(123);
Integer n = box2.getData();

// 多个类型参数
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

### 4. 泛型方法

```java
public class Utils {
    // 泛型方法
    public static <T> void printArray(T[] arr) {
        for (T item : arr) {
            System.out.println(item);
        }
    }
    
    // 泛型方法（返回值）
    public static <T> T getFirst(List<T> list) {
        return list.isEmpty() ? null : list.get(0);
    }
    
    // 多个类型参数
    public static <K, V> Map<K, V> createMap(K key, V value) {
        Map<K, V> map = new HashMap<>();
        map.put(key, value);
        return map;
    }
}

// 使用
String[] strs = {"A", "B", "C"};
Integer[] nums = {1, 2, 3};

Utils.printArray(strs);  // 自动推断为 String
Utils.printArray(nums);  // 自动推断为 Integer

String first = Utils.getFirst(List.of("A", "B"));
```

### 5. 泛型接口

```java
// 定义泛型接口
public interface Container<T> {
    void add(T item);
    T get(int index);
}

// 实现泛型接口（确定类型）
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

// 实现泛型接口（保留泛型）
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

### 6. 泛型通配符

#### 6.1 无界通配符 `<?>`

```java
// 可以接收任何类型的集合
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

#### 6.2 上界通配符 `<? extends T>`

```java
// 只能接收 Number 及其子类的集合
public void printNumbers(List<? extends Number> list) {
    for (Number num : list) {
        System.out.println(num);
    }
}

List<Integer> integers = new ArrayList<>();
List<Double> doubles = new ArrayList<>();
List<String> strings = new ArrayList<>();

printNumbers(integers);  // ✅ Integer 是 Number 的子类
printNumbers(doubles);   // ✅ Double 是 Number 的子类
// printNumbers(strings);   // ❌ String 不是 Number 的子类

// 注意：<? extends T> 只能读，不能写
List<? extends Number> nums = integers;
Number n = nums.get(0);  // ✅ 可以读
// nums.add(1);  // ❌ 不能写（编译错误）
```

#### 6.3 下界通配符 `<? super T>`

```java
// 只能接收 Integer 及其父类的集合
public void addNumbers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
}

List<Integer> integers = new ArrayList<>();
List<Number> numbers = new ArrayList<>();
List<Object> objects = new ArrayList<>();

addNumbers(integers);  // ✅
addNumbers(numbers);   // ✅ Number 是 Integer 的父类
addNumbers(objects);   // ✅ Object 是 Integer 的父类

// 注意：<? super T> 可以写 T，但读出来是 Object
List<? super Integer> list = numbers;
list.add(1);  // ✅ 可以写 Integer
Object obj = list.get(0);  // ✅ 只能作为 Object 读取
// Integer n = list.get(0);  // ❌ 不能读为 Integer
```

### 7. 泛型通配符总结

| 通配符             | 说明     | 读写            | 使用场景      |
| --------------- | ------ | ------------- | --------- |
| `<?>`           | 任意类型   | 只读（作为 Object） | 只需要读取     |
| `<? extends T>` | T 及其子类 | 只读（作为 T）      | 生产者（提供数据） |
| `<? super T>`   | T 及其父类 | 可写 T          | 消费者（接收数据） |

**记忆口诀**：PECS（Producer Extends, Consumer Super）

*   **生产者用 extends**：只读取数据
*   **消费者用 super**：只写入数据

```java
// 示例：复制集合
public static <T> void copy(List<? super T> dest, List<? extends T> src) {
    for (T item : src) {  // src 是生产者，读取数据
        dest.add(item);   // dest 是消费者，写入数据
    }
}
```

### 8. 泛型的类型擦除

```java
// 泛型只在编译时检查，运行时会被擦除

// 编译前
List<String> strings = new ArrayList<>();
List<Integer> numbers = new ArrayList<>();

// 编译后（类型擦除）
List strings = new ArrayList();
List numbers = new ArrayList();

// 因此，运行时无法区分泛型类型
System.out.println(strings.getClass() == numbers.getClass());  // true

// 也无法创建泛型数组
// T[] arr = new T[10];  // ❌ 编译错误
```

### 9. 泛型的限制

```java
// 1. 不能使用基本类型
List<int> list;  // ❌
List<Integer> list;  // ✅

// 2. 不能创建泛型数组
T[] arr = new T[10];  // ❌

// 3. 不能实例化类型参数
T obj = new T();  // ❌

// 4. 不能在静态上下文中使用类型参数
public class Box<T> {
    private static T data;  // ❌
    private T data;  // ✅
}

// 5. 不能使用 instanceof
if (obj instanceof List<String>) { }  // ❌
if (obj instanceof List<?>) { }  // ✅

// 6. 不能捕获或抛出泛型异常
class MyException<T> extends Exception { }  // ❌
```

***

## 九、知识点速查表

### Collection 方法

| 方法                    | 说明          |
| --------------------- | ----------- |
| `add(e)`              | 添加元素        |
| `remove(o)`           | 删除元素        |
| `contains(o)`         | 是否包含        |
| `size()`              | 元素个数        |
| `isEmpty()`           | 是否为空        |
| `clear()`             | 清空          |
| `toArray()`           | 转换为数组       |
| `stream()`            | 获取 Stream 流 |
| `removeIf(Predicate)` | 按条件删除       |

### List 特有方法

| 方法                          | 说明           |
| --------------------------- | ------------ |
| `add(index, e)`             | 指定位置添加       |
| `remove(index)`             | 指定位置删除       |
| `set(index, e)`             | 修改元素         |
| `get(index)`                | 获取元素         |
| `indexOf(o)`                | 查找位置         |
| `subList(from, to)`         | 截取子列表        |
| `sort(Comparator)`          | 排序（JDK 8+）   |
| `replaceAll(UnaryOperator)` | 替换所有（JDK 8+） |

### LinkedList 特有方法

| 方法                       | 说明    |
| ------------------------ | ----- |
| `addFirst/addLast`       | 头/尾添加 |
| `getFirst/getLast`       | 获取头/尾 |
| `removeFirst/removeLast` | 删除头/尾 |
| `push/pop`               | 栈操作   |
| `offer/poll/peek`        | 队列操作  |

### 泛型通配符

| 通配符             | 说明     | 读写 |
| --------------- | ------ | -- |
| `<?>`           | 任意类型   | 只读 |
| `<? extends T>` | T 及其子类 | 只读 |
| `<? super T>`   | T 及其父类 | 可写 |

### 数据结构选择

| 场景      | 推荐                      |
| ------- | ----------------------- |
| 查询多，增删少 | ArrayList               |
| 增删多，查询少 | LinkedList              |
| 头部频繁操作  | LinkedList              |
| 需要栈     | LinkedList / ArrayDeque |
| 需要队列    | LinkedList / ArrayDeque |
| 线程安全    | CopyOnWriteArrayList    |

