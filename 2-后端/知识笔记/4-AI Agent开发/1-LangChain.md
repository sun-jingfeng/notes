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

```
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

### 1.3 安装

```bash
pip install langchain langchain-openai langchain-community
```

| 包名                    | 说明                                        |
| ----------------------- | ------------------------------------------- |
| `langchain`             | 核心框架，链、Agent、Memory 等抽象          |
| `langchain-openai`      | OpenAI 模型集成（ChatOpenAI、OpenAIEmbeddings） |
| `langchain-community`   | 社区集成：向量库、文档加载器、工具等        |
| `langchain-core`        | 基础接口定义，自动随 langchain 安装         |

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

### 2.3 Output Parser

**Output Parser** 将 LLM 的原始文本输出解析为结构化数据。

```python
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field

# 字符串解析器（提取 .content 文本）
parser = StrOutputParser()

# 结构化解析（Pydantic 模型）
class Review(BaseModel):
    sentiment: str = Field(description="情感倾向：positive/negative/neutral")
    score: int = Field(description="评分 1-10")

json_parser = JsonOutputParser(pydantic_object=Review)
```

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

### 3.3 RunnablePassthrough 与 RunnableLambda

```python
from langchain_core.runnables import RunnablePassthrough, RunnableLambda

# RunnablePassthrough：透传输入，常用于将原始输入传递到链的后续步骤
chain = RunnablePassthrough() | llm | parser

# RunnableLambda：将普通函数包装为 Runnable
def format_input(x):
    return {"topic": x.upper()}

chain = RunnableLambda(format_input) | prompt | llm | parser
chain.invoke("langchain")
```

***

## 四、Memory（对话记忆）

### 4.1 记忆类型

| 类型                              | 说明                                         | 适用场景               |
| --------------------------------- | -------------------------------------------- | ---------------------- |
| **ConversationBufferMemory**      | 保存完整对话历史                             | 短对话                 |
| **ConversationBufferWindowMemory**| 只保留最近 k 轮对话                          | 限制 token 消耗        |
| **ConversationSummaryMemory**     | 用 LLM 对历史进行摘要压缩                    | 长对话                 |
| **ConversationSummaryBufferMemory**| 近期保留原文，较早内容压缩为摘要             | 长对话 + 精度要求      |

### 4.2 基本用法

```python
from langchain.memory import ConversationBufferMemory
from langchain_openai import ChatOpenAI
from langchain.chains import ConversationChain

llm = ChatOpenAI(model="gpt-4o-mini")
memory = ConversationBufferMemory(return_messages=True)

conversation = ConversationChain(llm=llm, memory=memory)

conversation.predict(input="我叫小明")
response = conversation.predict(input="我叫什么名字？")
print(response)  # 能记住"小明"
```

### 4.3 LCEL 中手动管理记忆

在 LCEL 链中，推荐手动维护消息历史，灵活性更高：

```python
from langchain_core.messages import HumanMessage, AIMessage

chat_history = []

def chat(user_input: str) -> str:
    chat_history.append(HumanMessage(content=user_input))
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "你是一个助手"),
        *[(msg.type, msg.content) for msg in chat_history]
    ])
    chain = prompt | llm | StrOutputParser()
    response = chain.invoke({})
    
    chat_history.append(AIMessage(content=response))
    return response
```

***

## 五、Retrieval（检索增强）

### 5.1 RAG 流程

**RAG（Retrieval-Augmented Generation）** 检索增强生成，在生成回答前先从外部知识库检索相关内容，解决 LLM 知识截止和幻觉问题。

```
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

***

## 六、Agents（智能代理）

### 6.1 什么是 Agent

**Agent** 让 LLM 充当"大脑"，根据用户目标自主决策：调用哪些工具、以什么顺序执行、何时返回最终结果。

```
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

### 7.2 LangSmith 追踪

**LangSmith** 是 LangChain 官方的可观测性平台，可视化追踪每次调用的输入输出、耗时、token 消耗。

```bash
# 设置环境变量启用追踪
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY="ls__..."
export LANGCHAIN_PROJECT="my-project"
```

启用后，所有链和 Agent 的执行记录自动上传到 LangSmith 控制台，无需修改代码。

***

## 八、完整示例：带记忆的 RAG 问答

```python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage

# ========== 1. 构建知识库 ==========
loader = TextLoader("knowledge.txt", encoding="utf-8")
docs = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)

vectorstore = Chroma.from_documents(
    chunks, OpenAIEmbeddings(model="text-embedding-3-small")
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# ========== 2. 构建带历史的 RAG 链 ==========
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "根据上下文回答问题，无相关信息则说不知道。\n\n上下文：\n{context}"),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{question}")
])

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

chain = (
    {
        "context": retriever | format_docs,
        "question": RunnablePassthrough(),
        "chat_history": lambda _: chat_history
    }
    | prompt
    | llm
    | StrOutputParser()
)

# ========== 3. 多轮对话 ==========
chat_history = []

def ask(question: str) -> str:
    answer = chain.invoke(question)
    chat_history.append(HumanMessage(content=question))
    chat_history.append(AIMessage(content=answer))
    return answer

print(ask("LangChain 是什么？"))
print(ask("它有哪些核心模块？"))  # 能结合上下文回答
```
