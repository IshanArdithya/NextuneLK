"use client";

import { createContext, useContext, useState } from "react";
import { ThemeKey, themes } from "@/lib/themes";

type ThemeContextType = {
  themeKey: ThemeKey;
  theme: (typeof themes)[ThemeKey];
  setTheme: (theme: ThemeKey) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeKey, setThemeKey] = useState<ThemeKey>("emerald");
  const theme = themes[themeKey];

  return (
    <ThemeContext.Provider value={{ themeKey, theme, setTheme: setThemeKey }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
