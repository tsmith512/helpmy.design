var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    dust = require('gulp-dust'),
    reload = browserSync.reload,
    sass = require('gulp-ruby-sass'),
    tap = require('gulp-tap'),
    util = require('util'),
    watch = require('gulp-watch'),
    yaml = require('gulp-yaml');

// Convert the YAML indexes to JSON
gulp.task('index', function() {
  gulp.src('links/*.yml')
    .pipe(yaml({ safe: true }))
    .pipe(tap(function(indexBuffer){
      // Tap into the stream and reorder the links in the buffer so they
      // will be in alphabetical order without the client needing to do so.
      // We'll also aggregate and count all types and tags for all links.
      var index = JSON.parse(indexBuffer.contents.toString('utf8')),
          tags = {},
          types = {};

      index.links.sort(function(a, b){
        var titleA = a.title.toLowerCase().replace(/^(a(n)?|the) /, ''),
            titleB = b.title.toLowerCase().replace(/^(a(n)?|the) /, '');

        if      (titleA > titleB) { return  1 }
        else if (titleA < titleB) { return -1 }
        else    { return 0 }
      });

      // Process each article
      index.links.forEach(function(item, i){

        // Add an ID to each
        item.id = i;

        // Aggregate tags across all links so we have a count of each
        item.tags.forEach(function(tag, x){
          if (tag in tags) {
            tags[tag]++
          } else {
            tags[tag] = 1;
          }
        });

        // Aggregate types  across all links so we have a count of each
        if (item.type in types) {
          types[item.type]++
        } else {
          types[item.type] = 1;
        }

      });

      index.types = types;
      index.tags = tags;

      indexBuffer.contents = new Buffer(JSON.stringify(index));
    }))
    .pipe(gulp.dest('_dist/js/'))
    .pipe(tap(function(indexBuffer){
      // Tap into the stream and reorder the links in the buffer so they
      // will be in alphabetical order without the client needing to do so.
      var index = JSON.parse(indexBuffer.contents.toString('utf8')),
          cssRules = ['.js-filtered article { display: none; }'],
          tags = index.tags,
          types = index.types;

      for (var tag in tags) {
        if (tags.hasOwnProperty(tag)) {
          cssRules.push('.js-filtered.tag-' + tag + ' .tag-' + tag + ' { display: block; }');
          cssRules.push('.js-filtered.tag-' + tag + ' li[data-tag="tag-' + tag + '"] { color: white; }');
        }
      }
      for (var type in types) {
        if (types.hasOwnProperty(type)) {
          cssRules.push('.js-filtered.type-' + type + ' .type-' + type + ' { display: block; }');
        }
      }

      indexBuffer.contents = new Buffer(cssRules.join(' '));
    }))
    .pipe(concat('index.css'))
    .pipe(gulp.dest('_dist/css/'));
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

// Gather and concatenate all JS
gulp.task('js', function () {
  gulp.src([
    'js/vendor/dustjs/dist/dust-full.js',
    'js/vendor/dust-helpers/dist/dust-helpers.js',
    'js/vendor/dust-motes/src/helpers/control/iterate/iterate.js',
  ])
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('_dist/js'));

  gulp.src([
    'js/main.js',
  ])
    .pipe(concat('main.js'))
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

gulp.task('build', ['index', 'dust-templates', 'js', 'dev', 'sass']);
