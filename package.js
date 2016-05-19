/* ph replacements */
/* name, /gddify/g, gddify */
/* endph */

module.exports =
{
  'name': 'gddify',
  'version': '0.1.2',
  'description': '',
  'main': 'index.js',
  'standard': {
    'globals': [
      'describe',
      'context',
      'before',
      'beforeEach',
      'after',
      'afterEach',
      'it',
      'expect'
    ]
  },
  'bin': {
    'gddify': './dist/bin/gddify.js'
  },
  'scripts': {
    'gddify': 'gddify',
    'test': 'gulp test',
    'build': 'gulp build',
    'coverage': 'gulp test-coverage',
    'watch': 'gulp test-watch',
    'gulp': 'gulp'
  },
  'author': 'nicosommi',
  'license': 'UNLICENSED',
  'dependencies': {
    'bluebird': '^3.3.5',
    'chalk': '^1.1.3',
    'clone': '^1.0.2',
    'debug': '^2.2.0',
    'fs-extra': '^0.26.7',
    'gene-js': 'file:../gene-js',
    'glob': '^7.0.3',
    'incognito': '^0.1.4',
    'inquirer': '^1.0.2',
    'liftoff': '^2.2.1',
    'prfun': '^2.1.3',
    'semver': '^5.1.0',
    'yargs': '^4.7.0'
  },
  'devDependencies': {
    'sinon': '^1.17.3',
    'should': '^8.2.2',
    'babel': '^6.5.2',
    'babel-core': '^6.6.4',
    'babel-eslint': '^3.1.30',
    'babel-plugin-rewire': '^1.0.0-rc-1',
    'babel-preset-es2015': '^6.6.0',
    'coveralls': '^2.11.2',
    'del': '^2.2.0',
    'eslint': '^0.24.0',
    'gulp': '^3.9.1',
    'gulp-babel': '^6.1.2',
    'gulp-babel-istanbul': '^1.0.0',
    'gulp-istanbul': '^0.10.3',
    'gulp-mocha': '^2.1.3',
    'gulp-util': '^3.0.6',
    'run-sequence': '^1.1.5',
    'mocha': '^2.2.5'
  },
  'repository': {
    'type': 'git',
    'url': 'git+https://github.com/nicosommi/gddify.git'
  },
  'readmeFilename': 'README.md',
  'contributors': [],
  'homepage': 'https://github.com/nicosommi/gddify'
}
