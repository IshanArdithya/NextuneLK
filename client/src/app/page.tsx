"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/usage");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-orange-500/20 rounded-full"></div>
        <p className="text-foreground/60 text-sm">Redirecting to Usage Dashboard...</p>
      </div>
    </div>
  );
}
