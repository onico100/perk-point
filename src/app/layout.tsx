'use client'

import localFont from "next/font/local";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import TopBar from "@/components/Bars/TopBar";
import SideBar from "@/components/Bars/SideBar";
import LoginPage from "@/app/login/page";

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

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  
  return (
    <html lang="en" className={` ${heebo.variable}`}>  
    <QueryClientProvider client={queryClient}>
      <body className="font-heebo">
        <TopBar />
        <SideBar />
        <LoginPage />
        {children}
      </body>
    </QueryClientProvider>
    </html>
  );
}
