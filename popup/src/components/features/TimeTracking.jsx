import React, { useState } from 'react';
import { ClockIcon, ChartBarIcon, TrendingUpIcon } from '@heroicons/react/outline';

const TimeTracking = () => {
  const [timeData] = useState({
    today: {
      productive: 4.5,
      unproductive: 2.1,
      neutral: 1.4
    },
    topSites: [
      { name: 'github.com', time: 120, category: 'productive' },
      { name: 'stackoverflow.com', time: 45, category: 'productive' },
      { name: 'facebook.com', time: 30, category: 'unproductive' },
      { name: 'gmail.com', time: 25, category: 'neutral' }
    ],
    weeklyTrend: [
      { day: 'Mon', productive: 5.2 },
      { day: 'Tue', productive: 4.8 },
      { day: 'Wed', productive: 6.1 },
      { day: 'Thu', productive: 4.5 },
      { day: 'Fri', productive: 5.5 }
    ]
  });

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatMinutes = (minutes) => {
    if (minutes >= 60) {
      return formatTime(minutes / 60);
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Time Tracking</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-green-600 font-medium">Productive</div>
            <div className="text-2xl font-bold text-green-700">
              {formatTime(timeData.today.productive)}
            </div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-red-600 font-medium">Unproductive</div>
            <div className="text-2xl font-bold text-red-700">
              {formatTime(timeData.today.unproductive)}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-gray-600 font-medium">Neutral</div>
            <div className="text-2xl font-bold text-gray-700">
              {formatTime(timeData.today.neutral)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Top Sites Today</h3>
          <div className="space-y-2">
            {timeData.topSites.map((site, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium">{site.name}</span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    site.category === 'productive' ? 'bg-green-100 text-green-700' :
                    site.category === 'unproductive' ? 'bg-red-100 text-red-700' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {site.category}
                  </span>
                  <span className="text-gray-600">{formatMinutes(site.time)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracking; 