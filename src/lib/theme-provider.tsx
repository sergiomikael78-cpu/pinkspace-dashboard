"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { themes, ThemeConfig } from "@/config/themes";

interface ThemeContextType {
  activeThemeId: string;
  theme: ThemeConfig;
  setTheme: (id: string) => void;
  animationEnabled: boolean;
  setAnimationEnabled: (enabled: boolean) => void;
  animationIntensity: "low" | "medium" | "high";
  setAnimationIntensity: (intensity: "low" | "medium" | "high") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeThemeId, setActiveThemeId] = useState<string>("soft-sakura");
  const [animationEnabled, setAnimationEnabled] = useState<boolean>(true);
  const [animationIntensity, setAnimationIntensity] = useState<"low" | "medium" | "high">("medium");
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("pinkspace_theme");
    if (savedTheme && themes[savedTheme]) {
      setActiveThemeId(savedTheme);
    }

    const savedAnimEnabled = localStorage.getItem("pinkspace_anim_enabled");
    if (savedAnimEnabled !== null) {
      setAnimationEnabled(savedAnimEnabled === "true");
    }

    const savedIntensity = localStorage.getItem("pinkspace_anim_intensity");
    if (savedIntensity === "low" || savedIntensity === "medium" || savedIntensity === "high") {
      setAnimationIntensity(savedIntensity);
    } else {
      // Check prefers-reduced-motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setAnimationIntensity("low");
      }
    }
    
    setMounted(true);
  }, []);

  // Apply theme to :root
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    const theme = themes[activeThemeId] || themes['soft-sakura'];

    // Apply tokens
    Object.entries(theme.tokens).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Update body background immediately to prevent flash
    document.body.style.background = theme.tokens['--color-background'];
    document.body.style.color = theme.tokens['--color-foreground'];
    
  }, [activeThemeId, mounted]);

  const handleSetTheme = (id: string) => {
    if (themes[id]) {
      setActiveThemeId(id);
      localStorage.setItem("pinkspace_theme", id);
      // TODO: Async sync to DB via Server Action in the background
    }
  };

  const handleSetAnimationEnabled = (enabled: boolean) => {
    setAnimationEnabled(enabled);
    localStorage.setItem("pinkspace_anim_enabled", String(enabled));
  };

  const handleSetAnimationIntensity = (intensity: "low" | "medium" | "high") => {
    setAnimationIntensity(intensity);
    localStorage.setItem("pinkspace_anim_intensity", intensity);
  };

  // Prevent hydration mismatch by not rendering full children tree differently, 
  // but we can render safely since CSS handles the visual differences.
  
  const value = {
    activeThemeId,
    theme: themes[activeThemeId] || themes['soft-sakura'],
    setTheme: handleSetTheme,
    animationEnabled,
    setAnimationEnabled: handleSetAnimationEnabled,
    animationIntensity,
    setAnimationIntensity: handleSetAnimationIntensity,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
