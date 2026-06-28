"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "#pricing" },
  { label: "Setup", href: "/setup" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLightPage = pathname === "/usage" || pathname === "/setup";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle cross-page scrolling (e.g. from /setup to home#pricing)
  useEffect(() => {
    const scrollTo = searchParams.get("scroll");
    if (scrollTo && pathname === "/") {
      const element = document.getElementById(scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
          // Clean up the URL
          window.history.replaceState(null, "", "/");
        }, 100);
      }
    }
  }, [searchParams, pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "/") {
      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      
      if (pathname === "/") {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          // Update URL without hash if possible, or just don't update
        }
      } else {
        router.push(`/?scroll=${targetId}`);
      }
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[#020418] shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-transform group-hover:scale-105">
            <span className="text-base font-extrabold text-white">N</span>
          </div>
          <span className={`text-xl font-bold tracking-tight transition-colors ${
            !scrolled && isLightPage ? "text-[#020418]" : "text-white"
          }`}>
            NextuneLK
          </span>
        </Link>

        {/* Right Side: Links + Button */}
        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`rounded-full px-4 py-2 text-[14px] font-medium transition-all ${
                  !scrolled && isLightPage 
                    ? "text-gray-600 hover:text-[#020418]" 
                    : "text-blue-100/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/usage"
            className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold active:scale-[0.98] transition-transform"
          >
            {/* Animated background */}
            <div className={`absolute inset-0 rounded-full transition-all group-hover:scale-[1.05] ${
              !scrolled && isLightPage
                ? "bg-[#020418] shadow-lg shadow-black/10 group-hover:bg-[#020418]/90"
                : "bg-white shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:bg-gray-50"
            }`} />
            
            <span className={`relative z-10 transition-colors ${
              !scrolled && isLightPage ? "text-white" : "text-[#020418]"
            }`}>
              Check Usage
            </span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`rounded-md p-2 transition-colors ${
              !scrolled && isLightPage ? "text-gray-600 hover:bg-black/5" : "text-blue-100 hover:bg-white/10"
            }`}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-white/10 bg-[#020418] md:hidden"
          >
            <div className="space-y-1 px-6 pb-6 pt-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleNavClick(e, link.href);
                  }}
                  className="block rounded-md px-3 py-3 text-base font-medium text-blue-100/70 hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/usage"
                onClick={() => setMobileOpen(false)}
                className="mt-4 block rounded-lg bg-white px-3 py-3 text-center text-base font-semibold text-[#020418]"
              >
                Check Usage
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
