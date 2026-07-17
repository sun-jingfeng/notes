## I. Go Overview

### 1.1 What Is Go

**Go (also called Golang)** is a **statically typed, compiled** programming language from Google, focused on **simple syntax, native concurrency, and compilation into a single executable**. It is widely used for cloud-native systems, backend services, command-line tools, and infrastructure.

**Core idea:** cover most engineering scenarios with very few language features, and enforce a uniform code style so teams focus on business logic instead of syntax debates.

| Feature | Description |
| ---- | ---- |
| **Statically typed** | Types are resolved at compile time; type errors surface during compilation |
| **Compiled** | Compiles directly to machine code, no virtual machine, fast startup and execution |
| **Single executable** | Statically linked by default; the build artifact is one standalone binary with no runtime dependency |
| **Native concurrency** | `goroutine` and `channel` are language-level features, making concurrency cheap |
| **Built-in GC** | Garbage collection included, no manual memory management |
| **Unified toolchain** | `go build`/`test`/`fmt` are built in; formatting and builds are standardized |

### 1.2 What Go Is Good For

| Area | Typical Use |
| ---- | -------- |
| **Cloud-native / infrastructure** | Docker, Kubernetes, etcd are all written in Go |
| **Backend services** | High-concurrency APIs, microservices, gateways, RPC services |
| **Command-line tools** | CLIs, ops scripts, code generators |
| **Middleware / network programs** | Message queues, proxies, crawlers, long-connection services |

### 1.3 Key Differences from Java

Coming from Java, build an overall mental model first. The differences cluster around the points below, each expanded in later notes.

| Aspect | Java | Go |
| ------ | ---- | -- |
| **Execution** | Compiles to bytecode, runs on the JVM | Compiles directly to machine code, no VM |
| **Type system** | Classes + inheritance | Structs + interfaces (no inheritance, uses composition) |
| **Error handling** | `try-catch` exceptions | Multiple return values with `error`, checked explicitly |
| **Concurrency model** | Threads + locks + thread pools | `goroutine` + `channel` (CSP model) |
| **Dependency management** | Maven / Gradle | `go module` (built in) |
| **Code style** | Team conventions + various formatters | `gofmt` enforces one style, no debate |
| **Visibility control** | `public`/`private` keywords | Determined by identifier's first-letter case |

> 💡 Do not treat Go as "Java lite." Go deliberately drops inheritance, exceptions, and (early on) generics, emphasizing "less is more." Its idioms differ from Java at a fundamental level.

***

## II. Environment Setup

### 2.1 Installing Go

Download the platform package from the official site https://go.dev/dl/, or use a package manager.

```bash
# macOS (Homebrew)
brew install go

# Verify install; printing a version means success
go version
# Example output: go version go1.22.0 darwin/arm64
```

| Command | Purpose |
| ---- | ---- |
| `go version` | Show the Go version |
| `go env` | Show Go environment variable settings |

### 2.2 Key Environment Variables

Since Go 1.11 introduced modules, code no longer must live under `GOPATH`, but a few variables are still worth knowing.

| Variable | Description |
| ---- | ---- |
| `GOROOT` | Go install directory, usually set automatically, no need to change |
| `GOPATH` | Workspace directory, defaults to `~/go`, holds the dependency cache and installed binaries |
| `GOPROXY` | Module proxy address; configuring it speeds up downloads in restricted networks |
| `GO111MODULE` | Whether modules are enabled; defaults to `on` in recent versions, no setup needed |

When dependency downloads are slow, configure a proxy:

```bash
# Set the module proxy (speeds up dependency downloads)
go env -w GOPROXY=https://goproxy.cn,direct
```

### 2.3 Editors

| Editor | Description |
| ------ | ---- |
| **VS Code + Go extension** | Most common; the official Go plugin adds completion, navigation, and formatting |
| **GoLand** | From JetBrains, full-featured, same experience as IntelliJ IDEA |

> 💡 With a Java + IDEA background, GoLand feels the most familiar; choose VS Code if you prefer something lightweight.

***

## III. Your First Go Program

### 3.1 Create a Project and Module

A Go project is organized as a **module**. `go mod init` generates a `go.mod` file that records the module name and dependencies.

```bash
# 1. Create the project directory
mkdir hello && cd hello

# 2. Initialize the module (example/hello is the module path, customizable)
go mod init example/hello
# Generates the go.mod file
```

The generated `go.mod`:

```go
module example/hello

go 1.22
```

| Field | Description |
| ---- | ---- |
| `module` | Module path, used as the root for package imports |
| `go` | Minimum Go version this module requires |

### 3.2 Write the Code

Create `main.go`:

```go
// package declares the package this file belongs to; an executable's entry package must be named main
package main

// import the standard library fmt (formatted I/O)
import "fmt"

// main is the program entry point; an executable package must have exactly one
func main() {
    fmt.Println("Hello, Go!")
}
```

| Element | Description |
| ---- | ---- |
| `package main` | Declares the package name; the `main` package compiles into an executable |
| `import "fmt"` | Imports a standard library package; an unused import is a compile error |
| `func main()` | Program entry function, no parameters and no return values |
| `fmt.Println` | Prints with a trailing newline |

> **Note**: Go enforces that **imported packages must be used** and **declared local variables must be used**, otherwise compilation fails outright. This is a clear difference from Java, meant to keep code clean.

### 3.3 Run and Build

```bash
# Option 1: run directly (compiles to a temp dir and runs; good for development)
go run main.go

# Option 2: compile into an executable
go build            # produces an executable "hello" in the current directory
./hello             # run it

# Option 3: compile and install into GOPATH/bin
go install
```

| Command | Purpose | Java analogy |
| ---- | ---- | --------- |
| `go run` | Compile and run immediately, no persistent file | Like running source in one step |
| `go build` | Compile into an executable | Like packaging into a runnable jar |
| `go install` | Compile and install into the bin directory | Like installing into the local repo for command use |

***

## IV. The Go Toolchain

### 4.1 Common Commands

Go bundles building, testing, formatting, and more into the `go` command, so no extra tools are needed.

| Command | Purpose |
| ---- | ---- |
| `go run` | Compile and run |
| `go build` | Build the project |
| `go test` | Run unit tests |
| `go fmt` | Format code to the official style |
| `go vet` | Static analysis to flag suspicious code |
| `go mod tidy` | Tidy dependencies, adding missing and removing unused ones |
| `go get` | Add or upgrade a dependency |
| `go doc` | View documentation for a package or symbol |

### 4.2 gofmt: Enforced Code Style

**gofmt** is Go's built-in code formatter. Indentation, alignment, and brace placement all have a single correct answer.

```bash
# Format all .go files in the current directory tree and write back
go fmt ./...
```

| Aspect | Java | Go |
| ---- | ---- | -- |
| Indentation style | Per-team convention (spaces/tabs, 4/2 width) | Uniform tabs, no debate |
| Formatting tool | Need checkstyle / spotless, etc. | Built-in `gofmt`, format on save |

> 💡 The Go community has essentially no "style wars" because `gofmt` gives the one canonical answer. Build the habit of formatting on save.

### 4.3 Packages and Directory Structure

Go organizes code into **packages**: a directory is a package, and files within a package share one namespace.

```
    hello/                  # module root
        │
        ├── go.mod          # module definition file
        ├── main.go         # package main, program entry
        │
        └── utils/          # subdirectory = subpackage
                └── str.go  # package utils
```

| Rule | Description |
| ---- | ---- |
| **One directory, one package** | All `.go` files in a directory must declare the same package name |
| **Package name should match the directory** | Easier to understand and import |
| **The `main` package builds an executable** | Other package names build libraries and cannot run directly |
| **Import by module path** | e.g. `import "example/hello/utils"` |
