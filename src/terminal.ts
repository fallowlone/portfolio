import type { OutputLine, TerminalContext } from "./commands/registry";
import { CommandRegistry } from "./commands/registry";
import { CommandHistory } from "./history";
import { Autocomplete } from "./autocomplete";
import { WELCOME_LINES } from "./welcome";

/** Maximum output lines kept in DOM. Older lines are pruned automatically. */
const MAX_OUTPUT_LINES = 400;

export class Terminal {
  private outputEl: HTMLElement;
  private inputEl: HTMLInputElement;
  private displayEl: HTMLElement;
  private registry: CommandRegistry;
  private history: CommandHistory;
  private autocomplete: Autocomplete;
  private ctx: TerminalContext;

  constructor(
    outputEl: HTMLElement,
    inputEl: HTMLInputElement,
    displayEl: HTMLElement,
    registry: CommandRegistry,
  ) {
    this.outputEl = outputEl;
    this.inputEl = inputEl;
    this.displayEl = displayEl;
    this.registry = registry;
    this.history = new CommandHistory();
    this.autocomplete = new Autocomplete(registry);

    this.ctx = {
      clearOutput: () => {
        this.outputEl.innerHTML = "";
        this.showWelcome();
      },
    };

    this.bindEvents();
    this.bindMobileToolbar();
    this.setupVisualViewport();
  }

  // ── Event binding ──────────────────────────────────────────────────────────

  private bindEvents(): void {
    this.inputEl.addEventListener("keydown", (e) => this.handleKeydown(e));
    this.inputEl.addEventListener("input", () => this.syncDisplay());

    // Re-focus input when clicking anywhere on the terminal
    document.addEventListener("click", () => this.inputEl.focus());
    // Also re-focus on touch (tap on output area to focus)
    document.addEventListener("touchend", () => this.inputEl.focus(), {
      passive: true,
    });
  }

  /**
   * Bind the mobile toolbar buttons (TAB / ↑ / ↓ / ⌃C).
   * Uses pointerdown + preventDefault to keep the input focused while pressing buttons.
   */
  private bindMobileToolbar(): void {
    const toolbar = document.getElementById("mobile-toolbar");
    if (!toolbar) return;

    toolbar.addEventListener("pointerdown", (e) => {
      const btn = (e.target as Element).closest<HTMLElement>("[data-action]");
      if (!btn) return;

      // Prevent the input from losing focus when tapping a toolbar button
      e.preventDefault();
      this.inputEl.focus();

      switch (btn.dataset.action) {
        case "tab":
          this.handleTab();
          break;
        case "up":
          this.handleArrowUp();
          break;
        case "down":
          this.handleArrowDown();
          break;
        case "ctrlc":
          this.handleCtrlC();
          break;
      }
    });
  }

  /**
   * Track the visible viewport height (shrinks when the soft keyboard opens on iOS/Android).
   * Sets a --vvh CSS variable used by #terminal so the layout doesn't hide behind the keyboard.
   */
  private setupVisualViewport(): void {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const height = vv.height + vv.offsetTop;
      document.documentElement.style.setProperty("--vvh", `${height}px`);
    };

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();
  }

  // ── Keyboard handler (desktop) ─────────────────────────────────────────────

  private handleKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        this.handleEnter();
        break;
      case "ArrowUp":
        e.preventDefault();
        this.handleArrowUp();
        break;
      case "ArrowDown":
        e.preventDefault();
        this.handleArrowDown();
        break;
      case "Tab":
        e.preventDefault();
        this.handleTab();
        break;
      case "l":
        if (e.ctrlKey) {
          e.preventDefault();
          this.ctx.clearOutput();
        }
        break;
      case "c":
        if (e.ctrlKey) {
          e.preventDefault();
          this.handleCtrlC();
        }
        break;
    }
  }

  // ── Individual key actions (also called by mobile toolbar) ─────────────────

  private handleEnter(): void {
    const value = this.inputEl.value;
    this.setInput("");
    this.history.reset();

    if (value.trim()) {
      this.printCommandEcho(value);
      const output = this.registry.execute(value, this.ctx);
      this.printLines(output);
      this.history.push(value);
      this.trimOutput();
    }

    this.scrollToBottom();
  }

  private handleArrowUp(): void {
    this.setInput(this.history.navigateUp());
    this.moveCursorToEnd();
  }

  private handleArrowDown(): void {
    this.setInput(this.history.navigateDown());
    this.moveCursorToEnd();
  }

  private handleTab(): void {
    const partial = this.inputEl.value;
    const match = this.autocomplete.complete(partial);

    if (match) {
      this.setInput(match);
    } else {
      const suggestions = this.autocomplete.suggestions(partial);
      if (suggestions.length > 1) {
        this.printLines([
          { text: suggestions.join("    "), className: "tab-hint" },
          { text: "" },
        ]);
        this.scrollToBottom();
      }
    }
  }

  private handleCtrlC(): void {
    if (this.inputEl.value) {
      this.printCommandEcho(this.inputEl.value + "^C");
      this.setInput("");
      this.history.reset();
    }
  }

  // ── DOM helpers ────────────────────────────────────────────────────────────

  private syncDisplay(): void {
    this.displayEl.textContent = this.inputEl.value;
  }

  private setInput(value: string): void {
    this.inputEl.value = value;
    this.syncDisplay();
  }

  private moveCursorToEnd(): void {
    requestAnimationFrame(() => {
      const len = this.inputEl.value.length;
      this.inputEl.selectionStart = len;
      this.inputEl.selectionEnd = len;
    });
  }

  private printCommandEcho(command: string): void {
    const p = document.createElement("p");
    p.className = "output-line command-echo";
    p.textContent = `visitor@user:~$ ${command}`;
    this.outputEl.appendChild(p);
  }

  printLines(lines: OutputLine[]): void {
    for (const line of lines) {
      const p = document.createElement("p");
      p.className = `output-line${line.className ? ` ${line.className}` : ""}`;

      if (line.href) {
        const a = document.createElement("a");
        a.href = line.href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = line.text;
        p.appendChild(a);
      } else {
        p.textContent = line.text;
      }

      this.outputEl.appendChild(p);
    }
  }

  /**
   * Prune the oldest output lines once the DOM exceeds MAX_OUTPUT_LINES.
   * Keeps memory usage bounded during long sessions.
   */
  private trimOutput(): void {
    const lines = this.outputEl.querySelectorAll(".output-line");
    if (lines.length <= MAX_OUTPUT_LINES) return;
    const excess = lines.length - MAX_OUTPUT_LINES;
    for (let i = 0; i < excess; i++) lines[i].remove();
  }

  private showWelcome(): void {
    this.printLines(WELCOME_LINES);
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  start(): void {
    this.showWelcome();
    this.focus();
  }

  focus(): void {
    this.inputEl.focus();
  }
}
