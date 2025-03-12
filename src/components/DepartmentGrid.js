'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { CategoryCard } from './Category-card';

export default function DepartmentGrid({ departments }) {
  const router = useRouter();

  const handleCategoryClick = (category, departmentId) => {
    if (category.id === 'business-capabilities') {
      router.push(`/departments/${departmentId}/business-capabilities`);
    } else if (category.id === 'it-vendors') {
      router.push(`/departments/${departmentId}/it-principles`);
    } else if (category.id === 'use-cases') {
      router.push(`/departments/${departmentId}/use-cases`);
    } else if (category.id === 'reference-architecture') {
      router.push(`/departments/${departmentId}/reference-architecture`);
    }
  };

  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
      {departments?.map((dept) => (
        <div key={dept.id} className="grid grid-rows-[1fr]">
          <h2 className="text-xl font-semibold text-green-600 mb-4">
            {dept.name}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {dept.categories?.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                departmentId={dept.id}
                onClick={() => handleCategoryClick(category, dept.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}