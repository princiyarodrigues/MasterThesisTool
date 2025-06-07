'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
// import { SearchBar } from '@/components/Search-bar';
import { DepartmentGrid } from '../components/DepartmentGrid'
import { TimelineCard } from '../components/TimelineCard'
import { Footer } from '../components/Footer'
import { data } from '@/lib/data';
import LoadingSpinner from '@/components/LoadingSpinner';
import TourGuide from '@/components/ui/TourGuide';
import { Info, Lightbulb } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTour, setShowTour] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tourCompleted') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
    
    // Check if this is first time visitor
    if (typeof window !== 'undefined') {
      const isFirstVisit = !localStorage.getItem('visitedBefore');
      if (isFirstVisit && !tourCompleted) {
        // Show tour automatically on first visit after a short delay
        const timer = setTimeout(() => setShowTour(true), 1000);
        localStorage.setItem('visitedBefore', 'true');
        return () => clearTimeout(timer);
      }
    }
  }, [session, status, router, tourCompleted]);

  const handleTourComplete = () => {
    setShowTour(false);
    setTourCompleted(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tourCompleted', 'true');
    }
  };

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
      {showTour && <TourGuide onComplete={handleTourComplete} />}
      
      <main className="mx-auto px-4 py-4 relative">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-[#009374]">Process Model</h1>
          
          {!showTour && (
            <button 
              onClick={() => setShowTour(true)} 
              className="flex items-center space-x-2 px-3 py-2 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Guided Tour</span>
            </button>
          )}
        </div>
        
        <div className="mb-6 bg-teal-50 border border-teal-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-teal-800 mb-2 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Recommended Workflow
          </h2>
          <p className="text-teal-700">
            For the best experience, follow these steps:
          </p>
          <ol className="list-decimal pl-5 mt-2 space-y-1 text-teal-700">
            <li>Start with <strong>Architecture Goals</strong> to define your factory&apos;s strategic direction</li>
            <li>Explore <strong>Business Capabilities</strong> to understand implementation options</li>
            <li>Review <strong>Use Cases</strong> to see concrete applications</li>
          </ol>
        </div>
        
        <DepartmentGrid departments={filterDepartments()} />
        
        {/* Timeline Card - positioned below departments */}
        <div className="mt-6">
          <TimelineCard />
        </div>
      </main>
      <Footer />
    </>
  );
}