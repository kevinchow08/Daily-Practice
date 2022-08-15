## 异步编程的解决方案之一：Generator函数

### 引子：谈谈for in 和 for of

简单理解：for in遍历的是数组的索引（即键名），而for of遍历的是数组元素值

for in: 
1. 循环只遍历可枚举属性（包括它的原型链上的可枚举属性）
2. index索引为字符串型数字，不能直接进行几何运算

问题：用for in遍历对象如何剔除原型属性？
```js
for (let key in source) {
    if (source.hasOwnProperty(key)) {
     // do something...   
    }
}
```

for of:
1. for of在可迭代对象（包括 Array，Map，Set，String，TypedArray，arguments 对象等等）上创建一个迭代循环。 
2. for of不支持遍历普通对象，可通过与Object.keys()搭配使用遍历产生由对象自身可枚举属性组成的数组，但不能遍历出原型链上的属性。
3. for of遍历后的输出结果为元素的值；

### 为什么for of不能遍历普通对象？

因为普通对象没有实现迭代器Iterator接口:

描述：如果一个js对象想要能被迭代，那么这个对象或者其原型链对象必须要有一个Symbol.iterator的属性，这个属性是一个无参函数。它返回一个符合迭代器协议的对象。
```js
typeof Array.prototype[Symbol.iterator] === 'function'  // true
typeof Array.prototype[Symbol.iterator]() === 'object'  // true
```

// eg：
```js
const io = [1,2,3][Symbol.iterator]()

io.next()
// Object { value: 1, done: false }

io.next()
// Object { value: 2, done: false }

io.next()
// Object { value: 3, done: false }

io.next()
// Object { value: undefined, done: true }
```

+ Array, String, Map, Set 还有arguments, DOM List...这些类数组对象都是可迭代的. 而他们拥有的属性Simbol.iterator, 此属性方法调用 会产生一个符合迭代器协议的对象。
+ 能够被for...of正常遍历的，都需要实现一个迭代器Iterator，而数组、字符串、Set、Map结构，早就内置好了Iterator（迭代器）。Object对象并没有实现这个接口，使得它无法被for...of遍历



### 再说迭代器
1. 迭代器协议规定，任意对象只要部署了next方法，就可以作为迭代器。
2. next方法必须返回一个包含value和done两个属性的对象。其中，value属性当前遍历位置的值，done属性是一个布尔值，表示遍历是否结束。

```js
// 实现一个数组的迭代器接口
function makeIterator(arry) {
    let i = 0
    return {
        next: function () {
            return i < arry.length ? {
                value: arry[i++],
                done: false
            } : {
                value: undefined,
                done: true
            }
        }
    }
}

var it = makeIterator([1,2,3])
// 相当于 var it = [1,2,3][Symbol.iterator]()

it.next()
// Object { value: 1, done: false }

it.next()
// Object { value: 2, done: false }

it.next()
// Object { value: 3, done: false }

it.next()
// Object { value: undefined, done: true }
```

问题：那么普通对象如何强行使用for of遍历(不报错)？

```js
// a 实现迭代器
obj[Symbol.iterator] = function(){
    let keys = Object.keys(this)
    let count = 0
    return {
        next() {
            if (count < keys.length) {
               return {
                   value: this[keys[count++]],
                   done: false
               } 
            } else {
                return {
                    value: undefined,
                    done: true
                }
            }
        }
    }
}
// b 编一个生成器函数：看之后的讲解。
obj[Symbol.iterator] = function* () {
    let keys = Object.keys(this)
    for (let key of keys) {
        yield [key, this[key]]
    }
}
for (let [key, value] of obj) {
    console.log(key, value)
}
```


### Generator函数-生成迭代器的函数

执行过程如下：
+ 当调用Generator函数的时候，该函数并不执行，而是返回一个迭代器（可以理解成暂停执行）
+ 以后，每次调用这个迭代器的next方法，就从函数体的头部或者上一次停下来的地方开始执行（可以理解成恢复执行），直到遇到下一个yield语句为止，并返回该yield后面的那个表达式的值，然后暂停执行。 下一次从该位置继续向后执行
+ ECMAScript 6草案定义的Generator函数，需要在function关键字后面，加一个星号。然后，函数内部使用yield语句，定义迭代器的每个成员。

```js
function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
}

var hw = helloWorldGenerator()
```

+ generator函数执行总结：
**其实是使用yield语句暂停执行它后面的操作，当调用next方法时，再继续往下执行，直到遇到下一个yield语句，并返回该语句的值，如果直到运行结束**

+ 注意：
    + yield表达式本身没有返回值，或者说总是返回undefined。**如果next方法带一个参数，该参数就会被当作上一个yield语句的返回值**。
    + 所以，next 方法返回值的 value 属性，是 Generator 函数向外输出数据（即：yield前表达式的值）；next 方法接受的参数，这是向 Generator 函数体内输入数据。
    + 由于next方法的参数表示上一个yield表达式的返回值，所以在第一次使用next方法时，传递参数是无效的。只有从第二次使用next方法开始，参数才是有效的。
    + 从语义上讲，第一个next方法用来启动遍历器对象，所以不用带有参数



```js
function* createIterator() {
    let first = yield 1
    console.log(first)
    let second = yield first + 2
    let third = yield second + 3
}
let ci = createIterator()

ci.next() // {value: 1, done: false}
ci.next(4) // first被赋值参数4，所以打印4。此次next() 返回值为{ value: 6, done: false }
ci.next(5) // second被赋值5，此次next() 返回值{ value: 8, done: false }
ci.next() // 此次next() 返回值{ value: undefined, done: true }
```

eg: 下面是利用for…of语句，对斐波那契数列的另一种实现。

```js
function* fibonacci() {
    let [prev, curr] = [0, 1];
    while(true) {
        [prev, curr] = [curr, prev + curr];
        yield curr;
    }
}

for (let n of fibonacci()) {
    if (n > 1000) break;
    console.log(n);
}
```

说明：从上面代码可见，使用for…of语句时不需要使用next方法。
+ 为什么生成器函数执行后的迭代器对象可以直接被for of遍历，它是否有Symbol.iterator属性？
+ **Generator 函数执行后，返回一个遍历器对象。该对象本身也具有Symbol.iterator属性，执行后返回自身。**

```js
function* gen(){
  // some code
}

var g = gen(); //迭代器对象

g[Symbol.iterator]() === g // true

function* foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
}

for (let v of foo()) {
    console.log(v);
}
```

说明：
+ 上面代码使用for...of循环，依次显示 5 个yield表达式的值。
+ 一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象。
+ 所以上面代码的return语句返回的6，不包括在for...of循环之中。

### 聊到异步

+ Generator函数的这种暂停执行的效果，意味着可以把异步操作写在yield语句里面，等到调用next方法时再往后执行。 这实际上等同于不需要写回调函数了，因为异步操作的后续操作可以放在yield语句下面，反正要等到调用next方法时再执行。
+ 所以，Generator函数的一个重要实际意义就是用来处理异步操作，改写回调函数。 换言之，Generator的作用是帮助我们来控制异步代码的执行顺序。

```js
function* loadUI() {
	showLoadingScreen();
	yield loadUIDataAsynchronously();
	hideLoadingScreen();
}
```

说明：
+ 上面代码表示，第一次调用loadUI函数时，该函数不会执行，仅返回一个迭代器。
+ 下一次对该迭代器调用next方法，则会显示登录窗口，并且异步加载数据。
+ 再一次使用next方法，则会隐藏登录窗口。可以看到，这种写法的好处是所有登录窗口的逻辑，都被封装在一个函数，按部就班非常清晰。

再看一个具体的例子：

```js
var fetch = require('node-fetch')

// 封装异步操作，该操作先读取一个远程接口，然后从 JSON 格式的数据解析信息。
// 就像前面说过的，这段代码非常像同步操作，除了加上了yield命令。
function* gen() {
    var url = 'https://api.github.com/users/github'
    var result = yield fetch(url)
    console.log(result.bio)
}
// 生成迭代器
var g = gen()
// 启动执行
var result = g.next()

result.value.then((data) => {
    return data.json()
}).then((data) => {
    // 此处data赋值给gen函数中的reuslt变量，将执行权交给gen函数。
    g.next(data)
})
```

总结：
+ Fetch模块返回的是一个 Promise 对象，因此要用then方法调用下一个next方法。
+ 可以看到，虽然 Generator 函数将异步操作表示得很简洁，但是流程管理却不方便


### Thunk 函数：自动执行 Generator 函数的一种方法。

先谈谈求值策略：传值调用和传名调用
```js
var x = 1;

function f(m) {
  return m * 2;
}

f(x + 5) // f(x + 5)  <=> f(6)
```
说明：
+ 传值调用(call by value)，即在进入函数体之前，就计算x + 5的值（等于 6）
+ 传名调用(call by name)，即直接将表达式x + 5传入函数体，只在用到它的时候求值： `f(x + 5) <=> (x + 5) * 2`

缺点: 传值调用比较简单，但是对参数求值的时候，实际上还没用到这个参数，有可能造成性能损失
eg:
```js
var x = 1;
function f(a, b){
    return b;
}

f(3 * x * x - 2 * x - 1, x);
// 函数f的第一个参数是一个复杂的表达式，但是函数体内根本没用到。对这个参数求值，实际上是不必要的.
```


#### Thunk 函数

编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。
而Js语言的Thunk 函数含义有所不同，Thunk 函数替换的不是表达式，而是多参数函数，**将其替换成一个只接受回调函数作为参数的单参数函数**

// eg:
```js
// 正常版本的readFile（多参数版本）
// fs模块的readFile方法是一个多参数函数，两个参数分别为文件名和回调函数。
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var Thunk = function(fileName) {
    return function (cb) {
        fs.readFile(fileName,cb)
    }
}

var readFileThunk = Thunk(fileName)
// 经过转换器处理，它变成了一个单参数函数，只接受回调函数作为参数。这个单参数版本，就叫做 Thunk 函数
readFileThunk(callback)
```

对上面的eg在进行优化，提出fs.readFile。就是一个简单的Thunk函数实现
```js
const Thunk = function(fn) {
    return function(...args) {
        return function(callback) {
            args.push(callback)
            return fn.apply(this, args)
        }
    }
}
// 使用上面的转换器，生成fs.readFile的 Thunk 函数。
var readFileThunk = Thunk(fs.readFile)
readFileThunk(fileA)(callback)
```
总结：Thunk函数在JS里的应用：将多参的异步函数，转成一个只接受回调函数作为参数的单参数函数

目前，Thunk 函数现在可以用于 Generator 函数的自动流程管理。

```js
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFileThunk('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFileThunk('/etc/shells');
  console.log(r2.toString());
}

// 为了便于理解，先手动执行此gen函数
var g = gen()
var R1 = g.next()

R1.value(function(err, data) {
    if(err) throw err
    var R2 = g.next(data)
    R2.value(function(err, data) {
        if(err) throw err
        g.next(data)
    })
})
```
+ 上面代码中，yield命令用于将程序的执行权移出 Generator 函数, 而g.next()相当于讲执行权交还给Generator函数
+ 变量g是 Generator 函数的内部指针，next()负责将指针移动到下一步，并返回该步的信息（value属性和done属性）
+ 可以发现 Generator 函数的执行过程，其实是将同一个回调函数，反复传入next方法返回的value属性。这使得我们可以用递归来自动完成这个过程。

```js
// 写一个自执行器：
function* g() {
    // ...code
}
function run(fn) {
    var g = fn()
    var next = function(err, data) {
        if(err) throw err
        var result = g.next(data)
        if(result.done) return;
        result.value(next)
    }
    next();
}
// 自执行
run(g);
```


#### co模块：自动执行 Generator 函数的另一种方法。

```js
// 下面是一个 Generator 函数，用于依次读取两个文件。
var gen = function* () {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
// co 模块可以让你不用编写 Generator 函数的执行器。
var co = require('co');
co(gen);
// 上面代码中，Generator 函数只要传入co函数，就会自动执行。

// 同时，co函数返回一个Promise对象，因此可以用then方法添加回调函数。等到 Generator 函数执行结束，就会输出一行提示。
co(gen).then(function (){
    console.log('Generator 函数执行完成');
});
```

为什么 co 可以自动执行 Generator 函数？
前面说过: Generator 就是一个异步操作的容器。它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权。 以下两种方法可以做到这一点。
1. 回调函数。将异步操作包装成 Thunk 函数，在回调函数里面通过g.next(data)交回执行权。
2. Promise 对象。将异步操作包装成 Promise 对象，在then方法进行g.next(data)交回执行权。

```js
// 基于 Promise 对象的自动执行：
// 首先，把fs模块的readFile方法包装成一个 Promise 对象。
var fs = require('fs');
var readFile = function(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, function(err, data) {
            if(err) { reject(err) }
            resolve(data)
        })
    })
}

var gen = function* (){
    // ...code
};

// 再写一个run函数
function run(fn) {
    var g = fn()
    var next = function(data) {
        var result = g.next(data)
        if(result.done) return result.value;
        result.value.then(function(data) {
            next(data)
        })
    }
    next()
}

run(gen)
```

再来看看co的源码，就是上面执行器的扩展。截取片断进行分析。
```js
function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.call(ctx);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();
    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }
  });
}

function next(ret) {
    if (ret.done) return resolve(ret.value);
    var value = toPromise.call(ctx, ret.value);
    if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
    return onRejected(
      new TypeError(
        'You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "'
        + String(ret.value)
        + '"'
      )
    );
  }
```

分析：
+ 首先，co 函数接受 Generator 函数作为参数，返回一个 Promise 对象。
+ 在返回的 Promise 对象里面，co 先检查参数gen是否为 Generator 函数。如果是，就执行该函数，得到一个内部指针对象； 如果不是就返回，并将 Promise 对象的状态改为resolved。
+ 接着，co 将 Generator 函数的内部指针对象的next方法，包装成onFulfilled函数。这主要是为了能够捕捉抛出的错误。
+ 最后，就是关键的next函数，它会反复调用自身。
上面代码中，next函数的内部代码，一共只有四行命令。
1. 检查当前是否为 Generator 函数的最后一步，如果是就返回。
2. 确保每一步的返回值，是 Promise 对象。
3. 使用then方法，为返回值加上回调函数，然后通过onFulfilled函数再次调用next函数。
4. 在参数不符合要求的情况下（参数非 Thunk 函数和 Promise 对象），将 Promise 对象的状态改为rejected，从而终止执行

