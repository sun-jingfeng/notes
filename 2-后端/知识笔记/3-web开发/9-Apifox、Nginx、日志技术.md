## 一、Apifox

### 1.1 简介

**Apifox** 是一款集 API 文档、API 调试、API Mock、API 自动化测试于一体的 API 开发协作平台。

> 💡 可以理解为：**Apifox = Postman + Swagger + Mock + JMeter**

**为什么使用 Apifox？**

| 场景         | 说明                   |
| ---------- | -------------------- |
| 🔧 接口调试    | 后端开发完接口后，快速测试是否正常    |
| 📝 接口文档    | 自动生成规范的 API 文档，前后端协作 |
| 🎭 Mock 数据 | 后端未完成时，前端可使用模拟数据开发   |
| ✅ 自动化测试    | 批量执行测试用例，保证接口质量      |

***

### 1.2 安装与使用

#### 下载安装

*   官网：<https://apifox.com/>
*   支持 Windows、Mac、Linux
*   也可使用 Web 版（无需安装）

#### 界面概览

    ┌─────────────────────────────────────────────────────────────────────────┐
    │  Apifox                                                    👤 登录      │
    ├─────────────┬───────────────────────────────────────────────────────────┤
    │             │                                                           │
    │  📁 项目列表  │   GET  ▼  │ http://localhost:8080/api/users    │  发送  │
    │             │  ─────────────────────────────────────────────────────── │
    │  ├─ 用户管理  │   Params │ Headers │ Body │ Auth │ Pre │ Post │        │
    │  │  ├─ 查询  │  ─────────────────────────────────────────────────────── │
    │  │  ├─ 新增  │                                                          │
    │  │  ├─ 修改  │   响应 200 OK  ⏱ 45ms                                    │
    │  │  └─ 删除  │   ┌──────────────────────────────────────────────────┐  │
    │  │          │   │ {                                                  │  │
    │  ├─ 部门管理  │   │   "code": 1,                                      │  │
    │  │          │   │   "msg": "success",                                │  │
    │  └─ ...     │   │   "data": [...]                                    │  │
    │             │   │ }                                                  │  │
    │             │   └──────────────────────────────────────────────────┘  │
    └─────────────┴───────────────────────────────────────────────────────────┘

***

### 1.3 发送请求

#### 请求类型与用途

| 请求方式       | 用途       | 请求体    | 示例                            |
| ---------- | -------- | ------ | ----------------------------- |
| **GET**    | 查询资源     | ❌ 无    | `GET /users` 或 `GET /users/1` |
| **POST**   | 新增资源     | ✅ JSON | `POST /users`                 |
| **PUT**    | 修改资源（全量） | ✅ JSON | `PUT /users/1`                |
| **PATCH**  | 修改资源（部分） | ✅ JSON | `PATCH /users/1`              |
| **DELETE** | 删除资源     | ❌ 无    | `DELETE /users/1`             |

#### GET 请求示例

    请求方式：GET
    请求地址：http://localhost:8080/api/users

    ┌─ Params ──────────────────────────────────────────┐
    │  Key          │  Value                            │
    ├───────────────┼───────────────────────────────────┤
    │  page         │  1                                │
    │  size         │  10                               │
    │  name         │  张三                              │
    └───────────────┴───────────────────────────────────┘

    实际请求：GET /api/users?page=1&size=10&name=张三

#### POST 请求示例（JSON）

    请求方式：POST
    请求地址：http://localhost:8080/api/users

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

#### DELETE 请求示例

**方式一：路径参数**

    DELETE http://localhost:8080/api/users/1

    说明：删除 ID 为 1 的用户

**方式二：查询参数**

    DELETE http://localhost:8080/api/users?id=1

    说明：通过查询参数传递 ID

***

### 1.4 查看响应

#### 常见状态码

| 状态码   | 含义                    | 说明       |
| ----- | --------------------- | -------- |
| `200` | OK                    | 请求成功     |
| `201` | Created               | 资源创建成功   |
| `400` | Bad Request           | 请求参数错误   |
| `401` | Unauthorized          | 未认证（未登录） |
| `403` | Forbidden             | 无权限访问    |
| `404` | Not Found             | 资源不存在    |
| `405` | Method Not Allowed    | 请求方法不支持  |
| `500` | Internal Server Error | 服务器内部错误  |

***

## 二、Nginx

### 2.1 简介

**Nginx**（发音：engine-x）是一款高性能的 HTTP 和反向代理服务器，也可作为邮件代理服务器。

**核心特点：**

| 特点      | 说明                       |
| ------- | ------------------------ |
| ⚡ 高性能   | 支持高并发连接，内存占用少            |
| 🔄 反向代理 | 隐藏后端服务器，统一入口             |
| ⚖️ 负载均衡 | 将请求分发到多个服务器              |
| 📁 静态资源 | 高效处理静态文件（HTML、CSS、JS、图片） |
| 🔒 安全性  | 支持 SSL/TLS 加密            |

**应用场景：**

    ┌─────────────────────────────────────────────────────────────────────────┐
    │                              互联网用户                                  │
    └─────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                            Nginx 服务器                                 │
    │  ┌─────────────────────────────────────────────────────────────────┐   │
    │  │  • 反向代理                                                      │   │
    │  │  • 负载均衡                                                      │   │
    │  │  • 静态资源服务                                                  │   │
    │  │  • SSL 终端                                                      │   │
    │  └─────────────────────────────────────────────────────────────────┘   │
    └───────────┬─────────────────────┬─────────────────────┬─────────────────┘
                │                     │                     │
                ▼                     ▼                     ▼
        ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
        │  后端服务器 1   │     │  后端服务器 2   │     │  后端服务器 3   │
        │  (Tomcat)     │     │  (Tomcat)     │     │  (Tomcat)     │
        └───────────────┘     └───────────────┘     └───────────────┘

***

### 2.2 安装与启动

#### Windows 安装

    1. 下载：http://nginx.org/en/download.html
    2. 解压到任意目录（路径不要有中文）
    3. 目录结构：
       nginx/
       ├── conf/           # 配置文件目录
       │   └── nginx.conf  # 主配置文件
       ├── html/           # 静态资源目录
       ├── logs/           # 日志目录
       └── nginx.exe       # 执行文件

#### 常用命令

```bash
# 启动 Nginx（在 nginx 目录下执行）
start nginx

# 或者直接双击 nginx.exe

# 停止 Nginx
nginx -s stop      # 快速停止
nginx -s quit      # 优雅停止（处理完当前请求）

# 重新加载配置（修改配置后使用）
nginx -s reload

# 检查配置文件语法
nginx -t

# 查看版本
nginx -v
```

#### 验证安装

    启动后访问：http://localhost:80
    看到 "Welcome to nginx!" 页面即表示安装成功

***

### 2.3 核心配置文件

#### 配置文件位置

    nginx/conf/nginx.conf

#### 配置结构概览

```nginx
# 全局配置
worker_processes  1;                    # 工作进程数

# 事件配置
events {
    worker_connections  1024;           # 每个进程最大连接数
}

# HTTP 配置
http {
    include       mime.types;           # 引入 MIME 类型
    default_type  application/octet-stream;
    
    # 日志格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" ';
    
    # 服务器配置（可配置多个）
    server {
        listen       80;                # 监听端口
        server_name  localhost;         # 服务器名称
        
        # 路由配置
        location / {
            root   html;                # 静态资源根目录
            index  index.html;          # 默认首页
        }
        
        # 错误页面
        error_page   500 502 503 504  /50x.html;
    }
}
```

***

### 2.4 部署静态资源

#### 部署前端项目

**① 将前端文件放入 html 目录：**

    nginx/
    └── html/
        ├── index.html
        ├── css/
        │   └── style.css
        ├── js/
        │   └── app.js
        └── images/
            └── logo.png

**② 配置 nginx.conf：**

```nginx
server {
    listen       80;
    server_name  localhost;
    
    location / {
        root   html;              # 静态资源目录
        index  index.html;        # 默认首页
    }
}
```

**③ 重新加载配置：**

```bash
nginx -s reload
```

**④ 访问：**

    http://localhost:80

***

### 2.5 反向代理

#### 什么是反向代理

    ┌─────────────────────────────────────────────────────────────────────────┐
    │  正向代理（代理客户端）                                                   │
    │                                                                         │
    │  客户端 ──▶ 代理服务器 ──▶ 目标服务器                                    │
    │  （知道目标）  （帮客户端访问）                                           │
    │                                                                         │
    │  例如：VPN、科学上网                                                     │
    ├─────────────────────────────────────────────────────────────────────────┤
    │  反向代理（代理服务端）                                                   │
    │                                                                         │
    │  客户端 ──▶ 代理服务器 ──▶ 后端服务器                                    │
    │  （不知道后端）  （转发请求）                                             │
    │                                                                         │
    │  例如：Nginx 反向代理                                                    │
    └─────────────────────────────────────────────────────────────────────────┘

#### 反向代理配置

**场景：将 `/api` 请求转发到后端 Tomcat 服务器**

```nginx
server {
    listen       80;
    server_name  localhost;
    
    # 前端静态资源
    location / {
        root   html;
        index  index.html;
    }
    
    # 反向代理：将 /api 请求转发到后端
    location /api {
        proxy_pass http://localhost:8080;    # 后端服务器地址
        
        # 设置请求头
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**请求流程：**

    用户访问：http://localhost/api/users
             ↓
    Nginx 匹配到 location /api
             ↓
    转发到：http://localhost:8080/api/users
             ↓
    后端处理并返回结果
             ↓
    Nginx 将结果返回给用户

***

### 2.6 负载均衡

#### 什么是负载均衡

将请求分发到多个后端服务器，提高系统的并发能力和可用性。

                        ┌─────────────────┐
                        │     Nginx       │
                        │   负载均衡器     │
                        └────────┬────────┘
                                 │
               ┌─────────────────┼─────────────────┐
               ▼                 ▼                 ▼
        ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
        │  Tomcat 1   │   │  Tomcat 2   │   │  Tomcat 3   │
        │  :8081      │   │  :8082      │   │  :8083      │
        └─────────────┘   └─────────────┘   └─────────────┘

#### 负载均衡配置

```nginx
# 定义后端服务器组
upstream backend {
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
    server 127.0.0.1:8083;
}

server {
    listen       80;
    server_name  localhost;
    
    location /api {
        proxy_pass http://backend;    # 使用服务器组名
    }
}
```

#### 负载均衡策略

| 策略          | 配置            | 说明               |
| ----------- | ------------- | ---------------- |
| **轮询（默认）**  | 无需配置          | 按顺序依次分发请求        |
| **权重**      | `weight=n`    | 按权重比例分发，权重越高分发越多 |
| **IP Hash** | `ip_hash;`    | 同一 IP 固定访问同一服务器  |
| **最少连接**    | `least_conn;` | 优先分发给连接数最少的服务器   |

**权重配置示例：**

```nginx
upstream backend {
    server 127.0.0.1:8081 weight=3;    # 权重 3，接收更多请求
    server 127.0.0.1:8082 weight=2;    # 权重 2
    server 127.0.0.1:8083 weight=1;    # 权重 1
}
```

**IP Hash 配置示例：**

```nginx
upstream backend {
    ip_hash;                           # 启用 IP Hash
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
    server 127.0.0.1:8083;
}
```

***

### 2.7 完整配置示例

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
    
    # 后端服务器组
    upstream backend {
        server 127.0.0.1:8081 weight=2;
        server 127.0.0.1:8082 weight=1;
    }
    
    server {
        listen       80;
        server_name  localhost;
        
        # 前端静态资源
        location / {
            root   html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;  # 支持前端路由
        }
        
        # 反向代理 + 负载均衡
        location /api {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_connect_timeout 60s;
            proxy_read_timeout 60s;
        }
        
        # 错误页面
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

***

### 2.8 常见问题

| 问题     | 解决方案                       |
| ------ | -------------------------- |
| 端口被占用  | 修改 `listen` 端口或关闭占用程序      |
| 配置不生效  | 执行 `nginx -s reload` 重新加载  |
| 访问 404 | 检查 `root` 路径和文件是否存在        |
| 代理超时   | 增加 `proxy_read_timeout` 时间 |
| 修改配置报错 | 先执行 `nginx -t` 检查语法        |

***

## 三、日志技术

### 3.1 日志概述

#### 什么是日志

**日志（Log）** 是程序运行过程中产生的记录信息，用于：

*   🔍 **问题排查**：快速定位 Bug 和异常
*   📊 **性能监控**：分析系统瓶颈
*   📝 **行为审计**：记录用户操作
*   📈 **数据分析**：统计业务指标

#### 为什么不用 System.out.println()？

```java
// ❌ 不推荐
System.out.println("用户登录成功");

// ✅ 推荐使用日志框架
log.info("用户登录成功");
```

**对比分析：**

| 对比项      | System.out | 日志框架                          |
| -------- | ---------- | ----------------------------- |
| **输出位置** | 只能控制台      | 控制台、文件、数据库、远程服务器              |
| **日志级别** | ❌ 无        | ✅ TRACE/DEBUG/INFO/WARN/ERROR |
| **格式控制** | ❌ 无        | ✅ 时间、类名、线程、行号等                |
| **开关控制** | ❌ 无法关闭     | ✅ 可按级别、按包开关                   |
| **性能影响** | 同步阻塞，性能差   | 异步写入，性能好                      |
| **文件归档** | ❌ 不支持      | ✅ 按日期/大小自动归档                  |

***

### 3.2 Java 日志框架体系

    ┌─────────────────────────────────────────────────────────────────────┐
    │                         应用程序代码                                 │
    │                    log.info("业务日志");                            │
    └─────────────────────────────┬───────────────────────────────────────┘
                                  │
    ┌─────────────────────────────▼───────────────────────────────────────┐
    │                       日志门面（接口层）                             │
    │        SLF4J（Simple Logging Facade for Java）← 主流                │
    └─────────────────────────────┬───────────────────────────────────────┘
                                  │
    ┌─────────────────────────────▼───────────────────────────────────────┐
    │                       日志实现（实现层）                             │
    │        Logback      ← Spring Boot 默认，性能最好                     │
    │        Log4j2       ← Apache 出品，功能强大                         │
    └─────────────────────────────────────────────────────────────────────┘

> 💡 **Spring Boot 默认使用：SLF4J + Logback**，无需额外添加依赖

***

### 3.3 Logback 快速入门

#### 获取 Logger 对象

**方式一：LoggerFactory 创建**

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
public class UserController {
    
    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    
    @GetMapping("/users")
    public Result list() {
        log.info("查询所有用户");
        return Result.success(userService.list());
    }
}
```

**方式二：@Slf4j 注解（推荐）**

```java
import lombok.extern.slf4j.Slf4j;

@Slf4j  // Lombok 自动生成 log 对象
@RestController
public class UserController {
    
    @GetMapping("/users")
    public Result list() {
        log.info("查询所有用户");
        return Result.success(userService.list());
    }
}
```

#### 日志输出方法

```java
log.trace("trace - 最详细的跟踪信息");
log.debug("debug - 调试信息");
log.info("info - 一般信息");
log.warn("warn - 警告信息");
log.error("error - 错误信息");
```

#### 占位符语法

```java
// ✅ 推荐：使用 {} 占位符
log.info("用户 {} 登录成功", username);
log.info("查询用户，ID = {}，结果：{}", id, user);

// ❌ 不推荐：字符串拼接
log.info("用户 " + username + " 登录成功");

// ✅ 打印异常堆栈
try {
    // ...
} catch (Exception e) {
    log.error("操作失败：{}", e.getMessage(), e);
}
```

***

### 3.4 Logback 日志级别

#### 级别定义

    TRACE  <  DEBUG  <  INFO  <  WARN  <  ERROR
      │        │        │        │        │
      │        │        │        │        └── 错误：程序异常，需立即处理
      │        │        │        └── 警告：潜在问题，可能导致错误
      │        │        └── 信息：正常业务流程（默认级别）
      │        └── 调试：开发调试信息
      └── 跟踪：最详细的诊断信息

#### 级别规则

**设置级别后，只输出 >= 该级别的日志**

    例如：设置 level = INFO

    log.trace("...")  →  ❌ 不输出
    log.debug("...")  →  ❌ 不输出
    log.info("...")   →  ✅ 输出
    log.warn("...")   →  ✅ 输出
    log.error("...")  →  ✅ 输出

#### 级别使用场景

| 级别        | 使用场景      | 示例          |
| --------- | --------- | ----------- |
| **TRACE** | 极其详细的诊断信息 | 循环中的每次迭代    |
| **DEBUG** | 开发调试信息    | 方法参数、SQL 语句 |
| **INFO**  | 业务流程关键节点  | 用户登录、订单创建   |
| **WARN**  | 潜在问题      | 参数异常、重试操作   |
| **ERROR** | 程序错误      | 异常捕获、业务失败   |

#### 配置日志级别

```yaml
logging:
  level:
    root: INFO                            # 全局级别
    com.example: DEBUG                    # 项目代码
    com.example.mapper: DEBUG             # Mapper 层（可看 SQL）
```

***

### 3.5 Logback 配置文件详解

#### 配置文件位置

    src/main/resources/logback-spring.xml

#### 完整配置模板

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="30 seconds">
    
    <!-- 属性定义 -->
    <property name="LOG_PATH" value="logs"/>
    <property name="APP_NAME" value="project"/>
    <property name="LOG_PATTERN" 
              value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n"/>
    
    <!-- 控制台输出 -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>
    
    <!-- 文件输出 -->
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
    
    <!-- 错误日志单独输出 -->
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
    
    <!-- 开发环境 -->
    <springProfile name="dev">
        <root level="DEBUG">
            <appender-ref ref="CONSOLE"/>
        </root>
        <logger name="com.example.mapper" level="DEBUG"/>
    </springProfile>
    
    <!-- 生产环境 -->
    <springProfile name="prod">
        <root level="INFO">
            <appender-ref ref="CONSOLE"/>
            <appender-ref ref="FILE"/>
            <appender-ref ref="ERROR_FILE"/>
        </root>
    </springProfile>
    
</configuration>
```

#### 核心元素说明

| 元素                | 说明                  |
| ----------------- | ------------------- |
| `<property>`      | 定义变量，通过 `${变量名}` 引用 |
| `<appender>`      | 日志输出器（控制台、文件等）      |
| `<encoder>`       | 日志格式编码器             |
| `<rollingPolicy>` | 滚动策略（按日期/大小归档）      |
| `<filter>`        | 日志过滤器               |
| `<logger>`        | 指定包/类的日志级别          |
| `<root>`          | 根日志配置               |
| `<springProfile>` | 多环境配置               |

#### 日志格式占位符

| 占位符           | 说明       | 示例输出                      |
| ------------- | -------- | ------------------------- |
| `%d{pattern}` | 日期时间     | `2024-01-15 10:30:45.123` |
| `%thread`     | 线程名      | `http-nio-8080-exec-1`    |
| `%-5level`    | 日志级别     | `INFO `                   |
| `%logger{n}`  | Logger 名 | `c.e.c.UserController`    |
| `%msg`        | 日志消息     | `查询用户成功`                  |
| `%n`          | 换行符      | -                         |

***

### 3.6 日志输出示例

    2024-01-15 10:30:45.123 [http-nio-8080-exec-1] INFO  c.e.controller.UserController - 查询所有用户
    2024-01-15 10:30:45.156 [http-nio-8080-exec-1] DEBUG c.e.mapper.UserMapper - ==>  Preparing: SELECT * FROM user
    2024-01-15 10:30:45.178 [http-nio-8080-exec-1] DEBUG c.e.mapper.UserMapper - ==> Parameters: 
    2024-01-15 10:30:45.198 [http-nio-8080-exec-1] DEBUG c.e.mapper.UserMapper - <==      Total: 10

***

### 3.7 最佳实践

```java
@Slf4j
@Service
public class OrderService {
    
    public Order createOrder(OrderDTO dto) {
        // ✅ 方法入口：记录关键参数
        log.info("创建订单开始，用户ID：{}", dto.getUserId());
        
        // ✅ 调试信息
        log.debug("订单详细参数：{}", dto);
        
        // ✅ 业务警告
        if (dto.getQuantity() > 100) {
            log.warn("订单数量异常：{}", dto.getQuantity());
        }
        
        try {
            // 业务逻辑...
            log.info("创建订单成功，订单号：{}", order.getOrderNo());
            return order;
        } catch (Exception e) {
            // ✅ 异常处理：记录错误信息和堆栈
            log.error("创建订单失败：{}", e.getMessage(), e);
            throw new BusinessException("订单创建失败");
        }
    }
}
```

***

### 3.8 简易配置（application.yml）

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

## 四、总结

| 工具/技术       | 用途       | 核心功能            |
| ----------- | -------- | --------------- |
| **Apifox**  | API 测试工具 | 发送请求、调试接口、生成文档  |
| **Nginx**   | Web 服务器  | 静态资源、反向代理、负载均衡  |
| **Logback** | 日志框架     | 记录程序运行信息，便于排查问题 |

