import type { CommandDef, OutputLine } from './registry'

/** Easter egg commands — hidden from `help` and `man`. */
export const easterEggCommands: CommandDef[] = [
  {
    name: 'sudo',
    description: 'Elevate privileges',
    hidden: true,
    execute: (): OutputLine[] => [
      { text: '' },
      { text: '  Nice try.', className: 'error' },
      { text: "  sudo: permission denied — this isn't your terminal.", className: 'dim' },
      { text: '' },
    ],
  },
  {
    name: 'hack',
    description: 'Hack the mainframe',
    hidden: true,
    execute: (): OutputLine[] => [
      { text: '' },
      { text: '  [████████░░░░░░░░] Accessing mainframe...', className: 'accent' },
      { text: '  [████████████░░░░] Bypassing firewall...', className: 'accent' },
      { text: '  [████████████████] Decrypting database...', className: 'dim' },
      { text: '' },
      { text: '  ERROR: coffee_level_too_low — aborting.', className: 'error' },
      { text: '' },
    ],
  },
  {
    name: 'vim',
    description: 'Launch vim',
    hidden: true,
    execute: (): OutputLine[] => [
      { text: '' },
      { text: '  :q!', className: 'accent' },
      { text: "  Just kidding. There is no vim. There is only the terminal.", className: 'dim' },
      { text: '' },
    ],
  },
  {
    name: 'coffee',
    description: 'Make coffee',
    hidden: true,
    execute: (): OutputLine[] => [
      { text: '' },
      { text: '      ( (      ', className: 'accent' },
      { text: '       ) )     ', className: 'accent' },
      { text: '    ........   ', className: 'accent' },
      { text: '    |      |]  ', className: 'accent' },
      { text: '    \\      /   ', className: 'accent' },
      { text: "     `----'    ", className: 'accent' },
      { text: '' },
      { text: '  Brewing... Stay focused.', className: 'dim' },
      { text: '' },
    ],
  },
  {
    name: 'exit',
    description: 'Exit the terminal',
    hidden: true,
    execute: (): OutputLine[] => [
      { text: '' },
      { text: '  There is no escape.', className: 'error' },
      { text: '  You are already home.', className: 'dim' },
      { text: '' },
    ],
  },
  {
    name: 'quit',
    description: 'Quit the terminal',
    hidden: true,
    execute: (): OutputLine[] => [
      { text: '' },
      { text: '  There is no escape.', className: 'error' },
      { text: '  You are already home.', className: 'dim' },
      { text: '' },
    ],
  },
]
