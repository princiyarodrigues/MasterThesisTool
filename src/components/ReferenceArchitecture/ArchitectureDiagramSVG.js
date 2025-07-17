import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useSession } from 'next-auth/react';
import LoadingSpinner from './LoadingSpinner';

const ArchitectureDiagramSVG = ({ selectedElement, setSelectedElement, onElementUsageChange }) => {
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [highlightedConnections, setHighlightedConnections] = useState([]);
  const [containerSelections, setContainerSelections] = useState({
    'datenquellen-grafisches-modell': [],
    'datenquellen-grafisches-datenmodell': [],
    'datenquellen-datenmodell': []
  });
  // Add state for cross-diagram blocks
  const [crossDiagramBlocks, setCrossDiagramBlocks] = useState({
    'datenquellen-grafisches-modell': [],
    'datenquellen-grafisches-datenmodell': [],
    'datenquellen-datenmodell': []
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  // New state for use case block connections
  const [selectedUseCaseBlock, setSelectedUseCaseBlock] = useState(null);
  const [highlightedLayers, setHighlightedLayers] = useState([]);
  const [useCaseConnections, setUseCaseConnections] = useState([]);
  // New state for tracking drag hover
  const [dragHoveredContainer, setDragHoveredContainer] = useState(null);
  
  const { data: session } = useSession();
  const saveTimeoutRef = useRef(null);
  const loadingTimeoutRef = useRef(null); // Add timeout ref for loading spinner
  const lastUsedElementsRef = useRef([]);

  // Constants for diagram dimensions and layout
  const DIAGRAM_WIDTH = 1400;
  const DIAGRAM_HEIGHT = 850;
  const BOX_WIDTH = 160;
  const BOX_HEIGHT = 50;
  const TOP_MARGIN = 60;

  // Color scheme
  const COLORS = {
    valueStream: "#FEF3C7", // Light amber
    businessProcess: "#FFFFE0", // Light yellow
    dataObject: "#CFFAFE", // Light cyan
    dataModel: "#DBEAFE", // Light blue
    grouping: "#F3F4F6", // Light gray
    border: {
      valueStream: "#F59E0B", // Amber
      businessProcess: "#FACC15", // Yellow
      dataObject: "#06B6D4", // Cyan
      dataModel: "#3B82F6", // Blue
      grouping: "#6B7280" // Gray
    },
    selected: "#EF4444" // Red for selection
  };

  // Get colors for dropped blocks based on their type
  const getBlockColors = (type) => {
    const isEquipment = type === 'Equipment';
    const isSoftware = type === 'Software';
    
    if (isEquipment) {
      return {
        fill: "#ECFDF5", // Light green background
        stroke: "#10B981", // Green border
        text: "#065F46" // Dark green text
      };
    } else if (isSoftware) {
      return {
        fill: "#CFFAFE", // Light cyan background
        stroke: "#06B6D4", // Cyan border
        text: "#0E7490" // Dark cyan text
      };
    } else {
      return {
        fill: "#DBEAFE", // Light blue background
        stroke: "#3B82F6", // Blue border
        text: "#1E40AF" // Dark blue text
      };
    }
  };

  const resetDiagram = () => {
    setHighlightedElement(null);
    setHighlightedConnections([]);
    setSelectedElement(null);
    setContainerSelections({
      'datenquellen-grafisches-modell': [],
      'datenquellen-grafisches-datenmodell': [],
      'datenquellen-datenmodell': []
    });
    setHasUnsavedChanges(false);
    // Reset use case connections
    setSelectedUseCaseBlock(null);
    setHighlightedLayers([]);
    setUseCaseConnections([]);
    // Also refresh cross-diagram blocks on reset
    setCrossDiagramBlocks({
      'datenquellen-grafisches-modell': [],
      'datenquellen-grafisches-datenmodell': [],
      'datenquellen-datenmodell': []
    });
    
    // Notify parent about usage changes
    if (onElementUsageChange) {
      onElementUsageChange([]);
    }

    // Save the cleared state to database to prevent old connections from reappearing
    if (session?.user?.email) {
      setTimeout(() => {
        saveUserSelections();
        // Reload cross-diagram blocks after saving cleared state
        setTimeout(() => {
          loadCrossDiagramBlocks();
        }, 500);
      }, 100); // Small delay to ensure state is updated
    }
  };

  // Load user's saved selections
  const loadUserSelections = async () => {
    if (!session?.user?.email) return;
    
    console.log('=== LOADING USER SELECTIONS ===');
    try {
      const response = await fetch('/api/diagram-selections?diagramType=reference-architecture');
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded data:', data);
        console.log('Container selections:', data.selections);
        console.log('Use case connections:', data.useCaseConnections);
        console.log('Use case connections count:', data.useCaseConnections?.length || 0);
        
        setContainerSelections(data.selections);
        // Load use case connections if they exist
        if (data.useCaseConnections) {
          setUseCaseConnections(data.useCaseConnections);
          console.log('Set use case connections to state:', data.useCaseConnections.length);
        } else {
          console.log('No use case connections found in loaded data');
        }
        
        // Notify parent about loaded element usage immediately (bypass debounce for initial load)
        if (onElementUsageChange) {
          const usedElementIds = getAllUsedElementIds(data.selections);
          lastUsedElementsRef.current = usedElementIds;
          onElementUsageChange(usedElementIds);
        }
      } else {
        console.error('Failed to load user selections:', response.status);
      }
    } catch (error) {
      console.error('Error loading user selections:', error);
    }
  };

  // Load blocks from other diagrams for cross-diagram sharing
  const loadCrossDiagramBlocks = async () => {
    if (!session?.user?.email) return;
    
    console.log('=== LOADING CROSS-DIAGRAM BLOCKS ===');
    try {
      const otherDiagramTypes = [
        'product-perspective',
        'order-perspective', 
        'manufacturing-perspective',
        'final-view'
      ];
      
      // Load selections from other diagrams in parallel
      const responses = await Promise.all(
        otherDiagramTypes.map(async diagramType => {
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
      
      // Initialize cross-diagram blocks
      const crossBlocks = {
        'datenquellen-grafisches-modell': [],
        'datenquellen-grafisches-datenmodell': [],
        'datenquellen-datenmodell': []
      };
      
      // Process each response
      responses.forEach(({ diagramType, data }) => {
        if (data && data.selections) {
          Object.keys(data.selections).forEach(containerId => {
            if (crossBlocks[containerId]) {
              const newBlocks = data.selections[containerId] || [];
              console.log(`🔍 Processing ${diagramType} container ${containerId}: ${newBlocks.length} blocks`);
              
              // Add blocks that don't already exist (based on ID)
              newBlocks.forEach(block => {
                if (!crossBlocks[containerId].some(existing => existing.id === block.id)) {
                  // Map diagramType to proper source name for display
                  let sourcePerspective = diagramType;
                  if (diagramType === 'final-view') {
                    sourcePerspective = 'final-view';
                  }
                  
                  console.log(`✅ Adding cross-diagram block "${block.name}" from ${sourcePerspective} to ${containerId}`);
                  crossBlocks[containerId].push({
                    ...block,
                    sourcePerspective: sourcePerspective
                  });
                } else {
                  console.log(`⚠️ Skipping duplicate cross-diagram block "${block.name}" from ${diagramType}`);
                }
              });
            }
          });
        }
      });
      
      setCrossDiagramBlocks(crossBlocks);
      console.log('✅ Cross-diagram blocks loaded successfully');
      
    } catch (error) {
      console.error('❌ Error loading cross-diagram blocks:', error);
    }
  };

  // Combined load function
  const loadAllData = async () => {
    await loadUserSelections();
    await loadCrossDiagramBlocks();
  };

  // Save user's selections
  const saveUserSelections = async () => {
    if (!session?.user?.email || isSaving) return; // Prevent multiple simultaneous saves
    
    setSavingWithTimeout(true); // Use protected setter
    console.log('=== SAVING USER SELECTIONS ===');
    console.log('Container selections:', containerSelections);
    console.log('Use case connections:', useCaseConnections);
    console.log('Use case connections count:', useCaseConnections.length);
    
    try {
      const payload = {
        selections: containerSelections,
        useCaseConnections: useCaseConnections,
        diagramType: 'reference-architecture'
      };
      console.log('Payload being sent:', payload);
      
      const response = await fetch('/api/diagram-selections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Save response:', responseData);
        setHasUnsavedChanges(false);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 5000);
        
        // Trigger refresh in other diagrams by dispatching custom events
        console.log('📡 Notifying other diagrams of changes...');
        window.dispatchEvent(new CustomEvent('cross-diagram-refresh', {
          detail: { 
            sourceDiagram: 'reference-architecture',
            changes: containerSelections
          }
        }));
      } else {
        // Handle error response safely
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('Save error:', errorData);
        } catch (jsonError) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
          console.error('Save error (non-JSON response):', response.status, response.statusText);
        }
        
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 5000);
      }
    } catch (error) {
      console.error('Error saving selections:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setSavingWithTimeout(false); // Use protected setter
    }
  };

  // Handle adding a block to a container
  const addBlockToContainer = (containerId, blockData) => {
    // Remove immediate spinner - let auto-save handle it
    
    setContainerSelections(prev => {
      // Remove the block from all containers first
      const newSelections = { ...prev };
      Object.keys(newSelections).forEach(key => {
        newSelections[key] = newSelections[key].filter(block => block.id !== blockData.id);
      });
      
      // Add to the target container
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

  // Define drop target for the SVG containers
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['UC_BLOCK', 'ELEMENT_BLOCK'],
    hover: (item, monitor) => {
      const hoverCoordinates = monitor.getClientOffset();
      if (!hoverCoordinates) {
        setDragHoveredContainer(null);
        return;
      }

      // Convert screen coordinates to SVG coordinates
      const svgElement = document.querySelector('#architecture-diagram-svg');
      if (!svgElement) {
        setDragHoveredContainer(null);
        return;
      }

      const rect = svgElement.getBoundingClientRect();
      const svgX = ((hoverCoordinates.x - rect.left) / rect.width) * DIAGRAM_WIDTH;
      const svgY = ((hoverCoordinates.y - rect.top) / rect.height) * DIAGRAM_HEIGHT;

      // Check which container the hover is over
      let hoveredContainer = null;
      
      elements.forEach(element => {
        if (element.type === 'Container') {
          const { x, y, width, height } = element;
          if (svgX >= x && svgX <= x + width && svgY >= y && svgY <= y + height) {
            hoveredContainer = element.id;
          }
        }
      });

      setDragHoveredContainer(hoveredContainer);
    },
    drop: (item, monitor) => {
      const dropCoordinates = monitor.getClientOffset();
      if (!dropCoordinates) return;

      // Convert screen coordinates to SVG coordinates
      const svgElement = document.querySelector('#architecture-diagram-svg');
      if (!svgElement) return;

      const rect = svgElement.getBoundingClientRect();
      const svgX = ((dropCoordinates.x - rect.left) / rect.width) * DIAGRAM_WIDTH;
      const svgY = ((dropCoordinates.y - rect.top) / rect.height) * DIAGRAM_HEIGHT;

      // Check which container the drop is in
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
        addBlockToContainer(targetContainer, {
          id: item.id,
          name: item.name,
          type: item.type
        });
      }

      // Clear hover state after drop
      setDragHoveredContainer(null);
      return { dropped: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Load selections on component mount and session change
  useEffect(() => {
    if (session?.user?.email) {
      loadAllData();
    }
  }, [session?.user?.email]); // Only depend on email to prevent unnecessary re-runs

  // Listen for reset events and cross-diagram refresh events
  useEffect(() => {
    const handleReset = () => resetDiagram();
    const handleCrossDiagramRefresh = (event) => {
      // Only refresh if the change came from a different diagram
      if (event.detail.sourceDiagram !== 'reference-architecture') {
        console.log('🔄 Received cross-diagram refresh from:', event.detail.sourceDiagram);
        // Delay refresh to allow the source diagram to finish saving
        setTimeout(() => {
          loadCrossDiagramBlocks();
        }, 1000);
      }
    };

    window.addEventListener('resetArchitectureDiagram', handleReset);
    window.addEventListener('cross-diagram-refresh', handleCrossDiagramRefresh);
    
    return () => {
      window.removeEventListener('resetArchitectureDiagram', handleReset);
      window.removeEventListener('cross-diagram-refresh', handleCrossDiagramRefresh);
      // Clean up any pending timeouts
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Auto-refresh cross-diagram blocks when local blocks change
  useEffect(() => {
    if (session?.user?.email) {
      const refreshTimeout = setTimeout(() => {
        console.log('🔄 Auto-refreshing cross-diagram blocks due to local changes...');
        loadCrossDiagramBlocks();
      }, 2000); // Refresh cross-diagram blocks 2 seconds after local changes

      return () => clearTimeout(refreshTimeout);
    }
  }, [containerSelections, session?.user?.email]);

  // Exact elements and positions as specified in the provided data
  const elements = [
    // Value Stream Level
    { id: 'spezifikation-planung', name: '1. Spezifikation & Planung', type: 'Value Stream', x: 70, y: TOP_MARGIN },
    { id: 'aufbau-inbetriebnahme', name: '2. Aufbau & Inbetriebnahme', type: 'Value Stream', x: 270, y: TOP_MARGIN },
    { id: 'betrieb-copy', name: '3.0 Betrieb (copy)', type: 'Value Stream', x: 520, y: TOP_MARGIN },
    { id: 'demontage-recycling', name: '4. Demontage & Recycling', type: 'Value Stream', x: 750, y: TOP_MARGIN },
    
    // Value Stream Sub Level
    { id: 'service-wartung', name: '3.1 Service & Wartung', type: 'Value Stream', x: 420, y: TOP_MARGIN + 100 },
    { id: 'umplanung', name: '3.2 Umplanung', type: 'Value Stream', x: 600, y: TOP_MARGIN + 100 },
    
    // Business Process Level
    { id: 'engineering', name: '1.2 Engineering', type: 'Business Process', x: 90, y: TOP_MARGIN + 200 },
    { id: 'aufbau-anlauf', name: '2.1 Aufbau & Anlauf', type: 'Business Process', x: 270, y: TOP_MARGIN + 200 },
    { id: 'produktion', name: '3.1 Produktion', type: 'Business Process', x: 450, y: TOP_MARGIN + 200 },
    { id: 'instandhaltung-optimierung', name: '3.2 Instandhaltung & Optimierung', type: 'Business Process', x: 630, y: TOP_MARGIN + 200 },
    { id: 'modernisierung', name: '3.3 Modernisierung', type: 'Business Process', x: 830, y: TOP_MARGIN + 200 },
    { id: 'demontage-rueckbau', name: '4.1 Demontage, Rückbau', type: 'Business Process', x: 1030, y: TOP_MARGIN + 200 },
    
    // Data Object Level 1
    { id: 'arbeitsablaufschema', name: 'Arbeitsablaufschema', type: 'Data Object', x: 90, y: TOP_MARGIN + 320, width: 140 },
    { id: 'funktionsschema', name: 'Funktionsschema', type: 'Data Object', x: 270, y: TOP_MARGIN + 320, width: 140 },
    { id: 'materialfluss', name: 'Materialfluss', type: 'Data Object', x: 470, y: TOP_MARGIN + 320, width: 500 },
    
    // Data Object Level 2
    { id: 'groblayout-2d', name: 'Groblayout (2D)', type: 'Data Object', x: 160, y: TOP_MARGIN + 420, width: 140 },
    { id: 'ideallayout-3d', name: 'Ideallayout (3D)', type: 'Data Object', x: 360, y: TOP_MARGIN + 420, width: 140 },
    { id: 'reallayout-3d', name: 'Reallayout (3D)', type: 'Data Object', x: 570, y: TOP_MARGIN + 420, width: 400 },
    
    // Data Model Level - arranged horizontally in a single row with proper spacing
    { id: 'grafisches-modell', name: 'Grafisches Modell', type: 'Data Object', x: 160, y: TOP_MARGIN + 550 },
    { id: 'strukturmodell', name: 'Strukturmodell', type: 'Data Object', x: 350, y: TOP_MARGIN + 550 },
    { id: 'materialfluss-model', name: 'Materialfluss', type: 'Data Object', x: 540, y: TOP_MARGIN + 550 },
    { id: 'faehigkeitenmodell-model', name: 'Fähigkeitenmodell', type: 'Data Object', x: 730, y: TOP_MARGIN + 550 },
    { id: 'kennzahlenmodell-model', name: 'Kennzahlenmodell', type: 'Data Object', x: 920, y: TOP_MARGIN + 550 },
    
    // Grouping Containers - below the Data Model layer
    { id: 'datenquellen-grafisches-modell', name: 'Datenquellen: Grafisches Modell', type: 'Container', x: 80, y: TOP_MARGIN + 630, width: 400, height: 150 },
    { id: 'datenquellen-grafisches-datenmodell', name: 'Datenquellen: Grafisches &\nDatenmodell', type: 'Container', x: 520, y: TOP_MARGIN + 630, width: 400, height: 150 },
    { id: 'datenquellen-datenmodell', name: 'Datenquellen: Datenmodell', type: 'Container', x: 960, y: TOP_MARGIN + 630, width: 350, height: 150 }
  ];

  // Exact relationships as specified in the provided data
  const relationships = [
    // Triggering relationships
    { type: 'Triggering', source: 'engineering', target: 'aufbau-anlauf' },
    { type: 'Triggering', source: 'aufbau-anlauf', target: 'produktion' },
    { type: 'Triggering', source: 'produktion', target: 'instandhaltung-optimierung' },
    { type: 'Triggering', source: 'instandhaltung-optimierung', target: 'modernisierung' },
    { type: 'Triggering', source: 'modernisierung', target: 'demontage-rueckbau' },
    { type: 'Triggering', source: 'spezifikation-planung', target: 'aufbau-inbetriebnahme' },
    { type: 'Triggering', source: 'aufbau-inbetriebnahme', target: 'service-wartung' },
    { type: 'Triggering', source: 'aufbau-inbetriebnahme', target: 'betrieb-copy' },
    { type: 'Triggering', source: 'betrieb-copy', target: 'demontage-recycling' },
    { type: 'Triggering', source: 'service-wartung', target: 'umplanung' },
    { type: 'Triggering', source: 'umplanung', target: 'demontage-recycling' },
    
    // Access relationships
    { type: 'Access', source: 'engineering', target: 'arbeitsablaufschema' },
    { type: 'Access', source: 'engineering', target: 'funktionsschema' },
    { type: 'Access', source: 'engineering', target: 'materialfluss' },
    { type: 'Access', source: 'engineering', target: 'groblayout-2d' },
    { type: 'Access', source: 'engineering', target: 'ideallayout-3d' },
    { type: 'Access', source: 'aufbau-anlauf', target: 'materialfluss' },
    { type: 'Access', source: 'aufbau-anlauf', target: 'ideallayout-3d' },
    { type: 'Access', source: 'aufbau-anlauf', target: 'reallayout-3d' },
    { type: 'Access', source: 'produktion', target: 'materialfluss' },
    { type: 'Access', source: 'produktion', target: 'reallayout-3d' },
    { type: 'Access', source: 'instandhaltung-optimierung', target: 'materialfluss' },
    { type: 'Access', source: 'instandhaltung-optimierung', target: 'reallayout-3d' },
    { type: 'Access', source: 'modernisierung', target: 'materialfluss' },
    { type: 'Access', source: 'modernisierung', target: 'reallayout-3d' },
    { type: 'Access', source: 'demontage-rueckbau', target: 'materialfluss' },
    { type: 'Access', source: 'demontage-rueckbau', target: 'reallayout-3d' },
    
    // Realization relationships
    { type: 'Realization', source: 'engineering', target: 'spezifikation-planung' },
    { type: 'Realization', source: 'aufbau-anlauf', target: 'aufbau-inbetriebnahme' },
    { type: 'Realization', source: 'produktion', target: 'service-wartung' },
    { type: 'Realization', source: 'instandhaltung-optimierung', target: 'umplanung' },
    { type: 'Realization', source: 'modernisierung', target: 'umplanung' },
    { type: 'Realization', source: 'demontage-rueckbau', target: 'demontage-recycling' }
  ];

  const handleElementClick = (element, event) => {
    event.stopPropagation();
    
    // Check if we're in use case block connection mode
    if (selectedUseCaseBlock && highlightedLayers.includes(element)) {
      handleDiagramElementClick(element);
      return;
    }
    
    // Original element selection logic
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
  
  const handleBackgroundClick = () => {
    setHighlightedElement(null);
    setHighlightedConnections([]);
    setSelectedElement(null);
    // Clear use case block selection when clicking background
    setSelectedUseCaseBlock(null);
    setHighlightedLayers([]);
  };

  // Store element positions
  const elementPositions = {};

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

    // Check if element should be highlighted
    const isInUseCaseMode = selectedUseCaseBlock && highlightedLayers.includes(id);
    const isRegularHighlight = !highlightedElement || 
      id === highlightedElement || 
      highlightedConnections.some(conn => conn.source === id || conn.target === id);
    
    const isHighlighted = isInUseCaseMode || isRegularHighlight;

    // Get colors based on type
    let color, borderColor, strokeDasharray = '';
    switch (type) {
      case 'Value Stream':
        color = COLORS.valueStream;
        borderColor = COLORS.border.valueStream;
        break;
      case 'Business Process':
        color = COLORS.businessProcess;
        borderColor = COLORS.border.businessProcess;
        break;
      case 'Data Object':
        color = COLORS.dataObject;
        borderColor = COLORS.border.dataObject;
        break;
      case 'Container':
        color = 'transparent';
        borderColor = COLORS.border.grouping;
        strokeDasharray = '5,5';
        break;
      case 'Grouping':
        color = COLORS.grouping;
        borderColor = COLORS.border.grouping;
        break;
      default:
        color = COLORS.dataModel;
        borderColor = COLORS.border.dataModel;
    }

    // Special highlighting for use case connection mode
    if (isInUseCaseMode) {
      borderColor = '#FF3366'; // Pink/red border for connectable elements
    }

    // Container drag hover highlighting
    const isDragHovered = type === 'Container' && dragHoveredContainer === id;
    if (isDragHovered) {
      color = '#F0F9FF'; // Light blue background
      borderColor = '#3B82F6'; // Blue border
      strokeDasharray = '8,4'; // More prominent dashed border
    }

    return (
      <g 
        transform={`translate(${x}, ${y})`}
        onClick={(e) => handleElementClick(id, e)}
        className={`cursor-pointer ${isInUseCaseMode ? 'cursor-crosshair' : ''}`}
        id={id}
        opacity={isHighlighted ? 1 : (selectedUseCaseBlock ? 0.3 : 0.4)}
      >
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="6"
          ry="6"
          fill={color}
          stroke={highlightedElement === id ? COLORS.selected : borderColor}
          strokeWidth={highlightedElement === id ? "2" : (isInUseCaseMode ? "2" : (isDragHovered ? "3" : "1"))}
          strokeDasharray={strokeDasharray}
        />
        <text 
          x={width/2} 
          y={type === 'Container' ? 20 : (type && type !== 'Grouping' ? height/2 - 8 : height/2)} 
          textAnchor="middle" 
          dominantBaseline="middle"
          fontSize={type === 'Grouping' ? "10" : type === 'Container' ? "12" : "11"}
          fontWeight={type === 'Container' ? "600" : "500"}
          fill="#000"
          className="select-none"
        >
          {name.split('\n').map((line, i) => (
            <tspan key={i} x={width/2} dy={i === 0 ? 0 : 12}>{line}</tspan>
          ))}
        </text>
        {type && type !== 'Grouping' && type !== 'Container' && (
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
            {/* Combine local blocks and cross-diagram blocks for display */}
            {(() => {
              const localBlocks = containerSelections[id] || [];
              const crossBlocks = crossDiagramBlocks[id] || [];
              
              // Filter out cross-diagram blocks that are already in local blocks
              const filteredCrossBlocks = crossBlocks.filter(crossBlock => 
                !localBlocks.some(localBlock => localBlock.id === crossBlock.id)
              );
              
              const allBlocks = [
                ...localBlocks.map(block => ({ ...block, isLocal: true })),
                ...filteredCrossBlocks.map(block => ({ ...block, isLocal: false }))
              ];
              
              return allBlocks.map((block, index) => {
                // Calculate multi-column layout
                const blockHeight = 20;
                const blockSpacing = 5;
                const totalBlockHeight = blockHeight + blockSpacing;
                const startY = 40;
                const availableHeight = height - startY - 10; // Leave 10px margin at bottom
                const blocksPerColumn = Math.floor(availableHeight / totalBlockHeight);
                
                const columnIndex = Math.floor(index / blocksPerColumn);
                const rowIndex = index % blocksPerColumn;
                
                const blockWidth = 120;
                const columnSpacing = 10;
                const totalColumnWidth = blockWidth + columnSpacing;
                
                const x = 10 + (columnIndex * totalColumnWidth);
                const y = startY + (rowIndex * totalBlockHeight);
                
                // Determine block color and icon based on source
                let blockColor, perspectiveIcon;
                if (block.isLocal) {
                  // Local blocks use the original color scheme
                  blockColor = getBlockColors(block.type).fill;
                } else {
                  // Cross-diagram blocks use perspective-specific colors
                  switch (block.sourcePerspective) {
                    case 'product-perspective':
                      blockColor = '#D97706'; // Orange
                      perspectiveIcon = 'P';
                      break;
                    case 'order-perspective':
                      blockColor = '#7C3AED'; // Purple
                      perspectiveIcon = 'O';
                      break;
                    case 'manufacturing-perspective':
                      blockColor = '#DC2626'; // Red
                      perspectiveIcon = 'M';
                      break;
                    case 'final-view':
                      blockColor = '#1E40AF'; // Blue
                      perspectiveIcon = 'F';
                      break;
                    default:
                      blockColor = '#6B7280'; // Gray
                      perspectiveIcon = '?';
                  }
                }
                
                // Check if this block is selected
                const isBlockSelected = selectedUseCaseBlock?.id === block.id && 
                                       selectedUseCaseBlock?.containerId === id;
                
                return (
                  <g key={`${block.id}-${index}`} transform={`translate(${x}, ${y})`}>
                    <rect
                      x="0"
                      y="0"
                      width={blockWidth}
                      height={blockHeight}
                      rx="3"
                      fill={block.isLocal ? getBlockColors(block.type).fill : blockColor}
                      stroke={isBlockSelected ? '#FF3366' : (block.isLocal ? getBlockColors(block.type).stroke : '#fff')}
                      strokeWidth={isBlockSelected ? "2" : "1"}
                      className="cursor-pointer"
                      style={{
                        opacity: block.isLocal ? 1 : 0.85,
                        filter: block.isLocal ? 'none' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (block.isLocal) {
                          handleUseCaseBlockClick(block, id);
                        }
                      }}
                    />
                    <text
                      x={blockWidth/2}
                      y={blockHeight/2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="9"
                      fill={block.isLocal ? getBlockColors(block.type).text : '#fff'}
                      fontWeight={block.isLocal ? "normal" : "600"}
                      className="select-none cursor-pointer"
                      style={{ 
                        pointerEvents: 'none',
                        filter: block.isLocal ? 'none' : 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (block.isLocal) {
                          handleUseCaseBlockClick(block, id);
                        }
                      }}
                    >
                      {block.name.length > 15 ? `${block.name.substring(0, 15)}...` : block.name}
                    </text>
                    
                    {/* Show remove button only for local blocks */}
                    {block.isLocal && (
                      <>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBlockFromContainer(id, block.id);
                          }}
                        >
                          ×
                        </text>
                      </>
                    )}
                    
                    {/* Show perspective icon for cross-diagram blocks */}
                    {!block.isLocal && perspectiveIcon && (
                      <g>
                        <circle
                          cx={12}
                          cy={8}
                          r="6"
                          fill="rgba(255,255,255,0.9)"
                          stroke={blockColor}
                          strokeWidth="1"
                        />
                        <text
                          x={12}
                          y={8}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="8"
                          fill={blockColor}
                          fontWeight="700"
                          className="select-none"
                          style={{ pointerEvents: 'none' }}
                        >
                          {perspectiveIcon}
                        </text>
                      </g>
                    )}
                  </g>
                );
              });
            })()}
          </g>
        )}
      </g>
    );
  };

  // Use Case Connection component
  const UseCaseConnection = ({ connection }) => {
    const { blockId, containerId, elementId } = connection;
    
    // Find the container and block position
    const containerElement = elements.find(el => el.id === containerId);
    if (!containerElement) return null;
    
    const containerBlocks = containerSelections[containerId] || [];
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
    
    // Get target element position
    const targetPos = elementPositions[elementId];
    if (!targetPos) return null;
    
    const pathData = `M ${blockX} ${blockY} L ${targetPos.x} ${targetPos.y}`;
    
    return (
      <path
        d={pathData}
        stroke="#FF3366"
        strokeWidth="2"
        strokeDasharray="3,3"
        fill="none"
        markerEnd="url(#arrow-usecase)"
        opacity="0.8"
      />
    );
  };

  // Arrow markers for connections
  const ArrowMarkers = () => (
    <defs>
      <marker
        id="arrow-triggering"
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
        id="arrow-realization"
        viewBox="0 0 10 10"
        refX="8"
        refY="3"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
      >
        <path d="M0,0 L0,6 L9,3 z" fill="#10B981" />
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
      <marker
        id="arrow-usecase"
        viewBox="0 0 10 10"
        refX="8"
        refY="3"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
      >
        <path d="M0,0 L0,6 L9,3 z" fill="#FF3366" />
      </marker>
    </defs>
  );

  // Connection component
  const Connection = ({ relationship }) => {
    const { type, source, target } = relationship;
    const fromPos = elementPositions[source];
    const toPos = elementPositions[target];
    
    if (!fromPos || !toPos) return null;

    let strokeColor, strokeDasharray, markerEnd;
    
    switch (type) {
      case 'Triggering':
        strokeColor = '#F59E0B';
        strokeDasharray = '';
        markerEnd = 'url(#arrow-triggering)';
        break;
      case 'Realization':
        strokeColor = '#10B981';
        strokeDasharray = '5,5';
        markerEnd = 'url(#arrow-realization)';
        break;
      case 'Access':
        strokeColor = '#06B6D4';
        strokeDasharray = '2,2';
        markerEnd = 'url(#arrow-access)';
        break;
      default:
        strokeColor = '#666';
        strokeDasharray = '';
        markerEnd = '';
    }

    const isHighlighted = !highlightedElement || 
      highlightedConnections.some(conn => 
        (conn.source === source && conn.target === target)
      );

    let startX, startY, endX, endY;

    // Determine connection points based on relative positions
    if (fromPos.y < toPos.y) {
      // From above to below
      startX = fromPos.x;
      startY = fromPos.bottom;
      endX = toPos.x;
      endY = toPos.top;
    } else if (fromPos.y > toPos.y) {
      // From below to above
      startX = fromPos.x;
      startY = fromPos.top;
      endX = toPos.x;
      endY = toPos.bottom;
    } else {
      // Same level - horizontal connection
      if (fromPos.x < toPos.x) {
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

  // Save Button Component
  const SaveButton = () => {
    if (!session?.user?.email || !hasUnsavedChanges) return null;

    return (
      <div className="absolute top-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-sm p-2" style={{ marginTop: '-40px', marginRight: '60px' }}>
        <button
          onClick={saveUserSelections}
          disabled={isSaving}
          className={`px-3 py-1 rounded text-xs font-medium text-white transition-all duration-200 ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        
        {saveStatus && (
          <div className={`mt-1 px-2 py-1 rounded text-xs ${
            saveStatus === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {saveStatus === 'success' ? 'Saved!' : 'Error'}
          </div>
        )}
      </div>
    );
  };

  // Helper function to get all used element IDs
  const getAllUsedElementIds = useCallback((selections) => {
    const allUsed = [];
    Object.values(selections).forEach(containerBlocks => {
      containerBlocks.forEach(block => allUsed.push(block.id));
    });
    return allUsed;
  }, []);

  // Debounced function to notify parent about element usage changes
  const notifyElementUsageChange = useCallback((selections) => {
    if (onElementUsageChange) {
      const usedElementIds = getAllUsedElementIds(selections);
      const currentUsedElementsStr = JSON.stringify(usedElementIds.sort());
      const lastUsedElementsStr = JSON.stringify(lastUsedElementsRef.current.sort());
      
      // Only notify if the list has actually changed
      if (currentUsedElementsStr !== lastUsedElementsStr) {
        lastUsedElementsRef.current = usedElementIds;
        onElementUsageChange(usedElementIds);
      }
    }
  }, [onElementUsageChange, getAllUsedElementIds]);

  // Notify parent component about element usage changes (debounced)
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      notifyElementUsageChange(containerSelections);
    }, 100); // 100ms debounce

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [containerSelections, notifyElementUsageChange]);

  // Auto-save when use case connections change
  useEffect(() => {
    if (session?.user?.email && useCaseConnections.length >= 0) {
      // Skip auto-save on initial load (when connections are empty and we just loaded)
      if (useCaseConnections.length === 0 && !hasUnsavedChanges) {
        return;
      }
      
      // Auto-save connections after a short delay when connections change
      const saveTimeout = setTimeout(() => {
        console.log('Auto-saving due to changes in use case connections:', useCaseConnections.length);
        saveUserSelections();
      }, 500); // Reduced from 1000ms to 500ms for faster saves

      return () => clearTimeout(saveTimeout);
    }
  }, [useCaseConnections, session?.user?.email]);

  // Auto-save when container selections change
  useEffect(() => {
    if (session?.user?.email) {
      // Skip auto-save on initial load
      const hasBlocks = Object.values(containerSelections).some(blocks => blocks.length > 0);
      if (!hasBlocks && !hasUnsavedChanges) {
        return;
      }
      
      // Auto-save container changes after a short delay
      const saveTimeout = setTimeout(() => {
        console.log('Auto-saving due to changes in container selections');
        saveUserSelections();
      }, 500); // Reduced from 1000ms to 500ms for faster saves

      return () => clearTimeout(saveTimeout);
    }
  }, [containerSelections, session?.user?.email]);

  // Define elements by layers for highlighting
  const layerElements = {
    layer3: ['arbeitsablaufschema', 'funktionsschema', 'materialfluss'],
    layer4: ['groblayout-2d', 'ideallayout-3d', 'reallayout-3d']
  };

  // Handle clicking on a use case block in container
  const handleUseCaseBlockClick = (blockData, containerId) => {
    if (selectedUseCaseBlock?.id === blockData.id && selectedUseCaseBlock?.containerId === containerId) {
      // Deselect if clicking the same block
      setSelectedUseCaseBlock(null);
      setHighlightedLayers([]);
    } else {
      // Select new block and highlight 3rd and 4th layers
      setSelectedUseCaseBlock({ ...blockData, containerId });
      setHighlightedLayers([...layerElements.layer3, ...layerElements.layer4]);
    }
  };

  // Handle clicking on diagram elements when a use case block is selected
  const handleDiagramElementClick = (elementId) => {
    if (selectedUseCaseBlock && highlightedLayers.includes(elementId)) {
      // Remove immediate spinner - let auto-save handle it
      
      // Create or remove connection
      const connectionKey = `${selectedUseCaseBlock.containerId}-${selectedUseCaseBlock.id}-${elementId}`;
      const existingConnectionIndex = useCaseConnections.findIndex(conn => 
        conn.blockId === selectedUseCaseBlock.id && 
        conn.containerId === selectedUseCaseBlock.containerId && 
        conn.elementId === elementId
      );

      if (existingConnectionIndex >= 0) {
        // Remove existing connection
        console.log('Removing connection:', {
          blockId: selectedUseCaseBlock.id,
          elementId: elementId,
          totalConnections: useCaseConnections.length - 1
        });
        setUseCaseConnections(prev => prev.filter((_, index) => index !== existingConnectionIndex));
      } else {
        // Add new connection
        const newConnection = {
          blockId: selectedUseCaseBlock.id,
          blockName: selectedUseCaseBlock.name,
          containerId: selectedUseCaseBlock.containerId,
          elementId: elementId
        };
        console.log('Adding connection:', newConnection);
        console.log('Total connections will be:', useCaseConnections.length + 1);
        setUseCaseConnections(prev => [...prev, newConnection]);
      }
      setHasUnsavedChanges(true);
      console.log('HasUnsavedChanges set to true');
    }
  };

  // Helper function to set saving state with timeout protection
  const setSavingWithTimeout = (saving) => {
    setIsSaving(saving);
    
    if (saving) {
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      // Set a 5-second timeout to ensure spinner doesn't get stuck
      loadingTimeoutRef.current = setTimeout(() => {
        console.log('⚠️ FACTORY: Force stopping loading spinner after 5 seconds');
        setIsSaving(false);
        setSaveStatus('timeout');
        setTimeout(() => setSaveStatus(null), 3000);
      }, 5000);
    } else {
      // Clear timeout when saving is complete
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    }
  };

  // Legend component to show block color coding
  const BlockLegend = () => (
    <div className="absolute top-20 right-4 bg-white border-2 border-gray-300 rounded-lg p-3 shadow-lg z-10 text-xs">
      <h4 className="font-bold text-gray-900 mb-2">Block Sources</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
          <span className="text-gray-700">Factory (Local)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#D97706' }}></div>
          <span className="text-gray-700">Product (P)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#7C3AED' }}></div>
          <span className="text-gray-700">Order (O)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#DC2626' }}></div>
          <span className="text-gray-700">Manufacturing (M)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#1E40AF' }}></div>
          <span className="text-gray-700">Final View (F)</span>
        </div>
      </div>
    </div>
  );

  // Refresh button for cross-diagram blocks
  const RefreshButton = () => (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={() => {
          console.log('🔄 Refreshing cross-diagram blocks...');
          loadCrossDiagramBlocks();
        }}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg border-2 border-blue-600 hover:border-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
        title="Refresh blocks from other diagrams"
      >
        <span className="text-base">🔄</span>
        Refresh
      </button>
    </div>
  );

  return (
    <>
      <div className="w-full h-full overflow-auto relative">
        {/* Loading Spinner */}
        <LoadingSpinner 
          isVisible={isSaving} 
          message="Saving factory perspective changes..." 
        />

        {/* Save Status positioned near hamburger icon */}
        <SaveButton />
        
        <svg
          id="architecture-diagram-svg"
          width="100%"
          height={DIAGRAM_HEIGHT}
          viewBox={`0 0 ${DIAGRAM_WIDTH} ${DIAGRAM_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          onClick={handleBackgroundClick}
          className="w-full bg-white shadow-sm rounded-lg p-2"
          ref={drop}
        >
          <ArrowMarkers />

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
        <BlockLegend />
        <RefreshButton />
      </div>
    </>
  );
};

export default ArchitectureDiagramSVG;