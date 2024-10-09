import React from 'react'
import SearchList from '@/components/tables/search-list/SearchList'
import { SearchData } from '@/types';


async function fetchSearchData(): Promise<SearchData[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}api/searches`,{
    cache: "no-cache",
  }); // Fetch data from the server
  console.log('process.env.NEXT_PUBLIC_SERVER_URL',process.env.NEXT_PUBLIC_SERVER_URL)

  // Check if the response is okay
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function SearchPage() {
  const data: SearchData[] = await fetchSearchData(); // Fetch data server-side
  console.log('data',data)
  return (
    <SearchList  data={data}/>
  )
}

export default SearchPage