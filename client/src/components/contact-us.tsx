"use client";

import type React from "react";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { scrollRevealVariants, buttonVariants } from "@/lib/animation-variants";
import { contactContent } from "@/constants/contactus";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactUs() {
  const whatsappLink = `https://wa.me/${
    contactContent.whatsappNumber
  }?text=${encodeURIComponent(contactContent.whatsappMessage)}`;
  const [isCopied, setIsCopied] = useState(false);

  const handleWhatsAppClick = () => {
    window.open(whatsappLink, "_blank");
  };

  const handleEmailClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(contactContent.email);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <section id="contact" className="bg-background/50 py-16 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        {/* divider */}
        <div className="border-t border-gray-200 mb-12" />

        {/* title */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={scrollRevealVariants}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="h-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {contactContent.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {contactContent.description}
          </p>
        </motion.div>

        {/* wa btn */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={scrollRevealVariants}
          transition={{ delay: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center space-y-6"
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleWhatsAppClick}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FaWhatsapp size={20} />
            Chat on WhatsApp
          </motion.button>

          {/* email copy section */}
          <div className="relative">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or email us at{" "}
              <button
                onClick={handleEmailClick}
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors cursor-pointer underline-offset-2 hover:underline"
              >
                {contactContent.email}
              </button>
            </p>

            <AnimatePresence>
              {isCopied && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <div className="text-orange-600 dark:text-orange-400 text-xs font-medium px-2 py-0.5 rounded-md">
                    Copied!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
