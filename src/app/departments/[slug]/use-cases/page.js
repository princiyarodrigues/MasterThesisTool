'use client';
import { useParams } from 'next/navigation';
import UseCases from '../../../../components/UseCases/UseCases';


export default function UseCasesPage() {
  const params = useParams();
  
  return (
    <div className="min-h-screen bg-white">
  
      <main className="mx-auto px-6 py-8">
        <UseCases />
      </main>
    </div>
  );
}