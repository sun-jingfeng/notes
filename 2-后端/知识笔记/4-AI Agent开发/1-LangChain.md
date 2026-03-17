## 一、LangChain 概述

### 1.1 什么是 LangChain

**LangChain** 是一个用于构建大语言模型（LLM）应用的开源框架，提供标准化接口将 LLM 与外部数据源、工具和执行逻辑连接起来。

**核心思想：** 将 LLM 的能力与外部世界（数据库、API、工具）结合，构建能够推理、记忆、执行多步任务的智能应用。

| 特点             | 说明                                                     |
| ---------------- | -------------------------------------------------------- |
| **模型无关**     | 支持 OpenAI、Anthropic、本地模型等多种 LLM               |
| **链式组合**     | 将 Prompt、LLM、解析器等组件串联成可复用的处理链         |
| **工具集成**     | 内置搜索、数据库、代码执行等工具，支持自定义             |
| **记忆管理**     | 提供多种对话历史存储方案，支持长对话场景                 |
| **Agent 支持**   | 让 LLM 自主决策调用哪些工具完成任务                      |

### 1.2 核心模块

```text
┌─────────────────────────────────────────────────────────────┐
│                      LangChain 核心模块                      │
├─────────────────────────────────────────────────────────────┤
│  Model I/O:   LLM / ChatModel / Embeddings / PromptTemplate │
│  Chains:      LLMChain / SequentialChain / RouterChain       │
│  Memory:      ConversationBufferMemory / SummaryMemory       │
│  Retrieval:   VectorStore / Retriever / DocumentLoader       │
│  Agents:      ReAct / OpenAI Functions / Tool Calling        │
│  Callbacks:   日志、追踪、流式输出                           │
└─────────────────────────────────────────────────────────────┘
```

LangChain 更像一层**应用编排框架**：上接模型能力，下接检索、工具、存储与可观测性，把这些组件用统一接口串起来。

### 1.3 LangChain、LangGraph、原生 SDK 的关系

| 方案                 | 定位                                             | 适用场景 |
| -------------------- | ------------------------------------------------ | -------- |
| **原生模型 SDK**     | 直接调用模型厂商 API，依赖少、链路短             | 单轮问答、简单补全、最小可用 Demo |
| **LangChain**        | Prompt、模型、解析器、检索、工具的统一编排层     | RAG、工具调用、可复用链路 |
| **LangGraph**        | 在 LangChain 之上做状态机/图编排，强调状态与分支 | 多步 Agent、人工介入、重试、长流程 |

| 需求特征                         | 更合适的选择 |
| -------------------------------- | ------------ |
| **只是调一次模型**               | 原生 SDK 或 LangChain |
| **需要 Prompt + Parser + RAG**   | LangChain |
| **需要多分支、多轮状态、可恢复执行** | LangGraph |

> 💡 旧教程常把 LangChain 当成“做一切 Agent 应用的总入口”。当前更常见的分工是：**LangChain 做组件编排，LangGraph 做复杂流程控制**。

### 1.4 安装与包拆分

```bash
pip install -U langchain langchain-core langchain-openai langchain-community langsmith
```

| 包名                    | 说明                                        |
| ----------------------- | ------------------------------------------- |
| `langchain-core`        | 基础接口：Runnable、Prompt、Message、Parser |
| `langchain`             | 高层封装与常用组合能力                      |
| `langchain-openai`      | OpenAI 模型与 Embedding 集成                |
| `langchain-community`   | 各类社区集成：向量库、文档加载器、工具等    |
| `langsmith`             | 可观测性、调试、评估平台 SDK                |

> **注意**：LangChain 迭代很快。旧资料中的 `LLMChain`、`SequentialChain`、`ConversationChain`、`OpenAI Functions Agent` 仍会频繁出现。新项目优先使用 **LCEL**、**Tool Calling**、**RunnableWithMessageHistory**，复杂 Agent 流程优先考虑 **LangGraph**。

***

## 二、Model I/O

### 2.1 LLM 与 ChatModel

LangChain 将模型分为两类：

| 类型            | 输入/输出         | 典型实现                    |
| --------------- | ----------------- | --------------------------- |
| **LLM**         | 文本 → 文本       | `OpenAI`（旧版补全接口）    |
| **ChatModel**   | 消息列表 → 消息   | `ChatOpenAI`、`ChatAnthropic` |

当前主流 API 均为对话接口，推荐使用 `ChatModel`。

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,          # 0 = 确定性输出，1 = 更有创意
    api_key="sk-..."
)

response = llm.invoke("用一句话解释什么是向量数据库")
print(response.content)
```

### 2.2 PromptTemplate

**PromptTemplate** 是带变量占位符的提示词模板，用于动态构建发送给 LLM 的提示。

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一名{role}，用简洁的语言回答问题。"),
    ("human", "{question}")
])

# 填充变量，生成消息列表
messages = prompt.format_messages(role="技术专家", question="什么是 RAG？")
```

| 方法                          | 说明                               |
| ----------------------------- | ---------------------------------- |
| `from_template(str)`          | 从单个字符串创建，适合 LLM         |
| `from_messages(list)`         | 从消息列表创建，适合 ChatModel     |
| `format_messages(**kwargs)`   | 填充变量，返回消息列表             |
| `format(**kwargs)`            | 填充变量，返回字符串               |

### 2.3 结构化输出与 Output Parser

**Output Parser** 用于把模型输出从“自然语言文本”变成“程序可消费的数据结构”。

| 方式                          | 返回结果              | 优点                             | 适用场景 |
| ----------------------------- | --------------------- | -------------------------------- | -------- |
| **StrOutputParser**           | 字符串                | 最简单，适合普通问答             | 摘要、改写、解释 |
| **JsonOutputParser**          | `dict` / JSON         | 结构清晰，便于后续处理           | 固定字段输出 |
| **PydanticOutputParser**      | Pydantic 对象         | 有类型校验，失败更容易发现       | 评分、分类、抽取 |
| **Tool Calling / JSON Schema**| 模型原生结构化结果    | 稳定性通常更好                   | 生产级结构化输出 |

```python
from pydantic import BaseModel, Field
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

class Review(BaseModel):
    sentiment: str = Field(description="情感倾向：positive、negative、neutral")
    score: int = Field(description="评分，范围 1 到 10")

parser = PydanticOutputParser(pydantic_object=Review)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = ChatPromptTemplate.from_template("""
分析以下评论，并按指定格式输出。
{format_instructions}

评论：{text}
""")

chain = (
    {
        "format_instructions": lambda _: parser.get_format_instructions(),
        "text": lambda x: x["text"]
    }
    | prompt
    | llm
    | parser
)

result = chain.invoke({"text": "这个产品很好用，给 9 分"})
print(result.sentiment, result.score)
```

| 方法 / 属性                     | 说明                                             |
| ------------------------------- | ------------------------------------------------ |
| `parser.get_format_instructions()` | 生成给模型看的输出格式约束                    |
| `parser.invoke(output)`         | 解析单次模型输出                                 |
| `Field(description=...)`        | 字段语义说明，能显著提升结构化输出成功率         |

**推荐做法：**

| 场景                         | 推荐方式 |
| ---------------------------- | -------- |
| **只是给前端展示文本**       | `StrOutputParser` |
| **后端要继续处理字段**       | `JsonOutputParser` 或 `PydanticOutputParser` |
| **要求稳定、字段严格**       | 优先用模型原生 `Tool Calling / JSON Schema` |

***

## 三、LCEL（LangChain Expression Language）

### 3.1 什么是 LCEL

**LCEL（LangChain Expression Language）** 是 LangChain 的链式组合语法，用 `|` 管道符将组件串联，构建处理链。

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_template("用一句话介绍{topic}")
llm = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# 用 | 串联：prompt → llm → parser
chain = prompt | llm | parser

result = chain.invoke({"topic": "LangChain"})
print(result)  # 输出字符串
```

### 3.2 调用方式

| 方法              | 说明                                         |
| ----------------- | -------------------------------------------- |
| `invoke(input)`   | 同步调用，返回最终结果                       |
| `stream(input)`   | 流式输出，逐 token 返回，适合实时展示        |
| `batch(inputs)`   | 批量调用，传入列表，并发执行                 |
| `ainvoke(input)`  | 异步调用（async/await）                      |

```python
# 流式输出
for chunk in chain.stream({"topic": "向量数据库"}):
    print(chunk, end="", flush=True)

# 批量调用
results = chain.batch([{"topic": "RAG"}, {"topic": "Agent"}])
```

### 3.3 常用 Runnable 组件

| 组件                     | 作用                                   | 常见用途 |
| ------------------------ | -------------------------------------- | -------- |
| `RunnablePassthrough`    | 原样透传输入                           | 同时保留原始问题与派生字段 |
| `RunnableLambda`         | 将普通函数包装为 Runnable              | 数据清洗、字段转换、格式化 |
| `RunnableParallel`       | 并行执行多个子链，返回字典结果         | 同时生成多个字段、并发检索 |

```python
from langchain_core.runnables import RunnablePassthrough, RunnableLambda, RunnableParallel

branch = RunnableParallel(
    raw=RunnablePassthrough(),
    upper=RunnableLambda(lambda x: x.upper())
)

print(branch.invoke("langchain"))
# {'raw': 'langchain', 'upper': 'LANGCHAIN'}
```

> 💡 旧版文档中的 `LLMChain`、`SequentialChain` 仍能看到，但当前写法更推荐基于 **LCEL + Runnable** 组合。可读性和可扩展性更好。

***

## 四、对话状态与记忆

### 4.1 记忆的本质

“记忆”本质上不是模型自己记住了历史，而是**把历史或摘要重新喂回 Prompt**。

| 方式                              | 说明                                         | 适用场景 |
| --------------------------------- | -------------------------------------------- | -------- |
| **完整历史**                      | 保留所有消息，最直观                         | 短对话、调试 |
| **窗口记忆**                      | 只保留最近 k 轮                             | 在线聊天、控制成本 |
| **摘要记忆**                      | 用摘要替代旧消息                             | 长对话 |
| **结构化状态**                    | 只保存关键字段，如姓名、订单号、意图         | 业务系统、表单型对话 |

### 4.2 兼容层写法（旧教程常见）

```python
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
memory = ConversationBufferMemory(return_messages=True)

conversation = ConversationChain(llm=llm, memory=memory)
conversation.predict(input="我叫小明")
response = conversation.predict(input="我叫什么名字？")
print(response)
```

> **定位：** 这种写法适合理解概念、快速验证效果。新项目通常不再把 `ConversationChain` 作为首选。

### 4.3 现代写法：`RunnableWithMessageHistory`

```python
from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个助手"),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

chain = prompt | llm

store: dict[str, BaseChatMessageHistory] = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

chat_chain = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history",
)

chat_chain.invoke(
    {"input": "我叫小明"},
    config={"configurable": {"session_id": "user-1"}}
)

response = chat_chain.invoke(
    {"input": "我叫什么名字？"},
    config={"configurable": {"session_id": "user-1"}}
)

print(response.content)
```

### 4.4 生产环境怎么存历史

| 存储位置         | 特点                                         | 适用场景 |
| ---------------- | -------------------------------------------- | -------- |
| **内存**         | 最简单，但服务重启会丢失                     | 本地 Demo |
| **Redis**        | 读写快，适合短期会话                         | 在线聊天、会话缓存 |
| **数据库**       | 持久化强，可审计、可回放                     | 企业应用 |
| **摘要 + 数据库**| 旧消息转摘要，关键记录落库                   | 长对话、降成本 |

**推荐做法：**

| 场景                         | 建议 |
| ---------------------------- | ---- |
| **只做学习 Demo**            | 内存历史即可 |
| **用户真实会话**             | Redis 或数据库 |
| **多步骤 Agent / 工作流**    | 直接把状态设计成显式字段，必要时用 LangGraph |

***

## 五、Retrieval（检索增强）

### 5.1 RAG 流程

**RAG（Retrieval-Augmented Generation）** 检索增强生成，在生成回答前先从外部知识库检索相关内容，解决 LLM 知识截止和幻觉问题。

```text
用户提问
    ↓
将问题转为向量（Embedding）
    ↓
在向量数据库中检索相似文档
    ↓
将检索结果 + 原始问题拼入 Prompt
    ↓
LLM 生成最终回答
```

### 5.2 Document Loader

**Document Loader** 从各种来源加载文档，统一转换为 `Document` 对象（`page_content` + `metadata`）。

```python
from langchain_community.document_loaders import (
    TextLoader,
    PyPDFLoader,
    WebBaseLoader,
    DirectoryLoader
)

# 加载单个文本文件
loader = TextLoader("data/doc.txt", encoding="utf-8")
docs = loader.load()  # 返回 List[Document]

# 加载 PDF
loader = PyPDFLoader("data/report.pdf")
docs = loader.load_and_split()  # 按页分割

# 加载网页
loader = WebBaseLoader("https://example.com")
docs = loader.load()
```

### 5.3 Text Splitter

文档通常需要切分为小块（chunk）再存入向量库，避免超出 LLM 上下文限制。

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,       # 每块最大字符数
    chunk_overlap=50,     # 相邻块重叠字符数（保留上下文连贯性）
    separators=["\n\n", "\n", "。", " ", ""]  # 优先按段落切分
)

chunks = splitter.split_documents(docs)
```

| 参数              | 说明                                   |
| ----------------- | -------------------------------------- |
| `chunk_size`      | 每个 chunk 的最大字符数                |
| `chunk_overlap`   | 相邻 chunk 的重叠字符数，避免截断语义  |
| `separators`      | 切分优先级，从左到右依次尝试           |

### 5.4 Embeddings 与向量数据库

```python
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

# 创建 Embedding 模型
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# 将文档存入向量数据库
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"   # 持久化到本地
)

# 相似度检索
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
results = retriever.invoke("什么是向量数据库？")
```

| 常用向量库        | 特点                                     |
| ----------------- | ---------------------------------------- |
| **Chroma**        | 轻量，本地部署，开发调试首选             |
| **FAISS**         | Meta 开源，高性能，适合大规模离线检索    |
| **Pinecone**      | 云托管，全托管服务，生产环境可用         |
| **Weaviate**      | 开源，支持混合检索（向量 + 关键词）      |
| **Milvus**        | 开源，分布式，适合超大规模向量检索       |

### 5.5 构建 RAG 链

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_template("""
根据以下上下文回答问题，如果上下文中没有相关信息，请说"我不知道"。

上下文：
{context}

问题：{question}
""")

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | ChatOpenAI(model="gpt-4o-mini")
    | StrOutputParser()
)

answer = rag_chain.invoke("什么是 LangChain？")
```

### 5.6 RAG 调优要点

| 调优项                | 常见做法                                         | 说明 |
| --------------------- | ------------------------------------------------ | ---- |
| **`chunk_size`**      | 300～800 中文字符，按内容密度调整                | 太小会丢上下文，太大会降低召回精度 |
| **`chunk_overlap`**   | `chunk_size` 的 10%～20%                         | 避免关键信息被切断 |
| **Top-K**             | 先从 `k=3` 或 `k=5` 起步                         | 召回太多会把 Prompt 撑大 |
| **Metadata 过滤**     | 按来源、时间、文档类型过滤                       | 提高检索相关性 |
| **混合检索 / 重排**   | 关键词检索 + 向量检索，必要时加 rerank           | 复杂知识库常见 |

**排查顺序：**

```text
回答不准
    ↓
先看是否检索到了对的文档
    ↓
再看 chunk 是否切得合理
    ↓
再看 Prompt 是否要求“只基于上下文回答”
    ↓
最后再调模型与参数
```

***

## 六、Agents（智能代理）

### 6.1 什么是 Agent

**Agent** 让 LLM 充当"大脑"，根据用户目标自主决策：调用哪些工具、以什么顺序执行、何时返回最终结果。

```text
用户输入目标
    ↓
LLM 分析，决定调用哪个工具
    ↓
执行工具，获取结果
    ↓
LLM 分析结果，决定下一步（继续调用工具 or 返回答案）
    ↓
输出最终答案
```

### 6.2 内置工具

```python
from langchain_community.tools import DuckDuckGoSearchRun, WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper

search = DuckDuckGoSearchRun()
wiki = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper())

# 直接调用工具
result = search.invoke("LangChain 最新版本")
```

### 6.3 自定义工具

```python
from langchain_core.tools import tool

@tool
def get_weather(city: str) -> str:
    """获取指定城市的当前天气。city 为城市名称，如"北京"、"上海"。"""
    # 实际调用天气 API
    return f"{city}：晴，25°C"

# 工具元数据
print(get_weather.name)         # get_weather
print(get_weather.description)  # 函数 docstring
```

> 💡 `@tool` 装饰器会自动从函数签名和 docstring 提取工具名称、描述和参数 schema，LLM 依据这些信息决定何时调用。

### 6.4 创建 Agent

```python
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOpenAI(model="gpt-4o-mini")
tools = [search, get_weather]

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个智能助手，可以使用工具来回答问题。"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}")  # Agent 推理过程占位符
])

agent = create_tool_calling_agent(llm, tools, prompt)

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,      # 打印推理过程
    max_iterations=5   # 最大工具调用轮次
)

result = executor.invoke({"input": "北京今天天气怎么样？"})
print(result["output"])
```

| 参数              | 说明                                   |
| ----------------- | -------------------------------------- |
| `verbose`         | 打印每步推理和工具调用详情             |
| `max_iterations`  | 最大迭代次数，防止无限循环             |
| `handle_parsing_errors` | 遇到解析错误时自动重试           |

### 6.5 Agent 类型

| 类型                        | 说明                                         | 推荐程度 |
| --------------------------- | -------------------------------------------- | -------- |
| **Tool Calling Agent**      | 基于模型原生 Function Calling，稳定可靠      | ✅ 推荐  |
| **ReAct Agent**             | Reasoning + Acting，通过文本推理决策         | 适合旧模型 |
| **OpenAI Functions Agent**  | 早期 OpenAI 专用，已被 Tool Calling 取代     | ❌ 过时  |

### 6.6 Agent、固定流程、LangGraph 怎么选

| 方案                 | 优点                                   | 风险 / 成本                          | 适用场景 |
| -------------------- | -------------------------------------- | ------------------------------------ | -------- |
| **固定流程**         | 最稳定、最容易测试                     | 灵活性有限                           | 表单流程、固定业务 |
| **LangChain Agent**  | 工具选择灵活，开发快                   | 结果不完全可控，调试成本更高         | 1～3 个工具的动态调用 |
| **LangGraph**        | 状态清晰，可分支、可重试、可人工介入   | 学习成本更高                         | 多 Agent、长流程、生产编排 |

**经验法则：**

| 问题特征                           | 选择建议 |
| ---------------------------------- | -------- |
| **步骤和顺序已经固定**             | 固定流程，不必强上 Agent |
| **工具选择由问题决定**             | 用 Agent |
| **流程很长，还要状态恢复/人工审批** | 用 LangGraph |

***

## 七、Callbacks 与追踪

### 7.1 Callbacks

**Callbacks** 是 LangChain 的钩子机制，在链/Agent 执行的各个阶段触发，用于日志、监控、流式输出等。

```python
from langchain_core.callbacks import BaseCallbackHandler

class LogHandler(BaseCallbackHandler):
    def on_llm_start(self, serialized, prompts, **kwargs):
        print(f"[LLM 开始] Prompt: {prompts[0][:50]}...")

    def on_llm_end(self, response, **kwargs):
        print(f"[LLM 结束] Token 用量: {response.llm_output}")

    def on_tool_start(self, serialized, input_str, **kwargs):
        print(f"[工具调用] {serialized['name']}: {input_str}")

llm = ChatOpenAI(model="gpt-4o-mini", callbacks=[LogHandler()])
```

### 7.2 LangSmith 可观测性平台

**LangSmith** 是 LangChain 官方的可观测性与调试平台，用于追踪、评估和监控基于 LLM 的应用。

| 能力             | 说明                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| **Trace / 链路追踪** | 记录每次 LLM 调用的输入输出、中间步骤、工具调用、耗时与 token 消耗   |
| **数据集与评估** | 创建数据集、运行评估（准确率、延迟等），做回归测试与迭代             |
| **监控与告警**   | 监控生产环境调用量、延迟、错误率，可配置告警                         |
| **与 LangChain 集成** | 与 LangChain / LangGraph 深度集成，通过环境变量即可接入，无需改代码 |

**是否有用：** 开发调试时能看清完整调用链，比只看日志更直观；做评估与迭代时可量化效果；生产环境可做用量与成本管控。不依赖 LangSmith 也能开发 LangChain 应用，但可观测性和评估需自行用日志与指标系统实现。

**启用方式：** 在 [LangSmith](https://smith.langchain.com) 注册并获取 API Key，设置环境变量后，链与 Agent 的执行记录会自动上传。

```bash
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY="ls__..."    # LangSmith 控制台获取
export LANGCHAIN_PROJECT="my-project" # 项目名，用于在控制台分组
```

| 变量                     | 说明                           |
| ------------------------ | ------------------------------ |
| `LANGCHAIN_TRACING_V2`   | 设为 `true` 开启追踪           |
| `LANGCHAIN_API_KEY`     | LangSmith API Key              |
| `LANGCHAIN_PROJECT`     | 可选，用于在控制台区分项目     |

> 💡 有免费额度，复杂 Agent 或多步链、生产上线场景建议使用；个人小项目可先体验再决定是否长期使用。

### 7.3 调试时重点看什么

| 维度                 | 关注点                                       |
| -------------------- | -------------------------------------------- |
| **Prompt**           | 系统提示是否清晰，变量是否正确注入           |
| **检索结果**         | 召回的文档是否真和问题相关                   |
| **工具调用**         | 工具描述是否准确，参数 schema 是否清晰       |
| **Latency**          | 慢在检索、模型、工具调用还是网络             |
| **Token 成本**       | 历史消息、上下文、工具结果是否过长           |

***

## 八、完整示例：带历史的 RAG 问答

```python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableLambda
from langchain_core.runnables.history import RunnableWithMessageHistory

# ========== 1. 构建知识库 ==========
loader = TextLoader("knowledge.txt", encoding="utf-8")
docs = loader.load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
chunks = splitter.split_documents(docs)

vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=OpenAIEmbeddings(model="text-embedding-3-small"),
    persist_directory="./chroma_db"
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# ========== 2. 构建 RAG 链 ==========
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "你是知识库问答助手。仅根据提供的上下文回答问题；如果上下文没有答案，直接回答“我不知道”。\n\n上下文：\n{context}"
    ),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{question}")
])

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

rag_chain = (
    {
        "context": RunnableLambda(lambda x: x["question"]) | retriever | format_docs,
        "question": RunnableLambda(lambda x: x["question"]),
        "chat_history": RunnableLambda(lambda x: x["chat_history"])
    }
    | prompt
    | llm
)

# ========== 3. 挂接会话历史 ==========
store: dict[str, BaseChatMessageHistory] = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

chat_rag = RunnableWithMessageHistory(
    rag_chain,
    get_session_history,
    input_messages_key="question",
    history_messages_key="chat_history",
)

# ========== 4. 多轮提问 ==========
response1 = chat_rag.invoke(
    {"question": "LangChain 是什么？"},
    config={"configurable": {"session_id": "demo-user"}}
)
print(response1.content)

response2 = chat_rag.invoke(
    {"question": "它有哪些核心模块？"},
    config={"configurable": {"session_id": "demo-user"}}
)
print(response2.content)
```

| 组件                         | 作用 |
| ---------------------------- | ---- |
| `retriever`                  | 从知识库召回相关 chunk |
| `ChatPromptTemplate`         | 把上下文、历史、当前问题拼成最终 Prompt |
| `RunnableWithMessageHistory` | 以 `session_id` 为单位维护多轮历史 |
| `ChatOpenAI`                 | 负责生成最终回答 |

***

## 九、最佳实践与常见问题

### 9.1 推荐实践

| 项目                         | 建议 |
| ---------------------------- | ---- |
| **模型调用层**               | 新项目优先用 `ChatModel` |
| **链路编排**                 | 优先用 LCEL，不优先回退到旧式 Chain |
| **结构化输出**               | 能用 schema 就不要只靠自然语言约束 |
| **RAG**                      | 先把召回质量调对，再调 Prompt 和模型 |
| **Agent**                    | 工具少且流程固定时，不必强行使用 Agent |
| **可观测性**                 | 开发阶段尽早接入 LangSmith 或日志追踪 |

### 9.2 常见误区

| 误区                             | 问题                                    | 更合理的做法 |
| -------------------------------- | --------------------------------------- | ------------ |
| **把 LangChain 当成模型本身**    | 误以为“换了框架就等于换了模型能力”      | LangChain 只是编排层，模型能力仍由底层模型决定 |
| **先上 Agent 再想流程**          | 容易把简单问题做复杂                    | 先判断固定流程能否解决 |
| **RAG 效果差就先换大模型**       | 可能真正问题在检索阶段                  | 先查召回结果、chunk、Top-K、过滤条件 |
| **历史越多越好**                 | Token 成本高，还会引入噪声              | 控制窗口、做摘要、保留结构化状态 |
| **只看最终答案，不看中间链路**   | 很难定位 Prompt、检索或工具的问题       | 结合回调、日志、LangSmith 看全过程 |
