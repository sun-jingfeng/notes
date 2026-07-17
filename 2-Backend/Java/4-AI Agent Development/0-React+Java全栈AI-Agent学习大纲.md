# React + Java 全栈 AI Agent 学习大纲

> 目标：用 React 前端 + Java（Spring Boot / Spring AI）后端开发可落地的 AI Agent 应用。对应博学谷大纲阶段二、四、五；每个步骤写明「学什么」与「从哪学」。

***

## 一、阶段二：Agent 能力基础（概念与实战）

### 1.1 Model I/O 与提示词

| 项目 | 内容 |
|------|------|
| **学什么** | ChatModel / LLM 区别；同步与流式调用；PromptTemplate（角色、任务、格式、Few-shot）；Output Parser（文本 → JSON/POJO）；与后端接口的约定。 |
| **从哪学** | 本目录 `1-LangChain.md` 第二、三章（Model I/O、LCEL）；极客时间《LangChain 实战课》前几讲（模型 I/O、提示工程）；Spring AI 文档 [Getting Started](https://docs.spring.io/spring-ai/reference/getting-started.html)、[ChatClient](https://docs.spring.io/spring-ai/reference/api/chatclient.html)。 |

***

### 1.2 链、记忆与 RAG

| 项目 | 内容 |
|------|------|
| **学什么** | Chains（顺序链、路由链、LCEL 编排）；Memory（对话缓冲、摘要记忆、多轮上下文）；RAG 四步：文档加载、分块、向量化与存储、检索与注入；Top-K 与相似度阈值。 |
| **从哪学** | `1-LangChain.md` 第三、四章（LCEL、RAG）；极客时间《LangChain 实战课》链、记忆、RAG 相关讲；Spring AI 文档 [RAG](https://docs.spring.io/spring-ai/reference/api/chatclient.html#_retrieval_augmented_generation)、[Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs.html)、[ETL](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html)；LangChain4j 文档 [RAG](https://docs.langchain4j.dev)、中文站 [docs.langchain4j.info](https://docs.langchain4j.info)。 |

***

### 1.3 Agent 与工具调用

| 项目 | 内容 |
|------|------|
| **学什么** | Agent 概念（ReAct、Function Calling）；Tool 定义（描述、参数 Schema、执行与错误处理）；多步推理循环：观察 → 思考 → 行动 → 结束；在 Java 侧的等价实现思路。 |
| **从哪学** | `1-LangChain.md` Agent、Tools 相关章节；极客时间《LangChain 实战课》Agent、工具调用讲；Spring AI 文档 [Tools / Function Calling](https://docs.spring.io/spring-ai/reference/api/tools.html)；LangChain4j 文档 Tool、Agent 部分；阿里云/CSDN 文章「LangChain4j + Spring AI 实现 RAG、Agent」（搜索关键词：LangChain4j Spring AI RAG）。 |

***

### 1.4 阶段二自检与产出

| 项目 | 内容 |
|------|------|
| **自检** | 能口述/画图：RAG 四步与 Agent 循环；至少一个 RAG 小 demo（Python 或 Java）；至少一个带 Tool 的 Agent 小 demo。 |
| **从哪练** | 博学谷大纲阶段二配套项目（物流智能问答、简历推荐）可作选题；或自建「知识库问答 + 1～2 个工具」的迷你项目。 |

***

## 二、阶段四：Spring AI 与 Java 全栈落地

### 2.1 Spring AI 入门

| 项目 | 内容 |
|------|------|
| **学什么** | 依赖（`spring-ai-bom`、Chat/Embedding 相关 starter）；`application.yml` 配置（API Key、Base URL、模型名）；ChatClient 同步与流式调用；Prompt 与结构化输出（POJO）；Controller 暴露 REST/SSE 接口。 |
| **从哪学** | Spring AI 官方文档 [Introduction](https://docs.spring.io/spring-ai/reference/)、[Getting Started](https://docs.spring.io/spring-ai/reference/getting-started.html)、[ChatClient](https://docs.spring.io/spring-ai/reference/api/chatclient.html)、[Structured Output](https://docs.spring.io/spring-ai/reference/api/structured-output-converter.html)；Spring 官方示例仓库（GitHub 搜 `spring-projects/spring-ai` 或 `spring-ai-examples`）。 |

***

### 2.2 RAG 与向量库（Java 侧）

| 项目 | 内容 |
|------|------|
| **学什么** | 文档 ETL（加载、分块、向量化、写入）；Spring AI 向量库抽象与具体实现（如 Redis、PgVector、Milvus）；检索 API 与构造带上下文的 Prompt；ChatClient 调用 RAG 流程；与阶段二概念的对应关系。 |
| **从哪学** | Spring AI 文档 [Vector Stores](https://docs.spring.io/spring-ai/reference/api/vectordbs.html)、[ETL Pipeline](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html)、[RAG](https://docs.spring.io/spring-ai/reference/api/chatclient.html#_retrieval_augmented_generation)；LangChain4j 文档 RAG、EmbeddingStore 部分；阿里云文章「基于 Java 的 AI 智能体：LangChain4j 与 Spring AI 实现 RAG」。 |

***

### 2.3 工具调用与 Agent（Java 侧）

| 项目 | 内容 |
|------|------|
| **学什么** | Spring AI 的 Tool/Function Calling 定义与注册；在 Java 中实现工具方法（参数、返回值、异常）；单 Agent 调用多工具；与多 Agent 路由的衔接（为阶段五铺垫）；鉴权与输入校验。 |
| **从哪学** | Spring AI 文档 [Tools](https://docs.spring.io/spring-ai/reference/api/tools.html)；LangChain4j 文档 Tool、@Tool、Agent 部分；编程导航《LangChain4j + 工作流 + 微服务》若可获取；CSDN/火山引擎「LangChain4j 打造 Java 智能应用」类教程。 |

***

### 2.4 React 前端对接

| 项目 | 内容 |
|------|------|
| **学什么** | 与后端的接口约定（REST 路径、请求体如消息列表、流式 SSE 格式）；前端状态管理（消息列表、加载中、错误）；流式逐字展示（EventSource 或 fetch + ReadableStream）；跨域、鉴权（若需要）。 |
| **从哪学** | React 官方文档（状态、Hooks）；MDN Fetch/EventSource；任意「React + 流式聊天」示例（掘金/Stack Overflow）；可参考「Python + LangChain + Vue3 全栈 LLM 聊天应用」文章，把 Vue 换成 React 实现。 |

***

### 2.5 阶段四自检与产出

| 项目 | 内容 |
|------|------|
| **自检** | Spring Boot + Spring AI 提供对话、RAG、工具调用至少两类接口；React 至少一个页面完成对话或 RAG 问答并支持流式；能说明多智能体在阶段五的位置。 |
| **从哪练** | 博学谷大纲阶段四配套项目（AI 天机助手、Dify 融合）可作选题；或自建「React + Spring AI」对话/RAG 小项目。 |

***

## 三、阶段五：多智能体与服务化

### 3.1 多智能体架构

| 项目 | 内容 |
|------|------|
| **学什么** | 路由 Agent：按用户意图分发到不同专业 Agent（如客服/推荐/写作）；协调器：任务拆分、结果汇总；在 Java 中用 Spring Bean、策略模式或显式路由实现多 Agent 编排；与单 Agent 多工具的区别。 |
| **从哪学** | Spring AI 文档中与 Advisors、多模型/多流程相关的部分；博学谷大纲阶段四、五对「多智能体（路由/协调器）」的讲解（若已购课）；网上文章搜索「Spring AI 多 Agent」「多智能体 路由 协调器」；LangChain4j 多 Agent 示例（若有）。 |

***

### 3.2 Java 与 Python 分工（可选）

| 项目 | 内容 |
|------|------|
| **学什么** | 职责划分：Java 做业务、事务、企业集成；Python 做重推理或实验性 Agent 时的可选方案；HTTP/gRPC 调用方式；「React → Java →（可选）Python」架构图与职责边界。 |
| **从哪学** | 博学谷大纲阶段五「Java & Python 挑战」；Spring Boot 调用外部 HTTP/gRPC 的文档（RestTemplate、WebClient、OpenFeign）；自建一个小 demo：Java 调 Python 或 Python 调 Java。 |

***

### 3.3 MCP / A2A 与协议（可选）

| 项目 | 内容 |
|------|------|
| **学什么** | MCP（Model Context Protocol）目标与工具/资源抽象；A2A（Agent-to-Agent）典型消息格式；Java 如何暴露 HTTP 工具接口供 MCP 客户端或 Python Agent 调用。 |
| **从哪学** | MCP 官方说明（搜索「Model Context Protocol」）；A2A 规范（搜索「A2A protocol」）；博学谷大纲阶段五 MCP/A2A 部分；Spring Boot 提供 REST API 作为「工具端点」的常规写法。 |

***

### 3.4 服务治理（Nacos）

| 项目 | 内容 |
|------|------|
| **学什么** | Nacos 服务注册与发现；Spring Cloud 与 Nacos 集成；AI 服务作为普通微服务注册；配置中心（模型地址、API Key 等外置、多环境）。 |
| **从哪学** | Nacos 官方文档（[nacos.io](https://nacos.io)）；Spring Cloud Alibaba 文档（Nacos 注册发现、配置中心）；任意「Spring Boot + Nacos」入门教程。 |

***

### 3.5 阶段五自检与产出

| 项目 | 内容 |
|------|------|
| **自检** | 多 Agent 路由或协调器有一个可运行示例；能说明 Java 与 Python（若采用）的边界与调用方式；Nacos 下至少一个 AI 服务完成注册与发现；可选：了解 MCP/A2A 与 Java 的集成点。 |
| **从哪练** | 博学谷大纲阶段五实战（浏览器控制/IP 查询/Redis、AI 课程服务 Spring AI 发布+调用）；或自建「多 Agent + Nacos 注册」的迷你服务。 |

***

## 四、整体节奏与资料汇总

| 阶段 | 建议时长 | 学什么（概要） | 从哪学（汇总） |
|------|----------|----------------|----------------|
| **二** | 2～3 周 | Model I/O、链、记忆、RAG、Agent、工具 | 本目录 `1-LangChain.md`；极客时间《LangChain 实战课》；Spring AI / LangChain4j 官方文档；阿里云/CSDN LangChain4j+Spring AI 文章 |
| **四** | 2～3 周 | Spring AI 入门、RAG、Tool、React 对接 | Spring AI 官方文档与示例；LangChain4j 文档；React 文档与流式聊天示例 |
| **五** | 1～2 周 | 多智能体、Java&Python、MCP/A2A、Nacos | Spring AI 多 Agent 相关文档；博学谷阶段五（若已购）；Nacos/Spring Cloud Alibaba 文档 |

学习顺序：二（概念与能力）→ 四（React+Java 全栈落地）→ 五（多 Agent + 服务化）。每阶段收尾用自检与一个小项目巩固。
