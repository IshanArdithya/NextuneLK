"use client"
import { motion } from "framer-motion"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  scrollRevealVariants,
  containerVariants,
  listContainerVariants,
  listItemVariants,
} from "@/lib/animation-variants"

interface SetupGuideProps {
  os: string
  app: string
  onBack: () => void
}

const setupData: Record<
  string,
  Record<
    string,
    {
      steps: Array<{ title: string; description: string; image?: string }>
      troubleshooting: Array<{ problem: string; solution: string }>
    }
  >
> = {
  windows: {
    "netmod-client": {
      steps: [
        {
          title: "Download & Install",
          description:
            "Visit the official NextuneLK website and download the NetMod Client for Windows. Run the installer and follow the installation wizard.",
          image: "/netmod-client-windows-download.jpg",
        },
        {
          title: "Configure Settings",
          description:
            "Open NetMod Client. Go to Settings → V2Ray Options → Enable 'Content Sniffing' and check 'Allow Insecure (TLS)' for better compatibility.",
          image: "/netmod-settings-configuration.jpg",
        },
        {
          title: "Import Configuration",
          description:
            "Click on 'Import Config' and paste your tunnel configuration file or import from URL. The client will automatically detect and apply the settings.",
          image: "/netmod-import-config.jpg",
        },
        {
          title: "Start the Client",
          description:
            "Click the 'Start' button to activate your VPN connection. Open Logs to monitor the connection status. When you see 'VPN Started', click the chart icon to check latency.",
          image: "/netmod-start-vpn.jpg",
        },
      ],
      troubleshooting: [
        {
          problem: "VPN not connecting",
          solution:
            "Ensure your tunnel link is active. Verify the configuration is correctly imported. Restart the application and try again.",
        },
        {
          problem: "High ping/latency",
          solution:
            "Try connecting to a different tunnel or region with lower latency. Check your internet connection speed.",
        },
        {
          problem: "TLS verification error",
          solution:
            "Make sure 'Allow Insecure (TLS)' is enabled in Settings → V2Ray Options. Restart the client after making changes.",
        },
        {
          problem: "Config import fails",
          solution:
            "Re-download the tunnel configuration file. Ensure you're pasting the complete config string without any extra characters.",
        },
      ],
    },
    netch: {
      steps: [
        {
          title: "Download & Install",
          description:
            "Download Netch from GitHub releases. Extract the ZIP file to your preferred location and run Netch.exe.",
          image: "/netch-github-download.jpg",
        },
        {
          title: "Add Server",
          description:
            "Click 'Add Servers' → Paste your V2Ray configuration. Netch will automatically parse and display the server details.",
          image: "/netch-add-server.jpg",
        },
        {
          title: "Configure Mode",
          description:
            "Select your desired proxy mode (System Proxy, TUN/TAP, etc.). For beginners, 'System Proxy' is recommended.",
          image: "/netch-mode-selection.jpg",
        },
        {
          title: "Start Connection",
          description:
            "Select your server from the list and click 'Start'. Wait for the status to show 'Connected'. Check the speed and latency indicators.",
          image: "/netch-start-connected.jpg",
        },
      ],
      troubleshooting: [
        {
          problem: "Netch won't start",
          solution:
            "Make sure you're running as Administrator. Check Windows Firewall settings and allow Netch through it.",
        },
        {
          problem: "Connection drops frequently",
          solution: "Try changing the proxy mode. Enable 'Allow users to bypass proxy' in advanced settings.",
        },
        {
          problem: "Server list is empty",
          solution:
            "Verify the configuration is properly formatted. Re-add the server with the complete URL or configuration string.",
        },
        {
          problem: "DNS not working",
          solution:
            "Manually set DNS to 8.8.8.8 or 1.1.1.1 in your network settings. Disable IPv6 if experiencing issues.",
        },
      ],
    },
  },
  android: {
    "netmod-android": {
      steps: [
        {
          title: "Download & Install",
          description:
            "Download NetMod Android app from the official store. Install it on your Android device (requires Android 7.0 or higher).",
          image: "/netmod-android-app-install.jpg",
        },
        {
          title: "Import Configuration",
          description:
            "Open the app. Tap the '+' button and paste your tunnel configuration or scan the QR code if available.",
          image: "/netmod-android-config-import.jpg",
        },
        {
          title: "Review Settings",
          description:
            "Tap on the imported configuration to view details. Go to Settings and enable 'Allow Insecure Connections' if needed.",
          image: "/netmod-android-settings.jpg",
        },
        {
          title: "Connect",
          description:
            "Long-press on your configuration and select 'Connect'. Grant VPN permission when prompted. Your connection is active when you see the VPN icon in the status bar.",
          image: "/netmod-android-vpn-active.jpg",
        },
      ],
      troubleshooting: [
        {
          problem: "VPN permission not granting",
          solution:
            "Go to Settings → Apps → Permissions → VPN and ensure NetMod has permission. Some devices may have special VPN restrictions.",
        },
        {
          problem: "Can't import configuration",
          solution:
            "Make sure you're copying the full configuration string. Check if the format is valid (usually starts with 'vmess://' or 'v2ray://').",
        },
        {
          problem: "Frequent disconnections",
          solution:
            "Check your network stability. Disable battery optimization for the app. Try reconnecting to a different configuration.",
        },
        {
          problem: "Apps not using VPN",
          solution:
            "Some apps may bypass VPN. Disable VPN per-app exclusions in the app settings. Ensure the VPN connection is active.",
        },
      ],
    },
    v2rayng: {
      steps: [
        {
          title: "Download & Install",
          description: "Download V2RayNG from GitHub or F-Droid. Install the APK file on your Android device.",
          image: "/v2rayng-android-download.jpg",
        },
        {
          title: "Add Configuration",
          description:
            "Open V2RayNG. Tap the '+' button and paste your V2Ray configuration link or import from QR code.",
          image: "/v2rayng-add-server.jpg",
        },
        {
          title: "Adjust Settings",
          description:
            "Go to Settings. Enable 'Route by apps if available' and configure DNS. Select your preferred protocol settings.",
          image: "/v2rayng-settings-dns.jpg",
        },
        {
          title: "Start Proxy",
          description:
            "Select your configuration from the list. Tap the play button to start. Grant VPN permission when prompted.",
          image: "/placeholder.svg?height=400&width=600",
        },
      ],
      troubleshooting: [
        {
          problem: "Configuration import fails",
          solution:
            "Ensure the link uses the correct format (v2ray://, vmess://, etc.). Manually paste the decoded configuration if link import fails.",
        },
        {
          problem: "VPN won't connect",
          solution: "Check DNS settings. Try disabling 'Route by apps'. Restart the app and reconnect.",
        },
        {
          problem: "High memory usage",
          solution: "Close other background apps. Disable unnecessary logging. Restart V2RayNG occasionally.",
        },
        {
          problem: "DNS leaks",
          solution: "Set custom DNS to 8.8.8.8 or 1.1.1.1 in settings. Use the DNS leak test tool to verify.",
        },
      ],
    },
  },
  ios: {
    v2box: {
      steps: [
        {
          title: "Download & Install",
          description: "Download V2Box from the Apple App Store. Requires iOS 13.0 or higher.",
          image: "/placeholder.svg?height=400&width=600",
        },
        {
          title: "Add Configuration",
          description:
            "Open V2Box. Tap '+' to add a new connection. Paste your V2Ray configuration string or import from URL.",
          image: "/placeholder.svg?height=400&width=600",
        },
        {
          title: "Grant VPN Permission",
          description:
            "When connecting, iOS will prompt you to allow VPN configuration. Tap 'Allow' and authenticate with Face ID or password.",
          image: "/placeholder.svg?height=400&width=600",
        },
        {
          title: "Connect and Verify",
          description:
            "Once connected, you'll see the VPN indicator in the status bar. Check the latency and connection status in the app interface.",
          image: "/placeholder.svg?height=400&width=600",
        },
      ],
      troubleshooting: [
        {
          problem: "VPN permission denied",
          solution:
            "Go to Settings → VPN & Device Management → V2Box and ensure permission is granted. Remove and re-add the VPN profile if needed.",
        },
        {
          problem: "Configuration won't import",
          solution:
            "Ensure the configuration format is correct. Copy the full string without extra characters. Try importing from a URL instead.",
        },
        {
          problem: "Frequent disconnections",
          solution:
            "Check Settings → Cellular or Wi-Fi. Disable 'Low Power Mode'. Ensure the VPN profile is correctly saved.",
        },
        {
          problem: "Slow connection speed",
          solution:
            "Try connecting to a different server. Check your network signal strength. Disable other VPN apps or proxies.",
        },
      ],
    },
  },
}

export default function SetupGuide({ os, app, onBack }: SetupGuideProps) {
  const osName = os.charAt(0).toUpperCase() + os.slice(1)
  const appName = setupData[os]?.[app] ? Object.keys(setupData[os]).find((key) => key === app) : app

  const guide = setupData[os]?.[app] || {
    steps: [],
    troubleshooting: [],
  }

  const breadcrumb = `Setup Guide → ${osName} → ${appName}`

  return (
    <div>
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back</span>
      </motion.button>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <p className="text-sm text-muted-foreground mb-4">{breadcrumb}</p>
        <h1 className="text-4xl font-bold">
          {appName
            ?.replace("-", " ")
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")}
        </h1>
      </motion.div>

      {/* Video Section - Enhanced with scroll reveal */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={scrollRevealVariants}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6">Watch the Video Tutorial</h2>
        <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
          <img
            src="/placeholder.svg?height=600&width=1200"
            alt="Video tutorial"
            className="w-full h-full object-cover"
          />
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer group"
          >
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-l-8 border-l-white border-t-5 border-t-transparent border-b-5 border-b-transparent ml-1"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Steps Section - Enhanced with staggered step animations */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={scrollRevealVariants}
        transition={{ delay: 0.1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6">Setup Steps</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {guide.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white border border-border shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-500 text-white font-bold"
                  >
                    {index + 1}
                  </motion.div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  {step.image && (
                    <img
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      className="rounded-lg w-full max-w-md cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Troubleshooting Section - Enhanced with animations */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={scrollRevealVariants}
        transition={{ delay: 0.2 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold">Troubleshooting Common Issues</h2>
        </div>
        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-3"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {guide.troubleshooting.map((item, index) => (
              <motion.div key={index} variants={listItemVariants}>
                <AccordionItem
                  value={`item-${index}`}
                  className="px-6 rounded-2xl bg-white border border-border shadow-md overflow-hidden"
                >
                  <AccordionTrigger className="hover:text-orange-500 transition-colors py-4">
                    <span className="font-semibold text-left">{item.problem}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">{item.solution}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </motion.div>
    </div>
  )
}
