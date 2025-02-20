import React from 'react';

const TimeRangeSelector = ({ timeRange, onChange }) => {
  const presetRanges = [
    { label: 'Today', days: 0 },
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 }
  ];

  const handlePresetClick = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    onChange({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            value={timeRange.startDate}
            onChange={(e) => onChange({ ...timeRange, startDate: e.target.value })}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            value={timeRange.endDate}
            onChange={(e) => onChange({ ...timeRange, endDate: e.target.value })}
            className="border rounded p-2"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        {presetRanges.map(({ label, days }) => (
          <button
            key={label}
            onClick={() => handlePresetClick(days)}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeRangeSelector; 