"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function CTA() {
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

  const whatsappLink = `https://wa.me/94771234567?text=${encodeURIComponent(
    "Hi NextuneLK! I'd like to get started."
  )}`;

  return (
    <section id="cta" className="bg-white py-24 md:py-32 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="bg-[#020418] border border-blue-500/10 rounded-[2.5rem] lg:rounded-[3.5rem] p-12 md:p-24 lg:p-32 shadow-2xl relative overflow-hidden text-center">
          
          {/* Background glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[300px] bg-blue-600/10 rounded-[100%] blur-[120px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <h2 className="text-[32px] md:text-[48px] font-extrabold tracking-tighter text-white leading-none mb-6">
              Let's connect.
            </h2>
            <p className="text-lg md:text-xl text-blue-100/70 max-w-xl mx-auto mb-10">
              Reach out for more info or to purchase a plan.
            </p>
            
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="#pricing"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-[#020418] active:scale-[0.98] transition-transform"
              >
                {/* Animated background */}
                <div className="absolute inset-0 rounded-full bg-white shadow-md transition-all group-hover:scale-[1.04] group-hover:bg-gray-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
                
                <span className="relative z-10 flex items-center gap-2">
                  Get started now
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <FaWhatsapp size={16} className="text-emerald-400" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
