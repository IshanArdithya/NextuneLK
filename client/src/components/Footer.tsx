"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { footerContent, footerLinks } from "@/constants/footer";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12 pb-8 border-b border-border/50 mb-8">
          {/* l: logo & tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {footerContent.logoShort}
                </span>
              </div>
              <span className="font-bold text-lg">
                {footerContent.logoText}
              </span>
            </Link>
            <p className="text-foreground/60 text-sm leading-relaxed">
              {footerContent.tagline}
            </p>
          </motion.div>

          {/* right: quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-8"
          >
            <div>
              <h4 className="font-semibold text-sm mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
                {footerLinks.quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-foreground/50">
            {footerContent.copyright}
          </p>
          <div className="flex gap-6 mt-6 md:mt-0"></div>
        </div>
      </div>
    </footer>
  );
}
