# Spring 常用注解

## 一、Web 与请求

| 注解 | 说明 |
| --- | --- |
| **@RestController** | @Controller + @ResponseBody，返回值直接写回（如 JSON） |
| **@RequestMapping** | 映射 URL；@GetMapping、@PostMapping 等为 method 简写 |
| **@RequestBody** | 将请求体（如 JSON）反序列化为方法参数对象 |
| **@PathVariable** | 取路径变量，如 `/users/{id}` 的 id |
| **@RequestParam** | 取查询参数或表单字段，可指定默认值、是否必填 |

***

## 二、依赖与配置

| 注解 | 说明 |
| --- | --- |
| **@Autowired** | 按类型注入；可配合 @Qualifier 指定名称 |
| **@Value** | 注入单个配置项，如 `@Value("${server.port}")` |
| **@ConfigurationProperties** | 将配置前缀批量绑定到 Bean 属性，支持类型校验与嵌套 |

***

## 三、面试答题要点

- **Web**：@RestController、@RequestMapping/Get/Post、@RequestBody、@PathVariable、@RequestParam。
- **注入**：@Autowired；@Value 单值、@ConfigurationProperties 批量绑定配置。
