import React from 'react';

export function ElementDetails({ 
  element, 
  detailsView, 
  setDetailsView, 
  relationships, 
  getElementTypeColor 
}) {
  if (!element) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Select an element in the diagram or from the element list to view its details.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 ${getElementTypeColor(element.type)}`}>
          <span className="text-lg font-bold">{element.name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800">{element.name}</h3>
          <p className="text-sm text-gray-600">{element.type}</p>
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
                <td className="py-2">{element.id}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 font-medium">Name</td>
                <td className="py-2">{element.name}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 font-medium">Type</td>
                <td className="py-2">{element.type}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 font-medium">Description</td>
                <td className="py-2">{element.description}</td>
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
            {relationships.filter(rel => rel.target.includes(element.name)).map((rel, idx) => (
              <div key={`in-${idx}`} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                <span className="text-gray-700">{rel.source}</span>
                <span className="px-2 py-0.5 rounded text-xs bg-teal-50 text-teal-700 border border-teal-200">{rel.type}</span>
              </div>
            ))}
            {relationships.filter(rel => rel.target.includes(element.name)).length === 0 && (
              <p className="text-sm text-gray-500 py-1">No incoming relationships</p>
            )}
          </div>
          
          <h5 className="text-sm font-medium text-gray-600 mb-1">Outgoing</h5>
          <div className="bg-gray-50 rounded p-2">
            {relationships.filter(rel => rel.source.includes(element.name)).map((rel, idx) => (
              <div key={`out-${idx}`} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                <span className="text-gray-700">{rel.target}</span>
                <span className="px-2 py-0.5 rounded text-xs bg-green-50 text-green-700 border border-green-200">{rel.type}</span>
              </div>
            ))}
            {relationships.filter(rel => rel.source.includes(element.name)).length === 0 && (
              <p className="text-sm text-gray-500 py-1">No outgoing relationships</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
