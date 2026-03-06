import type { CommandDef, OutputLine } from './registry'
import type { CommandRegistry } from './registry'

export function createHelpCommand(registry: CommandRegistry): CommandDef {
  return {
    name: 'help',
    description: 'Show available commands',
    execute: (_args, _ctx): OutputLine[] => {
      const all = registry.getAll()
      const lines: OutputLine[] = [
        { text: 'Available commands:', className: 'accent' },
        { text: '' },
      ]

      for (const cmd of all) {
        const padded = cmd.name.padEnd(12)
        lines.push({ text: `  ${padded}  ${cmd.description}` })
      }

      lines.push({ text: '' })
      lines.push({ text: 'Tip: Use Tab to autocomplete, ↑/↓ to navigate history.', className: 'dim' })
      return lines
    },
  }
}
