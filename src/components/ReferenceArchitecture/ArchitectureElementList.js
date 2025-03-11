import React, { useState } from 'react';

const ArchitectureElementList = ({ onElementSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  
  // Architecture elements data
  const elements = [
    // Value Streams
    { id: 'vs-1', name: '1. Spezifikation & Planung', type: 'Value Stream', description: 'Planning and specification phase of the factory lifecycle' },
    { id: 'vs-2', name: '2. Aufbau & Inbetriebnahme', type: 'Value Stream', description: 'Construction and commissioning phase' },
    { id: 'vs-3', name: '3.0 Betrieb', type: 'Value Stream', description: 'Operational phase of the factory' },
    { id: 'vs-3.1', name: '3.1 Service & Wartung', type: 'Value Stream', description: 'Maintenance and service activities' },
    { id: 'vs-3.2', name: '3.2 Umplanung', type: 'Value Stream', description: 'Reconfiguration planning' },
    { id: 'vs-4', name: '4. Demontage & Recycling', type: 'Value Stream', description: 'End-of-life phase' },
    
    // Business Processes
    { id: 'bp-1.1', name: '1.1 Investitionsplanung', type: 'Business Process', description: 'Investment planning for factory development' },
    { id: 'bp-1.2', name: '1.2 Engineering', type: 'Business Process', description: 'Technical engineering of factory systems' },
    { id: 'bp-2.1', name: '2.1 Aufbau & Anlauf', type: 'Business Process', description: 'Construction and initial setup activities' },
    { id: 'bp-3.1', name: '3.1 Produktion', type: 'Business Process', description: 'Production operations' },
    { id: 'bp-3.2', name: '3.2 Instandhaltung & Optimierung', type: 'Business Process', description: 'Maintenance and optimization of factory systems' },
    { id: 'bp-3.3', name: '3.3 Modernisierung', type: 'Business Process', description: 'Modernization of factory systems' },
    { id: 'bp-4.1', name: '4.1 Demontage, Rückbau', type: 'Business Process', description: 'Disassembly and recycling activities' },
    
    // Data Objects
    { id: 'do-1', name: 'Arbeitsablaufschema', type: 'Data Object', description: 'Work process schema' },
    { id: 'do-2', name: 'Funktionsschema', type: 'Data Object', description: 'Functional schema' },
    { id: 'do-3', name: 'Materialfluss', type: 'Data Object', description: 'Material flow information' },
    { id: 'do-4', name: 'Groblayout (2D)', type: 'Data Object', description: 'High-level 2D layout' },
    { id: 'do-5', name: 'Ideallayout (3D)', type: 'Data Object', description: 'Ideal 3D layout' },
    { id: 'do-6', name: 'Reallayout (3D)', type: 'Data Object', description: 'Actual 3D layout' },
    
    // Data Models
    { id: 'dm-1', name: 'Grafisches Modell', type: 'Data Model', description: 'Graphical model' },
    { id: 'dm-2', name: 'Strukturmodell', type: 'Data Model', description: 'Structure model' },
    { id: 'dm-3', name: 'Materialfluss', type: 'Data Model', description: 'Material flow data model' },
    { id: 'dm-4', name: 'Fähigkeitenmodell', type: 'Data Model', description: 'Capabilities model' },
    { id: 'dm-5', name: 'Kennzahlenmodell', type: 'Data Model', description: 'KPI model' }
  ];

  // Filter elements based on search term and selected type
  const filteredElements = elements.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         element.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || element.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Get background color based on element type
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
    <div className="overflow-hidden bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Architecture Elements</h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
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
      </div>
      
      <div className="overflow-auto max-h-96">
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
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onElementSelect && onElementSelect(element.id)}
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

export default ArchitectureElementList;