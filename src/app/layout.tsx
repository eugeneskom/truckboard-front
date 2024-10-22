"use client"
// import type { Metadata } from "next";
import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";
import Header from "@/templates/Header";
import { ClientProviders } from "@/components/auth/socket/ClientProviders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// export const metadata: Metadata = {
//   title: "Remberg Truckboard",
//   description: "Truckboard for Remberg",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  
  return (
    <html lang="en" >
      <body className="pt-24" style={{ display: "block" /* colorScheme: 'light' */ }}>
        <div className="fixed left-0 right-0 px-11 py-3 top-0 z-50 bg-neutral-900">
          <Header />
        </div>
        <QueryClientProvider client={queryClient}>

        <ClientProviders>{children}</ClientProviders>
        </QueryClientProvider>
      </body>
    </html>
  );
}
