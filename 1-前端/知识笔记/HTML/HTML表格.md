# HTML 表格

表格的基本语法

```html
<table>
  <tr>
    <td>单元格内的文字</td>
    ...
  </tr>
  ...
</table>
```

- `<table></table>` 用于定义表格。

- <tr> </tr> 标签用于定义表格中的行，必须嵌套在 <table> </table>标签中。

- <td> </td> 用于定义表格中的单元格，必须嵌套在<tr></tr>标签中。

- 字母 td 指表格数据（table data），即数据单元格的内容。

## 表头单元格标签

- 一般表头单元格位于表格的第一行或第一列，表头单元格里面的文本内容加粗居中显示. <th> 标签表示 HTML 表格的表头部分(table head 的缩写)

1 <table> 2 <tr> 3 <th> 姓名 </th> 4 ... 5 </tr> 6 ... 7 </table>

**==> picture [368 x 76] intentionally omitted <==**

- 表头单元格也是单元格, 常用于表格第一行, 突出重要性, 表头单元格里面的文字会加粗居中显示.

## 表格属性

表格标签这部分属性我们实际开发我们不常用，后面通过 CSS 来设置.

**==> picture [467 x 147] intentionally omitted <==**

## 表格结构标签

- 在表格标签中，分别用：<thead>标签 表格的头部区域、<tbody>标签 表格的主体区域. 这样可以更好的分清表 格结构。

**==> picture [338 x 224] intentionally omitted <==**

- <thead></thead>：用于定义表格的头部。<thead> 内部必须拥有 <tr> 标签。 一般是位于第一行。

- <tbody></tbody>：用于定义表格的主体，主要用于放数据本体 。

- 以上标签都是放在 <table></table> 标签中。

## 合并单元格

- 合并单元格方式：

   - 跨行合并：rowspan="合并单元格的个数"

   - 跨列合并：colspan="合并单元格的个数"

**==> picture [467 x 102] intentionally omitted <==**

- 目标单元格：(写合并代码)

   - 跨行：最上侧单元格为目标单元格, 写合并代码

   - 跨列：最左侧单元格为目标单元格, 写合并代码

**==> picture [248 x 135] intentionally omitted <==**

## 合并单元格三步曲：

- 先确定是跨行还是跨列合并。

- 找到目标单元格. 写上合并方式 = 合并的单元格数量。比如：<td colspan="2"></td>。

- 删除多余的单元格。
