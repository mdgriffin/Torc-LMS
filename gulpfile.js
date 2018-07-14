var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function() {
    //compile and copy our sass file
    gulp.src('src/main/sass/global.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/main/resources/static/css/'));
});

//watch task
gulp.task('default',function() {
    gulp.watch('src/main/sass/**/*.scss',['styles']);
});

//these get run by gradle when building the app
gulp.task('build', ['styles']);