import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/outline';

const TopSitesList = () => {
  const [topSites, setTopSites] = useState([
    { 
      url: 'github.com',
      time: 120,
      category: 'productive'
    },
    {
      url: 'stackoverflow.com',
      time: 45,
      category: 'productive'
    },
    {
      url: 'gmail.com',
      time: 30,
      category: 'neutral'
    }
  ]);

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!topSites) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Top Sites</h3>
      <div className="space-y-3">
        {topSites.map((site, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span className="font-medium">{site.url}</span>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-sm ${
                site.category === 'productive' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {site.category}
              </span>
              <div className="flex items-center text-gray-500">
                <ClockIcon className="w-4 h-4 mr-1" />
                {formatTime(site.time)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSitesList; 