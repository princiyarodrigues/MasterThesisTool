'use client';
import React, { useState } from 'react';
import TechnicalCapabilitiesMap from '@/components/TechnicalCapabilities/TechnicalCapabilitiesMap';
import { Filter, Plus } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';
import { useParams } from 'next/navigation';

export default function TechnicalCapabilitiesPage() {
  const params = useParams();
  const { slug } = params;
  
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <div className="mb-4">
        <h1 className="text-4xl font-bold text-[#009374]">Technical Factory Twin Capabilities</h1>
        <p className="text-gray-600 mt-2">
          Showing technical capabilities filtered by your selected strategic goals
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <div className="flex">
          <button className="flex items-center gap-2 px-4 py-2 mr-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Select Goals</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      <TechnicalCapabilitiesMap slug={slug} />
    </div>
  );
} 