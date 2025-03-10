import React from 'react';

export function RelationshipsTable({ relationships }) {
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
}
