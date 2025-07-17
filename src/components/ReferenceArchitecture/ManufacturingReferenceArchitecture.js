import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useSession } from 'next-auth/react';
import LoadingSpinner from './LoadingSpinner';

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

  // Helper function to get all used element IDs
  const getAllUsedElementIds = useCallback((selections) => {
    const allUsed = [];
    Object.values(selections).forEach(containerBlocks => {
      containerBlocks.forEach(block => allUsed.push(block.id));
    });
    return allUsed;
  }, []);

  // Load user's selections for Manufacturing Perspective
  const loadUserSelections = useCallback(async () => {
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
    
    console.log('=== MANUFACTURING: LOADING USER SELECTIONS ===');
    try {
      const response = await fetch('/api/diagram-selections?diagramType=manufacturing-perspective');
      console.log('📡 MANUFACTURING: API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 MANUFACTURING: Loaded data:', data);
        console.log('📋 Container selections:', data.selections);
        console.log('🔗 Use case connections:', data.useCaseConnections);
        console.log('🔗 Use case connections count:', data.useCaseConnections?.length || 0);
        
        if (data.selections) {
          setContainerSelections(data.selections);
          console.log('✅ MANUFACTURING: Set container selections to state');
        }
        
        if (data.useCaseConnections) {
          setUseCaseConnections(data.useCaseConnections);
          console.log('✅ MANUFACTURING: Set use case connections to state:', data.useCaseConnections.length);
        } else {
          console.log('⚠️ MANUFACTURING: No use case connections found in loaded data');
        }
        
        // Notify parent about loaded element usage immediately (bypass debounce for initial load)
        if (onElementUsageChange) {
          const usedElementIds = getAllUsedElementIds(data.selections || {});
          lastUsedElementsRef.current = usedElementIds;
          onElementUsageChange(usedElementIds);
        }
      } else {
        console.error('❌ MANUFACTURING: Failed to load user selections:', response.status);
      }
    } catch (error) {
      console.error('❌ MANUFACTURING: Error loading selections:', error);
    }
  }, [session?.user?.email, onElementUsageChange, getAllUsedElementIds]);

  // Load blocks from other diagrams for cross-diagram sharing
  const loadCrossDiagramBlocks = useCallback(async () => {
    if (!session?.user?.email) return;
    
    console.log('=== LOADING CROSS-DIAGRAM BLOCKS (MANUFACTURING) ===');
    try {
      const otherDiagramTypes = [
        'reference-architecture', // Factory perspective
        'product-perspective',
        'order-perspective',
        'final-view'
      ];
      
      // Load selections from other diagrams in parallel
      const responses = await Promise.all(
        otherDiagramTypes.map(async diagramType => {
          try {
            const response = await fetch(`/api/diagram-selections?diagramType=${diagramType}`);
            if (response.ok) {
              const data = await response.json();
              console.log(`📊 MANUFACTURING: ${diagramType}:`, data.selections ? Object.values(data.selections).reduce((total, arr) => total + arr.length, 0) : 0, 'blocks');
              return { diagramType, data };
            } else {
              console.log(`❌ MANUFACTURING: Failed to load ${diagramType}: ${response.status}`);
              return { diagramType, data: null };
            }
          } catch (err) {
            console.error(`❌ MANUFACTURING: Error loading ${diagramType}:`, err);
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
              console.log(`🔍 MANUFACTURING: Processing ${diagramType} container ${containerId}: ${newBlocks.length} blocks`);
              
              // Add blocks that don't already exist (based on ID)
              newBlocks.forEach(block => {
                if (!crossBlocks[containerId].some(existing => existing.id === block.id)) {
                  // Map diagramType to proper source name for display
                  let sourcePerspective = diagramType;
                  if (diagramType === 'reference-architecture') {
                    sourcePerspective = 'factory-perspective';
                  } else if (diagramType === 'final-view') {
                    sourcePerspective = 'final-view';
                  }
                  
                  console.log(`✅ MANUFACTURING: Adding cross-diagram block "${block.name}" from ${sourcePerspective} to ${containerId}`);
                  crossBlocks[containerId].push({
                    ...block,
                    sourcePerspective: sourcePerspective
                  });
                } else {
                  console.log(`⚠️ MANUFACTURING: Skipping duplicate cross-diagram block "${block.name}" from ${diagramType}`);
                }
              });
            }
          });
        }
      });
      
      setCrossDiagramBlocks(crossBlocks);
      console.log('✅ MANUFACTURING: Cross-diagram blocks loaded successfully');
      console.log('🔍 MANUFACTURING: Final crossBlocks state:', crossBlocks);
      
    } catch (error) {
      console.error('❌ MANUFACTURING: Error loading cross-diagram blocks:', error);
    }
  }, [session?.user?.email]);

  // Combined load function
  const loadAllData = useCallback(async () => {
    console.log('🔄 MANUFACTURING: Loading all data...');
    await loadUserSelections();
    await loadCrossDiagramBlocks();
    console.log('✅ MANUFACTURING: All data loaded');
  }, [loadUserSelections, loadCrossDiagramBlocks]);

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
        console.log('⚠️ MANUFACTURING: Force stopping loading spinner after 5 seconds');
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

  // Save user's selections for Manufacturing Perspective
  const saveUserSelections = useCallback(async () => {
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
        setTimeout(() => setSaveStatus(null), 5000);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 5000);
      }
      return;
    }
    
    if (isSaving) {
      console.log('⚠️ MANUFACTURING: Save already in progress, skipping...');
      return;
    }
    
    setSavingWithTimeout(true); // Use the protected setter
    console.log('🔄 MANUFACTURING: Starting save process...');
    console.log('📊 Container selections to save:', containerSelections);
    console.log('🔗 Use case connections to save:', useCaseConnections);
    
    try {
      // Validate connections before saving
      const allBlocks = Object.values(containerSelections).flat();
      const allElements = elements.map(el => el.id);
      
      console.log('✅ All blocks:', allBlocks.map(b => b.id));
      console.log('✅ All elements:', allElements);
      
      const validConnections = useCaseConnections.filter((conn, index) => {
        const blockExists = allBlocks.some(b => b.id === conn.blockId);
        const elementExists = allElements.includes(conn.elementId);
        const isValid = blockExists && elementExists;
        
        if (!isValid) {
          console.log(`❌ Invalid connection removed: ${conn.blockId} -> ${conn.elementId} (blockExists: ${blockExists}, elementExists: ${elementExists})`);
        }
        
        return isValid;
      });
      
      console.log('🔗 Valid connections after filtering:', validConnections);
      
      const payload = {
        selections: containerSelections,
        useCaseConnections: validConnections, // Use only valid connections
        diagramType: 'manufacturing-perspective',
        perspective: 'manufacturing' // Add as backup identifier
      };
      
      console.log('📤 MANUFACTURING: Sending payload to API:', payload);
      
      const response = await fetch('/api/diagram-selections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      console.log('📡 MANUFACTURING: API response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ MANUFACTURING: Save successful!', result);
        setHasUnsavedChanges(false);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 5000);
        
        // Trigger refresh in other diagrams by dispatching custom events
        console.log('📡 MANUFACTURING: Notifying other diagrams of changes...');
        window.dispatchEvent(new CustomEvent('cross-diagram-refresh', {
          detail: { 
            sourceDiagram: 'manufacturing-perspective',
            changes: containerSelections
          }
        }));
      } else {
        const errorText = await response.text();
        console.error('❌ MANUFACTURING: Failed to save selections:', response.status, errorText);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 5000);
      }
    } catch (error) {
      console.error('❌ MANUFACTURING: Network error:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setSavingWithTimeout(false); // Use the protected setter
      console.log('🏁 MANUFACTURING: Save process completed');
    }
  }, [session?.user?.email, isSaving, containerSelections, useCaseConnections, elements, setSavingWithTimeout]);

  // Load user's selections from database on component mount
  useEffect(() => {
    if (session?.user?.email) {
      console.log('🔄 MANUFACTURING: Component mounted, loading data...');
      loadAllData();
    } else {
      console.log('⚠️ MANUFACTURING: No session email, skipping data load');
    }
  }, [loadAllData, session?.user?.email]);

  // Auto-save when changes are made (debounced) - Simplified and fixed pattern
  useEffect(() => {
    if (hasUnsavedChanges && session?.user?.email) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        console.log('🔄 Auto-saving Manufacturing perspective changes...');
        saveUserSelections();
      }, 500); // Reduced from 1000ms to 500ms for faster saves
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, containerSelections, useCaseConnections, session?.user?.email, saveUserSelections]);

  // Listen for reset events and cross-diagram refresh events
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
      setHasUnsavedChanges(false);
      setCrossDiagramBlocks({
        'datenquellen-grafisches-modell': [],
        'datenquellen-grafisches-datenmodell': [],
        'datenquellen-datenmodell': []
      });

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

    const handleCrossDiagramRefresh = (event) => {
      // Only refresh if the change came from a different diagram
      if (event.detail.sourceDiagram !== 'manufacturing-perspective') {
        console.log('🔄 MANUFACTURING: Received cross-diagram refresh from:', event.detail.sourceDiagram);
        // Delay refresh to allow the source diagram to finish saving
        setTimeout(() => {
          loadCrossDiagramBlocks();
        }, 1000);
      }
    };

    // Listen for the proper reset event
    window.addEventListener('resetManufacturingArchitectureDiagram', handleReset);
    window.addEventListener('cross-diagram-refresh', handleCrossDiagramRefresh);
    
    return () => {
      window.removeEventListener('resetManufacturingArchitectureDiagram', handleReset);
      window.removeEventListener('cross-diagram-refresh', handleCrossDiagramRefresh);
      // Clean up any pending timeouts
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [session?.user?.email, saveUserSelections, loadCrossDiagramBlocks]);

  // Auto-refresh cross-diagram blocks when local blocks change
  useEffect(() => {
    if (session?.user?.email) {
      const refreshTimeout = setTimeout(() => {
        console.log('🔄 MANUFACTURING: Auto-refreshing cross-diagram blocks due to local changes...');
        loadCrossDiagramBlocks();
      }, 2000); // Refresh cross-diagram blocks 2 seconds after local changes

      return () => clearTimeout(refreshTimeout);
    }
  }, [containerSelections, session?.user?.email, loadCrossDiagramBlocks]);

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

  // Debug: Log crossDiagramBlocks state whenever it changes
  useEffect(() => {
    console.log('🔍 MANUFACTURING: crossDiagramBlocks state changed:', crossDiagramBlocks);
    const totalCrossBlocks = Object.values(crossDiagramBlocks).reduce((total, blocks) => total + blocks.length, 0);
    console.log(`📊 MANUFACTURING: Total cross-diagram blocks: ${totalCrossBlocks}`);
  }, [crossDiagramBlocks]);

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
      // Remove immediate spinner - let auto-save handle it
      
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
              
              // Debug logging for container rendering
              if (allBlocks.length > 0) {
                console.log(`🎨 MANUFACTURING: Rendering container ${id} with ${allBlocks.length} blocks (${localBlocks.length} local, ${filteredCrossBlocks.length} cross-diagram)`);
              }
              
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
                    case 'factory-perspective':
                      blockColor = '#059669'; // Green  
                      perspectiveIcon = 'F';
                      break;
                    case 'product-perspective':
                      blockColor = '#EA580C'; // Orange
                      perspectiveIcon = 'P';
                      break;
                    case 'order-perspective':
                      blockColor = '#7C3AED'; // Purple
                      perspectiveIcon = 'O';
                      break;
                    case 'final-view':
                      blockColor = '#1E40AF'; // Blue
                      perspectiveIcon = 'V';
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
    // Remove immediate spinner - let auto-save handle it
    
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

  // Legend component to show block color coding
  const BlockLegend = () => (
    <div className="absolute top-20 right-4 bg-white border-2 border-gray-300 rounded-lg p-3 shadow-lg z-10 text-xs">
      <h4 className="font-bold text-gray-900 mb-2">Block Sources</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
          <span className="text-gray-700">Manufacturing (Local)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#059669' }}></div>
          <span className="text-gray-700">Factory (F)</span>
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
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#1E40AF' }}></div>
          <span className="text-gray-700">Final View (V)</span>
        </div>
      </div>
    </div>
  );

            return (
    <>
      <div 
        className="w-full h-full overflow-auto relative" 
        ref={drop}
        style={{
          background: isOver ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
          transition: 'background-color 0.2s ease'
        }}
      >
        {/* Loading Spinner */}
        <LoadingSpinner 
          isVisible={isSaving} 
          message="Saving manufacturing perspective changes..." 
        />

        {/* Save Status Indicator positioned near hamburger icon */}
        {(isSaving || saveStatus) && (
          <div className="absolute top-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-sm p-2" style={{ marginTop: '4px', marginRight: '20px' }}>
            <div className={`px-3 py-1 rounded text-xs font-medium ${
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
        <BlockLegend />
      </div>

      {/* Save Button Component */}
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
    </>
  );
};

// Expose architectureElements and relationships as static properties
ManufacturingReferenceArchitecture.architectureElements = architectureElements;
ManufacturingReferenceArchitecture.relationships = relationships;

export default ManufacturingReferenceArchitecture; 