/**
 * Visual effects module.
 *
 * All effects respect prefers-reduced-motion by checking the media query
 * before running. Each effect is self-contained and can be used independently.
 */

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Text scramble (Matrix decode) ─────────────────────────────────────────────

const SCRAMBLE_CHARS = "アイウエオカキクケコ0123456789!@#$%^&*<>{}[]";

/**
 * Reveals text with a "decoding" scramble animation.
 * Characters cycle through random glyphs before settling on the real character.
 *
 * @param el       Target element (textContent will be overwritten)
 * @param text     Final text to reveal
 * @param duration Total animation time in ms (default 600)
 */
export function scrambleText(
  el: HTMLElement,
  text: string,
  duration = 600,
): Promise<void> {
  if (reducedMotion()) {
    el.textContent = text;
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const length = text.length;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Characters revealed so far (left to right sweep)
      const revealed = Math.floor(progress * length);

      let result = "";
      for (let i = 0; i < length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < revealed) {
          result += text[i];
        } else if (i < revealed + 3) {
          // Active scramble zone (3 chars ahead of the reveal front)
          result +=
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        } else {
          result += " ";
        }
      }

      el.textContent = result;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = text;
        resolve();
      }
    };

    requestAnimationFrame(step);
  });
}

// ── Terminal shake ────────────────────────────────────────────────────────────

/**
 * Shakes the terminal container briefly. Used on error commands.
 */
export function shakeTerminal(): void {
  if (reducedMotion()) return;

  const terminal = document.getElementById("terminal");
  if (!terminal) return;

  terminal.classList.add("shake-active");
  setTimeout(() => terminal.classList.remove("shake-active"), 300);
}

// ── Particle burst ────────────────────────────────────────────────────────────

/**
 * Spawns a brief particle burst from the cursor/input area.
 * Particles are tiny coloured dots that fly outward and fade.
 */
export function particleBurst(): void {
  if (reducedMotion()) return;

  const inputRow = document.getElementById("input-row");
  if (!inputRow) return;

  const rect = inputRow.getBoundingClientRect();
  const originX = rect.left + 120; // roughly where the cursor is
  const originY = rect.top;

  const count = 8;
  const container = document.createElement("div");
  container.className = "particle-container";
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "10";
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const distance = 30 + Math.random() * 40;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 20; // bias upward

    p.style.left = `${originX}px`;
    p.style.top = `${originY}px`;
    p.style.setProperty("--tx", `${tx}px`);
    p.style.setProperty("--ty", `${ty}px`);

    container.appendChild(p);
  }

  setTimeout(() => container.remove(), 600);
}

// ── CRT power-on ──────────────────────────────────────────────────────────────

/**
 * Plays a CRT "power on" effect: white flash → horizontal line → expand.
 * Returns a promise that resolves when the animation finishes.
 */
export function crtPowerOn(): Promise<void> {
  if (reducedMotion()) return Promise.resolve();

  const overlay = document.createElement("div");
  overlay.className = "crt-power-on";
  document.body.appendChild(overlay);

  return new Promise((resolve) => {
    // The CSS animation handles the visual; we just wait for it to end
    overlay.addEventListener("animationend", () => {
      overlay.remove();
      resolve();
    });
    // Safety timeout in case animationend doesn't fire
    setTimeout(() => {
      overlay.remove();
      resolve();
    }, 1200);
  });
}

// ── Scanline flicker ──────────────────────────────────────────────────────────

let flickerTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Starts periodic scanline flicker on the body::after pseudo-element.
 * A subtle opacity pulse every 4-8 seconds.
 */
export function startScanlineFlicker(): void {
  if (reducedMotion()) return;

  const trigger = () => {
    document.body.classList.add("scanline-flicker");
    setTimeout(() => document.body.classList.remove("scanline-flicker"), 150);
  };

  const schedule = () => {
    const delay = 4000 + Math.random() * 4000;
    flickerTimer = setTimeout(() => {
      trigger();
      schedule();
    }, delay) as unknown as ReturnType<typeof setInterval>;
  };
  schedule();
}

export function stopScanlineFlicker(): void {
  if (flickerTimer) {
    clearTimeout(flickerTimer);
    flickerTimer = null;
  }
}
