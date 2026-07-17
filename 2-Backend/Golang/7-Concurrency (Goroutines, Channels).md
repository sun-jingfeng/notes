## I. Goroutines

### 1.1 What Is a Goroutine

A **goroutine** is Go's **lightweight thread**, scheduled by the Go runtime. Creation is extremely cheap (initial stack of just 2KB), so you can easily start tens of thousands. Launch one with the `go` keyword.

```go
func task(name string) {
    fmt.Println("running task:", name)
}

func main() {
    go task("A")            // launch a goroutine to run concurrently
    go task("B")            // launch another

    time.Sleep(time.Second) // wait for goroutines (demo only)
    fmt.Println("main done")
}
```

| Aspect | Java thread | Go goroutine |
| ---- | --------- | ------------ |
| Creation cost | Heavy (MB-scale stack, backed by an OS thread) | Light (KB-scale stack, runtime-scheduled) |
| Scale | Hundreds to thousands | Hundreds of thousands |
| Launch | `new Thread().start()` / thread pool | `go func()` |
| Scheduling | Scheduled by the OS | Scheduled by the Go runtime (GMP model) |

> 💡 Go favors "share memory by communicating, not communicate by sharing memory"—prefer passing data between goroutines via channels rather than using lots of shared variables + locks like Java.

### 1.2 The Main Goroutine Exiting

The `main` function runs in the main goroutine, and **when main exits, all goroutines terminate immediately** without waiting. In real code, synchronize with `sync.WaitGroup` or a channel rather than `time.Sleep`.

***

## II. Channels

### 2.1 What Is a Channel

A **channel** is a pipe for communication between goroutines. It is **type-safe** and FIFO. Send and receive with `<-`.

```go
// Create a channel: make(chan elementType)
ch := make(chan int)

go func() {
    ch <- 42                // send: put 42 into the channel
}()

value := <-ch               // receive: take data out of the channel
fmt.Println(value)          // 42
```

| Operation | Syntax |
| ---- | ---- |
| Create | `ch := make(chan int)` |
| Send | `ch <- v` |
| Receive | `v := <-ch` |
| Close | `close(ch)` |

### 2.2 Unbuffered vs Buffered

| Type | Creation | Trait |
| ---- | ---- | ---- |
| **Unbuffered** | `make(chan int)` | Send and receive must both be ready, otherwise block (synchronous) |
| **Buffered** | `make(chan int, 5)` | Can send while not full, receive while not empty; blocks only when full/empty |

```go
// Unbuffered: a send blocks until a receiver is ready
ch1 := make(chan int)

// Buffered: capacity 2, can hold 2 without blocking
ch2 := make(chan int, 2)
ch2 <- 1
ch2 <- 2                    // buffer not full, no block
// ch2 <- 3                 // buffer full, blocks
```

### 2.3 Closing and Iterating Channels

The sender uses `close` to signal "no more sends." The receiver can use comma-ok to detect closure, or `range` to keep receiving until closed.

```go
ch := make(chan int, 3)

go func() {
    for i := 0; i < 3; i++ {
        ch <- i
    }
    close(ch)               // done sending, close the channel
}()

// range keeps receiving; the loop ends automatically once the channel is closed and drained
for v := range ch {
    fmt.Println(v)          // 0 1 2
}

// comma-ok detects the channel state
v, ok := <-ch               // ok == false means the channel is closed and empty
```

| Rule | Description |
| ---- | ---- |
| **The sender closes** | The receiver should not close the channel |
| **No double close** | Closing twice panics |
| **Sending on a closed channel** | Panics |
| **Receiving from a closed channel** | Returns remaining data, then zero values with `ok == false` |

***

## III. select for Multiplexing

### 3.1 Basic select

**select** watches multiple channel operations at once and runs whichever branch is ready—like a channel-oriented `switch`.

```go
select {
case v := <-ch1:
    fmt.Println("received from ch1:", v)
case v := <-ch2:
    fmt.Println("received from ch2:", v)
case ch3 <- 100:
    fmt.Println("sent to ch3 successfully")
default:
    fmt.Println("no ready channel, run default (non-blocking)")
}
```

| Behavior | Description |
| ---- | ---- |
| **Multiple ready** | Picks one at random |
| **None ready + default** | Runs default (non-blocking) |
| **None ready + no default** | Blocks until one becomes ready |

### 3.2 Timeout Control

`select` with `time.After` implements timeouts, avoiding indefinite blocking.

```go
select {
case v := <-ch:
    fmt.Println("received:", v)
case <-time.After(2 * time.Second):
    fmt.Println("timeout, no data within 2 seconds")
}
```

***

## IV. sync Synchronization Primitives

### 4.1 WaitGroup: Wait for Multiple Goroutines

**`sync.WaitGroup`** waits for a group of goroutines to finish, the standard alternative to `time.Sleep`, similar to Java's `CountDownLatch`.

```go
var wg sync.WaitGroup

for i := 0; i < 3; i++ {
    wg.Add(1)               // counter +1
    go func(id int) {
        defer wg.Done()     // counter -1 on completion
        fmt.Println("task", id)
    }(i)
}

wg.Wait()                   // block until the counter reaches zero
fmt.Println("all done")
```

| Method | Purpose |
| ---- | ---- |
| `wg.Add(n)` | Increase the counter by n |
| `wg.Done()` | Decrease the counter by 1 (often with defer) |
| `wg.Wait()` | Block until the counter reaches zero |

> ⚠️ **Loop variable capture** — why the example passes `i` as a parameter (`go func(id int) {...}(i)`): before Go 1.22, all iterations shared **one** `i` variable, so goroutines that started late often all read the final value:
>
> ```go
> for i := 0; i < 3; i++ {
>     go func() { fmt.Println(i) }()   // pre-1.22: typically prints 3 3 3
> }
> ```
>
> **Go 1.22 fixed this**: each iteration now gets a fresh `i`, so the closure form prints 0 1 2 (in some order). The parameter-passing idiom remains common in existing code and is still the clearest way to show which value each goroutine receives. Know both — you will read a lot of pre-1.22 code.

### 4.2 Mutex

When multiple goroutines modify a shared variable, guard access to it with a lock. **`sync.Mutex`** ensures only one goroutine enters the critical section at a time, similar to Java's `synchronized`/`ReentrantLock`. Note that a mutex doesn't literally lock the data — it's a token only one goroutine can hold; the protection works because every code path touching the variable agrees to `Lock()` first.

```go
type Counter struct {
    mu    sync.Mutex
    count int
}

func (c *Counter) Inc() {
    c.mu.Lock()             // lock
    defer c.mu.Unlock()     // unlock (defer guarantees release)
    c.count++               // critical section, safely modify the shared variable
}
```

> ⚠️ Unlike `synchronized`/`ReentrantLock`, Go's `Mutex` is **not reentrant** — a goroutine that calls `Lock()` twice deadlocks on itself:
>
> ```go
> func (c *Counter) IncTwice() {
>     c.mu.Lock()
>     defer c.mu.Unlock()
>     c.Inc()             // Inc() calls c.mu.Lock() again → deadlock!
> }
> ```
>
> The standard pattern: an exported method takes the lock, then calls an unexported variant (e.g. `inc()`) that assumes the lock is already held.

| Primitive | Purpose | Java analogy |
| ---- | ---- | --------- |
| `sync.Mutex` | Mutual-exclusion lock | `synchronized` / `ReentrantLock` |
| `sync.RWMutex` | Read-write lock (shared reads, exclusive writes) | `ReadWriteLock` |
| `sync.WaitGroup` | Wait for a group of tasks to finish | `CountDownLatch` |
| `sync.Once` | Ensure an operation runs only once | Double-checked singleton init |

> **Note**: Go has a built-in data-race detector; running `go run -race main.go` finds concurrent access to shared variables without locking. Enable it during development.

### 4.3 sync.Once

`sync.Once` guarantees a block of code runs **only once** across goroutines, commonly used for singleton initialization.

```go
var once sync.Once
var instance *Config

func GetConfig() *Config {
    once.Do(func() {
        instance = &Config{}   // initialized only once
    })
    return instance
}
```

**The state lives in the `Once` instance, not the function.** `Do` may be called any number of times, from any goroutine, with any function — only the **first call ever executes its function**; every later call is a no-op, even with a different function:

```go
once.Do(func() { fmt.Println("A") })   // prints "A"
once.Do(func() { fmt.Println("B") })   // nothing — the fuse is already blown
```

Think of it as a one-shot fuse: one `Once` = one initialization slot. Two things to initialize lazily → two `Once` variables.

**Concurrent `Do` calls: losers block until the winner finishes.** If goroutine B calls `Do` while goroutine A's function is still running, B doesn't skip ahead — it **waits** for A's function to complete, then returns without executing its own:

```text
goroutine A: once.Do(initA)  → wins → runs initA...
goroutine B: once.Do(initB)  → BLOCKS, waits for A...
goroutine A: ...initA done → Do returns
goroutine B: unblocks → Do returns; initB never runs
```

So the contract of `Do` is really: "**when Do returns, the one-time initialization has fully completed**." That's why `return instance` in `GetConfig` is safe — no goroutine can ever observe a half-built `instance`.

Internally it's a mutex + a done flag: the winner is decided by who takes the mutex first; the flag flips (via `defer`) only after the function returns; blocked losers then see the flag and leave.

> ⚠️ Pitfalls:
>
> 1. **Non-reentrant** (same as `Mutex`): calling `once.Do(...)` inside the function running under the same `once` deadlocks — it waits for itself.
> 2. **A panic counts as done.** The flag is set by `defer`, so it flips even if the function panics — later `Do` calls will NOT retry. `Once` is the wrong tool for "retry until success."

***

## V. context

### 5.1 What context Does

**context** carries **cancellation signals, timeouts, deadlines, and request-scoped data** across goroutines. It is Go's standard tool for concurrency control, common in HTTP request handling and RPC call chains.

```go
// Create a cancelable context
ctx, cancel := context.WithCancel(context.Background())

go func() {
    for {
        select {
        case <-ctx.Done():          // received cancellation, exit
            fmt.Println("cancellation received, goroutine exits")
            return
        default:
            // keep working...
            time.Sleep(500 * time.Millisecond)
        }
    }
}()

time.Sleep(2 * time.Second)
cancel()                            // cancel manually, notify the goroutine to exit
```

### 5.2 Common Constructors

| Function | Purpose |
| ---- | ---- |
| `context.Background()` | Root context, usually the starting point |
| `context.WithCancel(parent)` | Cancelable manually |
| `context.WithTimeout(parent, d)` | Auto-cancels after a duration |
| `context.WithDeadline(parent, t)` | Auto-cancels at a specific time |
| `context.WithValue(parent, k, v)` | Carry request-scoped key-value data |

```go
// A context with a timeout: auto-cancels after 3 seconds
ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
defer cancel()                      // release resources promptly

select {
case <-ctx.Done():
    fmt.Println("timed out or canceled:", ctx.Err())
case result := <-doWork():
    fmt.Println("done:", result)
}
```

> 💡 Convention: pass `context` as the **first parameter** of a function, named `ctx`. Even when you create a cancelable context, call `defer cancel()` to release resources and avoid leaks.
