"use client";

import { motion } from "framer-motion";
import { Shield, Globe, Zap, Activity } from "lucide-react";

const items = [
  { icon: Shield, label: "Secure Connection" },
  { icon: Globe, label: "Premium SG Network" },
  { icon: Zap, label: "Ultra-Low Latency" },
  { icon: Activity, label: "Uncapped Bandwidth" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-white/5 bg-[#020418] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/40"
        >
          Optimized for seamless browsing & gaming
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8"
        >
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 text-white/50 transition-colors hover:text-white/80"
            >
              <item.icon size={24} strokeWidth={1.5} />
              <span className="text-sm font-semibold tracking-wide">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
