"use client";
import { AiOutlineMail } from "react-icons/ai"; 
import React, { useState} from "react";
import Head from "next/head";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Contact from "../components/Home/contactEmailComponent";
import '../assets/fonts/fonts.css'

import {
  SideBar,
  TopBar,
  CalcButton,
  CalcPage,
  Footer,
} from "@/components/index";
import { FaWhatsapp } from "react-icons/fa";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isCalcPageVisible, setIsCalcPageVisible] = useState(false);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

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

          <a
            href="https://wa.me/972556738762?text=שלום,%20אני%20מעוניין%20לשמוע%20פרטים%20נוספים"            
            target="_blank"
            rel="noopener noreferrer"
            className="whatsappButton"
          >
            <FaWhatsapp className="iconStyle" />
          </a>

          <button
            className="contactButton"
            onClick={() => setIsContactPopupOpen(true)}
          >
            <AiOutlineMail className="iconStyle" />
          </button>
          {isContactPopupOpen && (
            <Contact isPopupOpen={isContactPopupOpen} setIsPopupOpen={setIsContactPopupOpen} />
          )}
        </body>
      </html>
    </QueryClientProvider>
  );
}