"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Kasun P.",
    handle: "@kasun_dev",
    text: "Ping stays low even during peak hours. Best VPN I've used for online gaming in Sri Lanka. Setup took 2 minutes.",
  },
  {
    name: "Dilshan F.",
    handle: "@dilshan_lk",
    text: "Reliable connection for video calls and file transfers. Haven't had a single dropout in months. Worth every rupee.",
  },
  {
    name: "Amaya S.",
    handle: "@amaya_s",
    text: "Simple to set up, affordable, and the usage tracking page is super helpful for managing my data. Love it.",
  },
  {
    name: "Nuwan R.",
    handle: "@nuwan_r",
    text: "Switched from another VPN that kept disconnecting. NextuneLK has been rock solid for 3 months straight.",
  },
  {
    name: "Tharushi M.",
    handle: "@tharushi_m",
    text: "The Pro plan is perfect for me and my brother. Two devices, plenty of data, and the speed is great for streaming.",
  },
  {
    name: "Ravindu J.",
    handle: "@ravindu_j",
    text: "Finally a VPN that just works. No complicated setup, no random drops. Exactly what I needed for WFH.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-primary">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Loved by users across Sri Lanka
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
            Don&apos;t just take our word for it.
          </p>
        </motion.div>

        {/* Masonry-style grid — Tailscale tweet wall inspired */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.handle}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="mb-4 break-inside-avoid rounded-xl border border-border bg-card p-5"
            >
              <p className="mb-4 text-[14px] leading-relaxed text-foreground/90">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[13px] font-medium leading-none">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.handle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
