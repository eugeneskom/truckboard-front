import React from 'react'
import RateList from '@/components/tables/rate-list/RateList'
import { RateItem } from '@/types';

 

async function fetchRateData(): Promise<RateItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}api/rate-list`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function RateListPage() {
  const data: RateItem[] = await fetchRateData();

  return (
    <RateList data={data} />
  )
}

export default RateListPage