# this 默认值、this 定义值、浅拷贝、深拷贝

## 普通函数

普通函数的调用方式决定了 `this` 的值，即【谁调用 `this` 的值指向谁】，如下代码所示：

1 <script> 2 // 普通函数 3 function sayHi() { 4 console.log(this); 5 } 6 // 函数表达式 7 let sayHello = function () { 8 console.log(this); 9 } 10 11 // 函数的调用方式决定了 this 的值 12 sayHi(); // window 13 window.sayHi(); // window 14 15 // 普通对象 16 let user = { 17 name: ' 小明 ', 18 walk: function () { 19 console.log(this); 20 } 21 }; 22 // 动态为 user 添加方法 23 user.sayHi = sayHi; 24 user.sayHello = sayHello; 25 26 // 函数调用方式，决定了 this 的值 27 user.sayHi(); 28 user.sayHello(); 29 </script>

注： 普通函数没有明确调用者时 `this` 值为 `window`，严格模式下没有调用者时 `this` 的值为 `undefined`。

## 箭头函数

箭头函数中的 `this` 与普通函数完全不同，也不受调用方式的影响，事实上箭头函数中并不存在 `this` ！ 箭头函数中访问的 `this` 不过是箭头函数所在作用域的 `this` 变量。

> 1 <script>

> 2 console.log(this); // 此处为 window

> 3 // 箭头函数

> 4 let sayHi = function() {

> 5 console.log(this); // 该箭头函数中的 this 为函数声明环境中 this 一致

> 6 }

7

> 8 // 普通对象

> 9 let user = {

> 10 name: ' 小明 ',

> 11 // 该箭头函数中的 this 为函数声明环境中 this 一致

> 12 walk: () => {

> 13 console.log(this);

> 14 }, 15

> 16 sleep: function () {

> 17 let str = 'hello';

> 18 console.log(this);

> 19 let fn = () => {

> 20 console.log(str);

> 21 console.log(this); // 该箭头函数中的 this 与 sleep 中的 this 一致

> 22 }

> 23 // 调用箭头函数

> 24 fn();

> 25 }

> 26 } 27

> 28 // 动态添加方法

> 29 user.sayHi = sayHi; 30

> 31 // 函数调用

> 32 user.sayHi();

> 33 user.sleep();

> 34 user.walk();

> 35 </script>

在开发中【使用箭头函数前需要考虑函数中 `this` 的值】，事件回调函数使用箭头函数时，`this` 为全局 的 `window`，因此DOM事件回调函数不推荐使用箭头函数，如下代码所示：

> 1 <script>

> 2 // DOM 节点

> 3 let btn = document.querySelector('.btn'); 4

> 5 // 箭头函数 此时 this 指向了 window

> 6 btn.addEventListener('click', () => {

> 7 console.log(this);

> 8 }) 9

> 10 // 普通函数 此时 this 指向了 DOM 对象

> 11 btn.addEventListener('click', function () {

> 12 console.log(this);

> 13 })

> 14 </script>

同样由于箭头函数 `this` 的原因，基于原型的面向对象也不推荐采用箭头函数，如下代码所示：

> 1 <script>

> 2 function Person() { 3

> 4 } 5

> 6 // 原型对像上添加了箭头函数

> 7 Person.prototype.walk = () => {

> 8 console.log(' 人都要走路 ...');

> 9 console.log(this); // widow

> 10 } 11

> 12 let p1 = new Person();

> 13 p1.walk();

> 14 </script>

## class类

## 构造函数、实例属性、实例方法中引用【实例】

> 1 class Animal {

> 2 constructor(name){

> 3 this.name = name

> 4 }

> 5 instanceProp = this

> 6 instanceFn(){

> 7 return this

> 8 }

> 9 } 10

> 11 const animal = new Animal('Orange')

> 12 console.log(animal === animal.instanceProp) // true

> 13 console.log(animal === animal.instanceFn()) // true

## 静态方法、静态属性中引用【类】

- 1 class Animal {

> 2 static staticProp = new this()

> 3 static staticFn(){

> 4 return this

> 5 }

> 6 } 7

> 8 console.log(Animal.staticProp) // 实例

> 9 console.log(Animal === Animal.staticFn()) // true

## 总结

> 1 class Animal {

> 2 constructor(){

> 3 // this 引用【实例】

> 4 }

> 5 static staticProp // this 引用【类】

> 6 static staticFn(){

> 7 // this 引用【类】

> 8 }

> 9 instanceProp // this 引用【实例】

> 10 instanceFn(){

> 11 // this 引用【实例】

> 12 }

}

13

## this——定义值

- 以上归纳了普通函数和箭头函数中关于 `this` 默认值的情形，不仅如此 JavaScript 中还允许指定函数中 `this` 的指向，有 3 个方法可以动态指定普通函数中 `this` 的指向：

- call

使用 `call` 方法调用函数，同时指定函数中 `this` 的值，使用方法如下代码所示：

> 1 <script>

> 2 // 普通函数

> 3 function sayHi() {

> 4 console.log(this);

> 5 } 6

> 7 let user = {

> 8 name: ' 小明 ',

> 9 age: 18

> 10 } 11

> 12 let student = {

> 13 name: ' 小红 ',

> 14 age: 16

> 15 } 16

> 17 // 调用函数并指定 this 的值

> 18 sayHi.call(user); // this 值为 user

> 19 sayHi.call(student); // this 值为 student

20

> 21 // 求和函数

> 22 function counter(x, y) {

> 23 return x + y;

> 24 } 25

> 26 // 调用 counter 函数，并传入参数

> 27 let result = counter.call(null, 5, 10);

> 28 console.log(result);

> 29 </script>

## 总结：

- `call` 方法能够在调用函数的同时指定 `this` 的值

- 使用 `call` 方法调用函数时，第1个参数为 `this` 指定的值

- `call` 方法的其余参数会依次自动传入函数做为函数的参数

## apply

使用 `call` 方法调用函数，同时指定函数中 `this` 的值，使用方法如下代码所示：

> 1 <script>

> 2 // 普通函数

> 3 function sayHi() {

> 4 console.log(this);

> 5 } 6

> 7 let user = {

> 8 name: ' 小明 ',

> 9 age: 18

> 10 } 11

> 12 let student = {

> 13 name: ' 小红 ',

> 14 age: 16

> 15 } 16

> 17 // 调用函数并指定 this 的值

> 18 sayHi.apply(user); // this 值为 user

> 19 sayHi.apply(student); // this 值为 student 20

> 21 // 求和函数和函数函数数

> 22 function counter(x, y) {

> 23 return x + y;

> 24 } 25

> 26 // 调用用 counter 函数，并传入参数数，并传入参数，并传入参数并传入参数传入参数入参数参数数

> 27 let result = counter.apply(null, [5, 10]);

> 28 console.log(result); 29

// 求和函数和函数函数数 function counter(x, y) { return x + y; } // 调用用 counter 函数，并传入参数数，并传入参数，并传入参数并传入参数传入参数入参数参数数 let result = counter.apply(null, [5, 10]); console.log(result); </script>

## 总结：

- `apply` 方法能够在调用函数的同时指定 `this` 的值

- 使用 `apply` 方法调用函数时，第1个参数为 `this` 指定的值

`apply` 方法第2个参数为数组，数组的单元值依次自动传入函数做为函数的参数

## bind

- `bind` 方法并不会调用函数，而是创建一个指定了 `this` 值的新函数，使用方法如下代码所示：

> 1 <script>

> 2 // 普通函数

> 3 function sayHi() {

> 4 console.log(this);

> 5 } 6

> 7 let user = {

> 8 name: ' 小明 ',

> 9 age: 18

> 10 } 11

> 12 // 调用 bind 指定 this 的值

> 13 let sayHello = sayHi.bind(user); 14

> 15 // 调用使用 bind 创建的新函数

> 16 sayHello();

> 17 </script>

## 注：`bind` 方法创建新的函数，与原函数的唯一的变化是改变了 `this` 的值。

改变this三个方法总结：

> 1 call ： fun.call(this, arg1, arg2,......)

> 2 apply ： fun.apply(this, [arg1, arg2,......])

> 3 bind ： fun.bind(this, arg1, arg2,......)

相同点：

- 都可以用来改变this指向，第一个参数都是this指向的对象

不同点：

- call和apply：都会使函数执行，但是参数不同

- bind：不会使函数执行，参数同call

## 浅拷贝

含义：只拷贝最外面层的拷贝方式

> 1 let obj = {

> 2 uname: ' 张三丰 ',

> 3 age: 22,

> 4 sex: ' 男 ',

> 5 color: ['red', 'blue', 'yellow', 'pink'],

> 6 message: {

> 7 index: 1,

> 8 score: 99

> 9 }

> 10 }

> 11 let newObj = {};

> 12 Object.assign(newObj, obj);

> 13 console.log(obj, newObj);

## 深拷贝

## 含义：所有层都拷贝的方式

> 1 let obj = {

> 2 uname: ' 张三丰 ',

> 3 age: 22,

> 4 sex: ' 男 ',

> 5 color: ['red', 'blue', 'yellow', 'pink'],

> 6 message: {

> 7 index: 1,

> 8 score: 99

> 9 }

> 10 }

> 11 let newObj = {}; 12

> 13 function kaobei(newObj, obj) {

> 14 for (let key in obj) {

> 15 if (obj[key] instanceof Array) { // obj[key] 是数组

> 16 // obj[key] 是数组，遍历

> 17 newObj[key] = [];

> 18 kaobei(newObj[key], obj[key]);

> 19 } else if (obj[key] instanceof Object) { // obj[key] 是对象

> 20 // obj[key] 是对象，遍历

> 21 newObj[key] = {};

kaobei(newObj[key], obj[key]);

22

> 23 } else {

> 24 newObj[key] = obj[key];

> 25 }

> 26 }

> 27 }

> 28 kaobei(newObj, obj);

> 29 obj.message.score = 123;

> 30 console.log(obj, newObj);
