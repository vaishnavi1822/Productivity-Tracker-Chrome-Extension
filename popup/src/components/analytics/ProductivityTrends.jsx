import React from 'react';

const ProductivityTrends = ({ data }) => {
  const trendData = data || [];
  const maxValue = Math.max(...trendData.map(d => d.value));

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-medium mb-4">Productivity Trends</h3>
      <div className="relative h-40">
        <div className="absolute inset-0 flex items-end">
          {trendData.map((item, index) => {
            const height = (item.value / maxValue) * 100;
            return (
              <div
                key={index}
                className="flex-1 mx-px relative group"
                style={{ height: '100%' }}
              >
                <div
                  className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${height}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    {item.label}: {item.value}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {trendData.map((item, index) => (
          <span key={index} className="transform -rotate-45 origin-top-left">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProductivityTrends; 