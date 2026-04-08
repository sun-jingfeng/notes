## 一、JVM 内存模型

### 1. 五大内存区域

JVM 运行时数据区分为**线程私有**和**线程共享**两类，共五个区域：

| 区域 | 所属 | 存储内容 | 典型异常 |
|------|------|----------|----------|
| **程序计数器** | 线程私有 | 当前线程执行的字节码行号 | 无（唯一不会 OOM 的区域） |
| **虚拟机栈** | 线程私有 | 栈帧（局部变量表、操作数栈、方法返回地址） | `StackOverflowError`（栈深超限）、`OOM`（无法扩展） |
| **本地方法栈** | 线程私有 | native 方法执行状态 | `StackOverflowError`、`OOM` |
| **堆** | 线程共享 | 所有对象实例和数组 | `OutOfMemoryError: Java heap space` |
| **方法区 / 元空间** | 线程共享 | 类元数据、静态变量、运行时常量池 | `OOM: Metaspace`（JDK 8+） |

***

### 2. 各区域详解

#### 程序计数器

每个线程有自己独立的程序计数器，互不干扰。执行 native 方法时值为空（undefined）。

#### 虚拟机栈

每次方法调用压入一个**栈帧**，方法返回时弹出。栈帧包含：

- **局部变量表**：存基本类型变量和对象引用
- **操作数栈**：执行字节码指令时的工作区
- **方法返回地址**：方法正常/异常退出后跳回的位置

递归调用过深，栈帧不断压入导致 `StackOverflowError`。

#### 堆

JVM 中最大的一块内存，GC 的主要工作区域。按代划分：

```
堆
├── 新生代（Young Generation）：占堆约 1/3
│   ├── Eden 区（约 8/10）
│   ├── Survivor 0（S0，约 1/10）
│   └── Survivor 1（S1，约 1/10）
└── 老年代（Old Generation）：占堆约 2/3
```

对象的晋升过程：

1. 新对象在 **Eden** 区分配
2. Minor GC 后存活的对象移入 **S0** 或 **S1**，年龄 +1
3. 年龄达到阈值（默认 15）或 Survivor 区装不下时，晋升到**老年代**
4. 大对象（超过 `-XX:PretenureSizeThreshold`）直接进老年代

#### 方法区 / 元空间

- JDK 7 及之前：**永久代（PermGen）**，在堆内，有固定上限，类加载过多容易触发 `OOM: PermGen space`
- JDK 8+：**元空间（Metaspace）**，迁移到本地内存，默认无固定上限，受物理内存约束，`OOM: Metaspace` 较少见

运行时常量池在 JDK 7 起移入堆中。

***

## 二、垃圾回收机制

### 1. 对象存活判断

**引用计数法**：每个对象记录指向它的引用数，为 0 则可回收。无法处理循环引用，Java 不使用此方式。

**可达性分析（GC Roots 法）**：从 GC Roots 出发向下搜索，不可达的对象即为垃圾。Java 采用此方式。

GC Roots 包括：虚拟机栈中引用的对象、方法区中静态变量/常量引用的对象、本地方法栈中 native 方法引用的对象。

***

### 2. 三种基本回收算法

| 算法 | 原理 | 优点 | 缺点 |
|------|------|------|------|
| **标记-清除** | 标记存活对象，清除未标记对象 | 实现简单 | 产生内存碎片；标记和清除效率不高 |
| **标记-整理** | 标记存活对象，整理到内存一端，清除边界外 | 无碎片 | 整理过程需移动对象，开销更大 |
| **复制** | 将内存分两块，存活对象复制到另一块，清空原区 | 无碎片，效率高 | 内存利用率只有 50% |

新生代用**复制算法**（S0/S1 轮换，Eden 和 Survivor 配合，实际浪费不到 10%）；老年代用**标记-整理**或**标记-清除**。

***

### 3. 四种引用类型

引用强度决定对象在 GC 压力下的存活策略：

| 引用类型 | 类 | GC 行为 | 典型用途 |
|----------|-----|---------|---------|
| **强引用** | 普通变量赋值 | 永不被 GC 回收，宁可 OOM | 所有普通对象 |
| **软引用** | `SoftReference<T>` | 内存充足时保留，内存不足时回收 | 图片缓存、本地缓存 |
| **弱引用** | `WeakReference<T>` | 只要发生 GC 就回收，无论内存是否充足 | `WeakHashMap`、`ThreadLocal` 的 key |
| **虚引用** | `PhantomReference<T>` | 形同无引用，无法通过它获取对象 | 跟踪对象被回收时机（NIO 堆外内存回收） |

```java
// 软引用示例：内存不足时缓存自动释放
SoftReference<byte[]> cache = new SoftReference<>(new byte[1024 * 1024]);
byte[] data = cache.get();  // 可能为 null（已被 GC 回收）

// 弱引用示例：配合 ReferenceQueue 感知对象被回收
WeakReference<Object> weak = new WeakReference<>(new Object());
// 下次 GC 后 weak.get() 返回 null
```

> `ThreadLocal` 内存泄漏根因：`ThreadLocalMap` 的 key 是弱引用（会被回收），但 value 是强引用。key 被回收后 value 无法访问却仍占内存，需手动调用 `remove()` 清理。

***

## 三、GC 分类

### 1. Minor GC / Major GC / Full GC

| 类型 | 回收区域 | 触发条件 | STW 时间 |
|------|----------|----------|----------|
| **Minor GC** | 新生代 | Eden 区满 | 短（毫秒级） |
| **Major GC** | 老年代 | 老年代空间不足 | 较长 |
| **Full GC** | 整个堆 + 方法区 | 老年代满、`System.gc()`、元空间满 | 最长（可能秒级），需避免 |

***

## 四、GC 收集器及算法选型

### 1. 主流 GC 收集器对比

| 收集器 | 适用代 | 算法 | 停顿类型 | 并发 | JDK 默认版本 |
|--------|--------|------|----------|------|-------------|
| **Serial** | 新生代 + 老年代 | 复制 / 标记-整理 | STW（全程） | 单线程 | 客户端模式默认 |
| **Parallel（Scavenge + Old）** | 新生代 + 老年代 | 复制 / 标记-整理 | STW（全程） | 多线程 | JDK 8 Server 默认 |
| **CMS** | 老年代 | 标记-清除 | 初始/重新标记 STW，标记并发 | 并发标记 + 清除 | JDK 14 废弃 |
| **G1** | 整堆（Region 化） | 标记-整理 | 可预期停顿（`-XX:MaxGCPauseMillis`） | 混合 | JDK 9+ 默认 |
| **ZGC** | 整堆 | 着色指针 + 读屏障 | 几乎全并发（< 1ms） | 几乎全并发 | JDK 15+ GA |
| **Shenandoah** | 整堆 | Brooks 指针 | 同 ZGC 量级 | 几乎全并发 | JDK 12+ (OpenJDK) |

***

### 2. 各收集器关键特点

#### Serial GC

- 回收时只用单线程，GC 期间停止所有用户线程（STW）
- 停顿时间最长，但 CPU 开销最低，适合内存极小（< 256 MB）的嵌入式或客户端场景
- 启用参数：`-XX:+UseSerialGC`

***

#### Parallel GC（吞吐量优先）

- 多 GC 线程并行执行，全程 STW，停顿时间比 Serial 短，但仍是 STW
- 以最大化吞吐量为目标，适合 CPU 资源充足、对停顿不敏感的离线批处理
- JDK 8 Server 模式的默认收集器
- 启用参数：`-XX:+UseParallelGC`

***

#### CMS（Concurrent Mark Sweep）

- 在应用线程运行期间并发执行标记和清除，停顿只发生在"初始标记"和"重新标记"两个短暂阶段
- 使用标记-清除算法，**不压缩内存**，长期运行会产生碎片，可能触发 Full GC
- 并发阶段与应用线程竞争 CPU，吞吐量有所下降
- JDK 9 废弃，JDK 14 移除；G1 是其直接替代者
- 启用参数：`-XX:+UseConcMarkSweepGC`

***

#### G1（Garbage First）

- 将堆划分为若干大小相等的 **Region**，不区分固定的 Eden / Old 边界
- 优先回收垃圾最多的 Region（Garbage First），在可预期的停顿时间内尽量多回收
- 通过 `-XX:MaxGCPauseMillis` 设置目标停顿时间（默认 200ms），JVM 动态调整回收集合
- 适合大多数 Web 应用（4 GB 以上堆效果更好）
- JDK 9+ 默认收集器
- 启用参数：`-XX:+UseG1GC`

***

#### ZGC / Shenandoah

- 几乎所有阶段（标记、转移、重映射）均与应用线程并发执行
- 停顿时间不随堆大小增长，通常 < 1ms，支持 TB 级别超大堆
- 代价是并发 GC 线程持续消耗 CPU，整体吞吐量略低于 Parallel / G1
- 适合对延迟极度敏感的场景：金融交易、实时推荐、大模型推理服务
- JDK 15+ ZGC 进入 GA；分代 ZGC（更优）在 JDK 21 引入
- 启用参数：`-XX:+UseZGC`

***

### 3. 选型原则

| 场景 | 推荐收集器 | 原因 |
|------|-----------|------|
| 离线批处理、计算密集、响应时间不敏感 | **Parallel GC** | 吞吐量最高 |
| 常规 Web API、微服务（JDK 9+） | **G1 GC** | 吞吐量与延迟均衡，可配置停顿时间 |
| 延迟极度敏感（< 10ms SLA） | **ZGC / Shenandoah** | 停顿 < 1ms，几乎无感知 |
| 超大堆（> 32 GB）且低延迟 | **ZGC** | 停顿不随堆增长，支持 TB 堆 |
| 容器极小（< 256 MB） | **Serial GC** | 开销最低，无需多 GC 线程 |

各 JDK 版本默认收集器：

| JDK 版本 | 默认 GC |
|----------|---------|
| JDK 8 | Parallel GC |
| JDK 9 – 现在 | G1 GC |

***

## 五、OOM 与内存泄漏排查

### 1. OOM 类型

| OOM 类型 | 错误信息 | 常见原因 |
|----------|----------|----------|
| **堆溢出** | `OutOfMemoryError: Java heap space` | 集合/缓存持续增长未清理、大文件一次性读入内存 |
| **元空间溢出** | `OutOfMemoryError: Metaspace` | 动态生成大量类、类加载器泄漏（Tomcat 热部署场景多见） |
| **栈溢出** | `StackOverflowError` | 无限递归、递归深度过大 |

***

### 2. 内存泄漏的本质

对象不再被业务使用，但仍被 GC Roots 持有引用，导致 GC 无法回收，堆内存持续增长。

常见原因：

- 静态集合持有对象引用（`static List<Object>`）
- 未关闭的资源（数据库连接、流）
- 内部类持有外部类引用
- 缓存未设置过期策略

***

### 3. 排查流程

**第一步：确认 OOM 类型**

看应用日志，根据错误信息确定是堆、元空间还是栈，三种类型排查方向完全不同。

**第二步：收集堆快照（针对堆溢出）**

方式一：JVM 启动参数，OOM 发生时自动 dump（推荐提前配置）：

```bash
java -XX:+HeapDumpOnOutOfMemoryError \
     -XX:HeapDumpPath=/dumps/heap.hprof \
     -jar app.jar

# Docker Compose 中通过 JAVA_OPTS 传入
environment:
  - JAVA_OPTS=-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/dumps/heap.hprof
volumes:
  - ./dumps:/dumps    # 将容器内路径挂出，防止容器重启后文件丢失
```

方式二：jmap 手动 dump（服务未崩溃时）：

```bash
jps -l                                          # 查看进程 ID
jmap -dump:format=b,file=heap.hprof <pid>       # 导出堆快照
```

**第三步：分析堆快照**

用 MAT（Eclipse Memory Analyzer）或 VisualVM 打开 `.hprof` 文件：

1. 查看 **Dominator Tree**：按对象占用内存从大到小排列，定位"大户"
2. 查看 **Leak Suspects**：MAT 自动推断泄漏嫌疑对象
3. 追踪 **GC Roots 引用链**：找到谁持有了不应该还活着的对象，对应到代码中定位原因

**第四步：配合工具持续监控**

```bash
jstat -gcutil <pid> 1000
# 输出示例：
#   S0     S1     E      O      M     YGC  YGCT  FGC  FGCT
#  0.00  80.12  60.23  94.87  95.01    5  0.18    2  0.42
# O（Old 区）持续上涨且 Full GC 后不下降 → 内存泄漏信号
```

**常见根因：**

- `static` 集合/缓存无限增长（只进不出）
- 大文件未分块读取，一次性 `readAllBytes()` 进堆
- `ThreadLocal` 使用后未调用 `remove()`
- 类加载器泄漏（元空间）：动态代理/热部署持续产生新类

***

## 六、JVM 诊断工具链

| 工具 | 类型 | 核心用途 |
|------|------|----------|
| **jps** | JDK 自带 | 列出本机所有 Java 进程及 PID |
| **jmap** | JDK 自带 | 查看堆信息；导出 `.hprof` 堆快照 |
| **jstat** | JDK 自带 | 实时监控 GC 次数、耗时、各内存区占用百分比 |
| **jstack** | JDK 自带 | 导出所有线程调用栈；排查死锁、线程泄漏、CPU 100% |
| **VisualVM** | JDK 自带 | 可视化监控 CPU / 堆 / 线程；可打开 `.hprof` 分析 |
| **MAT** | Eclipse 插件 | 专业堆快照分析；自动检测泄漏，生成 Leak Suspects 报告 |
| **Arthas** | 阿里开源 | 无需重启，attach 到运行中进程；实时 watch 方法入参/返回值 |

**常用命令速查：**

```bash
jps -l
jmap -dump:format=b,file=heap.hprof <pid>
jmap -histo <pid>              # 查看各类对象实例数和占用大小（不生成文件）
jstat -gcutil <pid> 1000 20    # 每秒输出，共 20 次
jstack <pid>
jstack <pid> | grep -A 30 "BLOCKED"   # 过滤阻塞线程

# Arthas 在线诊断
curl -O https://arthas.aliyun.com/arthas-boot.jar
java -jar arthas-boot.jar <pid>
# dashboard               查看线程/内存/GC 实时概览
# thread -n 3             查看 CPU 占用最高的 3 个线程
# watch com.example.Service method '{params, returnObj}' -x 2
# jvm                     查看 JVM 配置和内存使用
```

> **CPU 100% 排查套路**：`top -H -p <pid>` 找到 CPU 最高的线程 ID → 转十六进制 → `jstack <pid>` 中搜索对应 `nid`，查看该线程调用栈。

***

## 七、JVM 常用调优参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `-Xms` | 堆初始大小 | `-Xms512m` |
| `-Xmx` | 堆最大大小（建议与 -Xms 相同，避免动态扩缩堆） | `-Xmx2g` |
| `-Xmn` | 新生代大小（也可用 `-XX:NewRatio` 指定比例） | `-Xmn512m` |
| `-XX:MetaspaceSize` | 元空间初始触发 GC 的阈值 | `-XX:MetaspaceSize=256m` |
| `-XX:MaxMetaspaceSize` | 元空间上限（默认无限，建议显式设置防止耗尽系统内存） | `-XX:MaxMetaspaceSize=512m` |
| `-XX:NewRatio` | 老年代与新生代的比例（默认 2，即老年代 2/3） | `-XX:NewRatio=2` |
| `-XX:SurvivorRatio` | Eden 与单个 Survivor 的比例（默认 8，即 Eden 占 8/10） | `-XX:SurvivorRatio=8` |
| `-XX:MaxGCPauseMillis` | G1 目标停顿时间（ms），JVM 据此调整回收范围 | `-XX:MaxGCPauseMillis=200` |
| `-XX:+UseG1GC` | 启用 G1 收集器 | — |
| `-XX:+UseZGC` | 启用 ZGC | — |
| `-XX:+HeapDumpOnOutOfMemoryError` | OOM 时自动 dump 堆快照 | — |
| `-XX:HeapDumpPath` | dump 文件路径 | `-XX:HeapDumpPath=/dumps/heap.hprof` |
| `-Xlog:gc*` | 输出 GC 日志（JDK 9+ 统一日志格式） | `-Xlog:gc*:file=gc.log` |

**常见生产配置示例（Spring Boot + G1）：**

```bash
java -Xms1g -Xmx1g \
     -XX:+UseG1GC \
     -XX:MaxGCPauseMillis=200 \
     -XX:MetaspaceSize=256m -XX:MaxMetaspaceSize=512m \
     -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/dumps/heap.hprof \
     -Xlog:gc*:file=/logs/gc.log:time,uptime:filecount=5,filesize=20m \
     -jar app.jar
```
