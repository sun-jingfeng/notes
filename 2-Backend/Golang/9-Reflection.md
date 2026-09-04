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

## VI. Case Study: How `encoding/json` Honors a Struct Tag

Tags do nothing on their own. Following one from declaration to HTTP response shows which layer actually does the work — and it is usually not the layer you would guess.

### 6.1 The Tag Is Inert Until Something Reads It

The compiler stores the tag string in the type metadata and assigns it no meaning. `reflect` hands it back verbatim:

```go
type Body struct {
    Code int    `json:"code"`
    Msg  string `json:"msg"`
    Data any    `json:"data,omitempty"`
}

f := reflect.TypeOf(Body{}).Field(2)
fmt.Println(f.Name)                 // Data
fmt.Println(f.Tag)                  // json:"data,omitempty"   ← whole raw string
fmt.Println(f.Tag.Get("json"))      // data,omitempty          ← one key's value
```

`StructTag.Get` / `Lookup` knows only the `key:"value"` splitting convention. It does **not** know that `data` is a field name or that `omitempty` means anything — splitting that value on the comma and acting on the parts is `encoding/json`'s own logic.

> 💡 This is why `json`, `gorm` and `validate` tags coexist on one field: no library owns the tag, each reads only its own key.

### 6.2 Who Reads the Tag in a Web Handler

Returning JSON through a framework makes it look like the framework controls the output format. It does not — Gin sets a Content-Type and delegates:

`c.JSON` → `render.JSON.Render` → `WriteJSON` → `json.API.Marshal` → `encoding/json.Marshal` → `reflect`

Gin v1.12's default codec (`codec/json/json.go`) is a passthrough:

```go
//go:build !jsoniter && !go_json && !(sonic && (linux || windows || darwin))

const Package = "encoding/json"

func (j jsonApi) Marshal(v any) ([]byte, error) {
    return json.Marshal(v)      // the entire implementation
}
```

| Layer | Responsibility | Reads the tag? |
| ---- | ---- | ---- |
| Gin | Content-Type, status code, writing bytes | No |
| `encoding/json` | Field naming, `omitempty`, `-` | **Yes — parses the `json:` key** |
| `reflect` | Enumerating fields, exposing `.Tag` | Splits `key:"value"`, nothing more |

| Go | Java |
| ---- | ---- |
| `json:"code"` struct tag | `@JsonProperty("code")` annotation |
| `encoding/json` | Jackson `ObjectMapper` |
| Gin (`c.JSON`) | Spring MVC — also just delegates to Jackson |

> 💡 The build tags above are why `sonic`, `go-json` and `json-iterator` appear as indirect deps of Gin: the codec is swappable at build time, and every alternative honors the same `json:` convention. That convention — not the framework — is the real contract.

### 6.3 What `omitempty` Actually Considers Empty

The check runs against the field's **static type**, not the value it happens to hold.

| Static type | Omitted when |
| ---- | ---- |
| numbers | `0` |
| string | `""` |
| bool | `false` |
| pointer / interface | `nil` |
| slice / map / array | length 0 |
| struct | **never** — a struct is never "empty" |

The interface row is the trap. `Data any` is an interface, so only a nil interface is empty; what it holds is irrelevant:

```go
type E struct {
    Data any `json:"data,omitempty"`
}

E{Data: nil}        // {}              ← dropped
E{Data: 0}          // {"data":0}      ← kept
E{Data: ""}         // {"data":""}     ← kept
E{Data: []int{}}    // {"data":[]}     ← kept
```

Declared as `Data []Item` that empty slice would vanish; as `any` it survives. For an API envelope that is usually what you want — a handler with no results sends `"data":[]` instead of dropping the key and forcing the client to branch.

### 6.4 `omitempty` vs. `omitzero` (Go 1.24+)

`omitempty` predates any general notion of a zero value and cannot omit a zero struct. Go 1.24 added `omitzero`, which omits the type's zero value and honors an `IsZero() bool` method if the type has one:

```go
type T struct {
    A time.Time `json:"a,omitempty"`    // a struct is never "empty"
    B time.Time `json:"b,omitzero"`     // zero time → omitted
}

json.Marshal(T{})       // {"a":"0001-01-01T00:00:00Z"}
```

They are **not** interchangeable, and slices show the difference in the other direction:

```go
type S struct {
    E []int `json:"e,omitempty"`
    Z []int `json:"z,omitzero"`
}

json.Marshal(S{E: nil, Z: nil})            // {}            both drop nil
json.Marshal(S{E: []int{}, Z: []int{}})    // {"z":[]}      omitzero keeps it
```

> ⚠️ `omitempty` asks "is this empty?" (length 0 counts); `omitzero` asks "is this the zero value?" (only `nil` counts for a slice). Use `omitzero` when the zero value genuinely means absent, `omitempty` when empty collections should disappear.

***

## VII. When to Use (and Avoid) Reflection

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
