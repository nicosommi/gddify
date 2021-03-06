#! /usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
/* eslint-disable no-console */


exports.default = invoke;

var _yargs = require('yargs');

var _liftoff = require('liftoff');

var _liftoff2 = _interopRequireDefault(_liftoff);

var _updateSwComponent = require('../lib/updateSwComponent.js');

var _updateSwComponent2 = _interopRequireDefault(_updateSwComponent);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _promise = require('../lib/promise.js');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('nicosommi.gddify.cli');
var stat = _get__('Promise').promisify(_get__('fs').stat);
var outputJson = _get__('Promise').promisify(_get__('fs').outputJson);

var Gddify = new (_get__('Liftoff'))({
  cwd: _get__('argv').cwd,
  processTitle: 'gddify',
  moduleName: 'gddify',
  configName: 'swComponent.json'
});

_get__('Gddify').launch({}, _get__('invoke'));

function invoke(env) {
  // console.log("invoke reached", { env, argv, path: `${argv.cwd}/${argv.from}/swComponent.json` })
  var command = void 0;
  if (_get__('argv')._.length > 0) {
    command = _get__('argv')._[0];
  } else {
    command = 'help';
  }

  var cwd = require('process').cwd();

  var targetSwComponentPath = _get__('path').normalize(cwd + '/swComponent.json');
  var initialData = { name: 'default', type: 'default', options: { sources: [], basePath: env.cwd, cleanPath: '.gdd-clean' }, swBlocks: [] };

  console.log(_get__('chalk').magenta('Command execution begins...'));

  return _get__('stat')(targetSwComponentPath).catch(function () {
    return _get__('outputJson')(targetSwComponentPath, initialData);
  }).then(function () {
    _get__('debug')('Target file ensured...');
    var targetSwComponentJson = require(targetSwComponentPath);
    // machine switch or folder change is possible
    if (!targetSwComponentJson.options) {
      targetSwComponentJson.options = {};
    }
    targetSwComponentJson.options.basePath = cwd;
    var updateSwComponent = new (_get__('UpdateSwComponent'))(targetSwComponentJson);

    var commandPromise = _get__('Promise').resolve();

    switch (command) {
      case 'replicate':
        commandPromise = updateSwComponent.replicate(_get__('argv').name, _get__('argv').type, _get__('argv')['target-name'], _get__('argv')['path-pattern'], _get__('argv')['path-value']);
        break;
      case 'generate':
        commandPromise = updateSwComponent.synchronize(_get__('argv').from, _get__('argv').name, _get__('argv').type, _get__('argv')['target-name']);
        break;
      case 'update':
        commandPromise = updateSwComponent.update(_get__('argv').name, _get__('argv').type);
        break;
      case 'refresh':
        commandPromise = updateSwComponent.refresh(_get__('argv').name, _get__('argv').type);
        break;
      case 'compile':
        commandPromise = updateSwComponent.clean(['gddifyph']);
        break;
      case 'add':
        commandPromise = updateSwComponent.add(_get__('argv').glob, _get__('argv').name, _get__('argv').type);
        break;
      case 'addfile':
        commandPromise = updateSwComponent.addFile(_get__('argv').path, _get__('argv').name, _get__('argv').type);
        break;
      case 'increment':
        commandPromise = updateSwComponent.increment(_get__('argv').release, _get__('argv').name, _get__('argv').type);
        break;
      case 'jsonification':
        commandPromise = updateSwComponent.jsonification(_get__('path').normalize(env.cwd + '/' + _get__('argv').from), _get__('path').normalize(env.cwd + '/' + _get__('argv').to));
        break;
      default:
        console.log(_get__('chalk').yellow('Invalid command.\nUse gddify [replicate|generate|update|compile|refresh|add|addfile].'));
    }

    return commandPromise.then(function () {
      console.log(_get__('chalk').magenta('Done.'));
    });
  });
}

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
    case 'Promise':
      return _promise2.default;

    case 'fs':
      return _fsExtra2.default;

    case 'Liftoff':
      return _liftoff2.default;

    case 'argv':
      return _yargs.argv;

    case 'Gddify':
      return Gddify;

    case 'invoke':
      return invoke;

    case 'path':
      return _path2.default;

    case 'chalk':
      return _chalk2.default;

    case 'stat':
      return stat;

    case 'outputJson':
      return outputJson;

    case 'debug':
      return debug;

    case 'UpdateSwComponent':
      return _updateSwComponent2.default;
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

var _typeOfOriginalExport = typeof invoke === 'undefined' ? 'undefined' : _typeof(invoke);

function addNonEnumerableProperty(name, value) {
  Object.defineProperty(invoke, name, {
    value: value,
    enumerable: false,
    configurable: true
  });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(invoke)) {
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