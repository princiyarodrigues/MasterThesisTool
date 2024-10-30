import { File, ChevronRight, Tags } from 'lucide-react';
import { useState } from 'react';
import KnowledgePortalModal from './KnowledgePortalModal';

export function DepartmentGrid({ departments }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCategoryClick = (categoryName) => {
    if (categoryName === 'IT Vendors') {
      setIsModalOpen(true);
    }
    // Handle other category clicks as needed
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{dept.name}</h2>
            <div className="grid gap-4">
              {dept.categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  title={category.name}
                  description={category.description}
                  itemCount={category.items?.length || 0}
                  tagCount={category.tags?.length || 0}
                  onClick={() => handleCategoryClick(category.name)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {isModalOpen && <KnowledgePortalModal onClose={handleCloseModal} />}
    </>
  );
}

const CategoryCard = ({ title, description, itemCount, tagCount, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white rounded-xl border border-green-100 p-6 hover:shadow-lg transition-shadow cursor-pointer"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="bg-green-100 p-2 rounded-lg">
        <File className="w-5 h-5 text-green-600" />
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    <div className="flex items-center space-x-4 text-sm text-gray-500">
      <div className="flex items-center">
        <File className="w-4 h-4 mr-1" />
        {itemCount} items
      </div>
      <div className="flex items-center">
        <Tags className="w-4 h-4 mr-1" />
        {tagCount} tags
      </div>
    </div>
  </div>
);
