export interface OutputLine {
  text: string
  className?: string
  /** If set, the text is rendered as an anchor with this href */
  href?: string
}

export interface TerminalContext {
  clearOutput: () => void
}

export interface CommandDef {
  name: string
  description: string
  execute: (args: string[], ctx: TerminalContext) => OutputLine[]
}

export class CommandRegistry {
  private commands = new Map<string, CommandDef>()

  register(def: CommandDef): void {
    this.commands.set(def.name, def)
  }

  execute(input: string, ctx: TerminalContext): OutputLine[] {
    const trimmed = input.trim()
    if (!trimmed) return []

    const [name, ...args] = trimmed.split(/\s+/)
    const cmd = this.commands.get(name.toLowerCase())

    if (!cmd) {
      return [
        {
          text: `command not found: ${name}  —  type 'help' for available commands.`,
          className: 'error',
        },
      ]
    }

    return cmd.execute(args, ctx)
  }

  getNames(): string[] {
    return [...this.commands.keys()].sort()
  }

  getAll(): CommandDef[] {
    return [...this.commands.values()].sort((a, b) => a.name.localeCompare(b.name))
  }
}
