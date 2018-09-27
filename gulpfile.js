var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    rename       = require('gulp-rename'),
    notify       = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano      = require('gulp-cssnano'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    spritesmith  = require('gulp.spritesmith'),
    browserSync  = require('browser-sync'),
    htmlmin      = require('gulp-htmlmin'),
    del          = require('del'),
    cache        = require('gulp-cache');
    
// операции с css
gulp.task('sass',function(){
    return gulp.src('app/sass/**/*.sass')
    .pipe(sass())
    .on('error', notify.onError(function(error){
        return {
            title: 'Styles',
            message: error.message
        };
    }))
    .pipe(rename({
        prefix: '',
        suffix: '.min'
    }))   
    .pipe(autoprefixer({
        browsers: ['last 4 version']
    }))
    .pipe(cssnano())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}));  
});
// операции с js
gulp.task('script', function(){
    return gulp.src([
            'app/libs/jquery/jquery.min.js',//всегка в начале 
             'app/js/common.js' //всегка в конце
        ])  
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(rename({
            prefix: '',
            suffix: '.min'
        }))          
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true}));
});
// сервер
gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'app'
        }
    });
});
// генерация спрайтов
gulp.task('sprite', function () {
	var spriteData = gulp.src('app/img/sprites/*.png').pipe(spritesmith({
    	imgName: '../img/sprites/sprite.png',
		cssName: '_sprite.sass',
		cssFormat: 'sass',
		algorithm: 'binary-tree',
		padding: 10
}));
  return spriteData.img.pipe(gulp.dest('app/img')),
  		 spriteData.css.pipe(gulp.dest('app/sass'));
});
// надзератель 
gulp.task('start', ['sass', 'script', 'browser-sync'], function(){
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/*.*', browserSync.reload);
    gulp.watch('app/**/*.js', ['script']);
});
// чистка кеша 
gulp.task('clear-cache', function(){
    return cache.clearAll();
});
// сборка проекта
gulp.task('build', function(){
    var buildHtml       = gulp.src(['app/*.html']).pipe(htmlmin({collapseWhitespace: true})).pipe(gulp.dest('dist'));
    var buildCss        = gulp.src(['app/css/*.css']).pipe(gulp.dest('dist/css'));
    var buildJs         = gulp.src(['app/js/scripts.min.js']).pipe(gulp.dest('dist/js'));
    var buildImg        = gulp.src(['app/img/**/*']).pipe(cache(imagemin({progressive: true}))).pipe(gulp.dest('dist/img'));
    var buildFonts      = gulp.src(['app/fonts/**/*']).pipe(gulp.dest('dist/fonts'));
});
// удалить папку с проектом
gulp.task('del', function() { return del.sync('dist'); });

// gulp start - начало проекта
// gulp build - собрать готовый проект
// gulp clear-cache - очистка кеша img 
// gulp del - удилить папку с готовым проектом