"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";

const RADIUS = 85;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Simple custom hook to handle the speedtest animation logic
function useSpeedtest(
  targetMin: number,
  targetMax: number,
  startDelay: number = 0
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const duration = 4000; // 4 seconds to reach initial speed, slower ramp up

    // Start fluctuating after initial ramp up
    let fluctuating = false;
    let currentTarget = targetMin + Math.random() * (targetMax - targetMin);

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < startDelay) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const activeElapsed = elapsed - startDelay;

      if (!fluctuating) {
        // Easing from 0 to currentTarget
        const progress = Math.min(activeElapsed / duration, 1);
        // easeOutQuart for realistic smooth slow down at the end
        const ease = 1 - Math.pow(1 - progress, 4);
        setValue(ease * currentTarget);

        if (progress === 1) {
          fluctuating = true;
        }
      } else {
        // Drift currentTarget even less frequently for very slow bounces
        if (Math.random() < 0.005) { // 0.5% chance per frame to pick new target
          currentTarget =
            targetMin + Math.random() * (targetMax - targetMin);
        }
        
        // Extremely slow interpolation towards currentTarget
        setValue((prev) => {
          const diff = currentTarget - prev;
          return prev + diff * 0.003; // 0.3% interpolation per frame
        });
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [targetMin, targetMax, startDelay]);

  return value;
}

export default function SpeedtestWidget() {
  const downloadSpeed = useSpeedtest(500, 520, 0);
  const uploadSpeed = useSpeedtest(250, 270, 1000); // Start upload a full second after download

  // Calculate percentages
  const downloadPercent = Math.min((downloadSpeed / 700) * 100, 100);
  const uploadPercent = Math.min((uploadSpeed / 400) * 100, 100);

  return (
    <div className="w-full bg-[#020418] rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 min-h-[400px]">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Download Circle */}
      <div className="relative flex flex-col items-center z-10">
        <div className="mb-6 flex items-center gap-2 text-cyan-400 font-semibold tracking-widest uppercase text-sm">
          <ArrowDown size={18} />
          Download
        </div>
        
        <div className="relative flex items-center justify-center">
          <svg className="w-[220px] h-[220px] -rotate-90 transform">
            {/* Background Track */}
            <circle
              cx="110"
              cy="110"
              r={RADIUS}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="6"
              fill="none"
            />
            {/* Progress Stroke */}
            <circle
              cx="110"
              cy="110"
              r={RADIUS}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              style={{
                strokeDasharray: CIRCUMFERENCE,
                strokeDashoffset: CIRCUMFERENCE - (downloadPercent / 100) * CIRCUMFERENCE,
              }}
            />
          </svg>
          
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl md:text-4xl font-black text-white tabular-nums tracking-tighter">
              {downloadSpeed.toFixed(0)}
            </span>
            <span className="text-cyan-400/70 text-xs font-bold mt-1">Mbps</span>
          </div>
        </div>
      </div>

      {/* Upload Circle */}
      <div className="relative flex flex-col items-center z-10">
        <div className="mb-6 flex items-center gap-2 text-purple-400 font-semibold tracking-widest uppercase text-sm">
          <ArrowUp size={18} />
          Upload
        </div>
        
        <div className="relative flex items-center justify-center">
          <svg className="w-[220px] h-[220px] -rotate-90 transform">
            {/* Background Track */}
            <circle
              cx="110"
              cy="110"
              r={RADIUS}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="6"
              fill="none"
            />
            {/* Progress Stroke */}
            <circle
              cx="110"
              cy="110"
              r={RADIUS}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              className="text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]"
              style={{
                strokeDasharray: CIRCUMFERENCE,
                strokeDashoffset: CIRCUMFERENCE - (uploadPercent / 100) * CIRCUMFERENCE,
              }}
            />
          </svg>
          
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl md:text-4xl font-black text-white tabular-nums tracking-tighter">
              {uploadSpeed.toFixed(0)}
            </span>
            <span className="text-purple-400/70 text-xs font-bold mt-1">Mbps</span>
          </div>
        </div>
      </div>

      {/* Fine-print Disclaimer */}
      <div className="absolute bottom-4 left-0 right-0 text-center px-4">
        <p className="text-[10px] text-white/30 font-medium tracking-wide">
          * Server port capacity shown. Actual client speeds may vary based on local ISP limitations.
        </p>
      </div>

    </div>
  );
}
