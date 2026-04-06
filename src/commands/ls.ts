import type { CommandDef, OutputLine } from "./registry";

export const lsCommand: CommandDef = {
  name: "ls",
  description: "List directory contents",
  manPage: `NAME
    ls — list directory contents

SYNOPSIS
    ls

DESCRIPTION
    Lists the virtual directory structure of this portfolio.
    Type a folder name as a command to explore it.

SEE ALSO
    about(1), skills(1), projects(1), experience(1)`,

  execute: (_args, _ctx): OutputLine[] => [
    { text: "" },
    { text: "  drwxr-xr-x  projects/     — my work", className: "accent" },
    {
      text: "  drwxr-xr-x  skills/       — technical stack",
      className: "accent",
    },
    { text: "  drwxr-xr-x  experience/   — work history", className: "accent" },
    { text: "  -rw-r--r--  README.md     — about me" },
    {
      text: "  -rw-r--r--  cv.pdf        — resume (coming soon)",
      className: "dim",
    },
    { text: "" },
    {
      text: "  Tip: type the folder name as a command to explore.",
      className: "dim",
    },
    { text: "" },
  ],
};
