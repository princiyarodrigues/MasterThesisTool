import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';

// UC Block component that can be dragged
const UCBlock = ({ id, name, description, onDragEnd }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'UC_BLOCK',
    item: { id, name, description },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDragEnd(id);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-1.5 mb-2 bg-indigo-50 border ${isDragging ? 'border-indigo-500' : 'border-indigo-200'} rounded-md cursor-move transition-all shadow-sm hover:shadow-md ${
        isDragging ? 'opacity-50 scale-105' : 'opacity-100'
      }`}
    >
      <div className="font-medium text-indigo-700 flex items-center justify-between text-xs">
        {name}
        <span className="text-xs bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded-md">Drag</span>
      </div>
      {description && <div className="text-xs text-indigo-500 mt-0.5">{description}</div>}
    </div>
  );
};

// Container component for UC Blocks
const UCBlocks = () => {
  // Track which blocks have been used
  const [usedBlocks, setUsedBlocks] = useState([]);
  
  // Sample UC blocks data
  const allBlocks = [
    {
      id: 'uc-block-1',
      name: 'Production Data Visualization',
      description: 'Visualizes production data in real-time',
    },
    {
      id: 'uc-block-2',
      name: 'Quality Control Metrics',
      description: 'Monitors quality metrics for manufacturing',
    },
  ];
  
  // Filter out blocks that have been used
  const availableBlocks = allBlocks.filter(block => !usedBlocks.includes(block.id));
  
  // Handle when a block is successfully dragged
  const handleBlockUsed = (blockId) => {
    setUsedBlocks([...usedBlocks, blockId]);
  };
  
  // Reset all blocks
  const handleReset = () => {
    setUsedBlocks([]);
    // We also need to trigger a reset in the parent component
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('resetArchitectureDiagram'));
    }
  };

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-sm font-medium text-gray-800">Use Case Blocks</h3>
        {usedBlocks.length > 0 && (
          <button
            onClick={handleReset}
            className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded-md transition-colors"
          >
            Reset All
          </button>
        )}
      </div>
      
      <div className="bg-indigo-50 border border-indigo-100 rounded-md p-1.5 mb-2">
        <p className="text-xs text-indigo-700 mb-0.5 font-medium">How to use:</p>
        <ol className="text-xs text-indigo-600 list-decimal pl-3.5 space-y-0.5">
          <li>Drag a block from below</li>
          <li>Drop it on the <span className="font-medium">reference architecture</span> diagram</li>
          <li>The block will be connected with a line</li>
        </ol>
      </div>
      
      {availableBlocks.length > 0 ? (
        <div className="space-y-1.5">
          {availableBlocks.map((block) => (
            <UCBlock key={block.id} {...block} onDragEnd={handleBlockUsed} />
          ))}
        </div>
      ) : (
        <div className="text-center p-4 border border-dashed border-indigo-200 rounded-md">
          <p className="text-xs text-indigo-500">All blocks have been used</p>
          <button
            onClick={handleReset}
            className="mt-2 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded-md transition-colors"
          >
            Reset All Blocks
          </button>
        </div>
      )}
    </div>
  );
};

export default UCBlocks; 