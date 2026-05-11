declare global {
  interface Window {
    safari: boolean | undefined
  }
}

export const isSafari: boolean = window.safari !== undefined
