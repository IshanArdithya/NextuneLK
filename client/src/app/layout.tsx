import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { SnowEffect } from "../components/SnowEffect";

export const metadata: Metadata = {
  title: "NextuneLK",
  description: "View your current data usage and account status",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientLayout>{children}</ClientLayout>
        {/* <SnowEffect /> */}
      </body>
    </html>
  );
}
