"use client";

import localFont from "next/font/local";
// import Head from 'next/head';
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TopBar from "@/components/Bars/TopBar";
import SideBar from "@/components/Bars/SideBar";
// import logoLight from "@/assets/logoLight.png";


//אל תמחקו, שישאר לדוגמא לשימוש שלנו
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const heebo = localFont({
  src: "./fonts/HeeboVF.ttf",
  variable: "--font-heebo",
  weight: "100 900",
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en" className={` ${heebo.variable}`}>
      {/* <Head>
        <link rel="icon" href={logoLight.src} type="image/png"/>
      </Head> */}
        <body className="font-heebo">
          <TopBar />
          <div className="main">
            <SideBar />
            {children}
          </div>
        </body>
      </html>
    </QueryClientProvider>
  );
}
