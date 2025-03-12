import React, { useState } from 'react';
import FactoryArchitectureDiagram from './ArchitectureDiagram';
import ArchitectureElementList from './ArchitectureElementList';

const EnhancedReferenceArchitecture = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [activePerspective, setActivePerspective] = useState('factory');
  const [activeTab, setActiveTab] = useState('diagram');
  const [detailsView, setDetailsView] = useState('properties');
  
  // Architecture elements data for element details
  const elementsData = {
    'vs-1': { id: 'vs-1', name: '1. Spezifikation & Planung', type: 'Value Stream', description: 'Planning and specification phase of the factory lifecycle' },
    'vs-2': { id: 'vs-2', name: '2. Aufbau & Inbetriebnahme', type: 'Value Stream', description: 'Construction and commissioning phase' },
    'vs-3': { id: 'vs-3', name: '3.0 Betrieb', type: 'Value Stream', description: 'Operational phase of the factory' },
    'vs-3.1': { id: 'vs-3.1', name: '3.1 Service & Wartung', type: 'Value Stream', description: 'Maintenance and service activities' },
    'vs-3.2': { id: 'vs-3.2', name: '3.2 Umplanung', type: 'Value Stream', description: 'Reconfiguration planning' },
    'vs-4': { id: 'vs-4', name: '4. Demontage & Recycling', type: 'Value Stream', description: 'End-of-life phase' },
    
    'bp-1.1': { id: 'bp-1.1', name: '1.1 Investitionsplanung', type: 'Business Process', description: 'Investment planning for factory development' },
    'bp-1.2': { id: 'bp-1.2', name: '1.2 Engineering', type: 'Business Process', description: 'Technical engineering of factory systems' },
    'bp-2.1': { id: 'bp-2.1', name: '2.1 Aufbau & Anlauf', type: 'Business Process', description: 'Construction and initial setup activities' },
    'bp-3.1': { id: 'bp-3.1', name: '3.1 Produktion', type: 'Business Process', description: 'Production operations' },
    'bp-3.2': { id: 'bp-3.2', name: '3.2 Instandhaltung & Optimierung', type: 'Business Process', description: 'Maintenance and optimization of factory systems' },
    'bp-3.3': { id: 'bp-3.3', name: '3.3 Modernisierung', type: 'Business Process', description: 'Modernization of factory systems' },
    'bp-4.1': { id: 'bp-4.1', name: '4.1 Demontage, Rückbau', type: 'Business Process', description: 'Disassembly and recycling activities' },
    
    'do-1': { id: 'do-1', name: 'Arbeitsablaufschema', type: 'Data Object', description: 'Work process schema' },
    'do-2': { id: 'do-2', name: 'Funktionsschema', type: 'Data Object', description: 'Functional schema' },
    'do-3': { id: 'do-3', name: 'Materialfluss', type: 'Data Object', description: 'Material flow information' },
    'do-4': { id: 'do-4', name: 'Groblayout (2D)', type: 'Data Object', description: 'High-level 2D layout' },
    'do-5': { id: 'do-5', name: 'Ideallayout (3D)', type: 'Data Object', description: 'Ideal 3D layout' },
    'do-6': { id: 'do-6', name: 'Reallayout (3D)', type: 'Data Object', description: 'Actual 3D layout' },
    
    'dm-1': { id: 'dm-1', name: 'Grafisches Modell', type: 'Data Model', description: 'Graphical model' },
    'dm-2': { id: 'dm-2', name: 'Strukturmodell', type: 'Data Model', description: 'Structure model' },
    'dm-3': { id: 'dm-3', name: 'Materialfluss', type: 'Data Model', description: 'Material flow data model' },
    'dm-4': { id: 'dm-4', name: 'Fähigkeitenmodell', type: 'Data Model', description: 'Capabilities model' },
    'dm-5': { id: 'dm-5', name: 'Kennzahlenmodell', type: 'Data Model', description: 'KPI model' }
  };
  
  // Relationship data for element details
  const relationshipsData = [
    { id: 'rel-1', type: 'Triggering', source: 'vs-1', target: 'vs-2', description: 'Planning triggers construction' },
    { id: 'rel-2', type: 'Triggering', source: 'vs-2', target: 'vs-3', description: 'Construction triggers operation' },
    { id: 'rel-3', type: 'Triggering', source: 'vs-3', target: 'vs-4', description: 'Operation triggers end-of-life' },
    { id: 'rel-4', type: 'Triggering', source: 'bp-1.1', target: 'bp-1.2', description: 'Investment planning triggers engineering' },
    { id: 'rel-5', type: 'Triggering', source: 'bp-1.2', target: 'bp-2.1', description: 'Engineering triggers construction' },
    { id: 'rel-6', type: 'Triggering', source: 'bp-2.1', target: 'bp-3.1', description: 'Construction triggers production' },
    { id: 'rel-7', type: 'Triggering', source: 'bp-3.1', target: 'bp-3.2', description: 'Production triggers maintenance' },
    { id: 'rel-8', type: 'Triggering', source: 'bp-3.2', target: 'bp-3.3', description: 'Maintenance triggers modernization' },
    { id: 'rel-9', type: 'Triggering', source: 'bp-3.3', target: 'bp-4.1', description: 'Modernization triggers disassembly' },
    { id: 'rel-10', type: 'Realization', source: 'bp-1.2', target: 'vs-1', description: 'Engineering realizes planning' },
    { id: 'rel-11', type: 'Realization', source: 'bp-2.1', target: 'vs-2', description: 'Construction realizes commissioning' },
    { id: 'rel-12', type: 'Realization', source: 'bp-3.1', target: 'vs-3', description: 'Production realizes operation' },
    { id: 'rel-13', type: 'Realization', source: 'bp-3.2', target: 'vs-3.1', description: 'Maintenance realizes service' },
    { id: 'rel-14', type: 'Realization', source: 'bp-3.3', target: 'vs-3.2', description: 'Modernization realizes reconfiguration' },
    { id: 'rel-15', type: 'Realization', source: 'bp-4.1', target: 'vs-4', description: 'Disassembly realizes recycling' },
    { id: 'rel-16', type: 'Access', source: 'bp-1.2', target: 'do-1', description: 'Engineering accesses work schema' },
    { id: 'rel-17', type: 'Access', source: 'bp-1.2', target: 'do-2', description: 'Engineering accesses function schema' },
    { id: 'rel-18', type: 'Access', source: 'bp-1.2', target: 'do-3', description: 'Engineering accesses material flow' },
    { id: 'rel-19', type: 'Access', source: 'bp-1.2', target: 'do-4', description: 'Engineering accesses 2D layout' },
    { id: 'rel-20', type: 'Access', source: 'bp-1.2', target: 'do-5', description: 'Engineering accesses 3D layout' },
    { id: 'rel-21', type: 'Composition', source: 'dm-1', target: 'do-4', description: 'Graphical model composes 2D layout' },
    { id: 'rel-22', type: 'Composition', source: 'dm-1', target: 'do-5', description: 'Graphical model composes 3D layout' },
    { id: 'rel-23', type: 'Composition', source: 'dm-2', target: 'do-6', description: 'Structure model composes 3D layout' }
  ];

  // Get the currently selected element's data
  const selectedElementData = selectedElement ? elementsData[selectedElement] : null;
  
  // Filter relationships based on selected element
  const incomingRelationships = selectedElement ?
    relationshipsData.filter(rel => rel.target === selectedElement) : [];
  
  const outgoingRelationships = selectedElement ?
    relationshipsData.filter(rel => rel.source === selectedElement) : [];

  // Get element type styling
  const getElementTypeColor = (type) => {
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

  // Get relationship type styling
  const getRelationshipTypeColor = (type) => {
    switch (type) {
      case 'Triggering':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'Realization':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'Access':
        return 'bg-cyan-50 border-cyan-200 text-cyan-800';
      case 'Composition':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 p-4 min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Reference Architecture</h1>
          <p className="text-gray-600">Referenzarchitektur Digitaler Fabrikzwilling: Prozesssicht</p>
        </div>

        {/* Perspective Tabs */}
      

        {/* Content Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
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
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Diagram or Elements based on activeTab */}
          <div className={`${activeTab === 'details' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {activeTab === 'diagram' && (
              <FactoryArchitectureDiagram 
                activePerspective={activePerspective} 
                selectedElement={selectedElement}
                onElementSelect={setSelectedElement}
              />
            )}
            
            {activeTab === 'elements' && (
              <ArchitectureElementList 
                onElementSelect={setSelectedElement} 
              />
            )}
            
            {activeTab === 'details' && !selectedElement && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No element selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select an element from the diagram or elements list to view its details.
                </p>
              </div>
            )}
            
            {activeTab === 'details' && selectedElement && (
              <FactoryArchitectureDiagram 
                activePerspective={activePerspective} 
                selectedElement={selectedElement}
                onElementSelect={setSelectedElement}
              />
            )}
          </div>
          
          {/* Element Details Panel (only shown when in details tab and an element is selected) */}
          {activeTab === 'details' && selectedElement && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 ${getElementTypeColor(selectedElementData.type)}`}>
                    <span className="text-lg font-bold">{selectedElementData.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{selectedElementData.name}</h3>
                    <p className="text-sm text-gray-600">{selectedElementData.type}</p>
                  </div>
                </div>
              </div>
              
              {/* Tabs for element details */}
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
              
              {/* Element properties */}
              {detailsView === 'properties' && (
                <div className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">ID</h4>
                      <p className="mt-1 text-sm text-gray-900">{selectedElementData.id}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Name</h4>
                      <p className="mt-1 text-sm text-gray-900">{selectedElementData.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Type</h4>
                      <p className="mt-1 text-sm text-gray-900">{selectedElementData.type}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Description</h4>
                      <p className="mt-1 text-sm text-gray-900">{selectedElementData.description}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Element relationships */}
              {detailsView === 'relationships' && (
                <div className="p-4">
                  <div className="space-y-6">
                    {/* Incoming relationships */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Incoming Relationships</h4>
                      {incomingRelationships.length > 0 ? (
                        <div className="space-y-2">
                          {incomingRelationships.map(rel => (
                            <div key={rel.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <div>
                                <span className="text-sm font-medium">{elementsData[rel.source]?.name}</span>
                                <span className="text-xs text-gray-500 ml-2">({elementsData[rel.source]?.type})</span>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full border ${getRelationshipTypeColor(rel.type)}`}>
                                {rel.type}
                              </span>
                            </div>
                          ))}
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
                          {outgoingRelationships.map(rel => (
                            <div key={rel.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <div>
                                <span className="text-sm font-medium">{elementsData[rel.target]?.name}</span>
                                <span className="text-xs text-gray-500 ml-2">({elementsData[rel.target]?.type})</span>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full border ${getRelationshipTypeColor(rel.type)}`}>
                                {rel.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No outgoing relationships</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedReferenceArchitecture;