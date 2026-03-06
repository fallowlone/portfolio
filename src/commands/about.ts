import type { CommandDef, OutputLine } from './registry'

export const aboutCommand: CommandDef = {
  name: 'about',
  description: 'About me',
  animated: true,
  manPage: `NAME
    about — display personal information

SYNOPSIS
    about

DESCRIPTION
    Shows information about Artem Hrechuk including name,
    handle, location, bio, and technical interests.

SEE ALSO
    skills(1), projects(1), links(1)`,

  execute: (_args, _ctx): OutputLine[] => [
    { text: '╔══════════════════════════════════════════╗', className: 'separator' },
    { text: '║              ABOUT ME                    ║', className: 'accent' },
    { text: '╚══════════════════════════════════════════╝', className: 'separator' },
    { text: '' },
    { text: '  Name       Artem Hrechuk' },
    { text: '  Handle     Fallowlone' },
    { text: '  Location   Germany  (originally from Ukraine)' },
    { text: '' },
    { text: '  Full Stack JS/TS developer with ~9 months commercial', className: 'welcome-info' },
    { text: '  experience. Built the R.Toys e-commerce platform at', className: 'welcome-info' },
    { text: '  Pinta Webware — Next.js, tRPC, Prisma, PostgreSQL,', className: 'welcome-info' },
    { text: '  and React Native in a monorepo architecture.', className: 'welcome-info' },
    { text: '' },
    { text: '  Interests:', className: 'accent' },
    { text: '    · Low-level programming  · CLI tooling' },
    { text: '    · Encryption & security  · Clean architecture' },
    { text: '' },
    { text: '  Run  skills / projects / links  for more.', className: 'dim' },
    { text: '' },
  ],
}
