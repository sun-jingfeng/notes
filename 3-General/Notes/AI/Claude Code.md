# Claude Code

本文介绍 **Claude Code** 的定位、核心能力、使用方式、技术特性及与同类产品的对比，便于在 AI 编程助手中做选型与上手。

---

## 一、什么是 Claude Code

**Claude Code** 是 Anthropic 推出的 AI 驱动编码助手，以「代理」形式在开发流程中工作：可读取代码库、编辑文件、运行命令，并与终端、IDE、桌面应用和浏览器等环境集成，帮助构建功能、修复错误和自动化开发任务。

**核心价值**：理解整个代码库并跨多文件与工具执行多步任务，从「描述需求」到「改代码、跑命令、写提交/PR」在同一套引擎内完成，减少在编辑器与外部工具间反复切换。

| 维度         | 说明 |
| ------------ | ---- |
| **出品方**   | Anthropic |
| **形态**     | 受监督的编码代理（Agent），多步规划与执行 |
| **典型能力** | 读库、编辑、运行命令、写测试、修 Lint、解决合并冲突、创建提交与 PR |
| **界面**     | 终端 CLI、VS Code 扩展、桌面应用、网页（claude.ai/code）、JetBrains 插件 |

***

## 二、核心能力

### 2.1 代码库与文件操作

| 能力         | 说明 |
| ------------ | ---- |
| **读取代码库** | 理解项目结构，跨多个文件检索与推理 |
| **编辑文件**   | 按自然语言需求修改、新增、删除文件，并呈现内联差异供确认 |
| **运行命令**   | 在终端中执行命令（如安装依赖、跑测试、构建），结果回填以决定下一步 |

适合：实现一个小功能、修 bug、重构一片代码、按错误信息追踪并修复。

### 2.2 自动化开发任务

Claude Code 可接手繁琐、易拖延的重复工作：

| 场景             | 说明 |
| ---------------- | ---- |
| **编写测试**     | 为未覆盖的模块写测试并运行，失败时尝试修复 |
| **修复 Lint**    | 扫描项目中的 Lint 报错并批量修复 |
| **解决合并冲突** | 分析冲突内容并生成合并方案 |
| **更新依赖**     | 升级依赖版本并处理不兼容 |
| **发布说明**     | 根据变更生成发布说明或 PR 描述 |

终端示例：

```bash
# 为某模块写测试并运行、修失败
claude "write tests for the auth module, run them, and fix any failures"
```

### 2.3 Git 与协作

| 能力         | 说明 |
| ------------ | ---- |
| **暂存与提交** | 暂存更改并生成提交信息 |
| **分支与 PR**  | 创建分支、编写 PR 描述、打开拉取请求 |
| **CI 集成**    | 通过 GitHub Actions、GitLab CI/CD 等做自动代码审查、问题分类 |

```bash
claude "commit my changes with a descriptive message"
```

### 2.4 自定义与扩展

| 机制         | 说明 |
| ------------ | ---- |
| **CLAUDE.md** | 项目根目录的 Markdown 文件，每会话开始时读取，用于编码标准、架构决策、首选库、审查清单等 |
| **自动记忆** | 跨会话保存学习内容（如构建命令、调试结论），无需手写配置 |
| **Skills**   | 自定义命令（如 `/review-pr`、`/deploy-staging`），可团队共享、复现工作流 |
| **Hooks**    | 在 Claude Code 操作前后执行 shell（如每次编辑后格式化、提交前跑 Lint） |
| **MCP**      | 通过 Model Context Protocol 连接外部数据与工具（如 Google Drive、Jira、Slack、自定义 API） |
| **Agent SDK** | 使用 Python/TypeScript 构建由 Claude Code 工具驱动的自定义代理，完全控制编排与权限 |

***

## 三、使用方式

### 3.1 终端 CLI

在项目目录下运行 `claude` 即可在命令行中使用完整能力；支持管道、脚本与 CI 集成。

**安装方式：**

| 环境              | 命令 |
| ----------------- | ---- |
| **macOS / Linux / WSL** | `curl -fsSL https://claude.ai/install.sh \| bash` |
| **Windows PowerShell**  | `irm https://claude.ai/install.ps1 \| iex` |
| **Homebrew（macOS）**   | `brew install --cask claude-code` |
| **WinGet（Windows）**   | `winget install Anthropic.ClaudeCode` |

> **注意**：Windows 原生安装需先安装 [Git for Windows](https://git-scm.com/downloads/win)。Native 安装会后台自动更新；Homebrew / WinGet 需定期执行 `brew upgrade claude-code` 或 `winget upgrade Anthropic.ClaudeCode`。

**基本使用：**

```bash
cd your-project
claude
```

首次运行会提示登录。也可直接传任务描述：

```bash
claude "write tests for the auth module, run them, and fix any failures"
```

**管道与自动化示例：**

```bash
# 监控日志并在异常时通知
tail -f app.log | claude -p "Slack me if you see any anomalies"

# 在 CI 中翻译新字符串并提 PR
claude -p "translate new strings into French and raise a PR for review"

# 对变更文件做安全审查
git diff main --name-only | claude -p "review these changed files for security issues"
```

### 3.2 VS Code / Cursor

安装 **Claude Code** 扩展后，在编辑器内使用：内联差异、@ 提及、计划审查、对话历史。命令面板中搜索「Claude Code」并选择「在新标签页中打开」即可开始。

### 3.3 桌面应用

独立应用，不依赖 IDE 或终端：查看差异、并行多会话、安排定期任务、启动云会话。需从官网下载对应平台安装包，登录后使用「代码」标签；多数能力需 Claude 付费订阅。

### 3.4 网页版

在 [claude.ai/code](https://claude.ai/code) 使用，无需本地安装。适合：长时间任务在后台跑、处理本地没有的仓库、多任务并行，或在移动端（如 Claude iOS 应用）启动后通过 `/teleport` 拉回终端。

### 3.5 JetBrains

在 IntelliJ IDEA、PyCharm、WebStorm 等 IDE 中安装 Claude Code 插件，支持交互式差异与选择上下文共享。从 JetBrains Marketplace 搜索「Claude Code」安装并重启 IDE。

### 3.6 场景与入口选择

| 需求                         | 更合适的入口 |
| ---------------------------- | ------------ |
| 本地项目、习惯终端、要管道/CI | 终端 CLI     |
| 边写代码边让 AI 改、要看 diff | VS Code / Cursor / JetBrains |
| 不装环境、长任务、多设备切换 | 网页版 / 桌面应用 |
| 从 Slack 等触发任务、要 PR  | Slack 集成 + 桌面/网页 |
| 自定义编排与工具权限         | Agent SDK    |

***

## 四、技术特性与认证

### 4.1 模型与上下文

底层由 **Claude Opus / Sonnet** 等模型驱动；支持约 **200k token** 级上下文，便于处理大型代码库与多文件任务。

### 4.2 认证方式

多数界面需以下之一：

| 方式               | 说明 |
| ------------------ | ---- |
| **Claude 订阅**    | claude.com 付费订阅，用于网页、桌面及部分高级能力 |
| **Anthropic 控制台** | 开发者/团队账号，用于 API、配额与集成 |
| **第三方提供商**   | 如 Azure、Google Vertex AI、Amazon Bedrock 等；终端 CLI 与 VS Code 支持配置为使用这些后端 |

> 💡 具体额度与定价以官网与控制台为准，会随产品更新调整。

### 4.3 多界面一致

所有界面共用同一套 Claude Code 引擎：**CLAUDE.md**、设置与 **MCP** 服务器在各端通用，会话可在终端、桌面、网页之间迁移（如用 `/desktop` 交给桌面看 diff，用 `/teleport` 把网页任务拉回终端）。

***

## 五、与 Cursor、Copilot 的对比

| 对比项       | Claude Code              | Cursor                    | GitHub Copilot        |
| ------------ | ------------------------- | ------------------------- | ---------------------- |
| **出品方**   | Anthropic                 | Cursor 公司（基于 VS Code）| GitHub / 微软          |
| **定位**     | 独立编码代理，多端一致    | AI 代码编辑器（VS Code + AI） | IDE 内补全 + Chat + Agent |
| **模型**     | Claude 系列               | 多模型（OpenAI、Anthropic 等） | 以 OpenAI 等为主      |
| **多端**     | CLI、VS Code、桌面、网页、JetBrains 统一引擎 | 以 Cursor 客户端为主      | 以 IDE 插件为主        |
| **项目级约定** | CLAUDE.md + Skills + Hooks | Rules + Skills + MCP      | 项目/组织设置          |
| **CI/协作**  | GitHub Actions、GitLab、Slack 等集成 | 侧重本地与 MCP            | PR 审查、Agent 等      |

选型时可简单归纳：需要「多环境同一套配置、强 CLI/管道/CI、官方 Claude 模型」可重点看 Claude Code；需要「单 IDE 内多模型与代码库检索」可看 Cursor；已在 GitHub/微软生态内可看 Copilot。

***

## 六、使用建议

| 场景                     | 建议 |
| ------------------------ | ---- |
| **单次任务（修 bug、写测试、小功能）** | 终端 `claude "任务描述"` 或对应 IDE 内打开 Claude Code |
| **跨文件重构、大功能**   | 在 IDE 或桌面中操作，便于查看差异与多步结果 |
| **团队规范与可复现流程** | 维护项目根目录 **CLAUDE.md**，用 **Skills** 封装常用命令 |
| **与 Jira、Slack、Drive 等联动** | 配置 **MCP** 服务器 |
| **完全自定义流水线**     | 使用 **Agent SDK** 自建代理 |
| **无本地环境或长任务**   | 使用网页版或桌面应用，必要时用 `/teleport` 与终端同步 |

> **注意**：功能与计费以 Anthropic 官方最新说明为准。
