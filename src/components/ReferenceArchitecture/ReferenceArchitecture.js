import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ArchitectureDiagramSVG from './ArchitectureDiagramSVG';
import { architectureElements, relationships } from './ArchitectureData';

const ReferenceArchitecture = ({ departmentId = 'operations' }) => {
  const [activeTab, setActiveTab] = useState('diagram');
  const [selectedElement, setSelectedElement] = useState(null);
  const [detailsView, setDetailsView] = useState('properties');

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
              <ArchitectureDiagramSVG 
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
              />
            )}

            {/* Elements Tab Content */}
            {activeTab === 'elements' && (
              <ElementsTable 
                elements={architectureElements}
                onElementSelect={setSelectedElement}
                selectedElement={selectedElement}
              />
            )}

            {/* Details Tab Content */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ArchitectureDiagramSVG 
                    selectedElement={selectedElement}
                    setSelectedElement={setSelectedElement}
                  />
                </div>
                <div>
                  <ElementDetails
                    element={selectedElementData}
                    incomingRelationships={incomingRelationships}
                    outgoingRelationships={outgoingRelationships}
                    detailsView={detailsView}
                    setDetailsView={setDetailsView}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <LegendSection />
      </div>
    </div>
  );
};

// Elements Table Component for the Elements tab
const ElementsTable = ({ elements, onElementSelect, selectedElement }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Filter elements based on search and type
  const filteredElements = elements.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         element.description.toLowerCase().includes(searchTerm.toLowerCase());
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
      case 'Data Object':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Data Model':
        return 'bg-blue-50 text-blue-800 border-blue-200';
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
  );
};

// Element Details Component for the Details tab
const ElementDetails = ({ element, incomingRelationships, outgoingRelationships, detailsView, setDetailsView }) => {
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

// Legend Section Component
const LegendSection = () => {
  return (
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
      
      <div className="mt-4 border-t border-gray-200 pt-4">
        <h4 className="text-md font-medium text-gray-700 mb-2">Perspectives</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-2 bg-gray-50 rounded border border-gray-200">
            <h5 className="font-medium text-sm">Perspektive: Fabrik</h5>
            <p className="text-xs text-gray-600">Factory lifecycle processes from planning to dismantling</p>
          </div>
          <div className="p-2 bg-gray-50 rounded border border-gray-200">
            <h5 className="font-medium text-sm">Perspektive: Produkt</h5>
            <p className="text-xs text-gray-600">Product-focused processes from development to recycling</p>
          </div>
          <div className="p-2 bg-gray-50 rounded border border-gray-200">
            <h5 className="font-medium text-sm">Perspektive: Auftrag</h5>
            <p className="text-xs text-gray-600">Order-focused processes from configuration to delivery</p>
          </div>
          <div className="p-2 bg-gray-50 rounded border border-gray-200">
            <h5 className="font-medium text-sm">Perspektive: Fertigungstechnologie</h5>
            <p className="text-xs text-gray-600">Manufacturing technology processes from planning to modernization</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-2 bg-blue-50 text-blue-800 rounded">
        <p className="text-sm">
          <span className="font-medium">Tip:</span> Click on any element in the diagram to highlight its related elements and connections.
        </p>
      </div>
    </div>
  );
};

export default ReferenceArchitecture;