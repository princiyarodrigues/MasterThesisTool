import React, { useState } from 'react';
import { Menu, X, Info } from 'lucide-react';

export function PerspectiveTabs({ activePerspective, onPerspectiveChange }) {
  const [showLegend, setShowLegend] = useState(false);

  const LegendModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Architecture Legend</h3>
          <button
            onClick={() => setShowLegend(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Element Types Legend */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Element Types</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-amber-100 border border-amber-300 rounded"></div>
                <span className="text-sm text-gray-700">Value Stream</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-sm text-gray-700">Business Process</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-cyan-100 border border-cyan-300 rounded"></div>
                <span className="text-sm text-gray-700">Data Object</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 border border-blue-300 rounded"></div>
                <span className="text-sm text-gray-700">Application Component</span>
              </div>
            </div>
          </div>

          {/* Relationship Types Legend */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Relationship Types</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-1 bg-amber-500"></div>
                <span className="text-sm text-gray-700">Triggering</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-1 bg-green-500"></div>
                <span className="text-sm text-gray-700">Realization</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-1 bg-cyan-500 border-dashed border-t-2 border-cyan-500"></div>
                <span className="text-sm text-gray-700">Access</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-1 bg-blue-500"></div>
                <span className="text-sm text-gray-700">Composition</span>
              </div>
            </div>
          </div>

          {/* Interaction Guide */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">How to Use</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Click on perspective tabs to switch between different architectural views</p>
              <p>• Click on elements in the diagram to view details and relationships</p>
              <p>• Drag use case blocks from the left panel onto the diagram containers</p>
              <p>• Selected elements will highlight related connections in the diagram</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
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
        
        {/* Legend Hamburger Icon */}
        <div className="flex items-center ml-4 border-l border-gray-200 pl-4">
          <button
            onClick={() => setShowLegend(true)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="View Legend"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showLegend && <LegendModal />}
    </>
  );
}