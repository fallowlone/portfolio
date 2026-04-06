import "./styles/main.css";

import { MatrixRain } from "./matrix";
import { Terminal } from "./terminal";
import { CommandRegistry } from "./commands/registry";
import { createHelpCommand } from "./commands/help";
import { aboutCommand } from "./commands/about";
import { projectsCommand } from "./commands/projects";
import { cvCommand } from "./commands/cv";
import { linksCommand } from "./commands/links";
import { clearCommand } from "./commands/clear";
import { createThemeCommand } from "./commands/theme";
import { createFontCommand } from "./commands/font";
import { skillsCommand } from "./commands/skills";
import { createNeofetchCommand } from "./commands/neofetch";
import { createManCommand } from "./commands/man";
import { createOpenCommand } from "./commands/open";
import { easterEggCommands } from "./commands/easter-eggs";
import { whoamiCommand } from "./commands/whoami";
import { experienceCommand } from "./commands/experience";
import { lsCommand } from "./commands/ls";
import { blogCommand } from "./commands/blog";
import { SoundManager } from "./sounds";
import { createSoundCommand } from "./commands/sound";
import { createHistoryCommand } from "./commands/history";
import { ThemeManager } from "./theme";
import { BootSequence } from "./boot";
import { CommandHistory } from "./history";
import { startScanlineFlicker } from "./effects";

// ── Theme / font manager (runs immediately — applies saved preferences) ────────
const themeManager = new ThemeManager();

// ── Matrix rain ───────────────────────────────────────────────────────────────
const canvas = document.getElementById("matrix-canvas") as HTMLCanvasElement;
const rain = new MatrixRain(canvas);
rain.start();

// Wire rain into themeManager so color updates happen on theme switch
themeManager.setRain(rain);

// ── Sound manager ─────────────────────────────────────────────────────────────
const soundManager = new SoundManager();

// ── Command history (shared between Terminal and history command) ─────────────
const commandHistory = new CommandHistory();

// ── Command registry ──────────────────────────────────────────────────────────
const registry = new CommandRegistry();

registry.register(aboutCommand);
registry.register(projectsCommand);
registry.register(cvCommand);
registry.register(linksCommand);
registry.register(clearCommand);
registry.register(skillsCommand);
registry.register(whoamiCommand);
registry.register(experienceCommand);
registry.register(lsCommand);
registry.register(blogCommand);
registry.register(createOpenCommand());
registry.register(
  createThemeCommand(
    () => themeManager.getTheme(),
    (name) => themeManager.applyTheme(name),
  ),
);
registry.register(
  createFontCommand(
    () => themeManager.getFont(),
    (name) => themeManager.applyFont(name),
  ),
);
registry.register(
  createNeofetchCommand(
    () => themeManager.getTheme(),
    () => themeManager.getFont(),
  ),
);
registry.register(createSoundCommand(soundManager));
registry.register(createHistoryCommand(commandHistory));
// Register man after all other commands so it can reference their manPage entries
registry.register(createManCommand(registry));
// Help must also be registered after commands it lists
registry.register(createHelpCommand(registry));

// Easter eggs — registered last, hidden from help output
for (const cmd of easterEggCommands) {
  registry.register(cmd);
}

// ── Terminal ──────────────────────────────────────────────────────────────────
const outputEl = document.getElementById("output") as HTMLElement;
const inputEl = document.getElementById("input-field") as HTMLInputElement;
const displayEl = document.getElementById("input-display") as HTMLElement;
const inputRow = document.getElementById("input-row") as HTMLElement;

const terminal = new Terminal(
  outputEl,
  inputEl,
  displayEl,
  registry,
  soundManager,
  commandHistory,
);

// Hide input during boot sequence
inputRow.style.display = "none";

// ── Boot sequence → then show welcome ─────────────────────────────────────────
const boot = new BootSequence(outputEl);
boot.start(() => {
  inputRow.style.display = "";
  terminal.start();
  startScanlineFlicker();

  // URL-based auto-run
  const params = new URLSearchParams(window.location.search);
  const autoRun = params.get("run");
  if (autoRun && registry.get(autoRun)) {
    terminal.runCommand(autoRun);
  }
});
