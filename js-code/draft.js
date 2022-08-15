function myInstanceof(left, right) {
    let proto = left.__proto__
    while(true) {
        if (proto === right.prototype) {
            return true
        }
        if (proto === null) {
            return false
        }
        proto = proto.__proto__
    }
}

// call和apply的实现
Function.prototype.call2 = function(context, ...rest) {
    context = context ? Object(context) : window
    const fn = Symbol()
    context[fn] = this
    const res = context[fn](...rest)
    delete context[fn]
    return res
}
Function.prototype.apply = function(context, arr) {
    context = context ? Object(context) : window
    const fn = Symbol()
    context[fn] = this
    let res
    if (Array.isArray(arr) && arr.length) {
        res = context[fn](...arr)
    } else {
        res = context[fn]()
    }
    delete context[fn]
    return res
}

Function.prototype.bind = function(context, ...rest) {
    const self = this
    const args = rest
    return function() {
        const bindArgs = Array.prototype.slice.call(arguments)
        return self.apply(context, args.concat(bindArgs))
    }
}

function create() {
    const constructor = Array.prototype.unshift.call(arguments)
    const obj = Object.create(constructor.prototype)
    const res = constructor.call(obj, ...arguments)
    return res instanceof Object ? res : obj
}

function create1(first, ...rest) {
    const constructor = first
    const obj = Object.create(constructor.prototype)
    const res = constructor.call(obj, ...rest)
    return res instanceof Object ? res : obj
}

// 一个原型链的例子：

function Person(name) {
    this.name = name
}
const p = new Person('aa')

p.__proto__ === Person.prototype
p.__proto__.__proto__ === Object.prototype
p.__proto__.__proto__.__proto__ === null

// 注意：构造函数也可以是一个实例对象，故有：
Object.__proto__ === Function.prototype
Object.__proto__.__proto__.constructor === Object

// 继承：

function Child() {
    // 私有属性继承
    Parent.call(this)
}
// 共有属性继承
Child.prototype = new Parent()
// 或者

Child.prototype = Object.create(Parent.prototype)
// 然后, 不要忘了
Child.prototype.constructor = Child

function isType(type) {
    return function(obj) {
        return Object.prototype.toString.call(obj) === `[object ${type}]`
    }
}

// 深拷贝：1. 循环引用。2. 不要忽略symbol属性
function isObject(target) {
    return typeof target === 'object' && target !== null
}
function deepClone(source, map = new WeakMap) {
    if(!isObject(source)) return source
    if (map.has(source)) {
        return map.get(source)
    }
    const target = Array.isArray(source) ? [] : {}
    map.set(source, target)
    Reflect.ownKeys(source).forEach(key => {
        if(isObject(source[key])) {
            target[key] = deepClone(source[key], map)
        } else {
            target[key] = source[key]
        }
    })
    // for(let key in source) {
    //     if (Object.prototype.hasOwnProperty.call(source, key)) {
    //         if(isObject(source[key])) {
    //             target[key] = deepClone(source[key], map)
    //         } else {
    //             target[key] = source[key]
    //         }
    //     }
    // }
    return target
}

// 节流和防抖
function throttle(fn, wait = 50) {
    let previous = 0
    return function(...args) {
        let now = + new Date()
        if (now - previous >= wait) {
            previous = now
            fn.apply(this, args)
        }
    }
}

function debounce(fn, wait = 50, immediately) {
    let timer
    return function(...args) {
        if(!timer && immediately) {
            fn.apply(this, args)
        }
        if (timer) {
            clearTimeout(timer)
        }
        setTimeout(() => {
            fn.apply(this, args)
        }, wait);
    }
}

isType('String')('123');

// 面试题：满足需求如下，写一个add函数
add(1) // 1
add(1)(2)  // 3
add(1)(2)(3) // 6
add(1)(2)(3)(4) // 10 

function add(x) {
    const sum = function(y) {
        x = x + y
        return sum
    }
    sum.toString = function() {
        return x
    }
    return sum
}

// 实现柯里化

// 一个累加函数
function add1(...rest) {
    return rest.reduce((prev, cur) => prev + cur)
}

// 实现柯里化
function currying(fn) {
    var arr = []
    return function result(...rest) {
        if (rest.length) {
            arr.concat(rest)
            return result
        } else {
            return fn.apply(this, arr)
        }
    }
}

// 使用：
const curryingAdd = currying(add1)
curryingAdd(1)(2)(3)() // 6

// 柯里化的健壮版: l为fn剩余的参数长度
function currying(fn, l) {
    const length = l || fn.length
    return function(...rest) {
        if (rest.length >= length) {
            return fn.apply(this, rest)
        } else {
            return currying(fn.bind(this, ...rest), length - rest.length)
        }
    }
}


// 数组常用方法的实现：map，filter，every，reduce

Array.prototype.mapSelf = function(callback, thisArg) {
    // 先验证调用map的this是不是数组，不是的话，警告
    // 再验证callback是不是函数，不是的话，警告

    // 获取调用map的数组
    var O = Object(this)
    var len = O.length
    // 定义新数组
    var A = new Array(len)
    var k = 0
    while (k < len) {
        var kValue = O[k]
        A[k] = callback.call(thisArg, kValue, k, O)
        k++
    }
    A.length = k
    return A
}

Array.prototype.filterSelf = function(callback, thisArg) {
    // 先验证调用map的this是不是数组，不是的话，警告
    // 再验证callback是不是函数，不是的话，警告

    // 获取调用filter的数组
    var O = Object(this)
    var len = O.length
    // 定义新数组
    var A = new Array(len)
    var k = 0
    var o = 0
    while (k < len) {
        var kValue = O[k]
        if (callback.call(thisArg, kValue, k, O)) {
            A[o++] = kValue
        }
        k++
    }
    A.length = o
    return A
}

Array.prototype.everySelf = function(callback, thisArg) {
    // 先验证调用map的this是不是数组，不是的话，警告
    // 再验证callback是不是函数，不是的话，警告

    // 获取调用every的数组
    var O = Object(this)
    var len = O.length
    // 定义新数组
    var k = 0
    var flag = true
    while (k < len) {
        var kValue = O[k]
        if (!callback.call(thisArg, kValue, k, O)) {
            flag = false
            break
        }
        k++
    }
    return flag
}

Array.prototype.reduceSelf = function(callback, initialValue) {
    // 先验证调用map的this是不是数组，不是的话，警告
    // 再验证callback是不是函数，不是的话，警告

    // 获取调用map的数组
    var O = Object(this)
    var len = O.length
    var k = 0
    var accumulate
    if (initialValue) {
        accumulate = initialValue
    } else {
        accumulate = O[k]
        k++
    }
    while (k < len) {
        var kValue = O[k]
        accumulate = callback.call(null, accumulate, kValue, k, O)
        k++
    }
    return accumulate
}

// 数组扁平化1
function flatten(arr) {
    let result = []
    for (const val of arr) {
        if (Array.isArray(val)) {
            result.concat(flatten(val))
        } else {
            result.concat(val)
        }
    }
    return result
}

// 改写
var flatten = function(arr) {
    return arr.reduce((acc, cur) => {
        return acc.concat(Array.isArray(cur) ? flatten(cur) : cur)
    }, [])
}

// 数组扁平化2
function flatten1(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr)
    }
    return arr
}

// 数组扁平化3: 全是数字的数组：var arr = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];

function flatten(arr) {
    var temp = arr.toString().split(',')
    return temp.map(item => Number(item))
}

// 函数组合：
function compose(...fns) {
    return function(value) {
        return fns.reduceRight((acc, cur) => {
            return cur(acc)
        }, value)
    }
}

// eventLoop的执行规则

// 先执行同步代码，等执行栈为空时，再检查任务队列。
// 检测微队列是否为空，若不为空，则取出一个微任务入栈执行，然后执行步骤1；若为空，则执行步骤2
// 检测宏队列是否为空，若不为空，则取出一个宏任务入栈执行，然后执行步骤1；若为空，直接执行步骤1
// ……往复循环

// 对于一处于pending状态的Promise对象p，内部状态的resolve，才会让p.then(fn)中的fn加入微任务队列
// then内部回调函数执行完毕（函数结束或者遇到return）该promise才会被resolve（变成fulfilled状态）
// 放入微任务队列的函数，不意味着立刻执行。要等同步代码执行完毕，执行栈为空的时候，再去执行微任务队列中的函数


// Promise的实现
// 主要有两方面：1. then函数的实现 2. Promise的决议过程
// then的实现：根据Promise的状态分为三种情况pending，fulfilled，rejected。这三种情况的逻辑是怎样的。
// fulfilled状态时，判断当前的then参数是否为一个函数，不是的话，直接返回当前promise。是的话，则调用参数（执行回调函数），并把结果值与新的promise进行决议。这一过程的逻辑需要放在try，catch中。并且也晚于同步代码之后执行。
// rejected状态时，逻辑同上。
// pending状态时，以上逻辑不变，将其包装起来，放入当前promise的回调函数队列中，等待执行。

function MyPromise(fn) {
    this.value = undefined
    this.reason = undefined
    this.status = 'pending'
    this.fulfilledCbs = []
    this.rejectedCbs = []

    fn((value) => {
        // 决议过程，实现如下
        fulfilledValue(this, value)
    }, (reason) => {
        // 内部实现逻辑同上
        rejectedReason(this, reason)
    })
}
MyPromise.prototype.then = function(OnFulfilled, OnRejected) {
    var promise1 = this
    var promise2 = new Promise()
    if (this.status === 'fulfilled') {
        // ...code
    }
    if (this.status === 'rejected') {
        // ...code
    }
    if (this.status === 'pending') {
        // ...code
    }
    return promise2
}

function fulfilledValue(promise, value) {
    if (promise.status !== 'pending') {
        return
    }
    promise.value = value
    promise.status = 'fulfilled'
    promise.fulfilledCbs.forEach(cb => cb())
}


// 决议过程是怎样的？
// 决议过程，其实就是将当前的promise的状态改为fulfilled或者rejected。并为当前promise进行赋值（value或者reason）。最后再将当前promise的回调函数拿出来加入微任务队列，进行执行即可。

// Promise的相关api实现
// 参数接受一个iterator对象。
// 只有当参数中的每一个异步操作都fulfilled，promise.all才会resolve。但凡有一个异步操作出现异常，promise.all返回的结果都是reject，并且结果值是第一个err。
function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('arguments must be an array'));
        }
        let count = 0
        const length = promises.length
        const result = new Array(length)
        for (let i; i < length; i++) {
            Promise.resolve(val).then((data) => {
                result[i] = data
                count++
                if (count === length) {
                    resolve(result)
                }
            }, (err) => {
                reject(err)
            })
        }
    })
}

// 用Promise.all实现Promise.allSettled
// 首先，Promise.allSettled是会将所有入参的执行结果（value和reason及其对应的状态，以对象数组的形式）都返回，不论成功失败。

// 原理很简单，就是将Promise.all内部的参数全部变成fulfilled状态的promise实例。
if (!Promise.allSettled) {
    const resolvedHandler = (value) => ({ value: value, status: 'fulfilled' })
    const rejectedHandler = (reason) => ({ reason: reason, status: 'rejected' })

    Promise.allSettled = function(promises) {
        return Promise.all(promises.map(val => {
            return Promise.resolve(val).then(resolvedHandler, rejectedHandler)
        }))
    }
}

// 内部实现
MyPromise.allSettled = function(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('arguments must be an array'));
        }
        const length = promises.length
        let count = 0
        const result = new Array(length)
        for (let i; i < length; i++) {
            Promise.resolve(val).then((data) => {
                result[i] = { value: data, status: 'fulfilled'}
                count++
                if (count === length) {
                    resolve(result)
                }
            }, (err) => {
                result[i] = { reason: err, status: 'rejected'}
                count++ 
                if (count === length) {
                    resolve(result)
                }
            })
        }
    })
}

// Promise.race的实现，入参当中最快执行完的异步操作结果将会被返回。
MyPromise.race = function(promises) {
    if (!Array.isArray(promises)) {
        return reject(new TypeError('arguments must be an array'));
    }
    for (const val of promises) {
        Promise.resolve(val).then((data) => {
            resolve(data)
        }, (err) => {
            reject(err)
        })
    }
}
// finally和catch 的实现。
MyPromise.prototype.finally = function(cb) {
    return this.then(res => {
        return Promise.resolve(cb()).then(() => res)
    }, err => {
        return Promise.resolve(cb()).then(() => { throw err })
    })
}

MyPromise.prototype.catch = function(cb) {
    return this.then(null, err => {
        return cb(err)
    })
}

// Promise.resolve()，Promise.reject()的实现
class Promise {
    static resolve(value) {
        return new Promise((resolve) => {
            resolve(value)
        })
    }
    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }
}

// 写一个数组迭代器

function makeIterator(arry) {
    var i = 0
    return {
        next: function() {
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

// 普通对象实现迭代器属性
obj[Symbol.iterator] = function() {
    var keys = Object.keys(this)
    var i = 0
    return {
        next: function() {
            return i < keys.length ? {
                value: this[keys[i++]],
                done: false
            } : {
                value: undefined,
                done: true
            }
        }
    }
}

// 写一个生成器函数，调用它生成迭代器。
obj[Symbol.iterator] = function* () {
    var keys = Object.keys(this)
    for (const key of keys) {
        yield [key, this[key]]
    }
}

for (const [key, val] of obj) {
    console.log(key, val)
}

// Generator函数的说明：
// Generator函数调用返回一个迭代器，通过使用gen.next()来启动内部的逻辑执行，遇到yield暂停，gen.next()的返回值为yield紧跟的表达式的值。
// 再次启动执行，则继续使用gen.next()。其中再次调用next方法时，可以传参，该参数用来给上一个yield语句赋值。
// 直到没有yield语句时，通过gen.next()的方式，将gen函数内的逻辑全部走完

// gen函数内部可以封装异步操作，这样可以很好的控制异步代码的执行顺序。以同步的方式，省去书写回调函数。
// 但问题是，gen内部的逻辑需要不断的使用gen.next()来完成，所以，我们需要能有一个自动执行gen函数的自执行器。

// 两种方案：Thunk函数，Co模块
// Thunk函数，利用异步操作执行后返回一个回调函数的形式，在其中进行递归执行gen.next()来完成gen函数的自执行。
// Co模块，将异步操作执行包装成Promise的形式，在then函数中递归执行gen.next()来完成gen函数的自执行。

// 代码如下：
fs.readFile(fileName, callback);

const Thunk = function(url) {
    return function(cb) {
        fs.readFile.call(null, fileName, callback)
    }
}

// 此时的readFileThunk就是一个只接受cb回调函数作为参数的函数，之后，使用这就可以再cb回调函数内进行数据的处理和执行gen.next(data)
const readFileThunk = Thunk('../dist/index.js')
readFileThunk((err, data) => {
    if (err) {
        throw err
    }
    gen.next(data)
    // ...code
})

// 下面是针对Thunk函数的自执行器的实现。

// 异步的逻辑如下：
var fs = require('fs');
const { resolve } = require('path')
var thunkify = require('thunkify');
var readFileThunk1 = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFileThunk1('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFileThunk1('/etc/shells');
  console.log(r2.toString());
}

// 执行gen的逻辑如下：
var g = gen()
var R1 = g.next()

R1.value((err, data) => {
    if (err) {
        throw err
    }
    // 此时，data赋值给r1.
    R2 = g.next(data)
    R2.value((err, data) => {
        if (err) {
            throw err
        }
        g.next(data)
    })
})

// 可以看出yield是将gen函数的执行权交出，next是将gen的执行全交回。
// 回调函数中的逻辑基本一致，所以可以再度封装。

// 自执行器如下:
// fn为gen函数，传入即可自动执行gen中的逻辑。
function run(fn) {
    var g = fn()
    function next(err, data) {
        if (err) {
            throw err
        }
        var result = g.next(data)
        if(result.done) return;
        result.value(next)
    }
    next()
}

run(gen)

// 方案二：将异步操作包装成Promise形式，代码如下:
var readFile = function(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data)
        })
    })
}

// 此方案调用readFile时遇到yield返回的value是一个promise实例。在该实例的then函数中你可以拿到data数据进行后续操作。
// promise形式的自执行器如下：
function run1(fn) {
    var g = fn()
    function next(data) {
        var result = g.next(data)
        if (result.done) {
            return
        }
        result.value.then(data => {
            next(data)
        })
    }
    next()
}
run1(gen)

// 再看async函数，本质就是gen函数+gen函数的自执行器。async函数调用，其内部的逻辑自动执行。

// 需求1. 指定时间内输出一个值（写一个睡眠函数）

function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration)
    })
}

function asyncPrint(value, duration) {
    await sleep(duration)
    console.log(value)
}

asyncPrint('Hello World', 1000)

// 需求2. 使用睡眠函数实现红绿灯代码，红灯2秒，黄灯1秒，绿灯3秒。
function main() {
    while(true) {
        console.log('red')
        await sleep(2000)
        console.log('yellow')
        await sleep(1000)
        console.log('green')
        await sleep(3000)
    }
}

// async/await 的串行与并行

const urls = [{}, {}, {}]

// 串行执行

function dbFunc(db) {
    const result = []
    for (const url of urls) {
        // db.post(url)为异步操作, 结果是一个promise实例
        const r = await db.post(url)
        result.push(r)
    }
    return result
}

// 并行执行
function dbFunc1(db) {
    const result = []
    // 结果是一个数组，以promise实例为元素。
    const promises = urls.map(url => db.post(url))
    // 在await之前，异步任务已经都开始执行了。
    result = await Promise.all(promises)
    return result
}

// JS并发控制实现:
// 描述：实现一个并发控制方法，它可以接受一个limit并发限制数，一个urls数组表示并发的多个请求URL，一个fn表示请求操作函数:

function asyncPool(limits, urls, fn) {
    const result = []
    const excuting = []
    for (const url of urls) {
        let p = fn(url)
        result.push(e)
        if (limits < urls.length) {
            const e = p.then(() => {excuting.splice(excuting.indexOf(e), 1)})
            excuting.push(e)
            if (excuting.length >= limits) {
                await Promise.race(excuting)
            }
        }
    }
    return Promise.all(result)
}

// 用setTimeout来模拟一个setInterval函数

// 原因：setInterval函数的间隔时间包含了函数执行时间，函数执行时间如果过长，会影响setInterval的执行

var timer = {}

function myInterval(cb, time, ...args) {
    var timerId = Symbol()

    var fn = function() {
        cb.apply(undefined, args)
        timer[timerId] = setTimeout(fn, time)
    }
    timer[timerId] = setTimeout(fn, time)
    return timer[timerId]
}

function clearInterval(id) {
    clearTimeout(timer[id])
    delete timer[id]
}

// reduce的一些使用：
function sumArr(arr) {
    return arr.reduce((acc, cur) => {
        return acc + cur
    }, 0)
}

// 将该数组扁平化[[1,2], [3,4], [4,5], [2,4]]

function flatten(arr) {
    return arr.reduce((acc, cur) => {
        return acc.concat(Array.isArray(cur) ? flatten(cur) : cur)
    }, [])
}

function flatten1(arr) {
    while(arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr)
    }
    return arr
}

// 计算数组中每个元素出现的次数
var names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice']

function countedNames(arr) {
    return arr.reduce((acc, cur) => {
        if (!acc[cur]) {
            acc[cur] = 1
        } else {
            acc[cur]++
        }
        return acc
    }, {})
}

countedNames(names) // {Alice: 2, Bob: 1, Tiff: 1, Bruce: 1}

// 数组的反转
function reverseArr(arr) {
    return arr.reduce((acc, cur) => {
        return [cur].concat(acc)
    }, [])
}

// 双指针反转
function reverseArr1(arr) {
    const length = arr.length
    for (let i = 0, j = length - 1; i < length / 2; i++, j--) {
        // let [arr[i], arr[j]] = [arr[j], arr[i]]
        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
    return arr
}

// 用reduceRight来实现compose函数
// compose函数中的参数，是从右至左依次执行。
function compose(...fns) {
    return function(value) {
        return fns.reduceRight((acc, fn) => {
            return fn(acc)
        }, value)
    }
}

// 数组去重

let myArray = ['a', 'b', 'a', 'b', 'c', 'e', 'e', 'c', 'd', 'd', 'd', 'd']

function unique(arr) {
    return arr.reduce((acc, cur) => {
        if (acc.indexOf(cur) === -1) {
            acc.push(cur)
        }
        return acc
    }, [])
}

function unique1(arr) {
    // 通过索引值是否与indexOf索引值相等来判断，该值是否重复
    return arr.filter((item, index, arry) => arry.indexOf(item) === index)
}

function unique2(arr) {
    return Array.from(new Set(arr))
}

// 字符串的indexOf实现
function myIndexOf(target, str, fromIndex) {
    if (typeof str !== 'string') {
        str = str.toString()
    }
    if (str.length > target.length || !str) {
        return -1
    }
    for (let index = 0; index < target.length; index++) {
        if (str[0] === target[index]) {
            if(str === target.subStr(index, str.length)) {
                return index
            } else {
                continue
            }
        }
    }
    return -1
}

// 注意区分: String.prototype.subStr和String.prototype.substring的区别
// 前者入参为start, length.  后者入参为start, end.  左闭右开的原则.

// 发布订阅 数据结构 的实现
// 需求: 两个类(Subject, Observer)Subject用来收集Observer.

class Subject {
    constructor() {
        // 用来收集观察者
        this.observers = []
    }
    addObserver(Observer) {
        this.observers.push(Observer)
    }
    removeObserver(Observer) {
        const index = this.observers.indexOf(Observer)
        index !== -1 && this.observers.splice(index, 1)
    }
    notify() {
        this.observers.forEach(observer => observer.update())
    }
}

class Observer {
    suscribeTo(subject) {
        subject.addObserver(this)
    }
    update() {
        console.log('Updated...')
    }
}

// 实现evnetbus数据结构
// 注册事件, 触发事件.
class EventBus {
    constructor() {
        // 用来收集事件名对应的方法
        // key为事件名, value为数组, 元素为一个个hander
        this.map = {}
    }
    on(eventName, hander) {
        // 将hander保存起来.
        this.map[eventName] = (this.map[eventName] || []).concat(hander)
    }
    emit(eventName, ...args) {
        if (this.map[eventName] && this.map[eventName].length) {
            this.map[eventName].forEach(hander => hander.apply(undefined, args))
        }
    }
    off(eventName, hander) {
        if (this.map[eventName]) {
            if (!hander) {
                delete this.map[eventName]
            } else {
                const index = this.map[eventName].indexOf(hander)
                if (index !== -1) {
                    this.map[eventName].splice(index, 1)
                }
            }
        }
    }
    once(eventName, hander) {
        const fn = (...args) => {
            hander.apply(undefined, args)
            this.off(eventName)
        }
        this.on(eventName, fn)
    }
}