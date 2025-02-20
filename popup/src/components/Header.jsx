import React from 'react';
import { MenuIcon, BellIcon, UserCircleIcon } from '@heroicons/react/outline';
import { useAuth } from '../hooks/useAuth';

const Header = ({ sidebarOpen, onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
      >
        <MenuIcon className="w-5 h-5" />
      </button>
      
      <div className="flex-1 flex justify-end items-center space-x-4">
        <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
          <BellIcon className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
          <UserCircleIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header; 