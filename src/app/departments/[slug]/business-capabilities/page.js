'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Search, Filter } from 'lucide-react';
import BusinessCapabilityModal from '@/components/BusinessCapabilities/BusinessCapabilityModal';

const BusinessCapabilities = () => {
  const [expandedSections, setExpandedSections] = useState({
    'factory-planning': true,
    'production-management': true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCapability, setSelectedCapability] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [factoryCapabilities, setFactoryCapabilities] = useState([]);
  const [productionCapabilities, setProductionCapabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch capabilities hierarchy by category
    const fetchCapabilitiesByCategory = async (category) => {
      try {
        const response = await fetch(`/api/capabilities/by-category/${encodeURIComponent(category)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${category} capabilities: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Error fetching ${category} capabilities:`, error);
        throw error;
      }
    };

    // Function to fetch composition relationships
    const fetchCompositions = async () => {
      try {
        const response = await fetch('/api/compositions');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch compositions: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching compositions:', error);
        throw error;
      }
    };

    // Function to organize capabilities in a parent-child hierarchy
    const organizeCapabilitiesHierarchy = (capabilities, compositions) => {
      // Map to store capabilities by ID
      const capabilitiesMap = capabilities.reduce((map, cap) => {
        map[cap.id] = { ...cap, subCapabilities: [] };
        return map;
      }, {});
      
      // Map to identify parent-child relationships
      const parentChildMap = {};
      compositions.forEach(comp => {
        if (!parentChildMap[comp.source]) {
          parentChildMap[comp.source] = [];
        }
        parentChildMap[comp.source].push(comp.target);
      });
      
      // Identify root capabilities (those that are sources but not targets)
      const childIds = new Set(compositions.map(comp => comp.target));
      const rootCapabilities = capabilities
        .filter(cap => !childIds.has(cap.id))
        .map(cap => {
          // For each root capability, gather its children recursively
          const result = { ...cap, subCapabilities: [] };
          
          // Function to recursively add children
          const addChildren = (parentId, parentResult) => {
            const childrenIds = parentChildMap[parentId] || [];
            childrenIds.forEach(childId => {
              if (capabilitiesMap[childId]) {
                const childCap = { ...capabilitiesMap[childId], subCapabilities: [] };
                parentResult.subCapabilities.push(childCap);
                // Recursively add this child's children
                addChildren(childId, childCap);
              }
            });
          };
          
          addChildren(cap.id, result);
          return result;
        });
      
      return rootCapabilities;
    };

    const loadAllData = async () => {
      setLoading(true);
      try {
        // Fetch capabilities for both categories and compositions
        const [factoryCaps, productionCaps, allCompositions] = await Promise.all([
          fetchCapabilitiesByCategory('Factory Planning'),
          fetchCapabilitiesByCategory('Production Planning'),
          fetchCompositions()
        ]);
        
        // Organize capabilities into hierarchies
        const factoryHierarchy = organizeCapabilitiesHierarchy(factoryCaps, allCompositions);
        const productionHierarchy = organizeCapabilitiesHierarchy(productionCaps, allCompositions);
        
        setFactoryCapabilities(factoryHierarchy);
        setProductionCapabilities(productionHierarchy);
        setError(null);
      } catch (err) {
        console.error('Error loading capability data:', err);
        setError('Failed to load capabilities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

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

  // Function to convert capability data to the format expected by UI
  const formatCapabilityForUI = (capability) => {
    return {
      number: capability.name.split(' ')[0], // Extract number from name (e.g., "1.0" from "1.0 Zielplanung")
      title: capability.name.includes(' ') ? capability.name.split(' ').slice(1).join(' ') : capability.name,
      subCapabilities: capability.subCapabilities.map(sub => sub.name)
    };
  };

  const CapabilityCard = ({ capability }) => {
    const formattedCap = formatCapabilityForUI(capability);
    
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-[#009374] font-semibold">{formattedCap.number}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#009374]/10 flex items-center justify-center">
              <Plus className="w-4 h-4 text-[#009374]" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {formattedCap.title}
          </h3>

          <div className="space-y-2 flex-grow">
            {formattedCap.subCapabilities.map((sub, index) => (
              <button
                key={index}
                onClick={() => handleSubCapabilityClick({ 
                  number: `${formattedCap.number}.${index + 1}`, 
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

  const Section = ({ title, capabilities, type }) => (
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
            <p className="text-sm text-gray-500 mt-1">{capabilities.length} capabilities</p>
          </div>
        </div>
      </button>

      {expandedSections[type] && (
        <div className="p-8 border-t border-gray-100">
          {loading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#009374]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {capabilities.map(capability => (
                <CapabilityCard
                  key={capability.id}
                  capability={capability}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p>{error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          capabilities={factoryCapabilities}
          type="factory-planning"
        />
        <Section
          title="Production Management"
          capabilities={productionCapabilities}
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