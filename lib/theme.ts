export type ThemeMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";

export const THEME_CYCLE: ThemeMode[] = ["light", "dark", "system"];

export function themeInlineScript(): string {
  return `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
}

export function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function readStoredThemeMode(): ThemeMode {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

export function resolveIsDark(mode: ThemeMode): boolean {
  return mode === "dark" || (mode === "system" && systemPrefersDark());
}

export function applyThemeMode(mode: ThemeMode): void {
  document.documentElement.classList.toggle("dark", resolveIsDark(mode));
}

export function writeThemeMode(mode: ThemeMode): void {
  if (mode === "system") {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } else {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }
  applyThemeMode(mode);
}
