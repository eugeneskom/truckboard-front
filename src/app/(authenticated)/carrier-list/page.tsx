import React from "react";
import { cookies } from 'next/headers';
import CarriersList from "@/components/tables/carrier-list/CarriersList";
import { CarrierData } from "@/types";

async function fetchCarrierData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carriers`, {
      next: { revalidate: 36000 },
      headers: {
        "Content-Type": "application/json",
        "Cookie": `token=${token?.value || ''}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching carrier data:', error);
    throw error;
  }
}

async function CarrierList() {
  try {
    const data: CarrierData[] = await fetchCarrierData();

    return (
      <>
        <CarriersList data={data} />
      </>
    );
    // eslint-disable-next-line 
  } catch (error:unknown) {
    // You might want to handle this differently depending on your needs
    return (
      <div className="p-4 text-red-500">
        Error loading carrier data. Please try again later.
      </div>
    );
  }
}

export default CarrierList;