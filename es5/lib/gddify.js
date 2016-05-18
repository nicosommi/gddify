"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _clone = require("clone");

var _clone2 = _interopRequireDefault(_clone);

var _geneJs = require("gene-js");

var _geneJs2 = _interopRequireDefault(_geneJs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var addGene = Symbol("addGene");

var Gddify = function () {
	function Gddify() {
		_classCallCheck(this, Gddify);

		this.genes = [];
	}

	_createClass(Gddify, [{
		key: addGene,
		value: function value(source, growth, clean, optionsObject) {
			var options = _get__("clone")(optionsObject, false);
			this.genes.push({
				source: source,
				growth: growth,
				clean: clean,
				options: options
			});
		}
	}, {
		key: "add",
		value: function add(source, growth, clean, optionsObject) {
			var _this = this;

			if (Array.isArray(source)) {
				source.forEach(function (sourceGene) {
					var geneFileName = _get__("path").basename(sourceGene);
					_this[addGene](sourceGene, growth + "/" + geneFileName, clean + "/" + geneFileName, optionsObject);
				});
			} else {
				this[addGene](source, growth, clean, optionsObject);
			}
		}
	}, {
		key: "generate",
		value: function generate() {
			return Promise.all(this.genes.map(function (gene) {
				return new Promise(function (resolve, reject) {
					var options = gene.options;
					if (!options.replacements) {
						options.replacements = {};
					}

					if (!options.ignoringStamps) {
						options.ignoringStamps = [];
					}

					var ph = _get__("Ph").refresh(gene.growth);

					if (options.delimiters) {
						ph.withThisDelimiters(options.delimiters.start, options.delimiters.end);
					}

					ph.replacing(options.replacements).ignoringStamps(options.ignoringStamps).with(gene.source, function (errors) {
						if (errors) {
							reject(errors);
						} else {
							resolve();
						}
					});
				});
			}));
		}
	}, {
		key: "clean",
		value: function clean() {
			return Promise.all(this.genes.map(function (gene) {
				return new Promise(function (resolve, reject) {
					var options = gene.options;
					var ph = _get__("Ph").using(gene.growth);

					if (options.delimiters) {
						ph.withThisDelimiters(options.delimiters.start, options.delimiters.end);
					}

					ph.cleanTo(gene.clean, function (errors) {
						if (errors) {
							reject(errors);
						} else {
							resolve();
						}
					});
				});
			}));
		}
	}]);

	return Gddify;
}();

exports.default = Gddify;
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
		case "clone":
			return _clone2.default;

		case "path":
			return _path2.default;

		case "Ph":
			return _geneJs2.default;
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

var _typeOfOriginalExport = typeof Gddify === "undefined" ? "undefined" : _typeof(Gddify);

function addNonEnumerableProperty(name, value) {
	Object.defineProperty(Gddify, name, {
		value: value,
		enumerable: false,
		configurable: true
	});
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(Gddify)) {
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