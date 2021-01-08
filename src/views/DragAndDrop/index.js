import React from 'react'
import { Card, Tree, Table, message } from 'antd'
import DraggableNode from './DraggableNode'
import DroppableNode from './DroppableNode'
import CustomDragLayer from './CustomDragLayer'

const { TreeNode } = Tree;

const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
]

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  }
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
  },
];

export default class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectItems: []
    }
  }

  setNode = (item, type) => {
    const MAP = {
      'drag': <DraggableNode data={item} selectItems={this.state.selectItems} />,
      'drop': <DroppableNode data={item} onDrop={this.onDrop} />
    }
    return MAP[type]
  }

  renderTreeNodes = (data, type) =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={this.setNode(item, type)} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children, type)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} title={this.setNode(item, type)} key={item.key} />
    })

  onDrop = (item, props) => {
    console.log(item, props)
    message.success(`成功将左侧【${item.data.title}】拖入【${props.data.title}】`)
  }

  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectItems: selectedRows })
      }
    };

    return (
      <div style={{ display: 'flex' }}>
        <Card
          title="DragTree"
          bodyStyle={{ display: 'flex', justifyContent: 'space-between' }}
          style={{ width: '70%', margin: 10 }}>
          <div style={{ width: '50%' }}>
            <Tree defaultExpandAll>
              {this.renderTreeNodes(treeData, 'drag')}
            </Tree>
          </div>
          <div>
            <Table
              style={{ width: 300, marginLeft: 20 }}
              bordered
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          </div>
        </Card>
        <Card
          title="DropTree"
          style={{ width: '30%', margin: 10 }}
        >
          <Tree defaultExpandAll>
            {this.renderTreeNodes(treeData, 'drop')}
          </Tree>
        </Card>
        <CustomDragLayer />
      </div>

    );
  }
}