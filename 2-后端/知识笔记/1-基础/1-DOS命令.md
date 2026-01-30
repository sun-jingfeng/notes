## 一、终端入门

### 1.1 各系统终端概览

| 系统      | 默认终端             | 默认 Shell   | 说明               |
| ------- | ---------------- | ---------- | ---------------- |
| macOS   | Terminal.app     | zsh        | 推荐使用 iTerm2      |
| Linux   | 各发行版不同           | bash/zsh   | Ubuntu 默认 bash   |
| Windows | Windows Terminal | PowerShell | 可安装 Git Bash/WSL |

### 1.2 Shell 类型

```bash
# 查看当前使用的 Shell
echo $SHELL

# 查看系统可用的 Shell
cat /etc/shells

# 切换默认 Shell（需重新登录生效）
chsh -s /bin/zsh
chsh -s /bin/bash
```

### 1.3 打开终端的方式

**Mac：**

*   `Command + 空格` → 输入 "Terminal" 或 "终端"
*   应用程序 → 实用工具 → 终端
*   iTerm2（可选）

### 1.4 命令行快捷键

适用于 bash、zsh 等，对当前行输入与历史命令的编辑与操作：

| 快捷键        | 功能           |
| ---------- | ------------ |
| `Tab`      | 自动补全         |
| `↑` `↓`    | 查看历史命令       |
| `Ctrl + C` | 终止当前命令       |
| `Ctrl + Z` | 挂起当前进程       |
| `Ctrl + D` | 退出终端/输入结束    |
| `Ctrl + L` | 清屏（等同 clear） |
| `Ctrl + A` | 移动到行首        |
| `Ctrl + E` | 移动到行尾        |
| `Ctrl + U` | 删除光标前的内容     |
| `Ctrl + K` | 删除光标后的内容     |
| `Ctrl + W` | 删除光标前一个单词    |
| `Alt + D`（或 `Esc + D`） | 删除光标后一个单词    |
| `Ctrl + Y` | 粘贴刚才用 Ctrl+U/K 删除的内容 |
| `Ctrl + _` | 撤销上一次编辑（部分 shell 支持） |
| `Ctrl + R` | 搜索历史命令       |

### 1.5 获取帮助

```bash
man 命令名              # 查看命令手册（按 q 退出）
命令名 --help           # 查看帮助信息
命令名 -h               # 简短帮助
tldr 命令名             # 简化版手册（需安装 tldr）
```

***

## 二、文件和目录操作

### 2.1 目录浏览

```bash
pwd                     # 显示当前目录路径
ls                      # 列出目录内容
ls -l                   # 详细列表（权限、大小、时间）
ls -la                  # 包含隐藏文件
ls -lh                  # 文件大小用人类可读格式（KB/MB）
ls -lt                  # 按修改时间排序（最新在前）
ls -ltr                 # 按修改时间排序（最旧在前）
ls -lS                  # 按文件大小排序
ls -R                   # 递归显示子目录
ls *.java               # 只显示 .java 文件
```

### 2.2 目录结构

```bash
tree                    # 树形显示目录结构（需安装）
tree -L 2               # 只显示 2 层深度
tree -d                 # 只显示目录
tree -a                 # 包含隐藏文件
tree -I "node_modules"  # 排除指定目录
tree > structure.txt    # 保存到文件

# Mac 安装 tree
brew install tree
```

### 2.3 目录切换

```bash
cd 目录名               # 切换到指定目录
cd ..                   # 返回上一级目录
cd ../..                # 返回上两级目录
cd /                    # 切换到根目录
cd ~                    # 切换到用户主目录
cd -                    # 切换到上次所在目录
cd ~/Desktop            # 切换到桌面

# 快速跳转（需配置）
pushd 目录              # 切换目录并压入栈
popd                    # 返回栈中上一个目录
dirs -v                 # 查看目录栈
```

### 2.4 创建和删除目录

```bash
mkdir 目录名            # 创建目录
mkdir -p a/b/c          # 创建多级目录
mkdir -p project/{src,bin,doc,lib}   # 批量创建目录

rmdir 目录名            # 删除空目录
rm -r 目录名            # 删除目录及其内容
rm -rf 目录名           # 强制删除（不提示，慎用！）
```

### 2.5 文件操作

```bash
touch 文件名            # 创建空文件 / 更新时间戳
touch file{1..5}.txt    # 批量创建 file1.txt 到 file5.txt

cp 源文件 目标文件      # 复制文件
cp -r 源目录 目标目录   # 复制目录（递归）
cp -i 源 目标           # 覆盖前提示确认
cp -v 源 目标           # 显示复制过程
cp *.java backup/       # 复制所有 java 文件到 backup

mv 源 目标              # 移动文件/重命名
mv -i 源 目标           # 覆盖前提示
mv *.txt docs/          # 移动所有 txt 文件

rm 文件名               # 删除文件
rm -i 文件名            # 删除前提示确认
rm -f 文件名            # 强制删除
rm *.log                # 删除所有 log 文件

ln -s 源文件 链接名     # 创建软链接（快捷方式）
ln 源文件 链接名        # 创建硬链接
```

### 2.6 文件查看

```bash
cat 文件名              # 显示文件全部内容
cat -n 文件名           # 显示行号
cat file1 file2 > merged   # 合并文件

less 文件名             # 分页查看（支持上下滚动）
# less 快捷键：空格=下一页，b=上一页，/=搜索，q=退出

more 文件名             # 分页查看（只能向下）

head 文件名             # 显示文件前 10 行
head -n 20 文件名       # 显示前 20 行
head -c 100 文件名      # 显示前 100 个字节

tail 文件名             # 显示文件后 10 行
tail -n 20 文件名       # 显示后 20 行
tail -f 文件名          # 实时追踪文件更新（看日志常用）
tail -f -n 100 app.log  # 显示最后 100 行并持续追踪

wc 文件名               # 统计行数、单词数、字节数
wc -l 文件名            # 只统计行数
wc -w 文件名            # 只统计单词数
```

### 2.7 文件权限

```bash
# 权限说明：r=读(4) w=写(2) x=执行(1)
# -rwxr-xr-x：所有者rwx，组r-x，其他r-x

chmod 755 文件名        # 设置权限（所有者全部，其他读+执行）
chmod 644 文件名        # 所有者读写，其他只读
chmod +x 文件名         # 添加执行权限
chmod -x 文件名         # 移除执行权限
chmod u+x 文件名        # 只给所有者添加执行权限
chmod -R 755 目录       # 递归设置目录权限

chown 用户 文件名       # 修改文件所有者
chown 用户:组 文件名    # 修改所有者和组
chown -R 用户 目录      # 递归修改目录所有者

# 查看权限
ls -l 文件名
stat 文件名             # 显示文件详细信息
```

***

## 三、文本处理

### 3.1 文本搜索（grep）

```bash
grep "关键字" 文件名           # 在文件中搜索
grep -i "关键字" 文件名        # 忽略大小写
grep -n "关键字" 文件名        # 显示行号
grep -r "关键字" 目录          # 递归搜索目录
grep -l "关键字" *.java        # 只显示匹配的文件名
grep -c "关键字" 文件名        # 统计匹配行数
grep -v "关键字" 文件名        # 显示不匹配的行
grep -w "word" 文件名          # 全词匹配
grep -A 3 "关键字" 文件名      # 显示匹配行及后 3 行
grep -B 3 "关键字" 文件名      # 显示匹配行及前 3 行
grep -C 3 "关键字" 文件名      # 显示匹配行及前后 3 行
grep -E "正则" 文件名          # 使用扩展正则表达式
grep "error\|warning" log.txt  # 匹配多个关键字

# 常用组合
ps aux | grep java             # 查找 java 进程
history | grep git             # 搜索历史命令
```

### 3.2 文件查找（find）

```bash
find . -name "*.java"          # 当前目录下查找 java 文件
find / -name "文件名"          # 全盘查找
find . -iname "*.Java"         # 忽略大小写
find . -type f                 # 只查找文件
find . -type d                 # 只查找目录
find . -type f -empty          # 查找空文件
find . -size +100M             # 大于 100MB 的文件
find . -size -1k               # 小于 1KB 的文件
find . -mtime -7               # 7 天内修改的文件
find . -mtime +30              # 30 天前修改的文件
find . -user 用户名            # 指定用户的文件
find . -perm 755               # 指定权限的文件

# 查找并执行操作
find . -name "*.log" -delete              # 查找并删除
find . -name "*.java" -exec wc -l {} \;   # 统计每个文件行数
find . -name "*.txt" -exec grep "关键字" {} \;   # 在找到的文件中搜索

# 排除目录
find . -name "*.js" -not -path "./node_modules/*"
```

### 3.3 文本处理工具

```bash
# sort - 排序
sort 文件名                    # 按字母排序
sort -n 文件名                 # 按数字排序
sort -r 文件名                 # 逆序排序
sort -k2 文件名                # 按第 2 列排序
sort -t: -k3 -n /etc/passwd    # 指定分隔符，按第 3 列数字排序
sort -u 文件名                 # 排序并去重

# uniq - 去重（需先排序）
sort 文件名 | uniq             # 去除重复行
sort 文件名 | uniq -c          # 统计重复次数
sort 文件名 | uniq -d          # 只显示重复行

# cut - 截取列
cut -d: -f1 /etc/passwd        # 以 : 分隔，取第 1 列
cut -d, -f1,3 data.csv         # 取第 1 和第 3 列
cut -c1-10 文件名              # 取每行前 10 个字符

# awk - 强大的文本处理
awk '{print $1}' 文件名        # 打印第 1 列
awk '{print $1, $3}' 文件名    # 打印第 1 和第 3 列
awk -F: '{print $1}' /etc/passwd   # 指定分隔符
awk 'NR==5' 文件名             # 打印第 5 行
awk 'NR>=5 && NR<=10' 文件名   # 打印第 5-10 行
awk '/关键字/' 文件名          # 匹配关键字的行
awk '{sum+=$1} END {print sum}' 文件名   # 求和

# sed - 流编辑器
sed 's/旧/新/' 文件名          # 替换第一个匹配
sed 's/旧/新/g' 文件名         # 替换所有匹配
sed -i 's/旧/新/g' 文件名      # 直接修改文件（Mac 用 sed -i ''）
sed -n '5p' 文件名             # 打印第 5 行
sed -n '5,10p' 文件名          # 打印第 5-10 行
sed '5d' 文件名                # 删除第 5 行
sed '/关键字/d' 文件名         # 删除匹配行
```

### 3.4 管道和重定向

```bash
# 重定向
命令 > 文件             # 输出到文件（覆盖）
命令 >> 文件            # 输出追加到文件
命令 2> 文件            # 错误输出到文件
命令 2>&1               # 错误输出合并到标准输出
命令 > 文件 2>&1        # 所有输出到文件
命令 < 文件             # 从文件读取输入
命令 > /dev/null        # 丢弃输出
命令 2> /dev/null       # 丢弃错误输出

# 管道
命令1 | 命令2           # 命令1 输出作为命令2 输入
ls -l | grep ".java"    # 筛选 java 文件
cat log.txt | grep error | wc -l   # 统计错误行数
ps aux | sort -k4 -rn | head -10   # CPU 占用前 10 进程
history | awk '{print $2}' | sort | uniq -c | sort -rn | head -10   # 最常用命令

# 组合命令
命令1 && 命令2          # 命令1 成功后执行命令2
命令1 || 命令2          # 命令1 失败后执行命令2
命令1 ; 命令2           # 顺序执行（不管成功失败）
```

### 3.5 剪贴板操作（Mac）

```bash
# Mac 专用
命令 | pbcopy           # 将输出复制到剪贴板
pbpaste                 # 输出剪贴板内容
pbpaste > file.txt      # 剪贴板内容保存到文件

# 示例
pwd | pbcopy            # 复制当前路径
cat file.txt | pbcopy   # 复制文件内容
```

***

## 四、系统管理

### 4.1 进程管理

```bash
ps                      # 显示当前终端进程
ps aux                  # 显示所有进程（详细）
ps aux | grep java      # 查找 java 进程
ps -ef                  # 另一种格式显示所有进程

top                     # 实时查看进程（按 q 退出）
top -o cpu              # 按 CPU 排序
top -o mem              # 按内存排序
htop                    # 更友好的 top（需安装）

kill PID                # 终止进程（发送 SIGTERM）
kill -9 PID             # 强制终止进程（发送 SIGKILL）
kill -l                 # 列出所有信号
killall 进程名          # 按名称终止进程
killall -9 java         # 强制终止所有 java 进程
pkill 进程名            # 按名称模式终止进程
pkill -f "java.*Main"   # 按完整命令行匹配终止

# 后台运行
命令 &                  # 后台运行命令
nohup 命令 &            # 后台运行，退出终端不停止
nohup java -jar app.jar > app.log 2>&1 &   # 常用写法

jobs                    # 查看后台任务
fg %1                   # 将任务 1 切换到前台
bg %1                   # 将任务 1 切换到后台
```

### 4.2 系统信息

```bash
uname -a                # 显示系统信息
uname -s                # 操作系统名称
uname -r                # 内核版本
sw_vers                 # Mac 版本信息（Mac 专用）

hostname                # 显示主机名
whoami                  # 当前用户名
id                      # 当前用户 ID 和组信息
who                     # 当前登录用户
w                       # 当前登录用户及其活动
uptime                  # 系统运行时间和负载

date                    # 显示日期时间
date +"%Y-%m-%d %H:%M:%S"   # 格式化日期
cal                     # 显示日历
```

### 4.3 磁盘和内存

```bash
df -h                   # 显示磁盘使用情况（人类可读）
df -H                   # 以 1000 为单位显示
du -sh 目录             # 显示目录大小
du -sh *                # 显示当前目录下各项大小
du -sh * | sort -rh     # 按大小排序

free -h                 # 显示内存使用（Linux）
vm_stat                 # 内存统计（Mac）
top -l 1 | head -n 10   # 查看内存（Mac）

# 查找大文件
find . -size +100M -type f -exec ls -lh {} \;
du -sh * | sort -rh | head -20
```

### 4.4 网络命令

```bash
# 网络测试
ping 域名/IP            # 测试连通性
ping -c 5 baidu.com     # ping 5 次
ping6 域名              # IPv6 ping

traceroute 域名         # 跟踪路由
mtr 域名                # 结合 ping 和 traceroute（需安装）

# 查看网络配置
ifconfig                # 查看网络接口（Mac/旧版 Linux）
ip addr                 # 查看网络接口（新版 Linux）
ip route                # 查看路由表

# 查看网络连接
netstat -an             # 查看所有连接
netstat -an | grep LISTEN   # 查看监听端口
netstat -an | grep :8080    # 查看 8080 端口
lsof -i :8080           # 查看占用 8080 端口的进程（Mac 常用）
lsof -i -P | grep LISTEN    # 查看所有监听端口

ss -tuln                # 查看监听端口（Linux，比 netstat 快）

# DNS 查询
nslookup 域名           # DNS 查询
dig 域名                # 详细 DNS 查询
dig +short 域名         # 简洁输出
host 域名               # 查询域名 IP

# HTTP 请求
curl URL                # 获取网页内容
curl -I URL             # 只获取响应头
curl -X POST -d "data" URL   # POST 请求
curl -o 文件名 URL      # 下载文件
curl -O URL             # 下载并保留原文件名
curl -L URL             # 跟随重定向
curl -s URL             # 静默模式
curl -v URL             # 显示详细过程

wget URL                # 下载文件（需安装）
wget -c URL             # 断点续传
wget -r URL             # 递归下载
```

### 4.5 端口和防火墙

```bash
# Mac 查看端口
lsof -i :端口号
netstat -an | grep 端口号

# Mac 防火墙（通过系统偏好设置管理）
# 或使用 pfctl

# Linux 防火墙
sudo ufw status         # 查看防火墙状态
sudo ufw enable         # 启用防火墙
sudo ufw allow 22       # 允许 22 端口
sudo ufw deny 3306      # 禁止 3306 端口
```

***

## 五、开发工具

### 5.1 Git 命令

```bash
# 配置
git config --global user.name "姓名"
git config --global user.email "邮箱"
git config --list       # 查看配置

# 基础操作
git init                # 初始化仓库
git clone URL           # 克隆仓库
git status              # 查看状态
git add 文件名          # 添加到暂存区
git add .               # 添加所有文件
git commit -m "消息"    # 提交
git commit -am "消息"   # 添加并提交（已跟踪文件）

# 分支
git branch              # 查看本地分支
git branch -a           # 查看所有分支
git branch 分支名       # 创建分支
git checkout 分支名     # 切换分支
git checkout -b 分支名  # 创建并切换分支
git switch 分支名       # 切换分支（新语法）
git switch -c 分支名    # 创建并切换（新语法）
git merge 分支名        # 合并分支
git branch -d 分支名    # 删除分支

# 远程
git remote -v           # 查看远程仓库
git remote add origin URL   # 添加远程仓库
git push -u origin main # 推送并设置上游
git push                # 推送
git pull                # 拉取
git fetch               # 获取远程更新

# 查看历史
git log                 # 查看提交历史
git log --oneline       # 简洁显示
git log --graph         # 图形显示
git log -p 文件名       # 查看文件修改历史
git diff                # 查看未暂存的修改
git diff --staged       # 查看已暂存的修改
git blame 文件名        # 查看每行的修改者

# 撤销
git checkout -- 文件名  # 撤销工作区修改
git restore 文件名      # 撤销工作区修改（新语法）
git reset HEAD 文件名   # 撤销暂存
git restore --staged 文件名   # 撤销暂存（新语法）
git reset --soft HEAD~1 # 撤销最近一次提交（保留修改）
git reset --hard HEAD~1 # 撤销最近一次提交（丢弃修改）
git revert 提交ID       # 创建新提交来撤销

# 暂存
git stash               # 暂存当前修改
git stash list          # 查看暂存列表
git stash pop           # 恢复并删除暂存
git stash apply         # 恢复暂存
git stash drop          # 删除暂存
```

### 5.2 包管理

```bash
# Homebrew（Mac）
brew --version          # 查看版本
brew update             # 更新 Homebrew
brew upgrade            # 升级所有包
brew install 包名       # 安装
brew uninstall 包名     # 卸载
brew list               # 查看已安装
brew search 关键字      # 搜索
brew info 包名          # 查看包信息
brew services list      # 查看服务状态
brew services start 服务   # 启动服务
brew services stop 服务    # 停止服务

# npm（Node.js）
npm -v                  # 查看版本
npm init                # 初始化项目
npm install             # 安装依赖
npm install 包名        # 安装包
npm install -g 包名     # 全局安装
npm install --save-dev 包名   # 安装为开发依赖
npm uninstall 包名      # 卸载
npm list                # 查看已安装
npm list -g --depth=0   # 查看全局安装
npm update              # 更新依赖
npm run 脚本名          # 运行脚本
npm cache clean --force # 清理缓存

# pip（Python）
pip --version           # 查看版本
pip install 包名        # 安装
pip install -r requirements.txt   # 从文件安装
pip uninstall 包名      # 卸载
pip list                # 查看已安装
pip freeze > requirements.txt   # 导出依赖
pip install --upgrade 包名   # 升级包
```

### 5.3 SSH 和远程操作

```bash
# SSH 连接
ssh 用户名@服务器IP     # 连接服务器
ssh -p 端口 用户名@IP   # 指定端口
ssh -i 密钥文件 用户名@IP   # 使用密钥

# SSH 密钥
ssh-keygen              # 生成密钥对
ssh-keygen -t rsa -b 4096 -C "邮箱"   # 指定类型和位数
ssh-copy-id 用户名@IP   # 复制公钥到服务器
cat ~/.ssh/id_rsa.pub   # 查看公钥

# 文件传输
scp 本地文件 用户名@IP:远程路径   # 上传文件
scp 用户名@IP:远程文件 本地路径   # 下载文件
scp -r 本地目录 用户名@IP:远程路径   # 上传目录
scp -P 端口 文件 用户名@IP:路径   # 指定端口

# rsync（更强大的同步）
rsync -av 源目录/ 目标目录/   # 同步目录
rsync -av --delete 源/ 目标/  # 镜像同步（删除目标多余文件）
rsync -avz 本地/ 用户名@IP:远程/   # 远程同步（压缩传输）
rsync -avz --progress 源/ 目标/    # 显示进度
```

### 5.4 Docker 常用命令

```bash
# 镜像
docker images           # 查看镜像
docker pull 镜像名      # 拉取镜像
docker rmi 镜像ID       # 删除镜像
docker build -t 名称 .  # 构建镜像

# 容器
docker ps               # 查看运行中的容器
docker ps -a            # 查看所有容器
docker run 镜像名       # 运行容器
docker run -d 镜像名    # 后台运行
docker run -p 8080:80 镜像名   # 端口映射
docker run -v 本地:容器 镜像名   # 挂载目录
docker run -it 镜像名 /bin/bash   # 交互模式
docker start 容器ID     # 启动容器
docker stop 容器ID      # 停止容器
docker restart 容器ID   # 重启容器
docker rm 容器ID        # 删除容器
docker exec -it 容器ID /bin/bash   # 进入容器
docker logs 容器ID      # 查看日志
docker logs -f 容器ID   # 实时查看日志

# Docker Compose
docker-compose up       # 启动服务
docker-compose up -d    # 后台启动
docker-compose down     # 停止并删除
docker-compose ps       # 查看状态
docker-compose logs     # 查看日志

# 清理
docker system prune     # 清理无用数据
docker volume prune     # 清理无用卷
```

***

## 六、Java 开发环境

### 6.1 JDK 基础命令

```bash
java -version           # 查看 Java 版本
java --version          # JDK 9+ 新格式
javac -version          # 查看编译器版本
which java              # 查找 java 路径

# 编译运行
javac HelloWorld.java   # 编译
java HelloWorld         # 运行
java HelloWorld.java    # 直接运行源文件（JDK 11+）

# 编译选项
javac -d bin src/*.java # 编译输出到 bin 目录
javac -encoding UTF-8 *.java   # 指定编码
javac -source 11 -target 11 *.java   # 指定版本

# 运行选项
java -cp bin com.example.Main   # 指定类路径
java -jar app.jar       # 运行 JAR
java -Xms512m -Xmx1024m Main   # 设置堆内存
java -Dkey=value Main   # 设置系统属性

# JAR 操作
jar -cvf app.jar -C bin .   # 创建 JAR
jar -tvf app.jar        # 查看 JAR 内容
jar -xvf app.jar        # 解压 JAR
```

### 6.2 JDK 工具

```bash
# 进程和监控
jps                     # 查看 Java 进程
jps -l                  # 显示完整主类名
jps -v                  # 显示 JVM 参数

jstack PID              # 查看线程堆栈
jmap -heap PID          # 查看堆内存
jmap -histo PID         # 查看对象统计
jmap -dump:file=heap.bin PID   # 导出堆转储

jstat -gc PID 1000      # 每秒显示 GC 情况
jstat -gcutil PID 1000  # GC 百分比统计

jconsole                # 图形化监控
jvisualvm               # 可视化性能分析

# 其他工具
jshell                  # 交互式编程（JDK 9+）
javadoc -d doc src/*.java   # 生成文档
jlink                   # 模块化打包（JDK 9+）
```

### 6.3 Maven 命令

```bash
mvn -version            # 查看版本

# 生命周期
mvn clean               # 清理 target 目录
mvn compile             # 编译
mvn test                # 运行测试
mvn package             # 打包
mvn install             # 安装到本地仓库
mvn deploy              # 部署到远程仓库

# 常用组合
mvn clean package       # 清理并打包
mvn clean package -DskipTests   # 跳过测试打包
mvn clean install -U    # 强制更新快照依赖

# 依赖管理
mvn dependency:tree     # 查看依赖树
mvn dependency:resolve  # 解析依赖
mvn dependency:analyze  # 分析依赖

# Spring Boot
mvn spring-boot:run     # 运行 Spring Boot

# 其他
mvn archetype:generate  # 生成项目骨架
mvn versions:display-dependency-updates   # 检查依赖更新
```

### 6.4 Gradle 命令

```bash
gradle -version         # 查看版本

# 构建
gradle build            # 构建
gradle clean            # 清理
gradle test             # 运行测试
gradle jar              # 打包 JAR
gradle build -x test    # 跳过测试

# 依赖
gradle dependencies     # 查看依赖
gradle dependencies --configuration runtimeClasspath   # 运行时依赖

# 任务
gradle tasks            # 查看可用任务
gradle tasks --all      # 查看所有任务

# Spring Boot
gradle bootRun          # 运行 Spring Boot
gradle bootJar          # 打包可执行 JAR

# 使用 Wrapper（推荐）
./gradlew build         # 使用项目包装器
./gradlew bootRun
```

### 6.5 环境变量配置

```bash
# 查看环境变量
echo $JAVA_HOME
echo $PATH
echo $CLASSPATH
env                     # 显示所有环境变量
printenv                # 同上

# 临时设置
export JAVA_HOME=/path/to/jdk
export PATH=$JAVA_HOME/bin:$PATH

# 永久设置（添加到配置文件）
# zsh 用户编辑 ~/.zshrc
# bash 用户编辑 ~/.bash_profile 或 ~/.bashrc

# 示例配置（~/.zshrc）
export JAVA_HOME=$(/usr/libexec/java_home)
export PATH=$JAVA_HOME/bin:$PATH
export MAVEN_HOME=/usr/local/maven
export PATH=$MAVEN_HOME/bin:$PATH

# 使配置生效
source ~/.zshrc
```

***

## 七、Shell 脚本基础

### 7.1 基本语法

```bash
#!/bin/bash             # 指定解释器（shebang）
#!/bin/zsh              # 使用 zsh

# 注释
# 这是单行注释

: '
这是多行注释
可以写很多行
'

# 运行脚本
chmod +x script.sh      # 添加执行权限
./script.sh             # 运行脚本
bash script.sh          # 直接用 bash 运行
source script.sh        # 在当前 shell 中运行
```

### 7.2 变量

```bash
# 定义变量（等号两边不能有空格）
name="Java"
age=25
readonly PI=3.14        # 只读变量

# 使用变量
echo $name
echo ${name}            # 推荐写法
echo "Hello, ${name}!"

# 命令结果赋值
current_dir=$(pwd)
file_count=`ls | wc -l`   # 反引号写法（不推荐）

# 特殊变量
$0                      # 脚本名
$1, $2, ...             # 位置参数
$#                      # 参数个数
$@                      # 所有参数（作为独立字符串）
$*                      # 所有参数（作为单个字符串）
$?                      # 上条命令退出状态
$$                      # 当前进程 PID

# 读取用户输入
read -p "请输入姓名: " username
echo "你好, $username"
```

### 7.3 条件判断

```bash
# if 语句
if [ 条件 ]; then
    命令
elif [ 条件 ]; then
    命令
else
    命令
fi

# 文件测试
[ -e 文件 ]             # 文件存在
[ -f 文件 ]             # 是普通文件
[ -d 目录 ]             # 是目录
[ -r 文件 ]             # 可读
[ -w 文件 ]             # 可写
[ -x 文件 ]             # 可执行
[ -s 文件 ]             # 文件不为空

# 字符串测试
[ -z "$str" ]           # 字符串为空
[ -n "$str" ]           # 字符串不为空
[ "$str1" = "$str2" ]   # 字符串相等
[ "$str1" != "$str2" ]  # 字符串不等

# 数值比较
[ $a -eq $b ]           # 等于
[ $a -ne $b ]           # 不等于
[ $a -gt $b ]           # 大于
[ $a -lt $b ]           # 小于
[ $a -ge $b ]           # 大于等于
[ $a -le $b ]           # 小于等于

# 逻辑运算
[ 条件1 ] && [ 条件2 ]  # 与
[ 条件1 ] || [ 条件2 ]  # 或
[ ! 条件 ]              # 非

# 使用 [[ ]]（更强大，推荐）
[[ $str =~ 正则 ]]      # 正则匹配
[[ $a > $b ]]           # 字典序比较

# 示例
if [ -f "config.txt" ]; then
    echo "配置文件存在"
else
    echo "配置文件不存在"
fi
```

### 7.4 循环

```bash
# for 循环
for i in 1 2 3 4 5; do
    echo $i
done

for i in {1..10}; do    # 范围
    echo $i
done

for i in {1..10..2}; do # 步长为 2
    echo $i
done

for file in *.txt; do   # 遍历文件
    echo $file
done

for ((i=0; i<10; i++)); do   # C 风格
    echo $i
done

# while 循环
count=1
while [ $count -le 5 ]; do
    echo $count
    ((count++))
done

# 读取文件每行
while read line; do
    echo $line
done < file.txt

# until 循环（条件为假时执行）
until [ $count -gt 5 ]; do
    echo $count
    ((count++))
done

# 循环控制
break                   # 跳出循环
continue                # 跳过本次循环
```

### 7.5 函数

```bash
# 定义函数
function greet() {
    echo "Hello, $1!"
}

# 另一种写法
greet() {
    echo "Hello, $1!"
}

# 调用函数
greet "World"

# 带返回值
add() {
    local sum=$(($1 + $2))   # local 定义局部变量
    echo $sum                 # 通过 echo 返回
}

result=$(add 3 5)
echo "结果: $result"

# 使用 return（只能返回 0-255 的整数）
check_file() {
    if [ -f "$1" ]; then
        return 0
    else
        return 1
    fi
}

if check_file "test.txt"; then
    echo "文件存在"
fi
```

### 7.6 实用脚本示例

```bash
#!/bin/bash
# 示例 1：批量重命名文件
for file in *.txt; do
    mv "$file" "prefix_$file"
done

# 示例 2：备份脚本
backup_dir="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"
cp -r src/* "$backup_dir/"
echo "备份完成: $backup_dir"

# 示例 3：查找并删除大文件
find . -size +100M -type f -exec rm -i {} \;

# 示例 4：监控服务
check_service() {
    if pgrep -x "$1" > /dev/null; then
        echo "$1 正在运行"
    else
        echo "$1 未运行，正在启动..."
        # 启动服务的命令
    fi
}
check_service "nginx"

# 示例 5：批量处理 Java 项目
for dir in */; do
    if [ -f "${dir}pom.xml" ]; then
        echo "构建项目: $dir"
        (cd "$dir" && mvn clean package -DskipTests)
    fi
done
```

***

## 八、Windows 特有命令（备查）

### 8.1 CMD 常用命令

```batch
:: 文件操作
dir                     :: 列出目录（相当于 ls）
cd                      :: 切换目录
md / mkdir              :: 创建目录
rd / rmdir              :: 删除目录
copy                    :: 复制文件
move                    :: 移动文件
del                     :: 删除文件
ren                     :: 重命名
type                    :: 显示文件内容（相当于 cat）
tree                    :: 显示目录树

:: 系统命令
systeminfo              :: 系统信息
tasklist                :: 查看进程（相当于 ps）
taskkill /pid PID /f    :: 结束进程（相当于 kill -9）
taskkill /im name.exe /f:: 按名称结束进程

:: 网络命令
ipconfig                :: IP 配置（相当于 ifconfig）
ipconfig /all           :: 详细配置
ipconfig /flushdns      :: 清除 DNS 缓存
ping                    :: 测试连通性
netstat -ano            :: 查看网络连接
netstat -ano | findstr :8080   :: 查看端口占用

:: 服务管理
net start               :: 查看服务
net start 服务名        :: 启动服务
net stop 服务名         :: 停止服务
sc query                :: 查询服务状态
```

### 8.2 PowerShell 基础

```powershell
# PowerShell 兼容很多 Unix 命令（通过别名）
ls                      # Get-ChildItem
cd                      # Set-Location
pwd                     # Get-Location
cat                     # Get-Content
cp                      # Copy-Item
mv                      # Move-Item
rm                      # Remove-Item
mkdir                   # New-Item -ItemType Directory

# PowerShell 特有
Get-Process             # 查看进程
Stop-Process -Name java -Force   # 结束进程
Get-Service             # 查看服务
Start-Service 服务名    # 启动服务
Get-NetTCPConnection    # 查看网络连接

# 环境变量
$env:JAVA_HOME          # 查看环境变量
$env:Path -split ';'    # 分行显示 PATH
```

### 8.3 命令对照表

| 功能   | Mac/Linux   | Windows CMD         | PowerShell               |
| ---- | ----------- | ------------------- | ------------------------ |
| 列出目录 | `ls`        | `dir`               | `ls` / `dir`             |
| 切换目录 | `cd`        | `cd`                | `cd`                     |
| 当前目录 | `pwd`       | `cd`                | `pwd`                    |
| 创建目录 | `mkdir`     | `md` / `mkdir`      | `mkdir`                  |
| 删除目录 | `rm -r`     | `rd /s`             | `rm -r`                  |
| 复制文件 | `cp`        | `copy`              | `cp`                     |
| 移动文件 | `mv`        | `move`              | `mv`                     |
| 删除文件 | `rm`        | `del`               | `rm`                     |
| 查看文件 | `cat`       | `type`              | `cat`                    |
| 清屏   | `clear`     | `cls`               | `cls` / `clear`          |
| 查看进程 | `ps aux`    | `tasklist`          | `Get-Process`            |
| 结束进程 | `kill PID`  | `taskkill /pid PID` | `Stop-Process`           |
| 网络配置 | `ifconfig`  | `ipconfig`          | `Get-NetIPAddress`       |
| 文件搜索 | `find`      | `dir /s`            | `Get-ChildItem -Recurse` |
| 文本搜索 | `grep`      | `findstr`           | `Select-String`          |
| 环境变量 | `echo $VAR` | `echo %VAR%`        | `$env:VAR`               |

***

## 附录：命令速查表

### 文件操作

| 命令          | 功能          |
| ----------- | ----------- |
| `ls -la`    | 列出所有文件（含隐藏） |
| `cd`        | 切换目录        |
| `pwd`       | 显示当前路径      |
| `mkdir -p`  | 创建多级目录      |
| `rm -rf`    | 强制删除        |
| `cp -r`     | 递归复制        |
| `mv`        | 移动/重命名      |
| `touch`     | 创建文件        |
| `cat`       | 查看文件        |
| `less`      | 分页查看        |
| `head/tail` | 查看开头/结尾     |
| `chmod`     | 修改权限        |
| `chown`     | 修改所有者       |

### 文本处理

| 命令     | 功能       |
| ------ | -------- |
| `grep` | 搜索文本     |
| `find` | 查找文件     |
| `sort` | 排序       |
| `uniq` | 去重       |
| `wc`   | 统计行/词/字节 |
| `cut`  | 截取列      |
| `awk`  | 文本处理     |
| `sed`  | 流编辑      |

### 系统管理

| 命令         | 功能          |
| ---------- | ----------- |
| `ps aux`   | 查看进程        |
| `top/htop` | 实时监控        |
| `kill -9`  | 强制结束进程      |
| `df -h`    | 磁盘使用        |
| `du -sh`   | 目录大小        |
| `free -h`  | 内存使用（Linux） |

### 网络命令

| 命令            | 功能        |
| ------------- | --------- |
| `ping`        | 测试连通性     |
| `curl`        | HTTP 请求   |
| `wget`        | 下载文件      |
| `ssh`         | 远程连接      |
| `scp`         | 远程复制      |
| `netstat -an` | 网络连接      |
| `lsof -i :端口` | 查看端口（Mac） |

### 开发常用

| 命令                  | 功能        |
| ------------------- | --------- |
| `git status`        | 查看状态      |
| `git pull/push`     | 拉取/推送     |
| `docker ps`         | 查看容器      |
| `mvn clean package` | Maven 打包  |
| `./gradlew build`   | Gradle 构建 |
| `npm install`       | 安装依赖      |
| `brew install`      | Mac 安装软件  |

