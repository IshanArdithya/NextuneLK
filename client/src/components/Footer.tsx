'use client'

import { motion } from 'framer-motion'
import { Github, Twitter, Instagram, Youtube } from 'lucide-react'
import Link from 'next/link'
import { themes, type ThemeKey } from '@/lib/themes'
import { useTheme } from '@/context/ThemeContext'
import { type Theme } from '@/lib/themes'


const socialLinks = [
  { icon: <Twitter size={18} />, url: '#' },
  { icon: <Github size={18} />, url: '#' },
  { icon: <Instagram size={18} />, url: '#' },
  { icon: <Youtube size={18} />, url: '#' },
]

export default function Footer({ themeKey = 'teal' }: { themeKey?: ThemeKey }) {

  const { theme } = useTheme()
  const currentTheme = themes[themeKey] || themes.teal

  return (
    <motion.footer
      className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md"
      style={{ borderTop: `1px solid ${theme.border.replace('/30', '/50')}` }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <motion.div
            animate={{ 
              rotate: [0, 0, -0, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 4 
            }}
          >
            <Link href="/" className={`text-xl font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
              NexTuneLK
            </Link>
          </motion.div>

          {/* Social links */}
          <div className="flex gap-4">
            {socialLinks.map((link, i) => (
              <motion.a
                key={i}
                href={link.url}
                target="_blank"
                className={`text-zinc-400 hover:${theme.iconBg} p-2 rounded-full`}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <motion.p 
            className={`text-xs ${theme.primary}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © {new Date().getFullYear()} NexTuneLK. All rights reserved.
          </motion.p>
        </div>
      </div>
    </motion.footer>
  )
}