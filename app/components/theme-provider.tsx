"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  THEME_CYCLE,
  applyThemeMode,
  readStoredThemeMode,
  type ThemeMode,
  writeThemeMode,
} from "@/lib/theme";

type ThemeContextValue = {
  mode: ThemeMode;
  cycle: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: "system",
  cycle: () => {},
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onMediaChange = () => {
    applyThemeMode(readStoredThemeMode());
    onStoreChange();
  };

  media.addEventListener("change", onMediaChange);

  return () => {
    listeners.delete(onStoreChange);
    media.removeEventListener("change", onMediaChange);
  };
}

function getSnapshot(): ThemeMode {
  return readStoredThemeMode();
}

function getServerSnapshot(): ThemeMode {
  return "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    applyThemeMode(mode);
  }, [mode]);

  const cycle = useCallback(() => {
    const index = THEME_CYCLE.indexOf(mode);
    const next = THEME_CYCLE[(index + 1) % THEME_CYCLE.length];
    writeThemeMode(next);
    notifyListeners();
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, cycle }}>
      {children}
    </ThemeContext.Provider>
  );
}
