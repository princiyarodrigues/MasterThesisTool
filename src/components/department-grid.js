import { File } from 'lucide-react';
import { useState } from 'react';
import KnowledgePortalModal from './KnowledgePortalModal';
import { useRouter } from 'next/navigation';

export function DepartmentGrid({ departments }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCategoryClick = (category, departmentId) => {
    if (category.id === 'business-capabilities') {
      router.push(`/departments/${departmentId}/business-capabilities`);
    } else if (category.name === 'IT Vendors') {
      setIsModalOpen(true);
    }
  };

  const handleItemClick = (id) => {
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

const CategoryCard = ({ title, description, itemCount, tagCount, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white rounded-xl border border-green-600 p-6 hover:shadow-lg transition-shadow cursor-pointer"
  >
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    <div className="flex items-center space-x-4 text-sm text-gray-500">
      <div className="flex items-center">
        <File className="w-4 h-4 mr-1" />
        {itemCount} items
      </div>
    </div>
  </div>
);