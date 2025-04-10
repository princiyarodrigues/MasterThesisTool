'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { FileText, Target, Activity, ChevronRight, ChevronLeft, Filter } from 'lucide-react';
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUseCases = async () => {
      setLoading(true);
      
      // Get the selectedCapabilityId from URL or state
      const params = new URLSearchParams(window.location.search);
      const urlCapabilityId = params.get('capabilityId');
      const capabilityId = urlCapabilityId || selectedCapabilityId;
      
      console.log('Filtering by capability ID:', capabilityId);
      
      // Build API URL with optional capability filter
      const apiUrl = capabilityId 
        ? `/api/use-cases?capabilityId=${capabilityId}` 
        : '/api/use-cases';
      
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
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
        
        // Get capabilities related to these goals
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
              });
            }
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
          childCapabilities: uniqueChildCapabilities 
        };
      } catch (error) {
        console.error('Error fetching capabilities:', error);
        return { parentCapabilities: [], childCapabilities: [] };
      }
    };

    const loadData = async () => {
      const { parentCapabilities, childCapabilities } = await fetchCapabilities();
      setRelatedCapabilities({ parents: parentCapabilities, children: childCapabilities });
      
      // After setting capabilities, fetch use cases
      fetchUseCases();
    };

    loadData();
  }, [selectedCapabilityId]);
  
  // Function to change the capability filter
  const changeCapabilityFilter = async (capabilityId) => {
    try {
      setLoading(true);
      setSelectedCapabilityId(capabilityId);
      
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
  
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Use Cases Catalogue</h1>
      
      {loading && <p className="text-gray-600">Loading use cases...</p>}
      
      {error && <p className="text-amber-600 mb-4">{error}</p>}
      
      {/* Filter by Business Capability */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4 text-green-600" />
          <h3 className="text-md font-medium">Filter by Business Capability:</h3>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Factory Planning & Production Management
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={() => changeCapabilityFilter(null)}
            className={`px-3 py-1 rounded-full text-sm ${
              !selectedCapabilityId 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Show All
          </button>
          
          {relatedCapabilities.parents && relatedCapabilities.parents.length > 0 ? (
            <div className="w-full">
              {/* Parent Capabilities */}
              <div className="mt-3 mb-2">
                <h4 className="text-sm font-medium text-gray-700">Parent Capabilities:</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {relatedCapabilities.parents.map(capability => (
                    <button
                      key={capability.id}
                      onClick={() => changeCapabilityFilter(capability.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedCapabilityId === capability.id
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {capability.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Child Capabilities */}
              {relatedCapabilities.children && relatedCapabilities.children.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700">Child Capabilities:</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {relatedCapabilities.children.map(capability => (
                      <button
                        key={capability.id}
                        onClick={() => changeCapabilityFilter(capability.id)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedCapabilityId === capability.id
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {capability.name}
                        {capability.parentName && (
                          <span className="ml-1 text-xs opacity-70">
                            ({capability.parentName})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              Select strategic goals to see related capabilities for filtering
            </p>
          )}
        </div>
      </div>
      
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