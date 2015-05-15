var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
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
    .pipe(gulp.dest('_dist/tpl/'));
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

// For Dev, just copy the HTML, JS, and CSS straight to the build directory
gulp.task('dev', function() {
  gulp.src('*.html')
    .pipe(gulp.dest('_dist/'));
  gulp.src('js/**/*.js')
    .pipe(gulp.dest('_dist/js/'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['index', 'dust-templates', 'dev', 'sass'], function() {

  browserSync.init({
    server: "_dist"
  });

  gulp.watch("js/**/*.js", ['dev']).on('change', reload);
  gulp.watch("*.html", ['dev']).on('change', reload);
  gulp.watch("tpl/*.html", ['dust-templates']).on('change', reload);
  gulp.watch("links/*.yml", ['index']).on('change', reload);
  gulp.watch("scss/**/*.scss", ['sass']).on('change', reload);
  gulp.watch("_dist/css/**/*.css").on('change', reload);
});
