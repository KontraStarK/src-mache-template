'use strict';

//  Modules Gulp
//  =========================================================

const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozJpeg = require('imagemin-mozjpeg');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const rename = require('gulp-rename');
const less = require('gulp-less');
const gcmq = require('gulp-group-css-media-queries');

const smartGrid = require('smart-grid');
const path = require('path');
const gridOptPath = './smartgrid.js';


let isDev = (process.argv.indexOf('--dev') !== -1);;
let isProd = !isDev;


//  Paths
//  =========================================================
const styleFiles = [
   'src/less/main.less'

]
const scriptFiles = [
   'src/libs/*.js',
   'src/js/*.js'

]

//  HTML
//  =========================================================
gulp.task('html', () => {
   return gulp.src('./src/**/*.html')
      .pipe(gulp.dest('./dist'))
      .pipe(browserSync.reload({
         stream: true
      }))
});

//  SmartGrid
//  =========================================================
gulp.task('grid', function grid(done) {
   delete require.cache[path.resolve(gridOptPath)];
   let options = require(gridOptPath);
   smartGrid('./src/less', options);
   done();

});

//  Css libs
//  =========================================================
gulp.task('cssLibs', () => {
   return gulp.src([
         'node_modules/animate.css/animate.css',
         'node_modules/swiper/css/swiper.css'
      ])
      .pipe(concat('_libs.less'))
      .pipe(gulp.dest('src/less'))
      .pipe(browserSync.reload({
         stream: true
      }))
});

//  Style
//  =========================================================
gulp.task('styles', () => {
   return gulp.src(styleFiles)
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(gcmq())
      .pipe(concat('style.css'))
      .pipe(gulpIf(isProd, autoprefixer({
         overrideBrowserslist: ['last 2 versions'],
         cascade: false
      })))
      .pipe(gulpIf(isProd, cleanCSS({
         level: 2
      })))
      .pipe(rename({
         suffix: '.min'
      }))
      .pipe(gulpIf(isDev, sourcemaps.write('./')))
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.reload({
         stream: true
      }))
});

//  JS
//  =========================================================
gulp.task('scripts', () => {
   return gulp.src(scriptFiles)
      .pipe(sourcemaps.init())
      .pipe(concat('script.js'))
      .pipe(gulpIf(isProd, uglify({
         toplevel: true
      })))
      .pipe(rename({
         suffix: '.min'
      }))
      .pipe(gulpIf(isDev, sourcemaps.write('./')))
      .pipe(gulp.dest('./dist/js'))
      .pipe(browserSync.reload({
         stream: true
      }))
});
//  JS libs
//  =========================================================

gulp.task('jsLibs', () => {
   return gulp.src([
         'node_modules/wow.js/dist/wow.js',
         'node_modules/swiper/js/swiper.js'
      ])

      .pipe(concat('libs.js'))
      .pipe(gulp.dest('src/js'))
      .pipe(browserSync.reload({
         stream: true
      }))
});

//  IMG
//  =========================================================
gulp.task('images', () => {
   return gulp.src('./src/img/**/*')
      .pipe(gulpIf(isProd, imagemin([
         pngquant({
            quality: [0.5, 0.5]
         }),
         mozJpeg({
            quality: 50
         })
      ])))
      .pipe(gulp.dest('./dist/img'))
      .pipe(browserSync.reload({
         stream: true
      }))
});
//  Fonts
//  =========================================================
gulp.task('fonts', () => {
   return gulp.src('./src/fonts/**/*')
      .pipe(gulp.dest('./dist/fonts'))
      .pipe(browserSync.reload({
         stream: true
      }))
});

//  Сleaning the folder dist
//  =========================================================
gulp.task('clean', () => {
   return gulp.src('dist', {
         read: false
      })
      .pipe(clean());
});

//  Track changes to files
//  =========================================================
gulp.task('watch', () => {
   browserSync.init({

      server: {
         baseDir: "dist/",
         index: "index.html"
      }
   });
   gulp.watch('./src/**/*.html', gulp.series('html'))
   gulp.watch('./src/less/**/*.less', gulp.series('styles'))
   gulp.watch('./src/js/**/*.js', gulp.series('scripts'))
   gulp.watch('./src/img/**/*', gulp.series('images'))
   gulp.watch('./src/fonts/**/*', gulp.series('fonts'))
   gulp.watch(gridOptPath, gulp.series('grid'))
   gulp.watch('./dist/**/*.html').on('change', browserSync.reload);
   gulp.watch('./dist/**/*.css').on('change', browserSync.reload);
});

//  To start, type the command "npm run dev"
//  To build, type the command "npm run build"
//  =========================================================

gulp.task('build', gulp.series('clean', gulp.parallel('html', 'cssLibs', 'styles', 'jsLibs', 'scripts', 'images', 'fonts', 'grid')));
gulp.task('default', gulp.series('build', 'watch'));
