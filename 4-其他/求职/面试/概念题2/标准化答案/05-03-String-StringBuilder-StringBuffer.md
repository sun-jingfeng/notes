# String / StringBuilder / StringBuffer

## 一、对比

| 类 | 可变性 | 线程安全 | 性能 | 适用场景 |
| --- | --- | --- | --- | --- |
| **String** | 不可变 | 天然安全 | 频繁拼接会产大量临时对象 | 常量、少量拼接 |
| **StringBuilder** | 可变（内部 char 数组可扩） | 不安全 | 单线程下最快 | 单线程下大量拼接、构造字符串 |
| **StringBuffer** | 可变 | 安全（关键方法 synchronized） | 有锁开销 | 多线程下需拼接时 |

***

## 二、String 不可变

- 内部用 `final char[]`（JDK9+ 为 byte[]）存数据，类不可被继承，值不可改。
- 好处：线程安全、可做缓存 key、字符串常量池、安全性（做参数传递不会被改）。

***

## 三、拼接选择

- 少量、简单拼接：`String` 或 `+` 即可。
- 循环或大量拼接：用 **StringBuilder**（单线程）或 **StringBuffer**（多线程）；避免在循环里 `s = s + x` 产生大量临时 String。

***

## 四、面试答题要点

- **String** 不可变、线程安全、频繁拼接效率低。
- **StringBuilder** 可变、非线程安全、单线程拼接首选。
- **StringBuffer** 可变、线程安全（synchronized）、多线程拼接时用。
