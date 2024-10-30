'use client';
import { useState } from 'react';
import { Navbar } from '../components/navbar';
import { SearchBar } from '../components/search-bar';
import { FilterBar } from '../components/filter-bar';
import { DepartmentGrid } from '../components/department-grid';
import { departments } from '../lib/data';
import KnowledgePortalModal from '@/components/KnowledgePortalModal';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const filterDepartments = () => {
    return departments.map(dept => ({
      ...dept,
      categories: dept.categories.filter(cat => {
        const matchesSearch = 
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTags = 
          selectedTags.length === 0 ||
          cat.tags?.some(tag => selectedTags.includes(tag)) ||
          cat.items.some(item => 
            item.tags?.some(tag => selectedTags.includes(tag))
          );

        return matchesSearch && matchesTags;
      })
    })).filter(dept => dept.categories.length > 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navbar />
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Knowledge Portal</h1>
        
        <div className="space-y-4 mb-8">
          <SearchBar onSearch={setSearchQuery} />
          {/* <FilterBar 
            tags={getAllTags()} 
            onFilterChange={setSelectedTags}
          /> */}
        </div>

        <DepartmentGrid departments={filterDepartments()} />
        {/* <KnowledgePortalModal/> */}
      </main>
    </div>
  );
}