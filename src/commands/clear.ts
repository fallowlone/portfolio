import type { CommandDef } from './registry'

export const clearCommand: CommandDef = {
  name: 'clear',
  description: 'Clear the terminal output',
  execute: (_args, ctx) => {
    ctx.clearOutput()
    return []
  },
}
