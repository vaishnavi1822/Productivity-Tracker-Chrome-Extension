import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { 
  LightningBoltIcon, 
  ClockIcon, 
  BanIcon,
  ChartBarIcon,
  EyeIcon,
  BellIcon 
} from '@heroicons/react/outline';

const RealTimeMetrics = () => {
  const socket = useSocket();
  const [metrics, setMetrics] = useState({
    activeSession: {
      startTime: new Date(),
      duration: 0,
      focusScore: 85,
      interruptions: 0
    },
    focusState: {
      isActive: true,
      currentTask: 'Coding',
      timeOnTask: 0
    },
    alerts: [],
    recentActivity: []
  });

  useEffect(() => {
    if (socket) {
      // Listen for focus state updates
      socket.on('focus-update', (data) => {
        setMetrics(prev => ({
          ...prev,
          focusState: {
            ...prev.focusState,
            ...data
          }
        }));
      });

      // Listen for interruption events
      socket.on('interruption-detected', (data) => {
        setMetrics(prev => ({
          ...prev,
          activeSession: {
            ...prev.activeSession,
            interruptions: prev.activeSession.interruptions + 1
          },
          alerts: [data, ...prev.alerts].slice(0, 5)
        }));
      });

      // Listen for activity updates
      socket.on('activity-recorded', (activity) => {
        setMetrics(prev => ({
          ...prev,
          recentActivity: [activity, ...prev.recentActivity].slice(0, 5)
        }));
      });

      // Update session duration
      const timer = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          activeSession: {
            ...prev.activeSession,
            duration: Math.floor((new Date() - new Date(prev.activeSession.startTime)) / 1000)
          },
          focusState: {
            ...prev.focusState,
            timeOnTask: prev.focusState.timeOnTask + 1
          }
        }));
      }, 1000);

      return () => {
        clearInterval(timer);
        socket.off('focus-update');
        socket.off('interruption-detected');
        socket.off('activity-recorded');
      };
    }
  }, [socket]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${secs}s`;
  };

  return (
    <div className="space-y-4">
      {/* Active Session Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-700">Active Session</h3>
          <div className={`px-2 py-1 rounded-full text-sm ${
            metrics.focusState.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {metrics.focusState.isActive ? 'Focused' : 'Distracted'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-gray-600 mb-1">
              <ClockIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">Duration</span>
            </div>
            <div className="text-lg font-semibold">
              {formatDuration(metrics.activeSession.duration)}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-gray-600 mb-1">
              <LightningBoltIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">Focus Score</span>
            </div>
            <div className="text-lg font-semibold">
              {metrics.activeSession.focusScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Current Task */}
      {metrics.focusState.currentTask && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-700 mb-2">
            <EyeIcon className="w-5 h-5" />
            <h3 className="font-medium">Current Task</h3>
          </div>
          <div className="text-blue-600">
            <p className="font-medium">{metrics.focusState.currentTask}</p>
            <p className="text-sm mt-1">
              Time on task: {formatDuration(metrics.focusState.timeOnTask)}
            </p>
          </div>
        </div>
      )}

      {/* Recent Alerts */}
      {metrics.alerts.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-yellow-700 mb-3">
            <BellIcon className="w-5 h-5" />
            <h3 className="font-medium">Recent Alerts</h3>
          </div>
          <div className="space-y-2">
            {metrics.alerts.map((alert, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-yellow-600">
                <BanIcon className="w-4 h-4" />
                <span>{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-2 mb-4">
          <ChartBarIcon className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-700">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {metrics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{activity.title}</div>
                <div className="text-sm text-gray-500">{activity.type}</div>
              </div>
              <div className="text-sm text-gray-600">
                {formatDuration(activity.duration)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics; 