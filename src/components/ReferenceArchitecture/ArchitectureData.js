// Define the architecture elements data with positions for rendering
export const architectureElements = [
    // Value Streams (Top row)
    { 
      id: 'vs-1', 
      name: '1. Spezifikation & Planung', 
      type: 'Value Stream', 
      description: 'Planning and specification phase of the factory lifecycle',
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
      description: 'Operational phase of the factory',
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
    
    // Business Processes (Middle row)
    { 
      id: 'bp-1.1', 
      name: '1.1 Investitionsplanung', 
      type: 'Business Process', 
      description: 'Investment planning for factory development',
      x: 50, y: 250, width: 150, height: 70
    },
    { 
      id: 'bp-1.2', 
      name: '1.2 Engineering', 
      type: 'Business Process', 
      description: 'Technical engineering of factory systems',
      x: 225, y: 250, width: 150, height: 70
    },
    { 
      id: 'bp-2.1', 
      name: '2.1 Aufbau & Anlauf', 
      type: 'Business Process', 
      description: 'Construction and initial setup activities',
      x: 400, y: 250, width: 150, height: 70
    },
    { 
      id: 'bp-3.1', 
      name: '3.1 Produktion', 
      type: 'Business Process', 
      description: 'Production operations',
      x: 575, y: 250, width: 150, height: 70
    },
    { 
      id: 'bp-3.2', 
      name: '3.2 Instandhaltung & Optimierung', 
      type: 'Business Process', 
      description: 'Maintenance and optimization of factory systems',
      x: 750, y: 250, width: 150, height: 70
    },
    { 
      id: 'bp-3.3', 
      name: '3.3 Modernisierung', 
      type: 'Business Process', 
      description: 'Modernization of factory systems',
      x: 925, y: 250, width: 150, height: 70
    },
    { 
      id: 'bp-4.1', 
      name: '4.1 Demontage, Rückbau', 
      type: 'Business Process', 
      description: 'Disassembly and recycling activities',
      x: 1100, y: 250, width: 150, height: 70
    },
    
    // Data Objects (Data layer 1)
    { 
      id: 'do-1', 
      name: 'Arbeitsablaufschema', 
      type: 'Data Object', 
      description: 'Work process schema',
      x: 125, y: 400, width: 150, height: 60
    },
    { 
      id: 'do-2', 
      name: 'Funktionsschema', 
      type: 'Data Object', 
      description: 'Functional schema',
      x: 300, y: 400, width: 150, height: 60
    },
    { 
      id: 'do-3', 
      name: 'Materialfluss', 
      type: 'Data Object', 
      description: 'Material flow information',
      x: 470, y: 400, width: 600, height: 60
    },
    
    // Data Objects (Data layer 2)
    { 
      id: 'do-4', 
      name: 'Groblayout (2D)', 
      type: 'Data Object', 
      description: 'High-level 2D layout',
      x: 230, y: 500, width: 150, height: 60
    },
    { 
      id: 'do-5', 
      name: 'Ideallayout (3D)', 
      type: 'Data Object', 
      description: 'Ideal 3D layout',
      x: 400, y: 500, width: 180, height: 60
    },
    { 
      id: 'do-6', 
      name: 'Reallayout (3D)', 
      type: 'Data Object', 
      description: 'Actual 3D layout',
      x: 600, y: 500, width: 470, height: 60
    },
    
    // Data Models (Bottom section)
    { 
      id: 'dm-1', 
      name: 'Grafisches Modell', 
      type: 'Data Model', 
      description: 'Graphical model',
      x: 230, y: 640, width: 120, height: 60
    },
    { 
      id: 'dm-2', 
      name: 'Strukturmodell', 
      type: 'Data Model', 
      description: 'Structure model',
      x: 370, y: 640, width: 120, height: 60
    },
    { 
      id: 'dm-3', 
      name: 'Materialfluss', 
      type: 'Data Model', 
      description: 'Material flow data model',
      x: 510, y: 640, width: 120, height: 60
    },
    { 
      id: 'dm-4', 
      name: 'Fähigkeitenmodell', 
      type: 'Data Model', 
      description: 'Capabilities model',
      x: 650, y: 640, width: 120, height: 60
    },
    { 
      id: 'dm-5', 
      name: 'Kennzahlenmodell', 
      type: 'Data Model', 
      description: 'KPI model',
      x: 790, y: 640, width: 120, height: 60
    }
  ];
  
  // Define the relationships between elements
  export const relationships = [
    // Value Stream flow lines (horizontal flow in top row)
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
      source: 'vs-3', 
      target: 'vs-4',
      description: 'Operation triggers end-of-life',
      sourceX: 800, sourceY: 85, 
      targetX: 850, targetY: 85
    },
    
    // Connections from 3.0 Betrieb to substreams
    {
      id: 'rel-3a',
      type: 'Triggering',
      source: 'vs-3',
      target: 'vs-3.1',
      description: 'Operation triggers service and maintenance',
      sourceX: 650, sourceY: 120,
      targetX: 585, targetY: 150
    },
    {
      id: 'rel-3b',
      type: 'Triggering',
      source: 'vs-3',
      target: 'vs-3.2',
      description: 'Operation triggers reconfiguration planning',
      sourceX: 700, sourceY: 120,
      targetX: 835, targetY: 150
    },
    
    // Business Process flow lines (horizontal flow in middle row)
    { 
      id: 'rel-4', 
      type: 'Triggering', 
      source: 'bp-1.1', 
      target: 'bp-1.2',
      description: 'Investment planning triggers engineering',
      sourceX: 200, sourceY: 285, 
      targetX: 225, targetY: 285
    },
    { 
      id: 'rel-5', 
      type: 'Triggering', 
      source: 'bp-1.2', 
      target: 'bp-2.1',
      description: 'Engineering triggers construction',
      sourceX: 375, sourceY: 285, 
      targetX: 400, targetY: 285
    },
    { 
      id: 'rel-6', 
      type: 'Triggering', 
      source: 'bp-2.1', 
      target: 'bp-3.1',
      description: 'Construction triggers production',
      sourceX: 550, sourceY: 285, 
      targetX: 575, targetY: 285
    },
    { 
      id: 'rel-7', 
      type: 'Triggering', 
      source: 'bp-3.1', 
      target: 'bp-3.2',
      description: 'Production triggers maintenance',
      sourceX: 725, sourceY: 285, 
      targetX: 750, targetY: 285
    },
    { 
      id: 'rel-8', 
      type: 'Triggering', 
      source: 'bp-3.2', 
      target: 'bp-3.3',
      description: 'Maintenance triggers modernization',
      sourceX: 900, sourceY: 285, 
      targetX: 925, targetY: 285
    },
    { 
      id: 'rel-9', 
      type: 'Triggering', 
      source: 'bp-3.3', 
      target: 'bp-4.1',
      description: 'Modernization triggers disassembly',
      sourceX: 1075, sourceY: 285, 
      targetX: 1100, targetY: 285
    },
    
    // Realization connections (Business Process to Value Stream vertical)
    { 
      id: 'rel-10', 
      type: 'Realization', 
      source: 'bp-1.2', 
      target: 'vs-1',
      description: 'Engineering realizes planning',
      sourceX: 300, sourceY: 250, 
      targetX: 200, targetY: 120
    },
    { 
      id: 'rel-11', 
      type: 'Realization', 
      source: 'bp-2.1', 
      target: 'vs-2',
      description: 'Construction realizes commissioning',
      sourceX: 475, sourceY: 250, 
      targetX: 450, targetY: 120
    },
    { 
      id: 'rel-12', 
      type: 'Realization', 
      source: 'bp-3.1', 
      target: 'vs-3',
      description: 'Production realizes operation',
      sourceX: 650, sourceY: 250, 
      targetX: 700, targetY: 120
    },
    { 
      id: 'rel-13', 
      type: 'Realization', 
      source: 'bp-3.2', 
      target: 'vs-3.1',
      description: 'Maintenance realizes service',
      sourceX: 825, sourceY: 250, 
      targetX: 585, targetY: 220
    },
    { 
      id: 'rel-14', 
      type: 'Realization', 
      source: 'bp-3.3', 
      target: 'vs-3.2',
      description: 'Modernization realizes reconfiguration',
      sourceX: 1000, sourceY: 250, 
      targetX: 835, targetY: 220
    },
    { 
      id: 'rel-15', 
      type: 'Realization', 
      source: 'bp-4.1', 
      target: 'vs-4',
      description: 'Disassembly realizes recycling',
      sourceX: 1120, sourceY: 250, 
      targetX: 950, targetY: 120
    },
    
    // Access relationships from Business Processes to Data Objects (first data layer)
    { 
      id: 'rel-16', 
      type: 'Access', 
      source: 'bp-1.2', 
      target: 'do-1',
      description: 'Engineering accesses work schema',
      sourceX: 250, sourceY: 320, 
      targetX: 170, targetY: 400
    },
    { 
      id: 'rel-17', 
      type: 'Access', 
      source: 'bp-1.2', 
      target: 'do-2',
      description: 'Engineering accesses function schema',
      sourceX: 300, sourceY: 320, 
      targetX: 330, targetY: 400
    },
    { 
      id: 'rel-18', 
      type: 'Access', 
      source: 'bp-1.2', 
      target: 'do-3',
      description: 'Engineering accesses material flow',
      sourceX: 325, sourceY: 320, 
      targetX: 550, targetY: 400
    },
    
    // Access relationships from other Business Processes to Material Flow
    {
      id: 'rel-19',
      type: 'Access',
      source: 'bp-2.1',
      target: 'do-3',
      description: 'Construction accesses material flow',
      sourceX: 475, sourceY: 320,
      targetX: 600, targetY: 400
    },
    {
      id: 'rel-20',
      type: 'Access',
      source: 'bp-3.1',
      target: 'do-3',
      description: 'Production accesses material flow',
      sourceX: 650, sourceY: 320,
      targetX: 650, targetY: 400
    },
    {
      id: 'rel-21',
      type: 'Access',
      source: 'bp-3.2',
      target: 'do-3',
      description: 'Maintenance accesses material flow',
      sourceX: 825, sourceY: 320,
      targetX: 700, targetY: 400
    },
    {
      id: 'rel-22',
      type: 'Access',
      source: 'bp-3.3',
      target: 'do-3',
      description: 'Modernization accesses material flow',
      sourceX: 1000, sourceY: 320,
      targetX: 750, targetY: 400
    },
    {
      id: 'rel-23',
      type: 'Access',
      source: 'bp-4.1',
      target: 'do-3',
      description: 'Disassembly accesses material flow',
      sourceX: 1150, sourceY: 320,
      targetX: 800, targetY: 400
    },
    
    // Access from Business Processes to Layout Objects (second data layer)
    {
      id: 'rel-24',
      type: 'Access',
      source: 'bp-1.2',
      target: 'do-4',
      description: 'Engineering accesses 2D layout',
      sourceX: 275, sourceY: 320,
      targetX: 275, targetY: 500
    },
    {
      id: 'rel-25',
      type: 'Access',
      source: 'bp-1.2',
      target: 'do-5',
      description: 'Engineering accesses 3D ideal layout',
      sourceX: 325, sourceY: 320,
      targetX: 450, targetY: 500
    },
    {
      id: 'rel-26',
      type: 'Access',
      source: 'bp-2.1',
      target: 'do-5',
      description: 'Construction accesses 3D ideal layout',
      sourceX: 450, sourceY: 320,
      targetX: 480, targetY: 500
    },
    {
      id: 'rel-27',
      type: 'Access',
      source: 'bp-2.1',
      target: 'do-6',
      description: 'Construction accesses 3D real layout',
      sourceX: 500, sourceY: 320,
      targetX: 650, targetY: 500
    },
    {
      id: 'rel-28',
      type: 'Access',
      source: 'bp-3.1',
      target: 'do-6',
      description: 'Production accesses 3D real layout',
      sourceX: 650, sourceY: 320,
      targetX: 700, targetY: 500
    },
    {
      id: 'rel-29',
      type: 'Access',
      source: 'bp-3.2',
      target: 'do-6',
      description: 'Maintenance accesses 3D real layout',
      sourceX: 825, sourceY: 320,
      targetX: 750, targetY: 500
    },
    {
      id: 'rel-30',
      type: 'Access',
      source: 'bp-3.3',
      target: 'do-6',
      description: 'Modernization accesses 3D real layout',
      sourceX: 1000, sourceY: 320,
      targetX: 800, targetY: 500
    },
    {
      id: 'rel-31',
      type: 'Access',
      source: 'bp-4.1',
      target: 'do-6',
      description: 'Disassembly accesses 3D real layout',
      sourceX: 1150, sourceY: 320,
      targetX: 850, targetY: 500
    },
    
    // Composition relationships for Data Models to Objects
    {
      id: 'rel-32',
      type: 'Composition',
      source: 'dm-1',
      target: 'do-4',
      description: 'Graphical model composes 2D layout',
      sourceX: 290, sourceY: 640,
      targetX: 280, targetY: 560
    },
    {
      id: 'rel-33',
      type: 'Composition',
      source: 'dm-1',
      target: 'do-5',
      description: 'Graphical model composes 3D ideal layout',
      sourceX: 300, sourceY: 640,
      targetX: 450, targetY: 560
    },
    {
      id: 'rel-34',
      type: 'Composition',
      source: 'dm-2',
      target: 'do-4',
      description: 'Structure model composes 2D layout',
      sourceX: 390, sourceY: 640,
      targetX: 300, targetY: 560
    },
    {
      id: 'rel-35',
      type: 'Composition',
      source: 'dm-2',
      target: 'do-5',
      description: 'Structure model composes 3D ideal layout',
      sourceX: 410, sourceY: 640,
      targetX: 480, targetY: 560
    },
    {
      id: 'rel-36',
      type: 'Composition',
      source: 'dm-2',
      target: 'do-6',
      description: 'Structure model composes 3D real layout',
      sourceX: 430, sourceY: 640,
      targetX: 650, targetY: 560
    },
    {
      id: 'rel-37',
      type: 'Composition',
      source: 'dm-3',
      target: 'do-3',
      description: 'Material flow model composes material flow object',
      sourceX: 570, sourceY: 640,
      targetX: 650, targetY: 460
    },
    {
      id: 'rel-38',
      type: 'Composition',
      source: 'dm-3',
      target: 'do-1',
      description: 'Material flow model composes work schema',
      sourceX: 540, sourceY: 640,
      targetX: 170, targetY: 460
    },
    {
      id: 'rel-39',
      type: 'Composition',
      source: 'dm-4',
      target: 'do-2',
      description: 'Capabilities model composes functional schema',
      sourceX: 675, sourceY: 640,
      targetX: 350, targetY: 460
    },
    
    // Additional data connections based on Image 3
    {
      id: 'rel-40',
      type: 'Access',
      source: 'do-1',
      target: 'do-4',
      description: 'Work schema impacts 2D layout',
      sourceX: 170, sourceY: 460,
      targetX: 250, targetY: 500
    },
    {
      id: 'rel-41',
      type: 'Access',
      source: 'do-2',
      target: 'do-5',
      description: 'Function schema impacts 3D ideal layout',
      sourceX: 350, sourceY: 460,
      targetX: 450, targetY: 500
    }
  ];
  
  // Export a function that can find all related elements for a given element
  export const findRelatedElements = (elementId) => {
    if (!elementId) return [];
    
    // Find all relationships where this element is either source or target
    const relevantRelationships = relationships.filter(rel => 
      rel.source === elementId || rel.target === elementId
    );
    
    // Get all elements that are directly connected to this element
    const connectedElements = relevantRelationships.flatMap(rel => {
      return [rel.source, rel.target];
    });
    
    // Create a unique list of related elements
    return [...new Set(connectedElements)];
  };