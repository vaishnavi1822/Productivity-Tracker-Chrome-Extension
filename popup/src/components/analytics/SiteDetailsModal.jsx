import React from 'react';
import { XIcon } from '@heroicons/react/outline';

const SiteDetailsModal = ({ site, onClose }) => {
  if (!site) return null;

  const timeStats = {
    daily: Math.round(site.timeSpent / (24 * 60 * 60 * 1000) * 100) / 100,
    weekly: Math.round(site.timeSpent / (7 * 24 * 60 * 60 * 1000) * 100) / 100,
    monthly: Math.round(site.timeSpent / (30 * 24 * 60 * 60 * 1000) * 100) / 100
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{site.domain}</h3>
            <p className="text-sm text-gray-500">Site Statistics</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Time Spent</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-gray-600">Daily</p>
                <p className="text-lg font-semibold">{timeStats.daily}h</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-gray-600">Weekly</p>
                <p className="text-lg font-semibold">{timeStats.weekly}h</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-gray-600">Monthly</p>
                <p className="text-lg font-semibold">{timeStats.monthly}h</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Productivity Impact</h4>
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Productivity Score</span>
                <span className={`text-sm font-medium ${
                  site.productivityScore > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {site.productivityScore > 0 ? '+' : ''}{site.productivityScore}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    site.productivityScore > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.abs(site.productivityScore * 100)}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Usage Pattern</h4>
            <div className="grid grid-cols-24 gap-1">
              {site.hourlyUsage?.map((usage, hour) => (
                <div
                  key={hour}
                  className="h-4 rounded"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${usage / 100})`
                  }}
                  title={`${hour}:00 - ${usage}%`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>12 AM</span>
              <span>12 PM</span>
              <span>11 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDetailsModal; 