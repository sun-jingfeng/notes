## I. Login Authentication Overview

### 1.1 Authentication vs. Authorization

| Concept | Definition | Question answered |
| ----------------------- | ------------ | ------------ |
| **Authentication** | Verify a user's identity | Who are you? |
| **Authorization** | Determine a user's permissions | What can you do? |

**Processing flow:** User request → Authentication (verify identity) → Authorization (check permissions) → Access resource

### 1.2 Comparing Common Authentication Approaches

| Feature | Session | JWT | OAuth 2.0 |
| ------------ | ------- | ---------- | ---------- |
| **State** | Stateful | Stateless | Depends on token type (JWT or opaque token) |
| **Storage** | Server | Client | Client holds tokens; authorization server keeps grants |
| **Distributed systems** | Requires sharing | Inherently supported | Inherently supported |
| **Explicit invalidation** | Easy | Requires a blocklist | Implementation-dependent |
| **Use cases** | Traditional web | APIs/mobile clients | Third-party login |

### 1.3 Complete Authentication Flow

**Request processing chain:** Client → Filter/interceptor → Controller → Service

**Token validation flow:**

1.  Obtain the request URL
2.  Check whether it is an allowlisted path (such as `/login`) → If so, allow it through
3.  Obtain the token from the request header
4.  Check whether the token exists → Reject as unauthorized if missing
5.  Check whether the token is blocklisted → Reject as unauthorized if so
6.  Parse and validate the token → Reject as unauthorized on failure
7.  Set the user context and allow the request through

***

## II. Infrastructure

### 2.1 Unified Response Format

Responses carry business codes from `ResultCode` rather than HTTP status codes; the HTTP status stays 200 and the client checks `code`. Only the codes used for authentication are listed:

```java
package com.example.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ResultCode {

    SUCCESS(1, "Operation succeeded"),

    // General errors: 1001-1999
    PARAM_VALID_ERROR(1002, "Parameter validation failed"),
    TOO_MANY_REQUESTS(1003, "Too many requests; please try again later"),

    // User errors: 2001-2999
    USER_NOT_FOUND(2001, "User not found"),
    USERNAME_OR_PASSWORD_ERROR(2003, "Incorrect username or password"),

    // Authentication errors: 3001-3999
    UNAUTHORIZED(3001, "Please log in first"),
    ACCESS_DENIED(3003, "Access denied"),

    // Business errors: 4000-4999
    BUSINESS_ERROR(4000, "Business operation failed"),

    // System errors: 9001-9999
    SYSTEM_ERROR(9999, "Service busy; please try again later");

    private final Integer code;
    private final String msg;
}
```

```java
package com.example.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {

    private Integer code;    // Business code from ResultCode
    private String msg;      // Message
    private T data;          // Response data

    // ==================== Success responses ====================

    public static <T> Result<T> success() {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMsg(), null);
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMsg(), data);
    }

    public static <T> Result<T> success(String msg, T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), msg, data);
    }

    // ==================== Error responses ====================

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
}
```

### 2.2 Business Exception Classes

The project defines two exception types: `BusinessException` represents business logic errors (such as incorrect credentials or a disabled account), carries a `ResultCode` business code (`BUSINESS_ERROR` when only a message is given), and is returned consistently by the global handler. `AuthenticationException` is specifically for authentication failures (not logged in or an invalid token); its meaning aligns with authentication failures in Spring Security, and the global handler always maps it to `ResultCode.UNAUTHORIZED`. Separating the two keeps business exceptions distinct from authentication failures and prevents authentication failures from being reported as system errors.

```java
package com.example.exception;

import com.example.common.ResultCode;
import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {

    private final Integer code;

    public BusinessException(String message) {
        super(message);
        this.code = ResultCode.BUSINESS_ERROR.getCode();
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

```java
package com.example.exception;

/**
 * Authentication exception (not logged in, invalid token, etc.)
 */
public class AuthenticationException extends RuntimeException {

    public AuthenticationException(String message) {
        super(message);
    }
}
```

### 2.3 Global Exception Handler

```java
package com.example.exception;

import com.example.common.Result;
import com.example.common.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Business exception
     */
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        log.warn("Business exception: {}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }

    /**
     * Authentication exception
     */
    @ExceptionHandler(AuthenticationException.class)
    public Result<Void> handleAuthException(AuthenticationException e) {
        log.warn("Authentication exception: {}", e.getMessage());
        return Result.error(ResultCode.UNAUTHORIZED, e.getMessage());
    }

    /**
     * Parameter validation exception
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleValidException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .findFirst()
                .orElse("Parameter validation failed");
        return Result.error(ResultCode.PARAM_VALID_ERROR, message);
    }

    /**
     * Fallback exception handling
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("System exception: ", e);
        return Result.error(ResultCode.SYSTEM_ERROR);
    }
}
```

***

## III. JWT Authentication in Practice

### 3.1 JWT Structure

A JWT consists of three parts separated by `.`, all Base64URL-encoded (encoding is not encryption and anyone can decode it). Security depends entirely on the signature: the server signs the first two parts with a key, and any tampering causes signature verification to fail.

    eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDAxIn0.xxx
          Header               Payload          Signature

| Part | Description | Example content |
| ------------- | -------------------- | ------------------------------------------------------------------------- |
| **Header** | Metadata (signing algorithm) | `{"alg": "HS256", "typ": "JWT"}` |
| **Payload** | Claims (user data) | `{"sub": "1001", "username": "admin", "exp": 1234567890}` |
| **Signature** | Signature (prevents tampering) | `HMACSHA256(base64url(header) + "." + base64url(payload), secretKey)` |

### 3.2 Dependencies and Configuration

**Maven dependencies:**

```xml
<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.13.0</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.13.0</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.13.0</version>
    <scope>runtime</scope>
</dependency>

<!-- Redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

**application.yml configuration:**

```yaml
jwt:
  secret: your-256-bit-secret-key-at-least-32-characters
  access-expiration: 7200000      # Access token lifetime: 2 hours
  refresh-expiration: 604800000   # Refresh token lifetime: 7 days

spring:
  data:
    redis:
      host: localhost
      port: 6379
```

### 3.3 JWT Utility Class

```java
package com.example.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String secret;

    @Getter
    @Value("${jwt.access-expiration}")
    private Long accessExpiration;

    @Getter
    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    private SecretKey key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // ==================== Generate tokens ====================

    /**
     * Generate an access token
     */
    public String generateAccessToken(Long userId, String username) {
        return buildToken(userId, username, accessExpiration, "access");
    }

    /**
     * Generate a refresh token
     */
    public String generateRefreshToken(Long userId, String username) {
        return buildToken(userId, username, refreshExpiration, "refresh");
    }

    private String buildToken(Long userId, String username, Long expiration, String tokenUse) {
        Date now = new Date();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("username", username)
                .claim("token_use", tokenUse)
                .id(UUID.randomUUID().toString())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiration))
                .signWith(key)
                .compact();
    }

    // ==================== Parse tokens ====================

    /**
     * Parse a token and obtain its claims
     */
    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Get the user ID
     */
    public Long getUserId(String token) {
        return Long.parseLong(parseToken(token).getSubject());
    }

    /**
     * Get the username
     */
    public String getUsername(String token) {
        return parseToken(token).get("username", String.class);
    }

    // ==================== Validate tokens ====================

    /**
     * Business endpoints accept only access tokens; the refresh endpoint accepts only refresh tokens
     */
    public boolean validateAccessToken(String token) {
        return validate(token, "access");
    }

    public boolean validateRefreshToken(String token) {
        return validate(token, "refresh");
    }

    private boolean validate(String token, String expectedUse) {
        try {
            Claims claims = parseToken(token);
            return expectedUse.equals(claims.get("token_use", String.class));
        } catch (ExpiredJwtException e) {
            log.debug("Token has expired: {}", e.getMessage());
        } catch (JwtException e) {
            log.debug("Invalid token: {}", e.getMessage());
        } catch (Exception e) {
            log.debug("Failed to parse token: {}", e.getMessage());
        }
        return false;
    }

    /**
     * Check whether the token has expired
     */
    public boolean isExpired(String token) {
        try {
            return parseToken(token).getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    /**
     * Get the token's remaining lifetime in seconds
     * Used to set the blocklist expiration time during logout
     */
    public long getRemainExpiration(String token) {
        try {
            Date expiration = parseToken(token).getExpiration();
            long remainMillis = expiration.getTime() - System.currentTimeMillis();
            return Math.max(0, (remainMillis + 999) / 1000); // Round up so the blocklist entry does not expire early
        } catch (Exception e) {
            return 0;
        }
    }
}
```

### 3.4 Login Functionality

**Request/response DTOs:**

```java
package com.example.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Username must not be blank")
    private String username;

    @NotBlank(message = "Password must not be blank")
    private String password;

    /** CAPTCHA key (required after repeated login failures) */
    private String captchaKey;

    /** CAPTCHA code */
    private String captchaCode;
}
```

```java
package com.example.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {

    private String accessToken;
    private String refreshToken;
    private Long expiresIn;        // Time until expiration (seconds)
    private UserInfo user;

    @Data
    @Builder
    public static class UserInfo {
        private Long id;
        private String username;
        private String nickname;
    }
}
```

**Authentication service:**

```java
package com.example.service;

import com.example.common.ResultCode;
import com.example.dto.LoginRequest;
import com.example.dto.LoginResponse;
import com.example.entity.User;
import com.example.exception.AuthenticationException;
import com.example.exception.BusinessException;
import com.example.repository.UserRepository;
import com.example.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final CaptchaService captchaService;
    private final LoginAttemptService loginAttemptService;
    private final TokenBlacklistService blacklistService;

    /**
     * User login
     */
    public LoginResponse login(LoginRequest request) {
        String username = request.getUsername();

        // 1. Check whether the account is locked
        if (loginAttemptService.isLocked(username)) {
            throw new BusinessException("Account is locked; please try again later (within 15 minutes)");
        }

        // 2. Validate CAPTCHA (required after 3 or more failures)
        int remainingAttempts = loginAttemptService.getRemainingAttempts(username);
        if (remainingAttempts <= 2) {
            if (request.getCaptchaKey() == null || request.getCaptchaCode() == null) {
                throw new BusinessException("Please enter the CAPTCHA code");
            }
            if (!captchaService.validate(request.getCaptchaKey(), request.getCaptchaCode())) {
                throw new BusinessException("Incorrect CAPTCHA code");
            }
        }

        // 3. Query the user and verify the password
        User user = userRepository.findByUsername(username);
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            loginAttemptService.recordFailure(username);
            int remaining = loginAttemptService.getRemainingAttempts(username);
            throw new BusinessException(ResultCode.USERNAME_OR_PASSWORD_ERROR.getCode(),
                    "Incorrect username or password; remaining attempts: " + remaining);
        }

        // 4. Check account status
        if (user.getStatus() != 1) {
            throw new BusinessException("Account has been disabled");
        }

        // 5. Login succeeded; clear the failure record
        loginAttemptService.clearFailures(username);

        // 6. Generate and return tokens
        return buildLoginResponse(user);
    }

    /**
     * Refresh the token
     */
    public LoginResponse refresh(String refreshToken) {
        // 1. Validate purpose, signature, and expiration; reject revoked refresh tokens
        if (!jwtUtils.validateRefreshToken(refreshToken) || blacklistService.contains(refreshToken)) {
            throw new AuthenticationException("Refresh token is invalid or expired");
        }

        // 2. Get user information
        Long userId = jwtUtils.getUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ResultCode.USER_NOT_FOUND));

        // 3. Check account status
        if (user.getStatus() != 1) {
            throw new BusinessException("Account has been disabled");
        }

        // 4. Renew only the access token; this example retains the original refresh token and its fixed expiration
        return buildLoginResponse(user, refreshToken);
    }

    /**
     * Build the login response
     */
    private LoginResponse buildLoginResponse(User user) {
        return buildLoginResponse(user, jwtUtils.generateRefreshToken(user.getId(), user.getUsername()));
    }

    private LoginResponse buildLoginResponse(User user, String refreshToken) {
        return LoginResponse.builder()
                .accessToken(jwtUtils.generateAccessToken(user.getId(), user.getUsername()))
                .refreshToken(refreshToken)
                .expiresIn(jwtUtils.getAccessExpiration() / 1000)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .nickname(user.getNickname())
                        .build())
                .build();
    }
}
```

**Authentication controller:**

```java
package com.example.controller;

import com.example.common.Result;
import com.example.dto.LoginRequest;
import com.example.dto.LoginResponse;
import com.example.service.AuthService;
import com.example.service.TokenBlacklistService;
import com.example.exception.AuthenticationException;
import com.example.utils.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final TokenBlacklistService blacklistService;
    private final JwtUtils jwtUtils;

    /**
     * Log in
     */
    @PostMapping("/login")
    public Result<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        return Result.success(authService.login(request));
    }

    /**
     * Refresh the token
     */
    @PostMapping("/refresh")
    public Result<LoginResponse> refresh(@RequestHeader("X-Refresh-Token") String refreshToken) {
        return Result.success(authService.refresh(refreshToken));
    }

    /**
     * Log out
     */
    @PostMapping("/logout")
    public Result<Void> logout(@RequestHeader("Authorization") String authorization,
                               @RequestHeader("X-Refresh-Token") String refreshToken) {
        if (!authorization.startsWith("Bearer ")) {
            throw new AuthenticationException("No access token provided");
        }
        String accessToken = authorization.substring(7);
        if (!jwtUtils.validateAccessToken(accessToken)
                || !jwtUtils.validateRefreshToken(refreshToken)
                || !jwtUtils.getUserId(accessToken).equals(jwtUtils.getUserId(refreshToken))) {
            throw new AuthenticationException("Tokens are invalid or do not belong to the same user");
        }
        blacklistService.add(accessToken, jwtUtils.getRemainExpiration(accessToken));
        blacklistService.add(refreshToken, jwtUtils.getRemainExpiration(refreshToken));
        return Result.success();
    }
}
```

### 3.5 Token Blocklist Service

A logout request submits both `Authorization: Bearer <accessToken>` and `X-Refresh-Token: <refreshToken>`, and adds both tokens to a Redis blocklist. Business endpoints check the access token, while the refresh endpoint checks the refresh token. The Redis key is `token:blacklist:{token}`; its TTL is the token's remaining lifetime rounded up to whole seconds, and it is deleted automatically on expiration.

> This example does not rotate the refresh token during refresh; after logout, that token can no longer obtain new tokens. Logout revokes only the two tokens submitted in the request, not other access tokens already issued. To immediately invalidate an entire login session (including concurrent refreshes), add a server-side session identifier and atomic validation. To invalidate tokens on all devices, store a token version for each user, include it in issued tokens, and reject tokens whose version is older than the stored value.

```java
package com.example.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final StringRedisTemplate redisTemplate;
    private static final String PREFIX = "token:blacklist:";

    /**
     * Add a token to the blocklist
     * @param token Token
     * @param expireSeconds Token's remaining lifetime (seconds)
     */
    public void add(String token, long expireSeconds) {
        if (expireSeconds <= 0) return; // Expired tokens do not need to be blocklisted
        redisTemplate.opsForValue().set(
                PREFIX + token,
                "1",
                expireSeconds,
                TimeUnit.SECONDS
        );
    }

    /**
     * Check whether a token is blocklisted
     */
    public boolean contains(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(PREFIX + token));
    }
}
```

### 3.6 Explicit JWT Invalidation (Password Changes)

Once issued, a JWT has no built-in revocation mechanism; its lifetime is determined by the `exp` field. After a user changes their password, previously issued tokens remain valid until expiration, a classic security issue arising from JWT's stateless nature.

**Comparison of three solutions:**

| Approach | How it works | Advantages | Disadvantages |
| ---------------------------- | ---- | ---- | ---- |
| **Redis blocklist** | On a password change, blocklist the current request's token; check the blocklist on every request | Straightforward implementation | Blocks only the token submitted with the password change; does not cover old tokens on other devices; adds one Redis I/O per request |
| **Token version (recommended)** | Add a `token_version` field to the user table and increment it on password changes; include the version in the token payload and compare it with the database value during validation | Invalidates old tokens on all devices in one operation; no additional storage structure; version checks can reuse an existing DB query | Requires a database query per request, so it is no longer purely stateless |
| **Short lifetime + refresh token** | Give access tokens a very short lifetime (for example, 5 minutes) and delete the refresh token from Redis on password changes | Access tokens expire automatically without explicit revocation | Most complex implementation; refresh tokens also require persistent management |

> The **token-version** approach is recommended: changing a password becomes a global logout, and incrementing one database field invalidates old tokens on every device without introducing another storage structure. Real projects usually combine this with a shorter access-token lifetime (such as 2 hours) to further reduce the lifetime of old tokens. If the system also uses refresh tokens, delete that user's refresh tokens from Redis when the password changes; otherwise an old refresh token can still obtain an access token carrying the new version.

***

## IV. Request Interception and Authentication

### 4.1 Filter vs. Interceptor

| Aspect | Filter | Interceptor |
| ------------------- | ---------------------- | ------------------------ |
| **Specification** | Servlet specification | Spring MVC specification |
| **Execution timing** | Before DispatcherServlet | Inside DispatcherServlet processing, around the handler |
| **Access to the handler** | No | Yes |
| **Dependency injection** | Requires special handling | Supported natively |
| **Use cases** | Encoding, CORS, general filtering | Authentication, permissions, logging |
| **Exception handling** | Must set the response manually | Can throw exceptions for the global handler |

> 💡 Choose one approach; Interceptor is recommended. A Filter runs before DispatcherServlet, so `@ControllerAdvice` cannot catch exceptions thrown by it, and it must set the response manually. An Interceptor runs within Spring MVC and can throw custom exceptions for centralized handling by the global exception handler.

### 4.2 User Context

```java
package com.example.context;

/**
 * User context (based on ThreadLocal)
 * Carries user information during request processing
 */
public class UserContext {

    private static final ThreadLocal<Long> USER_ID = new ThreadLocal<>();
    private static final ThreadLocal<String> USERNAME = new ThreadLocal<>();

    public static void setUserId(Long userId) {
        USER_ID.set(userId);
    }

    public static Long getUserId() {
        return USER_ID.get();
    }

    public static void setUsername(String username) {
        USERNAME.set(username);
    }

    public static String getUsername() {
        return USERNAME.get();
    }

    /**
     * Clear the context (must be called at the end of a request to prevent memory leaks)
     */
    public static void clear() {
        USER_ID.remove();
        USERNAME.remove();
    }
}
```

### 4.3 Approach 1: Filter Implementation

```java
package com.example.filter;

import com.example.common.Result;
import com.example.common.ResultCode;
import com.example.context.UserContext;
import com.example.service.TokenBlacklistService;
import com.example.utils.JwtUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class AuthFilter implements Filter {

    private final JwtUtils jwtUtils;
    private final TokenBlacklistService blacklistService;
    private final ObjectMapper objectMapper;

    /** Allowlisted paths */
    private static final Set<String> WHITE_LIST = Set.of(
            "/auth/login",
            "/auth/refresh",
            "/captcha"
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        // 1. Allow OPTIONS preflight requests (CORS)
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        // 2. Allow allowlisted paths
        String uri = req.getRequestURI();
        if (isWhiteListed(uri)) {
            chain.doFilter(request, response);
            return;
        }

        // 3. Obtain and validate the token
        String token = extractToken(req);
        if (token == null) {
            sendError(res, "Not logged in");
            return;
        }

        // 4. Check the blocklist
        if (blacklistService.contains(token)) {
            sendError(res, "Token has been invalidated; please log in again");
            return;
        }

        // 5. Business endpoints accept only access tokens
        if (!jwtUtils.validateAccessToken(token)) {
            sendError(res, "Access token is invalid or expired");
            return;
        }

        // 6. Parse the token and set the context
        try {
            UserContext.setUserId(jwtUtils.getUserId(token));
            UserContext.setUsername(jwtUtils.getUsername(token));
        } catch (Exception e) {
            UserContext.clear();
            sendError(res, "Token is invalid or expired");
            return;
        }

        // 7. Continue the chain outside the token try block so downstream exceptions are not reported as authentication failures
        try {
            chain.doFilter(request, response);
        } finally {
            UserContext.clear();
        }
    }

    private boolean isWhiteListed(String uri) {
        return WHITE_LIST.contains(uri);
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    private void sendError(HttpServletResponse response, String message) throws IOException {
        // The filter runs before Spring MVC, so it writes the same Result body as the global handler itself
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(Result.error(ResultCode.UNAUTHORIZED, message)));
    }
}
```

> 💡 The `ObjectMapper` injected here is Jackson 2 (`com.fasterxml.jackson.databind`), which Spring Boot 3.x auto-configures. Spring Boot 4 auto-configures Jackson 3 instead: inject `tools.jackson.databind.json.JsonMapper`; `writeValueAsString()` works the same, and Jackson 3 exceptions are unchecked.

**Filter registration configuration:**

```java
package com.example.config;

import com.example.filter.AuthFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<AuthFilter> authFilterRegistration(AuthFilter authFilter) {
        FilterRegistrationBean<AuthFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(authFilter);
        registration.addUrlPatterns("/*");
        registration.setOrder(1);
        return registration;
    }
}
```

### 4.4 Approach 2: Interceptor Implementation (Recommended)

```java
package com.example.interceptor;

import com.example.context.UserContext;
import com.example.exception.AuthenticationException;
import com.example.service.TokenBlacklistService;
import com.example.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtUtils jwtUtils;
    private final TokenBlacklistService blacklistService;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {
        // 1. Allow OPTIONS preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        // 2. Obtain the token
        String token = extractToken(request);
        if (token == null) {
            throw new AuthenticationException("Not logged in");
        }

        // 3. Check the blocklist
        if (blacklistService.contains(token)) {
            throw new AuthenticationException("Token has been invalidated; please log in again");
        }

        // 4. Business endpoints accept only access tokens
        if (!jwtUtils.validateAccessToken(token)) {
            throw new AuthenticationException("Access token is invalid or expired");
        }

        // 5. Parse the token and set the user context
        try {
            UserContext.setUserId(jwtUtils.getUserId(token));
            UserContext.setUsername(jwtUtils.getUsername(token));
            return true;
        } catch (Exception e) {
            throw new AuthenticationException("Token is invalid or expired");
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request,
                                HttpServletResponse response,
                                Object handler, Exception ex) {
        // Must clear the context to prevent memory leaks
        UserContext.clear();
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
```

**Interceptor registration configuration:**

```java
package com.example.config;

import com.example.interceptor.AuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                        // Authentication endpoints
                        "/auth/login",
                        "/auth/refresh",
                        "/captcha/**",
                        // Static resources
                        "/static/**",
                        "/favicon.ico",
                        // API documentation
                        "/doc.html",
                        "/swagger-resources/**",
                        "/webjars/**",
                        "/v3/api-docs/**"
                );
    }
}
```

### 4.5 Obtaining the Current User

**Approach 1: Use UserContext Directly**

```java
@GetMapping("/profile")
public Result<UserVO> getProfile() {
    Long userId = UserContext.getUserId();
    return Result.success(userService.getById(userId));
}
```

***

**Approach 2: Custom Parameter Annotation (Recommended)**

```java
package com.example.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Inject the current logged-in user's ID
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentUser {
}
```

```java
package com.example.resolver;

import com.example.annotation.CurrentUser;
import com.example.context.UserContext;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
public class CurrentUserResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class)
                && parameter.getParameterType().equals(Long.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) {
        return UserContext.getUserId();
    }
}
```

Inject `CurrentUserResolver` into the `WebMvcConfigurer` implementation and register it:

```java
private final CurrentUserResolver currentUserResolver;

@Override
public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
    resolvers.add(currentUserResolver);
}
```

**Usage example:**

```java
@GetMapping("/profile")
public Result<UserVO> getProfile(@CurrentUser Long userId) {
    return Result.success(userService.getById(userId));
}

@PutMapping("/profile")
public Result<Void> updateProfile(@CurrentUser Long userId, @RequestBody UserDTO dto) {
    userService.update(userId, dto);
    return Result.success();
}
```

***

## V. Password Security

### 5.1 BCrypt Hashing Configuration

**BCrypt** is an adaptive hash algorithm designed for password storage. Each hash operation generates a random salt automatically, so the same plaintext produces a different hash each time; verification must use `matches()` rather than direct string comparison. The `strength` parameter controls the computational cost (default 10): increasing it by 1 doubles computation time, allowing resistance to cracking to increase as hardware improves. Compared with general-purpose hash algorithms such as MD5/SHA, BCrypt is significantly more resistant to brute-force and rainbow-table attacks.

```java
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**Usage:**

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /** Hash the password during registration */
    public void register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }

    /** Change the password */
    public void changePassword(Long userId, String oldPwd, String newPwd) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ResultCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(oldPwd, user.getPassword())) {
            throw new BusinessException("Incorrect current password");
        }

        user.setPassword(passwordEncoder.encode(newPwd));
        userRepository.save(user);
    }
}
```

### 5.2 Password Strength Validation

**Custom validation annotation:**

```java
package com.example.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordValidator.class)
public @interface StrongPassword {

    String message() default "Password must be 8-20 characters and contain uppercase and lowercase letters and digits";

    int min() default 8;

    int max() default 20;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
```

**Validator implementation:**

```java
package com.example.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<StrongPassword, String> {

    private int min;
    private int max;

    @Override
    public void initialize(StrongPassword annotation) {
        this.min = annotation.min();
        this.max = annotation.max();
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null) {
            return false;
        }
        return password.length() >= min
                && password.length() <= max
                && password.matches(".*[A-Z].*")   // Contains uppercase letters
                && password.matches(".*[a-z].*")   // Contains lowercase letters
                && password.matches(".*\\d.*");    // Contains digits
    }
}
```

**Usage:**

```java
@Data
public class RegisterRequest {

    @NotBlank(message = "Username must not be blank")
    @Size(min = 4, max = 20, message = "Username must be 4-20 characters")
    private String username;

    @StrongPassword
    private String password;
}
```

### 5.3 Limiting Failed Login Attempts

Use Redis to maintain a failure counter for each username (key: `login:attempt:{username}`). Increment it on every failed login and set a TTL of 15 minutes on the first increment. Once it reaches the limit (5 attempts), the account is locked and all login requests are rejected during the lockout period. Delete the counter after a successful login. When the TTL expires, the counter is cleared and the account unlocks automatically, with no scheduled job required.

```java
package com.example.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class LoginAttemptService {

    private final StringRedisTemplate redisTemplate;

    private static final String PREFIX = "login:attempt:";
    private static final int MAX_ATTEMPTS = 5;      // Maximum attempts
    private static final int LOCK_MINUTES = 15;     // Lockout duration (minutes)

    /**
     * Record a failed login
     */
    public void recordFailure(String username) {
        String key = PREFIX + username;
        Long attempts = redisTemplate.opsForValue().increment(key);
        if (attempts != null && attempts == 1) {
            // First failure: set the expiration time
            redisTemplate.expire(key, LOCK_MINUTES, TimeUnit.MINUTES);
        }
    }

    /**
     * Check whether the account is locked
     */
    public boolean isLocked(String username) {
        String key = PREFIX + username;
        String value = redisTemplate.opsForValue().get(key);
        return value != null && Integer.parseInt(value) >= MAX_ATTEMPTS;
    }

    /**
     * Login succeeded: clear the failure record
     */
    public void clearFailures(String username) {
        redisTemplate.delete(PREFIX + username);
    }

    /**
     * Get the number of remaining attempts
     */
    public int getRemainingAttempts(String username) {
        String key = PREFIX + username;
        String value = redisTemplate.opsForValue().get(key);
        if (value == null) {
            return MAX_ATTEMPTS;
        }
        return Math.max(0, MAX_ATTEMPTS - Integer.parseInt(value));
    }
}
```

***

## VI. Verification Codes

### 6.1 Image CAPTCHA

**Workflow:** Frontend requests `/captcha` → Backend generates a CAPTCHA and stores it in Redis (key: `captcha:{key}`, TTL: 5 minutes) → Returns `{key, image}` (image is Base64) → Frontend renders the image → User enters the code → Login request carries `captchaKey + captchaCode` → Backend validates it and deletes the Redis key (single use to prevent replay).

**Maven dependency:**

```xml
<dependency>
    <groupId>com.github.whvcse</groupId>
    <artifactId>easy-captcha</artifactId>
    <version>1.6.2</version>
</dependency>
```

**CAPTCHA service:**

```java
package com.example.service;

import com.wf.captcha.SpecCaptcha;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class CaptchaService {

    private final StringRedisTemplate redisTemplate;
    private static final String PREFIX = "captcha:";
    private static final int EXPIRE_MINUTES = 5;

    /**
     * Generate an image CAPTCHA
     * @return key: CAPTCHA identifier, image: Base64 image
     */
    public Map<String, String> generate() {
        // Generate a CAPTCHA: 130px wide, 48px high, 4 characters
        SpecCaptcha captcha = new SpecCaptcha(130, 48, 4);
        String code = captcha.text().toLowerCase();
        String key = UUID.randomUUID().toString().replace("-", "");

        // Store in Redis with a 5-minute expiration
        redisTemplate.opsForValue().set(PREFIX + key, code, EXPIRE_MINUTES, TimeUnit.MINUTES);

        Map<String, String> result = new HashMap<>();
        result.put("key", key);
        result.put("image", captcha.toBase64());
        return result;
    }

    /**
     * Validate the CAPTCHA
     */
    public boolean validate(String key, String code) {
        if (key == null || code == null) {
            return false;
        }
        String redisKey = PREFIX + key;
        String stored = redisTemplate.opsForValue().get(redisKey);
        redisTemplate.delete(redisKey);  // Single use
        return code.toLowerCase().equals(stored);
    }
}
```

**CAPTCHA endpoint:**

```java
package com.example.controller;

import com.example.common.Result;
import com.example.service.CaptchaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CaptchaController {

    private final CaptchaService captchaService;

    @GetMapping("/captcha")
    public Result<Map<String, String>> getCaptcha() {
        return Result.success(captchaService.generate());
    }
}
```

### 6.2 SMS Verification Codes

Use two Redis keys: `sms:code:{phone}` stores the verification code (TTL: 5 minutes), while `sms:limit:{phone}` controls the send rate (TTL: 60 seconds). Before sending, check whether the rate-limit key exists and reject the request if it does. During validation, retrieve and immediately delete the code to ensure each code can be used only once.

```java
package com.example.service;

import com.example.common.ResultCode;
import com.example.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class SmsService {

    private final StringRedisTemplate redisTemplate;

    private static final String CODE_PREFIX = "sms:code:";
    private static final String LIMIT_PREFIX = "sms:limit:";
    private static final int CODE_EXPIRE_MINUTES = 5;
    private static final int LIMIT_SECONDS = 60;

    /**
     * Send an SMS verification code
     */
    public void send(String phone) {
        // 1. Check the send rate (once every 60 seconds)
        if (Boolean.TRUE.equals(redisTemplate.hasKey(LIMIT_PREFIX + phone))) {
            throw new BusinessException(ResultCode.TOO_MANY_REQUESTS.getCode(),
                    "Too many requests; please try again in 60 seconds");
        }

        // 2. Generate a 6-digit code (SecureRandom provides unpredictable randomness)
        String code = String.format("%06d", new SecureRandom().nextInt(1000000));

        // 3. Call the SMS provider's API to send it (example)
        // smsClient.send(phone, "Your verification code is: " + code + "; valid for 5 minutes");

        // 4. Store the code with a 5-minute lifetime
        redisTemplate.opsForValue().set(CODE_PREFIX + phone, code, CODE_EXPIRE_MINUTES, TimeUnit.MINUTES);

        // 5. Enforce a 60-second interval between sends
        redisTemplate.opsForValue().set(LIMIT_PREFIX + phone, "1", LIMIT_SECONDS, TimeUnit.SECONDS);
    }

    /**
     * Validate the SMS verification code
     */
    public boolean validate(String phone, String code) {
        if (phone == null || code == null) {
            return false;
        }
        String stored = redisTemplate.opsForValue().get(CODE_PREFIX + phone);
        if (code.equals(stored)) {
            redisTemplate.delete(CODE_PREFIX + phone);  // Delete after successful validation
            return true;
        }
        return false;
    }
}
```

***

## VII. Access Control (RBAC)

**RBAC (Role-Based Access Control)** is the most common permission model. Users obtain permissions indirectly through roles rather than being linked to permissions directly:

    User → User-role mapping (sys_user_role) → Role → Role-permission mapping (sys_role_permission) → Permission

This design concentrates permission management at the role level. To adjust permissions for a category of users, change the permissions associated with their role instead of updating each user record, reducing maintenance costs.

### 7.1 Database Design

```sql
-- User table
CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT 'Username',
    password VARCHAR(100) NOT NULL COMMENT 'Password (BCrypt hash)',
    nickname VARCHAR(50) COMMENT 'Nickname',
    status TINYINT DEFAULT 1 COMMENT 'Status: 1 active, 0 disabled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Role table
CREATE TABLE sys_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL COMMENT 'Role code',
    name VARCHAR(50) NOT NULL COMMENT 'Role name',
    description VARCHAR(200) COMMENT 'Description'
);

-- Permission table
CREATE TABLE sys_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(100) UNIQUE NOT NULL COMMENT 'Permission code, e.g. user:list',
    name VARCHAR(50) NOT NULL COMMENT 'Permission name',
    type TINYINT COMMENT 'Type: 1 menu, 2 button'
);

-- User-role mapping table
CREATE TABLE sys_user_role (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id)
);

-- Role-permission mapping table
CREATE TABLE sys_role_permission (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id)
);

-- Sample data
INSERT INTO sys_role (code, name) VALUES ('admin', 'Administrator'), ('user', 'Regular user');
INSERT INTO sys_permission (code, name, type) VALUES
    ('user:list', 'User list', 2),
    ('user:add', 'Add user', 2),
    ('user:update', 'Edit user', 2),
    ('user:delete', 'Delete user', 2);
```

**Query permission codes by user ID:**

In RBAC, users and permissions are not directly linked. The mapping traverses two association tables in the "user → role → permission" relationship, so the SQL joins three tables:

```sql
SELECT DISTINCT p.code
FROM sys_permission p
INNER JOIN sys_role_permission rp ON p.id = rp.permission_id
INNER JOIN sys_user_role ur       ON rp.role_id = ur.role_id
WHERE ur.user_id = #{userId}
```

1. `sys_user_role`: Find all `role_id` values belonging to the user through `user_id`
2. `sys_role_permission`: Find all `permission_id` values for those roles through `role_id`
3. `sys_permission`: Retrieve each permission's `code` through `permission_id`

`DISTINCT` removes duplicates: several roles may share the same permission, so a user with multiple roles may produce multiple rows for it. `DISTINCT` ensures each permission code appears only once in the result set.

### 7.2 Endpoint Permission Checks

**Permission annotation:**

```java
package com.example.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequirePermission {

    /** Required permission codes */
    String[] value();

    /** Logical relationship; defaults to AND (all permissions required) */
    Logical logical() default Logical.AND;
}
```

```java
package com.example.annotation;

public enum Logical {
    /** All permissions are required */
    AND,
    /** Any one permission is sufficient */
    OR
}
```

**AOP aspect:**

```java
package com.example.aspect;

import com.example.annotation.Logical;
import com.example.annotation.RequirePermission;
import com.example.common.ResultCode;
import com.example.context.UserContext;
import com.example.exception.AuthenticationException;
import com.example.exception.BusinessException;
import com.example.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Set;

@Aspect
@Component
@RequiredArgsConstructor
public class PermissionAspect {

    private final PermissionService permissionService;

    @Before("@annotation(requirePermission)")
    public void checkPermission(RequirePermission requirePermission) {
        // 1. Get the current user
        Long userId = UserContext.getUserId();
        if (userId == null) {
            throw new AuthenticationException("Not logged in");
        }

        // 2. Get the user's permissions
        Set<String> userPermissions = permissionService.getPermissionsByUserId(userId);

        // 3. Check permissions
        String[] required = requirePermission.value();
        Logical logical = requirePermission.logical();

        boolean hasPermission;
        if (logical == Logical.AND) {
            hasPermission = Arrays.stream(required).allMatch(userPermissions::contains);
        } else {
            hasPermission = Arrays.stream(required).anyMatch(userPermissions::contains);
        }

        if (!hasPermission) {
            throw new BusinessException(ResultCode.ACCESS_DENIED);
        }
    }
}
```

**Usage example:**

```java
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @RequirePermission("user:list")
    public Result<List<UserVO>> list() {
        return Result.success(userService.list());
    }

    @PostMapping
    @RequirePermission("user:add")
    public Result<Void> add(@RequestBody @Valid UserDTO dto) {
        userService.add(dto);
        return Result.success();
    }

    @PutMapping("/{id}")
    @RequirePermission("user:update")
    public Result<Void> update(@PathVariable Long id, @RequestBody @Valid UserDTO dto) {
        userService.update(id, dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    @RequirePermission("user:delete")
    public Result<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return Result.success();
    }

    // Both update and delete permissions are required
    @PostMapping("/{id}/reset-password")
    @RequirePermission(value = {"user:update", "user:delete"}, logical = Logical.AND)
    public Result<Void> resetPassword(@PathVariable Long id) {
        userService.resetPassword(id);
        return Result.success();
    }
}
```

### 7.3 Permission Service (with Caching)

```java
package com.example.service;

import com.example.mapper.PermissionMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionMapper permissionMapper;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String PREFIX = "user:permissions:";
    private static final long EXPIRE_HOURS = 2;

    /**
     * Get user permissions (with caching)
     */
    public Set<String> getPermissionsByUserId(Long userId) {
        String key = PREFIX + userId;

        // 1. Check the cache first
        try {
            String cached = redisTemplate.opsForValue().get(key);
            if (cached != null) {
                return objectMapper.readValue(cached, new TypeReference<Set<String>>() {});
            }
        } catch (Exception e) {
            log.warn("Failed to read permission cache: {}", e.getMessage());
        }

        // 2. Query the database
        Set<String> permissions = permissionMapper.selectPermissionCodesByUserId(userId);
        if (permissions == null) {
            permissions = Collections.emptySet();
        }

        // 3. Write to the cache
        try {
            redisTemplate.opsForValue().set(
                    key,
                    objectMapper.writeValueAsString(permissions),
                    EXPIRE_HOURS,
                    TimeUnit.HOURS
            );
        } catch (Exception e) {
            log.warn("Failed to write permission cache: {}", e.getMessage());
        }

        return permissions;
    }

    /**
     * Clear a user's permission cache (call after changing the user's roles)
     */
    public void clearUserCache(Long userId) {
        redisTemplate.delete(PREFIX + userId);
    }

    /**
     * Clear the permission caches of users associated with a role (call after changing role permissions)
     */
    public void clearRoleCache(Long roleId) {
        List<Long> userIds = permissionMapper.selectUserIdsByRoleId(roleId);
        if (userIds != null && !userIds.isEmpty()) {
            List<String> keys = userIds.stream()
                    .map(id -> PREFIX + id)
                    .collect(Collectors.toList());
            redisTemplate.delete(keys);
        }
    }
}
```

**Mapper interface:**

```java
package com.example.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Set;

@Mapper
public interface PermissionMapper {

    /**
     * Query all permission codes for a user
     */
    @Select("""
        SELECT DISTINCT p.code FROM sys_permission p
        INNER JOIN sys_role_permission rp ON p.id = rp.permission_id
        INNER JOIN sys_user_role ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = #{userId}
        """)
    Set<String> selectPermissionCodesByUserId(Long userId);

    /**
     * Query IDs of users associated with a role
     */
    @Select("SELECT user_id FROM sys_user_role WHERE role_id = #{roleId}")
    List<Long> selectUserIdsByRoleId(Long roleId);
}
```

***

## VIII. Spring Security Integration (@PreAuthorize Approach)

### 8.1 Comparing the Approaches

| Aspect | Custom approach (ThreadLocal + AOP) | Spring Security approach |
| ---------------- | ------------------------------------------ | ------------------------------------------------ |
| **Authentication context** | ThreadLocal `UserContext` | `SecurityContextHolder` |
| **Permission checks** | Custom `@RequirePermission` + AOP | `@PreAuthorize("hasAuthority('xxx')")` |
| **User loading** | Manually query the database and populate UserContext | Implement `UserDetailsService` for the framework to load users |
| **Filter implementation** | Extend any Filter and manually decide whether to allow requests | Extend `OncePerRequestFilter` and populate SecurityContext |
| **External dependencies** | No additional dependencies | `spring-boot-starter-security` |
| **Flexibility** | High; every step is custom code | Moderate; requires understanding the Spring Security filter chain |
| **Suitable scenarios** | Small projects or existing authentication systems | Medium/large projects needing standardized security configuration |

### 8.2 Maven Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

> **Note:** After adding this dependency, Spring Security intercepts all requests by default. Explicitly configure permitted paths in `SecurityConfig` and **remove** the original `AuthFilter` / `AuthInterceptor` registration.

### 8.3 UserDetails and UserDetailsService

**Extend UserDetails to carry a permission list:**

```java
package com.example.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class LoginUser implements UserDetails {

    private final Long userId;
    private final String username;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean enabled;

    public LoginUser(Long userId, String username, String password, Set<String> permissionCodes,
                     boolean enabled) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.enabled = enabled;
        this.authorities = permissionCodes.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }

    @Override public boolean isAccountNonExpired()   { return true; }
    @Override public boolean isAccountNonLocked()    { return true; }
    @Override public boolean isCredentialsNonExpired(){ return true; }
    @Override public boolean isEnabled()             { return enabled; }
}
```

**Implement UserDetailsService to load users and permissions from the database:**

```java
package com.example.security;

import com.example.entity.User;
import com.example.exception.AuthenticationException;
import com.example.mapper.PermissionMapper;
import com.example.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final PermissionMapper permissionMapper;

    @Override
    public UserDetails loadUserByUsername(String userId) {
        // Use userId as username (look up by userId after login)
        User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new AuthenticationException("User does not exist"));

        // Query all permission codes for this user
        Set<String> permissions = permissionMapper.selectPermissionCodesByUserId(user.getId());

        return new LoginUser(user.getId(), user.getUsername(), user.getPassword(), permissions,
                Integer.valueOf(1).equals(user.getStatus()));
    }
}
```

### 8.4 JWT Authentication Filter

Extend `OncePerRequestFilter`, parse the token, and write the authentication information to `SecurityContextHolder`:

```java
package com.example.security;

import com.example.service.TokenBlacklistService;
import com.example.utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;
    private final TokenBlacklistService blacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String token = extractToken(request);

        if (token != null && jwtUtils.validateAccessToken(token) && !blacklistService.contains(token)) {
            String userId = String.valueOf(jwtUtils.getUserId(token));
            UserDetails userDetails = userDetailsService.loadUserByUsername(userId);

            // Directly constructing an authenticated object does not check account status; check it explicitly
            if (!userDetails.isEnabled()) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Account has been disabled");
                return;
            }

            // Write the authentication information to SecurityContext
            // Pass authorities as the third argument; Spring Security uses this to mark the object authenticated
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        try {
            chain.doFilter(request, response);
        } finally {
            // Clear after the request to prevent data contamination when threads are reused
            SecurityContextHolder.clearContext();
        }
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
```

> 💡 As a `@Component`, this filter is also registered with the servlet container by Spring Boot. `OncePerRequestFilter` prevents it from running twice per request; alternatively, disable the extra registration with a `FilterRegistrationBean` whose `setEnabled(false)` is called.

### 8.5 SecurityConfig Configuration

```java
package com.example.config;

import com.example.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity          // Enable method authorization such as @PreAuthorize / @PostAuthorize
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            // Stateless JWT authentication: do not create a session
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/login", "/auth/refresh", "/captcha/**").permitAll()
                .anyRequest().authenticated()
            )
            // Without form login or HTTP Basic, unauthenticated requests would get 403; return 401 instead
            .exceptionHandling(e -> e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
            // Insert the JWT filter before UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**Key annotations:**

| Annotation | Description |
| ----------------------- | -------------------------------------------------------------- |
| `@EnableWebSecurity` | Enable Spring Security web security configuration |
| `@EnableMethodSecurity` | Enable method authorization and activate annotations such as `@PreAuthorize` and `@PostAuthorize` |

### 8.6 Using @PreAuthorize

After enabling `@EnableMethodSecurity`, annotate Controller methods with the required permissions:

```java
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('user:list')")
    public Result<List<UserVO>> list() {
        return Result.success(userService.list());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('user:add')")
    public Result<Void> add(@RequestBody @Valid UserDTO dto) {
        userService.add(dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('user:delete')")
    public Result<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return Result.success();
    }

    // Both permissions are required
    @PostMapping("/{id}/reset-password")
    @PreAuthorize("hasAuthority('user:update') and hasAuthority('user:delete')")
    public Result<Void> resetPassword(@PathVariable Long id) {
        userService.resetPassword(id);
        return Result.success();
    }
}
```

**Common SpEL expressions:**

| Expression | Meaning |
| -------------------------------------- | -------------------------- |
| `hasAuthority('user:list')` | Has the specified permission |
| `hasAnyAuthority('a', 'b')` | Has any one of the permissions |
| `hasRole('ADMIN')` | Has the role (automatically adds the `ROLE_` prefix) |
| `isAuthenticated()` | Is logged in |
| `#userId == authentication.principal.userId` | Parameter matches the current user (data-level access control) |

### 8.7 Complete Authentication Chain

```text
HTTP request
  → JwtAuthenticationFilter
      ├─ Parse token → Verify signature → Check blocklist
      ├─ Call UserDetailsService.loadUserByUsername(userId)
      │     └─ Query DB: user + permissions → Build LoginUser (including authorities)
      └─ Populate SecurityContextHolder
  → Spring Security filter chain (check authentication)
  → DispatcherServlet → Controller
      └─ @PreAuthorize is triggered
            └─ Read authorities from SecurityContext → Check for required permissions
                  ├─ Pass → Execute method
                  └─ Fail → Throw AccessDeniedException → Return 403
```

> **Note**: a global `@ExceptionHandler(Exception.class)` also catches `AccessDeniedException` thrown by `@PreAuthorize`, turning the denial into a generic error. Add a dedicated `AccessDeniedException` handler that returns 403 (or rethrow it so Spring Security handles it).

**Equivalences with the custom approach:**

| Custom approach | Spring Security approach |
| --------------------------- | -------------------------------- |
| `UserContext.getUserId()`   | `((LoginUser) authentication.getPrincipal()).getUserId()` |
| `@RequirePermission("x:y")` | `@PreAuthorize("hasAuthority('x:y')")` |
| `PermissionAspect` (custom AOP) | AOP built into the Spring Security framework |
| `AuthInterceptor`           | `JwtAuthenticationFilter`        |

***

## IX. Annotation Reference

| Annotation | Source | Description |
| -------------------------- | -------------------- | -------------------------------------------- |
| `@PostConstruct` | Jakarta | Initialization callback that runs after dependency injection |
| `@RequiredArgsConstructor` | Lombok | Generate a constructor for final fields |
| `@Slf4j` | Lombok | Generate the log logger object |
| `@Aspect` | Spring AOP | Declare an aspect class |
| `@Before` | Spring AOP | Before advice |
| `@RestControllerAdvice` | Spring MVC | Global exception handling |
| `@ExceptionHandler` | Spring MVC | Exception handler method |
| `@Target` | Java | Annotation target |
| `@Retention` | Java | Annotation retention policy |
| `@Constraint` | Jakarta Validation | Custom validation annotation |
| `@Valid` | Jakarta Validation | Trigger parameter validation |
| `@NotBlank` | Jakarta Validation | Require a non-null, nonempty, non-whitespace string |
| `@Value` | Spring | Inject a configuration value |
| `@Component` | Spring | Declare a Spring bean |
| `@Service` | Spring | Declare a service-layer bean |
| `@Configuration` | Spring | Declare a configuration class |
| `@Bean` | Spring | Declare the method's return value as a bean |
| `@EnableWebSecurity` | Spring Security | Enable Spring Security web security configuration |
| `@EnableMethodSecurity` | Spring Security | Enable method authorization (activate `@PreAuthorize`, etc.) |
| `@PreAuthorize` | Spring Security | Check permissions before method execution; supports SpEL |
| `@PostAuthorize` | Spring Security | Check permissions after method execution (can access the return value) |

***

## X. Troubleshooting

| Problem | Possible cause | Solution |
| -------------------------- | -------------------------------------- | ------------------------------------- |
| **Cannot parse token** | Inconsistent keys | Use the same key for generation and parsing |
| **Cross-origin request is rejected as unauthorized** | OPTIONS preflight is intercepted | Allow OPTIONS in the Filter/Interceptor |
| **ThreadLocal memory leak** | Context not cleared after request | Call clear() in afterCompletion |
| **Permission changes do not take effect** | Cache not updated | Clear the relevant caches when permissions change |
| **BCrypt result differs each time** | Normal behavior (random salt) | Verify with matches(), not direct comparison |
| **Redis connection timeout** | Configuration or network issue | Check Redis configuration and connection pool settings |
| **Inaccurate token expiration** | Server clocks out of sync | Synchronize server clocks with NTP |
| **`@PreAuthorize` has no effect** | Configuration class lacks `@EnableMethodSecurity` | Add that annotation to `SecurityConfig` |
| **Permission denial returns a generic error instead of 403** | The global `Exception` handler catches `AccessDeniedException` | Handle `AccessDeniedException` separately and return 403 |
| **Unauthenticated requests return 403 instead of 401** | No authentication entry point is configured | Configure `HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)` |

***

## XI. Example Project Structure

    src/main/java/com/example/
    ├── annotation/          # Custom annotations
    │   ├── CurrentUser.java
    │   └── RequirePermission.java
    ├── aspect/              # AOP aspects
    │   └── PermissionAspect.java
    ├── common/              # Common classes
    │   └── Result.java
    ├── config/              # Configuration classes
    │   ├── SecurityConfig.java
    │   └── WebConfig.java
    ├── context/             # Context
    │   └── UserContext.java
    ├── controller/          # Controllers
    │   ├── AuthController.java
    │   └── CaptchaController.java
    ├── dto/                 # Data transfer objects
    │   ├── LoginRequest.java
    │   └── LoginResponse.java
    ├── entity/              # Entity classes
    │   └── User.java
    ├── exception/           # Exception classes
    │   ├── AuthenticationException.java
    │   ├── BusinessException.java
    │   └── GlobalExceptionHandler.java
    ├── filter/              # Filters (choose one approach)
    │   └── AuthFilter.java
    ├── interceptor/         # Interceptors (choose one approach)
    │   └── AuthInterceptor.java
    ├── mapper/              # MyBatis Mapper
    │   └── PermissionMapper.java
    ├── resolver/            # Argument resolvers
    │   └── CurrentUserResolver.java
    ├── service/             # Service layer
    │   ├── AuthService.java
    │   ├── CaptchaService.java
    │   ├── LoginAttemptService.java
    │   ├── PermissionService.java
    │   ├── SmsService.java
    │   └── TokenBlacklistService.java
    ├── utils/               # Utility classes
    │   └── JwtUtils.java
    └── validation/          # Custom validation
        ├── PasswordValidator.java
        └── StrongPassword.java
