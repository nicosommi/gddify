/* ph stamps */
/* /^(?!webapp{1})(?!service{1}).*$/ */
/* endph */
import gulp from 'gulp'
import mocha from 'gulp-mocha'
import istanbul from 'gulp-babel-istanbul'
import 'should'

function defineTestTask (taskName, reporters, sourceCode, spec) {
  gulp.task(taskName, (cb) => {
    gulp.src(sourceCode)
      .pipe(istanbul({
        includeUntested: true
      })) // Covering files
      .pipe(istanbul.hookRequire()) // Force `require` to return covered files
      .on('finish', () => {
        gulp.src(spec)
          .pipe(mocha())
          .pipe(istanbul.writeReports({dir: `${__dirname}/../.coverage`, reporters})) // Creating the reports after tests ran
          .pipe(istanbul.enforceThresholds({ thresholds: { global: 55 } })) // Enforce a coverage of at least 90%
          .on('end', cb)
      })
  })
}

function defineWatchTask (taskName, testTasks, dependencies, directories) {
  gulp.task(taskName, dependencies, () => {
    gulp.watch(directories, testTasks)
  })
}

/* stamp webapp */
/* endstamp */
/* stamp lib */
defineTestTask('test-lib', ['text-summary', 'lcovonly'], './source/**/*.js', './spec/**/*.spec.js')
defineTestTask('test-coverage', ['text', 'html'], './source/**/*.js', './spec/**/*.spec.js')
defineWatchTask('test-watch', ['test-coverage'], ['suppress-errors'], ['./source/**/*', './spec/**/*'])
gulp.task('test', ['test-lib'])
/* endstamp */
/* stamp service */
/* endstamp */
