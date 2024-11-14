import { Card } from './ui/card';
import { ArrowRight, Clock, Tag } from 'lucide-react';

export function CategoryCard({ category, departmentId, onClick }) {
  const isBusinessCapabilities = category.id === 'business-capabilities';

  return (
    <div 
      onClick={onClick}
      className={`block group ${isBusinessCapabilities ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <Card className={`p-6 border border-[#009374]/20 ${
        isBusinessCapabilities ? 'hover:shadow-lg transition-all duration-200' : ''
      }`}>
        <div className="space-y-4">
          <h3 className={`text-xl font-semibold text-[#009374] ${
            isBusinessCapabilities ? 'group-hover:text-[#007a60] transition-colors' : ''
          }`}>
            {category.name}
          </h3>
          <p className="text-gray-600 text-sm">
            {category.description}
          </p>
          
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-[#009374]" />
                <span>{category.items?.length || 0} items</span>
              </div>
              {category.tags && (
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4 text-[#009374]" />
                  <span>{category.tags.length} tags</span>
                </div>
              )}
            </div>
            {isBusinessCapabilities && (
              <ArrowRight className="h-5 w-5 text-[#009374] group-hover:translate-x-1 transition-all" />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}