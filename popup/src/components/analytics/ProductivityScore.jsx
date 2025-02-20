import React, { useEffect, useState } from 'react';

const ProductivityScore = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const percentage = Math.round(score * 100);

  useEffect(() => {
    const duration = 1000; // 1 second animation
    const steps = 60;
    const increment = percentage / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      current += increment;
      step += 1;
      
      if (step >= steps) {
        current = percentage;
        clearInterval(timer);
      }
      
      setAnimatedScore(Math.round(current));
    }, duration / steps);

    return () => clearInterval(timer);
  }, [percentage]);

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-blue-500';
    if (percentage >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#eee"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={getScoreColor()}
          strokeDasharray={`${percentage}, 100`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className={`text-2xl font-bold ${getScoreColor()}`}>
          {animatedScore}%
        </span>
        <span className="text-sm text-gray-500">Productivity</span>
      </div>
    </div>
  );
};

export default ProductivityScore; 