---
name: tool-install-dir
description: 工具查找与安装统一在 /Volumes/Workspace/notes。需要工具时先在该目录查找已有安装，缺失时再安装到该目录。适用于 npm、pip、CLI 等所有需要外部工具的场景。
---

# 工具查找与安装规范

执行任务过程中需要用到工具、依赖或脚本时，统一在 `/Volumes/Workspace/notes` 目录操作。

## 一、先查找

在安装前，先在该目录检查是否已有可用工具：

- `node_modules/`：已安装的 npm 包
- `package.json`：项目依赖列表（`dependencies`、`devDependencies`）
- 根目录及子目录下的脚本文件（`.js`、`.py`、`.sh` 等）
- 虚拟环境（`venv`、`.venv` 等）

使用 `Read`、`Grep`、`Glob` 等工具搜索。确认没有所需工具后，再执行安装。

## 二、再安装

1. **安装目录**：在 `/Volumes/Workspace/notes` 下执行安装命令（如 `npm install`、`pip install` 等）
2. **不要删除**：安装完成后保留所有安装产物（`node_modules`、`package.json`、`package-lock.json`、虚拟环境等），不做清理
3. **临时脚本**：为完成任务编写的临时脚本在任务完成后可以删除，但安装的工具依赖保留
