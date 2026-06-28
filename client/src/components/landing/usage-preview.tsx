"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Wifi, Activity, Database } from "lucide-react";

export default function UsagePreview() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-primary">
              Usage Dashboard
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Know exactly where your data goes
            </h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted-foreground">
              Real-time bandwidth monitoring. Check your remaining data, upload
              vs download breakdown, and plan expiry — all from one page.
            </p>
            <Link
              href="/usage"
              className="group mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-primary"
            >
              Check your usage
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>

          {/* Right — mock dashboard card (Tailscale-style) */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-medium text-muted-foreground">
                    Account
                  </p>
                  <p className="text-[15px] font-semibold">kasun_perera</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">Data used</span>
                  <span className="font-medium">67.2 / 100 GB</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: "67%" }}
                  />
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    icon: Database,
                    label: "Download",
                    value: "52.1 GB",
                  },
                  {
                    icon: Activity,
                    label: "Upload",
                    value: "15.1 GB",
                  },
                  {
                    icon: Wifi,
                    label: "Remaining",
                    value: "32.8 GB",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-border bg-secondary/40 p-3 text-center"
                  >
                    <s.icon
                      size={16}
                      className="mx-auto mb-1.5 text-muted-foreground"
                    />
                    <p className="text-[14px] font-semibold">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative glow behind card */}
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-primary/3 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
