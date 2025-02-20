import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/outline';

const RealTimeTracker = () => {
  const [currentSite, setCurrentSite] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let intervalId;
    
    const updateTimes = () => {
      if (startTime) {
        const now = Date.now();
        setSessionTime(now - startTime);
      }
    };

    // Update every second
    intervalId = setInterval(updateTimes, 1000);

    // Listen for tab changes
    const handleTabChange = async (activeInfo) => {
      try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (tab.url) {
          const domain = new URL(tab.url).hostname;
          setCurrentSite(domain);
          setStartTime(Date.now());
          
          // Get total time from storage
          const result = await chrome.storage.local.get('timeData');
          if (result.timeData?.[domain]) {
            setTotalTime(result.timeData[domain].totalTime || 0);
          } else {
            setTotalTime(0);
          }
        }
      } catch (error) {
        console.error('Error handling tab change:', error);
      }
    };

    // Listen for storage changes
    const handleStorageChange = (changes) => {
      if (changes.timeData && currentSite) {
        const newTimeData = changes.timeData.newValue;
        if (newTimeData[currentSite]) {
          setTotalTime(newTimeData[currentSite].totalTime || 0);
        }
      }
    };

    if (chrome?.tabs) {
      chrome.tabs.onActivated.addListener(handleTabChange);
      chrome.storage.onChanged.addListener(handleStorageChange);
      
      // Get initial tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          const domain = new URL(tabs[0].url).hostname;
          setCurrentSite(domain);
          setStartTime(Date.now());
        }
      });
    }

    return () => {
      clearInterval(intervalId);
      if (chrome?.tabs) {
        chrome.tabs.onActivated.removeListener(handleTabChange);
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    };
  }, [currentSite]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  if (!currentSite) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <ClockIcon className="w-5 h-5 text-blue-500" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Current Site</h3>
            <p className="text-sm text-gray-500">{currentSite}</p>
          </div>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none">
            <p className="text-sm text-gray-500">Session Time</p>
            <p className="text-sm font-medium text-gray-900">
              {formatTime(sessionTime)}
            </p>
          </div>
          <div className="flex-1 sm:flex-none">
            <p className="text-sm text-gray-500">Total Time</p>
            <p className="text-sm font-medium text-gray-900">
              {formatTime(totalTime)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeTracker; 