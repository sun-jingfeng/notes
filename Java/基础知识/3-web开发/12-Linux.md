## 一、Linux 概述

### 1.1 什么是 Linux

Linux 是一种开源的、类 Unix 的操作系统内核，由 Linus Torvalds 于 1991 年首次发布。通常所说的 "Linux" 指的是基于 Linux 内核的各种操作系统发行版。

### 1.2 Linux 与其他系统的区别

| 特性     | Linux                | Windows          | macOS            |
| -------- | -------------------- | ---------------- | ---------------- |
| 开源     | 是（GPL 协议）       | 否               | 部分开源         |
| 费用     | 免费                 | 付费             | 随硬件           |
| 主要用途 | 服务器、开发、嵌入式 | 桌面、办公、游戏 | 桌面、开发、设计 |
| 命令行   | 核心操作方式         | 辅助             | 核心之一         |
| 软件安装 | 包管理器             | 安装程序         | App Store / brew |

### 1.3 常见 Linux 发行版

| 发行版                   | 特点                     | 适用场景               |
| ------------------------ | ------------------------ | ---------------------- |
| **Ubuntu**               | 易用、社区活跃、文档丰富 | 入门学习、开发、服务器 |
| **CentOS / Rocky Linux** | 稳定、企业级、长期支持   | 生产服务器             |
| **Debian**               | 稳定、纯净、历史悠久     | 服务器、基础镜像       |
| **Alpine**               | 极轻量（约 5MB）         | Docker 容器基础镜像    |
| **Arch Linux**           | 滚动更新、高度可定制     | 高级用户、学习         |

### 1.4 Linux 目录结构

Linux 采用树状目录结构，所有内容都从根目录 `/` 开始：

```
/
├── bin         # 基本命令（ls、cp、mv 等）
├── boot        # 启动相关文件（内核、引导程序）
├── dev         # 设备文件（硬盘、终端等）
├── etc         # 系统配置文件
├── home        # 普通用户家目录（如 /home/用户名）
├── lib         # 共享库文件
├── opt         # 第三方软件安装目录
├── root        # root 用户的家目录
├── tmp         # 临时文件
├── usr         # 用户程序和数据
│   ├── bin     # 用户命令
│   ├── lib     # 库文件
│   └── local   # 本地安装的软件
└── var         # 可变数据（日志、缓存、数据库等）
    └── log     # 系统日志
```

### 1.5 远程连接 Linux

在实际工作中，Linux 服务器通常没有图形界面，需要通过 **SSH** 远程连接：

```bash
# 基本语法
ssh 用户名@服务器IP

# 示例
ssh 用户名@服务器IP

# 指定端口（默认 22）
ssh -p 2222 用户名@服务器IP

# 使用密钥登录
ssh -i ~/.ssh/id_rsa 用户名@服务器IP
```

常用 SSH 客户端：
- **Mac/Linux**：系统自带终端、iTerm2
- **Windows**：PuTTY、Windows Terminal、MobaXterm
- **跨平台图形化**：Royal TSX、Termius、FinalShell

***

## 二、Linux 常用命令

### 2.1 命令格式

**Linux 命令的通用格式：**

```bash
command [-options] [parameter]
```

**格式说明：**

| 组成部分        | 说明                         | 是否必需 |
| --------------- | ---------------------------- | -------- |
| **command**     | 命令名                       | 必需     |
| **[-options]**  | 选项，用来控制命令的行为     | 可选     |
| **[parameter]** | 参数，可以是零个、一个或多个 | 可选     |

**示例：**

```bash
# 1. 只有命令
ls

# 2. 命令 + 选项
ls -l           # -l 是选项，表示以详细列表格式显示

# 3. 命令 + 参数
ls /home        # /home 是参数，指定要查看的目录

# 4. 命令 + 选项 + 参数
ls -l /home     # -l 是选项，/home 是参数

# 5. 多个选项
ls -l -a        # 或写成 ls -la
# -l：详细列表
# -a：显示隐藏文件

# 6. 多个参数
cp file1.txt file2.txt  # file1.txt 和 file2.txt 都是参数
```

**注意事项：**

- 选项前通常有 `-`（短选项）或 `--`（长选项），如 `-l`、`--help`
- 多个短选项可以合并：`-l -a` 等价于 `-la`
- 命令、选项、参数之间用空格分隔
- Linux 命令区分大小写：`ls` 和 `LS` 是不同的命令

***

### 2.2 目录和文件操作

#### 2.2.1 目录切换

```bash
cd /home/user      # 切换到指定目录
cd ..              # 返回上一级目录
cd ~               # 返回当前用户家目录
cd -               # 返回上一次所在目录
pwd                # 显示当前目录的绝对路径
```

#### 2.2.2 查看目录内容

```bash
ls                 # 列出当前目录内容
ls -l              # 详细列表（权限、大小、时间等）
ls -la             # 包含隐藏文件（以 . 开头的文件）
ls -lh             # 人类可读的文件大小（KB、MB、GB）
ls -lt             # 按修改时间排序（最新在前）
```

输出示例解读：

```
-rw-r--r--  1 user group  4096 Jan 29 10:00 file.txt
│└──┬───┘  │  │    │      │         │        └── 文件名
│   │      │  │    │      │         └── 修改时间
│   │      │  │    │      └── 文件大小（字节）
│   │      │  │    └── 所属组
│   │      │  └── 所有者
│   │      └── 硬链接数
│   └── 权限（r读 w写 x执行，分别对应：所有者/组/其他）
└── 文件类型（- 普通文件，d 目录，l 链接）
```

#### 2.2.3 创建目录和文件

```bash
mkdir dirname           # 创建目录
mkdir -p a/b/c          # 递归创建多级目录
touch file.txt          # 创建空文件（或更新时间戳）
```

#### 2.2.4 复制、移动、删除

```bash
# 复制
cp file1 file2          # 复制文件
cp -r dir1 dir2         # 递归复制目录

# 移动/重命名
mv file1 file2          # 重命名文件
mv file1 /path/to/      # 移动文件到指定目录

# 删除
rm file.txt             # 删除文件
rm -r dirname           # 递归删除目录
rm -rf dirname          # 强制递归删除（慎用！）
```

> **警告**：`rm -rf /` 会删除整个系统，永远不要执行！

### 2.3 文件内容查看

```bash
cat file.txt            # 显示文件全部内容
head -n 20 file.txt     # 显示前 20 行
tail -n 20 file.txt     # 显示后 20 行
tail -f file.txt        # 实时跟踪文件末尾（常用于看日志）
less file.txt           # 分页查看（按 q 退出）
more file.txt           # 分页查看（只能向下翻）
```

### 2.4 文件编辑

#### 2.4.1 vi/vim 编辑器

vim 是 Linux 最常用的文本编辑器，有三种模式：

| 模式         | 说明                               | 进入方式                         |
| ------------ | ---------------------------------- | -------------------------------- |
| **命令模式** | 默认模式，可移动光标、删除、复制等 | 按 `Esc`                         |
| **插入模式** | 编辑文本                           | 按 `i`（光标前）或 `a`（光标后） |
| **底行模式** | 保存、退出、搜索等                 | 在命令模式下按 `:`               |

常用操作：

```bash
vim file.txt            # 打开文件

# 命令模式
i                       # 进入插入模式（光标前）
a                       # 进入插入模式（光标后）
o                       # 在下一行插入
dd                      # 删除当前行
yy                      # 复制当前行
p                       # 粘贴
u                       # 撤销
gg                      # 跳到文件开头
G                       # 跳到文件末尾
/keyword                # 搜索（按 n 下一个，N 上一个）

# 底行模式（先按 Esc，再按 :）
:w                      # 保存
:q                      # 退出
:wq                     # 保存并退出
:q!                     # 强制退出（不保存）
:set nu                 # 显示行号
```

#### 2.4.2 nano 编辑器

比 vim 更简单的编辑器，适合新手：

```bash
nano file.txt           # 打开文件

# 常用快捷键（^ 表示 Ctrl）
^O                      # 保存
^X                      # 退出
^K                      # 剪切当前行
^U                      # 粘贴
^W                      # 搜索
```

### 2.5 文件查找

```bash
# find：按条件查找文件
find /path -name "*.log"           # 按名称查找
find /path -type f -size +10M      # 查找大于 10MB 的文件
find /path -mtime -7               # 查找 7 天内修改的文件

# grep：在文件内容中搜索
grep "keyword" file.txt            # 搜索关键字
grep -r "keyword" /path            # 递归搜索目录
grep -i "keyword" file.txt         # 忽略大小写
grep -n "keyword" file.txt         # 显示行号
grep -v "keyword" file.txt         # 显示不包含关键字的行

# which：查找命令位置
which java                         # 显示 java 命令的路径
```

### 2.6 权限管理

#### 2.6.1 权限说明

Linux 文件权限分为三组：**所有者（u）**、**所属组（g）**、**其他用户（o）**，每组有三种权限：

| 权限 | 字母 | 数字 | 对文件的含义 | 对目录的含义  |
| ---- | ---- | ---- | ------------ | ------------- |
| 读   | r    | 4    | 查看内容     | 列出目录内容  |
| 写   | w    | 2    | 修改内容     | 创建/删除文件 |
| 执行 | x    | 1    | 运行程序     | 进入目录      |

#### 2.6.2 修改权限

```bash
# chmod：修改权限
chmod 755 file.sh       # 所有者 rwx，组和其他 r-x
chmod u+x file.sh       # 给所有者添加执行权限
chmod go-w file.txt     # 去掉组和其他的写权限
chmod -R 755 dirname    # 递归修改目录权限

# chown：修改所有者
chown user file.txt              # 修改所有者
chown user:group file.txt        # 同时修改所有者和组
chown -R user:group dirname      # 递归修改
```

常见权限组合：

| 数字 | 权限      | 常用场景                   |
| ---- | --------- | -------------------------- |
| 755  | rwxr-xr-x | 可执行文件、目录           |
| 644  | rw-r--r-- | 普通文件                   |
| 600  | rw------- | 私密文件（如密钥）         |
| 777  | rwxrwxrwx | 所有人可读写执行（不推荐） |

### 2.7 进程管理

```bash
# 查看进程
ps -ef                  # 查看所有进程
ps -ef | grep java      # 查找 Java 进程
ps aux                  # 另一种格式查看进程
top                     # 实时查看进程（按 q 退出）
htop                    # 更友好的 top（需安装）

# 结束进程
kill PID                # 正常结束进程
kill -9 PID             # 强制结束进程

# 后台运行
nohup command &         # 后台运行，退出终端后仍继续
nohup java -jar app.jar > log.txt 2>&1 &
```

### 2.8 网络相关

```bash
# 查看网络信息
ip addr                 # 查看 IP 地址（新命令）
ifconfig                # 查看 IP 地址（旧命令）
hostname -I             # 只显示 IP

# 网络连通性
ping www.baidu.com      # 测试网络连通
curl http://localhost   # 发送 HTTP 请求
wget http://url/file    # 下载文件

# 端口和连接
netstat -tlnp           # 查看监听的端口
ss -tlnp                # 更快的端口查看命令
lsof -i :8080           # 查看占用 8080 端口的进程
```

### 2.9 系统信息

```bash
# 系统信息
uname -a                # 系统内核信息
cat /etc/os-release     # 发行版信息
hostname                # 主机名
uptime                  # 运行时间和负载

# 资源使用
free -h                 # 内存使用情况
df -h                   # 磁盘使用情况
du -sh /path            # 目录大小
```

### 2.10 压缩和解压

```bash
# tar（打包/解包，常配合 gzip）
tar -cvf archive.tar files/      # 打包
tar -xvf archive.tar             # 解包
tar -czvf archive.tar.gz files/  # 打包并压缩
tar -xzvf archive.tar.gz         # 解压

# zip/unzip
zip -r archive.zip files/        # 压缩
unzip archive.zip                # 解压
unzip archive.zip -d /path/      # 解压到指定目录
```

参数说明：
- `-c`：创建（create）
- `-x`：解压（extract）
- `-v`：显示过程（verbose）
- `-f`：指定文件名（file）
- `-z`：使用 gzip 压缩

### 2.11 其他常用命令

```bash
# 管道和重定向
command1 | command2     # 管道：前一个命令的输出作为后一个的输入
command > file          # 重定向：输出到文件（覆盖）
command >> file         # 追加到文件
command 2>&1            # 错误输出也重定向

# 示例
ps -ef | grep java      # 查找 Java 进程
cat file | wc -l        # 统计行数
echo "hello" > a.txt    # 写入文件

# 其他
clear                   # 清屏
history                 # 查看历史命令
!!                      # 执行上一条命令
sudo command            # 以管理员身份执行
```

***

## 三、Linux 软件安装

### 3.1 包管理器

不同发行版使用不同的包管理器：

| 发行版        | 包管理器  | 包格式       |
| ------------- | --------- | ------------ |
| Ubuntu/Debian | apt       | .deb         |
| CentOS/RHEL   | yum / dnf | .rpm         |
| Alpine        | apk       | .apk         |
| Arch          | pacman    | .pkg.tar.zst |

### 3.2 apt（Ubuntu/Debian）

```bash
# 更新软件源
sudo apt update

# 升级已安装的软件
sudo apt upgrade

# 安装软件
sudo apt install nginx

# 卸载软件
sudo apt remove nginx           # 保留配置
sudo apt purge nginx            # 删除配置

# 搜索软件
apt search keyword

# 查看已安装
apt list --installed
```

### 3.3 yum/dnf（CentOS/RHEL）

```bash
# 安装软件
sudo yum install nginx
sudo dnf install nginx          # CentOS 8+ 用 dnf

# 更新软件
sudo yum update

# 卸载软件
sudo yum remove nginx

# 搜索软件
yum search keyword

# 查看已安装
yum list installed
```

### 3.4 手动安装（二进制包）

有些软件没有在包管理器中，需要手动安装：

```bash
# 1. 下载
wget https://example.com/software.tar.gz

# 2. 解压
tar -xzvf software.tar.gz

# 3. 移动到合适位置
sudo mv software /opt/

# 4. 配置环境变量（可选）
echo 'export PATH=$PATH:/opt/software/bin' >> ~/.bashrc
source ~/.bashrc
```

### 3.5 安装 JDK

#### 方式一：包管理器安装（推荐）

```bash
# Ubuntu
sudo apt update
sudo apt install openjdk-17-jdk

# 验证
java -version
```

#### 方式二：手动安装

```bash
# 1. 下载 JDK（从 Oracle 或 Adoptium）
wget https://example.com/jdk-17_linux-x64.tar.gz

# 2. 解压到 /opt
sudo tar -xzvf jdk-17_linux-x64.tar.gz -C /opt

# 3. 配置环境变量
sudo nano /etc/profile.d/java.sh

# 添加以下内容：
export JAVA_HOME=/opt/jdk-17
export PATH=$PATH:$JAVA_HOME/bin

# 4. 生效
source /etc/profile.d/java.sh

# 5. 验证
java -version
```

### 3.6 安装 MySQL

```bash
# Ubuntu
sudo apt update
sudo apt install mysql-server

# 启动服务
sudo systemctl start mysql
sudo systemctl enable mysql     # 开机自启

# 安全配置
sudo mysql_secure_installation

# 登录
sudo mysql -u root -p
```

### 3.7 安装 Nginx

```bash
# Ubuntu
sudo apt update
sudo apt install nginx

# 启动
sudo systemctl start nginx
sudo systemctl enable nginx

# 验证（访问 http://服务器IP）
curl http://localhost
```

### 3.8 systemctl 服务管理

```bash
# 服务管理
sudo systemctl start nginx      # 启动
sudo systemctl stop nginx       # 停止
sudo systemctl restart nginx    # 重启
sudo systemctl reload nginx     # 重新加载配置
sudo systemctl status nginx     # 查看状态

# 开机自启
sudo systemctl enable nginx     # 开启
sudo systemctl disable nginx    # 关闭

# 查看服务列表
systemctl list-units --type=service
```

***

## 四、项目部署

### 4.1 部署流程概述

典型的 Java 项目部署流程：

1. **准备环境**：安装 JDK、数据库、中间件等
2. **上传项目**：将 jar/war 包上传到服务器
3. **配置项目**：修改配置文件（数据库连接、端口等）
4. **启动项目**：运行 jar 或部署到 Tomcat
5. **配置反向代理**：用 Nginx 代理，开放 80/443 端口
6. **查看日志**：监控运行状态

### 4.2 上传文件到服务器

```bash
# scp：通过 SSH 传文件
scp local_file user@server:/remote/path
scp -r local_dir user@server:/remote/path     # 目录

# 示例
scp target/app.jar 用户名@服务器IP:/home/用户名/

# 从服务器下载
scp user@server:/remote/file local_path
```

也可以用 SFTP 客户端（Royal TSX、FileZilla 等）图形化上传。

### 4.3 部署 Spring Boot 项目

#### 4.3.1 直接运行 jar

```bash
# 前台运行（关闭终端会停止）
java -jar app.jar

# 后台运行
nohup java -jar app.jar > app.log 2>&1 &

# 指定配置
nohup java -jar app.jar --spring.profiles.active=prod > app.log 2>&1 &

# 指定端口
nohup java -jar app.jar --server.port=8080 > app.log 2>&1 &
```

#### 4.3.2 使用脚本管理

创建启动脚本 `start.sh`：

```bash
#!/bin/bash
APP_NAME=app.jar
LOG_FILE=app.log

# 检查是否已运行
PID=$(ps -ef | grep $APP_NAME | grep -v grep | awk '{print $2}')
if [ -n "$PID" ]; then
    echo "应用已运行，PID: $PID"
    exit 1
fi

# 启动
nohup java -jar $APP_NAME > $LOG_FILE 2>&1 &
echo "应用已启动，PID: $!"
```

创建停止脚本 `stop.sh`：

```bash
#!/bin/bash
APP_NAME=app.jar

PID=$(ps -ef | grep $APP_NAME | grep -v grep | awk '{print $2}')
if [ -z "$PID" ]; then
    echo "应用未运行"
    exit 0
fi

kill $PID
echo "应用已停止，PID: $PID"
```

赋予执行权限：

```bash
chmod +x start.sh stop.sh
```

### 4.4 配置 Nginx 反向代理

编辑 Nginx 配置：

```bash
sudo nano /etc/nginx/sites-available/default
```

配置示例：

```nginx
server {
    listen 80;
    server_name example.com;    # 域名或 IP

    location / {
        proxy_pass http://127.0.0.1:8080;    # 后端地址
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

重新加载 Nginx：

```bash
sudo nginx -t               # 检查配置语法
sudo systemctl reload nginx # 重新加载
```

### 4.5 查看日志

```bash
# 查看日志文件
cat app.log
tail -n 100 app.log         # 最后 100 行
tail -f app.log             # 实时跟踪（常用）

# 搜索关键字
grep "ERROR" app.log
grep -n "Exception" app.log  # 显示行号

# 系统日志
sudo tail -f /var/log/syslog
sudo journalctl -u nginx -f  # 查看 nginx 服务日志
```

### 4.6 防火墙配置

```bash
# Ubuntu (ufw)
sudo ufw status             # 查看状态
sudo ufw allow 80           # 开放 80 端口
sudo ufw allow 443          # 开放 443 端口
sudo ufw allow 22           # 开放 SSH
sudo ufw enable             # 启用防火墙

# CentOS (firewalld)
sudo firewall-cmd --list-all
sudo firewall-cmd --add-port=80/tcp --permanent
sudo firewall-cmd --reload
```

### 4.7 常见问题排查

| 问题         | 排查命令                                   |
| ------------ | ------------------------------------------ |
| 应用没启动   | `ps -ef \| grep java`                      |
| 端口被占用   | `lsof -i :8080` 或 `ss -tlnp \| grep 8080` |
| 无法访问     | `curl http://localhost:8080`，检查防火墙   |
| 内存不足     | `free -h`，看 available                    |
| 磁盘满了     | `df -h`，看 Use%                           |
| 查看错误日志 | `tail -f app.log`，搜索 ERROR/Exception    |

***

## 五、常用命令速查表

| 类别     | 命令                          | 说明                   |
| -------- | ----------------------------- | ---------------------- |
| **目录** | `cd`、`pwd`、`ls`、`mkdir`    | 切换、查看、创建目录   |
| **文件** | `cp`、`mv`、`rm`、`touch`     | 复制、移动、删除、创建 |
| **查看** | `cat`、`head`、`tail`、`less` | 查看文件内容           |
| **编辑** | `vim`、`nano`                 | 编辑文件               |
| **查找** | `find`、`grep`、`which`       | 查找文件/内容          |
| **权限** | `chmod`、`chown`              | 修改权限/所有者        |
| **进程** | `ps`、`top`、`kill`           | 查看/结束进程          |
| **网络** | `ip addr`、`ping`、`curl`     | 网络信息/测试          |
| **系统** | `free`、`df`、`uname`         | 内存/磁盘/系统信息     |
| **压缩** | `tar`、`zip`、`unzip`         | 打包/压缩/解压         |
| **服务** | `systemctl`                   | 服务管理               |
| **软件** | `apt`、`yum`                  | 包管理                 |
