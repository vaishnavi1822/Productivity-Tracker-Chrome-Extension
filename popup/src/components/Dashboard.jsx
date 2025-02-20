import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import SummaryCard from './dashboard/SummaryCard';
import ProductivityChart from './dashboard/ProductivityChart';
import TopSitesList from './dashboard/TopSitesList';
import GoalsProgress from './dashboard/GoalsProgress';
import RealTimeTracker from './dashboard/RealTimeTracker';
import RealTimeMetrics from './dashboard/RealTimeMetrics';
import { ClockIcon, TrendingUpIcon, ExclamationIcon } from '@heroicons/react/outline';

const Dashboard = ({ isPopup }) => {
  const socket = useSocket();
  const { user } = useAuth();
  const [realTimeData, setRealTimeData] = useState({
    currentActivity: null,
    focusScore: 0,
    activeTime: 0,
    distractions: [],
    productiveTime: 0,
    unproductiveTime: 0
  });

  const [productivityStreak, setProductivityStreak] = useState({
    current: 0,
    best: 0,
    lastUpdate: new Date()
  });

  // Listen for real-time updates
  useEffect(() => {
    if (socket) {
      socket.on('activity-update', (data) => {
        setRealTimeData(prev => ({
          ...prev,
          currentActivity: data.activity,
          focusScore: data.focusScore,
          activeTime: data.activeTime
        }));

        // Update streak if activity is productive
        if (data.activity.type === 'productive') {
          updateProductivityStreak();
        }
      });

      socket.on('distraction-detected', (distraction) => {
        setRealTimeData(prev => ({
          ...prev,
          distractions: [...prev.distractions, distraction]
        }));
      });

      socket.on('productivity-stats', (stats) => {
        setRealTimeData(prev => ({
          ...prev,
          productiveTime: stats.productiveTime,
          unproductiveTime: stats.unproductiveTime
        }));
      });

      // Request initial data
      socket.emit('get-current-stats', user.userId);
    }
  }, [socket, user]);

  const updateProductivityStreak = () => {
    setProductivityStreak(prev => {
      const now = new Date();
      const hoursSinceLastUpdate = (now - new Date(prev.lastUpdate)) / (1000 * 60 * 60);
      
      if (hoursSinceLastUpdate <= 24) {
        const newStreak = prev.current + 1;
        return {
          current: newStreak,
          best: Math.max(newStreak, prev.best),
          lastUpdate: now
        };
      }
      
      return {
        ...prev,
        current: 1,
        lastUpdate: now
      };
    });
  };

  // Real-time activity indicator component
  const ActivityIndicator = () => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Current Activity</h3>
        <span className={`px-2 py-1 rounded-full text-sm ${
          realTimeData.currentActivity?.type === 'productive' 
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {realTimeData.currentActivity?.type || 'No activity'}
        </span>
      </div>
      {realTimeData.currentActivity && (
        <div className="mt-2">
          <p className="text-gray-600">{realTimeData.currentActivity.title}</p>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <ClockIcon className="w-4 h-4 mr-1" />
            {Math.floor(realTimeData.activeTime / 60)}m {realTimeData.activeTime % 60}s
          </div>
        </div>
      )}
    </div>
  );

  // Productivity streak component
  const StreakIndicator = () => (
    <div className="bg-purple-50 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2">
        <TrendingUpIcon className="w-5 h-5 text-purple-600" />
        <div>
          <h3 className="font-medium text-purple-700">Productivity Streak</h3>
          <p className="text-sm text-purple-600">
            Current: {productivityStreak.current} days | Best: {productivityStreak.best} days
          </p>
        </div>
      </div>
    </div>
  );

  // Recent distractions component
  const DistractionAlert = () => (
    realTimeData.distractions.length > 0 && (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2">
          <ExclamationIcon className="w-5 h-5 text-yellow-600" />
          <div>
            <h3 className="font-medium text-yellow-700">Recent Distractions</h3>
            <p className="text-sm text-yellow-600">
              {realTimeData.distractions.length} potential distractions detected
            </p>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className={`${isPopup ? 'space-y-4' : 'dashboard-grid'}`}>
      <div className={isPopup ? 'space-y-4' : 'chart-container'}>
        <RealTimeMetrics />
        <ActivityIndicator />
        <StreakIndicator />
        <DistractionAlert />
        <RealTimeTracker 
          focusScore={realTimeData.focusScore}
          productiveTime={realTimeData.productiveTime}
          unproductiveTime={realTimeData.unproductiveTime}
        />
        <ProductivityChart />
      </div>

      <div className={isPopup ? 'space-y-4' : 'sidebar-container'}>
        <div className="grid grid-cols-1 gap-3">
          <SummaryCard 
            title="Total Productive Time"
            value={`${Math.floor(realTimeData.productiveTime / 60)}h ${realTimeData.productiveTime % 60}m`}
            trend="+15%"
            type="positive"
          />
          <SummaryCard 
            title="Focus Score"
            value={`${realTimeData.focusScore}%`}
            trend="+5%"
            type="neutral"
          />
          <TopSitesList />
          <GoalsProgress />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 