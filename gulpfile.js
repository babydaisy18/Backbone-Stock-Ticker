var gulp = require('gulp');
var eslint = require('gulp-eslint');
var zip = require('gulp-zip');

var JS = [
  'js/collections/*.js',
  'js/routers/*.js',
  'js/views/*.js'
];

var FILES = [
  'js/**/*'
];

var options = {
  rulePaths: ['.eslint_rules']
};

gulp.task('eslint', function () {
  return gulp.src(JS)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('zip', function () {
  return gulp.src(FILES, {base: '.'})
    .pipe(zip('files.zip'))
    .pipe(gulp.dest(''));
});
