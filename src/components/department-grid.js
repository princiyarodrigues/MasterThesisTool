'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { CategoryCard } from '../components/Category-card';

export function DepartmentGrid({ departments }) {
  const router = useRouter();

  const handleCategoryClick = (category, departmentId) => {
    if (category.id === 'business-capabilities') {
      router.push(`/departments/${departmentId}/business-capabilities`);
    } else if (category.id === 'it-vendors') {
      router.push(`/departments/${departmentId}/it-principles`);
    }
  };

  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
      {departments?.map((dept) => (
        <div key={dept.id}>
          <h2 className="text-xl font-semibold text-green-600 mb-4">
            {dept.name}
          </h2>
          <div className="grid gap-4">
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