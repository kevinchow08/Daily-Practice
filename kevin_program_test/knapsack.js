// 背包标准问题：有N件物品和一个最多能背重量为 W 的背包。第i件物品的重量是weight[i]，得到的价值是value[i] 。
// 每件物品只能用一次，求解将哪些物品装入背包里物品价值总和最大。

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
    // 初始化一个二维dp数组（i*j）
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

// 可以发现如果把dp[i - 1]那一层拷⻉到dp[i]上，表达式完全可以是:dp[i][j] = max(dp[i][j], dp[i][j - weight[i]] + value[i])
// 于其把dp[i - 1]这一层拷⻉到dp[i]上，不如只用一个一维数组了，只用dp[j](一维数组，也可以理解是 一个滚动数组)

// 所以定义：dp[j]表示：容量为j的背包，所背的物品价值可以最大为dp[j]

// 递推公式：dp[j] = max(dp[j], dp[j - weight[i]] + value[i])
// 背包重量为j的dp最大值实际上等于，第i-1种物品的最大值dp[j],和第i-1种物品的最大值dp[j - weight[i]]加上i的物品价值value[i]相比较而得出
// 可以看出相对于二维dp数组的写法，就是把dp[i][j]中i的维度去掉了。

// 一维dp数组如何初始化：
// dp[j]全部初始化0即可。首先dp[0] = 0，毋庸置疑。dp数组j不为0时，背包的的最大价值一定为正整数，所以先初始化0

// 遍历顺序，i从0到weight.lenght - 1正序遍历。j从bagWeight到weight[i]倒叙遍历。
// 如果j < weight[i],背包装不下。dp[j]不需要重新赋值，它就等于上一次i - 1时的dp[j]

// 为何j要倒叙遍历：防止物品i被放入多次。倒叙遍历会避开这个问题。
// 动手推导下dp数组的情况，便可看出正序遍历j是有问题的

// 推导dp数组
// i为0，dp = [0, 15, 15, 15, 15]
// i为1，dp = [0, 15, 15, 20, 30]
// i为2，dp = [0, 15, 15, 15, 15]

// 说白了就是通过遍历i，来不断更新长度为j的dp数组
// 所以时间复杂度是一样的O(n^2)，但空间复杂度降了一个纬度，又二维数组降为一维数组。

// 代码实现：
const bag_problem2 = (weight, value, bagWeight) => {
    // 初始化一个一维数组，长度为j
    const dp = new Array(bagWeight + 1).fill(0)

    for (let i = 0; i < weight.length; i++) {
        for (let j = bagWeight; j >= weight[i]; j--) {
            dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i])
        }
    }
    return dp[bagWeight]
}

// 分割等和子集
// 给定一个只包含正整数的非空数组。是否可以将这个数组分割成两个子集，使得两个子集的元素和相
// 等。
// 注意: 每个数组中的元素不会超过 100 数组的大小不会超过 200
// 示例 1:
// 输入: [1, 5, 11, 5]
// 输出: true
// 解释: 数组可以分割成 [1, 5, 5] 和 [11].


// 思路： 只要找到集合里能够出现 sum / 2 的子集总和，就算是可以分割成两个相同元素和子集了

// 转换为背包问题：
// 背包的体积为sum / 2
// 背包要放入的商品(集合里的元素)重量为 元素的数值，价值也为元素的数值
// 背包如何正好装满，说明找到了总和为 sum / 2 的子集。
// 背包中每一个元素是不可重复放入。
// 当dp[sum/2] = sum / 2时，则找到总和为sum / 2 的子集


// eg：dp[6]表示背包重量为6，假设：装入的物品为weight = [1,2].value = [1,2].可以装入，但最大价值不到6。
// 所以不满足dp[target] = target的条件

// 编码：
const canPartition = (nums) => {
    // 先求和
    let sum = 0
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i]
    }
    if (sum % 2 !== 0) {
        return false
    }
    const target = sum / 2

    // 初始化一个dp数组，长度为target+1
    const dp = new Array(target + 1).fill(0)

    // 循环遍历，不断更新dp数组
    for (let i = 0; i < nums.length; i++) {
        for (let j = target; j >= nums[i]; j--) {
            dp[j] = Math.max(dp[j], dp[j - nums[i]] + nums[i])
        }
    }
    if (dp[target] === target) {
        return true
    } else {
        return false
    }
}
