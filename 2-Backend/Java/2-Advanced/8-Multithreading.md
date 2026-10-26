## I. Processes and Threads

### 1. Basic Concepts

| Concept | Description | Analogy |
| --------------- | ------------------------ | ------ |
| **Process** | A program running in the operating system | A factory |
| **Thread** | An execution unit within a process; the smallest unit of CPU scheduling | A factory worker |

**Relationship**:

*   A process can contain multiple threads.
*   A process has at least one thread (the main thread).
*   Threads share the process's resources (memory, files, etc.).

### 2. Diagram

    ┌─────────────────────────────────────────────────────────────┐
    │                        Operating system                          │
    │  ┌─────────────────────┐    ┌─────────────────────┐         │
    │  │   Process 1 (QQ)     │    │   Process 2 (WeChat)  │         │
    │  │  ┌─────┐ ┌─────┐   │    │  ┌─────┐ ┌─────┐   │         │
    │  │  │ T1  │ │ T2  │   │    │  │ T1  │ │ T2  │   │         │
    │  │  └─────┘ └─────┘   │    │  └─────┘ └─────┘   │         │
    │  │  ┌─────┐           │    │  ┌─────┐           │         │
    │  │  │ T3  │           │    │  │ T3  │           │         │
    │  │  └─────┘           │    │  └─────┘           │         │
    │  └─────────────────────┘    └─────────────────────┘         │
    └─────────────────────────────────────────────────────────────┘

### 3. Concurrency and Parallelism

| Concept | Description | Illustration |
| ------------------ | ------------------ | ---------------- |
| **Concurrency** | Tasks execute alternately (rapid CPU switching) | One person handling multiple tasks (apparently simultaneous) |
| **Parallelism** | Tasks actually execute simultaneously (multicore CPU) | Multiple people handling tasks simultaneously |

    Concurrency (single-core CPU):
    Time →
    CPU:  [Task A][Task B][Task A][Task B][Task A]...
          Alternating execution appears simultaneous

    Parallelism (multicore CPU):
    Time →
    CPU1: [Task A][Task A][Task A]...
    CPU2: [Task B][Task B][Task B]...
          Actual simultaneous execution

***

## II. Ways to Start Threads in Java

### 1. Approach 1: Extend Thread

```java
// 1. Define a class extending Thread
public class MyThread extends Thread {

    // 2. Override run()
    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            System.out.println(getName() + "：" + i);
        }
    }
}

// 3. Create an object and call start() to start the thread
public class Demo {
    public static void main(String[] args) {
        MyThread t1 = new MyThread();
        MyThread t2 = new MyThread();

        t1.setName("Thread 1");
        t2.setName("Thread 2");

        t1.start();  // ✅ Starts a thread
        t2.start();

        // t1.run();  // ❌ Incorrect! Calling run() directly does not start a new thread
    }
}
```

**Notes**:

*   Call `start()` to start a thread, not `run()`.
*   The code inside `run()` is the task executed by the thread.

***

### 2. Approach 2: Implement Runnable (Recommended)

```java
// 1. Define a class implementing Runnable
public class MyRunnable implements Runnable {

    // 2. Override run()
    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            // Runnable has no getName(); use Thread.currentThread()
            System.out.println(Thread.currentThread().getName() + "：" + i);
        }
    }
}

// 3. Create a Runnable object and pass it to Thread
public class Demo {
    public static void main(String[] args) {
        MyRunnable mr = new MyRunnable();

        Thread t1 = new Thread(mr, "Thread 1");
        Thread t2 = new Thread(mr, "Thread 2");

        t1.start();
        t2.start();
    }
}
```

**Lambda Shorthand**:

```java
// Anonymous inner class
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Thread executing");
    }
}).start();

// Lambda expression (recommended)
new Thread(() -> {
    System.out.println("Thread executing");
}).start();
```

***

### 3. Approach 3: Implement Callable (Supports a Return Value)

```java
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

// 1. Define a class implementing Callable and specify its return type
public class MyCallable implements Callable<Integer> {

    // 2. Override call(), which can return a value
    @Override
    public Integer call() throws Exception {
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            sum += i;
        }
        return sum;
    }
}

// 3. Wrap in FutureTask to retrieve the result
public class Demo {
    public static void main(String[] args) throws Exception {
        MyCallable mc = new MyCallable();
        FutureTask<Integer> ft = new FutureTask<>(mc);

        Thread t = new Thread(ft);
        t.start();

        // Get the return value (blocks until thread execution completes)
        Integer result = ft.get();
        System.out.println("Result: " + result);  // Result: 5050
    }
}
```

***

### 4. Comparing the Three Approaches

| Approach | Advantages | Disadvantages |
| --------------- | --------------------------- | ---------- |
| **Extend Thread** | Simple; can call `this.getName()` directly | Single-inheritance restriction; less extensible |
| **Implement Runnable** | Extensible; can extend another class; suits resource sharing across threads | No return value |
| **Implement Callable** | Can return a value and throw exceptions | Slightly more complex |

**Recommendation**: Prefer **Runnable** (no return value) or **Callable** (with a return value).

***

## III. Common Thread Methods and Lifecycle

### 1. Method Overview

| Method | Description |
| -------------------------------- | -------------------- |
| `void start()` | Starts the thread |
| `void run()` | Task executed by the thread |
| `String getName()` | Gets the thread name |
| `void setName(String name)` | Sets the thread name |
| `static Thread currentThread()` | Gets the current Thread object |
| `static void sleep(long millis)` | Pauses the current thread for the specified milliseconds |
| `void join()` | Waits for this thread to finish |
| `void join(long millis)` | Waits for this thread, up to the specified milliseconds |
| `void setDaemon(boolean on)` | Sets daemon status |
| `int getPriority()` | Gets thread priority |
| `void setPriority(int priority)` | Sets priority (1–10) |
| `static void yield()` | Yields CPU execution |
| `void interrupt()` | Interrupts the thread |
| `boolean isInterrupted()` | Tests whether the thread was interrupted |
| `static boolean interrupted()` | Tests and clears the current thread's interrupt status |

***

### 2. Methods in Detail

#### sleep(): Pause a Thread

```java
public class Demo {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("Start");

        Thread.sleep(3000);  // Sleep for 3 seconds

        System.out.println("End");
    }
}
```

***

#### join(): Wait for a Thread to Finish

```java
public class Demo {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("Child thread: " + i);
            }
        });

        t.start();
        t.join();  // Main thread waits for t to finish

        System.out.println("Main thread continues");
    }
}

// Output:
// Child thread: 0
// Child thread: 1
// Child thread: 2
// Child thread: 3
// Child thread: 4
// Main thread continues
```

***

#### setDaemon(): Daemon Threads

```java
public class Demo {
    public static void main(String[] args) {
        Thread t = new Thread(() -> {
            while (true) {
                System.out.println("Daemon thread running...");
            }
        });

        t.setDaemon(true);  // Set daemon status (must precede start)
        t.start();

        // The daemon thread also ends after the main thread finishes
        System.out.println("Main thread finished");
    }
}
```

**Daemon Thread Characteristics**:

*   When all non-daemon threads finish, daemon threads end automatically.
*   Typical example: garbage collection threads.

***

#### setPriority(): Thread Priority

```java
public class Demo {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                System.out.println("t1：" + i);
            }
        });

        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 100; i++) {
                System.out.println("t2：" + i);
            }
        });

        // Priority range: 1–10; default is 5
        t1.setPriority(Thread.MIN_PRIORITY);  // 1
        t2.setPriority(Thread.MAX_PRIORITY);  // 10

        t1.start();
        t2.start();
    }
}
```

**Note**: A higher priority only means a **greater chance of obtaining CPU time**; it does not guarantee earlier execution.

***

#### interrupt(): Thread Interruption

```java
public class Demo {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                System.out.println("Thread running...");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    // Interrupting sleep throws an exception and clears the interrupt status
                    System.out.println("Thread interrupted; exiting loop");
                    break;  // Alternatively, restore the interrupt status: Thread.currentThread().interrupt();
                }
            }
            System.out.println("Thread finished");
        });

        t.start();

        Thread.sleep(3000);  // Main thread waits 3 seconds
        t.interrupt();       // Interrupt the thread
        System.out.println("Sending interrupt signal");
    }
}
```

**Interruption Mechanism**:

| Method | Description |
| ---------------------- | -------------------- |
| `interrupt()` | Sets interrupt status (does not forcibly stop the thread) |
| `isInterrupted()` | Tests interrupt status without clearing it |
| `Thread.interrupted()` | Tests and clears the current thread's interrupt status |

> 💡 **Note**: `interrupt()` only sets interrupt status; the thread must check and respond to it. If blocked in `sleep()`, `wait()`, `join()`, etc., the thread throws `InterruptedException` and its interrupt status is cleared.
>
> In practice, there are two common responses after catching `InterruptedException`:
>
> 1. The current method decides to end the task: log, then `break` / `return`.
> 2. Preserve the interruption semantics: restore the status with `Thread.currentThread().interrupt()` so higher layers can detect it.

***

### 3. Thread Lifecycle (Six States)

Java threads have **six states**, defined in the `Thread.State` enum:

                                         ┌──────────────────┐
                                         │     BLOCKED      │
                                         │ (blocked: waiting for a lock) │
                                         └────────┬─────────┘
                                                  ↑ Waiting for a lock
                                                  │
    ┌─────────┐     ┌───────────────┐     ┌───────┴───────┐     ┌─────────────┐
    │   NEW   │────→│   RUNNABLE    │←───→│ Lock acquired │────→│ TERMINATED  │
    │ Created │     │ Ready/running │     │               │     │  Finished   │
    └─────────┘     └───────┬───────┘     └───────────────┘     └─────────────┘
      new Thread()          │ wait()/join()/sleep()
           ↓ start()        ↓
                      ┌─────────────────┐
                      │    WAITING      │  Indefinite wait
                      │  (no timeout)   │  wait(), join()
                      └─────────────────┘
                      ┌─────────────────┐
                      │  TIMED_WAITING  │  Bounded wait
                      │  (with timeout) │  sleep(n), wait(n), join(n)
                      └─────────────────┘

| State | Description | Trigger |
| ------------------ | ------------ | -------------------------------------- |
| **NEW** | Newly created | After `new Thread()`, before `start()` |
| **RUNNABLE** | Runnable (ready or running) | After `start()` |
| **BLOCKED** | Blocked | Waiting to acquire a synchronized lock |
| **WAITING** | Waiting indefinitely | `wait()`, `join()`, `LockSupport.park()` |
| **TIMED\_WAITING** | Waiting with a timeout | `sleep(n)`, `wait(n)`, `join(n)` |
| **TERMINATED** | Finished | Normal completion or termination due to an exception |

```java
// Get thread state
Thread t = new Thread(() -> {});
System.out.println(t.getState());  // NEW

t.start();
System.out.println(t.getState());  // RUNNABLE

// ... Thread finishes
System.out.println(t.getState());  // TERMINATED
```

> 💡 **Note**: Java's thread-state enum has no separate **RUNNING** state. Both running and ready threads are classified as `RUNNABLE`.

***

## IV. Thread Safety and Synchronization

### 1. Thread-Safety Problems

When multiple threads **access shared resources simultaneously**, inconsistent data may result.

#### Demonstration: Ticket Sales

```java
public class Ticket implements Runnable {
    private int ticket = 100;  // Shared resource

    @Override
    public void run() {
        while (true) {
            if (ticket > 0) {
                try {
                    Thread.sleep(10);  // Simulate ticket-issuing time
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName()
                    + " sold ticket " + ticket + "");
                ticket--;
            } else {
                break;
            }
        }
    }
}

// Test
public class Demo {
    public static void main(String[] args) {
        Ticket t = new Ticket();

        new Thread(t, "Window 1").start();
        new Thread(t, "Window 2").start();
        new Thread(t, "Window 3").start();
    }
}

// Possible problems:
// Window 1 sold ticket 100
// Window 2 sold ticket 100  ← duplicate sale
// Window 3 sold ticket -1   ← negative ticket number
```

***

### 2. Solution 1: synchronized Blocks

```java
public class Ticket implements Runnable {
    private int ticket = 100;
    private Object lock = new Object();  // Lock object

    @Override
    public void run() {
        while (true) {
            // synchronized (lockObject) { codeRequiringSynchronization }
            synchronized (lock) {
                if (ticket > 0) {
                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println(Thread.currentThread().getName()
                        + " sold ticket " + ticket + "");
                    ticket--;
                } else {
                    break;
                }
            }
        }
    }
}
```

**Choosing a Lock Object**:

*   Any object can be used, but all threads must use **the same object**.
*   Common choices are `this` (the current object) and `ClassName.class` (the class's Class object).

```java
// Use this as the lock
synchronized (this) {
    // ...
}

// Use the class's Class object as the lock (common in static methods)
synchronized (Ticket.class) {
    // ...
}
```

***

### 3. Solution 2: synchronized Methods

```java
public class Ticket implements Runnable {
    private int ticket = 100;

    @Override
    public void run() {
        while (true) {
            if (!sellTicket()) {
                break;
            }
        }
    }

    // Synchronized method: the lock is this
    public synchronized boolean sellTicket() {
        if (ticket > 0) {
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName()
                + " sold ticket " + ticket + "");
            ticket--;
            return true;
        }
        return false;
    }
}
```

**Locks for Synchronized Methods**:

*   Instance synchronized method: locks `this`.
*   Static synchronized method: locks `ClassName.class`.

***

### 4. Solution 3: Lock

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Ticket implements Runnable {
    private int ticket = 100;
    private Lock lock = new ReentrantLock();  // Create the lock

    @Override
    public void run() {
        while (true) {
            lock.lock();  // Acquire the lock
            try {
                if (ticket > 0) {
                    Thread.sleep(10);
                    System.out.println(Thread.currentThread().getName()
                        + " sold ticket " + ticket + "");
                    ticket--;
                } else {
                    break;
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();  // Release the lock (must be in finally)
            }
        }
    }
}
```

***

### 5. synchronized vs Lock

| Comparison | synchronized | Lock |
| ---------- | ----------------- | ---------------------- |
| **Type** | Keyword | Interface |
| **Acquire/release** | Automatic | Manual (lock/unlock) |
| **Flexibility** | Lower | Higher |
| **Interruptible acquisition** | No | Yes (lockInterruptibly) |
| **Fair locking** | Nonfair | Can be configured as fair |
| **Condition variables** | One (wait/notify) | Multiple Conditions possible |
| **Performance** | Optimized since JDK 1.6; little difference | Little difference |

***

### 6. Deadlocks

**Deadlock**: two or more threads each hold locks needed by the others, preventing all of them from continuing.

```java
public class DeadLockDemo {
    private static Object lockA = new Object();
    private static Object lockB = new Object();

    public static void main(String[] args) {
        // Thread 1: acquire lockA, then lockB
        new Thread(() -> {
            synchronized (lockA) {
                System.out.println("Thread 1 acquired lockA");
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {}

                synchronized (lockB) {
                    System.out.println("Thread 1 acquired lockB");
                }
            }
        }).start();

        // Thread 2: acquire lockB, then lockA
        new Thread(() -> {
            synchronized (lockB) {
                System.out.println("Thread 2 acquired lockB");
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {}

                synchronized (lockA) {
                    System.out.println("Thread 2 acquired lockA");
                }
            }
        }).start();
    }
}

// Output:
// Thread 1 acquired lockA
// Thread 2 acquired lockB
// (Program hangs: deadlock)
```

**Four Conditions for Deadlock**:

1.  **Mutual exclusion**: a resource can be held by only one thread.
2.  **Hold and wait**: hold resources while waiting for others.
3.  **No preemption**: only the holder can voluntarily release a resource.
4.  **Circular wait**: threads form a cycle of dependencies.

**Avoiding Deadlocks**:

*   Acquire locks in the same order.
*   Use `tryLock()` with a timeout.
*   Use `Lock.lockInterruptibly()` to respond to interruption.

***

### 7. The volatile Keyword

**Purpose**: ensures variable **visibility** and prevents **instruction reordering**.

#### Visibility Problem

```java
public class VolatileDemo {
    private static boolean flag = true;  // Without volatile

    public static void main(String[] args) throws InterruptedException {
        new Thread(() -> {
            while (flag) {
                // Empty loop
            }
            System.out.println("Thread finished");
        }).start();

        Thread.sleep(1000);
        flag = false;  // Main thread changes flag
        System.out.println("flag set to false");

        // Problem: the child thread may never finish!
        // Reason: the child thread reads its working-memory copy of flag
    }
}
```

#### Solving with volatile

```java
private static volatile boolean flag = true;  // Add volatile
// After modification, the child thread can see the change to flag immediately
```

**volatile vs synchronized**：

| Comparison | volatile | synchronized |
| -------- | -------- | ------------ |
| **Visibility** | ✅ Guaranteed | ✅ Guaranteed |
| **Atomicity** | ❌ Not guaranteed | ✅ Guaranteed |
| **Performance** | Higher | Lower |
| **Use case** | One writer, multiple readers | Multiple writers and readers |

> ⚠️ **Note**: `volatile` does not guarantee atomicity! Operations such as `count++` still require synchronization.

***

### 8. Four Approaches to Thread Safety

Objects in heap memory that are shared across threads face thread-safety issues. Solutions fall into four categories:

| Approach | Examples | Principle | Use cases |
| --- | --- | --- | --- |
| **Locking** | `synchronized`, `ReentrantLock` | Serializes access; only one thread operates at a time | General-purpose; mutable shared objects |
| **Thread-safe containers** | `ConcurrentHashMap`, `CopyOnWriteArrayList` | Built-in locks/CAS remove the need for manual synchronization | Concurrent collection operations |
| **Immutable objects** | `String`, `Integer`, records containing only immutable components | Unchangeable state allows contention-free reads; a final reference alone does not make an object immutable | Read-only data, configuration |
| **ThreadLocal** | `ThreadLocal<T>` | Each thread has an independent copy | Per-thread state (database connections, user contexts) |

#### Approach 1: Locking

See the `synchronized` and `Lock` sections in this chapter.

#### Approach 2: Thread-Safe Containers

```java
// ConcurrentHashMap: thread-safe HashMap with bucket-level locking; much more efficient than Hashtable under high concurrency
Map<String, Integer> map = new ConcurrentHashMap<>();

// CopyOnWriteArrayList: copies the backing array on every write
// Suitable for frequent reads and infrequent writes (writes are expensive)
List<String> list = new CopyOnWriteArrayList<>();

// Collections.synchronizedXxx: wraps existing collections; synchronizes all methods
// Iteration still needs explicit synchronization; less efficient than ConcurrentHashMap
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
```

**Selection Guide**:

| Scenario | Recommendation |
| --- | --- |
| Concurrent Map reads and writes | `ConcurrentHashMap` |
| List with frequent reads and infrequent writes | `CopyOnWriteArrayList` |
| Simple case without using the concurrency package | `Collections.synchronizedList` |

#### Approach 3: Immutable Objects

An object's state cannot change after creation, so concurrent reads do not contend.

```java
// String is immutable; each "modification" creates a new object
String s = "hello";
s = s + " world";  // The original object is unchanged; s points to a new object

// final fixes a field's value or reference; String and int in this example are themselves immutable
public final class Config {
    private final String host;
    private final int port;

    public Config(String host, int port) {
        this.host = host;
        this.port = port;
    }
    // No setters; external code cannot modify it
}

// JDK 16+ records: automatically generate final fields and accessors
record Point(int x, int y) {}  // This example contains only ints and can be safely shared
```

> A record only guarantees final component fields, so it is shallowly immutable. Mutable collections, arrays or objects used as components can still change internally. Defensive copying and accessor design are needed; records cannot universally be considered thread-safe.

#### Approach 4: ThreadLocal

Each thread maintains its own copy of a variable, isolating data between threads.

```java
// Typical use: each thread has its own SimpleDateFormat
ThreadLocal<SimpleDateFormat> formatter = ThreadLocal.withInitial(
    () -> new SimpleDateFormat("yyyy-MM-dd")
);

// Threads A and B receive separate copies without interfering
public String format(Date date) {
    return formatter.get().format(date);  // .get() retrieves the current thread's copy
}

// Always remove after use; pooled-thread reuse can otherwise cause memory leaks
formatter.remove();
```

**How ThreadLocal Works**:

    Each Thread object contains a ThreadLocalMap
    ThreadLocal.set(value) → stores key=this, value=value in the current thread's map
    ThreadLocal.get()      → retrieves the value for key=this from the current thread's map

    Thread A → its own ThreadLocalMap → { formatter: SDF instance A }
    Thread B → its own ThreadLocalMap → { formatter: SDF instance B }

> ⚠️ **Memory-leak risk**: pooled threads are not destroyed after each task. ThreadLocalMap entries strongly reference their values. Without `remove()`, values may remain ineligible for GC and accumulate into a memory leak.

***

## V. Thread Communication

### 1. wait/notify

| Method | Description |
| -------------------- | ------------ |
| `wait()` | Makes the current thread wait and releases the lock |
| `wait(long timeout)` | Waits for the specified milliseconds before waking automatically |
| `notify()` | Wakes one waiting thread |
| `notifyAll()` | Wakes all waiting threads |

**Note**: These methods must be called inside a **synchronized** block on the **lock object**.

***

### 2. Producer-Consumer Pattern

```java
public class ProducerConsumerDemo {
    public static void main(String[] args) {
        DataBox box = new DataBox();

        // Producer
        new Thread(() -> {
            for (int i = 1; i <= 5; i++) {
                box.put(i);
            }
        }, "Producer").start();

        // Consumer
        new Thread(() -> {
            for (int i = 1; i <= 5; i++) {
                box.take();
            }
        }, "Consumer").start();
    }
}

class DataBox {
    private int data;
    private boolean hasData = false;  // Whether data is available

    // Produce data
    public synchronized void put(int data) {
        // Wait if data is available
        while (hasData) {
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        this.data = data;
        hasData = true;
        System.out.println(Thread.currentThread().getName() + " produced: " + data);

        notifyAll();  // Wake waiting threads; safer with multiple producers/consumers
    }

    // Consume data
    public synchronized void take() {
        // Wait if no data is available
        while (!hasData) {
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        System.out.println(Thread.currentThread().getName() + " consumed: " + data);
        hasData = false;

        notifyAll();  // Wake waiting threads to avoid waking the wrong kind and leaving no thread able to proceed
    }
}
```

**Output**:

    Producer produced: 1
    Consumer consumed: 1
    Producer produced: 2
    Consumer consumed: 2
    ...

> 💡 **Why `while` Instead of `if`?**
> To handle spurious wakeups: a thread may wake without a `notify` call, so it must recheck the condition.

> 💡 **Additional Note**: `notify()` often works with exactly one producer and one consumer. With multiple producers or consumers, `notifyAll()` is safer; otherwise a thread of the same kind may wake, causing all threads to wait again.

***

## VI. Thread Pools

### 1. Why Thread Pools Are Needed

**Problem**: repeatedly creating and destroying threads is expensive and inefficient.

**Solution**: create a set of threads in advance, keep them in a pool, use them as needed and return them afterward.

    ┌────────────────────────────────────────────────────┐
    │                      Thread pool                    │
    │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐           │
    │  │ T1   │  │ T2   │  │ T3   │  │ T4   │ ...       │
    │  └──────┘  └──────┘  └──────┘  └──────┘           │
    │                                                    │
    │              Task queue: [Task A] [Task B] [Task C] │
    └────────────────────────────────────────────────────┘

    Workflow:
    1. Submit tasks to the task queue
    2. Pool threads take tasks from the queue and execute them
    3. After execution, threads return to the pool and wait for the next task

### 2. Benefits of Thread Pools

| Benefit | Description |
| ---------- | ---------------- |
| **Lower resource use** | Reuses threads, reducing creation/destruction overhead |
| **Faster response** | Tasks need not wait for thread creation |
| **Easier management** | Centralized management and control of maximum concurrency |

***

### 3. Creating Pools with Executors (Simple Approach)

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Demo {
    public static void main(String[] args) {
        // 1. Create a fixed-size thread pool
        ExecutorService pool = Executors.newFixedThreadPool(3);

        // 2. Submit tasks
        pool.submit(() -> {
            System.out.println(Thread.currentThread().getName() + " executing task 1");
        });

        pool.submit(() -> {
            System.out.println(Thread.currentThread().getName() + " executing task 2");
        });

        pool.submit(() -> {
            System.out.println(Thread.currentThread().getName() + " executing task 3");
        });

        // 3. Shut down the pool
        pool.shutdown();
    }
}
```

***

### 4. Four Pool Types Provided by Executors

| Method | Description | Characteristics |
| --------------------------- | ------- | ------------ |
| `newFixedThreadPool(n)` | Fixed-size pool | Fixed n threads |
| `newCachedThreadPool()` | Cached pool | Variable thread count; creates threads as needed |
| `newSingleThreadExecutor()` | Single-thread pool | Only one thread |
| `newScheduledThreadPool(n)` | Scheduled-task pool | Supports scheduled tasks |

```java
// Fixed-size pool
ExecutorService pool1 = Executors.newFixedThreadPool(5);

// Cached pool (variable thread count)
ExecutorService pool2 = Executors.newCachedThreadPool();

// Single-thread pool
ExecutorService pool3 = Executors.newSingleThreadExecutor();

// Scheduled-task pool
ScheduledExecutorService pool4 = Executors.newScheduledThreadPool(3);
pool4.schedule(() -> {
    System.out.println("Execute after 3 seconds");
}, 3, TimeUnit.SECONDS);
```

***

### 5. submit() vs execute()

| Method | Return value | Exception handling | Argument type |
| --------------------------- | ------ | ------------ | ------------------- |
| `execute(Runnable)` | None | Thrown directly | Runnable only |
| `submit(Runnable/Callable)` | Future | Captured in the Future | Runnable or Callable |

```java
// execute: no return value
pool.execute(() -> {
    System.out.println("execute running");
});

// submit: returns a result
Future<String> future = pool.submit(() -> {
    return "submit result";
});
String result = future.get();  // Retrieve the return value
```

**Conclusion**:

*   Use `execute()` when only execution matters, not the result.
*   Use `submit()` when you need the task result, exception or completion status.

### 6. Retrieving Results from Pool Tasks

For both `ExecutorService` and `ThreadPoolExecutor`, **the core process is: submit a `Callable`, receive a `Future`, then call `get()` to retrieve the result**.

```java
import java.util.concurrent.*;

public class Demo {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);

        Future<Integer> future = pool.submit(() -> {
            int sum = 0;
            for (int i = 1; i <= 100; i++) {
                sum += i;
            }
            return sum;
        });

        Integer result = future.get();  // Block until the result is available
        System.out.println("Result: " + result);

        pool.shutdown();
    }
}
```

| Method/type | Description |
| --- | --- |
| `submit(Callable<T>)` | Submits a task that returns a value |
| `Future<T>` | Represents an asynchronous computation result |
| `future.get()` | Retrieves the result; blocks if incomplete |
| `future.get(timeout, unit)` | Waits at most the specified duration, avoiding indefinite blocking |

***

### 7. shutdown() vs shutdownNow()

| Method | Description |
| --------------------------------- | --------------------------- |
| `shutdown()` | Orderly shutdown: rejects new tasks and lets submitted tasks finish |
| `shutdownNow()` | Immediate shutdown: attempts to interrupt running tasks and returns tasks not yet executed |
| `isShutdown()` | Tests whether shutdown has been initiated |
| `isTerminated()` | Tests whether all tasks have completed |
| `awaitTermination(timeout, unit)` | Waits for termination; returns false on timeout |

```java
pool.shutdown();  // Orderly shutdown

// Wait up to 60 seconds for full termination
if (pool.awaitTermination(60, TimeUnit.SECONDS)) {
    System.out.println("Thread pool fully terminated");
} else {
    System.out.println("Timed out; forcing shutdown");
    pool.shutdownNow();
}
```

***

### 8. Custom JDK Thread Pools (Recommended)

#### Why Customize a Thread Pool?

Pools created by `Executors` carry risks:

*   `newFixedThreadPool` and `newSingleThreadExecutor`: effectively unbounded task queues may cause OOM.
*   `newCachedThreadPool`: unbounded thread creation may cause OOM.

**Alibaba Development Guidelines**: **Do not create thread pools with Executors; prefer ThreadPoolExecutor.**

***

#### Seven ThreadPoolExecutor Parameters

```java
public ThreadPoolExecutor(
    int corePoolSize,           // Core thread count
    int maximumPoolSize,        // Maximum thread count
    long keepAliveTime,         // Idle-thread keep-alive time
    TimeUnit unit,              // Time unit
    BlockingQueue<Runnable> workQueue,  // Task queue
    ThreadFactory threadFactory,        // Thread factory
    RejectedExecutionHandler handler    // Rejection policy
)
```

| Parameter | Description |
| ------------------- | -------------------- |
| **corePoolSize** | Core thread count (threads kept alive) |
| **maximumPoolSize** | Maximum threads (core + temporary) |
| **keepAliveTime** | How long idle temporary threads remain alive |
| **unit** | Keep-alive time unit (seconds, milliseconds, etc.) |
| **workQueue** | Holds tasks waiting to execute |
| **threadFactory** | Creates threads |
| **handler** | Handles new tasks when both queue and thread limit are full |

***

#### Workflow Diagram

    Submit task
        │
        ↓
    ┌─────────────────────────────────────────────────────────────────┐
    │                        Thread pool                              │
    │                                                                  │
    │  ┌─────────────────────┐    ┌─────────────────────┐             │
    │  │    Core threads     │    │    Task queue         │             │
    │  │  ┌────┐ ┌────┐     │    │  [Task] [Task] ...   │             │
    │  │  │ T  │ │ T  │ ... │    │                      │             │
    │  │  └────┘ └────┘     │    └─────────────────────┘             │
    │  │  (corePoolSize)    │              │                          │
    │  └─────────────────────┘              │                          │
    │                                       ↓                          │
    │  ┌─────────────────────┐        Queue full?                     │
    │  │ Temporary threads  │        ┌──────┐                        │
    │  │  ┌────┐ ┌────┐     │←───────│Create│ temporary threads       │
    │  │  │ T  │ │ T  │ ... │        └──────┘                        │
    │  │  └────┘ └────┘     │                                         │
    │  │  (max - core)      │              │                          │
    │  └─────────────────────┘              ↓                          │
    │                                  Thread limit also reached?     │
    │                                  Apply rejection policy         │
    └─────────────────────────────────────────────────────────────────┘

**Task Processing Flow**:

1.  Submit a task; prefer executing it with a core thread.
2.  Core threads busy → enqueue the task.
3.  Queue full → create a temporary thread.
4.  Maximum thread count reached and queue full → apply the rejection policy.

***

#### Custom Thread Pool Example

```java
import java.util.concurrent.*;

public class Demo {
    public static void main(String[] args) {
        // Create a custom pool
        ThreadPoolExecutor pool = new ThreadPoolExecutor(
            2,                                  // Core thread count
            5,                                  // Maximum thread count
            60,                                 // Idle-thread keep-alive time
            TimeUnit.SECONDS,                   // Time unit
            new ArrayBlockingQueue<>(10),       // Task queue (capacity 10)
            Executors.defaultThreadFactory(),   // Default thread factory
            new ThreadPoolExecutor.AbortPolicy()// Rejection policy
        );

        try {
            // submit(Callable) returns a Future result
            Future<Integer> future = pool.submit(() -> {
                int sum = 0;
                for (int i = 1; i <= 100; i++) {
                    sum += i;
                }
                return sum;
            });

            Integer result = future.get();
            System.out.println("Computed result: " + result);  // 5050
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } catch (ExecutionException e) {
            e.printStackTrace();
        } finally {
            // Shut down the pool
            pool.shutdown();
        }
    }
}
```

**Explanation**:

*   `ThreadPoolExecutor` implements `ExecutorService`, so results are also retrieved through `submit()` + `Future.get()`.
*   `execute()` alone provides asynchronous execution without directly returning a result.

***

#### Four Rejection Policies

| Rejection policy | Description |
| --------------------- | ----------------------------------------- |
| `AbortPolicy` | **Default**; throws RejectedExecutionException |
| `CallerRunsPolicy` | The submitting thread runs the task |
| `DiscardPolicy` | Silently discards the task |
| `DiscardOldestPolicy` | Discards the oldest queued task, then retries submission |

```java
// Default: throw an exception
new ThreadPoolExecutor.AbortPolicy()

// Run in the caller's thread
new ThreadPoolExecutor.CallerRunsPolicy()

// Discard directly
new ThreadPoolExecutor.DiscardPolicy()

// Discard the oldest task
new ThreadPoolExecutor.DiscardOldestPolicy()
```

***

#### Common Task Queues

| Queue | Description |
| ----------------------- | -------------------------------- |
| `ArrayBlockingQueue` | Bounded, array-backed; capacity must be specified |
| `LinkedBlockingQueue` | Effectively unbounded by default (Integer.MAX\_VALUE), linked-node implementation |
| `SynchronousQueue` | Stores no tasks; hands them directly to threads |
| `PriorityBlockingQueue` | Priority queue; executes by priority |

```java
// Bounded queue (recommended)
new ArrayBlockingQueue<>(100)

// Unbounded queue (use cautiously; may cause OOM)
new LinkedBlockingQueue<>()

// Synchronous queue (direct handoff to a thread)
new SynchronousQueue<>()
```

***

#### Choosing Thread Pool Size

Choose thread count according to **task type** (CPU-bound / I/O-bound), avoiding excessive context switching with too many threads or idle CPU/I/O capacity with too few.

| Task type | Bottleneck | Estimated thread count | Reason |
| ---------------- | ---------- | ------------------------------ | -------- |
| **CPU-bound** | CPU computation | N cores, or N+1 | Exceeding core count increases context switching; N+1 may hide some memory latency |
| **I/O-bound** | Disk/network | N × (1 + I/O/CPU), or start with 2N–4N | Threads waiting for I/O do not occupy the CPU; multiple threads overlap waiting and computation |

**CPU-bound**: tasks spend most of their time computing, with little I/O waiting. Approximately one thread per core is sufficient; one extra (N+1) can sometimes use a core while another thread waits for memory.

**I/O-bound**: tasks frequently wait for disk, network, databases, etc. If one task has CPU computation time C and I/O wait time W, **thread count ≈ N × (1 + W/C) = N × (1 + I/O/CPU)**. More I/O waiting permits more overlap, so the count can exceed N. If W/C is hard to estimate, start with **2N–4N**, then tune using load tests and monitoring.

> 💡 **Understanding Bottlenecks**: CPU-bound workloads stress the CPU while the disk is relatively idle; I/O-bound workloads stress disk or network. Once disk/network capacity is saturated, more threads only queue for I/O while the CPU stays idle. Optimize I/O or increase disk/network capacity instead of continuing to add threads.

```java
// Get the CPU core count
int cpuCores = Runtime.getRuntime().availableProcessors();

// CPU-bound: N or N+1
int cpuIntensiveThreads = cpuCores + 1;

// I/O-bound: 2N–4N, or estimate with N×(1+I/O/CPU)
int ioIntensiveThreads = cpuCores * 2;  // Conservative starting point; can be increased
```

***

### 9. Thread Pools in Spring Projects

#### 1. What Is `ThreadPoolTaskExecutor`?

**`ThreadPoolTaskExecutor`** is Spring Framework's thread-pool wrapper, designed for easier integration with the Spring container, bean management and asynchronous execution.

| Comparison | Native JDK thread pool | Spring thread-pool wrapper |
| --- | --- | --- |
| **Typical types** | `ExecutorService`, `ThreadPoolExecutor` | `ThreadPoolTaskExecutor` |
| **Source** | JDK concurrency package | Spring Framework |
| **Depends on Spring** | ❌ No | ✅ Yes |
| **Use cases** | Plain Java projects, low-level concurrency control | Spring / Spring Boot projects |

> 💡 **Note**: `ThreadPoolTaskExecutor` is a public Spring API, but being a Spring class does not automatically make it a bean. Developers normally declare it explicitly, then Spring registers it in the container.

***

#### 2. Defining, Registering and Using a Bean

Three actions are easily confused when adding a thread pool to the Spring container:

| Action | Meaning | Performed by |
| --- | --- | --- |
| **Define a bean** | Declare that the container should contain this object | Developer |
| **Register a bean** | Actually add the object to the container | Spring |
| **Use a bean** | Obtain the object from the container and use it in business logic | Developer + Spring dependency injection |

The most common approach explicitly declares the thread pool through `@Bean`:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class ExecutorConfig {

    @Bean("taskExecutor")
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(8);
        executor.setMaxPoolSize(16);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("task-");
        executor.initialize();
        return executor;
    }
}
```

Three things happen in this code:

1. The developer **defines** a bean named `taskExecutor` with `@Bean("taskExecutor")`.
2. At startup, Spring discovers the configuration class, calls `taskExecutor()`, and **registers** the returned object in the container.
3. Business classes later **use** the pool bean through injection.

***

#### 3. Multiple Thread Pool Beans

Projects with pools serving different purposes usually define multiple beans with different names:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class ExecutorConfig {

    @Bean("computeExecutor")
    public ThreadPoolTaskExecutor computeExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(8);
        executor.initialize();
        return executor;
    }

    @Bean("ioExecutor")
    public ThreadPoolTaskExecutor ioExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(16);
        executor.initialize();
        return executor;
    }
}
```

| Bean name | Common purpose |
| --- | --- |
| **`computeExecutor`** | CPU-bound computation |
| **`ioExecutor`** | I/O-bound tasks, sending messages, remote calls |

Spring does not spontaneously create these pools. Developers declare multiple `@Bean` methods, and Spring registers them in the container.

***

#### 4. The Role of `@Qualifier`

**`@Qualifier`** specifies which bean to inject when several beans have the same type.

```java
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    private final ThreadPoolTaskExecutor taskExecutor;

    public TaskService(@Qualifier("taskExecutor") ThreadPoolTaskExecutor taskExecutor) {
        this.taskExecutor = taskExecutor;
    }

    public void runTask() {
        taskExecutor.execute(() -> {
            System.out.println("Executing asynchronous task");
        });
    }

    public Future<Integer> calculateAsync() {
        return taskExecutor.submit(() -> {
            int sum = 0;
            for (int i = 1; i <= 100; i++) {
                sum += i;
            }
            return sum;
        });
    }
}
```

| Location | Purpose |
| --- | --- |
| **`@Qualifier("taskExecutor")`** | Injects the pool bean named `taskExecutor` |
| **`taskExecutor.execute(...)`** | Explicitly submits a task for asynchronous execution |
| **`taskExecutor.submit(...)`** | Explicitly submits a result-producing task and obtains a `Future` |

With only one `ThreadPoolTaskExecutor` in the container, `@Qualifier` can usually be omitted; with several, specify it explicitly.

To retrieve a result, the caller then uses `future.get()`:

```java
Future<Integer> future = taskService.calculateAsync();
Integer result = future.get();
System.out.println("Result: " + result);
```

***

#### 5. The Role of `@Async`

**`@Async`** neither creates nor registers a thread pool. It **declares that a method should execute asynchronously**.

```java
import org.springframework.scheduling.annotation.Async;
import java.util.concurrent.CompletableFuture;
import org.springframework.stereotype.Service;

@Service
public class NotifyService {

    @Async("taskExecutor")
    public CompletableFuture<String> sendMessage() {
        System.out.println("Sending message asynchronously");
        return CompletableFuture.completedFuture("Sent successfully");
    }
}
```

Here, `"taskExecutor"` means calls to `sendMessage()` use the pool bean named `taskExecutor`.

The caller can receive the return value as follows:

```java
CompletableFuture<String> future = notifyService.sendMessage();
String result = future.get();
System.out.println(result);
```

Asynchronous support must also be enabled for `@Async` to work:

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**`@Async` Limitations**:

*   Applies only to beans managed by the Spring container.
*   Calls must pass through a Spring proxy; same-class calls such as `this.sendMessage()` do not trigger it.
*   Generally used on `public` methods for proxy interception.
*   With `void`, exceptions do not propagate directly to the caller. With `Future` / `CompletableFuture`, exceptions can be detected through `get()` / `join()`.

***

#### 6. Explicit `execute()` vs `@Async`

| Approach | Characteristics |
| --- | --- |
| **Explicit `execute()` / `submit()`** | Explicit task submission provides direct control |
| **`@Async`** | Declares asynchronous methods; Spring invokes the thread pool automatically |

If code already calls the pool explicitly:

```java
taskExecutor.execute(() -> {
    System.out.println("Executing asynchronous task");
});
```

The asynchronous behavior is already expressed explicitly, so an additional `@Async` is unnecessary.

***

#### 7. Choosing `ThreadPoolTaskExecutor` or `ThreadPoolExecutor`

They serve different scenarios; one does not universally replace the other:

| Scenario | Common choice |
| --- | --- |
| **Spring / Spring Boot project** | `ThreadPoolTaskExecutor` |
| **Plain Java project** | `ThreadPoolExecutor` |
| **Especially low-level, fine-grained control** | `ThreadPoolExecutor` |
| **Integration with `@Async` and bean management** | `ThreadPoolTaskExecutor` |

| Comparison | `ThreadPoolExecutor` | `ThreadPoolTaskExecutor` |
| --- | --- | --- |
| **Source** | Native JDK | Spring wrapper |
| **Requires Spring** | ❌ No | ✅ Yes |
| **Control granularity** | Lower-level and more direct | Application-oriented wrapper |
| **Spring bean management integration** | Ordinary | ✅ Convenient |
| **`@Async` integration** | Requires adaptation | ✅ Naturally suited |

As an analogy, `ThreadPoolExecutor` is the native JDK engine; `ThreadPoolTaskExecutor` is Spring's surrounding housing that makes the engine convenient to use in Spring projects.

***

## VII. Atomic Classes

### 1. What Are Atomic Classes?

Atomic classes provide **lock-free**, thread-safe operations with better performance than synchronized.

```java
import java.util.concurrent.atomic.AtomicInteger;

public class Demo {
    private static AtomicInteger count = new AtomicInteger(0);

    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> {
            for (int i = 0; i < 10000; i++) {
                count.incrementAndGet();  // Atomic increment
            }
        };

        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);
        t1.start();
        t2.start();
        t1.join();
        t2.join();

        System.out.println("count = " + count.get());  // 20000 (correct)
    }
}
```

### 2. Common Atomic Classes

| Category | Atomic classes |
| ---- | -------------------------------------------- |
| Primitive types | `AtomicInteger`, `AtomicLong`, `AtomicBoolean` |
| Reference types | `AtomicReference<V>` |
| Array types | `AtomicIntegerArray`, `AtomicLongArray` |

### 3. Common Methods

| Method | Description |
| ------------------------------- | --------------- |
| `get()` | Gets the current value |
| `set(newValue)` | Sets a new value |
| `getAndIncrement()` | Gets, then increments (i++) |
| `incrementAndGet()` | Increments, then gets (++i) |
| `getAndAdd(delta)` | Gets, then adds delta |
| `compareAndSet(expect, update)` | CAS: updates if the expected value matches |

***

## VIII. ThreadLocal Variables

### 1. What Is ThreadLocal?

`ThreadLocal` provides **an independent variable copy per thread**, isolating threads. Each thread accesses its own copy without interfering with others.

```
┌─────────────────────────────────────────────────────────────┐
│  Main memory                                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ThreadLocal<String> name = new ThreadLocal<>();    │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│          ┌───────────────┼───────────────┐                  │
│          ↓               ↓               ↓                  │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│   │ Thread A│    │ Thread B│    │ Thread C│             │
│   │ name="张三"│    │ name="李四"│    │ name="王五"│             │
│   └──────────┘    └──────────┘    └──────────┘             │
│   Each thread has an independent copy; no interference       │
└─────────────────────────────────────────────────────────────┘
```

**ThreadLocal vs Ordinary Variables:**

| Type | Thread access | Data isolation |
| ---- | -------- | -------- |
| Ordinary instance field | All threads share the same variable | ❌ None |
| ThreadLocal | Independent copy per thread | ✅ Complete isolation |

***

### 2. Basic Usage

#### Common Methods

| Method | Description |
| ---- | ---- |
| `set(T value)` | Sets the current thread's value |
| `get()` | Gets the current thread's value |
| `remove()` | Removes the current thread's value (prevents memory leaks) |
| `initialValue()` | Supplies the initial value (override or use withInitial) |

#### Basic Example

```java
public class ThreadLocalDemo {
    // Create a ThreadLocal variable
    private static ThreadLocal<String> threadLocal = new ThreadLocal<>();

    public static void main(String[] args) {
        // Thread 1
        new Thread(() -> {
            threadLocal.set("Thread 1 data");
            System.out.println(Thread.currentThread().getName() + "：" + threadLocal.get());
            threadLocal.remove();  // Remember to remove after use
        }, "Thread-1").start();

        // Thread 2
        new Thread(() -> {
            threadLocal.set("Thread 2 data");
            System.out.println(Thread.currentThread().getName() + "：" + threadLocal.get());
            threadLocal.remove();
        }, "Thread-2").start();

        // Main thread
        threadLocal.set("Main thread data");
        System.out.println(Thread.currentThread().getName() + "：" + threadLocal.get());
        threadLocal.remove();
    }
}

// Output (order may differ):
// Thread-1: Thread 1 data
// Thread-2: Thread 2 data
// main: Main thread data
```

#### Setting an Initial Value

```java
// Approach 1: override initialValue()
ThreadLocal<Integer> count = new ThreadLocal<>() {
    @Override
    protected Integer initialValue() {
        return 0;
    }
};

// Approach 2: use withInitial() (recommended; more concise)
ThreadLocal<Integer> count = ThreadLocal.withInitial(() -> 0);

// Usage
System.out.println(count.get());  // 0 (initial value returned before set)
```

***

### 3. Implementation

#### Data Structure

Each Thread maintains a `ThreadLocalMap` containing all of that thread's ThreadLocal variables:

```
Thread object
    └── ThreadLocalMap (similar to HashMap)
            ├── Entry(ThreadLocal<?> key, Object value)
            ├── Entry(ThreadLocal<?> key, Object value)
            └── ...

Example:
Thread-1
    └── ThreadLocalMap
            ├── Entry(nameLocal, "张三")
            └── Entry(ageLocal, 18)

Thread-2
    └── ThreadLocalMap
            ├── Entry(nameLocal, "李四")
            └── Entry(ageLocal, 20)
```

#### How get() Works (Simplified)

```java
public T get() {
    // 1. Get the current thread
    Thread t = Thread.currentThread();
    // 2. Get its ThreadLocalMap
    ThreadLocalMap map = t.threadLocals;
    // 3. Retrieve the value using this ThreadLocal object as the key
    if (map != null) {
        Entry e = map.getEntry(this);
        if (e != null) {
            return (T) e.value;
        }
    }
    // 4. Return the initial value if absent
    return setInitialValue();
}
```

***

### 4. Memory Leaks

#### Cause

A `ThreadLocalMap` entry holds a **weak reference** to its ThreadLocal object:

```java
static class Entry extends WeakReference<ThreadLocal<?>> {
    Object value;  // Strong reference
    Entry(ThreadLocal<?> k, Object v) {
        super(k);  // key is a weak reference
        value = v; // value is a strong reference
    }
}
```

**Problem Scenario:**

```
ThreadLocal object ←── weak reference ── Entry.key
                              Entry.value ──→ actual data (strong reference)

When the ThreadLocal object has no external strong references:
1. GC reclaims the ThreadLocal object.
2. Entry.key becomes null.
3. Entry.value remains strongly referenced.
4. If the thread is long-lived (such as a pooled thread), the value cannot be reclaimed → memory leak.
```

#### Solution

**Call `remove()` after use:**

```java
ThreadLocal<User> userLocal = new ThreadLocal<>();

try {
    userLocal.set(currentUser);
    // Business logic...
} finally {
    userLocal.remove();  // ✅ Required to prevent memory leaks
}
```

> ⚠️ **Important**: Pool threads are reused. Without `remove()`, the next task on that thread may retrieve the previous task's data!

***

### 5. Web Development Use Case

In a web application, each HTTP request is handled by a thread. Storing user information in ThreadLocal makes the current user accessible throughout the request processing chain.

#### UserContext Utility

```java
public class UserContext {
    private static final ThreadLocal<Long> USER_ID = new ThreadLocal<>();
    private static final ThreadLocal<String> USERNAME = new ThreadLocal<>();

    public static void setUserId(Long userId) {
        USER_ID.set(userId);
    }

    public static Long getUserId() {
        return USER_ID.get();
    }

    public static void setUsername(String username) {
        USERNAME.set(username);
    }

    public static String getUsername() {
        return USERNAME.get();
    }

    /** Clear the context (must be called when the request ends to prevent memory leaks). */
    public static void clear() {
        USER_ID.remove();
        USERNAME.remove();
    }
}
```

#### Set and Clear in an Interceptor

```java
@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {
        // Parse the token and obtain user information
        String token = request.getHeader("Authorization");
        Long userId = parseUserId(token);
        String username = parseUsername(token);

        // Store in ThreadLocal
        UserContext.setUserId(userId);
        UserContext.setUsername(username);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request,
                                HttpServletResponse response,
                                Object handler, Exception ex) {
        // Request finished; cleanup is required!
        UserContext.clear();
    }
}
```

#### Use in Business Code

```java
@Service
public class OrderService {

    public void createOrder(OrderDTO dto) {
        // Retrieve the current user directly without passing a parameter
        Long userId = UserContext.getUserId();

        Order order = new Order();
        order.setUserId(userId);
        order.setCreateTime(LocalDateTime.now());
        // ...
    }
}
```

***

### 6. InheritableThreadLocal

An ordinary `ThreadLocal` **does not share** data between parent and child threads. Use `InheritableThreadLocal` if a child needs to inherit the parent's data:

```java
// Ordinary ThreadLocal: a child cannot access the parent's value
ThreadLocal<String> threadLocal = new ThreadLocal<>();
threadLocal.set("Parent thread data");

new Thread(() -> {
    System.out.println(threadLocal.get());  // null
}).start();

// InheritableThreadLocal: a child can inherit the parent's value
InheritableThreadLocal<String> inheritableLocal = new InheritableThreadLocal<>();
inheritableLocal.set("Parent thread data");

new Thread(() -> {
    System.out.println(inheritableLocal.get());  // Parent thread data
}).start();
```

> ⚠️ **Note**: `InheritableThreadLocal` may not work as intended with thread pools because pool threads are reused rather than newly created for each task.

***
