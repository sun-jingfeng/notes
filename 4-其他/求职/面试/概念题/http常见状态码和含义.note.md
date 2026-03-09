# 常见 HTTP 状态码与含义

## 1xx 信息性

- **100 Continue**：客户端可继续发送请求的剩余部分（一般在大文件/分块传输时用）。
- **101 Switching Protocols**：切换协议，比如从 HTTP/1.1 升级到 WebSocket。

## 2xx 成功

- **200 OK**：请求成功，常见于 GET/POST 等正常响应。
- **201 Created**：已成功创建资源，常用于 POST 新增数据。
- **202 Accepted**：已接收请求，但尚未完成处理（异步任务）。
- **204 No Content**：请求成功，但响应体为空（常用于 DELETE / PUT 无返回内容）。
- **206 Partial Content**（个人补充）：成功状态响应代码表示请求已成功，并且主体包含所请求的数据区间，该数据区间是在请求的 `Range` 首部指定的。

## 3xx 重定向

- **301 Moved Permanently**：永久重定向，资源已被永久移动到新地址。
- **302 Found**：临时重定向，暂时访问另一个地址。
- **303 See Other**：重定向到另一个 URI，通常用在 POST 之后的跳转。
- **304 Not Modified**：资源未修改，客户端可使用本地缓存（配合缓存/ETag 使用）。

## 4xx 客户端错误

- **400 Bad Request**：请求有语法错误或参数错误，服务器无法理解。
- **401 Unauthorized**：未认证或认证失败，需要登录/携带正确的凭证（token 等）。
- **403 Forbidden**：已认证但没有权限访问该资源。
- **404 Not Found**：请求的资源不存在或已被删除。
- **405 Method Not Allowed**：请求方法不被允许，如只支持 GET 却发了 POST。
- **408 Request Timeout**：客户端请求超时。
- **409 Conflict**：请求与服务器当前资源状态冲突（如版本冲突、重复提交）。
- **413 Payload Too Large**：请求体过大，服务器拒绝处理。
- **415 Unsupported Media Type**：请求的媒体类型不被支持（如 Content-Type 错误）。
- **429 Too Many Requests**：请求过于频繁，被限流。

## 5xx 服务器错误

- **500 Internal Server Error**：服务器内部错误，未被捕获的异常等。
- **502 Bad Gateway**：网关或代理从上游服务器收到无效响应（上游挂了/异常）。
- **503 Service Unavailable**：服务器当前无法处理请求（超载、维护中）。
- **504 Gateway Timeout**：网关/代理等待上游服务器响应超时。
