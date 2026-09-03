## I. Variables

### 1.1 Variable Declaration

Go is statically typed, so every variable has a definite type. There are three declaration forms; in practice the **short variable declaration `:=`** is the most common.

```go
// Form 1: full declaration with explicit type
var name string = "Go"

// Form 2: type inference, omit the type and let the value infer it
var age = 18

// Form 3: short declaration (only inside functions, most common)
count := 100
```

| Form | Syntax | When to use |
| ---- | ---- | -------- |
| **Full declaration** | `var name string = "Go"` | When the type must be explicit |
| **Type inference** | `var age = 18` | Package-level vars or clear types |
| **Short declaration** | `count := 100` | Inside functions, most common |

> **Note**: `:=` works only inside functions; package-level variables (outside any function) must use `var`.

### 1.2 Zero Values

In Go, a declared but unassigned variable automatically gets its **zero value**; there is no "uninitialized" state. This is stricter than Java, where local variables cannot be used before assignment.

| Type | Zero value |
| ---- | ---- |
| Numeric (`int`/`float`) | `0` |
| Boolean (`bool`) | `false` |
| String (`string`) | `""` (empty string, not null) |
| Pointer, slice, map, channel, function, interface | `nil` |

```go
var n int        // n == 0
var s string     // s == ""
var b bool        // b == false
var p *int       // p == nil
```

### 1.3 Grouped Declarations and Multiple Assignment

```go
// Grouped declaration (parentheses group them)
var (
    host string = "localhost"
    port int    = 8080
)

// Multiple assignment (often used to swap without a temp variable)
a, b := 1, 2
a, b = b, a       // after swap: a==2, b==1
```

### 1.4 Variables Must Be Used

Go enforces that **declared local variables must be used**, otherwise it is a compile error. This is one of the most visible differences from Java.

```go
func demo() {
    x := 10       // ❌ if x is never used, compile error: declared and not used
    fmt.Println(x) // ✅ passes once used
}
```

> 💡 To discard a return value you do not want, use the blank identifier `_`, e.g. `_, err := doSomething()`.

***

## II. Constants

### 2.1 Constant Declaration

A **constant** is declared with `const`; its value is fixed at compile time and cannot change.

```go
const Pi = 3.14159
const AppName string = "demo"

// Grouped declaration
const (
    StatusOK    = 200
    StatusError = 500
)
```

### 2.2 iota Enumerations

Go has no Java-style `enum` keyword; it uses `const` + **`iota`** for enumerations. `iota` starts at 0 in each `const` block and increments by 1 per line.

```go
const (
    Sunday    = iota // 0
    Monday           // 1
    Tuesday          // 2
    Wednesday        // 3
)

// Combine with bit shifts to define flags
const (
    Read    = 1 << iota // 1
    Write               // 2
    Execute             // 4
)
```

| Property | Description |
| ---- | ---- |
| `iota` start value | Starts at 0 in each `const` block |
| Increment rule | `+1` per line in the block, no need to repeat the expression |
| Common uses | Status codes, type enums, bit flags |

***

## III. Basic Data Types

### 3.1 Type Overview

| Category | Type | Description |
| ---- | ---- | ---- |
| **Integer** | `int`/`int8`/`int16`/`int32`/`int64` | `int` is 32- or 64-bit depending on platform |
| **Unsigned integer** | `uint`/`uint8`...`uint64` | No negatives |
| **Float** | `float32`/`float64` | Use `float64` by default |
| **Boolean** | `bool` | Only `true`/`false` |
| **String** | `string` | Immutable UTF-8 byte sequence |
| **Character** | `byte` (= `uint8`) / `rune` (= `int32`) | `byte` for a byte, `rune` for a Unicode code point |

### 3.2 Defining New Types with `type`

**`type`** declares a **named type**: it binds a name to a type so that name can be used everywhere a type is expected. Structs, interfaces, function types, and enum-like integers are all introduced with this one keyword—it plays the role of Java's `class`, `interface`, and `enum` declarations combined, and it can also name a plain `int` or `string`.

**Core idea:** a `type` declaration creates a new type identity; the type it is built on is the **underlying type** (the Go spec calls the result a *defined type*).

There are two forms; the `=` decides whether a new type is created or an existing one merely gets another name:

```go
type UserID int64           // type definition: a NEW, distinct type whose underlying type is int64
type MyList = []string      // type alias: another name for the SAME type
```

| Form | Syntax | Identity | Typical use |
| ---- | ---- | ---- | ---- |
| **Type definition** | `type Name T` | New type, distinct from `T` | Domain types, enums, attaching methods |
| **Type alias** | `type Name = T` | Same type as `T`, interchangeable | Renaming during refactors, shorthand names |

**Type definition:**

```go
type UserID int64
type Celsius float64
type Headers map[string][]string
type Handler func(msg string) error

var id UserID = 42
// var raw int64 = id       // ❌ compile error: UserID and int64 are different types
var raw int64 = int64(id)   // ✅ explicit conversion; the underlying types match

// Grouped declaration
type (
    ID   int64
    Name string
)
```

| Reason to define a type | Description |
| ---- | ---- |
| **Type safety** | `UserID` and `OrderID` are both `int64` underneath, but the compiler refuses to mix them |
| **Attach behavior** | Methods can be declared on any named type in the same package, not only on structs |
| **Readable signatures** | `func Register(h Handler)` reads better than a long `func(...)` literal |
| **Enumerations** | `type Status int` + `const` / `iota` is Go's enum idiom |

The enum idiom combines a named integer type with `iota`; typing the first constant makes every following constant a `Status` rather than an untyped `int`:

```go
type Status int

const (
    Pending Status = iota   // 0, typed as Status
    Active                  // 1
    Closed                  // 2
)

// A method on the named type gives the enum readable output
func (s Status) String() string {
    return [...]string{"Pending", "Active", "Closed"}[s]   // [...] = array literal, length inferred (3)
}

fmt.Println(Active)         // Active (fmt calls String() automatically)
```

**Type alias:**

```go
type any = interface{}      // the standard library's own alias (Go 1.18+)
type byte = uint8           // byte and rune are aliases, not new types
type rune = int32

type Text = string
var t Text = "go"
var s string = t            // ✅ no conversion needed; Text and string are the same type
```

| Aspect | Type definition `type A T` | Type alias `type A = T` |
| ---- | ---- | ---- |
| **New type created?** | Yes | No, `A` is just another spelling of `T` |
| **Assignable to `T` without conversion?** | No | Yes |
| **Inherits `T`'s methods?** | No (only fields and operators carry over) | Yes (it *is* `T`) |
| **Can declare new methods?** | Yes (in the same package) | Only if `T` is itself a named type of this package |
| **When to use** | Almost always | Moving a type between packages without breaking callers |

> **Note**: A type definition **does not inherit the methods** of its underlying type. `type MyDuration time.Duration` keeps the `+`/`<` operators and converts freely with `time.Duration`, but has no `Seconds()` method; declare what is needed or use struct embedding instead.

The same keyword covers every kind of type declaration (see the table below):

| Declaration | Example |
| ---- | ---- |
| **Named basic type** | `type UserID int64` |
| **Struct** | `type User struct { Name string }` |
| **Interface** | `type Shape interface { Area() float64 }` |
| **Function type** | `type Handler func(msg string) error` |
| **Slice / map / channel** | `type Headers map[string][]string` |
| **Generic type** | `type Stack[T any] struct { items []T }` |
| **Alias** | `type any = interface{}` |

> 💡 Package-level `type` declarations are the norm; `type` also works inside a function body for a throwaway local type (e.g. a one-off struct for decoding JSON), but methods cannot be declared on a local type.

### 3.3 Type Conversion

Go has **no implicit type conversion**; different types must be converted explicitly. This is stricter than Java, which auto-promotes smaller types to larger ones.

```go
var i int = 100
var f float64 = float64(i)   // ✅ explicit conversion required
var u uint = uint(f)         // ✅

// var f float64 = i         // ❌ compile error: mismatched types
```

| Conversion | Java | Go |
| ---- | ---- | -- |
| `int` → `double` | Auto-promoted | Must write `float64(i)` |
| `double` → `int` | Needs a cast | Must write `int(f)` |

> 💡 Removing implicit conversion avoids precision loss and surprises—every conversion is visible.

### 3.4 String and Composite Type Conversion

The conversion syntax `T(v)` is not limited to numeric types; it works between any two types the language defines as convertible. The most common non-numeric case is **string ↔ byte/rune slice**.

```go
msg := "hello"

b := []byte(msg)      // string → []byte (byte sequence)
s := string(b)        // []byte → string

r := []rune("你好Go")  // string → []rune (Unicode code points)
s2 := string(r)       // []rune → string

// Typical use: I/O APIs take []byte, not string
conn.Write([]byte(msg + "\n"))
```

| Conversion | Result | Note |
| ---- | ---- | ---- |
| `[]byte(s)` | Byte sequence of the string | One Chinese character occupies 3 bytes (UTF-8) |
| `[]rune(s)` | Unicode code points | One Chinese character counts as 1 rune |
| `string(b)` / `string(r)` | New string | Copies the data back |

> **Note**: These conversions **copy the underlying data**—strings are immutable while slices are mutable, so they cannot share memory. Avoid repeated conversions in hot paths.

Other convertible cases (see the table below):

| Case | Example | Description |
| ---- | ---- | ---- |
| **Named type ↔ underlying type** | `type MyInt int` → `MyInt(5)`, `int(m)` | Same underlying type converts freely |
| **Structs with identical fields** | `PointA(pointB)` | Field names and types must match exactly |
| **Slices with the same element type** | `type IDs []int` → `IDs([]int{1, 2})` | Element type must be identical |
| **Slice → array / array pointer** | `[4]byte(bs)` (Go 1.17+) | Panics if the slice is shorter than the array |

```go
// ❌ No element-wise conversion: element types differ
// b := []int64([]int32{1, 2, 3})   // compile error

// ✅ Convert each element in a loop instead
src := []int32{1, 2, 3}
dst := make([]int64, len(src))
for i, v := range src {
    dst[i] = int64(v)
}
```

| Syntax | Name | Purpose |
| ---- | ---- | ---- |
| `T(v)` | **Type conversion** | Creates a new value of type `T`; checked at compile time |
| `v.(T)` | **Type assertion** | Extracts the concrete type from an interface value; checked at runtime |

***

## IV. Operators

### 4.1 Common Operators

| Category | Operators |
| ---- | ------ |
| **Arithmetic** | `+` `-` `*` `/` `%` |
| **Comparison** | `==` `!=` `>` `<` `>=` `<=` |
| **Logical** | `&&` `\|\|` `!` |
| **Bitwise** | `&` `\|` `^` `<<` `>>` |
| **Assignment** | `=` `+=` `-=` `*=` `/=` etc. |

### 4.2 Increment/Decrement Are Statements

In Go, `++` and `--` are **statements, not expressions**: they must stand on their own line, and there is no prefix form.

```go
i := 0
i++          // ✅ valid
// i--       // ✅ valid
// j := i++  // ❌ compile error, i++ is not an expression
// ++i       // ❌ no prefix increment exists
```

> **Note**: Go has no ternary operator (`? :`); conditional values use `if`, reducing syntactic variety.

***

## V. Control Flow

### 5.1 if Conditions

`if` conditions **need no parentheses**, but `{}` is mandatory. You may add one initialization statement before the condition.

```go
// Basic form
if age >= 18 {
    fmt.Println("adult")
} else if age >= 12 {
    fmt.Println("teenager")
} else {
    fmt.Println("child")
}

// With an init statement (err's scope is limited to the if-else block, common for error checks)
if n, err := strconv.Atoi("123"); err == nil {
    fmt.Println(n)
}
```

| Trait | Description |
| ---- | ---- |
| **No parentheses** | `if x > 0`, not `if (x > 0)` |
| **`{}` mandatory** | Braces required even for a single statement |
| **Supports an init statement** | `if init; cond {}`, the variable's scope is the `if` block |

### 5.2 for Loop (the only loop keyword)

Go has only one loop keyword, `for`, with **no `while` or `do-while`**; different forms of `for` cover every scenario.

```go
// Form 1: standard three-clause
for i := 0; i < 5; i++ {
    fmt.Println(i)
}

// Form 2: as a while (omit init and post statements)
n := 0
for n < 5 {
    n++
}

// Form 3: infinite loop (like while(true))
for {
    // exit with break
    break
}

// Form 4: range iteration (arrays, slices, maps, strings, channels)
nums := []int{10, 20, 30}
for index, value := range nums {
    fmt.Println(index, value)
}
```

| Form | Syntax | Java equivalent |
| ---- | ---- | --------- |
| Three-clause | `for i := 0; i < n; i++` | `for (int i=0; i<n; i++)` |
| Conditional | `for cond {}` | `while (cond) {}` |
| Infinite | `for {}` | `while (true) {}` |
| Iteration | `for i, v := range coll` | Enhanced for / iterator |

> 💡 When you only need the value, use `for _, v := range nums`; when you only need the index, use `for i := range nums`.

### 5.3 switch Branches

Go's `switch` **breaks automatically** by default and does not fall through to the next case; to fall through, write `fallthrough` explicitly.

```go
switch day {
case "Sat", "Sun":          // one case can match multiple values
    fmt.Println("weekend")
case "Mon":
    fmt.Println("Monday")
default:
    fmt.Println("weekday")
}

// Conditionless switch: replaces a long if-else chain
score := 85
switch {
case score >= 90:
    fmt.Println("excellent")
case score >= 60:
    fmt.Println("pass")
default:
    fmt.Println("fail")
}
```

| Aspect | Java | Go |
| ---- | ---- | -- |
| **End of case** | Falls through by default, needs manual `break` | Breaks automatically |
| **Fall to next case** | Default behavior | Requires explicit `fallthrough` |
| **Multi-value match** | Stack multiple `case` labels | `case "Sat", "Sun":` comma-separated |
| **Conditionless switch** | Not supported | Supported, replaces if-else chains |

***

## VI. Input and Output

### 6.1 The fmt Package

The `fmt` package provides formatted I/O and is one of the most-used standard library packages.

```go
name := "Go"
age := 18

// Println (adds spaces automatically)
fmt.Println("name:", name)          // name: Go

// Printf (formatted, no trailing newline)
fmt.Printf("name=%s, age=%d\n", name, age)

// Sprintf (format into a string, no printing)
s := fmt.Sprintf("%s-%d", name, age)
```

### 6.2 Common Format Verbs

| Verb | Description | Example |
| ------ | ---- | ---- |
| `%d` | Decimal integer | `42` |
| `%s` | String | `hello` |
| `%f` | Float | `3.140000` |
| `%t` | Boolean | `true` |
| `%v` | Default format of the value (most general) | any type |
| `%+v` | Struct with field names | `{Name:Go Age:18}` |
| `%T` | The value's type | `int`, `string` |
| `%p` | Pointer address | `0xc0000140a0` |

> 💡 When unsure which verb to use, use `%v`; when debugging structs, use `%+v` to see field names.
