import type { CommandDef, OutputLine } from "./registry";
import type { CommandRegistry } from "./registry";

export function createManCommand(registry: CommandRegistry): CommandDef {
  return {
    name: "man",
    description: "Show manual page for a command  (usage: man <command>)",
    manPage: `NAME
    man — display manual for a command

SYNOPSIS
    man <command>

DESCRIPTION
    Shows the manual page for the given command if one exists.
    Not all commands have manual entries.

EXAMPLES
    man theme
    man projects
    man about

SEE ALSO
    help(1)`,

    argSuggestions: (partial: string): string[] =>
      registry.getNames().filter((n) => n.startsWith(partial)),

    execute: (args, _ctx): OutputLine[] => {
      if (args.length === 0) {
        return [
          { text: "" },
          { text: "  What manual page do you want?", className: "error" },
          { text: "  Usage: man <command>", className: "dim" },
          { text: "" },
        ];
      }

      const name = args[0].toLowerCase();
      const cmd = registry.get(name);

      if (!cmd || !cmd.manPage) {
        return [
          { text: "" },
          { text: `  No manual entry for ${name}`, className: "error" },
          { text: "" },
        ];
      }

      const lines: OutputLine[] = [{ text: "" }];
      for (const line of cmd.manPage.split("\n")) {
        // Section headers (all-caps lines like "NAME", "SYNOPSIS") get accent colour
        const trimmed = line.trim();
        const isHeader =
          /^[A-Z ]+$/.test(trimmed) &&
          trimmed.length > 0 &&
          !trimmed.includes("(");
        lines.push({
          text: line,
          className: isHeader ? "accent" : "output-line",
        });
      }
      lines.push({ text: "" });
      return lines;
    },
  };
}
