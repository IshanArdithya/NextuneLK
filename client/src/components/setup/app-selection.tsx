"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

interface AppSelectionProps {
  os: string
  onAppSelect: (app: string) => void
  onBack: () => void
}

const appsByOS: Record<string, Array<{ id: string; name: string; description: string }>> = {
  windows: [
    { id: "netmod-client", name: "NetMod Client", description: "Official NextuneLK VPN client for Windows" },
    { id: "netch", name: "Netch", description: "Popular open-source VPN client" },
  ],
  android: [
    { id: "netmod-android", name: "NetMod Android", description: "Official NextuneLK VPN app for Android" },
    { id: "v2rayng", name: "V2RayNG", description: "V2Ray client for Android devices" },
  ],
  ios: [{ id: "v2box", name: "V2Box", description: "V2Ray client for iPhone and iPad" }],
}

export default function AppSelection({ os, onAppSelect, onBack }: AppSelectionProps) {
  const apps = appsByOS[os] || []
  const osName = os.charAt(0).toUpperCase() + os.slice(1)

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back</span>
      </button>

      <h2 className="text-3xl font-bold mb-2">Available Apps for {osName}</h2>
      <p className="text-muted-foreground mb-8">Choose an app to view the setup guide</p>

      <div className="grid md:grid-cols-2 gap-6">
        {apps.map((app, index) => (
          <motion.button
            key={app.id}
            onClick={() => onAppSelect(app.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl bg-white border border-border shadow-md hover:shadow-lg hover:border-orange-500/30 transition-all text-left group"
          >
            <h3 className="text-xl font-bold mb-2">{app.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{app.description}</p>
            <span className="inline-flex items-center gap-2 text-orange-500 group-hover:translate-x-1 transition-transform">
              View Setup Guide →
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
