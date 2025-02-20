import React, { useState } from 'react';
import { BellIcon, XIcon } from '@heroicons/react/outline';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Daily Goal Achieved',
      message: 'You completed 6 hours of productive work today!',
      time: '2 hours ago',
      type: 'success'
    },
    {
      id: 2,
      title: 'Focus Timer Complete',
      message: 'Great job! You completed a 25-minute focus session.',
      time: '3 hours ago',
      type: 'info'
    },
    {
      id: 3,
      title: 'Productivity Alert',
      message: 'You spent more than 1 hour on social media sites.',
      time: '5 hours ago',
      type: 'warning'
    }
  ]);

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BellIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No new notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`relative p-4 border rounded-lg ${getTypeStyles(notification.type)}`}
              >
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="w-4 h-4" />
                </button>
                
                <h3 className="font-medium mb-1">{notification.title}</h3>
                <p className="text-sm opacity-90 mb-2">{notification.message}</p>
                <span className="text-xs opacity-75">{notification.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 