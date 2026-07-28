# Git Remote Collaboration

## I. Managing Remotes

### 1.1 Commands

```bash
git remote -v                              # List all remotes
git remote add <remote> <remote-url>       # Add a remote
git remote remove <remote>                 # Remove a remote
git remote set-url <remote> <remote-url>   # Change a remote's URL
git remote show <remote>                   # Show detailed information about a remote
git remote rename <old-name> <new-name>    # Rename a remote
```

### 1.2 Notes

- The remote name is arbitrary; `origin` is the convention
- The remote URL is copied from the hosting service and normally comes in two forms: HTTPS and SSH (SSH requires a key pair)

***

## II. Connecting to a Remote

### 2.1 First Push of a New Project

```bash
git init
git add .
git commit -m "<message>"
git remote add origin <remote-url>
git push -u origin <branch>
```

### 2.2 Connecting an Existing Project

```bash
git remote add origin <remote-url>
git push -u origin <branch>
```

***

## III. Remote Branches

### 3.1 Get a Remote Branch

```bash
git checkout <branch>          # Create a local branch from the remote one and switch to it
git fetch origin <branch>      # Fetch the remote branch only, without switching
```

### 3.2 Push Branches

```bash
git push -u <remote> <branch>  # Push the current branch to a remote branch and set up tracking
git push --all                 # Push all local branches to the default remote
git push --all <remote>        # Push all local branches to a given remote
```

### 3.3 Delete a Remote Branch

```bash
git push <remote> --delete <branch>
```

### 3.4 Tracking (Upstream)

**Tracking** is the relationship between a local branch and a remote branch, also called the **upstream**. Once it is set, pushing and pulling no longer need the remote and branch names spelled out.

```bash
git branch -vv                                     # Show which remote branch each local branch tracks
git branch --set-upstream-to=<remote>/<branch>     # Set the upstream of the current branch
git branch --unset-upstream                        # Remove the upstream of the current branch
```

***

## IV. Pushing

```bash
git push                          # Push the current branch to its upstream
git push <remote>                 # Push the current branch to its upstream, or to the same-named branch, on a given remote
git push <remote> <branch>        # Push the current branch to a given remote branch
git push -f                       # Force-push (overwrites remote history; use with care)
git push --force-with-lease       # Safe force-push (refused if the remote has new commits)
```

> **Note**: `--force-with-lease` is safer than `-f` — if the remote branch contains commits from someone else, the push is refused instead of overwriting their work.

***

## V. Fetching and Pulling

### 5.1 Fetch

Downloads the latest commits from the remote without merging them into the local branch.

```bash
git fetch                     # Fetch from the default remote
git fetch --all               # Fetch from all remotes
git fetch <remote>            # Fetch from a given remote
git fetch <remote> <branch>   # Fetch a given remote branch
git fetch --prune             # Fetch and clean up references to remote branches that no longer exist
```

### 5.2 Pull

Fetches the remote commits and merges them into the current branch (equivalent to `fetch` + `merge`).

```bash
git pull                      # Pull the upstream of the current branch and merge
git pull <remote> <branch>    # Pull a given remote branch and merge
git pull --rebase             # Pull with rebase (keeps history linear)
```

| Command             | Equivalent to      | Result                                    |
| ------------------- | ------------------ | ----------------------------------------- |
| `git fetch`         | —                  | Local branch untouched                    |
| `git pull`          | `fetch` + `merge`  | May create a merge commit                 |
| `git pull --rebase` | `fetch` + `rebase` | No merge commit; history stays linear     |
