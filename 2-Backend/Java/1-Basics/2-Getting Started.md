## I. Background on Java

### 1. What Is Java?

Java is an **object-oriented programming language** released by Sun Microsystems (later acquired by Oracle) in 1995.

### 2. The Father of Java

**James Gosling**

### 3. Java's History

| Year | Event |
| ------ | ------------------------------------- |
| 1995 | Java publicly announced by Sun Microsystems |
| 1996 | JDK 1.0 released |
| 2004 | Java 5.0 released (major additions: generics, annotations, enums, etc.) |
| 2010 | Oracle completed its acquisition of Sun Microsystems |
| 2014 | Java 8 released (major additions: lambda expressions and the Stream API) |
| 2017 | Java 9 released (module system); the six-month release cadence began with Java 10 in 2018 |
| 2018 | Java 11 (LTS: long-term support) |
| 2021 | Java 17 (LTS: long-term support) |
| 2023 | Java 21 (LTS: long-term support) |
| 2024 | Java 22/23 released |
| 2025 | Java 24/25 released; Java 25 is an LTS release |

**Release cadence**:

*   A new version every 6 months (March and September)
*   Oracle currently plans an LTS release every 2 years; support duration depends on the distributor, release, and support plan

### 4. Java's Characteristics

| Characteristic | Description |
| -------- | ------------------------------------- |
| **Cross-platform** | "Write Once, Run Anywhere" |
| **Object-oriented** | Encapsulation, inheritance, and polymorphism |
| **Easy to learn** | Clear syntax; omits complex C++ features such as pointers |
| **Secure** | Strong type checking, memory management, and security mechanisms |
| **Robust** | Exception handling and garbage collection |
| **Multithreaded** | Built-in support for multithreading |
| **High performance** | Optimization through just-in-time (JIT) compilation |

### 5. The Three Java Editions

| Edition | Full name | Purpose |
| ----------- | ------------------ | ------------------------------- |
| **Java SE** | Standard Edition | Desktop applications and core development |
| **Java EE** | Enterprise Edition | Web development and enterprise applications (now called Jakarta EE) |
| **Java ME** | Micro Edition | Embedded and mobile devices (less commonly used today) |

### 6. Where Java Is Used

    Java application areas
    ├─ Enterprise applications (banking, e-commerce, government systems)
    ├─ Web applications (Spring, Spring Boot)
    ├─ Android development (Kotlin is increasingly mainstream, but Java remains available)
    ├─ Big data (Hadoop, Spark, Flink)
    ├─ Distributed systems (Dubbo, Spring Cloud)
    ├─ Cloud-native applications (Kubernetes Java client)
    └─ Game development (Minecraft)

***

## II. Understanding and Choosing a JDK

### 1. The Relationship Between the JDK, JRE, and JVM

| Name | Full name | Description |
| ------- | ------------------------ | ------------------- |
| **JDK** | Java Development Kit | Tools for Java development and execution |
| **JRE** | Java Runtime Environment | Environment for running Java programs (execution only) |
| **JVM** | Java Virtual Machine | Virtual machine that executes bytecode |

**Containment hierarchy**:

    JDK (Java Development Kit)
    ├─ JRE (Java Runtime Environment)
    │   ├─ JVM (Java Virtual Machine)
    │   └─ Core class libraries (rt.jar before JDK 9)
    ├─ javac (compiler)
    ├─ java (launcher)
    ├─ javadoc (documentation tool)
    ├─ jar (packaging tool)
    ├─ jshell (interactive tool, JDK 9+)
    └─ Other development tools

> **Note**: Starting with JDK 11, Oracle no longer ships a separate JRE; the JDK includes everything needed to run Java. Some distributions, such as Eclipse Temurin, still offer JRE builds.

### 2. Oracle JDK vs OpenJDK

| Comparison | Oracle JDK | OpenJDK |
| -------- | ----------------- | ------------ |
| **Cost** | Depends on the specific update, license, and use case | Open-source builds are generally free to use; commercial support may cost extra |
| **Open source** | Partially open source | Fully open source |
| **Update lifecycle** | Follows Oracle's support plan for the release | Varies by distributor; LTS builds may receive maintenance for years |
| **Performance** | Essentially the same | Essentially the same |
| **Recommended use** | Enterprise production | Learning, development, and open-source projects |

> **Version check (2026-10-26)**: Java 25 is the latest LTS release. "Oracle JDK 17+ is free" is too broad: different update releases may use different licenses, so check the exact version downloaded and your use case. See the [Oracle Java SE Support and Licensing Roadmap](https://www.oracle.com/java/technologies/java-se-support-roadmap.html).

### 3. Common JDK Distributions

| Distribution | Provider | Characteristics | Recommended use |
| ---------------------- | --------- | -------------- | ----------- |
| **Oracle JDK** | Oracle | Commercial terms depend on the specific version and license | Enterprise production |
| **Eclipse Temurin** | Eclipse | Formerly AdoptOpenJDK | General recommendation |
| **Amazon Corretto** | Amazon | Optimized for AWS; long-term support | AWS cloud environments |
| **Azul Zulu** | Azul | Multiple platforms; commercial editions available | Embedded systems and enterprises |
| **Microsoft Build** | Microsoft | Optimized for Azure | Azure cloud environments |
| **GraalVM** | Oracle | High performance and support for multiple languages | Cloud-native applications and microservices |
| **Alibaba Dragonwell** | Alibaba | Optimized for large-scale workloads | Large-scale Java applications |

**For beginners**: Eclipse Temurin or Oracle JDK

### 4. Choosing a Version

| Scenario | Recommended version |
| --------- | -------------------------- |
| **Beginners** | JDK 17 or JDK 21 (LTS) |
| **Enterprise development** | Choose JDK 8, 11, 17, 21, 25, etc. according to project and framework compatibility |
| **New projects** | Consider JDK 25 (LTS), after confirming framework compatibility |
| **Learning new features** | Refer to the current releases and corresponding feature documentation on the official website |

***

## III. Downloading and Installing the JDK

### 1. JDK Download Links

| Distribution | Download URL |
| ------------------- | ----------------------------------------------------- |
| **Oracle JDK**      | <https://www.oracle.com/java/technologies/downloads/> |
| **Eclipse Temurin** | <https://adoptium.net/>                               |
| **Amazon Corretto** | <https://aws.amazon.com/corretto/>                    |
| **Azul Zulu**       | <https://www.azul.com/downloads/>                     |

### 2. Windows Installation

**Option 1: Installer**

    1. Download the JDK installer (.exe or .msi)
    2. Double-click to run it
    3. Choose an installation path (preferably without Chinese characters or spaces)
       Recommended path: D:\Java\jdk-17
    4. Click "Next" to complete installation
    5. Configure the JAVA_HOME and Path environment variables

**Option 2: Install with Scoop (recommended)**

```powershell
# Install Scoop (if not already installed)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Add the Java bucket
scoop bucket add java

# Install the JDK (environment variables are configured automatically)
scoop install temurin17-jdk

# Switch JDK versions
scoop reset temurin17-jdk
scoop reset temurin21-jdk
```

### 3. macOS Installation

**Option 1: Official installer**

```bash
# Download the .dmg file and double-click to install
# Installation location: /Library/Java/JavaVirtualMachines/jdk-17.jdk
```

**Option 2: Install with Homebrew**

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install JDK 17
brew install openjdk@17

# Create a symbolic link (Apple Silicon path; Intel Macs use /usr/local/opt)
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

**Option 3: Install with SDKMAN (recommended; supports multiple versions)**

```bash
# Install SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# List available JDK versions
sdk list java

# Install a JDK (exact identifiers change over time; copy one from sdk list java)
sdk install java 17.0.9-tem    # Eclipse Temurin 17
sdk install java 21.0.1-tem    # Eclipse Temurin 21

# Change the default version
sdk default java 17.0.9-tem

# Switch versions temporarily (current terminal only)
sdk use java 21.0.1-tem
```

### 4. Linux Installation

**Option 1: Install with a package manager**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# CentOS/RHEL
sudo yum install java-17-openjdk-devel

# Fedora
sudo dnf install java-17-openjdk-devel

# Arch Linux
sudo pacman -S jdk17-openjdk
```

**Option 2: Install with SDKMAN (recommended)**

```bash
# Install SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# Install a JDK
sdk install java 17.0.9-tem
```

### 5. Verify the Installation

```bash
# Check the Java version
java -version

# Check the compiler version
javac -version

# Check JAVA_HOME
echo $JAVA_HOME        # Linux/macOS
echo %JAVA_HOME%       # Windows
```

**Example output on success**:

    openjdk version "17.0.9" 2023-10-17
    OpenJDK Runtime Environment Temurin-17.0.9+9 (build 17.0.9+9)
    OpenJDK 64-Bit Server VM Temurin-17.0.9+9 (build 17.0.9+9, mixed mode, sharing)

***

## IV. Configuring Environment Variables

### 1. Why Configure Environment Variables?

    Problem: entering javac on the command line produces a command-not-found error

    Cause: the system does not know where javac is located

    Solution: tell the system where the JDK is installed (configure environment variables)

### 2. Windows Environment Variables

    1. Right-click "This PC" → "Properties" → "Advanced system settings" → "Environment Variables"

    2. Create a system variable named JAVA_HOME
       Variable name: JAVA_HOME
       Variable value: D:\Java\jdk-17 (the JDK installation path)

    3. Edit the Path system variable
       Add: %JAVA_HOME%\bin

    4. Click "OK" to save

    5. Open a new command prompt and verify
       java -version
       javac -version

**Temporary settings in PowerShell**:

```powershell
$env:JAVA_HOME = "D:\Java\jdk-17"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
```

### 3. macOS Environment Variables

**Edit the configuration file**:

```bash
# Zsh (the default shell)
nano ~/.zshrc

# Or Bash
nano ~/.bash_profile
```

**Add the following**:

```bash
# Java environment variables
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
# Or specify the exact path
# export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home

export PATH=$JAVA_HOME/bin:$PATH
```

**Apply the configuration**:

```bash
source ~/.zshrc
```

**Verify**:

```bash
echo $JAVA_HOME
java -version
```

### 4. Linux Environment Variables

**Edit the configuration file**:

```bash
# User-level configuration (recommended)
nano ~/.bashrc

# Or system-wide configuration
sudo nano /etc/profile
```

**Add the following**:

```bash
# Java environment variables
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk   # Path varies by distribution (Ubuntu: java-17-openjdk-amd64)
export PATH=$JAVA_HOME/bin:$PATH
```

**Apply the configuration**:

```bash
source ~/.bashrc
```

### 5. Environment Variables Explained

| Variable | Description |
| -------------- | ------------------------------------ |
| **JAVA\_HOME** | JDK installation directory; required by many tools (Maven, Gradle, IDEA) |
| **PATH** | System command search path; add the JDK's bin directory |

### 6. Switching Between Versions

**Windows (manual switching)**:

```powershell
# Change JAVA_HOME to point to a different version
# Or switch using a script
```

**macOS/Linux (using SDKMAN)**:

```bash
# Change the default version
sdk default java 17.0.9-tem

# Switch temporarily (current terminal only)
sdk use java 21.0.1-tem

# Show the current version
sdk current java
```

**macOS (using java\_home)**:

```bash
# List installed JDKs
/usr/libexec/java_home -V

# Switch temporarily
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
```

***

## V. Your First Java Program: HelloWorld

### 1. Write the Code

Create a file named `HelloWorld.java`:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### 2. Understanding the Code

```java
public class HelloWorld {           // Define a public class; its name must match the filename
    public static void main(String[] args) {  // Main method: the program entry point
        System.out.println("Hello, World!");  // Output statement
    }
}
```

| Code | Description |
| ---------------------------------------- | ------------ |
| `public` | Access modifier: public access |
| `class` | Keyword that defines a class |
| `HelloWorld` | Class name; must match the filename |
| `public static void main(String[] args)` | Main method: the program entry point |
| `System.out.println()` | Output statement: prints content followed by a newline |

### 3. Compile and Run

**Traditional approach (compile, then run)**:

```bash
# 1. Compile: turn the .java file into a .class file
javac HelloWorld.java

# 2. Run: execute the .class file (omit the .class extension)
java HelloWorld

# Output
Hello, World!
```

**Single-file execution (JDK 11+; recommended for beginners)**:

```bash
# Run the .java file directly, without compiling it first
java HelloWorld.java

# Output
Hello, World!
```

> **Note**: Single-file execution applies only to a single source file; projects with multiple files still need compilation.

### 4. Simplified Syntax in JDK 21+ (Finalized in 25)

```java
// Traditional syntax
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// Simplified syntax in a separate source file: a preview feature in JDK 21–24, finalized in JDK 25
// No public, static, or String[] args required
void main() {
    System.out.println("Hello, World!");
}

// Enable preview features with JDK 21; for 22–24, use the matching JDK and --source version
// java --enable-preview --source 21 HelloWorld.java
// From JDK 25 onward, no preview flag is needed: java HelloWorld.java
```

### 5. Interactive Programming with jshell (JDK 9+)

```bash
# Start jshell
jshell

# Enter code directly for immediate execution
jshell> System.out.println("Hello, World!")
Hello, World!

jshell> int a = 10
a ==> 10

jshell> int b = 20
b ==> 20

jshell> a + b
$4 ==> 30

jshell> String name = "Java"
name ==> "Java"

jshell> name.toUpperCase()
$6 ==> "JAVA"

# List variables
jshell> /vars

# List methods
jshell> /methods

# View history
jshell> /list

# Exit
jshell> /exit
```

**Uses for jshell**:

*   Quickly test code snippets
*   Learn and experiment with APIs
*   No need to create a complete class

### 6. Points to Remember

| Item | Description |
| --- | --------------------- |
| Filename | Must match the public class name and end in `.java` |
| Class name | Use UpperCamelCase (HelloWorld) |
| Main method | Follow the exact syntax |
| Semicolon | End each statement with a semicolon `;` |
| Case sensitivity | Java is case-sensitive |
| Encoding | UTF-8 is recommended |

### 7. Common Errors

| Error | Cause | Solution |
| ------------------- | ---------- | -------------------------- |
| `'javac' is not recognized as an internal or external command` | Environment variables are not configured | Configure JAVA\_HOME and PATH |
| `File not found` | Incorrect path or filename | Check the current directory and filename |
| `class HelloWorld is public` | Filename does not match the class name | Make the names match |
| `error: ';' expected` | Missing semicolon | Add the semicolon |
| `Garbled text` | Encoding problem | Use `javac -encoding UTF-8` |
| `Could not find or load main class` | Package or classpath problem | Check the package declaration and execution directory |

***

## VI. How Java Programs Execute

### 1. Compilation and Execution

    Source code (.java)
         ↓ compiled by javac
    Bytecode (.class)
         ↓ launched by java
    Loaded and executed by the JVM
         ↓
    Operating system
         ↓
    Hardware (CPU)

### 2. Detailed Process

    ┌─────────────────────────────────────────────────┐
    │ 1. Write source code                            │
    │    HelloWorld.java                              │
    │    public class HelloWorld {                    │
    │        public static void main(String[] args) { │
    │            System.out.println("Hello, World!"); │
    │        }                                        │
    │    }                                            │
    └─────────────────────────────────────────────────┘
                              ↓ javac HelloWorld.java
    ┌─────────────────────────────────────────────────────────────┐
    │ 2. Compile to bytecode                                      │
    │    HelloWorld.class                                         │
    │    (a binary file that the JVM can execute)                 │
    │    ├─ Class and method information                          │
    │    ├─ Constant pool                                         │
    │    └─ Bytecode instructions                                 │
    └─────────────────────────────────────────────────────────────┘
                              ↓ java HelloWorld
    ┌─────────────────────────────────────────────────────────────┐
    │ 3. The JVM loads and executes it                            │
    │    ├─ The class loader loads the .class file                │
    │    │   ├─ Loading                                           │
    │    │   ├─ Linking: verification, preparation, resolution    │
    │    │   └─ Initialization                                    │
    │    ├─ Interpretation / JIT compilation                      │
    │    └─ Output: Hello, World!                                 │
    └─────────────────────────────────────────────────────────────┘

### 3. Why Can Java Run Across Platforms?

    Source code → platform-independent bytecode → executed by each platform's JVM

    Windows JVM ─┐
                 ├─ Executes the same bytecode
    macOS JVM ───┤
                 │
    Linux JVM ───┘

    "Write Once, Run Anywhere"

**Key points**:

*   Bytecode is platform-independent intermediate code
*   Different platforms have different JVM implementations
*   The JVM translates bytecode into machine code

### 4. JVM Execution Modes

| Execution mode | Description | Characteristics |
| ---------- | ------------------- | ---------- |
| **Interpretation** | Interprets bytecode as machine code instruction by instruction | Fast startup, slower execution |
| **JIT compilation** | Compiles hot code to machine code and caches it | Slower startup, faster execution |
| **Mixed mode** | Interprets initially, then JIT-compiles hot code | Balances startup and execution speed |
| **AOT compilation** | Compiles ahead of time to machine code (GraalVM, etc.) | Very fast startup; no warmup time |

**JIT (Just-In-Time) compilation**:

    ┌──────────────────────────────────────────────────────────────────┐
    │                      JIT Compilation                             │
    ├──────────────────────────────────────────────────────────────────┤
    │ 1. The program starts by interpreting bytecode                   │
    │ 2. The JVM counts method invocations (hotspot detection)         │
    │ 3. A method's invocation count exceeds a threshold (e.g. 10000)  │
    │ 4. The JIT compiler compiles it to native machine code           │
    │ 5. Later calls execute machine code directly (no interpretation) │
    └──────────────────────────────────────────────────────────────────┘

### 5. Responsibilities of the JVM

| Responsibility | Description |
| --------- | ------------------ |
| **Load bytecode** | Load .class files into memory |
| **Verify bytecode** | Ensure code is safe and valid |
| **Execute code** | Interpret it or execute JIT-compiled code |
| **Manage memory** | Automatically allocate and reclaim memory (garbage collection, GC) |
| **Support multiple platforms** | Hide differences between operating systems |
| **Manage security** | Class-loading checks and a security sandbox |

### 6. Compiled vs. Interpreted Languages

| Type | Description | Examples |
| ---------- | -------------------- | ---------------------- |
| **Compiled** | Source code is compiled into machine code up front | C, C++, Go, Rust |
| **Interpreted** | Source code is interpreted and executed line by line | Python, JavaScript, Ruby |
| **Partly compiled, partly interpreted** | Compiled to bytecode, then interpreted/compiled by a virtual machine | **Java**, C#, Kotlin |

**Java's approach**:

*   Compile to bytecode (javac)
*   JVM interpretation + just-in-time compilation
*   Balance cross-platform support with performance

***

## VII. JDK Directory Structure

### 1. JDK Installation Directory

    jdk-17/
    ├─ bin/              # Executables (javac, java, jshell, etc.)
    ├─ conf/             # Configuration files
    ├─ include/          # C header files (for JNI development)
    ├─ jmods/            # Module files (JDK 9+)
    ├─ legal/            # Legal documents
    ├─ lib/              # Class libraries
    │   ├─ modules       # Modular class libraries (replaces rt.jar in JDK 9+)
    │   ├─ src.zip       # Source code
    │   └─ ...
    └─ release           # Version information

### 2. Common Tools in bin

| Tool | Description |
| ----------- | --------------------- |
| `javac` | Java compiler: compiles .java files |
| `java` | Java launcher: starts the JVM to run .class or .jar files |
| `javadoc` | Generates API documentation |
| `jar` | Packaging tool: creates .jar files |
| `jshell` | Interactive programming tool (JDK 9+) |
| `jlink` | Creates custom runtime images (JDK 9+) |
| `jpackage` | Packages applications as native installers (JDK 16+; incubating in 14) |
| `jps` | Lists Java processes |
| `jstack` | Displays thread stack traces |
| `jmap` | Displays memory information |
| `jstat` | Monitors JVM statistics |
| `jconsole` | Graphical monitoring tool |
| `jvisualvm` | Visual performance analysis (bundled only through JDK 8; download VisualVM separately for later JDKs) |
| `keytool` | Manages keys and certificates |

### 3. Modularity in JDK 9+

    Before JDK 9:
    ├─ rt.jar (all core class libraries, about 60MB)
    └─ Applications could not trim the runtime to their needs

    From JDK 9 onward:
    ├─ jmods/ (modular class libraries)
    │   ├─ java.base.jmod (core module)
    │   ├─ java.sql.jmod (database module)
    │   ├─ java.xml.jmod (XML module)
    │   └─ ... (about 70 modules)
    └─ Use jlink to create a custom runtime

**Create a custom runtime**:

```bash
# Include only java.base for a smaller footprint
jlink --module-path $JAVA_HOME/jmods \
      --add-modules java.base \
      --output custom-jre

# Check the size (about 30MB versus 300MB+ for the full JDK)
du -sh custom-jre
```

***

## VIII. Summary Mind Map

    Java Fundamentals
        │
        ├── Background on Java
        │     ├─ Released by Sun in 1995
        │     ├─ Father of Java: James Gosling
        │     ├─ Characteristics: cross-platform, object-oriented, secure, robust
        │     ├─ Three editions: SE, EE, ME
        │     └─ LTS releases: 8, 11, 17, 21, 25
        │
        ├── Choosing a JDK
        │     ├─ Oracle JDK vs OpenJDK
        │     ├─ Common distributions: Temurin, Corretto, Zulu
        │     └─ Recommended: JDK 17 or JDK 21
        │
        ├── Downloading and installing the JDK
        │     ├─ JDK = JRE + development tools
        │     ├─ JRE = JVM + core class libraries
        │     ├─ Installation: official packages, SDKMAN, Homebrew
        │     └─ Verify: java -version
        │
        ├── Environment configuration
        │     ├─ JAVA_HOME: JDK installation directory
        │     ├─ PATH: add the JDK's bin directory
        │     └─ Switch versions: SDKMAN
        │
        ├── HelloWorld
        │     ├─ Write: HelloWorld.java
        │     ├─ Compile and run: javac + java
        │     ├─ Single-file execution: java HelloWorld.java (JDK 11+)
        │     └─ Interactive: jshell (JDK 9+)
        │
        └── Execution principles
              ├─ .java → javac → .class → java → JVM → execution
              ├─ Cross-platform support: bytecode + a JVM for each platform
              └─ Execution: interpretation + JIT compilation

***

## IX. Frequently Asked Questions

### 1. Which Version Should I Use to Learn Java?

**Recommended**: JDK 17 or JDK 21 (LTS: long-term support)

### 2. How Do the JDK and JRE Differ?

| JDK         | JRE       |
| ----------- | --------- |
| Development + execution | Execution only |
| Includes the javac compiler | Does not include a compiler |
| Needed by developers | Users only need the JRE |

> **Note**: Starting with JDK 11, Oracle no longer ships a separate JRE (some distributions, such as Eclipse Temurin, still offer JRE builds)

### 3. Why Configure JAVA\_HOME?

*   Many tools (Maven, Gradle, Tomcat, IDEA) need it
*   It makes switching JDK versions easier
*   It provides a consistent configuration

### 4. How Do Compilation and Execution Differ?

| Compilation | Execution |
| -------------- | --------- |
| javac          | java      |
| .java → .class | Executes .class files |
| Checks syntax errors | Runs program logic |
| Generates bytecode | The JVM loads and executes it |

### 5. Should I Choose Oracle JDK or OpenJDK?

*   **Learning and development**: Either works; Eclipse Temurin (an OpenJDK distribution) is recommended
*   **Enterprise production**: Follow company requirements, considering licensing and support
*   **Feature differences**: Essentially the same; Oracle JDK has a small number of commercial features

### 6. How Can I Manage Multiple JDK Versions?

*   **Linux/macOS**: Use SDKMAN
*   **Windows**: Use Scoop or switch JAVA\_HOME manually
*   **IDEA**: Configure a different SDK for each project
