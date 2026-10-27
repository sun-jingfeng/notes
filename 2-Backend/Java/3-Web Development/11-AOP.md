## I. AOP Overview

### 1.1 What Is AOP?

**AOP (Aspect-Oriented Programming)** is a programming paradigm that separates cross-cutting concerns (such as logging, transactions, and permissions) from business logic.

**Core idea:** Enhance functionality without changing the original code.

    ┌──────────────────────────────────────────────────────────────┐
    │                        Traditional approach (intrusive code) │
    │                                                              │
    │  public void transfer() {                                    │
    │      log.info("Start transfer");     // Logging              │
    │      checkPermission();              // Permission check     │
    │      beginTransaction();             // Begin transaction    │
    │                                                              │
    │      // Core business logic                                  │
    │      accountDao.decrease(from, money);                       │
    │      accountDao.increase(to, money);                         │
    │                                                              │
    │      commitTransaction();            // Commit transaction   │
    │      log.info("Transfer complete");  // Logging              │
    │  }                                                           │
    ├──────────────────────────────────────────────────────────────┤
    │                        AOP approach (decoupled)              │
    │                                                              │
    │  public void transfer() {                                    │
    │      // Focus only on core business logic                    │
    │      accountDao.decrease(from, money);                       │
    │      accountDao.increase(to, money);                         │
    │  }                                                           │
    │                                                              │
    │  // Aspects handle logging, permissions, transactions, etc.  │
    └──────────────────────────────────────────────────────────────┘

***

### 1.2 Core Concepts

| Concept | Description | Example |
| --------------------- | ---------------------------------------------- | ------------------------------- |
| **Aspect** | Class encapsulating a cross-cutting concern, containing advice and pointcuts | Logging aspect, transaction aspect |
| **Join point** | Point in program execution where an aspect can be applied | Method call, method execution |
| **Pointcut** | Defines which join points an aspect advises | `execution(* com.example.service.*.*(..))` |
| **Advice** | Action performed by an aspect at a particular join point | Before, after, around advice |
| **Target** | Object advised by an aspect | UserService |
| **Proxy** | Proxy object created by AOP to implement aspect logic | JDK dynamic proxy, CGLIB proxy |
| **Weaving** | Applying aspects to target objects and creating proxies | Spring AOP weaves at runtime; AspectJ additionally supports compile-time and load-time weaving |

**Concept relationships:**

    Aspect = Pointcut + Advice

    ┌──────────────────────────────────────────────────────────────┐
    │  @Aspect                                                     │
    │  public class LogAspect {                                    │
    │                                                              │
    │      @Pointcut("execution(* com.example.service.*.*(..))")   │  ← Pointcut
    │      public void servicePointcut() {}                        │
    │                                                              │
    │      @Before("servicePointcut()")                            │  ← Advice
    │      public void before() {                                  │
    │          log.info("Before method execution");                │
    │      }                                                       │
    │  }                                                           │
    └──────────────────────────────────────────────────────────────┘

***

### 1.3 AOP Use Cases

| Scenario | Description |
| ------------ | ---------------------------------- |
| **Logging** | Record method calls, arguments, return values, and duration |
| **Transaction management** | Manage database transactions centrally |
| **Permission checks** | Check whether users may perform an operation |
| **Performance monitoring** | Measure method execution time |
| **Exception handling** | Handle exceptions centrally and record their details |
| **Caching** | Cache method results |
| **Parameter validation** | Validate method arguments centrally |

***

### 1.4 Spring AOP and AspectJ

Spring AOP and AspectJ are both AOP frameworks, but serve different needs:

| Dimension | Spring AOP | AspectJ |
|------|-----------|--------|
| **Implementation** | Runtime proxies (JDK / CGLIB) | Compile-time / load-time bytecode weaving |
| **Supported join points** | Method execution only | Methods, field access, constructor calls, etc. |
| **Dependencies** | Uses the Spring container; no extra dependencies | Requires the AspectJ compiler or a Java agent |
| **Use cases** | Most business scenarios | Advanced scenarios such as intercepting private methods or field access |
| **Complexity** | Low | High |

Spring AOP provides **syntax support** for AspectJ annotations (`@Aspect`, `@Pointcut`, `@Around`, etc.), but still uses runtime proxies rather than AspectJ's static weaving. Spring AOP therefore has inherent proxy limitations (method visibility restrictions, self-invocation bypassing advice, etc.); AspectJ compile-time weaving does not have these proxy limitations.

> 💡 Spring AOP is sufficient for everyday Spring Boot projects. AspectJ is worth introducing only for scenarios such as intercepting private methods or field access that proxies cannot handle.

***

## II. Spring AOP Basics

### 2.1 Add the Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

> 💡 Spring Boot enables AOP automatically; no extra configuration is needed.

***

### 2.2 Core Annotations

| Annotation | Target | Description |
| ----------------- | -------- | ---------------------------------------------- |
| `@Aspect` | Class | Declare the class as an aspect |
| `@Pointcut` | Method | Define a pointcut specifying which methods are advised |
| `@Before` | Method | Before advice: runs before the target method |
| `@After` | Method | After advice: runs after the target method, whether or not it throws |
| `@AfterReturning` | Method | After-returning advice: runs after the target method returns normally |
| `@AfterThrowing` | Method | After-throwing advice: runs after the target method throws an exception |
| `@Around` | Method | Around advice: wraps the target method and can fully control execution |

**Annotations in detail:**

**@Aspect**
```java
@Aspect      // Declare this class as an aspect
@Component   // Combine with @Component so Spring manages it
public class LogAspect {
    // ...
}
```

**@Pointcut**
```java
// Define a pointcut: match all methods of all classes in the service package
@Pointcut("execution(* com.example.service.*.*(..))")
public void servicePointcut() {}  // The method name names the pointcut; its body is empty

// Reference the pointcut from advice
@Before("servicePointcut()")
public void before() { }
```

**@Before / @After / @Around**
```java
@Before("servicePointcut()")           // Reference a defined pointcut
public void before() { }

@After("execution(* com.example..*.*(..))")  // Or write an expression directly
public void after() { }

@Around("servicePointcut()")
public Object around(ProceedingJoinPoint pjp) throws Throwable {
    // Before logic
    Object result = pjp.proceed();  // Execute the target method (⚠️ required for the target method to run)
    // After logic
    return result;
}
```

**@AfterReturning / @AfterThrowing**
```java
// returning specifies the parameter that receives the return value
@AfterReturning(pointcut = "servicePointcut()", returning = "result")
public void afterReturning(Object result) {
    log.info("Return value: {}", result);
}

// throwing specifies the parameter that receives the exception
@AfterThrowing(pointcut = "servicePointcut()", throwing = "ex")
public void afterThrowing(Exception ex) {
    log.error("Exception: {}", ex.getMessage());
}
```

#### Annotation Attribute Reference

Complete attribute lists for advice annotations:

| Annotation | Attribute | Type | Required | Description |
| ----------------- | --------------------- | ------ | ---- | ---------------------------------------------------------- |
| `@Aspect` | — | — | — | No attributes |
| `@Pointcut` | `value` | String | Yes | Pointcut expression (default attribute; its name can be omitted) |
| `@Pointcut` | `argNames` | String | No | Comma-separated parameter names for argument binding |
| `@Before` | `value` | String | Yes | Pointcut expression or reference to a defined pointcut method |
| `@Before` | `argNames` | String | No | Comma-separated parameter names for argument binding |
| `@After` | `value` | String | Yes | Pointcut expression or reference to a defined pointcut method |
| `@After` | `argNames` | String | No | Comma-separated parameter names for argument binding |
| `@AfterReturning` | `value` / `pointcut` | String | Yes | Pointcut expression (aliases; choose one; use `pointcut` when specifying other attributes) |
| `@AfterReturning` | `returning` | String | No | Advice parameter receiving the return value; its type must be compatible with the target method's return type |
| `@AfterReturning` | `argNames` | String | No | Comma-separated parameter names for argument binding |
| `@AfterThrowing` | `value` / `pointcut` | String | Yes | Pointcut expression (aliases; choose one; use `pointcut` when specifying other attributes) |
| `@AfterThrowing` | `throwing` | String | No | Advice parameter receiving the exception; its type must be compatible with the exception thrown by the target method |
| `@AfterThrowing` | `argNames` | String | No | Comma-separated parameter names for argument binding |
| `@Around` | `value` | String | Yes | Pointcut expression or reference to a defined pointcut method |
| `@Around` | `argNames` | String | No | Comma-separated parameter names for argument binding |

> 💡 `value` is the default attribute of advice annotations, so its name can be omitted when used alone: `@Before("pointcut()")` is equivalent to `@Before(value = "pointcut()")`.
>
> 💡 `argNames` can be inferred when compilation preserves parameter names (the `-parameters` flag or `-g` debug symbols), so it normally need not be specified manually. Explicitly declare it only when compiler optimization has removed parameter names, using a comma-separated string such as `argNames = "joinPoint,userId"`.

***

### 2.3 Basic Usage Example

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

    // ==================== Define the pointcut ====================

    @Pointcut("execution(* com.example.service.*.*(..))")
    public void servicePointcut() {}

    // ==================== Before advice ====================

    @Before("servicePointcut()")
    public void before(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        log.info("[Before advice] Method: {}, arguments: {}", methodName, Arrays.toString(args));
    }

    // ==================== After advice ====================

    @After("servicePointcut()")
    public void after(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        log.info("[After advice] Method: {} finished", methodName);
    }

    // ==================== After-returning advice ====================

    @AfterReturning(pointcut = "servicePointcut()", returning = "result")
    public void afterReturning(JoinPoint joinPoint, Object result) {
        String methodName = joinPoint.getSignature().getName();
        log.info("[After-returning advice] Method: {}, return value: {}", methodName, result);
    }

    // ==================== After-throwing advice ====================

    @AfterThrowing(pointcut = "servicePointcut()", throwing = "ex")
    public void afterThrowing(JoinPoint joinPoint, Exception ex) {
        String methodName = joinPoint.getSignature().getName();
        log.error("[After-throwing advice] Method: {}, exception: {}", methodName, ex.getMessage());
    }

    // ==================== Around advice ====================

    @Around("servicePointcut()")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        String methodName = pjp.getSignature().getName();

        log.info("[Around advice - before] Method: {} starting", methodName);
        long startTime = System.currentTimeMillis();

        try {
            Object result = pjp.proceed();  // Execute the target method

            long endTime = System.currentTimeMillis();
            log.info("[Around advice - after] Method: {} completed, duration: {}ms", methodName, endTime - startTime);

            return result;
        } catch (Throwable e) {
            log.error("[Around advice - exception] Method: {} threw an exception", methodName);
            throw e;
        }
    }
}
```

***

### 2.4 JoinPoint in Detail

#### What Is JoinPoint?

`JoinPoint` is a core AOP concept representing a point in program execution, such as a method call or an exception being thrown. In Spring AOP, **a JoinPoint always represents a method execution**.

A JoinPoint object provides information about the method being advised, including its name, arguments, and target object.

#### JoinPoint vs ProceedingJoinPoint

| Type | Applicable advice | Distinct capabilities |
| --------------------- | -------------------------------------------------- | ---------------------- |
| `JoinPoint` | @Before, @After, @AfterReturning, @AfterThrowing | Access method information |
| `ProceedingJoinPoint` | **@Around only** | Extends JoinPoint and controls target method execution |

> 💡 `ProceedingJoinPoint` extends `JoinPoint` and adds `proceed()` to execute the target method.

#### Argument Injection Rules for Advice Methods

Spring AOP follows fixed conventions for injecting advice arguments, in three categories:

| Parameter type | Description | Constraints |
| -------- | ---- | ---- |
| `JoinPoint` / `ProceedingJoinPoint` | Fixed AspectJ convention: injected by the framework with runtime information about the intercepted method (name, arguments, target object, etc.); **not a business argument** | Must be the **first parameter**; does not participate in pointcut matching |
| Pointcut-bound parameters (annotation instances, target method arguments, etc.) | Bound by matching names in the pointcut expression to parameter names; types must be compatible with actual values | Names must match expression identifiers; types also participate in **static pointcut filtering** |
| `returning` / `throwing` parameters | Bind return values or exceptions through `@AfterReturning(returning=)` / `@AfterThrowing(throwing=)` | Names must match annotation attribute values; types participate in **runtime dynamic filtering** |

```java
// @Before / @After: optional JoinPoint as the first parameter
@Before("pointcut()")
public void before(JoinPoint joinPoint) { }

// @AfterReturning: can additionally receive the return value
@AfterReturning(pointcut = "pointcut()", returning = "result")
public void afterReturning(JoinPoint joinPoint, Object result) { }

// @AfterThrowing: can additionally receive the exception
@AfterThrowing(pointcut = "pointcut()", throwing = "ex")
public void afterThrowing(JoinPoint joinPoint, Throwable ex) { }

// @Around: use ProceedingJoinPoint and call proceed()
@Around("pointcut()")
public Object around(ProceedingJoinPoint pjp) throws Throwable {
    return pjp.proceed();  // Required for the target method to run
}
```

#### Argument Binding in Pointcut Expressions

Besides receiving JoinPoint, advice methods can bind target method argument values, annotation instances, target objects, etc. directly through pointcut expressions. The names in the expression must match advice parameter names, and types must be compatible with the actual values.

```java
// Bind target method arguments with args(): match methods whose first argument is Long and bind its value
@Before("execution(* com.example.service.*.*(..)) && args(userId,..)")
public void before(Long userId) {
    log.info("userId: {}", userId);
}

// When also using JoinPoint, it must be the first parameter
@Before("execution(* com.example.service.*.*(..)) && args(id,..)")
public void before(JoinPoint joinPoint, Long id) {
    log.info("Method: {}, id: {}", joinPoint.getSignature().getName(), id);
}

// Bind an annotation instance with @annotation(): matching parameter names let Spring inject the annotation object
@Around("@annotation(operationLog)")
public Object around(ProceedingJoinPoint pjp, OperationLog operationLog) throws Throwable {
    String module = operationLog.module();  // Read annotation attributes directly, without reflection
    return pjp.proceed();
}

// Bind the target object with target(): the original proxied object, not the proxy
@Before("target(service)")
public void before(UserService service) { }

// Bind the proxy object with this(): the Spring proxy
@Before("this(proxy)")
public void before(UserService proxy) { }
```

> 💡 Argument binding also filters by type: `args(Long,..)` matches only calls whose first argument can be cast to `Long`; `target(UserService)` matches only methods whose target is a `UserService`.

#### Filtering Stages for Argument Binding

Advice argument binding involves two filtering stages. Both can prevent advice from running, but at different times:

| Binding mechanism | Filtering stage | Result of a type mismatch |
| -------- | -------- | ---------------- |
| Expression in `pointcut`/`value` (such as `@annotation(x)` or `args(y)`) | **Static matching at startup**, determined when the proxy is created | The target method is **not intercepted at all**; the proxy does not intervene |
| Type of the parameter bound by `returning = "x"` | **Dynamic filtering at runtime**, checked on each method call | The target method **has been intercepted**, but this advice is skipped |
| Type of the parameter bound by `throwing = "x"` | **Dynamic filtering at runtime**, checked on each method call | The target method **has been intercepted**, but this advice is skipped |

```text
Target method is called
      │
      ▼
┌─────────────────────────────────────┐
│  Static pointcut matching (startup) │  ← No match → No interception
└─────────────┬───────────────────────┘
              │ Match: target method executes
              ├──────────────────────────────────────────┐
              ▼ Returns normally                         ▼ Throws an exception
┌─────────────────────────────────┐        ┌────────────────────────────────┐
│  returning parameter type check │        │  throwing parameter type check │
│  (runtime)                      │        │  (runtime)                     │
└─────────────┬───────────────────┘        └─────────────┬──────────────────┘
              │ No match → Skip advice                   │ No match → Skip advice
              ▼ Match                                    ▼ Match
  Execute doAfterReturning                    Execute doAfterThrowing
```

Using `Object`/`Throwable` for `returning`/`throwing` parameters accepts the broadest range of values without filtering; this is the most common approach. With a specific type, the advice runs only when the actual value matches:

```java
// This advice runs only when the actual return value is a String
@AfterReturning(pointcut = "@annotation(controllerLog)", returning = "result")
public void afterReturning(Log controllerLog, String result) { ... }

// This advice runs only for BusinessException (or a subclass)
@AfterThrowing(pointcut = "@annotation(controllerLog)", throwing = "e")
public void afterThrowing(Log controllerLog, BusinessException e) { ... }
```

> 💡 Prefer expressing conditions in the `pointcut` expression when possible (determined once at startup, at the lowest cost), avoiding runtime type checks on every method call.

#### Common JoinPoint Methods

| Method | Return type | Description |
| --------------------------------------- | ---------- | ---------------------------- |
| `getSignature()` | Signature | Get the method signature object |
| `getSignature().getName()` | String | Get the method name |
| `getSignature().getDeclaringType()` | `Class<?>` | Get the class declaring the method |
| `getSignature().getDeclaringTypeName()` | String | Get the name of the class declaring the method |
| `getArgs()` | Object[] | Get the method argument array |
| `getTarget()` | Object | Get the target (original proxied object) |
| `getThis()` | Object | Get the proxy object |

#### Methods Specific to ProceedingJoinPoint

| Method | Return type | Description |
| ----------------- | -------- | ------------------------------------ |
| `proceed()` | Object | Execute the target method and return its result |
| `proceed(args)` | Object | Execute the target method with new arguments (arguments can be modified) |

#### Usage Example

```java
@Around("@annotation(operationLog)")
public Object around(ProceedingJoinPoint pjp, OperationLog operationLog) throws Throwable {
    // Get method information
    MethodSignature signature = (MethodSignature) pjp.getSignature();
    String className = signature.getDeclaringTypeName();  // Class name
    String methodName = signature.getName();              // Method name
    Class<?> returnType = signature.getReturnType();      // Return type
    String[] paramNames = signature.getParameterNames();  // Parameter name array
    Class<?>[] paramTypes = signature.getParameterTypes();// Parameter type array

    // Get actual argument values
    Object[] args = pjp.getArgs();

    // Get the target and proxy objects
    Object target = pjp.getTarget();  // Original object
    Object proxy = pjp.getThis();     // Proxy object

    // Execute the target method
    Object result = pjp.proceed();

    // Execute with modified arguments (optional)
    // Object result = pjp.proceed(new Object[]{"newArg1", "newArg2"});

    return result;
}
```

> 💡 **MethodSignature:** `getSignature()` returns the `Signature` interface. Cast it to `MethodSignature` to obtain more method information (parameter names, parameter types, return type, etc.).

***

## III. Pointcut Expressions

### 3.1 execution Expressions (Most Common)

**Syntax:**

```text
execution(accessModifier? returnType packageName.className.?methodName(parameters) throws exception?)
```

> Parts marked with `?` are optional:
> - **Access modifier:** Optional (such as `public` or `protected`)
> - **packageName.className.:** Optional
> - **throws exception:** Optional (the exception declared on the method, not the exception actually thrown)

**Wildcards:**

| Symbol | Description |
| ------ | ---------------------------------------- |
| `*` | Match any single element (one level) |
| `..` | Match any number of elements (multiple package levels, any arguments) |
| `+` | Match the specified class and its subclasses |

**Common examples:**

```java
// Match all methods of all classes in the com.example.service package
@Pointcut("execution(* com.example.service.*.*(..))")

// Match all methods of all classes in com.example and its subpackages
@Pointcut("execution(* com.example..*.*(..))")

// Match all public methods
@Pointcut("execution(public * *(..))")

// Match methods returning String
@Pointcut("execution(String *(..))")

// Match methods whose names start with get
@Pointcut("execution(* get*(..))")

// Match all methods of UserService
@Pointcut("execution(* com.example.service.UserService.*(..))")

// Match methods with exactly one Long parameter
@Pointcut("execution(* *(Long))")

// Match methods whose first parameter is Long
@Pointcut("execution(* *(Long, ..))")
```

***

### 3.2 @annotation Expressions

Match methods bearing a specified annotation:

```java
// Match methods annotated with @Transactional
@Pointcut("@annotation(org.springframework.transaction.annotation.Transactional)")

// Match methods bearing a custom annotation
@Pointcut("@annotation(com.example.annotation.Log)")
```

**Argument-binding shorthand (common):**

When an advice parameter name matches the name in `@annotation()`, Spring injects the annotation instance automatically, without manually retrieving its attributes through reflection:

```java
// "operationLog" in the expression matches the parameter name; Spring injects the annotation object
@Around("@annotation(operationLog)")
public Object around(ProceedingJoinPoint pjp, OperationLog operationLog) throws Throwable {
    String module = operationLog.module();      // Read annotation attributes directly
    String operation = operationLog.operation();
    return pjp.proceed();
}
```

> 💡 This is the most common approach in practice, such as in operation-logging aspects, and is simpler than obtaining `MethodSignature` and reading the annotation through reflection.

***

### 3.3 @within Expressions

Match all methods in **classes** bearing a specified annotation:

```java
// Match methods in all classes annotated with @Service
@Pointcut("@within(org.springframework.stereotype.Service)")

// Match methods in all classes bearing the custom @Module annotation
@Pointcut("@within(com.example.annotation.Module)")
```

**`@within` vs `@annotation`:**

| Expression | Annotation location | Methods matched |
| ------ | ---------- | ------------ |
| `@annotation(X)` | **Method** | Methods directly annotated with X |
| `@within(X)` | **Class** | **All methods** of a class annotated with X |

```java
// @annotation: only methodA is advised (annotation on the method)
public class MyService {
    @Log
    public void methodA() { }   // ✅ Advised
    public void methodB() { }   // ❌ Not advised
}

// @within: all MyService methods are advised (annotation on the class)
@Log
public class MyService {
    public void methodA() { }   // ✅ Advised
    public void methodB() { }   // ✅ Advised
}
```

***

### 3.4 Combining Expressions

Combine pointcuts with `&&`, `||`, and `!`:

```java
// Match methods in the service package except those starting with get
@Pointcut("execution(* com.example.service.*.*(..)) && !execution(* get*(..))")

// Match methods in the service or controller package
@Pointcut("execution(* com.example.service.*.*(..)) || execution(* com.example.controller.*.*(..))")
```

***

### 3.5 within and bean Expressions

**within:** Match all methods by type or package without considering method signatures; simpler than `execution`:

```java
// Match all methods of all classes in the service package
@Pointcut("within(com.example.service.*)")

// Match all methods of all classes in the service package and subpackages
@Pointcut("within(com.example.service..*)")

// Match all methods of UserService
@Pointcut("within(com.example.service.UserService)")
```

> 💡 `within` matches the type that declares the advised method, evaluated against the target class, so it works with both proxy types. The related `this(Type)` designator matches the **proxy object**: with a JDK dynamic proxy (interface-based), the proxy is not an instance of the target class, so `this(TargetClass)` does not match; use `target(TargetClass)` instead. Spring Boot defaults to CGLIB proxies, where both match.

**bean:** Match by Spring bean name; specific to Spring AOP (not supported by AspectJ):

```java
// Exact match
@Pointcut("bean(userService)")

// Wildcard: all beans whose names end with Service
@Pointcut("bean(*Service)")
```

**Choosing between `within` and `execution`:**

| Scenario | Recommended expression |
| ---- | ---------- |
| Intercept all methods in a package/subpackages | `within(com.example.service..*)` |
| Filter precisely by return type and parameter signature | `execution(...)` |
| Intercept by bean name (Spring environment) | `bean(*Service)` |

***

## IV. Advice Execution Order

### 4.1 Execution Order within One Aspect

| Advice type | Execution timing |
| ---------------- | ------------------------------ |
| `@Around` (before) | Runs first |
| `@Before` | Before the target method |
| **Target method** | Actual business logic |
| `@AfterReturning` | After the target method returns normally |
| `@AfterThrowing` | After the target method throws an exception |
| `@After` | After the target method, whether or not it throws |
| `@Around` (after) | Runs last |

**Execution flow:**

    Normal: @Around before → @Before → Target method → @AfterReturning → @After → @Around after
    Exception: @Around before → @Before → Target method (throws) → @AfterThrowing → @After

> 💡 **Note:** This order applies to **Spring 5.2.7+**. In older versions, `@After` runs before `@AfterReturning`/`@AfterThrowing`.

***

### 4.2 Execution Order across Aspects (@Order)

Use `@Order` to control execution order across aspects; lower numbers have higher priority:

```java
@Aspect
@Component
@Order(1)  // Lower numbers mean higher priority
public class FirstAspect {
    @Around("execution(* com.example.service.*.*(..))")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        log.info("FirstAspect before");
        Object result = pjp.proceed();
        log.info("FirstAspect after");
        return result;
    }
}

@Aspect
@Component
@Order(2)
public class SecondAspect {
    @Around("execution(* com.example.service.*.*(..))")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        log.info("SecondAspect before");
        Object result = pjp.proceed();
        log.info("SecondAspect after");
        return result;
    }
}
```

**Execution order (onion model):**

    FirstAspect before
        SecondAspect before
            Target method
        SecondAspect after
    FirstAspect after

***

### 4.3 Suggested Ordering in Practice

| Order | Aspect type | Description |
| ---- | ------------ | ---------------------------- |
| 1 | Logging | Enter first and exit last to capture the whole operation |
| 2 | Permission | Reject unauthorized requests early |
| 3 | Cache | Return immediately on a cache hit |
| 4 | Transaction | Wrap the business logic |
| 5 | Business | Closest to the target method |

***

## V. Practical Examples

### 5.1 Operation Logging

**Custom annotation:**

```java
package com.example.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface OperationLog {

    /** Operation module */
    String module() default "";

    /** Operation type */
    String operation() default "";

    /** Operation description */
    String description() default "";
}
```

**Logging aspect:**

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

        // Get request information
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes != null ? attributes.getRequest() : null;

        // Build the log object
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
            sysLog.setStatus(1);  // Success
            sysLog.setResult(objectMapper.writeValueAsString(result));
        } catch (Throwable e) {
            sysLog.setStatus(0);  // Failure
            sysLog.setErrorMsg(e.getMessage());
            throw e;
        } finally {
            sysLog.setCostTime(System.currentTimeMillis() - startTime);
            // Save the log asynchronously
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
        // Use the first address when multiple proxy levels are involved
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}
```

**Usage example:**

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    @OperationLog(module = "User management", operation = "Create", description = "Create a user")
    public Result<Void> add(@RequestBody @Valid UserDTO dto) {
        userService.add(dto);
        return Result.success();
    }

    @PutMapping("/{id}")
    @OperationLog(module = "User management", operation = "Update", description = "Update user information")
    public Result<Void> update(@PathVariable Long id, @RequestBody @Valid UserDTO dto) {
        userService.update(id, dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    @OperationLog(module = "User management", operation = "Delete", description = "Delete a user")
    public Result<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return Result.success();
    }
}
```

***

### 5.2 Measuring Method Execution Time

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

    /** Slow-method threshold (milliseconds) */
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
                log.warn("[Slow method warning] {} took {}ms", methodName, costTime);
            } else {
                log.debug("[Method duration] {} took {}ms", methodName, costTime);
            }
        }
    }
}
```

***

### 5.3 Endpoint Idempotency Checks

**Custom annotation:**

```java
package com.example.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Idempotent {

    /** Idempotency key prefix */
    String prefix() default "idempotent";

    /** Expiration time (seconds) */
    int expireSeconds() default 5;

    /** Message */
    String message() default "Please do not submit repeatedly";
}
```

**Idempotency aspect:**

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
        // Build the idempotency key: prefix + user ID + class name + method name
        MethodSignature signature = (MethodSignature) pjp.getSignature();
        String key = String.format("%s:%s:%s:%s",
                idempotent.prefix(),
                UserContext.getUserId(),
                signature.getDeclaringTypeName(),
                signature.getName()
        );

        // Try setting the key (succeeds only if it does not exist)
        Boolean success = redisTemplate.opsForValue()
                .setIfAbsent(key, "1", idempotent.expireSeconds(), TimeUnit.SECONDS);

        if (Boolean.FALSE.equals(success)) {
            throw new BusinessException(idempotent.message());
        }

        try {
            return pjp.proceed();
        } catch (Throwable e) {
            // Delete the key on an exception to allow retries
            redisTemplate.delete(key);
            throw e;
        }
    }
}
```

**Usage example:**

```java
@PostMapping("/orders")
@Idempotent(prefix = "order:create", expireSeconds = 10, message = "Order is being processed; please do not submit again")
public Result<Long> createOrder(@RequestBody @Valid OrderDTO dto) {
    return Result.success(orderService.create(dto));
}
```

***

### 5.4 Data Access Control

**Custom annotation:**

```java
package com.example.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DataScope {

    /** Department table alias */
    String deptAlias() default "d";

    /** User table alias */
    String userAlias() default "u";
}
```

**Data permission aspect (used with MyBatis):**

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

        // Build data permission SQL based on the user's role
        StringBuilder sqlBuilder = new StringBuilder();

        switch (user.getDataScope()) {
            case 1:  // Access to all data
                break;
            case 2:  // Access to the user's department
                sqlBuilder.append(String.format(" AND %s.dept_id = %d",
                        dataScope.deptAlias(), user.getDeptId()));
                break;
            case 3:  // Access to the user's department and subordinate departments
                sqlBuilder.append(String.format(" AND %s.dept_id IN (SELECT id FROM sys_dept WHERE id = %d OR FIND_IN_SET(%d, ancestors))",
                        dataScope.deptAlias(), user.getDeptId(), user.getDeptId()));
                break;
            case 4:  // Access only to the user's own data
                sqlBuilder.append(String.format(" AND %s.user_id = %d",
                        dataScope.userAlias(), userId));
                break;
            default:
                break;
        }

        // Store the SQL fragment in ThreadLocal for concatenation in the Mapper
        DataScopeContext.set(sqlBuilder.toString());
    }
}
```

> ⚠️ In this example, `deptId`/`userId` are verified database fields obtained on the server, so there is no direct injection risk. In practice, `deptAlias`/`userAlias` should come from compile-time annotation constants. Never concatenate external runtime input directly into SQL fragments without strict allowlist validation.

***

## VI. AOP Internals and Caveats

### 6.1 Proxy Mechanisms

Spring AOP uses two proxy mechanisms:

| Proxy mechanism | Underlying implementation | Limitations |
| ---------------- | -------------------------- | ---------------------------------------- |
| **JDK dynamic proxy** | Reflection; generates a proxy class from interfaces | The target class must implement an interface |
| **CGLIB proxy** | Bytecode; generates a subclass through inheritance | The target class and proxied methods must not be `final` |

**Proxy selection:**

| Scenario | Spring Framework default | Spring Boot 2.x+ default |
|------|----------------------|----------------------|
| Target class implements an interface | JDK dynamic proxy | CGLIB |
| Target class has no interface | CGLIB | CGLIB |

Spring Boot 2.x defaults `spring.aop.proxy-target-class` to `true`, consistently using CGLIB to reduce behavioral differences between JDK proxies for classes with interfaces and CGLIB for classes without them. To switch explicitly:

```yaml
# Prefer JDK dynamic proxies; still use CGLIB if the target class has no suitable interface
spring:
  aop:
    proxy-target-class: false
```

#### How JDK Dynamic Proxies Work

The core is `java.lang.reflect.Proxy` + `InvocationHandler`. At runtime, Spring generates a proxy class implementing the target interface. Method calls are forwarded to `InvocationHandler.invoke()`, which applies aspect logic and then invokes the target method through reflection.

```text
Caller → Proxy object (implements the same interface)
            ↓
        InvocationHandler.invoke()
            ↓   Before logic (aspect)
        Invoke the target method through reflection
            ↓   After logic (aspect)
        Return the result
```

```java
// Equivalent internal Spring logic (simplified illustration)
Proxy.newProxyInstance(
    target.getClass().getClassLoader(),
    target.getClass().getInterfaces(),
    (proxy, method, args) -> {
        // Before aspect logic
        Object result = method.invoke(target, args);  // Invoke the target method through reflection
        // After aspect logic
        return result;
    }
);
```

#### How CGLIB Proxies Work

CGLIB (Code Generation Library) manipulates bytecode directly through ASM at runtime to generate a subclass of the target class. The subclass overrides non-`final` methods, inserts aspect logic into those overrides, and calls `super.xxx()` to execute the original method.

```text
Caller → Proxy subclass (extends the target class)
            ↓
        Overridden method (MethodInterceptor.intercept())
            ↓   Before logic (aspect)
        super.method()  // Call the target class's original method
            ↓   After logic (aspect)
        Return the result
```

> 💡 CGLIB uses bytecode-level subclass calls (`super.method()`), while JDK proxies use reflection (`method.invoke()`). CGLIB has slightly lower call overhead, but both are on the microsecond scale and have negligible impact on business operations.

#### Spring AOP Scope Limitations

Spring AOP is proxy-based and has these inherent limitations:

| Limitation | Description |
| ------------------------ | ------------------------------------------------------------------- |
| **Restricted by proxy mechanism and method visibility** | JDK proxies intercept public interface methods; CGLIB can also intercept overridable protected/package-visible methods, but cannot advise private/final methods |
| **Only Spring beans can be advised** | Objects created manually with `new` are not managed by Spring, so aspects do not apply |
| **Only method-level join points** | Cannot intercept field access or constructor calls (requires AspectJ compile-time weaving) |
| **Self-invocation bypasses advice** | `this.method()` calls the original object directly, bypassing the proxy and the aspect |

***

### 6.2 When Proxies Are Created

Proxy objects are created during the `BeanPostProcessor.postProcessAfterInitialization()` stage of the bean lifecycle. `AbstractAutoProxyCreator` scans aspects and wraps target beans.

```text
Bean instantiation → Property injection → Initialization (@PostConstruct) → BeanPostProcessor → Create proxy (AOP)
```

> 💡 Proxies are created during application startup, once per advised bean, independently of request concurrency, so their creation does not affect runtime performance.

***

### 6.3 Self-Invocation Bypasses Advice (Important)

> ⚠️ **This is the most common AOP pitfall!**

**Problem:** When one method directly calls another method in the same class, the called method's aspect does not run.

```java
@Service
public class UserService {

    @Transactional
    public void methodA() {
        // Direct invocation does not trigger methodB's aspect
        this.methodB();  // ❌ Bypasses the proxy
    }

    @Transactional
    public void methodB() {
        // ...
    }
}
```

**Cause:** `this.methodB()` invokes the current object rather than its proxy, so the aspect cannot intercept it.

**Solution 1: Inject the Bean's Own Proxy**

```java
@Service
public class UserService {

    @Lazy       // Inject a lazy proxy; Spring Boot 2.6+ rejects eager self-injection as a circular reference
    @Autowired
    private UserService self;  // Inject the proxy object

    public void methodA() {
        self.methodB();  // ✅ Call through the proxy
    }

    @Transactional
    public void methodB() {
        // ...
    }
}
```

**Solution 2: Use AopContext**

```java
// Add to the application class
@EnableAspectJAutoProxy(exposeProxy = true)

// Usage
@Service
public class UserService {

    public void methodA() {
        ((UserService) AopContext.currentProxy()).methodB();  // ✅ Call through the proxy
    }

    @Transactional
    public void methodB() {
        // ...
    }
}
```

**Solution 3: Extract the Called Method into a Separate Bean (Recommended)**

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
        userOperationService.methodB();  // ✅ Cross-bean calls naturally go through the proxy
    }
}
```

> 💡 Solution 3 follows the single-responsibility principle while avoiding circular-dependency risks in solution 1 and the cast-related code smell in solution 2, making it the preferred approach for production code.

***

### 6.4 Performance Overhead

#### Sources of Overhead

| Phase | Type | Scale | Description |
| ------------ | ---------------- | ---------- | ------------------------------------------------------ |
| **Startup** | Proxy object creation | One-time | Happens during bean initialization, independent of request concurrency; negligible |
| **Invocation** | Additional proxy-call overhead | Microseconds | CGLIB uses bytecode subclass calls; JDK proxies use reflection and are slightly slower |
| **Invocation** | Aspect logic itself | Depends on the logic | Synchronous I/O (database/file writes) is the real performance bottleneck |

#### Assessing the Actual Impact

The proxy mechanism adds microseconds of latency, negligible for HTTP endpoints operating on millisecond timescales. Whether an aspect affects performance primarily depends on **what its logic does**:

- **In-memory operations only** (extracting arguments, serializing strings): performance is generally not a concern
- **Synchronous I/O** (writing database logs or files): the I/O is the bottleneck, independently of the AOP mechanism

#### Making Aspect I/O Asynchronous

Synchronous logging blocks the main call chain. Use `@Async` to make aspect I/O asynchronous:

```java
// Enable asynchronous execution on the application class
@SpringBootApplication
@EnableAsync
public class Application { }

// The log service writes asynchronously without blocking the main thread
@Service
public class SysLogService {

    @Async
    public void saveAsync(SysLog sysLog) {
        sysLogMapper.insert(sysLog);
    }
}
```

> 💡 `@Async` also relies on Spring proxies, so direct self-invocation has no effect. Exceptions from asynchronous methods do not reach the caller directly: for `void` methods they go to an `AsyncUncaughtExceptionHandler` (which logs them by default), and for `Future`/`CompletableFuture` return types they surface through the returned future.

***

## VII. AOP Quick Reference

### 1. Core Annotations

| Annotation | Description |
| ----------------- | ---------------------------------- |
| `@Aspect` | Declare an aspect class |
| `@Pointcut` | Define a pointcut |
| `@Before` | Before advice |
| `@After` | After advice (whether or not an exception occurs) |
| `@AfterReturning` | After-returning advice (normal return) |
| `@AfterThrowing` | After-throwing advice (exception thrown) |
| `@Around` | Around advice |
| `@Order` | Set aspect execution order (lower numbers run first) |

### 2. Pointcut Expressions

| Expression type | Description | Example |
| --------------- | ---------------------------- | -------------------------------------- |
| `execution` | Match method execution | `execution(* com.example..*.*(..))` |
| `@annotation` | Match methods bearing a specified annotation | `@annotation(com.example.Log)` |
| `@within` | Match classes bearing a specified annotation | `@within(org.springframework.stereotype.Service)` |
| `within` | Match methods in a specified class/package | `within(com.example.service.*)` |
| `bean` | Match a specified bean name | `bean(userService)` |
| `this` | Match proxies of a specified type | `this(com.example.service.UserService)` |
| `target` | Match target objects of a specified type | `target(com.example.service.UserService)` |
| `args` | Match method argument types | `args(Long, String)` |

### 3. execution Wildcards

| Symbol | Description |
| ------ | ---------------------------------------- |
| `*` | Match any single element (one level) |
| `..` | Match any number of elements (multiple package levels, any arguments) |
| `+` | Match the specified class and its subclasses |
