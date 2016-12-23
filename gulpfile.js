'use strict';

const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const tsProject = require('gulp-typescript').createProject('tsconfig.json');
const del = require('del');

gulp.task('internal:tests', ['internal:compile'], () => 
    gulp.src('tmp/**/*.spec.js')
    .pipe(jasmine())
);

gulp.task('internal:compile', () => 
    gulp.src('src/**/*.ts')
    .pipe(tsProject()).js
    .pipe(gulp.dest('tmp'))
);

gulp.task('test', ['internal:tests'], () => del('tmp'));
