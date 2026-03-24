declare global {
  interface Window {
    safari: undefined
  }
}

export const safari = window.safari !== undefined
