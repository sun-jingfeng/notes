# OpenClaw

本文介绍开源个人 AI 助手 OpenClaw 的定位、架构、多模型与多平台能力、Skills 体系，以及本地安装与 Gateway 部署方式。

---

## 一、什么是 OpenClaw

**OpenClaw** 是一款可运行在个人设备上的开源 AI 助手平台，通过统一网关接入多种大模型与多种聊天渠道，并支持跨对话的长期记忆与可扩展的 Skills（技能）体系。

**核心思想**：把「模型 + 渠道 + 记忆 + 技能」统一调度，用户可在本地或自建环境中部署，数据默认存于本地，在保证隐私的前提下复用 Claude、GPT、Gemini 等云端能力，或通过 Ollama 使用本地模型。

### 1.1 定位与特点

| 维度 | 说明 |
| ------------------ | ---------------------------------------------------------------------- |
| **部署形态** | 本地/自建优先，数据可完全留在本机或自有服务器 |
| **模型接入** | 支持 Anthropic Claude、OpenAI、Google Gemini、Ollama 等，可配置主模型与回退 |
| **渠道接入** | 支持 WhatsApp、Telegram、Discord、飞书、钉钉、Slack、Teams、iMessage 等 10+ 平台 |
| **记忆** | 跨对话、跨渠道的持久化记忆与用户偏好 |
| **扩展** | 通过 Skills 为 AI 增加「操作手册」，组合工具完成具体任务 |
| **开源协议** | Apache 2.0 / MIT，免费使用；调用付费 API 时由用户自行承担费用 |

### 1.2 架构概览

OpenClaw 采用** AI 能力调度网关**思路：大语言模型提供「大脑」，Skills 提供「手脚」，网关负责路由、认证与多智能体调度。

```
    各渠道客户端（Telegram / 飞书 / Web 等）
        ↓
    Gateway（认证、路由、会话）
        ↓
    模型层（Claude / GPT / Gemini / Ollama…）
        ↓
    Skills（工具调用、任务编排）
```

| 层次 | 说明 |
| -------------- | ------------------------------------------------------------ |
| **渠道层** | 对接 IM、协作平台与 Web，将用户消息送入 Gateway |
| **Gateway** | 统一入口，处理认证、会话、模型选择与回退 |
| **模型层** | 主模型 + fallbacks，支持多厂商与本地 Ollama |
| **Skills** | 技能定义与工具组合，决定 AI 能执行的具体操作 |

支持多智能体（Multi-Agent）：不同 Agent 可配置独立 workspace、agentDir、sessions，在同一实例上运行多套助手。

***

## 二、模型与配置

### 2.1 模型选择顺序

Gateway 按以下顺序决定使用哪个模型：

1. **提供商内故障转移**：同一提供商内先做认证/可用性切换。
2. **回退列表**：`agents.defaults.model.fallbacks` 中的模型依次尝试。
3. **主模型**：`agents.defaults.model.primary` 或 `agents.defaults.model`。

若配置了 `agents.defaults.models`，则形成**模型白名单**：仅列表中的模型可被选用，否则会返回 "Model is not allowed"，需通过 `/model list` 选允许的模型或修改白名单。

### 2.2 配置入口

| 方式 | 说明 |
| ------------------ | ---------------------------------------------- |
| **向导** | 执行 `openclaw onboard` 按引导配置常见提供商与认证 |
| **手动** | 编辑 `~/.openclaw/openclaw.json`（JSON5），配置 `agents.defaults.model`、fallbacks、imageModel 等 |
| **CLI** | `openclaw models set <provider/model>`、`openclaw models fallbacks add …` 等 |

对话内可切换当前会话模型（不重启）：

```
/model              # 当前模型
/model list         # 可选列表
/model 3            # 按序号切换
/model openai/gpt-5.2
/model status
```

模型引用会规范化为小写；带 `/` 的 ID（如 OpenRouter 风格）需带提供商前缀，例如 `openrouter/moonshotai/kimi-k2`。

### 2.3 图像模型

当主模型不支持图像时，会使用 `agents.defaults.imageModel` 的 primary 与 fallbacks；可单独配置图像用模型与回退列表。

***

## 三、Skills（技能）体系

### 3.1 什么是 Skills

**Skills** 是 OpenClaw 中为 AI 提供的「操作手册」：定义如何组合工具、调用接口，完成具体任务（如查天气、发邮件、查数据库）。大模型负责理解用户意图并决定是否调用某技能，Skills 负责具体执行步骤。

| 概念 | 说明 |
| -------------- | ------------------------------------------------------------ |
| **技能市场** | ClawHub 等社区提供大量预置技能，可按需安装 |
| **加载优先级** | 工作区 Skills（项目内 `/skills`）> 托管/本地（`~/.openclaw/skills`）> 内置 |
| **配置** | 在 `~/.openclaw/openclaw.json` 的 `skills` 下统一管理启用、禁用、环境变量、文件监视等 |

### 3.2 常用管理命令

```bash
clawhub install <skill-name>    # 安装技能
# 技能相关配置集中在 openclaw.json 的 skills 段
```

高风险操作可配置在 Docker 沙箱中执行，通过 `agents.defaults.sandbox.docker.env` 注入环境变量。

***

## 四、安装与运行

### 4.1 环境要求

| 项目 | 要求 |
| -------------- | ---------------------------------------------- |
| **Node.js** | ≥ v22.0.0（推荐 LTS） |
| **本地大模型** | 若用 Ollama 等本地推理，建议 16GB+ 内存，NVIDIA 8GB+ 显存或 Apple Silicon |

### 4.2 安装方式

**方式一：官方安装脚本（推荐）**

```bash
# macOS / Linux
curl -fsSL https://openclaw.ai/install.sh | bash
```

```powershell
# Windows PowerShell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

**方式二：npm 全局安装**

```bash
npm install -g openclaw@latest
```

安装后可执行一次引导，配置默认模型与认证：

```bash
openclaw onboard --install-daemon
```

### 4.3 启动 Gateway

| 场景 | 命令 |
| -------------- | ------------------------------------------------------------ |
| **前台运行** | `openclaw gateway` 或 `openclaw gateway --port 18789` |
| **系统服务** | `openclaw gateway install` 安装服务，`openclaw gateway start` 启动 |
| **健康检查** | `openclaw health`、`openclaw status`、`openclaw gateway probe` |

Gateway 默认 WebSocket 端口为 **18789**；认证可通过配置项 `gateway.auth.token` 或环境变量 `OPENCLAW_GATEWAY_TOKEN` 设置。配置文件位于 `~/.openclaw/openclaw.json`。

### 4.4 云服务器部署要点

在阿里云、腾讯云等部署时，需放通端口：80/443（若提供 Web/回调）、18789（Gateway 通信）、22（SSH）。使用官方 OpenClaw 镜像可省略依赖安装，直接配置模型与 Skills 后启动 Gateway。

***

## 五、配置与工作区文件

### 5.1 全局配置

主配置文件为 **`~/.openclaw/openclaw.json`**（JSON5），典型内容包含：

- `agents.defaults.model`：默认主模型与回退
- `agents.defaults.models`：可选模型白名单与别名
- `agents.defaults.imageModel`：图像模型及回退
- `skills`：Skills 启用、路径、环境变量等
- `gateway`：端口、认证等

### 5.2 工作区与「灵魂」文件

在具体项目或 Agent 工作区中，可通过约定文件定义 AI 的行为与能力，例如：

| 文件 | 用途（约定） |
| -------------- | ---------------------------------------------- |
| **SOUL.md** | 角色与性格设定 |
| **IDENTITY.md** | 身份与边界 |
| **AGENTS.md** | 多智能体分工 |
| **TOOLS.md** | 可用工具说明 |
| **USER.md** | 用户偏好与上下文 |

上述文件名与用途以官方/社区文档为准，用于在「同一网关、多模型多技能」的基础上，为不同助手赋予不同「灵魂」与能力边界。

***

## 六、小结

| 要点 | 说明 |
| -------------- | ------------------------------------------------------------ |
| **定位** | 开源个人/团队 AI 助手，本地或自建部署，数据可控 |
| **能力** | 多模型（含本地 Ollama）、多渠道（IM/协作平台）、长期记忆、Skills 扩展 |
| **入口** | Gateway 统一接入，`openclaw gateway` 启动，默认端口 18789 |
| **配置** | `~/.openclaw/openclaw.json` 全局；工作区文件定义角色与工具 |
| **模型** | primary + fallbacks，可选白名单；对话内 `/model` 切换 |
| **Skills** | 工作区 > 本地/托管 > 内置；`clawhub install` 安装社区技能 |
