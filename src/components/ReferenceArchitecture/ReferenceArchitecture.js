import React, { useState, useEffect, useCallback } from 'react';
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
import FactoryReferenceArchitecture from './FactoryReferenceArchitecture';

const ReferenceArchitecture = ({ departmentId = 'operations' }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [detailsView, setDetailsView] = useState('properties');
  const [showNextStepPrompt, setShowNextStepPrompt] = useState(false);
  const [activePerspective, setActivePerspective] = useState('factory');
  const [perspectiveUsedElements, setPerspectiveUsedElements] = useState({
    factory: [],
    product: [],
    order: [],
    manufacturing: [],
    finalView: []
  });

  // Get current perspective's used elements
  const usedElements = perspectiveUsedElements[activePerspective] || [];

  // Handle element usage changes from the diagram - memoized to prevent re-creation
  const handleElementUsageChange = useCallback((usedElementIds) => {
    setPerspectiveUsedElements(prev => {
      const newState = { ...prev };
      const currentUsed = newState[activePerspective] || [];
      
      // Only update if the arrays are actually different
      if (JSON.stringify(currentUsed) !== JSON.stringify(usedElementIds)) {
        newState[activePerspective] = usedElementIds;
        console.log(`=== PERSPECTIVE ${activePerspective.toUpperCase()}: Used elements updated ===`, usedElementIds);
        return newState;
      }
      return prev;
    });
  }, [activePerspective]);

  // Function to update used elements for current perspective (for UCBlocks component)
  const setUsedElements = useCallback((updater) => {
    setPerspectiveUsedElements(prev => {
      const newState = { ...prev };
      const currentUsed = newState[activePerspective] || [];
      
      if (typeof updater === 'function') {
        newState[activePerspective] = updater(currentUsed);
      } else {
        newState[activePerspective] = updater;
      }
      
      console.log(`=== PERSPECTIVE ${activePerspective.toUpperCase()}: Used elements set ===`, newState[activePerspective]);
      return newState;
    });
  }, [activePerspective]);

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
    
    // Log perspective change and current used elements
    console.log(`=== PERSPECTIVE CHANGED TO: ${activePerspective.toUpperCase()} ===`);
    console.log(`=== CURRENT USED ELEMENTS FOR ${activePerspective.toUpperCase()}:`, perspectiveUsedElements[activePerspective] || []);
    console.log('=== ALL PERSPECTIVE USED ELEMENTS:', perspectiveUsedElements);
  }, [activePerspective, perspectiveUsedElements]);

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
              <p className="text-gray-600 mb-6">
                Explore detailed architectural perspectives for your organization&apos;s digital factory implementation.
              </p>
              <p className="text-sm text-indigo-600 mt-1">
                Drag the Use Case Blocks from the left panel onto the Reference Architecture below
              </p>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* UC Blocks Panel - Takes up one column - Hidden for Final View */}
            {activePerspective !== 'finalView' && (
              <div className="lg:col-span-2 border-r border-gray-200 p-3 h-[calc(100vh-110px)] overflow-hidden" style={{ maxWidth: "250px" }}>
                <UCBlocks usedElements={usedElements} setUsedElements={setUsedElements} />
              </div>
            )}
            
            {/* Architecture Diagram - Takes up eleven columns (or full width for Final View) */}
            <div className={`${activePerspective !== 'finalView' ? 'lg:col-span-10' : 'lg:col-span-12'} h-[calc(100vh-110px)] bg-white overflow-hidden`}>
              {/* Perspective Tabs */}
              <PerspectiveTabs 
                activePerspective={activePerspective} 
                onPerspectiveChange={setActivePerspective} 
              />
              
              {/* Direct Diagram Content - No Second Tab Section */}
              <div className="h-[calc(100%-60px)] overflow-auto">
                {activePerspective === 'factory' && (
                  <ArchitectureDiagramSVG
                    selectedElement={selectedElement}
                    setSelectedElement={setSelectedElement}
                    onElementUsageChange={handleElementUsageChange}
                  />
                )}
                {activePerspective === 'product' && (
                  <ProductReferenceArchitecture 
                    selectedElement={selectedElement}
                    setSelectedElement={setSelectedElement}
                    onElementUsageChange={handleElementUsageChange}
                    departmentId={departmentId}
                  />
                )}
                {activePerspective === 'order' && (
                  <OrderReferenceArchitecture 
                    selectedElement={selectedElement}
                    setSelectedElement={setSelectedElement}
                    onElementUsageChange={handleElementUsageChange}
                    departmentId={departmentId}
                  />
                )}
                {activePerspective === 'manufacturing' && (
                  <ManufacturingReferenceArchitecture 
                    selectedElement={selectedElement}
                    setSelectedElement={setSelectedElement}
                    onElementUsageChange={handleElementUsageChange}
                    departmentId={departmentId}
                  />
                )}
                {activePerspective === 'finalView' && (
                  <FinalViewReferenceArchitecture 
                    selectedElement={selectedElement}
                    setSelectedElement={setSelectedElement}
                    departmentId={departmentId}
                  />
                )}
              </div>
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
                  Now that you&apos;ve explored the architecture goals, continue to Business Capabilities to understand implementation options.
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

export default ReferenceArchitecture;