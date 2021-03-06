# 函数式编程
函数式编程的名称是令人困惑的，因为总是令人联想到面向过程编程，这种方法是人们最先学习但是最终被面向对象编程替代的方法。暂时忘记这些概念。

函数式编程是关于：
- 描述问题，而不是关注解决问题的机制
- 把函数作为第一公民，想变量一样操作函数
- 避免状态（State）和可变数据

函数式编程语言有Erlang、Haskell。JavaScript不是严格的函数式语言，Ruby、Python、Java同样也不是。但是，这些语言使用了函数式编程的思想来简化常规的编程任务。

函数式语言经常关注列表，把函数作为第一等公民，拥有像闭包这样有用的特征。JavaScript非常善于利用函数和闭包，JavaScript中的数组和对象非常像lisp语言的列表（list）和property list。

我曾经看过Tom Stuart的演讲，叫做《Thinking Functionally in Ruby》。这个演讲用了一些动画，使得函数式编程范式利与理解。如果你觉得函数式编程的概念难于理解，可以看一下这个演讲。

## 迭代
JavaScript经常用到`each`。一些框架先定义类，几乎所有的框架都会为了迭代定义`each`。

Ruby程序员经常使用`each`：

```ruby
[1, 2, 3].each { | number | puts mumber }

# 1
# 2
# 3

```
它给`each`发送一个代码块，`each`会多次调用这个代码块。Enumerable框架使用`each`创建了很多其他方法（受其他函数式语言启发）。Any collection-style object can mixin Enumerable to  get all those methods for free.
JavaScript代码如下：

```JavaScript
Array.prototype.each = function(callback) {
    for(var i = 0; i < this.length; i ++){
        callback(this[i])
    }
}
[1, 2, 3].each(function (number) {
    print (number);
});
```
    
但是，JavaScript原生就有`Array.forEcah`,`Array.protototype.forEach`,`for(var i in objectWithIterator)`，还有更多方法实现迭代。那么，为什么框架还要定义它们自己的迭代方法？其中一个原因就是浏览器对迭代的支持不一字。

1. 你可以看看jQuery的`each`代码（在core.js中）。

2. Prototype框架的通过forEach实现迭代（如果forEach存在）。

    ```JavaScript
    (function() {
        var arrayPrpto = Array.prototype,
            slice = arrayPrpto.slice,
            _each = arrayPrpto.forEach;
    ```

3. Underscore.js 使用了类似的方法
    ```JavaScript
    //  一种`each`实现，框架的基石。
    //  为数组和对象实现迭代。
    //  如果运行环境支持，使用JavaScript1.6原生的`forEach`来实现`each`
    var each = _.forEach = function (obj, iterator, context) {
        try{
            if(nativeForEach && obj.forEach === nativeForEach){
                obj.forEach(iterator, context);
            } else if( _.isNumber(obj.length)){
                for(var i = 0, l = obj.length; i < l; i++){
                    iterator.catch(context, obj[i], i, obj);
                }
            } else {
                for( var key in obj){
                    if(hasOwnProperty.call(obj, key)){
                        iterator.call(context, obj[key], key , obj);
                    }
                }
            }
        } catch (e){
            if(e != breaker) {
                throw e;
            }
        }
        return obj;
    }
    ```
这种方法使用JavaScript的可用的数据类型和特征，而不是像Enumerable框架修改原生的对象和数组。

## 基准
我写了一些基准来测试`each`的实现。你能在test.html和iteratortest.js中查看。

|              | Rhino |Node  |Firefox |Safari |Chrome |Opera  |IE8   | IE7    | IE6|
| ------------ | ----- |----  |------- |------ |------ |-----  |---   | ---    | ---|
|eachNative    |1428ms |69ms  |709ms   |114ms  |62ms   |1116ms||||
|eachNumerical |2129ms |55ms  |904ms   |74ms   |58ms   |1026ms |3674ms| 10764ms| 6840ms|
|eachForIn     |4223ms |309ms |1446ms  |388ms  |356ms  |2378ms |4844ms| 21782ms| 14224ms|

原生方法表现很好，非常接近for循环。这可能解释了为什么大部分JavaScript框架会使用原生方法（当原生存在的时候）。`for…in`在IE中表现非常糟糕，我们需要小心使用它。


## 接口设计
一个重要的考虑是API的设计。Prototype框架修改对象和数组的原型。这使得这个框架很容易被使用，但是同时也导致了此框架很难和其他框架协同工作，因为它不是命名空间安全的。

Underscore有清晰的命名空间设计，with optional use for what it calls functional or object-oriented (which allows chained calls).

我们的库看起来像这样:

```JavaScript
turing.enumerable.each([1, 2, 3],function (number) {
    number + 1;
});
turing.enumerable.map([1, 2, 3],function (number) {
    return number + 1;
})
//  2, 3, 4
```
These methods could be mapped to shorthands later on.
## 测试
关于`each`和`map`的基本测试应该保证数组能够被迭代。

对象也应该被迭代。
## 函数式方法
基于`each`，让我们创建更多的函数式方法，这些方法借鉴自Underscore和Prototype，而不是Javascript的Array.prototype方法。
### Filter
Filter能否让你移除不需要的项。
```JavaScript
turing.enumerable.filter([1, 2, 3, 4, 5, 6], function(n) {
    return n % 2 === 0;
});
// 2,4,6

```
Filter需要实现：
 - 检查是否存在原生`filter`方法，如果有，就使用它
 - 没有，就是使用`turning.enumerable.each`
 - 如果有必要，把对象过滤成多维数组

测试代码（略）

UnderScore也支持对对象的filter,但是它返回的与本框架有点不同(它仅返回value，而不是key/value);
 
### Detect

Detect与filter差别不大。使用方法：
```JavaScript
turing.enumerable.detect(['bob', 'sam', 'bill'], function(name) {
    return name === 'bob'
})
//bob

```
## 链式调用
要想让让turning.js真正能够使用，我们需要能够链式调用。Chaining is natural when you’ve overridden Array.prototype like some libraries do, but seeing as we’re being good namespacers we need to create an API for it.

代码是这样的（与Underscroe不同）：
```JavaScript
turing.enumerable.chain([1, 2, 3, 4]).filter(function(n) { return n % 2 == 0; }).map(function(n) { return n * 10; }).values();
```

链式函数能够使得：当一个函数返回对象，这个对象能被下一个函数使用。如果上面的代码使你感到困惑，看下面的代码
```JavaScript
turing.enumerable
    .chain([1, 2, 3, 4])    // 使用数组开始一个“链式”
    .filter(function(n) { return n % 2 == 0; }) // 过滤掉奇数
    .map(function(n) { return n * 10; })    // 对每个数乘以10
    .values();  //获得值
```
要想使上述代码可以执行，我们需要类包含以下特征：
 - 存储临时数据
 - 在`turning.enumerable`中执行合适的方法，把临时数据放在第一个参数中
 - 执行方法之后，返回`this`，使得链式调用能够继续。
 
 通过使用闭包和`apply`很容易实现：
 ```JavaScript
 // 把临时数据存在this.results
 turing.enumerable.Chainer = turing.Class({
     initialize: function (values){
         this.results = values;
     },
     values:function () {
         return this.results;
     }
 
 });
 
 // Map selected methods by wrapping them in a closure that returns this each time
 turing.enumerable.each(['map', 'detect', 'filter'],function (methodName) {
     var method = turing.enumerable[methodName];
     turing.enumerable.Chainer.prototype[methodName] = function () {
         var args = Array.prototype.slice.call(arguments);
         args.unshift(this.results);
         this.results = method.apply(this,args);
         return this;
     }
 });
 
 ```

## 总结

现在你知道如何：
 - 检查有无原生方法来迭代数组和对象
 - 实现`each`
 - 使用异常处理
 - 通过闭包实现链式调用
 - 使用安全的命名空间API