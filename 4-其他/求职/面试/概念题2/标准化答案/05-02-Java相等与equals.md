# == 和 equals 的区别

## 一、== 的含义

| 操作数 | **==** 比较的是 |
| --- | --- |
| **基本类型** | **值**是否相等 |
| **引用类型** | **引用（内存地址）**是否相同，即是否同一对象 |

***

## 二、equals 的含义

- **Object 默认**：`equals` 等价于 `==`，即比较引用。
- **重写后**：如 `String`、`Integer` 等重写为按**内容/值**比较；自定义类若需“值相等”语义，需重写 `equals`（并建议同时重写 `hashCode`）。

***

## 三、String 与常量池

- 字面量 `"hello"` 会进入**字符串常量池**，相同字面量共享同一对象。
- `new String("hello")` 在堆上新建对象，与常量池中同内容的对象不是同一引用。

```java
String a = "hello";           // 常量池
String b = "hello";           // 同一常量池引用
String c = new String("hello"); // 堆中新对象

a == b;       // true（同一引用）
a == c;       // false（不同对象）
a.equals(c);  // true（内容相同）
```

***

## 四、面试答题要点

- **==**：基本类型比值，引用类型比地址。
- **equals**：默认同 ==；String、Integer 等重写为比值；重写 equals 要同时重写 hashCode。
- **String**：字面量入常量池；new String 在堆上，== 与常量池不等。
