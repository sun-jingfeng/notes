---
description: "Use when the user asks for an interview recap, first-round recap, or interview summary, or wants a recap generated from an interview transcript / Q&A notes."
name: "Generate Interview Recap"
---

# Interview Recap Standards

Generate a structured recap from raw interview records (verbatim transcript, Q&A notes, audio transcription), with a fixed chapter order. Recaps live under `4-Misc/Job Search/Interviews/Interview Records/{YY.M}/{D}/`.

## I. Interview Basics

- Use a table: Company, Role, Date/Time, Interviewer, Format.
- Write "TBD" for missing fields, or mark values as inferred from context.
- Name new files `recap.md` / `record.txt` (`recap2.md` / `record2.txt` for multiple sessions on the same day); never auto-append a " (done)" suffix — the user maintains that marker manually (e.g. `recap (done).md`). Legacy files named `复盘.md` / `记录.txt` stay as they are.

---

## II. Question-by-Question Recap

Each question uses a level-3 heading: `### N. Short question title`.
Every title gets a score tag by default: `[7 pts]`, `[7.5 pts]`; add `[Wrong]` only when the answer contains a clear factual, conceptual, or terminology error. No other tags.
Each question outputs these blocks in fixed order:

- Question
- My Answer Highlights
- Evaluation (strengths / weaknesses)
- Reference Answer Highlights
- Spoken Script (first person, conversational, directly speakable)

If a title carries `[Wrong]`, add one line `**Error:** ...` in the body stating briefly what was wrong.

Requirements:

- Recap questions in original order — never skip or merge.
- If a record is too thin, keep the question and write "Record too brief — to be filled in".
- Never fabricate missing factual information.

---

## III. What Went Well

- Summarize strengths and notes in a table.

---

## IV. Areas to Improve and Blind Spots

- Split into subsections such as technical answers, delivery and structure.
- Use tables listing question, weakness, content to add.

---

## V. Follow-up Actions

- Ordered lists of short-term, mid-term, and resume/script improvement actions.

---

## VI. Summary

- 2–4 sentences on strengths, gaps, and the next focus.

## Discussion vs. Writing

- "Check if this is right / let's discuss" is discussion: evaluate and suggest only; do not edit the document.
- Only modify the recap when the user explicitly says "write it in / add to the recap / update question N".
- After multiple discussion rounds on one question, keep exactly one high-quality "Reference Answer Highlights + Spoken Script" — merge and delete any duplicates.
