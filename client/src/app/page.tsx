"use client"

import { motion, useScroll, useMotionValueEvent, useInView } from "framer-motion"
import { Zap, Shield, Globe, Server, Lock, Activity, ArrowRight, Play } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "@/context/ThemeContext"
import Link from "next/link"
import ParticleField from "@/components/ParticleField"
import GlowingOrb from "@/components/GlowingOrb"

export default function Home() {
  const { theme } = useTheme()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const { scrollY } = useScroll()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  // Mouse movement tracker
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Scroll progress tracker
  useMotionValueEvent(scrollY, "change", (latest) => {
    const maxScroll = document.body.scrollHeight - window.innerHeight
    setScrollProgress(latest / maxScroll)
    setIsScrolling(true)
    const timer = setTimeout(() => setIsScrolling(false), 100)
    return () => clearTimeout(timer)
  })

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Futuristic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <ParticleField />
        <GlowingOrb />

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
        </div>

        {/* Holographic Lines */}
        <svg className="bg-black absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="hologram" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="cyan" stopOpacity="0.3" />
              <stop offset="50%" stopColor="magenta" stopOpacity="0.2" />
              <stop offset="100%" stopColor="yellow" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            stroke="url(#hologram)"
            strokeWidth="2"
            fill="none"
            d="M0,100 Q400,50 800,200 T1600,100"
          />
        </svg>
      </div>

      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 z-50"
        style={{
          scaleX: scrollProgress,
          transformOrigin: "left center",
          width: "100%",
        }}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-6xl mx-auto relative z-10"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="w-3 h-3 rounded-full bg-emerald-400"
            />
            <span className="text-sm font-medium">🇱🇰 Proudly Sri Lankan • 99.99% Uptime</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Future
            </span>
            <br />
            <span className="text-white">of Privacy</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Experience quantum-grade encryption with our Singapore-powered infrastructure.
            <span className="text-cyan-400"> Unlimited bandwidth</span>,
            <span className="text-purple-400"> zero logs</span>, and
            <span className="text-pink-400"> military-grade security</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,255,255,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-lg overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>

            <Link href="/tutorials">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 border border-gray-600 rounded-full font-semibold text-lg hover:border-cyan-400 transition-colors backdrop-blur-md"
              >
                <Play className="w-5 h-5" />
                Quick Setup Guide
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            {[
              { value: "10Gbps", label: "Bandwidth" },
              { value: "50+", label: "Locations" },
              { value: "24/7", label: "Support" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-20 h-20 border border-cyan-400/30 rounded-lg backdrop-blur-md hidden lg:block"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 w-16 h-16 border border-purple-400/30 rounded-full backdrop-blur-md hidden lg:block"
        />
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Quantum-Grade
              </span>{" "}
              Security
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our Singapore infrastructure delivers unmatched performance with military-grade encryption
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Zero-Log Policy",
                description: "Quantum-encrypted servers with no data retention",
                color: "from-cyan-400 to-blue-500",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "10Gbps Bandwidth",
                description: "Unlimited high-speed connections worldwide",
                color: "from-purple-400 to-pink-500",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "50+ Locations",
                description: "Premium servers across 6 continents",
                color: "from-emerald-400 to-teal-500",
              },
              {
                icon: <Server className="w-8 h-8" />,
                title: "Private Servers",
                description: "Dedicated infrastructure for maximum privacy",
                color: "from-orange-400 to-red-500",
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "AES-256 Encryption",
                description: "Military-grade security protocols",
                color: "from-indigo-400 to-purple-500",
              },
              {
                icon: <Activity className="w-8 h-8" />,
                title: "99.99% Uptime",
                description: "Enterprise-grade reliability guarantee",
                color: "from-pink-400 to-rose-500",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative p-8 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-md hover:border-cyan-400/50 transition-all duration-300"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}
                />

                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>

                <motion.div
                  className={`h-1 w-0 bg-gradient-to-r ${feature.color} rounded-full mt-6 group-hover:w-full transition-all duration-500`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-5xl font-bold mb-8">
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Real-Time
                </span>
                <br />
                Performance
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Monitor our global infrastructure in real-time. See exactly why we're the fastest VPN in Sri Lanka.
              </p>
              <Link href="/performance">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full font-semibold flex items-center gap-2"
                >
                  View Live Stats
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700 p-8">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Latency", value: "<5ms", color: "text-emerald-400" },
                    { label: "Uptime", value: "99.99%", color: "text-cyan-400" },
                    { label: "Speed", value: "10Gbps", color: "text-purple-400" },
                    { label: "Servers", value: "50+", color: "text-pink-400" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-5xl font-bold mb-8">
              Ready for the{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Future</span>
              ?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of Sri Lankans experiencing true internet freedom with our quantum-grade VPN.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,255,255,0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-lg"
                >
                  Start 30-Day Free Trial
                </motion.button>
              </Link>

              <Link href="/pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-gray-600 rounded-full font-semibold text-lg hover:border-cyan-400 transition-colors"
                >
                  View Pricing
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
