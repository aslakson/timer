const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const browserify = require('gulp-browserify');
const replace = require('gulp-replace');
const config = require('./config');
const webserver = require('gulp-webserver');

gulp.task('sass', () => {
  gulp.src(config.paths.scss.in)
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest(config.paths.scss.out));
});

gulp.task('browserify', () => {
  gulp.src(config.paths.js.entryFile)
    .pipe(plumber())
    .pipe(browserify({
      transform: ['babelify'],
    }))
    .pipe(gulp.dest(config.paths.js.out));
});

gulp.task('indexfile', () => {
  gulp.src(config.paths.html.in)
    .pipe(replace('/docs/', '/'))
    .pipe(gulp.dest(config.paths.html.out));
});

gulp.task('webserver', () => {
  gulp.src('.')
    .pipe(webserver({
      fallback: './src/index.html',
      host: config.server.host,
      port: config.server.port,
      livereload: true,
      directoryListing: false,
    }));
});

gulp.task('watch', () => {
  gulp.watch(config.paths.scss.in, ['sass']);
  gulp.watch(config.paths.js.in, ['browserify']);
});

gulp.task('build', ['browserify', 'sass']);
gulp.task('publish', ['browserify', 'sass', 'indexfile']);

gulp.task('default', ['build', 'webserver', 'watch']);
