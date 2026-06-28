"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import SpeedtestWidget from "./speedtest-widget";

const benefits = [
  "10Gbps Up/Down Port Speeds",
  "Optimized for Singapore routing",
  "Zero bandwidth throttling",
  "Secure & Encrypted Connection"
];

export default function Features() {
  return (
    <section id="infrastructure" className="bg-white py-24 md:py-32 text-[#01010c]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[32px] md:text-[48px] font-extrabold leading-[1.05] tracking-tight mb-6">
              High-performance network
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
              We own and operate our premium VPN servers to guarantee ultra-fast speeds and uninterrupted connectivity. Experience true gigabit performance.
            </p>

            <ul className="space-y-4 mb-10">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-blue-600 w-6 h-6 flex-shrink-0" />
                  <span className="text-lg font-medium text-gray-800">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right side: Interactive Speedtest Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-purple-400/20 rounded-[2.5rem] transform rotate-2 scale-[1.02] -z-10 blur-xl" />
            <SpeedtestWidget />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
