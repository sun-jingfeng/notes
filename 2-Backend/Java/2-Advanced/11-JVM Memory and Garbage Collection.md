## I. JVM Memory Model

### 1. Five Memory Areas

The JVM runtime data areas comprise five regions, divided into **thread-private** and **thread-shared** areas:

| Area | Ownership | Contents | Typical error |
|------|------|----------|----------|
| **Program counter** | Thread-private | Bytecode instruction position of the current thread | None (the only area without OOM) |
| **JVM stack** | Thread-private | Stack frames (local variables, operand stack, return address) | `StackOverflowError` (excessive depth), `OOM` (cannot expand) |
| **Native method stack** | Thread-private | Execution state of native methods | `StackOverflowError`, `OOM` |
| **Heap** | Thread-shared | All object instances and arrays | `OutOfMemoryError: Java heap space` |
| **Method area / metaspace** | Thread-shared | Class metadata, static variables, runtime constant pools | `OOM: Metaspace` (JDK 8+) |

***

### 2. Areas in Detail

#### Program Counter

Each thread has an independent program counter. Its value is undefined while executing a native method.

#### JVM Stack

Each method invocation pushes a **stack frame**, which is popped on return. A frame contains:

- **Local variable table**: primitive values and object references.
- **Operand stack**: workspace for bytecode instructions.
- **Return address**: where execution resumes after normal or exceptional method completion.

Excessively deep recursion keeps pushing frames and causes `StackOverflowError`.

#### Heap

The JVM's largest memory area and the main focus of GC. Generational layout:

```
Heap
├── Young generation: approximately 1/3 of the heap
│   ├── Eden (approximately 8/10)
│   ├── Survivor 0 (S0, approximately 1/10)
│   └── Survivor 1 (S1, approximately 1/10)
└── Old generation: approximately 2/3 of the heap
```

Object promotion process:

1. New objects are allocated in **Eden**.
2. Objects surviving Minor GC move to **S0** or **S1**, increasing their age by 1.
3. Objects reach the **old generation** when their age reaches the threshold (default 15) or Survivor space cannot hold them.
4. Large objects exceeding `-XX:PretenureSizeThreshold` go directly to the old generation.

#### Method Area / Metaspace

- JDK 7 and earlier: **PermGen**, located within heap memory with a fixed upper bound; loading too many classes can cause `OOM: PermGen space`.
- JDK 8+: **Metaspace**, moved to native memory, with no fixed default limit beyond physical-memory constraints; `OOM: Metaspace` is less common.

The runtime constant pool belongs to the JVM specification's **method area** and is the runtime representation of each class or interface's constant pool. It differs from the string intern pool used by `String.intern()`. Changes in string storage must not be generalized as “the entire runtime constant pool moved to the heap.”

***

## II. Garbage Collection

### 1. Determining Whether Objects Are Alive

**Reference counting**: each object tracks the number of references to it and becomes reclaimable at zero. It cannot handle reference cycles; Java does not use this approach.

**Reachability analysis (GC roots)**: searches outward from GC roots; unreachable objects are garbage. Java uses this approach.

GC roots include objects referenced by JVM stacks, static variables/constants in the method area, and native methods on native method stacks.

***

### 2. Three Basic Collection Algorithms

| Algorithm | Principle | Advantages | Disadvantages |
|------|------|------|------|
| **Mark-sweep** | Marks live objects and removes unmarked ones | Simple implementation | Memory fragmentation; marking and sweeping are not highly efficient |
| **Mark-compact** | Marks live objects, moves them to one end, clears memory beyond the boundary | No fragmentation | Moving objects adds overhead |
| **Copying** | Divides memory into two areas; copies survivors to the other area and clears the original | Efficient, no fragmentation | Only 50% memory utilization |

The young generation uses **copying** (S0/S1 alternate alongside Eden; actual unused capacity is under 10%); the old generation uses **mark-compact** or **mark-sweep**.

***

### 3. Four Reference Types

Reference strength determines how objects survive GC pressure:

| Reference type | Class/form | GC behavior | Typical use |
|----------|-----|---------|---------|
| **Strong** | Ordinary variable assignment | Objects strongly reachable from GC roots are not reclaimed; strong references solely between unreachable objects do not prevent collection | Keeps objects alive |
| **Soft** | `SoftReference<T>` | Retained when memory is sufficient; reclaimed under memory pressure | Image caches, local caches |
| **Weak** | `WeakReference<T>` | Reclaimed during GC regardless of available memory | `WeakHashMap`, `ThreadLocal` keys |
| **Phantom** | `PhantomReference<T>` | Does not keep an object alive or allow retrieving it | Tracks reclamation timing (NIO off-heap memory cleanup) |

```java
// Soft-reference example: cache automatically released under memory pressure
SoftReference<byte[]> cache = new SoftReference<>(new byte[1024 * 1024]);
byte[] data = cache.get();  // May be null (already reclaimed by GC)

// Weak-reference example: use a ReferenceQueue to detect reclamation
WeakReference<Object> weak = new WeakReference<>(new Object());
// After the next GC, weak.get() returns null
```

> Root cause of `ThreadLocal` memory leaks: `ThreadLocalMap` keys are weak references and may be reclaimed, but values are strongly referenced. Once the key is reclaimed, the value becomes inaccessible while still occupying memory; call `remove()` explicitly to clean it up.

***

## III. GC Categories

### 1. Minor GC / Major GC / Full GC

| Type | Collected region | Trigger | STW time |
|------|----------|----------|----------|
| **Minor GC** | Young generation | Eden full | Short (milliseconds) |
| **Major GC** | Old generation | Insufficient old-generation space | Longer |
| **Full GC** | Entire heap + method area | Old generation full, `System.gc()`, metaspace full | Longest (possibly seconds); avoid |

***

## IV. Choosing GC Collectors and Algorithms

### 1. Mainstream Collector Comparison

| Collector | Generation/region | Algorithm | Pause behavior | Concurrency | JDK availability/default |
|--------|--------|------|----------|------|-------------|
| **Serial** | Young + old | Copying / mark-compact | STW throughout | Single-threaded | Client-mode default |
| **Parallel (Scavenge + Old)** | Young + old | Copying / mark-compact | STW throughout | Multithreaded | JDK 8 Server default |
| **CMS** | Old | Mark-sweep | Initial/remark STW; concurrent marking | Concurrent marking + sweeping | Removed in JDK 14 |
| **G1** | Entire heap (regions) | Mark-compact | Predictable pause target (`-XX:MaxGCPauseMillis`) | Mixed | Default since JDK 9 |
| **ZGC** | Entire heap | Colored pointers + load barriers | Almost entirely concurrent (< 1 ms) | Almost entirely concurrent | GA since JDK 15 |
| **Shenandoah** | Entire heap | Brooks pointers | Similar magnitude to ZGC | Almost entirely concurrent | JDK 12+ (OpenJDK) |

***

### 2. Key Collector Characteristics

#### Serial GC

- Uses one GC thread and stops all application threads during collection (STW).
- Longest pauses but lowest CPU overhead; suitable for very small-memory (< 256 MB) embedded or client applications.
- Enable with `-XX:+UseSerialGC`.

***

#### Parallel GC (Throughput-Oriented)

- Multiple GC threads execute in parallel; STW throughout. Pauses are shorter than Serial but still stop the application.
- Maximizes throughput; suited to offline batch processing with ample CPU resources and low pause sensitivity.
- Default collector in JDK 8 Server mode.
- Enable with `-XX:+UseParallelGC`.

***

#### CMS（Concurrent Mark Sweep）

- Marks and sweeps concurrently with application threads; pauses occur only during the brief initial-mark and remark phases.
- Uses mark-sweep and **does not compact memory**; fragmentation accumulates over time and may trigger Full GC.
- Concurrent phases compete with application threads for CPU, reducing throughput somewhat.
- Deprecated in JDK 9 and removed in JDK 14; G1 is its direct replacement.
- Enable with `-XX:+UseConcMarkSweepGC`.

***

#### G1（Garbage First）

- Divides the heap into equally sized **regions**, without fixed Eden/old-generation boundaries.
- Prioritizes regions with the most garbage (Garbage First), reclaiming as much as possible within the pause target.
- `-XX:MaxGCPauseMillis` sets the target pause (default 200 ms); the JVM dynamically adjusts the collection set.
- Suitable for most web applications (works better with heaps over 4 GB).
- Default collector since JDK 9.
- Enable with `-XX:+UseG1GC`.

***

#### ZGC / Shenandoah

- Almost all phases (marking, relocation, remapping) execute concurrently with application threads.
- Pauses do not grow with heap size, are typically < 1 ms, and support terabyte-scale heaps.
- Concurrent GC threads continuously consume CPU; overall throughput is slightly below Parallel / G1.
- Suited to extremely latency-sensitive workloads: financial trading, real-time recommendations, large-model inference services.
- ZGC became GA in JDK 15; the improved generational ZGC was introduced in JDK 21.
- Enable with `-XX:+UseZGC`.

***

### 3. Selection Principles

| Scenario | Recommended collector | Reason |
|------|-----------|------|
| Offline batch jobs, compute-heavy, latency-insensitive | **Parallel GC** | Highest throughput |
| Ordinary web APIs, microservices (JDK 9+) | **G1 GC** | Balances throughput and latency; configurable pause target |
| Extremely latency-sensitive (< 10 ms SLA) | **ZGC / Shenandoah** | Pauses < 1 ms; barely noticeable |
| Very large heap (> 32 GB) with low latency | **ZGC** | Pauses independent of heap size; supports TB-scale heaps |
| Very small container (< 256 MB) | **Serial GC** | Lowest overhead; no multiple GC threads |

Default collectors by JDK version:

| JDK version | Default GC |
|----------|---------|
| JDK 8 | Parallel GC |
| JDK 9 – present | G1 GC |

***

## V. Diagnosing OOM and Memory Leaks

### 1. Memory Error Types

| Error category | Error message | Common cause |
|----------|----------|----------|
| **Heap exhaustion** | `OutOfMemoryError: Java heap space` | Unbounded collections/caches; loading a large file into memory at once |
| **Metaspace exhaustion** | `OutOfMemoryError: Metaspace` | Generating many classes; class-loader leaks (common with Tomcat hot deployment) |
| **Stack overflow** | `StackOverflowError` | Infinite recursion or excessive recursion depth |

***

### 2. What a Memory Leak Is

Objects are no longer needed by the application but remain referenced from GC roots, preventing reclamation and causing heap usage to keep growing.

Common causes:

- Static collections retaining references (`static List<Object>`).
- Unclosed resources (database connections, streams).
- Inner classes retaining references to outer instances.
- Caches without expiration policies.

***

### 3. Diagnostic Workflow

**Step 1: Identify the Error Type**

Read application logs to determine whether the issue involves heap, metaspace or stack; each requires a different investigation.

**Step 2: Capture a Heap Dump (For Heap Exhaustion)**

Approach 1: configure JVM startup options to dump automatically on OOM (recommended in advance):

```bash
java -XX:+HeapDumpOnOutOfMemoryError \
     -XX:HeapDumpPath=/dumps/heap.hprof \
     -jar app.jar

# Pass through JAVA_OPTS in Docker Compose
environment:
  - JAVA_OPTS=-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/dumps/heap.hprof
volumes:
  - ./dumps:/dumps    # Mount the container path externally so files survive container restarts
```

Approach 2: capture manually with jmap while the service is still running:

```bash
jps -l                                          # List process IDs
jmap -dump:format=b,file=heap.hprof <pid>       # Export a heap dump
```

**Step 3: Analyze the Heap Dump**

Open the `.hprof` file in MAT (Eclipse Memory Analyzer) or VisualVM:

1. Inspect the **Dominator Tree**: sort by retained memory to locate the largest consumers.
2. Inspect **Leak Suspects**: MAT automatically identifies possible leaks.
3. Follow **reference chains to GC roots**: identify what retains objects that should no longer be alive, then locate the cause in the code.

**Step 4: Monitor Continuously with Diagnostic Tools**

```bash
jstat -gcutil <pid> 1000
# Sample output:
#   S0     S1     E      O      M     YGC  YGCT  FGC  FGCT
#  0.00  80.12  60.23  94.87  95.01    5  0.18    2  0.42
# O (old generation) keeps rising and does not drop after Full GC → possible memory leak
```

**Common Root Causes:**

- Unbounded `static` collections/caches (entries added but never removed).
- Large files read into the heap with one `readAllBytes()` call instead of chunks.
- Missing `remove()` after `ThreadLocal` use.
- Class-loader leaks (metaspace): dynamic proxies/hot deployment continually generate classes.

***

## VI. JVM Diagnostic Tools

| Tool | Source/type | Main purpose |
|------|------|----------|
| **jps** | Bundled with the JDK | Lists local Java processes and PIDs |
| **jmap** | Bundled with the JDK | Inspects heap information; exports `.hprof` dumps |
| **jstat** | Bundled with the JDK | Monitors GC counts/times and memory-region utilization percentages |
| **jstack** | Bundled with the JDK | Dumps all thread stacks; diagnoses deadlocks, thread leaks and 100% CPU |
| **VisualVM** | Bundled with the JDK | Visual CPU/heap/thread monitoring; opens `.hprof` files |
| **MAT** | Eclipse plugin | Heap-dump analysis; automatic leak detection and Leak Suspects reports |
| **Arthas** | Alibaba open source | Attaches without restart; watches method arguments/return values live |

**Common Commands:**

```bash
jps -l
jmap -dump:format=b,file=heap.hprof <pid>
jmap -histo <pid>              # Show instance counts and sizes by class (no output file)
jstat -gcutil <pid> 1000 20    # Print once per second, 20 times
jstack <pid>
jstack <pid> | grep -A 30 "BLOCKED"   # Filter blocked threads

# Live diagnosis with Arthas
curl -O https://arthas.aliyun.com/arthas-boot.jar
java -jar arthas-boot.jar <pid>
# dashboard               Live thread/memory/GC overview
# thread -n 3             Show the 3 threads using the most CPU
# watch com.example.Service method '{params, returnObj}' -x 2
# jvm                     Show JVM configuration and memory use
```

> **Diagnosing 100% CPU**: use `top -H -p <pid>` to find the highest-CPU thread ID → convert it to hexadecimal → find the matching `nid` in `jstack <pid>` and inspect its stack.

***

## VII. Common JVM Tuning Options

| Option | Description | Example |
|------|------|------|
| `-Xms` | Initial heap size | `-Xms512m` |
| `-Xmx` | Maximum heap size (usually match -Xms to avoid dynamic resizing) | `-Xmx2g` |
| `-Xmn` | Young-generation size (or specify its ratio with `-XX:NewRatio`) | `-Xmn512m` |
| `-XX:MetaspaceSize` | Initial metaspace threshold for triggering GC | `-XX:MetaspaceSize=256m` |
| `-XX:MaxMetaspaceSize` | Metaspace limit (unlimited by default; set explicitly to avoid exhausting system memory) | `-XX:MaxMetaspaceSize=512m` |
| `-XX:NewRatio` | Old-to-young ratio (default 2; old generation is 2/3) | `-XX:NewRatio=2` |
| `-XX:SurvivorRatio` | Eden-to-one-Survivor ratio (default 8; Eden is 8/10) | `-XX:SurvivorRatio=8` |
| `-XX:MaxGCPauseMillis` | G1 pause target in ms; JVM adjusts collection scope accordingly | `-XX:MaxGCPauseMillis=200` |
| `-XX:+UseG1GC` | Enables G1 | — |
| `-XX:+UseZGC` | Enables ZGC | — |
| `-XX:+HeapDumpOnOutOfMemoryError` | Automatically dumps the heap on OOM | — |
| `-XX:HeapDumpPath` | Dump file path | `-XX:HeapDumpPath=/dumps/heap.hprof` |
| `-Xlog:gc*` | GC logging (JDK 9+ unified logging) | `-Xlog:gc*:file=gc.log` |

**Typical Production Configuration (Spring Boot + G1):**

```bash
java -Xms1g -Xmx1g \
     -XX:+UseG1GC \
     -XX:MaxGCPauseMillis=200 \
     -XX:MetaspaceSize=256m -XX:MaxMetaspaceSize=512m \
     -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/dumps/heap.hprof \
     -Xlog:gc*:file=/logs/gc.log:time,uptime:filecount=5,filesize=20m \
     -jar app.jar
```
