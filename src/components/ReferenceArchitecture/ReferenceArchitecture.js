'use client';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import FactoryArchitectureViewer from './FactoryArchitectureViewer';

export default function ReferenceArchitecture({ departmentId }) {
  return (
    <>
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <FactoryArchitectureViewer />
    </>
  );
}