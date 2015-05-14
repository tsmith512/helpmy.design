var gulp = require('gulp'),
    dust = require('gulp-dust');
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

// For Dev, just copy the HTML, JS, and CSS straight to the build directory
gulp.task('dev', function() {
  gulp.src('*.html')
    .pipe(gulp.dest('_dist/'));
  gulp.src('js/**/*.js')
    .pipe(gulp.dest('_dist/js/'));
});

gulp.task('dev-watch', function () {
  watch("js/**/*.js", function() {
    setTimeout(function(){gulp.start("dev");}, 300);
  });
  watch("*.html", function() {
    setTimeout(function(){gulp.start("dev");}, 300);
  });
  watch("tpl/*.html", function() {
    setTimeout(function(){gulp.start("dust-templates");}, 300);
  });
  watch("links/*.yml", function() {
    setTimeout(function(){gulp.start("index");}, 300);
  });
});
