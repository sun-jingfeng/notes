## I. The error Type

### 1.1 Go's Error-Handling Philosophy

Go has **no exception mechanism**; errors are **ordinary return values**. A function returns an error as its last return value, and the caller checks and handles it explicitly.

```go
// Typical signature: the last return value is an error
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("divisor cannot be zero")
    }
    return a / b, nil       // return nil error on success
}

// The caller must check the error explicitly
result, err := divide(10, 0)
if err != nil {
    fmt.Println("error:", err)
    return
}
fmt.Println("result:", result)
```

| Aspect | Java exceptions | Go error |
| ---- | --------- | -------- |
| Mechanism | `throw` / `try-catch` | Return value `error` |
| Explicitness | Checked exceptions must be declared; runtime ones can hide | Always returned and checked explicitly |
| Control flow | Exceptions interrupt the normal flow | Sequential execution, branches via `if err != nil` |
| Ignoring errors | Can go un-caught (runtime exceptions) | Must actively discard with `_`, harder to ignore by accident |

> 💡 `if err != nil { return ... }` appears frequently in Go. This is by design: errors are handled in plain sight rather than hidden in an exception stack.

### 1.2 The error Interface

`error` is fundamentally a **built-in interface**: anything that implements `Error() string` is an error.

```go
// The error interface (built in)
type error interface {
    Error() string
}
```

### 1.3 Creating Errors

```go
// Form 1: errors.New, fixed text
err := errors.New("file not found")

// Form 2: fmt.Errorf, formatted text (can interpolate variables)
name := "data.txt"
err = fmt.Errorf("file %s not found", name)
```

| Form | When to use |
| ---- | -------- |
| `errors.New("msg")` | Simple fixed error message |
| `fmt.Errorf("...%s", v)` | Need to interpolate dynamic info |

***

## II. Error Wrapping and Inspection

### 2.1 Error Wrapping (%w)

`fmt.Errorf` with the **`%w`** verb **wraps** an underlying error, preserving the original error chain so upper layers can trace the root cause.

```go
func readConfig() error {
    err := openFile()
    if err != nil {
        // %w wraps the original error, forming an error chain
        return fmt.Errorf("failed to read config: %w", err)
    }
    return nil
}
```

| Verb | Difference |
| ---- | ---- |
| `%v` | Only interpolates the error text, loses the error chain |
| `%w` | Wraps the error, keeping the underlying error recognizable by `errors.Is`/`As` |

### 2.2 errors.Is and errors.As

After wrapping, use `errors.Is` to check whether the error chain contains a **target error**, and `errors.As` to extract an error of a **specific type** from the chain.

```go
// Predefined sentinel error
var ErrNotFound = errors.New("record not found")

func query(id int) error {
    return fmt.Errorf("query id=%d: %w", id, ErrNotFound)
}

err := query(1)

// errors.Is: is ErrNotFound somewhere in the chain?
if errors.Is(err, ErrNotFound) {
    fmt.Println("record not found")
}

// errors.As: extract a specific error type from the chain
var pathErr *os.PathError
if errors.As(err, &pathErr) {
    fmt.Println("file path error:", pathErr.Path)
}
```

| Function | Purpose | Java analogy |
| ---- | ---- | --------- |
| `errors.Is(err, target)` | Whether the chain contains the target error | Like matching a catch by exception instance/type |
| `errors.As(err, &target)` | Extract a specific type from the chain | Like `catch (SpecificException e)` |

### 2.3 Custom Error Types

When you need extra information (such as an error code), define a struct that implements the `error` interface.

```go
// Custom error type carrying an error code
type AppError struct {
    Code int
    Msg  string
}

// Implement the error interface
func (e *AppError) Error() string {
    return fmt.Sprintf("[%d] %s", e.Code, e.Msg)
}

func doSomething() error {
    return &AppError{Code: 404, Msg: "resource not found"}
}

err := doSomething()
var appErr *AppError
if errors.As(err, &appErr) {
    fmt.Println("error code:", appErr.Code)   // 404
}
```

***

## III. panic and recover

### 3.1 panic

A **panic** signals a severe error from which the program cannot continue. It interrupts the normal flow, runs `defer`s on the way up, and ultimately crashes the program—similar to an uncaught Java `RuntimeException`.

```go
func mustPositive(n int) {
    if n < 0 {
        panic("argument must be positive")     // trigger a panic
    }
    fmt.Println(n)
}
```

Common runtime errors that trigger a panic:

| Scenario | Description |
| ---- | ---- |
| Array/slice out of range | `s[10]` beyond length |
| Dereferencing a nil pointer | `*p` when `p == nil` |
| Writing to a nil map | Assigning into an uninitialized map |
| Failed type assertion | Bare assertion `i.(T)` with a mismatched type |

> **Note**: Use `panic` only for severe "cannot continue" errors (failed initialization, impossible branches). Everyday business errors should return an `error`, not panic.

### 3.2 recover

**recover** can only be called inside a `defer` function. It **catches a panic and resumes execution**, preventing a full crash—like a catch-all safety net.

```go
func safeRun() {
    // defer + recover catches the panic
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("recovered, caught panic:", r)
        }
    }()

    panic("something went wrong")   // trigger a panic
    // code after panic does not run
}

func main() {
    safeRun()
    fmt.Println("program keeps running")   // still runs
}
```

| Function | Purpose | Where called |
| ---- | ---- | -------- |
| `panic(v)` | Trigger a panic, interrupt the flow | Anywhere |
| `recover()` | Catch a panic, resume execution | Only effective inside a `defer` function |

### 3.3 Choosing error vs panic

| Scenario | Use error | Use panic |
| ---- | -------- | -------- |
| Expected business errors (file missing, invalid argument) | ✅ | ❌ |
| Errors the caller should handle and continue | ✅ | ❌ |
| Severe errors the program cannot continue from (missing config, failed init) | ❌ | ✅ (sparingly) |
| Impossible branches (defensive) | ❌ | ✅ |

> 💡 Rule of thumb: **prefer returning an error**, and reserve panic for truly unrecoverable cases. Library code should avoid panicking outward; when necessary, use recover at a boundary (such as HTTP middleware) so a single request cannot take down the whole service.
