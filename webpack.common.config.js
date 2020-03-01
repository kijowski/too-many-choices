const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { InjectManifest } = require('workbox-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
  context: __dirname,
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [
      new TsconfigPathsPlugin()
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new FaviconsWebpackPlugin({
      logo: 'assets/favicon.png',
      favicons: {
        appName: 'Too many choices',
        appShortName: 'toomanychoices',
        appDescription: 'Sometimes there are just too many choices to make',
        developerName: 'Michał Kijowski',
        developerURL: 'https://kijowski.dev',
        display: 'standalone',
        start_url: '/'
      }
    }),
    // new WebpackPwaManifest({
    //   name: 'mkswap - externalize you short term memory',
    //   short_name: 'mkswap',
    //   display: 'standalone',
    //   description: 'Externalize you short term memory',
    //   icons: [
    //     {
    //       src: path.resolve('assets/favicon.png'),
    //       sizes: [96, 128, 192, 256, 384, 512],
    //       destination: 'assets/'
    //     }
    //   ]
    // }),
    new InjectManifest({ swSrc: 'src/sw.js', swDest: 'sw.js' })
  ]
}
