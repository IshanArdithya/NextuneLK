"use client"

import { motion } from "framer-motion"
import { User, Settings, CreditCard, Download, Globe, Shield, Clock, Bell, LogOut } from "lucide-react"
import { useState } from "react"
import { useTheme } from "@/context/ThemeContext"

export default function Dashboard() {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState("overview")

  const userStats = {
    dataUsed: 45.7,
    dataLimit: 100,
    connectionTime: "127h 32m",
    serversUsed: 8,
    currentServer: "Singapore #1",
    accountType: "Pro",
    expiryDate: "2024-12-15",
  }

  const recentConnections = [
    { server: "Singapore #1", duration: "2h 15m", data: "1.2 GB", time: "2 hours ago" },
    { server: "Tokyo #2", duration: "45m", data: "0.8 GB", time: "5 hours ago" },
    { server: "Hong Kong #1", duration: "1h 30m", data: "0.9 GB", time: "1 day ago" },
  ]

  const tabs = [
    { id: "overview", name: "Overview", icon: <User className="w-5 h-5" /> },
    { id: "usage", name: "Usage", icon: <Globe className="w-5 h-5" /> },
    { id: "billing", name: "Billing", icon: <CreditCard className="w-5 h-5" /> },
    { id: "settings", name: "Settings", icon: <Settings className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-black text-white py-20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Alex</span>
            </h1>
            <p className="text-gray-400">Manage your NexTuneLK account and monitor your usage</p>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 bg-gray-900/50 backdrop-blur-md rounded-2xl p-2 border border-gray-700"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Download className="w-6 h-6" />,
                  label: "Data Used",
                  value: `${userStats.dataUsed} GB`,
                  subtitle: `of ${userStats.dataLimit} GB`,
                  color: "from-cyan-400 to-blue-500",
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  label: "Connection Time",
                  value: userStats.connectionTime,
                  subtitle: "This month",
                  color: "from-purple-400 to-pink-500",
                },
                {
                  icon: <Globe className="w-6 h-6" />,
                  label: "Servers Used",
                  value: userStats.serversUsed.toString(),
                  subtitle: "Different locations",
                  color: "from-emerald-400 to-teal-500",
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  label: "Account Type",
                  value: userStats.accountType,
                  subtitle: `Expires ${userStats.expiryDate}`,
                  color: "from-amber-400 to-orange-500",
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-6 hover:border-cyan-400/50 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-3 mb-4`}>
                    <div className="text-white">{stat.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-gray-500 text-xs mt-1">{stat.subtitle}</p>
                </motion.div>
              ))}
            </div>

            {/* Current Connection */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Current Connection</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{userStats.currentServer}</h3>
                    <p className="text-gray-400">Connected • 2h 15m</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-emerald-400 text-sm">Secure Connection</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors"
                >
                  Disconnect
                </motion.button>
              </div>
            </motion.div>

            {/* Recent Connections */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Recent Connections</h2>
              <div className="space-y-4">
                {recentConnections.map((connection, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{connection.server}</h4>
                        <p className="text-gray-400 text-sm">{connection.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{connection.duration}</p>
                      <p className="text-gray-400 text-sm">{connection.data}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === "usage" && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Usage Overview */}
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8">
              <h2 className="text-2xl font-bold mb-6">Data Usage</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="relative w-48 h-48 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${(userStats.dataUsed / userStats.dataLimit) * 251.2} 251.2`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{userStats.dataUsed}GB</div>
                        <div className="text-gray-400 text-sm">of {userStats.dataLimit}GB</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Download</span>
                      <span className="text-white">32.4 GB</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                        style={{ width: "70%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Upload</span>
                      <span className="text-white">13.3 GB</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
                        style={{ width: "30%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "billing" && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8">
              <h2 className="text-2xl font-bold mb-6">Billing Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-white mb-2">Pro Plan</h4>
                    <p className="text-gray-300 mb-4">$19.99/month</p>
                    <p className="text-sm text-gray-400">Next billing: December 15, 2024</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <div className="bg-gray-800/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="w-5 h-5 text-cyan-400" />
                      <span className="text-white">•••• •••• •••• 4242</span>
                    </div>
                    <p className="text-gray-400 text-sm">Expires 12/26</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value="alex_user"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value="alex@example.com"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-medium"
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
