'use strict';

const CleanWebpackPlugin   = require('clean-webpack-plugin');
const HtmlWebpackPlugin    = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

const helpers              = require('./helpers');
const isDev                = process.env.NODE_ENV !== 'production';
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');

module.exports = {
    entry: {
        vendor: './src/vendor.ts',
        polyfills: './src/polyfills.ts',
        main: isDev ? './src/main.ts' : './src/main.aot.ts'
    },

    resolve: {
        extensions: ['.ts', '.js', '.scss']
    },

    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    { loader: 'style-loader', options: { sourceMap: isDev } },
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                    { loader: 'sass-loader', options: { sourceMap: isDev } }
                ],
                include: helpers.root('src', 'assets')
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    'to-string-loader',
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                    { loader: 'sass-loader', options: { sourceMap: isDev } }
                ],
                include: helpers.root('src', 'app')
            },
          {
            test: /\.(png|jpg|gif)$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 8192,
                },
              },
            ],
          }
        ]
    },

    plugins: [
      new CleanWebpackPlugin(
            helpers.root('dist'), { root: helpers.root(), verbose: true }),

        new HtmlWebpackPlugin({
            template: 'src/index.html',

        }),
      new BaseHrefWebpackPlugin({ baseHref: process.env.NODE_ENV === 'development'?'/':'/' }),
      new CopyPlugin([
        { from: 'src/assets/i18n/*.json',to:'assets/i18n', transformPath(targetPath, absolutePath) {

          if(targetPath.indexOf('ru.json')!==-1){
            return 'assets/i18n/ru.json';
          }
            if(targetPath.indexOf('uk.json')!==-1){
              return 'assets/i18n/uk.json';
            }
            return targetPath;

          },}
      ])
    ]
};