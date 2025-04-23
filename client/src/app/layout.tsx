import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/context/ThemeContext"
import { CustomToaster } from "@/components/CustomToast"
import Header from "@/components/header"
import Footer from "@/components/Footer"
import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/context/ThemeContext"
import ThemeSwitcher from "@/components/ThemeSwitcher"


export const metadata: Metadata = {
  title: "NexTuneLK - Sri Lanka's Premium VPN Platform",
  description: "Discover, stream, and enjoy the best music in Sri Lanka",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-black text-white flex flex-col pt-16 pb-14">
        <ThemeProvider>
          <Header />
          
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-4">
              {children}
            </div>
          </main>
          
          <Footer />
          <ThemeSwitcher />
          <CustomToaster />
        </ThemeProvider>
      </body>
    </html>
  )
}