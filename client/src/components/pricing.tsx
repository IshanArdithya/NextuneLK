"use client";

import { motion } from "framer-motion";
import { Check, Database, Users } from "lucide-react";
import { useState } from "react";
import PaymentUnavailableModal from "./payment-unavailable-modal";
import {
  scrollRevealVariants,
  containerVariants,
  cardVariants,
  buttonVariants,
} from "@/lib/animation-variants";
import { pricingContent, pricingPlans } from "@/constants/pricing";

export default function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetStartedClick = () => {
    setIsModalOpen(true);
  };

  const handleContactSupport = () => {
    setIsModalOpen(false);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section id="pricing" className="py-20 px-4 bg-background/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={scrollRevealVariants}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {pricingContent.title}
            </h2>
            <p className="text-lg text-foreground/60">
              {pricingContent.description}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className={`relative rounded-2xl border transition-all duration-300 p-8 ${
                  plan.highlighted
                    ? "border-orange-500 bg-card shadow-lg"
                    : "border-border/50 bg-card shadow-lg"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-500">
                    {plan.subtitle}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-200">
                      LKR {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      /month
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-8 pb-8 border-b border-gray-200">
                  <div className="flex gap-2 text-sm items-center text-gray-700 dark:text-gray-400">
                    <Database className="w-4 h-4" />
                    <span>{plan.dataLimit}</span>
                  </div>
                  <div className="flex gap-2 text-sm items-center text-gray-700 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{plan.users}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex gap-3">
                      <Check
                        size={20}
                        className="text-orange-500 flex-shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-400">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleGetStartedClick}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/30"
                      : "border border-gray-300 text-gray-900 bg-white hover:bg-gray-50"
                  }`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <PaymentUnavailableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onContactSupport={handleContactSupport}
      />
    </>
  );
}
