import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useCasesData } from '../../lib/use-cases-data';
import { useCaseElementsData } from '../../lib/use-case-elements-data';

// Element Block component that can be dragged
const ElementBlock = ({ id, name, type, onDragEnd }) => {
  // Determine block color based on type
  const isEquipment = type === 'Equipment';
  const isSoftware = type === 'Software';
  const baseClasses = `p-1.5 mb-2 border rounded-md cursor-move transition-all shadow-sm hover:shadow-md`;
  
  let colorClasses, textColorClasses, badgeClasses;
  
  if (isEquipment) {
    colorClasses = `bg-green-50 border-green-200 hover:border-green-500`;
    textColorClasses = `text-green-700`;
    badgeClasses = `bg-green-100`;
  } else if (isSoftware) {
    // Use cyan colors to match data objects in the diagram
    colorClasses = `bg-cyan-50 border-cyan-200 hover:border-cyan-500`;
    textColorClasses = `text-cyan-700`;
    badgeClasses = `bg-cyan-100`;
  } else {
    // Default blue for other types
    colorClasses = `bg-blue-50 border-blue-200 hover:border-blue-500`;
    textColorClasses = `text-blue-700`;
    badgeClasses = `bg-blue-100`;
  }
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ELEMENT_BLOCK',
    item: { id, name, type },
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
      className={`${baseClasses} ${colorClasses}`}
    >
      <div className={`font-medium flex items-center justify-between text-xs ${textColorClasses}`}>
        {name}
        <span className={`text-xs ${badgeClasses} ${textColorClasses} px-1 py-0.5 rounded-md`}>
          {type}
        </span>
      </div>
    </div>
  );
};

// Container component for UC Blocks
const UCBlocks = ({ usedElements = [], setUsedElements }) => {
  // State
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  
  // Handle use case selection
  const handleUseCaseSelect = (useCaseId) => {
    setSelectedUseCase(useCaseId === selectedUseCase ? null : useCaseId);
  };
  
  // Handle when an element is successfully dragged
  const handleElementUsed = (elementId) => {
    if (setUsedElements && !usedElements.includes(elementId)) {
      setUsedElements([...usedElements, elementId]);
    }
  };
  
  // Reset all blocks
  const handleReset = () => {
    if (setUsedElements) {
      setUsedElements([]);
    }
    // Trigger reset in all architecture components
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('resetArchitectureDiagram'));
      window.dispatchEvent(new CustomEvent('resetProductArchitectureDiagram'));
      window.dispatchEvent(new CustomEvent('resetOrderArchitectureDiagram'));
    }
  };

  // Get elements for the selected use case
  const getAvailableElements = () => {
    if (!selectedUseCase) return [];
    const elements = useCaseElementsData[selectedUseCase] || [];
    return elements.filter(element => !usedElements.includes(element.id));
  };

  const availableElements = getAvailableElements();

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-sm font-medium text-gray-800">Use Case Blocks</h3>
        {usedElements.length > 0 && (
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
      
      {selectedUseCase ? (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-medium text-gray-700">
              Elements for {useCasesData.find(uc => uc.id === selectedUseCase)?.title}
            </h4>
            <button
              onClick={() => setSelectedUseCase(null)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Back to Use Cases
            </button>
          </div>
          
          {availableElements.length > 0 ? (
            <div className="space-y-1.5 max-h-[calc(100vh-300px)] overflow-y-auto pr-1.5">
              {availableElements.map((element) => (
                <ElementBlock 
                  key={element.id} 
                  id={element.id} 
                  name={element.name} 
                  type={element.type} 
                  onDragEnd={handleElementUsed} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border border-dashed border-gray-200 rounded-md">
              <p className="text-xs text-gray-500">All elements have been used</p>
              <button
                onClick={handleReset}
                className="mt-2 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded-md transition-colors"
              >
                Reset All Elements
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1.5">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Select a Use Case</h4>
          <div className="space-y-1">
            {useCasesData.map((useCase) => (
              <button
                key={useCase.id}
                onClick={() => handleUseCaseSelect(useCase.id)}
                className="w-full text-left text-xs p-2 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-100 hover:border-indigo-300 text-indigo-700"
              >
                <span className="font-medium">{useCase.title}</span>
                <div className="text-indigo-600 text-xs mt-0.5">{useCase.category}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UCBlocks; 