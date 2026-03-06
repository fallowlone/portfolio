import type { CommandDef, OutputLine } from "./registry";
import { THEMES } from "../theme";

/**
 * theme          — list all available themes, marking the current one
 * theme <name>   — switch to named theme
 */
export function createThemeCommand(
  getTheme: () => string,
  applyTheme: (name: string) => boolean,
): CommandDef {
  return {
    name: "theme",
    description: "Switch colour theme  (usage: theme [name])",
    argSuggestions: (partial: string): string[] =>
      Object.keys(THEMES).filter((k) => k.startsWith(partial)),

    execute: (args, _ctx): OutputLine[] => {
      // ── No argument: list all themes ───────────────────────────────────────
      if (args.length === 0) {
        const lines: OutputLine[] = [
          {
            text: "╔══════════════════════════════════════════╗",
            className: "separator",
          },
          {
            text: "║              THEMES                      ║",
            className: "accent",
          },
          {
            text: "╚══════════════════════════════════════════╝",
            className: "separator",
          },
          { text: "" },
        ];

        for (const [key, def] of Object.entries(THEMES)) {
          const active = key === getTheme();
          const marker = active ? "▶ " : "  ";
          const name = key.padEnd(10);
          lines.push({
            text: `${marker}${name}  ${def.label}`,
            className: active ? "accent" : "output-line",
          });
        }

        lines.push({ text: "" });
        lines.push({
          text: "  Usage:  theme <name>   e.g.  theme amber",
          className: "dim",
        });
        lines.push({ text: "" });
        return lines;
      }

      // ── With argument: apply theme ─────────────────────────────────────────
      const name = args[0].toLowerCase();
      const ok = applyTheme(name);

      if (!ok) {
        return [
          { text: "" },
          { text: `  Unknown theme: "${name}"`, className: "error" },
          { text: "  Run  theme  to see available themes.", className: "dim" },
          { text: "" },
        ];
      }

      return [
        { text: "" },
        { text: `  Theme set to: ${name}`, className: "accent" },
        { text: "  Preference saved.", className: "dim" },
        { text: "" },
      ];
    },
  };
}
