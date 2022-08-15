## 解析 call, apply, bind, new 的原理、使用场景及实现

### call() 和 apply()

call() 和 apply() 的第一个参数都是显式指定 this 的值，他们的区别在于，call()方法接受的是若干个参数的列表，而apply()方法接受的是一个包含多个参数的数组

使用场景主要用于：

1. 方法借用，并指定特定this指向：调用父构造函数实现继承

2. 类数组对象（Array-like Object）想要使用数组方法
```js
var domNodes = document.getElementsByTagName("*");
domNodes.unshift('h1') // TypeError: domNodes.unshift is not a function

// 改进：
var domNodesArray = Array.prototype.slice.call(domNodes)
domNodesArray.unshift('h1')
```

类数组对象有下面两个特性：
    1. 具有：指向对象元素的数字索引下标和 length 属性。
    2. 不具有：比如 push 、shift、 forEach 以及 indexOf等数组对象具有的方法


类数组对象转数组的其他方法：

```js
// 上面代码等同于
var arr = [].slice.call(arguments)

ES6:
let arr = Array.from(arguments)
let arr = [...arguments]
```

3. 验证是否是数组

```js
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]'
}
console.log(isArray([1,2,3]))

// 直接调用toString
[1,2,3].toString() // '1,2,3' 因为Array重写了toString方法，而此刻我们需要借用的是原生的toString方法。
```

### call的模拟实现：
思路：
1. 将函数设置为指定对象的属性：foo.fn = bar
2. 执行函数：foo.fn()
3. 删除函数：delete foo.fn

注意，参数的话，获取除第一个参数外的剩余参数。

```js
Function.prototype.call2 = function (context, ...rest) {
    // context是指定对象。this是调用call2的函数
    context.fn = this
    context.fn(...rest)
    delete context.fn
}
```

优化点1：
1. this 参数可以传 null 或者 undefined，此时 this 指向 window
2. this 参数可以传基本类型数据，原生的 call 会自动用 Object() 转换
3. 函数是可以有返回值的
```js
Function.prototype.call2 = function(context, ...rest) {
    // 1, 若context为null, undefined 时，context指向window
    // 2, 若context为基本类型，将其对象化。如果是对象，Object(obj)的返回值还是本身。
    context = context ? Object(context) : window
    // context是指定对象。this是调用call2的函数
    context.fn = this
    const result = context.fn(...rest)
    delete context.fn
    // 返回fn的调用返回值
    return result
}
```
优化点2：
+ 如何保证 fn 属性的唯一性？
+ 思路：首先判断 context中是否存在属性 fn，如果存在那就随机生成一个属性fnxx，然后循环查询 context对象中是否存在属性 fnxx。如果不存在则返回最终值

```js
// 写一个工厂函数：返回一个独一无二的fn
function factoryFn(context) {
    // 初始化 uniqueFn
    let uniqueFn = 'fn'
    while (context.hasOwnProperty(uniqueFn)) {
        // 循环判断并重新赋值
        uniqueFn = 'fn' + Math.random()
    }
    return uniqueFn
}

Function.prototype.call2 = function(context, ...rest) {
    // 1, 若context为null, undefined 时，context指向window
    // 2, 若context为基本类型，将其对象化。如果是对象，Object(obj)的返回值还是本身。
    context = context ? Object(context) : window
    // const fn = factoryFn(context) // add
    const fn = Symbol(); // add  ES6有一个新的基本类型Symbol，表示独一无二的值
    // context是指定对象。this是调用call2的函数
    context[fn] = this // changed
    const result = context[fn](...rest) // changed
    delete context[fn] // changed
    // 返回fn的调用返回值
    return result
}
```



### apply的模拟实现：
```js
Function.prototype.apply = function(context, arr) {
    context = context ? Object(context) : window
    context.fn = this
    let res
    if (arr && arr.length) {
        res = context.fn(...arr)
    } else {
        res = context.fn()
    }
    delete context.fn
    return res
}
```

### bind使用场景
+ 使用一：
```js
var nickname = "Kitty";
function Person(name){
    this.nickname = name;
    this.distractedGreeting = function() {

        setTimeout(function(){
            console.log("Hello, my name is " + this.nickname);
        }, 500);
    }
}
 
var person = new Person('jawil');
person.distractedGreeting(); // Hello, my name is Kitty
```
说明：
这里输出的nickname是全局的，并不是我们创建 person 时传入的参数。
因为 setTimeout 在全局环境中执行，所以 this 指向的是window。

如果想要输出为person实例中的属性nickname，该怎么做？
1. 缓存this值
2. 使用bind，绑定this
```js
var nickname = "Kitty";
function Person(name){
    this.nickname = name;
    this.distractedGreeting = function() {
        const self = this
        setTimeout(function(){
            console.log("Hello, my name is " + self.nickname);
        }, 500);
    }
}
 
var person = new Person('jawil');
person.distractedGreeting();
```
```js
var nickname = "Kitty";
function Person(name){
    this.nickname = name;
    this.distractedGreeting = function() {
        setTimeout(function(){
            console.log("Hello, my name is " + this.nickname);
        }.bind(this), 500);
    }
}
 
var person = new Person('jawil');
person.distractedGreeting();
```
+ 使用二：bind的柯里化体现
```js
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    return {
		value: this.value,
		name: name,
		age: age
    }
};

bar.call(foo, "Jack", 20); // 直接执行了函数
// {value: 1, name: "Jack", age: 20}

var bindFoo1 = bar.bind(foo, "Jack", 20); // 返回一个函数
bindFoo1();
// {value: 1, name: "Jack", age: 20}

var bindFoo2 = bar.bind(foo, "Jack"); // 返回一个函数
bindFoo2(20);
// {value: 1, name: "Jack", age: 20}
```

### 模拟实现
首先我们来实现以下四点特性：

1. 可以指定this
2. 返回一个函数
3. 可以传入参数
4. 柯里化

```js
Function.prototype.bind2 = function (context, ...rest) {
    const self = this
    // 实现第3点，因为第1个参数是指定的this,所以只截取第1个之后的参数
    const args = rest
    return function () {
        // 实现第4点，这时的arguments是指bind返回的函数传入的参数
        // 即 return function 的参数
        const bindArgs = Array.prototype.slice.call(arguments)
        return self.apply(context, args.concat(bindArgs))
    }
}
```

### new 的实现：

主要做两件事：
1. 访问到构造函数里的属性
2. 访问到原型里的属性

```js
function create() {
    // 从参数中取出构造函数
    let constructor = Array.prototype.shift.call(arguments)
    // 继承原型对象 => obj.__proto__ === constructor.prototype 为true
    const obj = Object.create(constructor.prototype)
    // 使用构造函数，其返回值可能是一个对象。
    // 传参：arguments的长度减少了一位：constructor
    const res = constructor.call(obj, arguments)
    // 返回obj
    return res instanceof Object ? res : obj 
}
```
