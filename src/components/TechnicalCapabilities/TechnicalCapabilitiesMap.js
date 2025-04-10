'use client';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';

export default function TechnicalCapabilitiesMap({ slug }) {
  const [technicalCapabilities, setTechnicalCapabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMaps, setExpandedMaps] = useState({ 'factory-twin': false });

  useEffect(() => {
    const fetchTechnicalCapabilities = async () => {
      try {
        setLoading(true);
        console.log('Department slug:', slug);
        const response = await fetch('/api/technical-capabilities');
        
        if (!response.ok) {
          throw new Error('Failed to fetch technical capabilities');
        }
        
        const data = await response.json();
        console.log('Fetched technical capabilities:', data);
        setTechnicalCapabilities(data);
        
        // Initialize expanded state moved to useState initial value
        
        setError(null);
      } catch (err) {
        console.error('Error fetching technical capabilities:', err);
        setError('Failed to load technical capabilities');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTechnicalCapabilities();
  }, [slug]);
  
  const toggleMap = (mapId) => {
    setExpandedMaps(prev => ({
      ...prev,
      [mapId]: !prev[mapId]
    }));
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading technical capabilities...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }
  
  if (technicalCapabilities.length === 0) {
    return <div className="text-center py-8">No technical capabilities found.</div>;
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <input
          type="text"
          placeholder="Search capabilities..."
          className="border border-gray-300 rounded-md p-2 pl-4 w-full max-w-md"
        />
      </div>
      
      {/* Factory Twin section */}
      <div className="border border-gray-200 rounded-md bg-white mb-8">
        <div 
          className="flex items-center cursor-pointer p-4" 
          onClick={() => toggleMap('factory-twin')}
        >
          {expandedMaps['factory-twin'] ? 
            <ChevronDown className="w-5 h-5 text-green-600 mr-2" /> : 
            <ChevronRight className="w-5 h-5 text-green-600 mr-2" />
          }
          <h3 className="text-xl font-semibold text-green-600">
            Factory Twin
          </h3>
          <span className="ml-2 text-sm text-gray-500">
            {technicalCapabilities.length} capabilities
          </span>
        </div>
        
        {expandedMaps['factory-twin'] && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {technicalCapabilities.map((capabilityGroup) => {
              // Extract number from the map name (e.g., "1.0" from "1.0 Something V2")
              const match = capabilityGroup.map.name.match(/^(\d+\.\d+)/);
              const groupNumber = match ? match[1] : '';
              const groupName = capabilityGroup.map.name.replace(/^(\d+\.\d+\s)/, '').replace(' V2', '');
              
              return (
                <div key={capabilityGroup.map.identifier} className="relative">
                  <div className="absolute top-3 left-3 text-green-700 font-semibold">
                    {groupNumber}
                  </div>
                  <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow h-[100px] group cursor-pointer">
                    <div className="ml-10">
                      <div className="font-medium text-gray-800 group-hover:text-green-600">
                        {groupName}
                      </div>
                    </div>
                    <button className="absolute bottom-3 right-3 bg-green-100 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 text-green-700" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Display child capabilities when parent is clicked - similar to the image */}
      {expandedMaps['factory-twin'] && technicalCapabilities.map((capabilityGroup) => {
        const mapMatch = capabilityGroup.map.name.match(/^(\d+\.\d+)/);
        const mapNumber = mapMatch ? mapMatch[1] : '';
        const mapName = capabilityGroup.map.name.replace(/^(\d+\.\d+\s)/, '').replace(' V2', '');
        
        if (capabilityGroup.children_capabilities.length === 0) {
          return null;
        }
        
        return (
          <div key={capabilityGroup.map.identifier} className="mb-6">
            <div className="flex items-baseline mb-2">
              <h3 className="text-green-700 font-semibold mr-2">{mapNumber}</h3>
              <h3 className="text-xl font-semibold text-green-700">{mapName}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {capabilityGroup.children_capabilities.map((capability) => {
                const match = capability.name.match(/^(\d+\.\d+)/);
                const capabilityNumber = match ? match[1] : '';
                const capabilityName = capability.name.replace(/^(\d+\.\d+\s)/, '').replace(' V2', '');
                
                return (
                  <div key={capability.identifier} className="relative">
                    <div className="absolute top-3 left-3 text-green-700 font-semibold">
                      {capabilityNumber}
                    </div>
                    <div className="p-4 bg-[#f5f9f9] border border-[#e6eeef] rounded-md shadow-sm hover:shadow h-[100px] group cursor-pointer">
                      <div className="ml-10 pr-3">
                        <div className="font-medium text-gray-800 group-hover:text-green-600 line-clamp-3">
                          {capabilityName}
                        </div>
                      </div>
                      <button className="absolute bottom-3 right-3 bg-green-100 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4 text-green-700" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
} 