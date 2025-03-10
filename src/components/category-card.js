'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Clock, Tag } from 'lucide-react';

export function CategoryCard({ category, departmentId, onClick }) {
  const router = useRouter();

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
      className="block group cursor-pointer transition-all duration-200 ease-in-out h-full"
    >
      <div className="bg-white rounded-xl border border-green-600 p-6 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
        <div className="space-y-4 flex-grow">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-200 min-h-[1.75rem]">
              {category.name}
            </h3>
            <p className="text-gray-600 text-sm mt-2 min-h-[2.5rem]">
              {category.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-2 mt-auto">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{category.items?.length || 0} items</span>
              </div>
              {category.tags && category.tags.length > 0 && (
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  <span>{category.tags.length} tags</span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <ArrowRight 
                className={`w-5 h-5 text-gray-400 transform group-hover:translate-x-1 group-hover:text-green-600 transition-all duration-200
                  ${category.id === 'business-capabilities' || category.id === 'it-vendors' || category.id === 'architecture-goals' ? 'opacity-100' : 'opacity-0'}`}
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