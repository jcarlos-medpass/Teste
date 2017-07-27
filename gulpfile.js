var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    dependencies = require('gulp-html-dependencies'),
    es = require('event-stream'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect');

// Default task
gulp.task('default', function() {
  gulp.start('connect', 'copy', 'watch', 'dependencies', 'vendor', 'scripts');
});

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 8000,
    livereload: false,
    fallback: 'dist/htmls/index.html'
  });
});

// Dependencies
gulp.task('dependencies', function() {
    return gulp.src('app/index.html')
        .pipe(dependencies({
            dest: 'dist',
            prefix: '/vendor',
        }))
        .pipe(gulp.dest('dist'));
});

// Copy
gulp.task('copy', function() {
    gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))

    gulp.src('app/svg/**/*')
        .pipe(gulp.dest('dist/svg/'))

    gulp.src('app/htmls/**/*')
        .pipe(gulp.dest('dist/htmls/'))

    gulp.src('app/data/**/*')
        .pipe(gulp.dest('dist/data/'))

    gulp.src('app/.htaccess')
        .pipe(gulp.dest('dist/'))
});

// Scripts
gulp.task('scripts', function() {
    return es.concat(
        gulp.src('app/scripts/app.js')
            .pipe(rename({ suffix: '.min' }))
            .pipe(uglify())
            .pipe(gulp.dest('dist/scripts')),

        gulp.src('app/scripts/configs/**/*.js')
            .pipe(concat('config.js'))
            .pipe(rename({ suffix: '.min' }))
            .pipe(uglify())
            .pipe(gulp.dest('dist/scripts')),

        gulp.src('app/scripts/factorys/**/*.js')
            .pipe(concat('factory.js'))
            .pipe(rename({ suffix: '.min' }))
            .pipe(uglify())
            .pipe(gulp.dest('dist/scripts')),

        gulp.src('app/scripts/controllers/**/*.js')
            .pipe(concat('controller.js'))
            .pipe(rename({ suffix: '.min' }))
            .pipe(uglify())
            .pipe(gulp.dest('dist/scripts')),

        gulp.src('app/scripts/utils/**/*.js')
            .pipe(concat('utils.js'))
            .pipe(rename({ suffix: '.min' }))
            .pipe(uglify())
            .pipe(gulp.dest('dist/scripts')),

        gulp.src('app/scripts/directives/**/*.js')
            .pipe(concat('directive.js'))
            .pipe(rename({ suffix: '.min' }))
            //.pipe(uglify())
            .pipe(gulp.dest('dist/scripts'))
            // .pipe(notify({ message: 'Scripts task complete' }))
        );
});

// Vendor
gulp.task('vendor', function() {
  return gulp.src(
      [
        'node_modules/angular/angular.min.js',
        'node_modules/angular-route/angular-route.min.js',
        'node_modules/angular-sanitize/angular-sanitize.min.js'
      ])
      .pipe(gulp.dest('./dist/vendor'));
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('app/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('app/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('app/images/**/*', ['images']);

  // Watch audio files
  gulp.watch('app/audios/**/*', ['audios']);

  // Watch html files
  gulp.watch('app/**/*', ['copy', 'dependencies']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);

});