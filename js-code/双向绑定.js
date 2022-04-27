// 双向绑定的两种方案：
// 一 .sync 修饰符: 一个自动更新父组件属性的 v-on 监听器
// <comp :foo.sync="bar"></comp> => <comp :foo="bar" @update:foo="val => bar = val"></comp>
// 当子组件需要更新 foo 的值时，它需要显式地触发一个更新事件：
// this.$emit('update:foo', newVal)

// 总结：
// vue 修饰符sync的功能是：当一个子组件改变了一个 prop 的值时，这个变化也会同步到父组件中所绑定
// 具体案例参考modal的封装


// 二 自定义组件使用v-model
// v-model 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

// text 和 textarea 元素使用 value property 和 input 事件；
// checkbox 和 radio 使用 checked property 和 change 事件；
// select 字段将 value 作为 prop 并将 change 作为事件。

// v-model:允许一个自定义组件在使用 v-model 时定制 prop 和 event。
// 默认情况下，一个组件上的 v-model 会把 value 用作 prop 且把 input 用作 event.
// 但是一些输入类型比如单选框和复选框按钮可能想使用 value prop 来达到不同的目的。使用 model 选项可以回避这些情况产生的冲突。

// eg: https://juejin.cn/post/6844903607318511630
