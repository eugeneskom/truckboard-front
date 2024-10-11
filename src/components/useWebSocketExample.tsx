'use client';

import React, { useEffect, useState } from 'react';
import { useWebSocket } from './WebSocketProvider';

const UseWebSocketExample: React.FC = () => {
  const { lastMessage } = useWebSocket();
  // eslint-disable-next-line
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (lastMessage) {
      // Handle the incoming message
      setData(prevData => {
        // Update the relevant item in your data array
        return prevData.map(item => 
          item.id === lastMessage.id ? { ...item, [lastMessage.field]: lastMessage.value } : item
        );
      });
    }
  }, [lastMessage]);

  return (
    <div>
      <h2>Last WebSocket Message:</h2>
      <pre>{JSON.stringify(lastMessage, null, 2)}</pre>
    </div>
  );
};

export default UseWebSocketExample;