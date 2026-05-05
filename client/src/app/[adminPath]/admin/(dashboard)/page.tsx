"use client";

import { motion } from "framer-motion";
import { Lock, BarChart3, LineChart, PieChart, Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="relative flex flex-col min-h-[70vh] rounded-2xl overflow-hidden border bg-card/50">
      <div className="absolute inset-0 p-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-[0.15] blur-sm select-none pointer-events-none">
        {/* Top Cards */}
        <div className="h-32 rounded-xl bg-muted border flex items-center justify-center">
          <Activity className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="h-32 rounded-xl bg-muted border flex items-center justify-center">
          <LineChart className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="h-32 rounded-xl bg-muted border flex items-center justify-center">
          <BarChart3 className="h-10 w-10 text-muted-foreground" />
        </div>

        {/* Main Chart Area */}
        <div className="col-span-1 md:col-span-2 h-[300px] rounded-xl bg-muted border flex items-center justify-center relative overflow-hidden">
          {/* Fake lines */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-orange-500/20 to-transparent" />
          <svg viewBox="0 0 100 50" className="w-full h-full opacity-20" preserveAspectRatio="none">
            <polyline points="0,50 20,30 40,40 60,10 80,20 100,5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Side Chart */}
        <div className="col-span-1 h-[300px] rounded-xl bg-muted border flex items-center justify-center">
          <PieChart className="h-20 w-20 text-muted-foreground" />
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[6px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative max-w-md w-full px-8 py-10"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

          <div className="relative rounded-2xl border border-white/10 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-2xl shadow-2xl p-8 flex flex-col items-center text-center">

            <motion.div
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
              className="relative mb-6"
            >
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                <Lock className="h-8 w-8 text-white" />
              </div>

            </motion.div>

            <h1 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-headline)] mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Analytics Engine
            </h1>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              We&apos;re deploying a comprehensive analytics suite. Soon you&apos;ll be able to track real-time bandwidth usage, revenue trends, and client growth all in one place.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border text-xs font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Under Active Development
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
