import React from "react";
import CarriersList from "@/components/tables/carrier-list/CarriersList";
import { CarrierData } from "@/types";
import UseWebSocketExample from "@/components/useWebSocketExample";

async function fetchCarrierData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carriers`, {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  }); // Fetch data from the server
  const data = await res.json();
  console.log("process.env.NEXT_PUBLIC_SERVER_URL", process.env.NEXT_PUBLIC_SERVER_URL, data);

  // Check if the response is okay
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return data;
}

async function CarrierList() {
  const data: CarrierData[] = await fetchCarrierData(); // Fetch data server-side

  return (
    <>
      <CarriersList data={data} />
      <UseWebSocketExample />
    </>
  );
}

export default CarrierList;
