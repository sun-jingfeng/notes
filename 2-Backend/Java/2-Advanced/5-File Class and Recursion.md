## I. The File Class

### 1. What Is File?

Java's `File` class represents **paths to files and directories (folders)**.

```java
// File belongs to the java.io package
import java.io.File;

// A File object represents the path to a file or directory
// Note: a File object is only an abstract pathname; the file/directory need not exist
```

**Key Points:**

*   A `File` object represents a **path**, not file contents.
*   The file/directory may or may not exist.
*   It can be used to create, delete, or query information about files/directories.

***

### 2. Creating File Objects

#### Three Constructors

```java
// 1. Create from a pathname string
File file1 = new File("D:/test/a.txt");
File file2 = new File("D:\\test\\a.txt");  // Windows path separator

// 2. Create from a parent path + child path
File file3 = new File("D:/test", "a.txt");

// 3. Create from a parent File object + child path
File parentDir = new File("D:/test");
File file4 = new File(parentDir, "a.txt");
```

***

#### Path Separators

```java
// Windows path separator: \ (must be escaped as \\)
File file1 = new File("D:\\test\\a.txt");

// Linux/Mac path separator: /
File file2 = new File("/home/user/test/a.txt");

// Recommended: use / or File.separator (cross-platform)
File file3 = new File("D:/test/a.txt");  // ✅ Recommended
File file4 = new File("D:" + File.separator + "test" + File.separator + "a.txt");

// Path-separator constants
System.out.println(File.separator);      // Windows: \  Linux: /
System.out.println(File.pathSeparator);  // Windows: ;  Linux: : (used in the PATH environment variable)
```

***

#### Relative and Absolute Paths

```java
// Absolute path: complete path starting from the drive letter
File absolute = new File("D:/test/a.txt");  // Windows
File absolute2 = new File("/home/user/a.txt");  // Linux/Mac

// Relative path: a path relative to the current working directory
File relative = new File("a.txt");  // a.txt in the current directory
File relative2 = new File("test/a.txt");  // test/a.txt in the current directory
File relative3 = new File("../a.txt");  // a.txt in the parent directory

// Get the current working directory
String userDir = System.getProperty("user.dir");
System.out.println("Current working directory: " + userDir);
```

***

### 3. Common File Methods

#### Test Methods

```java
File file = new File("D:/test/a.txt");
File dir = new File("D:/test");

// Test existence
boolean exists = file.exists();  // true/false

// Test whether it is a file
boolean isFile = file.isFile();  // true (if it is a file)

// Test whether it is a directory (folder)
boolean isDir = dir.isDirectory();  // true (if it is a directory)

// Test whether it is hidden
boolean isHidden = file.isHidden();  // true/false

// Test whether the path is absolute
boolean isAbsolute = file.isAbsolute();  // true/false

// Test read/write/execute permissions
boolean canRead = file.canRead();
boolean canWrite = file.canWrite();
boolean canExecute = file.canExecute();
```

***

#### Information Methods

```java
// Results are shown with /; on Windows, File normalizes the separators to \
File file = new File("D:/test/../test/a.txt");

// Get the filename
String name = file.getName();  // "a.txt"

// Get the path (as supplied to the constructor)
String path = file.getPath();  // "D:/test/../test/a.txt"

// Get the absolute path
String absolutePath = file.getAbsolutePath();  // "D:/test/../test/a.txt"

// Get the canonical path (resolves . and ..; recommended)
String canonicalPath = file.getCanonicalPath();  // "D:/test/a.txt"

// Get the parent path
String parent = file.getParent();  // "D:/test/../test"

// Get the parent File object
File parentFile = file.getParentFile();  // File object

// Get file size (bytes)
long size = file.length();  // File size in bytes; 0 if the file does not exist; unspecified for a directory

// Get the last-modified time (milliseconds)
long lastModified = file.lastModified();  // Timestamp
```

***

#### Disk Space Methods

```java
File disk = new File("D:/");

// Get total disk space (bytes)
long totalSpace = disk.getTotalSpace();
System.out.println("Total space: " + totalSpace / 1024 / 1024 / 1024 + " GB");

// Get free disk space (bytes)
long freeSpace = disk.getFreeSpace();
System.out.println("Free space: " + freeSpace / 1024 / 1024 / 1024 + " GB");

// Get usable disk space (accounts for permissions; recommended)
long usableSpace = disk.getUsableSpace();
System.out.println("Usable space: " + usableSpace / 1024 / 1024 / 1024 + " GB");

// Get all filesystem roots
File[] roots = File.listRoots();
for (File root : roots) {
    System.out.println("Root: " + root);  // C:\  D:\  E:\
}
```

***

#### Creation Methods

```java
// 1. Create a file
File file = new File("D:/test/a.txt");
boolean created = file.createNewFile();  // Creates a file; returns true on success
// Note: returns false if the file exists; throws an exception if its parent directory does not exist

// 2. Create a single-level directory
File dir = new File("D:/test/newDir");
boolean mkdir = dir.mkdir();  // Creates a directory; returns true on success
// Note: fails if the parent directory does not exist

// 3. Create nested directories (recommended)
File dirs = new File("D:/test/a/b/c");
boolean mkdirs = dirs.mkdirs();  // Creates nested directories; returns true on success
// Note: missing parent directories are created too

// 4. Create a temporary file
File tempFile = File.createTempFile("prefix_", ".tmp");  // Create in the system temporary directory
File tempFile2 = File.createTempFile("prefix_", ".tmp", new File("D:/test"));  // Specify a directory
System.out.println("Temporary file: " + tempFile.getAbsolutePath());
tempFile.deleteOnExit();  // Delete automatically when the JVM exits
```

***

#### Deletion Methods

```java
File file = new File("D:/test/a.txt");

// Delete a file or empty directory
boolean deleted = file.delete();  // Returns true on successful deletion
// Notes:
// - Only files and empty directories can be deleted
// - Nonempty directories cannot be deleted
// - Deletion is permanent; it bypasses the recycle bin

// Delete when the JVM exits
file.deleteOnExit();  // Commonly used for temporary files
```

***

#### Permission-Setting Methods

```java
File file = new File("D:/test/a.txt");

// Set read-only
boolean success1 = file.setReadOnly();

// Set writable
boolean success2 = file.setWritable(true);
boolean success3 = file.setWritable(true, false);  // Second parameter: whether the change applies only to the owner

// Set readable
boolean success4 = file.setReadable(true);

// Set executable
boolean success5 = file.setExecutable(true);

// Set the last-modified time
boolean success6 = file.setLastModified(System.currentTimeMillis());
```

***

#### Renaming/Moving

```java
File oldFile = new File("D:/test/a.txt");
File newFile = new File("D:/test/b.txt");

// Rename within the same directory
boolean renamed = oldFile.renameTo(newFile);

// Move to another directory (a separate case: a.txt must still exist)
File movedFile = new File("D:/other/a.txt");
boolean moved = oldFile.renameTo(movedFile);  // Move and rename together
// Note: moves across partitions may fail; prefer Files.move()
```

***

### 4. Traversing Directories

#### Getting Directory Contents

```java
File dir = new File("D:/test");

// 1. list() - get an array of filenames in the directory
String[] names = dir.list();
if (names != null) {
    for (String name : names) {
        System.out.println(name);  // Names only, without paths
    }
}

// 2. listFiles() - get an array of File objects in the directory (recommended)
File[] files = dir.listFiles();
if (files != null) {
    for (File file : files) {
        System.out.println(file.getName());  // Filename
        System.out.println(file.getAbsolutePath());  // Absolute path
        System.out.println(file.isFile());  // Whether it is a file
    }
}

// Note: returns null if dir is not a directory or access is denied
```

***

#### Filtering Files

```java
File dir = new File("D:/test");

// 1. Use FilenameFilter (filter by filename)
String[] names = dir.list((d, name) -> name.endsWith(".txt"));
// Return only .txt files

// 2. Use FileFilter (filter by File object)
File[] files = dir.listFiles(file -> file.isFile() && file.getName().endsWith(".txt"));
// Return only .txt files

// 3. Get only directories
File[] dirs = dir.listFiles(File::isDirectory);

// 4. Get files exceeding a specified size
File[] bigFiles = dir.listFiles(file -> file.isFile() && file.length() > 1024 * 1024);
```

***

### 5. Converting Between File and Path

```java
import java.nio.file.Path;
import java.nio.file.Paths;

File file = new File("D:/test/a.txt");

// File → Path
Path path = file.toPath();

// Path → File
File file2 = path.toFile();

// Create a Path using Paths
Path path2 = Paths.get("D:/test/a.txt");
File file3 = path2.toFile();
```

**File vs Path:**

| Feature | File (legacy) | Path (new, JDK 7+) |
| ---- | ---------- | -------------- |
| Package | java.io | java.nio.file |
| Immutability | Immutable pathname representation | Immutable pathname representation |
| Error handling | Returns boolean | Throws detailed exceptions |
| Symbolic links | Not supported | Supported |
| File attributes | Limited | Extensive |
| Recommended use | Existing projects | New projects |

> The path represented by a `File` / `Path` object is immutable. Creating, deleting, or renaming changes files or directories in the filesystem, not the pathname stored in the object.

***

### 6. Complete Example

```java
import java.io.File;
import java.io.IOException;

public class FileDemo {
    public static void main(String[] args) throws IOException {
        // 1. Create a File object
        File file = new File("D:/test/a.txt");
        File dir = new File("D:/test");

        // 2. Test methods
        System.out.println("File exists: " + file.exists());
        System.out.println("Is a file: " + file.isFile());
        System.out.println("Is a directory: " + dir.isDirectory());

        // 3. Information methods
        System.out.println("Filename: " + file.getName());
        System.out.println("Absolute path: " + file.getAbsolutePath());
        System.out.println("Canonical path: " + file.getCanonicalPath());
        System.out.println("Parent path: " + file.getParent());
        System.out.println("File size: " + file.length() + " bytes");

        // 4. Creation methods
        File newFile = new File("D:/test/b.txt");
        if (!newFile.exists()) {
            boolean created = newFile.createNewFile();
            System.out.println("Create file: " + created);
        }

        File newDir = new File("D:/test/newDir");
        if (!newDir.exists()) {
            boolean mkdir = newDir.mkdirs();
            System.out.println("Create directory: " + mkdir);
        }

        // 5. Traverse a directory
        File[] files = dir.listFiles();
        if (files != null) {
            for (File f : files) {
                if (f.isFile()) {
                    System.out.println("File: " + f.getName());
                } else {
                    System.out.println("Directory: " + f.getName());
                }
            }
        }

        // 6. Disk space
        File disk = new File("D:/");
        System.out.println("Total disk space: " + disk.getTotalSpace() / 1024 / 1024 / 1024 + " GB");
        System.out.println("Usable disk space: " + disk.getUsableSpace() / 1024 / 1024 / 1024 + " GB");
    }
}
```

***

### 7. File Method Quick Reference

| Method | Return type | Description |
| ---------------------- | --------- | ---------------- |
| `exists()` | boolean | Tests existence |
| `isFile()` | boolean | Tests whether it is a file |
| `isDirectory()` | boolean | Tests whether it is a directory |
| `isAbsolute()` | boolean | Tests whether the path is absolute |
| `getName()` | String | Gets the filename |
| `getPath()` | String | Gets the path |
| `getAbsolutePath()` | String | Gets the absolute path |
| `getCanonicalPath()` | String | Gets the canonical path (recommended) |
| `getParent()` | String | Gets the parent path |
| `getParentFile()` | File | Gets the parent File object |
| `length()` | long | Gets file size in bytes |
| `lastModified()` | long | Gets the last-modified time |
| `getTotalSpace()` | long | Gets total disk space |
| `getUsableSpace()` | long | Gets usable disk space |
| `createNewFile()` | boolean | Creates a file |
| `createTempFile()` | File | Creates a temporary file (static method) |
| `mkdir()` | boolean | Creates a single-level directory |
| `mkdirs()` | boolean | Creates nested directories |
| `delete()` | boolean | Deletes a file or empty directory |
| `deleteOnExit()` | void | Deletes when the JVM exits |
| `renameTo(File)` | boolean | Renames/moves |
| `setReadOnly()` | boolean | Sets read-only |
| `setWritable(boolean)` | boolean | Sets writable |
| `list()` | String\[] | Gets an array of filenames in the directory |
| `listFiles()` | File\[] | Gets an array of File objects in the directory |
| `listRoots()` | File\[] | Gets filesystem roots (static method) |
| `toPath()` | Path | Converts to a Path object |

***

## II. Recursion

### 1. What Is Recursion?

Recursion is the programming technique in which **a method calls itself**.

```java
// Basic structure of recursion
public static void method() {
    // ...
    method();  // Calls itself
    // ...
}
```

**Analogy:**

    Recursion = Russian nesting dolls
              = one layer inside another, until the smallest doll (base case)
              = then return through the layers

***

### 2. Two Essential Parts of Recursion

#### Part 1: Base Case (Recursion Exit)

```java
// ❌ No base case: infinite recursion causes stack overflow
public static void method() {
    method();  // Infinite calls; the program crashes
}

// ✅ With a base case: recursion stops when the condition is met
public static void method(int n) {
    if (n <= 0) {
        return;  // Base case: stop when n <= 0
    }
    method(n - 1);  // Recursive call
}
```

***

#### Part 2: Recursive Case (Recursive Rule)

```java
// Recursive case: how to divide the problem into smaller subproblems
public static int sum(int n) {
    // Base case
    if (n == 1) {
        return 1;
    }
    // Recursive case: sum(n) = n + sum(n-1)
    return n + sum(n - 1);
}
```

***

### 3. Recursive Execution Flow

#### Factorial Example

```java
public static int factorial(int n) {
    // Base case (also covers 0! = 1)
    if (n <= 1) {
        return 1;
    }
    // Recursive case
    return n * factorial(n - 1);
}

// Call factorial(5)
```

**Execution Flow:**

    Calls (pushing stack frames):
    factorial(5)
        → 5 * factorial(4)
            → 4 * factorial(3)
                → 3 * factorial(2)
                    → 2 * factorial(1)
                        → 1 (base case; return)

    Returns (popping stack frames):
    factorial(1) = 1
    factorial(2) = 2 * 1 = 2
    factorial(3) = 3 * 2 = 6
    factorial(4) = 4 * 6 = 24
    factorial(5) = 5 * 24 = 120

    Result: 120

**Diagram:**

    ┌──────────────────────────────────────────┐
    │  factorial(5) = 5 * factorial(4) = 120   │ ← returns last
    ├──────────────────────────────────────────┤
    │  factorial(4) = 4 * factorial(3) = 24    │
    ├──────────────────────────────────────────┤
    │  factorial(3) = 3 * factorial(2) = 6     │
    ├──────────────────────────────────────────┤
    │  factorial(2) = 2 * factorial(1) = 2     │
    ├──────────────────────────────────────────┤
    │  factorial(1) = 1                        │ ← base case; starts returning
    └──────────────────────────────────────────┘

***

### 4. Classic Recursion Examples

#### Example 1: Factorial

```java
// n! = n * (n-1) * (n-2) * ... * 1
// n! = n * (n-1)!

public static int factorial(int n) {
    // Base case (also covers 0! = 1)
    if (n <= 1) {
        return 1;
    }
    // Recursive case
    return n * factorial(n - 1);
}

// Test
System.out.println(factorial(5));  // 120
System.out.println(factorial(10)); // 3628800
// Note: int overflows for n > 12; use long or BigInteger for larger values
```

***

#### Example 2: Cumulative Sum

```java
// sum(n) = 1 + 2 + 3 + ... + n
// sum(n) = n + sum(n-1)

public static int sum(int n) {
    // Base case
    if (n == 1) {
        return 1;
    }
    // Recursive case
    return n + sum(n - 1);
}

// Test
System.out.println(sum(100));  // 5050
```

***

#### Example 3: Fibonacci Sequence

```java
// Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, 21, ...
// f(n) = f(n-1) + f(n-2)

public static int fibonacci(int n) {
    // Base case
    if (n == 1 || n == 2) {
        return 1;
    }
    // Recursive case
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test
System.out.println(fibonacci(10));  // 55
```

**Note:** Recursive Fibonacci is very inefficient because of repeated computation. In practice, use a loop or dynamic programming.

***

#### Example 4: Directory Traversal (Recursion + File)

```java
// Traverse every file in a directory, including subdirectories
public static void listAllFiles(File dir) {
    // Base case: not a directory or empty
    if (!dir.isDirectory()) {
        return;
    }

    File[] files = dir.listFiles();
    if (files == null) {
        return;
    }

    for (File file : files) {
        if (file.isFile()) {
            // A file: print it
            System.out.println("File: " + file.getAbsolutePath());
        } else {
            // A directory: traverse recursively
            System.out.println("Directory: " + file.getAbsolutePath());
            listAllFiles(file);  // Recursive call
        }
    }
}

// Test
listAllFiles(new File("D:/test"));
```

***

#### Example 5: Search for a Specific File

```java
// Search a directory for files with a specified name
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
            // A file: check whether its name matches
            if (file.getName().equals(fileName)) {
                System.out.println("File found: " + file.getAbsolutePath());
            }
        } else {
            // A directory: search recursively
            searchFile(file, fileName);
        }
    }
}

// Test: search D:/test for a.txt
searchFile(new File("D:/test"), "a.txt");
```

***

#### Example 6: Delete a Directory, Its Subdirectories and Files

```java
// Recursively delete a directory, including subdirectories and files
public static boolean deleteDir(File dir) {
    if (!dir.exists()) {
        return false;
    }

    if (dir.isFile()) {
        // A file: delete directly
        return dir.delete();
    }

    // A directory: delete its files and subdirectories first
    File[] files = dir.listFiles();
    if (files != null) {
        for (File file : files) {
            deleteDir(file);  // Recursive deletion
        }
    }

    // Delete the empty directory
    return dir.delete();
}

// Test: delete D:/test
deleteDir(new File("D:/test"));
```

> **Note**: `File` follows symbolic links, so a link to a directory outside the tree would have the target's contents deleted as well. `Files.walkFileTree()` (NIO) does not follow links by default and is safer for recursive deletion.

***

#### Example 7: Calculate Directory Size

```java
// Recursively calculate directory size (sum of all file sizes)
public static long getDirSize(File dir) {
    if (!dir.exists()) {
        return 0;
    }

    if (dir.isFile()) {
        // A file: return its size
        return dir.length();
    }

    // A directory: accumulate sizes of its children
    long size = 0;
    File[] files = dir.listFiles();
    if (files != null) {
        for (File file : files) {
            size += getDirSize(file);  // Accumulate recursively
        }
    }
    return size;
}

// Test: calculate the size of D:/test
long size = getDirSize(new File("D:/test"));
System.out.println("Directory size: " + size + " bytes");
System.out.println("Directory size: " + (size / 1024) + " KB");
```

***

#### Example 8: Copy a Directory, Its Subdirectories and Files

```java
import java.io.*;

// Recursively copy a directory, including subdirectories and files
public static void copyDir(File srcDir, File destDir) throws IOException {
    // Base case: source does not exist
    if (!srcDir.exists()) {
        return;
    }

    if (srcDir.isFile()) {
        // A file: copy the file
        copyFile(srcDir, destDir);
        return;
    }

    // A directory: create the destination directory first
    if (!destDir.exists()) {
        destDir.mkdirs();
    }

    // Traverse the source directory and copy recursively
    File[] files = srcDir.listFiles();
    if (files != null) {
        for (File file : files) {
            File destFile = new File(destDir, file.getName());
            copyDir(file, destFile);  // Recursive copy
        }
    }
}

// Copy a single file
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

// Test: copy D:/test to D:/test_backup
copyDir(new File("D:/test"), new File("D:/test_backup"));
```

***

### 5. Recursion Considerations

#### Consideration 1: A Base Case Is Required

```java
// ❌ No base case: stack overflow
public static void method() {
    method();
}

// ✅ With a base case: normal execution
public static void method(int n) {
    if (n <= 0) {
        return;  // Base case
    }
    method(n - 1);
}
```

***

#### Consideration 2: Recursion Must Reach the Base Case

```java
// ❌ Never reaches the base case: stack overflow
public static void method(int n) {
    if (n == 0) {
        return;
    }
    method(n + 1);  // n keeps increasing and never reaches 0
}

// ✅ Reaches the base case: normal execution
public static void method(int n) {
    if (n == 0) {
        return;
    }
    method(n - 1);  // n keeps decreasing and can reach 0
}
```

***

#### Consideration 3: Recursion Must Not Be Too Deep

```java
// ❌ Excessive recursion depth: stack overflow
public static int sum(int n) {
    if (n == 1) {
        return 1;
    }
    return n + sum(n - 1);
}
sum(100000);  // ❌ Stack overflow

// ✅ Replace recursion with a loop for large inputs
public static long sumLoop(int n) {
    long result = 0;
    for (int i = 1; i <= n; i++) {
        result += i;
    }
    return result;
}
```

***

#### Consideration 4: Avoid Repeated Computation

```java
// ❌ Recursive Fibonacci: substantial repeated computation
public static int fibonacci(int n) {
    if (n == 1 || n == 2) {
        return 1;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);  // Repeated computation
}

// ✅ Use a cache to avoid repeated computation (memoization)
private static Map<Integer, Integer> cache = new HashMap<>();

public static int fibonacciWithCache(int n) {
    if (n == 1 || n == 2) {
        return 1;
    }
    if (cache.containsKey(n)) {
        return cache.get(n);  // Retrieve from the cache
    }
    int result = fibonacciWithCache(n - 1) + fibonacciWithCache(n - 2);
    cache.put(n, result);  // Store in the cache
    return result;
}
```

***

### 6. Tail-Recursion Optimization

#### What Is Tail Recursion?

Tail recursion means **the recursive call is the method's final operation**, with no further computation afterward.

```java
// ❌ Ordinary recursion: computation (multiplication) remains after the recursive call
public static int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);  // Still needs to multiply by n after recursion
}

// ✅ Tail recursion: the recursive call is the final operation
public static int factorialTail(int n, int result) {
    if (n <= 1) return result;
    return factorialTail(n - 1, n * result);  // Recursive call is the final operation
}

// Call
factorialTail(5, 1);  // 120
```

***

#### Advantages of Tail Recursion

```text
// Ordinary recursion: each call must save state, so the stack keeps growing
factorial(5)
    → 5 * factorial(4)  // Must remember to multiply by 5
        → 4 * factorial(3)  // Must remember to multiply by 4
            → ...

// Tail recursion: no pending state needs saving; in theory it can be optimized into a loop
factorialTail(5, 1)
    → factorialTail(4, 5)   // Pass the result directly
        → factorialTail(3, 20)
            → factorialTail(2, 60)
                → factorialTail(1, 120)
                    → 120
```

**Note:** Java currently does not support tail-recursion optimization, but understanding it helps you write better code.

***

#### Rewriting as Tail Recursion

```java
// Sum with ordinary recursion
public static int sum(int n) {
    if (n == 1) return 1;
    return n + sum(n - 1);
}

// Sum with tail recursion
public static int sumTail(int n, int result) {
    if (n == 0) return result;
    return sumTail(n - 1, n + result);
}

// Call
sumTail(100, 0);  // 5050
```

***

### 7. Recursion vs Loops

| Comparison | Recursion | Loop |
| --------- | ---------- | ---- |
| **Conciseness** | Concise | Relatively complex |
| **Readability** | High (naturally expresses the problem) | Lower |
| **Performance** | Lower (method-call overhead) | Higher |
| **Memory use** | Higher (stack space) | Lower |
| **Use cases** | Tree structures, divide and conquer | Simple iteration |
| **Risk** | Stack overflow | No stack-overflow risk |

**Recommendations:**

*   Tree traversal, divide-and-conquer problems → use recursion.
*   Simple iteration, large inputs → use loops.
*   Performance optimization → consider caching (memoization) or an iterative rewrite.

***

### 8. Recursion Quick Reference

| Scenario | Recurrence | Base case |
| -------- | ------------------------ | ----------------- |
| **Factorial** | `f(n) = n * f(n-1)` | `f(0) = f(1) = 1` |
| **Cumulative sum** | `f(n) = n + f(n-1)` | `f(1) = 1` |
| **Fibonacci** | `f(n) = f(n-1) + f(n-2)` | `f(1) = f(2) = 1` |
| **Traverse directory** | Recurse for each subdirectory | Return when not a directory |
| **Delete directory** | Delete children before the directory itself | Delete directly when a file |
| **Copy directory** | Create directory; recursively copy children | Copy contents when a file |
| **Directory size** | Sum child file sizes | Return size when a file |

***

## III. Comprehensive Example

### 1. File Management Utility

```java
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;

public class FileUtils {

    /**
     * Traverse all files under a directory
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

        String indent = "  ".repeat(level);  // Indentation
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
     * Search for files of a specified type
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
                    System.out.println("Found: " + file.getAbsolutePath());
                }
            } else {
                searchByExtension(file, extension);
            }
        }
    }

    /**
     * Calculate directory size
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
     * Format file size
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
     * Count files and directories under a directory
     */
    public static int[] countFilesAndDirs(File dir) {
        int[] count = {0, 0};  // [file count, directory count]
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
     * Recursively delete a directory
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
     * Recursively copy a directory
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
     * Get detailed file information
     */
    public static void printFileInfo(File file) {
        if (!file.exists()) {
            System.out.println("File does not exist: " + file.getPath());
            return;
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        System.out.println("=== File information ===");
        System.out.println("Name: " + file.getName());
        System.out.println("Path: " + file.getAbsolutePath());
        System.out.println("Type: " + (file.isFile() ? "File" : "Directory"));
        System.out.println("Size: " + formatSize(getDirSize(file)));
        System.out.println("Modified: " + sdf.format(new Date(file.lastModified())));
        System.out.println("Readable: " + file.canRead());
        System.out.println("Writable: " + file.canWrite());
        System.out.println("Hidden: " + file.isHidden());
    }

    public static void main(String[] args) {
        File testDir = new File("D:/test");

        // Traverse all files with indentation
        System.out.println("=== Traverse all files ===");
        listAllFiles(testDir);

        // Search for .txt files
        System.out.println("\n=== Search for .txt files ===");
        searchByExtension(testDir, ".txt");

        // Calculate directory size
        System.out.println("\n=== Directory size ===");
        long size = getDirSize(testDir);
        System.out.println("Size: " + formatSize(size));

        // Count files and directories
        System.out.println("\n=== Statistics ===");
        int[] count = countFilesAndDirs(testDir);
        System.out.println("File count: " + count[0]);
        System.out.println("Directory count: " + count[1]);

        // Detailed file information
        System.out.println();
        printFileInfo(testDir);
    }
}
```

***

## IV. Quick Reference

### 1. File

| Method | Purpose | Return type |
| -------------------- | -------- | ------- |
| `exists()` | Tests existence | boolean |
| `isFile()` | Tests whether it is a file | boolean |
| `isDirectory()` | Tests whether it is a directory | boolean |
| `getName()` | Gets the filename | String |
| `getAbsolutePath()` | Gets the absolute path | String |
| `getCanonicalPath()` | Gets the canonical path | String |
| `length()` | Gets file size | long |
| `getTotalSpace()` | Gets total disk space | long |
| `getUsableSpace()` | Gets usable disk space | long |
| `createNewFile()` | Creates a file | boolean |
| `createTempFile()` | Creates a temporary file | File |
| `mkdirs()` | Creates nested directories | boolean |
| `delete()` | Deletes a file/empty directory | boolean |
| `deleteOnExit()` | Deletes on JVM exit | void |
| `listFiles()` | Gets directory contents | File\[] |
| `toPath()` | Converts to Path | Path |

### 2. Recursion

| Component | Description | Example |
| -------- | --------- | ----------------------- |
| **Base case** | Exit condition that stops recursion | `if (n <= 1) return 1;` |
| **Recursive case** | Decomposes the problem into subproblems | `return n * f(n-1);` |

| Consideration | Description |
| --------- | ---------- |
| A base case is required | Otherwise infinite recursion causes stack overflow |
| The base case must be reachable | Otherwise infinite recursion causes stack overflow |
| Recursion must not be too deep | Otherwise stack overflow occurs |
| Avoid repeated computation | Optimize with caching |
| Consider tail recursion | Pass the accumulated result as an argument |

### 3. Common Recursive Scenarios

| Scenario | Recurrence | Base case |
| ---- | ------------------------ | ----------------- |
| Factorial | `f(n) = n * f(n-1)` | `f(0) = f(1) = 1` |
| Cumulative sum | `f(n) = n + f(n-1)` | `f(1) = 1` |
| Fibonacci | `f(n) = f(n-1) + f(n-2)` | `f(1) = f(2) = 1` |
| Traverse directory | Recurse into subdirectories | Return when not a directory |
| Delete directory | Delete children before the directory itself | Delete directly when a file |
| Copy directory | Create directory; copy children | Copy contents when a file |
