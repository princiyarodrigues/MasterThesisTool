import React, { useState, useEffect } from 'react';
import { architectureElements, relationships } from './ArchitectureData';

// SVG relationship path calculation
const calculatePath = (rel) => {
  // If we have explicit coordinates in the relationship, use those
  if (rel.sourceX !== undefined && rel.sourceY !== undefined && 
      rel.targetX !== undefined && rel.targetY !== undefined) {
    return `M ${rel.sourceX} ${rel.sourceY} L ${rel.targetX} ${rel.targetY}`;
  }
  
  // Otherwise calculate based on element positions
  const sourceElement = architectureElements.find(el => el.id === rel.source);
  const targetElement = architectureElements.find(el => el.id === rel.target);
  
  if (!sourceElement || !targetElement) {
    return ''; // Return empty path if elements not found
  }
  
  // Calculate source and target points (center of elements)
  const sourceX = sourceElement.x + sourceElement.width / 2;
  const sourceY = sourceElement.y + sourceElement.height / 2;
  const targetX = targetElement.x + targetElement.width / 2;
  const targetY = targetElement.y + targetElement.height / 2;
  
  // For curved paths between elements at different levels
  if (Math.abs(sourceY - targetY) > 100) {
    const midY = (sourceY + targetY) / 2;
    return `M ${sourceX} ${sourceY} C ${sourceX} ${midY}, ${targetX} ${midY}, ${targetX} ${targetY}`;
  }
  
  // Simple straight line for elements at similar levels
  return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
};

const ArchitectureDiagramSVG = ({ selectedElement, setSelectedElement }) => {
  // Local state for UI interactions
  const [relatedElements, setRelatedElements] = useState([]);
  const [relatedRelationships, setRelatedRelationships] = useState([]);
  const [hoveredElement, setHoveredElement] = useState(null);
  
  // Update related elements when selection changes
  useEffect(() => {
    if (!selectedElement) {
      setRelatedElements([]);
      setRelatedRelationships([]);
      return;
    }
    
    // Find all relationships where the selected element is source or target
    const relevantRelationships = relationships.filter(rel => 
      rel.source === selectedElement || rel.target === selectedElement
    );
    
    // Get unique elements connected to the selected element
    const connectedElements = [...new Set(
      relevantRelationships.flatMap(rel => [rel.source, rel.target])
    )];
    
    setRelatedElements(connectedElements);
    setRelatedRelationships(relevantRelationships);
  }, [selectedElement]);
  
  // Element interaction handlers
  const handleElementClick = (elementId, event) => {
    event.stopPropagation(); // Prevent event bubbling
    setSelectedElement(elementId === selectedElement ? null : elementId);
  };
  
  const handleBackgroundClick = () => {
    setSelectedElement(null);
  };
  
  // Style functions
  const getElementStyle = (elementId) => {
    if (!selectedElement) return '';
    
    if (elementId === selectedElement) {
      return 'stroke-2 stroke-blue-600 shadow-lg'; // Selected element
    }
    
    if (relatedElements.includes(elementId)) {
      return 'stroke-2 stroke-blue-400'; // Related element
    }
    
    return 'opacity-50'; // Non-related element
  };
  
  const getRelationshipStyle = (relationship) => {
    if (!selectedElement) return '';
    
    if (relatedRelationships.some(rel => rel.id === relationship.id)) {
      return 'stroke-2 stroke-blue-500'; // Related relationship
    }
    
    return 'opacity-30'; // Non-related relationship
  };
  
  // Get color based on element type
  const getElementTypeColors = (type) => {
    switch (type) {
      case 'Value Stream':
        return { fill: 'fill-amber-50', stroke: 'stroke-amber-200', text: 'fill-amber-800' };
      case 'Business Process':
        return { fill: 'fill-green-50', stroke: 'stroke-green-200', text: 'fill-green-800' };
      case 'Data Object':
        return { fill: 'fill-cyan-50', stroke: 'stroke-cyan-200', text: 'fill-cyan-800' };
      case 'Data Model':
        return { fill: 'fill-blue-50', stroke: 'stroke-blue-200', text: 'fill-blue-800' };
      default:
        return { fill: 'fill-gray-50', stroke: 'stroke-gray-200', text: 'fill-gray-800' };
    }
  };
  
  // Get styling for relationship type
  const getRelationshipTypeStyles = (type) => {
    switch (type) {
      case 'Triggering':
        return { stroke: 'stroke-amber-500', marker: 'url(#arrowhead)' };
      case 'Realization':
        return { stroke: 'stroke-green-500 stroke-dasharray-2', marker: 'url(#arrowheadDashed)' };
      case 'Access':
        return { stroke: 'stroke-cyan-500 stroke-dasharray-1', marker: 'url(#arrowheadDotted)' };
      case 'Composition':
        return { stroke: 'stroke-blue-500', marker: 'url(#arrowheadComposition)' };
      default:
        return { stroke: 'stroke-gray-500', marker: '' };
    }
  };
  
  return (
    <div className="relative">
      <svg
        width="100%"
        height="850"
        viewBox="0 0 1300 850"
        xmlns="http://www.w3.org/2000/svg"
        className="bg-white rounded-lg shadow-sm border border-gray-100"
        onClick={handleBackgroundClick}
      >
        {/* Render relationships first (they appear under elements) */}
        {relationships.map((rel) => {
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

        {/* Render elements on top of relationships */}
        {architectureElements.map((element) => {
          const colors = getElementTypeColors(element.type);
          
          return (
            <g 
              key={element.id}
              onClick={(e) => handleElementClick(element.id, e)}
              onMouseEnter={() => setHoveredElement(element.id)}
              onMouseLeave={() => setHoveredElement(null)}
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
                  selectedElement && !relatedElements.includes(element.id) && element.id !== selectedElement 
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
                  selectedElement && !relatedElements.includes(element.id) && element.id !== selectedElement 
                    ? 'opacity-50' 
                    : ''
                }`}
              >
                {element.type}
              </text>
            </g>
          );
        })}

        {/* Arrow marker definitions */}
        <defs>
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-amber-500" />
          </marker>
          
          <marker
            id="arrowheadDashed"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-green-500" />
          </marker>
          
          <marker
            id="arrowheadDotted"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-cyan-500" />
          </marker>
          
          <marker
            id="arrowheadComposition"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-blue-500" />
          </marker>
        </defs>
      </svg>
      
      {/* Selection info and reset button */}
      {selectedElement && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Selected:</span> {
                architectureElements.find(el => el.id === selectedElement)?.name || selectedElement
              }
              <p className="text-sm text-gray-600">Connections shown in blue. Click element again or elsewhere to reset.</p>
            </div>
            <button 
              onClick={() => setSelectedElement(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reset Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchitectureDiagramSVG;