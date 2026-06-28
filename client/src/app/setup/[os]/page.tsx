"use client";

import { motion, Variants } from "framer-motion";
import Navigation from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { setupData } from "@/data/setup-guides";
import { ArrowLeft, ArrowRight, ChevronRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function OSPage() {
  const params = useParams();
  const osId = params.os as string;
  const os = setupData.find((o) => o.id === osId);

  if (!os) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0c] flex flex-col">
      <Navigation />

      <main className="grow pt-32 pb-20 relative overflow-hidden">
        {/* bg accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full -ml-48 -mb-48 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10">
              <Link href="/setup" className="hover:text-orange-500 transition-colors">Setup</Link>
              <ChevronRight size={10} className="text-slate-300" />
              <span className="text-orange-500">{os.name}</span>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold font-display dark:text-white mb-6 tracking-tight">
                Select your <span className="text-orange-500">{os.name}</span> Client
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                We support multiple applications for {os.name}. Choose the one that best fits your workflow to see detailed installation steps.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`grid grid-cols-1 ${os.apps.length === 1 ? 'lg:grid-cols-1' :
              'lg:grid-cols-2'
              } gap-8`}
          >
            {os.apps.map((app) => (
              <motion.div
                key={app.id}
                variants={itemVariants}
                className={os.apps.length === 1 ? 'max-w-4xl' : ''}
              >
                <Link href={`/setup/${osId}/${app.id}`} className="group block h-full">
                  <div className="relative h-full p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-orange-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col shadow-2xl shadow-slate-200/40 dark:shadow-none">
                    <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
                    

                    <div className="relative z-10">
                      {/* Unified Header: Logo + Title + Recommended */}
                      <div className="flex items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center p-2.5 shadow-sm shrink-0 group-hover:scale-110 transition-transform duration-500">
                            <Image
                              src={app.logo}
                              alt={app.name}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </div>
                          <h3 className={`${os.apps.length === 1 ? 'text-3xl' : 'text-2xl'} font-bold font-display dark:text-white group-hover:text-orange-500 transition-colors tracking-tight`}>
                            {app.name}
                          </h3>
                        </div>

                        {app.isRecommended && (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 whitespace-nowrap shrink-0">
                            <ShieldCheck size={10} />
                            Recommended
                          </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="grow">
                        <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-2xl">
                          {app.description}
                        </p>
                        
                        {/* Feature Tags */}
                        <div className="flex flex-wrap gap-2">
                          {app.features.map((feature, idx) => (
                            <span 
                              key={idx}
                              className="px-4 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-xs font-semibold text-slate-400 group-hover:border-orange-500/20 group-hover:text-orange-500 transition-all duration-300"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-orange-500 font-bold group/btn text-base">
                        <span>Setup {app.name}</span>
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {os.apps.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-300 dark:border-white/10"
            >
              <div className="w-16 h-16 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                <ChevronRight size={32} />
              </div>
              <p className="text-xl font-medium text-slate-500 dark:text-slate-400">No applications found for {os.name} yet.</p>
              <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm">We are working on adding new guides for this platform.</p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
