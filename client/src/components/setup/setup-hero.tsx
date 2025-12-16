import { Monitor, Smartphone } from "lucide-react"

export default function SetupHero() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-orange-50/50 to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Setup Guide</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Choose your platform and follow the step-by-step guide to start using your tunnel.
        </p>

        <div className="flex items-center justify-center gap-6 md:gap-8">
          <div className="flex flex-col items-center gap-2">
            <Monitor className="w-10 h-10 text-orange-500" />
            <span className="text-sm font-medium">Windows</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Smartphone className="w-10 h-10 text-orange-500" />
            <span className="text-sm font-medium">Android</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Smartphone className="w-10 h-10 text-orange-500" />
            <span className="text-sm font-medium">iOS</span>
          </div>
        </div>
      </div>
    </section>
  )
}
