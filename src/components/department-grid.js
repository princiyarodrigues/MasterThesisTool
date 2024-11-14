'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic imports with loading fallback
const KnowledgePortalModal = dynamic(
  () => import('./KnowledgePortalModal'),
  { ssr: false, loading: () => <div>Loading modal...</div> }
);

const CategoryCard = dynamic(
  () => import('./Category-card').then(mod => ({ default: mod.CategoryCard })),
  { loading: () => <div>Loading card...</div> }
);

export function DepartmentGrid() {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
  if (isLoading) return <div>Loading...</div>;

  return (
    <Suspense fallback={<div>Loading departments...</div>}>
      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id}>
            <h2 className="text-xl font-semibold text-blue-800 mb-4">{dept.name}</h2>
            <div className="grid gap-4">
              {dept.categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  departmentId={dept.id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <KnowledgePortalModal 
          onClose={() => setIsModalOpen(false)}
          category={selectedCategory}
        />
      )}
    </Suspense>
  );
}