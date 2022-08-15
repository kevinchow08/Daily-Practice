### 实现string.indexOf

注意：string实例上有indexOf方法，但没有reverse方法

```js
function myIndexOf(target, str, fromIndex) {
    if (typeof str !== 'string') {
        str = str.toString()
    }
    if (str.length > target.length || !str) {
        return -1
    }
    for (let i = fromIndex || 0; i < target.length; i++) {
        if (target[i] === str[0]) {
            const subStr = target.substr(i, str.length)
            if (subStr === str) {
                return i
            } else {
                continue
            }
        }
    }
    return -1
}
```

### 手写发布订阅模式
```js
class Subject {
    constructor() {
        this.observers = []
    }
    addObserver(observer) {
        this.observers.push(observer)
    }
    removeObserver(observer) {
        const index = this.observers.indexOf(observer)
        if (index > -1) {
            this.observers.splice(index, 1)
        }
    }
    notify() {
        this.observers.forEach(observer => {
            observer.update()
        })
    }
}

class Observer {
    subscribeTo(subject) {
        subject.addObserver(this)
    }
    update() {
        console.log('该观察者已更新')
    }
}

// 用例：
let subject = new Subject()
let observer = new Observer()
observer.update = function() {
    console.log('observer update')
}
observer.subscribeTo(subject)  //观察者订阅主题
subject.notify()
```

### 手写Event-bus
```js
// 用例

const eventBus = new EventBus()

eventBus.on('click:btn', data => {
    console.log(data)
})

eventBus.emit('click:btn', {a: 1, b: 2})
eventBus.off('click:btn')
eventBus.emit('click:btn', {a: 1, b: 2})
class EventBus {
    constructor() {
        this.map = {}
    }
    on(eventName, handler) {
        this.map[eventName] = (this.map[eventName] || []).concat(handler)
    }
    emit(eventName, data) {
        this.map[eventName] && this.map[eventName].forEach(handler => { 
            handler(data)
        })
    }
    off(eventName, handler) {
        if (this.map[eventName]) {
            if (!handler) {
                delete this.map[eventName]
            } else {
                const index = this.map[eventName].indexOf(handler)
                if (index > -1) {
                    this.map[eventName].splice(index, 1)
                }
            }
        }
    }
    once(eventName, handler) {
        const once = (data) => {
            handler(data)
            this.off(eventName)
        }
        this.on(eventName, once)
    }
}
```
