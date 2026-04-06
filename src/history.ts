export class CommandHistory {
  private readonly LS_KEY = "terminal-history";
  private history: string[] = [];
  private index = -1; // -1 means "current (empty/new) input"

  constructor() {
    try {
      const saved = localStorage.getItem(this.LS_KEY);
      if (saved) this.history = JSON.parse(saved);
    } catch {
      // ignore parse errors
    }
  }

  push(command: string): void {
    const trimmed = command.trim();
    if (!trimmed) return;
    // Avoid consecutive duplicates
    if (this.history[this.history.length - 1] !== trimmed) {
      this.history.push(trimmed);
    }
    this.index = -1; // Reset pointer on new entry
    this.save();
  }

  private save(): void {
    try {
      localStorage.setItem(
        this.LS_KEY,
        JSON.stringify(this.history.slice(-50)),
      );
    } catch {
      // ignore storage errors
    }
  }

  /** Returns the previous command (Up arrow). Pass current input to preserve it if needed. */
  navigateUp(): string {
    if (this.history.length === 0) return "";
    if (this.index === -1) {
      this.index = this.history.length - 1;
    } else if (this.index > 0) {
      this.index--;
    }
    return this.history[this.index];
  }

  /** Returns the next command (Down arrow), or empty string when at the end. */
  navigateDown(): string {
    if (this.index === -1) return "";
    this.index++;
    if (this.index >= this.history.length) {
      this.index = -1;
      return "";
    }
    return this.history[this.index];
  }

  reset(): void {
    this.index = -1;
  }

  getAll(): string[] {
    return this.history;
  }

  clear(): void {
    this.history = [];
    this.index = -1;
    this.save();
  }
}
