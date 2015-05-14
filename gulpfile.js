var gulp = require('gulp'),
    watch = require('gulp-watch'),
    yaml = require('gulp-yaml');

// Convert the YAML indexes to JSON
gulp.task('index', function() {
  gulp.src('links/*.yml')
    .pipe(yaml({ safe: true }))
    .pipe(gulp.dest('_dist/js/'));
});

// For Dev, just copy the HTML, JS, and CSS straight to the build directory
gulp.task('dev', function() {
  gulp.src('index.html')
    .pipe(gulp.dest('_dist/'));
  gulp.src('js/**/*.js')
    .pipe(gulp.dest('_dist/js/'));
});

gulp.task('dev-watch', function () {
  watch("js/**/*.js", function() {
    gulp.start("dev");
  });
  watch("*.html", function() {
    gulp.start("dev");
  });
  watch("links/*.yml", function() {
    gulp.start("index");
  });
});
