"use client"
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";
import Footer from "@/components/Footer";
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <SessionProvider>
        <body className="w-full h-full">
          <Providers>{children}</Providers>
        <Footer/>
        </body>
      </SessionProvider>
    </html>
  );
}
