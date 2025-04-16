'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { FileText, Target, Activity, ChevronRight, ChevronLeft, Filter, ChevronDown } from 'lucide-react';
import UseCaseDetailModal from '../../components/UseCases/UseCaseDetailModal';
// Import from static data as fallback
import { useCasesData as staticUseCasesData } from '@/lib/use-cases-data';

const iconMap = {
  'hr': Activity,
  'production': Target,
  'quality': FileText
};

// Number of items per page
const ITEMS_PER_PAGE = 9;

export default function UseCases() {
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  const [selectedCapabilityId, setSelectedCapabilityId] = useState(null);
  const [relatedCapabilities, setRelatedCapabilities] = useState([]);
  const [filterSource, setFilterSource] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCapabilityName, setSelectedCapabilityName] = useState('All Capabilities');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUseCases = async () => {
      setLoading(true);
      
      // Get the selectedCapabilityId from URL or state
      const params = new URLSearchParams(window.location.search);
      const urlCapabilityId = params.get('capabilityId');
      const capabilityId = urlCapabilityId || selectedCapabilityId;
      
      if (urlCapabilityId && urlCapabilityId !== selectedCapabilityId) {
        setSelectedCapabilityId(urlCapabilityId);
        setFilterSource('url');
      }
      
      console.log('Filtering by capability ID:', capabilityId);
      
      // Build API URL with optional capability filter
      const apiUrl = capabilityId 
        ? `/api/use-cases?capabilityId=${capabilityId}` 
        : '/api/use-cases';
      
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          console.log(`Fetched ${data.length} use cases from API`);
          setUseCases(data);
        } else {
          console.error('Failed to fetch use cases from API, falling back to static data');
          setUseCases(staticUseCasesData);
        }
      } catch (error) {
        console.error('Error fetching use cases:', error);
        setUseCases(staticUseCasesData);
      } finally {
        setLoading(false);
      }
    };

    // Fetch capabilities for filtering
    const fetchCapabilities = async () => {
      try {
        // Get user profile to see selected goals
        const userResponse = await fetch('/api/user/profile');
        if (!userResponse.ok) {
          console.error('Failed to fetch user profile');
          return { parentCapabilities: [], childCapabilities: [] };
        }
        
        const userData = await userResponse.json();
        
        // Get selected goals
        const selectedGoalIds = [];
        if (userData.strategicGoalSelections) {
          Object.entries(userData.strategicGoalSelections).forEach(([goalId, isSelected]) => {
            if (isSelected === true) {
              selectedGoalIds.push(goalId);
            }
          });
        }
        
        if (selectedGoalIds.length === 0) {
          console.log('No goals selected');
          return { parentCapabilities: [], childCapabilities: [] };
        }
        
        console.log('Selected goal IDs:', selectedGoalIds);
        
        // Get capabilities related to these goals using the same API as business capabilities page
        const capabilitiesResponse = await fetch('/api/direct-query/influences-by-goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ goalIds: selectedGoalIds })
        });
        
        if (!capabilitiesResponse.ok) {
          console.error('Failed to fetch capabilities');
          return { parentCapabilities: [], childCapabilities: [] };
        }
        
        const capabilities = await capabilitiesResponse.json();
        console.log(`Fetched ${capabilities.length} capabilities for selected goals`);
        
        // Separate parent and child capabilities
        const parentCapabilities = [];
        const childCapabilities = [];
        const childToParentMap = {};
        
        capabilities.forEach(capability => {
          if (capability.isParent) {
            parentCapabilities.push(capability);
            
            // If this parent has children, add them to childCapabilities
            if (capability.children && capability.children.length > 0) {
              capability.children.forEach(child => {
                // Add parentName property to each child
                child.parentName = capability.name;
                child.parentId = capability.id;
                childCapabilities.push(child);
                
                // Track parent relationship for filtering
                childToParentMap[child.id] = capability.id;
              });
            }
          } else if (capability.parentId) {
            // This is a child capability with a known parent
            childCapabilities.push({
              ...capability,
              parentId: capability.parentId
            });
            
            // Track parent relationship for filtering
            childToParentMap[capability.id] = capability.parentId;
          } else {
            // This is a standalone capability (not a parent or child)
            childCapabilities.push(capability);
          }
        });
        
        // Remove any duplicates by ID
        const uniqueChildCapabilities = childCapabilities.filter((cap, index, self) => 
          index === self.findIndex(c => c.id === cap.id)
        );
        
        const uniqueParentCapabilities = parentCapabilities.filter((cap, index, self) => 
          index === self.findIndex(c => c.id === cap.id)
        );
        
        console.log(`Organized capabilities: ${uniqueParentCapabilities.length} parents, ${uniqueChildCapabilities.length} children`);
        
        return { 
          parentCapabilities: uniqueParentCapabilities, 
          childCapabilities: uniqueChildCapabilities,
          childToParentMap
        };
      } catch (error) {
        console.error('Error fetching capabilities:', error);
        return { parentCapabilities: [], childCapabilities: [], childToParentMap: {} };
      }
    };

    const loadData = async () => {
      const { parentCapabilities, childCapabilities, childToParentMap } = await fetchCapabilities();
      setRelatedCapabilities({ 
        parents: parentCapabilities, 
        children: childCapabilities,
        childToParentMap
      });
      
      // After setting capabilities, fetch use cases
      fetchUseCases();
    };

    loadData();
  }, [selectedCapabilityId]);
  
  // Function to change the capability filter
  const changeCapabilityFilter = async (capabilityId, capabilityName = 'All Capabilities') => {
    try {
      setLoading(true);
      setSelectedCapabilityId(capabilityId);
      setSelectedCapabilityName(capabilityName);
      setFilterSource('manual');
      setIsDropdownOpen(false);
      
      // Reset to first page
      setCurrentPage(1);
      
      // Build the API URL with selected capability
      let url = '/api/use-cases';
      if (capabilityId) {
        // Pass the specific capability ID for exact matching
        url += `?capabilityId=${encodeURIComponent(capabilityId)}`;
      }
      
      console.log("Fetching use cases with URL:", url);
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error('Failed to fetch filtered use cases');
      }
      
      const data = await res.json();
      console.log(`Fetched ${data.length} use cases for capability ${capabilityId}`);
      
      // Update the use cases
      setUseCases(data);
      
      // Update URL without full page reload
      const newUrl = capabilityId 
        ? `${window.location.pathname}?capabilityId=${capabilityId}` 
        : window.location.pathname;
      window.history.pushState({}, '', newUrl);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching filtered use cases:', err);
      setError('Failed to apply filter. Showing all use cases.');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(useCases.length / ITEMS_PER_PAGE);
  
  // Get current items
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = useCases.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Go to next/prev page
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  // Get filter status text
  const getFilterStatusText = () => {
    if (!selectedCapabilityId) return 'Showing all use cases';
    
    // Check if it's a parent or child capability
    if (relatedCapabilities.parents) {
      const parentCap = relatedCapabilities.parents.find(p => p.id === selectedCapabilityId);
      if (parentCap) {
        return `Showing use cases for parent capability: ${parentCap.name}`;
      }
    }
    
    if (relatedCapabilities.children) {
      const childCap = relatedCapabilities.children.find(c => c.id === selectedCapabilityId);
      if (childCap) {
        if (childCap.parentName) {
          return `Showing use cases for ${childCap.name} (${childCap.parentName})`;
        } else {
          return `Showing use cases for ${childCap.name}`;
        }
      }
    }
    
    return `Showing filtered use cases`;
  };
  
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Use Cases Catalogue</h1>
      
      {loading && <p className="text-gray-600">Loading use cases...</p>}
      
      {error && <p className="text-amber-600 mb-4">{error}</p>}
      
      {/* Filter by Business Capability Dropdown */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4 text-green-600" />
          <h3 className="text-md font-medium">Filter by Business Capability:</h3>
        </div>
        
        <div className="relative">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{selectedCapabilityName}</span>
              {selectedCapabilityId && (
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    changeCapabilityFilter(null);
                  }}
                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full hover:bg-green-200 cursor-pointer"
                >
                  Clear
                </span>
              )}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-900" />
          </div>

          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              <div className="p-2">
                <div
                  onClick={() => changeCapabilityFilter(null)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 rounded-md cursor-pointer font-medium"
                >
                  All Capabilities
                </div>

                {/* Factory Planning Section */}
                {relatedCapabilities.parents && relatedCapabilities.parents.filter(cap => cap.category === 'Factory Planning').length > 0 && (
                  <div className="mt-2">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-900 bg-gray-50">
                      Factory Planning
                    </div>
                    {relatedCapabilities.parents
                      .filter(cap => cap.category === 'Factory Planning')
                      .map(capability => (
                        <div
                          key={capability.id}
                          onClick={() => changeCapabilityFilter(capability.id, capability.name)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 rounded-md cursor-pointer font-medium"
                        >
                          {capability.name}
                        </div>
                    ))}
                  </div>
                )}

                {/* Production Management Section */}
                {relatedCapabilities.parents && relatedCapabilities.parents.filter(cap => cap.category === 'Production Planning').length > 0 && (
                  <div className="mt-2">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-900 bg-gray-50">
                      Production Management
                    </div>
                    {relatedCapabilities.parents
                      .filter(cap => cap.category === 'Production Planning')
                      .map(capability => (
                        <div
                          key={capability.id}
                          onClick={() => changeCapabilityFilter(capability.id, capability.name)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 rounded-md cursor-pointer font-medium"
                        >
                          {capability.name}
                        </div>
                    ))}
                  </div>
                )}

                {/* Child Capabilities Section */}
                {relatedCapabilities.children && relatedCapabilities.children.length > 0 && (
                  <div className="mt-2">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-900 bg-gray-50">
                      Sub-capabilities
                    </div>
                    {relatedCapabilities.children.map(capability => (
                      <div
                        key={capability.id}
                        onClick={() => changeCapabilityFilter(capability.id, `${capability.name}${capability.parentName ? ` (${capability.parentName})` : ''}`)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 rounded-md cursor-pointer flex items-center justify-between font-medium"
                      >
                        <span>{capability.name}</span>
                        {capability.parentName && (
                          <span className="text-xs text-gray-900">
                            {capability.parentName}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter status text */}
      {selectedCapabilityId && !loading && (
        <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-lg">
          <p className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Showing use cases for: {selectedCapabilityName}
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {useCases.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, useCases.length)} of {useCases.length} use cases
        </p>
      </div>
      
      {useCases.length === 0 && !loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No use cases found for the selected filter.</p>
          {selectedCapabilityId && (
            <button 
              onClick={() => changeCapabilityFilter(null)}
              className="mt-4 text-green-600 underline hover:text-green-700"
            >
              Clear filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((useCase, index) => {
            const Icon = iconMap[useCase.type] || FileText;
            return (
              <button
                key={useCase.id}
                className="text-left w-full group"
                onClick={() => setSelectedUseCase(useCase)}
              >
                <Card className="hover:shadow-md transition-shadow duration-200 border-green-100 h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-green-600">
                            #{(indexOfFirstItem + index + 1).toString().padStart(2, '0')}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mt-1 line-clamp-2">{useCase.title}</h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{useCase.description}</p>
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                            {useCase.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>
      )}
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:bg-green-50'}`}
            >
              <ChevronLeft size={20} />
            </button>
            
            {/* Page numbers */}
            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    currentPage === i + 1
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-green-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:bg-green-50'}`}
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        </div>
      )}
      
      {selectedUseCase && (
        <UseCaseDetailModal 
          useCase={selectedUseCase} 
          onClose={() => setSelectedUseCase(null)} 
        />
      )}
    </>
  );
}