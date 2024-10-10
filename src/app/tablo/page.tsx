"use client";

import AggregatedDataTable from "@/components/tables/aggregated/AggregatedTable";
import { SearchRateType } from "@/types";
import { useEffect, useState } from "react";

async function handleGetAggregatedData(): Promise<SearchRateType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}api/aggregated`, {
    cache: "no-cache",
  });

  // console.log(`${process.env.NEXT_PUBLIC_SERVER_URL}`, res);
  // if (!res.ok) {
  //   throw new Error("Failed to fetch data");
  // }

  return res.json();
}

 function TabloPage() {
  const [data, setData] = useState<SearchRateType[]>([]);

  useEffect(() => {
  // const res: PostingTypes[] = await handleGetAggregatedData(); // Fetch data server-side
  // setData(res)

  const handleData = async () => {
    const res: SearchRateType[] = await handleGetAggregatedData(); // Fetch data server-side
    setData(res);
  }

  handleData()

  }, []);

  return (
    <div className="px-5">
      <p>TabloPage #1</p>
      <AggregatedDataTable data={data} setData={setData}/>
 
    </div>
  );
}

export default TabloPage;
