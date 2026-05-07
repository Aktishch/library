declare global {
  interface Window {
    safari: boolean | undefined
  }
}

export const safari: boolean = window.safari !== undefined
