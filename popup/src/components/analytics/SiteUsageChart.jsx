import React, { useState } from 'react';
import { ChartBarIcon, ClockIcon, CalendarIcon } from '@heroicons/react/outline';

const SiteUsageChart = ({ data, period = 'daily' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [hoveredBar, setHoveredBar] = useState(null);

  const periods = [
    { id: 'daily', label: 'Daily', icon: ClockIcon },
    { id: 'weekly', label: 'Weekly', icon: ChartBarIcon },
    { id: 'monthly', label: 'Monthly', icon: CalendarIcon },
  ];

  const getChartData = () => {
    switch (selectedPeriod) {
      case 'daily':
        return Array.from({ length: 24 }, (_, i) => ({
          label: `${i}:00`,
          value: data.hourlyUsage?.[i] || 0
        }));
      case 'weekly':
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({
          label: day,
          value: data.weeklyUsage?.[day.toLowerCase()] || 0
        }));
      case 'monthly':
        return Array.from({ length: 30 }, (_, i) => ({
          label: `Day ${i + 1}`,
          value: data.monthlyUsage?.[i] || 0
        }));
      default:
        return [];
    }
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Usage Analysis</h3>
        <div className="flex space-x-2">
          {periods.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedPeriod(id)}
              className={`px-3 py-1 rounded-full flex items-center space-x-1 text-sm ${
                selectedPeriod === id
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-40">
        <div className="absolute inset-0 flex items-end">
          {chartData.map((item, index) => {
            const height = (item.value / maxValue) * 100;
            return (
              <div
                key={index}
                className="flex-1 mx-px relative group"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div
                  className="absolute bottom-0 w-full bg-blue-500 transition-all duration-200"
                  style={{
                    height: `${height}%`,
                    opacity: hoveredBar === index ? '1' : '0.7'
                  }}
                />
                {hoveredBar === index && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      {item.label}: {Math.round(item.value)}%
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-500 overflow-x-auto">
        {chartData.map((item, index) => (
          <span
            key={index}
            className="transform -rotate-45 origin-top-left whitespace-nowrap"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SiteUsageChart; 