import WebSocketTest from "@/components/WebSocketeTest";

export default async function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-2 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>In development, choose a link in the menu</h1>
        <WebSocketTest />
      </main>
    </div>
  );
}
