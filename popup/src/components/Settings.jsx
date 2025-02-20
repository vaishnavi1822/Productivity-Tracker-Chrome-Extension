import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { CheckCircleIcon } from '@heroicons/react/outline';

const Settings = () => {
  const { user, logout } = useAuth();
  const [showNotification, setShowNotification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Helper function to safely parse numbers
  const safeParseInt = (value, defaultValue) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // Initialize state with safe values
  const [workingHours, setWorkingHours] = useState({
    start: safeParseInt(user?.preferences?.workingHours?.start, 9),
    end: safeParseInt(user?.preferences?.workingHours?.end, 17)
  });

  const [goals, setGoals] = useState({
    productiveHours: safeParseInt(user?.preferences?.dailyGoals?.productiveHours, 6),
    maxUnproductiveHours: safeParseInt(user?.preferences?.dailyGoals?.maxUnproductiveHours, 2)
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setWorkingHours(parsed.workingHours);
      setGoals(parsed.goals);
    }
  }, []);

  const handleStartTimeChange = (e) => {
    const value = safeParseInt(e.target.value, workingHours.start);
    if (value >= 0 && value <= 23) {
      setWorkingHours(prev => ({ ...prev, start: value }));
    }
  };

  const handleEndTimeChange = (e) => {
    const value = safeParseInt(e.target.value, workingHours.end);
    if (value >= 0 && value <= 23) {
      setWorkingHours(prev => ({ ...prev, end: value }));
    }
  };

  const handleProductiveHoursChange = (e) => {
    const value = safeParseInt(e.target.value, goals.productiveHours);
    if (value >= 1 && value <= 24) {
      setGoals(prev => ({ ...prev, productiveHours: value }));
    }
  };

  const handleUnproductiveHoursChange = (e) => {
    const value = safeParseInt(e.target.value, goals.maxUnproductiveHours);
    if (value >= 0 && value <= 24) {
      setGoals(prev => ({ ...prev, maxUnproductiveHours: value }));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify({
        workingHours,
        goals
      }));

      // Save to backend
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/settings/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          preferences: {
            workingHours,
            dailyGoals: goals
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      // Show success notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      // You could add error notification here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 relative">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-200 text-green-700 px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg animate-fade-in-down">
          <CheckCircleIcon className="w-5 h-5" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-4">Settings</h2>

      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-3">Working Hours</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start Time</label>
              <input
                type="number"
                min="0"
                max="23"
                value={workingHours.start}
                onChange={handleStartTimeChange}
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">End Time</label>
              <input
                type="number"
                min="0"
                max="23"
                value={workingHours.end}
                onChange={handleEndTimeChange}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-3">Daily Goals</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Productive Hours Target</label>
              <input
                type="number"
                min="1"
                max="24"
                value={goals.productiveHours}
                onChange={handleProductiveHoursChange}
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max Unproductive Hours</label>
              <input
                type="number"
                min="0"
                max="24"
                value={goals.maxUnproductiveHours}
                onChange={handleUnproductiveHoursChange}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center space-x-2 ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 