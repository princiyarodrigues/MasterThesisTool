import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useSession } from 'next-auth/react';

// Manufacturing Technology perspective architecture data
const architectureElements = [
  // Value Streams (Top row)
  { 
    id: 'vs-1', 
    name: '1. Spezifikation & Planung', 
    type: 'Value Stream', 
    description: 'Planning and specification phase',
    x: 100, y: 50, width: 200, height: 70
  },
  { 
    id: 'vs-2', 
    name: '2. Aufbau & Inbetriebnahme', 
    type: 'Value Stream', 
    description: 'Construction and commissioning phase',
    x: 350, y: 50, width: 200, height: 70
  },
  { 
    id: 'vs-3', 
    name: '3.0 Betrieb', 
    type: 'Value Stream', 
    description: 'Operational phase',
    x: 600, y: 50, width: 200, height: 70
  },
  { 
    id: 'vs-4', 
    name: '4. Demontage & Recycling', 
    type: 'Value Stream', 
    description: 'End-of-life phase',
    x: 850, y: 50, width: 200, height: 70
  },
  
  // Business Processes (Second row - Manufacturing Technology Perspective)
  { 
    id: 'bp-1.1', 
    name: '1.1 Planung, Entwicklung', 
    type: 'Business Process', 
    description: 'Planning and development',
    x: 50, y: 180, width: 150, height: 70
  },
  { 
    id: 'bp-1.2', 
    name: '1.2 Konstruktion', 
    type: 'Business Process', 
    description: 'Construction',
    x: 250, y: 180, width: 150, height: 70
  },
  { 
    id: 'bp-2.1', 
    name: '2.1 Virtuelle Inbetriebnahme', 
    type: 'Business Process', 
    description: 'Virtual commissioning',
    x: 450, y: 180, width: 170, height: 70
  },
  { 
    id: 'bp-3.1', 
    name: '3.1 Produktion', 
    type: 'Business Process', 
    description: 'Production',
    x: 650, y: 180, width: 150, height: 70
  },
  { 
    id: 'bp-3.2', 
    name: '3.2 Instandhaltung & Optimierung', 
    type: 'Business Process', 
    description: 'Maintenance and optimization',
    x: 830, y: 180, width: 200, height: 70
  },
  { 
    id: 'bp-4.1', 
    name: '4.1 Modernisierung, Recycling', 
    type: 'Business Process', 
    description: 'Modernization and recycling',
    x: 1060, y: 180, width: 180, height: 70
  },
  
  // Data Objects Layer 1
  { 
    id: 'do-lasten-pflichtenheft', 
    name: 'Lasten- & Pflichtenheft', 
    type: 'Data Object', 
    description: 'Requirement specifications',
    x: 100, y: 290, width: 180, height: 60
  },
  { 
    id: 'do-maschinen-anlagenmodell', 
    name: 'Maschinen- o. Anlagenmodell (3D)', 
    type: 'Data Object', 
    description: '3D model of machine or facility',
    x: 300, y: 290, width: 200, height: 60
  },
  { 
    id: 'do-bor', 
    name: 'BOR', 
    type: 'Data Object', 
    description: 'Bill of Resources',
    x: 520, y: 290, width: 100, height: 60
  },
  { 
    id: 'do-bom-maschine', 
    name: 'BOM Maschine o. Anlage', 
    type: 'Data Object', 
    description: 'Bill of Materials for machine',
    x: 640, y: 290, width: 160, height: 60
  },
  
  // Data Objects Layer 2
  { 
    id: 'do-simulationsmodelle', 
    name: 'Simulationsmodelle & -daten', 
    type: 'Data Object', 
    description: 'Simulation models and data',
    x: 450, y: 380, width: 350, height: 60
  },
  
  // Data Objects Layer 3
  { 
    id: 'do-testspezifikation', 
    name: 'Testspezifikation & Toleranzangaben', 
    type: 'Data Object', 
    description: 'Test specifications and tolerances',
    x: 450, y: 470, width: 220, height: 60
  },
  { 
    id: 'do-maschinen-betriebsdaten', 
    name: 'Maschinen- & Betriebsdaten', 
    type: 'Data Object', 
    description: 'Machine and operational data',
    x: 700, y: 470, width: 200, height: 60
  },
  
  // Data Objects Layer 4
  { 
    id: 'do-fehlerberichte', 
    name: 'Fehlerberichte', 
    type: 'Data Object', 
    description: 'Error reports',
    x: 450, y: 560, width: 150, height: 60
  },
  { 
    id: 'do-wartungsplaene', 
    name: 'Wartungspläne', 
    type: 'Data Object', 
    description: 'Maintenance plans',
    x: 650, y: 560, width: 150, height: 60
  },
  
  // Data Models (Bottom row)
  { 
    id: 'dm-grafisches-modell', 
    name: 'Grafisches Modell', 
    type: 'Data Object', 
    description: 'Graphical model',
    x: 380, y: 650, width: 120, height: 60
  },
  { 
    id: 'dm-strukturmodell', 
    name: 'Strukturmodell', 
    type: 'Data Object', 
    description: 'Structure model',
    x: 520, y: 650, width: 120, height: 60
  },
  { 
    id: 'dm-materialfluss', 
    name: 'Materialfluss', 
    type: 'Data Object', 
    description: 'Material flow model',
    x: 660, y: 650, width: 120, height: 60
  },
  { 
    id: 'dm-faehigkeitenmodell', 
    name: 'Fähigkeitenmodell', 
    type: 'Data Object', 
    description: 'Capabilities model',
    x: 800, y: 650, width: 120, height: 60
  },
  { 
    id: 'dm-kennzahlenmodell', 
    name: 'Kennzahlenmodell', 
    type: 'Data Object', 
    description: 'KPI model',
    x: 940, y: 650, width: 120, height: 60
  },
  
  // Container elements
  { 
    id: 'datenquellen-grafisches-modell', 
    name: 'Datenquellen: Grafisches Modell', 
    type: 'Container', 
    x: 80, y: 740, width: 400, height: 150
  },
  { 
    id: 'datenquellen-grafisches-datenmodell', 
    name: 'Datenquellen: Grafisches &\nDatenmodell', 
    type: 'Container', 
    x: 520, y: 740, width: 400, height: 150
  },
  { 
    id: 'datenquellen-datenmodell', 
    name: 'Datenquellen: Datenmodell', 
    type: 'Container', 
    x: 960, y: 740, width: 350, height: 150
  }
];

// Define relationships (excluding composition relationships as requested)
const relationships = [
  // Triggering relationships between Value Streams
  { 
    id: 'rel-1', 
    type: 'Triggering', 
    source: 'vs-1', 
    target: 'vs-2',
    description: 'Planning triggers construction'
  },
  { 
    id: 'rel-2', 
    type: 'Triggering', 
    source: 'vs-2', 
    target: 'vs-3',
    description: 'Construction triggers operation'
  },
  { 
    id: 'rel-3', 
    type: 'Triggering', 
    source: 'vs-3', 
    target: 'vs-4',
    description: 'Operation triggers end-of-life'
  },
  
  // Triggering relationships between Business Processes
  { 
    id: 'rel-4', 
    type: 'Triggering', 
    source: 'bp-1.1', 
    target: 'bp-1.2',
    description: 'Planning triggers construction'
  },
  { 
    id: 'rel-5', 
    type: 'Triggering', 
    source: 'bp-1.2', 
    target: 'bp-2.1',
    description: 'Construction triggers virtual commissioning'
  },
  { 
    id: 'rel-6', 
    type: 'Triggering', 
    source: 'bp-2.1', 
    target: 'bp-3.1',
    description: 'Virtual commissioning triggers production'
  },
  { 
    id: 'rel-7', 
    type: 'Triggering', 
    source: 'bp-3.1', 
    target: 'bp-3.2',
    description: 'Production triggers maintenance'
  },
  { 
    id: 'rel-8', 
    type: 'Triggering', 
    source: 'bp-3.2', 
    target: 'bp-4.1',
    description: 'Maintenance triggers modernization'
  },
  
  // Access relationships
  { 
    id: 'rel-9', 
    type: 'Access', 
    source: 'bp-1.1', 
    target: 'do-lasten-pflichtenheft',
    description: 'Planning accesses requirements'
  },
  { 
    id: 'rel-10', 
    type: 'Access', 
    source: 'bp-1.2', 
    target: 'do-maschinen-anlagenmodell',
    description: 'Construction accesses 3D models'
  },
  { 
    id: 'rel-11', 
    type: 'Access', 
    source: 'bp-1.2', 
    target: 'do-bor',
    description: 'Construction accesses BOR'
  },
  { 
    id: 'rel-12', 
    type: 'Access', 
    source: 'bp-1.2', 
    target: 'do-bom-maschine',
    description: 'Construction accesses BOM'
  },
  { 
    id: 'rel-13', 
    type: 'Access', 
    source: 'bp-2.1', 
    target: 'do-simulationsmodelle',
    description: 'Virtual commissioning accesses simulation data'
  },
  { 
    id: 'rel-14', 
    type: 'Access', 
    source: 'bp-2.1', 
    target: 'do-testspezifikation',
    description: 'Virtual commissioning accesses test specs'
  },
  { 
    id: 'rel-15', 
    type: 'Access', 
    source: 'bp-3.1', 
    target: 'do-simulationsmodelle',
    description: 'Production accesses simulation data'
  },
  { 
    id: 'rel-16', 
    type: 'Access', 
    source: 'bp-3.1', 
    target: 'do-maschinen-betriebsdaten',
    description: 'Production accesses machine data'
  },
  { 
    id: 'rel-17', 
    type: 'Access', 
    source: 'bp-3.2', 
    target: 'do-maschinen-betriebsdaten',
    description: 'Maintenance accesses machine data'
  },
  { 
    id: 'rel-18', 
    type: 'Access', 
    source: 'bp-3.2', 
    target: 'do-fehlerberichte',
    description: 'Maintenance accesses error reports'
  },
  { 
    id: 'rel-19', 
    type: 'Access', 
    source: 'bp-3.2', 
    target: 'do-wartungsplaene',
    description: 'Maintenance accesses maintenance plans'
  },
  { 
    id: 'rel-20', 
    type: 'Access', 
    source: 'bp-4.1', 
    target: 'do-maschinen-betriebsdaten',
    description: 'Modernization accesses machine data'
  },
  { 
    id: 'rel-21', 
    type: 'Access', 
    source: 'bp-4.1', 
    target: 'do-fehlerberichte',
    description: 'Modernization accesses error reports'
  },
  { 
    id: 'rel-22', 
    type: 'Access', 
    source: 'bp-4.1', 
    target: 'do-wartungsplaene',
    description: 'Modernization accesses maintenance plans'
  },
  
  // Realization relationships
  { 
    id: 'rel-23', 
    type: 'Realization', 
    source: 'bp-1.1', 
    target: 'vs-1',
    description: 'Planning realizes specification phase'
  },
  { 
    id: 'rel-24', 
    type: 'Realization', 
    source: 'bp-1.2', 
    target: 'vs-1',
    description: 'Construction realizes specification phase'
  },
  { 
    id: 'rel-25', 
    type: 'Realization', 
    source: 'bp-2.1', 
    target: 'vs-2',
    description: 'Virtual commissioning realizes construction phase'
  },
  { 
    id: 'rel-26', 
    type: 'Realization', 
    source: 'bp-3.1', 
    target: 'vs-3',
    description: 'Production realizes operation phase'
  },
  { 
    id: 'rel-27', 
    type: 'Realization', 
    source: 'bp-3.2', 
    target: 'vs-3',
    description: 'Maintenance realizes operation phase'
  },
  { 
    id: 'rel-28', 
    type: 'Realization', 
    source: 'bp-4.1', 
    target: 'vs-4',
    description: 'Modernization realizes end-of-life phase'
  }
];

// Helper function to detect manufacturing data by checking container IDs
const isManufacturingData = (data) => {
  if (!data || !data.selections) return false;
  
  const manufacturingContainerIds = [
    'datenquellen-grafisches-modell',
    'datenquellen-grafisches-datenmodell', 
    'datenquellen-datenmodell'
  ];
  
  const hasManufacturingContainers = manufacturingContainerIds.some(containerId => 
    data.selections.hasOwnProperty(containerId)
  );
  
  console.log('=== MANUFACTURING: Checking if data is manufacturing ===');
  console.log('Data selections keys:', Object.keys(data.selections || {}));
  console.log('Has manufacturing containers:', hasManufacturingContainers);
  
  return hasManufacturingContainers;
};

const ManufacturingReferenceArchitecture = ({ selectedElement, setSelectedElement, onElementUsageChange = () => {}, departmentId = 'operations' }) => {
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
  
  const { data: session } = useSession();
  const saveTimeoutRef = useRef(null);
  const lastUsedElementsRef = useRef([]);
  const elementPositions = useRef({}).current;

  // Constants for diagram dimensions and layout
  const DIAGRAM_WIDTH = 1600;
  const DIAGRAM_HEIGHT = 950;
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

  // Manufacturing Technology Elements - exact positions from diagram with increased spacing
  const elements = [
    // Value Stream Level (Top row) - increased spacing
    { id: 'spezifikation-planung-mfg', name: '1. Spezifikation & Planung', type: 'Value Stream', x: 60, y: TOP_MARGIN },
    { id: 'aufbau-inbetriebnahme-mfg', name: '2. Aufbau & Inbetriebnahme', type: 'Value Stream', x: 360, y: TOP_MARGIN },
    { id: 'betrieb-mfg', name: '3.0 Betrieb', type: 'Value Stream', x: 660, y: TOP_MARGIN },
    { id: 'demontage-recycling-mfg', name: '4. Demontage & Recycling', type: 'Value Stream', x: 960, y: TOP_MARGIN },
    
    // Business Process Level - increased spacing
    { id: 'planung-entwicklung', name: '1.1 Planung, Entwicklung', type: 'Business Process', x: 60, y: TOP_MARGIN + 120 },
    { id: 'konstruktion', name: '1.2 Konstruktion', type: 'Business Process', x: 260, y: TOP_MARGIN + 120 },
    { id: 'virtuelle-inbetriebnahme', name: '2.1 Virtuelle Inbetriebnahme', type: 'Business Process', x: 460, y: TOP_MARGIN + 120 },
    { id: 'produktion-mfg', name: '3.1 Produktion', type: 'Business Process', x: 680, y: TOP_MARGIN + 120 },
    { id: 'instandhaltung-optimierung', name: '3.2 Instandhaltung & Optimierung', type: 'Business Process', x: 860, y: TOP_MARGIN + 120, width: 180 },
    { id: 'modernisierung-recycling', name: '4.1 Modernisierung, Recycling', type: 'Business Process', x: 1080, y: TOP_MARGIN + 120, width: 180 },
    
    // Data Object Level 1 - increased spacing
    { id: 'lasten-pflichtenheft', name: 'Lasten- & Pflichtenheft', type: 'Data Object', x: 120, y: TOP_MARGIN + 220, width: 180 },
    { id: 'maschinen-anlagenmodell', name: 'Maschinen- o. Anlagenmodell (3D)', type: 'Data Object', x: 340, y: TOP_MARGIN + 220, width: 200 },
    { id: 'bor', name: 'BOR', type: 'Data Object', x: 580, y: TOP_MARGIN + 220, width: 100 },
    { id: 'bom-maschine', name: 'BOM Maschine o. Anlage', type: 'Data Object', x: 720, y: TOP_MARGIN + 220, width: 160 },
    
    // Data Object Level 2
    { id: 'simulationsmodelle', name: 'Simulationsmodelle & -daten', type: 'Data Object', x: 500, y: TOP_MARGIN + 300, width: 350 },
    
    // Data Object Level 3 - increased spacing
    { id: 'testspezifikation', name: 'Testspezifikation & Toleranzangaben', type: 'Data Object', x: 480, y: TOP_MARGIN + 380, width: 220 },
    { id: 'maschinen-betriebsdaten', name: 'Maschinen- & Betriebsdaten', type: 'Data Object', x: 750, y: TOP_MARGIN + 380, width: 200 },
    
    // Data Object Level 4 - increased spacing
    { id: 'fehlerberichte', name: 'Fehlerberichte', type: 'Data Object', x: 480, y: TOP_MARGIN + 460, width: 150 },
    { id: 'wartungsplaene', name: 'Wartungspläne', type: 'Data Object', x: 700, y: TOP_MARGIN + 460, width: 150 },
    
    // Data Models (Bottom row) - significantly increased spacing
    { id: 'grafisches-modell-mfg', name: 'Grafisches Modell', type: 'Data Object', x: 350, y: TOP_MARGIN + 540 },
    { id: 'strukturmodell-mfg', name: 'Strukturmodell', type: 'Data Object', x: 520, y: TOP_MARGIN + 540 },
    { id: 'materialfluss-mfg', name: 'Materialfluss', type: 'Data Object', x: 690, y: TOP_MARGIN + 540 },
    { id: 'faehigkeitenmodell-mfg', name: 'Fähigkeitenmodell', type: 'Data Object', x: 860, y: TOP_MARGIN + 540 },
    { id: 'kennzahlenmodell-mfg', name: 'Kennzahlenmodell', type: 'Data Object', x: 1030, y: TOP_MARGIN + 540 },
    
    // Grouping Containers - below the Data Model layer with increased spacing
    { id: 'datenquellen-grafisches-modell', name: 'Datenquellen: Grafisches Modell', type: 'Container', x: 80, y: TOP_MARGIN + 620, width: 400, height: 150 },
    { id: 'datenquellen-grafisches-datenmodell', name: 'Datenquellen: Grafisches &\nDatenmodell', type: 'Container', x: 520, y: TOP_MARGIN + 620, width: 400, height: 150 },
    { id: 'datenquellen-datenmodell', name: 'Datenquellen: Datenmodell', type: 'Container', x: 960, y: TOP_MARGIN + 620, width: 400, height: 150 }
  ];

  // Define elements by layers for highlighting
  const layerElements = {
    layer3: ['lasten-pflichtenheft', 'maschinen-anlagenmodell', 'bor', 'bom-maschine', 'simulationsmodelle', 'testspezifikation', 'maschinen-betriebsdaten', 'fehlerberichte', 'wartungsplaene'],
    layer4: ['grafisches-modell-mfg', 'strukturmodell-mfg', 'materialfluss-mfg', 'faehigkeitenmodell-mfg', 'kennzahlenmodell-mfg']
  };

  // Load user's selections from database on component mount
  useEffect(() => {
    loadUserSelections();
  }, [session?.user?.email]);

  // Handle perspective activation - load saved selections when this perspective becomes active
  useEffect(() => {
    loadUserSelections();
  }, []); // Only run on mount when this component is rendered

  // Additional effect to ensure loading happens when component is fully rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      loadUserSelections();
    }, 500); // Small delay to ensure component is ready
    
    return () => clearTimeout(timer);
  }, []);

  // Reset selections when UCBlocks component triggers reset
  useEffect(() => {
    const handleReset = () => {
      setContainerSelections({
        'datenquellen-grafisches-modell': [],
        'datenquellen-grafisches-datenmodell': [],
        'datenquellen-datenmodell': []
      });
      setUseCaseConnections([]);
      setSelectedUseCaseBlock(null);
      setHighlightedLayers([]);
      setHasUnsavedChanges(true);
    };

    window.addEventListener('ucblocks-reset', handleReset);
    return () => window.removeEventListener('ucblocks-reset', handleReset);
  }, []);

  // Auto-save when changes are made (debounced)
  useEffect(() => {
    if (hasUnsavedChanges) {
      if (session?.user?.email) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        
        saveTimeoutRef.current = setTimeout(() => {
          saveUserSelections();
        }, 1000); // Save after 1 second of inactivity
      }
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, containerSelections, useCaseConnections, session?.user?.email]);

  // Track element usage and notify parent component
  useEffect(() => {
    const currentUsedElements = [
      ...Object.values(containerSelections).flat().map(block => block.id),
      ...useCaseConnections.map(conn => conn.elementId)
    ];
    
    // Only update if the arrays are actually different
    const currentUsedSet = new Set(currentUsedElements);
    const lastUsedSet = new Set(lastUsedElementsRef.current);
    
    if (currentUsedSet.size !== lastUsedSet.size || 
        [...currentUsedSet].some(id => !lastUsedSet.has(id))) {
      lastUsedElementsRef.current = currentUsedElements;
      onElementUsageChange(currentUsedElements);
    }
  }, [containerSelections, useCaseConnections, onElementUsageChange]);

  // Debug container selections changes
  useEffect(() => {
    console.log('=== MANUFACTURING: Container selections changed ===', containerSelections);
    Object.keys(containerSelections).forEach(containerId => {
      const blocks = containerSelections[containerId];
      console.log(`Container ${containerId}: ${blocks.length} blocks`, blocks);
    });
    
    // Auto-cleanup invalid connections when containers change
    if (useCaseConnections.length > 0) {
      console.log('=== AUTO-CLEANUP: Container changed, checking connections ===');
      const existingBlockIds = Object.values(containerSelections)
        .flat()
        .map(block => block.id);
      
      const validConnections = useCaseConnections.filter(connection => {
        const isValid = existingBlockIds.includes(connection.blockId);
        if (!isValid) {
          console.log(`Auto-removing invalid connection: ${connection.blockId} -> ${connection.elementId}`);
        }
        return isValid;
      });
      
      if (validConnections.length !== useCaseConnections.length) {
        console.log(`=== AUTO-CLEANUP: Removed ${useCaseConnections.length - validConnections.length} invalid connections ===`);
        setUseCaseConnections(validConnections);
        setHasUnsavedChanges(true);
      }
    }
  }, [containerSelections]);

  // Track use case connections changes
  useEffect(() => {
    if (useCaseConnections.length > 0) {
      const allBlocks = Object.values(containerSelections).flat();
      const allElements = elements.map(el => el.id);
      
      useCaseConnections.forEach((conn, index) => {
        const blockExists = allBlocks.some(b => b.id === conn.blockId);
        const elementExists = allElements.includes(conn.elementId);
      });
    }
  }, [useCaseConnections]);

  // Clean up invalid connections (connections to blocks that no longer exist)
  const cleanupInvalidConnections = () => {
    // Get all existing block IDs from all containers
    const existingBlockIds = Object.values(containerSelections)
      .flat()
      .map(block => block.id);
    
    // Get all valid element IDs from the manufacturing perspective
    const validElementIds = elements.map(el => el.id);
    
    // Filter connections to only keep those with valid block IDs AND valid element IDs
    const validConnections = useCaseConnections.filter(connection => {
      const hasValidBlock = existingBlockIds.includes(connection.blockId);
      const hasValidElement = validElementIds.includes(connection.elementId);
      return hasValidBlock && hasValidElement;
    });
    
    if (validConnections.length !== useCaseConnections.length) {
      setUseCaseConnections(validConnections);
      setHasUnsavedChanges(true);
    }
  };

  // Load user's selections for Manufacturing Perspective
  const loadUserSelections = async () => {
    if (!session?.user?.email) {
      // Try loading from localStorage as fallback
      try {
        const localData = localStorage.getItem('manufacturing-perspective-selections');
        if (localData) {
          const parsedData = JSON.parse(localData);
          
          if (parsedData.selections) {
            setContainerSelections(parsedData.selections);
          }
          
          if (parsedData.useCaseConnections) {
            setUseCaseConnections(parsedData.useCaseConnections);
          }
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
      return;
    }
    
    try {
      const response = await fetch('/api/diagram-selections', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Handle different possible response structures
        let manufacturingData = null;
        
        // Case 1: Response has diagramSelections array
        if (data.diagramSelections && Array.isArray(data.diagramSelections)) {
          manufacturingData = data.diagramSelections.find(selection => 
            selection.diagramType === 'manufacturing-perspective' || 
            (selection.diagramType === 'reference-architecture' && selection.perspective === 'manufacturing') ||
            isManufacturingData(selection)
          );
        }
        // Case 2: Response is the selection object directly
        else if (data.diagramType) {
          if (data.diagramType === 'manufacturing-perspective' || 
              (data.diagramType === 'reference-architecture' && data.perspective === 'manufacturing') ||
              isManufacturingData(data)) {
            manufacturingData = data;
          }
        }
        // Case 3: Response has selections property directly
        else if (data.selections) {
          manufacturingData = data;
        }
        
        if (manufacturingData) {
          if (manufacturingData.selections) {
            setContainerSelections(manufacturingData.selections);
          }
          
          if (manufacturingData.useCaseConnections) {
            setUseCaseConnections(manufacturingData.useCaseConnections);
          }
        }
      } else {
        console.error('Failed to load selections:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading selections:', error);
    }
  };

  // Save user's selections for Manufacturing Perspective
  const saveUserSelections = async () => {
    if (!session?.user?.email) {
      // Save to localStorage as fallback
      try {
        const dataToSave = {
          selections: containerSelections,
          useCaseConnections: useCaseConnections,
          diagramType: 'manufacturing-perspective',
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('manufacturing-perspective-selections', JSON.stringify(dataToSave));
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
    
    if (isSaving) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Validate connections before saving
      const allBlocks = Object.values(containerSelections).flat();
      const allElements = elements.map(el => el.id);
      
      const validConnections = useCaseConnections.filter((conn, index) => {
        const blockExists = allBlocks.some(b => b.id === conn.blockId);
        const elementExists = allElements.includes(conn.elementId);
        return blockExists && elementExists;
      });
      
      const payload = {
        selections: containerSelections,
        useCaseConnections: validConnections, // Use only valid connections
        diagramType: 'manufacturing-perspective',
        perspective: 'manufacturing' // Add as backup identifier
      };
      
      const response = await fetch('/api/diagram-selections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const result = await response.json();
        setHasUnsavedChanges(false);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 2000);
      } else {
        const errorText = await response.text();
        console.error('Failed to save selections:', response.status, errorText);
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

  // Handle clicking on a use case block in container
  const handleUseCaseBlockClick = (blockData, containerId) => {
    if (selectedUseCaseBlock?.id === blockData.id && selectedUseCaseBlock?.containerId === containerId) {
      setSelectedUseCaseBlock(null);
      setHighlightedLayers([]);
    } else {
      setSelectedUseCaseBlock({ ...blockData, containerId });
      setHighlightedLayers([...layerElements.layer3, ...layerElements.layer4]);
    }
  };

  // Handle clicking on diagram elements when a use case block is selected
  const handleDiagramElementClick = (elementId) => {
    if (selectedUseCaseBlock && highlightedLayers.includes(elementId)) {
      const existingConnectionIndex = useCaseConnections.findIndex(conn => 
        conn.blockId === selectedUseCaseBlock.id && 
        conn.containerId === selectedUseCaseBlock.containerId && 
        conn.elementId === elementId
      );

      if (existingConnectionIndex >= 0) {
        setUseCaseConnections(prev => prev.filter((_, index) => index !== existingConnectionIndex));
      } else {
        const newConnection = {
          blockId: selectedUseCaseBlock.id,
          blockName: selectedUseCaseBlock.name,
          containerId: selectedUseCaseBlock.containerId,
          elementId: elementId
        };
        
        setUseCaseConnections(prev => [...prev, newConnection]);
      }
      setHasUnsavedChanges(true);
    }
  };

  // Create element position map for connections
  const getElementPosition = (elementId) => {
    // Map the relationship IDs to actual element IDs
    const idMap = {
      'vs-1': 'spezifikation-planung-mfg',
      'vs-2': 'aufbau-inbetriebnahme-mfg', 
      'vs-3': 'betrieb-mfg',
      'vs-4': 'demontage-recycling-mfg',
      'bp-1.1': 'planung-entwicklung',
      'bp-1.2': 'konstruktion',
      'bp-2.1': 'virtuelle-inbetriebnahme',
      'bp-3.1': 'produktion-mfg',
      'bp-3.2': 'instandhaltung-optimierung',
      'bp-4.1': 'modernisierung-recycling',
      'do-lasten-pflichtenheft': 'lasten-pflichtenheft',
      'do-maschinen-anlagenmodell': 'maschinen-anlagenmodell',
      'do-bor': 'bor',
      'do-bom-maschine': 'bom-maschine',
      'do-simulationsmodelle': 'simulationsmodelle',
      'do-testspezifikation': 'testspezifikation',
      'do-maschinen-betriebsdaten': 'maschinen-betriebsdaten',
      'do-fehlerberichte': 'fehlerberichte',
      'do-wartungsplaene': 'wartungsplaene'
    };
    
    const actualElementId = idMap[elementId] || elementId;
    const element = elements.find(el => el.id === actualElementId);
    
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

  // Connection component
  const Connection = ({ relationship }) => {
    const { type, source, target } = relationship;
    
    const fromPos = getElementPosition(source);
    const toPos = getElementPosition(target);
    
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
        markerEnd = 'url(#arrow-triggering)';
    }

    const isHighlighted = !highlightedElement || 
      highlightedConnections.some(conn => 
        (conn.source === source && conn.target === target)
      );

    // Calculate proper connection points
    let startX, startY, endX, endY;

    if (Math.abs(fromPos.x - toPos.x) > Math.abs(fromPos.y - toPos.y)) {
      // Horizontal connection
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
    } else {
      // Vertical connection
      if (fromPos.y < toPos.y) {
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

  // Handle clicking an element
  const handleElementClick = (element, event) => {
    event.stopPropagation();
    
    if (selectedUseCaseBlock && highlightedLayers.includes(element)) {
      handleDiagramElementClick(element);
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

    if (isInUseCaseMode) {
      borderColor = '#FF3366';
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
          strokeWidth={highlightedElement === id ? "2" : (isInUseCaseMode ? "2" : "1")}
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
            {containerSelections[id] && containerSelections[id].length > 0 ? (
              containerSelections[id].map((block, index) => {
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
                
                const isBlockSelected = selectedUseCaseBlock?.id === block.id && 
                                       selectedUseCaseBlock?.containerId === id;
                
                return (
                  <g key={block.id} transform={`translate(${x}, ${y})`}>
                    <rect
                      x="0"
                      y="0"
                      width={blockWidth}
                      height={blockHeight}
                      rx="3"
                      fill={getBlockColors(block.type).fill}
                      stroke={isBlockSelected ? '#FF3366' : getBlockColors(block.type).stroke}
                      strokeWidth={isBlockSelected ? "2" : "1"}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseCaseBlockClick(block, id);
                      }}
                    />
                    <text
                      x={blockWidth/2}
                      y={blockHeight/2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="9"
                      fill={getBlockColors(block.type).text}
                      className="select-none cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseCaseBlockClick(block, id);
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBlockFromContainer(id, block.id);
                      }}
                    >
                      ×
                    </text>
                  </g>
                );
              })
            ) : null}
          </g>
        )}
      </g>
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

  // Drag and drop functionality (simplified for this example)
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
      
      if (!dropCoordinates) {
        return;
      }

      const svgElement = document.querySelector('#manufacturing-architecture-diagram-svg');
      
      if (!svgElement) {
        return;
      }

      const rect = svgElement.getBoundingClientRect();
      const svgX = ((dropCoordinates.x - rect.left) / rect.width) * DIAGRAM_WIDTH;
      const svgY = ((dropCoordinates.y - rect.top) / rect.height) * DIAGRAM_HEIGHT;

      let targetContainer = null;
      
      elements.forEach(element => {
        if (element.type === 'Container') {
          const { x, y, width, height } = element;
          const inContainer = svgX >= x && svgX <= x + width && svgY >= y && svgY <= y + height;
          
          if (inContainer) {
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
          id="manufacturing-architecture-diagram-svg"
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
          {relationships.map((relationship, index) => (
            <Connection key={`${relationship.source}-${relationship.target}-${index}`} relationship={relationship} />
          ))}

          {/* Render use case connections */}
          {useCaseConnections.map((connection, index) => {
            const block = Object.values(containerSelections)
              .flat()
              .find(b => b.id === connection.blockId);
            
            if (!block) {
              return null;
            }

            const container = elements.find(el => el.id === connection.containerId);
            const targetElement = elements.find(el => el.id === connection.elementId);
            
            if (!container || !targetElement) {
              return null;
            }

            // Find the block's position within the container
            const containerBlocks = containerSelections[connection.containerId] || [];
            const blockIndex = containerBlocks.findIndex(b => b.id === connection.blockId);
            
            if (blockIndex === -1) return null;

            // Calculate block position
            const blockHeight = 20;
            const blockSpacing = 5;
            const totalBlockHeight = blockHeight + blockSpacing;
            const startY = 40;
            const availableHeight = container.height - startY - 10;
            const blocksPerColumn = Math.floor(availableHeight / totalBlockHeight);
            
            const columnIndex = Math.floor(blockIndex / blocksPerColumn);
            const rowIndex = blockIndex % blocksPerColumn;
            
            const blockWidth = 120;
            const columnSpacing = 10;
            const totalColumnWidth = blockWidth + columnSpacing;
            
            const blockX = container.x + 10 + (columnIndex * totalColumnWidth) + (blockWidth / 2);
            const blockY = container.y + startY + (rowIndex * totalBlockHeight) + (blockHeight / 2);

            // Target element center
            const targetWidth = targetElement.width || BOX_WIDTH;
            const targetHeight = targetElement.height || BOX_HEIGHT;
            const targetX = targetElement.x + (targetWidth / 2);
            const targetY = targetElement.y + (targetHeight / 2);

            return (
              <g key={`connection-${connection.blockId}-${connection.elementId}-${index}`}>
                <line
                  x1={blockX}
                  y1={blockY}
                  x2={targetX}
                  y2={targetY}
                  stroke="#FF3366"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrow-usecase)"
                />
                <circle
                  cx={blockX}
                  cy={blockY}
                  r="3"
                  fill="#FF3366"
                />
                <circle
                  cx={targetX}
                  cy={targetY}
                  r="3"
                  fill="#FF3366"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </>
  );
};

// Expose architectureElements and relationships as static properties
ManufacturingReferenceArchitecture.architectureElements = architectureElements;
ManufacturingReferenceArchitecture.relationships = relationships;

export default ManufacturingReferenceArchitecture; 