import CopyPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import { fileURLToPath } from 'url'
import type { Configuration as WebpackConfiguration } from 'webpack'
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server'

interface Configuration extends WebpackConfiguration {
  devServer?: DevServerConfiguration
}

interface HtmlPlugin {
  templateDir: string
  script: 'body' | 'head' | boolean
  src: string
}

const dirName: string = path.dirname(fileURLToPath(import.meta.url))

const generatePlugins = ({ templateDir, script, src }: HtmlPlugin): HtmlWebpackPlugin[] => {
  const fullPath: string = path.resolve(dirName, templateDir)

  if (!fs.existsSync(fullPath)) return []

  const templateFiles: string[] = fs.readdirSync(fullPath)

  return templateFiles
    .filter((file: string): boolean => path.extname(file).toLowerCase() === '.html')
    .map((templateFile: string): HtmlWebpackPlugin => {
      const name: string = path.parse(templateFile).name

      return new HtmlWebpackPlugin({
        inject: script,
        scriptLoading: 'blocking',
        filename: `${src}${name}.html`,
        template: path.resolve(fullPath, templateFile),
        minify: {
          collapseWhitespace: false
        }
      })
    })
}

export default {
  mode: 'production',
  devtool: 'source-map',
  entry: path.resolve(dirName, 'src/webpack.ts'),
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@plugins': path.resolve(dirName, 'plugins'),
      '@ts': path.resolve(dirName, 'src/ts'),
      '@utils': path.resolve(dirName, 'src/ts/utils')
    }
  },
  output: {
    path: path.resolve(dirName, 'dist'),
    filename: 'js/application.js',
    clean: true
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'css/style.css' }),
    ...generatePlugins({ templateDir: 'src', script: 'head', src: '' }),
    ...generatePlugins({
      templateDir: 'src/dialogs',
      script: false,
      src: 'dialogs/'
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
        include: [path.resolve(dirName, 'src/includes'), path.resolve(dirName, 'src/components')],
        use: ['raw-loader']
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
    compress: false,
    hot: true,
    historyApiFallback: true,
    watchFiles: ['src/**/*.html'],
    static: {
      directory: path.join(dirName, 'dist')
    }
  }
} satisfies Configuration
