'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _incognito = require('incognito');

var _incognito2 = _interopRequireDefault(_incognito);

var _geneJs = require('gene-js');

var _geneJs2 = _interopRequireDefault(_geneJs);

var _flowsync = require('flowsync');

var _flowsync2 = _interopRequireDefault(_flowsync);

var _promise = require('./promise.js');

var _promise2 = _interopRequireDefault(_promise);

var _file = require('./file.js');

var _file2 = _interopRequireDefault(_file);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bag = function () {
  function Bag(name) {
    _classCallCheck(this, Bag);

    _get__('_')(this).name = name;
    _get__('_')(this).files = new Map([]);
  }

  _createClass(Bag, [{
    key: 'add',
    value: function add(filePath, cleanFilePath) {
      var file = new (_get__('File'))(filePath, cleanFilePath);
      _get__('_')(this).files.set(filePath, file);
      return file;
    }
  }, {
    key: 'delete',
    value: function _delete(filePath) {
      _get__('_')(this).files.delete(filePath);
    }
  }, {
    key: 'quickGenerate',
    value: function quickGenerate(root, target, options) {
      if (!options) {
        options = {};
      }

      return new (_get__('Promise'))(function (resolve, reject) {
        if (!options.replacements) {
          options.replacements = {};
        }

        if (!options.ignoringStamps) {
          options.ignoringStamps = [];
        }

        var ph = _get__('Ph').refresh(target);

        if (options.delimiters) {
          ph.withThisDelimiters(options.delimiters.start, options.delimiters.end);
        }

        ph.replacing(options.replacements).ignoringStamps(options.ignoringStamps).with(root, function (errors) {
          if (errors) {
            reject(errors);
          } else {
            resolve();
          }
        });
      });
    }
  }, {
    key: 'quickClean',
    value: function quickClean(root, target, options) {
      if (!options) {
        options = {};
      }

      return new (_get__('Promise'))(function (resolve, reject) {
        if (!options.replacements) {
          options.replacements = {};
        }

        if (!options.ignoringStamps) {
          options.ignoringStamps = [];
        }

        var ph = _get__('Ph').using(root);

        if (options.delimiters) {
          ph.withThisDelimiters(options.delimiters.start, options.delimiters.end);
        }

        ph.cleanTo(target, function (errors) {
          if (errors) {
            reject(errors);
          } else {
            resolve();
          }
        });
      });
    }
  }, {
    key: 'generate',
    value: function generate(callback) {
      var _this = this;

      _get__('flowsync').eachSeries(Array.from(this.files), function (fileEntry, nextFile) {
        var filePath = fileEntry[0];
        var fileObject = fileEntry[1];
        _get__('Ph').refresh(filePath).replacing(fileObject.replacements).ignoringStamps(fileObject.ignoredStamps).with(_this.root, function () {
          nextFile();
        });
      }, function () {
        callback();
      });
    }
  }, {
    key: 'clean',
    value: function clean(callback) {
      _get__('flowsync').eachSeries(Array.from(this.files), function (fileEntry, nextFile) {
        var filePath = fileEntry[0];
        var fileObject = fileEntry[1];
        _get__('Ph').using(filePath).cleanTo(fileObject.cleanFilePath, function () {
          nextFile();
        });
      }, function () {
        callback();
      });
    }
  }, {
    key: 'root',
    get: function get() {
      return _get__('_')(this).root;
    },
    set: function set(value) {
      _get__('_')(this).root = value;
    }
  }, {
    key: 'files',
    get: function get() {
      return _get__('_')(this).files;
    }
  }, {
    key: 'name',
    get: function get() {
      return _get__('_')(this).name;
    }
  }]);

  return Bag;
}();

exports.default = Bag;

var _RewiredData__ = Object.create(null);

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
  if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
    return _get_original__(variableName);
  } else {
    var value = _RewiredData__[variableName];

    if (value === INTENTIONAL_UNDEFINED) {
      return undefined;
    } else {
      return value;
    }
  }
}

function _get_original__(variableName) {
  switch (variableName) {
    case '_':
      return _incognito2.default;

    case 'File':
      return _file2.default;

    case 'Promise':
      return _promise2.default;

    case 'Ph':
      return _geneJs2.default;

    case 'flowsync':
      return _flowsync2.default;
  }

  return undefined;
}

function _assign__(variableName, value) {
  if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
    return _set_original__(variableName, value);
  } else {
    return _RewiredData__[variableName] = value;
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
  if ((typeof variableName === 'undefined' ? 'undefined' : _typeof(variableName)) === 'object') {
    Object.keys(variableName).forEach(function (name) {
      _RewiredData__[name] = variableName[name];
    });
  } else {
    if (value === undefined) {
      _RewiredData__[variableName] = INTENTIONAL_UNDEFINED;
    } else {
      _RewiredData__[variableName] = value;
    }

    return function () {
      _reset__(variableName);
    };
  }
}

function _reset__(variableName) {
  delete _RewiredData__[variableName];
}

function _with__(object) {
  var rewiredVariableNames = Object.keys(object);
  var previousValues = {};

  function reset() {
    rewiredVariableNames.forEach(function (variableName) {
      _RewiredData__[variableName] = previousValues[variableName];
    });
  }

  return function (callback) {
    rewiredVariableNames.forEach(function (variableName) {
      previousValues[variableName] = _RewiredData__[variableName];
      _RewiredData__[variableName] = object[variableName];
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

var _typeOfOriginalExport = typeof Bag === 'undefined' ? 'undefined' : _typeof(Bag);

function addNonEnumerableProperty(name, value) {
  Object.defineProperty(Bag, name, {
    value: value,
    enumerable: false,
    configurable: true
  });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(Bag)) {
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