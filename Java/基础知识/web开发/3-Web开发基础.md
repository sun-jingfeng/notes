好的，按方案A重新生成三篇笔记。先发第一篇。

***

## 一、HTTP 协议与请求映射

### 1.1 HTTP 协议基础

**HTTP（HyperText Transfer Protocol）** 超文本传输协议，是浏览器与服务器之间数据传输的规则。

**特点：**

*   基于 TCP 协议，面向连接，安全
*   基于请求-响应模型
*   无状态协议

#### 请求数据格式

    ┌─────────────────────────────────────────────────────────┐
    │ 请求行    POST /api/users HTTP/1.1                       │
    ├─────────────────────────────────────────────────────────┤
    │ 请求头    Host: localhost:8080                           │
    │          Content-Type: application/json                 │
    │          Authorization: Bearer token...                 │
    ├─────────────────────────────────────────────────────────┤
    │ 空行                                                     │
    ├─────────────────────────────────────────────────────────┤
    │ 请求体    {"name": "张三", "age": 20}                     │
    └─────────────────────────────────────────────────────────┘

#### 请求方式

| 方法         | 说明       | 请求体 | 幂等性 |
| ---------- | -------- | --- | --- |
| **GET**    | 获取资源     | ❌   | ✅   |
| **POST**   | 新建资源     | ✅   | ❌   |
| **PUT**    | 更新资源（全量） | ✅   | ✅   |
| **PATCH**  | 更新资源（部分） | ✅   | ✅   |
| **DELETE** | 删除资源     | ❌   | ✅   |

#### 响应数据格式

    ┌─────────────────────────────────────────────────────────┐
    │ 响应行    HTTP/1.1 200 OK                                │
    ├─────────────────────────────────────────────────────────┤
    │ 响应头    Content-Type: application/json;charset=UTF-8   │
    │          Content-Length: 56                             │
    ├─────────────────────────────────────────────────────────┤
    │ 空行                                                     │
    ├─────────────────────────────────────────────────────────┤
    │ 响应体    {"code": 1, "msg": "success", "data": {...}}   │
    └─────────────────────────────────────────────────────────┘

#### 常用状态码

| 状态码   | 名称                    | 说明      |
| ----- | --------------------- | ------- |
| `200` | OK                    | 请求成功    |
| `201` | Created               | 资源创建成功  |
| `400` | Bad Request           | 请求参数错误  |
| `401` | Unauthorized          | 未认证     |
| `403` | Forbidden             | 无权限     |
| `404` | Not Found             | 资源不存在   |
| `405` | Method Not Allowed    | 请求方法不支持 |
| `500` | Internal Server Error | 服务器内部错误 |

***

### 1.2 请求映射

#### @RequestMapping 详解

`@RequestMapping` 是 Spring MVC 中用于**将 HTTP 请求映射到控制器方法**的核心注解。

**基本用法：**

```java
@RestController
@RequestMapping("/user")  // 类级别：所有方法的公共前缀
public class UserController {

    @RequestMapping("/list")  // 方法级别：完整路径为 /user/list
    public List<User> list() {
        return userService.findAll();
    }
    
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Result add(@RequestBody User user) {
        return Result.success();
    }
}
```

**常用属性：**

| 属性           | 说明               | 示例                                          |
| ------------ | ---------------- | ------------------------------------------- |
| `value/path` | 请求路径（可省略属性名）     | `@RequestMapping("/user")`                  |
| `method`     | 请求方式             | `method = RequestMethod.GET`                |
| `params`     | 请求参数条件           | `params = "id"` 必须有 id 参数                   |
| `headers`    | 请求头条件            | `headers = "Content-Type=application/json"` |
| `consumes`   | 请求的 Content-Type | `consumes = "application/json"`             |
| `produces`   | 响应的 Content-Type | `produces = "application/json"`             |

#### 派生注解（推荐使用）

Spring 4.3+ 提供了更简洁的派生注解：

| 注解               | 等价于                                              | 用途     |
| ---------------- | ------------------------------------------------ | ------ |
| `@GetMapping`    | `@RequestMapping(method = RequestMethod.GET)`    | 查询     |
| `@PostMapping`   | `@RequestMapping(method = RequestMethod.POST)`   | 新增     |
| `@PutMapping`    | `@RequestMapping(method = RequestMethod.PUT)`    | 修改（全量） |
| `@PatchMapping`  | `@RequestMapping(method = RequestMethod.PATCH)`  | 修改（部分） |
| `@DeleteMapping` | `@RequestMapping(method = RequestMethod.DELETE)` | 删除     |

**推荐用法：**

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

#### 控制器注解对比

| 注解                | 说明             | 特点                                          |
| ----------------- | -------------- | ------------------------------------------- |
| `@Controller`     | 标识控制器          | 返回视图名称，需配合 `@ResponseBody`                  |
| `@RestController` | 标识 RESTful 控制器 | 直接返回 JSON，= `@Controller` + `@ResponseBody` |
| `@ResponseBody`   | 标识方法返回值作为响应体   | 将对象序列化为 JSON                                |

***

### 1.3 RESTful API 设计规范

**RESTful** 是一种 API 设计风格，核心思想是将服务器资源以 URL 形式暴露。

#### 设计原则

| 原则             | 说明                              |
| -------------- | ------------------------------- |
| **资源导向**       | URL 表示资源，使用名词而非动词               |
| **HTTP 方法语义化** | GET 查询、POST 新增、PUT 修改、DELETE 删除 |
| **统一响应格式**     | 使用统一的 JSON 响应结构                 |
| **状态码规范**      | 使用合适的 HTTP 状态码                  |

#### 对比示例

| 操作       | 传统风格                      | RESTful 风格                  |
| -------- | ------------------------- | --------------------------- |
| 查询所有用户   | GET `/user/findAll`       | GET `/users`                |
| 根据 ID 查询 | GET `/user/findById?id=1` | GET `/users/1`              |
| 新增用户     | POST `/user/save`         | POST `/users`               |
| 修改用户     | POST `/user/update`       | PUT `/users/1`              |
| 删除用户     | GET `/user/delete?id=1`   | DELETE `/users/1`           |
| 分页查询     | GET `/user/list?page=1`   | GET `/users?page=1&size=10` |

***

## 二、请求参数处理

### 2.1 简单参数与 @RequestParam

#### 简单参数

```java
// GET /user?name=张三&age=20
@GetMapping("/user")
public String getUser(String name, Integer age) {
    return "姓名：" + name + "，年龄：" + age;
}
```

#### @RequestParam

```java
// GET /user?user_name=张三
@GetMapping("/user")
public String getUser(
    @RequestParam("user_name") String name,  // 参数名映射
    @RequestParam(value = "age", required = false, defaultValue = "18") Integer age) {
    return "姓名：" + name + "，年龄：" + age;
}

// 接收数组 GET /user?ids=1&ids=2&ids=3
@GetMapping("/user")
public String getUsers(@RequestParam List<Long> ids) {
    return "用户IDs：" + ids;
}
```

| 属性             | 说明   | 默认值    |
| -------------- | ---- | ------ |
| `value`        | 参数名称 | -      |
| `required`     | 是否必须 | `true` |
| `defaultValue` | 默认值  | -      |

***

### 2.2 路径参数 @PathVariable

```java
// GET /user/1
@GetMapping("/user/{id}")
public String getUserById(@PathVariable Integer id) {
    return "用户ID：" + id;
}

// GET /user/1/orders/100
@GetMapping("/user/{userId}/orders/{orderId}")
public String getOrder(@PathVariable Integer userId, 
                       @PathVariable Integer orderId) {
    return "用户" + userId + "的订单" + orderId;
}

// 参数名不一致时
@GetMapping("/user/{user_id}")
public String getUser(@PathVariable("user_id") Integer userId) {
    return "用户ID：" + userId;
}
```

***

### 2.3 JSON 参数 @RequestBody

```java
// POST /user
// Content-Type: application/json
// {"name": "张三", "age": 20}
@PostMapping("/user")
public String addUser(@RequestBody User user) {
    return "添加用户：" + user;
}

// 接收 List
@PostMapping("/users/batch")
public Result batchAdd(@RequestBody List<User> users) {
    userService.saveBatch(users);
    return Result.success();
}

// 嵌套对象
@PostMapping("/orders")
public Result createOrder(@RequestBody OrderDTO order) {
    // OrderDTO 包含 List<OrderItem> items 和 Address address
    return Result.success();
}
```

```java
@Data
public class OrderDTO {
    private Long userId;
    private List<OrderItem> items;    // 嵌套集合
    private Address address;           // 嵌套对象
}
```

***

### 2.4 请求头与 Cookie

#### @RequestHeader

```java
@GetMapping("/header")
public String getHeader(
    @RequestHeader("User-Agent") String userAgent,
    @RequestHeader(value = "Authorization", required = false) String token) {
    return "浏览器：" + userAgent;
}
```

#### @CookieValue

```java
@GetMapping("/cookie")
public String getCookie(
    @CookieValue(value = "JSESSIONID", required = false) String sessionId) {
    return "Session ID：" + sessionId;
}
```

***

### 2.5 实体类接收参数

```java
// GET /user?name=张三&age=20&email=test@example.com
@GetMapping("/user")
public String getUser(User user) {  // 自动将参数绑定到对象属性
    return "用户：" + user;
}

@Data
public class User {
    private String name;
    private Integer age;
    private String email;
}
```

#### HttpServletRequest 原始方式

```java
@DeleteMapping("/depts")
public Result delete(HttpServletRequest request) {
    String idStr = request.getParameter("id");
    int id = Integer.parseInt(idStr);
    return Result.success();
}
```

| 方法                          | 说明         |
| --------------------------- | ---------- |
| `getParameter(String name)` | 获取单个参数值    |
| `getParameterValues(name)`  | 获取同名参数的多个值 |
| `getHeader(String name)`    | 获取请求头      |
| `getMethod()`               | 获取请求方法     |
| `getRequestURI()`           | 获取请求 URI   |

***

### 2.6 日期时间处理

#### @DateTimeFormat（请求参数）

用于将请求参数中的日期字符串转换为 Java 日期对象。

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

**在实体类中使用：**

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

#### @JsonFormat（JSON 序列化）

用于控制 JSON 序列化/反序列化时的日期格式。

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

#### 两者的区别与组合使用

| 特性     | @DateTimeFormat    | @JsonFormat         |
| ------ | ------------------ | ------------------- |
| **来源** | Spring 框架          | Jackson 库           |
| **作用** | 接收参数时的格式转换         | JSON 序列化/反序列化时的格式转换 |
| **适用** | URL 参数、表单参数        | JSON 请求体、JSON 响应体   |
| **方向** | 仅入参（String → Date） | 双向（入参和出参）           |

**组合使用：**

```java
@Data
public class OrderDTO {
    private Long id;
    
    // 接收 URL 参数：?createTime=2024-01-15
    // 返回 JSON：{"createTime": "2024-01-15 00:00:00"}
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Shanghai")
    private LocalDateTime createTime;
}
```

**全局日期格式配置：**

```yaml
spring:
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: Asia/Shanghai
    serialization:
      write-dates-as-timestamps: false
```

***

### 2.7 参数获取方式总结

| 注解/方式                | 数据来源        | 示例                            |
| -------------------- | ----------- | ----------------------------- |
| 无注解                  | URL 查询参数/表单 | `?name=张三`                    |
| `@RequestParam`      | URL 查询参数    | `?name=张三`                    |
| `@PathVariable`      | URL 路径参数    | `/user/1`                     |
| `@RequestBody`       | 请求体（JSON）   | `{"name":"张三"}`               |
| `@RequestHeader`     | 请求头         | `Authorization: Bearer token` |
| `@CookieValue`       | Cookie      | `Cookie: JSESSIONID=xxx`      |
| `@DateTimeFormat`    | 日期时间格式转换    | `?date=2024-01-15`            |
| `HttpServletRequest` | 原始请求对象      | `request.getParameter("id")`  |

***

## 三、响应数据处理

### 3.1 错误码枚举（ResultCode）

统一管理错误码，便于维护和前后端对接：

```java
@Getter
@AllArgsConstructor
public enum ResultCode {

    // 成功
    SUCCESS(1, "操作成功"),

    // 通用错误 1001-1999
    PARAM_ERROR(1001, "参数错误"),
    PARAM_VALID_ERROR(1002, "参数校验失败"),

    // 用户相关 2001-2999
    USER_NOT_FOUND(2001, "用户不存在"),
    USER_ALREADY_EXISTS(2002, "用户已存在"),
    USERNAME_OR_PASSWORD_ERROR(2003, "用户名或密码错误"),

    // 认证相关 3001-3999
    UNAUTHORIZED(3001, "请先登录"),
    TOKEN_EXPIRED(3002, "登录已过期"),
    ACCESS_DENIED(3003, "无权限访问"),

    // 业务相关 4001-4999
    STOCK_NOT_ENOUGH(4001, "库存不足"),
    ORDER_NOT_FOUND(4002, "订单不存在"),

    // 系统错误 9001-9999
    SYSTEM_ERROR(9999, "系统繁忙，请稍后再试");

    private final Integer code;
    private final String msg;
}
```

***

### 3.2 统一响应封装（Result）

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    
    private Integer code;    // 响应码
    private String msg;      // 提示信息
    private T data;          // 返回数据

    // ============ 成功响应 ============
    
    public static <T> Result<T> success() {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMsg(), null);
    }
    
    public static <T> Result<T> success(T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMsg(), data);
    }

    public static <T> Result<T> success(String msg, T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), msg, data);
    }

    // ============ 失败响应 ============
    
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

    // ============ 判断方法 ============

    public boolean isSuccess() {
        return ResultCode.SUCCESS.getCode().equals(this.code);
    }
}
```

**使用示例：**

```java
// 基础用法
return Result.success();
return Result.success(user);
return Result.error("操作失败");

// 使用错误码
return Result.error(ResultCode.USER_NOT_FOUND);
return Result.error(ResultCode.PARAM_ERROR, "用户名不能为空");

// 判断结果
if (result.isSuccess()) {
    // 处理成功逻辑
}
```

***

### 3.3 分页响应（PageResult）

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResult<T> {
    
    private Long total;       // 总记录数
    private List<T> rows;     // 当前页数据
    
    public PageResult(Long total, List<T> rows) {
        this.total = total;
        this.rows = rows;
    }
    
    public static <T> PageResult<T> of(Long total, List<T> rows) {
        return new PageResult<>(total, rows);
    }
    
    public static <T> PageResult<T> empty() {
        return new PageResult<>(0L, Collections.emptyList());
    }
}
```

***

### 3.4 分页查询示例

**分页查询参数：**

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

**Controller 层：**

```java
@GetMapping
public Result<PageResult<User>> page(UserQuery query) {
    PageResult<User> pageResult = userService.page(query);
    return Result.success(pageResult);
}
```

**Service 层：**

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

### 3.5 响应结果示例

```json
// 成功响应（无数据）
{
    "code": 1,
    "msg": "操作成功",
    "data": null
}

// 成功响应（单个对象）
{
    "code": 1,
    "msg": "操作成功",
    "data": {
        "id": 1, 
        "name": "张三", 
        "createTime": "2024-01-15 10:30:00"
    }
}

// 成功响应（分页列表）
{
    "code": 1,
    "msg": "操作成功",
    "data": {
        "total": 100,
        "rows": [
            {"id": 1, "name": "张三"},
            {"id": 2, "name": "李四"}
        ]
    }
}

// 失败响应
{
    "code": 2001,
    "msg": "用户不存在",
    "data": null
}
```

***

## 四、参数校验

### 4.1 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

***

### 4.2 常用校验注解

| 注解                 | 说明                   | 示例                                    |
| ------------------ | -------------------- | ------------------------------------- |
| `@NotNull`         | 不能为 null             | `@NotNull(message = "ID不能为空")`        |
| `@NotEmpty`        | 不能为 null 且长度 > 0     | `@NotEmpty(message = "名称不能为空")`       |
| `@NotBlank`        | 不能为 null 且去空格后长度 > 0 | `@NotBlank(message = "名称不能为空")`       |
| `@Size(min, max)`  | 字符串/集合长度范围           | `@Size(min = 2, max = 10)`            |
| `@Min(value)`      | 最小值                  | `@Min(value = 0)`                     |
| `@Max(value)`      | 最大值                  | `@Max(value = 100)`                   |
| `@Range(min, max)` | 数值范围                 | `@Range(min = 1, max = 150)`          |
| `@Email`           | 邮箱格式                 | `@Email(message = "邮箱格式不正确")`         |
| `@Pattern(regexp)` | 正则表达式                | `@Pattern(regexp = "^1[3-9]\\d{9}$")` |
| `@Past`            | 必须是过去的日期             | `@Past`                               |
| `@Future`          | 必须是将来的日期             | `@Future`                             |

***

### 4.3 实体类校验

```java
@Data
public class UserDTO {
    
    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 20, message = "用户名长度必须在 2-20 之间")
    private String username;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度必须在 6-20 之间")
    private String password;
    
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
    
    @NotNull(message = "年龄不能为空")
    @Range(min = 1, max = 150, message = "年龄必须在 1-150 之间")
    private Integer age;
    
    @Email(message = "邮箱格式不正确")
    private String email;
}
```

***

### 4.4 Controller 中使用

```java
@RestController
@RequestMapping("/api/users")
@Validated  // 开启方法参数校验（用于 @PathVariable、@RequestParam）
public class UserController {
    
    // @RequestBody 校验：使用 @Valid
    @PostMapping
    public Result<Void> add(@RequestBody @Valid UserDTO userDTO) {
        userService.add(userDTO);
        return Result.success();
    }
    
    // @PathVariable 校验
    @GetMapping("/{id}")
    public Result<User> getById(
            @PathVariable @Min(value = 1, message = "ID必须大于0") Long id) {
        return Result.success(userService.getById(id));
    }
    
    // Query 对象校验
    @GetMapping
    public Result<PageResult<User>> page(@Valid UserQuery query) {
        return Result.success(userService.page(query));
    }
}
```

***

### 4.5 分组校验

```java
// 1. 定义分组接口
public interface ValidGroup {
    interface Add {}
    interface Update {}
}

// 2. 在字段上指定分组
@Data
public class UserDTO {
    
    @Null(groups = ValidGroup.Add.class, message = "新增时ID必须为空")
    @NotNull(groups = ValidGroup.Update.class, message = "更新时ID不能为空")
    private Long id;
    
    @NotBlank(groups = {ValidGroup.Add.class, ValidGroup.Update.class}, message = "用户名不能为空")
    private String username;
    
    @NotBlank(groups = ValidGroup.Add.class, message = "新增时密码不能为空")
    private String password;
}

// 3. Controller 中指定分组
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

## 附录：基础注解速查表

### Web 请求注解

| 注解                | 说明        |
| ----------------- | --------- |
| `@RestController` | REST 控制器  |
| `@RequestMapping` | 请求映射      |
| `@GetMapping`     | GET 请求    |
| `@PostMapping`    | POST 请求   |
| `@PutMapping`     | PUT 请求    |
| `@DeleteMapping`  | DELETE 请求 |
| `@RequestBody`    | JSON 请求体  |
| `@RequestParam`   | 请求参数      |
| `@PathVariable`   | 路径参数      |
| `@RequestHeader`  | 请求头       |
| `@CookieValue`    | Cookie 值  |

### 参数校验注解

| 注解                      | 说明    |
| ----------------------- | ----- |
| `@Valid` / `@Validated` | 触发校验  |
| `@NotNull`              | 非空    |
| `@NotBlank`             | 非空字符串 |
| `@NotEmpty`             | 非空集合  |
| `@Size`                 | 长度范围  |
| `@Min` / `@Max`         | 数值范围  |
| `@Email`                | 邮箱格式  |
| `@Pattern`              | 正则匹配  |

### 日期注解

| 注解                | 说明                 |
| ----------------- | ------------------ |
| `@DateTimeFormat` | 接收日期参数（URL/表单）     |
| `@JsonFormat`     | JSON 日期格式（请求体/响应体） |

### Lombok 常用注解

| 注解                         | 说明                          |
| -------------------------- | --------------------------- |
| `@Data`                    | 生成 getter/setter/toString 等 |
| `@AllArgsConstructor`      | 全参构造                        |
| `@NoArgsConstructor`       | 无参构造                        |
| `@RequiredArgsConstructor` | final 字段构造                  |
| `@Slf4j`                   | 日志注解                        |

