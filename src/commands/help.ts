import type { CommandDef, OutputLine } from "./registry";
import type { CommandRegistry } from "./registry";

export function createHelpCommand(registry: CommandRegistry): CommandDef {
  return {
    name: "help",
    description: "Show available commands",
    manPage: `NAME
    help — list all available commands

SYNOPSIS
    help

DESCRIPTION
    Displays a list of all available commands with their
    short descriptions. Hidden/internal commands are excluded.

SEE ALSO
    man(1)`,

    execute: (_args, _ctx): OutputLine[] => {
      const all = registry.getAll().filter((cmd) => !cmd.hidden);
      const lines: OutputLine[] = [
        { text: "Available commands:", className: "accent" },
        { text: "" },
      ];

      for (const cmd of all) {
        const padded = cmd.name.padEnd(12);
        lines.push({ text: `  ${padded}  ${cmd.description}` });
      }

      lines.push({ text: "" });
      lines.push({
        text: "  Tip: man <command> for detailed help.",
        className: "dim",
      });
      lines.push({
        text: "Use Tab to autocomplete, ↑/↓ to navigate history.",
        className: "dim",
      });
      return lines;
    },
  };
}
