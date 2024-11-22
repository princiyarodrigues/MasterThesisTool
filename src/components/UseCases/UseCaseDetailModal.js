
'use client';
import { X } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function UseCaseDetailModal({ useCase, onClose }) {
  if (!useCase) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="absolute inset-4 md:inset-10 bg-white rounded-xl shadow-xl overflow-auto">
        {/* Header */}
        <div className="bg-gray-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-gray-200 text-sm mb-2">UC {useCase.number}</div>
              <h2 className="text-2xl font-bold">{useCase.title}</h2>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-white">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Left Column - Description */}
          <div>
            <Card className="h-full">
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-700 bg-gray-600 p-2">Description</h3>
                <div className="p-4">
                  <p className="text-gray-600">{useCase.description}</p>
                  <div className="mt-4">
                    <span className="font-medium">
                      ZB (workplace optimization, Safety and Health at Work)
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Middle Column - Business Perspective */}
          <div>
            <Card className="h-full">
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-700 bg-gray-600 p-2 mb-4">
                  business perspective
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Classification in process level reference architecture</h4>
                    <div className="bg-gray-100 p-4 rounded">
                      [Process Level Diagram Placeholder]
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Typical roles involved:</h4>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>Works council</li>
                      <li>plant manager</li>
                      <li>shift manager</li>
                      <li>industrial engineer</li>
                      <li>shop floor employee</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Required functionalities</h4>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>Show anonymized paths</li>
                      <li>performance analysis</li>
                      <li>health and safety monitoring</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Typical value propositions</h4>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>Overview of employees' working conditions</li>
                      <li>performance improvement</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Use Case Diagram Business</h4>
                    <div className="bg-gray-100 p-4 rounded">
                      [Business Diagram Placeholder]
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - IT Perspective */}
          <div>
            <Card className="h-full">
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-700 bg-gray-600 p-2 mb-4">
                  IT perspective
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Typical IT systems involved</h4>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>ERP: Human Resources Management Module and Production Planning Module</li>
                      <li>MFS: Order Tracking Module</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Typical data objects involved</h4>
                    <p className="text-gray-600">plant layout, location data, task assignment</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Required IT components system software</h4>
                    <p className="text-gray-600">database management system</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Typical functions of application software</h4>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>data visualization and dashboards</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Use Case Diagram IT</h4>
                    <div className="bg-gray-100 p-4 rounded">
                      [IT Diagram Placeholder]
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}