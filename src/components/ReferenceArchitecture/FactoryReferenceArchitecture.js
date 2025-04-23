import React, { useState } from 'react';
import { architectureElements, relationships } from './ArchitectureData';

// Factory perspective architecture data - Filter to show only factory perspective elements
const factoryElements = architectureElements.filter(el => 
  (el.type === 'Value Stream') ||
  (el.id === 'perspective-factory') ||
  (el.id.startsWith('factory-'))
);

// Get factory perspective relationships
const factoryRelationships = relationships.filter(rel =>
  (rel.id.startsWith('factory-rel') || 
   rel.id.startsWith('vs') || 
   (factoryElements.some(el => el.id === rel.source) && 
    factoryElements.some(el => el.id === rel.target)))
);

const FactoryReferenceArchitecture = ({ selectedElement, setSelectedElement, departmentId = 'operations' }) => {
  // Function to calculate the SVG path for relationships
  const calculatePath = (rel) => {
    // For straight lines between elements
    if (rel.sourceX && rel.sourceY && rel.targetX && rel.targetY) {
      return `M${rel.sourceX} ${rel.sourceY} L${rel.targetX} ${rel.targetY}`;
    }
    
    // For relationships without explicit coordinates, calculate from element positions
    const sourceElement = factoryElements.find(el => el.id === rel.source);
    const targetElement = factoryElements.find(el => el.id === rel.target);
    
    if (!sourceElement || !targetElement) return '';
    
    const sourceX = sourceElement.x + sourceElement.width / 2;
    const sourceY = sourceElement.y + sourceElement.height;
    const targetX = targetElement.x + targetElement.width / 2;
    const targetY = targetElement.y;
    
    return `M${sourceX} ${sourceY} L${targetX} ${targetY}`;
  };

  // Handle element click
  const handleElementClick = (elementId, event) => {
    event.stopPropagation();
    setSelectedElement(elementId);
  };

  // Handle background click to deselect elements
  const handleBackgroundClick = () => {
    setSelectedElement(null);
  };

  // Get element styling based on selection state
  const getElementStyle = (elementId) => {
    if (elementId === selectedElement) {
      return 'stroke-blue-500 stroke-[2px]';
    }
    
    if (selectedElement) {
      // Highlight elements connected to the selected element
      const isConnected = factoryRelationships.some(rel => 
        (rel.source === selectedElement && rel.target === elementId) ||
        (rel.target === selectedElement && rel.source === elementId)
      );
      
      return isConnected ? 'stroke-[1.5px]' : 'opacity-50';
    }
    
    return 'stroke-[1px]';
  };

  // Get relationship styling based on selection
  const getRelationshipStyle = (relationship) => {
    if (!selectedElement) return '';
    
    const isHighlighted = relationship.source === selectedElement || 
                        relationship.target === selectedElement;
    
    return isHighlighted ? 'stroke-[2px]' : 'opacity-30';
  };

  // Get colors for element types
  const getElementTypeColors = (type) => {
    switch (type) {
      case 'Value Stream':
        return { 
          fill: 'fill-amber-50', 
          stroke: 'stroke-amber-300',
          text: 'text-amber-900',
          markerFill: '#F59E0B'
        };
      case 'Business Process':
        return { 
          fill: 'fill-green-50', 
          stroke: 'stroke-green-300',
          text: 'text-green-900',
          markerFill: '#10B981'
        };
      case 'Data Object':
        return { 
          fill: 'fill-cyan-50', 
          stroke: 'stroke-cyan-300',
          text: 'text-cyan-900',
          markerFill: '#06B6D4'
        };
      case 'Data Model':
        return { 
          fill: 'fill-blue-50', 
          stroke: 'stroke-blue-300',
          text: 'text-blue-900',
          markerFill: '#3B82F6'
        };
      case 'Model Layer':
        return { 
          fill: 'fill-purple-50', 
          stroke: 'stroke-purple-300',
          text: 'text-purple-900',
          markerFill: '#8B5CF6'
        };
      default:
        return { 
          fill: 'fill-gray-50', 
          stroke: 'stroke-gray-300',
          text: 'text-gray-900',
          markerFill: '#6B7280'
        };
    }
  };

  // Get styles for relationship types
  const getRelationshipTypeStyles = (type) => {
    switch (type) {
      case 'Triggering':
        return { 
          stroke: 'stroke-amber-500', 
          marker: 'url(#arrow-triggering)'
        };
      case 'Realization':
        return { 
          stroke: 'stroke-green-500 stroke-dashed', 
          marker: 'url(#arrow-realization)'
        };
      case 'Access':
        return { 
          stroke: 'stroke-cyan-500 stroke-dotted', 
          marker: 'url(#arrow-access)'
        };
      case 'Composition':
        return { 
          stroke: 'stroke-blue-500', 
          marker: 'url(#arrow-composition)'
        };
      default:
        return { 
          stroke: 'stroke-gray-500', 
          marker: 'url(#arrow-triggering)'
        };
    }
  };

  return (
    <div className="h-full relative">
      {/* Display the diagram */}
      <div className="h-[calc(100vh-190px)] overflow-auto" onClick={handleBackgroundClick}>
        <svg 
          width="100%" 
          height="1200" 
          viewBox="0 0 1500 1200"
          className="border-0"
        >
          {/* Arrow markers definition */}
          <defs>
            <marker
              id="arrow-triggering"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#F59E0B" />
            </marker>
            <marker
              id="arrow-access"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#06B6D4" />
            </marker>
            <marker
              id="arrow-realization"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
            </marker>
            <marker
              id="arrow-composition"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6" />
            </marker>
          </defs>
          
          {/* Render relationships */}
          {factoryRelationships.map((rel) => {
            const typeStyles = getRelationshipTypeStyles(rel.type);
            return (
              <path
                key={rel.id}
                d={calculatePath(rel)}
                className={`${typeStyles.stroke} ${getRelationshipStyle(rel)} transition-all duration-300`}
                markerEnd={typeStyles.marker}
                fill="none"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Render elements */}
          {factoryElements.map((element) => {
            const colors = getElementTypeColors(element.type);
            
            return (
              <g 
                key={element.id}
                onClick={(e) => handleElementClick(element.id, e)}
                className="cursor-pointer"
              >
                <rect
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  rx="5"
                  className={`${colors.fill} ${colors.stroke} ${getElementStyle(element.id)} transition-all duration-300`}
                />
                
                <text
                  x={element.x + element.width / 2}
                  y={element.y + (element.height / 2) - 5}
                  textAnchor="middle"
                  className={`text-sm font-medium ${colors.text} transition-all duration-300 ${
                    selectedElement && element.id !== selectedElement && 
                    !factoryRelationships.some(rel => 
                      (rel.source === selectedElement && rel.target === element.id) ||
                      (rel.target === selectedElement && rel.source === element.id)
                    ) 
                      ? 'opacity-50' 
                      : ''
                  }`}
                >
                  {element.name}
                </text>
                
                <text
                  x={element.x + element.width / 2}
                  y={element.y + (element.height / 2) + 15}
                  textAnchor="middle"
                  className={`text-xs ${colors.text} transition-all duration-300 ${
                    selectedElement && element.id !== selectedElement && 
                    !factoryRelationships.some(rel => 
                      (rel.source === selectedElement && rel.target === element.id) ||
                      (rel.target === selectedElement && rel.source === element.id)
                    ) 
                      ? 'opacity-50' 
                      : ''
                  }`}
                >
                  {element.type}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Selected element details panel */}
      {selectedElement && (
        <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-4 w-64 z-10">
          <h3 className="text-lg font-semibold text-gray-800">
            {factoryElements.find(el => el.id === selectedElement)?.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {factoryElements.find(el => el.id === selectedElement)?.type}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {factoryElements.find(el => el.id === selectedElement)?.description}
          </p>
          <button 
            className="mt-4 text-xs text-blue-600 hover:text-blue-800"
            onClick={handleBackgroundClick}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default FactoryReferenceArchitecture; 