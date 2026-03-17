# NPM、本地模块、全局模块、开发属于自己的包

## 一、这篇的主线

这一篇真正的主线是 Node 生态里的包生命周期：

```text
安装依赖 -> 管理依赖 -> 使用依赖 -> 配置项目 -> 发布自己的包
```

如果把这条线理清，npm、本地包、全局包、package.json、发包这些知识点就能连起来。

---

## 二、什么是 npm

npm 是 Node.js 生态中的包管理工具，用来安装、管理、发布 JavaScript 包。

这里的包可以近似理解为“可复用的模块集合”，但包通常比单个模块更完整，往往带有：

1. 代码文件。
2. 版本信息。
3. 依赖声明。
4. 使用说明。

### 2.1 什么是第三方包

除了 Node 内置模块和我们自己写的自定义模块外，从 npm 仓库下载安装的模块通常都叫第三方包。

例如：

1. `axios`
2. `lodash`
3. `dayjs`
4. `express`

这些包的本质，都是别人已经封装好的能力。

---

## 三、npm 的核心作用

| 能力     | 说明                             |
| -------- | -------------------------------- |
| 安装包   | 下载项目依赖                     |
| 卸载包   | 删除不再需要的依赖               |
| 管理版本 | 控制依赖升级范围                 |
| 执行脚本 | 运行 `package.json` 中的脚本命令 |
| 发布包   | 把自己的包发到 npm 仓库          |

### 3.1 为什么前端也必须懂 npm

因为现代前端项目不只是写业务代码，还要管理构建工具、脚手架、校验工具和运行依赖，而这些大多都通过 npm 进入项目。

---

## 四、本地包和全局包

### 4.1 本地包

本地包安装在当前项目里，只能在当前项目及其子目录中使用。

```bash
npm init -y
npm install axios
npm install eslint -D
```

通常会带来这些变化：

1. 生成或更新 `node_modules`。
2. 更新 `package.json` 里的依赖声明。
3. 更新 `package-lock.json`。

### 4.2 全局包

全局包安装到系统级目录，主要用于提供命令行工具，而不是给当前业务代码 `require()` 使用。

```bash
npm install nodemon -g
npm uninstall nodemon -g
```

### 4.3 怎么选

| 类型   | 更适合                               |
| ------ | ------------------------------------ |
| 本地包 | 当前项目依赖、构建工具、业务运行依赖 |
| 全局包 | 命令行工具                           |

一个常见原则：开发时优先装本地依赖，只有命令行工具才优先考虑全局安装。

---

## 五、`dependencies` 和 `devDependencies`

| 字段              | 含义         | 常见示例                    |
| ----------------- | ------------ | --------------------------- |
| `dependencies`    | 运行时依赖   | `axios`、`express`          |
| `devDependencies` | 开发阶段依赖 | `eslint`、`webpack`、`vite` |

简单理解：

1. 项目运行必须要有的，放 `dependencies`。
2. 只在开发、构建、校验时需要的，放 `devDependencies`。

### 5.1 一个实际判断

如果把某个依赖删掉后，线上运行直接报错，那它大概率是运行时依赖；如果只是开发工具失效，那它通常更像开发依赖。

---

## 六、`package.json` 是什么

`package.json` 是项目的核心描述文件，记录了项目名称、版本、依赖、脚本等信息。

```json
{
  "name": "demo-project",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "node index.js"
  },
  "dependencies": {
    "axios": "^1.7.0"
  }
}
```

### 6.1 常见字段

| 字段              | 作用              |
| ----------------- | ----------------- |
| `name`            | 包或项目名        |
| `version`         | 当前版本          |
| `main`            | CommonJS 入口文件 |
| `scripts`         | 脚本命令          |
| `dependencies`    | 生产依赖          |
| `devDependencies` | 开发依赖          |
| `bin`             | 命令行入口        |

### 6.2 哪些字段最该先理解

初学阶段优先搞清：`name`、`version`、`scripts`、`dependencies`、`devDependencies`、`main`。

---

## 七、版本号规则和脚本

### 7.1 SemVer 版本号

```text
major.minor.patch
```

| 部分    | 含义               |
| ------- | ------------------ |
| `major` | 不兼容的大改动     |
| `minor` | 向下兼容的新功能   |
| `patch` | 向下兼容的问题修复 |

### 7.2 `^` 和 `~`

| 写法     | 含义                                 |
| -------- | ------------------------------------ |
| `1.2.3`  | 固定安装指定版本                     |
| `~1.2.3` | 允许升级补丁版本，不跨次版本         |
| `^1.2.3` | 允许升级次版本和补丁版本，不跨主版本 |

### 7.3 `scripts`

```json
{
  "scripts": {
    "dev": "node index.js",
    "build": "webpack --mode production",
    "lint": "eslint src"
  }
}
```

执行方式：

```bash
npm run dev
npm run build
npm run lint
```

如果脚本名是 `start`、`test` 等，还可以简写。

### 7.4 一个实战提醒

脚本的价值不只是偷懒，而是统一团队执行入口，避免每个人手敲一套不一致命令。

---

## 八、模块加载和使用第三方包

安装后，通常通过 `require` 或 `import` 使用。

```js
const dayjs = require("dayjs")
```

```js
import axios from "axios"
```

### 8.1 `require` 的查找逻辑

1. 加载自定义模块时必须写路径。
2. 加载内置模块时直接写模块名。
3. 加载第三方包时会优先在当前目录的 `node_modules` 查找，找不到再逐级向上找。

### 8.2 模块缓存

同一个模块第一次加载后会进入缓存，后续重复 `require` 通常不会再次完整执行。

这也是为什么模块里保存的状态可能会被多处共享。

---

## 九、镜像源和 `nrm`

npm 默认使用官方仓库。

如果网络较慢，可以使用镜像源，但要注意地址是否仍然有效。当前更常见的是：

```bash
npm config set registry https://registry.npmmirror.com
```

恢复官方源：

```bash
npm config set registry https://registry.npmjs.org
```

`nrm` 是一个切换 npm registry 的工具，本质上只是帮助你更方便地切换镜像源。

### 9.1 一个现实建议

业务项目里尽量避免无意义地频繁切换镜像源，重点是知道当前源是什么、会不会影响安装和发布。

---

## 十、开发自己的包

### 10.1 一个规范包的最小结构

```text
my-package/
  package.json
  index.js
  README.md
```

### 10.2 `package.json` 至少关注这些字段

```json
{
  "name": "my-package-demo",
  "version": "1.0.0",
  "main": "index.js"
}
```

### 10.3 编写入口文件

```js
function add(a, b) {
  return a + b
}

function formatName(name) {
  return "hello, " + name
}

module.exports = {
  add,
  formatName,
}
```

### 10.4 README 的作用

README 是包的说明书，至少应包含：

1. 包是做什么的。
2. 如何安装。
3. 如何使用。
4. 注意事项。

---

## 十一、发布包到 npm

### 11.1 前置准备

1. 注册 npm 账号。
2. 验证邮箱。
3. 切回可发布的源，一般是官方源。

### 11.2 登录和发布

```bash
npm login
npm publish
```

执行命令时要在包的根目录。

### 11.3 发布前检查清单

1. 包名是否冲突。
2. `package.json` 是否正确。
3. `README` 是否清晰。
4. 是否把不该发布的内容排除掉，例如测试文件、大体积资源。
5. 版本号是否已经递增。

### 11.4 `unpublish` 和 `deprecate`

现代实践里更常见的是修复并发布新版本，或者使用 `npm deprecate` 标记旧版本不再推荐；`unpublish` 限制较多，也更敏感。

---

## 十二、小结

1. npm 是 Node.js 生态的包管理工具，核心任务是安装、管理、执行和发布依赖。
2. 本地包服务于当前项目，全局包主要服务于命令行工具，这两个概念一定要分清。
3. `package.json`、版本号规则、脚本和依赖声明，是 npm 使用的核心基础。
4. 开发自己的包时，要同时关注入口文件、说明文档、发布策略和版本管理。
5. 学会 npm 的关键不是背命令，而是理解“依赖从哪来、怎么管、怎么用、怎么发布”。
