'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { data } from '@/lib/data';  // Adjust the import path based on your project structure

export default function BusinessCapabilitiesPage() {
  const { slug } = useParams();
  const [selectedCapabilities, setSelectedCapabilities] = useState([]);

  const department = data.find(dept => dept.id === slug);
  const category = department?.categories.find(cat => cat.id === 'business-capabilities');

  if (!department || !category) {
    return <div>Business Capabilities not found</div>;
  }

  const handleToggle = (id) => {
    setSelectedCapabilities(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(selectedId => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{category.name}</h1>
      <div className="space-y-4">
        {category.items.map((capability) => (
          <div key={capability.id} className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={capability.id}
              checked={selectedCapabilities.includes(capability.id)}
              onChange={() => handleToggle(capability.id)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor={capability.id} className="text-sm font-medium text-gray-700">
              {capability.title}
            </label>
          </div>
        ))}
      </div>
      <button 
        onClick={() => console.log("Selected Capabilities:", selectedCapabilities)}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Save Selection
      </button>
    </div>
  );
}
