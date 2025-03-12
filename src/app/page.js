'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
// import { SearchBar } from '@/components/Search-bar';
import { DepartmentGrid } from '../components/Department-grid.js'
import { data } from '@/lib/data';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  const filterDepartments = () => {
    return data.map(dept => ({
      ...dept,
      categories: dept.categories.filter(cat => {
        const matchesSearch = 
          cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTags = 
          selectedTags.length === 0 ||
          cat.tags?.some(tag => selectedTags.includes(tag)) ||
          cat.items?.some(item => 
            item.tags?.some(tag => selectedTags.includes(tag))
          );

        return matchesSearch && matchesTags;
      })
    })).filter(dept => dept.categories.length > 0);
  };

  return (
    <>
 
      <main className="mx-auto px-0 py-0">
        <h1 className="text-4xl font-bold text-[#009374] mb-8">Process Model</h1>
        
        {/* <div className="space-y-4 mb-8">
          <SearchBar onSearch={setSearchQuery} />
        </div> */}

        <DepartmentGrid departments={filterDepartments()} />
      </main>
    </>
  );
}