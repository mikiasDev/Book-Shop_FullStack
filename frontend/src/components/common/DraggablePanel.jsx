import React from 'react';
import Draggable from 'react-draggable';

const DraggablePanel = ({ children, defaultPosition = { x: 0, y: 0 }, ...props }) => (
  <Draggable defaultPosition={defaultPosition} {...props}>
    <div className="draggable-panel" style={{ cursor: 'move', zIndex: 10 }}>
      {children}
    </div>
  </Draggable>
);

export default DraggablePanel;
