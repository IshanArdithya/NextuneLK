export interface Step {
  title: string;
  description: string;
  image?: string;
}

export interface Troubleshooting {
  problem: string;
  solution: string;
}

export interface AppGuide {
  id: string;
  name: string;
  description: string;
  logo: string;
  features: string[];
  overview: string;
  videoUrl?: string;
  isRecommended?: boolean;
  installationSteps: Step[];
  configurationSteps: Step[];
  troubleshooting: Troubleshooting[];
  faq: { question: string; answer: string }[];
}

export interface OSGroup {
  id: string;
  name: string;
  icon: string;
  apps: AppGuide[];
}

export const setupData: OSGroup[] = [
  {
    id: "windows",
    name: "Windows",
    icon: "windows",
    apps: [
      {
        id: "netmod-client",
        name: "NetMod Client",
        description: "A versatile VPN client for Windows with advanced features and multi-protocol support.",
        logo: "/setup/netmod-logo.png",
        features: ["Setup in 2 Minutes", "Stable Connection", "Advanced Routing"],
        isRecommended: true,
        overview: "NetMod is a powerful Windows client that supports a wide range of protocols including V2Ray, SSH, and Trojan. It is highly recommended for users who need fine-grained control over their routing and tunnel configurations.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        installationSteps: [
          {
            title: "Download the Installer",
            description: "Get the latest setup file from our secure mirrors. Ensure you select the x64 version for modern Windows systems.",
            image: "/setup/windows-hero.png"
          },
          {
            title: "Run as Administrator",
            description: "Right-click the installer and select 'Run as Administrator' to ensure all network drivers are correctly installed.",
            image: "/setup/windows-hero.png"
          }
        ],
        configurationSteps: [
          {
            title: "Import your Config",
            description: "Copy your tunnel link from the Usage page, then in NetMod, go to 'Import' -> 'From Clipboard'.",
            image: "/setup/windows-hero.png"
          },
          {
            title: "Enable TUN Mode",
            description: "For system-wide VPN, ensure the 'TUN' toggle is enabled in the main dashboard before connecting.",
            image: "/setup/windows-hero.png"
          }
        ],
        troubleshooting: [
          {
            problem: "Connection failed with 'Auth Error'",
            solution: "Ensure your account is active and you have copied the full configuration string."
          }
        ],
        faq: [
          {
            question: "Is NetMod free to use?",
            answer: "Yes, the NetMod core client is open-source and free for all users."
          },
          {
            question: "Can I use it for gaming?",
            answer: "Absolutely. We recommend enabling 'Low Latency' mode in the settings for the best experience."
          }
        ]
      },
      {
        id: "netch",
        name: "Netch",
        description: "An open-source game accelerator for Windows. Optimized for low-latency gaming.",
        logo: "/setup/netch-logo.png",
        features: ["Gaming", "Open Source", "Low Latency Gaming"],
        overview: "Netch is an open-source game accelerator for Windows that supports various protocols including Shadowsocks and V2Ray.",
        installationSteps: [{ title: "Download", description: "Download and extract Netch." }],
        configurationSteps: [{ title: "Import", description: "Import your V2Ray config." }],
        troubleshooting: [],
        faq: []
      },
    ],
  },
  {
    id: "android",
    name: "Android",
    icon: "android",
    apps: [
      {
        id: "netmod-android",
        name: "NetMod Android",
        description: "Official NetMod client for Android devices. Feature-rich and highly customizable.",
        logo: "/setup/netmod-logo.png",
        features: ["Customizable", "Multi-Protocol Support", "Rock Solid Stability"],
        overview: "NetMod for Android is a high-performance VPN client with extensive protocol support.",
        installationSteps: [{ title: "Install", description: "Install from the app store." }],
        configurationSteps: [{ title: "Connect", description: "Import and tap connect." }],
        troubleshooting: [],
        faq: []
      },
      {
        id: "v2rayng",
        name: "V2RayNG",
        description: "A popular V2Ray client for Android. Simple, reliable, and battery efficient.",
        logo: "/setup/v2rayng-logo.png",
        features: ["Battery Efficient", "Beginner Friendly", "Proven Reliability"],
        isRecommended: true,
        overview: "V2RayNG is a standard client for Android, offering stability and ease of use.",
        installationSteps: [{ title: "Download", description: "Download from GitHub." }],
        configurationSteps: [{ title: "Import", description: "Import and start." }],
        troubleshooting: [],
        faq: []
      }
    ],
  },
  {
    id: "ios",
    name: "iOS / iPadOS",
    icon: "apple",
    apps: [
      {
        id: "v2box",
        name: "V2Box",
        description: "A simple and powerful V2Ray client for iPhone and iPad users.",
        logo: "/setup/v2box-logo.png",
        features: ["Easy One-Tap Connect", "Modern Interface", "Completely Free"],
        isRecommended: true,
        overview: "V2Box provides a seamless VPN experience for iOS users with a focus on simplicity.",
        installationSteps: [{ title: "App Store", description: "Install from App Store." }],
        configurationSteps: [{ title: "Add", description: "Add your config link." }],
        troubleshooting: [],
        faq: []
      },
    ],
  },
  {
    id: "macos",
    name: "MacOS",
    icon: "laptop",
    apps: [
      {
        id: "v2rayu",
        name: "V2RayU",
        description: "A native macOS client for V2Ray with a clean menu bar interface.",
        logo: "/setup/v2rayu-logo.png",
        features: ["Native MacOS Build", "Clean Menu Bar Icon", "M-Series Optimized"],
        overview: "V2RayU is the preferred client for MacOS users, offering native performance.",
        installationSteps: [{ title: "DMG", description: "Install from DMG." }],
        configurationSteps: [{ title: "Import", description: "Import from clipboard." }],
        troubleshooting: [],
        faq: []
      },
    ],
  },
  {
    id: "linux",
    name: "Linux",
    icon: "terminal",
    apps: [
      {
        id: "v2ray-core",
        name: "V2Ray Core (CLI)",
        description: "The official V2Ray core for advanced users. Pure performance on Linux.",
        logo: "/setup/linux-logo.png",
        features: ["Terminal Optimized", "Maximum Performance", "Advanced CLI Tools"],
        overview: "For Linux users, the core CLI provides the most stable and performant experience.",
        installationSteps: [{ title: "Install", description: "Run installation script." }],
        configurationSteps: [{ title: "Config", description: "Edit config.json." }],
        troubleshooting: [],
        faq: []
      },
    ],
  },
];
