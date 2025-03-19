import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

const ProductReferenceArchitecture = ({ departmentId = 'operations' }) => {
  const [activePerspective, setActivePerspective] = useState('product');
  const [activeTab, setActiveTab] = useState('diagram');
  const [selectedElement, setSelectedElement] = useState(null);
  const [detailsView, setDetailsView] = useState('properties');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

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

  // Element interaction handlers
  const handleElementClick = (elementId, event) => {
    event.stopPropagation(); // Prevent event bubbling
    setSelectedElement(elementId === selectedElement ? null : elementId);
  };
  
  const handleBackgroundClick = () => {
    setSelectedElement(null);
  };

  // Filter elements based on search and type
  const filteredElements = architectureElements.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         element.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || element.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Style functions for elements and relationships
  const getElementStyle = (elementId) => {
    if (!selectedElement) return '';
    
    if (elementId === selectedElement) {
      return 'stroke-2 stroke-blue-600 shadow-lg'; // Selected element
    }
    
    if (relationships.some(rel => 
      (rel.source === selectedElement && rel.target === elementId) ||
      (rel.target === selectedElement && rel.source === elementId)
    )) {
      return 'stroke-2 stroke-blue-400'; // Related element
    }
    
    return 'opacity-50'; // Non-related element
  };
  
  const getRelationshipStyle = (relationship) => {
    if (!selectedElement) return '';
    
    if (relationship.source === selectedElement || relationship.target === selectedElement) {
      return 'stroke-2 stroke-blue-500'; // Related relationship
    }
    
    return 'opacity-30'; // Non-related relationship
  };

  // Get color based on element type
  const getElementTypeColors = (type) => {
    switch (type) {
      case 'Value Stream':
        return { fill: 'fill-amber-50', stroke: 'stroke-amber-200', text: 'text-amber-800' };
      case 'Business Process':
        return { fill: 'fill-green-50', stroke: 'stroke-green-200', text: 'text-green-800' };
      case 'Data Object':
        return { fill: 'fill-cyan-50', stroke: 'stroke-cyan-200', text: 'text-cyan-800' };
      case 'Data Model':
        return { fill: 'fill-blue-50', stroke: 'stroke-blue-200', text: 'text-blue-800' };
      default:
        return { fill: 'fill-gray-50', stroke: 'stroke-gray-200', text: 'text-gray-800' };
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

  // Get styling for element type badge
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-4">
        {/* Navigation Back Link */}
        <div className="mb-4">
          <Link 
            href={`/departments/${departmentId}`} 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Department</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Reference Architecture</h1>
          <p className="text-gray-600">Referenzarchitektur Digitaler Fabrikzwilling: Prozesssicht</p>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          {/* Perspective Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activePerspective === 'factory' 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActivePerspective('factory')}
            >
              Perspektive Fabrik
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activePerspective === 'product' 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActivePerspective('product')}
            >
              Perspektive Produkt
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activePerspective === 'order' 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActivePerspective('order')}
            >
              Perspektive Auftrag
            </button>
          </div>

          {/* Content Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'diagram' 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('diagram')}
            >
              Diagram
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'elements' 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('elements')}
            >
              Elements
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'details' 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Element Details
            </button>
          </div>

          {/* Content Area */}
          <div className="p-4">
            {/* Diagram Tab Content */}
            {activeTab === 'diagram' && (
              <div className="relative">
                <svg
                  width="100%"
                  height="750"
                  viewBox="0 0 1300 750"
                  xmlns="http://www.w3.org/2000/svg"
                  className="bg-white rounded-lg shadow-sm border border-gray-100"
                  onClick={handleBackgroundClick}
                >
                  {/* Render relationships first (under elements) */}
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
                        <p className="text-sm text-gray-600">Click element again or elsewhere to reset selection.</p>
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
            )}

            {/* Elements Tab Content */}
            {activeTab === 'elements' && (
              <div className="overflow-hidden">
                <div className="mb-4 flex flex-col sm:flex-row gap-3">
                  {/* Search input */}
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search elements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Type filter */}
                  <select
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="Value Stream">Value Stream</option>
                    <option value="Business Process">Business Process</option>
                    <option value="Data Object">Data Object</option>
                    <option value="Data Model">Data Model</option>
                  </select>
                </div>

                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredElements.map((element) => (
                        <tr 
                          key={element.id} 
                          className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                            element.id === selectedElement ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => setSelectedElement(element.id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{element.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getTypeStyles(element.type)}`}>
                              {element.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">{element.description}</div>
                          </td>
                        </tr>
                      ))}
                      
                      {filteredElements.length === 0 && (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                            No elements found matching your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Details Tab Content */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <svg
                      width="100%"
                      height="750"
                      viewBox="0 0 1300 750"
                      xmlns="http://www.w3.org/2000/svg"
                      className="bg-white rounded-lg shadow-sm border border-gray-100"
                      onClick={handleBackgroundClick}
                    >
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
                  </div>
                </div>
                <div>
                  <ElementDetails
                    element={selectedElementData}
                    incomingRelationships={incomingRelationships}
                    outgoingRelationships={outgoingRelationships}
                    detailsView={detailsView}
                    setDetailsView={setDetailsView}
                    architectureElements={architectureElements}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-amber-50 border border-amber-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Value Stream</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Business Process</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-cyan-50 border border-cyan-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Data Object</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Data Model</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Model Layer</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-amber-500 mr-2"></div>
              <span className="text-sm text-gray-600">Triggering</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-0.5 border-t-2 border-dashed border-green-500 mr-2"></div>
              <span className="text-sm text-gray-600">Realization</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-0.5 border-t border-dotted border-cyan-500 mr-2"></div>
              <span className="text-sm text-gray-600">Access</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-blue-500 mr-2"></div>
              <span className="text-sm text-gray-600">Composition</span>
            </div>
          </div>
          <div className="mt-4 p-2 bg-blue-50 text-blue-800 rounded">
            <p className="text-sm">
              <span className="font-medium">Tip:</span> Click on any element in the diagram to highlight its related elements and connections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Element Details Component
const ElementDetails = ({ 
  element, 
  incomingRelationships, 
  outgoingRelationships, 
  detailsView, 
  setDetailsView,
  architectureElements 
}) => {
  if (!element) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        <p>Select an element in the diagram or from the element list to view its details.</p>
      </div>
    );
  }

  // Get background color for element type
  const getTypeColor = (type) => {
    switch (type) {
      case 'Value Stream':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'Business Process':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'Data Object':
        return 'bg-cyan-50 border-cyan-200 text-cyan-800';
      case 'Data Model':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 ${getTypeColor(element.type)}`}>
            <span className="text-lg font-bold">{element.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">{element.name}</h3>
            <p className="text-sm text-gray-600">{element.type}</p>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              detailsView === 'properties' 
                ? 'text-teal-600 border-b-2 border-teal-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setDetailsView('properties')}
          >
            Properties
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              detailsView === 'relationships' 
                ? 'text-teal-600 border-b-2 border-teal-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setDetailsView('relationships')}
          >
            Relationships
          </button>
        </div>
      </div>
      
      {detailsView === 'properties' && (
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">ID</h4>
              <p className="mt-1 text-sm text-gray-900">{element.id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Name</h4>
              <p className="mt-1 text-sm text-gray-900">{element.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Type</h4>
              <p className="mt-1 text-sm text-gray-900">{element.type}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="mt-1 text-sm text-gray-900">{element.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Position</h4>
              <p className="mt-1 text-sm text-gray-900">X: {element.x}, Y: {element.y}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Size</h4>
              <p className="mt-1 text-sm text-gray-900">Width: {element.width}, Height: {element.height}</p>
            </div>
          </div>
        </div>
      )}
      
      {detailsView === 'relationships' && (
        <div className="p-4">
          <div className="space-y-6">
            {/* Incoming relationships */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Incoming Relationships</h4>
              {incomingRelationships.length > 0 ? (
                <div className="space-y-2">
                  {incomingRelationships.map(rel => {
                    const sourceElement = architectureElements.find(el => el.id === rel.source);
                    return (
                      <div key={rel.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="text-sm font-medium">{sourceElement?.name || rel.source}</span>
                          <span className="text-xs text-gray-500 ml-2">({sourceElement?.type || 'Unknown'})</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full border ${
                          rel.type === 'Triggering' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          rel.type === 'Realization' ? 'bg-green-50 text-green-800 border-green-200' :
                          rel.type === 'Access' ? 'bg-cyan-50 text-cyan-800 border-cyan-200' :
                          rel.type === 'Composition' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          'bg-gray-50 text-gray-800 border-gray-200'
                        }`}>
                          {rel.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No incoming relationships</p>
              )}
            </div>
            
            {/* Outgoing relationships */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Outgoing Relationships</h4>
              {outgoingRelationships.length > 0 ? (
                <div className="space-y-2">
                  {outgoingRelationships.map(rel => {
                    const targetElement = architectureElements.find(el => el.id === rel.target);
                    return (
                      <div key={rel.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="text-sm font-medium">{targetElement?.name || rel.target}</span>
                          <span className="text-xs text-gray-500 ml-2">({targetElement?.type || 'Unknown'})</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full border ${
                          rel.type === 'Triggering' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          rel.type === 'Realization' ? 'bg-green-50 text-green-800 border-green-200' :
                          rel.type === 'Access' ? 'bg-cyan-50 text-cyan-800 border-cyan-200' :
                          rel.type === 'Composition' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          'bg-gray-50 text-gray-800 border-gray-200'
                        }`}>
                          {rel.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No outgoing relationships</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReferenceArchitecture;