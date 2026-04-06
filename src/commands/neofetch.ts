import type { CommandDef, OutputLine } from "./registry";

/** Timestamp when this module was first loaded — used for uptime calculation. */
const loadTime = performance.now();

function formatUptime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  if (totalSec < 60) return `${totalSec} second${totalSec !== 1 ? "s" : ""}`;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min < 60) return `${min}m ${sec}s`;
  const hr = Math.floor(min / 60);
  const rem = min % 60;
  return `${hr}h ${rem}m`;
}

/**
 * neofetch — system info panel with ASCII portrait.
 * Needs current theme/font from ThemeManager, so must be created via factory.
 */
export function createNeofetchCommand(
  getTheme: () => string,
  getFont: () => string,
): CommandDef {
  return {
    name: "neofetch",
    description: "Display system info (neofetch style)",
    animated: true,
    manPage: `NAME
    neofetch — display system information

SYNOPSIS
    neofetch

DESCRIPTION
    Shows a neofetch-style system info panel with ASCII
    portrait art alongside runtime information such as
    current theme, font, and session uptime.

SEE ALSO
    about(1), theme(1), font(1)`,

    execute: (_args, _ctx): OutputLine[] => {
      const uptimeMs = performance.now() - loadTime;
      const theme = getTheme();
      const font = getFont();

      // ── ASCII portrait (left column, 10 lines) ──────────────────────────
      const portrait = [
        "   .------.   ",
        "  /  o  o  \\  ",
        " |     ^    | ",
        " |   -----  | ",
        "  \\        /  ",
        "   `------'   ",
        "    \\    /    ",
        "   __|  |__   ",
        "  /  |  |  \\  ",
        " /   |  |   \\ ",
      ];

      const ua = navigator.userAgent;
      const browser = ua.includes("Firefox")
        ? "Firefox"
        : ua.includes("Chrome")
          ? "Chrome"
          : ua.includes("Safari")
            ? "Safari"
            : "Unknown";
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-GB", {
        timeZone: "Europe/Berlin",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const tzAbbr =
        now
          .toLocaleString("en-GB", {
            timeZone: "Europe/Berlin",
            timeZoneName: "short",
          })
          .split(" ")
          .pop() ?? "CET";
      const time = `${timeStr} ${tzAbbr}`;

      // ── Info fields (right column) ───────────────────────────────────────
      const info = [
        "fallowlone@terminal",
        "───────────────────────────────",
        "Shell:    terminal-portfolio v1.0.0",
        `Browser:  ${browser}`,
        "Location: Germany",
        "Role:     Full Stack Developer",
        "Stack:    TS · Next.js · Node.js · PostgreSQL",
        "GitHub:   github.com/fallowlone",
        `Uptime:   ${formatUptime(uptimeMs)}`,
        `Time:     ${time}`,
        `Theme:    ${theme}`,
        `Font:     ${font}`,
      ];

      const maxLen = Math.max(portrait.length, info.length);
      const lines: OutputLine[] = [{ text: "" }];

      for (let i = 0; i < maxLen; i++) {
        const left = portrait[i] ?? "               ";
        const right = info[i] ?? "";
        const isHeader = i === 0;
        const isSeparator = i === 1;
        lines.push({
          text: `  ${left}  ${right}`,
          className: isHeader
            ? "accent"
            : isSeparator
              ? "separator"
              : undefined,
        });
      }

      lines.push({ text: "" });
      return lines;
    },
  };
}
