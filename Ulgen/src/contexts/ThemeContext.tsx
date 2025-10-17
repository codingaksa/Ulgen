import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Theme = "dark" | "light" | "auto";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface CustomTheme {
  id: string;
  name: string;
  colors: ThemeColors;
  isDefault?: boolean;
}

interface ThemeContextType {
  theme: Theme;
  customTheme: CustomTheme | null;
  availableThemes: CustomTheme[];
  setTheme: (theme: Theme) => void;
  setCustomTheme: (theme: CustomTheme | null) => void;
  createCustomTheme: (theme: CustomTheme) => void;
  deleteCustomTheme: (themeId: string) => void;
  getCurrentColors: () => ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Varsayılan temalar
const defaultThemes: CustomTheme[] = [
  {
    id: "dark-default",
    name: "Koyu Tema",
    isDefault: true,
    colors: {
      primary: "#8B5CF6",
      secondary: "#6366F1",
      accent: "#A855F7",
      background: "#121212",
      surface: "#1F1B24",
      text: "#FFFFFF",
      textSecondary: "#9CA3AF",
      border: "#374151",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
  },
  {
    id: "light-default",
    name: "Açık Tema",
    isDefault: true,
    colors: {
      primary: "#8B5CF6",
      secondary: "#6366F1",
      accent: "#A855F7",
      background: "#FFFFFF",
      surface: "#F9FAFB",
      text: "#111827",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
  },
  {
    id: "purple-dark",
    name: "Mor Koyu",
    isDefault: true,
    colors: {
      primary: "#7C3AED",
      secondary: "#5B21B6",
      accent: "#8B5CF6",
      background: "#0F0B1A",
      surface: "#1A1625",
      text: "#FFFFFF",
      textSecondary: "#A78BFA",
      border: "#4C1D95",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
  },
  {
    id: "blue-dark",
    name: "Mavi Koyu",
    isDefault: true,
    colors: {
      primary: "#3B82F6",
      secondary: "#1D4ED8",
      accent: "#60A5FA",
      background: "#0F172A",
      surface: "#1E293B",
      text: "#FFFFFF",
      textSecondary: "#94A3B8",
      border: "#334155",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
  },
];

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "dark";
  });

  const [customTheme, setCustomThemeState] = useState<CustomTheme | null>(
    () => {
      const saved = localStorage.getItem("customTheme");
      return saved ? JSON.parse(saved) : null;
    }
  );

  const [availableThemes, setAvailableThemes] = useState<CustomTheme[]>(() => {
    const saved = localStorage.getItem("availableThemes");
    return saved ? JSON.parse(saved) : defaultThemes;
  });

  // Tema değişikliklerini localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (customTheme) {
      localStorage.setItem("customTheme", JSON.stringify(customTheme));
    } else {
      localStorage.removeItem("customTheme");
    }
  }, [customTheme]);

  useEffect(() => {
    localStorage.setItem("availableThemes", JSON.stringify(availableThemes));
  }, [availableThemes]);

  // CSS değişkenlerini güncelle
  useEffect(() => {
    const colors = getCurrentColors();
    const root = document.documentElement;

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Tailwind CSS sınıflarını güncelle
    root.className = root.className.replace(/theme-\w+/g, "");
    if (customTheme) {
      root.classList.add(`theme-${customTheme.id}`);
    } else {
      root.classList.add(`theme-${theme}`);
    }
  }, [theme, customTheme, availableThemes]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (newTheme !== "auto") {
      setCustomThemeState(null);
    }
  };

  const setCustomTheme = (theme: CustomTheme | null) => {
    setCustomThemeState(theme);
    if (theme) {
      setThemeState("auto");
    }
  };

  const createCustomTheme = (newTheme: CustomTheme) => {
    setAvailableThemes((prev) => [...prev, newTheme]);
    setCustomTheme(newTheme);
  };

  const deleteCustomTheme = (themeId: string) => {
    setAvailableThemes((prev) => prev.filter((t) => t.id !== themeId));
    if (customTheme?.id === themeId) {
      setCustomTheme(null);
      setTheme("dark");
    }
  };

  const getCurrentColors = (): ThemeColors => {
    if (customTheme) {
      return customTheme.colors;
    }

    if (theme === "auto") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const defaultTheme = availableThemes.find((t) =>
        prefersDark ? t.id === "dark-default" : t.id === "light-default"
      );
      return defaultTheme?.colors || defaultThemes[0].colors;
    }

    const defaultTheme = availableThemes.find((t) =>
      theme === "dark" ? t.id === "dark-default" : t.id === "light-default"
    );
    return defaultTheme?.colors || defaultThemes[0].colors;
  };

  const value: ThemeContextType = {
    theme,
    customTheme,
    availableThemes,
    setTheme,
    setCustomTheme,
    createCustomTheme,
    deleteCustomTheme,
    getCurrentColors,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
