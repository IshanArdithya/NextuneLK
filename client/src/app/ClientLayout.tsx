"use client";

import type React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import WhatsNewModal from "@/components/whats-new-modal";
import { ThemeProvider } from "@/components/theme-provider";
import { AnimatePresence } from "framer-motion";
import { ThemeTransitionWrapper } from "@/components/theme-transition-wrapper";
import { Toaster } from "@/components/ui/toaster";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ThemeTransitionWrapper>
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </ThemeTransitionWrapper>
      <WhatsNewModal />
      <Toaster />
    </ThemeProvider>
  );
}
