# Recap Document Structure Reference

Quick reference for the sections and formatting to follow when generating an interview recap, distilled from existing recap documents.

## Document Title and Top-Level Structure

```markdown
# {Company} {Round} Recap

## 1. Interview Basics
(table)

***

## 2. Question-by-Question Recap (question → my answer → evaluation → reference answer)

### 1. {Short question title} [7 pts]

**Question**
{Interviewer's original question or a distillation}

**My Answer Highlights**
- Point 1
- Point 2

**Evaluation**
- Strengths: …
- Weaknesses: …

**Reference Answer Highlights**
- Point 1
- Point 2

**Spoken Script**
{1–2 conversational paragraphs, first person}

(If the user supplements after discussing with the agent: **generate the highest-quality answer from the conversation** and merge it into the reference answer / script; the user's words are reference only, never copied verbatim. Keep only one answer — no standalone "Recap Notes" or "Script Self-Review" blocks.)

***

### 2. {Next question} [7.5 pts]
…

***

## 3. What Went Well

| Point                 | Notes |
| --------------------- | ----- |
| **Project narrative** | …     |
| **A technical point** | …     |

***

## 4. Areas to Improve and Blind Spots

### 4.1 Technical Answers

| Question | Weakness | Content to Add |
| -------- | -------- | -------------- |
| …        | …        | …              |

### 4.2 Delivery and Structure

- bullets or short paragraphs

***

## 5. Follow-up Actions

### 5.1 Short-term (next round / similar roles)
1. …
2. …

### 5.2 Mid-term (knowledge gaps)
1. …

### 5.3 Resume and Scripts
1. …

***

## 6. Summary

{2–4 sentences: strengths, weaknesses, role fit or next focus}
```

## Optional Per-Question Supplement Block

- After the user discusses a question with the agent, supplement by **generating the highest-quality answer from the conversation** and merging it into "Reference Answer Highlights" and "Spoken Script"; the user's words are reference only, never copied verbatim. **Keep only one final answer**; do not add standalone sections like "Recap Notes" or "Script Self-Review". If such sections already exist, merge them into the main answer and delete them.

## Format Conventions

- Between major chapters: blank line + `***` + blank line.
- Between questions: `***` separator.
- Lists: use `-`; ordered actions use `1. 2. 3.`.
- Key terms: **bold**; proper nouns and tool names must be accurate (e.g. Seata, JMeter, html2canvas).
- Spoken scripts: first person, readable aloud, no written-style transitions like "first of all" or "next" — state directly.
