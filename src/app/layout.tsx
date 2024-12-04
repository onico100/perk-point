"use client";

import localFont from "next/font/local";
import Head from "next/head";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SideBar, TopBar, CalcButton, CakcPage } from "@/components/index";
import { useState } from "react"; // Import useState

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
  const [isCalcPageVisible, setIsCalcPageVisible] = useState(false); // State to control visibility

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en" className={`${heebo.variable}`}>
        <Head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </Head>
        <body className="font-heebo">
          <TopBar />
          <div className="main">
            <SideBar />
            <CalcButton onClick={() => setIsCalcPageVisible(true)} />{" "}
            {isCalcPageVisible && (<div className="overlay" onClick={() => setIsCalcPageVisible(false)}/>)}
            {children}
            {isCalcPageVisible && (<CakcPage onClose={() => setIsCalcPageVisible(false)} />)}
          </div>
        </body>
      </html>
    </QueryClientProvider>
  );
}
