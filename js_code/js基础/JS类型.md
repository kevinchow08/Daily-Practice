# 类型相关问题的总结

## 原始（Primitive）类型

在 JS 中，存在着 6 种原始值，分别是：

- `boolean`
- `null`
- `undefined`
- `number`
- `string`
- `symbol`

都能通过typeof(返回字符串形式)直接判断类型，还有对象类型function也可判断

注意：
`typeof null => 'object'`

### 非原始类型判断区分(以及null)

数组：
+ 使用 `Array.isArray(v)` 判断数组
+ 使用 `[] instanceof Array` 判断是否在Array的原型链上，即可判断是否为数组.
+ `[].constructor === Array` 通过构造器属性判断是否为数组
+ 也可使用Object.prototype.toString.call([])判断值是否为`[object Array]`来判断数组

判断对象

Object.prototype.toString.call({})结果为`[object Object]`则为对象
{} instanceof Object判断是否在Object的原型链上，即可判断是否为对象
{}.constructor === Object通过其构造函数判断是否为对象

判断函数

+ 使用func typeof function判断func是否为函数
+ 使用func instanceof Function判断func是否为函数
+ 通过func.constructor === Function判断是否为函数
+ 也可使用Object.prototype.toString.call(func)判断值是否为`[object Function]`来判断func

判断null

+ 最简单的是通过 `null===null` 来判断是否为null
+ `Object.prototype.__proto__===a` 判断a是否为原始对象原型的原型即null
+ `typeof (a) == 'object' && !a` 通过typeof判断null为对象，且对象类型只有null转换为Boolean为false

注意：所有对象都有toString(),但Function，String等对toString()进行了重写

eg:
```js
var a = function() {}
a.toString()
// 'function() {}'
Object.prototype.toString.call(a)
// '[object Function]'
```

类型转化：
[见文档](https://zhuanlan.zhihu.com/p/85731460)


### 要注意的是：
1. 转Boolean

    在条件判断时，除了 `undefined`， `null`， `false`， `NaN`， `''`， `0`， `-0`，其他所有值都转为 `true`，包括所有对象。

2. 对象转原始类型

    对象在转换类型的时候，会调用内置的 `[[ToPrimitive]]` 函数，对于该函数来说，算法逻辑一般来说如下：
    
    + 如果已经是原始类型了，那就不需要转换了
    + 调用 `x.valueOf()`，如果转换为基础类型，就返回转换的值
    + 调用 `x.toString()`，如果转换为基础类型，就返回转换的值
    + 如果都没有返回原始类型，就会报错

    当然你也可以重写 `Symbol.toPrimitive` ，该方法在转原始类型时调用优先级最高。

```js
let a = {
  valueOf() {
    return 0
  },
  toString() {
    return '1'
  },
  [Symbol.toPrimitive]() {
    return 2
  }
}
1 + a // => 3
```

3. 四则运算符

    加法运算符不同于其他几个运算符，它有以下几个特点：
    
    - 运算中其中一方为字符串，那么就会把另一方也转换为字符串
    - 如果一方不是字符串或者数字，那么会将它转换为数字或者字符串

```js
1 + '1' // '11'
true + true // 2
4 + [1,2,3]
// "41,2,3"
// 数组会先调用valueOf(),其次再调用toString()将其转为基本类型
```

另外对于加法还需要注意这个表达式 `'a' + + 'b'`

`'a' + + 'b' // -> "aNaN"`

`+'b'` 为NaN

`+'1'` 为 1 这样的形式来快速获取 `number` 类型

那么对于除了加法的运算符来说，只要其中一方是数字，那么另一方就会被转为数字
```js
4 * '3' // 12
4 * [] // 0
4 * [1, 2] // NaN
```
