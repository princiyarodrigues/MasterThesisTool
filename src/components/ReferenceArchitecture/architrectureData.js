// src/components/ReferenceArchitecture/architectureData.js

// Define the architecture elements data
export const architectureElements = [
    { id: '1_spezifikation', name: '1. Spezifikation & Planung', type: 'Value Stream', description: 'Planning and specification phase of the factory lifecycle' },
    { id: '1.1_investitionsplanung', name: '1.1 Investitionsplanung', type: 'Business Process', description: 'Investment planning for factory development' },
    { id: '1.2_engineering', name: '1.2 Engineering', type: 'Business Process', description: 'Technical engineering of factory systems' },
    { id: '2_aufbau', name: '2. Aufbau & Inbetriebnahme', type: 'Value Stream', description: 'Construction and commissioning phase' },
    { id: '2.1_anlauf', name: '2.1 Aufbau & Anlauf', type: 'Business Process', description: 'Construction and initial setup activities' },
    { id: '3.0_betrieb', name: '3.0 Betrieb', type: 'Value Stream', description: 'Operational phase of the factory' },
    { id: '3.1_produktion', name: '3.1 Produktion', type: 'Business Process', description: 'Production operations' },
    { id: '3.1_service', name: '3.1 Service & Wartung', type: 'Value Stream', description: 'Maintenance and service activities' },
    { id: '3.2_instandhaltung', name: '3.2 Instandhaltung & Optimierung', type: 'Business Process', description: 'Maintenance and optimization of factory systems' },
    { id: '3.2_umplanung', name: '3.2 Umplanung', type: 'Value Stream', description: 'Reconfiguration planning' },
    { id: '3.3_modernisierung', name: '3.3 Modernisierung', type: 'Business Process', description: 'Modernization of factory systems' },
    { id: '4_demontage', name: '4. Demontage & Recycling', type: 'Value Stream', description: 'End-of-life phase' },
    { id: '4.1_ruckbau', name: '4.1 Demontage, Rückbau', type: 'Business Process', description: 'Disassembly and recycling activities' },
    { id: 'materialfluss', name: 'Materialfluss', type: 'Data Object', description: 'Material flow information' },
    { id: 'arbeitsablaufschema', name: 'Arbeitsablaufschema', type: 'Data Object', description: 'Work process schema' },
    { id: 'funktionsschema', name: 'Funktionsschema', type: 'Data Object', description: 'Functional schema' },
    { id: 'groblayout', name: 'Groblayout (2D)', type: 'Data Object', description: 'High-level 2D layout' },
    { id: 'ideallayout', name: 'Ideallayout (3D)', type: 'Data Object', description: 'Ideal 3D layout' },
    { id: 'reallayout', name: 'Reallayout (3D)', type: 'Data Object', description: 'Actual 3D layout' },
    { id: 'grafisches_modell', name: 'Grafisches Modell', type: 'Data Object', description: 'Graphical model' },
    { id: 'datenmodelle', name: 'Datenmodelle', type: 'Data Object', description: 'Data models' },
    { id: 'strukturmodell', name: 'Strukturmodell', type: 'Data Object', description: 'Structure model' },
    { id: 'fahigkeitenmodell', name: 'Fähigkeitenmodell', type: 'Data Object', description: 'Capabilities model' },
    { id: 'kennzahlenmodell', name: 'Kennzahlenmodell', type: 'Data Object', description: 'KPI model' }
  ];
  
  // Define relationships between elements
  export const relationships = [
    // Value Stream flow lines (Triggering relationships)
    { id: 'rel-19', type: 'Triggering', source: '1.1 Investitionsplanung', target: '1.2 Engineering' },
    { id: 'rel-20', type: 'Triggering', source: '1. Spezifikation & Planung', target: '2. Aufbau & Inbetriebnahme' },
    { id: 'rel-21', type: 'Triggering', source: '2. Aufbau & Inbetriebnahme', target: '3.0 Betrieb' },
    { id: 'rel-22', type: 'Triggering', source: '3.0 Betrieb', target: '4. Demontage & Recycling' },
    
    // Business Process flow lines (Triggering between processes)
    { id: 'rel-9', type: 'Triggering', source: '1.2 Engineering', target: '2.1 Aufbau & Anlauf' },
    { id: 'rel-11', type: 'Triggering', source: '2.1 Aufbau & Anlauf', target: '3.1 Produktion' },
    { id: 'rel-13', type: 'Triggering', source: '3.1 Produktion', target: '3.2 Instandhaltung & Optimierung' },
    { id: 'rel-15', type: 'Triggering', source: '3.2 Instandhaltung & Optimierung', target: '3.3 Modernisierung' },
    { id: 'rel-17', type: 'Triggering', source: '3.3 Modernisierung', target: '4.1 Demontage, Rückbau' },
    
    // Realization connections (Business Process to Value Stream)
    { id: 'rel-8', type: 'Realization', source: '1.2 Engineering', target: '1. Spezifikation & Planung' },
    { id: 'rel-10', type: 'Realization', source: '2.1 Aufbau & Anlauf', target: '2. Aufbau & Inbetriebnahme' },
    { id: 'rel-12', type: 'Realization', source: '3.1 Produktion', target: '3.0 Betrieb' },
    { id: 'rel-14', type: 'Realization', source: '3.2 Instandhaltung & Optimierung', target: '3.1 Service & Wartung' },
    { id: 'rel-16', type: 'Realization', source: '3.3 Modernisierung', target: '3.2 Umplanung' },
    { id: 'rel-18', type: 'Realization', source: '4.1 Demontage, Rückbau', target: '4. Demontage & Recycling' },
    
    // Access relationships from 1.2 Engineering to Data Objects
    { id: 'rel-23', type: 'Access', source: '1.2 Engineering', target: 'Materialfluss' },
    { id: 'rel-24', type: 'Access', source: '1.2 Engineering', target: 'Funktionsschema' },
    { id: 'rel-25', type: 'Access', source: '1.2 Engineering', target: 'Arbeitsablaufschema' },
    { id: 'rel-26', type: 'Access', source: '1.2 Engineering', target: 'Groblayout (2D)' },
    { id: 'rel-27', type: 'Access', source: '1.2 Engineering', target: 'Ideallayout (3D)' },
    
    // Access relationships from 2.1 Aufbau & Anlauf to Data Objects
    { id: 'rel-28', type: 'Access', source: '2.1 Aufbau & Anlauf', target: 'Materialfluss' },
    { id: 'rel-29', type: 'Access', source: '2.1 Aufbau & Anlauf', target: 'Reallayout (3D)' },
    { id: 'rel-30', type: 'Access', source: '2.1 Aufbau & Anlauf', target: 'Ideallayout (3D)' },
    
    // Access relationships from 3.1 Produktion to Data Objects
    { id: 'rel-31', type: 'Access', source: '3.1 Produktion', target: 'Materialfluss' },
    { id: 'rel-32', type: 'Access', source: '3.1 Produktion', target: 'Reallayout (3D)' },
    
    // Access relationships from 3.2 Instandhaltung & Optimierung to Data Objects
    { id: 'rel-33', type: 'Access', source: '3.2 Instandhaltung & Optimierung', target: 'Materialfluss' },
    { id: 'rel-34', type: 'Access', source: '3.2 Instandhaltung & Optimierung', target: 'Reallayout (3D)' },
    
    // Access relationships from 3.3 Modernisierung to Data Objects
    { id: 'rel-35', type: 'Access', source: '3.3 Modernisierung', target: 'Materialfluss' },
    { id: 'rel-36', type: 'Access', source: '3.3 Modernisierung', target: 'Reallayout (3D)' },
    
    // Access relationships from 4.1 Demontage, Rückbau to Data Objects
    { id: 'rel-37', type: 'Access', source: '4.1 Demontage, Rückbau', target: 'Materialfluss' },
    { id: 'rel-38', type: 'Access', source: '4.1 Demontage, Rückbau', target: 'Reallayout (3D)' },
    
    // Composition relationships for Data Model layer
    { id: 'rel-40', type: 'Composition', source: 'Grafisches Modell', target: 'Grafisches Modell' },
    { id: 'rel-41', type: 'Composition', source: 'Grafisches Modell', target: 'Reallayout (3D)' },
    { id: 'rel-42', type: 'Composition', source: 'Grafisches Modell', target: 'Ideallayout (3D)' },
    { id: 'rel-43', type: 'Composition', source: 'Grafisches Modell', target: 'Groblayout (2D)' },
    
    { id: 'rel-44', type: 'Composition', source: 'Datenmodelle', target: 'Fähigkeitenmodell' },
    { id: 'rel-45', type: 'Composition', source: 'Datenmodelle', target: 'Kennzahlenmodell' },
    { id: 'rel-46', type: 'Composition', source: 'Datenmodelle', target: 'Materialfluss' },
    { id: 'rel-47', type: 'Composition', source: 'Datenmodelle', target: 'Strukturmodell' },
    
    { id: 'rel-48', type: 'Composition', source: 'Strukturmodell', target: 'Reallayout (3D)' },
    { id: 'rel-49', type: 'Composition', source: 'Strukturmodell', target: 'Ideallayout (3D)' },
    { id: 'rel-50', type: 'Composition', source: 'Strukturmodell', target: 'Groblayout (2D)' },
    
    { id: 'rel-51', type: 'Composition', source: 'Materialfluss', target: 'Arbeitsablaufschema' },
    { id: 'rel-52', type: 'Composition', source: 'Materialfluss', target: 'Materialfluss' },
    { id: 'rel-53', type: 'Composition', source: 'Fähigkeitenmodell', target: 'Funktionsschema' }
  ];