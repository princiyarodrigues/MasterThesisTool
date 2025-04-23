import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ArchitectureDiagramSVG from './ArchitectureDiagramSVG';
import UCBlocks from './UCBlocks';
import { architectureElements, relationships } from './ArchitectureData';
import { PerspectiveTabs } from './PerspectiveTabs';
import ProductReferenceArchitecture from './ProductReferenceArchitecture';
import OrderReferenceArchitecture from './OrderReferenceArchitecture';
import ManufacturingReferenceArchitecture from './ManufacturingReferenceArchitecture';
import FinalViewReferenceArchitecture from './FinalViewReferenceArchitecture';
import DigitalFactoryArchitecture from './DigitalFactoryArchitecture';

const ReferenceArchitecture = ({ departmentId = 'operations' }) => {
  const [activeTab, setActiveTab] = useState('diagram');
  const [selectedElement, setSelectedElement] = useState(null);
  const [detailsView, setDetailsView] = useState('properties');
  const [showNextStepPrompt, setShowNextStepPrompt] = useState(false);
  const [activePerspective, setActivePerspective] = useState('factory');

  // Function to get the correct elements based on perspective
  const getElements = () => {
    switch(activePerspective) {
      case 'product':
        return ProductReferenceArchitecture.architectureElements || [];
      case 'order':
        return OrderReferenceArchitecture.architectureElements || [];  
      case 'manufacturing':
        return ManufacturingReferenceArchitecture.architectureElements || [];
      case 'finalView':
        return FinalViewReferenceArchitecture.architectureElements || [];
      case 'factory':
      default:
        return allElements;
    }
  };

  // Get the correct relationships based on perspective
  const getRelationships = () => {
    switch(activePerspective) {
      case 'product':
        return ProductReferenceArchitecture.relationships || [];
      case 'order':
        return OrderReferenceArchitecture.relationships || [];
      case 'manufacturing':
        return ManufacturingReferenceArchitecture.relationships || [];
      case 'finalView':
        return FinalViewReferenceArchitecture.relationships || [];
      case 'factory':
      default:
        return relationships;
    }
  };

  // Show the next step prompt after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNextStepPrompt(true);
    }, 10000); // Show after 10 seconds
    
    return () => clearTimeout(timer);
  }, []);

  // Get element data and relationships based on active perspective
  useEffect(() => {
    // Reset selected element when changing perspectives
    setSelectedElement(null);
  }, [activePerspective]);

  // Adding the second layer elements (workflow elements)
  const secondLayerElements = [
    { id: 'workflow-1', name: 'Arbeitsablaufschema', type: 'Workflow Schema', x: 260, y: 180, width: 160, height: 40 },
    { id: 'workflow-2', name: 'Funktionsschema', type: 'Workflow Schema', x: 550, y: 180, width: 160, height: 40 },
    { id: 'workflow-3', name: 'Materialfluss', type: 'Workflow Schema', x: 1000, y: 180, width: 160, height: 40 },
  ];
  
  // Adding the third layer elements (layouts)
  const thirdLayerElements = [
    { id: 'layout-1', name: 'Groblayout (2D)', type: 'Layout', x: 350, y: 300, width: 140, height: 40 },
    { id: 'layout-2', name: 'Ideallayout (3D)', type: 'Layout', x: 700, y: 300, width: 140, height: 40 },
    { id: 'layout-3', name: 'Reallayout (3D)', type: 'Layout', x: 1050, y: 300, width: 140, height: 40 },
  ];
  
  // Adding the fourth layer elements (models)
  const fourthLayerElements = [
    { id: 'model-1', name: 'Grafisches Modell', type: 'Data Model', x: 400, y: 400, width: 140, height: 40 },
    { id: 'model-2', name: 'Strukturmodell', type: 'Data Model', x: 600, y: 400, width: 140, height: 40 },
    { id: 'model-3', name: 'Materialfluss', type: 'Data Model', x: 800, y: 400, width: 140, height: 40 },
    { id: 'model-4', name: 'Fähigkeitenmodell', type: 'Data Model', x: 1000, y: 400, width: 140, height: 40 },
    { id: 'model-5', name: 'Kennzahlenmodell', type: 'Data Model', x: 1200, y: 400, width: 140, height: 40 },
  ];

  // Filter to show only factory perspective elements
  const factoryElements = architectureElements.filter(el => 
    (el.type === 'Value Stream') ||
    (el.id === 'perspective-factory') ||
    (el.id.startsWith('factory-'))
  );
  
  // Combine all elements for the complete diagram
  const allElements = [
    ...factoryElements,
    ...secondLayerElements,
    ...thirdLayerElements,
    ...fourthLayerElements
  ];

  // Get the currently selected element's data
  const selectedElementData = selectedElement 
    ? getElements().find(el => el.id === selectedElement) 
    : null;
  
  // Filter relationships based on selected element and perspective
  const incomingRelationships = selectedElement
    ? getRelationships().filter(rel => rel.target === selectedElement)
    : [];
  
  const outgoingRelationships = selectedElement
    ? getRelationships().filter(rel => rel.source === selectedElement)
    : [];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-white relative">
        <div className="max-w-full mx-auto p-0">
          {/* Top Navigation and Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            {/* Navigation Back Link */}
            <div className="flex items-center justify-between">
              <Link 
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Back to Department</span>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-3 mt-2">
              <h1 className="text-2xl font-bold text-gray-800">Reference Architecture</h1>
              <p className="text-gray-600">
                {activePerspective === 'factory' && "Referenzarchitektur Digitaler Fabrikzwilling: Fabrikperspektive"}
                {activePerspective === 'product' && "Referenzarchitektur Digitaler Fabrikzwilling: Produktperspektive"}
                {activePerspective === 'order' && "Referenzarchitektur Digitaler Fabrikzwilling: Auftragsperspektive"}
                {activePerspective === 'manufacturing' && "Referenzarchitektur Digitaler Fabrikzwilling: Fertigungstechnologieperspektive"}
                {activePerspective === 'finalView' && "Referenzarchitektur Digitaler Fabrikzwilling: Final View"}
              </p>
              <p className="text-sm text-indigo-600 mt-1">
                Drag the Use Case Blocks from the left panel onto the Reference Architecture below
              </p>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* UC Blocks Panel - Takes up one column */}
            <div className="lg:col-span-2 border-r border-gray-200 p-3 h-[calc(100vh-110px)] overflow-hidden" style={{ maxWidth: "250px" }}>
              <UCBlocks />
            </div>
            
            {/* Architecture Diagram - Takes up eleven columns */}
            <div className="lg:col-span-10 h-[calc(100vh-110px)] bg-white overflow-hidden">
              {/* Perspective Tabs */}
              <PerspectiveTabs 
                activePerspective={activePerspective} 
                onPerspectiveChange={setActivePerspective} 
              />
              
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
              {/* Diagram Tab Content */}
              {activeTab === 'diagram' && (
                <div className="h-[calc(100vh-150px)] overflow-auto">
                  {activePerspective === 'factory' && (
                    <ArchitectureDiagramSVG 
                      selectedElement={selectedElement}
                      setSelectedElement={setSelectedElement}
                    />
                  )}
                  {activePerspective === 'product' && (
                    <ProductReferenceArchitecture 
                      selectedElement={selectedElement}
                      setSelectedElement={setSelectedElement}
                      departmentId={departmentId}
                    />
                  )}
                  {activePerspective === 'order' && (
                    <OrderReferenceArchitecture 
                      selectedElement={selectedElement}
                      setSelectedElement={setSelectedElement}
                      departmentId={departmentId}
                    />
                  )}
                  {activePerspective === 'manufacturing' && (
                    <ManufacturingReferenceArchitecture 
                      selectedElement={selectedElement}
                      setSelectedElement={setSelectedElement}
                      departmentId={departmentId}
                    />
                  )}
                  {activePerspective === 'finalView' && (
                    <DigitalFactoryArchitecture 
                      selectedElement={selectedElement}
                      setSelectedElement={setSelectedElement}
                      departmentId={departmentId}
                    />
                  )}
                  
                  {/* Legend Section - Moved inside the scrollable area */}
                  <LegendSection />
                </div>
              )}

              {/* Elements Tab Content */}
              {activeTab === 'elements' && (
                <div className="p-4 overflow-auto h-[calc(100vh-150px)]">
                  {(activePerspective === 'factory' || activePerspective === 'product' || activePerspective === 'manufacturing' || activePerspective === 'finalView') && (
                    <ElementsTable 
                      elements={getElements()}
                      onElementSelect={setSelectedElement}
                      selectedElement={selectedElement}
                    />
                  )}
                  {activePerspective === 'order' && (
                    <ElementsTable 
                      elements={getElements()}
                      onElementSelect={setSelectedElement}
                      selectedElement={selectedElement}
                    />
                  )}
                  
                  {/* Legend Section for Elements tab */}
                  <div className="mt-6">
                    <LegendSection />
                  </div>
                </div>
              )}

              {/* Details Tab Content */}
              {activeTab === 'details' && (
                <div className="p-4 overflow-auto h-[calc(100vh-150px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-[calc(100vh-240px)]">
                      {activePerspective === 'factory' && (
                        <ArchitectureDiagramSVG 
                          selectedElement={selectedElement}
                          setSelectedElement={setSelectedElement}
                        />
                      )}
                      {activePerspective === 'product' && (
                        <ProductReferenceArchitecture 
                          selectedElement={selectedElement}
                          setSelectedElement={setSelectedElement}
                          departmentId={departmentId}
                        />
                      )}
                      {activePerspective === 'order' && (
                        <OrderReferenceArchitecture 
                          selectedElement={selectedElement}
                          setSelectedElement={setSelectedElement}
                          departmentId={departmentId}
                        />
                      )}
                      {activePerspective === 'manufacturing' && (
                        <ManufacturingReferenceArchitecture 
                          selectedElement={selectedElement}
                          setSelectedElement={setSelectedElement}
                          departmentId={departmentId}
                        />
                      )}
                      {activePerspective === 'finalView' && (
                        <DigitalFactoryArchitecture 
                          selectedElement={selectedElement}
                          setSelectedElement={setSelectedElement}
                          departmentId={departmentId}
                        />
                      )}
                    </div>
                    <div>
                      <ElementDetails
                        element={selectedElementData}
                        incomingRelationships={incomingRelationships}
                        outgoingRelationships={outgoingRelationships}
                        detailsView={detailsView}
                        setDetailsView={setDetailsView}
                        architectureElements={getElements()}
                      />
                    </div>
                  </div>
                  
                  {/* Legend Section for Details tab */}
                  <div className="mt-6">
                    <LegendSection />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next Step Prompt */}
        {showNextStepPrompt && (
          <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-xl border border-teal-400 p-4 max-w-md animate-fadeIn z-50">
            <div className="flex items-start">
              <div className="bg-teal-100 rounded-full p-2 mr-3">
                <Info className="h-6 w-6 text-teal-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Ready for the next step?</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Now that you've explored the architecture goals, continue to Business Capabilities to understand implementation options.
                </p>
                <Link 
                  href={`/departments/${departmentId}/business-capabilities`}
                  className="flex items-center text-teal-700 font-semibold text-sm hover:text-teal-900 group"
                >
                  <span>Go to Business Capabilities</span>
                  <ChevronRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <button 
                onClick={() => setShowNextStepPrompt(false)}
                className="ml-4 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

// Elements Table Component for the Elements tab
const ElementsTable = ({ elements, onElementSelect, selectedElement }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Filter elements based on search and type
  const filteredElements = elements.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (element.description && element.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || element.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Get styling for element type badge
  const getTypeStyles = (type) => {
    switch (type) {
      case 'Value Stream':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Business Process':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'Workflow Schema':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Layout':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Data Model':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
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
          <option value="Workflow Schema">Workflow Schema</option>
          <option value="Layout">Layout</option>
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
                onClick={() => onElementSelect(element.id)}
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
                  <div className="text-sm text-gray-500">{element.description || 'No description available'}</div>
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
  );
};

// Element Details Component for the Details tab
const ElementDetails = ({ element, incomingRelationships, outgoingRelationships, detailsView, setDetailsView, architectureElements }) => {
  if (!element) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        <p>Select an element in the diagram or from the element list to view its details.</p>
      </div>
    );
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Value Stream':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'Business Process':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'Workflow Schema':
        return 'bg-cyan-50 border-cyan-200 text-cyan-800';
      case 'Layout':
        return 'bg-cyan-50 border-cyan-200 text-cyan-800';
      case 'Data Model':
        return 'bg-cyan-50 border-cyan-200 text-cyan-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{element.name}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(element.type)}`}>
            {element.type}
          </span>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            className={`w-1/2 py-3 px-1 text-center text-sm font-medium ${
              detailsView === 'properties'
                ? 'border-b-2 border-teal-500 text-teal-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setDetailsView('properties')}
          >
            Properties
          </button>
          <button
            className={`w-1/2 py-3 px-1 text-center text-sm font-medium ${
              detailsView === 'relationships'
                ? 'border-b-2 border-teal-500 text-teal-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setDetailsView('relationships')}
          >
            Relationships
          </button>
        </nav>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {detailsView === 'properties' ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="mt-1 text-sm text-gray-900">{element.description || 'No description available'}</p>
            </div>
            
            {element.attributes && Object.keys(element.attributes).length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Attributes</h4>
                <dl className="mt-2 divide-y divide-gray-200">
                  {Object.entries(element.attributes).map(([key, value]) => (
                    <div key={key} className="py-2 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">{key}</dt>
                      <dd className="text-sm text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {incomingRelationships.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Incoming Relationships</h4>
                <ul className="mt-2 divide-y divide-gray-200">
                  {incomingRelationships.map(rel => {
                    const sourceElement = architectureElements.find(el => el.id === rel.source);
                    return (
                      <li key={rel.id} className="py-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {sourceElement ? sourceElement.name : 'Unknown Element'}
                          </span>
                          <span className="text-xs text-gray-500">—</span>
                          <span className="text-sm text-teal-600">{rel.type}</span>
                          <span className="text-xs text-gray-500">→</span>
                          <span className="text-sm text-gray-900">{element.name}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            
            {outgoingRelationships.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Outgoing Relationships</h4>
                <ul className="mt-2 divide-y divide-gray-200">
                  {outgoingRelationships.map(rel => {
                    const targetElement = architectureElements.find(el => el.id === rel.target);
                    return (
                      <li key={rel.id} className="py-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{element.name}</span>
                          <span className="text-xs text-gray-500">—</span>
                          <span className="text-sm text-teal-600">{rel.type}</span>
                          <span className="text-xs text-gray-500">→</span>
                          <span className="text-sm text-gray-900">
                            {targetElement ? targetElement.name : 'Unknown Element'}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            
            {incomingRelationships.length === 0 && outgoingRelationships.length === 0 && (
              <p className="text-sm text-gray-500">No relationships found for this element.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Legend Component
const LegendSection = () => {
  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <h2 className="text-lg font-medium text-gray-800 mb-3">Legend</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Element Types */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Element Types</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <div className="w-4 h-4 bg-amber-50 border border-amber-200 mr-2 rounded"></div>
              <span className="text-sm text-gray-700">Value Stream</span>
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-green-50 border border-green-200 mr-2 rounded"></div>
              <span className="text-sm text-gray-700">Business Process</span>
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-cyan-50 border border-cyan-200 mr-2 rounded"></div>
              <span className="text-sm text-gray-700">Workflow Schema</span>
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-cyan-50 border border-cyan-200 mr-2 rounded"></div>
              <span className="text-sm text-gray-700">Layout</span>
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-cyan-50 border border-cyan-200 mr-2 rounded"></div>
              <span className="text-sm text-gray-700">Data Model</span>
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-indigo-50 border border-indigo-300 mr-2 rounded"></div>
              <span className="text-sm text-gray-700">Use Case Block</span>
            </li>
          </ul>
        </div>
        
        {/* Relationship Types */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Relationship Types</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <svg width="16" height="8" className="mr-2">
                <line x1="0" y1="4" x2="12" y2="4" stroke="#f59e0b" strokeWidth="2" />
                <polygon points="12,0 16,4 12,8" fill="#f59e0b" />
              </svg>
              <span className="text-sm text-gray-700">Triggering</span>
            </li>
            <li className="flex items-center">
              <svg width="16" height="8" className="mr-2">
                <line x1="0" y1="4" x2="12" y2="4" stroke="#10b981" strokeWidth="2" strokeDasharray="2" />
                <polygon points="12,0 16,4 12,8" fill="#10b981" />
              </svg>
              <span className="text-sm text-gray-700">Realization</span>
            </li>
            <li className="flex items-center">
              <svg width="16" height="8" className="mr-2">
                <line x1="0" y1="4" x2="12" y2="4" stroke="#06b6d4" strokeWidth="2" strokeDasharray="1" />
                <polygon points="12,0 16,4 12,8" fill="#06b6d4" />
              </svg>
              <span className="text-sm text-gray-700">Access</span>
            </li>
            <li className="flex items-center">
              <svg width="16" height="8" className="mr-2">
                <line x1="0" y1="4" x2="12" y2="4" stroke="#3b82f6" strokeWidth="2" />
                <polygon points="12,0 16,4 12,8" fill="#3b82f6" />
              </svg>
              <span className="text-sm text-gray-700">Composition</span>
            </li>
            <li className="flex items-center">
              <svg width="16" height="8" className="mr-2">
                <line x1="0" y1="4" x2="12" y2="4" stroke="#FF3366" strokeWidth="2" />
                <polygon points="12,0 16,4 12,8" fill="#FF3366" />
              </svg>
              <span className="text-sm text-gray-700">Use Case Connection</span>
            </li>
          </ul>
        </div>
        
        {/* Selection States */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Selection States</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <div className="w-4 h-4 bg-white border-2 border-blue-600 mr-2 rounded"></div>
              <span className="text-sm text-gray-700">Selected Element</span>
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-white border-2 border-blue-400 mr-2 rounded"></div>
              <span className="text-sm text-gray-700">Related Element</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReferenceArchitecture;