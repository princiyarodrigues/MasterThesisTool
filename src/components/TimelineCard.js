'use client';
import React from 'react';
import { Calendar } from 'lucide-react';

export function TimelineCard() {
  return (
    <div className="bg-gradient-to-r from-navy-50 to-blue-50 border-2 border-navy-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300" style={{ background: 'linear-gradient(to right, #f0f4f8, #e6f3ff)', borderColor: '#1e3a8a' }}>
      <div className="flex items-center space-x-3 mb-3">
        <div className="bg-navy-700 p-1.5 rounded-lg" style={{ backgroundColor: '#1e3a8a' }}>
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-navy-800" style={{ color: '#1e3a8a' }}>Set Your Future Timeline</h3>
          <p className="text-navy-600 text-xs" style={{ color: '#3730a3' }}>Plan your digital transformation journey</p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          className="px-3 py-1.5 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors text-xs font-medium"
          style={{ backgroundColor: '#1e3a8a' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1e40af'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#1e3a8a'}
          disabled
        >
          Configure Timeline
        </button>
      </div>
    </div>
  );
} 