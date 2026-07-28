## I. Function Basics

### 1.1 Function Definition

Functions are defined with `func`. **The type comes after the parameter name**, and the return type comes after the parameter list.

```go
// func name(param type) returnType { ... }
func add(a int, b int) int {
    return a + b
}

// Adjacent params of the same type can share the type
func sub(a, b int) int {
    return a - b
}

// No return value
func printMsg(msg string) {
    fmt.Println(msg)
}
```

| Element | Syntax | Versus Java |
| ---- | ---- | --------- |
| Type position | `a int` (type after) | `int a` (type before) |
| Return value | After the parameter list | Before the method name |
| Modifiers | No `public`/`static` | Visibility by first-letter case |

### 1.2 Multiple Return Values

A Go function can return **multiple values**—a core feature used widely for the "result + error" pattern.

```go
// Return quotient and remainder
func divide(a, b int) (int, int) {
    return a / b, a % b
}

quotient, remainder := divide(10, 3)   // 3, 1

// Classic pattern: return a result and an error
func parse(s string) (int, error) {
    n, err := strconv.Atoi(s)
    return n, err
}

// Use _ to discard a return value you do not care about
n, _ := parse("123")
```

> 💡 Multiple return values mean Go needs no exceptions or wrapper objects for "result + error"; `(result, error)` is Go's most typical signature.

### 1.3 Named Return Values

You can name return values, assign them directly inside the function, and a bare `return` returns those named values automatically.

```go
// result and err are named return values, already declared and usable
func divide(a, b int) (result int, err error) {
    if b == 0 {
        err = errors.New("divisor cannot be zero")
        return          // bare return: returns the current result(0) and err
    }
    result = a / b
    return              // returns result and nil
}
```

> **Note**: Named returns suit short functions or working with `defer` to modify return values. In long functions, bare returns hurt readability, so use them carefully.

### 1.4 Variadic Parameters

A `...` before the parameter type marks a **variadic parameter**, treated as a slice inside the function—equivalent to Java's `Type... args`.

```go
// nums is a []int inside the function
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

sum(1, 2, 3)            // 6
sum()                   // 0, zero arguments allowed

// Expand a slice into variadic arguments (note the ...)
nums := []int{1, 2, 3}
sum(nums...)            // 6
```

***

## II. Functions, Advanced

### 2.1 Functions Are First-Class Citizens

Functions are **first-class citizens** in Go: they can be assigned to variables, passed as arguments, and returned—like Java's functional interfaces/lambdas, but more direct.

```go
// Assign a function to a variable
var op func(int, int) int = add
fmt.Println(op(1, 2))           // 3

// Function as an argument (higher-order function)
func calc(a, b int, fn func(int, int) int) int {
    return fn(a, b)
}
calc(3, 4, add)                 // 7
```

### 2.2 Anonymous Functions and Closures

An **anonymous function** has no name and can be defined and called directly, often used for callbacks and goroutines. A **closure** is an anonymous function that references outer variables and "remembers" them.

```go
// Define and immediately invoke an anonymous function
result := func(a, b int) int {
    return a + b
}(3, 4)                         // 7

// Closure: the inner function references and modifies the outer count
func newCounter() func() int {
    count := 0
    return func() int {
        count++                 // the closure captures count and increments each call
        return count
    }
}

c := newCounter()
fmt.Println(c())                // 1
fmt.Println(c())                // 2, state is retained
```

| Concept | Description |
| ---- | ---- |
| **Anonymous function** | A nameless function, invoked immediately or assigned |
| **Closure** | A function that captures and holds references to outer variables |
| **Common uses** | Callbacks, deferred execution, encapsulating state, goroutines |

### 2.3 defer for Deferred Execution

`defer` postpones a function call **until after the `return` statement assigns the return value, but before control returns to the caller**, commonly used for releasing resources (closing files, unlocking, closing connections), similar to Java's `try-finally`.

A `return` is not atomic — it runs in three steps:

1. The return value is computed and assigned
2. All deferred functions run (LIFO)
3. Control actually leaves the function and goes back to the caller

Proof via a **named return value** — the defer runs between step 1 and step 3, so it can modify the result:

```go
func f() (result int) {          // named return value: result
    defer func() { result++ }()  // runs AFTER return assigns, BEFORE control leaves
    return 10
}

fmt.Println(f())                 // prints 11, not 10!
```

> ⚠️ This only works with **named** return values. With `func f() int`, the return value is copied to an anonymous slot at step 1, so a defer mutating a local variable afterward changes nothing the caller sees. This ordering is also why `defer` + `recover()` and error-wrapping (`err = fmt.Errorf("doWork: %w", err)` in a defer) work.

```go
func readFile() {
    f, err := os.Open("data.txt")
    if err != nil {
        return
    }
    defer f.Close()             // deferred to just before return, ensures the file is closed

    // normal file processing...
}
```

Multiple `defer`s run in **last-in-first-out (LIFO)** order:

```go
func demo() {
    defer fmt.Println("1")
    defer fmt.Println("2")
    defer fmt.Println("3")
}
// output order: 3 2 1
```

| Trait | Description |
| ---- | ---- |
| **Timing** | After `return` assigns the return value, before control returns to the caller |
| **Order** | Multiple defers run LIFO (stack) |
| **Argument evaluation** | Arguments are evaluated at the `defer` statement; only execution is deferred |
| **Typical use** | Close files/connections, unlock, recover from panic |

| Aspect | Java | Go |
| ---- | ---- | -- |
| Resource release | `try-finally` or try-with-resources | `defer` |
| Placement | In a finally block after the usage code | Right after acquiring the resource, declared nearby |

> 💡 Write `defer f.Close()` right after a successful `os.Open`, keeping acquisition and release together—harder to forget than Java's finally.

***

## III. Pointers

### 3.1 What Is a Pointer

A **pointer** stores a variable's memory address. `&` takes an address, and `*` dereferences (reads the value at the address). Go has pointers but **no pointer arithmetic**, making it safer than C.

```go
x := 10
p := &x                 // p points to x, type *int
fmt.Println(p)          // an address, e.g. 0xc0000140a0
fmt.Println(*p)         // 10, dereference to read

*p = 20                 // modify x through the pointer
fmt.Println(x)          // 20
```

| Symbol | Meaning | Example |
| ---- | ---- | ---- |
| `*T` | Pointer type to T | `*int`, `*User` |
| `&` | Take a variable's address | `p := &x` |
| `*` | Dereference, read the pointed-to value | `v := *p` |

### 3.2 Pointer Zero Value and Nil Checks

A pointer's zero value is `nil`; dereferencing a `nil` pointer panics, so check before use.

```go
var p *int              // nil
if p != nil {
    fmt.Println(*p)
}
// fmt.Println(*p)      // ❌ dereferencing p when nil panics
```

### 3.3 Pointers as Function Arguments

Go passes arguments **by value (copy)** by default. To modify a caller's variable inside a function, pass a pointer.

```go
// Pass by value: changes inside the function do not affect the outside
func incValue(n int) {
    n++                 // modifies the copy only
}

// Pass by pointer: changes inside the function affect the outside
func incPointer(n *int) {
    *n++                // modifies the original via the pointer
}

x := 10
incValue(x)
fmt.Println(x)          // 10, unchanged

incPointer(&x)
fmt.Println(x)          // 11, modified
```

### 3.4 Go Pointers vs Java References

In Java, object variables are essentially references and are passed by reference, while primitives are passed by value. Go distinguishes value and pointer explicitly, giving more control.

| Aspect | Java | Go |
| ---- | ---- | -- |
| Primitive argument | Pass by value | Pass by value |
| Object argument | Pass by reference (implicit) | By value by default; pass `*T` explicitly for a pointer |
| Pointer arithmetic | No pointer concept | Has pointers but forbids arithmetic |
| Null value | `null` | `nil` |

> 💡 Java's "objects are passed by reference automatically" must be expressed with pointers in Go. When a struct is large or must be modified inside a function, pass `*T` rather than `T`.

### 3.5 Allocating: new, make, and &T{}

`new(T)` is a built-in that does three things in one step: **allocate** storage for a `T`, **zero** it, and return a **pointer** `*T` to it. It never returns the value itself.

```go
p := new(Point)         // p is *Point, pointing at a zeroed Point{0, 0}
p.X = 10                // Go auto-dereferences: same as (*p).X = 10
```

**`new(T)` and `&T{}` produce the same thing** for a zero value—both allocate and return `*T`. In practice Go code almost always writes `&T{}`, because the composite literal can *also* set fields at the same time, which `new` cannot:

```go
a := new(Point)         // pointer to a zeroed Point
b := &Point{}           // identical
c := &Point{X: 1, Y: 2} // allocate AND initialize — new() has no way to do this
```

So `new` really earns its place only for types that have **no composite literal to write**—the basic types—where you want a pointer to a zeroed value:

```go
n := new(int)           // *int → 0        (there is no "int{}")
f := new(float64)       // *float64 → 0.0
```

**Do not confuse `new` with `make`.** Different jobs, different return types:

| | `new(T)` | `make(T, ...)` |
| ---- | ---- | ---- |
| Works on | **any** type | only slice, map, channel |
| Returns | `*T` (a pointer) | `T` (the value itself) |
| Result | zeroed | initialized and ready to use |

> ⚠️ `new` does **not** make slices/maps/channels usable. `new([]int)` returns a `*[]int` pointing at a **nil** slice (the header is merely zeroed); `new(map[string]int)` gives a pointer to a nil map, and writing to that map still panics. Those three types need `make` to be ready—`make([]int, 0)`, `make(map[string]int)`, `make(chan int)`. Rule of thumb: **slice/map/channel → `make`; everything else, if you need a pointer → `&T{}` (or `new` for a bare zeroed basic type).**

> 💡 **Stack or heap? The compiler decides, not `new` vs `&T{}`.** Taking an address does not force a heap allocation. Go runs **escape analysis** at compile time: if a pointer never leaves the function, its target stays on the **stack** (freed for free when the function returns); if the pointer *escapes*—returned, stored in a field, sent to a channel—the target is **moved to the heap** for the GC to manage. The same `&Point{}` goes either way depending on use:
>
> ```go
> func local() int    { p := &Point{}; return p.X }  // p stays in → stack
> func escapes() *Point { p := &Point{}; return p }  // p leaves out → heap
> ```
>
> Inspect the compiler's actual decisions with `go build -gcflags='-m'` (prints `does not escape` / `escapes to heap`). Practical upshot: **write for clarity, not to "avoid the heap"**—returning `&T{}` from a constructor is idiomatic and correct; let escape analysis place it.
