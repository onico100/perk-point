'use client'

import localFont from "next/font/local";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import TopBar from "@/components/Bars/TopBar";

//אל תמחקו, שישאר לדוגמא לשימוש שלנו
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const heebo= localFont({
  src: "./fonts/HeeboVF.ttf",
  variable: "--font-heebo",
  weight: "100 900",
});

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  const queryClient = new QueryClient();
  return (
    <html lang="en" className={`${geistSans.variable} ${heebo.variable}`}>  
    <QueryClientProvider client={queryClient}>
      <body className="font-heebo">
        <TopBar />
        {children}
      </body>
    </QueryClientProvider>
    </html>
  );
}
