export interface OutputLine {
  text: string;
  className?: string;
  /** If set, the text is rendered as an anchor with this href */
  href?: string;
  /** If set, clicking the text runs this command */
  cmd?: string;
}

export interface TerminalContext {
  clearOutput: () => void;
}

export interface CommandDef {
  name: string;
  description: string;
  /** If true, command is omitted from `help` output (easter eggs, internals). */
  hidden?: boolean;
  /** Manual page text — displayed by `man <command>`. Multi-line string. */
  manPage?: string;
  /** If true, Terminal uses printLinesAnimated for this command's output. */
  animated?: boolean;
  execute: (args: string[], ctx: TerminalContext) => OutputLine[];
  /**
   * Optional: return argument suggestions for Tab-completion.
   * Called with the partial argument the user has typed so far.
   * e.g. `theme am` → partial = "am" → ["amber"]
   * e.g. `theme ` → partial = "" → all theme names
   */
  argSuggestions?: (partial: string) => string[];
}

export class CommandRegistry {
  private commands = new Map<string, CommandDef>();

  register(def: CommandDef): void {
    this.commands.set(def.name, def);
  }

  execute(input: string, ctx: TerminalContext): OutputLine[] {
    const trimmed = input.trim();
    if (!trimmed) return [];

    const [name, ...args] = trimmed.split(/\s+/);
    const cmd = this.commands.get(name.toLowerCase());

    if (!cmd) {
      return [
        {
          text: `command not found: ${name}  —  type 'help' for available commands.`,
          className: "error",
        },
      ];
    }

    return cmd.execute(args, ctx);
  }

  get(name: string): CommandDef | undefined {
    return this.commands.get(name);
  }

  getNames(): string[] {
    return [...this.commands.keys()].sort();
  }

  getAll(): CommandDef[] {
    return [...this.commands.values()].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }
}
