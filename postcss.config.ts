import autoprefixer from 'autoprefixer'
import { Config } from 'postcss-load-config'
import tailwindcss from 'tailwindcss'

export default {
  plugins: [
    tailwindcss(),
    autoprefixer({
      grid: 'autoplace',
      flexbox: 'no-2009',
      supports: false
    })
  ]
} satisfies Config
