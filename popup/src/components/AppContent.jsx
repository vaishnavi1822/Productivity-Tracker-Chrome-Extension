import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Reports from './Reports';
import Settings from './Settings';
import AuthContainer from './auth/AuthContainer';
import FocusTimer from './features/FocusTimer';
import Goals from './features/Goals';
import Notifications from './features/Notifications';
import WebsiteBlocker from './features/WebsiteBlocker';
import TimeTracking from './features/TimeTracking';
import PomodoroSettings from './features/PomodoroSettings';
import RealTimeStats from './features/RealTimeStats';
import ProductivityInsights from './features/ProductivityInsights';
import FocusModeDashboard from './features/FocusModeDashboard';
import { useFullScreen } from '../hooks/useFullScreen';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isFullScreen, toggleFullScreen } = useFullScreen();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const checkViewMode = () => {
      const isNewTab = window.innerWidth > 800;
      setSidebarOpen(isNewTab);
    };

    checkViewMode();
    window.addEventListener('resize', checkViewMode);
    return () => window.removeEventListener('resize', checkViewMode);
  }, []);

  if (loading) {
    return (
      <div className={`${isFullScreen ? 'fixed inset-0 z-50' : ''} flex items-center justify-center bg-gray-50`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  return (
    <div className={`${
      isFullScreen ? 'fullscreen-container' : 'flex flex-col bg-gray-50 min-h-screen'
    }`}>
      <Header 
        sidebarOpen={sidebarOpen} 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isFullScreen={isFullScreen}
        onToggleFullScreen={toggleFullScreen}
      />
      
      <div className={`flex flex-1 ${isFullScreen ? 'fullscreen-content' : 'overflow-hidden'}`}>
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          className={`transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-16'
          }`}
        />
        
        <main className={`main-content ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        }`}>
          <div className="content-container custom-scrollbar">
            <div className="container mx-auto">
              {activeTab === 'dashboard' && <Dashboard isFullScreen={isFullScreen} />}
              {activeTab === 'reports' && <Reports isFullScreen={isFullScreen} />}
              {activeTab === 'goals' && <Goals isFullScreen={isFullScreen} />}
              {activeTab === 'timer' && <FocusTimer isFullScreen={isFullScreen} />}
              {activeTab === 'focus-mode' && <FocusModeDashboard isFullScreen={isFullScreen} />}
              {activeTab === 'notifications' && <Notifications isFullScreen={isFullScreen} />}
              {activeTab === 'settings' && <Settings isFullScreen={isFullScreen} />}
              {activeTab === 'blocker' && <WebsiteBlocker isFullScreen={isFullScreen} />}
              {activeTab === 'tracking' && <TimeTracking isFullScreen={isFullScreen} />}
              {activeTab === 'pomodoro-settings' && <PomodoroSettings isFullScreen={isFullScreen} />}
              {activeTab === 'realtime' && <RealTimeStats isFullScreen={isFullScreen} />}
              {activeTab === 'insights' && <ProductivityInsights isFullScreen={isFullScreen} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppContent; 