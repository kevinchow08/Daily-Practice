// 背包标准问题：有N件物品和一个最多能被重量为W 的背包。第i件物品的重量是weight[i]，得到的价值是value[i] 。
// 每 件物品只能用一次，求解将哪些物品装入背包里物品价值总和最大。

// 二维dp数组01背包

// 确定dp数组：对于背包问题，有一种写法， 是使用二维数组。
// 即dp[i][j] 表示从下标为[0-i]的物品里任意取，放进容量为j的背包，价值总和最大是多少

// 确定递推公式：
// dp[i][j]又两个方向推出：放第i件物品和不放第i件物品
// 不放：dp[i - 1][j].即：dp[i][j]最大价值由 0 到 i-1个物品就可以实现
// 放：dp[i - 1][j - weight[i]] + value[i]. dp[i - 1][j - weight[i]] 为背包容量为j - weight[i]的时候不放物品i的最大价值
// 所以：dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i])

// 确定初始化，一定要和dp数组的定义吻合，否则到递推公式的时候就会越来越乱
// 当i为0：表示只有第0个物品。所以当背包的容量大于等于第0个物品的质量时，dp[0][j]为value[0]
// 当j为0：表示背包容量为0。所以dp[i][0]为0

// 关于遍历顺序，先遍历i，还是先遍历j。
// 因为：dp[i][j]都是由 i - 1 行递推而来。即由i，j单元格的上方和左上方的dp推导而来
// 所以：先遍历i,还是先遍历j都无所谓

// 可以手动推导下二维数组dp的情况

// 代码：

// 第0-i个物品的重量
const weight = [1, 3, 4]
// 第0-i个物品的价值
const value = [15, 20, 30]
// 背包重量
const bagWeight = 4

const bag_problem1 = (weight, value, bagWeight) => {
    // 初始化一个二维dp数组
    const dp = new Array(weight.length).fill().map(item => new Array(bagWeight))

    // dp数组的初始化，i = 0的情况
    for (let j = 0; j <= bagWeight; j++) {
        if (j >= weight[0]) {
            dp[0][j] = value[0]
        } else {
            dp[0][j] = 0
        }
    }
    // dp数组的初始化，j = 0的情况
    for (let i = 0; i < weight.length; i++) {
        dp[i][0] = 0
    }
    // 嵌套遍历，得出递推公式
    // 先遍历物品
    for (let i = 1; i < weight.length; i++) {
        for (let j = 1; j <= bagWeight; j++) {
            // 当j递增，大于等于当前第i个物品的重量时
            if (j >= weight[i]) {
                // dp最大值，由放入物品i和不放入物品i的最大值比较得出
                dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i])
            } else {
            // 当j递增，小于当前第i个物品的重量时
            // 则不用考虑想背包中放入物品i。
                dp[i][j] = dp[i - 1][j]
            }
        }
    }
    return dp[weight.length - 1][bagWeight]
}

// 再思考一维数组的背包问题解法：

