import React, { createContext, useContext, useEffect, useState } from 'react';
import { wsService } from '../services/websocket';
import { useAuth } from '../hooks/useAuth';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let cleanup = () => {};

    const initializeWebSocket = () => {
      if (isAuthenticated && user) {
        wsService.setUserId(user.id);
        
        // Setup connection status handlers
        wsService.onConnect(() => setIsConnected(true));
        wsService.onDisconnect(() => setIsConnected(false));
        
        // Connect to WebSocket
        wsService.connect();

        cleanup = () => {
          wsService.disconnect();
        };
      }
    };

    initializeWebSocket();
    return cleanup;
  }, [user, isAuthenticated]);

  return (
    <WebSocketContext.Provider value={{ wsService, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}; 