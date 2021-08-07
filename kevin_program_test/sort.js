// 排序：

// 冒泡：
function bubbleSort(arr) {
    const len = arr.length
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // const temp = arr[j]
                // arr[j] = arr[j + 1]
                // arr[j + 1] = temp

                // 简便的交换法则
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
        }
    }
    return arr
}

// 我们忽略了这样一个事实：随着外层循环的进行，数组尾部的元素会渐渐变得有序
// 当我们走完第1轮循环的时候，最大的元素被排到了数组末尾；
// 走完第2轮循环的时候，第2大的元素被排到了数组倒数第2位；
// 走完第3轮循环的时候，第3大的元素被排到了数组倒数第3位......
// 以此类推，走完第 n 轮循环的时候，数组的后 `n` 个元素就已经是有序的

// 没有区别处理这一部分已经有序的元素，而是把它和未排序的部分做了无差别的处理，进而造成了许多不必要的比较。
// 为了避免这些冗余的比较动作，我们需要规避掉数组中的后 n 个元素，对应的代码可以这样写

function betterBubbleSort(arr) {
    const len1 = arr.length
    for (let i = 0; i < len1; i++) {
        // 注意差别在这行，我们对内层循环的范围作了限制
        for (let j = 0; j < len1 - 1 - i; j ++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
        }
    }
}


// 面向最好的情况：O(n)
// 除了对上述，排除掉已冒泡元素。还可以判断未冒泡的元素是否有序，若有序，则跳过之后的冒泡
function bestBubbleSort(arr) {
    const len2 = arr.length
    for (let i = 0; i < len2; i++) {
        // 定义一个标识，用来证明是否有交换
        let flag = true
        for (let j = 0; j < len2 - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1] , arr[j]]
                flag = false
            }
        }
        // 没有交换的记录，说明：此时数组已经有序
        if (flag) {
            return arr
        }
    }
    return arr
}
// 标志位可以帮助我们在第一次冒泡的时候就定位到数组是否完全有序，进而节省掉不必要的判断逻辑，将最好情况下的时间复杂度定向优化为 O(n)

// 最好时间复杂度：它对应的是数组本身有序这种情况。在这种情况下，我们只需要作比较（n-1 次），而不需要做交换。时间复杂度为 O(n)
// 最坏时间复杂度：它对应的是数组完全逆序这种情况。在这种情况下，每一轮内层循环都要执行，重复的总次数是 n(n-1)/2 次，因此时间复杂度是 O(n^2)
// 平均时间复杂度：这个东西比较难搞，它涉及到一些概率论的知识。实际面试的时候也不会有面试官摁着你让你算这个，这里记住平均时间复杂度是 O(n^2) 即可


// 选择排序

// 思路分析
// 选择排序的关键字是“最小值”：循环遍历数组，每次都找出当前范围内的最小值，把它放在当前范围的头部；
// 然后缩小排序范围，继续重复以上操作，直至数组完全有序为止。

// 或者：选择排序的关键字是“最大值”：循环遍历数组，每次都找出当前范围内的最大值，把它放在当前范围的尾部；
// 然后缩小排序范围，继续重复以上操作，直至数组完全有序为止。

function selectSort(arr) {
    const len = arr.length
    let maxIndex
    // 循环遍历长度逐渐缩小的数组的最大值，并把最大值与原数组尾部的元素进行交换
    for (let j = 0; j < len - 1; j++) {
        // 寻找当前循环的数组最大值的索引
        // 此时寻找的是不断缩小长度的数组
        maxIndex = findMax(arr, len - j).pos
        // 将当前最大值与当前循环数组的尾部进行交换
        const temp = arr[len - 1 - j]
        arr[len - 1 - j] = arr[maxIndex]
        arr[maxIndex] = temp
        // [arr[len - 1 - j], arr[maxIndex]] = [arr[maxIndex], arr[len - 1 - j]]
    }
    // 定义一个寻找当前数组最大值的函数
    // currentArr: 当前数组
    // n：当前数组长度
    function findMax(currentArr, n) {
        // 定义一个初始指针，之后，指向max。
        let pos = 0
        let max = currentArr[pos]
        for (let i = 1; i < n; i++) {
            if (currentArr[i] > currentArr[pos]) {
                max = currentArr[i]
                pos = i
            }
        }
        return {max, pos}
    }
    return arr
}

// 插入排序：
// 思考模型：抓牌整理的过程
// 插入排序的核心思想是“找到元素在它前面那个序列中的正确位置”
// 具体来说，插入排序所有的操作都基于一个这样的前提：当前元素前面的序列是有序的。基于这个前提，从后往前去寻找当前元素在前面那个序列里的正确位置。

// 分析至此，再来帮大家复习一遍插入排序里的几个关键点：
//
// - 当前元素前面的那个序列是有序的
// - “正确的位置”如何定义——所有在当前元素前面的数都不大于它，所有在当前元素后面的数都不小于它
// - 在有序序列里定位元素位置的时候，是从后往前定位的。只要发现一个比当前元素大的值，就需要为当前元素腾出一个新的坑位。

function insertSort(arr) {
    // 此方法是将索引为n的元素插入到它之前的有序序列中
    // arr为原素组
    // n为当前要插入的元素
    function insert(arr, n) {
        const key = arr[n]
        let i = n
        // 此循环为，用当前元素值key依次与它前面的元素进行比较
        while (arr[i - 1] > key) {
            // 满足条件：key前面的元素后移
            arr[i] = arr[i - 1]
            // 指针向前移
            i--
            // 防止出现arr[-1]的出现。索引出界
            if (i === 0) {
                break
            }
        }
        // 找到合适的位置后，将key放入i所在的位置
        arr[i] = key
    }
    // 从第一个元素开始，重复做上述操作
    for (let i = 1; i < arr.length; i++) {
        insert(arr, i)
    }
    return arr
}
