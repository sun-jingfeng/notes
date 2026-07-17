# Web全栈纯英面试常用词汇与短语对照

按近几轮面试原文的真实高频内容整理，尽量覆盖你在真实面试里已经回答过的内容，优先保留雷达预警项目、父子应用架构、微服务拆分、Java 与 Spring、数据库与缓存、并发与服务保护、AI 提效与智能体落地、AI 对话系统与上下文治理、LangGraph 工作流、部署排障、自我定位、管理与 HR 场景中最常用、最适合口语表达的说法。

## 一、项目开场与职责表达

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | 最近做过的一个项目 | a recent project I worked on |
| 2 | 我主要负责…… | I was mainly responsible for ... |
| 3 | 我同时负责前端和后端 | I worked on both the front end and the back end. |
| 4 | 我参与了从设计到交付的全流程 | I was involved in the full process, from design to delivery. |
| 5 | 这个项目的核心目标是…… | The main goal of this project was ... |
| 6 | 我的主要贡献是…… | My main contribution was ... |
| 7 | 核心架构和关键模块基本是我来搭的 | I built most of the core architecture and key modules myself. |
| 8 | 如果您感兴趣，我可以展开讲这个项目 | If you are interested, I'd be happy to go into more detail. |
| 9 | 我先简单介绍一下我的定位 | Let me briefly describe how I position myself. |
| 10 | 我是前端出身，近一年做了很多全栈和 AI 落地 | I come from a front-end background, and over the past year I have taken on a lot of full-stack and AI implementation work. |
| 11 | 我更偏向于能端到端推进项目的工程师 | I see myself more as an engineer who can drive projects end to end. |
| 12 | 如果脱离简历来讲，我最突出的特点是…… | If I describe myself beyond the resume, my strongest point is ... |

**高频短语：**

- 我先介绍一个我最近做过的项目。: Let me introduce a recent project I worked on.
- 我主要负责架构设计和核心实现。: I was mainly responsible for the architecture design and the core implementation.
- 这个项目里我同时做前端和后端。: I worked on both the front end and the back end in this project.
- 我的主要贡献是整体设计和关键模块。: My main contribution was the overall design and the key modules.
- 如果先用一句话概括我的定位，我会说我是前端出身、能做全栈和 AI 工程落地的开发者。: If I summarize my positioning in one sentence, I would say I am an engineer with a front-end background who can handle full-stack delivery and AI implementation.
- 如果不按简历逐条讲，我最突出的特点是能把方案从设计推进到交付。: If I do not go through the resume line by line, my strongest point is that I can push a solution from design to delivery.

***

## 二、雷达预警项目与业务场景

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | 雷达气象预警项目 | a radar-based weather warning project |
| 2 | 预警文案生成 | warning message generation |
| 3 | 气象要素 | weather factors |
| 4 | 原始气象数据 | raw meteorological data |
| 5 | 面向气象局用户 | for meteorological bureau users |
| 6 | 内网环境 | an internal network environment |
| 7 | 多省份版本 | multi-province versions |
| 8 | 省份差异化需求 | province-specific requirements |
| 9 | 复用已有通用能力 | reuse existing shared capabilities |
| 10 | 最终交付效果 | the final delivery outcome |
| 11 | 原始数据和处理后数据 | raw data and processed data |
| 12 | 两层数据处理 | a two-layer data processing strategy |
| 13 | 一份给前端展示，一份给 AI 使用 | one version for front-end display and another for AI processing |

**高频短语：**

- 这个项目主要是给气象局相关人员使用的。: The project was mainly used by meteorological bureau staff.
- 我们会根据气象要素和处理后的数据生成预警文案。: We generated warning messages based on weather factors and processed data.
- 这个系统部署在内网环境里。: The system was deployed in an internal network environment.
- 后来这个项目扩展成了多个省份版本。: Later, the project expanded into multiple province-specific versions.
- 原始数据量比较大，所以我们做了两层数据处理。: The raw data volume was quite large, so we used a two-layer data processing strategy.
- 一份数据保留给前端展示，另一份会被精简后提供给 AI 处理。: One version of the data was kept for front-end display, and another was simplified for AI processing.

***

## 三、前端架构与性能优化

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | 父子项目架构 | a parent-child application architecture |
| 2 | iframe 集成 | iframe-based integration |
| 3 | 跨 iframe 边界通信 | cross-iframe communication |
| 4 | 旧系统复用 | legacy system reuse |
| 5 | 组件拆分 | component splitting |
| 6 | 组件复用 | component reuse |
| 7 | 权限控制 | permission control |
| 8 | 页面缓存 | page caching |
| 9 | 性能优化 | performance optimization |
| 10 | 虚拟列表 | virtual scrolling |
| 11 | Web Worker | Web Worker |
| 12 | 浅层响应式 | shallow reactivity |
| 13 | 内存占用 | memory usage |
| 14 | 长任务 | long-running tasks |
| 15 | 渲染压力 | rendering overhead |
| 16 | 统一明暗主题切换 | unified light/dark theme switching |
| 17 | 避免重排和重绘 | avoid reflow and repaint |
| 18 | GPU 友好的动画方式 | GPU-friendly animation techniques |
| 19 | PostMessage 通信 | PostMessage-based communication |
| 20 | 同源部署 | same-origin deployment |
| 21 | HTML2Canvas | HTML2Canvas |
| 22 | 通过 transform 实现拖动 | implement dragging with CSS transforms |

**高频短语：**

- 前端采用的是父子项目架构。: The front end used a parent-child application architecture.
- 我们复用了两个旧系统，并把几个新的子项目集成到一个主应用里。: We reused two existing systems and integrated several new subprojects into one host application.
- 我设计了跨 iframe 边界的通信机制。: I designed the communication mechanism across iframe boundaries.
- 我们通过页面缓存、虚拟列表和 Web Worker 做了性能优化。: We improved performance with page caching, virtual scrolling, and Web Workers.
- 我们在合适的地方用了浅层响应式，降低了渲染开销。: We reduced rendering overhead by using shallow reactivity in the right places.
- 我们还做了父子应用之间统一的明暗主题切换。: We also implemented unified light/dark theme switching across the host app and child apps.
- 动画实现上我会尽量避免触发重排和重绘。: For animations, I tried to avoid approaches that would trigger reflow and repaint.
- 在跨子系统通信上，我们主要用的是 PostMessage。: We mainly used PostMessage for communication across subsystems.
- 如果部署条件允许，同源部署会让很多边界问题更容易处理。: If deployment conditions allow it, same-origin deployment makes many boundary cases easier to handle.
- 拖动和位移动画我更倾向于用 transform，而不是直接改 top 和 left。: For dragging and movement animations, I prefer using transforms instead of directly changing top and left.

***

## 四、后端架构与微服务拆分

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | 单体架构 | monolithic architecture |
| 2 | 微服务架构 | microservice architecture |
| 3 | 服务拆分 | service decomposition |
| 4 | 抽取通用能力 | extracting shared capabilities |
| 5 | 省份独立微服务 | province-specific microservices |
| 6 | 代码复用 | code reuse |
| 7 | 解耦差异化功能 | decoupling province-specific features |
| 8 | 服务注册与发现 | service registration and discovery |
| 9 | Nacos | Nacos |
| 10 | OpenFeign | OpenFeign |
| 11 | Redis 缓存 | Redis caching |
| 12 | 缓存击穿 | cache stampede |
| 13 | 缓存穿透 | cache penetration |
| 14 | 缓存雪崩 | cache avalanche |
| 15 | 限流 | rate limiting |
| 16 | 熔断 | circuit breaking |
| 17 | 服务降级 | graceful degradation |
| 18 | 接口设计 | API design |
| 19 | 部署上线 | deployment and go-live |
| 20 | 压测 | load testing |
| 21 | 单机部署 | single-node deployment |
| 22 | 镜像打包 | image packaging |
| 23 | 按需组合部署 | compose services as needed for deployment |
| 24 | Sentinel | Sentinel |
| 25 | 消息队列 | message queue |
| 26 | 服务降级兜底 | degraded fallback response |

**高频短语：**

- 这个系统最开始是单体架构。: The system was originally built as a monolithic application.
- 后来我们把它重构成了微服务架构。: Later, we refactored it into a microservice architecture.
- 我们把通用能力抽成了公共服务。: We extracted shared capabilities into common services.
- 每个省份都有自己的微服务来承载差异化需求。: Each province had its own microservice for customized requirements.
- 我们用 Nacos 做服务注册，用 OpenFeign 做服务间调用。: We used Nacos for service registration and OpenFeign for service-to-service calls.
- 我们使用 Redis 来减轻数据库压力并提升响应速度。: Redis was used to reduce database pressure and improve response time.
- 每个服务都会单独打包成镜像，部署时按省份需要去组合。: Each service was packaged as its own image, and we composed the required services based on each province's needs.
- 这样做之后，部署和扩展都会更清晰。: That made both deployment and scaling much clearer.
- 在高并发或依赖不稳定的场景下，我们也会配合 Sentinel 做限流和熔断。: In scenarios with high concurrency or unstable dependencies, we also used Sentinel for rate limiting and circuit breaking.
- 非核心链路上的异步任务，我会考虑放到消息队列里处理。: For non-critical asynchronous tasks, I would consider handling them through a message queue.

***

## 五、AI 提效与智能体落地

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | AI 提效 | AI-assisted development |
| 2 | 用 AI 提高编码效率 | improve coding efficiency with AI |
| 3 | 智能体落地 | bringing AI agents into production |
| 4 | 智能体微服务 | an AI agent microservice |
| 5 | 提示词持久化 | prompt persistence |
| 6 | 项目规则文件 | project rule files |
| 7 | 任务技能模板 | task-specific skill templates |
| 8 | 上下文复用 | context reuse |
| 9 | 工具调用 | tool calling |
| 10 | 外部工具接入 | external tool integration |
| 11 | MCP | Model Context Protocol (MCP) |
| 12 | Figma 接入 | Figma integration |
| 13 | 本地部署模型 | a locally deployed model |
| 14 | Python 智能体服务 | a Python-based AI service |
| 15 | LangChain | LangChain |
| 16 | LangGraph | LangGraph |
| 17 | 结果解析 | result parsing |
| 18 | 准确度 | accuracy |
| 19 | 沟通成本 | communication overhead |
| 20 | 代码风格对齐 | code style alignment |
| 21 | AI 对话系统 | an AI conversation system |
| 22 | 本地模型推理服务 | a local model inference service |
| 23 | 提示词编排 | prompt orchestration |
| 24 | 流式输出 | streaming output |
| 25 | 规则约束 | rule-based constraints |
| 26 | 护栏机制 | guardrails |
| 27 | 垂直领域模型路由 | domain-specific model routing |
| 28 | 工具绑定 | tool binding |
| 29 | FastAPI | FastAPI |
| 30 | 模型 SDK | model SDK |
| 31 | HTTP 服务层 | an HTTP service layer |
| 32 | 一次性返回 | one-shot response |
| 33 | 路由节点 | routing node |
| 34 | 工具节点 | tool node |
| 35 | 结构化输出节点 | structured output node |

**高频短语：**

- 我会在日常编码里用 AI 提高开发效率。: I used AI to improve development efficiency in daily coding work.
- 我们持续完善规则文件和技能模板，让不同任务可以复用同一套上下文。: We kept refining rule files and skill templates so the same context could be reused across tasks.
- 这个智能体是以独立的 Python 微服务形式落地的。: The agent was implemented as an independent Python microservice.
- 我们选择 Python，是因为当时它的 AI 生态更成熟。: We chose Python because its AI ecosystem was more mature at that time.
- MCP 是 AI 连接外部工具和项目上下文的一种标准方式。: MCP is a standard way for AI to connect to external tools and project context.
- 经过足够多轮迭代之后，AI 生成的代码就越来越接近我们的预期风格。: After enough iteration, the AI-generated code became much closer to our expected style.
- 我做过一个接入本地部署模型的 AI 对话系统。: I worked on an AI conversation system connected to a locally deployed model.
- 我主要负责的是模型能力在业务里的接入和工程化落地。: I was mainly responsible for integrating model capabilities into business workflows and making them production-ready.
- LangChain 在这个项目里主要负责提示词编排、上下文组织和工具调用。: In this project, LangChain was mainly used for prompt orchestration, context organization, and tool calling.
- 有些场景我们会按任务类型做模型路由和工具绑定。: In some scenarios, we routed requests by task type and bound them to different tools.
- 我们会通过规则约束和固定输出格式来降低 AI 跑偏的概率。: We used rule-based constraints and fixed output formats to reduce the chance of the AI going off track.
- 我们在 Python 侧用 FastAPI 把模型能力封装成了统一的 HTTP 服务。: On the Python side, we used FastAPI to wrap the model capability into a unified HTTP service.
- 底层模型是通过模型 SDK 接入的，上层再做工作流编排。: The underlying model was integrated through a model SDK, and the upper layer handled workflow orchestration.
- 有些接口是流式输出，有些则是一次性返回，取决于具体场景。: Some endpoints used streaming output, while others returned the full result at once, depending on the scenario.

***

## 六、AI 对话系统、上下文与 RAG

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | 会话管理 | conversation management |
| 2 | session ID 持久化 | session ID persistence |
| 3 | 会话续聊 | conversation continuation |
| 4 | 上下文管理 | context management |
| 5 | 长上下文压缩 | long-context compression |
| 6 | 结构化关键信息 | structured key facts |
| 7 | 摘要策略 | summarization strategy |
| 8 | 流式响应 | streaming response |
| 9 | 批量返回 | batch response |
| 10 | 知识库 | knowledge base |
| 11 | RAG | retrieval-augmented generation (RAG) |
| 12 | 检索器 | retriever |
| 13 | 召回结果 | retrieved results |
| 14 | 幻觉控制 | hallucination control |
| 15 | 准确率评估 | accuracy evaluation |
| 16 | Redis 持久化 | Redis-based persistence |
| 17 | TTL 过期策略 | TTL-based expiration |
| 18 | 分层摘要 | layered summarization |
| 19 | 阈值压缩 | threshold-based compression |
| 20 | 保留最近几轮对话 | keep the most recent conversation turns |
| 21 | 系统消息 | system messages |
| 22 | 工具消息 | tool messages |

**高频短语：**

- 我们用 session ID 来持久化会话，并支持应用重启后的续聊。: We used session IDs to persist conversations and support continuation after application restarts.
- 上下文管理的重点不是存历史，而是每一轮到底喂什么给模型。: The key to context management is not just storing history, but deciding what exactly should be sent to the model at each turn.
- 如果上下文太长，我不会直接硬截断，而是做分层摘要和关键信息提取。: If the context becomes too long, I do not simply cut it off. I use layered summarization and key-fact extraction.
- 最近几轮我会保留原文，较早内容会压成摘要。: I keep the most recent turns in full text and compress older content into summaries.
- 这个系统支持流式响应，前端会按流式结果逐步展示。: The system supports streaming responses, and the front end renders the output incrementally.
- 如果是知识密集型问题，我会结合知识库和 RAG 去提高回答的可靠性。: For knowledge-intensive questions, I combine a knowledge base with RAG to improve answer reliability.
- 我们也会关注准确率、追问率和人工纠错率这些指标。: We also pay attention to metrics such as accuracy, follow-up rate, and manual correction rate.
- 我们会设一个阈值，超过之后再触发上下文压缩。: We set a threshold and only trigger context compression after it is exceeded.
- 压缩时我通常会保留最近几轮对话，并把更早的内容提炼成摘要。: During compression, I usually keep the most recent turns and summarize the older context.
- system message 和 tool message 这类强约束内容，我通常会原样保留。: I usually preserve strong-constraint content like system messages and tool messages as-is.

***

## 七、技术难点与解决方案表达

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | 最大的挑战是…… | The biggest challenge was ... |
| 2 | 核心问题是…… | The core problem was ... |
| 3 | 为了解决这个问题，我…… | To solve this problem, I ... |
| 4 | 我当时重点考虑的是…… | What I focused on most was ... |
| 5 | 技术选型 | technology selection |
| 6 | 方案权衡 | trade-off analysis |
| 7 | 最终我们选择了…… | In the end, we chose ... |
| 8 | 这样选的原因是…… | The reason we chose this approach was that ... |
| 9 | 提高稳定性 | improve stability |
| 10 | 提高可维护性 | improve maintainability |
| 11 | 提高复用率 | improve reusability |
| 12 | 降低沟通成本 | reduce communication overhead |
| 13 | 减少理解偏差 | reduce misunderstandings |
| 14 | 最终效果符合预期 | the final result met expectations |
| 15 | 风险控制 | risk control |
| 16 | 固定输出格式 | fixed output formatting |
| 17 | 先做小范围验证 | start with small-scope validation |

**高频短语：**

- 最大的挑战是如何平衡代码复用和省份差异化需求。: The biggest challenge was how to balance code reuse and province-specific customization.
- 为了解决这个问题，我们把通用逻辑和定制逻辑拆开了。: To solve this problem, we split the shared logic from the customized logic.
- 最终我们选择这个方案，是因为它更容易维护，也更容易扩展。: In the end, we chose this solution because it was easier to maintain and scale.
- 这样做提升了稳定性，也降低了沟通开销。: This helped us improve stability and reduce communication overhead.
- 面对不确定性比较高的场景，我会先做小范围验证，再决定是否推广。: In scenarios with higher uncertainty, I start with small-scope validation before scaling the solution.
- 对 AI 相关功能，我会通过规则约束和固定输出格式做风险控制。: For AI-related features, I use rule-based constraints and fixed output formats for risk control.

***

## 八、排障、部署与风险控制表达

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | 线上排障 | production troubleshooting |
| 2 | 查看日志 | inspect the logs |
| 3 | 定位问题链路 | trace the request path |
| 4 | 网关日志 | gateway logs |
| 5 | 容器日志 | container logs |
| 6 | 某个服务或方法出了问题 | a specific service or method was failing |
| 7 | 回滚机制 | rollback mechanism |
| 8 | 权限边界 | permission boundaries |
| 9 | 操作审计 | operation auditing |
| 10 | 人工审批 | manual approval |
| 11 | 先在测试环境验证 | validate in the test environment first |
| 12 | 生产环境不能无约束执行 | production actions should not run without constraints |
| 13 | 一键部署 | one-click deployment |
| 14 | Docker 部署 | Docker-based deployment |
| 15 | Nginx 部署 | Nginx-based deployment |
| 16 | 配置文件 | configuration files |

**高频短语：**

- 如果线上出了问题，我通常会从日志和请求链路开始排查。: If something goes wrong in production, I usually start with the logs and the request path.
- 我会先看容器日志，再看网关日志，然后继续往具体服务里定位。: I first check the container logs, then the gateway logs, and then trace the issue down to the specific service.
- 如果 AI 参与部署流程，我不会让它无约束地直接操作生产环境。: If AI is involved in the deployment workflow, I would not let it operate directly on production without constraints.
- 我更倾向于让 AI 负责分析、生成、校验和编排，而不是直接执行高风险操作。: I prefer to let AI handle analysis, generation, validation, and orchestration rather than directly execute high-risk operations.
- 正式发布之前，我会要求测试环境验证、人工审批、日志审计和失败回滚机制。: Before production release, I require test-environment validation, manual approval, audit logs, and a rollback mechanism.
- 部署层面我也做过 Docker 和 Nginx 相关的配置与交付。: On the deployment side, I have also handled Docker- and Nginx-related configuration and delivery.
- 如果要做一键部署，除了前后端包本身，还要把配置文件和依赖关系一起梳理清楚。: If we want one-click deployment, we need to organize not only the front-end and back-end packages, but also the configuration files and service dependencies.

***

## 九、管理、产出与协作表达

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | 项目负责人 | project lead |
| 2 | 技术组长 | technical lead |
| 3 | 6 人团队 | a six-member team |
| 4 | 任务分配 | task allocation |
| 5 | 根据成员特点分工 | assign tasks based on each person’s strengths |
| 6 | 核心模块由我负责 | I was responsible for the core modules. |
| 7 | 我也承担了较高比例的产出 | I also delivered a significant share of the output. |
| 8 | 推动项目进展 | keep the project moving forward |
| 9 | 跨角色协作 | cross-functional collaboration |
| 10 | 全栈端到端交付能力 | end-to-end full-stack delivery capability |

**高频短语：**

- 这些项目里有几个我是项目负责人。: I was the project lead for several of these projects.
- 我会根据每个成员的特点和经验分配任务。: I assigned tasks based on each team member’s strengths and experience.
- 我自己也会深度参与实现，尤其是核心模块。: I was still deeply involved in implementation, especially in the core modules.
- 我可以从架构设计一直推进到最终交付。: I could drive a project forward from architecture design to final delivery.
- 分工时我会同时考虑成员特点、任务耦合度和沟通成本。: When allocating tasks, I consider team-member strengths, task coupling, and communication cost at the same time.

***

## 十、自我定位与成长表达

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | 前端出身 | a front-end background |
| 2 | 向全栈转型 | transition into full-stack development |
| 3 | AI 工程化落地 | AI implementation |
| 4 | 端到端交付 | end-to-end delivery |
| 5 | 自驱学习 | self-directed learning |
| 6 | 边学边做 | learn while shipping |
| 7 | 快速补齐短板 | ramp up quickly in weaker areas |
| 8 | 更适合做通用型工程师 | better suited to be a generalist engineer |
| 9 | 不是只停留在单一端 | not limited to only one side of development |
| 10 | 我更看重长期成长空间 | I care more about long-term growth potential |

**高频短语：**

- 我是前端出身，但最近一年已经承担了很多全栈和 AI 落地相关的工作。: I come from a front-end background, but over the past year I have taken on a lot of full-stack and AI implementation work.
- 我比较适合做那种能从前端、后端到 AI 一起推进的通用型工程师。: I am better suited to being a generalist engineer who can move work forward across the front end, back end, and AI layers.
- 这段经历对我来说更像是边学边做、边做边沉淀。: For me, this experience was very much a process of learning while shipping and refining along the way.
- 我不是只想停留在某一个技术栈里，我更希望具备端到端交付能力。: I do not want to stay limited to a single stack. I want to build strong end-to-end delivery capability.

***

## 十一、HR 场景常用表达

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | 离职原因 | reason for leaving |
| 2 | 业务线解散 | the business line was dissolved |
| 3 | 甲方不再合作 | the client decided not to continue the partnership |
| 4 | 调岗机会 | an internal transfer opportunity |
| 5 | 我没有选择调岗 | I decided not to take the transfer. |
| 6 | 希望寻找更合适的机会 | I wanted to look for a better fit. |
| 7 | 薪资期望 | salary expectations |
| 8 | 年终奖 | year-end bonus |
| 9 | 工作强度 | workload |
| 10 | 加班频率 | overtime frequency |
| 11 | 大小周 | an alternating five-and-six-day work schedule |
| 12 | 稳定性 | job stability |
| 13 | 职业发展 | career development |
| 14 | 全栈发展方向 | a full-stack career direction |
| 15 | AI 相关成长空间 | AI-related growth opportunities |

**高频短语：**

- 我离职的主要原因是业务线解散了。: The main reason for leaving was that the business line was dissolved.
- 公司当时给了我调岗机会，但我最后没有选择接受。: The company offered me an internal transfer opportunity, but I decided not to take it.
- 我想找一个更适合我长期发展的岗位。: I wanted to look for a role that was a better fit for my long-term development.
- 我的薪资期望会结合整体包和岗位范围来评估。: My salary expectations depend on the overall package and the scope of the role.
- 我会优先考虑岗位的发展空间、业务方向和团队稳定性。: I prioritize the role's growth potential, business direction, and team stability.

***

## 十二、Java 与 Spring 常用表达

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | Spring Boot 自动配置 | Spring Boot auto-configuration |
| 2 | 依赖注入 | dependency injection |
| 3 | 构造器注入 | constructor injection |
| 4 | Bean 生命周期 | bean lifecycle |
| 5 | 单例 Bean | a singleton-scoped bean |
| 6 | 原型 Bean | a prototype-scoped bean |
| 7 | 请求作用域 Bean | a request-scoped bean |
| 8 | AOP 切面编程 | aspect-oriented programming (AOP) |
| 9 | 请求拦截器 | request interceptor |
| 10 | controller、service、mapper 三层结构 | a three-layer controller-service-mapper architecture |
| 11 | MyBatis | MyBatis |
| 12 | MyBatis-Plus | MyBatis-Plus |
| 13 | 记录接口参数和执行时间 | log request parameters and execution time |

**高频短语：**

- 后端这边我主要是基于 Spring Boot 去做服务开发。: On the back-end side, I mainly built services with Spring Boot.
- 大部分服务我会用单例 Bean，通过依赖注入去组织它们之间的关系。: For most services, I use singleton beans and organize their relationships through dependency injection.
- 如果更强调明确依赖关系，我会优先用构造器注入。: If I want the dependencies to be more explicit, I prefer constructor injection.
- AOP 在项目里主要用来记录接口参数、执行时间和关键日志。: In the project, AOP was mainly used to record request parameters, execution time, and key logs.
- 整体结构上，我还是按 controller、service、mapper 这三层去拆。: Structurally, I still split the back end into controller, service, and mapper layers.

***

## 十三、数据库、缓存与并发表达

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | 数据库表结构设计 | database schema design |
| 2 | 事务隔离级别 | transaction isolation level |
| 3 | 分布式事务 | distributed transactions |
| 4 | 索引优化 | index optimization |
| 5 | 最左前缀原则 | the leftmost prefix rule |
| 6 | 模糊查询 | wildcard queries |
| 7 | 线程池 | thread pool |
| 8 | 消息队列异步处理 | asynchronous processing through a message queue |
| 9 | 高并发场景 | high-concurrency scenarios |
| 10 | 压测 | load testing |
| 11 | 性能瓶颈 | performance bottleneck |
| 12 | tens of gigabytes 的数据量 | tens of gigabytes of data |
| 13 | Redis 缓存 | Redis caching |
| 14 | 缓存穿透 | cache penetration |
| 15 | 缓存击穿 | cache stampede |
| 16 | 缓存雪崩 | cache avalanche |

**高频短语：**

- 如果查询比较频繁，我会先看索引设计是不是合理。: If a query is executed frequently, I first check whether the index design is reasonable.
- 组合索引的设计，我会考虑最左前缀原则。: When designing composite indexes, I take the leftmost prefix rule into account.
- 对于数据量比较大的场景，我们也做过 Redis 缓存来降低数据库压力。: In scenarios with larger data volumes, we also used Redis caching to reduce database pressure.
- 如果有非核心的耗时任务，我会更倾向于用消息队列做异步处理。: If there are non-critical but time-consuming tasks, I prefer to handle them asynchronously through a message queue.
- 压测之后，我会重点看性能瓶颈到底出现在查询、计算还是服务调用上。: After load testing, I focus on whether the bottleneck is in querying, computation, or service-to-service calls.
- 有些数据场景的数据量能到几十个 GB，所以数据加载和处理方式必须仔细设计。: In some scenarios, the data volume can reach tens of gigabytes, so data loading and processing must be designed carefully.

***

## 十四、Agent 工作流与 LangGraph 表达

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | LangGraph 节点编排 | LangGraph node orchestration |
| 2 | 图节点 | graph nodes |
| 3 | 路由节点 | routing node |
| 4 | 数据解析节点 | data-parsing node |
| 5 | 工具节点 | tool node |
| 6 | 坐标转地名工具 | a tool for converting coordinates into location names |
| 7 | 关键词路由 | keyword-based routing |
| 8 | 正则匹配 | regex matching |
| 9 | 多模型路由 | multi-model routing |
| 10 | 结构化输出 | structured output |
| 11 | 标题、地点、正文 | title, location, and body text |
| 12 | 不同任务走不同分支 | route different tasks through different branches |

**高频短语：**

- 如果工作流比较复杂，我会更倾向于用 LangGraph 来组织节点和状态流。: If the workflow is more complex, I prefer using LangGraph to organize nodes and state transitions.
- 路由节点会先判断任务类型，再决定后面走哪条分支。: The routing node first identifies the task type and then decides which branch the workflow should follow.
- 有些工具节点负责做模型不擅长但规则很明确的事情，比如坐标转地名。: Some tool nodes handle tasks that models are not good at but are rule-based, such as converting coordinates into location names.
- 最后的输出节点会把结果整理成结构化格式，比如标题、地点和正文。: The final output node organizes the result into a structured format such as title, location, and body text.
- 如果场景差异比较大，我们也可以做多模型路由，而不是让一个模型处理所有任务。: If the scenarios differ significantly, we can also use multi-model routing instead of forcing one model to handle every task.

***

## 十五、技术选型与系统设计表达

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | 技术选型 | technology selection |
| 2 | 方案权衡 | trade-off analysis |
| 3 | 平衡代码复用和定制化需求 | balance code reuse with customized requirements |
| 4 | 本地化部署 | on-premises deployment |
| 5 | 不能访问外网 | cannot access external networks |
| 6 | 自建模型服务 | a self-hosted model service |
| 7 | 用户体验容忍度 | user tolerance for latency |
| 8 | 短期交付效率 | short-term delivery efficiency |
| 9 | 长期可维护性 | long-term maintainability |
| 10 | 兜底方案 | fallback strategy |
| 11 | 定制化需求 | customized requirements |
| 12 | 共性功能 | shared functionality |

**高频短语：**

- 做技术选型时，我通常会同时看短期交付效率和长期可维护性。: When making technology decisions, I usually consider both short-term delivery efficiency and long-term maintainability.
- 这个场景之所以选本地化部署，是因为客户环境不能访问外网。: We chose on-premises deployment in this scenario because the client environment could not access external networks.
- 真正的难点不是功能能不能做出来，而是怎么平衡共性功能和定制化需求。: The real challenge was not whether the feature could be built, but how to balance shared functionality with customized requirements.
- 如果某个方案风险比较高，我会提前准备一个兜底方案。: If a solution carries higher risk, I prepare a fallback strategy in advance.

***

## 十六、面试里最常用的整句表达

| 优先级 | 中文 | 英文 |
| --- | --- | --- |
| 1 | 这个项目最开始是单体，后来拆成了微服务。 | The system was originally built as a monolithic application and was later refactored into a microservice architecture. |
| 2 | 前端是父子项目结构，后端是按省份拆分的微服务。 | The front end used a parent-child application architecture, and the back end was split into province-specific microservices. |
| 3 | 这样做主要是为了兼顾代码复用和差异化需求。 | We did that to balance code reuse with customized requirements. |
| 4 | 这个功能的前后端基本都是我来完成的。 | I handled most of the front-end and back-end work for this feature. |
| 5 | 我们后来把 AI 能力以独立微服务的形式接进来了。 | Later, we implemented the agent as an independent Python microservice and integrated it into the existing Java microservice system. |
| 6 | 我会先用 AI 提高效率，但一定会逐行确认生成代码的质量。 | I use AI to improve efficiency first, but I still review the generated code carefully line by line. |
| 7 | 我们持续沉淀规则文件和技能模板，让后续任务复用同一套上下文。 | We kept refining rule files and skill templates so the same context could be reused across tasks. |
| 8 | 这个方案最终达到了稳定、可维护、可扩展的效果。 | This solution eventually gave us better stability, maintainability, and scalability. |
| 9 | 如果您想听具体实现，我可以从架构、性能优化或 AI 落地三个角度展开。 | If you'd like, I can explain it from the architecture, performance, or AI-implementation angle. |
| 10 | 我负责的不是底层模型训练，而是模型能力在业务中的接入和工程化落地。 | I was not responsible for training the underlying model. I was responsible for integrating the model capability into the business and production workflow. |
| 11 | 这个系统支持流式响应，我们也做了会话持久化和上下文压缩。 | The system supports streaming responses, and we also implemented conversation persistence and context compression. |
| 12 | 如果是知识密集型场景，我会结合知识库和 RAG 来提高回答质量。 | For knowledge-intensive scenarios, I would combine a knowledge base with RAG to improve answer quality. |
| 13 | 如果 AI 参与部署流程，我会把它限制在分析、生成、校验和编排这些环节。 | If AI participates in the deployment workflow, I keep it limited to analysis, generation, validation, and orchestration. |
| 14 | 我通常会先看日志和请求链路，再逐步把问题定位到具体服务。 | I usually start with the logs and the request path, and then narrow the issue down to a specific service. |
| 15 | 如果用一句话概括，我是前端出身、但已经能做全栈和 AI 工程落地的开发者。 | If I summarize myself in one sentence, I am an engineer with a front-end background who can now handle full-stack delivery and AI implementation. |
| 16 | 后端主要基于 Spring Boot，我会按 controller、service、mapper 三层去组织服务。 | The back end was mainly built with Spring Boot, and I organized the services using a controller-service-mapper three-layer structure. |
| 17 | 对于频繁查询的场景，我会先看索引设计、缓存策略和真实瓶颈在哪里。 | For frequently queried scenarios, I first look at index design, caching strategy, and where the real bottleneck is. |
| 18 | 如果工作流比较复杂，我会用 LangGraph 去拆节点、做路由和组织状态流。 | If the workflow is more complex, I use LangGraph to split it into nodes, handle routing, and organize the state flow. |
| 19 | 做技术选型时，我更关注的是约束条件、交付效率和长期维护成本。 | When making technical decisions, I focus more on the constraints, delivery efficiency, and long-term maintenance cost. |