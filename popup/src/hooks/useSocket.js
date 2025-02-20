import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const socket = useRef();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Connect to backend with error handling
      try {
        socket.current = io('http://localhost:5000', {
          transports: ['websocket'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5
        });
        
        socket.current.emit('join-user-room', user.userId);

        socket.current.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });

        socket.current.on('activity-updated', (data) => {
          console.log('Activity updated:', data);
        });

        return () => {
          if (socket.current) {
            socket.current.disconnect();
          }
        };
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    }
  }, [user]);

  return socket.current;
}; 