'use client';

import React, { useState } from 'react';
import { useWebSocket } from './WebSocketProvider';

const WebSocketTest: React.FC = () => {
  // eslint-disable-next-line
  const { sendMessage, lastMessage } = useWebSocket();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    sendMessage(message);
    setMessage('');
  };

  return (
    <div>
      <h2>WebSocket Test</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter a message"
      />
      <button onClick={handleSend}>Send</button>
      <div>
        <h3>Last Received Message:</h3>
        <pre>{JSON.stringify(lastMessage, null, 2)}</pre>
      </div>
    </div>
  );
};

export default WebSocketTest;