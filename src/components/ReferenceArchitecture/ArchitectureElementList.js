import React from 'react';

export function ArchitectureElementList({ 
  elements, 
  selectedElement, 
  onElementSelect, 
  getElementTypeColor 
}) {
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
          {elements.map((element) => (
            <tr 
              key={element.id} 
              className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${selectedElement === element.id ? 'bg-teal-50' : ''}`}
              onClick={() => onElementSelect(element.id)}
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
}
