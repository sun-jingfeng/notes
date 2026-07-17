## I. What Is Reflection

**Reflection** lets a program inspect and manipulate its own types and values at runtime. In Go it lives in the `reflect` package, built on top of interfaces: every `interface{}` value carries a (type, value) pair, and reflection is the API for reading and writing that pair.

| Aspect | Java | Go |
| ---- | ---- | ---- |
| Entry point | `obj.getClass()` | `reflect.TypeOf(x)` / `reflect.ValueOf(x)` |
| Core objects | `Class`, `Field`, `Method` | `reflect.Type`, `reflect.Value` |
| Metadata on fields | Annotations | Struct tags |
| Cost | Slow vs. direct call | Slow vs. direct call (often 10–100x) |

> 💡 Rule of thumb: reflection is for **library code** (JSON encoders, ORMs, validators). Application code should almost always use interfaces or generics instead.

***

## II. The Two Entry Points: Type and Value

```go
import "reflect"

x := 3.14
t := reflect.TypeOf(x)      // reflect.Type  → describes the type
v := reflect.ValueOf(x)     // reflect.Value → wraps the value

fmt.Println(t.Name())       // float64
fmt.Println(t.Kind())       // float64
fmt.Println(v.Float())      // 3.14
```

### 2.1 Type vs. Kind

| Concept | Meaning | Example |
| ---- | ---- | ---- |
| `Type` | The exact (possibly user-defined) type | `main.User`, `[]int` |
| `Kind` | The underlying category | `struct`, `slice`, `int`, `ptr` |

```go
type MyInt int
var m MyInt = 1

t := reflect.TypeOf(m)
fmt.Println(t.Name())       // MyInt
fmt.Println(t.Kind())       // int  ← switch on Kind, not Type, in generic code
```

### 2.2 Going Back: Interface()

`reflect.Value` → normal value via `Interface()` plus a type assertion:

```go
v := reflect.ValueOf(3.14)
f := v.Interface().(float64)    // back to a concrete float64
```

***

## III. The Three Laws of Reflection

From the official Go blog ("The Laws of Reflection"):

1. Reflection goes from **interface value → reflection object** (`TypeOf` / `ValueOf`).
2. Reflection goes from **reflection object → interface value** (`Interface()`).
3. To **modify** a reflection object, the value must be **settable** — you must start from a pointer.

### 3.1 Settability (Law 3 in practice)

```go
x := 1.0
v := reflect.ValueOf(x)
// v.SetFloat(2.0)          // panic: ValueOf(x) got a COPY, not settable

p := reflect.ValueOf(&x)    // pass a pointer
e := p.Elem()               // dereference: the Value now refers to x itself
fmt.Println(e.CanSet())     // true
e.SetFloat(2.0)
fmt.Println(x)              // 2
```

> ⚠️ Same rule as method receivers: no pointer, no mutation. `CanSet()` tells you before the panic does.

***

## IV. Inspecting Structs

The most common real-world use: walking struct fields and reading **tags**.

```go
type User struct {
    Name string `json:"name" validate:"required"`
    Age  int    `json:"age"`
}

u := User{Name: "Tom", Age: 18}
t := reflect.TypeOf(u)
v := reflect.ValueOf(u)

for i := 0; i < t.NumField(); i++ {
    f := t.Field(i)                          // reflect.StructField (metadata)
    fmt.Printf("%s = %v, json tag: %q\n",
        f.Name,
        v.Field(i).Interface(),              // field value
        f.Tag.Get("json"))                   // tag lookup
}
// Name = Tom, json tag: "name"
// Age = 18, json tag: "age"
```

### 4.1 Modifying Struct Fields

```go
v := reflect.ValueOf(&u).Elem()             // pointer → Elem() → settable
v.FieldByName("Age").SetInt(20)
```

> ⚠️ Only **exported** (uppercase) fields can be set via reflection; unexported fields return `CanSet() == false`. This is exactly why `encoding/json` ignores lowercase fields.

***

## V. Calling Methods Dynamically

```go
func (u User) Greet(msg string) string {
    return msg + ", " + u.Name
}

v := reflect.ValueOf(u)
m := v.MethodByName("Greet")
args := []reflect.Value{reflect.ValueOf("Hi")}
out := m.Call(args)                          // []reflect.Value
fmt.Println(out[0].String())                 // Hi, Tom
```

***

## VI. When to Use (and Avoid) Reflection

| Use it | Avoid it |
| ---- | ---- |
| Serialization (`encoding/json`, `gob`) | Anything an interface can express |
| ORMs mapping structs ↔ rows | Hot paths (10–100x slower than direct calls) |
| Validators / DI frameworks reading tags | Since Go 1.18: cases generics now cover |
| `fmt` printing arbitrary values | Code that must fail at compile time, not runtime |

**Drawbacks to remember:**

1. **No compile-time safety** — wrong Kind = runtime panic, not a compile error.
2. **Slow** — extra allocations and indirect calls.
3. **Hard to read** — reflection code obscures what types are actually involved.

> 💡 Decision order: plain code → interface → generics → reflection. Reach for `reflect` only when the type is genuinely unknown until runtime.
