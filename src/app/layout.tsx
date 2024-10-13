import type { Metadata } from "next";
import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";
import Header from "@/templates/Header";
import { ClientProviders } from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "Remberg Truckboard",
  description: "Truckboard for Remberg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  
  return (
    <html lang="en" >
      <body className="pt-24" style={{ display: "block" /* colorScheme: 'light' */ }}>
        <div className="fixed left-0 right-0 px-11 py-3 top-0 z-50 bg-neutral-900">
          <Header />
        </div>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
