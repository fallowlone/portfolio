const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  '0123456789' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '日月火水木金土'

const FONT_SIZE = 14
const FRAME_SKIP = 3 // draw every Nth rAF → ~20fps

export class MatrixRain {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private drops: number[] = []
  private frameCount = 0
  private animationId = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.resize()
    window.addEventListener('resize', () => this.resize())
  }

  private resize(): void {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    const columns = Math.floor(this.canvas.width / FONT_SIZE)
    // Preserve existing drops where possible; fill new columns at random positions
    const newDrops = Array.from({ length: columns }, (_, i) =>
      this.drops[i] ?? Math.floor(Math.random() * (this.canvas.height / FONT_SIZE))
    )
    this.drops = newDrops
  }

  private draw(): void {
    const { ctx, canvas } = this

    // Fade previous frame — lower alpha = longer glowing tails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.055)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = `${FONT_SIZE}px monospace`

    for (let i = 0; i < this.drops.length; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)]
      const x = i * FONT_SIZE
      const y = this.drops[i] * FONT_SIZE

      // Leading character is bright white for the "head" glow effect
      const isHead = Math.random() > 0.92
      ctx.fillStyle = isHead ? '#ccffcc' : '#00ff41'
      ctx.fillText(char, x, y)

      // Reset drop to top once it exits the viewport (with randomness to stagger restarts)
      if (y > canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0
      } else {
        this.drops[i]++
      }
    }
  }

  start(): void {
    const loop = () => {
      this.frameCount++
      if (this.frameCount % FRAME_SKIP === 0) {
        this.draw()
      }
      this.animationId = requestAnimationFrame(loop)
    }
    this.animationId = requestAnimationFrame(loop)
  }

  stop(): void {
    cancelAnimationFrame(this.animationId)
  }
}
