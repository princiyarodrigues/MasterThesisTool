import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';

const ArchitectureDiagramSVG = ({ selectedElement, setSelectedElement }) => {
  // Constants for layout - adjusted to match the image
  const DIAGRAM_WIDTH = 1450;
  const DIAGRAM_HEIGHT = 800;
  const TOP_MARGIN = 40;
  const BOX_WIDTH = 150;
  const BOX_HEIGHT = 45;
  const MATERIAL_FLOW_HEIGHT = 40;
  const ROW_SPACING = 120;

  // Colors - matched to the reference image
  const COLORS = {
    topLevel: '#FFF8E0',      // Light yellow for top level boxes
    midLevel: '#E8FFE8',      // Light green for middle level
    bottomLevel: '#E0FFFF',   // Light cyan for bottom level
    selected: '#0091D5',      // Blue for selected elements
    gray: 'rgba(0, 0, 0, 0.2)', // Gray for non-highlighted elements
    border: {
      topLevel: '#FFA500',    // Orange border for top level
      midLevel: '#008800',    // Green border for mid level
      bottomLevel: '#00A0A0', // Teal border for bottom level
    },
    connections: {
      triggering: '#FF6600',  // Orange for triggering
      composition: '#9370DB', // Purple for composition
      access: '#00A0A0',      // Teal for access
      realization: '#008800',  // Green for realization
      custom: '#FF3366'       // Pink for custom connections
    },
    text: '#333333'           // Dark gray for text
  };

  // Track highlighted elements and connections
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [highlightedConnections, setHighlightedConnections] = useState([]);
  
  // Track custom connections from UC blocks
  const [customConnections, setCustomConnections] = useState([]);
  // Add state for connection notification
  const [connectionNotification, setConnectionNotification] = useState(null);
  
  // Reset function to clear all custom connections
  const resetDiagram = () => {
    setCustomConnections([]);
    setHighlightedElement(null);
    setHighlightedConnections([]);
    setSelectedElement(null);
    setConnectionNotification({
      message: 'Diagram reset successfully',
      timestamp: Date.now()
    });
    
    setTimeout(() => {
      setConnectionNotification(null);
    }, 2000);
  };
  
  // Listen for reset events from UCBlocks component
  useEffect(() => {
    const handleReset = () => resetDiagram();
    window.addEventListener('resetArchitectureDiagram', handleReset);
    
    return () => {
      window.removeEventListener('resetArchitectureDiagram', handleReset);
    };
  }, []);
  
  // Define drop target for the SVG
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['UC_BLOCK', 'ELEMENT_BLOCK'],
    drop: (item, monitor) => {
      // Get drop coordinates relative to the SVG
      const dropCoordinates = monitor.getClientOffset();
      
      // Find closest element to the drop point
      let targetElement = 'graphic-model'; // Default
      
      if (elementPositions['graphic-model'] && elementPositions['structure-model']) {
        const graphicModelCenter = {
          x: elementPositions['graphic-model'].x,
          y: elementPositions['graphic-model'].y
        };
        
        const structureModelCenter = {
          x: elementPositions['structure-model'].x,
          y: elementPositions['structure-model'].y
        };
        
        // If drop is closer to structure-model horizontally
        if (Math.abs(dropCoordinates.x - structureModelCenter.x) < 
            Math.abs(dropCoordinates.x - graphicModelCenter.x)) {
          targetElement = 'structure-model';
        }
      }
      
      // Determine connection color and style based on element type
      let connectionColor = '#818cf8'; // Default blue color
      
      if (item.type === 'Equipment') {
        connectionColor = '#10b981'; // Green color for equipment
      }
      
      // Add a custom connection from the element block to the target
      const newConnection = {
        id: `element-connection-${customConnections.length + 1}`,
        from: item.id,
        to: targetElement,
        type: 'custom',
        fromLabel: item.name,
        elementType: item.type,
        color: connectionColor
      };
      
      setCustomConnections([...customConnections, newConnection]);
      
      // Show notification
      setConnectionNotification({
        message: `Connected ${item.name} to ${targetElement === 'graphic-model' ? 'Grafisches Modell' : 'Strukturmodell'}`,
        timestamp: Date.now()
      });
      
      // Clear notification after 2 seconds
      setTimeout(() => {
        setConnectionNotification(null);
      }, 2000);
      
      // Return a result to let the source know the drop was successful
      return { dropped: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  // Define exact positions for the top level boxes - adjusted to reduce gaps
  const positions = {
    topRow: {
      y: TOP_MARGIN,
      xStart: 135,
      xSpacing: 220 // Reduced from 240 to 220
    },
    secondRow: {
      y: TOP_MARGIN + 100,
      xValues: [460, 670] // Adjusted to match the reduced spacing
    },
    processRow: {
      y: TOP_MARGIN + 210,
      xStart: 80,
      xSpacing: 180 // Increased from 155 to 180 to add more spacing between boxes
    },
    dataObjectRow: {
      y: TOP_MARGIN + 330,
      xValues: [180, 350, 540]
    },
    layoutRow: {
      y: TOP_MARGIN + 450,
      xValues: [330, 550, 720]
    },
    modelRow: {
      y: TOP_MARGIN + 570,
      xValues: [250, 450, 620, 790, 960]
    }
  };

  const handleElementClick = (element, event) => {
    event.stopPropagation();
    
    // If clicking the same element again, clear highlighting
    if (highlightedElement === element) {
      setHighlightedElement(null);
      setHighlightedConnections([]);
      setSelectedElement(null);
    } else {
      // Find all connections related to this element
      const relatedConnections = allConnections.filter(conn => 
        conn.from === element || conn.to === element
      );
      
      // Find all elements connected to this element
      const connectedElements = new Set();
      connectedElements.add(element);
      
      relatedConnections.forEach(conn => {
        connectedElements.add(conn.from);
        connectedElements.add(conn.to);
      });
      
      setHighlightedElement(element);
      setHighlightedConnections(relatedConnections);
      setSelectedElement(element);
    }
  };
  
  const handleBackgroundClick = () => {
    setHighlightedElement(null);
    setHighlightedConnections([]);
    setSelectedElement(null);
  };

  // Store element positions
  const elementPositions = {};

  // List of all connections to reference for highlighting
  const allConnections = [];

  // Helper function to create box with text and subtitle
  const Box = ({ x, y, width, height, text, subtitle, id, color, borderColor, fontSize = 12, type = null }) => {
    // Store the box center position for connections
    elementPositions[id] = {
      x: x + width / 2,
      y: y + height / 2,
      top: y,
      right: x + width,
      bottom: y + (subtitle ? height + 20 : height),
      left: x,
      width: width,
      height: height + (subtitle ? 20 : 0)
    };

    // If there's a highlighted element but this element is not connected, gray it out
    const isHighlighted = !highlightedElement || 
      id === highlightedElement || 
      highlightedConnections.some(conn => conn.from === id || conn.to === id);

    return (
      <g 
        transform={`translate(${x}, ${y})`}
        onClick={(e) => handleElementClick(id, e)}
        className="cursor-pointer"
        id={id}
        opacity={isHighlighted ? 1 : 0.4}
      >
        <rect
          x="0"
          y="0"
          width={width}
          height={height + (subtitle ? 20 : 0)}
          rx="6"
          ry="6"
          fill={color}
          stroke={highlightedElement === id ? COLORS.selected : borderColor}
          strokeWidth={highlightedElement === id ? "2" : "1.5"}
        />
        <text 
          x={width/2} 
          y={subtitle ? height/2 - 3 : height/2} 
          textAnchor="middle" 
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight="500"
          fill="#000"
          className="select-none"
        >
          {text}
        </text>
        {subtitle && (
          <text 
            x={width/2} 
            y={height/2 + 15} 
            textAnchor="middle" 
            dominantBaseline="middle"
            fontSize={fontSize - 2}
            fill={COLORS.text}
            className="font-normal select-none"
          >
            {subtitle}
          </text>
        )}
      </g>
    );
  };

  // Add arrow marker definitions for each relationship type
  const ArrowMarkers = () => (
    <>
      <marker
        id="arrowhead-triggering"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 8 3.5, 0 7" fill={COLORS.connections.triggering} />
      </marker>
      <marker
        id="arrowhead-composition"
        markerWidth="10"
        markerHeight="7"
        refX="9" 
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 8 3.5, 0 7" fill={COLORS.connections.composition} />
      </marker>
      <marker
        id="arrowhead-access"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 8 3.5, 0 7" fill={COLORS.connections.access} />
      </marker>
      <marker
        id="arrowhead-realization"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 8 3.5, 0 7" fill={COLORS.connections.realization} />
      </marker>
      <marker
        id="arrowhead-custom"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 8 3.5, 0 7" fill={COLORS.connections.custom} />
      </marker>
      {/* New arrow markers for element types */}
      <marker
        id="arrowhead-equipment"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 8 3.5, 0 7" fill="#10b981" />
      </marker>
      <marker
        id="arrowhead-software"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 8 3.5, 0 7" fill="#818cf8" />
      </marker>
    </>
  );

  // Updated Connection component with better path calculation matching the image
  const Connection = ({ from, to, type = 'triggering', controlPoint = null }) => {
    // Add to all connections for highlighting
    const connectionId = `${from}-${to}-${type}`;
    const connectionExists = allConnections.some(c => 
      c.from === from && c.to === to && c.type === type
    );
    
    if (!connectionExists) {
      allConnections.push({ from, to, type, id: connectionId });
    }
    
    if (!elementPositions[from] || !elementPositions[to]) return null;
    
    const source = elementPositions[from];
    const target = elementPositions[to];
    
    let startX, startY, endX, endY;
    
    // Determine start and end points based on the positions in the reference image
    if (source.y === target.y) {
      // Horizontal connection (same row)
      startX = source.right;
      startY = source.y;
      endX = target.left;
      endY = target.y;
    } else if (Math.abs(source.x - target.x) < 30) {
      // Vertical connection (nearly aligned)
      startX = source.x;
      startY = source.bottom;
      endX = target.x;
      endY = target.top;
    } else if (source.y < target.y) {
      // Downward diagonal
      if (source.x < target.x) {
        // Down-right diagonal
        startX = source.right - 30;
        startY = source.bottom;
        endX = target.left + 30;
        endY = target.top;
      } else {
        // Down-left diagonal
        startX = source.left + 30;
        startY = source.bottom;
        endX = target.right - 30;
        endY = target.top;
      }
    } else {
      // Upward diagonal
      if (source.x < target.x) {
        // Up-right diagonal
        startX = source.right - 20;
        startY = source.y;
        endX = target.left + 20;
        endY = target.bottom;
      } else {
        // Up-left diagonal
        startX = source.left + 20;
        startY = source.y;
        endX = target.right - 20;
        endY = target.bottom;
      }
    }
    
    // Special connection adjustments to match the image
    if ((from === "operation" && to === "service") || 
        (from === "operation" && to === "replanning")) {
      startX = source.x + (to === "service" ? -40 : 40);
      startY = source.bottom;
      endX = target.x;
      endY = target.top;
    }
    
    if (from === "service" && to === "replanning") {
      startX = source.right;
      startY = source.y;
      endX = target.left;
      endY = target.y;
    }
    
    // Map relationship type to styling and color
    const color = COLORS.connections[type] || COLORS.connections.triggering;
    
    // Check if this connection is highlighted
    const isHighlighted = !highlightedElement || 
      highlightedConnections.some(conn => 
        conn.from === from && conn.to === to && conn.type === type
      );
    
    const lineProps = {
      stroke: color,
      strokeWidth: isHighlighted ? 1.5 : 0.9,
      markerEnd: `url(#arrowhead-${type})`,
      strokeDasharray: "none",
      opacity: isHighlighted ? 1 : 0.3,
      fill: "none"
    };

    // For horizontal connections - straight line
    if (Math.abs(source.y - target.y) < BOX_HEIGHT) {
      return <line x1={startX} y1={startY} x2={endX} y2={endY} {...lineProps} />;
    }

    // For vertical connections based on relationship type
    if (type === 'realization') {
      // Green vertical straight lines for realization - exactly as in image
      return <line x1={startX} y1={startY} x2={endX} y2={endY} {...lineProps} />;
    } else if (type === 'access') {
      // Teal lines for access - direct lines as in image
      return <line x1={startX} y1={startY} x2={endX} y2={endY} {...lineProps} />;
    } else {
      // Orange lines for triggering and composition
      const dx = endX - startX;
      const dy = endY - startY;
      
      // For specific connections that need curves to match the image
      if (controlPoint) {
        return (
          <path
            d={`M ${startX} ${startY} C ${controlPoint.x1} ${controlPoint.y1}, ${controlPoint.x2} ${controlPoint.y2}, ${endX} ${endY}`}
            {...lineProps}
          />
        );
      } else if (Math.abs(dx) > BOX_WIDTH * 2 || Math.abs(dy) > BOX_HEIGHT * 2) {
        // Smooth curve for long distances
        return (
          <path
            d={`M ${startX} ${startY} Q ${startX + dx/2} ${startY + dy/3} ${endX} ${endY}`}
            {...lineProps}
          />
        );
      } else {
        // Direct line for shorter connections
        return <line x1={startX} y1={startY} x2={endX} y2={endY} {...lineProps} />;
      }
    }
  };

  // Render a custom connection from a UC block to an element
  const CustomConnection = ({ from, fromLabel, to, type = 'custom', elementType, color }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    if (!elementPositions[to]) return null;
    
    const target = elementPositions[to];
    
    // Position the element block label directly below the target element
    const labelX = target.x;
    const labelY = target.bottom + 35; // Position below the target with some spacing
    
    // Draw a vertical line from the label to the target
    const startX = labelX;
    const startY = labelY - 15;
    const endX = target.x;
    const endY = target.bottom;
    
    // Use the color passed from the drop handler, or fallback to default colors
    const connectionColor = color || COLORS.connections[type] || COLORS.connections.custom;
    
    // Determine background and text colors based on element type
    let bgColor = isHovered ? "#EBF5FF" : "#F3F9FF"; // Default blue colors
    let borderColor = isHovered ? "#3B82F6" : "#60A5FA";
    let textColor = isHovered ? "#1E40AF" : "#2563EB";
    
    // If element is Equipment type, use green styling
    if (elementType === 'Equipment') {
      bgColor = isHovered ? "#ECFDF5" : "#F0FDF9";
      borderColor = isHovered ? "#059669" : "#10B981";
      textColor = isHovered ? "#065F46" : "#047857";
    }
    
    // Function to handle click on the element block to extend connection
    const handleUCBlockClick = (event) => {
      event.stopPropagation();
      
      // Check if we already have a connection to structure-model from this block
      const hasStructureModelConnection = customConnections.some(
        conn => conn.from === from && conn.to === 'structure-model'
      );
      
      // Only allow extending if not already connected
      if (to !== 'structure-model' && !hasStructureModelConnection) {
        // Create a new connection to the structure-model element
        const newConnection = {
          id: `element-connection-extended-${customConnections.length + 1}`,
          from,
          to: 'structure-model',
          type: 'custom',
          fromLabel,
          elementType,
          color: connectionColor
        };
        
        setCustomConnections([...customConnections, newConnection]);
        
        // Show notification
        setConnectionNotification({
          message: 'Connected to Strukturmodell',
          timestamp: Date.now()
        });
        
        // Clear notification after 2 seconds
        setTimeout(() => {
          setConnectionNotification(null);
        }, 2000);
      } else if (hasStructureModelConnection) {
        // Show already connected notification
        setConnectionNotification({
          message: 'Already connected to Strukturmodell',
          timestamp: Date.now()
        });
        
        // Clear notification after 2 seconds
        setTimeout(() => {
          setConnectionNotification(null);
        }, 2000);
      }
    };
    
    return (
      <g>
        {/* Element Block label - make it interactive */}
        <rect
          x={labelX - 80}
          y={labelY - 15}
          width={160}
          height={30}
          rx="4"
          fill={bgColor}
          stroke={borderColor}
          strokeWidth={isHovered ? "2" : "1.5"}
          className="cursor-pointer"
          onClick={handleUCBlockClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fontWeight={isHovered ? "600" : "500"}
          fill={textColor}
          className="cursor-pointer select-none"
          onClick={handleUCBlockClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {fromLabel} {elementType && `(${elementType})`}
        </text>
        
        {/* Tooltip/hint - only show when hovered */}
        {isHovered && to !== 'structure-model' && (
          <g>
            {/* Tooltip background */}
            <rect
              x={labelX - 85}
              y={labelY + 20}
              width={170}
              height={22}
              rx="3"
              fill={elementType === 'Equipment' ? "#059669" : "#4F46E5"}
              opacity="0.9"
            />
            {/* Tooltip text */}
            <text
              x={labelX}
              y={labelY + 31}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={9}
              fontWeight="500"
              fill="white"
              className="select-none"
            >
              Click to connect to Strukturmodell
            </text>
          </g>
        )}
        
        {/* Connection line - straight vertical line */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={isHovered ? (elementType === 'Equipment' ? "#059669" : "#4F46E5") : connectionColor}
          strokeWidth={isHovered ? "2" : "1.5"}
          markerEnd={`url(#arrowhead-${elementType === 'Equipment' ? 'equipment' : elementType === 'Software' ? 'software' : 'custom'})`}
        />
      </g>
    );
  };

  // Add a reset button component
  const ResetButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    
    if (customConnections.length === 0) return null;
    
    return (
      <g
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          resetDiagram();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <rect
          x={DIAGRAM_WIDTH - 120}
          y={10}
          width={100}
          height={30}
          rx="4"
          fill={isHovered ? "#EF4444" : "#F87171"}
          opacity={isHovered ? "1" : "0.9"}
        />
        <text
          x={DIAGRAM_WIDTH - 70}
          y={27}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={12}
          fontWeight="500"
          fill="white"
          className="select-none"
        >
          Reset Diagram
        </text>
      </g>
    );
  };

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${DIAGRAM_WIDTH} ${DIAGRAM_HEIGHT + 100}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ height: "100%" }}
      onClick={handleBackgroundClick}
      className="w-full overflow-hidden bg-white shadow-sm rounded-lg p-2"
      ref={drop}
    >
      <defs>
        <ArrowMarkers />
      </defs>

      {/* Connection Notification */}
      {connectionNotification && (
        <g>
          <rect
            x={(DIAGRAM_WIDTH / 2) - 150}
            y={10}
            width={300}
            height={36}
            rx="6"
            fill="#4F46E5"
            opacity="0.9"
          />
          <text
            x={DIAGRAM_WIDTH / 2}
            y={32}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={14}
            fontWeight="500"
            fill="white"
            className="select-none"
          >
            {connectionNotification.message}
          </text>
        </g>
      )}

      {/* Reset button */}
      <ResetButton />

      {/* Top Level Boxes - Value Stream */}
      <g>
        <Box
          x={positions.topRow.xStart}
          y={positions.topRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="1. Spezifikation & Planung"
          subtitle="Value Stream"
          id="specification"
          color={COLORS.topLevel}
          borderColor={COLORS.border.topLevel}
          fontSize={12}
        />

        <Box
          x={positions.topRow.xStart + positions.topRow.xSpacing}
          y={positions.topRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="2. Aufbau & Inbetriebnahme"
          subtitle="Value Stream"
          id="setup"
          color={COLORS.topLevel}
          borderColor={COLORS.border.topLevel}
          fontSize={12}
        />

        <Box
          x={positions.topRow.xStart + positions.topRow.xSpacing * 2}
          y={positions.topRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="3.0 Betrieb"
          subtitle="Value Stream"
          id="operation"
          color={COLORS.topLevel}
          borderColor={COLORS.border.topLevel}
          fontSize={12}
        />
        
        <Box
          x={positions.topRow.xStart + positions.topRow.xSpacing * 3}
          y={positions.topRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="4. Demontage & Recycling"
          subtitle="Value Stream"
          id="dismantling"
          color={COLORS.topLevel}
          borderColor={COLORS.border.topLevel}
          fontSize={12}
        />

        <Box
          x={positions.secondRow.xValues[0]}
          y={positions.secondRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="3.1 Service & Wartung"
          subtitle="Value Stream"
          id="service"
          color={COLORS.topLevel}
          borderColor={COLORS.border.topLevel}
          fontSize={12}
        />
        
        <Box
          x={positions.secondRow.xValues[1]}
          y={positions.secondRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="3.2 Umplanung"
          subtitle="Value Stream"
          id="replanning"
          color={COLORS.topLevel}
          borderColor={COLORS.border.topLevel}
          fontSize={12}
        />
      </g>

      {/* Middle Level Boxes - Business Process level */}
      <g>
        
        <Box
          x={positions.processRow.xStart + positions.processRow.xSpacing}
          y={positions.processRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="1.2 Engineering"
          subtitle="Business Process"
          id="engineering"
          color={COLORS.midLevel}
          borderColor={COLORS.border.midLevel}
          fontSize={12}
        />
        
        <Box
          x={positions.processRow.xStart + positions.processRow.xSpacing * 2}
          y={positions.processRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="2.1 Aufbau & Anlauf"
          subtitle="Business Process"
          id="setup-start"
          color={COLORS.midLevel}
          borderColor={COLORS.border.midLevel}
          fontSize={12}
        />
        
        <Box
          x={positions.processRow.xStart + positions.processRow.xSpacing * 3}
          y={positions.processRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="3.1 Produktion"
          subtitle="Business Process"
          id="production"
          color={COLORS.midLevel}
          borderColor={COLORS.border.midLevel}
          fontSize={12}
        />
        
        <Box
          x={positions.processRow.xStart + positions.processRow.xSpacing * 4}
          y={positions.processRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="3.2 Instandhaltung & Optimierung"
          subtitle="Business Process"
          id="maintenance"
          color={COLORS.midLevel}
          borderColor={COLORS.border.midLevel}
          fontSize={12}
        />
        
        <Box
          x={positions.processRow.xStart + positions.processRow.xSpacing * 5}
          y={positions.processRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="3.3 Modernisierung"
          subtitle="Business Process"
          id="modernization"
          color={COLORS.midLevel}
          borderColor={COLORS.border.midLevel}
          fontSize={12}
        />
        
        <Box
          x={positions.processRow.xStart + positions.processRow.xSpacing * 6}
          y={positions.processRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="4.1 Demontage, Rückbau"
          subtitle="Business Process"
          id="dismantling-process"
          color={COLORS.midLevel}
          borderColor={COLORS.border.midLevel}
          fontSize={12}
        />
      </g>

      {/* Bottom Level - Data Objects */}
      <g>
        <Box
          x={positions.dataObjectRow.xValues[0]}
          y={positions.dataObjectRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="Arbeitsablaufschema"
          subtitle="Data Object"
          id="workflow"
          color={COLORS.bottomLevel}
          borderColor={COLORS.border.bottomLevel}
          fontSize={12}
        />
        
        <Box
          x={positions.dataObjectRow.xValues[1]}
          y={positions.dataObjectRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="Funktionsschema"
          subtitle="Data Object"
          id="function-schema"
          color={COLORS.bottomLevel}
          borderColor={COLORS.border.bottomLevel}
          fontSize={12}
        />

        {/* Material Flow - wide box */}
        <Box
          x={positions.dataObjectRow.xValues[2]}
          y={positions.dataObjectRow.y}
          width={BOX_WIDTH * 5.2}
          height={MATERIAL_FLOW_HEIGHT}
          text="Materialfluss"
          subtitle="Data Object"
          id="material-flow"
          color={COLORS.bottomLevel}
          borderColor={COLORS.border.bottomLevel}
          fontSize={12}
        />

        {/* Layout Boxes */}
        <Box
          x={positions.layoutRow.xValues[0]}
          y={positions.layoutRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="Groblayout (2D)"
          subtitle="Data Object"
          id="rough-layout"
          color={COLORS.bottomLevel}
          borderColor={COLORS.border.bottomLevel}
          fontSize={12}
        />
        
        <Box
          x={positions.layoutRow.xValues[1]}
          y={positions.layoutRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="Ideallayout (3D)"
          subtitle="Data Object"
          id="ideal-layout"
          color={COLORS.bottomLevel}
          borderColor={COLORS.border.bottomLevel}
          fontSize={12}
        />
        
        <Box
          x={positions.layoutRow.xValues[2]}
          y={positions.layoutRow.y}
          width={BOX_WIDTH * 3.5}
          height={BOX_HEIGHT}
          text="Reallayout (3D)"
          subtitle="Data Object"
          id="real-layout"
          color={COLORS.bottomLevel}
          borderColor={COLORS.border.bottomLevel}
          fontSize={12}
        />

        {/* Model Boxes */}
        <Box
          x={positions.modelRow.xValues[0]}
          y={positions.modelRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="Grafisches Modell"
          subtitle="Data Model"
          id="graphic-model"
          color={"#E8F0FF"}
          borderColor={"#6080C0"}
          fontSize={12}
        />

        <Box
          x={positions.modelRow.xValues[1]}
          y={positions.modelRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="Strukturmodell"
          subtitle="Data Model"
          id="structure-model"
          color={"#E8F0FF"}
          borderColor={"#6080C0"}
          fontSize={12}
        />

        <Box
          x={positions.modelRow.xValues[2]}
          y={positions.modelRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="Materialfluss"
          subtitle="Data Model"
          id="material-flow-model"
          color={"#E8F0FF"}
          borderColor={"#6080C0"}
          fontSize={12}
        />

        <Box
          x={positions.modelRow.xValues[3]}
          y={positions.modelRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="Fähigkeitenmodell"
          subtitle="Data Model"
          id="capability-model"
          color={"#E8F0FF"}
          borderColor={"#6080C0"}
          fontSize={12}
        />

        <Box
          x={positions.modelRow.xValues[4]}
          y={positions.modelRow.y}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          text="Kennzahlenmodell"
          subtitle="Data Model"
          id="kpi-model"
          color={"#E8F0FF"}
          borderColor={"#6080C0"}
          fontSize={12}
        />
      </g>

      {/* Draw connections in specific order for proper layering */}
      
      {/* Value Stream Triggering connections */}
      <Connection from="specification" to="setup" type="triggering" />
      <Connection from="setup" to="operation" type="triggering" />
      <Connection from="setup" to="service" type="triggering" />
      <Connection from="operation" to="dismantling" type="triggering" />
      <Connection from="service" to="replanning" type="triggering" />
      <Connection from="service" to="dismantling" type="triggering" />
      <Connection from="replanning" to="dismantling" type="triggering" />
      
      {/* Value Stream Composition connections */}
      <Connection from="operation" to="service" type="composition" />
      <Connection from="operation" to="replanning" type="composition" />
      
      {/* Business Process Triggering connections */}
      <Connection from="investment" to="engineering" type="triggering" />
      <Connection from="engineering" to="setup-start" type="triggering" />
      <Connection from="setup-start" to="production" type="triggering" />
      <Connection from="production" to="maintenance" type="triggering" />
      <Connection from="maintenance" to="modernization" type="triggering" />
      <Connection from="modernization" to="dismantling-process" type="triggering" />
      
      {/* Realization connections - business processes to value streams */}
      <Connection from="investment" to="specification" type="realization" />
      <Connection from="engineering" to="specification" type="realization" />
      <Connection from="setup-start" to="setup" type="realization" />
      <Connection from="production" to="operation" type="realization" />
      <Connection from="maintenance" to="service" type="realization" />
      <Connection from="modernization" to="replanning" type="realization" />
      <Connection from="dismantling-process" to="dismantling" type="realization" />
      
      {/* Access connections from Engineering */}
      <Connection from="engineering" to="workflow" type="access" />
      <Connection from="engineering" to="function-schema" type="access" />
      <Connection from="engineering" to="material-flow" type="access" />
      <Connection from="engineering" to="rough-layout" type="access" />
      <Connection from="engineering" to="ideal-layout" type="access" />
      
      {/* Access connections from Setup & Anlauf */}
      <Connection from="setup-start" to="material-flow" type="access" />
      <Connection from="setup-start" to="ideal-layout" type="access" />
      <Connection from="setup-start" to="real-layout" type="access" />
      
      {/* Access connections from Produktion */}
      <Connection from="production" to="material-flow" type="access" />
      <Connection from="production" to="real-layout" type="access" />
      
      {/* Access connections from Instandhaltung */}
      <Connection from="maintenance" to="material-flow" type="access" />
      <Connection from="maintenance" to="real-layout" type="access" />
      
      {/* Access connections from Modernisierung */}
      <Connection from="modernization" to="material-flow" type="access" />
      <Connection from="modernization" to="real-layout" type="access" />
      
      {/* Access connections from Demontage */}
      <Connection from="dismantling-process" to="material-flow" type="access" />
      <Connection from="dismantling-process" to="real-layout" type="access" />
      
      {/* Data Object Access connections */}
      <Connection from="workflow" to="rough-layout" type="access" />
      <Connection from="function-schema" to="ideal-layout" type="access" />
      <Connection from="material-flow" to="real-layout" type="access" />
      
      {/* Model connections */}
      <Connection from="rough-layout" to="graphic-model" type="access" />
      <Connection from="rough-layout" to="structure-model" type="access" />
      <Connection from="ideal-layout" to="structure-model" type="access" />
      <Connection from="material-flow" to="material-flow-model" type="access" />
      <Connection from="real-layout" to="capability-model" type="access" />
      <Connection from="real-layout" to="kpi-model" type="access" />
      
      {/* Custom connections from UC blocks */}
      {customConnections.map((conn) => (
        <CustomConnection 
          key={conn.id}
          from={conn.from}
          fromLabel={conn.fromLabel}
          to={conn.to}
          type={conn.type}
          elementType={conn.elementType}
          color={conn.color}
        />
      ))}
    </svg>
  );
};

export default ArchitectureDiagramSVG;