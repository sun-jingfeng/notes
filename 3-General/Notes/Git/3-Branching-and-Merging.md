# Git Branching and Merging

## I. Branch Operations

### 1.1 List Branches

```bash
git branch           # Local branches
git branch -r        # Remote branches
git branch -a        # Local and remote branches
git branch -av       # Local and remote branches with their last commit
git branch -vv       # Local branches with the remote branch each one tracks
```

### 1.2 Create a Branch

```bash
git branch <new-branch>                 # Create a branch from the current branch
git branch <new-branch> <base-branch>   # Create a branch from a given branch
```

### 1.3 Switch Branches

```bash
git checkout <branch>       # Switch to a local branch
git checkout -b <branch>    # Create a branch and switch to it
git switch <branch>         # Switch to a local branch (recommended, Git 2.23+)
git switch -c <branch>      # Create a branch and switch to it (recommended, Git 2.23+)
```

### 1.4 Rename a Branch

```bash
git branch -m <new-name>              # Rename the current branch
git branch -m <old-name> <new-name>   # Rename a given branch
```

### 1.5 Delete a Branch

```bash
git branch -d <branch>      # Delete a local branch (only if already merged)
git branch -D <branch>      # Force-delete a local branch (even if unmerged)
```

***

## II. Merging Branches

### 2.1 Commands

```bash
git merge <branch>                              # Merge a branch into the current branch and commit automatically
git merge --no-commit <branch>                  # Merge without committing
git merge --squash <branch>                     # Apply the branch's changes as a single commit
git merge <branch1> <branch2> ... <branchN>     # Merge several branches into the current branch
git merge --abort                               # Abort a merge that hit conflicts
```

### 2.2 Resolving Conflicts

① Edit each conflicted file and remove the conflict markers:

| Marker    | Meaning                          |
| --------- | -------------------------------- |
| `<<<<<<<` | Content from the current branch  |
| `=======` | Separator                        |
| `>>>>>>>` | Content from the incoming branch |

② Stage the resolved files: `git add <file>`

③ Finish the merge: `git commit` or `git merge --continue`

### 2.3 Tracking Down the Source of a Conflict

When conflicts make no sense (for example, merging in the order dev → test → uat still produces a large number of them), first identify the commit that introduced them:

```bash
git merge-base <branchA> <branchB>              # Merge base of two branches
git log --oneline <branchA>..<branchB>          # Commits in B that A does not have
git merge-base --is-ancestor <hash> <branch>    # Whether a commit is already in the branch (exit code 0 = yes)
git show --name-only --format="" <hash>         # Files changed by one commit
git diff --name-only --diff-filter=U            # Files currently in a conflicted (unmerged) state
git diff --name-status <branchA> <branchB>      # File-level differences between two branches
```

**Technique**: compare the list of conflicted files against the list of files a suspect commit touched — a strong overlap confirms the conflict originates from that commit.

### 2.4 Conflicts Caused by a Revert

**Cause**: a feature was undone with `revert` on branch A while the same feature continued to be developed on branch B. The merge base contains the feature, side A deleted it, side B modified it, so a conflict is unavoidable. Such conflict blocks typically have **one empty side** rather than a genuine content disagreement.

**Pitfall**: only files changed on *both* sides are reported as conflicts. **Files touched only by the revert, and never touched again on the target branch, silently take the reverted content** with no conflict at all — the feature is quietly rolled back, leaving half-finished code with dangling references.

That is also why `git merge -X theirs <branch>` is not reliable here: it only decides **conflict blocks**, the silent files keep their reverted content, and the merge "succeeds" with broken code.

Finding the silently affected files:

```bash
git show --name-only --format="" <revert-hash> | sort -u > /tmp/a.txt   # Files the revert changed
git diff --name-only <merge-base> <target-branch> | sort -u > /tmp/b.txt # Files the target branch changed
comm -23 /tmp/a.txt /tmp/b.txt                                          # Only in a = silently reverted
```

### 2.5 Making the Merge Result Match the Target Branch Exactly

When the current branch should adopt the target branch's content wholesale (for example, realigning after revert contamination), there is no need to delete and recreate the branch, and no need to force-push:

```bash
git merge --no-commit --no-ff <target-branch>     # Conflicts are expected here and left unresolved
git read-tree -u --reset <target-branch>          # Drop the conflict state; index and working directory become the target branch's content
git commit --no-edit -m "Merge branch '<target-branch>' into <current-branch>"
```

**Why it works**: `MERGE_HEAD` still exists when `read-tree -u --reset` runs, so the result is still a **normal merge commit with two parents** — history stays intact and the target branch is correctly recorded as merged.

Verifying the result:

```bash
git diff --stat HEAD <target-branch>                # Empty output = the two are identical
git merge-base --is-ancestor <target-branch> HEAD   # Exit code 0 = the target branch is fully merged in
```

**Advantage over deleting and recreating the branch**: it does not run into remote branch-protection rules, and the revert commit is preserved in history and stays traceable.

### 2.6 Rehearsing a Merge Without Touching the Working Directory

When a merge strategy is uncertain, try it in a separate directory with a worktree — neither the working directory nor an in-progress merge is affected:

```bash
git worktree add -q --detach <temp-directory> <branch>   # Check the branch out into a temporary directory
# Run the merge inside the temporary directory and inspect the result
git worktree remove --force <temp-directory>             # Remove the temporary worktree
git worktree list                                        # List all worktrees
```

***

## III. Rebasing

### 3.1 Commands

```bash
git rebase <branch>         # Rebase the current branch onto a given branch
git rebase -i HEAD~<n>      # Interactive rebase over the last n commits
git rebase -i <hash>        # Interactive rebase starting from a given commit
git rebase --continue       # Continue after resolving conflicts
git rebase --abort          # Abort the rebase and return to the previous state
```

### 3.2 Interactive Rebase

**Rewording historical commit messages:**

① Change `pick` to `r` (reword) for every commit whose message should change, then save and exit

② Edit each message in turn, saving and exiting each time

**Squashing several commits into one:**

① Change `pick` to `s` (squash) for every commit to be folded in, then save and exit

② Edit the combined commit message, then save and exit

### 3.3 Notes

- Rebasing rewrites history — **never rebase commits that have already been pushed**
- Rebasing the current branch does not affect other branches

***

## IV. Cherry-pick

Applies selected commits to the current branch.

```bash
git cherry-pick <commit>                     # Apply one commit to the current branch
git cherry-pick <commit1> <commit2>          # Apply several commits in order
git cherry-pick <commit1>..<commit2>         # Apply commit1 (exclusive) through commit2 (inclusive)
git cherry-pick <commit1>^..<commit2>        # Apply commit1 (inclusive) through commit2 (inclusive)
git cherry-pick -n <commit>                  # Do not commit; leave the changes in the index
git cherry-pick --skip                       # Skip the current commit when it conflicts
git cherry-pick --continue                   # Continue after resolving conflicts
git cherry-pick --abort                      # Abort and return to the previous state
```

***

## V. Recovering an Accidentally Deleted Branch

```bash
git reflog                         # Inspect the operation log and find the commit before the deletion
git checkout -b <branch> <hash>    # Create a new branch from that commit
```
