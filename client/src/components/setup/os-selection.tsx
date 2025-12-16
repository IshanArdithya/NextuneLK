"use client"

import { motion } from "framer-motion"
import { Monitor, Smartphone } from "lucide-react"

interface OSSelectionProps {
  onOSSelect: (os: string) => void
}

const osOptions = [
  {
    id: "windows",
    name: "Windows",
    icon: Monitor,
    description: "Setup VPN on Windows",
  },
  {
    id: "android",
    name: "Android",
    icon: Smartphone,
    description: "Setup VPN on Android",
  },
  {
    id: "ios",
    name: "iOS",
    icon: Smartphone,
    description: "Setup VPN on iPhone",
  },
]

export default function OSSelection({ onOSSelect }: OSSelectionProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {osOptions.map((option, index) => {
        const Icon = option.icon
        return (
          <motion.button
            key={option.id}
            onClick={() => onOSSelect(option.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="p-8 rounded-2xl bg-white border border-border shadow-md hover:shadow-lg hover:border-orange-500/30 transition-all text-left group"
          >
            <Icon className="w-12 h-12 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">{option.name}</h3>
            <p className="text-sm text-muted-foreground">{option.description}</p>
          </motion.button>
        )
      })}
    </div>
  )
}
