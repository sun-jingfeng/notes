# Advanced Git Techniques

## I. Stash

Temporarily shelves changes in the working directory and the index, which makes it possible to switch branches or handle another task.

### 1.1 Save

```bash
git stash                      # Stash the working-directory and index changes
git stash save "<message>"     # Stash with a description
git stash -u                   # Include untracked files
```

### 1.2 Inspect

```bash
git stash list                 # List the stash entries
git stash show                 # Summary of the most recent stash
git stash show -p              # Full diff of the most recent stash
git stash show stash@{<n>}     # Summary of a given stash
```

### 1.3 Apply and Delete

```bash
git stash apply                # Apply the most recent stash
git stash apply stash@{<n>}    # Apply a given stash
git stash pop                  # Apply the most recent stash and drop it
git stash drop                 # Drop the most recent stash
git stash drop stash@{<n>}     # Drop a given stash
git stash clear                # Drop all stashes
git stash branch <branch>      # Create a new branch from the most recent stash
```

| Command | Applies the changes | Keeps the stash entry |
| ------- | ------------------- | --------------------- |
| `apply` | Yes                 | Yes                   |
| `pop`   | Yes                 | No                    |
| `drop`  | No                  | No                    |

***

## II. Tags

Mark a specific commit, most often for a release.

### 2.1 Inspect

```bash
git tag                # List all tags
git tag -l "v1.*"      # Filter tags by pattern
git show <tag>         # Show a tag's details
```

### 2.2 Create

```bash
git tag <tag>                     # Lightweight tag on the current commit
git tag <tag> <hash>              # Lightweight tag on a given commit
git tag -a <tag> -m "<message>"   # Annotated tag (recommended)
```

| Type            | Stores                                        | Use case                       |
| --------------- | --------------------------------------------- | ------------------------------ |
| **Lightweight** | Just a pointer to the commit                  | Private, temporary markers     |
| **Annotated**   | Tagger, date, message, and an own object      | Releases and shared history    |

### 2.3 Push

```bash
git push origin <tag>      # Push a single tag
git push origin --tags     # Push all tags
```

### 2.4 Delete

```bash
git tag -d <tag>                   # Delete a local tag
git push origin --delete <tag>     # Delete a remote tag
```

***

## III. Common Tasks

### 3.1 Undo the Last Commit, Keeping the Changes

```bash
git reset --soft HEAD~1
```

### 3.2 Reword the Last Commit Message

```bash
git commit --amend -m "<new message>"
```

### 3.3 Untrack an Already-Tracked File

```bash
git rm --cached <file>           # Untrack a single file
git rm -r --cached <directory>   # Untrack a whole directory
```

### 3.4 Inspect the Operation Log

```bash
git reflog     # Show every operation, used to recover from mistakes
```

***

## IV. Rename Detection

### 4.1 Git Does Not Record Renames

A commit is only a snapshot of paths and their contents, so nothing in it says "this file was renamed". The rename is *inferred* when the diff is displayed, by comparing the deleted paths against the added ones.

| Kind               | How it is matched                                    | Result                     |
| ------------------ | ---------------------------------------------------- | -------------------------- |
| **Exact rename**   | The new file is byte-identical (same blob hash)       | Always paired up as `R100` |
| **Inexact rename** | Contents compared; ≥ 50% similar (the `-M` default)   | `R<score>`                 |
| **Below threshold**| Too little in common to pair                          | A separate `A` and `D`     |

This is why renaming a file *and* rewriting its content in one commit shows up as an add plus a delete: from Git's point of view one file vanished and an unrelated one appeared.

### 4.2 Inspecting and Tuning the Detection

```bash
git diff --cached -M10%                  # Lower the similarity threshold to 10%
git diff --name-status --find-renames=10%  # Same, spelled out
git diff --summary                       # Report the renames Git actually paired
git config diff.renames copies           # Detect copies too (default: true, renames only)
```

Two other reasons a rename can go undetected:

- `diff.renames` or `status.renames` is set to `false` in that repository, which disables detection outright
- The changeset is large enough that the candidate matrix exceeds `diff.renameLimit`, so Git skips inexact detection and prints a warning

### 4.3 Renames and File History

The history is never lost either way — every earlier commit still holds the old path with its old content. Only the automatic traversal differs:

```bash
git log -- <old-path>             # Always works, whether or not a rename was detected
git log --follow -- <new-path>    # Crosses the rename boundary, re-running detection at each commit
git blame -C -M <file-path>       # -M: lines moved inside the file, -C: lines copied from other files
```

When the detection fails, `git log --follow` simply stops at that commit and `git blame` attributes every line to it.

### 4.4 Keeping Renames Detectable

Split the work into two commits: first the pure rename with the content untouched, then the content rewrite. Detection then succeeds and `--follow` and `blame` reach across it.

> A rename cannot be added to an existing commit after the fact. While the commit is still local it can be rewritten; once it has been pushed and shared, leave it alone — `git log -- <old-path>` is the way back.

***

## V. less Pager Shortcuts

By default, `git log`, `git diff`, and similar commands display their output in the `less` pager.

### 5.1 Basic Navigation

| Key       | Action           |
| --------- | ---------------- |
| `Space`   | Page down        |
| `b`       | Page up          |
| `↓` / `j` | One line down    |
| `↑` / `k` | One line up      |

### 5.2 Fast Movement

| Key | Action                      |
| --- | --------------------------- |
| `d` | Half a page down            |
| `u` | Half a page up              |
| `g` | Jump to the start of output |
| `G` | Jump to the end of output   |
| `n` | Next search match           |
| `N` | Previous search match       |

### 5.3 Search

| Key | Action                                                                 |
| --- | ---------------------------------------------------------------------- |
| `/` | Followed by a pattern (a regular expression works) and Enter, searches forward |
| `?` | Followed by a pattern and Enter, searches backward                     |

### 5.4 Exit

| Key | Action                                              |
| --- | --------------------------------------------------- |
| `q` | Quit the pager and return to the command line       |
| `h` | Show help, including further commands and options   |
