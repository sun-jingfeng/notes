# Maven 高级

> **本章内容**：分模块设计与开发、继承与聚合、私服
>
> **核心目标**：掌握 Maven 多模块项目的设计与构建，理解依赖版本统一管理机制，学会使用私服进行团队协作

---

## 一、分模块设计与开发

### 1.1 什么是分模块

分模块是将大型项目按照特定规则拆分成多个相对独立的子项目（模块）的工程实践。每个模块都是一个独立的 Maven 工程，拥有自己的 `pom.xml`、源代码和资源文件。模块之间通过 Maven 依赖机制组合，最终构成完整的应用系统。

在 Maven 中，每个模块可以独立编译、测试、打包，也可以被其他模块依赖。模块间通过 GAV 坐标（GroupId、ArtifactId、Version）相互引用。

### 1.2 为什么要分模块

随着业务增长，项目代码量越来越大。所有代码放在一个工程中会带来以下问题：

| 问题             | 具体表现                                     | 分模块后的改善                     |
| ---------------- | -------------------------------------------- | ---------------------------------- |
| **代码耦合度高** | 各层边界模糊，Controller 可能直接调用 Mapper | 模块物理隔离，编译时检查依赖合法性 |
| **团队协作困难** | 多人修改同一工程，代码冲突频繁               | 不同团队负责不同模块，减少冲突     |
| **代码复用性差** | 工具类散落各处，修改需多处同步               | 公共模块独立维护，多项目共享       |
| **编译部署慢**   | 改一行代码要编译整个项目                     | 增量编译，只编译修改的模块         |

### 1.3 分模块的常见方式

根据项目规模和复杂度，分模块有三种常见方式：

#### 1.3.1 按层拆分（推荐中小项目）

按 MVC 分层架构拆分，结构清晰，符合开发习惯：

```
myapp-parent/
├── myapp-common/       # 实体类（Entity、DTO、VO）
├── myapp-utils/      # 工具类
├── myapp-dao/     # 数据访问层（Mapper 接口、XML）
├── myapp-service/    # 业务逻辑层
└── myapp-web/        # Web 层（Controller、启动类）
```

#### 1.3.2 按功能拆分（适合大型项目/微服务）

按业务功能拆分，每个模块高度内聚：

```
project-parent/
├── project-common/   # 公共模块
├── project-user/     # 用户模块
├── project-order/    # 订单模块
└── project-payment/  # 支付模块
```

#### 1.3.3 混合拆分（适合大型单体）

先按功能划分，再按层细分：

```
project-parent/
├── project-common/
│   ├── common-pojo/
│   └── common-utils/
├── project-user/
│   ├── user-mapper/
│   ├── user-service/
│   └── user-web/
└── ...
```

### 1.4 模块间依赖关系

**核心原则：上层依赖下层，下层不能依赖上层**（单向依赖，避免循环）

```
┌─────────────┐
│  myapp-web  │  ← Controller、启动类
└──────┬──────┘
       ↓
┌──────────────┐
│myapp-service │  ← Service 接口和实现
└──────┬───────┘
       ↓
┌──────────────┐
│ myapp-dao │  ← Mapper 接口
└──────┬───────┘
       ↓
┌─────────────┐
│ myapp-common  │  ← 实体类
└─────────────┘
```

### 1.5 依赖的传递性

Maven 依赖具有传递性：A 依赖 B，B 依赖 C，则 A 自动拥有 C。

这意味着 `web` 模块虽然只声明依赖 `service`，但可以直接使用 `pojo` 中的类（通过 service → mapper → pojo 传递获得）。

### 1.6 配置模块依赖

```xml
<!-- myapp-service/pom.xml -->
<dependencies>
    <dependency>
        <groupId>com.example</groupId>
        <artifactId>myapp-dao</artifactId>
        <version>1.0.0</version>
    </dependency>
</dependencies>
```

### 1.7 注意事项

#### 1.7.1 统一包名前缀

建议所有模块使用统一包名前缀（如 `com.example`），便于 Spring Boot 组件扫描。

#### 1.7.2 组件扫描问题

Spring Boot 默认只扫描启动类所在包及子包。若其他模块包名不同，需手动配置：

```java
@SpringBootApplication
@ComponentScan(basePackages = {"com.example", "com.thirdparty"})
@MapperScan("com.example.mapper")
public class MyApplication { ... }
```

#### 1.7.3 依赖冲突处理

多模块引入同一依赖的不同版本时，Maven 使用"就近原则"。推荐在父模块用 `<dependencyManagement>` 统一版本。

也可用 `<exclusions>` 排除冲突依赖：

```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>myapp-service</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

#### 1.7.4 构建顺序

被依赖模块必须先构建。推荐在父模块执行 `mvn clean install`，Maven 自动处理顺序。

---

## 二、继承与聚合

继承用于**统一管理配置**，聚合用于**统一管理构建**。实际项目中通常同时使用。

### 2.1 继承（Inheritance）

#### 2.1.1 概念

子模块通过 `<parent>` 标签继承父模块配置，避免重复配置。父模块通常不含业务代码，专门提供公共配置。

#### 2.1.2 继承的三大作用

1. **统一版本管理**：所有子模块使用相同依赖版本，避免版本冲突
2. **简化配置**：公共配置只在父模块定义一次
3. **便于维护**：升级依赖只需修改父模块一处

#### 2.1.3 可继承的配置项

| 配置项                  | 说明                       |
| ----------------------- | -------------------------- |
| `groupId`、`version`    | 项目坐标                   |
| `properties`            | 自定义属性                 |
| `dependencies`          | 公共依赖（子模块自动继承） |
| `dependencyManagement`  | 依赖版本管理               |
| `pluginManagement`      | 插件版本管理               |
| `build`、`repositories` | 构建和仓库配置             |

> **注意**：`artifactId` 不继承，每个模块必须定义自己的 artifactId。

#### 2.1.4 `<dependencies>` vs `<dependencyManagement>`（核心概念）

这是继承机制的核心，**必须先理解再看后面的配置示例**。

| 对比项     | `<dependencies>`       | `<dependencyManagement>` |
| ---------- | ---------------------- | ------------------------ |
| 作用       | 直接引入依赖           | 只声明版本，不引入       |
| 子模块继承 | **自动继承**，强制拥有 | **不自动继承**，按需声明 |
| 适用场景   | 所有模块必须的依赖     | 部分模块需要的依赖       |

> **版本覆盖规则**：若父子工程都配置了同一个依赖的不同版本，**以子工程的为准**。无论依赖定义在 `<dependencies>` 还是 `<dependencyManagement>` 中，子模块都可以通过显式声明版本来覆盖父模块的版本。

> **最佳实践**：
> - 所有模块都用的依赖（如 Lombok）→ 放 `<dependencies>`
> - 部分模块用的依赖（如 MyBatis）→ 放 `<dependencyManagement>`

#### 2.1.5 三种打包类型

| 类型    | 说明                                             | 适用场景                   |
| ------- | ------------------------------------------------ | -------------------------- |
| **jar** | 普通模块打包，Spring Boot 内嵌 Tomcat 可直接运行 | Spring Boot 应用、工具类库 |
| **war** | Web 程序打包，需部署到外部 Tomcat                | 传统 Java Web 项目         |
| **pom** | 父工程/聚合工程，不含代码，仅做依赖管理          | 多模块父模块               |

> 不指定 `<packaging>` 时默认为 `jar`。**父模块必须设为 `pom`**。

#### 2.1.6 配置父模块

父模块 `pom.xml` 主要包含五部分：

**1. 基本信息**

```xml
<groupId>com.example</groupId>
<artifactId>myapp-parent</artifactId>
<version>1.0.0</version>
<packaging>pom</packaging>  <!-- 必须是 pom -->
```

**2. 属性配置（自定义属性）**

Maven 允许在 `<properties>` 中定义自定义属性，然后在 POM 的其他位置通过 `${属性名}` 引用。

**定义方式**：在 `<properties>` 标签内，标签名就是属性名，标签内容就是属性值。

```xml
<properties>
    <java.version>17</java.version>
    <spring-boot.version>3.2.10</spring-boot.version>
    <mybatis.version>3.0.3</mybatis.version>
    <myapp.version>1.0.0</myapp.version>
</properties>
```

**引用方式**：使用 `${属性名}` 语法引用，Maven 构建时会自动替换为属性值。

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>${mybatis.version}</version>  <!-- 引用属性，实际值为 3.0.3 -->
</dependency>
```

**常见用途**：

| 用途 | 示例属性 | 说明 |
|------|---------|------|
| 统一版本号 | `<spring-boot.version>` | 多处引用同一版本，升级只改一处 |
| JDK 版本 | `<java.version>` | 指定编译的 Java 版本 |
| 编码设置 | `<project.build.sourceEncoding>` | 统一项目编码 |
| 子模块版本 | `<myapp.version>` | 统一管理各子模块版本 |

> **继承特性**：父模块的 `<properties>` 会被子模块继承，因此在父模块统一定义版本号，子模块无需重复配置。

**3. 依赖版本管理** - 声明版本但不引入依赖（见 2.1.4）

```xml
<dependencyManagement>
    <dependencies>
        <!-- 通过 BOM 导入 Spring Boot 版本管理（见 2.1.8） -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${spring-boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        
        <!-- 第三方依赖 -->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>${mybatis.version}</version>
        </dependency>
        
        <!-- 子模块版本 -->
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>myapp-common</artifactId>
            <version>${myapp.version}</version>
        </dependency>
        <!-- ... 其他子模块 ... -->
    </dependencies>
</dependencyManagement>
```

**4. 公共依赖** - 所有子模块自动继承（见 2.1.4）

```xml
<dependencies>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

**5. 插件管理**

```xml
<build>
    <pluginManagement>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring-boot.version}</version>
            </plugin>
        </plugins>
    </pluginManagement>
</build>
```

#### 2.1.7 配置子模块

子模块通过 `<parent>` 标签声明继承关系，其中 `<relativePath>` 用于指定父模块 `pom.xml` 的相对路径。

**`<relativePath>` 的三种写法**：

| 写法                                                 | 含义                         | 适用场景                               |
| ---------------------------------------------------- | ---------------------------- | -------------------------------------- |
| `<relativePath>../pom.xml</relativePath>`            | 从指定路径查找父 POM         | 标准聚合结构（子模块在父模块目录下）   |
| `<relativePath/>` 或 `<relativePath></relativePath>` | 不从本地查找，直接从仓库获取 | 父模块已发布到仓库，或不在同一目录结构 |
| 不写（省略）                                         | 默认值 `../pom.xml`          | 标准聚合结构                           |

> **注意**：如果父模块尚未 `install` 到本地仓库，且 `<relativePath>` 指向的路径不存在或错误，Maven 会报错找不到父 POM。

**子模块坐标的继承**：配置了继承关系后，子模块的 `groupId` 和 `version` 会自动继承父模块，可以省略不写。

```xml
<project>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>myapp-parent</artifactId>
        <version>1.0.0</version>
        <relativePath>../pom.xml</relativePath>  <!-- 父 POM 相对路径 -->
    </parent>
    
    <!-- groupId 继承自父模块，可省略 -->
    <artifactId>myapp-service</artifactId>
    <!-- version 继承自父模块，可省略 -->
    
    <dependencies>
        <!-- 无需指定版本，从父模块 dependencyManagement 继承 -->
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>myapp-dao</artifactId>
        </dependency>
    </dependencies>
</project>
```

**为什么有的 `<version>` 提示"可继承"、有的不提示？**

| 位置 | 是否可省略 | 说明 |
|------|-----------|------|
| `<parent>` 里的 `<version>` | **不可省略** | 声明"继承哪个版本的父项目"，Maven 规定必填 |
| 子项目自己的 `<version>`（与 `<artifactId>` 同级） | 可省略 | 省略时从父项目继承；写了和父项目一样，IDE 会提示"可继承" |
| `<dependencies>` 里某个依赖的 `<version>` | 视情况 | 若父项目 `<dependencyManagement>` 管过该依赖，可不写 |

#### 2.1.8 什么是 BOM（Bill of Materials）

**BOM** 全称 **Bill of Materials**（物料清单），在 Maven 里指的是一份**只负责声明依赖版本、不实际引入依赖**的 POM 文件。

可以把它理解成一份「版本清单」：
- 里面只有一大堆 `<dependencyManagement>`，列着「如果将来有人用 spring-boot-starter-web，请用 3.2.10」等
- 它**不会**把依赖真的加到项目里，只是告诉你「该用哪个版本」
- 你的项目在 `<dependencies>` 里写依赖时，**可以不写版本号**，Maven 会按这份清单里的版本来用

Spring 官方提供的 `spring-boot-dependencies` 就是一个 BOM。引入它，就等于把 Spring Boot 的版本清单导入到当前项目。

#### 2.1.9 Spring Boot 的两种继承方案

**方案一：直接继承**（单模块项目常用）

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.10</version>
</parent>
```

**方案二：BOM 导入**（自定义父模块时用，Maven 只支持单继承）

你的项目已有自定义父模块（如 `myapp-parent`），Maven 只能继承一个父 POM。这时用 BOM 导入：不继承 Spring 的父 POM，只把它的版本清单导入进来。

```xml
<!-- 在你的 myapp-parent 的 pom.xml 里 -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>3.2.10</version>
            <type>pom</type>       <!-- 引入的是 POM，不是 jar -->
            <scope>import</scope>  <!-- 把该 POM 的 dependencyManagement 合并进来 -->
        </dependency>
    </dependencies>
</dependencyManagement>
```

| 对比 | 方案一（直接继承） | 方案二（BOM 导入） |
| ---- | ----------------- | ----------------- |
| 做法 | `<parent>` 设为 spring-boot-starter-parent | 在 `<dependencyManagement>` 里 import spring-boot-dependencies |
| 适用 | 单模块、或父模块可以继承 Spring 时 | 已有自定义父模块，必须继承自己的父 POM 时 |
| 结果 | 既有版本管理，也有 Spring 父 POM 的插件配置 | 只有依赖版本管理，没有 Spring 父 POM 的其它配置 |

---

### 2.2 聚合（Aggregation）

#### 2.2.1 概念

聚合是将多个模块组织在一起，通过父模块的 `<modules>` 标签统一构建。父模块知道有哪些子模块，可对所有模块执行统一的 Maven 命令。

#### 2.2.2 聚合的作用

1. **一键构建**：`mvn clean install` 一次构建所有模块
2. **自动排序**：Maven 根据依赖关系自动确定构建顺序
3. **统一管理**：一处查看项目包含的所有模块

#### 2.2.3 配置聚合

```xml
<project>
    <groupId>com.example</groupId>
    <artifactId>myapp-parent</artifactId>
    <packaging>pom</packaging>
    
    <modules>
        <module>myapp-common</module>
        <module>myapp-utils</module>
        <module>myapp-dao</module>
        <module>myapp-service</module>
        <module>myapp-web</module>
    </modules>
</project>
```

#### 2.2.4 聚合构建

```bash
cd myapp-parent
mvn clean install
```

Maven 自动输出构建顺序（Reactor Build Order）：

```
[INFO] Reactor Build Order:
[INFO] myapp-common        [jar]
[INFO] myapp-utils       [jar]
[INFO] myapp-dao      [jar]
[INFO] myapp-service     [jar]
[INFO] myapp-web         [jar]
[INFO] myapp-parent      [pom]
```

#### 2.2.5 部分构建

```bash
# 只构建指定模块
mvn clean install -pl myapp-service

# 同时构建该模块依赖的模块
mvn clean install -pl myapp-service -am

# 同时构建依赖该模块的模块
mvn clean install -pl myapp-dao -amd
```

---

### 2.3 继承与聚合对比

| 对比项       | 继承                        | 聚合                        |
| ------------ | --------------------------- | --------------------------- |
| **目的**     | 统一配置管理                | 统一构建管理                |
| **关系方向** | 子 → 父（子模块声明父模块） | 父 → 子（父模块声明子模块） |
| **配置位置** | 子模块的 `<parent>`         | 父模块的 `<modules>`        |
| **打包类型** | 父模块必须是 `pom`          | 聚合模块必须是 `pom`        |

> **实际项目几乎都是继承+聚合同时使用**，父模块既提供配置继承，又负责聚合构建。

---

## 三、私服（Private Repository）

### 3.1 什么是私服

私服是部署在企业内部网络的 Maven 仓库服务器，位于本地仓库和中央仓库之间。主要功能：

1. **存储内部 jar 包**：供团队成员共享
2. **代理缓存依赖**：加速从中央仓库的下载

### 3.2 为什么需要私服

| 场景          | 问题                 | 私服方案                   |
| ------------- | -------------------- | -------------------------- |
| 内部 jar 共享 | 只能手动复制         | 发布到私服，Maven 依赖获取 |
| 下载速度慢    | 每人都从中央仓库下载 | 私服缓存，内网高速访问     |
| 网络隔离      | 无法访问外网         | 私服作为唯一依赖来源       |
| 安全审计      | 难以管控依赖来源     | 私服集中管理               |

### 3.3 仓库类型

```
┌─────────────────────────────────────────┐
│               Nexus 私服                │
├─────────────────────────────────────────┤
│  hosted（宿主仓库）- 存储自研 jar       │
│    ├── maven-releases   正式版本        │
│    └── maven-snapshots  开发版本        │
│                                         │
│  proxy（代理仓库）- 代理中央仓库        │
│    └── maven-central    自动缓存        │
│                                         │
│  group（仓库组）- 整合多仓库            │
│    └── maven-public     统一对外入口    │
└─────────────────────────────────────────┘
```

| 类型       | 作用                       | 是否可上传 |
| ---------- | -------------------------- | ---------- |
| **hosted** | 存储内部开发的 jar         | 是         |
| **proxy**  | 代理远程仓库，自动缓存     | 否（只读） |
| **group**  | 整合多个仓库，统一访问入口 | 否         |

### 3.4 SNAPSHOT vs RELEASE

| 版本类型     | 版本号示例       | 存储仓库        | 特点                               |
| ------------ | ---------------- | --------------- | ---------------------------------- |
| **SNAPSHOT** | `1.0.0-SNAPSHOT` | maven-snapshots | 可重复发布覆盖，Maven 自动检查更新 |
| **RELEASE**  | `1.0.0`          | maven-releases  | 不可覆盖，保证稳定性               |

**版本演进流程**：

```
1.0.0-SNAPSHOT → 开发迭代 → 1.0.0 → 发布正式版 → 1.1.0-SNAPSHOT → ...
```

### 3.5 常用私服软件

- **Nexus**（最常用）：功能全面，支持多种格式
- **Artifactory**：企业级功能丰富
- **Archiva**：Apache 开源，功能简单

### 3.6 Nexus 安装

```bash
# 下载解压后目录结构
nexus-3.x.x/
├── bin/nexus          # 启动脚本
└── etc/               # 配置文件

sonatype-work/nexus3/
├── admin.password     # 初始管理员密码
└── blobs/             # 仓库数据

# 启动命令
./bin/nexus start      # 后台启动
./bin/nexus run        # 前台启动（调试）
./bin/nexus stop       # 停止

# 访问：http://localhost:8081
# 账号：admin，密码：查看 admin.password 文件
```

### 3.7 配置 Maven 使用私服

#### 3.7.1 settings.xml 配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings>
    <!-- 服务器认证（用于 deploy） -->
    <servers>
        <server>
            <id>maven-releases</id>
            <username>admin</username>
            <password>admin123</password>
        </server>
        <server>
            <id>maven-snapshots</id>
            <username>admin</username>
            <password>admin123</password>
        </server>
    </servers>
    
    <!-- 镜像配置（所有请求走私服） -->
    <mirrors>
        <mirror>
            <id>nexus</id>
            <mirrorOf>*</mirrorOf>
            <url>http://192.168.1.100:8081/repository/maven-public/</url>
        </mirror>
    </mirrors>
    
    <!-- Profile 配置 -->
    <profiles>
        <profile>
            <id>nexus</id>
            <repositories>
                <repository>
                    <id>nexus</id>
                    <url>http://192.168.1.100:8081/repository/maven-public/</url>
                    <releases><enabled>true</enabled></releases>
                    <snapshots><enabled>true</enabled></snapshots>
                </repository>
            </repositories>
        </profile>
    </profiles>
    
    <activeProfiles>
        <activeProfile>nexus</activeProfile>
    </activeProfiles>
</settings>
```

#### 3.7.2 pom.xml 配置（发布用）

```xml
<distributionManagement>
    <repository>
        <id>maven-releases</id>  <!-- 必须与 settings.xml 的 server id 一致 -->
        <url>http://192.168.1.100:8081/repository/maven-releases/</url>
    </repository>
    <snapshotRepository>
        <id>maven-snapshots</id>
        <url>http://192.168.1.100:8081/repository/maven-snapshots/</url>
    </snapshotRepository>
</distributionManagement>
```

### 3.8 发布到私服

```bash
mvn deploy                  # 发布
mvn deploy -DskipTests      # 跳过测试发布
```

Maven 根据版本号自动选择目标仓库：
- `x.x.x-SNAPSHOT` → maven-snapshots
- `x.x.x` → maven-releases

### 3.9 依赖下载流程

```
本地仓库 → 私服（group 仓库）→ 中央仓库
             ↓
        缓存到私服
             ↓
        缓存到本地
```

### 3.10 常见问题

| 错误                                       | 原因                   | 解决                                                 |
| ------------------------------------------ | ---------------------- | ---------------------------------------------------- |
| **401 Unauthorized**                       | 认证失败               | 检查用户名密码，确认 server id 与 repository id 一致 |
| **400 Repository does not allow updating** | 尝试覆盖 releases 版本 | 使用 SNAPSHOT 或升级版本号                           |
| **Connection timed out**                   | 网络问题               | 检查私服地址、端口、防火墙                           |
| **SNAPSHOT 不更新**                        | 更新策略限制           | 使用 `mvn install -U` 强制更新                       |

---

## 四、实战：多模块项目搭建

### 4.1 项目结构

```
myapp-parent/
├── pom.xml                  # 父模块（继承+聚合）
├── myapp-common/              # 实体类
├── myapp-utils/             # 工具类
├── myapp-dao/            # 数据访问层
├── myapp-service/           # 业务逻辑层
└── myapp-web/               # Web 层（启动类）
```

### 4.2 父模块 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.example</groupId>
    <artifactId>myapp-parent</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>
    
    <!-- 聚合 -->
    <modules>
        <module>myapp-common</module>
        <module>myapp-utils</module>
        <module>myapp-dao</module>
        <module>myapp-service</module>
        <module>myapp-web</module>
    </modules>
    
    <!-- 属性 -->
    <properties>
        <java.version>17</java.version>
        <spring-boot.version>3.2.10</spring-boot.version>
        <mybatis.version>3.0.3</mybatis.version>
        <myapp.version>1.0.0</myapp.version>
    </properties>
    
    <!-- 版本管理 -->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>org.mybatis.spring.boot</groupId>
                <artifactId>mybatis-spring-boot-starter</artifactId>
                <version>${mybatis.version}</version>
            </dependency>
            <!-- 子模块 -->
            <dependency>
                <groupId>com.example</groupId>
                <artifactId>myapp-common</artifactId>
                <version>${myapp.version}</version>
            </dependency>
            <dependency>
                <groupId>com.example</groupId>
                <artifactId>myapp-dao</artifactId>
                <version>${myapp.version}</version>
            </dependency>
            <dependency>
                <groupId>com.example</groupId>
                <artifactId>myapp-service</artifactId>
                <version>${myapp.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <!-- 公共依赖 -->
    <dependencies>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>
```

### 4.3 子模块 pom.xml 示例

**myapp-common**（最底层，无业务依赖）

```xml
<project>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>myapp-parent</artifactId>
        <version>1.0.0</version>
    </parent>
    <artifactId>myapp-common</artifactId>
</project>
```

**myapp-service**（依赖 mapper）

```xml
<project>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>myapp-parent</artifactId>
        <version>1.0.0</version>
    </parent>
    <artifactId>myapp-service</artifactId>
    
    <dependencies>
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>myapp-dao</artifactId>
        </dependency>
    </dependencies>
</project>
```

**myapp-web**（Spring Boot 应用）

```xml
<project>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>myapp-parent</artifactId>
        <version>1.0.0</version>
    </parent>
    <artifactId>myapp-web</artifactId>
    
    <dependencies>
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>myapp-service</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 4.4 构建与运行

```bash
cd myapp-parent
mvn clean install           # 构建所有模块

cd myapp-web
mvn spring-boot:run         # 运行应用
# 或
java -jar target/myapp-web-1.0.0.jar
```

---

## 五、总结

### 5.1 快速参考表

| 知识点     | 核心配置                             | 常用命令            |
| ---------- | ------------------------------------ | ------------------- |
| **分模块** | `<dependency>`                       | -                   |
| **继承**   | `<parent>`、`<dependencyManagement>` | -                   |
| **聚合**   | `<modules>`                          | `mvn clean install` |
| **私服**   | `<distributionManagement>`           | `mvn deploy`        |

### 5.2 最佳实践清单

**分模块**：
- [ ] 选择适合项目规模的拆分方式
- [ ] 保持模块职责单一，避免循环依赖
- [ ] 统一包名前缀

**继承与聚合**：
- [ ] 父模块 `packaging` 设为 `pom`
- [ ] 用 `<dependencyManagement>` 统一管理版本
- [ ] 公共依赖放 `<dependencies>`，按需依赖放 `<dependencyManagement>`
- [ ] 继承和聚合同时使用

**私服**：
- [ ] 开发用 SNAPSHOT，发布用 RELEASE
- [ ] settings.xml 的 server id 与 pom.xml 的 repository id 保持一致
- [ ] SNAPSHOT 不更新时使用 `-U` 参数
