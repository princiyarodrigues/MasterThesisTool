'use client';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';

export default function TechnicalCapabilitiesMap({ slug }) {
  const [technicalCapabilities, setTechnicalCapabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({ 'factory-twin': true });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTechnicalCapabilities = async () => {
      try {
        setLoading(true);
        console.log('Department slug:', slug);
        
        // Use the new API endpoint for technical factory twin capabilities
        const response = await fetch('/api/technical-factory-twin-capabilities');
        
        if (!response.ok) {
          throw new Error('Failed to fetch technical capabilities');
        }
        
        const data = await response.json();
        console.log('Fetched technical capabilities:', data);
        setTechnicalCapabilities(data);
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
              <div className="text-center py-8">Loading technical capabilities...</div>
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
                <div className="text-center py-8 text-gray-500">
                  <p>No {title.toLowerCase()} capabilities found.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
  
  if (loading) {
    return <div className="text-center py-8">Loading technical capabilities...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
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