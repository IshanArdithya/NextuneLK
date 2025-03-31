"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-gray-900/95 backdrop-blur-md py-2 shadow-xl"
          : "bg-gradient-to-b from-gray-900 to-transparent py-4"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 flex items-center justify-between">
        {/* Logo with glow effect */}
        <Link href="/" className="relative group">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              NEXTT
            </span>
          </div>
        </Link>

        {/* Futuristic navigation with animated underline */}
        <nav className="hidden md:flex items-center space-x-1">
          {[
            { id: "home", name: "Home", path: "/" },
            { id: "usage", name: "Usage", path: "/usage" },
            { id: "test", name: "Test", path: "/test" },
            { id: "features", name: "Features", path: "/features" },
            { id: "contact", name: "Contact", path: "/contact" },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeLink === item.id
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveLink(item.id)}
            >
              {item.name}
              {activeLink === item.id && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* User section with animated avatar */}
        <div className="flex items-center space-x-4">
          <button className="hidden md:block px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/30">
            Get Started
          </button>

          <div className="relative group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer">
              U
            </div>
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-gray-700 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-1">
              <div className="py-1">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Settings
                </Link>
                <Link
                  href="/logout"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Sign out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
