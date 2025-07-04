'use client';
import React, { useState, useEffect, use } from 'react';
import { ChevronDown, ChevronRight, Plus, Search, Filter } from 'lucide-react';
import BusinessCapabilityModal from '@/components/BusinessCapabilities/BusinessCapabilityModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import BackButton from '@/components/ui/BackButton';
import { useParams } from 'next/navigation';

const BusinessCapabilitiesPage = () => {
  // Get the department slug from the URL
  const params = useParams();
  const { slug } = params;
  
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
    if (!initialized) {
      loadAllData();
    }
  }, [initialized, loadAllData]);

  // Add effect to reload data when the page becomes visible again (e.g., after selecting goals)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && initialized) {
        console.log('Page became visible, reloading capabilities data...');
        loadAllData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [initialized, loadAllData]);

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
    // Handle the new data structure from BusinessFactoryPlanningCapas.json
    if (capability.map && capability.children_capabilities) {
      return {
        number: capability.map.name.split(' ')[0], // Extract number from name (e.g., "1.0" from "1.0 Zielplanung V2")
        title: capability.map.name.includes(' ') ? capability.map.name.split(' ').slice(1).join(' ') : capability.map.name,
        parentId: capability.map.identifier,
        parentName: capability.map.name,
        subCapabilities: capability.children_capabilities || []
      };
    }
    
    // For capabilities with children (isParent=true) - legacy format
    if (capability.children && capability.children.length > 0) {
      return {
        number: capability.name.split(' ')[0], // Extract number from name (e.g., "1.0" from "1.0 Zielplanung")
        title: capability.name.includes(' ') ? capability.name.split(' ').slice(1).join(' ') : capability.name,
        parentId: capability.id,
        parentName: capability.name,
        subCapabilities: capability.children.map(child => child.name)
      };
    }
    
    // For standalone capabilities
    return {
      number: capability.name.split(' ')[0], 
      title: capability.name.includes(' ') ? capability.name.split(' ').slice(1).join(' ') : capability.name,
      parentId: capability.id,
      parentName: capability.name,
      subCapabilities: [] // No subCapabilities for standalone capabilities
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
    // If capabilities already have the parent-child structure (through children array),
    // we can use them directly
    const haveParentChildStructure = capabilities.some(cap => cap.children && Array.isArray(cap.children));
    
    if (haveParentChildStructure) {
      // Just flatten the nested children structure to match our expected UI format
      return capabilities.map(cap => {
        // Get all children if they exist
        const allSubCapabilities = cap.children || [];
        
        // Return the capability with subCapabilities field
        return {
          ...cap,
          subCapabilities: allSubCapabilities
        };
      });
    }
    
    // If we have the old format, use the old hierarchy building logic
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
      
      // Get the capabilities directly - with the new API, we get the full capability objects
      // including their parent-child relationships
      const capabilities = await response.json();
      console.log('Direct query returned capabilities:', capabilities);
      
      if (capabilities.length === 0 && goalIds.length > 0) {
        console.log('Direct query returned no results, trying individual goal queries');
        
        // For each goal, try to get capabilities
        const allCapabilities = [];
        
        for (const goalId of goalIds) {
          const goalResponse = await fetch(`/api/capabilities/by-goal/${goalId}`);
          if (goalResponse.ok) {
            const goalCapabilities = await goalResponse.json();
            allCapabilities.push(...goalCapabilities);
          }
        }
        
        return allCapabilities;
      }
      
      return capabilities;
    } catch (error) {
      console.error('Error fetching capabilities for goals:', error);
      
      // Fallback to individual goal queries
      try {
        const allCapabilities = [];
        
        for (const goalId of goalIds) {
          const response = await fetch(`/api/capabilities/by-goal/${goalId}`);
          if (response.ok) {
            const goalCapabilities = await response.json();
            allCapabilities.push(...goalCapabilities);
          }
        }
        
        return allCapabilities;
      } catch (fallbackError) {
        console.error('Error in fallback approach:', fallbackError);
        return [];
      }
    }
  };

  // Filter capabilities based on goal influence
  const filterCapabilitiesByGoalInfluence = (capabilities, relevantCapabilities) => {
    if (!relevantCapabilities || relevantCapabilities.length === 0) {
      // Return empty array if no relevant capabilities to ensure we don't show all capabilities
      console.log('No relevant capabilities provided, returning empty array');
      return [];
    }
    
    // Extract relevant capability IDs and names for matching
    const relevantCapabilityIds = new Set();
    const relevantCapabilityNames = new Set();
    
    relevantCapabilities.forEach(cap => {
      if (cap.id) relevantCapabilityIds.add(cap.id);
      if (cap._id) relevantCapabilityIds.add(cap._id.toString());
      if (cap.name) relevantCapabilityNames.add(cap.name);
    });
    
    console.log('Relevant capability IDs:', Array.from(relevantCapabilityIds));
    console.log('Relevant capability names:', Array.from(relevantCapabilityNames));
    
    // Function to check if a capability is relevant by ID or name
    const isCapabilityRelevant = (capability) => {
      const capId = capability.id || capability._id || capability.identifier;
      const capName = capability.name;
      
      return (capId && relevantCapabilityIds.has(capId.toString())) ||
             (capName && relevantCapabilityNames.has(capName));
    };
    
    // Function to check if a capability or any of its descendants is relevant
    const hasRelevantCapabilityOrDescendant = (capability) => {
      // Check if this capability itself is relevant
      if (isCapabilityRelevant(capability)) {
        return true;
      }
      
      // Check children_capabilities (new format)
      if (capability.children_capabilities && Array.isArray(capability.children_capabilities)) {
        return capability.children_capabilities.some(child => isCapabilityRelevant(child));
      }
      
      // Check children (old format)
      if (capability.children && Array.isArray(capability.children)) {
        return capability.children.some(child => hasRelevantCapabilityOrDescendant(child));
      }
      
      // Check subCapabilities (if already processed)
      if (capability.subCapabilities && Array.isArray(capability.subCapabilities)) {
        return capability.subCapabilities.some(subCap => hasRelevantCapabilityOrDescendant(subCap));
      }
      
      return false;
    };
    
    // Filter and modify capabilities to maintain hierarchy while showing only relevant ones
    const filteredCapabilities = capabilities.filter(cap => hasRelevantCapabilityOrDescendant(cap))
      .map(capability => {
        // Create a copy of the capability
        const filteredCapability = { ...capability };
        
        // Filter children_capabilities (new format)
        if (capability.children_capabilities && Array.isArray(capability.children_capabilities)) {
          filteredCapability.children_capabilities = capability.children_capabilities.filter(child => 
            isCapabilityRelevant(child)
          );
        }
        
        // Filter children (old format)
        if (capability.children && Array.isArray(capability.children)) {
          filteredCapability.children = capability.children.filter(child => 
            hasRelevantCapabilityOrDescendant(child)
          ).map(child => {
            // Recursively filter child capabilities
            const filteredChild = { ...child };
            if (child.subCapabilities && Array.isArray(child.subCapabilities)) {
              filteredChild.subCapabilities = child.subCapabilities.filter(subCap => 
                hasRelevantCapabilityOrDescendant(subCap)
              );
            }
            return filteredChild;
          });
        }
        
        // Filter subCapabilities (if already processed)
        if (capability.subCapabilities && Array.isArray(capability.subCapabilities)) {
          filteredCapability.subCapabilities = capability.subCapabilities.filter(subCap => 
            hasRelevantCapabilityOrDescendant(subCap)
          );
        }
        
        return filteredCapability;
      });
    
    console.log(`Filtered to ${filteredCapabilities.length} parent capabilities with hierarchy maintained`);
    return filteredCapabilities;
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Get selected goals from user profile
      const selectedGoalIds = await fetchUserProfile();
      console.log('Selected goal IDs:', selectedGoalIds);
      
      // 2. If no goals are selected, show empty state with message
      if (!selectedGoalIds || selectedGoalIds.length === 0) {
        console.log('No goals selected, showing empty state');
        setFactoryCapabilities([]);
        setProductionCapabilities([]);
        setError(null);
        setLoading(false);
        setInitialized(true);
        return;
      }
      
      // 3. Fetch capabilities that are influenced by the selected goals
      const relevantCapabilities = await fetchCapabilitiesForGoals(selectedGoalIds);
      console.log('Relevant capabilities for goals:', relevantCapabilities);
      
      // 4. Load all factory planning and production management capabilities for filtering
      const [factoryResponse, productionResponse] = await Promise.all([
        fetch('/api/factory-planning-capabilities'),
        fetch('/api/production-management-capabilities')
      ]);
      
      let allFactoryCapabilities = [];
      let allProductionCapabilities = [];
      
      // Process Factory Planning capabilities
      if (factoryResponse.ok) {
        const factoryData = await factoryResponse.json();
        allFactoryCapabilities = factoryData;
      } else {
        console.error('Failed to fetch factory planning capabilities');
      }
      
      // Process Production Management capabilities
      if (productionResponse.ok) {
        const productionData = await productionResponse.json();
        allProductionCapabilities = productionData;
      } else {
        console.error('Failed to fetch production management capabilities');
      }
      
      // 5. Filter capabilities based on goal influence
      const filteredFactoryCapabilities = filterCapabilitiesByGoalInfluence(
        allFactoryCapabilities, 
        relevantCapabilities.filter(cap => 
          cap.category === 'Factory Planning' || 
          (cap.name && (cap.name.includes('Factory') || cap.name.includes('Planning')))
        )
      );
      
      const filteredProductionCapabilities = filterCapabilitiesByGoalInfluence(
        allProductionCapabilities, 
        relevantCapabilities.filter(cap => 
          cap.category === 'Production Management' || 
          cap.category === 'Production Planning' ||
          (cap.name && (cap.name.includes('Production') || cap.name.includes('Management')))
        )
      );
      
      console.log(`Filtered to ${filteredFactoryCapabilities.length} factory capabilities`);
      console.log(`Filtered to ${filteredProductionCapabilities.length} production capabilities`);
      
      // 6. Set the filtered capabilities data
      setFactoryCapabilities(filteredFactoryCapabilities);
      setProductionCapabilities(filteredProductionCapabilities);
      setError(null);
      
    } catch (err) {
      console.error('Error loading capability data:', err);
      setError('Failed to load capabilities. Please try again later.');
      setFactoryCapabilities([]);
      setProductionCapabilities([]);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const CapabilityCard = ({ capability }) => {
    const formattedCap = formatCapabilityForUI(capability);
    
    return (
      <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ backgroundColor: '#FEF3C7', borderColor: '#F3E8A6' }}>
        {/* Parent Capability Header */}
        <div className="px-6 py-4 border-b" style={{ backgroundColor: '#F3E8A6', borderColor: '#E5D985' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {formattedCap.parentName}
            </h3>
          </div>
        </div>

        {/* Sub-capabilities Container */}
        <div className="p-6 space-y-3">
          {formattedCap.subCapabilities.length > 0 ? (
            formattedCap.subCapabilities.map((sub, index) => (
              <div
                key={sub.identifier || index}
                className="rounded-xl border p-4 transition-colors cursor-pointer hover:opacity-90"
                style={{ backgroundColor: '#F3E8A6', borderColor: '#E5D985' }}
                onClick={() => handleSubCapabilityClick({ 
                  number: typeof sub === 'object' ? sub.name.split(' ')[0] : `${formattedCap.number}.${index + 1}`,
                  title: typeof sub === 'object' ? sub.name : sub,
                  parent: formattedCap.parentName
                })}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">
                      {typeof sub === 'object' ? sub.name.split(' ')[0] : `${formattedCap.number}.${index + 1}`}
                    </span>
                    <span className="text-sm text-gray-800">
                      {typeof sub === 'object' ? 
                        sub.name.includes(' ') ? sub.name.split(' ').slice(1).join(' ') : sub.name
                        : sub
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center rounded-xl border" style={{ backgroundColor: '#FEF3C7', borderColor: '#F3E8A6' }}>
              No sub-capabilities available
            </div>
          )}
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
                      key={capability.map?.identifier || capability.id || capability.identifier}
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
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#009374] mb-2">Business Capabilities</h1>
            <p className="text-gray-600">
              Showing Factory Planning and Production Management business capabilities with their parent-child relationships
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

export default BusinessCapabilitiesPage;