## 一、Jupyter 概述

### 1.1 什么是 Jupyter

**Jupyter Notebook** 是一个开源的交互式计算环境，支持在同一份文档中混合编写代码、说明文字、数学公式、图表和执行结果。

**核心思想：** 以 **Cell（单元格）** 为最小工作单元，把"实验过程"和"结论说明"放在一起。代码可以按块执行，输出结果直接展示在下方，特别适合探索式开发。

| 特点           | 说明                                                     |
| -------------- | -------------------------------------------------------- |
| **交互式执行** | 代码逐块运行，立即看到结果，适合试错与验证               |
| **文档化实验** | 代码、结论、图表放在同一个 Notebook 中，便于复盘         |
| **多语言支持** | 通过 Kernel 支持 Python、R、Julia、Scala 等              |
| **富文本输出** | 支持 Markdown、LaTeX、HTML、图像、表格、交互式小部件     |
| **共享方便**   | `.ipynb` 文件可直接分享，GitHub 可渲染预览               |
| **生态完善**   | 与 NumPy、Pandas、Matplotlib、PyTorch、LangChain 等配合良好 |

### 1.2 适用场景

| 场景             | 说明                                                   |
| ---------------- | ------------------------------------------------------ |
| **数据探索**     | 快速读取数据、查看分布、尝试清洗与特征处理             |
| **模型实验**     | 调参、观察训练曲线、对比不同方案的输出                 |
| **AI Agent 调试**| 分步验证 Prompt、工具调用、RAG 检索和中间结果          |
| **教学演示**     | 代码与讲解混排，适合课堂、分享、博客素材整理           |
| **原型验证**     | 在正式写成工程代码前，先用 Notebook 验证思路是否可行   |

### 1.3 Jupyter 生态

```text
    Jupyter Notebook（经典界面，单文档交互）
        ↓
    JupyterLab（新一代工作台，多标签、多面板）
        ↓
    JupyterHub（多用户部署，团队与教学场景）
        ↓
    Colab / Kaggle Notebooks（云端托管 Notebook）
        ↓
    VS Code + Jupyter（IDE 中直接编辑与运行 .ipynb）
```

| 产品                  | 定位                                   | 适用场景 |
| --------------------- | -------------------------------------- | -------- |
| **Jupyter Notebook**  | 经典界面，轻量，专注单个 Notebook      | 快速实验、教学 |
| **JupyterLab**        | 更接近 IDE，支持文件树、终端、插件     | 日常主力环境 |
| **JupyterHub**        | 多用户统一管理                         | 团队、实验室、课程平台 |
| **Colab / Kaggle**    | 云端运行，无需本地安装                 | 临时实验、需要云端资源 |
| **VS Code + Jupyter** | 在 IDE 中编辑 Notebook 与 `.py` 文件   | 工程化开发、与代码仓库联动 |

### 1.4 Notebook 与脚本的区别

| 对比项         | Notebook                             | `.py` 脚本 / 工程代码 |
| -------------- | ------------------------------------ | --------------------- |
| **执行方式**   | 按 Cell 交互式执行                   | 从头到尾运行          |
| **调试节奏**   | 适合边试边改                         | 适合稳定逻辑与批处理  |
| **结果展示**   | 图表、表格、富文本原生支持           | 通常依赖日志、文件输出 |
| **可复现性**   | 容易受乱序执行影响                   | 通常更稳定、可测试     |
| **适合阶段**   | 探索、实验、验证                     | 封装、复用、上线       |

> 💡 Jupyter 适合"先把问题跑通"；脚本和工程代码适合"把方案沉淀下来并长期维护"。

***

## 二、安装与环境管理

### 2.1 安装方式

**推荐方式：** 在独立虚拟环境中安装 `jupyterlab` 和 `ipykernel`，避免污染全局 Python。

```bash
# 1. 创建虚拟环境
python3 -m venv .venv

# 2. 激活虚拟环境
source .venv/bin/activate

# 3. 安装 JupyterLab 与内核支持
python -m pip install -U pip
python -m pip install jupyterlab ipykernel

# 4. 启动
jupyter lab
```

| 安装项         | 作用                                   |
| -------------- | -------------------------------------- |
| `jupyterlab`   | JupyterLab 主程序，也可打开 Notebook   |
| `notebook`     | 经典 Notebook 界面                     |
| `ipykernel`    | 让当前 Python 环境可被 Jupyter 识别为 Kernel |

### 2.2 为项目注册独立 Kernel

同一台机器常常有多个 Python 环境。把项目环境注册成独立 Kernel 后，每个 Notebook 都能明确选择运行环境。

```bash
# 在目标虚拟环境中执行
python -m ipykernel install --user --name ai-agent-env --display-name "Python (ai-agent-env)"
```

| 参数                | 说明                                     |
| ------------------- | ---------------------------------------- |
| `--name`            | Kernel 内部标识，命令行与配置中使用      |
| `--display-name`    | Notebook 界面显示名称                    |

> **注意**：Notebook 中"代码能运行但包找不到"的常见原因，不是代码错，而是 **当前 Notebook 选错了 Kernel**。

### 2.3 启动与访问

```bash
# 启动 JupyterLab
jupyter lab

# 启动经典 Notebook
jupyter notebook

# 指定端口启动
jupyter lab --port 8889

# 允许远程访问时常见配置
jupyter lab --ip=0.0.0.0 --no-browser
```

首次启动通常会输出带 token 的访问地址，例如：

```text
http://localhost:8888/lab?token=xxxxxxxx
```

### 2.4 在 Notebook 中安装依赖

在 Notebook 里临时安装依赖时，优先使用 `%pip`，不要直接写 `!pip install ...`。

```python
# ✅ 推荐：安装到当前 Kernel 对应的 Python 环境
%pip install pandas matplotlib seaborn

# ❌ 不推荐：可能装到别的 Python 环境
!pip install pandas matplotlib seaborn
```

| 方式         | 说明                                         |
| ------------ | -------------------------------------------- |
| **`%pip`**   | 由 IPython 管理，通常能准确安装到当前 Kernel |
| **`!pip`**   | 走 Shell 命令，容易和当前 Kernel 环境不一致  |

***

## 三、核心概念

### 3.1 Notebook 文件结构

`.ipynb` 本质是 JSON 文件，除了代码本身，还会保存输出结果和元数据。

```text
    .ipynb 文件
        │
        ├── metadata（Kernel、语言、界面配置）
        │
        ├── cells（按顺序存放的单元格）
        │       ├── cell_type（code / markdown / raw）
        │       ├── source（源码或文本内容）
        │       ├── execution_count（执行序号）
        │       └── outputs（输出内容、图像、报错信息）
        │
        └── nbformat（Notebook 格式版本）
```

> **注意**：`.ipynb` 不只是"代码文件"，它还会把输出一并写入文件，所以体积可能比想象中大很多。

### 3.2 三种 Cell

| Cell 类型            | 用途                                   | 是否执行 |
| -------------------- | -------------------------------------- | -------- |
| **Code Cell**        | 写 Python / R / Julia 等可执行代码     | 是       |
| **Markdown Cell**    | 写标题、说明、公式、列表、图片         | 否       |
| **Raw Cell**         | 原始文本，不参与执行和 Markdown 渲染   | 否       |

**推荐做法：**

| 场景                 | 更合适的 Cell 类型 |
| -------------------- | ------------------ |
| **解释实验目的**     | Markdown Cell      |
| **执行代码**         | Code Cell          |
| **记录中间结论**     | Markdown Cell      |
| **临时保留原始文本** | Raw Cell           |

### 3.3 Kernel（内核）

**Kernel** 是 Notebook 背后独立运行的解释器进程，负责执行代码并维护会话状态。变量、导入的模块、模型对象都会保存在当前 Kernel 中。

| 操作           | 说明                                               |
| -------------- | -------------------------------------------------- |
| **Interrupt**  | 中断当前运行中的代码，如死循环或超长推理           |
| **Restart**    | 重启 Kernel，清空变量和运行状态                    |
| **Shutdown**   | 彻底关闭当前 Kernel                                |
| **Reconnect**  | 前端断开后重新连接现有 Kernel                      |

> **注意**：Kernel 是"状态容器"。只要不重启，前面运行过的变量就会一直存在，即使对应代码已经被删掉。

### 3.4 执行顺序与状态

Cell 左侧的 `In [n]` 显示执行序号，`n` 是全局递增计数器，不代表代码在文档中的位置。

| 标记         | 含义                         |
| ------------ | ---------------------------- |
| `In [ ]`     | 尚未执行                     |
| `In [*]`     | 正在执行                     |
| `In [3]`     | 这是当前 Kernel 的第 3 次执行 |

```python
a = 10
```

```python
print(a)
```

```python
del a
```

如果第 2 个 Cell 在第 3 个 Cell 之后再次运行，就会报 `NameError`。问题不在代码位置，而在 **Kernel 当前状态**。

> 💡 结果异常、变量莫名其妙存在或消失时，最稳妥的处理方式通常是 **Restart Kernel + Run All**。

***

## 四、基本操作与快捷键

### 4.1 两种模式

Jupyter 的交互分为 **命令模式** 和 **编辑模式**。

| 模式         | 进入方式 | 典型用途                       |
| ------------ | -------- | ------------------------------ |
| **命令模式** | `Esc`    | 选择、移动、增删、切换 Cell 类型 |
| **编辑模式** | `Enter`  | 编辑当前 Cell 内容             |

### 4.2 常用快捷键

**命令模式：**

| 快捷键       | 操作                         |
| ------------ | ---------------------------- |
| `A`          | 在当前 Cell 上方插入新 Cell  |
| `B`          | 在当前 Cell 下方插入新 Cell  |
| `D D`        | 删除当前 Cell                |
| `Z`          | 撤销删除                     |
| `M`          | 切换为 Markdown Cell         |
| `Y`          | 切换为 Code Cell             |
| `Shift + M`  | 合并选中的 Cell              |
| `↑ / ↓`      | 在 Cell 之间移动             |

**编辑模式：**

| 快捷键           | 操作                               |
| ---------------- | ---------------------------------- |
| `Shift + Enter`  | 执行当前 Cell，移动到下一个        |
| `Ctrl + Enter`   | 执行当前 Cell，停留在当前          |
| `Alt + Enter`    | 执行当前 Cell，并在下方新建 Cell   |
| `Tab`            | 代码补全 / 缩进                    |
| `Shift + Tab`    | 查看函数签名与帮助                 |
| `Ctrl + /`       | 注释 / 取消注释                    |

### 4.3 Markdown 与公式

Markdown Cell 不只是写说明文字，也常用来整理实验过程与结论。

```markdown
## 实验目标

- 比较不同 Prompt 的输出差异
- 观察温度参数对回答稳定性的影响

公式示例：

$$
Precision = \frac{TP}{TP + FP}
$$
```

| 能力             | 说明                                 |
| ---------------- | ------------------------------------ |
| **标题与列表**   | 组织文档结构                         |
| **代码块**       | 展示示例代码而不执行                 |
| **LaTeX 公式**   | 展示数学表达式                       |
| **图片与链接**   | 记录实验截图、外部资料               |

***

## 五、Magic 命令与富输出

### 5.1 什么是 Magic 命令

**Magic 命令** 是 IPython 提供的扩展语法，以 `%` 或 `%%` 开头，用来完成计时、调试、切换目录、写文件、调用 Shell 等 Notebook 常见操作。

| 类型             | 形式   | 作用范围     |
| ---------------- | ------ | ------------ |
| **行魔法**       | `%cmd` | 当前这一行   |
| **单元格魔法**   | `%%cmd`| 当前整个 Cell |

### 5.2 常用 Magic 命令

```python
%pwd                         # 查看当前工作目录
%ls                          # 列出当前目录文件
%cd ./data                   # 切换工作目录

%time sum(range(100000))
%timeit sum(range(100000))   # 多次执行取平均耗时

%who                         # 查看当前变量名
%whos                        # 查看变量名、类型、简要值
%reset -f                    # 清空命名空间中的变量

%run demo.py                 # 运行外部 Python 脚本
%load demo.py                # 把脚本内容加载到当前 Cell

%matplotlib inline           # 图表内嵌显示
%matplotlib widget           # 交互式图表（需安装 ipympl）

%env API_BASE_URL=http://localhost:8000
%pip install openai pandas
```

| 命令                 | 用途                                   |
| -------------------- | -------------------------------------- |
| `%time`              | 单次执行耗时统计                       |
| `%timeit`            | 多次执行耗时统计，更适合性能对比       |
| `%who` / `%whos`     | 查看当前会话状态                       |
| `%run`               | 执行外部脚本并导入结果到当前命名空间   |
| `%reset -f`          | 清空变量，但不等于完整重启 Kernel      |
| `%pip install ...`   | 给当前 Kernel 安装依赖                 |

> **注意**：`%reset -f` 只清空变量命名空间，不会像 `Restart Kernel` 那样完全重建解释器进程。

### 5.3 单元格魔法

```python
%%timeit
result = [i ** 2 for i in range(10000)]
```

```python
%%bash
python --version
python -m pip show pandas
```

```python
%%writefile demo_utils.py
def hello(name: str) -> str:
    return f"hello, {name}"
```

```python
%%capture output
print("this line will be captured")
```

| 单元格魔法        | 用途                                     |
| ----------------- | ---------------------------------------- |
| `%%timeit`        | 对整个 Cell 做性能测试                   |
| `%%bash`          | 在 Cell 中执行 Shell 命令                |
| `%%writefile`     | 把 Cell 内容写入文件，便于后续模块化     |
| `%%capture`       | 捕获输出，避免日志刷屏                   |

### 5.4 富输出能力

Notebook 的优势不只是能执行代码，还能直接展示结构化结果。

```python
from IPython.display import Markdown, display
import pandas as pd

df = pd.DataFrame([
    {"question": "什么是 RAG？", "score": 0.93},
    {"question": "什么是 Agent？", "score": 0.88},
])

display(df)
display(Markdown("**当前实验结论：** 检索召回结果基本正常。"))
```

| 输出类型       | 典型用途                               |
| -------------- | -------------------------------------- |
| **DataFrame**  | 表格化查看数据                         |
| **图表**       | 分析趋势、分布、相关性                 |
| **Markdown**   | 在运行时输出格式化说明                 |
| **HTML / 图片**| 展示更丰富的可视化结果                 |

***

## 六、数据分析与实验常用写法

### 6.1 环境初始化

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

%matplotlib inline

plt.rcParams["figure.figsize"] = (10, 6)
plt.rcParams["font.sans-serif"] = ["SimHei"]   # 中文字体
plt.rcParams["axes.unicode_minus"] = False     # 负号正常显示

pd.set_option("display.max_columns", None)
pd.set_option("display.max_rows", 100)
pd.set_option("display.width", 120)
```

### 6.2 数据探索

```python
df = pd.read_csv("data.csv")

df.shape
df.dtypes
df.info()
df.describe(include="all")

df.head(5)
df.sample(5, random_state=42)

df.isnull().sum()
(df.isnull().sum() / len(df) * 100).sort_values(ascending=False)

df["category"].value_counts(dropna=False)
```

| 操作                 | 作用                         |
| -------------------- | ---------------------------- |
| `df.info()`          | 查看字段、非空数、类型       |
| `df.describe()`      | 查看统计分布                 |
| `df.isnull().sum()`  | 统计缺失值                   |
| `value_counts()`     | 查看类别分布                 |

### 6.3 可视化

```python
df["age"].hist(bins=30)
plt.title("年龄分布")
plt.show()

plt.scatter(df["x"], df["y"], alpha=0.5)
plt.xlabel("X")
plt.ylabel("Y")
plt.title("散点图")
plt.show()

sns.heatmap(df.corr(numeric_only=True), annot=True, fmt=".2f", cmap="coolwarm")
plt.title("相关性热力图")
plt.show()

df[["col1", "col2"]].boxplot()
plt.title("箱线图")
plt.show()
```

***

## 七、在 AI Agent 开发中的应用

### 7.1 为什么适合 AI Agent 开发

AI Agent 开发通常不是一次写完，而是"观察结果 -> 调整参数 -> 再运行"的循环。Jupyter 的交互式特性很适合这种工作方式。

| 场景                 | 说明                                                     |
| -------------------- | -------------------------------------------------------- |
| **Prompt 调试**      | 修改系统提示词、Few-shot 示例、温度参数，立即看输出差异 |
| **模型对比**         | 同一问题对比不同模型、不同参数、不同供应商               |
| **RAG 验证**         | 分步检查文档加载、切分、Embedding、检索结果             |
| **工具调用调试**     | 打印工具输入、输出、异常信息，定位 Agent 行为问题       |
| **评测实验**         | 批量跑测试集，统计准确率、耗时、成本                     |

### 7.2 Prompt 与模型调用调试

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一名技术助手，回答要准确、简洁。"),
    ("human", "{question}")
])

chain = prompt | llm

for question in [
    "什么是 RAG？",
    "什么是 Tool Calling？"
]:
    result = chain.invoke({"question": question})
    print(f"Q: {question}")
    print(f"A: {result.content}")
    print("-" * 40)
```

**适合观察的指标：**

| 指标           | 说明                                 |
| -------------- | ------------------------------------ |
| **回答质量**   | 是否准确、是否跑题、是否过度编造     |
| **稳定性**     | 多次运行结果是否一致                 |
| **耗时**       | 模型响应是否满足业务要求             |
| **成本**       | 是否需要批量、缓存、降级模型         |

### 7.3 RAG 流程分步验证

```python
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

loader = TextLoader("docs/knowledge.txt", encoding="utf-8")
docs = loader.load()
print(f"文档数: {len(docs)}")
print(docs[0].page_content[:120])
```

```python
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

chunks = splitter.split_documents(docs)
print(f"切分后 chunk 数: {len(chunks)}")
print(chunks[0].page_content[:200])
```

```python
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(chunks, embeddings)

query = "如何配置记忆模块？"
results = vectorstore.similarity_search(query, k=3)

for index, doc in enumerate(results, start=1):
    print(f"--- 检索结果 {index} ---")
    print(doc.page_content[:200])
    print()
```

| 分步检查点         | 要看什么                                               |
| ------------------ | ------------------------------------------------------ |
| **文档加载**       | 是否读到了正确内容，编码是否正常                       |
| **文档切分**       | chunk 是否过大或过碎，语义是否被切断                   |
| **向量化**         | 是否成功写入向量库，Embedding 模型是否一致             |
| **检索结果**       | Top-K 是否相关，是否存在明显噪声                       |

> 💡 RAG 最容易排查的方式不是一次性跑完整链路，而是把每一步拆成独立 Cell，逐步打印中间结果。

### 7.4 工具调用与中间结果调试

```python
def search_docs(keyword: str) -> str:
    print(f"[tool] search_docs keyword={keyword}")
    return f"找到与 {keyword} 相关的 3 条文档"

question = "查一下向量数据库的资料"

tool_result = search_docs("向量数据库")
print("[tool result]", tool_result)
print("[final answer]", f"已根据工具结果回答：{tool_result}")
```

| 调试点             | 说明                                   |
| ------------------ | -------------------------------------- |
| **工具入参**       | Agent 传给工具的参数是否正确           |
| **工具返回值**     | 返回格式是否符合预期                   |
| **异常信息**       | 网络失败、鉴权失败、超时等是否可见     |
| **中间状态**       | 是否能判断问题出在模型还是工具层       |

### 7.5 评测与批量实验

```python
test_cases = [
    {"question": "什么是 Embedding？", "expected_keyword": "向量"},
    {"question": "什么是 Agent？", "expected_keyword": "工具"},
]

rows = []
for case in test_cases:
    answer = llm.invoke(case["question"]).content
    passed = case["expected_keyword"] in answer
    rows.append({
        "question": case["question"],
        "passed": passed,
        "answer": answer[:80]
    })

pd.DataFrame(rows)
```

Notebook 很适合先做轻量评测。规则稳定后，再迁移到正式评测脚本或平台。

***

## 八、最佳实践

### 8.1 Notebook 组织规范

| 规范                 | 说明                                                     |
| -------------------- | -------------------------------------------------------- |
| **顶部环境 Cell**    | 第一段统一导入依赖、设置参数、初始化客户端               |
| **Cell 职责单一**    | 一个 Cell 只做一件事，便于重跑和定位错误                 |
| **Markdown 分节**    | 用标题和结论说明实验过程，降低"只有代码没有语境"的问题  |
| **中间结果可见**     | 关键步骤打印输入、输出、耗时和样本                       |
| **避免超长 Cell**    | 逻辑过长时拆分，保证每段结果都可单独验证                 |

### 8.2 环境与可复现性

| 做法                       | 说明                                               |
| -------------------------- | -------------------------------------------------- |
| **固定依赖版本**           | 使用 `requirements.txt` 或 `pyproject.toml`        |
| **固定随机种子**           | 减少实验结果波动                                   |
| **明确数据来源**           | 记录输入文件路径、数据版本、模型版本               |
| **一个项目一个 Kernel**    | 避免多个项目共用同一环境导致依赖冲突               |

```python
import random
import numpy as np

random.seed(42)
np.random.seed(42)
```

### 8.3 版本控制与输出管理

`.ipynb` 会把输出、图表和执行顺序一起写入文件，直接提交到 Git 时容易产生大量 diff 噪音。

```bash
python -m pip install nbstripout
nbstripout --install
```

| 处理方式                 | 作用                                   |
| ------------------------ | -------------------------------------- |
| **清空输出后提交**       | 减小文件体积，减少无意义 diff           |
| **使用 `nbstripout`**    | 提交前自动移除输出                     |
| **重要逻辑迁移到 `.py`** | 降低 Notebook 体积，提高复用性         |

### 8.4 何时从 Notebook 迁移到工程代码

| 信号                         | 说明                                     |
| ---------------------------- | ---------------------------------------- |
| **代码开始重复复制粘贴**     | 说明需要抽函数、抽模块                   |
| **Notebook 超过几十个 Cell** | 结构开始失控，不利于维护                 |
| **需要单元测试**             | 应迁移到 `.py` 文件中编写可测试逻辑      |
| **需要上线服务**             | 应整理成脚本、包、API 服务或工作流代码   |

**推荐做法：**

```text
    Notebook 做探索与验证
        ↓
    把稳定逻辑提炼到 .py 模块
        ↓
    Notebook 只负责调用模块、展示实验结果
        ↓
    最终沉淀到正式工程
```

### 8.5 常见问题

| 问题                         | 常见原因                                 | 解决方案 |
| ---------------------------- | ---------------------------------------- | -------- |
| **`NameError`**              | Cell 未按预期顺序执行                    | Restart Kernel + Run All |
| **导入失败**                 | 选错 Kernel，或依赖装到了别的环境        | 检查 Kernel，优先用 `%pip install` |
| **图表不显示**               | Matplotlib 后端未配置                    | 执行 `%matplotlib inline` |
| **Notebook 很卡**            | 输出过大、对象过大、图像过多             | 清理输出，拆分数据，减少一次性展示 |
| **Kernel 崩溃**              | 内存不足、模型过大、死循环               | 中断执行、分批处理、使用更大资源 |
| **Git diff 很乱**            | 输出结果被写入 `.ipynb`                  | 清理输出或使用 `nbstripout` |
