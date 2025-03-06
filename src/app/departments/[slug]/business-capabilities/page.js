'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight, Plus, Search, Filter } from 'lucide-react';
import BusinessCapabilityModal from '@/components/BusinessCapabilities/BusinessCapabilityModal';
import LoadingSpinner from '@/components/LoadingSpinner';

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
  const [userGoals, setUserGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Load data when component mounts
    if (!initialized) {
      loadAllData();
    }
  }, [initialized]);

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
  
  // Function to fetch user profile and get selected strategic goals
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log('User profile data:', userData);
      
      // Extract goal IDs from strategicGoalSelections where value is true
      const selectedGoalIds = [];
      if (userData.strategicGoalSelections) {
        Object.entries(userData.strategicGoalSelections).forEach(([goalId, isSelected]) => {
          if (isSelected === true) {
            selectedGoalIds.push(goalId);
          }
        });
      }
      
      setUserGoals(selectedGoalIds);
      console.log('Selected goal IDs:', selectedGoalIds);
      return selectedGoalIds;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return [];
    }
  };

  // Fetch capabilities by category
  const fetchCapabilitiesByCategory = async (category) => {
    try {
      const response = await fetch(`/api/capabilities/by-category/${encodeURIComponent(category)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${category} capabilities: ${response.status}`);
      }
      
      const capabilities = await response.json();
      console.log(`Fetched ${capabilities.length} ${category} capabilities`);
      return capabilities;
    } catch (error) {
      console.error(`Error fetching ${category} capabilities:`, error);
      return [];
    }
  };

  // Fetch compositions for parent-child relationships
  const fetchCompositions = async () => {
    try {
      const response = await fetch('/api/compositions');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch compositions: ${response.status}`);
      }
      
      const compositions = await response.json();
      return compositions;
    } catch (error) {
      console.error('Error fetching compositions:', error);
      return [];
    }
  };

  // Function to organize capabilities into hierarchy
  const organizeCapabilitiesHierarchy = (capabilities, compositions) => {
    // Map to store capabilities by ID
    const capabilitiesMap = capabilities.reduce((map, cap) => {
      map[cap.id] = { ...cap, subCapabilities: [] };
      return map;
    }, {});
    
    // Map for parent-child relationships
    const parentChildMap = {};
    compositions.forEach(comp => {
      if (!parentChildMap[comp.source]) {
        parentChildMap[comp.source] = [];
      }
      parentChildMap[comp.source].push(comp.target);
    });
    
    // Find root capabilities
    const childIds = new Set(compositions.map(comp => comp.target));
    const rootCapabilities = capabilities
      .filter(cap => !childIds.has(cap.id))
      .map(cap => {
        const result = { ...cap, subCapabilities: [] };
        
        // Function to recursively add children
        const addChildren = (parentId, parentResult) => {
          const childrenIds = parentChildMap[parentId] || [];
          childrenIds.forEach(childId => {
            if (capabilitiesMap[childId]) {
              const childCap = { ...capabilitiesMap[childId], subCapabilities: [] };
              parentResult.subCapabilities.push(childCap);
              addChildren(childId, childCap);
            }
          });
        };
        
        addChildren(cap.id, result);
        return result;
      });
    
    return rootCapabilities;
  };

  // Filter capabilities based on goals
  const fetchCapabilitiesForGoals = async (goalIds) => {
    if (!goalIds || goalIds.length === 0) {
      return [];
    }
    
    try {
      // Try direct query approach for better performance
      const response = await fetch('/api/direct-query/influences-by-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalIds })
      });
      
      if (!response.ok) {
        throw new Error(`Failed direct query: ${response.status}`);
      }
      
      const capabilities = await response.json();
      
      // If direct query returns empty but we have goals, we'll try individual queries
      if (capabilities.length === 0 && goalIds.length > 0) {
        console.log('Direct query returned no results, trying individual goal queries');
        
        // Create a set for unique capability IDs
        const capabilityIdsSet = new Set();
        
        // Try for each goal individually
        for (const goalId of goalIds) {
          const goalResponse = await fetch(`/api/capabilities/by-goal/${goalId}`);
          if (goalResponse.ok) {
            const goalCapabilities = await goalResponse.json();
            goalCapabilities.forEach(cap => {
              if (cap && cap.id) {
                capabilityIdsSet.add(cap.id);
              }
            });
          }
        }
        
        return Array.from(capabilityIdsSet);
      }
      
      return capabilities.map(cap => cap.id);
    } catch (error) {
      console.error('Error fetching capabilities for goals:', error);
      
      // Fallback to individual goal queries
      try {
        const capabilityIdsSet = new Set();
        
        for (const goalId of goalIds) {
          const response = await fetch(`/api/capabilities/by-goal/${goalId}`);
          if (response.ok) {
            const goalCapabilities = await response.json();
            goalCapabilities.forEach(cap => {
              if (cap && cap.id) {
                capabilityIdsSet.add(cap.id);
              }
            });
          }
        }
        
        return Array.from(capabilityIdsSet);
      } catch (fallbackError) {
        console.error('Error in fallback approach:', fallbackError);
        return [];
      }
    }
  };

  // Filter capabilities based on goal influence
  const filterCapabilitiesByGoalInfluence = (capabilities, relevantCapabilityIds) => {
    if (!relevantCapabilityIds || relevantCapabilityIds.length === 0) {
      // Return empty array if no relevant capability IDs to ensure we don't show all capabilities
      console.log('No relevant capability IDs provided, returning empty array');
      return [];
    }
    
    const relevantCapabilityIdsSet = new Set(relevantCapabilityIds);
    console.log(`Filtering capabilities with ${relevantCapabilityIdsSet.size} relevant IDs`);
    
    // Helper function to check if a capability or any of its descendants is relevant
    const isCapabilityOrDescendantRelevant = (capability) => {
      // Check if this capability is relevant
      if (relevantCapabilityIdsSet.has(capability.id)) {
        return true;
      }
      
      // Check if any sub-capability is relevant
      return capability.subCapabilities && 
             capability.subCapabilities.some(subCap => isCapabilityOrDescendantRelevant(subCap));
    };
    
    // Filter the root capabilities
    const filteredCapabilities = capabilities.filter(cap => isCapabilityOrDescendantRelevant(cap));
    console.log(`Filtered down to ${filteredCapabilities.length} root capabilities`);
    
    return filteredCapabilities;
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Get selected goals from user profile
      const selectedGoalIds = await fetchUserProfile();
      console.log('Selected goal IDs:', selectedGoalIds);
      
      // If no goals selected, show no capabilities and return early
      if (!selectedGoalIds || selectedGoalIds.length === 0) {
        console.log('No goals selected, showing no capabilities');
        setFactoryCapabilities([]);
        setProductionCapabilities([]);
        setLoading(false);
        setInitialized(true);
        return;
      }
      
      // 2. Fetch all capabilities and compositions
      const [factoryCaps, productionCaps, allCompositions] = await Promise.all([
        fetchCapabilitiesByCategory('Factory Planning'),
        fetchCapabilitiesByCategory('Production Planning'),
        fetchCompositions()
      ]);
      
      console.log(`Fetched capabilities: ${factoryCaps.length} factory, ${productionCaps.length} production`);
      
      // 3. Organize capabilities into hierarchies
      const factoryHierarchy = organizeCapabilitiesHierarchy(factoryCaps, allCompositions);
      const productionHierarchy = organizeCapabilitiesHierarchy(productionCaps, allCompositions);
      
      // 4. Get capabilities that influence these goals
      const relevantCapabilityIds = await fetchCapabilitiesForGoals(selectedGoalIds);
      console.log('Relevant capability IDs:', relevantCapabilityIds);
      
      if (relevantCapabilityIds && relevantCapabilityIds.length > 0) {
        // Filter hierarchies to show only capabilities related to selected goals
        const filteredFactoryHierarchy = filterCapabilitiesByGoalInfluence(
          factoryHierarchy, 
          relevantCapabilityIds
        );
        
        const filteredProductionHierarchy = filterCapabilitiesByGoalInfluence(
          productionHierarchy, 
          relevantCapabilityIds
        );
        
        console.log(`Filtered factory hierarchy: ${filteredFactoryHierarchy.length} capabilities`);
        console.log(`Filtered production hierarchy: ${filteredProductionHierarchy.length} capabilities`);
        
        setFactoryCapabilities(filteredFactoryHierarchy);
        setProductionCapabilities(filteredProductionHierarchy);
      } else {
        // If no relevant capabilities found, set empty arrays
        console.warn('No relevant capabilities found for selected goals. Showing no capabilities.');
        setFactoryCapabilities([]);
        setProductionCapabilities([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading capability data:', err);
      setError('Failed to load capabilities. Please try again later.');
    } finally {
      setLoading(false);
      setInitialized(true);
    }
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
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {capabilities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {capabilities.map(capability => (
                    <CapabilityCard
                      key={capability.id}
                      capability={capability}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No {title.toLowerCase()} capabilities found for your selected strategic goals.</p>
                  <p className="mt-2 font-medium">Please select strategic goals on the goals page to see relevant capabilities.</p>
                  <a 
                    href="/strategic-goals" 
                    className="inline-block mt-4 px-4 py-2 bg-[#009374] text-white rounded-lg hover:bg-[#007d60] transition-colors"
                  >
                    Go to Strategic Goals
                  </a>
                </div>
              )}
            </>
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
              {userGoals.length > 0 
                ? "Showing capabilities filtered by your selected strategic goals"
                : "Select strategic goals to view relevant business capabilities"}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="/strategic-goals"
              className="flex items-center space-x-2 px-4 py-2 text-sm text-[#009374] hover:text-white border border-[#009374] rounded-lg hover:bg-[#009374] transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Select Goals</span>
            </a>
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