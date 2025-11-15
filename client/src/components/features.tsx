"use client";

import { motion } from "framer-motion";
import {
  scrollRevealVariants,
  containerVariants,
  cardVariants,
} from "@/lib/animation-variants";
import { featuresContent, featuresList } from "@/constants/features";

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 bg-background/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={scrollRevealVariants}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {featuresContent.title}
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            {featuresContent.description}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {featuresList.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="p-8 rounded-2xl border border-border/50 bg-card hover:border-orange-500/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center mb-4 group-hover:from-orange-500/40 group-hover:to-orange-600/40 transition-all">
                  <Icon className="text-orange-500" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-foreground/60 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
