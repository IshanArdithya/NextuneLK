export const OS_OPTIONS = [
  {
    id: "windows",
    name: "Windows",
    description: "Setup VPN on Windows",
    icon: "monitor",
  },
  {
    id: "android",
    name: "Android",
    description: "Setup VPN on Android",
    icon: "smartphone",
  },
  {
    id: "ios",
    name: "iOS",
    description: "Setup VPN on iPhone",
    icon: "smartphone",
  },
];

// ----------------------------

export const APPS_BY_OS: Record<
  string,
  Array<{ id: string; name: string; description: string }>
> = {
  windows: [
    {
      id: "netmod-client",
      name: "NetMod Client",
      description: "Official NextuneLK VPN client for Windows",
    },
    {
      id: "netch",
      name: "Netch",
      description: "Popular open-source VPN client for Windows",
    },
  ],

  android: [
    {
      id: "netmod-android",
      name: "NetMod Android",
      description: "Official NextuneLK VPN app for Android",
    },
    {
      id: "v2rayng",
      name: "V2RayNG",
      description: "V2Ray client for Android devices",
    },
  ],

  ios: [
    {
      id: "v2box",
      name: "V2Box",
      description: "V2Ray client for iPhone & iPad",
    },
  ],
};

// ----------------------------

export const SETUP_DATA: Record<
  string,
  Record<
    string,
    {
      steps: Array<{ title: string; description: string; image?: string }>;
      troubleshooting: Array<{ problem: string; solution: string }>;
    }
  >
> = {
  windows: {
    "netmod-client": {
      steps: [
        {
          title: "Download & Install",
          description:
            "Download the NetMod Client for Windows. Run the installer and follow the setup wizard.",
          image: "/netmod-client-windows-download.jpg",
        },
        {
          title: "Configure Settings",
          description:
            "Open NetMod → Go to Settings → V2Ray Options → Enable 'Content Sniffing' and 'Allow Insecure (TLS)'.",
          image: "/netmod-settings-configuration.jpg",
        },
        {
          title: "Import Configuration",
          description:
            "Click 'Import Config' and paste your tunnel config or import via URL.",
          image: "/netmod-import-config.jpg",
        },
        {
          title: "Start the Client",
          description:
            "Press Start to enable VPN. When logs show 'VPN Started', click the chart icon to check latency.",
          image: "/netmod-start-vpn.jpg",
        },
      ],
      troubleshooting: [
        {
          problem: "VPN not connecting",
          solution: "Check your tunnel link and reinstall the configuration.",
        },
        {
          problem: "High ping",
          solution: "Try another tunnel with lower latency.",
        },
        {
          problem: "TLS verification error",
          solution:
            "Enable 'Allow Insecure TLS' in settings and restart the app.",
        },
        {
          problem: "Config import fails",
          solution: "Re-download the config and ensure full string is pasted.",
        },
      ],
    },

    netch: {
      steps: [
        {
          title: "Download & Run Netch",
          description:
            "Download from GitHub releases. Extract ZIP and run Netch.exe.",
        },
        {
          title: "Add Server",
          description: "Click 'Add Servers' → paste your V2Ray configuration.",
        },
        {
          title: "Choose Proxy Mode",
          description:
            "Use 'System Proxy' for easiest experience, or TUN/TAP for full routing.",
        },
        {
          title: "Start Connection",
          description:
            "Select your server → click Start → wait for 'Connected'.",
        },
      ],
      troubleshooting: [
        {
          problem: "Netch won't start",
          solution: "Run as Administrator and allow through Firewall.",
        },
        {
          problem: "Connection drops",
          solution: "Change proxy mode or disable IPv6.",
        },
      ],
    },
  },

  android: {
    "netmod-android": {
      steps: [
        {
          title: "Install App",
          description:
            "Download NetMod Android from official store. Requires Android 7.0+.",
          image: "/netmod-android-app-install.jpg",
        },
        {
          title: "Import Configuration",
          description:
            "Tap + and paste your tunnel config or scan its QR code.",
          image: "/netmod-android-config-import.jpg",
        },
        {
          title: "Review Settings",
          description: "Enable 'Allow Insecure Connections' if needed.",
          image: "/netmod-android-settings.jpg",
        },
        {
          title: "Connect",
          description: "Tap your tunnel → Connect → allow VPN permission.",
          image: "/netmod-android-vpn-active.jpg",
        },
      ],
      troubleshooting: [
        {
          problem: "VPN permission fails",
          solution: "Enable VPN permission in Android settings.",
        },
        {
          problem: "Frequent disconnects",
          solution: "Disable battery optimization and check network stability.",
        },
      ],
    },

    v2rayng: {
      steps: [
        {
          title: "Download V2RayNG",
          description: "Install from GitHub or F-Droid.",
        },
        {
          title: "Import Configuration",
          description: "Tap + and paste config link or scan QR.",
        },
        {
          title: "Adjust Settings",
          description: "Enable DNS routing and customize protocol options.",
        },
        {
          title: "Connect",
          description: "Tap play icon → allow VPN permission.",
        },
      ],
      troubleshooting: [
        {
          problem: "Config import fails",
          solution: "Ensure vmess:// or v2ray:// format is valid.",
        },
        {
          problem: "DNS leaks",
          solution: "Set DNS to 1.1.1.1 / 8.8.8.8.",
        },
      ],
    },
  },

  ios: {
    v2box: {
      steps: [
        {
          title: "Install V2Box",
          description: "Download from the App Store.",
        },
        {
          title: "Add Configuration",
          description: "Tap + and paste tunnel config.",
        },
        {
          title: "Grant VPN Permission",
          description: "Tap Allow and authenticate.",
        },
        {
          title: "Connect",
          description: "Tap your server → Connect → VPN icon will appear.",
        },
      ],
      troubleshooting: [
        {
          problem: "VPN permission denied",
          solution: "Grant VPN access in Settings → VPN & Device Mgmt.",
        },
        {
          problem: "Config won't import",
          solution: "Ensure full config is pasted without mistakes.",
        },
      ],
    },
  },
};
