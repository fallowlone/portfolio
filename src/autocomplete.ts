import type { CommandRegistry } from "./commands/registry";

/**
 * Argument-aware Tab completion.
 *
 * Two modes based on whether the input contains a space:
 *
 * 1. Command mode  — "th"        → complete command name
 * 2. Argument mode — "theme am"  → complete argument via command's argSuggestions()
 *
 * Both `complete()` and `suggestions()` always return/operate on the
 * **full input string** (not just the word being completed), so the
 * caller can do `setInput(complete(partial))` without any extra logic.
 */
export class Autocomplete {
  constructor(private registry: CommandRegistry) {}

  /**
   * Returns the completed full input string if exactly one match exists,
   * or null if there are zero or multiple matches.
   */
  complete(input: string): string | null {
    const matches = this.suggestions(input);
    if (matches.length !== 1) return null;

    const hasArg = input.includes(" ");
    if (hasArg) {
      // Replace just the argument part, preserve the command word + space
      const spaceIdx = input.indexOf(" ");
      const cmdPart = input.slice(0, spaceIdx + 1); // "theme "
      return cmdPart + matches[0];
    }

    return matches[0];
  }

  /**
   * Returns all suggestions for the current input.
   * In argument mode, returns argument values (not full strings).
   * In command mode, returns command names.
   */
  suggestions(input: string): string[] {
    const hasArg = input.includes(" ");

    if (!hasArg) {
      // ── Command-name completion ──────────────────────────────────────────
      if (!input.trim()) return this.registry.getNames();
      const lower = input.toLowerCase();
      return this.registry.getNames().filter((n) => n.startsWith(lower));
    }

    // ── Argument completion ──────────────────────────────────────────────
    const spaceIdx = input.indexOf(" ");
    const cmdName = input.slice(0, spaceIdx).toLowerCase();
    const argPart = input.slice(spaceIdx + 1); // may be empty string

    const cmd = this.registry.get(cmdName);
    if (!cmd?.argSuggestions) return [];

    const all = cmd.argSuggestions(argPart);

    // Filter by prefix if the user has started typing the argument
    if (!argPart) return all;
    return all.filter((s) => s.startsWith(argPart));
  }
}
