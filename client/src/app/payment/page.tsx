"use client"

import { motion } from "framer-motion"
import { CreditCard, Shield, Lock, CheckCircle, DollarSign } from "lucide-react"
import { useState } from "react"
import { useTheme } from "@/context/ThemeContext"

export default function PaymentGateway() {
  const { theme } = useTheme()
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState(1)

  const plans = {
    basic: { name: "Basic", price: 9.99, features: ["5 connections", "25+ servers", "Standard support"] },
    pro: { name: "Pro", price: 19.99, features: ["10 connections", "50+ servers", "Priority support", "Ad blocking"] },
    enterprise: {
      name: "Enterprise",
      price: 39.99,
      features: ["Unlimited connections", "All servers", "24/7 support", "Custom configs"],
    },
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsProcessing(false)
    setStep(2)
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl mx-auto px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              Payment Successful!
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Your {plans[selectedPlan as keyof typeof plans].name} plan is now active. Welcome to premium security!
          </p>

          <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Plan:</span>
                <span className="text-white">{plans[selectedPlan as keyof typeof plans].name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white">${plans[selectedPlan as keyof typeof plans].price}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next billing:</span>
                <span className="text-white">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Go to Dashboard
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Secure Payment
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Complete your subscription with our quantum-encrypted payment system
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-emerald-400" />
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan:</span>
                  <span className="text-white font-medium">{plans[selectedPlan as keyof typeof plans].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly:</span>
                  <span className="text-white font-medium">${plans[selectedPlan as keyof typeof plans].price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax:</span>
                  <span className="text-white font-medium">$0.00</span>
                </div>
                <hr className="border-gray-700" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total:</span>
                  <span className="text-emerald-400">${plans[selectedPlan as keyof typeof plans].price}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-white">Included Features:</h3>
                {plans[selectedPlan as keyof typeof plans].features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">30-Day Guarantee</span>
                </div>
                <p className="text-emerald-300 text-sm">Cancel anytime within 30 days for a full refund</p>
              </div>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Lock className="w-6 h-6 text-cyan-400" />
                Payment Details
              </h2>

              {/* Payment Method Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "card", name: "Credit Card", icon: <CreditCard className="w-5 h-5" /> },
                    { id: "paypal", name: "PayPal", icon: <DollarSign className="w-5 h-5" /> },
                    { id: "crypto", name: "Crypto", icon: <Shield className="w-5 h-5" /> },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        paymentMethod === method.id
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      {method.icon}
                      <span className="font-medium">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Form */}
              {paymentMethod === "card" && (
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </form>
              )}

              {/* Security Notice */}
              <div className="mt-8 bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Secure Payment</span>
                </div>
                <p className="text-blue-300 text-sm">
                  Your payment information is encrypted with 256-bit SSL and processed securely
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                onClick={handlePayment}
                disabled={isProcessing}
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                className="w-full mt-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Complete Payment
                    <Lock className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              <p className="text-center text-gray-400 text-sm mt-4">
                By completing this payment, you agree to our{" "}
                <a href="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Terms of Service
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
