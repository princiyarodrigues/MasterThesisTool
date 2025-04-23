import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useDrop } from 'react-dnd';

// Product perspective architecture data
const architectureElements = [
  // Value Streams (Top row)
  { 
    id: 'vs-1', 
    name: '1. Spezifikation & Planung', 
    type: 'Value Stream', 
    description: 'Planning and specification phase of the product lifecycle',
    x: 100, y: 50, width: 200, height: 70
  },
  { 
    id: 'vs-2', 
    name: '2. Aufbau & Inbetriebnahme', 
    type: 'Value Stream', 
    description: 'Construction and commissioning phase',
    x: 350, y: 50, width: 200, height: 70
  },
  { 
    id: 'vs-3', 
    name: '3.0 Betrieb', 
    type: 'Value Stream', 
    description: 'Operational phase of the product',
    x: 600, y: 50, width: 200, height: 70
  },
  { 
    id: 'vs-4', 
    name: '4. Demontage & Recycling', 
    type: 'Value Stream', 
    description: 'End-of-life phase',
    x: 850, y: 50, width: 200, height: 70
  },
  
  // Additional Value Streams (Second row)
  { 
    id: 'vs-3.1', 
    name: '3.1 Service & Wartung', 
    type: 'Value Stream', 
    description: 'Maintenance and service activities',
    x: 500, y: 150, width: 170, height: 70
  },
  { 
    id: 'vs-3.2', 
    name: '3.2 Umplanung', 
    type: 'Value Stream', 
    description: 'Reconfiguration planning',
    x: 750, y: 150, width: 170, height: 70
  },
  
  // Business Processes (Middle row - Product Perspective)
  { 
    id: 'bp-1.1', 
    name: '1.1 Planung, Entwicklung', 
    type: 'Business Process', 
    description: 'Planning and development of the product',
    x: 50, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-1.2', 
    name: '1.2 Konstruktion', 
    type: 'Business Process', 
    description: 'Product design and construction',
    x: 225, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-2.1', 
    name: '2.1 Rapid Prototyping', 
    type: 'Business Process', 
    description: 'Rapid prototyping and initial testing',
    x: 400, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-3.1', 
    name: '3.1 Produktion', 
    type: 'Business Process', 
    description: 'Product manufacturing operations',
    x: 575, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-4.1', 
    name: '4.1 Gebrauch & Service', 
    type: 'Business Process', 
    description: 'Product usage and service',
    x: 750, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-4.2', 
    name: '4.2 Recycling, Verschrottung', 
    type: 'Business Process', 
    description: 'Product recycling and disposal',
    x: 925, y: 250, width: 150, height: 70
  },
  
  // Data Objects (Data layer)
  { 
    id: 'do-1', 
    name: 'Produktmodell (3D)', 
    type: 'Data Object', 
    description: '3D model of the product',
    x: 125, y: 400, width: 150, height: 60
  },
  { 
    id: 'do-2', 
    name: 'E-BOM', 
    type: 'Data Object', 
    description: 'Engineering Bill of Materials',
    x: 300, y: 400, width: 150, height: 60
  },
  { 
    id: 'do-3', 
    name: 'M-BOM', 
    type: 'Data Object', 
    description: 'Manufacturing Bill of Materials',
    x: 475, y: 400, width: 150, height: 60
  },
  { 
    id: 'do-4', 
    name: 'Testspezifikation & Toleranzangaben', 
    type: 'Data Object', 
    description: 'Test specifications and tolerance information',
    x: 650, y: 400, width: 220, height: 60
  },
  { 
    id: 'do-5', 
    name: 'Prüfanweisungen & Testberichte', 
    type: 'Data Object', 
    description: 'Test instructions and reports',
    x: 350, y: 490, width: 200, height: 60
  },
  { 
    id: 'do-6', 
    name: 'Arbeits- & Montageanweisungen', 
    type: 'Data Object', 
    description: 'Work and assembly instructions',
    x: 575, y: 490, width: 200, height: 60
  },
  { 
    id: 'do-7', 
    name: 'Produktreklamationsdaten', 
    type: 'Data Object', 
    description: 'Product complaint data',
    x: 800, y: 400, width: 175, height: 60
  },
  
  // Data Models (Bottom row)
  { 
    id: 'dm-1', 
    name: 'Grafisches Modell', 
    type: 'Data Model', 
    description: 'Graphical model',
    x: 130, y: 580, width: 120, height: 60
  },
  { 
    id: 'dm-2', 
    name: 'Strukturmodell', 
    type: 'Data Model', 
    description: 'Structure model',
    x: 270, y: 580, width: 120, height: 60
  },
  { 
    id: 'dm-3', 
    name: 'Materialfluss', 
    type: 'Data Model', 
    description: 'Material flow data model',
    x: 410, y: 580, width: 120, height: 60
  },
  { 
    id: 'dm-4', 
    name: 'Fähigkeitenmodell', 
    type: 'Data Model', 
    description: 'Capabilities model',
    x: 550, y: 580, width: 120, height: 60
  },
  { 
    id: 'dm-5', 
    name: 'Kennzahlenmodell', 
    type: 'Data Model', 
    description: 'KPI model',
    x: 690, y: 580, width: 120, height: 60
  }
];

// Define relationships between elements in product perspective
const relationships = [
  // Value Stream flow lines (horizontal flow in top row)
  { 
    id: 'rel-1', 
    type: 'Triggering', 
    source: 'vs-1', 
    target: 'vs-2',
    description: 'Planning triggers construction',
    sourceX: 300, sourceY: 85, 
    targetX: 350, targetY: 85
  },
  { 
    id: 'rel-2', 
    type: 'Triggering', 
    source: 'vs-2', 
    target: 'vs-3',
    description: 'Construction triggers operation',
    sourceX: 550, sourceY: 85, 
    targetX: 600, targetY: 85
  },
  { 
    id: 'rel-3', 
    type: 'Triggering', 
    source: 'vs-3', 
    target: 'vs-4',
    description: 'Operation triggers end-of-life',
    sourceX: 800, sourceY: 85, 
    targetX: 850, targetY: 85
  },
  
  // Connections from 3.0 Betrieb to substreams
  {
    id: 'rel-3a',
    type: 'Triggering',
    source: 'vs-3',
    target: 'vs-3.1',
    description: 'Operation triggers service and maintenance',
    sourceX: 650, sourceY: 120,
    targetX: 585, targetY: 150
  },
  {
    id: 'rel-3b',
    type: 'Triggering',
    source: 'vs-3',
    target: 'vs-3.2',
    description: 'Operation triggers reconfiguration planning',
    sourceX: 700, sourceY: 120,
    targetX: 835, targetY: 150
  },
  
  // Business Process flow lines (horizontal flow in middle row)
  { 
    id: 'rel-4', 
    type: 'Triggering', 
    source: 'bp-1.1', 
    target: 'bp-1.2',
    description: 'Planning triggers construction',
    sourceX: 200, sourceY: 285, 
    targetX: 225, targetY: 285
  },
  { 
    id: 'rel-5', 
    type: 'Triggering', 
    source: 'bp-1.2', 
    target: 'bp-2.1',
    description: 'Construction triggers prototyping',
    sourceX: 375, sourceY: 285, 
    targetX: 400, targetY: 285
  },
  { 
    id: 'rel-6', 
    type: 'Triggering', 
    source: 'bp-2.1', 
    target: 'bp-3.1',
    description: 'Prototyping triggers production',
    sourceX: 550, sourceY: 285, 
    targetX: 575, targetY: 285
  },
  { 
    id: 'rel-7', 
    type: 'Triggering', 
    source: 'bp-3.1', 
    target: 'bp-4.1',
    description: 'Production triggers usage and service',
    sourceX: 725, sourceY: 285, 
    targetX: 750, targetY: 285
  },
  { 
    id: 'rel-8', 
    type: 'Triggering', 
    source: 'bp-4.1', 
    target: 'bp-4.2',
    description: 'Usage triggers recycling',
    sourceX: 900, sourceY: 285, 
    targetX: 925, targetY: 285
  },
  
  // Realization connections (Business Process to Value Stream vertical)
  { 
    id: 'rel-10', 
    type: 'Realization', 
    source: 'bp-1.2', 
    target: 'vs-1',
    description: 'Construction realizes planning',
    sourceX: 300, sourceY: 250, 
    targetX: 200, targetY: 120
  },
  { 
    id: 'rel-11', 
    type: 'Realization', 
    source: 'bp-2.1', 
    target: 'vs-2',
    description: 'Prototyping realizes construction',
    sourceX: 475, sourceY: 250, 
    targetX: 450, targetY: 120
  },
  { 
    id: 'rel-12', 
    type: 'Realization', 
    source: 'bp-3.1', 
    target: 'vs-3',
    description: 'Production realizes operation',
    sourceX: 650, sourceY: 250, 
    targetX: 700, targetY: 120
  },
  
  // Access relationships from Business Processes to Data Objects
  { 
    id: 'rel-16', 
    type: 'Access', 
    source: 'bp-1.2', 
    target: 'do-1',
    description: 'Construction accesses product model',
    sourceX: 250, sourceY: 320, 
    targetX: 170, targetY: 400
  },
  { 
    id: 'rel-17', 
    type: 'Access', 
    source: 'bp-1.2', 
    target: 'do-2',
    description: 'Construction accesses E-BOM',
    sourceX: 300, sourceY: 320, 
    targetX: 330, targetY: 400
  },
  { 
    id: 'rel-18', 
    type: 'Access', 
    source: 'bp-2.1', 
    target: 'do-2',
    description: 'Prototyping accesses E-BOM',
    sourceX: 425, sourceY: 320, 
    targetX: 375, targetY: 400
  },
  { 
    id: 'rel-19', 
    type: 'Access', 
    source: 'bp-2.1', 
    target: 'do-3',
    description: 'Prototyping accesses M-BOM',
    sourceX: 475, sourceY: 320, 
    targetX: 525, targetY: 400
  },
  { 
    id: 'rel-20', 
    type: 'Access', 
    source: 'bp-2.1', 
    target: 'do-4',
    description: 'Prototyping accesses test specifications',
    sourceX: 525, sourceY: 320, 
    targetX: 650, targetY: 400
  },
  { 
    id: 'rel-21', 
    type: 'Access', 
    source: 'bp-3.1', 
    target: 'do-5',
    description: 'Production accesses test instructions',
    sourceX: 600, sourceY: 320, 
    targetX: 450, targetY: 490
  },
  { 
    id: 'rel-22', 
    type: 'Access', 
    source: 'bp-3.1', 
    target: 'do-6',
    description: 'Production accesses work instructions',
    sourceX: 650, sourceY: 320, 
    targetX: 650, targetY: 490
  },
  { 
    id: 'rel-23', 
    type: 'Access', 
    source: 'bp-3.1', 
    target: 'do-3',
    description: 'Production accesses M-BOM',
    sourceX: 550, sourceY: 320, 
    targetX: 500, targetY: 400
  },
  { 
    id: 'rel-24', 
    type: 'Access', 
    source: 'bp-4.1', 
    target: 'do-7',
    description: 'Service accesses complaint data',
    sourceX: 825, sourceY: 320, 
    targetX: 825, targetY: 400
  },
  
  // Composition relationships for Data Models
  { 
    id: 'rel-30', 
    type: 'Composition', 
    source: 'dm-1', 
    target: 'do-1',
    description: 'Graphical model composes product model',
    sourceX: 160, sourceY: 580, 
    targetX: 160, targetY: 460
  },
  { 
    id: 'rel-31', 
    type: 'Composition', 
    source: 'dm-2', 
    target: 'do-2',
    description: 'Structure model composes E-BOM',
    sourceX: 300, sourceY: 580, 
    targetX: 350, targetY: 460
  },
  { 
    id: 'rel-32', 
    type: 'Composition', 
    source: 'dm-2', 
    target: 'do-3',
    description: 'Structure model composes M-BOM',
    sourceX: 330, sourceY: 580, 
    targetX: 500, targetY: 460
  },
  { 
    id: 'rel-33', 
    type: 'Composition', 
    source: 'dm-3', 
    target: 'do-6',
    description: 'Material flow model composes assembly instructions',
    sourceX: 450, sourceY: 580, 
    targetX: 600, targetY: 550
  },
  { 
    id: 'rel-34', 
    type: 'Composition', 
    source: 'dm-4', 
    target: 'do-5',
    description: 'Capabilities model composes test instructions',
    sourceX: 580, sourceY: 580, 
    targetX: 450, targetY: 550
  },
  { 
    id: 'rel-35', 
    type: 'Composition', 
    source: 'dm-5', 
    target: 'do-7',
    description: 'KPI model composes complaint data',
    sourceX: 720, sourceY: 580, 
    targetX: 825, targetY: 460
  },
  { 
    id: 'rel-36', 
    type: 'Composition', 
    source: 'dm-5', 
    target: 'do-4',
    description: 'KPI model composes test specifications',
    sourceX: 750, sourceY: 580, 
    targetX: 700, targetY: 460
  }
];

// Product SubTabs Component
const SubTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200">
      <button
        className={`px-6 py-3 text-sm font-medium ${
          activeTab === 'diagram' 
            ? 'text-teal-600 border-b-2 border-teal-600' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onTabChange('diagram')}
      >
        Diagram
      </button>
      <button
        className={`px-6 py-3 text-sm font-medium ${
          activeTab === 'elements' 
            ? 'text-teal-600 border-b-2 border-teal-600' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onTabChange('elements')}
      >
        Elements
      </button>
      <button
        className={`px-6 py-3 text-sm font-medium ${
          activeTab === 'details' 
            ? 'text-teal-600 border-b-2 border-teal-600' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onTabChange('details')}
      >
        Element Details
      </button>
    </div>
  );
};

const ProductReferenceArchitecture = ({ selectedElement, setSelectedElement, departmentId = 'operations' }) => {
  const [activeSubTab, setActiveSubTab] = useState('diagram');
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [highlightedConnections, setHighlightedConnections] = useState([]);
  const [customConnections, setCustomConnections] = useState([]);
  const [connectionNotification, setConnectionNotification] = useState(null);

  // Get the currently selected element's data
  const selectedElementData = selectedElement 
    ? architectureElements.find(el => el.id === selectedElement) 
    : null;
    
  // Filter relationships based on selected element
  const incomingRelationships = selectedElement
    ? relationships.filter(rel => rel.target === selectedElement)
    : [];
  
  const outgoingRelationships = selectedElement
    ? relationships.filter(rel => rel.source === selectedElement)
    : [];

  // Calculate path for relationship lines
  const calculatePath = (rel) => {
    const sourceX = rel.sourceX || 0;
    const sourceY = rel.sourceY || 0;
    const targetX = rel.targetX || 100;
    const targetY = rel.targetY || 100;
    
    if (rel.type === 'Triggering') {
      return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
    } else {
      // Add a curved path for non-triggering relationships
      const midX = (sourceX + targetX) / 2;
      const midY = (sourceY + targetY) / 2 - 20;
      return `M ${sourceX} ${sourceY} Q ${midX} ${midY}, ${targetX} ${targetY}`;
    }
  };

  // Handle clicking an element
  const handleElementClick = (elementId, event) => {
    event.stopPropagation();
    setSelectedElement(elementId === selectedElement ? null : elementId);
  };

  // Handle clicking the background
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
      const isConnected = relationships.some(rel => 
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

  // Get type styles for the elements table
  const getTypeStyles = (type) => {
    switch (type) {
      case 'Value Stream':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Business Process':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'Data Object':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Data Model':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="h-full relative">
      {/* Display the diagram */}
      <div className="h-[calc(100vh-190px)]" onClick={handleBackgroundClick}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1200 800"
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

          {/* Render elements */}
          {architectureElements.map((element) => {
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
                    !relationships.some(rel => 
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
                    !relationships.some(rel => 
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

      {/* Reset Button */}
      <button
        onClick={() => {
          setSelectedElement(null);
        }}
        className="absolute top-2 left-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1 rounded text-sm"
      >
        Reset
      </button>
    </div>
  );
};

// Expose architectureElements and relationships as static properties
ProductReferenceArchitecture.architectureElements = architectureElements;
ProductReferenceArchitecture.relationships = relationships;

export default ProductReferenceArchitecture;