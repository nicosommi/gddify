'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-console */


var _swBlock = require('./swBlock.js');

var _swBlock2 = _interopRequireDefault(_swBlock);

var _promise = require('./promise.js');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('nicosommi.gddify.swComponent');

var SwComponent = function () {
  function SwComponent(name, type, options) {
    _classCallCheck(this, SwComponent);

    this.name = name;
    this.type = type;
    this.options = options;
    this.swBlocks = [];
  }

  _createClass(SwComponent, [{
    key: 'toJSON',
    value: function toJSON() {
      var newOptions = this.options;
      delete newOptions.basePath;
      var newBlocks = [];
      if (this.swBlocks) {
        newBlocks = this.swBlocks.map(function (_ref) {
          var name = _ref.name,
              type = _ref.type,
              version = _ref.version,
              options = _ref.options,
              sourceCodeFiles = _ref.sourceCodeFiles;

          var newSourceCodeFiles = [];
          if (sourceCodeFiles) {
            newSourceCodeFiles = sourceCodeFiles.map(function (_ref2) {
              var name = _ref2.name,
                  path = _ref2.path,
                  options = _ref2.options;

              var newOptions = options;
              delete newOptions.basePath;
              return {
                name: name, path: path, options: newOptions
              };
            });
          }

          var newOptions = options;
          delete newOptions.basePath;
          return {
            name: name,
            type: type,
            version: version,
            options: newOptions,
            sourceCodeFiles: newSourceCodeFiles
          };
        });
      }

      return {
        name: this.name,
        type: this.type,
        options: newOptions,
        swBlocks: newBlocks
      };
    }
  }, {
    key: 'addSwBlock',
    value: function addSwBlock(swBlock) {
      var newOptions = Object.assign({}, swBlock.options, this.options); // passing options down through
      var newSwBlock = new (_get__('SwBlock'))(swBlock.name, swBlock.type, swBlock.version, newOptions);
      newSwBlock.addSourceCodeFiles(swBlock.sourceCodeFiles);
      this.swBlocks.push(newSwBlock);
      return newSwBlock;
    }
  }, {
    key: 'addSwBlocks',
    value: function addSwBlocks(swBlocks) {
      var _this = this;

      swBlocks.forEach(function (swBlock) {
        return _this.addSwBlock(swBlock);
      });
    }
  }, {
    key: 'getMeta',
    value: function getMeta(name, type) {
      var _this2 = this;

      return _get__('Promise').all(this.swBlocks.filter(function (swBlock) {
        return (!name || name === swBlock.name) && (!type || type === swBlock.type);
      }).map(function (swBlock) {
        return swBlock.getMeta();
      })).then(function (results) {
        return _get__('Promise').resolve({
          name: _this2.name,
          type: _this2.type,
          swBlocks: results
        });
      });
    }
  }, {
    key: 'setMeta',
    value: function setMeta(metaObject) {
      return _get__('Promise').all(metaObject.swBlocks.map(function (swBlock) {
        var block = new (_get__('SwBlock'))(swBlock.name, swBlock.type);
        return block.setMeta(swBlock);
      }));
    }
  }, {
    key: 'synchronizeWith',
    value: function synchronizeWith(rootBlock) {
      _get__('debug')('synchronize component started');
      var promise = void 0;

      // find this.swBlock
      var matchingSwBlocks = this.swBlocks.filter(function (swBlock) {
        return swBlock.type === rootBlock.type;
      });
      if (matchingSwBlocks && matchingSwBlocks.length > 0) {
        _get__('debug')('going through existing blocks');
        promise = _get__('Promise').all(matchingSwBlocks.map(function (matchingSwBlock) {
          return matchingSwBlock.synchronizeWith(rootBlock);
        }));
      } else {
        _get__('debug')('creating a new block named ' + rootBlock.name + ' of type ' + rootBlock.type);
        var newOptions = Object.assign({}, this.options, rootBlock.options);
        var newSwBlock = this.addSwBlock({
          name: rootBlock.name,
          type: rootBlock.type,
          version: '0.0.0',
          options: newOptions,
          sourceCodeFiles: []
        });
        promise = newSwBlock.synchronizeWith(rootBlock);
      }

      return promise;
    }
  }, {
    key: 'clean',
    value: function clean(dirtyPhs) {
      var promises = this.swBlocks.map(function (swBlock) {
        return swBlock.clean(dirtyPhs);
      });
      return _get__('Promise').all(promises);
    }
  }]);

  return SwComponent;
}();

exports.default = SwComponent;

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
    case 'SwBlock':
      return _swBlock2.default;

    case 'Promise':
      return _promise2.default;

    case 'debug':
      return debug;
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

var _typeOfOriginalExport = typeof SwComponent === 'undefined' ? 'undefined' : _typeof(SwComponent);

function addNonEnumerableProperty(name, value) {
  Object.defineProperty(SwComponent, name, {
    value: value,
    enumerable: false,
    configurable: true
  });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(SwComponent)) {
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