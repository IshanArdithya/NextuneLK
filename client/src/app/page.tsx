"use client";

import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import TrustBar from "@/components/landing/trust-bar";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import Pricing from "@/components/landing/pricing";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#020418] selection:bg-blue-500/20">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <div id="vision"><HowItWorks /></div>
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
