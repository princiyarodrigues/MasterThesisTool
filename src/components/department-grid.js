'use client';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CategoryCard } from './category-card';

export function DepartmentGrid({ departments }) {
  const [expandedDepartments, setExpandedDepartments] = useState(
    departments.map(dept => dept.id)
  );
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    // This ensures that the date is set client-side only, preventing mismatches during hydration.
    setTodayDate(new Date().toLocaleDateString());
  }, []);

  const toggleDepartment = (deptId) => {
    setExpandedDepartments(prev =>
      prev.includes(deptId)
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  if (!departments.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600">
          No departments found matching your criteria
        </h3>
        <p className="text-gray-500 mt-2">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {departments.map((dept) => (
        <section
          key={dept.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {/* Department Header */}
          <div
            className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleDepartment(dept.id)}
          >
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-gray-900">
                {dept.name}
              </h2>
              <p className="text-gray-600">
                {dept.description}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                {dept.categories.length} {dept.categories.length === 1 ? 'category' : 'categories'}
              </div>
              {expandedDepartments.includes(dept.id) ? (
                <ChevronDown className="h-6 w-6 text-gray-400" />
              ) : (
                <ChevronRight className="h-6 w-6 text-gray-400" />
              )}
            </div>
          </div>

          {/* Categories Grid */}
          {expandedDepartments.includes(dept.id) && (
            <div className="p-6 pt-0">
              {dept.categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dept.categories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      departmentId={dept.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No categories found in this department
                </div>
              )}
            </div>
          )}

          {/* Department Stats */}
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
            <div className="flex justify-between text-sm text-gray-600">
              <div className="flex space-x-4">
                <span>
                  Total Items: {dept.categories.reduce((acc, cat) => acc + cat.items.length, 0)}
                </span>
                <span>•</span>
                <span>
                  Last Updated: {todayDate}
                </span>
              </div>
              <div className="flex space-x-2">
                {dept.categories.slice(0, 3).map(cat => 
                  cat.tags?.slice(0, 1).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))
                )}
                {dept.categories.reduce((acc, cat) => acc + (cat.tags?.length || 0), 0) > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    +more
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
