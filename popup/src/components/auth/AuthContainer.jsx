import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        {isLogin ? (
          <Login onToggleForm={() => setIsLogin(false)} />
        ) : (
          <Register onToggleForm={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthContainer; 