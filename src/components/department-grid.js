'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import LoadingSpinner from './LoadingSpinner';

const CategoryCard = dynamic(
  () => import('./Category-card').then(mod => ({ default: mod.CategoryCard })),
  { loading: () => <LoadingSpinner /> }
);

export function DepartmentGrid() {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleCategoryClick = (category, departmentId) => {
    if (category.id === 'business-capabilities') {
      router.push(`/departments/${departmentId}/business-capabilities`);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/departments');
      if (!response.ok) throw new Error('Failed to fetch departments');
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (isLoading) return <LoadingSpinner />;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id}>
            <h2 className="text-xl font-semibold text-[#009374] mb-4">{dept.name}</h2>
            <div className="grid gap-4">
              {dept.categories.map((category) => (
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
    </Suspense>
  );
}