"use client"

import { motion } from "framer-motion"
import { Check, Star, Zap, Shield, Globe, Crown } from "lucide-react"
import { useState } from "react"
import { useTheme } from "@/context/ThemeContext"
import Link from "next/link"

export default function Pricing() {
  const { theme } = useTheme()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const plans = [
    {
      name: "Basic",
      description: "Perfect for casual browsing",
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      icon: <Shield className="w-8 h-8" />,
      color: "from-blue-400 to-cyan-500",
      features: [
        "5 simultaneous connections",
        "25+ server locations",
        "Standard encryption",
        "Email support",
        "No bandwidth limits",
        "Kill switch protection",
      ],
      popular: false,
    },
    {
      name: "Pro",
      description: "Most popular choice",
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      icon: <Zap className="w-8 h-8" />,
      color: "from-purple-400 to-pink-500",
      features: [
        "10 simultaneous connections",
        "50+ server locations",
        "Military-grade encryption",
        "Priority support",
        "No bandwidth limits",
        "Advanced kill switch",
        "Ad & malware blocking",
        "Streaming optimization",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For teams and businesses",
      monthlyPrice: 39.99,
      yearlyPrice: 399.99,
      icon: <Crown className="w-8 h-8" />,
      color: "from-emerald-400 to-teal-500",
      features: [
        "Unlimited connections",
        "All server locations",
        "Quantum-grade encryption",
        "24/7 dedicated support",
        "No bandwidth limits",
        "Advanced security suite",
        "Team management",
        "Custom configurations",
        "SLA guarantee",
        "Dedicated servers",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white py-20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Quantum Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Choose the perfect plan for your digital freedom. All plans include our quantum-grade security and unlimited
            bandwidth.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-900/50 backdrop-blur-md rounded-full p-2 border border-gray-700">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-3 rounded-full font-medium transition-all relative ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-xs px-2 py-1 rounded-full">Save 20%</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative p-8 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
                plan.popular
                  ? "border-purple-500/50 bg-purple-500/10 scale-105"
                  : "border-gray-700 bg-gray-900/50 hover:border-cyan-400/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plan.color} p-4 mb-6`}>
                <div className="text-white">{plan.icon}</div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-6">{plan.description}</p>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">
                    ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-gray-400">/{billingCycle === "monthly" ? "month" : "year"}</span>
                </div>
                {billingCycle === "yearly" && (
                  <p className="text-sm text-emerald-400 mt-2">
                    Save ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(2)} per year
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 rounded-full font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25"
                      : "border border-gray-600 text-white hover:border-cyan-400 hover:bg-cyan-400/10"
                  }`}
                >
                  {plan.popular ? "Start Free Trial" : "Choose Plan"}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              All Plans Include
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="w-6 h-6" />, title: "Zero-Log Policy", desc: "Complete privacy" },
              { icon: <Zap className="w-6 h-6" />, title: "Unlimited Speed", desc: "10Gbps bandwidth" },
              { icon: <Globe className="w-6 h-6" />, title: "Global Access", desc: "50+ countries" },
              { icon: <Crown className="w-6 h-6" />, title: "30-Day Guarantee", desc: "Risk-free trial" },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg p-3 mx-auto mb-4">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold mb-8">
            Questions? <span className="text-cyan-400">We're here to help</span>
          </h2>
          <p className="text-gray-300 mb-8">Contact our 24/7 support team for any questions about our plans</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
