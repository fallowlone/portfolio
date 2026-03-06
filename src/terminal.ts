import type { OutputLine, TerminalContext } from './commands/registry'
import { CommandRegistry } from './commands/registry'
import { CommandHistory } from './history'
import { Autocomplete } from './autocomplete'
import { WELCOME_LINES } from './welcome'

export class Terminal {
  private outputEl: HTMLElement
  private inputEl: HTMLInputElement
  private displayEl: HTMLElement
  private registry: CommandRegistry
  private history: CommandHistory
  private autocomplete: Autocomplete
  private ctx: TerminalContext

  constructor(
    outputEl: HTMLElement,
    inputEl: HTMLInputElement,
    displayEl: HTMLElement,
    registry: CommandRegistry,
  ) {
    this.outputEl = outputEl
    this.inputEl = inputEl
    this.displayEl = displayEl
    this.registry = registry
    this.history = new CommandHistory()
    this.autocomplete = new Autocomplete(() => registry.getNames())

    this.ctx = {
      // clear: wipe output then re-show welcome so it's never fully empty
      clearOutput: () => {
        this.outputEl.innerHTML = ''
        this.showWelcome()
      },
    }

    this.bindEvents()
  }

  private bindEvents(): void {
    this.inputEl.addEventListener('keydown', (e) => this.handleKeydown(e))

    // Sync display mirror on every keystroke (covers normal typing)
    this.inputEl.addEventListener('input', () => this.syncDisplay())

    // Re-focus input when clicking anywhere on the terminal
    document.addEventListener('click', () => {
      this.inputEl.focus()
    })
  }

  /** Keeps #input-display in sync with the real (invisible) input value */
  private syncDisplay(): void {
    this.displayEl.textContent = this.inputEl.value
  }

  private setInput(value: string): void {
    this.inputEl.value = value
    this.syncDisplay()
  }

  private handleKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Enter': {
        e.preventDefault()
        const value = this.inputEl.value
        this.setInput('')
        this.history.reset()

        if (value.trim()) {
          this.printCommandEcho(value)
          const output = this.registry.execute(value, this.ctx)
          this.printLines(output)
          this.history.push(value)
        }

        this.scrollToBottom()
        break
      }

      case 'ArrowUp': {
        e.preventDefault()
        const prev = this.history.navigateUp()
        this.setInput(prev)
        requestAnimationFrame(() => {
          this.inputEl.selectionStart = this.inputEl.value.length
          this.inputEl.selectionEnd = this.inputEl.value.length
        })
        break
      }

      case 'ArrowDown': {
        e.preventDefault()
        const next = this.history.navigateDown()
        this.setInput(next)
        requestAnimationFrame(() => {
          this.inputEl.selectionStart = this.inputEl.value.length
          this.inputEl.selectionEnd = this.inputEl.value.length
        })
        break
      }

      case 'Tab': {
        e.preventDefault()
        const partial = this.inputEl.value
        const match = this.autocomplete.complete(partial)

        if (match) {
          this.setInput(match)
        } else {
          const suggestions = this.autocomplete.suggestions(partial)
          if (suggestions.length > 1) {
            this.printLines([
              { text: suggestions.join('    '), className: 'tab-hint' },
              { text: '' },
            ])
            this.scrollToBottom()
          }
        }
        break
      }

      case 'l': {
        if (e.ctrlKey) {
          e.preventDefault()
          this.ctx.clearOutput()
        }
        break
      }

      case 'c': {
        if (e.ctrlKey) {
          e.preventDefault()
          if (this.inputEl.value) {
            this.printCommandEcho(this.inputEl.value + '^C')
            this.setInput('')
            this.history.reset()
          }
        }
        break
      }
    }
  }

  private printCommandEcho(command: string): void {
    const p = document.createElement('p')
    p.className = 'output-line command-echo'
    p.textContent = `visitor@user:~$ ${command}`
    this.outputEl.appendChild(p)
  }

  printLines(lines: OutputLine[]): void {
    for (const line of lines) {
      const p = document.createElement('p')
      p.className = `output-line${line.className ? ` ${line.className}` : ''}`

      if (line.href) {
        // Render as a clickable link
        const a = document.createElement('a')
        a.href = line.href
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.textContent = line.text
        p.appendChild(a)
      } else {
        p.textContent = line.text
      }

      this.outputEl.appendChild(p)
    }
  }

  private showWelcome(): void {
    this.printLines(WELCOME_LINES)
    this.scrollToBottom()
  }

  scrollToBottom(): void {
    this.outputEl.scrollTop = this.outputEl.scrollHeight
  }

  start(): void {
    this.showWelcome()
    this.focus()
  }

  focus(): void {
    this.inputEl.focus()
  }
}
