"use client"

import { motion } from "framer-motion"
import { Play, Download, Smartphone, Monitor, Wifi, Shield, CheckCircle, ArrowRight, Clock } from "lucide-react"
import { useState } from "react"
import { useTheme } from "@/context/ThemeContext"

export default function Tutorials() {
  const { theme } = useTheme()
  const [selectedPlatform, setSelectedPlatform] = useState("windows")

  const platforms = [
    { id: "windows", name: "Windows", icon: <Monitor className="w-6 h-6" /> },
    { id: "android", name: "Android", icon: <Smartphone className="w-6 h-6" /> },
    { id: "ios", name: "iOS", icon: <Smartphone className="w-6 h-6" /> },
    { id: "router", name: "Router", icon: <Wifi className="w-6 h-6" /> },
  ]

  const tutorials = {
    windows: [
      {
        step: 1,
        title: "Download NexTuneLK App",
        description: "Download our Windows client from the official website",
        duration: "1 min",
        details: ["Visit nextunelik.com/download", 'Click "Download for Windows"', "Save the installer file"],
      },
      {
        step: 2,
        title: "Install the Application",
        description: "Run the installer and follow the setup wizard",
        duration: "2 min",
        details: [
          'Right-click installer and "Run as Administrator"',
          "Accept the license agreement",
          "Choose installation directory",
          "Complete the installation",
        ],
      },
      {
        step: 3,
        title: "Login & Connect",
        description: "Enter your credentials and connect to a server",
        duration: "30 sec",
        details: [
          "Launch NexTuneLK app",
          "Enter your username and password",
          "Select Singapore server for best performance",
          "Click Connect button",
        ],
      },
    ],
    android: [
      {
        step: 1,
        title: "Download from Play Store",
        description: "Install NexTuneLK from Google Play Store",
        duration: "1 min",
        details: ["Open Google Play Store", 'Search for "NexTuneLK"', "Tap Install", "Wait for download to complete"],
      },
      {
        step: 2,
        title: "Grant Permissions",
        description: "Allow VPN permissions for secure connection",
        duration: "30 sec",
        details: [
          "Open NexTuneLK app",
          'Tap "Allow" for VPN permission',
          "Confirm VPN connection request",
          "Enable notifications (optional)",
        ],
      },
      {
        step: 3,
        title: "Connect to Server",
        description: "Login and select your preferred server location",
        duration: "30 sec",
        details: [
          "Enter your login credentials",
          "Choose Singapore for best speed",
          "Tap the connect button",
          "Verify connection status",
        ],
      },
    ],
    ios: [
      {
        step: 1,
        title: "Download from App Store",
        description: "Install NexTuneLK from Apple App Store",
        duration: "1 min",
        details: [
          "Open App Store",
          'Search for "NexTuneLK"',
          "Tap Get to download",
          "Authenticate with Face ID/Touch ID",
        ],
      },
      {
        step: 2,
        title: "Configure VPN Profile",
        description: "Allow iOS to add VPN configuration",
        duration: "1 min",
        details: [
          "Open NexTuneLK app",
          'Tap "Add VPN Configuration"',
          "Enter device passcode",
          "Confirm VPN profile installation",
        ],
      },
      {
        step: 3,
        title: "Connect Securely",
        description: "Login and establish secure connection",
        duration: "30 sec",
        details: [
          "Enter your account credentials",
          "Select Singapore server",
          "Toggle VPN switch to ON",
          "Check connection indicator",
        ],
      },
    ],
    router: [
      {
        step: 1,
        title: "Access Router Settings",
        description: "Login to your router admin panel",
        duration: "2 min",
        details: [
          "Open web browser",
          "Navigate to 192.168.1.1",
          "Enter admin username/password",
          "Find VPN or WAN settings",
        ],
      },
      {
        step: 2,
        title: "Configure VPN Settings",
        description: "Enter NexTuneLK server details",
        duration: "5 min",
        details: [
          "Select OpenVPN or WireGuard protocol",
          "Upload configuration file",
          "Enter server address: sg1.nextunelik.com",
          "Input your VPN credentials",
        ],
      },
      {
        step: 3,
        title: "Test Connection",
        description: "Verify all devices are protected",
        duration: "1 min",
        details: [
          "Save and apply settings",
          "Restart router if required",
          "Check IP address on connected devices",
          "Verify Singapore location",
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Quick Setup
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Get connected in under 3 minutes with our step-by-step guides. Choose your platform and follow along.
          </p>

          {/* Video Preview */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative max-w-2xl mx-auto mb-12 rounded-2xl overflow-hidden border border-gray-700 bg-gray-900/50 backdrop-blur-md"
          >
            <div className="aspect-video bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </motion.button>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-sm">
              2:30 - Complete Setup Guide
            </div>
          </motion.div>
        </motion.div>

        {/* Platform Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-gray-900/50 backdrop-blur-md rounded-2xl p-2 border border-gray-700">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
                  selectedPlatform === platform.id
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                {platform.icon}
                {platform.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tutorial Steps */}
        <div className="max-w-4xl mx-auto">
          {tutorials[selectedPlatform as keyof typeof tutorials].map((tutorial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="mb-8 last:mb-0"
            >
              <div className="flex gap-6">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {tutorial.step}
                  </div>
                  {i < tutorials[selectedPlatform as keyof typeof tutorials].length - 1 && (
                    <div className="w-0.5 h-16 bg-gradient-to-b from-cyan-500 to-purple-600 mx-auto mt-4" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8 hover:border-cyan-400/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white">{tutorial.title}</h3>
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{tutorial.duration}</span>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-6">{tutorial.description}</p>

                    <div className="space-y-3">
                      {tutorial.details.map((detail, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-gray-300">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl border border-gray-700 p-12">
            <h2 className="text-3xl font-bold mb-6">
              Ready to{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Get Started
              </span>
              ?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Download NexTuneLK now and experience quantum-grade security in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,255,255,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold"
              >
                <Download className="w-5 h-5" />
                Download Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 border border-gray-600 rounded-full font-semibold hover:border-cyan-400 transition-colors"
              >
                <Shield className="w-5 h-5" />
                View Security Features
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
          <p className="text-gray-300 mb-6">
            Our 24/7 support team is ready to assist you with setup and configuration.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-full font-medium transition-colors"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
