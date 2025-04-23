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
    name: '1.1 Planung, Entwicklung (copy)', 
    type: 'Business Process', 
    description: 'Planning and development of manufacturing technology',
    x: 50, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-1.2', 
    name: '1.2 Konstruktion (copy)', 
    type: 'Business Process', 
    description: 'Construction of manufacturing technology',
    x: 225, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-2.1', 
    name: '2.1 Virtuelle Inbetriebnahme (copy)', 
    type: 'Business Process', 
    description: 'Virtual commissioning of manufacturing technology',
    x: 400, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-3.1', 
    name: '3.1 Produktion (copy)', 
    type: 'Business Process', 
    description: 'Production using manufacturing technology',
    x: 575, y: 250, width: 150, height: 70
  },
  { 
    id: 'bp-3.2', 
    name: '3.2 Instandhaltung & Optimierung (copy)', 
    type: 'Business Process', 
    description: 'Maintenance and optimization of manufacturing technology',
    x: 750, y: 250, width: 210, height: 70
  },
  { 
    id: 'bp-4.1', 
    name: '4.1 Modernisierung, Recycling (copy)', 
    type: 'Business Process', 
    description: 'Modernization and recycling of manufacturing technology',
    x: 985, y: 250, width: 210, height: 70
  },
  
  // Data Objects (Lower section - based on screenshots)
  { 
    id: 'do-1', 
    name: 'Lasten- & Pflichtenheft (copy)', 
    type: 'Data Object', 
    description: 'Requirement specifications',
    x: 125, y: 350, width: 150, height: 60
  },
  { 
    id: 'do-2', 
    name: 'Maschinen- o. Anlagenmodell (3D) (copy)', 
    type: 'Data Object', 
    description: '3D model of machine or facility',
    x: 300, y: 350, width: 210, height: 60
  },
  { 
    id: 'do-3', 
    name: 'BOR (copy)', 
    type: 'Data Object', 
    description: 'Bill of Resources',
    x: 525, y: 350, width: 150, height: 60
  },
  { 
    id: 'do-4', 
    name: 'BOM Maschine o. Anlage (copy)', 
    type: 'Data Object', 
    description: 'Bill of Materials for machine or facility',
    x: 700, y: 350, width: 200, height: 60
  },
  { 
    id: 'do-5', 
    name: 'Simulationsmodelle & -daten (copy)', 
    type: 'Data Object', 
    description: 'Simulation models and data',
    x: 500, y: 430, width: 200, height: 60
  },
  { 
    id: 'do-6', 
    name: 'Testspezifikation & Toleranzangaben (copy)', 
    type: 'Data Object', 
    description: 'Test specifications and tolerance information',
    x: 500, y: 510, width: 250, height: 60
  },
  { 
    id: 'do-7', 
    name: 'Maschinen- & Betriebsdaten (copy)', 
    type: 'Data Object', 
    description: 'Machine and operational data',
    x: 800, y: 510, width: 200, height: 60
  },
  { 
    id: 'do-8', 
    name: 'Fehlerberichte (copy)', 
    type: 'Data Object', 
    description: 'Error reports',
    x: 500, y: 590, width: 150, height: 60
  },
  { 
    id: 'do-9', 
    name: 'Wartungspläne (copy)', 
    type: 'Data Object', 
    description: 'Maintenance plans',
    x: 700, y: 590, width: 150, height: 60
  },
  
  // Data Models (Bottom row)
  { 
    id: 'dm-1', 
    name: 'Grafisches Modell (copy)', 
    type: 'Data Model', 
    description: 'Graphical model',
    x: 130, y: 680, width: 120, height: 60
  },
  { 
    id: 'dm-2', 
    name: 'Strukturmodell (copy)', 
    type: 'Data Model', 
    description: 'Structure model',
    x: 270, y: 680, width: 120, height: 60
  },
  { 
    id: 'dm-3', 
    name: 'Materialfluss (copy)', 
    type: 'Data Model', 
    description: 'Material flow data model',
    x: 410, y: 680, width: 120, height: 60
  },
  { 
    id: 'dm-4', 
    name: 'Fähigkeitenmodell (copy)', 
    type: 'Data Model', 
    description: 'Capabilities model',
    x: 550, y: 680, width: 120, height: 60
  },
  { 
    id: 'dm-5', 
    name: 'Kennzahlenmodell (copy)', 
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
    const isSelected = selectedElement === elementId;
    const element = architectureElements.find(el => el.id === elementId);
    const baseStyles = getElementTypeColors(element.type);
    
    return {
      fill: isSelected ? baseStyles.selectedFill : baseStyles.fill,
      stroke: isSelected ? baseStyles.selectedStroke : baseStyles.stroke,
      strokeWidth: isSelected ? 2 : 1,
      cursor: 'pointer',
      filter: isSelected ? 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.3))' : ''
    };
  };

  // Style for relationship lines
  const getRelationshipStyle = (relationship) => {
    const isSelected = selectedElement === relationship.source || selectedElement === relationship.target;
    const styles = getRelationshipTypeStyles(relationship.type);
    
    return {
      stroke: isSelected ? styles.selectedStroke : styles.stroke,
      strokeWidth: isSelected ? 3 : 2,
      strokeDasharray: styles.strokeDasharray,
      markerEnd: `url(#${relationship.type}Arrow)`,
      markerEndSelectedId: `${relationship.type}ArrowSelected`
    };
  };

  // Define colors for different element types
  const getElementTypeColors = (type) => {
    switch(type) {
      case 'Value Stream':
        return {
          fill: '#f9e79f',
          stroke: '#d4ac0d',
          selectedFill: '#f7dc6f',
          selectedStroke: '#b7950b'
        };
      case 'Business Process':
        return {
          fill: '#aed6f1',
          stroke: '#3498db',
          selectedFill: '#85c1e9',
          selectedStroke: '#2874a6'
        };
      case 'Data Object':
        return {
          fill: '#a3e4d7',
          stroke: '#1abc9c',
          selectedFill: '#76d7c4',
          selectedStroke: '#148f77'
        };
      case 'Data Model':
        return {
          fill: '#d5f5e3',
          stroke: '#27ae60',
          selectedFill: '#abebc6',
          selectedStroke: '#186a3b'
        };
      default:
        return {
          fill: '#ecf0f1',
          stroke: '#95a5a6',
          selectedFill: '#d0d3d4',
          selectedStroke: '#7f8c8d'
        };
    }
  };

  // Define styles for different relationship types
  const getRelationshipTypeStyles = (type) => {
    switch(type) {
      case 'Triggering':
        return {
          stroke: '#3498db',
          selectedStroke: '#2874a6',
          strokeDasharray: ''
        };
      case 'Access':
        return {
          stroke: '#e74c3c',
          selectedStroke: '#c0392b',
          strokeDasharray: ''
        };
      case 'Realization':
        return {
          stroke: '#2ecc71',
          selectedStroke: '#27ae60',
          strokeDasharray: '5,2'
        };
      case 'Composition':
        return {
          stroke: '#9b59b6',
          selectedStroke: '#8e44ad',
          strokeDasharray: '2,2'
        };
      case 'Association':
        return {
          stroke: '#f1c40f',
          selectedStroke: '#f39c12',
          strokeDasharray: '10,2'
        };
      default:
        return {
          stroke: '#95a5a6',
          selectedStroke: '#7f8c8d',
          strokeDasharray: ''
        };
    }
  };

  // Styling for elements in table view
  const getTypeStyles = (type) => {
    switch(type) {
      case 'Value Stream':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Business Process':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Data Object':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Data Model':
        return 'bg-lime-100 text-lime-800 border-lime-300';
      case 'Business Event':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Grouping':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="relative h-full" onClick={handleBackgroundClick}>
      <svg width="100%" height="100%" style={{ minWidth: '1200px', minHeight: '800px' }}>
        {/* Define arrow markers for relationships */}
        <defs>
          <marker
            id="TriggeringArrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3498db" />
          </marker>
          <marker
            id="TriggeringArrowSelected"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#2874a6" />
          </marker>
          <marker
            id="AccessArrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#e74c3c" />
          </marker>
          <marker
            id="AccessArrowSelected"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#c0392b" />
          </marker>
          <marker
            id="RealizationArrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#2ecc71" />
          </marker>
          <marker
            id="RealizationArrowSelected"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#27ae60" />
          </marker>
          <marker
            id="CompositionArrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#9b59b6" />
          </marker>
          <marker
            id="CompositionArrowSelected"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8e44ad" />
          </marker>
          <marker
            id="AssociationArrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f1c40f" />
          </marker>
          <marker
            id="AssociationArrowSelected"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f39c12" />
          </marker>
        </defs>

        {/* Draw relationship lines first (so they appear under the elements) */}
        {relationships.map(relationship => {
          const style = getRelationshipStyle(relationship);
          return (
            <path
              key={relationship.id}
              d={calculatePath(relationship)}
              style={{
                stroke: style.stroke,
                strokeWidth: style.strokeWidth,
                strokeDasharray: style.strokeDasharray,
                fill: 'none',
              }}
              markerEnd={selectedElement === relationship.source || selectedElement === relationship.target 
                ? `url(#${style.markerEndSelectedId})` 
                : style.markerEnd}
            />
          );
        })}

        {/* Draw the architectural elements */}
        {architectureElements.map(element => {
          const style = getElementStyle(element.id);
          return (
            <g key={element.id} onClick={(e) => handleElementClick(element.id, e)}>
              <rect
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                rx={4}
                style={style}
              />
              <text
                x={element.x + (element.width / 2)}
                y={element.y + (element.height / 2)}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: '12px',
                  fontWeight: selectedElement === element.id ? 'bold' : 'normal',
                  fill: '#333',
                  pointerEvents: 'none'
                }}
              >
                {element.name.length > 20 ? `${element.name.substring(0, 20)}...` : element.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Add architectureElements and relationships as static properties
ManufacturingReferenceArchitecture.architectureElements = architectureElements;
ManufacturingReferenceArchitecture.relationships = relationships;

export default ManufacturingReferenceArchitecture; 