var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_uglify = require('gulp-uglify'),
    pump = require('pump');

var jsFilesDist = [
  './bower_components/jquery/dist/jquery.js',
  './bower_components/jquery/dist/jquery.min.js',
  './bower_components/jquery/dist/jquery.min.map'
  //'./bower_components/jquery/dist/*.*'
];

var jsFilesConcat = [
  './js/jquery.js',
  './js/app-dev.js'
];


gulp.task('move', function(){
  return gulp.src(jsFilesDist)
  .pipe(gulp.dest('js'));
}); 

gulp.task('concat', ['move'], function() {
  return gulp.src(jsFilesConcat)
    .pipe(gp_concat('app.js'))
    .pipe(gulp.dest('js'));  
  
});

gulp.task('compress', ['concat'], function (cb) {
  console.log('1!!!!');
  
  pump([ 
      gulp.src('./js/app.js'),
      gp_uglify(),
      gulp.dest('js')
    ],
    cb
  );
  
  console.log('2!!!!');

});

gulp.task('build', ['move', 'concat', 'compress'], function(){ 
  // place extra code for build task here'
}); 

gulp.task('default', ['build'], function() {
  // place code for your default task here'
});
