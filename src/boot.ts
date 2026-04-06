import { crtPowerOn } from "./effects";

/**
 * BootSequence
 *
 * Displays a fake boot animation in the output element before the
 * terminal welcome message is shown. Runs entirely with DOM manipulation
 * and setTimeout — no dependencies on Terminal or CommandRegistry.
 *
 * Usage:
 *   const boot = new BootSequence(outputEl);
 *   boot.start(() => terminal.start());
 */
export class BootSequence {
  private outputEl: HTMLElement;

  constructor(outputEl: HTMLElement) {
    this.outputEl = outputEl;
  }

  async start(onComplete: () => void): Promise<void> {
    // CRT power-on flash
    await crtPowerOn();

    // Line 1: instant
    this.appendLine("  Initializing terminal...", "dim");

    // Line 2: animated progress bar (~600ms)
    await this.animateProgressBar();

    // Line 3: "Loading modules" with animated dots (~300ms)
    await this.animateLoadingDots();

    // Line 4: System ready
    this.appendLine("  System ready.", "accent");

    await this.delay(250);

    // Clear boot output, hand off to terminal
    this.outputEl.innerHTML = "";
    onComplete();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private appendLine(text: string, className?: string): void {
    const p = document.createElement("p");
    p.className = `output-line${className ? ` ${className}` : ""}`;
    p.textContent = text;
    this.outputEl.appendChild(p);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async animateProgressBar(): Promise<void> {
    const p = document.createElement("p");
    p.className = "output-line dim";
    this.outputEl.appendChild(p);

    const barWidth = 16;
    const totalDuration = 600;
    const steps = 20;

    for (let step = 0; step <= steps; step++) {
      const filled = Math.round((step / steps) * barWidth);
      const empty = barWidth - filled;
      const pct = Math.round((step / steps) * 100);
      p.textContent = `  [${"█".repeat(filled)}${"░".repeat(empty)}] ${pct}%`;
      if (step < steps) await this.delay(totalDuration / steps);
    }
  }

  private async animateLoadingDots(): Promise<void> {
    const p = document.createElement("p");
    p.className = "output-line dim";
    this.outputEl.appendChild(p);

    const frames = [
      "  Loading modules",
      "  Loading modules.",
      "  Loading modules..",
      "  Loading modules...",
    ];
    const interval = 300 / (frames.length - 1);

    for (const frame of frames) {
      p.textContent = frame;
      await this.delay(interval);
    }
  }
}
