// Define the architecture elements data with positions for rendering
export const architectureElements = [
    // Value Streams (Top row - Main lifecycle elements)
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
    
    // Additional Value Streams (Second row - sub-elements of 3.0)
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
    
    // PERSPECTIVE LABELS - Side by Side
    {
      id: 'perspective-factory',
      name: 'Perspektive: Fabrik',
      type: 'Model Layer',
      description: 'Factory perspective view',
      x: 50, y: 250, width: 275, height: 30
    },
    {
      id: 'perspective-product',
      name: 'Perspektive: Produkt',
      type: 'Model Layer',
      description: 'Product perspective view',
      x: 350, y: 250, width: 275, height: 30
    },
    {
      id: 'perspective-order',
      name: 'Perspektive: Auftrag',
      type: 'Model Layer',
      description: 'Order perspective view',
      x: 650, y: 250, width: 275, height: 30
    },
    {
      id: 'perspective-manufacturing',
      name: 'Perspektive: Fertigungstechnologie',
      type: 'Model Layer',
      description: 'Manufacturing technology perspective view',
      x: 950, y: 250, width: 275, height: 30
    },
    
    // PERSPECTIVE 1: FABRIK (Factory Perspective) - First column
    { 
      id: 'factory-1.1', 
      name: 'Digitaler Fabrikzwilling: Prozessicht', 
      type: 'Business Process', 
      description: 'Investment planning for factory development',
      x: 100, y: 300, width: 175, height: 50
    },
    { 
      id: 'factory-1.2', 
      name: '1.2 Engineering', 
      type: 'Business Process', 
      description: 'Technical engineering of factory systems',
      x: 100, y: 370, width: 175, height: 50
    },
    { 
      id: 'factory-2.1', 
      name: '2.1 Aufbau & Anlauf', 
      type: 'Business Process', 
      description: 'Construction and initial setup activities',
      x: 100, y: 440, width: 175, height: 50
    },
    { 
      id: 'factory-3.1', 
      name: '3.1 Produktion', 
      type: 'Business Process', 
      description: 'Production operations',
      x: 100, y: 510, width: 175, height: 50
    },
    { 
      id: 'factory-3.2', 
      name: '3.2 Instandhaltung & Optimierung', 
      type: 'Business Process', 
      description: 'Maintenance and optimization of factory systems',
      x: 100, y: 580, width: 175, height: 50
    },
    { 
      id: 'factory-3.3', 
      name: '3.3 Modernisierung', 
      type: 'Business Process', 
      description: 'Modernization of factory systems',
      x: 100, y: 650, width: 175, height: 50
    },
    { 
      id: 'factory-4.1', 
      name: '4.1 Demontage, Rückbau', 
      type: 'Business Process', 
      description: 'Disassembly and recycling activities',
      x: 100, y: 720, width: 175, height: 50
    },
    
    // PERSPECTIVE 2: PRODUKT (Product Perspective) - Second column
    { 
      id: 'product-1.1', 
      name: '1.1 Planung, Entwicklung', 
      type: 'Business Process', 
      description: 'Product planning and development',
      x: 400, y: 300, width: 175, height: 50
    },
    { 
      id: 'product-1.2', 
      name: '1.2 Konstruktion', 
      type: 'Business Process', 
      description: 'Product design and construction',
      x: 400, y: 370, width: 175, height: 50
    },
    { 
      id: 'product-2.1', 
      name: '2.1 Rapid Prototyping', 
      type: 'Business Process', 
      description: 'Rapid prototyping of products',
      x: 400, y: 440, width: 175, height: 50
    },
    { 
      id: 'product-3.1', 
      name: '3.1 Produktion', 
      type: 'Business Process', 
      description: 'Production of products',
      x: 400, y: 510, width: 175, height: 50
    },
    { 
      id: 'product-4.1', 
      name: '4.1 Gebrauch & Service', 
      type: 'Business Process', 
      description: 'Product use and service',
      x: 400, y: 580, width: 175, height: 50
    },
    { 
      id: 'product-4.2', 
      name: '4.2 Recycling, Verschrottung', 
      type: 'Business Process', 
      description: 'Product recycling and disposal',
      x: 400, y: 650, width: 175, height: 50
    },
    
    // PERSPECTIVE 3: AUFTRAG (Order Perspective) - Third column
    { 
      id: 'order-3.1', 
      name: '3.1 Konfiguration, Bestellung', 
      type: 'Business Process', 
      description: 'Order configuration and placement',
      x: 700, y: 300, width: 175, height: 50
    },
    { 
      id: 'order-3.2', 
      name: '3.2 Auftragsbearbeitung', 
      type: 'Business Process', 
      description: 'Order processing',
      x: 700, y: 370, width: 175, height: 50
    },
    { 
      id: 'order-3.3', 
      name: '3.3 Fertigungsauftragsplanung', 
      type: 'Business Process', 
      description: 'Production order planning',
      x: 700, y: 440, width: 175, height: 50
    },
    { 
      id: 'order-3.4', 
      name: '3.4 Produktion', 
      type: 'Business Process', 
      description: 'Production based on orders',
      x: 700, y: 510, width: 175, height: 50
    },
    { 
      id: 'order-3.5', 
      name: '3.5 Kommissionierung & Versand', 
      type: 'Business Process', 
      description: 'Order picking and shipping',
      x: 700, y: 580, width: 175, height: 50
    },
    { 
      id: 'order-3.6', 
      name: '3.6 Auslieferung', 
      type: 'Business Process', 
      description: 'Order delivery',
      x: 700, y: 650, width: 175, height: 50
    },
    
    // PERSPECTIVE 4: FERTIGUNGSTECHNOLOGIE (Manufacturing Technology Perspective) - Fourth column
    { 
      id: 'manufacturing-1.1', 
      name: '1.1 Planung, Entwicklung', 
      type: 'Business Process', 
      description: 'Planning and development of manufacturing technology',
      x: 1000, y: 300, width: 175, height: 50
    },
    { 
      id: 'manufacturing-1.2', 
      name: '1.2 Konstruktion', 
      type: 'Business Process', 
      description: 'Design of manufacturing technology',
      x: 1000, y: 370, width: 175, height: 50
    },
    { 
      id: 'manufacturing-2.1', 
      name: '2.1 Virtuelle Inbetriebnahme', 
      type: 'Business Process', 
      description: 'Virtual commissioning of manufacturing technology',
      x: 1000, y: 440, width: 175, height: 50
    },
    { 
      id: 'manufacturing-3.1', 
      name: '3.1 Produktion', 
      type: 'Business Process', 
      description: 'Production using manufacturing technology',
      x: 1000, y: 510, width: 175, height: 50
    },
    { 
      id: 'manufacturing-3.2', 
      name: '3.2 Instandhaltung & Optimierung', 
      type: 'Business Process', 
      description: 'Maintenance and optimization of manufacturing technology',
      x: 1000, y: 580, width: 175, height: 50
    },
    { 
      id: 'manufacturing-4.1', 
      name: '4.1 Modernisierung, Recycling', 
      type: 'Business Process', 
      description: 'Modernization and recycling of manufacturing technology',
      x: 1000, y: 650, width: 175, height: 50
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
    
    // PERSPECTIVE 1: FABRIK - Vertical flow between factory processes
    { 
      id: 'factory-rel-1', 
      type: 'Triggering', 
      source: 'factory-1.1', 
      target: 'factory-1.2',
      description: 'Investment planning triggers engineering'
    },
    { 
      id: 'factory-rel-2', 
      type: 'Triggering', 
      source: 'factory-1.2', 
      target: 'factory-2.1',
      description: 'Engineering triggers construction'
    },
    { 
      id: 'factory-rel-3', 
      type: 'Triggering', 
      source: 'factory-2.1', 
      target: 'factory-3.1',
      description: 'Construction triggers production'
    },
    { 
      id: 'factory-rel-4', 
      type: 'Triggering', 
      source: 'factory-3.1', 
      target: 'factory-3.2',
      description: 'Production triggers maintenance'
    },
    { 
      id: 'factory-rel-5', 
      type: 'Triggering', 
      source: 'factory-3.2', 
      target: 'factory-3.3',
      description: 'Maintenance triggers modernization'
    },
    { 
      id: 'factory-rel-6', 
      type: 'Triggering', 
      source: 'factory-3.3', 
      target: 'factory-4.1',
      description: 'Modernization triggers disassembly'
    },
    
    // PERSPECTIVE 2: PRODUKT - Vertical flow between product processes
    { 
      id: 'product-rel-1', 
      type: 'Triggering', 
      source: 'product-1.1', 
      target: 'product-1.2',
      description: 'Planning triggers construction'
    },
    { 
      id: 'product-rel-2', 
      type: 'Triggering', 
      source: 'product-1.2', 
      target: 'product-2.1',
      description: 'Construction triggers prototyping'
    },
    { 
      id: 'product-rel-3', 
      type: 'Triggering', 
      source: 'product-2.1', 
      target: 'product-3.1',
      description: 'Prototyping triggers production'
    },
    { 
      id: 'product-rel-4', 
      type: 'Triggering', 
      source: 'product-3.1', 
      target: 'product-4.1',
      description: 'Production triggers use and service'
    },
    { 
      id: 'product-rel-5', 
      type: 'Triggering', 
      source: 'product-4.1', 
      target: 'product-4.2',
      description: 'Use triggers recycling'
    },
    
    // PERSPECTIVE 3: AUFTRAG - Vertical flow between order processes
    { 
      id: 'order-rel-1', 
      type: 'Triggering', 
      source: 'order-3.1', 
      target: 'order-3.2',
      description: 'Configuration triggers processing'
    },
    { 
      id: 'order-rel-2', 
      type: 'Triggering', 
      source: 'order-3.2', 
      target: 'order-3.3',
      description: 'Processing triggers planning'
    },
    { 
      id: 'order-rel-3', 
      type: 'Triggering', 
      source: 'order-3.3', 
      target: 'order-3.4',
      description: 'Planning triggers production'
    },
    { 
      id: 'order-rel-4', 
      type: 'Triggering', 
      source: 'order-3.4', 
      target: 'order-3.5',
      description: 'Production triggers picking'
    },
    { 
      id: 'order-rel-5', 
      type: 'Triggering', 
      source: 'order-3.5', 
      target: 'order-3.6',
      description: 'Picking triggers delivery'
    },
    
    // PERSPECTIVE 4: FERTIGUNGSTECHNOLOGIE - Vertical flow between manufacturing processes
    { 
      id: 'manufacturing-rel-1', 
      type: 'Triggering', 
      source: 'manufacturing-1.1', 
      target: 'manufacturing-1.2',
      description: 'Planning triggers construction'
    },
    { 
      id: 'manufacturing-rel-2', 
      type: 'Triggering', 
      source: 'manufacturing-1.2', 
      target: 'manufacturing-2.1',
      description: 'Construction triggers virtual commissioning'
    },
    { 
      id: 'manufacturing-rel-3', 
      type: 'Triggering', 
      source: 'manufacturing-2.1', 
      target: 'manufacturing-3.1',
      description: 'Virtual commissioning triggers production'
    },
    { 
      id: 'manufacturing-rel-4', 
      type: 'Triggering', 
      source: 'manufacturing-3.1', 
      target: 'manufacturing-3.2',
      description: 'Production triggers maintenance'
    },
    { 
      id: 'manufacturing-rel-5', 
      type: 'Triggering', 
      source: 'manufacturing-3.2', 
      target: 'manufacturing-4.1',
      description: 'Maintenance triggers modernization'
    },
    
    // VERTICAL CONNECTIONS: Top-level elements to perspective elements
    // Factory perspective
    {
      id: 'vs1-factory',
      type: 'Realization',
      source: 'factory-1.1',
      target: 'vs-1',
      description: 'Factory planning realizes specification phase'
    },
    {
      id: 'vs2-factory',
      type: 'Realization',
      source: 'factory-2.1',
      target: 'vs-2',
      description: 'Factory setup realizes construction phase'
    },
    {
      id: 'vs3-factory',
      type: 'Realization',
      source: 'factory-3.1',
      target: 'vs-3',
      description: 'Factory production realizes operation phase'
    },
    {
      id: 'vs4-factory',
      type: 'Realization',
      source: 'factory-4.1',
      target: 'vs-4',
      description: 'Factory dismantling realizes end-of-life phase'
    },
    
    // Product perspective
    {
      id: 'vs1-product',
      type: 'Realization',
      source: 'product-1.1',
      target: 'vs-1',
      description: 'Product planning realizes specification phase'
    },
    {
      id: 'vs2-product',
      type: 'Realization',
      source: 'product-2.1',
      target: 'vs-2',
      description: 'Product prototyping realizes construction phase'
    },
    {
      id: 'vs3-product',
      type: 'Realization',
      source: 'product-3.1',
      target: 'vs-3',
      description: 'Product production realizes operation phase'
    },
    {
      id: 'vs4-product',
      type: 'Realization',
      source: 'product-4.1',
      target: 'vs-4',
      description: 'Product usage realizes end-of-life phase'
    },
    
    // Order perspective (all connected to Betrieb since orders are operational)
    {
      id: 'vs3-order1',
      type: 'Realization',
      source: 'order-3.1',
      target: 'vs-3',
      description: 'Order processes realize operation phase'
    },
    {
      id: 'vs3-order2',
      type: 'Realization',
      source: 'order-3.3',
      target: 'vs-3',
      description: 'Order processes realize operation phase'
    },
    {
      id: 'vs3-order3',
      type: 'Realization',
      source: 'order-3.4',
      target: 'vs-3.1',
      description: 'Order production realizes service and maintenance'
    },
    
    // Manufacturing perspective
    {
      id: 'vs1-manufacturing',
      type: 'Realization',
      source: 'manufacturing-1.1',
      target: 'vs-1',
      description: 'Manufacturing planning realizes specification phase'
    },
    {
      id: 'vs2-manufacturing',
      type: 'Realization',
      source: 'manufacturing-2.1',
      target: 'vs-2',
      description: 'Virtual commissioning realizes construction phase'
    },
    {
      id: 'vs3-manufacturing',
      type: 'Realization',
      source: 'manufacturing-3.1',
      target: 'vs-3',
      description: 'Manufacturing production realizes operation phase'
    },
    {
      id: 'vs31-manufacturing',
      type: 'Realization',
      source: 'manufacturing-3.2',
      target: 'vs-3.1',
      description: 'Manufacturing maintenance realizes service phase'
    },
    {
      id: 'vs32-manufacturing',
      type: 'Realization',
      source: 'manufacturing-3.2',
      target: 'vs-3.2',
      description: 'Manufacturing optimization realizes reconfiguration'
    },
    {
      id: 'vs4-manufacturing',
      type: 'Realization',
      source: 'manufacturing-4.1',
      target: 'vs-4',
      description: 'Manufacturing modernization realizes end-of-life phase'
    }
  ];
  
  // Helper function to find elements related to a specific element
  export const findRelatedElements = (elementId) => {
    if (!elementId) return [];
    
    // Find all relationships where the element is involved
    const relatedRelationships = relationships.filter(
      rel => rel.source === elementId || rel.target === elementId
    );
    
    // Extract the related element IDs
    const relatedElementIds = relatedRelationships.flatMap(rel => {
      const ids = [];
      if (rel.source !== elementId) ids.push(rel.source);
      if (rel.target !== elementId) ids.push(rel.target);
      return ids;
    });
    
    // Return unique related elements
    return [...new Set(relatedElementIds)];
  };