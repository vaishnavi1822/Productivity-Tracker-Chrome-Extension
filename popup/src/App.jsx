import React from 'react';
import { AppProvider } from './context/AppContext';
import { WebSocketProvider } from './context/WebSocketContext';
import AppContent from './components/AppContent';
import './App.css';

function App() {
  return (
    <AppProvider>
      <WebSocketProvider>
        <AppContent />
      </WebSocketProvider>
    </AppProvider>
  );
}

export default App; 