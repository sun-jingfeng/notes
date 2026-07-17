# Reference Index of Existing Notes

This skill applies to **all notes under `/Volumes/Workspace/notes`**. When generating or modifying any note, use the same-style notes below as references.

> Directory names are English; legacy note files keep their original (often Chinese) file names and content. Use legacy notes as references for **structure, tables, diagrams, and depth**, not phrasing. The Golang notes (`2-Backend/Golang/`) are written in English and are the primary reference for the **English writing style** of new notes.

## Recommended References by Content Type

| Content type to write | Recommended reference note | What to learn from it |
| --------------------- | -------------------------- | --------------------- |
| Any new English-language note | `2-Backend/Golang/1-Go Overview and Setup.md` and siblings | English phrasing, heading style, overall voice |
| Java fundamentals (classes, objects, inheritance) | `1-Basics/9-面向对象基础.md` | Concept-definition pattern, memory diagrams, comparison tables |
| Exception / error handling | `2-Advanced/4-异常.md` | Inheritance tree diagrams, exception classification tables |
| Collections / Stream operations | `2-Advanced/3-Stream流.md` | Traditional-vs-new comparisons, chained code examples |
| Framework overviews (Spring Boot etc.) | `3-Web Development/3-Spring Boot基础.md` | Feature tables, ecosystem diagrams, quick start |
| Annotations / configuration | `3-Web Development/5-Web开发基础.md` | Annotation attribute tables, derived-annotation comparisons |
| Databases / persistence layer | `3-Web Development/8-JDBC、MyBatis.md` | Framework comparison tables, SQL code examples, transaction management |
| AOP / aspects | `3-Web Development/11-AOP.md` | Concept relationship diagrams, ASCII comparison diagrams, advice types |
| Microservices / distributed systems | `3-Web Development/15.微服务基础.md`, `16.微服务进阶.md` | Architecture diagrams, component tables, config examples |
| Tooling / ops | `3-Web Development/12-Linux.md`, `13-Docker.md` | Command tables, common operations |

Java note paths above are relative to `2-Backend/Notes/`.

## Full Note Directory (2-Backend)

```
2-Backend/
├── Golang/                          ← English notes; style reference for new notes
│   ├── 1-Go Overview and Setup.md
│   ├── 2-Basic Syntax.md
│   ├── ... (10 files, numbered by topic)
│   └── 10-Generics.md
└── Notes/
    ├── 1-Basics/
    │   ├── 1-DOS命令.md … 12-集合基础.md
    │   └── 9-面向对象基础.md          ← concept intros, memory diagrams
    ├── 2-Advanced/
    │   ├── 1-Collection、List、泛型.md … 10-高级特性.md
    │   ├── 3-Stream流.md              ← comparison pattern, chained code
    │   ├── 4-异常.md                  ← inheritance tree diagrams
    │   └── 11-JVM内存与GC.md
    ├── 3-Web Development/
    │   ├── 1-Maven基础.md … 14-Redis.md
    │   ├── 3-Spring Boot基础.md       ← framework overview, ecosystem diagram
    │   ├── 5-Web开发基础.md           ← annotation tables, RESTful examples
    │   ├── 8-JDBC、MyBatis.md         ← framework comparison, transactions
    │   ├── 11-AOP.md                  ← ASCII comparison diagrams, aspects
    │   ├── 15.微服务基础.md           ← architecture diagrams, component tables
    │   ├── 16.微服务进阶.md
    │   └── 17.Elasticsearch.md
    ├── 4-AI Agent Development/
    │   ├── 1-LangChain.md
    │   ├── 2-Jupyter.md
    │   ├── 3-LangGraph.md
    │   └── 4-Python最小智能体实战（DeepSeek+工具调用）.md
    └── 5-Python/
        └── 1-Python基础入门.md
```

Frontend and general notes live under `1-Frontend/Notes/` and `3-General/Notes/` with similar conventions.

## How to Use

1. Based on the topic to write about, find the recommended reference in the table above
2. Use the Read tool to open that note file
3. Study its phrasing patterns, table structures, and code comment style
4. Generate the new note per SKILL.md, keeping the style consistent
