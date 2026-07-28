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

## IV. less Pager Shortcuts

By default, `git log`, `git diff`, and similar commands display their output in the `less` pager.

### 4.1 Basic Navigation

| Key       | Action           |
| --------- | ---------------- |
| `Space`   | Page down        |
| `b`       | Page up          |
| `↓` / `j` | One line down    |
| `↑` / `k` | One line up      |

### 4.2 Fast Movement

| Key | Action                      |
| --- | --------------------------- |
| `d` | Half a page down            |
| `u` | Half a page up              |
| `g` | Jump to the start of output |
| `G` | Jump to the end of output   |
| `n` | Next search match           |
| `N` | Previous search match       |

### 4.3 Search

| Key | Action                                                                 |
| --- | ---------------------------------------------------------------------- |
| `/` | Followed by a pattern (a regular expression works) and Enter, searches forward |
| `?` | Followed by a pattern and Enter, searches backward                     |

### 4.4 Exit

| Key | Action                                              |
| --- | --------------------------------------------------- |
| `q` | Quit the pager and return to the command line       |
| `h` | Show help, including further commands and options   |
