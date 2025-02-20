import React from 'react';

const SiteCategories = ({ categories }) => {
  const totalTime = categories.reduce((sum, cat) => sum + cat.timeSpent, 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-medium mb-4">Site Categories</h3>
      <div className="space-y-4">
        {categories.map((category) => {
          const percentage = (category.timeSpent / totalTime) * 100;
          const hours = Math.floor(category.timeSpent / 3600000);
          const minutes = Math.floor((category.timeSpent % 3600000) / 60000);

          return (
            <div key={category.name}>
              <div className="flex justify-between text-sm mb-1">
                <span>{category.name}</span>
                <span>{hours}h {minutes}m</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: category.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SiteCategories; 