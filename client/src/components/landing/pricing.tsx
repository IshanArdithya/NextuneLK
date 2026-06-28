"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import PaymentUnavailableModal from "@/components/payment-unavailable-modal";

const plans = [
  {
    name: "Basic",
    desc: "For individual users",
    price: "250",
    period: "/mo",
    data: "100 GB",
    devices: "1 IP",
    features: [
      "100 GB monthly data",
      "1 Concurrent IP address",
      "Real-time usage tracking",
    ],
    popular: false,
  },
  {
    name: "Pro",
    desc: "For two users",
    price: "500",
    period: "/mo",
    data: "300 GB",
    devices: "2 IPs",
    features: [
      "300 GB monthly data",
      "2 Concurrent IP addresses",
      "Real-time usage tracking",
    ],
    popular: true,
  },
];

export default function Pricing() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section id="pricing" className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <p className="mb-3 text-[13px] font-bold uppercase tracking-widest text-blue-600">
              Pricing
            </p>
            <h2 className="text-[32px] md:text-[48px] font-extrabold tracking-tight text-[#01010c] mb-6">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              No hidden fees. No surprise charges. Pick a plan and go.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className={`relative flex flex-col rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "border-blue-500/30 bg-blue-50 shadow-[0_0_30px_rgba(37,99,235,0.1)]"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg">
                    <Sparkles size={12} />
                    Popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#01010c] mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-500">
                    {plan.desc}
                  </p>
                </div>

                <div className="mb-8 pb-8 border-b border-black/10">
                  <span className="text-sm font-semibold text-gray-500">LKR </span>
                  <span className="text-5xl font-extrabold text-[#01010c] tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm font-semibold text-gray-500">
                    {plan.period}
                  </span>
                </div>

                <ul className="mb-8 flex-1 space-y-4">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-base text-gray-700"
                    >
                      <Check
                        size={18}
                        className="mt-0.5 shrink-0 text-blue-600"
                        strokeWidth={2.5}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setModalOpen(true)}
                  className={`w-full rounded-full py-3.5 text-sm font-bold transition-all ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                      : "bg-gray-100 text-[#01010c] hover:bg-gray-200"
                  }`}
                >
                  Get started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PaymentUnavailableModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onContactSupport={() => {
          setModalOpen(false);
          document
            .getElementById("cta")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </>
  );
}
