var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    dust = require('gulp-dust'),
    reload = browserSync.reload,
    sass = require('gulp-ruby-sass'),
    watch = require('gulp-watch'),
    yaml = require('gulp-yaml');

// Convert the YAML indexes to JSON
gulp.task('index', function() {
  gulp.src('links/*.yml')
    .pipe(yaml({ safe: true }))
    .pipe(gulp.dest('_dist/js/'));
});

// Compile Dust templates
gulp.task('dust-templates', function () {
  return gulp.src('tpl/*.html')
    .pipe(dust())
    .pipe(concat('tpl.js'))
    .pipe(gulp.dest('_dist/js/'));
});

// Compile Sass
gulp.task('sass', function () {
  return sass('scss/', {
    bundleExec: true,
    compass: true,
  })
  .on('error', function (err) {
    console.error('Error!', err.message);
  })
  .pipe(gulp.dest('./_dist/css'));
});

// Gather library/vendor JS
gulp.task('js', function () {
  return gulp.src([
    'js/vendor/dustjs/dist/dust-full.js',
    'js/vendor/dust-helpers/dist/dust-helpers.js',
    'js/vendor/dust-motes/src/helpers/control/iterate/iterate.js',
  ])
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('_dist/js'));
})

// For Dev, just copy the HTML, JS, and CSS straight to the build directory
gulp.task('dev', function() {
  gulp.src('*.html')
    .pipe(gulp.dest('_dist/'));
  gulp.src('img/**/*.*')
    .pipe(gulp.dest('_dist/gfx/'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['index', 'dust-templates', 'js', 'dev', 'sass'], function() {

  browserSync.init({
    server: "_dist"
  });

  gulp.watch("js/**/*.js", ['js']);
  gulp.watch("*.html", ['dev']);
  gulp.watch("img/**/*.*", ['dev'])
  gulp.watch("tpl/*.html", ['dust-templates']);
  gulp.watch("links/*.yml", ['index']);
  gulp.watch("scss/**/*.scss", ['sass']);
  gulp.watch("_dist/**/*.*").on('change', reload);
});
