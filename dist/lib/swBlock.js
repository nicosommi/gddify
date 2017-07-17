'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-console */


var _geneJs = require('gene-js');

var _promise = require('./promise.js');

var _promise2 = _interopRequireDefault(_promise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('nicosommi.gddify.swBlock');

var SwBlock = function () {
  function SwBlock(name, type, version, options) {
    _classCallCheck(this, SwBlock);

    this.name = name;
    this.type = type;
    this.version = version;
    this.options = options;
    this.sourceCodeFiles = [];
  }

  _createClass(SwBlock, [{
    key: 'addSourceCodeFile',
    value: function addSourceCodeFile(sourceCodeFile) {
      var newOptions = Object.assign({}, sourceCodeFile.options, this.options); // passing options down through
      var newSourceCodeFile = new (_get__('SourceCodeFile'))(sourceCodeFile.name, sourceCodeFile.path, newOptions);
      this.sourceCodeFiles.push(newSourceCodeFile);
      return newSourceCodeFile;
    }
  }, {
    key: 'addSourceCodeFiles',
    value: function addSourceCodeFiles(sourceCodeFiles) {
      var _this = this;

      sourceCodeFiles.forEach(function (sourceCodeFile) {
        return _this.addSourceCodeFile(sourceCodeFile);
      });
    }
  }, {
    key: 'getMeta',
    value: function getMeta() {
      var _this2 = this;

      return _get__('Promise').all(this.sourceCodeFiles.map(function (sourceCodeFile) {
        return sourceCodeFile.getMeta();
      })).then(function (results) {
        return _get__('Promise').resolve({
          name: _this2.name,
          type: _this2.type,
          version: _this2.version,
          sourceCodeFiles: results
        });
      });
    }
  }, {
    key: 'setMeta',
    value: function setMeta(metaObject) {
      return _get__('Promise').all(metaObject.sourceCodeFiles.map(function (sourceCodeFile) {
        var scf = new (_get__('SourceCodeFile'))(sourceCodeFile.name, sourceCodeFile.path);
        return scf.setMeta(sourceCodeFile);
      }));
    }
  }, {
    key: 'synchronizeWith',
    value: function synchronizeWith(rootBlock) {
      var _this3 = this;

      return new (_get__('Promise'))(function (resolve, reject) {
        _get__('debug')('checking block versions');
        if (_get__('semver').gte(rootBlock.version, _this3.version)) {
          _get__('debug')('syncing block to version ' + rootBlock.version);
          var errors = [];

          var promises = rootBlock.sourceCodeFiles.map(function (rootSourceCodeFile) {
            _get__('debug')('syncing file ' + rootSourceCodeFile.path);
            // find this.sourceCodeFile
            var matchingSourceCodeFile = _this3.sourceCodeFiles.find(function (sourceCodeFile) {
              return sourceCodeFile.name === rootSourceCodeFile.name;
            });
            if (matchingSourceCodeFile) {
              // add promess to process list
              return matchingSourceCodeFile.synchronizeWith(rootSourceCodeFile);
            } else {
              // create a potential promess to create it
              var newSourceCodeFile = void 0;
              if (_this3.options && _this3.options.basePath) {
                if (rootSourceCodeFile.path) {
                  newSourceCodeFile = _this3.addSourceCodeFile({
                    name: rootSourceCodeFile.name,
                    path: _get__('path').normalize('' + rootSourceCodeFile.path),
                    options: _this3.options
                  });
                  return newSourceCodeFile.synchronizeWith(rootSourceCodeFile);
                } else {
                  errors.push(new Error('ERROR: there is no path provided for the source file ' + rootSourceCodeFile.name + ' on the block of name ' + rootBlock.name + ' and type ' + rootBlock.type + '. Please ammend that and try again.'));
                }
              } else {
                errors.push(new Error('ERROR: there is no base path provided for the block ' + _this3.name + ', so the new source code file ' + rootSourceCodeFile.name + ' cannot be added.'));
              }
            }
          });

          // check processed list against sourceCodeFiles
          if (errors.length === 0) {
            _get__('debug')('executing sync tasks...');
            _get__('Promise').all(promises).then(function () {
              _this3.version = rootBlock.version;
              _get__('debug')('finished with no errors, now version ' + _this3.version + '.');
              resolve();
            }).catch(function (error) {
              _get__('debug')('error ' + error.message + '.');
              reject(error);
            });
          } else {
            _get__('debug')('errors on files ' + errors);
            var errorMessage = errors.reduce(function (message, currentError) {
              if (message) {
                return message + '\n' + currentError.message;
              } else {
                return currentError.message;
              }
            });
            reject(new Error(errorMessage));
          }
        } else if (_get__('semver').eq(rootBlock.version, _this3.version)) {
          reject(new Error('WARNING: The root block ' + rootBlock.name + ' - v' + rootBlock.version + ' is at the same version as the destination (' + _this3.name + ' - v' + _this3.version + '). So the block synchronization is omitted.'));
        } else {
          reject(new Error('WARNING: The root block ' + rootBlock.name + ' - v' + rootBlock.version + ' of type ' + rootBlock.type + ' is older than the destination (' + _this3.name + ' - v' + _this3.version + '). Block synchronization aborted.'));
        }
      });
    }
  }, {
    key: 'clean',
    value: function clean(dirtyPhs) {
      var promises = this.sourceCodeFiles.map(function (sourceCodeFile) {
        return sourceCodeFile.clean(dirtyPhs);
      });
      return _get__('Promise').all(promises);
    }
  }]);

  return SwBlock;
}();

exports.default = SwBlock;

function _getGlobalObject() {
  try {
    if (!!global) {
      return global;
    }
  } catch (e) {
    try {
      if (!!window) {
        return window;
      }
    } catch (e) {
      return this;
    }
  }
}

;
var _RewireModuleId__ = null;

function _getRewireModuleId__() {
  if (_RewireModuleId__ === null) {
    var globalVariable = _getGlobalObject();

    if (!globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__) {
      globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0;
    }

    _RewireModuleId__ = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;
  }

  return _RewireModuleId__;
}

function _getRewireRegistry__() {
  var theGlobalVariable = _getGlobalObject();

  if (!theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__) {
    theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null);
  }

  return __$$GLOBAL_REWIRE_REGISTRY__;
}

function _getRewiredData__() {
  var moduleId = _getRewireModuleId__();

  var registry = _getRewireRegistry__();

  var rewireData = registry[moduleId];

  if (!rewireData) {
    registry[moduleId] = Object.create(null);
    rewireData = registry[moduleId];
  }

  return rewireData;
}

(function registerResetAll() {
  var theGlobalVariable = _getGlobalObject();

  if (!theGlobalVariable['__rewire_reset_all__']) {
    theGlobalVariable['__rewire_reset_all__'] = function () {
      theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null);
    };
  }
})();

var INTENTIONAL_UNDEFINED = '__INTENTIONAL_UNDEFINED__';
var _RewireAPI__ = {};

(function () {
  function addPropertyToAPIObject(name, value) {
    Object.defineProperty(_RewireAPI__, name, {
      value: value,
      enumerable: false,
      configurable: true
    });
  }

  addPropertyToAPIObject('__get__', _get__);
  addPropertyToAPIObject('__GetDependency__', _get__);
  addPropertyToAPIObject('__Rewire__', _set__);
  addPropertyToAPIObject('__set__', _set__);
  addPropertyToAPIObject('__reset__', _reset__);
  addPropertyToAPIObject('__ResetDependency__', _reset__);
  addPropertyToAPIObject('__with__', _with__);
})();

function _get__(variableName) {
  var rewireData = _getRewiredData__();

  if (rewireData[variableName] === undefined) {
    return _get_original__(variableName);
  } else {
    var value = rewireData[variableName];

    if (value === INTENTIONAL_UNDEFINED) {
      return undefined;
    } else {
      return value;
    }
  }
}

function _get_original__(variableName) {
  switch (variableName) {
    case 'SourceCodeFile':
      return _geneJs.SourceCodeFile;

    case 'Promise':
      return _promise2.default;

    case 'debug':
      return debug;

    case 'semver':
      return _semver2.default;

    case 'path':
      return _path2.default;
  }

  return undefined;
}

function _assign__(variableName, value) {
  var rewireData = _getRewiredData__();

  if (rewireData[variableName] === undefined) {
    return _set_original__(variableName, value);
  } else {
    return rewireData[variableName] = value;
  }
}

function _set_original__(variableName, _value) {
  switch (variableName) {}

  return undefined;
}

function _update_operation__(operation, variableName, prefix) {
  var oldValue = _get__(variableName);

  var newValue = operation === '++' ? oldValue + 1 : oldValue - 1;

  _assign__(variableName, newValue);

  return prefix ? newValue : oldValue;
}

function _set__(variableName, value) {
  var rewireData = _getRewiredData__();

  if ((typeof variableName === 'undefined' ? 'undefined' : _typeof(variableName)) === 'object') {
    Object.keys(variableName).forEach(function (name) {
      rewireData[name] = variableName[name];
    });
  } else {
    if (value === undefined) {
      rewireData[variableName] = INTENTIONAL_UNDEFINED;
    } else {
      rewireData[variableName] = value;
    }

    return function () {
      _reset__(variableName);
    };
  }
}

function _reset__(variableName) {
  var rewireData = _getRewiredData__();

  delete rewireData[variableName];

  if (Object.keys(rewireData).length == 0) {
    delete _getRewireRegistry__()[_getRewireModuleId__];
  }

  ;
}

function _with__(object) {
  var rewireData = _getRewiredData__();

  var rewiredVariableNames = Object.keys(object);
  var previousValues = {};

  function reset() {
    rewiredVariableNames.forEach(function (variableName) {
      rewireData[variableName] = previousValues[variableName];
    });
  }

  return function (callback) {
    rewiredVariableNames.forEach(function (variableName) {
      previousValues[variableName] = rewireData[variableName];
      rewireData[variableName] = object[variableName];
    });
    var result = callback();

    if (!!result && typeof result.then == 'function') {
      result.then(reset).catch(reset);
    } else {
      reset();
    }

    return result;
  };
}

var _typeOfOriginalExport = typeof SwBlock === 'undefined' ? 'undefined' : _typeof(SwBlock);

function addNonEnumerableProperty(name, value) {
  Object.defineProperty(SwBlock, name, {
    value: value,
    enumerable: false,
    configurable: true
  });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(SwBlock)) {
  addNonEnumerableProperty('__get__', _get__);
  addNonEnumerableProperty('__GetDependency__', _get__);
  addNonEnumerableProperty('__Rewire__', _set__);
  addNonEnumerableProperty('__set__', _set__);
  addNonEnumerableProperty('__reset__', _reset__);
  addNonEnumerableProperty('__ResetDependency__', _reset__);
  addNonEnumerableProperty('__with__', _with__);
  addNonEnumerableProperty('__RewireAPI__', _RewireAPI__);
}

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;