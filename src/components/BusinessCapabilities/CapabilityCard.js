import React, { useState } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import BusinessCapabilityModal from './BusinessCapabilityModal';

const CapabilityCard = ({ number, title, subCapabilities }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-white rounded-xl border border-gray-100 hover:border-orange-200 transition-all duration-300 overflow-hidden group cursor-pointer"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-orange-500 font-semibold">{number}</span>
              <ArrowUpRight 
                className={`w-4 h-4 text-orange-400 transition-transform duration-300 ${
                  isHovered ? 'translate-x-1 -translate-y-1' : ''
                }`}
              />
            </div>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Plus className="w-4 h-4 text-orange-400" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>

          <div className="space-y-2 flex-grow">
            {subCapabilities.map((sub, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-orange-50/50 transition-colors group/item"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover/item:bg-orange-300 transition-colors" />
                <span className="text-sm text-gray-600 group-hover/item:text-gray-900">
                  {sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BusinessCapabilityModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        capability={{ number, title, subCapabilities }}
      />
    </>
  );
};

export default CapabilityCard;