## 一、IDEA 介绍和安装

### 1. IDEA 是什么

**IntelliJ IDEA** 是 JetBrains 公司开发的 **Java 集成开发环境**（IDE），被公认为最好用的 Java IDE。

| 名称       | 全称                                                     |
| -------- | ------------------------------------------------------ |
| **IDEA** | **I**ntelli**J** **IDEA**                              |
| **IDE**  | **I**ntegrated **D**evelopment **E**nvironment（集成开发环境） |

### 2. 为什么选择 IDEA

| 优势          | 说明          |
| ----------- | ----------- |
| **智能代码补全**  | 根据上下文自动提示   |
| **强大的重构功能** | 一键重命名、提取方法等 |
| **代码分析**    | 实时检查错误和警告   |
| **丰富的插件**   | 支持各种框架和工具   |
| **优秀的调试器**  | 可视化调试       |
| **Git 集成**  | 内置版本控制      |

### 3. IDEA 版本

| 版本                 | 说明                | 费用           |
| ------------------ | ----------------- | ------------ |
| **Ultimate（旗舰版）**  | 全功能版，支持 Web、企业开发  | 付费（可试用 30 天） |
| **Community（社区版）** | 基础版，支持 Java SE 开发 | **免费**       |

**初学者推荐**：Community 社区版（完全够用）

### 4. IDEA 下载

**官方下载地址**：<https://www.jetbrains.com/idea/download/>

**推荐方式**：使用 **Toolbox App** 管理 JetBrains 产品

    Toolbox App 优势：
    ├─ 统一管理所有 JetBrains IDE
    ├─ 自动更新
    ├─ 管理多个版本
    └─ 快速启动项目

### 5. IDEA 安装（以 Windows 为例）

    1. 下载安装包（.exe）
    2. 双击运行安装程序
    3. 选择安装路径（建议不要有中文和空格）
       推荐：D:\JetBrains\IntelliJ IDEA
    4. 选择安装选项：
       ☑ Create Desktop Shortcut（创建桌面快捷方式）
       ☑ Add "Open Folder as Project"（右键菜单）
       ☑ .java（关联 .java 文件）
       ☑ Add launchers dir to the PATH（添加到环境变量）
    5. 点击 Install 完成安装
    6. 启动 IDEA

### 6. IDEA 安装（macOS）

    1. 下载 .dmg 文件
    2. 双击打开
    3. 将 IntelliJ IDEA 拖入 Applications 文件夹
    4. 从启动台打开 IDEA

### 7. 首次启动配置

    1. 接受用户协议
    2. 选择 UI 主题（Darcula 暗色 / Light 亮色）
    3. 选择是否发送使用统计
    4. 进入欢迎界面

### 8. 配置 JDK

    方式一：创建项目时配置
    1. New Project → JDK 下拉框
    2. 选择 "Add JDK..."
    3. 选择 JDK 安装目录

    方式二：全局配置
    1. File → Project Structure（Ctrl + Alt + Shift + S）
    2. Platform Settings → SDKs
    3. 点击 "+" → Add JDK
    4. 选择 JDK 安装目录

    方式三：下载 JDK（IDEA 2020.3+）
    1. New Project → JDK 下拉框
    2. 选择 "Download JDK..."
    3. 选择版本和供应商（推荐 Eclipse Temurin）
    4. 点击 Download

***

## 二、IDEA 中的第一个代码

### 1. 创建新项目

    步骤：
    1. 打开 IDEA，点击 "New Project"
    2. 选择左侧 "New Project"
    3. 填写项目信息：
       - Name：HelloWorld（项目名称）
       - Location：D:\JavaProjects（项目位置）
       - Language：Java
       - Build system：IntelliJ（初学者选这个）
       - JDK：选择已安装的 JDK 17
    4. 点击 "Create" 创建项目

### 2. IDEA 项目结构

    HelloWorld/                    # 项目根目录
    ├─ .idea/                      # IDEA 配置文件（不用管）
    ├─ src/                        # 源代码目录（写代码的地方）
    │   └─ Main.java               # 默认生成的类
    ├─ HelloWorld.iml              # 项目配置文件
    └─ External Libraries/         # 外部库（JDK 等）

### 3. 创建 Java 类

    步骤：
    1. 右键点击 src 目录
    2. 选择 New → Java Class
    3. 输入类名：HelloWorld
    4. 按 Enter 确认

### 4. 编写 HelloWorld

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### 5. 运行程序

**方式 1：点击运行按钮**

    1. 点击代码左侧的绿色三角形 ▶
    2. 选择 "Run 'HelloWorld.main()'"

**方式 2：右键运行**

    1. 在代码编辑区右键
    2. 选择 "Run 'HelloWorld.main()'"

**方式 3：快捷键**

| 系统      | 快捷键                                             |
| ------- | ----------------------------------------------- |
| Windows | `Ctrl + Shift + F10`（首次运行）/ `Shift + F10`（再次运行） |
| macOS   | `Ctrl + Shift + R`（首次运行）/ `Ctrl + R`（再次运行）      |

### 6. 查看运行结果

    运行后，底部会出现 Run 窗口，显示：

    Hello, World!

    Process finished with exit code 0

***

## 三、IDEA 快捷键大全

### 1. 基础编辑

| 功能         | Windows                | macOS                  |
| ---------- | ---------------------- | ---------------------- |
| **代码补全**   | `Ctrl + Space`         | `Ctrl + Space`         |
| **智能补全**   | `Ctrl + Shift + Space` | `Ctrl + Shift + Space` |
| **快速修复**   | `Alt + Enter`          | `Option + Enter`       |
| **格式化代码**  | `Ctrl + Alt + L`       | `Cmd + Option + L`     |
| **优化导入**   | `Ctrl + Alt + O`       | `Ctrl + Option + O`    |
| **删除当前行**  | `Ctrl + Y`             | `Cmd + Backspace`      |
| **复制当前行**  | `Ctrl + D`             | `Cmd + D`              |
| **上下移动行**  | `Alt + Shift + ↑/↓`    | `Option + Shift + ↑/↓` |
| **上下移动语句** | `Ctrl + Shift + ↑/↓`   | `Cmd + Shift + ↑/↓`    |
| **撤销**     | `Ctrl + Z`             | `Cmd + Z`              |
| **重做**     | `Ctrl + Shift + Z`     | `Cmd + Shift + Z`      |
| **展开/折叠**  | `Ctrl + +/-`           | `Cmd + +/-`            |
| **全部展开**   | `Ctrl + Shift + +`     | `Cmd + Shift + +`      |
| **全部折叠**   | `Ctrl + Shift + -`     | `Cmd + Shift + -`      |

### 2. 注释

| 功能       | Windows            | macOS             |
| -------- | ------------------ | ----------------- |
| **单行注释** | `Ctrl + /`         | `Cmd + /`         |
| **多行注释** | `Ctrl + Shift + /` | `Cmd + Shift + /` |
| **文档注释** | `/** + Enter`      | `/** + Enter`     |

### 3. 运行和调试

| 功能       | Windows             | macOS               |
| -------- | ------------------- | ------------------- |
| **运行**   | `Shift + F10`       | `Ctrl + R`          |
| **调试**   | `Shift + F9`        | `Ctrl + D`          |
| **停止运行** | `Ctrl + F2`         | `Cmd + F2`          |
| **选择运行** | `Alt + Shift + F10` | `Ctrl + Option + R` |
| **选择调试** | `Alt + Shift + F9`  | `Ctrl + Option + D` |

### 4. 查找和替换

| 功能        | Windows                  | macOS              |
| --------- | ------------------------ | ------------------ |
| **查找**    | `Ctrl + F`               | `Cmd + F`          |
| **替换**    | `Ctrl + R`               | `Cmd + R`          |
| **全局查找**  | `Ctrl + Shift + F`       | `Cmd + Shift + F`  |
| **全局替换**  | `Ctrl + Shift + R`       | `Cmd + Shift + R`  |
| **查找类**   | `Ctrl + N`               | `Cmd + O`          |
| **查找文件**  | `Ctrl + Shift + N`       | `Cmd + Shift + O`  |
| **查找符号**  | `Ctrl + Alt + Shift + N` | `Cmd + Option + O` |
| **全局搜索**  | `双击 Shift`               | `双击 Shift`         |
| **查找下一个** | `F3`                     | `Cmd + G`          |
| **查找上一个** | `Shift + F3`             | `Cmd + Shift + G`  |

### 5. 导航跳转

| 功能          | Windows                  | macOS                  |
| ----------- | ------------------------ | ---------------------- |
| **跳转到定义**   | `Ctrl + B` 或 `Ctrl + 点击` | `Cmd + B` 或 `Cmd + 点击` |
| **跳转到实现**   | `Ctrl + Alt + B`         | `Cmd + Option + B`     |
| **跳转到父类方法** | `Ctrl + U`               | `Cmd + U`              |
| **查找用法**    | `Alt + F7`               | `Option + F7`          |
| **显示用法**    | `Ctrl + Alt + F7`        | `Cmd + Option + F7`    |
| **跳转到行**    | `Ctrl + G`               | `Cmd + L`              |
| **返回上一位置**  | `Ctrl + Alt + ←`         | `Cmd + Option + ←`     |
| **前进下一位置**  | `Ctrl + Alt + →`         | `Cmd + Option + →`     |
| **最近文件**    | `Ctrl + E`               | `Cmd + E`              |
| **最近位置**    | `Ctrl + Shift + E`       | `Cmd + Shift + E`      |
| **文件结构**    | `Ctrl + F12`             | `Cmd + F12`            |
| **类型层级**    | `Ctrl + H`               | `Ctrl + H`             |
| **方法层级**    | `Ctrl + Shift + H`       | `Cmd + Shift + H`      |

### 6. 代码生成和重构

| 功能       | Windows          | macOS              |
| -------- | ---------------- | ------------------ |
| **生成代码** | `Alt + Insert`   | `Cmd + N`          |
| **包围代码** | `Ctrl + Alt + T` | `Cmd + Option + T` |
| **重命名**  | `Shift + F6`     | `Shift + F6`       |
| **提取变量** | `Ctrl + Alt + V` | `Cmd + Option + V` |
| **提取常量** | `Ctrl + Alt + C` | `Cmd + Option + C` |
| **提取字段** | `Ctrl + Alt + F` | `Cmd + Option + F` |
| **提取方法** | `Ctrl + Alt + M` | `Cmd + Option + M` |
| **提取参数** | `Ctrl + Alt + P` | `Cmd + Option + P` |
| **内联**   | `Ctrl + Alt + N` | `Cmd + Option + N` |
| **移动**   | `F6`             | `F6`               |
| **复制类**  | `F5`             | `F5`               |
| **安全删除** | `Alt + Delete`   | `Cmd + Delete`     |
| **修改签名** | `Ctrl + F6`      | `Cmd + F6`         |

### 7. 查看信息

| 功能       | Windows            | macOS              |
| -------- | ------------------ | ------------------ |
| **查看文档** | `Ctrl + Q`         | `Ctrl + J` 或 `F1`  |
| **查看参数** | `Ctrl + P`         | `Cmd + P`          |
| **查看源码** | `Ctrl + Shift + I` | `Cmd + Y`          |
| **错误描述** | `Ctrl + F1`        | `Cmd + F1`         |
| **快速定义** | `Ctrl + Shift + I` | `Option + Space`   |
| **类型信息** | `Ctrl + Shift + P` | `Ctrl + Shift + P` |

### 8. 多光标编辑

| 功能           | Windows                         | macOS                   |
| ------------ | ------------------------------- | ----------------------- |
| **添加光标**     | `Alt + 点击`                      | `Option + 点击`           |
| **选择下一个相同词** | `Alt + J`                       | `Ctrl + G`              |
| **选择所有相同词**  | `Ctrl + Alt + Shift + J`        | `Ctrl + Cmd + G`        |
| **取消选择**     | `Alt + Shift + J`               | `Ctrl + Shift + G`      |
| **列选择模式**    | `Alt + Shift + Insert`          | `Cmd + Shift + 8`       |
| **上下添加光标**   | `Ctrl + Ctrl + ↑/↓`（按住第二个 Ctrl） | `Option + Option + ↑/↓` |

***

## 四、代码模板（Live Templates）

### 1. 常用代码模板

| 缩写      | 生成内容                                         | 说明      |
| ------- | -------------------------------------------- | ------- |
| `psvm`  | `public static void main(String[] args) { }` | 主方法     |
| `main`  | `public static void main(String[] args) { }` | 主方法（同上） |
| `sout`  | `System.out.println();`                      | 输出语句    |
| `soutv` | `System.out.println("变量名 = " + 变量名);`        | 输出变量    |
| `soutp` | `System.out.println("方法名参数");`               | 输出方法参数  |
| `soutm` | `System.out.println("类名.方法名");`              | 输出方法名   |
| `souf`  | `System.out.printf("");`                     | 格式化输出   |
| `serr`  | `System.err.println();`                      | 错误输出    |

### 2. 循环模板

| 缩写     | 生成内容                                                            | 说明        |
| ------ | --------------------------------------------------------------- | --------- |
| `fori` | `for (int i = 0; i < ; i++) { }`                                | 普通 for    |
| `forr` | `for (int i = length - 1; i >= 0; i--) { }`                     | 逆向 for    |
| `iter` | `for (Type item : collection) { }`                              | 增强 for    |
| `itar` | `for (int i = 0; i < array.length; i++) { }`                    | 数组遍历      |
| `itco` | `for (Iterator it = collection.iterator(); it.hasNext(); ) { }` | 迭代器遍历     |
| `itit` | `while (iterator.hasNext()) { }`                                | 迭代器 while |

### 3. 条件和异常模板

| 缩写     | 生成内容                           | 说明                 |
| ------ | ------------------------------ | ------------------ |
| `ifn`  | `if (var == null) { }`         | 判空                 |
| `inn`  | `if (var != null) { }`         | 非空判断               |
| `inst` | `if (obj instanceof Type) { }` | 类型判断               |
| `thr`  | `throw new `                   | 抛出异常               |
| `tryc` | `try { } catch { }`            | try-catch          |
| `tryr` | `try () { } catch { }`         | try-with-resources |

### 4. 其他常用模板

| 缩写     | 生成内容                                        | 说明       |
| ------ | ------------------------------------------- | -------- |
| `psf`  | `public static final`                       | 公共静态常量   |
| `prsf` | `private static final`                      | 私有静态常量   |
| `psfs` | `public static final String`                | 字符串常量    |
| `psfi` | `public static final int`                   | 整数常量     |
| `St`   | `String`                                    | String类型 |
| `geti` | `public static Singleton getInstance() { }` | 单例方法     |
| `lazy` | 懒加载单例模式                                     | 懒汉单例     |
| `toar` | `collection.toArray(new Type[0])`           | 转数组      |

**使用方法**：输入缩写后按 `Tab` 键

***

## 五、后缀补全（Postfix Completion）

### 1. 输出相关

| 后缀       | 示例           | 结果                                      |
| -------- | ------------ | --------------------------------------- |
| `.sout`  | `name.sout`  | `System.out.println(name);`             |
| `.soutv` | `name.soutv` | `System.out.println("name = " + name);` |
| `.serr`  | `name.serr`  | `System.err.println(name);`             |
| `.souf`  | `name.souf`  | `System.out.printf("", name);`          |

### 2. 变量和返回

| 后缀        | 示例                      | 结果                                            |
| --------- | ----------------------- | --------------------------------------------- |
| `.var`    | `new ArrayList<>().var` | `ArrayList<Object> list = new ArrayList<>();` |
| `.return` | `result.return`         | `return result;`                              |
| `.field`  | `"hello".field`         | 创建成员变量                                        |
| `.arg`    | `value.arg`             | 创建方法参数                                        |

### 3. 条件判断

| 后缀         | 示例            | 结果                     |
| ---------- | ------------- | ---------------------- |
| `.if`      | `flag.if`     | `if (flag) { }`        |
| `.else`    | `flag.else`   | `if (!flag) { }`       |
| `.null`    | `obj.null`    | `if (obj == null) { }` |
| `.nn`      | `obj.nn`      | `if (obj != null) { }` |
| `.notnull` | `obj.notnull` | `if (obj != null) { }` |
| `.switch`  | `num.switch`  | `switch (num) { }`     |

### 4. 循环遍历

| 后缀      | 示例         | 结果                                      |
| ------- | ---------- | --------------------------------------- |
| `.for`  | `list.for` | `for (Object o : list) { }`             |
| `.fori` | `10.fori`  | `for (int i = 0; i < 10; i++) { }`      |
| `.forr` | `10.forr`  | `for (int i = 10 - 1; i >= 0; i--) { }` |

### 5. 异常处理

| 后缀       | 示例             | 结果                            |
| -------- | -------------- | ----------------------------- |
| `.try`   | `method().try` | `try { method(); } catch { }` |
| `.twr`   | `stream.twr`   | `try (stream) { }`            |
| `.throw` | `e.throw`      | `throw e;`                    |

### 6. 类型转换

| 后缀         | 示例            | 结果                     |
| ---------- | ------------- | ---------------------- |
| `.cast`    | `obj.cast`    | `((Type) obj)`         |
| `.castvar` | `obj.castvar` | `Type t = (Type) obj;` |

### 7. 其他

| 后缀            | 示例                  | 结果                            |
| ------------- | ------------------- | ----------------------------- |
| `.not`        | `flag.not`          | `!flag`                       |
| `.par`        | `a + b.par`         | `(a + b)`                     |
| `.new`        | `String.new`        | `new String()`                |
| `.lambda`     | `runnable.lambda`   | Lambda 表达式                    |
| `.opt`        | `value.opt`         | `Optional.ofNullable(value)`  |
| `.stream`     | `list.stream`       | `list.stream()`               |
| `.format`     | `"hello %s".format` | `String.format("hello %s", )` |
| `.assert`     | `condition.assert`  | `assert condition;`           |
| `.sync`       | `lock.sync`         | `synchronized (lock) { }`     |
| `.reqnonnull` | `obj.reqnonnull`    | `Objects.requireNonNull(obj)` |

***

## 六、代码生成（Alt + Insert）

在类中按 `Alt + Insert`（Windows）或 `Cmd + N`（macOS）：

| 选项                          | 说明                      |
| --------------------------- | ----------------------- |
| **Constructor**             | 生成构造方法                  |
| **Getter and Setter**       | 生成 getter/setter 方法     |
| **Getter**                  | 只生成 getter              |
| **Setter**                  | 只生成 setter              |
| **equals() and hashCode()** | 生成 equals 和 hashCode 方法 |
| **toString()**              | 生成 toString 方法          |
| **Override Methods**        | 重写父类方法                  |
| **Implement Methods**       | 实现接口方法                  |
| **Delegate Methods**        | 委托方法                    |
| **Test Method**             | 生成测试方法                  |

**示例**：生成 JavaBean

```java
public class User {
    private String name;
    private int age;
    
    // 按 Alt + Insert → Constructor → 选择字段 → OK
    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // 按 Alt + Insert → Getter and Setter → 选择字段 → OK
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    
    // 按 Alt + Insert → toString() → OK
    @Override
    public String toString() {
        return "User{name='" + name + "', age=" + age + "}";
    }
}
```

***

## 七、快速修复（Alt + Enter）

当代码有错误或警告时，按 `Alt + Enter` 可以快速修复：

| 场景    | 修复选项                                                 |
| ----- | ---------------------------------------------------- |
| 缺少导入  | Import class                                         |
| 变量未声明 | Create local variable                                |
| 方法未实现 | Implement methods                                    |
| 类型不匹配 | Cast to ...                                          |
| 代码冗余  | Simplify                                             |
| 缺少方法  | Create method                                        |
| 缺少类   | Create class                                         |
| 异常未处理 | Add exception to signature / Surround with try-catch |
| 可优化代码 | Replace with ...                                     |
| 资源未关闭 | Surround with try-with-resources                     |

**示例**：

```java
// ArrayList 显示红色（未导入）
ArrayList<String> list = new ArrayList<>();

// 光标放在 ArrayList 上，按 Alt + Enter
// 选择 "Import class" 自动导入
import java.util.ArrayList;
```

***

## 八、调试功能

### 1. 设置断点

    普通断点：点击代码行号左侧，出现红点 🔴
    条件断点：右键红点 → 设置 Condition（如 i > 5）
    日志断点：右键红点 → 取消 Suspend，勾选 Log 并设置输出
    异常断点：View Breakpoints → "+" → Java Exception Breakpoints

### 2. 调试快捷键

| 功能        | Windows             | macOS                 | 说明           |
| --------- | ------------------- | --------------------- | ------------ |
| **开始调试**  | `Shift + F9`        | `Ctrl + D`            | 启动调试         |
| **步过**    | `F8`                | `F8`                  | 执行当前行，不进入方法  |
| **步入**    | `F7`                | `F7`                  | 进入方法内部       |
| **强制步入**  | `Alt + Shift + F7`  | `Option + Shift + F7` | 进入任何方法（含库方法） |
| **步出**    | `Shift + F8`        | `Shift + F8`          | 跳出当前方法       |
| **运行到光标** | `Alt + F9`          | `Option + F9`         | 运行到光标位置      |
| **恢复运行**  | `F9`                | `Cmd + Option + R`    | 继续运行到下一个断点   |
| **停止调试**  | `Ctrl + F2`         | `Cmd + F2`            | 停止调试         |
| **查看断点**  | `Ctrl + Shift + F8` | `Cmd + Shift + F8`    | 查看所有断点       |
| **计算表达式** | `Alt + F8`          | `Option + F8`         | 求值表达式        |

### 3. 调试窗口

    ┌─────────────────────────────────────────────────────────┐
    │ Debug 窗口                                               │
    ├─────────────────────────────────────────────────────────┤
    │ Debugger                                                 │
    │ ├─ Frames（调用栈）：显示方法调用层级                     │
    │ ├─ Variables（变量）：显示当前变量的值                   │
    │ └─ Watches（监视）：自定义监视的表达式                   │
    │                                                          │
    │ Console（控制台）：显示程序输出                          │
    └─────────────────────────────────────────────────────────┘

### 4. 高级调试功能

| 功能        | 说明                            |
| --------- | ----------------------------- |
| **条件断点**  | 右键断点设置条件，满足条件才暂停              |
| **日志断点**  | 不暂停程序，只输出日志                   |
| **表达式求值** | `Alt + F8` 计算任意表达式            |
| **修改变量值** | 右键变量 → Set Value              |
| **强制返回**  | 右键方法 → Force Return           |
| **丢弃帧**   | 右键帧 → Drop Frame（回退执行）        |
| **监视变量**  | 点击 "+" 添加表达式到 Watches         |
| **查看内存**  | 右键对象 → Show Referring Objects |

### 5. 条件断点示例

```java
// 当循环到 i == 50 时暂停
for (int i = 0; i < 100; i++) {
    System.out.println(i);  // 在此设置断点，右键设置条件：i == 50
}
```

***

## 九、Git 集成

### 1. 初始化 Git

    方式一：VCS → Enable Version Control Integration → Git
    方式二：终端执行 git init

### 2. Git 常用操作

| 功能     | 菜单/快捷键                   | 说明     |
| ------ | ------------------------ | ------ |
| **提交** | `Ctrl + K`               | 提交更改   |
| **推送** | `Ctrl + Shift + K`       | 推送到远程  |
| **拉取** | VCS → Git → Pull         | 拉取远程更新 |
| **更新** | `Ctrl + T`               | 更新项目   |
| **历史** | VCS → Git → Show History | 查看文件历史 |
| **分支** | Git → Branches（右下角）      | 管理分支   |
| **对比** | `Ctrl + D`（在版本控制面板）      | 查看差异   |
| **回滚** | `Ctrl + Alt + Z`         | 回滚更改   |

### 3. Git 工具窗口

    ┌─────────────────────────────────────────────────────────┐
    │ Git 窗口（Alt + 9 / Cmd + 9）                            │
    ├─────────────────────────────────────────────────────────┤
    │ Log（日志）：查看提交历史，分支图                         │
    │ Console（控制台）：Git 命令输出                          │
    │                                                          │
    │ 右下角状态栏：当前分支名，点击可切换/创建分支             │
    └─────────────────────────────────────────────────────────┘

### 4. 版本控制颜色标识

| 颜色    | 含义    |
| ----- | ----- |
| 🟢 绿色 | 新增文件  |
| 🔵 蓝色 | 已修改文件 |
| 🟤 灰色 | 已删除文件 |
| 🔴 红色 | 未跟踪文件 |

***

## 十、项目管理

### 1. 创建包

    1. 右键 src 目录
    2. New → Package
    3. 输入包名：com.example.demo
    4. 按 Enter 确认

### 2. 包命名规范

    com.公司名.项目名.模块名

    示例：
    com.itheima.demo
    com.alibaba.taobao.order

### 3. 项目结构设置

| 快捷键                      | 功能       |
| ------------------------ | -------- |
| `Ctrl + Alt + Shift + S` | 打开项目结构设置 |

    Project Structure 窗口
    ├─ Project（项目级别）
    │   ├─ Project SDK：选择 JDK
    │   └─ Project language level：语言级别
    │
    ├─ Modules（模块设置）
    │   ├─ Sources：源代码目录（蓝色）
    │   ├─ Tests：测试目录（绿色）
    │   ├─ Resources：资源目录
    │   └─ Excluded：排除目录（红色）
    │
    ├─ Libraries（库管理）
    │   └─ 添加/删除第三方 jar 包
    │
    └─ SDKs（SDK 管理）
        └─ 管理 JDK 版本

***

## 十一、终端使用

### 1. 打开终端

| 快捷键         | 说明        |
| ----------- | --------- |
| `Alt + F12` | 打开/关闭终端窗口 |

### 2. 终端功能

    ┌─────────────────────────────────────────────────────────┐
    │ Terminal 窗口                                            │
    ├─────────────────────────────────────────────────────────┤
    │ ├─ "+" 按钮：新建终端标签                                 │
    │ ├─ Local/SSH：本地或远程终端                             │
    │ └─ 默认在项目根目录打开                                   │
    │                                                          │
    │ 常用命令：                                                │
    │ ├─ cd：切换目录                                          │
    │ ├─ ls / dir：列出文件                                    │
    │ ├─ javac：编译 Java 文件                                 │
    │ ├─ java：运行 Java 程序                                  │
    │ └─ mvn / gradle：构建工具命令                            │
    └─────────────────────────────────────────────────────────┘

***

## 十二、常用设置

### 1. 打开设置

| 系统      | 快捷键              |
| ------- | ---------------- |
| Windows | `Ctrl + Alt + S` |
| macOS   | `Cmd + ,`        |

### 2. 常用设置项

| 设置    | 路径                             | 说明          |
| ----- | ------------------------------ | ----------- |
| 字体大小  | Editor → Font                  | 修改代码字体和大小   |
| 主题    | Appearance → Theme             | 切换暗色/亮色主题   |
| 编码    | Editor → File Encodings        | 设置 UTF-8 编码 |
| 自动导入  | Editor → General → Auto Import | 自动导入包       |
| 代码模板  | Editor → Live Templates        | 自定义代码模板     |
| 快捷键方案 | Keymap                         | 切换快捷键风格     |

### 3. 推荐设置

**1. 设置 UTF-8 编码**

    Settings → Editor → File Encodings
    ├─ Global Encoding: UTF-8
    ├─ Project Encoding: UTF-8
    └─ Default encoding for properties files: UTF-8

**2. 自动导入**

    Settings → Editor → General → Auto Import
    ├─ ☑ Add unambiguous imports on the fly
    └─ ☑ Optimize imports on the fly

**3. 显示行号和方法分隔线**

    Settings → Editor → General → Appearance
    ├─ ☑ Show line numbers
    └─ ☑ Show method separators

**4. 代码字体设置**

    Settings → Editor → Font
    ├─ Font: JetBrains Mono（推荐）
    ├─ Size: 14-16
    └─ Line height: 1.2

**5. 取消拼写检查**

    Settings → Editor → Inspections
    └─ □ Typo（取消勾选）

**6. 自动换行**

    Settings → Editor → General
    └─ ☑ Soft-wrap these files: *

***

## 十三、常用插件

### 1. 必装插件

| 插件名                                | 功能       |
| ---------------------------------- | -------- |
| **Chinese Language Pack**          | 中文汉化     |
| **Rainbow Brackets**               | 彩虹括号     |
| **Key Promoter X**                 | 快捷键提示    |
| **Translation**                    | 翻译插件     |
| **Alibaba Java Coding Guidelines** | 阿里巴巴代码规范 |

### 2. 推荐插件

| 插件名                     | 功能             |
| ----------------------- | -------------- |
| **GitToolBox**          | 增强 Git 功能      |
| **Lombok**              | Lombok 支持      |
| **GenerateAllSetter**   | 一键生成 Setter 调用 |
| **GsonFormatPlus**      | JSON 转 Java 类  |
| **String Manipulation** | 字符串操作          |
| **.ignore**             | 管理 .gitignore  |
| **Material Theme UI**   | Material 主题    |
| **Maven Helper**        | Maven 依赖分析     |
| **MyBatisX**            | MyBatis 增强     |
| **JRebel**              | 热部署            |

### 3. 安装插件

    1. Settings → Plugins
    2. 搜索插件名
    3. 点击 Install
    4. 重启 IDEA

***

## 十四、总结

### 核心快捷键（必背）

| 功能        | Windows          | macOS              |
| --------- | ---------------- | ------------------ |
| **代码补全**  | `Ctrl + Space`   | `Ctrl + Space`     |
| **快速修复**  | `Alt + Enter`    | `Option + Enter`   |
| **格式化代码** | `Ctrl + Alt + L` | `Cmd + Option + L` |
| **生成代码**  | `Alt + Insert`   | `Cmd + N`          |
| **运行**    | `Shift + F10`    | `Ctrl + R`         |
| **调试**    | `Shift + F9`     | `Ctrl + D`         |
| **全局搜索**  | `双击 Shift`       | `双击 Shift`         |
| **查找类**   | `Ctrl + N`       | `Cmd + O`          |
| **跳转定义**  | `Ctrl + B`       | `Cmd + B`          |
| **查找用法**  | `Alt + F7`       | `Option + F7`      |
| **重命名**   | `Shift + F6`     | `Shift + F6`       |
| **提交**    | `Ctrl + K`       | `Cmd + K`          |
| **单行注释**  | `Ctrl + /`       | `Cmd + /`          |

### 常用代码模板

| 缩写      | 生成内容    |
| ------- | ------- |
| `psvm`  | main 方法 |
| `sout`  | 输出语句    |
| `fori`  | for 循环  |
| `iter`  | 增强 for  |
| `.var`  | 生成变量    |
| `.sout` | 输出变量    |
| `.if`   | if 判断   |
| `.for`  | 增强 for  |
| `.null` | 判空      |

