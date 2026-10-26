## I. Linux Overview

### 1.1 What Is Linux?

Linux is an open-source, Unix-like operating system kernel first released by Linus Torvalds in 1991. In everyday usage, "Linux" refers to the various operating system distributions based on the Linux kernel.

### 1.2 Linux vs. Other Systems

| Feature | Linux | Windows | macOS |
| -------- | -------------------- | ---------------- | ---------------- |
| Open source | Yes (GPL license) | No | Partially |
| Cost | Free | Paid | Bundled with hardware |
| Main uses | Servers, development, embedded systems | Desktop, office work, gaming | Desktop, development, design |
| Command line | Core way of operating | Supplementary | One of the core interfaces |
| Software installation | Package manager | Installers | App Store / brew |

### 1.3 Common Linux Distributions

| Distribution | Characteristics | Use cases |
| ------------------------ | ------------------------ | ---------------------- |
| **Ubuntu** | Easy to use, active community, extensive documentation | Beginners, development, servers |
| **CentOS / Rocky Linux** | Stable, enterprise-grade, long-term support | Production servers |
| **Debian** | Stable, clean, long history | Servers, base images |
| **Alpine** | Extremely lightweight (about 5MB) | Docker container base images |
| **Arch Linux** | Rolling releases, highly customizable | Advanced users, learning |

### 1.4 Linux Directory Structure

Linux uses a tree-like directory structure, with everything starting at the root directory `/`:

```
/
├── bin         # Basic commands (ls, cp, mv, etc.)
├── boot        # Boot files (kernel, bootloader)
├── dev         # Device files (disks, terminals, etc.)
├── etc         # System configuration files
├── home        # Regular users' home directories (e.g. /home/username)
├── lib         # Shared libraries
├── opt         # Third-party software installation directory
├── root        # Home directory of the root user
├── srv         # Data for services provided by this machine (e.g. /srv/mysql, /srv/nginx)
├── tmp         # Temporary files
├── usr         # User programs and data
│   ├── bin     # User commands
│   ├── lib     # Libraries
│   └── local   # Locally installed software
└── var         # Variable data (logs, caches, databases, etc.)
    └── log     # System logs
```

Other common directories include `/proc` (process and system information; a virtual filesystem), `/run` (runtime data), `/mnt` (temporary mount points), and `/media` (removable media mounts). Distributions may differ slightly.

### 1.5 Connecting to Linux Remotely

In practice, Linux servers usually have no graphical interface and are accessed remotely through **SSH**:

```bash
# Basic syntax
ssh username@serverIP

# Specify a port (default: 22)
ssh -p 2222 username@serverIP

# Log in with a key
ssh -i ~/.ssh/id_rsa username@serverIP
```

Common SSH clients:
- **Mac/Linux:** Built-in terminal, iTerm2
- **Windows:** PuTTY, Windows Terminal, MobaXterm
- **Cross-platform graphical clients:** Royal TSX, Termius, FinalShell

***

## II. Common Linux Commands

### 2.1 Command Format

**General Linux command format:**

```bash
command [-options] [parameter]
```

**Format explanation:**

| Component | Description | Required? |
| --------------- | ---------------------------- | -------- |
| **command** | Command name | Required |
| **[-options]** | Options controlling command behavior | Optional |
| **[parameter]** | Zero, one, or more arguments | Optional |

**Examples:**

```bash
# 1. Command only
ls

# 2. Command + option
ls -l           # -l is an option requesting a detailed listing

# 3. Command + argument
ls /home        # /home is an argument specifying the directory to inspect

# 4. Command + option + argument
ls -l /home     # -l is an option; /home is an argument

# 5. Multiple options
ls -l -a        # Can also be written as ls -la
# -l: detailed listing
# -a: show hidden files

# 6. Multiple arguments
cp file1.txt file2.txt  # Both file1.txt and file2.txt are arguments
```

**Notes:**

- Options usually start with `-` (short options) or `--` (long options), such as `-l` and `--help`
- Multiple short options can be combined: `-l -a` is equivalent to `-la`
- Separate commands, options, and arguments with spaces
- Linux commands are case-sensitive: `ls` and `LS` are different commands

***

### 2.2 Directory and File Operations

#### 2.2.1 Changing Directories

```bash
cd /home/user      # Change to the specified directory
cd ..              # Go to the parent directory
cd ~               # Go to the current user's home directory
cd -               # Return to the previous directory
pwd                # Show the current directory's absolute path
```

#### 2.2.2 Listing Directory Contents

```bash
ls                 # List the current directory's contents
ls -l              # Detailed listing (permissions, size, time, etc.)
ls -la             # Include hidden files (names starting with .)
ls -lh             # Human-readable file sizes (KB, MB, GB)
ls -lt             # Sort by modification time (newest first)
```

Example output explained:

```
-rw-r--r--  1 user group  4096 Jan 29 10:00 file.txt
│└──┬───┘  │  │    │      │         │        └── Filename
│   │      │  │    │      │         └── Modification time
│   │      │  │    │      └── File size (bytes)
│   │      │  │    └── Group
│   │      │  └── Owner
│   │      └── Hard link count
│   └── Permissions (r: read, w: write, x: execute; owner/group/others)
└── File type (-: regular file, d: directory, l: link)
```

#### 2.2.3 Creating Directories and Files

```bash
mkdir dirname           # Create a directory
mkdir -p a/b/c          # Create nested directories recursively
touch file.txt          # Create an empty file (or update its timestamps)
```

#### 2.2.4 Copying, Moving, and Deleting

```bash
# Copy
cp file1 file2          # Copy a file
cp -r dir1 dir2         # Copy a directory recursively

# Move/rename
mv file1 file2          # Rename a file
mv file1 /path/to/      # Move a file to the specified directory

# Delete
rm file.txt             # Delete a file
rm -r dirname           # Delete a directory recursively
rm -rf dirname          # Force recursive deletion (use with care!)

# Symbolic links (commonly used, e.g. to point to the current version directory)
ln -s /path/to/target linkname    # Create a symbolic link
ls -l linkname                    # Show its target
```

> **Warning:** `rm -rf /` deletes the entire system. Never run it!

### 2.3 Viewing File Contents

```bash
cat file.txt            # Display the entire file
head -n 20 file.txt     # Display the first 20 lines
tail -n 20 file.txt     # Display the last 20 lines
tail -f file.txt        # Follow the end of the file in real time (commonly used for logs)
less file.txt           # View page by page (press q to quit)
more file.txt           # View page by page (forward only)
```

### 2.4 Editing Files

#### 2.4.1 vi/vim Editor

vim is Linux's most commonly used text editor, with three modes:

| Mode | Description | How to enter |
| ------------ | ---------------------------------- | -------------------------------- |
| **Normal mode** | Default mode: move the cursor, delete, copy, etc. | Press `Esc` |
| **Insert mode** | Edit text | Press `i` (before cursor) or `a` (after cursor) |
| **Command-line mode** | Save, quit, search, etc. | Press `:` in normal mode |

Common operations:

```bash
vim file.txt            # Open a file

# Normal mode
i                       # Enter insert mode (before cursor)
a                       # Enter insert mode (after cursor)
o                       # Insert on the next line
dd                      # Delete the current line
yy                      # Copy the current line
p                       # Paste
u                       # Undo
gg                      # Jump to the beginning of the file
G                       # Jump to the end of the file
/keyword                # Search (n: next, N: previous)

# Command-line mode (press Esc, then :)
:w                      # Save
:q                      # Quit
:wq                     # Save and quit
:q!                     # Force quit (without saving)
:set nu                 # Show line numbers
```

#### 2.4.2 nano Editor

A simpler editor than vim, suitable for beginners:

```bash
nano file.txt           # Open a file

# Common shortcuts (^ means Ctrl)
^O                      # Save
^X                      # Quit
^K                      # Cut the current line
^U                      # Paste
^W                      # Search
```

### 2.5 Finding Files

```bash
# find: locate files by conditions
find /path -name "*.log"           # Find by name
find /path -type f -size +10M      # Find files larger than 10MB
find /path -mtime -7               # Find files modified in the last 7 days

# grep: search file contents
grep "keyword" file.txt            # Search for a keyword
grep -r "keyword" /path            # Search a directory recursively
grep -i "keyword" file.txt         # Ignore case
grep -n "keyword" file.txt         # Show line numbers
grep -v "keyword" file.txt         # Show lines without the keyword

# which: locate a command
which java                         # Show the path of the java command
```

### 2.6 Permission Management

#### 2.6.1 Understanding Permissions

Linux file permissions have three groups: **owner (u)**, **group (g)**, and **others (o)**. Each group has three permission types:

| Permission | Letter | Number | Meaning for files | Meaning for directories |
| ---- | ---- | ---- | ------------ | ------------- |
| Read | r | 4 | View contents | List directory contents |
| Write | w | 2 | Modify contents | Create/delete files |
| Execute | x | 1 | Run a program | Enter the directory |

#### 2.6.2 Changing Permissions

```bash
# chmod: change permissions
chmod 755 file.sh       # Owner: rwx; group and others: r-x
chmod u+x file.sh       # Add execute permission for the owner
chmod go-w file.txt     # Remove write permission for group and others
chmod -R 755 dirname    # Change directory permissions recursively

# chown: change ownership
chown user file.txt              # Change the owner
chown user:group file.txt        # Change both owner and group
chown -R user:group dirname      # Change recursively
```

#### 2.6.3 Users and Groups (Brief Overview)

```bash
whoami                  # Current username
id                      # Current user's UID, GID, and groups
id username             # Information about a specified user
groups                  # Current user's groups

# Add a user to a group (requires root; often used for the docker group to run Docker without sudo)
sudo usermod -aG groupname username
# Log in again or run newgrp groupname for the change to take effect
```

Common permission combinations:

| Number | Permissions | Common use cases |
| ---- | --------- | -------------------------- |
| 755 | rwxr-xr-x | Executables, directories |
| 644 | rw-r--r-- | Regular files |
| 600 | rw------- | Private files (such as keys) |
| 777 | rwxrwxrwx | Everyone can read, write, and execute (not recommended) |

### 2.7 Process Management

```bash
# View processes
ps -ef                  # Show all processes
ps -ef | grep java      # Find Java processes
ps aux                  # Show processes in another format
top                     # View processes in real time (q to quit)
htop                    # A friendlier top (requires installation)

# Terminate processes
kill PID                # Terminate a process normally
kill -9 PID             # Force-terminate a process

# Run in the background
nohup command &         # Run in the background and continue after the terminal exits
nohup java -jar app.jar > log.txt 2>&1 &
```

### 2.8 Networking

```bash
# View network information
ip addr                 # Show IP addresses (new command)
ifconfig                # Show IP addresses (older command)
hostname -I             # Show only IP addresses

# Network connectivity
ping www.baidu.com      # Test network connectivity
curl http://localhost   # Send an HTTP request
wget http://url/file    # Download a file

# Ports and connections
netstat -tlnp           # Show listening ports
ss -tlnp                # Faster command for inspecting ports
lsof -i :8080           # Show processes using port 8080
```

### 2.9 System Information

```bash
# System information
uname -a                # Kernel information
cat /etc/os-release     # Distribution information
hostname                # Hostname
uptime                  # Uptime and load

# Resource usage
free -h                 # Memory usage
df -h                   # Disk usage
du -sh /path            # Directory size
```

### 2.10 Archiving and Compression

```bash
# tar (archive/extract, often combined with gzip)
tar -cvf archive.tar files/      # Create an archive
tar -xvf archive.tar             # Extract an archive
tar -czvf archive.tar.gz files/  # Archive and compress
tar -xzvf archive.tar.gz         # Extract a compressed archive

# zip/unzip
zip -r archive.zip files/        # Compress
unzip archive.zip                # Extract
unzip archive.zip -d /path/      # Extract to a specified directory
```

Option meanings:
- `-c`: Create
- `-x`: Extract
- `-v`: Show progress (verbose)
- `-f`: Specify the filename
- `-z`: Use gzip compression

### 2.11 Other Common Commands

```bash
# Pipes and redirection
command1 | command2     # Pipe: pass the first command's output to the second command's input
command > file          # Redirect standard output to a file (overwrite)
command >> file         # Append to a file
command 2>&1            # 2: stderr, 1: stdout; 2>&1 redirects errors to stdout (often combined with > file)

# Examples
ps -ef | grep java      # Find Java processes
cat file | wc -l        # Count lines
echo "hello" > a.txt    # Write to a file

# Other commands
clear                   # Clear the screen
history                 # Show command history
!!                      # Run the previous command
sudo command            # Run as administrator
```

***

## III. Installing Software on Linux

### 3.1 Package Managers

Different distributions use different package managers:

| Distribution | Package manager | Package format |
| ------------- | --------- | ------------ |
| Ubuntu/Debian | apt       | .deb         |
| CentOS/RHEL   | yum / dnf | .rpm         |
| Alpine        | apk       | .apk         |
| Arch          | pacman    | .pkg.tar.zst |

### 3.2 apt (Ubuntu/Debian)

```bash
# Update package indexes
sudo apt update

# Upgrade installed software
sudo apt upgrade

# Install software
sudo apt install nginx

# Uninstall software
sudo apt remove nginx           # Keep configuration files
sudo apt purge nginx            # Remove configuration files
sudo apt autoremove             # Remove dependencies no longer needed

# Search for software
apt search keyword

# List installed packages
apt list --installed

# View package information
apt show nginx
```

**When to remove old versions before installation:**

When installing software from a third-party repository (such as Docker CE or Node.js), first remove old versions from the system repository to avoid conflicts:

```bash
# Example: remove older versions before installing Docker CE
sudo apt remove docker docker-engine docker.io containerd runc
sudo apt autoremove
```

### 3.3 yum/dnf (CentOS/RHEL)

```bash
# Install software
sudo yum install nginx
sudo dnf install nginx          # Use dnf on CentOS 8+

# Update software
sudo yum update

# Uninstall software
sudo yum remove nginx
sudo yum autoremove             # Remove dependencies no longer needed

# Search for software
yum search keyword

# List installed packages
yum list installed

# View package information
yum info nginx
```

**When to remove old versions before installation:**

```bash
# Example: remove older versions before installing Docker CE
sudo yum remove docker docker-client docker-common docker-engine
```

### 3.4 Manual Installation (Binary Packages)

Some software is unavailable through the package manager and must be installed manually:

```bash
# 1. Download
wget https://example.com/software.tar.gz

# 2. Extract
tar -xzvf software.tar.gz

# 3. Move to a suitable location
sudo mv software /opt/

# 4. Configure environment variables (optional)
echo 'export PATH=$PATH:/opt/software/bin' >> ~/.bashrc
source ~/.bashrc
```

### 3.5 Installing the JDK

#### Approach 1: Package Manager (Recommended)

```bash
# Ubuntu
sudo apt update
sudo apt install openjdk-17-jdk

# Verify
java -version
```

#### Approach 2: Manual Installation

```bash
# 1. Download the JDK (from Oracle or Adoptium)
wget https://example.com/jdk-17_linux-x64.tar.gz

# 2. Extract to /opt
sudo tar -xzvf jdk-17_linux-x64.tar.gz -C /opt

# 3. Configure environment variables
sudo nano /etc/profile.d/java.sh

# Add the following:
export JAVA_HOME=/opt/jdk-17
export PATH=$PATH:$JAVA_HOME/bin

# 4. Apply the changes
source /etc/profile.d/java.sh

# 5. Verify
java -version
```

### 3.6 Installing MySQL

```bash
# Ubuntu
sudo apt update
sudo apt install mysql-server

# Start the service
sudo systemctl start mysql
sudo systemctl enable mysql     # Enable startup at boot

# Security configuration
sudo mysql_secure_installation

# Log in
sudo mysql -u root -p
```

### 3.7 Installing Nginx

```bash
# Ubuntu
sudo apt update
sudo apt install nginx

# Start
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify (visit http://serverIP)
curl http://localhost
```

### 3.8 Managing Services with systemctl

```bash
# Service management
sudo systemctl start nginx      # Start
sudo systemctl stop nginx       # Stop
sudo systemctl restart nginx    # Restart
sudo systemctl reload nginx     # Reload configuration
sudo systemctl status nginx     # View status

# Startup at boot
sudo systemctl enable nginx     # Enable
sudo systemctl disable nginx    # Disable

# List services
systemctl list-units --type=service
```

***

## IV. Project Deployment

### 4.1 Deployment Process Overview

A typical Java project deployment process:

1. **Prepare the environment:** Install the JDK, database, middleware, etc.
2. **Upload the project:** Upload the jar/war to the server (use `/srv/appName` on the host; for Docker deployments, `/srv/serviceName` is also recommended for host mount paths)
3. **Configure the project:** Update configuration files (database connections, ports, etc.)
4. **Start the project:** Run the jar or deploy to Tomcat
5. **Configure a reverse proxy:** Use Nginx as the proxy and open ports 80/443
6. **Inspect logs:** Monitor runtime status

### 4.2 Uploading Files to the Server

```bash
# scp: transfer files over SSH
scp local_file user@server:/remote/path
scp -r local_dir user@server:/remote/path     # Directory

# Example: place the file in the user's home directory
scp target/app.jar username@serverIP:/home/username/

# Example: for /srv/app, first run sudo mkdir -p /srv/app on the server and chown it to the runtime user
scp target/app.jar username@serverIP:/srv/app/

# Download from the server
scp user@server:/remote/file local_path
```

You can also upload graphically using SFTP clients such as Royal TSX or FileZilla. Production environments commonly keep applications in `/srv/appName` or `/opt`. Create the directory as root, then run `chown runtimeUser:group /srv/appName` so the application user can write logs and update configuration.

### 4.3 Deploying a Spring Boot Project

#### 4.3.1 Run the jar Directly

If the project resides in a directory requiring root to create, such as `/srv/app`, use `sudo chown runtimeUser:group /srv/app` so the application user can write logs and create temporary files.

```bash
# Run in the foreground (stops when the terminal closes)
java -jar app.jar

# Run in the background (redirect to a log for troubleshooting)
nohup java -jar app.jar > app.log 2>&1 &

# Specify configuration
nohup java -jar app.jar --spring.profiles.active=prod > app.log 2>&1 &

# Specify a port
nohup java -jar app.jar --server.port=8080 > app.log 2>&1 &
```

#### 4.3.2 Manage with Scripts

Create the startup script `start.sh`:

```bash
#!/bin/bash
APP_NAME=app.jar
LOG_FILE=app.log

# Check whether the application is already running
PID=$(ps -ef | grep $APP_NAME | grep -v grep | awk '{print $2}')
if [ -n "$PID" ]; then
    echo "Application is already running, PID: $PID"
    exit 1
fi

# Start
nohup java -jar $APP_NAME > $LOG_FILE 2>&1 &
echo "Application started, PID: $!"
```

Create the shutdown script `stop.sh`:

```bash
#!/bin/bash
APP_NAME=app.jar

PID=$(ps -ef | grep $APP_NAME | grep -v grep | awk '{print $2}')
if [ -z "$PID" ]; then
    echo "Application is not running"
    exit 0
fi

kill $PID
echo "Application stopped, PID: $PID"
```

Grant execute permission:

```bash
chmod +x start.sh stop.sh
```

### 4.4 Configuring an Nginx Reverse Proxy

Edit the Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/default
```

Example configuration:

```nginx
server {
    listen 80;
    server_name example.com;    # Domain name or IP

    location / {
        proxy_pass http://127.0.0.1:8080;    # Backend address
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Reload Nginx:

```bash
sudo nginx -t               # Check configuration syntax
sudo systemctl reload nginx # Reload
```

### 4.5 Viewing Logs

```bash
# View log files
cat app.log
tail -n 100 app.log         # Last 100 lines
tail -f app.log             # Follow in real time (common)

# Search for keywords
grep "ERROR" app.log
grep -n "Exception" app.log  # Show line numbers

# System logs
sudo tail -f /var/log/syslog
sudo journalctl -u nginx -f  # View nginx service logs
```

### 4.6 Firewall Configuration

```bash
# Ubuntu (ufw)
sudo ufw status             # View status
sudo ufw allow 80           # Open port 80
sudo ufw allow 443          # Open port 443
sudo ufw allow 22           # Allow SSH (open port 22 before enable to avoid locking yourself out)
sudo ufw enable             # Enable the firewall
sudo ufw reload             # Run if changed rules do not take effect automatically

# CentOS (firewalld)
sudo firewall-cmd --list-all
sudo firewall-cmd --add-port=80/tcp --permanent
sudo firewall-cmd --reload
```

### 4.7 Troubleshooting

| Problem | Diagnostic command |
| ------------ | ------------------------------------------ |
| Application did not start | `ps -ef \| grep java` |
| Port already in use | `lsof -i :8080` or `ss -tlnp \| grep 8080` |
| Cannot access the application | `curl http://localhost:8080`; check the firewall |
| Insufficient memory | `free -h`; check available |
| Disk is full | `df -h`; check Use% |
| Inspect error logs | `tail -f app.log`; search for ERROR/Exception |

***

## V. Common Command Reference

| Category | Commands | Description |
| -------- | ----------------------------- | -------------------------- |
| **Directories** | `cd`, `pwd`, `ls`, `mkdir` | Change, inspect, and create directories |
| **Files** | `cp`, `mv`, `rm`, `touch`, `ln -s` | Copy, move, delete, create, and link files |
| **Viewing** | `cat`, `head`, `tail`, `less` | View file contents |
| **Editing** | `vim`, `nano` | Edit files |
| **Searching** | `find`, `grep`, `which` | Find files/content |
| **Permissions** | `chmod`, `chown` | Change permissions/ownership |
| **Users** | `whoami`, `id`, `groups`, `usermod -aG` | Current user, group memberships, add users to groups |
| **Processes** | `ps`, `top`, `kill`, `nohup` | View/terminate processes, run in background |
| **Network** | `ip addr`, `ping`, `curl`, `ss`, `scp` | Network information, testing, ports, file transfer |
| **System** | `free`, `df`, `uname` | Memory, disk, and system information |
| **Compression** | `tar`, `zip`, `unzip` | Archive, compress, and extract |
| **Services** | `systemctl` | Service management |
| **Software** | `apt`, `yum` | Package management |
