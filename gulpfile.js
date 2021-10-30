const {src, dest, watch, parallel, series} = require('gulp');       // Присваиваем возможности Galp константам
                                                            // dest - выкидывает файл в определённую папку.
const scss         = require('gulp-sass')(require('sass')); // scss - присваиваем возможность компилировать scss в css
const concat       = require('gulp-concat');                // плагин для конкатенации файлов
const autoprefixer = require('gulp-autoprefixer');          // плагин который устанавливает префиксы для свойств css, чтобы использовать их в браузерах которые их не поддерживают
const uglify       = require('gulp-uglify');                // плагин способен минифицировать(сжимать) js файлы
const browserSync  = require('browser-sync').create();      // плагин позволяет обновлять страницу если какой то из файлов изменился
const imagemin     = require('gulp-imagemin');              // плагин для минификации изображений
const del          = require('del');                        // удаляет dist

function styles() {                                         // функция для преобразования scss в css
 return src('app/scss/style.scss')                          // выбираем тот элемент который нужно преобразовать
  .pipe(scss({outputStyle: 'compressed'}))                  // то что указано в {} скобках говорит как нужно оформить скомпилированные css код (расстановка слов, пробелы и так далее).В данном случае compressed делает код минифицированным
  .pipe(concat('style.min.css'))                            // С помощью плагина concat устанавливаем для файла то имя которое мы хотим
  .pipe(autoprefixer({                                      // Перед тем как отправить файл в чистую папку, добавляем к свойствам css автопрефиксы
    overrideBrowserslist: ['last 10 versions'],
    grid: true
  }))
  .pipe(dest('app/css'))                                   // выкидываем в папку app/css
  .pipe(browserSync.stream())                              // обновляем страницу в браузере
} 

function scripts() {                                        // Функция для объединения файлов js и их миницикации
  return src([                                              // выбираем все файлы которые хотим объединить
    'node_modules/jquery/dist/jquery.js',
    'app/js/main.js'
  ])
  .pipe(concat('main.min.js'))                              // С помощью плагина concat даём имя конечному файлу 
  .pipe(uglify())                                           // минифицируем js файл
  .pipe(dest('app/js'))                                     // выкидываем js файл в заданную папку
  .pipe(browserSync.stream())                               // обновляем страницу в браузере                            
}

function images() {                                        // функция минифицирует изображения
  return src('app/images/**/*.*')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
	  imagemin.mozjpeg({quality: 75, progressive: true}),
	  imagemin.optipng({optimizationLevel: 5}),
	  imagemin.svgo({
		plugins: [
			{removeViewBox: true},
			{cleanupIDs: false}
		]
	})
  ]))
  .pipe(dest('dist/images'))
}

function browsersync() {                                   // обновляет страницу в браузере
  browserSync.init({
    server: {
      baseDir: 'app/'
    }
  })
}

function build() {                                           // берёт все готовые файлы и переносит их в dist
  return src([
    'app/**/*.html',
    'app/css/style.min.css',
    'app/js/main.min.js'
  ], {base: 'app'})
  .pipe(dest('dist'))
}

function cleanDist() {                                       // удаляет dist(главную папку)
  return del('dist');
}

function watching() {                                         // функция будет следить за изменениями в файле, и если такие есть будет обновлять конечный файл
  watch(['app/scss/**/*.scss'], styles);                      // говорим за кем следить и если изменения в файле есть выполнять команду exports.styles 
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);  // говорим за кем следить и если изменения в файле есть выполнять команду exports.scripts
  watch(['app/**/*.html']).on('change', browserSync.reload); 
}

exports.styles = styles;                                   // команде styles присваиваются возможности функции styles() 
exports.scripts = scripts;                                 // команде scripts присваиваем возможности функции scripts()
exports.browsersync = browsersync;                         // команде browsersync присваиваются возможности функции browsersync()
exports.watching = watching;                               // Теперь командой watching будет запускаться слежение за файлами
exports.images = images;                                   // команде images присваиваются возможности функции images()
exports.cleanDist = cleanDist;                             // команде cleanDist присваиваются возможности функции cleanDist()
exports.build = series(cleanDist, images, build);          // series позволяет запускать серию


exports.default = parallel(styles, scripts, browsersync, watching);   // parallel позволяет одновременно запускать таски(команды);