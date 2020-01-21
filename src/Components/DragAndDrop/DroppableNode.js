import React, { useRef } from 'react'
import { useDrop } from 'react-dnd'

const DroppableNode = (props) => {
  const ref = useRef(null)
  const { onDrop, data, ...restProps } = props

  const [{ isOver }, drop] = useDrop({
    accept: 'box',
    drop: (item) => {
      props.onDrop(item.info, props)
    },
    collect: (monitor, props) => ({
      isOver: monitor.isOver(),
      dropItem: monitor.getItem()
    })
  });

  drop(ref)
  let style = {}
  if (isOver) style = { backgroundColor: '#bae7ff' }


  return (
    <div
      ref={ref}
      {...restProps}
      style={style}
    >
      {data.title}
    </div>
  )
}

export default DroppableNode