"use client"

import { motion } from "framer-motion"
import { Activity, Server, Globe, Zap, TrendingUp, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "@/context/ThemeContext"

export default function Performance() {
  const { theme } = useTheme()
  const [realTimeData, setRealTimeData] = useState({
    globalUptime: 99.99,
    activeServers: 52,
    totalConnections: 15847,
    avgLatency: 4.2,
    bandwidth: 8.7,
    lastUpdate: new Date(),
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        totalConnections: prev.totalConnections + Math.floor(Math.random() * 10) - 5,
        avgLatency: Math.max(1, prev.avgLatency + (Math.random() - 0.5) * 0.5),
        bandwidth: Math.max(5, Math.min(10, prev.bandwidth + (Math.random() - 0.5) * 0.3)),
        lastUpdate: new Date(),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const servers = [
    { location: "Singapore", status: "online", uptime: 99.99, load: 23, ping: 3 },
    { location: "Tokyo", status: "online", uptime: 99.97, load: 45, ping: 12 },
    { location: "Hong Kong", status: "online", uptime: 99.98, load: 67, ping: 8 },
    { location: "Sydney", status: "online", uptime: 99.95, load: 34, ping: 15 },
    { location: "Mumbai", status: "online", uptime: 99.96, load: 56, ping: 18 },
    { location: "Bangkok", status: "maintenance", uptime: 0, load: 0, ping: 0 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-emerald-400"
      case "maintenance":
        return "text-amber-400"
      case "offline":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getLoadColor = (load: number) => {
    if (load < 30) return "from-emerald-500 to-green-500"
    if (load < 70) return "from-amber-500 to-orange-500"
    return "from-red-500 to-rose-500"
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Live Performance
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Real-time monitoring of our global infrastructure. See exactly why we deliver the fastest, most reliable VPN
            service.
          </p>

          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-emerald-400">
              Last updated: {realTimeData.lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </motion.div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: <Activity className="w-8 h-8" />,
              label: "Global Uptime",
              value: `${realTimeData.globalUptime}%`,
              color: "from-emerald-400 to-green-500",
              trend: "+0.01%",
            },
            {
              icon: <Server className="w-8 h-8" />,
              label: "Active Servers",
              value: realTimeData.activeServers.toString(),
              color: "from-cyan-400 to-blue-500",
              trend: "+2",
            },
            {
              icon: <Globe className="w-8 h-8" />,
              label: "Active Connections",
              value: realTimeData.totalConnections.toLocaleString(),
              color: "from-purple-400 to-pink-500",
              trend: "+127",
            },
            {
              icon: <Zap className="w-8 h-8" />,
              label: "Avg Latency",
              value: `${realTimeData.avgLatency.toFixed(1)}ms`,
              color: "from-amber-400 to-orange-500",
              trend: "-0.3ms",
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

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">{stat.trend}</span>
              </div>

              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Server Status Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Server Network Status
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gray-900/50 backdrop-blur-md rounded-2xl border p-6 transition-all hover:scale-105 ${
                  server.status === "online"
                    ? "border-emerald-500/30 hover:border-emerald-500/50"
                    : server.status === "maintenance"
                      ? "border-amber-500/30 hover:border-amber-500/50"
                      : "border-red-500/30 hover:border-red-500/50"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{server.location}</h3>
                  <div className={`flex items-center gap-2 ${getStatusColor(server.status)}`}>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        server.status === "online"
                          ? "bg-emerald-400 animate-pulse"
                          : server.status === "maintenance"
                            ? "bg-amber-400"
                            : "bg-red-400"
                      }`}
                    />
                    <span className="text-sm font-medium capitalize">{server.status}</span>
                  </div>
                </div>

                {server.status !== "maintenance" ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Uptime</span>
                        <span className="text-white font-medium">{server.uptime}%</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Load</span>
                        <span className="text-white font-medium">{server.load}%</span>
                      </div>

                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${getLoadColor(server.load)} transition-all duration-1000`}
                          style={{ width: `${server.load}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Ping</span>
                        <span className="text-white font-medium">{server.ping}ms</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 text-amber-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">Scheduled maintenance in progress</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8 mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Bandwidth Usage
              </span>
            </h2>
            <div className="flex items-center gap-2 text-cyan-400">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Real-time data</span>
            </div>
          </div>

          <div className="h-64 bg-gray-800/50 rounded-xl p-6 flex items-end justify-between gap-2">
            {Array.from({ length: 24 }, (_, i) => {
              const height = Math.random() * 80 + 20
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="bg-gradient-to-t from-cyan-500 to-purple-600 rounded-t-sm flex-1 min-w-0"
                  style={{ maxWidth: "20px" }}
                />
              )
            })}
          </div>

          <div className="flex justify-between text-gray-400 text-sm mt-4">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </motion.div>

        {/* Status Legend */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-8 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 px-8 py-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full" />
              <span className="text-sm text-gray-300">Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <span className="text-sm text-gray-300">Offline</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
