---
description: "Use when creating, expanding, refining, or restructuring technical notes under /Volumes/Workspace/notes, including frontend/backend/AI/Git knowledge notes."
name: "Knowledge Notes Style"
applyTo: "1-Frontend/**/*.md, 2-Backend/**/*.md, 3-General/**/*.md, 4-Misc/**/*.md"
---

# Knowledge Note Standards

Applies to note generation, expansion, editing, polishing, supplementing, and quality improvement.

**English-only**: all new notes and all added or rewritten content are written in English. Legacy Chinese notes remain until touched — when substantially reworking one, convert it to English; never mix languages within a note.

## Structure and Hierarchy

- Headings start at level 2: ## / ### / #### only. Level-2 chapters use Roman numerals (`## I.`), level-3 sections use Arabic (`### 1.1`).
- Separate major chapters with \*\*\*.
- Numbering is clear and sequential — no skipped levels, no decimal insertions (renumber instead).

## Expression and Content

- Give a one-sentence definition first, then the core idea, comparison tables, examples, and caveats.
- Use tables heavily for summaries and comparisons; bold key terms.
- Code examples must be complete, runnable, and commented at key steps.
- Add flow diagrams / tree structures / ASCII diagrams where they aid understanding.
- Knowledge content only — no advisory or retrospective closers ("study suggestions", "next steps", "recap", restating summaries).
- No author-process or conversational meta-narration ("let's look at...", "this part is confusing...", "the reason I changed this is...").
- No cross-references to other notes or other sections; explain in place.
- Use generic names in examples (`DemoService`, `xxx-service`, `<service-name>`), never a single business domain.

## Quality Improvement Principles

- Never copy the user's wording verbatim; distill and rewrite with more accurate, professional phrasing.
- When the user asks to improve quality, maximize information value:
  - Delete low-value, redundant content
  - Fill in key missing points
  - Restructure sections and knowledge paths when needed

## Style Consistency

- Match the existing notes: accurate terminology, clear structure, searchable, reviewable. The Golang notes (`2-Backend/Golang/`) are the English style reference.
- Spell technical terms correctly; mark uncertain information as "TBD"; never fabricate.
