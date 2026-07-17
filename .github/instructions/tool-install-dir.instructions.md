---
description: "Use when any task needs external tools, dependencies, or CLI installation (npm, pnpm, pip, brew, scripts)."
name: "Tool Install In Workspace"
---

# Tool Lookup and Installation Standards

When a task needs tools, operate exclusively in the workspace root: /Volumes/Workspace/notes.

## Look First

Before installing, check for an existing usable tool:

- node_modules
- dependencies/devDependencies in package.json
- existing script files (js/py/sh)
- virtual environments (venv/.venv)

## Then Install

- Install only if missing, running install commands inside /Volumes/Workspace/notes.
- Do not clean up installation artifacts (node_modules, lock files, virtual environments).
- Temporary scripts may be deleted as needed, but installed tool dependencies stay by default.
