# Dockerfile 优化

## 一、常见优化

| 手段 | 说明 |
| --- | --- |
| **多阶段构建** | 第一阶段编译/构建，第二阶段只拷贝产物运行，最终镜像不含编译工具，体积小 |
| **利用缓存** | 把变化少的指令放前面（如先 COPY 依赖文件再 COPY 源码），提高缓存命中 |
| **.dockerignore** | 排除无关文件，减少上下文、加速构建、避免把敏感文件打进镜像 |
| **基础镜像** | 选用 alpine、slim 等小体积基础镜像，减少最终体积与攻击面 |

***

## 二、示例思路

```dockerfile
# 阶段一：构建
FROM node:18 AS builder
COPY package*.json ./
RUN npm ci
COPY src ./src
RUN npm run build

# 阶段二：运行
FROM node:18-alpine
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
```

***

## 三、面试答题要点

- **多阶段**：构建与运行分离，最终镜像只含运行所需。
- **缓存**：不变指令前置；**.dockerignore** 减少上下文；**小基础镜像** 减小体积。
