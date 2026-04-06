import type { CommandDef, OutputLine } from "./registry";

interface SkillCategory {
  label: string;
  skills: string;
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    label: "Frontend  ",
    skills: "TypeScript · JavaScript · React · Next.js · React Native",
  },
  {
    label: "Backend   ",
    skills: "Node.js · tRPC · NestJS (learning) · REST · WebSocket",
  },
  { label: "Database  ", skills: "PostgreSQL · Prisma · SQL basics" },
  {
    label: "Tooling   ",
    skills: "Git · Vite · ESBuild · Docker (basics) · Linux/CLI",
  },
  { label: "Currently ", skills: "NestJS · System Design · German (B1)" },
];

export const skillsCommand: CommandDef = {
  name: "skills",
  description: "My technical skills by category",
  manPage: `NAME
    skills — display technical skills

SYNOPSIS
    skills

DESCRIPTION
    Outputs a categorised table of technical skills across
    Frontend, Backend, Database, Tooling, and current learning.

SEE ALSO
    about(1), projects(1)`,

  execute: (_args, _ctx): OutputLine[] => {
    const lines: OutputLine[] = [
      {
        text: "╔══════════════════════════════════════════════════════════╗",
        className: "separator",
      },
      {
        text: "║                   TECHNICAL SKILLS                       ║",
        className: "accent",
      },
      {
        text: "╠══════════════════════════════════════════════════════════╣",
        className: "separator",
      },
      { text: "" },
    ];

    for (const cat of SKILL_CATEGORIES) {
      lines.push({
        text: `  ${cat.label}  ${cat.skills}`,
        className:
          cat.label.trim() === "Currently" ? "welcome-info" : "output-line",
      });
    }

    lines.push({ text: "" });
    lines.push({
      text: "╚══════════════════════════════════════════════════════════╝",
      className: "separator",
    });
    lines.push({ text: "" });
    lines.push({
      text: "  Run  about  for background, or  projects  to see my work.",
      className: "dim",
    });
    lines.push({ text: "" });

    return lines;
  },
};
