/* ph stamps */
/* /^(?!mochaTesting).*$/ */
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
    'gddify': 'gddify'
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
/* endstamp */

module.exports = packageObject;
