import fs from 'fs'

import { src, dest, series, watch } from 'gulp'

import browserSync from 'browser-sync'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import { deleteAsync } from 'del'
import rename from 'gulp-rename'
import newer from 'gulp-newer'

import pug from 'gulp-pug'
import typograf from 'gulp-typograf'

import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import csso from 'gulp-csso'

import babel from 'gulp-babel'
import webpack from 'webpack-stream'

const sass = gulpSass(dartSass)

const loadJSON = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'))

const data = {
  globals: loadJSON('./src/data/globals.json'),
}

const clean = () => {
  return deleteAsync('./public')
}

const pugs = () => {
  return src('./src/pug/pages/*.pug')
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'PUG',
          message: error.message,
        })),
      })
    )
    .pipe(
      pug({
        pretty: true,
        data,
      })
    )
    .pipe(typograf({ locale: ['ru', 'en-US'] }))
    .pipe(dest('./public'))
}

const scss = () => {
  return src('./src/scss/main.scss', { sourcemaps: true })
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'SCSS',
          message: error.message,
        })),
      })
    )
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
        grid: true,
        overrideBrowserslist: ['last 2 versions'],
      })
    )
    .pipe(dest('./public/styles', { sourcemaps: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(csso())
    .pipe(dest('./public/styles', { sourcemaps: true }))
}

const fonts = async () => {
  const ttf2woff2 = (await import('gulp-ttf2woff2')).default

  return src('./src/assets/fonts/**/*.ttf')
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'FONTS',
          message: error.message,
        })),
      })
    )
    .pipe(newer('./public/assets/fonts'))
    .pipe(ttf2woff2())
    .pipe(dest('./public/assets/fonts'))
}

const images = () => {
  return src('./src/assets/images/**/*.*', { encoding: false })
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'Images',
          message: error.message,
        })),
      })
    )
    .pipe(dest('./public/assets/images'))
}

const icons = () => {
  return src('./src/assets/icons/**/*.*', { encoding: false })
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'Icons',
          message: error.message,
        })),
      })
    )
    .pipe(dest('./public/assets/icons'))
}

const scripts = () => {
  return src('./src/scripts/*.js')
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: 'JavaScript',
          message: error.message,
        })),
      })
    )
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(
      webpack({
        mode: 'development',
        entry: {
          index: '/src/scripts/main.js',
        },
        output: {
          filename: '[name].bundle.js',
        },
        module: {
          rules: [
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader'],
            },
          ],
        },
      })
    )
    .pipe(dest('./public/scripts/'))
}

const watcher = () => {
  browserSync.init({
    server: {
      baseDir: './public',
    },
    notify: false,
  })

  watch('./src/**/*.pug', pugs).on('all', browserSync.reload)
  watch('./src/**/*.scss', scss).on('all', browserSync.reload)
  watch('./src/assets/images/**/*.*', images).on('all', browserSync.reload)
  watch('./src/**/*.js', scripts).on('all', browserSync.reload)
}

export default series(clean, fonts, images, icons, pugs, scss, scripts, watcher)
