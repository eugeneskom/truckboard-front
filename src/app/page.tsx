// Import necessary React types and components
// import CarriersList from "@/components/tables/carrier-list/CarriersList";
// import { CarrierData } from "@/types";

// Fetch data in a server component
// async function fetchCarrierData(): Promise<CarrierData[]> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carrier-list`,{
//     cache: "no-cache",
//   }); // Fetch data from the server
//   console.log('process.env.NEXT_PUBLIC_SERVER_URL',process.env.NEXT_PUBLIC_SERVER_URL)

//   // Check if the response is okay
//   if (!res.ok) {
//     throw new Error("Failed to fetch data");
//   }

//   return res.json();
// }

// const fetcher = (url: string) => fetch(url).then((res) => res.json());


export default async function Home() {
  // const data: CarrierData[] = await fetchCarrierData(); // Fetch data server-side
  // 
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-2 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* <CarriersList data={data}/> */}
        <h1>In development, choose a link in the menu</h1>
      </main>
    </div>
  );
}
