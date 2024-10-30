'use client';
import { useState, useEffect } from 'react';
import { departments } from '../../../lib/data';
import { KanbanBoard } from '../../../components/ui/kanban-board';
import { FilterBar } from '../../../components/filter-bar';
import { SearchBar } from '../../../components/search-bar';
import '../../../app/globals.css';
import KnowledgePortalModal from '@/components/KnowledgePortalModal';

export default function DepartmentPage({ params, searchParams }) {
  const [slug, setSlug] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    // Unwrap `params` and `searchParams` promises
    async function unwrapParams() {
      const { slug } = await params;
      const { category: categoryId } = await searchParams;

      setSlug(slug);
      setCategoryId(categoryId);
    }

    unwrapParams();
  }, [params, searchParams]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // Find the department using slug from the URL
  const department = departments.find((d) => d.id === slug);
  // Find the category using categoryId from the URL
  const category = department?.categories.find(
    (c) => c.id === categoryId
  );

  if (!department || !category) {
    return <div>Not found</div>;
  }

  const filterItems = (items) => {
    return items.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = 
        selectedTags.length === 0 ||
        item.tags?.some(tag => selectedTags.includes(tag));

      return matchesSearch && matchesTags;
    });
  };

  // Get all unique tags from items
  const getAllItemTags = () => {
    const tags = new Set();
    category.items.forEach(item => {
      item.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{department.name}</h1>
        <h2 className="text-xl text-gray-600 mt-2">{category.name}</h2>
      </div>

      <div className="space-y-4">
        <SearchBar onSearch={setSearchQuery} />
        {/* <FilterBar 
          tags={getAllItemTags()} 
          onFilterChange={setSelectedTags}
        /> */}
      </div>
      <KnowledgePortalModal/>
      {/* <KanbanBoard items={filterItems(category.items)} /> */}
    </div>
  );
}
