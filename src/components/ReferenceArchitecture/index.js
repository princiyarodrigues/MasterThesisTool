'use client';
import { useParams } from 'next/navigation';
import ReferenceArchitecture from '@/components/ReferenceArchitecture';
import { Navbar } from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ReferenceArchitecturePage() {
  const params = useParams();
  const { slug } = params;
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="mx-auto px-6 py-8">
          <ReferenceArchitecture departmentId={slug} />
        </main>
      </div>
    </ProtectedRoute>
  );
}