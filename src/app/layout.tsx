import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { TRPCReactProvider } from "@/trpc/react";
import { ourFileRouter } from "./api/uploadthing/core";
import { Navbar } from "@/components/ui/navbar/navbar";
import { Spotlight } from "@/components/ui/spotlight";
import { getServerSession } from "next-auth";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "agri",
  description: "agri",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();
  return (
    <html lang="en" className={`${GeistSans.variable} antialiased`}>
      <body>
        <TRPCReactProvider>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Spotlight
            className="-top-40 left-0 md:-top-20 md:left-60"
            fill="green"
          />
          <Navbar session={session}></Navbar>
          <div className="h-screen w-full">{children}</div>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
