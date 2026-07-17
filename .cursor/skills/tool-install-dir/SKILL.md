---
name: tool-install-dir
description: Tool lookup and installation happen exclusively in /Volumes/Workspace/notes. When a tool is needed, first check that directory for an existing installation; only install into that directory if missing. Applies to npm, pip, CLIs, and any other scenario requiring external tools.
---

# Tool Lookup and Installation Rules

Whenever a task requires tools, dependencies, or scripts, operate exclusively inside `/Volumes/Workspace/notes`.

## 1. Look First

Before installing, check whether the tool already exists in that directory:

- `node_modules/`: installed npm packages
- `package.json`: project dependency list (`dependencies`, `devDependencies`)
- Script files in the root and subdirectories (`.js`, `.py`, `.sh`, etc.)
- Virtual environments (`venv`, `.venv`, etc.)

Search with the `Read`, `Grep`, and `Glob` tools. Only install after confirming the needed tool is absent.

## 2. Then Install

1. **Install location**: run install commands (e.g. `npm install`, `pip install`) inside `/Volumes/Workspace/notes`
2. **Do not delete**: keep all installation artifacts after finishing (`node_modules`, `package.json`, `package-lock.json`, virtual environments, etc.) — no cleanup
3. **Temporary scripts**: scripts written just to complete a task may be deleted afterward, but installed tool dependencies stay
