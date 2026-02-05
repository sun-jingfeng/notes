---
name: backend-knowledge-notes
description: Generate backend knowledge notes matching the user's existing note style, format, content structure, and depth. Use when the user asks to write, create, add, or expand notes about Java, Spring Boot, databases, microservices, or any backend topic.
---

# 后端知识笔记生成规范

生成笔记时，严格遵循以下规范，确保与现有 `2-后端/知识笔记` 的格式、内容表述、深度完全一致。

---

## 一、格式规范

### 1.1 标题层级

```markdown
## 一、大章节标题（中文数字）

### 1.1 小节标题（阿拉伯数字）

#### 子标题（四级，仅在需要时使用）
```

- 一级章节：`## 一、`、`## 二、`（中文数字）
- 二级小节：`### 1.` 或 `### 1.1`（阿拉伯数字）
- 不要跳级（不能从 `##` 直接到 `####`）

### 1.2 章节分隔

大章节之间用 `***` 分隔：

```markdown
## 一、概述

内容...

***

## 二、核心概念
```

### 1.3 表格

频繁使用表格归纳、对比，表格中关键词加粗：

```markdown
| 对比项     | 异常（Exception） | 错误（Error）    |
| ---------- | ----------------- | ---------------- |
| **定义**   | 程序可以处理的问题 | 程序无法处理的问题 |
| **处理**   | 可以捕获并处理     | 无法处理，只能避免 |
```

### 1.4 代码块

- 始终带语言标识（java、xml、bash、sql、yaml）
- 代码内写注释说明关键步骤
- 用 `// ❌` 标注错误用法，`// ✅` 标注正确用法
- 长代码用分隔注释划分区域

```java
public class Demo {
    // ========== 成员变量 ==========
    private String name;
    
    public void test() {
        // name = name;       // ❌ 错误！自己赋值给自己
        this.name = name;     // ✅ 正确！this.name 是成员变量
    }
}
```

### 1.5 流程/继承关系图

**方式一**：缩进 + 箭头（流程）

```markdown
    客户端发送请求
        ↓
    DispatcherServlet 接收
        ↓
    返回响应
```

**方式二**：树形结构（继承/目录）

```markdown
    java.lang.Throwable
        │
        ├── Error（错误）
        │       ├── OutOfMemoryError
        │       └── StackOverflowError
        │
        └── Exception（异常）
                ├── RuntimeException
                └── IOException
```

**方式三**：行内箭头（简短流程）

```markdown
注册驱动 → 获取连接 → 执行SQL → 处理结果 → 释放资源
```

### 1.6 强调与标注

- **粗体**：强调关键概念、术语
- `行内代码`：标注代码、命令、注解、类名
- `**粗体** + 行内代码`组合：`**Spring Boot**` 是...

### 1.7 提示与符号

```markdown
> 💡 提示内容写在这里

> **注意**：重要提醒写在这里
```

常用符号：
- `❌` 错误/不推荐
- `✅` 正确/推荐
- `⭐` 重点/常用
- `💡` 提示

---

## 二、内容表述规范

### 2.1 概念引入模式

每个新概念遵循固定模式：

**① 一句话定义**（粗体标注核心词）

```markdown
**AOP（Aspect Oriented Programming）** 面向切面编程，是一种编程范式，用于将横切关注点从业务逻辑中分离出来。
```

**② 核心思想**（可选，一句话概括）

```markdown
**核心思想：** 在不修改原有代码的情况下，对功能进行增强。
```

**③ 表格归纳特点/对比**

```markdown
| 特点         | 说明                        |
| ------------ | --------------------------- |
| **声明式编程** | 告诉"做什么"，而不是"怎么做" |
| **链式调用**   | 多个操作可以链接在一起       |
```

**④ 代码示例**

**⑤ 应用场景/注意事项**（可选）

### 2.2 对比模式

频繁使用对比来解释概念：

**传统方式 vs 新方式**

```markdown
### 2. 传统方式 vs Stream 流

| 方式       | 特点             |
| ---------- | ---------------- |
| 传统方式   | 代码繁琐、命令式 |
| Stream 流  | 代码简洁、声明式 |
```

**两种方案对比**

```markdown
| 对比项   | JDBC           | MyBatis        |
| -------- | -------------- | -------------- |
| 代码量   | 大量重复代码   | 大幅减少       |
| SQL 编写 | 硬编码在 Java 中 | 独立在 XML/注解 |
```

### 2.3 代码示例风格

**完整可运行**：示例代码应该完整，能直接运行或复制使用

**详细注释**：每个关键步骤都有注释

```java
public class TransactionDemo {
    public static void main(String[] args) {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(url, user, pwd);
            
            // 1. 关闭自动提交（开启事务）
            conn.setAutoCommit(false);
            
            // 2. 执行多条 SQL
            // ...
            
            // 3. 提交事务
            conn.commit();
            
        } catch (Exception e) {
            // 4. 回滚事务
            try { if (conn != null) conn.rollback(); } catch (SQLException ex) {}
        }
    }
}
```

**代码后总结**：代码示例后用表格总结关键方法/属性

```markdown
| 方法                     | 说明          |
| ------------------------ | ------------- |
| `setAutoCommit(false)`   | 关闭自动提交  |
| `commit()`               | 提交事务      |
| `rollback()`             | 回滚事务      |
```

### 2.4 ASCII 图示

用于架构、对比、内存模型：

```markdown
    ┌─────────────────────────────────────────────────────────────┐
    │                        传统方式（代码侵入）                    │
    │  public void transfer() {                                   │
    │      log.info("开始转账");           // 日志                 │
    │      // 核心业务逻辑                                         │
    │      accountDao.decrease(from, money);                      │
    │  }                                                          │
    ├─────────────────────────────────────────────────────────────┤
    │                        AOP 方式（解耦）                       │
    │  public void transfer() {                                   │
    │      // 只关注核心业务逻辑                                    │
    │      accountDao.decrease(from, money);                      │
    │  }                                                          │
    └─────────────────────────────────────────────────────────────┘
```

---

## 三、内容深度规范

### 3.1 深度定位

- **偏实战、快速上手**：重点在"怎么用"
- **底层原理点到为止**：提及但不深入，可标注"（了解即可）"
- **不堆砌理论**：每段文字都要有实际用途

### 3.2 知识点组织

每个主题按以下顺序组织：

```
概念介绍（是什么）
    ↓
快速入门（怎么用 - 最简单的例子）
    ↓
详细用法（各种场景）
    ↓
进阶/最佳实践（可选）
    ↓
常见问题/注意事项（可选）
```

### 3.3 实用性导向

**应用场景表格**：

```markdown
| 场景         | 说明                               |
| ------------ | ---------------------------------- |
| **日志记录** | 记录方法调用、参数、返回值、耗时   |
| **事务管理** | 统一管理数据库事务                 |
```

**推荐/不推荐**：

```markdown
**推荐用法：**
- 使用 `@GetMapping` 代替 `@RequestMapping(method = GET)`

**不推荐：**
- 直接拼接 SQL 字符串（有 SQL 注入风险）
```

**方式选择指导**：

```markdown
**方式一：Spring Initializr（推荐）**
- 访问 https://start.spring.io/

**方式二：IDEA 创建**
- IDEA → New Project → Spring Initializr
```

### 3.4 补充说明风格

用括号补充说明：

```markdown
- MyBatis（半自动 ORM，需要写 SQL）
- JPA（全自动 ORM，无需写 SQL）
- 添加依赖（Spring Boot 会自动启用，无需额外配置）
- Eureka 服务注册（可选了解 / Netflix 方案）
```

---

## 四、语言风格

### 4.1 简洁口语化

- 不用"我们"、"您"
- 不用"接下来"、"首先...然后..."等过渡词
- 直接陈述

### 4.2 中英混排

- 中文为主
- 专有名词保留英文：Spring Boot、MyBatis、Controller、Bean
- 首次出现可加中文：**AOP（Aspect Oriented Programming）** 面向切面编程

### 4.3 术语一致

与现有笔记保持一致：
- 起步依赖（不是"启动器依赖"）
- 自动配置（不是"自动装配"）
- 服务注册发现（不是"服务发现与注册"）
- 切入点（不是"切点"）

---

## 五、完整示例

```markdown
## 一、AOP 概述

### 1.1 什么是 AOP

**AOP（Aspect Oriented Programming）** 面向切面编程，是一种编程范式，用于将横切关注点（如日志、事务、权限）从业务逻辑中分离出来。

**核心思想：** 在不修改原有代码的情况下，对功能进行增强。

### 1.2 核心概念

| 概念               | 说明                               | 示例                     |
| ------------------ | ---------------------------------- | ------------------------ |
| **切面（Aspect）** | 封装横切关注点的类                 | 日志切面、事务切面       |
| **切入点（Pointcut）** | 定义哪些方法会被增强           | `execution(* com.example.*.*(..))` |
| **通知（Advice）** | 切面在特定连接点执行的动作         | 前置通知、环绕通知       |

***

### 1.3 应用场景

| 场景         | 说明                             |
| ------------ | -------------------------------- |
| **日志记录** | 记录方法调用、参数、返回值       |
| **事务管理** | 统一管理数据库事务               |
| **权限校验** | 检查用户是否有权限执行某操作     |

***

## 二、Spring AOP 基础

### 2.1 添加依赖

\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
\`\`\`

> 💡 Spring Boot 会自动启用 AOP，无需额外配置。

### 2.2 快速入门

\`\`\`java
@Aspect      // 声明这是一个切面类
@Component   // 必须配合 @Component，让 Spring 管理
public class LogAspect {

    // 定义切入点
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void servicePointcut() {}

    // 前置通知
    @Before("servicePointcut()")
    public void before(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        log.info("方法执行前: {}", methodName);
    }
}
\`\`\`

| 注解        | 说明                               |
| ----------- | ---------------------------------- |
| `@Aspect`   | 声明当前类是一个切面类             |
| `@Pointcut` | 定义切入点，指定哪些方法会被增强   |
| `@Before`   | 前置通知，在目标方法执行前执行     |
```

---

## 六、生成前检查清单

生成笔记前，确认：

- [ ] 标题层级正确（`##` 一级用中文数字，`###` 二级用阿拉伯数字）
- [ ] 大章节间有 `***` 分隔
- [ ] 概念有一句话定义 + 表格归纳
- [ ] 代码完整可运行，有注释
- [ ] 关键词加粗，代码用行内代码标注
- [ ] 有对比、有表格、有示例
- [ ] 深度适中，偏实战
- [ ] 术语与现有笔记一致
