## 一、项目起步

### 1.1 学习目标

**最小智能体实战** 指从一个空白 Python 项目开始，逐步实现“模型调用、工具调用、结果回填、自然语言回复”这一条完整链路。

**核心目标：** 先跑通最小可用 Demo，再在此基础上继续扩展更多 Agent 能力。

| 目标 | 说明 |
| ---- | ---- |
| **能调用模型** | 使用 DeepSeek 完成基础对话 |
| **能调用工具** | 模型能够选择并调用本地函数 |
| **能处理参数** | 支持无参工具和有参工具 |
| **能访问项目文件** | 支持查看项目目录和读取项目文件 |
| **能继续扩展** | 后续可继续加天气、搜索、LangChain、LangGraph |

### 1.2 `uv init` 初始化后有哪些文件

使用 `uv` 初始化 Python 项目后，最常见的基础文件如下：

| 文件 / 目录 | 作用 |
| ----------- | ---- |
| **`pyproject.toml`** | 项目核心配置，管理依赖、项目信息、Python 版本 |
| **`uv.lock`** | 锁定依赖版本，保证环境可复现 |
| **`main.py`** | 默认入口文件 |
| **`.venv/`** | 虚拟环境目录 |
| **`.python-version`** | 指定 Python 版本 |
| **`README.md`** | 项目说明文档 |

### 1.3 最小智能体的完整链路

一个最小可用智能体的执行过程如下：

```text
用户输入问题
    ↓
把 messages 和 tools 发给模型
    ↓
模型判断是否需要调用工具
    ↓
如果需要：返回 tool_call
    ↓
Python 程序执行对应函数
    ↓
把工具结果追加回 messages
    ↓
再次请求模型
    ↓
模型基于工具结果生成最终回复
```

***

## 二、基础配置

### 2.1 安装的依赖

当前项目安装了以下依赖：

```bash
uv add openai python-dotenv pydantic rich
```

| 依赖 | 作用 |
| ---- | ---- |
| **`openai`** | 调用 DeepSeek 的 OpenAI 兼容接口 |
| **`python-dotenv`** | 从 `.env` 文件加载环境变量 |
| **`pydantic`** | 后续可用于配置校验、结构化输出 |
| **`rich`** | 后续可用于增强命令行输出效果 |

> 💡 DeepSeek 可以直接使用 OpenAI 兼容 SDK 调用，只需要更换 `base_url` 和 `api_key`。

### 2.2 `.env` 是什么

**`.env`** 是环境变量文件，用来存放运行时配置，不属于 Python 官方语法的一部分，但在实际项目里非常常见。

当前项目的典型配置如下：

```env
DEEPSEEK_API_KEY=你的 Key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
```

| 配置项 | 作用 |
| ------ | ---- |
| **`DEEPSEEK_API_KEY`** | DeepSeek 鉴权 Key |
| **`DEEPSEEK_BASE_URL`** | DeepSeek 接口地址 |
| **`DEEPSEEK_MODEL`** | 当前使用的模型名 |

**`.env` 和 `pyproject.toml` 的区别：**

| 对比项 | `.env` | `pyproject.toml` |
| ------ | ------ | ---------------- |
| **定位** | 运行时配置 | 项目配置 |
| **存放内容** | Key、URL、模型名 | 依赖、项目名、版本 |
| **是否敏感** | 常包含敏感信息 | 一般不敏感 |
| **是否建议提交 Git** | 通常不建议 | 通常建议 |

### 2.3 `llm.py` 的作用

`llm.py` 用来统一管理模型连接和模型调用。

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


def get_client() -> OpenAI:
    return OpenAI(
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        base_url=os.getenv("DEEPSEEK_BASE_URL"),
    )


def get_model() -> str:
    return os.getenv("DEEPSEEK_MODEL", "deepseek-chat")


def create_chat_completion(client: OpenAI, messages: list, tools=None):
    return client.chat.completions.create(
        model=get_model(),
        messages=messages,
        tools=tools,
    )
```

| 函数 | 作用 |
| ---- | ---- |
| **`get_client()`** | 创建 DeepSeek 客户端 |
| **`get_model()`** | 读取当前模型名 |
| **`create_chat_completion()`** | 统一发起一次对话请求 |

***

## 三、最小智能体闭环

### 3.1 普通聊天程序和智能体的区别

| 类型 | 执行方式 | 特点 |
| ---- | -------- | ---- |
| **普通聊天程序** | 用户输入 → 模型回复 | 只能回答，不能行动 |
| **智能体（Agent）** | 用户输入 → 模型判断 → 调工具 → 再次生成回复 | 能调用外部工具完成任务 |

普通聊天程序的核心通常是：

```text
messages → model → content
```

最小智能体的核心通常是：

```text
messages + tools → model
    ↓
tool_call
    ↓
执行 Python 工具函数
    ↓
tool result 回填 messages
    ↓
再次调用 model
```

### 3.2 `tools.py` 负责什么

`tools.py` 负责 3 件事：

| 内容 | 作用 |
| ---- | ---- |
| **工具函数** | 真正执行任务，例如获取时间、计算、读取文件 |
| **`TOOL_SPECS`** | 描述工具给模型看 |
| **`TOOL_MAP`** | 给 Python 程序做工具分发 |

这两个概念必须区分：

| 名称 | 给谁看 | 作用 |
| ---- | ------ | ---- |
| **`TOOL_SPECS`** | 模型 | 告诉模型有哪些工具、参数是什么 |
| **`TOOL_MAP`** | Python 程序 | 根据工具名找到真正的函数 |

### 3.3 为什么最开始会出现“我来帮你查看时间”

只把 `tools` 传给模型，但没有处理 `tool_calls` 时，模型只能表达“我准备调用工具”，程序却不会真的执行工具函数。

这种情况下的链路如下：

```text
用户：现在几点了
    ↓
模型：我来帮你查看当前时间
    ↓
程序直接把这句话打印出来
    ↓
没有真正执行 get_current_time()
```

真正正确的做法是：

```text
用户：现在几点了
    ↓
模型返回 tool_call：get_current_time
    ↓
程序执行 get_current_time()
    ↓
得到时间结果
    ↓
把结果传回模型
    ↓
模型输出最终自然语言回复
```

### 3.4 `main.py` 的主流程

当前 `main.py` 的核心逻辑如下：

```python
from llm import create_chat_completion, get_client
from tools import TOOL_SPECS, execute_tool_call

client = get_client()


def main():
    messages = [
        {
            "role": "system",
            "content": (
                "你是一个有帮助的 AI 助手。"
                "遇到查询当前时间的问题时，优先调用 get_current_time。"
                "遇到明确的四则运算问题时，优先调用 calculate。"
                "遇到用户想查看当前项目目录或文件内容时，可以调用 list_project_files 和 read_project_file。"
                "在拿到工具结果后，再用自然语言给出最终回答。"
            ),
        }
    ]

    while True:
        user_input = input("你: ").strip()
        if user_input in {"exit", "quit"}:
            break

        messages.append({"role": "user", "content": user_input})

        response = create_chat_completion(client, messages, TOOL_SPECS)
        assistant_message = response.choices[0].message

        if assistant_message.tool_calls:
            messages.append(assistant_message.model_dump(exclude_none=True))

            for tool_call in assistant_message.tool_calls:
                try:
                    tool_result = execute_tool_call(tool_call)
                except Exception as exc:
                    tool_result = f"工具执行失败: {exc}"

                print(f"[tool] {tool_call.function.name} -> {tool_result}")
                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": tool_result,
                    }
                )

            final_response = create_chat_completion(client, messages, TOOL_SPECS)
            reply = final_response.choices[0].message.content
            print(f"AI: {reply}")
            messages.append({"role": "assistant", "content": reply})
            continue

        reply = assistant_message.content
        print(f"AI: {reply}")
        messages.append({"role": "assistant", "content": reply})


if __name__ == "__main__":
    main()
```

| 步骤 | 说明 |
| ---- | ---- |
| **读取输入** | 使用 `input()` 获取用户输入 |
| **追加消息** | 把用户输入追加进 `messages` |
| **第一次请求模型** | 判断是否需要调用工具 |
| **执行工具** | 通过 `execute_tool_call()` 调用 Python 函数 |
| **回填工具结果** | 以 `role=tool` 形式追加回对话 |
| **第二次请求模型** | 生成最终自然语言回复 |

***

## 四、当前已实现的工具

### 4.1 `get_current_time`

**`get_current_time`** 是无参工具，返回当前本地时间。

```python
from datetime import datetime


def get_current_time() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
```

| 代码 | 说明 |
| ---- | ---- |
| **`datetime.now()`** | 获取当前时间 |
| **`strftime()`** | 按指定格式转成字符串 |

### 4.2 `calculate`

**`calculate`** 是有参工具，支持基础四则运算。

```python
def calculate(left: float, right: float, operator: str) -> str:
    if operator == "+":
        result = left + right
    elif operator == "-":
        result = left - right
    elif operator == "*":
        result = left * right
    elif operator == "/":
        if right == 0:
            raise ValueError("除数不能为 0")
        result = left / right
    else:
        raise ValueError(f"不支持的运算符: {operator}")

    return str(result)
```

| 参数 | 说明 |
| ---- | ---- |
| **`left`** | 左操作数 |
| **`right`** | 右操作数 |
| **`operator`** | 运算符，支持 `+ - * /` |

模型在调用它时，通常会生成类似下面的参数：

```json
{
  "left": 12,
  "right": 13,
  "operator": "*"
}
```

### 4.3 `list_project_files`

**`list_project_files`** 用于查看当前项目中的文件和目录。

```python
def list_project_files(subdir: str = ".", max_depth: int = 2) -> str:
    base_path = _resolve_project_path(subdir)
    results = []

    for path in sorted(base_path.rglob("*")):
        if _should_ignore(path):
            continue
        if _depth_from(base_path, path) > max_depth:
            continue

        relative_path = path.relative_to(PROJECT_ROOT)
        suffix = "/" if path.is_dir() else ""
        results.append(f"{relative_path}{suffix}")

    if not results:
        return "没有找到文件。"

    return "\n".join(results)
```

| 参数 | 说明 |
| ---- | ---- |
| **`subdir`** | 要查看的项目子目录 |
| **`max_depth`** | 最大递归层级 |

### 4.4 `read_project_file`

**`read_project_file`** 用于读取当前项目内的文本文件内容。

```python
def read_project_file(path: str, max_chars: int = 2000) -> str:
    file_path = _resolve_project_path(path)

    if file_path.is_dir():
        raise ValueError(f"{path} 是目录，不是文件")

    content = file_path.read_text(encoding="utf-8")
    if len(content) <= max_chars:
        return content

    return content[:max_chars] + "\n...<内容已截断>..."
```

| 参数 | 说明 |
| ---- | ---- |
| **`path`** | 项目内文件路径 |
| **`max_chars`** | 返回内容的最大字符数 |

### 4.5 `read_project_file_lines`

**`read_project_file_lines`** 用于按行号读取文本文件，适合先搜索、再精确查看局部上下文的场景。

```python
def read_project_file_lines(
    path: str,
    start_line: int = 1,
    line_count: int = 80,
) -> str:
    file_path = _resolve_project_path(path)

    if file_path.is_dir():
        raise ValueError(f"{path} 是目录，不是文件")

    if start_line < 1:
        raise ValueError("start_line 必须从 1 开始")
    if line_count < 1 or line_count > 200:
        raise ValueError("line_count 必须在 1 到 200 之间")

    lines = file_path.read_text(encoding="utf-8").splitlines()
    start_index = start_line - 1
    end_index = min(start_index + line_count, len(lines))
    selected_lines = lines[start_index:end_index]

    return "\n".join(
        f"{line_number}: {line}"
        for line_number, line in enumerate(selected_lines, start=start_line)
    )
```

| 参数 | 说明 |
| ---- | ---- |
| **`path`** | 项目内文件路径 |
| **`start_line`** | 起始行号，从 1 开始 |
| **`line_count`** | 读取多少行 |

| 适合场景 | 说明 |
| -------- | ---- |
| **搜索后继续看上下文** | 先拿到命中行号，再精确读取附近几十行 |
| **避免一次读太多内容** | 比按字符截断更适合代码文件 |
| **便于模型引用位置** | 返回结果里直接带行号 |

### 4.6 `execute_tool_call`

**`execute_tool_call`** 是工具执行分发器，根据模型返回的工具名和参数，调用真正的 Python 函数。

```python
def execute_tool_call(tool_call) -> str:
    tool_name = tool_call.function.name
    tool_func = TOOL_MAP.get(tool_name)

    if tool_func is None:
        raise ValueError(f"未知工具: {tool_name}")

    arguments = tool_call.function.arguments or "{}"
    parsed_arguments = json.loads(arguments)
    result = tool_func(**parsed_arguments)
    return str(result)
```

| 代码 | 说明 |
| ---- | ---- |
| **`tool_call.function.name`** | 模型想调用的工具名 |
| **`json.loads(arguments)`** | 把 JSON 字符串转成 Python 字典 |
| **`tool_func(**parsed_arguments)`** | 把字典拆成命名参数传给函数 |

### 4.7 `get_weather`

**`get_weather`** 是第一个外部 API 工具，用于查询指定城市的实时天气。

```python
from urllib.parse import quote
from urllib.request import urlopen


def get_weather(city: str) -> str:
    encoded_city = quote(city)
    url = f"https://wttr.in/{encoded_city}?format=j1"

    with urlopen(url, timeout=10) as response:
        payload = response.read().decode("utf-8")

    data = json.loads(payload)
    current = data["current_condition"][0]

    temperature_c = current["temp_C"]
    feels_like_c = current["FeelsLikeC"]
    humidity = current["humidity"]
    description = current["weatherDesc"][0]["value"]

    return (
        f"城市: {city}\n"
        f"天气: {description}\n"
        f"温度: {temperature_c}°C\n"
        f"体感温度: {feels_like_c}°C\n"
        f"湿度: {humidity}%"
    )
```

| 代码 | 说明 |
| ---- | ---- |
| **`quote(city)`** | 对城市名做 URL 编码 |
| **`urlopen(url, timeout=10)`** | 发起 HTTP 请求 |
| **`response.read()`** | 读取响应体 |
| **`decode("utf-8")`** | 把字节转换成字符串 |
| **`json.loads(payload)`** | 把 JSON 字符串转成 Python 字典 |

### 4.8 `search_project_content`

**`search_project_content`** 用于按关键词搜索当前项目中的文本内容，适合快速定位函数名、配置项、关键字符串等信息。

```python
def search_project_content(query: str, max_results: int = 10) -> str:
    normalized_query = query.strip().lower()
    if not normalized_query:
        raise ValueError("搜索关键词不能为空")

    results = []

    for path in sorted(PROJECT_ROOT.rglob("*")):
        if not path.is_file() or _should_ignore(path) or not _is_searchable_file(path):
            continue

        try:
            content = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue

        for line_number, line in enumerate(content.splitlines(), start=1):
            if normalized_query in line.lower():
                relative_path = path.relative_to(PROJECT_ROOT)
                results.append(f"{relative_path}:{line_number}: {line.strip()}")
                if len(results) >= max_results:
                    return "\n".join(results)
```

| 参数 | 说明 |
| ---- | ---- |
| **`query`** | 搜索关键词 |
| **`max_results`** | 最多返回多少条匹配结果 |

| 特点 | 说明 |
| ---- | ---- |
| **忽略目录** | 自动跳过 `.git`、`.venv`、`__pycache__` |
| **只搜文本文件** | 避免误读二进制文件 |
| **大小写不敏感** | 搜索时统一转小写比较 |
| **结果带路径和行号** | 便于快速定位 |

***

## 五、学习过程中涉及的 Python 语法

### 5.1 `def`、缩进、返回值

Python 使用 `def` 定义函数，使用缩进表示代码块，而不是使用大括号。

```python
def calculate(left: float, right: float, operator: str) -> str:
    result = left + right
    return str(result)
```

| 语法 | 说明 |
| ---- | ---- |
| **`def`** | 定义函数 |
| **`:`** | 表示代码块开始 |
| **缩进** | 表示函数体、判断体、循环体 |
| **`-> str`** | 返回值类型提示 |
| **`return`** | 返回结果 |

### 5.2 `if / elif / else`

Python 条件判断使用 `if / elif / else`。

```python
if operator == "+":
    result = left + right
elif operator == "-":
    result = left - right
else:
    raise ValueError("不支持的运算符")
```

`elif` 相当于其他语言中的 `else if`。

### 5.3 列表和字典

`messages` 是列表，列表中的每一项是字典。

```python
messages = [
    {"role": "system", "content": "你是一个有帮助的 AI 助手"}
]
```

| 结构 | 说明 |
| ---- | ---- |
| **`[]`** | 列表，类似数组 / `List` |
| **`{}`** | 字典，类似对象 / `Map` |
| **`append()`** | 向列表尾部追加元素 |

### 5.4 `**` 拆字典参数

```python
parsed_arguments = {
    "left": 12,
    "right": 13,
    "operator": "*"
}

calculate(**parsed_arguments)
```

上面的调用等价于：

```python
calculate(left=12, right=13, operator="*")
```

`**` 的作用是把字典拆成命名参数。

### 5.5 `try / except`

Python 使用 `try / except` 做异常处理。

```python
try:
    tool_result = execute_tool_call(tool_call)
except Exception as exc:
    tool_result = f"工具执行失败: {exc}"
```

| 语法 | 说明 |
| ---- | ---- |
| **`try`** | 尝试执行可能报错的代码 |
| **`except`** | 捕获异常 |
| **`as exc`** | 把异常对象保存到变量中 |
| **`raise`** | 主动抛出异常 |

### 5.6 `Path` 路径操作

`pathlib.Path` 是 Python 里很常用的路径处理方式。

```python
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
target_path = (PROJECT_ROOT / "main.py").resolve()
```

| 写法 | 说明 |
| ---- | ---- |
| **`Path(__file__)`** | 当前文件路径 |
| **`.resolve()`** | 转成绝对路径 |
| **`.parent`** | 父目录 |
| **`/`** | 拼接路径 |

### 5.7 返回多个值、类型提示、切片

这次在 `main.py` 中增加了本地命令 `clear` 和 `history`，顺带用到了几个新的 Python 语法点。

```python
def handle_local_command(user_input: str, messages: list) -> tuple[bool, list]:
    if user_input == "clear":
        print("AI: 已清空当前对话上下文。")
        return True, build_initial_messages()

    if user_input == "history":
        print_history(messages)
        return True, messages

    return False, messages
```

| 语法 | 说明 |
| ---- | ---- |
| **`tuple[bool, list]`** | 返回值类型提示，表示返回一个二元组 |
| **`return True, messages`** | Python 可以一次返回多个值，本质上会自动打包成元组 |
| **`if ...:`** | 条件分支 |
| **`print()`** | 输出内容到终端 |

下面这段代码里还用到了切片：

```python
for message in messages[1:]:
    print(message)
```

`messages[1:]` 表示从索引 `1` 开始一直取到末尾，通常用来跳过第一条 `system` 消息。

### 5.8 `with`、标准库网络请求、JSON 解析

天气工具里新增了几个非常常见的 Python 写法。

```python
with urlopen(url, timeout=10) as response:
    payload = response.read().decode("utf-8")

data = json.loads(payload)
```

| 语法 | 说明 |
| ---- | ---- |
| **`with ... as ...`** | 上下文管理语法，离开代码块后会自动释放资源 |
| **`urlopen()`** | 使用 Python 标准库发送 HTTP 请求 |
| **`.read()`** | 读取响应内容，返回字节 |
| **`.decode("utf-8")`** | 把字节转成字符串 |
| **`json.loads()`** | 把 JSON 字符串转成 Python 对象 |

`with` 的作用和 Java 中的 `try-with-resources` 很像，常用于文件读写、网络请求、数据库连接等场景。

### 5.9 `enumerate()`、字符串标准化、短路判断

项目内容搜索工具里新增了几个很常见的 Python 写法。

```python
normalized_query = query.strip().lower()

for line_number, line in enumerate(content.splitlines(), start=1):
    if normalized_query in line.lower():
        results.append(f"{relative_path}:{line_number}: {line.strip()}")
```

| 语法 | 说明 |
| ---- | ---- |
| **`strip()`** | 去掉字符串首尾空白 |
| **`lower()`** | 转成小写，便于做大小写不敏感匹配 |
| **`enumerate(..., start=1)`** | 遍历时同时拿到索引和值，这里索引从 1 开始作为行号 |
| **`in`** | 判断一个字符串是否包含在另一个字符串中 |

另外还有这种组合判断：

```python
if not path.is_file() or _should_ignore(path) or not _is_searchable_file(path):
    continue
```

这里的 `or` 会从左到右短路求值，只要有一个条件成立，就直接进入 `continue`。

***

## 六、当前项目结构

### 6.1 目录结构

当前项目可以概括为：

```text
my-agent/
├── .agent_sessions/
├── .env
├── .python-version
├── config.py
├── langchain_agent.py
├── langchain_create_agent.py
├── langgraph_agent.py
├── llm.py
├── main.py
├── session_store.py
├── tools.py
├── pyproject.toml
├── uv.lock
└── README.md
```

### 6.2 各文件职责

| 文件 | 职责 |
| ---- | ---- |
| **`main.py`** | 交互式主循环、本地命令、连续工具调用闭环 |
| **`langchain_agent.py`** | 使用 LangChain 重写的对照版智能体 |
| **`langchain_create_agent.py`** | 使用 `create_agent()` 的高层 Agent 版本 |
| **`langgraph_agent.py`** | 使用 LangGraph `StateGraph` 实现的意图路由工作流版本 |
| **`config.py`** | 集中管理模型配置、最大工具轮数、会话目录等设置 |
| **`llm.py`** | 创建模型客户端与统一请求封装 |
| **`session_store.py`** | 会话保存、会话加载、会话列表查看 |
| **`tools.py`** | 工具函数、工具描述、工具执行分发 |
| **`.agent_sessions/`** | 保存命令行会话快照 |
| **`.env`** | DeepSeek Key、模型名、接口地址 |
| **`pyproject.toml`** | 项目依赖与元信息 |

### 6.3 当前支持的本地命令

除了正常向模型提问外，当前命令行程序还支持以下本地命令：

| 命令 | 作用 |
| ---- | ---- |
| **`help`** | 查看当前支持的本地命令 |
| **`clear`** | 清空当前对话上下文，只保留系统提示词 |
| **`history`** | 打印当前会话中的消息历史 |
| **`tools`** | 查看当前暴露给模型的工具列表 |
| **`sessions`** | 查看已经保存的会话文件 |
| **`save [名称]`** | 保存当前会话 |
| **`load <名称>`** | 恢复之前保存的会话 |

`clear` 的作用是快速把 `messages` 恢复成初始状态：

```python
def build_initial_messages() -> list:
    return [{"role": "system", "content": SYSTEM_PROMPT}]
```

`history` 的作用是把当前内存中的 `messages` 打印出来，便于观察多轮对话上下文是如何累积的。

`save / load / sessions` 这一组命令对应的是**会话状态管理**：

- `save` 把当前上下文持久化到本地文件
- `sessions` 查看已经保存过哪些会话
- `load` 从已有状态继续提问

`tools` 的作用是把当前可用工具打印出来，便于观察“模型此刻到底看到了哪些能力”。

`help` 的作用是快速提示当前支持的本地命令，避免忘记有哪些命令可用。

***

## 七、LangChain 对照实现

### 7.1 为什么要单独做一版 LangChain

手写版智能体已经能完成：

- 模型调用
- 工具调用
- 工具结果回填
- 多轮对话管理

LangChain 版的意义不在于“功能立刻变多”，而在于把很多手写的胶水逻辑替换成框架抽象，便于后续继续学习更复杂的 Agent 结构。

| 手写版实现 | LangChain 对应 |
| ---------- | -------------- |
| **`create_chat_completion()`** | `ChatOpenAI.invoke()` |
| **`SYSTEM_PROMPT`** | `SystemMessage` / Prompt |
| **字典结构的 `messages`** | `HumanMessage`、`AIMessage`、`ToolMessage` |
| **`TOOL_SPECS` + `TOOL_MAP`** | `@tool` + Tool 对象 |
| **`execute_tool_call()`** | Tool 调用与 `ToolMessage` 回填 |

### 7.2 `langchain_agent.py` 的核心结构

`langchain_agent.py` 保留了和手写版相同的功能，但把模型层和消息层切换成 LangChain 写法。

```python
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
```

| 导入项 | 作用 |
| ------ | ---- |
| **`ChatOpenAI`** | LangChain 里的对话模型封装 |
| **`HumanMessage`** | 用户消息对象 |
| **`AIMessage`** | 模型消息对象 |
| **`ToolMessage`** | 工具结果消息对象 |
| **`@tool`** | 把普通 Python 函数包装成 LangChain 工具 |

### 7.3 用 `@tool` 包装已有工具

LangChain 版没有重写底层业务逻辑，而是复用了已经写好的 Python 函数：

```python
@tool("get_weather")
def lc_get_weather(city: str) -> str:
    """查询指定城市的实时天气。"""
    return get_weather(city)
```

这种写法的特点：

| 写法 | 说明 |
| ---- | ---- |
| **`@tool("get_weather")`** | 把函数注册成 LangChain 工具 |
| **函数参数类型提示** | 供 LangChain 推断工具参数结构 |
| **函数注释字符串** | 作为工具描述提供给模型 |

### 7.4 用 `bind_tools()` 把工具绑定给模型

LangChain 版最关键的一句是：

```python
llm = get_langchain_model().bind_tools(TOOLS)
```

这句的作用等价于手写版中的：

- 把工具描述传给模型
- 告诉模型当前可调用哪些工具

区别在于：手写版自己维护 `TOOL_SPECS`，LangChain 版由框架根据 `@tool` 自动组织工具信息。

### 7.5 LangChain 版仍然保留两段式调用

LangChain 并不会神奇地让工具自动执行，核心闭环仍然是：

```text
用户输入
    ↓
llm.invoke(messages)
    ↓
AIMessage.tool_calls
    ↓
执行工具
    ↓
追加 ToolMessage
    ↓
再次 llm.invoke(messages)
    ↓
输出最终回复
```

这说明：LangChain 主要简化的是“抽象层”，不是改变 Agent 的本质流程。

### 7.6 `langchain_agent.py` 的价值

当前这个 LangChain 版主要解决两件事：

| 价值 | 说明 |
| ---- | ---- |
| **建立概念映射** | 能把手写版逻辑和框架概念对应起来 |
| **为后续学习铺路** | 后续继续学 AgentExecutor、Memory、LangGraph 会更顺 |

> **注意**：当前项目使用的是 Python 3.14。实际运行 LangChain 版时会出现一条兼容性警告，提示部分基于 Pydantic V1 的能力与 Python 3.14 兼容性不稳定。当前示例可以运行，但如果后续开始深入使用 LangChain / LangGraph，更稳妥的 Python 版本通常是 **3.11** 或 **3.12**。

***

## 八、`create_agent()` 高层 Agent 版本

### 8.1 为什么还要再做一版 `create_agent()`

当前安装的 `langchain` 版本是 **1.2.x**。这个版本不再像很多旧教程那样直接暴露 `AgentExecutor` 入口，官方更推荐使用高层的 `create_agent()`。

它的定位可以理解为：

| 写法 | 定位 |
| ---- | ---- |
| **手写版 `main.py`** | 完全手写工具循环 |
| **`langchain_agent.py`** | 用 LangChain 组件，但仍手动控制循环 |
| **`langchain_create_agent.py`** | 交给 LangChain 高层 Agent 自动处理工具循环 |

### 8.2 `create_agent()` 的核心特点

```python
agent = create_agent(
    model=get_langchain_model(),
    tools=TOOLS,
    system_prompt=SYSTEM_PROMPT,
)
```

这段代码的含义是：

- 传入模型
- 传入工具列表
- 传入系统提示词
- 让框架自动完成“模型调用 → 工具调用 → 工具结果回填 → 再次调用模型”的循环

和上一版最大的区别在于：`langchain_agent.py` 中需要自己手动写两次 `llm.invoke()`，而 `create_agent()` 会在内部完成这套流程。

### 8.3 `create_agent()` 返回的是什么

当前版本的 `create_agent()` 返回的不是一个简单函数，而是一个**编译后的 Agent 图对象**。

调用方式通常是：

```python
result = agent.invoke(
    {"messages": messages + [HumanMessage(content=user_input)]}
)
messages = result["messages"]
```

返回结果是一个字典，其中最关键的字段是：

| 字段 | 作用 |
| ---- | ---- |
| **`messages`** | Agent 整个执行过程中的消息历史 |

也就是说，`create_agent()` 虽然是 LangChain 的高层入口，但内部其实已经走到了“图执行”的思路。

### 8.4 这一版的学习价值

| 价值 | 说明 |
| ---- | ---- |
| **更接近当前官方写法** | 适合新版本 LangChain 学习 |
| **代码更短** | 不需要手动写工具调用循环 |
| **为 LangGraph 铺路** | 因为它底层已经带有图执行思路 |

***

## 九、LangGraph 最小工作流版本

### 9.1 LangGraph 版的目标

LangGraph 版不是为了“做更多功能”，而是为了把当前智能体流程显式地拆成：

- 状态（State）
- 节点（Node）
- 边（Edge）
- 条件路由（Conditional Edge）

当前最小图的目标是复现最常见的一类 Agent 工作流：

```text
用户输入
    ↓
模型节点
    ↓
如果有工具调用 → ToolNode
    ↓
再回到模型节点
    ↓
没有工具调用 → 结束
```

### 9.2 `AgentState`

LangGraph 版首先定义了状态结构：

```python
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
```

| 写法 | 说明 |
| ---- | ---- |
| **`TypedDict`** | 定义状态结构 |
| **`messages`** | 当前图中共享的消息状态 |
| **`Annotated[..., add_messages]`** | 指定消息字段如何聚合更新 |

这里的 `add_messages` 非常关键，它告诉 LangGraph：每个节点返回的新消息应该追加到已有消息列表中，而不是直接覆盖。

### 9.3 模型节点 `call_model`

```python
def call_model(state: AgentState) -> AgentState:
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}
```

这个节点的作用很单纯：

- 从状态里读取 `messages`
- 调模型
- 把新生成的 `AIMessage` 返回给状态

这就是 LangGraph 中最典型的 Node 写法。

### 9.4 `ToolNode` 和条件边

LangGraph 版的图结构如下：

```python
graph.add_node("agent", call_model)
graph.add_node("tools", ToolNode(TOOLS))
graph.add_edge(START, "agent")
graph.add_conditional_edges(
    "agent",
    tools_condition,
    {"tools": "tools", "__end__": END},
)
graph.add_edge("tools", "agent")
```

可以这样理解：

| 结构 | 作用 |
| ---- | ---- |
| **`START -> agent`** | 图从模型节点开始 |
| **`ToolNode(TOOLS)`** | 预置工具执行节点 |
| **`tools_condition`** | 判断上一个 `AIMessage` 是否包含工具调用 |
| **`"tools" -> "agent"`** | 工具执行完后再回到模型节点 |
| **`"__end__" -> END`** | 没有工具调用时结束 |

### 9.5 这一版的学习价值

| 价值 | 说明 |
| ---- | ---- |
| **把执行流显式化** | 不再只是 `if/else`，而是明确的图结构 |
| **建立 LangGraph 直觉** | 能看懂 `State / Node / Edge / ToolNode` 各自做什么 |
| **为复杂工作流做准备** | 后续可扩展分支、重试、人工介入、多 Agent |

### 9.6 三种实现的区别

| 版本 | 特点 | 更适合当前学习什么 |
| ---- | ---- | ------------------ |
| **`main.py`** | 完全手写 | 理解 Agent 最小闭环 |
| **`langchain_agent.py`** | LangChain 组件化，但循环仍自己控制 | 理解框架抽象如何映射到手写逻辑 |
| **`langchain_create_agent.py`** | 高层 Agent 入口，自动工具循环 | 理解当前 LangChain 官方推荐入口 |
| **`langgraph_agent.py`** | 显式图结构，可继续升级为多分支路由 | 理解工作流、状态和路由 |

***

## 十、`langgraph_agent.py` 升级为意图路由工作流

### 10.1 为什么要做意图路由

前面的 `langgraph_agent.py` 最开始虽然已经是图结构，但本质上还是“一套工具给一个模型节点统一处理”。当工具逐渐变多时，这种方式会出现两个问题：

| 问题 | 说明 |
| ---- | ---- |
| **工具暴露过多** | 每次模型都能看到全部工具，选择空间过大 |
| **流程意图不够清晰** | 天气、项目搜索、普通聊天本质上是不同类型的请求 |

意图路由版的目标是先判断用户意图，再把请求交给更合适的分支处理。

### 10.2 路由版状态结构

```python
class RouterState(TypedDict):
    messages: Annotated[list, add_messages]
    intent: str
```

和最小图版本相比，多了一个 `intent` 字段。

| 字段 | 作用 |
| ---- | ---- |
| **`messages`** | 共享消息状态 |
| **`intent`** | 当前轮次识别出的意图，例如 `weather`、`project`、`utility`、`chat` |

### 10.3 路由节点 `route_intent`

```python
def route_intent(state: RouterState) -> RouterState:
    user_input = get_latest_user_input(state["messages"])

    if any(keyword in user_input for keyword in ["天气", "温度", "湿度", "下雨", "晴", "雾"]):
        intent = "weather"
    elif any(
        keyword in user_input
        for keyword in ["项目", "文件", "目录", "代码", "读取", "搜索", "查找", "出现", "内容"]
    ):
        intent = "project"
    elif any(
        keyword in user_input
        for keyword in ["几点", "时间", "计算", "加", "减", "乘", "除", "+", "-", "*", "/", "等于"]
    ):
        intent = "utility"
    else:
        intent = "chat"

    return {"intent": intent}
```

这一步不是直接回答问题，而是先做一个简单的意图分类。

当前版本使用的是**关键词路由**，不是让模型去做分类，优点是：

- 实现简单
- 运行稳定
- 便于观察工作流结构

### 10.4 分组工具与分支节点

路由版把工具拆成了 3 组：

```python
WEATHER_TOOLS = [lc_get_weather]
PROJECT_TOOLS = [lc_list_project_files, lc_read_project_file, lc_search_project_content]
UTILITY_TOOLS = [lc_get_current_time, lc_calculate]
```

然后为每一组工具绑定一个专门的模型节点：

| 节点 | 可用工具 |
| ---- | -------- |
| **`weather_agent`** | `get_weather` |
| **`project_agent`** | `list_project_files`、`read_project_file`、`search_project_content` |
| **`utility_agent`** | `get_current_time`、`calculate` |
| **`chat_agent`** | 无工具，普通对话 |

这种拆分的价值是：模型在天气分支里看不到项目工具，在项目分支里看不到天气工具，决策空间更小、更聚焦。

### 10.5 路由图结构

```python
graph.add_edge(START, "router")
graph.add_conditional_edges(
    "router",
    route_by_intent,
    {
        "weather_agent": "weather_agent",
        "project_agent": "project_agent",
        "utility_agent": "utility_agent",
        "chat_agent": "chat_agent",
    },
)
```

这部分表示：

```text
START
  ↓
router
  ├── weather_agent
  ├── project_agent
  ├── utility_agent
  └── chat_agent
```

然后在各自的分支里继续判断要不要调用工具。

### 10.6 工具节点如何回环

以天气分支为例：

```python
graph.add_conditional_edges(
    "weather_agent",
    tools_condition,
    {"tools": "weather_tools", "__end__": END},
)
graph.add_edge("weather_tools", "weather_agent")
```

含义是：

- 如果 `weather_agent` 触发了工具调用，就进入 `weather_tools`
- 工具执行完后，再回到 `weather_agent`
- 如果没有工具调用，就直接结束

项目分支和工具分支也遵循同样模式。

### 10.7 这一版的学习价值

| 价值 | 说明 |
| ---- | ---- |
| **更像真实工作流** | 先路由，再进入不同处理链路 |
| **更适合工具扩展** | 工具多起来后，按领域拆分更清晰 |
| **建立多分支直觉** | 能直观看到 LangGraph 如何做分支流程 |
| **为多 Agent 铺路** | 后续可以把不同分支替换成不同 Agent |

***

## 十一、把最小智能体补成更像真实 Agent 的版本

### 11.1 为什么“一次工具调用”还不够

前面的最小闭环已经能完成：

- 模型决定要不要调工具
- Python 执行工具
- 把结果回填给模型

但如果只允许“调一次工具，再直接结束”，会遇到一个很常见的问题：

| 场景 | 只调一次工具的问题 |
| ---- | ------------------ |
| **项目代码分析** | 可能先要搜索，再读文件，再读局部行 |
| **复杂查询** | 可能先获取目录，再选文件，再提取重点 |
| **工具结果不够完整** | 模型需要基于第一次结果继续决定下一步 |

更像真实 Agent 的执行链路通常是：

```text
用户输入
    ↓
模型判断
    ↓
调用工具 1
    ↓
回填结果
    ↓
模型继续判断
    ↓
调用工具 2 / 工具 3
    ↓
直到信息足够
    ↓
输出最终自然语言回复
```

### 11.2 连续工具调用循环

这一步的核心不是“多写几个工具”，而是把主循环改成**可连续推进的工具回环**。

常见写法如下：

```python
for step in range(max_tool_rounds):
    assistant_message = call_model(messages, tools)
    messages.append(assistant_message)

    if not assistant_message.tool_calls:
        return assistant_message.content

    for tool_call in assistant_message.tool_calls:
        tool_result = execute_tool_call(tool_call)
        messages.append(tool_result)
```

| 设计点 | 作用 |
| ------ | ---- |
| **循环调用模型** | 允许模型基于上一步观察继续行动 |
| **每轮都检查 `tool_calls`** | 判断当前是否还需要工具 |
| **设置 `max_tool_rounds`** | 防止模型进入死循环 |
| **工具结果持续追加到 `messages`** | 让模型拥有完整观察历史 |

> **注意**：最小智能体不一定要有复杂规划器，但最好要有“连续工具循环 + 最大轮数保护”。

### 11.3 为什么要补一个“按行读取文件”的工具

当工具开始处理项目文件时，只靠“整文件读取”通常不够细。

| 方式 | 特点 |
| ---- | ---- |
| **按字符截断读取** | 实现简单，但容易把代码截在中间 |
| **按行号读取** | 更适合代码、配置、日志等结构化文本 |

按行读取的价值主要有 3 个：

| 价值 | 说明 |
| ---- | ---- |
| **更适合与搜索联动** | 搜索结果通常返回“文件 + 行号” |
| **更适合模型继续分析** | 模型能围绕命中位置继续查看上下文 |
| **更可控** | 一次只读几十行，避免上下文浪费 |

典型使用顺序如下：

```text
先搜索关键词
    ↓
拿到文件路径和命中行号
    ↓
按行读取附近上下文
    ↓
模型基于局部内容继续分析
```

### 11.4 会话保存与恢复

最小智能体一开始通常只保存在内存里，一旦退出程序，本轮上下文就丢了。

把会话保存成文件后，可以得到更接近真实 CLI Agent 的使用体验。

| 能力 | 作用 |
| ---- | ---- |
| **保存会话** | 把当前 `messages` 持久化到本地文件 |
| **列出会话** | 查看之前保存过哪些对话 |
| **加载会话** | 从上次状态继续提问 |

这种能力本质上是在补**状态管理**，不是在补模型能力。

### 11.5 配置收口与终端输出增强

当示例逐渐变长后，配置和交互体验也需要一起升级。

**配置收口：**

把模型名、Base URL、最大工具轮数、会话目录等配置统一收口，价值如下：

| 价值 | 说明 |
| ---- | ---- |
| **便于校验** | 缺少 Key、参数非法时能更早报错 |
| **便于扩展** | 后续增加新配置时更集中 |
| **便于迁移** | 从一个项目迁移到另一个项目时更清晰 |

***

**终端输出增强：**

在交互式 Agent 里，终端输出不是“锦上添花”，而是可观察性的一部分。

| 输出增强项 | 作用 |
| ---------- | ---- |
| **工具列表表格** | 便于观察当前暴露给模型的能力 |
| **本地命令帮助** | 便于快速查看 `help / save / load` 等能力 |
| **工具调用日志** | 便于看清每一轮到底执行了什么 |

***

## 十二、当前阶段总结与后续方向

### 12.1 当前已经掌握的能力

| 能力 | 状态 |
| ---- | ---- |
| **DeepSeek 基础调用** | 已完成 |
| **多轮对话 `messages` 管理** | 已完成 |
| **无参工具调用** | 已完成 |
| **有参工具调用** | 已完成 |
| **项目文件工具调用** | 已完成 |
| **工具异常处理** | 已完成 |
| **连续工具调用循环** | 已完成 |
| **按行读取文件上下文** | 已完成 |
| **本地命令 `help/clear/history/tools/sessions/save/load`** | 已完成 |
| **会话持久化** | 已完成 |
| **外部 API 天气工具** | 已完成 |
| **项目内容搜索工具** | 已完成 |
| **`rich` 终端输出增强** | 已完成 |
| **配置集中管理** | 已完成 |
| **LangChain 对照版实现** | 已完成 |
| **`create_agent()` 高层 Agent 版** | 已完成 |
| **LangGraph 最小工作流版** | 已完成 |
| **LangGraph 意图路由工作流版** | 已完成 |

### 12.2 后续可以继续补充的方向

| 方向 | 说明 |
| ---- | ---- |
| **更多外部工具** | 网页读取、搜索、数据库查询 |
| **结构化输出** | 让模型按指定 Schema 返回结果 |
| **记忆增强** | 长期记忆、会话摘要、向量检索 |
| **人工介入** | 对高风险工具增加确认节点 |
| **持久化检查点** | 在工作流层保存状态，支持中断恢复 |
| **多 Agent** | 按角色拆分为搜索 Agent、执行 Agent、审核 Agent |
| **项目进一步模块化** | 把工具、运行时、存储、工作流继续拆分 |

### 12.3 当前阶段最重要的认识

**智能体的关键不在于“会聊天”，而在于“会在循环中观察、调用工具、更新状态、继续决策”。**

更接近真实场景的最小 Agent 公式可以概括为：

```text
模型调用 + 工具描述 + 工具分发 + 状态管理 + 循环控制 = 可持续推进任务的 Agent
```
