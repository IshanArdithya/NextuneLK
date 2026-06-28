"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface PaymentUnavailableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContactSupport: () => void;
}

export default function PaymentUnavailableModal({
  isOpen,
  onClose,
  onContactSupport,
}: PaymentUnavailableModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative bg-card border border-border rounded-xl shadow-xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Content */}
            <h2 className="text-xl font-semibold mb-3">
              Online Payment Unavailable
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Our online payment system is currently under maintenance. Please
              contact our support team to get your package set up.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onContactSupport}
                className="flex-1 py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-lg hover:opacity-90 transition-opacity"
              >
                Contact Support
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-border text-foreground font-medium text-sm rounded-lg hover:bg-accent transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
