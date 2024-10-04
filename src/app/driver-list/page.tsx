import React from 'react'
import DriverList from '@/components/tables/driver-list/DriverList'
import { DriverData } from '@/types';

async function fetchDriversData(): Promise<DriverData[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}api/driver-list`,{
    cache: "no-cache",
  }); // Fetch data from the server
  console.log('process.env.NEXT_PUBLIC_SERVER_URL',process.env.NEXT_PUBLIC_SERVER_URL)

  // Check if the response is okay
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}


async function DriversPage() {
  const data: DriverData[] = await fetchDriversData(); // Fetch data server-side
  return (
    <DriverList data={data}/>
  )
}

export default DriversPage