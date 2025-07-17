import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useSession } from 'next-auth/react';
import LoadingSpinner from './LoadingSpinner';

// Order perspective architecture data
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
  
  // Additional Value Streams (Second row)
  { 
    id: 'vs-3.1', 
    name: '3.1 Service & Wartung', 
    type: 'Value Stream', 
    description: 'Maintenance and service activities',
    x: 500, y: 150, width: 170, height: 70
  },
  { 
    id: 'vs-3.2', 
    name: '3.2 Umplanung', 
    type: 'Value Stream', 
    description: 'Reconfiguration planning',
    x: 750, y: 150, width: 170, height: 70
  },
  
  // Business Processes (Order Perspective)
  { 
    id: 'bp-3.1', 
    name: '3.1 Konfiguration, Bestellung', 
    type: 'Business Process', 
    description: 'Configuration and ordering',
    x: 270, y: 250, width: 170, height: 70
  },
  { 
    id: 'bp-3.2', 
    name: '3.2 Auftragsbearbeitung', 
    type: 'Business Process', 
    description: 'Order processing',
    x: 470, y: 250, width: 170, height: 70
  },
  { 
    id: 'bp-3.3', 
    name: '3.3 Fertigungsauftrags-planung', 
    type: 'Business Process', 
    description: 'Production order planning',
    x: 670, y: 250, width: 170, height: 70
  },
  { 
    id: 'bp-3.4', 
    name: '3.4 Produktion', 
    type: 'Business Process', 
    description: 'Production based on orders',
    x: 870, y: 250, width: 170, height: 70
  },
  { 
    id: 'bp-3.5', 
    name: '3.5 Kommissionierung & Versand', 
    type: 'Business Process', 
    description: 'Order picking and shipping',
    x: 1070, y: 250, width: 170, height: 70
  },
  { 
    id: 'bp-3.6', 
    name: '3.6 Auslieferung', 
    type: 'Business Process', 
    description: 'Delivery',
    x: 1270, y: 250, width: 170, height: 70
  },
  
  // Data Objects
  { 
    id: 'do-1', 
    name: 'Produktkonfiguration', 
    type: 'Data Object', 
    description: 'Product configuration',
    x: 240, y: 350, width: 180, height: 60
  },
  { 
    id: 'do-2', 
    name: 'Angebot & Bestellbestätigung', 
    type: 'Data Object', 
    description: 'Offer and order confirmation',
    x: 440, y: 350, width: 180, height: 60
  },
  { 
    id: 'do-3', 
    name: 'Auftragsdetails (Auftragsnummer, Menge und Liefertermin, bestellte Produktkonfiguration)', 
    type: 'Data Object', 
    description: 'Order details including order number, quantity, delivery date, ordered product configuration',
    x: 640, y: 350, width: 500, height: 60
  },
  { 
    id: 'do-4', 
    name: 'M-BOM', 
    type: 'Data Object', 
    description: 'Manufacturing Bill of Materials',
    x: 640, y: 430, width: 500, height: 60
  },
  { 
    id: 'do-5', 
    name: 'Auftragsstatus & -fortschritt', 
    type: 'Data Object', 
    description: 'Order status and progress',
    x: 640, y: 510, width: 180, height: 60
  },
  { 
    id: 'do-6', 
    name: 'Materialverfügbarkeits- & Kapazitätsverfügbarkeitsprüfung (inkl. Materialbeschaffung & Fremdvergabe)', 
    type: 'Data Object', 
    description: 'Material and capacity availability check including material procurement and outsourcing',
    x: 640, y: 590, width: 450, height: 60
  },
  { 
    id: 'do-7', 
    name: 'Prüfanweisungen & Testberichte', 
    type: 'Data Object', 
    description: 'Test instructions and reports',
    x: 770, y: 670, width: 180, height: 60
  },
  { 
    id: 'do-8', 
    name: 'Arbeits- & Montageanweisungen', 
    type: 'Data Object', 
    description: 'Work and assembly instructions',
    x: 770, y: 750, width: 180, height: 60
  },
  { 
    id: 'do-9', 
    name: 'Arbeitsablaufschema', 
    type: 'Data Object', 
    description: 'Work flow schema',
    x: 640, y: 830, width: 180, height: 60
  },
  { 
    id: 'do-10', 
    name: 'Funktionsschema', 
    type: 'Data Object', 
    description: 'Function schema',
    x: 640, y: 910, width: 180, height: 60
  },
  { 
    id: 'do-11', 
    name: 'Materialfluss', 
    type: 'Data Object', 
    description: 'Material flow',
    x: 770, y: 990, width: 180, height: 60
  },
  { 
    id: 'do-12', 
    name: 'Maschinen- & Betriebsdaten', 
    type: 'Data Object', 
    description: 'Machine and operating data',
    x: 770, y: 1070, width: 180, height: 60
  },
  
  // Data Models (Bottom row)
  { 
    id: 'dm-1', 
    name: 'Grafisches Modell', 
    type: 'Data Model', 
    description: 'Graphical model',
    x: 330, y: 1150, width: 120, height: 60
  },
  { 
    id: 'dm-2', 
    name: 'Strukturmodell', 
    type: 'Data Model', 
    description: 'Structure model',
    x: 530, y: 1150, width: 120, height: 60
  },
  { 
    id: 'dm-3', 
    name: 'Materialfluss', 
    type: 'Data Model', 
    description: 'Material flow model',
    x: 730, y: 1150, width: 120, height: 60
  },
  { 
    id: 'dm-4', 
    name: 'Fähigkeitenmodell', 
    type: 'Data Model', 
    description: 'Capabilities model',
    x: 930, y: 1150, width: 120, height: 60
  },
  { 
    id: 'dm-5', 
    name: 'Kennzahlenmodell', 
    type: 'Data Model', 
    description: 'KPI model',
    x: 1130, y: 1150, width: 120, height: 60
  }
];

// Define relationships between elements
const relationships = [
  // Value Stream flow lines (top row)
  { 
    id: 'rel-1', 
    type: 'Triggering', 
    source: 'vs-1', 
    target: 'vs-2',
    description: 'Planning triggers construction',
    sourceX: 300, sourceY: 85, 
    targetX: 350, targetY: 85
  },
  { 
    id: 'rel-2', 
    type: 'Triggering', 
    source: 'vs-2', 
    target: 'vs-3',
    description: 'Construction triggers operation',
    sourceX: 550, sourceY: 85, 
    targetX: 600, targetY: 85
  },
  { 
    id: 'rel-3', 
    type: 'Triggering', 
    source: 'vs-2', 
    target: 'vs-3.1',
    description: 'Construction triggers service',
    sourceX: 450, sourceY: 120, 
    targetX: 500, targetY: 185
  },
  { 
    id: 'rel-4', 
    type: 'Triggering', 
    source: 'vs-2', 
    target: 'vs-3',
    description: 'Construction triggers operation',
    sourceX: 450, sourceY: 85, 
    targetX: 610, targetY: 85
  },
  { 
    id: 'rel-5', 
    type: 'Triggering', 
    source: 'vs-3', 
    target: 'vs-4',
    description: 'Operation triggers end-of-life',
    sourceX: 800, sourceY: 85, 
    targetX: 850, targetY: 85
  },
  { 
    id: 'rel-6', 
    type: 'Composition', 
    source: 'vs-3', 
    target: 'vs-3.1',
    description: 'Operation includes service',
    sourceX: 675, sourceY: 120, 
    targetX: 585, targetY: 150
  },
  { 
    id: 'rel-7', 
    type: 'Composition', 
    source: 'vs-3', 
    target: 'vs-3.2',
    description: 'Operation includes reconfiguration',
    sourceX: 725, sourceY: 120, 
    targetX: 835, targetY: 150
  },
  
  // Business process flow (horizontal)
  { 
    id: 'rel-8', 
    type: 'Triggering', 
    source: 'bp-3.1', 
    target: 'bp-3.2',
    description: 'Configuration triggers order processing',
    sourceX: 440, sourceY: 285, 
    targetX: 470, targetY: 285
  },
  { 
    id: 'rel-9', 
    type: 'Triggering', 
    source: 'bp-3.2', 
    target: 'bp-3.3',
    description: 'Order processing triggers production planning',
    sourceX: 640, sourceY: 285, 
    targetX: 670, targetY: 285
  },
  { 
    id: 'rel-10', 
    type: 'Triggering', 
    source: 'bp-3.3', 
    target: 'bp-3.4',
    description: 'Production planning triggers production',
    sourceX: 840, sourceY: 285, 
    targetX: 870, targetY: 285
  },
  { 
    id: 'rel-11', 
    type: 'Triggering', 
    source: 'bp-3.4', 
    target: 'bp-3.5',
    description: 'Production triggers picking and shipping',
    sourceX: 1040, sourceY: 285, 
    targetX: 1070, targetY: 285
  },
  { 
    id: 'rel-12', 
    type: 'Triggering', 
    source: 'bp-3.5', 
    target: 'bp-3.6',
    description: 'Picking and shipping triggers delivery',
    sourceX: 1240, sourceY: 285, 
    targetX: 1270, targetY: 285
  },

  // Access relationships
  { 
    id: 'rel-20', 
    type: 'Access', 
    source: 'bp-3.1', 
    target: 'do-1',
    description: 'Configuration accesses product configuration',
    sourceX: 355, sourceY: 320, 
    targetX: 330, targetY: 350
  },
  
  // Add more access relationships
  { 
    id: 'rel-21', 
    type: 'Access', 
    source: 'bp-3.1', 
    target: 'do-2',
    description: 'Configuration accesses offer and order confirmation',
    sourceX: 365, sourceY: 320, 
    targetX: 450, targetY: 350
  },
  { 
    id: 'rel-22', 
    type: 'Access', 
    source: 'bp-3.1', 
    target: 'do-3',
    description: 'Configuration accesses order details',
    sourceX: 375, sourceY: 320, 
    targetX: 650, targetY: 350
  },
  { 
    id: 'rel-23', 
    type: 'Access', 
    source: 'bp-3.2', 
    target: 'do-3',
    description: 'Order processing accesses order details',
    sourceX: 555, sourceY: 320, 
    targetX: 720, targetY: 350
  },
  { 
    id: 'rel-24', 
    type: 'Access', 
    source: 'bp-3.2', 
    target: 'do-4',
    description: 'Order processing accesses M-BOM',
    sourceX: 555, sourceY: 330, 
    targetX: 680, targetY: 430
  },
  { 
    id: 'rel-25', 
    type: 'Access', 
    source: 'bp-3.2', 
    target: 'do-5',
    description: 'Order processing accesses order status',
    sourceX: 555, sourceY: 340, 
    targetX: 660, targetY: 510
  },
  { 
    id: 'rel-26', 
    type: 'Access', 
    source: 'bp-3.2', 
    target: 'do-9',
    description: 'Order processing accesses work flow schema',
    sourceX: 545, sourceY: 320, 
    targetX: 650, targetY: 830
  },
  { 
    id: 'rel-27', 
    type: 'Access', 
    source: 'bp-3.2', 
    target: 'do-6',
    description: 'Order processing accesses material availability',
    sourceX: 565, sourceY: 320, 
    targetX: 720, targetY: 590
  },
  { 
    id: 'rel-28', 
    type: 'Access', 
    source: 'bp-3.2', 
    target: 'do-10',
    description: 'Order processing accesses function schema',
    sourceX: 575, sourceY: 320, 
    targetX: 670, targetY: 910
  },
  { 
    id: 'rel-29', 
    type: 'Access', 
    source: 'bp-3.3', 
    target: 'do-4',
    description: 'Production planning accesses M-BOM',
    sourceX: 755, sourceY: 320, 
    targetX: 720, targetY: 430
  },
  { 
    id: 'rel-30', 
    type: 'Access', 
    source: 'bp-3.3', 
    target: 'do-5',
    description: 'Production planning accesses order status',
    sourceX: 755, sourceY: 330, 
    targetX: 700, targetY: 510
  },
  { 
    id: 'rel-31', 
    type: 'Access', 
    source: 'bp-3.3', 
    target: 'do-9',
    description: 'Production planning accesses work flow schema',
    sourceX: 755, sourceY: 340, 
    targetX: 680, targetY: 830
  },
  { 
    id: 'rel-32', 
    type: 'Access', 
    source: 'bp-3.3', 
    target: 'do-7',
    description: 'Production planning accesses test instructions',
    sourceX: 755, sourceY: 350, 
    targetX: 800, targetY: 670
  },
  { 
    id: 'rel-33', 
    type: 'Access', 
    source: 'bp-3.3', 
    target: 'do-8',
    description: 'Production planning accesses assembly instructions',
    sourceX: 755, sourceY: 360, 
    targetX: 800, targetY: 750
  },
  { 
    id: 'rel-34', 
    type: 'Access', 
    source: 'bp-3.3', 
    target: 'do-6',
    description: 'Production planning accesses material availability',
    sourceX: 745, sourceY: 320, 
    targetX: 740, targetY: 590
  },
  { 
    id: 'rel-35', 
    type: 'Access', 
    source: 'bp-3.3', 
    target: 'do-11',
    description: 'Production planning accesses material flow',
    sourceX: 745, sourceY: 330, 
    targetX: 790, targetY: 990
  },
  { 
    id: 'rel-36', 
    type: 'Access', 
    source: 'bp-3.3', 
    target: 'do-3',
    description: 'Production planning accesses order details',
    sourceX: 745, sourceY: 340, 
    targetX: 740, targetY: 350
  },
  { 
    id: 'rel-37', 
    type: 'Access', 
    source: 'bp-3.3', 
    target: 'do-10',
    description: 'Production planning accesses function schema',
    sourceX: 745, sourceY: 350, 
    targetX: 700, targetY: 910
  },
  { 
    id: 'rel-38', 
    type: 'Access', 
    source: 'bp-3.4', 
    target: 'do-7',
    description: 'Production accesses test instructions',
    sourceX: 955, sourceY: 320, 
    targetX: 830, targetY: 670
  },
  { 
    id: 'rel-39', 
    type: 'Access', 
    source: 'bp-3.4', 
    target: 'do-8',
    description: 'Production accesses assembly instructions',
    sourceX: 955, sourceY: 330, 
    targetX: 830, targetY: 750
  },
  { 
    id: 'rel-40', 
    type: 'Access', 
    source: 'bp-3.4', 
    target: 'do-11',
    description: 'Production accesses material flow',
    sourceX: 955, sourceY: 340, 
    targetX: 830, targetY: 990
  },
  { 
    id: 'rel-41', 
    type: 'Access', 
    source: 'bp-3.4', 
    target: 'do-12',
    description: 'Production accesses machine data',
    sourceX: 955, sourceY: 350, 
    targetX: 830, targetY: 1070
  },
  { 
    id: 'rel-42', 
    type: 'Access', 
    source: 'bp-3.4', 
    target: 'do-5',
    description: 'Production accesses order status',
    sourceX: 955, sourceY: 360, 
    targetX: 720, targetY: 510
  },
  { 
    id: 'rel-43', 
    type: 'Access', 
    source: 'bp-3.4', 
    target: 'do-3',
    description: 'Production accesses order details',
    sourceX: 955, sourceY: 370, 
    targetX: 760, targetY: 350
  },
  { 
    id: 'rel-44', 
    type: 'Access', 
    source: 'bp-3.4', 
    target: 'do-4',
    description: 'Production accesses M-BOM',
    sourceX: 955, sourceY: 380, 
    targetX: 760, targetY: 430
  },
  { 
    id: 'rel-45', 
    type: 'Triggering', 
    source: 'bp-3.4', 
    target: 'bp-3.5',
    description: 'Production triggers picking and shipping',
    sourceX: 1040, sourceY: 285, 
    targetX: 1070, targetY: 285
  },
  { 
    id: 'rel-46', 
    type: 'Realization', 
    source: 'bp-3.4', 
    target: 'vs-3',
    description: 'Production realizes operation',
    sourceX: 955, sourceY: 250, 
    targetX: 700, targetY: 120
  },
  { 
    id: 'rel-47', 
    type: 'Access', 
    source: 'bp-3.5', 
    target: 'do-4',
    description: 'Picking accesses M-BOM',
    sourceX: 1155, sourceY: 320, 
    targetX: 800, targetY: 430
  },
  { 
    id: 'rel-48', 
    type: 'Access', 
    source: 'bp-3.5', 
    target: 'do-3',
    description: 'Picking accesses order details',
    sourceX: 1155, sourceY: 330, 
    targetX: 800, targetY: 350
  },
  { 
    id: 'rel-49', 
    type: 'Access', 
    source: 'bp-3.5', 
    target: 'do-5',
    description: 'Picking accesses order status',
    sourceX: 1155, sourceY: 340, 
    targetX: 740, targetY: 510
  },
  
  // Model composition relationships
  { 
    id: 'rel-50', 
    type: 'Composition', 
    source: 'dm-1', 
    target: 'dm-1',
    description: 'Graphical model composition',
    sourceX: 390, sourceY: 1150, 
    targetX: 330, targetY: 1150
  },
  { 
    id: 'rel-51', 
    type: 'Composition', 
    source: 'dm-2', 
    target: 'do-4',
    description: 'Structure model composes M-BOM',
    sourceX: 590, sourceY: 1150, 
    targetX: 800, targetY: 430
  },
  { 
    id: 'rel-52', 
    type: 'Composition', 
    source: 'dm-3', 
    target: 'do-2',
    description: 'Material flow model composes order confirmation',
    sourceX: 790, sourceY: 1150, 
    targetX: 530, targetY: 350
  },
  { 
    id: 'rel-53', 
    type: 'Composition', 
    source: 'dm-3', 
    target: 'do-11',
    description: 'Material flow model composes material flow',
    sourceX: 790, sourceY: 1150, 
    targetX: 860, targetY: 990
  },
  { 
    id: 'rel-54', 
    type: 'Composition', 
    source: 'dm-3', 
    target: 'do-12',
    description: 'Material flow model composes machine data',
    sourceX: 790, sourceY: 1160, 
    targetX: 860, targetY: 1070
  },
  { 
    id: 'rel-55', 
    type: 'Composition', 
    source: 'dm-3', 
    target: 'do-8',
    description: 'Material flow model composes assembly instructions',
    sourceX: 790, sourceY: 1140, 
    targetX: 860, targetY: 750
  },
  { 
    id: 'rel-56', 
    type: 'Composition', 
    source: 'dm-4', 
    target: 'do-7',
    description: 'Capabilities model composes test instructions',
    sourceX: 990, sourceY: 1150, 
    targetX: 860, targetY: 670
  },
  { 
    id: 'rel-57', 
    type: 'Composition', 
    source: 'dm-4', 
    target: 'do-10',
    description: 'Capabilities model composes function schema',
    sourceX: 990, sourceY: 1140, 
    targetX: 730, targetY: 910
  },
  { 
    id: 'rel-58', 
    type: 'Composition', 
    source: 'dm-5', 
    target: 'do-3',
    description: 'KPI model composes order details',
    sourceX: 1190, sourceY: 1150, 
    targetX: 890, targetY: 350
  },
  { 
    id: 'rel-59', 
    type: 'Composition', 
    source: 'dm-5', 
    target: 'do-12',
    description: 'KPI model composes machine data',
    sourceX: 1190, sourceY: 1140, 
    targetX: 890, targetY: 1070
  },
  { 
    id: 'rel-60', 
    type: 'Composition', 
    source: 'dm-5', 
    target: 'do-6',
    description: 'KPI model composes material availability',
    sourceX: 1190, sourceY: 1130, 
    targetX: 865, targetY: 590
  },
  
  // Realization relationships
  { 
    id: 'rel-61', 
    type: 'Realization', 
    source: 'bp-3.1', 
    target: 'vs-3',
    description: 'Configuration realizes operation',
    sourceX: 355, sourceY: 250, 
    targetX: 610, targetY: 100
  },
  { 
    id: 'rel-62', 
    type: 'Realization', 
    source: 'bp-3.2', 
    target: 'vs-3',
    description: 'Order processing realizes operation',
    sourceX: 555, sourceY: 250, 
    targetX: 630, targetY: 100
  },
  { 
    id: 'rel-63', 
    type: 'Realization', 
    source: 'bp-3.3', 
    target: 'vs-3',
    description: 'Production planning realizes operation',
    sourceX: 755, sourceY: 250, 
    targetX: 650, targetY: 100
  },
  { 
    id: 'rel-64', 
    type: 'Realization', 
    source: 'bp-3.5', 
    target: 'vs-3',
    description: 'Picking realizes operation',
    sourceX: 1155, sourceY: 250, 
    targetX: 680, targetY: 100
  },
  { 
    id: 'rel-65', 
    type: 'Realization', 
    source: 'bp-3.6', 
    target: 'vs-3',
    description: 'Delivery realizes operation',
    sourceX: 1355, sourceY: 250, 
    targetX: 700, targetY: 100
  }
];

const OrderReferenceArchitecture = ({ selectedElement, setSelectedElement, onElementUsageChange = () => {}, departmentId = 'operations' }) => {
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

  // Add missing elementPositions object
  const elementPositions = useRef({}).current;

  // Constants for diagram dimensions and layout
  const DIAGRAM_WIDTH = 1400;
  const DIAGRAM_HEIGHT = 1250; // Increased from 850 to show all elements including containers
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

  // Define elements by layers for highlighting
  const layerElements = {
    layer3: ['produktkonfiguration', 'angebot-bestellbestaetigung', 'auftragsdetails', 'm-bom-order', 'auftragsstatus-fortschritt', 'materialverfuegbarkeits-kapazitaetsverfuegbarkeitspruefung', 'pruefanweisungen-testberichte-order', 'arbeits-montageanweisungen-order', 'arbeitsablaufschema-order', 'funktionsschema-order', 'materialfluss-order', 'maschinen-betriebsdaten'],
    layer4: ['grafisches-modell-order', 'strukturmodell-order', 'materialfluss-model-order', 'faehigkeitenmodell-order', 'kennzahlenmodell-order']
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

  // Order Perspective Elements - exact positions from diagram
  const elements = [
    // Value Stream Level (Top row)
    { id: 'spezifikation-planung-order', name: '1. Spezifikation & Planung', type: 'Value Stream', x: 90, y: TOP_MARGIN },
    { id: 'aufbau-inbetriebnahme-order', name: '2. Aufbau & Inbetriebnahme', type: 'Value Stream', x: 350, y: TOP_MARGIN },
    { id: 'betrieb-copy-order', name: '3.0 Betrieb (copy)', type: 'Value Stream', x: 650, y: TOP_MARGIN },
    { id: 'demontage-recycling-order', name: '4. Demontage & Recycling', type: 'Value Stream', x: 950, y: TOP_MARGIN },
    
    // Value Stream Sub Level
    { id: 'service-wartung-order', name: '3.1 Service & Wartung', type: 'Value Stream', x: 580, y: TOP_MARGIN + 85 },
    { id: 'umplanung-order', name: '3.2 Umplanung', type: 'Value Stream', x: 770, y: TOP_MARGIN + 85 },
    
    // Business Process Level
    { id: 'konfiguration-bestellung', name: '3.1 Konfiguration, Bestellung', type: 'Business Process', x: 160, y: TOP_MARGIN + 180 },
    { id: 'auftragsbearbeitung', name: '3.2 Auftragsbearbeitung', type: 'Business Process', x: 350, y: TOP_MARGIN + 180 },
    { id: 'fertigungsauftrags-planung', name: '3.3 Fertigungsauftrags-planung', type: 'Business Process', x: 540, y: TOP_MARGIN + 180 },
    { id: 'produktion-order', name: '3.4 Produktion', type: 'Business Process', x: 730, y: TOP_MARGIN + 180 },
    { id: 'kommissionierung-versand', name: '3.5 Kommissionierung & Versand', type: 'Business Process', x: 920, y: TOP_MARGIN + 180 },
    
    // Data Object Level 1 (3rd layer)
    { id: 'produktkonfiguration', name: 'Produktkonfiguration', type: 'Data Object', x: 160, y: TOP_MARGIN + 280, width: 140 },
    { id: 'angebot-bestellbestaetigung', name: 'Angebot & Bestellbestätigung', type: 'Data Object', x: 340, y: TOP_MARGIN + 280, width: 160 },
    { id: 'auftragsdetails', name: 'Auftragsdetails (Auftragsnummer, Menge und Liefertermin, bestellte Produktkonfiguration)', type: 'Data Object', x: 540, y: TOP_MARGIN + 280, width: 400 },
    
    // Data Object Level 2
    { id: 'm-bom-order', name: 'M-BOM', type: 'Data Object', x: 540, y: TOP_MARGIN + 360, width: 400 },
    { id: 'auftragsstatus-fortschritt', name: 'Auftragsstatus & -fortschritt', type: 'Data Object', x: 540, y: TOP_MARGIN + 440, width: 200 },
    { id: 'materialverfuegbarkeits-kapazitaetsverfuegbarkeitspruefung', name: 'Materialverfügbarkeits- & Kapazitätsverfügbarkeitsprüfung (inkl. Materialbeschaffung & Fremdvergabe)', type: 'Data Object', x: 540, y: TOP_MARGIN + 520, width: 350 },
    
    // Data Object Level 3
    { id: 'pruefanweisungen-testberichte-order', name: 'Prüfanweisungen & Testberichte', type: 'Data Object', x: 620, y: TOP_MARGIN + 600, width: 200 },
    { id: 'arbeits-montageanweisungen-order', name: 'Arbeits- & Montageanweisungen', type: 'Data Object', x: 620, y: TOP_MARGIN + 680, width: 200 },
    { id: 'arbeitsablaufschema-order', name: 'Arbeitsablaufschema', type: 'Data Object', x: 540, y: TOP_MARGIN + 760, width: 150 },
    { id: 'funktionsschema-order', name: 'Funktionsschema', type: 'Data Object', x: 540, y: TOP_MARGIN + 840, width: 150 },
    
    // Data Object Level 4
    { id: 'materialfluss-order', name: 'Materialfluss', type: 'Data Object', x: 720, y: TOP_MARGIN + 800, width: 150 },
    { id: 'maschinen-betriebsdaten', name: 'Maschinen- & Betriebsdaten', type: 'Data Object', x: 720, y: TOP_MARGIN + 880, width: 150 },
    
    // Data Model Level - arranged horizontally in a single row (4th layer)
    { id: 'grafisches-modell-order', name: 'Grafisches Modell', type: 'Data Object', x: 380, y: TOP_MARGIN + 960 },
    { id: 'strukturmodell-order', name: 'Strukturmodell', type: 'Data Object', x: 580, y: TOP_MARGIN + 960 },
    { id: 'materialfluss-model-order', name: 'Materialfluss', type: 'Data Object', x: 780, y: TOP_MARGIN + 960 },
    { id: 'faehigkeitenmodell-order', name: 'Fähigkeitenmodell', type: 'Data Object', x: 980, y: TOP_MARGIN + 960 },
    { id: 'kennzahlenmodell-order', name: 'Kennzahlenmodell', type: 'Data Object', x: 1180, y: TOP_MARGIN + 960 },
    
    // Grouping Containers - below the Data Model layer
    { id: 'datenquellen-grafisches-modell', name: 'Datenquellen: Grafisches Modell', type: 'Container', x: 80, y: TOP_MARGIN + 1040, width: 400, height: 150 },
    { id: 'datenquellen-grafisches-datenmodell', name: 'Datenquellen: Grafisches &\nDatenmodell', type: 'Container', x: 520, y: TOP_MARGIN + 1040, width: 400, height: 150 },
    { id: 'datenquellen-datenmodell', name: 'Datenquellen: Datenmodell', type: 'Container', x: 960, y: TOP_MARGIN + 1040, width: 350, height: 150 }
  ];

  // Get the currently selected element's data
  const selectedElementData = selectedElement 
    ? architectureElements.find(el => el.id === selectedElement) 
    : null;
    
  // Filter relationships to exclude composition relationships and references to removed elements
  const filteredRelationships = relationships.filter(rel => 
    rel.type !== 'Composition' && 
    rel.source !== 'bp-3.6' && 
    rel.target !== 'bp-3.6'
  );

  // Create element position map for connections
  const getElementPosition = (elementId) => {
    // Map the relationship IDs to actual element IDs
    const idMap = {
      'vs-1': 'spezifikation-planung-order',
      'vs-2': 'aufbau-inbetriebnahme-order', 
      'vs-3': 'betrieb-copy-order',
      'vs-4': 'demontage-recycling-order',
      'vs-3.1': 'service-wartung-order',
      'vs-3.2': 'umplanung-order',
      'bp-3.1': 'konfiguration-bestellung',
      'bp-3.2': 'auftragsbearbeitung',
      'bp-3.3': 'fertigungsauftrags-planung',
      'bp-3.4': 'produktion-order',
      'bp-3.5': 'kommissionierung-versand',
      'do-1': 'produktkonfiguration',
      'do-2': 'angebot-bestellbestaetigung',
      'do-3': 'auftragsdetails',
      'do-4': 'm-bom-order',
      'do-5': 'auftragsstatus-fortschritt',
      'do-6': 'materialverfuegbarkeits-kapazitaetsverfuegbarkeitspruefung',
      'do-7': 'pruefanweisungen-testberichte-order',
      'do-8': 'arbeits-montageanweisungen-order',
      'do-9': 'arbeitsablaufschema-order',
      'do-10': 'funktionsschema-order',
      'do-11': 'materialfluss-order',
      'do-12': 'maschinen-betriebsdaten'
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

  // Handle clicking an element
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
      const relatedConnections = filteredRelationships.filter(rel => 
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
    // Clear use case block selection when clicking background
    setSelectedUseCaseBlock(null);
    setHighlightedLayers([]);
  };

  // Get element styling based on selection state
  const getElementStyle = (elementId) => {
    if (elementId === selectedElement) {
      return 'stroke-blue-500 stroke-[2px]';
    }
    
    if (selectedElement) {
      // Highlight elements connected to the selected element
      const isConnected = filteredRelationships.some(rel => 
        (rel.source === selectedElement && rel.target === elementId) ||
        (rel.target === selectedElement && rel.source === elementId)
      );
      
      return isConnected ? 'stroke-[1.5px]' : 'opacity-50';
    }
    
    return 'stroke-[1px]';
  };

  // Get relationship styling based on selection
  const getRelationshipStyle = (relationship) => {
    if (!selectedElement) return '';
    
    const isHighlighted = relationship.source === selectedElement || 
                        relationship.target === selectedElement;
    
    return isHighlighted ? 'stroke-[2px]' : 'opacity-30';
  };

  // Get colors for element types
  const getElementTypeColors = (type) => {
    switch (type) {
      case 'Value Stream':
        return { 
          fill: 'fill-amber-50', 
          stroke: 'stroke-amber-300',
          text: 'text-amber-900',
          markerFill: '#F59E0B'
        };
      case 'Business Process':
        return { 
          fill: 'fill-green-50', 
          stroke: 'stroke-green-300',
          text: 'text-green-900',
          markerFill: '#10B981'
        };
      case 'Data Object':
        return { 
          fill: 'fill-cyan-50', 
          stroke: 'stroke-cyan-300',
          text: 'text-cyan-900',
          markerFill: '#06B6D4'
        };
      case 'Data Model':
        return { 
          fill: 'fill-blue-50', 
          stroke: 'stroke-blue-300',
          text: 'text-blue-900',
          markerFill: '#3B82F6'
        };
      default:
        return { 
          fill: 'fill-gray-50', 
          stroke: 'stroke-gray-300',
          text: 'text-gray-900',
          markerFill: '#6B7280'
        };
    }
  };

  // Get styles for relationship types
  const getRelationshipTypeStyles = (type) => {
    switch (type) {
      case 'Triggering':
        return { 
          stroke: 'stroke-amber-500', 
          marker: 'url(#arrow-triggering)'
        };
      case 'Realization':
        return { 
          stroke: 'stroke-green-500 stroke-dashed', 
          marker: 'url(#arrow-realization)'
        };
      case 'Access':
        return { 
          stroke: 'stroke-cyan-500 stroke-dotted', 
          marker: 'url(#arrow-access)'
        };
      case 'Composition':
        return { 
          stroke: 'stroke-blue-500', 
          marker: 'url(#arrow-composition)'
        };
      default:
        return { 
          stroke: 'stroke-gray-500', 
          marker: 'url(#arrow-triggering)'
        };
    }
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
        {type && type !== 'Grouping' && (
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
                    case 'factory-perspective':
                      blockColor = '#059669'; // Green  
                      perspectiveIcon = 'F';
                      break;
                    case 'product-perspective':
                      blockColor = '#D97706'; // Orange
                      perspectiveIcon = 'P';
                      break;
                    case 'manufacturing-perspective':
                      blockColor = '#DC2626'; // Red
                      perspectiveIcon = 'M';
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
              id="arrow-composition"
              viewBox="0 0 10 10"
        refX="8"
        refY="3"
              markerWidth="6"
              markerHeight="6"
        orient="auto"
      >
        <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6" />
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

    // Determine connection direction and points
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

  // Add missing functions for container functionality
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
      const svgElement = document.querySelector('#order-architecture-diagram-svg');
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
      const svgElement = document.querySelector('#order-architecture-diagram-svg');
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

  // Load user's saved selections for Order Perspective
  const loadUserSelections = async () => {
    if (!session?.user?.email) return;
    
    console.log('=== LOADING ORDER PERSPECTIVE SELECTIONS ===');
    try {
      const response = await fetch('/api/diagram-selections?diagramType=order-perspective');
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded Order Perspective data:', data);
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
    
    console.log('=== LOADING CROSS-DIAGRAM BLOCKS (ORDER) ===');
    try {
      const otherDiagramTypes = [
        'reference-architecture', // Factory perspective
        'product-perspective',
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
              console.log(`📊 ORDER: ${diagramType}:`, data.selections ? Object.values(data.selections).reduce((total, arr) => total + arr.length, 0) : 0, 'blocks');
              return { diagramType, data };
            } else {
              console.log(`❌ ORDER: Failed to load ${diagramType}: ${response.status}`);
              return { diagramType, data: null };
            }
          } catch (err) {
            console.error(`❌ ORDER: Error loading ${diagramType}:`, err);
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
              console.log(`🔍 ORDER: Processing ${diagramType} container ${containerId}: ${newBlocks.length} blocks`);
              
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
                  
                  console.log(`✅ ORDER: Adding cross-diagram block "${block.name}" from ${sourcePerspective} to ${containerId}`);
                  crossBlocks[containerId].push({
                    ...block,
                    sourcePerspective: sourcePerspective
                  });
                } else {
                  console.log(`⚠️ ORDER: Skipping duplicate cross-diagram block "${block.name}" from ${diagramType}`);
                }
              });
            }
          });
        }
      });
      
      setCrossDiagramBlocks(crossBlocks);
      console.log('✅ ORDER: Cross-diagram blocks loaded successfully');
      
    } catch (error) {
      console.error('❌ ORDER: Error loading cross-diagram blocks:', error);
    }
  };

  // Combined load function
  const loadAllData = async () => {
    await loadUserSelections();
    await loadCrossDiagramBlocks();
  };

  // Save user's selections for Order Perspective
  const saveUserSelections = async () => {
    if (!session?.user?.email || isSaving) return; // Prevent multiple simultaneous saves
    
    setSavingWithTimeout(true); // Use protected setter
    console.log('=== SAVING ORDER PERSPECTIVE SELECTIONS ===');
    console.log('Container selections:', containerSelections);
    console.log('Use case connections:', useCaseConnections);
    console.log('Use case connections count:', useCaseConnections.length);
    
    try {
      const payload = {
        selections: containerSelections,
        useCaseConnections: useCaseConnections,
        diagramType: 'order-perspective'
      };
      console.log('Payload being sent:', payload);
      console.log('Making request to:', '/api/diagram-selections');
      
      const response = await fetch('/api/diagram-selections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response url:', response.url);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Save response:', responseData);
        setHasUnsavedChanges(false);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 3000);
        
        // Trigger refresh in other diagrams by dispatching custom events
        console.log('📡 ORDER: Notifying other diagrams of changes...');
        window.dispatchEvent(new CustomEvent('cross-diagram-refresh', {
          detail: { 
            sourceDiagram: 'order-perspective',
            changes: containerSelections
          }
        }));
      } else {
        console.error('Save failed with status:', response.status, response.statusText);
        console.error('Response headers:', [...response.headers.entries()]);
        
        // Handle error response safely
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.text(); // Use text() first, then try to parse as JSON
          console.error('Error response body:', errorData);
          
          try {
            const parsedError = JSON.parse(errorData);
            errorMessage = parsedError.message || errorMessage;
            console.error('Parsed error data:', parsedError);
          } catch (parseError) {
            console.error('Response is not valid JSON:', parseError);
            // errorData is already logged above
          }
        } catch (readError) {
          console.error('Could not read response body:', readError);
        }
        
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 3000);
        
        // If it's a 404, suggest restarting the server
        if (response.status === 404) {
          console.error('API endpoint not found. Please check if the development server is running and restart if necessary.');
        }
      }
    } catch (error) {
      console.error('Network error saving selections:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setSavingWithTimeout(false); // Use protected setter
    }
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

  // Load selections on component mount and session change
  useEffect(() => {
    if (session?.user?.email) {
      loadAllData();
    }
  }, [session?.user?.email]); // Only depend on email to prevent unnecessary re-runs

  // Listen for reset events from UCBlocks component
  useEffect(() => {
    const handleReset = () => resetDiagram();
    const handleCrossDiagramRefresh = (event) => {
      // Only refresh if the change came from a different diagram
      if (event.detail.sourceDiagram !== 'order-perspective') {
        console.log('🔄 ORDER: Received cross-diagram refresh from:', event.detail.sourceDiagram);
        // Delay refresh to allow the source diagram to finish saving
        setTimeout(() => {
          loadCrossDiagramBlocks();
        }, 1000);
      }
    };

    window.addEventListener('resetOrderArchitectureDiagram', handleReset);
    window.addEventListener('cross-diagram-refresh', handleCrossDiagramRefresh);
    
    return () => {
      window.removeEventListener('resetOrderArchitectureDiagram', handleReset);
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

  // Save Button Component
  const SaveButton = () => {
    if (!session?.user?.email || !hasUnsavedChanges) return null;

    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={saveUserSelections}
          disabled={isSaving}
          className={`px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Selections'}
        </button>
        
        {saveStatus && (
          <div className={`mt-2 px-3 py-1 rounded text-sm ${
            saveStatus === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {saveStatus === 'success' ? 'Saved successfully!' : 'Save failed. Please try again.'}
      </div>
        )}
      </div>
    );
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
        console.log('⚠️ ORDER: Force stopping loading spinner after 5 seconds');
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

  // Auto-refresh cross-diagram blocks when local blocks change
  useEffect(() => {
    if (session?.user?.email) {
      const refreshTimeout = setTimeout(() => {
        console.log('🔄 ORDER: Auto-refreshing cross-diagram blocks due to local changes...');
        loadCrossDiagramBlocks();
      }, 2000); // Refresh cross-diagram blocks 2 seconds after local changes

      return () => clearTimeout(refreshTimeout);
    }
  }, [containerSelections, session?.user?.email]);

  // Legend component to show block color coding
  const BlockLegend = () => (
    <div className="absolute top-[440px] right-4 bg-white border-2 border-gray-300 rounded-lg p-3 shadow-lg z-10 text-xs">
      <h4 className="font-bold text-gray-900 mb-2">Block Sources</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-100 border border-purple-300"></div>
          <span className="text-gray-700">Order (Local)</span>
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
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#DC2626' }}></div>
          <span className="text-gray-700">Manufacturing (M)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#1E40AF' }}></div>
          <span className="text-gray-700">Final View (V)</span>
        </div>
      </div>
    </div>
  );

  // Refresh button for cross-diagram blocks
  const RefreshButton = () => (
    <div className="absolute top-96 right-4 z-10">
      <button
        onClick={() => {
          console.log('🔄 ORDER: Refreshing cross-diagram blocks...');
          loadCrossDiagramBlocks();
        }}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg border-2 border-purple-600 hover:border-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
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
          message="Saving order perspective changes..." 
        />

        <svg
          id="order-architecture-diagram-svg"
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
          {filteredRelationships.map((relationship, index) => (
            <Connection key={`${relationship.source}-${relationship.target}-${index}`} relationship={relationship} />
          ))}

          {/* Render use case connections */}
          {useCaseConnections.map((connection, index) => (
            <UseCaseConnection key={`${connection.blockId}-${connection.containerId}-${connection.elementId}-${index}`} connection={connection} />
          ))}
        </svg>
    </div>
      <SaveButton />
      <BlockLegend />
      <RefreshButton />
    </>
  );
};

// Expose architectureElements and relationships as static properties
OrderReferenceArchitecture.architectureElements = architectureElements;
OrderReferenceArchitecture.relationships = relationships.filter(rel => 
  rel.type !== 'Composition' && 
  rel.source !== 'bp-3.6' && 
  rel.target !== 'bp-3.6'
);

export default OrderReferenceArchitecture; 