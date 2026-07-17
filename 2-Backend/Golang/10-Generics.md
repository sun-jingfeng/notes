## I. Why Generics

### 1.1 The Problem Before Go 1.18

Before generics (Go 1.18, 2022), writing a function that works for multiple types meant either copy-pasting per type or using `interface{}` and losing type safety.

```go
// Pre-generics: one function per type, duplicated logic
func MaxInt(a, b int) int { if a > b { return a }; return b }
func MaxFloat(a, b float64) float64 { if a > b { return a }; return b }

// Or interface{}: compiles for anything, fails at runtime
func Max(a, b interface{}) interface{} { /* needs type assertions, unsafe */ }
```

**Generics** let you write the logic once with a **type parameter**, keeping full compile-time type checking.

```go
// One generic function covers all ordered types
func Max[T cmp.Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}

Max(1, 2)         // T inferred as int
Max(1.5, 2.5)     // T inferred as float64
Max("a", "b")     // T inferred as string
```

| Aspect | Java generics | Go generics |
| ---- | --------- | ------- |
| Introduced | Java 5 (2004) | Go 1.18 (2022) |
| Syntax | `<T>` angle brackets | `[T]` square brackets |
| Implementation | Type erasure (one compiled copy, casts inserted) | Stenciling/dictionaries (may compile specialized copies) |
| Primitives | Not directly (`List<int>` invalid, needs `Integer`) | Directly (`[]int` works, no boxing) |
| Constraint syntax | `<T extends Comparable<T>>` | `[T cmp.Ordered]` (constraint is an interface) |

***

## II. Type Parameters and Constraints

### 2.1 Syntax

Type parameters go in square brackets after the function or type name. Each parameter has a **constraint** saying which types are allowed.

```go
//        ┌ type parameter  ┌ constraint
func First[T any](s []T) T {
    return s[0]
}
```

| Constraint | Meaning |
| ---- | ---- |
| `any` | Any type (alias for `interface{}`) |
| `comparable` | Types usable with `==` / `!=` (map keys, deduplication) |
| `cmp.Ordered` | Types usable with `<` `>` (numbers, strings), from the `cmp` package |
| Custom interface | Any interface can serve as a constraint |

### 2.2 Custom Constraints and Union Types

A constraint is just an interface. Inside a constraint, `|` unions several allowed types, and `~T` means "any type whose **underlying type** is T" (so named types like `type MyInt int` also match).

```go
// Only int and float64 allowed
type Number interface {
    int | float64
}

// ~ matches derived types too: type Celsius float64 satisfies this
type Float interface {
    ~float32 | ~float64
}

func Sum[T Number](nums []T) T {
    var total T
    for _, n := range nums {
        total += n
    }
    return total
}

Sum([]int{1, 2, 3})           // 6
Sum([]float64{1.5, 2.5})      // 4.0
```

| Symbol | Meaning |
| ---- | ---- |
| `\|` | Union: any listed type satisfies the constraint |
| `~int` | int and every type defined as `type X int` |
| Method in constraint | The type must also implement that method (like a normal interface) |

### 2.3 Constraints with Methods

A constraint can mix type unions and method requirements, or be a plain method-only interface—then it works like Java's `<T extends SomeInterface>`.

```go
type Stringer interface {
    String() string
}

// T must implement String()
func Join[T Stringer](items []T, sep string) string {
    parts := make([]string, len(items))
    for i, it := range items {
        parts[i] = it.String()
    }
    return strings.Join(parts, sep)
}
```

***

## III. Generic Types

Structs, maps, and other type definitions can also take type parameters—this is how you build type-safe containers, like Java's `Stack<T>`.

```go
// A generic stack
type Stack[T any] struct {
    items []T
}

func (s *Stack[T]) Push(v T) {
    s.items = append(s.items, v)
}

func (s *Stack[T]) Pop() (T, bool) {
    if len(s.items) == 0 {
        var zero T               // the zero value of T
        return zero, false
    }
    v := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return v, true
}

// Instantiate with a concrete type
s := &Stack[int]{}
s.Push(1)
s.Push(2)
v, _ := s.Pop()                  // v is int, no assertion needed
```

| Rule | Description |
| ---- | ---- |
| Instantiation | `Stack[int]` — the type argument is required when the compiler cannot infer it |
| Methods | Receiver is written `(s *Stack[T])`; methods may not add **new** type parameters |
| Zero value | `var zero T` is the idiom to get T's zero value |

> 💡 `var zero T` exists because you cannot write `return nil`—T might be `int`, whose zero value is `0`, not nil.

***

## IV. Type Inference

In most calls, the compiler infers the type arguments from the actual arguments, so generic calls look like ordinary calls.

```go
func Map[T, U any](s []T, f func(T) U) []U {
    r := make([]U, len(s))
    for i, v := range s {
        r[i] = f(v)
    }
    return r
}

// Both T (int) and U (string) inferred, no brackets needed
Map([]int{1, 2, 3}, strconv.Itoa)     // []string{"1","2","3"}

// Explicit only when inference is impossible (e.g. no argument mentions T)
zero := Zero[string]()
```

***

## V. The Standard Library: slices and maps

Go 1.21 added generic helper packages—use these instead of hand-writing loops.

```go
import (
    "slices"
    "maps"
)

s := []int{3, 1, 2}
slices.Sort(s)                        // [1 2 3]
slices.Contains(s, 2)                 // true
slices.Index(s, 3)                    // 2
slices.Max(s)                         // 3
slices.Reverse(s)

m := map[string]int{"a": 1, "b": 2}
keys := slices.Collect(maps.Keys(m))  // collect keys into a slice (Go 1.23)
```

| Package | Highlights | Java analogy |
| ---- | ---- | --------- |
| `slices` | `Sort` `Contains` `Index` `Max` `Min` `Reverse` `Equal` | `Collections` / `Arrays` utilities |
| `maps` | `Keys` `Values` `Clone` `Equal` | `Map.keySet()` etc. |
| `cmp` | `Ordered` constraint, `cmp.Compare` | `Comparable` / `Comparator` |

***

## VI. When to Use Generics (and When Not)

| Scenario | Recommendation |
| ---- | ---- |
| Container/collection types (stack, set, tree) | ✅ Generics |
| Slice/map utility functions working on any element type | ✅ Generics |
| The logic differs per type | ❌ Separate functions or interface methods |
| You only call methods on the value | ❌ A plain interface parameter is simpler |
| Only one concrete type today, "might need more later" | ❌ Wait until the second type actually appears |

```go
// ❌ Over-generic: only methods are used, an interface is enough
func PrintAll[T Stringer](items []T) { ... }

// ✅ Simpler and just as flexible
func PrintAll(items []Stringer) { ... }
```

> 💡 Official advice: **write the concrete code first; introduce a type parameter only when you find yourself writing the same body several times.** Go code favors concrete types—generics are a tool, not a default. If you come from Java, resist making every API `<T>`-shaped.
