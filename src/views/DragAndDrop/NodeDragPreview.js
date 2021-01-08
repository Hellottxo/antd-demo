import React, { useEffect, useState, memo } from 'react'
import { Table } from 'antd'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  }
]

const NodeDragPreview = memo(({ data }) => {
  const [tickTock, setTickTock] = useState(false)
  useEffect(
    function subscribeToIntervalTick() {
      const interval = setInterval(() => setTickTock(!tickTock), 500)
      return () => clearInterval(interval)
    },
    [tickTock],
  )
  return (
    <Table
      style={{ width: 400 }}
      dataSource={data}
      columns={columns}
      pagination={false}
    />
  )
})
export default NodeDragPreview
