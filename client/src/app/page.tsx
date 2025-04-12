'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Globe, Server, Lock, Rocket, Cpu, BarChart2, User, Activity } from 'lucide-react'
import Image from 'next/image'
import { themes, type ThemeKey } from '@/lib/themes'
import { useState } from 'react'

const themeKeys: ThemeKey[] = ['teal', 'indigo', 'purple', 'emerald']

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('teal')
  const theme = themes[currentTheme]

  return (
    <div className={`min-h-screen bg-black ${theme.text}`}>
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className={`absolute w-[800px] h-[800px] rounded-full bg-gradient-radial ${theme.primary} opacity-10 blur-3xl`} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium">Proudly Sri Lankan Service</span>
          </motion.div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent mb-6">
            Sri Lanka's <span className={`bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>Most Stable</span> VPN
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Powered by premium Singapore servers for unmatched reliability. Enjoy local support with 
            enterprise-grade global infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-8 py-3 rounded-lg font-medium text-white ${theme.accent} transition-all`}
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 rounded-lg font-medium bg-zinc-800 hover:bg-zinc-700 text-white transition-all"
            >
              How It Works
            </motion.button>
          </div>
        </motion.div>

        {/* Connection Advantage Visual */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative mt-20 mx-auto max-w-3xl"
        >
          <div className="flex flex-col items-center">
            <div className={`p-4 rounded-lg ${theme.icon} mb-6`}>
              <User className="h-8 w-8 text-white" />
            </div>
            <div className={`h-16 w-0.5 bg-gradient-to-b ${theme.primary}to-transparent`}></div>
            <div className="text-center p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <Globe className={`w-10 h-10 mx-auto mb-3 ${theme.icon}`} />
              <h3 className="text-xl font-medium text-white">Singapore Infrastructure</h3>
              <p className="text-zinc-400 mt-2">Premium Tier-1 servers for Sri Lankan users</p>
            </div>
            <div className={`h-16 w-0.5 bg-gradient-to-b ${theme.primary}to-transparent`}></div>
            <div className={`p-4 rounded-lg ${theme.icon}`}>
              <Server className="h-8 w-8 text-white" />
            </div>
          </div>
        </motion.div>
      </section>

      
    </div>
  )
}