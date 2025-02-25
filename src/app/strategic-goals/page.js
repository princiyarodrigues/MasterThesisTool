'use client';
import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Save, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function StrategicGoalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [goals, setGoals] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch goals from the database
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/goals');
        
        if (!response.ok) {
          throw new Error('Failed to fetch goals');
        }
        
        const data = await response.json();
        // Format the goals data to match the expected structure
        const formattedGoals = data.map(goal => ({
          id: goal.id,
          title: goal.name.split(' ').slice(1).join(' '), // Extract title from name
          description: goal.name, // Use the full name as description for now
          // Determine color based on goal ID prefix
          color: goal.name.startsWith('1.') ? 'bg-blue-50'
            : goal.name.startsWith('2.') ? 'bg-green-50'
            : goal.name.startsWith('3.') ? 'bg-purple-50'
            : goal.name.startsWith('4.') ? 'bg-orange-50'
            : 'bg-gray-50'
        }));
        
        setGoals(formattedGoals);
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch selections
    const fetchSelections = async () => {
      try {
        // First try to get from localStorage
        const savedSelections = localStorage.getItem('strategicGoalSelections');
        if (savedSelections) {
          console.log('Found selections in localStorage:', JSON.parse(savedSelections));
          setSelectedGoals(JSON.parse(savedSelections));
        }

        // Then try to fetch from backend
        const response = await fetch('/api/strategic-goals');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched selections from backend:', data);
          setSelectedGoals(data);
          localStorage.setItem('strategicGoalSelections', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error fetching selections:', error);
      }
    };

    if (status === 'authenticated') {
      fetchGoals();
      fetchSelections();
    }
  }, [status]);

  const handleGoalSelection = (goalId) => {
    const newSelections = {
      ...selectedGoals,
      [goalId]: !selectedGoals[goalId]
    };
    setSelectedGoals(newSelections);
    // Explicitly save to localStorage whenever a selection changes
    localStorage.setItem('strategicGoalSelections', JSON.stringify(newSelections));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/strategic-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selections: selectedGoals }),
      });

      if (response.ok) {
        setSaveStatus({
          type: 'success',
          message: 'Selections saved successfully'
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Error saving selections');
      }
    } catch (error) {
      setSaveStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
    }
  };

  if (status === 'loading' || loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-6 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error loading strategic goals: {error}
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Factory Strategic Goals</h1>
            <p className="text-gray-600 mt-2">Strategic objectives and targets for factory optimization</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {saveStatus.message && (
              <div className={`flex items-center px-4 py-2 rounded-lg text-sm ${
                saveStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <AlertCircle className="w-4 h-4 mr-2" />
                {saveStatus.message}
              </div>
            )}
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`
                flex items-center px-4 py-2 rounded-lg text-white
                ${isSaving ? 'bg-[#009374]/50 cursor-not-allowed' : 'bg-[#009374] hover:bg-[#007a60]'}
                transition-colors duration-200
              `}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Selections'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="relative">
            {/* Goals Flow Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
              {goals.map((goal, index) => {
                const isSelected = selectedGoals[goal.id] || false;
                
                return (
                  <div
                    key={goal.id}
                    onClick={() => handleGoalSelection(goal.id)}
                    className={`
                      ${goal.color} rounded-lg p-4 shadow-sm border cursor-pointer
                      ${isSelected ? 'border-green-500' : 'border-gray-200'}
                      hover:shadow-md transition-all duration-200 relative
                    `}
                  >
                    {/* Checkbox */}
                    <div className={`
                      absolute top-4 right-4 w-5 h-5 rounded 
                      ${isSelected ? 'bg-green-500' : 'bg-white border border-gray-300'}
                      flex items-center justify-center transition-colors
                    `}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    {/* Connector Arrow */}
                    {index !== goals.length - 1 && (
                      <div className="hidden lg:block absolute -right-2 top-1/2 transform -translate-y-1/2 z-20">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    )}

                    <div className="flex flex-col h-full pr-8">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-600">
                          {goal.id}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {goal.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 rounded" />
              <span className="text-sm text-gray-600">Performance Goals</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 rounded" />
              <span className="text-sm text-gray-600">Adaptability Goals</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-100 rounded" />
              <span className="text-sm text-gray-600">Sustainability Goals</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-100 rounded" />
              <span className="text-sm text-gray-600">Workplace Goals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}