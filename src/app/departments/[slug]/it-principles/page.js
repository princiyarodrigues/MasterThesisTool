'use client';
import { useParams } from 'next/navigation';
import ITPrinciples from '../../../../components/ITPrinciples/ITPrinciples';
import BackButton from '@/components/ui/BackButton';

export default function ITPrinciplesPage() {
  const params = useParams();
  const { slug } = params;
  
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto px-6 py-8">
        <div className="mb-6">
          <BackButton />
        </div>
        <ITPrinciples departmentId={slug} />
      </main>
    </div>
  );
}  
