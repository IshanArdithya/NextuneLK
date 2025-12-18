"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/usage");
  }, [router]);

  return null;
}

/*
import { useState } from "react";
import Navigation from "@/components/header";
import Footer from "@/components/footer";
import SetupHero from "@/components/setup/setup-hero";
import OSSelection from "@/components/setup/os-selection";
import AppSelection from "@/components/setup/app-selection";
import SetupGuide from "@/components/setup/setup-guide";
import SetupBreadcrumb from "@/components/setup/breadcrumb";

export default function SetupPageOriginal() {
  const [selectedOS, setSelectedOS] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const handleOSSelect = (os: string) => {
    setSelectedOS(os);
    setSelectedApp(null);
  };

  const handleAppSelect = (app: string) => {
    setSelectedApp(app);
  };

  const handleBack = () => {
    if (selectedApp) {
      setSelectedApp(null);
    } else {
      setSelectedOS(null);
    }
  };

  return (
    <main className="bg-background text-foreground">
      <Navigation />
      <SetupHero />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SetupBreadcrumb
          os={selectedOS || undefined}
          app={selectedApp || undefined}
        />

        {!selectedOS ? (
          <OSSelection onOSSelect={handleOSSelect} />
        ) : !selectedApp ? (
          <AppSelection
            os={selectedOS}
            onAppSelect={handleAppSelect}
            onBack={handleBack}
          />
        ) : (
          <SetupGuide os={selectedOS} app={selectedApp} onBack={handleBack} />
        )}
      </div>

      <Footer />
    </main>
  );
}
*/
