import React, { useState } from 'react';

const ArchitectureDiagram = () => {
  const [hoveredElement, setHoveredElement] = useState(null);
  const [activePerspective, setActivePerspective] = useState('factory');

  // Define colors and styles for different element types
  const colors = {
    valueStream: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      arrow: 'stroke-amber-500'
    },
    businessProcess: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      arrow: 'stroke-green-500'
    },
    dataObject: {
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      text: 'text-cyan-800',
      arrow: 'stroke-cyan-500'
    }
  };

  // Element hover handler
  const handleMouseEnter = (elementId) => {
    setHoveredElement(elementId);
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
  };

  // SVG viewBox dimensions
  const viewBox = "0 0 1300 750";

  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-auto">
      {/* Perspective Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-6 py-2 text-sm font-medium ${
            activePerspective === 'factory' 
              ? 'text-teal-600 border-b-2 border-teal-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActivePerspective('factory')}
        >
          Perspektive Fabrik
        </button>
        <button
          className={`px-6 py-2 text-sm font-medium ${
            activePerspective === 'product' 
              ? 'text-teal-600 border-b-2 border-teal-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActivePerspective('product')}
        >
          Perspektive Produkt
        </button>
        <button
          className={`px-6 py-2 text-sm font-medium ${
            activePerspective === 'order' 
              ? 'text-teal-600 border-b-2 border-teal-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActivePerspective('order')}
        >
          Perspektive Auftrag
        </button>
      </div>

      {/* Architecture Diagram */}
      <div className="relative">
        <svg
          width="100%"
          height="650"
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
          className="bg-white"
        >
          {/* Top section - Value Streams */}
          <g>
            {/* 1. Spezifikation & Planung */}
            <rect 
              x="100" 
              y="50" 
              width="200" 
              height="70" 
              rx="5" 
              className={`fill-amber-50 stroke-amber-200 stroke-1 ${
                hoveredElement === 'vs-1' ? 'stroke-2 stroke-amber-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('vs-1')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="200" y="85" textAnchor="middle" className="text-sm font-medium fill-amber-800">
              1. Spezifikation & Planung
            </text>
            <text x="200" y="105" textAnchor="middle" className="text-xs fill-amber-600">
              Value Stream
            </text>

            {/* 2. Aufbau & Inbetriebnahme */}
            <rect 
              x="350" 
              y="50" 
              width="200" 
              height="70" 
              rx="5" 
              className={`fill-amber-50 stroke-amber-200 stroke-1 ${
                hoveredElement === 'vs-2' ? 'stroke-2 stroke-amber-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('vs-2')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="450" y="85" textAnchor="middle" className="text-sm font-medium fill-amber-800">
              2. Aufbau & Inbetriebnahme
            </text>
            <text x="450" y="105" textAnchor="middle" className="text-xs fill-amber-600">
              Value Stream
            </text>

            {/* 3.0 Betrieb */}
            <rect 
              x="600" 
              y="50" 
              width="200" 
              height="70" 
              rx="5" 
              className={`fill-amber-50 stroke-amber-200 stroke-1 ${
                hoveredElement === 'vs-3' ? 'stroke-2 stroke-amber-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('vs-3')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="700" y="85" textAnchor="middle" className="text-sm font-medium fill-amber-800">
              3.0 Betrieb
            </text>
            <text x="700" y="105" textAnchor="middle" className="text-xs fill-amber-600">
              Value Stream
            </text>

            {/* 4. Demontage & Recycling */}
            <rect 
              x="850" 
              y="50" 
              width="200" 
              height="70" 
              rx="5" 
              className={`fill-amber-50 stroke-amber-200 stroke-1 ${
                hoveredElement === 'vs-4' ? 'stroke-2 stroke-amber-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('vs-4')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="950" y="85" textAnchor="middle" className="text-sm font-medium fill-amber-800">
              4. Demontage & Recycling
            </text>
            <text x="950" y="105" textAnchor="middle" className="text-xs fill-amber-600">
              Value Stream
            </text>

            {/* Value Stream flow lines */}
            <path 
              d="M 300 85 L 350 85" 
              className="stroke-amber-500 stroke-2 fill-none" 
              markerEnd="url(#arrowhead)" 
            />
            <path 
              d="M 550 85 L 600 85" 
              className="stroke-amber-500 stroke-2 fill-none" 
              markerEnd="url(#arrowhead)" 
            />
            <path 
              d="M 800 85 L 850 85" 
              className="stroke-amber-500 stroke-2 fill-none" 
              markerEnd="url(#arrowhead)" 
            />

            {/* Additional Value Streams (middle row) */}
            {/* 3.1 Service & Wartung */}
            <rect 
              x="500" 
              y="150" 
              width="170" 
              height="70" 
              rx="5" 
              className={`fill-amber-50 stroke-amber-200 stroke-1 ${
                hoveredElement === 'vs-3.1' ? 'stroke-2 stroke-amber-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('vs-3.1')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="585" y="185" textAnchor="middle" className="text-sm font-medium fill-amber-800">
              3.1 Service & Wartung
            </text>
            <text x="585" y="205" textAnchor="middle" className="text-xs fill-amber-600">
              Value Stream
            </text>

            {/* 3.2 Umplanung */}
            <rect 
              x="750" 
              y="150" 
              width="170" 
              height="70" 
              rx="5" 
              className={`fill-amber-50 stroke-amber-200 stroke-1 ${
                hoveredElement === 'vs-3.2' ? 'stroke-2 stroke-amber-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('vs-3.2')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="835" y="185" textAnchor="middle" className="text-sm font-medium fill-amber-800">
              3.2 Umplanung
            </text>
            <text x="835" y="205" textAnchor="middle" className="text-xs fill-amber-600">
              Value Stream
            </text>

            {/* Connection lines between value streams */}
            <path d="M 700 120 L 585 150" className="stroke-amber-500 stroke-1 stroke-dasharray-2 fill-none" />
            <path d="M 700 120 L 835 150" className="stroke-amber-500 stroke-1 stroke-dasharray-2 fill-none" />
          </g>

          {/* Middle section - Business Processes */}
          <g>
            {/* 1.1 Investitionsplanung */}
            <rect 
              x="50" 
              y="250" 
              width="150" 
              height="70" 
              rx="5" 
              className={`fill-green-50 stroke-green-200 stroke-1 ${
                hoveredElement === 'bp-1.1' ? 'stroke-2 stroke-green-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('bp-1.1')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="125" y="285" textAnchor="middle" className="text-sm font-medium fill-green-800">
              1.1 Investitionsplanung
            </text>
            <text x="125" y="305" textAnchor="middle" className="text-xs fill-green-600">
              Business Process
            </text>

            {/* 1.2 Engineering */}
            <rect 
              x="225" 
              y="250" 
              width="150" 
              height="70" 
              rx="5" 
              className={`fill-green-50 stroke-green-200 stroke-1 ${
                hoveredElement === 'bp-1.2' ? 'stroke-2 stroke-green-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('bp-1.2')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="300" y="285" textAnchor="middle" className="text-sm font-medium fill-green-800">
              1.2 Engineering
            </text>
            <text x="300" y="305" textAnchor="middle" className="text-xs fill-green-600">
              Business Process
            </text>

            {/* 2.1 Aufbau & Anlauf */}
            <rect 
              x="400" 
              y="250" 
              width="150" 
              height="70" 
              rx="5" 
              className={`fill-green-50 stroke-green-200 stroke-1 ${
                hoveredElement === 'bp-2.1' ? 'stroke-2 stroke-green-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('bp-2.1')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="475" y="285" textAnchor="middle" className="text-sm font-medium fill-green-800">
              2.1 Aufbau & Anlauf
            </text>
            <text x="475" y="305" textAnchor="middle" className="text-xs fill-green-600">
              Business Process
            </text>

            {/* 3.1 Produktion */}
            <rect 
              x="575" 
              y="250" 
              width="150" 
              height="70" 
              rx="5" 
              className={`fill-green-50 stroke-green-200 stroke-1 ${
                hoveredElement === 'bp-3.1' ? 'stroke-2 stroke-green-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('bp-3.1')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="650" y="285" textAnchor="middle" className="text-sm font-medium fill-green-800">
              3.1 Produktion
            </text>
            <text x="650" y="305" textAnchor="middle" className="text-xs fill-green-600">
              Business Process
            </text>

            {/* 3.2 Instandhaltung & Optimierung */}
            <rect 
              x="750" 
              y="250" 
              width="150" 
              height="70" 
              rx="5" 
              className={`fill-green-50 stroke-green-200 stroke-1 ${
                hoveredElement === 'bp-3.2' ? 'stroke-2 stroke-green-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('bp-3.2')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="825" y="275" textAnchor="middle" className="text-sm font-medium fill-green-800">
              3.2 Instandhaltung
            </text>
            <text x="825" y="295" textAnchor="middle" className="text-sm font-medium fill-green-800">
              & Optimierung
            </text>
            <text x="825" y="315" textAnchor="middle" className="text-xs fill-green-600">
              Business Process
            </text>

            {/* 3.3 Modernisierung */}
            <rect 
              x="925" 
              y="250" 
              width="150" 
              height="70" 
              rx="5" 
              className={`fill-green-50 stroke-green-200 stroke-1 ${
                hoveredElement === 'bp-3.3' ? 'stroke-2 stroke-green-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('bp-3.3')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="1000" y="285" textAnchor="middle" className="text-sm font-medium fill-green-800">
              3.3 Modernisierung
            </text>
            <text x="1000" y="305" textAnchor="middle" className="text-xs fill-green-600">
              Business Process
            </text>

            {/* 4.1 Demontage, Rückbau */}
            <rect 
              x="1100" 
              y="250" 
              width="150" 
              height="70" 
              rx="5" 
              className={`fill-green-50 stroke-green-200 stroke-1 ${
                hoveredElement === 'bp-4.1' ? 'stroke-2 stroke-green-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('bp-4.1')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="1175" y="275" textAnchor="middle" className="text-sm font-medium fill-green-800">
              4.1 Demontage,
            </text>
            <text x="1175" y="295" textAnchor="middle" className="text-sm font-medium fill-green-800">
              Rückbau
            </text>
            <text x="1175" y="315" textAnchor="middle" className="text-xs fill-green-600">
              Business Process
            </text>

            {/* Flow lines between business processes */}
            <path 
              d="M 200 285 L 225 285" 
              className="stroke-amber-500 stroke-2 fill-none" 
              markerEnd="url(#arrowhead)" 
            />
            <path 
              d="M 375 285 L 400 285" 
              className="stroke-amber-500 stroke-2 fill-none" 
              markerEnd="url(#arrowhead)" 
            />
            <path 
              d="M 550 285 L 575 285" 
              className="stroke-amber-500 stroke-2 fill-none" 
              markerEnd="url(#arrowhead)" 
            />
            <path 
              d="M 725 285 L 750 285" 
              className="stroke-amber-500 stroke-2 fill-none" 
              markerEnd="url(#arrowhead)" 
            />
            <path 
              d="M 900 285 L 925 285" 
              className="stroke-amber-500 stroke-2 fill-none" 
              markerEnd="url(#arrowhead)" 
            />
            <path 
              d="M 1075 285 L 1100 285" 
              className="stroke-amber-500 stroke-2 fill-none" 
              markerEnd="url(#arrowhead)" 
            />

            {/* Realization connections from Business Processes to Value Streams */}
            <path 
              d="M 300 250 L 200 120" 
              className="stroke-green-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDashed)" 
            />
            <path 
              d="M 475 250 L 450 120" 
              className="stroke-green-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDashed)" 
            />
            <path 
              d="M 650 250 L 700 120" 
              className="stroke-green-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDashed)" 
            />
            <path 
              d="M 825 250 L 585 220" 
              className="stroke-green-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDashed)" 
            />
            <path 
              d="M 1000 250 L 835 220" 
              className="stroke-green-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDashed)" 
            />
            <path 
              d="M 1120 250 L 950 120" 
              className="stroke-green-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDashed)" 
            />
          </g>

          {/* Bottom section - Data Objects */}
          <g>
            {/* Arbeitsablaufschema */}
            <rect 
              x="125" 
              y="400" 
              width="150" 
              height="60" 
              rx="5" 
              className={`fill-cyan-50 stroke-cyan-200 stroke-1 ${
                hoveredElement === 'do-1' ? 'stroke-2 stroke-cyan-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('do-1')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="200" y="430" textAnchor="middle" className="text-sm font-medium fill-cyan-800">
              Arbeitsablaufschema
            </text>
            <text x="200" y="450" textAnchor="middle" className="text-xs fill-cyan-600">
              Data Object
            </text>

            {/* Funktionsschema */}
            <rect 
              x="300" 
              y="400" 
              width="150" 
              height="60" 
              rx="5" 
              className={`fill-cyan-50 stroke-cyan-200 stroke-1 ${
                hoveredElement === 'do-2' ? 'stroke-2 stroke-cyan-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('do-2')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="375" y="430" textAnchor="middle" className="text-sm font-medium fill-cyan-800">
              Funktionsschema
            </text>
            <text x="375" y="450" textAnchor="middle" className="text-xs fill-cyan-600">
              Data Object
            </text>

            {/* Materialfluss */}
            <rect 
              x="470" 
              y="400" 
              width="600" 
              height="60" 
              rx="5" 
              className={`fill-cyan-50 stroke-cyan-200 stroke-1 ${
                hoveredElement === 'do-3' ? 'stroke-2 stroke-cyan-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('do-3')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="770" y="430" textAnchor="middle" className="text-sm font-medium fill-cyan-800">
              Materialfluss
            </text>
            <text x="770" y="450" textAnchor="middle" className="text-xs fill-cyan-600">
              Data Object
            </text>

            {/* Groblayout (2D) */}
            <rect 
              x="230" 
              y="500" 
              width="150" 
              height="60" 
              rx="5" 
              className={`fill-cyan-50 stroke-cyan-200 stroke-1 ${
                hoveredElement === 'do-4' ? 'stroke-2 stroke-cyan-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('do-4')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="305" y="530" textAnchor="middle" className="text-sm font-medium fill-cyan-800">
              Groblayout (2D)
            </text>
            <text x="305" y="550" textAnchor="middle" className="text-xs fill-cyan-600">
              Data Object
            </text>

            {/* Ideallayout (3D) */}
            <rect 
              x="400" 
              y="500" 
              width="180" 
              height="60" 
              rx="5" 
              className={`fill-cyan-50 stroke-cyan-200 stroke-1 ${
                hoveredElement === 'do-5' ? 'stroke-2 stroke-cyan-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('do-5')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="490" y="530" textAnchor="middle" className="text-sm font-medium fill-cyan-800">
              Ideallayout (3D)
            </text>
            <text x="490" y="550" textAnchor="middle" className="text-xs fill-cyan-600">
              Data Object
            </text>

            {/* Reallayout (3D) */}
            <rect 
              x="600" 
              y="500" 
              width="470" 
              height="60" 
              rx="5" 
              className={`fill-cyan-50 stroke-cyan-200 stroke-1 ${
                hoveredElement === 'do-6' ? 'stroke-2 stroke-cyan-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('do-6')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="835" y="530" textAnchor="middle" className="text-sm font-medium fill-cyan-800">
              Reallayout (3D)
            </text>
            <text x="835" y="550" textAnchor="middle" className="text-xs fill-cyan-600">
              Data Object
            </text>

            {/* Data Models Layer */}
            <rect 
              x="200" 
              y="600" 
              width="900" 
              height="120" 
              rx="5" 
              className="fill-gray-50 stroke-gray-200 stroke-1 stroke-dasharray-4"
            />

            {/* Graphisches Modell */}
            <rect 
              x="230" 
              y="640" 
              width="120" 
              height="60" 
              rx="5" 
              className={`fill-cyan-50 stroke-cyan-200 stroke-1 ${
                hoveredElement === 'dm-1' ? 'stroke-2 stroke-cyan-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('dm-1')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="290" y="670" textAnchor="middle" className="text-sm font-medium fill-cyan-800">
              Grafisches Modell
            </text>
            <text x="290" y="690" textAnchor="middle" className="text-xs fill-cyan-600">
              Data Model
            </text>

            {/* Strukturmodell */}
            <rect 
              x="370" 
              y="640" 
              width="120" 
              height="60" 
              rx="5" 
              className={`fill-cyan-50 stroke-cyan-200 stroke-1 ${
                hoveredElement === 'dm-2' ? 'stroke-2 stroke-cyan-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('dm-2')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="430" y="670" textAnchor="middle" className="text-sm font-medium fill-cyan-800">
              Strukturmodell
            </text>
            <text x="430" y="690" textAnchor="middle" className="text-xs fill-cyan-600">
              Data Model
            </text>

            {/* Materialfluss (Data Model) */}
            <rect 
              x="510" 
              y="640" 
              width="120" 
              height="60" 
              rx="5" 
              className={`fill-cyan-50 stroke-cyan-200 stroke-1 ${
                hoveredElement === 'dm-3' ? 'stroke-2 stroke-cyan-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('dm-3')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="570" y="670" textAnchor="middle" className="text-sm font-medium fill-cyan-800">
              Materialfluss
            </text>
            <text x="570" y="690" textAnchor="middle" className="text-xs fill-cyan-600">
              Data Model
            </text>

            {/* Fähigkeitenmodell */}
            <rect 
              x="650" 
              y="640" 
              width="120" 
              height="60" 
              rx="5" 
              className={`fill-cyan-50 stroke-cyan-200 stroke-1 ${
                hoveredElement === 'dm-4' ? 'stroke-2 stroke-cyan-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('dm-4')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="710" y="670" textAnchor="middle" className="text-sm font-medium fill-cyan-800">
              Fähigkeitenmodell
            </text>
            <text x="710" y="690" textAnchor="middle" className="text-xs fill-cyan-600">
              Data Model
            </text>

            {/* Kennzahlenmodell */}
            <rect 
              x="790" 
              y="640" 
              width="120" 
              height="60" 
              rx="5" 
              className={`fill-cyan-50 stroke-cyan-200 stroke-1 ${
                hoveredElement === 'dm-5' ? 'stroke-2 stroke-cyan-400' : ''
              }`}
              onMouseEnter={() => handleMouseEnter('dm-5')}
              onMouseLeave={handleMouseLeave}
            />
            <text x="850" y="670" textAnchor="middle" className="text-sm font-medium fill-cyan-800">
              Kennzahlenmodell
            </text>
            <text x="850" y="690" textAnchor="middle" className="text-xs fill-cyan-600">
              Data Model
            </text>
            
            {/* Model layer labels */}
            <text x="210" y="620" className="text-xs font-medium fill-gray-500">Grafisches Modell</text>
            <text x="560" y="620" className="text-xs font-medium fill-gray-500">Datenmodelle</text>

            {/* Access relationships from Business Processes to Data Objects */}
            {/* 1.2 Engineering to Data Objects */}
            <path 
              d="M 300 320 L 200 400" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />
            <path 
              d="M 300 320 L 375 400" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />
            <path 
              d="M 300 320 L 550 400" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />
            <path 
              d="M 300 320 L 250 500" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />
            <path 
              d="M 300 320 L 420 500" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />

            {/* 2.1 Aufbau & Anlauf to Data Objects */}
            <path 
              d="M 475 320 L 550 400" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />
            <path 
              d="M 475 320 L 650 500" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />

            {/* 3.1 Produktion to Data Objects */}
            <path 
              d="M 650 320 L 600 400" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />
            <path 
              d="M 650 320 L 720 500" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />

            {/* 3.2 Instandhaltung to Data Objects */}
            <path 
              d="M 825 320 L 700 400" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />
            <path 
              d="M 825 320 L 750 500" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />

            {/* 3.3 Modernisierung to Data Objects */}
            <path 
              d="M 1000 320 L 800 400" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />
            <path 
              d="M 1000 320 L 850 500" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />

            {/* 4.1 Demontage to Data Objects */}
            <path 
              d="M 1150 320 L 900 400" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />
            <path 
              d="M 1150 320 L 950 500" 
              className="stroke-cyan-500 stroke-1 stroke-dasharray-2 fill-none" 
              markerEnd="url(#arrowheadDotted)" 
            />

            {/* Composition relationships for Data Models */}
            <path 
              d="M 290 640 L 305 560" 
              className="stroke-blue-500 stroke-1 fill-none" 
              markerEnd="url(#arrowheadComposition)" 
            />
            <path 
              d="M 290 640 L 490 560" 
              className="stroke-blue-500 stroke-1 fill-none" 
              markerEnd="url(#arrowheadComposition)" 
            />
            <path 
              d="M 430 640 L 305 560" 
              className="stroke-blue-500 stroke-1 fill-none" 
              markerEnd="url(#arrowheadComposition)" 
            />
            <path 
              d="M 430 640 L 490 560" 
              className="stroke-blue-500 stroke-1 fill-none" 
              markerEnd="url(#arrowheadComposition)" 
            />
            <path 
              d="M 430 640 L 835 560" 
              className="stroke-blue-500 stroke-1 fill-none" 
              markerEnd="url(#arrowheadComposition)" 
            />
            <path 
              d="M 570 640 L 200 460" 
              className="stroke-blue-500 stroke-1 fill-none" 
              markerEnd="url(#arrowheadComposition)" 
            />
            <path 
              d="M 570 640 L 770 460" 
              className="stroke-blue-500 stroke-1 fill-none" 
              markerEnd="url(#arrowheadComposition)" 
            />
            <path 
              d="M 710 640 L 375 460" 
              className="stroke-blue-500 stroke-1 fill-none" 
              markerEnd="url(#arrowheadComposition)" 
            />
          </g> {/* <-- Close Bottom section 'g' here */}

          {/* Arrow Marker Definitions */}
          <defs>
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-amber-500" />
            </marker>
            <marker
              id="arrowheadDashed"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-green-500" />
            </marker>
            <marker
              id="arrowheadDotted"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-cyan-500" />
            </marker>
            <marker
              id="arrowheadComposition"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-blue-500" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-amber-50 border border-amber-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Value Stream</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Business Process</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-cyan-50 border border-cyan-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Data Object</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Data Model</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Model Layer</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-amber-500 mr-2"></div>
            <span className="text-sm text-gray-600">Triggering</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-green-500 mr-2"></div>
            <span className="text-sm text-gray-600">Realization</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-0.5 border-t border-dotted border-cyan-500 mr-2"></div>
            <span className="text-sm text-gray-600">Access</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-blue-500 mr-2"></div>
            <span className="text-sm text-gray-600">Composition</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
