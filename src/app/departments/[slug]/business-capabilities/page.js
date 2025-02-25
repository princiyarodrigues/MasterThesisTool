'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, ArrowUpRight, Filter, Search } from 'lucide-react';
import BusinessCapabilityModal from '../../../../components/BusinessCapabilities/BusinessCapabilityModal';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';

const BusinessCapabilities = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [expandedSections, setExpandedSections] = useState({
    'factory-planning': true,
    'production-management': true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCapability, setSelectedCapability] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State to store capabilities from database
  const [capabilities, setCapabilities] = useState({
    factoryPlanning: [],
    productionManagement: []
  });

  // Fetch capabilities from database
  useEffect(() => {
    async function fetchCapabilities() {
      try {
        setLoading(true);
        // Fetch all capabilities
        const response = await fetch('/api/capabilities');
        
        if (!response.ok) {
          throw new Error('Failed to fetch capabilities');
        }
        
        const data = await response.json();
        
        // Fetch composition relationships to determine parent-child structure
        const compositionsResponse = await fetch('/api/compositions');
        
        if (!compositionsResponse.ok) {
          throw new Error('Failed to fetch capability relationships');
        }
        
        const compositionsData = await compositionsResponse.json();
        
        // Create a map for quick lookup
        const capabilitiesMap = {};
        data.forEach(capability => {
          capabilitiesMap[capability.id] = {
            ...capability,
            number: capability.name.split(' ')[0],
            title: capability.name.split(' ').slice(1).join(' '),
            subCapabilities: []
          };
        });
        
        // Organize capabilities into parent-child structure
        compositionsData.forEach(composition => {
          const parentId = composition.source;
          const childId = composition.target;
          
          if (capabilitiesMap[parentId] && capabilitiesMap[childId]) {
            // Check if child capability already exists in parent's subCapabilities
            const existingSubCapIndex = capabilitiesMap[parentId].subCapabilities.findIndex(
              subCap => subCap.includes(capabilitiesMap[childId].name)
            );
            
            if (existingSubCapIndex === -1) {
              capabilitiesMap[parentId].subCapabilities.push(capabilitiesMap[childId].name);
            }
          }
        });
        
        // Separate capabilities into Factory Planning and Production Management
        const factoryPlanning = [];
        const productionManagement = [];
        
        // Find top-level capabilities (those that don't appear as targets in compositions)
        const childIds = new Set(compositionsData.map(comp => comp.target));
        
        data.forEach(capability => {
          // If it's a parent capability (not a child in any composition)
          if (!childIds.has(capability.id) && capabilitiesMap[capability.id]) {
            // Determine which category it belongs to based on naming
            const capabilityName = capability.name.toLowerCase();
            
            // Default sorting to ensure they appear in order
            const item = capabilitiesMap[capability.id];
            
            if (capabilityName.includes('produktions') || 
                capabilityName.includes('auftrag') || 
                capabilityName.includes('management')) {
              productionManagement.push(item);
            } else {
              factoryPlanning.push(item);
            }
          }
        });
        
        // Sort capabilities by number
        factoryPlanning.sort((a, b) => {
          const numA = parseFloat(a.number);
          const numB = parseFloat(b.number);
          return numA - numB;
        });
        
        productionManagement.sort((a, b) => {
          const numA = parseFloat(a.number);
          const numB = parseFloat(b.number);
          return numA - numB;
        });
        
        setCapabilities({
          factoryPlanning,
          productionManagement
        });
      } catch (err) {
        console.error('Error fetching capabilities:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchCapabilities();
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Filter capabilities based on search query
  const filterCapabilities = (capabilities) => {
    if (!searchQuery) return capabilities;
    
    return capabilities.map(capability => {
      // Check if main capability matches search
      const mainMatches = capability.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         capability.number.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter sub-capabilities
      const filteredSubs = capability.subCapabilities.filter(sub => 
        sub.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Return capability with filtered sub-capabilities
      return {
        ...capability,
        subCapabilities: filteredSubs,
        matches: mainMatches || filteredSubs.length > 0
      };
    }).filter(capability => capability.matches || capability.subCapabilities.length > 0);
  };

  const filteredFactoryPlanning = filterCapabilities(capabilities.factoryPlanning);
  const filteredProductionManagement = filterCapabilities(capabilities.productionManagement);

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

  const CapabilityCard = ({ id, number, title, subCapabilities }) => {
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
            {subCapabilities.map((sub, index) => {
              // Extract number from sub-capability if available
              const subMatch = sub.match(/^(\d+\.\d+(\.\d+)?)\s+(.+)$/);
              const subNumber = subMatch ? subMatch[1] : `${number}.${index + 1}`;
              const subTitle = subMatch ? subMatch[3] : sub;
              
              return (
                <button
                  key={index}
                  onClick={() => handleSubCapabilityClick({ 
                    id: `${id}-sub-${index}`,
                    number: subNumber, 
                    title: subTitle 
                  })}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-[#009374]/10 hover:bg-[#009374]/15 transition-colors group cursor-pointer text-left"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#009374]/60 group-hover:bg-[#009374] transition-colors" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {sub}
                  </span>
                </button>
              );
            })}
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
                key={capability.id}
                id={capability.id}
                number={capability.number}
                title={capability.title}
                subCapabilities={capability.subCapabilities}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (status === 'loading' || loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-6 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error loading business capabilities: {error}
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
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
          {filteredFactoryPlanning.length > 0 && (
            <Section
              title="Factory Planning"
              items={filteredFactoryPlanning}
              type="factory-planning"
            />
          )}
          
          {filteredProductionManagement.length > 0 && (
            <Section
              title="Production Management"
              items={filteredProductionManagement}
              type="production-management"
            />
          )}
          
          {filteredFactoryPlanning.length === 0 && filteredProductionManagement.length === 0 && (
            <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
              <p className="text-gray-600">No capabilities match your search criteria.</p>
            </div>
          )}
        </div>

        {/* Modal */}
        <BusinessCapabilityModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          capability={selectedCapability}
        />
      </div>
    </div>
  );
};

export default BusinessCapabilities;