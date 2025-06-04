import React, { useState, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useSession } from 'next-auth/react';

// Import other perspective components for previews
import FactoryReferenceArchitecture from './FactoryReferenceArchitecture';
import ProductReferenceArchitecture from './ProductReferenceArchitecture';
import OrderReferenceArchitecture from './OrderReferenceArchitecture';
import ManufacturingReferenceArchitecture from './ManufacturingReferenceArchitecture';

// Final View architecture elements based on the provided diagram
const architectureElements = [
  // Application Components (Top row)
  { 
    id: 'frontend-digitaler-fabrikzwilling', 
    name: 'Frontend Digitaler Fabrikzwilling', 
    type: 'Application Component', 
    description: 'Frontend application component',
    x: 200, y: 50, width: 400, height: 80
  },
  { 
    id: 'backend-digitaler-fabrikzwilling', 
    name: 'Backend Digitaler Fabrikzwilling', 
    type: 'Application Component', 
    description: 'Backend application component',
    x: 700, y: 50, width: 400, height: 80
  },
  
  // Perspective Architecture Diagrams (Second row)
  { 
    id: 'perspektive-fabrik-architecture', 
    name: 'Perspektive Fabrik\nArchitecture diagram', 
    type: 'Business Service', 
    description: 'Factory perspective architecture',
    x: 100, y: 200, width: 200, height: 80
  },
  { 
    id: 'perspektive-produkt-architecture', 
    name: 'Perspektive Produkt\nArchitecture diagram', 
    type: 'Business Service', 
    description: 'Product perspective architecture',
    x: 350, y: 200, width: 200, height: 80
  },
  { 
    id: 'perspektive-auftrag-architecture', 
    name: 'Perspektive Auftrag\nArchitecture diagram', 
    type: 'Business Service', 
    description: 'Order perspective architecture',
    x: 600, y: 200, width: 200, height: 80
  },
  { 
    id: 'perspektive-fertigungstechnologie-architecture', 
    name: 'Perspektive\nFertigungstechnologie\nArchitecture diagram', 
    type: 'Business Service', 
    description: 'Manufacturing technology perspective architecture',
    x: 850, y: 200, width: 200, height: 80
  },
  
  // Data Model Section (Large container)
  { 
    id: 'datenmodell-digitaler-fabrikzwilling', 
    name: 'Datenmodell Digitaler Fabrikzwilling ("Digital Thread")', 
    type: 'Data Object', 
    description: 'Digital twin data model',
    x: 200, y: 350, width: 800, height: 200
  },
  
  // Data Objects within the data model
  { 
    id: 'grafisches-modell-data', 
    name: 'Grafisches Modell', 
    type: 'Data Object', 
    description: 'Graphical model',
    x: 250, y: 450, width: 120, height: 60
  },
  { 
    id: 'strukturmodell-data', 
    name: 'Strukturmodell', 
    type: 'Data Object', 
    description: 'Structure model',
    x: 390, y: 450, width: 120, height: 60
  },
  { 
    id: 'materialfluss-data', 
    name: 'Materialfluss', 
    type: 'Data Object', 
    description: 'Material flow model',
    x: 530, y: 450, width: 120, height: 60
  },
  { 
    id: 'faehigkeitenmodell-data', 
    name: 'Fähigkeitenmodell', 
    type: 'Data Object', 
    description: 'Capabilities model',
    x: 670, y: 450, width: 120, height: 60
  },
  { 
    id: 'kennzahlenmodell-data', 
    name: 'Kennzahlenmodell', 
    type: 'Data Object', 
    description: 'KPI model',
    x: 810, y: 450, width: 120, height: 60
  },
  
  // Container elements (Bottom row)
  { 
    id: 'datenquellen-grafisches-modell', 
    name: 'Datenquellen: Grafisches Modell', 
    type: 'Container', 
    x: 80, y: 590, width: 300, height: 150
  },
  { 
    id: 'datenquellen-grafisches-datenmodell', 
    name: 'Datenquellen: Grafisches &\nDatenmodell', 
    type: 'Container', 
    x: 420, y: 590, width: 300, height: 150
  },
  { 
    id: 'datenquellen-datenmodell', 
    name: 'Datenquellen: Datenmodell', 
    type: 'Container', 
    x: 760, y: 590, width: 300, height: 150
  }
];

// Define relationships based on the provided diagram
const relationships = [
  // Serving relationships - Perspective diagrams to Frontend/Backend
  { 
    id: 'rel-1', 
    type: 'Serving', 
    source: 'perspektive-fabrik-architecture', 
    target: 'frontend-digitaler-fabrikzwilling',
    description: 'Factory perspective serves frontend'
  },
  { 
    id: 'rel-2', 
    type: 'Serving', 
    source: 'perspektive-produkt-architecture', 
    target: 'frontend-digitaler-fabrikzwilling',
    description: 'Product perspective serves frontend'
  },
  { 
    id: 'rel-3', 
    type: 'Serving', 
    source: 'perspektive-auftrag-architecture', 
    target: 'backend-digitaler-fabrikzwilling',
    description: 'Order perspective serves backend'
  },
  { 
    id: 'rel-4', 
    type: 'Serving', 
    source: 'perspektive-fertigungstechnologie-architecture', 
    target: 'frontend-digitaler-fabrikzwilling',
    description: 'Manufacturing technology perspective serves frontend'
  },
  { 
    id: 'rel-5', 
    type: 'Serving', 
    source: 'perspektive-fertigungstechnologie-architecture', 
    target: 'backend-digitaler-fabrikzwilling',
    description: 'Manufacturing technology perspective serves backend'
  },
  
  // Access relationships - Frontend/Backend to data models
  { 
    id: 'rel-6', 
    type: 'Access', 
    source: 'frontend-digitaler-fabrikzwilling', 
    target: 'grafisches-modell-data',
    description: 'Frontend accesses graphical model'
  },
  { 
    id: 'rel-7', 
    type: 'Access', 
    source: 'frontend-digitaler-fabrikzwilling', 
    target: 'strukturmodell-data',
    description: 'Frontend accesses structure model'
  },
  { 
    id: 'rel-8', 
    type: 'Access', 
    source: 'frontend-digitaler-fabrikzwilling', 
    target: 'materialfluss-data',
    description: 'Frontend accesses material flow'
  },
  { 
    id: 'rel-9', 
    type: 'Access', 
    source: 'frontend-digitaler-fabrikzwilling', 
    target: 'kennzahlenmodell-data',
    description: 'Frontend accesses KPI model'
  },
  { 
    id: 'rel-10', 
    type: 'Access', 
    source: 'backend-digitaler-fabrikzwilling', 
    target: 'strukturmodell-data',
    description: 'Backend accesses structure model'
  },
  { 
    id: 'rel-11', 
    type: 'Access', 
    source: 'backend-digitaler-fabrikzwilling', 
    target: 'materialfluss-data',
    description: 'Backend accesses material flow'
  },
  { 
    id: 'rel-12', 
    type: 'Access', 
    source: 'backend-digitaler-fabrikzwilling', 
    target: 'faehigkeitenmodell-data',
    description: 'Backend accesses capabilities model'
  },
  { 
    id: 'rel-13', 
    type: 'Access', 
    source: 'backend-digitaler-fabrikzwilling', 
    target: 'kennzahlenmodell-data',
    description: 'Backend accesses KPI model'
  }
];

const FinalViewReferenceArchitecture = ({ selectedElement, setSelectedElement, onElementUsageChange = () => {}, departmentId = 'operations' }) => {
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [highlightedConnections, setHighlightedConnections] = useState([]);
  const [containerSelections, setContainerSelections] = useState({
    'datenquellen-grafisches-modell': [],
    'datenquellen-grafisches-datenmodell': [],
    'datenquellen-datenmodell': []
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [selectedUseCaseBlock, setSelectedUseCaseBlock] = useState(null);
  const [highlightedLayers, setHighlightedLayers] = useState([]);
  const [useCaseConnections, setUseCaseConnections] = useState([]);
  const [hoveredPerspective, setHoveredPerspective] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  
  const { data: session } = useSession();
  const saveTimeoutRef = useRef(null);
  const lastUsedElementsRef = useRef([]);
  const elementPositions = useRef({}).current;

  // Constants for diagram dimensions and layout
  const DIAGRAM_WIDTH = 1200;
  const DIAGRAM_HEIGHT = 800;
  const BOX_WIDTH = 160;
  const BOX_HEIGHT = 50;

  // Color scheme - similar to Factory perspective
  const COLORS = {
    applicationComponent: "#CFFAFE", // Light cyan for application components
    businessService: "#FEF3C7", // Light amber for business services
    dataObject: "#DBEAFE", // Light blue for data objects
    container: "transparent", // Transparent for containers
    border: {
      applicationComponent: "#06B6D4", // Cyan
      businessService: "#F59E0B", // Amber
      dataObject: "#3B82F6", // Blue
      container: "#6B7280" // Gray
    },
    selected: "#EF4444" // Red for selection
  };

  // Final View Elements - positioned according to the provided diagram
  const elements = architectureElements;

  // Define elements by layers for highlighting
  const layerElements = {
    layer1: ['frontend-digitaler-fabrikzwilling', 'backend-digitaler-fabrikzwilling'],
    layer2: ['perspektive-fabrik-architecture', 'perspektive-produkt-architecture', 'perspektive-auftrag-architecture', 'perspektive-fertigungstechnologie-architecture'],
    layer3: ['grafisches-modell-data', 'strukturmodell-data', 'materialfluss-data', 'faehigkeitenmodell-data', 'kennzahlenmodell-data']
  };

  // Mapping of perspective blocks to their components and diagram types
  const perspectiveMapping = {
    'perspektive-fabrik-architecture': {
      component: FactoryReferenceArchitecture,
      diagramType: 'factory-perspective',
      title: 'Factory Perspective'
    },
    'perspektive-produkt-architecture': {
      component: ProductReferenceArchitecture,
      diagramType: 'product-perspective',
      title: 'Product Perspective'
    },
    'perspektive-auftrag-architecture': {
      component: OrderReferenceArchitecture,
      diagramType: 'order-perspective',
      title: 'Order Perspective'
    },
    'perspektive-fertigungstechnologie-architecture': {
      component: ManufacturingReferenceArchitecture,
      diagramType: 'manufacturing-perspective',
      title: 'Manufacturing Technology Perspective'
    }
  };

  // Load user's selections from database on component mount
  useEffect(() => {
    loadUserSelections();
  }, [session?.user?.email]);

  // Auto-save when changes are made (debounced)
  useEffect(() => {
    if (hasUnsavedChanges && session?.user?.email) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        saveUserSelections();
      }, 1000);
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, containerSelections, useCaseConnections, session?.user?.email]);

  // Cleanup effect for preview state
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.preview-container') && 
          !event.target.closest('[data-perspective-block]')) {
        setHoveredPerspective(null);
        setIsPreviewExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Load user's selections for Final View
  const loadUserSelections = async () => {
    if (!session?.user?.email) {
      try {
        const localData = localStorage.getItem('final-view-selections');
        if (localData) {
          const parsedData = JSON.parse(localData);
          if (parsedData.selections) setContainerSelections(parsedData.selections);
          if (parsedData.useCaseConnections) setUseCaseConnections(parsedData.useCaseConnections);
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
      return;
    }
    
    try {
      const response = await fetch('/api/diagram-selections');
      if (response.ok) {
        const data = await response.json();
        let finalViewData = null;
        
        if (data.diagramSelections?.length) {
          finalViewData = data.diagramSelections.find(s => s.diagramType === 'final-view');
        }
        
        if (finalViewData) {
          if (finalViewData.selections) setContainerSelections(finalViewData.selections);
          if (finalViewData.useCaseConnections) setUseCaseConnections(finalViewData.useCaseConnections);
        }
      }
    } catch (error) {
      console.error('Error loading selections:', error);
    }
  };

  // Save user's selections for Final View
  const saveUserSelections = async () => {
    if (!session?.user?.email) {
      try {
        const dataToSave = {
          selections: containerSelections,
          useCaseConnections: useCaseConnections,
          diagramType: 'final-view',
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('final-view-selections', JSON.stringify(dataToSave));
        setHasUnsavedChanges(false);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 2000);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 3000);
      }
      return;
    }
    
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      const payload = {
        selections: containerSelections,
        useCaseConnections: useCaseConnections,
        diagramType: 'final-view',
        perspective: 'final'
      };
      
      const response = await fetch('/api/diagram-selections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setHasUnsavedChanges(false);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (error) {
      console.error('Error saving selections:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Get colors for elements based on type
  const getElementColors = (type) => {
    switch (type) {
      case 'Application Component':
        return { fill: COLORS.applicationComponent, border: COLORS.border.applicationComponent };
      case 'Business Service':
        return { fill: COLORS.businessService, border: COLORS.border.businessService };
      case 'Data Object':
        return { fill: COLORS.dataObject, border: COLORS.border.dataObject };
      case 'Container':
        return { fill: COLORS.container, border: COLORS.border.container };
      default:
        return { fill: COLORS.dataObject, border: COLORS.border.dataObject };
    }
  };

  // Drag and drop functionality
  const addBlockToContainer = (containerId, blockData) => {
    setContainerSelections(prev => {
      const newSelections = { ...prev };
      
      // Remove block from all containers first
      Object.keys(newSelections).forEach(key => {
        newSelections[key] = newSelections[key] ? newSelections[key].filter(block => block.id !== blockData.id) : [];
      });
      
      // Ensure the target container exists and is an array
      if (!newSelections[containerId]) {
        newSelections[containerId] = [];
      }
      
      // Add block to target container
      newSelections[containerId] = [...newSelections[containerId], blockData];
      
      return newSelections;
    });
    setHasUnsavedChanges(true);
  };

  const removeBlockFromContainer = (containerId, blockId) => {
    setContainerSelections(prev => ({
      ...prev,
      [containerId]: prev[containerId].filter(block => block.id !== blockId)
    }));
    setHasUnsavedChanges(true);
  };

  // Use drop functionality
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['UC_BLOCK', 'ELEMENT_BLOCK'],
    drop: (item, monitor) => {
      const dropCoordinates = monitor.getClientOffset();
      if (!dropCoordinates) return;

      const svgElement = document.querySelector('#final-view-diagram-svg');
      if (!svgElement) return;

      const rect = svgElement.getBoundingClientRect();
      const svgX = ((dropCoordinates.x - rect.left) / rect.width) * DIAGRAM_WIDTH;
      const svgY = ((dropCoordinates.y - rect.top) / rect.height) * DIAGRAM_HEIGHT;

      let targetContainer = null;
      
      elements.forEach(element => {
        if (element.type === 'Container') {
          const { x, y, width, height } = element;
          if (svgX >= x && svgX <= x + width && svgY >= y && svgY <= y + height) {
            targetContainer = element.id;
          }
        }
      });

      if (targetContainer) {
        const blockData = {
          id: item.id,
          name: item.name,
          type: item.type || 'Business Process'
        };
        addBlockToContainer(targetContainer, blockData);
      }

      return { dropped: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Create element position map for connections
  const getElementPosition = (elementId) => {
    const element = elements.find(el => el.id === elementId);
    
    if (element) {
      const width = element.width || BOX_WIDTH;
      const height = element.height || BOX_HEIGHT;
      return { 
        x: element.x + width / 2,
        y: element.y + height / 2,
        left: element.x,
        right: element.x + width,
        top: element.y,
        bottom: element.y + height
      };
    }
    
    return null;
  };

  // Handle clicking an element
  const handleElementClick = (element, event) => {
    event.stopPropagation();
    
    if (highlightedElement === element) {
      setHighlightedElement(null);
      setHighlightedConnections([]);
      setSelectedElement(null);
    } else {
      const relatedConnections = relationships.filter(rel => 
        rel.source === element || rel.target === element
      );
      
      setHighlightedElement(element);
      setHighlightedConnections(relatedConnections);
      setSelectedElement(element);
    }
  };

  // Handle clicking the background
  const handleBackgroundClick = () => {
    setHighlightedElement(null);
    setHighlightedConnections([]);
    setSelectedElement(null);
    setSelectedUseCaseBlock(null);
    setHighlightedLayers([]);
  };

  // Handle mouse enter for perspective blocks
  const handlePerspectiveMouseEnter = (elementId, event) => {
    if (perspectiveMapping[elementId]) {
      // Get the SVG container position
      const svgContainer = document.querySelector('#final-view-diagram-svg');
      const containerRect = svgContainer.getBoundingClientRect();
      
      // Get the element position within the SVG
      const element = elements.find(el => el.id === elementId);
      if (element) {
        const elementCenterX = containerRect.left + (element.x + element.width / 2);
        const elementCenterY = containerRect.top + (element.y + element.height / 2);
        
        // Position preview to the right if there's space, otherwise to the left
        const viewportWidth = window.innerWidth;
        const previewWidth = isPreviewExpanded ? 800 : 600;
        const previewHeight = isPreviewExpanded ? 600 : 400;
        
        let x = elementCenterX + 250; // Default to right
        if (x + previewWidth > viewportWidth - 20) {
          x = elementCenterX - previewWidth - 250; // Move to left
        }
        
        let y = elementCenterY - previewHeight / 2;
        if (y < 20) y = 20;
        if (y + previewHeight > window.innerHeight - 20) {
          y = window.innerHeight - previewHeight - 20;
        }
        
        setPreviewPosition({ x, y });
        setHoveredPerspective(elementId);
      }
    }
  };

  // Handle mouse leave for perspective blocks
  const handlePerspectiveMouseLeave = () => {
    // Add a small delay to prevent flickering when moving between elements
    setTimeout(() => {
      setHoveredPerspective(null);
      setIsPreviewExpanded(false);
    }, 200);
  };

  // Handle preview mouse enter to keep it visible
  const handlePreviewMouseEnter = () => {
    // Keep preview visible when hovering over it
  };

  // Handle preview mouse leave
  const handlePreviewMouseLeave = () => {
    setHoveredPerspective(null);
    setIsPreviewExpanded(false);
  };

  // Preview component for perspective diagrams
  const DiagramPreview = ({ perspectiveId }) => {
    const perspective = perspectiveMapping[perspectiveId];
    if (!perspective) return null;

    const Component = perspective.component;
    const previewWidth = isPreviewExpanded ? 800 : 600;
    const previewHeight = isPreviewExpanded ? 600 : 400;
    const scale = isPreviewExpanded ? 0.65 : 0.45;
  
  return (
      <div 
        className="preview-container fixed z-50 bg-white border-2 border-gray-300 rounded-lg shadow-2xl"
        style={{
          left: previewPosition.x,
          top: previewPosition.y,
          width: previewWidth + 'px',
          height: previewHeight + 'px'
        }}
        onMouseEnter={handlePreviewMouseEnter}
        onMouseLeave={handlePreviewMouseLeave}
      >
        {/* Header with title and controls */}
        <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">{perspective.title}</h3>
            <div className="text-xs text-gray-500">Real-time Preview</div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
              className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
            >
              {isPreviewExpanded ? 'Collapse' : 'Expand'}
            </button>
            <button
              onClick={() => {
                setHoveredPerspective(null);
                setIsPreviewExpanded(false);
              }}
              className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Diagram container */}
        <div 
          className="overflow-hidden bg-gray-50"
          style={{ 
            width: '100%', 
            height: 'calc(100% - 60px)',
            position: 'relative'
          }}
        >
          <div 
            style={{ 
              width: '1200px', 
              height: '800px',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              pointerEvents: 'none'
            }}
          >
            <Component
              key={`preview-${perspectiveId}-${Date.now()}`} // Force re-render
              selectedElement={null}
              setSelectedElement={() => {}}
              onElementUsageChange={() => {}}
              departmentId="operations"
            />
          </div>
        </div>
      </div>
    );
  };

  // Box component
  const Box = ({ element }) => {
    const { id, name, type, x, y, width = BOX_WIDTH, height = BOX_HEIGHT } = element;
    
    elementPositions[id] = {
      x: x + width / 2,
      y: y + height / 2,
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
      width: width,
      height: height
    };

    const isRegularHighlight = !highlightedElement || 
      id === highlightedElement || 
      highlightedConnections.some(conn => conn.source === id || conn.target === id);
    
    const colors = getElementColors(type);

    let strokeDasharray = '';
    if (type === 'Container') {
      strokeDasharray = '5,5';
    }

    // Special handling for the large data model container
    const isDataModel = id === 'datenmodell-digitaler-fabrikzwilling';
    const textY = isDataModel ? 25 : (type === 'Container' ? 20 : height/2);
    const isPerspectiveBlock = perspectiveMapping[id];

    return (
      <g 
        transform={`translate(${x}, ${y})`}
        onClick={(e) => handleElementClick(id, e)}
        className={`cursor-pointer ${isPerspectiveBlock ? 'hover:opacity-90' : ''}`}
        id={id}
        opacity={isRegularHighlight ? 1 : 0.4}
        style={isPerspectiveBlock ? { cursor: 'pointer' } : {}}
        data-perspective-block={isPerspectiveBlock ? 'true' : undefined}
            >
              <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="6"
          ry="6"
          fill={colors.fill}
          stroke={highlightedElement === id ? COLORS.selected : colors.border}
          strokeWidth={highlightedElement === id ? "2" : "1"}
          strokeDasharray={strokeDasharray}
          onMouseEnter={isPerspectiveBlock ? (e) => handlePerspectiveMouseEnter(id, e) : undefined}
          onMouseLeave={isPerspectiveBlock ? handlePerspectiveMouseLeave : undefined}
        />
        <text 
          x={width/2} 
          y={textY} 
          textAnchor="middle" 
          dominantBaseline="middle"
          fontSize={isDataModel ? "14" : (type === 'Container' ? "12" : "11")}
          fontWeight={isDataModel ? "700" : (type === 'Container' ? "600" : "500")}
          fill="#000"
          className="select-none"
        >
          {name.split('\n').map((line, i) => (
            <tspan key={i} x={width/2} dy={i === 0 ? 0 : 14}>{line}</tspan>
          ))}
        </text>
        {type && type !== 'Container' && !isDataModel && type !== 'Business Service' && (
          <text 
            x={width/2} 
            y={height - 8} 
            textAnchor="middle" 
            fontSize="9"
            fill="#666"
            className="select-none"
          >
            {type}
          </text>
        )}
        
        {/* Render dropped blocks in containers */}
        {type === 'Container' && (
          <g>
            {containerSelections[id]?.map((block, index) => {
              const blockHeight = 20;
              const blockSpacing = 5;
              const totalBlockHeight = blockHeight + blockSpacing;
              const startY = 40;
              const availableHeight = height - startY - 10;
              const blocksPerColumn = Math.floor(availableHeight / totalBlockHeight);
              
              const columnIndex = Math.floor(index / blocksPerColumn);
              const rowIndex = index % blocksPerColumn;
              
              const blockWidth = 120;
              const columnSpacing = 10;
              const totalColumnWidth = blockWidth + columnSpacing;
              
              const x = 10 + (columnIndex * totalColumnWidth);
              const y = startY + (rowIndex * totalBlockHeight);
              
              return (
                <g key={block.id} transform={`translate(${x}, ${y})`}>
                  <rect
                    x="0"
                    y="0"
                    width={blockWidth}
                    height={blockHeight}
                    rx="3"
                    fill="#DBEAFE"
                    stroke="#3B82F6"
                    strokeWidth="1"
                    className="cursor-pointer"
                  />
                  <text
                    x={blockWidth/2}
                    y={blockHeight/2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="9"
                    fill="#1E40AF"
                    className="select-none cursor-pointer"
                  >
                    {block.name.length > 15 ? `${block.name.substring(0, 15)}...` : block.name}
                  </text>
                  <circle
                    cx={blockWidth - 10}
                    cy={blockHeight/2}
                    r="6"
                    fill="#EF4444"
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBlockFromContainer(id, block.id);
                    }}
              />
              <text
                    x={blockWidth - 10}
                    y={blockHeight/2}
                textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="8"
                    fill="white"
                    className="select-none cursor-pointer"
                  >
                    ×
              </text>
            </g>
              );
            })}
          </g>
        )}
      </g>
    );
  };

  // Arrow markers for connections
  const ArrowMarkers = () => (
    <defs>
      <marker
        id="arrow-serving"
        viewBox="0 0 10 10"
        refX="8"
        refY="3"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
      >
        <path d="M0,0 L0,6 L9,3 z" fill="#F59E0B" />
      </marker>
      <marker
        id="arrow-access"
        viewBox="0 0 10 10"
        refX="8"
        refY="3"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
      >
        <path d="M0,0 L0,6 L9,3 z" fill="#06B6D4" />
      </marker>
    </defs>
  );

  return (
    <>
      {/* Save Status Indicator */}
      {(isSaving || saveStatus) && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium ${
            isSaving 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : saveStatus === 'saved'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {isSaving ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Error saving'}
          </div>
        </div>
      )}

      <div 
        className="w-full h-full overflow-auto" 
        ref={drop}
        style={{
          background: isOver ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
          transition: 'background-color 0.2s ease'
        }}
      >
        <svg
          id="final-view-diagram-svg"
          width="100%"
          height={DIAGRAM_HEIGHT}
          viewBox={`0 0 ${DIAGRAM_WIDTH} ${DIAGRAM_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          onClick={handleBackgroundClick}
          className="w-full bg-white shadow-sm rounded-lg p-2"
        >
          <ArrowMarkers />

          {/* Render all elements */}
          {elements.map((element) => (
            <Box key={element.id} element={element} />
          ))}

          {/* Render all relationships */}
          {relationships.map((relationship, index) => {
            const fromPos = getElementPosition(relationship.source);
            const toPos = getElementPosition(relationship.target);
            
            if (!fromPos || !toPos) return null;

            let strokeColor = relationship.type === 'Serving' ? '#F59E0B' : '#06B6D4';
            let strokeDasharray = relationship.type === 'Access' ? '2,2' : '';
            let markerEnd = relationship.type === 'Serving' ? 'url(#arrow-serving)' : 'url(#arrow-access)';

            const isHighlighted = !highlightedElement || 
              highlightedConnections.some(conn => 
                (conn.source === relationship.source && conn.target === relationship.target)
              );

            // Improved connection point calculation for cleaner alignment
            let startX, startY, endX, endY;
            
            // Calculate the best connection points based on relative positions
            const deltaX = toPos.x - fromPos.x;
            const deltaY = toPos.y - fromPos.y;
            
            // Determine if this should be primarily horizontal or vertical connection
            const isHorizontalPrimary = Math.abs(deltaX) > Math.abs(deltaY);
            
            if (isHorizontalPrimary) {
              // Horizontal connection - connect from side to side
              if (deltaX > 0) {
                // Target is to the right of source
                startX = fromPos.right;
                startY = fromPos.y;
                endX = toPos.left;
                endY = toPos.y;
              } else {
                // Target is to the left of source
                startX = fromPos.left;
                startY = fromPos.y;
                endX = toPos.right;
                endY = toPos.y;
              }
            } else {
              // Vertical connection - connect from top/bottom
              if (deltaY > 0) {
                // Target is below source
                startX = fromPos.x;
                startY = fromPos.bottom;
                endX = toPos.x;
                endY = toPos.top;
              } else {
                // Target is above source
                startX = fromPos.x;
                startY = fromPos.top;
                endX = toPos.x;
                endY = toPos.bottom;
              }
            }
            
            // Special adjustments for specific connection types
            if (relationship.type === 'Serving') {
              // For serving relationships, prefer connecting from bottom of source to top of target
              if (deltaY > 0) {
                startX = fromPos.x;
                startY = fromPos.bottom;
                endX = toPos.x;
                endY = toPos.top;
              }
            }
            
            // Create path - use straight line for cleaner appearance
            const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
            
            return (
              <path
                key={`${relationship.source}-${relationship.target}-${index}`}
                d={pathData}
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeDasharray={strokeDasharray}
                fill="none"
                markerEnd={markerEnd}
                opacity={isHighlighted ? 1 : 0.3}
              />
            );
          })}
        </svg>
      </div>

      {/* Preview component for perspective diagrams */}
      {hoveredPerspective && (
        <DiagramPreview perspectiveId={hoveredPerspective} />
      )}
    </>
  );
};

// Expose architectureElements and relationships as static properties
FinalViewReferenceArchitecture.architectureElements = architectureElements;
FinalViewReferenceArchitecture.relationships = relationships;

export default FinalViewReferenceArchitecture; 