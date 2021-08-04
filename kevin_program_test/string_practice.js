// 字符串反转
const strReverse = function (str) {
    return str.split('').reverse().join('')
}

// 字符串反转不用reverse
const reverseString = function (s) {
    const len = s.length
    let j = len - 1
    for (let i = 0; i < len/2; i++) {
        let temp = s[i]
        s[i] = s[j]
        s[j] = temp
        j--
    }
    return s
}


// 回文字符串，就是正着读和倒着读都一模一样样的字符串，比如这样的：'yessey'

// 判断是否为回文字符串
const isPalindrome1 = function (str) {
    const string_reverse = strReverse(str)
    return string_reverse === str
}

// 利用对称性判断是否为回文字符串
const isPalindrome2 = function (str) {
    const len = str.length
    for (let i = 0; i < len / 2; i++) {
        if (str[i] !== str[len - i - 1]) {
            return false
        }
    }
    return true
}

// > 真题描述：给定一个非空字符串 s，最多删除一个字符。判断是否能成为回文字符串。
//
// > 示例 1:
//
// 输入: "aba"
// 输出: True
// 示例 2:
// 输入: "abca"
// 输出: True
// 解释: 你可以删除c字符。
// 注意: 字符串只包含从 a-z 的小写字母。字符串的最大长度是50000。

const validPalindrome = function (str) {
    let i = 0
    let j = str.length - 1
    while (i < j && str[i] === str[j]) {
        i++
        j--
    }
    // 左指针跳过
    if (isPalindrome(i + 1, j)) {
        return true
    }

    if (isPalindrome(i, j - 1)) {
        return true
    }

    function isPalindrome(st, ed) {
        while (st < ed) {
            if (str[st] !== str[ed]) {
                return false
            }
            st++
            ed--
        }
        return true
    }
    return false
}

// 真题描述： 设计一个支持以下两种操作的数据结构：
//
// void addWord(word)
// bool search(word)
// search(word) 可以搜索文字或正则表达式字符串，字符串只包含字母 . 或 a-z 。
// . 可以表示任何一个字母。
//
// 示例:
//
// addWord("bad")
// addWord("dad")
// addWord("mad")
// search("pad") -> false
// search("bad") -> true
// search(".ad") -> true
// search("b..") -> true
// 说明:
// 你可以假设所有单词都是由小写字母 a-z 组成的。

// 设置一个map。来存储添加进的字符串
// 注意，这里为了降低查找时的复杂度，我们可以考虑以字符串的长度为 key，相同长度的字符串存在一个数组中，这样可以提高我们后续定位的效率

// 难点在于 search 这个 API，它既可以搜索文字，又可以搜索正则表达式。
// 因此我们在搜索前需要额外判断一下，传入的到底是普通字符串，还是正则表达式。
// 若是普通字符串，则直接去 Map 中查找是否有这个 key；
// 若是正则表达式，则创建一个正则表达式对象，判断 Map 中相同长度的字符串里，是否存在一个能够与这个正则相匹配

const WordDictionary = class {
    // words存储字符串的结构
    // words:{
    //     1: [],
    //     2: [],
    //     3: []
    // }
    constructor() {
        this.words = {}
    }
    addWord(word) {
        if (this.words[word.length]) {
            this.words[word.length].push(word)
        } else {
            this.words[word.length] = [word]
        }
    }
    search(word) {
        const len = word.length
        if (!word.includes('.')) {
            return this.words[len] ? this.words[len].includes(word) : false
        }
        const reg = new RegExp(word)
        return this.words[len] ? this.words[len].some(item => reg.test(item)) : false
    }
}

// > 真题描述：请你来实现一个 atoi 函数，使其能将字符串转换成整数。
//
// 首先，该函数会根据需要丢弃无用的开头空格字符，直到寻找到第一个非空格的字符为止。
// 当我们寻找到的第一个非空字符为正或者负号时，则将该符号与之后面尽可能多的连续数字组合起来，作为该整数的正负号；假如第一个非空字符是数字，则直接将其与之后连续的数字字符组合起来，形成整数。
// 该字符串除了有效的整数部分之后也可能会存在多余的字符，这些字符可以被忽略，它们对于函数不应该造成影响。
// 注意：假如该字符串中的第一个非空格字符不是一个有效整数字符、字符串为空或字符串仅包含空白字符时，则你的函数不需要进行转换。
// 在任何情况下，若函数不能进行有效的转换时，请返回 0。
//
// > 说明：
//
// 假设我们的环境只能存储 32 位大小的有符号整数，那么其数值范围为 [−2^31, 2^31 − 1]。如果数值超过这个范围，请返回  INT_MAX (2^31 − 1) 或 INT_MIN (−2^31) 。
//
// > 示例 1:
//
// 输入: "42"
// 输出: 42
//
// > 示例 2:
//
// 输入: " -42"
// 输出: -42
// 解释: 第一个非空白字符为 '-', 它是一个负号。
// 我们尽可能将负号与后面所有连续出现的数字组合起来，最后得到 -42 。
//
// > 示例 3:
//
// 输入: "4193 with words"
// 输出: 4193
// 解释: 转换截止于数字 '3' ，因为它的下一个字符不为数字。
//
// > 示例 4:
//
// 输入: "words and 987"
// 输出: 0
// 解释: 第一个非空字符是 'w', 但它不是数字或正、负号。 因此无法执行有效的转换。
//
// > 示例 5:
//
// 输入: "-91283472332"
// 输出: -2147483648
// 解释: 数字 "-91283472332" 超过 32 位有符号整数范围。因此返回 INT_MIN (−2^31) 。


// 先写出满足条件的正则表达式：

const myAtoi = function (str) {
    const reg = /\s*([+|-]?\d+).*/
    let targetNum = 0
    if (reg.test(str)) {
        const res = Number(str.match(reg)[1])
        if (res > Math.pow(2, 31) - 1) {
            return 2^31
        } else if (res < -Math.pow(2, 31)) {
            return -2^31
        } else {
            return targetNum + res
        }

    }
    return targetNum
}
