"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { createContext, useState } from "react";
import { UserProvider as UserProviderTwo } from "./rootprovider";
import UserProvider from "./user-provider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme";

// RootContex


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState(null);

  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`antialiased bg-[]`}
      >
        <Analytics/>
         <ThemeProvider
            attribute="class"
            defaultTheme="light"
            
            disableTransitionOnChange
          >
        <Analytics/>
        <SpeedInsights/>
        <Toaster />
        <SessionProvider>
          <UserProviderTwo>
            <UserProvider/>
            {children as any}
          </UserProviderTwo>
        </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
