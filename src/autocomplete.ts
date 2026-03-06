export class Autocomplete {
  constructor(private getNames: () => string[]) {}

  /**
   * Returns the single completed command name if exactly one match exists,
   * or null if there are zero or multiple matches.
   */
  complete(partial: string): string | null {
    if (!partial.trim()) return null
    const matches = this.suggestions(partial)
    return matches.length === 1 ? matches[0] : null
  }

  /** Returns all command names that start with the given prefix. */
  suggestions(partial: string): string[] {
    if (!partial.trim()) return this.getNames()
    const lower = partial.toLowerCase()
    return this.getNames().filter((n) => n.startsWith(lower))
  }
}
