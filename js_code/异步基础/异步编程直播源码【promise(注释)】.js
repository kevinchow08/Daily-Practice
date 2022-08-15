/**
 * 说明1：如果对于有些地方的实现理解的不太透彻
 * （1）可以使用ES6 Promise写一个调用的demo理解
 * （2）可以结合ES6 Promise的执行结果去理解
 * （3）可以结合测试用例，删除部分代码，看一下测试用例的报错说明
 * 说明2：如何跑测试用例在本代码的最后有说明
 */
// promise的状态
const statusMap = {
	PENDING: 'pending',
	FULFILLED: 'fulfilled',
	REJECTED: 'rejected',
};
// 将promise设置为fulfilled状态
function fulfilledPromise(promise, value) {
	// 只能从pending状态转换为其他状态
	if (promise.status !== statusMap.PENDING) {
		return;
	}
	promise.status = statusMap.FULFILLED;
    promise.value = value;
    // 执行当前promise的fulfilledCbs
	runCbs(promise.fulfilledCbs, value);
}
// 将promise设置为rejected状态
function rejectedPromise(promise, reason) {
	// 只能从pending状态转换为其他状态
	if (promise.status !== statusMap.PENDING) {
		return;
	}
	promise.status = statusMap.REJECTED;
    promise.reason = reason;
    // 执行当前promise的rejectedCbs
	runCbs(promise.rejectedCbs, reason);
}
function runCbs(cbs, value) {
	cbs.forEach((cb) => cb(value));
}
function isFunction(fn) {
	return Object.prototype.toString.call(fn).toLocaleLowerCase() === '[object function]';
}
function isObject(obj) {
	return Object.prototype.toString.call(obj).toLocaleLowerCase() === '[object object]';
}
function isPromise(p) {
    // 当前的Promise
	return p instanceof Promise;
}
// promise的解析
function resolvePromise(promise, x) {
	// x 与promise相同
	if (promise === x) {
		rejectedPromise(promise, new TypeError('cant be the same'));
		return;
	}
	// x 是promise
	if (isPromise(x)) {
		if (x.status === statusMap.FULFILLED) {
			fulfilledPromise(promise, x.value);
			return;
		}
		if (x.status === statusMap.REJECTED) {
			rejectedPromise(promise, x.reason);
			return;
		}
		if (x.status === statusMap.PENDING) {
			x.then(
				() => {
					fulfilledPromise(promise, x.value);
				},
				() => {
					rejectedPromise(promise, x.reason);
				}
			);
			return;
		}
		return;
    }
    // 处理thenable的情况：thenable有两种，一种是对象上有then方法，一种是方法上有then方法
	if (isObject(x) || isFunction(x)) {
		let then;
        let called = false;
		try {
			then = x.then;
		} catch (error) {
			rejectedPromise(promise, error);
			return;
        }
		if (isFunction(then)) {
			try {
				then.call(
					x,
					(y) => {
						if (called) {
							return;
						}
						called = true;
						resolvePromise(promise, y);
					},
					(r) => {
						if (called) {
							return;
						}
						called = true;
						rejectedPromise(promise, r);
					}
				);
			} catch (error) {
				if (called) {
					return;
				}
				called = true;
				rejectedPromise(promise, error);
			}
			return;
		} else {
			fulfilledPromise(promise, x);
			return;
		}
		// x不是对象或者函数
	} else {
		fulfilledPromise(promise, x);
		return;
	}
}
class Promise {
	constructor(fn) {
		this.status = statusMap.PENDING;
		this.value = undefined;
		this.reason = undefined;
		this.fulfilledCbs = []; // then fulfilled callback
		this.rejectedCbs = []; // then rejected callback
		fn(
			(value) => {
				resolvePromise(this, value);
			},
			(reason) => {
				rejectedPromise(this, reason);
			}
		);
	}
	// 两个参数
	then(onFulfilled, onRejected) {
		const promise1 = this;
		const promise2 = new Promise(() => {});
		if (promise1.status === statusMap.FULFILLED) {
			if (!isFunction(onFulfilled)) {
				return promise1;
			}
			setTimeout(() => {
				try {
					const x = onFulfilled(promise1.value);
					resolvePromise(promise2, x);
				} catch (error) {
					rejectedPromise(promise2, error);
				}
			}, 0);
		}
		if (promise1.status === statusMap.REJECTED) {
			if (!isFunction(onRejected)) {
				return promise1;
			}
			setTimeout(() => {
				try {
					const x = onRejected(promise1.reason);
					resolvePromise(promise2, x);
				} catch (error) {
					rejectedPromise(promise2, error);
				}
			}, 0);
		}
		if (promise1.status === statusMap.PENDING) {
			onFulfilled = isFunction(onFulfilled)
				? onFulfilled
				: (value) => {
						return value;
				  };
			onRejected = isFunction(onRejected)
				? onRejected
				: (err) => {
						throw err;
				  };
			promise1.fulfilledCbs.push(() => {
				setTimeout(() => {
					try {
						const x = onFulfilled(promise1.value);
						resolvePromise(promise2, x);
					} catch (error) {
						rejectedPromise(promise2, error);
					}
				}, 0);
			});
			promise1.rejectedCbs.push(() => {
				setTimeout(() => {
					try {
						const x = onRejected(promise1.reason);
						resolvePromise(promise2, x);
					} catch (error) {
						rejectedPromise(promise2, error);
					}
				}, 0);
			});
		}
		return promise2;
	}
}

/**
 * 怎么执行测试用例
 * 添加以下代码
 * 执行 npm install promises-tests -g
 * 在实现的promise.js当前路径下，运行 promises-aplus-tests
 */
// 测试用到的钩子
Promise.deferred = function () {
	const deferred = {};
	deferred.promise = new Promise((resolve, reject) => {
		deferred.resolve = resolve;
		deferred.reject = reject;
	});
	return deferred;
};

module.exports = Promise;
