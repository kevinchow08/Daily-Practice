// 二分查找：只能查找已经排序好的数据，每一次查找都可以将查找范围减半，查找范围内只剩一个数据时查找结束。

// 声明一个函数，参数为：要查找的数组，要查找的数据，数组的起点，数组的末尾
// 找到数组的中间值，将其与目标值进行比较
// 如果中间值大于目标值，可知目标值在中间值的左侧，则对其左边的数据执行上述操作
// 如果中间值小于目标值，可知目标值在中间值的右侧，则对其右边的数据执行上述操作
// 直至中间值等于目标值，则结束上述操作，返回中间值的位置。

const binarySearch = function (nums, target) {
    // 设置初始下标
    let start = 0
    let end = nums.length - 1
    // 循环条件
    // 循环过程中不断调整start，end索引值
    while (start <= end) {
        let middle = start + Math.floor((end - start) / 2)
        if (target > nums[middle]) {
            start = middle + 1
        } else if (target < nums[middle]) {
            end = middle - 1
        } else {
            return middle
        }
    }
    // 找不到的情况下，返回-1
    return -1
}

// 0～n-1中缺失的数字
// 一个长度为n-1的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围0～n-1之内。
// 在范围0～n-1内的n个数字中有且只有一个数字不在该数组中，请找出这个数字。

// 操作过程：
// 此处因为是从0开始的，所以只要其中间值是对应的下标值，则可证明前半部分没有错，左边界移动到当前中间值位置；反之亦然。
// 最后左边界就是缺的值的位置，也就是缺的值
// (因为end会多减去1在最后一步执行else后，为了跳出循环，所以就返回start了)

// 不理解的话，自行在纸上画一画
const missingNumber = function (nums) {
    let start = 0
    let end = nums.length - 1
    while (start <= end) {
        let mid = start + Math.floor((end - start) / 2)
        if (nums[mid] === mid) {
            start = mid + 1
        } else {
            end = mid - 1
        }
    }
    return start
}

// 两数求和：
// > 真题描述： 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
//
// 你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。
//
// > 示例:
//
// 给定 nums = [2, 7, 11, 15], target = 9
// 因为 nums[0] + nums[1] = 2 + 7 = 9 所以返回 [0, 1]

const toSum = function (nums, target) {
    const map = {}
    for (let i = 0; i < nums.length; i++) {
        if (map[target - nums[i]] !== undefined) {
            return [map[target - nums[i]], i]
        } else {
            map[nums[i]] = i
        }
    }
}

// > 真题描述：给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。
//
// 注意：答案中不可以包含重复的三元组。
//
// > 示例：
//
// 给定数组 nums = [-1, 0, 1, 2, -1, -4]， 满足要求的三元组集合为： [ [-1, 0, 1], [-1, -1, 2] ]

const threeSum = function (nums) {
    const result = []
    nums.sort((a, b) => {
        return a - b
    })
    const len = nums.length
    for (let i = 0; i < len - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) {
            continue
        }
        let j = i + 1
        let k = len - 1
        while (j < k) {
            if (nums[i] + nums[j] + nums[k] > 0) {
                k--
                while (j < k && nums[k] === nums[k + 1]) {
                    k--
                }
            } else if (nums[i] + nums[j] + nums[k] < 0) {
                j++
                while (j < k && nums[j] === nums[j - 1]) {
                    j++
                }
            } else {
                result.push([nums[i], nums[j], nums[k]])
                j++
                k--
                while (j < k && nums[k] === nums[k + 1]) {
                    k--
                }
                while (j < k && nums[j] === nums[j - 1]) {
                    j++
                }
            }
        }
    }
    return result
}

// 真题描述：给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。
//
// 说明: 初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。 你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。
//
// > 示例:
//
// 输入:
// nums1 = [1,2,3,0,0,0], m = 3
// nums2 = [2,5,6], n = 3
// 输出: [1,2,2,3,5,6]

const merge = function (nums1, m, nums2, n) {
    // 定义三个指针
    let i = m - 1;
    let j = n - 1;
    let k = m + n - 1
    while (i >= 0 && j >= 0) {
        if (nums1[i] >= nums2[j]) {
            nums1[k] = nums1[i]
            i--
            k--
        } else {
            nums1[k] = nums2[j]
            j--
            k--
        }
    }

    // 若nums2有剩余
    while (j >= 0) {
        nums1[k] = nums2[j]
        k--
        j--
    }
    return nums1
}
