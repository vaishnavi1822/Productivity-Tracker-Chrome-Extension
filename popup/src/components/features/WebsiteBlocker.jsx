import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, ClockIcon } from '@heroicons/react/outline';

const WebsiteBlocker = () => {
  const [blockedSites, setBlockedSites] = useState([
    { id: 1, url: 'facebook.com', schedule: '9:00-17:00', active: true },
    { id: 2, url: 'twitter.com', schedule: 'Always', active: true },
    { id: 3, url: 'youtube.com', schedule: '9:00-17:00', active: false }
  ]);
  const [newSite, setNewSite] = useState('');
  const [schedule, setSchedule] = useState('Always');

  const scheduleOptions = [
    'Always',
    '9:00-17:00',
    '9:00-12:00',
    '13:00-17:00',
    'Custom'
  ];

  const addSite = (e) => {
    e.preventDefault();
    if (newSite.trim()) {
      setBlockedSites([
        ...blockedSites,
        {
          id: Date.now(),
          url: newSite.toLowerCase(),
          schedule,
          active: true
        }
      ]);
      setNewSite('');
      setSchedule('Always');
    }
  };

  const toggleSite = (id) => {
    setBlockedSites(blockedSites.map(site =>
      site.id === id ? { ...site, active: !site.active } : site
    ));
  };

  const deleteSite = (id) => {
    setBlockedSites(blockedSites.filter(site => site.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Website Blocker</h2>
        
        <form onSubmit={addSite} className="space-y-4 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              placeholder="Enter website URL..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {scheduleOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {blockedSites.map(site => (
            <div
              key={site.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                site.active ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <span className="font-medium">{site.url}</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {site.schedule}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleSite(site.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    site.active 
                      ? 'bg-red-200 text-red-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {site.active ? 'Blocking' : 'Paused'}
                </button>
                <button
                  onClick={() => deleteSite(site.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebsiteBlocker; 