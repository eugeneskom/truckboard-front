"use client";

import AggregatedDataTable from "@/components/tables/aggregated/AggregatedTable";
import { SearchRateType } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { useWebSocket } from "@/components/WebSocketProvider";

async function handleGetAggregatedData(): Promise<SearchRateType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}api/aggregated`, {
    cache: "no-cache",
  });
  return res.json();
}

function TabloPage() {
  const [data, setData] = useState<SearchRateType[]>([]);
  const { socket } = useWebSocket();

  const fetchData = useCallback(async () => {
    const res: SearchRateType[] = await handleGetAggregatedData();
    setData(res);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!socket) return;

    const handleWebSocketMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);

      switch (message.type) {
        case 'update':
          setData(prevData => 
            prevData.map(item => 
              item.search_id === message.data.id 
                ? { ...item, [message.data.field]: message.data.value }
                : item
            )
          );
          break;
        case 'add':
          setData(prevData => [...prevData, message.data]);
          break;
        case 'delete':
          setData(prevData => 
            prevData.filter(item => item.search_id !== message.data.id)
          );
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    };

    socket.addEventListener('message', handleWebSocketMessage);

    return () => {
      socket.removeEventListener('message', handleWebSocketMessage);
    };
  }, [socket]);

  return (
    <div className="px-5">
      <p>TabloPage #1</p>
      <AggregatedDataTable data={data} setData={setData}/>
    </div>
  );
}

export default TabloPage;