'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, ArrowUpRight, Filter, Search } from 'lucide-react';
import BusinessCapabilityModal from '../../../../components/BusinessCapabilities/BusinessCapabilityModal';

const BusinessCapabilities = () => {
  const [expandedSections, setExpandedSections] = useState({
    'factory-planning': true,
    'production-management': true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCapability, setSelectedCapability] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const factoryPlanning = [
    {
      number: "1.0",
      title: "Zielplanung",
      subCapabilities: [
        "1.1 Zielszenariensimulation",
        "1.2 Zielszenarienabsicherung"
      ]
    },
    {
      number: "2.0",
      title: "Standortauswahl",
      subCapabilities: [
        "2.1 Standortbeitrag (bestehende Werksbestandteile)"
      ]
    },
    {
      number: "3.0",
      title: "Werksstruktur- & Layoutplanung",
      subCapabilities: [
        "3.1 Materialflussplanung & -optimierung",
        "3.2 Materialflussüberwachung",
        "3.3 Virtuelle Fabrikgestaltung",
        "3.4 Automatisierte Generierung von Layoutvarianten"
      ]
    },
    {
      number: "4.0",
      title: "Umsetzungsplanung",
      subCapabilities: [
        "4.1 (Schrittweise) Erweiterungs-planung",
        "4.2 Umsetzungsstands-überwachung",
        "4.3 Virtuelle Inbetriebnahme"
      ]
    },
    {
      number: "5.0",
      title: "Wirtschaftlichkeitsberechnung",
      subCapabilities: [
        "5.1 Kennzahlentracking (Echtzeit)"
      ]
    },
    {
      number: "6.0",
      title: "Arbeitsvorbereitung",
      subCapabilities: [
        "6.1 Automatisierte Vergabezell-ermittlung",
        "6.2 Visualisierung bestehender Fabrikbestandteile (Punktwolke)",
        "6.3 Automatisierte Entwicklung Arbeitsablaufschema",
        "6.4 Automatisierte Generierung von Arbeitsablaufschemavarianten",
        "6.5 Automatisierte Dimensionierung Förder- & Lagermittel",
        "6.6 Automatisierte Dimensionierung Betriebsmittel"
      ]
    },
    {
      number: "7.0",
      title: "Prozessplanung",
      subCapabilities: [
        "7.1 Virtuelle Produktionsprozess-gestaltung",
        "7.2 Selbstoptimierende digitale Planung",
        "7.3 Process Mining Produktions-prozesse",
        "7.4 Root-Cause Analysen mit Echtzeitdaten",
        "7.5 Verknüpfung zu Erkenntnissen aus Produktnutzungsphase"
      ]
    },
    {
      number: "8.0",
      title: "Kapazitätsplanung",
      subCapabilities: [
        "8.1 Dynamische Auslastungs-überwachung",
        "8.2 Automatisierte Ableitung Kapazitätsbedarf"
      ]
    },
    {
      number: "9.0",
      title: "Personal- und Organisationsplanung",
      subCapabilities: [
        "9.1 Automatisierte Dimensionierung Personalmittel"
      ]
    },
    {
      number: "10.0",
      title: "IT-Ausstattungsplanung",
      subCapabilities: [
        "10.1 Reichweitenplanung & -überwachung Funksignale"
      ]
    },
    {
      number: "11.0",
      title: "Produktionsstrukturplanung",
      subCapabilities: [
        "11.1 Automatisierte Generierung Funktionsschema",
        "11.2 Automatisierte Dimensionierung Flächen",
        "11.3 Verknüpfung zu Erkenntnissen aus Produktnutzungsphase"
      ]
    },
    {
      number: "12.0",
      title: "Produktionsprogrammanalyse",
      subCapabilities: [
        "12.1 Automatisierte Montage-Vorganggraphenermittlung",
        "12.2 Dynamische Anpassung Produktionsprogramm zu last-Auslastung"
      ]
    },
    {
      number: "13.0",
      title: "Arbeitsplatzgestaltung",
      subCapabilities: [
        "13.1 Virtuelle Arbeitsplatzgestaltung",
        "13.2 Analyse (ergonomischer, wirtschaftlicher) Arbeitsbedingungen mit Echtzeitdaten",
        "13.3 Verknüpfung zu Erkenntnissen aus Produktnutzungsphase"
      ]
    }
  ];

  const productionManagement = [
    {
      number: "1.0",
      title: "Produktionsprogrammplanung",
      subCapabilities: [
        "1.1 Intelligente Primärbedarfsplanung",
        "1.2 Intelligente Ressourcengrobplanung",
        "1.3 Intelligente Produktionsprogrammplanung",
        "1.4 Intelligentes Management der Fabrikauslastung"
      ]
    },
    {
      number: "2.0",
      title: "Auftragsmanagement",
      subCapabilities: [
        "2.1 Automatisierte Buchung von Materialbewegungen",
        "2.2 Automatisierte Buchung von durchgeführten Arbeitsschritten",
        "2.3 Automatisierte Buchung von durchgeführten Arbeitsschritten",
        "2.4 Dynamisches Management von Auftragsrestriktionen",
        "2.5 Dynamischen (Echtzeit-) Einblick in Auftragsfortschritt",
        "2.6 Dynamischen (Echtzeit-) Einblick in Kostenstatus des Auftrags"
      ]
    },
    {
      number: "3.0",
      title: "Produktionsbedarfsplanung",
      subCapabilities: [
        "3.1 Intelligentes Lagerbestands-management",
        "3.2 Intelligente Durchlauf-terminierung auf Basis von Echtzeitdaten"
      ]
    },
    {
      number: "4.0",
      title: "Produktionsplanung und -steuerung",
      subCapabilities: [
        "4.1 Eigenfertigung",
        "4.1.1 Intelligente & dynamische Produktionsplanung",
        "4.1.2 Intelligente Personaleinsatz-planung",
        "4.1.3 Intelligentes Fertigungs-technologiemanagement",
        "4.1.4 Intelligentes Losgrößen-management",
        "4.1.5 Intelligente Zuordnung von Produktionsressourcen",
        "4.2 Fremdbezug",
        "4.2.1 Intelligente & dynamische Bestimmung von notwendigen externen Kapazitäten",
        "4.2.2 Intelligente & dynamische Lieferantenauswahl",
        "4.2.3 Intelligente (Echtzeit-) Verfolgung Auftragsfortschritt",
        "4.2.4 Intelligente (Echtzeit-) Verfolgung Lieferavis"
      ]
    }
  ];
  const toggleSection = (sectionType) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionType]: !prev[sectionType]
    }));
  };
  const handleSubCapabilityClick = (capability) => {
    setSelectedCapability(capability);
    setShowModal(true);
  };

  const CapabilityCard = ({ number, title, subCapabilities }) => {
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-[#009374] font-semibold">{number}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#009374]/10 flex items-center justify-center">
              <Plus className="w-4 h-4 text-[#009374]" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {title}
          </h3>

          <div className="space-y-2 flex-grow">
            {subCapabilities.map((sub, index) => (
              <button
                key={index}
                onClick={() => handleSubCapabilityClick({ 
                  number: `${number}.${index + 1}`, 
                  title: sub 
                })}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-[#009374]/10 hover:bg-[#009374]/15 transition-colors group cursor-pointer text-left"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#009374]/60 group-hover:bg-[#009374] transition-colors" />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {sub}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const Section = ({ title, items, type }) => (
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white mb-8">
      <button
        onClick={() => toggleSection(type)}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          {expandedSections[type] ? (
            <ChevronDown className="w-6 h-6 text-[#009374]" />
          ) : (
            <ChevronRight className="w-6 h-6 text-[#009374]" />
          )}
          <div>
            <h2 className="text-xl font-semibold text-[#009374]">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{items.length} capabilities</p>
          </div>
        </div>
      </button>

      {expandedSections[type] && (
        <div className="p-8 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map(capability => (
              <CapabilityCard
                key={capability.number}
                {...capability}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#009374] mb-2">Business Capabilities</h1>
            <p className="text-gray-600">
              Comprehensive overview of factory planning and production management capabilities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 text-sm bg-[#009374]/10 text-[#009374] rounded-lg hover:bg-[#009374]/20 border border-[#009374]/20">
              Add New
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search capabilities..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#009374] focus:ring-2 focus:ring-[#009374]/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        <Section
          title="Factory Planning"
          items={factoryPlanning}
          type="factory-planning"
        />
        <Section
          title="Production Management"
          items={productionManagement}
          type="production-management"
        />
      </div>

      {/* Modal */}
      <BusinessCapabilityModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        capability={selectedCapability}
      />
    </div>
  );
};

export default BusinessCapabilities;