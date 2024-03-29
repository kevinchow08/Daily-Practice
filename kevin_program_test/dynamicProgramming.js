// 动态规划的入门
// 从“爬楼梯”问题说起

// > 题目描述：假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
// 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

// 思路分析与编码实现

// 这道题目有两个关键的特征：
// 1. 要求你给出达成某个目的的**解法个数**
// 2. 不要求你给出每一种解法对应的具体路径

// 这样的问题，往往可以用动态规划进行求解。

// 在这道题里，“问题的终点”指的就是走到第 n 阶楼梯这个目标对应的路径数，我们把它记为 f(n)
// 那么站在第 n 阶楼梯这个视角， 有哪些后退的可能性呢？按照题目中的要求，一次只能后退 1 步或者 2 步。因此可以定位到从第 n 阶楼梯只能后退到第 n-1 或者第 n-2 阶。
// 我们把抵达第 n-1 阶楼梯对应的路径数记为f(n-1)，把抵达第 n-2 阶楼梯对应的路径数记为 f(n-2)，不难得出以下关系：
// f(n) = f(n-1) + f(n-2)

// 一：故，向前递推，到f(1), f(2),可得：

function climbStairs(n) {
    if (n === 1 || n === 2) {
        return n
    }
    return climbStairs(n - 1) + climbStairs(n - 2)
}

// 二：但是这个解法问题比较大,重复计算带来了时间效率上的问题，要想解决这类问题.
// 最直接的思路就是用空间换时间，也就是想办法记住之前已经求解过的结果

const arr = []
function climbStairs(n) {
    if (arr[n]) {
        return arr[n]
    }
    // 将本次n计算得结果缓存起来，放进arr数组中，当下次访问得时候，就可以率先返回值
    arr[n] = (n === 1 || n === 2) ?  n :  climbStairs(n - 1) + climbStairs(n - 2)
    return arr[n]
}
// 以上这种在递归的过程中，不断保存已经计算出的结果，从而避免重复计算的手法，叫做 记忆化搜索

// 三：记忆化搜索转化为动态规划
// 要想完成记忆化搜索与动态规划之间的转化，首先要清楚两者间的区别：

// 先说 记忆化搜索，记忆化搜索可以理解为优化过后的递归。递归往往可以基于树形思维模型来做
// 我们基于树形思维模型来解题时，实际上是站在了一个比较大的未知数量级（也就是最终的那个 n ），来不断进行拆分，最终拆回较小的已知数量级（f(1)、f(2)）
// 这个过程是一个明显的自顶向下的过程。

// 动态规划则恰恰相反，是一个 自底向上 的过程。
// 它要求我们站在已知的角度，通过定位已知和未知之间的关系，一步一步向前推导，进而求解出未知的值
// 在这道题中，以 f(1) 和 f(2) 为起点，不断求和，循环递增 n 的值，我们就能够求出 f(n) 了：
function climbStairs(n) {
    const arr = []
    // 初始化已知值
    arr[1] = 1
    arr[2] = 2
    // 循环遍历出arr[3]到arr[n]的结果
    // 要得到arr[n],也要从arr[3]开始算起
    for (let i = 3; i <= n; i++) {
        arr[i] = arr[i - 1] + arr[i - 2]
    }
    return arr[n]
}


// 总结一下，对于动态规划，笔者建议大家优先选择这样的分析路径：

// 1. 递归思想明确树形思维模型：找到问题终点，思考倒退的姿势，往往可以帮助你更快速地明确 状态间的关系
// 2. 结合记忆化搜索，明确 状态转移方程
// 3. 递归代码转化为迭代表达（这一步不一定是必要的，1、2本身为思维路径，而并非代码实现。若你成长为熟手，2中分析出来的状态转移方程可以直接往循环里塞，根本不需要转换）

// 动规五部曲: 这里我们要用一个dp数组来保存递归的结果

// 1. 确定dp数组以及下标的含义 dp[i]的定义为:第i个数的斐波那契数值是dp[i]

// 2. 确定递推公式
// 为什么这是一道非常简单的入⻔题目呢? 因为题目已经把递推公式直接给我们了:状态转移方程 dp[i] = dp[i - 1] + dp[i - 2];

// 3. dp数组如何初始化

// 4. 确定遍历顺序
// 从递归公式dp[i] = dp[i - 1] + dp[i - 2];中可以看出，dp[i]是依赖 dp[i - 1] 和 dp[i - 2]，那么遍历的顺序一定是从前到后遍历的

// 5. 举例推导dp数组
// 按照这个递推公式dp[i] = dp[i - 1] + dp[i - 2]，我们来推导一下，当N为10的时候，dp数组应该是如下的 数列:
// 0 1 1 2 3 5 8 13 21 34 55 如果代码写出来，发现结果不对，就把dp数组打印出来看看和我们推导的数列是不是一致的。

// 爬楼梯拓展：
// 这道题目还可以继续深化，就是一步一个台阶，两个台阶，三个台阶，直到 m个台阶，有多少种方法爬 到n阶楼顶。
function climbStairs(n, m) {
    const arr = []
    // 初始化arr数组
    arr[1] = 1
    for (let i = 2; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (i >= j) {
                arr[i] += arr[i - j]
            }
        }
    }
    return arr[n]
}

// 746. 使用最小花费爬楼梯
// 数组的每个下标作为一个阶梯，第 i 个阶梯对应着一个非负数的体力花费值 cost[i](下标从 0 开始)。
// 每当你爬上一个阶梯你都要花费对应的体力值，一旦支付了相应的体力值，你就可以选择向上爬一个阶
// 梯或者爬两个阶梯。
// 请你找出达到楼层顶部的最低花费。在开始时，你可以选择从下标为 0 或 1 的元素作为初始阶梯。

// 示例 1:
// 输入:cost = [10, 15, 20]
// 输出:15
// 解释:最低花费是从 cost[1] 开始，然后走两步即可到阶梯顶，一共花费 15 。
//         示例 2:
// 输入:cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]
// 输出:6
// 解释:最低花费方式是从 cost[0] 开始，逐个经过那些 1 ，跳过 cost[3] ，一共花费 6 。

function minCostClimbingStairs(cost) {
    const n = cost.length
    const dp = []
    // dp[i] 为到达第i个台阶所花费的最少体力
    // 递推公式：dp[i] = min(dp[i - 1], dp[i - 2]) + cost[i]
    // 初始化
    dp[0] = cost[0]
    dp[1] = cost[1]
    for (let i = 2; i <= n; i++) {
        dp[i] = Math.min(dp[i - 1], dp[i - 2]) + cost[i]
    }
    // return dp[n], dp[n]对应的cost[n]为undefined.所以不能直接返回dp[n]
    return Math.min(dp[n - 1], dp[n - 2])
}

// 62.不同路径
// 题目链接:https://leetcode-cn.com/problems/unique-paths/
// 一个机器人位于一个 m x n 网格的左上⻆ (起始点在下图中标记为 “Start” )。
// 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下⻆(在下图中标记为 “Finish” )。
// 问总共有多少条不同的路径?

function solution(m, n) {
    // 初始化一个二维数组
    const dp = new Array(m).fill().map(item => Array(n))
    // 初始化: 第0行，第0列上的每个单元格的路径都是唯一的
    for (let i = 0; i < m; i++) {
        dp[i][0] = 1
    }
    for (let j = 0; j < n; j++) {
        dp[0][j] = 1
    }
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            // 递推公式
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
        }
    }
    return dp[m - 1][n - 1]
}

// 63. 不同路径 II（有障碍物）
// 一个机器人位于一个 m x n 网格的左上⻆ (起始点在下图中标记为“Start” )。
// 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下⻆(在下图中标记为“Finish”)。
// 现在考虑网格中有障碍物。那么从左上⻆到右下⻆将会有多少条不同的路径?

// 网格中的障碍物和空位置分别用 1 和 0 来表示。
// 输入:obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]
// 输出:2

// 有了障碍，(i, j)如果就是障碍的话应该就保持初始状态(初始状态为0)
function uniquePathsWithObstacles(obstacleGrid) {
    const n = obstacleGrid.length
    const m = obstacleGrid[0].length
    // 初始化二维数组
    // fill()作用长度为m的数组的元素为undefined
    const dp = new Array(m).fill().map(item => new Array(n))
    // 初始化
    for (let i = 0; i < m; i++) {
        dp[i][0] = obstacleGrid[i][0] === 0 ? 1 : 0
    }
    for (let j = 0; j < n; j++) {
        obstacleGrid[0][j] === 0 ? dp[0][j] = 1 : dp[0][j] = 0
    }
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = obstacleGrid[i][j] === 0 ? dp[i - 1][j] + dp[i][j - 1] : 0
        }
    }
    return dp[m - 1][n - 1]
}


// 343. 整数拆分
// 给定一个正整数 n，将其拆分为至少两个正整数的和，并使这些整数的乘积最大化。 返回你可以获得的最大乘积。

// 示例 1:

// 输入: 2
// 输出: 1
// 解释: 2 = 1 + 1, 1 × 1 = 1。

// 示例 2:

// 输入: 10
// 输出: 36
// 解释: 10 = 3 + 3 + 4, 3 × 3 × 4 = 36。

// 思路：整数拆分，重点在如何拆分
// 设dp[i]: i 为被拆分的整数, dp[i]被拆分整数的最大乘积。

// 当 i ≥ 2 时，假设对正整数 i 拆分出的第一个正整数是 j（ 1≤ j< i），则有以下两种方案
// 将 i 拆分成 j 和 i−j 的和，且 i−j 不再拆分成多个正整数，此时的乘积是 j × (i−j)；
// 将 i 拆分成 j 和 i−j 的和，且 i−j 继续拆分成多个正整数，此时的乘积是 j ×dp[i−j]。

// 初始化：dp[2] = 2.dp[0],dp[1]没有意义
function integerBreak(n) {
    const dp = []
    dp[1] = dp[0] = 0
    dp[2] = 2
    // i 为被拆分的整数
    for (let i = 3; i <= n; i++) {
        for (let j = 1; j <= i - 1; j++) {
            // j固定时的最大值
            const maxV = Math.max(j * (i - j), j * dp[i - j])
            // maxV与j为其他值时的最大值进行比对
            dp[i] = !dp[i] ? maxV : Math.max(dp[i], maxV)
        }
    }
    return dp[n]
}

// 96.不同的二叉搜索树
// 给你一个整数 n ，求恰由 n 个节点组成且节点值从 1 到 n 互不相同的 二叉搜索树 有多少种？返回满足题意的二叉搜索树的种数。
var numTrees = function(n) {
    const dp = []
    dp[0] = dp[1] = 1
    dp[2] = 2
    for (let i = 3; i <= n; i++) {
        for (let j = 1; j <= i; j++) {
            !dp[i] ? dp[i] = dp[i - j] * dp[j - 1] : dp[i] += dp[i - j] * dp[j - 1]
        }
    }
    return dp[n]
};
