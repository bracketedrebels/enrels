'use strict';

const del = require('del');
const gulp = require('gulp');
const merge = require('merge2');
const jasmine = require('gulp-jasmine');
const tsproject = require('gulp-typescript').createProject('tsconfig.json');

gulp.task('internal:compile:dev', () => 
    gulp.src('src/**/*.ts')
    .pipe(tsproject()).js
    .pipe(gulp.dest('tmp'))
);
gulp.task('internal:compile:dist', () => {
    let project = gulp.src(['src/**/*.ts', '!src/**/*.spec.ts']).pipe(tsproject());
    let dist = gulp.dest('dist');
    return merge([ project.dts.pipe(dist), project.js.pipe(dist) ]);
});
gulp.task('internal:tests', ['internal:compile:dev'], () => gulp.src('tmp/**/*.spec.js').pipe(jasmine()));

gulp.task('test', ['internal:tests'], () => del('tmp'));
gulp.task('dist', ['internal:compile:dist']);
