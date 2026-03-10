# Docker 常用命令

## 一、镜像与容器

| 命令 | 说明 |
| --- | --- |
| `docker build -t name:tag .` | 当前目录 Dockerfile 构建镜像，-t 打标签 |
| `docker run -d -p 宿主机端口:容器端口 --name 容器名 镜像` | 后台运行容器并映射端口、命名 |
| `docker exec -it 容器名 /bin/bash` | 进入运行中容器的 shell |
| `docker logs -f 容器名` | 查看容器日志，-f 持续输出 |
| `docker stop/start/rm 容器名` | 停止/启动/删除容器 |

***

## 二、Compose

| 命令 | 说明 |
| --- | --- |
| `docker-compose up -d` | 后台启动 compose 中所有服务 |
| `docker-compose down` | 停止并删除 compose 创建的容器与网络 |
| `docker-compose ps/logs` | 查看服务状态/日志 |

***

## 三、面试答题要点

- **build/run**：构建镜像、运行容器；-d 后台、-p 端口、--name 命名。
- **exec**：进入容器；**logs**：看日志。
- **compose**：up -d 启动、down 停止并清理。
