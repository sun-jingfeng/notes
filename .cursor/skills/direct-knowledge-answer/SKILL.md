---
name: direct-knowledge-answer
description: When the user asks a direct knowledge or concept question (e.g. "What's the difference between X and Y?", "What is Z?") without asking to create, edit, or look up notes, answer from general knowledge only. Do not search the notes workspace or modify any note files.
---

# Direct Knowledge Q&A

## When This Applies

The user **directly asks about a knowledge point, concept, difference, or usage**, and does **not** ask to look up, write, edit, or supplement notes.

## Required Behavior

- **Answer only**: respond from existing knowledge; do not read or modify notes.
- **Do not trigger note-related skills**: being inside the notes project does not mean note lookup/editing is the default.
- **Do not read note files**: unless the user explicitly says something like "check my notes", "based on my notes", or "add this to my notes", do not read `*.md` or other note content.

## Examples

- User: "Do StringBuilder and StringBuffer have the same API?" → Answer directly; do not read or modify `11-字符串.md` or similar.
- User: "Turn this into a note" / "Add this to my strings note" → This requires reading/modifying notes; only then do the note standards apply.
