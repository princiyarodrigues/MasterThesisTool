import React, { useState } from 'react';

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

const OrderReferenceArchitecture = ({ selectedElement, setSelectedElement, departmentId = 'operations' }) => {
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [highlightedConnections, setHighlightedConnections] = useState([]);

  // Get the currently selected element's data
  const selectedElementData = selectedElement 
    ? architectureElements.find(el => el.id === selectedElement) 
    : null;
    
  // Filter relationships based on selected element
  const incomingRelationships = selectedElement
    ? relationships.filter(rel => rel.target === selectedElement)
    : [];
  
  const outgoingRelationships = selectedElement
    ? relationships.filter(rel => rel.source === selectedElement)
    : [];

  // Calculate path for relationship lines
  const calculatePath = (rel) => {
    const sourceX = rel.sourceX || 0;
    const sourceY = rel.sourceY || 0;
    const targetX = rel.targetX || 100;
    const targetY = rel.targetY || 100;
    
    if (rel.type === 'Triggering') {
      return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
    } else {
      // Add a curved path for non-triggering relationships
      const midX = (sourceX + targetX) / 2;
      const midY = (sourceY + targetY) / 2 - 20;
      return `M ${sourceX} ${sourceY} Q ${midX} ${midY}, ${targetX} ${targetY}`;
    }
  };

  // Handle clicking an element
  const handleElementClick = (elementId, event) => {
    event.stopPropagation();
    setSelectedElement(elementId === selectedElement ? null : elementId);
  };

  // Handle clicking the background
  const handleBackgroundClick = () => {
    setSelectedElement(null);
  };

  // Get element styling based on selection state
  const getElementStyle = (elementId) => {
    if (elementId === selectedElement) {
      return 'stroke-blue-500 stroke-[2px]';
    }
    
    if (selectedElement) {
      // Highlight elements connected to the selected element
      const isConnected = relationships.some(rel => 
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

  return (
    <div className="h-full relative">
      {/* Display the diagram */}
      <div className="h-[calc(100vh-190px)] overflow-auto" onClick={handleBackgroundClick}>
        <svg 
          width="100%" 
          height="1200" 
          viewBox="0 0 1500 1200"
          className="border-0"
        >
          {/* Arrow markers definition */}
          <defs>
            <marker
              id="arrow-triggering"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#F59E0B" />
            </marker>
            <marker
              id="arrow-access"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#06B6D4" />
            </marker>
            <marker
              id="arrow-realization"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
            </marker>
            <marker
              id="arrow-composition"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6" />
            </marker>
          </defs>
          
          {/* Render relationships */}
          {relationships.map((rel) => {
            const typeStyles = getRelationshipTypeStyles(rel.type);
            return (
              <path
                key={rel.id}
                d={calculatePath(rel)}
                className={`${typeStyles.stroke} ${getRelationshipStyle(rel)} transition-all duration-300`}
                markerEnd={typeStyles.marker}
                fill="none"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Render elements */}
          {architectureElements.map((element) => {
            const colors = getElementTypeColors(element.type);
            
            return (
              <g 
                key={element.id}
                onClick={(e) => handleElementClick(element.id, e)}
                className="cursor-pointer"
              >
                <rect
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  rx="5"
                  className={`${colors.fill} ${colors.stroke} ${getElementStyle(element.id)} transition-all duration-300`}
                />
                
                <text
                  x={element.x + element.width / 2}
                  y={element.y + (element.height / 2) - 5}
                  textAnchor="middle"
                  className={`text-sm font-medium ${colors.text} transition-all duration-300 ${
                    selectedElement && element.id !== selectedElement && 
                    !relationships.some(rel => 
                      (rel.source === selectedElement && rel.target === element.id) ||
                      (rel.target === selectedElement && rel.source === element.id)
                    ) 
                      ? 'opacity-50' 
                      : ''
                  }`}
                >
                  {element.name}
                </text>
                
                <text
                  x={element.x + element.width / 2}
                  y={element.y + (element.height / 2) + 15}
                  textAnchor="middle"
                  className={`text-xs ${colors.text} transition-all duration-300 ${
                    selectedElement && element.id !== selectedElement && 
                    !relationships.some(rel => 
                      (rel.source === selectedElement && rel.target === element.id) ||
                      (rel.target === selectedElement && rel.source === element.id)
                    ) 
                      ? 'opacity-50' 
                      : ''
                  }`}
                >
                  {element.type}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setSelectedElement(null);
        }}
        className="absolute top-2 left-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1 rounded text-sm"
      >
        Reset
      </button>
    </div>
  );
};

// Expose architectureElements and relationships as static properties
OrderReferenceArchitecture.architectureElements = architectureElements;
OrderReferenceArchitecture.relationships = relationships;

export default OrderReferenceArchitecture; 