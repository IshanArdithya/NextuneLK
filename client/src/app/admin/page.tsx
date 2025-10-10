"use client"

import { motion } from "framer-motion"
import { Users, Activity, Server, TrendingUp, Eye, Download, Calendar, BarChart3 } from "lucide-react"
import { useState } from "react"
import { useTheme } from "@/context/ThemeContext"

export default function AdminDashboard() {
  const { theme } = useTheme()
  const [timeRange, setTimeRange] = useState("7d")

  const adminStats = {
    totalUsers: 15847,
    activeUsers: 8923,
    totalServers: 52,
    dataTransferred: 2847.5,
    revenue: 89420,
    newSignups: 234,
  }

  const userBehaviorData = [
    { country: "Sri Lanka", users: 4521, percentage: 28.5, growth: "+12%" },
    { country: "India", users: 3847, percentage: 24.3, growth: "+8%" },
    { country: "Singapore", users: 2156, percentage: 13.6, growth: "+15%" },
    { country: "Malaysia", users: 1923, percentage: 12.1, growth: "+5%" },
    { country: "Thailand", users: 1456, percentage: 9.2, growth: "+18%" },
    { country: "Others", users: 1944, percentage: 12.3, growth: "+7%" },
  ]

  const usagePatterns = [
    { time: "00:00", connections: 1200 },
    { time: "04:00", connections: 800 },
    { time: "08:00", connections: 2400 },
    { time: "12:00", connections: 3200 },
    { time: "16:00", connections: 2800 },
    { time: "20:00", connections: 4100 },
    { time: "24:00", connections: 1800 },
  ]

  const recentActivity = [
    { user: "user_8923", action: "Connected to Singapore #1", time: "2 min ago", status: "success" },
    { user: "user_7456", action: "Payment processed", time: "5 min ago", status: "success" },
    { user: "user_3421", action: "Failed login attempt", time: "8 min ago", status: "warning" },
    { user: "user_9876", action: "Account created", time: "12 min ago", status: "info" },
    { user: "user_5432", action: "Disconnected from Tokyo #2", time: "15 min ago", status: "neutral" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-emerald-400 bg-emerald-500/20"
      case "warning":
        return "text-amber-400 bg-amber-500/20"
      case "info":
        return "text-cyan-400 bg-cyan-500/20"
      default:
        return "text-gray-400 bg-gray-500/20"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
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
              <span className="bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </h1>
            <p className="text-gray-400">Monitor system performance and user analytics</p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          {[
            {
              icon: <Users className="w-6 h-6" />,
              label: "Total Users",
              value: adminStats.totalUsers.toLocaleString(),
              change: "+12%",
              color: "from-blue-400 to-cyan-500",
            },
            {
              icon: <Activity className="w-6 h-6" />,
              label: "Active Users",
              value: adminStats.activeUsers.toLocaleString(),
              change: "+8%",
              color: "from-emerald-400 to-green-500",
            },
            {
              icon: <Server className="w-6 h-6" />,
              label: "Servers",
              value: adminStats.totalServers.toString(),
              change: "+2",
              color: "from-purple-400 to-pink-500",
            },
            {
              icon: <Download className="w-6 h-6" />,
              label: "Data Transfer",
              value: `${adminStats.dataTransferred} TB`,
              change: "+15%",
              color: "from-amber-400 to-orange-500",
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              label: "Revenue",
              value: `$${adminStats.revenue.toLocaleString()}`,
              change: "+23%",
              color: "from-red-400 to-rose-500",
            },
            {
              icon: <Users className="w-6 h-6" />,
              label: "New Signups",
              value: adminStats.newSignups.toString(),
              change: "+18%",
              color: "from-indigo-400 to-purple-500",
            },
          ].map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-6 hover:border-orange-400/50 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} p-3 mb-4`}>
                <div className="text-white">{metric.icon}</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
              <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
              <span className="text-emerald-400 text-xs bg-emerald-500/20 px-2 py-1 rounded-full">{metric.change}</span>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Usage Patterns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Usage Patterns</h2>
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>

            <div className="h-64 flex items-end justify-between gap-2">
              {usagePatterns.map((pattern, i) => {
                const height = (pattern.connections / 4100) * 100
                return (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="bg-gradient-to-t from-orange-500 to-red-500 rounded-t-lg w-full mb-2 min-h-[4px]"
                    />
                    <span className="text-xs text-gray-400">{pattern.time}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* User Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">User Distribution</h2>
              <Eye className="w-6 h-6 text-cyan-400" />
            </div>

            <div className="space-y-4">
              {userBehaviorData.map((country, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-white font-medium w-20">{country.country}</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${country.percentage}%` }}
                        transition={{ delay: i * 0.1 + 0.5, duration: 0.8 }}
                        className="h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className="text-gray-300 text-sm w-16 text-right">{country.users.toLocaleString()}</span>
                    <span className="text-emerald-400 text-xs bg-emerald-500/20 px-2 py-1 rounded-full w-12 text-center">
                      {country.growth}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <Calendar className="w-6 h-6 text-purple-400" />
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.status).split(" ")[1]}`} />
                  <div>
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-gray-400 text-sm">User: {activity.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                  <p className="text-gray-400 text-sm mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
