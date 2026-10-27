## I. Layered Architecture and Development Conventions

### 1.1 Three-Layer Architecture

    ┌──────────────────────────────────────────────────────┐
    │ Controller: receive requests and return responses    │
    └──────────────────────────────────────────────────────┘
                               ↓↑
    ┌──────────────────────────────────────────────────────┐
    │ Service: business logic and transaction management   │
    └──────────────────────────────────────────────────────┘
                               ↓↑
    ┌──────────────────────────────────────────────────────┐
    │ Mapper: database access                              │
    └──────────────────────────────────────────────────────┘

***

### 1.2 Standard Project Layout

    src/main/java/com/example/
    ├── controller/          # Controllers
    ├── service/             # Service interfaces
    │   └── impl/            # Service implementations
    ├── mapper/              # Data access
    ├── pojo/
    │   ├── entity/          # Database entities
    │   ├── dto/             # Request data
    │   ├── vo/              # Response data
    │   └── query/           # Query criteria
    ├── common/              # Shared classes
    ├── config/              # Configuration
    ├── filter/              # Servlet filters
    ├── interceptor/         # MVC interceptors
    ├── utils/               # Utilities
    └── Application.java

***

### 1.3 Controller Conventions

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Controller responsibilities:
     * 1. Receive and validate request parameters
     * 2. Invoke Service methods
     * 3. Return a consistent response structure
     */

    @GetMapping("/{id}")
    public Result<UserVO> getById(@PathVariable Long id) {
        return Result.success(userService.getById(id));
    }

    @PostMapping
    public Result<Void> add(@RequestBody @Valid UserDTO dto) {
        userService.add(dto);
        return Result.success();
    }
}
```

***

### 1.4 Service Conventions

```java
@Service
@Slf4j
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public UserVO getById(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }
        return toVO(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void add(UserDTO dto) {
        if (userMapper.existsByUsername(dto.getUsername())) {
            throw new BusinessException(ResultCode.USER_ALREADY_EXISTS);
        }
        User user = toEntity(dto);
        userMapper.insert(user);
        log.info("User created: {}", user.getId());
    }

    private UserVO toVO(User user) { /* Convert */ }
    private User toEntity(UserDTO dto) { /* Convert */ }
}
```

***

### 1.5 Data Object Conventions

| Type | Naming | Purpose |
| ------ | ---------- | ------------ |
| Entity | Corresponds to a table | Maps database data |
| DTO | XxxDTO | Receives request data |
| VO | XxxVO | Returns response data |
| Query | XxxQuery | Holds query criteria |

```java
// Entity: database representation, including all fields
@Data
public class User {
    private Long id;
    private String username;
    private String password;  // Sensitive field
    private LocalDateTime createTime;
}

// DTO: incoming data with validation
@Data
public class UserDTO {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}

// VO: outgoing data without sensitive fields
@Data
public class UserVO {
    private Long id;
    private String username;
    // No password field
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;
}
```

***

## II. Centralized Exception Handling

### 2.1 Core Annotations

| Annotation | Purpose |
| ----------------------- | ------------------------------------------------------- |
| `@RestControllerAdvice` | Global Controller advice with response-body handling (`@ControllerAdvice` + `@ResponseBody`) |
| `@ExceptionHandler` | Selects the exception types handled by a method |

```java
// Apply to all Controllers
@RestControllerAdvice
public class GlobalExceptionHandler { }

// Apply only to specified packages
@RestControllerAdvice(basePackages = "com.example.controller")
public class GlobalExceptionHandler { }
```

***

### 2.2 Custom Business Exceptions

```java
@Getter
public class BusinessException extends RuntimeException {

    private Integer code;

    public BusinessException(String message) {
        super(message);
        this.code = 0;
    }

    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(ResultCode resultCode) {
        super(resultCode.getMsg());
        this.code = resultCode.getCode();
    }
}
```

***

### 2.3 Global Exception Handler

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // Handle business exceptions
    @ExceptionHandler
    public Result<Void> handleBusinessException(BusinessException e) {
        log.warn("Business exception: code={}, msg={}", e.getCode(), e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }

    // Handle request-body validation errors
    @ExceptionHandler
    public Result<Void> handleValidException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        log.warn("Parameter validation failed: {}", message);
        return Result.error(ResultCode.PARAM_VALID_ERROR, message);
    }

    // Handle method-parameter validation errors for query/path parameters
    @ExceptionHandler
    public Result<Void> handleConstraintViolationException(ConstraintViolationException e) {
        String message = e.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining("; "));
        return Result.error(ResultCode.PARAM_VALID_ERROR, message);
    }

    // Handle parameter binding errors
    @ExceptionHandler
    public Result<Void> handleBindException(BindException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        return Result.error(ResultCode.PARAM_VALID_ERROR, message);
    }

    // A required request parameter is missing
    @ExceptionHandler
    public Result<Void> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException e) {
        return Result.error(ResultCode.PARAM_VALID_ERROR, "Missing parameter: " + e.getParameterName());
    }

    // Handle oversized uploads
    @ExceptionHandler
    public Result<Void> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException e) {
        return Result.error("File exceeds the size limit");
    }

    // Fallback handler
    @ExceptionHandler
    public Result<Void> handleException(Exception e) {
        log.error("System error", e);
        return Result.error(ResultCode.SYSTEM_ERROR);
    }
}
```

> 💡 **HTTP status codes:** These examples return HTTP 200 and distinguish outcomes using the code field. To return an appropriate HTTP error status, use mechanisms such as `@ResponseStatus(HttpStatus.BAD_REQUEST)`.

> **Note**: `ConstraintViolationException` comes from method validation on a controller annotated with `@Validated`. Since Spring Framework 6.1, Spring MVC also validates constrained controller parameters natively; without `@Validated` on the class it raises `HandlerMethodValidationException`, which needs its own handler.

***

### 2.4 Exception Handler Matching

Within a handler set, Spring selects `@ExceptionHandler` methods using specificity:

1. **Exact match first:** Prefer a handler matching the exception type directly.
2. **Subtype before supertype:** `BusinessException` is more specific than `RuntimeException`, which is more specific than `Exception`.

    Throw BusinessException
    ↓
    Match handleBusinessException(...)  ✅ Specific handler

    Throw NullPointerException
    ↓
    Match handleException(Exception e)  ✅ Fallback handler

***

### 2.5 Throwing Exceptions from Services

```java
@Service
public class UserServiceImpl implements UserService {

    @Override
    public User getById(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }
        return user;
    }

    @Override
    public void add(User user) {
        if (userMapper.existsByUsername(user.getUsername())) {
            throw new BusinessException(ResultCode.USER_ALREADY_EXISTS.getCode(),
                    "Username " + user.getUsername() + " is already in use");
        }
        userMapper.insert(user);
    }
}
```

***

## III. Filters and Interceptors

### 3.1 Comparison

| Aspect | Servlet Filter | MVC Interceptor |
| ------------ | --------------------------------- | ------------------------ |
| **API** | Servlet | Spring MVC |
| **Request timing** | Before DispatcherServlet | Inside DispatcherServlet processing |
| **Dependency injection** | Depends on how the filter instance is created/registered | Available for Spring-managed interceptors |
| **Path exclusions** | Usually handled in code | excludePathPatterns supported |

> **Filter dependency injection:**
> - A filter instance created only by the servlet container is not automatically a Spring bean, so plain `@Autowired` injection is unavailable.
> - Registering a Spring-managed `@Component` filter through `FilterRegistrationBean` supports `@Autowired` injection.

***

### 3.2 Complete Request Flow

    Client request
        ↓
    ┌─────────────────────────────────────────────────┐
    │ Filter chain (managed by the servlet container) │
    │  Filter1 → Filter2 → Filter3 → ...              │
    └─────────────────────────────────────────────────┘
        ↓
    ┌────────────────────────────────────────────┐
    │ DispatcherServlet (Spring MVC entry point) │
    └────────────────────────────────────────────┘
        ↓
    ┌──────────────────────────────────────────────────┐
    │ Interceptor chain (managed by Spring MVC)        │
    │  Interceptor1.preHandle → Interceptor2.preHandle │
    └──────────────────────────────────────────────────┘
        ↓
    ┌────────────────────────────────┐
    │  Controller → Service → Mapper │
    └────────────────────────────────┘
        ↓
    (The response unwinds in reverse order)

***

### 3.3 Filters in Detail

#### Lifecycle Methods

| Method | Timing | Frequency |
| ---------- | ------------------- | -------- |
| `init` | Filter initialization during server startup | Once |
| `doFilter` | Each matching request | Many times |
| `destroy` | Filter destruction during server shutdown | Once |

```java
public class DemoFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialize and read configuration parameters
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        // Pre-processing
        chain.doFilter(request, response);  // Continue; omitting this stops the chain
        // Post-processing
    }

    @Override
    public void destroy() {
        // Release resources
    }
}
```

#### Option 1: @WebFilter

```java
@WebFilter(urlPatterns = "/*")
public class DemoFilter implements Filter { }
```

```java
// Enable servlet component scanning on the application class
@SpringBootApplication
@ServletComponentScan
public class Application { }
```

> ⚠️ `@WebFilter` does not provide an explicit ordering attribute. Do not rely on discovery/class-name ordering for multiple filters; use explicit registration instead.

#### Option 2: FilterRegistrationBean (Recommended)

```java
// Declare the Filter as a Spring bean to support dependency injection
@Component
public class DemoFilter implements Filter {

    @Autowired  // Dependency injection is available
    private UserService userService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        // userService can be used here
        chain.doFilter(request, response);
    }
}

// Register it from a configuration class
@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<DemoFilter> demoFilter(DemoFilter filter) {
        FilterRegistrationBean<DemoFilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(filter);  // Inject the Spring-managed filter
        bean.addUrlPatterns("/*");
        bean.setOrder(1);  // Lower values run first
        return bean;
    }
}
```

***

### 3.4 Interceptors in Detail

#### Callback Methods

| Method | Timing | Behavior |
| ----------------- | ----------------------------- | ---------------------------- |
| `preHandle` | Before the Controller | Returning false stops handler execution |
| `postHandle` | After the handler, before view rendering | Not invoked when handler execution throws; less useful for REST responses |
| `afterCompletion` | After request completion | Cleanup callback, including exception paths, for interceptors whose preHandle returned true |

```java
@Component
public class DemoInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        // Inspect the target handler method
        if (handler instanceof HandlerMethod) {
            HandlerMethod hm = (HandlerMethod) handler;
            // hm.getBeanType(): Controller class
            // hm.getMethod(): target method
        }
        return true;  // true continues; false stops processing
    }

    @Override
    public void postHandle(HttpServletRequest request,
                           HttpServletResponse response,
                           Object handler,
                           ModelAndView modelAndView) throws Exception {
        // After Controller execution
    }

    @Override
    public void afterCompletion(HttpServletRequest request,
                                HttpServletResponse response,
                                Object handler,
                                Exception ex) throws Exception {
        // Request finished: release resources such as ThreadLocal values
    }
}
```

#### Registration and Path Matching

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/**")           // Include all paths
                .excludePathPatterns(             // Exclude these paths
                    "/api/auth/login",
                    "/api/auth/register",
                    "/doc.html",
                    "/swagger-resources/**",
                    "/files/**"
                )
                .order(1);
    }
}
```

***

### 3.5 Path Pattern Comparison

| Pattern | Filter urlPatterns | Interceptor pathPatterns |
| --------- | -------------------- | -------------------------- |
| `/*` | All paths, including nested paths | One path segment |
| `/**` | Not a servlet-style recursive wildcard | All paths, including nested paths |
| `/api/*` | All paths under /api/, including nested paths | One segment under /api/ |
| `/api/**` | Not a servlet-style recursive wildcard | Nested paths under /api/ |
| `*.do` | Extension mapping | Pattern matching within a segment; use an appropriate full path pattern |
| Exclusions | Handle in code | excludePathPatterns() |

***

### 3.6 Ordering Multiple Components

#### Configuration Example

```java
// Filter order
bean.setOrder(1);  // Lower values run first

// Interceptor order
registry.addInterceptor(interceptor1).order(1);
registry.addInterceptor(interceptor2).order(2);
```

#### Execution Order

    Request → Filter1 → Filter2 → Interceptor1.pre → Interceptor2.pre → Controller
                                                                          ↓
    Response ← Filter1 ← Filter2 ← Interceptor1.after ← Interceptor2.after ←──┘

| Component | Request direction | Response/unwinding direction |
| --------------------------- | ---------- | ---------------------- |
| Filter | Ascending order | Descending order as nested calls return |
| Interceptor.preHandle | Ascending order | - |
| Interceptor.postHandle | - | Descending order |
| Interceptor.afterCompletion | - | Descending order |

***

### 3.7 Cross-Origin Resource Sharing (CORS)

#### What Makes Requests Cross-Origin?

    http://localhost:3000 → http://localhost:8080  ✗ Different ports
    http://a.com          → http://b.com           ✗ Different hosts
    http://a.com          → https://a.com          ✗ Different schemes

#### Option 1: @CrossOrigin

```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController { }
```

#### Option 2: Global WebMvcConfigurer Configuration

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
}
```

#### Option 3: CorsFilter

```java
@Bean
public CorsFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOriginPatterns(Arrays.asList("*"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(Arrays.asList("*"));
    config.setAllowCredentials(true);
    config.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return new CorsFilter(source);
}
```

#### Comparing the Approaches

| Mechanism | Scope | Processing location | Typical use |
| ------------------ | ------- | ------ | ------------------ |
| `@CrossOrigin` | Class/method | Handler-level MVC configuration | Special settings for selected endpoints |
| `WebMvcConfigurer` | Global MVC mappings | Global MVC configuration combined with handler settings | General MVC configuration |
| `CorsFilter` | Global filter mappings | Servlet filter chain, before MVC | Handle CORS early |

#### Things to Watch For

> ⚠️ An interceptor may reject an OPTIONS preflight request, causing CORS failures.

```java
// Option 1: allow OPTIONS through the interceptor
if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
    return true;
}

// Option 2: use CorsFilter, which runs before MVC interceptors
```

***

### 3.8 Choosing a Mechanism

| Scenario | Suggested mechanism | Reason |
| --------------- | ----------- | ----------------------------------------- |
| Authentication/authorization | Interceptor | Can inject services and throw exceptions to the global exception handler; with Spring Security, use its security filter chain instead |
| CORS | Filter | Can run before MVC interceptors |
| Request/response logging | Either | Filters operate lower down; interceptors can inspect the handler |
| Character encoding | Filter | General servlet-level handling |
| Input/XSS filtering | Filter where appropriate | Can wrap requests independently of business handlers |
| Endpoint timing | Interceptor | Record time in preHandle and calculate it in afterCompletion |
| Excluding static resources | Interceptor | Convenient excludePathPatterns configuration |

***

## IV. Transaction Management

### 4.1 ACID Properties

| Property | Meaning |
| ---------- | ------------------ |
| **Atomicity** | All changes commit together or roll back |
| **Consistency** | Preserve valid database state |
| **Isolation** | Control interference between concurrent transactions |
| **Durability** | Committed changes persist |

***

### 4.2 Using @Transactional

```java
@Transactional(rollbackFor = Exception.class)
public void createOrder(OrderDTO dto) {
    orderMapper.insert(order);
    stockMapper.decrease(productId, quantity);  // Roll back both operations if an exception triggers rollback
}
```

**Common attributes:**

| Attribute | Purpose |
| ------------- | -------------- |
| `rollbackFor` | Exception types that trigger rollback |
| `propagation` | Transaction propagation behavior |
| `isolation` | Isolation level, such as `READ_COMMITTED` or `REPEATABLE_READ` |
| `readOnly` | Read-only transaction hint |
| `timeout` | Timeout in seconds |

> **Note:** `@Transactional(isolation = ...)` declares an isolation requirement; the database implements it. MySQL InnoDB defaults to `Repeatable Read`.

***

### 4.3 Propagation

| Propagation | Behavior |
| ------------------ | -------------------------- |
| `REQUIRED` (default) | Join the current transaction or start one |
| `REQUIRES_NEW` | Start an independent transaction |
| `SUPPORTS` | Join an existing transaction, otherwise run without one |
| `NOT_SUPPORTED` | Run without a transaction |

```java
// REQUIRES_NEW: independent transaction, unaffected by rollback of the outer transaction
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void saveLog(String content) { }
```

***

### 4.4 When Transaction Advice Does Not Apply

| Scenario | Cause | Resolution |
| ------------------- | -------------------- | ---------------- |
| Method cannot be intercepted by the chosen proxy | JDK proxies intercept public interface methods; class proxies cannot advise private/final methods | Prefer public transaction entry points invoked through the proxy |
| Self-invocation | Call bypasses the proxy | Invoke through a proxied dependency |
| Exception caught internally | Exception does not escape to the transaction interceptor | Rethrow when rollback is required |
| Checked exception | Default rollback rules cover RuntimeException and Error | Configure rollbackFor |

> **Version note:** Since Spring 6, class-based proxies also support `@Transactional` on protected and package-visible methods by default. Non-public does not automatically mean non-transactional.

```java
// ❌ Self-invocation bypasses transaction advice
public void process() {
    this.doSomething();
}

// ✅ Invoke through an injected proxy
// (@Lazy injects a lazy proxy; Spring Boot 2.6+ rejects circular references, including eager self-injection)
@Lazy
@Autowired
private UserService self;

public void process() {
    self.doSomething();
}
```

***

### 4.5 Best Practices

```java
// Write operation
@Transactional(rollbackFor = Exception.class)
public void createOrder(OrderDTO dto) { }

// Read operation
@Transactional(readOnly = true)
public Order getById(Long id) { }

// Batch operation
@Transactional(rollbackFor = Exception.class, timeout = 60)
public void batchImport(List<OrderDTO> list) { }
```

**Keep transaction scope focused:**

```java
// ❌ Slow remote work inside a transaction
@Transactional
public void create(OrderDTO dto) {
    orderMapper.insert(order);
    paymentService.callThirdParty(order);  // Remote call
}

// ✅ Keep slow work outside the transaction
public void create(OrderDTO dto) {
    Order order = doCreate(dto);           // This helper must delegate transaction work through a proxy
    paymentService.callThirdParty(order);  // After the transaction has committed
}
```

***

## V. File Uploads and Downloads

### 5.1 Basic Configuration

```yaml
spring:
  servlet:
    multipart:
      enabled: true
      max-file-size: 10MB       # Maximum size of one file
      max-request-size: 100MB   # Maximum total request size

file:
  upload-path: /data/uploads/
```

***

### 5.2 Local Storage

#### Upload Endpoint

```java
@PostMapping("/upload")
public Result<String> upload(@RequestParam("file") MultipartFile file) throws IOException {
    if (file.isEmpty()) {
        return Result.error("File must not be empty");
    }

    String original = file.getOriginalFilename();
    String ext = original.substring(original.lastIndexOf("."));
    String filename = UUID.randomUUID() + ext;

    file.transferTo(new File(uploadPath + filename));
    return Result.success("/files/" + filename);
}
```

#### Download Endpoint

```java
@GetMapping("/download/{filename}")
public ResponseEntity<Resource> download(@PathVariable String filename) throws IOException {
    Path base = Paths.get(uploadPath).toAbsolutePath().normalize();
    Path path = base.resolve(filename).normalize();
    if (!path.startsWith(base)) {
        return ResponseEntity.badRequest().build();  // Block path traversal such as ../
    }
    Resource resource = new UrlResource(path.toUri());

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + filename + "\"")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource);
}
```

#### Static Resource Mapping

```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/files/**")
            .addResourceLocations("file:/data/uploads/");
}
```

***

### 5.3 Alibaba Cloud OSS

#### Dependency

```xml
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>3.17.4</version>
</dependency>
```

#### Configuration

```yaml
aliyun:
  oss:
    endpoint: oss-cn-hangzhou.aliyuncs.com
    access-key-id: your-access-key-id
    access-key-secret: your-access-key-secret
    bucket-name: your-bucket-name
```

#### Utility Class

```java
@Component
@Slf4j
public class OssUtil {

    @Value("${aliyun.oss.endpoint}")
    private String endpoint;
    @Value("${aliyun.oss.access-key-id}")
    private String accessKeyId;
    @Value("${aliyun.oss.access-key-secret}")
    private String accessKeySecret;
    @Value("${aliyun.oss.bucket-name}")
    private String bucketName;

    public String upload(MultipartFile file, String dir) {
        OSS client = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        try {
            String original = file.getOriginalFilename();
            String ext = original.substring(original.lastIndexOf("."));
            String filename = UUID.randomUUID() + ext;
            // Organize by date: avatar/2024/01/15/xxx.jpg
            String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            String objectName = dir + "/" + datePath + "/" + filename;

            client.putObject(bucketName, objectName, file.getInputStream());

            // Return the access URL
            return "https://" + bucketName + "." + endpoint + "/" + objectName;
        } catch (Exception e) {
            log.error("OSS upload failed", e);
            throw new BusinessException("File upload failed");
        } finally {
            client.shutdown();
        }
    }
}
```

#### Usage Example

```java
@Autowired
private OssUtil ossUtil;

@PostMapping("/upload")
public Result<String> upload(@RequestParam("file") MultipartFile file) {
    String url = ossUtil.upload(file, "avatar");
    return Result.success(url);
}
```

***

### 5.4 Local Storage vs Cloud Object Storage

| Aspect | Local storage | Cloud storage (OSS) |
| -------- | ------------------ | ---------------------- |
| Cost | Server disk cost | Usage-based billing, often cheaper |
| Scalability | Limited by server storage | Very large capacity |
| Reliability | Single-server failure risk | Replication and high availability |
| CDN | Configure separately | Integrated support |
| Suitable for | Development, testing, small projects | Production and large file volumes |

***

### 5.5 File Validation Checklist

| Check | Technique |
| ------ | ------------------------------ |
| Nonempty | `file.isEmpty()` |
| Size | Compare `file.getSize()` with the limit |
| Extension | Allowlist extensions such as `.jpg` and `.png` |
| File signature | Inspect magic bytes to identify the actual format |

***

### 5.6 Common MultipartFile Methods

| Method | Purpose |
| ----------------------- | ---------------- |
| `isEmpty()` | Check whether the upload is empty |
| `getOriginalFilename()` | Original filename |
| `getContentType()` | Reported MIME type |
| `getSize()` | Size in bytes |
| `getInputStream()` | Open an input stream |
| `transferTo(File)` | Save to the target location |

***

## VI. Annotation Reference

### 1. Exception Handling

| Annotation | Purpose |
| ----------------------- | -------------- |
| `@RestControllerAdvice` | Global Controller exception handling |
| `@ExceptionHandler` | Exception-handler method |

### 2. Transactions

| Annotation/attribute | Purpose |
| ---------------- | ------------ |
| `@Transactional` | Declare transactional behavior |
| `rollbackFor` | Rollback exception rules |
| `propagation` | Propagation behavior |
| `readOnly` | Read-only transaction hint |
| `timeout` | Transaction timeout |

### 3. Filters and Interceptors

| Annotation/class | Purpose |
| ------------------------ | --------------------- |
| `@WebFilter` | Declare a servlet filter |
| `@ServletComponentScan` | Enable servlet component scanning |
| `FilterRegistrationBean` | Explicit filter registration |
| `@CrossOrigin` | CORS configuration |

### 4. Validation

| Annotation | Purpose |
| ----------------------- | --------------------- |
| `@Valid` / `@Validated` | Trigger validation |
| `@NotNull` | Reject null |
| `@NotBlank` | Reject blank strings |
| `@NotEmpty` | Reject null or empty collections/arrays |
| `@Size(min, max)` | Size/length range |
| `@Min` / `@Max` | Numeric bounds |
| `@Pattern` | Regular-expression constraint |
| `@Email` | Email format |

### 5. Serialization

| Annotation | Purpose |
| --------------- | ---------------- |
| `@JsonFormat` | Date/time formatting |
| `@JsonIgnore` | Exclude a property from serialization |
| `@JsonProperty` | Specify the JSON property name |

### 6. Lombok

| Annotation | Purpose |
| -------------------------- | ---------------------- |
| `@Data`                    | getter/setter/toString |
| `@Slf4j` | Generate an SLF4J logger |
| `@RequiredArgsConstructor` | Constructor for required fields, including uninitialized final fields |
| `@Builder` | Builder API |
