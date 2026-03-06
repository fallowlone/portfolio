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
import { ThemeManager } from "./theme";

// ── Theme / font manager (runs immediately — applies saved preferences) ────────
const themeManager = new ThemeManager();

// ── Matrix rain ───────────────────────────────────────────────────────────────
const canvas = document.getElementById("matrix-canvas") as HTMLCanvasElement;
const rain = new MatrixRain(canvas);
rain.start();

// ── Command registry ──────────────────────────────────────────────────────────
const registry = new CommandRegistry();

registry.register(aboutCommand);
registry.register(projectsCommand);
registry.register(cvCommand);
registry.register(linksCommand);
registry.register(clearCommand);
registry.register(createHelpCommand(registry));
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

// ── Terminal ──────────────────────────────────────────────────────────────────
const outputEl = document.getElementById("output") as HTMLElement;
const inputEl = document.getElementById("input-field") as HTMLInputElement;
const displayEl = document.getElementById("input-display") as HTMLElement;

const terminal = new Terminal(outputEl, inputEl, displayEl, registry);
terminal.start();
