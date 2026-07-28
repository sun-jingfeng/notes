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

// range keeps receiving; the loop ends only once the channel is closed AND its
// buffer is empty — both are required, and closing alone does not end it
for v := range ch {
    fmt.Println(v)          // 0 1 2
}

// comma-ok detects the channel state
v, ok := <-ch               // ok == false means the channel is closed and empty
```

**`range` over a channel is sugar for the comma-ok loop**—which is the clearest way to see why both conditions are needed:

```go
for v := range ch {
    fmt.Println(v)
}

// is exactly:
for {
    v, ok := <-ch
    if !ok {                // ok == false IS "closed AND empty"
        break
    }
    fmt.Println(v)
}
```

The loop does not poll two separate flags. Each iteration is **one receive**, with exactly three possible outcomes:

| Channel state | Receive result | Loop |
| ---- | ---- | ---- |
| A value is available | returns it | body runs |
| Empty, still open | **blocks** | waits for a send *or* a close |
| Empty **and** closed | zero value, `ok == false` | **ends** |

So `close` does not mean "abort"—values already in the buffer are still delivered first:

```go
ch := make(chan int, 3)
ch <- 1; ch <- 2; ch <- 3
close(ch)                   // closed while 3 values are still buffered

for v := range ch {
    fmt.Println(v)          // still prints 1 2 3, then exits
}
```

**Closing releases goroutines already parked on a receive.** A receiver blocked in `<-ch` at the moment of the close is woken immediately—no further send is needed—and returns the zero value with `ok == false`. Any number of parked receivers are released by the single call, which is what makes a close usable as a wake-up signal:

```go
ch := make(chan int)

go func() {
    v, ok := <-ch           // parked here; nothing has been sent
    fmt.Println(v, ok)      // 0 false — printed the instant close runs
}()

time.Sleep(time.Millisecond)
close(ch)                   // releases the parked receiver immediately
```

On a **buffered** channel the release is just as immediate, but the woken receiver drains the remaining values first (`ok == true` for each) and only reports `ok == false` once the buffer is empty.

**A parked sender is not released—it panics.** A goroutine blocked in `ch <- v` when the close happens panics with `send on closed channel`, exactly as a send issued after the close does. So the close belongs to the sending side; with multiple senders none of them closes directly, and a separate goroutine closes once every sender has finished:

```go
var wg sync.WaitGroup
ch := make(chan int)

for i := 0; i < 3; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done()
        ch <- id
        // close(ch)        // ❌ each sender closing = double close + send on closed
    }(i)
}

go func() {
    wg.Wait()               // every sender has returned
    close(ch)               // ✅ closed exactly once, by a non-sender
}()

for v := range ch {
    fmt.Println(v)
}
```

| Rule | Description |
| ---- | ---- |
| **The sender closes** | The receiver should not close the channel |
| **No double close** | Closing twice panics |
| **Closing a nil channel** | Panics |
| **Sending on a closed channel** | Panics—including a send that was already blocked when the close happened |
| **Receivers blocked at close time** | All released immediately; zero value and `ok == false` once the buffer is empty |
| **Receiving from a closed channel** | Returns remaining data, then zero values with `ok == false` |
| **Never closed** | `range` blocks forever—`fatal error: deadlock` if every goroutine is asleep, otherwise a **silent goroutine leak** |
| **`range` cannot be cancelled** | No way to break out on a context; use `select` instead (see 5.3) |

### 2.4 Directional Channel Types

A channel type can be restricted to **one direction**. The arrow points the way data flows.

| Type | Meaning | Allowed operations |
| ---- | ---- | ---- |
| `chan T` | Bidirectional | send, receive, close |
| `chan<- T` | Send-only | send, close |
| `<-chan T` | Receive-only | receive |

They appear mostly in **function signatures**, where the restriction is checked at compile time—the type states and enforces each side's role instead of a comment asking nicely.

```go
// producer may only send; consumer may only receive
func producer(out chan<- int) {
    for i := 0; i < 3; i++ {
        out <- i
    }
    close(out)              // OK: closing is the sender's job
}

func consumer(in <-chan int) {
    for v := range in {
        fmt.Println(v)
    }
    // close(in)            // compile error: cannot close a receive-only channel
    // in <- 1              // compile error: cannot send to a receive-only channel
}

func main() {
    ch := make(chan int)    // always created bidirectional
    go producer(ch)         // implicitly converts to chan<- int
    consumer(ch)            // implicitly converts to <-chan int
}
```

| Rule | Description |
| ---- | ---- |
| **`make` is always bidirectional** | There is no `make(<-chan int)` worth writing—you could never fill it |
| **Conversion is one-way** | `chan T` → `<-chan T` / `chan<- T` is automatic; the reverse is impossible |
| **Enforces "the sender closes"** | Hand receivers a `<-chan T` and they *cannot* close it (see 2.3) |

> ⚠️ Don't confuse the **type** `<-chan T` with the **operation** `<-ch`:
>
> ```go
> var ch <-chan int   // type:       a receive-only channel
> v := <-ch           // expression: receive a value from ch
> ```
>
> Same arrow, different roles—position tells them apart: before `chan` it is a direction marker, before a variable it is a receive.

### 2.5 chan struct{}: the Signal Channel

`struct{}` is the **empty struct**—a struct type with no fields, occupying **zero bytes**. It has exactly one possible value, written `struct{}{}`:

```text
struct{}{}
^^^^^^^^     the type:    an anonymous struct with no fields
        ^^   the literal:  construct one, with no field values
```

It is an ordinary composite literal—`T{}`—that only looks strange because the type `T` itself ends in braces. It is the same shape as `[]int{}` or `Point{X:1}`; name the type and the double brace disappears:

```go
type Empty struct{}
var e Empty = Empty{}   // identical value, one pair of braces
```

Because there are no fields, all instances are equal (`struct{}{} == struct{}{}` is always `true`) and the value carries no information—it means only "something is here."

> ⚠️ Do **not** use `*struct{}` as an identity token. Distinct zero-size variables are permitted to share an address, and heap-allocated ones do (Go points them at a single `runtime.zerobase`), so two "different" empty-struct pointers can compare equal. Use the value, not its address.

A `chan struct{}` is what you use when you need to signal that something *happened* and no data needs to travel:

```go
done := make(chan struct{})

go func() {
    // ...work...
    close(done)             // broadcast: "finished"
}()

<-done                      // blocks until done is closed
```

**The signal is the close, not a send.** That is the whole idiom:

| | Send `ch <- v` | Close `close(ch)` |
| ---- | ---- | ---- |
| Wakes | **one** receiver | **every** receiver at once |
| Covering N watchers | needs N sends | one call, any number of watchers |
| Latecomers | block waiting for a send | return immediately, forever |

So closing is a **broadcast**, and it is **permanent**—precisely what "done" or "cancelled" means. Receiving from a closed channel returns the zero value instantly (see 2.3), which is why `<-done` unblocks although nobody sent anything.

**A sent value is consumed, not broadcast.** Every channel keeps a queue of goroutines parked on it; a send dequeues **one** of them, hands the value over, and marks it runnable. The others stay parked—no copy-to-all path exists anywhere in a channel:

```go
ch := make(chan int)

for i := 0; i < 3; i++ {
    go func(id int) {
        v := <-ch               // three goroutines park here
        fmt.Println(id, v)
    }(i)
}

ch <- 42                        // exactly one prints; the other two block forever
```

Which of the parked receivers wins is not controllable, and a goroutine that has not reached `<-ch` yet simply waits for the next send. N sends on one channel therefore distribute N values across the waiting receivers—each value still going to exactly one of them. That is the worker pool: **load balancing, not broadcast**.

Why `struct{}` rather than `bool`: it occupies no space per element, and more importantly it tells the reader **there is no value to inspect**. A `chan bool` would wrongly imply the received value carries meaning.

**A related but distinct idiom—the semaphore.** Here you *do* send `struct{}{}`: the buffered channel's fill level *is* the state, so real (but empty) values move through it. A send acquires a slot and blocks when full; a receive releases one:

```go
sem := make(chan struct{}, 2)       // at most 2 held at once

sem <- struct{}{}                   // acquire (blocks if 2 are already held)
defer func() { <-sem }()            // release
```

So the two patterns split cleanly:

| | Signal channel | Semaphore channel |
| ---- | ---- | ---- |
| The message is | the **close** | the **send** |
| `struct{}{}` value | never appears—nobody sends | sent and received (inert payload) |
| What carries meaning | that the channel closed | how many values are buffered |

> 💡 `struct{}` is also the idiomatic value type for a **set** (`map[K]struct{}`)—the same zero-byte trick, in a map instead of a channel. See the *Composite Types* note, §3.4.

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

### 5.3 How Done() Works

With 2.4 and 2.5 in hand, the signature of `Done()` in the `Context` interface reads straight off:

```go
Done() <-chan struct{}
```

**Receive-only** (only the context itself may close it) plus an **empty element type** (nothing is ever sent—the close *is* the signal). Every cancellation path—`cancel()`, a `WithTimeout` expiring, a `WithDeadline` passing—does the same one thing: **closes that channel**.

```go
select {
case <-ctx.Done():          // fires the instant the context is cancelled
    return ctx.Err()        // context.Canceled or context.DeadlineExceeded
case v := <-work:
    fmt.Println(v)
}
```

| Detail | Why |
| ---- | ---- |
| The value is discarded (no `v :=`) | Only the fact that the receive *succeeded* matters |
| One `cancel()` wakes every watcher | Close broadcasts; a send would wake only one goroutine |
| Safe to call `Done()` repeatedly | It returns the same channel each time, not a new one |
| `ctx.Err()` after cancellation | Tells you *which* happened: `Canceled` vs `DeadlineExceeded` |

> ⚠️ **`Done()` may return `nil`.** `context.Background()` and `context.TODO()` can never be cancelled, so they return a nil channel—not an empty one:
>
> ```go
> func (emptyCtx) Done() <-chan struct{} { return nil }   // context/context.go
> ```
>
> Not a bug: receiving from a nil channel **blocks forever**, so a `select` case on it simply never fires—the correct behaviour for "never cancelled," with no channel allocated. But `<-ctx.Done()` on a `Background` context *outside* a `select` deadlocks.
