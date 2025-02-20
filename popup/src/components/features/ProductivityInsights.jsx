import React, { useState, useEffect } from 'react';
import { 
  LightningBoltIcon, 
  TrendingUpIcon, 
  ClockIcon,
  AcademicCapIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/outline';

const ProductivityInsights = () => {
  const [insights, setInsights] = useState({
    productivityScore: 78,
    weeklyTrend: [
      { day: 'Mon', score: 82 },
      { day: 'Tue', score: 75 },
      { day: 'Wed', score: 88 },
      { day: 'Thu', score: 71 },
      { day: 'Fri', score: 78 }
    ],
    peakHours: [
      { hour: '9-10', productivity: 92 },
      { hour: '10-11', productivity: 88 },
      { hour: '14-15', productivity: 85 }
    ],
    recommendations: [
      {
        type: 'schedule',
        title: 'Optimal Work Hours',
        description: 'Your peak productivity is between 9 AM and 11 AM. Schedule important tasks during this time.',
        impact: 'high'
      },
      {
        type: 'break',
        title: 'Break Pattern',
        description: 'Taking shorter, more frequent breaks could improve your focus duration.',
        impact: 'medium'
      },
      {
        type: 'environment',
        title: 'Work Environment',
        description: 'You\'re most productive when using noise-canceling headphones.',
        impact: 'medium'
      }
    ],
    habitPatterns: [
      { name: 'Deep Work', duration: 120, frequency: 'daily', impact: 'positive' },
      { name: 'Social Media', duration: 45, frequency: 'hourly', impact: 'negative' },
      { name: 'Email Checking', duration: 15, frequency: '30min', impact: 'neutral' }
    ]
  });

  // Mini line chart component
  const MiniChart = ({ data, height = 40 }) => {
    const max = Math.max(...data.map(d => d.score));
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = ((max - d.score) / max) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-full h-10" viewBox={`0 0 100 ${height}`}>
        <polyline
          points={points}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Productivity Insights</h2>

        {/* Overall Score */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Overall Score</h3>
            <div className="text-3xl font-bold text-blue-600">{insights.productivityScore}%</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <MiniChart data={insights.weeklyTrend} />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              {insights.weeklyTrend.map(day => (
                <span key={day.day}>{day.day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Peak Performance Hours */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Peak Performance Hours</h3>
          <div className="grid grid-cols-3 gap-4">
            {insights.peakHours.map(hour => (
              <div key={hour.hour} className="bg-green-50 rounded-lg p-4">
                <div className="text-green-600 font-medium">{hour.hour}</div>
                <div className="text-2xl font-bold text-green-700">{hour.productivity}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">AI Recommendations</h3>
          <div className="space-y-4">
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <SparklesIcon className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-700">{rec.title}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    rec.impact === 'high' ? 'bg-purple-200 text-purple-800' :
                    rec.impact === 'medium' ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {rec.impact} impact
                  </span>
                </div>
                <p className="text-sm text-purple-600">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Habit Patterns */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Habit Patterns</h3>
          <div className="space-y-3">
            {insights.habitPatterns.map((habit, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    habit.impact === 'positive' ? 'bg-green-100' :
                    habit.impact === 'negative' ? 'bg-red-100' :
                    'bg-gray-100'
                  }`}>
                    <ClockIcon className={`w-5 h-5 ${
                      habit.impact === 'positive' ? 'text-green-600' :
                      habit.impact === 'negative' ? 'text-red-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">{habit.name}</div>
                    <div className="text-sm text-gray-500">
                      {habit.duration}min every {habit.frequency}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  habit.impact === 'positive' ? 'bg-green-100 text-green-700' :
                  habit.impact === 'negative' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {habit.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityInsights; 