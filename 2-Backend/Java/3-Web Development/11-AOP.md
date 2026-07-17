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
| **织入（Weaving）**   | 将切面应用到目标对象、创建代理对象的过程       | Spring AOP 在运行时织入；AspectJ 额外支持编译时、加载时织入 |

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

### 1.4 Spring AOP 与 AspectJ

Spring AOP 和 AspectJ 都是 AOP 框架，但定位不同：

| 维度 | Spring AOP | AspectJ |
|------|-----------|--------|
| **实现方式** | 运行时代理（JDK / CGLIB） | 编译时 / 加载时字节码织入 |
| **支持的连接点** | 仅方法执行 | 方法、字段访问、构造器调用等 |
| **依赖** | 随 Spring 容器，无额外依赖 | 需要 AspectJ 编译器或 Java Agent |
| **适用场景** | 绝大多数业务场景 | 需拦截非 public 方法、字段访问等高级场景 |
| **复杂度** | 低 | 高 |

Spring AOP 内置了对 AspectJ 注解（`@Aspect`、`@Pointcut`、`@Around` 等）的**语法支持**，但底层仍是运行时代理，而非 AspectJ 的静态织入。因此 Spring AOP 有代理机制的固有限制（只支持公有方法、同类调用不生效等），AspectJ 编译时织入没有这些限制。

> 💡 日常 Spring Boot 项目直接用 Spring AOP 即可；只有需要拦截非 public 方法或字段访问等场景，才值得引入 AspectJ。

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
    Object result = pjp.proceed();  // 执行目标方法（⚠️ 必须调用，否则目标方法不会执行）
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

#### 注解属性参考

各通知注解的完整属性列表：

| 注解              | 属性                  | 类型   | 必填 | 说明                                                       |
| ----------------- | --------------------- | ------ | ---- | ---------------------------------------------------------- |
| `@Aspect`         | —                     | —      | —    | 无属性                                                     |
| `@Pointcut`       | `value`               | String | 是   | 切入点表达式（默认属性，可省略属性名）                     |
| `@Pointcut`       | `argNames`            | String | 否   | 参数名列表，逗号分隔，用于参数绑定（见 2.4）               |
| `@Before`         | `value`               | String | 是   | 切入点表达式或已定义的切入点方法引用                       |
| `@Before`         | `argNames`            | String | 否   | 同上                                                       |
| `@After`          | `value`               | String | 是   | 切入点表达式或已定义的切入点方法引用                       |
| `@After`          | `argNames`            | String | 否   | 同上                                                       |
| `@AfterReturning` | `value` / `pointcut`  | String | 是   | 切入点表达式（两者互为别名，二选一；有其他属性时用 `pointcut`） |
| `@AfterReturning` | `returning`           | String | 否   | 通知方法中接收返回值的参数名，类型须兼容目标方法返回类型   |
| `@AfterReturning` | `argNames`            | String | 否   | 同上                                                       |
| `@AfterThrowing`  | `value` / `pointcut`  | String | 是   | 切入点表达式（两者互为别名，二选一；有其他属性时用 `pointcut`） |
| `@AfterThrowing`  | `throwing`            | String | 否   | 通知方法中接收异常的参数名，类型须兼容目标方法抛出的异常   |
| `@AfterThrowing`  | `argNames`            | String | 否   | 同上                                                       |
| `@Around`         | `value`               | String | 是   | 切入点表达式或已定义的切入点方法引用                       |
| `@Around`         | `argNames`            | String | 否   | 同上                                                       |

> 💡 `value` 是各通知注解的默认属性，单独使用时可省略属性名：`@Before("pointcut()")` 等价于 `@Before(value = "pointcut()")`。
>
> 💡 `argNames` 在编译保留了参数名信息（`-parameters` 标志或 `-g` 调试符号）时可自动推断，通常无需手动指定；仅在编译优化移除了参数名的环境下才需要显式声明，格式为逗号分隔的参数名字符串：`argNames = "joinPoint,userId"`。

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

Spring AOP 对通知方法的参数注入有固定约定，分三类：

| 参数类型 | 说明 | 约束 |
| -------- | ---- | ---- |
| `JoinPoint` / `ProceedingJoinPoint` | AspectJ 固定约定，由框架自动注入，携带被拦截方法的运行时信息（方法名、参数、目标对象等）；**不是业务参数** | 必须是**第一个参数**；不参与切入点匹配 |
| 切入点绑定参数（注解实例、目标方法参数等） | 通过 pointcut 表达式中的名称与参数名匹配绑定，类型须与实际值兼容 | 参数名须与表达式标识符一致；类型同时参与**静态切入点过滤** |
| `returning` / `throwing` 绑定参数 | 由 `@AfterReturning(returning=)` / `@AfterThrowing(throwing=)` 绑定返回值或异常 | 名称须与注解属性值一致；类型参与**运行时动态过滤** |

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

#### 切入点表达式参数绑定

通知方法除接收 JoinPoint 外，还可以通过切入点表达式直接绑定目标方法的参数值、注解实例、目标对象等。绑定规则：表达式中的名称必须与通知方法参数名一致，类型须与实际值兼容。

```java
// 绑定目标方法参数（args()）：匹配第一个参数为 Long 类型的方法，并绑定其值
@Before("execution(* com.example.service.*.*(..)) && args(userId,..)")
public void before(Long userId) {
    log.info("userId：{}", userId);
}

// 同时使用 JoinPoint：JoinPoint 必须位于第一个参数位置
@Before("execution(* com.example.service.*.*(..)) && args(id,..)")
public void before(JoinPoint joinPoint, Long id) {
    log.info("方法：{}，id：{}", joinPoint.getSignature().getName(), id);
}

// 绑定注解实例（@annotation()）：名称与参数名一致，Spring 自动注入注解对象
@Around("@annotation(operationLog)")
public Object around(ProceedingJoinPoint pjp, OperationLog operationLog) throws Throwable {
    String module = operationLog.module();  // 直接读取注解属性，无需反射
    return pjp.proceed();
}

// 绑定目标对象（target()）：绑定被代理的原始对象（非代理对象）
@Before("target(service)")
public void before(UserService service) { }

// 绑定代理对象（this()）：绑定 Spring 代理对象
@Before("this(proxy)")
public void before(UserService proxy) { }
```

> 💡 参数绑定同时起到类型过滤的作用：`args(Long,..)` 只匹配第一个参数能转型为 `Long` 的调用；`target(UserService)` 只匹配目标对象是 `UserService` 类型的方法。

#### 参数绑定的过滤阶段

通知方法的参数绑定涉及两个阶段的过滤，均可阻止通知执行，但时机不同：

| 绑定方式 | 过滤阶段 | 类型不匹配的结果 |
| -------- | -------- | ---------------- |
| `pointcut`/`value` 中的表达式（如 `@annotation(x)`、`args(y)`） | **启动时静态匹配**，随代理对象创建一次性确定 | 目标方法**完全不被拦截**，代理对象不介入 |
| `returning = "x"` 绑定参数的类型 | **运行时动态过滤**，每次方法调用时判断 | 目标方法**已被拦截**，但此次通知跳过执行 |
| `throwing = "x"` 绑定参数的类型 | **运行时动态过滤**，每次方法调用时判断 | 同上 |

```
目标方法被调用
      │
      ▼
┌─────────────────────────────┐
│  pointcut 静态匹配（启动时） │  ← 不满足 → 完全不拦截
└─────────────┬───────────────┘
              │ 满足，目标方法执行
              ├──────────────────────────────────┐
              ▼ 正常返回                          ▼ 抛出异常
┌─────────────────────────┐        ┌─────────────────────────┐
│  returning 参数类型检查  │        │  throwing 参数类型检查   │
│  （运行时）              │        │  （运行时）              │
└────────────┬────────────┘        └────────────┬────────────┘
             │ 不满足 → 通知跳过                │ 不满足 → 通知跳过
             ▼ 满足                             ▼ 满足
     doAfterReturning 执行             doAfterThrowing 执行
```

`returning`/`throwing` 的参数类型写 `Object`/`Throwable` 是最宽类型，接受所有值，不做过滤——这是最常见的写法。若写具体类型，则只有实际值匹配时通知才执行：

```java
// 只有返回值实际类型是 String 时，此通知才执行
@AfterReturning(pointcut = "@annotation(controllerLog)", returning = "result")
public void afterReturning(Log controllerLog, String result) { ... }

// 只有抛出的异常是 BusinessException（或其子类）时，此通知才执行
@AfterThrowing(pointcut = "@annotation(controllerLog)", throwing = "e")
public void afterThrowing(Log controllerLog, BusinessException e) { ... }
```

> 💡 能在 `pointcut` 表达式中解决的条件优先写在那里（启动时一次确定，代价最低），避免每次方法调用都走运行时类型判断。

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

**参数绑定简写（常用）：**

当通知方法的参数名称与 `@annotation()` 中的名称一致时，Spring 会自动将注解实例注入，无需手动通过反射获取注解属性：

```java
// 表达式中的 "operationLog" 与方法参数名一致，Spring 自动注入注解对象
@Around("@annotation(operationLog)")
public Object around(ProceedingJoinPoint pjp, OperationLog operationLog) throws Throwable {
    String module = operationLog.module();      // 直接读取注解属性
    String operation = operationLog.operation();
    return pjp.proceed();
}
```

> 💡 这是实战中最常用的写法（见第五章实战案例），比先获取 `MethodSignature` 再反射读注解更简洁。

***

### 3.3 @within 表达式

匹配带有指定注解的**类**中的所有方法：

```java
// 匹配所有 @Service 注解类中的方法
@Pointcut("@within(org.springframework.stereotype.Service)")

// 匹配所有标注了自定义 @Module 注解的类中的方法
@Pointcut("@within(com.example.annotation.Module)")
```

**`@within` vs `@annotation`：**

| 表达式 | 注解加在哪 | 匹配哪些方法 |
| ------ | ---------- | ------------ |
| `@annotation(X)` | **方法**上 | 直接标注了 X 的方法 |
| `@within(X)` | **类**上 | 类被 X 标注时，该类的**所有方法** |

```java
// @annotation：只有 methodA 被增强（注解在方法上）
public class MyService {
    @Log
    public void methodA() { }   // ✅ 被增强
    public void methodB() { }   // ❌ 不被增强
}

// @within：MyService 的所有方法都被增强（注解在类上）
@Log
public class MyService {
    public void methodA() { }   // ✅ 被增强
    public void methodB() { }   // ✅ 被增强
}
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

### 3.5 within 与 bean 表达式

**within**：按类型或包名匹配所有方法，不关心方法签名，比 `execution` 更简洁：

```java
// 匹配 service 包下所有类的所有方法
@Pointcut("within(com.example.service.*)")

// 匹配 service 包及子包下所有类的所有方法
@Pointcut("within(com.example.service..*)")

// 匹配 UserService 类的所有方法
@Pointcut("within(com.example.service.UserService)")
```

> 💡 `within` 按**静态声明类型**匹配。使用 JDK 动态代理时（目标类实现了接口），代理对象类型与目标类型不同，`within(TargetClass)` 可能不生效——应改用 `target(TargetClass)`。Spring Boot 默认 CGLIB 代理，通常无此问题。

**bean**：按 Spring Bean 名称匹配，Spring AOP 独有（AspectJ 不支持）：

```java
// 精确匹配
@Pointcut("bean(userService)")

// 通配符：所有名称以 Service 结尾的 Bean
@Pointcut("bean(*Service)")
```

**`within` vs `execution` 选型：**

| 场景 | 推荐表达式 |
| ---- | ---------- |
| 拦截某包/子包下所有方法 | `within(com.example.service..)` |
| 按返回类型、参数签名精细过滤 | `execution(...)` |
| 按 Bean 名称拦截（Spring 环境） | `bean(*Service)` |

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

> ⚠️ 示例中 `deptId`/`userId` 均来自服务端已验证的数据库字段，无直接注入风险。实际使用时 `deptAlias`/`userAlias` 应来自编译期注解常量，禁止将运行时的外部输入直接拼接到 SQL 片段，否则需做严格白名单校验。

***

## 六、AOP 底层原理与注意事项

### 6.1 代理方式

Spring AOP 使用两种代理方式：

| 代理方式         | 底层机制                   | 限制                                     |
| ---------------- | -------------------------- | ---------------------------------------- |
| **JDK 动态代理** | 反射，基于接口生成代理类   | 目标类必须实现接口                       |
| **CGLIB 代理**   | 字节码，基于继承生成子类   | 目标类和被代理方法不能是 `final`         |

**代理选择策略：**

| 场景 | Spring Framework 默认 | Spring Boot 2.x+ 默认 |
|------|----------------------|----------------------|
| 目标类实现了接口 | JDK 动态代理 | CGLIB |
| 目标类未实现接口 | CGLIB | CGLIB |

Spring Boot 2.x 将 `spring.aop.proxy-target-class` 默认设为 `true`，统一使用 CGLIB，减少因「有接口用 JDK 代理 / 无接口用 CGLIB」导致的行为差异。如需显式切换：

```yaml
# 强制 JDK 动态代理（目标类必须实现接口，否则报错）
spring:
  aop:
    proxy-target-class: false
```

#### JDK 动态代理原理

核心是 `java.lang.reflect.Proxy` + `InvocationHandler`。Spring 在运行时生成一个实现了目标接口的代理类，所有方法调用都会转发到 `InvocationHandler.invoke()`，在这里织入切面逻辑后再通过反射调用目标方法。

```
调用方 → 代理对象（实现相同接口）
            ↓
        InvocationHandler.invoke()
            ↓   前置逻辑（切面）
        反射调用目标方法
            ↓   后置逻辑（切面）
        返回结果
```

```java
// Spring 内部等价逻辑（简化示意）
Proxy.newProxyInstance(
    target.getClass().getClassLoader(),
    target.getClass().getInterfaces(),
    (proxy, method, args) -> {
        // 前置切面逻辑
        Object result = method.invoke(target, args);  // 反射调用目标方法
        // 后置切面逻辑
        return result;
    }
);
```

#### CGLIB 代理原理

CGLIB（Code Generation Library）在运行时通过 ASM 直接操作字节码，生成目标类的子类，子类中重写所有非 `final` 方法，在重写方法中插入切面逻辑，再调用 `super.xxx()` 执行原始方法。

```
调用方 → 代理子类（继承目标类）
            ↓
        重写的方法（MethodInterceptor.intercept()）
            ↓   前置逻辑（切面）
        super.method()  // 调用目标类原始方法
            ↓   后置逻辑（切面）
        返回结果
```

> 💡 CGLIB 是字节码级别的子类调用（`super.method()`），JDK 代理是反射调用（`method.invoke()`）。CGLIB 的调用开销略低于 JDK 代理，但两者均在微秒量级，对业务影响可忽略不计。

#### Spring AOP 的适用范围限制

Spring AOP 基于代理实现，有以下固有限制：

| 限制                     | 说明                                                                |
| ------------------------ | ------------------------------------------------------------------- |
| **只能增强 public 方法** | private/protected 方法不会被代理拦截                                |
| **只能增强 Spring Bean** | 通过 `new` 手动创建的对象不受 Spring 管理，切面不生效               |
| **只支持方法级连接点**   | 不能拦截字段访问、构造器调用（需 AspectJ 编译时织入才能实现）       |
| **同类方法调用不生效**   | `this.method()` 绕过代理直接调用原始对象，切面不触发               |

***

### 6.2 代理对象的创建时机

代理对象在 Bean 生命周期的 `BeanPostProcessor.postProcessAfterInitialization()` 阶段创建，由 `AbstractAutoProxyCreator` 负责扫描切面并包装目标 Bean。

```
Bean 实例化 → 属性注入 → 初始化（@PostConstruct）→ BeanPostProcessor → 创建代理对象（AOP）
```

> 💡 代理对象创建发生在应用启动阶段，每个被增强的 Bean 只创建一次代理，与请求并发量无关，不会影响运行期性能。

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

**解决方案三：将被调用方法提取到独立 Bean（推荐）**

```java
@Service
public class UserOperationService {

    @Transactional
    public void methodB() {
        // ...
    }
}

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserOperationService userOperationService;

    public void methodA() {
        userOperationService.methodB();  // ✅ 跨 Bean 调用，天然走代理
    }
}
```

> 💡 方案三符合单一职责原则，同时规避了方案一的循环依赖风险和方案二的强转代码气味，是生产代码中的首选做法。

***

### 6.4 性能开销

#### 开销来源

| 阶段         | 类型             | 量级       | 说明                                                   |
| ------------ | ---------------- | ---------- | ------------------------------------------------------ |
| **启动阶段** | 代理对象创建     | 一次性     | 随 Bean 初始化完成，与请求并发无关，可忽略             |
| **调用阶段** | 代理调用额外开销 | 微秒级     | CGLIB 字节码子类调用；JDK 代理走反射，略慢于 CGLIB     |
| **调用阶段** | 切面逻辑本身     | 取决于内容 | 同步 IO（写数据库、写文件）才是真正的性能瓶颈          |

#### 实际影响判断

代理机制本身的额外延迟在微秒量级，对毫秒级的 HTTP 接口可以忽略不计。切面是否影响性能，核心在于**切面逻辑的内容**：

- 切面只做**内存操作**（提取参数、序列化字符串）：无需关注性能
- 切面内有**同步 IO**（写数据库日志、写文件）：IO 本身是瓶颈，与 AOP 机制本身无关

#### 切面 IO 异步化

同步写日志会阻塞主调用链，推荐通过 `@Async` 将切面中的 IO 操作异步化：

```java
// 启动类启用异步支持
@SpringBootApplication
@EnableAsync
public class Application { }

// 日志服务异步写入，主线程不阻塞
@Service
public class SysLogService {

    @Async
    public void saveAsync(SysLog sysLog) {
        sysLogMapper.insert(sysLog);
    }
}
```

> 💡 `@Async` 同样基于 Spring 代理实现，在同类内直接调用不生效；且异步方法抛出的异常不会传播到调用方，需在方法内自行捕获处理。

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
