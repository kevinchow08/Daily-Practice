## 什么是promise

所谓Promise：简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。
从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise提供统一的API，各种异步操作都可以用同样的方法进行处理。
Promise出现之前都是通过回调函数来实现，回调函数本身没有问题，但是嵌套层级过深，很容易掉进回调地狱。

### Promise对象有以下两个**特点**：
1. 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。
**只有异步操作的结果，可以决定当前是哪一种状态**，任何其他操作都无法改变这个状态。
这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。
Promise对象的状态改变，只有两种可能：**从pending变为fulfilled和从pending变为rejected**。
只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。

### 基本用法：
ES6 规定，Promise对象是一个构造函数，用来生成Promise实例。
Promise 新建后就会立即执行:

```js
const p = new Promise((resolve, reject) => {
    // some code..
    if('异步操作成功') {
        resolve(value)
    } else {
        reject(reason)
    }
})
```

API说明：
1. Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。 它们是两个函数，由 JavaScript 引擎提供，不用自己部署。
2. resolve和reject的作用是改变new Promise的状态：
   1. resolve函数的作用是: 将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 fulfilled），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；
   2. reject函数的作用是: 将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。
3. Promise实例生成以后，可以用then方法分别指定fulfilled状态和rejected状态的回调函数。其中，第二个函数是可选的，不一定要提供。这两个函数都接受Promise对象传出的值作为参数。
   如下：
```js
p.then(function(value) {
    // 成功回调
}, function(reason) {
    // 失败回调
})
```
注意：**立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务.reject同理**

### 分析Promise得实现原理
先写一个简易的串行执行异步操作得示例：

```js
new Promise((resolve, reject) => {
    ajax(url1, (res1) => {
        resolve(res1)
    })
}).then((res1) => {
    return new Promise((resolve, reject) => {
        ajax(url2, (res2) => {
            resolve(res2)
        })
    })
}).then((res2) => {
    return new Promise((resolve, reject) => {
        ajax(url3, (res3) => {
            resolve(res3)
        })
    })
})
```
提问：
1. Promise如何实现链式调用??（then函数的实现）
2. then函数中返回一个Promise，下一个then是如何接收value的??
3. resolve函数执行都做了什么操作??

要回答上面几个问题，需要了解Promise内部的封装过程。
1. promise 是一个拥有 then 方法的对象或函数，其行为符合本规范；
2. 一个 Promise 的当前状态必须为以下三种状态中的一种：等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected）。
3. 当我们实例化Promise时，构造函数会马上调用传入的执行函数executor(可以理解为异步操作)， 但是executor也会可能存在异常，因此通过try/catch来捕获一下异常情况。
   
```js
const statusMap = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
}

class Promise {
    constructor(fn) {
        this.status = statusMap.PENDING
        this.value = undefined
        this.reason = undefined
        this.fulfilledCbs = [] //then fulfilled callback 用来存储Promise 在pending过程中then函数中的callback。
        this.rejectedCbs = [] //then rejected callback 类似上
        // 执行传入构造函数中的fn,fn中有两个参数，分别对应上例中的resolve，reject。
        // 而resolve和reject的执行是在异步操作拿到值的时候，调用执行的。
        // 所以：resolved(value) 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务
        fn((value) => {
            resolvePromise(this, value)
        }, (reason) => {
            rejectPromise(this, reason)
        })
    }
    // then中有两个回调作为参数。
    then(onFulfulled, onRejected) {
        // 先获取 本Promise的引用指向。
        const promise1 = this
        // 由于then()可以链式调用，所以可以判断执行then会再返回另一个Promise
        const promise2 = new Promise(() => {})

        //当promise1的状态为fulfilled时，可以直接执行onFulfulled回调函数。但需注意，如果onFulfulled不是一个函数(是一个普通值得话，就忽略，返回promise1)，
        if(promise1.status === statusMap.FULFILLED) {
            if(!typeof onFulfulled === 'function') {
                return promise1
            }
            // then中的回调执行要晚于同步任务的执行，所以用setTimeout来模拟。
            // 补充：then中的回调，是在promise状态改变后，加入微任务队列，但不是立即执行，而是等执行栈中的同步代码执行完毕后再执行，所以用setTimeout来模拟。
            setTimeout(() => {
                try {
                    // 执行成功回调，并拿到该回调执行的返回值
                    const x = onFulfulled(promise1.value)
                    // 对新的promise2和上一个执行结果 x 的处理
                    // 用x作为参数，进行promise2的决议过程，从而为下一次then函数中的回调函数提供数据参数。
                    resolvePromise(promise2, x)
                } catch(e) {
                    // 失败的决议过程。
                    rejectPromise(promise2, e)
                }
            }, 0)
        }

        if(promise1.status === statusMap.REJECTED) {
            if(!typeof onRejected === 'function') {
                return promise1
            }
            setTimeout(() => {
                try {
                    const x = onRejected(promise1.reason)
                    resolvePromise(promise2, x);
                } catch(e) {
                    rejectPromise(promise2, e)
                }
            }, 0)
        }

        if(promise1.status === statusMap.PENDING) {
            // 同时，还要判断onFulfulled的类型，如果不是function类型。设置一个"兜底函数"，保证promise1.value/promise1.reason可以透传到下一个then中。
            let onFulfulled = typeof onFulfulled === 'function' ? onFulfulled : (value) => { return value }
            let onRejected = typeof onRejected === 'function' ? onRejected : (value) => { return value }

            // pending状态，可能由于promise1异步操作还在进行中，promise1还在pending中，此时将then中的回调函数和promise2的决议过程存起来。
            // 等promise1决议时即promise1调用resolvePromise时，再进行then中的回调和promise2的决议。
            promise1.fulfilledCbs.push(() => {
                setTimeout(() => {
                    try {
                        const x = onFulfulled(promise1.value)
                        resolvePromise(promise2, x)
                    } catch(e) {
                        rejectPromise(promise2, e)
                    }
                }, 0)
            })
            promise1.rejectedCbs.push(() => {
                setTimeout(() => {
                    try {
                        const x = onRejected(promise1.reason)
                        resolvePromise(promise2, x);
                    } catch(e) {
                        rejectPromise(promise2, e)
                    }
                }, 0)
            })
        }
        // 最终返回promise2，进行下一次的then()
        return promise2
    }
}

// Promise的resolve的解决过程
// x会有很多不同种类的类型，需要对不同类型进行判断，并相应的做出处理。
function resolvePromise(promise, x) {
    //首先，当x为promise时。如示例，return new Promise(() => {})

    // x与要决议的promise相同时，相当于把自己返回出去了。这样会陷入一个死循环中，因此我们首先要把这种情况给排除掉
    if(x === promise) {
        rejectPromise(promise, new TypeError('Can not be the same'))
    }
    if(x instanceof Promise) {
        if (x.status === statusMap.FULFILLED) {
            fulfilledPromise(promise, x.value)
            return;
        }
        if (x.status === statusMap.REJECTED) {
            rejectPromise(promise, x.reason)
            return;
        }
        if (x.status === statusMap.PENDING) {
            x.then(() => {
                fulfilledPromise(promise, x.value)
            }, () => {
                rejectPromise(promise, x.reason)
            })
            return;
        }
        return;
    }

    // 处理thenable的情况：thenable有两种，一种是对象上有then方法，一种是方法上有then方法
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        let then;
        let called = false
        try {
            then = x.then
        } catch (error) {
            rejectPromise(promise, error)
            return
        }
        if (typeof then === 'function') {
            try {
                then.call(x, (v) => {
                    if (called) {
                        return;
                    }
                    called = true
                    resolvePromise(promise, v)
                }, (e) => {
                    if (called) {
                        return;
                    }
                    called = true
                    rejectPromise(promise, e)
                })
                
            } catch (error) {
                if (called) {
                    return;
                }
                called = true
                rejectPromise(promise, error)
                return;
            }
            return;
        } else {
            fulfilledPromise(promise, x)
            return;
        }
    } else {
        fulfilledPromise(promise, x)
        return;
    }
}

// Promise的reject的解决过程,将promise设置为rejected状态
function rejectPromise(promise, reason) {
    if(promise.status !== statusMap.PENDING) {
        return;
    }
    promise.status = statusMap.REJECTED
    promise.reason = reason
    promise.rejectedCbs.forEach(cb => {
        return cb(reason)
    });
}

// 将promise设置为fulfilled状态
function fulfilledPromise(promise, value) {
    if(promise.status !== statusMap.PENDING) {
        return;
    }
    promise.status = statusMap.FULFILLED
    promise.value = value
    promise.fulfilledCbs.forEach((cb) => cb(value));
}
```
