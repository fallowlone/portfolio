import type { CommandDef, OutputLine } from './registry'

interface Project {
  name: string
  description: string
  tech: string[]
  url: string
}

const PROJECTS: Project[] = [
  {
    name: 'terminal-portfolio',
    description: 'This portfolio — a terminal emulator with Matrix rain',
    tech: ['TypeScript', 'Vite', 'Canvas API'],
    url: 'https://github.com/artmac/terminal-portfolio',
  },
  {
    name: 'project-two',
    description: 'Short description of what this project does',
    tech: ['React', 'Node.js', 'PostgreSQL'],
    url: 'https://github.com/artmac/project-two',
  },
  {
    name: 'project-three',
    description: 'Another cool project you built',
    tech: ['Go', 'Docker'],
    url: 'https://github.com/artmac/project-three',
  },
]

export const projectsCommand: CommandDef = {
  name: 'projects',
  description: 'List my projects',
  execute: (_args, _ctx): OutputLine[] => {
    const lines: OutputLine[] = [
      { text: '╔══════════════════════════════════════════╗', className: 'separator' },
      { text: '║              PROJECTS                    ║', className: 'accent' },
      { text: '╚══════════════════════════════════════════╝', className: 'separator' },
      { text: '' },
    ]

    PROJECTS.forEach((p, i) => {
      lines.push({ text: `  [${i + 1}] ${p.name}`, className: 'accent' })
      lines.push({ text: `      ${p.description}` })
      lines.push({ text: `      Tech:  ${p.tech.join(' · ')}`, className: 'dim' })
      lines.push({ text: `      Link:  ${p.url}`, href: p.url, className: 'output-line' })
      lines.push({ text: '' })
    })

    return lines
  },
}
