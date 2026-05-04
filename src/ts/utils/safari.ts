declare global {
  interface Window {
    safari: undefined | unknown
  }
}

export const safari: boolean = window.safari !== undefined
