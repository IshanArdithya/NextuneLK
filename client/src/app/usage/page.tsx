import Navbar from "@/components/landing/navbar";
import UsageDashboard from "@/components/usage-dashboard";
import Footer from "@/components/landing/footer";

export default function UsagePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      <div className="flex-grow pt-24 pb-16">
        <UsageDashboard />
      </div>
      <Footer />
    </main>
  );
}
