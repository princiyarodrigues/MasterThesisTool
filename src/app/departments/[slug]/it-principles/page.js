'use client';
import { useParams } from 'next/navigation';
import ITPrinciples from '../../../../components/ITPrinciples/ITPrinciples';


export default function ITPrinciplesPage() {
  const params = useParams();
  
  return (
    <div className="min-h-screen bg-white">
 
      <main className="mx-auto px-6 py-8">
        <ITPrinciples />
      </main>
    </div>
  );
}  
