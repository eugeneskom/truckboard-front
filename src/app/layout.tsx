"use client";

import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";
import Header from "@/templates/Header";
import { ClientProviders } from "@/components/auth/socket/ClientProviders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient(); 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="fixed left-0 right-0 px-11 py-3 top-0 z-50 bg-neutral-900">
          <Header />
        </div>
        <main className="pt-24">
          <QueryClientProvider client={queryClient}>
            <ClientProviders>
              {children}
            </ClientProviders>
          </QueryClientProvider>
        </main>
      </body>
    </html>
  );
}