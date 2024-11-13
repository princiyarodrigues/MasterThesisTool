'use client';
import React from 'react';
import { X } from 'lucide-react';

const GoalIndicator = ({ value, maxValue = 5 }) => {
    return (
        <div className="flex items-center justify-center space-x-6">
            {[...Array(maxValue)].map((_, index) => {
                const indicators = ['--', '-', 'o', '+', '++'];
                const isActive = index === value;
                return (
                    <span
                        key={index}
                        className={`${isActive ? 'text-green-500' : 'text-gray-400'} font-medium`}
                    >
                        {indicators[index]}
                    </span>
                );
            })}
        </div>
    );
};

const BusinessCapabilityModal = ({ isOpen, onClose, capability }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
                {/* Header with Logos */}
                <div className="absolute top-4 right-4 flex items-center space-x-4 z-10">
                    <img src="/api/placeholder/40/40" alt="OPC UA" className="h-8" />
                    <img src="/api/placeholder/40/40" alt="MindSphere" className="h-8" />
                    <img src="/api/placeholder/40/40" alt="HIVEMQ" className="h-8" />
                </div>

                {/* Title Section */}
                <div className="bg-[#F5E6D3] p-6">
                    <div className="flex justify-between items-start">
                        <div className="pr-32"> {/* Added padding to prevent overlap with logos */}
                            <h2 className="text-xl font-bold text-gray-900">
                                Teilbereich Fabrikplanung: {capability?.title}
                            </h2>
                            <p className="text-gray-700 mt-1">
                                Business Capability FP{capability?.number}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-black/5 rounded-full transition-colors"
                        >
                            <X className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Description and Best Practice */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-3">Beschreibung</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Die automatisierte Montagevorganggraphgenerierung beschreibt die Fähigkeit,
                                aus einem digitalen Produktmodell (teil-) automatisiert einen
                                Montagevorganggraph zu generieren. Der Graph beschreibt dabei die
                                Arbeitsschrittfolge für die Produktion des Produkts und kann als
                                Grundlage für die Arbeitsplanung dienen.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-3">Best Practice</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Im Projekt Datenfabrik.NRW hat das Fraunhofer IEM gemeinsam mit dem
                                Unternehmen Claas einen Algorithmus für die automatisierte
                                Montagevorganggraphgenerierung entwickelt. Der Algorithmus untersucht
                                dabei die Baugruppenstruktur des Produkts, sowie weitere Bedingungen
                                wie Kontaktstellen und Berührungen zwischen Bauteilen.
                            </p>
                        </div>
                    </div>

                    {/* IT Tools Section */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">IT-Tools zur Umsetzung</h3>
                        <div className="flex items-center space-x-8">
                            <img src="/api/placeholder/120/40" alt="Synera" />
                            <img src="/api/placeholder/120/40" alt="FreeCAD" />
                            <img src="/api/placeholder/120/40" alt="Python" />
                            <div className="rounded-full bg-blue-900 p-4">
                                <img src="/api/placeholder/40/40" alt="3DEXPERIENCE" className="h-8 w-8" />
                            </div>
                        </div>
                    </div>

                    {/* Goals Table */}
                    <div>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#F5E6D3]">
                                    <th className="text-left p-3 font-bold w-1/4">Zielbereich</th>
                                    <th className="text-left p-3 font-bold w-1/4">Strategisches Ziel</th>
                                    <th className="text-center p-3 font-bold" colSpan={5}>
                                        Unterstützungsgrad des Ziels
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="p-3 align-top">Operative</td>
                                    <td className="p-3">
                                        <ul className="list-disc ml-4 space-y-1 text-sm">
                                            <li>Steigerung OEE</li>
                                            <li>Steigerung Arbeitsleistung</li>
                                            <li>...</li>
                                        </ul>
                                    </td>
                                    <td className="p-3" colSpan={5}>
                                        <GoalIndicator value={3} />
                                    </td>
                                </tr>
                                <tr className="border-b bg-gray-50">
                                    <td className="p-3">Nachhaltigkeit</td>
                                    <td className="p-3">...</td>
                                    <td className="p-3" colSpan={5}>
                                        <GoalIndicator value={1} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-3">Logistik</td>
                                    <td className="p-3">...</td>
                                    <td className="p-3" colSpan={5}>
                                        <GoalIndicator value={0} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Capability Combinations */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-3">
                                Technical Capability-Kombinationen
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-medium mb-2">Kombination möglich</p>
                                <p>P7, P10, P14, P20, P15</p>
                                <p className="text-orange-600 mt-4">Empfehlenswert</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-3">
                                Geschäftsprozess-Kombinationen
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-medium mb-2">Kombination möglich</p>
                                <p>P7, P10, P14, P20, P15</p>
                                <p className="text-orange-600 mt-4">Empfehlenswert</p>
                            </div>
                        </div>
                    </div>

                    {/* Sources */}
                    <div className="border-t pt-4">
                        <h3 className="font-bold text-gray-900 mb-2">Quellen</h3>
                        <p className="text-sm text-gray-600">[KK21]</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessCapabilityModal;
