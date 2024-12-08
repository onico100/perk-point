"use client";

import localFont from "next/font/local";
import Head from "next/head";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  SideBar,
  TopBar,
  CalcButton,
  CalcPage,
  Footer,
} from "@/components/index";
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
  const [isCalcPageVisible, setIsCalcPageVisible] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en" className={`${heebo.variable}`}>
        <Head>
          <title>PerkPoint</title>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@100..900&family=IBM+Plex+Sans+Hebrew:wght@100;200;300;400;500;600;700&family=Varela+Round&display=swap"
          rel="stylesheet"
        />
        </Head>
        <body className="font-heebo">
          {isCalcPageVisible && (
            <div
              className="overlay"
              onClick={() => setIsCalcPageVisible(false)}
            />
          )}
          <div className="layout">
            <TopBar />
            <div className="mainContent">
              <SideBar />
              <div className="main">
                <CalcButton onClick={() => setIsCalcPageVisible(true)} />
                {children}
              </div>
            </div>
          </div>

          {isCalcPageVisible && (
            <div className="calc-page-container">
              <CalcPage onClose={() => setIsCalcPageVisible(false)} />
            </div>
          )}
        </body>
        <Footer />
      </html>
    </QueryClientProvider>
  );
}
