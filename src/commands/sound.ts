import type { CommandDef, OutputLine } from "./registry";
import type { SoundManager } from "../sounds";

export function createSoundCommand(soundManager: SoundManager): CommandDef {
  return {
    name: "sound",
    description: "Toggle keyboard sounds  (usage: sound on|off)",
    manPage: `NAME
    sound — toggle keyboard click sounds

SYNOPSIS
    sound [on|off]

DESCRIPTION
    Enable or disable keyboard click sounds.
    Without arguments, shows current state.

EXAMPLES
    sound on
    sound off
    sound`,

    execute: (args, _ctx): OutputLine[] => {
      const arg = args[0]?.toLowerCase();

      if (arg === "on") {
        soundManager.setEnabled(true);
        return [
          { text: "" },
          { text: "  Sound enabled.", className: "accent" },
          { text: "" },
        ];
      }

      if (arg === "off") {
        soundManager.setEnabled(false);
        return [
          { text: "" },
          { text: "  Sound disabled.", className: "dim" },
          { text: "" },
        ];
      }

      const state = soundManager.isEnabled() ? "on" : "off";
      return [
        { text: "" },
        {
          text: `  Sound is currently: ${state}`,
          className: soundManager.isEnabled() ? "accent" : "dim",
        },
        { text: "  Usage: sound on  /  sound off", className: "dim" },
        { text: "" },
      ];
    },
  };
}
