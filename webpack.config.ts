import CopyPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { Configuration } from 'webpack'

type GeneratePlugins = {
  templateDir: string
  script: 'body' | 'head' | boolean
  src: string
}

type TemplateFile = HtmlWebpackPlugin | undefined

const generatePlugins = ({ templateDir, script, src }: GeneratePlugins): TemplateFile[] => {
  const templateFiles: string[] = fs.readdirSync(path.resolve(__dirname, templateDir))

  return templateFiles
    .map((templateFile: string): TemplateFile => {
      const parts: string[] = templateFile.split('.')
      const name: string = parts[0]
      const extension: string = parts[1]

      if (extension === 'html') {
        return new HtmlWebpackPlugin({
          inject: script,
          scriptLoading: 'blocking',
          filename: `${src}${name}.html`,
          template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
          minify: {
            collapseWhitespace: false,
          },
        }) as HtmlWebpackPlugin
      }
    })
    .filter((templateFile: TemplateFile): boolean => templateFile !== null)
}

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    filename: path.resolve(__dirname, 'src/webpack.ts'),
  },
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
  plugins: [
    new CssMinimizerPlugin(),
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
        exclude: /(node_modules|bower_components)/,
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
