'use client';
import React, { useState } from 'react';
import TechnicalCapabilitiesMap from '@/components/TechnicalCapabilities/TechnicalCapabilitiesMap';
import { Filter } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';
import { useParams } from 'next/navigation';

export default function TechnicalCapabilitiesPage() {
  const params = useParams();
  const { slug } = params;
  
  return (
    <div className="max-w-[1600px] mx-auto p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#009374] mb-2">Technical Factory Twin Capabilities</h1>
            <p className="text-black">
              Showing technical capabilities filtered by your selected strategic goals
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="/strategic-goals"
              className="flex items-center space-x-2 px-4 py-2 text-sm text-[#009374] hover:text-white border border-[#009374] rounded-lg hover:bg-[#009374] transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Select Goals</span>
            </a>
          </div>
        </div>
      </div>

      {/* Technical Capabilities Map Component */}
      <TechnicalCapabilitiesMap slug={slug} />
    </div>
  );
} 