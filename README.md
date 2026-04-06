# terminal-portfolio

> Interactive terminal-style portfolio for Artem Hrechuk — built with TypeScript, Vite, Canvas API, and Web Audio API.

**Live:** [fallowlone.github.io](https://fallowlone.github.io)

---

## Overview

A browser-based terminal emulator that serves as a personal portfolio. Type commands to explore my background, projects, and links — complete with Matrix rain background, multiple themes, autocomplete, command history, and mobile support.

## Features

- **Terminal UX** — command input, Tab autocomplete, ↑/↓ history navigation
- **Matrix rain** — animated Canvas background
- **Themes** — multiple color schemes switchable at runtime (`theme <name>`)
- **Sound effects** — Web Audio API, toggleable via `sound`
- **Mobile** — on-screen toolbar for TAB, arrow keys, and Ctrl+C
- **Man pages** — `man <command>` for detailed command docs
- **PWA-ready** — web manifest and icons included

## Commands

| Command      | Description                 |
| ------------ | --------------------------- |
| `about`      | Personal info and bio       |
| `skills`     | Tech stack and skill levels |
| `projects`   | GitHub projects with links  |
| `experience` | Work history                |
| `links`      | GitHub, LinkedIn, email     |
| `whoami`     | Quick identity summary      |
| `blog`       | Blog posts / writing        |
| `theme`      | Switch color theme          |
| `sound`      | Toggle sound effects        |
| `neofetch`   | System info, terminal style |
| `history`    | Command history             |
| `ls`         | List available sections     |
| `clear`      | Clear terminal output       |
| `help`       | List all commands           |
| `man`        | Manual page for any command |

## Stack

- **TypeScript** — fully typed, no JS files
- **Vite** — dev server and production build
- **Canvas API** — Matrix rain animation
- **Web Audio API** — synthesized sound effects
- No frameworks, no runtime dependencies

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── commands/       # Individual command definitions
│   ├── about.ts
│   ├── blog.ts
│   ├── experience.ts
│   ├── history.ts
│   ├── links.ts
│   ├── ls.ts
│   ├── neofetch.ts
│   ├── projects.ts
│   ├── registry.ts
│   ├── sound.ts
│   └── whoami.ts
├── styles/
│   └── main.css    # All terminal and theme styles
├── autocomplete.ts # Tab completion logic
├── boot.ts         # Boot sequence
├── effects.ts      # Visual effects
├── history.ts      # Command history
├── main.ts         # Entry point
├── matrix.ts       # Matrix rain canvas
├── sounds.ts       # Web Audio sound engine
├── terminal.ts     # Core terminal logic
├── theme.ts        # Theme switching
└── welcome.ts      # Welcome message
```

## Author

**Artem Hrechuk** ([@fallowlone](https://github.com/fallowlone)) — Full Stack TS/JS Developer based in Germany.

## License

MIT
