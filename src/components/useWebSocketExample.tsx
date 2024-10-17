// Code for the WebSocketProvider component and the useWebSocket hook
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface WebSocketContextType {
  socket: WebSocket | null;
  sendMessage: (message: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastMessage: any;  
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  sendMessage: () => {},
  lastMessage: null, 
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lastMessage, setLastMessage] = useState<any>(null);  

  useEffect(() => {
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002';

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      setLastMessage(message);  
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, sendMessage, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};