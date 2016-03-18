"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _clone = require("clone");

var _clone2 = _interopRequireDefault(_clone);

var _placeholderJs = require("placeholder-js");

var _placeholderJs2 = _interopRequireDefault(_placeholderJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Godify = function () {
	function Godify() {
		_classCallCheck(this, Godify);

		(0, _incognito2.default)(this).genes = [];
	}

	_createClass(Godify, [{
		key: "add",
		value: function add(source, growth, clean, optionsObject) {
			var options = (0, _clone2.default)(optionsObject, false);
			(0, _incognito2.default)(this).genes.push({
				source: source,
				growth: growth,
				clean: clean,
				options: options
			});
		}
	}, {
		key: "generate",
		value: function generate() {
			return Promise.all((0, _incognito2.default)(this).genes.map(function (gene) {
				return new Promise(function (resolve, reject) {
					var options = gene.options;
					if (!options.replacements) {
						options.replacements = {};
					}

					if (!options.ignoringStamps) {
						options.ignoringStamps = [];
					}

					var ph = _placeholderJs2.default.refresh(gene.growth);

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
			return Promise.all((0, _incognito2.default)(this).genes.map(function (gene) {
				return new Promise(function (resolve, reject) {
					var options = gene.options;
					var ph = _placeholderJs2.default.using(gene.growth);

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

	return Godify;
}();

exports.default = Godify;