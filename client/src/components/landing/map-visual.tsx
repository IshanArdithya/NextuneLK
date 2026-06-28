"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function MapVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let globe: any;
    
    if (canvasRef.current) {
      // Singapore coordinates for the marker
      const lat = 1.3521;
      const lng = 103.8198;

      // We center the camera over the Bay of Bengal (near Sri Lanka)
      // This moves Singapore to the bottom-right and keeps Sri Lanka visible!
      const centerLat = 7.0; // Slightly north
      const centerLng = 88.0; // West of Singapore, towards Sri Lanka

      // The official Cobe mathematical formula for centering the camera:
      const focusPhi = Math.PI - ((centerLng * Math.PI) / 180 - Math.PI / 2);
      const focusTheta = (centerLat * Math.PI) / 180;

      const baseSize = 0.05;
      const pulseSpeed = 0.05;
      let t = 0;

      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: 1000,
        height: 1000,
        phi: focusPhi,
        theta: focusTheta,
        dark: 1, 
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.03, 0.05, 0.12], 
        markerColor: [0.1, 0.8, 0.4], // Emerald Green to pop against the blue earth
        glowColor: [0.05, 0.08, 0.15], 
        markers: [
          { location: [lat, lng], size: 0.04, id: 'sg' } 
        ],
      });

      let req: number;
      function animate() {
        globe.update({ phi: focusPhi, theta: focusTheta });
        req = requestAnimationFrame(animate);
      }
      animate();

      return () => {
        cancelAnimationFrame(req);
        if (globe) globe.destroy();
      };
    }
  }, []);

  return (
    <div className="relative w-full aspect-square mx-auto flex items-center justify-center">
      
      {/* Cobe Canvas */}
      <div className="absolute inset-0 flex items-center justify-center scale-[1.1]">
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            contain: "layout paint size",
            opacity: 1,
          }}
        />
      </div>

      {/* Cobe Native Marker Label via CSS Anchor Positioning */}
      <div 
        className="marker-label absolute flex flex-col items-center justify-center pointer-events-none transition-opacity duration-300 z-20"
        style={{
          positionAnchor: "--cobe-sg",
          bottom: "anchor(center)", 
          left: "anchor(center)",
          translate: "-50% -50%", 
          opacity: "var(--cobe-visible-sg, 0)"
        } as React.CSSProperties}
      >
        {/* CSS Ping Animation directly over the marker */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-8 h-8 rounded-full border border-emerald-500/60 animate-ping" style={{ animationDuration: '2.5s' }} />
        </div>

        {/* Floating Text Label below the ping */}
        <div className="absolute top-[100%] mt-5 px-3 py-1 rounded-full bg-[#0a0f2c]/80 backdrop-blur border border-white/10 text-xs font-semibold text-gray-200 shadow-xl whitespace-nowrap">
          Singapore (SG)
        </div>
      </div>

    </div>
  );
}
