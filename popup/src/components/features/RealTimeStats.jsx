import React, { useState, useEffect } from 'react';
import { ClockIcon, ChartBarIcon, ExclamationIcon, CheckCircleIcon } from '@heroicons/react/outline';

const RealTimeStats = () => {
  const [currentSession, setCurrentSession] = useState({
    activeTab: {
      title: 'GitHub - Your Repository',
      url: 'github.com',
      category: 'productive',
      duration: 0,
      startTime: new Date()
    },
    focusScore: 85,
    activeApps: [
      { name: 'VS Code', duration: 45, category: 'productive' },
      { name: 'Chrome', duration: 30, category: 'neutral' },
      { name: 'Slack', duration: 15, category: 'communication' }
    ],
    distractions: 3,
    focusStreak: 45 // minutes
  });

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSession(prev => ({
        ...prev,
        activeTab: {
          ...prev.activeTab,
          duration: prev.activeTab.duration + 1
        },
        focusStreak: prev.focusStreak + 1/60
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (minutes) => {
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${Math.floor(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Real-Time Activity</h2>

        {/* Current Focus */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-700">Current Focus</h3>
            <span className={`px-2 py-1 rounded-full text-sm ${
              currentSession.activeTab.category === 'productive' 
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {currentSession.activeTab.category}
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-medium mb-1">{currentSession.activeTab.title}</div>
            <div className="text-sm text-gray-500">{currentSession.activeTab.url}</div>
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <ClockIcon className="w-4 h-4 mr-1" />
              {formatDuration(currentSession.activeTab.duration)}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-blue-600 font-medium">Focus Score</div>
            <div className="text-2xl font-bold text-blue-700">
              {currentSession.focusScore}%
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-purple-600 font-medium">Focus Streak</div>
            <div className="text-2xl font-bold text-purple-700">
              {formatDuration(currentSession.focusStreak)}
            </div>
          </div>
        </div>

        {/* Active Applications */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Active Applications</h3>
          <div className="space-y-2">
            {currentSession.activeApps.map((app, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{app.name}</span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    app.category === 'productive' ? 'bg-green-100 text-green-700' :
                    app.category === 'communication' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {app.category}
                  </span>
                  <span className="text-gray-600">{formatDuration(app.duration)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distraction Alerts */}
        {currentSession.distractions > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-yellow-700">
              <ExclamationIcon className="w-5 h-5" />
              <span className="font-medium">
                {currentSession.distractions} potential distractions detected
              </span>
            </div>
          </div>
        )}

        {/* Focus Tips */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="font-medium">Focus Tip</span>
          </div>
          <p className="mt-2 text-sm text-green-600">
            You're most productive between 9 AM and 11 AM. Consider scheduling important tasks during this time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RealTimeStats; 