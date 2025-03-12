import React, { useState, useEffect } from 'react';
import { architectureElements, relationships } from './ArchitectureData'; // Import your data

const EnhancedArchitectureDiagram = () => {
  // State for tracking the selected element and related elements
  const [selectedElement, setSelectedElement] = useState(null);
  const [relatedElements, setRelatedElements] = useState([]);
  const [relatedRelationships, setRelatedRelationships] = useState([]);
  
  // When an element is selected, find all related elements and relationships
  useEffect(() => {
    if (!selectedElement) {
      setRelatedElements([]);
      setRelatedRelationships([]);
      return;
    }
    
    // Find all relationships where the selected element is either source or target
    const relevantRelationships = relationships.filter(rel => 
      rel.source === selectedElement || rel.target === selectedElement
    );
    
    // Get all elements that are directly connected to the selected element
    const connectedElements = relevantRelationships.flatMap(rel => {
      return [rel.source, rel.target];
    });
    
    // Create a unique list of related elements (including the selected element)
    const uniqueRelatedElements = [...new Set([selectedElement, ...connectedElements])];
    
    setRelatedElements(uniqueRelatedElements);
    setRelatedRelationships(relevantRelationships);
  }, [selectedElement]);
  
  // Handle element click
  const handleElementClick = (elementId) => {
    // If clicking the already selected element, deselect it
    if (elementId === selectedElement) {
      setSelectedElement(null);
    } else {
      setSelectedElement(elementId);
    }
  };
  
  // Determine if an element is related to the selected element
  const isRelatedElement = (elementId) => {
    if (!selectedElement) return false;
    return relatedElements.includes(elementId);
  };
  
  // Determine if a relationship is related to the selected element
  const isRelatedRelationship = (relId) => {
    if (!selectedElement) return false;
    return relatedRelationships.some(rel => rel.id === relId);
  };
  
  // Get styling for elements and connections based on selection state
  const getElementStyle = (elementId) => {
    if (!selectedElement) return '';
    if (elementId === selectedElement) return 'stroke-2 stroke-blue-600 shadow-lg'; // Selected element
    if (isRelatedElement(elementId)) return 'stroke-2 stroke-blue-400'; // Related element
    return 'opacity-40'; // Non-related element
  };
  
  const getRelationshipStyle = (relId) => {
    if (!selectedElement) return '';
    if (isRelatedRelationship(relId)) return 'stroke-blue-500 stroke-2'; // Related relationship
    return 'opacity-30'; // Non-related relationship
  };
  
  // Reset selection
  const resetSelection = () => {
    setSelectedElement(null);
  };
  
  return (
    <div className="relative">
      {/* Your SVG diagram here with dynamic styling */}
      <svg
        width="100%"
        height="650"
        viewBox="0 0 1300 750"
        xmlns="http://www.w3.org/2000/svg"
        className="bg-white rounded-lg shadow-sm"
      >
        {/* Render elements with dynamic styling */}
        {architectureElements.map(element => (
          <g key={element.id} onClick={() => handleElementClick(element.id)}>
            {/* This would be your existing element rendering code */}
            <rect
              x={element.x}
              y={element.y}
              width={element.width}
              height={element.height}
              rx="5"
              className={`fill-${getElementTypeColor(element.type)} stroke-1 ${getElementStyle(element.id)} cursor-pointer transition-all duration-200`}
            />
            <text
              x={element.x + element.width / 2}
              y={element.y + element.height / 2}
              textAnchor="middle"
              className="text-sm font-medium"
            >
              {element.name}
            </text>
          </g>
        ))}
        
        {/* Render relationships with dynamic styling */}
        {relationships.map(relationship => (
          <path
            key={relationship.id}
            d={getPathData(relationship)} // This would calculate the path based on source and target positions
            className={`stroke-1 fill-none ${getRelationshipTypeStyle(relationship.type)} ${getRelationshipStyle(relationship.id)} transition-all duration-200`}
            markerEnd={getMarkerForRelationshipType(relationship.type)}
          />
        ))}
        
        {/* Add arrow marker definitions as in your original code */}
        <defs>
          {/* Arrow marker definitions */}
        </defs>
      </svg>
      
      {/* Selection info and reset button */}
      {selectedElement && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Selected:</span> {getElementName(selectedElement)}
              <p className="text-sm text-gray-600">Connections shown in blue. Click anywhere else to see different connections.</p>
            </div>
            <button 
              onClick={resetSelection}
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

// Helper functions
const getElementTypeColor = (type) => {
  switch (type) {
    case 'Value Stream': return 'amber-50';
    case 'Business Process': return 'green-50';
    case 'Data Object': return 'cyan-50';
    case 'Data Model': return 'blue-50';
    default: return 'gray-50';
  }
};

const getRelationshipTypeStyle = (type) => {
  switch (type) {
    case 'Triggering': return 'stroke-amber-500';
    case 'Realization': return 'stroke-green-500 stroke-dasharray-2';
    case 'Access': return 'stroke-cyan-500 stroke-dasharray-1';
    case 'Composition': return 'stroke-blue-500';
    default: return 'stroke-gray-500';
  }
};

const getMarkerForRelationshipType = (type) => {
  switch (type) {
    case 'Triggering': return 'url(#arrowhead)';
    case 'Realization': return 'url(#arrowheadDashed)';
    case 'Access': return 'url(#arrowheadDotted)';
    case 'Composition': return 'url(#arrowheadComposition)';
    default: return '';
  }
};

// This function would calculate the path between two elements
const getPathData = (relationship) => {
  // In a real implementation, you would calculate the path based on 
  // the positions of the source and target elements
  // For simplicity, we're returning a placeholder
  return `M ${relationship.sourceX || 0} ${relationship.sourceY || 0} L ${relationship.targetX || 100} ${relationship.targetY || 100}`;
};

const getElementName = (elementId) => {
  const element = architectureElements.find(el => el.id === elementId);
  return element ? element.name : elementId;
};

export default EnhancedArchitectureDiagram;