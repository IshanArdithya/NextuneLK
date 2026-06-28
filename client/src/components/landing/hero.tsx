"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";

export default function Hero() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      
      if (pathname === "/") {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        router.push(`/?scroll=${targetId}`);
      }
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#020418] min-h-screen flex items-center pt-20">
      {/* Background Pattern - Concentric Circles */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="absolute top-1/2 left-[70%] -translate-y-1/2 -translate-x-1/2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/20"
              style={{
                width: `${(i + 1) * 300}px`,
                height: `${(i + 1) * 300}px`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] gap-12 items-center">
          <div>
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-blue-200 backdrop-blur-md"
            >
              Premium Singapore Network &rsaquo;
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-[48px] md:text-[64px] font-extrabold leading-[1.05] tracking-tight text-white mb-6"
            >
              The high-speed VPN <br /> built for everyone.
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 max-w-xl text-[16px] leading-relaxed text-blue-100/70"
            >
              NextuneLK delivers a high-performance connection optimized for low-latency gaming, seamless 4K streaming, and total everyday privacy. Built for users who demand speed.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-6"
            >
              <Link
                href="#infrastructure"
                onClick={(e) => handleNavClick(e, "#infrastructure")}
                className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-[#020418] active:scale-[0.98] transition-transform"
              >
                {/* Animated background */}
                <div className="absolute inset-0 rounded-full bg-white shadow-md transition-all group-hover:scale-[1.04] group-hover:bg-gray-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
                <span className="relative z-10">Get started</span>
              </Link>
              <Link
                href="#pricing"
                onClick={(e) => handleNavClick(e, "#pricing")}
                className="group inline-flex items-center gap-1.5 text-base font-medium text-white transition-colors hover:text-blue-300"
              >
                View pricing
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            {/* Abstract visual right side (like the logo in refweb) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-[400px] h-[400px] flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-[100px]" />
              <div className="relative text-white font-extrabold text-[150px] opacity-90 select-none tracking-tighter">
                NLK
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-blue-100/30 font-bold">Scroll to discover</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-blue-500/50 to-transparent" />
      </motion.div> */}
    </section>
  );
}

