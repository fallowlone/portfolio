import type { CommandDef, OutputLine } from "./registry";

export const experienceCommand: CommandDef = {
  name: "experience",
  description: "Work history timeline",
  animated: true,
  manPage: `NAME
    experience — display work history timeline

SYNOPSIS
    experience

DESCRIPTION
    Shows a chronological timeline of professional experience
    including roles, technologies, and duration.

SEE ALSO
    about(1), skills(1), cv(1)`,

  execute: (_args, _ctx): OutputLine[] => [
    {
      text: "╔══════════════════════════════════════════════════════════╗",
      className: "separator",
    },
    {
      text: "║                   EXPERIENCE                             ║",
      className: "accent",
    },
    {
      text: "╚══════════════════════════════════════════════════════════╝",
      className: "separator",
    },
    { text: "" },
    { text: "  2024 Nov ──▶ 2025 Oct   Pinta Webware", className: "accent" },
    { text: "  Full Stack Developer · 12 months", className: "welcome-info" },
    {
      text: "  Next.js · tRPC · Prisma · PostgreSQL · React Native",
      className: "dim",
    },
    { text: "  Monorepo architecture, e-commerce platform", className: "dim" },
    { text: "" },
    { text: "  2024 Sep ──▶ 2025 Jul   EvoPlay", className: "accent" },
    {
      text: "  Frontend Developer (Freelance) · 11 months",
      className: "welcome-info",
    },
    { text: "  React · TypeScript", className: "dim" },
    { text: "" },
    { text: "  2024 Mar ──▶ 2024 Jul   IT STEP Academy", className: "accent" },
    { text: "  Mentor · 5 months", className: "welcome-info" },
    { text: "  JavaScript · Frontend fundamentals", className: "dim" },
    { text: "" },
    { text: "  2023 Dec ──▶ 2024 Mar   Eco-Bike", className: "accent" },
    { text: "  Backend Developer · 3 months", className: "welcome-info" },
    { text: "  NestJS · JWT · MongoDB · Wayforpay", className: "dim" },
    { text: "" },
    { text: "  2023 May ──▶ 2023 Oct   Aurora CRM", className: "accent" },
    { text: "  SQL Developer · 6 months", className: "welcome-info" },
    { text: "  SQL · Data management", className: "dim" },
    { text: "" },
    { text: "  Total commercial experience: ~2.5 years", className: "accent" },
    { text: "" },
  ],
};
