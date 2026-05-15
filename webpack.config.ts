import CopyPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import { Configuration } from 'webpack'

interface HtmlPlugin {
  templateDir: string
  script: 'body' | 'head' | boolean
  src: string
}

const generatePlugins = ({ templateDir, script, src }: HtmlPlugin): HtmlWebpackPlugin[] => {
  const fullPath: string = path.resolve(__dirname, templateDir)

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
          collapseWhitespace: false,
        },
      })
    })
}

export default {
  mode: 'production',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/webpack.ts'),
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@plugins': path.resolve(__dirname, 'plugins'),
      '@ts': path.resolve(__dirname, 'src/ts'),
      '@utils': path.resolve(__dirname, 'src/ts/utils'),
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/application.js',
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'css/style.css' }),
    ...generatePlugins({ templateDir: 'src', script: 'head', src: '' }),
    ...generatePlugins({
      templateDir: 'src/dialogs',
      script: false,
      src: 'dialogs/',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/img/',
          to: 'img/',
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        include: [path.resolve(__dirname, 'src/includes'), path.resolve(__dirname, 'src/components')],
        use: ['raw-loader'],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.m?[jt]s$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/pictures/[name][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  devServer: {
    port: 9000,
    compress: false,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },
} as Configuration
