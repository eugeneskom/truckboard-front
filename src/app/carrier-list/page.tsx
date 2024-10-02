import React from 'react'
import CarriersList from '@/components/tables/carrier-list/CarriersList'
import { CarrierData } from '@/types';


async function fetchCarrierData(): Promise<CarrierData[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carrier-list`,{
    cache: "no-cache",
  }); // Fetch data from the server
  console.log('process.env.NEXT_PUBLIC_SERVER_URL',process.env.NEXT_PUBLIC_SERVER_URL)

  // Check if the response is okay
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function CarrierList() {
  const data: CarrierData[] = await fetchCarrierData(); // Fetch data server-side

  return (
    <CarriersList data={data} />
  )
}

export default CarrierList