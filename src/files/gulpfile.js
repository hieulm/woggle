const gulp = require('gulp');
const rename = require('gulp-rename');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const runSequence = require('run-sequence');

const ts = require('gulp-typescript').createProject('tsconfig.json');

// compile pug
gulp.task('compile:pug', function () {
    var locals = require('./locals.pug.json');

    return gulp.src('./src/pug/**/*.pug')
        .pipe(pug({
            locals: locals,
            pretty: true
        }))
        .pipe(rename({ dirname: 'html' }))
        .pipe(gulp.dest('./build'))
        ;
});

// compile scss
gulp.task('compile:scss:all', function () {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({ dirname: 'css' }))
        .pipe(gulp.dest('./build'))

        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build'))
        ;
});
gulp.task('compile:scss:combine', function () {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('build.css'))
        .pipe(gulp.dest('./build/css'))

        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(concat('build.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/css'))
        ;
});
gulp.task('compile:scss', function (cb) {
    runSequence('compile:scss:all', 'compile:scss:combine', cb);
});

// compile typescript
gulp.task('compile:ts:all', function () {
    var tsResult = gulp.src('./src/ts/**/*.ts').pipe(ts());

    return tsResult.js
        .pipe(rename({ dirname: 'js' }))
        .pipe(gulp.dest('./build'))

        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build'))
        ;
});
gulp.task('compile:ts:combine', function () {
    var tsResult = gulp.src('./src/ts/**/*.ts').pipe(ts());

    return tsResult.js
        .pipe(concat('build.js'))
        .pipe(gulp.dest('./build/js'))

        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('build.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/js'))
        ;
});
gulp.task('compile:ts', function (cb) {
    runSequence('compile:ts:all', 'compile:ts:combine', cb);
});

// compile css
gulp.task('compile:css:all', function () {
    return gulp.src('./src/css/**/*.css')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({ dirname: 'css' }))
        .pipe(gulp.dest('./build'))

        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build'))
        ;
});
gulp.task('compile:css:combine', function () {
    return gulp.src('./src/css/**/*.css')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('build.css'))
        .pipe(gulp.dest('./build/css'))

        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(concat('build.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/css'))
        ;
});
gulp.task('compile:css', function (cb) {
    runSequence('compile:css:all', 'compile:css:combine', cb);
});

// compile JavaScript
gulp.task('compile:js:all', function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(rename({ dirname: 'js' }))
        .pipe(gulp.dest('./build'))

        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build'))
        ;
});
gulp.task('compile:js:combine', function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(concat('build.js'))
        .pipe(gulp.dest('./build/js'))

        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('build.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/js'))
        ;
});
gulp.task('compile:js', function (cb) {
    runSequence('compile:js:all', 'compile:js:combine', cb);
});


/*********************************************/

// build
gulp.task('build', ['compile:pug', 'compile:scss', 'compile:ts', 'compile:css', 'compile:js']);

// watch
gulp.task('watch', ['build'], function () {
    gulp.watch(['./src/**/*'], ['build']);
});