import type { CommandDef, OutputLine } from './registry'

interface Link {
  label: string
  url: string
  description: string
}

const LINKS: Link[] = [
  {
    label: 'GitHub',
    url: 'https://github.com/artmac',
    description: 'Source code & open source contributions',
  },
  {
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/artmac',
    description: 'Professional profile',
  },
  {
    label: 'Email',
    url: 'mailto:artem@example.com',
    description: 'Get in touch',
  },
]

export const linksCommand: CommandDef = {
  name: 'links',
  description: 'Social links and contact info',
  execute: (_args, _ctx): OutputLine[] => {
    const lines: OutputLine[] = [
      { text: '╔══════════════════════════════════════════╗', className: 'separator' },
      { text: '║               LINKS                      ║', className: 'accent' },
      { text: '╚══════════════════════════════════════════╝', className: 'separator' },
      { text: '' },
    ]

    LINKS.forEach((link) => {
      const label = link.label.padEnd(10)
      lines.push({ text: `  ${label}  ${link.description}`, className: 'accent' })
      lines.push({ text: `  ${''.padEnd(10)}  ${link.url}`, href: link.url })
      lines.push({ text: '' })
    })

    return lines
  },
}
