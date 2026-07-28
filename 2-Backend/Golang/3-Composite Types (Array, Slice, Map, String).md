## I. Arrays

### 1.1 Array Definition

An **array** is a fixed-length sequence of same-typed elements, and **the length is part of the type**, so it cannot change after declaration.

```go
// Declare an int array of length 3; unassigned elements get the zero value
var arr [3]int            // [0 0 0]

// Declare and initialize
nums := [3]int{10, 20, 30}

// Let the number of initial values infer the length
auto := [...]int{1, 2, 3, 4}   // length is 4
```

| Trait | Description |
| ---- | ---- |
| **Fixed length** | `[3]int` and `[4]int` are different types |
| **Value type** | Copied wholesale on assignment or as an argument (unlike Java arrays' reference semantics) |
| **Zero-filled** | Unassigned elements are automatically zero values |

> **Note**: Arrays are **value types**, so passing one to a function copies the entire array. In practice arrays are rarely used directly—slices are used almost everywhere.

### 1.2 Arrays Are Value Types

```go
a := [3]int{1, 2, 3}
b := a              // full copy, b is an independent duplicate
b[0] = 100
fmt.Println(a[0])   // still 1, a is unaffected
```

| Aspect | Java array | Go array |
| ---- | --------- | ------- |
| Assignment semantics | Reference (shares the same object) | Value copy (independent duplicate) |
| Length | Determined at runtime, not part of the type | Fixed at compile time, part of the type |

***

## II. Slices

### 2.1 What Is a Slice

A **slice** is a **dynamic view** over an underlying array with a variable length. It is Go's most-used sequence type, equivalent to Java's `ArrayList`.

```go
// Form 1: literal (most common)
s := []int{1, 2, 3}          // note: no length inside []

// Form 2: make, specifying length and capacity
s2 := make([]int, 3)         // length 3, capacity 3: [0 0 0]
s3 := make([]int, 3, 10)     // length 3, capacity 10

// Form 3: slice an array/slice
arr := [5]int{1, 2, 3, 4, 5}
sub := arr[1:4]              // [2 3 4], half-open interval
```

| Concept | Description |
| ---- | ---- |
| **Length (len)** | Current number of elements, `len(s)` |
| **Capacity (cap)** | Space from the slice start to the end of the underlying array, `cap(s)` |
| **Underlying array** | A slice stores no data itself; it points to an underlying array |

### 2.2 append and Growth

`append` adds elements to the end of a slice; when capacity is insufficient it **grows automatically** (allocates a larger underlying array and copies the data).

```go
s := make([]int, 0, 2)       // length 0, capacity 2
s = append(s, 1)             // [1]
s = append(s, 2)             // [1 2], capacity full
s = append(s, 3)             // [1 2 3], triggers growth, new underlying array

// Append another slice (note the ... to expand)
s = append(s, []int{4, 5}...)
```

| Behavior | Description |
| ---- | ---- |
| **Enough capacity** | Appends in place, returns a slice over the same underlying array |
| **Insufficient capacity** | Allocates a new underlying array (usually doubled), copies, returns a new slice |
| **Must capture the result** | `s = append(s, x)`; the address changes after growth |

> **Note**: Always capture the result with `s = append(s, x)`. After growth the underlying array is replaced, so ignoring the return value loses data.

### 2.3 Slices Are Reference Types

Passing a slice passes a reference to the underlying array (technically a struct containing a pointer), so modifying elements inside a function affects the original slice.

```go
func modify(s []int) {
    s[0] = 100               // change affects the caller
}

nums := []int{1, 2, 3}
modify(nums)
fmt.Println(nums[0])         // 100
```

| Aspect | Array | Slice |
| ---- | ---- | ---- |
| Type semantics | Value type (copy) | Reference type (shares underlying array) |
| Length | Fixed | Variable (`append`) |
| As argument | Full copy | Shares underlying array |
| Java equivalent | Fixed-length array | `ArrayList` |

### 2.4 Slice Sharing Pitfall

Multiple slices may share one underlying array, so a change to one can "leak" into another—watch out for this.

```go
s := []int{1, 2, 3, 4, 5}
sub := s[1:3]                // shares the underlying array with s
sub[0] = 100
fmt.Println(s)               // [1 100 3 4 5], original slice changed

// Use copy when you need an independent duplicate
dst := make([]int, len(sub))
copy(dst, sub)               // copies into an independent underlying array
```

***

## III. Maps

### 3.1 Map Definition

A **map** is a collection of key-value pairs (a hash table), equivalent to Java's `HashMap`, with **unordered keys**.

```go
// Form 1: make
m := make(map[string]int)
m["a"] = 1
m["b"] = 2

// Form 2: literal
scores := map[string]int{
    "Tom":  90,
    "Jerry": 85,
}
```

| Operation | Syntax |
| ---- | ---- |
| **Insert/update** | `m[key] = value` |
| **Read** | `v := m[key]` |
| **Delete** | `delete(m, key)` |
| **Length** | `len(m)` |

> ⚠️ **Writing to a nil map panics.** A map declared with `var` (not `make` or a literal) is `nil`: reading and `len`/`delete` are safe, but any write panics at runtime. This is a classic beginner crash.
>
> ```go
> var m map[string]int         // nil map, no make
> v := m["a"]                  // ✅ reading is fine, returns zero value
> m["a"] = 1                   // ❌ panic: assignment to entry in nil map
> ```
>
> Always initialize with `make(map[K]V)` or a literal before writing. (Contrast with slices: `append` on a nil slice works fine.)

### 3.2 Checking Key Existence

Reading a missing key returns the value type's **zero value** without an error, so use the **comma-ok** form to distinguish "key absent" from "value happens to be the zero value."

```go
m := map[string]int{"a": 0}

v := m["x"]                  // v == 0 (zero value), but cannot tell whether the key exists

// comma-ok form: ok indicates whether the key exists
if v, ok := m["a"]; ok {
    fmt.Println("exists, value is", v)   // exists, value is 0
} else {
    fmt.Println("does not exist")
}
```

> 💡 This is a common gotcha versus Java's `HashMap`: `m[key]` never throws a null pointer—a missing key yields the zero value, so you must check `ok` for existence.

### 3.3 Iterating a Map

```go
for key, value := range scores {
    fmt.Println(key, value)
}
```

> **Note**: Map iteration order is **random** and may differ each run. When ordered output is needed, collect the keys, sort them, then iterate.

| Aspect | Java HashMap | Go map |
| ---- | ------------ | ------ |
| Missing key | Returns `null` | Returns the zero value |
| Existence check | `containsKey` | comma-ok `v, ok := m[k]` |
| Iteration order | Not guaranteed | Explicitly randomized (differs each run) |
| Thread safety | No (needs `ConcurrentHashMap`) | No (needs `sync.Map` or a lock) |

### 3.4 Sets: map[K]struct{}

Go has no built-in set type. The idiom is a map whose **value carries no information**—so the value type is `struct{}`, the zero-byte empty struct. Only the keys matter; membership is the comma-ok check from 3.2.

```go
seen := map[string]struct{}{}       // the set

seen["go"] = struct{}{}             // add
delete(seen, "go")                  // remove

if _, ok := seen["rust"]; !ok {     // membership test
    seen["rust"] = struct{}{}
}
```

Why `struct{}` and not `bool` as the value:

| Value type | Cost per entry | Ambiguity |
| ---- | ---- | ---- |
| `map[K]struct{}` | value is **0 bytes** | none—presence *is* the meaning |
| `map[K]bool` | 1 byte per entry | is `false` "absent" or "present but false"? |

`struct{}` has only one storable value, so a key is either present or not—there is no misleading `false` state to reason about, and large sets waste no space on values.

> 💡 The trade-off is ergonomics. `map[K]bool` reads a little cleaner—`seen[k] = true` to add, and `if seen[k]` to test (a missing key yields `false`, so no comma-ok needed). Reach for `map[K]struct{}` on large sets or when a stray "present but false" entry would be a real bug; `map[K]bool` is fine otherwise. (The same zero-byte `struct{}` appears as a channel element in *Concurrency* §2.5.)

***

## IV. Strings

### 4.1 The Nature of Strings

A **string** is an **immutable UTF-8 byte sequence**, backed by a read-only byte array.

```go
s := "Hello, 世界"

// Length is the byte count, not the character count
fmt.Println(len(s))          // 13 ("世界" takes 3 bytes each)

// Indexing by byte returns a byte (uint8)
fmt.Println(s[0])            // 72 (ASCII of 'H')
```

| Trait | Description |
| ---- | ---- |
| **Immutable** | Cannot modify by index; `s[0] = 'h'` is a compile error |
| **UTF-8 encoded** | Non-ASCII characters take multiple bytes |
| **`len` returns the byte count** | Not the number of characters |

### 4.2 byte and rune

Use `byte` for ASCII, and `rune` (a Unicode code point) for non-ASCII characters such as CJK.

| Type | Alias | Use |
| ---- | ---- | ---- |
| `byte` | `uint8` | Represents one byte, for ASCII |
| `rune` | `int32` | Represents one Unicode code point, for any character |

```go
s := "Go语言"

// Iterate by byte (CJK chars are split into multiple bytes)
for i := 0; i < len(s); i++ {
    fmt.Printf("%d ", s[i])  // prints byte values
}

// Iterate by character (range decodes runes; i is the byte index)
for i, r := range s {
    fmt.Printf("%d:%c ", i, r)   // 0:G 1:o 2:语 5:言
}

// Convert to []rune to index by character and get the true character count
runes := []rune(s)
fmt.Println(len(runes))      // 4 (true character count)
```

> 💡 To count the "number of characters" in a CJK string, use `len([]rune(s))` or `utf8.RuneCountInString(s)`; `len(s)` gives the byte count.

### 4.3 Concatenation and Conversion

```go
// Concatenation: use + for small amounts
s := "a" + "b" + "c"

// For heavy concatenation use strings.Builder (efficient, avoids repeated allocation)
var b strings.Builder
b.WriteString("Hello")
b.WriteString(" Go")
result := b.String()

// Convert between string and byte slice
bs := []byte("hello")        // string → []byte
str := string(bs)            // []byte → string

// Convert between numbers and strings (strconv package)
n, _ := strconv.Atoi("123")  // string → int
s2 := strconv.Itoa(456)      // int → string
```

| Scenario | Recommended | Java analogy |
| ---- | -------- | --------- |
| Small concatenation | `+` | `+` |
| Heavy looped concatenation | `strings.Builder` | `StringBuilder` |
| Number to string | `strconv.Itoa` | `String.valueOf` |
| String to number | `strconv.Atoi` | `Integer.parseInt` |

### 4.4 Common strings Functions

| Function | Purpose |
| ---- | ---- |
| `strings.Contains(s, sub)` | Whether it contains a substring |
| `strings.HasPrefix(s, p)` | Whether it starts with a prefix |
| `strings.HasSuffix(s, suf)` | Whether it ends with a suffix |
| `strings.Split(s, sep)` | Split by separator into a slice |
| `strings.Join(slice, sep)` | Join a slice with a separator |
| `strings.Replace(s, old, new, n)` | Replace (n times, -1 for all) |
| `strings.TrimSpace(s)` | Trim leading/trailing whitespace |
| `strings.ToUpper / ToLower` | Case conversion |
