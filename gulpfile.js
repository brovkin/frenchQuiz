'use strict';

let gulp = require('gulp'),
    fileinclude = require('gulp-file-include'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    rep = require('gulp-replace-image-src'),
    babel = require('gulp-babel'),
    reload = browserSync.reload;


var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*',
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/partials/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    // tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "brovkin_style"
};

gulp.task('html:build', gulp.series(function (cb) {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
    cb();
}));

gulp.task('js:build', gulp.series(function (cb) {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
    cb();
}));

gulp.task('style:build', gulp.series(function (cb) {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
    cb();
}));

gulp.task('image:build', gulp.series(function (cb) {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
    cb();
}));

gulp.task('fonts:build', gulp.series(function(cb) {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
    cb();
}));

gulp.task('replace', function() {
    gulp.src('*.html')

        .pipe(rep({
            prependSrc : '//github.cdn.com/images/',
            keepOrigin : true
        }))
        .pipe(gulp.dest('dist'));
    gulp.src('*.scss')
        .pipe(rep({
            prependSrc : '//github.cdn.com/images/',
            keepOrigin : true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series([
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
'replace'], function(cb){
    cb();
}));

gulp.task('watch', gulp.series(function(cb){
        gulp.watch('src/style/**/*.scss', gulp.series('style:build'));
        gulp.watch('src/*.html', gulp.series('html:build'));
        gulp.watch('src/js/**/*.js', gulp.series('js:build'));
        gulp.watch('src/img/*', gulp.series('image:build'));
        gulp.watch('src/fonts/*', gulp.series('fonts:build'));
    cb();
}));



gulp.task('webserver', gulp.series(function (cb) {
    browserSync(config);
    cb();
}));

gulp.task('clean', gulp.series(function (cb) {
    rimraf(path.clean, cb);
    cb();
}));

let taskArr = ['webserver', 'watch', 'build'];

gulp.task('default', gulp.parallel(taskArr))