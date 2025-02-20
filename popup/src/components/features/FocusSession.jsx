import React, { useState, useEffect } from 'react';
import { 
  PlayIcon, PauseIcon, RefreshIcon, 
  VolumeUpIcon, VolumeOffIcon,
  CogIcon, ChartBarIcon 
} from '@heroicons/react/outline';
import { useWebSocket } from '../../context/WebSocketContext';

const FocusSession = () => {
  const ws = useWebSocket();
  // Load initial state from localStorage
  const loadFromStorage = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [settings, setSettings] = useState(loadFromStorage('focusSettings', {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    soundEnabled: true,
    autoStartBreaks: false
  }));
  
  const [time, setTime] = useState(settings.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(loadFromStorage('sessionCount', 0));
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState(loadFromStorage('focusStats', {
    totalFocusTime: 0,
    sessionsCompleted: 0,
    dailyStreak: 0,
    lastActiveDate: new Date().toDateString()
  }));

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('focusSettings', JSON.stringify(settings));
  }, [settings]);

  // Save stats whenever they change
  useEffect(() => {
    localStorage.setItem('focusStats', JSON.stringify(stats));
  }, [stats]);

  // Save session count whenever it changes
  useEffect(() => {
    localStorage.setItem('sessionCount', JSON.stringify(sessionCount));
  }, [sessionCount]);

  // Check and update daily streak
  useEffect(() => {
    const today = new Date().toDateString();
    if (stats.lastActiveDate !== today) {
      setStats(prev => ({
        ...prev,
        lastActiveDate: today,
        dailyStreak: isConsecutiveDay(new Date(prev.lastActiveDate)) ? prev.dailyStreak + 1 : 1
      }));
    }
  }, []);

  useEffect(() => {
    ws.subscribe('FOCUS_SESSION_UPDATE', handleSessionUpdate);
    return () => ws.unsubscribe('FOCUS_SESSION_UPDATE', handleSessionUpdate);
  }, []);

  const handleSessionUpdate = (sessionData) => {
    setStats(sessionData.stats);
    setSessionCount(sessionData.sessionCount);
    localStorage.setItem('focusStats', JSON.stringify(sessionData.stats));
    localStorage.setItem('sessionCount', JSON.stringify(sessionData.sessionCount));
  };

  const isConsecutiveDay = (lastDate) => {
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  };

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => {
          const newTime = time - 1;
          if (newTime === 0) {
            handleSessionComplete();
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const handleSessionComplete = () => {
    if (settings.soundEnabled) {
      playNotificationSound();
    }

    if (!isBreak) {
      setStats(prev => ({
        ...prev,
        totalFocusTime: prev.totalFocusTime + settings.workDuration,
        sessionsCompleted: prev.sessionsCompleted + 1
      }));
    }

    const newSessionCount = isBreak ? sessionCount : sessionCount + 1;
    setSessionCount(newSessionCount);

    const shouldTakeLongBreak = newSessionCount % settings.sessionsBeforeLongBreak === 0;
    const nextBreakDuration = shouldTakeLongBreak ? settings.longBreakDuration : settings.breakDuration;

    setIsBreak(!isBreak);
    setTime(isBreak ? settings.workDuration * 60 : nextBreakDuration * 60);
    
    if (settings.autoStartBreaks) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }

    const sessionData = {
      stats: stats,
      sessionCount: newSessionCount
    };

    ws.send('FOCUS_SESSION_UPDATE', sessionData);
  };

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="section-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Focus Session</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {settings.soundEnabled ? (
              <VolumeUpIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <VolumeOffIcon className="w-6 h-6 text-gray-600" />
            )}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <CogIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-7xl font-bold mb-8 text-blue-600 font-mono">
          {formatTime(time)}
        </div>

        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setIsActive(!isActive)}
            className="p-4 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
          >
            {isActive ? (
              <PauseIcon className="w-8 h-8" />
            ) : (
              <PlayIcon className="w-8 h-8" />
            )}
          </button>
          <button
            onClick={() => {
              setTime(settings.workDuration * 60);
              setIsActive(false);
              setIsBreak(false);
            }}
            className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <RefreshIcon className="w-8 h-8" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-600">Sessions</div>
            <div className="text-xl font-semibold text-blue-600">{sessionCount}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-600">Focus Time</div>
            <div className="text-xl font-semibold text-green-600">
              {Math.round(stats.totalFocusTime / 60)}h
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-600">Streak</div>
            <div className="text-xl font-semibold text-purple-600">{stats.dailyStreak}</div>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="mt-8 border-t pt-6">
          <h3 className="font-medium mb-4">Timer Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Work Duration (min)</label>
              <input
                type="number"
                value={settings.workDuration}
                onChange={(e) => setSettings(prev => ({ ...prev, workDuration: parseInt(e.target.value) }))}
                className="border rounded p-2 w-full"
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Break Duration (min)</label>
              <input
                type="number"
                value={settings.breakDuration}
                onChange={(e) => setSettings(prev => ({ ...prev, breakDuration: parseInt(e.target.value) }))}
                className="border rounded p-2 w-full"
                min="1"
                max="30"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Long Break Duration (min)</label>
              <input
                type="number"
                value={settings.longBreakDuration}
                onChange={(e) => setSettings(prev => ({ ...prev, longBreakDuration: parseInt(e.target.value) }))}
                className="border rounded p-2 w-full"
                min="5"
                max="45"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Sessions Before Long Break</label>
              <input
                type="number"
                value={settings.sessionsBeforeLongBreak}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionsBeforeLongBreak: parseInt(e.target.value) }))}
                className="border rounded p-2 w-full"
                min="1"
                max="8"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) => setSettings(prev => ({ ...prev, autoStartBreaks: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Auto-start breaks</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusSession; 