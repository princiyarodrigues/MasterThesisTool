import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, ArrowRight, Plus, Minimize, Maximize, List, Columns, Info, ExternalLink } from 'lucide-react';

const FactoryArchitectureViewer = () => {
  const [activeTab, setActiveTab] = useState('factory');
  const [expandedSections, setExpandedSections] = useState({
    diagram: true,
    elements: false,
    relationships: false
  });
  const [selectedElement, setSelectedElement] = useState(null);
  const [detailsView, setDetailsView] = useState('properties');
  const [fullscreen, setFullscreen] = useState(false);
  const [highlightedRelationships, setHighlightedRelationships] = useState([]);
  const [animating, setAnimating] = useState(false);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle element selection with animation
  const handleElementClick = (elementId) => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 100);
    
    // If clicking the same element, deselect it
    if (elementId === selectedElement) {
      setSelectedElement(null);
      setHighlightedRelationships([]);
      return;
    }
    
    // Select the element and highlight relationships
    setSelectedElement(elementId);
    
    // Find all relationships for this element
    const element = getElementDetails(elementId);
    if (!element) {
      setHighlightedRelationships([]);
      return;
    }
    
    const elementName = element.name;
    
    const related = relationships.filter(rel => 
      rel.source.includes(elementName) || rel.target.includes(elementName)
    );
    
    setHighlightedRelationships(related);
  };

  // Define the architecture elements data
  const architectureElements = [
    { id: '1_spezifikation', name: '1. Spezifikation & Planung', type: 'Value Stream', description: 'Planning and specification phase of the factory lifecycle' },
    { id: '1.1_investitionsplanung', name: '1.1 Investitionsplanung', type: 'Business Process', description: 'Investment planning for factory development' },
    { id: '1.2_engineering', name: '1.2 Engineering', type: 'Business Process', description: 'Technical engineering of factory systems' },
    { id: '2_aufbau', name: '2. Aufbau & Inbetriebnahme', type: 'Value Stream', description: 'Construction and commissioning phase' },
    { id: '2.1_anlauf', name: '2.1 Aufbau & Anlauf', type: 'Business Process', description: 'Construction and initial setup activities' },
    { id: '3.0_betrieb', name: '3.0 Betrieb', type: 'Value Stream', description: 'Operational phase of the factory' },
    { id: '3.1_produktion', name: '3.1 Produktion', type: 'Business Process', description: 'Production operations' },
    { id: '3.1_service', name: '3.1 Service & Wartung', type: 'Value Stream', description: 'Maintenance and service activities' },
    { id: '3.2_instandhaltung', name: '3.2 Instandhaltung & Optimierung', type: 'Business Process', description: 'Maintenance and optimization of factory systems' },
    { id: '3.2_umplanung', name: '3.2 Umplanung', type: 'Value Stream', description: 'Reconfiguration planning' },
    { id: '3.3_modernisierung', name: '3.3 Modernisierung', type: 'Business Process', description: 'Modernization of factory systems' },
    { id: '4_demontage', name: '4. Demontage & Recycling', type: 'Value Stream', description: 'End-of-life phase' },
    { id: '4.1_ruckbau', name: '4.1 Demontage, Rückbau', type: 'Business Process', description: 'Disassembly and recycling activities' },
    { id: 'materialfluss', name: 'Materialfluss', type: 'Data Object', description: 'Material flow information' },
    { id: 'arbeitsablaufschema', name: 'Arbeitsablaufschema', type: 'Data Object', description: 'Work process schema' },
    { id: 'funktionsschema', name: 'Funktionsschema', type: 'Data Object', description: 'Functional schema' },
    { id: 'groblayout', name: 'Groblayout (2D)', type: 'Data Object', description: 'High-level 2D layout' },
    { id: 'ideallayout', name: 'Ideallayout (3D)', type: 'Data Object', description: 'Ideal 3D layout' },
    { id: 'reallayout', name: 'Reallayout (3D)', type: 'Data Object', description: 'Actual 3D layout' }
  ];

  // Define relationships between elements
  const relationships = [
    { id: 'rel-1', type: 'Composition', source: 'Perspektive: Fabrik', target: '1.1 Investitionsplanung' },
    { id: 'rel-2', type: 'Composition', source: 'Perspektive: Fabrik', target: '1.2 Engineering' },
    { id: 'rel-3', type: 'Composition', source: 'Perspektive: Fabrik', target: '2.1 Aufbau & Anlauf' },
    { id: 'rel-4', type: 'Composition', source: 'Perspektive: Fabrik', target: '3.1 Produktion' },
    { id: 'rel-5', type: 'Composition', source: 'Perspektive: Fabrik', target: '3.2 Instandhaltung & Optimierung' },
    { id: 'rel-6', type: 'Composition', source: 'Perspektive: Fabrik', target: '3.3 Modernisierung' },
    { id: 'rel-7', type: 'Composition', source: 'Perspektive: Fabrik', target: '4.1 Demontage, Rückbau' },
    { id: 'rel-8', type: 'Realization', source: '1.2 Engineering', target: '1. Spezifikation & Planung' },
    { id: 'rel-9', type: 'Triggering', source: '1.2 Engineering', target: '2.1 Aufbau & Anlauf' },
    { id: 'rel-10', type: 'Realization', source: '2.1 Aufbau & Anlauf', target: '2. Aufbau & Inbetriebnahme' },
    { id: 'rel-11', type: 'Triggering', source: '2.1 Aufbau & Anlauf', target: '3.1 Produktion' },
    { id: 'rel-12', type: 'Realization', source: '3.1 Produktion', target: '3.0 Betrieb' },
    { id: 'rel-13', type: 'Triggering', source: '3.1 Produktion', target: '3.2 Instandhaltung & Optimierung' },
    { id: 'rel-14', type: 'Realization', source: '3.2 Instandhaltung & Optimierung', target: '3.1 Service & Wartung' },
    { id: 'rel-15', type: 'Triggering', source: '3.2 Instandhaltung & Optimierung', target: '3.3 Modernisierung' },
    { id: 'rel-16', type: 'Realization', source: '3.3 Modernisierung', target: '3.2 Umplanung' },
    { id: 'rel-17', type: 'Triggering', source: '3.3 Modernisierung', target: '4.1 Demontage, Rückbau' },
    { id: 'rel-18', type: 'Realization', source: '4.1 Demontage, Rückbau', target: '4. Demontage & Recycling' },
    { id: 'rel-19', type: 'Triggering', source: '1.1 Investitionsplanung', target: '1.2 Engineering' },
    { id: 'rel-20', type: 'Triggering', source: '1. Spezifikation & Planung', target: '2. Aufbau & Inbetriebnahme' },
    { id: 'rel-21', type: 'Triggering', source: '2. Aufbau & Inbetriebnahme', target: '3.0 Betrieb' },
    { id: 'rel-22', type: 'Triggering', source: '3.0 Betrieb', target: '4. Demontage & Recycling' },
    { id: 'rel-23', type: 'Access', source: '1.2 Engineering', target: 'Materialfluss' },
    { id: 'rel-24', type: 'Access', source: '1.2 Engineering', target: 'Funktionsschema' },
    { id: 'rel-25', type: 'Access', source: '1.2 Engineering', target: 'Arbeitsablaufschema' },
    { id: 'rel-26', type: 'Access', source: '1.2 Engineering', target: 'Groblayout (2D)' },
    { id: 'rel-27', type: 'Access', source: '1.2 Engineering', target: 'Ideallayout (3D)' },
    { id: 'rel-28', type: 'Access', source: '2.1 Aufbau & Anlauf', target: 'Materialfluss' },
    { id: 'rel-29', type: 'Access', source: '2.1 Aufbau & Anlauf', target: 'Reallayout (3D)' },
    { id: 'rel-30', type: 'Access', source: '3.1 Produktion', target: 'Materialfluss' },
    { id: 'rel-31', type: 'Access', source: '3.1 Produktion', target: 'Reallayout (3D)' }
  ];

  // Element positions mapping for the diagram
  const elementPositions = {
    '1_spezifikation': { x: 150, y: 60 },
    '2_aufbau': { x: 400, y: 60 },
    '3.0_betrieb': { x: 650, y: 60 },
    '4_demontage': { x: 900, y: 60 },
    
    '3.1_service': { x: 525, y: 160 },
    '3.2_umplanung': { x: 775, y: 160 },
    
    '1.1_investitionsplanung': { x: 75, y: 280 },
    '1.2_engineering': { x: 225, y: 280 },
    '2.1_anlauf': { x: 375, y: 280 },
    '3.1_produktion': { x: 525, y: 280 },
    '3.2_instandhaltung': { x: 675, y: 280 },
    '3.3_modernisierung': { x: 825, y: 280 },
    '4.1_ruckbau': { x: 975, y: 280 },
    
    'arbeitsablaufschema': { x: 125, y: 400 },
    'funktionsschema': { x: 275, y: 400 },
    'materialfluss': { x: 650, y: 400 },
    
    'groblayout': { x: 125, y: 500 },
    'ideallayout': { x: 275, y: 500 },
    'reallayout': { x: 650, y: 500 }
  };

  // Get the color for a specific element type
  const getElementColor = (type) => {
    switch (type) {
      case 'Value Stream':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'Business Process':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'Data Object':
        return 'bg-cyan-50 border-cyan-200 text-cyan-800';
      case 'Business Event':
        return 'bg-purple-100 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // Get fill and stroke colors for SVG elements
  const getSvgColors = (type, isHighlighted) => {
    const base = {
      Value: { fill: '#fef3c7', stroke: '#fde68a' }, // amber colors
      Business: { fill: '#ecfdf5', stroke: '#a7f3d0' }, // green colors
      Data: { fill: '#ecfeff', stroke: '#a5f3fc' }, // cyan colors
    };
    
    let colors;
    if (type.includes('Value')) colors = base.Value;
    else if (type.includes('Business')) colors = base.Business;
    else if (type.includes('Data')) colors = base.Data;
    else colors = { fill: '#f9fafb', stroke: '#e5e7eb' };
    
    if (isHighlighted) {
      // Brighten the colors for highlighted elements
      return {
        fill: colors.fill,
        stroke: '#009374',
        strokeWidth: 2
      };
    }
    
    return {
      fill: colors.fill,
      stroke: colors.stroke,
      strokeWidth: 1
    };
  };

  // Check if a relationship should be highlighted
  const isRelationshipHighlighted = (relationshipId) => {
    return highlightedRelationships.some(rel => rel.id === relationshipId);
  };

  // Get the details for a specific element
  const getElementDetails = (elementId) => {
    return architectureElements.find(el => el.id === elementId);
  };

  // Filter relationships for a specific element
  const getElementRelationships = (elementId) => {
    // Get the element name without the ID part
    const element = getElementDetails(elementId);
    if (!element) return { incoming: [], outgoing: [] };
    
    const elementName = element.name;
    
    const incoming = relationships.filter(rel => rel.target.includes(elementName));
    const outgoing = relationships.filter(rel => rel.source.includes(elementName));
    
    return { incoming, outgoing };
  };

  // Get the data objects associated with a process
  const getAssociatedDataObjects = (elementId) => {
    const element = getElementDetails(elementId);
    if (!element) return [];
    
    const elementName = element.name;
    
    return relationships
      .filter(rel => rel.type === 'Access' && rel.source.includes(elementName))
      .map(rel => {
        const dataObjName = rel.target;
        return architectureElements.find(el => el.name === dataObjName) || 
               { id: 'unknown', name: dataObjName, type: 'Data Object' };
      });
  };

  // Render a single SVG element box
  const renderSvgElement = (elementId, isHighlighted = false) => {
    const element = getElementDetails(elementId);
    if (!element || !elementPositions[elementId]) return null;
    
    const pos = elementPositions[elementId];
    const colors = getSvgColors(element.type, isHighlighted);
    
    // Determine width and height based on content
    const width = 120;
const height = 70;


    // Apply animation class if needed
    const animationClass = animating && isHighlighted ? 'animate-pulse' : '';
    
    return (
      <g 
        key={elementId}
        onClick={() => handleElementClick(elementId)}
        className={`cursor-pointer ${animationClass} transition-all duration-300`}
        style={{ transition: 'transform 0.3s ease' }}
      >
        <rect 
          x={pos.x} 
          y={pos.y} 
          width={width} 
          height={height} 
          rx="5" 
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={colors.strokeWidth}
          className="transition-all duration-300"
        />
        <text 
          x={pos.x + width/2} 
          y={pos.y + 30} 
          textAnchor="middle" 
          className="fill-gray-700 font-medium text-[12px]"
        >
          {element.name}
        </text>
        <text 
          x={pos.x + width/2} 
          y={pos.y + 48} 
          textAnchor="middle" 
          className="fill-gray-500 text-[10px]"
        >
          {element.type}
        </text>
      </g>
    );
  };

  // Render a connection line between elements
  const renderConnection = (relationshipId, startElement, endElement, type, isHighlighted = false) => {
    const startPos = elementPositions[startElement];
    const endPos = elementPositions[endElement];
    
    if (!startPos || !endPos) return null;
    
    // Calculate connection points (center of elements)
    const startWidth = getElementDetails(startElement)?.name.length > 25 ? 160 : 130;
    const endWidth = getElementDetails(endElement)?.name.length > 25 ? 160 : 130;
    
    const startX = startPos.x + startWidth/2;
    const startY = startPos.y + 35;
    const endX = endPos.x + endWidth/2;
    const endY = endPos.y + 35;
    
    // Adjust stroke style based on relationship type
    let strokeDash = '';
    let strokeColor = '#009374';
    let strokeWidth = isHighlighted ? 2 : 1;
    
    if (type === 'Realization') {
      strokeDash = '5,5';
    } else if (type === 'Access') {
      strokeDash = '2,2';
      strokeWidth = 1.5;
    }
    
    const opacity = isHighlighted ? 1 : (selectedElement ? 0.3 : 0.8);
    
    // Calculate arrow points
    const dx = endX - startX;
    const dy = endY - startY;
    const angle = Math.atan2(dy, dx);
    
    // End point slightly before the target
    const endOffset = 10;
    const adjustedEndX = endX - endOffset * Math.cos(angle);
    const adjustedEndY = endY - endOffset * Math.sin(angle);
    
    // Arrow size
    const arrowSize = 10;
    
    // Animation class if needed
    const animationClass = animating && isHighlighted ? 'animate-pulse' : '';
    
    return (
      <g key={relationshipId} className={animationClass}>
        <path
          d={`M ${startX} ${startY} L ${adjustedEndX} ${adjustedEndY}`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDash}
          fill="none"
          opacity={opacity}
          className="transition-opacity duration-300"
          markerEnd="url(#arrow)"
        />
      </g>
    );
  };

  // Render the factory diagram
  const renderFactoryDiagram = () => {
    return (
      <svg width="100%" height="600" viewBox="0 0 1100 600" className="bg-white border border-gray-200 rounded-lg overflow-visible">
        {/* Horizontal divider line */}
        <line x1="50" y1="220" x2="1050" y2="220" stroke="#e5e7eb" strokeDasharray="4,4" />
        
        {/* Section Labels */}
        <text x="150" y="30" className="font-bold text-lg fill-gray-700">1. Spezifikation & Planung</text>
        <text x="400" y="30" className="font-bold text-lg fill-gray-700">2. Aufbau & Inbetriebnahme</text>
        <text x="650" y="30" className="font-bold text-lg fill-gray-700">3.0 Betrieb</text>
        <text x="900" y="30" className="font-bold text-lg fill-gray-700">4. Demontage & Recycling</text>
        
        {/* Perspektive Label */}
        <text x="75" y="250" className="font-medium fill-gray-700">Perspektive: Fabrik</text>
        
        {/* Render connections first (so they're behind elements) */}
        {/* Value Stream flow lines */}
        {renderConnection('rel-20', '1_spezifikation', '2_aufbau', 'Triggering', 
          isRelationshipHighlighted({ id: 'rel-20' }))
        }
        {renderConnection('rel-21', '2_aufbau', '3.0_betrieb', 'Triggering', 
          isRelationshipHighlighted({ id: 'rel-21' }))
        }
        {renderConnection('rel-22', '3.0_betrieb', '4_demontage', 'Triggering', 
          isRelationshipHighlighted({ id: 'rel-22' }))
        }

        {/* Business Process flow lines */}
        {renderConnection('rel-19', '1.1_investitionsplanung', '1.2_engineering', 'Triggering', 
          isRelationshipHighlighted({ id: 'rel-19' }))
        }
        {renderConnection('rel-9', '1.2_engineering', '2.1_anlauf', 'Triggering', 
          isRelationshipHighlighted({ id: 'rel-9' }))
        }
        {renderConnection('rel-11', '2.1_anlauf', '3.1_produktion', 'Triggering', 
          isRelationshipHighlighted({ id: 'rel-11' }))
        }
        {renderConnection('rel-13', '3.1_produktion', '3.2_instandhaltung', 'Triggering', 
          isRelationshipHighlighted({ id: 'rel-13' }))
        }
        {renderConnection('rel-15', '3.2_instandhaltung', '3.3_modernisierung', 'Triggering', 
          isRelationshipHighlighted({ id: 'rel-15' }))
        }
        {renderConnection('rel-17', '3.3_modernisierung', '4.1_ruckbau', 'Triggering', 
          isRelationshipHighlighted({ id: 'rel-17' }))
        }
        
        {/* Realization connections (dashed) */}
        {renderConnection('rel-8', '1.2_engineering', '1_spezifikation', 'Realization', 
          isRelationshipHighlighted({ id: 'rel-8' }))
        }
        {renderConnection('rel-10', '2.1_anlauf', '2_aufbau', 'Realization', 
          isRelationshipHighlighted({ id: 'rel-10' }))
        }
        {renderConnection('rel-12', '3.1_produktion', '3.0_betrieb', 'Realization', 
          isRelationshipHighlighted({ id: 'rel-12' }))
        }
        {renderConnection('rel-14', '3.2_instandhaltung', '3.1_service', 'Realization', 
          isRelationshipHighlighted({ id: 'rel-14' }))
        }
        {renderConnection('rel-16', '3.3_modernisierung', '3.2_umplanung', 'Realization', 
          isRelationshipHighlighted({ id: 'rel-16' }))
        }
        {renderConnection('rel-18', '4.1_ruckbau', '4_demontage', 'Realization', 
          isRelationshipHighlighted({ id: 'rel-18' }))
        }
        
        {/* Data Access connections (dotted) */}
        {renderConnection('rel-25', '1.2_engineering', 'arbeitsablaufschema', 'Access', 
          isRelationshipHighlighted({ id: 'rel-25' }))
        }
        {renderConnection('rel-24', '1.2_engineering', 'funktionsschema', 'Access', 
          isRelationshipHighlighted({ id: 'rel-24' }))
        }
        {renderConnection('rel-26', '1.2_engineering', 'groblayout', 'Access', 
          isRelationshipHighlighted({ id: 'rel-26' }))
        }
        {renderConnection('rel-27', '1.2_engineering', 'ideallayout', 'Access', 
          isRelationshipHighlighted({ id: 'rel-27' }))
        }
        
        {renderConnection('rel-28', '2.1_anlauf', 'materialfluss', 'Access', 
          isRelationshipHighlighted({ id: 'rel-28' }))
        }
        {renderConnection('rel-29', '2.1_anlauf', 'reallayout', 'Access', 
          isRelationshipHighlighted({ id: 'rel-29' }))
        }
        
        {renderConnection('rel-30', '3.1_produktion', 'materialfluss', 'Access', 
          isRelationshipHighlighted({ id: 'rel-30' }))
        }
        {renderConnection('rel-31', '3.1_produktion', 'reallayout', 'Access', 
          isRelationshipHighlighted({ id: 'rel-31' }))
        }
        
        {/* Render all elements */}
        {/* Value Streams - Top Row */}
        {renderSvgElement('1_spezifikation', selectedElement === '1_spezifikation' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('1. Spezifikation') || rel.target.includes('1. Spezifikation')
          )
        )}
        {renderSvgElement('2_aufbau', selectedElement === '2_aufbau' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('2. Aufbau') || rel.target.includes('2. Aufbau')
          )
        )}
        {renderSvgElement('3.0_betrieb', selectedElement === '3.0_betrieb' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('3.0 Betrieb') || rel.target.includes('3.0 Betrieb')
          )
        )}
        {renderSvgElement('4_demontage', selectedElement === '4_demontage' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('4. Demontage') || rel.target.includes('4. Demontage')
          )
        )}
        
        {/* Value Streams - Middle Row */}
        {renderSvgElement('3.1_service', selectedElement === '3.1_service' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('3.1 Service') || rel.target.includes('3.1 Service')
          )
        )}
        {renderSvgElement('3.2_umplanung', selectedElement === '3.2_umplanung' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('3.2 Umplanung') || rel.target.includes('3.2 Umplanung')
          )
        )}
        
        {/* Business Processes - Bottom Row */}
        {renderSvgElement('1.1_investitionsplanung', selectedElement === '1.1_investitionsplanung' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('1.1 Investitionsplanung') || rel.target.includes('1.1 Investitionsplanung')
          )
        )}
        {renderSvgElement('1.2_engineering', selectedElement === '1.2_engineering' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('1.2 Engineering') || rel.target.includes('1.2 Engineering')
          )
        )}
        {renderSvgElement('2.1_anlauf', selectedElement === '2.1_anlauf' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('2.1 Aufbau & Anlauf') || rel.target.includes('2.1 Aufbau & Anlauf')
          )
        )}
        {renderSvgElement('3.1_produktion', selectedElement === '3.1_produktion' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('3.1 Produktion') || rel.target.includes('3.1 Produktion')
          )
        )}
        {renderSvgElement('3.2_instandhaltung', selectedElement === '3.2_instandhaltung' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('3.2 Instandhaltung') || rel.target.includes('3.2 Instandhaltung')
          )
        )}
        {renderSvgElement('3.3_modernisierung', selectedElement === '3.3_modernisierung' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('3.3 Modernisierung') || rel.target.includes('3.3 Modernisierung')
          )
        )}
        {renderSvgElement('4.1_ruckbau', selectedElement === '4.1_ruckbau' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('4.1 Demontage') || rel.target.includes('4.1 Demontage')
          )
        )}
        
        {/* Data Objects */}
        {renderSvgElement('arbeitsablaufschema', selectedElement === 'arbeitsablaufschema' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('Arbeitsablaufschema') || rel.target.includes('Arbeitsablaufschema')
          )
        )}
        {renderSvgElement('funktionsschema', selectedElement === 'funktionsschema' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('Funktionsschema') || rel.target.includes('Funktionsschema')
          )
        )}
        {renderSvgElement('materialfluss', selectedElement === 'materialfluss' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('Materialfluss') || rel.target.includes('Materialfluss')
          )
        )}
        {renderSvgElement('groblayout', selectedElement === 'groblayout' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('Groblayout') || rel.target.includes('Groblayout')
          )
        )}
        {renderSvgElement('ideallayout', selectedElement === 'ideallayout' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('Ideallayout') || rel.target.includes('Ideallayout')
          )
        )}
        {renderSvgElement('reallayout', selectedElement === 'reallayout' || 
          highlightedRelationships.some(rel => 
            rel.source.includes('Reallayout') || rel.target.includes('Reallayout')
          )
        )}
        
        {/* Arrow Marker Definition */}
        <defs>
          <marker 
            id="arrow" 
            viewBox="0 0 10 10" 
            refX="9" 
            refY="5"
            markerWidth="6" 
            markerHeight="6" 
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#000000" />
          </marker>
        </defs>
      </svg>
    );
  };

  // Render the information panel for a selected element
  const renderElementInfo = () => {
    if (!selectedElement) return (
      <div className="p-6 text-center text-gray-500">
        <p>Select an element in the diagram to view its details.</p>
        <p className="mt-2 text-sm">Click on any box to highlight its relationships.</p>
      </div>
    );
    
    const elementInfo = getElementDetails(selectedElement);
    const relationships = getElementRelationships(selectedElement);
    const dataObjects = getAssociatedDataObjects(selectedElement);
    
    return (
      <div className="p-4 bg-white rounded-lg">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 ${getElementColor(elementInfo?.type)}`}>
            {elementInfo?.type === 'Value Stream' && <ArrowRight className="w-5 h-5 text-amber-600" />}
            {elementInfo?.type === 'Business Process' && <List className="w-5 h-5 text-green-600" />}
            {elementInfo?.type === 'Data Object' && <Info className="w-5 h-5 text-cyan-600" />}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">{elementInfo?.name}</h3>
            <p className="text-sm text-gray-600">{elementInfo?.type}</p>
          </div>
        </div>
        
        <div className="border-t border-b border-gray-200 py-4 mb-4">
          <div className="grid grid-cols-4 gap-2">
            <button 
              className={`py-2 px-3 text-sm rounded transition-all duration-200 ${detailsView === 'properties' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'hover:bg-gray-100'}`}
              onClick={() => setDetailsView('properties')}
            >
              Properties
            </button>
            <button 
              className={`py-2 px-3 text-sm rounded transition-all duration-200 ${detailsView === 'relationships' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'hover:bg-gray-100'}`}
              onClick={() => setDetailsView('relationships')}
            >
              Relationships
            </button>
            <button 
              className={`py-2 px-3 text-sm rounded transition-all duration-200 ${detailsView === 'documentation' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'hover:bg-gray-100'}`}
              onClick={() => setDetailsView('documentation')}
            >
              Documentation
            </button>
            <button 
              className={`py-2 px-3 text-sm rounded transition-all duration-200 ${detailsView === 'details' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'hover:bg-gray-100'}`}
              onClick={() => setDetailsView('details')}
            >
              Details
            </button>
          </div>
        </div>
        
        {detailsView === 'properties' && (
          <div>
            <h4 className="font-medium mb-2">Properties</h4>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">ID</td>
                  <td className="py-2">{elementInfo?.id}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">Name</td>
                  <td className="py-2">{elementInfo?.name}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">Type</td>
                  <td className="py-2">{elementInfo?.type}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">Description</td>
                  <td className="py-2">{elementInfo?.description}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {detailsView === 'relationships' && (
          <div>
            <h4 className="font-medium mb-2">Relationships</h4>
            
            {relationships.incoming.length > 0 && (
              <>
                <h5 className="text-sm font-medium text-gray-600 mt-3 mb-1">Incoming</h5>
                <div className="bg-gray-50 rounded p-2">
                  {relationships.incoming.map((rel, idx) => (
                    <div key={`in-${idx}`} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                      <span className="text-gray-700">{rel.source}</span>
                      <span className="px-2 py-0.5 rounded text-xs bg-teal-50 text-teal-700 border border-teal-200">{rel.type}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {relationships.outgoing.length > 0 && (
              <>
                <h5 className="text-sm font-medium text-gray-600 mt-3 mb-1">Outgoing</h5>
                <div className="bg-gray-50 rounded p-2">
                  {relationships.outgoing.map((rel, idx) => (
                    <div key={`out-${idx}`} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                      <span className="text-gray-700">{rel.target}</span>
                      <span className="px-2 py-0.5 rounded text-xs bg-green-50 text-green-700 border border-green-200">{rel.type}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {dataObjects.length > 0 && (
              <>
                <h5 className="text-sm font-medium text-gray-600 mt-3 mb-1">Data Objects</h5>
                <div className="bg-gray-50 rounded p-2">
                  {dataObjects.map((obj, idx) => (
                    <div key={`data-${idx}`} className="flex items-center text-sm py-1 border-b border-gray-200 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></div>
                      <span className="text-gray-700">{obj.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        
        {detailsView === 'documentation' && (
          <div>
            <h4 className="font-medium mb-2">Documentation</h4>
            <p className="text-sm text-gray-700">
              This is the documentation for {elementInfo?.name}. This element is part of the Digital Factory Twin 
              reference architecture model, specifically from the Factory perspective.
            </p>
            <div className="mt-3 p-3 bg-teal-50 rounded-lg border border-teal-200 text-sm text-teal-700">
              <div className="flex items-start">
                <Info className="w-4 h-4 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Implementation Notes</p>
                  <p className="mt-1">This element represents a {elementInfo?.type.toLowerCase()} in the factory lifecycle.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {detailsView === 'details' && (
          <div>
            <h4 className="font-medium mb-2">Detailed Information</h4>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-700">
                {elementInfo?.description}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="p-2 border border-gray-200 rounded bg-white">
                  <span className="text-xs text-gray-500">Element Type</span>
                  <p className="font-medium">{elementInfo?.type}</p>
                </div>
                <div className="p-2 border border-gray-200 rounded bg-white">
                  <span className="text-xs text-gray-500">Related Elements</span>
                  <p className="font-medium">{relationships.incoming.length + relationships.outgoing.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render table of all elements
  const renderElementsTable = () => {
    return (
      <div className="overflow-auto max-h-80 bg-white rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {architectureElements.map((element) => (
              <tr 
                key={element.id} 
                className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${selectedElement === element.id ? 'bg-teal-50' : ''}`}
                onClick={() => handleElementClick(element.id)}
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-700">{element.name}</div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getElementColor(element.type)}`}>
                    {element.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render relationship table
  const renderRelationshipsTable = () => {
    return (
      <div className="overflow-auto max-h-80 bg-white rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {relationships.map((rel, index) => (
              <tr key={rel.id} className={`hover:bg-gray-50 transition-colors duration-150 
                ${highlightedRelationships.some(r => r.id === rel.id) ? 'bg-teal-50' : ''}`}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${rel.type === 'Composition' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
                      rel.type === 'Realization' ? 'bg-green-50 text-green-700 border border-green-200' : 
                      rel.type === 'Triggering' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                      rel.type === 'Access' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 
                      'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                    {rel.type}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{rel.source}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{rel.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render view based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'factory':
        return (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Referenzarchitektur Digitaler Fabrikzwilling: Prozesssicht - Perspektive Fabrik</h2>
            </div>
            
            <div className="p-4">
              <div className={`${fullscreen ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    <button 
                      onClick={() => toggleSection('diagram')}
                      className="flex items-center"
                    >
                      {expandedSections.diagram ? 
                        <ChevronDown className="mr-2 h-5 w-5" /> : 
                        <ChevronRight className="mr-2 h-5 w-5" />}
                      Architecture Diagram
                    </button>
                  </h3>
                  <button 
                    onClick={() => setFullscreen(!fullscreen)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {fullscreen ? 
                      <Minimize className="h-5 w-5 text-gray-500" /> : 
                      <Maximize className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
                {expandedSections.diagram && renderFactoryDiagram()}
                
                {fullscreen && (
                  <button 
                    className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                    onClick={() => setFullscreen(false)}
                  >
                    Exit Fullscreen
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <div className="bg-white rounded-lg border border-gray-200 transition-all duration-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700">
                      <button 
                        onClick={() => toggleSection('elements')}
                        className="flex items-center"
                      >
                        {expandedSections.elements ? 
                          <ChevronDown className="mr-2 h-5 w-5" /> : 
                          <ChevronRight className="mr-2 h-5 w-5" />}
                        Elements
                      </button>
                    </h3>
                  </div>
                  {expandedSections.elements && renderElementsTable()}
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 transition-all duration-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700">
                      <button 
                        onClick={() => toggleSection('relationships')}
                        className="flex items-center"
                      >
                        {expandedSections.relationships ? 
                          <ChevronDown className="mr-2 h-5 w-5" /> : 
                          <ChevronRight className="mr-2 h-5 w-5" />}
                        Relationships
                      </button>
                    </h3>
                  </div>
                  {expandedSections.relationships && renderRelationshipsTable()}
                </div>
              </div>
              
              {/* Selected Element Panel */}
              <div className={`mt-6 bg-white rounded-lg border border-gray-200 transition-all duration-300 
                ${selectedElement ? 'opacity-100' : 'opacity-90'}`}>
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-700">
                    {selectedElement ? 'Selected Element' : 'Element Details'}
                  </h3>
                </div>
                {renderElementInfo()}
              </div>
            </div>
          </div>
        );
      case 'product':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Referenzarchitektur Digitaler Fabrikzwilling: Prozesssicht - Perspektive Produkt</h2>
            <div className="bg-gray-50 p-6 rounded-lg min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-3">Product perspective diagram will be displayed here</p>
                <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
                  Add Product Perspective
                </button>
              </div>
            </div>
          </div>
        );
      case 'order':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Referenzarchitektur Digitaler Fabrikzwilling: Prozesssicht - Perspektive Auftrag</h2>
            <div className="bg-gray-50 p-6 rounded-lg min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-3">Order perspective diagram will be displayed here</p>
                <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
                  Add Order Perspective
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>No content available</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">Reference Architecture</h1>
        <p className="text-gray-600 mb-6">Referenzarchitektur Digitaler Fabrikzwilling: Prozesssicht</p>
        
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('factory')}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'factory' 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:border-b-2'
              }`}
            >
              Perspektive Fabrik
            </button>
            <button
              onClick={() => setActiveTab('product')}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'product' 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:border-b-2'
              }`}
            >
              Perspektive Produkt
            </button>
            <button
              onClick={() => setActiveTab('order')}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'order' 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:border-b-2'
              }`}
            >
              Perspektive Auftrag
            </button>
          </div>
        </div>
        
        {renderTabContent()}
        
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
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
              <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Business Event</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Other</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-teal-600 mr-2"></div>
              <span className="text-sm text-gray-600">Composition</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-teal-600 mr-2" style={{ borderStyle: 'dashed' }}></div>
              <span className="text-sm text-gray-600">Realization</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-teal-600 mr-2"></div>
              <span className="text-sm text-gray-600">Triggering</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-teal-600 mr-2" style={{ borderStyle: 'dotted' }}></div>
              <span className="text-sm text-gray-600">Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactoryArchitectureViewer;