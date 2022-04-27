// 树结构的一些概念：
// 树的层次计算规则：根结点所在的那一层记为第一层，其子结点所在的就是第二层，以此类推。
// 结点和树的“高度”计算规则：叶子结点高度记为1，每向上一层高度就加1，逐层向上累加至目标结点时，所得到的的值就是目标结点的高度。树中结点的最大高度，称为“树的高度”。
// “度”的概念：一个结点开叉出去多少个子树，被记为结点的“度”。比如我们上图中，根结点的“度”就是3（见文档）。
// “叶子结点”：叶子结点就是度为0的结点。在上图中，最后一层的结点的度全部为0，所以这一层的结点都是叶子结点。

// 二叉树是指满足以下要求的树：
// 1，它可以没有根结点，作为一棵空树存在
// 2，如果它不是空树，那么必须由根结点、左子树和右子树组成，且左右子树都是二叉树

// 注意：二叉树不能被简单定义为每个结点的度都是2的树。
// 普通的树并不会区分左子树和右子树，但在二叉树中，左右子树的位置是严格约定、不能交换的


// 二叉树的编码实现
// 在 JS 中，二叉树使用对象来定义。它的结构分为三块：
// 数据域
// 左侧子结点（左子树根结点）的引用
// 右侧子结点（右子树根结点）的引用
function TreeNode(val) {
    this.val = val
    this.left = this.right = null
}

const node = TreeNode(1)

// 二叉树遍历3种方式
// 根结点 -> 左子树 -> 右子树
// 左子树 -> 根结点 -> 右子树
// 左子树 -> 右子树 -> 根结点
// 上述三个遍历顺序，就分别对应了二叉树的先序遍历、中序遍历和后序遍历规则

// 先定义一个树结构：（字面量的形式）
const root = {
    val: "A",
    left: {
        val: "B",
        left: {
            val: "D",
            left: null,
            right: null
        },
        right: {
            val: "E",
            left: null,
            right: null
        }
    },
    right: {
        val: "C",
        right: {
            val: "F",
            left: null,
            right: null
        },
        left: null
    }
}

// 先序递归遍历：
function preOrder(root) {
    if (!root) {
        return
    }
    console.log('current node：' + root.val)
    preOrder(root.left)
    preOrder(root.right)
}
// 中序遍历：
function inOrder(root) {
    if (!root) {
        return
    }
    inOrder(root.left)
    console.log('current node：' + root.val)
    inOrder(root.right)
}
// 后序遍历
function postOrder(root) {
    if (!root) {
        return
    }
    postOrder(root.left)
    postOrder(root.right)
    console.log('current node：' + root.val)
}


// 二叉树层序遍历1：广度优先搜索
function BFS(root) {
    // 先定义一个结果数组
    const res = []
    // 定义一个队列
    const queue = []
    queue.push(root)
    // 队列不为空，则一直循环操作
    while (queue.length) {
        // 获取队列头元素
        const top = queue.shift()
        res.push(top.val)
        if (top.left) {
            queue.push(top.left)
        }
        if (top.right) {
            queue.push(top.right)
        }
    }
    return res
}

// 二叉树层序遍历2: 要体现层级关系
// 注：只要我们在进入`while`循环之初，记录下这一层结点个数，然后将这个数量范围内的元素 `push` 进同一个数组，就能够实现二叉树的分层。
function levelOrder(root) {
    const queue = []
    const res = []
    if(!root) {
        return res
    }
    queue.push(root)
    while (queue.length) {
        // 保证每一次while循环，queue中存放的都是同一层的节点
        // level存放所有当前层的节点值
        const level = []
        // 获取当前层级的节点数量
        const len = queue.length
        // 遍历处理当前层级的节点，及将其字节点推入queue中。
        for (let i = 0; i < len; i++) {
            const top = queue.shift()
            if(top !== null) {
                level.push(top.val)
            }
            if (top && top.left) {
                queue.push(top.left)
            }
            if (top && top.right) {
                queue.push(top.right)
            }
        }
        res.push(level)
    }
    return res
}

// 二叉树非递归算法：
// 先序遍历：通过合理地安排入栈和出栈的时机、使栈的出栈序列符合二叉树的前序遍历规则
// 1. 将根结点入栈
// 2. 取出栈顶结点，将结点值 push 进结果数组
// 3. 若栈顶结点有右孩子，则将右孩子入栈
// 4. 若栈顶结点有左孩子，则将左孩子入栈


// 这整个过程，本质上是将当前子树的根结点入栈、出栈，随后再将其对应左右子树入栈、出栈的过程
// 重复 2、3、4 步骤，直至栈空，我们就能得到一个先序遍历序列

function preorderTraversal(root) {
    const res = []
    const stack = []
    if (!root) {
        return res
    }
    stack.push(root)
    while (stack.length) {
        const top = stack.pop()
        res.push(top.val)
        if (top.right) {
            stack.push(top.right)
        }
        if (top.left) {
            stack.push(top.left)
        }
    }
    return res
}

// 改变出栈顺序和进入res数组的顺序就可以实现：左右根 的后序遍历算法
function postorderTraversal(root) {
    const res = []
    const stack = []
    if (!root) {
        return res
    }
    stack.push(root)
    while (stack.length) {
        const top = stack.pop()
        res.unshift(top.val)
        if (top.left) {
            stack.push(top.left)
        }
        if (top.right) {
            stack.push(top.right)
        }
    }
    return res
}

// 中序遍历：
// 中序遍历的序列规则是 `左 -> 根 -> 右` ，这意味着我们必须首先定位到最左的叶子结点。
// 在这个定位的过程中，必然会途径目标结点的父结点、爷爷结点和各种辈分的祖宗结点
// 途径过的每一个结点，我们都要及时地把它入栈。这样当最左的叶子结点出栈时，第一个回溯到的就是它的父结点
// 有了父结点，就不愁找不到兄弟结点，遍历结果就变得唾手可得了
function inorderTraversal(root) {
    const res = []
    const stack = []
    if (!root) {
        return res
    }
    let cur = root
    while (cur || stack.length) {
        while (cur) {
            stack.push(cur)
            cur = cur.left
        }
        cur = stack.pop()
        res.push(cur.val)
        cur = cur.right
    }
    return res
}


// 二叉树反转：
// 注意：单节点二叉树，反转，还是返回它本身
function invertTree(root) {
    if(!root) {
        return root
    }
    const right = invertTree(root.right)
    const left = invertTree(root.left)
    root.left = right
    root.right = left
    return root
}


// 二叉搜索树（定义）：
// 树的定义总是以递归的形式出现，二叉搜索树也不例外，它的递归定义如下：
// 1. 是一棵空树
// 2. 是一棵由根结点、左子树、右子树组成的树，同时左子树和右子树都是二叉搜索树，且左子树上所有结点的数据域都小于等于根结点的数据域，右子树上所有结点的数据域都大于等于根结点的数据域


// 由此可以看出二叉搜索树强调的是 数据域的有序性。
// 也就是说，二叉搜索树上的每一棵子树，都应该满足 `左孩子 <= 根结点 <= 右孩子` 这样的大小关系

// 二叉搜索树（编码基本功）：
// 关于二叉搜索树，需要掌握以下高频操作：

// 1. 查找数据域为某一特定值的结点
// 2. 插入新结点
// 3. 删除指定结点

// 1， 查找数据域为某一特定值的结点
//
// 假设这个目标结点的数据域值为 `n`，我们借助二叉搜索树数据域的有序性 ，可以有以下查找思路：
//
// 1. 递归遍历二叉树，若当前遍历到的结点为空，就意味着没找到目标结点，直接返回。
// 2. 若当前遍历到的结点对应的数据域值刚好等于`n`，则查找成功，返回。
// 3. 若当前遍历到的结点对应的数据域值大于目标值`n`，则应该在左子树里进一步查找，设置下一步的遍历范围为 `root.left` 后，继续递归。
// 4. 若当前遍历到的结点对应的数据域值小于目标值`n`，则应该在右子树里进一步查找，设置下一步的遍历范围为 `root.right` 后，继续递归。

function search(root, n) {
    if (!root) {
        return root
    }
    if (root.val === n) {
        console.log('找到的节点值为：' + root.val)
        return root
    } else if (root.val > n) {
        search(root.left, n)
    } else {
        search(root.right, n)
    }
}
// 2，二叉搜索树插入结点的过程，和搜索某个结点的过程几乎是一样的：
// 从根结点开始，把我们希望插入的数据值和每一个结点作比较。若大于当前结点，则向右子树探索；若小于当前结点，则向左子树探索。
// 所以：最后找到的那个空位，就是它合理的栖身之所
// 插入节点后的树还是二叉搜索树
function insertIntoBST(root, n) {
    // 递归结束条件：知道找到空节点为止，new一个新节点，返回。
    if (!root) {
        const newRoot = new TreeNode(n)
        return newRoot
    }
    if (root.val > n) {
        root.left = insertIntoBST(root.left, n)
    } else {
        root.right = insertIntoBST(root.right, n)
    }
    return root
}

// 3,删除指定结点:

// 想要删除某个结点，首先要找到这个结点。在定位结点后，我们需要考虑以下情况：

// 1. 结点不存在，定位到了空结点。直接返回即可。
// 2. 需要删除的目标结点没有左孩子也没有右孩子——它是一个叶子结点，删掉它不会对其它结点造成任何影响，直接删除即可。
// 3. 需要删除的目标结点存在左子树，那么就去左子树里寻找小于目标结点值的最大结点，用这个结点覆盖掉目标结点
// 4. 需要删除的目标结点存在右子树，那么就去右子树里寻找大于目标结点值的最小结点，用这个结点覆盖掉目标结点
// 5. 需要删除的目标结点既有左子树、又有右子树，这时就有两种做法了：要么取左子树中值最大的结点，要么取右子树中取值最小的结点。两个结点中任取一个覆盖掉目标结点，都可以维持二叉搜索树的数据有序性
function deleteNode(root, n) {
    if (!root) {
        return root
    }
    if (root.val === n) {
        if (!root.left && !root.right) {
            root = null
        } else if (root.left) {
            // 寻找目标节点的左子树中的最大值
            const maxRoot = findMax(root.left)
            // 用这个 maxRoot 覆盖掉需要删除的当前结点
            root.val = maxRoot.val
            // 覆盖动作要删除掉原有的 maxRoot 结点，并指向root.left
            root.left = deleteNode(root.left, maxRoot.val)
        } else {
            // 寻找目标节点的右子树中的最小值
            const MinRoot = findMin(root.right)
            // 同上反向
            root.val = MinRoot.val
            // 同上反向
            root.right = deleteNode(root.right, MinRoot.val)
        }
    } else if (root.val > n) {
        root.left = deleteNode(root.left, n)
    } else {
        root.right = deleteNode(root.right, n)
    }
    function findMax(root) {
        while (root.right) {
            root = root.right
        }
        return root
    }
    function findMin(root) {
        while (root.left) {
            root = root.left
        }
        return root
    }
    return root
}

const root1 = {
    val: 8,
    left: {
        val: 6,
        left: {
            val: 4,
            left: null,
            right: null
        },
        right: {
            val: 7,
            left: null,
            right: null
        }
    },
    right: {
        val: 9,
        right: {
            val: 10,
            left: null,
            right: null
        },
        left: null
    }
}

const root2 = {
    val: 9,
    right: {
        val: 10,
        left: null,
        right: null
    },
    left: null
}

// 二叉搜索树的特性:
// 背诵：二叉搜索树的中序遍历序列是有序的！

// 二叉搜索树的验证
// > 题目描述：给定一个二叉树，判断其是否是一个有效的二叉搜索树。

// 假设一个二叉搜索树具有如下特征：
// 节点的左子树只包含小于当前节点的数。
// 节点的右子树只包含大于当前节点的数。
// 所有左子树和右子树自身必须也是二叉搜索树。

// 方法一：给定界值
function isValidBST(root) {
    function dfs(root, minValue, maxValue) {
        if (!root) {
            return true
        }
        if (root.val <= minValue || root.val >= maxValue) return false
        return dfs(root.left, minValue, root.val) && dfs(root.right, root.val, maxValue)
    }
    return dfs(root, -Infinity, Infinity)
}

// 此逻辑不太好想，注意递归函数的传参及返回值

// 方法二：中序遍历，结果放进数组中，判断数组中的元素是否为升序
function isValidBST(root) {
    const res = []
    function inOrder(root) {
        if (!root) {
            return
        }
        inOrder(root.left)
        res.push(root.val)
        inOrder(root.right)
        return res
    }
    inOrder(root)
    for (let i = 1; i < res.length; i++) {
        if (res[i] <= res[i - 1]) return false
    }
    return true
}

const root3 = {
    val: 9,
    right: {
        val: 10,
        left: null,
        right: null
    },
    left: {
        val: 8,
        left: null,
        right: null
    }
}

// 将排序数组转化为二叉搜索树：
// > 题目描述：将一个按照升序排列的有序数组，转换为一棵高度平衡二叉搜索树。
// 给定有序数组: [-10,-3,0,5,9]

// 本题中，一个高度平衡二叉树是指一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1。
function sortedArrayToBST(nums) {
    if (!nums.length) {
        return null
    }
    function buildBST(low, high) {
        if (low > high) {
            // 递归终止条件
            return null
        }
        const mid = Math.floor((high - low) / 2) + low
        // const mid = Math.ceil((high - low) / 2) + low 符合题目要求的另一种二叉树结果
        const cur = new TreeNode(nums[mid])
        cur.left = buildBST(low, mid - 1)
        cur.right = buildBST(mid + 1, high)
        return cur
    }
    return buildBST(0, nums.length - 1)
}

// 平衡二叉树：
// 概念与产生原因：
// 平衡二叉树的出现，是为了降低二叉搜索树的查找时间复杂度
// 平衡二叉树比非平衡二叉树（图上的结构可以称为链式二叉树）的查找效率更高
// 二叉搜索树的妙处就在于它把“二分”这种思想以数据结构的形式表达了出来
// 如果一个二叉搜索树严重不平衡，每一个结点的右子树都是空的，这样的结构非常不合理，它会带来高达O(N)的时间复杂度
// 而平衡二叉树由于利用了二分思想，查找操作的时间复杂度仅为 O(logN)


// 平衡二叉树的判定
// 题目描述：给定一个二叉树，判断它是否是高度平衡的二叉树。

// 抓住其中的两个关键字：

// 1. 任意结点
// 2. 左右子树高度差绝对值都不大于1

function isBalanced(root) {
    let flag = true
    function dfs(root) {
        if (!root) {
            return 0
        }
        const leftHeight = dfs(root.left)
        const rightHeight = dfs(root.right)
        if (Math.abs(leftHeight - rightHeight) > 1) {
            flag = false
            return
        }
        return Math.max(leftHeight, rightHeight) + 1
    }
    dfs(root)
    return flag
}


// 平衡二叉树的构造
// 题目描述：给你一棵二叉搜索树，请你返回一棵平衡后的二叉搜索树，新生成的树应该与原来的树有着相同的节点值。
// 输入：root = [1,null,2,null,3,null,4,null,null]
// 输出：[2,1,3,null,null,null,4]

// 构造平衡二叉树 =》 有序数组生成平衡二叉树

// 二叉搜索树的中序遍历序列是有序的！所谓有序数组，完全可以理解为二叉搜索树的中序遍历序列啊，对不对？现在树都给到咱们手里了，求它的中序遍历序列是不是非常 easy？如果能把中序遍历序列求出来，这道题是不是就跟之前做过那道是一模一样的解法了？
// 没错，这道题的解题思路正是：

// 1. 中序遍历求出有序数组
// 2. 逐个将二分出来的数组子序列“提”起来变成二叉搜索树
function balanceBST(root) {
    const res = []
    // 递归中序遍历二叉搜索树，得到一个有序数组
    function inOrder(root) {
        if (!root) {
            return
        }
        inOrder(root.left)
        res.push(root.val)
        inOrder(root.right)
    }
    // 递归函数处理res有序数组
    function buildAVL(low, high) {
        if (low > high) {
            return null
        }
        const mid = Math.floor((high - low) / 2) + low
        const cur = new TreeNode(res[mid])
        cur.left  = buildAVL(low, mid - 1)
        cur.right = buildAVL(mid + 1, high)
        return cur
    }
    // 递归中序遍历二叉树，生成res有序数组
    inOrder(root)
    if (!res.length) {
        return null
    }
    return buildAVL(0, res.length - 1)
}
