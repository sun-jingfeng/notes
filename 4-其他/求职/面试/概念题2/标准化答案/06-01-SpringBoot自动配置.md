# Spring Boot 自动配置原理

## 一、@SpringBootApplication 组成

```
@SpringBootApplication
    ├── @SpringBootConfiguration   → 等价 @Configuration，标识配置类
    ├── @EnableAutoConfiguration   → 启用自动配置（核心）
    │       └── @Import(AutoConfigurationImportSelector.class)
    └── @ComponentScan              → 扫描当前包及子包下的组件
```

***

## 二、自动配置如何加载

- **AutoConfigurationImportSelector** 通过 `SpringFactoriesLoader` 读取各 jar 包中 **META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports**（或旧版 spring.factories 的 `EnableAutoConfiguration` key），得到一批自动配置类全限定名。
- 这些配置类上通常带有 **@Conditional** 系列注解（如 `@ConditionalOnClass`、`@ConditionalOnMissingBean`、`@ConditionalOnProperty`），只有条件满足时该配置类及其中的 Bean 才会生效。
- 因此可“按需加载”：引入 starter 带来依赖后，对应自动配置类条件满足才注册 Bean，实现开箱即用。

***

## 三、常见条件注解

| 注解 | 含义 |
| --- | --- |
| **@ConditionalOnClass** | 类路径存在某类时生效 |
| **@ConditionalOnMissingBean** | 容器中不存在某类型 Bean 时生效 |
| **@ConditionalOnProperty** | 配置项满足条件时生效 |

***

## 四、面试答题要点

- **@SpringBootApplication** 包含 Configuration、EnableAutoConfiguration、ComponentScan。
- **自动配置**：通过 AutoConfigurationImportSelector 读取 jar 中的自动配置类列表，再结合 @Conditional 决定是否注册 Bean。
- **ConditionalOnClass / OnMissingBean** 等控制“有依赖才配、无自定义 Bean 才配”，实现约定优于配置。
