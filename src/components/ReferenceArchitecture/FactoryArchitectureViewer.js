import React, { useState } from 'react';

const FactoryArchitectureViewer = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [detailsView, setDetailsView] = useState('properties');
  const [expandedSections, setExpandedSections] = useState({
    diagram: true,
    elements: false,
    relationships: false
  });

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
    { id: 'reallayout', name: 'Reallayout (3D)', type: 'Data Object', description: 'Actual 3D layout' },
    { id: 'grafisches_modell', name: 'Grafisches Modell', type: 'Data Object', description: 'Graphical model' },
    { id: 'datenmodelle', name: 'Datenmodelle', type: 'Data Object', description: 'Data models' },
    { id: 'strukturmodell', name: 'Strukturmodell', type: 'Data Object', description: 'Structure model' },
    { id: 'fahigkeitenmodell', name: 'Fähigkeitenmodell', type: 'Data Object', description: 'Capabilities model' },
    { id: 'kennzahlenmodell', name: 'Kennzahlenmodell', type: 'Data Object', description: 'KPI model' }
  ];

  // Define relationships between elements (including the missing ones from images)
  const relationships = [
    // Value Stream flow lines (Triggering relationships)
    { id: 'rel-19', type: 'Triggering', source: '1.1 Investitionsplanung', target: '1.2 Engineering' },
    { id: 'rel-20', type: 'Triggering', source: '1. Spezifikation & Planung', target: '2. Aufbau & Inbetriebnahme' },
    { id: 'rel-21', type: 'Triggering', source: '2. Aufbau & Inbetriebnahme', target: '3.0 Betrieb' },
    { id: 'rel-22', type: 'Triggering', source: '3.0 Betrieb', target: '4. Demontage & Recycling' },
    
    // Business Process flow lines (Triggering between processes)
    { id: 'rel-9', type: 'Triggering', source: '1.2 Engineering', target: '2.1 Aufbau & Anlauf' },
    { id: 'rel-11', type: 'Triggering', source: '2.1 Aufbau & Anlauf', target: '3.1 Produktion' },
    { id: 'rel-13', type: 'Triggering', source: '3.1 Produktion', target: '3.2 Instandhaltung & Optimierung' },
    { id: 'rel-15', type: 'Triggering', source: '3.2 Instandhaltung & Optimierung', target: '3.3 Modernisierung' },
    { id: 'rel-17', type: 'Triggering', source: '3.3 Modernisierung', target: '4.1 Demontage, Rückbau' },
    
    // Realization connections (Business Process to Value Stream)
    { id: 'rel-8', type: 'Realization', source: '1.2 Engineering', target: '1. Spezifikation & Planung' },
    { id: 'rel-10', type: 'Realization', source: '2.1 Aufbau & Anlauf', target: '2. Aufbau & Inbetriebnahme' },
    { id: 'rel-12', type: 'Realization', source: '3.1 Produktion', target: '3.0 Betrieb' },
    { id: 'rel-14', type: 'Realization', source: '3.2 Instandhaltung & Optimierung', target: '3.1 Service & Wartung' },
    { id: 'rel-16', type: 'Realization', source: '3.3 Modernisierung', target: '3.2 Umplanung' },
    { id: 'rel-18', type: 'Realization', source: '4.1 Demontage, Rückbau', target: '4. Demontage & Recycling' },
    
    // Access relationships from 1.2 Engineering to Data Objects
    { id: 'rel-23', type: 'Access', source: '1.2 Engineering', target: 'Materialfluss' },
    { id: 'rel-24', type: 'Access', source: '1.2 Engineering', target: 'Funktionsschema' },
    { id: 'rel-25', type: 'Access', source: '1.2 Engineering', target: 'Arbeitsablaufschema' },
    { id: 'rel-26', type: 'Access', source: '1.2 Engineering', target: 'Groblayout (2D)' },
    { id: 'rel-27', type: 'Access', source: '1.2 Engineering', target: 'Ideallayout (3D)' },
    
    // Access relationships from 2.1 Aufbau & Anlauf to Data Objects
    { id: 'rel-28', type: 'Access', source: '2.1 Aufbau & Anlauf', target: 'Materialfluss' },
    { id: 'rel-29', type: 'Access', source: '2.1 Aufbau & Anlauf', target: 'Reallayout (3D)' },
    { id: 'rel-30', type: 'Access', source: '2.1 Aufbau & Anlauf', target: 'Ideallayout (3D)' },
    
    // Access relationships from 3.1 Produktion to Data Objects
    { id: 'rel-31', type: 'Access', source: '3.1 Produktion', target: 'Materialfluss' },
    { id: 'rel-32', type: 'Access', source: '3.1 Produktion', target: 'Reallayout (3D)' },
    
    // Access relationships from 3.2 Instandhaltung & Optimierung to Data Objects
    { id: 'rel-33', type: 'Access', source: '3.2 Instandhaltung & Optimierung', target: 'Materialfluss' },
    { id: 'rel-34', type: 'Access', source: '3.2 Instandhaltung & Optimierung', target: 'Reallayout (3D)' },
    
    // Access relationships from 3.3 Modernisierung to Data Objects
    { id: 'rel-35', type: 'Access', source: '3.3 Modernisierung', target: 'Materialfluss' },
    { id: 'rel-36', type: 'Access', source: '3.3 Modernisierung', target: 'Reallayout (3D)' },
    
    // Access relationships from 4.1 Demontage, Rückbau to Data Objects
    { id: 'rel-37', type: 'Access', source: '4.1 Demontage, Rückbau', target: 'Materialfluss' },
    { id: 'rel-38', type: 'Access', source: '4.1 Demontage, Rückbau', target: 'Reallayout (3D)' },
    
    // Composition relationships for Data Model layer
    { id: 'rel-40', type: 'Composition', source: 'Grafisches Modell', target: 'Grafisches Modell' },
    { id: 'rel-41', type: 'Composition', source: 'Grafisches Modell', target: 'Reallayout (3D)' },
    { id: 'rel-42', type: 'Composition', source: 'Grafisches Modell', target: 'Ideallayout (3D)' },
    { id: 'rel-43', type: 'Composition', source: 'Grafisches Modell', target: 'Groblayout (2D)' },
    
    { id: 'rel-44', type: 'Composition', source: 'Datenmodelle', target: 'Fähigkeitenmodell' },
    { id: 'rel-45', type: 'Composition', source: 'Datenmodelle', target: 'Kennzahlenmodell' },
    { id: 'rel-46', type: 'Composition', source: 'Datenmodelle', target: 'Materialfluss' },
    { id: 'rel-47', type: 'Composition', source: 'Datenmodelle', target: 'Strukturmodell' },
    
    { id: 'rel-48', type: 'Composition', source: 'Strukturmodell', target: 'Reallayout (3D)' },
    { id: 'rel-49', type: 'Composition', source: 'Strukturmodell', target: 'Ideallayout (3D)' },
    { id: 'rel-50', type: 'Composition', source: 'Strukturmodell', target: 'Groblayout (2D)' },
    
    { id: 'rel-51', type: 'Composition', source: 'Materialfluss', target: 'Arbeitsablaufschema' },
    { id: 'rel-52', type: 'Composition', source: 'Materialfluss', target: 'Materialfluss' },
    { id: 'rel-53', type: 'Composition', source: 'Fähigkeitenmodell', target: 'Funktionsschema' }
  ];

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle element selection
  const handleElementClick = (elementId) => {
    setSelectedElement(elementId === selectedElement ? null : elementId);
  };

  // Get color for element type
  const getElementTypeColor = (type) => {
    switch (type) {
      case 'Value Stream':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'Business Process':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'Data Object':
        return 'bg-cyan-50 border-cyan-200 text-cyan-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  // Get line style for relationship type
  const getRelationshipStyle = (type) => {
    switch (type) {
      case 'Triggering':
        return 'stroke-amber-500';
      case 'Realization':
        return 'stroke-green-500 stroke-dasharray-2';
      case 'Access':
        return 'stroke-cyan-500 stroke-dasharray-1';
      case 'Composition':
        return 'stroke-blue-500 stroke-width-2';
      default:
        return 'stroke-gray-400';
    }
  };

  // Simple SVG diagram (representation of the architecture)
  const renderDiagram = () => {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <svg width="100%" height="600" viewBox="0 0 1100 600" className="bg-white">
          {/* Top section - Value Streams */}
          <g>
            {/* Value Stream boxes */}
            <rect x="100" y="50" width="200" height="70" rx="5" className="fill-amber-50 stroke-amber-200" />
            <text x="200" y="85" textAnchor="middle" className="text-sm font-medium">1. Spezifikation & Planung</text>
            <text x="200" y="105" textAnchor="middle" className="text-xs">Value Stream</text>
            
            <rect x="350" y="50" width="200" height="70" rx="5" className="fill-amber-50 stroke-amber-200" />
            <text x="450" y="85" textAnchor="middle" className="text-sm font-medium">2. Aufbau & Inbetriebnahme</text>
            <text x="450" y="105" textAnchor="middle" className="text-xs">Value Stream</text>
            
            <rect x="600" y="50" width="200" height="70" rx="5" className="fill-amber-50 stroke-amber-200" />
            <text x="700" y="85" textAnchor="middle" className="text-sm font-medium">3.0 Betrieb</text>
            <text x="700" y="105" textAnchor="middle" className="text-xs">Value Stream</text>
            
            <rect x="850" y="50" width="200" height="70" rx="5" className="fill-amber-50 stroke-amber-200" />
            <text x="950" y="85" textAnchor="middle" className="text-sm font-medium">4. Demontage & Recycling</text>
            <text x="950" y="105" textAnchor="middle" className="text-xs">Value Stream</text>
            
            {/* Value Stream flow lines */}
            <path d="M 300 85 L 350 85" className="stroke-amber-500 stroke-width-2 fill-none" 
                  markerEnd="url(#arrowhead)" />
            <path d="M 550 85 L 600 85" className="stroke-amber-500 stroke-width-2 fill-none" 
                  markerEnd="url(#arrowhead)" />
            <path d="M 800 85 L 850 85" className="stroke-amber-500 stroke-width-2 fill-none" 
                  markerEnd="url(#arrowhead)" />

            {/* Additional Value Streams (middle row) */}
            <rect x="500" y="150" width="170" height="70" rx="5" className="fill-amber-50 stroke-amber-200" />
            <text x="585" y="185" textAnchor="middle" className="text-sm font-medium">3.1 Service & Wartung</text>
            <text x="585" y="205" textAnchor="middle" className="text-xs">Value Stream</text>
            
            <rect x="750" y="150" width="170" height="70" rx="5" className="fill-amber-50 stroke-amber-200" />
            <text x="835" y="185" textAnchor="middle" className="text-sm font-medium">3.2 Umplanung</text>
            <text x="835" y="205" textAnchor="middle" className="text-xs">Value Stream</text>
          </g>

          {/* Middle section - Business Processes */}
          <g>
            <rect x="50" y="250" width="150" height="70" rx="5" className="fill-green-50 stroke-green-200" />
            <text x="125" y="285" textAnchor="middle" className="text-sm font-medium">1.1 Investitionsplanung</text>
            <text x="125" y="305" textAnchor="middle" className="text-xs">Business Process</text>
            
            <rect x="225" y="250" width="150" height="70" rx="5" className="fill-green-50 stroke-green-200" />
            <text x="300" y="285" textAnchor="middle" className="text-sm font-medium">1.2 Engineering</text>
            <text x="300" y="305" textAnchor="middle" className="text-xs">Business Process</text>
            
            <rect x="400" y="250" width="150" height="70" rx="5" className="fill-green-50 stroke-green-200" />
            <text x="475" y="285" textAnchor="middle" className="text-sm font-medium">2.1 Aufbau & Anlauf</text>
            <text x="475" y="305" textAnchor="middle" className="text-xs">Business Process</text>
            
            <rect x="575" y="250" width="150" height="70" rx="5" className="fill-green-50 stroke-green-200" />
            <text x="650" y="285" textAnchor="middle" className="text-sm font-medium">3.1 Produktion</text>
            <text x="650" y="305" textAnchor="middle" className="text-xs">Business Process</text>
            
            <rect x="750" y="250" width="150" height="70" rx="5" className="fill-green-50 stroke-green-200" />
            <text x="825" y="285" textAnchor="middle" className="text-sm font-medium">3.2 Instandhaltung</text>
            <text x="825" y="305" textAnchor="middle" className="text-xs">Business Process</text>
            
            <rect x="925" y="250" width="150" height="70" rx="5" className="fill-green-50 stroke-green-200" />
            <text x="1000" y="285" textAnchor="middle" className="text-sm font-medium">3.3 Modernisierung</text>
            <text x="1000" y="305" textAnchor="middle" className="text-xs">Business Process</text>
            
            <rect x="1025" y="350" width="50" height="70" rx="5" className="fill-green-50 stroke-green-200" />
            <text x="1050" y="385" textAnchor="middle" className="text-sm font-medium rotate-90">4.1 Demontage</text>
            <text x="1050" y="405" textAnchor="middle" className="text-xs rotate-90">Business Process</text>
            
            {/* Business Process flow lines */}
            <path d="M 200 285 L 225 285" className="stroke-amber-500 stroke-width-2 fill-none" 
                  markerEnd="url(#arrowhead)" />
            <path d="M 375 285 L 400 285" className="stroke-amber-500 stroke-width-2 fill-none" 
                  markerEnd="url(#arrowhead)" />
            <path d="M 550 285 L 575 285" className="stroke-amber-500 stroke-width-2 fill-none" 
                  markerEnd="url(#arrowhead)" />
            <path d="M 725 285 L 750 285" className="stroke-amber-500 stroke-width-2 fill-none" 
                  markerEnd="url(#arrowhead)" />
            <path d="M 900 285 L 925 285" className="stroke-amber-500 stroke-width-2 fill-none" 
                  markerEnd="url(#arrowhead)" />
            
            {/* Realization connections (dashed) to Value Streams */}
            <path d="M 300 250 L 200 120" className="stroke-green-500 stroke-width-1 stroke-dasharray-2 fill-none" 
                  markerEnd="url(#arrowheadDashed)" />
            <path d="M 475 250 L 450 120" className="stroke-green-500 stroke-width-1 stroke-dasharray-2 fill-none" 
                  markerEnd="url(#arrowheadDashed)" />
            <path d="M 650 250 L 700 120" className="stroke-green-500 stroke-width-1 stroke-dasharray-2 fill-none" 
                  markerEnd="url(#arrowheadDashed)" />
            <path d="M 825 250 L 585 220" className="stroke-green-500 stroke-width-1 stroke-dasharray-2 fill-none" 
                  markerEnd="url(#arrowheadDashed)" />
            <path d="M 1000 250 L 835 220" className="stroke-green-500 stroke-width-1 stroke-dasharray-2 fill-none" 
                  markerEnd="url(#arrowheadDashed)" />
            <path d="M 1050 350 L 950 120" className="stroke-green-500 stroke-width-1 stroke-dasharray-2 fill-none" 
                  markerEnd="url(#arrowheadDashed)" />
          </g>

          {/* Bottom section - Data Objects */}
          <g>
            <rect x="125" y="400" width="150" height="60" rx="5" className="fill-cyan-50 stroke-cyan-200" />
            <text x="200" y="430" textAnchor="middle" className="text-sm font-medium">Arbeitsablaufschema</text>
            <text x="200" y="450" textAnchor="middle" className="text-xs">Data Object</text>
            
            <rect x="300" y="400" width="150" height="60" rx="5" className="fill-cyan-50 stroke-cyan-200" />
            <text x="375" y="430" textAnchor="middle" className="text-sm font-medium">Funktionsschema</text>
            <text x="375" y="450" textAnchor="middle" className="text-xs">Data Object</text>
            
            <rect x="600" y="400" width="150" height="60" rx="5" className="fill-cyan-50 stroke-cyan-200" />
            <text x="675" y="430" textAnchor="middle" className="text-sm font-medium">Materialfluss</text>
            <text x="675" y="450" textAnchor="middle" className="text-xs">Data Object</text>
            
            <rect x="125" y="500" width="150" height="60" rx="5" className="fill-cyan-50 stroke-cyan-200" />
            <text x="200" y="530" textAnchor="middle" className="text-sm font-medium">Groblayout (2D)</text>
            <text x="200" y="550" textAnchor="middle" className="text-xs">Data Object</text>
            
            <rect x="300" y="500" width="150" height="60" rx="5" className="fill-cyan-50 stroke-cyan-200" />
            <text x="375" y="530" textAnchor="middle" className="text-sm font-medium">Ideallayout (3D)</text>
            <text x="375" y="550" textAnchor="middle" className="text-xs">Data Object</text>
            
            <rect x="600" y="500" width="150" height="60" rx="5" className="fill-cyan-50 stroke-cyan-200" />
            <text x="675" y="530" textAnchor="middle" className="text-sm font-medium">Reallayout (3D)</text>
            <text x="675" y="550" textAnchor="middle" className="text-xs">Data Object</text>
            
            {/* Access relationships (dotted lines) */}
            <path d="M 300 320 L 200 400" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-1 fill-none" />
            <path d="M 300 320 L 375 400" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-1 fill-none" />
            <path d="M 300 320 L 675 400" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-1 fill-none" />
            <path d="M 300 320 L 200 500" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-1 fill-none" />
            <path d="M 300 320 L 375 500" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-1 fill-none" />
            
            <path d="M 475 320 L 675 400" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-1 fill-none" />
            <path d="M 475 320 L 675 500" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-1 fill-none" />
            
            <path d="M 650 320 L 675 400" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-1 fill-none" />
            <path d="M 650 320 L 675 500" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-1 fill-none" />
            
            {/* Bottom layer labels */}
            <rect x="360" y="580" width="100" height="20" rx="2" className="fill-none stroke-gray-300 stroke-dasharray-2" />
            <text x="410" y="595" textAnchor="middle" className="text-xs text-gray-500">Datenmodelle</text>
            
            <rect x="470" y="580" width="100" height="20" rx="2" className="fill-none stroke-gray-300 stroke-dasharray-2" />
            <text x="520" y="595" textAnchor="middle" className="text-xs text-gray-500">Grafisches Modell</text>
          </g>

          {/* Arrow Marker Definition */}
          <defs>
            <marker 
              id="arrowhead" 
              viewBox="0 0 10 10" 
              refX="5" 
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
              refX="5" 
              refY="5"
              markerWidth="6" 
              markerHeight="6" 
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-green-500" />
            </marker>
          </defs>
        </svg>
      </div>
    );
  };

  // Render relationship table
  const renderRelationshipsTable = () => {
    return (
      <div className="overflow-auto max-h-96 bg-white rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {relationships.map((rel) => (
              <tr key={rel.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${rel.type === 'Composition' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 
                      rel.type === 'Realization' ? 'bg-green-50 text-green-600 border border-green-200' : 
                      rel.type === 'Triggering' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 
                      rel.type === 'Access' ? 'bg-cyan-50 text-cyan-600 border border-cyan-200' : 
                      'bg-gray-50 text-gray-600 border border-gray-200'}`}>
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

  // Render element details
  const renderElementDetails = () => {
    if (!selectedElement) {
      return (
        <div className="p-6 text-center text-gray-500">
          <p>Select an element in the diagram or from the element list to view its details.</p>
        </div>
      );
    }

    const element = architectureElements.find(el => el.id === selectedElement);
    
    return (
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 ${getElementTypeColor(element?.type)}`}>
            <span className="text-lg font-bold">{element?.name?.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">{element?.name}</h3>
            <p className="text-sm text-gray-600">{element?.type}</p>
          </div>
        </div>
        
        <div className="border-t border-b border-gray-200 py-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
          </div>
        </div>
        
        {detailsView === 'properties' && (
          <div>
            <h4 className="font-medium mb-2">Properties</h4>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">ID</td>
                  <td className="py-2">{element?.id}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">Name</td>
                  <td className="py-2">{element?.name}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">Type</td>
                  <td className="py-2">{element?.type}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-medium">Description</td>
                  <td className="py-2">{element?.description}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {detailsView === 'relationships' && (
          <div>
            <h4 className="font-medium mb-2">Relationships</h4>
            
            <h5 className="text-sm font-medium text-gray-600 mt-3 mb-1">Incoming</h5>
            <div className="bg-gray-50 rounded p-2 mb-4">
              {relationships.filter(rel => rel.target.includes(element?.name)).map((rel, idx) => (
                <div key={`in-${idx}`} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                  <span className="text-gray-700">{rel.source}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-teal-50 text-teal-700 border border-teal-200">{rel.type}</span>
                </div>
              ))}
              {relationships.filter(rel => rel.target.includes(element?.name)).length === 0 && (
                <p className="text-sm text-gray-500 py-1">No incoming relationships</p>
              )}
            </div>
            
            <h5 className="text-sm font-medium text-gray-600 mb-1">Outgoing</h5>
            <div className="bg-gray-50 rounded p-2">
              {relationships.filter(rel => rel.source.includes(element?.name)).map((rel, idx) => (
                <div key={`out-${idx}`} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                  <span className="text-gray-700">{rel.target}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-green-50 text-green-700 border border-green-200">{rel.type}</span>
                </div>
              ))}
              {relationships.filter(rel => rel.source.includes(element?.name)).length === 0 && (
                <p className="text-sm text-gray-500 py-1">No outgoing relationships</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render elements list
  const renderElementsList = () => {
    return (
      <div className="overflow-auto max-h-96 bg-white rounded-lg border border-gray-200">
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
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getElementTypeColor(element.type)}`}>
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Reference Architecture</h1>
        <p className="text-gray-600">Referenzarchitektur Digitaler Fabrikzwilling: Prozesssicht - Perspektive Fabrik</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className="px-6 py-3 text-sm font-medium text-teal-600 border-b-2 border-teal-600"
          >
            Perspektive Fabrik
          </button>
          <button
            className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Perspektive Produkt
          </button>
          <button
            className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Perspektive Auftrag
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Architecture Diagram Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 
                className="text-lg font-medium text-gray-700 flex items-center cursor-pointer"
                onClick={() => toggleSection('diagram')}
              >
                {expandedSections.diagram ? 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg> : 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>}
                Architecture Diagram
              </h2>
              <button 
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {expandedSections.diagram && renderDiagram()}
          </div>
          
          {/* Elements and Relationships Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Elements Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div 
                className="p-4 border-b border-gray-200 flex items-center cursor-pointer"
                onClick={() => toggleSection('elements')}
              >
                <h3 className="text-lg font-medium text-gray-700 flex items-center">
                  {expandedSections.elements ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg> : 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>}
                  Elements
                </h3>
              </div>
              {expandedSections.elements && renderElementsList()}
            </div>
            
            {/* Relationships Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div 
                className="p-4 border-b border-gray-200 flex items-center cursor-pointer"
                onClick={() => toggleSection('relationships')}
              >
                <h3 className="text-lg font-medium text-gray-700 flex items-center">
                  {expandedSections.relationships ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg> : 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>}
                  Relationships
                </h3>
              </div>
              {expandedSections.relationships && renderRelationshipsTable()}
            </div>
          </div>
          
          {/* Element Details Section */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-700">Element Details</h3>
            </div>
            {renderElementDetails()}
          </div>
        </div>
      </div>
      
      {/* Legend Section */}
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
      </div>
    </div>
  );
};

export default FactoryArchitectureViewer;