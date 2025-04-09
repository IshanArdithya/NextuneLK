"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

const FrameHeader = () => {
  const [showFrame, setShowFrame] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showFrame && !target.closest(".frame-container") && !isAnimating) {
        setShowFrame(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFrame, isAnimating]);

  const toggleFrame = () => {
    setIsAnimating(true);
    setShowFrame(!showFrame);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <>
      {/* Main Frame Container - Now using transform for smooth sliding */}
      <div
        className={`fixed left-0 right-0 z-50 bg-white border-b-2 border-l-2 border-r-2 border-white frame-container h-[150px] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] transform ${
          showFrame ? "translate-y-0" : "-translate-y-[100px]"
        }`}
      >
        {/* Navigation Content */}
        <div
          className={`px-6 py-4 transition-opacity duration-300 ${
            showFrame
              ? "opacity-100 delay-100"
              : "opacity-0 h-0 overflow-hidden"
          }`}
        >
          <nav className="hidden md:flex w-full">
            {[
              { id: "home", heading: "Home", title: "Landing", active: true },
              { id: "usage", heading: "Usage", title: "Data Usage" },
              { id: "about", heading: "About Us", title: "How are we?" },
              { id: "contact", heading: "Contact", title: "Contact Info" },
            ].map((item) => (
              <Link
                key={item.id}
                href={`/${item.id}`}
                className="flex flex-col space-y-1 flex-1 text-center px-4 py-2"
              >
                <span
                  className={`text-lg font-medium ${
                    item.active ? "text-orange-600" : "text-black"
                  }`}
                >
                  {item.heading}
                </span>
                <span
                  className={`text-lg font-medium ${
                    item.active ? "text-black" : "text-gray-500"
                  }`}
                >
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Menu Button - Fixed at what appears to be the bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center py-2">
          <button
            onClick={toggleFrame}
            className="flex items-center justify-center w-8 h-8 focus:outline-none transition-transform duration-500 hover:scale-110"
          >
            <Menu
              className={`w-6 h-6 transition-transform duration-500 ${
                showFrame ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Left Frame */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-5 bg-white z-40 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          showFrame ? "translate-x-0" : "-translate-x-full"
        }`}
      />

      {/* Right Frame */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-5 bg-white z-40 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          showFrame ? "translate-x-0" : "translate-x-full"
        }`}
      />

      {/* Bottom Frame */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-5 bg-white z-40 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          showFrame ? "translate-y-0" : "translate-y-full"
        }`}
      />
    </>
  );
};

export default FrameHeader;
