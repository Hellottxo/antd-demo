import React from 'react'
import { useDragLayer } from 'react-dnd'
import NodeDragPreview from './NodeDragPreview'
const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 20,
  width: '100%',
  height: '100%',
}
function getItemStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }
  let { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

const CustomDragLayer = props => {
  const {
    item,
    isDragging,
    initialOffset,
    currentOffset,
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))
  function renderItem() {
    return <NodeDragPreview data={item.info.selectItems}/>
  }
  if (!isDragging) {
    return null
  }
  return (
    <div style={layerStyles}>
      <div
        style={getItemStyles(initialOffset, currentOffset)}
      >
        {renderItem()}
      </div>
    </div>
  )
}
export default CustomDragLayer
