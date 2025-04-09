export type ThemeKey = "indigo" | "teal" | "purple" | "emerald";

export interface Theme {
  primary: string;
  light: string;
  accent: string;
  border: string;
  ring: string;
  text: string;
  icon: string;
  iconBg: string;
}

export const themes: Record<ThemeKey, Theme> = {
  indigo: {
    primary: "from-indigo-500 to-violet-600",
    light: "from-indigo-400 to-violet-400",
    accent: "bg-indigo-600 hover:bg-indigo-700",
    border: "border-indigo-500/30",
    ring: "ring-indigo-500",
    text: "text-indigo-400",
    icon: "text-indigo-400",
    iconBg: "bg-indigo-500/20",
  },
  teal: {
    primary: "from-teal-500 to-emerald-600",
    light: "from-teal-400 to-emerald-400",
    accent: "bg-teal-600 hover:bg-teal-700",
    border: "border-teal-500/30",
    ring: "ring-teal-500",
    text: "text-teal-400",
    icon: "text-teal-400",
    iconBg: "bg-teal-500/20",
  },
  purple: {
    primary: "from-purple-500 to-pink-600",
    light: "from-purple-400 to-pink-400",
    accent: "bg-purple-600 hover:bg-purple-700",
    border: "border-purple-500/30",
    ring: "ring-purple-500",
    text: "text-purple-400",
    icon: "text-purple-400",
    iconBg: "bg-purple-500/20",
  },
  emerald: {
    primary: "from-emerald-600 to-green-600",
    light: "from-emerald-400 to-green-400",
    accent: "bg-emerald-600 hover:bg-emerald-700",
    border: "border-emerald-500/30",
    ring: "ring-emerald-500",
    text: "text-emerald-400",
    icon: "text-emerald-400",
    iconBg: "bg-emerald-500/20",
  },
};
