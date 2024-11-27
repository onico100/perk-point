'use client'
import localFont from "next/font/local";
import "./globals.css";

import LoginPage from "@/app/login/page";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

const queryClient = new QueryClient();

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en" className={` ${heebo.variable}`}>  
          <body className="font-heebo">
            {children}
          </body>
      </html>
    </QueryClientProvider>
  );
}
