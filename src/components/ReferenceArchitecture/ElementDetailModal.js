import React from 'react';
import { X } from 'lucide-react';
import { architectureElements, relationships } from './ArchitectureData';

const ElementDetailModal = ({ elementId, onClose }) => {
  if (!elementId) return null;
  
  // Find the element and its related elements/relationships
  const element = architectureElements.find(el => el.id === elementId);
  if (!element) return null;
  
  // Find incoming and outgoing relationships
  const incomingRelationships = relationships.filter(rel => rel.target === elementId);
  const outgoingRelationships = relationships.filter(rel => rel.source === elementId);
  
  // Get type-based styles
  const getTypeColor = (type) => {
    switch (type) {
      case 'Value Stream':
        return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
      case 'Business Process':
        return { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' };
      case 'Data Object':
        return { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' };
      case 'Data Model':
        return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };
  
  const typeColors = getTypeColor(element.type);
  
  const getRelationTypeStyles = (relationType) => {
    switch (relationType) {
      case 'Triggering':
        return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
      case 'Realization':
        return { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' };
      case 'Access':
        return { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' };
      case 'Composition':
        return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto relative z-10">
        {/* Header */}
        <div className={`${typeColors.bg} ${typeColors.border} border-b p-4 flex justify-between items-center`}>
          <div>
            <span className="text-xs uppercase font-semibold text-gray-500">Element Details</span>
            <h2 className={`text-xl font-bold ${typeColors.text}`}>{element.name}</h2>
            <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${typeColors.bg} ${typeColors.text} ${typeColors.border} border mt-1`}>
              {element.type}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Properties Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Properties</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium text-gray-500 w-1/4">ID</td>
                  <td className="py-2 px-4 text-gray-800">{element.id}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium text-gray-500">Name</td>
                  <td className="py-2 px-4 text-gray-800">{element.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium text-gray-500">Type</td>
                  <td className="py-2 px-4 text-gray-800">{element.type}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium text-gray-500">Description</td>
                  <td className="py-2 px-4 text-gray-800">{element.description}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Incoming Relationships Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Incoming Relationships</h3>
            {incomingRelationships.length > 0 ? (
              <div className="space-y-2">
                {incomingRelationships.map(rel => {
                  const sourceElement = architectureElements.find(el => el.id === rel.source);
                  const relStyles = getRelationTypeStyles(rel.type);
                  
                  return (
                    <div key={rel.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(sourceElement?.type || 'Unknown').bg} ${getTypeColor(sourceElement?.type || 'Unknown').border} border mr-2`}>
                          <span className="text-sm font-bold">{sourceElement?.name?.charAt(0) || '?'}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{sourceElement?.name || rel.source}</div>
                          <div className="text-xs text-gray-500">{sourceElement?.type || 'Unknown'}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${relStyles.bg} ${relStyles.text} ${relStyles.border} border`}>
                        {rel.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No incoming relationships</p>
            )}
          </div>
          
          {/* Outgoing Relationships Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Outgoing Relationships</h3>
            {outgoingRelationships.length > 0 ? (
              <div className="space-y-2">
                {outgoingRelationships.map(rel => {
                  const targetElement = architectureElements.find(el => el.id === rel.target);
                  const relStyles = getRelationTypeStyles(rel.type);
                  
                  return (
                    <div key={rel.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(targetElement?.type || 'Unknown').bg} ${getTypeColor(targetElement?.type || 'Unknown').border} border mr-2`}>
                          <span className="text-sm font-bold">{targetElement?.name?.charAt(0) || '?'}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{targetElement?.name || rel.target}</div>
                          <div className="text-xs text-gray-500">{targetElement?.type || 'Unknown'}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${relStyles.bg} ${relStyles.text} ${relStyles.border} border`}>
                        {rel.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No outgoing relationships</p>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElementDetailModal;