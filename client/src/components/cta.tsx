"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lock, Zap, Globe } from "lucide-react";
import {
  listContainerVariants,
  listItemVariants,
  buttonVariants,
} from "@/lib/animation-variants";

export default function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* bg gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-background to-orange-600/10 -z-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -z-10"></div>

          <div className="px-8 py-16 md:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4 mb-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 max-w-2xl mx-auto">
                Join NextuneLK and take control of your connection.
              </h2>
              <p className="text-lg text-foreground/60 mb-8 max-w-xl mx-auto">
                Start your 7-day free trial. No credit card required.
              </p>
            </motion.div>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 inline-flex items-center gap-2 group mb-12"
            >
              Get Nextune VPN →
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </motion.button>

            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={listContainerVariants}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-6 pt-8 border-t border-border/50"
            >
              {[
                { icon: Lock, label: "No Logs" },
                { icon: Zap, label: "99.9% Uptime" },
                { icon: Globe, label: "60+ Locations" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    variants={listItemVariants}
                    className="flex items-center gap-2"
                  >
                    <Icon size={20} className="text-orange-500" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
