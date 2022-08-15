## Promise的api使用与实现

### 1. Promise.all
Promise.all() 方法接收一个promise的iterable类型的输入，并且只返回一个Promise实例，

注意：只要任何一个输入的promise的reject回调执行或者输入不合法的promise就会立即抛出错误，并且reject的是第一个抛出的错误信息。

```js
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then(res => {
    console.log(res) // [3, 42, 'foo']
})
```
注意：
Promise.all获得的 **成功结果的数组里的数据顺序** 和 Promise.all **接收到的数组顺序** 是一致的

### 内部实现

1. 接收一个 Promise 实例的数组或具有 Iterator 接口的对象。返回值是一个新的 Promise 对象
2. 如果元素不是 Promise 对象，则使用 Promise.resolve 转成 Promise 对象
3. 如果全部成功，状态变为 resolved，**返回值将组成一个数组传给回调**
4. 只要有一个失败，**状态就变为 rejected，返回值将直接传递给回调**

```js
function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('arguments must be an array'));
        }
        let counter = 0
        let length = promises.length
        let result = new Array(length)
        for (let i = 0; i < length; i++) {
            // 注意：Promise.resolve(promises[i])仅仅是用来将不是promise的异步操作包装成Promise。
            Promise.resolve(promises[i]).then((value) => {
                counter++
                result[i] = value
                if (counter === length) {
                    resolve(result)
                }
            }, (err) => {
                reject(err)
            })
        }
    })
}
```

### 2. Promise.allSettled

Promise.all缺点：

当我们使用 Promise.all() 执行各个 promise 时，**只要其中任何一个promise失败，Promise.all 就会立即被 reject**，只有所有的 promise 都 resolve 时才会调用 .then 中的成功回调

但大多数场景中，我们期望传入的这组 promise 无论执行失败或成功，都能获取每个 promise 的执行结果

解决：
Promise.allSettled() 可以获取数组中每个 promise 的结果，无论成功或失败

```js
const p1 = Promise.resolve(1)
const p2 = Promise.resolve(2)
const p3 = new Promise((resolve, reject) => {
  setTimeout(reject, 1000, 'three');
});

Promise.allSettled([p1,p2,p3]).then(value => {
    console.log(value)
    /*
        [
          {status: "fulfilled", value: 1}, 
          {status: "fulfilled", value: 2}, 
          {status: "rejected", reason: "three"}
        ]
    */
})
```

思考：如何用Promise.all来兼容Promise.allSettled??

pollyfill:

```js
if (!Promise.allSettled) {
    const resolvedHandler = value => ({ value: value, status: 'fulfilled' })
    const rejectedHandler = reason => ({ reason: reason, status: 'rejected' })
    Promise.allSettled = function (values) { 
        // Promise.all要处理全部为fulfilled状态的元素数组，才可以把结果全部返回。
        return Promise.all(values.map(value => {
            // 重点：只要resolvedHandler，rejectedHandler正常执行不报错，该语句return的结果promise状态就一定是fulfilled。
            return Promise.resolve(value).then(resolvedHandler, rejectedHandler)
        }))
    }
}

// 使用
const p1 = Promise.resolve(1)
const p2 = Promise.resolve(2)
const p3 = new Promise((resolve, reject) => {
    setTimeout(reject, 1000, 'three');
})
Promise.allSettled([p1,p2,p3]).then(value => {
    console.log(value)
    /*
        [{value: 1, status: 'fulfilled'},
        {value: 2, status: 'fulfilled'},
        {reason: 'three', status: 'rejected'}]
    */
})
```

### 内部实现

实现要点: 与 Promise.all 不同的是：当 promise 被 reject 之后，我们不会直接 reject ，而是记录下该 reject 的值和对应的状态 'rejected' ；

同样地，当 promise 对象被 resolve 时我们也不仅仅局限于记录值，同时也会记录状态 'fulfilled' 。

当所有的 promise 对象都已执行（解决或拒绝），我们统一 resolve 所有的 promise 执行结果数组。

```js
MyPromise.allSettled = function(promises) {
    return new Promise(resolve, reject => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('arguments must be an array'));
        }
        let length = promises.length
        let counter = 0
        let result = new Array(length)
        for (let i = 0; i < length; i++) {
            Promise.resolve(promises[i]).then((value => {
                counter++
                result[i] = { value: value, status: 'fulfilled'}
                if (counter === length) {
                    resolve(result)
                }
            }, reason => {
                counter++
                result[i] = { reason: reason, status: 'rejected'}
                if (counter === length) {
                    resolve(result)
                }
            }))
        }
    })
}
```

### Promise.race

+ Promise.race(iterable) 方法返回一个 promise.
+ 一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。

总结：哪个操作先有结果，整体Promise就用哪个结果

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2]).then((value) => {
    // Both resolve, but promise2 is faster
    // two
    // 且不论成功失败，如果失败的先执行完，回调中就使用失败的结果
    console.log(value);
});
```

### 内部实现

```js
Promise.race = function (values) {
    return new Promise(resolve, reject => {
        if (!Array.isArray(values)) {
            return reject(new TypeError('arguments must be an array'));
        }
        for (let i = 0; i < values.length; i++) {
            Promise.resolve(values[i]).then(value => {
                resolve(value)
            }, reason => {
                reject(reason)
            })
        }
    })
}
```

### Promise.prototype.finally()

finally() 方法返回一个Promise。
在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数。
这为在Promise是否成功完成后都需要执行的代码提供了一种方式。

eg:

```js
new Promise((resolve, reject) => {
  setTimeout(() => resolve("result"), 2000)
}).finally(() => {
    console.log('finally')
}).then(res => {
    console.log(res)
})

// finally result
```

说明：
1. finally 回调函数中没有参数
2. finally 会将上一次的res结果和 error 传递
3. 不论调用finally的promise状态如何，都将执行finally中的cb函数

[使用](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)

### 内部实现：
```js
MyPromise.prototype.finally = function (cb) {
    // this指向调用finally的promise
    return this.then(res => {
        return Promise.resolve(cb()).then(() => res)
    }, err => {
        return Promise.resolve(cb()).then(() => throw err)
    })
}
```

### catch方法
```js
MyPromise.prototype.catch = function (cb) {
    return this.then(null, err => {
        return cb(err)
    })
}
```

### Promise的静态方法
+ Promise.resolve()，快速创建一个成功的Promise;
+ Promise.reject()，快速创建一个失败的Promise。

```js
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
```
