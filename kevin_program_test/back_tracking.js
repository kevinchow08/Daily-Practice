// 递归与回溯：
// 回溯法也可以叫做回溯搜索法，它是一种搜索的方式。

// 回溯是递归的副产品，只要有递归就会有回溯。
// 「所以以下讲解中，回溯函数也就是递归函数，指的都是一个函数」

// 回溯法的性能如何呢，这里要和大家说清楚了，「虽然回溯法很难，很不好理解，但是回溯法并不是什么高效的算法」。
// 「因为回溯的本质是穷举，穷举所有可能，然后选出我们想要的答案」，如果想让回溯法高效一些，可以加一些剪枝的操作，但也改不了回溯法就是穷举的本质


// 回溯法，一般可以解决如下几种问题：
//
// 组合问题：N个数里面按一定规则找出k个数的集合
// 排列问题：N个数按一定规则全排列，有几种排列方式
// 子集问题：一个N个数的集合里有多少符合条件的子集
// 切割问题：一个字符串按一定规则有几种切割方式
// 棋盘问题：N皇后，解数独等等

// 组合是不强调元素顺序的，排列是强调元素顺序」。
// 例如：{1, 2} 和 {2, 1} 在组合上，就是一个集合，因为不强调顺序，而要是排列的话，{1, 2} 和 {2, 1} 就是两个集合了。
// 记住组合无序，排列有序，就可以了


// 重点：回溯法解决的问题都可以抽象为树形结构
// 是的，我指的是所有回溯法的问题都可以抽象为树形结构！

// 回溯法解决的都是在集合中递归查找子集，「集合的大小就构成了树的宽度，递归的深度，都构成的树的深度」
// 递归就要有终止条件，所以必然是一颗高度有限的树

// 回溯三部曲
// 1，回溯函数模板返回值以及参数
// 2，回溯函数终止条件
// 3，回溯搜索的遍历过程：
// 回溯法一般是在集合中递归搜索，集合的大小构成了树的宽度，递归的深度构成的树的深度

// 回溯算法模板框架如下：
// void backtracking(参数) {
//     if (终止条件) {
//         存放结果;
//         return;
//     }
//
//     for (选择：本层集合中元素（树中节点孩子的数量就是集合的大小）) {
//         处理节点;
//         backtracking(路径，选择列表); // 递归
//         回溯，撤销处理结果
//     }
// }

// 习题训练
// 基本组合：
// 给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k 个数的组合。
// 你可以按 任何顺序 返回答案。
const combine = function (n, k) {
    // 结果数组
    const res = []
    // 存放当前组合的数组
    const path = []
    // 开始执行递归遍历
    backtracking(1)
    function backtracking(startIndex) {
        // 递归终止条件
        if (path.length === k) {
            res.push(path.slice())
            return
        }
        // 遍历剩余集合
        for (let i = startIndex; i <= n; i++) {
            // 节点处理
            path.push(i)
            // 递归
            backtracking(i + 1)
            // 回溯
            path.pop()
        }
    }
    return res
}

// 子集1：
// 给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。
// 解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。
// 输入：nums = [1,2,3]
// 输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
// 输入：nums = [0]
// 输出：[[],[0]]

const subsets = function (nums) {
    const result = []
    const path = []
    backTracking(0)
    function backTracking(startIndex) {
        // 每一个节点都要收集起来
        result.push(path.slice())
        // 其实可以不需要加终止条件，因为startIndex >= nums.size()，本层for循环本来也结束了
        if (startIndex >= nums.length) {
            return
        }
        for (let i = startIndex; i <= nums.length - 1; i++) {
            path.push(nums[i])
            backTracking(i + 1)
            path.pop()
        }
    }
    return result
}

// 注意：组合问题和分割问题都是收集树的叶子节点，而子集问题是找树的所有节点！


// 组合总和1：
// 给定一个无重复元素的正整数数组candidates和一个正整数target，找出candidates中所有可以使数字和为目标数target的唯一组合。
// candidates中的数字可以无限制重复被选取。如果至少一个所选数字数量不同，则两种组合是唯一的。
// 对于给定的输入，保证和为target 的唯一组合数少于 150 个。

// 输入: candidates = [2,3,6,7], target = 7
// 输出: [[7],[2,2,3]]
const combinationSum = function (candidates, target) {
    const result = []
    const path = []
    backTracking(0, 0)
    function backTracking(startIndex, sum) {
        if (sum > target) {
            return
        }
        if (sum === target) {
            result.push(path.slice())
        }
        for (let i = startIndex; i < candidates.length; i++) {
            // 求和，操作节点
            sum = sum + candidates[i]
            path.push(candidates[i])
            // 递归，path中可以有重复元素, sum也要当参数传入。
            backTracking(i, sum)
            // 回溯：
            sum = sum - candidates[i]
            path.pop()
        }
    }
    return result
}

// 组合总和2：
// 给定一个数组candidates和一个目标数target，找出candidates中所有可以使数字和为target的组合。
// candidates中的每个数字在每个组合中只能使用一次。
// 注意：解集不能包含重复的组合。

// 输入: candidates =[10,1,2,7,6,1,5], target =8,
//     输出:
// [
//     [1,1,6],
//     [1,2,5],
//     [1,7],
//     [2,6]
// ]

// 本题candidates 中的每个数字在每个组合中只能使用一次。
// 本题数组candidates的元素是有重复的，而上述组合总和是无重复元素的数组candidates
// 所以，本题重点在于去重（同一层的节点去重）
// 元素在同一个组合内是可以重复的，怎么重复都没事，但两个组合不能相同：[1,1,2]=>ok,[1,2,5]和[2,1,5]=>not ok.这是一组相同组合。组合内的元素是无序的
// 重点：所以我们要去重的是同一树层上的“使用过”，同一树枝上的都是一个组合里的元素，不用去重
const combinationSum2 = function (candidates, target) {
    const result = []
    const path = []
    // 对入参数组排序，方便去重
    candidates.sort()
    // 定义一个used数组用来辅助去重。
    const used = new Array(candidates.length).fill(false)
    backTracking(0, 0)
    function backTracking(startIndex, sum) {
        if (sum > target) {
            return
        }
        if (sum === target) {
            result.push(path.slice())
        }
        for (let i = startIndex; i < candidates.length; i++) {
            // used[i - 1] == true，说明同一树支candidates[i - 1]使用过
            // used[i - 1] == false，说明同一树层candidates[i - 1]使用过
            if (candidates[i] === candidates[i - 1] && used[i - 1] === false) {
                continue
            }
            // 求和，操作节点
            sum = sum + candidates[i]
            used[i] = true
            path.push(candidates[i])
            // 递归，path中可以有重复元素, sum也要当参数传入。
            backTracking(i + 1, sum)
            // 回溯：
            sum = sum - candidates[i]
            used[i] = false
            path.pop()
        }
    }
    return result
}


// 子集2：
// 给定一个可能包含重复元素的整数数组 nums，返回该数组所有可能的子集（幂集）。

// 说明：解集不能包含重复的子集。
// 示例:
// 输入：nums = [1,2,2]
// 输出：[[],[1],[1,2],[1,2,2],[2],[2,2]]

const subsetsWithDup = function (nums) {
    const result = []
    const path = []
    nums.sort()
    // 定义辅助数组用来去重
    const used = new Array(nums.length).fill(false)
    backTracking(0)
    function backTracking(startIndex) {
        result.push(path.slice())
        if (startIndex >= nums.length) {
            return
        }
        for (let i = startIndex; i < nums.length; i++) {
            if (nums[i] === nums[i - 1] && used[i - 1] === false) {
                continue
            }
            path.push(nums[i])
            used[i] = true
            backTracking(i + 1)
            used[i] = false
            path.pop()
        }
    }
    return result
}

// 分割回文字符串，全排列问题。

// 全排列问题：
// 给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。

// 输入：nums = [1,2,3]
// 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

// 注意：排列不同与组合，组合中的元素是无序的，排列中的元素是有序的。
const permute = function (nums) {
    const result = []
    const path = []
    const visited = {}
    backTracking(path.length)
    function backTracking(len) {
        // 注意递归结束条件
        if (len === nums.length) {
            result.push(path.slice())
            return
        }
        for (let i = 0; i < nums.length; i++) {
            if (!visited[nums[i]]) {
                path.push(nums[i])
                visited[nums[i]] = true
                backTracking(path.length)
                path.pop()
                visited[nums[i]] = false
            }
        }
    }
    return result
}
