## I. Docker Overview

### 1.1 What Is Docker?

Docker is an open-source containerization platform that packages applications and their dependencies into lightweight, portable containers. Containers run in any environment supporting Docker, enabling "build once, run anywhere."

**Docker's key advantages:**

- **Consistency:** Identical development, testing, and production environments solve the "it works on my machine" problem
- **Isolation:** Containers are isolated from one another and do not interfere
- **Lightweight:** Sharing the host kernel enables fast startup and low resource usage
- **Portability:** Containers run in any Docker environment
- **Version control:** Images can be versioned and rolled back

### 1.2 Containers vs. Virtual Machines

| Feature | Containers (Docker) | Virtual machines (VMs) |
| -------- | --------------------- | --------------------- |
| Startup time | Seconds | Minutes |
| Resource usage | MB scale | GB scale |
| Performance | Near native | Some overhead |
| Isolation level | Process level (shared kernel) | System level (independent kernel) |
| Capacity per machine | Hundreds of containers | Usually only dozens of VMs |
| Image size | Usually tens to hundreds of MB | Usually several GB |

**Architecture comparison:**

```text
Virtual machine architecture:            Container architecture:
┌───────────┬───────────┬───────────┐    ┌───────────┬───────────┬───────────┐
│   App A   │   App B   │   App C   │    │   App A   │   App B   │   App C   │
├───────────┼───────────┼───────────┤    ├───────────┼───────────┼───────────┤
│ Guest OS  │ Guest OS  │ Guest OS  │    │ Container │ Container │ Container │
├───────────┴───────────┴───────────┤    ├───────────┴───────────┴───────────┤
│            Hypervisor             │    │           Docker Engine           │
├───────────────────────────────────┤    ├───────────────────────────────────┤
│              Host OS              │    │              Host OS              │
├───────────────────────────────────┤    ├───────────────────────────────────┤
│             Hardware              │    │             Hardware              │
└───────────────────────────────────┘    └───────────────────────────────────┘
```

### 1.3 Core Docker Concepts

| Concept | Description |
| ------------------ | ------------------------------------------------------------ |
| **Image** | Read-only template containing the code, runtime, libraries, environment variables, and configuration needed to run an application |
| **Container** | Running instance of an image; can be started, stopped, or deleted, and is isolated from other containers |
| **Registry** | Storage for images, such as Docker Hub or Alibaba Cloud Container Registry |
| **Dockerfile** | Script containing a sequence of instructions for building an image |
| **Docker Compose** | Tool for defining and running multi-container applications |

**Relationship between images and containers:**

- An image is like a class; a container is like an object
- One image can create multiple containers
- Containers can be started, stopped, and deleted without changing the image
- Images are stored in remote **registries** and must be **pulled locally** before containers can be run from them

### 1.4 Docker Architecture

Docker uses a **client/server architecture**:

```text
┌─────────────────────────────────────────────────────────────┐
│                        Docker client                        │
│  docker build  │  docker pull  │  docker run  │  ...        │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API
┌───────────────────────────▼─────────────────────────────────┐
│                   Docker daemon (dockerd)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Images  │  │Containers│  │ Networks │  │ Volumes  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└───────────────────────────┬─────────────────────────────────┘
                            │ Pull / push images
┌───────────────────────────▼─────────────────────────────────┐
│                       Docker registry                       │
│        Docker Hub / Alibaba Cloud / Private registry        │
└─────────────────────────────────────────────────────────────┘
```

***

## II. Installing Docker

### 2.1 Remove Older Versions (When Upgrading/Reinstalling)

Run this when upgrading or reinstalling; skip it for a first installation. When upgrading from older versions or third-party packages, uninstall the old packages first to avoid conflicts.

Conflicting package names on Ubuntu/Debian include `docker.io`, `docker-doc`, `docker-compose`, `docker-compose-v2`, `podman-docker`, `containerd`, and `runc`

#### Ubuntu / Debian

```bash
# Uninstall conflicting packages (ignore "unable to locate" if they were never installed)
sudo apt remove docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc

# Remove leftovers (optional)
sudo apt autoremove
```

#### CentOS / RHEL

```bash
# Uninstall older versions
sudo yum remove docker \
                docker-client \
                docker-client-latest \
                docker-common \
                docker-latest \
                docker-latest-logrotate \
                docker-logrotate \
                docker-engine
```

Existing data (images, containers, volumes) resides in `/var/lib/docker/` and is not deleted by uninstalling. For a clean installation, this directory can be deleted manually.

***

### 2.2 Install on Linux

#### Ubuntu / Debian

```bash
# 1. Update and install dependencies
sudo apt update
sudo apt install -y ca-certificates curl gnupg

# 2. Add Docker's official GPG key (using /etc/apt/keyrings)
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 3. Add the Docker repository (use ubuntu for Ubuntu; replace with debian for Debian)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME:-$VERSION_CODENAME}) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Install Docker (including buildx and compose plugins)
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Start and enable startup at boot
sudo systemctl enable --now docker

# 6. Verify
docker version
docker run --rm hello-world
docker compose version
```

If `permission denied ... docker.sock` appears, add the current user to the docker group and retry.

#### CentOS / RHEL / Rocky / Alma

```bash
# 1. Install dependencies
sudo yum install -y yum-utils

# 2. Add the Docker repository
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 3. Install Docker (including buildx and compose plugins)
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. Start and enable startup at boot
sudo systemctl enable --now docker

# 5. Verify
docker version
docker run --rm hello-world
docker compose version
```

### 2.3 Allow Non-root Users to Use Docker

By default, only root can access the Docker daemon; regular users receive `permission denied ... docker.sock`. Add the current user to the `docker` group:

```bash
# Add the current user to the docker group (created during installation)
sudo usermod -aG docker $USER

# Apply group membership: run this command or exit the terminal and log in again
newgrp docker

# Verify (without sudo)
docker run --rm hello-world
```

If permissions still fail, run `groups` to confirm `docker` is present; SSH sessions require a new login for the change to take effect.

### 2.4 Configure Registry Mirrors

Direct connections to Docker Hub from China often time out; configure a registry mirror:

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

Possible mirrors (some require registration) include Alibaba Cloud, DaoCloud, USTC, and NetEase. Verify with `docker info | grep -A 5 "Registry Mirrors"`.\
Here, "mirror" means a registry mirror, not a container image.

### 2.5 Docker Desktop (Mac/Windows)

Mac and Windows users can install Docker Desktop:

1. Visit the [Docker website](https://www.docker.com/products/docker-desktop/) and download the appropriate version
2. Install and start Docker Desktop
3. Configure registry mirrors, resource limits, etc. in settings

***

## III. Docker Images

### 3.1 Image Layers

An image consists of **multiple read-only layers**, each representing a filesystem change (such as installing packages or copying files). Docker uses a **union filesystem (UnionFS)** to stack these layers into the complete root directory visible to a container. At runtime, a writable layer is added on top; modifications do not write back to the image.

**Implications of layers:**

- **Sharing and reuse:** Identical layers are stored once across images/containers and reused when pulling or starting, saving space and time.
- **Build cache:** Each Dockerfile instruction (such as `RUN` or `COPY`) usually produces a layer. On subsequent builds, unchanged layers and their predecessors use the cache; otherwise execution restarts from the changed layer. Put infrequently changing instructions (such as `COPY dependency-files`) before frequently changing ones (such as `COPY source-code`) to improve cache reuse.
- **Image size:** More layers and more content per layer increase image size. Combining `RUN` instructions and using multi-stage builds can reduce the number or contents of layers, shrinking the final image.

Inspect the layers of an image with `docker history imageNameOrID`.

### 3.2 Basic Image Operations

`pull` downloads from a registry; `search` searches the registry; `images` lists local images; `inspect` shows details; `history` shows layers; `rmi` deletes images; `prune` removes unused images.

```bash
# Search for images
docker search nginx

# Pull an image (latest tag by default)
docker pull nginx
docker pull nginx:1.24          # Specify a version

# List local images
docker images
docker image ls

# Inspect image details
docker inspect nginx

# View image layers (corresponding to Dockerfile instructions and cache)
docker history nginx

# Delete images
docker rmi nginx                # Delete by name
docker rmi abc123               # Delete by ID
docker rmi -f nginx             # Force deletion (even if a container uses it)

# Remove unused images
docker image prune
docker image prune -a           # Remove all images not used by containers
```

### 3.3 Image Naming Convention

Full image name format:

```text
[registryAddress/]repositoryName[:tag]
```

Examples:

| Image name | Description |
| ---------------------------------------------- | -------------------------------- |
| `nginx` | Official Docker Hub image with the latest tag |
| `nginx:1.24` | Specific version tag |
| `mysql:8.0` | MySQL version 8.0 |
| `registry.cn-hangzhou.aliyuncs.com/xxx/app:v1` | Alibaba Cloud Container Registry |

### 3.4 Importing and Exporting Images

```bash
# Export an image to a file
docker save -o nginx.tar nginx:latest
docker save nginx:latest > nginx.tar

# Import an image from a file
docker load -i nginx.tar
docker load < nginx.tar

# Check the imported image
docker images
```

### 3.5 Common Official Images

| Image | Description | Common tags |
| --------- | --------------------------- | -------------------------- |
| `nginx` | Web server | `latest`, `1.24`, `alpine` |
| `mysql` | MySQL database | `8.4`, `8.0` |
| `redis` | Redis cache | `7`, `7-alpine` |
| `eclipse-temurin` | Java runtime (replaces the deprecated `openjdk` image) | `21`, `17`, `17-jre` |
| `node` | Node.js runtime | `22`, `20`, `alpine` |
| `python` | Python runtime | `3.12`, `3.11`, `slim` |
| `ubuntu` | Ubuntu base image | `24.04`, `22.04` |
| `alpine` | Ultra-lightweight Linux image (about 5MB) | `3.19`, `latest` |

The `alpine` tag is based on Alpine Linux, producing smaller images suitable for production.

***

## IV. Docker Containers

### 4.1 Container Lifecycle

```text
Create ──► Run ──► Pause ──► Stop ──► Delete
            ▲        │        │
            └────────┴────────┘
         unpause / start / restart
```

### 4.2 Creating and Running Containers

**Command format:** `docker run [options] imageName[:tag] [commandToRunInContainer]`\
Common options: `-d` runs in the background; `-p hostPort:containerPort` maps ports; `-v hostPath:containerPath` mounts volumes; `-e variable=value` sets environment variables; `--name name` names the container; `--restart policy` sets the restart policy.

```bash
# Create and start a container (foreground)
docker run nginx

# Run in the background (-d: detached mode)
docker run -d nginx

# Specify the container name
docker run -d --name my-nginx nginx

# Port mapping (-p hostPort:containerPort)
docker run -d -p 80:80 nginx
docker run -d -p 8080:80 nginx          # Map host port 8080 to container port 80

# Multiple port mappings
docker run -d -p 80:80 -p 443:443 nginx

# Environment variables (-e)
docker run -d -e MYSQL_ROOT_PASSWORD=123456 mysql:8.0

# Volume mount (-v hostPath:containerPath; create a project directory under /srv with nginx/mysql subdirectories)
docker run -d -v /srv/my-app/nginx/html:/usr/share/nginx/html nginx

# Complete example: run MySQL (mysql data directory under the project deployment directory)
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -v /srv/my-app/mysql/data:/var/lib/mysql \
  mysql:8.0
```

### 4.3 Container Management

```bash
# List running containers
docker ps

# List all containers (including stopped ones)
docker ps -a

# Inspect container details
docker inspect containerNameOrID

# View container logs
docker logs containerNameOrID
docker logs -f containerNameOrID          # Follow logs in real time
docker logs --tail 100 containerNameOrID   # Last 100 lines

# View container resource usage
docker stats
docker stats containerNameOrID

# View processes inside a container
docker top containerNameOrID
```

### 4.4 Starting and Stopping Containers

```bash
# Start a stopped container
docker start containerNameOrID

# Stop a container gracefully (send SIGTERM)
docker stop containerNameOrID

# Force-stop (send SIGKILL)
docker kill containerNameOrID

# Restart a container
docker restart containerNameOrID

# Pause/resume a container
docker pause containerNameOrID
docker unpause containerNameOrID
```

### 4.5 Entering a Container

```bash
# Enter a running container (exec)
docker exec -it containerNameOrID bash
docker exec -it containerNameOrID /bin/sh   # Images without bash, such as Alpine

# Option meanings
# -i: keep standard input open (interactive)
# -t: allocate a pseudo-terminal (tty)

# Execute commands in a container without an interactive session
docker exec containerNameOrID ls /app
docker exec containerNameOrID cat /etc/nginx/nginx.conf

# Enter as root
docker exec -it -u root containerNameOrID bash
```

### 4.6 Deleting Containers

```bash
# Delete a stopped container
docker rm containerNameOrID

# Force-delete a running container
docker rm -f containerNameOrID

# Delete all stopped containers
docker container prune

# Delete all containers (use with care)
docker rm -f $(docker ps -aq)
```

### 4.7 Transferring Files between Containers and the Linux Host

```bash
# Copy from container to host
docker cp containerName:/path/file /host/path

# Copy from host to container
docker cp /host/file containerName:/path/

# Examples
docker cp nginx:/etc/nginx/nginx.conf ./nginx.conf
docker cp ./index.html nginx:/usr/share/nginx/html/
```

### 4.8 Automatic Container Restarts

```bash
# Set the restart policy when creating a container
docker run -d --restart=always nginx
docker run -d --restart=unless-stopped nginx
docker run -d --restart=on-failure:3 nginx    # Restart at most 3 times on failure

# Change an existing container's restart policy
docker update --restart=always containerNameOrID
```

Restart policies:

| Policy | Description |
| ---------------- | -------------------------------- |
| `no` | Do not restart automatically (default) |
| `always` | Always restart, including after the Docker service restarts |
| `unless-stopped` | Always restart unless stopped manually |
| `on-failure:N` | Restart after an abnormal exit, at most N times |

***

## V. Dockerfile

### 5.1 What Is a Dockerfile?

A Dockerfile is a text file containing all the instructions for building a Docker image. Use `docker build` to build a custom image from a Dockerfile.

**Base image:** The first Dockerfile instruction must be `FROM`, specifying the **base image**. This underlying image usually contains an operating system and runtime (such as eclipse-temurin, node, or nginx). Subsequent `RUN`, `COPY`, and other instructions add layers to form the final image. Choose an official base image with a version tag and an appropriate size as the starting point.

### 5.2 Common Instructions

| Instruction | Description | Example |
| ------------ | ---------------------------------- | -------------------------------------- |
| `FROM` | Specify the base image (must be the first instruction) | `FROM eclipse-temurin:17` |
| `WORKDIR` | Set the working directory | `WORKDIR /app` |
| `COPY` | Copy files into the image | `COPY target/*.jar app.jar` |
| `ADD` | Copy files (supports URLs and automatic extraction) | `ADD app.tar.gz /app` |
| `RUN` | Execute a command during the build | `RUN apt update && apt install -y vim` |
| `CMD` | Default command executed when a container starts | `CMD ["java", "-jar", "app.jar"]` |
| `ENTRYPOINT` | Command executed when a container starts (`docker run` arguments are appended, not substituted; override with `--entrypoint`) | `ENTRYPOINT ["java", "-jar"]` |
| `ENV` | Set an environment variable | `ENV JAVA_HOME=/usr/lib/jvm/java-17` |
| `ARG` | Build-time argument | `ARG VERSION=1.0` |
| `EXPOSE` | Declare a container listening port (documentation only) | `EXPOSE 8080` |
| `VOLUME` | Create a mount point | `VOLUME /data` |
| `USER` | Specify the runtime user | `USER appuser` |
| `LABEL` | Add metadata | `LABEL maintainer="dev@example.com"` |

### 5.3 Dockerfile Examples

#### Spring Boot Application

```dockerfile
# Base image
FROM eclipse-temurin:17-jre

# Maintainer information
LABEL maintainer="developer@example.com"

# Set the working directory
WORKDIR /app

# Copy the jar
COPY target/*.jar app.jar

# Expose the port
EXPOSE 8080

# Startup command
CMD ["java", "-jar", "app.jar"]
```

#### Multi-stage Build

Build the source with Maven inside the image, then keep only a JRE and the jar in the runtime stage. A non-root user and health check are optional. This is suitable for building from source without first packaging a jar locally.

```dockerfile
# Stage 1: build
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: run
FROM eclipse-temurin:17-jre
WORKDIR /app
RUN useradd -r -u 1001 appuser
COPY --from=builder /build/target/*.jar app.jar
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]
```

A multi-stage build keeps build tools (Maven, source code, etc.) out of the final image, making it smaller. The project directory must contain `pom.xml`, `src/`, and `Dockerfile`; Compose additionally needs `docker-compose.yml`.

#### Node.js Application

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

#### Nginx Static Website

```dockerfile
FROM nginx:alpine
# Copy the built static files (such as dist or build); Dockerfile comments must start a line
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 5.4 Building Images

```bash
# Basic build (run in the Dockerfile directory)
docker build -t myapp:v1 .

# Specify the Dockerfile path
docker build -t myapp:v1 -f docker/Dockerfile .

# Pass build arguments
docker build -t myapp:v1 --build-arg VERSION=2.0 .

# Build without cache
docker build -t myapp:v1 --no-cache .

# View the built image
docker images | grep myapp
```

### 5.5 Dockerfile Best Practices

1. **Use official base images:** Safer, smaller, and updated more promptly
2. **Use specific version tags:** Avoid `latest` to keep builds reproducible
3. **Combine RUN instructions:** Reduce the number of layers

```dockerfile
# Not recommended: multiple RUN layers
RUN apt update
RUN apt install -y vim
RUN apt install -y curl

# Recommended: combine and clean up
RUN apt update && apt install -y \
    vim \
    curl \
    && rm -rf /var/lib/apt/lists/*
```

4. **Use the build cache:** Put infrequently changing instructions first
5. **Use .dockerignore:** Exclude unnecessary files

```text
# .dockerignore
.git
node_modules
target
*.log
.env
```

6. **Do not run applications as root**

```dockerfile
RUN useradd -r -u 1001 appuser
USER appuser
```

***

## VI. Docker Volumes

### 6.1 Why Are Volumes Needed?

A container's filesystem is temporary: deleting the container loses its data. Volumes provide:

- **Persistence:** Database files, uploaded files, etc.
- **Data sharing:** Share data among multiple containers
- **Configuration files:** Mount configuration files into containers

### 6.2 Mount Types

| Type | Description | Example |
| -------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------ |
| **Named volume** | Managed by Docker and stored in Docker's directory | `-v mydata:/app/data` |
| **Bind mount** | Mount a host path (create a project directory under /srv, then subdirectories such as `projectDirectory/mysql/data`) | `-v /srv/my-app/mysql/data:/var/lib/mysql` |
| **tmpfs mount** | Stored in memory and disappears when the container stops | `--tmpfs /app/cache` |

### 6.3 Volume Operations

```bash
# Create a volume
docker volume create mydata

# List all volumes
docker volume ls

# Inspect volume details
docker volume inspect mydata

# Delete a volume
docker volume rm mydata

# Delete all unused volumes
docker volume prune
```

### 6.4 Using Volumes

```bash
# Use a named volume
docker run -d -v mydata:/var/lib/mysql mysql:8.0

# Use a bind mount (subdirectory of a project directory under /srv, e.g. /srv/my-app)
docker run -d -v /srv/my-app/mysql/data:/var/lib/mysql mysql:8.0

# Read-only mount (configuration under the project's nginx directory, etc.)
docker run -d -v /srv/my-app/nginx/conf.d/default.conf:/etc/nginx/conf.d/default.conf:ro nginx

# Multiple volumes (data under the project directory; logs may use /var/log)
docker run -d \
  -v /srv/my-app/mysql/data:/var/lib/mysql \
  -v /var/log/mysql:/var/log/mysql \
  mysql:8.0
```

### 6.5 Volume Examples

Nginx and MySQL mount examples follow, with Redis covered briefly at the end. Organize host directories **by project**: create a directory named after each project under `/srv`, then service subdirectories such as `mysql/` and `nginx/` to isolate projects. Create these directories first; `/srv` usually requires root permission, so use `sudo mkdir`.

***

#### MySQL Mount Example

**Mounts:** Data directory (required), configuration files (optional), initialization scripts (optional).

| Mount | Container path | Description |
| ---------- | --------------------------------- | ---------------------------- |
| Data directory | `/var/lib/mysql` | Required to prevent data loss when the container is deleted |
| Configuration files | `/etc/mysql/conf.d/` or a custom path | Optional; custom my.cnf, etc. |
| Initialization scripts | `/docker-entrypoint-initdb.d/` | Optional; execute SQL on initial container startup |

**Host directories:** `/srv/<projectName>/mysql/data`, `/srv/<projectName>/mysql/conf`, `/srv/<projectName>/mysql/init` (for example, project `my-app` uses `/srv/my-app/...`).

**Example (bind mounts):**

```bash
# Replace my-app with the actual project name
sudo mkdir -p /srv/my-app/mysql/data /srv/my-app/mysql/conf /srv/my-app/mysql/init

docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=mydb \
  -v /srv/my-app/mysql/data:/var/lib/mysql \
  -v /srv/my-app/mysql/conf:/etc/mysql/conf.d \
  -v /srv/my-app/mysql/init:/docker-entrypoint-initdb.d \
  --restart unless-stopped \
  mysql:8.0
```

`MYSQL_ROOT_PASSWORD` is required. `.sql` and `.sh` files under `/docker-entrypoint-initdb.d` run only on initial startup (when the data directory is empty). MySQL 8 already defaults to `utf8mb4`; to choose a collation, append `--character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci` after the image name (`command:` in Compose).

***

#### Nginx Mount Example

**Mounts:** Website root (static resources), configuration directory (or individual file).

| Mount | Container path | Description |
| ---------- | ----------------------- | ------------------------- |
| Website root | `/usr/share/nginx/html` | Frontend/static resources |
| Configuration | `/etc/nginx/conf.d/` | Mount a directory containing .conf files |

**Host directories:** `/srv/<projectName>/nginx/html`, `/srv/<projectName>/nginx/conf.d` (for example, project `my-app` uses `/srv/my-app/...`).

**Example (bind mounts):**

```bash
# Replace my-app with the actual project name
sudo mkdir -p /srv/my-app/nginx/html /srv/my-app/nginx/conf.d
```

Create `nginx/conf.d/default.conf` under the host project directory (such as `/srv/my-app/nginx/conf.d/default.conf`). The mount hides the image's conf.d directory, so provide at least one server block:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location ^~ /api/ {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then start the container:

```bash
docker run -d \
  --name nginx \
  -p 80:80 \
  -v /srv/my-app/nginx/html:/usr/share/nginx/html:ro \
  -v /srv/my-app/nginx/conf.d:/etc/nginx/conf.d:ro \
  --restart unless-stopped \
  nginx:alpine
```

Mounting `conf.d` hides that directory in the image; the host must provide at least one `server` configuration. Static resources can use a read-only `:ro` mount.

***

#### Other Common Images

- **Redis:** For persistence, mount a project data directory, such as `-v /srv/my-app/redis/data:/data`, and enable AOF with `redis-server --appendonly yes` after the image name (`command:` in Compose).
- **Application images** (such as Node and eclipse-temurin): Define mounts in the Dockerfile or Compose as required by the project.

***

## VII. Docker Networking

### 7.1 Network Modes

Docker provides several network modes:

| Network mode | Description | Use cases |
| ----------- | --------------------------------------------------------- | -------------- |
| `bridge` | Default mode; containers communicate through a virtual bridge | Most scenarios |
| `host` | Container directly uses the host network | High-performance networking |
| `none` | No network | Security isolation |
| `container` | Share another container's network | Tightly coupled containers |
| Custom network | User-created bridge network supporting container-name or Compose service-name communication | Most scenarios |

### 7.2 Network Operations

```bash
# List networks
docker network ls

# Create a custom network
docker network create mynet

# Inspect network details
docker network inspect mynet

# Delete a network
docker network rm mynet

# Delete all unused networks
docker network prune
```

### 7.3 Connecting Containers to Networks

```bash
# Specify a network when creating a container
docker run -d --network mynet --name app nginx

# Connect an existing container to a network
docker network connect mynet containerName

# Disconnect a container from a network
docker network disconnect mynet containerName

# Use host networking
docker run -d --network host nginx
```

### 7.4 Communication between Containers

On the same custom network, containers can reach one another by **container name** or **service name** (with Compose); both resolve to the appropriate container. With `docker run`, only the container name is available. With Compose, prefer service names such as `backend` and `mysql`; generated container names such as `app-backend-1` also work.

```bash
# Create a network
docker network create app-net

# Start MySQL
docker run -d \
  --name mysql \
  --network app-net \
  -e MYSQL_ROOT_PASSWORD=123456 \
  mysql:8.0

# Start the application (it can access the database using the name mysql)
docker run -d \
  --name app \
  --network app-net \
  -e DB_HOST=mysql \
  myapp:v1
```

***

## VIII. Docker Compose

### 8.1 What Is Docker Compose?

Docker Compose defines and runs multi-container Docker applications. Configure all services in one YAML file, then create and start them with a single command.

### 8.2 Installing Docker Compose

- **Docker Desktop (Mac/Windows):** Included.
- **Docker installed from the official Linux repository:** Includes `docker-compose-plugin`; use `docker compose` (with a space, the V2 plugin) directly without a separate installation.
- **If the plugin is missing:** Optionally install standalone `docker-compose` (older command spelling with a hyphen):

```bash
# Optional, only if docker-compose-plugin is not installed
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

V2 plugin: `docker compose version` / `docker compose up -d`.

### 8.3 docker-compose.yml Syntax

```yaml
services:        # Service definitions
  service-name:  # Service name
    image: nginx:latest         # Image to use
    build: ./path               # Or build from a Dockerfile
    container_name: my-nginx    # Container name
    ports:                      # Port mappings
      - "80:80"
    volumes:                    # Volumes
      - ./html:/usr/share/nginx/html
    environment:                # Environment variables
      - KEY=value
    env_file:                   # Environment variable file
      - .env
    networks:                   # Networks
      - mynet
    depends_on:                 # Dependencies (startup order)
      - db
    restart: always             # Restart policy

networks:        # Network definitions
  mynet:
    driver: bridge

volumes:         # Volume definitions
  mydata:
```

### 8.4 Common Examples

#### Spring Boot + MySQL + Redis

The project directory contains `Dockerfile`, `docker-compose.yml`, and optionally `init.sql`. When building from source, include `src/` and `pom.xml` and use a multi-stage Dockerfile. On initial startup, MySQL automatically executes scripts under `/docker-entrypoint-initdb.d/` (for example, a mounted `./init.sql`). Start the application after MySQL is ready using `depends_on` + `condition: service_healthy` together with a MySQL `healthcheck`.

```yaml
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
      - SPRING_DATA_REDIS_HOST=redis   # Spring Boot 3 property spring.data.redis.host
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

#### Nginx + Frontend + Backend

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./frontend/<staticResourceDirectory>:/usr/share/nginx/html   # Such as dist or build
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

### 8.5 Docker Compose Commands

The following uses the **V2 plugin** `docker compose` (replace with `docker-compose` for standalone):

```bash
# Start all services in the background
docker compose up -d

# Rebuild and start
docker compose up -d --build

# View service status
docker compose ps

# View logs
docker compose logs
docker compose logs -f          # Follow in real time
docker compose logs app        # Specific service

# Stop services
docker compose stop

# Stop and remove containers and networks
docker compose down

# Stop and remove containers, networks, and volumes
docker compose down -v

# Restart services
docker compose restart

# Enter a service container
docker compose exec app bash

# View service configuration
docker compose config
```

### 8.6 Deployment Steps (Spring Boot + MySQL + Redis)

The project directory contains `Dockerfile`, `docker-compose.yml`, and optionally `init.sql`. When deploying to Linux, **create a directory named after the project** under `/srv` as its deployment directory. For example: `sudo mkdir -p /srv/my-app`, `sudo chown <username>:<username> /srv/my-app`.

```bash
# 1. Upload the project to the server (replace my-app with the actual project name)
scp -r project/. <username>@<hostIP>:/srv/my-app/

# 2. Enter the project directory
cd /srv/my-app

# 3. Build and start
docker compose up -d --build

# 4. View status
docker compose ps

# 5. View logs
docker compose logs -f app

# 6. Access the application
curl http://localhost:8080

# 7. Update the deployment
docker compose down
docker compose up -d --build
```

***

## IX. Practical Deployment: Frontend and Backend with Docker Nginx on a Linux VM

**Prerequisites:** Docker is installed on the host and SSH file transfers are available; the frontend has been built into a static resource directory (such as dist); the backend has Maven-packaged output (such as a jar); MySQL initialization scripts (database/table creation and initial-data SQL) are prepared. Place them in a host directory and mount it to `/docker-entrypoint-initdb.d/` for automatic execution on MySQL's initial startup.

**Directory convention:** Under `/srv`, **create a directory named after each project**, then place Nginx, MySQL, backend, and other subdirectories plus `docker-compose.yml` inside it. This supports project isolation, backup, and migration. For project `my-app`, create `/srv/my-app` containing `nginx/`, `mysql/`, `backend/`, and `docker-compose.yml`. Multiple projects use separate directories and MySQL containers, with distinct host ports such as 3306 and 3307.

**Goal:** Open `http://<hostIP>` in a browser to access the frontend; Nginx forwards `/api` to the backend.

This chapter covers two approaches: **step-by-step deployment** (useful for understanding the process or connecting existing MySQL/Nginx containers) and **Compose deployment** (same result; generally recommended).

***

### 9.1 Step-by-Step Deployment

**Deployment order:** Create host directories and add the frontend → Configure Nginx → Create a network and connect MySQL → Build the backend image → Start the backend → Connect Nginx to the network if needed → Verify.

If MySQL and Nginx do not exist yet, create them first with volume mounts for data and initialization scripts (for example, mount `/srv/<projectName>/mysql/init` to MySQL's `/docker-entrypoint-initdb.d/`). Scripts run automatically on initial startup, so the database need not be created manually.

#### 1. Host Directories and Frontend

Create a project directory under `/srv` (for example, `/srv/my-app` for project `my-app`), then create subdirectories: `nginx/html` and `nginx/conf.d` for Nginx, and `mysql/data` and `mysql/init` for MySQL.

```bash
# Replace my-app with the actual project name
sudo mkdir -p /srv/my-app/nginx/html /srv/my-app/nginx/conf.d /srv/my-app/mysql/data /srv/my-app/mysql/init
```

Build the frontend (for example, `npm run build`) to obtain a static resource directory such as dist, and copy its **contents** into the project's Nginx mount directory. Locally, run `cp -r frontendProject/dist/* /srv/my-app/nginx/html/`; to upload to a server, run `scp -r frontendProject/dist/* <username>@<hostIP>:/srv/my-app/nginx/html/`. If root is required, upload to the user's directory first, then use `sudo cp`.

#### 2. Nginx Configuration

Create `nginx/conf.d/default.conf` under the project directory (such as `/srv/my-app/nginx/conf.d/default.conf`); set `proxy_pass` to the backend container or service name and port. The container's `root`, `/usr/share/nginx/html`, corresponds to the mounted host static resource directory (such as `/srv/my-app/nginx/html`).

```nginx
server {
    listen       80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html;
        try_files $uri $uri/ /index.html;
    }

    location ^~ /api/ {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://<backendServiceOrContainerName>:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 3. Network and Backend

Order: create the network → connect MySQL → build the backend image → start the backend. Nginx must share the backend's network, with `proxy_pass` using the backend container or service name. When MySQL has an initialization-script directory mounted, scripts execute on initial startup without manual database creation.

**1. Create the network**

```bash
docker network create app-net
```

**2. Connect MySQL to the network**

```bash
docker network connect app-net <mysqlContainerName>
```

**3. Build the backend image**

Create a Dockerfile in the backend project directory containing the Maven-packaged jar (such as `target/*.jar`), then build the image. Example Dockerfile with the jar under `target/`:

```dockerfile
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

If the jar and Dockerfile share a directory, use `COPY *.jar app.jar` instead. Run from the Dockerfile directory:

```bash
docker build -t <backendImageName> .
```

**4. Start the backend**

```bash
docker run -d --name <backendContainerName> --network app-net -p 8080:8080 <backendImageName>
```

Application data source: `jdbc:mysql://<mysqlContainerName>:3306/<databaseName>?useSSL=false&serverTimezone=Asia/Shanghai`. For multiple projects, change the container names, host ports, and database names.

**5. Connect Nginx to the network if needed**

```bash
docker network connect app-net nginx
```

#### 4. Verification and Maintenance

Visit `http://<hostIP>` for the frontend; `/api/xxx` forwards to the backend. For 404/502 responses, check whether the backend is running (`docker ps`), whether `proxy_pass` matches the backend container or service name, and whether the firewall allows ports 80/8080.

| Operation | Description |
| --------------- | ---------------------------------------------------------------------------------------------- |
| Change Nginx configuration | After editing, run `docker exec <nginxContainerName> nginx -s reload` |
| Update the frontend | Replace files in the mounted directory (such as `/srv/my-app/nginx/html/`) |
| Rebuild the backend | Run `docker build -t <backendImageName> .`, then `docker run` with the same network, container name, ports, and data-source database name |

***

### 9.2 Deploying with Compose

The result matches the step-by-step deployment: Nginx serves the frontend and forwards `/api` to the backend, which connects to MySQL. **Create a project directory** under `/srv` containing `docker-compose.yml` and subdirectories such as `nginx/`, `mysql/`, and `backend/`. One `docker-compose.yml` defines the network, MySQL, backend (including its build), and Nginx; one command builds the backend image and starts every service. Multiple projects use independent directories and Compose configurations. If direct host access to MySQL is required, the second project can map `3307:3306` to avoid conflicts.

#### 1. Prepare Directories and Files

Create a project directory under `/srv` (for example, `/srv/my-app`), then service subdirectories containing the frontend, Nginx configuration, backend (Dockerfile and jar), and MySQL initialization scripts:

```bash
# Create a project directory under /srv, then service subdirectories (replace my-app with the actual project name)
sudo mkdir -p /srv/my-app/nginx/html /srv/my-app/nginx/conf.d /srv/my-app/mysql/data /srv/my-app/mysql/conf /srv/my-app/mysql/init /srv/my-app/backend
```

- **Frontend:** Copy the **contents** of the build output (such as dist) into the project's `nginx/html/` directory (such as `/srv/my-app/nginx/html/`).
- **Nginx:** Add the same server block as in the step-by-step deployment to `nginx/conf.d/default.conf`; set `proxy_pass` to the backend service name and port (such as `http://backend:8080`).
- **Backend:** Place the Maven-packaged jar (such as `target/*.jar`, or copied as `app.jar`) under the project's `backend/` directory, then create a file named `Dockerfile` there. Compose builds the backend image from it. The image is based on JDK 17 and only needs to copy and run the jar. If the jar is under `target/`, use this Dockerfile:

```dockerfile
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

If the jar and Dockerfile share a directory (no `target/`), replace `COPY target/*.jar app.jar` with `COPY *.jar app.jar`.
- **MySQL initialization:** Place prepared SQL scripts (database/table creation and initial data) under the project's `mysql/init/`. Compose mounts this directory to `/docker-entrypoint-initdb.d/` for automatic execution on initial startup.

#### 2. docker-compose.yml

Create `docker-compose.yml` in the **project directory** (`/srv/<projectName>/`, such as `/srv/my-app`) and replace placeholders such as `<databaseName>` and `<mysqlRootPassword>`. Mounts use **relative paths** (`./nginx/...`, `./mysql/...`) so the entire project can be moved or copied easily. The backend uses `build: ./backend` to build from its Dockerfile; `image` names the resulting image for reuse.

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/html:/usr/share/nginx/html:ro
    depends_on:
      - backend
    networks:
      - app-net
    restart: unless-stopped

  backend:
    build: ./backend
    image: app-backend:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/<databaseName>?useSSL=false&serverTimezone=Asia/Shanghai
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=<mysqlRootPassword>
    depends_on:
      - mysql
    networks:
      - app-net
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"   # A second project can use "3307:3306", etc.
    environment:
      - MYSQL_ROOT_PASSWORD=<mysqlRootPassword>
      - MYSQL_DATABASE=<databaseName>
    volumes:
      - ./mysql/data:/var/lib/mysql
      - ./mysql/conf:/etc/mysql/conf.d
      - ./mysql/init:/docker-entrypoint-initdb.d:ro
    networks:
      - app-net
    restart: unless-stopped

networks:
  app-net:
    driver: bridge
```

The backend service name in Compose (such as `backend`) must match the hostname in Nginx's `proxy_pass`. Supply data-source settings through environment variables, as this Compose file does, or hardcode them in the application's configuration/image.

#### 3. Start and Verify

Run the following from the **project directory** (`/srv/<projectName>/`, such as `/srv/my-app`). `--build` builds the backend image before starting:

```bash
cd /srv/my-app
docker compose up -d --build
```

Visit `http://<hostIP>` for the frontend; `/api/xxx` forwards to the backend. For 404/502 responses, check `docker compose ps`, the correspondence between `proxy_pass` and the backend service name, and firewall ports 80/8080.

#### 4. Routine Compose Maintenance

All paths below are relative to the project directory (`/srv/<projectName>/`, such as `/srv/my-app`).

| Operation | Description |
| --------------- | --------------------------------------------------------------------------------------------- |
| Change Nginx configuration | Edit `nginx/conf.d/default.conf` in the project, then run `docker compose exec nginx nginx -s reload` |
| Update the frontend | Replace files under the project's `nginx/html/` |
| Rebuild the backend | After updating the jar or Dockerfile, run `docker compose up -d --build backend` |
| Stop all services | `docker compose down` preserves volumes; `docker compose down -v` deletes volumes created by Compose |

***

## X. Practical Deployment: Microservices with Docker Compose

**Use case:** A project contains several Spring Boot microservices (a gateway and business services) and depends on Nacos, MySQL, Redis, or other middleware. One `docker-compose.yml` starts the entire environment on one machine for local integration or test deployment.

**Typical components:**

| Role | Description | Example Compose service name |
| ------------ | ------------------------------------------ | ---------------------- |
| **Registry** | Nacos (service registration/discovery and configuration) | `nacos` |
| **Gateway** | Spring Cloud Gateway as the unified entry point | `gateway` |
| **Business services** | Multiple independent Spring Boot applications | `xxx-service`, `yyy-service` |
| **MySQL** | Shared or separate databases according to project requirements | `mysql` |
| **Redis** | Caching, sessions, etc. (optional) | `redis` |

Within the same Compose network, containers communicate using **service names**: Nacos at `nacos:8848`, MySQL at `mysql:3306`, and Redis at `redis:6379`. Use these hostnames in business-service configuration.

***

### 10.1 Directory and Image Conventions

Create a project directory under `/srv` (such as `/srv/my-microservice`), then service subdirectories. Each microservice requiring a build gets a directory containing its jar and Dockerfile; place `docker-compose.yml` in the project root.

**Example directory layout** (replace placeholder service names with actual module names):

```text
/srv/<projectName>/
├── docker-compose.yml
├── mysql/
│   ├── data/                    # Persistent data; Compose can mount a named volume or ./mysql/data
│   └── init/                    # Optional initialization SQL
├── nacos/                        # Optional Nacos configuration/log mounts
├── gateway/                     # Gateway module
│   ├── Dockerfile
│   └── target/*.jar or app.jar
├── xxx-service/                 # Business service A
│   ├── Dockerfile
│   └── target/*.jar or app.jar
└── yyy-service/                 # Business service B
    ├── Dockerfile
    └── target/*.jar or app.jar
```

**Dockerfile for each microservice** (generic Spring Boot, JDK 17): Use `COPY target/*.jar app.jar` when the jar is under `target/`, or `COPY *.jar app.jar` when it shares the Dockerfile directory.

```dockerfile
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

***

### 10.2 Example docker-compose.yml

The YAML below defines Nacos, MySQL, Redis, Gateway, and two business services. Gateway and the business services receive Nacos, data-source, and Redis settings through environment variables. Replace placeholders such as `<projectName>`, `<mysqlRootPassword>`, and `<databaseName>` with actual values.

**Startup order:** Start MySQL, Redis, and Nacos first. After Nacos is ready (using a `healthcheck` or `depends_on` plus retries), start Gateway and the business services to avoid connection failures during application startup.

```yaml
services:
  nacos:
    image: nacos/nacos-server:v2.5.2
    container_name: nacos
    ports:
      - "8848:8848"
      - "9848:9848"
    environment:
      - MODE=standalone
      - JVM_XMS=256m
      - JVM_XMX=256m
      - NACOS_AUTH_ENABLE=true
      - NACOS_AUTH_TOKEN=<base64EncodedRandomKeyOfAtLeast32Bytes>
      - NACOS_AUTH_IDENTITY_KEY=serverIdentity
      - NACOS_AUTH_IDENTITY_VALUE=security
      - SPRING_DATASOURCE_PLATFORM=mysql
      - MYSQL_SERVICE_HOST=mysql
      - MYSQL_SERVICE_DB_NAME=nacos
      - MYSQL_SERVICE_USER=root
      - MYSQL_SERVICE_PASSWORD=<mysqlRootPassword>
    volumes:
      - nacos-logs:/home/nacos/logs
      - nacos-data:/home/nacos/data
    networks:
      - ms-net
    depends_on:
      mysql:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8848/nacos/v1/console/health/readiness"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s

  mysql:
    image: mysql:8.0
    container_name: mysql
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=<mysqlRootPassword>
      - MYSQL_DATABASE=<databaseName>
      - TZ=Asia/Shanghai
    volumes:
      - mysql-data:/var/lib/mysql
      - ./mysql/init:/docker-entrypoint-initdb.d:ro
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    networks:
      - ms-net
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    networks:
      - ms-net
    restart: unless-stopped

  gateway:
    build: ./gateway
    image: <projectName>-gateway:latest
    container_name: gateway
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_CLOUD_NACOS_DISCOVERY_SERVER_ADDR=nacos:8848
      - SPRING_CLOUD_NACOS_CONFIG_SERVER_ADDR=nacos:8848
      - SPRING_CLOUD_NACOS_DISCOVERY_USERNAME=<nacosUsername>
      - SPRING_CLOUD_NACOS_DISCOVERY_PASSWORD=<nacosPassword>
      - SPRING_CLOUD_NACOS_CONFIG_USERNAME=<nacosUsername>
      - SPRING_CLOUD_NACOS_CONFIG_PASSWORD=<nacosPassword>
    depends_on:
      nacos:
        condition: service_healthy
    networks:
      - ms-net
    restart: unless-stopped

  xxx-service:
    build: ./xxx-service
    image: <projectName>-xxx-service:latest
    container_name: xxx-service
    ports:
      - "8081:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_CLOUD_NACOS_DISCOVERY_SERVER_ADDR=nacos:8848
      - SPRING_CLOUD_NACOS_CONFIG_SERVER_ADDR=nacos:8848
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/<databaseName>?useSSL=false&serverTimezone=Asia/Shanghai
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=<mysqlRootPassword>
      - SPRING_DATA_REDIS_HOST=redis
      - SPRING_CLOUD_NACOS_DISCOVERY_USERNAME=<nacosUsername>
      - SPRING_CLOUD_NACOS_DISCOVERY_PASSWORD=<nacosPassword>
      - SPRING_CLOUD_NACOS_CONFIG_USERNAME=<nacosUsername>
      - SPRING_CLOUD_NACOS_CONFIG_PASSWORD=<nacosPassword>
    depends_on:
      nacos:
        condition: service_healthy
      mysql:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - ms-net
    restart: unless-stopped

  yyy-service:
    build: ./yyy-service
    image: <projectName>-yyy-service:latest
    container_name: yyy-service
    ports:
      - "8082:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_CLOUD_NACOS_DISCOVERY_SERVER_ADDR=nacos:8848
      - SPRING_CLOUD_NACOS_CONFIG_SERVER_ADDR=nacos:8848
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/<databaseName>?useSSL=false&serverTimezone=Asia/Shanghai
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=<mysqlRootPassword>
      - SPRING_DATA_REDIS_HOST=redis
      - SPRING_CLOUD_NACOS_DISCOVERY_USERNAME=<nacosUsername>
      - SPRING_CLOUD_NACOS_DISCOVERY_PASSWORD=<nacosPassword>
      - SPRING_CLOUD_NACOS_CONFIG_USERNAME=<nacosUsername>
      - SPRING_CLOUD_NACOS_CONFIG_PASSWORD=<nacosPassword>
    depends_on:
      nacos:
        condition: service_healthy
      mysql:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - ms-net
    restart: unless-stopped

networks:
  ms-net:
    driver: bridge

volumes:
  mysql-data:
  redis-data:
  nacos-logs:
  nacos-data:
```

**Notes:**

- When Nacos stores configuration in MySQL, create its database and execute the official Nacos `schema.sql` beforehand (usually by placing `nacos-mysql.sql` under `mysql/init/`), or Nacos fails to start. For in-memory configuration only, remove Nacos's `SPRING_DATASOURCE_*`, `MYSQL_SERVICE_*`, and its `depends_on` dependency on `mysql`.
- For services using Nacos configuration, set `spring.cloud.nacos.config.server-addr` to `nacos:8848` in `bootstrap.yml` or `application.yml`. To override it through the environment, use `SPRING_CLOUD_NACOS_CONFIG_SERVER_ADDR` (the same name applies in Spring Boot 2).
- With authentication enabled in Nacos 2.5.2, explicitly configure `NACOS_AUTH_TOKEN` on the server (the Base64 encoding of a random key at least 32 bytes long). `NACOS_AUTH_IDENTITY_KEY/VALUE` identifies Nacos servers to one another; these are not Java client login credentials.
- Each Java service configures its Nacos username/password separately through `spring.cloud.nacos.discovery.username/password` and `spring.cloud.nacos.config.username/password`, supplied here through the corresponding `SPRING_CLOUD_NACOS_*_USERNAME` / `*_PASSWORD` environment variables. Initialize the user in Nacos and grant the required permissions first. Clients do not configure the server identity key.

***

### 10.3 Application Configuration Essentials

Microservices access one another by service name within the Compose network; do not use `localhost` in their configuration.

| Setting | Common local development value | Compose deployment value |
| -------------------------- | ---------------- | -------------------- |
| Nacos address | `localhost:8848` | `nacos:8848` |
| MySQL address | `localhost:3306` | `mysql:3306` |
| Redis address | `localhost:6379` | `redis:6379` |
| Other business services (Feign/calls) | `localhost:808x` | Use the **service name**, such as `http://xxx-service` |

**Approach 1:** Hardcode these hostnames in `application-prod.yml` or `bootstrap-prod.yml`; they take effect when the `prod` profile is active. Compose already sets `SPRING_PROFILES_ACTIVE=prod`.

**Approach 2:** Override all settings with environment variables (such as `SPRING_DATASOURCE_URL` and `SPRING_CLOUD_NACOS_DISCOVERY_SERVER_ADDR`) to reuse the same image across environments.

***

### 10.4 Deployment Steps

Run from the project root (the directory containing `docker-compose.yml`):

```bash
# 1. Enter the project directory (replace <projectName> with the actual path)
cd /srv/<projectName>

# 2. Build and start all services (add --build on first deployment or after code/image changes)
docker compose up -d --build

# 3. View service status
docker compose ps

# 4. View logs (optionally by service name)
docker compose logs -f
docker compose logs -f gateway
docker compose logs -f xxx-service

# 5. Verify in the Nacos console
# Open http://<hostIP>:8848/nacos in a browser and confirm service registration

# 6. Verify business endpoints through the gateway
curl http://localhost:8080/<gatewayRoutePrefix>/xxx/...
```

**Rebuild only one service** (for example, if only xxx-service changed):

```bash
docker compose up -d --build xxx-service
```

**Stop and remove containers and networks** (preserve volumes):

```bash
docker compose down
```

**Stop and remove containers, networks, and volumes** (clear MySQL/Redis/Nacos data):

```bash
docker compose down -v
```

***

### 10.5 Common Issues

| Symptom | Possible cause and solution |
| ------------------------ | ---------------------------------------------------- |
| Business service reports a Nacos connection failure at startup | Nacos is not ready; configure its `healthcheck` and set the business service's `depends_on: nacos: condition: service_healthy` |
| Business service reports a database connection failure | MySQL is not ready or the database is missing; configure its `healthcheck` and provide database/table creation SQL under `mysql/init/` |
| Cannot open the Nacos console | Firewall blocks 8848/9848, or Nacos failed to start; inspect `docker compose logs nacos` |
| Inter-service calls time out | Check that calls use service names (such as `http://xxx-service/...`) instead of `localhost`, and that services share `ms-net` |
| Image does not run on Mac Apple Silicon | For images such as Nacos, try adding `platform: linux/amd64` |

***

## XI. Common Command Reference

Quick reference for commands and common options; see `docker command --help` or `docker subcommand --help` for detailed syntax.

### 11.1 Image Commands

| Command | Description |
| ------------------------------ | -------------- |
| `docker images` | List local images |
| `docker pull imageName:tag` | Pull an image |
| `docker rmi imageName` | Delete an image |
| `docker history image` | View image layers |
| `docker build -t name .` | Build an image |
| `docker save -o file.tar image` | Export an image |
| `docker load -i file.tar` | Import an image |
| `docker image prune` | Remove unused images |

### 11.2 Container Commands

| Command | Description |
| -------------------------------- | ---------------- |
| `docker run -d image` | Run a container in the background |
| `docker ps` | List running containers |
| `docker ps -a` | List all containers |
| `docker start/stop/restart container` | Start/stop/restart |
| `docker rm container` | Delete a container |
| `docker logs -f container` | View container logs |
| `docker exec -it container bash` | Enter a container |
| `docker cp source destination` | Copy files |
| `docker inspect container` | Inspect container details |

### 11.3 Common Options

Applicable to `docker run` and docker-compose service configuration:

| Option | Description |
| ------------------------ | ------------------------------------------------------ |
| `-d` | Run in the background |
| `-p hostPort:containerPort` | Port mapping |
| `-v hostPath:containerPath` | Volume mount |
| `-e variable=value` | Set an environment variable |
| `--name name` | Specify a container name |
| `--network networkName` | Specify a network |
| `--restart policy` | Automatic restart |
| `--add-host hostname:IP` | Add hostname resolution (such as host.docker.internal:host-gateway) |
| `-it` | Interactive terminal |

### 11.4 Docker Compose Commands

V2 plugin: `docker compose` (space); standalone: `docker-compose` (hyphen).

| Command | Description |
| ------------------------------- | ------------ |
| `docker compose up -d` | Start all services |
| `docker compose down` | Stop and remove |
| `docker compose ps` | View service status |
| `docker compose logs -f` | View logs |
| `docker compose exec service bash` | Enter a service container |
| `docker compose restart` | Restart services |
| `docker compose build` | Build services |

### 11.5 Cleanup Commands

```bash
# Remove all unused resources (images, containers, networks, volumes)
docker system prune -a --volumes

# View Docker disk usage
docker system df
```
