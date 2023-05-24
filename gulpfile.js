var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var csscomb = require('gulp-csscomb');
var pkg = require('./package.json');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');

var browserSync = require('browser-sync').create();

// Set the banner content
var banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  ''
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function () {

  // Bootstrap
  gulp.src([
    './node_modules/bootstrap/dist/**/*',
    '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
    '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
  ])
    .pipe(gulp.dest('./vendor/bootstrap'))

  // Font Awesome
  gulp.src([
    './node_modules/font-awesome/**/*',
    '!./node_modules/font-awesome/{less,less/*}',
    '!./node_modules/font-awesome/{scss,scss/*}',
    '!./node_modules/font-awesome/.*',
    '!./node_modules/font-awesome/*.{txt,json,md}'
  ])
    .pipe(gulp.dest('./vendor/font-awesome'))

  // jQuery
  gulp.src([
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js'
  ])
    .pipe(gulp.dest('./vendor/jquery'))
  // k-gmaps
  gulp.src([
    './bower_components/k-gmaps/dist/js/*.js',
    '!./bower_components/k-gmaps/dist/js/*.map'
  ])
    .pipe(gulp.dest('./vendor/k-gmaps'))

  // jQuery Easing
  gulp.src([
    './node_modules/jquery.easing/*.js'
  ])
    .pipe(gulp.dest('./vendor/jquery-easing'))

  // Magnific Popup
  gulp.src([
    './node_modules/magnific-popup/dist/*'
  ])
    .pipe(gulp.dest('./vendor/magnific-popup'))

  // Scrollreveal
  gulp.src([
    './node_modules/scrollreveal/dist/*.js'
  ])
    .pipe(gulp.dest('./vendor/scrollreveal'))

});

// Compile SCSS
gulp.task('css:compile', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    
    .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', gulp.series('css:compile'), function () {
  return gulp.src([
    './css/*.css',
    '!./css/*.min.css'
  ])
    .pipe(csscomb())
    .pipe(autoprefixer({
      browsers: ['last 20 versions'],
      // cascade: false
    }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

// CSS
gulp.task('css', gulp.series('css:compile', 'css:minify'));

// Minify JavaScript
gulp.task('js:minify', function () {
  return gulp.src([
    './js/*.js',
    '!./js/*.min.js'
  ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
});

gulp.task('html', function () {
  return gulp.src('*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./'));
});

// JS
gulp.task('js', gulp.series('js:minify'));

// Default task
gulp.task('default', gulp.series('css', 'js', 'vendor', 'html'));

// Configure the browserSync task
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Dev task
gulp.task('dev', gulp.series('css', 'js', 'browserSync'), function () {
  gulp.watch('./scss/*.scss', gulp.series('css'));
  gulp.watch('./js/*.js', gulp.series('js'));
  gulp.watch('./*.html', browserSync.reload);
});
