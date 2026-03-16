# flex 布局

## flex 布局简介


- 传统布局较复杂，2009 年 W3C 提出 Flex（伸缩/弹性）布局。
- 一句话：flex 较新、较简单。

## 使用步骤

- 第一步：给父盒子设置 display: flex;

   - 父盒子就变成了弹性盒子（Flexbox），一般称为容器


   - 子元素一般称为项目

- 第二步：给容器或项目添加属性，目的：控制项目在容器中的大小或位置

## 主轴和侧轴

- 主轴和侧轴始终保存垂直

- 项目永远按照主轴的方向进行排列（重要！）

**==> picture [467 x 248] intentionally omitted <==**

## - 容器属性 设置主轴方向

- 主轴默认是水平方向, 侧轴默认是垂直方向

- 属性: flex-direction

## 值：

**==> picture [467 x 119] intentionally omitted <==**

## - 容器属性 设置主轴对齐方式

- 属性: justify-content

值：

**==> picture [467 x 139] intentionally omitted <==**

## - 容器属性 设置侧轴对齐方式

- 属性: align-items

值：

**==> picture [467 x 128] intentionally omitted <==**

## - 容器属性 换行

- 属性: flex-wrap （使用概率：1%）

值：

**==> picture [467 x 86] intentionally omitted <==**

注意： 换行的条件有两个（缺一不可）：1. flex-wrap: wrap; 2. 项目的宽度之和要大于容器的宽度

## - 项目属性 设置项目所占主轴方向的大小

- 属性: flex

值：

**==> picture [467 x 118] intentionally omitted <==**

默认值可以认为是initial。

此属性为三个属性的简写属性，参考flex。

## - 项目属性 设置项目在布局时的顺序

参考：order

## 大总结 - 书写flex布局的步骤

- 找到父子关系，将父元素设置display: flex;

- 确定主轴方向

- 使用flex属性设置子元素在主轴方向上的大小

- 设置主轴对齐方式

- 设置侧轴对齐方式

## - 大总结 使用场景

## 传统布局

- 布局繁琐

兼容性好

## flex布局

- 布局简单

## IE9-不支持

总结：

- 移动端：首选flex布局

pc端：

- 对兼容性要求不高，也是首选flex布局

- 如果需要兼容IE，则使用传统布局

## 结尾

- 关于更多flex的介绍（例如子元素的flex属性是哪三个属性复合而成、这三个属性的作用和初始值都是什么），

- 可以参考flex 布局的基本概念-MDN

一 flex布局中，如果某个元素（例如 段文字）总是撑开容器，可以把这个元素的 width 设置为0
