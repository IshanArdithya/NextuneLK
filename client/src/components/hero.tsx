"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  containerVariants,
  itemVariants,
  buttonVariants,
} from "@/lib/animation-variants";
import { heroContent, heroStats } from "@/constants/hero";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
    >
      {/* animated bg gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 text-center md:text-left"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
              {heroContent.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                {heroContent.highlight}
              </span>{" "}
              {heroContent.suffix}
            </h1>

            <p className="text-lg text-foreground/70 max-w-lg leading-relaxed mx-auto md:mx-0">
              {heroContent.description}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-8 py-3 rounded-lg border border-border bg-background hover:bg-background/80 font-semibold transition-all duration-300"
            >
              View Pricing
            </motion.button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex gap-8 pt-4 justify-center md:justify-start"
          >
            {heroStats.map((stat, index) => (
              <div key={index}>
                <p className="text-sm font-semibold text-orange-500">
                  {stat.value}
                </p>
                <p className="text-xs text-foreground/60">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-96 md:h-full min-h-96"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-transparent rounded-2xl backdrop-blur-sm border border-border/50"></div>
          <div className="absolute inset-4 bg-gradient-to-br from-orange-500/10 to-transparent rounded-xl"></div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-64 h-64 border border-orange-500/30 rounded-full"></div>
          </motion.div>

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-48 h-48 border border-orange-500/20 rounded-full"></div>
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full opacity-80"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
