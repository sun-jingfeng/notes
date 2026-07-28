# Git Configuration

## I. User Information

### 1.1 Commands

```bash
# Set
git config --global user.name "<username>"
git config --global user.email "<email>"

# Query
git config --global user.name
git config --global user.email

# View all configuration
git config --list
git config --list --show-origin    # Show where each setting comes from
```

### 1.2 Configuration Scope

| Scope      | Applies to                                              |
| ---------- | ------------------------------------------------------- |
| `--local`  | The current repository only (**default**)               |
| `--global` | All repositories of the current operating-system user   |
| `--system` | All repositories of all users on the machine            |

***

## II. SSH Keys

### 2.1 Generate a Key Pair

```bash
ssh-keygen -t ed25519 -C "<comment>"        # Generate with the ED25519 algorithm (recommended)
ssh-keygen -t rsa -b 4096 -C "<comment>"    # Generate with the 4096-bit RSA algorithm
```

### 2.2 Setup Procedure

① Run the command for the chosen algorithm and press Enter repeatedly to accept the defaults

② In the hidden `.ssh` folder under the user's home directory, open the file ending in `.pub` and copy its entire contents (this is the public key)

③ Add the public key to the remote host (GitHub, GitLab, Gitee, etc.)

### 2.3 Test the Connection

```bash
ssh -T git@github.com    # Test the GitHub connection
ssh -T git@gitlab.com    # Test the GitLab connection
ssh -T git@gitee.com     # Test the Gitee connection
```

> 💡 One machine's public key can be added to multiple remote hosts, and one remote host can accept public keys from multiple machines.

***

## III. Common Configuration Options

```bash
# Default editor
git config --global core.editor "vim"
git config --global core.editor "code --wait"    # VS Code

# Default branch name for new repositories
git config --global init.defaultBranch main

# Use rebase instead of merge when pulling
git config --global pull.rebase true

# Handle line endings automatically (recommended for cross-platform work)
git config --global core.autocrlf input    # macOS/Linux
git config --global core.autocrlf true     # Windows

# Enable colored output
git config --global color.ui auto

# Cache credentials (avoids retyping the password)
git config --global credential.helper cache                  # Cache for 15 minutes
git config --global credential.helper 'cache --timeout=3600' # Cache for 1 hour
```

***

## IV. Git Aliases

Aliases shorten frequently used commands.

### 4.1 How to Define One

```bash
git config --global alias.<alias> '<command>'
```

### 4.2 Common Aliases

```bash
# Shorten everyday commands
git config --global alias.co 'checkout'
git config --global alias.br 'branch'
git config --global alias.ci 'commit'
git config --global alias.st 'status'

# Prettier log output
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.ll "log --oneline -n 10"

# Show the last commit
git config --global alias.last 'log -1 HEAD'

# Unstage files
git config --global alias.unstage 'reset HEAD --'
```

### 4.3 Usage

```bash
git co main       # Same as git checkout main
git st            # Same as git status
git lg            # Show the formatted commit graph
```

***

## V. .gitignore

### 5.1 Purpose

A `.gitignore` file lists the files and directories Git should ignore and keep out of version control.

### 5.2 Common Rules

```gitignore
# Ignore specific files
config.local.js
.env

# Ignore specific directories
node_modules/
dist/
build/
.idea/

# Ignore by extension
*.log
*.tmp
*.class

# Ignore all .a files, but keep lib.a
*.a
!lib.a

# Ignore TODO in the root directory only, not in subdirectories
/TODO

# Ignore every .pdf under the doc directory
doc/**/*.pdf
```

### 5.3 Files That Are Already Tracked

Adding a path to `.gitignore` does not ignore a file that Git already tracks — it must be untracked first:

```bash
git rm --cached <file>           # Untrack a single file
git rm -r --cached <directory>   # Untrack a whole directory
```

> 💡 `git rm --cached` removes the file from the index only; the copy in the working directory is kept.
