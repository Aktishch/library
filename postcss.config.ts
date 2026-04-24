import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import tailwindcss, { Config } from 'tailwindcss'

interface PostcssConfig {
  plugins: (
    | postcss.PluginCreator<
        | string
        | Config
        | {
            config: string | Config
          }
      >
    | (postcss.Plugin & autoprefixer.ExportedAPI)
  )[]
}

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer({
      grid: 'autoplace',
      flexbox: 'no-2009',
      supports: false,
    }),
  ],
} as PostcssConfig
