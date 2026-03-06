export class CommandHistory {
  private history: string[] = []
  private index = -1 // -1 means "current (empty/new) input"

  push(command: string): void {
    const trimmed = command.trim()
    if (!trimmed) return
    // Avoid consecutive duplicates
    if (this.history[this.history.length - 1] !== trimmed) {
      this.history.push(trimmed)
    }
    this.index = -1 // Reset pointer on new entry
  }

  /** Returns the previous command (Up arrow). Pass current input to preserve it if needed. */
  navigateUp(): string {
    if (this.history.length === 0) return ''
    if (this.index === -1) {
      this.index = this.history.length - 1
    } else if (this.index > 0) {
      this.index--
    }
    return this.history[this.index]
  }

  /** Returns the next command (Down arrow), or empty string when at the end. */
  navigateDown(): string {
    if (this.index === -1) return ''
    this.index++
    if (this.index >= this.history.length) {
      this.index = -1
      return ''
    }
    return this.history[this.index]
  }

  reset(): void {
    this.index = -1
  }
}
