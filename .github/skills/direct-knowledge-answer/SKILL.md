---
name: direct-knowledge-answer
description: When the user asks a direct knowledge or concept question (e.g. "X 和 Y 的区别？", "什么是 Z？") without asking to create, edit, or look up notes, answer from general knowledge only. Do not search the notes workspace or modify any note files.
---

# 直接知识点问答

## 何时生效

用户**直接问知识点、概念、区别、用法**等，且**没有**要求查笔记、写笔记、改笔记、补充笔记时。

## 行为要求

- **只作答**：用已有知识直接回答，不查笔记、不改笔记。
- **不触发笔记相关技能**：不因为用户在 notes 项目里就默认去查/改笔记。
- **不读笔记文件**：除非用户明确说「查一下我笔记」「根据笔记」「补充到笔记」等，否则不读取 `*.md` 等笔记内容。

## 示例

- 用户：「StringBuilder 和 StringBuffer 的 API 都一样吗？」→ 直接回答知识点，不查、不改 `11-字符串.md` 等。
- 用户：「把这段话整理成笔记」/「补充到我的字符串笔记」→ 需要查、改笔记，此时才应用笔记相关规范。
