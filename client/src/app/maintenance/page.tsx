"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, Server, AlertTriangle, CheckCircle, Settings } from "lucide-react"
import { useState } from "react"
import { useTheme } from "@/context/ThemeContext"

export default function MaintenanceScheduler() {
  const { theme } = useTheme()
  const [selectedServer, setSelectedServer] = useState("all")

  const scheduledMaintenance = [
    {
      id: 1,
      server: "Singapore #1",
      type: "Security Update",
      startTime: "2024-02-15 02:00 UTC",
      duration: "2 hours",
      status: "scheduled",
      impact: "low",
      description: "Routine security patches and system updates",
    },
    {
      id: 2,
      server: "Tokyo #2",
      type: "Hardware Upgrade",
      startTime: "2024-02-18 01:00 UTC",
      duration: "4 hours",
      status: "scheduled",
      impact: "medium",
      description: "RAM and storage capacity upgrade",
    },
    {
      id: 3,
      server: "Hong Kong #1",
      type: "Network Optimization",
      startTime: "2024-02-20 03:00 UTC",
      duration: "1 hour",
      status: "completed",
      impact: "low",
      description: "Network routing optimization for better performance",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "text-amber-400 bg-amber-500/20"
      case "in-progress":
        return "text-blue-400 bg-blue-500/20"
      case "completed":
        return "text-emerald-400 bg-emerald-500/20"
      case "cancelled":
        return "text-red-400 bg-red-500/20"
      default:
        return "text-gray-400 bg-gray-500/20"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "text-emerald-400 bg-emerald-500/20"
      case "medium":
        return "text-amber-400 bg-amber-500/20"
      case "high":
        return "text-red-400 bg-red-500/20"
      default:
        return "text-gray-400 bg-gray-500/20"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Maintenance Schedule
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Stay informed about planned maintenance windows and system updates across our global infrastructure.
          </p>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              {
                label: "Scheduled",
                count: 2,
                color: "from-amber-400 to-orange-500",
                icon: <Calendar className="w-6 h-6" />,
              },
              {
                label: "In Progress",
                count: 0,
                color: "from-blue-400 to-cyan-500",
                icon: <Settings className="w-6 h-6" />,
              },
              {
                label: "Completed",
                count: 1,
                color: "from-emerald-400 to-green-500",
                icon: <CheckCircle className="w-6 h-6" />,
              },
              {
                label: "Total Servers",
                count: 52,
                color: "from-purple-400 to-pink-500",
                icon: <Server className="w-6 h-6" />,
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-6"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-3 mb-4 mx-auto`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.count}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-gray-900/50 backdrop-blur-md rounded-2xl p-2 border border-gray-700">
            {["all", "singapore", "tokyo", "hong-kong"].map((server) => (
              <button
                key={server}
                onClick={() => setSelectedServer(server)}
                className={`px-6 py-3 rounded-xl font-medium transition-all capitalize ${
                  selectedServer === server
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                {server.replace("-", " ")}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Maintenance Schedule */}
        <div className="space-y-6">
          {scheduledMaintenance.map((maintenance, i) => (
            <motion.div
              key={maintenance.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8 hover:border-amber-400/50 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <Server className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{maintenance.server}</h3>
                      <p className="text-gray-400">{maintenance.type}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{maintenance.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span className="text-gray-300">{maintenance.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span className="text-gray-300">{maintenance.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 lg:flex-col lg:items-end">
                  <div className="flex gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(maintenance.status)}`}
                    >
                      {maintenance.status.replace("-", " ").toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getImpactColor(maintenance.impact)}`}
                    >
                      {maintenance.impact.toUpperCase()} IMPACT
                    </span>
                  </div>

                  {maintenance.status === "scheduled" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium text-sm transition-colors"
                    >
                      Subscribe to Updates
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Schedule New Maintenance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-2xl border border-gray-700 p-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Schedule Maintenance
              </span>
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Need to schedule maintenance for your servers? Our automated system ensures minimal downtime and maximum
              transparency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(245,158,11,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full font-semibold"
              >
                Schedule Maintenance
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-gray-600 rounded-full font-semibold hover:border-amber-400 transition-colors"
              >
                View Guidelines
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            Notification Preferences
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">SMS Alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Push Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Slack Integration</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
