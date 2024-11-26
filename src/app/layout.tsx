"use client"  
import localFont from "next/font/local";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import TopBar from "@/components/Bars/TopBar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient();
  return (
    <html lang="he">
      <QueryClientProvider client={queryClient}>
        <body>
          <TopBar />
          {children}
        </body>
      </QueryClientProvider>
    </html>
  );
}
