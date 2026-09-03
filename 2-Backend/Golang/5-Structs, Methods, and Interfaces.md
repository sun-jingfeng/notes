## I. Structs

### 1.1 Struct Definition

A **struct** is a collection of fields—Go's core way to organize data, like a Java "data class" without methods. Go has no `class`; it uses `struct` + methods instead.

```go
// Define a struct type
type User struct {
    Name string
    Age  int
    Email string
}
```

| Concept | Description |
| ---- | ---- |
| `type` | Declares a new named type—here a struct; the same keyword declares interfaces, function types, and named basic types such as `type UserID int64` |
| **Uppercase field** | Visible outside the package (exported), like `public` |
| **Lowercase field** | Visible only inside the package, like `private` |

### 1.2 Creating Struct Instances

```go
// Form 1: by field name (recommended; readable and order-independent)
u1 := User{
    Name: "Tom",
    Age:  18,
}

// Form 2: by field order (not recommended; breaks if fields change)
u2 := User{"Jerry", 20, "j@x.com"}

// Form 3: declare first, assign later (fields start as zero values)
var u3 User
u3.Name = "Bob"

// Form 4: take an address to get a struct pointer
u4 := &User{Name: "Alice"}
fmt.Println(u4.Name)        // Go auto-dereferences, no need for (*u4).Name
```

> 💡 Access struct pointer fields with `.`; Go dereferences automatically, so you do not write `->` or `(*p).field` like in C.

### 1.3 Structs Are Value Types

Struct assignment and argument passing are **full copies**. Use pointers when you need to modify or avoid copying large objects.

```go
u := User{Name: "Tom"}
u2 := u                     // full copy
u2.Name = "Jerry"
fmt.Println(u.Name)         // Tom, original struct unaffected
```

### 1.4 Struct Tags

A **struct tag** is a string of metadata attached to a field, like a Java annotation. The compiler ignores it; libraries read it via reflection to control serialization, validation, ORM mapping, etc.

```go
type User struct {
    Name  string `json:"name"`                          // JSON field name
    Age   int    `json:"age,omitempty"`                 // omitempty: skip when zero value
    Email string `json:"-"`                             // -: never serialize
    ID    int64  `json:"id,string" gorm:"primaryKey"`   // multiple tags, space-separated
}
```

| Rule | Description |
| ---- | ---- |
| Syntax | Backquoted string of `key:"value"` pairs separated by **spaces** |
| `key:"value"` | No space around `:`; value in double quotes — wrong format silently fails |
| `omitempty` | Field is omitted when it is the zero value (`0`, `""`, `nil`, empty slice/map) |
| `-` | Field is always skipped |
| Unexported fields | Tags are useless on lowercase fields — reflection-based libraries cannot read them |

Common keys: `json`, `xml`, `yaml`, `gorm`, `validate`, `form`, `db`.

Reading tags yourself requires reflection (`reflect.StructField.Tag.Get("json")`) — see the Reflection note, section IV.

> 💡 A missing tag is not an error: `encoding/json` falls back to the exported field name. Run `go vet` to catch malformed tags (e.g. `json: "name"` with a space).

***

## II. Methods

### 2.1 Method Definition

A **method** is a function bound to a type via a **receiver**. The receiver goes between `func` and the method name.

```go
type User struct {
    Name string
    Age  int
}

// (u User) is the receiver, binding this method to the User type
func (u User) SayHello() {
    fmt.Printf("Hi, I'm %s\n", u.Name)
}

// Call
u := User{Name: "Tom"}
u.SayHello()                // Hi, I'm Tom
```

| Aspect | Java | Go |
| ---- | ---- | -- |
| Method location | Defined inside the class | Defined outside the struct, bound via a receiver |
| Call syntax | `obj.method()` | `obj.method()` |
| this/self | Implicit `this` | Explicitly named receiver (e.g. `u`) |

A receiver is not limited to structs: any **named type declared in the same package** can have methods, including types built on `int`, `string`, slices, maps, or functions. Methods cannot be declared on built-in types directly or on types from another package.

```go
// Named type over a basic type
type Celsius float64

func (c Celsius) ToFahrenheit() float64 {
    return float64(c)*9/5 + 32
}

// Named type over a slice
type IDs []int64

func (ids IDs) Contains(target int64) bool {
    for _, id := range ids {
        if id == target {
            return true
        }
    }
    return false
}

// Named type over a function: turns a plain function into an interface implementer
type HandlerFunc func(msg string) error

func (f HandlerFunc) Handle(msg string) error {
    return f(msg)          // the method just calls the function itself
}

temp := Celsius(100)
fmt.Println(temp.ToFahrenheit())            // 212
fmt.Println(IDs{1, 2, 3}.Contains(2))       // true
```

| Receiver base type | Allowed? | Note |
| ---- | ---- | ---- |
| Struct declared in this package | ✅ | The common case |
| `type Celsius float64` in this package | ✅ | Named basic type |
| `type IDs []int64` in this package | ✅ | Named slice / map / function type |
| Built-in `int`, `string`, `[]int` | ❌ | Not named types of this package |
| `time.Duration`, `sql.DB` | ❌ | Declared in another package; wrap or embed instead |
| Pointer or interface type | ❌ | `type P *User` and interfaces cannot be receivers |

> 💡 The function-type receiver pattern is how `net/http` lets a bare function satisfy the `http.Handler` interface via `http.HandlerFunc`.

### 2.2 Value Receiver vs Pointer Receiver

A receiver can be a value or a pointer; the difference is **whether it can modify the original object**.

```go
// Value receiver: operates on a copy, cannot modify the original
func (u User) SetNameValue(name string) {
    u.Name = name           // changes the copy only, no effect
}

// Pointer receiver: operates on the original, can modify
func (u *User) SetNamePointer(name string) {
    u.Name = name           // modifies the original
}

u := User{Name: "Tom"}
u.SetNameValue("A")
fmt.Println(u.Name)         // Tom, unchanged

u.SetNamePointer("B")       // Go auto-takes the address, like (&u).SetNamePointer
fmt.Println(u.Name)         // B, modified
```

| Receiver | Can modify original | When to use |
| ------ | -------------- | -------- |
| **Value `(u User)`** | No (operates on a copy) | Read-only, small struct, no modification |
| **Pointer `(u *User)`** | Yes | Need to modify fields, large struct, avoid copying |

> 💡 Rule of thumb: **if any method uses a pointer receiver, use a pointer receiver for all methods** for consistency. Use pointer receivers whenever you modify state or the struct is large.

***

## III. Composition over Inheritance

### 3.1 Go Has No Inheritance

Go does **not support inheritance**; it reuses code through **struct embedding**, i.e. "composition over inheritance."

```go
// Base struct
type Animal struct {
    Name string
}

func (a Animal) Eat() {
    fmt.Println(a.Name, "is eating")
}

// Dog embeds Animal (anonymous field: write only the type, no field name)
type Dog struct {
    Animal                  // embedding, automatically gains Animal's fields and methods
    Breed string
}

d := Dog{
    Animal: Animal{Name: "Rex"},
    Breed:  "Shiba",
}
d.Eat()                     // Rex is eating, calls the embedded type's method directly
fmt.Println(d.Name)         // Rex, accesses the embedded type's field directly
```

| Concept | Description |
| ---- | ---- |
| **Embedded field** | Write only the type name; its fields and methods are promoted |
| **Method promotion** | The outer type can call the embedded type's methods directly |
| **Method override** | Defining a same-named method on the outer type "overrides" the embedded one |

### 3.2 Composition vs Inheritance

| Aspect | Java inheritance | Go composition |
| ---- | --------- | ------- |
| Keyword | `extends` | Struct embedding (anonymous field) |
| Relationship | is-a | has-a |
| Multiple inheritance | Not supported (classes) | Can embed multiple types |
| Flexibility | Tight coupling, deep hierarchies become rigid | Loose coupling, compose as needed |

> 💡 Coming from Java, shift your thinking: Go has no `extends`. When you want to "reuse parent logic," use embedding instead.

***

## IV. Interfaces

### 4.1 Interface Definition and Implicit Implementation

An **interface** defines a set of method signatures. Go interfaces are **implicitly implemented**: a type that implements all of an interface's methods automatically satisfies it, with **no `implements` declaration**.

```go
// Define an interface containing the Area method
type Shape interface {
    Area() float64
}

type Circle struct {
    Radius float64
}

// Circle implements Area, so it automatically satisfies Shape, no declaration needed
func (c Circle) Area() float64 {
    return 3.14 * c.Radius * c.Radius
}

type Rectangle struct {
    Width, Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

// A parameter of interface type accepts any type implementing Shape
func printArea(s Shape) {
    fmt.Printf("area: %.2f\n", s.Area())
}

printArea(Circle{Radius: 2})
printArea(Rectangle{Width: 3, Height: 4})
```

| Aspect | Java interface | Go interface |
| ---- | --------- | ------- |
| Implementation declaration | Explicit `implements` | Implicit; implementing the methods is enough |
| Coupling | The implementer must know the interface exists | The implementer need not know the interface exists |
| Design style | Define the interface first, then implement | Can define an interface afterward to match existing types |

> 💡 Implicit implementation is a core feature: you can "add" an interface to standard-library or third-party types as long as the method signatures match, giving strong decoupling.

### 4.2 The Empty Interface

The **empty interface `interface{}`** (writable as `any` in Go 1.18+) has no methods, so **every type satisfies it**—like Java's `Object`, able to hold any value.

```go
// any is an alias for interface{}
var x any
x = 42
x = "hello"
x = []int{1, 2, 3}

// Often used to accept arguments of any type
func describe(i any) {
    fmt.Printf("value: %v, type: %T\n", i, i)
}
```

### 4.3 Type Assertion and Type Switch

To recover the concrete type from an interface, use a **type assertion**; use the comma-ok form to avoid a panic on failure.

```go
var i any = "hello"

// Type assertion: comma-ok form, ok indicates success
s, ok := i.(string)
if ok {
    fmt.Println("is a string:", s)
}

// n, ok := i.(int)         // ok == false, n is the zero value, no panic

// Type switch: match several concrete types behind the interface
func check(i any) {
    switch v := i.(type) {
    case int:
        fmt.Println("integer:", v)
    case string:
        fmt.Println("string:", v)
    case bool:
        fmt.Println("boolean:", v)
    default:
        fmt.Println("unknown type")
    }
}
```

| Syntax | Description |
| ---- | ---- |
| `v := i.(T)` | Panics directly on failure (not recommended) |
| `v, ok := i.(T)` | comma-ok; on failure `ok == false`, safe |
| `switch v := i.(type)` | Type switch, matches multiple types |

| Aspect | Java | Go |
| ---- | ---- | -- |
| Downcast | `(String) obj` | `i.(string)` |
| Type check | `instanceof` | comma-ok assertion / type switch |
| Cast failure | Throws `ClassCastException` | Panic (bare assertion) or `ok=false` (comma-ok) |

### 4.4 Interface nil and Zero Value

An interface's zero value is `nil`. For an interface to be nil, "both type and value must be nil." This is a common pitfall, so watch for an interface that is non-nil while its underlying value is nil.

```go
var s Shape              // nil interface
if s == nil {
    fmt.Println("interface is nil")
}
```

> **Note**: After assigning a nil-valued concrete-type pointer to an interface, the interface is **not equal to nil** (because the type information is non-empty). When checking, clearly distinguish "the interface is nil" from "the value the interface holds is nil."

The classic trap — a function that returns an error via a concrete pointer type:

```go
type MyErr struct{}
func (e *MyErr) Error() string { return "boom" }

func doWork() error {
    var e *MyErr = nil       // concrete pointer, currently nil
    // ... no error occurred ...
    return e                 // ❌ returns interface (type=*MyErr, value=nil)
}

err := doWork()
fmt.Println(err == nil)      // false! type info is non-nil, so the interface isn't nil
```

An interface value is a (type, value) pair; it equals `nil` only when **both** are nil. Here type is `*MyErr`, so `err != nil` even though the pointer inside is nil — the caller's `if err != nil` branch fires with no actual error.

| Interface content | `== nil`? |
| ---- | ---- |
| `var s Shape` (never assigned) | ✅ true (type nil, value nil) |
| Holds `(*MyErr)(nil)` | ❌ false (type `*MyErr`, value nil) |

> 💡 Fix: return the literal `nil` on the success path (`return nil`), never a possibly-nil concrete pointer variable typed as the interface.
