import React from 'react';

export function ArchitectureDiagram() {
      return (
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <svg
                        width="100%"
                        height="650"
                        viewBox="0 0 1300 650"
                        xmlns="http://www.w3.org/2000/svg"
                        className="bg-white"
                  >
                        {/* Top section - Value Streams */}
                        <g>
                              <rect x="100" y="50" width="200" height="70" rx="5" className="fill-amber-50 stroke-amber-200" />
                              <text x="200" y="85" textAnchor="middle" className="text-sm font-medium">
                                    1. Spezifikation & Planung
                              </text>
                              <text x="200" y="105" textAnchor="middle" className="text-xs">
                                    Value Stream
                              </text>

                              <rect x="350" y="50" width="200" height="70" rx="5" className="fill-amber-50 stroke-amber-200" />
                              <text x="450" y="85" textAnchor="middle" className="text-sm font-medium">
                                    2. Aufbau & Inbetriebnahme
                              </text>
                              <text x="450" y="105" textAnchor="middle" className="text-xs">
                                    Value Stream
                              </text>

                              <rect x="600" y="50" width="200" height="70" rx="5" className="fill-amber-50 stroke-amber-200" />
                              <text x="700" y="85" textAnchor="middle" className="text-sm font-medium">
                                    3.0 Betrieb
                              </text>
                              <text x="700" y="105" textAnchor="middle" className="text-xs">
                                    Value Stream
                              </text>

                              <rect x="850" y="50" width="200" height="70" rx="5" className="fill-amber-50 stroke-amber-200" />
                              <text x="950" y="85" textAnchor="middle" className="text-sm font-medium">
                                    4. Demontage & Recycling
                              </text>
                              <text x="950" y="105" textAnchor="middle" className="text-xs">
                                    Value Stream
                              </text>

                              {/* Value Stream flow lines */}
                              <path d="M 300 85 L 350 85" className="stroke-amber-500 stroke-width-2 fill-none" markerEnd="url(#arrowhead)" />
                              <path d="M 550 85 L 600 85" className="stroke-amber-500 stroke-width-2 fill-none" markerEnd="url(#arrowhead)" />
                              <path d="M 800 85 L 850 85" className="stroke-amber-500 stroke-width-2 fill-none" markerEnd="url(#arrowhead)" />

                              {/* Additional Value Streams (middle row) */}
                              <rect x="500" y="150" width="170" height="70" rx="5" className="fill-amber-50 stroke-amber-200" />
                              <text x="585" y="185" textAnchor="middle" className="text-sm font-medium">
                                    3.1 Service & Wartung
                              </text>
                              <text x="585" y="205" textAnchor="middle" className="text-xs">
                                    Value Stream
                              </text>

                              <rect x="750" y="150" width="170" height="70" rx="5" className="fill-amber-50 stroke-amber-200" />
                              <text x="835" y="185" textAnchor="middle" className="text-sm font-medium">
                                    3.2 Umplanung
                              </text>
                              <text x="835" y="205" textAnchor="middle" className="text-xs">
                                    Value Stream
                              </text>
                        </g>

                        {/* Middle section - Business Processes */}
                        <g>
                              <rect x="50" y="250" width="150" height="70" rx="5" className="fill-green-50 stroke-green-200" />
                              <text x="125" y="285" textAnchor="middle" className="text-sm font-medium">
                                    1.1 Investitionsplanung
                              </text>
                              <text x="125" y="305" textAnchor="middle" className="text-xs">
                                    Business Process
                              </text>

                              <rect x="225" y="250" width="150" height="70" rx="5" className="fill-green-50 stroke-green-200" />
                              <text x="300" y="285" textAnchor="middle" className="text-sm font-medium">
                                    1.2 Engineering
                              </text>
                              <text x="300" y="305" textAnchor="middle" className="text-xs">
                                    Business Process
                              </text>

                              <rect x="400" y="250" width="150" height="70" rx="5" className="fill-green-50 stroke-green-200" />
                              <text x="475" y="285" textAnchor="middle" className="text-sm font-medium">
                                    2.1 Aufbau & Anlauf
                              </text>
                              <text x="475" y="305" textAnchor="middle" className="text-xs">
                                    Business Process
                              </text>

                              <rect x="575" y="250" width="150" height="70" rx="5" className="fill-green-50 stroke-green-200" />
                              <text x="650" y="285" textAnchor="middle" className="text-sm font-medium">
                                    3.1 Produktion
                              </text>
                              <text x="650" y="305" textAnchor="middle" className="text-xs">
                                    Business Process
                              </text>

                              <rect x="750" y="250" width="150" height="70" rx="5" className="fill-green-50 stroke-green-200" />
                              <text x="825" y="285" textAnchor="middle" className="text-sm font-medium">
                                    3.2 Instandhaltung
                              </text>
                              <text x="825" y="305" textAnchor="middle" className="text-xs">
                                    Business Process
                              </text>

                              <rect x="925" y="250" width="150" height="70" rx="5" className="fill-green-50 stroke-green-200" />
                              <text x="1000" y="285" textAnchor="middle" className="text-sm font-medium">
                                    3.3 Modernisierung
                              </text>
                              <text x="1000" y="305" textAnchor="middle" className="text-xs">
                                    Business Process
                              </text>

                              <rect x="1100" y="250" width="150" height="70" rx="5" className="fill-green-50 stroke-green-200" />
                              <text x="1170" y="285" textAnchor="middle" className="text-sm font-medium">
                                    4.1 Demontage
                              </text>
                              <text x="1170" y="305" textAnchor="middle" className="text-xs">
                                    Business Process
                              </text>

                              {/* Flow lines between business processes */}
                              <path d="M 200 285 L 225 285" className="stroke-amber-500 stroke-width-2 fill-none" markerEnd="url(#arrowhead)" />
                              <path d="M 375 285 L 400 285" className="stroke-amber-500 stroke-width-2 fill-none" markerEnd="url(#arrowhead)" />
                              <path d="M 550 285 L 575 285" className="stroke-amber-500 stroke-width-2 fill-none" markerEnd="url(#arrowhead)" />
                              <path d="M 725 285 L 750 285" className="stroke-amber-500 stroke-width-2 fill-none" markerEnd="url(#arrowhead)" />
                              <path d="M 900 285 L 925 285" className="stroke-amber-500 stroke-width-2 fill-none" markerEnd="url(#arrowhead)" />
                              <path d="M 1075 285 L 1100 285" className="stroke-amber-500 stroke-width-2 fill-none" markerEnd="url(#arrowhead)" />

                              {/* Realization connections from Value Streams to Business Processes */}
                              <path d="M 300 250 L 200 120" className="stroke-green-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                              <path d="M 475 250 L 450 120" className="stroke-green-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                              <path d="M 650 250 L 700 120" className="stroke-green-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                              <path d="M 825 250 L 585 220" className="stroke-green-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                              <path d="M 1000 250 L 835 220" className="stroke-green-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                              <path d="M 1120 250 L 950 120" className="stroke-green-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                        </g>

                        {/* Bottom section - Data Objects */}
                        <g>
                              <rect x="125" y="400" width="150" height="60" rx="5" className="fill-cyan-50 stroke-cyan-200" />
                              <text x="200" y="430" textAnchor="middle" className="text-sm font-medium">
                                    Arbeitsablaufschema
                              </text>
                              <text x="200" y="450" textAnchor="middle" className="text-xs">
                                    Data Object
                              </text>

                              <rect x="300" y="400" width="150" height="60" rx="5" className="fill-cyan-50 stroke-cyan-200" />
                              <text x="375" y="430" textAnchor="middle" className="text-sm font-medium">
                                    Funktionsschema
                              </text>
                              <text x="375" y="450" textAnchor="middle" className="text-xs">
                                    Data Object
                              </text>

                              <rect x="470" y="400" width="780" height="60" rx="5" className="fill-cyan-50 stroke-cyan-200" />
                              <text x="925" y="430" textAnchor="middle" className="text-sm font-medium">
                                    Materialfluss
                              </text>
                              <text x="925" y="450" textAnchor="middle" className="text-xs">
                                    Data Object
                              </text>

                              <rect x="230" y="500" width="150" height="60" rx="5" className="fill-cyan-50 stroke-cyan-200" />
                              <text x="300" y="530" textAnchor="middle" className="text-sm font-medium">
                                    Groblayout (2D)
                              </text>
                              <text x="290" y="550" textAnchor="middle" className="text-xs">
                                    Data Object
                              </text>

                              <rect x="400" y="500" width="180" height="60" rx="5" className="fill-cyan-50 stroke-cyan-200" />
                              <text x="500" y="530" textAnchor="middle" className="text-sm font-medium">
                                    Ideallayout (3D)
                              </text>
                              <text x="490" y="550" textAnchor="middle" className="text-xs">
                                    Data Object
                              </text>

                              <rect x="600" y="500" width="650" height="60" rx="5" className="fill-cyan-50 stroke-cyan-200" />
                              <text x="925" y="530" textAnchor="middle" className="text-sm font-medium">
                                    Reallayout (3D)
                              </text>
                              <text x="925" y="550" textAnchor="middle" className="text-xs">
                                    Data Object
                              </text>

                              {/* Additional connection paths from Business Processes to Data Objects */}
                              <path
                                    d="M 575 320 L 375 400"
                                    className="stroke-cyan-500 stroke-width-1 stroke-dasharray-2 fill-none"
                                    markerEnd="url(#arrowheadDashed)"
                              />
                              <path
                                    d="M 750 320 L 675 500"
                                    className="stroke-cyan-500 stroke-width-1 stroke-dasharray-2 fill-none"
                                    markerEnd="url(#arrowheadDashed)"
                              />

                              {/* Existing Access Relationships */}
                              <path d="M 300 320 L 200 400" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                              <path d="M 300 320 L 375 400" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                              <path d="M 300 320 L 675 400" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                              <path d="M 300 320 L 200 500" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                              <path d="M 300 320 L 375 500" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                              <path d="M 475 320 L 675 400" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                              <path d="M 475 320 L 675 500" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                              <path d="M 650 320 L 675 400" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                              <path d="M 650 320 L 675 500" className="stroke-cyan-500 stroke-width-1 stroke-dasharray-2 fill-none" markerEnd="url(#arrowheadDashed)" />
                        </g>

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
                        </defs>
                  </svg>
            </div>
      );
}
