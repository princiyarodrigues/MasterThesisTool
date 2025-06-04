import React, { useState } from 'react';

const DigitalFactoryArchitecture = ({ selectedElement, setSelectedElement }) => {
  const [viewMode, setViewMode] = useState('default');
  
  // Handle element selection
  const handleElementClick = (elementId) => {
    setSelectedElement(elementId === selectedElement ? null : elementId);
  };
  
  return (
    <div className="w-full h-full relative">
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Digital Factory Reference Architecture</h3>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 text-xs rounded ${viewMode === 'default' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setViewMode('default')}
            >
              Default View
            </button>
            <button
              className={`px-3 py-1 text-xs rounded ${viewMode === 'simplified' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setViewMode('simplified')}
            >
              Simplified View
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-2 h-[calc(100vh-160px)] overflow-auto">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1200 740" 
          preserveAspectRatio="xMidYMid meet"
          className="architecture-diagram"
        >
          {/* Top Level: Frontend and Backend */}
          <g>
            {/* Frontend Component */}
            <rect
              x={180}
              y={20}
              width={320}
              height={60}
              rx="5"
              className="fill-cyan-100 stroke-cyan-500 stroke-1"
            />
            <text
              x={340}
              y={50}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-sm font-medium fill-gray-700"
            >
              Frontend Digitaler Fabrikzwilling
            </text>
            
            {/* Backend Component */}
            <rect
              x={640}
              y={20}
              width={320}
              height={60}
              rx="5"
              className="fill-cyan-100 stroke-cyan-500 stroke-1"
            />
            <text
              x={800}
              y={50}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-sm font-medium fill-gray-700"
            >
              Backend Digitaler Fabrikzwilling
            </text>
          </g>
          
          {/* Middle Level: Perspectives */}
          <g>
            {/* Perspective Fabrik */}
            <rect
              x={120}
              y={180}
              width={200}
              height={50}
              rx="5"
              className="fill-teal-100 stroke-teal-500 stroke-1"
              onClick={() => handleElementClick('perspective-fabrik')}
            />
            <text
              x={220}
              y={205}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-sm font-medium fill-gray-700"
            >
              Perspektive Fabrik
            </text>
            
            {/* Perspective Produkt */}
            <rect
              x={380}
              y={180}
              width={200}
              height={50}
              rx="5"
              className="fill-teal-100 stroke-teal-500 stroke-1"
              onClick={() => handleElementClick('perspective-produkt')}
            />
            <text
              x={480}
              y={205}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-sm font-medium fill-gray-700"
            >
              Perspektive Produkt
            </text>
            
            {/* Perspective Auftrag */}
            <rect
              x={640}
              y={180}
              width={200}
              height={50}
              rx="5"
              className="fill-teal-100 stroke-teal-500 stroke-1"
              onClick={() => handleElementClick('perspective-auftrag')}
            />
            <text
              x={740}
              y={205}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-sm font-medium fill-gray-700"
            >
              Perspektive Auftrag
            </text>
            
            {/* Perspective Fertigungstechnologie */}
            <rect
              x={900}
              y={180}
              width={200}
              height={50}
              rx="5"
              className="fill-teal-100 stroke-teal-500 stroke-1"
              onClick={() => handleElementClick('perspective-fertigung')}
            />
            <text
              x={1000}
              y={205}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-sm font-medium fill-gray-700"
            >
              Perspektive Fertigungstechnologie
            </text>
          </g>
          
          {/* Data Model Level */}
          <g>
            <rect
              x={50}
              y={280}
              width={1100}
              height={200}
              rx="5"
              className="fill-blue-50 stroke-blue-300 stroke-1"
            />
            <text
              x={600}
              y={300}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-sm font-medium fill-gray-700"
            >
              Datenmodell Digitaler Fabrikzwilling (&quot;Digital Thread&quot;)
            </text>
            
            {/* Data Models Section */}
            <rect
              x={140}
              y={320}
              width={220}
              height={30}
              rx="5"
              className="fill-yellow-50 stroke-yellow-300 stroke-1 stroke-dashed"
            />
            <text
              x={250}
              y={335}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              Grafisches Modell
            </text>
            
            <rect
              x={450}
              y={320}
              width={320}
              height={30}
              rx="5"
              className="fill-yellow-50 stroke-yellow-300 stroke-1 stroke-dashed"
            />
            <text
              x={610}
              y={335}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              Datenmodelle
            </text>
            
            {/* Individual Data Models */}
            <rect
              x={100}
              y={380}
              width={140}
              height={35}
              rx="5"
              className="fill-blue-100 stroke-blue-400 stroke-1"
            />
            <text
              x={170}
              y={398}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              Grafisches Modell
            </text>
            
            <rect
              x={320}
              y={380}
              width={140}
              height={35}
              rx="5"
              className="fill-blue-100 stroke-blue-400 stroke-1"
            />
            <text
              x={390}
              y={398}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              Strukturmodell
            </text>
            
            <rect
              x={540}
              y={380}
              width={140}
              height={35}
              rx="5"
              className="fill-blue-100 stroke-blue-400 stroke-1"
            />
            <text
              x={610}
              y={398}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              Materialfluss
            </text>
            
            <rect
              x={760}
              y={380}
              width={140}
              height={35}
              rx="5"
              className="fill-blue-100 stroke-blue-400 stroke-1"
            />
            <text
              x={830}
              y={398}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              Fähigkeitenmodell
            </text>
            
            <rect
              x={980}
              y={380}
              width={140}
              height={35}
              rx="5"
              className="fill-blue-100 stroke-blue-400 stroke-1"
            />
            <text
              x={1050}
              y={398}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              Kennzahlenmodell
            </text>
          </g>
          
          {/* Data Sources Level */}
          <g>
            <rect
              x={50}
              y={510}
              width={340}
              height={25}
              rx="5"
              className="fill-gray-100 stroke-gray-300 stroke-1 stroke-dashed"
            />
            <text
              x={220}
              y={525}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              Datenquellen: Grafisches Modell
            </text>
            
            <rect
              x={430}
              y={510}
              width={350}
              height={25}
              rx="5"
              className="fill-gray-100 stroke-gray-300 stroke-1 stroke-dashed"
            />
            <text
              x={605}
              y={525}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              Datenquellen: Grafisches & Datenmodell
            </text>
            
            <rect
              x={820}
              y={510}
              width={330}
              height={25}
              rx="5"
              className="fill-gray-100 stroke-gray-300 stroke-1 stroke-dashed"
            />
            <text
              x={985}
              y={525}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              Datenquellen: Datenmodell
            </text>
          </g>
          
          {/* Specific Applications */}
          <g>
            <rect
              x={60}
              y={565}
              width={160}
              height={45}
              rx="5"
              className="fill-cyan-100 stroke-cyan-500 stroke-1"
            />
            <text
              x={140}
              y={590}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              CAD-Programm
            </text>
            
            <rect
              x={250}
              y={565}
              width={160}
              height={45}
              rx="5"
              className="fill-cyan-100 stroke-cyan-500 stroke-1"
            />
            <text
              x={330}
              y={590}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              Scan-Programm
            </text>
            
            <rect
              x={440}
              y={565}
              width={160}
              height={45}
              rx="5"
              className="fill-cyan-100 stroke-cyan-500 stroke-1"
            />
            <text
              x={520}
              y={590}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              PLM
            </text>
            
            <rect
              x={630}
              y={565}
              width={160}
              height={45}
              rx="5"
              className="fill-cyan-100 stroke-cyan-500 stroke-1"
            />
            <text
              x={710}
              y={590}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              Fabriksimulation
            </text>
            
            <rect
              x={820}
              y={565}
              width={160}
              height={45}
              rx="5"
              className="fill-cyan-100 stroke-cyan-500 stroke-1"
            />
            <text
              x={900}
              y={590}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              ERP
            </text>
            
            <rect
              x={630}
              y={635}
              width={160}
              height={45}
              rx="5"
              className="fill-cyan-100 stroke-cyan-500 stroke-1"
            />
            <text
              x={710}
              y={660}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              MES
            </text>
            
            <rect
              x={820}
              y={635}
              width={160}
              height={45}
              rx="5"
              className="fill-green-100 stroke-green-500 stroke-1"
            />
            <text
              x={900}
              y={660}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              IIoT Produktionsgeräte
            </text>
          </g>
          
          {/* Connection Lines */}
          {/* Frontend to Perspectives */}
          <line x1={250} y1={80} x2={200} y2={180} className="stroke-gray-400 stroke-1" />
          <line x1={350} y1={80} x2={420} y2={180} className="stroke-gray-400 stroke-1" />
          <line x1={420} y1={80} x2={480} y2={180} className="stroke-gray-400 stroke-1" />
          <line x1={500} y1={80} x2={740} y2={180} className="stroke-gray-400 stroke-1" />
          
          {/* Backend to Perspectives */}
          <line x1={650} y1={80} x2={450} y2={180} className="stroke-gray-400 stroke-1" />
          <line x1={720} y1={80} x2={680} y2={180} className="stroke-gray-400 stroke-1" />
          <line x1={800} y1={80} x2={740} y2={180} className="stroke-gray-400 stroke-1" />
          <line x1={900} y1={80} x2={950} y2={180} className="stroke-gray-400 stroke-1" />
          
          {/* Perspectives to Data Model */}
          <line x1={170} y1={230} x2={170} y2={280} className="stroke-gray-400 stroke-1" />
          <line x1={450} y1={230} x2={450} y2={280} className="stroke-gray-400 stroke-1" />
          <line x1={720} y1={230} x2={720} y2={280} className="stroke-gray-400 stroke-1" />
          <line x1={950} y1={230} x2={950} y2={280} className="stroke-gray-400 stroke-1" />
          
          {/* Data Models to Data Sources */}
          <line x1={140} y1={415} x2={120} y2={510} className="stroke-gray-400 stroke-1" />
          <line x1={210} y1={415} x2={230} y2={510} className="stroke-gray-400 stroke-1" />
          <line x1={350} y1={415} x2={500} y2={510} className="stroke-gray-400 stroke-1" />
          <line x1={580} y1={415} x2={550} y2={510} className="stroke-gray-400 stroke-1" />
          <line x1={700} y1={415} x2={700} y2={510} className="stroke-gray-400 stroke-1" />
          <line x1={800} y1={415} x2={850} y2={510} className="stroke-gray-400 stroke-1" />
          <line x1={1000} y1={415} x2={950} y2={510} className="stroke-gray-400 stroke-1" />
          
          {/* Data Sources to Applications */}
          <line x1={150} y1={535} x2={130} y2={565} className="stroke-gray-400 stroke-1" />
          <line x1={250} y1={535} x2={280} y2={565} className="stroke-gray-400 stroke-1" />
          <line x1={500} y1={535} x2={480} y2={565} className="stroke-gray-400 stroke-1" />
          <line x1={700} y1={535} x2={680} y2={565} className="stroke-gray-400 stroke-1" />
          <line x1={920} y1={535} x2={900} y2={565} className="stroke-gray-400 stroke-1" />
          <line x1={780} y1={535} x2={700} y2={635} className="stroke-gray-400 stroke-1" />
          <line x1={980} y1={535} x2={900} y2={635} className="stroke-gray-400 stroke-1" />
        </svg>
      </div>
    </div>
  );
};

export default DigitalFactoryArchitecture; 