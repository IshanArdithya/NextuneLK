'use client'

import { motion } from 'framer-motion'
import { Menu, Shield, Zap, Globe, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { 
    name: 'Features', 
    path: '/features',
    icon: <Zap className="w-4 h-4" />
  },
  { 
    name: 'Servers', 
    path: '/servers',
    icon: <Globe className="w-4 h-4" />
  },
  { 
    name: 'Security', 
    path: '/security',
    icon: <Shield className="w-4 h-4" />
  },
  { 
    name: 'Usage', 
    path: '/usage',
    icon: <Settings className="w-4 h-4" />
  },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800 shadow-lg"
      initial={{ y: -100 }}
      animate={{ 
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo with connection animation */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ 
              opacity: [0.6, 1, 0.6],
              scale: [0.9, 1.1, 0.9]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }}
            className="w-2 h-2 rounded-full bg-teal-400"
          />
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            NexTuneLK
          </Link>
        </motion.div>

        {/* Desktop Nav with connection indicators */}
        <nav className="hidden md:flex gap-2">
          {navItems.map((item) => (
            <motion.div 
              key={item.path}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                href={item.path}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.path 
                    ? 'text-white font-medium bg-zinc-800/50' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
                }`}
              >
                {item.icon}
                {item.name}
                {pathname === item.path && (
                  <motion.div 
                    layoutId="nav-ping"
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teal-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Connection status button */}
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-700 text-sm font-medium"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Connect
        </motion.button>
      </div>
    </motion.header>
  )
}