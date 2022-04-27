// 一：链表结构的创建：在链表中，每一个结点的结构都包括了两部分的内容：数据域和指针域
function ListNode(val) {
    this.val = val
    this.next = null
}
// 在使用构造函数创建结点时，传入 val （数据域对应的值内容）、指定 next （下一个链表结点）即可：
const node1 = new ListNode(1)
const node2 = new ListNode(2)
node1.next = node2

// 以上，就创建出了一个数据域值为1，next 结点数据域值为2的链表结点

// JS 中的链表，是以嵌套的对象的形式来实现的：
/*
* {
*     val: 1,
*     next: {
*         val:2,
*         next: ...
*     }
* }
* */

// 二：链表元素的添加
// 1，尾部添加
// const node3 = new ListNode(3)
// node2.next = node3

// 1,2之间添加node3
const node3 = new ListNode(3)
// node3节点next指针指向node2
node3.next = node2.next
// node1节点next指针指向node3
node1.next = node3

// 三：链表元素的删除
// 注意，删除的标准是：在链表的遍历过程中，无法再遍历到某个结点的存在。
// 按照这个标准，要想遍历不到 node3，我们直接让它的前驱结点 node1 的 next 指针跳过它、指向 node3 的后继即可.
// 如此一来，node3 就成为了一个完全不可抵达的结点了，它会被 JS 的垃圾回收器自动回收掉。

// 将node1节点指针直接指向node2，从而跳过node3
node1.next = node3.next

// 在涉及链表删除操作的题目中，重点不是定位目标结点，而是定位目标结点的前驱结点。
// 做题时，完全可以只使用一个指针（引用），这个指针用来定位目标结点的前驱结点。比如说咱们这个题里，其实只要能拿到 node1 就行了：

const target = node1.next
node1.next = target.next

// 四：链表和数组的辨析
// 数组：对应着一段连续的内存。
// 链表节点：结点和结点的分布，在内存中可以是离散的

// 增删：
// 数组：如果我们想要在任意位置删除一个元素，那么该位置往后的所有元素，都需要往前挪一个位置；
// 相应地，如果要在任意位置新增一个元素，那么该位置往后的所有元素也都要往后挪一个位置。
// 所以说数组增加/删除操作对应的复杂度就是 O(n)。

// 链表：添加和删除操作的复杂度是固定的
// 不管链表里面的结点个数 n 有多大，只要我们明确了要插入/删除的目标位置，那么我们需要做的都仅仅是改变目标结点及其前驱/后继结点的指针指向
// 所以说链表增删操作的复杂度是常数级别的复杂度就是 O(1)。

// 查询访问某个元素
// 当我们试图读取某一个特定的链表结点时，必须遍历整个链表来查找它
const index = 10
let node = head
for (let i = 0; i < index && node; i++) {
    console.log(node.val)
    node = node.next
}
// 所以：链表访问的复杂度为O(n)。

// 而数组的元素访问复杂度为O(1)。
