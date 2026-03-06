import type { CommandDef, OutputLine } from './registry'

// Set CV_AVAILABLE to true and update CV_FILENAME once you add cv.pdf to public/
const CV_AVAILABLE = false
const CV_FILENAME = 'Artem_Hrechuk_CV.pdf'

export const cvCommand: CommandDef = {
  name: 'cv',
  description: 'Download my CV / resume',
  execute: (_args, _ctx): OutputLine[] => {
    if (!CV_AVAILABLE) {
      return [
        { text: '' },
        { text: '  CV is not yet available for download.', className: 'error' },
        { text: '  Check back soon!', className: 'dim' },
        { text: '' },
      ]
    }

    // Trigger browser download
    const link = document.createElement('a')
    link.href = `${import.meta.env.BASE_URL}${CV_FILENAME}`
    link.download = CV_FILENAME
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return [
      { text: '' },
      { text: '  Downloading CV...', className: 'accent' },
      { text: `  File: ${CV_FILENAME}`, className: 'dim' },
      { text: '' },
    ]
  },
}
