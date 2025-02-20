import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { ClockIcon, ChartBarIcon } from '@heroicons/react/outline';

const DailyActivityGraph = ({ data }) => {
  const [viewType, setViewType] = useState('hourly'); // hourly or domain
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if (viewType === 'hourly') {
      const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
        hour: hour,
        productive: 0,
        unproductive: 0,
        neutral: 0,
        total: 0,
      }));

      data.forEach(activity => {
        const hour = new Date(activity.timestamp).getHours();
        const minutes = activity.duration / 60; // Convert seconds to minutes

        hourlyData[hour] = {
          ...hourlyData[hour],
          [activity.category]: hourlyData[hour][activity.category] + minutes,
          total: hourlyData[hour].total + minutes,
        };
      });

      setGraphData(hourlyData.map(item => ({
        ...item,
        time: `${item.hour.toString().padStart(2, '0')}:00`,
      })));
    } else {
      // Domain-wise aggregation
      const domainMap = new Map();
      
      data.forEach(activity => {
        const current = domainMap.get(activity.domain) || {
          domain: activity.domain,
          productive: 0,
          unproductive: 0,
          neutral: 0,
          total: 0,
        };

        const minutes = activity.duration / 60;
        domainMap.set(activity.domain, {
          ...current,
          [activity.category]: current[activity.category] + minutes,
          total: current.total + minutes,
        });
      });

      setGraphData(Array.from(domainMap.values())
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)); // Top 10 domains
    }
  }, [data, viewType]);

  const formatMinutes = (minutes) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-medium text-gray-800 mb-2">
          {viewType === 'hourly' ? label : payload[0].payload.domain}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">
              {entry.name}: {formatMinutes(entry.value)}
            </span>
          </div>
        ))}
        <div className="mt-1 pt-1 border-t">
          <span className="text-gray-600">
            Total: {formatMinutes(payload[0].payload.total)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Daily Activity</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewType('hourly')}
            className={`p-2 rounded-lg flex items-center space-x-1 ${
              viewType === 'hourly' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <ClockIcon className="w-5 h-5" />
            <span>Hourly</span>
          </button>
          <button
            onClick={() => setViewType('domain')}
            className={`p-2 rounded-lg flex items-center space-x-1 ${
              viewType === 'domain' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <ChartBarIcon className="w-5 h-5" />
            <span>By Website</span>
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={graphData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={viewType === 'hourly' ? 'time' : 'domain'} 
              angle={viewType === 'domain' ? -45 : 0}
              textAnchor={viewType === 'domain' ? 'end' : 'middle'}
              height={viewType === 'domain' ? 100 : 30}
            />
            <YAxis tickFormatter={formatMinutes} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="productive" 
              stackId="a" 
              fill="#22c55e" 
              name="Productive"
            />
            <Bar 
              dataKey="unproductive" 
              stackId="a" 
              fill="#ef4444" 
              name="Unproductive"
            />
            <Bar 
              dataKey="neutral" 
              stackId="a" 
              fill="#94a3b8" 
              name="Neutral"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-600">Productive</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-600">Unproductive</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-slate-400" />
          <span className="text-sm text-gray-600">Neutral</span>
        </div>
      </div>
    </div>
  );
};

export default DailyActivityGraph; 