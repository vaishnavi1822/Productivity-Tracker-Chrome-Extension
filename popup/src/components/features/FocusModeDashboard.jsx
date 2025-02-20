import React, { useState, useEffect } from 'react';
import { 
  LightningBoltIcon, 
  BellIcon, 
  ClockIcon,
  CheckCircleIcon 
} from '@heroicons/react/outline';
import FocusMode from '../../services/FocusMode';
import SmartNotifications from '../../services/SmartNotifications';

const FocusModeDashboard = () => {
  const [focusState, setFocusState] = useState({
    isActive: false,
    timeRemaining: 0,
    currentStreak: 0
  });

  const [settings, setSettings] = useState(FocusMode.settings);

  useEffect(() => {
    // Update timer
    const timer = setInterval(() => {
      if (focusState.isActive && focusState.timeRemaining > 0) {
        setFocusState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [focusState.isActive]);

  const handleStartFocus = async () => {
    await FocusMode.start();
    setFocusState({
      isActive: true,
      timeRemaining: settings.focusDuration * 60,
      currentStreak: focusState.currentStreak
    });
  };

  const handleEndFocus = async () => {
    await FocusMode.end();
    setFocusState(prev => ({
      isActive: false,
      timeRemaining: 0,
      currentStreak: prev.currentStreak + 1
    }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Focus Timer */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {formatTime(focusState.timeRemaining)}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {focusState.isActive ? 'Focus Session Active' : 'Ready to Focus?'}
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={focusState.isActive ? handleEndFocus : handleStartFocus}
            className={`w-full py-3 px-4 rounded-lg font-medium ${
              focusState.isActive
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {focusState.isActive ? 'End Session' : 'Start Focus Session'}
          </button>
        </div>
      </div>

      {/* Focus Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <LightningBoltIcon className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-gray-600">Focus Streak</span>
          </div>
          <p className="mt-2 text-2xl font-semibold">{focusState.currentStreak}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ClockIcon className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm font-medium text-gray-600">Total Focus Time</span>
          </div>
          <p className="mt-2 text-2xl font-semibold">2h 45m</p>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Focus Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BellIcon className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Block Notifications</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.blockAllNotifications}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  blockAllNotifications: e.target.checked
                }))}
              />
              <span className="slider round"></span>
            </label>
          </div>
          
          {/* More settings... */}
        </div>
      </div>
    </div>
  );
};

export default FocusModeDashboard; 