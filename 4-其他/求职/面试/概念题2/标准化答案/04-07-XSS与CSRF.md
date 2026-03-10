# XSS 与 CSRF

## 一、XSS（跨站脚本）

**原理**：攻击者把**恶意脚本**注入页面，在受害者浏览器中执行，从而窃取 Cookie、篡改页面、以用户身份发请求等。

| 类型 | 说明 |
| --- | --- |
| **存储型** | 恶意内容存进数据库（如评论），每次展示时执行 |
| **反射型** | 恶意内容在 URL 参数里，服务端直接拼进页面返回 |
| **DOM 型** | 前端脚本把 URL 或其它输入写进 DOM 导致执行，不经过服务端 |

**防御**：

- **输出编码/转义**：根据上下文（HTML、属性、JS、URL）做转义，避免把用户输入当代码执行。
- **CSP（Content-Security-Policy）**：限制脚本来源、禁止内联等，减少 XSS 影响。
- **HttpOnly Cookie**：敏感 Cookie 设 HttpOnly，脚本无法读取，减轻被盗风险。
- **框架**：React 等默认对插值转义，但 `dangerouslySetInnerHTML`、`href="javascript:..."` 等需谨慎。

***

## 二、CSRF（跨站请求伪造）

**原理**：攻击者在第三方页诱导用户发起请求，浏览器会**自动带上目标站的 Cookie**，若用户已登录，请求就相当于“用户本人操作”，从而以用户身份执行修改、转账等。

**防御**：

- **CSRF Token**：服务端在会话或页面中下发随机 Token，表单或请求必须带上且服务端校验，第三方页拿不到该 Token。
- **SameSite Cookie**：设 `SameSite=Strict` 或 `Lax`，跨站请求不携带 Cookie，减轻 CSRF。
- **Referer/Origin 校验**：服务端检查请求来源是否为自己站，作辅助手段。

***

## 三、面试答题要点

- **XSS**：注入恶意脚本；防御有转义、CSP、HttpOnly、慎用危险 API。
- **CSRF**：利用已登录 Cookie 伪造请求；防御有 CSRF Token、SameSite、Referer/Origin 校验。
