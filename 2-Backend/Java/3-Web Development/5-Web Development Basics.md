## I. Spring MVC and HTTP Basics

### 1.1 Spring MVC Overview

**Spring MVC** is Spring Framework's web module, built around the Model–View–Controller pattern.

*   **Model:** The application's data model and business data.
*   **View:** Presents data; separate frontend/backend applications commonly return JSON.
*   **Controller:** Handles requests and invokes business logic.

#### Core Components

| Component | Purpose |
| --------------------- | ----------------------------------------------- |
| **DispatcherServlet** | Front controller for requests handled by Spring MVC |
| **HandlerMapping** | Finds the handler, such as a Controller method, for a request |
| **HandlerAdapter** | Invokes the selected handler |
| **Controller** | Handles application requests |
| **ViewResolver** | Resolves views; less commonly used for JSON APIs |

#### Request Processing

    1. The client sends a request
           ↓
    2. DispatcherServlet receives it
           ↓
    3. HandlerMapping locates the handler (Controller method)
           ↓
    4. HandlerAdapter invokes the handler
           ↓
    5. The Controller processes the request and returns data
           ↓
    6. @ResponseBody enables response-body serialization, commonly as JSON
           ↓
    7. The response reaches the client

> 💡 `spring-boot-starter-web` provides Spring MVC auto-configuration, so you can begin by writing Controllers.

***

### 1.2 HTTP Basics

**HTTP (HyperText Transfer Protocol)** defines how clients and servers exchange messages.

**Characteristics:**

*   HTTP/1.1 and HTTP/2 use TCP; HTTPS protects the connection with encryption. Plain HTTP does not encrypt its messages.
*   Uses a request–response model
*   Is stateless

#### Request Format

    ┌──────────────────────────────────────────────────┐
    │ Request line  POST /api/users HTTP/1.1           │
    ├──────────────────────────────────────────────────┤
    │ Headers       Host: localhost:8080               │
    │               Content-Type: application/json     │
    │               Authorization: Bearer token...     │
    ├──────────────────────────────────────────────────┤
    │ Blank line                                       │
    ├──────────────────────────────────────────────────┤
    │ Body          {"name": "张三", "age": 20}        │
    └──────────────────────────────────────────────────┘

#### HTTP Methods

| Method | Typical purpose | Typical request body | Idempotent? |
| ---------- | ---------------- | ------ | ------ |
| **GET** | Retrieve a resource | ❌ | ✅ |
| **POST** | Create a resource | ✅ | ❌ |
| **PUT** | Replace a resource | ✅ | ✅ |
| **PATCH** | Partially modify a resource | ✅ | Depends on the patch operation |
| **DELETE** | Delete a resource | ❌ | ✅ |

#### Response Format

    ┌────────────────────────────────────────────────────────────┐
    │ Status line   HTTP/1.1 200 OK                              │
    ├────────────────────────────────────────────────────────────┤
    │ Headers       Content-Type: application/json;charset=UTF-8 │
    │               Content-Length: 56                           │
    ├────────────────────────────────────────────────────────────┤
    │ Blank line                                                 │
    ├────────────────────────────────────────────────────────────┤
    │ Body          {"code": 1, "msg": "success", "data": {...}} │
    └────────────────────────────────────────────────────────────┘

#### Common Status Codes

| Status | Name | Meaning |
| ------ | --------------------- | -------------- |
| `200` | OK | Request succeeded |
| `201` | Created | Resource created |
| `400` | Bad Request | Invalid request |
| `401` | Unauthorized | Authentication required or failed |
| `403` | Forbidden | Access denied |
| `404` | Not Found | Resource not found |
| `405` | Method Not Allowed | HTTP method not supported here |
| `500` | Internal Server Error | Server-side failure |

***

## II. Request Mapping and RESTful APIs

### 2.1 @RequestMapping in Detail

`@RequestMapping` is Spring MVC's core annotation for **mapping HTTP requests to Controller methods**.

**Basic usage:**

```java
@RestController
@RequestMapping("/user")  // Class-level prefix shared by all methods
public class UserController {

    @RequestMapping("/list")  // Complete path: /user/list
    public List<User> list() {
        return userService.findAll();
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Result add(@RequestBody User user) {
        return Result.success();
    }
}
```

**Common attributes:**

| Attribute | Purpose | Example |
| ------------ | ------------------------ | ------------------------------------------- |
| `value/path` | Request path; the attribute name may be omitted | `@RequestMapping("/user")` |
| `method` | HTTP method | `method = RequestMethod.GET` |
| `params` | Request parameter condition | `params = "id"` requires an id parameter |
| `headers` | Request header condition | `headers = "Content-Type=application/json"` |
| `consumes` | Request Content-Type | `consumes = "application/json"` |
| `produces` | Response Content-Type | `produces = "application/json"` |

***

### 2.2 Composed Mapping Annotations (Recommended)

Spring 4.3+ provides concise method-specific annotations:

| Annotation | Equivalent | Typical use |
| ---------------- | ------------------------------------------------ | ------------ |
| `@GetMapping` | `@RequestMapping(method = RequestMethod.GET)` | Query |
| `@PostMapping` | `@RequestMapping(method = RequestMethod.POST)` | Create |
| `@PutMapping` | `@RequestMapping(method = RequestMethod.PUT)` | Replace |
| `@PatchMapping` | `@RequestMapping(method = RequestMethod.PATCH)` | Partial update |
| `@DeleteMapping` | `@RequestMapping(method = RequestMethod.DELETE)` | Delete |

**Recommended usage:**

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping                    // GET /api/users
    public Result list() {
        return Result.success(userService.list());
    }

    @GetMapping("/{id}")           // GET /api/users/1
    public Result getById(@PathVariable Long id) {
        return Result.success(userService.getById(id));
    }

    @PostMapping                   // POST /api/users
    public Result add(@RequestBody User user) {
        userService.save(user);
        return Result.success();
    }

    @PutMapping("/{id}")           // PUT /api/users/1
    public Result update(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        userService.update(user);
        return Result.success();
    }

    @DeleteMapping("/{id}")        // DELETE /api/users/1
    public Result delete(@PathVariable Long id) {
        userService.deleteById(id);
        return Result.success();
    }
}
```

***

### 2.3 Controller Annotation Comparison

| Annotation | Purpose | Behavior |
| ----------------- | ------------------------ | ------------------------------------------------ |
| `@Controller` | Marks a Controller | Can return view names; add `@ResponseBody` for response bodies |
| `@RestController` | Marks a REST Controller | `@Controller` + `@ResponseBody`; commonly returns JSON |
| `@ResponseBody` | Writes a return value to the response body | Uses message conversion, commonly JSON serialization |

***

### 2.4 RESTful API Conventions

**RESTful API design** exposes server resources through URLs.

#### Design Principles

| Principle | Explanation |
| ------------------- | ------------------------------------------ |
| **Resource-oriented URLs** | Use resource nouns rather than action verbs |
| **Meaningful HTTP methods** | GET to retrieve, POST to create, PUT to replace, DELETE to remove |
| **Consistent response format** | Use a consistent JSON structure |
| **Appropriate status codes** | Choose HTTP status codes that describe the outcome |

#### Examples

| Operation | Action-style endpoint | RESTful endpoint |
| ------------ | ------------------------- | --------------------------- |
| List users | GET `/user/findAll` | GET `/users` |
| Find by ID | GET `/user/findById?id=1` | GET `/users/1` |
| Create user | POST `/user/save` | POST `/users` |
| Update user | POST `/user/update` | PUT `/users/1` |
| Delete user | GET `/user/delete?id=1` | DELETE `/users/1` |
| Paginated query | GET `/user/list?page=1` | GET `/users?page=1&size=10` |

***

## III. Request Parameters

### 3.1 Simple Parameters and @RequestParam

#### Simple Parameters

```java
// GET /user?name=张三&age=20 (sample name)
@GetMapping("/user")
public String getUser(String name, Integer age) {
    return "Name: " + name + ", age: " + age;
}
```

> 💡 Binding by method parameter name (here, and for `@RequestParam`/`@PathVariable` without an explicit name) requires compiling with `-parameters`. `spring-boot-starter-parent` configures it; since Spring Framework 6.1, Spring no longer falls back to debug information.

#### @RequestParam

```java
// GET /user?user_name=张三 (sample name)
@GetMapping("/user")
public String getUser(
    @RequestParam("user_name") String name,  // Map the parameter name
    @RequestParam(value = "age", required = false, defaultValue = "18") Integer age) {
    return "Name: " + name + ", age: " + age;
}

// Receive repeated values: GET /users?ids=1&ids=2&ids=3
@GetMapping("/users")
public String getUsers(@RequestParam List<Long> ids) {
    return "User IDs: " + ids;
}
```

| `@RequestParam` attribute | Meaning | Default |
| -------------------- | -------- | ------ |
| `value` | Parameter name | - |
| `required` | Whether it is required | `true` |
| `defaultValue` | Fallback value | - |

> 💡 `value` and `required` also appear on annotations such as `@PathVariable` and `@RequestHeader`. `defaultValue` is supported only by certain annotations; `@PathVariable` does not support it.

### 3.2 Path Parameters: @PathVariable

```java
// GET /user/1
@GetMapping("/user/{id}")
public String getUserById(@PathVariable Integer id) {
    return "User ID: " + id;
}

// GET /user/1/orders/100
@GetMapping("/user/{userId}/orders/{orderId}")
public String getOrder(@PathVariable Integer userId,
                       @PathVariable Integer orderId) {
    return "Order " + orderId + " for user " + userId;
}

// When the variable and parameter names differ
@GetMapping("/user/{user_id}")
public String getUser(@PathVariable("user_id") Integer userId) {
    return "User ID: " + userId;
}
```

***

### 3.3 JSON Parameters: @RequestBody

```java
// POST /user
// Content-Type: application/json
// {"name": "张三", "age": 20} — sample request data
@PostMapping("/user")
public String addUser(@RequestBody User user) {
    return "Add user: " + user;
}

// Receive a List
@PostMapping("/users/batch")
public Result batchAdd(@RequestBody List<User> users) {
    userService.saveBatch(users);
    return Result.success();
}

// Nested objects
@PostMapping("/orders")
public Result createOrder(@RequestBody OrderDTO order) {
    // OrderDTO contains List<OrderItem> items and Address address
    return Result.success();
}
```

```java
@Data
public class OrderDTO {
    private Long userId;
    private List<OrderItem> items;    // Nested collection
    private Address address;           // Nested object
}
```

***

### 3.4 Request Headers and Cookies

#### @RequestHeader

```java
@GetMapping("/header")
public String getHeader(
    @RequestHeader("User-Agent") String userAgent,
    @RequestHeader(value = "Authorization", required = false) String token) {
    return "Browser: " + userAgent;
}
```

#### @CookieValue

```java
@GetMapping("/cookie")
public String getCookie(
    @CookieValue(value = "JSESSIONID", required = false) String sessionId) {
    return "Session ID: " + sessionId;
}
```

***

### 3.5 Binding Parameters to an Object

```java
// GET /user?name=张三&age=20&email=test@example.com — sample request
@GetMapping("/user")
public String getUser(User user) {  // Bind request parameters to object properties
    return "User: " + user;
}

@Data
public class User {
    private String name;
    private Integer age;
    private String email;
}
```

#### Direct Access Through HttpServletRequest

```java
@DeleteMapping("/depts")
public Result delete(HttpServletRequest request) {
    String idStr = request.getParameter("id");
    int id = Integer.parseInt(idStr);
    return Result.success();
}
```

| Method | Purpose |
| --------------------------- | -------------------- |
| `getParameter(String name)` | Read a single parameter value |
| `getParameterValues(name)` | Read multiple values for a parameter |
| `getHeader(String name)` | Read a request header |
| `getMethod()` | Read the HTTP method |
| `getRequestURI()` | Read the request URI |

***

### 3.6 Dates and Times

#### @DateTimeFormat (Request Parameters)

Converts date/time strings from request parameters into Java date/time objects.

```java
// GET /order?createTime=2024-01-15
@GetMapping("/order")
public Result getOrder(
    @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createTime) {
    return Result.success(createTime);
}

// GET /log?startTime=2024-01-15 10:30:00
@GetMapping("/log")
public Result getLogs(
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime) {
    return Result.success(startTime);
}
```

**On a data class:**

```java
@Data
public class OrderQuery {
    private String orderNo;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
}
```

#### @JsonFormat (JSON Serialization)

Controls date/time formatting during JSON serialization and deserialization.

```java
@Data
public class Order {
    private Long id;
    private String orderNo;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Shanghai")
    private LocalDateTime createTime;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate deliveryDate;
}
```

#### Differences and Combined Usage

| Aspect | `@DateTimeFormat` | `@JsonFormat` |
| -------- | ----------------------- | -------------------------------- |
| **Library** | Spring | Jackson |
| **Purpose** | Request parameter format conversion | JSON serialization/deserialization format |
| **Input/output** | URL and form parameters | JSON request and response bodies |
| **Direction in these examples** | Incoming parameter conversion | Incoming and outgoing JSON |

**Combined usage:**

```java
@Data
public class OrderDTO {
    private Long id;

    // Incoming URL parameter: ?createTime=2024-01-15%2010:30:00 (%20 is a space)
    // Outgoing JSON: {"createTime": "2024-01-15 10:30:00"}
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Shanghai")
    private LocalDateTime createTime;
}
```

> 💡 `timezone` affects zone-based values such as `java.util.Date`; a `LocalDateTime` carries no zone and is formatted as-is.

**Global date format configuration:**

```yaml
spring:
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss   # Applies to java.util.Date only
    time-zone: Asia/Shanghai
    serialization:
      write-dates-as-timestamps: false
```

> **Note**: `spring.jackson.date-format` does not affect `java.time` types such as `LocalDateTime`. Format those with `@JsonFormat` or register serializers through a `Jackson2ObjectMapperBuilderCustomizer` bean.

***

### 3.7 Parameter Binding Summary

| Annotation/approach | Source | Example |
| -------------------- | ----------------- | ----------------------------- |
| No annotation | Query/form parameters | `?name=张三` |
| `@RequestParam` | Query parameters | `?name=张三` |
| `@PathVariable` | URL path | `/user/1` |
| `@RequestBody` | JSON request body | `{"name":"张三"}` |
| `@RequestHeader` | Request header | `Authorization: Bearer token` |
| `@CookieValue`       | Cookie            | `Cookie: JSESSIONID=xxx`      |
| `@DateTimeFormat` | Date/time conversion | `?date=2024-01-15` |
| `HttpServletRequest` | Raw request object | `request.getParameter("id")` |

***

## IV. Response Data

### 4.1 ResultCode Enumeration

Manage error codes centrally for easier maintenance and frontend/backend integration:

```java
@Getter
@AllArgsConstructor
public enum ResultCode {

    // Success
    SUCCESS(1, "Operation succeeded"),

    // General errors: 1001-1999
    PARAM_ERROR(1001, "Invalid parameters"),
    PARAM_VALID_ERROR(1002, "Parameter validation failed"),
    TOO_MANY_REQUESTS(1003, "Too many requests; please try again later"),

    // User errors: 2001-2999
    USER_NOT_FOUND(2001, "User not found"),
    USER_ALREADY_EXISTS(2002, "User already exists"),
    USERNAME_OR_PASSWORD_ERROR(2003, "Incorrect username or password"),

    // Authentication errors: 3001-3999
    UNAUTHORIZED(3001, "Please log in first"),
    TOKEN_EXPIRED(3002, "Login has expired"),
    ACCESS_DENIED(3003, "Access denied"),

    // Business errors: 4000-4999
    BUSINESS_ERROR(4000, "Business operation failed"),    // Default for message-only business exceptions
    DATA_NOT_FOUND(4001, "Data not found"),
    OPERATION_NOT_ALLOWED(4002, "Operation not allowed in the current state"),

    // System errors: 9001-9999
    SYSTEM_ERROR(9999, "Service busy; please try again later");

    private final Integer code;
    private final String msg;
}
```

***

### 4.2 A Consistent Response Wrapper (Result)

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {

    private Integer code;    // Response code
    private String msg;      // Message
    private T data;          // Response data

    // ============ Success responses ============

    public static <T> Result<T> success() {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMsg(), null);
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMsg(), data);
    }

    public static <T> Result<T> success(String msg, T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), msg, data);
    }

    // ============ Error responses ============

    public static <T> Result<T> error(String msg) {
        return new Result<>(ResultCode.SYSTEM_ERROR.getCode(), msg, null);
    }

    public static <T> Result<T> error(Integer code, String msg) {
        return new Result<>(code, msg, null);
    }

    public static <T> Result<T> error(ResultCode resultCode) {
        return new Result<>(resultCode.getCode(), resultCode.getMsg(), null);
    }

    public static <T> Result<T> error(ResultCode resultCode, String msg) {
        return new Result<>(resultCode.getCode(), msg, null);
    }

    // ============ Status checks ============

    public boolean isSuccess() {
        return ResultCode.SUCCESS.getCode().equals(this.code);
    }
}
```

**Usage examples:**

```java
// Basic usage
return Result.success();
return Result.success(user);
return Result.error("Operation failed");    // Message only; code defaults to SYSTEM_ERROR

// Use an error code
return Result.error(ResultCode.USER_NOT_FOUND);
return Result.error(ResultCode.PARAM_ERROR, "Username must not be blank");

// Check the result
if (result.isSuccess()) {
    // Handle success
}
```

***

### 4.3 Paginated Responses (PageResult)

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResult<T> {

    private Long total;       // Total matching records
    private List<T> rows;     // Current page of data

    public static <T> PageResult<T> of(Long total, List<T> rows) {
        return new PageResult<>(total, rows);
    }

    public static <T> PageResult<T> empty() {
        return new PageResult<>(0L, Collections.emptyList());
    }
}
```

***

### 4.4 Pagination Example

**Query parameters:**

```java
@Data
public class PageQuery {
    private Integer page = 1;
    private Integer size = 10;
}

@Data
public class UserQuery extends PageQuery {
    private String name;
    private Integer status;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
}
```

**Controller layer:**

```java
@GetMapping
public Result<PageResult<User>> page(UserQuery query) {
    PageResult<User> pageResult = userService.page(query);
    return Result.success(pageResult);
}
```

**Service layer:**

```java
@Override
public PageResult<User> page(UserQuery query) {
    PageHelper.startPage(query.getPage(), query.getSize());
    List<User> list = userMapper.selectByCondition(query);
    PageInfo<User> pageInfo = new PageInfo<>(list);
    return new PageResult<>(pageInfo.getTotal(), list);
}
```

***

### 4.5 Example Responses

```jsonc
// Success without data
{
    "code": 1,
    "msg": "Operation succeeded",
    "data": null
}

// Success with one object
{
    "code": 1,
    "msg": "Operation succeeded",
    "data": {
        "id": 1,
        "name": "张三",
        "createTime": "2024-01-15 10:30:00"
    }
}

// Success with a paginated list
{
    "code": 1,
    "msg": "Operation succeeded",
    "data": {
        "total": 100,
        "rows": [
            {"id": 1, "name": "张三"},
            {"id": 2, "name": "李四"}
        ]
    }
}

// Failure
{
    "code": 2001,
    "msg": "User not found",
    "data": null
}
```

***

## V. Input Validation

### 5.1 Adding the Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

***

### 5.2 Common Constraint Annotations

| Annotation | Constraint | Example |
| ------------------ | ------------------------------ | ------------------------------------- |
| `@NotNull` | Must not be null | `@NotNull(message = "ID is required")` |
| `@NotEmpty` | Non-null with nonzero length/size | `@NotEmpty(message = "Name is required")` |
| `@NotBlank` | Non-null string containing non-whitespace characters | `@NotBlank(message = "Name must not be blank")` |
| `@Size(min, max)` | String/collection size range | `@Size(min = 2, max = 10)` |
| `@Min(value)` | Minimum value | `@Min(value = 0)` |
| `@Max(value)` | Maximum value | `@Max(value = 100)` |
| `@Range(min, max)` | Numeric range | `@Range(min = 1, max = 150)` |
| `@Email` | Email format | `@Email(message = "Invalid email format")` |
| `@Pattern(regexp)` | Regular-expression match | `@Pattern(regexp = "^1[3-9]\\d{9}$")` |
| `@Past` | Date in the past | `@Past` |
| `@Future` | Date in the future | `@Future` |

***

### 5.3 Validating a Data Class

```java
@Data
public class UserDTO {

    @NotBlank(message = "Username must not be blank")
    @Size(min = 2, max = 20, message = "Username length must be 2-20")
    private String username;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 6, max = 20, message = "Password length must be 6-20")
    private String password;

    @NotBlank(message = "Phone number must not be blank")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "Invalid phone number format")
    private String phone;

    @NotNull(message = "Age is required")
    @Range(min = 1, max = 150, message = "Age must be between 1 and 150")
    private Integer age;

    @Email(message = "Invalid email format")
    private String email;
}
```

***

### 5.4 Validation in Controllers

```java
@RestController
@RequestMapping("/api/users")
@Validated  // Enable method validation for constraints on path/query parameters
public class UserController {

    // Validate a request body with @Valid
    @PostMapping
    public Result<Void> add(@RequestBody @Valid UserDTO userDTO) {
        userService.add(userDTO);
        return Result.success();
    }

    // Validate a path variable
    @GetMapping("/{id}")
    public Result<User> getById(
            @PathVariable @Min(value = 1, message = "ID must be greater than zero") Long id) {
        return Result.success(userService.getById(id));
    }

    // Validate a query object
    @GetMapping
    public Result<PageResult<User>> page(@Valid UserQuery query) {
        return Result.success(userService.page(query));
    }
}
```

***

### 5.5 Validation Groups

```java
// 1. Define group interfaces
public interface ValidGroup {
    interface Add {}
    interface Update {}
}

// 2. Assign constraints to groups
@Data
public class UserDTO {

    @Null(groups = ValidGroup.Add.class, message = "ID must be null when creating")
    @NotNull(groups = ValidGroup.Update.class, message = "ID is required when updating")
    private Long id;

    @NotBlank(groups = {ValidGroup.Add.class, ValidGroup.Update.class}, message = "Username must not be blank")
    private String username;

    @NotBlank(groups = ValidGroup.Add.class, message = "Password is required when creating")
    private String password;
}

// 3. Select the validation group in the Controller
@PostMapping
public Result<Void> add(@RequestBody @Validated(ValidGroup.Add.class) UserDTO dto) {
    return Result.success();
}

@PutMapping("/{id}")
public Result<Void> update(@PathVariable Long id,
                           @RequestBody @Validated(ValidGroup.Update.class) UserDTO dto) {
    return Result.success();
}
```

***

## VI. Annotation Reference

### 1. Controllers and Request Mapping

| Annotation | Purpose |
| ----------------- | ---------------------------------------------- |
| `@RestController` | REST Controller; `@Controller` + `@ResponseBody` |
| `@Controller` | Controller, including view-based responses |
| `@RequestMapping` | Class/method request mapping |
| `@GetMapping` | GET requests |
| `@PostMapping` | POST requests |
| `@PutMapping` | PUT requests |
| `@DeleteMapping` | DELETE requests |
| `@ResponseBody` | Write the method result to the response body |

### 2. Parameter Binding

| Annotation | Purpose |
| ----------------- | -------------------------- |
| `@RequestParam` | Query/form parameters |
| `@PathVariable` | URL path variable |
| `@RequestBody` | Request body, commonly JSON |
| `@RequestHeader` | Request header |
| `@CookieValue` | Cookie value |
| `@DateTimeFormat` | Request parameter date conversion |
| `@JsonFormat` | JSON date formatting for requests/responses |

### 3. Validation

| Annotation | Purpose |
| ----------------------- | ---------------------------- |
| `@Valid` / `@Validated` | Trigger validation |
| `@NotNull` | Reject null |
| `@NotBlank` | Reject blank strings |
| `@NotEmpty` | Reject null or empty collections, arrays, and strings |
| `@Size(min, max)` | Size/length range |
| `@Min` / `@Max` | Numeric bounds |
| `@Range(min, max)` | Numeric range (Hibernate Validator) |
| `@Email` | Email format |
| `@Pattern(regexp)` | Regular-expression match |
| `@Past` / `@Future` | Past/future date |

### 4. Lombok

| Annotation | Purpose |
| -------------------------- | ------------------------------ |
| `@Data` | Generate accessors, toString, and related methods |
| `@AllArgsConstructor` | All-arguments constructor |
| `@NoArgsConstructor` | No-argument constructor |
| `@RequiredArgsConstructor` | Constructor for required fields, including uninitialized final fields |
| `@Slf4j` | Generate an SLF4J logger |
| `@Getter` / `@Setter` | Generate accessors |
| `@Builder` | Builder API |
