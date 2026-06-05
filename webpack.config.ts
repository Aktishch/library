import CopyPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import fs from 'fs'
import HtmlWebpackPlugin, { type ProcessedOptions } from 'html-webpack-plugin'
import lodash from 'lodash'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import { fileURLToPath } from 'url'
import type { Compilation, InputFileSystem, Configuration as WebpackConfiguration } from 'webpack'
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server'

type LodashInclude = lodash.TemplateExecutor | undefined
type Include = (targetPath: string) => LodashInclude
type FileSystem = InputFileSystem | null

interface Configuration extends WebpackConfiguration {
  devServer?: DevServerConfiguration
}

interface WebpackEnv {
  production?: boolean
  development?: boolean
  [key: string]: string | boolean | undefined
}

interface WebpackArgv {
  mode?: 'production' | 'development'
  [key: string]: unknown
}

interface HtmlPlugin {
  templateDir: string
  script: 'body' | 'head' | boolean
  src: string
  isProd: boolean
}

interface TemplateParameters extends HtmlWebpackPlugin.TemplateParameter {
  include: Include
}

const DIR_NAME: string = path.dirname(fileURLToPath(import.meta.url))

const generatePlugins = ({ templateDir, script, src, isProd }: HtmlPlugin): HtmlWebpackPlugin[] => {
  const fullPath: string = path.resolve(DIR_NAME, templateDir)

  if (!fs.existsSync(fullPath)) return []

  const templateFiles: string[] = fs.readdirSync(fullPath)

  return templateFiles
    .filter((file: string): boolean => {
      return path.extname(file).toLowerCase() === '.html'
    })
    .map((templateFile: string): HtmlWebpackPlugin => {
      const name: string = path.parse(templateFile).name

      return new HtmlWebpackPlugin({
        inject: script,
        scriptLoading: 'blocking',
        filename: `${src}${name}.html`,
        template: path.resolve(fullPath, templateFile),
        minify: isProd ? { collapseWhitespace: false } : false,
        cache: isProd,
        templateParameters: (
          compilation: Compilation,
          assets: HtmlWebpackPlugin.TemplateParameter['htmlWebpackPlugin']['files'],
          assetTags: HtmlWebpackPlugin.TemplateParameter['htmlWebpackPlugin']['tags'],
          options: ProcessedOptions
        ): TemplateParameters => {
          const include = (targetPath: string): LodashInclude => {
            const fileSystem: FileSystem = compilation.compiler.inputFileSystem

            if (!fileSystem) return

            const absolutePath: string = path.resolve(DIR_NAME, 'src', targetPath)

            compilation.fileDependencies.add(absolutePath)

            const readFileSync: typeof fileSystem.readFileSync = fileSystem.readFileSync
            const source: string = readFileSync ? readFileSync(absolutePath, 'utf8') : ''

            return lodash.template(source)
          }

          ;(global as typeof globalThis & { include: Include }).include = include

          return {
            compilation,
            webpackConfig: options,
            htmlWebpackPlugin: { tags: assetTags, files: assets, options },
            include
          }
        }
      })
    })
}

export default (env: WebpackEnv, argv: WebpackArgv): Configuration => {
  const isProd: boolean = argv.mode === 'production' || env.production === true

  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
    entry: path.resolve(DIR_NAME, 'src/webpack.ts'),
    cache: isProd ? { type: 'filesystem' } : true,
    resolve: {
      extensions: ['.js', '.ts'],
      alias: {
        '@plugins': path.resolve(DIR_NAME, 'plugins'),
        '@ts': path.resolve(DIR_NAME, 'src/ts'),
        '@utils': path.resolve(DIR_NAME, 'src/ts/utils')
      }
    },
    output: {
      path: path.resolve(DIR_NAME, 'dist'),
      filename: 'js/application.js',
      clean: true
    },
    optimization: {
      minimize: isProd,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()]
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: 'css/style.css' }),
      ...generatePlugins({ templateDir: 'src', script: 'head', src: '', isProd }),
      ...generatePlugins({
        templateDir: 'src/dialogs',
        script: false,
        src: 'dialogs/',
        isProd
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'src/img/',
            to: 'img/',
            noErrorOnMissing: true
          }
        ]
      })
    ],
    module: {
      rules: [
        {
          test: /\.html$/i,
          include: [path.resolve(DIR_NAME, 'src/includes'), path.resolve(DIR_NAME, 'src/components')],
          use: [
            {
              loader: 'html-loader',
              options: {
                sources: false,
                esModule: false
              }
            }
          ]
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
        },
        {
          test: /\.m?[jt]s$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['@babel/preset-env', '@babel/preset-typescript']
            }
          }
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'img/pictures/[name][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]'
          }
        }
      ]
    },
    devServer: {
      port: 9000,
      compress: true,
      hot: true,
      historyApiFallback: true,
      watchFiles: ['src/**/*.html', 'src/includes/**/*.html', 'src/components/**/*.html'],
      static: {
        directory: path.join(DIR_NAME, 'dist')
      }
    }
  } satisfies Configuration
}
