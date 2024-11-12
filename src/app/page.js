'use client';
import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { SearchBar } from '../components/Search-bar';
import { DepartmentGrid } from '../components/Department-grid';
import { data } from '../lib/data';


export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const filterDepartments = () => {
    return data.map(dept => ({
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
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Process Model</h1>
        
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