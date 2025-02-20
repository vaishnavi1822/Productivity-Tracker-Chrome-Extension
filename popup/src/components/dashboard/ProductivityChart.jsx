import React from 'react';

const ProductivityChart = () => {
  // Mock data for the chart
  const mockData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    totalTime: Math.floor(Math.random() * 60), // Random minutes for each hour
    type: Math.random() > 0.5 ? 'productive' : 'unproductive'
  }));

  const hours = [0, 6, 12, 18, 23]; // Hour markers for x-axis
  const maxValue = Math.max(...mockData.map(d => d.totalTime));

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-medium mb-4">Daily Activity</h3>
      
      <div className="relative h-40">
        {/* Bars */}
        <div className="absolute inset-0 flex items-end">
          {mockData.map((data, index) => (
            <div
              key={index}
              className="flex-1 mx-px"
              style={{ height: `${(data.totalTime / maxValue) * 100}%` }}
            >
              <div
                className={`w-full h-full rounded-t ${
                  data.type === 'productive' 
                    ? 'bg-green-200' 
                    : 'bg-red-200'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 25, 50, 75, 100].map((value) => (
            <div
              key={value}
              className="w-full h-px bg-gray-100"
              style={{ bottom: `${value}%` }}
            />
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        {hours.map(hour => (
          <span key={hour}>
            {hour === 0 ? '12 AM' : 
             hour === 12 ? '12 PM' : 
             hour < 12 ? `${hour}AM` : 
             `${hour-12}PM`}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-200 mr-2" />
          <span className="text-gray-600">Productive</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-200 mr-2" />
          <span className="text-gray-600">Unproductive</span>
        </div>
      </div>
    </div>
  );
};

export default ProductivityChart; 