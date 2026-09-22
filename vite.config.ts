import tailwindcss from '@tailwindcss/vite'
import nunjucks from '@vituum/vite-plugin-nunjucks'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { format } from 'prettier'
import { defineConfig, UserConfig } from 'vite'
import checker from 'vite-plugin-checker'
import vituum from 'vituum'

const resolvePath = (dir: string) => {
  return fileURLToPath(new URL(dir, import.meta.url))
}

export default defineConfig({
  server: {
    port: 9000
  },
  resolve: {
    alias: {
      '@scripts': resolvePath('./src/scripts'),
      '@utils': resolvePath('./src/scripts/utils')
    }
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'postcss-fix-public-fonts',
          Once(root) {
            root.walkAtRules('font-face', (atRule) => {
              atRule.walkDecls('src', (decl) => {
                if (decl.value.includes('/fonts/')) {
                  decl.value = decl.value.replace(/\/fonts\//g, '../fonts/')
                }
              })
            })
          }
        }
      ]
    }
  },
  plugins: [
    vituum({
      imports: {
        filenamePattern: {
          '+.js': []
        }
      }
    }),
    nunjucks({
      options: {
        trimBlocks: true,
        lstripBlocks: true
      }
    }),
    tailwindcss(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,ts}"'
      },
      stylelint: {
        lintCommand: 'stylelint "./src/**/*.css"'
      }
    }),
    {
      name: 'vite-prettier-html',
      transformIndexHtml: {
        order: 'post',
        handler: async (html) => {
          return await format(html, {
            parser: 'html',
            htmlWhitespaceSensitivity: 'ignore',
            printWidth: 99999,
            wrapAttributes: 'preserve'
          })
        }
      }
    },
    {
      name: 'vite-clean-js-garbage',
      closeBundle() {
        const distJs = resolvePath('./dist/js')

        if (fs.existsSync(distJs)) {
          fs.readdirSync(distJs)
            .filter((file) => {
              return !file.startsWith('application.')
            })
            .forEach((file) => {
              fs.unlinkSync(path.join(distJs, file))
            })
        }
      }
    }
  ],
  build: {
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/application.js',
        manualChunks(id) {
          if (id.includes('src/scripts') || id.includes('node_modules') || id.endsWith('.ts') || id.endsWith('.js')) {
            return 'application'
          }
        },
        assetFileNames: (asset) => {
          return asset.names?.some((name) => {
            return name.endsWith('.css')
          })
            ? 'css/style[extname]'
            : 'css/[name][extname]'
        }
      }
    }
  }
}) satisfies UserConfig
