# MCP（Model Context Protocol）

本文介绍 MCP 协议的概念、能力、在 Cursor 中的配置方法，以及 GitHub 与 Figma（网页版）的接入示例。

---

## 一、什么是 MCP

**MCP（Model Context Protocol）** 是 Anthropic 于 2024 年发布的开放协议，用于规范 AI 应用与外部工具、数据源之间的通信方式。

**核心思想**：用统一协议替代各平台各自的集成方案，使 AI 能以同一套方式接入任意 MCP Server。可类比为：MCP 之于 AI 工具集成，如同 USB-C 之于设备连接——不必再为每种「AI × 工具」组合单独开发适配层。

### 1.1 解决的问题

此前，每个 AI 应用都要为每个外部服务（GitHub、数据库、设计工具等）单独写集成逻辑，成本高且难以复用。MCP 把「AI 如何调用工具」标准化后，Server 由工具方或社区维护，Client（AI 应用）只需实现 MCP 协议即可接入所有已存在的 Server，双方解耦、可独立演进。

### 1.2 架构

```
MCP Host（AI 应用，如 Cursor）
    │
    ├── MCP Client ──→ MCP Server A（如 GitHub）
    │                      提供 Tools / Resources
    │
    └── MCP Client ──→ MCP Server B（如 Figma）
                           提供 Tools / Resources
```

| 角色 | 说明 | 示例 |
| -------------- | ------------------------------------------- | ----------------------- |
| **MCP Host**   | 运行 AI 的宿主应用                          | Cursor、Claude Desktop  |
| **MCP Client** | 内嵌于 Host，负责与 Server 的连接与调用     | Cursor 内置             |
| **MCP Server** | 对外暴露工具与资源的独立进程或服务          | GitHub MCP、Figma MCP   |

### 1.3 对人与 AI 协作的意义

从使用体验看，MCP 带来两方面价值：

**① 能力扩展：从「只能聊」到「能操作 + 能读源」**

- **操作**：AI 不再只给出步骤、由用户去各平台手动执行，而是可直接调用平台 API，完成查仓库、读文件、看设计、发起 PR 等操作。
- **引用**：AI 不再依赖截图或复制粘贴，而是直接读取平台**源数据**（设计节点、代码文件、仓库结构等），信息完整、结构化。

**② 沟通成本与精度**

| 维度     | 无 MCP                         | 有 MCP                                           |
| -------- | ------------------------------ | ------------------------------------------------ |
| **成本** | 截图、录屏、大段文字描述       | 提供链接或标识即可（如仓库 URL、Figma 设计链接） |
| **精度** | 依赖截图像素，易丢细节、易歧义 | 读取平台源数据，语义准确、可编程                 |

综上：MCP 使 AI 工具具备**直接操作**与**直接引用**外部平台的能力，从而降低人与 AI 的沟通成本，并提高沟通精度（从「截图 + 口述」变为「链接 + 源数据」）。

***

## 二、核心能力

MCP Server 对外提供三类能力：

| 能力 | 说明 | 示例 |
| ----------------------- | ------------------------------------------ | ----------------------------------- |
| **Tools（工具）**       | 可被 AI 调用的函数，用于执行操作或查询     | 搜索 Issue、创建 PR、读取设计稿     |
| **Resources（资源）**   | 可被 AI 读取的数据，类似只读文件系统       | 仓库文件内容、数据库记录           |
| **Prompts（提示模板）** | 预置的提示词模板，由用户主动触发           | `/review-pr`、`/generate-component` |

日常使用里 **Tools** 最常见：AI 在对话中自动判断何时调用哪个工具。

### 2.1 传输类型

| 类型 | 适用场景 | 配置方式 |
| ------------- | ---------------------------- | ----------------------- |
| **stdio**     | 本地子进程（如通过 npx 启动） | `command` + `args`      |
| **HTTP/SSE**  | 本地或远程 HTTP 服务         | `url`                   |

***

## 三、在 Cursor 中配置 MCP

### 3.1 配置文件位置

| 范围 | 路径 | 适用场景 |
| ---------- | ----------------------- | --------------------------------------------------------- |
| **全局**   | `~/.cursor/mcp.json`    | 账号级工具（如 GitHub、Figma），所有项目共用              |
| **项目**   | `.cursor/mcp.json`      | 项目专属工具，可随仓库版本管理（勿提交含密钥的配置）      |

建议把账号级、带密钥的 MCP 放在全局配置，便于所有项目复用，也避免 PAT 等敏感信息进入仓库。

### 3.2 配置格式

```json
{
  "mcpServers": {
    "<服务名>": {
      "command": "npx",
      "args": ["-y", "<包名>"],
      "env": {
        "API_KEY": "<密钥>"
      }
    },
    "<服务名2>": {
      "url": "http://127.0.0.1:<端口>/mcp"
    }
  }
}
```

| 字段 | 说明 |
| ----------- | -------------------------------------------------------- |
| `command`   | stdio 类型：启动 Server 的命令，由 Cursor 拉起子进程     |
| `args`      | 命令参数（如 npx 的包名、标志位）                         |
| `env`       | 注入子进程的环境变量（如 API Token）                      |
| `url`       | HTTP/SSE 类型：MCP 服务地址（本地或远程均可）             |

### 3.3 生效与验证

保存配置后，在 **Cursor 设置 → Tools & MCP** 中确认对应服务已列出且状态正常；未生效时可重启 Cursor 再试。使用 **Agent 模式**对话时，AI 会按需自动调用已连接的 MCP 工具。

***

## 四、示例：连接 GitHub 与 Figma

### 4.1 前置条件

- 已安装 **Cursor** 与 **Node.js 18+**（用于通过 npx 启动 GitHub MCP Server）
- **GitHub**：已创建 **Personal Access Token (PAT)**
- **Figma**：具备任意 Figma 账号即可（不限于桌面端或 Dev/Full 席位）

### 4.2 GitHub MCP

**① 创建 PAT**

1. 打开 [GitHub → Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. 选择 **Generate new token (classic)**，权限至少勾选 `repo`（仓库、Issue、PR、推送等）；若需访问组织内私有仓库，需在 Organization permissions 中额外授权
3. 生成后立即复制保存，页面关闭后 token 不再显示

**② 写入全局配置**

在 `~/.cursor/mcp.json` 的 `mcpServers` 对象中增加一项（若无该文件或该键，需先建好 `{ "mcpServers": {} }` 结构）：

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_你的PAT"
  }
}
```

### 4.3 Figma MCP（网页版 / 远程服务）

Figma 提供**远程 MCP 服务**，无需安装桌面端，在浏览器使用 Figma 即可。适用所有席位与套餐，通过 OAuth 授权，首次连接时在浏览器中登录 Figma 并允许访问。

**方式一：通过插件安装（推荐）**

在 Cursor 的 **Agent 对话**中输入：

```
/plugin-add figma
```

按提示完成安装。插件会自动写入 MCP 配置，并附带 Figma 相关规则与 Skills，便于设计稿转代码等流程。

**方式二：手动写入配置**

在 `~/.cursor/mcp.json` 的 `mcpServers` 中新增（与 `github` 同级）：

```json
"figma": {
  "url": "https://mcp.figma.com/mcp"
}
```

**首次连接与授权**

1. 保存 `mcp.json` 后重启 Cursor（若为手动配置）。
2. 打开 **Cursor 设置 → Tools & MCP**，找到 Figma 服务。
3. 点击 **Install**（若尚未安装）或 **Connect**，按提示在浏览器中打开 Figma 授权页，登录并点击 **Allow Access**。
4. 授权成功后，Figma 服务显示为已连接，即可在 Agent 对话中发 Figma 设计链接，由 AI 读取设计上下文并生成或调整代码。

官方说明：[Figma 远程 MCP 安装指南](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)（含 VS Code、Claude Code 等客户端的步骤）。

### 4.4 配置汇总与完整示例

| 服务 | 传输类型 | 配置要点 |
| ---------- | --------------- | -------------------------------------------------------------------- |
| **GitHub** | stdio（npx）    | 设置环境变量 `GITHUB_PERSONAL_ACCESS_TOKEN`                          |
| **Figma**  | HTTP/SSE（远程）| `url` 填 `https://mcp.figma.com/mcp`，首次使用需在 Cursor 中完成 OAuth 授权 |

两处均配置并完成授权后，在 Agent 模式下即可：对 GitHub 执行查仓库、读 Issue/PR、生成 commit 等操作；对 Figma 通过设计链接读取设计稿并生成或调整代码。

**同时启用两个服务时，`mcp.json` 示例：**

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_你的PAT"
      }
    },
    "figma": {
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

> **说明**：若仅使用 Figma 且希望用桌面端，可改用本地地址 `http://127.0.0.1:3845/mcp`，并确保 Figma Desktop 已安装、已开启 Dev Mode MCP 且保持运行。网页版无需桌面端，适用所有账号类型。
