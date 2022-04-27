// 本文列举reduce函数常用的案例
// 1 计算数组之和

var sumArr = (arr, initialValue) => {
    return arr.reduce((accumulator, currentValue) => { return accumulator + currentValue}, initialValue)
}

console.log(sumArr([1,2,3,4,5,6,7,8]))

// 2 累加对象数组里的值
// 要累加对象数组中包含的值，必须提供初始值，以便各个item正确通过你的函数。
var initialValue = 0;
var sum = [{x: 1}, {x:2}, {x:3}].reduce(
    (accumulator, currentValue) => accumulator + currentValue.x
    ,initialValue
);

console.log(sum) // logs 6

// 二维数组转一维数组
var flattened = (arr) => {
    return arr.reduce((acc, cur) => {
        return acc.concat(cur)
    }, [])
}

console.log(flattened([[1,2], [3,4], [4,5], [2,4]]))

// 计算数组中每个元素出现的次数
var names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice']
var countedNames = names.reduce((acc, cur) => {
    if(!acc[cur]) {
        acc[cur] = 1
    } else {
        acc[cur]++
    }
    return acc
}, {})

// 按属性对object分类

/**
 * var people = [
    { name: 'Alice', age: 21 },
    { name: 'Max', age: 20 },
    { name: 'Jane', age: 20 }
];
result:
groupedPeople is:
{
  20: [
    { name: 'Max', age: 20 },
    { name: 'Jane', age: 20 }
  ],
  21: [{ name: 'Alice', age: 21 }]
}
 */

 function groupByProperty(json, property) {
    return json.reduce((acc, cur) => {
        var key = cur[property]
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(cur)
        return acc
    }, {})
 }

//  数组去重
let myArray = ['a', 'b', 'a', 'b', 'c', 'e', 'e', 'c', 'd', 'd', 'd', 'd']
// 1
var myOrderedArray = function(arr) {
    return arr.reduce((acc, cur) => {
        if (acc.indexOf(cur) === -1) {
            acc.push(cur)
        }
        return acc
    }, [])
}
console.log(myOrderedArray(myArray))
// 2
var filterArray = function (arr) {
    return arr.filter((item, index, arr) => arr.indexOf(item) === index)
}

// 数组reduce反转：
let reverse = function (arr) {
    return arr.reduce((acc, cur) => {
        return [cur].concat(acc)
    }, [])
}

/*
两个函数的组合
let composeTwo = function (fn2, fn1) {
    return function (x) {
        return fn2(fn1(x))
    }
}
*/

// 函数compose的实现：利用reduceRight
let compose = function (...fns) {
     return function (value) {
        return fns.reduceRight((acc, fn) => {
            return fn(acc)
        }, value)
     }
}

// 使用：入参函数从右至左执行。
var arr = [1, 2, [2, 10, 0, [5, 6, 4, [7, 1]]]];
var flatten = function (arr) {
    while(arr.some(Array.isArray)){
        arr = [].concat(...arr)
    }
    return arr;
};
var unique = function (arr) { return Array.from(new Set(arr)); };
let a = compose(unique, flatten) // [1, 2, 10, 0, 5, 6, 4, 7]

// 管道：入参函数从左至右执行。
const pipe = function (...fns) {
    return function (value) {
        return fns.reverse((acc, fn) => {
            return fn(acc)
        }, value)
    }
}
