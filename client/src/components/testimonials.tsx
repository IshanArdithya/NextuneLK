"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import {
  scrollRevealVariants,
  containerVariants,
  cardVariants,
} from "@/lib/animation-variants";
import {
  testimonialsContent,
  testimonialsList,
} from "@/constants/testimonials";

export default function Testimonials() {
  return (
    <section className="py-20 px-4 bg-background/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={scrollRevealVariants}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {testimonialsContent.title}
          </h2>
          <p className="text-lg text-foreground/60">
            {testimonialsContent.description}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonialsList.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="p-6 rounded-2xl border border-border/50 bg-card hover:border-orange-500/30 transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-orange-500 text-orange-500"
                  />
                ))}
              </div>
              <p className="text-foreground/80 mb-6 leading-relaxed">
                {testimonial.content}
              </p>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-xs text-foreground/60">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
