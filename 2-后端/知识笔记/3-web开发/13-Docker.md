## 一、Docker 概述

### 1.1 什么是 Docker

Docker 是一个开源的容器化平台，可以将应用程序及其依赖打包到一个轻量级、可移植的容器中。容器可以在任何支持 Docker 的环境中运行，实现"一次构建，到处运行"。

**Docker 的核心优势：**

- **一致性**：开发、测试、生产环境完全一致，解决"在我机器上能跑"的问题
- **隔离性**：容器之间相互隔离，互不影响
- **轻量级**：共享宿主机内核，启动速度快、资源占用少
- **可移植性**：容器可以在任何 Docker 环境中运行
- **版本控制**：镜像可以版本化管理，支持回滚

### 1.2 容器 vs 虚拟机

| 特性     | 容器（Docker）        | 虚拟机（VM）          |
| -------- | --------------------- | --------------------- |
| 启动时间 | 秒级                  | 分钟级                |
| 资源占用 | MB 级                 | GB 级                 |
| 性能     | 接近原生              | 有损耗                |
| 隔离级别 | 进程级（共享内核）    | 系统级（独立内核）    |
| 单机容量 | 可运行数百个容器      | 通常只能运行几十个 VM |
| 镜像大小 | 通常几十 MB ~ 几百 MB | 通常几 GB             |

**架构对比：**

```
虚拟机架构：                        容器架构：
┌─────────────────────────┐        ┌─────────────────────────┐
│  App A  │  App B  │ App C│        │  App A  │  App B  │ App C│
├─────────┼─────────┼──────┤        ├─────────┼─────────┼──────┤
│ Guest OS│ Guest OS│GuestOS│       │ Container│Container│Container│
├─────────┴─────────┴──────┤        ├─────────┴─────────┴──────┤
│       Hypervisor         │        │       Docker Engine       │
├──────────────────────────┤        ├──────────────────────────┤
│       Host OS            │        │       Host OS            │
├──────────────────────────┤        ├──────────────────────────┤
│       Hardware           │        │       Hardware           │
└──────────────────────────┘        └──────────────────────────┘
```

### 1.3 Docker 核心概念

| 概念               | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| **镜像 Image**     | 只读模板，包含运行应用所需的代码、运行时、库、环境变量和配置 |
| **容器 Container** | 镜像的运行实例，可以启动、停止、删除，相互隔离               |
| **仓库 Registry**  | 存储镜像的地方，如 Docker Hub、阿里云镜像仓库                |
| **Dockerfile**     | 构建镜像的脚本文件，包含一系列指令                           |
| **Docker Compose** | 定义和运行多容器应用的工具                                   |

**镜像与容器的关系：**

- 镜像是类，容器是对象
- 一个镜像可以创建多个容器
- 容器可以被启动、停止、删除，但镜像不变
- 镜像存放在远程**仓库（Registry）**，使用前需先**拉取到本机**，才能基于镜像 run 出容器

### 1.4 Docker 架构

Docker 采用 **C/S 架构**：

```
┌─────────────────────────────────────────────────────────────┐
│                        Docker 客户端                         │
│  docker build  │  docker pull  │  docker run  │  ...        │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API
┌───────────────────────────▼─────────────────────────────────┐
│                      Docker 守护进程（dockerd）              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  镜像    │  │  容器    │  │  网络    │  │  数据卷   │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                      Docker 仓库（Registry）                 │
│                   Docker Hub / 阿里云 / 私有仓库             │
└─────────────────────────────────────────────────────────────┘
```

***

## 二、Docker 安装

### 2.1 卸载旧版本（升级/重装时执行）

升级或重装时执行；首次安装可跳过。从旧版或第三方包升级时，先卸载旧版本以避免冲突。

旧版可能出现的包名：`docker`、`docker-engine`、`docker.io`、`containerd`、`runc`

#### Ubuntu / Debian

```bash
# 卸载旧版本（如果没有安装过会提示 "unable to locate"，可忽略）
sudo apt remove docker docker-engine docker.io containerd runc

# 清理残留（可选）
sudo apt autoremove
```

#### CentOS / RHEL

```bash
# 卸载旧版本
sudo yum remove docker \
                docker-client \
                docker-client-latest \
                docker-common \
                docker-latest \
                docker-latest-logrotate \
                docker-logrotate \
                docker-engine
```

旧版数据（镜像、容器、卷）位于 `/var/lib/docker/`，卸载不删除；全新安装时可手动删除该目录。

***

### 2.2 在 Linux 上安装

#### Ubuntu / Debian

```bash
# 1. 更新并安装依赖
sudo apt update
sudo apt install -y ca-certificates curl gnupg

# 2. 添加 Docker 官方 GPG 密钥（使用 /etc/apt/keyrings）
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 3. 添加 Docker 软件源（Ubuntu 用 ubuntu，Debian 改为 debian）
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME:-$VERSION_CODENAME}) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. 安装 Docker（含 buildx、compose 插件）
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. 启动并设置开机自启
sudo systemctl enable --now docker

# 6. 验证
docker version
docker run --rm hello-world
docker compose version
```

出现 `permission denied ... docker.sock` 时，需将当前用户加入 docker 组后重试。

#### CentOS / RHEL / Rocky / Alma

```bash
# 1. 安装依赖
sudo yum install -y yum-utils

# 2. 添加 Docker 软件源
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 3. 安装 Docker（含 buildx、compose 插件）
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. 启动并设置开机自启
sudo systemctl enable --now docker

# 5. 验证
docker version
docker run --rm hello-world
docker compose version
```

### 2.3 配置非 root 用户使用 Docker

默认只有 root 能访问 Docker 守护进程，普通用户会报 `permission denied ... docker.sock`。将当前用户加入 `docker` 组即可：

```bash
# 将当前用户加入 docker 组（安装时已创建该组）
sudo usermod -aG docker $USER

# 使组生效：执行下面命令，或退出终端重新登录
newgrp docker

# 验证（无需 sudo）
docker run --rm hello-world
```

权限仍异常时，执行 `groups` 确认是否含 `docker`；SSH 会话需重新登录后生效。

### 2.4 配置镜像加速

国内直连 Docker Hub 易超时，可配置镜像加速器：

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<'EOF'
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io"
  ]
}
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
```

可选镜像源（部分需注册）：阿里云、DaoCloud、USTC、网易等。验证：`docker info | grep -A 5 "Registry Mirrors"`。  
此处「镜像」指镜像源（registry mirror），与镜像（image）含义不同。

### 2.5 Docker Desktop（Mac/Windows）

Mac 和 Windows 用户可以安装 Docker Desktop：

1. 访问 [Docker 官网](https://www.docker.com/products/docker-desktop/) 下载对应版本
2. 安装并启动 Docker Desktop
3. 在设置中可以配置镜像加速、资源限制等

***

## 三、Docker 镜像

### 3.1 镜像层

镜像由**多层只读层**组成，每一层对应一次文件系统变更（如安装包、复制文件）。Docker 使用**联合文件系统（UnionFS）**把这些层叠在一起，形成容器看到的完整根目录；容器运行时在其上增加一个可写层，修改不会写回镜像。

**层带来的影响：**

- **共享与复用**：相同层在不同镜像/容器间只存一份，拉取或启动时复用，节省空间和时间。
- **构建缓存**：Dockerfile 每条指令（如 `RUN`、`COPY`）通常产生一层；再次构建时，若某层及之前内容未变，会直接使用缓存，否则从该层起重新执行。因此把不常变的指令（如 `COPY 依赖文件`）放前面、常变的（如 `COPY 源码`）放后面，能更好利用缓存。
- **镜像体积**：层数多、每层写得多，镜像就大；合并 `RUN`、多阶段构建等可减少层数或每层内容，从而减小最终镜像。

查看某镜像由哪些层组成：`docker history 镜像名或ID`。

### 3.2 镜像基本操作

`pull` 从仓库拉取；`search` 在仓库中搜索；`images` 列出本地镜像；`inspect` 查看详情；`history` 查看各层；`rmi` 删除；`prune` 清理未使用。

```bash
# 搜索镜像
docker search nginx

# 拉取镜像（默认 latest 标签）
docker pull nginx
docker pull nginx:1.24          # 指定版本

# 查看本地镜像
docker images
docker image ls

# 查看镜像详细信息
docker inspect nginx

# 查看镜像各层（对应 Dockerfile 指令与缓存）
docker history nginx

# 删除镜像
docker rmi nginx                # 按名称删除
docker rmi abc123               # 按 ID 删除
docker rmi -f nginx             # 强制删除（即使有容器使用）

# 删除所有未使用的镜像
docker image prune
docker image prune -a           # 删除所有未被容器使用的镜像
```

### 3.3 镜像命名规范

镜像的完整名称格式：

```
[仓库地址/]仓库名[:标签]
```

示例：

| 镜像名称                                       | 说明                             |
| ---------------------------------------------- | -------------------------------- |
| `nginx`                                        | Docker Hub 官方镜像，latest 标签 |
| `nginx:1.24`                                   | 指定版本标签                     |
| `mysql:8.0`                                    | MySQL 8.0 版本                   |
| `registry.cn-hangzhou.aliyuncs.com/xxx/app:v1` | 阿里云镜像仓库                   |

### 3.4 镜像导入导出

```bash
# 导出镜像为文件
docker save -o nginx.tar nginx:latest
docker save nginx:latest > nginx.tar

# 从文件导入镜像
docker load -i nginx.tar
docker load < nginx.tar

# 查看导入结果
docker images
```

### 3.5 常用官方镜像

| 镜像名称  | 说明                        | 常用标签                   |
| --------- | --------------------------- | -------------------------- |
| `nginx`   | Web 服务器                  | `latest`, `1.24`, `alpine` |
| `mysql`   | MySQL 数据库                | `8.0`, `5.7`               |
| `redis`   | Redis 缓存                  | `7`, `6`, `alpine`         |
| `openjdk` | Java 运行环境               | `17`, `11`, `8`            |
| `node`    | Node.js 运行环境            | `20`, `18`, `alpine`       |
| `python`  | Python 运行环境             | `3.12`, `3.11`, `slim`     |
| `ubuntu`  | Ubuntu 基础镜像             | `22.04`, `20.04`           |
| `alpine`  | 超轻量 Linux 镜像（约 5MB） | `3.19`, `latest`           |

`alpine` 标签基于 Alpine Linux，镜像体积更小，适用于生产环境。

***

## 四、Docker 容器

### 4.1 容器生命周期

```
创建 ──► 运行 ──► 暂停 ──► 停止 ──► 删除
         │         │       │
         └─────────┴───────┘
              重启
```

### 4.2 创建和运行容器

**命令格式**：`docker run [选项] 镜像名[:标签] [容器内要执行的命令]`  
常用选项：`-d` 后台运行；`-p 宿主机端口:容器端口` 端口映射；`-v 宿主机路径:容器路径` 挂载数据卷；`-e 变量=值` 环境变量；`--name 名称` 容器名；`--restart 策略` 重启策略。

```bash
# 创建并启动容器（前台运行）
docker run nginx

# 后台运行（-d：detached 模式）
docker run -d nginx

# 指定容器名称
docker run -d --name my-nginx nginx

# 端口映射（-p 宿主机端口:容器端口）
docker run -d -p 80:80 nginx
docker run -d -p 8080:80 nginx          # 宿主机 8080 映射到容器 80

# 多个端口映射
docker run -d -p 80:80 -p 443:443 nginx

# 环境变量（-e）
docker run -d -e MYSQL_ROOT_PASSWORD=123456 mysql:8.0

# 数据卷挂载（-v 宿主机路径:容器路径；Linux 宿主机常规用 /srv/服务名）
docker run -d -v /srv/nginx:/usr/share/nginx/html nginx

# 综合示例：运行 MySQL
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -v /srv/mysql:/var/lib/mysql \
  mysql:8.0
```

### 4.3 容器管理

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括已停止的）
docker ps -a

# 查看容器详细信息
docker inspect 容器名或ID

# 查看容器日志
docker logs 容器名或ID
docker logs -f 容器名或ID          # 实时跟踪日志
docker logs --tail 100 容器名或ID   # 最后 100 行

# 查看容器资源使用情况
docker stats
docker stats 容器名或ID

# 查看容器内进程
docker top 容器名或ID
```

### 4.4 容器启停

```bash
# 启动已停止的容器
docker start 容器名或ID

# 停止容器（优雅停止，发送 SIGTERM）
docker stop 容器名或ID

# 强制停止（发送 SIGKILL）
docker kill 容器名或ID

# 重启容器
docker restart 容器名或ID

# 暂停/恢复容器
docker pause 容器名或ID
docker unpause 容器名或ID
```

### 4.5 进入容器

```bash
# 进入运行中的容器（exec）
docker exec -it 容器名或ID bash
docker exec -it 容器名或ID /bin/sh   # Alpine 等没有 bash 的镜像

# 参数说明
# -i：保持标准输入打开（interactive）
# -t：分配伪终端（tty）

# 在容器中执行命令（不进入交互模式）
docker exec 容器名或ID ls /app
docker exec 容器名或ID cat /etc/nginx/nginx.conf

# 以 root 用户进入
docker exec -it -u root 容器名或ID bash
```

### 4.6 容器删除

```bash
# 删除已停止的容器
docker rm 容器名或ID

# 强制删除运行中的容器
docker rm -f 容器名或ID

# 删除所有已停止的容器
docker container prune

# 删除所有容器（谨慎使用）
docker rm -f $(docker ps -aq)
```

### 4.7 容器与 Linux 宿主机文件传输

```bash
# 从容器复制到宿主机
docker cp 容器名:/path/file /host/path

# 从宿主机复制到容器
docker cp /host/file 容器名:/path/

# 示例
docker cp nginx:/etc/nginx/nginx.conf ./nginx.conf
docker cp ./index.html nginx:/usr/share/nginx/html/
```

### 4.8 容器自动重启

```bash
# 创建容器时设置重启策略
docker run -d --restart=always nginx
docker run -d --restart=unless-stopped nginx
docker run -d --restart=on-failure:3 nginx    # 失败时最多重启 3 次

# 修改已存在容器的重启策略
docker update --restart=always 容器名或ID
```

重启策略：

| 策略             | 说明                             |
| ---------------- | -------------------------------- |
| `no`             | 不自动重启（默认）               |
| `always`         | 总是重启，包括 Docker 服务重启后 |
| `unless-stopped` | 除非手动停止，否则总是重启       |
| `on-failure:N`   | 非正常退出时重启，最多 N 次      |

***

## 五、Dockerfile

### 5.1 什么是 Dockerfile

Dockerfile 是一个文本文件，包含构建 Docker 镜像的所有指令。通过 `docker build` 命令可以根据 Dockerfile 构建自定义镜像。

**基础镜像**：Dockerfile 的第一条指令必须是 `FROM`，用于指定**基础镜像**。基础镜像即当前镜像所基于的底层镜像，通常已包含操作系统和运行时（如 openjdk、node、nginx）；后续的 `RUN`、`COPY` 等指令在其上叠加新层，形成最终镜像。选好基础镜像（官方、带版本标签、体积合适）是构建的起点。

### 5.2 常用指令

| 指令         | 说明                               | 示例                                   |
| ------------ | ---------------------------------- | -------------------------------------- |
| `FROM`       | 指定基础镜像（必须是第一条指令）   | `FROM openjdk:17`                      |
| `WORKDIR`    | 设置工作目录                       | `WORKDIR /app`                         |
| `COPY`       | 复制文件到镜像                     | `COPY target/*.jar app.jar`            |
| `ADD`        | 复制文件（支持 URL 和自动解压）    | `ADD app.tar.gz /app`                  |
| `RUN`        | 构建时执行命令                     | `RUN apt update && apt install -y vim` |
| `CMD`        | 容器启动时执行的默认命令           | `CMD ["java", "-jar", "app.jar"]`      |
| `ENTRYPOINT` | 容器启动时执行的命令（不会被覆盖） | `ENTRYPOINT ["java", "-jar"]`          |
| `ENV`        | 设置环境变量                       | `ENV JAVA_HOME=/usr/lib/jvm/java-17`   |
| `ARG`        | 构建时的参数                       | `ARG VERSION=1.0`                      |
| `EXPOSE`     | 声明容器监听的端口（仅作文档说明） | `EXPOSE 8080`                          |
| `VOLUME`     | 创建挂载点                         | `VOLUME /data`                         |
| `USER`       | 指定运行用户                       | `USER appuser`                         |
| `LABEL`      | 添加元数据                         | `LABEL maintainer="dev@example.com"`   |

### 5.3 Dockerfile 示例

#### Spring Boot 应用

```dockerfile
# 基础镜像
FROM openjdk:17-jdk-slim

# 维护者信息
LABEL maintainer="developer@example.com"

# 设置工作目录
WORKDIR /app

# 复制 jar 包
COPY target/*.jar app.jar

# 暴露端口
EXPOSE 8080

# 启动命令
CMD ["java", "-jar", "app.jar"]
```

#### 多阶段构建

```dockerfile
# 第一阶段：构建
FROM maven:3.9-openjdk-17 AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 第二阶段：运行
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

多阶段构建使最终镜像不包含构建工具（Maven、源码等），体积更小。

#### Node.js 应用

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

#### Nginx 静态网站

```dockerfile
FROM nginx:alpine
COPY <静态资源目录>/ /usr/share/nginx/html/   # 如 dist、build 等
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 5.4 构建镜像

```bash
# 基本构建（在 Dockerfile 所在目录执行）
docker build -t myapp:v1 .

# 指定 Dockerfile 路径
docker build -t myapp:v1 -f docker/Dockerfile .

# 传递构建参数
docker build -t myapp:v1 --build-arg VERSION=2.0 .

# 不使用缓存构建
docker build -t myapp:v1 --no-cache .

# 查看构建的镜像
docker images | grep myapp
```

### 5.5 Dockerfile 最佳实践

1. **使用官方基础镜像**：更安全、更小、更新更及时
2. **使用特定版本标签**：避免使用 `latest`，保证构建可重现
3. **合并 RUN 指令**：减少镜像层数

```dockerfile
# 不推荐：多层 RUN
RUN apt update
RUN apt install -y vim
RUN apt install -y curl

# 推荐：合并并清理
RUN apt update && apt install -y \
    vim \
    curl \
    && rm -rf /var/lib/apt/lists/*
```

4. **利用构建缓存**：将不常变化的指令放在前面
5. **使用 .dockerignore**：排除不需要的文件

```
# .dockerignore
.git
node_modules
target
*.log
.env
```

6. **不要以 root 用户运行应用**

```dockerfile
RUN useradd -r -u 1001 appuser
USER appuser
```

***

## 六、Docker 数据卷

### 6.1 为什么需要数据卷

容器的文件系统是临时的，容器删除后数据会丢失。数据卷用于：

- **持久化数据**：数据库文件、上传文件等
- **数据共享**：多个容器共享数据
- **配置文件**：将配置文件挂载到容器中

### 6.2 数据卷类型

| 类型           | 说明                               | 示例                            |
| -------------- | ---------------------------------- | ------------------------------- |
| **命名卷**     | 由 Docker 管理，存储在 Docker 目录 | `-v mydata:/app/data`           |
| **绑定挂载**   | 挂载 Linux 宿主机指定路径（常规用 /srv/服务名） | `-v /srv/mysql:/var/lib/mysql` |
| **tmpfs 挂载** | 存储在内存中，容器停止后消失       | `--tmpfs /app/cache`            |

### 6.3 数据卷操作

```bash
# 创建数据卷
docker volume create mydata

# 查看所有数据卷
docker volume ls

# 查看数据卷详情
docker volume inspect mydata

# 删除数据卷
docker volume rm mydata

# 删除所有未使用的数据卷
docker volume prune
```

### 6.4 使用数据卷

```bash
# 使用命名卷
docker run -d -v mydata:/var/lib/mysql mysql:8.0

# 使用绑定挂载（宿主机常规用 /srv/服务名）
docker run -d -v /srv/mysql:/var/lib/mysql mysql:8.0

# 只读挂载（配置可放 /srv/nginx 或 /etc）
docker run -d -v /srv/nginx/nginx.conf:/etc/nginx/nginx.conf:ro nginx

# 多个数据卷（数据用 /srv，日志用 /var/log）
docker run -d \
  -v /srv/mysql:/var/lib/mysql \
  -v /var/log/mysql:/var/log/mysql \
  mysql:8.0
```

### 6.5 数据卷示例

Nginx、MySQL 挂载示例如下；Redis 等在段末简述。以下宿主机路径为 **Linux 常规做法**：服务数据放 `/srv/服务名`，需先创建目录（`/srv` 通常需 root，故用 `sudo mkdir`）。

---

#### MySQL 挂载示例

**挂载项**：数据目录（必）、配置文件（可选）、初始化脚本（可选）。

| 挂载项     | 容器内路径                        | 说明                         |
| ---------- | --------------------------------- | ---------------------------- |
| 数据目录   | `/var/lib/mysql`                  | 必挂，否则容器删除后数据丢失 |
| 配置文件   | `/etc/mysql/conf.d/` 或自定义路径 | 可选，自定义 my.cnf 等       |
| 初始化脚本 | `/docker-entrypoint-initdb.d/`    | 可选，容器首次启动时执行 SQL |

**宿主机目录（Linux）**：`/srv/mysql/data`、`/srv/mysql/conf`、`/srv/mysql/init`。

**示例（绑定挂载）**：

```bash
sudo mkdir -p /srv/mysql/data /srv/mysql/conf /srv/mysql/init

docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=密码 \
  -e MYSQL_DATABASE=mydb \
  -v /srv/mysql/data:/var/lib/mysql \
  -v /srv/mysql/conf:/etc/mysql/conf.d \
  -v /srv/mysql/init:/docker-entrypoint-initdb.d \
  --restart unless-stopped \
  mysql:8.0
```

`MYSQL_ROOT_PASSWORD` 必设。`/docker-entrypoint-initdb.d` 下 `.sql`、`.sh` 仅首次启动时执行。字符集可通过 `command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci` 指定。

---

#### Nginx 挂载示例

**挂载项**：网站根目录（静态资源）、配置目录（或单文件）。

| 挂载项     | 容器内路径              | 说明                 |
| ---------- | ----------------------- | -------------------- |
| 网站根目录 | `/usr/share/nginx/html` | 前端/静态资源        |
| 配置       | `/etc/nginx/conf.d/`    | 挂载目录，放置 .conf 文件 |

**宿主机目录（Linux）**：`/srv/nginx/html`、`/srv/nginx/conf.d`。

**示例（绑定挂载）**：

```bash
sudo mkdir -p /srv/nginx/html /srv/nginx/conf.d
```

在宿主机 `/srv/nginx/conf.d/default.conf` 新建配置（挂载会覆盖镜像内 conf.d，至少需一个 server 块）：

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

再启动容器：

```bash
docker run -d \
  --name nginx \
  -p 80:80 \
  -v /srv/nginx/html:/usr/share/nginx/html:ro \
  -v /srv/nginx/conf.d:/etc/nginx/conf.d:ro \
  --restart unless-stopped \
  nginx:alpine
```

挂载 `conf.d` 会覆盖镜像内该目录，宿主机需提供至少一个 `server` 配置；静态资源可使用 `:ro` 只读挂载。

---

#### 其他常用镜像简述

- **Redis**：持久化时挂载数据目录即可，例如 `-v /srv/redis:/data`，可选 `command: redis-server --appendonly yes`。
- **应用类镜像**（如 Node、OpenJDK）：挂载由 Dockerfile 或 compose 定义，按项目需求配置即可。

***

## 七、Docker 网络

### 7.1 网络模式

Docker 提供多种网络模式：

| 网络模式    | 说明                                   | 使用场景       |
| ----------- | -------------------------------------- | -------------- |
| `bridge`    | 默认模式，容器通过虚拟网桥通信         | 大多数场景     |
| `host`      | 容器直接使用宿主机网络                 | 需要高性能网络 |
| `none`      | 无网络                                 | 安全隔离       |
| `container` | 共享另一个容器的网络                   | 紧密耦合的容器 |
| 自定义网络  | 用户创建的 bridge 网络，支持容器名通信 | 多数场景       |

### 7.2 网络操作

```bash
# 查看网络列表
docker network ls

# 创建自定义网络
docker network create mynet

# 查看网络详情
docker network inspect mynet

# 删除网络
docker network rm mynet

# 删除所有未使用的网络
docker network prune
```

### 7.3 容器连接网络

```bash
# 创建容器时指定网络
docker run -d --network mynet --name app nginx

# 将已存在的容器连接到网络
docker network connect mynet 容器名

# 断开容器与网络的连接
docker network disconnect mynet 容器名

# 使用 host 网络
docker run -d --network host nginx
```

### 7.4 容器间通信

在同一个自定义网络中，容器可以通过容器名互相访问：

```bash
# 创建网络
docker network create app-net

# 启动 MySQL
docker run -d \
  --name mysql \
  --network app-net \
  -e MYSQL_ROOT_PASSWORD=123456 \
  mysql:8.0

# 启动应用（可以通过 mysql 这个名称访问数据库）
docker run -d \
  --name app \
  --network app-net \
  -e DB_HOST=mysql \
  myapp:v1
```

***

## 八、Docker Compose

### 8.1 什么是 Docker Compose

Docker Compose 是一个定义和运行多容器 Docker 应用的工具。通过一个 YAML 文件配置所有服务，然后使用一条命令创建并启动所有服务。

### 8.2 安装 Docker Compose

- **Docker Desktop（Mac/Windows）**：已内置。
- **Linux 从官方源安装 Docker 时**：已包含 `docker-compose-plugin`，直接使用 `docker compose`（有空格，V2 插件）即可，无需单独安装。
- **未装插件时**：可单独安装 standalone 版 `docker-compose`（旧写法，命令带连字符）：

```bash
# 仅当未安装 docker-compose-plugin 时可选
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

V2 插件：`docker compose version` / `docker compose up -d`。

### 8.3 docker-compose.yml 语法

```yaml
# version 在 Compose V2 中可选，可省略
version: '3.8'

services:        # 服务定义
  service-name:  # 服务名称
    image: nginx:latest         # 使用的镜像
    build: ./path               # 或从 Dockerfile 构建
    container_name: my-nginx    # 容器名称
    ports:                      # 端口映射
      - "80:80"
    volumes:                    # 数据卷
      - ./html:/usr/share/nginx/html
    environment:                # 环境变量
      - KEY=value
    env_file:                   # 环境变量文件
      - .env
    networks:                   # 网络
      - mynet
    depends_on:                 # 依赖（启动顺序）
      - db
    restart: always             # 重启策略

networks:        # 网络定义
  mynet:
    driver: bridge

volumes:         # 数据卷定义
  mydata:
```

### 8.4 常用示例

#### Spring Boot + MySQL + Redis

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: spring-app
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis
    networks:
      - app-net
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    container_name: mysql
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=123456
      - MYSQL_DATABASE=mydb
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - app-net
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-net
    restart: unless-stopped

networks:
  app-net:
    driver: bridge

volumes:
  mysql-data:
  redis-data:
```

#### Nginx + 前端 + 后端

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./frontend/<静态资源目录>:/usr/share/nginx/html   # 如 dist、build
    depends_on:
      - backend
    networks:
      - app-net

  backend:
    build: ./backend
    expose:
      - "8080"
    environment:
      - DB_HOST=db
    depends_on:
      - db
    networks:
      - app-net

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - pg-data:/var/lib/postgresql/data
    networks:
      - app-net

networks:
  app-net:

volumes:
  pg-data:
```

### 8.5 Docker Compose 命令

以下以 **V2 插件** `docker compose` 为例（若使用 standalone 则改为 `docker-compose`）：

```bash
# 启动所有服务（后台）
docker compose up -d

# 启动并重新构建
docker compose up -d --build

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs
docker compose logs -f          # 实时跟踪
docker compose logs app        # 指定服务

# 停止服务
docker compose stop

# 停止并删除容器、网络
docker compose down

# 停止并删除容器、网络、数据卷
docker compose down -v

# 重启服务
docker compose restart

# 进入服务容器
docker compose exec app bash

# 查看服务配置
docker compose config
```

***

## 九、实战：部署 Spring Boot 项目

### 9.1 准备工作

项目结构（本地目录名可为 `project`；部署到 Linux 时建议放在 `/srv/app`）：

```
project/
├── src/
├── pom.xml
├── Dockerfile
└── docker-compose.yml
```

### 9.2 编写 Dockerfile

```dockerfile
# 多阶段构建
FROM maven:3.9-openjdk-17 AS builder
WORKDIR /build
COPY pom.xml .
# 先下载依赖（利用缓存）
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# 运行阶段
FROM openjdk:17-jdk-slim
WORKDIR /app

# 创建非 root 用户
RUN useradd -r -u 1001 appuser

# 复制 jar 包
COPY --from=builder /build/target/*.jar app.jar

# 切换用户
USER appuser

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# 启动命令
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 9.3 编写 docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: springboot-app
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/mydb?useSSL=false&serverTimezone=Asia/Shanghai
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=123456
      - SPRING_REDIS_HOST=redis
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app-net
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    container_name: mysql
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=123456
      - MYSQL_DATABASE=mydb
      - TZ=Asia/Shanghai
    volumes:
      - mysql-data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-net
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    networks:
      - app-net
    restart: unless-stopped

networks:
  app-net:
    driver: bridge

volumes:
  mysql-data:
  redis-data:
```

### 9.4 部署步骤

Linux 上建议将项目放在 `/srv/app`。先在服务器上创建目录并交给部署用户：`sudo mkdir -p /srv/app`，`sudo chown 用户名:用户名 /srv/app`。

```bash
# 1. 上传项目到服务器（将 project 目录内容上传到 /srv/app）
scp -r project/. 用户名@服务器IP:/srv/app/

# 2. 进入项目目录
cd /srv/app

# 3. 构建并启动
docker compose up -d --build

# 4. 查看状态
docker compose ps

# 5. 查看日志
docker compose logs -f app

# 6. 访问应用
curl http://localhost:8080

# 7. 更新部署
docker compose down
docker compose up -d --build
```

***

## 十、实战：Linux 虚拟机 Docker Nginx 部署前后端

**前提**：Linux 已安装 Docker、可 SSH 传文件；前端已打包为静态资源目录，后端已有 Java 应用镜像；MySQL、Nginx 已创建并运行（数据与配置已挂载）。多个 Java 应用可共用同一 MySQL，用不同库名区分。

**目标**：浏览器访问 `http://Linux的IP` 得前端页面，`/api` 由 Nginx 转发至后端。

---

### 10.1 宿主机目录与 Nginx 配置

宿主机目录：`/srv/app/frontend`（静态资源）、`/srv/app/nginx/conf.d`（Nginx 配置）。

```bash
sudo mkdir -p /srv/app/frontend /srv/app/nginx/conf.d
```

`/srv/app/nginx/conf.d/default.conf` 示例（`proxy_pass` 填后端容器名与端口，如 `http://tlias:8080`）：

```nginx
server {
    listen       80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://tlias:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 10.2 创建网络、接入 MySQL 与启动后端

顺序：建网 → 将已有 MySQL 容器加入该网络 → 启动 Java 应用（同网）。多项目时在 MySQL 中为各项目建库，后端连接 `mysql:3306`、仅库名不同，容器名与宿主机端口按项目区分。

**1. 创建网络**

```bash
docker network create app-net
```

**2. 将已有 MySQL 容器加入该网络**

```bash
docker network connect app-net <MySQL容器名>
```

**3. 多项目时在 MySQL 中建库**

每个项目一个库：`docker exec -it mysql mysql -uroot -p -e "CREATE DATABASE 库名 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`

**4. 启动 Java 应用镜像**

```bash
docker run -d --name tlias --network app-net -p 8080:8080 tlias:1.0
```

应用内数据源：`jdbc:mysql://mysql:3306/tlias?useSSL=false&serverTimezone=Asia/Shanghai`。第二个项目：换容器名、宿主机端口与库名，如 `--name order -p 8081:8080`，连接串中库名改为 `order_system`。

Nginx 未入该网络时：`docker network connect app-net nginx`。

### 10.3 验证与访问

访问 `http://Linux虚拟机IP` 可见前端，`/api/xxx` 经 Nginx 转发至后端。404/502 多为后端未运行、`proxy_pass` 容器名或端口错误、防火墙未放行 80/8080。

### 10.4 日常维护

改 Nginx 配置后执行 `docker exec nginx nginx -s reload`。更新前端：覆盖 `/srv/app/frontend/` 下文件。重建后端容器时保持与上述相同的网络、容器名、端口及数据源库名。

***

## 十一、常用命令速查表

命令与常用参数速查；详细语法见 `docker 命令 --help` 或 `docker 子命令 --help`。

### 11.1 镜像命令

| 命令                           | 说明             |
| ------------------------------ | ---------------- |
| `docker images`                | 查看本地镜像     |
| `docker pull 镜像名:标签`       | 拉取镜像         |
| `docker rmi 镜像名`            | 删除镜像         |
| `docker history 镜像`          | 查看镜像各层     |
| `docker build -t 名称 .`       | 构建镜像         |
| `docker save -o file.tar 镜像` | 导出镜像         |
| `docker load -i file.tar`      | 导入镜像         |
| `docker image prune`           | 清理未使用镜像   |

### 11.2 容器命令

| 命令                             | 说明             |
| -------------------------------- | ---------------- |
| `docker run -d 镜像`             | 后台运行容器     |
| `docker ps`                      | 查看运行中的容器 |
| `docker ps -a`                   | 查看所有容器     |
| `docker start/stop/restart 容器` | 启动/停止/重启   |
| `docker rm 容器`                 | 删除容器         |
| `docker logs -f 容器`            | 查看容器日志     |
| `docker exec -it 容器 bash`      | 进入容器         |
| `docker cp 源 目标`              | 文件复制         |
| `docker inspect 容器`            | 查看容器详情     |

### 11.3 常用参数

适用于 `docker run` 及 docker-compose 服务配置：

| 参数                     | 说明                                                   |
| ------------------------ | ------------------------------------------------------ |
| `-d`                     | 后台运行                                               |
| `-p 宿主机端口:容器端口` | 端口映射                                               |
| `-v 宿主机路径:容器路径` | 数据卷挂载                                             |
| `-e 变量=值`             | 设置环境变量                                           |
| `--name 名称`            | 指定容器名称                                           |
| `--network 网络名`       | 指定网络                                               |
| `--restart 策略`         | 自动重启                                               |
| `--add-host 主机名:IP`   | 添加主机名解析（如 host.docker.internal:host-gateway） |
| `-it`                    | 交互式终端                                             |

### 11.4 Docker Compose 命令

V2 插件：`docker compose`（有空格）；standalone：`docker-compose`（连字符）。

| 命令                            | 说明         |
| ------------------------------- | ------------ |
| `docker compose up -d`          | 启动所有服务 |
| `docker compose down`           | 停止并删除   |
| `docker compose ps`             | 查看服务状态 |
| `docker compose logs -f`        | 查看日志     |
| `docker compose exec 服务 bash` | 进入服务容器 |
| `docker compose restart`        | 重启服务     |
| `docker compose build`          | 构建服务     |

### 11.5 清理命令

```bash
# 清理所有未使用的资源（镜像、容器、网络、数据卷）
docker system prune -a --volumes

# 查看 Docker 磁盘使用
docker system df
```
