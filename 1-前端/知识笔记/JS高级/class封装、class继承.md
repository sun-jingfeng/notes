# class 封装、class 继承

## class——封装

## 文档：类

class（类）是ECMAScript6中新增的关键字，专门用于创建类的，类可被用于实现逻辑的封装。

1 <script> 2 // 创建类 3 class Person { 4 // 此处编写封装逻辑 5 } 6 7 // 实例化 8 let p1 = new Person(); 9 console.log(p1); 10 </script>

## 实例成员

1 <script> 2 // 创建类 3 class Person { 4 // 实例属性 ' ' 5 name = 小明 ; 6 7 // 实例方法 8 sleep () { 9 console.log('sleeping...') 10 } 11 } 12 13 // 实例化 14 let p1 = new Person(); 15 p1.sleep(); 16 </script>

## 总结：

- 关键字 `class` 封装了所有的实例属性和方法

- 类中封装的并不是变量和函数，因此不能使用关键字 `let`、`const` 或 `var`

静态成员

> 1 <script>

> 2 // 创建类

> 3 class Person {

> 4 // 静态属性

> 5 static version = '1.0.0'; 6

> 7 // 静态方法

> 8 static getVersion = function () {

> 9 console.log(this.version);

> 10 }

> 11 } 12

> 13 // 静态方法直接访问

> 14 console.log(Person.version);

> 15 Person.getVersion();

> 16 </script>

## 总结：

- `static` 关键字用于声明静态属性和方法

- 静态属性和方法直接通过类名进行访问

## 构造函数

- 创建类时在类的内部有一个特定的方法 `constructor` ，该方法会在类被实例化时自动被调用，常被用于处 一

- 理 些初始化的操作。

> 1 <script>

> 2 class Person {

> 3 // 实例化时 立即执行

> 4 constructor (name, age) {

> 5 this.name = name;

> 6 this.age = age;

> 7 }

> 8 // 实例方法

> 9 walk () {

> 10 console.log(this.name + ' 正在走路 ...');

> 11 }

> 12 } 13

> 14 // 实例化

> 15 let p1 = new Person(' 小明 ', 18);

> 16 p1.walk();

> 17 </script>

## 总结：

- `constructor` 是类中固定的方法名

- `constructor` 方法在实例化时立即执行

- `constructor` 方法接收实例化时传入的参数

- `constructor` 并非是类中必须要存在的方法

## class——继承

extends

`extends` 是 ECMAScript 6 中实现继承的简洁语法，代码如下所示：

> 1 <script>

> 2 class Person {

> 3 // 父类的属性

> 4 legs = 2;

> 5 arms = 2;

> 6 eyes = 2;

> 7 // 父类的方法

> 8 walk () {

> 9 console.log(' 人类都会走路 ...');

> 10 }

> 11 // 父类的方法

> 12 sleep () {

> 13 console.log(' 人都得要睡觉 ...');

> 14 }

> 15 } 16

> 17 // Chinese 继承了 Person 的所有特征

> 18 class Chinese extends Person {} 19

> 20 // 实例化

> 21 let c1 = new Chinese();

> 22 c1.walk();

> 23 </script>

如上代码所示 `extends` 是专门用于实现继承的语法关键字，`Person` 称为父类、`Chinese` 称为子类。

super

文档：super

- 说明

   - 在子类中，作为【父类】或【父类原型】的引用

   - 具体引用的是哪个，取决于使用super的环境

用法

- 子类的构造函数中，引用的是【父类】

> 1 class Person {

> 2 constructor(name, age) {

> 3 this.name = name

> 4 this.age = age

> 5 }

> 6 } 7

> 8 class English extends Person {

> 9 constructor(name, age) {

> 10 // this.name // 会报错：访问派生类的构造函数中的 "this" 前，必须调用 "super"

> 11 super(name, age) // 派生类的构造函数必须包含 "super" 调用

> 12 }

> 13 }

子类的静态属性、静态方法中，引用的是【父类】

> 1 class Rectangle {

> 2 static baseStaticField = 90

> 3 static logNbSides() {

> 4 return 'I have 4 sides'

> 5 }

> 6 } 7

> 8 class Square extends Rectangle {

> 9 static extendedStaticField = super.baseStaticField

> 10 static logDescription() {

> 11 return `${super.logNbSides()} which are all equal`

> 12 }

> 13 } 14

> 15 console.log(Square.extendedStaticField) // 90

> 16 console.log(Square.logDescription()) // 'I have 4 sides which are all equal'

子类的实例属性、实例方法中，引用的是【父类原型】。但只可调用父类的实例方法，不可取值父类 的实例属性。

> 1 class Base {

> 2 baseMethod() {

> 3 return 10

> 4 }

> 5 }

> 6 class Extended extends Base {

> 7 extendedField = super.baseMethod()

> 8 instanceFn(){

> 9 return super.baseMethod()

> 10 }

> 11 } 12

> 13 console.log(new Extended().extendedField) // 10

> 14 console.log(new Extended().instanceFn()) // 10

## 总结

1

class Mouse extends Animal {

> 2 constructor(){

> 3 super() // super 引用【父类】

> 4 }

> 5 static staticProp // super 引用【父类】

> 6 static staticFn(){

> 7 // super 引用【父类】

> 8 }

> 9 instanceProp // super 引用【父类原型】

> 10 instanceFn(){

> 11 // super 引用【父类原型】

> 12 }

> 13 }
