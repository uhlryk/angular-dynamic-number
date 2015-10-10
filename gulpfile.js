var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var karma = require('karma').Server;

gulp.task("script",function(){
  gulp.src(["src/*.js"])
  .pipe(rename("dynamic-number.js"))
  .pipe(gulp.dest("release"))
  .pipe(uglify())
  .pipe(rename("dynamic-number.min.js"))
  .pipe(gulp.dest("release"))
  ;
});
gulp.task('test', ['script'],function (done) {
  karma.start({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
  }, function() {
      done();
  });
});