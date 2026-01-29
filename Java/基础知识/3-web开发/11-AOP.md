## 一、AOP 概述

### 1.1 什么是 AOP

**AOP（Aspect Oriented Programming）** 面向切面编程，是一种编程范式，用于将横切关注点（如日志、事务、权限）从业务逻辑中分离出来。

**核心思想：** 在不修改原有代码的情况下，对功能进行增强。

    ┌─────────────────────────────────────────────────────────────┐
    │                        传统方式（代码侵入）                    │
    │                                                             │
    │  public void transfer() {                                   │
    │      log.info("开始转账");           // 日志                 │
    │      checkPermission();              // 权限校验             │
    │      beginTransaction();             // 开启事务             │
    │                                                             │
    │      // 核心业务逻辑                                         │
    │      accountDao.decrease(from, money);                      │
    │      accountDao.increase(to, money);                        │
    │                                                             │
    │      commitTransaction();            // 提交事务             │
    │      log.info("转账完成");           // 日志                 │
    │  }                                                          │
    ├─────────────────────────────────────────────────────────────┤
    │                        AOP 方式（解耦）                       │
    │                                                             │
    │  public void transfer() {                                   │
    │      // 只关注核心业务逻辑                                    │
    │      accountDao.decrease(from, money);                      │
    │      accountDao.increase(to, money);                        │
    │  }                                                          │
    │                                                             │
    │  // 日志、权限、事务等通过切面统一处理                         │
    └─────────────────────────────────────────────────────────────┘

***

### 1.2 核心概念

| 概念                  | 说明                                           | 示例                            |
| --------------------- | ---------------------------------------------- | ------------------------------- |
| **切面（Aspect）**    | 封装横切关注点的类，包含通知和切入点           | 日志切面、事务切面              |
| **连接点（JoinPoint）** | 程序执行过程中可以插入切面的点                 | 方法调用、方法执行              |
| **切入点（Pointcut）** | 定义哪些连接点会被切面增强                     | `execution(* com.example.service.*.*(..))` |
| **通知（Advice）**    | 切面在特定连接点执行的动作                     | 前置通知、后置通知、环绕通知    |
| **目标对象（Target）** | 被切面增强的对象                               | UserService                     |
| **代理（Proxy）**     | AOP 创建的代理对象，用于实现切面逻辑           | JDK 动态代理、CGLIB 代理        |

**概念关系图：**

    切面（Aspect）= 切入点（Pointcut）+ 通知（Advice）
    
    ┌──────────────────────────────────────────────────────────────┐
    │  @Aspect                                                     │
    │  public class LogAspect {                                    │
    │                                                              │
    │      @Pointcut("execution(* com.example.service.*.*(..))")   │  ← 切入点
    │      public void servicePointcut() {}                        │
    │                                                              │
    │      @Before("servicePointcut()")                            │  ← 通知
    │      public void before() {                                  │
    │          log.info("方法执行前");                              │
    │      }                                                       │
    │  }                                                           │
    └──────────────────────────────────────────────────────────────┘

***

### 1.3 AOP 的应用场景

| 场景         | 说明                               |
| ------------ | ---------------------------------- |
| **日志记录** | 记录方法调用、参数、返回值、耗时   |
| **事务管理** | 统一管理数据库事务                 |
| **权限校验** | 检查用户是否有权限执行某操作       |
| **性能监控** | 统计方法执行时间                   |
| **异常处理** | 统一处理异常，记录异常信息         |
| **缓存处理** | 方法结果缓存                       |
| **参数校验** | 统一校验方法参数                   |

***

## 二、Spring AOP 基础

### 2.1 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

> 💡 Spring Boot 会自动启用 AOP，无需额外配置。

***

### 2.2 核心注解

| 注解              | 作用位置 | 说明                                           |
| ----------------- | -------- | ---------------------------------------------- |
| `@Aspect`         | 类       | 声明当前类是一个切面类                         |
| `@Pointcut`       | 方法     | 定义切入点，指定哪些方法会被增强               |
| `@Before`         | 方法     | 前置通知，在目标方法执行前执行                 |
| `@After`          | 方法     | 后置通知，在目标方法执行后执行（无论是否异常） |
| `@AfterReturning` | 方法     | 返回后通知，在目标方法正常返回后执行           |
| `@AfterThrowing`  | 方法     | 异常后通知，在目标方法抛出异常后执行           |
| `@Around`         | 方法     | 环绕通知，包围目标方法，可完全控制执行流程     |

**注解详解：**

**@Aspect**
```java
@Aspect      // 声明这是一个切面类
@Component   // 必须配合 @Component，让 Spring 管理
public class LogAspect {
    // ...
}
```

**@Pointcut**
```java
// 定义切入点：匹配 service 包下所有类的所有方法
@Pointcut("execution(* com.example.service.*.*(..))")
public void servicePointcut() {}  // 方法名即为切入点名称，方法体为空

// 在通知中引用切入点
@Before("servicePointcut()")
public void before() { }
```

**@Before / @After / @Around**
```java
@Before("servicePointcut()")           // 引用已定义的切入点
public void before() { }

@After("execution(* com.example..*.*(..))")  // 也可以直接写表达式
public void after() { }

@Around("servicePointcut()")
public Object around(ProceedingJoinPoint pjp) throws Throwable {
    // 前置逻辑
    Object result = pjp.proceed();  // 执行目标方法
    // 后置逻辑
    return result;
}
```

**@AfterReturning / @AfterThrowing**
```java
// returning 指定接收返回值的参数名
@AfterReturning(pointcut = "servicePointcut()", returning = "result")
public void afterReturning(Object result) {
    log.info("返回值：{}", result);
}

// throwing 指定接收异常的参数名
@AfterThrowing(pointcut = "servicePointcut()", throwing = "ex")
public void afterThrowing(Exception ex) {
    log.error("异常：{}", ex.getMessage());
}
```

***

### 2.3 基本使用示例

```java
package com.example.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Slf4j
@Aspect
@Component
public class LogAspect {

    // ==================== 定义切入点 ====================
    
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void servicePointcut() {}

    // ==================== 前置通知 ====================
    
    @Before("servicePointcut()")
    public void before(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        log.info("【前置通知】方法：{}，参数：{}", methodName, Arrays.toString(args));
    }

    // ==================== 后置通知 ====================
    
    @After("servicePointcut()")
    public void after(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        log.info("【后置通知】方法：{} 执行完毕", methodName);
    }

    // ==================== 返回后通知 ====================
    
    @AfterReturning(pointcut = "servicePointcut()", returning = "result")
    public void afterReturning(JoinPoint joinPoint, Object result) {
        String methodName = joinPoint.getSignature().getName();
        log.info("【返回后通知】方法：{}，返回值：{}", methodName, result);
    }

    // ==================== 异常后通知 ====================
    
    @AfterThrowing(pointcut = "servicePointcut()", throwing = "ex")
    public void afterThrowing(JoinPoint joinPoint, Exception ex) {
        String methodName = joinPoint.getSignature().getName();
        log.error("【异常后通知】方法：{}，异常：{}", methodName, ex.getMessage());
    }

    // ==================== 环绕通知 ====================
    
    @Around("servicePointcut()")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        String methodName = pjp.getSignature().getName();
        
        log.info("【环绕通知-前】方法：{} 开始执行", methodName);
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = pjp.proceed();  // 执行目标方法
            
            long endTime = System.currentTimeMillis();
            log.info("【环绕通知-后】方法：{} 执行完成，耗时：{}ms", methodName, endTime - startTime);
            
            return result;
        } catch (Throwable e) {
            log.error("【环绕通知-异常】方法：{} 执行异常", methodName);
            throw e;
        }
    }
}
```

***

### 2.4 JoinPoint 详解

#### 什么是 JoinPoint

`JoinPoint`（连接点）是 AOP 中的核心概念，代表程序执行过程中的一个点，比如方法的调用或异常的抛出。在 Spring AOP 中，**JoinPoint 始终代表一个方法的执行**。

通过 JoinPoint 对象，可以获取到当前被增强方法的各种信息（方法名、参数、目标对象等）。

#### JoinPoint vs ProceedingJoinPoint

| 类型                  | 适用通知                                           | 特有能力               |
| --------------------- | -------------------------------------------------- | ---------------------- |
| `JoinPoint`           | @Before、@After、@AfterReturning、@AfterThrowing   | 获取方法信息           |
| `ProceedingJoinPoint` | **@Around（仅此）**                                | 继承 JoinPoint + 控制目标方法执行 |

> 💡 `ProceedingJoinPoint` 是 `JoinPoint` 的子接口，新增了 `proceed()` 方法用于执行目标方法。

#### 通知方法的参数注入规则

```java
// @Before / @After：JoinPoint 作为第一个参数（可选）
@Before("pointcut()")
public void before(JoinPoint joinPoint) { }

// @AfterReturning：可额外接收返回值
@AfterReturning(pointcut = "pointcut()", returning = "result")
public void afterReturning(JoinPoint joinPoint, Object result) { }

// @AfterThrowing：可额外接收异常
@AfterThrowing(pointcut = "pointcut()", throwing = "ex")
public void afterThrowing(JoinPoint joinPoint, Throwable ex) { }

// @Around：必须使用 ProceedingJoinPoint，且必须调用 proceed()
@Around("pointcut()")
public Object around(ProceedingJoinPoint pjp) throws Throwable {
    return pjp.proceed();  // 必须调用，否则目标方法不会执行
}
```

#### JoinPoint 常用方法

| 方法                                    | 返回类型   | 说明                         |
| --------------------------------------- | ---------- | ---------------------------- |
| `getSignature()`                        | Signature  | 获取方法签名对象             |
| `getSignature().getName()`              | String     | 获取方法名                   |
| `getSignature().getDeclaringType()`     | Class<?>   | 获取声明该方法的类           |
| `getSignature().getDeclaringTypeName()` | String     | 获取声明该方法的类名         |
| `getArgs()`                             | Object[]   | 获取方法参数数组             |
| `getTarget()`                           | Object     | 获取目标对象（被代理的原始对象）|
| `getThis()`                             | Object     | 获取代理对象                 |

#### ProceedingJoinPoint 特有方法

| 方法              | 返回类型 | 说明                                 |
| ----------------- | -------- | ------------------------------------ |
| `proceed()`       | Object   | 执行目标方法，返回目标方法的返回值   |
| `proceed(args)`   | Object   | 使用新参数执行目标方法（可修改参数） |

#### 使用示例

```java
@Around("@annotation(operationLog)")
public Object around(ProceedingJoinPoint pjp, OperationLog operationLog) throws Throwable {
    // 获取方法信息
    MethodSignature signature = (MethodSignature) pjp.getSignature();
    String className = signature.getDeclaringTypeName();  // 类名
    String methodName = signature.getName();              // 方法名
    Class<?> returnType = signature.getReturnType();      // 返回类型
    String[] paramNames = signature.getParameterNames();  // 参数名数组
    Class<?>[] paramTypes = signature.getParameterTypes();// 参数类型数组
    
    // 获取实际参数值
    Object[] args = pjp.getArgs();
    
    // 获取目标对象和代理对象
    Object target = pjp.getTarget();  // 原始对象
    Object proxy = pjp.getThis();     // 代理对象
    
    // 执行目标方法
    Object result = pjp.proceed();
    
    // 使用修改后的参数执行（可选）
    // Object result = pjp.proceed(new Object[]{"newArg1", "newArg2"});
    
    return result;
}
```

> 💡 **MethodSignature**：`getSignature()` 返回的是 `Signature` 接口，可强转为 `MethodSignature` 获取更多方法相关信息（参数名、参数类型、返回类型等）。

***

## 三、切入点表达式

### 3.1 execution 表达式（最常用）

**语法：**

```
execution(访问修饰符? 返回值 包名.类名.?方法名(方法参数) throws 异常?)
```

> 其中带 `?` 的表示可以省略的部分：
> - **访问修饰符**：可省略（如 `public`、`protected`）
> - **包名.类名.**：可省略
> - **throws 异常**：可省略（注意是方法上声明抛出的异常，不是实际抛出的异常）

**通配符：**

| 符号   | 说明                                     |
| ------ | ---------------------------------------- |
| `*`    | 匹配任意单个元素（一层）                 |
| `..`   | 匹配任意多个元素（多层包、任意参数）     |
| `+`    | 匹配指定类及其子类                       |

**常用示例：**

```java
// 匹配 com.example.service 包下所有类的所有方法
@Pointcut("execution(* com.example.service.*.*(..))")

// 匹配 com.example 包及其子包下所有类的所有方法
@Pointcut("execution(* com.example..*.*(..))")

// 匹配所有 public 方法
@Pointcut("execution(public * *(..))")

// 匹配返回值为 String 的方法
@Pointcut("execution(String *(..))")

// 匹配方法名以 get 开头的方法
@Pointcut("execution(* get*(..))")

// 匹配 UserService 类的所有方法
@Pointcut("execution(* com.example.service.UserService.*(..))")

// 匹配只有一个 Long 参数的方法
@Pointcut("execution(* *(Long))")

// 匹配第一个参数为 Long 的方法
@Pointcut("execution(* *(Long, ..))")
```

***

### 3.2 @annotation 表达式

匹配带有指定注解的方法：

```java
// 匹配带有 @Transactional 注解的方法
@Pointcut("@annotation(org.springframework.transaction.annotation.Transactional)")

// 匹配带有自定义注解的方法
@Pointcut("@annotation(com.example.annotation.Log)")
```

***

### 3.3 @within 表达式

匹配带有指定注解的类中的所有方法：

```java
// 匹配 @Service 注解类中的所有方法
@Pointcut("@within(org.springframework.stereotype.Service)")
```

***

### 3.4 组合表达式

使用 `&&`、`||`、`!` 组合多个切入点：

```java
// 匹配 service 包下的方法，但排除 get 开头的方法
@Pointcut("execution(* com.example.service.*.*(..)) && !execution(* get*(..))")

// 匹配 service 或 controller 包下的方法
@Pointcut("execution(* com.example.service.*.*(..)) || execution(* com.example.controller.*.*(..))")
```

***

## 四、通知执行顺序

### 4.1 单切面内的执行顺序

| 通知类型         | 执行时机                       |
| ---------------- | ------------------------------ |
| `@Around`（前）  | 最先执行                       |
| `@Before`        | 目标方法执行前                 |
| **目标方法**     | 实际业务逻辑                   |
| `@AfterReturning`| 目标方法正常返回后             |
| `@AfterThrowing` | 目标方法抛出异常后             |
| `@After`         | 目标方法执行后（无论是否异常） |
| `@Around`（后）  | 最后执行                       |

**执行流程图：**

    正常情况：@Around前 → @Before → 目标方法 → @AfterReturning → @After → @Around后
    异常情况：@Around前 → @Before → 目标方法（异常）→ @AfterThrowing → @After

> 💡 **注意：** 以上顺序适用于 **Spring 5.2.7+** 版本。旧版本中 `@After` 会在 `@AfterReturning`/`@AfterThrowing` 之前执行。

***

### 4.2 多切面的执行顺序（@Order）

使用 `@Order` 注解控制多个切面的执行顺序，数字越小优先级越高：

```java
@Aspect
@Component
@Order(1)  // 数字越小，优先级越高
public class FirstAspect {
    @Around("execution(* com.example.service.*.*(..))")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        log.info("FirstAspect 前");
        Object result = pjp.proceed();
        log.info("FirstAspect 后");
        return result;
    }
}

@Aspect
@Component
@Order(2)
public class SecondAspect {
    @Around("execution(* com.example.service.*.*(..))")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        log.info("SecondAspect 前");
        Object result = pjp.proceed();
        log.info("SecondAspect 后");
        return result;
    }
}
```

**执行顺序（洋葱模型）：**

    FirstAspect 前
        SecondAspect 前
            目标方法
        SecondAspect 后
    FirstAspect 后

***

### 4.3 实际应用中的顺序建议

| 顺序 | 切面类型     | 说明                         |
| ---- | ------------ | ---------------------------- |
| 1    | 日志切面     | 最先进入，最后退出，记录完整 |
| 2    | 权限切面     | 无权限时尽早拦截             |
| 3    | 缓存切面     | 有缓存直接返回               |
| 4    | 事务切面     | 包裹业务逻辑                 |
| 5    | 业务切面     | 最接近目标方法               |

***

## 五、实战案例

### 5.1 操作日志记录

**自定义注解：**

```java
package com.example.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface OperationLog {
    
    /** 操作模块 */
    String module() default "";
    
    /** 操作类型 */
    String operation() default "";
    
    /** 操作描述 */
    String description() default "";
}
```

**日志切面：**

```java
package com.example.aspect;

import com.example.annotation.OperationLog;
import com.example.context.UserContext;
import com.example.entity.SysLog;
import com.example.service.SysLogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class OperationLogAspect {

    private final SysLogService sysLogService;
    private final ObjectMapper objectMapper;

    @Around("@annotation(operationLog)")
    public Object around(ProceedingJoinPoint pjp, OperationLog operationLog) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        // 获取请求信息
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes != null ? attributes.getRequest() : null;
        
        // 构建日志对象
        SysLog sysLog = new SysLog();
        sysLog.setModule(operationLog.module());
        sysLog.setOperation(operationLog.operation());
        sysLog.setDescription(operationLog.description());
        sysLog.setUserId(UserContext.getUserId());
        sysLog.setUsername(UserContext.getUsername());
        sysLog.setMethod(pjp.getSignature().getDeclaringTypeName() + "." + pjp.getSignature().getName());
        sysLog.setParams(objectMapper.writeValueAsString(pjp.getArgs()));
        sysLog.setCreateTime(LocalDateTime.now());
        
        if (request != null) {
            sysLog.setIp(getClientIp(request));
            sysLog.setUrl(request.getRequestURI());
            sysLog.setHttpMethod(request.getMethod());
        }

        Object result = null;
        try {
            result = pjp.proceed();
            sysLog.setStatus(1);  // 成功
            sysLog.setResult(objectMapper.writeValueAsString(result));
        } catch (Throwable e) {
            sysLog.setStatus(0);  // 失败
            sysLog.setErrorMsg(e.getMessage());
            throw e;
        } finally {
            sysLog.setCostTime(System.currentTimeMillis() - startTime);
            // 异步保存日志
            sysLogService.saveAsync(sysLog);
        }
        
        return result;
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // 多级代理时取第一个
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}
```

**使用示例：**

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    @OperationLog(module = "用户管理", operation = "新增", description = "新增用户")
    public Result<Void> add(@RequestBody @Valid UserDTO dto) {
        userService.add(dto);
        return Result.success();
    }

    @PutMapping("/{id}")
    @OperationLog(module = "用户管理", operation = "修改", description = "修改用户信息")
    public Result<Void> update(@PathVariable Long id, @RequestBody @Valid UserDTO dto) {
        userService.update(id, dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    @OperationLog(module = "用户管理", operation = "删除", description = "删除用户")
    public Result<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return Result.success();
    }
}
```

***

### 5.2 方法执行耗时统计

```java
package com.example.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class PerformanceAspect {

    /** 慢方法阈值（毫秒） */
    private static final long SLOW_METHOD_THRESHOLD = 1000;

    @Pointcut("execution(* com.example.service..*.*(..))")
    public void servicePointcut() {}

    @Around("servicePointcut()")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        String methodName = pjp.getSignature().getDeclaringTypeName() + "." + pjp.getSignature().getName();
        long startTime = System.currentTimeMillis();
        
        try {
            return pjp.proceed();
        } finally {
            long costTime = System.currentTimeMillis() - startTime;
            
            if (costTime > SLOW_METHOD_THRESHOLD) {
                log.warn("【慢方法警告】{} 执行耗时：{}ms", methodName, costTime);
            } else {
                log.debug("【方法耗时】{} 执行耗时：{}ms", methodName, costTime);
            }
        }
    }
}
```

***

### 5.3 接口幂等性校验

**自定义注解：**

```java
package com.example.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Idempotent {
    
    /** 幂等Key的前缀 */
    String prefix() default "idempotent";
    
    /** 过期时间（秒） */
    int expireSeconds() default 5;
    
    /** 提示信息 */
    String message() default "请勿重复提交";
}
```

**幂等切面：**

```java
package com.example.aspect;

import com.example.annotation.Idempotent;
import com.example.context.UserContext;
import com.example.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Aspect
@Component
@RequiredArgsConstructor
public class IdempotentAspect {

    private final StringRedisTemplate redisTemplate;

    @Around("@annotation(idempotent)")
    public Object around(ProceedingJoinPoint pjp, Idempotent idempotent) throws Throwable {
        // 构建幂等Key：前缀 + 用户ID + 类名 + 方法名
        MethodSignature signature = (MethodSignature) pjp.getSignature();
        String key = String.format("%s:%s:%s:%s",
                idempotent.prefix(),
                UserContext.getUserId(),
                signature.getDeclaringTypeName(),
                signature.getName()
        );

        // 尝试设置Key（不存在才设置成功）
        Boolean success = redisTemplate.opsForValue()
                .setIfAbsent(key, "1", idempotent.expireSeconds(), TimeUnit.SECONDS);

        if (Boolean.FALSE.equals(success)) {
            throw new BusinessException(idempotent.message());
        }

        try {
            return pjp.proceed();
        } catch (Throwable e) {
            // 异常时删除Key，允许重试
            redisTemplate.delete(key);
            throw e;
        }
    }
}
```

**使用示例：**

```java
@PostMapping("/orders")
@Idempotent(prefix = "order:create", expireSeconds = 10, message = "订单正在处理中，请勿重复提交")
public Result<Long> createOrder(@RequestBody @Valid OrderDTO dto) {
    return Result.success(orderService.create(dto));
}
```

***

### 5.4 数据权限控制

**自定义注解：**

```java
package com.example.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DataScope {
    
    /** 部门表别名 */
    String deptAlias() default "d";
    
    /** 用户表别名 */
    String userAlias() default "u";
}
```

**数据权限切面（配合 MyBatis 使用）：**

```java
package com.example.aspect;

import com.example.annotation.DataScope;
import com.example.context.UserContext;
import com.example.entity.SysUser;
import com.example.service.SysUserService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class DataScopeAspect {

    private final SysUserService userService;

    @Before("@annotation(dataScope)")
    public void before(JoinPoint joinPoint, DataScope dataScope) {
        Long userId = UserContext.getUserId();
        SysUser user = userService.getById(userId);
        
        // 根据用户角色构建数据权限SQL
        StringBuilder sqlBuilder = new StringBuilder();
        
        switch (user.getDataScope()) {
            case 1:  // 全部数据权限
                break;
            case 2:  // 本部门数据权限
                sqlBuilder.append(String.format(" AND %s.dept_id = %d", 
                        dataScope.deptAlias(), user.getDeptId()));
                break;
            case 3:  // 本部门及以下数据权限
                sqlBuilder.append(String.format(" AND %s.dept_id IN (SELECT id FROM sys_dept WHERE id = %d OR FIND_IN_SET(%d, ancestors))", 
                        dataScope.deptAlias(), user.getDeptId(), user.getDeptId()));
                break;
            case 4:  // 仅本人数据权限
                sqlBuilder.append(String.format(" AND %s.user_id = %d", 
                        dataScope.userAlias(), userId));
                break;
            default:
                break;
        }
        
        // 将SQL片段存入ThreadLocal，在Mapper中拼接
        DataScopeContext.set(sqlBuilder.toString());
    }
}
```

***

## 六、AOP 底层原理与注意事项

### 6.1 代理方式

Spring AOP 使用两种代理方式：

| 代理方式         | 原理               | 限制                           |
| ---------------- | ------------------ | ------------------------------ |
| **JDK 动态代理** | 基于接口创建代理类 | 目标类必须实现接口             |
| **CGLIB 代理**   | 基于继承创建子类   | 目标类不能是 final，方法不能是 final |

**选择逻辑（Spring 默认）：**
- 目标类实现了接口 → JDK 动态代理
- 目标类未实现接口 → CGLIB 代理

> 💡 **Spring Boot 2.x 默认强制使用 CGLIB 代理**（`spring.aop.proxy-target-class=true`），即使目标类实现了接口也用 CGLIB。

***

### 6.2 代理对象的创建时机

代理对象在 Bean 生命周期的 `BeanPostProcessor.postProcessAfterInitialization()` 阶段创建。

```
Bean 实例化 → 属性注入 → 初始化 → 创建代理对象（AOP）
```

***

### 6.3 同类方法调用不生效（重要）

> ⚠️ **这是 AOP 最常见的坑！**

**问题：** 在同一个类中，一个方法直接调用另一个方法时，被调用方法的切面不会生效。

```java
@Service
public class UserService {
    
    @Transactional
    public void methodA() {
        // 直接调用，不会触发 methodB 的切面
        this.methodB();  // ❌ 不走代理
    }
    
    @Transactional
    public void methodB() {
        // ...
    }
}
```

**原因：** `this.methodB()` 是通过当前对象调用，而不是通过代理对象调用，所以切面无法拦截。

**解决方案一：注入自身代理对象**

```java
@Service
public class UserService {
    
    @Autowired
    private UserService self;  // 注入代理对象
    
    public void methodA() {
        self.methodB();  // ✅ 通过代理调用
    }
    
    @Transactional
    public void methodB() {
        // ...
    }
}
```

**解决方案二：使用 AopContext**

```java
// 启动类添加
@EnableAspectJAutoProxy(exposeProxy = true)

// 使用
@Service
public class UserService {
    
    public void methodA() {
        ((UserService) AopContext.currentProxy()).methodB();  // ✅ 通过代理调用
    }
    
    @Transactional
    public void methodB() {
        // ...
    }
}
```

***

## 附录：AOP 速查表

### 核心注解

| 注解              | 说明                               |
| ----------------- | ---------------------------------- |
| `@Aspect`         | 声明切面类                         |
| `@Pointcut`       | 定义切入点                         |
| `@Before`         | 前置通知                           |
| `@After`          | 后置通知（无论是否异常）           |
| `@AfterReturning` | 返回后通知（正常返回）             |
| `@AfterThrowing`  | 异常后通知（抛出异常）             |
| `@Around`         | 环绕通知                           |
| `@Order`          | 指定切面执行顺序（数字越小越优先） |

### 切入点表达式

| 表达式类型      | 说明                         | 示例                                   |
| --------------- | ---------------------------- | -------------------------------------- |
| `execution`     | 匹配方法执行                 | `execution(* com.example..*.*(..))`    |
| `@annotation`   | 匹配带有指定注解的方法       | `@annotation(com.example.Log)`         |
| `@within`       | 匹配带有指定注解的类         | `@within(org.springframework.stereotype.Service)` |
| `within`        | 匹配指定类/包内的方法        | `within(com.example.service.*)`        |
| `bean`          | 匹配指定 Bean 名称           | `bean(userService)`                    |
| `this`          | 匹配代理对象是指定类型       | `this(com.example.service.UserService)` |
| `target`        | 匹配目标对象是指定类型       | `target(com.example.service.UserService)` |
| `args`          | 匹配方法参数类型             | `args(Long, String)`                   |

### execution 通配符

| 符号   | 说明                                     |
| ------ | ---------------------------------------- |
| `*`    | 匹配任意单个元素（一层）                 |
| `..`   | 匹配任意多个元素（多层包、任意参数）     |
| `+`    | 匹配指定类及其子类                       |
