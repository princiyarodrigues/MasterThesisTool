import React, { useState } from 'react';

// Final View architecture data
const architectureElements = [
  // Value Streams (Top row)
  { 
    id: 'vs-1', 
    name: '1. Spezifikation & Planung', 
    type: 'Value Stream', 
    description: 'Planning and specification phase',
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
    description: 'Operational phase',
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
  
  // Business Processes
  { 
    id: 'bp-1.1', 
    name: '1.1 Planung, Entwicklung', 
    type: 'Business Process', 
    description: 'Planning and development',
    x: 50, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-1.2', 
    name: '1.2 Konstruktion', 
    type: 'Business Process', 
    description: 'Construction',
    x: 225, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-2.1', 
    name: '2.1 Rapid Prototyping', 
    type: 'Business Process', 
    description: 'Rapid prototyping process',
    x: 400, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-3.1', 
    name: '3.1 Produktion', 
    type: 'Business Process', 
    description: 'Production process',
    x: 575, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-4.1', 
    name: '4.1 Gebrauch & Service', 
    type: 'Business Process', 
    description: 'Usage and service',
    x: 750, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-4.2', 
    name: '4.2 Recycling, Verschrottung', 
    type: 'Business Process', 
    description: 'Recycling and disposal',
    x: 925, y: 250, width: 150, height: 70
  },
  
  // Data Objects
  { 
    id: 'do-1', 
    name: 'Produktmodell (3D)', 
    type: 'Data Object', 
    description: '3D product model',
    x: 125, y: 350, width: 150, height: 70
  },
  { 
    id: 'do-2', 
    name: 'E-BOM', 
    type: 'Data Object', 
    description: 'Engineering Bill of Materials',
    x: 325, y: 350, width: 150, height: 70
  },
  { 
    id: 'do-3', 
    name: 'M-BOM', 
    type: 'Data Object', 
    description: 'Manufacturing Bill of Materials',
    x: 525, y: 350, width: 150, height: 70
  },
  { 
    id: 'do-4', 
    name: 'Testspezifikation & Toleranzen', 
    type: 'Data Object', 
    description: 'Test specifications and tolerances',
    x: 725, y: 350, width: 150, height: 70
  },
  { 
    id: 'do-5', 
    name: 'Produktreklamationsdaten', 
    type: 'Data Object', 
    description: 'Product complaint data',
    x: 925, y: 350, width: 150, height: 70
  }
];

// Define relationships between elements
const relationships = [
  // Value Stream relationships
  { source: 'vs-1', target: 'vs-2', type: 'Triggering' },
  { source: 'vs-2', target: 'vs-3', type: 'Triggering' },
  { source: 'vs-3', target: 'vs-4', type: 'Triggering' },
  { source: 'vs-3', target: 'vs-3.1', type: 'Composition' },
  { source: 'vs-3', target: 'vs-3.2', type: 'Composition' },
  
  // Value Stream to Business Process relationships
  { source: 'vs-1', target: 'bp-1.1', type: 'Realization' },
  { source: 'vs-1', target: 'bp-1.2', type: 'Realization' },
  { source: 'vs-2', target: 'bp-2.1', type: 'Realization' },
  { source: 'vs-3', target: 'bp-3.1', type: 'Realization' },
  { source: 'vs-4', target: 'bp-4.1', type: 'Realization' },
  { source: 'vs-4', target: 'bp-4.2', type: 'Realization' },
  
  // Business Process to Data Object relationships
  { source: 'bp-1.1', target: 'do-1', type: 'Access' },
  { source: 'bp-1.2', target: 'do-2', type: 'Access' },
  { source: 'bp-2.1', target: 'do-3', type: 'Access' },
  { source: 'bp-3.1', target: 'do-4', type: 'Access' },
  { source: 'bp-4.1', target: 'do-5', type: 'Access' }
];

const FinalViewReferenceArchitecture = ({ selectedElement, setSelectedElement, departmentId }) => {
  // State for this component
  const [viewMode, setViewMode] = useState('default');
  
  // Handle element selection
  const handleElementClick = (elementId) => {
    setSelectedElement(elementId === selectedElement ? null : elementId);
  };
  
  return (
    <div className="h-full w-full overflow-auto p-4 relative">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Final View Reference Architecture</h3>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 text-xs rounded ${viewMode === 'default' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setViewMode('default')}
            >
              Default View
            </button>
            <button
              className={`px-3 py-1 text-xs rounded ${viewMode === 'simplified' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setViewMode('simplified')}
            >
              Simplified View
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 overflow-auto h-[calc(100vh-210px)]">
        <svg width="1200" height="800" className="architecture-diagram">
          {/* Render elements */}
          {architectureElements.map(element => (
            <g 
              key={element.id} 
              onClick={() => handleElementClick(element.id)}
              className={`cursor-pointer ${selectedElement === element.id ? 'element-selected' : ''}`}
            >
              <rect
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                rx="5"
                className={`
                  ${element.type === 'Value Stream' ? 'fill-amber-100 stroke-amber-500' : ''}
                  ${element.type === 'Business Process' ? 'fill-green-100 stroke-green-500' : ''}
                  ${element.type === 'Data Object' ? 'fill-cyan-100 stroke-cyan-500' : ''}
                  ${selectedElement === element.id ? 'stroke-2' : 'stroke-1'}
                `}
              />
              <text
                x={element.x + (element.width / 2)}
                y={element.y + (element.height / 2)}
                textAnchor="middle"
                alignmentBaseline="middle"
                className="text-xs font-medium fill-gray-700"
              >
                {element.name}
              </text>
            </g>
          ))}
          
          {/* Render relationships */}
          {relationships.map((rel, index) => {
            const source = architectureElements.find(el => el.id === rel.source);
            const target = architectureElements.find(el => el.id === rel.target);
            
            if (!source || !target) return null;
            
            const sourceX = source.x + source.width / 2;
            const sourceY = source.y + source.height;
            const targetX = target.x + target.width / 2;
            const targetY = target.y;
            
            // Apply different styling based on relationship type
            let strokeClass = '';
            switch (rel.type) {
              case 'Triggering':
                strokeClass = 'stroke-amber-500';
                break;
              case 'Realization':
                strokeClass = 'stroke-green-500';
                break;
              case 'Access':
                strokeClass = 'stroke-cyan-500';
                break;
              case 'Composition':
                strokeClass = 'stroke-blue-500';
                break;
              default:
                strokeClass = 'stroke-gray-400';
            }
            
            return (
              <g key={`rel-${index}`}>
                <line
                  x1={sourceX}
                  y1={sourceY}
                  x2={targetX}
                  y2={targetY}
                  className={`${strokeClass} ${selectedElement === rel.source || selectedElement === rel.target ? 'stroke-2' : 'stroke-1'}`}
                  strokeDasharray={rel.type === 'Access' ? '5,5' : ''}
                  markerEnd="url(#arrowhead)"
                />
              </g>
            );
          })}
          
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" className="fill-current" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
};

// Expose the elements and relationships for use in the parent component
FinalViewReferenceArchitecture.architectureElements = architectureElements;
FinalViewReferenceArchitecture.relationships = relationships;

export default FinalViewReferenceArchitecture; 