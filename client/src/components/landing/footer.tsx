"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "#pricing" },
      { label: "Setup", href: "/setup" },
      { label: "Usage", href: "/usage" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "WhatsApp", href: "https://wa.me/94771234567" },
      { label: "Contact Us", href: "mailto:support@nextunelk.com" },
      { label: "System Status", href: "/usage" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") || (href.startsWith("/") && href.includes("#"))) {
      const [path, hash] = href.split("#");
      const targetId = hash;
      
      if (pathname === path || (path === "" && pathname === "/") || (path === "/" && pathname === "/")) {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else if (href.includes("#")) {
        e.preventDefault();
        router.push(`${path || "/"}?scroll=${targetId}`);
      }
    }
  };

  return (
    <footer className="border-t border-gray-100 bg-white text-[#01010c]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Link href="/" className="mb-6 flex items-center gap-2 group w-max">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-transform group-hover:scale-105">
                <span className="text-[14px] font-extrabold text-white">
                  N
                </span>
              </div>
              <span className="text-lg font-bold tracking-tight">
                NextuneLK
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              Premium, high-speed VPN infrastructure built for maximum performance and unparalleled privacy.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-6 text-sm font-semibold tracking-wider uppercase text-blue-600">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-base text-gray-600 transition-colors hover:text-[#020418]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} NextuneLK. All rights reserved.
          </p>
          <div className="flex gap-4">
            <p className="text-sm text-gray-400 hover:text-[#01010c] transition-colors cursor-pointer">
              Made in Sri Lanka 🇱🇰
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
