import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import EnhancedReferenceArchitecture from './EnhancedReferenceArchitecture';

const ReferenceArchitecture = ({ departmentId = 'operations' }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Navigation */}
        <div className="mb-4">
          <Link 
            href={`/departments/${departmentId}`} 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Department</span>
          </Link>
        </div>  
        {/* Enhanced Architecture Component */}
        <EnhancedReferenceArchitecture />
      </div>
    </div>
  );
};

export default ReferenceArchitecture;