## 一、LangGraph 概述

### 1.1 什么是 LangGraph

**LangGraph** 是一个面向 **Agent 工作流** 的图编排框架，用节点（Node）、边（Edge）和状态（State）把多步推理、工具调用、分支路由、人工介入和可恢复执行组织成一个可控流程。

**核心思想：** 把“LLM 应用的执行过程”显式建模成一张图，让状态如何流动、在哪一步分支、何时结束、能否中断恢复都变得可见且可控。

| 特点               | 说明 |
| ------------------ | ---- |
| **状态驱动**       | 每一步都围绕共享状态读写，不再依赖隐式上下文 |
| **图结构编排**     | 支持线性流程、条件分支、循环、子图 |
| **天然适合 Agent** | 很适合工具调用、反复思考、重试、审批、长流程 |
| **支持持久化**     | 可保存执行快照，支持中断后继续执行 |
| **易于调试**       | 每个节点输入输出清晰，适合排查复杂链路问题 |

### 1.2 为什么需要 LangGraph

普通 LLM 调用通常只是：

```text
Prompt → 模型 → 输出
```

稍复杂一点会变成：

```text
Prompt → 模型 → 判断是否调用工具 → 调工具 → 再调模型 → 输出
```

当流程继续增加“条件分支、失败重试、人工审批、多 Agent 协作、会话恢复”时，仅靠普通函数嵌套或 LCEL 管道会逐渐变得难维护。LangGraph 解决的就是这类**复杂执行流**问题。

### 1.3 适用场景

| 场景                         | 说明 |
| ---------------------------- | ---- |
| **工具调用 Agent**           | 模型决定是否调用搜索、数据库、代码执行等工具 |
| **多步骤工作流**             | 例如分类 → 检索 → 生成 → 审核 → 输出 |
| **人工介入流程**             | 高风险操作前要求人工确认 |
| **长对话 / 长任务**          | 需要保存上下文和执行进度 |
| **多 Agent 协作**            | 路由 Agent、规划 Agent、执行 Agent 分工协作 |
| **生产级编排**               | 需要可观测、可恢复、可追踪的执行链路 |

### 1.4 LangGraph、LangChain、原生 SDK 的关系

| 方案             | 定位 | 更适合的场景 |
| ---------------- | ---- | ------------ |
| **原生模型 SDK** | 直接调用模型厂商 API，链路最短 | 单轮问答、最小 Demo |
| **LangChain**    | Prompt、模型、解析器、检索、工具的统一编排层 | RAG、结构化输出、工具调用 |
| **LangGraph**    | 在 LangChain 之上做状态图编排，强调状态、分支和恢复执行 | 多步 Agent、人工审批、长流程 |

| 需求特征                               | 选择建议 |
| -------------------------------------- | -------- |
| **只需要一次模型调用**                 | 原生 SDK 或 LangChain |
| **需要 Prompt + Parser + RAG**         | LangChain |
| **需要循环、分支、人工介入、断点恢复** | LangGraph |

> 💡 LangChain 更像“组件编排层”，LangGraph 更像“流程控制层”。

***

## 二、核心概念

### 2.1 Graph、State、Node、Edge

LangGraph 的核心可以概括为 4 个词：

| 概念          | 说明 | 类比 |
| ------------- | ---- | ---- |
| **Graph**     | 一张执行图，定义流程整体结构 | 工作流 |
| **State**     | 所有节点共享的数据结构 | 上下文 / 运行时状态 |
| **Node**      | 图中的一个处理步骤 | 函数 / 任务节点 |
| **Edge**      | 节点之间的流转关系 | 下一步怎么走 |

执行流程可以理解为：

```text
    输入初始 State
        ↓
    从 START 进入第一个节点
        ↓
    节点读取 State，返回状态更新
        ↓
    根据 Edge 决定去下一个节点
        ↓
    到达 END，返回最终 State
```

### 2.2 State（状态）

**State** 是 LangGraph 的核心。节点本身尽量只关心“读取什么”和“返回什么”，真正的流程数据都放在 State 中。

常见 State 字段：

| 字段             | 作用 |
| ---------------- | ---- |
| **messages**     | 对话历史 |
| **input**        | 原始用户输入 |
| **intent**       | 意图识别结果 |
| **documents**    | 检索到的文档 |
| **tool_result**  | 工具执行结果 |
| **final_answer** | 最终输出 |
| **approved**     | 人工审批结果 |

常见写法使用 `TypedDict`：

```python
from typing import TypedDict

class GraphState(TypedDict):
    input: str
    intent: str
    final_answer: str
```

### 2.3 Node（节点）

**Node** 本质上通常就是一个函数：接收当前 `state`，返回一个“状态更新字典”。

```python
def classify_node(state: GraphState):
    text = state["input"]

    if "天气" in text:
        return {"intent": "weather"}
    return {"intent": "general"}
```

| 节点设计原则         | 说明 |
| -------------------- | ---- |
| **输入统一来自 State** | 不依赖全局变量，更容易测试 |
| **输出只返回增量**     | 返回本节点需要更新的字段即可 |
| **职责单一**           | 一个节点只做一件事，便于复用和调试 |
| **尽量无副作用**       | 外部写库、发消息、扣费操作要谨慎设计 |

### 2.4 Edge（边）

LangGraph 中常见两类边：

| 类型                 | 说明 |
| -------------------- | ---- |
| **普通边**           | 固定从 A 走到 B |
| **条件边**           | 根据函数返回值决定走向不同节点 |

固定边：

```python
builder.add_edge("classify", "generate")
```

条件边：

```python
def route_by_intent(state: GraphState):
    return state["intent"]

builder.add_conditional_edges(
    "classify",
    route_by_intent,
    {
        "weather": "weather_node",
        "general": "general_node",
    }
)
```

### 2.5 START、END

每张图都有两个特殊节点：

| 标识      | 作用 |
| --------- | ---- |
| **START** | 图的入口 |
| **END**   | 图的出口 |

最简单的流程：

```text
START → classify → generate → END
```

### 2.6 Reducer 与状态合并

当多个节点都往同一个字段写数据时，LangGraph 需要知道“怎么合并”。这个合并规则通常称为 **Reducer**。

最典型的就是消息列表追加。

```python
from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages

class ChatState(TypedDict):
    messages: Annotated[list, add_messages]
```

`add_messages` 的作用是：新消息不是覆盖旧消息，而是**追加到消息列表中**。

| 字段类型         | 常见合并方式 |
| ---------------- | ------------ |
| **字符串 / 数字** | 直接覆盖 |
| **列表**         | 追加或拼接 |
| **字典**         | 按 key 合并 |
| **消息列表**     | 使用 `add_messages` |

### 2.7 MessagesState

LangGraph 提供了一个常见对话场景的现成状态结构：`MessagesState`。

它适合快速构建聊天 Agent，因为核心字段已经是消息列表。

```python
from langgraph.graph import MessagesState

def chatbot(state: MessagesState):
    ...
```

> 💡 只是做简单聊天，`MessagesState` 很方便；一旦需要额外业务字段，通常会自定义 `TypedDict`。

***

## 三、安装与快速入门

### 3.1 安装

```bash
pip install -U langgraph langchain langchain-openai langchain-community langsmith
```

| 包名                    | 作用 |
| ----------------------- | ---- |
| `langgraph`             | LangGraph 核心包 |
| `langchain`             | LangChain 高层能力 |
| `langchain-openai`      | OpenAI 模型接入 |
| `langchain-community`   | 社区工具、加载器、向量库等 |
| `langsmith`             | 调试、追踪、评估 |

### 3.2 第一个 LangGraph

下面用一个最小示例演示“分类后生成回复”的流程。

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END


class GraphState(TypedDict):
    input: str
    intent: str
    final_answer: str


def classify_node(state: GraphState):
    text = state["input"]

    if "天气" in text:
        return {"intent": "weather"}
    return {"intent": "general"}


def weather_node(state: GraphState):
    return {"final_answer": "这是天气类问题，可以调用天气工具处理。"}


def general_node(state: GraphState):
    return {"final_answer": "这是通用问题，可以直接调用模型回答。"}


def route_by_intent(state: GraphState):
    return state["intent"]


# 1. 创建图
builder = StateGraph(GraphState)

# 2. 注册节点
builder.add_node("classify", classify_node)
builder.add_node("weather_node", weather_node)
builder.add_node("general_node", general_node)

# 3. 连接边
builder.add_edge(START, "classify")
builder.add_conditional_edges(
    "classify",
    route_by_intent,
    {
        "weather": "weather_node",
        "general": "general_node",
    }
)
builder.add_edge("weather_node", END)
builder.add_edge("general_node", END)

# 4. 编译图
graph = builder.compile()

# 5. 执行
result = graph.invoke({"input": "今天北京天气怎么样？"})
print(result["final_answer"])
```

流程图如下：

```text
    START
      ↓
   classify
   ↙      ↘
weather   general
   ↓         ↓
  END       END
```

### 3.3 编译（compile）

在 LangGraph 中，`builder` 只是“图定义器”，真正可执行的是 `compile()` 后得到的对象。

| 阶段              | 说明 |
| ----------------- | ---- |
| **StateGraph(...)** | 定义状态结构 |
| **add_node(...)**   | 添加节点 |
| **add_edge(...)**   | 添加固定边 |
| **add_conditional_edges(...)** | 添加条件边 |
| **compile()**       | 编译为可执行图 |

### 3.4 常用调用方式

| 方法                | 说明 |
| ------------------- | ---- |
| `invoke(input)`     | 同步执行，返回最终状态 |
| `stream(input)`     | 流式查看执行过程或增量结果 |
| `batch(inputs)`     | 批量执行多个输入 |
| `get_state(config)` | 读取当前线程状态 |

```python
# 同步调用
result = graph.invoke({"input": "介绍一下 LangGraph"})

# 流式查看每一步输出
for event in graph.stream({"input": "介绍一下 LangGraph"}):
    print(event)
```

***

## 四、状态设计与节点编写

### 4.1 State 设计原则

State 决定了图是否容易维护。推荐把“会被多个节点读写的内容”显式放进 State。

| 设计建议             | 说明 |
| -------------------- | ---- |
| **字段少而清晰**     | 只保留流程真正需要的数据 |
| **区分原始输入与中间结果** | 如 `input`、`documents`、`final_answer` |
| **区分短期状态和长期数据** | 当前执行过程的数据放 State，长期记忆单独存储 |
| **字段命名稳定**     | 避免同一含义多个名字 |

不推荐把所有内容都塞进一个大字典：

```python
# ❌ 不推荐：字段语义不清晰
class BadState(TypedDict):
    data: dict
```

推荐显式建模：

```python
# ✅ 推荐：字段可读性更好
class GoodState(TypedDict):
    input: str
    intent: str
    documents: list[str]
    final_answer: str
```

### 4.2 节点返回值规则

节点通常返回一个 `dict`，表示本节点对状态的更新。

```python
def retrieve_node(state):
    docs = ["文档1", "文档2"]
    return {"documents": docs}
```

| 返回方式            | 说明 |
| ------------------- | ---- |
| **返回部分字段**    | 最常见，只更新自己负责的字段 |
| **返回空字典**      | 节点完成动作但不修改状态 |
| **抛异常**          | 由上层决定是否重试、兜底或终止 |

### 4.3 条件分支

LangGraph 非常适合显式路由。

```python
from typing import Literal


def route_node(state) -> Literal["search", "chat"]:
    if state["intent"] == "knowledge":
        return "search"
    return "chat"
```

```python
builder.add_conditional_edges(
    "classify",
    route_node,
    {
        "search": "retrieve_docs",
        "chat": "chat_reply",
    }
)
```

常见路由依据：

| 依据               | 示例 |
| ------------------ | ---- |
| **意图分类结果**   | 问答、搜索、操作类请求 |
| **模型输出标记**   | 是否需要工具、是否需要澄清 |
| **工具执行结果**   | 成功、失败、为空 |
| **人工审批结果**   | 通过、驳回 |

### 4.4 循环

Agent 很多时候不是“走一遍就结束”，而是：

```text
模型判断 → 调工具 → 把工具结果给模型 → 再判断是否继续
```

这在 LangGraph 中就是一个循环图：

```text
START → chatbot → tools → chatbot → ... → END
```

只要条件边最终有机会走向 `END`，这个循环就是可控的。

### 4.5 Command

在一些需要“更新状态 + 指定下一步”的场景里，可以使用 `Command`。

`Command` 常用于：

| 场景                 | 说明 |
| -------------------- | ---- |
| **人工介入恢复执行** | 中断后带着人工输入继续跑 |
| **动态跳转**         | 根据当前情况明确指定下一个节点 |
| **恢复现场**         | 在恢复时携带 `resume` 数据 |

示意写法：

```python
from langgraph.types import Command

command = Command(resume=True)
```

> 💡 普通流程只用返回 `dict` 就够了；需要“恢复执行”时再关注 `Command`。

***

## 五、构建对话 Agent

### 5.1 工具调用 Agent 的基本结构

典型 Tool Calling Agent 一般长这样：

```text
    用户消息
        ↓
     chatbot
        ↓
  判断是否有 tool_calls
     ↙           ↘
  tools          END
     ↓
  chatbot
```

核心思想：

| 步骤                | 说明 |
| ------------------- | ---- |
| **chatbot 节点**    | 调模型，决定是直接回答还是调用工具 |
| **tools 节点**      | 执行工具，把结果写回消息列表 |
| **条件边**          | 判断是否存在工具调用 |
| **循环**            | 工具结果返回后，再让模型继续推理 |

### 5.2 对话 Agent 示例

```python
from typing import Annotated, TypedDict
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langgraph.graph import StateGraph, START
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition


class AgentState(TypedDict):
    messages: Annotated[list, add_messages]


@tool
def search_docs(query: str) -> str:
    """搜索知识库并返回结果摘要"""
    return f"已搜索到与“{query}”相关的知识片段。"


llm = ChatOpenAI(model="gpt-4o-mini", temperature=0).bind_tools([search_docs])


def chatbot(state: AgentState):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}


builder = StateGraph(AgentState)
builder.add_node("chatbot", chatbot)
builder.add_node("tools", ToolNode([search_docs]))

builder.add_edge(START, "chatbot")
builder.add_conditional_edges("chatbot", tools_condition)
builder.add_edge("tools", "chatbot")

graph = builder.compile()

for event in graph.stream(
    {"messages": [("user", "帮我查一下 LangGraph 适合什么场景")]},
    stream_mode="values"
):
    print(event)
```

| 组件                  | 作用 |
| --------------------- | ---- |
| `@tool`               | 定义可被模型调用的工具 |
| `bind_tools([...])`   | 把工具注册给模型 |
| `ToolNode([...])`     | 执行模型请求的工具 |
| `tools_condition`     | 判断下一步是走工具还是结束 |
| `add_messages`        | 把新消息追加到历史中 |

### 5.3 人工介入（Human-in-the-loop）

LangGraph 的一个重要能力是：**在关键节点暂停，等人工确认后再继续执行**。

典型场景：

| 场景                 | 说明 |
| -------------------- | ---- |
| **删除 / 扣费操作**  | 高风险操作前必须人工确认 |
| **模型答案待审核**   | 先生成草稿，再由人工批准 |
| **工具参数不确定**   | 让人工补充缺失信息 |

示意代码：

```python
from typing import TypedDict
from langgraph.types import interrupt, Command
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver


class ApprovalState(TypedDict):
    draft: str
    approved: bool


def draft_node(state: ApprovalState):
    return {"draft": "准备执行高风险操作"}


def approval_node(state: ApprovalState):
    approved = interrupt({
        "question": "是否继续执行？",
        "draft": state["draft"]
    })
    return {"approved": approved}


def execute_node(state: ApprovalState):
    if state["approved"]:
        return {"draft": "已执行"}
    return {"draft": "已取消"}


builder = StateGraph(ApprovalState)
builder.add_node("draft_node", draft_node)
builder.add_node("approval_node", approval_node)
builder.add_node("execute_node", execute_node)

builder.add_edge(START, "draft_node")
builder.add_edge("draft_node", "approval_node")
builder.add_edge("approval_node", "execute_node")
builder.add_edge("execute_node", END)

graph = builder.compile(checkpointer=MemorySaver())

config = {"configurable": {"thread_id": "approval-demo"}}

# 第一次执行：运行到 interrupt 处暂停
graph.invoke({}, config=config)

# 人工确认后恢复执行
graph.invoke(Command(resume=True), config=config)
```

> **注意**：人工介入要想恢复执行，通常需要配置 `checkpointer`，否则中断现场无法保存。

### 5.4 持久化与线程（thread_id）

LangGraph 会把同一条执行链视为一个 **thread**。要恢复同一个流程，关键是保持 `thread_id` 一致。

```python
from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "chat-001"}}

graph.invoke({"messages": [("user", "你好")]}, config=config)
graph.invoke({"messages": [("user", "继续刚才的话题")]}, config=config)
```

| 概念               | 说明 |
| ------------------ | ---- |
| **checkpointer**   | 保存执行快照，用于中断恢复和线程状态管理 |
| **thread_id**      | 当前执行线程标识，同一个会话要保持一致 |
| **state snapshot** | 某一步的状态快照 |

### 5.5 短期记忆与长期记忆

很多人容易把“消息历史”“状态持久化”“业务记忆”混在一起。

| 类型               | 说明 | 常见存储位置 |
| ------------------ | ---- | ------------ |
| **短期状态**       | 当前图运行过程中的状态 | State |
| **线程级持久化**   | 为了中断恢复保存的执行现场 | Checkpointer |
| **长期记忆**       | 跨会话保存的用户资料、偏好、历史摘要 | 数据库 / 向量库 / Store |

> 💡 `checkpointer` 解决的是“这次流程如何继续跑”，不是“业务数据长期沉淀到哪里”。

***

## 六、进阶能力

### 6.1 子图（Subgraph）

当某一段流程内部也比较复杂时，可以把它拆成子图复用。

| 场景                 | 说明 |
| -------------------- | ---- |
| **检索流程复用**     | 查询改写 → 检索 → 重排 |
| **审核流程复用**     | 生成 → 规则校验 → 人工审批 |
| **多 Agent 协作**    | 每个 Agent 内部都是一个独立子图 |

子图的价值：

| 价值                 | 说明 |
| -------------------- | ---- |
| **复用**             | 复杂流程可作为组件反复使用 |
| **隔离复杂度**       | 主图更清晰 |
| **更利于测试**       | 可单独测试某个子流程 |

### 6.2 多 Agent 编排

多 Agent 本质上通常不是“很多模型随便聊天”，而是**每个 Agent 负责一类明确任务**。

常见模式：

| 模式                 | 说明 |
| -------------------- | ---- |
| **路由模式**         | 先分类，再分发到不同 Agent |
| **规划-执行模式**    | 一个 Agent 做任务拆解，另一个 Agent 执行 |
| **审查模式**         | 一个 Agent 生成，一个 Agent 审核 |
| **协调器模式**       | 中央协调节点统一调度多个 Agent |

示意流程：

```text
START → router
          ├── qa_agent
          ├── search_agent
          └── coding_agent
                 ↓
               reviewer
                 ↓
                END
```

### 6.3 流式输出

LangGraph 不只是返回最终结果，也可以把中间执行过程流出来，便于前端实时展示和调试。

```python
for event in graph.stream(
    {"messages": [("user", "介绍一下 LangGraph")]},
    stream_mode="values"
):
    print(event)
```

| `stream_mode` 常见值 | 说明 |
| -------------------- | ---- |
| **`values`**         | 输出每一步的状态值变化 |
| **其他模式**         | 不同版本中会有事件流、消息流等差异，使用前看当前文档 |

> **注意**：LangGraph 版本迭代较快，流式事件格式可能随版本变化。

### 6.4 与 LangSmith 配合

LangGraph 很适合接入 LangSmith 追踪执行链路。

LangSmith 常见价值：

| 能力                 | 说明 |
| -------------------- | ---- |
| **链路追踪**         | 看每个节点做了什么 |
| **输入输出对比**     | 定位哪一步结果异常 |
| **性能分析**         | 观察耗时节点 |
| **评估与回放**       | 对比不同 Prompt 或模型效果 |

生产环境里，复杂图如果没有可观测性，排查问题会很痛苦。

***

## 七、最佳实践与常见问题

### 7.1 什么时候适合用 LangGraph

| 场景                               | 是否推荐 |
| ---------------------------------- | -------- |
| **简单聊天 / 一次性问答**          | 不一定，需要时再用 |
| **RAG + 少量工具调用**             | 可先用 LangChain，复杂后再升级 |
| **多步骤 Agent / 多分支工作流**    | 推荐 |
| **需要人工审批 / 中断恢复**        | 强烈推荐 |
| **多 Agent 协作**                  | 推荐 |

### 7.2 最佳实践

| 建议                   | 说明 |
| ---------------------- | ---- |
| **先设计 State，再写节点** | 状态结构清晰，后面扩展才稳 |
| **节点职责单一**       | 一个节点只做分类、检索、生成中的一件事 |
| **外部副作用靠后放**   | 扣费、写库、发消息前最好加校验或审批 |
| **给高风险流程加人工介入** | 不要完全相信模型自动执行 |
| **重要流程一定做追踪** | 方便回放和定位问题 |
| **循环一定设计退出条件** | 防止 Agent 无休止调用工具 |

### 7.3 常见问题

| 问题                         | 原因 |
| ---------------------------- | ---- |
| **消息越来越大，成本过高**   | 没有限制消息历史或缺少摘要策略 |
| **流程卡住或死循环**         | 条件边没有合理收敛到 `END` |
| **恢复执行失败**             | 没配置 `checkpointer`，或 `thread_id` 不一致 |
| **State 字段越来越乱**       | 一开始没有做好状态建模 |
| **节点难测试**               | 节点内部耦合了太多外部依赖 |

### 7.4 LangGraph 学习顺序

| 阶段 | 学什么 |
| ---- | ------ |
| **第一阶段** | `StateGraph`、`START/END`、节点、固定边、条件边 |
| **第二阶段** | `messages`、`add_messages`、`ToolNode`、`tools_condition` |
| **第三阶段** | `checkpointer`、`thread_id`、中断恢复、人工介入 |
| **第四阶段** | 子图、多 Agent、长期记忆、可观测性 |

### 7.5 一句话总结

**LangGraph** 适合把“原本写成大量 if/else、while、函数嵌套的 Agent 流程”改造成**状态清晰、分支明确、可中断、可恢复、可观测**的图执行系统。
