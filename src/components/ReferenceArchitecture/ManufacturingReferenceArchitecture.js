import React, { useState } from 'react';

// Manufacturing Technology perspective architecture data
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
  
  // Business Processes (Middle row - Manufacturing Technology Perspective)
  { 
    id: 'bp-1.1', 
    name: '1.1 Planung, Entwicklung', 
    type: 'Business Process', 
    description: 'Planning and development of manufacturing technology',
    x: 50, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-1.2', 
    name: '1.2 Konstruktion', 
    type: 'Business Process', 
    description: 'Construction of manufacturing technology',
    x: 225, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-2.1', 
    name: '2.1 Virtuelle Inbetriebnahme', 
    type: 'Business Process', 
    description: 'Virtual commissioning of manufacturing technology',
    x: 400, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-3.1', 
    name: '3.1 Produktion', 
    type: 'Business Process', 
    description: 'Production using manufacturing technology',
    x: 575, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-3.2', 
    name: '3.2 Instandhaltung & Optimierung', 
    type: 'Business Process', 
    description: 'Maintenance and optimization of manufacturing technology',
    x: 750, y: 250, width: 210, height: 70
  },
  { 
    id: 'bp-4.1', 
    name: '4.1 Modernisierung, Recycling', 
    type: 'Business Process', 
    description: 'Modernization and recycling of manufacturing technology',
    x: 985, y: 250, width: 210, height: 70
  },
  
  // Data Objects (Lower section - based on screenshots)
  { 
    id: 'do-1', 
    name: 'Lasten- & Pflichtenheft', 
    type: 'Data Object', 
    description: 'Requirement specifications',
    x: 125, y: 350, width: 150, height: 60
  },
  { 
    id: 'do-2', 
    name: 'Maschinen- o. Anlagenmodell (3D)', 
    type: 'Data Object', 
    description: '3D model of machine or facility',
    x: 300, y: 350, width: 210, height: 60
  },
  { 
    id: 'do-3', 
    name: 'BOR', 
    type: 'Data Object', 
    description: 'Bill of Resources',
    x: 525, y: 350, width: 150, height: 60
  },
  { 
    id: 'do-4', 
    name: 'BOM Maschine o. Anlage', 
    type: 'Data Object', 
    description: 'Bill of Materials for machine or facility',
    x: 700, y: 350, width: 200, height: 60
  },
  { 
    id: 'do-5', 
    name: 'Simulationsmodelle & -daten', 
    type: 'Data Object', 
    description: 'Simulation models and data',
    x: 500, y: 430, width: 200, height: 60
  },
  { 
    id: 'do-6', 
    name: 'Testspezifikation & Toleranzangaben', 
    type: 'Data Object', 
    description: 'Test specifications and tolerance information',
    x: 500, y: 510, width: 250, height: 60
  },
  { 
    id: 'do-7', 
    name: 'Maschinen- & Betriebsdaten', 
    type: 'Data Object', 
    description: 'Machine and operational data',
    x: 800, y: 510, width: 200, height: 60
  },
  { 
    id: 'do-8', 
    name: 'Fehlerberichte', 
    type: 'Data Object', 
    description: 'Error reports',
    x: 500, y: 590, width: 150, height: 60
  },
  { 
    id: 'do-9', 
    name: 'Wartungspläne', 
    type: 'Data Object', 
    description: 'Maintenance plans',
    x: 700, y: 590, width: 150, height: 60
  },
  
  // Data Models (Bottom row)
  { 
    id: 'dm-1', 
    name: 'Grafisches Modell', 
    type: 'Data Model', 
    description: 'Graphical model',
    x: 130, y: 680, width: 120, height: 60
  },
  { 
    id: 'dm-2', 
    name: 'Strukturmodell', 
    type: 'Data Model', 
    description: 'Structure model',
    x: 270, y: 680, width: 120, height: 60
  },
  { 
    id: 'dm-3', 
    name: 'Materialfluss', 
    type: 'Data Model', 
    description: 'Material flow data model',
    x: 410, y: 680, width: 120, height: 60
  },
  { 
    id: 'dm-4', 
    name: 'Fähigkeitenmodell', 
    type: 'Data Model', 
    description: 'Capabilities model',
    x: 550, y: 680, width: 120, height: 60
  },
  { 
    id: 'dm-5', 
    name: 'Kennzahlenmodell', 
    type: 'Data Model', 
    description: 'KPI model',
    x: 690, y: 680, width: 120, height: 60
  }
];

// Define relationships between elements in manufacturing technology perspective
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
    target: 'vs-3.1',
    description: 'Construction triggers service and maintenance',
    sourceX: 450, sourceY: 120, 
    targetX: 500, targetY: 150
  },
  { 
    id: 'rel-3', 
    type: 'Triggering', 
    source: 'vs-2', 
    target: 'vs-3',
    description: 'Construction triggers operation',
    sourceX: 550, sourceY: 85, 
    targetX: 600, targetY: 85
  },
  { 
    id: 'rel-4', 
    type: 'Triggering', 
    source: 'vs-3', 
    target: 'vs-4',
    description: 'Operation triggers decommissioning',
    sourceX: 800, sourceY: 85, 
    targetX: 850, targetY: 85
  },
  { 
    id: 'rel-5', 
    type: 'Triggering', 
    source: 'vs-3.1', 
    target: 'vs-3.2',
    description: 'Service triggers replanning',
    sourceX: 670, sourceY: 185, 
    targetX: 750, targetY: 185
  },
  { 
    id: 'rel-6', 
    type: 'Triggering', 
    source: 'vs-3.2', 
    target: 'vs-4',
    description: 'Replanning triggers decommissioning',
    sourceX: 835, sourceY: 150, 
    targetX: 875, targetY: 120
  },
  
  // Business Process flow lines
  { 
    id: 'rel-7', 
    type: 'Triggering', 
    source: 'bp-1.1', 
    target: 'bp-1.2',
    description: 'Planning triggers construction',
    sourceX: 200, sourceY: 285, 
    targetX: 225, targetY: 285
  },
  { 
    id: 'rel-8', 
    type: 'Triggering', 
    source: 'bp-1.2', 
    target: 'bp-2.1',
    description: 'Construction triggers virtual commissioning',
    sourceX: 375, sourceY: 285, 
    targetX: 400, targetY: 285
  },
  { 
    id: 'rel-9', 
    type: 'Triggering', 
    source: 'bp-2.1', 
    target: 'bp-3.1',
    description: 'Virtual commissioning triggers production',
    sourceX: 550, sourceY: 285, 
    targetX: 575, targetY: 285
  },
  { 
    id: 'rel-10', 
    type: 'Triggering', 
    source: 'bp-3.1', 
    target: 'bp-3.2',
    description: 'Production triggers maintenance',
    sourceX: 725, sourceY: 285, 
    targetX: 750, targetY: 285
  },
  { 
    id: 'rel-11', 
    type: 'Triggering', 
    source: 'bp-3.2', 
    target: 'bp-4.1',
    description: 'Maintenance triggers modernization',
    sourceX: 960, sourceY: 285, 
    targetX: 985, targetY: 285
  },
  
  // Value Stream to Business Process relationships (realization)
  { 
    id: 'rel-12', 
    type: 'Realization', 
    source: 'bp-1.1', 
    target: 'vs-1',
    description: 'Planning implements specification',
    sourceX: 125, sourceY: 250, 
    targetX: 150, targetY: 120
  },
  { 
    id: 'rel-13', 
    type: 'Realization', 
    source: 'bp-1.2', 
    target: 'vs-1',
    description: 'Construction implements specification',
    sourceX: 300, sourceY: 250, 
    targetX: 200, targetY: 120
  },
  { 
    id: 'rel-14', 
    type: 'Realization', 
    source: 'bp-2.1', 
    target: 'vs-2',
    description: 'Virtual commissioning implements construction',
    sourceX: 475, sourceY: 250, 
    targetX: 450, targetY: 120
  },
  { 
    id: 'rel-15', 
    type: 'Realization', 
    source: 'bp-3.1', 
    target: 'vs-3',
    description: 'Production implements operation',
    sourceX: 650, sourceY: 250, 
    targetX: 700, targetY: 120
  },
  { 
    id: 'rel-16', 
    type: 'Realization', 
    source: 'bp-3.2', 
    target: 'vs-3.2',
    description: 'Maintenance implements replanning',
    sourceX: 835, sourceY: 250, 
    targetX: 835, targetY: 220
  },
  { 
    id: 'rel-17', 
    type: 'Realization', 
    source: 'bp-4.1', 
    target: 'vs-4',
    description: 'Modernization implements decommissioning',
    sourceX: 1060, sourceY: 250, 
    targetX: 950, targetY: 120
  },
  
  // Business Process to Data Object access relationships
  { 
    id: 'rel-18', 
    type: 'Access', 
    source: 'bp-1.1', 
    target: 'do-1',
    description: 'Planning accesses requirements',
    sourceX: 125, sourceY: 320, 
    targetX: 125, targetY: 350
  },
  { 
    id: 'rel-19', 
    type: 'Access', 
    source: 'bp-1.2', 
    target: 'do-2',
    description: 'Construction accesses 3D model',
    sourceX: 275, sourceY: 320, 
    targetX: 300, targetY: 350
  },
  { 
    id: 'rel-20', 
    type: 'Access', 
    source: 'bp-1.2', 
    target: 'do-3',
    description: 'Construction accesses bill of resources',
    sourceX: 275, sourceY: 320, 
    targetX: 525, targetY: 350
  },
  { 
    id: 'rel-21', 
    type: 'Access', 
    source: 'bp-1.2', 
    target: 'do-4',
    description: 'Construction accesses bill of materials',
    sourceX: 275, sourceY: 320, 
    targetX: 700, targetY: 350
  },
  { 
    id: 'rel-22', 
    type: 'Access', 
    source: 'bp-1.2', 
    target: 'do-5',
    description: 'Construction accesses simulation models',
    sourceX: 275, sourceY: 320, 
    targetX: 500, targetY: 430
  },
  { 
    id: 'rel-23', 
    type: 'Access', 
    source: 'bp-1.2', 
    target: 'do-6',
    description: 'Construction accesses test specifications',
    sourceX: 275, sourceY: 320, 
    targetX: 500, targetY: 510
  },
  { 
    id: 'rel-24', 
    type: 'Access', 
    source: 'bp-2.1', 
    target: 'do-5',
    description: 'Virtual commissioning accesses simulation models',
    sourceX: 475, sourceY: 320, 
    targetX: 500, targetY: 430
  },
  { 
    id: 'rel-25', 
    type: 'Access', 
    source: 'bp-2.1', 
    target: 'do-6',
    description: 'Virtual commissioning accesses test specifications',
    sourceX: 475, sourceY: 320, 
    targetX: 500, targetY: 510
  },
  { 
    id: 'rel-26', 
    type: 'Access', 
    source: 'bp-3.1', 
    target: 'do-7',
    description: 'Production accesses machine data',
    sourceX: 650, sourceY: 320, 
    targetX: 800, targetY: 510
  },
  { 
    id: 'rel-27', 
    type: 'Access', 
    source: 'bp-3.1', 
    target: 'do-9',
    description: 'Production accesses maintenance plans',
    sourceX: 650, sourceY: 320, 
    targetX: 700, targetY: 590
  },
  { 
    id: 'rel-28', 
    type: 'Access', 
    source: 'bp-3.1', 
    target: 'do-5',
    description: 'Production accesses simulation models',
    sourceX: 650, sourceY: 320, 
    targetX: 600, targetY: 430
  },
  { 
    id: 'rel-29', 
    type: 'Access', 
    source: 'bp-3.1', 
    target: 'do-8',
    description: 'Production accesses error reports',
    sourceX: 650, sourceY: 320, 
    targetX: 500, targetY: 590
  },
  { 
    id: 'rel-30', 
    type: 'Access', 
    source: 'bp-3.2', 
    target: 'do-7',
    description: 'Maintenance accesses machine data',
    sourceX: 855, sourceY: 320, 
    targetX: 800, targetY: 510
  },
  { 
    id: 'rel-31', 
    type: 'Access', 
    source: 'bp-3.2', 
    target: 'do-9',
    description: 'Maintenance accesses maintenance plans',
    sourceX: 855, sourceY: 320, 
    targetX: 700, targetY: 590
  },
  { 
    id: 'rel-32', 
    type: 'Access', 
    source: 'bp-3.2', 
    target: 'do-8',
    description: 'Maintenance accesses error reports',
    sourceX: 855, sourceY: 320, 
    targetX: 500, targetY: 590
  },
  { 
    id: 'rel-33', 
    type: 'Access', 
    source: 'bp-4.1', 
    target: 'do-7',
    description: 'Modernization accesses machine data',
    sourceX: 1060, sourceY: 320, 
    targetX: 800, targetY: 510
  },
  { 
    id: 'rel-34', 
    type: 'Access', 
    source: 'bp-4.1', 
    target: 'do-9',
    description: 'Modernization accesses maintenance plans',
    sourceX: 1060, sourceY: 320, 
    targetX: 700, targetY: 590
  },
  { 
    id: 'rel-35', 
    type: 'Access', 
    source: 'bp-4.1', 
    target: 'do-8',
    description: 'Modernization accesses error reports',
    sourceX: 1060, sourceY: 320, 
    targetX: 500, targetY: 590
  },
  
  // Data Model relationships (composition)
  { 
    id: 'rel-36', 
    type: 'Composition', 
    source: 'dm-1', 
    target: 'do-2',
    description: 'Graphical model composes 3D machine model',
    sourceX: 170, sourceY: 680, 
    targetX: 300, targetY: 410
  },
  { 
    id: 'rel-37', 
    type: 'Composition', 
    source: 'dm-1', 
    target: 'dm-2',
    description: 'Graphical model composes structure model',
    sourceX: 250, sourceY: 710, 
    targetX: 270, targetY: 710
  },
  { 
    id: 'rel-38', 
    type: 'Composition', 
    source: 'dm-2', 
    target: 'do-4',
    description: 'Structure model composes bill of materials',
    sourceX: 330, sourceY: 680, 
    targetX: 700, targetY: 410
  },
  { 
    id: 'rel-39', 
    type: 'Composition', 
    source: 'dm-3', 
    target: 'do-7',
    description: 'Material flow model composes machine data',
    sourceX: 470, sourceY: 680, 
    targetX: 800, targetY: 570
  },
  { 
    id: 'rel-40', 
    type: 'Composition', 
    source: 'dm-3', 
    target: 'do-5',
    description: 'Material flow model composes simulation models',
    sourceX: 470, sourceY: 680, 
    targetX: 600, targetY: 490
  },
  { 
    id: 'rel-41', 
    type: 'Composition', 
    source: 'dm-4', 
    target: 'do-8',
    description: 'Capabilities model composes error reports',
    sourceX: 610, sourceY: 680, 
    targetX: 500, targetY: 650
  },
  { 
    id: 'rel-42', 
    type: 'Composition', 
    source: 'dm-4', 
    target: 'do-1',
    description: 'Capabilities model composes requirements',
    sourceX: 610, sourceY: 680, 
    targetX: 125, targetY: 410
  },
  { 
    id: 'rel-43', 
    type: 'Composition', 
    source: 'dm-4', 
    target: 'do-3',
    description: 'Capabilities model composes bill of resources',
    sourceX: 610, sourceY: 680, 
    targetX: 525, targetY: 410
  },
  { 
    id: 'rel-44', 
    type: 'Composition', 
    source: 'dm-4', 
    target: 'do-5',
    description: 'Capabilities model composes simulation models',
    sourceX: 610, sourceY: 680, 
    targetX: 550, targetY: 490
  },
  { 
    id: 'rel-45', 
    type: 'Composition', 
    source: 'dm-4', 
    target: 'do-9',
    description: 'Capabilities model composes maintenance plans',
    sourceX: 610, sourceY: 680, 
    targetX: 700, targetY: 650
  },
  { 
    id: 'rel-46', 
    type: 'Composition', 
    source: 'dm-5', 
    target: 'do-6',
    description: 'KPI model composes test specifications',
    sourceX: 750, sourceY: 680, 
    targetX: 625, targetY: 570
  },
  { 
    id: 'rel-47', 
    type: 'Composition', 
    source: 'dm-5', 
    target: 'do-8',
    description: 'KPI model composes error reports',
    sourceX: 750, sourceY: 680, 
    targetX: 500, targetY: 620
  },
  { 
    id: 'rel-48', 
    type: 'Composition', 
    source: 'dm-5', 
    target: 'do-7',
    description: 'KPI model composes machine data',
    sourceX: 750, sourceY: 680, 
    targetX: 800, targetY: 570
  }
];

// Manufacturing Technology perspective component
const ManufacturingReferenceArchitecture = ({ selectedElement, setSelectedElement, departmentId = 'operations' }) => {
  const [activeSubTab, setActiveSubTab] = useState('diagram');

  // Function to calculate the SVG path for relationships
  const calculatePath = (rel) => {
    // For straight lines between elements
    return `M${rel.sourceX} ${rel.sourceY} L${rel.targetX} ${rel.targetY}`;
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

  // Get appropriate styling for elements based on their selection state
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

  // Style for relationship lines
  const getRelationshipStyle = (relationship) => {
    if (!selectedElement) return '';
    
    const isHighlighted = relationship.source === selectedElement || 
                        relationship.target === selectedElement;
    
    return isHighlighted ? 'stroke-[2px]' : 'opacity-30';
  };

  // Define colors for different element types
  const getElementTypeColors = (type) => {
    switch(type) {
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

  // Define styles for different relationship types
  const getRelationshipTypeStyles = (type) => {
    switch(type) {
      case 'Triggering':
        return { 
          stroke: 'stroke-amber-500', 
          marker: 'url(#arrow-triggering)'
        };
      case 'Access':
        return { 
          stroke: 'stroke-cyan-500 stroke-dotted', 
          marker: 'url(#arrow-access)'
        };
      case 'Realization':
        return { 
          stroke: 'stroke-green-500 stroke-dashed', 
          marker: 'url(#arrow-realization)'
        };
      case 'Composition':
        return { 
          stroke: 'stroke-blue-500', 
          marker: 'url(#arrow-composition)'
        };
      case 'Association':
        return { 
          stroke: 'stroke-purple-500', 
          marker: 'url(#arrow-association)'
        };
      default:
        return { 
          stroke: 'stroke-gray-500', 
          marker: 'url(#arrow-triggering)'
        };
    }
  };

  // Styling for elements in table view
  const getTypeStyles = (type) => {
    switch(type) {
      case 'Value Stream':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Business Process':
        return 'bg-green-50 text-green-800 border-green-300';
      case 'Data Object':
        return 'bg-cyan-50 text-cyan-800 border-cyan-300';
      case 'Data Model':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Business Event':
        return 'bg-red-50 text-red-800 border-red-300';
      case 'Grouping':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-300';
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
          {/* Define arrow markers for relationships */}
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
            <marker
              id="arrow-association"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#8B5CF6" />
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

          {/* Render architecture elements */}
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
      
      {/* Selected element details panel */}
      {selectedElement && (
        <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-4 w-64 z-10">
          <h3 className="text-lg font-semibold text-gray-800">
            {architectureElements.find(el => el.id === selectedElement)?.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {architectureElements.find(el => el.id === selectedElement)?.type}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {architectureElements.find(el => el.id === selectedElement)?.description}
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

// Add architectureElements and relationships as static properties
ManufacturingReferenceArchitecture.architectureElements = architectureElements;
ManufacturingReferenceArchitecture.relationships = relationships;

export default ManufacturingReferenceArchitecture; 