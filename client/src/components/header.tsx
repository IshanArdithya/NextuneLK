"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buttonVariants } from "@/lib/animation-variants";
import { ThemeToggle } from "./theme-toggle";
import { navLinks, headerContent } from "@/constants/header";

const ComingSoonWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`group relative cursor-not-allowed ${className || ""}`}>
    <div className="opacity-50 pointer-events-none">{children}</div>
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block whitespace-nowrap z-50">
      <div className="bg-foreground text-background text-xs px-2 py-1 rounded shadow-lg">
        Coming Soon
      </div>
      <div className="w-2 h-2 bg-foreground rotate-45 absolute -top-1 left-1/2 -translate-x-1/2"></div>
    </div>
  </div>
);

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" as const },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: "easeIn" as const },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* logo */}
          <ComingSoonWrapper>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">

                </span>
              </div>
              <span className="font-bold text-lg">
                {headerContent.logoText}
              </span>
            </Link>
          </ComingSoonWrapper>

          {/* desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => {
              const isUsage = link.label === "Usage";
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  {isUsage ? (
                    <Link
                      href={link.href}
                      className="text-sm hover:text-orange-500 transition-colors font-medium border-b-2 border-orange-500"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <ComingSoonWrapper>
                      <span className="text-sm font-medium">{link.label}</span>
                    </ComingSoonWrapper>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* r: theme toggle*/}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <ComingSoonWrapper>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
              >
                {headerContent.buttonLabel}
              </motion.button>
            </ComingSoonWrapper>
          </div>

          {/* mobile menu btn */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <ComingSoonWrapper>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </ComingSoonWrapper>
          </div>
        </div>

        {/* mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden"
            >
              <div className="pb-4 space-y-3">
                {navLinks.map((link) => {
                  const isUsage = link.label === "Usage";
                  return (
                    <motion.div
                      key={link.href}
                      variants={linkVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {isUsage ? (
                        <Link
                          href={link.href}
                          className="block text-sm py-2 hover:text-orange-500 transition-colors font-medium text-orange-500"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <ComingSoonWrapper className="block py-2">
                          <span className="text-sm font-medium">
                            {link.label}
                          </span>
                        </ComingSoonWrapper>
                      )}
                    </motion.div>
                  );
                })}
                <ComingSoonWrapper className="w-full mt-2">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                  >
                    {headerContent.buttonLabel}
                  </motion.button>
                </ComingSoonWrapper>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
