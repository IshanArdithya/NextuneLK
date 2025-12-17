import Navigation from "@/components/header";
import UsageDashboard from "@/components/usage-dashboard";
import Footer from "@/components/footer";

export default function UsagePage() {
  return (
    <main className="bg-background text-foreground">
      <Navigation />
      <div className="py-20">
        <UsageDashboard />
      </div>
      {/* <Footer /> */}
    </main>
  );
}
