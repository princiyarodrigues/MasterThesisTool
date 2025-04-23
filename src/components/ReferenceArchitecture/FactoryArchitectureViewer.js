// src/components/ReferenceArchitecture/FactoryArchitectureViewer.js
import React, { useState } from 'react';
import { ArchitectureElementList } from './ArchitectureElementList';
import { RelationshipsTable } from './RelationshipsTable';
import { ElementDetails } from './ElementDetails';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { ArchitectureLegend } from './ArchitectureLegend';
import { CollapsibleSection } from './CollapsibleSection';
import { PerspectiveTabs } from './PerspectiveTabs';
import { architectureElements, relationships } from './ArchitectureData';

const FactoryArchitectureViewer = () => {
  // State management
  const [selectedElement, setSelectedElement] = useState(null);
  const [detailsView, setDetailsView] = useState('properties');
  const [activePerspective, setActivePerspective] = useState('factory');
  const [expandedSections, setExpandedSections] = useState({
    diagram: true,
    elements: false,
    relationships: false
  });

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

  // Get the selected element object
  const selectedElementObject = selectedElement 
    ? architectureElements.find(el => el.id === selectedElement) 
    : null;

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

  // Get the perspective description
  const getPerspectiveDescription = () => {
    switch(activePerspective) {
      case 'product':
        return 'Referenzarchitektur Digitaler Fabrikzwilling: Prozesssicht - Perspektive Produkt';
      case 'order':
        return 'Referenzarchitektur Digitaler Fabrikzwilling: Prozesssicht - Perspektive Auftrag';
      case 'manufacturing':
        return 'Referenzarchitektur Digitaler Fabrikzwilling: Prozesssicht - Perspektive Fertigungstechnologie';
      case 'finalView':
        return 'Referenzarchitektur Digitaler Fabrikzwilling: Prozesssicht - Final View';
      case 'factory':
      default:
        return 'Referenzarchitektur Digitaler Fabrikzwilling: Prozesssicht - Perspektive Fabrik';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Reference Architecture</h1>
        <p className="text-gray-600">{getPerspectiveDescription()}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        {/* Perspective Tabs */}
        <PerspectiveTabs 
          activePerspective={activePerspective} 
          onPerspectiveChange={setActivePerspective} 
        />
        
        <div className="space-y-6">
          {/* Architecture Diagram Section */}
          <CollapsibleSection 
            title="Architecture Diagram" 
            isExpanded={expandedSections.diagram} 
            onToggle={() => toggleSection('diagram')}
            actions={
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            }
          >
            <ArchitectureDiagram />
          </CollapsibleSection>
          
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
              {expandedSections.elements && (
                <ArchitectureElementList 
                  elements={architectureElements} 
                  selectedElement={selectedElement} 
                  onElementSelect={handleElementClick} 
                  getElementTypeColor={getElementTypeColor}
                />
              )}
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
              {expandedSections.relationships && (
                <RelationshipsTable relationships={relationships} />
              )}
            </div>
          </div>
          
          {/* Element Details Section */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-700">Element Details</h3>
            </div>
            <ElementDetails 
              element={selectedElementObject} 
              detailsView={detailsView} 
              setDetailsView={setDetailsView} 
              relationships={relationships} 
              getElementTypeColor={getElementTypeColor}
            />
          </div>
        </div>
      </div>
      
      {/* Legend Section */}
      <ArchitectureLegend />
    </div>
  );
};

export default FactoryArchitectureViewer;