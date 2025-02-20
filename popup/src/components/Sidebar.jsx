import React, { useState } from 'react';
import {
  HomeIcon,
  ChartBarIcon,
  CogIcon,
  ClockIcon,
  BellIcon,
  FlagIcon,
  AdjustmentsIcon,
  LightningBoltIcon
} from '@heroicons/react/outline';

const Sidebar = ({ activeTab, onTabChange, isOpen }) => {
  const [showLabels, setShowLabels] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'reports', label: 'Reports', icon: ChartBarIcon },
    { id: 'goals', label: 'Goals', icon: FlagIcon },
    { id: 'timer', label: 'Focus Timer', icon: ClockIcon },
    { id: 'focus-mode', label: 'Focus Mode', icon: LightningBoltIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon },
    { id: 'pomodoro-settings', label: 'Pomodoro Settings', icon: AdjustmentsIcon }
  ];

  const handleSidebarClick = () => {
    setShowLabels(!showLabels);
  };

  return (
    <aside 
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? (showLabels ? 'w-54' : 'w-14') : 'w-0'
      }`}
      onClick={handleSidebarClick}
    >
      <nav className="popup-sidebar">
        <ul className="space-y-1 p-2">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabChange(id);
                }}
                className={`w-full flex items-center ${
                  showLabels ? 'justify-start px-3' : 'justify-center px-2'
                } py-2 rounded-lg transition-colors ${
                  activeTab === id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={!showLabels ? label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && showLabels && (
                  <span className="ml-3 font-medium text-sm truncate">{label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 