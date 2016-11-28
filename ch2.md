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

`create`用来创建类。它需要一些设置使得它能够被继承，就像上面的例子一样。
```JavaScript
create: function(methods) {
    var klass = function(){
        this.initialize.apply(this, arguments);
    }
    // Copy the passed in methods
    extend(klass.prototype, methods);
    
    // Set the constructor
    klass.prototype.constructor = klass;
    
    // If there's no initialize method, set an empty one
    if(!klass.prototype.initialize){
        klass.prototype.initialize = function(){};
    }
    return klass;
}

```
## 深入“类”
`initialize`意味着，当set up 类的时候调用此方法。Turing的`Class.create`方法set up 类。在set up期间，它定义了一个方法，此方法在类实例化时被调用。所以当你调用`new`，它将会实例化。后面的非常简单:
```JavaScript
create : function () {
    var methods = null,
        parent = undefined,
        klass = function () {
            this.initialize.apply(this, arguments);
        };
        ……
```
有时，我感觉`apply`非常神奇，但是他不是真的神奇——它并没有对你隐藏太多。在这种情况下，它只是使用提供的参数，调用你的`initialize`方法against 新创建的类。`arguments`看起来也很神奇…，但是它只是值所有的参数。
由于我已经做了个一个约定——所有的对象都有`initialize`方法——我们需要定义一个以防类没有制定`initialize`方法。

```JavaScript
if(!klass.prototype.initialize){
    klass.prototype.initialize = function(){};
}
```
### 语法糖 * Extend === Mixin
把其他对象的prototype复制到我们的类中将会是一个很酷的功能。Ruby就会这样做，并且我发现它很有用。语法看起来像这样：
```JavaScript
var MixinUser = turing.Class({
    include: User,
    initialize: function (log) {
        this.log = log;
    }
});
```
混合应该准遵循下列规则，使得组合的对象结构清晰：
- 1. 方法应该从制定的类中被包含；×××
- 2. `initialize`方法不能被覆盖；
- 3. 参数可能包含多个参数。

Since our classes are being run through `turing.oo.create`, we can easily look for an `include` property
and include methods as required. Rather than including the bulk of this code in `create`, it should be in
another `mixin` method in `turing.oo to` keep create readable.

为了适应这些规则，单元测试的伪代码如下：
```JavaScript
mixin: function(klass, things) {
    if "there are some vliad this" {
        "use turing.oo.extend to copy the methods over"
    } else if "this things are an array" {
        for "each class in the array" {
            "use turing.oo.extend to copy the methods over"
        }
    }
}
```
### `super`
我们需要能够继承自一个类，调用我们想要覆盖的方法。给了一个`User`类，我们可以继承它创建一个`SuperUser`
```JavaScript
var User = turing.Class({
    initialize: function (name, age) {
        this.name = name;
        this.age  = age;
    },
    login: function () {
        return true;
    },
    toString: function () {
        return "name: " + this.name + ", age: " + this.age;
    }
});

var SuperUser = turing.Class(User, {
    initialize:function () {
        // Somehow call the parent's initialize
    }
});
```
单元测试，判断`User`的`initialize`是否被调用：
```JavaScript
given('an inherited class that uses super', function () {
    var superUser = new SuperUser('Zhongyuan', 26);
    should('have run super()', superUser.age).equals(26);
});
```
如果我执行这个单元测试，没有事`super`的实现，我将得到：

```
Given an inherited class that uses super
- should have run super(): 104 does not equal: undefined
```
为了解决这个问题，我们需要调用原来定义的方法。使用`apply`
```JavaScript
var SuperUser = turing.Class(User, {
    initialize:function () {
        User.prototype.initialize.apply(this, arguments);
    }
});

```
上段代码也不够完美。大部分语言为调用者实现了`super`——强制使用者使用`apply`是不明智的。一种解决方法就是使得父类的prototype可以被获得，并且添加一个`super`方法。这个`super`方法能否简单的使用`apply`。副作用就是你不得不制定方法的名称：
```JavaScript
var SuperUser = turing.Class(User, {
    initialize:function () {
        this.$super('initialize', arguments);
    },
    toString: function () {
        return "SuperUser: " + this.$super('toString');
    }
});
```
这个一个简单、轻量、易于理解的方法。方法名称可以通过其他方式推断，但是这超出了本书所要讲的内容。

## 总结
现在，我们创建了一个简单的、可读的面向对象的类。这将使得我们可以用可复用的方式架构Turing的其他部分。我希望最近的这两个例子为你展示了：JavaScript的简单型允许你定义你自己你的行为，就行基础语言特征。
