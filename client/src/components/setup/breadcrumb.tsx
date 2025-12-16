"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface BreadcrumbProps {
  os?: string
  app?: string
}

export default function SetupBreadcrumb({ os, app }: BreadcrumbProps) {
  if (!os) return null

  const osName = os.charAt(0).toUpperCase() + os.slice(1)

  const appNames: Record<string, string> = {
    "netmod-client": "NetMod Client",
    "netmod-android": "NetMod Android",
    "netmod-ios": "NetMod iOS",
    netch: "Netch",
    v2rayng: "V2RayNG",
    v2box: "V2Box",
  }

  const appName = app ? appNames[app] || app : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="py-3 mb-8"
    >
      <div className="flex items-center gap-1 text-sm font-medium overflow-x-auto no-scrollbar">
        <Link href="/setup" className="text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap">
          Setup Guide
        </Link>

        <ChevronRight size={16} strokeWidth={1.5} className="text-gray-400 flex-shrink-0" />

        <Link
          href={`/setup?os=${os}`}
          className={`transition-colors whitespace-nowrap ${
            app ? "text-gray-500 hover:text-gray-900" : "text-gray-900 font-semibold"
          }`}
        >
          {osName}
        </Link>

        {app && (
          <>
            <ChevronRight size={16} strokeWidth={1.5} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 font-semibold whitespace-nowrap">{appName}</span>
          </>
        )}
      </div>
    </motion.div>
  )
}
