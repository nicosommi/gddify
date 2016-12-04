/* ph stamps */
/* /^.*$/ */
/* endph */

let packageObject = {
  'directories': {
    'test': 'test'
  },
  'babel': {
    'presets': ['es2015']
  },
  'dependencies': {
  },
  'devDependencies': {
    'gddify': '^0.1.2',
    'babel-polyfill': '^6.9.1',
    'babel-preset-es2015': '^6.9.0',
    'babel-register': '^6.9.0',
    'babel-require': '^1.0.1'
  },
  'scripts': {
  },
  'author': 'nicosommi',
  'license': 'MIT'
};

/* ph customPackage */
packageObject = {
  ...packageObject,
  'name': 'test',
  'version': '0.0.0',
  'description': '',
  'devDependencies': {
    ...packageObject.devDependencies,
    'debug': '^2.2.0'
  }
}
/* endph */

/* stamp mochaTesting */
packageObject = {
  ...packageObject,
  'devDependencies': {
    ...packageObject.devDependencies,
    'mocha': '^2.5.3',
    'nyc': '^10.0.0',
    'proxyquire': '^1.7.10',
    'watch': '^0.19.1',
    'cross-env': '^3.1.3'
  },
  'scripts': {
    ...packageObject.scripts,
    'test': 'cross-env NODE_ENV=test nyc --reporter=text-summary mocha \'test/**/*.test.js\'',
    'watch': 'cross-env NODE_ENV=test watch \'nyc --reporter=text-summary mocha "test/**/*.test.js"\' src test --ignoreDotFiles',
    'coverage': 'cross-env NODE_ENV=test nyc mocha \'test/**/*.test.js\''
  }
}
/* endstamp */

module.exports = packageObject;
