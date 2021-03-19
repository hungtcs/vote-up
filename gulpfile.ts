import del from 'del';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import minimist from 'minimist';
import gulpSass from 'gulp-sass';
import undertaker from 'undertaker';
import mergeStream from 'merge-stream';
import gulpSourcemaps from 'gulp-sourcemaps';


interface Options extends minimist.ParsedArgs {
  production: boolean;
}

const options: Options = minimist(process.argv.slice(2), {
  boolean: ['production', 'watch'],
  default: {
    watch: false,
    production: process.env.NODE_ENV === 'production',
  },
}) as unknown as minimist.ParsedArgs & Options;

const gulpIfSourcemapsInit = () => gulpIf(!options.production, gulpSourcemaps.init());
const gulpIfSourcemapsWrite = (_path = './') => gulpIf(!options.production, gulpSourcemaps.write(_path));

function gulpTaskIf(condition: boolean, task: gulp.TaskFunction): undertaker.TaskFunction {
  const newTask: undertaker.TaskFunction = (callback) => {
    if(condition) {
      gulp.series(task)(callback);
    } else {
      callback();
    }
  };
  return (newTask.displayName = task.name, newTask);
}

export function clean() {
  return del([
    'dist/views/**/*',
    'dist/styles/**/*',
    'dist/assets/**/*',
  ]);
}

function styles() {
  return gulp.src('src/styles/**/*.{sass,scss}')
    .pipe(gulpIfSourcemapsInit())
    .pipe(gulpSass({ outputStyle: options.production ? 'compressed' : 'expanded' }).on('error', gulpSass.logError))
    .pipe(gulpIfSourcemapsWrite())
    .pipe(gulp.dest('dist/styles'));
}

function asserts() {
  return mergeStream(
    gulp.src('src/assets/**/*')
      .pipe(gulp.dest('dist/assets/')),
    gulp.src('src/views/**/*')
      .pipe(gulp.dest('dist/views/')),
  );
}

function watch() {
  gulp.watch('src/styles/**/*.{sass,scss}', styles);
  gulp.watch(['src/assets/**/*', 'src/views/**/*'], asserts);
  return Promise.resolve();
}

exports.build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    asserts,
  ),
  gulpTaskIf(options.watch, gulp.parallel(watch)),
);
