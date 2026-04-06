import type { CommandDef, OutputLine } from "./registry";
import type { CommandHistory } from "../history";

export function createHistoryCommand(history: CommandHistory): CommandDef {
  return {
    name: "history",
    description: "Show command history",
    manPage: `NAME
    history — display command history

SYNOPSIS
    history
    history clear

DESCRIPTION
    Shows the list of previously executed commands stored in
    the current session. Use "history clear" to wipe history.

SEE ALSO
    help(1)`,

    argSuggestions: () => ["clear"],

    execute: (args, _ctx): OutputLine[] => {
      if (args[0] === "clear") {
        history.clear();
        return [{ text: "  History cleared.", className: "dim" }];
      }

      const all = history.getAll();
      if (all.length === 0) {
        return [{ text: "  No commands in history.", className: "dim" }];
      }

      const lines: OutputLine[] = [{ text: "" }];
      all.forEach((cmd, i) => {
        const num = String(i + 1).padStart(4);
        lines.push({ text: `  ${num}  ${cmd}`, className: undefined });
      });
      lines.push({ text: "" });
      return lines;
    },
  };
}
