import React, { useState, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useSession } from 'next-auth/react';

// Import other perspective components for previews
import ArchitectureDiagramSVG from './ArchitectureDiagramSVG';
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
  
  // Perspective Architecture Diagrams (Second row) - Enhanced with click to view
  { 
    id: 'perspektive-fabrik-architecture', 
    name: 'Perspektive Fabrik\nArchitecture diagram', 
    type: 'Business Service', 
    description: 'Factory perspective architecture',
    hasInfoIcon: true,
    x: 100, y: 200, width: 200, height: 80
  },
  { 
    id: 'perspektive-produkt-architecture', 
    name: 'Perspektive Produkt\nArchitecture diagram', 
    type: 'Business Service', 
    description: 'Product perspective architecture',
    hasInfoIcon: true,
    x: 350, y: 200, width: 200, height: 80
  },
  { 
    id: 'perspektive-auftrag-architecture', 
    name: 'Perspektive Auftrag\nArchitecture diagram', 
    type: 'Business Service', 
    description: 'Order perspective architecture',
    hasInfoIcon: true,
    x: 600, y: 200, width: 200, height: 80
  },
  { 
    id: 'perspektive-fertigungstechnologie-architecture', 
    name: 'Perspektive\nFertigungstechnologie\nArchitecture diagram', 
    type: 'Business Service', 
    description: 'Manufacturing technology perspective architecture',
    hasInfoIcon: true,
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
  const { data: session } = useSession();
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [highlightedConnections, setHighlightedConnections] = useState([]);
  const [containerSelections, setContainerSelections] = useState({
    'datenquellen-grafisches-modell': [],
    'datenquellen-grafisches-datenmodell': [],
    'datenquellen-datenmodell': []
  });
  // New state to store aggregated blocks from all diagrams
  const [allDiagramBlocks, setAllDiagramBlocks] = useState({
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
  
  // Enhanced state for perspective layer animations and tooltips
  const [isNewUserVisit, setIsNewUserVisit] = useState(true);
  const [animatingElements, setAnimatingElements] = useState(new Set());
  const [perspectiveLayerReady, setPerspectiveLayerReady] = useState(false);

  const saveTimeoutRef = useRef(null);
  const lastUsedElementsRef = useRef([]);
  const elementPositions = useRef({}).current;
  const previewCloseTimerRef = useRef(null);

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
      component: ArchitectureDiagramSVG,
      diagramType: 'reference-architecture',
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

  // Load selections on component mount and session change
  useEffect(() => {
    if (session?.user?.email) {
      loadAllDiagramSelections(); // Load from all diagrams instead of just final view
    }
  }, [session?.user?.email]);

  // Enhanced effects for perspective layer animations and new user experience
  useEffect(() => {
    // Check if user has visited this view before
    const hasVisitedBefore = localStorage.getItem('finalViewVisited');
    if (!hasVisitedBefore) {
      setIsNewUserVisit(true);
      localStorage.setItem('finalViewVisited', 'true');
      
      // Trigger perspective layer animations after initial render
      const timer = setTimeout(() => {
        setPerspectiveLayerReady(true);
        triggerPerspectiveLayerAnimation();
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setIsNewUserVisit(false);
      setPerspectiveLayerReady(true);
    }
  }, []);

  // Animation sequence for perspective architecture blocks
  const triggerPerspectiveLayerAnimation = () => {
    const perspectiveIds = [
      'perspektive-fabrik-architecture',
      'perspektive-produkt-architecture', 
      'perspektive-auftrag-architecture',
      'perspektive-fertigungstechnologie-architecture'
    ];

    perspectiveIds.forEach((id, index) => {
      setTimeout(() => {
        setAnimatingElements(prev => new Set([...prev, id]));
        
        // Remove animation class after animation completes
        setTimeout(() => {
          setAnimatingElements(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }, 1000);
      }, index * 200); // Stagger animations
    });
  };

  // Handle green button click to show diagram
  const handleDiagramButtonClick = (elementId, event) => {
    event.stopPropagation();
    
    if (perspectiveMapping[elementId]) {
      // If already showing this perspective, close it
      if (hoveredPerspective === elementId) {
        setHoveredPerspective(null);
        setIsPreviewExpanded(false);
        return;
      }

      // Get the SVG container position
      const svgContainer = document.querySelector('#final-view-diagram-svg');
      const containerRect = svgContainer.getBoundingClientRect();
      
      // Get the element position within the SVG
      const element = elements.find(el => el.id === elementId);
      if (element) {
        const elementCenterX = containerRect.left + (element.x + element.width / 2);
        const elementCenterY = containerRect.top + (element.y + element.height / 2);
        
        // Position preview to avoid mouse conflicts
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const previewWidth = isPreviewExpanded ? 800 : 600;
        const previewHeight = isPreviewExpanded ? 600 : 400;
        
        // Calculate position with more spacing to avoid mouse conflicts
        let x = elementCenterX + 300; // Increased spacing
        if (x + previewWidth > viewportWidth - 40) {
          x = elementCenterX - previewWidth - 300; // Move to left with more space
        }
        
        let y = elementCenterY - previewHeight / 2;
        if (y < 40) y = 40;
        if (y + previewHeight > viewportHeight - 40) {
          y = viewportHeight - previewHeight - 40;
        }
        
        setPreviewPosition({ x, y });
        setHoveredPerspective(elementId);
        setIsPreviewExpanded(false); // Start with collapsed view
      }
    }
  };

  // Auto-save when changes are made (debounced)
  useEffect(() => {
    if (hasUnsavedChanges && session?.user?.email) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        saveUserSelections();
      }, 1000); // Save after 1 second of inactivity
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, containerSelections, useCaseConnections, session?.user?.email]);

  // Reset diagram function
  const resetDiagram = () => {
    setHighlightedElement(null);
    setHighlightedConnections([]);
    setSelectedElement(null);
    setContainerSelections({
      'datenquellen-grafisches-modell': [],
      'datenquellen-grafisches-datenmodell': [],
      'datenquellen-datenmodell': []
    });
    setUseCaseConnections([]);
    setSelectedUseCaseBlock(null);
    setHighlightedLayers([]);
    setHasUnsavedChanges(false);
    
    // Notify parent about usage changes
    if (onElementUsageChange) {
      onElementUsageChange([]);
    }

    // Save the cleared state to database to prevent old connections from reappearing
    if (session?.user?.email) {
      setTimeout(() => {
        saveUserSelections();
        // Reload data from all diagrams after saving cleared state
        setTimeout(() => {
          loadAllDiagramSelections();
        }, 500);
      }, 100); // Small delay to ensure state is updated
    } else {
      // If no session, just reload from all diagrams
      setTimeout(() => {
        loadAllDiagramSelections();
      }, 100);
    }
  };

  // Listen for reset events from UCBlocks component
  useEffect(() => {
    const handleReset = () => resetDiagram();
    window.addEventListener('resetFinalViewArchitectureDiagram', handleReset);
    
    return () => {
      window.removeEventListener('resetFinalViewArchitectureDiagram', handleReset);
      // Clean up any pending timeouts
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (previewCloseTimerRef.current) {
        clearTimeout(previewCloseTimerRef.current);
      }
    };
  }, [session?.user?.email]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (previewCloseTimerRef.current) {
        clearTimeout(previewCloseTimerRef.current);
      }
    };
  }, []);

  // Cleanup effect for preview state
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if clicking outside both the preview and the perspective blocks
      const isClickingPreview = event.target.closest('.preview-container');
      const isClickingPerspectiveBlock = event.target.closest('[data-perspective-block]');
      
      if (!isClickingPreview && !isClickingPerspectiveBlock) {
        setHoveredPerspective(null);
        setIsPreviewExpanded(false);
      }
    };

    // Add event listener with passive option for better performance
    document.addEventListener('click', handleClickOutside, { passive: true });
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Enhanced load function to gather blocks from all 4 diagrams
  const loadAllDiagramSelections = async () => {
    if (!session?.user?.email) {
      return;
    }
    
    try {
      console.log('🔄 Starting refresh from all diagrams...');
      
      const diagramTypes = [
        'reference-architecture', // Factory perspective uses this instead of 'factory-perspective'
        'product-perspective', 
        'order-perspective',
        'manufacturing-perspective',
        'final-view'
      ];
      
      // Load selections from all diagrams in parallel
      const responses = await Promise.all(
        diagramTypes.map(async diagramType => {
          try {
            const response = await fetch(`/api/diagram-selections?diagramType=${diagramType}`);
            if (response.ok) {
              const data = await response.json();
              console.log(`📊 ${diagramType}:`, data.selections ? Object.values(data.selections).reduce((total, arr) => total + arr.length, 0) : 0, 'blocks');
              return { diagramType, data };
            } else {
              console.log(`❌ Failed to load ${diagramType}: ${response.status}`);
              return { diagramType, data: null };
            }
          } catch (err) {
            console.error(`❌ Error loading ${diagramType}:`, err);
            return { diagramType, data: null };
          }
        })
      );
      
      // Initialize fresh aggregation objects
      const aggregatedSelections = {
        'datenquellen-grafisches-modell': [],
        'datenquellen-grafisches-datenmodell': [],
        'datenquellen-datenmodell': []
      };
      
      let finalViewSelections = {
        'datenquellen-grafisches-modell': [],
        'datenquellen-grafisches-datenmodell': [],
        'datenquellen-datenmodell': []
      };
      
      let finalViewConnections = [];
      
      // Process each response
      responses.forEach(({ diagramType, data }) => {
        if (data && data.selections) {
          // Handle final view separately to maintain its own state
          if (diagramType === 'final-view') {
            finalViewSelections = data.selections || finalViewSelections;
            finalViewConnections = data.useCaseConnections || [];
            console.log('📋 Final View blocks:', Object.values(finalViewSelections).reduce((total, arr) => total + arr.length, 0));
          } else {
            // Aggregate blocks from other diagrams
            Object.keys(data.selections).forEach(containerId => {
              if (aggregatedSelections[containerId]) {
                const newBlocks = data.selections[containerId] || [];
                console.log(`🔍 Processing ${diagramType} container ${containerId}: ${newBlocks.length} blocks`);
                
                // Add blocks that don't already exist (based on ID)
                newBlocks.forEach(block => {
                  if (!aggregatedSelections[containerId].some(existing => existing.id === block.id)) {
                    // Map diagramType to proper source name for display
                    let sourcesDiagram = diagramType;
                    if (diagramType === 'reference-architecture') {
                      sourcesDiagram = 'factory-perspective';
                    }
                    
                    console.log(`✅ Adding block "${block.name}" from ${sourcesDiagram} to ${containerId}`);
                    aggregatedSelections[containerId].push({
                      ...block,
                      sourcesDiagram: sourcesDiagram
                    });
                  } else {
                    console.log(`⚠️ Skipping duplicate block "${block.name}" from ${diagramType}`);
                  }
                });
              }
            });
          }
        }
      });
      
      // Create combined selections with proper deduplication
      const combinedSelections = {
        'datenquellen-grafisches-modell': [],
        'datenquellen-grafisches-datenmodell': [],
        'datenquellen-datenmodell': []
      };
      
      Object.keys(combinedSelections).forEach(containerId => {
        const finalViewBlocks = finalViewSelections[containerId] || [];
        const aggregatedBlocks = aggregatedSelections[containerId] || [];
        
        // Start with final view blocks
        combinedSelections[containerId] = [...finalViewBlocks];
        
        // Add aggregated blocks that don't already exist
        aggregatedBlocks.forEach(block => {
          if (!combinedSelections[containerId].some(existing => existing.id === block.id)) {
            combinedSelections[containerId].push(block);
          }
        });
      });
      
      // Log final counts for debugging
      const finalViewCount = Object.values(finalViewSelections).reduce((total, arr) => total + arr.length, 0);
      const aggregatedCount = Object.values(aggregatedSelections).reduce((total, arr) => total + arr.length, 0);
      const combinedCount = Object.values(combinedSelections).reduce((total, arr) => total + arr.length, 0);
      
      console.log('📊 Refresh Results:', {
        finalView: finalViewCount,
        aggregated: aggregatedCount,
        combined: combinedCount
      });
      
      // Update states
      setContainerSelections(finalViewSelections);
      setAllDiagramBlocks(combinedSelections);
      setUseCaseConnections(finalViewConnections);
      
      console.log('✅ Refresh completed successfully');
      
    } catch (error) {
      console.error('❌ Error loading all diagram selections:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Load user's selections for Final View (keep original function for saving)
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
        setTimeout(() => setSaveStatus(null), 5000);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 5000);
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
        setTimeout(() => setSaveStatus(null), 5000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 5000);
      }
    } catch (error) {
      console.error('Network error:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 5000);
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

  // Remove a block from a container
  const removeBlockFromContainer = (containerId, blockId) => {
    setContainerSelections(prev => ({
      ...prev,
      [containerId]: prev[containerId].filter(block => block.id !== blockId)
    }));
    
    // Also remove any use case connections associated with this block
    setUseCaseConnections(prev => 
      prev.filter(conn => !(conn.blockId === blockId && conn.containerId === containerId))
    );
    
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

  // Arrow markers for connections
  const ArrowMarkers = () => (
    <defs>
      <marker
        id="arrow-serving"
        viewBox="0 0 10 10"
        refX="9"
        refY="3"
        markerUnits="strokeWidth"
        markerWidth="4"
        markerHeight="3"
        orient="auto"
      >
        <path d="M0,0 L0,6 L9,3 z" fill="#F59E0B" />
      </marker>
      <marker
        id="arrow-access"
        viewBox="0 0 10 10"
        refX="9"
        refY="3"
        markerUnits="strokeWidth"
        markerWidth="4"
        markerHeight="3"
        orient="auto"
      >
        <path d="M0,0 L0,6 L9,3 z" fill="#06B6D4" />
      </marker>
      <marker
        id="arrow-use-case"
        viewBox="0 0 10 10"
        refX="9"
        refY="3"
        markerUnits="strokeWidth"
        markerWidth="4"
        markerHeight="3"
        orient="auto"
      >
        <path d="M0,0 L0,6 L9,3 z" fill="#8B5CF6" />
      </marker>
      
      {/* Glow filters for animated source connections */}
      <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  );

  // Create element position map for connections
  const getElementPosition = (elementId) => {
    const element = elements.find(el => el.id === elementId);
    
    if (element) {
      const width = element.width || BOX_WIDTH;
      const height = element.height || BOX_HEIGHT;
      const position = { 
        x: element.x + width / 2,
        y: element.y + height / 2,
        left: element.x,
        right: element.x + width,
        top: element.y,
        bottom: element.y + height
      };
      
      // Store in elementPositions ref for use case connections
      elementPositions[elementId] = position;
      
      return position;
    }
    
    return null;
  };

  // Handle clicking an element
  const handleElementClick = (element, event) => {
    event.stopPropagation();
    
    // Check if this is a perspective block - if so, show diagram
    const isPerspectiveBlock = perspectiveMapping[element];
    if (isPerspectiveBlock) {
      handleDiagramButtonClick(element, event);
      return;
    }
    
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
    // Close preview when clicking background
    setHoveredPerspective(null);
    setIsPreviewExpanded(false);
  };

  // Handle preview mouse enter to keep it visible
  const handlePreviewMouseEnter = () => {
    // Clear any pending close timer to keep preview visible
    if (previewCloseTimerRef.current) {
      clearTimeout(previewCloseTimerRef.current);
      previewCloseTimerRef.current = null;
    }
  };

  // Handle preview mouse leave with delay to prevent flickering
  const handlePreviewMouseLeave = () => {
    // Clear any existing timer first
    if (previewCloseTimerRef.current) {
      clearTimeout(previewCloseTimerRef.current);
    }
    
    // Add delay to prevent flickering when moving between preview elements
    previewCloseTimerRef.current = setTimeout(() => {
      setHoveredPerspective(null);
      setIsPreviewExpanded(false);
      previewCloseTimerRef.current = null;
    }, 300);
  };

  // Handle preview close button click
  const handlePreviewClose = (event) => {
    event.stopPropagation();
    
    // Clear any pending timer
    if (previewCloseTimerRef.current) {
      clearTimeout(previewCloseTimerRef.current);
      previewCloseTimerRef.current = null;
    }
    
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
          left: `${previewPosition.x}px`,
          top: `${previewPosition.y}px`,
          width: previewWidth + 'px',
          height: previewHeight + 'px',
          pointerEvents: 'auto' // Ensure pointer events work properly
        }}
        onMouseEnter={handlePreviewMouseEnter}
        onMouseLeave={handlePreviewMouseLeave}
        onClick={(e) => e.stopPropagation()} // Prevent background click handler
      >
        {/* Header with title and controls */}
        <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">{perspective.title}</h3>
            <div className="text-xs text-gray-500">Real-time Preview</div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsPreviewExpanded(!isPreviewExpanded);
              }}
              className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
            >
              {isPreviewExpanded ? 'Collapse' : 'Expand'}
            </button>
            <button
              onClick={handlePreviewClose}
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
              pointerEvents: 'none' // Disable interactions with the preview diagram
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
    
    // Enhanced perspective block handling
    const isPerspectiveArchitecture = element.hasInfoIcon;
    const isAnimating = animatingElements.has(id);

    return (
      <g 
        transform={`translate(${x}, ${y})`}
        onClick={(e) => handleElementClick(id, e)}
        className="cursor-pointer"
        id={id}
        opacity={isRegularHighlight ? 1 : 0.4}
        data-perspective-block={isPerspectiveBlock ? 'true' : undefined}
      >
        {/* Main rectangle with enhanced styling for perspective blocks */}
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
          className={`${isPerspectiveArchitecture ? 'transition-all duration-500 ease-in-out' : ''} ${
            isAnimating ? 'animate-perspective-entrance' : ''
          }`}
          style={{
            filter: isPerspectiveArchitecture ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' : undefined,
            transformOrigin: 'center center'
          }}
        />

        {/* Enhanced glow effect for new user animations */}
        {isAnimating && (
          <rect
            x="-2"
            y="-2"
            width={width + 4}
            height={height + 4}
            rx="8"
            ry="8"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            opacity="0.6"
            className="animate-pulse"
          />
        )}

        {/* Text content */}
        <text 
          x={width/2} 
          y={textY} 
          textAnchor="middle" 
          dominantBaseline="middle"
          fontSize={isDataModel ? "14" : (type === 'Container' ? "12" : "11")}
          fontWeight={isDataModel ? "700" : (isPerspectiveArchitecture ? "700" : (type === 'Container' ? "600" : "500"))}
          fill="#000"
          className="select-none"
        >
          {name.split('\n').map((line, i) => (
            <tspan key={i} x={width/2} dy={i === 0 ? 0 : 14}>{line}</tspan>
          ))}
        </text>

        {/* Click instruction text for perspective architecture blocks */}
        {isPerspectiveArchitecture && perspectiveLayerReady && (
          <text
            x={width/2}
            y={15}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fill="#DC2626"
            fontWeight="600"
            className="select-none pointer-events-none animate-green-button-entrance"
            style={{
              animationDelay: isNewUserVisit ? '1.2s' : '0s'
            }}
          >
            Click to view diagram
          </text>
        )}

        {/* Type label */}
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
        
        {/* Render dropped blocks in containers - now showing blocks from all diagrams */}
        {type === 'Container' && allDiagramBlocks[id] && allDiagramBlocks[id].length > 0 && (
          <g>
            {allDiagramBlocks[id].map((block, index) => {
              // Calculate multi-column layout
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
              
              const blockX = 10 + (columnIndex * totalColumnWidth);
              const blockY = startY + (rowIndex * totalBlockHeight);
              
              // Determine block color based on source diagram
              let blockColor = '#1E40AF'; // Default bright blue (Final View)
              if (block.sourcesDiagram === 'factory-perspective') {
                blockColor = '#059669'; // Bright green
              } else if (block.sourcesDiagram === 'product-perspective') {
                blockColor = '#D97706'; // Bright orange
              } else if (block.sourcesDiagram === 'order-perspective') {
                blockColor = '#7C3AED'; // Bright purple  
              } else if (block.sourcesDiagram === 'manufacturing-perspective') {
                blockColor = '#DC2626'; // Bright red
              }
              
              // Check if this block is from final view (editable)
              const isFromFinalView = containerSelections[id]?.some(fvBlock => fvBlock.id === block.id);
              
              return (
                <g key={`${block.id}-${index}`}>
                  <rect
                    x={blockX}
                    y={blockY}
                    width={blockWidth}
                    height={blockHeight}
                    rx="3"
                    ry="3"
                    fill={blockColor}
                    opacity={isFromFinalView ? 1 : 0.9}
                    stroke="#fff"
                    strokeWidth="1.5"
                    className="cursor-pointer"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFromFinalView) {
                        handleUseCaseBlockClick(block, id);
                      }
                    }}
                  />
                  <text
                    x={blockX + blockWidth/2}
                    y={blockY + blockHeight/2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="9"
                    fill="white"
                    fontWeight="600"
                    className="select-none"
                    style={{ 
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                    }}
                  >
                    {block.name.length > 14 ? `${block.name.substring(0, 14)}...` : block.name}
                  </text>
                  
                  {/* Show remove button only for final view blocks */}
                  {isFromFinalView && (
                    <circle
                      cx={blockX + blockWidth - 10}
                      cy={blockY + 10}
                      r="8"
                      fill="rgba(239, 68, 68, 0.9)"
                      stroke="#fff"
                      strokeWidth="1"
                      className="cursor-pointer"
                      style={{
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBlockFromContainer(id, block.id);
                      }}
                    />
                  )}
                  
                  {isFromFinalView && (
                    <text
                      x={blockX + blockWidth - 10}
                      y={blockY + 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="10"
                      fill="white"
                      fontWeight="700"
                      className="select-none cursor-pointer"
                      style={{ pointerEvents: 'none' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBlockFromContainer(id, block.id);
                      }}
                    >
                      ×
                    </text>
                  )}
                  
                  {/* Source diagram indicator */}
                  {block.sourcesDiagram && !isFromFinalView && (
                    <g>
                      <circle
                        cx={blockX + 12}
                        cy={blockY + 8}
                        r="6"
                        fill="rgba(255,255,255,0.9)"
                        stroke={blockColor}
                        strokeWidth="1"
                      />
                      <text
                        x={blockX + 12}
                        y={blockY + 8}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="8"
                        fill={blockColor}
                        fontWeight="700"
                        className="select-none"
                        style={{ pointerEvents: 'none' }}
                      >
                        {block.sourcesDiagram.split('-')[0].charAt(0).toUpperCase()}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        )}
      </g>
    );
  };

  // Save Button Component
  const SaveButton = () => (
    <div className="absolute bottom-4 right-4 z-10">
      {isSaving ? (
        <div className="bg-blue-100 border-2 border-blue-400 text-blue-800 px-4 py-3 rounded-lg shadow-lg text-sm font-semibold">
          <span className="mr-2 text-base">⏳</span>
          Saving...
        </div>
      ) : saveStatus === 'saved' ? (
        <div className="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-lg text-sm font-semibold">
          <span className="mr-2 text-base">✓</span>
          Saved
        </div>
      ) : saveStatus === 'error' ? (
        <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg shadow-lg text-sm font-semibold">
          <span className="mr-2 text-base">❌</span>
          Error
        </div>
      ) : null}
    </div>
  );

  // Enhanced legend component for the final view
  const Legend = () => (
    <div className="absolute top-4 right-4 bg-white border-2 border-gray-300 rounded-lg p-4 shadow-xl z-10 max-w-xs">
      <h4 className="text-base font-bold text-gray-900 mb-3">Block Sources</h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1E40AF' }}></div>
          <span className="font-semibold text-gray-800">Final View ({Object.values(containerSelections).reduce((total, arr) => total + arr.length, 0)} blocks)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#059669' }}></div>
          <span className="font-medium text-gray-700">Factory Perspective</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#D97706' }}></div>
          <span className="font-medium text-gray-700">Product Perspective</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#7C3AED' }}></div>
          <span className="font-medium text-gray-700">Order Perspective</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#DC2626' }}></div>
          <span className="font-medium text-gray-700">Manufacturing Perspective</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t-2 border-gray-200">
        <p className="text-sm font-semibold text-gray-800">
          Total: {Object.values(allDiagramBlocks).reduce((total, arr) => total + arr.length, 0)} blocks
        </p>
      </div>
    </div>
  );

  // Status indicator component
  const StatusIndicator = () => {
    if (!saveStatus) return null;
    
    const statusConfig = {
      saved: { 
        bgColor: 'bg-green-100', 
        borderColor: 'border-green-400', 
        textColor: 'text-green-800',
        text: 'Saved successfully', 
        icon: '✓' 
      },
      saving: { 
        bgColor: 'bg-blue-100', 
        borderColor: 'border-blue-400', 
        textColor: 'text-blue-800',
        text: 'Saving...', 
        icon: '⏳' 
      },
      error: { 
        bgColor: 'bg-red-100', 
        borderColor: 'border-red-400', 
        textColor: 'text-red-800',
        text: 'Save failed', 
        icon: '❌' 
      },
      refreshed: { 
        bgColor: 'bg-indigo-100', 
        borderColor: 'border-indigo-400', 
        textColor: 'text-indigo-800',
        text: 'Refreshed from all diagrams', 
        icon: '🔄' 
      }
    };
    
    const config = statusConfig[saveStatus] || statusConfig.saved;
    
    return (
      <div className={`absolute top-4 left-4 ${config.bgColor} border-2 ${config.borderColor} ${config.textColor} px-4 py-2 rounded-lg shadow-lg z-10 text-sm font-semibold`}>
        <span className="mr-2 text-base">{config.icon}</span>
        {config.text}
      </div>
    );
  };

  // Refresh Button Component - positioned below the legend
  const RefreshButton = () => (
    <div className="absolute top-80 right-4 z-10 flex flex-col gap-2">
      <button
        onClick={() => {
          console.log('🔄 Manual refresh triggered');
          loadAllDiagramSelections();
          setSaveStatus('refreshed');
          setTimeout(() => setSaveStatus(null), 3000);
        }}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg border-2 border-emerald-600 hover:border-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-semibold"
        title="Refresh to load latest changes from all diagrams"
      >
        <span className="text-base">🔄</span>
        Refresh All
      </button>
      
      {/* Debug Clear Button */}
      <button
        onClick={() => {
          console.log('🧹 Clear All triggered - resetting Final View');
          // Clear all data to reset state
          setContainerSelections({
            'datenquellen-grafisches-modell': [],
            'datenquellen-grafisches-datenmodell': [],
            'datenquellen-datenmodell': []
          });
          setAllDiagramBlocks({
            'datenquellen-grafisches-modell': [],
            'datenquellen-grafisches-datenmodell': [],
            'datenquellen-datenmodell': []
          });
          setUseCaseConnections([]);
          
          // Save the cleared state
          if (session?.user?.email) {
            saveUserSelections();
          }
          
          // Then reload fresh data
          setTimeout(() => {
            loadAllDiagramSelections();
          }, 500);
          
          setSaveStatus('refreshed');
          setTimeout(() => setSaveStatus(null), 3000);
        }}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg border-2 border-red-600 hover:border-red-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-semibold"
        title="Clear all data and reload fresh from all diagrams"
      >
        <span className="text-base">🧹</span>
        Clear & Reload
      </button>
    </div>
  );

  // Connection component
  const Connection = ({ relationship }) => {
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

    // Improved connection point calculation
    let startX, startY, endX, endY;
    
    const deltaX = toPos.x - fromPos.x;
    const deltaY = toPos.y - fromPos.y;
    const isHorizontalPrimary = Math.abs(deltaX) > Math.abs(deltaY);
    
    if (isHorizontalPrimary) {
      if (deltaX > 0) {
        startX = fromPos.right;
        startY = fromPos.y;
        endX = toPos.left;
        endY = toPos.y;
      } else {
        startX = fromPos.left;
        startY = fromPos.y;
        endX = toPos.right;
        endY = toPos.y;
      }
    } else {
      if (deltaY > 0) {
        startX = fromPos.x;
        startY = fromPos.bottom;
        endX = toPos.x;
        endY = toPos.top;
      } else {
        startX = fromPos.x;
        startY = fromPos.top;
        endX = toPos.x;
        endY = toPos.bottom;
      }
    }
    
    if (relationship.type === 'Serving' && deltaY > 0) {
      startX = fromPos.x;
      startY = fromPos.bottom;
      endX = toPos.x;
      endY = toPos.top;
    }
    
    const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
    
    return (
      <path
        d={pathData}
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeDasharray={strokeDasharray}
        fill="none"
        markerEnd={markerEnd}
        opacity={isHighlighted ? 1 : 0.3}
      />
    );
  };

  // Use Case Connection component  
  const UseCaseConnection = ({ connection }) => {
    const { blockId, containerId, elementId } = connection;
    
    const containerElement = elements.find(el => el.id === containerId);
    if (!containerElement) return null;
    
    const containerBlocks = allDiagramBlocks[containerId] || [];
    const blockIndex = containerBlocks.findIndex(block => block.id === blockId);
    if (blockIndex === -1) return null;
    
    // Calculate block position within container
    const blockHeight = 20;
    const blockSpacing = 5;
    const totalBlockHeight = blockHeight + blockSpacing;
    const startY = 40;
    const availableHeight = containerElement.height - startY - 10;
    const blocksPerColumn = Math.floor(availableHeight / totalBlockHeight);
    
    const columnIndex = Math.floor(blockIndex / blocksPerColumn);
    const rowIndex = blockIndex % blocksPerColumn;
    
    const blockWidth = 120;
    const columnSpacing = 10;
    const totalColumnWidth = blockWidth + columnSpacing;
    
    const blockX = containerElement.x + 10 + (columnIndex * totalColumnWidth) + blockWidth/2;
    const blockY = containerElement.y + startY + (rowIndex * totalBlockHeight) + blockHeight/2;
    
    const targetPos = getElementPosition(elementId);
    if (!targetPos) return null;
    
    return (
      <path
        d={`M ${blockX} ${blockY} L ${targetPos.x} ${targetPos.y}`}
        stroke="#8B5CF6"
        strokeWidth="2"
        strokeDasharray="5,5"
        fill="none"
        markerEnd="url(#arrow-use-case)"
      />
    );
  };

  // Source Connection component - connects blocks to their source perspective diagrams
  const SourceConnection = ({ block, containerId, blockIndex }) => {
    // Mapping of source diagrams to perspective block IDs
    const sourceToPerspectiveMapping = {
      'factory-perspective': 'perspektive-fabrik-architecture',
      'product-perspective': 'perspektive-produkt-architecture', 
      'order-perspective': 'perspektive-auftrag-architecture',
      'manufacturing-perspective': 'perspektive-fertigungstechnologie-architecture'
    };

    const perspectiveBlockId = sourceToPerspectiveMapping[block.sourcesDiagram];
    if (!perspectiveBlockId || !block.sourcesDiagram) return null;

    const containerElement = elements.find(el => el.id === containerId);
    const perspectiveElement = elements.find(el => el.id === perspectiveBlockId);
    
    if (!containerElement || !perspectiveElement) return null;

    // Calculate block position within container (same logic as in Box component)
    const blockHeight = 20;
    const blockSpacing = 5;
    const totalBlockHeight = blockHeight + blockSpacing;
    const startY = 40;
    const availableHeight = containerElement.height - startY - 10;
    const blocksPerColumn = Math.floor(availableHeight / totalBlockHeight);
    
    const columnIndex = Math.floor(blockIndex / blocksPerColumn);
    const rowIndex = blockIndex % blocksPerColumn;
    
    const blockWidth = 120;
    const columnSpacing = 10;
    const totalColumnWidth = blockWidth + columnSpacing;
    
    const blockX = containerElement.x + 10 + (columnIndex * totalColumnWidth) + blockWidth/2;
    const blockY = containerElement.y + startY + (rowIndex * totalBlockHeight) + blockHeight/2;

    // Get perspective block edge position instead of center
    const perspectiveWidth = perspectiveElement.width;
    const perspectiveHeight = perspectiveElement.height;
    
    // Calculate edge connection points based on relative positions
    let perspectiveX, perspectiveY;
    let blockConnectionX = blockX;
    let blockConnectionY = blockY;
    
    // Determine which edge of the perspective block to connect to
    if (blockY > perspectiveElement.y + perspectiveHeight) {
      // Block is below perspective - connect to bottom edge of perspective
      perspectiveX = perspectiveElement.x + perspectiveWidth / 2;
      perspectiveY = perspectiveElement.y + perspectiveHeight;
    } else if (blockY < perspectiveElement.y) {
      // Block is above perspective - connect to top edge of perspective
      perspectiveX = perspectiveElement.x + perspectiveWidth / 2;
      perspectiveY = perspectiveElement.y;
    } else if (blockX > perspectiveElement.x + perspectiveWidth) {
      // Block is to the right - connect to right edge of perspective
      perspectiveX = perspectiveElement.x + perspectiveWidth;
      perspectiveY = perspectiveElement.y + perspectiveHeight / 2;
    } else {
      // Block is to the left - connect to left edge of perspective
      perspectiveX = perspectiveElement.x;
      perspectiveY = perspectiveElement.y + perspectiveHeight / 2;
    }

    // Determine connection color based on source
    let connectionColor = '#059669'; // Default green for factory
    let glowFilter = 'url(#glow-green)';
    if (block.sourcesDiagram === 'product-perspective') {
      connectionColor = '#D97706'; // Orange
      glowFilter = 'url(#glow-orange)';
    } else if (block.sourcesDiagram === 'order-perspective') {
      connectionColor = '#7C3AED'; // Purple
      glowFilter = 'url(#glow-purple)';
    } else if (block.sourcesDiagram === 'manufacturing-perspective') {
      connectionColor = '#DC2626'; // Red
      glowFilter = 'url(#glow-red)';
    }

    // Create simple curved path
    const controlX = (blockConnectionX + perspectiveX) / 2;
    const controlY = Math.min(blockConnectionY, perspectiveY) - 30; // Smaller curve
    
    const pathData = `M ${blockConnectionX} ${blockConnectionY} Q ${controlX} ${controlY} ${perspectiveX} ${perspectiveY}`;

    return (
      <g>
        {/* Simple animated line with subtle glow */}
        <path
          d={pathData}
          stroke={connectionColor}
          strokeWidth="2"
          strokeDasharray="3,8"
          fill="none"
          opacity="0.6"
          filter={glowFilter}
          className="animate-dash"
          style={{
            animation: 'dash 0.8s linear infinite'
          }}
        />
        {/* Small dots at endpoints */}
        <circle
          cx={blockConnectionX}
          cy={blockConnectionY}
          r="2"
          fill={connectionColor}
          opacity="0.8"
        />
        <circle
          cx={perspectiveX}
          cy={perspectiveY}
          r="2"
          fill={connectionColor}
          opacity="0.8"
        />
      </g>
    );
  };

  // Handle clicking on a use case block in container
  const handleUseCaseBlockClick = (blockData, containerId) => {
    if (selectedUseCaseBlock?.id === blockData.id && selectedUseCaseBlock?.containerId === containerId) {
      // Deselect if clicking the same block
      setSelectedUseCaseBlock(null);
      setHighlightedLayers([]);
    } else {
      // Select new block and highlight relevant layers
      setSelectedUseCaseBlock({ ...blockData, containerId });
      // Highlight the data model elements for connection
      setHighlightedLayers(['grafisches-modell-data', 'strukturmodell-data', 'materialfluss-data', 'faehigkeitenmodell-data', 'kennzahlenmodell-data']);
    }
  };

  return (
    <>
      {/* Add CSS animation for dashed lines */}
      <style jsx>{`
        @keyframes dash {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 11;
          }
        }
        .animate-dash {
          stroke-dashoffset: 0;
        }
      `}</style>
      
      <div className="w-full h-full overflow-auto relative">
        {/* Status Indicator */}
        <StatusIndicator />
        
        {/* Refresh Button - positioned below the legend */}
        <RefreshButton />
        
        {/* Legend */}
        <Legend />

        {/* Save Status positioned near hamburger icon */}
        <SaveButton />
        
        <svg
          id="final-view-diagram-svg"
          width="100%"
          height={DIAGRAM_HEIGHT}
          viewBox={`0 0 ${DIAGRAM_WIDTH} ${DIAGRAM_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          onClick={handleBackgroundClick}
          className="w-full bg-white shadow-sm rounded-lg p-2"
          ref={drop}
        >
          <ArrowMarkers />

          {/* Render source connections first - connecting blocks to their perspective diagrams (behind other elements) */}
          {Object.entries(allDiagramBlocks).map(([containerId, blocks]) => 
            blocks.map((block, index) => 
              block.sourcesDiagram && !containerSelections[containerId]?.some(fvBlock => fvBlock.id === block.id) ? (
                <SourceConnection 
                  key={`source-${containerId}-${block.id}-${index}`}
                  block={block}
                  containerId={containerId}
                  blockIndex={index}
                />
              ) : null
            )
          )}

          {/* Render all elements */}
          {elements.map((element) => (
            <Box key={element.id} element={element} />
          ))}

          {/* Render all relationships */}
          {relationships.map((relationship, index) => (
            <Connection key={`${relationship.source}-${relationship.target}-${index}`} relationship={relationship} />
          ))}

          {/* Render use case connections */}
          {useCaseConnections.map((connection, index) => (
            <UseCaseConnection key={`${connection.blockId}-${connection.containerId}-${connection.elementId}-${index}`} connection={connection} />
          ))}
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