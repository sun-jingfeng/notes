# 移动 web

移动 web 预览与调试

## 步骤

- F12开发者工具

- 点击手机图标

- 切换到移动调试模式

- 选择移动设备型号或调节移动设备宽度

## 移动端开发与pc端开发的区别及解决办法

## 浏览器

- 移动web开发几乎不考虑兼容性问题，原因

   - 由于智能手机的出现比电脑晚得多，所以移动浏览器的版本普遍很高，所以H5和C3的新特性几乎都支 持。

   - 移动设备中没有IE浏览器

手机浏览器的视口比较大，解决办法：重置视口宽度

## 屏幕

- 手机屏幕出现了多倍屏，解决办法：多倍图

- 屏幕大小不一，解决办法： flex布局（也叫弹性布局、伸缩布局） 、rem布局、流式布局（%）、vw/vh

- 手机屏幕尺寸比较小，而且用户是用手操作，点击时精准度不高，解决办法：尽可能扩大可点击范围

## 视口

## 什么是视口？

## 页面显示的内容区域

## 移动端视口的问题

- 移动端默认视口宽度为1000px左右，但是屏幕宽度才300-500px之间，所以需要将视口宽度重置为屏幕的 宽度

## 如何重置？

- 在<head>标签中加入：<meta name = "viewport" content="width=device-width">

- 解释

   - meta：提供有关页面的元信息

   - viewport：视口

   - width = device-width ： 设置浏览器视口宽度为设备宽度

## 禁止视口缩放

- 在<head>标签中加入

   - <meta name = "viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0,

   - minimum-scale=1.0, user-scalable=no">

## 解释

- initial-scale=1：视口的初始缩放比例为1

- maximum-scale = 1.0 ：允许用户缩放的最大比例

minimum-scale = 1.0 ：允许用户缩放的最小比例

user-scalable = no/0 ：是否允许用户缩放页面

## 多倍屏

## 屏幕尺寸

## 屏幕对角线的距离，单位是英寸

**==> picture [467 x 266] intentionally omitted <==**

## 物理像素

**==> picture [206 x 344] intentionally omitted <==**

**==> picture [321 x 120] intentionally omitted <==**

## 物理分辨率

iPhone6/7/8的物理分辨率为： 750 x 1134

含义是： iPhone6/7/8手机一横排有750个物理像素

- （小灯泡），一竖排有1134个物理像素

## 多倍屏

## 多倍屏

从iPhone4开始之后的所有手机都采用了Retina屏幕，所谓 Retina 是一种显示标准，是把更多的像素点压缩至一块屏幕里从而达到更高的分辨率，俗称视网膜屏幕。这种屏幕有一个特点，就是它有两种像素，一个是物理像素，一个是逻辑像素。

苹果手机屏幕

**==> picture [467 x 186] intentionally omitted <==**

## 安卓手机屏幕

**==> picture [467 x 186] intentionally omitted <==**

## 多倍图

什么是多倍图？


   - 由于多倍屏的像素点很大很大，屏幕超清晰，所以图片也要给得更清晰更大 些。比如设计稿上一个图片

   - 的宽为100px，高为100px。那UI有可能给我们的图片尺寸为200x200、300x300，这就叫做多倍图。

- 对我们开发人员带来的影响：

## UI设计稿

- 业内都是以iphone6/7/8的尺寸来设计的，所以是二倍图，它的宽为750px

- 我们从UI设计稿量的所有尺寸都要除以2

## 精灵图

- 使用background-size把图片缩小相应的倍数

- 在使用background-position时也要除以相应的倍数

## 流式布局

- 是什么？

也叫百分比布局，即使用%

案例：

**==> picture [228 x 293] intentionally omitted <==**

## 圣杯布局（两端固定，中间自适应。这一种效果的名字，非技术的名字）

## 方案

## 前置知识：

- 块级元素的默认width为100%，当给它设置左右padding或margin时，它的宽度会自动变化，始终让 这个盒模型的宽度为100%。

方案一：

- 两边的蓝色盒子使用绝对定位

- 中间红色盒子使用margin或padding把两边空出来（注意：坚决不能给中间盒子设置width为100% ）

## 方案二

## 前置知识：

- 盒子模型：内容（content）、padding、border、margin

- 标准盒模型：width=内容宽

- C3盒模型： width（代码中width：xxx px）=内容宽+border宽+padding

## 方案二：

- 两边的蓝色盒子使用绝对定位

- 中间红色盒子使用C3盒模型，再使用padding把两边空出来（注意：这时可以给中间盒子设置width为 100%）
