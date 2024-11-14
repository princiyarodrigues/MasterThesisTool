'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Import useSession for session handling
import { data } from '../../../lib/data';
import { SearchBar } from '../../../components/Search-bar';
import KnowledgePortalModal from '@/components/KnowledgePortalModal';
import LoadingSpinner from '@/components/LoadingSpinner'; // Import LoadingSpinner component
import Link from 'next/link'; // Import Link for navigation

export default function DepartmentPage({ params, searchParams }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to sign-in page if session is not available
  useEffect(() => {
    if (status === 'authenticated') {
      unwrapParams();
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status]);

  const [slug, setSlug] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  // Load and unwrap parameters once the session is authenticated
  async function unwrapParams() {
    const { slug } = await params;
    const { category: categoryId } = await searchParams;

    setSlug(slug);
    setCategoryId(categoryId);
  }

  // Show loading spinner while fetching session data
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  // Proceed if authenticated and params are loaded
  const department = data.find((d) => d.id === slug);
  const category = department?.categories.find((c) => c.id === categoryId);

  if (!department || !category) {
    return <div>Not found</div>;
  }

  const handleItemClick = (id) => {
    console.log(`Navigating to /knowledge/${id}`);
    router.push(`/knowledge/${id}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{department.name}</h1>
        <h2 className="text-xl text-gray-600 mt-2">{category.name}</h2>
      </div>

      <div className="space-y-4">
        <SearchBar onSearch={setSearchQuery} />
      </div>
      
      {/* Pass handleItemClick to KnowledgePortalModal */}
      <KnowledgePortalModal onItemClick={handleItemClick} />

      {/* Link to Business Capabilities page */}
      <div className="mt-6">
        <Link href={`/departments/${slug}/business-capabilities`}>
          <a className="text-blue-500 underline">View Business Capabilities</a>
        </Link>
      </div>
    </div>
  );
}
