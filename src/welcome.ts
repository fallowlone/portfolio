import type { OutputLine } from "./commands/registry";

// ASCII art generated with figlet "Big" font for "Artem Hrechuk"
// Desktop: full wide art (~72 chars) — hidden on mobile via .desktop-only CSS class
// Mobile:  compact box header    (~28 chars) — hidden on desktop via .mobile-only CSS class
export const WELCOME_LINES: OutputLine[] = [
  // ── Desktop ASCII art (hidden on small screens) ───────────────────────────
  {
    text: "    _         _                 _   _               _           _  ",
    className: "ascii-art desktop-only",
  },
  {
    text: "   / \\   _ __| |_ ___ _ __ ___ | | | |_ __ ___  ___| |__  _   _| | __",
    className: "ascii-art desktop-only",
  },
  {
    text: "  / _ \\ | '__| __/ _ \\ '_ ` _ \\| |_| | '__/ _ \\/ __| '_ \\| | | | |/ /",
    className: "ascii-art desktop-only",
  },
  {
    text: " / ___ \\| |  | ||  __/ | | | | |  _  | | |  __/ (__| | | | |_| |   < ",
    className: "ascii-art desktop-only",
  },
  {
    text: "/_/   \\_\\_|   \\__\\___|_| |_| |_|_| |_|_|  \\___|\\___|_| |_|\\__,_|_|\\_\\",
    className: "ascii-art desktop-only",
  },

  // ── Mobile header (hidden on large screens) ───────────────────────────────
  {
    text: "  ╔══════════════════════════╗",
    className: "separator mobile-only",
  },
  { text: "  ║   ARTEM  HRECHUK        ║", className: "accent mobile-only" },
  {
    text: "  ║   Full Stack Developer   ║",
    className: "welcome-info mobile-only",
  },
  {
    text: "  ╚══════════════════════════╝",
    className: "separator mobile-only",
  },

  // ── Common lines (always visible) ────────────────────────────────────────
  { text: "" },
  { text: "  terminal-portfolio v1.0.0", className: "welcome-info" },
  {
    text: "  ─────────────────────────────────────────────────────",
    className: "dim desktop-only",
  },
  {
    text: "  ────────────────────────────",
    className: "dim mobile-only",
  },
  {
    text: "  Software Engineer & Developer",
    className: "welcome-info desktop-only",
  },
  {
    text: "  Based in Germany · §24 permit · Open to EU roles",
    className: "dim desktop-only",
  },
  { text: "" },
  {
    text: "  Type  help      to see available commands.",
    className: "accent",
    cmd: "help",
  },
  {
    text: "  Type  neofetch  for system info.",
    className: "dim",
    cmd: "neofetch",
  },
  {
    text: "  Use   Tab   for autocomplete,  ↑/↓   for history.",
    className: "dim desktop-only",
  },
  {
    text: "  Tap  TAB ↑ ↓  buttons below to navigate.",
    className: "dim mobile-only",
  },
  { text: "" },
];
