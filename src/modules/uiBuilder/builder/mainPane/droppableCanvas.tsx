import React, { useState } from 'react';
import { useDndMonitor, useDroppable } from '@dnd-kit/core';

function DroppableCanvas({ children }) {
  const { setNodeRef } = useDroppable({
    id: 'droppable-canvas',
  });

  const [isDragging, setIsDragging] = useState(false);

  useDndMonitor({
    onDragStart: () => setIsDragging(true),
    onDragEnd: () => setIsDragging(false),
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        height: '100%',
        background: isDragging ? 'rgba(0, 0, 0, 0.1)' : '#ddd',
        position: 'relative',
        zIndex: 0,
      }}
    >
      {children}
    </div>
  );
}

export default DroppableCanvas;
