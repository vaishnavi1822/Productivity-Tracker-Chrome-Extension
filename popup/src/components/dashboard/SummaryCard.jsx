import React from 'react';

const SummaryCard = ({ title, value, subtitle, icon: Icon }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="text-blue-500">
            <Icon className="w-8 h-8" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard; 