import type { CommandDef, OutputLine } from './registry'

export interface Project {
  name: string
  description: string
  tech: string[]
  url: string
}

export const PROJECTS: Project[] = [
  {
    name: 'file-encryptor-cli',
    description: 'AES-256-CBC file encryption CLI. Native Node.js crypto — no libraries.',
    tech: ['Node.js', 'TypeScript', 'AES-256-CBC'],
    url: 'https://github.com/fallowlone/file-encryptor-cli',
  },
  // TODO: Phase 2 — RAG/AI Knowledge Base project (coming soon)
]

export const projectsCommand: CommandDef = {
  name: 'projects',
  description: 'List my projects',
  manPage: `NAME
    projects — list GitHub projects

SYNOPSIS
    projects

DESCRIPTION
    Displays a formatted list of projects with descriptions,
    tech stacks, and GitHub links.

    Use  open <N>  to open a project URL in a new browser tab.

SEE ALSO
    open(1), links(1)`,

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
      lines.push({ text: `      Link:  ${p.url}  (run: open ${i + 1})`, href: p.url })
      lines.push({ text: '' })
    })

    return lines
  },
}
