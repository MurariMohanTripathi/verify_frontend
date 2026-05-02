import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const themeOptions = {
  light: {
    label: "Light",
    background: "#f8fafc",
    surface: "#ffffff",
    surfaceAlt: "#eef2f7",
    border: "#d9e2ec",
    text: "#111827",
    muted: "#526173",
  },
  dark: {
    label: "Dark",
    background: "#0f172a",
    surface: "#182235",
    surfaceAlt: "#111827",
    border: "#2f3b52",
    text: "#f8fafc",
    muted: "#aeb9c8",
  },
  gradientOcean: {
    label: "Ocean Gradient",
    background: "linear-gradient(135deg, #07111f 0%, #123c55 48%, #075e62 100%)",
    surface: "rgba(10, 24, 38, 0.82)",
    surfaceAlt: "rgba(17, 42, 59, 0.72)",
    border: "rgba(148, 203, 213, 0.28)",
    text: "#f3fbff",
    muted: "#b8d6df",
  },
  gradientForest: {
    label: "Forest Gradient",
    background: "linear-gradient(135deg, #09130f 0%, #183f2d 50%, #5c6f35 100%)",
    surface: "rgba(13, 32, 25, 0.84)",
    surfaceAlt: "rgba(28, 54, 38, 0.74)",
    border: "rgba(184, 210, 155, 0.3)",
    text: "#f7fff4",
    muted: "#c5d8bd",
  },
  gradientSunset: {
    label: "Sunset Gradient",
    background: "linear-gradient(135deg, #1d1022 0%, #71344f 50%, #c46b45 100%)",
    surface: "rgba(37, 19, 37, 0.82)",
    surfaceAlt: "rgba(85, 42, 60, 0.72)",
    border: "rgba(255, 190, 156, 0.3)",
    text: "#fff7f2",
    muted: "#f0cabc",
  },
  gradientAurora: {
    label: "Aurora Gradient",
    background: "linear-gradient(135deg, #101424 0%, #28466f 46%, #4f7d72 100%)",
    surface: "rgba(15, 23, 42, 0.82)",
    surfaceAlt: "rgba(37, 60, 88, 0.72)",
    border: "rgba(180, 210, 220, 0.3)",
    text: "#f8fbff",
    muted: "#c2d2dc",
  },
};

export const accentOptions = [
  { label: "Blue", value: "#2563eb" },
  { label: "Green", value: "#16a34a" },
  { label: "Rose", value: "#e11d48" },
  { label: "Amber", value: "#d97706" },
  { label: "Cyan", value: "#0891b2" },
];

export const textColorOptions = [
  { label: "Default", value: "default" },
  { label: "Soft White", value: "#f8fafc" },
  { label: "Ink", value: "#111827" },
  { label: "Warm", value: "#fff7ed" },
  { label: "Cool", value: "#e0f2fe" },
];

const storageKey = "verifyNewsTheme";
const defaultTheme = {
  mode: "dark",
  accent: "#2563eb",
  textColor: "default",
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(storageKey);
    return savedTheme ? { ...defaultTheme, ...JSON.parse(savedTheme) } : defaultTheme;
  });

  const resolvedTheme = useMemo(() => {
    const mode = themeOptions[theme.mode] ? theme.mode : defaultTheme.mode;
    const palette = themeOptions[mode];
    return {
      ...theme,
      mode,
      palette,
      resolvedText: theme.textColor === "default" ? palette.text : theme.textColor,
    };
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--app-bg", resolvedTheme.palette.background);
    root.style.setProperty("--app-surface", resolvedTheme.palette.surface);
    root.style.setProperty("--app-surface-alt", resolvedTheme.palette.surfaceAlt);
    root.style.setProperty("--app-border", resolvedTheme.palette.border);
    root.style.setProperty("--app-text", resolvedTheme.resolvedText);
    root.style.setProperty("--app-muted", resolvedTheme.palette.muted);
    root.style.setProperty("--app-accent", resolvedTheme.accent);
    root.style.setProperty("--app-accent-soft", `${resolvedTheme.accent}22`);
    root.dataset.themeMode = resolvedTheme.mode;
  }, [resolvedTheme]);

  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      setTheme: (updates) => setTheme((current) => ({ ...current, ...updates })),
      resetTheme: () => setTheme(defaultTheme),
    }),
    [resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
