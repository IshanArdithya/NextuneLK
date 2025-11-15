"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/header";
import Hero from "@/components/hero";
import Features from "@/components/features";
// import ProductSection from "@/components/product-section";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/testimonials";
// import CTA from "@/components/cta";
import Footer from "@/components/footer";
import ContactUs from "@/components/contact-us";
import { pageVariants } from "@/lib/animation-variants";

export default function Home() {
  return (
    <motion.main
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      className="bg-background text-foreground"
    >
      <Navigation />
      <Hero />
      <Features />
      {/* <ProductSection /> */}
      <Pricing />
      <Testimonials />
      {/* <CTA /> */}
      <ContactUs />
      <Footer />
    </motion.main>
  );
}
