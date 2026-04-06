import type { CommandDef, OutputLine } from "./registry";

export const blogCommand: CommandDef = {
  name: "blog",
  description: "Articles and posts (coming soon)",
  manPage: `NAME
    blog — display articles and posts

SYNOPSIS
    blog

DESCRIPTION
    Lists blog posts and articles. Currently a placeholder —
    content coming soon.

SEE ALSO
    links(1)`,

  execute: (_args, _ctx): OutputLine[] => [
    { text: "" },
    { text: "  No posts yet — coming soon.", className: "dim" },
    { text: "" },
    { text: "  In the meantime, follow on LinkedIn:" },
    {
      text: "  linkedin.com/in/artem-hrechuk",
      href: "https://linkedin.com/in/artem-hrechuk",
    },
    { text: "" },
  ],
};
