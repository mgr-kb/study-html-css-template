"use strict";

const gulp = require('gulp');
const plumber = require('gulp-plumber');
// sass
const sass = require('gulp-sass');
const combineMq = require('gulp-combine-mq');
const sassGlob = require("gulp-sass-glob");

// babel
const babelify = require('babelify');
// browserify
const browserify = require('browserify');

const source = require('vinyl-source-stream');
const notify = require('gulp-notify');
const eslint = require('gulp-eslint');

gulp.task('sass', function() {
    return gulp.src('src/scss/style.scss')
    .pipe(sassGlob())
    .pipe(sass({
        outputStyle: 'expanded'
    })).on('error', sass.logError)
    .pipe(combineMq({
            beautify: true
        }))
    .pipe(gulp.dest('./src/css/'));
});

gulp.task('browserify', function () {
    return browserify('./src/js/main.js')
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .on('error', function(err){
            console.log(err.message);
            console.log(err.stack);
        })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./js/'));
});

gulp.task('lint', function(){
    return gulp.src('./src/js/*.js')
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(eslint({useEslintrc: true}))
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
        .pipe(plumber.stop());
});

gulp.task('watch', gulp.series(gulp.task('sass'), function () {
  gulp.watch('src/scss/**/*.scss', gulp.task('sass'));
  gulp.watch('src/js/**/*.js', gulp.task('browserify'));
}));