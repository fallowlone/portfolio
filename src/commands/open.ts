import type { CommandDef, OutputLine } from './registry'
import { PROJECTS } from './projects'

export function createOpenCommand(): CommandDef {
  return {
    name: 'open',
    description: 'Open project URL in new tab  (usage: open <N>)',
    manPage: `NAME
    open — open a project URL in a new browser tab

SYNOPSIS
    open <N>

DESCRIPTION
    Opens the URL for project number N in a new browser tab.
    Run  projects  to see the list of projects and their numbers.

EXAMPLES
    open 1
    open 2

SEE ALSO
    projects(1)`,

    argSuggestions: (partial: string): string[] =>
      PROJECTS.map((_, i) => String(i + 1)).filter((s) => s.startsWith(partial)),

    execute: (args, _ctx): OutputLine[] => {
      if (args.length === 0) {
        return [
          { text: '' },
          { text: '  Usage: open <N>  (see projects for numbers)', className: 'dim' },
          { text: '' },
        ]
      }

      const n = parseInt(args[0], 10)

      if (isNaN(n) || n < 1 || n > PROJECTS.length) {
        return [
          { text: '' },
          { text: `  Invalid project number: "${args[0]}"`, className: 'error' },
          { text: `  Valid range: 1–${PROJECTS.length}  (run projects to see list)`, className: 'dim' },
          { text: '' },
        ]
      }

      const project = PROJECTS[n - 1]
      window.open(project.url, '_blank', 'noopener,noreferrer')

      return [
        { text: '' },
        { text: `  Opening ${project.name}...`, className: 'accent' },
        { text: `  ${project.url}`, className: 'dim' },
        { text: '' },
      ]
    },
  }
}
