import React from 'react';

const GoalsProgress = ({ goals = {} }) => {
  const calculateProgress = (achieved, total) => {
    if (!achieved || !total) return 0;
    return Math.round((achieved / total) * 100);
  };

  const defaultGoals = {
    productiveHoursGoal: {
      achieved: 0,
      targetHours: 0,
      total: 0
    },
    unproductiveHoursGoal: {
      achieved: 0,
      targetHours: 0,
      total: 0
    }
  };

  const safeGoals = {
    productiveHoursGoal: {
      ...defaultGoals.productiveHoursGoal,
      ...goals.productiveHoursGoal
    },
    unproductiveHoursGoal: {
      ...defaultGoals.unproductiveHoursGoal,
      ...goals.unproductiveHoursGoal
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-medium mb-4">Goals Progress</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Productive Hours</span>
            <span className="text-sm font-medium">
              {safeGoals.productiveHoursGoal.achieved}/{safeGoals.productiveHoursGoal.targetHours}h
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 rounded-full h-2"
              style={{
                width: `${calculateProgress(
                  safeGoals.productiveHoursGoal.achieved,
                  safeGoals.productiveHoursGoal.targetHours
                )}%`
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Unproductive Hours Limit</span>
            <span className="text-sm font-medium">
              {safeGoals.unproductiveHoursGoal.achieved}/{safeGoals.unproductiveHoursGoal.targetHours}h
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 rounded-full h-2"
              style={{
                width: `${calculateProgress(
                  safeGoals.unproductiveHoursGoal.achieved,
                  safeGoals.unproductiveHoursGoal.targetHours
                )}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsProgress; 