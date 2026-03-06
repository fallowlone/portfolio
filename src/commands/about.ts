import type { CommandDef, OutputLine } from './registry'

export const aboutCommand: CommandDef = {
  name: 'about',
  description: 'About me',
  execute: (_args, _ctx): OutputLine[] => [
    { text: '╔══════════════════════════════════════════╗', className: 'separator' },
    { text: '║              ABOUT ME                    ║', className: 'accent' },
    { text: '╚══════════════════════════════════════════╝', className: 'separator' },
    { text: '' },
    { text: '  Name       Artem Hrechuk' },
    { text: '  Role       Software Engineer' },
    { text: '  Location   —' },
    { text: '' },
    { text: '  Hi! I\'m a software engineer passionate about building', className: 'welcome-info' },
    { text: '  clean, performant, and user-friendly applications.', className: 'welcome-info' },
    { text: '' },
    { text: '  I work with modern web technologies and love solving', className: 'welcome-info' },
    { text: '  complex problems with elegant solutions.', className: 'welcome-info' },
    { text: '' },
    { text: '  Run  projects  to see my work, or  links  to connect.', className: 'dim' },
    { text: '' },
  ],
}
