"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Navigation from "@/components/header";
import Footer from "@/components/footer";
import { setupData } from "@/data/setup-guides";
import { Monitor, Smartphone, Apple, ArrowRight, Terminal, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

const iconMap = {
  windows: Monitor,
  android: Smartphone,
  apple: Apple,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function SetupPage() {
  const [detectedOS, setDetectedOS] = useState<string>("windows");

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    let os = "windows";
    if (userAgent.indexOf("win") !== -1) os = "windows";
    else if (userAgent.indexOf("mac") !== -1 && userAgent.indexOf("iphone") === -1 && userAgent.indexOf("ipad") === -1) os = "macos";
    else if (userAgent.indexOf("linux") !== -1) os = "linux";
    else if (userAgent.indexOf("iphone") !== -1 || userAgent.indexOf("ipad") !== -1) os = "ios";
    else if (userAgent.indexOf("android") !== -1) os = "android";
    setDetectedOS(os);
  }, []);

  const featuredOS = setupData.find(os => os.id === detectedOS) || setupData[0];
  const otherOS = setupData.filter(os => os.id !== featuredOS.id);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0c] flex flex-col">
      <Navigation />

      <main className="grow pt-32 pb-20 relative overflow-hidden">
        {/* bg accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full -ml-48 -mb-48 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
            <header className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
                  Connect Your <span className="text-orange-500">Universe.</span>
                </h1>

                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                  Get started with our high-performance nodes, optimized for your {featuredOS.name} device. Secure every connection with ease.
                </p>
              </motion.div>
            </header>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch"
          >
            {/* featured OS Card */}
            <motion.div variants={itemVariants} className="md:col-span-8">
              <Link href={`/setup/${featuredOS.id}`} className="group block relative h-full">
                <div className="relative h-full p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-orange-500/50 shadow-2xl shadow-orange-500/10 hover:border-orange-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />

                  <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center group-hover:bg-linear-to-br group-hover:from-orange-500 group-hover:to-amber-500 transition-all duration-500 shrink-0">
                        {(() => {
                          const Icon = (featuredOS.id === 'windows' || featuredOS.id === 'linux' ? Monitor : featuredOS.id === 'macos' ? Apple : Smartphone);
                          return <Icon size={32} className="text-orange-500 group-hover:text-white transition-colors" />;
                        })()}
                      </div>
                      <h2 className="text-3xl font-bold font-display dark:text-white group-hover:text-orange-500 transition-colors tracking-tight">{featuredOS.name}</h2>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 whitespace-nowrap shrink-0">
                      <ShieldCheck size={10} />
                      <span>Best for you</span>
                    </div>
                  </div>

                  <div className="grow">
                    <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed text-base mb-8">
                      {featuredOS.id === 'windows' && "Enterprise-grade security with advanced kill-switch and gaming optimization."}
                      {featuredOS.id === 'macos' && "Native performance for Apple Silicon and Intel Macs with one-click connect."}
                      {featuredOS.id === 'linux' && "High-performance CLI tools optimized for Debian, Ubuntu, and Arch distributions."}
                      {featuredOS.id === 'android' && "Secure mobile browsing with battery-saving protocols for all Android devices."}
                      {featuredOS.id === 'ios' && "One-tap security and seamless integration for your iPhone and iPad ecosystem."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-orange-500 font-bold group/btn mt-8 text-base">
                    <span>Setup {featuredOS.name}</span>
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Other OS Cards */}
            {otherOS.map((os) => {
              const Icon = (os.id === 'windows' || os.id === 'linux' ? Monitor : os.id === 'macos' ? Apple : Smartphone);
              return (
                <motion.div key={os.id} variants={itemVariants} className="md:col-span-4">
                  <Link href={`/setup/${os.id}`} className="group block relative h-full">
                    <div className="relative h-full p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-orange-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col justify-between">
                      <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />

                      <div className="flex flex-col gap-6">
                        <div className="w-14 h-14 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-linear-to-br group-hover:from-orange-500 group-hover:to-amber-500 transition-all duration-500">
                          <Icon size={24} className="text-slate-500 dark:text-slate-400 group-hover:text-white transition-colors" />
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold font-display mb-2 dark:text-white group-hover:text-orange-500 transition-colors">{os.name}</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                            {os.id === 'windows' && "Advanced VPN tools for PC."}
                            {os.id === 'macos' && "Native Mac security."}
                            {os.id === 'linux' && "CLI-based power tools."}
                            {os.id === 'android' && "Secure mobile browsing."}
                            {os.id === 'ios' && "iPhone & iPad security."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-orange-500 font-bold text-base group/btn mt-6">
                        <span>Setup</span>
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
