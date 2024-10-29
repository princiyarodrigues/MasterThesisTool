'use client';
import { useState } from 'react';
import { DepartmentGrid } from '../components/department-grid';
import { SearchBar } from '../components/search-bar';
import { FilterBar } from '../components/filter-bar';
import { departments } from '../lib/data';
import '../../src/app/globals.css'

// Helper function to get all unique tags
const getAllTags = () => {
  const tags = new Set();
  departments.forEach(dept => {
    dept.categories.forEach(cat => {
      cat.tags?.forEach(tag => tags.add(tag));
      cat.items.forEach(item => {
        item.tags?.forEach(tag => tags.add(tag));
      });
    });
  });
  return Array.from(tags);
};

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
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Knowledge Portal</h1>
      
      <div className="space-y-4">
        <SearchBar onSearch={setSearchQuery} />
        <FilterBar 
          tags={getAllTags()} 
          onFilterChange={setSelectedTags}
        />
      </div>

      <DepartmentGrid departments={filterDepartments()} />
    </div>
  );
}
