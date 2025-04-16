'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronRight, ArrowRight, Info, CheckCircle } from 'lucide-react';

const TOUR_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Digital Twin Factory Tool',
    description: 'This guided tour will help you navigate through the application effectively. You will need to manually navigate to each recommended section.',
    position: 'center',
    highlight: null,
    action: null
  },
  {
    id: 'architecture-goals',
    title: 'Start with Architecture Goals',
    description: 'First, you should select the strategic goals for your factory. Look for the "Architecture : Factory Strategic Goals" card in the Production Department section and click on it to navigate there. This will help customize the recommendations for business capabilities and use cases.',
    position: 'right',
    highlight: '[data-tour="architecture-goals"]',
    action: '/departments/engineering/reference-architecture',
    navigationText: 'Find the Architecture : Factory Strategic Goals card and click it'
  },
  {
    id: 'business-capabilities',
    title: 'Explore Business Capabilities',
    description: 'After setting your goals, return to the main page and explore the "Business Capabilities" card in the Production Department section. Click on it to understand what can be implemented based on your selected goals.',
    position: 'right',
    highlight: '[data-tour="business-capabilities"]',
    action: '/departments/engineering/business-capabilities',
    navigationText: 'Find the Business Capabilities card and click it'
  },
  {
    id: 'use-cases',
    title: 'Review Use Cases',
    description: 'Finally, go back to the main page and check out the "Use Cases" card in the Operations and Solutions section. Click on it to see concrete applications based on your goals and selected capabilities.',
    position: 'left',
    highlight: '[data-tour="use-cases"]',
    action: '/departments/operations/use-cases',
    navigationText: 'Find the Use Cases card and click it'
  }
];

export default function TourGuide({ onComplete, departmentId = 'engineering' }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [userProgress, setUserProgress] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tourProgress');
      return saved ? JSON.parse(saved) : { completed: [], current: 0 };
    }
    return { completed: [], current: 0 };
  });
  
  const router = useRouter();
  
  // Save progress to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tourProgress', JSON.stringify(userProgress));
    }
  }, [userProgress]);
  
  // On mount, start from the saved step
  useEffect(() => {
    setCurrentStep(userProgress.current);
  }, [userProgress.current]);
  
  // Position the tooltip based on the highlighted element
  useEffect(() => {
    const step = TOUR_STEPS[currentStep];
    if (!step || !step.highlight || step.position === 'center') return;
    
    const element = document.querySelector(step.highlight);
    if (!element) return;
    
    // Position logic would go here
  }, [currentStep]);

  const handleNextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setUserProgress(prev => ({
        ...prev,
        completed: [...prev.completed, TOUR_STEPS[currentStep].id],
        current: nextStep
      }));
      
      // Remove automatic navigation
      // const currentTourStep = TOUR_STEPS[currentStep];
      // if (currentTourStep.action) {
      //   router.push(currentTourStep.action.replace('engineering', departmentId));
      // }
    } else {
      // Tour completed
      handleComplete();
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setUserProgress(prev => ({
        ...prev,
        current: prevStep
      }));
    }
  };
  
  const handleSkip = () => {
    setIsVisible(false);
    if (onComplete) onComplete();
  };
  
  const handleComplete = () => {
    setUserProgress(prev => ({
      ...prev,
      completed: [...prev.completed, TOUR_STEPS[currentStep].id],
      current: TOUR_STEPS.length
    }));
    setIsVisible(false);
    if (onComplete) onComplete();
  };
  
  const resetTour = () => {
    setUserProgress({ completed: [], current: 0 });
    setCurrentStep(0);
    setIsVisible(true);
  };
  
  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={resetTour}
          className="flex items-center space-x-2 px-3 py-2 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-colors"
        >
          <Info className="w-4 h-4" />
          <span>Tour Guide</span>
        </button>
      </div>
    );
  }
  
  const currentTourStep = TOUR_STEPS[currentStep];
  
  // Render centered tooltip for welcome step
  if (currentTourStep.position === 'center') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{currentTourStep.title}</h3>
            <button onClick={handleSkip} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mb-6">{currentTourStep.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {TOUR_STEPS.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-teal-600' : 'bg-gray-300'}`}
                />
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSkip}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Skip tour
              </button>
              <button
                onClick={handleNextStep}
                className="px-4 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center space-x-1"
              >
                <span>Start</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render tooltip next to highlighted element
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 bg-black/20 pointer-events-auto">
        {/* This will be used for highlighting specific elements */}
      </div>
      
      <div 
        className={`absolute ${
          currentTourStep.position === 'right' ? 'left-1/2 ml-4' : 
          currentTourStep.position === 'left' ? 'right-1/2 mr-4' : 
          'left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'
        } pointer-events-auto bg-white rounded-lg shadow-lg p-4 max-w-sm`}
        style={{ top: '30%' }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{currentTourStep.title}</h3>
          <button onClick={handleSkip} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">{currentTourStep.description}</p>
        
        {/* Navigation guidance */}
        {currentTourStep.navigationText && (
          <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
            <div className="flex items-center">
              <ArrowRight className="w-5 h-5 text-teal-600 mr-2 flex-shrink-0" />
              <p className="text-sm font-medium text-teal-700">
                {currentTourStep.navigationText}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {TOUR_STEPS.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-teal-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrevStep}
                className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
            )}
            <button
              onClick={currentStep < TOUR_STEPS.length - 1 ? handleNextStep : handleComplete}
              className="px-4 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center space-x-1"
            >
              <span>{currentStep < TOUR_STEPS.length - 1 ? 'Next' : 'Finish'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 