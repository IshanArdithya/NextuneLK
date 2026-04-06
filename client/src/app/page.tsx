"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/header";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/testimonials";
import CTA from "@/components/cta";
import ContactUs from "@/components/contact-us";
import Footer from "@/components/footer";
import { pageVariants } from "@/lib/animation-variants";

export default function Home() {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-background text-foreground"
    >
      <Navigation />
      <Hero />
      <div className="space-y-24 pb-24">
        <Features />
        <Pricing />
        <Testimonials />
        <CTA />
        <ContactUs />
      </div>
      <Footer />
    </motion.main>
  );
}
