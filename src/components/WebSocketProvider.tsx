'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface WebSocketContextType {
  socket: WebSocket | null;
  sendMessage: (message: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({ 
  socket: null, 
  sendMessage: () => {}
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setReconnectAttempt(0);
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.reason);
      setSocket(null);
      
      // Attempt to reconnect with exponential backoff
      const timeout = Math.min(1000 * 2 ** reconnectAttempt, 30000);
      setTimeout(() => {
        setReconnectAttempt(prev => prev + 1);
        connectWebSocket();
      }, timeout);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);
  }, [reconnectAttempt]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback((message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.error('WebSocket is not connected');
    }
  }, [socket]);

  return (
    <WebSocketContext.Provider value={{ socket, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};