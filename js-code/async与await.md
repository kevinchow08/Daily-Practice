## 异步编程的解决方案之一： Async/Await

async 函数是什么？
**一句话，async 函数就是 Generator 函数的语法糖。**

eg:
```js
var fs = require('fs');

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
// 注意：此时gen函数没有自执行。
```

写成 async 函数，就是下面这样。

```js
var asyncReadFile = async function (){
    var f1 = await readFile('/etc/fstab');
    var f2 = await readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};
```
一比较就会发现:
+ async 函数就是将 Generator 函数的星号（*）替换成 async，将 yield 替换成 await，仅此而已。
+ 但是async函数调用可以自执行其中的异步操作。

### async 函数的优缺点：
async 函数对 Generator 函数的改进，体现在以下三点：

+ 内置执行器。 Generator 函数的执行必须靠执行器，所以才有了 co 函数库，而 async 函数自带执行器。
+ 更好的语义
+ 更广的适用性。 co 函数库约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以跟 Promise 对象和原始类型的值
+ 滥用 await 可能会导致性能问题，因为 await 会阻塞代码，也许之后的异步代码并不依赖于前者，但仍然需要等待前者完成，导致代码失去了并发性。
### async 函数的实现
```js
var gen = function* (){
// ...code
};
run(gen)
function run(gen) {
   var g = gen
   function next(data){
       // result是一个promise
       let result = g.next(data)
        if (result.done) return result.value
        result.value.then(data => {
            next(data)
        })
    }
    next()
}
```

### async 函数的用法

+ 同 Generator 函数一样，async 函数返回一个 Promise 对象，可以使用 then 方法添加回调函数。
+ 当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再接着执行函数体内后面的语句。
+ await之后一般跟promise来表示等待异步操作，await语句赋值给的变量是promise.resolve的参数值。如果是基本类型，可以理解将其包装为promise的形式。

需求1. 指定时间内输出一个值（写一个睡眠函数）
```js
function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration)
    })
}

async function asyncPrint(value, duration) {
    await sleep(duration)
    console.log(value)
}
asyncPrint('hello world', 1000)
```

需求2. 使用睡眠函数实现红绿灯代码，红灯2秒，黄灯1秒，绿灯3秒。
```js
function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration)
    })
}
async function changeColor(color, duration) {
    console.log(color)
    await sleep(duration)
}
async function main() {
    while (true) {
        await changeColor('red', 2000)
        await changeColor('yellow', 1000)
        await changeColor('green', 3000)
    }
}
```

需求3. 1s后输出1 2s后输出2 3s后输出3
```js
function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration)
    })
}
async function main() {
    await sleep(1000)
    console.log(1)
    await sleep(2000)
    console.log(2)
    await sleep(3000)
    console.log(3)
}
```

### async/await 的串行与并行。
```js
function resolveAfter2Seconds(x) {
    return new Promise(resolve => { 
        setTimeout(resolve, 2000, x)
    })
}
async function f1() {
    console.log(new Date())
    var a = await resolveAfter2Seconds(10)
    var b = await resolveAfter2Seconds(10)
    console.log(new Date())
}
f1() //这段代码执行完毕需要大约4s的时间

// 但是如果我们的 a b 任务并无依赖关系，那么并行执行 a b 两个任务就可以节约一半的时间，改造后代码如下：
async function f2() {
    console.log(new Date())
    var a = resolveAfter2Seconds(10)
    var b = resolveAfter2Seconds(10)
    console.log(a, b)
    await a
    await b
    console.log(new Date())
}
f2() //这段代码执行完毕需要大于2s的时间
// 为什么这种写法 a b 任务就会并行呢？
// 在赋值的过程，a b 两个任务已经开始执行，此时两个异步任务时并行的
// 在await之前，异步任务已经都开始执行了。
```
所以：
+ async/await 的串行可以在for循环中，在await语句上执行异步操作。
+ async/await 的并行：
  1. 可以先通过Promise.all执行所有的异步操作，再通过await语句来处理Promise.all的返回值。
  2. 先循环执行所有异步操作，拿到结果数组后，再依次await处理结果
    
```js
// 串行执行
async function dbFuc(db) {
  let docs = [{}, {}, {}];

  for (let doc of docs) {
    await db.post(doc);
  }
}
```
```js
// 并行执行1
async function dbFunc(db) {
    let docs = [{}, {}, {}];
    let promises = docs.map(doc => db.post(doc))
    let result = await Promise.all(promises)
    console.log(result)
}

// 并行执行2
async function dbFunc(db) {
  let docs = [{}, {}, {}];
  let array = docs.map(doc => db.post(doc))
  let result = []
  for (let item of array) {
    let r = await item
    result.push(r)
  }
  console.log(result)
}
```

### 注意点

await 命令后面的 Promise 对象，运行结果可能是 rejected，所以最好把 await 命令放在 try...catch 代码块中。

```js
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}
```

或者这样写：
```js
async function myFunction() {
    await somethingThatReturnsAPromise().catch(err => {
        console.log(err);
    })
}
```

### 附加题：JS并发控制实现

描述：
实现一个并发控制方法，它可以接受一个limit并发限制数，一个urls数组表示并发的多个请求URL，一个fn表示请求操作函数:
[详细解析](https://zhuanlan.zhihu.com/p/455838344)

```js
async function asyncPool(limit, urls, iteratorFn) {
  const ret = []
  const executing = []
  for (let url of urls) {
      let p = iteratorFn(url)
      ret.push(p)
      if (limit < urls.length) {
        let e = p.then(() => {executing.splice(executing.indexOf(e), 1)})
        executing.push(e)
        if (executing.length >= limit) {
            await Promise.race(executing)
        }
      }
  }
  return Promise.all(ret)
}

// 用例：

//定义一个异步操作函数，随机在1-2s内返回结果值。
// 该异步函数接受参数与resolve结果值，打印值。一致
const timeout = function (i) {
    return new Promise(resolve => {
      console.log('开始'+ i)
      setTimeout(() => {
          resolve(i)
          console.log('结束'+ i)
        }, 1000 + Math.random() * 1000)
    })
}

// 再定义一个urls数组[0 - 9]
const urls = new Array(12).fill(0).map((item, index) => index)

// 使用asyncPool
let P = asyncPool(3, urls, timeout)

P.then(v => console.log(v))
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
```
