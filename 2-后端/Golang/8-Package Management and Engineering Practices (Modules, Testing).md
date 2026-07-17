## I. Packages and Visibility

### 1.1 Organizing Packages

Go organizes code into **packages**: **a directory is a package**, and all `.go` files in a directory must declare the same package name.

```go
// file utils/str.go
package utils

func Reverse(s string) string { /* ... */ }
```

```go
// file main.go, import and use the utils package
package main

import (
    "fmt"
    "example/demo/utils"        // module path + subdirectory
)

func main() {
    fmt.Println(utils.Reverse("abc"))
}
```

| Rule | Description |
| ---- | ---- |
| **One directory, one package** | Files in a directory must share the package name |
| **Import path** | Module path + relative directory, not the file name |
| **The `main` package** | Compiles to an executable, contains `main` |

### 1.2 Visibility via First-Letter Case

Go has no `public`/`private` keywords: **an identifier starting with an uppercase letter is exported (visible outside the package); lowercase is package-private**. This applies to functions, variables, constants, types, and struct fields.

```go
package utils

func Export() {}        // uppercase, accessible outside the package (exported)
func internal() {}      // lowercase, accessible only within the package

type User struct {
    Name string         // uppercase, exported field
    age  int            // lowercase, private field
}
```

| Aspect | Java | Go |
| ---- | ---- | -- |
| Public | `public` keyword | Uppercase first letter |
| Private | `private` keyword | Lowercase first letter |
| Granularity | Class/method/field level | Package level (lowercase = package-visible) |

> 💡 Go has no Java-style "class-private" concept; visibility is bounded by the **package**. Lowercase identifiers are accessible from any file within the same package.

***

## II. go module Dependency Management

### 2.1 Initializing a Module

A **module** is Go's unit of dependency management. `go mod init` generates `go.mod` recording the module path, Go version, and dependencies.

```bash
# Initialize a module; example/demo is the module path
go mod init example/demo
```

The generated `go.mod`:

```go
module example/demo

go 1.22
```

### 2.2 Adding and Managing Dependencies

```bash
# Add/upgrade a dependency (downloads and writes to go.mod)
go get github.com/google/uuid

# Upgrade to the latest version
go get -u github.com/google/uuid

# Tidy dependencies: add missing, remove unused (most common)
go mod tidy

# Download dependencies into the local cache
go mod download
```

| Command | Purpose | Maven analogy |
| ---- | ---- | ---------- |
| `go mod init` | Initialize a module | Create `pom.xml` |
| `go get` | Add/upgrade a dependency | Add a `<dependency>` |
| `go mod tidy` | Tidy dependencies | Clean up unused dependencies |
| `go.mod` | Dependency declaration file | `pom.xml` |
| `go.sum` | Dependency checksums (integrity) | Locked hash verification |

### 2.3 go.mod and go.sum

| File | Purpose |
| ---- | ---- |
| `go.mod` | Declares the module path, Go version, and direct/indirect dependency versions |
| `go.sum` | Records dependency checksums, ensuring dependencies are not tampered with |

> **Note**: Commit both `go.mod` and `go.sum` to version control. `go.sum` guarantees that teammates and CI pull the exact same dependencies as you.

***

## III. Project Structure

### 3.1 A Typical Layout

Go does not enforce a directory structure; the community commonly uses the layout below for medium-to-large projects:

```
    myapp/
        │
        ├── go.mod              # module definition
        ├── go.sum              # dependency checksums
        ├── main.go             # program entry (or under cmd/)
        │
        ├── cmd/                # entry points for each executable
        │       └── server/
        │               └── main.go
        │
        ├── internal/           # private packages, importable only by this module
        │       └── service/
        │
        ├── pkg/                # public packages reusable by external projects
        │
        └── configs/            # configuration files
```

| Directory | Purpose |
| ---- | ---- |
| `cmd/` | The `main` entry point of each executable |
| `internal/` | Private packages, **importable only within this module** (enforced by Go) |
| `pkg/` | Reusable library code for external use |
| `configs/` | Configuration files |

> 💡 `internal/` is a special Go mechanism: packages under `internal` can only be imported by code rooted at its parent directory, and external modules cannot reference them—used to hide internal implementation. Small projects need not adopt the full structure; simplify as needed.

***

## IV. Unit Testing

### 4.1 Test File Conventions

Go has a built-in `testing` framework, no third-party library required. The conventions:

| Convention | Rule |
| ---- | ---- |
| **File name** | Ends with `_test.go`, e.g. `str_test.go` |
| **Function name** | Starts with `Test`, takes `*testing.T` |
| **Same package** | The test file sits in the same directory and package as the code under test |

```go
// code under test math.go
package mathutil

func Add(a, b int) int {
    return a + b
}
```

```go
// test file math_test.go
package mathutil

import "testing"

// test function: starts with Test, takes *testing.T
func TestAdd(t *testing.T) {
    got := Add(2, 3)
    want := 5
    if got != want {
        // report failure but continue; Fatalf would stop immediately
        t.Errorf("Add(2,3) = %d; want %d", got, want)
    }
}
```

### 4.2 Running Tests

```bash
# Run tests in the current directory
go test

# Verbose output
go test -v

# Run tests in all subpackages
go test ./...

# With coverage
go test -cover
```

| Method | Purpose |
| ---- | ---- |
| `t.Errorf(...)` | Report failure and continue |
| `t.Fatalf(...)` | Report failure and stop the current test immediately |
| `t.Log(...)` | Output a log (visible with `-v`) |

### 4.3 Table-Driven Tests

The Go community favors **table-driven tests**: list multiple inputs and expectations in a slice and loop over them—concise and easy to extend.

```go
func TestAdd(t *testing.T) {
    // define the table of test cases
    cases := []struct {
        name     string
        a, b     int
        want     int
    }{
        {"positives", 2, 3, 5},
        {"with zero", 0, 5, 5},
        {"negatives", -1, -2, -3},
    }

    for _, c := range cases {
        // t.Run creates a subtest per case, so failures are easy to locate
        t.Run(c.name, func(t *testing.T) {
            if got := Add(c.a, c.b); got != c.want {
                t.Errorf("Add(%d,%d) = %d; want %d", c.a, c.b, got, c.want)
            }
        })
    }
}
```

### 4.4 Benchmarks

A function whose name starts with `Benchmark` and takes `*testing.B` is used for performance testing.

```go
func BenchmarkAdd(b *testing.B) {
    // b.N is auto-adjusted by the framework; loop over the code under test
    for i := 0; i < b.N; i++ {
        Add(2, 3)
    }
}
```

```bash
# Run benchmarks
go test -bench=.
```

| Aspect | Java (JUnit) | Go (testing) |
| ---- | ------------- | ------------- |
| Framework | Requires a JUnit dependency | Built into the standard library |
| Assertions | `assertEquals`, etc. | Manual `if` + `t.Errorf` (or use testify) |
| Running | IDE / Maven | `go test` |
| Performance testing | Requires JMH | Built-in `Benchmark` |

***

## V. Standard Library Quick Reference

The Go standard library is broad and works out of the box. Common packages:

| Package | Purpose |
| ---- | ---- |
| `fmt` | Formatted I/O |
| `strings` | String processing |
| `strconv` | String/number conversion |
| `errors` | Creating, wrapping, inspecting errors |
| `time` | Time and timers |
| `os` | Files, environment variables, processes |
| `io` / `bufio` | I/O interfaces and buffered read/write |
| `encoding/json` | JSON serialization and deserialization |
| `net/http` | HTTP client and server |
| `sync` | Concurrency synchronization primitives |
| `context` | Concurrency context and cancellation |
| `sort` | Sorting |

### 5.1 JSON Example

`encoding/json` uses struct tags to control JSON field mapping.

```go
type User struct {
    Name  string `json:"name"`            // tag specifies the JSON field name
    Age   int    `json:"age"`
    Email string `json:"email,omitempty"` // omitempty: omit the field when empty
}

// Serialize: struct → JSON bytes
u := User{Name: "Tom", Age: 18}
data, _ := json.Marshal(u)
fmt.Println(string(data))                 // {"name":"Tom","age":18}

// Deserialize: JSON → struct
var u2 User
json.Unmarshal([]byte(`{"name":"Jerry","age":20}`), &u2)
fmt.Println(u2.Name)                      // Jerry
```

| Function | Purpose | Java analogy |
| ---- | ---- | --------- |
| `json.Marshal` | Struct to JSON | Jackson `writeValueAsString` |
| `json.Unmarshal` | JSON to struct | Jackson `readValue` |
| Struct tag | Control field mapping | `@JsonProperty` annotation |

> 💡 Whether a struct field is serializable depends on whether it is **exported (uppercase first letter)**; `encoding/json` ignores lowercase fields.
