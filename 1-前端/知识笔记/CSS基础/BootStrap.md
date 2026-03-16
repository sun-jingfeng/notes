# BootStrap

## BootStrap 介绍

- Bootstrap 是由 Twitter 开发维护的前端 UI 框架。

- 什么是 UI 框架？将常见效果统一封装成一套可复用代码。

- 好处：提高了开发效率

   - 它提供了大量的css样式、html组件、各种各样的特效


   - 提供一套响应式布局方案——栅格系统

## 版本

- BootStrap3 (目前使用最广泛)

- BootStrap4

## 学习目的

- 练习使用bootstrap框架的样式和栅格系统

## 搭建BootStrap框架的步骤

一 第 步：下载bootstrap

**==> picture [467 x 142] intentionally omitted <==**

**==> picture [467 x 199] intentionally omitted <==**

**==> picture [467 x 197] intentionally omitted <==**

**==> picture [467 x 195] intentionally omitted <==**

**==> picture [159 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
第二步：复制并粘贴html骨架结构<br>**----- End of picture text -----**<br>

**==> picture [455 x 145] intentionally omitted <==**

**==> picture [275 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
在起步页面往下滚动找到基本模板，然后复制html代码即可<br>**----- End of picture text -----**<br>

**==> picture [467 x 192] intentionally omitted <==**

**==> picture [224 x 12] intentionally omitted <==**

**----- Start of picture text -----**<br>
第三步：修改bootstrap路径、删除多余的js代码<br>**----- End of picture text -----**<br>

**==> picture [467 x 314] intentionally omitted <==**

**==> picture [227 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
验证是否搭建成功：复制并粘贴bootstrap的代码<br>**----- End of picture text -----**<br>

**==> picture [467 x 148] intentionally omitted <==**

**==> picture [291 x 12] intentionally omitted <==**

**----- Start of picture text -----**<br>
在全局css样式页面往下滚动找到按钮，然后复杂html代码即可<br>**----- End of picture text -----**<br>

**==> picture [416 x 213] intentionally omitted <==**

## BootStrap栅格系统 - 介绍

## 栅格系统的作用？

实现响应式开发

- 响应式与自适应的区别？

   - 自适应：元素的大小随着屏幕宽度的变化等比例变化

   - 响应式：元素的布局随着屏幕宽度的变化而变化

## 栅格系统介绍


- BootStrap把 行分为12等份，一个元素需要占几份就在代码中写几份就行

**==> picture [242 x 209] intentionally omitted <==**

## BootStrap栅格系统 - 使用步骤

- 第一步：设置包裹元素（注意：有15px的左右padding）

   - .container 或 .container-fluid

- 第二步：设置行元素（注意：有-15px的左右margin，目的：为了抵消15px的内边距） .row

- 第三步：设置列元素（注意：有15px的左右padding）

   - .col-lg-数字

   - .col-md-数字

.col-sm-数字

- .col-xs-数字

## （开始嵌套）

- 第二步：设置行元素 .row

- 第三步：设置列元素 .col-*-数字

…

## 版心宽度变化

**==> picture [467 x 76] intentionally omitted <==**

## 元素宽度变化

**==> picture [467 x 115] intentionally omitted <==**

## - 元素宽度变化 案例

## 一个ul里面有四个li，

- 当屏幕大于等于992px时，每个li的宽度为25%；

- 当屏幕大于等于768px小于992px时，每个li的宽度为50%；

- 当屏幕小于768px时，每个li的宽度为100%；

## 元素的显示与隐藏

**==> picture [467 x 200] intentionally omitted <==**

## - 元素的显示与隐藏 案例

- 两个div盒子，里面文字分别为"我"和"你"，实现如下效果：

   - 当屏幕宽度大于等于992px时只显示"我"；

   - 当屏幕宽度小于992px时只显示"你"；
