## I. Apifox

### 1.1 Introduction

**Apifox** is a collaborative API development platform that combines API documentation, API debugging, API mocking, and automated API testing.

> 💡 Think of it as: **Apifox = Postman + Swagger + Mock + JMeter**

**Why use Apifox?**

| Scenario | Description |
| ---------- | -------------------- |
| 🔧 API debugging | Quickly test whether a backend API works after implementing it |
| 📝 API documentation | Automatically generate standardized API documentation for frontend/backend collaboration |
| 🎭 Mock data | Let the frontend develop with simulated data before the backend is ready |
| ✅ Automated testing | Run test cases in batches to ensure API quality |

***

### 1.2 Installation and Usage

#### Download and Install

*   Official website: <https://apifox.com/>
*   Supports Windows, Mac, and Linux
*   A web version is also available (no installation required)

#### Interface Overview

    ┌─────────────────────────────────────────────────────────────────────────┐
    │  Apifox                                                    👤 Log in    │
    ├─────────────┬───────────────────────────────────────────────────────────┤
    │             │                                                           │
    │  📁 Projects │   GET  ▼  │ http://localhost:8080/api/users    │  Send  │
    │             │  ─────────────────────────────────────────────────────── │
    │  ├─ Users   │   Params │ Headers │ Body │ Auth │ Pre │ Post │        │
    │  │  ├─ Query│  ─────────────────────────────────────────────────────── │
    │  │  ├─ Add  │                                                          │
    │  │  ├─ Edit │   Response 200 OK  ⏱ 45ms                                │
    │  │  └─ Delete│  ┌──────────────────────────────────────────────────┐  │
    │  │          │   │ {                                                  │  │
    │  ├─ Depts   │   │   "code": 1,                                      │  │
    │  │          │   │   "msg": "success",                                │  │
    │  └─ ...     │   │   "data": [...]                                    │  │
    │             │   │ }                                                  │  │
    │             │   └──────────────────────────────────────────────────┘  │
    └─────────────┴───────────────────────────────────────────────────────────┘

***

### 1.3 Sending Requests

#### Request Types and Uses

| Method | Purpose | Request body | Example |
| ---------- | -------- | ------ | ----------------------------- |
| **GET** | Query resources | ❌ None | `GET /users` or `GET /users/1` |
| **POST** | Create a resource | ✅ JSON | `POST /users` |
| **PUT** | Update a resource (full replacement) | ✅ JSON | `PUT /users/1` |
| **PATCH** | Update a resource (partially) | ✅ JSON | `PATCH /users/1` |
| **DELETE** | Delete a resource | ❌ None | `DELETE /users/1` |

#### GET Request Example

    Method: GET
    URL: http://localhost:8080/api/users

    ┌─ Params ──────────────────────────────────────────┐
    │  Key          │  Value                            │
    ├───────────────┼───────────────────────────────────┤
    │  page         │  1                                │
    │  size         │  10                               │
    │  name         │  张三                              │
    └───────────────┴───────────────────────────────────┘

    Actual request: GET /api/users?page=1&size=10&name=张三

#### POST Request Example (JSON)

    Method: POST
    URL: http://localhost:8080/api/users

    ┌─ Headers ─────────────────────────────────────────┐
    │  Content-Type  │  application/json                │
    └────────────────┴──────────────────────────────────┘

    ┌─ Body (raw - JSON) ───────────────────────────────┐
    │  {                                                │
    │      "name": "张三",                               │
    │      "age": 20,                                   │
    │      "email": "zhangsan@example.com",             │
    │      "deptId": 1                                  │
    │  }                                                │
    └───────────────────────────────────────────────────┘

#### DELETE Request Example

**Approach 1: Path Parameter**

    DELETE http://localhost:8080/api/users/1

    Description: Delete the user with ID 1

**Approach 2: Query Parameter**

    DELETE http://localhost:8080/api/users?id=1

    Description: Pass the ID through a query parameter

***

### 1.4 Inspecting Responses

#### Common Status Codes

| Status code | Meaning | Description |
| ----- | --------------------- | -------- |
| `200` | OK | Request succeeded |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid request parameters |
| `401` | Unauthorized | Unauthenticated (not logged in) |
| `403` | Forbidden | Access denied |
| `404` | Not Found | Resource does not exist |
| `405` | Method Not Allowed | Request method is unsupported |
| `500` | Internal Server Error | Internal server error |

***

## II. Nginx

### 2.1 Introduction

**Nginx** (pronounced "engine-x") is a high-performance HTTP and reverse proxy server that can also act as a mail proxy server.

**Key features:**

| Feature | Description |
| ------- | ------------------------ |
| ⚡ High performance | Handles many concurrent connections with low memory usage |
| 🔄 Reverse proxy | Hides backend servers behind a unified entry point |
| ⚖️ Load balancing | Distributes requests across multiple servers |
| 📁 Static resources | Efficiently serves static files (HTML, CSS, JS, images) |
| 🔒 Security | Supports SSL/TLS encryption |

**Use cases:**

    ┌─────────────────────────────────────────────────────────────────────────┐
    │                              Internet users                             │
    └─────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                            Nginx server                                 │
    │  ┌─────────────────────────────────────────────────────────────────┐   │
    │  │  • Reverse proxy                                                │   │
    │  │  • Load balancing                                               │   │
    │  │  • Static resource serving                                      │   │
    │  │  • SSL termination                                              │   │
    │  └─────────────────────────────────────────────────────────────────┘   │
    └───────────┬─────────────────────┬─────────────────────┬─────────────────┘
                │                     │                     │
                ▼                     ▼                     ▼
        ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
        │  Backend 1    │     │  Backend 2    │     │  Backend 3    │
        │  (Tomcat)     │     │  (Tomcat)     │     │  (Tomcat)     │
        └───────────────┘     └───────────────┘     └───────────────┘

***

### 2.2 Installation and Startup

#### Windows Installation

    1. Download: http://nginx.org/en/download.html
    2. Extract to any directory (avoid Chinese characters in the path)
    3. Directory structure:
       nginx/
       ├── conf/           # Configuration directory
       │   └── nginx.conf  # Main configuration file
       ├── html/           # Static resource directory
       ├── logs/           # Log directory
       └── nginx.exe       # Executable

#### Common Commands

```bash
# Start Nginx (run from the nginx directory)
start nginx

# Or double-click nginx.exe

# Stop Nginx
nginx -s stop      # Stop immediately
nginx -s quit      # Shut down gracefully (finish current requests)

# Reload configuration (after changing it)
nginx -s reload

# Check configuration syntax
nginx -t

# Display the version
nginx -v
```

#### Verify the Installation

    After startup, visit: http://localhost:80
    The "Welcome to nginx!" page indicates a successful installation

***

### 2.3 Main Configuration File

#### Configuration File Location

    nginx/conf/nginx.conf

#### Configuration Structure Overview

```nginx
# Global configuration
worker_processes  1;                    # Number of worker processes

# Event configuration
events {
    worker_connections  1024;           # Maximum connections per process
}

# HTTP configuration
http {
    include       mime.types;           # Include MIME types
    default_type  application/octet-stream;

    # Log format
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" ';

    # Server configuration (multiple servers can be configured)
    server {
        listen       80;                # Listening port
        server_name  localhost;         # Server name

        # Routing configuration
        location / {
            root   html;                # Static resource root directory
            index  index.html;          # Default index page
        }

        # Error page
        error_page   500 502 503 504  /50x.html;
    }
}
```

***

### 2.4 Deploying Static Resources

#### Deploy a Frontend Project

**① Put the frontend files in the html directory:**

    nginx/
    └── html/
        ├── index.html
        ├── css/
        │   └── style.css
        ├── js/
        │   └── app.js
        └── images/
            └── logo.png

**② Configure nginx.conf:**

```nginx
server {
    listen       80;
    server_name  localhost;

    location / {
        root   html;              # Static resource directory
        index  index.html;        # Default index page
    }
}
```

**③ Reload the configuration:**

```bash
nginx -s reload
```

**④ Visit:**

    http://localhost:80

***

### 2.5 Reverse Proxy

#### What Is a Reverse Proxy?

    ┌─────────────────────────────────────────────────────────────────────────┐
    │  Forward proxy (acts on behalf of clients)                               │
    │                                                                         │
    │  Client ──▶ Proxy server ──▶ Target server                               │
    │  (Knows the target)  (Accesses it for the client)                         │
    │                                                                         │
    │  Examples: VPNs, accessing restricted websites                           │
    ├─────────────────────────────────────────────────────────────────────────┤
    │  Reverse proxy (acts on behalf of servers)                               │
    │                                                                         │
    │  Client ──▶ Proxy server ──▶ Backend server                              │
    │  (Does not know the backend)  (Forwards requests)                        │
    │                                                                         │
    │  Example: Nginx reverse proxy                                           │
    └─────────────────────────────────────────────────────────────────────────┘

#### Reverse Proxy Configuration

**Scenario: Forward `/api` requests to a backend Tomcat server**

```nginx
server {
    listen       80;
    server_name  localhost;

    # Frontend static resources
    location / {
        root   html;
        index  index.html;
    }

    # Reverse proxy: forward /api requests to the backend
    location /api {
        proxy_pass http://localhost:8080;    # Backend server address

        # Set request headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Request flow:**

    User visits: http://localhost/api/users
             ↓
    Nginx matches location /api
             ↓
    Forward to: http://localhost:8080/api/users
             ↓
    The backend processes the request and returns the result
             ↓
    Nginx returns the result to the user

***

### 2.6 Load Balancing

#### What Is Load Balancing?

Load balancing distributes requests across multiple backend servers to improve system concurrency and availability.

                        ┌─────────────────┐
                        │     Nginx       │
                        │  Load balancer  │
                        └────────┬────────┘
                                 │
               ┌─────────────────┼─────────────────┐
               ▼                 ▼                 ▼
        ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
        │  Tomcat 1   │   │  Tomcat 2   │   │  Tomcat 3   │
        │  :8081      │   │  :8082      │   │  :8083      │
        └─────────────┘   └─────────────┘   └─────────────┘

#### Load Balancing Configuration

```nginx
# Define a backend server group
upstream backend {
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
    server 127.0.0.1:8083;
}

server {
    listen       80;
    server_name  localhost;

    location /api {
        proxy_pass http://backend;    # Use the server group name
    }
}
```

#### Load Balancing Strategies

| Strategy | Configuration | Description |
| ----------- | ------------- | ---------------- |
| **Round robin (default)** | No configuration required | Distribute requests sequentially |
| **Weighted** | `weight=n` | Distribute in proportion to weights; higher weights receive more requests |
| **IP Hash** | `ip_hash;` | Requests from the same IP go to the same server |
| **Least connections** | `least_conn;` | Prefer the server with the fewest connections |

**Weighted configuration example:**

```nginx
upstream backend {
    server 127.0.0.1:8081 weight=3;    # Weight 3: receives more requests
    server 127.0.0.1:8082 weight=2;    # Weight 2
    server 127.0.0.1:8083 weight=1;    # Weight 1
}
```

**IP Hash configuration example:**

```nginx
upstream backend {
    ip_hash;                           # Enable IP Hash
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
    server 127.0.0.1:8083;
}
```

***

### 2.7 Complete Configuration Example

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile      on;
    keepalive_timeout  65;

    # Backend server group
    upstream backend {
        server 127.0.0.1:8081 weight=2;
        server 127.0.0.1:8082 weight=1;
    }

    server {
        listen       80;
        server_name  localhost;

        # Frontend static resources
        location / {
            root   html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;  # Support frontend routing
        }

        # Reverse proxy + load balancing
        location /api {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_connect_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Error page
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

***

### 2.8 Common Issues

| Issue | Solution |
| ------ | -------------------------- |
| Port already in use | Change the `listen` port or stop the program using it |
| Configuration does not take effect | Run `nginx -s reload` to reload it |
| Requests return 404 | Check the `root` path and whether the file exists |
| Proxy timeout | Increase `proxy_read_timeout` |
| Error after changing configuration | Run `nginx -t` to check the syntax first |

***

## III. Logging

### 3.1 Logging Overview

#### What Is a Log?

A **log** records information generated while a program runs, for:

*   🔍 **Troubleshooting**: Quickly locate bugs and exceptions
*   📊 **Performance monitoring**: Analyze system bottlenecks
*   📝 **Activity auditing**: Record user operations
*   📈 **Data analysis**: Track business metrics

#### Why Not Use System.out.println()?

```java
// ❌ Not recommended
System.out.println("User logged in successfully");

// ✅ Use a logging framework instead
log.info("User logged in successfully");
```

**Comparison:**

| Aspect | System.out | Logging framework |
| -------- | ---------- | ----------------------------- |
| **Output destination** | Console only | Console, files, databases, remote servers |
| **Log levels** | ❌ None | ✅ TRACE/DEBUG/INFO/WARN/ERROR |
| **Format control** | ❌ None | ✅ Timestamp, class name, thread, line number, etc. |
| **Enable/disable control** | ❌ Cannot be disabled | ✅ Enable/disable by level or package |
| **Performance impact** | Synchronous and blocking; poor performance | Asynchronous writes; good performance |
| **File archiving** | ❌ Unsupported | ✅ Automatic archiving by date/size |

***

### 3.2 Java Logging Framework Architecture

    ┌─────────────────────────────────────────────────────────────────────┐
    │                         Application code                            │
    │                    log.info("Business log");                        │
    └─────────────────────────────┬───────────────────────────────────────┘
                                  │
    ┌─────────────────────────────▼───────────────────────────────────────┐
    │                       Logging facade (interface layer)              │
    │        SLF4J (Simple Logging Facade for Java) ← Mainstream           │
    └─────────────────────────────┬───────────────────────────────────────┘
                                  │
    ┌─────────────────────────────▼───────────────────────────────────────┐
    │                       Logging implementation layer                  │
    │        Logback      ← Spring Boot default; best performance         │
    │        Log4j2       ← From Apache; feature-rich                     │
    └─────────────────────────────────────────────────────────────────────┘

> 💡 **Spring Boot uses SLF4J + Logback by default**, with no additional dependencies needed

***

### 3.3 Getting Started with Logback

#### Obtain a Logger Object

**Approach 1: Create It with LoggerFactory**

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/users")
    public Result list() {
        log.info("Query all users");
        return Result.success(userService.list());
    }
}
```

**Approach 2: @Slf4j Annotation (Recommended)**

```java
import lombok.extern.slf4j.Slf4j;

@Slf4j  // Lombok generates the log object automatically
@RestController
public class UserController {

    @GetMapping("/users")
    public Result list() {
        log.info("Query all users");
        return Result.success(userService.list());
    }
}
```

#### Logging Methods

```java
log.trace("trace - Most detailed tracing information");
log.debug("debug - Debugging information");
log.info("info - General information");
log.warn("warn - Warning information");
log.error("error - Error information");
```

#### Placeholder Syntax

```java
// ✅ Recommended: use {} placeholders
log.info("User {} logged in successfully", username);
log.info("Query user, ID = {}, result: {}", id, user);

// ❌ Not recommended: string concatenation
log.info("User " + username + " logged in successfully");

// ✅ Print the exception stack trace
try {
    // ...
} catch (Exception e) {
    log.error("Operation failed: {}", e.getMessage(), e);
}
```

***

### 3.4 Logback Log Levels

#### Level Definitions

    TRACE  <  DEBUG  <  INFO  <  WARN  <  ERROR
      │        │        │        │        │
      │        │        │        │        └── Error: program exception requiring immediate attention
      │        │        │        └── Warning: potential issue that may cause an error
      │        │        └── Info: normal business workflow (default level)
      │        └── Debug: development and debugging information
      └── Trace: the most detailed diagnostic information

#### Level Rules

**Once a level is configured, only logs at or above that level are output**

    Example: set level = INFO

    log.trace("...")  →  ❌ Not output
    log.debug("...")  →  ❌ Not output
    log.info("...")   →  ✅ Output
    log.warn("...")   →  ✅ Output
    log.error("...")  →  ✅ Output

#### Use Cases for Each Level

| Level | Use case | Example |
| --------- | --------- | ----------- |
| **TRACE** | Extremely detailed diagnostics | Every iteration of a loop |
| **DEBUG** | Development and debugging information | Method arguments, SQL statements |
| **INFO** | Key points in business workflows | User login, order creation |
| **WARN** | Potential issues | Invalid parameters, retries |
| **ERROR** | Program errors | Caught exceptions, business operation failures |

#### Configure Log Levels

```yaml
logging:
  level:
    root: INFO                            # Global level
    com.example: DEBUG                    # Project code
    com.example.mapper: DEBUG             # Mapper layer (shows SQL)
```

***

### 3.5 Logback Configuration in Detail

#### Configuration File Location

    src/main/resources/logback-spring.xml

#### Complete Configuration Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="30 seconds">

    <!-- Property definitions -->
    <property name="LOG_PATH" value="logs"/>
    <property name="APP_NAME" value="project"/>
    <property name="LOG_PATTERN"
              value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n"/>

    <!-- Console output -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>

    <!-- File output -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_PATH}/${APP_NAME}.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${LOG_PATH}/${APP_NAME}.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <maxFileSize>100MB</maxFileSize>
            <maxHistory>30</maxHistory>
            <totalSizeCap>3GB</totalSizeCap>
        </rollingPolicy>
        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>

    <!-- Separate output for error logs -->
    <appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_PATH}/${APP_NAME}-error.log</file>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${LOG_PATH}/${APP_NAME}-error.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <maxFileSize>100MB</maxFileSize>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>

    <!-- Development environment -->
    <springProfile name="dev">
        <root level="DEBUG">
            <appender-ref ref="CONSOLE"/>
        </root>
        <logger name="com.example.mapper" level="DEBUG"/>
    </springProfile>

    <!-- Production environment -->
    <springProfile name="prod">
        <root level="INFO">
            <appender-ref ref="CONSOLE"/>
            <appender-ref ref="FILE"/>
            <appender-ref ref="ERROR_FILE"/>
        </root>
    </springProfile>

</configuration>
```

#### Key Elements

| Element | Description |
| ----------------- | ------------------- |
| `<property>` | Define a variable and reference it with `${variableName}` |
| `<appender>` | Log output destination (console, file, etc.) |
| `<encoder>` | Log format encoder |
| `<rollingPolicy>` | Rolling policy (archive by date/size) |
| `<filter>` | Log filter |
| `<logger>` | Set the log level for a package/class |
| `<root>` | Root logger configuration |
| `<springProfile>` | Environment-specific configuration |

#### Log Format Placeholders

| Placeholder | Description | Example output |
| ------------- | -------- | ------------------------- |
| `%d{pattern}` | Date and time | `2024-01-15 10:30:45.123` |
| `%thread` | Thread name | `http-nio-8080-exec-1` |
| `%-5level` | Log level | `INFO ` |
| `%logger{n}` | Logger name | `c.e.c.UserController` |
| `%msg` | Log message | `User query succeeded` |
| `%n` | Line break | - |

***

### 3.6 Log Output Example

    2024-01-15 10:30:45.123 [http-nio-8080-exec-1] INFO  c.e.controller.UserController - Query all users
    2024-01-15 10:30:45.156 [http-nio-8080-exec-1] DEBUG c.e.mapper.UserMapper - ==>  Preparing: SELECT * FROM user
    2024-01-15 10:30:45.178 [http-nio-8080-exec-1] DEBUG c.e.mapper.UserMapper - ==> Parameters:
    2024-01-15 10:30:45.198 [http-nio-8080-exec-1] DEBUG c.e.mapper.UserMapper - <==      Total: 10

***

### 3.7 Best Practices

```java
@Slf4j
@Service
public class OrderService {

    public Order createOrder(OrderDTO dto) {
        // ✅ Method entry: log key parameters
        log.info("Start creating order, user ID: {}", dto.getUserId());

        // ✅ Debugging information
        log.debug("Detailed order parameters: {}", dto);

        // ✅ Business warning
        if (dto.getQuantity() > 100) {
            log.warn("Abnormal order quantity: {}", dto.getQuantity());
        }

        try {
            // Business logic...
            log.info("Order created successfully, order number: {}", order.getOrderNo());
            return order;
        } catch (Exception e) {
            // ✅ Exception handling: log the error information and stack trace
            log.error("Failed to create order: {}", e.getMessage(), e);
            throw new BusinessException("Order creation failed");
        }
    }
}
```

***

### 3.8 Simple Configuration (application.yml)

```yaml
logging:
  level:
    root: INFO
    com.example: DEBUG
    com.example.mapper: DEBUG
  file:
    name: logs/app.log
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{50} - %msg%n"
  logback:
    rollingpolicy:
      max-file-size: 100MB
      max-history: 30
```

***

## IV. Summary

| Tool/technology | Purpose | Core features |
| ----------- | -------- | --------------- |
| **Apifox** | API testing tool | Send requests, debug APIs, generate documentation |
| **Nginx** | Web server | Static resources, reverse proxy, load balancing |
| **Logback** | Logging framework | Record program execution information for troubleshooting |
