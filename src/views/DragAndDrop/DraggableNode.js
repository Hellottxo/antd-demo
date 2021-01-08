import React, { useEffect, useRef } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

const DraggableNode = (props) => {
  const ref = useRef(null)
  const { selectItems, data, ...restProps } = props

  const [, drag, preview] = useDrag({
    item: { type: 'box', info: props },
  })

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  drag(ref)

  return (
    <div
      ref={ref}
      {...restProps}
    >
      {data.title}
    </div>
  )
}

export default DraggableNode
