## 一、IO 介绍和分类

### 1. 什么是 IO

IO（Input/Output）是指**输入/输出**，用于在程序和外部设备（文件、网络等）之间传输数据。

    输入（Input）：从外部读取数据到程序中（读文件、接收网络数据）
    输出（Output）：从程序写出数据到外部（写文件、发送网络数据）

**类比理解：**

    IO = 水管
    输入流 = 进水管（从外部流入程序）
    输出流 = 出水管（从程序流出到外部）

***

### 2. IO 流的分类

#### 按流向分类

| 流向      | 说明           | 基类                      |
| ------- | ------------ | ----------------------- |
| **输入流** | 读取数据（从外部到程序） | `InputStream`、`Reader`  |
| **输出流** | 写出数据（从程序到外部） | `OutputStream`、`Writer` |

***

#### 按数据类型分类

| 类型      | 说明                  | 基类                           | 适用场景                      |
| ------- | ------------------- | ---------------------------- | ------------------------- |
| **字节流** | 以字节为单位传输（1字节 = 8位）  | `InputStream`、`OutputStream` | 所有文件（图片、视频、音频、文本等）        |
| **字符流** | 以字符为单位传输（1字符 = 2字节） | `Reader`、`Writer`            | 纯文本文件（.txt、.java、.html 等） |

***

#### IO 流体系图

                                IO 流
                                  │
                  ┌───────────────┴───────────────┐
                  │                               │
                字节流                           字符流
                  │                               │
            ┌─────┴─────┐                   ┌─────┴─────┐
            │           │                   │           │
         InputStream  OutputStream       Reader       Writer
        （字节输入流） （字节输出流）   （字符输入流） （字符输出流）
            │           │                   │           │
        ────┴────   ────┴────           ────┴────   ────┴────
        基本流：                          基本流：
        FileInputStream                  FileReader
        FileOutputStream                 FileWriter
        
        缓冲流：                          缓冲流：
        BufferedInputStream              BufferedReader
        BufferedOutputStream             BufferedWriter
        
        序列化流：                        转换流：
        ObjectInputStream                InputStreamReader
        ObjectOutputStream               OutputStreamWriter
        
        打印流：                          打印流：
        PrintStream                      PrintWriter

***

### 3. 四大基类

| 分类      | 输入流           | 输出流            |
| ------- | ------------- | -------------- |
| **字节流** | `InputStream` | `OutputStream` |
| **字符流** | `Reader`      | `Writer`       |

**记忆口诀：**

*   字节流以 Stream 结尾
*   字符流以 Reader/Writer 结尾
*   输入流用于读取（read）
*   输出流用于写入（write）

***

### 4. 字节流 vs 字符流

| 对比项      | 字节流                        | 字符流             |
| -------- | -------------------------- | --------------- |
| **单位**   | 字节（1字节 = 8位）               | 字符（1字符 = 2字节）   |
| **适用文件** | 所有文件                       | 纯文本文件           |
| **基类**   | InputStream / OutputStream | Reader / Writer |
| **中文处理** | 需要手动处理编码                   | 自动处理编码          |
| **使用场景** | 图片、视频、音频、二进制文件             | 文本文件            |

***

## 二、FileOutputStream 字节输出流

### 1. 什么是 FileOutputStream

`FileOutputStream` 用于**将数据以字节形式写入文件**。

```java
import java.io.FileOutputStream;
```

***

### 2. 构造方法

```java
// 1. 覆盖写入（默认）
FileOutputStream fos = new FileOutputStream("a.txt");
FileOutputStream fos = new FileOutputStream(new File("a.txt"));

// 2. 追加写入
FileOutputStream fos = new FileOutputStream("a.txt", true);
FileOutputStream fos = new FileOutputStream(new File("a.txt"), true);
```

| 参数               | 说明                       |
| ---------------- | ------------------------ |
| `String/File`    | 文件路径或 File 对象            |
| `boolean append` | true：追加写入；false：覆盖写入（默认） |

***

### 3. 常用方法

```java
// 写入单个字节
fos.write(97);  // 写入字符 'a'（ASCII 码 97）

// 写入字节数组
byte[] bytes = {97, 98, 99};
fos.write(bytes);  // 写入 "abc"

// 写入字节数组的一部分
fos.write(bytes, 0, 2);  // 写入 "ab"

// 写入字符串（转换为字节数组）
String str = "Hello World";
fos.write(str.getBytes());

// 指定编码写入
fos.write(str.getBytes("UTF-8"));

// 换行
fos.write("\r\n".getBytes());  // Windows 换行
fos.write("\n".getBytes());    // Linux/Mac 换行

// 关闭流（必须）
fos.close();
```

***

### 4. 完整示例

```java
import java.io.FileOutputStream;
import java.io.IOException;

public class FileOutputStreamDemo {
    public static void main(String[] args) {
        FileOutputStream fos = null;
        try {
            // 1. 创建流对象（覆盖写入）
            fos = new FileOutputStream("a.txt");
            
            // 2. 写入数据
            // 写入单个字节
            fos.write(97);  // 'a'
            
            // 写入字节数组
            byte[] bytes = "Hello World".getBytes();
            fos.write(bytes);
            
            // 写入换行
            fos.write("\r\n".getBytes());
            
            // 写入部分字节数组
            fos.write(bytes, 0, 5);  // "Hello"
            
            System.out.println("写入成功");
            
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            // 3. 关闭流
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

***

### 5. try-with-resources 写法（推荐）

```java
import java.io.FileOutputStream;
import java.io.IOException;

public class FileOutputStreamDemo {
    public static void main(String[] args) {
        // try-with-resources：自动关闭流
        try (FileOutputStream fos = new FileOutputStream("a.txt")) {
            fos.write("Hello World".getBytes());
            System.out.println("写入成功");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## 三、FileInputStream 字节输入流

### 1. 什么是 FileInputStream

`FileInputStream` 用于**从文件中读取数据（以字节形式）**。

```java
import java.io.FileInputStream;
```

***

### 2. 构造方法

```java
// 通过路径创建
FileInputStream fis = new FileInputStream("a.txt");

// 通过 File 对象创建
FileInputStream fis = new FileInputStream(new File("a.txt"));
```

***

### 3. 常用方法

```java
// 读取单个字节（返回 -1 表示读取完毕）
int b = fis.read();

// 读取字节数组（返回读取的字节数，-1 表示读取完毕）
byte[] buffer = new byte[1024];
int len = fis.read(buffer);

// 读取全部字节（Java 9+）
byte[] allBytes = fis.readAllBytes();

// 跳过指定字节数
long skipped = fis.skip(10);

// 获取文件可读取的字节数
int available = fis.available();

// 关闭流（必须）
fis.close();
```

***

### 4. 读取方式

#### 方式一：一次读取一个字节

```java
try (FileInputStream fis = new FileInputStream("a.txt")) {
    int b;
    while ((b = fis.read()) != -1) {
        System.out.print((char) b);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// 缺点：
// - 效率低（每次只读一个字节）
// - 中文会乱码（一个中文占多个字节）
```

***

#### 方式二：一次读取一个字节数组（推荐）

```java
try (FileInputStream fis = new FileInputStream("a.txt")) {
    byte[] buffer = new byte[1024];  // 每次读取 1024 字节
    int len;
    while ((len = fis.read(buffer)) != -1) {
        // 将字节数组转换为字符串（只转换有效部分）
        String str = new String(buffer, 0, len);
        System.out.print(str);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

***

#### 方式三：一次读取全部（Java 9+）

```java
try (FileInputStream fis = new FileInputStream("a.txt")) {
    // 一次性读取全部字节
    byte[] bytes = fis.readAllBytes();
    String content = new String(bytes);
    System.out.println(content);
} catch (IOException e) {
    e.printStackTrace();
}

// 注意：只适用于小文件，大文件会内存溢出
```

***

#### 方式四：使用 available() 读取

```java
try (FileInputStream fis = new FileInputStream("a.txt")) {
    // 获取文件大小
    int size = fis.available();
    byte[] buffer = new byte[size];
    
    // 一次性读取全部
    fis.read(buffer);
    
    String content = new String(buffer);
    System.out.println(content);
} catch (IOException e) {
    e.printStackTrace();
}

// 注意：只适用于小文件，大文件会内存溢出
```

***

### 5. 完整示例

```java
import java.io.FileInputStream;
import java.io.IOException;

public class FileInputStreamDemo {
    public static void main(String[] args) {
        try (FileInputStream fis = new FileInputStream("a.txt")) {
            byte[] buffer = new byte[1024];
            int len;
            StringBuilder sb = new StringBuilder();
            
            while ((len = fis.read(buffer)) != -1) {
                sb.append(new String(buffer, 0, len));
            }
            
            System.out.println("文件内容：");
            System.out.println(sb.toString());
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## 四、文件复制案例（字节流）

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class FileCopyDemo {
    public static void main(String[] args) {
        // 复制文件（适用于所有文件类型）
        try (
            FileInputStream fis = new FileInputStream("source.jpg");
            FileOutputStream fos = new FileOutputStream("copy.jpg")
        ) {
            byte[] buffer = new byte[1024];
            int len;
            
            while ((len = fis.read(buffer)) != -1) {
                fos.write(buffer, 0, len);
            }
            
            System.out.println("复制成功");
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## 五、FileReader 字符输入流

### 1. 什么是 FileReader

`FileReader` 用于**从文本文件中读取数据（以字符形式）**，自动处理编码。

```java
import java.io.FileReader;
```

***

### 2. 构造方法

```java
// 通过路径创建（使用默认编码）
FileReader fr = new FileReader("a.txt");

// 通过 File 对象创建
FileReader fr = new FileReader(new File("a.txt"));

// 指定编码（JDK 11+）
FileReader fr = new FileReader("a.txt", Charset.forName("UTF-8"));
```

***

### 3. 常用方法

```java
// 读取单个字符（返回 -1 表示读取完毕）
int ch = fr.read();

// 读取字符数组（返回读取的字符数，-1 表示读取完毕）
char[] buffer = new char[1024];
int len = fr.read(buffer);

// 关闭流（必须）
fr.close();
```

***

### 4. 读取方式

#### 方式一：一次读取一个字符

```java
try (FileReader fr = new FileReader("a.txt")) {
    int ch;
    while ((ch = fr.read()) != -1) {
        System.out.print((char) ch);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// 优点：中文不会乱码
// 缺点：效率低
```

***

#### 方式二：一次读取一个字符数组（推荐）

```java
try (FileReader fr = new FileReader("a.txt")) {
    char[] buffer = new char[1024];
    int len;
    while ((len = fr.read(buffer)) != -1) {
        String str = new String(buffer, 0, len);
        System.out.print(str);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

***

### 5. 完整示例

```java
import java.io.FileReader;
import java.io.IOException;

public class FileReaderDemo {
    public static void main(String[] args) {
        try (FileReader fr = new FileReader("a.txt")) {
            char[] buffer = new char[1024];
            int len;
            StringBuilder sb = new StringBuilder();
            
            while ((len = fr.read(buffer)) != -1) {
                sb.append(new String(buffer, 0, len));
            }
            
            System.out.println("文件内容：");
            System.out.println(sb.toString());
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## 六、FileWriter 字符输出流

### 1. 什么是 FileWriter

`FileWriter` 用于**将数据以字符形式写入文本文件**。

```java
import java.io.FileWriter;
```

***

### 2. 构造方法

```java
// 覆盖写入（默认）
FileWriter fw = new FileWriter("a.txt");
FileWriter fw = new FileWriter(new File("a.txt"));

// 追加写入
FileWriter fw = new FileWriter("a.txt", true);

// 指定编码（JDK 11+）
FileWriter fw = new FileWriter("a.txt", Charset.forName("UTF-8"));
```

***

### 3. 常用方法

```java
// 写入单个字符
fw.write('A');
fw.write(97);  // 写入 'a'

// 写入字符串
fw.write("Hello World");

// 写入字符串的一部分
fw.write("Hello World", 0, 5);  // 写入 "Hello"

// 写入字符数组
char[] chars = {'H', 'e', 'l', 'l', 'o'};
fw.write(chars);

// 写入字符数组的一部分
fw.write(chars, 0, 3);  // 写入 "Hel"

// 换行
fw.write("\r\n");

// 刷新缓冲区（将缓冲区数据写入文件）
fw.flush();

// 关闭流（会自动 flush）
fw.close();
```

***

### 4. flush() 和 close() 的区别

| 方法        | 作用            | 调用后状态 |
| --------- | ------------- | ----- |
| `flush()` | 刷新缓冲区，将数据写入文件 | 流仍然可用 |
| `close()` | 先刷新缓冲区，再关闭流   | 流不可用  |

```java
// 字符流有缓冲区，必须 flush 或 close 才能将数据写入文件
fw.write("Hello");
// 此时数据在缓冲区，还没写入文件

fw.flush();  // 或 fw.close()
// 此时数据才真正写入文件
```

***

### 5. 完整示例

```java
import java.io.FileWriter;
import java.io.IOException;

public class FileWriterDemo {
    public static void main(String[] args) {
        try (FileWriter fw = new FileWriter("a.txt")) {
            // 写入单个字符
            fw.write('H');
            fw.write('e');
            fw.write('l');
            fw.write('l');
            fw.write('o');
            
            // 换行
            fw.write("\r\n");
            
            // 写入字符串
            fw.write("World");
            fw.write("\r\n");
            
            // 写入中文
            fw.write("你好，世界");
            
            System.out.println("写入成功");
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## 七、文件复制案例（字符流）

```java
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class TextFileCopyDemo {
    public static void main(String[] args) {
        // 复制文本文件
        try (
            FileReader fr = new FileReader("source.txt");
            FileWriter fw = new FileWriter("copy.txt")
        ) {
            char[] buffer = new char[1024];
            int len;
            
            while ((len = fr.read(buffer)) != -1) {
                fw.write(buffer, 0, len);
            }
            
            System.out.println("复制成功");
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## 八、缓冲流

### 1. 什么是缓冲流

缓冲流在基本流的基础上增加了**缓冲区**，减少 IO 次数，提高读写效率。

    普通流：每次读写都访问磁盘
    缓冲流：先读写到缓冲区，缓冲区满了再访问磁盘

    ┌─────────┐                    ┌─────────┐
    │  程序   │ ←──── 缓冲区 ────→ │  磁盘   │
    └─────────┘    (8192字节)      └─────────┘

### 2. 缓冲流分类

| 类型        | 输入流                   | 输出流                    |
| --------- | --------------------- | ---------------------- |
| **字节缓冲流** | `BufferedInputStream` | `BufferedOutputStream` |
| **字符缓冲流** | `BufferedReader`      | `BufferedWriter`       |

***

### 3. 字节缓冲流

#### BufferedInputStream

```java
import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;

public class BufferedInputStreamDemo {
    public static void main(String[] args) {
        try (BufferedInputStream bis = new BufferedInputStream(
                new FileInputStream("a.txt"))) {
            
            byte[] buffer = new byte[1024];
            int len;
            while ((len = bis.read(buffer)) != -1) {
                System.out.print(new String(buffer, 0, len));
            }
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### BufferedOutputStream

```java
import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class BufferedOutputStreamDemo {
    public static void main(String[] args) {
        try (BufferedOutputStream bos = new BufferedOutputStream(
                new FileOutputStream("a.txt"))) {
            
            bos.write("Hello World".getBytes());
            // 缓冲流也有缓冲区，close() 时会自动 flush
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 使用缓冲流复制文件（高效）

```java
import java.io.*;

public class BufferedFileCopy {
    public static void main(String[] args) {
        try (
            BufferedInputStream bis = new BufferedInputStream(
                new FileInputStream("source.mp4"));
            BufferedOutputStream bos = new BufferedOutputStream(
                new FileOutputStream("copy.mp4"))
        ) {
            byte[] buffer = new byte[8192];  // 8KB
            int len;
            while ((len = bis.read(buffer)) != -1) {
                bos.write(buffer, 0, len);
            }
            System.out.println("复制成功");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 4. 字符缓冲流

#### BufferedReader（特有方法：readLine）

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class BufferedReaderDemo {
    public static void main(String[] args) {
        try (BufferedReader br = new BufferedReader(new FileReader("a.txt"))) {
            
            // 特有方法：一次读取一行（不包含换行符）
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### BufferedWriter（特有方法：newLine）

```java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class BufferedWriterDemo {
    public static void main(String[] args) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter("a.txt"))) {
            
            bw.write("第一行");
            bw.newLine();  // 特有方法：写入系统换行符
            
            bw.write("第二行");
            bw.newLine();
            
            bw.write("第三行");
            
            System.out.println("写入成功");
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 5. 缓冲流特有方法总结

| 类                | 特有方法         | 说明                       |
| ---------------- | ------------ | ------------------------ |
| `BufferedReader` | `readLine()` | 读取一行（不含换行符），返回 null 表示结束 |
| `BufferedWriter` | `newLine()`  | 写入系统换行符（跨平台）             |

***

### 6. 普通流 vs 缓冲流性能对比

```java
// 测试复制一个 100MB 的文件
// 普通流（每次1字节）：约 500 秒
// 普通流（每次1024字节）：约 0.5 秒
// 缓冲流（每次1字节）：约 1.5 秒
// 缓冲流（每次1024字节）：约 0.15 秒

// 结论：使用缓冲流 + 字节数组，效率最高
```

***

## 九、转换流

### 1. 什么是转换流

转换流用于**字节流和字符流之间的转换**，可以**指定编码**读写文件。

| 转换流                  | 说明               |
| -------------------- | ---------------- |
| `InputStreamReader`  | 字节流 → 字符流（读取时转换） |
| `OutputStreamWriter` | 字符流 → 字节流（写入时转换） |

***

### 2. 为什么需要转换流

```java
// 问题：FileReader 使用默认编码，如果文件编码不同会乱码
// GBK 编码的文件，用 UTF-8 读取会乱码

// 解决：使用转换流指定编码
```

***

### 3. InputStreamReader

```java
import java.io.*;

public class InputStreamReaderDemo {
    public static void main(String[] args) {
        // 指定 GBK 编码读取文件
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(
                    new FileInputStream("gbk.txt"), "GBK"))) {
            
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 4. OutputStreamWriter

```java
import java.io.*;

public class OutputStreamWriterDemo {
    public static void main(String[] args) {
        // 指定 GBK 编码写入文件
        try (BufferedWriter bw = new BufferedWriter(
                new OutputStreamWriter(
                    new FileOutputStream("gbk.txt"), "GBK"))) {
            
            bw.write("你好，世界");
            bw.newLine();
            bw.write("Hello World");
            
            System.out.println("写入成功");
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 5. 转换文件编码

```java
import java.io.*;

public class ConvertEncodingDemo {
    public static void main(String[] args) {
        // 将 GBK 编码的文件转换为 UTF-8 编码
        try (
            BufferedReader br = new BufferedReader(
                new InputStreamReader(
                    new FileInputStream("gbk.txt"), "GBK"));
            BufferedWriter bw = new BufferedWriter(
                new OutputStreamWriter(
                    new FileOutputStream("utf8.txt"), "UTF-8"))
        ) {
            String line;
            while ((line = br.readLine()) != null) {
                bw.write(line);
                bw.newLine();
            }
            System.out.println("转换成功");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## 十、序列化流

### 1. 什么是序列化

| 概念       | 说明                    |
| -------- | --------------------- |
| **序列化**  | 将对象转换为字节序列（写入文件/网络传输） |
| **反序列化** | 将字节序列恢复为对象（从文件/网络读取）  |

    对象 ──序列化──→ 字节序列 ──保存──→ 文件
    文件 ──读取──→ 字节序列 ──反序列化──→ 对象

***

### 2. Serializable 接口

```java
import java.io.Serializable;

// 对象要序列化，必须实现 Serializable 接口
public class User implements Serializable {
    
    // 序列化版本号（建议添加）
    private static final long serialVersionUID = 1L;
    
    private String name;
    private int age;
    
    // transient 修饰的属性不会被序列化
    private transient String password;
    
    public User(String name, int age, String password) {
        this.name = name;
        this.age = age;
        this.password = password;
    }
    
    @Override
    public String toString() {
        return "User{name='" + name + "', age=" + age + ", password='" + password + "'}";
    }
}
```

***

### 3. ObjectOutputStream（序列化）

```java
import java.io.*;

public class SerializeDemo {
    public static void main(String[] args) {
        User user = new User("张三", 18, "123456");
        
        try (ObjectOutputStream oos = new ObjectOutputStream(
                new FileOutputStream("user.dat"))) {
            
            oos.writeObject(user);
            System.out.println("序列化成功");
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 4. ObjectInputStream（反序列化）

```java
import java.io.*;

public class DeserializeDemo {
    public static void main(String[] args) {
        try (ObjectInputStream ois = new ObjectInputStream(
                new FileInputStream("user.dat"))) {
            
            User user = (User) ois.readObject();
            System.out.println("反序列化成功：" + user);
            // 输出：User{name='张三', age=18, password='null'}
            // password 是 transient，不会被序列化
            
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 5. 序列化注意事项

| 注意点                 | 说明                              |
| ------------------- | ------------------------------- |
| 必须实现 `Serializable` | 否则抛出 `NotSerializableException` |
| `serialVersionUID`  | 建议显式定义，否则修改类后反序列化会失败            |
| `transient` 关键字     | 修饰的属性不会被序列化                     |
| 静态变量                | 不会被序列化（属于类，不属于对象）               |
| 关联对象                | 关联的对象也必须实现 `Serializable`       |

***

## 十一、打印流

### 1. 什么是打印流

打印流只有输出，没有输入。提供了便捷的打印方法。

| 打印流           | 说明                                 |
| ------------- | ---------------------------------- |
| `PrintStream` | 字节打印流（`System.out` 就是 PrintStream） |
| `PrintWriter` | 字符打印流                              |

***

### 2. PrintStream

```java
import java.io.*;

public class PrintStreamDemo {
    public static void main(String[] args) {
        try (PrintStream ps = new PrintStream("a.txt")) {
            
            ps.println("Hello");  // 打印并换行
            ps.println(100);
            ps.println(true);
            
            ps.print("World");    // 打印不换行
            
            ps.printf("姓名：%s，年龄：%d%n", "张三", 18);  // 格式化打印
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 3. PrintWriter

```java
import java.io.*;

public class PrintWriterDemo {
    public static void main(String[] args) {
        // 第二个参数 true 表示自动刷新
        try (PrintWriter pw = new PrintWriter(new FileWriter("a.txt"), true)) {
            
            pw.println("Hello");
            pw.println("World");
            pw.println("你好，世界");
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 4. 重定向标准输出

```java
import java.io.*;

public class RedirectDemo {
    public static void main(String[] args) throws IOException {
        // 保存原来的标准输出
        PrintStream console = System.out;
        
        // 重定向到文件
        PrintStream fileOut = new PrintStream("log.txt");
        System.setOut(fileOut);
        
        // 此时 System.out.println 会输出到文件
        System.out.println("这条消息会写入文件");
        
        // 恢复标准输出
        System.setOut(console);
        System.out.println("这条消息会输出到控制台");
        
        fileOut.close();
    }
}
```

***

## 十二、Files 工具类（Java 7+）

### 1. 什么是 Files

`Files` 是 Java NIO 提供的文件操作工具类，提供了大量静态方法简化文件操作。

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
```

***

### 2. 读取文件

```java
import java.nio.file.*;
import java.util.List;

public class FilesReadDemo {
    public static void main(String[] args) throws Exception {
        Path path = Paths.get("a.txt");
        
        // 1. 读取所有字节
        byte[] bytes = Files.readAllBytes(path);
        String content = new String(bytes);
        
        // 2. 读取所有行（返回 List）
        List<String> lines = Files.readAllLines(path);
        lines.forEach(System.out::println);
        
        // 3. 读取为字符串（Java 11+）
        String text = Files.readString(path);
        
        // 4. 读取为流（大文件推荐）
        Files.lines(path).forEach(System.out::println);
    }
}
```

***

### 3. 写入文件

```java
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;

public class FilesWriteDemo {
    public static void main(String[] args) throws Exception {
        Path path = Paths.get("a.txt");
        
        // 1. 写入字节数组
        Files.write(path, "Hello World".getBytes());
        
        // 2. 写入行（集合）
        List<String> lines = Arrays.asList("第一行", "第二行", "第三行");
        Files.write(path, lines);
        
        // 3. 追加写入
        Files.write(path, "追加内容".getBytes(), 
            StandardOpenOption.APPEND);
        
        // 4. 写入字符串（Java 11+）
        Files.writeString(path, "Hello World");
    }
}
```

***

### 4. 文件操作

```java
import java.nio.file.*;

public class FilesOperationDemo {
    public static void main(String[] args) throws Exception {
        Path source = Paths.get("source.txt");
        Path target = Paths.get("target.txt");
        Path dir = Paths.get("test/a/b/c");
        
        // 1. 复制文件
        Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
        
        // 2. 移动/重命名文件
        Files.move(source, target, StandardCopyOption.REPLACE_EXISTING);
        
        // 3. 删除文件
        Files.delete(source);
        Files.deleteIfExists(source);  // 不存在不抛异常
        
        // 4. 创建目录
        Files.createDirectories(dir);  // 创建多级目录
        
        // 5. 判断文件属性
        boolean exists = Files.exists(source);
        boolean isDir = Files.isDirectory(source);
        boolean isFile = Files.isRegularFile(source);
        boolean readable = Files.isReadable(source);
        boolean writable = Files.isWritable(source);
        
        // 6. 获取文件大小
        long size = Files.size(source);
    }
}
```

***

### 5. 遍历目录

```java
import java.nio.file.*;
import java.io.IOException;

public class FilesWalkDemo {
    public static void main(String[] args) throws IOException {
        Path dir = Paths.get(".");
        
        // 1. 遍历目录（一层）
        Files.list(dir).forEach(System.out::println);
        
        // 2. 递归遍历目录
        Files.walk(dir)
            .filter(Files::isRegularFile)  // 只要文件
            .forEach(System.out::println);
        
        // 3. 查找文件
        Files.walk(dir)
            .filter(p -> p.toString().endsWith(".java"))
            .forEach(System.out::println);
    }
}
```

***

### 6. Files 常用方法速查表

| 方法                          | 说明                |
| --------------------------- | ----------------- |
| `readAllBytes(Path)`        | 读取所有字节            |
| `readAllLines(Path)`        | 读取所有行             |
| `readString(Path)`          | 读取为字符串（Java 11+）  |
| `lines(Path)`               | 读取为 Stream（大文件推荐） |
| `write(Path, byte[])`       | 写入字节数组            |
| `write(Path, Iterable)`     | 写入多行              |
| `writeString(Path, String)` | 写入字符串（Java 11+）   |
| `copy(Path, Path)`          | 复制文件              |
| `move(Path, Path)`          | 移动/重命名文件          |
| `delete(Path)`              | 删除文件              |
| `createDirectories(Path)`   | 创建多级目录            |
| `exists(Path)`              | 判断是否存在            |
| `size(Path)`                | 获取文件大小            |
| `list(Path)`                | 遍历目录（一层）          |
| `walk(Path)`                | 递归遍历目录            |

***

## 十三、字节流 vs 字符流 总结

| 对比项      | 字节流                                        | 字符流                             |
| -------- | ------------------------------------------ | ------------------------------- |
| **基类**   | InputStream / OutputStream                 | Reader / Writer                 |
| **实现类**  | FileInputStream / FileOutputStream         | FileReader / FileWriter         |
| **缓冲流**  | BufferedInputStream / BufferedOutputStream | BufferedReader / BufferedWriter |
| **单位**   | 字节（byte）                                   | 字符（char）                        |
| **缓冲区**  | 无（直接写入）                                    | 有（需要 flush）                     |
| **适用文件** | 所有文件                                       | 纯文本文件                           |
| **中文处理** | 可能乱码                                       | 不会乱码                            |
| **使用场景** | 图片、视频、音频等                                  | 文本文件                            |

**选择建议：**

*   纯文本文件 → 使用字符流（FileReader / FileWriter）
*   其他文件（图片、视频等） → 使用字节流（FileInputStream / FileOutputStream）
*   需要高效读写 → 使用缓冲流
*   需要指定编码 → 使用转换流
*   不确定类型 → 使用字节流（万能）

***

## 十四、Properties 集合

### 1. 什么是 Properties

`Properties` 是一个**双列集合**，用于存储**键值对配置信息**，键和值都是字符串。

```java
import java.util.Properties;

// Properties 继承自 Hashtable<Object, Object>
// 但通常只存储 String 类型的键值对
```

***

### 2. 基本使用

```java
// 创建 Properties 对象
Properties props = new Properties();

// 添加键值对
props.setProperty("username", "admin");
props.setProperty("password", "123456");
props.setProperty("url", "jdbc:mysql://localhost:3306/mydb");

// 获取值
String username = props.getProperty("username");  // "admin"
String password = props.getProperty("password");  // "123456"

// 获取值（带默认值）
String port = props.getProperty("port", "3306");  // 如果不存在，返回默认值

// 获取所有键
Set<String> keys = props.stringPropertyNames();
for (String key : keys) {
    System.out.println(key + " = " + props.getProperty(key));
}
```

***

### 3. 读取配置文件

#### 配置文件格式（config.properties）

```properties
# 这是注释
username=admin
password=123456
url=jdbc:mysql://localhost:3306/mydb
driver=com.mysql.cj.jdbc.Driver
```

***

#### 读取配置文件

```java
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

public class PropertiesDemo {
    public static void main(String[] args) {
        Properties props = new Properties();
        
        try (FileReader fr = new FileReader("config.properties")) {
            // 从文件加载配置
            props.load(fr);
            
            // 获取配置项
            String username = props.getProperty("username");
            String password = props.getProperty("password");
            String url = props.getProperty("url");
            
            System.out.println("username: " + username);
            System.out.println("password: " + password);
            System.out.println("url: " + url);
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 4. 写入配置文件

```java
import java.io.FileWriter;
import java.io.IOException;
import java.util.Properties;

public class PropertiesWriteDemo {
    public static void main(String[] args) {
        Properties props = new Properties();
        
        // 添加配置项
        props.setProperty("username", "admin");
        props.setProperty("password", "123456");
        props.setProperty("url", "jdbc:mysql://localhost:3306/mydb");
        
        try (FileWriter fw = new FileWriter("config.properties")) {
            // 写入到文件（第二个参数是注释）
            props.store(fw, "Database Configuration");
            
            System.out.println("写入成功");
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 5. 从类路径读取配置文件

```java
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class PropertiesClasspathDemo {
    public static void main(String[] args) {
        Properties props = new Properties();
        
        // 从类路径加载配置文件（src 或 resources 目录）
        try (InputStream is = PropertiesClasspathDemo.class.getClassLoader()
                .getResourceAsStream("config.properties")) {
            
            props.load(is);
            
            String username = props.getProperty("username");
            System.out.println("username: " + username);
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 6. Properties 方法速查表

| 方法                                     | 说明        |
| -------------------------------------- | --------- |
| `setProperty(key, value)`              | 设置键值对     |
| `getProperty(key)`                     | 获取值       |
| `getProperty(key, default)`            | 获取值（带默认值） |
| `stringPropertyNames()`                | 获取所有键     |
| `load(Reader/InputStream)`             | 从文件加载配置   |
| `store(Writer/OutputStream, comments)` | 写入到文件     |

***

## 十五、Hutool 工具

### 1. 什么是 Hutool

Hutool 是一个**Java 工具类库**，提供了丰富的工具方法，简化开发。

官网：<https://hutool.cn/>

***

### 2. 引入依赖

```xml
<!-- Maven 依赖 -->
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.25</version>
</dependency>
```

***

### 3. 文件操作（FileUtil）

```java
import cn.hutool.core.io.FileUtil;

// 1. 读取文件内容
String content = FileUtil.readUtf8String("a.txt");

// 2. 写入文件内容
FileUtil.writeUtf8String("Hello World", "a.txt");

// 3. 追加写入
FileUtil.appendUtf8String("追加内容", "a.txt");

// 4. 复制文件
FileUtil.copy("source.txt", "copy.txt", true);

// 5. 删除文件
FileUtil.del("a.txt");

// 6. 创建目录
FileUtil.mkdir("test/a/b/c");

// 7. 获取文件扩展名
String ext = FileUtil.extName("a.txt");  // "txt"

// 8. 获取文件名（不含扩展名）
String name = FileUtil.mainName("a.txt");  // "a"

// 9. 判断文件是否存在
boolean exists = FileUtil.exist("a.txt");

// 10. 获取文件大小
long size = FileUtil.size(new File("a.txt"));
```

***

### 4. 字符串操作（StrUtil）

```java
import cn.hutool.core.util.StrUtil;

// 1. 判断是否为空
StrUtil.isEmpty("");        // true
StrUtil.isNotEmpty("abc");  // true
StrUtil.isBlank("   ");     // true（空白字符也算空）
StrUtil.isNotBlank("abc");  // true

// 2. 格式化字符串
String str = StrUtil.format("Hello, {}!", "World");  // "Hello, World!"
String str2 = StrUtil.format("{}年{}月{}日", 2024, 1, 7);  // "2024年1月7日"

// 3. 去除空白
StrUtil.trim("  abc  ");  // "abc"

// 4. 分割字符串
String[] arr = StrUtil.split("a,b,c", ",");

// 5. 截取字符串
String sub = StrUtil.sub("Hello", 0, 3);  // "Hel"
```

***

### 5. 日期操作（DateUtil）

```java
import cn.hutool.core.date.DateUtil;

// 1. 获取当前时间
Date now = DateUtil.date();
String nowStr = DateUtil.now();  // "2024-01-07 12:30:45"
String today = DateUtil.today();  // "2024-01-07"

// 2. 格式化日期
String str = DateUtil.format(now, "yyyy-MM-dd HH:mm:ss");

// 3. 解析日期
Date date = DateUtil.parse("2024-01-07");
Date dateTime = DateUtil.parse("2024-01-07 12:30:45");

// 4. 日期运算
Date tomorrow = DateUtil.offsetDay(now, 1);  // 明天
Date nextWeek = DateUtil.offsetWeek(now, 1);  // 下周
Date nextMonth = DateUtil.offsetMonth(now, 1);  // 下月

// 5. 计算日期差
long days = DateUtil.between(date1, date2, DateUnit.DAY);

// 6. 获取年月日
int year = DateUtil.year(now);
int month = DateUtil.month(now) + 1;  // 月份从0开始
int day = DateUtil.dayOfMonth(now);
```

***

### 6. 集合操作（CollUtil）

```java
import cn.hutool.core.collection.CollUtil;

// 1. 创建集合
List<String> list = CollUtil.newArrayList("a", "b", "c");
Set<String> set = CollUtil.newHashSet("a", "b", "c");

// 2. 判断是否为空
CollUtil.isEmpty(list);      // false
CollUtil.isNotEmpty(list);   // true

// 3. 集合操作
CollUtil.join(list, ",");    // "a,b,c"
CollUtil.reverse(list);      // 反转
CollUtil.sort(list, null);   // 排序
```

***

### 7. 其他常用工具

```java
// 1. 随机工具（RandomUtil）
int num = RandomUtil.randomInt(1, 100);  // 1-99 的随机数
String str = RandomUtil.randomString(10);  // 10位随机字符串

// 2. 唯一ID（IdUtil）
String uuid = IdUtil.simpleUUID();  // 简单UUID（无横线）
String objectId = IdUtil.objectId();  // MongoDB ObjectId

// 3. 加密解密（SecureUtil）
String md5 = SecureUtil.md5("123456");  // MD5 加密
String sha256 = SecureUtil.sha256("123456");  // SHA256 加密

// 4. JSON 操作（JSONUtil）
String json = JSONUtil.toJsonStr(obj);  // 对象转 JSON
User user = JSONUtil.toBean(json, User.class);  // JSON 转对象
```

***

## 十六、IO 流总结脑图

    Java IO 流
        │
        ├── 基本概念
        │     ├── 输入流：读取数据（外部 → 程序）
        │     ├── 输出流：写出数据（程序 → 外部）
        │     ├── 字节流：以字节为单位，适用所有文件
        │     └── 字符流：以字符为单位，适用文本文件
        │
        ├── 字节流
        │     ├── FileInputStream / FileOutputStream（基本流）
        │     ├── BufferedInputStream / BufferedOutputStream（缓冲流）
        │     ├── ObjectInputStream / ObjectOutputStream（序列化流）
        │     └── PrintStream（打印流）
        │
        ├── 字符流
        │     ├── FileReader / FileWriter（基本流）
        │     ├── BufferedReader / BufferedWriter（缓冲流）
        │     │     ├── readLine()：读取一行
        │     │     └── newLine()：写入换行
        │     ├── InputStreamReader / OutputStreamWriter（转换流）
        │     └── PrintWriter（打印流）
        │
        ├── NIO 工具类
        │     └── Files
        │           ├── readAllBytes() / readAllLines() / readString()
        │           ├── write() / writeString()
        │           ├── copy() / move() / delete()
        │           └── walk() / list()
        │
        ├── Properties
        │     ├── setProperty() / getProperty()
        │     └── load() / store()
        │
        └── 使用建议
              ├── 文本文件 → 字符流 + 缓冲流
              ├── 二进制文件 → 字节流 + 缓冲流
              ├── 指定编码 → 转换流
              ├── 简单操作 → Files 工具类
              └── 关闭资源 → try-with-resources

***

## 十七、快速参考表

### IO 流分类

| 流类型       | 输入流                 | 输出流                       | 说明     |
| --------- | ------------------- | ------------------------- | ------ |
| **字节流**   | FileInputStream     | FileOutputStream          | 所有文件   |
| **字符流**   | FileReader          | FileWriter                | 纯文本文件  |
| **字节缓冲流** | BufferedInputStream | BufferedOutputStream      | 高效读写   |
| **字符缓冲流** | BufferedReader      | BufferedWriter            | 高效读写文本 |
| **转换流**   | InputStreamReader   | OutputStreamWriter        | 指定编码   |
| **序列化流**  | ObjectInputStream   | ObjectOutputStream        | 对象持久化  |
| **打印流**   | -                   | PrintStream / PrintWriter | 便捷输出   |

### 常用方法

| 类                  | 读取方法                      | 写入方法                        | 特有方法             |
| ------------------ | ------------------------- | --------------------------- | ---------------- |
| `FileInputStream`  | `read()` / `read(byte[])` | -                           | `readAllBytes()` |
| `FileOutputStream` | -                         | `write()` / `write(byte[])` | -                |
| `FileReader`       | `read()` / `read(char[])` | -                           | -                |
| `FileWriter`       | -                         | `write()` / `write(String)` | `flush()`        |
| `BufferedReader`   | `read()` / `read(char[])` | -                           | `readLine()`     |
| `BufferedWriter`   | -                         | `write()`                   | `newLine()`      |

### Files 工具类

| 方法                             | 说明               |
| ------------------------------ | ---------------- |
| `Files.readAllBytes(path)`     | 读取所有字节           |
| `Files.readAllLines(path)`     | 读取所有行            |
| `Files.readString(path)`       | 读取为字符串（Java 11+） |
| `Files.write(path, bytes)`     | 写入字节             |
| `Files.writeString(path, str)` | 写入字符串（Java 11+）  |
| `Files.copy(src, dest)`        | 复制文件             |
| `Files.delete(path)`           | 删除文件             |
| `Files.walk(dir)`              | 递归遍历目录           |

