"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// temp redirect all 404s to /usage
export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/usage");
  }, [router]);

  return null;
}

/*
"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function NotFoundOriginal() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  }

  const dotVariants = {
    pulse: {
      opacity: [1, 0.5, 1],
      transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
    },
  }

  // network dots background pattern
  const dots = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }))

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden bg-gradient-to-br from-[#FFF8F6] via-[#FAFBFC] to-[#F9FAFB] dark:from-[#0F172A] dark:via-[#1A1F35] dark:to-[#1E293B]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {dots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full bg-orange-accent/20 dark:bg-orange-accent-dark/30"
            style={{
              width: dot.size,
              height: dot.size,
              left: `${dot.x}%`,
              top: `${dot.y}%`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: dot.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#FF6B3D] to-[#FF3B30] bg-clip-text text-transparent">
            Connection Lost
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-300">Page Not Found</p>

          <motion.div className="flex justify-center pt-2" variants={dotVariants} animate="pulse">
            <div className="w-2 h-2 bg-orange-accent dark:bg-orange-accent-dark rounded-full shadow-lg shadow-orange-accent/50 dark:shadow-orange-accent-dark/50" />
          </motion.div>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto leading-relaxed"
        >
          Looks like this route doesn't exist. Let's get you back on track.
        </motion.p>

        <motion.svg
          variants={itemVariants}
          className="w-32 h-32 opacity-60 dark:opacity-40"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 50 L40 50 M60 50 L80 50"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-orange-accent dark:text-orange-accent-dark"
          />
          <circle
            cx="40"
            cy="50"
            r="3"
            fill="currentColor"
            className="text-orange-accent dark:text-orange-accent-dark"
          />
          <circle
            cx="60"
            cy="50"
            r="3"
            fill="currentColor"
            className="text-orange-accent dark:text-orange-accent-dark"
          />
          <path
            d="M35 35 L45 35 M45 35 L50 40 M50 40 L45 45 M45 45 L35 45 M35 45 L35 35"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-600"
            opacity="0.5"
          />
          <path
            d="M55 55 L65 55 M65 55 L70 60 M70 60 L65 65 M65 65 L55 65 M55 65 L55 55"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-600"
            opacity="0.5"
          />
        </motion.svg>

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 mt-4">
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#FF6B3D] to-[#FF3B30] text-white rounded-full px-8 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Go Home
            </Link>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/usage"
              className="inline-flex items-center justify-center border-2 border-[#FF6B3D] text-[#FF6B3D] dark:text-orange-accent rounded-full px-8 py-3 font-medium hover:bg-[#FFF3EE] dark:hover:bg-orange-accent/10 transition-all duration-200"
            >
              Check Usage
            </Link>
          </motion.div>
        </motion.div>

        <motion.p
          variants={itemVariants}
          transition={{ delay: 0.5 }}
          className="text-gray-400 dark:text-gray-500 italic text-sm mt-6"
        >
          Maybe you just took a wrong tunnel?
        </motion.p>
      </motion.div>
    </div>
  )
}
*/
