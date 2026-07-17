---
name: knowledge-notes
description: Applies to all note-related operations in /Volumes/Workspace/notes (creating, expanding, editing, polishing, supplementing, etc.). When generating or modifying any note, follow the format, content structure, and depth of the existing notes. Covers Java, Spring Boot, databases, microservices, and other backend/technical topics.
---

# Knowledge Note Standards

**Scope:** These standards apply to **all note-related operations**, including but not limited to: creating new notes, expanding, editing, polishing, adding paragraphs, and restructuring. Any operation targeting a note under `/Volumes/Workspace/notes` must follow the rules below.

**Understanding and executing user instructions:** When the user gives an instruction, act on the intent — you do not need to preserve their exact wording. You may replace the user's phrasing with more accurate, professional terminology before executing or writing it into a note. **When the user offers their own ideas, suggestions, or preferred phrasing:** treat it as reference only; build your own professional wording (terminology, tables, structure) from its key points rather than copying the user's words verbatim. **When the user asks to "improve quality":** treat raising note quality as the primary goal. You may remove low-value, dispensable content and add missing important knowledge points or key explanations; do not edit merely to make things shorter or longer. If the current outline, section division, or overall structure hinders comprehension or lookup, you may improve that too.

When generating or modifying notes, strictly follow the standards below to stay fully consistent with existing notes in format, phrasing, and depth.

---

## 1. Format Standards

### 1.1 Heading Levels

**Headings start at level 2, with a maximum depth of 3 levels** — only **level 2 (##), level 3 (###), and level 4 (####)** headings are allowed.

```markdown
## 1. Chapter Title (level 2)

### 1.1 Section Title (level 3)

#### Sub-heading (level 4, only when needed)
```

- **Level-2 headings**: `## 1.`, `## 2.` (major chapters)
- **Level-3 headings**: `### 1.` or `### 1.1` (sections)
- **Level-4 headings**: `####` (sub-headings, only when needed)
- Never skip levels (do not jump from `##` straight to `####`)
- Never use level-1 headings (`#`); the document title does not count in the hierarchy
- **Use integer numbering**: if a level-4 heading is numbered, use integers like `#### 1.`, `#### 2.`, `#### 8.` — never decimals (❌ `#### 7.5`). When inserting a new section, renumber the following ones (e.g. old 8 becomes 9); do not insert a 7.5-style number.

> Legacy notes in this repo were written in Chinese and use Chinese numerals for level-2 headings (`## 一、`). When editing a Chinese note in place, keep its existing conventions; new notes are written in English with the numbering above.

### 1.2 Chapter Separators

Separate major chapters with `***`:

```markdown
## 1. Overview

Content...

***

## 2. Core Concepts
```

Only within the **lowest-level heading**, if it contains multiple **independent topic blocks** (e.g. "Producer Reconnect", "Publisher Confirm", "Consumer Ack"), also separate those blocks with `***`. Higher-level headings are already separated by their sub-headings and do not need extra `***`:

```markdown
#### 6. Message Reliability

**Producer Reconnect:**

Content...

***

**Publisher Confirm:**

Content...

***

**Consumer Ack:**

Content...
```

### 1.3 Tables

Use tables frequently to summarize and compare; bold the key terms in table cells:

```markdown
| Aspect       | Exception                        | Error                              |
| ------------ | -------------------------------- | ---------------------------------- |
| **Definition** | A problem the program can handle | A problem the program cannot handle |
| **Handling** | Can be caught and handled        | Cannot be handled; only avoided    |
```

### 1.4 Code Blocks

- Always include a language identifier (java, xml, bash, sql, yaml)
- Comment the key steps inside the code
- Mark wrong usage with `// ❌` and correct usage with `// ✅`
- Use separator comments to divide regions in long code

```java
public class Demo {
    // ========== Fields ==========
    private String name;
    
    public void test() {
        // name = name;       // ❌ Wrong! Assigns the parameter to itself
        this.name = name;     // ✅ Correct! this.name is the field
    }
}
```

### 1.5 Flow / Inheritance Diagrams

**Style 1**: indentation + arrows (flows)

```markdown
    Client sends request
        ↓
    DispatcherServlet receives it
        ↓
    Response returned
```

**Style 2**: tree structure (inheritance / directories)

```markdown
    java.lang.Throwable
        │
        ├── Error
        │       ├── OutOfMemoryError
        │       └── StackOverflowError
        │
        └── Exception
                ├── RuntimeException
                └── IOException
```

**Style 3**: inline arrows (short flows)

```markdown
Register driver → Get connection → Execute SQL → Process results → Release resources
```

### 1.6 Emphasis and Markup

- **Bold**: emphasize key concepts and terms
- `Inline code`: mark code, commands, annotations, class names
- Combine `**bold** + inline code`: `**Spring Boot**` is...

### 1.7 Tips and Symbols

```markdown
> 💡 Tip content goes here

> **Note**: important reminders go here
```

Common symbols:
- `❌` wrong / not recommended
- `✅` correct / recommended
- `💡` tip

---

## 2. Content Expression Standards

### 2.1 Concept Introduction Pattern

Introduce every new concept in a fixed pattern:

**① One-sentence definition** (bold the core term)

```markdown
**AOP (Aspect Oriented Programming)** is a programming paradigm that separates cross-cutting concerns from business logic.
```

**② Core idea** (optional, one-sentence summary)

```markdown
**Core idea:** enhance functionality without modifying the original code.
```

**③ Table summarizing traits / comparisons**

```markdown
| Trait                   | Description                                |
| ----------------------- | ------------------------------------------ |
| **Declarative style**   | Says *what* to do, not *how* to do it      |
| **Method chaining**     | Multiple operations can be chained together |
```

**④ Code example**

**⑤ Use cases / caveats** (optional)

### 2.2 Comparison Pattern

Use comparisons frequently to explain concepts:

**Traditional vs. new approach**

```markdown
### 2. Traditional Approach vs. Streams

| Approach    | Traits                    |
| ----------- | ------------------------- |
| Traditional | Verbose, imperative       |
| Streams     | Concise, declarative      |
```

**Two-option comparison**

```markdown
| Aspect        | JDBC                    | MyBatis                    |
| ------------- | ----------------------- | -------------------------- |
| Code volume   | Lots of boilerplate     | Greatly reduced            |
| SQL authoring | Hard-coded in Java      | Separate XML / annotations |
```

### 2.3 Code Example Style

**Complete and runnable**: examples should be complete enough to run or copy directly

**Thoroughly commented**: every key step has a comment

```java
public class TransactionDemo {
    public static void main(String[] args) {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(url, user, pwd);
            
            // 1. Disable auto-commit (start the transaction)
            conn.setAutoCommit(false);
            
            // 2. Execute multiple SQL statements
            // ...
            
            // 3. Commit the transaction
            conn.commit();
            
        } catch (Exception e) {
            // 4. Roll back the transaction
            try { if (conn != null) conn.rollback(); } catch (SQLException ex) {}
        }
    }
}
```

**Summary after code**: follow code examples with a table summarizing the key methods/properties

```markdown
| Method                   | Description               |
| ------------------------ | ------------------------- |
| `setAutoCommit(false)`   | Disables auto-commit      |
| `commit()`               | Commits the transaction   |
| `rollback()`             | Rolls back the transaction |
```

### 2.4 ASCII Diagrams

Used for architecture, comparisons, and memory models:

```markdown
    ┌─────────────────────────────────────────────────────────────┐
    │              Traditional approach (invasive code)            │
    │  public void transfer() {                                   │
    │      log.info("Transfer started");   // logging             │
    │      // core business logic                                 │
    │      accountDao.decrease(from, money);                      │
    │  }                                                          │
    ├─────────────────────────────────────────────────────────────┤
    │                    AOP approach (decoupled)                  │
    │  public void transfer() {                                   │
    │      // only the core business logic                        │
    │      accountDao.decrease(from, money);                      │
    │  }                                                          │
    └─────────────────────────────────────────────────────────────┘
```

---

## 3. Content Depth Standards

### 3.1 Depth Positioning

- **Practical, quick-start oriented**: focus on "how to use it"
- **Touch on internals lightly**: mention but don't dive deep; may mark as "(awareness is enough)"
- **No theory dumping**: every paragraph must serve a practical purpose

### 3.2 Knowledge Organization

Organize every topic in this order:

```
Concept (what it is)
    ↓
Quick start (how to use it — the simplest example)
    ↓
Detailed usage (various scenarios)
    ↓
Advanced / best practices (optional)
    ↓
Common issues / caveats (optional)
```

### 3.3 Practicality First

**Use-case tables**:

```markdown
| Scenario                  | Description                                        |
| ------------------------- | -------------------------------------------------- |
| **Logging**               | Record method calls, arguments, return values, timing |
| **Transaction management** | Manage database transactions in one place         |
```

**Recommended / not recommended**:

```markdown
**Recommended:**
- Use `@GetMapping` instead of `@RequestMapping(method = GET)`

**Not recommended:**
- Concatenating SQL strings directly (SQL injection risk)
```

**Choice guidance**:

```markdown
**Option 1: Spring Initializr (recommended)**
- Visit https://start.spring.io/

**Option 2: Create in IDEA**
- IDEA → New Project → Spring Initializr
```

### 3.4 Parenthetical Notes

Use parentheses for supplementary notes:

```markdown
- MyBatis (semi-automatic ORM; you write the SQL)
- JPA (fully automatic ORM; no SQL needed)
- Add the dependency (Spring Boot enables it automatically; no extra config)
- Eureka service registry (optional / the Netflix option)
```

### 3.5 Quality First When Supplementing from Source Material

When supplementing notes from PDFs, slide decks, textbooks, or other external material:

- **Prioritize note quality**: if some content in the material is unclear, technically outdated, or conflicts with current best practices, **replace** it with a more accurate, up-to-date explanation or example rather than copying it.
- **When to replace**: vague wording, reliance on old API versions, non-runnable examples, terminology inconsistent with existing notes, obvious errors, etc.
- **When to keep**: when the material serves only as an outline/table of contents, fill in the content following the outline; or when the material is accurate and matches the note style, reuse it with formatting normalized.

---

## 4. Language Style

### 4.1 Concise and Direct

- Do not write "we" or address the reader as "you"
- Do not use transition words like "next", "first... then..."
- State things directly

### 4.2 No Lead-in Phrases

Notes state concepts and steps directly — never write lead-in sentences like "Next, I'll...", "Below we will...", or "The following introduces...".

- ❌ "The following introduces two common ways to...", "Let's hand-write XX below to aid understanding...", "This section first explains... then presents..."
- ❌ A standalone "Steps:" prefix before a table or code block (just write the steps directly as ① ② ③)
- ❌ A standalone "Example:" or "In the example below:" before a code block; instead state the point directly and follow with the code, or use "see the table below", "common assertions are listed below", etc.
- ✅ State the point directly; when needed, use "see the table below" to introduce a table, or one explanatory sentence followed by the code

### 4.3 Language

- Write notes in English
- Keep proper nouns in their standard form: Spring Boot, MyBatis, Controller, Bean
- Expand acronyms on first occurrence: **AOP (Aspect Oriented Programming)**

### 4.4 Consistent Terminology

Stay consistent with existing notes:
- starter dependency (not "launcher dependency")
- auto-configuration (not "auto-wiring")
- service registration and discovery (not "service discovery and registration")
- pointcut (not "cut point")

### 4.5 Generic Expressions, Not Project-Specific Ones

In examples and illustrations, avoid names specific to a single project or business domain (e.g. `order-service`, `cart-service`, a specific module name). Use **generic placeholders or abstract terms** instead:

- ✅ Placeholders: `<service-name>`, `<profile>`, `xxx-service`, `{service-name}-dev.yaml`
- ❌ Avoid using one specific project name as the only example: e.g. `order-service-dev.yaml` (if it's the only example, readers may think the rule applies only to an order service)

**The same rule applies to code examples:**

- ✅ Use generic class/method/variable names: `DemoService`, `BizService`, `queryById`, `handleMessage`, `simple.queue`, `demo.exchange`
- ✅ Use generic parameter and return types: `String message`, `Long id`, `Object data`
- ❌ Avoid binding all examples to one business domain: e.g. using `OrderService`, `StockClient`, `order.queue`, `Order order` throughout (makes the note look e-commerce-only)
- ❌ Avoid domain-specific business logic in code: e.g. `stockService.deduct(order.getProductId())`, `accountClient.debit()`

Rule: in examples, formula explanations, naming rules, and code samples, **use generic expressions that apply to any project** — never bind to a specific business name.

### 4.6 No Cross-References

Note content must be **self-contained and independent** — never include reference-style phrasing:

**① No references to other notes**
- ❌ "See the XXX note for details", "refer to the YYY document"
- ❌ "Explained in detail in ZZ", "see another note"
- ❌ "Related content in xxx/yyy/xxx.md"

**② No references to other sections in the same note**
- ❌ "See above for details", "see section 1.2", "already explained in chapter 2"
- ❌ "As described in the next section", "see the table above"

Whatever needs explaining must be **written out in place** — never via a "see note X / section Y" jump.

---

## 5. Full Example

```markdown
## 1. AOP Overview

### 1.1 What Is AOP

**AOP (Aspect Oriented Programming)** is a programming paradigm that separates cross-cutting concerns (such as logging, transactions, and permissions) from business logic.

**Core idea:** enhance functionality without modifying the original code.

### 1.2 Core Concepts

| Concept        | Description                                    | Example                            |
| -------------- | ---------------------------------------------- | ---------------------------------- |
| **Aspect**     | A class encapsulating a cross-cutting concern  | Logging aspect, transaction aspect |
| **Pointcut**   | Defines which methods get enhanced             | `execution(* com.example.*.*(..))` |
| **Advice**     | The action an aspect performs at a join point  | Before advice, around advice       |

***

### 1.3 Use Cases

| Scenario                  | Description                                     |
| ------------------------- | ----------------------------------------------- |
| **Logging**               | Record method calls, arguments, return values   |
| **Transaction management** | Manage database transactions in one place      |
| **Permission checks**     | Verify the user may perform an operation        |

***

## 2. Spring AOP Basics

### 2.1 Add the Dependency

\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
\`\`\`

> 💡 Spring Boot enables AOP automatically; no extra configuration needed.

### 2.2 Quick Start

\`\`\`java
@Aspect      // Declares this class as an aspect
@Component   // Must pair with @Component so Spring manages it
public class LogAspect {

    // Define the pointcut
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void servicePointcut() {}

    // Before advice
    @Before("servicePointcut()")
    public void before(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        log.info("Before method: {}", methodName);
    }
}
\`\`\`

| Annotation  | Description                                          |
| ----------- | ---------------------------------------------------- |
| `@Aspect`   | Declares the class as an aspect                      |
| `@Pointcut` | Defines the pointcut — which methods get enhanced    |
| `@Before`   | Before advice — runs before the target method        |
```

---

## 6. Pre-generation Checklist

Before generating a note, confirm:

- [ ] Heading levels are correct (start at level 2; only ## / ### / ####; integer numbering only, no 7.5-style decimals)
- [ ] Major chapters separated by `***`
- [ ] Every concept has a one-sentence definition + summary table
- [ ] Code is complete, runnable, and commented
- [ ] Key terms bolded; code marked with inline code
- [ ] Includes comparisons, tables, and examples
- [ ] Depth is moderate and practice-oriented
- [ ] Terminology consistent with existing notes
- [ ] No lead-in phrases (no "next", "the following introduces", "Steps:", "Example:" — state directly)
- [ ] No cross-references (neither to other notes nor to other sections of the same note)
- [ ] When supplementing from PDF/slides etc.: low-quality or outdated material has been replaced with better, up-to-date content
