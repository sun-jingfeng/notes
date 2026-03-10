# Cookie / Session / Token（JWT）

## 一、三者对比

| 方案 | 存储位置 | 特点 |
| --- | --- | --- |
| **Cookie** | 浏览器，按域存储 | 请求自动携带、约 4KB、可设 HttpOnly/Secure/SameSite |
| **Session** | 服务端存会话数据，浏览器只存 Session ID（常放 Cookie） | 有状态，集群需共享（Redis 等）；ID 泄露等同于会话泄露 |
| **JWT（Token）** | 客户端（Cookie 或 localStorage 等） | 无状态，服务端不存；自包含用户与过期信息；需防泄露与篡改 |

***

## 二、JWT 结构

**Header.Payload.Signature**（Base64URL 编码，用 `.` 连接）

- **Header**：算法（如 HS256、RS256）和类型（JWT）。
- **Payload**：声明（用户 ID、角色、过期时间等）；仅编码非加密，敏感信息不宜放。
- **Signature**：用密钥对前两段签名，用于校验未被篡改、且来源可信。

***

## 三、JWT 的缺点与注意

- **无法主动失效**：在过期前无法“作废”，除非维护黑名单或短过期+刷新 token。
- **体积大**：比 Session ID 大，每次请求都带。
- **Payload 可解码**：不要放密码、敏感信息；需要可放用户 ID、角色、过期时间等。

***

## 四、面试答题要点

- **Cookie**：浏览器存、自动带、有大小与安全属性（HttpOnly 等）。
- **Session**：服务端存数据，浏览器存 ID；有状态，集群需共享。
- **JWT**：无状态、自包含、Header.Payload.Signature；缺点是不能主动失效、体积大、Payload 仅编码不加密。
