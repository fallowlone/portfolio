import type { CommandDef, OutputLine } from "./registry";

export const whoamiCommand: CommandDef = {
  name: "whoami",
  description: "One-line identity",
  manPage: `NAME
    whoami — display current user identity

SYNOPSIS
    whoami

DESCRIPTION
    Prints a brief one-line identity summary.

SEE ALSO
    about(1), links(1)`,

  execute: (_args, _ctx): OutputLine[] => [
    { text: "" },
    { text: "  fallowlone", className: "accent" },
    { text: "" },
    {
      text: "  Full Stack TS/JS developer. Germany. Open to work.",
      className: "welcome-info",
    },
    {
      text: "  github.com/fallowlone · linkedin.com/in/artem-hrechuk",
      className: "dim",
    },
    { text: "" },
  ],
};
