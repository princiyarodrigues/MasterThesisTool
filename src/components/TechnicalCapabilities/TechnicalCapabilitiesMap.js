'use client';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TechnicalCapabilitiesMap({ slug }) {
  const [technicalCapabilities, setTechnicalCapabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({ 'factory-twin': true });
  const [searchQuery, setSearchQuery] = useState('');
  const [userGoals, setUserGoals] = useState([]);
  const [initialized, setInitialized] = useState(false);

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

  // Function to create a mapping between goals and technical capabilities
  const getRelevantTechnicalCapabilities = (goalIds, allCapabilities) => {
    if (!goalIds || goalIds.length === 0) {
      return [];
    }

    // Create a logical mapping between strategic goals and technical capabilities
    // Since we don't have specific data, we'll create a sensible mapping based on goal themes
    const goalToTechnicalMapping = {
      // Data Integration and Management goals
      'data-integration': ['1.0 Datenintegration V2'],
      'data-management': ['1.0 Datenintegration V2'],
      'digital-transformation': ['1.0 Datenintegration V2', '2.0 Integration V2'],
      
      // System Integration goals
      'system-integration': ['2.0 Integration V2'],
      'enterprise-integration': ['2.0 Integration V2'],
      
      // Intelligence and Analytics goals
      'intelligence': ['3.0 Intelligentes Verhalten V2'],
      'analytics': ['3.0 Intelligentes Verhalten V2'],
      'automation': ['3.0 Intelligentes Verhalten V2'],
      
      // User Interface and Visualization goals
      'visualization': ['4.0 Benutzerschnittstelle V2'],
      'user-experience': ['4.0 Benutzerschnittstelle V2'],
      'interface': ['4.0 Benutzerschnittstelle V2'],
      
      // Factory and Manufacturing goals (map to multiple technical capabilities)
      'factory': ['1.0 Datenintegration V2', '2.0 Integration V2', '3.0 Intelligentes Verhalten V2'],
      'manufacturing': ['1.0 Datenintegration V2', '2.0 Integration V2', '3.0 Intelligentes Verhalten V2'],
      'production': ['1.0 Datenintegration V2', '2.0 Integration V2', '3.0 Intelligentes Verhalten V2'],
      
      // Quality and Performance goals
      'quality': ['3.0 Intelligentes Verhalten V2'],
      'performance': ['3.0 Intelligentes Verhalten V2'],
      'monitoring': ['3.0 Intelligentes Verhalten V2', '4.0 Benutzerschnittstelle V2'],
      
      // Innovation and Technology goals
      'innovation': ['4.0 Benutzerschnittstelle V2'],
      'technology': ['2.0 Integration V2', '3.0 Intelligentes Verhalten V2'],
      
      // Default mapping - if goal content matches certain patterns, include relevant capabilities
      // This is a fallback for goals that don't match specific patterns above
    };

    // Extract relevant capability names based on goals
    const relevantCapabilityNames = new Set();
    
    goalIds.forEach(goalId => {
      // Direct mapping check
      Object.entries(goalToTechnicalMapping).forEach(([key, capabilities]) => {
        if (goalId.toLowerCase().includes(key) || 
            (typeof goalId === 'string' && goalId.toLowerCase().includes(key))) {
          capabilities.forEach(cap => relevantCapabilityNames.add(cap));
        }
      });
      
      // Additional pattern matching for goal content
      const goalLower = goalId.toLowerCase();
      if (goalLower.includes('data') || goalLower.includes('daten')) {
        relevantCapabilityNames.add('1.0 Datenintegration V2');
      }
      if (goalLower.includes('integration') || goalLower.includes('system')) {
        relevantCapabilityNames.add('2.0 Integration V2');
      }
      if (goalLower.includes('intelligent') || goalLower.includes('smart') || goalLower.includes('analytics')) {
        relevantCapabilityNames.add('3.0 Intelligentes Verhalten V2');
      }
      if (goalLower.includes('interface') || goalLower.includes('visualization') || goalLower.includes('ui')) {
        relevantCapabilityNames.add('4.0 Benutzerschnittstelle V2');
      }
    });

    // If no specific mappings found, include all capabilities (fallback)
    if (relevantCapabilityNames.size === 0) {
      console.log('No specific mappings found for goals, including all technical capabilities');
      return allCapabilities;
    }

    // Filter capabilities based on relevant names
    const filteredCapabilities = allCapabilities.filter(capability => 
      relevantCapabilityNames.has(capability.map.name)
    );

    console.log(`Technical capabilities filtered from ${allCapabilities.length} to ${filteredCapabilities.length} based on goals`);
    return filteredCapabilities;
  };

  const loadAllData = async () => {
        setLoading(true);
    try {
      // 1. Get selected goals from user profile
      const selectedGoalIds = await fetchUserProfile();
      console.log('Selected goal IDs:', selectedGoalIds);
        
      // 2. If no goals are selected, show empty state
      if (!selectedGoalIds || selectedGoalIds.length === 0) {
        console.log('No goals selected, showing empty state');
        setTechnicalCapabilities([]);
        setError(null);
        setLoading(false);
        setInitialized(true);
        return;
      }
      
      // 3. Load all technical capabilities
        const response = await fetch('/api/technical-factory-twin-capabilities');
        
        if (!response.ok) {
          throw new Error('Failed to fetch technical capabilities');
        }
        
      const allCapabilities = await response.json();
      console.log('Fetched all technical capabilities:', allCapabilities);
      
      // 4. Filter capabilities based on selected goals
      const relevantCapabilities = getRelevantTechnicalCapabilities(selectedGoalIds, allCapabilities);
      
      console.log(`Filtered to ${relevantCapabilities.length} relevant technical capabilities`);
      setTechnicalCapabilities(relevantCapabilities);
        setError(null);
      
      } catch (err) {
      console.error('Error loading technical capability data:', err);
      setError('Failed to load technical capabilities. Please try again later.');
      setTechnicalCapabilities([]);
      } finally {
        setLoading(false);
      setInitialized(true);
      }
    };
    
  useEffect(() => {
    if (!initialized) {
      loadAllData();
    }
  }, [initialized]);

  // Function to format capability data to match the business capabilities structure
  const formatCapabilityForUI = (capability) => {
    return {
      number: capability.map.name.split(' ')[0], // Extract number from name (e.g., "1.0" from "1.0 Datenintegration V2")
      title: capability.map.name.includes(' ') ? capability.map.name.split(' ').slice(1).join(' ') : capability.map.name,
      parentId: capability.map.identifier,
      parentName: capability.map.name,
      subCapabilities: capability.children_capabilities || []
    };
  };

  const toggleSection = (sectionType) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionType]: !prev[sectionType]
    }));
  };

  const handleSubCapabilityClick = (capability) => {
    console.log('Sub-capability clicked:', capability);
    // You can add modal or navigation logic here similar to business capabilities
  };

  const CapabilityCard = ({ capability }) => {
    const formattedCap = formatCapabilityForUI(capability);
    
    return (
      <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ backgroundColor: '#FEF3C7', borderColor: '#F3E8A6' }}>
        {/* Parent Capability Header */}
        <div className="px-6 py-4 border-b" style={{ backgroundColor: '#F3E8A6', borderColor: '#E5D985' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black">
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
                    <span className="text-sm font-medium text-black">
                      {typeof sub === 'object' ? sub.name.split(' ')[0] : `${formattedCap.number}.${index + 1}`}
                    </span>
                    <span className="text-sm text-black">
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
                      key={capability.map?.identifier || capability.identifier}
                      capability={capability}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-black">
                  <p>No technical capabilities found for your selected strategic goals.</p>
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
    <div>
      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search capabilities..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#009374] focus:ring-2 focus:ring-[#009374]/20"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Factory Twin Section */}
      <Section
        title="Factory Twin"
        capabilities={technicalCapabilities}
        type="factory-twin"
      />
    </div>
  );
} 