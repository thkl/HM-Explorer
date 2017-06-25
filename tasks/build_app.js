const gulp = require('gulp');
const less = require('gulp-less');
const watch = require('gulp-watch');
const batch = require('gulp-batch');
const plumber = require('gulp-plumber');
const jetpack = require('fs-jetpack');
const bundle = require('./bundle');
const utils = require('./utils');
const jshint = require('gulp-jshint');

const projectDir = jetpack;
const srcDir = jetpack.cwd('./src');
const rootDir = jetpack.cwd('.');
const destDir = jetpack.cwd('./app');
const packDir = jetpack.cwd('./pack');
const packDirApp = jetpack.cwd('./pack/app');


gulp.task('pack', () => {
  return Promise.all([
    bundle(destDir.path('background.js'), packDirApp.path('background.js')),
    bundle(destDir.path('app.js'), packDirApp.path('app.js')),
    bundle(destDir.path('store.js'), packDirApp.path('store.js')),
    bundle(destDir.path('ccu/ccu_treerenderer.js'), packDirApp.path('ccu/ccu_treerenderer.js')),
    bundle(destDir.path('ccu/ccu_communication.js'), packDirApp.path('ccu/ccu_communication.js')),
    bundle(destDir.path('ccu/ccu.js'), packDirApp.path('ccu/ccu.js')),
    bundle(destDir.path('ui/sidebar.js'), packDirApp.path('ui/sidebar.js')),
    bundle(destDir.path('ui/workspace_pane.js'), packDirApp.path('ui/workspace_pane.js')),
    bundle(destDir.path('stylesheets/*'), packDirApp.path('stylesheets')),
    bundle(destDir.path('fonts/*'), packDirApp.path('fonts')),
    
  ]);
});


gulp.task('bundle', () => {
  return Promise.all([
    destDir.copy(destDir.path(), packDirApp.path(), { overwrite: true }),
    rootDir.copy(rootDir.path('node_modules'), packDir.path('node_modules'), { overwrite: true }),
    rootDir.copy(rootDir.path('package.json'), packDir.path('package.json'), { overwrite: true }),
	rootDir.copy(rootDir.path('config/env_production.json'), packDirApp.path('env.json'), { overwrite: true })
  ]);    
});

gulp.task('lint',function () {
  return gulp.src(srcDir.path('**/*.js'))
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
});


gulp.task('less', () => {
  return gulp.src(srcDir.path('stylesheets/*.less'))
  .pipe(plumber())
  .pipe(less())
  .pipe(gulp.dest(destDir.path('stylesheets')));
});

gulp.task('environment', () => {
  const configFile = `config/env_${utils.getEnvName()}.json`;
  projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('watch', () => {
  const beepOnError = (done) => {
    return (err) => {
      if (err) {
        utils.beepSound();
      }
      done(err);
    };
  };

  watch('src/**/*.js', batch((events, done) => {
    gulp.start('bundle', beepOnError(done));
  }));
  watch('src/**/*.less', batch((events, done) => {
    gulp.start('less', beepOnError(done));
  }));
});

gulp.task('build', ['lint','bundle', 'less', 'environment']);
