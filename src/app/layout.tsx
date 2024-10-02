import type { Metadata } from "next";
import "./globals.css";
import Header from "./templates/Header";


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
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
