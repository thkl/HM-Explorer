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


gulp.task('bundle', () => {
  return Promise.all([
    bundle(srcDir.path('background.js'), destDir.path('background.js')),
    bundle(srcDir.path('app.js'), destDir.path('app.js')),
    bundle(srcDir.path('store.js'), destDir.path('store.js')),
    bundle(srcDir.path('ccu/ccu_treerenderer.js'), destDir.path('ccu/ccu_treerenderer.js')),
    bundle(srcDir.path('ccu/ccu_communication.js'), destDir.path('ccu/ccu_communication.js')),
    bundle(srcDir.path('ccu/ccu.js'), destDir.path('ccu/ccu.js')),
    bundle(srcDir.path('ui/sidebar.js'), destDir.path('ui/sidebar.js')),
    bundle(srcDir.path('ui/workspace_pane.js'), destDir.path('ui/workspace_pane.js')),
    bundle(srcDir.path('ui/icons.js'), destDir.path('ui/icons.js')),
  ]);
});


gulp.task('pack', () => {
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
