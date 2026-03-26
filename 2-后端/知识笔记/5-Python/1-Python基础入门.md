## 一、Python 概述

### 1.1 Python 是什么

**Python** 是一门**解释型、动态类型、通用型**编程语言，强调代码可读性和开发效率，既可以写脚本，也可以做后端开发、数据分析、自动化、AI 应用和工程工具。

**核心特点：** 用更少的代码表达更清晰的逻辑，把开发者的注意力更多放在业务和问题本身，而不是底层样板代码。

| 特性 | 说明 |
| ---- | ---- |
| **解释型** | 代码通常由解释器直接执行，不需要像 Java 那样先显式编译成字节码再运行 |
| **动态类型** | 变量在赋值时自动绑定类型，不需要先写类型声明 |
| **跨平台** | 同一份 Python 代码通常可以在 Windows、macOS、Linux 上运行 |
| **语法简洁** | 缩进代表代码块，语法接近自然语言，入门成本较低 |
| **生态丰富** | 标准库完善，第三方库覆盖 Web、数据、AI、测试、自动化等场景 |

### 1.2 Python 适合做什么

| 方向 | 常见用途 |
| ---- | -------- |
| **自动化脚本** | 文件处理、批量重命名、定时任务、运维脚本 |
| **后端开发** | Web API、管理后台、微服务、爬虫服务 |
| **数据分析** | 数据清洗、可视化、统计分析 |
| **AI 开发** | 机器学习、深度学习、LLM 应用、Agent、RAG |
| **测试工具** | 接口测试、自动化测试、测试辅助脚本 |

### 1.3 Python 的优势与局限

| 对比项 | Python 优势 | Python 局限 |
| ------ | ----------- | ----------- |
| **开发效率** | 语法简洁、库多、写得快 | 大型项目若缺规范，代码容易变松散 |
| **学习成本** | 入门友好，适合作为第一门脚本语言 | 深入后仍需理解对象模型、迭代器、装饰器、并发等概念 |
| **生态** | AI、数据、自动化生态极强 | 某些高性能场景或系统级开发不是强项 |
| **执行性能** | 足以覆盖大多数业务脚本和服务开发 | CPU 密集型场景通常不如 C/C++、Rust、Java |

> **注意**：Python 的优势在于“开发效率高”和“生态强”，而不是“原生执行速度快”。工程上要先判断问题类型，再决定是否选择 Python。

### 1.4 Python 解释器是什么

当我们编写 `.py` 文件时，真正负责执行这些代码的是 **Python 解释器**。

最常见的是 **CPython**，它是 Python 官方主流实现，绝大多数日常开发、教程和第三方库都默认基于它。

| 解释器 / 实现 | 说明 |
| ------------- | ---- |
| **CPython** | 官方主流实现，最常用 |
| **PyPy** | 兼容 Python 语法，某些场景下执行更快 |
| **Jython** | 运行在 JVM 上，主要用于 Java 生态集成 |
| **IronPython** | 面向 .NET 生态 |

**日常学习和项目开发，默认选择 CPython 即可。**

***

## 二、开发环境搭建

### 2.1 安装方案怎么选

参考课件里使用了 Anaconda + PyCharm，这条路线没有问题，但更适合“数据科学打包环境”场景。对一般 Python / AI 工程开发，更推荐下面这套判断方式：

| 场景 | 推荐方案 |
| ---- | -------- |
| **纯 Python 学习** | 官方 Python + `venv` |
| **日常项目开发** | 官方 Python + `venv` / `uv` |
| **数据分析、科学计算** | Anaconda / Miniconda |
| **IDE 开发体验** | VS Code 或 PyCharm |

> 💡 如果你的目标是做 AI Agent、LangChain、后端服务或自动化脚本，优先掌握 **官方 Python + 虚拟环境** 这一套，更通用。

### 2.2 Python 版本建议

| 场景 | 版本建议 |
| ---- | -------- |
| **新手学习** | **Python 3.11 或 3.12** |
| **兼容旧项目** | 按项目要求选择，常见为 **3.10~3.12** |
| **AI / 第三方库较多** | 先看依赖兼容范围，再确定版本 |

**经验原则：** 不要只追最新版本，也不要无脑坚持旧版本。项目依赖兼容性永远优先。

### 2.3 官方 Python + `venv` 安装流程

这是最通用、最值得优先掌握的环境搭建方式。

```bash
# 1. 查看是否已安装 Python 3
python3 --version

# 2. 创建项目目录
mkdir python-demo
cd python-demo

# 3. 创建虚拟环境
python3 -m venv .venv

# 4. 激活虚拟环境
# macOS / Linux
source .venv/bin/activate

# Windows PowerShell
# .venv\Scripts\Activate.ps1

# 5. 升级 pip
python -m pip install -U pip

# 6. 安装依赖
pip install requests
```

| 命令 | 作用 |
| ---- | ---- |
| `python3 -m venv .venv` | 创建独立虚拟环境 |
| `source .venv/bin/activate` | 激活当前虚拟环境 |
| `python -m pip install -U pip` | 升级当前环境里的 pip |
| `deactivate` | 退出虚拟环境 |

### 2.4 为什么要用虚拟环境

**虚拟环境** 的作用是给每个项目隔离依赖，避免“这个项目需要 A 版本、另一个项目需要 B 版本”时相互污染。

| 不使用虚拟环境的问题 | 使用虚拟环境后的收益 |
| -------------------- | -------------------- |
| 全局包版本冲突 | 每个项目依赖独立 |
| 难以复现别人的环境 | 可通过 `requirements.txt` 或锁文件复现 |
| 卸载包容易误伤其他项目 | 项目生命周期更可控 |

### 2.5 Anaconda / Miniconda 什么时候用

如果你主要做数据分析、Jupyter、科学计算，或者需要大量二进制依赖库，那么 `conda` 依然是很好用的方案。

```bash
# 创建 conda 环境
conda create -n py311-demo python=3.11

# 激活环境
conda activate py311-demo

# 安装依赖
pip install requests
```

| 方案 | 特点 | 适用场景 |
| ---- | ---- | -------- |
| **`venv`** | Python 官方自带，轻量、通用 | 大多数开发项目 |
| **Conda** | 环境和二进制包管理更强 | 数据分析、科学计算 |

### 2.6 IDE 如何选择

| 工具 | 特点 | 适用场景 |
| ---- | ---- | -------- |
| **VS Code** | 轻量、插件生态好、适合工程化开发 | 日常主力开发 |
| **PyCharm** | Python IDE 功能完整，调试与导航体验强 | 重度 Python 开发 |

无论使用哪种 IDE，最关键的都不是“装软件”，而是 **把项目解释器指向正确的虚拟环境**。

> **注意**：很多“代码没问题但运行报找不到包”的根因，不是语法错误，而是 IDE 选错了解释器。

***

## 三、基础语法与代码规范

### 3.1 Python 为什么强调缩进

**Python 使用缩进表示代码块**，不像 Java、C 那样依赖大括号 `{}`。

```python
def check_score(score):
    if score >= 60:
        print("及格")
        print("继续下一步")
    print("函数执行结束")
```

```python
def check_score(score):
    if score >= 60:
    print("及格")      # ❌ 缩进错误
        print("继续下一步")
```

| 规范 | 说明 |
| ---- | ---- |
| **4 个空格缩进** | Python 社区最通用写法 |
| **同一层级缩进必须一致** | 不能一会儿 2 个空格，一会儿 4 个空格 |
| **不要混用 Tab 和空格** | 容易导致不可见的缩进错误 |

### 3.2 常见基础规范

| 规范 | 推荐做法 |
| ---- | -------- |
| **行尾不要写分号** | Python 一般一条语句占一行 |
| **避免行尾多余空格** | 便于排查格式问题 |
| **注释写清楚意图** | 注释解释“为什么”，而不是重复代码表面意思 |
| **命名见名知意** | 变量、函数名尽量表达业务含义 |

```python
# ✅ 推荐
user_name = "alice"

# ❌ 不推荐
userName = "alice";
```

### 3.3 注释与文档字符串

| 类型 | 写法 | 用途 |
| ---- | ---- | ---- |
| **单行注释** | `# 注释内容` | 解释某一行或某几行代码 |
| **文档字符串** | `"""说明"""` | 给模块、类、函数写说明 |

```python
def add(a, b):
    """返回两个数字之和。"""
    return a + b
```

> **注意**：三引号字符串既可以表示多行字符串，也经常用作 docstring。工程实践里，函数/类说明优先写成 docstring。

***

## 四、变量与类型系统

### 4.1 变量是什么

**变量** 是程序运行过程中对某个值的一个名字绑定。Python 中变量本质上是“名字绑定到对象”，而不是“固定类型的盒子”。

```python
name = "张三"
age = 18
price = 19.9
```

| 组成部分 | 说明 |
| -------- | ---- |
| **变量名** | 左侧名字，用来引用值 |
| **赋值符号 `=`** | 把右侧结果绑定给左侧名字 |
| **变量值** | 右侧对象，可以是数字、字符串、列表等 |

### 4.2 Python 变量的特点

| 特点 | 说明 |
| ---- | ---- |
| **先赋值再使用** | 未赋值直接访问会报 `NameError` |
| **动态类型** | 同一变量名后续可以绑定到不同类型对象 |
| **名字绑定对象** | 多个变量名可能指向同一个对象 |

```python
a = 10
a = "hello"
print(a)  # hello
```

```python
items = [1, 2, 3]
backup = items
backup.append(4)

print(items)   # [1, 2, 3, 4]
print(backup)  # [1, 2, 3, 4]
```

### 4.3 常量怎么表示

Python 没有真正意义上的语法级常量，工程里通常用 **全大写变量名** 表示“约定上不要修改”。

```python
BASE_URL = "https://api.example.com"
MAX_RETRY = 3
```

### 4.4 常见数据类型总览

| 分类 | 类型 | 示例 |
| ---- | ---- | ---- |
| **数值类型** | `int`、`float`、`complex`、`bool` | `10`、`3.14`、`1+2j`、`True` |
| **字符串** | `str` | `"hello"` |
| **序列类型** | `list`、`tuple` | `[1, 2]`、`(1, 2)` |
| **集合类型** | `set` | `{1, 2, 3}` |
| **映射类型** | `dict` | `{"name": "zs"}` |
| **特殊值** | `None` | `None` |

### 4.5 怎么查看类型

```python
value = 3.14

print(type(value))          # <class 'float'>
print(isinstance(value, float))  # True
```

| 方法 | 作用 |
| ---- | ---- |
| `type(obj)` | 查看对象的直接类型 |
| `isinstance(obj, T)` | 判断对象是否属于某种类型或其子类，工程中更常用 |

***

## 五、数值与布尔类型

### 5.1 整数 `int`

Python 的整数没有 Java `int` 那种固定 32 位上限概念，能表示很大的整数。

```python
count = 10
big_number = 1_000_000_000_000

print(count)
print(big_number)
```

> 💡 大数字中可以写下划线 `_` 提高可读性，解释器会自动忽略它。

### 5.2 浮点数 `float`

浮点数用于表示带小数的数值，但二进制浮点表示会带来精度误差。

```python
print(0.1 + 0.2)  # 0.30000000000000004
```

如果场景对精度敏感，比如金额计算，应该优先使用 `Decimal`。

```python
from decimal import Decimal

price1 = Decimal("0.1")
price2 = Decimal("0.2")

print(price1 + price2)  # 0.3
```

| 场景 | 推荐类型 |
| ---- | -------- |
| **普通科学计算** | `float` |
| **金额、精度敏感计算** | `Decimal` |

### 5.3 布尔 `bool`

布尔值只有两个：`True` 和 `False`，常用于条件判断。

```python
is_admin = True
is_deleted = False

if is_admin:
    print("允许访问")
```

Python 里 `bool` 是 `int` 的子类，因此它和数字存在一定兼容关系：

```python
print(True + 1)   # 2
print(False + 1)  # 1
```

### 5.4 `==` 和 `is` 的区别

| 运算符 | 比较内容 | 典型用途 |
| ------ | -------- | -------- |
| **`==`** | 值是否相等 | 比较内容 |
| **`is`** | 是否是同一个对象 | 比较身份 |

```python
a = [1, 2, 3]
b = a
c = [1, 2, 3]

print(a == c)  # True
print(a is c)  # False
print(a is b)  # True
```

> **注意**：判断是否为 `None` 时，推荐写 `is None` 或 `is not None`，不要写 `== None`。

### 5.5 Python 中的假值

在布尔上下文里，不只有 `False` 会被当作假值。

| 假值示例 | 说明 |
| -------- | ---- |
| `False` | 布尔假 |
| `None` | 空值 |
| `0`、`0.0` | 数值零 |
| `""` | 空字符串 |
| `[]`、`()`、`{}`、`set()` | 空容器 |

```python
if not []:
    print("空列表会被当作假值")
```

***

## 六、字符串基础

### 6.1 字符串是什么

**字符串 `str`** 是由一系列字符组成的**有序不可变序列**，可以用单引号、双引号或三引号创建。

```python
title = "Python"
desc = '基础语法'
content = """这是一个
多行字符串"""
```

### 6.2 字符串的核心特点

| 特点 | 说明 |
| ---- | ---- |
| **有序** | 可以通过索引访问字符 |
| **不可变** | 不能直接修改某个位置上的字符 |
| **支持切片** | 可以按区间提取子串 |
| **支持常见文本方法** | 如 `split()`、`replace()`、`join()` |

```python
text = "hello"

# text[0] = "H"   # ❌ TypeError，字符串不可变
new_text = "H" + text[1:]
print(new_text)    # Hello
```

### 6.3 索引与切片

```python
text = "hello world"

print(text[0])     # h
print(text[-1])    # d
print(text[0:5])   # hello
print(text[6:])    # world
```

| 写法 | 含义 |
| ---- | ---- |
| `s[i]` | 取索引为 `i` 的字符 |
| `s[-1]` | 取最后一个字符 |
| `s[a:b]` | 取 `[a, b)` 区间的子串 |

### 6.4 拼接与重复

```python
prefix = "hello"
suffix = "python"

print(prefix + " " + suffix)  # hello python
print(prefix * 2)              # hellohello
```

> **注意**：字符串只能和字符串做 `+` 拼接，不能直接和整数拼接。

```python
age = 18

# print("年龄：" + age)   # ❌ TypeError
print("年龄：" + str(age))  # ✅ 正确
```

### 6.5 编码与解码

当字符串需要写入文件、走网络传输、转字节流时，往往需要编码和解码。

```python
message = "你好，中国"

raw = message.encode("utf-8")
text = raw.decode("utf-8")

print(raw)
print(text)
```

| 操作 | 含义 |
| ---- | ---- |
| `encode()` | `str -> bytes` |
| `decode()` | `bytes -> str` |

### 6.6 常用字符串方法

```python
text = "川菜,粤菜,湘菜"

items = text.split(",")
print(items)  # ['川菜', '粤菜', '湘菜']

print("-".join(items))
print(text.replace("粤菜", "苏菜"))
print(text.find("湘菜"))
```

| 方法 | 作用 |
| ---- | ---- |
| `split(sep)` | 按分隔符拆分字符串 |
| `join(iterable)` | 用指定连接符拼接多个字符串 |
| `replace(old, new)` | 替换字符串内容 |
| `find(sub)` | 查找子串位置，找不到返回 `-1` |
| `index(sub)` | 查找子串位置，找不到抛异常 |

### 6.7 `find()` 和 `index()` 的区别

| 方法 | 找到时 | 找不到时 |
| ---- | ------ | -------- |
| **`find()`** | 返回下标 | 返回 `-1` |
| **`index()`** | 返回下标 | 抛出异常 |

```python
text = "hello world"

print(text.find("python"))

try:
    print(text.index("python"))
except ValueError:
    print("子串不存在")
```