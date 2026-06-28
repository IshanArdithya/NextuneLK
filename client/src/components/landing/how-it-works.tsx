"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the map component with SSR disabled to prevent Leaflet window errors
const MapVisual = dynamic(() => import("./map-visual"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-[500px] aspect-square rounded-[2.5rem] bg-[#020418] animate-pulse flex items-center justify-center border border-white/10">
      <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
    </div>
  ),
});

export default function HowItWorks() {
  return (
    <section className="bg-white py-12 md:py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="bg-[#020418] border border-blue-500/10 rounded-[2.5rem] lg:rounded-[3.5rem] p-8 md:p-16 lg:p-24 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center min-h-[600px]">

          {/* Subtle background glow inside card */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Left side text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 z-10 relative pb-[400px] lg:pb-0" // Add bottom padding on mobile to make room for absolute globe
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-300 backdrop-blur-sm">
              Nextune's Vision
            </div>

            <h2 className="text-[32px] md:text-[48px] font-bold leading-[1.1] tracking-tight text-white mb-8">
              Built for performance. <br />
              <span className="text-gray-400">Perfect for everyone.</span>
            </h2>

            <p className="text-lg text-blue-100/70 mb-10 max-w-lg leading-relaxed">
              We focus exclusively on high-performance Singapore infrastructure.
              By optimizing for low-latency and unrestricted throughput, we provide the ultimate edge for gaming, streaming, and seamless browsing.
            </p>

            <ul className="space-y-5">
              {[
                "Built for gaming, streaming & everyday browsing",
                "Bypass regional blocks effortlessly",
                "Low latency for competitive gaming",
                "Streaming without throttling"
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mt-0.5">
                    <Check size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-[17px] font-medium text-gray-200">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right side: Absolute Interactive map overflowing bottom-right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="absolute -bottom-[15%] -right-[15%] lg:-bottom-[20%] lg:-right-[10%] w-[600px] lg:w-[750px] aspect-square z-0 pointer-events-none"
          >
            <MapVisual />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
