'use strict';

const gulp = require('gulp');
const bro = require('gulp-bro');
const terser = require('gulp-terser');
const headerComment = require('gulp-header-comment');

gulp.task('default', () => {
  return gulp.src('./build/AMF.js').pipe(bro()).pipe(terser()).pipe(headerComment(`
  Author: <%= _.capitalize(pkg.author) %>
  Version: <%= pkg.version %>
  License: <%= pkg.license %>
`)).pipe(gulp.dest('./browser'));
});
