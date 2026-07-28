# Git Basic Operations

## I. Obtaining a Repository

### 1.1 Initialize a Local Repository

```bash
git init
```

- Run it inside the directory that should become a Git repository
- It creates a hidden `.git` subdirectory that holds Git's version-control data and configuration

### 1.2 Clone a Remote Repository

```bash
git clone <remote-url>                          # Clone a repository
git clone <remote-url> <directory>              # Clone into a specific directory
git clone --depth 1 <remote-url>                # Shallow clone (latest commit only, good for large repositories)
git clone -b <branch> <remote-url>              # Clone a specific branch
git clone --recurse-submodules <remote-url>     # Clone and initialize submodules
```

***

## II. Basic Workflow

### 2.1 Check the Status

```bash
git status       # Status of the current branch
git status -s    # Compact output
```

### 2.2 Stage Changes

```bash
git add <file>               # Add a single file
git add *.<extension>        # Add every file with the given extension
git add .                    # Add all changes under the current directory
git add -p                   # Stage interactively, hunk by hunk
```

### 2.3 Unstage Changes

```bash
git reset HEAD <file>        # Unstage (working-directory changes are kept)
git restore --staged <file>  # Unstage (recommended, Git 2.23+)
```

### 2.4 Commit Changes

```bash
git commit -m "<message>"           # Create a new commit
git commit -am "<message>"          # Stage and commit in one step (tracked files only)
git commit --amend                  # Reword the last commit / fold new changes into it
```

> **Note**: `git commit --amend` rewrites history. If the commit has already been pushed, the amended version has to be published with `git push --force`.

***

## III. Viewing History

### 3.1 Commands

```bash
# Whole history
git log                        # Commit history of the current branch
git log -n 5                   # Limit to a given number of commits
git log --all                  # Commit history of all branches
git log --oneline              # Compress each commit to one line
git log --graph                # Draw the history as a graph
git log --author="<username>"  # Filter by author
git log -p                     # Show the diff of every commit
git log --stat                 # Show per-commit file statistics

# A single file
git log <file-path>                    # Commit history of one file
git log -p <file-path>                 # Detailed diff of every change to the file
git log -- <file-path starting with -> # Commit history of a file whose path starts with -

# A single commit
git show <hash>                # Full diff of one commit
git show --stat <hash>         # Which files one commit touched

# Line-by-line authorship
git blame <file-path>          # Last author of each line in the file
```

### 3.2 Notes

- The long string after `commit` is the commit hash; it is used for resetting, comparing, and so on, and only a prefix needs to be copied
- `--` marks the end of the option list; it can be omitted when the file path does not start with `-`
- Output opens in the `less` pager: `Space` / `b` page down and up, `/<pattern>` searches forward, `q` quits

***

## IV. Comparing Differences

```bash
git diff                          # Working directory vs. index
git diff --cached                 # Index vs. the last commit
git diff HEAD                     # Working directory vs. the last commit
git diff <old-hash> <new-hash>    # One commit vs. another
git diff <branch1> <branch2>      # One branch vs. another
git diff HEAD~<n> HEAD            # The commit n steps back vs. the current commit
```

***

## V. Undoing and Restoring

### 5.1 Discard Working-Directory Changes

```bash
git checkout -- <file-path>       # Discard changes in the working directory
git restore <file-path>           # Discard changes in the working directory (recommended, Git 2.23+)
```

### 5.2 Reset Commits

```bash
git reset --soft <hash>      # Move to the given commit, keep the changes staged
git reset <hash>             # Move to the given commit, leave the changes in the working directory
git reset --hard <hash>      # Move to the given commit, discard all changes (use with care)
git revert <hash>            # Undo a commit with a new commit (keeps history; preferred for pushed commits)
```

| Command        | Rewrites history | Where the changes end up      | Safe for pushed commits |
| -------------- | ---------------- | ----------------------------- | ----------------------- |
| `reset --soft` | Yes              | Index                         | No                      |
| `reset`        | Yes              | Working directory             | No                      |
| `reset --hard` | Yes              | Discarded                     | No                      |
| `revert`       | No               | A new inverse commit          | **Yes**                 |

### 5.3 Restore a Single File to a Given Version

```bash
git checkout <hash> <file-path>                       # Restore the file, change lands in the index
git checkout <hash> -- <file-path starting with ->    # Restore a file whose path starts with -
git restore --source <hash> <file-path>               # Restore the file, change lands in the working directory (Git 2.23+)
```

### 5.4 Clean Untracked Files

```bash
git clean -n     # Preview which files would be deleted
git clean -f     # Delete untracked files
git clean -fd    # Delete untracked files and directories
```

> 💡 Always run `git clean -n` first — the deletion is not recoverable through Git.

***

## VI. File Status Flags

### 6.1 The Two Columns of git status

```bash
git status --porcelain     # Machine-readable status, unambiguous
```

The output uses two letters, `XY`: `X` compares the index with `HEAD`, `Y` compares the working directory with the index. A space means nothing changed at that level.

| Code        | Meaning                                                       |
| ----------- | ------------------------------------------------------------- |
| `M `        | Modification staged, working directory clean                   |
| ` M`        | Modified in the working directory, not staged                  |
| `MM`        | Staged, then modified again                                    |
| `A `        | New file staged                                                |
| `AM`        | New file staged, then modified again                           |
| `D `        | Deletion staged                                                |
| ` D`        | Deleted in the working directory, not staged                   |
| `R `        | Rename staged                                                  |
| `C `        | Copy staged                                                    |
| `T ` / ` T` | Type changed (regular file ↔ symlink ↔ submodule)              |
| `??`        | Untracked                                                      |
| `!!`        | Ignored (only shown with `--ignored`)                          |

### 6.2 Single Letters in a Diff

`git diff --name-status` and the `--diff-filter` option use one letter per file:

| Letter | Meaning                                                                      |
| ------ | ---------------------------------------------------------------------------- |
| `A`    | Added — the path did not exist before                                        |
| `M`    | Modified — the content changed                                                |
| `D`    | Deleted                                                                       |
| `R`    | Renamed, followed by a similarity score (`R100`, `R087`)                     |
| `C`    | Copied from an existing file (only with `--find-copies`)                     |
| `T`    | Type changed — regular file ↔ symlink ↔ submodule                            |
| `U`    | Unmerged — the file is conflicted                                             |
| `B`    | Broken pairing — a rename too dissimilar to keep, split back into add+delete  |
| `X`    | Unknown — should never appear, it indicates a bug in Git                     |

### 6.3 Conflict Codes

During a merge both columns are used together and say *who* changed what:

| Code | Meaning                    |
| ---- | -------------------------- |
| `UU` | Both modified (the common one) |
| `AA` | Both added                 |
| `DD` | Both deleted               |
| `AU` | Added by us                |
| `UA` | Added by them              |
| `DU` | Deleted by us              |
| `UD` | Deleted by them            |

### 6.4 How VS Code Displays Them

VS Code collapses the two columns into a single letter and relies on the group heading — **Staged Changes**, **Changes**, **Merge Changes** — to show which column the letter came from.

| Letter | Meaning                                                          |
| ------ | ---------------------------------------------------------------- |
| `M`    | Modified                                                          |
| `A`    | Added, or intent-to-add                                           |
| `D`    | Deleted                                                           |
| `R`    | Renamed                                                           |
| `C`    | Copied                                                            |
| `T`    | Type changed                                                      |
| `U`    | **Untracked** — not the same as Git's own `U` for unmerged        |
| `I`    | Ignored                                                           |

Conflicted files are moved into a separate **Merge Changes** group instead of being given a plain letter.

> **Note**: the same letter means different things in different groups — `M` under Staged Changes is `M `, `M` under Changes is ` M`. Fall back to `git status --porcelain` whenever the distinction matters.
