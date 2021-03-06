/* ph replacements */
/* name, /'name': 'gddify'/g, 'name': 'gddify' */
/* version, /'version': '\bv?(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?\b'/ig, 'version': '0.1.17' */
/* description, /'description': 'a\ gdd\ utility'/g, 'description': 'a gdd utility' */
/* main, /'main': '[a-zA-Z\.\/]+'/ig, 'main': 'index.js' */
/* license, /MIT/g, MIT */
/* endph */
/* ph stamps */
/* /^(?!webapp_scripts{1})(?!service_scripts{1})(?!webapp_dependencies{1})(?!service_dependencies{1})(?!webapp_devDependencies{1})(?!service_devDependencies{1}).*$/ */
/* endph */

module.exports =
{
  'name': 'gddify',
  'version': '0.1.17',
  'description': 'a gdd utility',
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
      'xit',
      'expect'
    ]
  },
  /* ph bin */
  'bin': {
    'gddify': './dist/bin/gddify.js'
  },
  /* endph */
  'scripts': {
    /* ph componentScripts */
    /* endph */
    /* stamp webapp_scripts */
    /* endstamp */
    /* stamp lib_scripts */
    /* endstamp */
    /* stamp service_scripts */
    /* endstamp */
    'checkDependencies': 'nsp check',
    'gddify': 'gddify',
    'test': 'gulp test',
    'build': 'gulp build',
    'coverage': 'gulp test-coverage',
    'watch': 'gulp test-watch',
    'gulp': 'gulp'
  },
  'author': 'nicosommi',
  'license': 'MIT',
  'dependencies': {
    /* ph componentDependencies */
    'fs-extra': '^0.26.7',
    'gene-js': '0.1.7',
    'inquirer': '^1.0.2',
    'semver': '^5.1.0',
    'glob': '^7.1.2',
    'flowsync': '^0.1.12',
    'liftoff': '^2.2.1',
    'yargs': '^8.0.1',
    'babel-core': '^6.6.4',
    'babel-preset-stage-2': '^6.18.0',
    /* endph */
    /* stamp webapp_dependencies */
    /* endstamp */
    /* stamp lib_dependencies */
    'incognito': '^0.1.4',
    /* endstamp */
    /* stamp service_dependencies */
    /* endstamp */
    'bluebird': '^3.3.5',
    'debug': '^2.2.0'
  },
  'devDependencies': {
    /* ph componentDevDependencies */
    'babel-template': '^6.25.0',
    /* endph */
    /* stamp webapp_devDependencies */
    /* endstamp */
    /* stamp lib_devDependencies */
    'sinon': '^1.17.3',
    'should': '^8.2.2',
    'mocha': '^2.2.5',
    /* endstamp */
    /* stamp service_devDependencies */
    /* endstamp */
    'nsp': '^2.6.3',
    'babel': '^6.5.2',
    'babel-core': '^6.6.4',
    'babel-eslint': '^3.1.30',
    'babel-plugin-rewire': '^1.0.0-rc-1',
    'babel-preset-es2015': '^6.6.0',
    'gulp': '^3.9.1',
    'gulp-babel': '^6.1.2',
    'gulp-babel-istanbul': '^1.0.0',
    'gulp-istanbul': '^0.10.3',
    'gulp-mocha': '^2.1.3',
    'gulp-util': '^3.0.6',
    'run-sequence': '^1.1.5',
    'del': '^2.2.0',
    'coveralls': '^2.11.2'
  },
  /* ph repository */
  'repository': {
    'type': 'git',
    'url': 'git+https://github.com/nicosommi/gddify.git'
  },
  /* endph */
  /* ph extra */
  /* endph */
  'readmeFilename': 'README.md',
  /* ph contributors */
  'contributors': [],
  /* endph */
  /* ph homepage */
  'homepage': 'https://github.com/nicosommi/gddify'
  /* endph */
}
