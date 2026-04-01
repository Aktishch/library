declare global {
  interface Window {
    safari: undefined
  }
}

export const safari: boolean = window.safari !== undefined
