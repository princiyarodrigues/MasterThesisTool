'use client';
import { useParams } from 'next/navigation';
import ReferenceArchitecture from '@/components/ReferenceArchitecture/ReferenceArchitecture';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ReferenceArchitecturePage() {
  const params = useParams();
  const { slug } = params;
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <main className="mx-auto px-2 py-2">
          <ReferenceArchitecture departmentId={slug} />
        </main>
      </div>
    </ProtectedRoute>
  );
}