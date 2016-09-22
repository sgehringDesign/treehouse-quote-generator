var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_uglify = require('gulp-uglify');


gulp.task('build', function(){
  console.log(1);
  return gulp.src(['./bower_components/jquery/dist/jquery.min.js', './js/script.js'])
    .pipe(gp_concat('concat.js'))
    .pipe(gp_uglify())
    .pipe(gulp.dest('js'));
});

gulp.task('default', ['build'], function() {
  // place code for your default task here'
});
