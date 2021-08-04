// > 题目描述：给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。
//
// > 有效字符串需满足：
//
// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
// 注意空字符串可被认为是有效字符串。
//
// > 示例 1:
//
// 输入: "()"
// 输出: true
//
// > 示例 2:
//
// 输入: "()[]{}"
// 输出: true
//
// > 示例 3:
//
// 输入: "(]"
// 输出: false
//
// > 示例 4:
//
// 输入: "([)]"
// 输出: false
// 示例 5:
// 输入: "{[]}"
// 输出: true
const map = {
    '(': ')',
    '{': '}',
    '[': ']'
}

const isValid = function (s) {
    // 先定义一个栈结构，用来装左括号
    const stack = []
    for (let i = 0; i < s.length; i++) {
        const char = s[i]
        if (char === '(' || char === '[' || char === '{') {
            stack.push(map[char])
        } else {
            // 遇见右括号的情况，再遇见右括号时，栈顶肯定有对应的左括号与之匹配。
            if (!stack.length || stack.pop() !== char) {
                // stack为空的时候，没有与之匹配的左括号，所以返回false。
                // stack不为空时，才判断左右括号是否匹配
                return false
            }
        }
    }
    return !stack.length
}


// > 题目描述: 根据每日气温列表，请重新生成一个列表，对应位置的输出是需要再等待多久温度才会升高超过该日的天数。如果之后都不会升高，请在该位置用 0 来代替。
//
// > 例如，给定一个列表 temperatures = [73, 74, 75, 71, 69, 72, 76, 73]，你的输出应该是 [1, 1, 4, 2, 1, 1, 0, 0]。
//
// > 提示：气温 列表长度的范围是 [1, 30000]。每个气温的值的均为华氏度，都是在 [30, 100] 范围内的整数。

const dailyTemperatures = function (T) {
    // 温度列表的长度
    const len = T.length
    // 初始化一个栈结构，只做push，pop的操作
    const stack = []
    // 定义一个结果数组，其长度与温度列表相同，用0做填充位。
    const res = new Array(len).fill(0)
    // 开始遍历：
    for (let i = 0; i < len; i++) {
        const cur_t = T[i]
        if (!stack.length) {
            stack.push(cur_t)
        }
        while (cur_t > stack[stack.length - 1]) {
          const top = stack.pop()
          const topIndex = T.indexOf(top)
          res[topIndex] = i - topIndex
        }
        stack.push(cur_t)
    }
    return res
}


// > 题目描述：设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。
//
// > push(x) —— 将元素 x 推入栈中。
//
// pop() —— 删除栈顶的元素。
// top() —— 获取栈顶元素。
// getMin() —— 检索栈中的最小元素。
//
// > 示例:
//
// MinStack minStack = new MinStack();
// minStack.push(-2);
// minStack.push(0);
// minStack.push(-3);
// minStack.getMin(); --> 返回 -3.
// minStack.pop();
// minStack.top(); --> 返回 0.
// minStack.getMin(); --> 返回 -2.

// 方法一：常规解法，getMin方法的复杂度为O(n)
const MinStack = class {
    constructor() {
        this.stack = []
    }
    push(val) {
        return this.stack.push(val)
    }
    pop() {
        if (!this.stack.length) {
            return undefined
        }
        return this.stack.pop()
    }
    top() {
        if (!this.stack.length) {
            return undefined
        }
        return this.stack[this.stack.length - 1]
    }
    getMin() {
        let minValue = Infinity
        for (let i = 0; i < this.stack.length; i++) {
            const value = this.stack[i]
            if (value < minValue) {
                minValue = value
            }
        }
        return minValue
    }
}
// 方法二：这里我们需要实现的是一个从栈底到栈顶呈递减趋势的栈（递减栈）
// - 取最小值：由于整个栈从栈底到栈顶递减，因此栈顶元素就是最小元素。
// - 若有新元素入栈：判断是不是比栈顶元素还要小，否则不准进入 `stack2`。
// - 若有元素出栈：判断是不是和栈顶元素相等，如果是的话，`stack2` 也要出栈。

const MinStack1 = class {
    constructor() {
        this.stack1 = []
        this.stack2 = []
    }
    push(val) {
        this.stack1.push(val)
        if (!this.stack2.length || this.stack2[this.stack2.length - 1] >= val) {
            this.stack2.push(val)
        }
    }
    pop() {
        if (this.stack1.pop() === this.stack2[this.stack2.length - 1]) {
            this.stack2.pop()
        }
    }
    top() {
        return this.stack1[this.stack1.length - 1]
    }
    getMin() {
        return this.stack2[this.stack2.length - 1]
    }
}
