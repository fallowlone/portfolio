import type { CommandDef } from "./registry";

export const clearCommand: CommandDef = {
  name: "clear",
  description: "Clear the terminal output",
  manPage: `NAME
    clear — clear the terminal output

SYNOPSIS
    clear

DESCRIPTION
    Clears all output from the terminal screen and shows
    the welcome message again.

    Keyboard shortcut: Ctrl+L

SEE ALSO
    help(1)`,

  execute: (_args, ctx) => {
    ctx.clearOutput();
    return [];
  },
};
