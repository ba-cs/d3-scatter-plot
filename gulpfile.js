const gulp = require('gulp');
const browserSync = require('browser-sync').create();

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: 'src/',
    },
  });
});

gulp.task('default', ['browserSync'], () => {
  gulp.watch(['src/**/*'], browserSync.reload);
});
