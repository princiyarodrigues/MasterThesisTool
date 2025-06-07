import React from 'react';

const LoadingSpinner = ({ isVisible, message = "Saving changes..." }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm"></div>
      
      {/* Spinner container */}
      <div className="relative z-10 bg-white rounded-lg shadow-2xl p-6 flex flex-col items-center justify-center min-w-[200px]">
        {/* Animated spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 border-solid rounded-full animate-spin border-t-blue-600"></div>
          {/* Optional inner spinner for extra effect */}
          <div className="absolute top-2 left-2 w-8 h-8 border-2 border-emerald-200 border-solid rounded-full animate-spin border-t-emerald-500 animation-delay-200"></div>
        </div>
        
        {/* Loading message */}
        <div className="mt-4 text-center">
          <p className="text-gray-700 font-medium text-sm">{message}</p>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 