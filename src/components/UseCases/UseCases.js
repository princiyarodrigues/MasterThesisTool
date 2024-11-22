'use client';
import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { FileText, Target, Activity, ChevronRight } from 'lucide-react';
import UseCaseDetailModal from '../../components/UseCases/UseCaseDetailModal';

const iconMap = {
  'hr': Activity,
  'production': Target,
  'quality': FileText
};

const useCasesData = [
  {
    id: 'uc-001',
    title: 'Real-time Employee Data Tracking',
    description: 'Monitor selected employee data in real-time for performance analysis',
    category: 'HR Analytics',
    type: 'hr'
  },
  {
    id: 'uc-002',
    title: 'Production Line Efficiency Monitor',
    description: 'Real-time monitoring and optimization of production line efficiency',
    category: 'Manufacturing',
    type: 'production'
  },
  {
    id: 'uc-003',
    title: 'Quality Control Automation',
    description: 'Automated quality inspection using computer vision',
    category: 'Quality Assurance',
    type: 'quality'
  },
  {
    id: 'uc-004',
    title: 'Predictive Maintenance System',
    description: 'AI-powered predictive maintenance for factory equipment',
    category: 'Maintenance',
    type: 'production'
  },
  {
    id: 'uc-005',
    title: 'Inventory Optimization',
    description: 'Smart inventory management using IoT sensors',
    category: 'Logistics',
    type: 'production'
    },
];

export default function UseCases() {
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Use Cases Catalogue</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {useCasesData.map((useCase, index) => {
          const Icon = iconMap[useCase.type] || FileText;
          return (
            <button
              key={useCase.id}
              className="text-left w-full group"
              // onClick={() => console.log(`Selected use case: ${useCase.id}`)}
              onClick={() => setSelectedUseCase(useCase)}
            >
              <Card className="hover:shadow-md transition-shadow duration-200 border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">#{(index + 1).toString().padStart(2, '0')}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mt-1">{useCase.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{useCase.description}</p>
                      <div className="mt-3">
                        <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                          {useCase.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
      {selectedUseCase && (
        <UseCaseDetailModal 
          useCase={selectedUseCase} 
          onClose={() => setSelectedUseCase(null)} 
        />
      )}
    </>
  );
}