## 一、分层架构与开发规范

### 1.1 三层架构

    ┌─────────────────────────────────────────┐
    │    Controller 层（接收请求、返回响应）    │
    └─────────────────────────────────────────┘
                        ↓↑
    ┌─────────────────────────────────────────┐
    │    Service 层（业务逻辑、事务管理）       │
    └─────────────────────────────────────────┘
                        ↓↑
    ┌─────────────────────────────────────────┐
    │    Mapper 层（数据库访问）               │
    └─────────────────────────────────────────┘

***

### 1.2 标准项目结构

    src/main/java/com/example/
    ├── controller/          # 控制器
    ├── service/             # 业务接口
    │   └── impl/            # 业务实现
    ├── mapper/              # 数据访问层
    ├── pojo/
    │   ├── entity/          # 数据库实体
    │   ├── dto/             # 接收参数
    │   ├── vo/              # 返回数据
    │   └── query/           # 查询条件
    ├── common/              # 通用类
    ├── config/              # 配置类
    ├── filter/              # 过滤器
    ├── interceptor/         # 拦截器
    ├── utils/               # 工具类
    └── Application.java

***

### 1.3 Controller 层规范

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Controller 职责：
     * 1. 接收并校验请求参数
     * 2. 调用 Service 方法
     * 3. 封装统一响应格式
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

### 1.4 Service 层规范

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
        log.info("新增用户成功: {}", user.getId());
    }

    private UserVO toVO(User user) { /* 转换 */ }
    private User toEntity(UserDTO dto) { /* 转换 */ }
}
```

***

### 1.5 数据对象规范

| 类型   | 命名       | 用途         |
| ------ | ---------- | ------------ |
| Entity | 与表名对应 | 映射数据库表 |
| DTO    | XxxDTO     | 接收请求参数 |
| VO     | XxxVO      | 返回响应数据 |
| Query  | XxxQuery   | 查询条件参数 |

```java
// Entity - 数据库实体（包含所有字段）
@Data
public class User {
    private Long id;
    private String username;
    private String password;  // 敏感字段
    private LocalDateTime createTime;
}

// DTO - 接收参数（带校验）
@Data
public class UserDTO {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}

// VO - 返回数据（不含敏感字段）
@Data
public class UserVO {
    private Long id;
    private String username;
    // 不含 password
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;
}
```

***

## 二、统一异常处理

### 2.1 核心注解

| 注解                    | 说明                                                    |
| ----------------------- | ------------------------------------------------------- |
| `@RestControllerAdvice` | 全局异常处理类，= `@ControllerAdvice` + `@ResponseBody` |
| `@ExceptionHandler`     | 指定处理的异常类型                                      |

```java
// 作用于所有 Controller
@RestControllerAdvice
public class GlobalExceptionHandler { }

// 只作用于指定包
@RestControllerAdvice(basePackages = "com.example.controller")
public class GlobalExceptionHandler { }
```

***

### 2.2 自定义业务异常

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

### 2.3 全局异常处理器

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    // 处理业务异常
    @ExceptionHandler
    public Result<Void> handleBusinessException(BusinessException e) {
        log.warn("业务异常：code={}, msg={}", e.getCode(), e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }
    
    // 处理参数校验异常（@RequestBody）
    @ExceptionHandler
    public Result<Void> handleValidException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        log.warn("参数校验失败：{}", message);
        return Result.error(ResultCode.PARAM_VALID_ERROR, message);
    }
    
    // 处理参数校验异常（@RequestParam/@PathVariable）
    @ExceptionHandler
    public Result<Void> handleConstraintViolationException(ConstraintViolationException e) {
        String message = e.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining("; "));
        return Result.error(ResultCode.PARAM_VALID_ERROR, message);
    }
    
    // 处理参数绑定异常
    @ExceptionHandler
    public Result<Void> handleBindException(BindException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        return Result.error(ResultCode.PARAM_VALID_ERROR, message);
    }
    
    // 缺少必需的请求参数
    @ExceptionHandler
    public Result<Void> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException e) {
        return Result.error(ResultCode.PARAM_VALID_ERROR, "缺少参数: " + e.getParameterName());
    }
    
    // 处理文件上传大小超限
    @ExceptionHandler
    public Result<Void> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException e) {
        return Result.error("文件大小超出限制");
    }
    
    // 兜底处理
    @ExceptionHandler
    public Result<Void> handleException(Exception e) {
        log.error("系统异常", e);
        return Result.error(ResultCode.SYSTEM_ERROR);
    }
}
```

> 💡 **关于 HTTP 状态码**：以上示例统一返回 200，通过 code 字段区分结果。如需返回真实 HTTP 状态码，可在方法上添加 `@ResponseStatus(HttpStatus.BAD_REQUEST)` 等注解。

***

### 2.4 异常匹配顺序

Spring 按以下规则匹配 `@ExceptionHandler`：

1.  **精确匹配优先**：优先匹配与异常类型完全一致的处理器
2.  **子类优先于父类**：`BusinessException` > `RuntimeException` > `Exception`

    抛出 BusinessException
    ↓
    匹配 handleBusinessException(...)  ✅ 命中

    抛出 NullPointerException
    ↓
    匹配 handleException(Exception e)  ✅ 兜底命中

***

### 2.5 Service 层抛出异常

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
                    "用户名 " + user.getUsername() + " 已被使用");
        }
        userMapper.insert(user);
    }
}
```

***

## 三、过滤器与拦截器

### 3.1 对比概览

| 特性         | 过滤器（Filter）                  | 拦截器（Interceptor）    |
| ------------ | --------------------------------- | ------------------------ |
| **规范**     | Servlet                           | Spring MVC               |
| **执行时机** | DispatcherServlet 之前            | DispatcherServlet 之后   |
| **依赖注入** | @WebFilter 不支持，需用其他方式 ① | 可直接 @Autowired 注入   |
| **路径排除** | 不支持，需代码判断                | 支持 excludePathPatterns |

> ① **Filter 依赖注入说明**：
> - `@WebFilter` 注册的 Filter 不是 Spring Bean，`@Autowired` 不生效
> - `FilterRegistrationBean` + `@Component` 方式注册的 Filter 可以正常使用 `@Autowired`

***

### 3.2 请求处理完整流程

    客户端请求
        ↓
    ┌─────────────────────────────────────────────────────────┐
    │  Filter 链（Servlet 容器管理）                           │
    │  Filter1 → Filter2 → Filter3 → ...                      │
    └─────────────────────────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────────────────────────┐
    │  DispatcherServlet（Spring MVC 入口）                    │
    └─────────────────────────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────────────────────────┐
    │  Interceptor 链（Spring MVC 管理）                       │
    │  Interceptor1.preHandle → Interceptor2.preHandle        │
    └─────────────────────────────────────────────────────────┘
        ↓
    ┌─────────────────────────────────────────────────────────┐
    │  Controller → Service → Mapper                          │
    └─────────────────────────────────────────────────────────┘
        ↓
    （响应时逆序返回）

***

### 3.3 Filter 详解

#### 生命周期方法

| 方法       | 调用时机            | 调用次数 |
| ---------- | ------------------- | -------- |
| `init`     | Web 服务器启动时    | 1 次     |
| `doFilter` | 每次请求匹配 URL 时 | 多次     |
| `destroy`  | Web 服务器关闭时    | 1 次     |

```java
public class DemoFilter implements Filter {
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 初始化，可获取配置参数
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                         FilterChain chain) throws IOException, ServletException {
        // 请求前处理
        chain.doFilter(request, response);  // 放行，不调用则中断
        // 响应后处理
    }
    
    @Override
    public void destroy() {
        // 销毁，释放资源
    }
}
```

#### 配置方式一：@WebFilter 注解

```java
@WebFilter(urlPatterns = "/*")
public class DemoFilter implements Filter { }
```

```java
// 启动类开启 Servlet 组件扫描
@SpringBootApplication
@ServletComponentScan
public class Application { }
```

> ⚠️ `@WebFilter` 无法指定执行顺序（按类名字母排序），不推荐多 Filter 场景使用。

#### 配置方式二：FilterRegistrationBean（推荐）

```java
// Filter 声明为 Spring Bean，支持依赖注入
@Component
public class DemoFilter implements Filter {
    
    @Autowired  // ✅ 可以正常注入
    private UserService userService;
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                         FilterChain chain) throws IOException, ServletException {
        // 可以使用 userService
        chain.doFilter(request, response);
    }
}

// 配置类中注册
@Configuration
public class FilterConfig {
    
    @Bean
    public FilterRegistrationBean<DemoFilter> demoFilter(DemoFilter filter) {
        FilterRegistrationBean<DemoFilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(filter);  // 注入 Spring 管理的 Filter
        bean.addUrlPatterns("/*");
        bean.setOrder(1);  // 值越小越先执行
        return bean;
    }
}
```

***

### 3.4 Interceptor 详解

#### 生命周期方法

| 方法              | 调用时机                      | 说明                         |
| ----------------- | ----------------------------- | ---------------------------- |
| `preHandle`       | Controller 执行前             | 返回 false 则中断请求        |
| `postHandle`      | Controller 执行后、视图渲染前 | 异常时不执行，REST 中较少用  |
| `afterCompletion` | 请求完成后                    | 无论是否异常都执行，用于清理 |

```java
@Component
public class DemoInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                             HttpServletResponse response, 
                             Object handler) throws Exception {
        // 可获取目标方法信息
        if (handler instanceof HandlerMethod) {
            HandlerMethod hm = (HandlerMethod) handler;
            // hm.getBeanType() - Controller 类
            // hm.getMethod() - 目标方法
        }
        return true;  // true 放行，false 中断
    }
    
    @Override
    public void postHandle(HttpServletRequest request, 
                           HttpServletResponse response, 
                           Object handler, 
                           ModelAndView modelAndView) throws Exception {
        // Controller 执行后
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, 
                                HttpServletResponse response, 
                                Object handler, 
                                Exception ex) throws Exception {
        // 请求完成，清理资源（如 ThreadLocal）
    }
}
```

#### 配置与路径匹配

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Autowired
    private LoginInterceptor loginInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/**")           // 拦截所有
                .excludePathPatterns(             // 排除路径
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

### 3.5 路径匹配规则对比

| 模式      | Filter (urlPatterns) | Interceptor (pathPatterns) |
| --------- | -------------------- | -------------------------- |
| `/*`      | 匹配一级路径         | 匹配一级路径               |
| `/**`     | ❌ 不支持             | ✅ 匹配所有路径（含多级）   |
| `/api/*`  | 匹配 /api/xxx        | 匹配 /api/xxx              |
| `/api/**` | ❌ 不支持             | ✅ 匹配 /api/xxx/yyy/...    |
| `*.do`    | ✅ 后缀匹配           | ✅ 后缀匹配                 |
| 排除路径  | ❌ 需代码判断         | ✅ excludePathPatterns()    |

***

### 3.6 多组件执行顺序

#### 配置示例

```java
// Filter 配置
bean.setOrder(1);  // 值越小越先执行

// Interceptor 配置
registry.addInterceptor(interceptor1).order(1);
registry.addInterceptor(interceptor2).order(2);
```

#### 执行顺序

    请求 → Filter1 → Filter2 → Interceptor1.pre → Interceptor2.pre → Controller
                                                                          ↓
    响应 ← Filter1 ← Filter2 ← Interceptor1.after ← Interceptor2.after ←──┘

| 组件                        | 请求时     | 响应时                 |
| --------------------------- | ---------- | ---------------------- |
| Filter                      | order 升序 | order 升序（逆序出栈） |
| Interceptor.preHandle       | order 升序 | -                      |
| Interceptor.postHandle      | -          | order 降序             |
| Interceptor.afterCompletion | -          | order 降序             |

***

### 3.7 跨域配置（CORS）

#### 什么是跨域

    http://localhost:3000 → http://localhost:8080  ✗ 端口不同
    http://a.com          → http://b.com           ✗ 域名不同
    http://a.com          → https://a.com          ✗ 协议不同

#### 方式一：@CrossOrigin 注解

```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController { }
```

#### 方式二：全局配置（WebMvcConfigurer）

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

#### 方式三：CorsFilter

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

#### 三种方式对比

| 方式               | 粒度    | 优先级 | 适用场景           |
| ------------------ | ------- | ------ | ------------------ |
| `@CrossOrigin`     | 类/方法 | 最高   | 个别接口特殊配置   |
| `WebMvcConfigurer` | 全局    | 中     | 一般项目推荐       |
| `CorsFilter`       | 全局    | 最低   | 需要最早处理跨域时 |

#### 注意事项

> ⚠️ 当存在拦截器时，跨域预检请求（OPTIONS）可能被拦截导致跨域失败。

```java
// 方案一：拦截器中放行 OPTIONS
if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
    return true;
}

// 方案二：使用 CorsFilter（Filter 在 Interceptor 之前执行）
```

***

### 3.8 如何选择

| 场景            | 推荐        | 原因                                      |
| --------------- | ----------- | ----------------------------------------- |
| 登录/权限校验   | Interceptor | 可注入 Service，便于查库校验              |
| 跨域处理        | Filter      | 需在最早期处理，早于所有 Interceptor      |
| 请求/响应日志   | 都可以      | Filter 更底层；Interceptor 可获取 handler |
| 字符编码设置    | Filter      | Servlet 层面的通用处理                    |
| 敏感词/XSS 过滤 | Filter      | 需修改请求体，与业务无关                  |
| 接口耗时统计    | Interceptor | preHandle 记录开始，afterCompletion 计算  |
| 静态资源放行    | Interceptor | excludePathPatterns 配置更方便            |

***

## 四、事务管理

### 4.1 事务的 ACID 特性

| 特性       | 说明               |
| ---------- | ------------------ |
| **原子性** | 全部成功或全部回滚 |
| **一致性** | 数据保持一致状态   |
| **隔离性** | 事务间互不干扰     |
| **持久性** | 提交后永久保存     |

***

### 4.2 @Transactional 使用

```java
@Transactional(rollbackFor = Exception.class)
public void createOrder(OrderDTO dto) {
    orderMapper.insert(order);
    stockMapper.decrease(productId, quantity);  // 任一失败则全部回滚
}
```

**常用属性：**

| 属性          | 说明           |
| ------------- | -------------- |
| `rollbackFor` | 回滚的异常类型 |
| `propagation` | 传播行为       |
| `isolation`   | 隔离级别       |
| `readOnly`    | 是否只读       |
| `timeout`     | 超时时间（秒） |

***

### 4.3 传播行为

| 传播行为           | 说明                       |
| ------------------ | -------------------------- |
| `REQUIRED`（默认） | 有事务则加入，没有则新建   |
| `REQUIRES_NEW`     | 总是新建独立事务           |
| `SUPPORTS`         | 有事务则加入，没有则非事务 |
| `NOT_SUPPORTED`    | 非事务执行                 |

```java
// REQUIRES_NEW：独立事务，主事务回滚不影响
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void saveLog(String content) { }
```

***

### 4.4 事务失效场景

| 场景                | 原因                 | 解决方案         |
| ------------------- | -------------------- | ---------------- |
| 方法不是 public     | AOP 只代理 public    | 改为 public      |
| 内部方法调用        | 未通过代理对象       | 注入自身调用     |
| 异常被捕获          | 异常未抛出           | 重新抛出         |
| 非 RuntimeException | 默认只回滚运行时异常 | 添加 rollbackFor |

```java
// ❌ 内部调用，事务失效
public void process() {
    this.doSomething();
}

// ✅ 注入自身调用
@Autowired
private UserService self;

public void process() {
    self.doSomething();
}
```

***

### 4.5 最佳实践

```java
// 写操作
@Transactional(rollbackFor = Exception.class)
public void createOrder(OrderDTO dto) { }

// 读操作
@Transactional(readOnly = true)
public Order getById(Long id) { }

// 批量操作
@Transactional(rollbackFor = Exception.class, timeout = 60)
public void batchImport(List<OrderDTO> list) { }
```

**事务范围控制：**

```java
// ❌ 事务中包含耗时操作
@Transactional
public void create(OrderDTO dto) {
    orderMapper.insert(order);
    paymentService.callThirdParty(order);  // 远程调用
}

// ✅ 耗时操作放在事务外
public void create(OrderDTO dto) {
    Order order = doCreate(dto);           // 事务方法
    paymentService.callThirdParty(order);  // 事务提交后
}
```

***

## 五、文件上传与下载

### 5.1 基础配置

```yaml
spring:
  servlet:
    multipart:
      enabled: true
      max-file-size: 10MB       # 单个文件大小
      max-request-size: 100MB   # 总请求大小

file:
  upload-path: /data/uploads/
```

***

### 5.2 本地存储

#### 上传接口

```java
@PostMapping("/upload")
public Result<String> upload(@RequestParam("file") MultipartFile file) {
    if (file.isEmpty()) {
        return Result.error("文件不能为空");
    }
    
    String original = file.getOriginalFilename();
    String ext = original.substring(original.lastIndexOf("."));
    String filename = UUID.randomUUID() + ext;
    
    file.transferTo(new File(uploadPath + filename));
    return Result.success("/files/" + filename);
}
```

#### 下载接口

```java
@GetMapping("/download/{filename}")
public ResponseEntity<Resource> download(@PathVariable String filename) throws IOException {
    Path path = Paths.get(uploadPath).resolve(filename);
    Resource resource = new UrlResource(path.toUri());
    
    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"" + filename + "\"")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource);
}
```

#### 静态资源映射

```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/files/**")
            .addResourceLocations("file:/data/uploads/");
}
```

***

### 5.3 阿里云 OSS

#### 依赖

```xml
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>3.17.4</version>
</dependency>
```

#### 配置

```yaml
aliyun:
  oss:
    endpoint: oss-cn-hangzhou.aliyuncs.com
    access-key-id: your-access-key-id
    access-key-secret: your-access-key-secret
    bucket-name: your-bucket-name
```

#### 工具类

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
            // 按日期分目录：avatar/2024/01/15/xxx.jpg
            String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            String objectName = dir + "/" + datePath + "/" + filename;
            
            client.putObject(bucketName, objectName, file.getInputStream());
            
            // 返回访问 URL
            return "https://" + bucketName + "." + endpoint + "/" + objectName;
        } catch (Exception e) {
            log.error("OSS 上传失败", e);
            throw new BusinessException("文件上传失败");
        } finally {
            client.shutdown();
        }
    }
}
```

#### 使用示例

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

### 5.4 本地存储 vs 云存储

| 特性     | 本地存储           | 云存储（OSS）          |
| -------- | ------------------ | ---------------------- |
| 成本     | 服务器磁盘费用     | 按量付费，通常更便宜   |
| 扩展性   | 受限于服务器磁盘   | 近乎无限               |
| 可靠性   | 单点故障风险       | 多副本，高可用         |
| CDN 加速 | 需自行配置         | 原生支持               |
| 适用场景 | 开发测试、小型项目 | 生产环境、大量文件存储 |

***

### 5.5 文件校验要点

| 校验项 | 说明                           |
| ------ | ------------------------------ |
| 非空   | `file.isEmpty()`               |
| 大小   | `file.getSize()` 与限制值比较  |
| 后缀   | 白名单校验，如 `.jpg`, `.png`  |
| 文件头 | 通过 Magic Number 校验真实类型 |

***

### 5.6 MultipartFile 常用方法

| 方法                    | 说明             |
| ----------------------- | ---------------- |
| `isEmpty()`             | 是否为空         |
| `getOriginalFilename()` | 原始文件名       |
| `getContentType()`      | MIME 类型        |
| `getSize()`             | 文件大小（字节） |
| `getInputStream()`      | 获取输入流       |
| `transferTo(File)`      | 保存到指定位置   |

***

## 附录：常用注解速查表

### 异常处理

| 注解                    | 说明           |
| ----------------------- | -------------- |
| `@RestControllerAdvice` | 全局异常处理类 |
| `@ExceptionHandler`     | 异常处理方法   |

### 事务管理

| 注解/属性        | 说明         |
| ---------------- | ------------ |
| `@Transactional` | 声明事务     |
| `rollbackFor`    | 回滚异常类型 |
| `propagation`    | 传播行为     |
| `readOnly`       | 只读事务     |
| `timeout`        | 超时时间     |

### 过滤器与拦截器

| 注解/类                  | 说明                  |
| ------------------------ | --------------------- |
| `@WebFilter`             | 声明 Filter           |
| `@ServletComponentScan`  | 启用 Servlet 组件扫描 |
| `FilterRegistrationBean` | 注册 Filter（推荐）   |
| `@CrossOrigin`           | 跨域配置              |

### 参数校验

| 注解                    | 说明                  |
| ----------------------- | --------------------- |
| `@Valid` / `@Validated` | 触发校验              |
| `@NotNull`              | 不能为 null           |
| `@NotBlank`             | 不能为空白（字符串）  |
| `@NotEmpty`             | 不能为空（集合/数组） |
| `@Size(min, max)`       | 长度范围              |
| `@Min` / `@Max`         | 数值范围              |
| `@Pattern`              | 正则匹配              |
| `@Email`                | 邮箱格式              |

### 数据序列化

| 注解            | 说明             |
| --------------- | ---------------- |
| `@JsonFormat`   | 日期格式化       |
| `@JsonIgnore`   | 序列化时忽略     |
| `@JsonProperty` | 指定 JSON 字段名 |

### Lombok

| 注解                       | 说明                   |
| -------------------------- | ---------------------- |
| `@Data`                    | getter/setter/toString |
| `@Slf4j`                   | 日志                   |
| `@RequiredArgsConstructor` | final 字段构造         |
| `@Builder`                 | 构建者模式             |

