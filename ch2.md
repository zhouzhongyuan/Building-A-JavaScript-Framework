#面向对象的Javascript

## 简介
并不是所有的JavaScript框架都提供类。Douglas Crokford在《Classical Inheritance in JavaScript》讨论了经典的对象模型。关于JavaScript实现继承的方式，这是一个非常精彩的讨论。之后，他写了《Prototypal Inheritance in JavaScript》，他总结道：原型继承是一个足够健壮的实现继承的方式，而不需要类对象模型。
为什么JavaScript库为面向对象编程提供工具？原因是多种多样的，每个作者都有自己的答案。一些人喜欢从他们喜欢的语言中移植一个对象模型。Prototype库深受Ruby启发，提供`Class`，用来组织你自己的代码。实际上，Prototype在内部也使用`Class`。
这一章，我将说明原型继承和面向对象，在JavaScript中为面向对象创建一个类。这将被我的框架turing.js使用。
### 对象和类 vs 原型类
一切都是…对象。一个语言把任何东西看成对象，数字是对象，字符串是对象，类的定义是对象，实例化的类是对象。类和对象之间的区别非常有趣，这些语言把**类**看成**对象**，却用更基础的对象模型来实现**类**。请记住，这是面向对象编程，而不是面向类编程。
这意味着JavaScript需要经典的类？如果你是一个Java或者Ruby程序员，你可能会对JavaScript没有`Class`关键字很惊讶。没关系！果我们需要它们， 我们可以自己创建。
### 原型类
原型类形如：
```JavaScript
function Vector(x, y) {
    this.x = x;
    this.y = y;
}
Vector.prototype.toString= function () {
    return 'x: ' + this.x + ', y: '+ this.y;
}
v = new Vector(1, 2);
// x: 1, y: 2
```
如果你对JavaScript的对象模型不熟悉，前几行代码可能看起来有点奇怪。我定义了一个函数`Vector`，然后通过`new Vector()`调用了它。这个段代码之所以能够运行是因为，`new`创建了一个新的对象，`Vector`被执行，`this`被设到了这个新的对象。
实例的方法放在`prototype`属性中。这意味着，如果你实例化了一个`Vector`，然后在`prototype`属性中添加一个新的方法，旧的`Vector`实例也将获得这个新的方法。震惊吗？
```JavaScript
Vector.prototype.add = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
}
v.add(new Vector(5, 5));
// x: 6, y: 7
```
### 原型继承
JavaScript中没有官方的实现继承的方式。如果想要通过继承`Vector`创建一个`point`类，代码如下：
```JavaScript
Vector.prototype.add = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
}
v.add(new Vector(5, 5));
// x: 6, y: 7


function Point(x, y, colour) {
    Vector.apply(this, arguments);
    this.colour = colour;
}
Point.prototype = new Vector();
Point.prototype.constructor = Point;

p = new Point(1, 2, 'red');
p.colour;
// red
p.x;
// 1
```
通过使用`apply`，`Point`能够调用`Vectot`的构造函数。你可能会奇怪`prototype.constructor`怎么来的。这是一个属性，允许你指定创建对象原型的函数。
当你创建自己的对象时，你也能从Object获得一些方法，例如`toString`、`hasOwnProperty`。

```JavaScript
p.hasOwnProperty('colour');
// true
```

### 原型 vs 经典的
处理原型继承有很多模式。For this reason it’s useful to abstract it, and offer extra features beyond what JavaScript has as standard为类定义一个API使得代码更加简单，并能使读者更容易查看你的代码。
事实上，JavaScript的对象模型把类分割成不同的部分使得代码视觉上有点杂乱。把整个类包装起来可能更好一点。由于这是一个研究学习型矿建，以离散和可读的块包装类可能是有益的。

### 一个类模型设计实现
上一个例子在Prototype框架，代码如下
```JavaSvript
Vector = Class.create({
    initialize: function (x, y) {
        this.x = x;
        this.y = y;
    },
    toString: function () {
        return 'x: ' + this.x + ', y: ' + this.y;
    }
});
Point = Class.create(Vector, {
    initialize: function ($super, x, y, colour) {
        $super(x, y);
        this.colour = colour;
    }
});
```
让我们创建一个简化版的，使得我们能够在将来能够扩展它。我们需要：
- 1. 使用`new`方法，通过复制，扩展类；
- 2. `Class`创建：使用`apply`和`prototype.constructor`执行构造函数；
- 3. 判断一个父类能否被继承；
- 4. 混合(Mixins)。

### 扩展

你会发发现`extend`贯穿整个Prototype框架。它做的所有工作就是把方法从一个`prototype`复制到另一个。这是一个真正了解原型如何被操纵的好方法-它就像你认为的那样简单。
`extend`的本质如下：
```JavaScript
for (var property in source)
    destination[property] = source[property];
```

### 类创建

## 深入“类”
### 语法糖 * Extend === Mixin
## 总结