"use client";

import { useParams, notFound } from "next/navigation";
import { setupData } from "@/data/setup-guides";
import Navigation from "@/components/landing/navbar";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
  ExternalLink,
  ArrowRight,
  Info,
  Plus,
  Minus
} from "lucide-react";
import Footer from "@/components/landing/footer";
import { useState, useEffect } from "react";

const Accordion = ({ title, children, isOpen, onClick }: { title: string, children: React.ReactNode, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="border-b border-slate-100 dark:border-white/5 last:border-0 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group transition-all"
      >
        <span className={`text-lg font-bold transition-colors ${isOpen ? "text-orange-500" : "dark:text-white text-slate-900 group-hover:text-orange-500"}`}>
          {title}
        </span>
        <div className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-orange-500 border-orange-500 text-white rotate-180" : "border-slate-200 dark:border-white/10 text-slate-400"}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="pb-8 text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function GuidePage() {
  const params = useParams();
  const osId = params.os as string;
  const appId = params.app as string;

  const os = setupData.find((o) => o.id === osId);
  const app = os?.apps.find((a) => a.id === appId);

  const [activeSection, setActiveSection] = useState("overview");
  const [openTrouble, setOpenTrouble] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "installation", "configuration", "troubleshooting", "faq"];
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!os || !app) {
    notFound();
  }

  const navSections = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "installation", label: "Installation", icon: Download },
    { id: "configuration", label: "Configuration", icon: CheckCircle2 },
    { id: "troubleshooting", label: "Troubleshooting", icon: AlertCircle },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0c] flex flex-col selection:bg-orange-500/30">
      <Navigation />

      <main className="flex-grow pt-32 pb-32 relative">
        {/* bg accents */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-orange-500/[0.03] blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none z-0" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/[0.02] blur-[100px] rounded-full -ml-48 -mb-48 pointer-events-none z-0" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Area */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 border-b border-slate-100 dark:border-white/5 pb-16"
          >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10">
              <Link href="/setup" className="hover:text-orange-500 transition-colors">Setup</Link>
              <ChevronRight size={10} className="text-slate-300" />
              <Link href={`/setup/${osId}`} className="hover:text-orange-500 transition-colors">{os.name}</Link>
              <ChevronRight size={10} className="text-slate-300" />
              <span className="text-orange-500">{app.name}</span>
            </div>

            <div className="flex items-start gap-8">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center p-4 shadow-sm shrink-0">
                <Image src={app.logo} alt={app.name} width={48} height={48} className="object-contain" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-display dark:text-white mb-4 tracking-tighter">
                  {app.name}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-base md:text-lg leading-relaxed font-medium">
                  {app.description}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-20">
            {/* Main Content Area */}
            <div className="flex-grow lg:max-w-[700px] space-y-32">

              {/* Overview Section */}
              <section id="overview" className="scroll-mt-32">
                <h2 className="text-2xl font-bold font-display dark:text-white mb-8 tracking-tight">Overview</h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base font-normal">
                    {app.overview}
                  </p>
                </div>
              </section>

              {/* Installation Section */}
              <section id="installation" className="scroll-mt-32">
                <h2 className="text-2xl font-bold font-display dark:text-white mb-10 tracking-tight">Installation</h2>
                <div className="space-y-0">
                  {app.installationSteps.map((step, idx) => (
                    <div key={idx} className="relative group">
                      {/* Connection Line */}
                      {idx !== app.installationSteps.length - 1 && (
                        <div className="absolute left-4 top-8 w-px h-full bg-slate-100 dark:bg-white/[0.03] z-0" />
                      )}

                      <div className="flex gap-8 relative z-10 pb-64 last:pb-12">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-[#0a0a0c] border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-orange-500 group-hover:text-orange-500 transition-all duration-300">
                          {idx + 1}
                        </div>
                        <div className="-mt-1">
                          <h3 className="text-xl font-bold font-display dark:text-white mb-3 tracking-tight">{step.title}</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-base mb-8 leading-relaxed max-w-lg">
                            {step.description}
                          </p>
                          {step.image && (
                            <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 inline-block shadow-sm hover:shadow-md transition-shadow">
                              <Image
                                src={step.image}
                                alt={step.title}
                                width={540}
                                height={320}
                                className="rounded-[2rem] object-cover max-w-full h-auto"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Configuration Section */}
              <section id="configuration" className="scroll-mt-32">
                <h2 className="text-2xl font-bold font-display dark:text-white mb-10 tracking-tight">Configuration</h2>
                <div className="space-y-0">
                  {app.configurationSteps.map((step, idx) => (
                    <div key={idx} className="relative group">
                      {/* Connection Line */}
                      {idx !== app.configurationSteps.length - 1 && (
                        <div className="absolute left-4 top-8 w-px h-full bg-slate-100 dark:bg-white/[0.03] z-0" />
                      )}

                      <div className="flex gap-8 relative z-10 pb-64 last:pb-12">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-[#0a0a0c] border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-orange-500 group-hover:text-orange-500 transition-all duration-300">
                          {idx + 1}
                        </div>
                        <div className="-mt-1">
                          <h3 className="text-xl font-bold font-display dark:text-white mb-3 tracking-tight">{step.title}</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-base mb-8 leading-relaxed max-w-lg">
                            {step.description}
                          </p>
                          {step.image && (
                            <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 inline-block shadow-sm hover:shadow-md transition-shadow">
                              <Image
                                src={step.image}
                                alt={step.title}
                                width={540}
                                height={320}
                                className="rounded-[2rem] object-cover max-w-full h-auto"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Troubleshooting Section */}
              {app.troubleshooting.length > 0 && (
                <section id="troubleshooting" className="scroll-mt-32">
                  <h2 className="text-2xl font-bold font-display dark:text-white mb-10 tracking-tight">Troubleshooting</h2>
                  <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/10 rounded-[2.5rem] px-10">
                    {app.troubleshooting.map((item, idx) => (
                      <Accordion
                        key={idx}
                        title={item.problem}
                        isOpen={openTrouble === idx}
                        onClick={() => setOpenTrouble(openTrouble === idx ? null : idx)}
                      >
                        {item.solution}
                      </Accordion>
                    ))}
                  </div>
                </section>
              )}

              {/* FAQ Section */}
              {app.faq.length > 0 && (
                <section id="faq" className="scroll-mt-32">
                  <h2 className="text-2xl font-bold font-display dark:text-white mb-10 tracking-tight">Common Questions</h2>
                  <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/10 rounded-[2.5rem] px-10">
                    {app.faq.map((item, idx) => (
                      <Accordion
                        key={idx}
                        title={item.question}
                        isOpen={openFaq === idx}
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      >
                        {item.answer}
                      </Accordion>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sticky Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-32 space-y-12">
                {/* Progress Navigation */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 px-4">Contents</h3>
                  <nav className="space-y-1">
                    {navSections.map((section) => {
                      const Icon = section.icon;
                      const isActive = activeSection === section.id;
                      return (
                        <Link
                          key={section.id}
                          href={`#${section.id}`}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${isActive
                            ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20"
                            : "text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                            }`}
                        >
                          <Icon size={14} className={isActive ? "text-white" : "text-slate-300"} />
                          <span>{section.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Usage Quick-Link Card */}
                <div className="p-8 rounded-[2.5rem] bg-[#0f0f12] dark:bg-white/5 border border-white/5 text-white shadow-2xl group overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                    <ExternalLink size={80} />
                  </div>
                  <h4 className="text-lg font-bold mb-3 relative z-10">Check Usage</h4>
                  <p className="text-white/40 text-[12px] leading-relaxed mb-8 relative z-10">
                    Once setup is complete, monitor your bandwidth in real-time.
                  </p>
                  <Link
                    href="/usage"
                    className="flex items-center justify-between bg-orange-500 hover:bg-orange-600 p-4 rounded-2xl transition-all group/link"
                  >
                    <span className="text-[13px] font-bold">Go to Dashboard</span>
                    <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
