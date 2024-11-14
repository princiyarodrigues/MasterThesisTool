'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import KnowledgePortalModal from './KnowledgePortalModal';
import { CategoryCard } from './Category-card';

export function DepartmentGrid({ departments }) {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCategoryClick = (category, departmentId) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (category.id === 'business-capabilities') {
      router.push(`/departments/${departmentId}/business-capabilities`);
    } else if (category.name === 'IT Vendors') {
      setIsModalOpen(true);
    }
  };

  const handleItemClick = (id) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    router.push(`/knowledge/${id}`);
  };

  return (
    <>
      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id}>
            <h2 className="text-xl font-semibold text-blue-800 mb-4">{dept.name}</h2>
            <div className="grid gap-4">
              {dept.categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  title={category.name}
                  description={category.description}
                  itemCount={category.items?.length || 0}
                  tagCount={category.tags?.length || 0}
                  onClick={() => handleCategoryClick(category, dept.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {isModalOpen && <KnowledgePortalModal onClose={handleCloseModal} onItemClick={handleItemClick} />}
    </>
  );
}