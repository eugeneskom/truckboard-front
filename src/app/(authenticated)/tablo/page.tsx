"use client";

import AggregatedDataTable from "@/components/tables/aggregated/AggregatedTable";
import { useWebSocket, useWebSocketMessages } from "@/components/auth/socket/WebSocketProvider";
import { SearchRateType } from "@/types";
import { useEffect, useState, useCallback } from "react";

interface AggregatedApiResponse {
  data: SearchRateType[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalRows: number;
    hasMore: boolean;
  };
}

async function handleGetAggregatedData(page: number = 1): Promise<SearchRateType[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}api/aggregated?page=${page}&limit=10`,
    {
      cache: "no-cache",
    }
  );
  const resJson: AggregatedApiResponse = await res.json();
  return resJson.data;
}

function TabloPage() {
  const [data, setData] = useState<SearchRateType[]>([]);
  const { subscribeToMessages } = useWebSocket();
  const lastMessage = useWebSocketMessages();
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async (page: number) => {
    const res = await handleGetAggregatedData(page);
    if (page === 1) {
      setData(res);
    } else {
      setData(prevData => [...prevData, ...res]);
    }
  }, []);

  console.log('Current page:', currentPage, 'Data:', data);

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  const loadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleWebSocketMessage = (message: any) => {
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

    const unsubscribe = subscribeToMessages(handleWebSocketMessage);

    return () => {
      unsubscribe();
    };
  }, [subscribeToMessages]);

  useEffect(() => {
    if (lastMessage) {
      console.log('Last message received:', lastMessage);
    }
  }, [lastMessage]);

  console.log('Data:', data);

  return (
    <div className="px-5">
      <h1 className="mb-3 text-center font-bold">Truckboard</h1>
      <AggregatedDataTable 
        data={data} 
        onLoadMore={loadMore}
      />
      {/* <GroupedTable data={data} /> */}
    </div>
  );
}

export default TabloPage;