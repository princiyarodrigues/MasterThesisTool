'use client';
import React from 'react';
import { X, Database, Cpu, Radio, Code, GitBranch, Network, Share2 } from 'lucide-react';

const GoalIndicator = ({ value, maxValue = 5 }) => {
    return (
        <div className="flex items-center justify-center space-x-6">
            {[...Array(maxValue)].map((_, index) => {
                const indicators = ['--', '-', 'o', '+', '++'];
                const isActive = index === value;
                return (
                    <span
                        key={index}
                        className={`${isActive ? 'text-[#009374]' : 'text-gray-400'} font-medium`}
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

    const tools = [
        { icon: Database, name: 'Database' },
        { icon: Cpu, name: 'System' },
        { icon: Code, name: 'Code' },
        { icon: Radio, name: 'Signal' }
    ];

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
                {/* Header with Logos */}
                <div className="absolute top-4 right-16 flex items-center space-x-4 z-10">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <Network className="w-5 h-5 text-[#009374]" />
                    </div>
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <Share2 className="w-5 h-5 text-[#009374]" />
                    </div>
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <GitBranch className="w-5 h-5 text-[#009374]" />
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 hover:bg-[#009374]/10 rounded-full transition-colors"
                >
                    <X className="h-6 w-6 text-gray-500" />
                </button>

                {/* Title Section */}
                <div className="bg-[#009374]/10 p-6">
                    <div className="flex justify-between items-start">
                        <div className="pr-48">
                            <h2 className="text-xl font-bold text-[#009374]">
                                Teilbereich Fabrikplanung: {capability?.title}
                            </h2>
                            <p className="text-gray-700 mt-1">
                                Business Capability FP{capability?.number}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Description and Best Practice */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-[#009374] mb-3">Beschreibung</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Die automatisierte Montagevorganggraphgenerierung beschreibt die Fähigkeit,
                                aus einem digitalen Produktmodell (teil-) automatisiert einen
                                Montagevorganggraph zu generieren. Der Graph beschreibt dabei die
                                Arbeitsschrittfolge für die Produktion des Produkts und kann als
                                Grundlage für die Arbeitsplanung dienen.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#009374] mb-3">Best Practice</h3>
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
                        <h3 className="font-bold text-[#009374] mb-4">IT-Tools zur Umsetzung</h3>
                        <div className="flex items-center space-x-8">
                            {tools.map((Tool, index) => (
                                <div key={index} className="flex flex-col items-center space-y-2">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <Tool.icon className="w-6 h-6 text-[#009374]" />
                                    </div>
                                    <span className="text-sm text-gray-600">{Tool.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Goals Table */}
                    <div>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#009374]/10">
                                    <th className="text-left p-3 font-bold text-[#009374] w-1/4">Zielbereich</th>
                                    <th className="text-left p-3 font-bold text-[#009374] w-1/4">Strategisches Ziel</th>
                                    <th className="text-center p-3 font-bold text-[#009374]" colSpan={5}>
                                        Unterstützungsgrad des Ziels
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="p-3">Operative</td>
                                    <td className="p-3">
                                        <ul className="list-disc ml-4 space-y-1 text-sm">
                                            <li>Steigerung OEE</li>
                                            <li>Steigerung Arbeitsleistung</li>
                                            <li>Reduzierung Durchlaufzeit</li>
                                        </ul>
                                    </td>
                                    <td className="p-3" colSpan={5}>
                                        <GoalIndicator value={3} />
                                    </td>
                                </tr>
                                <tr className="border-b bg-gray-50">
                                    <td className="p-3">Nachhaltigkeit</td>
                                    <td className="p-3">
                                        <ul className="list-disc ml-4 space-y-1 text-sm">
                                            <li>Reduzierung Energieverbrauch</li>
                                            <li>Optimierung Ressourceneinsatz</li>
                                        </ul>
                                    </td>
                                    <td className="p-3" colSpan={5}>
                                        <GoalIndicator value={1} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-3">Logistik</td>
                                    <td className="p-3">
                                        <ul className="list-disc ml-4 space-y-1 text-sm">
                                            <li>Optimierung Materialfluss</li>
                                            <li>Reduzierung Transportwege</li>
                                        </ul>
                                    </td>
                                    <td className="p-3" colSpan={5}>
                                        <GoalIndicator value={2} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Capability Combinations */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-[#009374] mb-3">
                                Technical Capability-Kombinationen
                            </h3>
                            <div className="bg-[#009374]/5 p-4 rounded-lg">
                                <p className="text-sm font-medium mb-2">Kombination möglich</p>
                                <p>P7, P10, P14, P20, P15</p>
                                <p className="text-[#009374] mt-4">Empfehlenswert</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#009374] mb-3">
                                Geschäftsprozess-Kombinationen
                            </h3>
                            <div className="bg-[#009374]/5 p-4 rounded-lg">
                                <p className="text-sm font-medium mb-2">Kombination möglich</p>
                                <p>P7, P10, P14, P20, P15</p>
                                <p className="text-[#009374] mt-4">Empfehlenswert</p>
                            </div>
                        </div>
                    </div>

                    {/* Sources */}
                    <div className="border-t pt-4">
                        <h3 className="font-bold text-[#009374] mb-2">Quellen</h3>
                        <p className="text-sm text-gray-600">[KK21]</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessCapabilityModal;