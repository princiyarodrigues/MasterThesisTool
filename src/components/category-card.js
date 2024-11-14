import Link from 'next/link';
import { Card } from './ui/card';
import { ArrowRight, Clock, Tag } from 'lucide-react';

export function CategoryCard({ 
  category = {
    name: '',
    description: '',
    items: [],
    tags: []
  }, 
  departmentId = '' 
}) {
  // Early return if category is undefined
  if (!category) {
    return null;
  }

  // Safely access properties with optional chaining
  const itemCount = category?.items?.length || 0;
  const tagCount = category?.tags?.length || 0;

  return (
    <Link 
      href={`/departments/${departmentId}/business-capabilities`}
      className="block group"
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-200 border border-gray-100">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {category?.name || 'Untitled Category'}
          </h3>
          <p className="text-gray-600 text-sm">
            {category?.description || 'No description available'}
          </p>
          
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{itemCount} items</span>
              </div>
              {category?.tags && (
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4" />
                  <span>{tagCount} tags</span>
                </div>
              )}
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:transform group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Card>
    </Link>
  );
}