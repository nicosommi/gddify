#! /usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
/* eslint-disable no-console */


exports.default = invoke;

var _yargs = require("yargs");

var _liftoff = require("liftoff");

var _liftoff2 = _interopRequireDefault(_liftoff);

var _updateSwComponent = require("../lib/updateSwComponent.js");

var _updateSwComponent2 = _interopRequireDefault(_updateSwComponent);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _promise = require("../lib/promise.js");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ensureFile = _get__("Promise").promisify(_get__("fs").ensureFile);

var Gddify = new (_get__("Liftoff"))({
	cwd: _get__("argv").cwd,
	processTitle: "gddify",
	moduleName: "gddify",
	configName: "swComponent.json"
});

_get__("Gddify").launch({}, _get__("invoke"));

function invoke(env) {
	// console.log("invoke reached", { env, argv, path: `${argv.cwd}/${argv.from}/swComponent.json` });
	var command = void 0;
	if (_get__("argv")._.length > 0) {
		command = _get__("argv")._[0];
	} else {
		command = "help";
	}

	var targetSwComponentPath = _get__("path").normalize(env.cwd + "/swComponent.json");
	var basePath = env.cwd;
	var cleanPath = ".gdd-clean";

	console.log(_get__("chalk").magenta("Command execution begins..."));

	_get__("ensureFile")(targetSwComponentPath).then(function () {
		console.log(_get__("chalk").magenta("Target file ensured..."));
		var targetSwComponentJson = require(targetSwComponentPath);
		var updateSwComponent = new (_get__("UpdateSwComponent"))(targetSwComponentJson, basePath, cleanPath);

		switch (command) {
			case "generate":
				updateSwComponent.synchronize(_get__("argv").from, _get__("argv").name, _get__("argv").type);
				break;
			case "update":
				updateSwComponent.update(_get__("argv").name, _get__("argv").type);
				break;
			case "compile":
				console.log(_get__("chalk").magenta("Update begins..."));
				updateSwComponent.clean(["gddifyph"]);
				break;
			default:
				console.log(_get__("chalk").red("Invalid command. Use gddify [generate|update|compile|increment]. "));
				break;
		}
	});
}
var _RewiredData__ = {};
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
	return _RewiredData__ === undefined || _RewiredData__[variableName] === undefined ? _get_original__(variableName) : _RewiredData__[variableName];
}

function _get_original__(variableName) {
	switch (variableName) {
		case "Promise":
			return _promise2.default;

		case "fs":
			return _fsExtra2.default;

		case "Liftoff":
			return _liftoff2.default;

		case "argv":
			return _yargs.argv;

		case "Gddify":
			return Gddify;

		case "invoke":
			return invoke;

		case "path":
			return _path2.default;

		case "chalk":
			return _chalk2.default;

		case "ensureFile":
			return ensureFile;

		case "UpdateSwComponent":
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
	return _RewiredData__[variableName] = value;
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

var _typeOfOriginalExport = typeof invoke === "undefined" ? "undefined" : _typeof(invoke);

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