// Export all Reference Architecture components
import ReferenceArchitecture from './ReferenceArchitecture';
import InteractiveArchitectureDiagram from './InteractiveArchitectureDiagram';
import ElementDetailModal from './ElementDetailModal';
import { architectureElements, relationships, findRelatedElements } from './ArchitectureData';
import calculatePath from './PathCalculation';

// Main component
export default ReferenceArchitecture;

// Individual components and utilities for advanced usage
export {
  InteractiveArchitectureDiagram,
  ElementDetailModal,
  architectureElements,
  relationships,
  findRelatedElements,
  calculatePath
};