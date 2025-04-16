'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Zap } from 'lucide-react';

// Helper to get step number based on category ID
const getStepNumber = (categoryId) => {
  switch(categoryId) {
    case 'architecture-goals':
      return 1;
    case 'business-capabilities':
      return 2;
    case 'use-cases':
      return 3;
    default:
      return null;
  }
};

// Helper to check if this is a recommended category
const isRecommendedCategory = (categoryId) => {
  return ['architecture-goals', 'business-capabilities', 'use-cases'].includes(categoryId);
};

export function CategoryCard({ category, departmentId, onClick }) {
  const router = useRouter();
  const stepNumber = getStepNumber(category.id);
  const isRecommended = isRecommendedCategory(category.id);

  const handleClick = () => {
    if (category.id === 'architecture-goals') {
      router.push('/strategic-goals');
    } else {
      switch (category.id) {
        case 'business-capabilities':
          router.push(`/departments/${departmentId}/business-capabilities`);
          break;
        case 'it-vendors':
          router.push(`/departments/${departmentId}/it-principles`);
          break;
        default:
          onClick();
      }
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`block group cursor-pointer transition-all duration-200 ease-in-out h-full relative ${
        isRecommended ? 'transform hover:scale-105' : ''
      }`}
      data-tour={category.id}
    >
      {isRecommended && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold shadow-md z-10">
          {stepNumber}
        </div>
      )}
      
      <div className={`bg-white rounded-xl border ${
        isRecommended 
          ? 'border-teal-600 shadow-md' 
          : 'border-green-600'
      } p-6 hover:shadow-lg transition-all duration-200 h-full flex flex-col`}>
        {isRecommended && (
          <div className="absolute top-2 right-2">
            <Zap className="w-5 h-5 text-teal-500" />
          </div>
        )}
        
        <div className="space-y-4 flex-grow">
          <div>
            <h3 className={`text-lg font-semibold ${
              isRecommended ? 'text-teal-700 group-hover:text-teal-800' : 'text-gray-800 group-hover:text-green-600'
            } transition-colors duration-200 min-h-[1.75rem]`}>
              {category.name}
              {isRecommended && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">
                  Recommended
                </span>
              )}
            </h3>
            <p className="text-gray-600 text-sm mt-2 min-h-[2.5rem]">
              {category.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-2 mt-auto">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {/* Items and tags information removed as requested */}
            </div>
            <div className="flex items-center">
              <ArrowRight 
                className={`w-5 h-5 ${
                  isRecommended 
                    ? 'text-teal-500 transform group-hover:translate-x-1 transition-all duration-200'
                    : `text-gray-400 transform group-hover:translate-x-1 group-hover:text-green-600 transition-all duration-200
                      ${category.id === 'business-capabilities' || category.id === 'it-vendors' || category.id === 'architecture-goals' ? 'opacity-100' : 'opacity-0'}`
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CategoryCard.defaultProps = {
  onClick: () => {},
};