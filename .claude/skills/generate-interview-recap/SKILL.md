---
name: generate-interview-recap
description: Generates a structured interview recap from raw interview notes or transcripts. Use when the user has interview records (e.g. round-one.txt, a Q&A log, a transcript) and wants a recap document with question → my answer highlights → evaluation → reference answer highlights → spoken script, plus strengths, areas to improve, follow-up actions, and a summary. Trigger terms: interview recap, generate a recap from interview records, first-round recap, interview summary, interview retro.
---

# Generate an Interview Recap from Interview Records

Generate a structured **interview recap** document from **raw interview records** (verbatim transcripts, Q&A notes, audio transcriptions, etc.) for later review and next-round preparation.

## Input and Output

- **Input**: interview records provided by the user (as a referenced file or pasted text), typically containing the interviewer's questions and your answer highlights or verbatim content.
- **Output**: a complete recap in Markdown following the "Recap Document Structure" below, consistent in style with existing recap notes.
- **File naming**: name the recap file `recap.md` by default; for multiple interviews on the same day, use `recap2.md`, `recap3.md`, etc. Never auto-append a "(done)" suffix — the user adds that manually after finishing their review. Name the corresponding interview record file `record.txt` (`record2.txt` etc. for multiple sessions).
- **Directory structure**: organize by two levels, "year.month / day", e.g. `26.4/1/`. Multiple interviews on the same day share the same day directory, distinguished by file number — do not append `-N` to the directory name.

## Recap Document Structure

Generate strictly in the following order, with `***` between major chapters.

### 1. Interview Basics

Present as a table with these required fields:

| Item            | Content |
| --------------- | ------- |
| **Company**     | …       |
| **Role**        | …       |
| **Date/Time**   | …       |
| **Interviewer** | …       |
| **Format**      | audio/video, one-on-one/panel, etc. |

If a field is missing from the records, write "TBD" or infer from context and mark it as inferred.

***

### 2. Question-by-Question Recap (question → my answer → evaluation → reference answer → script)

Each question is a `### N. Short question title`, separated from the next by `***`. Each question contains the following blocks, in fixed order:

1. **Question**: the interviewer's original question or a one-sentence distillation.
2. **My Answer Highlights**: bullet points of what you answered at the time, extracted from the records; if missing, write "Not recorded" and ask the user to supplement.
3. **Evaluation**:
   - Strengths: what was answered well (structure, technical points, delivery, etc.).
   - Weaknesses: missed points, unclear phrasing, areas to strengthen.
4. **Reference Answer Highlights**: a more complete, reusable answer for that question (usable in the next interview); technical answers must be accurate and actionable.
5. **Spoken Script**: one or two natural, conversational paragraphs that can be spoken verbatim in the next interview; consistent with the reference answer, but more fluid and speech-like.

**Title tags (on by default):**
- Every question title gets a score tag by default, in the fixed format `[7 pts]`, `[7.5 pts]`.
- Only add `[Wrong]` to the title when the original answer contains a clear factual, conceptual, or terminology error.
- Do not invent other tags.
- If a title carries `[Wrong]`, the body must include a line `**Error:** ...` stating in one short sentence what was wrong.
- `**Error:**` states only the error itself — do not repeat lengthy evaluation.

**Supplementing after discussion:** the user may discuss some questions with the agent. To fold the discussion back into an existing recap, **generate the highest-quality answer based on the conversation** and merge it into "Reference Answer Highlights" and "Spoken Script", **keeping only one final answer**. Treat the user's words as reference only — do not copy them verbatim; the agent synthesizes, upgrades, and polishes the discussion points. Do not add separate blocks like "Recap Notes" or "Script Self-Review"; if such blocks already exist, merge them into the reference answer / script and delete them, keeping one answer per question.

***

### 3. What Went Well

Summarize what went well in a table, for example:

| Point                    | Notes |
| ------------------------ | ----- |
| **Project narrative**    | …     |
| **A technical point**    | …     |

***

### 4. Areas to Improve and Blind Spots

Split into subsections (e.g. 4.1 Technical answers, 4.2 Delivery and structure), listed in tables:

- Question / weakness / content to add (or a "content to add" column).
- If proper nouns or tool names appear wrong or missing in the records, correct them here and note the right form.

***

### 5. Follow-up Actions

Split into short-term (for the next round / similar roles), mid-term (knowledge gaps), and resume & scripts; list actionable items as ordered lists.

***

### 6. Summary

2–4 sentences covering: strengths this round, weaknesses, fit with the role, or the next focus.

## Execution Points

1. **Read the records thoroughly first**: distinguish interviewer questions from your answers; if there are timestamps or speaker labels, split by speaker.
2. **One recap per question**: generate in the order questions appear in the records — never merge or skip. If a question's record is too thin, keep the question and note "Record too brief — to be filled in" under "My Answer Highlights".
3. **Evaluate objectively**: write both strengths and weaknesses; each weakness must map to content that "Reference Answer Highlights" and "Spoken Script" fill in.
4. **Scripts must be recitable**: spoken scripts are first-person, conversational, directly speakable — avoid long written-style sentences.
5. **Format matches existing recaps**: heading levels (## / ###), tables, `***` separators, bolded key terms, accurate proper nouns (e.g. Seata, JMeter).
6. **Tag by default**: put the score and `[Wrong]` in the question title for quick outline scanning; do not pile lengthy tag explanations into the body.
7. **Never fabricate**: for information entirely absent from the records (e.g. company name, role name), write "TBD" or ask the user — do not make it up.
8. **One answer per question**: if the user discusses a question with the agent and asks to supplement, **generate the highest-quality answer from the conversation** and merge it into "Reference Answer Highlights" and "Spoken Script". The user's words are reference only, not copied verbatim — the agent synthesizes, upgrades, and polishes. Do not add standalone blocks like "Recap Notes" or "Script Self-Review"; if the recap already has them, merge into the main answer and delete, so each question ends with exactly one reference answer and script.

## Discussion vs. Writing (Important)

- **When the user sends an answer saying "check if this is right", "how's the quality", "let's discuss", etc. — that is discussion**, not a request to write into the recap document.
- **During discussion**: only evaluate, suggest improvements, and discuss correctness/quality; do **not** proactively write the user's words or your synthesis into the recap document.
- **Only when the user explicitly says** "write it in", "add it to the recap", "update question N", "record this one", etc., write the content into the recap document.
- Avoid the lazy pattern of "user sends an answer → immediately edit the document"; respond to the discussion first and wait for confirmation before touching the file.

## Optional: Relationship to the Knowledge Note Standards

If the recap lives under `/Volumes/Workspace/notes` and the user wants it stylistically unified with the existing notes, refer to the `knowledge-notes` skill's format and phrasing conventions (heading levels, tables, no lead-in phrases). This skill's recap structure takes precedence; where format details conflict with knowledge-notes, this skill wins.

## Reference Example

See [reference.md](reference.md) for the full structural template, drawn from the sections and formatting of existing recap documents.
