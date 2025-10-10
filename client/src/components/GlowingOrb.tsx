"use client"

import { motion } from "framer-motion"

export default function GlowingOrb() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main central orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-cyan-500/30 via-purple-500/20 to-transparent rounded-full blur-3xl"
      />

      {/* Floating orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, 0],
            scale: [0.5, 1, 0.5],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 2,
          }}
          className={`absolute w-32 h-32 rounded-full blur-2xl ${
            i % 3 === 0 ? "bg-cyan-500/20" : i % 3 === 1 ? "bg-purple-500/20" : "bg-pink-500/20"
          }`}
          style={{
            left: `${20 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
        />
      ))}
    </div>
  )
}
