# 宽高自适应表格

**宽高自适应依赖于父级div宽高，请确保父级div的宽高!!!**

## ⚠注意事项
- **宽高自适应依赖于父级div宽高，请确保父级div的宽高!!!**
- **需对columns设置宽度，才能达到宽高自适应效果**
- **如果组件没有设置过ellipsis,该组件会给传入的第一列columns加上ellipsis属性**
- **使用expand或树形数据时，需要提供expandedRowKeys**
- **为columns单列设置customExcelFilter时，filterIcon中的filtered针对全选优化为false（antd中针对全选为true）**

## props
 | params | desc | type | default |
 | ------ | ---- | ---- | ------- |
 | scrollStateChange | 传出当前表格scroll状态，可利用这一特性，在需要固定某一列且列动态变化时，动态设置固定列的fixed值，以达到列宽动态分配的目的 | function({x: boolean ,y: boolean})  | -- |
 | loadMethod | 滚动加载事件，滚动条到底部时触发的函数 | func | -- |
 | custonExcelFilter | 类excel的筛选交互样式，其他配置同antd，需要使用该样式时，在columns中设置该字段为true | bool | false |
