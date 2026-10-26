# Reference Index of Existing Notes

This skill applies to **all notes under `/Volumes/Workspace/notes`**. When generating or modifying any note, use the same-style notes below as references.

> Directory names are English. The Java notes (`2-Backend/Java/`) and Golang notes (`2-Backend/Golang/`) are written in English; the Golang notes are the primary reference for the **English writing style** of new notes. Some legacy notes (for example `2-Backend/Python/` and `2-Backend/AI Agent/`) keep their original Chinese file names and content — use those as references for **structure, tables, diagrams, and depth**, not phrasing.

## Recommended References by Content Type

| Content type to write | Recommended reference note | What to learn from it |
| --------------------- | -------------------------- | --------------------- |
| Any new English-language note | `2-Backend/Golang/1-Go Overview and Setup.md` and siblings | English phrasing, heading style, overall voice |
| Java fundamentals (classes, objects, inheritance) | `1-Basics/9-Object-Oriented Programming Basics.md` | Concept-definition pattern, memory diagrams, comparison tables |
| Exception / error handling | `2-Advanced/4-Exceptions.md` | Inheritance tree diagrams, exception classification tables |
| Collections / Stream operations | `2-Advanced/3-Streams.md` | Traditional-vs-new comparisons, chained code examples |
| Framework overviews (Spring Boot etc.) | `3-Web Development/3-Spring Boot Basics.md` | Feature tables, ecosystem diagrams, quick start |
| Annotations / configuration | `3-Web Development/5-Web Development Basics.md` | Annotation attribute tables, derived-annotation comparisons |
| Databases / persistence layer | `3-Web Development/8-JDBC and MyBatis.md` | Framework comparison tables, SQL code examples, transaction management |
| AOP / aspects | `3-Web Development/11-AOP.md` | Concept relationship diagrams, ASCII comparison diagrams, advice types |
| Microservices / distributed systems | `3-Web Development/15.Microservices Basics.md`, `16.Advanced Microservices.md` | Architecture diagrams, component tables, config examples |
| Tooling / ops | `3-Web Development/12-Linux.md`, `13-Docker.md` | Command tables, common operations |

Java note paths above are relative to `2-Backend/Java/`.

## Full Note Directory (2-Backend)

```
2-Backend/
├── AI Agent/                        ← legacy Chinese notes
│   ├── 0-React+Java全栈AI-Agent学习大纲.md
│   ├── 1-LangChain.md
│   ├── 2-Jupyter.md
│   ├── 3-LangGraph.md
│   └── 4-Python最小智能体实战（DeepSeek+工具调用）.md
├── Golang/                          ← English notes; style reference for new notes
│   ├── 1-Go Overview and Setup.md
│   ├── 2-Basic Syntax.md
│   ├── ... (11 files, numbered by topic)
│   └── 11-Ecosystem and Popular Frameworks.md
├── Java/                            ← English notes; README.md lists every chapter
│   ├── 1-Basics/
│   │   ├── 1-Command-Line Reference.md … 12-Collection Basics.md
│   │   └── 9-Object-Oriented Programming Basics.md   ← concept intros, memory diagrams
│   ├── 2-Advanced/
│   │   ├── 1-Collection, List, and Generics.md … 11-JVM Memory and Garbage Collection.md
│   │   ├── 3-Streams.md             ← comparison pattern, chained code
│   │   └── 4-Exceptions.md          ← inheritance tree diagrams
│   └── 3-Web Development/
│       ├── 1-Maven Basics.md … 17.Elasticsearch.md
│       ├── 3-Spring Boot Basics.md  ← framework overview, ecosystem diagram
│       ├── 5-Web Development Basics.md   ← annotation tables, RESTful examples
│       ├── 8-JDBC and MyBatis.md    ← framework comparison, transactions
│       ├── 11-AOP.md                ← ASCII comparison diagrams, aspects
│       ├── 15.Microservices Basics.md    ← architecture diagrams, component tables
│       └── 16.Advanced Microservices.md
└── Python/                          ← legacy Chinese note
    └── 1-Python基础入门.md
```

Frontend and general notes live under `1-Frontend/Notes/` and `3-General/Notes/` with similar conventions.

## How to Use

1. Based on the topic to write about, find the recommended reference in the table above
2. Use the Read tool to open that note file
3. Study its phrasing patterns, table structures, and code comment style
4. Generate the new note per SKILL.md, keeping the style consistent
