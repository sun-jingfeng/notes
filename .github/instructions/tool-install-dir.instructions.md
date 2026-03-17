---
description: "Use when any task needs external tools, dependencies, or CLI installation (npm, pnpm, pip, brew, scripts)."
name: "Tool Install In Workspace"
---

# 工具查找与安装目录规范

执行任务需要工具时，统一在当前工作区根目录操作：/Volumes/Workspace/notes。

## 先查找

安装前先检查是否已有可用工具：

- node_modules
- package.json 的 dependencies/devDependencies
- 现有脚本文件（js/py/sh）
- 虚拟环境（venv/.venv）

## 再安装

- 缺失时再安装，并在 /Volumes/Workspace/notes 下执行安装命令。
- 不清理安装产物（如 node_modules、lock 文件、虚拟环境）。
- 临时脚本可按需要删除，但工具依赖默认保留。
