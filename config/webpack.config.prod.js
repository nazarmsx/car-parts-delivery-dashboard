'use strict'

const webpackMerge = require('webpack-merge')
const ngw = require('@ngtools/webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')

const commonConfig = require('./webpack.config.common')
const helpers = require('./helpers')
const webpack = require('webpack')

module.exports = webpackMerge(commonConfig, {
  mode: 'production',

  output: {
    path: helpers.root('dist'),
    publicPath: './',
    filename: '[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  optimization: {
    noEmitOnErrors: true,
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: 'single',
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      }),

      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorOptions: {
          discardComments: {
            removeAll: true
          }
        },
        canPrint: false
      })
    ]
  },

  module: {
    rules: [
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: '@ngtools/webpack'
      }
    ]
  },
  plugins: [
    new ngw.AngularCompilerPlugin({
      tsConfigPath: helpers.root('tsconfig.aot.json'),
      entryModule: helpers.root('src', 'app', 'app.module#AppModule')
    }),
    new webpack.DefinePlugin({

      config: JSON.stringify(
        process.env.SERVER == 'stage'?{
          apiUrl: '***',
          hereAppId: '***',
          hereApiKey: '***'
        }:{
          apiUrl: '***',
          hereAppId: '***',
          hereApiKey: '***'
        }
        )
    })
  ]
})
