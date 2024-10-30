import React, { useState } from 'react';
import { X, FileText, Clock, Tags, AlertCircle, ChevronRight, BookOpen, Shield, Target } from 'lucide-react';

const KnowledgePortalModal = ({ onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const subcategoryOptions = [
    { 
      id: 'vendor-strategy',
      title: 'Vendor Strategy BP_020',
      description: 'Strategic IT vendor selection guidelines',
      icon: Target,
      content: {
        statement: 'Consider applications from Rocket Chips strategic IT partners first: Microsoft and SAP',
        rationale: 'Rocket Chips has long relationships to its IT partners (vendors and services) which are based on corporate contracts to ensure best license prices, interoperability and integration, maintenance and premium support (e.g., 24x7).',
        implications: [
          'Organizations may not be able to select the best fit-for-purpose application from an ISV when our partners offer similar capabilities.',
          'Maintenance and support contracts are already in place through corporate contracts.',
          'International availability can be ensured.'
        ],
        lastUpdated: '2024-10-30',
        tags: ['IT', 'Vendor', 'Strategy'],
        status: 'Active'
      }
    },
    { 
      id: 'vendor-evaluation',
      title: 'Vendor Evaluation Process',
      description: 'Standard process for evaluating new vendors',
      icon: FileText,
      content: {
        statement: 'Follow standardized evaluation criteria for all new vendor selections',
        rationale: 'A consistent evaluation process ensures fair assessment and optimal vendor selection aligned with company objectives.',
        implications: [
          'Standardized scoring system for vendor capabilities',
          'Mandatory security and compliance checks',
          'Integration assessment with existing systems'
        ],
        lastUpdated: '2024-10-25',
        tags: ['Process', 'Evaluation', 'Vendor'],
        status: 'Active'
      }
    },
    { 
      id: 'vendor-list',
      title: 'Current Vendor List',
      description: 'List of approved IT vendors',
      icon: BookOpen,
      content: {
        statement: 'Maintain and regularly update approved vendor registry',
        rationale: 'Central repository of approved vendors ensures compliance and streamlined procurement.',
        implications: [
          'Regular vendor performance reviews',
          'Consolidated vendor management',
          'Simplified procurement process'
        ],
        lastUpdated: '2024-10-28',
        tags: ['Vendors', 'Registry', 'Procurement'],
        status: 'Active'
      }
    },
    { 
      id: 'vendor-compliance',
      title: 'Vendor Compliance',
      description: 'Compliance requirements for IT vendors',
      icon: Shield,
      content: {
        statement: 'All vendors must meet minimum security and compliance standards',
        rationale: 'Ensuring vendor compliance protects company data and maintains regulatory requirements.',
        implications: [
          'Annual security assessments required',
          'Regular compliance audits',
          'Mandatory security certifications'
        ],
        lastUpdated: '2024-10-27',
        tags: ['Compliance', 'Security', 'Regulations'],
        status: 'Active'
      }
    }
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDetailModalOpen(true);
  };

  // Separate close handlers
  const handleMainModalClose = () => {
    onClose(); // Close the main modal
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false); // Close the detail modal
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleMainModalClose} />

      {/* Main Modal */}
      {!isDetailModalOpen ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[500px] p-6 z-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">IT Principles</h2>
            <button onClick={handleMainModalClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <div className="space-y-3">
            {subcategoryOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className="w-full flex items-center p-4 rounded-lg hover:bg-green-50 transition-colors group border border-green-100"
              >
                <option.icon className="w-8 h-8 text-green-600 mr-4" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-lg">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-500" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Detail Modal
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[1000px] max-h-[80vh] overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 text-green-100 mb-2">
                  <FileText size={20} />
                  <span>IT Principles</span>
                  <span>•</span>
                  <span>{selectedOption?.id}</span>
                </div>
                <h2 className="text-3xl font-semibold mb-2">{selectedOption?.title}</h2>
                <div className="flex items-center space-x-4 text-sm">
                </div>
              </div>
              <button onClick={handleDetailModalClose} className="text-white/80 hover:text-white">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex px-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-3 font-medium text-sm border-b-2 ${
                  activeTab === 'details' 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Details
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 overflow-y-auto max-h-[calc(80vh-250px)]">
            <div className="max-w-4xl space-y-8">
              {/* Statement Section */}
              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Statement</h3>
                <p className="text-green-900">{selectedOption?.content.statement}</p>
              </div>

              {/* Rationale Section */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 p-2 rounded-lg mr-3">
                    <Target className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Rationale</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {selectedOption?.content.rationale}
                </p>
              </div>

              {/* Implications Section */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <AlertCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Implications</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  {selectedOption?.content.implications.map((implication, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-3" />
                      <p className="text-gray-700">{implication}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgePortalModal;
