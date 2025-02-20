import React, { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, RefreshIcon } from '@heroicons/react/outline';

const FocusTimer = () => {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [breakMode, setBreakMode] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      setBreakMode(!breakMode);
      setTime(breakMode ? 25 * 60 : 5 * 60);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, time, breakMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setTime(25 * 60);
    setIsActive(false);
    setBreakMode(false);
  };

  return (
    <div className="section-container">
      <h2 className="text-xl font-semibold mb-4">Focus Timer</h2>
      <div className="flex flex-col items-center">
        <div className="text-6xl font-bold mb-8 text-blue-600">
          {formatTime(time)}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={toggleTimer}
            className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
          >
            {isActive ? (
              <PauseIcon className="w-8 h-8" />
            ) : (
              <PlayIcon className="w-8 h-8" />
            )}
          </button>
          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <RefreshIcon className="w-8 h-8" />
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {breakMode ? 'Break Time' : 'Focus Time'}
        </div>
      </div>
    </div>
  );
};

export default FocusTimer; 