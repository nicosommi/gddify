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

  var targetSwComponentPath = _get__('path').normalize(env.cwd + '/swComponent.json');
  var initialData = { name: 'default', type: 'default', options: { sources: [], basePath: env.cwd, cleanPath: '.gdd-clean' }, swBlocks: [] };

  console.log(_get__('chalk').magenta('Command execution begins...'));

  return _get__('stat')(targetSwComponentPath).catch(function () {
    return _get__('outputJson')(targetSwComponentPath, initialData);
  }).then(function () {
    console.log(_get__('chalk').magenta('Target file ensured...'));
    var targetSwComponentJson = require(targetSwComponentPath);
    // machine switch or folder change is possible
    targetSwComponentJson.options.basePath = env.cwd;
    var updateSwComponent = new (_get__('UpdateSwComponent'))(targetSwComponentJson);

    switch (command) {
      case 'generate':
        return updateSwComponent.synchronize(_get__('argv').from, _get__('argv').name, _get__('argv').type);
      case 'update':
        return updateSwComponent.update(_get__('argv').name, _get__('argv').type);
      case 'refresh':
        return updateSwComponent.refresh(_get__('argv').name, _get__('argv').type);
      case 'compile':
        return updateSwComponent.clean(['gddifyph']);
      case 'add':
        return updateSwComponent.add(_get__('argv').glob, _get__('argv').name, _get__('argv').type);
      case 'addfile':
        return updateSwComponent.addFile(_get__('argv').path, _get__('argv').name, _get__('argv').type);
      case 'increment':
        return updateSwComponent.increment(_get__('argv').release, _get__('argv').name, _get__('argv').type);
      case 'jsonification':
        return updateSwComponent.jsonification(_get__('path').normalize(env.cwd + '/' + _get__('argv').from), _get__('path').normalize(env.cwd + '/' + _get__('argv').to));
      default:
        console.log(_get__('chalk').yellow('Invalid command. Use gddify [generate|update|compile|refresh|add|addfile].'));
    }
  });
}

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

    case 'UpdateSwComponent':
      return _updateSwComponent2.default;
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