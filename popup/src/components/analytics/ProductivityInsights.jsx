import React from 'react';
import { 
  TrendingUpIcon, 
  TrendingDownIcon,
  ClockIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/outline';

const ProductivityInsights = ({ data }) => {
  const insights = [
    {
      title: 'Most Productive Hour',
      value: data?.mostProductiveHour 
        ? `${data.mostProductiveHour}:00` 
        : 'N/A',
      icon: TrendingUpIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Least Productive Hour',
      value: data?.leastProductiveHour 
        ? `${data.leastProductiveHour}:00` 
        : 'N/A',
      icon: TrendingDownIcon,
      color: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Peak Focus Time',
      value: data?.peakFocusTime 
        ? `${Math.round(data.peakFocusTime)}min` 
        : 'N/A',
      icon: ClockIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Distraction Count',
      value: data?.distractionCount || 0,
      icon: ExclamationCircleIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {insights.map((insight, index) => {
        const Icon = insight.icon;
        return (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{insight.title}</p>
                <p className="text-xl font-semibold mt-1">{insight.value}</p>
              </div>
              <div className={`p-2 rounded-full ${insight.bgColor}`}>
                <Icon className={`w-5 h-5 ${insight.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductivityInsights; 