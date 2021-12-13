function ListNode(val) {
    this.val = val
    this.next = null
}

// > 真题描述：将两个有序链表合并为一个新的有序链表并返回。新链表是通过拼接给定的两个链表的所有结点组成的。
//
// > 示例：
//
// 输入：1->2->4, 1->3->4 输出：1->1->2->3->4->4

// 解题思路：定义一个空listNode节点，一次由小到大穿过list1，list2。输出一个新的list
const mergeTwoLists = function (l1, l2) {
    const head = new ListNode()
    let cur = head
    while (l1 && l2) {
        if (l1.val < l2.val) {
            cur.next = l1
            l1 = l1.next
        } else {
            cur.next = l2
            l2 = l2.next
        }
        cur = cur.next
    }

    // l1或者l2有剩余时：
    cur.next = l1 ? l1 : l2
    return head.next
}

const l1 = {
    val: 1,
    next: {
        val: 2,
        next: {
            val: 4,
            next: {
                val: 6,
                next: null
            }
        }
    }
}

const l2 = {
    val: 1,
    next: {
        val: 1,
        next: {
            val: 3,
            next: {
                val: 4,
                next: {
                    val: 5,
                    next: {
                        val: 7,
                        next: null
                    }
                }
            }
        }
    }
}

// 链表结点的删除：
// > 真题描述：给定一个排序链表，删除所有重复的元素，使得每个元素只出现一次。
//
// > 示例 1:
//
// 输入: 1->1->2
// 输出: 1->2
// 示例 2:
// 输入: 1->1->2->3->3
// 输出: 1->2->3

const deleteDuplicates = function (head) {
    let cur = head
    while (cur !== null && cur.next !== null) {
        if (cur.val === cur.next.val) {
            cur.next = cur.next.next
        } else {
            cur = cur.next
        }
    }
    return head
}

// > 真题描述：给定一个排序链表，删除所有含有重复数字的结点，只保留原始链表中 没有重复出现的数字。
//
// > 示例 1:
//
// 输入: 1->2->3->3->4->4->5
// 输出: 1->2->5
// 示例 2:
// 输入: 1->1->1->2->3
// 输出: 2->3

// 要删除某一个目标结点时，必须知道它的前驱结点
const deleteDuplicates1 = function (head) {
    // 制造一个节点，指向head。
    const dummy = new ListNode()
    dummy.next = head
    let cur = dummy
    while (cur.next && cur.next.next) {
        if (cur.next.val === cur.next.next.val) {
            // 若值重复，则记下这个值
            let val = cur.next.val
            // 关键点：反复地排查从cur开始，后面的元素是否存在多次重复该值的情况
            while (cur.next && cur.next.val === val) {
                // 满足条件后，进行删除操作。
                cur.next = cur.next.next
            }
        } else {
            cur = cur.next
        }
    }
    return dummy.next
}

// 快慢指针——删除链表的倒数第 N 个结点

// > 真题描述：给定一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
//
// > 示例：
//
// 给定一个链表: 1->2->3->4->5, 和 n = 2.
// 当删除了倒数第二个结点后，链表变为 1->2->3->5.

const removeNthFromEnd = function (head, n) {
    const dummy = new ListNode()
    dummy.next = head

    //设置两个指针：
    let fast = dummy
    let slow = dummy
    // fast指针先走到第n个节点上
    while (n!==0) {
        fast = fast.next
        n--
    }
    // for (let i = 0; i < n; i++) {
    //     fast = fast.next
    // }

    // 当快指针走到最后一个节点时，慢指针落在目标节点的前一个节点上。
    while (fast.next) {
        fast = fast.next
        slow = slow.next
    }
    // 要删除目标节点，首先要找到其前驱节点
    slow.next = slow.next.next
    return dummy.next
}

// 链表的反转：

// > 真题描述：定义一个函数，输入一个链表的头结点，反转该链表并输出反转后链表的头结点。
//
// > 示例:
//
// 输入: 1->2->3->4->5->NULL
// 输出: 5->4->3->2->1->NULL
const reverseList = function (head) {
    let cur = head
    let pre = null
    while (cur) {
        let next = cur.next
        cur.next = pre
        pre = cur
        cur = next
    }
    return pre
}

// 局部反转：
// > 真题描述：反转从位置 m 到 n 的链表。请使用一趟扫描完成反转。
//
// > 说明:
//
//     1 ≤ m ≤ n ≤ 链表长度。
//
// > 示例:
//
// 输入: 1->2->3->4->5->NULL, m = 2, n = 4
// 输出: 1->4->3->2->5->NULL

const reverseBetween = function (head, m, n) {
    const dummy = new ListNode()
    dummy.next = head
    // 先定义一个节点p，遍历，是其走到要反转的节点的前驱节点上。
    let p = dummy
    for (let i = 0 ; i < m - 1; i++) {
        p = p.next
    }
    const leftListNode = p
    const start = leftListNode.next
    let pre = start
    let cur = start.next

    for (let i = 0; i < n-m; i++) {
        let next = cur.next
        cur.next = pre
        pre = cur
        cur = next
    }
    leftListNode.next = pre
    start.next = cur
    return dummy.next
}

// 环形链表
// 如何判断：
// 从head开始遍历，遍历的过程中每个节点插上flag。
// 只要我能够再回到 flag 处，那么就意味着，再次遇到flag节点，为环形链表的第一个节点。则证明该链表有成环的部分

// > 真题描述：给定一个链表，判断链表中是否有环。

const hasCycle = function (head) {
    while (head) {
        if (head.flag) {
            return true
        } else {
            head.flag = true
            head = head.next
        }
    }
    return false
}

// 快慢指针判断环形链表：
const hasCycle1 = function (head) {
    if (!head || !head.next) {
        return false
    }
    let slow = head
    let fast = head
    while (slow && fast && fast.next) {
        slow = slow.next
        fast = fast.next.next
        if (slow.val === fast.val) {
            return true
        }
    }
    return false
}


// 真题描述：给定一个链表，返回链表开始入环的第一个结点。 如果链表无环，则返回 null。
const detectCycle = function (head) {
    while (head) {
        if (head.flag) {
            return head
        } else {
            head.flag = true
            head = head.next
        }
    }
    return null
}

// 复杂链表的复制
// 请实现 copyRandomList 函数，复制一个复杂链表。
// 在复杂链表中，每个节点除了有一个 next 指针指向下一个节点.
// 还有一个 random 指针指向链表中的任意节点或者 null

// key: 递归 + Map存储
const cacheMap = new Map()
const copyRandomList = function (head) {
    if (head === null) {
        return null
    }
    if (!cacheMap.has(head)) {
        // 复制head节点
        const newNode = new Node(head.val, null, null)
        // 将head节点和新节点，存入map中。
        cacheMap.set(head, newNode)
        newNode.next = copyRandomList(head.next)
        newNode.random = copyRandomList(head.random)
    }
    return cacheMap.get(head)
}
