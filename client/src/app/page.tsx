'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Globe, Server, Lock, Rocket, Cpu, BarChart2, User, Activity } from 'lucide-react'
import Image from 'next/image'
import { themes, type ThemeKey } from '@/lib/themes'
import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { type Theme } from '@/lib/themes'

const themeKeys: ThemeKey[] = ['teal', 'indigo', 'purple', 'emerald']

export default function Home() {
  const { currentTheme, theme } = useTheme()
  const [currentThemeKey, setCurrentTheme] = useState<ThemeKey>(currentTheme)


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

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">The Sri Lankan Advantage</h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Local expertise with world-class Singaporean infrastructure
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Server className={`w-8 h-8 ${theme.icon}`} />,
                title: "Singapore Powered",
                description: "Premium offshore servers for maximum uptime"
              },
              {
                icon: <Shield className={`w-8 h-8 ${theme.icon}`} />,
                title: "Local Support",
                description: "24/7 assistance from our Colombo team"
              },
              {
                icon: <Zap className={`w-8 h-8 ${theme.icon}`} />,
                title: "Optimized Routing",
                description: "Specialized paths for Sri Lankan ISPs"
              },
              {
                icon: <Lock className={`w-8 h-8 ${theme.icon}`} />,
                title: "No Data Limits",
                description: "Unrestricted bandwidth for all users"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`p-6 rounded-xl border ${theme.border} bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/30 transition-all`}
              >
                <div className={`w-12 h-12 rounded-lg ${theme.iconBg} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold text-white mb-4"
            >
              <span className={`bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>Why</span> Singapore Servers?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-zinc-400 max-w-3xl mx-auto"
            >
              We use Singapore's world-class datacenters to provide Sri Lankans with:
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className={`w-16 h-16 mx-auto rounded-xl ${theme.iconBg} flex items-center justify-center mb-4`}>
                <Activity className={theme.icon} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">99.99% Uptime</h3>
              <p className="text-zinc-400">Enterprise-grade reliability from Singapore's Tier-4 datacenters</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className={`w-16 h-16 mx-auto rounded-xl ${theme.iconBg} flex items-center justify-center mb-4`}>
                <Globe className={theme.icon} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Global Content</h3>
              <p className="text-zinc-400">Access international services with Singapore IP addresses</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className={`w-16 h-16 mx-auto rounded-xl ${theme.iconBg} flex items-center justify-center mb-4`}>
                <Shield className={theme.icon} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Enhanced Privacy</h3>
              <p className="text-zinc-400">Singapore's strong privacy laws protect your data</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}