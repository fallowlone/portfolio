/**
 * ThemeManager
 *
 * Applies colour themes and font choices by writing CSS custom properties
 * onto <html> and persists the selection in localStorage.
 *
 * How it works:
 *   - Every colour in main.css uses a CSS variable (--c-primary, --c-accent, …)
 *   - Switching a theme overwrites those variables on :root via JS
 *   - Google Fonts are loaded lazily (one <link> per font, only when first used)
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ThemeDef {
  /** Human-readable label shown in `theme` command output */
  label: string;
  /** Main text colour */
  primary: string;
  /** Accent / heading colour */
  accent: string;
  /** Dim / muted colour */
  dim: string;
  /** Error colour */
  error: string;
  /** Terminal background (semi-transparent overlay on top of canvas) */
  bgTerminal: string;
  /** Page background (behind canvas) */
  bgPage: string;
  /** Input-row border colour */
  border: string;
  /** Separator / box-drawing colour */
  separator: string;
  /** Link / href colour */
  link: string;
  /** Matrix rain primary colour (passed to MatrixRain via CSS var) */
  matrixColor: string;
  /** Matrix rain head/bright colour */
  matrixHead: string;
}

export interface FontDef {
  label: string;
  /** CSS font-family value */
  family: string;
  /** Google Fonts URL, or null if it's a system font */
  googleFontsUrl: string | null;
}

// ── Theme catalogue ────────────────────────────────────────────────────────────

export const THEMES: Record<string, ThemeDef> = {
  matrix: {
    label: "Matrix (green)",
    primary: "#00ff41",
    accent: "#00ffaa",
    dim: "#005500",
    error: "#ff3333",
    bgTerminal: "rgba(0,0,0,0.82)",
    bgPage: "#000000",
    border: "#002200",
    separator: "#003300",
    link: "#ffb000",
    matrixColor: "#00ff41",
    matrixHead: "#ccffcc",
  },
  amber: {
    label: "Amber (retro CRT)",
    primary: "#ffb000",
    accent: "#ffd060",
    dim: "#5a3a00",
    error: "#ff4444",
    bgTerminal: "rgba(10,5,0,0.88)",
    bgPage: "#0a0500",
    border: "#3a2000",
    separator: "#2a1800",
    link: "#00ffaa",
    matrixColor: "#cc8800",
    matrixHead: "#ffe080",
  },
  cyan: {
    label: "Cyan (hacker blue)",
    primary: "#00d4ff",
    accent: "#80eeff",
    dim: "#004455",
    error: "#ff4466",
    bgTerminal: "rgba(0,5,15,0.88)",
    bgPage: "#00050f",
    border: "#003344",
    separator: "#002233",
    link: "#ffb000",
    matrixColor: "#00aacc",
    matrixHead: "#aaf0ff",
  },
  white: {
    label: "White (light)",
    primary: "#1a1a1a",
    accent: "#005500",
    dim: "#888888",
    error: "#cc0000",
    bgTerminal: "rgba(245,245,240,0.96)",
    bgPage: "#f0f0e8",
    border: "#cccccc",
    separator: "#aaaaaa",
    link: "#0055cc",
    matrixColor: "#00aa00",
    matrixHead: "#ccffcc",
  },
};

// ── Font catalogue ─────────────────────────────────────────────────────────────

export const FONTS: Record<string, FontDef> = {
  courier: {
    label: "Courier New (built-in)",
    family: "'Courier New', 'Lucida Console', monospace",
    googleFontsUrl: null,
  },
  jetbrains: {
    label: "JetBrains Mono",
    family: "'JetBrains Mono', monospace",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap",
  },
  fira: {
    label: "Fira Code",
    family: "'Fira Code', monospace",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap",
  },
  ibm: {
    label: "IBM Plex Mono",
    family: "'IBM Plex Mono', monospace",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap",
  },
};

// ── Storage keys ───────────────────────────────────────────────────────────────

const LS_THEME = "terminal-theme";
const LS_FONT = "terminal-font";

// ── Manager class ──────────────────────────────────────────────────────────────

export class ThemeManager {
  private currentTheme: string;
  private currentFont: string;

  constructor() {
    // Restore saved preferences, falling back to defaults
    this.currentTheme = localStorage.getItem(LS_THEME) ?? "matrix";
    this.currentFont = localStorage.getItem(LS_FONT) ?? "courier";

    this.applyTheme(this.currentTheme);
    this.applyFont(this.currentFont);
  }

  // ── Theme ──────────────────────────────────────────────────────────────────

  applyTheme(name: string): boolean {
    const def = THEMES[name];
    if (!def) return false;

    const root = document.documentElement;

    root.style.setProperty("--c-primary", def.primary);
    root.style.setProperty("--c-accent", def.accent);
    root.style.setProperty("--c-dim", def.dim);
    root.style.setProperty("--c-error", def.error);
    root.style.setProperty("--c-bg-terminal", def.bgTerminal);
    root.style.setProperty("--c-bg-page", def.bgPage);
    root.style.setProperty("--c-border", def.border);
    root.style.setProperty("--c-separator", def.separator);
    root.style.setProperty("--c-link", def.link);
    root.style.setProperty("--c-matrix", def.matrixColor);
    root.style.setProperty("--c-matrix-head", def.matrixHead);

    this.currentTheme = name;
    localStorage.setItem(LS_THEME, name);
    return true;
  }

  getTheme(): string {
    return this.currentTheme;
  }

  // ── Font ───────────────────────────────────────────────────────────────────

  applyFont(name: string): boolean {
    const def = FONTS[name];
    if (!def) return false;

    // Lazily inject the Google Fonts <link> if not already present
    if (
      def.googleFontsUrl &&
      !document.querySelector(`link[href="${def.googleFontsUrl}"]`)
    ) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = def.googleFontsUrl;
      document.head.appendChild(link);
    }

    document.documentElement.style.setProperty("--font-mono", def.family);

    this.currentFont = name;
    localStorage.setItem(LS_FONT, name);
    return true;
  }

  getFont(): string {
    return this.currentFont;
  }
}
