// components/KnowledgeDetailModal.js

import React from 'react';
import { X, FileText, Target, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/router';

const KnowledgeDetail = ({ selectedOption }) => {
  const router = useRouter();

  const handleDetailModalClose = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleDetailModalClose} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[1000px] max-h-[80vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-800 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 text-green-100 mb-2">
                <FileText size={20} />
                <span>IT Principles</span>
                <span>•</span>
                <span>{selectedOption?.id}</span>
              </div>
              <h2 className="text-3xl font-semibold mb-2">{selectedOption?.title}</h2>
            </div>
            <button onClick={handleDetailModalClose} className="text-white/80 hover:text-white">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(80vh-250px)]">
          <div className="max-w-4xl space-y-8">
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Statement</h3>
              <p className="text-green-900">{selectedOption?.content.statement}</p>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 p-2 rounded-lg mr-3">
                  <Target className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold">Rationale</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{selectedOption?.content.rationale}</p>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <AlertCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Implications</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                {selectedOption?.content.implications.map((implication, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-3" />
                    <p className="text-gray-700">{implication}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeDetail;
