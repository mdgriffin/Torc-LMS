var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function() {
    return gulp.src('src/main/sass/global.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/main/resources/static/css/'));
});

//watch task
gulp.task('default',function() {
    gulp.watch('src/main/sass/**/*.scss',['sass']);
});

gulp.task('build', ['sass']);