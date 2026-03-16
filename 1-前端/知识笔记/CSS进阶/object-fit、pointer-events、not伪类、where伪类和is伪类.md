# object-fit、pointer-events、not/where/is 伪类

## object-fit

- 描述：object-fit属性指定可替换元素（例如：<img> 或 <video>）的内容应该如何适应到其使用高度和宽度确定的框

- 应用：设置img中的图片为覆盖或包含，类似background-size的cover或contain

- 文档：object-fit

## pointer-events

- 描述：pointer-events属性指定在什么情况下 (如果有) 某个特定的图形元素可以成为鼠标事件的target

- 应用：禁用所有鼠标事件，使事件"穿透"到下层元素

- 文档：pointer-events

## not伪类

- 描述：:not() CSS 伪类用来匹配不符合一组选择器的元素。由于它的作用是防止特定的元素被选中，它也被称

- 为反选伪类（negation pseudo-class）。

- 应用：给【目标容器】加【标记class】，把这个【标记class】作为外部样式的not伪类的参数，以防止污染

- 【目标容器】的内容。可配合postcss-prefix-selector插件使用。

- 说明：优先级同:is()，为其中选择器列表中的最高优先级

- 文档：:not()

## where伪类和is伪类

- 描述：:where() 伪类函数接受选择器列表作为它的参数，将会选择所有能被该选择器列表中任何一条规则选中 的元素。

- 应用：简化选择器列表中的相同部分

## 说明

   - :where()的优先级是0，:is()的优先级是其中选择器列表中的最高优先级。

   - 普通选择器列表中，如果有任何选择器无效，则整个列表视为无效。但当使用 :is() 或 :where() 时，如果某 个选择器无法解析，其他选择器不受影响。

- 文档：:where()、:is()

## width新值

min-content

元素内容最小宽度。

- max-content

   - 元素内容最大宽度。

fit-content

   - 取以下两种值中的较大值

      - min-content

      - max-content和可用宽度中的较小值

- 文档：width
