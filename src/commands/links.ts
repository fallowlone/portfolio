import type { CommandDef, OutputLine } from "./registry";

interface Link {
  label: string;
  url: string;
  description: string;
}

const LINKS: Link[] = [
  {
    label: "GitHub",
    url: "https://github.com/fallowlone",
    description: "Fallowlone on GitHub",
  },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/artem-hrechuk",
    description: "Full Stack Developer · Based in Germany",
  },
  {
    label: "Email",
    url: "mailto:hrechuk.artem@gmail.com",
    description: "hrechuk.artem@gmail.com",
  },
];

export const linksCommand: CommandDef = {
  name: "links",
  description: "Social links and contact info",
  manPage: `NAME
    links — display contact and social links

SYNOPSIS
    links

DESCRIPTION
    Shows GitHub, LinkedIn, and other contact links
    for Artem Hrechuk (Fallowlone).

SEE ALSO
    about(1)`,

  execute: (_args, _ctx): OutputLine[] => {
    const lines: OutputLine[] = [
      {
        text: "╔══════════════════════════════════════════╗",
        className: "separator",
      },
      {
        text: "║               LINKS                      ║",
        className: "accent",
      },
      {
        text: "╚══════════════════════════════════════════╝",
        className: "separator",
      },
      { text: "" },
    ];

    LINKS.forEach((link) => {
      const label = link.label.padEnd(10);
      lines.push({
        text: `  ${label}  ${link.description}`,
        className: "accent",
      });
      lines.push({ text: `  ${"".padEnd(10)}  ${link.url}`, href: link.url });
      lines.push({ text: "" });
    });

    return lines;
  },
};
