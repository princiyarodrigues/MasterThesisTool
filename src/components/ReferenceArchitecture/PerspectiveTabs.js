import React from 'react';

export function PerspectiveTabs({ activePerspective, onPerspectiveChange }) {
  return (
    <div className="flex border-b border-gray-200 mb-4">
      <button
        className={`px-6 py-3 text-sm font-medium ${
          activePerspective === 'factory' 
            ? 'text-teal-600 border-b-2 border-teal-600' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onPerspectiveChange('factory')}
      >
        Perspektive Fabrik
      </button>
      <button
        className={`px-6 py-3 text-sm font-medium ${
          activePerspective === 'product' 
            ? 'text-teal-600 border-b-2 border-teal-600' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onPerspectiveChange('product')}
      >
        Perspektive Produkt
      </button>
      <button
        className={`px-6 py-3 text-sm font-medium ${
          activePerspective === 'order' 
            ? 'text-teal-600 border-b-2 border-teal-600' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onPerspectiveChange('order')}
      >
        Perspektive Auftrag
      </button>
      <button
        className={`px-6 py-3 text-sm font-medium ${
          activePerspective === 'manufacturing' 
            ? 'text-teal-600 border-b-2 border-teal-600' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onPerspectiveChange('manufacturing')}
      >
        Perspektive Fertigungstechnologie
      </button>
      <button
        className={`px-6 py-3 text-sm font-medium ${
          activePerspective === 'finalView' 
            ? 'text-teal-600 border-b-2 border-teal-600' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onPerspectiveChange('finalView')}
      >
        Final View
      </button>
    </div>
  );
}