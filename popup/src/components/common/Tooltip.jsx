import React, { useState } from 'react';

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute ${positions[position]} left-1/2 transform -translate-x-1/2 
            px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip; 