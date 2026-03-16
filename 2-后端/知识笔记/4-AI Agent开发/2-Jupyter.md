## 一、Jupyter 概述

### 1.1 什么是 Jupyter

**Jupyter Notebook** 是一个开源的交互式计算环境，支持在浏览器中将代码、文本说明、数学公式、可视化图表混合编写并实时执行。

**核心思想：** 以"单元格（Cell）"为单位组织代码与文档，每个单元格可独立运行，结果即时展示在代码下方，适合数据探索、模型调试和教学演示。

| 特点               | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| **交互式执行**     | 代码逐块运行，立即看到输出，无需完整运行整个脚本             |
| **多语言支持**     | 通过 Kernel 支持 Python、R、Julia、Scala 等                  |
| **富文本输出**     | 支持 Markdown、LaTeX、HTML、图表等多种输出格式               |
| **可共享**         | `.ipynb` 文件可直接分享，GitHub 自动渲染预览                 |
| **生态丰富**       | 与 NumPy、Pandas、Matplotlib、PyTorch 等深度集成             |

### 1.2 Jupyter 生态

```
    Jupyter Notebook（经典版，.ipynb）
        ↓
    JupyterLab（新一代 IDE，多标签、插件丰富）
        ↓
    JupyterHub（多用户服务器，团队/教学场景）
        ↓
    Google Colab / Kaggle Notebooks（云端托管，免费 GPU）
```

| 产品                  | 特点                                           |
| --------------------- | ---------------------------------------------- |
| **Jupyter Notebook**  | 单文件界面，轻量，适合快速实验                 |
| **JupyterLab**        | 多面板 IDE，支持文件浏览、终端、插件扩展       |
| **Google Colab**      | 免安装，免费 T4 GPU，适合深度学习              |
| **VS Code + Jupyter** | 在 VS Code 中直接打开 `.ipynb`，体验更接近 IDE |

### 1.3 安装

```bash
# 安装 JupyterLab（推荐，包含 Notebook）
pip install jupyterlab

# 仅安装经典 Notebook
pip install notebook

# 启动
jupyter lab        # 启动 JupyterLab
jupyter notebook   # 启动经典 Notebook
```

> 💡 启动后浏览器自动打开 `http://localhost:8888`，首次运行会生成 token 作为访问凭证。

***

## 二、核心概念

### 2.1 Notebook 文件结构

`.ipynb` 本质是 JSON 文件，由一组有序的 Cell 构成：

```
    .ipynb 文件
        │
        ├── metadata（内核信息、语言版本）
        │
        └── cells（单元格列表）
                ├── Code Cell（代码单元格）
                ├── Markdown Cell（文档单元格）
                └── Raw Cell（原始内容，不执行）
```

### 2.2 Kernel（内核）

**Kernel** 是 Notebook 背后独立运行的计算进程，负责执行代码并返回结果。每个 Notebook 连接一个 Kernel，Kernel 维护完整的变量状态。

| 操作           | 说明                                               |
| -------------- | -------------------------------------------------- |
| **Restart**    | 重启 Kernel，清空所有变量，适合重新从头执行        |
| **Interrupt**  | 中断当前执行（如死循环、长时间训练）               |
| **Reconnect**  | 重连已断开的 Kernel（如网络中断后）                |

> **注意**：Kernel 重启后，所有已定义的变量、导入的模块全部清空，需重新执行相关 Cell。

### 2.3 执行顺序与状态

Cell 左侧的 `In [n]:` 标记执行顺序，`n` 是全局递增计数器：

| 标记         | 含义                         |
| ------------ | ---------------------------- |
| `In [ ]`     | 未执行                       |
| `In [*]`     | 正在执行                     |
| `In [3]`     | 已执行，是第 3 次执行的 Cell |

> 💡 Notebook 允许乱序执行 Cell，但变量状态依赖执行顺序而非 Cell 位置。若结果异常，优先检查 Cell 执行顺序，或使用 **Restart & Run All** 重置。

***

## 三、快捷键与操作

### 3.1 两种模式

Jupyter 有两种编辑模式，通过 Cell 边框颜色区分：

| 模式             | 边框颜色 | 进入方式       | 说明                           |
| ---------------- | -------- | -------------- | ------------------------------ |
| **命令模式**     | 蓝色     | `Esc`          | 操作 Cell 本身（移动、增删等） |
| **编辑模式**     | 绿色     | `Enter`        | 编辑 Cell 内容                 |

### 3.2 常用快捷键

**命令模式（蓝色边框）：**

| 快捷键       | 操作                         |
| ------------ | ---------------------------- |
| `A`          | 在当前 Cell 上方插入新 Cell  |
| `B`          | 在当前 Cell 下方插入新 Cell  |
| `D D`        | 删除当前 Cell（连按两次 D）  |
| `Z`          | 撤销删除                     |
| `M`          | 将 Cell 切换为 Markdown 类型 |
| `Y`          | 将 Cell 切换为 Code 类型     |
| `Shift + ↑/↓` | 多选 Cell                   |
| `Shift + M`  | 合并选中的 Cell              |

**编辑模式（绿色边框）：**

| 快捷键              | 操作                            |
| ------------------- | ------------------------------- |
| `Shift + Enter`     | 执行当前 Cell，移动到下一个     |
| `Ctrl + Enter`      | 执行当前 Cell，停留在当前       |
| `Alt + Enter`       | 执行当前 Cell，在下方插入新 Cell |
| `Tab`               | 代码补全 / 缩进                 |
| `Shift + Tab`       | 查看函数签名（光标在函数名上）  |
| `Ctrl + /`          | 注释/取消注释                   |
| `Ctrl + Z`          | 撤销                            |

***

## 四、Magic 命令

### 4.1 什么是 Magic 命令

**Magic 命令**是 IPython 内核提供的特殊指令，以 `%`（行魔法）或 `%%`（单元格魔法）开头，用于控制执行环境、计时、调试等。

### 4.2 常用 Magic 命令

**行魔法（`%`，作用于单行）：**

```python
%timeit sum(range(1000))        # 多次运行取平均耗时
%time sum(range(1000))          # 单次运行耗时

%run script.py                  # 在 Notebook 中运行外部 .py 文件
%load script.py                 # 将 .py 文件内容加载到 Cell

%who                            # 列出当前所有变量
%whos                           # 列出变量及其类型和值
%reset                          # 清空所有变量（等同于 Restart Kernel）

%matplotlib inline              # 图表内嵌显示（Matplotlib 标准配置）
%matplotlib widget              # 交互式图表（需安装 ipympl）

%env                            # 查看环境变量
%env MY_KEY=value               # 设置环境变量
```

**单元格魔法（`%%`，作用于整个 Cell）：**

```python
%%timeit
# 对整个 Cell 计时
result = [i**2 for i in range(10000)]

%%bash
# 在 Cell 中执行 Shell 命令
ls -la
pip list | grep torch

%%writefile demo.py
# 将 Cell 内容写入文件
def hello():
    print("Hello, World!")

%%capture output
# 捕获 Cell 的所有输出（不显示，存入变量 output）
import warnings
warnings.warn("test warning")
```

| Magic 命令         | 用途                                 |
| ------------------ | ------------------------------------ |
| `%timeit` / `%%timeit` | 性能测试，自动多次运行取均值     |
| `%run`             | 运行外部脚本，变量导入当前命名空间   |
| `%matplotlib inline` | 图表内嵌，AI/数据分析必备配置      |
| `%%bash`           | Cell 内执行 Shell，安装包、操作文件  |
| `%%writefile`      | 快速生成 `.py` 文件，便于模块化      |

***

## 五、数据分析常用操作

### 5.1 环境初始化

AI/数据分析 Notebook 的标准开头 Cell：

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

%matplotlib inline
plt.rcParams['figure.figsize'] = (10, 6)
plt.rcParams['font.sans-serif'] = ['SimHei']   # 中文显示
plt.rcParams['axes.unicode_minus'] = False      # 负号正常显示

pd.set_option('display.max_columns', None)      # 显示所有列
pd.set_option('display.max_rows', 100)
```

### 5.2 数据探索

```python
df = pd.read_csv('data.csv')

# 基础信息
df.shape           # (行数, 列数)
df.dtypes          # 各列数据类型
df.info()          # 列名、非空数量、类型
df.describe()      # 数值列统计（均值、标准差、分位数）

# 缺失值
df.isnull().sum()                    # 各列缺失数量
df.isnull().sum() / len(df) * 100    # 缺失率（%）

# 查看样本
df.head(5)         # 前 5 行
df.sample(5)       # 随机 5 行
df['col'].value_counts()             # 某列的值频次统计
```

### 5.3 可视化

```python
# 直方图：查看数值分布
df['age'].hist(bins=30)
plt.title('年龄分布')
plt.show()

# 散点图：查看两变量关系
plt.scatter(df['x'], df['y'], alpha=0.5)
plt.xlabel('X 轴')
plt.ylabel('Y 轴')
plt.show()

# 热力图：查看相关性矩阵
sns.heatmap(df.corr(), annot=True, fmt='.2f', cmap='coolwarm')
plt.show()

# 箱线图：查看分布与异常值
df[['col1', 'col2']].boxplot()
plt.show()
```

***

## 六、在 AI Agent 开发中的应用

### 6.1 典型使用场景

| 场景                   | 说明                                                         |
| ---------------------- | ------------------------------------------------------------ |
| **Prompt 调试**        | 逐步调整 Prompt，实时观察 LLM 输出变化                       |
| **RAG 流程验证**       | 分步执行文档加载 → 切分 → 向量化 → 检索，逐步验证每一步结果 |
| **模型评估**           | 批量跑测试集，统计准确率、延迟，绘制对比图表                 |
| **数据预处理**         | 清洗训练数据、标注样本、构建 Few-shot 示例集                 |
| **Agent 调试**         | 单步执行 Agent 工具调用链，检查中间推理步骤                  |

### 6.2 LangChain + Jupyter 调试示例

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Cell 1：测试基础调用
response = llm.invoke("用一句话解释 RAG")
print(response.content)
```

```python
# Cell 2：调试 Prompt 模板
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个专业的技术助手，回答简洁准确。"),
    ("human", "{question}")
])

chain = prompt | llm

# 逐步测试不同问题
for q in ["什么是 Embedding？", "向量数据库有哪些？"]:
    result = chain.invoke({"question": q})
    print(f"Q: {q}")
    print(f"A: {result.content}\n")
```

```python
# Cell 3：流式输出调试
for chunk in llm.stream("列举 5 个常用的向量数据库"):
    print(chunk.content, end="", flush=True)
```

### 6.3 RAG 流程分步验证

```python
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

# Step 1：加载文档
loader = TextLoader("docs/knowledge.txt", encoding="utf-8")
docs = loader.load()
print(f"加载文档数：{len(docs)}，字符数：{len(docs[0].page_content)}")
```

```python
# Step 2：切分文档
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)
print(f"切分后 chunk 数：{len(chunks)}")
print(f"第一个 chunk 预览：\n{chunks[0].page_content[:200]}")
```

```python
# Step 3：向量化并存储
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(chunks, embeddings)
print("向量库构建完成")
```

```python
# Step 4：检索验证
query = "如何配置 LangChain 的记忆模块？"
results = vectorstore.similarity_search(query, k=3)
for i, doc in enumerate(results):
    print(f"--- 结果 {i+1} ---")
    print(doc.page_content[:200])
    print()
```

> 💡 将 RAG 流程拆分为多个 Cell 分步执行，每步打印中间结果，可快速定位是加载、切分、向量化还是检索环节出了问题。

***

## 七、最佳实践

### 7.1 Notebook 组织规范

| 规范                   | 说明                                                         |
| ---------------------- | ------------------------------------------------------------ |
| **顶部环境 Cell**      | 第一个 Cell 统一导入所有依赖，便于 Restart 后快速恢复        |
| **Markdown 分节**      | 用 Markdown Cell 添加标题和说明，增强可读性                  |
| **Cell 职责单一**      | 每个 Cell 只做一件事，便于单独重跑和调试                     |
| **及时清理输出**       | 提交代码前清空输出（Kernel → Restart & Clear Output），减小文件体积 |
| **版本控制**           | 使用 `nbstripout` 自动在 git commit 时清除输出，避免 diff 噪音 |

```bash
# 安装 nbstripout，自动清除 .ipynb 输出后再提交
pip install nbstripout
nbstripout --install   # 在当前 git 仓库启用
```

### 7.2 性能与调试技巧

```python
# 避免在循环中重复调用 LLM，先批量收集再处理
questions = ["问题1", "问题2", "问题3"]

# ❌ 低效：每次调用都等待
for q in questions:
    result = llm.invoke(q)

# ✅ 推荐：批量调用（LangChain 支持 batch）
results = llm.batch(questions)
```

```python
# 使用 tqdm 显示进度条（处理大批量数据时）
from tqdm.notebook import tqdm

for item in tqdm(dataset, desc="处理中"):
    process(item)
```

```python
# 缓存 LLM 调用结果，避免重复付费
from langchain.cache import SQLiteCache
from langchain.globals import set_llm_cache

set_llm_cache(SQLiteCache(database_path=".langchain_cache.db"))
# 相同输入的 LLM 调用将直接返回缓存结果
```

### 7.3 常见问题

| 问题                         | 原因                           | 解决方案                                   |
| ---------------------------- | ------------------------------ | ------------------------------------------ |
| 变量未定义 `NameError`       | Cell 未按顺序执行              | Restart & Run All，或检查 `In [n]` 顺序    |
| 图表不显示                   | 缺少 `%matplotlib inline`      | 在顶部 Cell 添加该魔法命令                 |
| 中文乱码                     | 字体未设置                     | 设置 `plt.rcParams['font.sans-serif']`     |
| Kernel 崩溃                  | 内存溢出（大数据集/大模型）    | 分批处理，或增大系统内存/使用云端 GPU      |
| `.ipynb` 文件 git diff 噪音  | 输出内容被提交                 | 安装 `nbstripout` 自动清除输出             |
