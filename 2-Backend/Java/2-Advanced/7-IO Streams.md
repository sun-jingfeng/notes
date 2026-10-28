## I. Introduction to I/O and Its Categories

### 1. What Is I/O?

I/O (Input/Output) transfers data between a program and external resources (files, networks, etc.).

    Input: read external data into the program (read files, receive network data)
    Output: write program data externally (write files, send network data)

**Analogy:**

    I/O = water pipes
    Input stream = inlet pipe (flows from outside into the program)
    Output stream = outlet pipe (flows from the program to the outside)

***

### 2. I/O Stream Categories

#### By Direction

| Direction | Description | Base classes |
| ------- | ------------ | ----------------------- |
| **Input stream** | Reads data (external resource → program) | `InputStream`, `Reader` |
| **Output stream** | Writes data (program → external resource) | `OutputStream`, `Writer` |

***

#### By Data Type

| Type | Description | Base classes | Use cases |
| ------- | ------------------- | ---------------------------- | ------------------------- |
| **Byte stream** | Transfers bytes (1 byte = 8 bits) | `InputStream`, `OutputStream` | All files (images, video, audio, text, etc.) |
| **Character stream** | Reads/writes UTF-16 code units (char) | `Reader`, `Writer` | Plain-text files (.txt, .java, .html, etc.) |

> Java's `char` is a 16-bit UTF-16 code unit, not necessarily a complete Unicode character: supplementary characters (such as some emoji) require two chars. File byte counts depend on the encoding; for example, "中" occupies 3 bytes in UTF-8. "1 character = 2 bytes" is not a general rule.

***

#### I/O Stream Hierarchy

                                 I/O streams
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
              Byte streams                      Character streams
                    │                                   │
            ┌───────┴───────┐                 ┌─────────┴─────────┐
            │               │                 │                   │
       InputStream    OutputStream         Reader              Writer
      (byte input)    (byte output)   (character input)  (character output)

        Basic streams:                    Basic streams:
        FileInputStream                   FileReader
        FileOutputStream                  FileWriter

        Buffered streams:                 Buffered streams:
        BufferedInputStream               BufferedReader
        BufferedOutputStream              BufferedWriter

        Serialization streams:            Conversion streams:
        ObjectInputStream                 InputStreamReader
        ObjectOutputStream                OutputStreamWriter

        Print streams:                    Print streams:
        PrintStream                       PrintWriter

***

### 3. Four Base Classes

| Category | Input | Output |
| ------- | ------------- | -------------- |
| **Byte streams** | `InputStream` | `OutputStream` |
| **Character streams** | `Reader` | `Writer` |

**Memory Aid:**

*   Byte stream names end in Stream.
*   Character stream names end in Reader/Writer.
*   Input streams read.
*   Output streams write.

***

### 4. Byte Streams vs Character Streams

| Comparison | Byte streams | Character streams |
| -------- | -------------------------- | --------------- |
| **Unit** | Byte (1 byte = 8 bits) | UTF-16 code unit (char) |
| **File types** | All files | Plain-text files |
| **Base classes** | InputStream / OutputStream | Reader / Writer |
| **Chinese text** | Encoding must be handled explicitly | Encoding handled automatically |
| **Use cases** | Images, video, audio, binary files | Text files |

***

## II. FileOutputStream: Byte Output

### 1. What Is FileOutputStream?

`FileOutputStream` **writes data to a file as bytes**.

```java
import java.io.FileOutputStream;
```

***

### 2. Constructors

```java
// 1. Overwrite (default)
FileOutputStream fos1 = new FileOutputStream("a.txt");
FileOutputStream fos2 = new FileOutputStream(new File("a.txt"));

// 2. Append
FileOutputStream fos3 = new FileOutputStream("a.txt", true);
FileOutputStream fos4 = new FileOutputStream(new File("a.txt"), true);
```

| Parameter | Description |
| ---------------- | ------------------------ |
| `String/File` | File path or File object |
| `boolean append` | true: append; false: overwrite (default) |

***

### 3. Common Methods

```java
// Write one byte
fos.write(97);  // Write character 'a' (ASCII code 97)

// Write a byte array
byte[] bytes = {97, 98, 99};
fos.write(bytes);  // Write "abc"

// Write part of a byte array
fos.write(bytes, 0, 2);  // Write "ab"

// Write a string (convert to a byte array)
String str = "Hello World";
fos.write(str.getBytes());

// Write using a specified encoding
fos.write(str.getBytes(StandardCharsets.UTF_8));

// Newline
fos.write("\r\n".getBytes());  // Windows newline
fos.write("\n".getBytes());    // Linux/Mac newline

// Close the stream (required)
fos.close();
```

***

### 4. Complete Example

```java
import java.io.FileOutputStream;
import java.io.IOException;

public class FileOutputStreamDemo {
    public static void main(String[] args) {
        FileOutputStream fos = null;
        try {
            // 1. Create the stream (overwrite)
            fos = new FileOutputStream("a.txt");

            // 2. Write data
            // Write one byte
            fos.write(97);  // 'a'

            // Write a byte array
            byte[] bytes = "Hello World".getBytes();
            fos.write(bytes);

            // Write a newline
            fos.write("\r\n".getBytes());

            // Write part of a byte array
            fos.write(bytes, 0, 5);  // "Hello"

            System.out.println("Write succeeded");

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            // 3. Close the stream
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

### 5. try-with-resources (Recommended)

```java
import java.io.FileOutputStream;
import java.io.IOException;

public class FileOutputStreamDemo {
    public static void main(String[] args) {
        // try-with-resources: close the stream automatically
        try (FileOutputStream fos = new FileOutputStream("a.txt")) {
            fos.write("Hello World".getBytes());
            System.out.println("Write succeeded");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## III. FileInputStream: Byte Input

### 1. What Is FileInputStream?

`FileInputStream` **reads data from a file as bytes**.

```java
import java.io.FileInputStream;
```

***

### 2. Constructors

```java
// Create from a path
FileInputStream fis1 = new FileInputStream("a.txt");

// Create from a File object
FileInputStream fis2 = new FileInputStream(new File("a.txt"));
```

***

### 3. Common Methods

```java
// Read one byte (-1 indicates end of input)
int b = fis.read();

// Read into a byte array (returns the number of bytes read, or -1 at end of input)
byte[] buffer = new byte[1024];
int len = fis.read(buffer);

// Read all bytes (JDK 9+)
byte[] allBytes = fis.readAllBytes();

// Skip a specified number of bytes
long skipped = fis.skip(10);

// Estimate the bytes readable without blocking (for a file: the remaining bytes)
int available = fis.available();

// Close the stream (required)
fis.close();
```

***

### 4. Reading Approaches

#### Approach 1: One Byte at a Time

```java
try (FileInputStream fis = new FileInputStream("a.txt")) {
    int b;
    while ((b = fis.read()) != -1) {
        System.out.print((char) b);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// Drawbacks:
// - Inefficient (reads only one byte per call)
// - Garbles Chinese text (one Chinese character occupies multiple bytes)
```

***

#### Approach 2: A Byte Array at a Time (Recommended)

```java
try (FileInputStream fis = new FileInputStream("a.txt")) {
    byte[] buffer = new byte[1024];  // Read up to 1024 bytes per call
    int len;
    while ((len = fis.read(buffer)) != -1) {
        // Convert only the valid portion of the byte array to a string
        String str = new String(buffer, 0, len);
        System.out.print(str);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// Note: a multibyte character split across two reads is garbled; read text with a character stream
```

***

#### Approach 3: Read Everything at Once (JDK 9+)

```java
try (FileInputStream fis = new FileInputStream("a.txt")) {
    // Read all bytes at once
    byte[] bytes = fis.readAllBytes();
    String content = new String(bytes);
    System.out.println(content);
} catch (IOException e) {
    e.printStackTrace();
}

// Note: suitable only for small files; large files can exhaust memory
```

***

#### Approach 4: Read Using available()

```java
try (FileInputStream fis = new FileInputStream("a.txt")) {
    // Get the file size
    int size = fis.available();
    byte[] buffer = new byte[size];

    // Read everything at once
    fis.read(buffer);

    String content = new String(buffer);
    System.out.println(content);
} catch (IOException e) {
    e.printStackTrace();
}

// Note: suitable only for small files; large files can exhaust memory.
// available() is only an estimate and one read() call is not guaranteed to fill the array;
// prefer readAllBytes() (JDK 9+) or Files.readAllBytes().
```

***

### 5. Complete Example

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

            System.out.println("File contents: ");
            System.out.println(sb.toString());

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## IV. File Copy Example (Byte Streams)

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class FileCopyDemo {
    public static void main(String[] args) {
        // Copy a file (works for all file types)
        try (
            FileInputStream fis = new FileInputStream("source.jpg");
            FileOutputStream fos = new FileOutputStream("copy.jpg")
        ) {
            byte[] buffer = new byte[1024];
            int len;

            while ((len = fis.read(buffer)) != -1) {
                fos.write(buffer, 0, len);
            }

            System.out.println("Copy succeeded");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## V. FileReader: Character Input

### 1. What Is FileReader?

`FileReader` **reads text files as characters**, handling encoding automatically.

```java
import java.io.FileReader;
```

***

### 2. Constructors

```java
// Create from a path (default charset: UTF-8 since JDK 18; platform-dependent before)
FileReader fr1 = new FileReader("a.txt");

// Create from a File object
FileReader fr2 = new FileReader(new File("a.txt"));

// Specify an encoding (JDK 11+)
FileReader fr3 = new FileReader("a.txt", StandardCharsets.UTF_8);
```

***

### 3. Common Methods

```java
// Read one character (-1 indicates end of input)
int ch = fr.read();

// Read into a character array (returns the number of characters read, or -1 at end of input)
char[] buffer = new char[1024];
int len = fr.read(buffer);

// Close the stream (required)
fr.close();
```

***

### 4. Reading Approaches

#### Approach 1: One Character at a Time

```java
try (FileReader fr = new FileReader("a.txt")) {
    int ch;
    while ((ch = fr.read()) != -1) {
        System.out.print((char) ch);
    }
} catch (IOException e) {
    e.printStackTrace();
}

// Advantage: Chinese characters are not garbled
// Drawback: inefficient
```

***

#### Approach 2: A Character Array at a Time (Recommended)

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

### 5. Complete Example

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

            System.out.println("File contents: ");
            System.out.println(sb.toString());

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## VI. FileWriter: Character Output

### 1. What Is FileWriter?

`FileWriter` **writes data to text files as characters**.

```java
import java.io.FileWriter;
```

***

### 2. Constructors

```java
// Overwrite (default)
FileWriter fw1 = new FileWriter("a.txt");
FileWriter fw2 = new FileWriter(new File("a.txt"));

// Append
FileWriter fw3 = new FileWriter("a.txt", true);

// Specify an encoding (JDK 11+)
FileWriter fw4 = new FileWriter("a.txt", StandardCharsets.UTF_8);
```

***

### 3. Common Methods

```java
// Write one character
fw.write('A');
fw.write(97);  // Write 'a'

// Write a string
fw.write("Hello World");

// Write part of a string
fw.write("Hello World", 0, 5);  // Write "Hello"

// Write a character array
char[] chars = {'H', 'e', 'l', 'l', 'o'};
fw.write(chars);

// Write part of a character array
fw.write(chars, 0, 3);  // Write "Hel"

// Newline
fw.write("\r\n");

// Flush the buffer (write buffered data to the file)
fw.flush();

// Close the stream (automatically flushes)
fw.close();
```

***

### 4. flush() vs close()

| Method | Effect | State afterward |
| --------- | ------------- | ----- |
| `flush()` | Flushes buffered data to the file | Stream remains usable |
| `close()` | Flushes the buffer, then closes the stream | Stream is no longer usable |

```java
// Character streams have a buffer; flush or close is required to write buffered data to the file
fw.write("Hello");
// Data is still in the buffer, not yet in the file

fw.flush();  // Or fw.close()
// Data is now actually written to the file
```

***

### 5. Complete Example

```java
import java.io.FileWriter;
import java.io.IOException;

public class FileWriterDemo {
    public static void main(String[] args) {
        try (FileWriter fw = new FileWriter("a.txt")) {
            // Write one character
            fw.write('H');
            fw.write('e');
            fw.write('l');
            fw.write('l');
            fw.write('o');

            // Newline
            fw.write("\r\n");

            // Write a string
            fw.write("World");
            fw.write("\r\n");

            // Write Chinese text
            fw.write("你好，世界");

            System.out.println("Write succeeded");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## VII. File Copy Example (Character Streams)

```java
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class TextFileCopyDemo {
    public static void main(String[] args) {
        // Copy a text file
        try (
            FileReader fr = new FileReader("source.txt");
            FileWriter fw = new FileWriter("copy.txt")
        ) {
            char[] buffer = new char[1024];
            int len;

            while ((len = fr.read(buffer)) != -1) {
                fw.write(buffer, 0, len);
            }

            System.out.println("Copy succeeded");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## VIII. Buffered Streams

### 1. What Are Buffered Streams?

Buffered streams add a **buffer** to an underlying stream, reducing I/O operations and improving read/write efficiency.

    Ordinary stream: each read/write accesses the disk
    Buffered stream: read/write through a buffer; access the disk when the buffer fills

    ┌─────────┐                    ┌─────────┐
    │ Program │ ←──── Buffer ────→ │  Disk   │
    └─────────┘    (8192 bytes)    └─────────┘

### 2. Buffered Stream Types

| Type | Input | Output |
| --------- | --------------------- | ---------------------- |
| **Buffered byte stream** | `BufferedInputStream` | `BufferedOutputStream` |
| **Buffered character stream** | `BufferedReader` | `BufferedWriter` |

***

### 3. Buffered Byte Streams

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
            // Buffered streams have buffers; close() flushes automatically

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### Efficient File Copy with Buffered Streams

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
            System.out.println("Copy succeeded");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 4. Buffered Character Streams

#### BufferedReader (Special Method: readLine)

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class BufferedReaderDemo {
    public static void main(String[] args) {
        try (BufferedReader br = new BufferedReader(new FileReader("a.txt"))) {

            // Special method: read one line (excluding the line separator)
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

#### BufferedWriter (Special Method: newLine)

```java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class BufferedWriterDemo {
    public static void main(String[] args) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter("a.txt"))) {

            bw.write("First line");
            bw.newLine();  // Special method: write the system line separator

            bw.write("Second line");
            bw.newLine();

            bw.write("Third line");

            System.out.println("Write succeeded");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 5. Special Buffered Stream Methods

| Class | Special method | Description |
| ---------------- | ------------ | ------------------------ |
| `BufferedReader` | `readLine()` | Reads a line without its separator; null indicates end of input |
| `BufferedWriter` | `newLine()` | Writes the system line separator (cross-platform) |

***

### 6. Ordinary vs Buffered Stream Performance

```java
// Test: copy a 100 MB file (illustrative timings; actual results vary by hardware and OS cache)
// Ordinary stream (1 byte per call): approximately 500 seconds
// Ordinary stream (1024 bytes per call): approximately 0.5 seconds
// Buffered stream (1 byte per call): approximately 1.5 seconds
// Buffered stream (1024 bytes per call): approximately 0.15 seconds

// Conclusion: buffered streams + byte arrays are most efficient
```

***

## IX. Conversion Streams

### 1. What Are Conversion Streams?

Conversion streams **bridge byte and character streams** and allow reading/writing with a **specified encoding**.

| Conversion stream | Description |
| -------------------- | ---------------- |
| `InputStreamReader` | Bytes → characters (conversion during reading) |
| `OutputStreamWriter` | Characters → bytes (conversion during writing) |

***

### 2. Why Conversion Streams Are Needed

```java
// Problem: FileReader uses the default encoding; a different file encoding causes garbled text
// Reading a GBK file as UTF-8 causes garbled text

// Solution: specify the encoding with a conversion stream
```

***

### 3. InputStreamReader

```java
import java.io.*;

public class InputStreamReaderDemo {
    public static void main(String[] args) {
        // Read a file using GBK
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
        // Write a file using GBK
        try (BufferedWriter bw = new BufferedWriter(
                new OutputStreamWriter(
                    new FileOutputStream("gbk.txt"), "GBK"))) {

            bw.write("你好，世界");
            bw.newLine();
            bw.write("Hello World");

            System.out.println("Write succeeded");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 5. Converting File Encodings

```java
import java.io.*;

public class ConvertEncodingDemo {
    public static void main(String[] args) {
        // Convert a GBK-encoded file to UTF-8
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
            System.out.println("Conversion succeeded");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

## X. Serialization Streams

### 1. What Is Serialization?

| Concept | Description |
| -------- | --------------------- |
| **Serialization** | Converts an object into bytes (for files/network transmission) |
| **Deserialization** | Restores an object from bytes (read from files/networks) |

    Object ──serialize──→ byte sequence ──save──→ file
    File ──read──→ byte sequence ──deserialize──→ object

***

### 2. The Serializable Interface

```java
import java.io.Serializable;

// An object must implement Serializable to be serialized
public class User implements Serializable {

    // Serialization version identifier (recommended)
    private static final long serialVersionUID = 1L;

    private String name;
    private int age;

    // Fields marked transient are not serialized
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

### 3. ObjectOutputStream (Serialization)

```java
import java.io.*;

public class SerializeDemo {
    public static void main(String[] args) {
        User user = new User("Alice", 18, "123456");

        try (ObjectOutputStream oos = new ObjectOutputStream(
                new FileOutputStream("user.dat"))) {

            oos.writeObject(user);
            System.out.println("Serialization succeeded");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 4. ObjectInputStream (Deserialization)

```java
import java.io.*;

public class DeserializeDemo {
    public static void main(String[] args) {
        try (ObjectInputStream ois = new ObjectInputStream(
                new FileInputStream("user.dat"))) {

            User user = (User) ois.readObject();
            System.out.println("Deserialization succeeded: " + user);
            // Output: User{name='Alice', age=18, password='null'}
            // password is transient and is not serialized

        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 5. Serialization Considerations

| Consideration | Description |
| ------------------- | ------------------------------- |
| Must implement `Serializable` | Otherwise `NotSerializableException` is thrown |
| `serialVersionUID` | Define explicitly; otherwise class changes may prevent deserialization |
| `transient` keyword | Marked fields are not serialized |
| Static variables | Not serialized (belong to the class, not an object) |
| Referenced objects | Must also implement `Serializable` |

***

## XI. Print Streams

### 1. What Are Print Streams?

Print streams support output only, with convenient printing methods.

| Print stream | Description |
| ------------- | ---------------------------------- |
| `PrintStream` | Byte print stream (`System.out` is a PrintStream) |
| `PrintWriter` | Character print stream |

***

### 2. PrintStream

```java
import java.io.*;

public class PrintStreamDemo {
    public static void main(String[] args) {
        try (PrintStream ps = new PrintStream("a.txt")) {

            ps.println("Hello");  // Print with a newline
            ps.println(100);
            ps.println(true);

            ps.print("World");    // Print without a newline

            ps.printf("Name: %s, age: %d%n", "Alice", 18);  // Formatted printing

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
        // The second argument, true, enables automatic flushing
        try (PrintWriter pw = new PrintWriter(new FileWriter("a.txt"), true)) {

            pw.println("Hello");
            pw.println("World");
            pw.println("Hello, world");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 4. Redirecting Standard Output

```java
import java.io.*;

public class RedirectDemo {
    public static void main(String[] args) throws IOException {
        // Save the original standard output
        PrintStream console = System.out;

        // Redirect to a file
        PrintStream fileOut = new PrintStream("log.txt");
        System.setOut(fileOut);

        // System.out.println now writes to the file
        System.out.println("This message is written to the file");

        // Restore standard output
        System.setOut(console);
        System.out.println("This message is printed to the console");

        fileOut.close();
    }
}
```

***

## XII. The Files Utility Class (JDK 7+)

### 1. What Is Files?

`Files` is Java NIO's file utility class, providing many static methods that simplify file operations.

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
```

***

### 2. Reading Files

```java
import java.nio.file.*;
import java.util.List;
import java.util.stream.Stream;

public class FilesReadDemo {
    public static void main(String[] args) throws Exception {
        Path path = Paths.get("a.txt");

        // 1. Read all bytes
        byte[] bytes = Files.readAllBytes(path);
        String content = new String(bytes);

        // 2. Read all lines (returns a List)
        List<String> lines = Files.readAllLines(path);
        lines.forEach(System.out::println);

        // 3. Read as a string (JDK 11+)
        String text = Files.readString(path);

        // 4. Read as a stream (recommended for large files; the stream holds an open file, so close it)
        try (Stream<String> stream = Files.lines(path)) {
            stream.forEach(System.out::println);
        }
    }
}
```

***

### 3. Writing Files

```java
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;

public class FilesWriteDemo {
    public static void main(String[] args) throws Exception {
        Path path = Paths.get("a.txt");

        // 1. Write a byte array
        Files.write(path, "Hello World".getBytes());

        // 2. Write lines from a collection
        List<String> lines = Arrays.asList("First line", "Second line", "Third line");
        Files.write(path, lines);

        // 3. Append
        Files.write(path, "Appended content".getBytes(),
            StandardOpenOption.APPEND);

        // 4. Write a string (JDK 11+)
        Files.writeString(path, "Hello World");
    }
}
```

***

### 4. File Operations

```java
import java.nio.file.*;

public class FilesOperationDemo {
    public static void main(String[] args) throws Exception {
        Path source = Paths.get("source.txt");
        Path target = Paths.get("target.txt");
        Path dir = Paths.get("test/a/b/c");

        // 1. Create a directory
        Files.createDirectories(dir);  // Create nested directories

        // 2. Copy a file
        Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);

        // 3. Test file attributes
        boolean exists = Files.exists(target);
        boolean isDir = Files.isDirectory(target);
        boolean isFile = Files.isRegularFile(target);
        boolean readable = Files.isReadable(target);
        boolean writable = Files.isWritable(target);

        // 4. Get file size
        long size = Files.size(target);

        // 5. Move/rename a file (replaces target; source no longer exists afterward)
        Files.move(source, target, StandardCopyOption.REPLACE_EXISTING);

        // 6. Delete a file
        Files.delete(target);          // Throws NoSuchFileException if absent
        Files.deleteIfExists(target);  // No exception if absent
    }
}
```

***

### 5. Traversing Directories

```java
import java.nio.file.*;
import java.io.IOException;
import java.util.stream.Stream;

public class FilesWalkDemo {
    public static void main(String[] args) throws IOException {
        Path dir = Paths.get(".");

        // The streams hold open directory handles, so close them with try-with-resources

        // 1. Traverse a directory (one level)
        try (Stream<Path> stream = Files.list(dir)) {
            stream.forEach(System.out::println);
        }

        // 2. Traverse a directory recursively
        try (Stream<Path> stream = Files.walk(dir)) {
            stream.filter(Files::isRegularFile)  // Files only
                  .forEach(System.out::println);
        }

        // 3. Find files
        try (Stream<Path> stream = Files.walk(dir)) {
            stream.filter(p -> p.toString().endsWith(".java"))
                  .forEach(System.out::println);
        }
    }
}
```

***

### 6. Files Quick Reference

| Method | Description |
| --------------------------- | ----------------- |
| `readAllBytes(Path)` | Reads all bytes |
| `readAllLines(Path)` | Reads all lines |
| `readString(Path)` | Reads as a string (JDK 11+) |
| `lines(Path)` | Reads as a Stream (recommended for large files) |
| `write(Path, byte[])` | Writes a byte array |
| `write(Path, Iterable)` | Writes multiple lines |
| `writeString(Path, String)` | Writes a string (JDK 11+) |
| `copy(Path, Path)` | Copies a file |
| `move(Path, Path)` | Moves/renames a file |
| `delete(Path)` | Deletes a file |
| `createDirectories(Path)` | Creates nested directories |
| `exists(Path)` | Tests existence |
| `size(Path)` | Gets file size |
| `list(Path)` | Traverses a directory (one level) |
| `walk(Path)` | Traverses a directory recursively |

***

## XIII. Byte Streams vs Character Streams: Summary

| Comparison | Byte streams | Character streams |
| -------- | ------------------------------------------ | ------------------------------- |
| **Base classes** | InputStream / OutputStream | Reader / Writer |
| **Implementations** | FileInputStream / FileOutputStream | FileReader / FileWriter |
| **Buffered streams** | BufferedInputStream / BufferedOutputStream | BufferedReader / BufferedWriter |
| **Unit** | Byte (byte) | UTF-16 code unit (char) |
| **Buffer** | None (direct writes) | Present (requires flush) |
| **File types** | All files | Plain-text files |
| **Chinese text** | Select the correct encoding when decoding | Mismatched encodings still cause garbled text |
| **Use cases** | Images, video, audio, etc. | Text files |

**Selection Guide:**

*   Plain-text files → character streams (FileReader / FileWriter).
*   Other files (images, video, etc.) → byte streams (FileInputStream / FileOutputStream).
*   Efficient reading/writing → buffered streams.
*   Specified encoding → conversion streams.
*   Unknown file type → byte streams (general-purpose).

***

## XIV. Properties

### 1. What Is Properties?

`Properties` is a **key-value collection** for **configuration settings**, with strings as both keys and values.

```java
import java.util.Properties;

// Properties extends Hashtable<Object, Object>
// But normally stores only String keys and values
```

***

### 2. Basic Usage

```java
// Create a Properties object
Properties props = new Properties();

// Add key-value pairs
props.setProperty("username", "admin");
props.setProperty("password", "123456");
props.setProperty("url", "jdbc:mysql://localhost:3306/mydb");

// Get a value
String username = props.getProperty("username");  // "admin"
String password = props.getProperty("password");  // "123456"

// Get a value with a default
String port = props.getProperty("port", "3306");  // Returns the default value if absent

// Get all keys
Set<String> keys = props.stringPropertyNames();
for (String key : keys) {
    System.out.println(key + " = " + props.getProperty(key));
}
```

***

### 3. Reading Configuration Files

#### Configuration File Format (config.properties)

```properties
# This is a comment
username=admin
password=123456
url=jdbc:mysql://localhost:3306/mydb
driver=com.mysql.cj.jdbc.Driver
```

***

#### Reading a Configuration File

```java
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

public class PropertiesDemo {
    public static void main(String[] args) {
        Properties props = new Properties();

        try (FileReader fr = new FileReader("config.properties")) {
            // Load configuration from a file
            props.load(fr);

            // Get configuration entries
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

### 4. Writing Configuration Files

```java
import java.io.FileWriter;
import java.io.IOException;
import java.util.Properties;

public class PropertiesWriteDemo {
    public static void main(String[] args) {
        Properties props = new Properties();

        // Add configuration entries
        props.setProperty("username", "admin");
        props.setProperty("password", "123456");
        props.setProperty("url", "jdbc:mysql://localhost:3306/mydb");

        try (FileWriter fw = new FileWriter("config.properties")) {
            // Write to a file (the second argument is a comment)
            props.store(fw, "Database Configuration");

            System.out.println("Write succeeded");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

***

### 5. Reading Configuration from the Classpath

```java
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class PropertiesClasspathDemo {
    public static void main(String[] args) {
        Properties props = new Properties();

        // Load a configuration file from the classpath (src or resources directory)
        try (InputStream is = PropertiesClasspathDemo.class.getClassLoader()
                .getResourceAsStream("config.properties")) {

            // load(InputStream) decodes ISO-8859-1; for non-ASCII values, wrap it:
            // props.load(new InputStreamReader(is, StandardCharsets.UTF_8));
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

### 6. Properties Quick Reference

| Method | Description |
| -------------------------------------- | --------- |
| `setProperty(key, value)` | Sets a key-value pair |
| `getProperty(key)` | Gets a value |
| `getProperty(key, default)` | Gets a value with a default |
| `stringPropertyNames()` | Gets all keys |
| `load(Reader/InputStream)` | Loads configuration from a file |
| `store(Writer/OutputStream, comments)` | Writes to a file |

***

## XV. Hutool

### 1. What Is Hutool?

Hutool is a **Java utility library** with extensive helper methods that simplify development.

Official website: <https://hutool.cn/>

***

### 2. Adding the Dependency

```xml
<!-- Maven dependency -->
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.48</version>
</dependency>
```

***

### 3. File Operations (FileUtil)

```java
import cn.hutool.core.io.FileUtil;

// 1. Read file contents
String content = FileUtil.readUtf8String("a.txt");

// 2. Write file contents
FileUtil.writeUtf8String("Hello World", "a.txt");

// 3. Append
FileUtil.appendUtf8String("Appended content", "a.txt");

// 4. Copy a file
FileUtil.copy("source.txt", "copy.txt", true);

// 5. Delete a file
FileUtil.del("a.txt");

// 6. Create a directory
FileUtil.mkdir("test/a/b/c");

// 7. Get the file extension
String ext = FileUtil.extName("a.txt");  // "txt"

// 8. Get the filename without its extension
String name = FileUtil.mainName("a.txt");  // "a"

// 9. Test file existence
boolean exists = FileUtil.exist("a.txt");

// 10. Get file size
long size = FileUtil.size(new File("a.txt"));
```

***

### 4. String Operations (StrUtil)

```java
import cn.hutool.core.util.StrUtil;

// 1. Check whether empty
StrUtil.isEmpty("");        // true
StrUtil.isNotEmpty("abc");  // true
StrUtil.isBlank("   ");     // true (whitespace also counts as blank)
StrUtil.isNotBlank("abc");  // true

// 2. Format a string
String str = StrUtil.format("Hello, {}!", "World");  // "Hello, World!"
String str2 = StrUtil.format("{}-{}-{}", 2024, 1, 7);  // "2024-1-7"

// 3. Trim whitespace
StrUtil.trim("  abc  ");  // "abc"

// 4. Split a string
List<String> parts = StrUtil.split("a,b,c", ",");  // [a, b, c]
String[] arr = StrUtil.splitToArray("a,b,c", ",");  // Array form

// 5. Extract a substring
String sub = StrUtil.sub("Hello", 0, 3);  // "Hel"
```

***

### 5. Date Operations (DateUtil)

```java
import cn.hutool.core.date.DateUtil;

// 1. Get the current time
Date now = DateUtil.date();
String nowStr = DateUtil.now();  // "2024-01-07 12:30:45"
String today = DateUtil.today();  // "2024-01-07"

// 2. Format a date
String str = DateUtil.format(now, "yyyy-MM-dd HH:mm:ss");

// 3. Parse a date
Date date = DateUtil.parse("2024-01-07");
Date dateTime = DateUtil.parse("2024-01-07 12:30:45");

// 4. Date arithmetic
Date tomorrow = DateUtil.offsetDay(now, 1);  // Tomorrow
Date nextWeek = DateUtil.offsetWeek(now, 1);  // Next week
Date nextMonth = DateUtil.offsetMonth(now, 1);  // Next month

// 5. Calculate a date difference
long days = DateUtil.between(date1, date2, DateUnit.DAY);

// 6. Get year, month and day
int year = DateUtil.year(now);
int month = DateUtil.month(now) + 1;  // Months are zero-based
int day = DateUtil.dayOfMonth(now);
```

***

### 6. Collection Operations (CollUtil)

```java
import cn.hutool.core.collection.CollUtil;

// 1. Create a collection
List<String> list = CollUtil.newArrayList("a", "b", "c");
Set<String> set = CollUtil.newHashSet("a", "b", "c");

// 2. Check whether empty
CollUtil.isEmpty(list);      // false
CollUtil.isNotEmpty(list);   // true

// 3. Collection operations
CollUtil.join(list, ",");    // "a,b,c"
CollUtil.reverse(list);      // Reverse
CollUtil.sort(list, null);   // Sort
```

***

### 7. Other Common Utilities

```java
// 1. Random utilities (RandomUtil)
int num = RandomUtil.randomInt(1, 100);  // Random number from 1 to 99
String str = RandomUtil.randomString(10);  // Random string of length 10

// 2. Unique IDs (IdUtil)
String uuid = IdUtil.simpleUUID();  // Simple UUID (without hyphens)
String objectId = IdUtil.objectId();  // MongoDB ObjectId

// 3. Encryption/decryption utilities (SecureUtil)
String md5 = SecureUtil.md5("123456");  // MD5 hashing
String sha256 = SecureUtil.sha256("123456");  // SHA-256 hashing
// Note: plain MD5/SHA-256 is unsuitable for storing passwords; use BCrypt or a similar slow hash

// 4. JSON operations (JSONUtil)
String json = JSONUtil.toJsonStr(obj);  // Object to JSON
User user = JSONUtil.toBean(json, User.class);  // JSON to object
```

***

## XVI. Quick Reference

### 1. I/O Stream Categories

| Stream type | Input | Output | Description |
| --------- | ------------------- | ------------------------- | ------ |
| **Byte stream** | FileInputStream | FileOutputStream | All files |
| **Character stream** | FileReader | FileWriter | Plain-text files |
| **Buffered byte stream** | BufferedInputStream | BufferedOutputStream | Efficient reading/writing |
| **Buffered character stream** | BufferedReader | BufferedWriter | Efficient text reading/writing |
| **Conversion stream** | InputStreamReader | OutputStreamWriter | Specified encoding |
| **Serialization stream** | ObjectInputStream | ObjectOutputStream | Object persistence |
| **Print stream** | - | PrintStream / PrintWriter | Convenient output |

### 2. Common Methods

| Class | Reading methods | Writing methods | Special methods |
| ------------------ | ------------------------- | --------------------------- | ---------------- |
| `FileInputStream`  | `read()` / `read(byte[])` | -                           | `readAllBytes()` |
| `FileOutputStream` | -                         | `write()` / `write(byte[])` | -                |
| `FileReader`       | `read()` / `read(char[])` | -                           | -                |
| `FileWriter`       | -                         | `write()` / `write(String)` | `flush()`        |
| `BufferedReader`   | `read()` / `read(char[])` | -                           | `readLine()`     |
| `BufferedWriter`   | -                         | `write()`                   | `newLine()`      |

### 3. Files Utility Class

| Method | Description |
| ------------------------------ | ---------------- |
| `Files.readAllBytes(path)` | Reads all bytes |
| `Files.readAllLines(path)` | Reads all lines |
| `Files.readString(path)` | Reads as a string (JDK 11+) |
| `Files.write(path, bytes)` | Writes bytes |
| `Files.writeString(path, str)` | Writes a string (JDK 11+) |
| `Files.copy(src, dest)` | Copies a file |
| `Files.delete(path)` | Deletes a file |
| `Files.walk(dir)` | Traverses a directory recursively |
