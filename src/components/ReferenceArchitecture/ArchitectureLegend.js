import React from 'react';

export function ArchitectureLegend() {
  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
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
          <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Business Event</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Other</span>
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
    </div>
  );
}