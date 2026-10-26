## I. Getting Started with the Terminal

### 1.1 Terminals Across Operating Systems

| System      | Default terminal             | Default shell   | Notes               |
| ------- | ---------------- | ---------- | ---------------- |
| macOS   | Terminal.app     | zsh        | iTerm2 is recommended      |
| Linux   | Varies by distribution           | bash/zsh   | Ubuntu defaults to bash   |
| Windows | Windows Terminal | PowerShell | Git Bash/WSL can be installed |

### 1.2 Shell Types

```bash
# Show the current shell
echo $SHELL

# List shells available on the system
cat /etc/shells

# Change the default shell (log in again for it to take effect)
chsh -s /bin/zsh
chsh -s /bin/bash
```

### 1.3 Opening a Terminal

**Mac:**

*   `Command + Space` → type "Terminal" or its localized name
*   Applications → Utilities → Terminal
*   iTerm2 (optional)

### 1.4 Command-Line Shortcuts

These shortcuts apply to shells such as bash and zsh for editing the current line and working with command history:

| Shortcut        | Action           |
| ---------- | ------------ |
| `Tab`      | Autocomplete         |
| `↑` `↓`    | Browse command history       |
| `Ctrl + C` | Terminate the current command       |
| `Ctrl + Z` | Suspend the current process       |
| `Ctrl + D` | Exit the terminal / end input    |
| `Ctrl + L` | Clear the screen (same as clear) |
| `Ctrl + A` | Move to the beginning of the line        |
| `Ctrl + E` | Move to the end of the line        |
| `Ctrl + U` | Delete before the cursor     |
| `Ctrl + K` | Delete after the cursor     |
| `Ctrl + W` | Delete the preceding word    |
| `Alt + D` (or `Esc + D`) | Delete the following word    |
| `Ctrl + Y` | Paste text just deleted with Ctrl+U/K |
| `Ctrl + _` | Undo the last edit (supported by some shells) |
| `Ctrl + R` | Search command history       |

### 1.5 Getting Help

```bash
man commandName  # Read the manual (press q to quit)
commandName --help       # Show help
commandName -h           # Short help
tldr commandName  # Simplified manual (requires tldr)
```

***

## II. Files and Directories

### 2.1 Browsing Directories

```bash
pwd  # Show the current directory path
ls  # List directory contents
ls -l  # Detailed listing: permissions, size, time
ls -la  # Include hidden files
ls -lh  # Human-readable sizes (KB/MB)
ls -lt  # Sort by modification time, newest first
ls -ltr  # Sort by modification time, oldest first
ls -lS  # Sort by size
ls -R  # List subdirectories recursively
ls *.java  # List only .java files
```

### 2.2 Directory Structure

```bash
tree  # Display a directory tree (requires installation)
tree -L 2  # Show only 2 levels
tree -d  # Show directories only
tree -a  # Include hidden files
tree -I "node_modules"  # Exclude a directory
tree > structure.txt  # Save to a file

# Install tree on Mac
brew install tree
```

### 2.3 Changing Directories

```bash
cd directory  # Change to a directory
cd ..  # Go up one level
cd ../..  # Go up two levels
cd /  # Go to the root directory
cd ~  # Go to the user's home directory
cd -  # Return to the previous directory
cd ~/Desktop  # Go to the desktop

# Quick navigation (requires configuration)
pushd directory  # Change directory and push it onto the stack
popd  # Return to the previous directory on the stack
dirs -v  # Display the directory stack
```

### 2.4 Creating and Removing Directories

```bash
mkdir directory  # Create a directory
mkdir -p a/b/c  # Create nested directories
mkdir -p project/{src,bin,doc,lib}  # Create several directories at once

rmdir directory  # Remove an empty directory
rm -r directory  # Remove a directory and its contents
rm -rf directory  # Force removal without prompting; use with care!
```

### 2.5 File Operations

```bash
touch filename  # Create an empty file / update its timestamps
touch file{1..5}.txt  # Create file1.txt through file5.txt

cp sourceFile targetFile  # Copy a file
cp -r sourceDir targetDir  # Copy a directory recursively
cp -i source target  # Prompt before overwriting
cp -v source target  # Show copying progress
cp *.java backup/  # Copy all java files to backup

mv source target  # Move or rename
mv -i source target  # Prompt before overwriting
mv *.txt docs/  # Move all txt files

rm filename  # Remove a file
rm -i filename  # Prompt before removing
rm -f filename  # Force removal
rm *.log  # Remove all log files

ln -s sourceFile linkName  # Create a symbolic link (shortcut)
ln sourceFile linkName  # Create a hard link
```

### 2.6 Viewing Files

```bash
cat filename  # Display the entire file
cat -n filename  # Show line numbers
cat file1 file2 > merged  # Merge files

less filename  # View page by page; scroll up or down
# less shortcuts: Space=next page, b=previous page, /=search, q=quit

more filename  # View page by page; forward only

head filename  # Show the first 10 lines
head -n 20 filename  # Show the first 20 lines
head -c 100 filename  # Show the first 100 bytes

tail filename  # Show the last 10 lines
tail -n 20 filename  # Show the last 20 lines
tail -f filename  # Follow updates in real time; useful for logs
tail -f -n 100 app.log  # Show the last 100 lines and keep following

wc filename  # Count lines, words, and bytes
wc -l filename  # Count lines only
wc -w filename  # Count words only
```

### 2.7 File Permissions

```bash
# Permissions: r=read (4), w=write (2), x=execute (1)
# -rwxr-xr-x: owner rwx, group r-x, others r-x

chmod 755 filename  # Owner: all permissions; others: read and execute
chmod 644 filename  # Owner: read/write; others: read only
chmod +x filename  # Add execute permission
chmod -x filename  # Remove execute permission
chmod u+x filename  # Add execute permission for the owner only
chmod -R 755 directory  # Set directory permissions recursively

chown user filename  # Change the owner
chown user:group filename  # Change owner and group
chown -R user directory  # Change directory ownership recursively

# Inspect permissions
ls -l filename
stat filename  # Show detailed file information
```

***

## III. Text Processing

### 3.1 Searching Text (grep)

```bash
grep "keyword" filename  # Search in a file
grep -i "keyword" filename  # Ignore case
grep -n "keyword" filename  # Show line numbers
grep -r "keyword" directory  # Search a directory recursively
grep -l "keyword" *.java  # Show only matching filenames
grep -c "keyword" filename  # Count matching lines
grep -v "keyword" filename  # Show nonmatching lines
grep -w "word" filename  # Match whole words
grep -A 3 "keyword" filename  # Show matches and 3 following lines
grep -B 3 "keyword" filename  # Show matches and 3 preceding lines
grep -C 3 "keyword" filename  # Show matches with 3 lines on either side
grep -E "regex" filename  # Use extended regular expressions
grep "error\|warning" log.txt  # Match multiple keywords

# Common combinations
ps aux | grep java  # Find Java processes
history | grep git  # Search command history
```

### 3.2 Finding Files (find)

```bash
find . -name "*.java"  # Find java files under the current directory
find / -name "filename"  # Search the entire filesystem
find . -iname "*.Java"  # Ignore case
find . -type f  # Files only
find . -type d  # Directories only
find . -type f -empty  # Find empty files
find . -size +100M  # Files larger than 100MB
find . -size -1k  # Files smaller than 1KB
find . -mtime -7  # Modified within 7 days
find . -mtime +30  # Modified more than 30 days ago
find . -user username  # Files owned by a specified user
find . -perm 755  # Files with specified permissions

# Find and perform an action
find . -name "*.log" -delete  # Find and delete
find . -name "*.java" -exec wc -l {} \;  # Count lines in each file
find . -name "*.txt" -exec grep "keyword" {} \;  # Search inside the files found

# Exclude a directory
find . -name "*.js" -not -path "./node_modules/*"
```

### 3.3 Text Processing Tools

```bash
# sort: sort lines
sort filename  # Alphabetical sort
sort -n filename  # Numeric sort
sort -r filename  # Reverse order
sort -k2 filename  # Sort by column 2
sort -t: -k3 -n /etc/passwd  # Specify a delimiter and sort numerically by column 3
sort -u filename  # Sort and remove duplicates

# uniq: remove duplicates (sort first)
sort filename | uniq  # Remove duplicate lines
sort filename | uniq -c  # Count repetitions
sort filename | uniq -d  # Show repeated lines only

# cut: extract columns
cut -d: -f1 /etc/passwd  # Use : as the delimiter and select column 1
cut -d, -f1,3 data.csv  # Select columns 1 and 3
cut -c1-10 filename  # Select the first 10 characters of each line

# awk: powerful text processing
awk '{print $1}' filename  # Print column 1
awk '{print $1, $3}' filename  # Print columns 1 and 3
awk -F: '{print $1}' /etc/passwd  # Specify the delimiter
awk 'NR==5' filename  # Print line 5
awk 'NR>=5 && NR<=10' filename  # Print lines 5–10
awk '/keyword/' filename  # Lines matching the keyword
awk '{sum+=$1} END {print sum}' filename  # Sum

# sed: stream editor
sed 's/old/new/' filename  # Replace the first match
sed 's/old/new/g' filename  # Replace all matches
sed -i 's/old/new/g' filename  # Edit the file in place (on Mac, use sed -i '')
sed -n '5p' filename  # Print line 5
sed -n '5,10p' filename  # Print lines 5–10
sed '5d' filename  # Delete line 5
sed '/keyword/d' filename  # Delete matching lines
```

### 3.4 Pipes and Redirection

```bash
# Redirection
command > file  # Write output to a file, overwriting it
command >> file  # Append output to a file
command 2> file  # Write error output to a file
command 2>&1  # Merge error output into standard output
command > file 2>&1  # Write all output to a file
command < file  # Read input from a file
command > /dev/null  # Discard output
command 2> /dev/null  # Discard error output

# Pipes
command1 | command2  # Feed command1's output into command2's input
ls -l | grep ".java"  # Filter java files
cat log.txt | grep error | wc -l  # Count lines containing errors
ps aux | sed '1d' | sort -k3,3nr | head -n 10  # Sort by column 3, %CPU (column 4 is %MEM)
history | awk '{print $2}' | sort | uniq -c | sort -rn | head -10  # Most frequently used commands

# Combine commands
command1 && command2  # Run command2 if command1 succeeds
command1 || command2  # Run command2 if command1 fails
command1 ; command2  # Run in sequence regardless of success or failure
```

### 3.5 Clipboard Operations (Mac)

```bash
# Mac only
command | pbcopy  # Copy output to the clipboard
pbpaste  # Print clipboard contents
pbpaste > file.txt  # Save clipboard contents to a file

# Examples
pwd | pbcopy  # Copy the current path
cat file.txt | pbcopy  # Copy file contents
```

***

## IV. System Administration

### 4.1 Process Management

```bash
ps  # Show processes in the current terminal
ps aux  # Show all processes in detail
ps aux | grep java  # Find Java processes
ps -ef  # Show all processes in another format

top  # View processes in real time; q to quit
top -o cpu  # Sort by CPU usage
top -o mem  # Sort by memory usage
htop  # More user-friendly top (requires installation)

kill PID  # Terminate a process with SIGTERM
kill -9 PID  # Force termination with SIGKILL
kill -l  # List all signals
killall processName  # Terminate by process name
killall -9 java  # Force-terminate all Java processes
pkill processName  # Terminate by name pattern
pkill -f "java.*Main"  # Match the full command line and terminate

# Run in the background
command &  # Run a command in the background
nohup command &  # Keep running after the terminal exits
nohup java -jar app.jar > app.log 2>&1 &  # Common form

jobs  # List background jobs
fg %1  # Bring job 1 to the foreground
bg %1  # Move job 1 to the background
```

### 4.2 System Information

```bash
uname -a  # Show system information
uname -s  # Operating system name
uname -r  # Kernel version
sw_vers  # macOS version information (Mac only)

hostname  # Show the hostname
whoami  # Current username
id  # Current user's ID and groups
who  # Logged-in users
w  # Logged-in users and their activity
uptime  # System uptime and load

date  # Show date and time
date +"%Y-%m-%d %H:%M:%S"  # Format the date
cal  # Display a calendar
```

### 4.3 Disk and Memory

```bash
df -h  # Human-readable disk usage
df -H  # Use powers of 1000
du -sh directory  # Show directory size
du -sh *  # Show the size of each item in the current directory
du -sh * | sort -rh  # Sort by size

free -h  # Memory usage (Linux)
vm_stat  # Memory statistics (Mac)
top -l 1 | head -n 10  # Inspect memory (Mac)

# Find large files
find . -size +100M -type f -exec ls -lh {} \;
du -sh * | sort -rh | head -20
```

### 4.4 Networking Commands

```bash
# Network tests
ping domain/IP  # Test connectivity
ping -c 5 baidu.com  # Send 5 pings
ping6 domain  # IPv6 ping

traceroute domain  # Trace the route
mtr domain  # Combines ping and traceroute (requires installation)

# Inspect network configuration
ifconfig  # Network interfaces (Mac/older Linux)
ip addr  # Network interfaces (modern Linux)
ip route  # Routing table

# Inspect connections
netstat -an  # Show all connections
netstat -an | grep LISTEN  # Show listening ports
netstat -an | grep :8080  # Inspect port 8080
lsof -i :8080  # Show the process using port 8080 (common on Mac)
lsof -i -P | grep LISTEN  # Show all listening ports

ss -tuln  # Show listening ports (Linux; faster than netstat)

# DNS queries
nslookup domain  # DNS lookup
dig domain  # Detailed DNS lookup
dig +short domain  # Concise output
host domain  # Look up a domain's IP address

# HTTP requests
curl URL  # Fetch a web page
curl -I URL  # Fetch response headers only
curl -X POST -d "data" URL  # POST request
curl -o filename URL  # Download a file
curl -O URL  # Download using the original filename
curl -L URL  # Follow redirects
curl -s URL  # Silent mode
curl -v URL  # Verbose output

wget URL  # Download a file (requires installation)
wget -c URL  # Resume an interrupted download
wget -r URL  # Download recursively
```

### 4.5 Ports and Firewalls

```bash
# Inspect ports on Mac
lsof -i :port
netstat -an | grep port

# Mac firewall: manage through System Preferences
# Or use pfctl

# Linux firewall
sudo ufw status  # Show firewall status
sudo ufw enable  # Enable the firewall
sudo ufw allow 22  # Allow port 22
sudo ufw deny 3306  # Deny port 3306
```

***

## V. Development Tools

### 5.1 Git Commands

```bash
# Configuration
git config --global user.name "Your Name"
git config --global user.email "your-email"
git config --list  # Show configuration

# Basic operations
git init  # Initialize a repository
git clone URL  # Clone a repository
git status  # Show status
git add filename  # Stage a file
git add .  # Stage all files
git commit -m "message"    # Commit
git commit -am "message"   # Stage and commit tracked files

# Branches
git branch  # List local branches
git branch -a  # List all branches
git branch branchName  # Create a branch
git checkout branchName  # Switch branches
git checkout -b branchName  # Create and switch to a branch
git switch branchName  # Switch branches (new syntax)
git switch -c branchName  # Create and switch (new syntax)
git merge branchName  # Merge a branch
git branch -d branchName  # Delete a branch

# Remotes
git remote -v  # List remotes
git remote add origin URL  # Add a remote
git push -u origin main  # Push and set the upstream
git push  # Push
git pull  # Pull
git fetch  # Fetch remote updates

# Inspect history
git log  # Show commit history
git log --oneline  # Concise output
git log --graph  # Graph view
git log -p filename  # Show a file's change history
git diff  # Show unstaged changes
git diff --staged  # Show staged changes
git blame filename  # Show who last changed each line

# Undo changes
git checkout -- filename  # Discard working-tree changes
git restore filename  # Discard working-tree changes (new syntax)
git reset HEAD filename  # Unstage a file
git restore --staged filename  # Unstage a file (new syntax)
git reset --soft HEAD~1  # Undo the latest commit, keeping changes
git reset --hard HEAD~1  # Undo the latest commit, discarding changes
git revert commitID  # Undo with a new commit

# Stashing
git stash  # Stash current changes
git stash list  # List stashes
git stash pop  # Restore and remove the stash
git stash apply  # Restore the stash
git stash drop  # Delete the stash
```

### 5.2 Package Management

```bash
# Homebrew (Mac)
brew --version  # Show version
brew update  # Update Homebrew
brew upgrade  # Upgrade all packages
brew install packageName  # Install
brew uninstall packageName  # Uninstall
brew list  # List installed packages
brew search keyword  # Search
brew info packageName  # Show package information
brew services list  # Show service status
brew services start service  # Start a service
brew services stop service  # Stop a service

# npm (Node.js)
npm -v  # Show version
npm init  # Initialize a project
npm install  # Install dependencies
npm install packageName  # Install a package
npm install -g packageName  # Install globally
npm install --save-dev packageName  # Install as a development dependency
npm uninstall packageName  # Uninstall
npm list  # List installed packages
npm list -g --depth=0  # List globally installed packages
npm update  # Update dependencies
npm run scriptName  # Run a script
npm cache clean --force  # Clear the cache

# pip (Python)
pip --version  # Show version
pip install packageName  # Install
pip install -r requirements.txt  # Install from a requirements file
pip uninstall packageName  # Uninstall
pip list  # List installed packages
pip freeze > requirements.txt  # Export dependencies
pip install --upgrade packageName  # Upgrade a package
```

### 5.3 SSH and Remote Operations

```bash
# SSH connections
ssh username@serverIP  # Connect to a server
ssh -p port username@IP  # Specify the port
ssh -i keyFile username@IP  # Use a key

# SSH keys
ssh-keygen  # Generate a key pair
ssh-keygen -t rsa -b 4096 -C "your-email"   # Specify key type and bit count
ssh-copy-id username@IP  # Copy the public key to the server
cat ~/.ssh/id_rsa.pub  # View the public key

# File transfer
scp localFile username@IP:remotePath  # Upload a file
scp username@IP:remoteFile localPath  # Download a file
scp -r localDir username@IP:remotePath  # Upload a directory
scp -P port file username@IP:path  # Specify the port

# rsync: more powerful synchronization
rsync -av sourceDir/ targetDir/  # Synchronize directories
rsync -av --delete source/ target/  # Mirror: delete extra destination files
rsync -avz local/ username@IP:remote/  # Remote synchronization with compression
rsync -avz --progress source/ target/  # Show progress
```

### 5.4 Common Docker Commands

```bash
# Images
docker images  # List images
docker pull imageName  # Pull an image
docker rmi imageID  # Remove an image
docker build -t name .  # Build an image

# Containers
docker ps  # List running containers
docker ps -a  # List all containers
docker run imageName  # Run a container
docker run -d imageName  # Run in the background
docker run -p 8080:80 imageName  # Map ports
docker run -v local:container imageName  # Mount a directory
docker run -it imageName /bin/bash  # Interactive mode
docker start containerID  # Start a container
docker stop containerID  # Stop a container
docker restart containerID  # Restart a container
docker rm containerID  # Remove a container
docker exec -it containerID /bin/bash  # Open a shell in a container
docker logs containerID  # View logs
docker logs -f containerID  # Follow logs in real time

# Docker Compose
docker-compose up  # Start services
docker-compose up -d  # Start in the background
docker-compose down  # Stop and remove
docker-compose ps  # Show status
docker-compose logs  # View logs

# Cleanup
docker system prune  # Remove unused data
docker volume prune  # Remove unused volumes
```

***

## VI. Java Development Environment

### 6.1 Basic JDK Commands

```bash
java -version  # Show the Java version
java --version  # New format in JDK 9+
javac -version  # Show the compiler version
which java  # Find the java executable

# Compile and run
javac HelloWorld.java  # Compile
java HelloWorld  # Run
java HelloWorld.java  # Run a source file directly (JDK 11+)

# Compiler options
javac -d bin src/*.java  # Write compiled output to bin
javac -encoding UTF-8 *.java  # Specify the encoding
javac -source 11 -target 11 *.java  # Specify the version

# Runtime options
java -cp bin com.example.Main  # Specify the classpath
java -jar app.jar  # Run a JAR
java -Xms512m -Xmx1024m Main  # Set heap memory sizes
java -Dkey=value Main  # Set a system property

# JAR operations
jar -cvf app.jar -C bin .  # Create a JAR
jar -tvf app.jar  # List JAR contents
jar -xvf app.jar  # Extract a JAR
```

### 6.2 JDK Tools

```bash
# Processes and monitoring
jps  # List Java processes: PID + main class
jps -l  # Show fully qualified main class names
jps -v  # Show JVM arguments

# Thread stack diagnostics: deadlocks, thread leaks, 100% CPU
jstack <pid>  # Dump all thread call stacks
jstack <pid> | grep -A 30 "BLOCKED"  # Filter blocked threads

# Heap diagnostics
jcmd <pid> GC.heap_info  # Heap overview (modern JDK; jmap -heap is legacy syntax)
jmap -histo <pid>  # Show instance counts and memory usage by class
jmap -dump:format=b,file=heap.hprof <pid>  # Export a heap dump (.hprof) for MAT/VisualVM analysis

# GC monitoring: -gcutil shows region usage percentages + GC counts/times
jstat -gc <pid> 1000  # Detailed GC data every second
jstat -gcutil <pid> 1000  # GC percentage statistics: S0/S1/E/O/M utilization

# Visual tools
jconsole  # Graphical monitoring (JMX)
jvisualvm  # Visual performance analysis: CPU, heap, threads, heap dumps

# Other tools
jshell  # Interactive programming (JDK 9+)
javadoc -d doc src/*.java  # Generate documentation
jlink  # Modular packaging (JDK 9+)
```

### 6.3 Maven Commands

```bash
mvn -version  # Show version

# Lifecycle
mvn clean  # Clean the target directory
mvn compile  # Compile
mvn test  # Run tests
mvn package  # Package
mvn install  # Install into the local repository
mvn deploy  # Deploy to a remote repository

# Common combinations
mvn clean package  # Clean and package
mvn clean package -DskipTests  # Package while skipping tests
mvn clean install -U  # Force snapshot dependency updates

# Dependency management
mvn dependency:tree  # Show the dependency tree
mvn dependency:resolve  # Resolve dependencies
mvn dependency:analyze  # Analyze dependencies

# Spring Boot
mvn spring-boot:run  # Run Spring Boot

# Other commands
mvn archetype:generate  # Generate a project skeleton
mvn versions:display-dependency-updates  # Check for dependency updates
```

### 6.4 Gradle Commands

```bash
gradle -version  # Show version

# Build
gradle build  # Build
gradle clean  # Clean
gradle test  # Run tests
gradle jar  # Package a JAR
gradle build -x test  # Skip tests

# Dependencies
gradle dependencies  # Show dependencies
gradle dependencies --configuration runtimeClasspath  # Runtime dependencies

# Tasks
gradle tasks  # List available tasks
gradle tasks --all  # List all tasks

# Spring Boot
gradle bootRun  # Run Spring Boot
gradle bootJar  # Package an executable JAR

# Use the wrapper (recommended)
./gradlew build  # Use the project's wrapper
./gradlew bootRun
```

### 6.5 Environment Variables

```bash
# Inspect environment variables
echo $JAVA_HOME
echo $PATH
echo $CLASSPATH
env  # Show all environment variables
printenv  # Same as above

# Temporary settings
export JAVA_HOME=/path/to/jdk
export PATH=$JAVA_HOME/bin:$PATH

# Persistent settings: add to a configuration file
# zsh: edit ~/.zshrc
# bash: edit ~/.bash_profile or ~/.bashrc

# Example configuration (~/.zshrc)
export JAVA_HOME=$(/usr/libexec/java_home)
export PATH=$JAVA_HOME/bin:$PATH
export MAVEN_HOME=/usr/local/maven
export PATH=$MAVEN_HOME/bin:$PATH

# Apply the configuration
source ~/.zshrc
```

***

## VII. Shell Script Basics

### 7.1 Basic Syntax

```bash
#!/bin/bash             # Select the interpreter (shebang)
#!/bin/zsh              # Use zsh

# Comments
# This is a line comment

: '
This is a multiline comment
It may contain many lines
'

# Run a script
chmod +x script.sh  # Add execute permission
./script.sh  # Run the script
bash script.sh  # Run directly with bash
source script.sh  # Run in the current shell
```

### 7.2 Variables

```bash
# Define variables (no spaces around =)
name="Java"
age=25
readonly PI=3.14  # Read-only variable

# Use variables
echo $name
echo ${name}  # Recommended form
echo "Hello, ${name}!"

# Assign command output
current_dir=$(pwd)
file_count=`ls | wc -l`  # Backtick syntax (not recommended)

# Special variables
$0  # Script name
$1, $2, ...  # Positional parameters
$#  # Number of arguments
$@  # All arguments as separate strings
$*  # All arguments as a single string
$?  # Exit status of the previous command
$$  # Current process PID

# Read user input
read -p "Enter your name: " username
echo "Hello, $username"
```

### 7.3 Conditions

```bash
# if statement
if [ condition ]; then
    command
elif [ condition ]; then
    command
else
    command
fi

# File tests
[ -e file ]  # File exists
[ -f file ]  # Regular file
[ -d directory ]  # Directory
[ -r file ]  # Readable
[ -w file ]  # Writable
[ -x file ]  # Executable
[ -s file ]  # Nonempty file

# String tests
[ -z "$str" ]  # String is empty
[ -n "$str" ]  # String is nonempty
[ "$str1" = "$str2" ]  # Strings are equal
[ "$str1" != "$str2" ]  # Strings differ

# Numeric comparisons
[ $a -eq $b ]  # Equal
[ $a -ne $b ]  # Not equal
[ $a -gt $b ]  # Greater than
[ $a -lt $b ]  # Less than
[ $a -ge $b ]  # Greater than or equal to
[ $a -le $b ]  # Less than or equal to

# Logical operations
[ condition1 ] && [ condition2 ]  # AND
[ condition1 ] || [ condition2 ]  # OR
[ ! condition ]  # NOT

# Use [[ ]] for more capabilities (recommended)
[[ $str =~ regex ]]  # Regex match
[[ $a > $b ]]  # Lexicographical comparison

# Example
if [ -f "config.txt" ]; then
    echo "Configuration file exists"
else
    echo "Configuration file does not exist"
fi
```

### 7.4 Loops

```bash
# for loop
for i in 1 2 3 4 5; do
    echo $i
done

for i in {1..10}; do  # Range
    echo $i
done

for i in {1..10..2}; do  # Step of 2
    echo $i
done

for file in *.txt; do  # Iterate over files
    echo $file
done

for ((i=0; i<10; i++)); do  # C-style loop
    echo $i
done

# while loop
count=1
while [ $count -le 5 ]; do
    echo $count
    ((count++))
done

# Read each line in a file
while read line; do
    echo $line
done < file.txt

# until loop: execute while the condition is false
until [ $count -gt 5 ]; do
    echo $count
    ((count++))
done

# Loop control
break  # Exit the loop
continue  # Skip the current iteration
```

### 7.5 Functions

```bash
# Define a function
function greet() {
    echo "Hello, $1!"
}

# Another syntax
greet() {
    echo "Hello, $1!"
}

# Call a function
greet "World"

# Return a value
add() {
    local sum=$(($1 + $2))  # local declares a local variable
    echo $sum  # Return output through echo
}

result=$(add 3 5)
echo "Result: $result"

# return accepts only an integer from 0 to 255
check_file() {
    if [ -f "$1" ]; then
        return 0
    else
        return 1
    fi
}

if check_file "test.txt"; then
    echo "File exists"
fi
```

### 7.6 Practical Script Examples

```bash
#!/bin/bash
# Example 1: Rename files in bulk
for file in *.txt; do
    mv "$file" "prefix_$file"
done

# Example 2: Backup script
backup_dir="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"
cp -r src/* "$backup_dir/"
echo "Backup complete: $backup_dir"

# Example 3: Find and delete large files
find . -size +100M -type f -exec rm -i {} \;

# Example 4: Monitor a service
check_service() {
    if pgrep -x "$1" > /dev/null; then
        echo "$1 is running"
    else
        echo "$1 is not running; starting..."
        # Command to start the service
    fi
}
check_service "nginx"

# Example 5: Process Java projects in bulk
for dir in */; do
    if [ -f "${dir}pom.xml" ]; then
        echo "Building project: $dir"
        (cd "$dir" && mvn clean package -DskipTests)
    fi
done
```

***

## VIII. Windows-Specific Commands (Reference)

### 8.1 Common CMD Commands

```batch
:: File operations
dir                     :: List directory contents (like ls)
cd                      :: Change directory
md / mkdir              :: Create directory
rd / rmdir              :: Remove directory
copy                    :: Copy files
move                    :: Move files
del                     :: Delete files
ren                     :: Rename
type                    :: Display file contents (like cat)
tree                    :: Display directory tree

:: System commands
systeminfo              :: System information
tasklist                :: List processes (like ps)
taskkill /pid PID /f    :: Terminate a process (like kill -9)
taskkill /im name.exe /f:: Terminate by name

:: Network commands
ipconfig                :: IP configuration (like ifconfig)
ipconfig /all           :: Detailed configuration
ipconfig /flushdns      :: Clear DNS cache
ping                    :: Test connectivity
netstat -ano            :: Show network connections
netstat -ano | findstr :8080   :: Show port usage

:: Service management
net start               :: List services
net start serviceName   :: Start a service
net stop serviceName    :: Stop a service
sc query                :: Query service status
```

### 8.2 PowerShell Basics

```powershell
# PowerShell supports many Unix command names through aliases
ls                      # Get-ChildItem
cd                      # Set-Location
pwd                     # Get-Location
cat                     # Get-Content
cp                      # Copy-Item
mv                      # Move-Item
rm                      # Remove-Item
mkdir                   # New-Item -ItemType Directory

# PowerShell-specific commands
Get-Process  # List processes
Stop-Process -Name java -Force  # Terminate processes
Get-Service  # List services
Start-Service serviceName  # Start a service
Get-NetTCPConnection  # Show network connections

# Environment variables
$env:JAVA_HOME  # Show an environment variable
$env:Path -split ';'  # Display PATH entries on separate lines
```

### 8.3 Command Comparison

| Action   | Mac/Linux   | Windows CMD         | PowerShell               |
| ---- | ----------- | ------------------- | ------------------------ |
| List directory contents | `ls`        | `dir`               | `ls` / `dir`             |
| Change directory | `cd`        | `cd`                | `cd`                     |
| Current directory | `pwd`       | `cd`                | `pwd`                    |
| Create directory | `mkdir`     | `md` / `mkdir`      | `mkdir`                  |
| Remove directory | `rm -r`     | `rd /s`             | `rm -r`                  |
| Copy files | `cp`        | `copy`              | `cp`                     |
| Move files | `mv`        | `move`              | `mv`                     |
| Delete files | `rm`        | `del`               | `rm`                     |
| View a file | `cat`       | `type`              | `cat`                    |
| Clear screen   | `clear`     | `cls`               | `cls` / `clear`          |
| List processes | `ps aux`    | `tasklist`          | `Get-Process`            |
| Terminate processes | `kill PID`  | `taskkill /pid PID` | `Stop-Process`           |
| Network configuration | `ifconfig`  | `ipconfig`          | `Get-NetIPAddress`       |
| Find files | `find`      | `dir /s`            | `Get-ChildItem -Recurse` |
| Search text | `grep`      | `findstr`           | `Select-String`          |
| Environment variables | `echo $VAR` | `echo %VAR%`        | `$env:VAR`               |

***

## Appendix: Command Quick Reference

### File Operations

| Command          | Action          |
| ----------- | ----------- |
| `ls -la`    | List all files, including hidden files |
| `cd`        | Change directory        |
| `pwd`       | Show current path      |
| `mkdir -p`  | Create nested directories      |
| `rm -rf`    | Force removal        |
| `cp -r`     | Recursive copy        |
| `mv`        | Move/rename      |
| `touch`     | Create a file        |
| `cat`       | View a file        |
| `less`      | View page by page        |
| `head/tail` | View beginning/end     |
| `chmod`     | Change permissions        |
| `chown`     | Change owner       |

### Text Processing

| Command     | Action       |
| ------ | -------- |
| `grep` | Search text     |
| `find` | Find files     |
| `sort` | Sort       |
| `uniq` | Remove duplicates       |
| `wc`   | Count lines/words/bytes |
| `cut`  | Extract columns      |
| `awk`  | Process text     |
| `sed`  | Stream editing      |

### System Administration

| Command         | Action          |
| ---------- | ----------- |
| `ps aux`   | List processes        |
| `top/htop` | Monitor in real time        |
| `kill -9`  | Force-terminate a process      |
| `df -h`    | Disk usage        |
| `du -sh`   | Directory size        |
| `free -h`  | Memory usage (Linux) |

### Networking Commands

| Command            | Action        |
| ------------- | --------- |
| `ping`        | Test connectivity     |
| `curl`        | HTTP requests   |
| `wget`        | Download files      |
| `ssh`         | Remote connection      |
| `scp`         | Remote copy      |
| `netstat -an` | Network connections      |
| `lsof -i :port` | Inspect ports (Mac) |

### Common Development Commands

| Command                  | Action        |
| ------------------- | --------- |
| `git status`        | Show status      |
| `git pull/push`     | Pull/push     |
| `docker ps`         | List containers      |
| `mvn clean package` | Maven packaging  |
| `./gradlew build`   | Gradle build |
| `npm install`       | Install dependencies      |
| `brew install`      | Install software on Mac  |
