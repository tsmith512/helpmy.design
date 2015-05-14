var gulp = require('gulp'),
    yaml = require('gulp-yaml');

gulp.task('index', function() {
  gulp.src('./links/*.yml')
    .pipe(yaml({ safe: true }))
    .pipe(gulp.dest('./_dist/js/'))
});
