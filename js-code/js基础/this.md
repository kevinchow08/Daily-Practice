### this绑定全面解析

this绑定规则一共有5种情况：

1. 默认绑定（严格：undefined/非严格模式：window）
2. 隐式绑定：指向最后调用该函数的对象
3. 显式绑定：通过call，apply显式指定this指向。
4. new绑定：this指向的是新创建的实例。
5. 箭头函数绑定

特殊说明：
+ 其实大部分情况下可以用一句话来概括，**this总是指向最后调用该函数的对象**。
+ 但是对于箭头函数并不是这样，是根据外层（函数或者全局）作用域（词法作用域）来决定this。
+ **微任务**中的简单调用的函数this指向window严格下指向undefined，而在**setTimeout定时器,立即执行函数**中的回调函数不管在严格还是非严格环境下this永远指向window,

eg1：
```js
    /**
     * 非严格模式  
     */
    
    var name = 'window'
    
    var person1 = {
      name: 'person1',
      show1: function () {
        console.log(this.name)
      },
      show2: () => console.log(this.name),
      show3: function () {
        return function () {
          console.log(this.name)
        }
      },
      show4: function () {
        return () => console.log(this.name)
      }
    }
    var person2 = { name: 'person2' }
    
    person1.show1() // 'person1'
    person1.show1.call(person2) // 'person2'
    
    person1.show2() // 'window'
    person1.show2.call(person2) // 'window'
    
    person1.show3()() // 'window'
    person1.show3().call(person2) // 'person2'
    person1.show3.call(person2)() // 'window'
    
    person1.show4()() // 'window' error =》 'person1' 箭头函数绑定，this指向外层作用域，即person1函数作用域
    person1.show4().call(person2) // 'window' error =》'person1'，箭头函数绑定，this指向外层作用域，即person1函数作用域
    person1.show4.call(person2)() // 'window' error =》'person2'，间接改变箭头函数this的指向。
```
说明：最后一个person1.show4.call(person2)()有点复杂，我们来一层一层的剥开。

1. 首先是var func1 = person1.show4.call(person2)，这是显式绑定，调用者是person2，show4函数指向的是person2。
2. 然后是func1()，箭头函数绑定，this指向外层作用域，即person2函数作用域
首先要说明的是，箭头函数绑定中，this指向外层作用域，并不一定是第一层，也不一定是第二层。

因为没有自身的this，所以只能根据作用域链往上层查找，直到找到一个绑定了this的函数作用域，并指向调用该普通函数的对象。

eg2：

```js
    /**
     * 非严格模式
     */
    
    var name = 'window'
    
    function Person (name) {
      this.name = name;
      this.show1 = function () {
        console.log(this.name)
      }
      this.show2 = () => console.log(this.name)
      this.show3 = function () {
        return function () {
          console.log(this.name)
        }
      }
      this.show4 = function () {
        return () => console.log(this.name)
      }
    }
    
    var personA = new Person('personA')
    var personB = new Person('personB')
    
    personA.show1() // 'personA'
    personA.show1.call(personB) // 'personB'
    
    personA.show2() // 'window' error =》 'personA' 没想通
    personA.show2.call(personB) // 'window' error =》 'personA' 没想通
    
    personA.show3()() // 'window'
    personA.show3().call(personB) // 'personB'
    personA.show3.call(personB)() // 'window'
    
    personA.show4()() // 'personA'
    personA.show4().call(personB) // 'personA'
    personA.show4.call(personB)() // 'personB'
```

eg3:
```js
    var num = 1;
    var myObject = {
        num: 2,
        add: function() {
            this.num = 3; // 隐式绑定，myObject.num = 3
            (function() {
                console.log(this.num); // 默认绑定，num = 1
                this.num = 4; // 默认绑定修改，num = 4
            })();
            console.log(this.num); // 隐式绑定， 3
        },
        sub: function() {
            console.log(this.num)
        }
    }
    myObject.add(); // 1， 3
    console.log(myObject.num); // 3
    console.log(num); // 4
    var sub = myObject.sub;
    sub(); // 隐式绑定丢失，还是window来调用sub，输出：4
```

eg4:
```js
var obj = {
    // 2、say 是立即执行函数
    say: function() {
        function _say() {
            // 5、输出 window
            console.log(this);
        }
        // 3、编译阶段 obj 赋值为 undefined
        console.log(obj);
        // 4、obj是 undefined，bind 本身是 call实现，
        // call 接收 undefined 会绑定到 window。
        return _say.bind(obj);
    }(),
};
obj.say();
```
