'use client';

import React, { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react';

interface WebSocketContextType {
  sendMessage: (message: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribeToMessages: (listener: (message: any) => void) => () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastMessage: any;
}

const WebSocketContext = createContext<WebSocketContextType>({
  sendMessage: () => {},
  subscribeToMessages: () => () => {},
  lastMessage: null,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messageListenersRef = useRef<Set<(message: any) => void>>(new Set());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lastMessage, setLastMessage] = useState<any>(null);

// In your WebSocketProvider.tsx

const connectWebSocket = useCallback(() => {
  if (socketRef.current?.readyState === WebSocket.OPEN) return;
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002';
  const ws = new WebSocket(WS_URL); 

  ws.onopen = () => {
    console.log('Connected to WebSocket');
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Received message:', message);
    setLastMessage(message);
    messageListenersRef.current.forEach(listener => listener(message));
  };

  ws.onclose = (event) => {
    console.log('WebSocket connection closed', event.code, event.reason);
    socketRef.current = null;
    reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socketRef.current = ws;
}, []);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback((message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.error('WebSocket is not connected');
    }
  }, []);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscribeToMessages = useCallback((listener: (message: any) => void) => {
    messageListenersRef.current.add(listener);
    return () => {
      messageListenersRef.current.delete(listener);
    };
  }, []);

  const contextValue = {
    sendMessage,
    subscribeToMessages,
    lastMessage,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook to use in components
export const useWebSocketMessages = () => {
  const { lastMessage } = useContext(WebSocketContext);
  return lastMessage;
};