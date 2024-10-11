'use client';

import React from 'react';
import { WebSocketProvider } from './WebSocketProvider';

export const ClientProviders: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <WebSocketProvider>
      {children}
    </WebSocketProvider>
  );
};