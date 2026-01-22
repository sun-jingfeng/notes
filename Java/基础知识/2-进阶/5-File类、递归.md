## 一、File 类

### 1. 什么是 File 类

`File` 类是 Java 中用于表示**文件和目录（文件夹）路径**的类。

```java
// File 类在 java.io 包中
import java.io.File;

// File 对象代表一个文件或目录的路径
// 注意：File 对象只是路径的抽象表示，文件/目录可以不存在
```

**关键点：**

*   `File` 对象表示的是**路径**，不是文件内容
*   文件/目录可以存在，也可以不存在
*   可以用来创建、删除、查询文件/目录信息

***

### 2. 创建 File 对象

#### 三种构造方法

```java
// 1. 通过路径字符串创建
File file1 = new File("D:/test/a.txt");
File file2 = new File("D:\\test\\a.txt");  // Windows 路径分隔符

// 2. 通过父路径 + 子路径创建
File file3 = new File("D:/test", "a.txt");

// 3. 通过父 File 对象 + 子路径创建
File parentDir = new File("D:/test");
File file4 = new File(parentDir, "a.txt");
```

***

#### 路径分隔符

```java
// Windows 路径分隔符：\（需要转义写成 \\）
File file1 = new File("D:\\test\\a.txt");

// Linux/Mac 路径分隔符：/
File file2 = new File("/home/user/test/a.txt");

// 推荐：使用 / 或 File.separator（跨平台）
File file3 = new File("D:/test/a.txt");  // ✅ 推荐
File file4 = new File("D:" + File.separator + "test" + File.separator + "a.txt");

// 路径分隔符常量
System.out.println(File.separator);      // Windows: \  Linux: /
System.out.println(File.pathSeparator);  // Windows: ;  Linux: :（用于 PATH 环境变量）
```

***

#### 相对路径与绝对路径

```java
// 绝对路径：从盘符开始的完整路径
File absolute = new File("D:/test/a.txt");  // Windows
File absolute2 = new File("/home/user/a.txt");  // Linux/Mac

// 相对路径：相对于当前工作目录的路径
File relative = new File("a.txt");  // 当前目录下的 a.txt
File relative2 = new File("test/a.txt");  // 当前目录下的 test/a.txt
File relative3 = new File("../a.txt");  // 上级目录下的 a.txt

// 获取当前工作目录
String userDir = System.getProperty("user.dir");
System.out.println("当前工作目录：" + userDir);
```

***

### 3. File 类常用方法

#### 判断方法

```java
File file = new File("D:/test/a.txt");
File dir = new File("D:/test");

// 判断是否存在
boolean exists = file.exists();  // true/false

// 判断是否是文件
boolean isFile = file.isFile();  // true（如果是文件）

// 判断是否是目录（文件夹）
boolean isDir = dir.isDirectory();  // true（如果是目录）

// 判断是否是隐藏文件
boolean isHidden = file.isHidden();  // true/false

// 判断是否是绝对路径
boolean isAbsolute = file.isAbsolute();  // true/false

// 判断是否可读/可写/可执行
boolean canRead = file.canRead();
boolean canWrite = file.canWrite();
boolean canExecute = file.canExecute();
```

***

#### 获取方法

```java
File file = new File("D:/test/../test/a.txt");

// 获取文件名
String name = file.getName();  // "a.txt"

// 获取路径（构造时的路径）
String path = file.getPath();  // "D:/test/../test/a.txt"

// 获取绝对路径
String absolutePath = file.getAbsolutePath();  // "D:/test/../test/a.txt"

// 获取规范路径（解析 . 和 ..，推荐）
String canonicalPath = file.getCanonicalPath();  // "D:/test/a.txt"

// 获取父路径
String parent = file.getParent();  // "D:/test/../test"

// 获取父 File 对象
File parentFile = file.getParentFile();  // File 对象

// 获取文件大小（字节数）
long size = file.length();  // 文件大小（字节），目录返回 0

// 获取最后修改时间（毫秒值）
long lastModified = file.lastModified();  // 时间戳
```

***

#### 磁盘空间方法

```java
File disk = new File("D:/");

// 获取磁盘总空间（字节）
long totalSpace = disk.getTotalSpace();
System.out.println("总空间：" + totalSpace / 1024 / 1024 / 1024 + " GB");

// 获取磁盘可用空间（字节）
long freeSpace = disk.getFreeSpace();
System.out.println("可用空间：" + freeSpace / 1024 / 1024 / 1024 + " GB");

// 获取磁盘可用空间（考虑权限，推荐）
long usableSpace = disk.getUsableSpace();
System.out.println("可用空间：" + usableSpace / 1024 / 1024 / 1024 + " GB");

// 获取系统所有根目录
File[] roots = File.listRoots();
for (File root : roots) {
    System.out.println("根目录：" + root);  // C:\  D:\  E:\
}
```

***

#### 创建方法

```java
// 1. 创建文件
File file = new File("D:/test/a.txt");
boolean created = file.createNewFile();  // 创建文件，成功返回 true
// 注意：如果文件已存在，返回 false；如果父目录不存在，抛出异常

// 2. 创建单级目录
File dir = new File("D:/test/newDir");
boolean mkdir = dir.mkdir();  // 创建目录，成功返回 true
// 注意：如果父目录不存在，创建失败

// 3. 创建多级目录（推荐）
File dirs = new File("D:/test/a/b/c");
boolean mkdirs = dirs.mkdirs();  // 创建多级目录，成功返回 true
// 注意：如果父目录不存在，会一起创建

// 4. 创建临时文件
File tempFile = File.createTempFile("prefix_", ".tmp");  // 在系统临时目录创建
File tempFile2 = File.createTempFile("prefix_", ".tmp", new File("D:/test"));  // 指定目录
System.out.println("临时文件：" + tempFile.getAbsolutePath());
tempFile.deleteOnExit();  // JVM 退出时自动删除
```

***

#### 删除方法

```java
File file = new File("D:/test/a.txt");

// 删除文件或空目录
boolean deleted = file.delete();  // 删除成功返回 true
// 注意：
// - 只能删除文件或空目录
// - 不能删除非空目录
// - 删除是永久删除，不进回收站

// JVM 退出时删除
file.deleteOnExit();  // 常用于临时文件
```

***

#### 权限设置方法

```java
File file = new File("D:/test/a.txt");

// 设置只读
boolean success1 = file.setReadOnly();

// 设置可写
boolean success2 = file.setWritable(true);
boolean success3 = file.setWritable(true, false);  // 第二个参数：是否仅限所有者

// 设置可读
boolean success4 = file.setReadable(true);

// 设置可执行
boolean success5 = file.setExecutable(true);

// 设置最后修改时间
boolean success6 = file.setLastModified(System.currentTimeMillis());
```

***

#### 重命名/移动

```java
File oldFile = new File("D:/test/a.txt");
File newFile = new File("D:/test/b.txt");

// 重命名（同目录下）
boolean renamed = oldFile.renameTo(newFile);

// 移动（不同目录）
File movedFile = new File("D:/other/a.txt");
boolean moved = oldFile.renameTo(movedFile);  // 同时移动和重命名
// 注意：跨分区移动可能失败，建议使用 Files.move()
```

***

### 4. 遍历目录

#### 获取目录内容

```java
File dir = new File("D:/test");

// 1. list() - 获取目录下的文件名数组
String[] names = dir.list();
if (names != null) {
    for (String name : names) {
        System.out.println(name);  // 只有文件名，没有路径
    }
}

// 2. listFiles() - 获取目录下的 File 对象数组（推荐）
File[] files = dir.listFiles();
if (files != null) {
    for (File file : files) {
        System.out.println(file.getName());  // 文件名
        System.out.println(file.getAbsolutePath());  // 绝对路径
        System.out.println(file.isFile());  // 是否是文件
    }
}

// 注意：如果 dir 不是目录或没有权限，返回 null
```

***

#### 文件过滤

```java
File dir = new File("D:/test");

// 1. 使用 FilenameFilter 过滤（按文件名）
String[] names = dir.list((d, name) -> name.endsWith(".txt"));
// 只返回 .txt 文件

// 2. 使用 FileFilter 过滤（按 File 对象）
File[] files = dir.listFiles(file -> file.isFile() && file.getName().endsWith(".txt"));
// 只返回 .txt 文件

// 3. 只获取目录
File[] dirs = dir.listFiles(File::isDirectory);

// 4. 获取指定大小以上的文件
File[] bigFiles = dir.listFiles(file -> file.isFile() && file.length() > 1024 * 1024);
```

***

### 5. File 与 Path 互转

```java
import java.nio.file.Path;
import java.nio.file.Paths;

File file = new File("D:/test/a.txt");

// File → Path
Path path = file.toPath();

// Path → File
File file2 = path.toFile();

// 使用 Paths 创建 Path
Path path2 = Paths.get("D:/test/a.txt");
File file3 = path2.toFile();
```

**File vs Path 对比：**

| 特性   | File（旧）    | Path（新，JDK 7+） |
| ---- | ---------- | -------------- |
| 包    | java.io    | java.nio.file  |
| 不可变性 | 可变         | 不可变            |
| 异常处理 | 返回 boolean | 抛出详细异常         |
| 符号链接 | 不支持        | 支持             |
| 文件属性 | 有限         | 丰富             |
| 推荐使用 | 旧项目        | 新项目            |

***

### 6. 完整示例

```java
import java.io.File;
import java.io.IOException;

public class FileDemo {
    public static void main(String[] args) throws IOException {
        // 1. 创建 File 对象
        File file = new File("D:/test/a.txt");
        File dir = new File("D:/test");
        
        // 2. 判断方法
        System.out.println("文件是否存在：" + file.exists());
        System.out.println("是否是文件：" + file.isFile());
        System.out.println("是否是目录：" + dir.isDirectory());
        
        // 3. 获取方法
        System.out.println("文件名：" + file.getName());
        System.out.println("绝对路径：" + file.getAbsolutePath());
        System.out.println("规范路径：" + file.getCanonicalPath());
        System.out.println("父路径：" + file.getParent());
        System.out.println("文件大小：" + file.length() + " 字节");
        
        // 4. 创建方法
        File newFile = new File("D:/test/b.txt");
        if (!newFile.exists()) {
            boolean created = newFile.createNewFile();
            System.out.println("创建文件：" + created);
        }
        
        File newDir = new File("D:/test/newDir");
        if (!newDir.exists()) {
            boolean mkdir = newDir.mkdirs();
            System.out.println("创建目录：" + mkdir);
        }
        
        // 5. 遍历目录
        File[] files = dir.listFiles();
        if (files != null) {
            for (File f : files) {
                if (f.isFile()) {
                    System.out.println("文件：" + f.getName());
                } else {
                    System.out.println("目录：" + f.getName());
                }
            }
        }
        
        // 6. 磁盘空间
        File disk = new File("D:/");
        System.out.println("磁盘总空间：" + disk.getTotalSpace() / 1024 / 1024 / 1024 + " GB");
        System.out.println("磁盘可用空间：" + disk.getUsableSpace() / 1024 / 1024 / 1024 + " GB");
    }
}
```

***

### 7. File 类方法速查表

| 方法                     | 返回值       | 说明               |
| ---------------------- | --------- | ---------------- |
| `exists()`             | boolean   | 判断是否存在           |
| `isFile()`             | boolean   | 判断是否是文件          |
| `isDirectory()`        | boolean   | 判断是否是目录          |
| `isAbsolute()`         | boolean   | 判断是否是绝对路径        |
| `getName()`            | String    | 获取文件名            |
| `getPath()`            | String    | 获取路径             |
| `getAbsolutePath()`    | String    | 获取绝对路径           |
| `getCanonicalPath()`   | String    | 获取规范路径（推荐）       |
| `getParent()`          | String    | 获取父路径            |
| `getParentFile()`      | File      | 获取父 File 对象      |
| `length()`             | long      | 获取文件大小（字节）       |
| `lastModified()`       | long      | 获取最后修改时间         |
| `getTotalSpace()`      | long      | 获取磁盘总空间          |
| `getUsableSpace()`     | long      | 获取磁盘可用空间         |
| `createNewFile()`      | boolean   | 创建文件             |
| `createTempFile()`     | File      | 创建临时文件（静态方法）     |
| `mkdir()`              | boolean   | 创建单级目录           |
| `mkdirs()`             | boolean   | 创建多级目录           |
| `delete()`             | boolean   | 删除文件或空目录         |
| `deleteOnExit()`       | void      | JVM 退出时删除        |
| `renameTo(File)`       | boolean   | 重命名/移动           |
| `setReadOnly()`        | boolean   | 设置只读             |
| `setWritable(boolean)` | boolean   | 设置可写             |
| `list()`               | String\[] | 获取目录下的文件名数组      |
| `listFiles()`          | File\[]   | 获取目录下的 File 对象数组 |
| `listRoots()`          | File\[]   | 获取系统根目录（静态方法）    |
| `toPath()`             | Path      | 转换为 Path 对象      |

***

## 二、递归

### 1. 什么是递归

递归是指**方法自己调用自己**的编程技术。

```java
// 递归的基本结构
public static void method() {
    // ...
    method();  // 自己调用自己
    // ...
}
```

**类比理解：**

    递归 = 俄罗斯套娃
         = 一层套一层，直到最小的娃娃（基准条件）
         = 然后一层层返回

***

### 2. 递归的两个要素

#### 要素一：基准条件（递归出口）

```java
// ❌ 没有基准条件：无限递归，导致栈溢出
public static void method() {
    method();  // 无限调用，程序崩溃
}

// ✅ 有基准条件：到达条件时停止递归
public static void method(int n) {
    if (n <= 0) {
        return;  // 基准条件：n <= 0 时停止
    }
    method(n - 1);  // 递归调用
}
```

***

#### 要素二：递归条件（递归规则）

```java
// 递归条件：如何将问题分解为更小的子问题
public static int sum(int n) {
    // 基准条件
    if (n == 1) {
        return 1;
    }
    // 递归条件：sum(n) = n + sum(n-1)
    return n + sum(n - 1);
}
```

***

### 3. 递归的执行流程

#### 计算阶乘示例

```java
public static int factorial(int n) {
    // 基准条件
    if (n == 1) {
        return 1;
    }
    // 递归条件
    return n * factorial(n - 1);
}

// 调用 factorial(5)
```

**执行流程：**

    调用过程（入栈）：
    factorial(5)
        → 5 * factorial(4)
            → 4 * factorial(3)
                → 3 * factorial(2)
                    → 2 * factorial(1)
                        → 1（基准条件，返回）

    返回过程（出栈）：
    factorial(1) = 1
    factorial(2) = 2 * 1 = 2
    factorial(3) = 3 * 2 = 6
    factorial(4) = 4 * 6 = 24
    factorial(5) = 5 * 24 = 120

    结果：120

**图示：**

    ┌─────────────────────────────────────────┐
    │  factorial(5) = 5 * factorial(4) = 120  │ ← 最后返回
    ├─────────────────────────────────────────┤
    │  factorial(4) = 4 * factorial(3) = 24   │
    ├─────────────────────────────────────────┤
    │  factorial(3) = 3 * factorial(2) = 6    │
    ├─────────────────────────────────────────┤
    │  factorial(2) = 2 * factorial(1) = 2    │
    ├─────────────────────────────────────────┤
    │  factorial(1) = 1                        │ ← 基准条件，开始返回
    └─────────────────────────────────────────┘

***

### 4. 递归经典案例

#### 案例1：计算阶乘

```java
// n! = n * (n-1) * (n-2) * ... * 1
// n! = n * (n-1)!

public static int factorial(int n) {
    // 基准条件
    if (n == 1) {
        return 1;
    }
    // 递归条件
    return n * factorial(n - 1);
}

// 测试
System.out.println(factorial(5));  // 120
System.out.println(factorial(10)); // 3628800
```

***

#### 案例2：计算累加和

```java
// sum(n) = 1 + 2 + 3 + ... + n
// sum(n) = n + sum(n-1)

public static int sum(int n) {
    // 基准条件
    if (n == 1) {
        return 1;
    }
    // 递归条件
    return n + sum(n - 1);
}

// 测试
System.out.println(sum(100));  // 5050
```

***

#### 案例3：斐波那契数列

```java
// 斐波那契数列：1, 1, 2, 3, 5, 8, 13, 21, ...
// f(n) = f(n-1) + f(n-2)

public static int fibonacci(int n) {
    // 基准条件
    if (n == 1 || n == 2) {
        return 1;
    }
    // 递归条件
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 测试
System.out.println(fibonacci(10));  // 55
```

**注意：** 斐波那契递归效率很低（重复计算），实际开发中应使用循环或动态规划。

***

#### 案例4：遍历目录（递归 + File 类）

```java
// 遍历目录下的所有文件（包括子目录中的文件）
public static void listAllFiles(File dir) {
    // 基准条件：不是目录或为空
    if (!dir.isDirectory()) {
        return;
    }
    
    File[] files = dir.listFiles();
    if (files == null) {
        return;
    }
    
    for (File file : files) {
        if (file.isFile()) {
            // 是文件，打印
            System.out.println("文件：" + file.getAbsolutePath());
        } else {
            // 是目录，递归遍历
            System.out.println("目录：" + file.getAbsolutePath());
            listAllFiles(file);  // 递归调用
        }
    }
}

// 测试
listAllFiles(new File("D:/test"));
```

***

#### 案例5：搜索指定文件

```java
// 在目录中搜索指定名称的文件
public static void searchFile(File dir, String fileName) {
    if (!dir.isDirectory()) {
        return;
    }
    
    File[] files = dir.listFiles();
    if (files == null) {
        return;
    }
    
    for (File file : files) {
        if (file.isFile()) {
            // 是文件，判断文件名是否匹配
            if (file.getName().equals(fileName)) {
                System.out.println("找到文件：" + file.getAbsolutePath());
            }
        } else {
            // 是目录，递归搜索
            searchFile(file, fileName);
        }
    }
}

// 测试：在 D:/test 中搜索 a.txt
searchFile(new File("D:/test"), "a.txt");
```

***

#### 案例6：删除目录（包括子目录和文件）

```java
// 递归删除目录（包括子目录和文件）
public static boolean deleteDir(File dir) {
    if (!dir.exists()) {
        return false;
    }
    
    if (dir.isFile()) {
        // 是文件，直接删除
        return dir.delete();
    }
    
    // 是目录，先删除子文件和子目录
    File[] files = dir.listFiles();
    if (files != null) {
        for (File file : files) {
            deleteDir(file);  // 递归删除
        }
    }
    
    // 删除空目录
    return dir.delete();
}

// 测试：删除 D:/test 目录
deleteDir(new File("D:/test"));
```

***

#### 案例7：计算目录大小

```java
// 递归计算目录大小（所有文件大小之和）
public static long getDirSize(File dir) {
    if (!dir.exists()) {
        return 0;
    }
    
    if (dir.isFile()) {
        // 是文件，返回文件大小
        return dir.length();
    }
    
    // 是目录，累加子文件大小
    long size = 0;
    File[] files = dir.listFiles();
    if (files != null) {
        for (File file : files) {
            size += getDirSize(file);  // 递归累加
        }
    }
    return size;
}

// 测试：计算 D:/test 目录大小
long size = getDirSize(new File("D:/test"));
System.out.println("目录大小：" + size + " 字节");
System.out.println("目录大小：" + (size / 1024) + " KB");
```

***

#### 案例8：复制目录（包括子目录和文件）

```java
import java.io.*;

// 递归复制目录（包括子目录和文件）
public static void copyDir(File srcDir, File destDir) throws IOException {
    // 基准条件：源不存在
    if (!srcDir.exists()) {
        return;
    }
    
    if (srcDir.isFile()) {
        // 是文件，复制文件
        copyFile(srcDir, destDir);
        return;
    }
    
    // 是目录，先创建目标目录
    if (!destDir.exists()) {
        destDir.mkdirs();
    }
    
    // 遍历源目录，递归复制
    File[] files = srcDir.listFiles();
    if (files != null) {
        for (File file : files) {
            File destFile = new File(destDir, file.getName());
            copyDir(file, destFile);  // 递归复制
        }
    }
}

// 复制单个文件
private static void copyFile(File src, File dest) throws IOException {
    try (
        FileInputStream fis = new FileInputStream(src);
        FileOutputStream fos = new FileOutputStream(dest)
    ) {
        byte[] buffer = new byte[8192];
        int len;
        while ((len = fis.read(buffer)) != -1) {
            fos.write(buffer, 0, len);
        }
    }
}

// 测试：复制 D:/test 到 D:/test_backup
copyDir(new File("D:/test"), new File("D:/test_backup"));
```

***

### 5. 递归的注意事项

#### 注意事项1：必须有基准条件

```java
// ❌ 没有基准条件：栈溢出
public static void method() {
    method();
}

// ✅ 有基准条件：正常运行
public static void method(int n) {
    if (n <= 0) {
        return;  // 基准条件
    }
    method(n - 1);
}
```

***

#### 注意事项2：递归必须能到达基准条件

```java
// ❌ 永远到不了基准条件：栈溢出
public static void method(int n) {
    if (n == 0) {
        return;
    }
    method(n + 1);  // n 不断增大，永远到不了 0
}

// ✅ 能到达基准条件：正常运行
public static void method(int n) {
    if (n == 0) {
        return;
    }
    method(n - 1);  // n 不断减小，能到达 0
}
```

***

#### 注意事项3：递归层数不能太深

```java
// ❌ 递归层数太深：栈溢出
public static int sum(int n) {
    if (n == 1) {
        return 1;
    }
    return n + sum(n - 1);
}
sum(100000);  // ❌ 栈溢出

// ✅ 大数据量用循环代替递归
public static long sumLoop(int n) {
    long result = 0;
    for (int i = 1; i <= n; i++) {
        result += i;
    }
    return result;
}
```

***

#### 注意事项4：避免重复计算

```java
// ❌ 斐波那契递归：大量重复计算
public static int fibonacci(int n) {
    if (n == 1 || n == 2) {
        return 1;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);  // 重复计算
}

// ✅ 使用缓存避免重复计算（记忆化）
private static Map<Integer, Integer> cache = new HashMap<>();

public static int fibonacciWithCache(int n) {
    if (n == 1 || n == 2) {
        return 1;
    }
    if (cache.containsKey(n)) {
        return cache.get(n);  // 从缓存获取
    }
    int result = fibonacciWithCache(n - 1) + fibonacciWithCache(n - 2);
    cache.put(n, result);  // 存入缓存
    return result;
}
```

***

### 6. 尾递归优化

#### 什么是尾递归

尾递归是指**递归调用是方法的最后一个操作**，没有其他计算。

```java
// ❌ 普通递归：递归调用后还有计算（乘法）
public static int factorial(int n) {
    if (n == 1) return 1;
    return n * factorial(n - 1);  // 递归后还要乘 n
}

// ✅ 尾递归：递归调用是最后一个操作
public static int factorialTail(int n, int result) {
    if (n == 1) return result;
    return factorialTail(n - 1, n * result);  // 递归调用是最后操作
}

// 调用
factorialTail(5, 1);  // 120
```

***

#### 尾递归的优势

```java
// 普通递归：每次调用都要保存状态，栈不断增长
factorial(5)
    → 5 * factorial(4)  // 需要记住要乘 5
        → 4 * factorial(3)  // 需要记住要乘 4
            → ...

// 尾递归：不需要保存状态，理论上可以优化为循环
factorialTail(5, 1)
    → factorialTail(4, 5)   // 结果直接传递
        → factorialTail(3, 20)
            → factorialTail(2, 60)
                → factorialTail(1, 120)
                    → 120
```

**注意：** Java 目前不支持尾递归优化，但理解这个概念有助于写出更好的代码。

***

#### 尾递归改写示例

```java
// 普通递归求和
public static int sum(int n) {
    if (n == 1) return 1;
    return n + sum(n - 1);
}

// 尾递归求和
public static int sumTail(int n, int result) {
    if (n == 0) return result;
    return sumTail(n - 1, n + result);
}

// 调用
sumTail(100, 0);  // 5050
```

***

### 7. 递归 vs 循环

| 对比项       | 递归         | 循环   |
| --------- | ---------- | ---- |
| **代码简洁度** | 简洁         | 相对复杂 |
| **可读性**   | 高（自然表达问题）  | 较低   |
| **性能**    | 较低（方法调用开销） | 较高   |
| **内存占用**  | 较高（栈空间）    | 较低   |
| **适用场景**  | 树形结构、分治问题  | 简单迭代 |
| **风险**    | 栈溢出        | 无    |

**建议：**

*   树形结构遍历、分治问题 → 使用递归
*   简单迭代、大数据量 → 使用循环
*   需要优化性能 → 考虑尾递归或缓存

***

### 8. 递归方法速查表

| 场景       | 递归公式                     | 基准条件              |
| -------- | ------------------------ | ----------------- |
| **阶乘**   | `f(n) = n * f(n-1)`      | `f(1) = 1`        |
| **累加和**  | `f(n) = n + f(n-1)`      | `f(1) = 1`        |
| **斐波那契** | `f(n) = f(n-1) + f(n-2)` | `f(1) = f(2) = 1` |
| **遍历目录** | 对每个子目录递归调用               | 不是目录时返回           |
| **删除目录** | 先删除子文件，再删除自己             | 是文件时直接删除          |
| **复制目录** | 创建目录，递归复制子文件             | 是文件时复制内容          |
| **目录大小** | 累加子文件大小                  | 是文件时返回大小          |

***

## 三、综合案例

### 案例：文件管理工具

```java
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;

public class FileUtils {
    
    /**
     * 遍历目录下的所有文件
     */
    public static void listAllFiles(File dir) {
        listAllFiles(dir, 0);
    }
    
    private static void listAllFiles(File dir, int level) {
        if (!dir.isDirectory()) {
            return;
        }
        
        File[] files = dir.listFiles();
        if (files == null) {
            return;
        }
        
        String indent = "  ".repeat(level);  // 缩进
        for (File file : files) {
            if (file.isFile()) {
                System.out.println(indent + "📄 " + file.getName());
            } else {
                System.out.println(indent + "📁 " + file.getName());
                listAllFiles(file, level + 1);
            }
        }
    }
    
    /**
     * 搜索指定类型的文件
     */
    public static void searchByExtension(File dir, String extension) {
        if (!dir.isDirectory()) {
            return;
        }
        
        File[] files = dir.listFiles();
        if (files == null) {
            return;
        }
        
        for (File file : files) {
            if (file.isFile()) {
                if (file.getName().toLowerCase().endsWith(extension.toLowerCase())) {
                    System.out.println("找到：" + file.getAbsolutePath());
                }
            } else {
                searchByExtension(file, extension);
            }
        }
    }
    
    /**
     * 计算目录大小
     */
    public static long getDirSize(File dir) {
        if (!dir.exists()) {
            return 0;
        }
        
        if (dir.isFile()) {
            return dir.length();
        }
        
        long size = 0;
        File[] files = dir.listFiles();
        if (files != null) {
            for (File file : files) {
                size += getDirSize(file);
            }
        }
        return size;
    }
    
    /**
     * 格式化文件大小
     */
    public static String formatSize(long size) {
        if (size < 1024) {
            return size + " B";
        } else if (size < 1024 * 1024) {
            return String.format("%.2f KB", size / 1024.0);
        } else if (size < 1024 * 1024 * 1024) {
            return String.format("%.2f MB", size / 1024.0 / 1024.0);
        } else {
            return String.format("%.2f GB", size / 1024.0 / 1024.0 / 1024.0);
        }
    }
    
    /**
     * 统计目录下的文件和目录数量
     */
    public static int[] countFilesAndDirs(File dir) {
        int[] count = {0, 0};  // [文件数, 目录数]
        countFilesAndDirs(dir, count);
        return count;
    }
    
    private static void countFilesAndDirs(File dir, int[] count) {
        if (!dir.exists() || dir.isFile()) {
            return;
        }
        
        File[] files = dir.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isFile()) {
                    count[0]++;
                } else {
                    count[1]++;
                    countFilesAndDirs(file, count);
                }
            }
        }
    }
    
    /**
     * 递归删除目录
     */
    public static boolean deleteDir(File dir) {
        if (!dir.exists()) {
            return false;
        }
        
        if (dir.isFile()) {
            return dir.delete();
        }
        
        File[] files = dir.listFiles();
        if (files != null) {
            for (File file : files) {
                deleteDir(file);
            }
        }
        return dir.delete();
    }
    
    /**
     * 递归复制目录
     */
    public static void copyDir(File srcDir, File destDir) throws IOException {
        if (!srcDir.exists()) {
            return;
        }
        
        if (srcDir.isFile()) {
            copyFile(srcDir, destDir);
            return;
        }
        
        if (!destDir.exists()) {
            destDir.mkdirs();
        }
        
        File[] files = srcDir.listFiles();
        if (files != null) {
            for (File file : files) {
                File destFile = new File(destDir, file.getName());
                copyDir(file, destFile);
            }
        }
    }
    
    private static void copyFile(File src, File dest) throws IOException {
        try (
            FileInputStream fis = new FileInputStream(src);
            FileOutputStream fos = new FileOutputStream(dest)
        ) {
            byte[] buffer = new byte[8192];
            int len;
            while ((len = fis.read(buffer)) != -1) {
                fos.write(buffer, 0, len);
            }
        }
    }
    
    /**
     * 获取文件详细信息
     */
    public static void printFileInfo(File file) {
        if (!file.exists()) {
            System.out.println("文件不存在：" + file.getPath());
            return;
        }
        
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        
        System.out.println("=== 文件信息 ===");
        System.out.println("名称：" + file.getName());
        System.out.println("路径：" + file.getAbsolutePath());
        System.out.println("类型：" + (file.isFile() ? "文件" : "目录"));
        System.out.println("大小：" + formatSize(getDirSize(file)));
        System.out.println("修改时间：" + sdf.format(new Date(file.lastModified())));
        System.out.println("可读：" + file.canRead());
        System.out.println("可写：" + file.canWrite());
        System.out.println("隐藏：" + file.isHidden());
    }
    
    public static void main(String[] args) {
        File testDir = new File("D:/test");
        
        // 遍历所有文件（带缩进）
        System.out.println("=== 遍历所有文件 ===");
        listAllFiles(testDir);
        
        // 搜索 .txt 文件
        System.out.println("\n=== 搜索 .txt 文件 ===");
        searchByExtension(testDir, ".txt");
        
        // 计算目录大小
        System.out.println("\n=== 目录大小 ===");
        long size = getDirSize(testDir);
        System.out.println("大小：" + formatSize(size));
        
        // 统计文件和目录数量
        System.out.println("\n=== 统计 ===");
        int[] count = countFilesAndDirs(testDir);
        System.out.println("文件数量：" + count[0]);
        System.out.println("目录数量：" + count[1]);
        
        // 文件详细信息
        System.out.println();
        printFileInfo(testDir);
    }
}
```

***

## 四、快速参考表

### File 类

| 方法                   | 作用       | 返回值     |
| -------------------- | -------- | ------- |
| `exists()`           | 判断是否存在   | boolean |
| `isFile()`           | 判断是否是文件  | boolean |
| `isDirectory()`      | 判断是否是目录  | boolean |
| `getName()`          | 获取文件名    | String  |
| `getAbsolutePath()`  | 获取绝对路径   | String  |
| `getCanonicalPath()` | 获取规范路径   | String  |
| `length()`           | 获取文件大小   | long    |
| `getTotalSpace()`    | 获取磁盘总空间  | long    |
| `getUsableSpace()`   | 获取磁盘可用空间 | long    |
| `createNewFile()`    | 创建文件     | boolean |
| `createTempFile()`   | 创建临时文件   | File    |
| `mkdirs()`           | 创建多级目录   | boolean |
| `delete()`           | 删除文件/空目录 | boolean |
| `deleteOnExit()`     | JVM退出时删除 | void    |
| `listFiles()`        | 获取目录内容   | File\[] |
| `toPath()`           | 转换为 Path | Path    |

### 递归

| 要素       | 说明        | 示例                      |
| -------- | --------- | ----------------------- |
| **基准条件** | 递归出口，停止递归 | `if (n == 1) return 1;` |
| **递归条件** | 问题分解为子问题  | `return n * f(n-1);`    |

| 注意事项      | 说明         |
| --------- | ---------- |
| 必须有基准条件   | 否则无限递归，栈溢出 |
| 必须能到达基准条件 | 否则无限递归，栈溢出 |
| 递归层数不能太深  | 否则栈溢出      |
| 避免重复计算    | 使用缓存优化     |
| 考虑尾递归     | 将结果作为参数传递  |

### 常见递归场景

| 场景   | 递归公式                     | 基准条件              |
| ---- | ------------------------ | ----------------- |
| 阶乘   | `f(n) = n * f(n-1)`      | `f(1) = 1`        |
| 累加和  | `f(n) = n + f(n-1)`      | `f(1) = 1`        |
| 斐波那契 | `f(n) = f(n-1) + f(n-2)` | `f(1) = f(2) = 1` |
| 遍历目录 | 对子目录递归                   | 不是目录时返回           |
| 删除目录 | 先删子文件再删自己                | 是文件时直接删           |
| 复制目录 | 创建目录，复制子文件               | 是文件时复制内容          |

