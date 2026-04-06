import type { OutputLine, TerminalContext } from "./commands/registry";
import { CommandRegistry } from "./commands/registry";
import { CommandHistory } from "./history";
import { Autocomplete } from "./autocomplete";
import { WELCOME_LINES } from "./welcome";
import type { SoundManager } from "./sounds";
import { shakeTerminal, particleBurst, scrambleText } from "./effects";

/** Maximum output lines kept in DOM. Older lines are pruned automatically. */
const MAX_OUTPUT_LINES = 400;

/** Default milliseconds per character for typewriter animation. */
const MS_PER_CHAR = 12;

export class Terminal {
  private outputEl: HTMLElement;
  private inputEl: HTMLInputElement;
  private displayEl: HTMLElement;
  private registry: CommandRegistry;
  private history: CommandHistory;
  private autocomplete: Autocomplete;
  private ctx: TerminalContext;
  private isAnimating = false;
  private skipAnimation = false;
  private commandQueue: string[] = [];
  private konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  private konamiIndex = 0;
  private searchMode = false;
  private searchBuffer = "";
  private soundManager: SoundManager | null = null;
  private glitchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    outputEl: HTMLElement,
    inputEl: HTMLInputElement,
    displayEl: HTMLElement,
    registry: CommandRegistry,
    soundManager?: SoundManager,
    history?: CommandHistory,
  ) {
    this.outputEl = outputEl;
    this.inputEl = inputEl;
    this.displayEl = displayEl;
    this.registry = registry;
    this.soundManager = soundManager ?? null;
    this.history = history ?? new CommandHistory();
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
    this.setupGlitch();
  }

  // ── Event binding ──────────────────────────────────────────────────────────

  private bindEvents(): void {
    this.inputEl.addEventListener("keydown", (e) => this.handleKeydown(e));
    this.inputEl.addEventListener("input", () => this.syncDisplay());

    // Re-focus input when clicking anywhere on the terminal
    document.addEventListener("click", (e) => {
      const span = (e.target as Element).closest<HTMLElement>(".cmd-link");
      if (span?.dataset.cmd) {
        e.stopPropagation();
        this.setInput(span.dataset.cmd);
        this.handleEnter();
      }
      this.inputEl.focus();
    });
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

  /**
   * Periodically trigger a glitch animation on all .ascii-art elements.
   * The interval is randomised between 8 and 15 seconds.
   * Respects prefers-reduced-motion.
   */
  private setupGlitch(): void {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const schedule = () => {
      const delay = 8000 + Math.random() * 7000;
      this.glitchTimer = setTimeout(() => {
        const elements = document.querySelectorAll<HTMLElement>(".ascii-art");
        elements.forEach((el) => {
          el.classList.add("glitch-active");
          setTimeout(() => el.classList.remove("glitch-active"), 150);
        });
        schedule();
      }, delay);
    };
    schedule();

    // Stop glitch if user enables reduced-motion mid-session
    mq.addEventListener("change", (e) => {
      if (e.matches && this.glitchTimer) {
        clearTimeout(this.glitchTimer);
        this.glitchTimer = null;
      } else if (!e.matches && !this.glitchTimer) {
        schedule();
      }
    });
  }

  /** Clean up timers and event listeners. */
  destroy(): void {
    if (this.glitchTimer) {
      clearTimeout(this.glitchTimer);
      this.glitchTimer = null;
    }
  }

  // ── Keyboard handler (desktop) ─────────────────────────────────────────────

  private handleKeydown(e: KeyboardEvent): void {
    // Sound feedback
    if (e.key === "Enter") {
      this.soundManager?.playEnter();
    } else if (e.key.length === 1) {
      this.soundManager?.playKey();
    }

    // Konami code tracking
    if (e.key === this.konamiSequence[this.konamiIndex]) {
      this.konamiIndex++;
      if (this.konamiIndex === this.konamiSequence.length) {
        this.triggerKonami();
        this.konamiIndex = 0;
      }
    } else {
      this.konamiIndex = 0;
      // Re-check: the current key might be the start of a new sequence
      if (e.key === this.konamiSequence[0]) this.konamiIndex = 1;
    }

    // Handle search mode
    if (this.searchMode) {
      if (e.key === "Escape") {
        e.preventDefault();
        this.exitSearchMode();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const match = this.inputEl.value;
        this.exitSearchMode();
        if (match.trim()) {
          this.history.push(match);
          this.executeCommand(match);
        }
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        this.searchBuffer = this.searchBuffer.slice(0, -1);
        this.updateSearch();
        return;
      }
      if (e.key.length === 1) {
        e.preventDefault();
        this.searchBuffer += e.key;
        this.updateSearch();
        return;
      }
      return;
    }

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (this.isAnimating) {
          this.skipAnimation = true;
        } else {
          this.handleEnter();
        }
        break;
      case " ":
        if (this.isAnimating) {
          e.preventDefault();
          this.skipAnimation = true;
        }
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
      case "r":
        if (e.ctrlKey) {
          e.preventDefault();
          this.enterSearchMode();
        }
        break;
    }
  }

  private enterSearchMode(): void {
    this.searchMode = true;
    this.searchBuffer = "";
    this.updateSearch();
  }

  private exitSearchMode(): void {
    this.searchMode = false;
    this.searchBuffer = "";
    const promptEl = document.getElementById("prompt-symbol");
    if (promptEl) promptEl.innerHTML = "visitor@user:~$&nbsp;";
    this.syncDisplay();
  }

  private updateSearch(): void {
    const all = this.history.getAll();
    const match =
      [...all].reverse().find((cmd) => cmd.includes(this.searchBuffer)) ?? "";
    this.inputEl.value = match;
    this.syncDisplay();
    // Update prompt display to show search mode
    const promptEl = document.getElementById("prompt-symbol");
    if (promptEl) {
      promptEl.textContent = `(reverse-i-search)\`${this.searchBuffer}': `;
    }
  }

  // ── Individual key actions (also called by mobile toolbar) ─────────────────

  private handleEnter(): void {
    const value = this.inputEl.value;
    this.setInput("");
    this.history.reset();

    if (value.trim()) {
      particleBurst();
      this.history.push(value);
      this.executeCommand(value);
    }

    this.scrollToBottom();
  }

  private executeCommand(input: string): void {
    this.printCommandEcho(input);
    const [name] = input.trim().toLowerCase().split(/\s+/);
    const cmd = this.registry.get(name);
    const output = this.registry.execute(input, this.ctx);

    // Shake terminal on unknown command
    if (!cmd) {
      shakeTerminal();
    }

    if (cmd?.animated) {
      this.isAnimating = true;
      this.printLinesAnimated(output).then(() => {
        this.isAnimating = false;
        this.skipAnimation = false;
        this.trimOutput();
        this.scrollToBottom();
        // Drain queue
        if (this.commandQueue.length > 0) {
          const next = this.commandQueue.shift()!;
          this.executeCommand(next);
        }
      });
    } else {
      this.printLines(output);
      this.trimOutput();
    }
  }

  runCommand(input: string): void {
    if (this.isAnimating) {
      this.commandQueue.push(input);
    } else {
      this.executeCommand(input);
    }
    this.scrollToBottom();
  }

  private triggerKonami(): void {
    // Apply matrix theme via registry if available
    this.registry.execute("theme matrix", this.ctx);
    this.printLines([
      { text: "" },
      { text: "  ↑↑↓↓←→←→BA — CHEAT CODE ACTIVATED", className: "accent" },
      { text: "  +30 lives. Matrix theme restored.", className: "dim" },
      { text: "" },
    ]);
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

  private applyLineContent(p: HTMLElement, line: OutputLine): void {
    if (line.href) {
      const a = document.createElement("a");
      a.href = line.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = line.text;
      p.appendChild(a);
    } else if (line.cmd) {
      const span = document.createElement("span");
      span.className = "cmd-link";
      span.dataset.cmd = line.cmd;
      span.textContent = line.text;
      p.appendChild(span);
    } else {
      p.textContent = line.text;
    }
  }

  printLines(lines: OutputLine[]): void {
    for (const line of lines) {
      const p = document.createElement("p");
      p.className = `output-line${line.className ? ` ${line.className}` : ""}`;
      this.applyLineContent(p, line);
      this.outputEl.appendChild(p);
    }
  }

  /**
   * Print lines with a typewriter effect (char by char).
   *
   * Rules:
   *  - Empty lines → instant
   *  - Lines with href → instant (rendered as links)
   *  - Lines with className containing 'separator' or 'ascii-art' → instant
   *  - All other lines → animated at msPerChar ms per character
   */
  async printLinesAnimated(
    lines: OutputLine[],
    msPerChar = MS_PER_CHAR,
  ): Promise<void> {
    for (const line of lines) {
      const p = document.createElement("p");
      p.className = `output-line${line.className ? ` ${line.className}` : ""}`;

      const instant =
        !line.text ||
        line.href !== undefined ||
        line.cmd !== undefined ||
        line.className?.includes("separator") ||
        line.className?.includes("ascii-art");

      if (instant) {
        this.applyLineContent(p, line);
        this.outputEl.appendChild(p);
        continue;
      }

      // Accent lines get scramble decode; others get typewriter
      if (line.className?.includes("accent") && !this.skipAnimation) {
        this.outputEl.appendChild(p);
        await scrambleText(p, line.text, 400);
        this.scrollToBottom();
        continue;
      }

      // Typewriter: reveal one character at a time
      this.outputEl.appendChild(p);
      for (let i = 0; i <= line.text.length; i++) {
        p.textContent = line.text.slice(0, i);
        this.scrollToBottom();
        if (i < line.text.length) {
          if (this.skipAnimation) {
            p.textContent = line.text;
            break;
          }
          await new Promise<void>((resolve) => setTimeout(resolve, msPerChar));
        }
      }
    }
    this.scrollToBottom();
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
    this.isAnimating = true;
    this.printLinesAnimated(WELCOME_LINES).then(() => {
      this.isAnimating = false;
      this.skipAnimation = false;
    });
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

  getHistory(): CommandHistory {
    return this.history;
  }
}
