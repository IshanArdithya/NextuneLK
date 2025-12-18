"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { Check } from "lucide-react";
import {
  modalVariants,
  overlayVariants,
  listContainerVariants,
  // listItemVariants,
  buttonVariants,
} from "@/lib/animation-variants";

const WHATS_NEW_VERSION_KEY = "whats_new_version";
const CURRENT_WHATS_NEW_VERSION = "0.1";

// const updates = [
//   {
//     icon: "🏠",
//     title: "Added a clean landing page",
//     description: "introducing NextuneLK with modern design and animations.",
//   },
//   {
//     icon: "📊",
//     title: "Improved usage dashboard",
//     description:
//       "now includes usage insights, smoother progress animations, and a full UI remake.",
//   },
//   {
//     icon: "⚙️",
//     title: "Better structure",
//     description:
//       "navigation and setup flow redesigned for a consistent user experience.",
//   },
// ];

export default function WhatsNewModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const seenVersion = localStorage.getItem(WHATS_NEW_VERSION_KEY);

    if (seenVersion !== CURRENT_WHATS_NEW_VERSION) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem(WHATS_NEW_VERSION_KEY, CURRENT_WHATS_NEW_VERSION);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(WHATS_NEW_VERSION_KEY, CURRENT_WHATS_NEW_VERSION);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-[70] p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
            >
              {/* close btn */}
              {/* <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </motion.button> */}

              {/* header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-6"
              >
                <p className="text-sm text-gray-500 mb-2">
                  Version {CURRENT_WHATS_NEW_VERSION}
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  What&apos;s New
                </h2>
              </motion.div>

              {/* intro txt */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="text-gray-600 mb-6 leading-relaxed"
              >
                The previous site was down for a while, so we had to bring up
                this part of the site while the full experience is being built.
              </motion.p>

              <motion.div
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 mb-8"
              >
                {/* {updates.map((update, index) => (
                  <motion.div
                    key={index}
                    variants={listItemVariants}
                    className="flex gap-3"
                  >
                    <span className="text-2xl shrink-0 relative top-1">
                      <Check className="w-4 h-4" />
                    </span>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {update.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {update.description}
                      </p>
                    </div>
                  </motion.div>
                ))} */}
              </motion.div>

              {/* btn */}
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-[#FF6B3D] to-[#FF3B30] text-white font-semibold py-3 px-4 rounded-full transition-all"
              >
                Got it
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
