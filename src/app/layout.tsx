"use client";

import React, { useState, useEffect } from "react";
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
import useGeneralStore from "@/stores/generalStore";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isCalcPageVisible, setIsCalcPageVisible] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <Head>
          <title>PerkPoint</title>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
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
            <div className={"mainContent"}>
              <SideBar />
              <div className="main">
                <CalcButton onClick={() => setIsCalcPageVisible(true)} />
                {children}
              </div>
            </div>
            <Footer />
          </div>

          {isCalcPageVisible && (
            <div className="calc-page-container">
              <CalcPage onClose={() => setIsCalcPageVisible(false)} />
            </div>
          )}
        </body>
      </html>
    </QueryClientProvider>
  );
}
