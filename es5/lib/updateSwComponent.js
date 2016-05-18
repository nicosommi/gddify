"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-console */


var _geneJs = require("gene-js");

var _semver = require("semver");

var _semver2 = _interopRequireDefault(_semver);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _promise = require("./promise.js");

var _promise2 = _interopRequireDefault(_promise);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var writeFile = _get__("Promise").promisify(_get__("fs").writeFile);

var buildSwComponent = Symbol("buildSwComponent");
var getMinifiedSwComponent = Symbol("getMinifiedSwComponent");

var UpdateSwComponent = function () {
	function UpdateSwComponent(targetSwComponentJson, basePath, cleanPath) {
		_classCallCheck(this, UpdateSwComponent);

		if (!targetSwComponentJson.options) {
			targetSwComponentJson.options = {};
		}

		targetSwComponentJson.options.basePath = basePath;
		targetSwComponentJson.options.cleanPath = cleanPath;
		this.targetSwComponent = this[buildSwComponent](targetSwComponentJson);
	}

	_createClass(UpdateSwComponent, [{
		key: buildSwComponent,
		value: function value(jsonObject) {
			var result = new (_get__("SwComponent"))(jsonObject.name, jsonObject.type, jsonObject.options);
			result.addSwBlocks(jsonObject.swBlocks);
			return result;
		}
	}, {
		key: getMinifiedSwComponent,
		value: function value(component, name, type) {
			var result = [];
			if (name) {
				component.swBlocks = component.swBlocks.filter(function (swBlock) {
					return swBlock.name === name;
				});
			}

			if (type) {
				component.swBlocks = component.swBlocks.filter(function (swBlock) {
					return swBlock.type === type;
				});
			}

			component.swBlocks.forEach(function (swBlock) {
				var index = void 0;
				var found = result.find(function (targetBlock, i) {
					index = i;
					return targetBlock.type === swBlock.type;
				});
				if (!found) {
					result.push(swBlock);
				} else if (_get__("semver").gt(swBlock.version, found.version)) {
					result.splice(index, 1, swBlock);
				}
			});
			return result;
		}
	}, {
		key: "update",
		value: function update(name, type) {
			var _this = this;

			console.log(_get__("chalk").magenta("Beginning update..."));
			var sources = this.targetSwComponent.options.sources;
			sources.push("./");

			return _get__("Promise").all(sources.map(function (source) {
				console.log(_get__("chalk").magenta("Reading from " + source + "..."));
				return _this.synchronize(source, name, type);
			})).then(function () {
				console.log(_get__("chalk").green("Everything updated from all sources."));
			});
		}
	}, {
		key: "synchronize",
		value: function synchronize(sourcePath, name, type) {
			var _this2 = this;

			console.log(_get__("chalk").magenta("Generation begins..."));
			var rootBasePath = this.targetSwComponent.options.basePath + "/" + sourcePath;
			var rootSwComponentJson = require(_get__("path").normalize(rootBasePath + "/swComponent.json"));
			rootSwComponentJson.options.basePath = rootBasePath;

			console.log(_get__("chalk").magenta("Synchronization begins..."));
			return this.synchronizeWith(sourcePath, rootSwComponentJson, name, type).then(function (newJson) {
				console.log(_get__("chalk").magenta("Writing configuration..."));
				return _get__("writeFile")(_get__("path").normalize(_this2.targetSwComponent.options.basePath + "/swComponent.json"), JSON.stringify(newJson, null, "\t")).then(function () {
					console.log(_get__("chalk").green("All done."));
					return _get__("Promise").resolve();
				});
			}, function (error) {
				var message = error.message || error;
				console.log(_get__("chalk").red("ERROR: " + message));
				return _get__("Promise").resolve();
			});
		}
	}, {
		key: "synchronizeWith",
		value: function synchronizeWith(fromPath, rootSwComponentJson, name, type) {
			var _this3 = this;

			console.log(_get__("chalk").magenta("building objects and picking newer blocks"));
			var rootSwComponent = this[buildSwComponent](rootSwComponentJson);
			var newerBlocks = this[getMinifiedSwComponent](rootSwComponent, name, type);

			console.log(_get__("chalk").magenta("synchronizing old blocks"));
			return _get__("Promise").map(newerBlocks, function (swBlock) {
				console.log(_get__("chalk").green("About to update block " + swBlock.type + " to version " + swBlock.version + "... "));
				var syncPromise = _this3.targetSwComponent.synchronizeWith(swBlock);
				return _get__("Promise").resolve(syncPromise).reflect();
			}, { concurrency: 1 }).then(function (inspections) {
				var errorCount = 0;
				inspections.forEach(function (inspection) {
					if (!inspection.isFulfilled()) {
						errorCount++;
						console.log(_get__("chalk").yellow(inspection.reason()));
					}
				});
				if (errorCount) {
					return _get__("Promise").reject(new Error("Error/Warnings occurred during synchronization."));
				} else {
					console.log(_get__("chalk").green("Component " + _this3.targetSwComponent.name + " updated."));
					console.log(_get__("chalk").magenta("Adding the new source..."));
					if (!_this3.targetSwComponent.options.sources) {
						_this3.targetSwComponent.options.sources = [fromPath];
					} else {
						var existingSource = _this3.targetSwComponent.options.sources.find(function (currentSource) {
							return currentSource === fromPath;
						});
						if (!existingSource) {
							_this3.targetSwComponent.options.sources.push(fromPath);
						}
					}
					_this3.targetSwComponent.options.sources = _this3.targetSwComponent.options.sources;
					return _get__("Promise").resolve(_this3.targetSwComponent);
				}
			});
		}
	}, {
		key: "clean",
		value: function clean(dirtyPhs) {
			return this.targetSwComponent.clean(dirtyPhs);
		}
	}]);

	return UpdateSwComponent;
}();

exports.default = UpdateSwComponent;
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

		case "SwComponent":
			return _geneJs.SwComponent;

		case "semver":
			return _semver2.default;

		case "chalk":
			return _chalk2.default;

		case "path":
			return _path2.default;

		case "writeFile":
			return writeFile;
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

var _typeOfOriginalExport = typeof UpdateSwComponent === "undefined" ? "undefined" : _typeof(UpdateSwComponent);

function addNonEnumerableProperty(name, value) {
	Object.defineProperty(UpdateSwComponent, name, {
		value: value,
		enumerable: false,
		configurable: true
	});
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(UpdateSwComponent)) {
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