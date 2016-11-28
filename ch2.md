#面向对象的Javascript

## 简介
并不是所有的JavaScript框架都提供类。Douglas Crokford在《Classical Inheritance in JavaScript》讨论了经典的对象模型。关于JavaScript实现继承的方式，这是一个非常精彩的讨论。之后，他写了《Prototypal Inheritance in JavaScript》，他总结道：原型继承是一个足够健壮的实现继承的方式，而不需要类对象模型。
为什么JavaScript库为面向对象编程提供工具？原因是多种多样的，每个作者都有自己的答案。一些人喜欢从他们喜欢的语言中移植一个对象模型。Prototype库深受Ruby启发，提供`Class`，用来组织你自己的代码。实际上，Prototype在内部也使用`Class`。
这一章，我将说明原型继承和面向对象，在JavaScript中为面向对象创建一个类。这将被我的框架turing.js使用。
### 对象和类 vs 原型类
### 原型类
### 原型继承
### 原型 vs 类
### 一个类模型设计实现
### 扩展
### 类创建

## 深入“类”
### 语法糖 * Extend === Mixin
## 总结