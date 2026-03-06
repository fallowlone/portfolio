import type { CommandDef, OutputLine } from "./registry";
import { FONTS } from "../theme";

/**
 * font          — list available fonts, marking the current one
 * font <name>   — switch to named font
 */
export function createFontCommand(
  getFont: () => string,
  applyFont: (name: string) => boolean,
): CommandDef {
  return {
    name: "font",
    description: "Switch terminal font  (usage: font [name])",
    argSuggestions: (partial: string): string[] =>
      Object.keys(FONTS).filter((k) => k.startsWith(partial)),

    execute: (args, _ctx): OutputLine[] => {
      // ── No argument: list fonts ────────────────────────────────────────────
      if (args.length === 0) {
        const lines: OutputLine[] = [
          {
            text: "╔══════════════════════════════════════════╗",
            className: "separator",
          },
          {
            text: "║               FONTS                      ║",
            className: "accent",
          },
          {
            text: "╚══════════════════════════════════════════╝",
            className: "separator",
          },
          { text: "" },
        ];

        for (const [key, def] of Object.entries(FONTS)) {
          const active = key === getFont();
          const marker = active ? "▶ " : "  ";
          const name = key.padEnd(12);
          lines.push({
            text: `${marker}${name}  ${def.label}`,
            className: active ? "accent" : "output-line",
          });
        }

        lines.push({ text: "" });
        lines.push({
          text: "  Usage:  font <name>   e.g.  font jetbrains",
          className: "dim",
        });
        lines.push({ text: "" });
        return lines;
      }

      // ── With argument: apply font ──────────────────────────────────────────
      const name = args[0].toLowerCase();
      const ok = applyFont(name);

      if (!ok) {
        return [
          { text: "" },
          { text: `  Unknown font: "${name}"`, className: "error" },
          { text: "  Run  font  to see available fonts.", className: "dim" },
          { text: "" },
        ];
      }

      return [
        { text: "" },
        { text: `  Font set to: ${name}`, className: "accent" },
        { text: "  Preference saved.", className: "dim" },
        { text: "" },
      ];
    },
  };
}
