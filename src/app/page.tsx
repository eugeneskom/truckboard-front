// Import necessary React types and components
import TableCarriers from "@/components/Table";
import { CarrierData } from "@/types";
// Define the type for your carrier data


// Fetch data in a server component
async function fetchCarrierData(): Promise<CarrierData[]> {
  const res = await fetch(`${process.env.NEXT_APP_SERVER_URL}carrier-list`); // Fetch data from the server

  // Check if the response is okay
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {
  const data: CarrierData[] = await fetchCarrierData(); // Fetch data server-side

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <TableCarriers data={data} />
      </main>
    </div>
  );
}
