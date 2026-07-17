# Copilot

本文介绍 Copilot 产品家族的含义、两条主要产品线（GitHub Copilot 与 Microsoft Copilot）的定位、功能与使用场景。

---

## 一、什么是 Copilot

**Copilot** 是微软系产品中「AI 辅助」的统一品牌名，涵盖代码编写、办公协作、搜索与对话等场景。日常所说的 Copilot 通常指两条主线：

| 产品线 | 主要场景 | 典型入口 |
| ------------------ | ------------------------ | ------------------------------ |
| **GitHub Copilot** | 开发：代码补全、聊天、Agent | IDE（VS Code、Visual Studio、JetBrains 等） |
| **Microsoft Copilot** | 办公与通用：文档、邮件、会议、搜索 | 365 应用、Bing、Windows、独立应用 |

两者都强调「副驾」式辅助：在用户当前上下文中提供建议或执行任务，而不是完全替代用户操作。

***

## 二、GitHub Copilot

### 2.1 定位与核心能力

**GitHub Copilot** 面向开发者，在编辑器内提供基于 AI 的代码补全、解释、重构与多步任务执行。

**核心能力：**

| 能力 | 说明 |
| ------------------ | -------------------------------------------------------- |
| **实时代码补全** | 根据当前文件与项目上下文，在输入时给出整行/多行建议 |
| **Copilot Chat** | 在 IDE 内对话：解释代码、写单元测试、生成片段、回答技术问题 |
| **Agent 模式** | 多步任务（如实现需求、修 bug、写 PR 描述），可自动改多个文件、运行命令 |
| **代码审查** | 对 PR/差分给出评论与改进建议 |
| **多语言支持** | 主流语言均支持（如 Python、JavaScript、TypeScript、Java、C#、Go 等） |

底层模型由 OpenAI 等提供，GitHub 负责产品与 IDE 集成；部分计划支持可切换或指定模型。

### 2.2 计划与定价（参考）

| 计划 | 适用对象 | 主要权益（以官方为准） |
| ------------------ | ------------ | -------------------------------------------------------- |
| **Copilot Free** | 个人/开源等 | 有限次代码补全 + 有限条 Chat 消息/月 |
| **Copilot Pro** | 个人付费 | 更高/无限补全额度 + 更多高级请求（如 Agent）、优先模型 |
| **Copilot Pro+** | 个人重度使用 | 更多高级请求额度，适合频繁使用 Agent、长对话 |
| **Copilot Business** | 团队/组织 | 按座位计费，管理策略、使用报告、合规相关 |
| **Copilot Enterprise** | 企业 | 在 Business 基础上增加企业级支持与 SLA 等 |

> 💡 具体额度与价格以 [GitHub Copilot 计划说明](https://docs.github.com/zh/copilot/about-github-copilot/plans-for-github-copilot) 为准，会随产品更新调整。

### 2.3 使用前提与入口

- **账号**：需要 GitHub 账号；付费计划需订阅对应 Copilot 计划。
- **IDE**：在 VS Code、Visual Studio、JetBrains 等中安装官方 Copilot 插件/扩展，登录 GitHub 即可使用补全与 Chat。
- **Agent / 高级功能**：部分能力仅在 Copilot Pro 及以上或特定 IDE 版本中提供。

***

## 三、Microsoft Copilot

### 3.1 定位与核心能力

**Microsoft Copilot** 是微软的通用 AI 助手，集成在 Microsoft 365、Bing、Windows 及独立应用中，面向办公与日常信息处理。

**核心能力：**

| 能力 | 说明 |
| ------------------ | -------------------------------------------------------- |
| **文档与写作** | 在 Word 中起草、润色、总结；生成大纲、列表、多语言文案 |
| **表格与分析** | 在 Excel 中用自然语言生成公式、做数据分析、生成图表说明 |
| **邮件与日历** | 总结收件箱、起草回复、安排会议、生成会议纪要 |
| **会议与协作** | 在 Teams 中总结会议、提取待办与决策、生成会议记录 |
| **搜索与对话** | 在 Bing 或 Copilot 应用中回答问题、总结网页、生成图片（如支持） |
| **企业数据** | Copilot for Microsoft 365 可通过 Microsoft Graph 在权限内访问组织数据，回答基于公司文档/邮件的问题 |

底层多由 OpenAI 模型驱动，微软负责集成、合规与企业策略。

### 3.2 常见形态与入口

| 形态 | 入口/场景 |
| ------------------ | ---------------------------------------------- |
| **Copilot in 365** | Word、Excel、Outlook、Teams 等应用内按钮或面板 |
| **Bing / Copilot 网页/应用** | 浏览器或独立应用，通用问答与搜索 |
| **Windows Copilot** | 系统级侧边栏，快捷提问与系统操作 |
| **Copilot Pro** | 个人订阅，更多优先访问、高级模型与 365 内增强功能 |

企业版（Copilot for Microsoft 365）按用户/座位订阅，需 Microsoft 365 相应 SKU 与许可证。

### 3.3 与 GitHub Copilot 的区分

| 维度 | GitHub Copilot | Microsoft Copilot |
| ------------ | -------------------- | --------------------------- |
| **主要用户** | 开发者 | 办公人员、普通用户、企业 |
| **主场景** | 写代码、读代码、修 bug、PR | 写文档、做表、邮件、会议、搜索 |
| **典型入口** | VS Code、Visual Studio、JetBrains | Word、Excel、Teams、Bing、Windows |
| **计费** | 按 Copilot 计划（个人/团队/企业） | 按 365 许可证或 Copilot Pro 等订阅 |

两者可同时使用：同一账号可以在 IDE 里用 GitHub Copilot 写代码，在 365 里用 Microsoft Copilot 写文档、处理邮件。

***

## 四、使用场景小结

| 场景 | 更适用的产品 |
| ------------------ | ---------------------- |
| **写代码、补全、重构、修 bug、做 Code Review** | GitHub Copilot |
| **写文档、做表格、总结邮件与会议、通用问答** | Microsoft Copilot |
| **在代码仓库或 PR 上做多步自动化任务** | GitHub Copilot（Agent 等） |
| **基于公司内部文档/邮件回答问题** | Microsoft Copilot（Copilot for 365） |

> **注意**：功能与定价会随产品迭代变化，选型时以官方最新说明为准。
