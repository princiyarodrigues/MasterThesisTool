// Advanced path calculation for architecture diagram relationships
import { architectureElements } from './ArchitectureData';

/**
 * Calculate SVG path for a relationship between two elements
 * @param {Object} rel - Relationship object containing source and target IDs
 * @returns {string} - SVG path string
 */
export const calculatePath = (rel) => {
  // If we have explicit coordinates in the relationship, use those
  if (rel.sourceX !== undefined && rel.sourceY !== undefined && 
      rel.targetX !== undefined && rel.targetY !== undefined) {
    return `M ${rel.sourceX} ${rel.sourceY} L ${rel.targetX} ${rel.targetY}`;
  }
  
  // Otherwise calculate based on element positions
  const sourceElement = architectureElements.find(el => el.id === rel.source);
  const targetElement = architectureElements.find(el => el.id === rel.target);
  
  if (!sourceElement || !targetElement) {
    console.warn(`Missing element for relationship: ${rel.id}`);
    return ''; // Return empty path if elements not found
  }
  
  // Calculate center points of elements
  const sourceX = sourceElement.x + sourceElement.width / 2;
  const sourceY = sourceElement.y + sourceElement.height / 2;
  const targetX = targetElement.x + targetElement.width / 2;
  const targetY = targetElement.y + targetElement.height / 2;
  
  // Calculate the closest points on the element borders
  const sourceBorderPoint = getIntersectionPoint(
    sourceX, sourceY, targetX, targetY, 
    sourceElement.x, sourceElement.y, 
    sourceElement.width, sourceElement.height
  );
  
  const targetBorderPoint = getIntersectionPoint(
    targetX, targetY, sourceX, sourceY, 
    targetElement.x, targetElement.y, 
    targetElement.width, targetElement.height
  );
  
  // Use border points if available
  const startX = sourceBorderPoint ? sourceBorderPoint.x : sourceX;
  const startY = sourceBorderPoint ? sourceBorderPoint.y : sourceY;
  const endX = targetBorderPoint ? targetBorderPoint.x : targetX;
  const endY = targetBorderPoint ? targetBorderPoint.y : targetY;
  
  // Handle different relationship types with different path styles
  switch (rel.type) {
    case 'Triggering':
      // For horizontal relationships (similar y values)
      if (Math.abs(startY - endY) < 50) {
        return `M ${startX} ${startY} L ${endX} ${endY}`;
      }
      // For vertical relationships, use curved paths
      return `M ${startX} ${startY} C ${startX + (endX - startX) / 2} ${startY}, ${endX - (endX - startX) / 2} ${endY}, ${endX} ${endY}`;
      
    case 'Realization':
      // For relationships that go upward (business process to value stream)
      if (startY > endY) {
        return `M ${startX} ${startY} C ${startX} ${startY - 50}, ${endX} ${endY + 50}, ${endX} ${endY}`;
      }
      // For other realization relationships, use a simple curve
      return `M ${startX} ${startY} Q ${(startX + endX) / 2} ${(startY + endY) / 2 - 30}, ${endX} ${endY}`;
      
    case 'Access':
      // For data access relationships (mostly vertical)
      if (Math.abs(startX - endX) < 50) {
        return `M ${startX} ${startY} L ${endX} ${endY}`;
      }
      
      // For diagonal data access relationships
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      return `M ${startX} ${startY} Q ${midX + 20} ${midY - 20}, ${endX} ${endY}`;
    
    case 'Composition':
      // Composition relationships (mostly from bottom to top)
      const controlX1 = startX;
      const controlY1 = startY - (startY - endY) / 3;
      const controlX2 = endX;
      const controlY2 = endY + (startY - endY) / 3;
      return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
      
    default:
      // Default straight line
      return `M ${startX} ${startY} L ${endX} ${endY}`;
  }
};

/**
 * Find intersection point between a line and a rectangle
 * @param {number} x1 - Starting point X (center of source)
 * @param {number} y1 - Starting point Y (center of source)
 * @param {number} x2 - Ending point X (center of target)
 * @param {number} y2 - Ending point Y (center of target)
 * @param {number} rectX - Rectangle top-left X
 * @param {number} rectY - Rectangle top-left Y
 * @param {number} rectWidth - Rectangle width
 * @param {number} rectHeight - Rectangle height
 * @returns {Object|null} - Intersection point {x, y} or null if no intersection
 */
function getIntersectionPoint(x1, y1, x2, y2, rectX, rectY, rectWidth, rectHeight) {
  // Expand rectangle slightly to account for border width
  const padding = 2;
  const left = rectX - padding;
  const right = rectX + rectWidth + padding;
  const top = rectY - padding;
  const bottom = rectY + rectHeight + padding;
  
  // Check if starting point is inside the rectangle (avoid self-intersections)
  if (x1 >= left && x1 <= right && y1 >= top && y1 <= bottom) {
    return null;
  }
  
  // Calculate slope and y-intercept of the line
  const dx = x2 - x1;
  const dy = y2 - y1;
  
  // Handle vertical line
  if (Math.abs(dx) < 0.001) {
    // Check if the vertical line intersects the rectangle
    if (x1 >= left && x1 <= right && ((y1 < top && y2 > bottom) || (y2 < top && y1 > bottom))) {
      // Return the top or bottom intersection based on the direction
      if (y1 < y2) {
        return { x: x1, y: top };
      } else {
        return { x: x1, y: bottom };
      }
    }
    return null;
  }
  
  // Handle horizontal line
  if (Math.abs(dy) < 0.001) {
    // Check if the horizontal line intersects the rectangle
    if (y1 >= top && y1 <= bottom && ((x1 < left && x2 > right) || (x2 < left && x1 > right))) {
      // Return the left or right intersection based on the direction
      if (x1 < x2) {
        return { x: left, y: y1 };
      } else {
        return { x: right, y: y1 };
      }
    }
    return null;
  }
  
  // For non-horizontal, non-vertical lines
  const m = dy / dx;
  const b = y1 - m * x1;
  
  // Check all four sides for intersection
  const intersections = [];
  
  // Check top side
  const topX = (top - b) / m;
  if (topX >= left && topX <= right) {
    intersections.push({ x: topX, y: top, dist: Math.pow(topX - x1, 2) + Math.pow(top - y1, 2) });
  }
  
  // Check right side
  const rightY = m * right + b;
  if (rightY >= top && rightY <= bottom) {
    intersections.push({ x: right, y: rightY, dist: Math.pow(right - x1, 2) + Math.pow(rightY - y1, 2) });
  }
  
  // Check bottom side
  const bottomX = (bottom - b) / m;
  if (bottomX >= left && bottomX <= right) {
    intersections.push({ x: bottomX, y: bottom, dist: Math.pow(bottomX - x1, 2) + Math.pow(bottom - y1, 2) });
  }
  
  // Check left side
  const leftY = m * left + b;
  if (leftY >= top && leftY <= bottom) {
    intersections.push({ x: left, y: leftY, dist: Math.pow(left - x1, 2) + Math.pow(leftY - y1, 2) });
  }
  
  // Find the closest intersection to the starting point
  if (intersections.length > 0) {
    intersections.sort((a, b) => a.dist - b.dist);
    return { x: intersections[0].x, y: intersections[0].y };
  }
  
  return null;
}

/**
 * Check if a point lies on a line segment
 * @param {number} x1 - Line start X
 * @param {number} y1 - Line start Y
 * @param {number} x2 - Line end X
 * @param {number} y2 - Line end Y
 * @param {number} px - Point X
 * @param {number} py - Point Y
 * @returns {boolean} - True if point is on the line segment
 */
function isPointOnLineSegment(x1, y1, x2, y2, px, py) {
  // Check if the point lies on the line (with some small epsilon for floating point errors)
  const crossProduct = Math.abs((py - y1) * (x2 - x1) - (px - x1) * (y2 - y1));
  if (crossProduct > 0.1) return false;
  
  // Check if the point is within the bounds of the line segment
  const dotProduct = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1));
  if (dotProduct < 0) return false;
  
  const squaredLength = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (dotProduct > squaredLength) return false;
  
  return true;
}

export default calculatePath;