import TruckList from '@/components/tables/truck-list/TruckList';
import { TruckData } from '@/types';
import React from 'react'


async function fetchTrucksData(): Promise<TruckData[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}api/trucks`,{
    cache: "no-cache",
  }); // Fetch data from the server
  console.log('process.env.NEXT_PUBLIC_SERVER_URL',process.env.NEXT_PUBLIC_SERVER_URL)

  // Check if the response is okay
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function TruckListPage() {

  const data = await fetchTrucksData(); // Implement this function to fetch data from your API
  return (
    <div className="pb-20">
      <TruckList data={data} />;
    </div>
  )
}

export default TruckListPage;